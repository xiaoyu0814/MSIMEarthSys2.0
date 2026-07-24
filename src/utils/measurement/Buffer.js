import {
  getCatesian3FromPX,
  transformCartesianArrayToWGS84Array
} from './utils.js'
export default class Buffer {
  constructor(viewer) {
    this._drawLayer = new MSIMEarth.CustomDataSource('bufferLayet')
    this._drawLayer1 = new MSIMEarth.CustomDataSource('bufferLayet1')

    viewer && viewer.dataSources.add(this._drawLayer1)
    viewer && viewer.dataSources.add(this._drawLayer)

    this._viewer = viewer

    this.lastEntity = null
  }

  toGeoJSON(entity, type) {
    const points = []

    var cesiumPointList = entity.polyline.positions.getValue()
    for (let i = 0; i < cesiumPointList.length; i++) {
      const temp = cesiumPointList[i]
      var ellipsoid = this._viewer.scene.globe.ellipsoid
      // var cartesian3 = new MSIMEarth.Cartesian3(temp.x, temp.y, temp.z)
      var cartographic = ellipsoid.cartesianToCartographic(temp)
      var lng = MSIMEarth.Math.toDegrees(cartographic.longitude)
      var lat = MSIMEarth.Math.toDegrees(cartographic.latitude)
      var alt = cartographic.height
      points.push([lng, lat, alt])
    }

    const feature = {
      type: 'Feature',
      geometry: {
        type: type,
        coordinates: [points]
      },
      properties: {}
    }
    return feature
  }

  add(entity) {
    var buffere = null
    if (this.lastEntity) {
      this._drawLayer1.entities.remove(this.lastEntity)
      this.lastEntity = null
    }
    try {
      var geojson = this.toGeoJSON(entity, 'Polygon')

      buffere = turf.buffer(geojson, 1, { units: 'kilometers' })
    } catch (e) { }
    if (!buffere) return
    console.log(buffere)

    var _bufferEntity = new MSIMEarth.Entity()
    _bufferEntity.polygon = {
      hierarchy: MSIMEarth.Cartesian3.fromDegreesArray(this.getPointList(buffere)),
      material: MSIMEarth.Color.RED.withAlpha(0.4),
      classificationType: MSIMEarth.ClassificationType.BOTH,
      clampToGround: true
    }

    this.lastEntity = this._drawLayer1.entities.add(_bufferEntity)
  }

  getPointList(buffere){
    var points = []
    var polygon = buffere.geometry.coordinates[0]
    for (let i = 0; i < polygon.length; i++) {
      const temp = polygon[i]
      points.push(temp[0], temp[1])
    }
    return points
  }

  clear() {
    if (this.lastEntity) {
      this._drawLayer1.entities.remove(this.lastEntity)
      this.lastEntity = null
    }
  }

  draw(options = {}) {
    if (this._viewer && options) {
      var positions = [],
        polygon = new MSIMEarth.PolygonHierarchy(),
        _polygonEntity = new MSIMEarth.Entity(),
        $this = this,
        polyObj = null,
        _label = '',
        status = false,
        _handler = new MSIMEarth.ScreenSpaceEventHandler(
          this._viewer.scene.canvas
        )

      // left
      _handler.setInputAction(function (movement) {
        var cartesian = getCatesian3FromPX(movement.position)
        if (cartesian && cartesian.x) {
          if (positions.length == 0) {
            polygon.positions.push(cartesian.clone())
            positions.push(cartesian.clone())
          }
          positions.push(cartesian.clone())
          polygon.positions.push(cartesian.clone())

          if (!polyObj) create()
        }
      }, MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)
      // mouse
      _handler.setInputAction(function (movement) {
        var cartesian = getCatesian3FromPX(movement.endPosition)
        // var cartesian = $this._viewer.scene.camera.pickEllipsoid(movement.endPosition, $this._viewer.scene.globe.ellipsoid);
        if (positions.length >= 2) {
          if (cartesian && cartesian.x) {
            positions.pop()
            positions.push(cartesian)
            polygon.positions.pop()
            polygon.positions.push(cartesian)
          }
        }
      }, MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE)

      // right
      _handler.setInputAction(function (movement) {
        let cartesian = getCatesian3FromPX(movement.endPosition)

        _handler.destroy()

        positions.push(positions[0])

        if (typeof options.callback === 'function') {
          options.callback(
            transformCartesianArrayToWGS84Array(positions),
            polyObj
          )
        }
      }, MSIMEarth.ScreenSpaceEventType.RIGHT_CLICK)

      function create() {
        _polygonEntity.polyline = {
          width: 3,
          material: MSIMEarth.Color.YELLOW.withAlpha(0.8),
          clampToGround: true
        }

        _polygonEntity.polyline.positions = new MSIMEarth.CallbackProperty(
          function () {
            return positions
          },
          false
        )

        _polygonEntity.polygon = {
          hierarchy: new MSIMEarth.CallbackProperty(function () {
            return polygon
          }, false),

          material: MSIMEarth.Color.DEEPSKYBLUE.withAlpha(0.1),
          // clampToGround: options.clampToGround || false,
          classificationType: MSIMEarth.ClassificationType.BOTH
        }

        polyObj = $this._drawLayer.entities.add(_polygonEntity)
      }

      return { _handler, status }
    }
  }
}
