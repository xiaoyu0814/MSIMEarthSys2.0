# 风场数据生成服务

基于 Flask 框架的风场数据生成管理服务，提供 Web 界面来操作各种风场生成脚本。

## 功能特性

- 🌪️ **13个风场生成脚本** - 包含数据划分、路线生成、风切变等功能
- 🖥️ **Web界面** - 美观的可视化操作界面
- 📋 **实时控制台输出** - 实时查看脚本执行结果
- 📁 **文件管理** - 查看和管理生成的风场数据文件
- 🎯 **分类标签** - 按功能分类的脚本列表

## 项目结构

```
flask/
├── app.py                    # Flask 主应用
├── requirements.txt          # Python 依赖包
├── start.bat                # Windows 启动脚本
├── templates/
│   └── index.html           # 前端页面
└── README.md                # 说明文档
```

## 安装与运行

### 1. 安装依赖

```bash
cd flask
pip install -r requirements.txt
```

或者直接安装 Flask：

```bash
pip install flask
```

### 2. 启动服务

#### Windows 用户

双击运行 `start.bat` 脚本，或在命令行执行：

```bash
cd flask
start.bat
```

#### 手动启动

```bash
cd flask
python app.py
```

### 3. 访问服务

打开浏览器访问：**http://localhost:5000**

## 可用脚本

### 数据划分与拆分 (3个脚本)

- `split_wind_data` - 风场数据九等分
- `split_wind_part4` - wind_part4 二次划分
- `split_taipei_nine` - 原始数据九等分

### 蛇形路线与单风场生成 (6个脚本)

- `extract_single_route` - 对角线路线提取
- `extract_single_route_v2` - 数据主导路线提取
- `gen_wind_shapes` - 多形态风场生成
- `gen_wind_real` - 真实涡流风场生成
- `gen_red_route_v3` - 红色路线改进版
- `gen_long_snake` - 长蛇形风场

### 风切变与垂直风生成 (4个脚本)

- `gen_wind_shear` - 风切变风场
- `gen_small_eddies_vertical` - 小涡流 + 垂直风
- `gen_extreme_winding_vertical` - 极度蜿蜒 + 垂直风
- `gen_interleaved_vertical` - 交错垂直风

## API 接口

### 获取脚本列表
```
GET /api/scripts
```

### 执行脚本
```
POST /api/run-script
Content-Type: application/json
{
  "script_key": "gen_long_snake"
}
```

### 获取文件列表
```
GET /api/files
```

### 获取文件内容
```
GET /api/file-content/<filename>
```

## 数据目录

风场数据文件存储位置：
```
public/static/data/json/wind_json_output/
```

## 使用说明

1. 启动服务
2. 在浏览器访问 http://localhost:5000
3. 选择需要的脚本，点击「执行」按钮
4. 查看控制台输出和生成的文件列表
5. 在系统中加载生成的风场数据

## 注意事项

- 确保 Python 3.x 已安装
- 确保原始数据文件 `wind3d2_radar_taipei.json` 存在
- 脚本执行可能需要几秒钟，请耐心等待
- 所有生成的 JSON 文件都保存在同一个目录

## 技术栈

- **后端** - Flask (Python)
- **前端** - 原生 HTML/CSS/JavaScript
- **数据格式** - JSON

## 统计

- 总计：13个脚本
- 可生成：54个数据文件
- 覆盖：数据划分、路线生成、风切变等多种场景
