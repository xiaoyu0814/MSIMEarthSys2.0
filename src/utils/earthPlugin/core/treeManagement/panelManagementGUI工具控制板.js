/**
 * @Author: RENAO
 * @Date: 2024-09-27 16:15:45
 * @LastEditTime: 2024-10-09 10:00:32
 * @LastEditors: RENAO
 * @Description:
 * @FilePath: \MSIMEarthSysN\src\utils\earthPlugin\core\treeManagement\panelManagement.js
 * @
 */
import basicManagement from './basic.js'
import store from '@/store'
import { addHeatMap, Callback, illumination } from '@/utils/mapTools' // 需替换
import TWHY from '@/utils/earthPlugin/ThirdParty/others/tw/twhy.js' //TW.js 封装好后替换引用
import primitive from '../../scene/primitive/primitive.js'
import entity from '../../scene/entity/entity.js'
import PolygonGeojson from '../../scene/geojson/polygonGeojson.js'
import { radarCreateBylanjieScenario } from '@/utils/mapTools'
import { getPAStatic } from '@/service/SSE'
//import { postLinkLineType } from '@/service/SSE.js'
import { exportSML } from '@/service/campaignSituation.js'
import { pauseTime } from '@/service/timeline'
import { getEMEnvironmentInfo, getRader3DStatic } from '@/service/radar' // 获取本地或服务器上的雷达遮罩数据
import SatelliteSixActController from '../actionController/satelliteSixActController'
import { seaAirJointOperationsPA } from '@/utils/earthPlugin/ThirdParty/eventSource/event/earthEvent'
import { Position } from '@element-plus/icons-vue'
import { getById } from '@/service/experiment/experiment.js'
import { getZZQYData } from '@/service/experiment/experiment.js'
import { getGetOpticalEnvelope, getInfraredSignatureEnvelope } from '@/service/afsim'
import { createWind } from './methods/wind.js'

// 图例位置管理 - 自动计算右上角可用位置
const LEGEND_CONFIG = {
  baseTop: 80,
  baseRight: 120,
  gap: 15,
  legendIds: ['wind-legend', 'humidity-legend', 'ice-legend', 'turbulence-legend']
}

const getNextLegendPosition = (newLegendId) => {
  let currentTop = LEGEND_CONFIG.baseTop
  const gap = LEGEND_CONFIG.gap

  // 按优先级顺序检查已存在的图例
  for (const id of LEGEND_CONFIG.legendIds) {
    if (id === newLegendId) continue
    const legend = document.getElementById(id)
    if (legend && legend.offsetHeight > 0) {
      currentTop += legend.offsetHeight + gap
    }
  }
  return currentTop
}

// 更新所有图例位置
const updateAllLegendPositions = () => {
  let currentTop = LEGEND_CONFIG.baseTop
  const gap = LEGEND_CONFIG.gap

  for (const id of LEGEND_CONFIG.legendIds) {
    const legend = document.getElementById(id)
    if (legend && legend.offsetHeight > 0) {
      legend.style.top = `${currentTop}px`
      legend.style.right = `${LEGEND_CONFIG.baseRight}px`
      currentTop += legend.offsetHeight + gap
    }
  }
}

// GUI面板显示状态 - 默认为显示
let configPanelVisible = true

// 所有GUI实例的ID数组
const guiInstances = [
  { id: 'windGuiInstance', name: 'wind' },
  { id: 'humidityGuiInstance', name: 'humidity' },
  { id: 'iceGuiInstance', name: 'ice' },
  { id: 'turbulenceGuiInstance', name: 'turbulence' }
]

// 切换所有GUI面板的显示/隐藏
const toggleAllGuiPanels = (visible) => {
  for (const guiInfo of guiInstances) {
    const guiInstance = window[guiInfo.id]
    if (guiInstance && guiInstance.domElement) {
      guiInstance.domElement.style.display = visible ? 'block' : 'none'
    }
  }
}

