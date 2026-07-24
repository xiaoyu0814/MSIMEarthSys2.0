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

def generate_extreme_winding_vertical():
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u = 0.0
                v = 0.0
                w = 0.0
                
                # EXTREMELY WINDING PATH
                path_y = 3.0 + 7.0 * math.sin(x * 0.55) + 4.0 * math.sin(x * 1.1) + 2.0 * math.sin(x * 1.85)
                dist = abs(y - path_y)
                
                if dist < 2.2:
                    factor = math.exp(-dist*dist * 0.28)
                    
                    # Calculate direction from slope
                    slope = 7.0 * 0.55 * math.cos(x * 0.55) + 4.0 * 1.1 * math.cos(x * 1.1) + 2.0 * 1.85 * math.cos(x * 1.85)
                    dir_x = 1.0
                    dir_y = 0.22 * slope
                    
                    dir_y += 0.12
                    
                    mag = math.sqrt(dir_x*dir_x + dir_y*dir_y)
                    if mag > 0:
                        dir_x /= mag
                        dir_y /= mag
                    
                    base_speed = 11.0
                    u += dir_x * base_speed * factor
                    v += dir_y * base_speed * factor
                    
                    # ALTERNATING UP/DOWN WIND
                    # Alternate every ~3 x units
                    alternation = math.sin(x * 0.65)
                    
                    # Upward when positive, downward when negative
                    w_strength = 14.0 * factor
                    w += w_strength * alternation
                    
                    # Add some z variation
                    w += 3.0 * math.sin(z * 0.8) * factor
                
                data['u'][i] = u
                data['v'][i] = v
                data['w'][i] = w
    
    save_wind_data(data, 'wind_extreme_winding_vertical.json', 'Extreme winding with alternating up/down')

def generate_vertical_eddies_along_winding():
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u = 0.0
                v = 0.0
                w = 0.0
                
                # Complex winding path
                path_y = 4.0 + 6.0 * math.sin(x * 0.5) + 3.5 * math.sin(x * 1.05)
                dist = abs(y - path_y)
                
                if dist < 2.4:
                    factor = math.exp(-dist*dist * 0.25)
                    
                    slope = 6.0 * 0.5 * math.cos(x * 0.5) + 3.5 * 1.05 * math.cos(x * 1.05)
                    dir_x = 1.0
                    dir_y = 0.2 * slope
                    
                    dir_y += 0.15
                    
                    mag = math.sqrt(dir_x*dir_x + dir_y*dir_y)
                    if mag > 0:
                        dir_x /= mag
                        dir_y /= mag
                    
                    u += dir_x * 12.0 * factor
                    v += dir_y * 12.0 * factor
                    
                    # Multiple vertical eddies along path
                    # Upward/downward alternating spots
                    for spot_x in [3, 7, 11, 15]:
                        spot_y = 4.0 + 6.0 * math.sin(spot_x * 0.5) + 3.5 * math.sin(spot_x * 1.05)
                        spot_dist = math.sqrt((x-spot_x)*(x-spot_x) + (y-spot_y)*(y-spot_y))
                        
                        if spot_dist < 2.0:
                            spot_factor = math.exp(-spot_dist*spot_dist * 0.3)
                            
                            # Alternate up/down
                            if spot_x % 4 == 3:
                                w_strength = 16.0 * spot_factor * factor
                                w += w_strength  # Upward
                            else:
                                w_strength = 16.0 * spot_factor * factor
                                w -= w_strength  # Downward
                
                data['u'][i] = u
                data['v'][i] = v
                data['w'][i] = w
    
    save_wind_data(data, 'wind_winding_vertical_eddies.json', 'Winding path with vertical eddy spots')

print("Generating extreme winding with vertical wind...")
print()

generate_extreme_winding_vertical()
generate_vertical_eddies_along_winding()

print()
print("Generated!")
print()
print("Files:")
print("  1. wind_extreme_winding_vertical.json - Extreme winding with alternating up/down")
print("  2. wind_winding_vertical_eddies.json - Winding path with vertical eddy spots")
