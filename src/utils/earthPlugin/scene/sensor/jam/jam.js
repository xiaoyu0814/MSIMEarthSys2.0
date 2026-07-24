export default function () {
  const createJAM = (params) => {
    // params.id 'KJ-500'
    let entityTarget = window.EarthPlugn.entity._GetCZMLEntity(
      params.id,
      'MSIMEarthCZMLProcessContainer'
    )
    let frustumId = 'jam_sensor_ellipse' + params.id
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
      ellipsoid: {
        radii: new window.MSIMEarth.Cartesian3(radii, radii, radii),
        maximumCone: window.MSIMEarth.Math.PI_OVER_TWO,
        material: window.MSIMEarth.Color.YELLOW.withAlpha(0.3),
        outline: true
      }
    })
  }
  // 移除CCD类型sensor
  const removeJAM = (params) => {
    let frustumId = 'jam_sensor_ellipse' + params.id
    window.EarthViewer.entities.removeById(frustumId)
  }

  return { createJAM, removeJAM }
}
