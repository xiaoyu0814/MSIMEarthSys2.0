// 风场数据处理模块

import {
  updateAllLegendPositions,
  createLegendElement
} from './weatherUtils.js'

let wind3d = null
let windGuiInstance = null
let windDataPaths = []
let windConfig = null
let windBounds = null
let originalWindData = null // 保存原始风场数据
let currentFilteredData = null // 保存当前筛选后的数据

// 筛选配置
let filterConfig = {
  minLevel: 0, // 最小层级索引
  maxLevel: 5, // 最大层级索引
  targetWindDirection: 0, // 目标风向（度，0-360）
  windDirectionTolerance: 45, // 风向容差（度）
  enableLevelFilter: false,
  enableDirectionFilter: false
}

/**
 * 初始化风场配置
 */
export function initWindConfig(weatherConfig) {
  if (!weatherConfig?.wind) {
    console.warn('风场配置未找到')
    return
  }

  const config = weatherConfig.wind
  windDataPaths = config.texturePaths || []
  windBounds = config.bounds
  
  windConfig = {
    minLon: config.minLon || 118,
    maxLon: config.maxLon || 120,
    minLat: config.minLat || 24,
    maxLat: config.maxLat || 26,
    windThickness: config.windThickness || 16000
  }
}

/**
 * 添加风场数据
 */
export async function addWind(MSIMEarth, EarthViewer) {
  try {
    wind3d = new window.EarthPlugn.Wind3D(EarthViewer, {
      minLon: windConfig.minLon,
      maxLon: windConfig.maxLon,
      minLat: windConfig.minLat,
      maxLat: windConfig.maxLat,
      windThickness: windConfig.windThickness
    })

    EarthViewer.scene.primitives.add(wind3d)
    
    if (windDataPaths.length > 0) {
      // 先加载原始数据
      await loadOriginalWindData(windDataPaths[0].path)
      wind3d.switchToRealDataWithBounds(
        windDataPaths[0].path,
        windBounds
      )
    }

    // 设置相机位置
    const centerLon = (windBounds.lo1 + windBounds.lo2) / 2
    const centerLat = (windBounds.la1 + windBounds.la2) / 2
    const lonDiff = windBounds.lo2 - windBounds.lo1
    const latDiff = windBounds.la2 - windBounds.la1
    const maxDiff = Math.max(lonDiff, latDiff)
    const cameraHeight = maxDiff * 111000 * 3

    EarthViewer.camera.setView({
      destination: MSIMEarth.Cartesian3.fromDegrees(centerLon, centerLat, cameraHeight),
    })

    window.wind3dInstance = wind3d

    // 创建图例
    createWindLegend()

    // 创建GUI
    await createWindGui()

  } catch (error) {
    console.error('加载风场数据失败:', error)
  }
}

/**
 * 加载原始风场数据
 */
async function loadOriginalWindData(path) {
  try {
    const response = await fetch(path)
    originalWindData = await response.json()
    // 初始化筛选配置
    if (originalWindData?.header?.levels) {
      filterConfig.maxLevel = originalWindData.header.levels.length - 1
    }
    console.log('原始风场数据加载成功:', originalWindData)
  } catch (error) {
    console.error('加载原始风场数据失败:', error)
  }
}

/**
 * 计算风向（度）
 */
function calculateWindDirection(u, v) {
  // 风向是风吹来的方向，与风矢量相反
  let direction = Math.atan2(-u, -v) * (180 / Math.PI)
  if (direction < 0) {
    direction += 360
  }
  return direction
}

/**
 * 计算风速
 */
function calculateWindSpeed(u, v) {
  return Math.sqrt(u * u + v * v)
}

/**
 * 判断风向是否在目标范围内
 */
function isDirectionInRange(currentDir, targetDir, tolerance) {
  let diff = Math.abs(currentDir - targetDir)
  if (diff > 180) {
    diff = 360 - diff
  }
  return diff <= tolerance
}

/**
 * 应用筛选
 */
function applyFilter() {
  if (!originalWindData) {
    console.warn('没有原始风场数据可筛选')
    return
  }

  const { header, data } = originalWindData
  const { nx, ny, nz, levels } = header

  // 创建筛选后的数据副本
  currentFilteredData = JSON.parse(JSON.stringify(originalWindData))
  
  const startLevel = filterConfig.enableLevelFilter ? filterConfig.minLevel : 0
  const endLevel = filterConfig.enableLevelFilter ? filterConfig.maxLevel : nz - 1
  
  // 更新层级信息
  if (filterConfig.enableLevelFilter) {
    currentFilteredData.header.nz = endLevel - startLevel + 1
    currentFilteredData.header.levels = levels.slice(startLevel, endLevel + 1)
    if (header.levelHeights) {
      currentFilteredData.header.levelHeights = header.levelHeights.slice(startLevel, endLevel + 1)
    }
  }

  // 遍历每个数据点进行筛选
  const u = []
  const v = []
  const w = []

  for (let z = startLevel; z <= endLevel; z++) {
    for (let y = 0; y < ny; y++) {
      for (let x = 0; x < nx; x++) {
        const index = z * ny * nx + y * nx + x
        const uVal = data.u[index]
        const vVal = data.v[index]
        const wVal = data.w[index]

        // 如果启用了方向筛选
        if (filterConfig.enableDirectionFilter) {
          const speed = calculateWindSpeed(uVal, vVal)
          if (speed > 0.1) { // 只对有风速的点进行筛选
            const direction = calculateWindDirection(uVal, vVal)
            if (!isDirectionInRange(direction, filterConfig.targetWindDirection, filterConfig.windDirectionTolerance)) {
              // 不在范围内的点设置为0
              u.push(0)
              v.push(0)
              w.push(0)
              continue
            }
          }
        }

        // 保留数据
        u.push(uVal)
        v.push(vVal)
        w.push(wVal)
      }
    }
  }

  currentFilteredData.data.u = u
  currentFilteredData.data.v = v
  currentFilteredData.data.w = w

  console.log('筛选完成', currentFilteredData)
  return currentFilteredData
}

