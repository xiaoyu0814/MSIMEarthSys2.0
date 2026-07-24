// import { updateAllLegendPositions } from '../../../../../utils/earthPlugin/core/treeManagement/methods/weatherUtils.js';

// 展示风场区域
export function showWindArea(params) {
  let wind3d = new window.EarthPlugn.Wind3D(window.EarthViewer, {
    // 经纬度范围
    minLon: params.minLon || 120.22,
    maxLon: params.maxLon || 120.37,
    minLat: params.minLat || 24.05,
    maxLat: params.maxLat || 24.2,

    // 高度范围
    minHeight: params.minHeight !== undefined ? params.minHeight : 0,
    maxHeight: params.maxHeight !== undefined ? params.maxHeight : 16000,
    windThickness: params.windThickness || 16000,

    // 风速相关
    maxWindSpeed: params.maxWindSpeed || 20,
    windSpeedMin: params.windSpeedMin !== undefined ? params.windSpeedMin : 0,
    windSpeedMax: params.windSpeedMax !== undefined ? params.windSpeedMax : 20,
    cullSpeedMin: params.cullSpeedMin !== undefined ? params.cullSpeedMin : 1,
    cullSpeedMax: params.cullSpeedMax !== undefined ? params.cullSpeedMax : 100,
    speedFactor: params.speedFactor !== undefined ? params.speedFactor : 1,

    // 透明度相关
    alphaFactor: params.alphaFactor !== undefined ? params.alphaFactor : 1,
    decaySpeed: params.decaySpeed !== undefined ? params.decaySpeed : 0.005,

    // 显示模式
    visualMode: params.visualMode || 'tadpole',

    // tadpole模式参数
    tadpoleLength: params.tadpoleLength !== undefined ? params.tadpoleLength : 300,
    tadpoleWidth: params.tadpoleWidth !== undefined ? params.tadpoleWidth : 15,
    tadpoleSegments: params.tadpoleSegments !== undefined ? params.tadpoleSegments : 8,

    // curve模式参数
    curveLength: params.curveLength !== undefined ? params.curveLength : 30000,
    curveWidth: params.curveWidth !== undefined ? params.curveWidth : 800,
    curveSegments: params.curveSegments !== undefined ? params.curveSegments : 16,

    // arrow模式参数
    arrowLength: params.arrowLength !== undefined ? params.arrowLength : 15000,
    trailLength: params.trailLength !== undefined ? params.trailLength : 20000,

    // 显隐控制
    show: params.show !== undefined ? Boolean(params.show) : true
  })

  const windBounds = {
    lo1: params.minLon || 120.12,
    lo2: params.maxLon || 120.48,
    la1: params.minLat || 24.05,
    la2: params.maxLat || 24.2,
    minHeight: params.minHeight !== undefined ? params.minHeight : 0,
    maxHeight: params.maxHeight !== undefined ? params.maxHeight : 16000
  }

  // 风场数据文件列表
  const windDataPaths = [
    {
      name: params.name || '风场数据',
      path: params.path || '/static/data/json/wind_json_output/wind_your_region.json'
    }
  ]
  wind3d.id = params.id || 'wind_Test'
  window.EarthViewer.scene.primitives.add(wind3d)
  wind3d.switchToRealDataWithBounds(windDataPaths[0].path, windBounds)

  const centerLon = (windBounds.lo1 + windBounds.lo2) / 2
  const centerLat = (windBounds.la1 + windBounds.la2) / 2
  const lonDiff = windBounds.lo2 - windBounds.lo1
  const latDiff = windBounds.la2 - windBounds.la1
  const maxDiff = Math.max(lonDiff, latDiff)

  const cameraHeight = maxDiff * 111000 * 3

  // if (store.getters.getChangeCameraView != '第三视角') {
  //   window.EarthViewer.camera.setView({
  //     destination: window.MSIMEarth.Cartesian3.fromDegrees(
  //       centerLon,
  //       centerLat,
  //       cameraHeight
  //     )
  //     // orientation: {
  //     //   heading: window.MSIMEarth.Math.toRadians(0),
  //     //   pitch: window.MSIMEarth.Math.toRadians(-60),
  //     //   roll: window.MSIMEarth.Math.toRadians(0)
  //     // }
  //   })
  // }

  window.wind3dInstance = wind3d

  createWindLegend(wind3d)
}

// 更新风场区域
export function updateWindArea(target) {
  const { lat, lon, alt } = target
  const camera = document.getElementById('camera')
  camera.position.set(lat, lon, alt)
}

// 清除风场区域
export function clearWindArea() {
  const camera = document.getElementById('camera')
  camera.position.set(0, 0, 0)
}

// 创建风场图例
function createWindLegend(wind3d) {
  let legend = document.getElementById('wind-legend')
  if (!legend) {
    legend = document.createElement('div')
    legend.id = 'wind-legend'
    legend.style.cssText = `
                  display: block;
                  position: absolute;
                  top: 80px;
                  right: 120px;
                  background: rgba(0, 0, 0, 0.7);
                  padding: 12px 15px;
                  border-radius: 8px;
                  color: white;
                  font-size: 12px;
                  z-index: 1;
                  min-width: 180px;
                `
    document.body.appendChild(legend)
  }
  updateWindLegend(wind3d)
  // 短暂延迟后更新所有图例位置
  setTimeout(updateAllLegendPositions, 100)
}

function updateWindLegend(wind3d) {
  const legend = document.getElementById('wind-legend')
  if (!legend) return

  const arrowStyle = `
                display: inline-block;
                width: 0;
                height: 0;
                border-top: 6px solid transparent;
                border-bottom: 6px solid transparent;
                border-left: 10px solid #00ffff;
                margin-right: 5px;
              `

  const colorBarStyle = `
                height: 16px;
                border-radius: 4px;
                margin: 8px 0;
                background: linear-gradient(to right, 
                  #00ffff 0%, 
                  #00ff00 25%, 
                  #ffff00 50%, 
                  #ff8800 75%, 
                  #ff0000 100%
                );
              `

  let legendHTML = `
                <div style="font-weight: bold; margin-bottom: 8px;">风场图例</div>
                <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
                  <span>风速 (m/s)</span>
                </div>
                <div style="${colorBarStyle}"></div>
                <div style="display: flex; justify-content: space-between;">
                  <span>${wind3d.windSpeedMin.toFixed(1)}</span>
                  <span>${(
      (wind3d.windSpeedMin + wind3d.windSpeedMax) /
      2
    ).toFixed(1)}</span>
                  <span>${wind3d.windSpeedMax.toFixed(1)}</span>
                </div>
              `

  legendHTML += `</div>`
  legend.innerHTML = legendHTML
  // 更新内容变化后重新排列
  // setTimeout(updateAllLegendPositions, 50)
}
