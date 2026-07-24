# 风场数据生成工具使用说明

## 📂 文件夹内容

```
wind_generation_tools/
├── generate_wind_shapes.py        # 风场形状生成（10种形态）
├── generate_wind_shapes_simple.py # 简化版本
├── generate_realistic_wind.py    # 真实风场生成（含涡流）
├── gen_wind_shear.py             # 风切变生成
├── gen_wind_real.py              # 真实风场（符合气流规律）
├── gen_snake_variants.py         # 蛇形路线变种
├── gen_small_eddies_vertical.py  # 小涡流 + 垂直风
├── gen_red_route_v3.py           # 红色路线v3（双螺旋 + 蜿蜒）
├── gen_red_route_v2.py           # 红色路线v2
├── gen_red_route.py              # 原始红色路线
├── gen_long_snake.py             # 长蛇形完整风场
├── gen_interleaved_vertical.py   # 交错垂直风
├── gen_extreme_winding_vertical.py # 极度蜿蜒垂直风
├── gen_clean_routes.py           # 清理路线
└── 风场数据生成列表.html           # 完整列表说明
```

---

## 🌪️ 工具分类说明

### 第一类：数据划分与拆分

| 工具 | 功能 |
|------|------|
| split_wind_data.py | 九等分原始数据 |
| split_wind_part4.py | 二次九等分 |
| split_taipei_nine.py | 台北风场九等分 |

---

### 第二类：蛇形路线与单风场生成 ⭐

#### 1. 基础形状（generate_wind_shapes.py）
生成 10 种基础形态：
- 水平路线
- 对角线路线
- 曲线蜿蜒
- 双平行路线
- 交汇路线
- 十字交叉
- 分支路线
- 垂直路线
- 发散路线
- 扰动路线

#### 2. 真实风场（gen_wind_real.py）
生成符合真实气流规律的风场：
- 多螺旋结构
- 蜿蜒路线
- 自然扰动

#### 3. 长蛇形（gen_long_snake.py）⭐ 推荐
从左上到右下的完整蛇形：
- 3 个大型螺旋
- 复杂蜿蜒
- 完整覆盖

#### 4. 蛇形变种（gen_snake_variants.py）
生成 5 种不同粗细和蜿蜒度：
- 超细路线
- 细路线
- 中粗路线
- 双路线
- 大漩涡路线

#### 5. 红色路线（gen_red_route_v3.py）
基于你绘制的红色路线：
- 双螺旋结构
- 蜿蜒路径
- 自然过渡

---

### 第三类：风切变与垂直风

#### 1. 风切变（gen_wind_shear.py）
三种风切变类型：
- 水平切变
- 垂直切变
- 复合切变

#### 2. 小涡流（gen_small_eddies_vertical.py）
- 5 个小涡流
- 集中强涡流

#### 3. 交错垂直（gen_interleaved_vertical.py）⭐ 推荐
完整背景平流 + 路线交错上下风

#### 4. 极度蜿蜒垂直（gen_extreme_winding_vertical.py）
最复杂的蜿蜒 + 垂直风组合

---

## 🚀 快速开始

### 推荐测试顺序

1. **长蛇形**（最直观）
```bash
cd wind_generation_tools
python gen_long_snake.py
```

2. **红色路线**（接近你绘制的）
```bash
python gen_red_route_v3.py
```

3. **交错垂直风**（适合飞机风切变测试）
```bash
python gen_interleaved_vertical.py
```

4. **小涡流垂直风**（紧凑结构）
```bash
python gen_small_eddies_vertical.py
```

---

## 📋 完整功能列表

| 类型 | 脚本文件 | 生成文件数 | 特点 |
|------|----------|----------|------|
| 基础形状 | generate_wind_shapes.py | 10 个 | 10种简单形态 |
| 真实风场 | gen_wind_real.py | 4 个 | 真实涡流规律 |
| 蛇形路线 | gen_long_snake.py | 2 个 | 完整覆盖蜿蜒 |
| 蛇形变种 | gen_snake_variants.py | 5 个 | 不同粗细 |
| 红色路线 | gen_red_route_v3.py | 1 个 | 双螺旋 |
| 风切变 | gen_wind_shear.py | 3 个 | 三种切变 |
| 小涡流 | gen_small_eddies_vertical.py | 2 个 | 紧凑涡流 |
| 交错垂直 | gen_interleaved_vertical.py | 2 个 | 背景平流 |
| 极度蜿蜒 | gen_extreme_winding_vertical.py | 2 个 | 最复杂 |

---

## 💡 使用技巧

### 1. 如何选择合适的工具？

| 你的需求 | 推荐工具 |
|----------|----------|
| 快速测试 | generate_wind_shapes.py |
| 真实气流 | gen_wind_real.py |
| 完整蛇形 | gen_long_snake.py |
| 风切变测试 | gen_interleaved_vertical.py 或 gen_wind_shear.py |
| 紧凑结构 | gen_small_eddies_vertical.py |
| 极度蜿蜒 | gen_extreme_winding_vertical.py |
| 接近你画的 | gen_red_route_v3.py |

---

### 2. 如何调整参数？

每个脚本内部都有参数可以调整：
- 螺旋大小
- 蜿蜒频率
- 路线宽度
- 涡流数量
- 垂直风强度

查看脚本注释了解更多！

---

## 📊 数据范围信息

所有生成的数据都保持：
- **网格大小**：20x20x6
- **经度范围**：121.3100 - 121.5900
- **纬度范围**：24.9400 - 25.1600

---

## 🎯 快速示例

### 示例1：立即生成完整蛇形
```bash
python gen_long_snake.py
```

### 示例2：立即生成风切变数据
```bash
python gen_wind_shear.py
```

### 示例3：立即生成多个变种
```bash
python gen_snake_variants.py
```

---

## 📖 详细查看

打开 `风场数据生成列表.html` 查看完整的文件清单和详细功能说明！

---

## 🎉 开始使用

从 `gen_long_snake.py` 开始，体验完整的蛇形风场！