/**
 * 保存筛选后的数据
 */
function saveFilteredData() {
  const dataToSave = currentFilteredData || originalWindData
  if (!dataToSave) {
    console.warn('没有数据可保存')
    return
  }

  const jsonStr = JSON.stringify(dataToSave, null, 2)
  const blob = new Blob([jsonStr], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = 'filtered_wind_data.json'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
  console.log('数据已保存')
}

/**
 * 应用筛选并更新显示
 */
function applyFilterAndUpdate() {
  const filteredData = applyFilter()
  if (filteredData) {
    // 创建临时 URL 并更新风场显示
    const jsonStr = JSON.stringify(filteredData)
    const blob = new Blob([jsonStr], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    
    wind3d.switchToRealDataWithBounds(url, windBounds)
    
    // 延迟释放 URL
    setTimeout(() => URL.revokeObjectURL(url), 1000)
  }
}

/**
 * 创建风场图例
 */
function createWindLegend() {
  const legend = createLegendElement('wind-legend', '风场图例')
  updateWindLegend()
  setTimeout(updateAllLegendPositions, 100)
}

/**
 * 更新风场图例
 */
export function updateWindLegend() {
  const legend = document.getElementById('wind-legend')
  if (!legend || !wind3d) return

  const currentDataName = windDataPaths[0]?.name || ''

  const legendHTML = `
    <div style="font-weight: bold; margin-bottom: 8px;">风场图例</div>
    <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
      <span>风速 (m/s)</span>
    </div>
    <div style="height: 16px; border-radius: 4px; margin: 8px 0; background: linear-gradient(to right, #00ffff 0%, #00ff00 25%, #ffff00 50%, #ff8800 75%, #ff0000 100%);"></div>
    <div style="display: flex; justify-content: space-between;">
      <span>${wind3d.windSpeedMin?.toFixed(1) || 0}</span>
      <span>${((wind3d.windSpeedMin + wind3d.windSpeedMax) / 2)?.toFixed(1) || 5}</span>
      <span>${wind3d.windSpeedMax?.toFixed(1) || 10}</span>
    </div>
    ${filterConfig.enableLevelFilter || filterConfig.enableDirectionFilter ? 
      `<div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 10px; opacity: 0.8;">
        <div>筛选已启用</div>
        ${filterConfig.enableLevelFilter ? `<div>层级: ${originalWindData?.header?.levels?.[filterConfig.minLevel] || 0}-${originalWindData?.header?.levels?.[filterConfig.maxLevel] || 0}</div>` : ''}
        ${filterConfig.enableDirectionFilter ? `<div>风向: ${filterConfig.targetWindDirection}°±${filterConfig.windDirectionTolerance}°</div>` : ''}
      </div>` : ''
    }
  `

  legend.innerHTML = legendHTML
  setTimeout(updateAllLegendPositions, 50)
}

/**
 * 创建风场GUI控制面板
 */
async function createWindGui() {
  try {
    const dat = await import('dat.gui')
    const windGui = new dat.GUI({ name: '风场参数配置' })

    windGui.domElement.style.position = 'absolute'
    windGui.domElement.style.width = '242px'
    windGui.domElement.style.left = '10px'
    windGui.domElement.style.top = '100px'
    windGui.domElement.style.right = 'auto'
    windGui.domElement.style.zIndex = '1'

    const windFolder = windGui.addFolder('风场参数')
    windFolder.add(wind3d, 'windThickness', 1000, 50000).name('风场厚度').onChange(updateWindLegend)
    windFolder.add(wind3d, 'speedFactor', 0.1, 5).name('速度系数').onChange(updateWindLegend)
    windFolder.add(wind3d, 'cullSpeedMin', 0, 50).name('最小剔除速度')
    windFolder.add(wind3d, 'cullSpeedMax', 10, 200).name('最大剔除速度')
    windFolder.add(wind3d, 'windSpeedMin', 0, 50).name('最小风速显示').onChange(updateWindLegend)
    windFolder.add(wind3d, 'windSpeedMax', 5, 100).name('最大风速显示').onChange(updateWindLegend)
    windFolder.add(wind3d, 'decaySpeed', 0.001, 0.02).name('衰减速度')
    windFolder.add(wind3d, 'alphaFactor', 0.1, 2).name('透明度系数')
    windFolder.add(wind3d, 'tadpoleLength', 50, 1000).name('粒子长度')
    windFolder.add(wind3d, 'tadpoleWidth', 1, 50).name('粒子宽度')

    // 数据切换配置
    const windDataConfig = { currentDataIndex: 0 }
    const dataNames = windDataPaths.map(d => d.name)
    const dataSelector = windFolder.add(windDataConfig, 'currentDataIndex', dataNames).name('数据源')
    dataSelector.onChange(async (selectedName) => {
      const selectedIndex = windDataPaths.findIndex(t => t.name === selectedName)
      if (selectedIndex !== -1) {
        // 加载新的原始数据
        await loadOriginalWindData(windDataPaths[selectedIndex].path)
        wind3d.switchToRealDataWithBounds(windDataPaths[selectedIndex].path, windBounds)
        updateWindLegend()
      }
    })

    windFolder.open()

    // 层级过滤配置
    const levelFilterFolder = windGui.addFolder('层级过滤')
    levelFilterFolder.add(filterConfig, 'enableLevelFilter').name('启用层级过滤').onChange(() => {
      applyFilterAndUpdate()
      updateWindLegend()
    })
    
    // 根据实际数据动态设置范围
    const maxLevelIndex = originalWindData?.header?.levels?.length - 1 || 5
    levelFilterFolder.add(filterConfig, 'minLevel', 0, maxLevelIndex, 1).name('最小层级').onChange(() => {
      if (filterConfig.minLevel > filterConfig.maxLevel) {
        filterConfig.maxLevel = filterConfig.minLevel
      }
      applyFilterAndUpdate()
      updateWindLegend()
    })
    levelFilterFolder.add(filterConfig, 'maxLevel', 0, maxLevelIndex, 1).name('最大层级').onChange(() => {
      if (filterConfig.maxLevel < filterConfig.minLevel) {
        filterConfig.minLevel = filterConfig.maxLevel
      }
      applyFilterAndUpdate()
      updateWindLegend()
    })

    // 风向过滤配置
    const directionFilterFolder = windGui.addFolder('风向过滤')
    directionFilterFolder.add(filterConfig, 'enableDirectionFilter').name('启用风向过滤').onChange(() => {
      applyFilterAndUpdate()
      updateWindLegend()
    })
    directionFilterFolder.add(filterConfig, 'targetWindDirection', 0, 360, 1).name('目标风向(°)').onChange(() => {
      applyFilterAndUpdate()
      updateWindLegend()
    })
    directionFilterFolder.add(filterConfig, 'windDirectionTolerance', 1, 180, 1).name('容差(°)').onChange(() => {
      applyFilterAndUpdate()
      updateWindLegend()
    })

    // 保存数据按钮
    const saveFolder = windGui.addFolder('数据保存')
    const saveConfig = { 
      saveFiltered: () => {
        saveFilteredData()
      },
      resetFilter: () => {
        // 重置筛选
        filterConfig.enableLevelFilter = false
        filterConfig.enableDirectionFilter = false
        // 重新加载原始数据
        if (windDataPaths.length > 0 && window.wind3dInstance) {
          window.wind3dInstance.switchToRealDataWithBounds(windDataPaths[0].path, windBounds)
        }
        updateWindLegend()
        // 刷新 GUI
        for (let i = 0; i < windGui.__controllers.length; i++) {
          windGui.__controllers[i].updateDisplay()
        }
      }
    }
    saveFolder.add(saveConfig, 'saveFiltered').name('保存筛选后数据')
    saveFolder.add(saveConfig, 'resetFilter').name('重置筛选')

    windGuiInstance = windGui
    window.windGuiInstance = windGui

    // 检查是否应该隐藏GUI
    if (window.configPanelVisible === false && windGui.domElement) {
      windGui.domElement.style.display = 'none'
    }
  } catch (error) {
    console.error('Failed to create wind GUI:', error)
  }
}

/**
 * 移除风场数据
 */
export function removeWind(EarthViewer) {
  // 移除图元
  if (wind3d) {
    try {
      EarthViewer.scene.primitives.remove(wind3d)
    } catch (e) {
      console.warn('Error removing wind primitive:', e)
    }
  }

  // 销毁GUI
  if (windGuiInstance) {
    try {
      windGuiInstance.destroy()
    } catch (e) {
      console.warn('Error destroying wind GUI:', e)
    }
    window.windGuiInstance = null
  }

  // 移除图例
  const windLegend = document.getElementById('wind-legend')
  if (windLegend) {
    windLegend.remove()
  }

  // 清理窗口对象
  wind3d = null
  window.wind3dInstance = null
  originalWindData = null
  currentFilteredData = null

  // 更新图例位置
  setTimeout(updateAllLegendPositions, 50)
}
