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

def generate_red_route_v2():
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u_total = 0.0
                v_total = 0.0
                
                # First large spiral on LEFT
                spiral1_x, spiral1_y = 7, 6
                s1_dist = math.sqrt((x-spiral1_x)*(x-spiral1_x) + (y-spiral1_y)*(y-spiral1_y))
                if s1_dist < 4.8:
                    s1_factor = math.exp(-s1_dist*s1_dist * 0.06)
                    
                    if s1_dist > 0.5:
                        s1_u = -(y - spiral1_y)/s1_dist * 14.5 * s1_factor
                        s1_v = (x - spiral1_x)/s1_dist * 14.5 * s1_factor
                        
                        s1_u += -(x-spiral1_x)/s1_dist * 4.5 * s1_factor
                        s1_v += -(y-spiral1_y)/s1_dist * 4.5 * s1_factor
                        
                        u_total += s1_u
                        v_total += s1_v
                
                # Connector path from left spiral to right
                if 5 < x < 14:
                    conn_y = 10.0 + 2.8 * math.sin((x-5) * 0.38)
                    conn_dist = abs(y - conn_y)
                    if conn_dist < 2.4:
                        conn_factor = math.exp(-conn_dist*conn_dist * 0.25)
                        
                        t = (x-5)/9.0
                        dir_x = 0.95
                        dir_y = 0.15 + 0.5 * math.sin(t*2.0)
                        conn_mag = math.sqrt(dir_x*dir_x + dir_y*dir_y)
                        if conn_mag > 0:
                            dir_x /= conn_mag
                            dir_y /= conn_mag
                        
                        u_total += dir_x * 11.5 * conn_factor
                        v_total += dir_y * 11.5 * conn_factor
                
                # Larger spiral on RIGHT
                spiral2_x, spiral2_y = 16, 5
                s2_dist = math.sqrt((x-spiral2_x)*(x-spiral2_x) + (y-spiral2_y)*(y-spiral2_y))
                if s2_dist < 5.5:
                    s2_factor = math.exp(-s2_dist*s2_dist * 0.05)
                    
                    if s2_dist > 0.5:
                        s2_u = (y - spiral2_y)/s2_dist * 16.0 * s2_factor
                        s2_v = -(x - spiral2_x)/s2_dist * 16.0 * s2_factor
                        
                        s2_u += (x-spiral2_x)/s2_dist * 4.0 * s2_factor
                        s2_v += (y-spiral2_y)/s2_dist * 4.0 * s2_factor
                        
                        u_total += s2_u
                        v_total += s2_v
                
                # Winding path at the BOTTOM
                if y > 10:
                    bottom_path_x = 3.0 + 8.0 * math.sin((y - 10) * 0.32)
                    bottom_dist = abs(x - bottom_path_x)
                    
                    if bottom_dist < 2.6:
                        bottom_factor = math.exp(-bottom_dist*bottom_dist * 0.24)
                        
                        path_slope = 8.0 * 0.32 * math.cos((y - 10) * 0.32)
                        dir_x = 0.18 * path_slope
                        dir_y = 1.0
                        bottom_mag = math.sqrt(dir_x*dir_x + dir_y*dir_y)
                        if bottom_mag > 0:
                            dir_x /= bottom_mag
                            dir_y /= bottom_mag
                        
                        u_total += dir_x * 10.5 * bottom_factor
                        v_total += dir_y * 10.5 * bottom_factor
                
                data['u'][i] = u_total
                data['v'][i] = v_total
                data['w'][i] = 0.0
    
    save_wind_data(data, 'wind_red_route_v2.json', 'Improved red route with double spirals')

print("Generating improved red route...")
print()

generate_red_route_v2()

print()
print("Generated!")
print()
print("Files:")
print("  1. wind_red_route_v1.json (first version)")
print("  2. wind_red_route_v2.json (improved, closer to the image)")
