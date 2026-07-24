/**
 * 拾取位置点
 *
 * @param {Object} px 屏幕坐标
 *
 * @return {Object} Cartesian3 三维坐标
 */
export function getCatesian3FromPX(px) {
  if (window.EarthViewer && px) {
    var picks = window.EarthViewer.scene.drillPick(px)
    var cartesian = null
    var isOn3dtiles = false,
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
        window.EarthViewer.scene.pick(px) // pick
        cartesian = window.EarthViewer.scene.pickPosition(px)
        if (cartesian) {
          let cartographic =
            window.MSIMEarth.Cartographic.fromCartesian(cartesian)
          if (cartographic.height < 0) cartographic.height = 0
          let lon = window.MSIMEarth.Math.toDegrees(cartographic.longitude),
            lat = window.MSIMEarth.Math.toDegrees(cartographic.latitude),
            height = cartographic.height
          cartesian = transformWGS84ToCartesian({
            lng: lon,
            lat: lat,
            alt: height
          })
        }
      }
    }
    // 地形
    let boolTerrain =
      window.EarthViewer.terrainProvider instanceof
      window.MSIMEarth.EllipsoidTerrainProvider
    // Terrain
    if (!isOn3dtiles && !boolTerrain) {
      var ray = window.EarthViewer.scene.camera.getPickRay(px)
      if (!ray) return null
      cartesian = window.EarthViewer.scene.globe.pick(
        ray,
        window.EarthViewer.scene
      )
      isOnTerrain = true
    }
    // 地球
    if (!isOn3dtiles && !isOnTerrain && boolTerrain) {
      cartesian = window.EarthViewer.scene.camera.pickEllipsoid(
        px,
        window.EarthViewer.scene.globe.ellipsoid
      )
    }
    if (cartesian) {
      let position = transformCartesianToWGS84(cartesian)
      if (position.alt < 0) {
        cartesian = transformWGS84ToCartesian(position, 0.1)
      }
      return cartesian
    }
    return false
  }
}

/***
 * 坐标转换 84转笛卡尔
 *
 * @param {Object} {lng,lat,alt} 地理坐标
 *
 * @return {Object} Cartesian3 三维位置坐标
 */
export function transformWGS84ToCartesian(positions, alt) {
  if (window.EarthViewer) {
    let position = {}
    if (positions.lng) {
      position.x = positions.lng
      position.y = positions.lat
      position.z = positions.alt
    } else {
      position = positions
    }
    return position
      ? window.MSIMEarth.Cartesian3.fromDegrees(
          position.x,
          position.y,
          (position.z = alt || position.z),
          window.MSIMEarth.Ellipsoid.WGS84
        )
      : window.MSIMEarth.Cartesian3.ZERO
  }
}

/***
 * 坐标转换 笛卡尔转84
 *
 * @param {Object} Cartesian3 三维位置坐标
 *
 * @return {Object} {lng,lat,alt} 地理坐标
 */
export function transformCartesianToWGS84(cartesian) {
  if (window.EarthViewer && cartesian) {
    var ellipsoid = window.MSIMEarth.Ellipsoid.WGS84
    var cartographic = ellipsoid.cartesianToCartographic(cartesian)
    return {
      lng: window.MSIMEarth.Math.toDegrees(cartographic.longitude),
      lat: window.MSIMEarth.Math.toDegrees(cartographic.latitude),
      alt: cartographic.height
    }
  }
}

/***
 * 坐标数组转换 笛卡尔转86
 *
 * @param {Array} cartesianArr 三维位置坐标数组
 *
 * @return {Array} {lng,lat,alt} 地理坐标数组
 */
export function transformCartesianArrayToWGS84Array(cartesianArr) {
  return cartesianArr
    ? cartesianArr.map(function (item) {
        return transformCartesianToWGS84(item)
      })
    : []
}
