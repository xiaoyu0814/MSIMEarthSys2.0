let merctorPos = { x: 0, y: 0, z: 0 }
let pos = { x: 0, y: 0, z: 0 }
let RadarMsg = {
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
  pos: { x: 114.9783340370373, y: 23.167814183639944, z: 1200 },
  merctorPos: { x: 110.5, y: 34.1, z: 1200 },

  dRadarAntenaSpeed: 0.0001,
  dRadarAntenaR_S: 10, //雷达天线的开始方位角
  dRadarAntenaR_E: 100
}
// let disMsg = []
// 干扰源位置 118.49733034117025 26.36927745957482  115.54763976882953 23.140378781286287
let disMsg = [
  {
    Pj: 10, //干扰机发射功率
    Gj: 10, //干扰机的发射增益
    Bj: 2 * Math.pow(10, 6), //干扰机进入雷达天线的信号带宽
    Yj: 0.5, //为雷达天线接收干扰机信号的极化损耗
    Kj: 2, //为指定的压制系数
    K: 0.8, //为雷达天线的方向性系数0.04-0.1
    Theta_Half: 20, // 雷达半功率波束宽度 单位度
    //  pos:{'x':115,'y':34,'z':1200},
    pos: { x: 118.49733034117025, y: 26.36927745957482, z: 6000000 }
  },
  {
    Pj: 10, //干扰机发射功率
    Gj: 10, //干扰机的发射增益
    Bj: 2 * Math.pow(10, 6), //干扰机进入雷达天线的信号带宽
    Yj: 0.5, //为雷达天线接收干扰机信号的极化损耗
    Kj: 2, //为指定的压制系数
    K: 0.8, //为雷达天线的方向性系数0.04-0.1
    Theta_Half: 20, // 雷达半功率波束宽度 单位度
    //  pos:{'x':115,'y':34,'z':1200},
    pos: { x: 115.54763976882953, y: 23.140378781286287, z: 6000000 }
  }
]

function DegreesToRadians(degrees) {
  return (degrees * Math.PI) / 180
}
function RadiansToDegrees(radian) {
  return radian * (180 / Math.PI)
}
function distance1(lat1Rad, lon1Rad, lat2Rad, lon2Rad, radius) {
  let dLat = lat2Rad - lat1Rad
  let dLon = lon2Rad - lon1Rad
  let a =
    Math.sin(dLat / 2.0) * Math.sin(dLat / 2.0) +
    Math.cos(lat1Rad) *
      Math.cos(lat2Rad) *
      Math.sin(dLon / 2.0) *
      Math.sin(dLon / 2.0)
  let c = 2.0 * Math.atan2(Math.sqrt(a), Math.sqrt(1.0 - a))
  let d = radius * c
  return d
}

function distance(points) {
  let length = 0

  if (Object.keys(points).length > 1) {
    for (let i = 0; i < Object.keys(points).length - 1; ++i) {
      let current = points[i]
      let next = points[i + 1]
      length += distance1(
        DegreesToRadians(current.y),
        DegreesToRadians(current.x),
        DegreesToRadians(next.y),
        DegreesToRadians(next.x),
        6378137.0
      )
    }
  }
  return length
}
function absolute(a) {
  return a < 0 ? -a : a
}
function rhumbBearing(lat1Rad, lon1Rad, lat2Rad, lon2Rad) {
  let dLon = lon2Rad - lon1Rad

  let dPhi = Math.log(
    Math.tan(lat2Rad / 2.0 + Math.PI / 4.0) /
      Math.tan(lat1Rad / 2.0 + Math.PI / 4.0)
  )
  if (absolute(dLon) > Math.PI)
    dLon = dLon > 0.0 ? -(2.0 * Math.PI - dLon) : 2.0 * Math.PI + dLon
  let brng = Math.atan2(dLon, dPhi)
  let yushu = (brng + 2.0 * Math.PI) % (2.0 * Math.PI)
  return yushu
}

function AngleToWorldPoint(rudis, sinDir, cosDir, sinEle, cosEle) {
  let x = rudis * sinDir * cosEle
  let y = rudis * cosDir * cosEle
  let z = rudis * sinEle
  let earthPnt = { x: x, y: y, z: z }
  return earthPnt
}

