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

def route_1_with_eddies():
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u_total = 0.0
                v_total = 0.0
                
                # Main winding path
                path_y = 6 + 4 * math.sin(x * 0.32) + 2.5 * math.sin(x * 0.7) + 1.2 * math.sin(x * 1.15)
                dist = abs(y - path_y)
                
                # Only keep data near the path
                if dist < 3:
                    factor = math.exp(-dist*dist * 0.25)
                    
                    # Direction follows curve
                    path_slope = 4 * 0.32 * math.cos(x * 0.32) + 2.5 * 0.7 * math.cos(x * 0.7) + 1.2 * 1.15 * math.cos(x * 1.15)
                    dir_x = 1.0
                    dir_y = 0.15 * path_slope
                    speed_mag = math.sqrt(dir_x*dir_x + dir_y*dir_y)
                    if speed_mag > 0:
                        dir_x /= speed_mag
                        dir_y /= speed_mag
                    
                    base_speed = 14.0
                    u_total = dir_x * base_speed * factor
                    v_total = dir_y * base_speed * factor
                    
                    # Add eddy near x=10
                    eddy_x, eddy_y = 10, 8
                    eddy_dist = math.sqrt((x-eddy_x)*(x-eddy_x) + (y-eddy_y)*(y-eddy_y))
                    if eddy_dist < 4:
                        eddy_factor = math.exp(-eddy_dist*eddy_dist * 0.09)
                        if eddy_dist > 0.5:
                            # Eddy - circulate
                            eddy_u = -(y - eddy_y) / eddy_dist * 11.0 * eddy_factor
                            eddy_v = (x - eddy_x) / eddy_dist * 11.0 * eddy_factor
                            u_total += eddy_u
                            v_total += eddy_v
                
                # Eddy #2 at x=16
                eddy2_x, eddy2_y = 16, 12
                eddy2_dist = math.sqrt((x-eddy2_x)*(x-eddy2_x) + (y-eddy2_y)*(y-eddy2_y))
                if eddy2_dist < 3.5 and (dist < 4 or eddy2_dist < 3.5):
                    eddy2_factor = math.exp(-eddy2_dist*eddy2_dist * 0.11)
                    if eddy2_dist > 0.5:
                        eddy2_u = (y - eddy2_y) / eddy2_dist * 10.0 * eddy2_factor
                        eddy2_v = -(x - eddy2_x) / eddy2_dist * 10.0 * eddy2_factor
                        u_total += eddy2_u
                        v_total += eddy2_v
                
                data['u'][i] = u_total
                data['v'][i] = v_total
                data['w'][i] = 0.0
    
    save_wind_data(data, 'wind_route1_eddies.json', 'Route with eddies - clean path')

def route_2_spiral_path():
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u_total = 0.0
                v_total = 0.0
                
                # Spiral path
                center_x, center_y = 10, 10
                dx_val = x - center_x
                dy_val = y - center_y
                dist = math.sqrt(dx_val*dx_val + dy_val*dy_val)
                
                # Spiral angle
                if dist > 0.5:
                    angle = math.atan2(dy_val, dx_val)
                    # Spiral - distance increases with angle
                    spiral_r = 2.0 + 0.6 * angle + 0.3 * angle*angle
                    
                    # Distance from spiral
                    dist_from_spiral = abs(dist - spiral_r)
                    
                    if dist_from_spiral < 2.8:
                        factor = math.exp(-dist_from_spiral*dist_from_spiral * 0.22)
                        
                        # Tangential direction
                        tang_x = -dy_val / dist
                        tang_y = dx_val / dist
                        
                        base_speed = 13.0
                        u_total = tang_x * base_speed * factor
                        v_total = tang_y * base_speed * factor
                        
                        # Add radial component to follow spiral out
                        radial_fac = 0.25
                        u_total += dx_val / dist * radial_fac * base_speed * factor
                        v_total += dy_val / dist * radial_fac * base_speed * factor
                
                data['u'][i] = u_total
                data['v'][i] = v_total
                data['w'][i] = 0.0
    
    save_wind_data(data, 'wind_route2_spiral.json', 'Spiral path route')

