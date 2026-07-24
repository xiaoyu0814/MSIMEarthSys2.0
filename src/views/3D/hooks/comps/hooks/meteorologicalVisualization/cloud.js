

export function createCloud(config) {
  let DC = new window.EarthPlugn.DCPrimitive({
    viewer: window.EarthViewer,
    earth: window.MSIMEarth
  })
  let cloudConfig = {
    xmin: config.xmin || 116.5,
    xmax: config.xmax || 123.5,
    ymin: config.ymin || 20.8,
    ymax: config.ymax || 25.8,
    zmin: config.zmin || 1000.0,
    zmax: config.zmax || 15000.0,
    alphaCorrection: config.alphaCorrection || 1.82
  }
  cusP.createTextureAtlas(
    config.id || 'tw_cloud',
    config.texturePath || './static/image/texture/CLOUDpicture_120.75-122.75__22-25/TCC_2024-02-05_0100_z_interp_crop_100m_crop_lat_vertical_16x16.png',
    cloudConfig
  )
}

export function removeCloud(config) {
  let DC = new window.EarthPlugn.DCPrimitive({
    viewer: window.EarthViewer,
    earth: window.MSIMEarth
  })
  cusP.removeTextureAtlasPrimitive(config.id || 'tw_cloud')
}