class panelManagement extends basicManagement {
  constructor(options) {
    super()
    this.earth = options.earth || window.MSIMEarth // 初始化Earth对象
    this.viewer = options.viewer || window.EarthViewer // 初始化viewer对象
    this.dataController = null
    this.primitiveManage = new primitive({
      earth: this.earth,
      viewer: this.viewer
    })
    this.entityManage = new entity({
      earth: this.earth,
      viewer: this.viewer
    })
    this.polygonGeojson = new PolygonGeojson({
      earth: this.earth,
      viewer: this.viewer
    })
    this.minhangList = []
    this.pointLabelList = []
  }
  /**
   * 改变勾选状态
   * @param {*} treeNodes 原有树
   * @param {*} val 勾选节点 {name:'',code:'',callback:''}
   * @param {*} type 选中（add）/取消选中
   * @returns
   */
  async updateTickStatus(treeNodes, val, type) {
    let twhy = new TWHY({
      earth: this.earth,
      viewer: this.viewer
    })

    this.dataController = store.getters.getDataControl // 需要通过导入引入
    let res = this.updataTreeNode(treeNodes, val.code, type)
    const sceneAction = new window.EarthPlugn.sceneAction({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
    let cusP = new window.EarthPlugn.customPritive(
      window.MSIMEarth,
      window.EarthViewer
    )
    const connectLineManage = sceneAction.connectLineManagement
    if (val.type && (val.type == 'wmts' || val.type == 'mvt')) {
      //显示或移除西安发布的服务图层
      if (type == 'add') {
        if (val.type == 'wmts') {
          this.dataController.addImagerServer(val.url, val.name)
        } else if (val.type == 'mvt') {
        }
      } else {
        if (val.type == 'wmts') {
          this.dataController.removeLaer(val.name)
        } else if (val.type == 'mvt') {
        }
      }
    } else {
      //原来的图层显隐控制
      if (type == 'add') {
        console.log(val.code)
        switch (val.code) {
          case 'vectorLayer': //矢量底图
            this.dataController.addVectorLayer()
            break
          case 'vectorLayer2': //矢量底图带标注
            this.dataController.addVectorLayer2()
            break
          case 'vectorLayer3': //暗色矢量底图
            this.dataController.addVectorLayerDark()
            break
          case 'terrainImagery': //添加带地形效果的影像图
            this.dataController.addTerrainImageryLayer()
            break
          case 'bingLayer': //全球高清影像
            this.dataController.addbingLayer()
            break
          case 'blackMapUrlLayer': //添加西安发布矢量深色底图
            this.dataController.addBlackMapUrlLayer()
            break
          // addBlackMapUrlLayer
          case 'globalTerrain': //全球地形
            //this.dataController.addTerrianLayer(val.url)
            this.dataController.addTWTerrian()
            break
          case 'areaLayer': //西安发布区域高清影像
            this.dataController.addXiAnAreaLayer()
            break
          case 'yunXuanLayer': //西安发布全球晕眩图
            this.dataController.addXiAnYunXuanLayer()
            break
          case 'TWOSGB': //添加TW地球OSGB
            this.dataController.addTWOSGB()
            break
          case 'earthRotation': //地球自转
            store.commit('setEarthRotate', true)
            Callback(true)
            break
          case 'earthIllumination': //地球关照
            store.commit('setEarthLight', true)
            illumination(true)
            break
          case 'nineLine': //九段线
            this.dataController.addNineLine()
            break
          case 'islandChain': //岛链
            this.dataController._addDaoLian()
            break
          case 'fourSeaTwoBorder': //四海两边
            this.dataController._add4H2B()
            break
          case 'airportRes': //机场资源
            this.dataController.addDLAirport()
            this.dataController.addTWAirport()
            break
          case 'nationalPoint': //国家点
            this.dataController.addChina()
            break
          case 'mainCity': //地名
            this.dataController.addMainCity()
            this.dataController.addMainCityOther(
              './static/data/geojson/蓝方城市.geojson',
              'blue',
              '蓝方城市'
            )
            this.dataController.addMainCityOther(
              './static/data/geojson/绿方基地.geojson',
              'green',
              '绿方基地'
            )
            this.dataController.addMainCityOther(
              './static/data/geojson/紫方城市.geojson',
              'purple',
              '紫方城市'
            )
            this.dataController.addMainCityOther(
              './static/data/geojson/紫方基地.geojson',
              'purple',
              '紫方基地'
            )
            break
          case 'nationalBoundaryLine': //国家边界线
            this.dataController.guojiexian_C()
            this.dataController.guojiexian_O()
            this.dataController.addNineLine()
            break
          case 'importanceTarget': //重要目标
            this.dataController.addImportanceTarget()
            break
          case 'taiwanInformationNetwork': //台湾信息网
            twhy.viewTaiTXW()
            break
          case 'taiwanShippingLine': //台湾海运线
            twhy.viewTaiHYX()
            break
          case 'taiwanStraitNoNavigationZone': //台湾禁航区
            twhy.viewTaiHYJZ()
            break
          case 'regionalAnnotation': //区域标注
            for (let i = 0; i < regionalAnnotationData.length; i++) {
              const element = regionalAnnotationData[i]
              this.entityManage.addPoint(element)
            }
            window.EarthViewer.camera.flyTo({
              destination: new window.MSIMEarth.Cartesian3(
                -2548483.832860743,
                5038706.277587563,
                4361940.679449529
              ),
              orientation: {
                heading: 0.14726916848780203,
                pitch: -1.3839269313705764,
                roll: 0.0002439371395865919
              }
            })
            break
          case 'identificationZone': //防空识别区
            this.dataController.addTWFKSBQ()
            this.dataController._addDHFKSBQ()
            break
          case 'opticalDetectionZone': //光学探测区域
            store.state.AFSIMModule.opticalDqST = true
            let opticalDqST = setInterval(() => {
              if (store.state.AFSIMModule.opticalDqST === false) {
                clearInterval(opticalDqST)
              }
              getGetOpticalEnvelope()
                .then((res) => {
                  cusP.addPrimitiveDQ(res, 'opticalDetectionZone', 'triangles')
                  cusP.addPrimitiveDQ(res, 'opticalDetectionZoneLine', 'lines')
                  if (res.error) {
                    console.log('请求返回错误:', res.error)
                  }
                })
                .catch((err) => {
                  console.log('err', err)
                  setTimeout(() => {
                    cusP.removeDQPrimitive('opticalDetectionZone')
                    cusP.removeDQPrimitive('opticalDetectionZoneLine')
                  }, 500);
                })
            }, 500);
            break
          case 'infraredDetectionZone': //红外探测区域
            store.state.AFSIMModule.infraredDqST = true
            let infraredDqST = setInterval(() => {
              if (store.state.AFSIMModule.infraredDqST === false) {
                clearInterval(infraredDqST)
              }
              getInfraredSignatureEnvelope()
                .then((res) => {
                  cusP.addPrimitiveDQ(res, 'infraredDetectionZone', 'triangles')
                  cusP.addPrimitiveDQ(res, 'infraredDetectionZoneLine', 'lines')
                  if (res.error) {
                    console.log('请求返回错误:', res.error)
                  }
                })
                .catch((err) => {
                  console.log('err', err)
                  setTimeout(() => {
                    cusP.removeDQPrimitive('infraredDetectionZone')
                    cusP.removeDQPrimitive('infraredDetectionZoneLine')
                  }, 500);
                })
            }, 500);
            break
          case 'wind': //风场
            let wind3d = new window.EarthPlugn.Wind3D(window.EarthViewer, {
              cullSpeedMin: 1,
            })
            // "lo1":121.31000061035157,"lo2":121.58999938964844,"la1":24.939999389648438,"la2":25.160000610351563
            const windBounds = {
              lo1: 120.12,
              lo2: 120.48,
              la1: 24.05,
              la2: 24.20,

              // lo1: 120.18,
              // lo2: 120.33,
              // la1: 24.05,
              // la2: 24.2
            }

            // 风场数据文件列表
            const windDataPaths = [
              { name: '雷达数据', path: '/static/data/json/wind_json_output/wind_your_region.json' },
              { name: '2025-08-23 17:12:33', path: '/static/data/json/wind_json_output/FYu_L2A_AFT_PPI_EX4_20250823_171233.json' },
              { name: '2025-08-23 17:13:34', path: '/static/data/json/wind_json_output/FYu_L2A_AFT_PPI_EX4_20250823_171334.json' },
              { name: '2025-08-23 17:14:35', path: '/static/data/json/wind_json_output/FYu_L2A_AFT_PPI_EX4_20250823_171435.json' },
              { name: '2025-08-23 17:15:36', path: '/static/data/json/wind_json_output/FYu_L2A_AFT_PPI_EX4_20250823_171536.json' },
              { name: '2025-08-23 17:16:37', path: '/static/data/json/wind_json_output/FYu_L2A_AFT_PPI_EX4_20250823_171637.json' },
              { name: '2025-08-23 17:17:38', path: '/static/data/json/wind_json_output/FYu_L2A_AFT_PPI_EX4_20250823_171738.json' },
              { name: '2025-08-23 17:18:40', path: '/static/data/json/wind_json_output/FYu_L2A_AFT_PPI_EX4_20250823_171840.json' },
              { name: '2025-08-23 17:19:41', path: '/static/data/json/wind_json_output/FYu_L2A_AFT_PPI_EX4_20250823_171941.json' },
              { name: '2025-08-23 17:20:42', path: '/static/data/json/wind_json_output/FYu_L2A_AFT_PPI_EX4_20250823_172042.json' },
              { name: '2025-08-23 17:21:43', path: '/static/data/json/wind_json_output/FYu_L2A_AFT_PPI_EX4_20250823_172143.json' }
            ]

            window.EarthViewer.scene.primitives.add(wind3d)
            wind3d.switchToRealDataWithBounds(
              windDataPaths[0].path,
              windBounds
            )

            const centerLon = (windBounds.lo1 + windBounds.lo2) / 2
            const centerLat = (windBounds.la1 + windBounds.la2) / 2
            const lonDiff = windBounds.lo2 - windBounds.lo1
            const latDiff = windBounds.la2 - windBounds.la1
            const maxDiff = Math.max(lonDiff, latDiff)

            const cameraHeight = maxDiff * 111000 * 3

            window.EarthViewer.camera.setView({
              destination: window.MSIMEarth.Cartesian3.fromDegrees(centerLon, centerLat, cameraHeight),
              // orientation: {
              //   heading: window.MSIMEarth.Math.toRadians(0),
              //   pitch: window.MSIMEarth.Math.toRadians(-60),
              //   roll: window.MSIMEarth.Math.toRadians(0)
              // }
            })

            window.wind3dInstance = wind3d

            // 存储原始数据
            let originalWindData = null
            let currentFilteredData = null
            let currentDataPath = windDataPaths[0].path

            // 加载原始数据
            const loadOriginalData = async (path) => {
              try {
                const response = await fetch(path)
                originalWindData = await response.json()
                console.log('原始风场数据加载成功:', originalWindData)
              } catch (error) {
                console.error('加载原始风场数据失败:', error)
              }
            }
            loadOriginalData(windDataPaths[0].path)

            // 筛选配置
            const filterConfig = {
              minLevel: 0,
              maxLevel: 24,
              targetWindDirection: 0,
              windDirectionTolerance: 45,
              enableLevelFilter: false,
              enableDirectionFilter: false,
              // 区域筛选配置
              enableAreaFilter: false,
              areaMinLon: windBounds.lo1,
              areaMaxLon: windBounds.lo2,
              areaMinLat: windBounds.la1,
              areaMaxLat: windBounds.la2,
              // 流线筛选配置
              enableStreamlineFilter: false,
              streamlineMode: 'density',  // 'density'(密度采样), 'path'(流线路径), 'speed'(风速阈值)
              streamlineDensity: 3,       // 密度采样间隔（每隔N个点取一个）
              streamlineCount: 8,         // 要提取的流线数量
              streamlineMinSpeed: 5,      // 最小风速阈值（m/s）
              streamlineSeedPoints: [],   // 自定义种子点 [{x, y, z}]
              streamlineMaxLength: 100,   // 单条流线最大点数
              streamlineStepSize: 0.5,     // 追踪步长（网格单位）

              // 数据平滑和增强配置
              enableSmoothing: false,
              smoothingStrength: 1,       // 平滑强度（1-5）
              minSpeedThreshold: 0.1,     // 最小有效风速阈值
              removeIsolatedPoints: true, // 移除孤立点
              enhanceMainFlow: false,     // 增强主流动

              // 密度分析和重构配置
              enableDensityFilter: false, // 启用密度筛选
              densityRadius: 3,           // 密度计算半径（网格数）
              densityThreshold: 0.3,      // 密度保留阈值（0-1）
              minDensityPoints: 5,        // 最小密度点数量
              preserveLocalMax: true      // 保留局部最大值
            }

            // 计算风向（度）
            const calculateWindDirection = (u, v) => {
              let direction = Math.atan2(-u, -v) * (180 / Math.PI)
              if (direction < 0) {
                direction += 360
              }
              return direction
            }

            // 计算风速
            const calculateWindSpeed = (u, v) => {
              return Math.sqrt(u * u + v * v)
            }

            // 判断风向是否在目标范围内
            const isDirectionInRange = (currentDir, targetDir, tolerance) => {
              let diff = Math.abs(currentDir - targetDir)
              if (diff > 180) {
                diff = 360 - diff
              }
              return diff <= tolerance
            }

            // ========== 数据平滑与增强系统 ==========

            // 高斯滤波平滑数据
            const smoothData = (data, nx, ny, nz, strength) => {
              const newU = new Float32Array(data.u.length)
              const newV = new Float32Array(data.v.length)
              const newW = new Float32Array(data.w.length)

              const kernelSize = strength // 3-7 之间的奇数
              const half = Math.floor(kernelSize / 2)

              for (let z = 0; z < nz; z++) {
                for (let y = 0; y < ny; y++) {
                  for (let x = 0; x < nx; x++) {
                    let sumU = 0, sumV = 0, sumW = 0
                    let weightSum = 0

                    for (let dy = -half; dy <= half; dy++) {
                      for (let dx = -half; dx <= half; dx++) {
                        const nxVal = Math.max(0, Math.min(nx - 1, x + dx))
                        const nyVal = Math.max(0, Math.min(ny - 1, y + dy))
                        const dist = Math.sqrt(dx * dx + dy * dy)
                        const weight = Math.exp(-dist / (half + 0.5))

                        const idx = z * ny * nx + nyVal * nx + nxVal
                        sumU += data.u[idx] * weight
                        sumV += data.v[idx] * weight
                        sumW += data.w[idx] * weight
                        weightSum += weight
                      }
                    }

                    const targetIdx = z * ny * nx + y * nx + x
                    newU[targetIdx] = sumU / weightSum
                    newV[targetIdx] = sumV / weightSum
                    newW[targetIdx] = sumW / weightSum
                  }
                }
              }

              return { u: newU, v: newV, w: newW }
            }

            // 移除孤立点并增强主流
            const enhanceFlow = (data, nx, ny, nz, config) => {
              const newU = new Float32Array(data.u)
              const newV = new Float32Array(data.v)
              const newW = new Float32Array(data.w)

              for (let z = 0; z < nz; z++) {
                for (let y = 0; y < ny; y++) {
                  for (let x = 0; x < nx; x++) {
                    const idx = z * ny * nx + y * nx + x
                    const speed = calculateWindSpeed(data.u[idx], data.v[idx])

                    // 移除过慢的点
                    if (speed < config.minSpeedThreshold) {
                      newU[idx] = 0
                      newV[idx] = 0
                      newW[idx] = 0
                      continue
                    }

                    // 检查是否是孤立点
                    if (config.removeIsolatedPoints) {
                      let neighbors = 0
                      for (let dy = -1; dy <= 1; dy++) {
                        for (let dx = -1; dx <= 1; dx++) {
                          if (dx === 0 && dy === 0) continue
                          const nxVal = Math.max(0, Math.min(nx - 1, x + dx))
                          const nyVal = Math.max(0, Math.min(ny - 1, y + dy))
                          const nIdx = z * ny * nx + nyVal * nx + nxVal
                          const nSpeed = calculateWindSpeed(data.u[nIdx], data.v[nIdx])
                          if (nSpeed > config.minSpeedThreshold) {
                            neighbors++
                          }
                        }
                      }
                      // 如果邻居少于2个，则视为孤立点
                      if (neighbors < 2) {
                        newU[idx] = 0
                        newV[idx] = 0
                        newW[idx] = 0
                      }
                    }
                  }
                }
              }

              return { u: newU, v: newV, w: newW }
            }

            // ========== 密度分析与重构系统 ==========

            // 计算数据密度图
            const calculateDensityMap = (data, nx, ny, nz, config) => {
              const densityMap = new Float32Array(nx * ny * nz)
              const radius = config.densityRadius
              const totalPoints = (2 * radius + 1) * (2 * radius + 1)

              for (let z = 0; z < nz; z++) {
                for (let y = 0; y < ny; y++) {
                  for (let x = 0; x < nx; x++) {
                    const centerIdx = z * ny * nx + y * nx + x
                    let validCount = 0

                    // 计算指定半径内的有效点数量
                    for (let dy = -radius; dy <= radius; dy++) {
                      for (let dx = -radius; dx <= radius; dx++) {
                        const nxVal = Math.max(0, Math.min(nx - 1, x + dx))
                        const nyVal = Math.max(0, Math.min(ny - 1, y + dy))
                        const nIdx = z * ny * nx + nyVal * nx + nxVal
                        const speed = calculateWindSpeed(data.u[nIdx], data.v[nIdx])
                        if (speed > config.minSpeedThreshold) {
                          validCount++
                        }
                      }
                    }

                    // 归一化密度到 0-1
                    densityMap[centerIdx] = validCount / totalPoints
                  }
                }
              }

              return densityMap
            }

            // 检测局部最大值（保留流动中心）
            const findLocalMaxima = (densityMap, nx, ny, nz) => {
              const isLocalMax = new Uint8Array(nx * ny * nz)

              for (let z = 0; z < nz; z++) {
                for (let y = 1; y < ny - 1; y++) {
                  for (let x = 1; x < nx - 1; x++) {
                    const idx = z * ny * nx + y * nx + x
                    const density = densityMap[idx]
                    let isMax = true

                    // 检查8个邻居
                    for (let dy = -1; dy <= 1; dy++) {
                      for (let dx = -1; dx <= 1; dx++) {
                        if (dx === 0 && dy === 0) continue
                        const nIdx = z * ny * nx + (y + dy) * nx + (x + dx)
                        if (densityMap[nIdx] > density) {
                          isMax = false
                          break
                        }
                      }
                      if (!isMax) break
                    }

                    if (isMax) {
                      isLocalMax[idx] = 1
                    }
                  }
                }
              }

              return isLocalMax
            }

            // 基于密度重构数据
            const reconstructByDensity = (data, nx, ny, nz, config) => {
              const newU = new Float32Array(data.u.length)
              const newV = new Float32Array(data.v.length)
              const newW = new Float32Array(data.w.length)

              // 1. 计算密度图
              const densityMap = calculateDensityMap(data, nx, ny, nz, config)

              // 2. 查找局部最大值
              const localMaxima = config.preserveLocalMax ? findLocalMaxima(densityMap, nx, ny, nz) : null

              let keptPoints = 0
              let removedPoints = 0

              // 3. 基于密度重构
              for (let z = 0; z < nz; z++) {
                for (let y = 0; y < ny; y++) {
                  for (let x = 0; x < nx; x++) {
                    const idx = z * ny * nx + y * nx + x
                    const density = densityMap[idx]
                    const speed = calculateWindSpeed(data.u[idx], data.v[idx])

                    // 判断是否保留
                    let shouldKeep = false

                    // 条件1: 密度超过阈值
                    if (density >= config.densityThreshold) {
                      shouldKeep = true
                    }

                    // 条件2: 是局部最大值（无论密度如何都保留）
                    if (config.preserveLocalMax && localMaxima[idx] === 1 && speed > config.minSpeedThreshold) {
                      shouldKeep = true
                    }

                    // 条件3: 有足够的邻居密度
                    if (density > 0.1 && speed > config.minSpeedThreshold * 2) {
                      shouldKeep = true
                    }

                    if (shouldKeep) {
                      newU[idx] = data.u[idx]
                      newV[idx] = data.v[idx]
                      newW[idx] = data.w[idx]
                      keptPoints++
                    } else {
                      newU[idx] = 0
                      newV[idx] = 0
                      newW[idx] = 0
                      removedPoints++
                    }
                  }
                }
              }

              console.log('📊 密度重构完成', {
                保留点数: keptPoints,
                移除点数: removedPoints,
                保留率: ((keptPoints / (keptPoints + removedPoints)) * 100).toFixed(1) + '%',
                密度阈值: config.densityThreshold
              })

              return { u: newU, v: newV, w: newW }
            }

            // ========== 流线追踪与筛选系统 ==========

            // 双线性插值获取任意位置的风速分量
            const interpolateWind = (x, y, z, header, data) => {
              const { nx, ny } = header
              const x0 = Math.floor(x)
              const y0 = Math.floor(y)
              const x1 = Math.min(x0 + 1, nx - 1)
              const y1 = Math.min(y0 + 1, ny - 1)

              if (x0 < 0 || y0 < 0 || x0 >= nx || y0 >= ny) {
                return { u: 0, v: 0, w: 0 }
              }

              const fx = x - x0
              const fy = y - y0

              const idx00 = z * ny * nx + y0 * nx + x0
              const idx01 = z * ny * nx + y1 * nx + x0
              const idx10 = z * ny * nx + y0 * nx + x1
              const idx11 = z * ny * nx + y1 * nx + x1

              const u = data.u[idx00] * (1 - fx) * (1 - fy) +
                data.u[idx10] * fx * (1 - fy) +
                data.u[idx01] * (1 - fx) * fy +
                data.u[idx11] * fx * fy

              const v = data.v[idx00] * (1 - fx) * (1 - fy) +
                data.v[idx10] * fx * (1 - fy) +
                data.v[idx01] * (1 - fx) * fy +
                data.v[idx11] * fx * fy

              const w = data.w[idx00] * (1 - fx) * (1 - fy) +
                data.w[idx10] * fx * (1 - fy) +
                data.w[idx01] * (1 - fx) * fy +
                data.w[idx11] * fx * fy

              return { u, v, w }
            }

            // 从种子点追踪一条流线
            const traceStreamline = (seedX, seedY, seedZ, header, data, config) => {
              const streamline = []
              let x = seedX, y = seedY, z = seedZ
              const stepSize = config.streamlineStepSize || 0.5
              const maxLength = config.streamlineMaxLength || 100

              for (let i = 0; i < maxLength; i++) {
                const wind = interpolateWind(x, y, z, header, data)
                const speed = calculateWindSpeed(wind.u, wind.v)

                if (speed < 0.1) break

                streamline.push({
                  x: Math.round(x * 100) / 100,
                  y: Math.round(y * 100) / 100,
                  z: z,
                  u: wind.u,
                  v: wind.v,
                  w: wind.w,
                  speed: speed
                })

                // 使用4阶Runge-Kutta方法积分（简化版）
                const normFactor = stepSize / speed
                x += wind.u * normFactor
                y += wind.v * normFactor

                // 边界检查
                if (x < 0 || x >= header.nx - 1 || y < 0 || y >= header.ny - 1) {
                  break
                }
              }

              return streamline
            }

            // 自动生成种子点（均匀分布或基于风速）
            const generateSeedPoints = (header, data, config) => {
              const { nx, ny, nz } = header
              const seeds = []
              const startLevel = filterConfig.enableLevelFilter ? filterConfig.minLevel : 0
              const endLevel = filterConfig.enableLevelFilter ? filterConfig.maxLevel : nz - 1
              const targetLevel = Math.floor((startLevel + endLevel) / 2)

              // 在中间层均匀分布种子点
              const spacing = Math.max(2, Math.floor(Math.sqrt(nx * ny / config.streamlineCount)))
              for (let y = spacing; y < ny; y += spacing) {
                for (let x = spacing; x < nx; x += spacing) {
                  const index = targetLevel * ny * nx + y * nx + x
                  const speed = calculateWindSpeed(data.u[index], data.v[index])
                  if (speed > config.streamlineMinSpeed) {
                    seeds.push({ x, y, z: targetLevel, speed })
                  }
                }
              }

              // 按风速排序，选择最强的几个点作为种子
              seeds.sort((a, b) => b.speed - a.speed)
              return seeds.slice(0, config.streamlineCount)
            }

            // 密度采样模式 - 简单的网格稀疏化
            const applyDensitySampling = (header, data, config) => {
              const { nx, ny, nz } = header
              const density = config.streamlineDensity || 3
              const startLevel = filterConfig.enableLevelFilter ? filterConfig.minLevel : 0
              const endLevel = filterConfig.enableLevelFilter ? filterConfig.maxLevel : nz - 1

              const newNx = Math.ceil(nx / density)
              const newNy = Math.ceil(ny / density)
              const newNz = endLevel - startLevel + 1

              console.log(`📊 密度采样: ${nx}×${ny} → ${newNx}×${newNy} (间隔: ${density})`)

              const u = [], v = [], w = []

              for (let z = startLevel; z <= endLevel; z++) {
                for (let y = 0; y < ny; y += density) {
                  for (let x = 0; x < nx; x += density) {
                    const index = z * ny * nx + y * nx + x
                    u.push(data.u[index])
                    v.push(data.v[index])
                    w.push(data.w[index])
                  }
                }
              }

              return { u, v, w, newNx, newNy, newNz }
            }

            // 流线路径模式 - 追踪主要流动路线
            const applyStreamlinePathMode = (header, data, config) => {
              console.log('🌀 开始流线路径提取...')

              // 生成种子点
              const seeds = generateSeedPoints(header, data, config)
              console.log(`🌱 生成了 ${seeds.length} 个种子点`)

              // 追踪所有流线
              const streamlines = []
              for (const seed of seeds) {
                const line = traceStreamline(seed.x, seed.y, seed.z, header, data, config)
                if (line.length > 5) { // 只保留足够长的流线
                  streamlines.push(line)
                }
              }

              console.log(`✅ 成功追踪 ${streamlines.length} 条流线`)

              // 将流线数据转换回网格格式
              const u = [], v = [], w = []
              const { nz } = header
              const startLevel = filterConfig.enableLevelFilter ? filterConfig.minLevel : 0
              const endLevel = filterConfig.enableLevelFilter ? filterConfig.maxLevel : nz - 1
              const newNz = endLevel - startLevel + 1

              // 创建稀疏网格，只保留流线路径上的点
              for (let z = startLevel; z <= endLevel; z++) {
                for (let y = 0; y < header.ny; y++) {
                  for (let x = 0; x < header.nx; x++) {
                    // 检查该点是否在任何流线上
                    let foundOnLine = false
                    let bestU = 0, bestV = 0, bestW = 0

                    for (const line of streamlines) {
                      for (const point of line) {
                        if (Math.abs(point.x - x) < 1 && Math.abs(point.y - y) < 1 && Math.abs(point.z - z) < 1) {
                          foundOnLine = true
                          bestU = point.u
                          bestV = point.v
                          bestW = point.w
                          break
                        }
                      }
                      if (foundOnLine) break
                    }

                    u.push(foundOnLine ? bestU : 0)
                    v.push(foundOnLine ? bestV : 0)
                    w.push(foundOnLine ? bestW : 0)
                  }
                }
              }

              return { u, v, w, newNx: header.nx, newNy: header.ny, newNz, streamlines }
            }

            // 风速阈值模式 - 只保留强风区域
            const applySpeedThresholdMode = (header, data, config) => {
              const { nx, ny, nz } = header
              const minSpeed = config.streamlineMinSpeed || 5
              const startLevel = filterConfig.enableLevelFilter ? filterConfig.minLevel : 0
              const endLevel = filterConfig.enableLevelFilter ? filterConfig.maxLevel : nz - 1

              console.log(`💨 风速阈值筛选: 最小风速 ${minSpeed} m/s`)

              const u = [], v = [], w = []
              let keptPoints = 0, removedPoints = 0

              for (let z = startLevel; z <= endLevel; z++) {
                for (let y = 0; y < ny; y++) {
                  for (let x = 0; x < nx; x++) {
                    const index = z * ny * nx + y * nx + x
                    const speed = calculateWindSpeed(data.u[index], data.v[index])

                    if (speed >= minSpeed) {
                      u.push(data.u[index])
                      v.push(data.v[index])
                      w.push(data.w[index])
                      keptPoints++
                    } else {
                      u.push(0)
                      v.push(0)
                      w.push(0)
                      removedPoints++
                    }
                  }
                }
              }

              console.log(`   ✓ 保留: ${keptPoints} 点 | ✗ 移除: ${removedPoints} 点`)
              return { u, v, w, newNx: nx, newNy: ny, newNz: endLevel - startLevel + 1 }
            }

            // 应用流线筛选
            const applyStreamlineFilter = (filteredData) => {
              if (!filteredData) return null

              const { header, data } = filteredData
              let result

              switch (filterConfig.streamlineMode) {
                case 'density':
                  result = applyDensitySampling(header, data, filterConfig)
                  break
                case 'path':
                  result = applyStreamlinePathMode(header, data, filterConfig)
                  break
                case 'speed':
                  result = applySpeedThresholdMode(header, data, filterConfig)
                  break
                default:
                  console.warn('未知的流线筛选模式:', filterConfig.streamlineMode)
                  return filteredData
              }

              // 更新数据
              filteredData.data.u = result.u
              filteredData.data.v = result.v
              filteredData.data.w = result.w
              filteredData.header.nx = result.newNx
              filteredData.header.ny = result.newNy
              filteredData.header.nz = result.newNz

              // 更新地理边界（如果是密度采样）
              if (filterConfig.streamlineMode === 'density') {
                const density = filterConfig.streamlineDensity || 3
                const lonStep = (header.lo2 - header.lo1) / (header.nx - 1)
                const latStep = (header.la2 - header.la1) / (header.ny - 1)
                filteredData.header.lo2 = header.lo1 + (result.newNx - 1) * lonStep * density
                filteredData.header.la2 = header.la1 + (result.newNy - 1) * latStep * density
              }

              console.log('🎯 流线筛选完成:', {
                模式: filterConfig.streamlineMode,
                新网格: `${result.newNx}×${result.newNy}×${result.newNz}`,
                数据点数: result.u.length
              })

              return filteredData
            }

            // 应用筛选
            const applyFilter = () => {
              if (!originalWindData) {
                console.warn('没有原始风场数据可筛选')
                return null
              }

              const { header, data } = originalWindData
              const { nx: origNx, ny: origNy, nz, levels } = header

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

              // 计算经纬度步长
              const lonStep = (header.lo2 - header.lo1) / (origNx - 1)
              const latStep = (header.la2 - header.la1) / (origNy - 1)

              // 确定有效的x和y范围（基于区域筛选）
              let effectiveXStart = 0, effectiveXEnd = origNx - 1
              let effectiveYStart = 0, effectiveYEnd = origNy - 1
              let newNx = origNx, newNy = origNy
              let newLo1 = header.lo1, newLo2 = header.lo2
              let newLa1 = header.la1, newLa2 = header.la2

              if (filterConfig.enableAreaFilter) {
                // 参数有效性检查和自动修正
                let minLon = filterConfig.areaMinLon
                let maxLon = filterConfig.areaMaxLon
                let minLat = filterConfig.areaMinLat
                let maxLat = filterConfig.areaMaxLat

                // 确保 min <= max（如果用户设置反了，自动交换）
                if (minLon > maxLon) {
                  console.warn('⚠️ 经度范围异常：min > max，自动交换')
                    ;[minLon, maxLon] = [maxLon, minLon]
                }
                if (minLat > maxLat) {
                  console.warn('⚠️ 纬度范围异常：min > max，自动交换')
                    ;[minLat, maxLat] = [maxLat, minLat]
                }

                // 限制在原始数据范围内
                minLon = Math.max(minLon, header.lo1)
                maxLon = Math.min(maxLon, header.lo2)
                minLat = Math.max(minLat, header.la1)
                maxLat = Math.min(maxLat, header.la2)

                console.log('📍 区域筛选参数', {
                  用户输入: { lon: `${filterConfig.areaMinLon}-${filterConfig.areaMaxLon}`, lat: `${filterConfig.areaMinLat}-${filterConfig.areaMaxLat}` },
                  实际使用: { lon: `${minLon.toFixed(4)}-${maxLon.toFixed(4)}`, lat: `${minLat.toFixed(4)}-${maxLat.toFixed(4)}` },
                  原始范围: { lon: `${header.lo1}-${header.lo2}`, lat: `${header.la1}-${header.la2}` }
                })

                // 计算区域边界对应的网格索引
                if (origNx > 1 && origNy > 1) {
                  const lonStep = (header.lo2 - header.lo1) / (origNx - 1)
                  const latStep = (header.la2 - header.la1) / (origNy - 1)

                  effectiveXStart = Math.max(0, Math.floor((minLon - header.lo1) / lonStep))
                  effectiveXEnd = Math.min(origNx - 1, Math.ceil((maxLon - header.lo1) / lonStep))
                  effectiveYStart = Math.max(0, Math.floor((minLat - header.la1) / latStep))
                  effectiveYEnd = Math.min(origNy - 1, Math.ceil((maxLat - header.la1) / latStep))

                  // 最终安全检查
                  effectiveXStart = Math.min(effectiveXStart, origNx - 1)
                  effectiveXEnd = Math.max(effectiveXEnd, 0)
                  effectiveYStart = Math.min(effectiveYStart, origNy - 1)
                  effectiveYEnd = Math.max(effectiveYEnd, 0)

                  // 确保有效范围
                  if (effectiveXStart > effectiveXEnd) {
                    console.error(`❌ X轴索引无效: ${effectiveXStart} > ${effectiveXEnd}，使用全范围`)
                    effectiveXStart = 0
                    effectiveXEnd = origNx - 1
                  }
                  if (effectiveYStart > effectiveYEnd) {
                    console.error(`❌ Y轴索引无效: ${effectiveYStart} > ${effectiveYEnd}，使用全范围`)
                    effectiveYStart = 0
                    effectiveYEnd = origNy - 1
                  }

                  newNx = effectiveXEnd - effectiveXStart + 1
                  newNy = effectiveYEnd - effectiveYStart + 1

                  // 计算新的地理边界
                  newLo1 = header.lo1 + effectiveXStart * lonStep
                  newLo2 = header.lo1 + effectiveXEnd * lonStep
                  newLa1 = header.la1 + effectiveYStart * latStep
                  newLa2 = header.la1 + effectiveYEnd * latStep
                } else {
                  console.warn('⚠️ 原始网格维度太小 (nx≤1 或 ny≤1)，无法进行区域筛选')
                }
              }

              // 遍历有效区域内的每个数据点进行筛选
              const u = []
              const v = []
              const w = []

              for (let z = startLevel; z <= endLevel; z++) {
                for (let y = effectiveYStart; y <= effectiveYEnd; y++) {
                  for (let x = effectiveXStart; x <= effectiveXEnd; x++) {
                    // 使用原始数据的索引读取值
                    const origIndex = z * origNy * origNx + y * origNx + x
                    const uVal = data.u[origIndex]
                    const vVal = data.v[origIndex]
                    const wVal = data.w[origIndex]

                    // 如果启用了方向筛选
                    if (filterConfig.enableDirectionFilter) {
                      const speed = calculateWindSpeed(uVal, vVal)
                      if (speed > 0.1) { // 只对有风速的点进行筛选
                        const direction = calculateWindDirection(uVal, vVal)
                        if (!isDirectionInRange(direction, filterConfig.targetWindDirection, filterConfig.windDirectionTolerance)) {
                          // 不在风向范围内的点设置为0（保留位置但无风速）
                          u.push(0)
                          v.push(0)
                          w.push(0)
                          continue
                        }
                      }
                    }

                    // 保留原始数据
                    u.push(uVal)
                    v.push(vVal)
                    w.push(wVal)
                  }
                }
              }

              // 更新header信息
              if (filterConfig.enableAreaFilter) {
                currentFilteredData.header.nx = newNx
                currentFilteredData.header.ny = newNy
                currentFilteredData.header.lo1 = newLo1
                currentFilteredData.header.lo2 = newLo2
                currentFilteredData.header.la1 = newLa1
                currentFilteredData.header.la2 = newLa2
              }

              currentFilteredData.data.u = u
              currentFilteredData.data.v = v
              currentFilteredData.data.w = w

              // 应用数据平滑和增强
              if (filterConfig.enableSmoothing) {
                const currentNx = filterConfig.enableAreaFilter ? newNx : origNx
                const currentNy = filterConfig.enableAreaFilter ? newNy : origNy
                const currentNz = endLevel - startLevel + 1

                // 平滑数据
                const smoothed = smoothData(
                  currentFilteredData.data,
                  currentNx, currentNy, currentNz,
                  filterConfig.smoothingStrength
                )

                // 增强流场
                const enhanced = enhanceFlow(
                  smoothed,
                  currentNx, currentNy, currentNz,
                  filterConfig
                )

                currentFilteredData.data = enhanced
              }

              // 应用密度重构
              if (filterConfig.enableDensityFilter) {
                const currentNx = filterConfig.enableAreaFilter ? newNx : origNx
                const currentNy = filterConfig.enableAreaFilter ? newNy : origNy
                const currentNz = endLevel - startLevel + 1

                const reconstructed = reconstructByDensity(
                  currentFilteredData.data,
                  currentNx, currentNy, currentNz,
                  filterConfig
                )

                currentFilteredData.data = reconstructed
              }

              // 调试信息 - 检查筛选后的数据质量
              let maxSpeed = 0, minSpeed = Infinity, validPoints = 0, zeroPoints = 0
              const finalU = currentFilteredData.data.u
              const finalV = currentFilteredData.data.v
              for (let i = 0; i < finalU.length; i++) {
                const speed = calculateWindSpeed(finalU[i], finalV[i])
                if (speed > maxSpeed) maxSpeed = speed
                if (speed < minSpeed) minSpeed = speed
                if (speed > 0.01) validPoints++
                else zeroPoints++
              }

              console.log('✅ 筛选完成', {
                原始网格: `${origNx}×${origNy}`,
                新网格: `${newNx}×${newNy}`,
                数据点总数: u.length,
                有效风速点: validPoints,
                零风速点: zeroPoints,
                最大风速: maxSpeed.toFixed(2),
                最小风速: minSpeed.toFixed(2),
                区域范围: `${newLo1.toFixed(4)}-${newLo2.toFixed(4)}E, ${newLa1.toFixed(4)}-${newLa2.toFixed(4)}N`,
                header信息: {
                  nx: currentFilteredData.header.nx,
                  ny: currentFilteredData.header.ny,
                  nz: currentFilteredData.header.nz,
                  lo1: currentFilteredData.header.lo1,
                  lo2: currentFilteredData.header.lo2,
                  la1: currentFilteredData.header.la1,
                  la2: currentFilteredData.header.la2
                }
              })

              // 验证数据一致性
              const expectedSize = (endLevel - startLevel + 1) * newNy * newNx
              if (u.length !== expectedSize) {
                console.error(`❌ 数据大小不一致！期望 ${expectedSize}，实际 ${u.length}`)
              } else {
                console.log(`✅ 数据大小验证通过: ${u.length}`)
              }

              // 应用流线筛选（如果启用）
              if (filterConfig.enableStreamlineFilter) {
                console.log('🔄 开始应用流线筛选...')
                currentFilteredData = applyStreamlineFilter(currentFilteredData)
              }

              return currentFilteredData
            }

            // 保存筛选后的数据
            const saveFilteredData = () => {
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

            // 应用筛选并更新显示
            const applyFilterAndUpdate = async () => {
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
              updateWindLegend()
            }

            // 重置筛选
            const resetFilter = () => {
              filterConfig.enableLevelFilter = false
              filterConfig.enableDirectionFilter = false
              filterConfig.enableAreaFilter = false
              filterConfig.areaMinLon = windBounds.lo1
              filterConfig.areaMaxLon = windBounds.lo2
              filterConfig.areaMinLat = windBounds.la1
              filterConfig.areaMaxLat = windBounds.la2
              // 重置流线筛选
              filterConfig.enableStreamlineFilter = false
              filterConfig.streamlineMode = 'density'
              filterConfig.streamlineDensity = 3
              filterConfig.streamlineCount = 8
              filterConfig.streamlineMinSpeed = 5
              // 重置平滑和增强
              filterConfig.enableSmoothing = false
              filterConfig.smoothingStrength = 1
              filterConfig.minSpeedThreshold = 0.1
              filterConfig.removeIsolatedPoints = true
              filterConfig.enhanceMainFlow = false
              // 重置密度筛选
              filterConfig.enableDensityFilter = false
              filterConfig.densityRadius = 3
              filterConfig.densityThreshold = 0.3
              filterConfig.minDensityPoints = 5
              filterConfig.preserveLocalMax = true
              wind3d.switchToRealDataWithBounds(currentDataPath, windBounds)
              updateWindLegend()
            }

            // 创建风场图例
            const createWindLegend = () => {
              let legend = document.getElementById('wind-legend')
              if (!legend) {
                legend = document.createElement('div')
                legend.id = 'wind-legend'
                legend.style.cssText = `
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
              updateWindLegend()
              // 短暂延迟后更新所有图例位置
              setTimeout(updateAllLegendPositions, 100)
            }

            const updateWindLegend = () => {
              const legend = document.getElementById('wind-legend')
              if (!legend) return

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
                  <span>${((wind3d.windSpeedMin + wind3d.windSpeedMax) / 2).toFixed(1)}</span>
                  <span>${wind3d.windSpeedMax.toFixed(1)}</span>
                </div>
              `

              // 添加筛选信息
              if (filterConfig.enableLevelFilter || filterConfig.enableDirectionFilter || filterConfig.enableAreaFilter || filterConfig.enableStreamlineFilter || filterConfig.enableSmoothing || filterConfig.enableDensityFilter) {
                legendHTML += `
                  <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 10px; opacity: 0.8;">
                    <div>筛选已启用</div>
                    ${filterConfig.enableLevelFilter ? `<div>层级: ${originalWindData?.header?.levels?.[filterConfig.minLevel] || 0}-${originalWindData?.header?.levels?.[filterConfig.maxLevel] || 0}</div>` : ''}
                    ${filterConfig.enableDirectionFilter ? `<div>风向: ${filterConfig.targetWindDirection}°±${filterConfig.windDirectionTolerance}°</div>` : ''}
                    ${filterConfig.enableAreaFilter ? `<div>区域: ${filterConfig.areaMinLon.toFixed(3)}°-${filterConfig.areaMaxLon.toFixed(3)}°E, ${filterConfig.areaMinLat.toFixed(3)}°-${filterConfig.areaMaxLat.toFixed(3)}°N</div>` : ''}
                    ${filterConfig.enableStreamlineFilter ? `<div>流线: ${filterConfig.streamlineMode === 'density' ? '密度采样×' + filterConfig.streamlineDensity : filterConfig.streamlineMode === 'path' ? filterConfig.streamlineCount + '条路径' : '风速≥' + filterConfig.streamlineMinSpeed + 'm/s'}</div>` : ''}
                    ${filterConfig.enableSmoothing ? `<div>平滑: 强度${filterConfig.smoothingStrength}${filterConfig.removeIsolatedPoints ? '+去孤立点' : ''}</div>` : ''}
                    ${filterConfig.enableDensityFilter ? `<div>密度: 阈值${filterConfig.densityThreshold} 半径${filterConfig.densityRadius}</div>` : ''}
                  </div>
                `
              }

              // 添加风速夸张信息
              if (wind3d.speedExaggerationEnabled) {
                legendHTML += `
                  <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 10px; opacity: 0.8;">
                    <div>速度系数: ${wind3d.speedFactor.toFixed(2)} | 厚度: ${(wind3d.windThickness / 1000).toFixed(0)}km</div>
                    <div>风速夸张: 开 | 模式: ${wind3d.speedExaggerationMode} | 倍率: ${wind3d.speedExaggerationMultiplier.toFixed(1)}</div>
                    <div>范围: ${wind3d.speedExaggerationMin.toFixed(1)}-${wind3d.speedExaggerationMax.toFixed(1)}m/s</div>
                  </div>
                `
              } else {
                legendHTML += `
                  <div style="margin-top: 8px; padding-top: 8px; border-top: 1px solid rgba(255,255,255,0.2); font-size: 10px; opacity: 0.8;">
                    <div>速度系数: ${wind3d.speedFactor.toFixed(2)} | 厚度: ${(wind3d.windThickness / 1000).toFixed(0)}km</div>
                    <div>风速夸张: 关</div>
                  </div>
                `
              }

              legend.innerHTML = legendHTML
              // 更新内容变化后重新排列
              setTimeout(updateAllLegendPositions, 50)
            }

            createWindLegend()

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
              windFolder.add(wind3d, 'cullSpeedMin', 1, 50).name('最小剔除速度')
              windFolder.add(wind3d, 'cullSpeedMax', 10, 200).name('最大剔除速度')
              windFolder.add(wind3d, 'windSpeedMin', 0, 50).name('最小风速显示').onChange(updateWindLegend)
              windFolder.add(wind3d, 'windSpeedMax', 5, 100).name('最大风速显示').onChange(updateWindLegend)
              windFolder.add(wind3d, 'decaySpeed', 0.001, 0.02).name('衰减速度')
              windFolder.add(wind3d, 'alphaFactor', 0.1, 2).name('透明度系数')
              windFolder.add(wind3d, 'tadpoleLength', 50, 1000).name('粒子长度')
              windFolder.add(wind3d, 'tadpoleWidth', 1, 50).name('粒子宽度')

              // 数据平滑和增强面板
              const smoothingFolder = windGui.addFolder('数据平滑')
              smoothingFolder.add(filterConfig, 'enableSmoothing').name('启用平滑').onChange(applyFilterAndUpdate)
              smoothingFolder.add(filterConfig, 'smoothingStrength', 1, 5, 1).name('平滑强度').onChange(applyFilterAndUpdate)
              smoothingFolder.add(filterConfig, 'minSpeedThreshold', 0, 5, 0.1).name('最小风速阈值').onChange(applyFilterAndUpdate)
              smoothingFolder.add(filterConfig, 'removeIsolatedPoints').name('移除孤立点').onChange(applyFilterAndUpdate)

              // 快速预设按钮
              const presetFolder = windGui.addFolder('快速预设')
              presetFolder.add({
                applyCleanMode: () => {
                  filterConfig.enableSmoothing = true
                  filterConfig.smoothingStrength = 2
                  filterConfig.minSpeedThreshold = 0.5
                  filterConfig.removeIsolatedPoints = true
                  applyFilterAndUpdate()
                }
              }, 'applyCleanMode').name('🌀 清晰模式')
              presetFolder.add({
                applyDenseMode: () => {
                  filterConfig.enableSmoothing = false
                  filterConfig.enableStreamlineFilter = true
                  filterConfig.streamlineMode = 'density'
                  filterConfig.streamlineDensity = 2
                  applyFilterAndUpdate()
                }
              }, 'applyDenseMode').name('🌪️ 密集模式')
              presetFolder.add({
                applyStreamlineMode: () => {
                  filterConfig.enableStreamlineFilter = true
                  filterConfig.streamlineMode = 'path'
                  filterConfig.streamlineCount = 12
                  filterConfig.streamlineMinSpeed = 2
                  applyFilterAndUpdate()
                }
              }, 'applyStreamlineMode').name('🪁 流线模式')

              presetFolder.add({
                applyDensityMode: () => {
                  filterConfig.enableDensityFilter = true
                  filterConfig.densityRadius = 3
                  filterConfig.densityThreshold = 0.25
                  filterConfig.preserveLocalMax = true
                  filterConfig.minSpeedThreshold = 0.3
                  filterConfig.enableSmoothing = true
                  filterConfig.smoothingStrength = 2
                  applyFilterAndUpdate()
                }
              }, 'applyDensityMode').name('💎 密度模式（推荐）')

              // 密度筛选控制面板
              const densityFolder = windGui.addFolder('密度重构')
              densityFolder.add(filterConfig, 'enableDensityFilter').name('启用密度筛选').onChange(applyFilterAndUpdate)
              densityFolder.add(filterConfig, 'densityRadius', 1, 8, 1).name('密度计算半径').onChange(applyFilterAndUpdate)
              densityFolder.add(filterConfig, 'densityThreshold', 0.1, 0.8, 0.05).name('密度保留阈值').onChange(applyFilterAndUpdate)
              densityFolder.add(filterConfig, 'preserveLocalMax').name('保留局部最大值').onChange(applyFilterAndUpdate)

              // // 风速夸张功能
              // const speedExaggerationFolder = windGui.addFolder('风速夸张')
              // speedExaggerationFolder.add(wind3d, 'speedExaggerationEnabled').name('启用风速夸张').onChange(updateWindLegend)
              // const exaggerationModeOptions = ['linear', 'exponential', 'logarithmic', 'power']
              // speedExaggerationFolder.add(wind3d, 'speedExaggerationMode', exaggerationModeOptions).name('夸张模式').onChange(updateWindLegend)
              // speedExaggerationFolder.add(wind3d, 'speedExaggerationMultiplier', 0.5, 10).name('夸张倍率').onChange(updateWindLegend)
              // speedExaggerationFolder.add(wind3d, 'speedExaggerationExponent', 0.5, 3).name('指数参数').onChange(updateWindLegend)
              // speedExaggerationFolder.add(wind3d, 'speedExaggerationMin', 0, 50).name('夸张范围最小').onChange(updateWindLegend)
              // speedExaggerationFolder.add(wind3d, 'speedExaggerationMax', 5, 100).name('夸张范围最大').onChange(updateWindLegend)

              // 数据切换配置
              const windDataConfig = { currentDataIndex: 0 }
              const dataNames = windDataPaths.map(d => d.name)
              const dataSelector = windFolder.add(windDataConfig, 'currentDataIndex', dataNames).name('数据源')
              dataSelector.onChange(async (selectedName) => {
                const selectedIndex = windDataPaths.findIndex(d => d.name === selectedName)
                if (selectedIndex >= 0 && selectedIndex < windDataPaths.length) {
                  const newPath = windDataPaths[selectedIndex].path
                  currentDataPath = newPath
                  await loadOriginalData(newPath)
                  await wind3d.switchToRealDataWithBounds(newPath, windBounds)
                  updateWindLegend()
                }
              })

              // 层级过滤配置（新方案）
              const levelFilterFolder = windGui.addFolder('高度/层级过滤')
              let levelCheckboxes = []
              let minHeightController = null
              let maxHeightController = null

              // 高度范围滑动条配置
              const heightConfig = {
                displayHeightMin: 0,
                displayHeightMax: 10000
              }

              const updateHeightRange = () => {
                wind3d.displayHeightMin = heightConfig.displayHeightMin
                wind3d.displayHeightMax = heightConfig.displayHeightMax
                wind3d._needsRebuild = true
              }

              // 更新层级复选框的函数
              const updateLevelCheckboxes = () => {
                // 先保存滑动条引用并暂时移除它们
                if (minHeightController) {
                  levelFilterFolder.remove(minHeightController)
                }
                if (maxHeightController) {
                  levelFilterFolder.remove(maxHeightController)
                }

                // 清除旧的复选框
                levelCheckboxes.forEach(item => {
                  levelFilterFolder.remove(item.controller)
                })
                levelCheckboxes = []

                // 重新添加滑动条在最前面
                if (wind3d.levelHeights && wind3d.levelHeights.length > 0) {
                  const minH = Math.min(...wind3d.levelHeights)
                  const maxH = Math.max(...wind3d.levelHeights)
                  minHeightController = levelFilterFolder.add(heightConfig, 'displayHeightMin', minH, maxH, 10).name('最小高度(m)').onChange(() => {
                    if (heightConfig.displayHeightMin > heightConfig.displayHeightMax) {
                      heightConfig.displayHeightMax = heightConfig.displayHeightMin
                    }
                    updateHeightRange()
                  })
                  maxHeightController = levelFilterFolder.add(heightConfig, 'displayHeightMax', minH, maxH, 10).name('最大高度(m)').onChange(() => {
                    if (heightConfig.displayHeightMax < heightConfig.displayHeightMin) {
                      heightConfig.displayHeightMin = heightConfig.displayHeightMax
                    }
                    updateHeightRange()
                  })
                }

                if (wind3d.levelHeights && wind3d.levelHeights.length > 0) {
                  // 添加全选/全不选按钮
                  levelFilterFolder.add({
                    selectAll: () => {
                      wind3d.enableAllLevels()
                      // 更新高度范围到全部层级
                      if (wind3d.levelHeights.length > 0) {
                        const minH = Math.min(...wind3d.levelHeights)
                        const maxH = Math.max(...wind3d.levelHeights)
                        heightConfig.displayHeightMin = minH
                        heightConfig.displayHeightMax = maxH
                        wind3d.displayHeightMin = minH
                        wind3d.displayHeightMax = maxH
                      }
                      updateLevelCheckboxes()
                      wind3d._needsRebuild = true
                    }
                  }, 'selectAll').name('✅ 全选')
                  levelFilterFolder.add({
                    selectNone: () => {
                      wind3d.disableAllLevels()
                      updateLevelCheckboxes()
                      wind3d._needsRebuild = true
                    }
                  }, 'selectNone').name('❌ 全不选')

                  // 为每个层级添加复选框
                  wind3d.levelHeights.forEach(height => {
                    const levelObj = { [`${height}m`]: wind3d.enabledLevels.includes(height) }
                    const controller = levelFilterFolder.add(levelObj, `${height}m`).name(`${height}m`).onChange(enabled => {
                      if (enabled) {
                        wind3d.enableLevel(height)
                      } else {
                        wind3d.disableLevel(height)
                      }
                      // 根据选中的层级自动更新高度范围
                      if (wind3d.enabledLevels.length > 0) {
                        const minEnabled = Math.min(...wind3d.enabledLevels)
                        const maxEnabled = Math.max(...wind3d.enabledLevels)
                        heightConfig.displayHeightMin = minEnabled
                        heightConfig.displayHeightMax = maxEnabled
                        wind3d.displayHeightMin = minEnabled
                        wind3d.displayHeightMax = maxEnabled
                        // 更新滑动条的值
                        if (minHeightController && maxHeightController) {
                          minHeightController.setValue(minEnabled)
                          maxHeightController.setValue(maxEnabled)
                        }
                      }
                      wind3d._needsRebuild = true
                    })
                    levelCheckboxes.push({ controller, height })
                  })
                }
              }

              // 启用/禁用层级过滤
              levelFilterFolder.add(wind3d, 'levelFilterEnabled').name('启用高度过滤').onChange(updateLevelCheckboxes)

              // 等待数据加载后初始化高度范围
              const initHeightConfig = () => {
                if (wind3d.levelHeights && wind3d.levelHeights.length > 0) {
                  heightConfig.displayHeightMin = Math.min(...wind3d.levelHeights)
                  heightConfig.displayHeightMax = Math.max(...wind3d.levelHeights)
                  wind3d.displayHeightMin = heightConfig.displayHeightMin
                  wind3d.displayHeightMax = heightConfig.displayHeightMax
                }
              }

              // 延迟初始化以确保数据已加载
              setTimeout(() => {
                initHeightConfig()
                updateLevelCheckboxes()
              }, 500)

              // 风向过滤配置
              const directionFilterFolder = windGui.addFolder('风向过滤')
              directionFilterFolder.add(filterConfig, 'enableDirectionFilter').name('启用风向过滤').onChange(applyFilterAndUpdate)
              directionFilterFolder.add(filterConfig, 'targetWindDirection', 0, 360, 1).name('目标风向(°)').onChange(applyFilterAndUpdate)
              directionFilterFolder.add(filterConfig, 'windDirectionTolerance', 1, 180, 1).name('容差(°)').onChange(applyFilterAndUpdate)

              // 区域过滤配置
              const areaFilterFolder = windGui.addFolder('区域过滤')
              areaFilterFolder.add(filterConfig, 'enableAreaFilter').name('启用区域过滤').onChange(applyFilterAndUpdate)
              areaFilterFolder.add(filterConfig, 'areaMinLon', windBounds.lo1 - 0.5, windBounds.lo2, 0.001).name('最小经度').onChange(() => {
                if (filterConfig.areaMinLon > filterConfig.areaMaxLon) {
                  filterConfig.areaMaxLon = filterConfig.areaMinLon
                }
                applyFilterAndUpdate()
              })
              areaFilterFolder.add(filterConfig, 'areaMaxLon', windBounds.lo1, windBounds.lo2 + 0.5, 0.001).name('最大经度').onChange(() => {
                if (filterConfig.areaMaxLon < filterConfig.areaMinLon) {
                  filterConfig.areaMinLon = filterConfig.areaMaxLon
                }
                applyFilterAndUpdate()
              })
              areaFilterFolder.add(filterConfig, 'areaMinLat', windBounds.la1 - 0.5, windBounds.la2, 0.001).name('最小纬度').onChange(() => {
                if (filterConfig.areaMinLat > filterConfig.areaMaxLat) {
                  filterConfig.areaMaxLat = filterConfig.areaMinLat
                }
                applyFilterAndUpdate()
              })
              areaFilterFolder.add(filterConfig, 'areaMaxLat', windBounds.la1, windBounds.la2 + 0.5, 0.001).name('最大纬度').onChange(() => {
                if (filterConfig.areaMaxLat < filterConfig.areaMinLat) {
                  filterConfig.areaMinLat = filterConfig.areaMaxLat
                }
                applyFilterAndUpdate()
              })

              // 流线筛选配置
              const streamlineFolder = windGui.addFolder('流线筛选')
              streamlineFolder.add(filterConfig, 'enableStreamlineFilter').name('启用流线筛选').onChange(applyFilterAndUpdate)

              const streamlineModeOptions = { '密度采样': 'density', '流线路径': 'path', '风速阈值': 'speed' }
              streamlineFolder.add(filterConfig, 'streamlineMode', streamlineModeOptions).name('筛选模式').onChange(applyFilterAndUpdate)

              streamlineFolder.add(filterConfig, 'streamlineDensity', 1, 10, 1).name('采样间隔').onChange(applyFilterAndUpdate)
              streamlineFolder.add(filterConfig, 'streamlineCount', 3, 20, 1).name('流线数量').onChange(applyFilterAndUpdate)
              streamlineFolder.add(filterConfig, 'streamlineMinSpeed', 0, 30, 0.5).name('最小风速(m/s)').onChange(applyFilterAndUpdate)
              streamlineFolder.add(filterConfig, 'streamlineMaxLength', 20, 200, 10).name('最大长度(点)').onChange(applyFilterAndUpdate)
              streamlineFolder.add(filterConfig, 'streamlineStepSize', 0.1, 2, 0.1).name('追踪步长').onChange(applyFilterAndUpdate)

              // 数据保存
              const saveFolder = windGui.addFolder('数据保存')
              const saveControl = {
                saveFiltered: () => saveFilteredData(),
                resetFilter: () => {
                  resetFilter()
                  // 更新所有 GUI 控件的显示
                  for (const folder of [levelFilterFolder, directionFilterFolder, areaFilterFolder, streamlineFolder]) {
                    for (const ctrl of folder.__controllers) {
                      ctrl.updateDisplay()
                    }
                  }
                }
              }
              saveFolder.add(saveControl, 'saveFiltered').name('保存筛选后数据')
              saveFolder.add(saveControl, 'resetFilter').name('重置筛选')

              windFolder.open()
              window.windGuiInstance = windGui
              // 确保新创建的GUI遵循当前显示状态
              if (!configPanelVisible && windGui.domElement) {
                windGui.domElement.style.display = 'none'
              }
            } catch (error) {
              console.error('Failed to create wind GUI:', error)
            }
            break
          case 'ARMultiPoints': //地表影像
            store.state.AFSIMModule.showARMultiPoints = true
            break
          case 'humidity': //湿度
            let DC = new window.EarthPlugn.DCPrimitive({
              viewer: window.EarthViewer,
              earth: window.MSIMEarth
            })

            const humidityTexturePaths = [
              { name: '00:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_0000_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '01:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_0100_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '02:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_0200_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '03:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_0300_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '04:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_0400_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '05:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_0500_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '06:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_0600_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '07:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_0700_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '08:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_0800_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '09:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_0900_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '10:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_1000_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '11:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_1100_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '12:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_1200_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '13:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_1300_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '14:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_1400_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '15:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_1500_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '16:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_1600_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '17:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_1700_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '18:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_1800_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '19:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_1900_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '20:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_2000_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '21:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_2100_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '22:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_2200_z_interp_crop_100m_lat_vertical_16x16_green.png' },
              { name: '23:00', path: '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_2300_z_interp_crop_100m_lat_vertical_16x16_green.png' }
            ]

            const humidityConfig = {
              xmin: 121.2,
              xmax: 121.4,
              ymin: 24.9,
              ymax: 25.1,
              zmin: 100.0,
              zmax: 15000.0,
              steps: 320.0,
              alphaCorrection: 0.3,
              humidityLowColor: '#0000ff',
              humidityMidColor: '#00ffff',
              humidityHighColor: '#84ff84',
              gamma: 0.6,
              alphaPower: 2.0,
              minThreshold: 0.05,
              maxThreshold: 1.0,
              opacityScale: 0.18,
              dataCompression: 0.5,
              texturePath: humidityTexturePaths[0].path,
              currentTextureIndex: 0,
              texturePaths: humidityTexturePaths,
              // 剖切参数
              clipXEnabled: false,
              clipXMin: 0.0,
              clipXMax: 1.0,
              clipYEnabled: false,
              clipYMin: 0.0,
              clipYMax: 1.0,
              clipZEnabled: false,
              clipZMin: 0.0,
              clipZMax: 1.0,
              // 颜色过滤参数
              colorFilterEnabled: false,
              targetColor: '#ffffff',
              colorTolerance: 0.3
            }

            const humidityPrimitive = DC.createHumidityTextureAliasOD(humidityConfig)
            window.humidityInstance = { DC, primitive: humidityPrimitive, config: humidityConfig }

            const humidityCenterLon = (humidityConfig.xmin + humidityConfig.xmax) / 2
            const humidityCenterLat = (humidityConfig.ymin + humidityConfig.ymax) / 2
            const humidityLonDiff = humidityConfig.xmax - humidityConfig.xmin
            const humidityLatDiff = humidityConfig.ymax - humidityConfig.ymin
            const humidityMaxDiff = Math.max(humidityLonDiff, humidityLatDiff)
            const humidityCameraHeight = humidityMaxDiff * 111000 * 3

            window.EarthViewer.camera.setView({
              destination: window.MSIMEarth.Cartesian3.fromDegrees(humidityCenterLon, humidityCenterLat, humidityCameraHeight),
              // orientation: {
              //   heading: window.MSIMEarth.Math.toRadians(0),
              //   pitch: window.MSIMEarth.Math.toRadians(-60),
              //   roll: window.MSIMEarth.Math.toRadians(0)
              // }
            })

            // 创建湿度图例
            const createHumidityLegend = () => {
              let legend = document.getElementById('humidity-legend')
              if (!legend) {
                legend = document.createElement('div')
                legend.id = 'humidity-legend'
                legend.style.cssText = `
                  position: absolute;
                  top: 80px;
                  right: 120px;
                  background: rgba(20, 30, 50, 0.95);
                  padding: 12px 15px;
                  border-radius: 8px;
                  color: white;
                  font-size: 12px;
                  z-index: 1;
                  min-width: 220px;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
                  border: 1px solid rgba(100, 150, 255, 0.3);
                `
                document.body.appendChild(legend)
              }
              updateHumidityLegend()
              // 短暂延迟后更新所有图例位置
              setTimeout(updateAllLegendPositions, 100)
            }

            const updateHumidityLegend = () => {
              const legend = document.getElementById('humidity-legend')
              if (!legend) return

              const currentDataName = humidityTexturePaths[humidityConfig.currentTextureIndex]?.name || '数据'

              legend.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 8px;">湿度区图例</div>
                <div style="position: relative;">
                  <div style="position: absolute; inset: -2px; border-radius: 6px; background: linear-gradient(135deg, rgba(255,255,255,0.2), rgba(255,255,255,0.05)); z-index: 0;"></div>
                  <div style="height: 24px; border-radius: 4px; margin: 8px 0; border: 1px solid rgba(255,255,255,0.3); background: linear-gradient(to right,
                    rgba(0, 200, 100, 0.0) 0%,
                    rgba(0, 200, 100, 0.0) 20%,
                    rgba(20, 210, 90, 0.2) 36%,
                    rgba(40, 225, 70, 0.4) 52%,
                    rgba(70, 240, 60, 0.7) 68%,
                    rgba(85, 248, 80, 0.85) 84%,
                    rgba(100, 255, 100, 0.95) 100%
                  ); position: relative; z-index: 1;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; margin-top: 4px;">
                  <span>0%</span>
                  <span>50%</span>
                  <span>60%</span>
                  <span>70%</span>
                  <span>80%</span>
                  <span>90%</span>
                  <span>100%</span>
                </div>
                <div style="margin-top: 8px; font-size: 10px; opacity: 0.8; border-top: 1px solid rgba(100,150,255,0.3); padding-top: 8px;">
                  ${currentDataName}
                </div>
              `
              // 更新内容变化后重新排列
              setTimeout(updateAllLegendPositions, 50)
            }
            //            <div style="margin-top: 8px; font-size: 10px; opacity: 0.8;">
            //   AlphaPower: ${humidityConfig.alphaPower.toFixed(2)} | Opacity: ${humidityConfig.opacityScale.toFixed(2)}
            // </div>
            // <div style="margin-top: 4px; font-size: 10px; opacity: 0.8;">
            //   Threshold: ${(humidityConfig.minThreshold * 100).toFixed(0)}% - ${(humidityConfig.maxThreshold * 100).toFixed(0)}%
            // </div>

            createHumidityLegend()

            try {
              const dat = await import('dat.gui')
              const humidityGui = new dat.GUI({ name: '湿度参数配置' })

              humidityGui.domElement.style.position = 'absolute'
              humidityGui.domElement.style.width = '242px'
              humidityGui.domElement.style.left = '10px'
              humidityGui.domElement.style.top = '100px'
              humidityGui.domElement.style.right = 'auto'
              humidityGui.domElement.style.zIndex = '1'

              const humidityFolder = humidityGui.addFolder('湿度参数')

              const updateHumidity = () => {
                if (window.humidityInstance && window.humidityInstance.primitive && window.humidityInstance.primitive.appearance && window.humidityInstance.primitive.appearance.uniforms) {
                  const uniforms = window.humidityInstance.primitive.appearance.uniforms
                  uniforms.steps = humidityConfig.steps
                  uniforms.alphaCorrection = humidityConfig.alphaCorrection
                  uniforms.gammaCorrection = humidityConfig.gamma
                  uniforms.alphaPower = humidityConfig.alphaPower
                  uniforms.minThreshold = humidityConfig.minThreshold
                  uniforms.maxThreshold = humidityConfig.maxThreshold
                  uniforms.opacityScale = humidityConfig.opacityScale
                  uniforms.dataCompression = humidityConfig.dataCompression
                  uniforms.humidityColorLow = hexToRgbVector(humidityConfig.humidityLowColor)
                  uniforms.humidityColorMid = hexToRgbVector(humidityConfig.humidityMidColor)
                  uniforms.humidityColorHigh = hexToRgbVector(humidityConfig.humidityHighColor)
                  // 剖切参数
                  uniforms.clipXEnabled = humidityConfig.clipXEnabled
                  uniforms.clipXMin = humidityConfig.clipXMin
                  uniforms.clipXMax = humidityConfig.clipXMax
                  uniforms.clipYEnabled = humidityConfig.clipYEnabled
                  uniforms.clipYMin = humidityConfig.clipYMin
                  uniforms.clipYMax = humidityConfig.clipYMax
                  uniforms.clipZEnabled = humidityConfig.clipZEnabled
                  uniforms.clipZMin = humidityConfig.clipZMin
                  uniforms.clipZMax = humidityConfig.clipZMax
                  // 颜色过滤参数
                  uniforms.colorFilterEnabled = humidityConfig.colorFilterEnabled
                  uniforms.targetColor = hexToRgbVector(humidityConfig.targetColor)
                  uniforms.colorTolerance = humidityConfig.colorTolerance
                }
                updateHumidityLegend()
              }

              function hexToRgbVector(hex) {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
                return result ? {
                  x: parseInt(result[1], 16) / 255,
                  y: parseInt(result[2], 16) / 255,
                  z: parseInt(result[3], 16) / 255
                } : { x: 0, y: 0, z: 0 }
              }

              humidityFolder.add(humidityConfig, 'steps', 50, 400).step(1).name('采样步数').onChange(updateHumidity)
              // humidityFolder.add(humidityConfig, 'alphaCorrection', 0.1, 5).name('透明度校正').onChange(updateHumidity)
              // humidityFolder.add(humidityConfig, 'gamma', 0.1, 3).name('Gamma校正').onChange(updateHumidity)
              // humidityFolder.add(humidityConfig, 'alphaPower', 0.1, 5).name('Alpha幂次').onChange(updateHumidity)
              // humidityFolder.add(humidityConfig, 'minThreshold', 0, 1).name('最小阈值').onChange(updateHumidity)
              // humidityFolder.add(humidityConfig, 'maxThreshold', 0, 1).name('最大阈值').onChange(updateHumidity)
              humidityFolder.add(humidityConfig, 'opacityScale', 0.1, 3).name('透明度').onChange(updateHumidity)
              // humidityFolder.add(humidityConfig, 'dataCompression', 0.01, 2).name('数据压缩系数').onChange(updateHumidity)

              // const colorFolder = humidityGui.addFolder('颜色配置')
              // colorFolder.addColor(humidityConfig, 'humidityLowColor').name('低湿度颜色').onChange(updateHumidity)
              // colorFolder.addColor(humidityConfig, 'humidityMidColor').name('中湿度颜色').onChange(updateHumidity)
              // colorFolder.addColor(humidityConfig, 'humidityHighColor').name('高湿度颜色').onChange(updateHumidity)

              // 时序播放配置
              const playbackConfig = {
                isPlaying: false,
                interval: 1.0,
                timer: null
              }
              window.humidityPlaybackConfig = playbackConfig

              const switchTexture = async (index) => {
                if (index >= 0 && index < humidityTexturePaths.length && window.humidityInstance && window.humidityInstance.primitive && window.humidityInstance.primitive.appearance) {
                  const newPath = humidityTexturePaths[index].path
                  humidityConfig.texturePath = newPath
                  humidityConfig.currentTextureIndex = index

                  const earth = window.MSIMEarth
                  const viewer = window.EarthViewer
                  earth.Resource.createIfNeeded(newPath)
                    .fetchImage()
                    .then((res) => {
                      const cubeTex = new earth.Texture({
                        context: viewer.scene.context,
                        source: res,
                      })
                      cubeTex.type = "sampler2D"
                      window.humidityInstance.primitive.appearance.uniforms.cubeTex = cubeTex
                      updateHumidityLegend()
                    })
                    .catch((error) => {
                      console.error("加载湿度纹理失败：", error)
                    })
                }
              }

              const textureNames = humidityTexturePaths.map(t => t.name)
              const textureSelector = humidityFolder.add(humidityConfig, 'currentTextureIndex', textureNames).name('数据切换')
              textureSelector.onChange(async (selectedName) => {
                const selectedIndex = humidityTexturePaths.findIndex(t => t.name === selectedName)
                if (selectedIndex !== -1) {
                  await switchTexture(selectedIndex)
                }
              })

              // 剖切工具控制
              const clipFolder = humidityGui.addFolder('剖切工具')

              // X轴剖切
              const clipXFolder = clipFolder.addFolder('X轴剖切')
              clipXFolder.add(humidityConfig, 'clipXEnabled').name('启用').onChange(updateHumidity)
              clipXFolder.add(humidityConfig, 'clipXMin', 0.0, 1.0).name('最小位置').onChange(updateHumidity)
              clipXFolder.add(humidityConfig, 'clipXMax', 0.0, 1.0).name('最大位置').onChange(updateHumidity)

              // Y轴剖切
              const clipYFolder = clipFolder.addFolder('Y轴剖切')
              clipYFolder.add(humidityConfig, 'clipYEnabled').name('启用').onChange(updateHumidity)
              clipYFolder.add(humidityConfig, 'clipYMin', 0.0, 1.0).name('最小位置').onChange(updateHumidity)
              clipYFolder.add(humidityConfig, 'clipYMax', 0.0, 1.0).name('最大位置').onChange(updateHumidity)

              // Z轴剖切
              const clipZFolder = clipFolder.addFolder('Z轴剖切')
              clipZFolder.add(humidityConfig, 'clipZEnabled').name('启用').onChange(updateHumidity)
              clipZFolder.add(humidityConfig, 'clipZMin', 0.0, 1.0).name('最小位置').onChange(updateHumidity)
              clipZFolder.add(humidityConfig, 'clipZMax', 0.0, 1.0).name('最大位置').onChange(updateHumidity)

              // 颜色过滤控制
              const colorFilterFolder = humidityGui.addFolder('颜色过滤')
              colorFilterFolder.add(humidityConfig, 'colorFilterEnabled').name('启用颜色过滤').onChange(updateHumidity)
              colorFilterFolder.addColor(humidityConfig, 'targetColor').name('目标颜色').onChange(updateHumidity)
              colorFilterFolder.add(humidityConfig, 'colorTolerance', 0.0, 1.0).name('颜色容差').onChange(updateHumidity)

              // 时序播放控制
              const playbackFolder = humidityGui.addFolder('时序播放')
              playbackFolder.add(playbackConfig, 'interval', 0.1, 5).name('切换间隔(秒)')

              const togglePlayback = {
                toggle: () => {
                  if (playbackConfig.isPlaying) {
                    // 暂停
                    playbackConfig.isPlaying = false
                    playbackButton.name('▶ 播放')
                    if (playbackConfig.timer) {
                      clearTimeout(playbackConfig.timer)
                      playbackConfig.timer = null
                    }
                  } else {
                    // 播放
                    playbackConfig.isPlaying = true
                    playbackButton.name('⏸ 暂停')

                    const tick = () => {
                      let nextIndex = humidityConfig.currentTextureIndex + 1
                      if (nextIndex >= humidityTexturePaths.length) {
                        nextIndex = 0
                      }
                      switchTexture(nextIndex)
                      textureSelector.setValue(humidityTexturePaths[nextIndex].name)
                      textureSelector.updateDisplay()

                      if (playbackConfig.isPlaying) {
                        playbackConfig.timer = setTimeout(tick, playbackConfig.interval * 1000)
                      }
                    }

                    tick()
                  }
                }
              }

              const playbackButton = playbackFolder.add(togglePlayback, 'toggle').name('▶ 播放')

              humidityFolder.open()
              window.humidityGuiInstance = humidityGui
              // 确保新创建的GUI遵循当前显示状态
              if (!configPanelVisible && humidityGui.domElement) {
                humidityGui.domElement.style.display = 'none'
              }
            } catch (error) {
              console.error('Failed to create humidity GUI:', error)
            }
            break
          case 'ice': //积冰
            let iceDC = new window.EarthPlugn.DCPrimitive({
              viewer: window.EarthViewer,
              earth: window.MSIMEarth
            })

            const iceTexturePaths = [
              { name: '00:00', path: '/static/image/texture/ICEpicture_BLUE_new/KTICE2025111000.000.grb_lat_vertical_16x16_blue.png' },
              { name: '03:00', path: '/static/image/texture/ICEpicture_BLUE_new/KTICE2025111000.003.grb_lat_vertical_16x16_blue.png' },
              { name: '06:00', path: '/static/image/texture/ICEpicture_BLUE_new/KTICE2025111000.006.grb_lat_vertical_16x16_blue.png' },
              { name: '09:00', path: '/static/image/texture/ICEpicture_BLUE_new/KTICE2025111000.009.grb_lat_vertical_16x16_blue.png' },
              { name: '12:00', path: '/static/image/texture/ICEpicture_BLUE_new/KTICE2025111000.012.grb_lat_vertical_16x16_blue.png' },
              { name: '15:00', path: '/static/image/texture/ICEpicture_BLUE_new/KTICE2025111000.015.grb_lat_vertical_16x16_blue.png' },
              { name: '18:00', path: '/static/image/texture/ICEpicture_BLUE_new/KTICE2025111000.018.grb_lat_vertical_16x16_blue.png' },
              { name: '21:00', path: '/static/image/texture/ICEpicture_BLUE_new/KTICE2025111000.021.grb_lat_vertical_16x16_blue.png' },
              { name: '24:00', path: '/static/image/texture/ICEpicture_BLUE_new/KTICE2025111000.024.grb_lat_vertical_16x16_blue.png' },
              { name: '27:00', path: '/static/image/texture/ICEpicture_BLUE_new/KTICE2025111000.027.grb_lat_vertical_16x16_blue.png' },
              { name: '30:00', path: '/static/image/texture/ICEpicture_BLUE_new/KTICE2025111000.030.grb_lat_vertical_16x16_blue.png' }
            ]

            const iceConfig = {
              xmin: 119.12,
              xmax: 119.17,
              ymin: 25.16,
              ymax: 25.21,
              zmin: 7000.0,
              zmax: 12000.0,
              steps: 320.0,
              alphaCorrection: 0.3,
              humidityLowColor: '#0000ff',
              humidityMidColor: '#00ffff',
              humidityHighColor: '#ffffff',
              gamma: 0.6,
              alphaPower: 1.1,
              minThreshold: 0.05,
              maxThreshold: 1.0,
              opacityScale: 3.0,
              dataCompression: 0.5,
              texturePath: iceTexturePaths[0].path,
              currentTextureIndex: 0,
              texturePaths: iceTexturePaths,
              clipXEnabled: false,
              clipXMin: 0.0,
              clipXMax: 1.0,
              clipYEnabled: false,
              clipYMin: 0.0,
              clipYMax: 1.0,
              clipZEnabled: false,
              clipZMin: 0.0,
              clipZMax: 1.0,
              colorFilterEnabled: false,
              targetColor: '#ffffff',
              colorTolerance: 0.3
            }

            const icePrimitive = iceDC.createIceTextureAliasOD(iceConfig)
            window.iceInstance = { DC: iceDC, primitive: icePrimitive, config: iceConfig }

            const iceCenterLon = (iceConfig.xmin + iceConfig.xmax) / 2
            const iceCenterLat = (iceConfig.ymin + iceConfig.ymax) / 2
            const iceLonDiff = iceConfig.xmax - iceConfig.xmin
            const iceLatDiff = iceConfig.ymax - iceConfig.ymin
            const iceMaxDiff = Math.max(iceLonDiff, iceLatDiff)
            const iceCameraHeight = iceMaxDiff * 111000 * 3

            window.EarthViewer.camera.setView({
              destination: window.MSIMEarth.Cartesian3.fromDegrees(iceCenterLon, iceCenterLat, iceCameraHeight),
            })

            const createIceLegend = () => {
              let legend = document.getElementById('ice-legend')
              if (!legend) {
                legend = document.createElement('div')
                legend.id = 'ice-legend'
                legend.style.cssText = `
                  position: absolute;
                  top: 80px;
                  right: 120px;
                  background: rgba(20, 30, 50, 0.95);
                  padding: 12px 15px;
                  border-radius: 8px;
                  color: white;
                  font-size: 12px;
                  z-index: 1;
                  min-width: 180px;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
                  border: 1px solid rgba(100, 150, 255, 0.3);
                `
                document.body.appendChild(legend)
              }
              updateIceLegend()
              // 短暂延迟后更新所有图例位置
              setTimeout(updateAllLegendPositions, 100)
            }

            const updateIceLegend = () => {
              const legend = document.getElementById('ice-legend')
              if (!legend) return

              const currentDataName = iceTexturePaths[iceConfig.currentTextureIndex]?.name || '数据'
              // <div style="display: flex; justify-content: space-between; margin-top: 4px;">
              //   <span>0</span>
              //   <span>5</span>
              //   <span>8</span>
              //   <span>强</span>
              // </div>
              legend.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 8px;">积冰区图例</div>
                <div style="height: 24px; border-radius: 4px; margin: 8px 0; background: linear-gradient(to right,
                  rgba(40, 80, 140, 0.3) 0%,
                  rgba(30, 70, 160, 0.5) 30%,
                  rgba(10, 90, 220, 0.75) 55%,
                  rgba(0, 110, 255, 0.9) 75%,
                  rgba(30, 130, 255, 1.0) 100%
                );"></div>

                <div style="display: flex; justify-content: space-between; margin-top: 4px; font-size: 10px; opacity: 0.9;">
                  <span>弱</span>
                  <span>中</span>
                  <span>强</span>
                </div>
                <div style="margin-top: 8px; font-size: 10px; opacity: 0.8; border-top: 1px solid rgba(100,150,255,0.3); padding-top: 8px;">
                  ${currentDataName}
                </div>
              `
              // 更新内容变化后重新排列
              setTimeout(updateAllLegendPositions, 50)
            }

            createIceLegend()

            try {
              const dat = await import('dat.gui')
              const iceGui = new dat.GUI({ name: '积冰参数配置' })

              iceGui.domElement.style.position = 'absolute'
              iceGui.domElement.style.width = '242px'
              iceGui.domElement.style.left = '252px'
              iceGui.domElement.style.top = '100px'
              iceGui.domElement.style.right = 'auto'
              iceGui.domElement.style.zIndex = '1'

              const updateIce = () => {
                if (window.iceInstance && window.iceInstance.primitive && window.iceInstance.primitive.appearance && window.iceInstance.primitive.appearance.uniforms) {
                  const uniforms = window.iceInstance.primitive.appearance.uniforms
                  uniforms.steps = iceConfig.steps
                  uniforms.alphaCorrection = iceConfig.alphaCorrection
                  uniforms.gammaCorrection = iceConfig.gamma
                  uniforms.alphaPower = iceConfig.alphaPower
                  uniforms.minThreshold = iceConfig.minThreshold
                  uniforms.maxThreshold = iceConfig.maxThreshold
                  uniforms.opacityScale = iceConfig.opacityScale
                  uniforms.dataCompression = iceConfig.dataCompression
                  uniforms.humidityColorLow = hexToRgbVector(iceConfig.humidityLowColor)
                  uniforms.humidityColorMid = hexToRgbVector(iceConfig.humidityMidColor)
                  uniforms.humidityColorHigh = hexToRgbVector(iceConfig.humidityHighColor)
                  uniforms.clipXEnabled = iceConfig.clipXEnabled
                  uniforms.clipXMin = iceConfig.clipXMin
                  uniforms.clipXMax = iceConfig.clipXMax
                  uniforms.clipYEnabled = iceConfig.clipYEnabled
                  uniforms.clipYMin = iceConfig.clipYMin
                  uniforms.clipYMax = iceConfig.clipYMax
                  uniforms.clipZEnabled = iceConfig.clipZEnabled
                  uniforms.clipZMin = iceConfig.clipZMin
                  uniforms.clipZMax = iceConfig.clipZMax
                  uniforms.colorFilterEnabled = iceConfig.colorFilterEnabled
                  uniforms.targetColor = hexToRgbVector(iceConfig.targetColor)
                  uniforms.colorTolerance = iceConfig.colorTolerance
                }
                updateIceLegend()
              }

              function hexToRgbVector(hex) {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
                return result ? {
                  x: parseInt(result[1], 16) / 255,
                  y: parseInt(result[2], 16) / 255,
                  z: parseInt(result[3], 16) / 255
                } : { x: 0, y: 0, z: 0 }
              }

              const iceFolder = iceGui.addFolder('积冰区参数')
              iceFolder.add(iceConfig, 'steps', 50, 400).step(1).name('采样步数').onChange(updateIce)
              iceFolder.add(iceConfig, 'alphaPower', 0.1, 5).name('Alpha幂次').onChange(updateIce)
              iceFolder.add(iceConfig, 'minThreshold', 0, 1).name('最小阈值').onChange(updateIce)
              iceFolder.add(iceConfig, 'maxThreshold', 0, 1).name('最大阈值').onChange(updateIce)
              iceFolder.add(iceConfig, 'opacityScale', 0.1, 3).name('不透明度缩放').onChange(updateIce)

              // 数据切换
              const switchTexture = async (index) => {
                if (index >= 0 && index < iceTexturePaths.length && window.iceInstance && window.iceInstance.primitive && window.iceInstance.primitive.appearance) {
                  const newPath = iceTexturePaths[index].path
                  iceConfig.texturePath = newPath
                  iceConfig.currentTextureIndex = index

                  const earth = window.MSIMEarth
                  const viewer = window.EarthViewer
                  earth.Resource.createIfNeeded(newPath)
                    .fetchImage()
                    .then((res) => {
                      const cubeTex = new earth.Texture({
                        context: viewer.scene.context,
                        source: res,
                      })
                      cubeTex.type = "sampler2D"
                      window.iceInstance.primitive.appearance.uniforms.cubeTex = cubeTex
                      updateIceLegend()
                    })
                    .catch((error) => {
                      console.error("加载积冰纹理失败：", error)
                    })
                }
              }

              const iceNames = iceTexturePaths.map(item => item.name)
              const textureSelector = iceFolder.add(iceConfig, 'currentTextureIndex', iceNames).name('数据切换')
              textureSelector.onChange(async (selectedName) => {
                const selectedIndex = iceTexturePaths.findIndex(t => t.name === selectedName)
                if (selectedIndex !== -1) {
                  await switchTexture(selectedIndex)
                }
              })

              // 时序播放控制
              const playbackConfig = {
                isPlaying: false,
                interval: 1.0,
                timer: null
              }
              window.icePlaybackConfig = playbackConfig

              const playbackFolder = iceGui.addFolder('时序播放')
              playbackFolder.add(playbackConfig, 'interval', 0.1, 5).name('切换间隔(秒)')

              const togglePlayback = {
                toggle: () => {
                  if (playbackConfig.isPlaying) {
                    // 暂停
                    playbackConfig.isPlaying = false
                    playbackButton.name('▶ 播放')
                    if (playbackConfig.timer) {
                      clearTimeout(playbackConfig.timer)
                      playbackConfig.timer = null
                    }
                  } else {
                    // 播放
                    playbackConfig.isPlaying = true
                    playbackButton.name('⏸ 暂停')

                    const tick = () => {
                      let nextIndex = iceConfig.currentTextureIndex + 1
                      if (nextIndex >= iceTexturePaths.length) {
                        nextIndex = 0
                      }
                      switchTexture(nextIndex)
                      textureSelector.setValue(iceTexturePaths[nextIndex].name)
                      textureSelector.updateDisplay()

                      if (playbackConfig.isPlaying) {
                        playbackConfig.timer = setTimeout(tick, playbackConfig.interval * 1000)
                      }
                    }

                    tick()
                  }
                }
              }

              const playbackButton = playbackFolder.add(togglePlayback, 'toggle').name('▶ 播放')

              // 剖切工具控制
              const clipFolder = iceGui.addFolder('剖切工具')

              // X轴剖切
              const clipXFolder = clipFolder.addFolder('X轴剖切')
              clipXFolder.add(iceConfig, 'clipXEnabled').name('启用').onChange(updateIce)
              clipXFolder.add(iceConfig, 'clipXMin', 0.0, 1.0).name('最小位置').onChange(updateIce)
              clipXFolder.add(iceConfig, 'clipXMax', 0.0, 1.0).name('最大位置').onChange(updateIce)

              // Y轴剖切
              const clipYFolder = clipFolder.addFolder('Y轴剖切')
              clipYFolder.add(iceConfig, 'clipYEnabled').name('启用').onChange(updateIce)
              clipYFolder.add(iceConfig, 'clipYMin', 0.0, 1.0).name('最小位置').onChange(updateIce)
              clipYFolder.add(iceConfig, 'clipYMax', 0.0, 1.0).name('最大位置').onChange(updateIce)

              // Z轴剖切
              const clipZFolder = clipFolder.addFolder('Z轴剖切')
              clipZFolder.add(iceConfig, 'clipZEnabled').name('启用').onChange(updateIce)
              clipZFolder.add(iceConfig, 'clipZMin', 0.0, 1.0).name('最小位置').onChange(updateIce)
              clipZFolder.add(iceConfig, 'clipZMax', 0.0, 1.0).name('最大位置').onChange(updateIce)

              // 颜色过滤控制
              const colorFilterFolder = iceGui.addFolder('颜色过滤')
              colorFilterFolder.add(iceConfig, 'colorFilterEnabled').name('启用颜色过滤').onChange(updateIce)
              colorFilterFolder.addColor(iceConfig, 'targetColor').name('目标颜色').onChange(updateIce)
              colorFilterFolder.add(iceConfig, 'colorTolerance', 0.0, 1.0).name('颜色容差').onChange(updateIce)

              iceFolder.open()
              window.iceGuiInstance = iceGui
              window.icePlaybackConfig = playbackConfig
              // 确保新创建的GUI遵循当前显示状态
              if (!configPanelVisible && iceGui.domElement) {
                iceGui.domElement.style.display = 'none'
              }
            } catch (error) {
              console.error('Failed to create ice GUI:', error)
            }
            break
          case 'turbulence': //颠簸
            let turbulenceDC = new window.EarthPlugn.DCPrimitive({
              viewer: window.EarthViewer,
              earth: window.MSIMEarth
            })

            const turbulenceTexturePaths = [
              { name: '00:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_0000_lat_vertical_16x16_yellow.png' },
              { name: '01:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_0100_lat_vertical_16x16_yellow.png' },
              { name: '02:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_0200_lat_vertical_16x16_yellow.png' },
              { name: '03:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_0300_lat_vertical_16x16_yellow.png' },
              { name: '04:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_0400_lat_vertical_16x16_yellow.png' },
              { name: '05:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_0500_lat_vertical_16x16_yellow.png' },
              { name: '06:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_0600_lat_vertical_16x16_yellow.png' },
              { name: '07:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_0700_lat_vertical_16x16_yellow.png' },
              { name: '08:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_0800_lat_vertical_16x16_yellow.png' },
              { name: '09:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_0900_lat_vertical_16x16_yellow.png' },
              { name: '10:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_1000_lat_vertical_16x16_yellow.png' },
              { name: '11:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_1100_lat_vertical_16x16_yellow.png' },
              { name: '12:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_1200_lat_vertical_16x16_yellow.png' },
              { name: '13:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_1300_lat_vertical_16x16_yellow.png' },
              { name: '14:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_1400_lat_vertical_16x16_yellow.png' },
              { name: '15:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_1500_lat_vertical_16x16_yellow.png' },
              { name: '16:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_1600_lat_vertical_16x16_yellow.png' },
              { name: '17:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_1700_lat_vertical_16x16_yellow.png' },
              { name: '18:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_1800_lat_vertical_16x16_yellow.png' },
              { name: '19:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_1900_lat_vertical_16x16_yellow.png' },
              { name: '20:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_2000_lat_vertical_16x16_yellow.png' },
              { name: '21:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_2100_lat_vertical_16x16_yellow.png' },
              { name: '22:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_2200_lat_vertical_16x16_yellow.png' },
              { name: '23:00', path: '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_2300_lat_vertical_16x16_yellow.png' }
            ]

            const turbulenceConfig = {
              xmin: 120.18,
              xmax: 120.33,
              ymin: 24.05,
              ymax: 24.2,
              zmin: 2000.0,
              zmax: 4000.0,
              steps: 320.0,
              alphaCorrection: 0.3,
              humidityLowColor: '#ffcc00',
              humidityMidColor: '#ff9900',
              humidityHighColor: '#ff6600',
              gamma: 0.6,
              alphaPower: 0.8,
              minThreshold: 0.05,
              maxThreshold: 1.0,
              opacityScale: 3.0,
              dataCompression: 0.5,
              texturePath: turbulenceTexturePaths[0].path,
              currentTextureIndex: 0,
              texturePaths: turbulenceTexturePaths,
              clipXEnabled: false,
              clipXMin: 0.0,
              clipXMax: 1.0,
              clipYEnabled: false,
              clipYMin: 0.0,
              clipYMax: 1.0,
              clipZEnabled: false,
              clipZMin: 0.0,
              clipZMax: 1.0,
              colorFilterEnabled: false,
              targetColor: '#ffffff',
              colorTolerance: 0.3
            }

            const turbulencePrimitive = turbulenceDC.createTurbulenceTextureAliasOD(turbulenceConfig)
            window.turbulenceInstance = { DC: turbulenceDC, primitive: turbulencePrimitive, config: turbulenceConfig }

            const turbulenceCenterLon = (turbulenceConfig.xmin + turbulenceConfig.xmax) / 2
            const turbulenceCenterLat = (turbulenceConfig.ymin + turbulenceConfig.ymax) / 2
            const turbulenceLonDiff = turbulenceConfig.xmax - turbulenceConfig.xmin
            const turbulenceLatDiff = turbulenceConfig.ymax - turbulenceConfig.ymin
            const turbulenceMaxDiff = Math.max(turbulenceLonDiff, turbulenceLatDiff)
            const turbulenceCameraHeight = turbulenceMaxDiff * 111000 * 3

            window.EarthViewer.camera.setView({
              destination: window.MSIMEarth.Cartesian3.fromDegrees(turbulenceCenterLon, turbulenceCenterLat, turbulenceCameraHeight),
            })

            const createTurbulenceLegend = () => {
              let legend = document.getElementById('turbulence-legend')
              if (!legend) {
                legend = document.createElement('div')
                legend.id = 'turbulence-legend'
                legend.style.cssText = `
                  position: absolute;
                  top: 80px;
                  right: 120px;
                  background: rgba(20, 30, 50, 0.95);
                  padding: 12px 15px;
                  border-radius: 8px;
                  color: white;
                  font-size: 12px;
                  z-index: 1;
                  min-width: 180px;
                  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
                  border: 1px solid rgba(255, 200, 100, 0.3);
                `
                document.body.appendChild(legend)
              }
              updateTurbulenceLegend()
              // 短暂延迟后更新所有图例位置
              setTimeout(updateAllLegendPositions, 100)
            }

            const updateTurbulenceLegend = () => {
              const legend = document.getElementById('turbulence-legend')
              if (!legend) return

              const currentDataName = turbulenceTexturePaths[turbulenceConfig.currentTextureIndex]?.name || '数据'
              // <div style="display: flex; justify-content: space-between; margin-top: 4px;">
              //   <span>0</span>
              //   <span>5</span>
              //   <span>8</span>
              //   <span>强</span>
              // </div>
              legend.innerHTML = `
                <div style="font-weight: bold; margin-bottom: 8px;">颠簸区图例</div>
                <div style="height: 24px; border-radius: 4px; margin: 8px 0; background: linear-gradient(to right,
                  rgba(255, 200, 50, 0.3) 0%,
                  rgba(255, 180, 30, 0.5) 30%,
                  rgba(255, 150, 10, 0.75) 55%,
                  rgba(255, 120, 0, 0.9) 75%,
                  rgba(255, 100, 50, 1.0) 100%
                );"></div>

                <div style="display: flex; justify-content: space-between; margin-top: 4px; font-size: 10px; opacity: 0.9;">
                  <span>弱</span>
                  <span>中</span>
                  <span>强</span>
                </div>
                <div style="margin-top: 8px; font-size: 10px; opacity: 0.8; border-top: 1px solid rgba(255, 200, 100, 0.3); padding-top: 8px;">
                  ${currentDataName}
                </div>
              `
              // 更新内容变化后重新排列
              setTimeout(updateAllLegendPositions, 50)
            }

            createTurbulenceLegend()

            try {
              const dat = await import('dat.gui')
              const turbulenceGui = new dat.GUI({ name: '颠簸参数配置' })

              turbulenceGui.domElement.style.position = 'absolute'
              turbulenceGui.domElement.style.width = '242px'
              turbulenceGui.domElement.style.left = '500px'
              turbulenceGui.domElement.style.top = '100px'
              turbulenceGui.domElement.style.right = 'auto'
              turbulenceGui.domElement.style.zIndex = '1'

              const updateTurbulence = () => {
                if (window.turbulenceInstance && window.turbulenceInstance.primitive && window.turbulenceInstance.primitive.appearance && window.turbulenceInstance.primitive.appearance.uniforms) {
                  const uniforms = window.turbulenceInstance.primitive.appearance.uniforms
                  uniforms.steps = turbulenceConfig.steps
                  uniforms.alphaCorrection = turbulenceConfig.alphaCorrection
                  uniforms.gammaCorrection = turbulenceConfig.gamma
                  uniforms.alphaPower = turbulenceConfig.alphaPower
                  uniforms.minThreshold = turbulenceConfig.minThreshold
                  uniforms.maxThreshold = turbulenceConfig.maxThreshold
                  uniforms.opacityScale = turbulenceConfig.opacityScale
                  uniforms.dataCompression = turbulenceConfig.dataCompression
                  uniforms.humidityColorLow = hexToRgbVector(turbulenceConfig.humidityLowColor)
                  uniforms.humidityColorMid = hexToRgbVector(turbulenceConfig.humidityMidColor)
                  uniforms.humidityColorHigh = hexToRgbVector(turbulenceConfig.humidityHighColor)
                  uniforms.clipXEnabled = turbulenceConfig.clipXEnabled
                  uniforms.clipXMin = turbulenceConfig.clipXMin
                  uniforms.clipXMax = turbulenceConfig.clipXMax
                  uniforms.clipYEnabled = turbulenceConfig.clipYEnabled
                  uniforms.clipYMin = turbulenceConfig.clipYMin
                  uniforms.clipYMax = turbulenceConfig.clipYMax
                  uniforms.clipZEnabled = turbulenceConfig.clipZEnabled
                  uniforms.clipZMin = turbulenceConfig.clipZMin
                  uniforms.clipZMax = turbulenceConfig.clipZMax
                  uniforms.colorFilterEnabled = turbulenceConfig.colorFilterEnabled
                  uniforms.targetColor = hexToRgbVector(turbulenceConfig.targetColor)
                  uniforms.colorTolerance = turbulenceConfig.colorTolerance
                }
                updateTurbulenceLegend()
              }

              function hexToRgbVector(hex) {
                const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
                return result ? {
                  x: parseInt(result[1], 16) / 255,
                  y: parseInt(result[2], 16) / 255,
                  z: parseInt(result[3], 16) / 255
                } : { x: 0, y: 0, z: 0 }
              }

              const turbulenceFolder = turbulenceGui.addFolder('颠簸区参数')
              turbulenceFolder.add(turbulenceConfig, 'steps', 50, 400).step(1).name('采样步数').onChange(updateTurbulence)
              turbulenceFolder.add(turbulenceConfig, 'alphaPower', 0.1, 5).name('Alpha幂次').onChange(updateTurbulence)
              turbulenceFolder.add(turbulenceConfig, 'minThreshold', 0, 1).name('最小阈值').onChange(updateTurbulence)
              turbulenceFolder.add(turbulenceConfig, 'maxThreshold', 0, 1).name('最大阈值').onChange(updateTurbulence)
              turbulenceFolder.add(turbulenceConfig, 'opacityScale', 0.1, 3).name('不透明度缩放').onChange(updateTurbulence)

              // 数据切换
              const switchTexture = async (index) => {
                if (index >= 0 && index < turbulenceTexturePaths.length && window.turbulenceInstance && window.turbulenceInstance.primitive && window.turbulenceInstance.primitive.appearance) {
                  const newPath = turbulenceTexturePaths[index].path
                  turbulenceConfig.texturePath = newPath
                  turbulenceConfig.currentTextureIndex = index

                  const earth = window.MSIMEarth
                  const viewer = window.EarthViewer
                  earth.Resource.createIfNeeded(newPath)
                    .fetchImage()
                    .then((res) => {
                      const cubeTex = new earth.Texture({
                        context: viewer.scene.context,
                        source: res,
                      })
                      cubeTex.type = "sampler2D"
                      window.turbulenceInstance.primitive.appearance.uniforms.cubeTex = cubeTex
                      updateTurbulenceLegend()
                    })
                    .catch((error) => {
                      console.error("加载点播纹理失败：", error)
                    })
                }
              }

              const turbulenceNames = turbulenceTexturePaths.map(item => item.name)
              const textureSelector = turbulenceFolder.add(turbulenceConfig, 'currentTextureIndex', turbulenceNames).name('数据切换')
              textureSelector.onChange(async (selectedName) => {
                const selectedIndex = turbulenceTexturePaths.findIndex(t => t.name === selectedName)
                if (selectedIndex !== -1) {
                  await switchTexture(selectedIndex)
                }
              })

              // 时序播放控制
              const playbackConfig = {
                isPlaying: false,
                interval: 1.0,
                timer: null
              }
              window.turbulencePlaybackConfig = playbackConfig

              const playbackFolder = turbulenceGui.addFolder('时序播放')
              playbackFolder.add(playbackConfig, 'interval', 0.1, 5).name('切换间隔(秒)')

              const togglePlayback = {
                toggle: () => {
                  if (playbackConfig.isPlaying) {
                    // 暂停
                    playbackConfig.isPlaying = false
                    playbackButton.name('▶ 播放')
                    if (playbackConfig.timer) {
                      clearTimeout(playbackConfig.timer)
                      playbackConfig.timer = null
                    }
                  } else {
                    // 播放
                    playbackConfig.isPlaying = true
                    playbackButton.name('⏸ 暂停')

                    const tick = () => {
                      let nextIndex = turbulenceConfig.currentTextureIndex + 1
                      if (nextIndex >= turbulenceTexturePaths.length) {
                        nextIndex = 0
                      }
                      switchTexture(nextIndex)
                      textureSelector.setValue(turbulenceTexturePaths[nextIndex].name)
                      textureSelector.updateDisplay()

                      if (playbackConfig.isPlaying) {
                        playbackConfig.timer = setTimeout(tick, playbackConfig.interval * 1000)
                      }
                    }

                    tick()
                  }
                }
              }

              const playbackButton = playbackFolder.add(togglePlayback, 'toggle').name('▶ 播放')

              // 剖切工具控制
              const clipFolder = turbulenceGui.addFolder('剖切工具')

              // X轴剖切
              const clipXFolder = clipFolder.addFolder('X轴剖切')
              clipXFolder.add(turbulenceConfig, 'clipXEnabled').name('启用').onChange(updateTurbulence)
              clipXFolder.add(turbulenceConfig, 'clipXMin', 0.0, 1.0).name('最小位置').onChange(updateTurbulence)
              clipXFolder.add(turbulenceConfig, 'clipXMax', 0.0, 1.0).name('最大位置').onChange(updateTurbulence)

              // Y轴剖切
              const clipYFolder = clipFolder.addFolder('Y轴剖切')
              clipYFolder.add(turbulenceConfig, 'clipYEnabled').name('启用').onChange(updateTurbulence)
              clipYFolder.add(turbulenceConfig, 'clipYMin', 0.0, 1.0).name('最小位置').onChange(updateTurbulence)
              clipYFolder.add(turbulenceConfig, 'clipYMax', 0.0, 1.0).name('最大位置').onChange(updateTurbulence)

              // Z轴剖切
              const clipZFolder = clipFolder.addFolder('Z轴剖切')
              clipZFolder.add(turbulenceConfig, 'clipZEnabled').name('启用').onChange(updateTurbulence)
              clipZFolder.add(turbulenceConfig, 'clipZMin', 0.0, 1.0).name('最小位置').onChange(updateTurbulence)
              clipZFolder.add(turbulenceConfig, 'clipZMax', 0.0, 1.0).name('最大位置').onChange(updateTurbulence)

              // 颜色过滤控制
              const colorFilterFolder = turbulenceGui.addFolder('颜色过滤')
              colorFilterFolder.add(turbulenceConfig, 'colorFilterEnabled').name('启用颜色过滤').onChange(updateTurbulence)
              colorFilterFolder.addColor(turbulenceConfig, 'targetColor').name('目标颜色').onChange(updateTurbulence)
              colorFilterFolder.add(turbulenceConfig, 'colorTolerance', 0.0, 1.0).name('颜色容差').onChange(updateTurbulence)

              turbulenceFolder.open()
              window.turbulenceGuiInstance = turbulenceGui
              window.turbulencePlaybackConfig = playbackConfig
              // 确保新创建的GUI遵循当前显示状态
              if (!configPanelVisible && turbulenceGui.domElement) {
                turbulenceGui.domElement.style.display = 'none'
              }
            } catch (error) {
              console.error('Failed to create turbulence GUI:', error)
            }
            break
          case 'showConfigPanel': //配置面板 - 显示
            configPanelVisible = true
            toggleAllGuiPanels(true)
            break
          case 'humidity2': //湿度区域2
            this.dataController.addHumidity('/static/config/json/parsed_humidity_r4c4.json', '湿度2')
            break
          case 'humidity3': //湿度区域3
            this.dataController.addHumidity('/static/config/json/parsed_humidity_r3c4.json', '湿度3')
            break
          case 'cloud1': //云层1
            let config = {
              xmin: 116.5,
              xmax: 123.5,
              ymin: 20.8,
              ymax: 25.8,
              zmin: 1000.0,
              zmax: 15000.0,
              alphaCorrection: 1.82
            }
            cusP.createTextureAtlas(
              'tw_cloud',
              './static/image/texture/cloud/TCC_2024-02-05_1100_z_interp_crop_100m_lat_vertical_16x16.png',
              config
            )
            // this.dataController.addCloud('/static/config/json/parsed_cloud_r4c5.json', '云层1')
            break
          case 'cloud2': //云层2
            this.dataController.addCloud('/static/config/json/parsed_cloud_r4c4.json', '云层2')
            break
          case 'cloud3': //云层3
            this.dataController.addCloud('/static/config/json/parsed_cloud_r3c4.json', '云层3')
            break
          case 'airportWeather': //机场气象
            this.dataController.addAirportWeather()
            break

          case 'daLangDistrict': //大浪区
            this.polygonGeojson.addDaLangQu(lqName)
            break
          case 'addStaticTarget': // 静态标注显示
            store.state.AFSIMModule.paDataShow = true
            this.PADataUpdate()
            break
          case 'addZuoZhanArea':
            console.log('加载作战区域')
            let dataController = new window.EarthPlugn.DataControl({
              earth: window.MSIMEarth,
              viewer: window.EarthViewer
            })
            let currentSceneInfo =
              window.localStorage.getItem('currentSceneInfo')
            if (currentSceneInfo) {
              let currentSceneInfoObj = JSON.parse(currentSceneInfo)
              if (currentSceneInfoObj.scenarioId) {
                getZZQYData({ id: currentSceneInfoObj.scenarioId })
                  .then((res) => {
                    if (res.code !== 200) {
                      console.log('未获取到正确数据', res.code)
                      return
                    }
                    res.data.bjsonScenarioData.areaPathNodes.forEach(
                      (areaData) => {
                        switch (areaData.type) {
                          case '军事区':
                            dataController.addZZQU(areaData)
                            break
                          case '待战区':
                            dataController.addZZQU(areaData)
                            break
                          default:
                            break
                        }
                      }
                    )
                  })
                  .catch((err) => {
                    console.log('获取场景区域数据失败', err)
                  })
              }
            }

            // console.log('当前场景id', store.state.sceneModule.sceneInfo.scenarioId)
            // let param = {
            //   id: store.state.sceneModule.sceneInfo.scenarioId
            // }
            // getById(param).then((res) => {
            //   console.log(res)
            // })
            // this.dataController.showZZQY({
            //   url: 'static/config/json/作战区域.json',
            //   id: 'lhzzxy',
            //   checked: true
            // })
            break
          case 'campaignSituation': //战役态势
            // const { handlePA } = window.EarthPlugn.seaAirJointOperationsPA()
            // indexedDBController.getAllPAData(handlePA)
            // store.state.sceneModule.sceneEnityData.map((item) => {
            //   if (item.Data.Name == json.Data.Name) {
            //     exits = true
            //     return
            //   }
            // })
            // indexedDBController.removePAData(function (json) {
            //   window.EarthViewer.entities.removeById(json.Data.Name)
            //   EarthAPP.labelCollection._labels.forEach((e) => {
            //     if (e?.id === json.Data.Name) {
            //       EarthAPP.labelCollection.remove(e)
            //     }
            //   })
            // })
            // store.state.sceneModule.sceneEnityData.forEach((item) => {
            //   if (!item.hidden && item.Data.side === 'blue') handlePA(item)
            // })
            // window.zyts = true
            // pauseTime({ simulationId: '45465' }).then((res) => {
            //   if (res.code == 200) {
            //     store.commit('setPlayState', 'pause') //暂停
            //     emitter.emit('changeTimeLineState', true) //显示时间轴
            //     store.commit(
            //       'setClockCurrentTime',
            //       EarthViewer.clock.currentTime.toString()
            //     ) //存储当前cesium事件轴时间
            //     const params = {
            //       scenarioId: store.state.curSceneInfo.scenarioId
            //     }
            //     exportSML(params).then((res) => {
            //       console.log(res)
            //       this.loadPlotData(res)
            //     })
            //   }
            // })
            this.loadSmlFile()
            break
          case 'operationalArea': //战区绘制  作战区域
            // this.entityManage.addZZQY()
            window.EarthViewer.dataSources._dataSources.forEach(
              (dataSource) => {
                if (dataSource._name == '作战区域') {
                  dataSource.show = true
                  //显示作战区域内的label文字
                  var entities = dataSource.entities.values
                  for (let i = 0; i < entities.length; i++) {
                    let entity = entities[i]
                    for (let i = 0; i < EarthAPP.labelCollection.length; ++i) {
                      const l = EarthAPP.labelCollection.get(i)
                      if (entity.properties && entity.properties.label) {
                        if (l.text === entity.properties.label._value) {
                          l.show = true
                        }
                      }
                    }
                  }
                }
              }
            )
            break
          case 'atmosphereArea': //气象区域绘制
            store.state.sceneModule.quyuWeatherVisible = true
            // 创建数据管理对象
            this.dataController.addGeojsonWeather(
              {
                url: basicVectorData.tianqiquyu,
                id: '矢量天气',
                backLoad: false
              },
              store.state.sceneModule.quyuWeatherVisible
            )
            store.commit('setVectorWeatherConfig', true)
            break
          case 'civilAviationRoutes': //民航航线
            {
              // 航线
              val.data.MHResultData.FlightList.Flight.forEach((element) => {
                let arr = []
                let WayPoint = []
                let routeName = ' '
                if (element.AirRouteList.AirRoute instanceof Array) {
                  routeName = element.AirRouteList.AirRoute[0].CoRoute
                  WayPoint =
                    element.AirRouteList.AirRoute[0].WayPointList.split(';')
                } else {
                  routeName = element.AirRouteList.AirRoute.CoRoute
                  WayPoint =
                    element.AirRouteList.AirRoute.WayPointList.split(';')
                }
                WayPoint.forEach((i) => {
                  if (i) {
                    arr.push(Number(i.split(',')[3]), Number(i.split(',')[2]))
                    let pointLabel = {
                      longitude: Number(i.split(',')[3]),
                      latitude: Number(i.split(',')[2]),
                      text: i.split(',')[0]
                    }
                    if (!this.viewer.entities.getById(i.split(',')[0])) {
                      this.entityManage.addPoint(pointLabel)
                      this.pointLabelList.push(pointLabel)
                    }
                  }
                })
                if (
                  routeName == 'ZGGGZYTL001' ||
                  routeName == 'ZGOWZBAA001' ||
                  routeName == 'ZSSSRCSSL01' ||
                  routeName == 'ZBAAZGZJ001' ||
                  routeName == 'RCTPZUUUA02'
                ) {
                  let minhang = this.primitiveManage.addPrimitive4(arr, '1')
                  this.minhangList.push(minhang)
                } else if (
                  routeName == 'ZGOWZBAA003' ||
                  routeName == 'ZBAAZGZJ002'
                ) {
                  let minhang = this.primitiveManage.addPrimitive4(arr, '2')
                  this.minhangList.push(minhang)
                } else {
                  let minhang = this.primitiveManage.addPrimitive4(arr, '0')
                  this.minhangList.push(minhang)
                }
              })
            }
            break
          case 'topographicMap': //地形图
            break
          case 'spaceBox': //空间盒
            val.data.forEach((item) => {
              this.entityManage.addPolygon(item)
            })
            break
          case 'firstGrid': //第一层网格
            this.entityManage.addfirtsGrid(180, -180, 80, -80, 6, 4)
            break
          case 'secondGrid': //第二层网格
            this.entityManage.addSecondGrid(125, 114, 40, 36, 30 / 60, 30 / 60)
            break
          case 'beiDouSatellit': //北斗卫星
            this.dataController.addBeiDou()
            break
          case 'eMEnvironmentInfo': //电磁环境信息
            let params = {
              sceneId: store.state.curSceneInfo.scenarioId
            }
            getEMEnvironmentInfo(params).then(async (res) => {
              if (res.code == 200 && res.data) {
                window.EarthViewer.entities.add({
                  id: 'eMEnvironmentInfoImg',
                  name: 'eMEnvironmentInfoImg',
                  rectangle: {
                    coordinates: window.MSIMEarth.Rectangle.fromDegrees(
                      res.data.minLon,
                      res.data.minLat,
                      res.data.maxLon,
                      res.data.maxLat
                    ),
                    material: res.data.imgUrl
                  }
                })
              }
            })
            break
          case 'airKyLayer': //空域
            // 空域geoJson数据 加载数据显示
            // window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
            //   if (dataSource.name == '空域') {
            //     window.EarthViewer.dataSources.remove(dataSource)
            //   }
            // })
            this.dataController.addGeojsonByKyAreaFile(
              {
                url: './static/data/geojson/空域.json',
                id: '空域',
                backLoad: true
              },
              true
            )
            break
          case 'radarDetection1': //雷达探测1
            this.dataController.addleidaganrao(0)
            break
          case 'radarDetection2': //雷达探测2
            this.dataController.addleidaganrao(1)
            break
          case 'radarDetection3': //雷达探测3
            this.dataController.addleidaganrao(2)
            break
          case 'radarVector': //雷达矢量
            this.dataController.addleidashiliang()
            break
          case 'radarEllipse': //雷达矢量
            this.dataController.addRadarEllipse()
            break
          case 'satelliteTurnOn': //雷达矢量
            this.dataController.satelliteTurnOn()
            break
          case 'fineModel': //精细模型
            store.commit('setdetailedModel', true)
            // 开启模型切换判定条件，切换成功后立即关闭
            store.state.sceneModule.isChangeModel = true
            // 需要切换静态目标显示模式为非JB模式并调用PA接口重置静态目标
            store.state.sceneModule.showJB = false
            let curSide = window.localStorage.getItem('side')
            setTimeout(() => {
              getPAStatic({ side: curSide }).then((res) => { })
            }, 1500)
            break
          case 'modelOutline': //模型描边
            if (store.state.sceneModule.modelConfig.detailedModel == true)
              store.commit('setmodelOutline', true)
            break
          case 'radarDetect': //雷达探测
            connectLineManage.showEntityByKeyword('RE_SDC', true)
            store.commit('setSDC', true)
            break
          case 'sensorTracking': //传感器追踪
            connectLineManage.showEntityByKeyword('RE_STrackInit', true)
            store.commit('setSensorTracking', true)
            break
          case 'localTracking': //区域追踪
            connectLineManage.showEntityByKeyword('RE_LTrackInit', true)
            store.commit('setLocalTracking', true)
            break
          case 'fireHitting': //火力打击
            connectLineManage.showEntityByKeyword('RE_WeaponF', true)
            connectLineManage.showEntityByKeyword('distancelabel', true)
            store.commit('setFireHitting', true)
            break
          case 'targetKill': //目标击毁
            connectLineManage.showEntityByKeyword('RE_WeaponWH', true)
            store.commit('setTargetKill', true)
            break
          case 'electInterference': //电磁干扰
            connectLineManage.showEntityByKeyword('RE_JamA', true)
            store.commit('setElectInterference', true)
            break
          case 'networkCommunication': //网络通信
            connectLineManage.showEntityByKeyword('RE_MR', true)
            store.commit('setNetworkCommunication', true)
            break
          case 'taskAssociation': //任务关联
            connectLineManage.showEntityByKeyword('Task_Aign', true)
            store.commit('setTaskAssociation', true)
            break
          case 'redpositionTag': //红方位置
            store.state.sceneModule.redPlaneConfig.push(val.name)
            store.commit('setredPositionTag', true)
            break
          case 'redpostureTag': //红方姿态
            store.state.sceneModule.redPlaneConfig.push(val.name)
            store.commit('setredPostureTag', true)
            break
          case 'redspeedTag': //红方速度
            store.state.sceneModule.redPlaneConfig.push(val.name)
            store.commit('setredSpeedTag', true)
            break
          case 'redtypeTag': //红方类型
            store.state.sceneModule.redPlaneConfig.push(val.name)
            store.commit('setredTypeTag', true)
            break
          case 'bluepositionTag': //蓝方位置
            store.state.sceneModule.bluePlaneConfig.push(val.name)
            store.commit('setbluePositionTag', true)
            break
          case 'bluepostureTag': //蓝方姿态
            store.state.sceneModule.bluePlaneConfig.push(val.name)
            store.commit('setbluePostureTag', true)
            break
          case 'bluespeedTag': //蓝方速度
            store.state.sceneModule.bluePlaneConfig.push(val.name)
            store.commit('setblueSpeedTag', true)
            break
          case 'bluetypeTag': //蓝方类型
            store.state.sceneModule.bluePlaneConfig.push(val.name)
            store.commit('setblueTypeTag', true)
            break
          case 'radarRender':
            store.state.AFSIMModule.rw_radarShow = true
            window.EarthViewer.entities.forEach((entity) => {
              if (entity.id.indexOf('ew_radar_sensor_ellipse') > -1) {
                entity.show = store.state.AFSIMModule.rw_radarShow
              }
            })
            break
          case 'taiwanAirport': //台湾机场港口
            store.commit('changeCEarthComp', {
              name: val.componentName,
              props: {}
            })
            break
          case 'taiwanMissilePosition': //台湾导弹阵地
            store.commit('changeCEarthComp', {
              name: val.componentName,
              props: {}
            })
            break
          case 'heatMap': //侦察需求热力图
            addHeatMap(true)
            break
        }
      } else {
        switch (val.code) {
          case 'vectorLayer': //矢量底图
            this.dataController.removeLaer('全球矢量底图')
            break
          case 'vectorLayer2': //矢量底图（带标注）
            this.dataController.removeLaer('全球矢量底图2')
            break
          case 'vectorLayer3': //暗色矢量底图
            this.dataController.removeLaer('全球矢量底图3')
            break
          case 'terrainImagery': //矢量底图
            this.dataController.removeLaer('全球地形影像底图')
            break
          case 'bingLayer': //全球高清影像
            this.dataController.removeLaer('bing底图')
            break
          case 'blackMapUrlLayer': //添加西安发布矢量深色底图
            this.dataController.removeLaer('矢量深色底图')
            break
          case 'areaLayer': //移除西安发布区域高清影像
            this.dataController.removeLaer('齐齐哈尔机场')
            this.dataController.removeLaer('拉林机场')
            break
          case 'yunXuanLayer': //移除西安发布全球晕眩图
            this.dataController.removeLaer('全球晕眩图')
            break
          case 'globalTerrain': //全球地形
            this.dataController.removeTerrianLayer()
            break
          case 'TWOSGB': //移除TW地球OSGB
            this.dataController.removeTWOSGB()
            break
          case 'earthRotation': //地球自转
            store.commit('setEarthRotate', false)
            Callback(false)
            break
          case 'earthIllumination': //地球光照
            store.commit('setEarthLight', false)
            illumination(false)
            break
          case 'nineLine': //九段线
            this.dataController.clearLayerGeo('nineLine')
            break
          case 'islandChain': //岛链
            this.dataController.clearLayerGeo('daolian1')
            this.dataController.clearLayerGeo('daolian2')
            this.dataController.clearLayerGeo('daolian3')
            break
          case 'fourSeaTwoBorder': //四海两边
            this.dataController.clearLayerGeo('4H2B')
            break
          case 'airportRes': //机场资源
            store.commit('setLegendSatellite', false)
            this.dataController.clearLayerGeo('DALUJICHANG')
            this.dataController.clearLayerGeo('TAIWANJICHANG')
            break
          case 'nationalPoint': //国家点
            this.dataController.removeEntity({ entityId: 'shoudu' })
            this.dataController.removeEntity({ entityId: 'china' })
            break
          case 'mainCity': //地名
            this.dataController.clearLayerGeo('city1')
            this.dataController.clearLayerGeo('city2')
            this.dataController.clearLayerGeo('蓝方城市')
            this.dataController.clearLayerGeo('绿方基地')
            this.dataController.clearLayerGeo('紫方城市')
            this.dataController.clearLayerGeo('紫方基地')
            break
          case 'nationalBoundaryLine': //国家边界线
            this.dataController.clearLayerGeo('guojiexian')
            this.dataController.clearLayerGeo('guojiexian2')
            this.dataController.clearLayerGeo('shengjiexian')
            this.dataController.clearLayerGeo('nineLine')
            break
          case 'importanceTarget': //重要目标
            this.dataController.clearImPort()
            break
          case 'taiwanInformationNetwork': //台湾信息网
            twhy.removeTaiTXW()
            break
          case 'taiwanShippingLine': //台湾海运线
            twhy.removeTaiHYX()
            break
          case 'taiwanStraitNoNavigationZone': //台湾禁航区
            twhy.removeTaiHYJZ()
            break
          case 'regionalAnnotation': //区域标注
            for (let i = 0; i < regionalAnnotationData.length; i++) {
              const element = regionalAnnotationData[i]
              this.entityManage.deleteEntities(element.text)
            }
            window.EarthViewer.camera.flyTo({
              destination: new window.MSIMEarth.Cartesian3(
                -5418244.193941416,
                17724932.69795304,
                14148138.71947941
              )
            })
            break
          case 'identificationZone': //防空识别区
            this.entityManage.deleteEntities('twfksbq_polyline_id')
            this.entityManage.deleteEntities('twfksbq_name_id')
            this.dataController.clearLayerGeo('防空2')
            this.entityManage.deleteEntities('dhfksbq_name_id')
            break
          case 'opticalDetectionZone': //光学探测区域
            store.state.AFSIMModule.opticalDqST = false
            setTimeout(() => {
              cusP.removeDQPrimitive('opticalDetectionZone')
              cusP.removeDQPrimitive('opticalDetectionZoneLine')
            }, 500);
            break
          case 'infraredDetectionZone': //红外探测区域
            store.state.AFSIMModule.infraredDqST = false
            setTimeout(() => {
              cusP.removeDQPrimitive('infraredDetectionZone')
              cusP.removeDQPrimitive('infraredDetectionZoneLine')
            }, 500);
            break
          case 'wind': //风场
            const wind3dInstance = window.wind3dInstance
            const windGuiInstance = window.windGuiInstance

            if (wind3dInstance) {
              if (typeof wind3dInstance.isDestroyed === 'function' && !wind3dInstance.isDestroyed()) {
                if (typeof wind3dInstance.destroy === 'function') {
                  try {
                    wind3dInstance.destroy()
                  } catch (e) {
                    console.warn('Error destroying wind3d:', e)
                  }
                }
              }
              try {
                window.EarthViewer.scene.primitives.remove(wind3dInstance)
              } catch (e) {
                console.warn('Error removing wind3d from primitives:', e)
              }
              window.wind3dInstance = null
            }

            if (windGuiInstance) {
              try {
                windGuiInstance.destroy()
              } catch (e) {
                console.warn('Error destroying wind GUI:', e)
              }
              window.windGuiInstance = null
            }

            const windLegend = document.getElementById('wind-legend')
            if (windLegend) {
              windLegend.remove()
            }
            // 图例删除后重新排列剩余图例
            setTimeout(updateAllLegendPositions, 50)
            break
          case 'ARMultiPoints': //地表影像
            store.state.AFSIMModule.showARMultiPoints = false
            break
          case 'humidity': //湿度
            const humidityInstance = window.humidityInstance
            const humidityGuiInstance = window.humidityGuiInstance
            const humidityPlaybackConfig = window.humidityPlaybackConfig

            // 清理播放计时器
            if (humidityPlaybackConfig) {
              if (humidityPlaybackConfig.timer) {
                clearTimeout(humidityPlaybackConfig.timer)
                humidityPlaybackConfig.timer = null
              }
              humidityPlaybackConfig.isPlaying = false
            }

            if (humidityInstance && humidityInstance.primitive) {
              try {
                window.EarthViewer.scene.primitives.remove(humidityInstance.primitive)
              } catch (e) {
                console.warn('Error removing humidity primitive:', e)
              }
            }

            if (humidityGuiInstance) {
              try {
                humidityGuiInstance.destroy()
              } catch (e) {
                console.warn('Error destroying humidity GUI:', e)
              }
              window.humidityGuiInstance = null
            }

            const humidityLegend = document.getElementById('humidity-legend')
            if (humidityLegend) {
              humidityLegend.remove()
            }

            window.humidityInstance = null
            window.humidityPlaybackConfig = null
            // 图例删除后重新排列剩余图例
            setTimeout(updateAllLegendPositions, 50)
            break
          case 'ice': //积冰
            const iceInstance = window.iceInstance
            const iceGuiInstance = window.iceGuiInstance
            const icePlaybackConfig = window.icePlaybackConfig

            // 清理播放计时器
            if (icePlaybackConfig) {
              if (icePlaybackConfig.timer) {
                clearTimeout(icePlaybackConfig.timer)
                icePlaybackConfig.timer = null
              }
              icePlaybackConfig.isPlaying = false
            }

            if (iceInstance && iceInstance.primitive) {
              try {
                window.EarthViewer.scene.primitives.remove(iceInstance.primitive)
              } catch (e) {
                console.warn('Error removing ice primitive:', e)
              }
            }

            if (iceGuiInstance) {
              try {
                iceGuiInstance.destroy()
              } catch (e) {
                console.warn('Error destroying ice GUI:', e)
              }
              window.iceGuiInstance = null
            }

            const iceLegend = document.getElementById('ice-legend')
            if (iceLegend) {
              iceLegend.remove()
            }

            window.iceInstance = null
            window.icePlaybackConfig = null
            // 图例删除后重新排列剩余图例
            setTimeout(updateAllLegendPositions, 50)
            break
          case 'turbulence': //颠簸
            const turbulenceInstance = window.turbulenceInstance
            const turbulenceGuiInstance = window.turbulenceGuiInstance
            const turbulencePlaybackConfig = window.turbulencePlaybackConfig

            // 清理播放计时器
            if (turbulencePlaybackConfig) {
              if (turbulencePlaybackConfig.timer) {
                clearTimeout(turbulencePlaybackConfig.timer)
                turbulencePlaybackConfig.timer = null
              }
              turbulencePlaybackConfig.isPlaying = false
            }

            if (turbulenceInstance && turbulenceInstance.primitive) {
              try {
                window.EarthViewer.scene.primitives.remove(turbulenceInstance.primitive)
              } catch (e) {
                console.warn('Error removing turbulence primitive:', e)
              }
            }

            if (turbulenceGuiInstance) {
              try {
                turbulenceGuiInstance.destroy()
              } catch (e) {
                console.warn('Error destroying turbulence GUI:', e)
              }
              window.turbulenceGuiInstance = null
            }

            const turbulenceLegend = document.getElementById('turbulence-legend')
            if (turbulenceLegend) {
              turbulenceLegend.remove()
            }

            window.turbulenceInstance = null
            window.turbulencePlaybackConfig = null
            // 图例删除后重新排列剩余图例
            setTimeout(updateAllLegendPositions, 50)
            break
          case 'showConfigPanel': //配置面板 - 隐藏
            configPanelVisible = false
            toggleAllGuiPanels(false)
            break
          case 'humidity2': //湿度区域2
            this.dataController.removeHumidity('湿度2')
            break
          case 'humidity3': //湿度区域3
            this.dataController.removeHumidity('湿度3')
            break
          case 'cloud1': //云层1
            cusP.removeTextureAtlasPrimitive('tw_cloud')
            break
          case 'cloud2': //云层2
            this.dataController.removeCloud('云层2')
            break
          case 'cloud3': //云层3
            this.dataController.removeCloud('云层3')
            break
          case 'airportWeather': //机场气象
            this.dataController.removeAirportWeather()
            this.minhangList = []
            this.pointLabelList = []
            break
          case 'daLangDistrict': //大浪区
            let seaHightArea = this.viewer.dataSources.getByName(
              'entitiesSeaHightArea'
            )
            if (seaHightArea[0]) {
              this.viewer.dataSources.remove(seaHightArea[0])
            }
            this.viewer.entities.removeById('大浪')
            this.viewer.entities.removeById('中浪')
            this.viewer.entities.removeById('轻浪')
            break
          case 'addStaticTarget': // 静态标注隐藏
            store.state.AFSIMModule.paDataShow = false
            this.PADataUpdate()
            break
          case 'addZuoZhanArea':
            console.log('移除作战区域')
            let currentSceneInfo =
              window.localStorage.getItem('currentSceneInfo')
            let currentSceneInfoObj = JSON.parse(currentSceneInfo)
            if (currentSceneInfoObj.scenarioId) {
              getZZQYData({ id: currentSceneInfoObj.scenarioId })
                .then((res) => {
                  if (res.code !== 200) {
                    console.log('未获取到正确数据', res.code)
                    return
                  }
                  res.data.bjsonScenarioData.areaPathNodes.forEach(
                    (areaData) => {
                      switch (areaData.type) {
                        case '军事区':
                          window.EarthViewer.entities.removeById(areaData.id)
                          break
                        case '待战区':
                          window.EarthViewer.entities.removeById(areaData.id)
                          break
                        default:
                          break
                      }
                    }
                  )
                })
                .catch((err) => {
                  console.log('获取场景区域数据失败', err)
                })
            }
            // this.dataController.showZZQY({
            //   url: 'static/config/json/作战区域.json',
            //   id: 'lhzzxy',
            //   checked: false
            // })
            break
          case 'campaignSituation': //战役态势
            console.log(112233)

            // const { handlePA } = window.EarthPlugn.seaAirJointOperationsPA()
            // indexedDBController.getAllPAData(handlePA)
            // store.state.sceneModule.sceneEnityData.forEach((item) => {
            //   window.EarthViewer.entities.removeById(item.Data.Name)
            //   for (let i = 0; i < EarthAPP.labelCollection.length; ++i) {
            //     const l = EarthAPP.labelCollection.get(i)
            //     if (l.text === item.Data.Name) {
            //       EarthAPP.labelCollection.remove(l)
            //     }
            //   }
            // })

            window.plot.removeAll()
            if (window.zyts) {
              window.zyts = false //设置取消勾选战役态势状态
            }
            break
          case 'operationalArea': //战区清除 作战区域 清除
            // this.entityManage.removeZZQY()
            window.EarthViewer.dataSources._dataSources.forEach(
              (dataSource) => {
                if (dataSource._name == '作战区域') {
                  dataSource.show = false
                  //隐藏作战区域内的label文字
                  var entities = dataSource.entities.values
                  for (let i = 0; i < entities.length; i++) {
                    let entity = entities[i]
                    for (let i = 0; i < EarthAPP.labelCollection.length; ++i) {
                      const l = EarthAPP.labelCollection.get(i)
                      if (entity.properties && entity.properties.label) {
                        if (l.text === entity.properties.label._value) {
                          l.show = false
                        }
                      }
                    }
                  }
                }
              }
            )
            break
          case 'atmosphereArea': //气象区域清除
            store.state.sceneModule.quyuWeatherVisible = false
            store.commit('setVectorWeatherConfig', false)
            break
          case 'civilAviationRoutes': //民航航线
            this.primitiveManage.removePrimitive(this.minhangList)
            this.pointLabelList.forEach((item) => {
              this.entityManage.deleteEntities(item.text)
            })
            this.minhangList = []
            this.pointLabelList = []
            break
          case 'topographicMap': //地形图
            break
          case 'spaceBox': //空间盒
            val.data.forEach((item) => {
              this.entityManage.deleteEntities(item.code)
            })
            break
          case 'firstGrid': //第一层网格
            for (let lon = -180; lon <= 180; lon += 6) {
              this.entityManage.deleteEntities('lon间隔' + 6 + '-' + lon)
            }
            for (let lat = -80; lat <= 80; lat += 4) {
              this.entityManage.deleteEntities('lat间隔' + 4 + '-' + lat)
            }
            for (let lat = -80; lat < 80; lat += 4) {
              for (let lon = -180; lon <= 180; lon += 6) {
                let latText
                if (lat > 0) {
                  latText = String.fromCharCode(64 + lat / 4 + 1)
                } else if (lat < 0) {
                  latText = String.fromCharCode(64 + Math.abs(lat) / 4)
                } else {
                  latText = String.fromCharCode(64 + Math.abs(lat) / 4 + 1)
                }
                let text =
                  (lat < 0 ? 'S' : 'N') +
                  ((180 - lon) / 6 < 10
                    ? '0' + (180 - lon) / 6
                    : (180 - lon) / 6) +
                  latText
                this.entityManage.deleteEntities(text)
              }
            }
            break
          case 'secondGrid': //第二层网格
            for (let lon = 114; lon <= 125; lon += 30 / 60) {
              this.entityManage.deleteEntities('lon间隔' + 30 / 60 + '-' + lon)
            }
            for (let lat = 36; lat <= 40; lat += 30 / 60) {
              this.entityManage.deleteEntities('lat间隔' + 30 / 60 + '-' + lat)
            }
            this.entityManage.deleteEntities('PN11J20')
            this.entityManage.deleteEntities('YN11J20')
            this.entityManage.deleteEntities('XN11J20')
            this.entityManage.deleteEntities('道')
            break
          case 'beiDouSatellit': //北斗卫星
            this.dataController.removeBeiDou()
            break
          case 'eMEnvironmentInfo': //电磁环境信息
            if (window.EarthViewer.entities.getById('eMEnvironmentInfoImg')) {
              window.EarthViewer.entities.removeById('eMEnvironmentInfoImg')
            }
            break
          case 'airKyLayer': //空域
            this.dataController.addGeojsonByKyAreaFile(
              {
                url: './static/data/geojson/空域.json',
                id: '空域',
                backLoad: false
              },
              false
            )
            break
          case 'radarDetection1': //雷达探测1
            this.dataController.removeLeidaganrao()
            break
          case 'radarDetection2': //雷达探测2
            this.dataController.removeLeidaganrao()
            break
          case 'radarDetection3': //雷达探测3
            this.dataController.removeLeidaganrao()
            break
          case 'radarEllipse': //雷达矢量
            this.dataController.removeRadarEllipse()
            break
          case 'satelliteTurnOn': //雷达矢量
            this.dataController.satelliteTurnOff()
            break
          case 'radarVector': //雷达矢量
            this.dataController.clearLayerGeo('leidashiliang')
            break
          case 'fineModel': //精细模型
            store.commit('setdetailedModel', false)
            // 开启模型切换判定条件，切换成功后立即关闭
            store.state.sceneModule.isChangeModel = true
            // 需要切换静态目标显示模式为JB模式并调用PA接口重置静态目标
            store.state.sceneModule.showJB = true
            let curSide = window.localStorage.getItem('side')
            console.log('curSide', curSide)
            setTimeout(() => {
              getPAStatic({ side: curSide }).then((res) => { })
            }, 1500)
            break
          case 'modelOutline': //模型描边
            if (store.state.sceneModule.modelConfig.detailedModel == true)
              store.commit('setmodelOutline', false)
            break
          case 'radarDetect': //雷达探测
            connectLineManage.showEntityByKeyword('RE_SDC', false)
            store.commit('setSDC', false)
            break
          case 'sensorTracking': //传感器追踪
            connectLineManage.showEntityByKeyword('RE_STrackInit', false)
            store.commit('setSensorTracking', false)
            break
          case 'localTracking': //区域追踪
            connectLineManage.showEntityByKeyword('RE_LTrackInit', false)
            store.commit('setLocalTracking', false)
            break
          case 'fireHitting': //火力打击
            connectLineManage.showEntityByKeyword('RE_WeaponF', false)
            connectLineManage.showEntityByKeyword('distancelabel', false)
            store.commit('setFireHitting', false)
            break
          case 'targetKill': //目标击毁
            connectLineManage.showEntityByKeyword('RE_WeaponWH', false)
            store.commit('setTargetKill', false)
            break
          case 'electInterference': //电磁干扰
            connectLineManage.showEntityByKeyword('RE_JamA', false)
            store.commit('setElectInterference', false)
            break
          case 'networkCommunication': //网络通信
            connectLineManage.showEntityByKeyword('RE_MR', false)
            store.commit('setNetworkCommunication', false)
            break
          case 'taskAssociation': //任务关联
            connectLineManage.showEntityByKeyword('Task_Aign', false)
            store.commit('setTaskAssociation', false)
            break
          case 'redpositionTag': //红方位置
            this.delLableNameArr('red', val.name)
            store.commit('setredPositionTag', false)
            break
          case 'redpostureTag': //红方姿态
            this.delLableNameArr('red', val.name)
            store.commit('setredPostureTag', false)
            break
          case 'redspeedTag': //红方速度
            this.delLableNameArr('red', val.name)
            store.commit('setredSpeedTag', false)
            break
          case 'redtypeTag': //红方类型
            this.delLableNameArr('red', val.name)
            store.commit('setredTypeTag', false)
            break
          case 'bluepositionTag': //蓝方位置
            this.delLableNameArr('blue', val.name)
            store.commit('setbluePositionTag', false)
            break
          case 'bluepostureTag': //蓝方姿态
            this.delLableNameArr('blue', val.name)
            store.commit('setbluePostureTag', false)
            break
          case 'bluespeedTag': //蓝方速度
            this.delLableNameArr('blue', val.name)
            store.commit('setblueSpeedTag', false)
            break
          case 'bluetypeTag': //蓝方类型
            this.delLableNameArr('blue', val.name)
            store.commit('setblueTypeTag', false)
            break
          case 'radarRender':
            store.state.AFSIMModule.rw_radarShow = false
            window.EarthViewer.entities.forEach((entity) => {
              if (entity.id.indexOf('ew_radar_sensor_ellipse') > -1) {
                entity.show = store.state.AFSIMModule.rw_radarShow
              }
            })
            // if (store.state.curSceneName.indexOf('拦截') > -1) {
            //   window.EarthViewer.entities.values.forEach((item) => {
            //     if (
            //       item.id.indexOf('sensor_command_radar') > -1 &&
            //       item.label?.text?._value &&
            //       item.label?.text?._value.indexOf('地面雷达') > -1
            //     ) {
            //       let radarId = item.id
            //       if (window.EarthViewer.scene.mode !== 2) {
            //         let t
            //         window.EarthViewer.scene.primitives._primitives.forEach(
            //           (p) => {
            //             if (p.id && p.id === 'primitive_virtual_' + radarId) {
            //               t = p
            //               window.EarthViewer.scene.primitives.remove(t) //删除雷达探测效果
            //             }
            //           }
            //         )
            //       } else {
            //         window.sceneAction.planeCzmlManage.removePlaneElectronicInterfer(
            //           radarId
            //         )
            //       }
            //     }
            //   })
            // } else {
            //   let radarStateList = store.getters.getRadarRenderConfig // 雷达状态集合
            //   radarStateList.forEach((e) => {
            //     e.radarState = false
            //     if (window.EarthViewer.scene.mode !== 2) {
            //       // 清除当前雷达遮罩
            //       let t
            //       window.EarthViewer.scene.primitives._primitives.forEach(
            //         (p) => {
            //           if (p.id && p.id === e.radarName + 'radar') {
            //             t = p
            //             window.EarthViewer.scene.primitives.remove(t) //删除雷达遮罩
            //           }
            //         }
            //       )
            //     } else {
            //       window.sceneAction.planeCzmlManage.removePlaneElectronicInterfer(
            //         e.radarName
            //       )
            //     }

            //     //关闭雷达遮罩
            //     window.EarthViewer.scene.primitives._primitives.forEach((p) => {
            //       if (p.id && p.id == e.radarName + 'TRIANGLES') {
            //         window.EarthViewer.scene.primitives.remove(p)
            //       }
            //     })
            //     window.EarthViewer.scene.primitives._primitives.forEach((p) => {
            //       if (p.id && p.id == e.radarName + 'LINES') {
            //         window.EarthViewer.scene.primitives.remove(p)
            //       }
            //     })
            //   })
            //   store.commit('setradarRender', false)
            // }
            break
          case 'taiwanAirport': //台湾机场港口
            store.commit('changeCEarthComp', { name: '', props: {} })
            break
          case 'taiwanMissilePosition': //台湾导弹阵地
            break
          case 'heatMap': //侦察需求热力图
            addHeatMap(false)
            break
        }
      }
    }

    // 返回修改状态后的树
    return res
  }
  // 删除模型lable Text 数组
  delLableNameArr(side, name) {
    if (side === 'red') {
      let index = store.state.sceneModule.redPlaneConfig.indexOf(name)
      if (index > -1) {
        store.state.sceneModule.redPlaneConfig.splice(index, 1) // 删除该元素
      }
    } else {
      let index = store.state.sceneModule.bluePlaneConfig.indexOf(name)
      if (index > -1) {
        store.state.sceneModule.bluePlaneConfig.splice(index, 1) // 删除该元素
      }
    }
  }
  // 添加节点
  addNode(treeNodes, val, parentName) {
    let res = this.addTreeNode(treeNodes, val, parentName)
    // store.commit(
    //   'setLayerManagementData',
    //   JSON.parse(JSON.stringify(store.state.sceneModule.layerManagementData))
    // )
    return res
  }
  // 删除节点
  deleteNode(treeNodes, code) {
    let res = this.deleteTreeNode(treeNodes, code)
    return res
    // store.commit(
    //   'setLayerManagementData',
    //   JSON.parse(JSON.stringify(store.state.sceneModule.layerManagementData))
    // )
  }
  loadPlotData(res) {
    const SML = new Blob([res], { type: 'application/octet-stream' })
    SML.arrayBuffer().then((e) => {
      const _plotLayerControl =
        Plot.PlotDraw.GetInstance()._plotManager._plotLayerControl
      const _plotPlayControl =
        Plot.PlotDraw.GetInstance()._plotManager._plotPlayControl
      // _plotLayerControl.clearLayer();
      // _plotLayerControl.openSml(e)
      // _plotLayerControl.openByServe(res, true);
      //_plotLayerControl.openFile(e)
      plot.openFile(e)
      // const innerFileName = 'ss';
      // var data = new Uint8Array(e);
      // var stream = PlotModule.FS.open(innerFileName, 'w+');
      // PlotModule.FS.write(stream, data, 0, data.length, 0);
      // PlotModule.FS.close(stream);
      // plot.plotManager.system.open(innerFileName);
      // // _plotLayerControl.openByServe(e, true)

      setTimeout(() => {
        // _plotPlayControl.updateActionList()
        _plotPlayControl.play()
      }, 1000)
      // bus.emit('commomSymbol')
    })
  }
  loadSmlFile() {
    const callback = (res) => {
      this.loadPlotData(res)
    }
    // window.plot.loadSml('http://172.16.100.204:4041/sml/11111111-bh (37).sml', callback)
    window.plot.loadSml('bh (1).sml', callback)
  }
  /**
   * @description: 更新PA显示状态
   */
  PADataUpdate() {
    store.state.AFSIMModule.paData.forEach((json) => {
      let curPAShow = window.EarthPlugn.entity._getPAShow(
        store.state.AFSIMModule.paDataShow,
        json.Data.Side,
        json.Data.Vision
      )
      window.EarthViewer.entities.values.forEach((entity) => {
        if (entity.id === json.Data.Name + 'PA') {
          entity.show = curPAShow
        }
      })
    })
  }
}
export default panelManagement