function GetDistance(dSinEleR, dCosEleR, dPercent1, radarMsg) {
  let dividend =
    radarMsg.Pt *
    Math.pow(radarMsg.Gt, 2) *
    Math.pow(radarMsg.lanBuda, 2) *
    radarMsg.thegema *
    Math.sqrt(radarMsg.n)
  let divider =
    Math.pow(4 * Math.PI, 3) *
    radarMsg.k *
    radarMsg.T0 *
    radarMsg.Bn *
    radarMsg.Fn *
    radarMsg.S_Delta_N
  let RE = Math.sqrt(Math.sqrt(dividend / divider))

  let RD = Math.sqrt(Math.sqrt(Math.abs(dSinEleR))) * dCosEleR * dCosEleR
  dPercent1 = RD / 0.7
  let distance = RE * RD
  return distance
}
function GetDistance_Disturb(
  dSinEleR,
  dCosEleR,
  dDirR,
  dPercent1,
  radarMsg,
  disturMsg,
  count
) {
  let tRTOD = 180.0 / 3.1415926
  let tDTOR = 3.1415926 / 180.0

  //雷达的主要参数
  let dividend =
    radarMsg.Pt *
    Math.pow(radarMsg.Gt, 2) *
    Math.pow(radarMsg.lanBuda, 2) *
    radarMsg.thegema *
    Math.sqrt(radarMsg.n)

  // std::vector<eVector3d> geoPosition=[];
  // geoPosition.resize(2);

  let geoPosition = []

  /*  let mapPoint={'x':radarMsg.pos.x, 'y':radarMsg.pos.y};
    let geoPoint={'x':radarMsg.pos.x, 'y':radarMsg.pos.y};
    // pContext->GetRenderCoordSys()->MapToGeo(mapPoint, geoPoint);*/
  geoPosition[0] = { x: radarMsg.pos.x, y: radarMsg.pos.y, z: radarMsg.pos.z }

  let divider = 0
  for (let i = 0; i < count; i++) {
    let disMsg = disturMsg[i]

    // mapPoint = {'x':disMsg.pos.x, 'y':disMsg.pos.y};
    // pContext->GetRenderCoordSys()->MapToGeo(mapPoint, geoPoint);
    geoPosition[1] = { x: disMsg.pos.x, y: disMsg.pos.y, z: disMsg.pos.z }
    let Rj = distance(geoPosition)
    // console.log('RJ', Rj)
    let theta = rhumbBearing(
      DegreesToRadians(geoPosition[0].y),
      DegreesToRadians(geoPosition[0].x),
      DegreesToRadians(geoPosition[1].y),
      DegreesToRadians(geoPosition[1].x)
    )

    let angle = Math.abs(dDirR - theta)
    if (angle > Math.PI) {
      angle = Math.PI * 2 - angle
    }

    theta = RadiansToDegrees(angle)
    let Gt = 0.0

    if (0 <= theta && theta <= disMsg.Theta_Half * 0.5) {
      Gt = radarMsg.Gt
    } else if (disMsg.Theta_Half * 0.5 <= theta && theta <= 90.0) {
      Gt = radarMsg.Gt * disMsg.K * Math.pow(disMsg.Theta_Half / theta, 2)
    } else {
      Gt = radarMsg.Gt * disMsg.K * Math.pow(disMsg.Theta_Half / 90.0, 2)
    }

    divider +=
      (disMsg.Pj * disMsg.Gj * Gt * radarMsg.Bn * disMsg.Yj) /
      (disMsg.Bj * Math.pow(Rj, 2))
  }

  divider = divider * 4 * Math.PI

  let RE = Math.sqrt(Math.sqrt(dividend / divider))
  let RD = Math.sqrt(Math.sqrt(Math.abs(dSinEleR))) * dCosEleR * dCosEleR

  dPercent1 = RD / 0.7

  return RE * RD
}

