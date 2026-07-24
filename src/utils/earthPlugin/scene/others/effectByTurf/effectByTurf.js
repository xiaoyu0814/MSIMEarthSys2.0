import * as turf from '@turf/turf'

export default class EffectByTurf {
  constructor(config) {
    this.earth = config.earth
    this.viewer = config.viewer
  }
  /**
   * 创建动态编组缓冲区
   * @param {array} targetsIdArr 构建编组的目标集合id
   */
  createGroupByTurf(targetsIdArr, color) {
    let that = this
    let bufferColor
    let outlineColor
    let dynamicPositions = new window.MSIMEarth.CallbackProperty(function () {
      let turfPoints = [] //基础点位经纬度集合
      let baseheightArr = [] //基础点位高度集合
      // 1.获取目标集合
      targetsIdArr.forEach((id) => {
        let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
          id,
          'MSIMEarthCZMLProcessContainer'
        )

        let currentTime = window.EarthViewer.clock.currentTime
        if (!window.MSIMEarth.defined(curEntity)) return
        let p = curEntity.position.getValue(currentTime)
        let graphicP = that.coordinateConvert(p)
        if (!window.MSIMEarth.defined(graphicP)) return
        if (
          typeof graphicP.lng === 'undefined' ||
          typeof graphicP.lat === 'undefined'
        )
          return
        turfPoints.push([graphicP.lng, graphicP.lat])
        baseheightArr.push(graphicP.alt)
      })
      if (baseheightArr.length === 0 || turfPoints.length < 2) return
      // 2.创建turf点位集合
      let polylineF = turf.lineString(turfPoints)
      // 2.1根据视距高设定缓冲区范围
      let cameraHeight =
        window.EarthViewer.camera.positionCartographic.height / 100000
      if (cameraHeight < 1) {
        cameraHeight = 1
      }
      // 2.2 计算buffer
      let buffered = turf.buffer(polylineF, 1 * cameraHeight, {
        units: 'kilometers'
      })
      // 2.3 获取计算后的坐标集合
      let coordinates = buffered.geometry.coordinates
      // 2.4 根据基础点位集合计算平均高度
      let height = that.getAverage(baseheightArr)
      // 2.5 组合坐标集合
      let bufferPoints = that.pointsToDegreesArrayHeight(coordinates[0], height)
      if (bufferPoints?.length === 0) {
        console.log('polygong点位集合为0,无需继续计算', bufferPoints)
        return
      }
      // 3. 创建polygon需要的实时点集
      let res =
        window.MSIMEarth.Cartesian3.fromDegreesArrayHeights(bufferPoints)
      // 4. 返回PolygonHierarchy
      let polygonHierarchy = new window.MSIMEarth.PolygonHierarchy(res)
      if (window.MSIMEarth.defined(polygonHierarchy)) {
        return polygonHierarchy
      } else {
        console.log('polygonHierarchy-error', polygonHierarchy)
        return new window.MSIMEarth.PolygonHierarchy([])
      }
    }, false)
    // 判断阵营，绘制颜色
    if (color == 'red') {
      bufferColor = new window.MSIMEarth.Color(1.0, 0.0, 0.0, 1.0)
      outlineColor = window.MSIMEarth.Color.RED
    } else if (color == 'blue') {
      bufferColor = new window.MSIMEarth.Color(0.0, 0.0, 1.0, 1.0)
      outlineColor = window.MSIMEarth.Color.BLUE
    } else if (color == 'green') {
      bufferColor = new window.MSIMEarth.Color(0.0, 1.0, 0.0, 1.0)
      outlineColor = window.MSIMEarth.Color.GREEN
    } else if (color == 'purple') {
      bufferColor = new window.MSIMEarth.Color(0.5, 0.0, 0.5, 1.0)
      outlineColor = window.MSIMEarth.Color.PURPLE
    }
    window.EarthViewer.entities.add({
      id: targetsIdArr[0] + '_turf',
      polygon: {
        hierarchy: dynamicPositions,
        // hierarchy: new window.MSIMEarth.PolygonHierarchy(positions),
        // hierarchy: window.MSIMEarth.CallbackProperty(function (positions) {
        //   return new window.MSIMEarth.PolygonHierarchy(positions)
        // }, false),
        material: new window.MSIMEarth.GradientMaterialProperty({
          repeat: new window.MSIMEarth.Cartesian2(1.0, 1.0),
          color: bufferColor,
          flowSpeed: 25.0,
          diffusePower: 1.2,
          alphaPower: 0.8,
          center: new window.MSIMEarth.Cartesian2(0.5, 0.5),
          globalAlpha: 0x1,
          transparent: true
        }),
        perPositionHeight: true,
        outline: true,
        outlineColor: outlineColor,
        outlineWidth: 4,
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          0,
          200e5
        )

        // classificationType: window.MSIMEarth.ClassificationType.BOTH
      }
    })
  }
  /**
   * 移除缓冲区
   * @param {string} targetsId
   */
  removeGroupByTurf(targetsId) {
    window.EarthViewer.entities.removeById(targetsId)
  }
  /**
   * 基于集合融合方式创建编组包络范围
   * @param {*} targetsIdArr 目标点id数组
   * @param {*} color 颜色 window.MSIMEarth.Color.RED等
   * @param {*} radius 覆盖半径
   */
  createGroupCircleByTurf(targetsIdArr, color, radius) {
    let that = this
    let dynamicPositions = new window.MSIMEarth.CallbackProperty(function () {
      // 1.通过循环拿到当前点集对应的实体目标点位集
      let turfPoints = []
      let baseheightArr = []
      targetsIdArr.forEach((id) => {
        let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
          id,
          'MSIMEarthCZMLProcessContainer'
        )
        let currentTime = window.EarthViewer.clock.currentTime
        if (!window.MSIMEarth.defined(curEntity)) return
        let p = curEntity.position.getValue(currentTime)
        let graphicP = that.coordinateConvert(p)
        if (!window.MSIMEarth.defined(graphicP)) return
        if (
          typeof graphicP.lng === 'undefined' ||
          typeof graphicP.lat === 'undefined'
        )
          return
        turfPoints.push([graphicP.lng, graphicP.lat])
        baseheightArr.push(graphicP.alt)
      })
      if (baseheightArr.length === 0 || turfPoints.length < 2) return
      // 2.根据点位集合创建每个拔高的圆包络范围
      let circles = []
      turfPoints.forEach((point) => {
        let center = point;
        // 注意此处使用单位是公里
        let options = { steps: 30, units: "kilometers", properties: { foo: "bar" } };
        let circle = turf.circle(center, radius, options);
        circles.push(circle)
      })
      // 3.合并所有圆包络范围
      let union = turf.union(...circles);
      // 3.1 获取计算后的坐标集合
      let coordinates = union.geometry.coordinates
      // 3.2 根据基础点位集合计算平均高度
      let height = that.getAverage(baseheightArr)
      // 3.3 组合坐标集合
      let bufferPoints = that.pointsToDegreesArrayHeight(coordinates[0], height)
      if (bufferPoints?.length === 0) {
        console.log('polygong点位集合为0,无需继续计算', bufferPoints)
        return
      }
      // 3.4 创建polygon需要的实时点集
      let res =
        window.MSIMEarth.Cartesian3.fromDegreesArrayHeights(bufferPoints)
      // 4. 返回PolygonHierarchy
      let polygonHierarchy = new window.MSIMEarth.PolygonHierarchy(res)
      if (window.MSIMEarth.defined(polygonHierarchy)) {
        return polygonHierarchy
      } else {
        console.log('polygonHierarchy-error', polygonHierarchy)
        return new window.MSIMEarth.PolygonHierarchy([])
      }
    }, false)
    // 5. 添加实体,id是targetsIdArr内各个元素拼接到一起加上_turf_group_circle
    let id = that.createIdByGroup(targetsIdArr, '_turf_group_circle')
    window.EarthViewer.entities.add({
      id: id,
      polygon: {
        hierarchy: dynamicPositions,
        perPositionHeight: true,
        material: new window.MSIMEarth.GradientMaterialProperty({
          repeat: new window.MSIMEarth.Cartesian2(8.0, 8.0),
          color: color || window.MSIMEarth.Color.RED,
          flowSpeed: 25.0,
          diffusePower: 1.0,
          alphaPower: 4,
          center: new window.MSIMEarth.Cartesian2(0.5, 0.5),
          globalAlpha: 0x1,
          transparent: true
        }),
      }
    })
  }
  /**
   * 移除基于集合融合方式创建编组包络范围的实体
   * @param {*} targetsIdArr 目标点id数组
   */
  removeGroupCircleByTurf(targetsIdArr) {
    let id = this.createIdByGroup(targetsIdArr, '_turf_group_circle')
    window.EarthViewer.entities.removeById(id)
  }
  /**
   * 创建基于集合融合方式创建编组包络范围的id
   * @param {array} targetsIdArr 目标点id数组
   * @param {string} type 类型
   * @returns
   */
  createIdByGroup(targetsIdArr, type) {
    return targetsIdArr.join('_') + type
  }
  /**
   * car3tolnglat
   * @param {cartesian3} positionC3 世界坐标
   * @returns
   */
  coordinateConvert(positionC3) {
    if (!window.MSIMEarth.defined(positionC3)) return
    let cartographic = window.MSIMEarth.Cartographic.fromCartesian(positionC3)
    var lng = window.MSIMEarth.Math.toDegrees(cartographic.longitude)
    var lat = window.MSIMEarth.Math.toDegrees(cartographic.latitude)
    var alt = cartographic.height
    return { lng: lng, lat: lat, alt: alt }
  }
  /**
   * 格式转换，构建polygon需要的点位集合
   * @param {*} points
   * @param {*} height
   * @returns
   */
  pointsToDegreesArrayHeight(points, height) {
    let degreesArray = []
    points.map((item) => {
      if (
        this.isConvertibleToNumber(item[0]) &&
        this.isConvertibleToNumber(item[1]) &&
        this.isConvertibleToNumber(height)
      ) {
        degreesArray.push(item[0])
        degreesArray.push(item[1])
        degreesArray.push(height)
      }
    })
    return degreesArray
  }
  /**
   * 计算平均值
   * @param {array} arr 数组
   */
  getAverage(arr) {
    let sum = 0
    for (let i = 0; i < arr.length; i++) {
      sum += arr[i]
    }
    const average = arr.length ? sum / arr.length : 0
    return average
  }
  isConvertibleToNumber(value) {
    return !isNaN(Number(value)) && typeof value !== 'boolean'
  }
  /**
   * 基于多个点计算中心点
   * @param {array} multiPoints 点位数组[
        [120.16, 25.62],
        [120.59, 25.41],
        [120.31, 25.17]
      ]
   */
  getCenterPointByMultiPoints(multiPoints) {
    let res = null
    if (multiPoints.length && multiPoints.length > 1) {
      const points = turf.points(multiPoints)
      const center = turf.center(points)
      res = center
      // multiPoints.forEach((p) => {
      //   window.EarthViewer.entities.add({
      //     position: new window.MSIMEarth.Cartesian3.fromDegrees(p[0], p[1]),
      //     point: {
      //       pixelSize: 3
      //     }
      //   })
      // })
    } else {
      // 只有一个点不需要计算
      res = {
        geometry: {
          coordinates: multiPoints[0]
        }
      }
    }
    return res
  }
}
