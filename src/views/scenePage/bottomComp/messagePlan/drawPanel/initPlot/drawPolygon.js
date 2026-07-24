class drawPolygon {
  constructor(viewer, config) {
    this.viewer = viewer
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
    this.measurePolygon = self.viewer.entities.add(this.options)
    self.measureIds.push(this.measurePolygon.id)
  }
  remove() {
    var self = this
    this.measureIds.forEach((element) => {
      self.viewer.entities.removeById(element)
    })
  }
}

export default drawPolygon