function GerneralRadarSector(radarMsg, disMsg, pSectionVertexData, pContext) {
  if (pContext == undefined || pContext == '') return

  //申请蒙皮采样点
  //三维曲面的半透明蒙皮，通过QUAD_STRIP图元合成
  /*    pSectionVertexData->SetVertexType(VO_POSITION | VO_TEXCOORD0);
    pSectionVertexData->AddElement(VET_FLOAT, VEC_ELEMENT3, AO_POSITION);
    pSectionVertexData->AddElement(VET_FLOAT, VEC_ELEMENT2, AO_TEXCOORD0);*/

  //设置三维曲面采样步长
  let dStep = 5
  let maxDirAngle = Math.abs(
    radarMsg.Az_SEnd_Angle.y - radarMsg.Az_SEnd_Angle.x
  )

  //俯仰方向循环
  for (
    let dEle = radarMsg.Pitch_SEnd_Angle.x;
    dEle <= radarMsg.Pitch_SEnd_Angle.y;
    dEle += dStep
  ) {
    let dEleR = DegreesToRadians(dEle)
    let dEleR2 = DegreesToRadians(dEle + dStep)

    let sinEle = Math.sin(dEleR)
    let cosEle = Math.cos(dEleR)

    let sinEle2 = Math.sin(dEleR2)
    let cosEle2 = Math.cos(dEleR2)
    //水平方向循环
    let index = 0
    let dDir = 0

    for (
      let dDir = radarMsg.Az_SEnd_Angle.x;
      dDir <= radarMsg.Az_SEnd_Angle.y;
      dDir += dStep
    ) {
      //GetDistance为计算在指定方位角、俯仰角处雷达最大探测距离的核心函数，dPercent为与最大探测距离相对应的颜色色度
      let dDirR = DegreesToRadians(dDir)
      let sinDir = Math.sin(dDirR)
      let cosDir = Math.cos(dDirR)

      let dPercent1, dPercent2, dDis, dDis2

      if (radarMsg.bParameterMiss) {
        dDis = radarMsg.radius
        dDis2 = radarMsg.radius

        dPercent1 = Math.abs(dEleR2) / 3.1415926
        dPercent2 = Math.abs(dEleR) / 3.1415926
      } else {
        if (Object.keys(disMsg).length == 0) {
          dDis = GetDistance(sinEle, cosEle, dPercent1, radarMsg)
          dDis2 = GetDistance(sinEle2, cosEle2, dPercent2, radarMsg)
        } else {
          dDis = GetDistance_Disturb(
            sinEle,
            cosEle,
            dDirR,
            dPercent1,
            radarMsg,
            disMsg,
            Object.keys(disMsg).length
          )
          dDis2 = GetDistance_Disturb(
            sinEle2,
            cosEle2,
            dDirR,
            dPercent2,
            radarMsg,
            disMsg,
            Object.keys(disMsg).length
          )
        }
      }

      let point1 = AngleToWorldPoint(dDis, sinDir, cosDir, sinEle, cosEle)
      let point2 = AngleToWorldPoint(dDis2, sinDir, cosDir, sinEle2, cosEle2)

      //计算蒙皮的采样点坐标，同时计算对应的显示颜色

      /*
            tagTextureVertex3r colorVert;
			colorVert.Position = eVector3f(0, 0, 0);
			colorVert.TexCoord = eVector2f(0.0, 0.0);
			pSectionVertexData->AddVertex((eByte*)&colorVert, sizeof(tagTextureVertex3r));

            tagTextureVertex3r colorVert1;
            colorVert1.Position = point1;
            colorVert1.TexCoord = eVector2f(1.0, 1.0);
            pSectionVertexData->AddVertex((eByte*)&colorVert1, sizeof(tagTextureVertex3r));

            tagTextureVertex3r colorVert2;
            colorVert2.Position = point2;
            colorVert2.TexCoord = eVector2f(1.0, 1.0);
            pSectionVertexData->AddVertex((eByte*)&colorVert2, sizeof(tagTextureVertex3r));*/

      index++
    }
  }
  /*    pSectionVertexData->Create();
    pSectionVertexData->m_VertexBuffer.clear();*/
}