def route_3_snake_with_loops():
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u_total = 0.0
                v_total = 0.0
                
                # Complex snake path with loops
                # Main curve
                path_y = 4 + 5 * math.sin(x * 0.28) + 3 * math.sin(x * 0.55)
                dist = abs(y - path_y)
                
                if dist < 2.7:
                    factor = math.exp(-dist*dist * 0.3)
                    
                    # Direction follows curve
                    slope = 5 * 0.28 * math.cos(x * 0.28) + 3 * 0.55 * math.cos(x * 0.55)
                    dir_x = 1.0
                    dir_y = 0.18 * slope
                    mag = math.sqrt(dir_x*dir_x + dir_y*dir_y)
                    if mag > 0:
                        dir_x /= mag
                        dir_y /= mag
                    
                    base_speed = 12.5
                    u_total = dir_x * base_speed * factor
                    v_total = dir_y * base_speed * factor
                
                # Loop at x=7
                loop1_x, loop1_y = 7, 6
                loop1_dist = math.sqrt((x-loop1_x)*(x-loop1_x) + (y-loop1_y)*(y-loop1_y))
                if loop1_dist < 3.2:
                    loop1_factor = math.exp(-loop1_dist*loop1_dist * 0.12)
                    if loop1_dist > 0.5:
                        loop1_u = -(y - loop1_y) / loop1_dist * 10.5 * loop1_factor
                        loop1_v = (x - loop1_x) / loop1_dist * 10.5 * loop1_factor
                        u_total += loop1_u
                        v_total += loop1_v
                
                # Loop at x=14 (counter)
                loop2_x, loop2_y = 14, 13
                loop2_dist = math.sqrt((x-loop2_x)*(x-loop2_x) + (y-loop2_y)*(y-loop2_y))
                if loop2_dist < 2.9:
                    loop2_factor = math.exp(-loop2_dist*loop2_dist * 0.13)
                    if loop2_dist > 0.5:
                        loop2_u = (y - loop2_y) / loop2_dist * 9.5 * loop2_factor
                        loop2_v = -(x - loop2_x) / loop2_dist * 9.5 * loop2_factor
                        u_total += loop2_u
                        v_total += loop2_v
                
                data['u'][i] = u_total
                data['v'][i] = v_total
                data['w'][i] = 0.0
    
    save_wind_data(data, 'wind_route3_snake.json', 'Snake path with loops')

def route_4_converging_diverging():
    data = create_empty_data()
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                u_total = 0.0
                v_total = 0.0
                
                # Path 1: from left to center
                path1_y = 8
                if x < 12:
                    dist1 = abs(y - path1_y)
                    if dist1 < 2.6:
                        factor1 = math.exp(-dist1*dist1 * 0.28)
                        u_total += 11.5 * factor1
                        v_total += 0.3 * factor1
                
                # Path 2: from top to center
                path2_x = 9
                if y < 12:
                    dist2 = abs(x - path2_x)
                    if dist2 < 2.4:
                        factor2 = math.exp(-dist2*dist2 * 0.3)
                        u_total += 0.4 * factor2
                        v_total += 11.0 * factor2
                
                # Converging vortex at center
                center_x, center_y = 10, 10
                c_dist = math.sqrt((x-center_x)*(x-center_x) + (y-center_y)*(y-center_y))
                
                if c_dist < 5:
                    c_factor = math.exp(-c_dist*c_dist * 0.06)
                    if c_dist > 0.5:
                        # Inward radial
                        u_total += -(x-center_x)/c_dist * 7.0 * c_factor
                        v_total += -(y-center_y)/c_dist * 7.0 * c_factor
                        
                        # Rotational
                        rot_str = 8.0
                        u_total += -(y-center_y)/c_dist * rot_str * c_factor
                        v_total += (x-center_x)/c_dist * rot_str * c_factor
                
                # Diverging path - from center to bottom-right
                if x > 8 and y > 9:
                    path3_y = 10 + (x - 10) * 0.65
                    dist3 = abs(y - path3_y)
                    if dist3 < 2.8 and (x-center_x)*(x-center_x)+(y-center_y)*(y-center_y) < 36:
                        factor3 = math.exp(-dist3*dist3 * 0.25)
                        dir_x = 0.85
                        dir_y = 0.55
                        dir_mag = math.sqrt(dir_x*dir_x + dir_y*dir_y)
                        if dir_mag > 0:
                            dir_x /= dir_mag
                            dir_y /= dir_mag
                        u_total += dir_x * 10.5 * factor3
                        v_total += dir_y * 10.5 * factor3
                
                data['u'][i] = u_total
                data['v'][i] = v_total
                data['w'][i] = 0.0
    
    save_wind_data(data, 'wind_route4_converge.json', 'Converging-diverging route')

print("Generating clean route-only wind fields...")
print()

route_1_with_eddies()
route_2_spiral_path()
route_3_snake_with_loops()
route_4_converging_diverging()

print()
print("All clean routes generated!")
print()
print("Generated files:")
print("  1. wind_route1_eddies.json - Winding path with two eddies (recommended)")
print("  2. wind_route2_spiral.json - Spiral path route")
print("  3. wind_route3_snake.json - Snake path with loops")
print("  4. wind_route4_converge.json - Converging then diverging")
