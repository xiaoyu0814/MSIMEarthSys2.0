import {
  getCatesian3FromPX,
  transformWGS84ToCartesian,
  transformCartesianArrayToWGS84Array
} from './utils.js'
/**
 * @param viewer  {object} 三维对象
 * @param options {object} 初始化参数
 */
export default class Measure {
  constructor(viewer, options = {}) {
    this._drawLayer = new MSIMEarth.CustomDataSource('measureLayer')

    viewer && viewer.dataSources.add(this._drawLayer)

    this._basePath = options.basePath || ''

    this._viewer = viewer
  }
  /***
   * 坐标数组转换 笛卡尔转84
   * @param {Array} WSG84Arr {lng,lat,alt} 地理坐标数组
   * @param {Number} alt 拔高
   * @return {Array} Cartesian3 三维位置坐标数组
   */
  transformWGS84ArrayToCartesianArray(WSG84Arr, alt) {
    if (this._viewer && WSG84Arr) {
      var $this = this
      return WSG84Arr
        ? WSG84Arr.map(function (item) {
            return transformWGS84ToCartesian(item, alt)
          })
        : []
    }
  }
  /**
   * 84坐标转弧度坐标
   * @param {Object} position wgs84
   * @return {Object} Cartographic 弧度坐标
   *
   */
  transformWGS84ToCartographic(position) {
    return position
      ? MSIMEarth.Cartographic.fromDegrees(
          position.lng || position.lon,
          position.lat,
          position.alt
        )
      : MSIMEarth.Cartographic.ZERO
  }

  /**
   * 获取84坐标的距离
   * @param {*} positions
   */
  getPositionDistance(positions) {
    let distance = 0
    for (let i = 0; i < positions.length - 1; i++) {
      let point1cartographic = this.transformWGS84ToCartographic(positions[i])
      let point2cartographic = this.transformWGS84ToCartographic(
        positions[i + 1]
      )
      let geodesic = new MSIMEarth.EllipsoidGeodesic()
      geodesic.setEndPoints(point1cartographic, point2cartographic)
      let s = geodesic.surfaceDistance
      s = Math.sqrt(
        Math.pow(s, 2) +
          Math.pow(point2cartographic.height - point1cartographic.height, 2)
      )
      distance = distance + s
    }
    return distance.toFixed(3)
  }
  /**
   * 计算一组坐标组成多边形的面积
   * @param {*} positions
   */
  getPositionsArea(positions) {
    let result = 0
    if (positions) {
      function getLonlat(data) {
        let array = []
        for (let i = 0; i < data.length; i++) {
          const element = data[i]
          let temp = [element.lng, element.lat]
          array.push(temp)
        }
        return array
      }
      var polygon = turf.polygon([getLonlat(positions)])
      var area = turf.area(polygon)

      // let h = 0
      // let ellipsoid = MSIMEarth.Ellipsoid.WGS84
      // positions.push(positions[0])
      // for (let i = 1; i < positions.length; i++) {
      //   let oel = ellipsoid.cartographicToCartesian(
      //     this.transformWGS84ToCartographic(positions[i - 1])
      //   )
      //   let el = ellipsoid.cartographicToCartesian(
      //     this.transformWGS84ToCartographic(positions[i])
      //   )
      //   h += oel.x * el.y - el.x * oel.y
      // }
      result = area
    }
    return result
  }
  /**
   * 测距
   * @param {*} options
   */
  drawLineMeasureGraphics(options = {}) {
    if (this._viewer && options) {
      var positions = [],
        _lineEntity = new MSIMEarth.Entity(),
        $this = this,
        lineObj,
        status = false,
        _handlers = new MSIMEarth.ScreenSpaceEventHandler(
          this._viewer.scene.canvas
        )
      // left
      _handlers.setInputAction(function (movement) {
        var cartesian = getCatesian3FromPX(movement.position)
        if (cartesian && cartesian.x) {
          if (positions.length == 0) {
            positions.push(cartesian.clone())
          }
          // 添加量测信息点
          _addInfoPoint(cartesian)
          positions.push(cartesian)
        }
      }, MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)

      _handlers.setInputAction(function (movement) {
        var cartesian = getCatesian3FromPX(movement.endPosition)
        if (positions.length >= 2) {
          if (cartesian && cartesian.x) {
            positions.pop()
            positions.push(cartesian)
          }
        }
      }, MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE)
      // right
      _handlers.setInputAction(function (movement) {
        _handlers.destroy()
        _handlers = null
        let cartesian = getCatesian3FromPX(movement.position)
        _addInfoPoint(cartesian)

        if (typeof options.callback === 'function') {
          options.callback(
            transformCartesianArrayToWGS84Array(positions),
            lineObj
          )
        }
      }, MSIMEarth.ScreenSpaceEventType.RIGHT_CLICK)

      _lineEntity.polyline = {
        width: options.width || 5,
        material: options.material || MSIMEarth.Color.YELLOW.withAlpha(0.8),
        clampToGround: options.clampToGround || false
      }
      _lineEntity.polyline.positions = new MSIMEarth.CallbackProperty(
        function () {
          return positions
        },
        false
      )

      lineObj = this._drawLayer.entities.add(_lineEntity)

      //添加坐标点
      function _addInfoPoint(position) {
        let _labelEntity = new MSIMEarth.Entity()
        _labelEntity.position = position
        _labelEntity.point = {
          pixelSize: 10,
          outlineColor: MSIMEarth.Color.DEEPSKYBLUE,
          outlineWidth: 5
        }
        _labelEntity.label = {
          text:
            (
              $this.getPositionDistance(
                transformCartesianArrayToWGS84Array(positions)
              ) / 1000
            ).toFixed(4) + '公里',
          show: true,
          showBackground: true,
          font: '14px monospace',
          horizontalOrigin: MSIMEarth.HorizontalOrigin.LEFT,
          verticalOrigin: MSIMEarth.VerticalOrigin.BOTTOM,
          pixelOffset: new MSIMEarth.Cartesian2(-20, -80) //left top
        }
        $this._drawLayer.entities.add(_labelEntity)
      }
      return { _handlers, status }
    }
  }
  /**
   * 测面积
   * @param {*} options
   */
  drawAreaMeasureGraphics(options = {}) {
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

        // 添加信息点
        _addInfoPoint(positions[0])
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
          clampToGround: options.clampToGround || false
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
          clampToGround: options.clampToGround || false
        }