function GerneralRadar(
  radarMsg,
  disMsg,
  pVertexData,
  pIndexData,
  pWireframeIndexData,
  pContext
) {
  let pIndexbuf = []
  let pointsArr = []
  let distanceArr = []
  let colorsArr = []
  let circleIndex = 0

  //设置三维曲面采样步长
  let dStep = 5
  let maxDirAngle = Math.abs(
    radarMsg.Az_SEnd_Angle.y - radarMsg.Az_SEnd_Angle.x
  )

  //俯仰方向循环
  for (
    let dEle = radarMsg.Pitch_SEnd_Angle.x;
    dEle <= radarMsg.Pitch_SEnd_Angle.y;
    dEle += dStep
  ) {
    //计算蒙皮所需要的采样点数量
    let numCoordsSkin = (maxDirAngle / dStep + 1) * 2
    let dEleR = DegreesToRadians(dEle)

    let sinEle = Math.sin(dEleR)
    let cosEle = Math.cos(dEleR)

    //水平方向循环
    let index = 0
    for (
      let dDir = radarMsg.Az_SEnd_Angle.x;
      dDir <= radarMsg.Az_SEnd_Angle.y;
      dDir += dStep
    ) {
      let dDirR = DegreesToRadians(dDir)
      let dPercent1, dPercent2
      let dDis = 0,
        dDis2 = 0

      let sinDir = Math.sin(dDirR)
      let cosDir = Math.cos(dDirR)

      //GetDistance为计算在指定方位角、俯仰角处雷达最大探测距离的核心函数，dPercent为与最大探测距离相对应的颜色色
      if (radarMsg.bParameterMiss) {
        dDis = radarMsg.radius
        dPercent1 = (2 * abs(dEleR)) / 3.1415926
      } else {
        if (Object.keys(disMsg).length == 0) {
          dDis = GetDistance(sinEle, cosEle, dPercent1, radarMsg)
        } else {
          dDis = GetDistance_Disturb(
            sinEle,
            cosEle,
            dDirR,
            dPercent1,
            radarMsg,
            disMsg,
            Object.keys(disMsg).length
          )
        }
      }

      if (dDis > radarMsg.maxRadius) {
        radarMsg.maxRadius = dDis
      }

      let point0 = AngleToWorldPoint(dDis, sinDir, cosDir, sinEle, cosEle)
      // console.log('point:',point0);
      pointsArr.push(point0.x)
      pointsArr.push(point0.y)
      pointsArr.push(point0.z)
      //计算蒙皮的采样点坐标，同时计算对应的显示颜色//0.3为透明度，0为完全透明，1为完全不透明

      let distance = Math.sqrt(
        point0.x * point0.x + point0.y * point0.y + point0.z * point0.z
      )
      let sqrt = Math.sqrt(
        point0.x * point0.x + point0.y * point0.y + point0.z * point0.z
      )
      let colorValr = Math.abs(point0.x / sqrt)
      let colorValg = Math.abs(point0.y / sqrt)
      let colorValb = Math.abs(point0.z / sqrt)
      let colorVala = 0.3
      colorsArr.push(colorValr, colorValg, colorValb, colorVala)
      distanceArr.push(distance)

      index++
    }

    if (circleIndex != 0) {
      for (let i = 1; i < index; i++) {
        let rightTop = i + circleIndex
        let rightB = rightTop - index
        let leftTop = i - 1 + circleIndex
        let leftB = leftTop - index

        pIndexbuf.push(leftB)
        pIndexbuf.push(rightB)
        pIndexbuf.push(leftTop)

        pIndexbuf.push(leftTop)
        pIndexbuf.push(rightB)
        pIndexbuf.push(rightTop)
      }
    }
    circleIndex += index
  }
  //需要处理
  /*    pVertexData->Create();
    pIndexData->Create();
    pWireframeIndexData->Create();
    pVertexData->m_VertexBuffer.clear();
    pIndexData->m_IndexBuffer.clear();
    pWireframeIndexData->m_IndexBuffer.clear();*/
  return {
    positions: pointsArr,
    indices: pIndexbuf,
    distance: distanceArr,
    colors: colorsArr
  }
}
//
// let res = GerneralRadar(RadarMsg, disMsg)
export default GerneralRadar
