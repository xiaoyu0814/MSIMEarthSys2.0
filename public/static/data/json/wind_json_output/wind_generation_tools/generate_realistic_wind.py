import json
import math
from pathlib import Path
import random

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
print(f"Range: Lon {lo1:.4f}-{lo2:.4f}, Lat {la1:.4f}-{la2:.4f}")
print()

def create_empty_data():
    return {
        'u': [0.0] * (nx * ny * nz),
        'v': [0.0] * (nx * ny * nz),
        'w': [0.0] * (nx * ny * nz)
    }

def idx(z, y, x):
    return z * ny * nx + y * nx + x

def apply_smoothing(data, iterations=3):
    new_data = create_empty_data()
    
    for it in range(iterations):
        if it > 0:
            data = new_data
            new_data = create_empty_data()
        
        for z in range(nz):
            for y in range(ny):
                for x in range(nx):
                    i = idx(z, y, x)
                    
                    sum_u = data['u'][i] * 2.0
                    sum_v = data['v'][i] * 2.0
                    sum_w = data['w'][i] * 2.0
                    count = 2.0
                    
                    for dy_val in [-2, -1, 0, 1, 2]:
                        for dx_val in [-2, -1, 0, 1, 2]:
                            if dy_val == 0 and dx_val == 0:
                                continue
                            
                            ny_val = y + dy_val
                            nx_val = x + dx_val
                            
                            if 0 <= ny_val < ny and 0 <= nx_val < nx:
                                ni = idx(z, ny_val, nx_val)
                                dist = math.sqrt(dx_val*dx_val + dy_val*dy_val)
                                weight = 1.0 / (dist + 0.5)
                                
                                sum_u += data['u'][ni] * weight
                                sum_v += data['v'][ni] * weight
                                sum_w += data['w'][ni] * weight
                                count += weight
                    
                    new_data['u'][i] = sum_u / count
                    new_data['v'][i] = sum_v / count
                    new_data['w'][i] = sum_w / count
    
    return new_data

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
    total = len(data['u'])
    for u, v in zip(data['u'], data['v']):
        if abs(u) > 0.01 or abs(v) > 0.01:
            count += 1
    
    print(f"  {filename}: {count}/{total} points ({count/total*100:.1f}%)")

