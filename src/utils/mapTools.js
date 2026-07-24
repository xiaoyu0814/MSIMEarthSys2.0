// import $ from 'jquery'
import store from '@/store'
import { JBConfig } from '@/utils/earthPlugin/ThirdParty/eventSource/event/earthEvent/czml/czmlRenderConfig/jbconfig.js'
import { modelConfig } from '@/utils/earthPlugin/ThirdParty/eventSource/event/earthEvent/czml/czmlRenderConfig/modelConfig/modelMatching'
import {
  removeAllFrustumFun,
  resetView
} from '@/utils/earthPlugin/ThirdParty/cameraControl/cameraControl'
import Bubble1 from '@/utils/bubble/dataBubble2'
import BubbleAirPlane from '@/utils/bubble/dataBubble'
import { SSEClose } from '@/service/SSE'
import axios from 'axios'
let clickEntity = {
  taperEntity: null,
  wallEntity: null
}
let clickBillboard = ''

// 地图特效
function mapEffect() {
  let viewer = window.EarthViewer
  let Cesium = window.MSIMEarth
  // 移除cesiumLogo
  viewer._cesiumWidget._creditContainer.style.display = 'none'
  // 关闭双击实体
  viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
    window.MSIMEarth.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
  )

  viewer.scene.screenSpaceCameraController.maximumZoomDistance = 45000000 // 相机高度的最大值
  viewer.scene.undergroundMode = true
  viewer.scene.sun.show = true
  viewer.scene.skyAtmosphere.show = true
  viewer.scene.skyAtmosphere.atmosphereRayleighScaleHeight = 20000
  viewer.scene.skyAtmosphere.atmosphereLightIntensity = 80
  viewer.scene.fog.enabled = true
  viewer.scene.globe.enableLighting = false

  let baseLayer = window.EarthViewer.scene.imageryLayers.get(0)
  baseLayer.brightness = 1.0
  baseLayer.contrast = 1
  baseLayer.hue = 0
  baseLayer.saturation = 1.6
  baseLayer.gamma = 1

  //去锯齿 是文字清晰
  viewer.scene.postProcessStages.fxaa.enabled = true
  if (window.MSIMEarth.FeatureDetection.supportsImageRenderingPixelated()) {
    //判断是否支持图像渲染像素化处理
    viewer.resolutionScale = window.devicePixelRatio
  }

  // 亮度设置
  var stages = viewer.scene.postProcessStages
  viewer.scene.brightness =
    viewer.scene.brightness ||
    stages.add(window.MSIMEarth.PostProcessStageLibrary.createBrightnessStage())
  viewer.scene.brightness.enabled = true
  viewer.scene.brightness.uniforms.brightness = Number(1)
  // updatePostProcess(viewer);

  function updatePostProcess(viewer) {
    var viewModel = {
      show: true,
      glowOnly: false,
      contrast: 128,
      brightness: -0.3,
      delta: 1.5,
      sigma: 3.78,
      stepSize: 2.0
    }
    var bloom = viewer.scene.postProcessStages.bloom
    bloom.enabled = Boolean(viewModel.show)
    bloom.uniforms.glowOnly = Boolean(viewModel.glowOnly)
    bloom.uniforms.contrast = Number(viewModel.contrast)
    bloom.uniforms.brightness = Number(viewModel.brightness)
    bloom.uniforms.delta = Number(viewModel.delta)
    bloom.uniforms.sigma = Number(viewModel.sigma)
    bloom.uniforms.stepSize = Number(viewModel.stepSize)
  }
}

//地球自转
function Callback(e) {
  if (!e) {
    window.EarthViewer.clock.shouldAnimate = false
    window.EarthViewer.clock.onTick.removeEventListener(onTickCallback)
    return
  }
  window.EarthViewer.clock.multiplier = store.state.sceneModule.sceneTestTime //速度
  window.EarthViewer.clock.shouldAnimate = true
  window.previousTime = window.EarthViewer.clock.currentTime.secondsOfDay

  window.EarthViewer.clock.onTick.addEventListener(onTickCallback)
}
const onTickCallback = () => {
  var spinRate = 1
  var currentTime = window.EarthViewer.clock.currentTime.secondsOfDay
  var delta = (currentTime - window.previousTime) / 1000
  window.previousTime = currentTime
  window.EarthViewer.scene.camera.rotate(
    window.MSIMEarth.Cartesian3.UNIT_Z,
    -spinRate * delta
  )
}
// 地球光照  不应该放这里，应该从scene或randerer文件内引入
function illumination(e) {
  if (e) {
    window.EarthViewer.scene.globe.enableLighting = true
    window.EarthViewer.shadows = true
    window.EarthViewer.terrainShadows = window.MSIMEarth.ShadowMode.RECEIVE_ONLY
    window.EarthViewer.shadowMap.darkness = 0.02 // 阴影透明度--越大越透明
  } else {
    window.EarthViewer.scene.globe.enableLighting = false
    window.EarthViewer.shadows = false
    window.EarthViewer.terrainShadows = window.MSIMEarth.ShadowMode.DISABLED
  }
}
// 单个世界坐标转经纬度坐标
function worldPosToGraphic(position) {
  let viewer = window.EarthViewer
  let Cesium = window.SmartEarth
  let ellipsoid = viewer.scene.globe.ellipsoid
  let cartographic = ellipsoid.cartesianToCartographic(position)
  let lat = window.MSIMEarth.Math.toDegrees(cartographic.latitude)
  let lng = window.MSIMEarth.Math.toDegrees(cartographic.longitude)
  let alt = cartographic.height
  return {
    lng: lng,
    lat: lat,
    height: alt
  }
}
function handleCluster(data) {
  // 聚合
  const pixelRange = 0.5
  const minimumClusterSize = 2
  //clustering 获取或设置此数据源的群集选项。此对象可以在多个数据源之间共享。
  data.clustering.enabled = true //获取或设置是否启用群集。
  data.clustering.pixelRange = pixelRange //pixelRange 是聚合距离，也就是小于这个距离就会被聚合,以像素为单位
  data.clustering.minimumClusterSize = minimumClusterSize //minimumClusterSize是每个聚合点的最小聚合个数，这个值最好是设置为2，因为两个图标也可能叠压。
  let removeListener

  function customStyle() {
    if (window.MSIMEarth.defined(removeListener)) {
      removeListener()
      removeListener = undefined
    } else {
      removeListener = data.clustering.clusterEvent.addEventListener(function (
        clusteredEntities,
        cluster
      ) {
        cluster.label.show = false
        cluster.billboard.show = true
        cluster.billboard.width = 0
        cluster.billboard.height = 0
      })
    }
    // force a re-cluster with the new styling
    const pixelRange = data.clustering.pixelRange
    data.clustering.pixelRange = 0
    data.clustering.pixelRange = pixelRange
  }
  customStyle()
}

