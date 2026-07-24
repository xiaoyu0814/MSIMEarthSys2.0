import { getCatesian3FromPX } from './utils.js'
/**
 * @Description: 极坐标 测量 角度
 */
export default class MeasureAngle {
  constructor(viewer) {
    this.viewer = viewer
    this.arrowEntities = []
    this.viewEntities = []
    this.positions = []
  }
  /**
   * 转换为经纬度
   * @param cartesian {MSIMEarth.Cartesian3}
   * @return [lng,lat]
   */
  cartesianToLngLat(cartesian) {
    const latlng =
      this.viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
    const lat = MSIMEarth.Math.toDegrees(latlng.latitude)
    const lng = MSIMEarth.Math.toDegrees(latlng.longitude)
    return [lng, lat]
  }
  //初始化绘制事件
  initDraw() {
    //数组记录数据
    this.positions = []
    if (!this.handler)
      this.handler = new MSIMEarth.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      )
    let arrowEntity = null
    //左键点击
    this.handler.setInputAction((evt) => {
      //单机开始绘制
      var cartesian
      cartesian = getCatesian3FromPX(evt.position, this.viewer)
      if (!cartesian) return
      // if (this.positions.length == 0) {
      //     this.positions.push(cartesian);
      // }
      this.positions.push(cartesian)

      if (this.positions.length == 3) {
        this.handler.destroy()
        this.handler = null

        this.initDraw()
      }
    }, MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)

