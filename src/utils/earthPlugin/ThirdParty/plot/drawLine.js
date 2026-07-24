/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2024-03-04 15:59:21
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2024-04-15 14:58:05
 * @FilePath: \missionEdit\src\utils\drawLine.js
 * @Description: 动态绘制线图层
 */
class drawLine {
  constructor(config) {
    this.drawLine = 0
    this.measureLine = null
    this.measureIds = []
    this.options = {
      id: config.id != undefined ? config.id : 'drawLine' + this.drawLine++,
      polyline: {
        show: true,
        positions: [],
        material: config.color,
        width: 2,
        clampToGround: true
      }
    }
    this.positions = config.positions
    this.init()
  }
  init() {
    var self = this
    var _update = function () {
      return self.positions
    }
    //实时更新
    this.options.polyline.positions = new window.MSIMEarth.CallbackProperty(
      _update,
      false
    )
    this.measureLine = window.EarthViewer.entities.add(this.options)
    self.measureIds.push(this.measureLine.id)
  }
  remove() {
    var self = this
    this.measureIds.forEach((element) => {
      window.EarthViewer.entities.removeById(element)
    })
  }
}

export default drawLine
