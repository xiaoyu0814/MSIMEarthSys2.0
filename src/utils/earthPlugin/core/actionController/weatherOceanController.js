import { LayerTileImage } from '@/utils/earthPlugin/layers/index'
import store from '@/store'
/**
 *
 * @param {*} options
 */
function WeatherOceanController(options) {
  this.earth = options.earth
  this.viewer = options.viewer
  this.objArr = [] //存放对象
}

/**
 * 降水加载
 *
 * @param {Array} options
 */
WeatherOceanController.prototype.loadPrePData = async (options) => {
  const oceanCurrentLayer = await createTileLayer(options.tileUrl, '降水')
  store.commit('setWeatherOcanLayers', [oceanCurrentLayer])
}

/**
 * 降水图层删除
 *
 * @param {Array} options
 */
WeatherOceanController.prototype.removePrePData = async (options) => {
  removeAllTile(options.layers)
}
// 创建色斑图图层
const createTileLayer = async (tileUrl, layerName) => {
  let viewer = window.EarthViewer
  let layer = null
  // 色斑图
  layer = new LayerTileImage()
  layer._opt = {
    name: layerName,
    type: 'tile',
    visible: true,
    url: tileUrl
  }
  await layer.load({
    url: tileUrl
  })
  layer.brightness = 0.64
  layer.addToMap(viewer)
  return layer
}

// 销毁图层
const removeAllTile = function (layers) {
  for (let i = layers.length - 1; i >= 0; i--) {
    layers[i].remove()
    layers.splice(i, 1)
  }
}

export default WeatherOceanController
