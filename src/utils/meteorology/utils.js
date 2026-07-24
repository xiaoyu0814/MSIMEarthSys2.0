/**
 * @description 格式化时间
 * @param {Date} date 时间Date对象
 * @param {string} type 需要转成的时间格式
 * @return {string} 格式化后的时间字符串
 */
export const getTime = (date, type) => {
  var time = ''
  var self_date = new Date(date)
  var year = self_date.getFullYear()
  var month =
    self_date.getMonth() + 1 > 9
      ? self_date.getMonth() + 1
      : '0' + (self_date.getMonth() + 1)
  var day =
    self_date.getDate() > 9 ? self_date.getDate() : '0' + self_date.getDate()
  var hours =
    self_date.getHours() > 9 ? self_date.getHours() : '0' + self_date.getHours()
  var miuntes =
    self_date.getMinutes() > 9
      ? self_date.getMinutes()
      : '0' + self_date.getMinutes()
  var seconds =
    self_date.getSeconds() > 9
      ? self_date.getSeconds()
      : '0' + self_date.getSeconds()
  var milliseconds =
    self_date.getMilliseconds() > 9
      ? self_date.getMilliseconds()
      : '0' + self_date.getMilliseconds()

  var newHover
  var suffix
  if (hours > 12) {
    newHover = hours - 12
    suffix = 'PM'
  } else {
    suffix = 'AM'
  }
  switch (type) {
    case 'yyyy-MM-dd':
      time = `${year}-${month}-${day}`
      break
    case 'yyyy-M-d':
      time = `${year}-${Number(month)}-${Number(day)}`
      break
    case 'HH:mm:ss':
      time = `${hours}:${miuntes}:${seconds}`
      break
    case 'H:m:s':
      time = `${Number(hours)}:${Number(miuntes)}:${Number(seconds)}`
      break
    case 'hh:mm:ss':
      time = `${newHover}:${miuntes}:${seconds} ${suffix}`
      break
    case 'h:m:s':
      time = `${Number(newHover)}:${Number(miuntes)}:${Number(
        seconds
      )} ${suffix}`
      break
    case 'yyyy-MM-dd HH:mm:ss':
      time = `${year}-${month}-${day} ${hours}:${miuntes}:${seconds}`
      break
    case 'yyyy-MM-dd hh:mm:ss':
      time = `${year}-${month}-${day} ${newHover}:${miuntes}:${seconds} ${suffix}`
      break
    case 'yyyy-M-d h:m:s.ms':
      time = `${year}-${Number(month)}-${Number(day)} ${Number(hours)}:${Number(
        miuntes
      )}:${Number(seconds)}.${Number(milliseconds)}`
      break
    default:
      time = `${year}年${month}月${day}日 ${hours}时${miuntes}分${seconds}秒`
      break
  }
  return time
}

export function uuid() {
  var s = []
  var hexDigits = '0123456789abcdef'
  for (var i = 0; i < 32; i++) {
    s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1)
  }
  s[14] = '4' // bits 12-15 of the time_hi_and_version field to 0010
  s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1) // bits 6-7 of the clock_seq_hi_and_reserved to 01
  s[8] = s[13] = s[18] = s[23]
  var uuid = s.join('')
  return uuid
}

export function isNight(stareTime, endTime) {
  let startYear = new Date(stareTime).getFullYear()
  let startMonth = new Date(stareTime).getMonth()
  let startDay = new Date(stareTime).getDate()
  let startHours = new Date(stareTime).getHours()
  let endYear = new Date(endTime).getFullYear()
  let endMonth = new Date(endTime).getMonth()
  let endDay = new Date(endTime).getDate()
  let endHours = new Date(endTime).getHours()
  sessionStorage.setItem('isNight', 0)
  if (startYear == endYear && startMonth == endMonth) {
    if (startDay == endDay) {
      console.log('同一天')
      if (
        startHours >= 18 &&
        startHours <= 23 &&
        endHours >= 18 &&
        endHours <= 23
      ) {
        sessionStorage.setItem('isNight', 1)
      }
    }
    if (endDay - startDay == 1) {
      console.log('差一天')
      if (startHours >= 18 && endHours <= 6) {
        sessionStorage.setItem('isNight', 1)
      }
    }
  }
  // if (startYear == endYear && startMonth == endMonth && startDay == endDay) {
  //   if (startHours >= 18 && endHours <= 6) {
  //     sessionStorage.setItem("isNight", 1);
  //   } else {
  //     sessionStorage.setItem("isNight", 0);
  //   }
  // } else {
  //   sessionStorage.setItem("isNight", 0);
  // }
}

// base64转成二进制文件流
export function base64toFile(dataurl, filename) {
  let arr = dataurl.split(',')
  let mime = arr[0].match(/:(.*?);/)[1]
  let suffix = mime.split('/')[1]
  let bstr = atob(arr[1])
  let n = bstr.length
  let u8arr = new Uint8Array(n)
  while (n--) {
    u8arr[n] = bstr.charCodeAt(n)
  }
  return new File([u8arr], `${filename}.${suffix}`, {
    type: mime
  })
}

/**
 * @description 拾取位置点
 * @param {Object} px 屏幕坐标
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

/**
 * @description 坐标转换 84转笛卡尔
 * @param {Object} {lng,lat,alt} 地理坐标
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

/**
 * @description 十六进制颜色转RGB颜色
 * @param { String } hex 十六进制颜色值
 * @return { Array } rgba颜色数组
 */
export function hexToRgb(hex) {
  hex = hex.replace('#', '')
  // 将16进制颜色值拆分成r、g、b三个部分
  var r = parseInt(hex.substring(0, 2), 16)
  var g = parseInt(hex.substring(2, 4), 16)
  var b = parseInt(hex.substring(4, 6), 16)
  // 返回RGB颜色值
  return [r, g, b, 255]
}

function dmsToLonlat(dms) {
  let DMS = dms.split(':')
  let d = Number(DMS[0])
  let m = Number(DMS[1])
  let s = Number(DMS[2])
  let Lonlat = d + m / 60 + s / 3600
  return Lonlat
}

function lonlatToDfm(params) {}
window.dmsToLonlat = dmsToLonlat

function tet(s) {
  var a = s.split('position')
  let result = []
  for (var i = 0; i < a.length; i++) {
    if (a[i].indexOf('altitude') > -1) {
      let lat = dmsToLonlat(a[i].substring(0, a[i].indexOf('n')))
      let lng = dmsToLonlat(
        a[i].substring(a[i].indexOf('n') + 1, a[i].indexOf('e'))
      )
      let height = Number(
        a[i].substring(a[i].indexOf('altitude') + 8, a[i].indexOf('ft'))
      )
      if (!height) {
        height = Number(
          a[i].substring(a[i].indexOf('altitude') + 8, a[i].indexOf(' m '))
        )
      }
      let temp = [lng, lat, height]
      result.push(temp)
    }
  }
  return result
}

window.testTOLonLat = tet

function exportR(pointList) {
  let result = []
  for (let i = 0; i < pointList.length; i++) {
    let temp = pointList[i]
    let lng = temp.position.x
    let lat = temp.position.y
    let height = Number(temp.position.z) * 0.3048

    let tempArray = [lng, lat, height]
    result.push(tempArray)
  }
  return result
}

window.exportRoute = exportR
