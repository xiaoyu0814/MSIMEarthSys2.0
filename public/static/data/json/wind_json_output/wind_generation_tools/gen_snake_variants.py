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

def make_snake_variant_1():
    """Thin, highly wiggly path"""
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u_total = 0.0
                v_total = 0.0
                
                path_y = 5 + 6.5 * math.sin(x * 0.33) + 3.8 * math.sin(x * 0.68) + 1.8 * math.sin(x * 1.25)
                dist = abs(y - path_y)
                
                if dist < 2.0:
                    factor = math.exp(-dist*dist * 0.45)
                    
                    slope = 6.5 * 0.33 * math.cos(x * 0.33) + 3.8 * 0.68 * math.cos(x * 0.68) + 1.8 * 1.25 * math.cos(x * 1.25)
                    dir_x = 1.0
                    dir_y = 0.16 * slope
                    mag = math.sqrt(dir_x*dir_x + dir_y*dir_y)
                    if mag > 0:
                        dir_x /= mag
                        dir_y /= mag
                    
                    base_speed = 13.0
                    u_total = dir_x * base_speed * factor
                    v_total = dir_y * base_speed * factor
                
                loop1_x, loop1_y = 6, 7
                loop1_dist = math.sqrt((x-loop1_x)*(x-loop1_x) + (y-loop1_y)*(y-loop1_y))
                if loop1_dist < 2.7:
                    loop1_factor = math.exp(-loop1_dist*loop1_dist * 0.16)
                    if loop1_dist > 0.5:
                        loop1_u = -(y-loop1_y)/loop1_dist * 9.0 * loop1_factor
                        loop1_v = (x-loop1_x)/loop1_dist * 9.0 * loop1_factor
                        u_total += loop1_u
                        v_total += loop1_v
                
                loop2_x, loop2_y = 15, 12
                loop2_dist = math.sqrt((x-loop2_x)*(x-loop2_x) + (y-loop2_y)*(y-loop2_y))
                if loop2_dist < 2.4:
                    loop2_factor = math.exp(-loop2_dist*loop2_dist * 0.18)
                    if loop2_dist > 0.5:
                        loop2_u = (y-loop2_y)/loop2_dist * 8.0 * loop2_factor
                        loop2_v = -(x-loop2_x)/loop2_dist * 8.0 * loop2_factor
                        u_total += loop2_u
                        v_total += loop2_v
                
                data['u'][i] = u_total
                data['v'][i] = v_total
                data['w'][i] = 0.0
    
    save_wind_data(data, 'wind_snake_thin_wiggly.json', 'Thin, highly wiggly path')

def make_snake_variant_2():
    """Thick, moderate curve path with multiple loops"""
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u_total = 0.0
                v_total = 0.0
                
                path_y = 3.5 + 4.8 * math.sin(x * 0.26) + 2.7 * math.sin(x * 0.52)
                dist = abs(y - path_y)
                
                if dist < 3.3:
                    factor = math.exp(-dist*dist * 0.16)
                    
                    slope = 4.8 * 0.26 * math.cos(x * 0.26) + 2.7 * 0.52 * math.cos(x * 0.52)
                    dir_x = 1.0
                    dir_y = 0.2 * slope
                    mag = math.sqrt(dir_x*dir_x + dir_y*dir_y)
                    if mag > 0:
                        dir_x /= mag
                        dir_y /= mag
                    
                    base_speed = 12.5
                    u_total = dir_x * base_speed * factor
                    v_total = dir_y * base_speed * factor
                
                loops = [
                    (5, 6, 1, 8.5, 0.15),
                    (10, 9, -1, 7.5, 0.14),
                    (15, 14, 1, 7.0, 0.15),
                ]
                
                for (lx, ly, rot, stren, decay) in loops:
                    ld = math.sqrt((x-lx)*(x-lx) + (y-ly)*(y-ly))
                    if ld < 2.8:
                        lf = math.exp(-ld*ld * decay)
                        if ld > 0.5:
                            lu = -rot * (y-ly)/ld * stren * lf
                            lv = rot * (x-lx)/ld * stren * lf
                            u_total += lu
                            v_total += lv
                
                data['u'][i] = u_total
                data['v'][i] = v_total
                data['w'][i] = 0.0
    
    save_wind_data(data, 'wind_snake_thick_multi_loop.json', 'Thick path with multiple loops')

def make_snake_variant_3():
    """Very thin, super twisted, high frequency"""
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u_total = 0.0
                v_total = 0.0
                
                path_y = 4.5 + 5.8 * math.sin(x * 0.42) + 3.2 * math.sin(x * 0.88) + 1.5 * math.sin(x * 1.55)
                dist = abs(y - path_y)
                
                if dist < 1.7:
                    factor = math.exp(-dist*dist * 0.55)
                    
                    slope = 5.8 * 0.42 * math.cos(x * 0.42) + 3.2 * 0.88 * math.cos(x * 0.88) + 1.5 * 1.55 * math.cos(x * 1.55)
                    dir_x = 1.0
                    dir_y = 0.14 * slope
                    mag = math.sqrt(dir_x*dir_x + dir_y*dir_y)
                    if mag > 0:
                        dir_x /= mag
                        dir_y /= mag
                    
                    base_speed = 11.5
                    u_total = dir_x * base_speed * factor
                    v_total = dir_y * base_speed * factor
                
                data['u'][i] = u_total
                data['v'][i] = v_total
                data['w'][i] = 0.0
    
    save_wind_data(data, 'wind_snake_ultra_thin.json', 'Ultra thin super twisted path')

