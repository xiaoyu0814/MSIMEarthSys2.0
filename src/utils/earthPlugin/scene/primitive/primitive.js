/**
 * primitive数据的加载、更新、清除等
 * @param
 */
export default class primitive {
  constructor(config) {
    this.earth = config.earth
    this.viewer = config.viewer
  }
  /**
   * primitive数据的加载
   * @param
   */
  addPrimitive(data) {
    let rectangleInstanceArr = []
    //定义折线几何
    let polyline = new this.earth.PolylineGeometry({
      positions: this.earth.Cartesian3.fromDegreesArray(data),
      width: 2.0,
      vertexFormat: this.earth.PolylineColorAppearance.VERTEX_FORMAT
    })
    var rectangleInstance = new this.earth.GeometryInstance({
      geometry: polyline,
      attributes: {
        color: this.earth.ColorGeometryInstanceAttribute.fromColor(
          this.earth.Color.GREEN
        )
      }
    })
    rectangleInstanceArr.push(rectangleInstance)
    let primitive = this.viewer.scene.primitives.add(
      new this.earth.Primitive({
        geometryInstances: rectangleInstanceArr,
        //折线外观
        appearance: new this.earth.PolylineColorAppearance({
          translucent: false
        }),
        asynchronous: false
      })
    )
    return primitive
  }
  addPrimitive4(data, val) {
    let colorGeometry = this.earth.ColorGeometryInstanceAttribute.fromColor(
      this.earth.Color.GRAY.withAlpha(0.3)
    )
    let width = 1.0
    switch (val) {
      case '0':
        colorGeometry = this.earth.ColorGeometryInstanceAttribute.fromColor(
          this.earth.Color.GRAY.withAlpha(0.3)
        )
        width = 1.5
        break
      case '1':
        ; (colorGeometry = this.earth.ColorGeometryInstanceAttribute.fromColor(
          this.earth.Color.fromBytes(239, 87, 0).withAlpha(0.3)
        )),
          (width = 10.5)
        break
      case '2':
        colorGeometry = this.earth.ColorGeometryInstanceAttribute.fromColor(
          this.earth.Color.fromBytes(64, 248, 244).withAlpha(0.5)
        )
        width = 10.5
        break
    }

    let rectangleInstanceArr = []
    //定义折线几何
    let polyline = new this.earth.PolylineGeometry({
      positions: this.earth.Cartesian3.fromDegreesArray(data),
      width: width,
      vertexFormat: this.earth.PolylineColorAppearance.VERTEX_FORMAT
    })

    var rectangleInstance = new this.earth.GeometryInstance({
      geometry: polyline,
      attributes: {
        color: colorGeometry
      }
    })
    rectangleInstanceArr.push(rectangleInstance)
    let primitive = this.viewer.scene.primitives.add(
      new this.earth.Primitive({
        geometryInstances: rectangleInstanceArr,
        //折线外观
        appearance: new this.earth.PolylineColorAppearance({
          translucent: true
        }),
        asynchronous: false
      })
    )
    return primitive
  }
  // 删除
  removePrimitive(options) {
    options.forEach((item) => {
      this.viewer.scene.primitives.remove(item)
    })
  }
}
