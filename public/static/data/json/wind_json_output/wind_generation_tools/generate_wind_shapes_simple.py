import json
import math
from pathlib import Path

# 读取原始数据
data_dir = Path(__file__).parent
input_file = data_dir / 'wind3d2_radar_taipei.json'

with open(input_file, 'r', encoding='utf-8') as f:
    orig_data = json.load(f)

header = orig_data['header']
nx, ny, nz = header['nx'], header['ny'], header['nz']
lo1, lo2, la1, la2 = header['lo1'], header['lo2'], header['la1'], header['la2']
dx, dy = header['dx'], header['dy']

print(f"原始数据: {nx}x{ny}x{nz}")
print(f"范围: 经度 {lo1:.4f}-{lo2:.4f}, 纬度 {la1:.4f}-{la2:.4f}")
print()

def create_empty_data():
    """创建空的数据数组"""
    return {
        'u': [0.0] * (nx * ny * nz),
        'v': [0.0] * (nx * ny * nz),
        'w': [0.0] * (nx * ny * nz)
    }

def idx(z, y, x):
    """计算数组索引"""
    return z * ny * nx + y * nx + x

def simple_smooth(data, iterations=2):
    """简单的平滑处理（不依赖scipy）"""
    new_data = create_empty_data()
    
    for it in range(iterations):
        if it > 0:
            data = new_data
            new_data = create_empty_data()
        
        for z in range(nz):
            for y in range(ny):
                for x in range(nx):
                    i = idx(z, y, x)
                    
                    sum_u = data['u'][i]
                    sum_v = data['v'][i]
                    sum_w = data['w'][i]
                    count = 1.0
                    
                    # 检查邻居
                    for dy in [-1, 0, 1]:
                        for dx in [-1, 0, 1]:
                            if dy == 0 and dx == 0:
                                continue
                            
                            ny_val = y + dy
                            nx_val = x + dx
                            
                            if 0 <= ny_val < ny and 0 <= nx_val < nx:
                                ni = idx(z, ny_val, nx_val)
                                sum_u += data['u'][ni]
                                sum_v += data['v'][ni]
                                sum_w += data['w'][ni]
                                count += 1.0
                    
                    new_data['u'][i] = sum_u / count
                    new_data['v'][i] = sum_v / count
                    new_data['w'][i] = sum_w / count
    
    return new_data

def save_wind_data(data, filename, comment=""):
    """保存风场数据"""
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
    
    print(f"✓ {filename}: 保留 {count}/{total} 点 ({count/total*100:.1f}%)")

def generate_single_route_horizontal():
    """形态1: 单一水平流动（从西向东）"""
    data = create_empty_data()
    
    route_y = ny // 2
    route_width = 3
    speed = 15.0
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                dist = abs(y - route_y)
                if dist <= route_width:
                    attenuation = 1.0 - dist / route_width
                    speed_factor = speed * attenuation
                    
                    # 风向：从西向东（正西风）
                    i = idx(z, y, x)
                    data['u'][i] = 0.0
                    data['v'][i] = speed_factor
                    data['w'][i] = 0.0
    
    data = simple_smooth(data, iterations=2)
    save_wind_data(data, 'wind_single_east.json', 'Single horizontal route - west to east')

def generate_single_route_diagonal():
    """形态2: 单一对角线流动（从西北到东南）"""
    data = create_empty_data()
    
    route_width = 3
    speed = 12.0
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                dist = abs(y - x)
                if dist <= route_width:
                    attenuation = 1.0 - dist / route_width
                    speed_factor = speed * attenuation
                    
                    i = idx(z, y, x)
                    data['u'][i] = speed_factor * 0.707
                    data['v'][i] = speed_factor * 0.707
                    data['w'][i] = 0.0
    
    data = simple_smooth(data, iterations=2)
    save_wind_data(data, 'wind_single_northeast.json', 'Single diagonal route - northwest to southeast')

