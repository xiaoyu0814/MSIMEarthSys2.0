/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-04-24 10:43:59
 * @LastEditors: root you@example.com
 * @LastEditTime: 2024-07-23 10:29:19
 * @FilePath: \MSIMEarthSysN\src\views\3D\hooks\initConfig\sceneInit.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import store from '@/store'
import LocalCache from '@/utils/earthPlugin/ThirdParty/storageManagement/localStorage.js'
import emitter from '@/utils/eventbus'
import {
  getModelMatchingData,
  getModelMatchingDataJB,
  getOperationInof
} from '@/service/SSE'
import { getPlatformCHNName } from '@/service/infomationStatistics/index.js'
import {
  getPlatformState
} from '@/service/afsim'
import * as turf from '@turf/turf'

// 根据登录角色初始化场景配置
export async function sceneInit() {
  let curSeat = window.localStorage.getItem('side') // 获取当前席位
  //只在admin席位下才显示'场景配置'图层下的'模型'的节点
  if (curSeat == 'admin') {
    configAdminSeatData(curSeat)
  } else {
    configOtherSeatData()
  }
  // 供模型匹配数据
  await getModelMatchingData().then((res) => {
    console.log('模型匹配数据', res)
    store.state.sceneModule.modelConfigValue = res
  })
  // 供模型匹配数据
  await getModelMatchingDataJB().then((res) => {
    console.log('JB模型匹配数据', res)
    store.state.sceneModule.modelConfigJBValue = res
  })

  // 平台名称中文映射
  await getPlatformCHNName().then((res) => {
    if (res.code === 200) {
      console.log('中文名称映射', res.data)
      // res.data['WZ-9'] = {
      //   "temp": "FALSE",
      //   "domain": "空",
      //   "name": "无侦9_1",
      //   "kinds": "无人查打机",
      //   "type": "WZ-9",
      //   "camp": "red",
      //   "group": "9"
      // }
      store.state.sceneModule.modelCHNNameValue = res.data
    } else {
      ElMessage.error(res.message)
    }
  })
  // 如果全局变量 EarthAPP.useGroupInfo为true
  setInterval(() => {
    getPlatformGroupInfo()
  }, 5000);

  // 清除首页加载动画
  emitter.emit('showLoading', false)
  // 显示实验列表面板
  store.commit('set_isSimulationList', true)
}

function configAdminSeatData(seat) {
  let layerData = store.getters.getLayerManagementData
  if (!layerData[3] || !layerData[3].childList) return
  let newModelLayerData = layerData[3].childList
  if (newModelLayerData && newModelLayerData.length === 0) return
  if (seat == 'admin') {
    //默认勾选精模建模切换图层节点
    if (newModelLayerData[0] && newModelLayerData[0].childList) {
      newModelLayerData[0].childList.map(function (item) {
        if (item) {
          item.checked = true
          store.state.sceneModule.modelConfig.detailedModel = true
          if (item.name == '模型描边') {
            item.checked = store.state.sceneModule.modelConfig.modelOutline
          }
        }
      })
    }
  } else {
    // newModelLayerData[0].childList.map(function (item) {
    //   item.checked = false
    //   store.state.sceneModule.modelConfig.detailedModel = false
    // })
  }

  //初始化链路配置
  if (newModelLayerData[1] && newModelLayerData[1].childList) {
    newModelLayerData[1].childList.map(function (item) {
      if (item) {
        item.checked = LocalCache.getCache(item.code)
      }
    })
  }
  //初始化红方标签配置
  // newModelLayerData[2].childList[0].childList.map(function (item) {
  //   item.checked = LocalCache.getCache(item.code)
  //   if (item.checked) store.state.sceneModule.redPlaneConfig.push(item.name)
  // })
  //初始化蓝方标签配置
  // newModelLayerData[2].childList[1].childList.map(function (item) {
  //   item.checked = LocalCache.getCache(item.code)
  //   if (item.checked) store.state.sceneModule.bluePlaneConfig.push(item.name)
  // })

  //初始化雷达干扰配置
  let radarStateList = store.getters.getRadarRenderConfig // 雷达状态集合
  radarStateList.forEach((e) => {
    store.state.sceneModule.radarRender =
      store.state.sceneModule.radarRender && e.radarState
  })
  if (newModelLayerData[3]) {
    newModelLayerData[2].checked = store.state.sceneModule.radarRender
  }
  layerData[3].childList = newModelLayerData
  store.commit('setLayerManagementData', layerData)
}