def generate_realistic_single_stream():
    data = create_empty_data()
    
    vortex_centers = [
        (5, 8, 1, 15.0, -0.8),
        (15, 6, -1, 12.0, 0.5),
        (10, 16, 1, 10.0, -0.3),
        (3, 15, -1, 8.0, 0.6),
    ]
    
    stream_lines = [
        (0, 5, 0.7, 1.2, 8.0),
        (20, 3, -0.6, 1.0, 12.0),
        (5, 20, 1.0, -0.5, 7.0),
    ]
    
    noise_scales = [
        (1.0, 0.3),
        (0.3, 0.8),
        (0.1, 1.2),
    ]
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u_total = 0.0
                v_total = 0.0
                
                for (cx, cy, rot, strength, decay) in vortex_centers:
                    dx_val = x - cx
                    dy_val = y - cy
                    dist_sq = dx_val*dx_val + dy_val*dy_val
                    dist = math.sqrt(dist_sq)
                    
                    if dist < 15:
                        factor = math.exp(-dist_sq * decay * 0.02)
                        
                        if dist > 0.5:
                            tang_u = -rot * dy_val / dist
                            tang_v = rot * dx_val / dist
                        
                            radial_fac = 0.2
                            radial_u = -dx_val / dist * radial_fac
                            radial_v = -dy_val / dist * radial_fac
                        
                            u_total += (tang_u + radial_u) * strength * factor
                            v_total += (tang_v + radial_v) * strength * factor
                
                for (sx, sy, du, dv, strength) in stream_lines:
                    sin_wave = 0
                    for n in range(1, 4):
                        wave_amp = 0.5 / (n*n)
                        sin_wave += wave_amp * math.sin(n * x / (nx/4) * math.cos(n * y / (ny/3))
                    
                    curve_y = sy + sin_wave
                    dist = abs(y - curve_y)
                    
                    if dist < 8:
                        factor = math.exp(-dist*dist * 0.03)
                        u_total += du * strength * factor
                        v_total += dv * strength * factor
                
                for (scale, amp) in noise_scales:
                    noise1 = math.sin(x*scale*0.5) * math.cos(y*scale*0.7)
                    noise2 = math.cos(x*scale*0.3) * math.sin(y*scale*0.8)
                    u_total += (noise1 + noise2) * amp
                
                height_factor = 0.6 + 0.4 * math.sin(z * 0.8)
                
                data['u'][i] = u_total * height_factor
                data['v'][i] = v_total * height_factor
                data['w'][i] = 0.0
    
    data = apply_smoothing(data, iterations=3)
    save_wind_data(data, 'wind_realistic_single.json', 'Realistic single stream with twists')

def generate_converging_system():
    data = create_empty_data()
    
    systems = [
        (5, 10, 1, 18.0, 0.008),
        (18, 8, -1, 14.0, 0.006),
        (10, 16, 1, 8.0, 0.005),
    ]
    
    background_dir = (0.8, 0.4)
    background_str = 6.0
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u_total = background_dir[0] * background_str
                v_total = background_dir[1] * background_str
                
                for (cx, cy, rot, strength, decay) in systems:
                    dx_val = x - cx
                    dy_val = y - cy
                    dist_sq = dx_val*dx_val + dy_val*dy_val
                    dist = math.sqrt(dist_sq)
                    
                    if dist < 18:
                        factor = math.exp(-dist_sq * decay)
                        
                        if dist > 0.5:
                            u = -rot * dy_val / dist
                            v = rot * dx_val / dist
                            
                            if rot > 0:
                                radial_fac = 0.3
                                u += -dx_val/dist * radial_fac
                                v += -dy_val/dist * radial_fac
                            
                            u_total += u * strength * factor
                            v_total += v * strength * factor
                
                per1 = math.sin(x*0.5) * 0.8
                per2 = math.cos(y*0.6) * 0.6
                u_total += per1
                v_total += per2
                
                data['u'][i] = u_total
                data['v'][i] = v_total
                data['w'][i] = 0.0
    
    data = apply_smoothing(data, iterations=2)
    save_wind_data(data, 'wind_converging_system.json', 'Converging air masses')

def generate_taiwan_strait_wind():
    data = create_empty_data()
    
    main_dir = (-0.7, 0.8)
    main_str = 15.0
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                topo = 1.0
                if 5 < y < 15:
                    topo = 1.3
                
                vortex1 = 0.5 * math.sin(x*0.4 + z*0.3)
                vortex2 = 0.4 * math.cos(y*0.5 - z*0.2)
                
                u_total = main_dir[0] * main_str * topo
                v_total = main_dir[1] * main_str * topo
                
                meander = math.sin(x*0.3) * 0.4
                u_total += meander
                v_total += vortex1 + vortex2
                
                data['u'][i] = u_total
                data['v'][i] = v_total
                data['w'][i] = 0.0
    
    data = apply_smoothing(data, iterations=3)
    save_wind_data(data, 'wind_taiwan_strait.json', 'Taiwan Strait characteristic wind')

def generate_multiple_twisted_streams():
    data = create_empty_data()
    
    streams = []
    
    for i, sy in enumerate([4, 8, 12, 16]):
        direction = 0.7 + i * 0.05
        curve_phase = i * 1.0
        streams.append(
            ('S', sy, 1.0, 12.0 - i*0.5, curve_phase, 0.8)
        )
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u_total = 0.0
                v_total = 0.0
                
                for (st, sy, dx, dv, strength, phase) in streams:
                    curve_y = sy + 0.6 * math.sin(x*0.3 + phase) + 0.3 * math.sin(x*0.7 + phase*0.5)
                    dist = abs(y - curve_y)
                    
                    if dist < 5:
                        factor = math.exp(-dist*dist * 0.05)
                        
                        curve_deriv = 0.6 * 0.3 * math.cos(x*0.3 + phase)
                        
                        u = dx + curve_deriv * 0.3
                        v = dv
                        
                        u_total += u * strength * factor
                        v_total += v * strength * factor
                
                bg1 = 0.5 * math.sin(x*0.2) * math.cos(y*0.15)
                bg2 = 0.4 * math.cos(x*0.18) * math.sin(y*0.22)
                u_total += bg1
                v_total += bg2
                
                data['u'][i] = u_total
                data['v'][i] = v_total
                data['w'][i] = 0.0
    
    data = apply_smoothing(data, iterations=3)
    save_wind_data(data, 'wind_multiple_twisted.json', 'Multiple twisted streams')

print("Generating realistic wind fields...")
print()

generate_realistic_single_stream()
generate_converging_system()
generate_taiwan_strait_wind()
generate_multiple_twisted_streams()

print()
print("All realistic wind fields generated!")
print()
print("Generated files:")
print("  1. wind_realistic_single.json - Realistic single with twists")
print("  2. wind_converging_system.json - Converging air masses")
print("  3. wind_taiwan_strait.json - Taiwan Strait characteristic")
print("  4. wind_multiple_twisted.json - Multiple twisted streams")
