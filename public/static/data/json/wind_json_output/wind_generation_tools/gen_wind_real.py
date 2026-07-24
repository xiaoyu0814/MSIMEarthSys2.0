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

def smooth_data(data, iterations=2):
    new_data = create_empty_data()
    for it in range(iterations):
        if it > 0:
            data = new_data
            new_data = create_empty_data()
        
        for z in range(nz):
            for y in range(ny):
                for x in range(nx):
                    i = idx(z, y, x)
                    su, sv, sw = data['u'][i], data['v'][i], data['w'][i]
                    count = 1.0
                    
                    for dx_val in [-1, 0, 1]:
                        for dy_val in [-1, 0, 1]:
                            if dx_val == 0 and dy_val == 0:
                                continue
                            nx_val = x + dx_val
                            ny_val = y + dy_val
                            if 0 <= nx_val < nx and 0 <= ny_val < ny:
                                ni = idx(z, ny_val, nx_val)
                                su += data['u'][ni] * 0.5
                                sv += data['v'][ni] * 0.5
                                sw += data['w'][ni] * 0.5
                                count += 0.5
                    
                    new_data['u'][i] = su / count
                    new_data['v'][i] = sv / count
                    new_data['w'][i] = sw / count
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
    for u, v in zip(data['u'], data['v']):
        if abs(u) > 0.01 or abs(v) > 0.01:
            count += 1
    print(f"  {filename}: {count}/{len(data['u'])} points ({count/len(data['u'])*100:.1f}%)")

def make_twisted_stream():
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u_total = 0.0
                v_total = 0.0
                
                # Multiple spiral centers
                spirals = [
                    (5, 7, 1, 14.0),
                    (14, 6, -1, 11.0),
                    (10, 14, 1, 9.0),
                ]
                
                for (cx, cy, rot, strength) in spirals:
                    dx_val = x - cx
                    dy_val = y - cy
                    dist_sq = dx_val*dx_val + dy_val*dy_val
                    dist = math.sqrt(dist_sq)
                    
                    if dist < 12:
                        factor = math.exp(-dist_sq * 0.008)
                        
                        if dist > 0.5:
                            tang_u = -rot * dy_val / dist
                            tang_v = rot * dx_val / dist
                            
                            u_total += tang_u * strength * factor
                            v_total += tang_v * strength * factor
                
                # Winding main stream
                # Sinusoidal path
                path_y = 10 + 5 * math.sin(x * 0.35) + 2 * math.sin(x * 0.75)
                dist = abs(y - path_y)
                
                if dist < 6:
                    factor = math.exp(-dist*dist * 0.04)
                    
                    # Direction changes slightly
                    dir_x = 0.9
                    dir_y = 0.6 + 0.2 * math.sin(x * 0.25)
                    
                    u_total += dir_x * 12.0 * factor
                    v_total += dir_y * 12.0 * factor
                
                # Multi-scale noise
                for scale, amp in [(0.3, 0.5), (0.1, 0.3), (0.05, 0.15)]:
                    ns1 = math.sin(x*scale*2.0) * math.cos(y*scale*2.5)
                    ns2 = math.cos(x*scale*1.7) * math.sin(y*scale*1.9)
                    u_total += (ns1 + ns2) * amp
                
                data['u'][i] = u_total
                data['v'][i] = v_total
                data['w'][i] = 0.0
    
    data = smooth_data(data, iterations=3)
    save_wind_data(data, 'wind_twisted_v1.json', 'Twisted single stream')

