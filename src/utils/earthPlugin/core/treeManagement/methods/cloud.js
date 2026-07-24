// 创建云层
// @param {*} config 云层配置
// @returns 云层实体
import { getTextureImage } from '@/service/weather'

export function createCloud(config) {
  let DC = new window.EarthPlugn.DCPrimitive({
    viewer: window.EarthViewer,
    earth: window.MSIMEarth
  })

  const humidityTexturePaths = [
    {
      name: config.name || 'cloudTestTexture',
      path: config.path || '/static/image/texture/CLOUDpicture_120.75-122.75__22-25/TCC_2024-02-05_0300_z_interp_crop_100m_crop_lat_vertical_16x16.png'
    }
  ]

  // 无云遮挡配置
  //           cloudOptions.name = cloudList[4].key
  //         cloudOptions.path = cloudList[4].path
  //   xmin: config.xmin || 120.5,
  // xmax: config.xmax || 122,
  // ymin: config.ymin || 23.33,
  // ymax: config.ymax || 25.43,

  // 有云遮挡配置
  //         cloudOptions.name = cloudList[1].key
  //         cloudOptions.path = cloudList[1].path
  // xmin: config.xmin || 120.3,
  // xmax: config.xmax || 121.8,
  // ymin: config.ymin || 23.33,
  // ymax: config.ymax || 25.43,

  const humidityConfig = {
    xmin: config.xmin || 120.3,
    xmax: config.xmax || 121.8,
    ymin: config.ymin || 23.33,
    ymax: config.ymax || 25.43,
    zmin: config.zmin || 8000.0,
    zmax: config.zmax || 38000.0,
    steps: config.steps || 320.0,
    alphaCorrection: config.alphaCorrection || 0.9,
    humidityLowColor: config.humidityLowColor || '#0000ff',
    humidityMidColor: config.humidityMidColor || '#00ffff',
    humidityHighColor: config.humidityHighColor || '#84ff84',
    gamma: config.gamma || 0.6,
    alphaPower: config.alphaPower || 3.0,
    minThreshold: config.minThreshold || 0.05,
    maxThreshold: config.maxThreshold || 1.0,
    opacityScale: config.opacityScale || 0.48,
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
    id: config.id || 'cloud_Test'
  }

  // // 设置相机位置
  // const centerLon = (humidityConfig.xmin + humidityConfig.xmax) / 2;
  // const centerLat = (humidityConfig.ymin + humidityConfig.ymax) / 2;
  // const lonDiff = humidityConfig.xmax - humidityConfig.xmin;
  // const latDiff = humidityConfig.ymax - humidityConfig.ymin;
  // const maxDiff = Math.max(lonDiff, latDiff);
  // const cameraHeight = maxDiff * 111000 * 3;

  // EarthViewer.camera.setView({
  //   destination: MSIMEarth.Cartesian3.fromDegrees(centerLon, centerLat, cameraHeight),
  // });

  DC.createCloudTextureAliasOD(humidityConfig)
  // switchTexture({
  //   newPath:
  //     '/static/image/texture/ICEpicture_BLUE_new/RH_2024-02-05_0400_z_interp_crop_100m_lat_vertical_16x16_green.png',
  //   id: 'humidity_Test'
  // })
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

export const getCloudList = (hours) => {
  if(hours > 23){
    console.log(weatherDataConfig.cloud.texturePaths)
    return
  }
  let time = hours < 10 ? '0' + hours : hours
  let oldHours = hours
  if(oldHours == 0){
    oldHours = 24
  }
  let oldtime = oldHours - 1 < 10 ? '0' + (oldHours - 1) : oldHours - 1
  const params = {
    "request_type": "texture",
    "variable": "TCC",
    "datetime": `2024-02-05 ${time}:00:00`
  }
  getTextureImage(params).then((res) => {
    if (res.status == "success") {
      let temp = {
        name: `cloud_${time}00`,
        time: `${oldtime}-${time}`,
        path: res.texture_data.image_url
      }
      weatherDataConfig.cloud.texturePaths[hours] = temp
    }
    getCloudList(hours + 1)
  }).catch((err) => {
    console.error('获取云层纹理图片失败', err)
  })
}