import GerneralRadar from '../../ThirdParty/renderRadar'
import { colors2 } from './color'
/**
 * 基于基础参数构建雷达（包括受干扰效果）
 * @returns
 */
function createRadar(params) {
  // 雷达参数
  let RadarMsg = {}
  // 干扰源参数
  let disMsg = []
  // 1.0 如果存在则清除当前雷达渲染图元
  window.EarthViewer.scene.primitives._primitives.forEach((e) => {
    if (e.id && e.id == params.entityId + 'TRIANGLES') {
      window.EarthViewer.scene.primitives.remove(e)
    }
  })
  window.EarthViewer.scene.primitives._primitives.forEach((e) => {
    if (e.id && e.id == params.entityId + 'LINES') {
      window.EarthViewer.scene.primitives.remove(e)
    }
  })
  // 1.1获取雷达位置并配置雷达属性
  let radarEntity = window.EarthPlugn.entity._GetCZMLEntity(
    params.entityId,
    'MSIMEarthCZMLProcessContainer'
  )
  if (!window.MSIMEarth.defined(radarEntity)) return
  let radarSide = radarEntity.properties?.side?._value
  let grySide = params.side
  if (radarSide === 'red') {
    grySide = 'blue'
  } else if (radarSide === 'blue') {
    grySide = 'red'
  } else {
    //其他阵营或者没获取到阵营属性
  }
  let radarPosition = radarEntity.position.getValue(
    window.EarthViewer.clock.currentTime
  )
  if (!window.MSIMEarth.defined(radarPosition)) return
  let ellipsoid = window.EarthViewer.scene.globe.ellipsoid
  let radarCartographic = ellipsoid.cartesianToCartographic(radarPosition)
  let radarLat = window.MSIMEarth.Math.toDegrees(radarCartographic.latitude)
  let radarLng = window.MSIMEarth.Math.toDegrees(radarCartographic.longitude)
  let radarAlt = radarCartographic.height
  RadarMsg = {
    Pt: Math.pow(10, 6), //雷达的发射功率 W
    Gt: 40, //雷达的天线主瓣增益 db
    lanBuda: 0.026, // 信号波长m  // 决定了雷达覆盖面范围 值越小范围越小
    thegema: 3, // 目标的雷达反射截面积 m2
    n: 16, //脉冲积累数
    k: 1.38 * Math.pow(10, -23), //玻尔兹曼常数
    Bn: 1.6 * Math.pow(10, 2), //接收机通频带宽度 1.6* pow(10, 6)
    Fn: 10, //雷达接收机噪声系数
    S_Delta_N: 13, //雷达接收机最小可检测信噪比 2
    T0: 290, //以绝对温度表示的雷达接收机噪声温度
    Az_SEnd_Angle: { x: 0, y: 360 }, //方位角
    Pitch_SEnd_Angle: { x: -90, y: 90 }, //俯仰角
    bParameterMiss: false,
    radius: 1500,
    maxRadius: -1,
    lobeWidth_h: 15,
    lobeWidth_v: 10, //天线图主瓣垂直宽度，单位度

    lobeWidth_halfPt_h: 7, //天线图主瓣半功率水平宽度，单位度
    lobeWidth_halfPt_v: 1.5, //天线图主瓣半功率垂直宽度，单位度
    lobeK: 0.07, //k为计算天线图的比例常数
    // 当前使用的位置  116.77067265277556 24.139422679307664

    // pos:{'x':110,'y':34,'z':1200},
    // pos:{'x':116.11102995145029,'y':23.238310896696376,'z':100},
    pos: { x: radarLng, y: radarLat, z: radarAlt },
    merctorPos: { x: 110.5, y: 34.1, z: 1200 },

    dRadarAntenaSpeed: 0.0001,
    dRadarAntenaR_S: 10, //雷达天线的开始方位角
    dRadarAntenaR_E: 100
  }
  // 1.2 更新干扰机参数
  // 1.2遍历场景内动态目标，确认地方干扰源
  if (
    typeof MSIMEarthCZMLProcessContainer !== 'undefined' ||
    typeof MSIMEarthCZMLProcessContainer.entities !== 'undefined'
  ) {
    let czmlEntities = MSIMEarthCZMLProcessContainer.entities.values
    if (typeof czmlEntities !== 'undefined') {
      // 1.2.1遍历当前干扰源集合并遍历CZML实体集合并将确认为干扰源的实体构造成干扰源填充到干扰源集合
      EarthAPP.grjh.forEach((gry) => {
        czmlEntities.forEach((e) => {
          // 首先确认实体为敌对阵营并且是干扰源并且开机状态
          if (e.properties.airplaneAction._value.side === grySide) {
            // if (e.properties.airplaneAction._value?.jammers?.Type === 'RE_JamS') {
            if (gry.name === e.id && gry.state) {
              let gryPosition = e.position.getValue(
                window.EarthViewer.clock.currentTime
              )
              if (!window.MSIMEarth.defined(gryPosition)) return
              let gryCartographic =
                ellipsoid.cartesianToCartographic(gryPosition)
              let gryLat = window.MSIMEarth.Math.toDegrees(
                gryCartographic.latitude
              )
              let gryLng = window.MSIMEarth.Math.toDegrees(
                gryCartographic.longitude
              )
              let gryAlt = gryCartographic.height
              disMsg.push({
                Pj: 10, //干扰机发射功率
                Gj: 10, //干扰机的发射增益
                Bj: 2 * Math.pow(10, 6), //干扰机进入雷达天线的信号带宽
                Yj: 0.5, //为雷达天线接收干扰机信号的极化损耗
                Kj: 2, //为指定的压制系数
                K: 0.04, //为雷达天线的方向性系数0.04-0.1
                Theta_Half: 20, // 雷达半功率波束宽度 单位度
                // pos: { x: -85.53768690545911, y: -55.941874522928224, z: 1200000 }
                pos: {
                  x: gryLng,
                  y: gryLat,
                  z: gryAlt
                }
              })
            }
          }
        })
      })
    }
  }
  // 1.3 可视化干扰效果
  if (radarSide === 'blue') {
    colors2 = colors2.reverse()
  }
  function getDistance(point1, point2) {
    var point1cartographic = window.MSIMEarth.Cartographic.fromCartesian(point1)
    var point2cartographic = window.MSIMEarth.Cartographic.fromCartesian(point2)
    /**根据经纬度计算出距离**/
    var geodesic = new window.MSIMEarth.EllipsoidGeodesic()
    geodesic.setEndPoints(point1cartographic, point2cartographic)
    var s = geodesic.surfaceDistance
    //返回两点之间的距离
    s = Math.sqrt(
      Math.pow(s, 2) +
        Math.pow(point2cartographic.height - point1cartographic.height, 2)
    )
    return s
  }
  if (disMsg.length === 0) {
    RadarMsg.lanBuda = 0.086
  }
  // let distanceRes = getDistance(oPosition, curP)
  let res = GerneralRadar(RadarMsg, disMsg)
  var val = res
  var positions = val.positions //new Float32Array(data.positions);
  var indices = new Uint16Array(val.indices)
  let colors = new Float32Array(val.colors)
  let curColor
  let colorsByDistance = []
  for (let i = 0; i < val.distance.length; i++) {
    const e = val.distance[i]
    if (e < 3000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[0])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 6000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[1])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 9000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[2])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 12000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[3])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 15000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[4])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 20000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[5])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 25000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[6])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 30000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[7])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 35000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[8])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 40000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[9])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 41000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[10])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 42000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[11])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 43000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[12])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 44000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[13])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 45000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[14])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 46000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[15])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 47000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[16])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 48000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[17])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 49000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[18])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 50000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[19])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 51000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[20])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 51500) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[21])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 52000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[22])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 52500) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[23])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 53000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[24])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 53500) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[25])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 54000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[26])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 54500) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[27])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 55000) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[28])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 55500) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[29])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 55600) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[30])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 55700) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[31])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 55800) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[32])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else if (e < 55900) {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[33])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    } else {
      curColor = window.MSIMEarth.Color.fromCssColorString(colors2[36])
      colorsByDistance.push(curColor.red, curColor.green, curColor.blue, 0.1)
    }
  }
  colors = new Float32Array(colorsByDistance)

  let renderPosition = window.MSIMEarth.Cartesian3.fromDegrees(
    radarLng,
    radarLat,
    radarAlt
  )
  let rt = cusP.createTriNetPrimitive({
    position: renderPosition,
    viewer: window.EarthViewer,
    positions: positions,
    indices: indices,
    colors: colors,
    primitiveType: 'TRIANGLES',
    id: radarEntity.id + 'TRIANGLES'
  })
  let rt2 = cusP.createTriNetPrimitive({
    position: renderPosition,
    viewer: window.EarthViewer,
    positions: positions,
    indices: indices,
    colors: colors,
    primitiveType: 'LINES',
    id: radarEntity.id + 'LINES'
  })
  window.EarthViewer.scene.primitives.add(rt)
  window.EarthViewer.scene.primitives.add(rt2)
}
