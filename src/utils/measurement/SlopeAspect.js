import {
  getCatesian3FromPX,
  transformCartesianArrayToWGS84Array
} from './utils.js'

var SlopeAspect = (function () {
  function SlopeAspect(options) {
    this.MSIMEarth = window.MSIMEarth
    if (!this.MSIMEarth) {
      throw new Error('MSIMEarth is not initialized')
    }
    this.options = options || {}
    this.options.arrow = this.options.arrow || {}
    this.options.arrow.scale = this.MSIMEarth.defaultValue(
      this.options.arrow.scale,
      0.3
    )
    this.options.arrow.width = this.MSIMEarth.defaultValue(
      this.options.arrow.width,
      15
    )
    this.options.arrow.color = this.MSIMEarth.defaultValue(
      this.options.arrow.color,
      this.MSIMEarth.Color.YELLOW
    )
    this.options.point = this.options.point || {}
    this.options.point.show = this.MSIMEarth.defaultValue(
      this.options.point.show,
      true
    )
    this.options.point.pixelSize = this.MSIMEarth.defaultValue(
      this.options.point.pixelSize,
      9
    )
    this.options.point.color = this.MSIMEarth.defaultValue(
      this.options.point.color,
      this.MSIMEarth.Color.RED.withAlpha(0.5)
    )
    this.viewer = options.viewer
    this.arrowPrimitives = []
    this.labelCollection = new this.MSIMEarth.LabelCollection()
    this.viewer.scene.primitives.add(this.labelCollection)
    this._drawLayer = new this.MSIMEarth.CustomDataSource('slopeAspectLayer')
    this.viewer && this.viewer.dataSources.add(this._drawLayer)
    this._handler = null
  }

  SlopeAspect.prototype.wgs84ToWindowCoordinates = function (
    scene,
    position,
    result
  ) {
    if (!this.MSIMEarth.defined(scene)) {
      throw new Error('scene is required.')
    }
    if (!this.MSIMEarth.defined(position)) {
      throw new Error('position is required.')
    }
    if (!this.MSIMEarth.defined(result)) {
      result = new this.MSIMEarth.Cartesian2()
    }

    var frameState = scene.frameState
    if (!this.MSIMEarth.defined(frameState)) {
      return undefined
    }

    var actualPosition = this.computeActualWgs84Position(frameState, position)
    if (!this.MSIMEarth.defined(actualPosition)) {
      return undefined
    }

    var canvas = scene.canvas
    var viewport = new this.MSIMEarth.BoundingRectangle(
      0,
      0,
      canvas.clientWidth,
      canvas.clientHeight
    )
    var camera = scene.camera

    var positionCC = this.worldToClip(
      actualPosition,
      this.MSIMEarth.Cartesian3.ZERO,
      camera
    )
    if (
      positionCC.z < 0 &&
      !(camera.frustum instanceof this.MSIMEarth.OrthographicFrustum) &&
      !(camera.frustum instanceof this.MSIMEarth.OrthographicOffCenterFrustum)
    ) {
      return undefined
    }

    result = this.clipToGLWindowCoordinates(viewport, positionCC, result)
    result.y = canvas.clientHeight - result.y
    return result
  }

  SlopeAspect.prototype.worldToClip = function (position, eyeOffset, camera) {
    var viewMatrix = camera.viewMatrix
    var positionEC = this.MSIMEarth.Matrix4.multiplyByVector(
      viewMatrix,
      this.MSIMEarth.Cartesian4.fromElements(
        position.x,
        position.y,
        position.z,
        1
      ),
      new this.MSIMEarth.Cartesian4()
    )

    var scratchEyeOffset = new this.MSIMEarth.Cartesian3()
    var zEyeOffset = this.MSIMEarth.Cartesian3.multiplyComponents(
      eyeOffset,
      this.MSIMEarth.Cartesian3.normalize(positionEC, scratchEyeOffset),
      scratchEyeOffset
    )
    positionEC.x += eyeOffset.x + zEyeOffset.x
    positionEC.y += eyeOffset.y + zEyeOffset.y
    positionEC.z += zEyeOffset.z

    return this.MSIMEarth.Matrix4.multiplyByVector(
      camera.frustum.projectionMatrix,
      positionEC,
      new this.MSIMEarth.Cartesian4()
    )
  }

  SlopeAspect.prototype.clipToGLWindowCoordinates = function (
    viewport,
    clipCoords,
    result
  ) {
    if (!this.MSIMEarth.defined(result)) {
      result = new this.MSIMEarth.Cartesian2()
    }

    var x = clipCoords.x / clipCoords.w
    var y = clipCoords.y / clipCoords.w

    result.x = viewport.x + (x * 0.5 + 0.5) * viewport.width
    result.y = viewport.y + (y * 0.5 + 0.5) * viewport.height

    return result
  }

  SlopeAspect.prototype.computeActualWgs84Position = function (
    frameState,
    position
  ) {
    var mode = frameState.mode

    if (mode === this.MSIMEarth.SceneMode.SCENE3D) {
      return this.MSIMEarth.Cartesian3.clone(position)
    }

    var projection = frameState.mapProjection
    var cartographic = projection.ellipsoid.cartesianToCartographic(position)
    if (!this.MSIMEarth.defined(cartographic)) {
      return undefined
    }

    var projectedPosition = projection.project(cartographic)
    if (mode === this.MSIMEarth.SceneMode.COLUMBUS_VIEW) {
      return this.MSIMEarth.Cartesian3.fromElements(
        projectedPosition.z,
        projectedPosition.x,
        projectedPosition.y
      )
    }

    if (mode === this.MSIMEarth.SceneMode.SCENE2D) {
      return this.MSIMEarth.Cartesian3.fromElements(
        projectedPosition.x,
        projectedPosition.y,
        0.0
      )
    }

    return this.MSIMEarth.Cartesian3.clone(position)
  }

  SlopeAspect.prototype.add = function (positions, options) {
    if (!positions || positions.length < 1) return

    options = options || {}
    var result

    if (positions.length > 2) {
      result = this.interPolygon({
        scene: this.viewer.scene,
        positions: positions,
        has3dtiles: false,
        onlyPoint: true,
        splitNum: this.MSIMEarth.defaultValue(options.splitNum, 8)
      })

      this.arrowLength =
        this.MSIMEarth.Math.chordLength(
          result.granularity,
          this.viewer.scene.globe.ellipsoid.maximumRadius
        ) * this.options.arrow.scale

      positions = []
      for (var i = 0; i < result.list.length; i++) {
        positions.push(result.list[i].pointDM)
      }
    } else {
      this.arrowLength = this.MSIMEarth.defaultValue(
        this.options.arrow.length,
        40
      )
    }

    this.stateAll = positions.length
    this.stateOkIndex = 0
    this.instances = []

    for (var j = 0; j < this.stateAll; j++) {
      this._fxOnePoint(positions[j], options)
    }
  }

  SlopeAspect.prototype._fxOnePoint = function (position, options) {
    if (!position) return

    var PL$13 = this.getEllipseOuterPositions({
      position: position,
      radius: this.MSIMEarth.defaultValue(options.radius, 2),
      count: this.MSIMEarth.defaultValue(options.count, 2)
    })
    PL$13.push(position)

    var _spring2 = []
    for (var i = 0; i < PL$13.length; i++) {
      var val = this.MSIMEarth.Cartographic.fromCartesian(PL$13[i])
      _spring2.push(val)
    }

    var ENHANCED_BASE_WIDTH =
      this.MSIMEarth.Cartographic.fromCartesian(position).height
    var _related2 = this

    new Promise(function (resolve) {
      resolve(
        _related2.MSIMEarth.sampleTerrainMostDetailed(
          _related2.viewer.terrainProvider,
          _spring2
        )
      )
    }).then(function (result) {
      for (var i = 0; i < result.length; i++) {
        var params = result[i]
        params.height = params.height ? params.height : ENHANCED_BASE_WIDTH
      }

      var model = result.pop()
      var j = 0
      var oHeight = result[0].height
      var option = 0
      var expectedRoom = result[0].height

      for (var k = 1; k < result.length - 1; k++) {
        var params = result[k]
        if (params.height > oHeight) {
          oHeight = params.height
          j = k
        }
        if (params.height < expectedRoom) {
          expectedRoom = params.height
          option = k
        }
      }

      var relation = result[j]
      var data = result[option]
      var included = _related2.getSlope(model, relation)
      var match = _related2.getSlope(model, data)

      if (included > match) {
        _related2._fxOnePointOk(model, relation, included)
      } else {
        _related2._fxOnePointOk(model, data, match)
      }
    })
  }

  SlopeAspect.prototype._fxOnePointOk = function (cb, individual, value) {
    var i = this.MSIMEarth.Cartographic.toCartesian(cb)
    var result = this.MSIMEarth.Cartographic.toCartesian(individual)
    result = this.getOnLinePointByLen(i, result, this.arrowLength)

    var positions = cb.height > individual.height ? [i, result] : [result, i]

    var GET_AUTH_URL_TIMEOUT = new this.MSIMEarth.GeometryInstance({
      geometry: new this.MSIMEarth.PolylineGeometry({
        positions: positions,
        width: this.options.arrow.width
      }),
      vertexFormat: this.MSIMEarth.PolylineMaterialAppearance.VERTEX_FORMAT,
      id: 'polylinedashinstance'
    })

    this.instances.push(GET_AUTH_URL_TIMEOUT)

    var floatVal = Number((100 * Math.atan(value)).toFixed(2))
    var _0xe1d174 = floatVal.toFixed(2) + '°'
    var _0x57e0c1 = (100 * value).toFixed(2) + '%'

    if (this.options.point.show) {
      var column = this.labelCollection.add({
        text: '坡度:' + _0xe1d174,
        position: i,
        // scale: this.options.point.pixelSize / 10,
        scale: 0.7,
        fillColor: this.options.point.color,
        outlineWidth: this.options.point.outlineWidth || 2,
        outlineColor:
          this.options.point.outlineColor || this.MSIMEarth.Color.WHITE,
        // scaleByDistance: this.options.point.scaleByDistance,
        scaleByDistance: new this.MSIMEarth.NearFarScalar(150, 0.7, 1.5e7, 0.1),
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        pixelOffset: new this.MSIMEarth.Cartesian2(0, -20)
      })
      column.slope = floatVal
      column.click = this.options.click
      column.tooltip = '坡度:' + _0xe1d174
    }

    if (++this.stateOkIndex >= this.stateAll) {
      var artistTrack = this.viewer.scene.primitives.add(
        new this.MSIMEarth.Primitive({
          geometryInstances: this.instances,
          appearance: new this.MSIMEarth.PolylineMaterialAppearance({
            material: this.MSIMEarth.Material.fromType('PolylineArrow', {
              color: this.options.arrow.color
            })
          }),
          depthFailMaterial: new this.MSIMEarth.Material({
            fabric: {
              type: 'PolylineArrow',
              uniforms: {
                color: this.options.arrow.color
              }
            }
          }),
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        })
      )
      this.arrowPrimitives.push(artistTrack)
      this.instances = []
    }
  }

  SlopeAspect.prototype.getSlope = function (fn, data) {
    if (!fn || !data) return 0

    return (
      Math.abs(fn.height - data.height) /
      this.MSIMEarth.Cartesian3.distance(
        this.MSIMEarth.Cartographic.toCartesian(fn),
        this.MSIMEarth.Cartesian3.fromRadians(
          data.longitude,
          data.latitude,
          fn.height
        )
      )
    )
  }

  SlopeAspect.prototype.clear = function () {
    if (this.labelCollection) {
      this.labelCollection.removeAll()
    }

    for (var i = 0; i < this.arrowPrimitives.length; i++) {
      this.viewer.scene.primitives.remove(this.arrowPrimitives[i])
    }

    this.arrowPrimitives = []
    this.instances = []
    this.stateAll = 0
    this.stateOkIndex = 0

    if (this._drawLayer) {
      this._drawLayer.entities.removeAll()
    }

    if (this._handler) {
      this._handler.destroy()
      this._handler = null
    }
  }

  SlopeAspect.prototype.destroy = function () {
    this.clear()
    delete this.labelCollection
    delete this.arrowPrimitives
    delete this.viewer
    delete this._drawLayer
  }

  SlopeAspect.prototype.draw = function (options) {
    options = options || {}
    var positions = []
    var polygon = new this.MSIMEarth.PolygonHierarchy()
    var _polygonEntity = new this.MSIMEarth.Entity()
    var $this = this
    var polyObj = null

    this._handler = new this.MSIMEarth.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    )

    this._handler.setInputAction(function (movement) {
      var cartesian = getCatesian3FromPX(movement.position)
      if (cartesian && cartesian.x) {
        if (positions.length === 0) {
          polygon.positions.push(cartesian.clone())
          positions.push(cartesian.clone())
        }
        positions.push(cartesian.clone())
        polygon.positions.push(cartesian.clone())

        if (!polyObj) {
          $this._createPolygonEntity()
        }
      }
    }, this.MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)

    this._handler.setInputAction(function (movement) {
      var cartesian = getCatesian3FromPX(movement.endPosition)
      if (positions.length >= 2) {
        if (cartesian && cartesian.x) {
          positions.pop()
          positions.push(cartesian)
          polygon.positions.pop()
          polygon.positions.push(cartesian)
        }
      }
    }, this.MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE)

    this._handler.setInputAction(function (movement) {
      positions.push(positions[0])
      $this._handler.destroy()
      $this._handler = null
      $this.add(positions, options)

      if (typeof options.callback === 'function') {
        options.callback(
          $this.transformCartesianArrayToWGS84Array(positions),
          polyObj
        )
      }
    }, this.MSIMEarth.ScreenSpaceEventType.RIGHT_CLICK)

    this._createPolygonEntity = function () {
      _polygonEntity.polyline = {
        width: 3,
        material: $this.MSIMEarth.Color.YELLOW.withAlpha(0.8),
        clampToGround: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }

      _polygonEntity.polyline.positions = new $this.MSIMEarth.CallbackProperty(
        function () {
          return positions
        },
        false
      )

      _polygonEntity.polygon = {
        hierarchy: new $this.MSIMEarth.CallbackProperty(function () {
          return polygon
        }, false),
        material: $this.MSIMEarth.Color.DEEPSKYBLUE.withAlpha(0.3),
        clampToGround: true,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }

      polyObj = $this._drawLayer.entities.add(_polygonEntity)
    }
  }

  SlopeAspect.prototype.transformCartesianArrayToWGS84Array = function (
    cartesianArr
  ) {
    return cartesianArr
      ? cartesianArr.map(function (item) {
          return transformCartesianArrayToWGS84Array([item])[0]
        })
      : []
  }

  SlopeAspect.prototype.interPolygon = function (data) {
    var items = data.positions
    var row = data.scene
    var i = 0
    var c = 9999
    var tree = []
    var AP = []

    for (var prefix = 0; prefix < items.length; prefix++) {
      AP.push(items[prefix].clone())
    }

    var _0x499b56 = this.MSIMEarth.defaultValue(data.onlyHeight, true)
    var _0x42de06 = this.MSIMEarth.defaultValue(data.onlyPoint, false)
    var period = this.getGranularity(AP, data.splitNum)

    var elmDocument = new this.MSIMEarth.PolygonGeometry.fromPositions({
      positions: AP,
      vertexFormat:
        this.MSIMEarth.PerInstanceColorAppearance.FLAT_VERTEX_FORMAT,
      granularity: period
    })

    var node = new this.MSIMEarth.PolygonGeometry.createGeometry(elmDocument)

    for (var idx = 0; idx < node.indices.length; idx = idx + 3) {
      var pluginModule = node.indices[idx]
      var _0x2d4fb0 = node.indices[idx + 1]
      var _0x22dc1f = node.indices[idx + 2]

      var doc = this.loadPointData(
        new this.MSIMEarth.Cartesian3(
          node.attributes.position.values[3 * pluginModule],
          node.attributes.position.values[3 * pluginModule + 1],
          node.attributes.position.values[3 * pluginModule + 2]
        ),
        row,
        _0x499b56
      )

      var template = this.loadPointData(
        new this.MSIMEarth.Cartesian3(
          node.attributes.position.values[3 * _0x2d4fb0],
          node.attributes.position.values[3 * _0x2d4fb0 + 1],
          node.attributes.position.values[3 * _0x2d4fb0 + 2]
        ),
        row,
        _0x499b56
      )

      var p = this.loadPointData(
        new this.MSIMEarth.Cartesian3(
          node.attributes.position.values[3 * _0x22dc1f],
          node.attributes.position.values[3 * _0x22dc1f + 1],
          node.attributes.position.values[3 * _0x22dc1f + 2]
        ),
        row,
        _0x499b56
      )

      if (_0x42de06) {
        this.treeEquals(tree, doc)
        this.treeEquals(tree, template)
        this.treeEquals(tree, p)
      } else {
        tree.push({
          point1: doc,
          point2: template,
          point3: p
        })
      }
    }

    return {
      granularity: period,
      maxHeight: i,
      minHeight: c,
      list: tree
    }
  }

  SlopeAspect.prototype.loadPointData = function (data, scene, onlyHeight) {
    var smallestPoint
    var b
    var d = this.sin(scene, data, { onlyHeight: onlyHeight })

    if (onlyHeight) {
      var qs = this.MSIMEarth.Cartographic.fromCartesian(data)
      smallestPoint = this.MSIMEarth.Cartesian3.fromRadians(
        qs.longitude,
        qs.latitude,
        0
      )
      b = this.MSIMEarth.Cartesian3.fromRadians(qs.longitude, qs.latitude, d)
    }

    return {
      height: d,
      point: smallestPoint,
      pointDM: b
    }
  }

  SlopeAspect.prototype.sin = function (node, args, options) {
    options = options || {}

    if (node instanceof this.MSIMEarth.Viewer) {
      node = node.scene
    }

    var has3dtiles = this.MSIMEarth.defaultValue(
      options.has3dtiles,
      this.MSIMEarth.defined(this.pick3DTileset(node, args))
    )

    if (has3dtiles) {
      return this.configure(node, args, options)
    } else {
      return this.callback(node, args, options)
    }
  }

  SlopeAspect.prototype.pick3DTileset = function (context, data) {
    if (!data) {
      return null
    }

    if (context instanceof this.MSIMEarth.Viewer) {
      context = context.scene
    }

    if (data instanceof this.MSIMEarth.Cartesian3) {
      data = [data]
    }

    for (var i = 0; i < data.length; ++i) {
      var value = data[i]
      var key = this.wgs84ToWindowCoordinates(context, value)

      if (this.MSIMEarth.defined(key)) {
        var obj = context.pick(key, 10, 10)
        if (
          this.MSIMEarth.defined(obj) &&
          this.MSIMEarth.defined(obj.primitive) &&
          obj.primitive instanceof this.MSIMEarth.Cesium3DTileset
        ) {
          return obj.primitive
        }
      }
    }

    return null
  }

  SlopeAspect.prototype.configure = function (obj, key, props) {
    props = props || {}
    props.cartesian =
      props.cartesian || this.MSIMEarth.Cartographic.fromCartesian(key)
    var name = props.cartesian

    if (props.asyn) {
      obj.clampToHeightMostDetailed([key]).then(
        function (boardManager) {
          var includedElement = boardManager[0]
          if (this.MSIMEarth.defined(includedElement)) {
            var height =
              this.MSIMEarth.Cartographic.fromCartesian(includedElement).height
            if (this.MSIMEarth.defined(height) && height > -1e3) {
              if (props.calback) {
                props.calback(height, name)
              }
              return
            }
          }
          this.callback(obj, key, props)
        }.bind(this)
      )
    } else {
      var val = obj.sampleHeight(name)
      if (this.MSIMEarth.defined(val) && val > -1e3) {
        if (props.calback) {
          props.calback(val, name)
        }
        return val
      }
    }

    return 0
  }

  SlopeAspect.prototype.callback = function (object, names, types) {
    types = types || {}
    var key =
      types.cartesian || this.MSIMEarth.Cartographic.fromCartesian(names)

    if (types.asy) {
      this.MSIMEarth.when(
        this.MSIMEarth.sampleTerrainMostDetailed(object.terrainProvider, [key]),
        function (boardManager) {
          var value
          var PathPosition = boardManager[0]
          value =
            this.MSIMEarth.defined(PathPosition) &&
            this.MSIMEarth.defined(PathPosition.height)
              ? PathPosition.height
              : object.globe.getHeight(key)
          if (types.calback) {
            types.calback(value, key)
          }
        }.bind(this)
      )
    } else {
      var value = object.globe.getHeight(key)
      if (this.MSIMEarth.defined(value) && value > -1e3) {
        if (types.calback) {
          types.calback(value, key)
        }
        return value
      }
    }

    return 0
  }

  SlopeAspect.prototype.getGranularity = function (obj, render_count) {
    var props = this.MSIMEarth.Rectangle.fromCartesianArray(obj)
    var done_so_far = Math.max(props.height, props.width)
    return done_so_far / this.MSIMEarth.defaultValue(render_count, 10)
  }

  SlopeAspect.prototype.treeEquals = function (b, a) {
    var _0x40b1e7 = false
    var ptile_a = a.point

    for (var i = 0; i < b.length; i++) {
      var ptile_b = b[i].point
      if (
        ptile_a.x === ptile_b.x &&
        ptile_a.y === ptile_b.y &&
        ptile_a.z === ptile_b.z
      ) {
        _0x40b1e7 = true
        break
      }
    }

    if (!_0x40b1e7) {
      b.push(a)
    }
  }

  SlopeAspect.prototype.getEllipseOuterPositions = function (data) {
    var title = data.position
    var count = this.MSIMEarth.defaultValue(data.count, 1)
    var radius = this.MSIMEarth.defaultValue(data.semiMajorAxis, data.radius)
    var semiMinorAxis = this.MSIMEarth.defaultValue(
      data.semiMinorAxis,
      data.radius
    )
    var rotation = this.MSIMEarth.defaultValue(data.rotation, 0)

    var array = this.MSIMEarth.EllipseGeometryLibrary.computeEllipsePositions(
      {
        center: title,
        semiMajorAxis: radius,
        semiMinorAxis: semiMinorAxis,
        rotation: rotation,
        granularity: Math.PI / (16 * count)
      },
      true,
      true
    ).outerPositions

    var command_codes = []
    for (var i = 0; i < array.length; i = i + 3) {
      var point = new this.MSIMEarth.Cartesian3(
        array[i],
        array[i + 1],
        array[i + 2]
      )
      command_codes.push(point)
    }

    return command_codes
  }

  SlopeAspect.prototype.getOnLinePointByLen = function (v, lines, parentWidth) {
    var e = this.MSIMEarth.Transforms.eastNorthUpToFixedFrame(v)
    var start = this.MSIMEarth.Matrix4.inverse(e, new this.MSIMEarth.Matrix4())
    var vLocal = this.MSIMEarth.Matrix4.multiplyByPoint(
      start,
      v,
      new this.MSIMEarth.Cartesian3()
    )
    var linesLocal = this.MSIMEarth.Matrix4.multiplyByPoint(
      start,
      lines,
      new this.MSIMEarth.Cartesian3()
    )

    var props = this.MSIMEarth.Cartesian3.subtract(
      linesLocal,
      vLocal,
      new this.MSIMEarth.Cartesian3()
    )
    var width = this.MSIMEarth.Cartesian3.distance(vLocal, linesLocal)
    var widthAspectRatio = parentWidth / width

    var result = this.MSIMEarth.Cartesian3.multiplyByScalar(
      props,
      widthAspectRatio,
      new this.MSIMEarth.Cartesian3()
    )
    return this.MSIMEarth.Matrix4.multiplyByPoint(
      e,
      result,
      new this.MSIMEarth.Cartesian3()
    )
  }

  return SlopeAspect
})()

export default SlopeAspect
