/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2024-01-24 10:15:24
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2024-04-15 11:17:54
 * @FilePath: \LVC-SIMEngineEditor\src\utils\drawPolygon.js
 * @Description: 动态绘制矩形图层
 */
class drawRect {
  constructor(config) {
    this.drawRect = 0
    this.measureRect = null
    this.measureIds = []
    this.options = {
      id: config.id != undefined ? config.id : 'drawRect' + this.drawRect++,
      rectangle: {
        coordinates: {},
        material: config.color,
        height: 0
      }
    }
    this.positions = config.positions
    this.init()
  }
  init() {
    var self = this
    var _update = function () {
      return window.MSIMEarth.Rectangle.fromCartesianArray(self.positions)
    }
    //实时更新polyline.positions
    this.options.rectangle.coordinates = new window.MSIMEarth.CallbackProperty(
      _update,
      false
    )
    this.measureRect = window.EarthViewer.entities.add(this.options)
    self.measureIds.push(this.measureRect.id)
  }
  remove() {
    this.measureIds.forEach((element) => {
      window.EarthViewer.entities.removeById(element)
    })
  }
}

export default drawRect
