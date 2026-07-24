export default function () {
  const createIR = (params) => {
    // params.id 'KJ-500'
    let entityTarget = window.EarthPlugn.entity._GetCZMLEntity(
      params.id,
      'MSIMEarthCZMLProcessContainer'
    )
    let res = computeAngle(entityTarget)
    if (res.curPosition && res.reQ) {
      let frustumId = 'IR_sensor_frustum' + params.id
      window.EarthViewer.entities.removeById(frustumId)
      var getOrientation = function () {
        let resSet = computeAngle(entityTarget)
        return resSet.reQ
      }
      var getPosition = function () {
        let resSet = computeAngle(entityTarget)
        return resSet.curPosition
      }
      let radii = params.RangeMax || 100000
      window.EarthViewer.entities.add({
        id: frustumId,
        position: new window.MSIMEarth.CallbackProperty(getPosition, false),
        orientation: new window.MSIMEarth.CallbackProperty(
          getOrientation,
          false
        ),
        ellipsoid: {
          radii: new window.MSIMEarth.Cartesian3(radii, radii, radii),
          innerRadii: new window.MSIMEarth.Cartesian3(10.0, 10.0, 10.0),
          // minimumClock: window.MSIMEarth.Math.toRadians(
          //   params.AzimuthMin || -15.0
          // ),
          // maximumClock: window.MSIMEarth.Math.toRadians(
          //   params.AzimuthMax || 15.0
          // ),
          minimumClock: window.MSIMEarth.Math.toRadians(-15.0),
          maximumClock: window.MSIMEarth.Math.toRadians(15.0),
          minimumCone: window.MSIMEarth.Math.toRadians(75.0),
          maximumCone: window.MSIMEarth.Math.toRadians(105.0),
          material: params.color || window.MSIMEarth.Color.WHITE.withAlpha(0.1),
          // material: new Cesium.PulseMaterialProperty({
          //   repeat: new Cesium.Cartesian2(1.0, 1.0),
          //   color: new Cesium.Color(1.0, 0.1, 0.1, 1.0), // new Cesium.Color(0.8, 0.1, 0.5, 1.0),
          //   flowSpeed: 35.0,
          //   transparent: true
          // }),
          // material: new Cesium.Stars1MaterialProperty({
          //   transparent: true
          // }),
          outline: true
        }
      })
    }
  }
  // 移除IR类型sensor
  const removeIR = (id) => {
    // let frustumId = 'IR_sensor_frustum' + id.id
    // // 移除entity
    // window.EarthViewer.entities.removeById(frustumId)
    // // 移除primitive
    // let targetPrimitive
    // window.EarthViewer.scene.primitives._primitives.forEach((p) => {
    //   if (p.id && p.id === frustumId) {
    //     targetPrimitive = p
    //   }
    // })
    // // this.viewer.scene.primitives.remove(targetPrimitive)
    // window.EarthViewer.scene.primitives.remove(targetPrimitive)
    window.EarthViewer.entities.removeById(id)
  }

  const computeAngle = (curEn) => {
    // 1.获取实体对象路径点位集合
    let positions = curEn.position._property._values
    if (!positions || positions.length < 6) {
      console.log('未能获取到用来定向的位置数组', positions)
      return
    }
    // 截取最后两个点位作为计算方位的参数点位
    let computeArr = positions.slice(positions.length - 6)
    let curPosition = new window.MSIMEarth.Cartesian3(
      computeArr[0],
      computeArr[1],
      computeArr[2]
    )
    let fPosition = new window.MSIMEarth.Cartesian3(
      computeArr[3],
      computeArr[4],
      computeArr[5]
    )
    let reQ = createOrientationFromPoints(curPosition, fPosition)
    return { curPosition, reQ }
  }

  const createOrientationFromPoints = (curPosition, fPosition) => {
    const newVector2 = window.MSIMEarth.Cartesian3.subtract(
      fPosition,
      curPosition,
      new window.MSIMEarth.Cartesian3()
    )
    const newNormal = window.MSIMEarth.Cartesian3.normalize(
      newVector2,
      new window.MSIMEarth.Cartesian3()
    )
    const newRotationMatrix3 =
      window.MSIMEarth.Transforms.rotationMatrixFromPositionVelocity(
        newVector2,
        newNormal,
        window.MSIMEarth.Ellipsoid.WGS84
      )
    let orientation =
      window.MSIMEarth.Quaternion.fromRotationMatrix(newRotationMatrix3)
    return orientation
  }
  const createIRJam = (params, volumesData) => {
    let entityTarget = window.EarthPlugn.entity._GetCZMLEntity(
      params.name,
      'MSIMEarthCZMLProcessContainer'
    )
    let getPosition = function () {
      let currentTime = window.EarthViewer.clock.currentTime
      if (!currentTime) return
      let curPosition = entityTarget.position.getValue(currentTime)
      if (!curPosition) return
      return curPosition
    }
    volumesData.Modes.forEach((Mode) => {
      let id = entityTarget.id + '_IR'
      window.EarthViewer.entities.removeById(id)
      window.EarthViewer.entities.add({
        id: id,
        position: new window.MSIMEarth.CallbackProperty(getPosition, false),
        ellipsoid: {
          radii: new window.MSIMEarth.Cartesian3(
            Mode.Beams[0].RangeMax,
            Mode.Beams[0].RangeMax,
            Mode.Beams[0].RangeMax
          ),
          innerRadii: new window.MSIMEarth.Cartesian3(10.0, 10.0, 10.0),
          // minimumClock:
          //   window.MSIMEarth.Math.PI * 2 -
          //   Mode.Beams[0].FOVAzimuthMax +
          //   window.MSIMEarth.Math.ONE_OVER_TWO_PI,
          // maximumClock:
          //   window.MSIMEarth.Math.PI * 2 -
          //   Mode.Beams[0].FOVAzimuthMin +
          //   window.MSIMEarth.Math.ONE_OVER_TWO_PI,
          minimumCone: Mode.Beams[0].AzimuthMax * 0.25,
          maximumCone: window.MSIMEarth.Math.PI_OVER_TWO,
          material: new window.MSIMEarth.NoSignalMaterialProperty({
            color: window.MSIMEarth.Color.BLUE,
            repeat: new window.MSIMEarth.Cartesian2(0.1, 0.1)
          }),
          stackPartitions: 16,
          slicePartitions: 16,
          outline: true
        }
      })
    })
  }

  return { createIR, removeIR, createIRJam }
}
