/*
 * 创建攻击箭头
 * @Author: Wang jianLei
 * @Date: 2022-04-15 14:21:28
 * @Last Modified by: Wang JianLei
 * @Last Modified time: 2022-05-05 15:36:43
 */
import './thirdPart/algorithm'
import './thirdPart/plotUtil'
import CreateRemindertip from './ReminderTip'
let Cesium = window.MSIMEarth
const CreateAttackArrowD = function (viewer, resultList, options, callBack) {
  if (!viewer) throw new Error('no viewer object!')
  Cesium = window.MSIMEarth
  options = options || {}
  let id = options.id || setSessionid()
  if (viewer.entities.getById(id))
    throw new Error('the id parameter is an unique value')
  let color = options.color || window.MSIMEarth.Color.RED
  const curDepth = viewer.scene.globe.depthTestAgainstTerrain
  viewer.scene.globe.depthTestAgainstTerrain = true
  let anchorpoints = [],
    pottingPoint = [],
    drawPointsID = []
  let arrowEntity = undefined
  let toolTip = '左键单击开始绘制'
  const handler = new window.MSIMEarth.ScreenSpaceEventHandler(viewer.canvas)
  handler.setInputAction(function (event) {
    toolTip = '左键增加点，右键完成绘制'
    let cartesian = viewer.scene.pickPosition(event.position)
    if (!cartesian) return
    anchorpoints.push(cartesian)
    let GeoPoints = createGeoPoints(viewer, [event.position])
    pottingPoint.push(GeoPoints)
    viewer.entities.add({
      position: new window.MSIMEarth.Cartesian3.fromDegrees(
        GeoPoints[0],
        GeoPoints[1]
      ),
      point: {
        pixelSize: 20,
        color: window.MSIMEarth.Color.RED
      }
    })
  }, window.MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)
  handler.setInputAction(function (move) {
    // CreateRemindertip(toolTip, move.endPosition, true)
    // if (anchorpoints.length < 2) {
    //   toolTip = anchorpoints.length === 1 ? '左键点击绘制箭尾' : toolTip
    //   return
    // }
    // let my_ellipsoid = viewer.scene.globe.ellipsoid
    // let cartesian = viewer.camera.pickEllipsoid(move.endPosition, my_ellipsoid)
    // if (!cartesian) return
    // if (anchorpoints.length >= 2) {
    //   if (!window.MSIMEarth.defined(arrowEntity)) {
    //     anchorpoints.push(cartesian)
    //     let GeoPoints = createGeoPoints(viewer, [move.endPosition])
    //     pottingPoint.push(GeoPoints)
    //     arrowEntity = showAttackArrowOnMap(viewer, anchorpoints, color, id)
    //     arrowEntity.GeoType = 'AttackArrow'
    //   } else {
    //     anchorpoints.pop()
    //     pottingPoint.pop()
    //     anchorpoints.push(cartesian)
    //     let GeoPoints = createGeoPoints(viewer, [move.endPosition])
    //     pottingPoint.push(GeoPoints)
    //   }
    // }
  }, window.MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE)
  handler.setInputAction(function (event) {
    let startPosition = new window.MSIMEarth.Cartesian3.fromDegrees(
      pottingPoint[0][0] + (pottingPoint[1][0] - pottingPoint[0][0]) * 0.5,
      pottingPoint[0][1] + (pottingPoint[1][1] - pottingPoint[0][1]) * 0.5
    )
    let enp = createGeoPoints(viewer, [event.position])
    let endPosition = new window.MSIMEarth.Cartesian3.fromDegrees(
      enp[0],
      enp[1]
    )
    viewer.entities.add({
      position: endPosition,
      point: {
        pixelSize: 20,
        color: window.MSIMEarth.Color.RED
      }
    })
    createDyPoint(viewer, startPosition, endPosition)
    // CreateRemindertip(toolTip, event.position, false)
    let my_ellipsoid = viewer.scene.globe.ellipsoid
    let cartesian = viewer.camera.pickEllipsoid(event.position, my_ellipsoid)
    if (!cartesian) return
    if (anchorpoints.length >= 2) {
      if (!window.MSIMEarth.defined(arrowEntity)) {
        anchorpoints.push(cartesian)
        let GeoPoints = createGeoPoints(viewer, [event.position])
        pottingPoint.push(GeoPoints)
        arrowEntity = showAttackArrowOnMap(viewer, anchorpoints, color, id)
        arrowEntity.GeoType = 'AttackArrow'
      } else {
        anchorpoints.pop()
        pottingPoint.pop()
        anchorpoints.push(cartesian)
        let GeoPoints = createGeoPoints(viewer, [event.position])
        pottingPoint.push(GeoPoints)
      }
    }

    arrowEntity.pottingPoint = pottingPoint
    resultList.push(arrowEntity)
    // viewer.scene.globe.depthTestAgainstTerrain = curDepth
    handler.destroy()
    callBack && callBack(arrowEntity)
    viewer.entities.add({
      position: new window.MSIMEarth.Cartesian3.fromDegrees(
        pottingPoint[0][0] + (pottingPoint[1][0] - pottingPoint[0][0]) * 0.5,
        pottingPoint[0][1] + (pottingPoint[1][1] - pottingPoint[0][1]) * 0.5
      ),
      point: {
        pixelSize: 20,
        color: window.MSIMEarth.Color.RED
      }
    })
  }, window.MSIMEarth.ScreenSpaceEventType.RIGHT_DOWN)
}

