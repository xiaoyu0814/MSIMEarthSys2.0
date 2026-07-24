import { getCatesian3FromPX } from './utils.js'
var eqPartial = (function () {
  /**
   * @param {?} target
   * @param {string} descriptors
   * @return {undefined}
   */
  function defineProperties(target, descriptors) {
    /** @type {number} */
    var name = 0
    for (; name < descriptors['length']; name++) {
      var desc = descriptors[name]
      desc['enumerable'] = desc['enumerable'] || false
      /** @type {boolean} */
      desc['configurable'] = true
      if ('value' in desc) {
        /** @type {boolean} */
        desc['writable'] = true
      }
      Object['defineProperty'](target, desc['key'], desc)
    }
  }
  return function (Constructor, protoProps, staticProps) {
    return (
      protoProps && defineProperties(Constructor['prototype'], protoProps),
      staticProps && defineProperties(Constructor, staticProps),
      Constructor
    )
  }
})()

var Slope = (function () {
  /**
   * @param {?} textureVel
   * @return {undefined}
   */
  function render(textureVel) {
    !(function (impromptuInstance, Impromptu) {
      if (!(impromptuInstance instanceof Impromptu)) {
        throw new TypeError('Cannot call a class as a function')
      }
    })(this, render)
    this['options'] = textureVel
    this['options']['arrow'] = this['options']['arrow'] || {}
    this['options']['arrow']['scale'] = MSIMEarth['defaultValue'](
      this['options']['arrow']['scale'],
      0.3
    )
    this['options']['arrow']['width'] = MSIMEarth['defaultValue'](
      this['options']['arrow']['width'],
      15
    )
    this['options']['arrow']['color'] = MSIMEarth['defaultValue'](
      this['options']['arrow']['color'],
      MSIMEarth['Color']['YELLOW']
    )
    this['options']['point'] = this['options']['point'] || {}
    this['options']['point']['show'] = MSIMEarth['defaultValue'](
      this['options']['point']['show'],
      true
    )
    this['options']['point']['pixelSize'] = MSIMEarth['defaultValue'](
      this['options']['point']['pixelSize'],
      9
    )
    this['options']['point']['color'] = MSIMEarth['defaultValue'](
      this['options']['point']['color'],
      MSIMEarth['Color']['RED']['withAlpha'](0.5)
    )
    this['viewer'] = textureVel['viewer']
    /** @type {!Array} */
    this['arrowPrimitives'] = []
    this['pointInterPrimitives'] = new MSIMEarth['PointPrimitiveCollection']()
    this['viewer']['scene']['primitives']['add'](this['pointInterPrimitives'])
    this['_drawLayer'] = new MSIMEarth.CustomDataSource('slopeAspectLayer')
    this['viewer'] && this['viewer'].dataSources.add(this['_drawLayer'])
  }
  return (
    eqPartial(render, [
      {
        key: 'add',
        value: function (PL$4, attributesToIgnore) {
          if (PL$4 && !(PL$4['length'] < 1)) {
            if (
              ((attributesToIgnore = attributesToIgnore || {}),
              PL$4['length'] > 2)
            ) {
              var result = (0, interPolygon)({
                scene: this['viewer']['scene'],
                positions: PL$4,
                has3dtiles: false,
                onlyPoint: true,
                splitNum: MSIMEarth['defaultValue'](
                  attributesToIgnore['splitNum'],
                  8
                )
              })
              /** @type {number} */
              this['arrowLength'] =
                MSIMEarth['Math']['chordLength'](
                  result['granularity'],
                  this['viewer']['scene']['globe']['ellipsoid']['maximumRadius']
                ) * this['options']['arrow']['scale']
              /** @type {!Array} */
              PL$4 = []
              /** @type {number} */
              var type = 0
              for (; type < result['list']['length']; type++) {
                PL$4['push'](result['list'][type]['pointDM'])
              }
            } else {
              this['arrowLength'] = MSIMEarth['defaultValue'](
                this['options']['arrow']['length'],
                40
              )
            }
            this['stateAll'] = PL$4['length']
            /** @type {number} */
            this['stateOkIndex'] = 0
            /** @type {!Array} */
            this['instances'] = []
            /** @type {number} */
            var PL$11 = 0
            for (; PL$11 < this['stateAll']; PL$11++) {
              this['_fxOnePoint'](PL$4[PL$11], attributesToIgnore)
            }
          }
        }
      },
      {
        key: '_fxOnePoint',
        value: function (saveEvenIfSeemsUnchanged, optionalUrl) {
          if (saveEvenIfSeemsUnchanged) {
            var PL$13 = (0, getEllipseOuterPositions)({
              position: saveEvenIfSeemsUnchanged,
              radius: MSIMEarth['defaultValue'](optionalUrl['radius'], 2),
              count: MSIMEarth['defaultValue'](optionalUrl['count'], 2)
            })
            PL$13['push'](saveEvenIfSeemsUnchanged)
            /** @type {!Array} */
            var _spring2 = []
            /** @type {number} */
            var PL$17 = 0
            for (; PL$17 < PL$13['length']; PL$17++) {
              var val = MSIMEarth['Cartographic']['fromCartesian'](PL$13[PL$17])
              _spring2['push'](val)
            }
            var ENHANCED_BASE_WIDTH = MSIMEarth['Cartographic'][
              'fromCartesian'
            ](saveEvenIfSeemsUnchanged)['height']
            var _related2 = this
            // MSIMEarth['when'](
            //   MSIMEarth['sampleTerrainMostDetailed'](
            //     this['viewer']['terrainProvider'],
            //     _spring2
            //   ),
            //   function (result) {
            //     /** @type {number} */
            //     var i = 0
            //     for (; i < result['length']; i++) {
            //       ;(params = result[i])['height'] = params['height']
            //         ? params['height']
            //         : ENHANCED_BASE_WIDTH
            //     }
            //     var model = result['pop']()
            //     /** @type {number} */
            //     var j = 0
            //     var oHeight = result[0]['height']
            //     /** @type {number} */
            //     var option = 0
            //     var expectedRoom = result[0]['height']
            //     /** @type {number} */
            //     i = 1
            //     for (; i < result['length'] - 1; i++) {
            //       var params
            //       if ((params = result[i])['height'] > oHeight) {
            //         oHeight = params['height']
            //         /** @type {number} */
            //         j = i
            //       }
            //       if (params['height'] < expectedRoom) {
            //         expectedRoom = params['height']
            //         /** @type {number} */
            //         option = i
            //       }
            //     }
            //     var relation = result[j]
            //     var data = result[option]
            //     var included = _related2['getSlope'](model, relation)
            //     var match = _related2['getSlope'](model, data)
            //     if (included > match) {
            //       _related2['_fxOnePointOk'](model, relation, included)
            //     } else {
            //       _related2['_fxOnePointOk'](model, data, match)
            //     }
            //   }
            // )

            // MSIMEarth['sampleTerrainMostDetailed'](
            //   this['viewer']['terrainProvider'],
            //   _spring2
            // ).then(result =>{
            //     /** @type {number} */
            //     var i = 0
            //     for (; i < result['length']; i++) {
            //       ;(params = result[i])['height'] = params['height']
            //         ? params['height']
            //         : ENHANCED_BASE_WIDTH
            //     }
            //     var model = result['pop']()
            //     /** @type {number} */
            //     var j = 0
            //     var oHeight = result[0]['height']
            //     /** @type {number} */
            //     var option = 0
            //     var expectedRoom = result[0]['height']
            //     /** @type {number} */
            //     i = 1
            //     for (; i < result['length'] - 1; i++) {
            //       var params
            //       if ((params = result[i])['height'] > oHeight) {
            //         oHeight = params['height']
            //         /** @type {number} */
            //         j = i
            //       }
            //       if (params['height'] < expectedRoom) {
            //         expectedRoom = params['height']
            //         /** @type {number} */
            //         option = i
            //       }
            //     }
            //     var relation = result[j]
            //     var data = result[option]
            //     var included = _related2['getSlope'](model, relation)
            //     var match = _related2['getSlope'](model, data)
            //     if (included > match) {
            //       _related2['_fxOnePointOk'](model, relation, included)
            //     } else {
            //       _related2['_fxOnePointOk'](model, data, match)
            //     }
            // })

            new Promise((resolve, reject) => {
              resolve(
                MSIMEarth['sampleTerrainMostDetailed'](
                  this['viewer']['terrainProvider'],
                  _spring2
                )
              )
            }).then((result) => {
              /** @type {number} */
              var i = 0
              for (; i < result['length']; i++) {
                ;(params = result[i])['height'] = params['height']
                  ? params['height']
                  : ENHANCED_BASE_WIDTH
              }
              var model = result['pop']()
              /** @type {number} */
              var j = 0
              var oHeight = result[0]['height']
              /** @type {number} */
              var option = 0
              var expectedRoom = result[0]['height']
              /** @type {number} */
              i = 1
              for (; i < result['length'] - 1; i++) {
                var params
                if ((params = result[i])['height'] > oHeight) {
                  oHeight = params['height']
                  /** @type {number} */
                  j = i
                }
                if (params['height'] < expectedRoom) {
                  expectedRoom = params['height']
                  /** @type {number} */
                  option = i
                }
              }
              var relation = result[j]
              var data = result[option]
              var included = _related2['getSlope'](model, relation)
              var match = _related2['getSlope'](model, data)
              if (included > match) {
                _related2['_fxOnePointOk'](model, relation, included)
              } else {
                _related2['_fxOnePointOk'](model, data, match)
              }
            })

            // whenaa(
            //   MSIMEarth['sampleTerrainMostDetailed'](
            //     this['viewer']['terrainProvider'],
            //     _spring2
            //   ),
            //   function (result) {
            //     /** @type {number} */
            //     var i = 0
            //     for (; i < result['length']; i++) {
            //       ;(params = result[i])['height'] = params['height']
            //         ? params['height']
            //         : ENHANCED_BASE_WIDTH
            //     }
            //     var model = result['pop']()
            //     /** @type {number} */
            //     var j = 0
            //     var oHeight = result[0]['height']
            //     /** @type {number} */
            //     var option = 0
            //     var expectedRoom = result[0]['height']
            //     /** @type {number} */
            //     i = 1
            //     for (; i < result['length'] - 1; i++) {
            //       var params
            //       if ((params = result[i])['height'] > oHeight) {
            //         oHeight = params['height']
            //         /** @type {number} */
            //         j = i
            //       }
            //       if (params['height'] < expectedRoom) {
            //         expectedRoom = params['height']
            //         /** @type {number} */
            //         option = i
            //       }
            //     }
            //     var relation = result[j]
            //     var data = result[option]
            //     var included = _related2['getSlope'](model, relation)
            //     var match = _related2['getSlope'](model, data)
            //     if (included > match) {
            //       _related2['_fxOnePointOk'](model, relation, included)
            //     } else {
            //       _related2['_fxOnePointOk'](model, data, match)
            //     }
            //   }
            // )
          }
        }
      },
      {
        key: '_fxOnePointOk',
        value: function (cb, individual, value) {
          var positions
          var i = MSIMEarth['Cartographic']['toCartesian'](cb)
          var result = MSIMEarth['Cartographic']['toCartesian'](individual)
          result = (0, getOnLinePointByLen)(i, result, this['arrowLength'])
          /** @type {!Array} */
          positions =
            cb['height'] > individual['height'] ? [i, result] : [result, i]
          var GET_AUTH_URL_TIMEOUT = new MSIMEarth['GeometryInstance']({
            geometry: new MSIMEarth['PolylineGeometry']({
              positions: positions,
              width: this['options']['arrow']['width']
            }),
            vertexFormat:
              MSIMEarth['PolylineMaterialAppearance']['VERTEX_FORMAT'],
            id: 'polylinedashinstance'
          })
          this['instances']['push'](GET_AUTH_URL_TIMEOUT)
          /** @type {number} */
          var floatVal = Number((100 * Math['atan'](value))['toFixed'](2))
          var _0xe1d174 = floatVal['toFixed'](2) + '\u00b0'
          var _0x57e0c1 = (100 * value)['toFixed'](2) + '%'
          if (this['options']['point']['show']) {
            var column = this['pointInterPrimitives']['add']({
              text: '\u5761\u5ea6:' + _0xe1d174 + '  (' + _0x57e0c1 + ')',
              position: i,
              pixelSize: this['options']['point']['pixelSize'],
              color: this['options']['point']['color'],
              outlineWidth: this['options']['point']['outlineWidth'],
              outlineColor: this['options']['point']['outlineColor'],
              scaleByDistance: this['options']['point']['scaleByDistance'],
              disableDepthTestDistance:
                this['options']['point']['disableDepthTestDistance']
            })
            /** @type {number} */
            column['slope'] = floatVal
            column['click'] = this['options']['click']
            /** @type {string} */
            column['tooltip'] =
              '\u5761\u5ea6:' + _0xe1d174 + '  (' + _0x57e0c1 + ')'
          }
          if (
            (this['stateOkIndex']++, this['stateOkIndex'] >= this['stateAll'])
          ) {
            var artistTrack = this['viewer']['scene']['primitives']['add'](
              new MSIMEarth['Primitive']({
                geometryInstances: this['instances'],
                appearance: new MSIMEarth['PolylineMaterialAppearance']({
                  material: MSIMEarth['Material']['fromType']('PolylineArrow', {
                    color: this['options']['arrow']['color']
                  })
                })
              })
            )
            this['arrowPrimitives']['push'](artistTrack)
            /** @type {!Array} */
            this['instances'] = []
          }
        }
      },
      {
        key: 'getSlope',
        value: function (fn, data) {
          if (fn && data) {
            return (
              Math['abs'](fn['height'] - data['height']) /
              MSIMEarth['Cartesian3']['distance'](
                MSIMEarth['Cartographic']['toCartesian'](fn),
                MSIMEarth['Cartesian3']['fromRadians'](
                  data['longitude'],
                  data['latitude'],
                  fn['height']
                )
              )
            )
          }
        }
      },
      {
        key: 'clear',
        value: function () {
          if (this['pointInterPrimitives']) {
            this['pointInterPrimitives']['removeAll']()
          }
          /** @type {number} */
          var iAddressLoop = 0
          var addressCount = this['arrowPrimitives']['length']
          for (; iAddressLoop < addressCount; iAddressLoop++) {
            this['viewer']['scene']['primitives']['remove'](
              this['arrowPrimitives'][iAddressLoop]
            )
          }
          /** @type {!Array} */
          this['arrowPrimitives'] = []
          /** @type {!Array} */
          this['instances'] = []
          /** @type {number} */
          this['stateAll'] = 0
          /** @type {number} */
          this['stateOkIndex'] = 0
        }
      },
      {
        key: 'destroy',
        value: function () {
          this['clear']()
          delete this['pointInterPrimitives']
          delete this['arrowPrimitives']
          delete this['viewer']
        }
      },
      {
        key: 'draw',
        value: function () {
          var positions = [],
            polygon = new MSIMEarth.PolygonHierarchy(),
            _polygonEntity = new MSIMEarth.Entity(),
            $this = this,
            polyObj = null,
            _label = '',
            status = false,
            _handler = new MSIMEarth.ScreenSpaceEventHandler(
              this['viewer'].scene.canvas
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
            // var cartesian = $this['viewer'].scene.camera.pickEllipsoid(movement.endPosition, $this['viewer'].scene.globe.ellipsoid);
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

            positions.push(positions[0])
            _handler.destroy()
            $this['add'](positions, 10)

            if (typeof options.callback === 'function') {
              options.callback(
                $this.transformCartesianArrayToWGS84Array(positions),
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
              clampToGround: true
            }

            polyObj = $this['_drawLayer'].entities.add(_polygonEntity)
          }
        }
      }
    ]),
    render
  )
})()

var extend = function (defaults) {
  if (defaults && defaults['__esModule']) {
    return defaults
  }
  var processedOptions = {}
  if (null != defaults) {
    var name
    for (name in defaults) {
      if (Object['prototype']['hasOwnProperty']['call'](defaults, name)) {
        processedOptions[name] = defaults[name]
      }
    }
  }
  return (processedOptions['default'] = defaults), processedOptions
}
var noName = function (canCreateDiscussions, obj, isSlidingUp) {
  Object['defineProperty'](obj, '__esModule', {
    value: true
  })
  /**
   * @param {?} canCreateDiscussions
   * @return {undefined}
   */
  obj['addImage'] = function (canCreateDiscussions) {}
  obj['image'] = {
    url: null,
    rectangle: null
  }
}
var n = {}
var b = function (r) {
  if (n[r]) {
    return n[r]['exports']
  }
  var source = (n[r] = {
    i: r,
    l: false,
    exports: {}
  })
  return (
    noName['call'](source['exports'], source, source['exports'], b),
    (source['l'] = true),
    source['exports']
  )
}
var options = extend(b(2))

var interPolygon = function (data) {
  /**
   * @param {?} data
   * @param {!Object} uid
   * @return {?}
   */
  var extendedRegExp = MSIMEarth
  function load(data, uid) {
    var smallestPoint
    var b
    var d = (0, sin)(row, data, uid)
    if (_0x499b56) {
      var qs = extendedRegExp['Cartographic']['fromCartesian'](data)
      smallestPoint = extendedRegExp['Cartesian3']['fromRadians'](
        qs['longitude'],
        qs['latitude'],
        0
      )
      b = extendedRegExp['Cartesian3']['fromRadians'](
        qs['longitude'],
        qs['latitude'],
        d
      )
    }
    return (
      i < d && (i = d),
      c > d && (c = d),
      {
        height: d,
        point: smallestPoint,
        pointDM: b
      }
    )
  }
  var items = data['positions']
  var row = data['scene']
  /** @type {number} */
  var i = 0
  /** @type {number} */
  var c = 9999
  /** @type {!Array} */
  var tree = []
  /** @type {!Array} */
  var AP = []
  /** @type {number} */
  var prefix = 0
  for (; prefix < items['length']; prefix++) {
    AP['push'](items[prefix]['clone']())
  }
  var _0x499b56 = extendedRegExp['defaultValue'](data['onlyHeight'], true)
  var _0x42de06 = extendedRegExp['defaultValue'](data['onlyPoint'], false)
  var pluginModule
  var _0x2d4fb0
  var _0x22dc1f
  var doc
  var template
  var p
  var period = (0, getGranularity)(AP, data['splitNum'])
  var elmDocument = new extendedRegExp['PolygonGeometry']['fromPositions']({
    positions: AP,
    vertexFormat:
      extendedRegExp['PerInstanceColorAppearance']['FLAT_VERTEX_FORMAT'],
    granularity: period
  })
  var node = new extendedRegExp['PolygonGeometry']['createGeometry'](
    elmDocument
  )
  /** @type {number} */
  prefix = 0
  for (; prefix < node['indices']['length']; prefix = prefix + 3) {
    pluginModule = node['indices'][prefix]
    _0x2d4fb0 = node['indices'][prefix + 1]
    _0x22dc1f = node['indices'][prefix + 2]
    doc = load(
      new extendedRegExp['Cartesian3'](
        node['attributes']['position']['values'][3 * pluginModule],
        node['attributes']['position']['values'][3 * pluginModule + 1],
        node['attributes']['position']['values'][3 * pluginModule + 2]
      ),
      data
    )
    template = load(
      new extendedRegExp['Cartesian3'](
        node['attributes']['position']['values'][3 * _0x2d4fb0],
        node['attributes']['position']['values'][3 * _0x2d4fb0 + 1],
        node['attributes']['position']['values'][3 * _0x2d4fb0 + 2]
      ),
      data
    )
    p = load(
      new extendedRegExp['Cartesian3'](
        node['attributes']['position']['values'][3 * _0x22dc1f],
        node['attributes']['position']['values'][3 * _0x22dc1f + 1],
        node['attributes']['position']['values'][3 * _0x22dc1f + 2]
      ),
      data
    )
    if (_0x42de06) {
      tree_equals(tree, doc)
      tree_equals(tree, template)
      tree_equals(tree, p)
    } else {
      tree['push']({
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

var getOnLinePointByLen = function (v, lines, parentWidth) {
  var e = MSIMEarth['Transforms']['eastNorthUpToFixedFrame'](v)
  var start = MSIMEarth['Matrix4']['inverse'](e, new MSIMEarth['Matrix4']())
  v = MSIMEarth['Matrix4']['multiplyByPoint'](
    start,
    v,
    new MSIMEarth['Cartesian3']()
  )
  lines = MSIMEarth['Matrix4']['multiplyByPoint'](
    start,
    lines,
    new MSIMEarth['Cartesian3']()
  )
  var props = MSIMEarth['Cartesian3']['subtract'](
    lines,
    v,
    new MSIMEarth['Cartesian3']()
  )
  var width = MSIMEarth['Cartesian3']['distance'](v, lines)
  /** @type {number} */
  var widthAspectRatio = parentWidth / width
  var result = MSIMEarth['Cartesian3']['multiplyByScalar'](
    props,
    widthAspectRatio,
    new MSIMEarth['Cartesian3']()
  )
  return (result = MSIMEarth['Matrix4']['multiplyByPoint'](
    e,
    result,
    new MSIMEarth['Cartesian3']()
  ))
}

function pick3DTileset(context, data) {
  if (!data) {
    return null
  }
  if (context instanceof MSIMEarth['Viewer']) {
    context = context['scene']
  }
  if (data instanceof MSIMEarth['Cartesian3']) {
    /** @type {!Array} */
    data = [data]
  }
  /** @type {number} */
  var yField = 0
  var enc_data = data['length']
  for (; yField < enc_data; ++yField) {
    var value = data[yField]
    var key = MSIMEarth['SceneTransforms']['wgs84ToWindowCoordinates'](
      context,
      value
    )
    if (MSIMEarth['defined'](key)) {
      var obj = context['pick'](key, 10, 10)
      if (
        MSIMEarth['defined'](obj) &&
        MSIMEarth['defined'](obj['primitive']) &&
        obj['primitive'] instanceof MSIMEarth['Cesium3DTileset']
      ) {
        return obj['primitive']
      }
    }
  }
  return null
}

/**
 * @param {?} obj
 * @param {?} render_count
 * @return {?}
 */
function getGranularity(obj, render_count) {
  var props = MSIMEarth['Rectangle']['fromCartesianArray'](obj)
  var done_so_far = Math['max'](props['height'], props['width'])
  return (done_so_far =
    done_so_far / MSIMEarth['defaultValue'](render_count, 10))
}

/**
 * @param {!Object} object
 * @param {string} names
 * @param {!Object} types
 * @return {?}
 */
function callback(object, names, types) {
  var key =
    (types = types || {})['cartesian'] ||
    MSIMEarth['Cartographic']['fromCartesian'](names)
  if (types['asy']) {
    MSIMEarth['when'](
      MSIMEarth['sampleTerrainMostDetailed'](object['terrainProvider'], [key]),
      function (boardManager) {
        var value
        var PathPosition = boardManager[0]
        value =
          MSIMEarth['defined'](PathPosition) &&
          MSIMEarth['defined'](PathPosition['height'])
            ? PathPosition['height']
            : object['globe']['getHeight'](key)
        if (types['calback']) {
          types['calback'](value, key)
        }
      }
    )
  } else {
    var value = object['globe']['getHeight'](key)
    if (MSIMEarth['defined'](value) && value > -1e3) {
      return types['calback'] && types['calback'](value, key), value
    }
  }
  return 0
}

/**
 * @param {!Object} obj
 * @param {string} key
 * @param {!Object} props
 * @return {?}
 */
function configure(obj, key, props) {
  ;(props = props || {})['cartesian'] =
    props['cartesian'] || MSIMEarth['Cartographic']['fromCartesian'](key)
  var name = props['cartesian']
  if (!(0, ruggedNoise['hasTerrain'])(obj)) {
    return (
      props['calback'] && props['calback'](name['height'], name), name['height']
    )
  }
  if (props['asyn']) {
    obj['clampToHeightMostDetailed']([key])['then'](function (boardManager) {
      var includedElement = boardManager[0]
      if (MSIMEarth['defined'](includedElement)) {
        var height =
          MSIMEarth['Cartographic']['fromCartesian'](includedElement)['height']
        if (MSIMEarth['defined'](height) && height > -1e3) {
          return void (props['calback'] && props['calback'](height, name))
        }
      }
      callback(obj, key, props)
    })
  } else {
    var val = obj['sampleHeight'](name)
    if (MSIMEarth['defined'](val) && val > -1e3) {
      return props['calback'] && props['calback'](val, name), val
    }
  }
  return 0
}

function sin(node, args, options) {
  return (
    node instanceof MSIMEarth['Viewer'] && (node = node['scene']),
    (options = options || {}),
    MSIMEarth['defaultValue'](
      options['has3dtiles'],
      MSIMEarth['defined']((0, pick3DTileset)(node, args))
    )
      ? configure(node, args, options)
      : callback(node, args, options)
  )
}

/**
 * @param {!Object} b
 * @param {!Object} a
 * @return {undefined}
 */
function tree_equals(b, a) {
  /** @type {boolean} */
  var _0x40b1e7 = false
  var ptile_a = a['point']
  /** @type {number} */
  var i = 0
  for (; i < b['length']; i++) {
    var ptile_b = b[i]['point']
    if (
      ptile_a['x'] == ptile_b['x'] &&
      ptile_a['y'] == ptile_b['y'] &&
      ptile_a['z'] == ptile_b['z']
    ) {
      /** @type {boolean} */
      _0x40b1e7 = true
      break
    }
  }
  if (!_0x40b1e7) {
    b['push'](a)
  }
}

function getEllipseOuterPositions(data) {
  var extendedRegExp = MSIMEarth
  var title = data['position']
  var _0x2df96d = extendedRegExp['defaultValue'](data['count'], 1)
  var radius = extendedRegExp['defaultValue'](
    data['semiMajorAxis'],
    data['radius']
  )
  var _0x1a4d3f = extendedRegExp['defaultValue'](
    data['semiMinorAxis'],
    data['radius']
  )
  var rotationDiff = extendedRegExp['defaultValue'](data['rotation'], 0)
  var array = extendedRegExp['EllipseGeometryLibrary'][
    'computeEllipsePositions'
  ](
    {
      center: title,
      semiMajorAxis: radius,
      semiMinorAxis: _0x1a4d3f,
      rotation: rotationDiff,
      granularity: Math['PI'] / (16 * _0x2df96d)
    },
    true,
    true
  )['outerPositions']
  /** @type {!Array} */
  var command_codes = []
  /** @type {number} */
  var i = 0
  var length = array['length']
  for (; i < length; i = i + 3) {
    var data = new extendedRegExp['Cartesian3'](
      array[i],
      array[i + 1],
      array[i + 2]
    )
    command_codes['push'](data)
  }
  return command_codes
}
export default Slope