//一维数组转二维
function Array1to2(arr, number) {
  var arr2 = []
  let len = arr.length
  for (let i = 0, j = 0; i < len; i += number, j++) {
    arr2[j] = arr.splice(0, number)
  }
  return arr2
}
function date2String(time, ms) {
  let newTime = new Date(time.getTime() + ms)
  let year = newTime.getFullYear()
  let month = newTime.getMonth() + 1
  let date = newTime.getDate()
  let hours = newTime.getHours()
  let minute = newTime.getMinutes()
  let second = newTime.getSeconds()
  if (month < 10) {
    month = '0' + month
  }
  if (date < 10) {
    date = '0' + date
  }
  if (hours < 10) {
    hours = '0' + hours
  }
  if (minute < 10) {
    minute = '0' + minute
  }
  if (second < 10) {
    second = '0' + second
  }
  return (
    year + '-' + month + '-' + date + ' ' + hours + ':' + minute + ':' + second
  )
}
//获取场景中相机四角点
function getCameraExtendPos() {
  // 范围对象
  var extent = {}

  // 得到当前三维场景
  var scene = EarthViewer.scene

  // 得到当前三维场景的椭球体
  var ellipsoid = scene.globe.ellipsoid
  var canvas = scene.canvas

  // canvas左上角
  var car3_lt = EarthViewer.camera.pickEllipsoid(
    new MSIMEarth.Cartesian2(0, 0),
    ellipsoid
  )

  // canvas右下角
  var car3_rb = EarthViewer.camera.pickEllipsoid(
    new MSIMEarth.Cartesian2(canvas.width, canvas.height),
    ellipsoid
  )

  // 当canvas左上角和右下角全部在椭球体上
  if (car3_lt && car3_rb) {
    var carto_lt = ellipsoid.cartesianToCartographic(car3_lt)
    var carto_rb = ellipsoid.cartesianToCartographic(car3_rb)
    extent.xmin = MSIMEarth.Math.toDegrees(carto_lt.longitude)
    extent.ymax = MSIMEarth.Math.toDegrees(carto_lt.latitude)
    extent.xmax = MSIMEarth.Math.toDegrees(carto_rb.longitude)
    extent.ymin = MSIMEarth.Math.toDegrees(carto_rb.latitude)
  }

  // 当canvas左上角不在但右下角在椭球体上
  else if (!car3_lt && car3_rb) {
    var car3_lt2 = null
    var yIndex = 0
    do {
      // 这里每次10像素递加，一是10像素相差不大，二是为了提高程序运行效率
      yIndex <= canvas.height ? (yIndex += 10) : canvas.height
      car3_lt2 = EarthViewer.camera.pickEllipsoid(
        new MSIMEarth.Cartesian2(0, yIndex),
        ellipsoid
      )
    } while (!car3_lt2)
    var carto_lt2 = ellipsoid.cartesianToCartographic(car3_lt2)
    var carto_rb2 = ellipsoid.cartesianToCartographic(car3_rb)
    extent.xmin = MSIMEarth.Math.toDegrees(carto_lt2.longitude)
    extent.ymax = MSIMEarth.Math.toDegrees(carto_lt2.latitude)
    extent.xmax = MSIMEarth.Math.toDegrees(carto_rb2.longitude)
    extent.ymin = MSIMEarth.Math.toDegrees(carto_rb2.latitude)
  }

  // 获取高度
  extent.height = Math.ceil(EarthViewer.camera.positionCartographic.height)
  return extent
}
//设置模型描边
function setModelSilhouetteColor(id, side) {
  let entity = window.EarthPlugn.entity._GetCZMLEntity(
    id,
    'MSIMEarthCZMLProcessContainer'
  )
  if (window.MSIMEarth.defined(entity)) {
    if (side == 'blue') {
      //设置是否显示描边
      if (store.state.sceneModule.modelConfig.modelOutline) {
        if (store.state.sceneModule.modelConfig.detailedModel) {
          entity.model.silhouetteSize = 2
          entity.model.silhouetteColor = new window.MSIMEarth.Color(
            0.0,
            1.0,
            1.0,
            0.3
          )
        } else {
          entity.model.silhouetteSize = 0
        }
      } else {
        entity.model.silhouetteSize = 0
      }
    } else {
      //设置是否显示描边
      if (store.state.sceneModule.modelConfig.modelOutline) {
        if (store.state.sceneModule.modelConfig.detailedModel) {
          entity.model.silhouetteColor = new window.MSIMEarth.Color(
            1.0,
            0.0,
            0.0,
            0.3
          )
          entity.model.silhouetteSize = 2
        } else {
          entity.model.silhouetteSize = 0
        }
      } else {
        entity.model.silhouetteSize = 0
      }
    }
  }
}
/*
 *设置动态数据精模简模切换
 *id:实体Id;side:阵营;json:推送过来的动态czml数据
 */
