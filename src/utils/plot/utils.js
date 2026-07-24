/**
 * @description 坐标转换 笛卡尔转84
 * @param {Object} Cartesian3 三维位置坐标
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