function configOtherSeatData() {
  let layerData = store.getters.getLayerManagementData
  if (!layerData[3] || layerData[3].childList) return
  let newModelLayerData = layerData[3].childList
  if (newModelLayerData && newModelLayerData.length === 0) return

  //初始化链路配置
  if (newModelLayerData[0] && newModelLayerData[0].childList) {
    newModelLayerData[0].childList.map(function (item) {
      if (item) {
        item.checked = LocalCache.getCache(item.code)
      }
    })
  }
  //初始化红方标签配置
  // newModelLayerData[1].childList[0].childList.map(function (item) {
  //   item.checked = LocalCache.getCache(item.code)
  //   if (item.checked) store.state.sceneModule.redPlaneConfig.push(item.name)
  // })
  // //初始化蓝方标签配置
  // newModelLayerData[1].childList[1].childList.map(function (item) {
  //   item.checked = LocalCache.getCache(item.code)
  //   if (item.checked) store.state.sceneModule.bluePlaneConfig.push(item.name)
  // })

  //初始化雷达干扰配置
  let radarStateList = store.getters.getRadarRenderConfig // 雷达状态集合
  radarStateList.forEach((e) => {
    store.state.sceneModule.radarRender =
      store.state.sceneModule.radarRender && e.radarState
  })
  newModelLayerData[1].checked = store.state.sceneModule.radarRender
  layerData[3].childList = newModelLayerData
  store.commit('setLayerManagementData', layerData)
}

// 作战描述 由于后端没有扩展，暂时前端激活
function explanation() {
  setTimeout(() => {
    getOperationInof().then((res) => {
      let { info, jd } = infoConfig(res, 'suicide attack')
      identifyConfig(info, jd)
    })
    setTimeout(() => {
      getOperationInof().then((res) => {
        let { info, jd } = infoConfig(res, 'close-in attrition, suicide attack')
        identifyConfig(info, jd)
      })
    }, 15000)
  }, 5000)
}
// 作战描述信息匹配
function infoConfig(res, text) {
  let info = res['operation'][text]
  let jd = 0
  if (typeof info === 'undefined') {
    info = res['method'][text]
    jd = 1
    if (typeof info === 'undefined') {
      info = res['phase'][text]
      jd = 2
    }
  }
  return {
    info: info,
    jd: jd
  }
}
// identify配置
function identifyConfig(info, jd) {
  switch (jd) {
    case 0:
      store.state.sceneModule.identifyColor = {
        color1: 'rgba(19, 240, 240, 0.26)',
        color2: 'rgba(0, 255, 195, 0)',
        textShadow1: '#00ffc3',
        textShadow2: '#00ffc3',
        jd: 0
      }
      break
    case 1:
      store.state.sceneModule.identifyColor = {
        color1: 'rgba(255, 2, 2, 0.06)',
        color2: 'rgba(255, 2, 2, 0.06)',
        textShadow1: '#f63b4c',
        textShadow2: '#f63b4c',
        jd: 1
      }
      break
    case 2:
      store.state.sceneModule.identifyColor = {
        color1: 'rgba(240, 236, 19, 0.26)',
        color2: 'rgba(240, 236, 19, 0.26)',
        textShadow1: '#ecf013',
        textShadow2: '#ecf013',
        jd: 2
      }
      break
    default:
      break
  }
  store.state.sceneModule.identifyInfo = info
  store.state.sceneModule.phasedDescription.push({
    time: '',
    key: 'suicide attack',
    value: info
  })
  store.state.sceneModule.showIdentify = true
}

//格式转换
function pointsToDegreesArray(points) {
  let degreesArray = []
  points.map((item) => {
    degreesArray.push(item[0])
    degreesArray.push(item[1])
  })
  return degreesArray
}

//格式转换
function pointsToDegreesArrayHeight(points, height) {
  let degreesArray = []
  points.map((item) => {
    degreesArray.push(item[0])
    degreesArray.push(item[1])
    degreesArray.push(height)
  })
  return degreesArray
}

//添加线
function addPolyline(positions) {
  window.EarthViewer.entities.add({
    polyline: {
      positions: positions,
      width: 2,
      // material: new window.MSIMEarth.WallMaterialProperty(
      //   window.MSIMEarth.Color.GREEN,
      //   1000
      // ),
      material: window.MSIMEarth.Color.GREEN,
      clampToGround: true
    }
  })
}
// position: new Cesium.CallbackProperty(changePositionC, fals(e)

