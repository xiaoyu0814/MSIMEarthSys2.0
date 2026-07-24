/**
 * 添加
 */
export function createHumidity(config) {
  let DC = new window.EarthPlugn.DCPrimitive({
    viewer: window.EarthViewer,
    earth: window.MSIMEarth
  })

  const humidityTexturePaths = [
    { name: config.name || 'HumidityTest', path: config.path || '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_0000_z_interp_crop_100m_lat_vertical_16x16_green.png' }
  ]

  const humidityConfig = {
    xmin: config.xmin || 121.2,
    xmax: config.xmax || 121.4,
    ymin: config.ymin || 24.9,
    ymax: config.ymax || 25.1,
    zmin: config.zmin || 100.0,
    zmax: config.zmax || 15000.0,
    steps: config.steps || 320.0,
    alphaCorrection: config.alphaCorrection || 0.6,
    humidityLowColor: config.humidityLowColor || '#0000ff',
    humidityMidColor: config.humidityMidColor || '#00ffff',
    humidityHighColor: config.humidityHighColor || '#84ff84',
    gamma: config.gamma || 0.6,
    alphaPower: config.alphaPower || 2.0,
    minThreshold: config.minThreshold || 0.05,
    maxThreshold: config.maxThreshold || 1.0,
    opacityScale: config.opacityScale || 0.18,
    dataCompression: config.dataCompression || 0.5,
    texturePath: config.texturePath || humidityTexturePaths[0].path,
    currentTextureIndex: config.currentTextureIndex || 0,
    texturePaths: config.texturePaths || humidityTexturePaths,
    // 剖切参数
    clipXEnabled: config.clipXEnabled || false,
    clipXMin: config.clipXMin || 0.0,
    clipXMax: config.clipXMax || 1.0,
    clipYEnabled: config.clipYEnabled || false,
    clipYMin: config.clipYMin || 0.0,
    clipYMax: config.clipYMax || 1.0,
    clipZEnabled: config.clipZEnabled || false,
    clipZMin: config.clipZMin || 0.0,
    clipZMax: config.clipZMax || 1.0,
    // 颜色过滤参数
    colorFilterEnabled: config.colorFilterEnabled || false,
    targetColor: config.targetColor || '#ffffff',
    colorTolerance: config.colorTolerance || 0.3,
    id: config.id || 'humidity_Test',
  }

  DC.createHumidityTextureAliasOD(humidityConfig)
}

/**
 * 基于uniform动态切换材质
 * @param {*} newPath 
 * @returns 
 */
const switchTexture = async (config) => {
  if (config.newPath) {
    //  && window.humidityInstance && window.humidityInstance.primitive && window.humidityInstance.primitive.appearance
    let humidityPrimitive
    for (let primitive of window.EarthViewer.scene.primitives._primitives) {
      if (primitive.id === config.id || 'humidity_Test') {
        humidityPrimitive = primitive
      }
    }
    if (typeof humidityPrimitive === 'undefined') return
    const earth = window.MSIMEarth
    const viewer = window.EarthViewer
    earth.Resource.createIfNeeded(config.newPath)
      .fetchImage()
      .then((res) => {
        const cubeTex = new earth.Texture({
          context: viewer.scene.context,
          source: res
        })
        cubeTex.type = 'sampler2D'
        humidityPrimitive.appearance.uniforms.cubeTex = cubeTex
      })
      .catch((error) => {
        console.error('加载湿度纹理失败：', error)
      })
  }
}