function createDyPoint(viewer, startPosition, endPosition) {
  //Set bounds of our simulation time
  var start = window.MSIMEarth.JulianDate.fromDate(new Date(2015, 2, 25, 16))
  var stop = window.MSIMEarth.JulianDate.addSeconds(
    start,
    30,
    new window.MSIMEarth.JulianDate()
  )
  //Make sure viewer is at the desired time.
  viewer.clock.startTime = start.clone()
  viewer.clock.stopTime = stop.clone()
  viewer.clock.currentTime = start.clone()
  viewer.clock.clockRange = window.MSIMEarth.ClockRange.LOOP_STOP //Loop at the end
  viewer.clock.multiplier = 1
  viewer.clock.shouldAnimate = true

  //Set timeline to simulation bounds
  viewer.timeline.zoomTo(start, stop)

  // Create a path for our vehicle by lerping between two positions.
  var position = new window.MSIMEarth.SampledPositionProperty()

  position.addSample(start, startPosition)
  position.addSample(stop, endPosition)
  // A velocity vector property will give us the entity's speed and direction at any given time.
  // A velocity vector property will give us the entity's speed and direction at any given time.

  // viewer.entities.add({
  //   position: new window.MSIMEarth.Cartesian3.fromDegrees(lng, lat),
  //   point: {
  //     pixelSize: 10,
  //     color: window.MSIMEarth.Color.YELLOW
  //   }
  // })

  function updateSpeedLabel(time, result) {
    let center
    if (entity) {
      center = entity.position.getValue(viewer.clock.currentTime)
      window.ppp = center
      // viewer.entities.add({
      //   position: center,
      //   point: {
      //     pixelSize: 10,
      //     color: window.MSIMEarth.Color.YELLOW
      //   }
      // })
    }

    return '123'
  }

  var entity = viewer.entities.add({
    availability: new window.MSIMEarth.TimeIntervalCollection([
      new window.MSIMEarth.TimeInterval({
        start: start,
        stop: stop
      })
    ]),
    // point: {
    //   pixelSize: 20,
    //   color: window.MSIMEarth.Color.YELLOW
    // },
    label: {
      text: new window.MSIMEarth.CallbackProperty(updateSpeedLabel, false),
      font: '20px sans-serif',
      showBackground: true,
      distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
        0.0,
        100.0
      ),
      eyeOffset: new window.MSIMEarth.Cartesian3(0, 3.5, 0)
    },
    position: position
  })
}

function showAttackArrowOnMap(viewer, positions, color, id) {
  let update = function () {
    //计算面
    if (positions.length < 3) {
      return null
    }

    if (window.ppp) {
      positions.pop()
      positions.push(window.ppp)
    }
    let lnglatArr = []
    for (let i = 0; i < positions.length; i++) {
      let lnglat = cartesianToLatlng(viewer, positions[i])
      lnglatArr.push(lnglat)
    }
    let res = window.xp.algorithm.tailedAttackArrow(lnglatArr)
    let index = JSON.stringify(res.polygonalPoint).indexOf('null')
    let returnData = []
    if (index == -1) returnData = res.polygonalPoint
    return new window.MSIMEarth.PolygonHierarchy(returnData)
  }
  let en = viewer.entities.add({
    id: id,
    name: 'AttackArrow',
    // show: false,
    polygon: new window.MSIMEarth.PolygonGraphics({
      hierarchy: new window.MSIMEarth.CallbackProperty(update, false),
      show: true,
      fill: true,
      material: color
    })
  })
  return en
}
function cartesianToLatlng(viewer, cartesian) {
  let latlng = viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
  let lat = window.MSIMEarth.Math.toDegrees(latlng.latitude)
  let lng = window.MSIMEarth.Math.toDegrees(latlng.longitude)
  return [lng, lat]
}
/**
 *根据特征点屏幕坐标计算地理坐标
 * @param viewer
 * @param window_points 屏幕坐标
 * @returns {Array} 地理坐标（经纬度）
 * @private
 */
function createGeoPoints(viewer, window_points) {
  let points = []
  let ray, cartesian, cartographic, lng, lat, height
  for (let i = 0; i < window_points.length; i++) {
    ray = viewer.camera.getPickRay(window_points[i])
    ray && (cartesian = viewer.scene.globe.pick(ray, viewer.scene))
    if (cartesian) {
      cartographic = window.MSIMEarth.Cartographic.fromCartesian(cartesian)
      lng = window.MSIMEarth.Math.toDegrees(cartographic.longitude)
      lat = window.MSIMEarth.Math.toDegrees(cartographic.latitude)
      height = cartographic.height
      points.push(lng, lat, height)
    }
  }
  return points
}

function setSessionid(num) {
  let len = num || 32
  let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz0123456789'
  let maxPos = chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}
export default CreateAttackArrowD
