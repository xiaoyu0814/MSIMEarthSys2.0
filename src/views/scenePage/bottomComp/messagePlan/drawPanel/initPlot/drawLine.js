class drawLine {
  constructor(viewer, config) {
    this.viewer = viewer
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
    this.measureLine = self.viewer.entities.add(this.options)
    self.measureIds.push(this.measureLine.id)
  }
  remove() {
    var self = this
    this.measureIds.forEach((element) => {
      self.viewer.entities.removeById(element)
    })
  }
}

export default drawLine
