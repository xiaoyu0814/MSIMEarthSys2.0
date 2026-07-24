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

def generate_red_route_v3():
    """Based on v1 structure, but clearer all routes"""
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u_total = 0.0
                v_total = 0.0
                
                # --- LEFT SNAKE PATH ---
                if x < 7:
                    path1_y = 11.0 + 3.2 * math.sin(x * 0.42) + 1.5 * math.sin(x * 0.88)
                    dist1 = abs(y - path1_y)
                    if dist1 < 2.5:
                        factor1 = math.exp(-dist1*dist1 * 0.25)
                        
                        slope1 = 3.2 * 0.42 * math.cos(x * 0.42) + 1.5 * 0.88 * math.cos(x * 0.88)
                        dir1_x = 0.95
                        dir1_y = 0.15 * slope1
                        mag1 = math.sqrt(dir1_x*dir1_x + dir1_y*dir1_y)
                        if mag1 > 0:
                            dir1_x /= mag1
                            dir1_y /= mag1
                        
                        u_total += dir1_x * 12.0 * factor1
                        v_total += dir1_y * 12.0 * factor1
                
                # --- BIG DOWNWARD CURVE ---
                if 5 < x < 10:
                    curve2_y = 7.5 + 4.5 * math.sin((x - 5) * 0.65)
                    dist2 = abs(y - curve2_y)
                    if dist2 < 2.7:
                        factor2 = math.exp(-dist2*dist2 * 0.22)
                        
                        t = (x - 5) / 5.0
                        dir2_x = 0.9
                        dir2_y = 0.2 - 1.0 * t
                        mag2 = math.sqrt(dir2_x*dir2_x + dir2_y*dir2_y)
                        if mag2 > 0:
                            dir2_x /= mag2
                            dir2_y /= mag2
                        
                        u_total += dir2_x * 12.5 * factor2
                        v_total += dir2_y * 12.5 * factor2
                
                # --- LEFT SPIRAL ---
                spiral1_x, spiral1_y = 8, 10
                s1_dist = math.sqrt((x-spiral1_x)*(x-spiral1_x) + (y-spiral1_y)*(y-spiral1_y))
                if s1_dist < 4.5:
                    s1_factor = math.exp(-s1_dist*s1_dist * 0.065)
                    
                    if s1_dist > 0.5:
                        s1_u = -(y - spiral1_y)/s1_dist * 14.0 * s1_factor
                        s1_v = (x - spiral1_x)/s1_dist * 14.0 * s1_factor
                        
                        s1_u += -(x-spiral1_x)/s1_dist * 5.0 * s1_factor
                        s1_v += -(y-spiral1_y)/s1_dist * 5.0 * s1_factor
                        
                        u_total += s1_u
                        v_total += s1_v
                
                # --- CONNECTOR TO RIGHT ---
                if 9 < x < 13:
                    conn3_y = 9.5 + 2.0 * math.sin((x-9) * 0.55)
                    dist3 = abs(y - conn3_y)
                    if dist3 < 2.4:
                        factor3 = math.exp(-dist3*dist3 * 0.26)
                        
                        dir3_x = 1.0
                        dir3_y = 0.05
                        u_total += dir3_x * 11.5 * factor3
                        v_total += dir3_y * 11.5 * factor3
                
                # --- BIG RIGHT SPIRAL ---
                spiral2_x, spiral2_y = 15, 7
                s2_dist = math.sqrt((x-spiral2_x)*(x-spiral2_x) + (y-spiral2_y)*(y-spiral2_y))
                if s2_dist < 5.2:
                    s2_factor = math.exp(-s2_dist*s2_dist * 0.052)
                    
                    if s2_dist > 0.5:
                        s2_u = (y - spiral2_y)/s2_dist * 15.5 * s2_factor
                        s2_v = -(x - spiral2_x)/s2_dist * 15.5 * s2_factor
                        
                        s2_u += (x-spiral2_x)/s2_dist * 4.5 * s2_factor
                        s2_v += (y-spiral2_y)/s2_dist * 4.5 * s2_factor
                        
                        u_total += s2_u
                        v_total += s2_v
                
                # --- EXIT PATH FROM RIGHT SPIRAL ---
                if 14 < x < 19:
                    exit4_y = 7.0 + 3.5 * ((x - 14) / 5.0)
                    dist4 = abs(y - exit4_y)
                    if dist4 < 2.5:
                        factor4 = math.exp(-dist4*dist4 * 0.24)
                        
                        dir4_x = 0.65
                        dir4_y = 0.85
                        mag4 = math.sqrt(dir4_x*dir4_x + dir4_y*dir4_y)
                        if mag4 > 0:
                            dir4_x /= mag4
                            dir4_y /= mag4
                        
                        u_total += dir4_x * 11.0 * factor4
                        v_total += dir4_y * 11.0 * factor4
                
                # --- BOTTOM SNAKE PATH ---
                if y > 10:
                    bottom5_x = 5.0 + 7.5 * math.sin((y - 10) * 0.35)
                    dist5 = abs(x - bottom5_x)
                    
                    if dist5 < 2.6:
                        factor5 = math.exp(-dist5*dist5 * 0.23)
                        
                        slope5 = 7.5 * 0.35 * math.cos((y - 10) * 0.35)
                        dir5_x = 0.18 * slope5
                        dir5_y = 1.0
                        mag5 = math.sqrt(dir5_x*dir5_x + dir5_y*dir5_y)
                        if mag5 > 0:
                            dir5_x /= mag5
                            dir5_y /= mag5
                        
                        u_total += dir5_x * 10.5 * factor5
                        v_total += dir5_y * 10.5 * factor5
                
                data['u'][i] = u_total
                data['v'][i] = v_total
                data['w'][i] = 0.0
    
    save_wind_data(data, 'wind_red_route_v3.json', 'V3: based on v1, clearer all routes')

print("Generating improved v3 based on v1 structure...")
print()

generate_red_route_v3()

print()
print("Generated!")
print()
print("File: wind_red_route_v3.json")
print(" (based on v1 structure, but all routes clearer)")
