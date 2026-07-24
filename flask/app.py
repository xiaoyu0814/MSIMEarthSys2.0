from flask import Flask, render_template, jsonify, request
import subprocess
import json
import os
from pathlib import Path

app = Flask(__name__)

# 风场数据目录
WIND_DATA_DIR = Path(__file__).parent.parent / 'public' / 'static' / 'data' / 'json' / 'wind_json_output'
SCRIPTS_DIR = WIND_DATA_DIR

# 脚本配置 - 所有可用的生成脚本
SCRIPTS = {
    'split_wind_data': {
        'name': '风场数据九等分',
        'description': '将 filtered_wind_data2.json 从左上角开始九等分',
        'script': 'split_wind_data.py',
        'output': ['wind_part1.json', 'wind_part2.json', 'wind_part3.json',
                  'wind_part4.json', 'wind_part5.json', 'wind_part6.json',
                  'wind_part7.json', 'wind_part8.json', 'wind_part9.json']
    },
    'split_wind_part4': {
        'name': 'wind_part4 二次划分',
        'description': '将 wind_part4.json 再次九等分',
        'script': 'split_wind_part4.py',
        'output': ['wind_part4_subparts/']
    },
    'split_taipei_nine': {
        'name': '原始数据九等分',
        'description': '将 wind3d2_radar_taipei.json 从左上角开始九等分',
        'script': 'split_taipei_nine.py',
        'output': ['taipei_part1.json', 'taipei_part2.json', 'taipei_part3.json',
                  'taipei_part4.json', 'taipei_part5.json', 'taipei_part6.json',
                  'taipei_part7.json', 'taipei_part8.json', 'taipei_part9.json']
    },
    'extract_single_route': {
        'name': '对角线路线提取',
        'description': '提取对角线路径',
        'script': 'extract_single_route.py',
        'output': ['wind_single_route.json']
    },
    'extract_single_route_v2': {
        'name': '数据主导路线提取',
        'description': '基于数据平均值提取主要风流动路线',
        'script': 'extract_single_route_v2.py',
        'output': ['wind_single_route_v2.json']
    },
    'gen_wind_shapes': {
        'name': '多形态风场生成',
        'description': '生成10种不同形态的单路线风场',
        'script': 'gen_wind_shapes.py',
        'output': ['wind_single_east.json', 'wind_single_northeast.json',
                  'wind_single_curved.json', 'wind_two_parallel.json',
                  'wind_converging.json', 'wind_crossing.json',
                  'wind_branch.json', 'wind_single_south.json',
                  'wind_diverging.json', 'wind_turbulent.json']
    },
    'gen_wind_real': {
        'name': '真实涡流风场生成',
        'description': '生成符合真实气流规律的风场（含漩涡）',
        'script': 'gen_wind_real.py',
        'output': ['wind_twisted_v1.json', 'wind_converging_v1.json',
                  'wind_northeast_monsoon.json', 'wind_multiple_meanders.json']
    },
    'gen_red_route_v3': {
        'name': '红色路线改进版',
        'description': '基于 red_route_v1 改进的双螺旋 + 蜿蜒路线',
        'script': 'gen_red_route_v3.py',
        'output': ['wind_red_route_v3.json']
    },
    'gen_long_snake': {
        'name': '长蛇形风场',
        'description': '从左上到右下的完整蛇形风场，包含3个螺旋涡流',
        'script': 'gen_long_snake.py',
        'output': ['wind_long_snake_full.json', 'wind_extreme_winding.json']
    },
    'gen_wind_shear': {
        'name': '风切变风场',
        'description': '生成风切变风场（水平、垂直、复合三种）',
        'script': 'gen_wind_shear.py',
        'output': ['wind_horizontal_shear.json', 'wind_vertical_shear.json',
                  'wind_combined_shear.json']
    },
    'gen_small_eddies_vertical': {
        'name': '小涡流 + 垂直风',
        'description': '生成小涡流 + 垂直风（5个小涡流或单个集中涡流）',
        'script': 'gen_small_eddies_vertical.py',
        'output': ['wind_small_eddies_vertical.json', 'wind_focused_eddy_strong.json']
    },
    'gen_extreme_winding_vertical': {
        'name': '极度蜿蜒 + 垂直风',
        'description': '生成极度蜿蜒的蛇形路线，路线上有交替垂直风',
        'script': 'gen_extreme_winding_vertical.py',
        'output': ['wind_extreme_winding_vertical.json', 'wind_winding_vertical_eddies.json']
    },
    'gen_interleaved_vertical': {
        'name': '交错垂直风',
        'description': '生成完整背景平流 + 蜿蜒路线 + 交错上下风',
        'script': 'gen_interleaved_vertical.py',
        'output': ['wind_interleaved_vertical.json', 'wind_blended_vertical.json']
    }
}

@app.route('/')
def index():
    return render_template('index.html', scripts=SCRIPTS)

@app.route('/api/scripts', methods=['GET'])
def get_scripts():
    return jsonify(SCRIPTS)

@app.route('/api/run-script', methods=['POST'])
def run_script():
    try:
        data = request.json
        script_key = data.get('script_key')
        
        if script_key not in SCRIPTS:
            return jsonify({
                'success': False,
                'message': 'Script not found'
            }), 404
        
        script_config = SCRIPTS[script_key]
        script_path = SCRIPTS_DIR / script_config['script']
        
        if not script_path.exists():
            return jsonify({
                'success': False,
                'message': f'Script file not found: {script_path}'
            }), 404
        
        # 运行Python脚本
        result = subprocess.run(
            ['python', str(script_path)],
            cwd=str(SCRIPTS_DIR),
            capture_output=True,
            text=True,
            timeout=60
        )
        
        return jsonify({
            'success': result.returncode == 0,
            'returncode': result.returncode,
            'stdout': result.stdout,
            'stderr': result.stderr,
            'output_files': script_config['output'],
            'message': 'Script executed successfully' if result.returncode == 0 else 'Script execution failed'
        })
        
    except subprocess.TimeoutExpired:
        return jsonify({
            'success': False,
            'message': 'Script execution timed out'
        }), 408
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

@app.route('/api/files', methods=['GET'])
def list_files():
    try:
        json_files = list(WIND_DATA_DIR.glob('*.json'))
        files_info = []
        
        for file_path in json_files:
            stat = file_path.stat()
            files_info.append({
                'name': file_path.name,
                'size': stat.st_size,
                'modified': stat.st_mtime
            })
        
        # 排序，最新修改的在前面
        files_info.sort(key=lambda x: x['modified'], reverse=True)
        
        return jsonify({
            'success': True,
            'files': files_info
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

@app.route('/api/file-content/<filename>', methods=['GET'])
def get_file_content(filename):
    try:
        file_path = WIND_DATA_DIR / filename
        
        if not file_path.exists():
            return jsonify({
                'success': False,
                'message': 'File not found'
            }), 404
        
        with open(file_path, 'r', encoding='utf-8') as f:
            content = json.load(f)
        
        return jsonify({
            'success': True,
            'content': content
        })
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'Error: {str(e)}'
        }), 500

if __name__ == '__main__':
    print(f'Wind Data Service starting...')
    print(f'Data directory: {WIND_DATA_DIR}')
    print(f'Available scripts: {len(SCRIPTS)}')
    
    app.run(host='0.0.0.0', port=5000, debug=True)
