/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2024-01-24 10:15:24
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2024-01-29 16:01:54
 * @FilePath: \LVC-SIMEngineEditor\src\utils\drawPolygon.js
 * @Description: 动态绘制多边形图层
 */
class drawPolygon {
  constructor(config) {
    this.drawPolygon = 0
    this.measurePolygon = null
    this.measureIds = []
    this.options = {
      id:
        config.id != undefined ? config.id : 'drawPolygon' + this.drawPolygon++,
      polygon: {
        hierarchy: [],
        heightReference: window.MSIMEarth.HeightReference.CLAMP_TO_GROUND,
        material: config.color
      }
    }
    this.positions = config.positions
    this.init()
  }
  init() {
    var self = this
    var _update = function () {
      return new window.MSIMEarth.PolygonHierarchy(self.positions)
    }
    //实时更新
    this.options.polygon.hierarchy = new window.MSIMEarth.CallbackProperty(
      _update,
      false
    )
    this.measurePolygon = window.EarthViewer.entities.add(this.options)
    self.measureIds.push(this.measurePolygon.id)
  }
  remove() {
    var self = this
    this.measureIds.forEach((element) => {
      window.EarthViewer.entities.removeById(element)
    })
  }
}

export default drawPolygon
