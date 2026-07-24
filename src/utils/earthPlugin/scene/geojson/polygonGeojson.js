import geojson from './geojson'
/**
 * geojson多边形数据的加载、更新、清除等
 * @param
 */
class PolygonGeojson extends geojson {
  constructor(config) {
    super({
      earth: config.earth,
      viewer: config.viewer
    })
  }
  /**
   * geojson多边形数据的加载
   * @param {String} url geojson路径
   * @param {String} id 命名
   * @param {CesiumColor} outlineColor 边颜色
   * @param {Cesium.Material} material 填充材质
   * @param {Array} distanceDisplayCondition 显示距离 [0, 30e5]
   * @param {Array} optionsArray 多种多边形配置
   * @param {Number} height 离地高度
   * @param {HeightReference} HeightReference 相对高度类型
   */
  addPolygonGeojson(options) {
    const self = this
    let promise = this.addGeojson({
      url: options.url,
      id: options.id
    })
    promise.then((dataSource) => {
      console.log(dataSource)
      const entities = dataSource.entities.values
      const distanceDis = options.distanceDisplayCondition || [0, 250e5]
      const ddc = new self.earth.DistanceDisplayCondition(...distanceDis)
      const outlineColorRGB = options.outlineColor || [186, 105, 102, 1.0]
      const cesiumOutlineColor = new self.earth.Color(
        outlineColorRGB[0] / 255,
        outlineColorRGB[1] / 255,
        outlineColorRGB[2] / 255,
        outlineColorRGB[3]
      )
      const fillColorRGB = options.fillColor || [186, 105, 102, 1.0]
      const cesiumFillColor = new self.earth.Color(
        fillColorRGB[0] / 255,
        fillColorRGB[1] / 255,
        fillColorRGB[2] / 255,
        fillColorRGB[3]
      )
      const fillMaterial = options.material || cesiumFillColor
      for (let i = 0; i < entities.length; i++) {
        let entity = entities[i]
        entity.polygon.outline = options.outlineColor ? true : false
        entity.polygon.outlineColor = options.outlineColor
          ? cesiumOutlineColor
          : undefined
        entity.polygon.outlineWidth = options.outlineWidth || 1
        entity.polygon.fill = options.fillColor ? true : false
        entity.polygon.material = fillMaterial
        entity.polygon.distanceDisplayCondition = ddc
        entity.polygon.height = options.height || 0
        entity.polygon.heightReference =
          options.HeightReference || window.MSIMEarth.HeightReference.NONE
        // 若传入参数optionsArray，则根据要素name单独配置
        if (options.optionsArray == undefined) continue
        let targetOption = options.optionsArray.find((op) => {
          return entity._name.indexOf(op.id) > -1
        })
        if (!targetOption) continue //optionsArray中未设置该name要素，跳过
        entity.polygon.outline = targetOption.outlineColor ? true : false
        entity.polygon.fill = targetOption.fillColor ? true : false
        if (targetOption.outlineColor) {
          entity.polygon.outlineColor = new self.earth.Color(
            targetOption.outlineColor[0] / 255,
            targetOption.outlineColor[1] / 255,
            targetOption.outlineColor[2] / 255,
            targetOption.outlineColor[3]
          )
        }
        if (targetOption.fillColor) {
          entity.polygon.material = new self.earth.Color(
            targetOption.fillColor[0] / 255,
            targetOption.fillColor[1] / 255,
            targetOption.fillColor[2] / 255,
            targetOption.fillColor[3]
          )
        }
        entity.polygon.outlineWidth = targetOption.outlineWidth || 1
      }
    })
  }
  addGuojiexian() {
    const options = {
      url: basicVectorData.guojiexian,
      outlineColor: [255, 255, 0, 1],
      distanceDisplayCondition: [20e5, 250e5],
      id: 'guojiexian'
    }
    this.addPolygonGeojson(options)
  }
  // 例，geojson中指定name要素配置特定样式，
  add4H2B() {
    const optionsArray = [
      {
        id: '中印',
        outlineColor: [0, 255, 255, 0.7],
        fillColor: [0, 255, 255, 0.2]
      },
      {
        id: '中朝',
        outlineColor: [0, 255, 255, 0.7],
        fillColor: [0, 255, 255, 0.2]
      },
      {
        id: '海',
        outlineColor: [220, 20, 60, 0.7],
        fillColor: [220, 20, 60, 0.2]
      }
    ]
    const options = {
      url: basicVectorData.fourSeaTwoBorder,
      distanceDisplayCondition: [20e5, 250e5],
      id: '4H2B',
      outlineColor: [255, 255, 0, 0.2],
      optionsArray: optionsArray
    }
    this.addPolygonGeojson(options)
  }
  addDaLangQu(lqName) {
    // const options = {
    //   url: basicVectorData.dalangqu,
    //   outlineColor: window.MSIMEarth.Color.DODGERBLUE.withAlpha(0.5),
    //   distanceDisplayCondition: [20e5, 250e5],
    //   id: 'entitiesSeaHightArea',
    //   outlineColor: [0, 255, 255, 0.5]
    // }
    // this.addPolygonGeojson(options)
    let that = this
    //叠加海浪风险区
    let oceanwaveriskurl = 'static/data/geojson/oceanwaveriskarea.geojson'
    var promise = this.earth.GeoJsonDataSource.load(oceanwaveriskurl)
    // console.info("addOceanRisklayer......");
    promise.then(function (dataSource) {
      dataSource.name = 'entitiesSeaHightArea'
      that.viewer.dataSources.add(dataSource)
      var entities = dataSource.entities.values
      for (var i = 0; i < entities.length; i++) {
        var entity = entities[i]
        var level = entity.properties.level
        entity.polygon.outline = false
        if (level == 1) {
          entity.polygon.material = new that.earth.Color(0.3, 0.65, 0.75, 0.6)
          // entity.polygon.extrudedHeight = 1000.0;
        } else if (level == 2) {
          entity.polygon.material = new that.earth.Color(0.4, 0.7, 0.85, 0.4)
          // entity.polygon.extrudedHeight = 2000.0;
        } else if (level == 3) {
          entity.polygon.material = new that.earth.Color(0.5, 0.8, 0.9, 0.3)
          // entity.polygon.extrudedHeight = 3000.0;
        } else if (level == 4) {
          entity.polygon.material = new that.earth.Color(0.55, 0.85, 0.95, 0.15)
          // entity.polygon.extrudedHeight = 6000.0;
        }
      }
    })
    let wavetipposarr = [
      [1, 125.5, 24.5],
      [2, 127.3, 29.9],
      [3, 114.29, 19.54]
    ]
    for (var m = 0; m < wavetipposarr.length; m++) {
      let text = '海浪等级'
      let textColor = new that.earth.Color(0.0, 0.0, 0.0, 1.0)
      if (wavetipposarr[m][0] === 1) {
        text = '大浪' //'Ⅰ级'
        textColor = new that.earth.Color(0, 0, 0.65, 1.0)
      } else if (wavetipposarr[m][0] === 2) {
        text = '中浪' //'Ⅱ级'
        textColor = new that.earth.Color(0, 0, 0.7, 1.0)
      } else if (wavetipposarr[m][0] === 3) {
        text = '轻浪' //'Ⅲ级'
        textColor = new that.earth.Color(0, 0, 0.3, 1.0)
      }
      let backgroundColor = new that.earth.Color(0.99, 0.99, 0.99, 0.65)

      let wavelabel = {
        id: text,
        position: that.earth.Cartesian3.fromDegrees(
          wavetipposarr[m][1],
          wavetipposarr[m][2],
          10000
        ),
        label: {
          id: text,
          //文字标签
          text: text,
          // font: "320 30px Helvetica",// 15pt monospace
          font: '320 30px 宋体', // 15pt monospace
          scale: 0.8,
          style: that.earth.LabelStyle.FILL,
          fillColor: textColor,
          pixelOffset: new that.earth.Cartesian2(0, 0), //偏移量
          showBackground: true,
          backgroundColor: backgroundColor,
          // distanceDisplayCondition : new Cesium.DistanceDisplayCondition(0, 500),
          // scaleByDistance : new Cesium.NearFarScalar(100, 2, 500, 0.0),
          scaleByDistance: new that.earth.NearFarScalar(1.0e1, 0.9, 0.5e8, 0.0),
          eyeOffset: new that.earth.Cartesian3(0, 0, -10005)
        }
      }
      that.viewer.entities.add(wavelabel)
      // oceanriskarealabellist.push(reslabel)
    }

    // //叠加标题文字
    // let riskContentTitle = document.createElement('div')
    // riskContentTitle.className = 'talk-bubble round talktext'
    // riskContentTitle.style.visibility = 'visible'
    // riskContentTitle.style.width = '285px'
    // riskContentTitle.style.top = '65px'
    // riskContentTitle.style.left = window.innerWidth / 2 - 175 + 'px'
    // riskContentTitle.innerHTML =
    //   "<div style='font-size:14px;'><strong><b style='font-size:19px;color:#FEDD05'>" +
    //   '海洋灾害综合风险等级图（示意）' +
    //   '</b></strong>'
    // this.viewer.container.appendChild(riskContentTitle)
  }
}

export default PolygonGeojson