def generate_single_route_curved():
    """形态3: 弯曲流动路线"""
    data = create_empty_data()
    
    route_width = 3
    speed = 14.0
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                import math
                curve_y = int(ny/2 + 5 * math.sin(x/nx * 3))
                dist = abs(y - curve_y)
                if dist <= route_width:
                    attenuation = 1.0 - dist / route_width
                    speed_factor = speed * attenuation
                    
                    i = idx(z, y, x)
                    data['u'][i] = speed_factor * 0.2 * math.cos(x/nx * 4)
                    data['v'][i] = speed_factor
                    data['w'][i] = 0.0
    
    data = simple_smooth(data, iterations=2)
    save_wind_data(data, 'wind_single_curved.json', 'Single curved route')

def generate_two_routes_parallel():
    """形态4: 两条平行路线"""
    data = create_empty_data()
    
    route_y1 = ny // 3
    route_y2 = 2 * ny // 3
    route_width = 2
    speed = 13.0
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                dist1 = abs(y - route_y1)
                dist2 = abs(y - route_y2)
                
                i = idx(z, y, x)
                
                if dist1 <= route_width:
                    attenuation = 1.0 - dist1 / route_width
                    data['u'][i] = 0.0
                    data['v'][i] = speed * attenuation
                elif dist2 <= route_width:
                    attenuation = 1.0 - dist2 / route_width
                    data['u'][i] = 0.0
                    data['v'][i] = -speed * attenuation  # 反向
    
    data = simple_smooth(data, iterations=2)
    save_wind_data(data, 'wind_two_parallel.json', 'Two parallel routes - opposite directions')

def generate_two_routes_converging():
    """形态5: 两条路线交汇（从东西向中心汇聚）"""
    data = create_empty_data()
    
    center_x = nx // 2
    center_y = ny // 2
    route_width = 3
    speed = 14.0
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                # 两条路线：一条从左上到中心，一条从右上到中心
                line1_dist = abs(2*y - (nx - x))  # 左上→中心
                line2_dist = abs(2*y - x)  # 右上→中心
                
                i = idx(z, y, x)
                
                if line1_dist <= route_width * 2:
                    attenuation = 1.0 - line1_dist / (route_width * 2)
                    speed_factor = speed * attenuation
                    
                    dx = center_x - x
                    dy = center_y - y
                    dist = math.sqrt(dx*dx + dy*dy)
                    if dist > 0:
                        data['u'][i] = speed_factor * dx / dist
                        data['v'][i] = speed_factor * dy / dist
                
                elif line2_dist <= route_width * 2:
                    attenuation = 1.0 - line2_dist / (route_width * 2)
                    speed_factor = speed * attenuation
                    
                    dx = center_x - x
                    dy = center_y - y
                    dist = math.sqrt(dx*dx + dy*dy)
                    if dist > 0:
                        data['u'][i] = speed_factor * dx / dist
                        data['v'][i] = speed_factor * dy / dist
    
    data = simple_smooth(data, iterations=2)
    save_wind_data(data, 'wind_converging.json', 'Two routes converging to center')

def generate_two_routes_crossing():
    """形态6: 两条路线十字交叉"""
    data = create_empty_data()
    
    center_x = nx // 2
    center_y = ny // 2
    route_width = 2
    speed = 12.0
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                if abs(y - center_y) <= route_width:
                    attenuation = 1.0 - abs(y - center_y) / route_width
                    speed_factor = speed * attenuation
                    data['u'][i] = 0.0
                    data['v'][i] = speed_factor
                
                elif abs(x - center_x) <= route_width:
                    attenuation = 1.0 - abs(x - center_x) / route_width
                    speed_factor = speed * attenuation
                    data['u'][i] = speed_factor
                    data['v'][i] = 0.0
    
    data = simple_smooth(data, iterations=2)
    save_wind_data(data, 'wind_crossing.json', 'Two routes crossing at center')

def generate_route_with_branch():
    """形态7: 主干加分支"""
    data = create_empty_data()
    
    main_y = ny // 2
    branch_x = nx // 3
    route_width = 2
    speed = 13.0
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                i = idx(z, y, x)
                
                if abs(y - main_y) <= route_width:
                    attenuation = 1.0 - abs(y - main_y) / route_width
                    data['u'][i] = 0.0
                    data['v'][i] = speed * attenuation
                
                elif x >= branch_x and abs(x - branch_x) <= route_width and y >= main_y:
                    attenuation = 1.0 - abs(x - branch_x) / route_width
                    dist_from_main = y - main_y
                    if dist_from_main <= ny/3:
                        branch_attenuation = 1.0 - dist_from_main / (ny/3)
                        data['u'][i] = speed * attenuation * branch_attenuation
                        data['v'][i] = 0.0
    
    data = simple_smooth(data, iterations=2)
    save_wind_data(data, 'wind_branch.json', 'Main route with branch')

