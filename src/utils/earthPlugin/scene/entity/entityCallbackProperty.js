/**
 * 传感器范围圈绘制
 * @param {object} params 传感器信息
 * @returns
 */
function createSensorRange(params) {
  let viewer = window.EarthViewer
  viewer.entities.removeById(`${params.type}==${params.sourId}==big`)
  viewer.entities.removeById(`${params.type}==${params.sourId}==small`)

  let datasource = window.EarthViewer.dataSources.getByName(params.sourId)
  // console.log(datasource)
  // let entity = datasource[0].entities.values[0]
  let entity = datasource.length
    ? datasource[0].entities.values[0]
    : viewer.entities.getById(params.sourId)
  // let entity = datasource[0].entities.values.find(item => item.name == msid)z
  if (!entity) return
  // let name = entity.properties.entity_name._value
  // let pos = entity.position._value
  // let cartog =
  //   window.EarthViewer.scene.globe.ellipsoid.cartesianToCartographic(pos)
  // 判断类型
  let radius = params.radius || 18520
  let radius1 = params.radius1 || 74080
  let mixColor = params.color || [0, 0, 255]
  // window.EarthViewer.entities.add({
  //   id: `${params.type}==${params.sourId}==big`,
  //   position: new window.MSIMEarth.CallbackProperty(changePos, false),
  //   ellipse: {
  //     semiMinorAxis: radius,
  //     semiMajorAxis: radius,
  //     // material: new window.MSIMEarth.Color(
  //     //   mixColor[0] / 255,
  //     //   mixColor[1] / 255,
  //     //   mixColor[2] / 255,
  //     //   0.1
  //     // ),
  //     // material: new window.MSIMEarth.GradientCircleMaterialProperty({
  //     //   color: new window.MSIMEarth.Color(
  //     //     mixColor[0] / 255,
  //     //     mixColor[1] / 255,
  //     //     mixColor[2] / 255,
  //     //     0.3
  //     //   )
  //     // }),
  //     height: new window.MSIMEarth.CallbackProperty(changeHeight, false),
  //     outline: false,
  //     // heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND,
  //     outlineColor: new window.MSIMEarth.Color(
  //       mixColor[0] / 255,
  //       mixColor[1] / 255,
  //       mixColor[2] / 255,
  //       1
  //     ),
  //     outlineWidth: 2
  //   },
  //   show: false
  // })
  window.EarthViewer.entities.add({
    id: `${params.type}==${params.sourId}==small`,
    position: new window.MSIMEarth.CallbackProperty(changePos, false),
    ellipse: {
      semiMinorAxis: radius1,
      semiMajorAxis: radius1,
      material: new window.MSIMEarth.Color(
        mixColor[0] / 255,
        mixColor[1] / 255,
        mixColor[2] / 255,
        0.1
      ),
      // heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND,
      outline: true,
      height: new window.MSIMEarth.CallbackProperty(changeHeight, false),
      outlineColor: new window.MSIMEarth.Color(
        mixColor[0] / 255,
        mixColor[1] / 255,
        mixColor[2] / 255,
        1
      ),
      outlineWidth: 2
    },
    show: false
  })

  function changePos() {
    if (!entity.position) return
    let entityPos = entity.position._value
      ? entity.position._value
      : entity.position.getValue(window.EarthViewer.clock.currentTime)
    if (!entityPos) return
    return entityPos
  }
  function changeHeight() {
    // let position
    if (!entity.position) return
    let entityPos = entity.position._value
      ? entity.position._value
      : entity.position.getValue(window.EarthViewer.clock.currentTime)
    if (entityPos == undefined) {
      return
    }
    if (
      typeof entityPos.x === 'undefined' ||
      typeof entityPos.y === 'undefined' ||
      typeof entityPos.z === 'undefined'
    ) {
      return
    }
    if (!entityPos) return
    let entityCartographic =
      window.MSIMEarth.Cartographic.fromCartesian(entityPos)
    if (typeof entityCartographic.height === 'undefined') return
    return entityCartographic.height
  }
}

/**
 * 构建传感器动态范围
 * @param {object} sensors 传感器及其所在实体目标信息
 */
