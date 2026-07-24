@echo off
echo ========================================
echo    风场数据生成服务 - 启动脚本
echo ========================================
echo.

cd /d "%~dp0"

echo 检查Python环境...
python --version
if errorlevel 1 (
    echo [错误] 未找到Python，请先安装Python 3.x
    pause
    exit /b 1
)

echo.
echo 检查依赖包...
python -c "import flask" 2>nul
if errorlevel 1 (
    echo [提示] Flask未安装，正在安装...
    pip install -r requirements.txt
)

echo.
echo ========================================
echo    启动服务中...
echo    访问地址: http://localhost:5000
echo ========================================
echo.

python app.py

pause
