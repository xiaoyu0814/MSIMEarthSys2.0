/*
 * 创建多边形
 * @Author: Wang jianLei
 * @Date: 2022-04-17 22:49:57
 * @Last Modified by: Wang JianLei
 * @Last Modified time: 2022-04-21 11:04:47
 */
import CreateRemindertip from './ReminderTip'
let Cesium = window.MSIMEarth
const CreatePolygon = function (viewer, resultList, options, callback) {
  if (!viewer) throw new Error('no viewer object!')
  Cesium = window.MSIMEarth
  options = options || {}
  let id = options.id || setSessionid()
  if (viewer.entities.getById(id))
    throw new Error('the id parameter is an unique value')
  let color = options.color || window.MSIMEarth.Color.RED
  let outlineColor = color.withAlpha(1)
  const handler = new window.MSIMEarth.ScreenSpaceEventHandler(viewer.canvas)
  let toolTip = '左键点击开始绘制'
  let anchorpoints = []
  let polygon = undefined
  handler.setInputAction(function (event) {
    let pixPos = event.position
    let cartesian = getCatesian3FromPX(viewer, pixPos)
    if (anchorpoints.length == 0) {
      toolTip = '左键添加第二个顶点'
      anchorpoints.push(cartesian)
      let dynamicPositions = new window.MSIMEarth.CallbackProperty(function () {
        return new window.MSIMEarth.PolygonHierarchy(anchorpoints)
      }, false)
      polygon = viewer.entities.add({
        name: 'Polygon',
        id: id,
        polygon: {
          hierarchy: dynamicPositions,
          material: color,
          outline: true,
          outlineColor: outlineColor,
          height: 0
        }
      })
      polygon.GeoType = 'Polygon'
    } else {
      toolTip = '左键添加点，右键完成绘制'
    }
    anchorpoints.push(cartesian)
  }, window.MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)
  handler.setInputAction(function (movement) {
    let endPos = movement.endPosition
    CreateRemindertip(toolTip, endPos, true)
    if (window.MSIMEarth.defined(polygon)) {
      anchorpoints.pop()
      let cartesian = getCatesian3FromPX(viewer, endPos)
      anchorpoints.push(cartesian)
    }
  }, window.MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE)
  handler.setInputAction(function (event) {
    anchorpoints.pop()
    polygon.pottingPoint = anchorpoints
    resultList.push(polygon)
    handler.destroy()
    CreateRemindertip(toolTip, event.position, false)
    if (typeof callback == 'function') callback(polygon)
  }, window.MSIMEarth.ScreenSpaceEventType.RIGHT_DOWN)
}
function getCatesian3FromPX(viewer, px) {
  let picks = viewer.scene.drillPick(px)
  let cartesian = null
  let isOn3dtiles = false,
    isOnTerrain = false
  // drillPick
  for (let i in picks) {
    let pick = picks[i]
    if (
      (pick &&
        pick.primitive instanceof window.MSIMEarth.Cesium3DTileFeature) ||
      (pick && pick.primitive instanceof window.MSIMEarth.Cesium3DTileset) ||
      (pick && pick.primitive instanceof window.MSIMEarth.Model)
    ) {
      //模型上拾取
      isOn3dtiles = true
    }
    // 3dtilset
    if (isOn3dtiles) {
      viewer.scene.pick(px)
      cartesian = viewer.scene.pickPosition(px)
      if (cartesian) {
        let cartographic =
          window.MSIMEarth.Cartographic.fromCartesian(cartesian)
        if (cartographic.height < 0) cartographic.height = 0
        let lon = window.MSIMEarth.Math.toDegrees(cartographic.longitude),
          lat = window.MSIMEarth.Math.toDegrees(cartographic.latitude),
          height = cartographic.height
        cartesian = transformWGS84ToCartesian(viewer, {
          lng: lon,
          lat: lat,
          alt: height
        })
      }
    }
  }
  // 地形
  let boolTerrain =
    viewer.terrainProvider instanceof window.MSIMEarth.EllipsoidTerrainProvider
  // Terrain
  if (!isOn3dtiles && !boolTerrain) {
    let ray = viewer.scene.camera.getPickRay(px)
    if (!ray) return null
    cartesian = viewer.scene.globe.pick(ray, viewer.scene)
    isOnTerrain = true
  }
  // 地球
  if (!isOn3dtiles && !isOnTerrain && boolTerrain) {
    cartesian = viewer.scene.camera.pickEllipsoid(
      px,
      viewer.scene.globe.ellipsoid
    )
  }
  if (cartesian) {
    let position = transformCartesianToWGS84(viewer, cartesian)
    if (position.alt < 0) {
      cartesian = transformWGS84ToCartesian(viewer, position, 0.1)
    }
    return cartesian
  }
  return false
}

/***
 * 坐标转换 84转笛卡尔
 * @param {Object} {lng,lat,alt} 地理坐标
 * @return {Object} Cartesian3 三维位置坐标
 */
function transformWGS84ToCartesian(viewer, position, alt) {
  return position
    ? window.MSIMEarth.Cartesian3.fromDegrees(
        position.lng || position.lon,
        position.lat,
        (position.alt = alt || position.alt),
        window.MSIMEarth.Ellipsoid.WGS84
      )
    : window.MSIMEarth.Cartesian3.ZERO
}

/***
 * 坐标转换 笛卡尔转84
 * @param {Object} Cartesian3 三维位置坐标
 * @return {Object} {lng,lat,alt} 地理坐标
 */
function transformCartesianToWGS84(viewer, cartesian) {
  let ellipsoid = window.MSIMEarth.Ellipsoid.WGS84
  let cartographic = ellipsoid.cartesianToCartographic(cartesian)
  return {
    lng: window.MSIMEarth.Math.toDegrees(cartographic.longitude),
    lat: window.MSIMEarth.Math.toDegrees(cartographic.latitude),
    alt: cartographic.height
  }
}
function setSessionid(num) {
  let len = num || 32
  let chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678'
  let maxPos = chars.length
  let pwd = ''
  for (let i = 0; i < len; i++) {
    pwd += chars.charAt(Math.floor(Math.random() * maxPos))
  }
  return pwd
}
export default CreatePolygon
