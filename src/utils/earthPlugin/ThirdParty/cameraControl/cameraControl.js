import { worldPosToGraphic, getCameraExtendPos } from '@/utils/mapTools'
import store from '@/store'
import CreateViewFrustum from '@/utils/effect/CreateViewFrustum'

// const {
//   configChecked,
//   state2
// } = loadData()
let lastViewEntity = null
let frustumObject = null
export let frustumObjectArray = []
export let radarPenetratingArray = []
/**
 * @param {string} id entity的id或datasource的name
 * @param {boolean} value 视角类别
 */
export function changeCameraView(id, value) {
  // let sourceSource = window.EarthViewer.dataSources.getByName(id)
  // let entity = sourceSource.length
  //   ? sourceSource[0].entities.values[0]
  //   : window.EarthViewer.entities.getById(id)
  // console.log(sourceSource, entity)
  const entityMethod = new window.EarthPlugn.entity({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  let entity = entityMethod.getCZMLEntity(id, 'MSIMEarthCZMLProcessContainer')
  if (!entity) return
  resetView()
  setView(entity, value)
  lastViewEntity = entity
  store.commit('setViewEntityID', id)
}

/**
 * 设置视角
 * @param {Object} entity 跟踪entity
 * @param {boolean} value 视角类别
 */
function setView(entity, type) {
  // if (document.querySelectorAll('#lableDiv-container').length > 0) {
  //   window.clearDivLabel() //清除daodan瞄准divlabel和postRender事件监听
  // }
  if (type == 'first') {
    setFirstPersonView(entity)
    // console.log(entity.label);
    store.commit('setShowFirstDiv', true) // 开启瞄准框
    if (entity && entity.label) {
      // console.log(entity);
      // lastViewEntity.label._show._value = false
      entity.show = false // 隐藏entity
    }
  } else if (type == 'three') {
    setThirdPersonView(entity)
    // store.commit('setShowThirdDiv', true) // 开启瞄准框
  } else if (type == 'free') {
    setFreeView()
  } else if (type == 'viewAngle') {
    setWatchView()
  } else if (type == 'lockEntity') {
    setLockEntityView(entity)
  } else {
    // window.EarthViewer.clock.onTick.addEventListener(adjust)
    // window.currentViewListener = adjust
  }
}

// 切换第一人称视角
export function setFirstPersonView(entity) {
  // 创建新相机用于视锥计算
  let lightCamera = new window.MSIMEarth.Camera(window.EarthViewer.scene)
  let cloneFru = window.EarthViewer.camera.frustum.clone()
  // 修改新视锥参数
  let fov = window.MSIMEarth.Math.toRadians(
    window.MSIMEarth.Math.toDegrees(cloneFru.fov || 1.0471975511965976) * 0.5
  )
  let cafrustumOutline = null
  let aspectRatio = 1.5
  // let aspectRatio = 1
  cloneFru.fov = fov
  cloneFru.near = 250
  cloneFru.far = 100000
  cloneFru.aspectRatio = aspectRatio
  lightCamera.frustum = cloneFru
  function drawFrustumOutline() {
    if (cafrustumOutline) {
      window.EarthViewer.scene.primitives.remove(cafrustumOutline)
    }
    const scratchRight = new window.MSIMEarth.Cartesian3()
    const scratchRotation = new window.MSIMEarth.Matrix3()
    const scratchOrientation = new window.MSIMEarth.Quaternion()
    const position = lightCamera.positionWC
    const direction = lightCamera.directionWC
    const up = lightCamera.upWC
    let right = lightCamera.rightWC
    right = window.MSIMEarth.Cartesian3.negate(right, scratchRight)
    let rotation = scratchRotation
    window.MSIMEarth.Matrix3.setColumn(rotation, 0, right, rotation)
    window.MSIMEarth.Matrix3.setColumn(rotation, 1, up, rotation)
    window.MSIMEarth.Matrix3.setColumn(rotation, 2, direction, rotation)
    let orientation = window.MSIMEarth.Quaternion.fromRotationMatrix(
      rotation,
      scratchOrientation
    )

    let instance = new window.MSIMEarth.GeometryInstance({
      geometry: new window.MSIMEarth.FrustumOutlineGeometry({
        frustum: lightCamera.frustum,
        origin: position,
        orientation: orientation,
        vertexFormat: window.MSIMEarth.VertexFormat.POSITION_ONLY
      }),
      attributes: {
        color: window.MSIMEarth.ColorGeometryInstanceAttribute.fromColor(
          window.MSIMEarth.Color.YELLOWGREEN //new window.MSIMEarth.Color(0.0, 1.0, 0.0, 1.0)
        )
      }
    })

    cafrustumOutline = window.EarthViewer.scene.primitives.add(
      new window.MSIMEarth.Primitive({
        geometryInstances: [instance],
        appearance: new window.MSIMEarth.PerInstanceColorAppearance({
          closed: true,
          flat: true
        }),
        asynchronous: false
      })
    )
  }
  function adjust() {
    // 获取当前模型方向和位置
    // entityB2 为模型对象
    if (!entity) return
    const orientation = entity.orientation
    const position = entity.position
    if (!orientation || !position) return
    // 获取偏向角
    let ori = orientation.getValue(window.EarthViewer.clock.currentTime)
    // 获取位置
    let center = position.getValue(window.EarthViewer.clock.currentTime)
    if (!center || !ori) return
    let curPos = worldPosToGraphic(center)
    // 1、由四元数计算三维旋转矩阵
    var mtx3 = window.MSIMEarth.Matrix3.fromQuaternion(ori)
    // 2、计算四维转换矩阵：
    var mtx4 = window.MSIMEarth.Matrix4.fromRotationTranslation(mtx3, center)
    // 3、计算角度：
    var hpr = window.MSIMEarth.Transforms.fixedFrameToHeadingPitchRoll(mtx4)
    // 获取角度（弧度）
    const headingTemp = hpr.heading
    const pitchTemp = hpr.pitch
    let heading, pitch, range
    // 调整角度为第一人称，注意调整的角度
    heading = window.MSIMEarth.Math.toRadians(
      window.MSIMEarth.Math.toDegrees(headingTemp) + 90
    )
    pitch = window.MSIMEarth.Math.toRadians(
      window.MSIMEarth.Math.toDegrees(pitchTemp) - 0
    ) //俯仰角，减去的值越大，越下俯
    range = 1

    const speedArr = [2100, 2000, 1800, 2500, 2200, 2400]
    let speedNum =
      speedArr[
        Math.floor(Math.random() * 10) > 5 ? 0 : Math.floor(Math.random() * 10)
      ]
    store.commit('setDanInfor', {
      lng: curPos.lng,
      lat: curPos.lat,
      height: curPos.height,
      heading: (window.MSIMEarth.Math.toDegrees(headingTemp) + 90).toFixed(15),
      pitch: (window.MSIMEarth.Math.toDegrees(pitchTemp) - 10).toFixed(15),
      roll: window.MSIMEarth.Math.toDegrees(hpr.pitch).toFixed(15),
      speed: speedNum ? speedNum : '2500' + 'km/h'
      //speed: '2000km/h'
    })
    // 动态改变模型视角
    window.EarthViewer.camera.lookAt(
      center,
      new window.MSIMEarth.HeadingPitchRange(heading, pitch, range)
    )
    // 新相机姿态
    lightCamera.lookAt(
      center,
      new window.MSIMEarth.HeadingPitchRange(heading, pitch, range)
    )
    // drawFrustumOutline()
    checkCatchedEntity(lightCamera)
    // window.EarthViewer.clock.shouldAnimate = false
  }
  window.EarthViewer.clock.onTick.addEventListener(adjust)
  window.currentViewListener = adjust
}

// 切换锁定实体视角
export function setLockEntityView(entity) {
  // entity.viewFrom = new window.MSIMEarth.Cartesian3(-1000, 1000, 1000.0)
  // window.EarthViewer.trackedEntity = entity
  const orientation = entity.orientation
  const position = entity.position
  if (!orientation || !position) {
    entity.viewFrom = new window.MSIMEarth.Cartesian3(1000, 1000, 1000)
    window.EarthViewer.trackedEntity = entity
    return
  }
  let ori = orientation.getValue(window.EarthViewer.clock.currentTime)
  let center = position.getValue(window.EarthViewer.clock.currentTime)
  if (!center || !ori) {
    entity.viewFrom = new window.MSIMEarth.Cartesian3(1000, 1000, 1000)
    window.EarthViewer.trackedEntity = entity
    return
  }
  // let curPos = worldPosToGraphic(center)
  // 1、由四元数计算三维旋转矩阵
  var mtx3 = window.MSIMEarth.Matrix3.fromQuaternion(ori)
  var mtx4 = window.MSIMEarth.Matrix4.fromRotationTranslation(mtx3, center)

  var hpr = window.MSIMEarth.Transforms.fixedFrameToHeadingPitchRoll(mtx4)
  // 获取角度（弧度）
  const headingTemp = hpr.heading
  const pitchTemp = hpr.pitch
  let heading, pitch, range
  // 调整角度为第一人称，注意调整的角度
  heading = window.MSIMEarth.Math.toRadians(
    window.MSIMEarth.Math.toDegrees(headingTemp) + 90
  )
  pitch = window.MSIMEarth.Math.toRadians(
    window.MSIMEarth.Math.toDegrees(pitchTemp) - 12
  ) //俯仰角，减去的值越大，越下俯
  range = 4000
  window.EarthViewer.camera.lookAt(
    center,
    new window.MSIMEarth.HeadingPitchRange(heading, pitch, range)
  )
  // 根据当前视角设置viewfrom偏移量
  let pwc = window.EarthViewer.camera.positionWC
  var entityCartographic = window.MSIMEarth.Cartographic.fromCartesian(pwc)
  let sourceLng = window.MSIMEarth.Math.toDegrees(entityCartographic.longitude)
  let sourceLat = window.MSIMEarth.Math.toDegrees(entityCartographic.latitude)
  let sourceAlt = entityCartographic.height
  var entity1Cartographic = window.MSIMEarth.Cartographic.fromCartesian(center)
  let destinateLng = window.MSIMEarth.Math.toDegrees(
    entity1Cartographic.longitude
  )
  let destinateLat = window.MSIMEarth.Math.toDegrees(
    entity1Cartographic.latitude
  )
  let destinateAlt = entity1Cartographic.height
  let xx = (sourceLng - destinateLng) * 111000
  let yy = (sourceLat - destinateLat) * 111000
  let zz = sourceAlt - destinateAlt
  // let tc = window.EarthViewer.camera.worldToCameraCoordinatesPoint(center)
  window.EarthViewer.camera.lookAtTransform(window.MSIMEarth.Matrix4.IDENTITY)
  entity.viewFrom = new window.MSIMEarth.Cartesian3(xx, yy, zz)
  window.EarthViewer.trackedEntity = entity
  // thirdSightFrame1(entity)
  // thirdSightFrame(entity)
  // sightedTarget(entity)
}

// 切换第三人称视角
export function setThirdPersonView(entity) {
  console.log('切换第三人称视角')
  // createFrustumFun(entity)
  function adjust() {
    // 获取当前模型方向和位置
    // entityB2 为模型对象
    if (!entity) return
    const orientation = entity.orientation
    const position = entity.position
    if (!orientation || !position) return
    // 获取偏向角
    let ori = orientation.getValue(window.EarthViewer.clock.currentTime)
    // 获取位置
    let center = position.getValue(window.EarthViewer.clock.currentTime)
    if (!center || !ori) return
    let curPos = worldPosToGraphic(center)
    // 1、由四元数计算三维旋转矩阵
    var mtx3 = window.MSIMEarth.Matrix3.fromQuaternion(ori)
    // 2、计算四维转换矩阵：
    var mtx4 = window.MSIMEarth.Matrix4.fromRotationTranslation(mtx3, center)
    // 3、计算角度：
    var hpr = window.MSIMEarth.Transforms.fixedFrameToHeadingPitchRoll(mtx4)
    // 获取角度（弧度）
    const headingTemp = hpr.heading
    const pitchTemp = hpr.pitch
    let heading, pitch, range
    //第三人称俯视视角
    heading = window.MSIMEarth.Math.toRadians(
      window.MSIMEarth.Math.toDegrees(headingTemp) + 90
    )
    pitch = window.MSIMEarth.Math.toRadians(
      window.MSIMEarth.Math.toDegrees(pitchTemp) - 12
    ) //俯仰角，减去的值越大，越下俯、
    // 视角高度，根据模型大小调整
    // range = 10000.0
    range = 4000
    // // 动态改变模型视角
    // window.EarthViewer.camera.lookAt(
    //   center,
    //   new window.MSIMEarth.HeadingPitchRange(heading, pitch, range)
    // )
    const speedArr = [2100, 2000, 1800, 2500, 2200, 2400]
    let speedNum =
      speedArr[
        Math.floor(Math.random() * 10) > 5 ? 0 : Math.floor(Math.random() * 10)
      ]
    store.commit('setThirdInfor', {
      // name: '',
      oil: '',
      height: curPos.height,
      pitch: (window.MSIMEarth.Math.toDegrees(pitchTemp) - 12).toFixed(15),
      speed: speedNum ? speedNum : '2500' + 'km/h'
    })
  }
  //第三人称展示效果，支持围绕目标实体旋转-+
  if (!window.MSIMEarth.defined(entity)) return
  const orientation = entity.orientation
  const position = entity.position
  if (
    !window.MSIMEarth.defined(orientation) ||
    !window.MSIMEarth.defined(position)
  )
    return
  // 获取偏向角
  let ori = orientation.getValue(window.EarthViewer.clock.currentTime)
  // 获取位置
  let center = position.getValue(window.EarthViewer.clock.currentTime)
  if (!window.MSIMEarth.defined(center) || !window.MSIMEarth.defined(ori))
    return

  window.EarthViewer.trackedEntity = entity
  //第三人称展示效果，锁定实体视角
  window.EarthViewer.clock.onTick.addEventListener(adjust)
  window.currentViewListener = adjust
}

// 切换自由视角
export function setFreeView() {
  store.commit('setViewEntityID', '')
  window.EarthViewer.camera.lookAtTransform(window.MSIMEarth.Matrix4.IDENTITY)
}

// 切换观看视角
export function setWatchView() {
  store.commit('setViewEntityID', '')
  window.EarthViewer.camera.lookAtTransform(window.MSIMEarth.Matrix4.IDENTITY)

  if (sceneName == '台海') {
    window.EarthViewer.camera.flyTo({
      destination: new window.MSIMEarth.Cartesian3(
        -3490406.4880014705,
        5573184.257218434,
        2889223.697240534
      ),
      orientation: {
        heading: 6.283185307179581,
        pitch: -1.5701233071606704,
        roll: 0
      }
    })
  } else if (sceneName == '北部') {
    window.EarthViewer.camera.flyTo({
      destination: new window.MSIMEarth.Cartesian3(
        -3273074.879420505,
        4575168.486226025,
        5238137.567983827
      ),
      orientation: {
        heading: 6.283185307179581,
        pitch: -1.5701233071606704,
        roll: 0
      }
    })
  } else {
    window.EarthViewer.camera.flyTo({
      destination: new window.MSIMEarth.Cartesian3(
        -5083834.818195025,
        8315999.717078848,
        6171539.8465625895
      ),
      orientation: {
        heading: 6.283185307179576,
        pitch: -1.5698946475655968,
        roll: 0
      }
    })
  }
}

export function resetView() {
  if (window.currentViewListener) {
    window.EarthViewer.clock.onTick.removeEventListener(
      window.currentViewListener
    )
    window.currentViewListener = null
  }
  store.commit('setShowFirstDiv', false)
  store.commit('setShowThirdDiv', false)
  window.EarthViewer.camera.lookAtTransform(window.MSIMEarth.Matrix4.IDENTITY)
  if (lastViewEntity) {
    // lastViewEntity.label._show._value = true
    lastViewEntity.show = true // 显示上个视角被隐藏的entity
    // lastViewEntity.plane = null // 清除上个目标瞄准标
    removeSightTarget(lastViewEntity.id)
    clearFrustum(lastViewEntity.id)
  }
  removeSightedFrame()
  window.EarthViewer.trackedEntity = null //取消追踪实体
}

// 第三人称瞄准框
export function thirdSightFrame(entity) {
  if (!entity) return
  function changePositions() {
    if (!entity) return
    // let toTime = new window.MSIMEarth.JulianDate()
    // window.MSIMEarth.JulianDate.addSeconds(window.EarthViewer.clock.currentTime, 30, toTime)
    let YGPosition = entity.position.getValue(
      window.EarthViewer.clock.currentTime
    )
    if (typeof YGPosition === 'undefined') return
    return YGPosition
  }
  function changeOrientation() {
    if (!entity) return
    // let toTime = window.MSIMEarth.JulianDate.addSeconds(window.EarthViewer.clock.currentTime, 3)
    let YGPosition = entity.orientation.getValue(
      window.EarthViewer.clock.currentTime
    )
    if (typeof YGPosition === 'undefined') return
    return YGPosition
  }

  window.EarthViewer.entities.add({
    id: entity.id + 'thirdSight',
    orientation: new window.MSIMEarth.CallbackProperty(
      changeOrientation,
      false
    ),
    position: new window.MSIMEarth.CallbackProperty(changePositions, false),
    plane: {
      show: true, //是否显示
      plane: new window.MSIMEarth.Plane(
        window.MSIMEarth.Cartesian3.UNIT_X,
        -700
      ),
      dimensions: new window.MSIMEarth.Cartesian2(100.0, 100.0), //二维平面
      material: new window.MSIMEarth.ImageMaterialProperty({
        image: 'static/image/billboard/飞机HUD/hud4.png',
        transparent: true
      })
    }
  })

  // let rotation = window.MSIMEarth.Math.toRadians(30)
  function getRotationValue() {
    // 确定相对于视点的旋转矩阵
    let origin = entity.position.getValue(window.EarthViewer.clock.currentTime)
    // 确定相对于视点的旋转矩阵
    let orientation = entity.orientation.getValue(
      window.EarthViewer.clock.currentTime
    )
    if (typeof origin === 'undefined' || typeof orientation === 'undefined')
      return
    var mtx3 = window.MSIMEarth.Matrix3.fromQuaternion(orientation)
    // 2、计算四维转换矩阵：
    var mtx4 = window.MSIMEarth.Matrix4.fromRotationTranslation(mtx3, origin)
    // 3、计算角度：
    let hpr = window.MSIMEarth.Transforms.fixedFrameToHeadingPitchRoll(mtx4)
    let heading = window.MSIMEarth.Math.toDegrees(hpr.heading)
    let pitch = window.MSIMEarth.Math.toDegrees(hpr.pitch)
    let roll = window.MSIMEarth.Math.toDegrees(hpr.roll)

    return roll
    // rotation += 0.005
    // return rotation
  }

  // window.EarthViewer.entities.add({
  //   id: entity.id + 'thirdSight',
  //   orientation: new window.MSIMEarth.CallbackProperty(
  //     changeOrientation,
  //     false
  //   ),
  //   position: new window.MSIMEarth.CallbackProperty(changePositions, false),
  //   ellipse: {
  //     semiMajorAxis: 200.0,
  //     semiMinorAxis: 200.0,
  //     rotation: new window.MSIMEarth.CallbackProperty(getRotationValue, false), //指定椭圆从北方逆时针旋转
  //     // stRotation: new window.MSIMEarth.CallbackProperty(
  //     //   getRotationValue,
  //     //   false
  //     // ), //指定椭圆纹理从北方逆时针旋转
  //     material: new window.MSIMEarth.ImageMaterialProperty({
  //       image: 'static/image/billboard/飞机HUD/定位3.PNG', //定位.PNG
  //       transparent: true
  //     })
  //   }
  // })
}

// 锁敌瞄准框
export function thirdSightFrame1(entity) {
  let img = 'static/billboard/省会.png'
  function changePositions() {
    if (!entity) return
    // let toTime = new window.MSIMEarth.JulianDate()
    // window.MSIMEarth.JulianDate.addSeconds(window.EarthViewer.clock.currentTime, 30, toTime)
    let YGPosition = entity.position.getValue(
      window.EarthViewer.clock.currentTime
    )

    if (typeof YGPosition === 'undefined') return
    return YGPosition
  }
  function changeOrientation() {
    if (!entity) return
    // let toTime = window.MSIMEarth.JulianDate.addSeconds(window.EarthViewer.clock.currentTime, 3)
    let YGPosition = entity.orientation.getValue(
      window.EarthViewer.clock.currentTime
    )
    if (typeof YGPosition === 'undefined') return
    return YGPosition
  }
  window.EarthViewer.entities.add({
    id: entity.id + 'thirdSight1',
    orientation: new window.MSIMEarth.CallbackProperty(
      changeOrientation,
      false
    ),
    position: new window.MSIMEarth.CallbackProperty(changePositions, false),
    plane: {
      show: true, //是否显示
      plane: new window.MSIMEarth.Plane(
        window.MSIMEarth.Cartesian3.UNIT_X,
        -500
      ), //朝向屏幕
      dimensions: new window.MSIMEarth.Cartesian2(1200, 1200), //二维平面
      // material: new window.MSIMEarth.ImageMaterialProperty({
      //   image: img,
      //   transparent: true,
      // }),//材质
      material: new window.MSIMEarth.HUD1MaterialProperty({
        time2: 0.01,
        mixColor: window.MSIMEarth.Color.RED,
        mixRatio: 0.9,
        transparent: true
      }) //材质
    }
    // plane: new window.MSIMEarth.CallbackProperty(changeNormal, false),
  })
}

export function removeAllFrustumFun() {
  for (let ii = frustumObjectArray.length - 1; ii >= 0; ii--) {
    let frustum = frustumObjectArray[ii]
    window.EarthViewer.scene.postRender.removeEventListener(
      frustum.eventListener
    )
    frustum.frustum.clear()
    // frustumObjectArray.splice(frustumIndex, 1)
  }
  frustumObjectArray = []
  for (let j = radarPenetratingArray.length - 1; j >= 0; j--) {
    let frustum = radarPenetratingArray[j]
    window.EarthViewer.scene.postRender.removeEventListener(
      frustum.eventListener
    )
    frustum.frustum.clear()
    // radarPenetratingArray.splice(frustumIndex, 1)
  }
  radarPenetratingArray = []
}

/**
 * 创建 飞机干扰视锥
 * @param {*} type
 * @param {*} id
 * @param {*} color
 * @param {*} yaw 偏航
 * @param {*} pitch 俯仰
 * @param {*} rollpa 翻滚
 * @param {*} far 长度 m范围
 * @returns
 */
export function createReJamSFrustumFun(
  type,
  id,
  color,
  yawPa,
  pitchPa,
  rollpa,
  far
) {
  let entity = window.EarthPlugn.entity._GetCZMLEntity(
    id,
    'MSIMEarthCZMLProcessContainer'
  )
  if (
    !window.MSIMEarth.defined(entity) ||
    !window.MSIMEarth.defined(entity.position)
  ) {
    return
  }
  if (!window.MSIMEarth.defined(entity.orientation)) return
  let frustumIndex = frustumObjectArray.findIndex(
    (item) => item.id == type + id + 'detect'
  )
  if (frustumIndex > -1) {
    return
  }
  // 确定相对于视点的旋转矩阵
  let origin = entity.position.getValue(window.EarthViewer.clock.currentTime)
  // 阵营
  // let side = entity.properties.airplaneAction._value.side
  let outlineColor = color || [200, 220, 230]
  // let enu = window.MSIMEarth.Transforms.eastNorthUpToFixedFrame(origin);
  // let rotation = window.MSIMEarth.Matrix3.getRotation(enu, new window.MSIMEarth.Matrix3());
  // let orientation = window.MSIMEarth.Quaternion.fromRotationMatrix(rotation);
  let orientation = entity.orientation.getValue(
    window.EarthViewer.clock.currentTime
  )
  if (
    window.MSIMEarth.defined(origin) &&
    window.MSIMEarth.defined(orientation)
  ) {
    let aspectRatio = 0,
      fov = 0,
      near = 0
    if (window.EarthViewer.scene.mode == 3) {
      aspectRatio = 1.5
      fov = 40
      near = 300
    } else {
      aspectRatio = 0.65
      fov = 10
      near = 70
    }
    // 创建视锥体
    let createFrustum = new CreateViewFrustum({
      viewer: window.EarthViewer,
      Cesium: window.MSIMEarth,
      position: origin,
      orientation: orientation,
      outlineColor: outlineColor,
      fov: fov * 0.7,
      near: near,
      // near: 50,
      far: far * 0.7, //100000,
      aspectRatio: aspectRatio * 0.3,
      sceneModeFlag: window.EarthViewer.scene.mode
    })

    var updateFrustum = function () {
      let origin = entity.position.getValue(
        window.EarthViewer.clock.currentTime
      )
      let orientation = entity.orientation.getValue(
        window.EarthViewer.clock.currentTime
      )
      if (
        !window.MSIMEarth.defined(orientation) ||
        !window.MSIMEarth.defined(origin)
      )
        return
      if (origin && orientation) {
        // window.createFrustum.update(origin, orientation)

        var mtx3 = window.MSIMEarth.Matrix3.fromQuaternion(orientation)
        // 2、计算四维转换矩阵：
        var mtx4 = window.MSIMEarth.Matrix4.fromRotationTranslation(
          mtx3,
          origin
        )
        // 3、计算角度：
        let hpr = window.MSIMEarth.Transforms.fixedFrameToHeadingPitchRoll(mtx4)
        let heading = window.MSIMEarth.Math.toDegrees(hpr.heading)
        let pitch = window.MSIMEarth.Math.toDegrees(hpr.pitch)
        let roll = window.MSIMEarth.Math.toDegrees(hpr.roll)
        //临时设置设定固定值， 干扰机配合雷达包络显示，可以直接探测到
        // let tempHeading = window.MSIMEarth.Math.toRadians(
        //   heading
        // )
        let tempHeading = 0
        if (entity.properties._airplaneAction._value.side == 'blue') {
          // tempHeading = window.MSIMEarth.Math.toRadians(0) // 想定-宫古控制区制权
          tempHeading = window.MSIMEarth.Math.toRadians(160) // 宫古控制区
        } else {
          // tempHeading = window.MSIMEarth.Math.toRadians(160) // 想定-宫古控制区制权
          tempHeading = window.MSIMEarth.Math.toRadians(0) // 宫古控制区
        }
        let tempHeading1 = window.MSIMEarth.Math.toRadians(heading + 90 + yawPa)
        // let tempHeading1 = window.MSIMEarth.Math.toRadians(heading + 90)
        // let tempPitch = window.MSIMEarth.Math.toRadians(pitch - 90)
        // let tempPitch = window.MSIMEarth.Math.toRadians(pitch - 180)
        let tempPitch = window.MSIMEarth.Math.toRadians(pitch - 120 + pitchPa)
        let tempPitch1 = window.MSIMEarth.Math.toRadians(pitch)
        // let roll = window.MSIMEarth.Math.toDegrees(hpr.roll)
        let tempRoll = window.MSIMEarth.Math.toRadians(roll + rollpa)
        // const hpr1 = new window.MSIMEarth.HeadingPitchRoll(tempHeading, tempPitch, hpr.roll) //heading,pitch,roll以0.1单位调整
        const hpr1 = new window.MSIMEarth.HeadingPitchRoll(
          tempHeading,
          tempPitch,
          tempRoll
        ) //heading,pitch,roll以0.1单位调整
        const orientation1 =
          window.MSIMEarth.Transforms.headingPitchRollQuaternion(origin, hpr1)
        if (
          window.MSIMEarth.defined(origin) &&
          window.MSIMEarth.defined(orientation1) &&
          window.MSIMEarth.defined(tempHeading1) &&
          window.MSIMEarth.defined(tempPitch1) &&
          window.MSIMEarth.defined(hpr.roll)
        ) {
          //临时设置设定固定值， 干扰机配合雷达包络显示，可以直接探测到
          createFrustum.orientation = orientation1
          createFrustum.update(
            origin,
            orientation1,
            tempHeading1,
            tempPitch1,
            hpr.roll
          )
        }
        // checkCatchedEntity(createFrustum.lightCamera)
      }
    }
    window.EarthViewer.scene.postRender.addEventListener(updateFrustum)
    window.EarthViewer.scene.globe.depthTestAgainstTerrain = true
    // frustumObject = {
    //   frustum: createFrustum,
    //   eventListener: updateFrustum
    // }
    frustumObjectArray.push({
      id: type + id + 'detect',
      frustum: createFrustum,
      eventListener: updateFrustum
    })
    return createFrustum
  }
}

//创建侦察视锥
export function createDetectFrustumFun(id, rollpa) {
  let entity = window.EarthPlugn.entity._GetCZMLEntity(
    id,
    'MSIMEarthCZMLProcessContainer'
  )
  if (
    !window.MSIMEarth.defined(entity) ||
    !window.MSIMEarth.defined(entity.position)
  )
    return
  if (!window.MSIMEarth.defined(entity.orientation)) return
  let origin = entity.position.getValue(window.EarthViewer.clock.currentTime)
  // 确定相对于视点的旋转矩阵
  let side = entity.properties.airplaneAction._value.side
  let outlineColor = [200, 220, 230]
  // let enu = window.MSIMEarth.Transforms.eastNorthUpToFixedFrame(origin);
  // let rotation = window.MSIMEarth.Matrix3.getRotation(enu, new window.MSIMEarth.Matrix3());
  // let orientation = window.MSIMEarth.Quaternion.fromRotationMatrix(rotation);
  let orientation = entity.orientation.getValue(
    window.EarthViewer.clock.currentTime
  )
  if (
    !window.MSIMEarth.defined(orientation) ||
    !window.MSIMEarth.defined(origin)
  )
    return
  if (
    window.MSIMEarth.defined(origin) &&
    window.MSIMEarth.defined(orientation)
  ) {
    // 创建视锥体
    let createFrustum = new CreateViewFrustum({
      viewer: window.EarthViewer,
      Cesium: window.MSIMEarth,
      position: origin,
      orientation: orientation,
      outlineColor: outlineColor,
      fov: 20,
      near: 300,
      // near: 50,
      far: 100000,
      aspectRatio: 700 / 100
    })

    var updateFrustum = function () {
      let origin = entity.position.getValue(
        window.EarthViewer.clock.currentTime
      )
      let orientation = entity.orientation.getValue(
        window.EarthViewer.clock.currentTime
      )
      if (
        window.MSIMEarth.defined(origin) &&
        window.MSIMEarth.defined(orientation)
      ) {
        // window.createFrustum.update(origin, orientation)

        var mtx3 = window.MSIMEarth.Matrix3.fromQuaternion(orientation)
        // 2、计算四维转换矩阵：
        var mtx4 = window.MSIMEarth.Matrix4.fromRotationTranslation(
          mtx3,
          origin
        )
        // 3、计算角度：
        let hpr = window.MSIMEarth.Transforms.fixedFrameToHeadingPitchRoll(mtx4)
        let heading = window.MSIMEarth.Math.toDegrees(hpr.heading)
        let pitch = window.MSIMEarth.Math.toDegrees(hpr.pitch)
        let roll = window.MSIMEarth.Math.toDegrees(hpr.roll)
        // let tempHeading = window.MSIMEarth.Math.toRadians(
        //   heading
        // )
        let tempHeading = window.MSIMEarth.Math.toRadians(heading)
        let tempHeading1 = window.MSIMEarth.Math.toRadians(heading + 90)
        // let tempPitch = window.MSIMEarth.Math.toRadians(pitch - 90)
        let tempPitch = window.MSIMEarth.Math.toRadians(pitch - 180)
        let tempPitch1 = window.MSIMEarth.Math.toRadians(pitch)
        // let roll = window.MSIMEarth.Math.toDegrees(hpr.roll)
        let tempRoll = window.MSIMEarth.Math.toRadians(roll + rollpa)
        // const hpr1 = new window.MSIMEarth.HeadingPitchRoll(tempHeading, tempPitch, hpr.roll) //heading,pitch,roll以0.1单位调整
        const hpr1 = new window.MSIMEarth.HeadingPitchRoll(
          tempHeading,
          tempPitch,
          tempRoll
        ) //heading,pitch,roll以0.1单位调整
        const orientation1 =
          window.MSIMEarth.Transforms.headingPitchRollQuaternion(origin, hpr1)
        if (
          window.MSIMEarth.defined(origin) &&
          window.MSIMEarth.defined(orientation1) &&
          window.MSIMEarth.defined(tempHeading1) &&
          window.MSIMEarth.defined(tempPitch1) &&
          window.MSIMEarth.defined(hpr.roll)
        ) {
          createFrustum.update(
            origin,
            orientation1,
            tempHeading1,
            tempPitch1,
            hpr.roll
          )
        }
        // checkCatchedEntity(createFrustum.lightCamera)
      }
    }
    window.EarthViewer.scene.postRender.addEventListener(updateFrustum)
    window.EarthViewer.scene.globe.depthTestAgainstTerrain = true
    // frustumObject = {
    //   frustum: createFrustum,
    //   eventListener: updateFrustum
    // }
    frustumObjectArray.push({
      id: id + 'detect',
      frustum: createFrustum,
      eventListener: updateFrustum
    })
    return createFrustum
  }
}

//创建无人侦察视锥
export function createNoManDetectFrustumFun(id) {
  let entity = window.EarthPlugn.entity._GetCZMLEntity(
    id,
    'MSIMEarthCZMLProcessContainer'
  )
  if (
    !window.MSIMEarth.defined(entity) ||
    !window.MSIMEarth.defined(entity.position)
  )
    return
  if (!entity || !entity.position) return
  if (!window.MSIMEarth.defined(entity.orientation)) return
  let origin = entity.position.getValue(window.EarthViewer.clock.currentTime)
  // 确定相对于视点的旋转矩阵
  let side = entity.properties.airplaneAction._value.side
  let outlineColor = [200, 220, 230]
  // let enu = window.MSIMEarth.Transforms.eastNorthUpToFixedFrame(origin);
  // let rotation = window.MSIMEarth.Matrix3.getRotation(enu, new window.MSIMEarth.Matrix3());
  // let orientation = window.MSIMEarth.Quaternion.fromRotationMatrix(rotation);
  let orientation = entity.orientation.getValue(
    window.EarthViewer.clock.currentTime
  )
  var mtx3 = window.MSIMEarth.Matrix3.fromQuaternion(orientation)
  // 2、计算四维转换矩阵：
  var mtx4 = window.MSIMEarth.Matrix4.fromRotationTranslation(mtx3, origin)
  // 3、计算角度：
  let hpr = window.MSIMEarth.Transforms.fixedFrameToHeadingPitchRoll(mtx4)
  let heading = window.MSIMEarth.Math.toDegrees(hpr.heading)
  let pitch = window.MSIMEarth.Math.toDegrees(hpr.pitch)
  let roll = window.MSIMEarth.Math.toDegrees(hpr.roll)
  let tempHeading = window.MSIMEarth.Math.toRadians(heading)
  let tempPitch = window.MSIMEarth.Math.toRadians(pitch - 180)
  let tempRoll = window.MSIMEarth.Math.toRadians(roll)
  const hpr1 = new window.MSIMEarth.HeadingPitchRoll(
    tempHeading,
    tempPitch,
    tempRoll
  ) //heading,pitch,roll以0.1单位调整
  const orientation1 = window.MSIMEarth.Transforms.headingPitchRollQuaternion(
    origin,
    hpr1
  )
  if (
    window.MSIMEarth.defined(origin) &&
    window.MSIMEarth.defined(orientation)
  ) {
    // 创建视锥体
    let createFrustum = new CreateViewFrustum({
      viewer: window.EarthViewer,
      Cesium: window.MSIMEarth,
      position: origin,
      orientation: orientation1,
      outlineColor: outlineColor,
      fov: 60,
      near: 300,
      // near: 50,
      far: 100000,
      aspectRatio: 30 / 100
    })

    var updateFrustum = function () {
      let origin = entity.position.getValue(
        window.EarthViewer.clock.currentTime
      )
      let orientation = entity.orientation.getValue(
        window.EarthViewer.clock.currentTime
      )
      if (
        !window.MSIMEarth.defined(orientation) ||
        !window.MSIMEarth.defined(origin)
      )
        return
      if (origin && orientation) {
        // window.createFrustum.update(origin, orientation)

        var mtx3 = window.MSIMEarth.Matrix3.fromQuaternion(orientation)
        // 2、计算四维转换矩阵：
        var mtx4 = window.MSIMEarth.Matrix4.fromRotationTranslation(
          mtx3,
          origin
        )
        // 3、计算角度：
        let hpr = window.MSIMEarth.Transforms.fixedFrameToHeadingPitchRoll(mtx4)
        let heading = window.MSIMEarth.Math.toDegrees(hpr.heading)
        let pitch = window.MSIMEarth.Math.toDegrees(hpr.pitch)
        let roll = window.MSIMEarth.Math.toDegrees(hpr.roll)
        // let tempHeading = window.MSIMEarth.Math.toRadians(
        //   heading
        // )
        let tempHeading = window.MSIMEarth.Math.toRadians(heading)
        let tempHeading1 = window.MSIMEarth.Math.toRadians(heading + 90)
        // let tempPitch = window.MSIMEarth.Math.toRadians(pitch - 90)
        let tempPitch = window.MSIMEarth.Math.toRadians(pitch - 180)
        let tempPitch1 = window.MSIMEarth.Math.toRadians(pitch)
        // let roll = window.MSIMEarth.Math.toDegrees(hpr.roll)
        let tempRoll = window.MSIMEarth.Math.toRadians(roll)
        // const hpr1 = new window.MSIMEarth.HeadingPitchRoll(tempHeading, tempPitch, hpr.roll) //heading,pitch,roll以0.1单位调整
        const hpr1 = new window.MSIMEarth.HeadingPitchRoll(
          tempHeading,
          tempPitch,
          tempRoll
        ) //heading,pitch,roll以0.1单位调整
        const orientation1 =
          window.MSIMEarth.Transforms.headingPitchRollQuaternion(origin, hpr1)
        if (
          window.MSIMEarth.defined(origin) &&
          window.MSIMEarth.defined(orientation1) &&
          window.MSIMEarth.defined(tempHeading1) &&
          window.MSIMEarth.defined(tempPitch1) &&
          window.MSIMEarth.defined(hpr.roll)
        ) {
          createFrustum.update(
            origin,
            orientation1,
            tempHeading1,
            tempPitch1,
            hpr.roll
          )
        }
        // checkCatchedEntity(createFrustum.lightCamera)
      }
    }
    window.EarthViewer.scene.postRender.addEventListener(updateFrustum)
    window.EarthViewer.scene.globe.depthTestAgainstTerrain = true
    // frustumObject = {
    //   frustum: createFrustum,
    //   eventListener: updateFrustum
    // }
    frustumObjectArray.push({
      id: id + 'detect',
      frustum: createFrustum,
      eventListener: updateFrustum
    })
    return createFrustum
  }
}

// 删除侦察视锥
export function removeDetectFrustum(id) {
  // window.EarthViewer.scene.globe.depthTestAgainstTerrain = false
  let frustumIndex = frustumObjectArray.findIndex(
    (item) => item.id == id + 'detect'
  )
  // console.log(frustumIndex, frustumObjectArray[frustumIndex]);
  if (frustumIndex > -1) {
    let frustum = frustumObjectArray[frustumIndex]
    window.EarthViewer.scene.postRender.removeEventListener(
      frustum.eventListener
    )
    frustum.frustum.clear()
    frustumObjectArray.splice(frustumIndex, 1)
    // configChecked(state2.clickNode) // 选项卡刷新勾选状态
  }
}

//创建视椎体
export function createFrustumFun(czmlname) {
  // let sourceSource = window.EarthViewer.dataSources.getByName(czmlname)
  // if (sourceSource.length == 0) return
  // let entity = sourceSource[0].entities.values[0]
  const entityMethod = new window.EarthPlugn.entity({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  let entity = entityMethod.getCZMLEntity(
    czmlname,
    'MSIMEarthCZMLProcessContainer'
  )
  if (
    !window.MSIMEarth.defined(entity) ||
    !window.MSIMEarth.defined(entity.position)
  )
    return
  if (!window.MSIMEarth.defined(entity.orientation)) return
  let origin = entity.position.getValue(window.EarthViewer.clock.currentTime)
  // 确定相对于视点的旋转矩阵
  let side = entity.properties.airplaneAction._value.side
  // let enu = window.MSIMEarth.Transforms.eastNorthUpToFixedFrame(origin);
  // let rotation = window.MSIMEarth.Matrix3.getRotation(enu, new window.MSIMEarth.Matrix3());
  // let orientation = window.MSIMEarth.Quaternion.fromRotationMatrix(rotation);
  let orientation = entity.orientation.getValue(
    window.EarthViewer.clock.currentTime
  )
  if (
    !window.MSIMEarth.defined(orientation) ||
    !window.MSIMEarth.defined(origin)
  )
    return
  if (origin && orientation) {
    //判断受到天气区域干扰，感知范围缩短
    let currentConfig = store.state.sceneModule.planeAreaConfig[czmlname]
    let farDis =
      currentConfig && currentConfig.range ? currentConfig.range : null
    if (!farDis) return
    //let outlineColor = side == 'blue' ? [37, 209, 255] : [255, 0, 0]
    let outlineColor = currentConfig.color
      ? currentConfig.color
      : side == 'blue'
      ? [37, 209, 255]
      : [255, 0, 0]
    // 创建视锥体
    let createFrustum = new CreateViewFrustum({
      viewer: window.EarthViewer,
      Cesium: window.MSIMEarth,
      position: new MSIMEarth.Cartesian3(),
      orientation: orientation,
      outlineColor: outlineColor,
      fov: 30,
      near: 300,
      // near: 50,
      far: farDis,
      aspectRatio: 100 / 100
    })
    setTimeout(() => {
      createFrustum.position = origin
    }, 400)
    var updateFrustum = function () {
      if (!window.MSIMEarth.defined(entity.position)) return
      if (!window.MSIMEarth.defined(entity.orientation)) return
      let origin = entity.position.getValue(
        window.EarthViewer.clock.currentTime
      )
      let orientation = entity.orientation.getValue(
        window.EarthViewer.clock.currentTime
      )
      if (
        !window.MSIMEarth.defined(origin) ||
        !window.MSIMEarth.defined(orientation)
      )
        return
      if (origin && orientation) {
        // window.createFrustum.update(origin, orientation)

        var mtx3 = window.MSIMEarth.Matrix3.fromQuaternion(orientation)
        // 2、计算四维转换矩阵：
        var mtx4 = window.MSIMEarth.Matrix4.fromRotationTranslation(
          mtx3,
          origin
        )
        // 3、计算角度：
        let hpr = window.MSIMEarth.Transforms.fixedFrameToHeadingPitchRoll(mtx4)
        let heading = window.MSIMEarth.Math.toDegrees(hpr.heading)
        let pitch = window.MSIMEarth.Math.toDegrees(hpr.pitch)
        //临时设置设定固定值， 干扰机配合雷达包络显示，可以直接探测到
        //let tempHeading = window.MSIMEarth.Math.toRadians(heading)
        let tempHeading = window.MSIMEarth.Math.toRadians(145)
        let tempHeading1 = window.MSIMEarth.Math.toRadians(heading + 90)
        let tempPitch = window.MSIMEarth.Math.toRadians(pitch - 90)
        let tempPitch1 = window.MSIMEarth.Math.toRadians(pitch)
        let roll = window.MSIMEarth.Math.toDegrees(hpr.roll)
        const hpr1 = new window.MSIMEarth.HeadingPitchRoll(
          tempHeading,
          tempPitch,
          hpr.roll
        ) //heading,pitch,roll以0.1单位调整
        const orientation1 =
          window.MSIMEarth.Transforms.headingPitchRollQuaternion(origin, hpr1)
        //临时设置设定固定值， 干扰机配合雷达包络显示，可以直接探测到
        createFrustum.orientation = orientation1
        if (
          window.MSIMEarth.defined(origin) &&
          window.MSIMEarth.defined(orientation1) &&
          window.MSIMEarth.defined(tempHeading1) &&
          window.MSIMEarth.defined(tempPitch1) &&
          window.MSIMEarth.defined(hpr.roll)
        ) {
          createFrustum.update(
            origin,
            orientation1,
            tempHeading1,
            tempPitch1,
            hpr.roll
          )
        }
        checkCatchedEntity(createFrustum.lightCamera)
      }
    }
    window.EarthViewer.scene.postRender.addEventListener(updateFrustum)
    // frustumObject = {
    //   frustum: createFrustum,
    //   eventListener: updateFrustum
    // }
    frustumObjectArray.push({
      id: czmlname,
      frustum: createFrustum,
      eventListener: updateFrustum
    })
    return createFrustum
  }
}
//创建视椎体,跟踪动态目标
export function createFrustumFun2(targetId, sourceId) {
  let entity = window.EarthPlugn.entity._GetCZMLEntity(
    targetId,
    'MSIMEarthCZMLProcessContainer'
  )
  let mbentity = window.EarthPlugn.entity._GetCZMLEntity(
    sourceId,
    'MSIMEarthCZMLProcessContainer'
  )
  if (
    !window.MSIMEarth.defined(entity) ||
    !window.MSIMEarth.defined(entity.position) ||
    !window.MSIMEarth.defined(mbentity) ||
    !window.MSIMEarth.defined(mbentity.position)
  )
    return
  if (!entity || !entity || !mbentity || !mbentity.position) return
  // 确定相对于视点的旋转矩阵
  let origin = entity.position.getValue(window.EarthViewer.clock.currentTime)
  // 确定相对于视点的旋转矩阵
  let side = entity.properties.airplaneAction._value.side
  let outlineColor = [200, 220, 230]
  // let enu = window.MSIMEarth.Transforms.eastNorthUpToFixedFrame(origin);
  // let rotation = window.MSIMEarth.Matrix3.getRotation(enu, new window.MSIMEarth.Matrix3());
  // let orientation = window.MSIMEarth.Quaternion.fromRotationMatrix(rotation);
  let orientation = entity.orientation.getValue(
    window.EarthViewer.clock.currentTime
  )
  var mtx3 = window.MSIMEarth.Matrix3.fromQuaternion(orientation)
  // 2、计算四维转换矩阵：
  var mtx4 = window.MSIMEarth.Matrix4.fromRotationTranslation(mtx3, origin)
  // 3、计算角度：
  let hpr = window.MSIMEarth.Transforms.fixedFrameToHeadingPitchRoll(mtx4)
  let heading = window.MSIMEarth.Math.toDegrees(hpr.heading)
  let pitch = window.MSIMEarth.Math.toDegrees(hpr.pitch)
  let roll = window.MSIMEarth.Math.toDegrees(hpr.roll)
  let tempHeading = window.MSIMEarth.Math.toRadians(heading)
  let tempPitch = window.MSIMEarth.Math.toRadians(pitch - 180 + 20)
  let tempRoll = window.MSIMEarth.Math.toRadians(roll)
  const hpr1 = new window.MSIMEarth.HeadingPitchRoll(
    tempHeading,
    tempPitch,
    tempRoll
  ) //heading,pitch,roll以0.1单位调整
  const orientation1 = window.MSIMEarth.Transforms.headingPitchRollQuaternion(
    origin,
    hpr1
  )

  if (
    window.MSIMEarth.defined(origin) &&
    window.MSIMEarth.defined(orientation)
  ) {
    //判断受到天气区域干扰，感知范围缩短
    let currentConfig = store.state.sceneModule.planeAreaConfig[targetId]
    let farDis =
      currentConfig && currentConfig.range ? currentConfig.range : 300000
    if (!farDis) return
    let outlineColor = [255, 0, 0]
    // let outlineColor = currentConfig && currentConfig.color
    //   ? currentConfig.color
    //   : side == 'blue'
    //     ? [37, 209, 255]
    //     : [255, 0, 0]
    // 创建视锥体
    let createFrustum = new CreateViewFrustum({
      viewer: window.EarthViewer,
      Cesium: window.MSIMEarth,
      position: new MSIMEarth.Cartesian3(),
      orientation: orientation,
      outlineColor: outlineColor,
      fov: 30,
      near: 300,
      // near: 50,
      far: farDis + 120000,
      aspectRatio: 100 / 100
    })
    setTimeout(() => {
      createFrustum.position = origin
    }, 400)

    var updateFrustum = function () {
      let entity1 = window.EarthPlugn.entity._GetCZMLEntity(
        targetId,
        'MSIMEarthCZMLProcessContainer'
      )
      let mbentity1 = window.EarthPlugn.entity._GetCZMLEntity(
        sourceId,
        'MSIMEarthCZMLProcessContainer'
      )
      if (
        !window.MSIMEarth.defined(entity1) ||
        !window.MSIMEarth.defined(entity1.position) ||
        !window.MSIMEarth.defined(mbentity1) ||
        !window.MSIMEarth.defined(mbentity1.position)
      )
        return
      let curPosition = entity1.position.getValue(
        window.EarthViewer.clock.currentTime
      )
      let fPosition = mbentity1.position.getValue(
        window.EarthViewer.clock.currentTime
      )
      if (!curPosition || !fPosition) return
      let reQ = createOrientationFromPoints(curPosition, fPosition)
      createFrustum.orientation = reQ
      createFrustum.update(curPosition, reQ)
    }
    window.EarthViewer.scene.postRender.addEventListener(updateFrustum)
    window.EarthViewer.scene.globe.depthTestAgainstTerrain = true
    // frustumObjectArray.push({
    //   id: id + 'detect',
    //   frustum: createFrustum,
    //   eventListener: updateFrustum
    // })
    return createFrustum
  }
}
// 检查视锥中被探测实体，套上锁定框
export function checkCatchedEntity(camera) {
  if (!camera) return
  // const allds = window.EarthViewer.dataSources._dataSources.concat(window.EarthViewer.entities.values)
  const allds = window.EarthViewer.dataSources._dataSources
  for (let index = 0; index < allds.length; index++) {
    const element = allds[index]
    let entity = element.entities ? element.entities.values[0] : element
    if (!entity || !entity.position) continue
    // let side = entity.properties.airplaneAction._value.side
    // if (side !== 'blue') return
    // let YGPosition = entity.position.getValue(window.EarthViewer.clock.currentTime)
    let YGPosition = entity.position._value
      ? entity.position._value
      : entity.position.getValue(window.EarthViewer.clock.currentTime)
    if (!YGPosition) continue
    let bs = new window.MSIMEarth.BoundingSphere(YGPosition, 100)
    // let camera = frustum.lightCamera

    const cullingVolume = camera.frustum.computeCullingVolume(
      camera.positionWC,
      camera.directionWC,
      camera.upWC
    )
    const intersect = cullingVolume.computeVisibility(bs)
    if (intersect !== -1) {
      // console.log('里', intersect);
      sightedTarget(entity)
    } else {
      window.EarthViewer.entities.removeById(entity.id + 'sightedTarget')
    }
  }
}

//清除视椎体
export function clearFrustum(id) {
  let frustumIndex = frustumObjectArray.findIndex((item) => item.id == id)
  // console.log(frustumIndex, frustumObjectArray[frustumIndex]);
  if (frustumIndex > -1) {
    let frustum = frustumObjectArray[frustumIndex]
    window.EarthViewer.scene.postRender.removeEventListener(
      frustum.eventListener
    )
    frustum.frustum.clear()
    frustumObjectArray.splice(frustumIndex, 1)
    // configChecked(state2.clickNode) // 选项卡刷新勾选状态
  }
}

// 被瞄准目标框
function sightedTarget(entity) {
  let existSight = window.EarthViewer.entities.getById(
    entity.id + 'sightedTarget'
  )
  if (existSight) return
  function changePositions() {
    if (!entity) return
    // let toTime = new window.MSIMEarth.JulianDate()
    // window.MSIMEarth.JulianDate.addSeconds(window.EarthViewer.clock.currentTime, 30, toTime)
    let YGPosition = entity.position.getValue(
      window.EarthViewer.clock.currentTime
    )
    if (typeof YGPosition === 'undefined') return
    return YGPosition
  }
  window.EarthViewer.entities.add({
    id: entity.id + 'sightedTarget',
    // orientation: new window.MSIMEarth.CallbackProperty(changeOrientation, false),
    position: new window.MSIMEarth.CallbackProperty(changePositions, false),
    billboard: {
      show: new window.MSIMEarth.CallbackProperty(changeShow(), false),
      // scale: 0.5,
      image: 'static/image/billboard/飞机HUD/rectangle.png',
      scaleByDistance: new window.MSIMEarth.NearFarScalar(1000, 4.0, 100000, 1)
    }
    // plane: new window.MSIMEarth.CallbackProperty(changeNormal, false),
  })
  // entity.billboard = billboard1
}

// 清除瞄准框
export function removeSightTarget(id) {
  window.EarthViewer.entities.removeById(id + 'thirdSight')
  window.EarthViewer.entities.removeById(id + 'thirdSight1')
  // const allds = window.EarthViewer.entities.values
  // allds.map(item => {
  //   if (item.id.includes('sightedTarget')) {
  //     window.EarthViewer.entities.removeById(item.id)
  //   }
  // })
  // window.EarthViewer.entities.removeById(entity.id + 'sightedTarget')
}

// 清除被瞄准框
export function removeSightedFrame() {
  const allds = window.EarthViewer.entities.values
  for (let index = 0; index < allds.length; index++) {
    const element = allds[index]
    if (element.id.includes('sightedTarget')) {
      window.EarthViewer.entities.removeById(element.id)
      index--
    }
  }
}

// 闪烁
function changeShow() {
  let number = 1
  let flag = true

  const show1 = () => {
    if (flag) {
      number -= 0.06
      if (number <= 0) {
        flag = false
      }
    } else {
      number += 0.06
      if (number >= 1) {
        flag = true
      }
    }
    return number >= 0.5
  }
  return show1
}
//创建探测雷达扫描
export function createRadarPenetrating(czmlname) {
  // let sourceSource = window.EarthViewer.dataSources.getByName(czmlname)
  // if (sourceSource.length == 0) return
  // let entity = sourceSource[0].entities.values[0]
  const entityMethod = new window.EarthPlugn.entity({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  let entity = entityMethod.getCZMLEntity(
    czmlname,
    'MSIMEarthCZMLProcessContainer'
  )
  if (!entity || !entity.position) return
  let origin = entity.position.getValue(window.EarthViewer.clock.currentTime)
  let side = entity.properties.airplaneAction._value.side

  if (origin) {
    //判断受到天气区域干扰，感知范围缩短
    let centerPos = worldPosToGraphic(origin)
    let currentConfig = store.state.sceneModule.planeAreaConfig[czmlname]
    let farDis =
      currentConfig && currentConfig.range ? currentConfig.range / 2 : null
    if (!farDis) return
    let color = currentConfig.color
    let changePositions = function () {
      if (!entity) return
      let YGPosition = entity.position.getValue(
        window.EarthViewer.clock.currentTime
      )

      if (!window.MSIMEarth.defined(YGPosition)) return
      return YGPosition
    }
    let radarPenetrating = window.EarthViewer.entities.add({
      position: new window.MSIMEarth.CallbackProperty(changePositions, false),
      name: czmlname + '-ellipse',
      id: czmlname + '-ellipse',
      ellipse: {
        semiMinorAxis: farDis,
        semiMajorAxis: farDis,
        material: new window.MSIMEarth.MRaderMaterialProperty({
          repeat: new window.MSIMEarth.Cartesian2(8.0, 8.0),
          color: new window.MSIMEarth.Color(
            color[0] / 255,
            color[1] / 255,
            color[2] / 255,
            1.0
          ), //0.0, 1.0, 0.7,
          speed: -240.0,
          degree: 5.0,
          flicker: false,
          transparent: true
        }),
        height: centerPos.height
      }
    })
    radarPenetratingArray.push({
      id: czmlname,
      frustum: radarPenetrating
    })
    return radarPenetrating
  }
}
//清除雷达扫描圆
export function clearRadarPenetrating(id) {
  let frustumIndex = radarPenetratingArray.findIndex((item) => item.id == id)
  if (frustumIndex > -1) {
    if (window.EarthViewer.entities.getById(id + '-ellipse')) {
      window.EarthViewer.entities.removeById(id + '-ellipse')
      radarPenetratingArray.splice(frustumIndex, 1)
    }
  }
}

//视角范围内的实体显示，其他隐藏
export function entityShowByViewExtend() {
  let extent = getCameraExtendPos()
  let polygon = window.turf.polygon([
    [
      [extent.xmin, extent.ymin],
      [extent.xmax, extent.ymin],
      [extent.xmax, extent.ymax],
      [extent.xmin, extent.ymax],
      [extent.xmin, extent.ymin]
    ]
  ])
  let czmlDatasource = window.EarthViewer.dataSources._dataSources.find(
    (item) => {
      if (
        typeof item.processName !== 'undefined' &&
        item.processName === 'MSIMEarthCZMLProcessContainer'
      ) {
        return item
      }
    }
  )
  if (
    !czmlDatasource ||
    !czmlDatasource.entities ||
    !czmlDatasource.entities._entities
  )
    return
  let entityArr = czmlDatasource.entities._entities._array
  for (let x = 0; x < entityArr.length; x++) {
    let curPos = getEntityPos(entityArr[x])
    if (!window.MSIMEarth.defined(curPos)) continue
    let point = window.turf.point([curPos.lng, curPos.lat])
    let isContains = window.turf.booleanContains(polygon, point)
    if (isContains) {
      entityArr[x].show = true
    } else {
      entityArr[x].show = false
    }
  }
}
//获取实体的当前位置
function getEntityPos(entity) {
  if (!window.MSIMEarth.defined(entity)) return
  let pos = entity.position.getValue(window.EarthViewer.clock.currentTime)
  if (!window.MSIMEarth.defined(pos)) return
  let cartographic = MSIMEarth.Cartographic.fromCartesian(pos)
  let lng = window.MSIMEarth.Math.toDegrees(cartographic.longitude)
  let lat = window.MSIMEarth.Math.toDegrees(cartographic.latitude)
  return { lng: lng, lat: lat }
}
//设置2D模式下相机视角超过边界的限制,解决超出范围显示黑边问题
export function limitCameraView2D() {
  // 监听PostRender事件
  window.EarthViewer.scene.postRender.addEventListener(function () {
    var camera = window.EarthViewer.scene.camera
    var position = camera.position
    let extend = window.getCameraExtendPos()
    let y = position.y
    // 当在2D模式下时
    if (window.EarthViewer.scene.mode === MSIMEarth.SceneMode.SCENE2D) {
      let ymin = extend.ymin
      let ymax = extend.ymax
      if (ymax > camearBoundary2D.maxLat) {
        y = camearBoundary2D.maxLatCartesian3
      }
      if (ymin < camearBoundary2D.minLat || ymin == undefined) {
        y = camearBoundary2D.minLatCartesian3
      }
      // 设置新的相机位置
      camera.position = new MSIMEarth.Cartesian3(position.x, y, position.z)
    }
  })
}
function createOrientationFromPoints(pointA, pointB) {
  // let pointA = Cesium.Cartesian3.fromDegrees(110, 30, 100)
  // let pointB = Cesium.Cartesian3.fromDegrees(120, 40, 10000)

  let m = getModelMatrix(pointA, pointB)
  let hpr = getHeadingPitchRoll(m)
  hpr.pitch = hpr.pitch + 3.14 / 2 + 3.14
  hpr.roll = 0
  let orientation = window.MSIMEarth.Transforms.headingPitchRollQuaternion(
    pointA,
    hpr
  )

  function getModelMatrix(pointA, pointB) {
    //向量AB
    const vector2 = window.MSIMEarth.Cartesian3.subtract(
      pointB,
      pointA,
      new window.MSIMEarth.Cartesian3()
    )
    //归一化
    const normal = window.MSIMEarth.Cartesian3.normalize(
      vector2,
      new window.MSIMEarth.Cartesian3()
    )
    //旋转矩阵 rotationMatrixFromPositionVelocity源码中有，并未出现在cesiumAPI中
    const rotationMatrix3 =
      window.MSIMEarth.Transforms.rotationMatrixFromPositionVelocity(
        pointA,
        normal,
        window.MSIMEarth.Ellipsoid.WGS84
      )
    //将三维坐标和旋转信息组合成一个模型变换矩阵
    const modelMatrix4 = window.MSIMEarth.Matrix4.fromRotationTranslation(
      rotationMatrix3,
      pointA
    )
    return modelMatrix4
  }

  function getHeadingPitchRoll(m) {
    var m1 = window.MSIMEarth.Transforms.eastNorthUpToFixedFrame(
      window.MSIMEarth.Matrix4.getTranslation(
        m,
        new window.MSIMEarth.Cartesian3()
      ),
      window.MSIMEarth.Ellipsoid.WGS84,
      new window.MSIMEarth.Matrix4()
    )
    // 矩阵相除
    var m3 = window.MSIMEarth.Matrix4.multiply(
      window.MSIMEarth.Matrix4.inverse(m1, new window.MSIMEarth.Matrix4()),
      m,
      new window.MSIMEarth.Matrix4()
    )
    // 得到旋转矩阵
    var mat3 = window.MSIMEarth.Matrix4.getMatrix3(
      m3,
      new window.MSIMEarth.Matrix3()
    )
    // 计算四元数
    var q = window.MSIMEarth.Quaternion.fromRotationMatrix(mat3)
    // 计算旋转角(弧度)
    var hpr = window.MSIMEarth.HeadingPitchRoll.fromQuaternion(q)
    return hpr
  }
  return orientation
}
