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
    for u, v in zip(data['u'], data['v']):
        if abs(u) > 0.01 or abs(v) > 0.01:
            count += 1
    print(f"  {filename}: {count}/{len(data['u'])} points ({count/len(data['u'])*100:.1f}%)")

def generate_horizontal_shear():
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u = 0.0
                v = 0.0
                w = 0.0
                
                # Base wind direction changes with x
                if x < 10:
                    # Left side: west wind
                    base_u = 15.0
                    base_v = 2.0
                else:
                    # Right side: east wind (opposite direction)
                    base_u = -15.0
                    base_v = 2.0
                
                # Smooth transition in middle
                if 7 < x < 13:
                    t = (x - 10.0) / 3.0
                    smooth_t = t * t * (3 - 2 * t)
                    base_u = 15.0 * (1 - smooth_t) - 15.0 * smooth_t
                
                # Add vertical shear with z
                z_factor = 1.0 + (z - 3) * 0.3
                
                u = base_u * z_factor
                v = base_v * z_factor
                
                # Add some random variation
                u += 3.0 * math.sin(x * 0.8 + z * 0.3)
                v += 2.0 * math.sin(y * 0.7 + z * 0.2)
                
                data['u'][i] = u
                data['v'][i] = v
                data['w'][i] = w
    
    save_wind_data(data, 'wind_horizontal_shear.json', 'Horizontal wind shear (east-west opposite')

def generate_vertical_shear():
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u = 0.0
                v = 0.0
                w = 0.0
                
                # Vertical shear: wind direction changes with height
                # Upper levels (low z)
                if z < 3:
                    base_angle = 45.0 * (math.pi / 180.0)
                    base_speed = 18.0
                # Lower levels (high z)
                else:
                    base_angle = 225.0 * (math.pi / 180.0)
                    base_speed = 15.0
                
                # Smooth transition
                if 2 < z < 4:
                    t = (z - 3.0) / 1.0
                    smooth_t = t * t * (3 - 2 * t)
                    angle1 = 45.0 * (math.pi / 180.0)
                    angle2 = 225.0 * (math.pi / 180.0)
                    base_angle = angle1 * (1 - smooth_t) + angle2 * smooth_t
                    base_speed = 18.0 * (1 - smooth_t) + 15.0 * smooth_t
                
                u = base_speed * math.cos(base_angle)
                v = base_speed * math.sin(base_angle)
                
                # Add vertical w component
                w = 5.0 * math.sin(x * 0.6 + y * 0.5)
                
                data['u'][i] = u
                data['v'][i] = v
                data['w'][i] = w
    
    save_wind_data(data, 'wind_vertical_shear.json', 'Vertical wind shear with direction change')

def generate_combined_shear():
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u = 0.0
                v = 0.0
                w = 0.0
                
                # Main wind
                base_u = 10.0
                base_v = 5.0
                
                # Horizontal shear (x direction
                shear_x = 20.0 * math.sin(x * 0.5)
                
                # Vertical shear (z direction)
                shear_z = 12.0 * math.sin(z * 0.7)
                
                # Combined
                u = base_u + shear_x + shear_z
                
                # Add vertical component
                w = 8.0 * math.sin(x * 0.3 + y * 0.4 + z * 0.5)
                
                # Add eddies
                eddies = [
                    (5, 8), (15, 12), (10, 5)
                ]
                for ex, ey in eddies:
                    edist = math.sqrt((x-ex)*(x-ex) + (y-ey)*(y-ey))
                    if edist < 4.0:
                        efactor = math.exp(-edist*edist * 0.05)
                        if edist > 0.5:
                            eu = -(y-ey)/edist * 12.0 * efactor
                            ev = (x-ex)/edist * 12.0 * efactor
                            u += eu
                            v += ev
                
                data['u'][i] = u
                data['v'][i] = v
                data['w'][i] = w
    
    save_wind_data(data, 'wind_combined_shear.json', 'Combined horizontal + vertical + eddies')

print("Generating wind shear scenarios...")
print()

generate_horizontal_shear()
generate_vertical_shear()
generate_combined_shear()

print()
print("Generated!")
print()
print("Files:")
print("  1. wind_horizontal_shear.json - Horizontal opposite wind shear")
print("  2. wind_vertical_shear.json - Vertical direction change shear")
print("  3. wind_combined_shear.json - Complex combined shear")
