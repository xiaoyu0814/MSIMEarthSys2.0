class ProfileAnalystTool {
  constructor(viewer, echarts, option) {
    this.viewer = viewer
    this.echarts = echarts
    this.enable = false
    this.handler = null

    this.ellipsoid = this.viewer.scene.globe.ellipsoid

    this.start = null
    this.end = null
    this.profile = {
      arrHB: [],
      arrPoint: [],
      arrLX: [],
      ponits: [],
      distance: 0
    }
    this.sectionChars = option.sectionChars
    this.echartsView1 = option.echartsView1
    this.myChart = null
    this.drawingMode = 'line'
    this.activeShapePoints = []
    this.activeShape = null
    this.floatingPoint = null
    this.floatingPointS = []
    this.entityPolygon = null
    this.point = null
    this.points = []
  }
  isEnable() {
    return this.enable
  }
  setEnable(enable) {
    this.enable = enable

    if (enable) {
      if (this.handler == null) {
        this.activeShapePoints = []
        this.draw()
      }
    } else {
      this.viewer.entities.remove(this.entityPolygon)
      this.viewer.entities.remove(this.point)
      this.sectionChars.style.display = 'none'
      this.echartsView1.style.display = 'none'

      this.profile.distance = 0
      this.profile.ponits.length = 0
      this.profile.arrLX.length = 0
      this.profile.arrPoint.length = 0
      this.profile.arrHB.length = 0

      if (this.handler != null) {
        this.handler.destroy()
        this.handler = null
      }
    }
  }
  draw() {
    var that = this
    //取消左键双击事件
    this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      MSIMEarth.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    )
    this.handler = new MSIMEarth.ScreenSpaceEventHandler(this.viewer.canvas)
    // var entityPolygon = null
    var points = null
    //取消左键双击事件
    this.viewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      MSIMEarth.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    )

    var drawingMode = this.drawingMode

    this.handler.setInputAction(function (event) {
      if (!MSIMEarth.Entity.supportsPolylinesOnTerrain(that.viewer.scene)) {
        console.log('This browser does not support polylines on terrain.')
        return
      }
      // 使用viewer.scene.pickPosition` 来代替`viewer.camera.pickEllipsoid` 这样当鼠标掠过terrain能得到正确的坐标
      var earthPosition = that.getCatesian3FromPX(event.position)
      if (MSIMEarth.defined(earthPosition)) {
        if (that.activeShapePoints.length === 0) {
          that.start = earthPosition
          that.floatingPoint = that.createPoint(earthPosition)
          that.floatingPointS.push(that.floatingPoint)
          that.activeShapePoints.push(earthPosition)
          var dynamicPositions = new MSIMEarth.CallbackProperty(function () {
            return that.activeShapePoints
          }, false)
          that.activeShape = that.drawShape(dynamicPositions)
        }
        //计算距离并且进行叠加
        // that.profile.distance =
        //   that.profile.distance +
        //   that.distance(
        //     that.activeShapePoints[that.activeShapePoints.length - 1],
        //     earthPosition
        //   )
        that.activeShapePoints.push(earthPosition)
        that.point = that.createPoint(earthPosition)
        that.points.push(that.point)
      }
    }, MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)
    this.handler.setInputAction(function (event) {
      if (MSIMEarth.defined(that.floatingPoint)) {
        var newPosition = that.getCatesian3FromPX(event.endPosition)
        if (MSIMEarth.defined(newPosition)) {
          if (that.activeShapePoints.length != 0) {
            that.floatingPoint.position.setValue(newPosition)
            that.activeShapePoints.pop()
            that.activeShapePoints.push(newPosition)
          }
        }
      }
    }, MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE)
    this.handler.setInputAction(function (event) {
      var length = that.activeShapePoints.length - 1
      var end = that.activeShapePoints[length]
      var data = that.profileAnalyse(that.start, end)

      that.setEchartsData(data)
      that.terminateShape()

      if (that.handler != null) {
        that.handler.destroy()
        that.handler = null
      }
    }, MSIMEarth.ScreenSpaceEventType.RIGHT_CLICK)
  }
  createPoint(worldPosition) {
    var point = this.viewer.entities.add({
      position: worldPosition,
      point: {
        pixelSize: 10,
        color: MSIMEarth.Color.YELLOW,
        //disableDepthTestDistance: Number.POSITIVE_INFINITY,
        heightReference: MSIMEarth.HeightReference.CLAMP_TO_GROUND
      }
    })
    return point
  }
  drawShape(positionData) {
    var shape
    if (this.drawingMode === 'line') {
      shape = this.viewer.entities.add({
        polyline: {
          positions: positionData,
          clampToGround: true,
          arcType: MSIMEarth.ArcType.RHUMB,
          material: MSIMEarth.Color.YELLOW,
          width: 5

          //zIndex:1
        }
        //,show:false
      })
    } else if (this.drawingMode === 'polygon') {
      shape = this.viewer.entities.add({
        polygon: {
          hierarchy: positionData,
          material: new MSIMEarth.ColorMaterialProperty(
            MSIMEarth.Color.LIGHTSKYBLUE.withAlpha(0.7)
          )
        }
      })
    }
    return shape
  }
  distance(point1, point2) {
    return 0
    // var point1cartographic = MSIMEarth.Cartographic.fromCartesian(point1)
    // var point2cartographic = MSIMEarth.Cartographic.fromCartesian(point2)
    // var ellipsoid = this.viewer.scene.globe.ellipsoid;
    // var point1cartesian3 = new MSIMEarth.Cartesian3(point1.x,point1.y,point1.z);
    // var point2cartesian3 = new MSIMEarth.Cartesian3(point2.x,point2.y,point2.z);
    // var point1cartographic = ellipsoid.cartesianToCartographic(point1cartesian3);
    // var point2cartographic = ellipsoid.cartesianToCartographic(point2cartesian3);

    var cartographic = MSIMEarth.Cartographic.fromCartesian(earthPosition)
    let lon = Cesium.Math.toDegrees(cartographic.longitude)
    let lat = Cesium.Math.toDegrees(cartographic.latitude)
    let height = Cesium.Math.toDegrees(cartographic.height)
    /**根据经纬度计算出距离**/
    var geodesic = new MSIMEarth.EllipsoidGeodesic()
    geodesic.setEndPoints(point1cartographic, point2cartographic)
    var s = geodesic.surfaceDistance
    //返回两点之间的距离
    s = Math.sqrt(
      Math.pow(s, 2) +
        Math.pow(point2cartographic.height - point1cartographic.height, 2)
    )
    return s
  }
  profileAnalyse(start, end) {
    var startPoint = MSIMEarth.Cartographic.fromCartesian(start)
    var endPoint = MSIMEarth.Cartographic.fromCartesian(end)

    /*
   this.profile.arrLX.push(0);
   this.profile.ponits.push(startPoint);
   this.profile.arrPoint.push(this.getDegrees(startPoint));
   this.profile.arrHB.push(startPoint.height);
   // 插值100个点，点越多模拟越精确，但是效率会低
   var count = 100.0;
   for (var i = 1; i < count; i++) {
       var cart = MSIMEarth.Cartesian3.lerp(start, end, i / count, new MSIMEarth.Cartesian3());
       var cartographicCart = MSIMEarth.Cartographic.fromCartesian(cart);
       var disc = this.distance(this.profile.ponits[i - 1], cartographicCart);
       this.profile.distance = this.profile.distance + disc;
       this.profile.ponits.push(cartographicCart);
       this.profile.arrLX.push(this.profile.arrLX[i - 1] + disc);

       this.profile.arrPoint.push(this.getDegrees(cart));
       this.profile.arrHB.push(cartographicCart.height);
   }
   */

    var ellipsoid = this.viewer.scene.globe.ellipsoid
    var cartographicStart = ellipsoid.cartesianToCartographic(start)
    var latStart = MSIMEarth.Math.toDegrees(cartographicStart.latitude)
    var lngStart = MSIMEarth.Math.toDegrees(cartographicStart.longitude)
    var cartographicEnd = ellipsoid.cartesianToCartographic(end)
    var latEnd = MSIMEarth.Math.toDegrees(cartographicEnd.latitude)
    var lngEnd = MSIMEarth.Math.toDegrees(cartographicEnd.longitude)

    let cartographic = MSIMEarth.Cartographic.fromDegrees(lngStart, latStart, 0)
    let height = this.viewer.scene.globe.getHeight(cartographic)

    this.profile.distance = 0
    this.profile.ponits.push(cartographic)
    this.profile.arrLX.push(this.profile.arrLX[i - 1])
    this.profile.arrPoint.push(this.getDegrees(cartographic))
    this.profile.arrHB.push(height)

    var count = 100.0
    for (var i = 1; i < count; i++) {
      var cart = MSIMEarth.Cartesian2.lerp(
        new MSIMEarth.Cartesian2(lngStart, latStart),
        new MSIMEarth.Cartesian2(lngEnd, latEnd),
        i / (count - 1),
        new MSIMEarth.Cartesian3()
      )
      let cartographic = MSIMEarth.Cartographic.fromDegrees(cart.x, cart.y, 0)
      let height = this.viewer.scene.globe.getHeight(cartographic)

      var dist = this.distance(this.profile.ponits[i - 1], cartographic)
      this.profile.distance += dist
      this.profile.ponits.push(cartographic)
      this.profile.arrLX.push(this.profile.arrLX[i - 1] + dist)
      this.profile.arrPoint.push(this.getDegrees(cartographic))
      this.profile.arrHB.push(height)
    }

    return this.profile
  }
  setEchartsData(e) {
    if (null != e && null != e.arrPoint) {
      this.echartsView1.style.display = ''
      this.sectionChars.style.display = 'block'
      this.sectionChars.style.display = 'block'
      this.sectionChars.style.display = 'block'
      this.sectionChars.style.display = 'block'

      null == this.myChart &&
        (this.myChart = this.echarts.init(this.echartsView1))

      var that = this
      var t = e.arrPoint,
        chartData = {
          grid: {
            top: 10,
            left: 60,
            right: 0,
            bottom: 10
          },
          dataZoom: [
            {
              type: 'inside',
              throttle: 50
            }
          ],
          tooltip: {
            trigger: 'axis',
            formatter: function (e) {
              var a = ''
              if (0 == e.length) return a
              e[0].value

              var r = t[e[0].dataIndex]

              return (a +=
                e[0].seriesName +
                "&nbsp;<label style='color:" +
                e[0].color +
                ";'>" +
                e[0].value.toFixed(3) +
                '米' +
                '</label><br />')
            }
          },
          xAxis: [
            {
              name: '行程',
              type: 'category',
              boundaryGap: !1,
              axisLine: {
                show: !1
              },
              axisLabel: {
                show: !1
              },
              data: e.arrLX
            }
          ],
          yAxis: [
            {
              type: 'value',
              axisLabel: {
                formatter: '{value} 米',
                textStyle: {
                  color: '#ffffff' // 将文字颜色设为红色
                }
              }
            }
          ],
          series: [
            {
              name: '高程值',
              type: 'line',
              smooth: !0,
              symbol: 'none',
              sampling: 'average',
              itemStyle: {
                normal: {
                  color: 'rgb(255, 70, 131)'
                }
              },
              areaStyle: {
                normal: {
                  color: new this.echarts.graphic.LinearGradient(0, 0, 0, 1, [
                    {
                      offset: 0,
                      color: 'rgb(255, 158, 68)'
                    },
                    {
                      offset: 1,
                      color: 'rgb(255, 70, 131)'
                    }
                  ])
                }
              },
              data: e.arrHB
            }
          ]
        }
      this.myChart.setOption(chartData)
    }
  }
  terminateShape() {
    this.activeShapePoints.pop()
    this.entityPolygon = this.drawShape(this.activeShapePoints)
    this.viewer.entities.remove(this.floatingPoint)
    for (let i = 0; i < this.floatingPointS.length; i++) {
      this.viewer.entities.remove(this.floatingPointS[i])
    }
    for (let i = 0; i < this.points.length; i++) {
      this.viewer.entities.remove(this.points[i])
    }
    this.viewer.entities.remove(this.activeShape)
    // entityPolygon = null
    //this.floatingPoint = undefined;
    //this.activeShape = undefined;
    this.activeShapePoints = []
  }
  getDegrees(cart) {
    // var cartographic = this.ellipsoid.cartesianToCartographic(cart)
    var lat = MSIMEarth.Math.toDegrees(cart.latitude)
    var lng = MSIMEarth.Math.toDegrees(cart.longitude)
    var alt = cart.height
    return { x: lng, y: lat, z: alt }
  }
  strFormat(str) {
    var strString = str.toString()
    var strs = strString.slice(0, strString.indexOf('.') + 3)
    return strs
  }
  /**
   * 拾取位置点
   *
   * @param {Object} px 屏幕坐标
   *
   * @return {Object} Cartesian3 三维坐标
   */
  getCatesian3FromPX(px) {
    if (this.viewer && px) {
      var picks = this.viewer.scene.drillPick(px)
      var cartesian = null
      var isOn3dtiles = false,
        isOnTerrain = false
      // drillPick
      for (let i in picks) {
        let pick = picks[i]

        if (
          (pick && pick.primitive instanceof MSIMEarth.Cesium3DTileFeature) ||
          (pick && pick.primitive instanceof MSIMEarth.Cesium3DTileset) ||
          (pick && pick.primitive instanceof MSIMEarth.Model)
        ) {
          //模型上拾取
          isOn3dtiles = true
        }
        // 3dtilset
        if (isOn3dtiles) {
          this.viewer.scene.pick(px) // pick
          cartesian = this.viewer.scene.pickPosition(px)
          if (cartesian) {
            let cartographic = MSIMEarth.Cartographic.fromCartesian(cartesian)
            if (cartographic.height < 0) cartographic.height = 0
            let lon = MSIMEarth.Math.toDegrees(cartographic.longitude),
              lat = MSIMEarth.Math.toDegrees(cartographic.latitude),
              height = cartographic.height
            cartesian = this.transformWGS84ToCartesian({
              lng: lon,
              lat: lat,
              alt: height
            })
          }
        }
      }
      // 地形
      let boolTerrain =
        this.viewer.terrainProvider instanceof
        MSIMEarth.EllipsoidTerrainProvider
      // Terrain
      if (!isOn3dtiles && !boolTerrain) {
        var ray = this.viewer.scene.camera.getPickRay(px)
        if (!ray) return null
        cartesian = this.viewer.scene.globe.pick(ray, this.viewer.scene)
        isOnTerrain = true
      }
      // 地球
      if (!isOn3dtiles && !isOnTerrain && boolTerrain) {
        cartesian = this.viewer.scene.camera.pickEllipsoid(
          px,
          this.viewer.scene.globe.ellipsoid
        )
      }
      if (cartesian) {
        let position = this.transformCartesianToWGS84(cartesian)
        if (position.alt < 0) {
          cartesian = this.transformWGS84ToCartesian(position, 0.1)
        }
        return cartesian
      }
      return false
    }
  }
  /***
   * 坐标转换 笛卡尔转84
   *
   * @param {Object} Cartesian3 三维位置坐标
   *
   * @return {Object} {lng,lat,alt} 地理坐标
   */
  transformCartesianToWGS84(cartesian) {
    if (this.viewer && cartesian) {
      var ellipsoid = MSIMEarth.Ellipsoid.WGS84
      var cartographic = ellipsoid.cartesianToCartographic(cartesian)
      return {
        lng: MSIMEarth.Math.toDegrees(cartographic.longitude),
        lat: MSIMEarth.Math.toDegrees(cartographic.latitude),
        alt: cartographic.height
      }
    }
  }
  /***
   * 坐标转换 84转笛卡尔
   *
   * @param {Object} {lng,lat,alt} 地理坐标
   *
   * @return {Object} Cartesian3 三维位置坐标
   */
  transformWGS84ToCartesian(position, alt) {
    if (this.viewer) {
      return position
        ? MSIMEarth.Cartesian3.fromDegrees(
            position.lng || position.lon,
            position.lat,
            (position.alt = alt || position.alt),
            MSIMEarth.Ellipsoid.WGS84
          )
        : MSIMEarth.Cartesian3.ZERO
    }
  }
}

export default ProfileAnalystTool