def make_converging_straits():
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u_total = 0.0
                v_total = 0.0
                
                # Two main flows converging
                # Flow 1 - from NW
                center1_x, center1_y = 4, 4
                dx1 = x - center1_x
                dy1 = y - center1_y
                dist1 = math.sqrt(dx1*dx1 + dy1*dy1)
                
                if dist1 < 15:
                    factor = math.exp(-dist1*dist1 * 0.005)
                    u_total += 0.8 * 13.0 * factor
                    v_total += 1.1 * 13.0 * factor
                
                # Flow 2 - from SE
                center2_x, center2_y = 16, 17
                dx2 = x - center2_x
                dy2 = y - center2_y
                dist2 = math.sqrt(dx2*dx2 + dy2*dy2)
                
                if dist2 < 15:
                    factor = math.exp(-dist2*dist2 * 0.005)
                    u_total += -0.7 * 11.0 * factor
                    v_total += -0.9 * 11.0 * factor
                
                # Strait-like amplification in center
                if 7 < x < 13 and 8 < y < 14:
                    amp = 1.4
                    u_total *= amp
                    v_total *= amp
                
                # Add small eddies
                for ex, ey, er in [(8, 10, 1), (12, 11, -1), (10, 13, 1)]:
                    exd = x - ex
                    eyd = y - ey
                    edist = math.sqrt(exd*exd + eyd*eyd)
                    if edist < 4:
                        ef = math.exp(-edist*edist * 0.15)
                        if edist > 0.5:
                            u_total += -er * eyd/edist * 4.0 * ef
                            v_total += er * exd/edist * 4.0 * ef
                
                data['u'][i] = u_total
                data['v'][i] = v_total
                data['w'][i] = 0.0
    
    data = smooth_data(data, iterations=2)
    save_wind_data(data, 'wind_converging_v1.json', 'Converging in straits')

def make_northeast_monsoon():
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                # NE wind direction
                main_u = -0.7
                main_v = 0.8
                main_speed = 14.0
                
                # Strait effect - stronger in middle
                topo_factor = 1.0
                if 5 < y < 15:
                    topo_factor = 1.5
                
                # Multiple sine waves for twisting
                twist1 = 0.5 * math.sin(x*0.4)
                twist2 = 0.3 * math.cos(y*0.5 + z*0.3)
                twist3 = 0.2 * math.sin(x*0.25 + y*0.3)
                
                u_total = main_u * main_speed * topo_factor + twist1 + twist3
                v_total = main_v * main_speed * topo_factor + twist2
                
                # Add small vortices along the path
                for vx, vy, vr, vs in [
                    (5, 6, 1, 4), (12, 8, -1, 3.5), (8, 14, 1, 3.0),
                    (15, 16, -1, 2.8), (3, 12, 1, 2.5)
                ]:
                    vdx = x - vx
                    vdy = y - vy
                    vd = math.sqrt(vdx*vdx + vdy*vdy)
                    if vd < 5:
                        vf = math.exp(-vd*vd * 0.1)
                        if vd > 0.5:
                            u_total += -vr * vdy/vd * vs * vf
                            v_total += vr * vdx/vd * vs * vf
                
                data['u'][i] = u_total
                data['v'][i] = v_total
                data['w'][i] = 0.0
    
    data = smooth_data(data, iterations=3)
    save_wind_data(data, 'wind_northeast_monsoon.json', 'NE monsoon with twists')

def make_multiple_meanders():
    data = create_empty_data()
    
    streams = [
        (3, 1.0, 0.7, 10.0),
        (8, 0.9, 0.8, 9.0),
        (12, 1.1, 0.6, 8.5),
        (16, 0.85, 0.75, 8.0),
    ]
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u_total = 0.0
                v_total = 0.0
                
                for (sy, dx, dv, spd) in streams:
                    curve_y = sy + 0.55 * math.sin(x*0.35) + 0.25 * math.sin(x*0.78)
                    dist = abs(y - curve_y)
                    
                    if dist < 4:
                        factor = math.exp(-dist*dist * 0.06)
                        
                        # Direction changes with curve
                        curve_slope = 0.55 * 0.35 * math.cos(x*0.35)
                        du = dx + curve_slope * 0.4
                        dv = dv
                        
                        u_total += du * spd * factor
                        v_total += dv * spd * factor
                
                # Background texture
                bg1 = 0.4 * math.sin(x*0.18) * math.cos(y*0.23)
                bg2 = 0.35 * math.cos(x*0.22) * math.sin(y*0.17)
                u_total += bg1
                v_total += bg2
                
                data['u'][i] = u_total
                data['v'][i] = v_total
                data['w'][i] = 0.0
    
    data = smooth_data(data, iterations=3)
    save_wind_data(data, 'wind_multiple_meanders.json', 'Multiple meandering streams')

print("Generating realistic wind fields...")
print()

make_twisted_stream()
make_converging_straits()
make_northeast_monsoon()
make_multiple_meanders()

print()
print("All realistic wind fields generated!")
print()
print("Generated files:")
print("  1. wind_twisted_v1.json - Twisted single stream with eddies")
print("  2. wind_converging_v1.json - Two flows converging")
print("  3. wind_northeast_monsoon.json - NE monsoon with twists")
print("  4. wind_multiple_meanders.json - Multiple meandering streams")
