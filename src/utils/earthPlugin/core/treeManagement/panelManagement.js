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
import TWHY from '@/utils/earthPlugin/ThirdParty/others/tw/twhy.js' //TW.js 封装好后替换引用
import primitive from '../../scene/primitive/primitive.js'
import PolygonGeojson from '../../scene/geojson/polygonGeojson.js'
import {
  getGetOpticalEnvelope,
  getInfraredSignatureEnvelope,
  GetRadarEnvelope,
  getPlatformSensorEnvelopeModel
} from '@/service/afsim'
import { showWindArea } from './methods/wind2.js'
import { createCloud, removeCloud } from './methods/cloud.js'
import { createHumidity, removeHumidity } from './methods/humidity.js'
import { addPrimitiveDQFn } from './addPrimitiveDQFn.js'

let cloudParams = {
  cloud_interval: null,
  oldcloudId: null,
}

let humidityParams = {
  humidity_interval: null,
  oldhumidityId: null,
}
// 图例位置管理 - 自动计算右上角可用位置
const LEGEND_CONFIG = {
  baseTop: 80,
  baseRight: 120,
  gap: 15,
  legendIds: [
    'wind-legend',
    'humidity-legend',
    'ice-legend',
    'turbulence-legend'
  ]
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
    if (type == 'add') {
      console.log('val.code', val.code);
      switch (val.code) {
        case 'globalImage': //全球高清影像
          this.dataController.addbingLayer()
          break
        case 'globalTerrain': //全球地形
          this.dataController.addTWTerrian()
          break
        case 'vectorLayer': //矢量底图
          this.dataController.addVectorLayer()
          break
        case 'annotationVectorLayer': //矢量底图(带标注)
          this.dataController.addAnnotationVectorLayer()
          break
        case 'darkVectorLayer': //暗色矢量底图
          this.dataController.addDarkVectorLayer()
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
        case 'nationalBoundaryLine': //国家边界线
          this.dataController.guojiexian_C()
          this.dataController.guojiexian_O()
          this.dataController.addNineLine()
          break
        case 'taiwanShippingLine': //台湾海运线
          twhy.viewTaiHYX()
          break
        case 'taiwanStraitNoNavigationZone': //台湾禁航区
          twhy.viewTaiHYJZ()
          break
        case 'identificationZone': //防空识别区
          this.dataController.addTWFKSBQ()
          this.dataController._addDHFKSBQ()
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
        case 'importanceTarget': //重要目标
          this.dataController.addImportanceTarget()
          break
        case 'opticalDetectionZone': //光学探测区域
          store.state.AFSIMModule.opticalDqST = true
          let opticalDqST = setInterval(() => {
            if (store.state.AFSIMModule.opticalDqST === false) {
              clearInterval(opticalDqST)
              return
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
                }, 500)
              })
          }, 1000)
          break
        case 'infraredDetectionZone': //红外探测区域
          store.state.AFSIMModule.infraredDqST = true
          let infraredDqST = setInterval(() => {
            if (store.state.AFSIMModule.infraredDqST === false) {
              clearInterval(infraredDqST)
              return
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
                }, 500)
              })
          }, 1000)
          break
        case 'radarCoverage': //雷达探测区域
          store.state.AFSIMModule.radarDqST = true
          let radarDqST = setInterval(() => {
            if (store.state.AFSIMModule.radarDqST === false) {
              clearInterval(radarDqST)
              return
            }
            GetRadarEnvelope()
              .then((res) => {
                addPrimitiveDQFn(res,'radarCoverage','triangles',this.viewer)
                addPrimitiveDQFn(res,'radarCoverageLine', 'lines',this.viewer)
                if (res.error) {
                  console.log('请求返回错误:', res.error)
                }
              })
              .catch((err) => {
                console.log('err', err)
                setTimeout(() => {
                  cusP.removeDQPrimitive('radarCoverage')
                  cusP.removeDQPrimitive('radarCoverageLine')
                }, 500)
              })
          }, 1000)
          break
        // case 'RadarSite': //静态装备雷达
        //   store.state.AFSIMModule.radarDqST = true
        //   let radarDqST = setInterval(() => {
        //     if (store.state.AFSIMModule.radarDqST === false) {
        //       clearInterval(radarDqST)
        //       return
        //     }
        //     const params = {
        //       platform: 'HAWK_Radar'
        //     }
        //     console.log('HAWK_Radar', params);
        //     getPlatformSensorEnvelopeModel(params)
        //       .then((res) => {
        //         console.log('getPlatformSensorEnvelopeModel', res);
        //         addPrimitiveDQFn(res.data[0],'radarCoverage','triangles',this.viewer)
        //         addPrimitiveDQFn(res.data[0],'radarCoverageLine', 'lines',this.viewer)
        //         if (res.error) {
        //           console.log('请求返回错误:', res.error)
        //         }
        //       })
        //       .catch((err) => {
        //         console.log('err', err)
        //         setTimeout(() => {
        //           cusP.removeDQPrimitive('radarCoverage')
        //           cusP.removeDQPrimitive('radarCoverageLine')
        //         }, 500)
        //       })
        //   }, 5000)
        //   break
        case 'wind': //风场
          let isShowWind = false
          window.EarthViewer.scene.primitives._primitives.forEach((item) => {
            if (item.id === 'windData') {
              item.show = true
              isShowWind = true
              let legend = document.getElementById('wind-legend')
              if (legend && legend.style.display == 'none') {
                legend.style.display = 'block'
              }
            }
          })
          if (!isShowWind) {
            showWindArea({
              minLon: 120.03,
              maxLon: 120.4,
              minLat: 23.9,
              maxLat: 24.25,
              windThickness: 16000,
              name: '风场数据',
              path: val.dataUrls[0],
              id: 'windData',
              minHeight: 2000,
              maxHeight: 8000,
              maxWindSpeed: 5,
              alphaFactor: 1.5
            })
          }
          break
        case 'humiditytj': //湿度可调节
          let humidityOptions = {}
          humidityParams.humidity_interval = setInterval(() => {
            let simSec = store.state.AFSIMModule.ATValue
            let picIndex =Math.round((simSec -10)/10)
            if (picIndex < 0) picIndex = 0 
            if (picIndex >= val.dataUrls.length) picIndex = val.dataUrls.length-1
            humidityOptions.name = 'humidity_' + picIndex
            humidityOptions.path = val.dataUrls[picIndex]
            humidityOptions.id = 'humidity_' + picIndex
            if (humidityParams.oldhumidityId) {
              if (humidityOptions.id == humidityParams.oldhumidityId) return
              removeHumidity(humidityParams.oldhumidityId)
            }
            
            createHumidity(humidityOptions)
            humidityParams.oldhumidityId = humidityOptions.id 
          }, 1000)
          break
        case 'cloud': //云量数据
        let cloudOptions = {}
        cloudParams.cloud_interval = setInterval(() => {
          let simSec = store.state.AFSIMModule.ATValue
          let picIndex =Math.round((simSec -10)/10)
          if (picIndex < 0) picIndex = 0 
          if (picIndex >= val.dataUrls.length) picIndex = val.dataUrls.length-1 
          cloudOptions.name = 'cloud_' + picIndex
          cloudOptions.path = val.dataUrls[picIndex]
          cloudOptions.id = 'cloud_'+ picIndex

          if (cloudParams.oldcloudId){
            if (cloudOptions.id == cloudParams.oldcloudId) 
               return
            removeCloud(cloudParams.oldcloudId)  
          }
          createCloud(cloudOptions)
          cloudParams.oldcloudId = cloudOptions.id 
        }, 1000)
          break
        case 'icing_area': //积冰区
          this.dataController.addIcingAreaLayer(val)
          break
        case 'bumpy_area': //颠簸区
          this.dataController.addBumpyAreaLayer(val)
          break
        case 'stw_area': //大风区
          this.dataController.addStwAreaLayer(val)
          break
        case 'rhu_area': //湿度区
          this.dataController.addRhuAreaLayer(val)
          break
        case 'pre_area': //雷电强降水区
          this.dataController.addPreAreaLayer(val)
          break
        case 'vis_area': //低能见度区
          this.dataController.addVisAreaLayer(val)
          break
        case 'hcc_ir_area': //高云量红外衰减区
          this.dataController.addHccIrAreaLayer(val)
          break
        case 'llms_area': //低空风切变高发区
          this.dataController.addLlmsAreaLayer(val)
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
      }
    } else {
      switch (val.code) {
        case 'globalImage': //全球高清影像
          this.dataController.removeLayer('globalImage')
          break
        case 'globalTerrain': //全球地形
          this.dataController.removeTerrianLayer()
          break
        case 'vectorLayer': //矢量底图
          this.dataController.removeLayer('vectorLayer')
          break
        case 'annotationVectorLayer': //矢量底图（带标注）
          this.dataController.removeLayer('annotationVectorLayer')
          break
        case 'darkVectorLayer': //暗色矢量底图
          this.dataController.removeLayer('darkVectorLayer')
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
        case 'nationalBoundaryLine': //国家边界线
          this.dataController.clearLayerGeo('guojiexian')
          this.dataController.clearLayerGeo('guojiexian2')
          this.dataController.clearLayerGeo('shengjiexian')
          this.dataController.clearLayerGeo('nineLine')
          break
        case 'taiwanShippingLine': //台湾海运线
          twhy.removeTaiHYX()
          break
        case 'taiwanStraitNoNavigationZone': //台湾禁航区
          twhy.removeTaiHYJZ()
          break
        case 'identificationZone': //防空识别区
          this.dataController.clearLayerGeo('防空2')
          this.dataController.deletFKSBQ()
          break
        case 'mainCity': //地名
          this.dataController.clearLayerGeo('city1')
          this.dataController.clearLayerGeo('city2')
          this.dataController.clearLayerGeo('蓝方城市')
          this.dataController.clearLayerGeo('绿方基地')
          this.dataController.clearLayerGeo('紫方城市')
          this.dataController.clearLayerGeo('紫方基地')
          break
        case 'importanceTarget': //重要目标
          this.dataController.clearImPort()
          break
        case 'opticalDetectionZone': //光学探测区域
          store.state.AFSIMModule.opticalDqST = false
          setTimeout(() => {
            cusP.removeDQPrimitive('opticalDetectionZone')
            cusP.removeDQPrimitive('opticalDetectionZoneLine')
          }, 500)
          break
        case 'infraredDetectionZone': //红外探测区域
          store.state.AFSIMModule.infraredDqST = false
          setTimeout(() => {
            cusP.removeDQPrimitive('infraredDetectionZone')
            cusP.removeDQPrimitive('infraredDetectionZoneLine')
          }, 500)
          break
        // case 'radarCoverage': //雷达覆盖区域
        //   store.state.AFSIMModule.radarDqST = false
        //   setTimeout(() => {
        //     cusP.removeDQPrimitive('radarCoverage')
        //     cusP.removeDQPrimitive('radarCoverageLine')
        //   }, 500)
        //   break
        case 'RadarSite': //静态装备雷达
          store.state.AFSIMModule.radarDqST = false
          setTimeout(() => {
            cusP.removeDQPrimitive('radarCoverage')
            cusP.removeDQPrimitive('radarCoverageLine')
          }, 500)
          break
        case 'wind': //风场
          window.EarthViewer.scene.primitives._primitives.forEach((item) => {
            if (item.id === 'windData') {
              item.show = false
              let legend = document.getElementById('wind-legend')
              if (legend && legend.style.display == 'block') {
                legend.style.display = 'none'
              }
            }
          })
          break
        case 'humiditytj': //湿度可调节
          if (humidityParams.oldhumidityId) removeHumidity(humidityParams.oldhumidityId)
          if (humidityParams.humidity_interval) {
            clearInterval(humidityParams.humidity_interval)
            humidityParams.humidity_interval = null
            humidityParams.oldhumidityId = null
          }
          break
        case 'cloud': //云量数据
          if(cloudParams.oldcloudId) removeCloud(cloudParams.oldcloudId)
          if (cloudParams.cloud_interval) {
            clearInterval(cloudParams.cloud_interval)
            cloudParams.cloud_interval = null
            cloudParams.oldcloudId = null
          }
          break
        case 'icing_area': //积冰区清除
          this.dataController.removeIcingAreaLayer(val)
          break
        case 'bumpy_area': //颠簸区清除
          this.dataController.removeBumpyAreaLayer(val)
          break
        case 'stw_area': //大风区清除
          this.dataController.removeStwAreaLayer(val)
          break
        case 'rhu_area': //湿度区清除
          this.dataController.removeRhuAreaLayer(val)
          break
        case 'pre_area': //雷电强降水区清除
          this.dataController.removePreAreaLayer(val)
          break
        case 'vis_area': //低能见度区清除
          this.dataController.removeVisAreaLayer(val)
          break
        case 'hcc_ir_area': //高云量红外衰减区清除
          this.dataController.removeHccIrAreaLayer(val)
          break
        case 'llms_area': //低空风切变高发区清除
          this.dataController.removeLlmsAreaLayer(val)
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
      }
    }

    // 返回修改状态后的树
    return res
  }
}
export default panelManagement