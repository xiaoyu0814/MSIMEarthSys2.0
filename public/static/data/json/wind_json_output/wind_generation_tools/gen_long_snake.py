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

def generate_long_snake_full():
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u_total = 0.0
                v_total = 0.0
                
                # --- COMPLETE LONG SNAKE PATH ---
                # Complex winding path from top-left to bottom-right
                path_y = 0.0
                
                if x < 4:
                    path_y = 4.0 + 1.8 * math.sin(x * 0.8)
                elif 4 <= x < 8:
                    path_y = 5.0 + 4.0 * math.sin((x - 4) * 0.55)
                elif 8 <= x < 12:
                    path_y = 9.0 + 3.8 * math.sin((x - 8) * 0.6)
                elif 12 <= x < 16:
                    path_y = 12.0 + 4.2 * math.sin((x - 12) * 0.52)
                elif 16 <= x < 20:
                    path_y = 15.5 + 3.0 * math.sin((x - 16) * 0.65)
                
                # Add more small-scale wiggles
                wiggle1 = 0.6 * math.sin(x * 1.35)
                wiggle2 = 0.4 * math.sin(x * 2.1)
                path_y += wiggle1 + wiggle2
                
                # Distance to main snake path
                dist = abs(y - path_y)
                
                if dist < 2.6:
                    factor = math.exp(-dist*dist * 0.22)
                    
                    # Calculate direction from slope
                    slope = 0.0
                    if x < 4:
                        slope = 1.8 * 0.8 * math.cos(x * 0.8)
                    elif 4 <= x < 8:
                        slope = 4.0 * 0.55 * math.cos((x - 4) * 0.55)
                    elif 8 <= x < 12:
                        slope = 3.8 * 0.6 * math.cos((x - 8) * 0.6)
                    elif 12 <= x < 16:
                        slope = 4.2 * 0.52 * math.cos((x - 12) * 0.52)
                    elif 16 <= x < 20:
                        slope = 3.0 * 0.65 * math.cos((x - 16) * 0.65)
                    
                    slope += 0.6 * 1.35 * math.cos(x * 1.35)
                    slope += 0.4 * 2.1 * math.cos(x * 2.1)
                    
                    dir_x = 1.0
                    dir_y = 0.16 * slope
                    
                    # Add downward trend overall
                    dir_y += 0.25
                    
                    mag = math.sqrt(dir_x*dir_x + dir_y*dir_y)
                    if mag > 0:
                        dir_x /= mag
                        dir_y /= mag
                    
                    base_speed = 12.5
                    u_total += dir_x * base_speed * factor
                    v_total += dir_y * base_speed * factor
                
                # --- FIRST BIG SPIRAL ---
                spiral1_x, spiral1_y = 5, 7
                s1_dist = math.sqrt((x-spiral1_x)*(x-spiral1_x) + (y-spiral1_y)*(y-spiral1_y))
                if s1_dist < 4.0:
                    s1_factor = math.exp(-s1_dist*s1_dist * 0.075)
                    
                    if s1_dist > 0.5:
                        s1_u = -(y - spiral1_y)/s1_dist * 13.0 * s1_factor
                        s1_v = (x - spiral1_x)/s1_dist * 13.0 * s1_factor
                        
                        s1_u += -(x-spiral1_x)/s1_dist * 4.5 * s1_factor
                        s1_v += -(y-spiral1_y)/s1_dist * 4.5 * s1_factor
                        
                        u_total += s1_u
                        v_total += s1_v
                
                # --- SECOND SPIRAL ---
                spiral2_x, spiral2_y = 12, 11
                s2_dist = math.sqrt((x-spiral2_x)*(x-spiral2_x) + (y-spiral2_y)*(y-spiral2_y))
                if s2_dist < 4.3:
                    s2_factor = math.exp(-s2_dist*s2_dist * 0.07)
                    
                    if s2_dist > 0.5:
                        s2_u = (y - spiral2_y)/s2_dist * 14.0 * s2_factor
                        s2_v = -(x - spiral2_x)/s2_dist * 14.0 * s2_factor
                        
                        s2_u += (x-spiral2_x)/s2_dist * 4.0 * s2_factor
                        s2_v += (y-spiral2_y)/s2_dist * 4.0 * s2_factor
                        
                        u_total += s2_u
                        v_total += s2_v
                
                # --- THIRD BIG SPIRAL ---
                spiral3_x, spiral3_y = 17, 16
                s3_dist = math.sqrt((x-spiral3_x)*(x-spiral3_x) + (y-spiral3_y)*(y-spiral3_y))
                if s3_dist < 3.8:
                    s3_factor = math.exp(-s3_dist*s3_dist * 0.08)
                    
                    if s3_dist > 0.5:
                        s3_u = -(y - spiral3_y)/s3_dist * 12.5 * s3_factor
                        s3_v = (x - spiral3_x)/s3_dist * 12.5 * s3_factor
                        
                        s3_u += -(x-spiral3_x)/s3_dist * 4.0 * s3_factor
                        s3_v += -(y-spiral3_y)/s3_dist * 4.0 * s3_factor
                        
                        u_total += s3_u
                        v_total += s3_v
                
                data['u'][i] = u_total
                data['v'][i] = v_total
                data['w'][i] = 0.0
    
    save_wind_data(data, 'wind_long_snake_full.json', 'Long complete snake path with 3 spirals')

def generate_extreme_windings():
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u_total = 0.0
                v_total = 0.0
                
                # EXTREME WINDING PATH
                path_y = 3.0 + 6.0 * math.sin(x * 0.45) + 3.5 * math.sin(x * 0.92) + 1.8 * math.sin(x * 1.6)
                dist = abs(y - path_y)
                
                if dist < 2.4:
                    factor = math.exp(-dist*dist * 0.25)
                    
                    slope = 6.0 * 0.45 * math.cos(x * 0.45) + 3.5 * 0.92 * math.cos(x * 0.92) + 1.8 * 1.6 * math.cos(x * 1.6)
                    dir_x = 1.0
                    dir_y = 0.18 * slope
                    
                    dir_y += 0.15
                    
                    mag = math.sqrt(dir_x*dir_x + dir_y*dir_y)
                    if mag > 0:
                        dir_x /= mag
                        dir_y /= mag
                    
                    u_total += dir_x * 12.0 * factor
                    v_total += dir_y * 12.0 * factor
                
                # Add multiple small eddies along the way
                eddies = [
                    (4, 6, 1, 9.0),
                    (9, 10, -1, 8.5),
                    (14, 14, 1, 8.0)
                ]
                
                for ex, ey, rot, strength in eddies:
                    edist = math.sqrt((x-ex)*(x-ex) + (y-ey)*(y-ey))
                    if edist < 2.5:
                        efactor = math.exp(-edist*edist * 0.18)
                        if edist > 0.5:
                            eu = -rot * (y-ey)/edist * strength * efactor
                            ev = rot * (x-ex)/edist * strength * efactor
                            u_total += eu
                            v_total += ev
                
                data['u'][i] = u_total
                data['v'][i] = v_total
                data['w'][i] = 0.0
    
    save_wind_data(data, 'wind_extreme_winding.json', 'Extremely winding snake path')

print("Generating long snake wind fields...")
print()

generate_long_snake_full()
generate_extreme_windings()

print()
print("Generated!")
print()
print("Files:")
print("  1. wind_long_snake_full.json - Long complete snake with 3 spirals")
print("  2. wind_extreme_winding.json - Extremely winding path with eddies")
