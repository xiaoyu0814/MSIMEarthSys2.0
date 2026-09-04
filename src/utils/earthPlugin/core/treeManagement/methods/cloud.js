/*
 * @Author: chenguopeng2 chenguopeng.piesat.cn
 * @Date: 2026-07-14 13:56:36
 * @LastEditors: chenguopeng2 chenguopeng.piesat.cn
 * @LastEditTime: 2026-08-07 13:49:24
 * @FilePath: \MSIMEarthSystem\src\utils\earthPlugin\core\treeManagement\methods\cloud.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 创建云层
// @param {*} config 云层配置
// @returns 云层实体

export function createCloud(config) {
  let DC = new window.EarthPlugn.DCPrimitive({
    viewer: window.EarthViewer,
    earth: window.MSIMEarth
  })

  const cloudTexturePaths = [
    {
      name: config.name || 'cloudTestTexture',
      path: config.path || '/static/image/texture/CLOUDpicture_120.75-122.75__22-25/TCC_2024-02-05_0300_z_interp_crop_100m_crop_lat_vertical_16x16.png'
    }
  ]

  const cloudConfig = {
    xmin: config.xmin || 120.8,
    xmax: config.xmax || 121.6,
    ymin: config.ymin || 24.5,
    ymax: config.ymax || 25.3,
    zmin: config.zmin || 4000.0,
    zmax: config.zmax || 68000.0,
    steps: config.steps || 320.0,
    alphaCorrection: config.alphaCorrection || 0.9,
    humidityLowColor: config.humidityLowColor || '#0000ff',
    humidityMidColor: config.humidityMidColor || '#00ffff',
    humidityHighColor: config.humidityHighColor || '#84ff84',
    gamma: config.gamma || 0.9,
    alphaPower: config.alphaPower || 3.0,
    minThreshold: config.minThreshold || 0.05,
    maxThreshold: config.maxThreshold || 1.0,
    opacityScale: config.opacityScale || 0.48,
    dataCompression: config.dataCompression || 0.5,
    texturePath: config.texturePath || cloudTexturePaths[0].path,
    currentTextureIndex: config.currentTextureIndex || 0,
    texturePaths: config.texturePaths || cloudTexturePaths,
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
    id: config.id || 'cloud_Test'
  }
  DC.createCloudTextureAliasOD(cloudConfig)
}

// 移除云层
// @param {*} id 云层实体id
// @returns 无
export function removeCloud(id) {
  window.EarthViewer.scene.primitives._primitives.forEach((item) => {
    if (item.id === id) {
      window.EarthViewer.scene.primitives.remove(item)
    }
  })
}