    //鼠标移动事件
    this.handler.setInputAction((evt) => {
      //移动时绘制面
      if (this.positions.length < 1) return
      var cartesian
      cartesian = getCatesian3FromPX(evt.endPosition)
      if (!cartesian) return

      if (this.positions.length >= 1) {
        if (!arrowEntity) {
          this.positions.push(cartesian)
          arrowEntity = this.showArrowOnMap(this.positions)
          this.showAngelOnMap(this.positions)
          this.showFloatLineOnMap(this.positions)
        } else {
          this.positions.pop()
          this.positions.push(cartesian)
        }
      }
    }, MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE)
  }

  /**
   * 清空结果
   */
  clear() {
    this.viewEntities.forEach((item) => {
      this.viewer.entities.remove(item)
    })
    this.viewEntities = []

    this.arrowEntities.forEach((item) => {
      this.viewer.entities.remove(item)
    })
    this.arrowEntities = []

    this.positions = []
    if (this.handler) {
      this.handler.destroy()
      this.handler = null
      delete this.handler
    }
  }

  getLineSDistance(positions) {
    let distance = 0
    const point1cartographic = MSIMEarth.Cartographic.fromCartesian(
      positions[0]
    )
    const point2cartographic = MSIMEarth.Cartographic.fromCartesian(
      positions[1]
    )
    /**根据经纬度计算出距离**/
    const geodesic = new MSIMEarth.EllipsoidGeodesic()
    geodesic.setEndPoints(point1cartographic, point2cartographic)
    let s = geodesic.surfaceDistance
    //console.log(Math.sqrt(Math.pow(distance, 2) + Math.pow(endheight, 2)));
    //返回两点之间的距离
    s = Math.sqrt(
      Math.pow(s, 2) +
        Math.pow(point2cartographic.height - point1cartographic.height, 2)
    )
    distance = distance + s
    return distance.toFixed(2)
  }

  showFloatLineOnMap(positions) {
    const that = this
    const radiansPerDegree = Math.PI / 180.0 //角度转化为弧度(rad)
    const update = function () {
      if (positions.length < 2) {
        return null
      }
      const startC = MSIMEarth.Cartographic.fromCartesian(positions[0])
      const distance = that.getLineSDistance(positions)
      const tmp = MSIMEarth.Cartesian3.fromRadians(
        startC.longitude,
        startC.latitude + (distance / 111000) * radiansPerDegree,
        startC.height
      )
      return [positions[0], tmp]
    }
    const arrowEntity = this.viewer.entities.add({
      polyline: new MSIMEarth.PolylineGraphics({
        positions: new MSIMEarth.CallbackProperty(update, false),
        clampToGround: true,
        material: new MSIMEarth.PolylineDashMaterialProperty({
          color: MSIMEarth.Color.RED
        }),
        width: 4
      })
    })
    this.arrowEntities.push(arrowEntity)
    return arrowEntity
  }

  /**
   * 绘制箭头
   * @param positions
   * @return {}
   */
  showArrowOnMap(positions) {
    const update = function () {
      if (positions.length < 2) {
        return null
      }
      return positions
    }
    const arrowEntity = this.viewer.entities.add({
      polyline: new MSIMEarth.PolylineGraphics({
        positions: new MSIMEarth.CallbackProperty(update, false),
        clampToGround: true,
        material: new MSIMEarth.PolylineArrowMaterialProperty(
          MSIMEarth.Color.fromCssColorString('#FFFF33').withAlpha(0.8)
        ),
        width: 8
      })
    })
    this.arrowEntities.push(arrowEntity)
    return arrowEntity
  }

  /**
   * 显示实时角度结果
   * @param positions
   * @return {}
   */
  showAngelOnMap(positions) {
    const $this = this
    const update = function () {
      if (positions.length < 2) {
        return null
      }

      return positions[1]
    }
    const textUpdate = function () {
      if (positions.length < 2) {
        return null
      }
      const firstPoint = $this.cartesianToLngLat(positions[0])
      const endPoints = $this.cartesianToLngLat(positions[1])
      const angelText = $this
        .courseAngle(firstPoint[0], firstPoint[1], endPoints[0], endPoints[1])
        .toFixed(1)
      return angelText + ' °'
    }
    const labelEntity = this.viewer.entities.add({
      position: new MSIMEarth.CallbackProperty(update, false),
      label: {
        text: new MSIMEarth.CallbackProperty(textUpdate, false),
        font: '18px sans-serif',
        fillColor: MSIMEarth.Color.GOLD,
        style: MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: MSIMEarth.VerticalOrigin.BOTTOM,
        pixelOffset: new MSIMEarth.Cartesian2(20, -20)
      }
    })
    this.viewEntities.push(labelEntity)
    return labelEntity
  }

  /**
   * 计算两个点的角度
   * @param lng_a
   * @param lat_a
   * @param lng_b
   * @param lat_b
   * @return {number}
   */
  courseAngle(lng_a, lat_a, lng_b, lat_b) {
    //以a点为原点建立局部坐标系（东方向为y轴,北方向为x轴,垂直于地面为z轴），得到一个局部坐标到世界坐标转换的变换矩阵
    // const localToWorld_Matrix = MSIMEarth.Transforms.northEastDownToFixedFrame(
    //     new MSIMEarth.Cartesian3.fromDegrees(lng_a, lat_a)
    // );

    //以a点为原点建立局部坐标系（东方向为x轴,北方向为y轴,垂直于地面为z轴），得到一个局部坐标到世界坐标转换的变换矩阵
    const localToWorld_Matrix = MSIMEarth.Transforms.eastNorthUpToFixedFrame(
      MSIMEarth.Cartesian3.fromDegrees(lng_a, lat_a)
    )
    //求世界坐标到局部坐标的变换矩阵
    const worldToLocal_Matrix = MSIMEarth.Matrix4.inverse(
      localToWorld_Matrix,
      new MSIMEarth.Matrix4()
    )
    //a点在局部坐标的位置，其实就是局部坐标原点
    const localPosition_A = MSIMEarth.Matrix4.multiplyByPoint(
      worldToLocal_Matrix,
      MSIMEarth.Cartesian3.fromDegrees(lng_a, lat_a),
      new MSIMEarth.Cartesian3()
    )
    //B点在以A点为原点的局部的坐标位置
    const localPosition_B = MSIMEarth.Matrix4.multiplyByPoint(
      worldToLocal_Matrix,
      MSIMEarth.Cartesian3.fromDegrees(lng_b, lat_b),
      new MSIMEarth.Cartesian3()
    )

    //弧度
    // const angle = Math.atan2(
    //     localPosition_B.y - localPosition_A.y,
    //     localPosition_B.x - localPosition_A.x
    // );
    //弧度
    const angle = Math.atan2(
      localPosition_B.x - localPosition_A.x,
      localPosition_B.y - localPosition_A.y
    )
    //角度
    let theta = angle * (180 / Math.PI)
    if (theta < 0) {
      theta = theta + 360
    }
    return theta
  }

  /**
   * 激活
   */
  activate() {
    this.initDraw()
  }

  /**
   * 关闭
   */
  deactivate() {
    this.clear()
  }
}
