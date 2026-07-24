export default class clusterByCustomDataSource {
  constructor(options) {
    this.viewer = options.viewer
    this.earth = options.earth
    this.dataSource = new this.earth.CustomDataSource('myData')
    this.initClustering()
    this.viewer.dataSources.add(this.dataSource)
  }

  // 有聚合功能的点用这个方法
  drawclusteringPoint(positions, imgUrl, text) {
    let that = this
    const billboard = this.dataSource.entities.add({
      position: positions,
      billboard: {
        image: imgUrl, // default: undefined
        verticalOrigin: that.earth.VerticalOrigin.BOTTOM,
        // pixelOffset: new Cesium.Cartesian2(0, -50), // default: (0, 0)
        // eyeOffset: new Cesium.Cartesian3(0.0, 0.0, 0.0), // default
        // horizontalOrigin: Cesium.HorizontalOrigin.CENTER, // default
        // verticalOrigin: Cesium.VerticalOrigin.BOTTOM, // default: CENTER
        scale: 0.4 // default: 1.0
        // color: Cesium.Color.LIME, // default: WHITE
        // rotation: Cesium.Math.PI_OVER_FOUR, // default: 0.0
        // alignedAxis: Cesium.Cartesian3.ZERO, // default
        // width: 100, // default: undefined
        // height: 25, // default: undefined
      }
    })
    if (text) {
      billboard.label = new that.earth.LabelGraphics({
        text: text,
        show: false,
        font: '14px Helvetica',
        style: that.earth.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        verticalOrigin: that.earth.VerticalOrigin.BOTTOM,
        pixelOffset: new that.earth.Cartesian2(0, -20)
      })
    }
    return billboard
  }

  initClustering() {
    const that = this
    const dataSourcePromise = this.viewer.dataSources.add(this.dataSource)
    dataSourcePromise.then(function (dataSource) {
      const pixelRange = 50 // 增加这个值可以使平面中聚合的访问更大，显示的点就会变少很多
      const minimumClusterSize = 3
      const enabled = true
      dataSource.clustering.enabled = enabled // 是否聚合
      dataSource.clustering.pixelRange = pixelRange
      dataSource.clustering.minimumClusterSize = minimumClusterSize
      that.customStyle()
    })
  }

  customStyle() {
    const that = this
    const pinBuilder = new that.earth.PinBuilder()
    const singleDigitPins = new Array(8)
    for (let i = 0; i < singleDigitPins.length; ++i) {
      singleDigitPins[i] = pinBuilder
        .fromText(`${i + 2}`, that.earth.Color.VIOLET, 48)
        .toDataURL()
    }
    if (that.earth.defined(that.removeListener)) {
      that.removeListener && that.removeListener()
      that.removeListener = undefined
    } else {
      that.removeListener =
        that.dataSource.clustering.clusterEvent.addEventListener(function (
          clusteredEntities,
          cluster
        ) {
          cluster.label.show = false
          cluster.label.font = '14px Helvetica'
          cluster.billboard.show = true
          cluster.billboard.id = cluster.label.id
          cluster.billboard.verticalOrigin = that.earth.VerticalOrigin.BOTTOM

          if (clusteredEntities.length >= 100) {
            cluster.billboard.image = './static/image/cluster/100.png'
            cluster.billboard.scale = 1.4
          } else if (clusteredEntities.length >= 50) {
            cluster.billboard.image = './static/image/cluster/50.png'
            cluster.billboard.scale = 1.3
          } else if (clusteredEntities.length >= 20) {
            cluster.billboard.image = './static/image/cluster/20.png'
            cluster.billboard.scale = 1.2
          } else if (clusteredEntities.length >= 10) {
            cluster.billboard.image = './static/image/cluster/10.png'
            cluster.billboard.scale = 1.2
          } else if (clusteredEntities.length >= 3) {
            cluster.billboard.image = './static/image/cluster/3.png'
            // cluster.billboard.image = combineIconAndLabel(
            //   './assets/img/cluster/1.png',
            //   clusteredEntities.length,
            //   44
            // );
            // cluster.billboard.scale = 1.2;
            // cluster.billboard.image = singleDigitPins[clusteredEntities.length - 2];
            // cluster.billboard.scale = 0.8;
          }
        })
    }
    const { pixelRange } = that.dataSource.clustering
    that.dataSource.clustering.pixelRange = 0
    that.dataSource.clustering.pixelRange = pixelRange
  }

  setSoucerceShowOrHide(isShow) {
    this.dataSource.entities.values.forEach((entity) => {
      entity.show = isShow
    })
  }

  // 根据某一类来控制显示和隐藏
  setResourceShowOrHideByType(type, isShow) {
    this.dataSource.entities.values.forEach((entity) => {
      if (entity.workName === type) {
        entity.show = isShow
      }
    })
  }
}
