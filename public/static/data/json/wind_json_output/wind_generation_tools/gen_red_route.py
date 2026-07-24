import json
import math
from pathlib import Path

# Read original data
data_dir = Path(__file__).parent
input_file = data_dir / 'wind3d2_radar_taipei.json'

with open(input_file, 'r', encoding='utf-8') as f:
    orig_data = json.load(f)

header = orig_data['header']
nx, ny, nz = header['nx'], header['ny'], header['nz']
lo1, lo2, la1, la2 = header['lo1'], header['lo2'], header['la1'], header['la2']
dx, dy = header['dx'], header['dy']

print(f"Original data: {nx}x{ny}x{nz}")
print()

def create_empty_data():
    return {
        'u': [0.0] * (nx * ny * nz),
        'v': [0.0] * (nx * ny * nz),
        'w': [0.0] * (nx * ny * nz)
    }

def idx(z, y, x):
    return z * ny * nx + y * nx + x

def save_wind_data(data, filename, comment=""):
    output_data = {
        'header': {
            **header,
            'comment': comment
        },
        'data': data
    }
    
    output_file = data_dir / filename
    with open(output_file, 'w', encoding='utf-8') as f:
        json.dump(output_data, f, ensure_ascii=False)
    
    count = 0
    for u, v in zip(data['u'], data['v']):
        if abs(u) > 0.01 or abs(v) > 0.01:
            count += 1
    print(f"  {filename}: {count}/{len(data['u'])} points ({count/len(data['u'])*100:.1f}%)")

def generate_red_route_from_image():
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u_total = 0.0
                v_total = 0.0
                
                # Part 1: Left side - snake entry
                if x < 6:
                    path_y1 = 12.0 - 2.0 * math.sin(x * 0.5)
                    dist1 = abs(y - path_y1)
                    if dist1 < 2.2:
                        factor1 = math.exp(-dist1*dist1 * 0.28)
                        
                        dir_x = 0.9
                        dir_y = -0.4
                        mag1 = math.sqrt(dir_x*dir_x + dir_y*dir_y)
                        if mag1 > 0:
                            dir_x /= mag1
                            dir_y /= mag1
                        
                        u_total += dir_x * 11.5 * factor1
                        v_total += dir_y * 11.5 * factor1
                
                # Part 2: Big downward curve
                if 4 < x < 11:
                    curve_y = 9.0 + 6.0 * math.sin((x - 4) * 0.45)
                    dist2 = abs(y - curve_y)
                    if dist2 < 2.6:
                        factor2 = math.exp(-dist2*dist2 * 0.24)
                        
                        # Direction changes from up to down
                        t = (x - 4) / 7.0
                        dir_x = 1.0
                        dir_y = 0.4 - 1.2 * t
                        mag2 = math.sqrt(dir_x*dir_x + dir_y*dir_y)
                        if mag2 > 0:
                            dir_x /= mag2
                            dir_y /= mag2
                        
                        u_total += dir_x * 12.0 * factor2
                        v_total += dir_y * 12.0 * factor2
                
                # Big spiral vortex on the LEFT
                spiral1_x, spiral1_y = 8, 10
                s1_dist = math.sqrt((x-spiral1_x)*(x-spiral1_x) + (y-spiral1_y)*(y-spiral1_y))
                if s1_dist < 4.2:
                    s1_factor = math.exp(-s1_dist*s1_dist * 0.07)
                    
                    if s1_dist > 0.5:
                        # Spiral rotation
                        s1_u = -(y - spiral1_y)/s1_dist * 13.5 * s1_factor
                        s1_v = (x - spiral1_x)/s1_dist * 13.5 * s1_factor
                        
                        # Add inward radial component to spiral
                        s1_u += -(x-spiral1_x)/s1_dist * 4.0 * s1_factor
                        s1_v += -(y-spiral1_y)/s1_dist * 4.0 * s1_factor
                        
                        u_total += s1_u
                        v_total += s1_v
                
                # Part 3: Continuing from spiral
                if 9 < x < 14:
                    path3_y = 8.5 + 1.5 * math.sin((x-9) * 0.55)
                    dist3 = abs(y - path3_y)
                    if dist3 < 2.3:
                        factor3 = math.exp(-dist3*dist3 * 0.26)
                        
                        dir_x = 1.0
                        dir_y = 0.1
                        u_total += dir_x * 11.0 * factor3
                        v_total += dir_y * 11.0 * factor3
                
                # Larger spiral vortex on the RIGHT
                spiral2_x, spiral2_y = 15, 7
                s2_dist = math.sqrt((x-spiral2_x)*(x-spiral2_x) + (y-spiral2_y)*(y-spiral2_y))
                if s2_dist < 5.0:
                    s2_factor = math.exp(-s2_dist*s2_dist * 0.055)
                    
                    if s2_dist > 0.5:
                        # Counter-rotating spiral
                        s2_u = (y - spiral2_y)/s2_dist * 15.0 * s2_factor
                        s2_v = -(x - spiral2_x)/s2_dist * 15.0 * s2_factor
                        
                        # Radial outward component
                        s2_u += (x-spiral2_x)/s2_dist * 3.5 * s2_factor
                        s2_v += (y-spiral2_y)/s2_dist * 3.5 * s2_factor
                        
                        u_total += s2_u
                        v_total += s2_v
                
                # Part 4: Exiting from right spiral, going down and right
                if 15 < x < 20:
                    path4_y = 8.0 + 4.0 * ((x - 15) / 5.0)
                    dist4 = abs(y - path4_y)
                    if dist4 < 2.4:
                        factor4 = math.exp(-dist4*dist4 * 0.25)
                        
                        dir_x = 0.7
                        dir_y = 0.9
                        mag4 = math.sqrt(dir_x*dir_x + dir_y*dir_y)
                        if mag4 > 0:
                            dir_x /= mag4
                            dir_y /= mag4
                        
                        u_total += dir_x * 10.5 * factor4
                        v_total += dir_y * 10.5 * factor4
                
                # Part 5: Bottom horizontal snake
                if y > 11:
                    path5_x = 4.0 + 5.0 * math.sin((y - 11) * 0.35)
                    dist5 = abs(x - path5_x)
                    if dist5 < 2.6:
                        factor5 = math.exp(-dist5*dist5 * 0.22)
                        
                        dir_x = 0.9
                        dir_y = 0.6
                        mag5 = math.sqrt(dir_x*dir_x + dir_y*dir_y)
                        if mag5 > 0:
                            dir_x /= mag5
                            dir_y /= mag5
                        
                        u_total += dir_x * 10.0 * factor5
                        v_total += dir_y * 10.0 * factor5
                
                data['u'][i] = u_total
                data['v'][i] = v_total
                data['w'][i] = 0.0
    
    save_wind_data(data, 'wind_red_route_v1.json', 'Based on user-drawn red route with double spirals')

print("Generating wind data based on the red route...")
print()

generate_red_route_from_image()

print()
print("Generated!")
print()
print("File: wind_red_route_v1.json")