def make_snake_variant_4():
    """Double snake - two intertwining paths"""
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u_total = 0.0
                v_total = 0.0
                
                path1_y = 4.5 + 4.3 * math.sin(x * 0.29) + 2.3 * math.sin(x * 0.58)
                dist1 = abs(y - path1_y)
                
                if dist1 < 2.4:
                    factor1 = math.exp(-dist1*dist1 * 0.27)
                    
                    slope1 = 4.3 * 0.29 * math.cos(x * 0.29) + 2.3 * 0.58 * math.cos(x * 0.58)
                    dir1_x = 1.0
                    dir1_y = 0.18 * slope1
                    mag1 = math.sqrt(dir1_x*dir1_x + dir1_y*dir1_y)
                    if mag1 > 0:
                        dir1_x /= mag1
                        dir1_y /= mag1
                    
                    u_total += dir1_x * 12.0 * factor1
                    v_total += dir1_y * 12.0 * factor1
                
                path2_y = 13.0 + 4.0 * math.sin(x * 0.27 + 0.8) + 2.1 * math.sin(x * 0.54 + 0.8)
                dist2 = abs(y - path2_y)
                
                if dist2 < 2.2:
                    factor2 = math.exp(-dist2*dist2 * 0.29)
                    
                    slope2 = 4.0 * 0.27 * math.cos(x * 0.27 + 0.8) + 2.1 * 0.54 * math.cos(x * 0.54 + 0.8)
                    dir2_x = 1.0
                    dir2_y = 0.17 * slope2
                    mag2 = math.sqrt(dir2_x*dir2_x + dir2_y*dir2_y)
                    if mag2 > 0:
                        dir2_x /= mag2
                        dir2_y /= mag2
                    
                    u_total += dir2_x * 11.0 * factor2
                    v_total += dir2_y * 11.0 * factor2
                
                data['u'][i] = u_total
                data['v'][i] = v_total
                data['w'][i] = 0.0
    
    save_wind_data(data, 'wind_snake_double.json', 'Two intertwining snake paths')

def make_snake_variant_5():
    """Single snake with big loops and complex twists"""
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u_total = 0.0
                v_total = 0.0
                
                path_y = 3.2 + 5.5 * math.sin(x * 0.23) + 3.0 * math.sin(x * 0.46) + 1.3 * math.sin(x * 0.92)
                dist = abs(y - path_y)
                
                if dist < 2.6:
                    factor = math.exp(-dist*dist * 0.21)
                    
                    slope = 5.5 * 0.23 * math.cos(x * 0.23) + 3.0 * 0.46 * math.cos(x * 0.46) + 1.3 * 0.92 * math.cos(x * 0.92)
                    dir_x = 1.0
                    dir_y = 0.19 * slope
                    mag = math.sqrt(dir_x*dir_x + dir_y*dir_y)
                    if mag > 0:
                        dir_x /= mag
                        dir_y /= mag
                    
                    u_total += dir_x * 12.5 * factor
                    v_total += dir_y * 12.5 * factor
                
                big_loops = [
                    (4, 7, 1, 9.5, 0.11, 3.2),
                    (10, 10, -1, 8.5, 0.10, 3.0),
                    (16, 13, 1, 7.5, 0.11, 2.8),
                ]
                
                for (lx, ly, rot, stren, decay, r) in big_loops:
                    ld = math.sqrt((x-lx)*(x-lx) + (y-ly)*(y-ly))
                    if ld < r:
                        lf = math.exp(-ld*ld * decay)
                        if ld > 0.5:
                            lu = -rot * (y-ly)/ld * stren * lf
                            lv = rot * (x-lx)/ld * stren * lf
                            u_total += lu
                            v_total += lv
                
                data['u'][i] = u_total
                data['v'][i] = v_total
                data['w'][i] = 0.0
    
    save_wind_data(data, 'wind_snake_big_loops.json', 'Big loops with complex twists')

print("Generating snake path variants...")
print()

make_snake_variant_1()
make_snake_variant_2()
make_snake_variant_3()
make_snake_variant_4()
make_snake_variant_5()

print()
print("All snake variants generated!")
print()
print("Generated files:")
print("  1. wind_snake_thin_wiggly.json - Thin, highly wiggly")
print("  2. wind_snake_thick_multi_loop.json - Thick with 3 loops")
print("  3. wind_snake_ultra_thin.json - Ultra thin super twisted (1.7 radius)")
print("  4. wind_snake_double.json - Two intertwining paths")
print("  5. wind_snake_big_loops.json - Big loops with complex twists")