        polyObj = $this._drawLayer.entities.add(_polygonEntity)
      }

      function _addInfoPoint(position) {
        var _labelEntity = new MSIMEarth.Entity()
        _labelEntity.position = position
        _labelEntity.point = {
          pixelSize: 10,
          outlineColor: MSIMEarth.Color.DEEPSKYBLUE,
          outlineWidth: 10
        }
        _labelEntity.label = {
          text:
            (
              $this.getPositionsArea(
                transformCartesianArrayToWGS84Array(positions)
              ) / 1000000.0
            ).toFixed(4) + '平方公里',
          show: true,
          showBackground: true,
          font: '14px monospace',
          horizontalOrigin: MSIMEarth.HorizontalOrigin.LEFT,
          verticalOrigin: MSIMEarth.VerticalOrigin.BOTTOM,
          pixelOffset: new MSIMEarth.Cartesian2(-20, -50) //left top
        }
        $this._drawLayer.entities.add(_labelEntity)
      }
      return { _handler, status }
    }
  }
  /**
   * 画三角量测
   * @param {*} options
   */
  drawTrianglesMeasureGraphics(options = {}) {
    options.style = options.style || {
      width: 3,
      material: MSIMEarth.Color.YELLOW.withAlpha(0.5)
    }
    if (this._viewer && options) {
      var _trianglesEntity = new MSIMEarth.Entity(),
        _tempLineEntity = new MSIMEarth.Entity(),
        _tempLineEntity2 = new MSIMEarth.Entity(),
        _positions = [],
        _tempPoints = [],
        _tempPoints2 = [],
        $this = this,
        _handler = new MSIMEarth.ScreenSpaceEventHandler(
          this._viewer.scene.canvas
        )
      // 高度
      function _getHeading(startPosition, endPosition) {
        if (!startPosition && !endPosition) return 0
        if (MSIMEarth.Cartesian3.equals(startPosition, endPosition)) return 0
        let cartographic = MSIMEarth.Cartographic.fromCartesian(startPosition)
        let cartographic2 = MSIMEarth.Cartographic.fromCartesian(endPosition)
        return (cartographic2.height - cartographic.height).toFixed(2)
      }
      // 偏移点
      function _computesHorizontalLine(positions) {
        let cartographic = MSIMEarth.Cartographic.fromCartesian(positions[0])
        let cartographic2 = MSIMEarth.Cartographic.fromCartesian(positions[1])
        return MSIMEarth.Cartesian3.fromDegrees(
          MSIMEarth.Math.toDegrees(cartographic.longitude),
          MSIMEarth.Math.toDegrees(cartographic.latitude),
          cartographic2.height
        )
      }
      // left
      _handler.setInputAction(function (movement) {
        var position = getCatesian3FromPX(movement.position)
        if (!position && !position.z) return false
        if (_positions.length == 0) {
          _positions.push(position.clone())
          _positions.push(position.clone())
          _tempPoints.push(position.clone())
          _tempPoints.push(position.clone())
        } else {
          _handler.destroy()
          if (typeof options.callback === 'function') {
            options.callback({
              e: _trianglesEntity,
              e2: _tempLineEntity,
              e3: _tempLineEntity2
            })
          }
        }
      }, MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)
      // mouse
      _handler.setInputAction(function (movement) {
        var position = getCatesian3FromPX(movement.endPosition)
        if (position && _positions.length > 0) {
          //直线
          _positions.pop()
          _positions.push(position.clone())
          let horizontalPosition = _computesHorizontalLine(_positions)
          //高度
          _tempPoints.pop()
          _tempPoints.push(horizontalPosition.clone())
          //水平线
          _tempPoints2.pop(), _tempPoints2.pop()
          _tempPoints2.push(position.clone())
          _tempPoints2.push(horizontalPosition.clone())
        }
      }, MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE)

      // create entity

      //直线
      _trianglesEntity.polyline = {
        positions: new MSIMEarth.CallbackProperty(function () {
          return _positions
        }, false),
        ...options.style
      }
      _trianglesEntity.position = new MSIMEarth.CallbackProperty(function () {
        return _positions[0]
      }, false)
      _trianglesEntity.point = {
        pixelSize: 5,
        outlineColor: MSIMEarth.Color.DEEPSKYBLUE,
        outlineWidth: 5
      }
      _trianglesEntity.label = {
        text: new MSIMEarth.CallbackProperty(function () {
          return (
            '直线:' +
            $this.getPositionDistance(
              transformCartesianArrayToWGS84Array(_positions)
            ) +
            '米'
          )
        }, false),
        show: true,
        showBackground: true,
        font: '14px monospace',
        horizontalOrigin: MSIMEarth.HorizontalOrigin.LEFT,
        verticalOrigin: MSIMEarth.VerticalOrigin.BOTTOM,
        pixelOffset: new MSIMEarth.Cartesian2(50, -100) //left top
      }
      //高度
      _tempLineEntity.polyline = {
        positions: new MSIMEarth.CallbackProperty(function () {
          return _tempPoints
        }, false),
        ...options.style
      }
      _tempLineEntity.position = new MSIMEarth.CallbackProperty(function () {
        return _tempPoints2[1]
      }, false)
      _tempLineEntity.point = {
        pixelSize: 5,
        outlineColor: MSIMEarth.Color.DEEPSKYBLUE,
        outlineWidth: 5
      }
      _tempLineEntity.label = {
        text: new MSIMEarth.CallbackProperty(function () {
          return '高度:' + _getHeading(_tempPoints[0], _tempPoints[1]) + '米'
        }, false),
        show: true,
        showBackground: true,
        font: '14px monospace',
        horizontalOrigin: MSIMEarth.HorizontalOrigin.LEFT,
        verticalOrigin: MSIMEarth.VerticalOrigin.BOTTOM,
        pixelOffset: new MSIMEarth.Cartesian2(-20, 100) //left top
      }
      //水平
      _tempLineEntity2.polyline = {
        positions: new MSIMEarth.CallbackProperty(function () {
          return _tempPoints2
        }, false),
        ...options.style
      }
      _tempLineEntity2.position = new MSIMEarth.CallbackProperty(function () {
        return _positions[1]
      }, false)
      _tempLineEntity2.point = {
        pixelSize: 5,
        outlineColor: MSIMEarth.Color.DEEPSKYBLUE,
        outlineWidth: 5
      }
      _tempLineEntity2.label = {
        text: new MSIMEarth.CallbackProperty(function () {
          return (
            '水平距离:' +
            $this.getPositionDistance(
              transformCartesianArrayToWGS84Array(_tempPoints2)
            ) +
            '米'
          )
        }, false),
        show: true,
        showBackground: true,
        font: '14px monospace',
        horizontalOrigin: MSIMEarth.HorizontalOrigin.LEFT,
        verticalOrigin: MSIMEarth.VerticalOrigin.BOTTOM,
        pixelOffset: new MSIMEarth.Cartesian2(-150, -20) //left top
      }
      this._drawLayer.entities.add(_tempLineEntity2)
      this._drawLayer.entities.add(_tempLineEntity)
      this._drawLayer.entities.add(_trianglesEntity)
    }
  }
}
