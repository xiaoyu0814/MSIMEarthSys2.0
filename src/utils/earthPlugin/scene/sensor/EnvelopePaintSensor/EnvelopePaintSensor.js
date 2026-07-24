/*
 * @description:
 * @Version: 1.0
 * @Author: wx
 * @Date: 2025-09-05 14:39:10
 * @LastEditors: wx
 * @LastEditTime: 2025-09-05 14:40:49
 */
export default function () {
  // 转换后端角度到Cesium clock角度（弧度）
  function convertBackendAngleToCesiumClock(backendAngle) {
    const cesiumAngle = Math.PI / 2 - backendAngle
    // 归一化到 [0, 2π) 范围
    const normalized = cesiumAngle % (2 * Math.PI)
    return normalized < 0 ? normalized + 2 * Math.PI : normalized
  }

  // 转换后端FOV角度范围到Cesium clock范围
  function convertBackendFOVToCesiumClockRange(backendMin, backendMax) {
    const convMin = convertBackendAngleToCesiumClock(backendMin)
    const convMax = convertBackendAngleToCesiumClock(backendMax)
    // 交换最小/最大值以保持扇形方向一致
    return {
      minimumClock: convMax,
      maximumClock: convMin
    }
  }

  // 初始化EnvelopePaintSensor
  const createEnvelopePaintSensor = (params, volumesData) => {
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
      console.log('Mode.Beams[0]', Mode.Beams[0])

      let id = entityTarget.id + '_envelope_paint_sensor'
      window.EarthViewer.entities.removeById(id)
      // 3. 绘制补集范围
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
          minimumClock: -(Mode.Beams[0].FOVAzimuthMax - Math.PI / 2),
          maximumClock: -Mode.Beams[0].FOVAzimuthMin + Math.PI / 2,
          // minimumCone: Mode.Beams[0].AzimuthMax * 0.25,
          // maximumCone: window.MSIMEarth.Math.PI_OVER_TWO,
          maximumCone:
            window.MSIMEarth.Math.PI_OVER_TWO - Mode.Beams[0].FOVElevationMax, //window.MSIMEarth.Math.toRadians()
          minimumCone:
            window.MSIMEarth.Math.PI_OVER_TWO - Mode.Beams[0].FOVElevationMin, //window.MSIMEarth.Math.toRadians()
          material: params.color || window.MSIMEarth.Color.RED.withAlpha(0.1),
          stackPartitions: 16,
          slicePartitions: 16,
          outline: true
        }
      })
    })
  }
  // 移除EnvelopePaintSensor
  const removeEnvelopePaintSensor = (id) => {
    window.EarthViewer.entities.removeById(id)
  }

  return { createEnvelopePaintSensor, removeEnvelopePaintSensor }
}
