/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2024-01-24 10:15:24
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2024-06-15 11:50:19
 * @FilePath: \LVC-SIMEngineEditor\src\utils\drawPolygon.js
 * @Description: 动态绘制矩形图层
 */
class drawCircular {
  constructor(config) {
    this.drawCircular = 0
    this.measureCircular = null
    this.measureIds = []
    this.options = {
      id:
        config.id != undefined
          ? config.id
          : 'drawCircular' + this.drawCircular++,
      position: config.position,
      ellipse: {
        semiMinorAxis: 10000,
        semiMajorAxis: 10000,
        height: 0,
        material: config.color.withAlpha(0.2),
        outline: true, // height must be set for outlines to display
        outlineColor: config.color
      }
    }
    this.semiMinorAxis = config.semiMinorAxis
    this.semiMajorAxis = config.semiMajorAxis
    this.init()
  }
  init() {
    const self = this
    var _update1 = function () {
      return self.semiMinorAxis
    }
    var _update2 = function () {
      return self.semiMajorAxis
    }
    //实时更新polyline.positions
    this.options.ellipse.semiMinorAxis = new window.MSIMEarth.CallbackProperty(
      _update1,
      false
    )
    this.options.ellipse.semiMajorAxis = new window.MSIMEarth.CallbackProperty(
      _update2,
      false
    )
    this.measureCircular = window.EarthViewer.entities.add(this.options)
    this.measureIds.push(this.measureCircular.id)
  }
  remove() {
    this.measureIds.forEach((element) => {
      window.EarthViewer.entities.removeById(element)
    })
  }
}

export default drawCircular
