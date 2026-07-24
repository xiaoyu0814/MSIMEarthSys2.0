import json
import math
from pathlib import Path

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
    for u, v, w in zip(data['u'], data['v'], data['w']):
        if abs(u) > 0.01 or abs(v) > 0.01 or abs(w) > 0.01:
            count += 1
    print(f"  {filename}: {count}/{len(data['u'])} points ({count/len(data['u'])*100:.1f}%)")

def generate_mixed_vertical_along_path():
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                # Background normal flow everywhere
                u = 10.0
                v = 3.0
                w = 0.0
                
                # Complex winding path
                path_y = 3.0 + 6.5 * math.sin(x * 0.52) + 3.8 * math.sin(x * 1.08)
                dist = abs(y - path_y)
                
                if dist < 2.5:
                    factor = math.exp(-dist*dist * 0.22)
                    
                    # Calculate direction from slope
                    slope = 6.5 * 0.52 * math.cos(x * 0.52) + 3.8 * 1.08 * math.cos(x * 1.08)
                    dir_x = 1.0
                    dir_y = 0.18 * slope
                    
                    dir_y += 0.14
                    
                    mag = math.sqrt(dir_x*dir_x + dir_y*dir_y)
                    if mag > 0:
                        dir_x /= mag
                        dir_y /= mag
                    
                    # Along path flow
                    u += dir_x * 9.0 * factor
                    v += dir_y * 9.0 * factor
                    
                    # MIXED UP/DOWN WIND - INTERLEAVED NOT SEPARATED
                    # Use 2D pattern for interleaved up/down
                    pattern = math.sin(x * 0.7) * math.sin(y * 0.8)
                    
                    w_strength = 13.0 * factor
                    
                    # Up where pattern positive, down where negative
                    w += w_strength * pattern
                    
                    # Add z variation
                    w += 3.0 * math.sin(z * 0.7) * factor
                
                data['u'][i] = u
                data['v'][i] = v
                data['w'][i] = w
    
    save_wind_data(data, 'wind_interleaved_vertical.json', 'Interleaved up/down along winding path')

def generate_sheared_path_with_blended_vertical():
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                # Background flow
                u = 9.0
                v = 2.5
                w = 0.0
                
                # Winding path
                path_y = 4.0 + 6.0 * math.sin(x * 0.48) + 3.5 * math.sin(x * 1.02)
                dist = abs(y - path_y)
                
                if dist < 2.8:
                    factor = math.exp(-dist*dist * 0.18)
                    
                    slope = 6.0 * 0.48 * math.cos(x * 0.48) + 3.5 * 1.02 * math.cos(x * 1.02)
                    dir_x = 1.0
                    dir_y = 0.16 * slope
                    
                    dir_y += 0.12
                    
                    mag = math.sqrt(dir_x*dir_x + dir_y*dir_y)
                    if mag > 0:
                        dir_x /= mag
                        dir_y /= mag
                    
                    u += dir_x * 10.0 * factor
                    v += dir_y * 10.0 * factor
                    
                    # BLENDED UP/DOWN - MIXED TOGETHER
                    # Use complex 2D pattern
                    pattern1 = math.sin(x * 0.6 + y * 0.5)
                    pattern2 = math.sin(x * 1.1 - y * 0.7)
                    combined_pattern = pattern1 + 0.7 * pattern2
                    
                    w_strength = 14.0 * factor
                    w += w_strength * math.sin(combined_pattern)
                    
                    w += 2.5 * math.sin(z * 0.8) * factor
                
                data['u'][i] = u
                data['v'][i] = v
                data['w'][i] = w
    
    save_wind_data(data, 'wind_blended_vertical.json', 'Blended up/down mixed together')

print("Generating interleaved vertical wind...")
print()

generate_mixed_vertical_along_path()
generate_sheared_path_with_blended_vertical()

print()
print("Generated!")
print()
print("Files:")
print("  1. wind_interleaved_vertical.json - Interleaved up/down along path")
print("  2. wind_blended_vertical.json - Blended up/down mixed together")