def generate_vertical_route():
    """形态8: 垂直单一流动（从北向南）"""
    data = create_empty_data()
    
    route_x = nx // 2
    route_width = 3
    speed = 14.0
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                dist = abs(x - route_x)
                if dist <= route_width:
                    attenuation = 1.0 - dist / route_width
                    speed_factor = speed * attenuation
                    
                    i = idx(z, y, x)
                    data['u'][i] = speed_factor
                    data['v'][i] = 0.0
                    data['w'][i] = 0.0
    
    data = simple_smooth(data, iterations=2)
    save_wind_data(data, 'wind_single_south.json', 'Single vertical route - north to south')

def generate_diverging_routes():
    """形态9: 从中心向外发散"""
    data = create_empty_data()
    
    center_x, center_y = nx//2, ny//2
    route_width = 2
    speed = 15.0
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                dx = x - center_x
                dy = y - center_y
                dist = math.sqrt(dx*dx + dy*dy)
                
                main_routes = [
                    (1, 1),    # 东南
                    (-1, 1),   # 西南
                    (1, -1),   # 东北
                    (-1, -1),  # 西北
                ]
                
                i = idx(z, y, x)
                
                for (dir_x, dir_y) in main_routes:
                    dot_product = dx * dir_x + dy * dir_y
                    cross_product = dx * dir_y - dy * dir_x
                    
                    if dot_product > 0 and abs(cross_product) <= route_width * 3:
                        attenuation = 1.0 - abs(cross_product) / (route_width * 3)
                        speed_factor = speed * attenuation
                        
                        norm = math.sqrt(dir_x*dir_x + dir_y*dir_y)
                        data['u'][i] = speed_factor * dir_x / norm
                        data['v'][i] = speed_factor * dir_y / norm
                        break
    
    data = simple_smooth(data, iterations=2)
    save_wind_data(data, 'wind_diverging.json', 'Routes diverging from center')

def generate_turbulent_route():
    """形态10: 单一但带有小扰动的路线"""
    import random
    data = create_empty_data()
    
    route_y = ny // 2
    route_width = 4
    speed = 12.0
    
    for z in range(nz):
        for y in range(ny):
            for x in range(nx):
                dist = abs(y - route_y)
                if dist <= route_width:
                    attenuation = 1.0 - dist / route_width
                    speed_factor = speed * attenuation
                    
                    i = idx(z, y, x)
                    perturb_u = (random.random() - 0.5) * 3.0
                    perturb_v = (random.random() - 0.5) * 2.0
                    
                    data['u'][i] = perturb_u
                    data['v'][i] = speed_factor + perturb_v
                    data['w'][i] = 0.0
    
    data = simple_smooth(data, iterations=3)
    save_wind_data(data, 'wind_turbulent.json', 'Single route with turbulence')

# 生成所有形态
print("正在生成多种风场形态...")
print()

generate_single_route_horizontal()
generate_single_route_diagonal()
generate_single_route_curved()
generate_two_routes_parallel()
generate_two_routes_converging()
generate_two_routes_crossing()
generate_route_with_branch()
generate_vertical_route()
generate_diverging_routes()
generate_turbulent_route()

print()
print("✓ 所有形态生成完成！")
print()
print("生成的文件：")
print("  1. wind_single_east.json    - 单一水平流动（西→东）")
print("  2. wind_single_northeast.json - 单一对角线流动（西北→东南）")
print("  3. wind_single_curved.json   - 弯曲流动路线")
print("  4. wind_two_parallel.json   - 两条平行反向路线")
print("  5. wind_converging.json     - 两条路线交汇到中心")
print("  6. wind_crossing.json       - 两条路线十字交叉")
print("  7. wind_branch.json         - 主干加分支")
print("  8. wind_single_south.json   - 单一垂直流动（北→南）")
print("  9. wind_diverging.json      - 从中心向外发散")
print(" 10. wind_turbulent.json      - 带扰动的流动")