function changeCzmlModel(id, side, json) {
  let model = {}
  let entity = window.EarthPlugn.entity._GetCZMLEntity(
    id,
    'MSIMEarthCZMLProcessContainer'
  )
  if (json && json.length > -1 && window.MSIMEarth.defined(entity)) {
    //简模显示
    if (!store.state.sceneModule.modelConfig.detailedModel) {
      let res = JBConfig({
        type: json[1].properties.airplaneAction.type,
        side: json[1].properties.airplaneAction.side,
        id: json[1].id
      })
      model = res.model
      if (Object.keys(model).length > -1) {
        if (entity.model.uri != model.gltf) {
          entity.model.uri.setValue(model.gltf)
          // entity.model.colorBlendMode = window.MSIMEarth.ColorBlendMode.MIX
          // entity.model.colorBlendAmount = 0.0
          entity.model.silhouetteSize = 0
          entity.model.silhouetteColor = {
            rgba: [175, 175, 175, 0]
          }
          if (model.minimumPixelSize && entity.model.minimumPixelSize)
            entity.model.minimumPixelSize.setValue(50)
        }
      }
    } else {
      //精模显示
      if (json && json.length > 1) {
        let res = modelConfig({
          type: json[1].properties.airplaneAction.type,
          side: json[1].properties.airplaneAction.side,
          id: json[1].id
        })
        model = res.model
        if (Object.keys(model).length > -1) {
          if (entity.model.uri != model.gltf) {
            entity.model.uri.setValue(model.gltf)
            if (model.minimumPixelSize && entity.model.minimumPixelSize)
              entity.model.minimumPixelSize.setValue(
                Number(model.minimumPixelSize)
              )
            if (entity.properties.airplaneAction._value.side === 'blue') {
              entity.model.colorBlendMode = window.MSIMEarth.ColorBlendMode.MIX
              entity.model.colorBlendAmount = 0.7
              entity.model.color = new window.MSIMEarth.Color(
                15 / 255.0,
                61 / 255.0,
                229 / 255.0,
                1.0
              )
            } else {
              entity.model.colorBlendMode = window.MSIMEarth.ColorBlendMode.MIX
              entity.model.colorBlendAmount = 0.7
              entity.model.color = new window.MSIMEarth.Color(
                221 / 255.0,
                92 / 255.0,
                92 / 255.0,
                1.0
              )
            }
          }
        }
      }
    }
  }
}
// 浮动信息显示
function showSysMessage(sourId, textStr) {
  const entityMethod = new window.EarthPlugn.entity({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  let entitypath2 = entityMethod.getCZMLEntity(
    sourId,
    'MSIMEarthCZMLProcessContainer'
  )
  if (window.MSIMEarth.defined(entitypath2)) {
    let postionArr = getEititiesPostion(entitypath2)
    window.sceneAction.systemMessage.labelMessage({
      sysMessageId: sourId + '_sysMessage',
      sysMessagePosition: [postionArr[0], postionArr[1], postionArr[2]],
      sysMessageText: textStr,
      sysFillColor: store.state.seatModule.getStateInfoColor
    })
  }
}
// 导调指令消息提示
function showCommandSysMessage(sourId, textStr, fillColor) {
  const entityMethod = new window.EarthPlugn.entity({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  let entitypath2 = entityMethod.getCZMLEntity(
    sourId,
    'MSIMEarthCZMLProcessContainer'
  )
  if (window.MSIMEarth.defined(entitypath2)) {
    let postionArr = getEititiesPostion(entitypath2)
    window.sceneAction.systemMessage.labelMessage({
      sysMessageId: sourId + '_sysMessage',
      sysMessagePosition: [postionArr[0], postionArr[1], postionArr[2]],
      sysMessageText: textStr,
      sysFillColor: fillColor
    })
  }
}
//获取czml实体经纬度信息
function getEititiesPostion(entitypath) {
  let positionArr = entitypath.position._value
    ? entitypath.position._value
    : entitypath.position.getValue(window.EarthViewer.clock.currentTime)
  let entitiesCartographic =
    window.MSIMEarth.Cartographic.fromCartesian(positionArr)
  if (!window.MSIMEarth.defined(entitiesCartographic)) {
    return
  }
  return [
    window.MSIMEarth.Math.toDegrees(entitiesCartographic.longitude),
    window.MSIMEarth.Math.toDegrees(entitiesCartographic.latitude),
    entitiesCartographic.height
  ]
}
//获取czml实体经纬度信息
function resetEarth() {
  const viewer = window.EarthViewer
  // emitter.emit('closeES', '结束') // 结束ES测试
  //清除相机视角固定
  resetView()
  window.EarthViewer.trackedEntity = ''
  window.EarthViewer.camera.lookAtTransform(window.MSIMEarth.Matrix4.IDENTITY)
  viewer.camera.flyTo({
    destination: window.MSIMEarth.Cartesian3.fromDegrees(
      109.87,
      34.706,
      21851000
    ),
    orientation: {
      heading: 6.283185307179586,
      pitch: -1.5702354045820344,
      roll: 0
    }
  })
  // let pathIds = store.getters.getSelectSatelliteIdList
  // pathIds.forEach((element) => {
  //   let ds = viewer.dataSources.getByName(element)
  //   if (ds.length > 0) {
  //     for (let t = 0; t < ds.length; t++) {
  //       ds[t].entities.removeAll()
  //     }
  //   }
  // })

  // let ens = viewer.entities.values
  // ens.forEach((element) => {
  //   if (element.id.indexOf('椎体') > -1) {
  //     let removePartId = element.id.split('-椎体')[0]
  //     let walltrail = viewer.entities.getById(removePartId + '-wall-trail')
  //     viewer.entities.remove(element)
  //     viewer.entities.remove(walltrail)
  //     if (window['curDivPoint' + removePartId]) {
  //       window['curDivPoint' + removePartId].closeEvent()
  //     }
  //   }
  // })
  // let msg = [
  //   {
  //     id: '0_1_357',
  //     type: 'sar'
  //   },
  //   {
  //     id: '0_1_177',
  //     type: 'sar'
  //   }
  // ]
  // msg.forEach((element) => {
  //   let ds = viewer.dataSources.getByName(element.type)
  //   let obj = ds[0].entities.getById(element.id)
  //   setWXZNSF(obj)
  //   store.commit('setSatelliteEvent', element)
  // })
  // 删除雷达效果
  for (
    let i = window.EarthViewer.scene.primitives._primitives.length - 1;
    i >= 0;
    i--
  ) {
    let p = window.EarthViewer.scene.primitives._primitives[i]
    if (typeof p.id !== 'undefined') {
      if (typeof p.id == 'string' && p.id.indexOf('radar') > -1) {
        if (typeof p !== 'undefined') {
          window.EarthViewer.scene.primitives.remove(p)
        }
      }
    }
  }
  for (let ii = window.EarthViewer.entities.values.length - 1; ii >= 0; ii--) {
    let item = window.EarthViewer.entities.values[ii]
    if (typeof item.id !== 'undefined') {
      if (
        typeof item.id == 'string' &&
        item.id.indexOf('_ElectronicInterfer') > -1
      ) {
        if (window.EarthViewer.entities.getById(item.id)) {
          window.EarthViewer.entities.removeById(item.id)
        }
      }
    }
  }
  // 清除视锥
  removeAllFrustumFun()
}
// 拦截想定 场景加载 显示雷达探测效果
function radarCreateBylanjieScenario(entity, radarId) {
  let entityPosArr = getEititiesPostion(entity)

  if (window.EarthViewer.scene.mode !== 2) {
    // 三维显示
    let winstonId = 'primitive_virtual_' + radarId
    let curPrimitiEn = null
    window.EarthViewer.scene.primitives._primitives.forEach((p) => {
      if (
        typeof p.id !== 'undefined' &&
        typeof p.id == 'string' &&
        p.id === winstonId
      ) {
        curPrimitiEn = p
      }
    })
    if (!window.MSIMEarth.defined(curPrimitiEn)) {
      let cusP = new window.EarthPlugn.customPritive(
        window.MSIMEarth,
        window.EarthViewer
      )
      let winston = cusP.createWinstonHalf(
        [218000, 218000, 218000],
        [entityPosArr[0], entityPosArr[1], 100],
        {
          color: new window.MSIMEarth.Color(255 / 255, 0 / 255, 0 / 255, 1.0),
          id: 'primitive_virtual_' + radarId
        }
      )
      window.EarthViewer.scene.primitives.add(winston)
    }
  } else {
    // 雷达干扰半圆
    window.sceneAction.planeCzmlManage.planeElectronicInterfer({
      sourId: radarId,
      radius: 218000
    })
  }
}

// 继续推演场景 与 非白方席位 加载 作战区域geoJson信息数据  ---  服务要求临时与 想定id拼接url使用
function loadScenarioOperationalAreaFile() {
  let dataController = new window.EarthPlugn.DataControl({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  let scenarioOperationalAreaFileUrl =
    staticUrl +
    'EMTool/battlefieldArea/' +
    store.state.curSceneInfo.scenarioId +
    '.json'
  dataController.addGeojsonByOperationalAreaFile(
    {
      url: scenarioOperationalAreaFileUrl,
      id: '作战区域',
      backLoad: true
    },
    true
  )
}

// 增加白方 静态实体，目前数据写死
function laodJtPaBaifangEntity() {
  let targetList = [
    {
      name: 'J-16-1',
      value: 'J-16-1',
      position: {
        x: 125.38798101038,
        y: 45.284830579520175,
        z: 3000
      }
    },
    {
      name: 'J-16-2',
      value: 'J-16-2',
      position: {
        x: 125.08295507024978,
        y: 45.36413732395401,
        z: 3000
      }
    }
  ]
  targetList.forEach((item) => {
    let jsonDataParm = {
      Name: item.value,
      LabelName: item.name,
      Lon: item.position.x,
      Lat: item.position.y,
      Alt: item.position.z
    }
    addJtPaEntity(jsonDataParm)
  })

  function addJtPaEntity(jsonData) {
    let outColor = new window.MSIMEarth.Color(0.0, 1.0, 1.0, 1.0)
    let distance = new window.MSIMEarth.DistanceDisplayCondition(800, 100e5)
    let height = 0
    let imageUrl = './static/image/billboard/静态目标/飞机W.png'
    let scale = 0.5
    let entitiesData = {
      id: jsonData.Name,
      position: new window.MSIMEarth.Cartesian3.fromDegrees(
        jsonData.Lon,
        jsonData.Lat,
        jsonData.Alt + height
      ),
      label: {
        text: jsonData.LabelName,
        font: 'normal 29px MicroSoft YaHei',
        scale: 0.5,
        // fillColor: color,
        outlineColor: outColor,
        outlineWidth: 3,
        style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT, //水平位置
        verticalOrigin: window.MSIMEarth.VerticalOrigin.BOTTOM,
        pixelOffset: new window.MSIMEarth.Cartesian2(2, -21),
        eyeOffset: new window.MSIMEarth.ConstantProperty(
          new window.MSIMEarth.Cartesian3(0, 0, -11)
        ),
        // distanceDisplayCondition:
        //   new window.MSIMEarth.DistanceDisplayCondition(1000, 6e5), //20e5
        distanceDisplayCondition: distance,
        heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      },
      billboard: {
        image: imageUrl,
        scale: scale,
        distanceDisplayCondition: distance,
        // heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND,// 聚合影响显示，注释
        // // scaleByDistance: scByNear
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    }
    // 单个实体形式
    window.EarthViewer.entities.removeById(jsonData.Name)
    window.EarthViewer.entities.add(entitiesData)
  }
}

// 删除白方 静态实体，目前数据写死
function removeJtPaBaifangEntity(entitiesId) {
  if (window.EarthViewer.entities.getById(entitiesId)) {
    window.EarthViewer.entities.removeById(entitiesId)
  }
}
//使用canvas重新绘制label显示内容和样式
function setLabelCanvas(text, img) {
  return new Promise((resolve, reject) => {
    // //设置颜色
    // let bgColor = '',
    //   strokeStyle = '',
    //   textFillStyle = '',
    //   textFont = '',
    //   bgLineWidth = '',
    //   radius = ''
    // if (
    //   EarthViewer.imageryLayers._layers.length >= 3 &&
    //   EarthViewer.imageryLayers.get(2).imageryProvider.url.indexOf('qian') > 0
    // ) {
    //   bgColor = labelStyleConfig.qianImagery.bgColor
    //   strokeStyle = labelStyleConfig.qianImagery.strokeStyle
    //   textFillStyle = labelStyleConfig.qianImagery.textFillStyle
    //   textFont = labelStyleConfig.qianImagery.textFont
    //   bgLineWidth = labelStyleConfig.qianImagery.bgLineWidth
    //   radius = labelStyleConfig.qianImagery.radius
    // } else {
    //   bgColor = labelStyleConfig.shenImagery.bgColor
    //   strokeStyle = labelStyleConfig.shenImagery.strokeStyle
    //   textFillStyle = labelStyleConfig.shenImagery.textFillStyle
    //   textFont = labelStyleConfig.shenImagery.textFont
    //   bgLineWidth = labelStyleConfig.qianImagery.bgLineWidth
    //   radius = labelStyleConfig.qianImagery.radius
    // }
    // // 绘制图标
    // const canvas = document.createElement('canvas')
    // let width = text.length * 16 + 25
    // // 扩展标牌长度匹配方法
    // switch (text.length) {
    //   case 6:
    //     width = text.length * 16 + 45
    //     break
    //   default:
    //     break
    // }
    // canvas.width = width
    // canvas.height = 30
    // const ctx = canvas.getContext('2d')
    // const icon = new Image()
    // icon.src = img //表示阵营示意的图片
    // icon.onload = () => {
    //   ctx.drawImage(icon, 0 + 10, 5, 20, 20)
    //   // 全局透明度(针对canvas中所有的图形生效)
    //   ctx.globalAlpha = 0.8
    //   // 填充矩形背景（黑色）
    //   //ctx.fillStyle = '#1a15154d'
    //   //-----------------------------------------------------------
    //   // ctx.fillStyle = bgColor //设置矩形填充颜色
    //   // ctx.fillRect(0, 0, canvas.width, canvas.height) //绘制矩形
    //   // //绘制带边线的矩形，不带填充色
    //   // ctx.strokeStyle = strokeStyle
    //   // ctx.lineWidth = bgLineWidth;
    //   // ctx.strokeRect(0, 0, canvas.width, canvas.height)
    //   //设置带边线的文字
    //   // ctx.trokeStyle = "#000"
    //   // ctx.lineWidth = 5;
    //   //ctx.strokeText(text, 25, 20)
    //   //------------------------------------------------------
    //   //绘制带圆角的矩形背景
    //   let w = canvas.width
    //   let h = canvas.height
    //   let x = 0
    //   let y = 0
    //   let r = radius //圆角半径
    //   ctx.beginPath()
    //   ctx.lineWidth = bgLineWidth
    //   ctx.moveTo(x, y)
    //   ctx.arcTo(x + w, y, x + w, y + h, r)
    //   ctx.arcTo(x + w, y + h, x, y + h, r)
    //   ctx.arcTo(x, y + h, x, y, r)
    //   ctx.arcTo(x, y, x + w, y, r)
    //   ctx.fillStyle = bgColor
    //   ctx.fill()
    //   ctx.strokeStyle = strokeStyle
    //   ctx.stroke()
    //   //--------------------------------
    //   //设置带填充色的文字
    //   ctx.font = textFont
    //   ctx.fillStyle = textFillStyle
    //   ctx.fillText(text, 25 + 10, 20) //y值越小，越往上移
    //   //json[1].billboard.image = canvas.toDataURL()
    //   resolve(canvas.toDataURL())
    // }
    let textContent = ''
    if (text.indexOf('&') > -1) {
      textContent = text.split('&')
    }
    let height = textContent ? 40 * 2 : 30
    let width = textContent ? textContent[1].length * 25 + 20 : 125
    let canvas = document.createElement('canvas')
    canvas.width = width
    canvas.height = height
    let context = canvas.getContext('2d')
    context.rect(0, 0, canvas.width, canvas.height)
    let bgImg = new Image()
    bgImg.src = img // 背景图的url
    bgImg.crossOrigin = 'Anonymous'
    bgImg.onload = () => {
      context.drawImage(bgImg, 0, 0, width, height)
      context.lineWidth = 1 //线宽
      context.strokeStyle = 'black' //描边颜色

      context.fillStyle = '#FFFFFF' //this.color //文本填充颜色
      // context.textAlign = 'center' //文本居中
      context.textAlign = 'left' //文本居中
      context.textBaseline = 'middle'
      const xPos = canvas.width / 2 // 计算文本左边距
      const yPos = canvas.height / 2 // 计算文本基线位置
      // context.fillText(text, xPos + 2, yPos) //文字填充
      if (textContent) {
        context.font = 'bold 30px MicroSoft YaHei'
        context.fillText(textContent[0], 15, 25) //名称文字填充
        context.fillText(textContent[1], 15, 55) //任务文字填充
      } else {
        context.font = 'bold 16px MicroSoft YaHei'
        context.textAlign = 'center' //文本居中
        context.fillText(text, xPos + 2, yPos) //文字填充
      }

      let base64 = canvas.toDataURL('image/png')
      resolve(base64)
    }
  })
}

//鼠标拖动工具条面板
function moveBtnPanel(className) {
  let el = document.getElementsByClassName(className)[0]
  el.onmousedown = function (event) {
    let ev = event || window.event
    let x = ev.clientX - el.offsetLeft
    let y = ev.clientY - el.offsetTop
    document.onmousemove = function (event) {
      let ev = event || window.event
      let moveX = ev.clientX - x
      let moveY = ev.clientY - y
      if (moveX < 0) {
        moveX = 0
      } else if (moveX > window.innerWidth - el.offsetWidth) {
        moveX = window.innerWidth - el.offsetWidth
      }
      if (moveY < 0) {
        moveY = 0
      } else if (moveY > window.innerHeight - el.offsetHeight) {
        moveY = window.innerHeight - el.offsetHeight
      }
      el.style.left = moveX + 'px'
      el.style.top = moveY + 'px'
    }
    document.onmouseup = function () {
      document.onmousemove = null
      document.onmouseup = null
    }
  }
}

// 定位模拟器  目前参数 {id,rgb,fontColorRgb}
const flyToEntity = (params) => {
  //PursuitFighter_2:红方；BlueFighter_2：蓝方
  let entity = window.EarthPlugn.entity._GetCZMLEntity(
    params.id,
    'MSIMEarthCZMLProcessContainer'
  )
  if (!entity) return
  window.EarthViewer.flyTo(entity, {
    duration: 1.5,
    offset: new window.MSIMEarth.HeadingPitchRange(
      0,
      window.MSIMEarth.Math.toRadians(-90),
      600000
    )
  })
  //是否显示模型边线
  // if (params.isShowSilhouette) {
  //   // 如果是模拟器数据则模型增加边缘高亮
  //   entity.model.silhouetteSize = params.silhouetteSize
  //     ? params.silhouetteSize
  //     : 5
  //   entity.model.silhouetteColor = params.silhouetteColor
  //     ? params.silhouetteColor
  //     : window.MSIMEarth.Color.WHITE
  // }
  let stateStr = ''
  let titleName = entity ? entity.description : ''
  let stateObj = getLdrwListArrValue(titleName, EarthAPP.ldrw)
  if (stateObj != null) {
    stateStr = stateObj.state
  }
  params.state = stateStr
  // 当前位置
  let currentTime = window.EarthViewer.clock.currentTime
  let position = entity.position.getValue(currentTime)
  params.position = position
  //定位显示信息弹框
  setTimeout(() => {
    createPanelInfor(params)
  }, 2000)
}

//显示模拟器信息弹框
const createPanelInfor = (params) => {
  new Bubble1({
    content: [
      { name: '经度', value: '' },
      { name: '纬度', value: '' },
      { name: '高度', value: '' },
      // { name: '航向角', value: 0 + '°' },
      // { name: '', value: '' },
      { name: '速度', value: 0 + 'km/h' },
      { name: '任务', value: params.state }
      // { name: '油量', value: '--' },
      // { name: '载弹量', value: '--' }
    ],
    viewer: window.EarthViewer,
    id: params.id,
    Cesium: window.MSIMEarth,
    title: params.name,
    name: 'simple',
    offsetY: -300, //单位px 以当前目标点为中心+offsetY 负数向上 正数向下
    offsetX: 150, //单位px 以当前目标点为中心+offsetX 负数向左偏移 正数向右偏移
    distanceDisplayCondition: [100, 700000],
    div: 'planDetail',
    rgb: params.rgb, //红、蓝
    fontColorRgb: params.fontColorRgb, // 字体颜色
    isCloseClick: false, // 关闭按钮
    position: params.position
  })
  //存储详标签实体id
  store.state.sceneModule.toolbarEntityonfig.detailLabelList.push(params.id)
}

// 查找 LD演示场景各个仿真平台任务划分  依据 description
const getLdrwListArrValue = (curData, datasArr) => {
  const i = datasArr.findIndex((item) => {
    if (item.description == curData) {
      // item.state = EarthAPP.taskContent[store.state.curSceneName]
      //   ? EarthAPP.taskContent[store.state.curSceneName]
      //   : ''
      return item
    }
  })
  return datasArr[i] ? datasArr[i] : null
}

//加载模拟器单个飞机 轨迹回放
const getTrajectoryReplayData = (czmlData) => {
  // let czmlData = require('/public/static/data/czml/submarineRoutePath.js')
  setTimeout(() => {
    loadTrajectory(czmlData)
  }, 600)

  // 飞机轨迹加载
  const loadTrajectory = (czmlDS) => {
    let czmlData = czmlDS.czml
    window.EarthViewer.clock.shouldAnimate = false
    window.EarthViewer.clock.multiplier = 1 //设置1倍速
    // sjJsonDataObj.czml[1].id = 'czml_' + sjJsonDataObj.czml[1].id
    czmlData[1].model.show = true
    czmlData[1].label.show = false
    if (czmlData[0].name == 'Y8' || czmlData[0].name == 'Y9') {
      czmlData[1].model.gltf = './static/data/gltf/3DModel/y9.glb'
    } else if (czmlData[0].name == '教10') {
      czmlData[1].model.gltf = './static/data/gltf/3DModel/jiao10.glb'
    } else if (czmlData[0].name.indexOf('轰6') > -1) {
      czmlData[1].model.gltf = './static/data/gltf/3DModel/H6K.glb'
    }

    czmlData[1].model.maximumScale = 25
    czmlData[1].model.scale = 25
    // 设置路径
    czmlData[1].path = {
      width: 4,
      show: true,
      resolution: 0, //将路径显示为以1秒为增量采样的路径线 路径的分辨率，即路径上点的数量。此参数决定如何在两点之间插值
      // leadTime: 10000, // 路径的领先时间，单位为秒。
      // trailTime: 72000, //路径的追踪时间，单位为秒。
      material: {
        polylineDash: {
          color: {
            rgba: [255, 0, 82, 255]
            // rgba: [30, 144, 255, 255]
          }
        }
      }
    }
    /**
     * range：当前时间到达其开始时间或结束时间时的行为。
     * UNBOUNDED - 时钟将继续向当前方向前进
     * LAMPED - T时钟将停止
     * LOOP_STOP - 当向前推进到达结束时间时，时钟将跳转到开始时间，当向后推进到达开始时间时，时钟将停止
     */
    //czml range
    czmlData[0].clock.range = 'UNBOUNDED'
    let czmldatas = window.MSIMEarth.CzmlDataSource.load(czmlData)
    window.EarthViewer.dataSources.add(czmldatas).then((ds) => {
      ds.czmlName = czmlData[1].id

      // 配置czml 样式
      ds.entities._entities._array.forEach((element) => {
        element.description = ''
        // if (typeof element.billboard != 'undefined') {
        //   element.billboard.show = true
        // }
        if (typeof element.model != 'undefined') {
          element.model.show = true
        }
      })
      //Cesium基于czml billboard的模型转向
      var s = ds.entities.getById(czmlData[1].id)
      s.orientation = new window.MSIMEarth.VelocityOrientationProperty(
        s.position
      )
      s.model.colorBlendMode = window.MSIMEarth.ColorBlendMode.MIX
      s.model.colorBlendAmount = 0.7
      s.model.color = new window.MSIMEarth.Color(
        221 / 255.0,
        92 / 255.0,
        92 / 255.0,
        1.0
      )
      // s.billboard.alignedAxis =
      //   new window.MSIMEarth.VelocityVectorProperty(s.position, true)

      ds.show = true
      // 加载完成停止调用接口  点播放时再开始
      // window.EarthViewer.clock.multiplier = 0
      let params = {
        id: czmlData[1].id,
        name: czmlData[0].name
      }
      createCurSceneEntityLabel(params) // 加载labeldiv
      addAirPlanePathLine(czmlData[0].name)
      // 定位
      window.EarthViewer.flyTo(ds, {
        duration: 1.5
      })
      setTimeout(() => {
        window.EarthViewer.clock.shouldAnimate = true
      }, 1500)
    })
  }

  // 设置 飞机轨迹 的labeldiv弹框
  const createCurSceneEntityLabel = (item) => {
    let id = item.id
    let name = item.name
    // setLabelStyle(id, name)//设置czml的label内容
    let divLabel = new BubbleAirPlane({
      viewer: window.EarthViewer,
      Cesium: window.MSIMEarth,
      id: id,
      title: name + '(轨迹回放)',
      name: name,
      lng: 0.0,
      lat: 0.0,
      height: 0.0,
      heading: 0.0,
      pitch: 0.0,
      roll: 0.0,
      content: {},
      offsetY: 120,
      div: id,
      distanceDisplayCondition: [0, 5000000]
    })
    window.shipAndMissileLabel[id] = divLabel
  }
  /**
   * 添加路径线
   * @param {string} id entity的id或datasource的name
   * @param {boolean} value 显示或隐藏
   */
  const addAirPlanePathLine = (czmlname) => {
    let side = 'red'
    let collection = []
    let sidecolor = new window.MSIMEarth.Color(0.0, 1.0, 1.0, 1.0)
    // let entity = that.entityMethodFun.getCZMLEntity(
    //   czmlname,
    //   'MSIMEarthCZMLProcessContainer'
    // )
    let entity = window.EarthViewer.dataSources
      .getByName(czmlname)[0]
      .entities.getById(czmlname)
    if (!entity || !entity.position) return
    // side = entity.properties.airplaneAction._value.side
    // if (side === 'blue') {
    //   sidecolor = new window.MSIMEarth.Color(0.0, 1.0, 1.0, 1.0)
    // }
    // entity
    function changePositions() {
      // let entity = that.entityMethodFun.getCZMLEntity(
      //   czmlname,
      //   'MSIMEarthCZMLProcessContainer'
      // )
      let entity = window.EarthViewer.dataSources
        .getByName(czmlname)[0]
        .entities.getById(czmlname)
      if (!entity || !entity.position) return
      let YGPosition = entity.position.getValue(
        window.EarthViewer.clock.currentTime
      )
      if (!YGPosition) return
      if (
        typeof YGPosition.x === 'undefined' ||
        typeof YGPosition.y === 'undefined' ||
        typeof YGPosition.z === 'undefined'
      ) {
        return
      }
      collection.push(YGPosition)
      return collection
    }
    window.EarthViewer.entities.add({
      id: czmlname + 'pathLine',
      polyline: {
        positions: new window.MSIMEarth.CallbackProperty(
          changePositions,
          false
        ),
        width: 5,
        material: sidecolor
      }
    })
  }
}

// 删除飞机轨迹路径线
const removeAirPlanePathLine = (czmlname) => {
  window.EarthViewer.entities.removeById(czmlname + 'pathLine')
  window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
    if (dataSource._name == czmlname) {
      // 移除czml路径
      window.EarthViewer.dataSources.remove(dataSource)
    }
  })
}

//防抖函数：一个需要频繁触发的函数，在规定时间内，只让最后一次生效，前面的不生效
function debounceBtn(fn, delay) {
  //记录上一次的延时器
  let timer = null
  return () => {
    //清除上一次延时器
    clearTimeout(timer)
    //重新设置新的延时器
    timer = setTimeout(() => {
      fn()
    }, delay)
  }
}

// // SSEClose  公共关闭方法
// const eventControllerSSEClose = async (EventController) => {
//   if (EventController) {
//     let getCurSceneIDArr = store.state.sceneModule.curSceneIDArr
//     if (getCurSceneIDArr && getCurSceneIDArr.length > 0) {
//       // 使用Promise.all并行处理所有SSEClose调用
//       const closePromises = getCurSceneIDArr.map(async (item) => {
//         if (!item) return
//         try {
//           const res = await SSEClose({ userid: item })
//           if (res.code == 200) {
//             console.log(item, '客户端关闭成功')
//           }
//         } catch (err) {
//           console.log(err)
//         }
//       })

//       // 等待所有SSEClose调用完成
//       await Promise.all(closePromises)

//       // 所有调用完成后关闭EventController
//       if (typeof EventController.close !== 'undefined') {
//         EventController.close()
//       }

//       window.curSceneIDArr = []
//       store.commit('setCurSceneIDArr', [])
//     }
//   }
// }

// SSEClose  公共关闭方法
const eventControllerSSEClose = async (EventController) => {
  if (EventController) {
    let getCurSceneIDArr = store.state.sceneModule.curSceneIDArr
    if (getCurSceneIDArr && getCurSceneIDArr.length > 0) {
      // getCurSceneIDArr.forEach((item) => {
      for (let x = 0; x < getCurSceneIDArr.length; x++) {
        let item = getCurSceneIDArr[x]
        if (!item) return
        await SSEClose({ userid: item })
          .then((res) => {
            if (res.code == 200) {
              console.log(item, '客户端关闭成功')
              if (EventController) {
                if (typeof EventController.closeStream !== 'undefined') {
                  EventController.closeStream()
                  EventController = null
                }
                EventController = null
              }
            }
          })
          .catch((err) => {
            console.log(err)
          })
        // sceneControl({ kill: 0 }).then((res) => {})
      }

      // })
      window.curSceneIDArr = []
      store.commit('setCurSceneIDArr', [])
    }
  }
}

/**
 * 判断 点是否在圆内
 * @param {*} circleCenterPointArr  [longitude, latitude]
 * @param {*} radius
 * @param {*} pointArr [longitude, latitude]
 * @returns
 */
const getIsInsideCircleByPoint = (circleCenterPointArr, radius, pointArr) => {
  console.log('当前半径', radius)
  // 创建一个圆形要素 longitude、latitude为圆心经度和纬度，radius为半径 单位KM
  radius = Number(radius / 1000)
  let circle = window.turf.circle(circleCenterPointArr, radius)
  // 将圆形要素转换成 GeoJSON 格式
  // let geojsonCircle = window.turf.feature(circle)
  // 创建一个点要素 longitude、latitude为点的经度和纬度
  let point = window.turf.point(pointArr)
  // 将点要素转换成 GeoJSON 格式
  // let geojsonPoint = window.turf.feature(point)
  // 使用 window.turf.js 中的 within 函数来判断点是否在圆内
  // let isInsideCircle = window.turf.booleanWithin(geojsonPoint, geojsonCircle)
  let isInsideCircle = window.turf.booleanWithin(point, circle)
  // 多边形判断方式
  // let polygon = window.turf.polygon([circle.geometry.coordinates[0]])
  // isInsideCircle = window.turf.booleanPointInPolygon(point, polygon)
  return isInsideCircle
}

/**
 * 判断 点是否在圆内
 * @param {*} resData  导调接口返回内容
 * @param {*} testStr  消息提示内容
 * @param {*} sourceName  当前实体id
 */
const sendToCommandShowResMsg = (resData, testStr, sourceName) => {
  let sendToCommandData = JSON.parse(resData)
  if (sendToCommandData['IsSendToCommand'] == 'true') {
    let controlResData = JSON.parse(sendToCommandData.data)
    if (controlResData && Object.keys(controlResData).length > 0) {
      if (controlResData.status == 'successes') {
        showSysMessage(sourceName, testStr)
      } else {
        if (controlResData['reason'] && controlResData['reason'].length > 0) {
          ElMessage({
            type: 'error',
            message: '导调指令失败：' + controlResData['reason']
          })
          // 右上角消息提示
          // beautyToast.error({
          //   title: '导调指令',
          //   message: controlResData['reason'],
          //   darkTheme: true
          // })
        } else {
          ElMessage({
            type: 'error',
            message: '导调' + controlResData['commandName'] + '指令失败!'
          })
        }
      }
    }
  }
}

//k3
//设置卫星开机、关机效果状态
const setSatelliteType = (params) => {
  let options = {
    satelliteId: params.satelliteId,
    czmlSource: params.czmlSource
  }
  let options11 = {
    satelliteType: params.satelliteType,
    entityId: params.satelliteId,
    orbitType: params.orbitType
  }
  if (params.onFlag) {
    //开机
    window.sceneAction.satelliteActorCZML.setStyleEffect(options) //显示开机消息弹框面板
    // window.sceneAction.satelliteActorCZML.turnOnPure(options) //开机效果
    window.sceneAction.satelliteSixActController.spyOnEffect(options11) //开启扫描效果
  } else {
    //关机
    window.sceneAction.satelliteSixActController.closeSpyOnEffect(options11) //移除扫描效果
    window.sceneAction.satelliteActorCZML.cancleStyleEffect(options) //取消样式
    // window.sceneAction.satelliteActorCZML.turnOffPure(options) //关机效果
    // window.sceneAction.satelliteActorCZML.turnOffPureEnd({
    //   satelliteId: params.satelliteId,
    //   czmlSource: params.czmlSource
    // }) //关机完成效果
  }
}

//显示半球效果
const createEllipsoidRadar = (czmlname, farDis, color) => {
  const entityMethod = new window.EarthPlugn.entity({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  let entity = entityMethod.getCZMLEntity(
    czmlname,
    'MSIMEarthCZMLProcessContainer'
  )
  if (!entity || !entity.position) return
  if (!farDis) return
  let changePositions = function () {
    let updateEntity = entityMethod.getCZMLEntity(
      czmlname,
      'MSIMEarthCZMLProcessContainer'
    )
    if (!updateEntity) return
    let YGPosition = updateEntity.position.getValue(
      window.EarthViewer.clock.currentTime
    )
    if (!window.MSIMEarth.defined(YGPosition)) return
    return YGPosition
  }
  let radarEllipsoid = EarthViewer.entities.add({
    id: czmlname + '-ellipsoidEntity',
    position: new window.MSIMEarth.CallbackProperty(changePositions, false),
    ellipsoid: {
      radii: new MSIMEarth.Cartesian3(farDis, farDis, farDis),
      maximumCone: MSIMEarth.Math.PI_OVER_TWO,
      material: new window.MSIMEarth.Color(
        color[0] / 255,
        color[1] / 255,
        color[2] / 255,
        color[3]
      ),
      fill: true,
      outline: false
      // outlineColor: MSIMEarth.Color.WHITE,
      // outlineWidth: 0.1
    }
  })
  return radarEllipsoid
}

//将经纬度转成度分秒格式  返回数组 [度,分,秒]  [36°23′45″]
const formatDegree = (value) => {
  let value2 = Math.abs(value)
  let v1 = Math.floor(value) //度
  let v2 = Math.floor((value - v1) * 60) //分
  let v3 = Math.round(((value - v1) * 3600) % 60) //秒
  if (v3 == 60) {
    v3 = 0
    v2 += 1
  }
  if (v2 == 60) {
    v2 = 0
    v1 += 1
  }
  // return [v1, v2, v3];
  let arrData = [v1, v2, v3]
  return arrData[0] + '°' + arrData[1] + '′' + arrData[2] + '″'
}

//将度分秒格式转成小数点格式
const degreeConvertBack = (value) => {
  let du = value[0] * 1
  let fen = value[1] * 1
  let miao = value[2] * 1
  let f = du < 0 ? fen / -60 : fen / 60
  let m = du < 0 ? miao / -3600 : miao / 3600
  return du + f + m
}

const clearEllipsoidRadar = (id) => {
  if (window.EarthViewer.entities.getById(id + '-ellipsoidEntity')) {
    window.EarthViewer.entities.removeById(id + '-ellipsoidEntity')
  }
}
//解析acmi文件
const loadAcmiFileParser = (dataUrl) => {
  window.MSIMEarth.GeoJsonDataSource.load(dataUrl).then((dataSource) => {
    const entities = dataSource.entities.values
    dataSource.name = 'acmiFile'
    for (let i = 0; i < entities.length; i++) {
      let entity = entities[i]
      if (entity.polyline) {
        // entity.polyline.material = new window.MSIMEarth.FlowLineMaterialProperty({
        //   transparent: true,
        //   mixColor: new window.MSIMEarth.Color(240 / 255, 248 / 255, 255 / 255, 1.0),
        //   repeat: new window.MSIMEarth.Cartesian2(10, 1),
        //   mixRatio: 0.5,
        //   flowSpeed: 10,
        //   image: './static/image/texture/materiallineF.png'
        // })
        // entity.polyline.width = 6
        entity.polyline.material = new window.window.MSIMEarth.Color(
          0.0,
          1.0,
          1.0,
          1.0
        )
        entity.polyline.width = 2
        entity.polyline.distanceDisplayCondition =
          new window.MSIMEarth.DistanceDisplayCondition(0, 11130e5)
      }
    }
    window.EarthViewer.dataSources.add(dataSource)
  })
}
//解析文件，文件类型acmi、aco
const loadFileParser = (dataUrl, name) => {
  window.MSIMEarth.GeoJsonDataSource.load(dataUrl).then((dataSource) => {
    const entities = dataSource.entities.values
    dataSource.name = name
    for (let i = 0; i < entities.length; i++) {
      let entity = entities[i]
      if (entity.polyline) {
        // entity.polyline.material = new window.MSIMEarth.FlowLineMaterialProperty({
        //   transparent: true,
        //   mixColor: new window.MSIMEarth.Color(240 / 255, 248 / 255, 255 / 255, 1.0),
        //   repeat: new window.MSIMEarth.Cartesian2(10, 1),
        //   mixRatio: 0.5,
        //   flowSpeed: 10,
        //   image: './static/image/texture/materiallineF.png'
        // })
        // entity.polyline.width = 6
        entity.polyline.material = new window.window.MSIMEarth.Color(
          0.0,
          1.0,
          1.0,
          1.0
        )
        entity.polyline.width = 2
        entity.polyline.distanceDisplayCondition =
          new window.MSIMEarth.DistanceDisplayCondition(0, 11130e5)
      }
      if (entity.polygon) {
        // let fillColor = entity.properties.fill.getValue()
        // let fill0pacity = entity.properties['fill-opacity']
        //   ? entity.properties['fill-opacity'].getValue()
        //   : entity.properties.fillOpacity
        //     ? entity.properties.fillOpacity.getValue()
        //     : 0.1
        let fillColor = '#e13939'
        let fill0pacity = 0.2
        entity.polygon.material =
          MSIMEarth.Color.fromCssColorString(fillColor).withAlpha(fill0pacity)
        // entity.polygon.height.setValue(VisParams.vectorDataHeight)
        // entity.polygon.perPositionHeight = false
        // entity.polygon.show = visible
      }
    }
    window.EarthViewer.dataSources.add(dataSource)
  })
}
export {
  // addLLH,
  mapEffect,
  Callback,
  worldPosToGraphic,
  handleCluster,
  illumination,
  Array1to2,
  date2String,
  getCameraExtendPos,
  setModelSilhouetteColor,
  changeCzmlModel,
  showSysMessage,
  resetEarth,
  radarCreateBylanjieScenario,
  loadScenarioOperationalAreaFile,
  laodJtPaBaifangEntity,
  removeJtPaBaifangEntity,
  setLabelCanvas,
  moveBtnPanel,
  showCommandSysMessage,
  getEititiesPostion,
  flyToEntity,
  getLdrwListArrValue,
  getTrajectoryReplayData,
  removeAirPlanePathLine,
  debounceBtn,
  eventControllerSSEClose,
  getIsInsideCircleByPoint,
  sendToCommandShowResMsg,
  setSatelliteType,
  createEllipsoidRadar,
  clearEllipsoidRadar,
  formatDegree,
  degreeConvertBack,
  loadAcmiFileParser,
  loadFileParser
}
