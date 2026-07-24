/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2025-08-13 14:52:52
 * @LastEditors: ZX Li
 * @LastEditTime: 2025-09-08 14:40:30
 */
import store from '@/store'
export default function () {
  const createEW_Radar = (params) => {
    // params.id 'KJ-500'
    let entityTarget = window.EarthPlugn.entity._GetCZMLEntity(
      params.id,
      'MSIMEarthCZMLProcessContainer'
    )
    let frustumId = 'ew_radar_sensor_ellipse' + params.id
    window.EarthViewer.entities.removeById(frustumId)
    let getPosition = function () {
      let currentTime = window.EarthViewer.clock.currentTime
      let satellitePosition = entityTarget.position.getValue(currentTime)
      if (window.MSIMEarth.defined(satellitePosition)) return satellitePosition
    }
    let radii = params.RangeMax || 100000

    let jamAShow = false
    let curJamArr = store.state.AFSIMModule.jamArr
    curJamArr.forEach((e) => {
      if (e === params.id) {
        // 当前目标在被干扰目标集合中，需要使用被干扰材质
        jamAShow = true
      }
    })
    if (jamAShow) {
      window.EarthViewer.entities.add({
        id: frustumId,
        position: new window.MSIMEarth.CallbackProperty(getPosition, false),
        ellipse: {
          semiMinorAxis: radii,
          semiMajorAxis: radii,
          extrudedHeight: 20000.0,
          // rotation: window.MSIMEarth.Math.toRadians(45),
          // material: new window.MSIMEarth.NoSignalMaterialProperty({
          //   transparent: true,
          //   color: params.color,
          //   // color: new window.MSIMEarth.Color(80 / 255, 255 / 255, 50 / 255, 0.3),
          //   repeat: new window.MSIMEarth.Cartesian2(0.1, 0.1)
          // }), //window.MSIMEarth.Color.BLUE.withAlpha(0.1),
          material: params.color || window.MSIMEarth.Color.WHITE.withAlpha(0.1),
          outline: true
        },
        show: store.state.AFSIMModule.rw_radarShow
      })
      return
    }
    window.EarthViewer.entities.add({
      id: frustumId,
      position: new window.MSIMEarth.CallbackProperty(getPosition, false),
      ellipse: {
        semiMinorAxis: radii,
        semiMajorAxis: radii,
        extrudedHeight: 20000.0,
        // rotation: window.MSIMEarth.Math.toRadians(45),
        material: params.color || window.MSIMEarth.Color.WHITE.withAlpha(0.1),
        outline: true
      },
      show: store.state.AFSIMModule.rw_radarShow
    })
  }
  const createEW_RadarJam = (params) => {
    console.log('创建被干扰RE_Radar包络', params.id)
    // params.id 'KJ-500'
    let entityTarget = window.EarthPlugn.entity._GetCZMLEntity(
      params.id,
      'MSIMEarthCZMLProcessContainer'
    )
    let frustumId = 'ew_radar_sensor_ellipse' + params.id
    window.EarthViewer.entities.removeById(frustumId)
    let getPosition = function () {
      let currentTime = window.EarthViewer.clock.currentTime
      let satellitePosition = entityTarget.position.getValue(currentTime)
      if (window.MSIMEarth.defined(satellitePosition)) return satellitePosition
    }
    let radii = params.RangeMax || 100000
    window.EarthViewer.entities.add({
      id: frustumId,
      position: new window.MSIMEarth.CallbackProperty(getPosition, false),
      ellipse: {
        semiMinorAxis: radii,
        semiMajorAxis: radii,
        extrudedHeight: 20000.0,
        // rotation: window.MSIMEarth.Math.toRadians(45),
        material: new window.MSIMEarth.NoSignalMaterialProperty({
          transparent: true,
          color: new window.MSIMEarth.Color(0 / 255, 128 / 255, 255 / 255, 0.3),
          // color: new window.MSIMEarth.Color(80 / 255, 255 / 255, 50 / 255, 0.3),
          repeat: new window.MSIMEarth.Cartesian2(0.1, 0.1)
        }), //window.MSIMEarth.Color.BLUE.withAlpha(0.1),
        outline: true
      },
      show: store.state.AFSIMModule.rw_radarShow
    })
  }
  // 移除ew_radar类型sensor
  const removeEW_Radar = (params) => {
    let frustumId = 'ew_radar_sensor_ellipse' + params
    // 移除entity
    window.EarthViewer.entities.removeById(frustumId)
    // 移除primitive
    let targetPrimitive
    window.EarthViewer.scene.primitives._primitives.forEach((p) => {
      if (p.id && p.id === frustumId) {
        targetPrimitive = p
      }
    })
    // this.viewer.scene.primitives.remove(targetPrimitive)
    window.EarthViewer.scene.primitives.remove(targetPrimitive)
  }

  // 实体被干扰
  const ew_radarJam = (params, volumesData) => {
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
      let id = entityTarget.id + '_ew_radar'
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

  return {
    createEW_Radar,
    createEW_RadarJam,
    removeEW_Radar,
    ew_radarJam
  }
}