export function createSensors(sensors) {
  // 侦察范围对象
  sensors.forEach((item) => {
    createSensorRange({
      sourId: item,
      type: 'defendSurround',
      radius: item.radius,
      // radius1: 74080,
      // color: [120, 82, 26]
      color: item.color
    })
  })
}
/**
 * 创建传感器干扰效果
 * @param {*} params id:发射干扰效果的实体id targetId:干扰目标id
 */
export function createEllipsoidWedge(params) {
  // 先尝试清除同id实体
  // 获取发射源位置
  // 获取干扰目标位置
  // 构建干扰实体
  // let curPosition,newOrientation
  // let clocklister = viewer.clock.onTick.addEventListener(() => {
  //   // let position = viewer.dataSources
  //   //   .getByName("starlink2")[0]
  //   //   .entities.values[0].position.getValue(viewer.clock.currentTime);
  //   let curczml = window.viewer.dataSources.getByName('starlink2')[0]
  //   let curEn = curczml.entities.values[0]
  //   let curTime = viewer.clock.currentTime
  //   let fTime = Cesium.JulianDate.addSeconds(
  //     viewer.clock.currentTime,
  //     0.001 * viewer.clock.multiplier,
  //     new Cesium.JulianDate()
  //   )
  //   curPosition = curEn.position.getValue(curTime)
  //   // let fPosition = curEn.position.getValue(fTime)
  //   let fPosition = new Cesium.Cartesian3.fromDegrees(
  //     131.86763259996974,
  //     68.95839425353331,
  //     6000
  //   )
  //   const newVector2 = Cesium.Cartesian3.subtract(
  //     fPosition,
  //     curPosition,
  //     new Cesium.Cartesian3()
  //   )
  //   const newNormal = Cesium.Cartesian3.normalize(
  //     newVector2,
  //     new Cesium.Cartesian3()
  //   )
  //   const newRotationMatrix3 =
  //     Cesium.Transforms.rotationMatrixFromPositionVelocity(
  //       newVector2,
  //       newNormal,
  //       Cesium.Ellipsoid.WGS84
  //     )
  //   newOrientation =
  //     Cesium.Quaternion.fromRotationMatrix(newRotationMatrix3)
  //   // createFrustum.update(curPosition, reQ)
  // })
  // // ListenerCol.push({ key: 'starlink2frustum', value: clocklister })
  // var cf = function () {
  //   if (typeof newOrientation === 'undefined') return
  //   let or = Cesium.Transforms.headingPitchRollQuaternion(
  //     Cesium.Cartesian3.fromDegrees(-102.0, 35.0, 20000.0),
  //     new Cesium.HeadingPitchRoll(Cesium.Math.PI / 1.5, 0, 0.0)
  //   )
  //   return newOrientation
  // }
  // var cp = function () {
  //   if (typeof curPosition === 'undefined') return
  //   return curPosition
  // }
  // viewer.entities.add({
  //   name: 'Wedge',
  //   position: new Cesium.CallbackProperty(cp, false),
  //   orientation: new Cesium.CallbackProperty(cf, false),
  //   ellipsoid: {
  //     radii: new Cesium.Cartesian3(500000.0, 500000.0, 500000.0),
  //     innerRadii: new Cesium.Cartesian3(10000.0, 10000.0, 10000.0),
  //     minimumClock: Cesium.Math.toRadians(-15.0),
  //     maximumClock: Cesium.Math.toRadians(15.0),
  //     minimumCone: Cesium.Math.toRadians(75.0),
  //     maximumCone: Cesium.Math.toRadians(105.0),
  //     material: Cesium.Color.DARKCYAN.withAlpha(0.1),
  //     // material: new Cesium.PulseMaterialProperty({
  //     //   repeat: new Cesium.Cartesian2(1.0, 1.0),
  //     //   color: new Cesium.Color(1.0, 0.1, 0.1, 1.0), // new Cesium.Color(0.8, 0.1, 0.5, 1.0),
  //     //   flowSpeed: 35.0,
  //     //   transparent: true
  //     // }),
  //     // material: new Cesium.Stars1MaterialProperty({
  //     //   transparent: true
  //     // }),
  //     outline: true
  //   }
  // })
}
