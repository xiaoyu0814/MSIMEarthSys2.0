class drawRect {
  constructor(viewer, config) {
    this.viewer = viewer
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
    this.measureRect = self.viewer.entities.add(this.options)
    self.measureIds.push(this.measureRect.id)
  }
  remove() {
    var self = this
    this.measureIds.forEach((element) => {
      self.viewer.entities.removeById(element)
    })
  }
}

export default drawRect
