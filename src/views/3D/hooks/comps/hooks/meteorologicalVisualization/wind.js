// import { updateAllLegendPositions } from '../../../../../utils/earthPlugin/core/treeManagement/methods/weatherUtils.js';

// 展示风场区域
export function showWindArea(params) {
  let wind3d = new window.EarthPlugn.Wind3D(window.EarthViewer, {
    minLon: 120.22,
    maxLon: 120.37,
    minLat: 24.05,
    maxLat: 24.2,
    windThickness: 16000
  })

  const windBounds = {
    lo1: 120.12,
    lo2: 120.48,
    la1: 24.05,
    la2: 24.2
  }

  // 风场数据文件列表
  const windDataPaths = [
    {
      name: '风场数据',
      path: '/static/data/json/wind_json_output/wind_your_region.json'
    }
  ]
  wind3d.id = 'wind_Test'
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
