/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2025-09-05 15:41:51
 * @LastEditors: ZX Li
 * @LastEditTime: 2025-09-05 15:49:33
 */
export default function () {
  // 初始化Milds
  const createMilds = (params, volumesData) => {
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
      let id = entityTarget.id + '_milds'
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
          material: params.color || window.MSIMEarth.Color.RED.withAlpha(0.1),
          stackPartitions: 16,
          slicePartitions: 16,
          outline: true
        }
      })
    })
  }
  // 实体被干扰
  const mildsJam = (params, volumesData) => {
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
      let id = entityTarget.id + '_milds'
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

  const removeMilds = (id) => {
    window.EarthViewer.entities.removeById(id)
  }

  return { createMilds, mildsJam, removeMilds }
}
