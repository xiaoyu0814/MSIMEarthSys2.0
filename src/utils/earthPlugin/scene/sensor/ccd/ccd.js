import store from '@/store/index'

export default function () {
  const createCCD = (params) => {
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
    let computeOrientation = function () {
      // 获取当前场景时间
      let curTime = window.EarthViewer.clock.currentTime
      // 获取过去时
      let fTime = window.MSIMEarth.JulianDate.addSeconds(
        curTime,
        0.001 * window.EarthViewer.clock.multiplier,
        new window.MSIMEarth.JulianDate()
      )
      // 计算当前位置和过去时的位置差
      let curPosition = entityTarget.position.getValue(curTime)
      let fPosition = entityTarget.position.getValue(fTime)

      // 计算当前位置和过去时的位置差向量
      const newVector = window.MSIMEarth.Cartesian3.subtract(
        fPosition,
        curPosition,
        new window.MSIMEarth.Cartesian3()
      )
      // 归一化位置差向量
      const newNormal = window.MSIMEarth.Cartesian3.normalize(
        newVector,
        new window.MSIMEarth.Cartesian3()
      )
      // 计算旋转矩阵
      const newRotationMatrix3 =
        window.MSIMEarth.Transforms.rotationMatrixFromPositionVelocity(
          newVector,
          newNormal,
          window.MSIMEarth.Ellipsoid.WGS84
        )
      // 从旋转矩阵计算四元数
      let newOrientation =
        window.MSIMEarth.Quaternion.fromRotationMatrix(newRotationMatrix3)
      return newOrientation
    }
    volumesData.Modes.forEach((Mode) => {
      let id = entityTarget.id + '_ccd'
      window.EarthViewer.entities.removeById(id)
      window.EarthViewer.entities.add({
        id: id,
        position: new window.MSIMEarth.CallbackProperty(getPosition, false),
        orientation: new window.MSIMEarth.CallbackProperty(
          computeOrientation,
          false
        ),
        ellipsoid: {
          radii: new window.MSIMEarth.Cartesian3(
            Mode.Beams[0].RangeMax,
            Mode.Beams[0].RangeMax,
            Mode.Beams[0].RangeMax
          ),
          innerRadii: new window.MSIMEarth.Cartesian3(10.0, 10.0, 10.0),
          minimumCone: Mode.Beams[0].AzimuthMax * 0.25,
          maximumCone: window.MSIMEarth.Math.PI_OVER_TWO,
          material: params.color || window.MSIMEarth.Color.WHITE.withAlpha(0.1), //如果是白色则说明没有传进来颜色参数
          stackPartitions: 16,
          slicePartitions: 16,
          outline: true
        }
      })
    })
  }
  // 移除CCD类型sensor
  const removeCCD = (id) => {
    let frustumId = 'CCD_sensor_frustum' + id
    frustumFalseArr.push(frustumId)
    // 移除entity
    window.EarthViewer.entities.removeById(frustumId)
    // 移除primitive
    let targetPrimitive
    window.EarthViewer.scene.primitives._primitives.forEach((p) => {
      if (p.id && p.id === frustumId) {
        targetPrimitive = p
      }
    })
    console.log('获取要清楚的视锥', targetPrimitive)
    // this.viewer.scene.primitives.remove(targetPrimitive)
    window.EarthViewer.scene.primitives.remove(targetPrimitive)

    window.EarthViewer.entities.removeById(id)
  }

  const computeAngle = (curEn) => {
    // let curTime = window.EarthViewer.clock.currentTime
    // let fTime = window.MSIMEarth.JulianDate.addSeconds(
    //   window.EarthViewer.clock.currentTime,
    //   0.001 * window.EarthViewer.clock.multiplier,
    //   new window.MSIMEarth.JulianDate()
    // )
    // let curPosition = curEn.position.getValue(curTime)
    // let fPosition = curEn.position.getValue(fTime)

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
    // const newVector2 = window.MSIMEarth.Cartesian3.subtract(
    //   fPosition,
    //   curPosition,
    //   new window.MSIMEarth.Cartesian3()
    // )
    // const newNormal = window.MSIMEarth.Cartesian3.normalize(
    //   newVector2,
    //   new window.MSIMEarth.Cartesian3()
    // )
    // const newRotationMatrix3 =
    //   window.MSIMEarth.Transforms.rotationMatrixFromPositionVelocity(
    //     newVector2,
    //     newNormal,
    //     window.MSIMEarth.Ellipsoid.WGS84
    //   )
    // newOrientation =
    //   window.MSIMEarth.Quaternion.fromRotationMatrix(newRotationMatrix3)
    let reQ = createOrientationFromPoints(curPosition, fPosition)
    return { curPosition, reQ }
  }

  const createOrientationFromPoints = (pointA, pointB) => {
    // let pointA = window.MSIMEarth.Cartesian3.fromDegrees(110, 30, 100)
    // let pointB = window.MSIMEarth.Cartesian3.fromDegrees(120, 40, 10000)

    let m = getModelMatrix(pointA, pointB)
    let hpr = getHeadingPitchRoll(m)
    hpr.pitch = hpr.pitch + 3.14 / 2 + 3.14
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

  const createCCDJam = (params, volumesData) => {
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
      let id = entityTarget.id + '_ccd'
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
          // minimumCone: Mode.Beams[0].AzimuthMax * 0.25,
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

  return { createCCD, removeCCD, createCCDJam }
}
