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

def generate_small_eddies_with_vertical():
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u = 0.0
                v = 0.0
                w = 0.0
                
                # Base background wind
                base_u = 8.0
                base_v = 3.0
                u += base_u
                v += base_v
                
                # SMALL EDDIES - 5 small eddies
                eddies = [
                    (3, 5, 1, 9.0),
                    (8, 10, -1, 8.5),
                    (13, 6, 1, 9.0),
                    (16, 14, -1, 8.0),
                    (5, 15, 1, 8.5)
                ]
                
                for ex, ey, rot, strength in eddies:
                    edist = math.sqrt((x-ex)*(x-ex) + (y-ey)*(y-ey))
                    
                    # Small radius - tight eddies
                    if edist < 2.5:
                        efactor = math.exp(-edist*edist * 0.18)
                        
                        if edist > 0.3:
                            eu = -rot * (y-ey)/edist * strength * efactor
                            ev = rot * (x-ex)/edist * strength * efactor
                            u += eu
                            v += ev
                        
                        # Vertical wind at eddies - stronger at center
                        # Upward at center, downward at edge
                        w_strength = 15.0 * math.exp(-edist*edist * 0.25)
                        
                        # Z variation
                        z_factor = 1.0 + math.sin(z * 0.6) * 0.4
                        
                        # Upward/downward alternation
                        if edist < 1.2:
                            w += w_strength * z_factor  # Upward near center
                        else:
                            w -= w_strength * 0.5 * z_factor  # Downward at edge
                
                # Add some vertical shear with z
                if z > 3:
                    u *= 1.15
                    v *= 1.1
                
                data['u'][i] = u
                data['v'][i] = v
                data['w'][i] = w
    
    save_wind_data(data, 'wind_small_eddies_vertical.json', 'Small eddies with strong vertical w')

def generate_focused_eddy():
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u = 0.0
                v = 0.0
                w = 0.0
                
                # Background wind
                u = 10.0
                v = 2.0
                
                # One focused small eddy
                ex, ey = 10, 10
                edist = math.sqrt((x-ex)*(x-ex) + (y-ey)*(y-ey))
                
                if edist < 3.0:
                    efactor = math.exp(-edist*edist * 0.15)
                    
                    if edist > 0.3:
                        eu = -(y-ey)/edist * 14.0 * efactor
                        ev = (x-ex)/edist * 14.0 * efactor
                        u += eu
                        v += ev
                    
                    # STRONG vertical wind
                    # Upward at center
                    if edist < 1.5:
                        w_strength = 20.0 * math.exp(-edist*edist * 0.2)
                        z_factor = 1.0 + (z - 3) * 0.2
                        w += w_strength * z_factor
                    # Downward just outside
                    elif edist < 2.5:
                        w_strength = 12.0 * math.exp(-(edist-1.5)*(edist-1.5) * 0.3)
                        w -= w_strength
                
                data['u'][i] = u
                data['v'][i] = v
                data['w'][i] = w
    
    save_wind_data(data, 'wind_focused_eddy_strong.json', 'One focused eddy with very strong vertical')

print("Generating small eddies with vertical wind...")
print()

generate_small_eddies_with_vertical()
generate_focused_eddy()

print()
print("Generated!")
print()
print("Files:")
print("  1. wind_small_eddies_vertical.json - 5 small eddies with vertical w")
print("  2. wind_focused_eddy_strong.json - Single focused eddy with strong up/down")