// 添加缓冲面
function addBufferPolyogn(positions) {
  var dynamicPositions = new window.MSIMEarth.CallbackProperty(function () {
    let curEntity1 = window.EarthPlugn.entity._GetCZMLEntity(
      'wz-7_1',
      'MSIMEarthCZMLProcessContainer'
    )
    let curEntity2 = window.EarthPlugn.entity._GetCZMLEntity(
      'wz-7_2',
      'MSIMEarthCZMLProcessContainer'
    )
    let curEntity3 = window.EarthPlugn.entity._GetCZMLEntity(
      'wz-7_3',
      'MSIMEarthCZMLProcessContainer'
    )
    let curEntity4 = window.EarthPlugn.entity._GetCZMLEntity(
      'wz-7_4',
      'MSIMEarthCZMLProcessContainer'
    )
    let currentTime = window.EarthViewer.clock.currentTime
    if (
      typeof curEntity1 === 'undefined' ||
      typeof curEntity2 === 'undefined' ||
      typeof curEntity3 === 'undefined' ||
      typeof curEntity4 === 'undefined'
    )
      return
    let p1 = curEntity1.position.getValue(currentTime)
    let p2 = curEntity2.position.getValue(currentTime)
    let p3 = curEntity3.position.getValue(currentTime)
    let p4 = curEntity4.position.getValue(currentTime)
    let graphicP1 = coordinateConvert(p1)
    let graphicP2 = coordinateConvert(p2)
    let graphicP3 = coordinateConvert(p3)
    let graphicP4 = coordinateConvert(p4)

    // degreesArray = pointsToDegreesArray(points)
    if (
      typeof graphicP1 === 'undefined' ||
      typeof graphicP2 === 'undefined' ||
      typeof graphicP3 === 'undefined' ||
      typeof graphicP4 === 'undefined'
    )
      return
    let turfPoints = [
      [graphicP1.lng, graphicP1.lat],
      [graphicP2.lng, graphicP2.lat],
      [graphicP3.lng, graphicP3.lat],
      [graphicP4.lng, graphicP4.lat]
    ]
    let polylineF = turf.lineString(turfPoints)
    let cameraHeight =
      window.EarthViewer.camera.positionCartographic.height / 100000
    if (cameraHeight < 1) {
      cameraHeight = 1
    }
    let buffered = turf.buffer(polylineF, 1 * cameraHeight, {
      units: 'kilometers'
    })
    let coordinates = buffered.geometry.coordinates
    let height =
      (graphicP1.alt + graphicP2.alt + graphicP3.alt + graphicP4.alt) / 4
    let bufferPoints = pointsToDegreesArrayHeight(coordinates[0], height)
    let res = window.MSIMEarth.Cartesian3.fromDegreesArrayHeights(bufferPoints)
    return new window.MSIMEarth.PolygonHierarchy(res)
  }, false)
  window.EarthViewer.entities.add({
    polygon: {
      hierarchy: dynamicPositions,
      // hierarchy: new window.MSIMEarth.PolygonHierarchy(positions),
      // hierarchy: window.MSIMEarth.CallbackProperty(function (positions) {
      //   return new window.MSIMEarth.PolygonHierarchy(positions)
      // }, false),
      material: new window.MSIMEarth.GradientMaterialProperty({
        repeat: new window.MSIMEarth.Cartesian2(1.0, 1.0),
        color: new window.MSIMEarth.Color(1.0, 0.0, 0.0, 1.0),
        flowSpeed: 25.0,
        diffusePower: 1.2,
        alphaPower: 0.8,
        center: new window.MSIMEarth.Cartesian2(0.5, 0.5),
        globalAlpha: 0x1,
        transparent: true
      }),
      perPositionHeight: true,
      outline: true,
      outlineColor: window.MSIMEarth.Color.RED,
      outlineWidth: 4
      // classificationType: window.MSIMEarth.ClassificationType.BOTH
    }
  })
}

//car3tolnglat
function coordinateConvert(positionC3) {
  if (typeof positionC3 === 'undefined') return
  let cartographic = window.MSIMEarth.Cartographic.fromCartesian(positionC3)
  var lng = window.MSIMEarth.Math.toDegrees(cartographic.longitude)
  var lat = window.MSIMEarth.Math.toDegrees(cartographic.latitude)
  var alt = cartographic.height
  return { lng: lng, lat: lat, alt: alt }
}

// 获取平台状态
function getPlatformGroupInfo() {
  // 当前复盘无法调用接口，暂时在复盘状态下禁用该功能
  if (store.state.AFSIMModule.fp) return
  if (typeof MSIMEarthCZMLProcessContainer !== 'undefined') {
    MSIMEarthCZMLProcessContainer.entities.values.forEach((e) => {
      let params = {
        platform: e.id
      }
      getPlatformState(params).then((res) => {
        if (res.status == 'success' && res.data.Members && res.data.InitialMembers && e.label.text._value) {
          // 如果e.label.text._value包含'编组'，则不添加编组信息
          if (e.label.text._value.includes('编组') > -1) {
            let textArr = e.label.text._value.split('编组')
            e.label.text._value = textArr[0] + '编组' + '(' + res.data.Members + '/' + res.data.InitialMembers + ')'
          } else {
            e.label.text._value = e.label.text._value + '编组' + '(' + res.data.Members + '/' + res.data.InitialMembers + ')'
          }
        }
      })
    })
  }
}
