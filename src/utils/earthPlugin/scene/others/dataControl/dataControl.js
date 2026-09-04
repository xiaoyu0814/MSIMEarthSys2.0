import store from '@/store'
import { worldPosToGraphic } from '@/utils/mapTools'
import { airport } from './data/airport2.js'
import { LoadSatellitByCzml } from '@/utils/earthPlugin/core/actionController/satellitCZML'
import { areaConfig } from './methodConfig/areaConfig.js'
import Heatmap3d from './methodConfig/heatmap3d.js'

class DataControl {
  constructor(config) {
    this.Cesium = config.Cesium
    this.viewer = config.viewer
    const option = {
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    }
    this.dataManagement = new window.EarthPlugn.dataManagement(option)
  }
  // 添加海岸基线
  _addHAJX() {
    const options = {
      url: 'static/data/geojson/FK识别区/海基线线数据.json',
      color: window.MSIMEarth.Color.RED,
      addLabel: false,
      dataType: 'vector',
      geoType: 'polyline',
      id: '海岸'
    }
    this.addGeojson(options)
  }
  // 添加防空识别区
  _addDHFKSBQ() {
    const options2 = {
      url: 'static/data/geojson/FK识别区/东海防空识别线数据.json',
      color: window.MSIMEarth.Color.RED,
      addLabel: false,
      dataType: 'vector',
      geoType: 'polyline',
      id: '防空2'
    }
    // this.addGeojson(options)
    this.addGeojson(options2)
    // 东海防空识别区的标识
    let center = window.MSIMEarth.Cartesian3.fromDegrees(
      124.56142578414978,
      29.088438770842423
    )
    let centerTW = window.MSIMEarth.Cartesian3.fromDegrees(
      120.83108755879553,
      23.589335002507163
    )
    var heading = -window.MSIMEarth.Math.PI_OVER_TWO
    var pitch = window.MSIMEarth.Math.PI_OVER_FOUR
    var roll = 0.0
    var hpr = new window.MSIMEarth.HeadingPitchRoll(heading, pitch, roll)
    var quaternion = window.MSIMEarth.Transforms.headingPitchRollQuaternion(
      centerTW,
      hpr
    )
    window.EarthViewer.entities.add({
      id: 'dhfksbq_name_id',
      name: 'dhfksbq_name',
      position: center,
      orientation: quaternion,
      label: {
        text: '东海防空识别区',
        font: 'normal 46px MicroSoft YaHei',
        scale: 0.5,
        fillColor: window.MSIMEarth.Color.RED,
        style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT, //水平位置
        verticalOrigin: window.MSIMEarth.VerticalOrigin.BOTTOM,
        pixelOffset: new window.MSIMEarth.Cartesian2(-63, 11),
        eyeOffset: new window.MSIMEarth.ConstantProperty(
          new window.MSIMEarth.Cartesian3(0, 0, -11)
        ),
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          20e5,
          60e5
        ),
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    })
  }
  /**
   * 台湾防空识别区
   */
  addTWFKSBQ() {
    window.EarthViewer.entities.add({
      name: 'Blue dashed line',
      id: 'twfksbq_polyline_id',
      polyline: {
        positions: window.MSIMEarth.Cartesian3.fromDegreesArray([
          117.5, 29.0, 123.0, 29.0, 123, 22.5, 121.5, 21, 117.5, 21, 117.5, 29
        ]),
        width: 2,
        material: window.MSIMEarth.Color.BLUE.withAlpha(1),
        clampToGround: true,
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          20e5,
          100e5
        )
      }
    })
    let centerTW = window.MSIMEarth.Cartesian3.fromDegrees(
      120.83108755879553,
      23.589335002507163
    )
    var heading = -window.MSIMEarth.Math.PI_OVER_TWO
    var pitch = window.MSIMEarth.Math.PI_OVER_FOUR
    var roll = 0.0
    var hpr = new window.MSIMEarth.HeadingPitchRoll(heading, pitch, roll)
    var quaternion = window.MSIMEarth.Transforms.headingPitchRollQuaternion(
      centerTW,
      hpr
    )
    window.EarthViewer.entities.add({
      id: 'twfksbq_name_id',
      name: 'twfksbq_name',
      position: centerTW,
      orientation: quaternion,
      label: {
        // text: '财政局西门',
        text: '台湾防空识别区',
        // backgroundColor: new window.MSIMEarth.Color(1.0, 153 / 255, 18 / 255, 1.0),
        // showBackground: false,
        font: 'normal 46px MicroSoft YaHei',
        scale: 0.5,
        fillColor: window.MSIMEarth.Color.BLUE,
        style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        // outlineWidth: 2,
        horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT, //水平位置
        verticalOrigin: window.MSIMEarth.VerticalOrigin.BOTTOM,
        pixelOffset: new window.MSIMEarth.Cartesian2(-73, 11),
        eyeOffset: new window.MSIMEarth.ConstantProperty(
          new window.MSIMEarth.Cartesian3(0, 0, -11)
        ),
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          20e5,
          60e5
        ),
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    })
  }

  //删除台湾防空识别区
  deletFKSBQ()
  {
    if (window.EarthViewer.entities.getById('twfksbq_polyline_id')) {
      window.EarthViewer.entities.removeById('twfksbq_polyline_id')
    }
    if (window.EarthViewer.entities.getById('twfksbq_name_id')) {
      window.EarthViewer.entities.removeById('twfksbq_name_id')
    }
    if (window.EarthViewer.entities.getById('dhfksbq_name_id')) {
      window.EarthViewer.entities.removeById('dhfksbq_name_id')
    }
  }
  /**
   * 添加四海两边
   */
  _add4H2B() {
    let add = true
    window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
      if (dataSource._name == '4H2B') {
        dataSource.show = true
        add = false
      }
    })
    if (!add) return
    this.dataManagement.polygonGeojsonManagement.add4H2B()
  }
  /**
   * 添加岛链数据
   */
  _addDaoLian() {
    let add = true
    window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
      if (dataSource._name == 'daolian1' || dataSource._name == 'daolian2') {
        dataSource.show = true
        add = false
        // 移除czml路径
        // window.EarthViewer.dataSources.remove(dataSource)
      }
    })
    if (!add) return
    console.log('加载导联')
    this.clearLayerGeo('daolian1')
    this.clearLayerGeo('daolian2')
    const options1 = {
      url: basicVectorData.daolian1,
      color: window.MSIMEarth.Color.YELLOW,
      addLabel: false,
      dataType: 'vector',
      geoType: 'polyline',
      id: 'daolian1'
    }
    this.addGeojson(options1)
    const options2 = {
      url: basicVectorData.daolian2,
      color: window.MSIMEarth.Color.YELLOW,
      addLabel: false,
      dataType: 'vector',
      geoType: 'polyline',
      id: 'daolian2'
    }
    this.addGeojson(options2)
  }
  // 添加geojson
  addGeojson(options) {
    let self = this
    window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
      if (dataSource._name == options.id) {
        // 移除czml路径
        window.EarthViewer.dataSources.remove(dataSource)
      }
    })
    var promise = window.MSIMEarth.GeoJsonDataSource.load(options.url)
    // console.log(options)
    if (!options.geoType) return
    promise.then(function (dataSource) {
      dataSource.name = options.id
      var entities = dataSource.entities.values
      for (let i = 0; i < entities.length; i++) {
        let entity = entities[i]
        entity.billboard = undefined
        let geoType = options.geoType
        switch (geoType) {
          case 'point':
            entity.point = {
              color: options.color,
              pixelSize: 5
              // disableDepthTestDistance: Number.POSITIVE_INFINITY,
              // heightReference: window.MSIMEarth.HeightReference.CLAMP_TO_GROUND
            }
            if (options.id == '防空1') {
              // console.log(entity)
              self.createBillboardLabel_DC({
                cartesian3: entity.position._value,
                text: entity.properties.position._value,
                offset: new window.MSIMEarth.Cartesian2(0, -40),
                img: 'static/image/billboard/border_bg_red.png'
              })
            } else if (options.id == 'ZY_elevation_point') {
              self.createElevationLabel({
                cartesian3: entity.position._value,
                text: entity.properties.z._value.toString(),
                offset: new window.MSIMEarth.Cartesian2(0, -40),
                img: 'static/image/billboard/border_bg_red.png'
              })
            } else if (
              options.id == 'debris' ||
              options.id == 'landslide' ||
              options.id == 'earthquake'
            ) {
              let imageUrl = ''
              let color = window.MSIMEarth.Color.RED
              switch (options.id) {
                case 'debris':
                  imageUrl = 'static/image/billboard/危险源_hp.png'
                  color = window.MSIMEarth.Color.YELLOW
                  break
                case 'landslide':
                  imageUrl = 'static/image/billboard/危险源_nsl.png'
                  color = window.MSIMEarth.Color.BLUEVIOLET
                  break
                case 'earthquake':
                  imageUrl = 'static/image/billboard/危险源_dz.png'
                  break
                default:
                  break
              }
              entity.billboard = {
                image: imageUrl,
                show: true,
                width: 5,
                height: 5,
                rotation: 0.0,
                eyeOffset: new window.MSIMEarth.ConstantProperty(
                  new window.MSIMEarth.Cartesian3(0, 0, -1)
                ),
                pixelOffset: new window.MSIMEarth.Cartesian2(0.0, -25),
                scaleByDistance: new window.MSIMEarth.NearFarScalar(
                  1.5e2,
                  6.0,
                  1.5e7,
                  3.5
                ),
                heightReference:
                  window.MSIMEarth.HeightReference.CLAMP_TO_GROUND,
                distanceDisplayCondition:
                  new window.MSIMEarth.DistanceDisplayCondition(0, 100e5),
                disableDepthTestDistance: Number.POSITIVE_INFINITY
              }
              entity.point = undefined
              entity.point = {
                color: color,
                pixelSize: 5
              }
              entity.ellipse = {
                semiMinorAxis: 3520.0,
                semiMajorAxis: 3520.0,
                material: new window.MSIMEarth.PulseMaterialProperty({
                  color: color,
                  mixColor: new window.MSIMEarth.Color(
                    227 / 255,
                    62 / 255,
                    49 / 255,
                    1.0
                  ),
                  repeat: new window.MSIMEarth.Cartesian2(1.0, 1.0),
                  // half: false,
                  flowSpeed: 45,
                  transparent: true
                }),
                distanceDisplayCondition:
                  new window.MSIMEarth.DistanceDisplayCondition(0, 100e5),
                height: 100
              }
              // label: {
              //   //文字标签
              //   text: element.name,
              //   font: '15px sans-serif',
              //   style: window.MSIMEarth.LabelStyle.FILL,
              //   horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
              //   verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
              //   pixelOffset: new window.MSIMEarth.Cartesian2(20, -60),
              //   // showBackground: true,
              //   backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
              //   distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
              //     0,
              //     100e5
              //   )
              // }
            } else if (options.id === 'zy_QixiangPositions') {
              entity.point = undefined
              entity.label = {
                text: entity.properties.Field1._value,
                font: '18px black',
                fillColor: window.MSIMEarth.Color.WHITE,
                style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
                horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
                verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
                pixelOffset: new window.MSIMEarth.Cartesian2(0, -40),
                outlineColor: window.MSIMEarth.Color.BLACK,
                outlineWidth: 2,
                // showBackground: true,
                backgroundColor: new window.MSIMEarth.Color.fromBytes(
                  235,
                  155,
                  33
                ),
                heightReference:
                  window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND,
                distanceDisplayCondition:
                  new window.MSIMEarth.DistanceDisplayCondition(0, 10e5),
                disableDepthTestDistance: Number.POSITIVE_INFINITY
              }
            } else {
              if (typeof entity.properties.position != 'undefined') {
                self.createBillboardLabel_DC({
                  cartesian3: entity.position._value,
                  text: entity.properties.position._value,
                  name: entity.properties.type._value,
                  offset: new window.MSIMEarth.Cartesian2(0, -40),
                  img: 'static/image/billboard/border_bg_red.png'
                })
              } else if (
                typeof entity.properties.x != 'undefined' &&
                typeof entity.properties.y != 'undefined'
              ) {
                self.createBillboardLabel_DC({
                  cartesian3: entity.position._value,
                  text: entity.properties.template_n._value,
                  name: entity.properties.template_n._value,
                  color: window.MSIMEarth.Color.GREENYELLOW,
                  labelScale: 0.6,
                  offset: new window.MSIMEarth.Cartesian2(0, -40),
                  img: 'static/image/billboard/border_bg_yellow.png'
                })
              } else {
              }
            }
            // console.log(entity.point)
            break
          case 'polyline':
            entity.polyline.material = options.color
              ; (entity.polyline.clampToGround = true),
                (entity.polyline.distanceDisplayCondition =
                  new window.MSIMEarth.DistanceDisplayCondition(20e5, 100e5))
            entity.billboard = undefined
            if (options.id == 'guojiexian') {
              entity.polyline.width = options.width
              entity.polyline.material = new window.MSIMEarth.Color(
                186 / 255,
                105 / 255,
                102 / 255,
                0.7
              )
              entity.polyline.distanceDisplayCondition =
                new window.MSIMEarth.DistanceDisplayCondition(20e5, 350e5)
            } else if (options.id === 'zyRiver_link') {
              entity.polyline.width = options.width
              entity.polyline.material =
                window.MSIMEarth.Color.DODGERBLUE.withAlpha(0.5)
              entity.polyline.distanceDisplayCondition =
                new window.MSIMEarth.DistanceDisplayCondition(0, 100e5)
              entity.polyline.width = options.width
              // entity.polyline.height = 100
              entity.polyline.clampToGround = true
              // entity.polyline.heightReference =
              //   window.MSIMEarth.HeightReference.CLAMP_TO_GROUND
            } else if (options.id == 'guojiexian2') {
              entity.polyline.width = options.width
              entity.polyline.material = new window.MSIMEarth.Color(
                217 / 255,
                217 / 255,
                223 / 255,
                0.7
              )
              entity.polyline.distanceDisplayCondition =
                new window.MSIMEarth.DistanceDisplayCondition(20e5, 350e5)
            } else if (options.id == 'shengjiexian') {
              entity.polyline.width = options.width
              entity.polyline.material = new window.MSIMEarth.Color(
                217 / 255,
                217 / 255,
                223 / 255,
                0.7
              )
              entity.polyline.distanceDisplayCondition =
                new window.MSIMEarth.DistanceDisplayCondition(20e5, 70e5)
            } else if (
              options.id == 'daolian1' ||
              options.id == 'daolian2' ||
              options.id == 'daolian3'
            ) {
              // entity.polyline.distanceDisplayCondition =
              // new window.MSIMEarth.DistanceDisplayCondition(20, 100e20)
              entity.polyline.width = 1
              entity.polyline.material = new window.MSIMEarth.Color(
                1.0,
                0.0,
                0.0,
                1.0
              )
              // entity.polyline.material = options.color
              //   ? options.color
              //   : new window.MSIMEarth.Color(1.0, 0.0, 0.0, 1.0)
              entity.polyline.distanceDisplayCondition =
                new window.MSIMEarth.DistanceDisplayCondition(20e5, 100e5)
            } else if (options.id == 'yindushiquan') {
              entity.polyline.width = 8
              entity.polyline.material = new window.MSIMEarth.Color(
                100 / 255,
                180 / 255,
                232 / 255,
                1.0
              )
              entity.polyline.distanceDisplayCondition =
                new window.MSIMEarth.DistanceDisplayCondition(0, 30e5)
            } else if (options.id == 'g219') {
              entity.polyline.width = 5
              entity.polyline.material = new window.MSIMEarth.Color(
                186 / 255,
                105 / 255,
                102 / 255,
                1.0
              )
              entity.polyline.distanceDisplayCondition =
                new window.MSIMEarth.DistanceDisplayCondition(0, 30e5)
            } else {
            }
            break
          case 'polygon':
            if (options.id == '4H2B') {
              if (entity._name == undefined) {
                // 等高线
                entity.polygon.outlineColor =
                  window.MSIMEarth.Color.YELLOW.withAlpha(0.2)
                entity.polygon.fill = false
                entity.polygon.distanceDisplayCondition =
                  new window.MSIMEarth.DistanceDisplayCondition(20e5, 250e5)
              } else if (entity._name == '中印' || entity._name == '中朝') {
                entity.polygon.material =
                  window.MSIMEarth.Color.CYAN.withAlpha(0.2)
                entity.polygon.outlineColor =
                  window.MSIMEarth.Color.CYAN.withAlpha(0.7)
                entity.polygon.distanceDisplayCondition =
                  new window.MSIMEarth.DistanceDisplayCondition(20e5, 250e5)
              } else if (entity._name.indexOf('海') > -1) {
                entity.polygon.material =
                  window.MSIMEarth.Color.CRIMSON.withAlpha(0.2)
                entity.polygon.outlineColor =
                  window.MSIMEarth.Color.CRIMSON.withAlpha(0.7)
                entity.polygon.distanceDisplayCondition =
                  new window.MSIMEarth.DistanceDisplayCondition(20e5, 250e5)
              } else {
                console.log('四海两边其他数据')
              }
            } else if (options.id == 'guojiexian') {
              entity.polygon.material = new window.MSIMEarth.Color(
                1.0,
                0.0,
                0.0,
                0.0
              )
              entity.polygon.outline = true
              entity.polygon.outlineColor = window.MSIMEarth.Color.YELLOW
              entity.polygon.distanceDisplayCondition =
                new window.MSIMEarth.DistanceDisplayCondition(20e5, 250e5)
            } else if (options.id == 'zyWater_area') {
              entity.polygon.material = new window.MSIMEarth.Color(
                0.0,
                1.0,
                1.0,
                1.0
              )
              // entity.polygon.outline = true
              // entity.polygon.outlineColor = window.MSIMEarth.Color.YELLOW
              entity.polygon.height = 2
              entity.polygon.heightReference =
                window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND
              entity.polygon.distanceDisplayCondition =
                new window.MSIMEarth.DistanceDisplayCondition(0, 100e5)
              console.log(entity.polygon)
            } else if (options.id === 'zyGlacier') {
              entity.polygon.outline = true
              entity.polygon.outlineColor = window.MSIMEarth.Color.RED
              entity.polygon.material = window.MSIMEarth.Color.DIMGRAY
              entity.polygon.height = 100
              entity.polygon.heightReference =
                window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND
              entity.polygon.distanceDisplayCondition =
                new window.MSIMEarth.DistanceDisplayCondition(0, 100e5)
            } else {
              console.log('其他polygong类型数据')
            }

            break
          default:
            break
        }
        if (options.addLabel) {
          let textVal = ''
          if (entity.properties.position)
            textVal = entity.properties.position._value
          entity.label = {
            text: textVal,
            font: 'normal 32px MicroSoft YaHei',
            scale: 0.5,
            fillColor: window.MSIMEarth.Color.RED,
            style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
            // outlineWidth: 2,
            horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT, //水平位置
            verticalOrigin: window.MSIMEarth.VerticalOrigin.BOTTOM,
            pixelOffset: new window.MSIMEarth.Cartesian2(-63, -31),
            eyeOffset: new window.MSIMEarth.ConstantProperty(
              new window.MSIMEarth.Cartesian3(0, 0, -11)
            ),
            distanceDisplayCondition:
              new window.MSIMEarth.DistanceDisplayCondition(0, 100e5)
          }
        }
      }
      window.EarthViewer.dataSources.add(dataSource)
    })
  }
  /**
   * label结合billboard
   * @param {Object} val 标牌参数 坐标 图片路径 宽高 偏移等
   */
  createBillboardLabel_DC(val) {
    const Cesium = window.MSIMEarth
    // var center = window.MSIMEarth.Cartesian3.fromDegrees(
    //   108.95941558359958,
    //   34.219783901879,
    //   487.37960915730173
    // )
    let center = val.cartesian3
    var heading = -window.MSIMEarth.Math.PI_OVER_TWO
    var pitch = window.MSIMEarth.Math.PI_OVER_FOUR
    var roll = 0.0
    var hpr = new window.MSIMEarth.HeadingPitchRoll(heading, pitch, roll)
    var quaternion = window.MSIMEarth.Transforms.headingPitchRollQuaternion(
      center,
      hpr
    )
    window.EarthViewer.entities.add({
      name: 'billboardlabel',
      position: center,
      orientation: quaternion,
      billboard: {
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          0,
          // 2e5
          30e5
        ),
        image: val.img || 'static/image/billboard/border_bg01.png',
        // imageSubRegion : new window.MSIMEarth.BoundingRectangle(47, 80, 14, 14),
        name: 'singleWarning',
        show: true,
        width: val.width || 18,
        height: 4,
        // alignedAxis: new window.MSIMEarth.Cartesian3(10, 0, 0),
        eyeOffset: new window.MSIMEarth.ConstantProperty(
          new window.MSIMEarth.Cartesian3(0, 0, -1)
        ),
        pixelOffset: val.offset,
        // sizeInMeters: true, //图像的尺寸被指定成图像实际的尺寸
        // pixelOffset : new window.MSIMEarth.Cartesian2(0.0, 0),
        // position: window.MSIMEarth.Cartesian3.fromDegrees(116.2, 39.53, 15),
        //   distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(0, 6.8e10),
        // verticalOrigin: window.MSIMEarth.VerticalOrigin.TOP,
        scale: val.billboardScale || 6
        // scaleByDistance: new window.MSIMEarth.NearFarScalar(1.5e2, 6.0, 1.5e7, 3.5)
        // disableDepthTestDistance: Number.POSITIVE_INFINITY, //防止深度测试导致的遮挡 默认为0会遮挡
      },
      label: {
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          0,
          // 2e5
          30e5
        ),
        // text: '财政局西门',
        text: val.name,
        // backgroundColor: new window.MSIMEarth.Color(1.0, 153 / 255, 18 / 255, 1.0),
        // showBackground: false,
        font: 'normal 32px MicroSoft YaHei',
        scale: val.labelScale || 0.4,
        fillColor: val.color || window.MSIMEarth.Color.AQUA,
        style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        // outlineWidth: 2,
        horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT, //水平位置
        verticalOrigin: window.MSIMEarth.VerticalOrigin.BOTTOM,
        pixelOffset:
          val.pixelOffset || new window.MSIMEarth.Cartesian2(-43, -30),
        eyeOffset: new window.MSIMEarth.ConstantProperty(
          new window.MSIMEarth.Cartesian3(0, 0, -1)
        )
      }
    })
  }
  /**
   * 高程点标注
   * @param {*} val
   */
  createElevationLabel(val) {
    const Cesium = window.MSIMEarth
    // var center = window.MSIMEarth.Cartesian3.fromDegrees(
    //   108.95941558359958,
    //   34.219783901879,
    //   487.37960915730173
    // )
    let center = val.cartesian3
    var heading = -window.MSIMEarth.Math.PI_OVER_TWO
    var pitch = window.MSIMEarth.Math.PI_OVER_FOUR
    var roll = 0.0
    var hpr = new window.MSIMEarth.HeadingPitchRoll(heading, pitch, roll)
    var quaternion = window.MSIMEarth.Transforms.headingPitchRollQuaternion(
      center,
      hpr
    )
    window.EarthViewer.entities.add({
      name: 'billboardlabel',
      position: center,
      orientation: quaternion,
      label: {
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          0,
          // 2e5
          30e5
        ),
        // text: '财政局西门',
        text: val.name,
        // backgroundColor: new window.MSIMEarth.Color(1.0, 153 / 255, 18 / 255, 1.0),
        // showBackground: false,
        font: 'normal 32px MicroSoft YaHei',
        scale: val.labelScale || 0.4,
        fillColor: val.color || window.MSIMEarth.Color.AQUA,
        style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        // outlineWidth: 2,
        horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT, //水平位置
        verticalOrigin: window.MSIMEarth.VerticalOrigin.BOTTOM,
        pixelOffset:
          val.pixelOffset || new window.MSIMEarth.Cartesian2(-43, -30),
        eyeOffset: new window.MSIMEarth.ConstantProperty(
          new window.MSIMEarth.Cartesian3(0, 0, -1)
        )
      }
    })
  }
  /**
   * 添加地形
   */
  addTerrianLayer() {
    try {
      let terrainLayer = new window.MSIMEarth.CesiumTerrainProvider({
        url: terrainUrlConfig.terrainTW,
        tilingScheme: new window.MSIMEarth.GeographicTilingScheme()
      })
      window.EarthViewer.scene.terrainProvider = terrainLayer
    } catch (error) {
      console.error('添加地形失败:', error)
      // 使用椭球体地形作为备选方案
      window.EarthViewer.scene.terrainProvider =
        new window.MSIMEarth.EllipsoidTerrainProvider({})
    }
  }
  /**
   * 添加台湾地形
   */
  async addTWTerrian() {
    try {
      const version = Number(window.MSIMEarth.VERSION.split('.')[1])
      if (version < 100) {
        console.log('当前earth版本', version)
        let terrainLayer = new window.MSIMEarth.CesiumTerrainProvider({
          url: terrainUrlConfig.terrainTW,
          tilingScheme: new window.MSIMEarth.GeographicTilingScheme()
        })
        window.EarthViewer.scene.terrainProvider = terrainLayer
      } else {
        console.log('当前earth版本', version)
        const terrainProvider =
          await window.MSIMEarth.CesiumTerrainProvider.fromUrl(
            terrainUrlConfig.terrainTW
          )
        window.EarthViewer.scene.terrainProvider = terrainProvider
      }
    } catch (error) {
      console.error('添加地形失败:', error)
      // 使用椭球体地形作为备选方案
      window.EarthViewer.scene.terrainProvider =
        new window.MSIMEarth.EllipsoidTerrainProvider({})
    }
  }
  /** 删除地形 */
  removeTerrianLayer() {
    window.EarthViewer.scene.terrainProvider =
      new window.MSIMEarth.EllipsoidTerrainProvider({})
  }
  /**
   * 添加台湾高清影像
   */
  addTWGQYX() {
    let mvtProvider = new window.MSIMEarth.UrlTemplateImageryProvider({
      url: layersUrlConfig.twImage
    })
    let mvtProvider1 =
      window.EarthViewer.imageryLayers.addImageryProvider(mvtProvider)
    mvtProvider1.show = false
    // mvtProvider1.brightness = 0.6
    mvtProvider1.brightness = 0.9
    mvtProvider1.contrast = 1.0
    mvtProvider1.hue = 0
    mvtProvider1.saturation = 1.6
    mvtProvider1.gamma = 0.6
    window.cameraListener = function () {
      var e = window.EarthViewer.camera.position
      if (window.MSIMEarth.Cartographic.fromCartesian(e).height < 300000) {
        // 显示自定义的天空盒
        mvtProvider1.show = true
      } else {
        mvtProvider1.show = false
      }
    }
    window.EarthViewer.camera.changed.addEventListener(window.cameraListener)
  }
  /**
   * 南海基础军事设施
   */
  jichuJiDi() {
    nanhaiLFJD.forEach((element) => {
      window.EarthViewer.entities.add({
        name: element.name,
        position: window.MSIMEarth.Cartesian3.fromDegrees(
          element.lng,
          element.lat,
          10
        ),
        // 图标
        billboard: {
          image: 'static/image/billboard/camera-normal.png',
          show: true,
          width: 5,
          height: 5,
          rotation: 0.0,
          eyeOffset: new window.MSIMEarth.ConstantProperty(
            new window.MSIMEarth.Cartesian3(0, 0, -1)
          ),
          pixelOffset: new window.MSIMEarth.Cartesian2(0.0, -45),
          scaleByDistance: new window.MSIMEarth.NearFarScalar(
            1.5e2,
            6.0,
            1.5e7,
            3.5
          ),
          distanceDisplayCondition:
            new window.MSIMEarth.DistanceDisplayCondition(0, 100e5)
        },
        label: {
          //文字标签
          text: element.name,
          font: '15px sans-serif',
          style: window.MSIMEarth.LabelStyle.FILL,
          horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
          verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
          pixelOffset: new window.MSIMEarth.Cartesian2(20, -60),
          // showBackground: true,
          backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
          distanceDisplayCondition:
            new window.MSIMEarth.DistanceDisplayCondition(0, 100e5)
        }
      })
    })
  }
  /**
   * 基地
   */
  addJiDi() {
    window.EarthViewer.dataSources
      .add(
        window.MSIMEarth.GeoJsonDataSource.load('static/geojson/mubiao.json')
      )
      .then((data) => {
        let entitys = data.entities.values
        entitys.forEach((e) => {
          e.billboard = new window.MSIMEarth.BillboardGraphics({
            image: 'static/image/billboard/camera-normal.png',
            show: true,
            width: 5,
            height: 5,
            rotation: 0.0,
            eyeOffset: new window.MSIMEarth.ConstantProperty(
              new window.MSIMEarth.Cartesian3(0, 0, -1)
            ),
            pixelOffset: new window.MSIMEarth.Cartesian2(0.0, -15),
            scaleByDistance: new window.MSIMEarth.NearFarScalar(
              1.5e2,
              6.0,
              1.5e7,
              3.5
            ),
            distanceDisplayCondition:
              new window.MSIMEarth.DistanceDisplayCondition(0, 50e5)
          })
          e.label = new window.MSIMEarth.LabelGraphics({
            //文字标签
            text: e.properties._名称._value,
            fillColor: window.MSIMEarth.Color.DEEPSKYBLUE,
            font: '15px 黑体',
            style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
            outlineColor: window.MSIMEarth.Color.BLACK,
            outlineWidth: 2,
            horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
            verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
            pixelOffset: new window.MSIMEarth.Cartesian2(-20, -50),
            // showBackground: true,
            backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
            distanceDisplayCondition:
              new window.MSIMEarth.DistanceDisplayCondition(0, 50e5)
          })
        })
        this.handleCluster(data)
      })
  }
  /**
   * 河流
   */
  addRiver() {
    window.EarthViewer.dataSources
      .add(window.MSIMEarth.GeoJsonDataSource.load('static/geojson/river.json'))
      .then((data) => {
        let entitys = data.entities.values
        entitys.forEach((e) => {
          // console.log('河流', e.polyline.width)
          e.polyline.width = 1.5
          e.polyline.material = new window.MSIMEarth.Color(
            175 / 255,
            208 / 255,
            241 / 255,
            0.5
          )
          e.polyline.distanceDisplayCondition =
            new window.MSIMEarth.DistanceDisplayCondition(20e5, 100e5)
        })
      })
  }

  /**
   * 主要城市
   */
  addMainCity() {
    let add = true
    window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
      if (dataSource._name == 'city1') {
        dataSource.show = true
        add = false
        // 移除czml路径
        // window.EarthViewer.dataSources.remove(dataSource)
      }
    })
    if (!add) return
    window.EarthViewer.dataSources
      .add(
        window.MSIMEarth.GeoJsonDataSource.load(
          './static/data/geojson/mainCity.geojson'
        )
      )
      .then((data) => {
        data.name = 'city1'
        let entitys = data.entities.values
        entitys.forEach((e) => {
          let position = e.position._value
          let cartogra = window.MSIMEarth.Cartographic.fromCartesian(position)
          let sourceLng = window.MSIMEarth.Math.toDegrees(cartogra.longitude)
          let sourceLat = window.MSIMEarth.Math.toDegrees(cartogra.latitude)
          let sourceAlt = cartogra.height + 10000
          e.position = window.MSIMEarth.Cartesian3.fromDegrees(
            sourceLng,
            sourceLat,
            sourceAlt
          )
          e.billboard = new window.MSIMEarth.BillboardGraphics({
            image: './static/image/billboard/省会2.png',
            show: true,
            width: 2,
            height: 2,
            rotation: 0.0,
            eyeOffset: new window.MSIMEarth.ConstantProperty(
              new window.MSIMEarth.Cartesian3(0, 0, -1)
            ),
            // pixelOffset: new window.MSIMEarth.Cartesian2(0.0, -20),
            scaleByDistance: new window.MSIMEarth.NearFarScalar(
              1.5e2,
              6.0,
              1.5e7,
              3.5
            ),
            distanceDisplayCondition:
              new window.MSIMEarth.DistanceDisplayCondition(10, 70e5),
            heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND
          })
          e.label = new window.MSIMEarth.LabelGraphics({
            //文字标签
            text: e.properties._市._value,
            font: '16px Lucida Console',
            fillColor: window.MSIMEarth.Color.WHITE,
            style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
            horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
            verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
            pixelOffset: new window.MSIMEarth.Cartesian2(-20, -20),
            outlineColor: window.MSIMEarth.Color.BLACK,
            outlineWidth: 2,
            // showBackground: true,
            backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
            distanceDisplayCondition:
              new window.MSIMEarth.DistanceDisplayCondition(10, 70e5),
            heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND
          })
        })
        // this.handleCluster(data)
      })
    window.EarthViewer.dataSources
      .add(
        window.MSIMEarth.GeoJsonDataSource.load(
          './static/data/geojson/国家点.geojson'
        )
      )
      .then((data) => {
        data.name = 'city2'
        let entitys = data.entities.values
        entitys.forEach((e) => {
          // console.log(e)
          let position = e.position._value
          let cartogra = window.MSIMEarth.Cartographic.fromCartesian(position)
          let sourceLng = window.MSIMEarth.Math.toDegrees(cartogra.longitude)
          let sourceLat = window.MSIMEarth.Math.toDegrees(cartogra.latitude)
          let sourceAlt = cartogra.height + 10000
          e.position = window.MSIMEarth.Cartesian3.fromDegrees(
            sourceLng,
            sourceLat,
            sourceAlt
          )
          e.billboard = undefined
         
          e.label = {
            text: e.name,
            font: '100 18px MicroSoft YaHei',
            fillColor: window.MSIMEarth.Color.WHITE,
            style: window.MSIMEarth.LabelStyle.FILL,
            horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
            verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
            // pixelOffset: new window.MSIMEarth.Cartesian2(-20, -20),
            // showBackground: true,
            backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
            distanceDisplayCondition:
              new window.MSIMEarth.DistanceDisplayCondition(0, 100e5),
            heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND
          }
        })
      })
  }
  // 添加其他主城市(蓝方 紫方 绿色等)
  addMainCityOther(url, side, name) {
    let add = true
    window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
      if (dataSource._name == name) {
        dataSource.show = true
        add = false
        // 移除czml路径
        // window.EarthViewer.dataSources.remove(dataSource)
      }
    })
    if (!add) return
    window.EarthViewer.dataSources
      .add(window.MSIMEarth.GeoJsonDataSource.load(url))
      .then((data) => {
        data.name = name || 'mainCityOther'
        let entitys = data.entities.values
        entitys.forEach((e) => {
          let position = e.position._value
          let cartogra = window.MSIMEarth.Cartographic.fromCartesian(position)
          let sourceLng = window.MSIMEarth.Math.toDegrees(cartogra.longitude)
          let sourceLat = window.MSIMEarth.Math.toDegrees(cartogra.latitude)
          let sourceAlt = cartogra.height + 10000
          e.position = window.MSIMEarth.Cartesian3.fromDegrees(
            sourceLng,
            sourceLat,
            sourceAlt
          )
          e.billboard = new window.MSIMEarth.BillboardGraphics({
            image: './static/image/billboard/白色标注.png',
            show: true,
            width: 2,
            height: 2,
            rotation: 0.0,
            eyeOffset: new window.MSIMEarth.ConstantProperty(
              new window.MSIMEarth.Cartesian3(0, 0, -1)
            ),
            // pixelOffset: new window.MSIMEarth.Cartesian2(0.0, -20),
            scaleByDistance: new window.MSIMEarth.NearFarScalar(
              1.5e2,
              6.0,
              1.5e7,
              3.5
            ),
            distanceDisplayCondition:
              new window.MSIMEarth.DistanceDisplayCondition(10, 70e5),
            heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND
          })
          e.label = new window.MSIMEarth.LabelGraphics({
            //文字标签
            text: e.properties.市._value,
            font: '16px Lucida Console',
            fillColor: window.MSIMEarth.Color.WHITE,
            style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
            horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
            verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
            pixelOffset: new window.MSIMEarth.Cartesian2(-20, -20),
            outlineColor: window.MSIMEarth.Color.BLACK,
            outlineWidth: 2,
            // showBackground: true,
            backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
            distanceDisplayCondition:
              new window.MSIMEarth.DistanceDisplayCondition(10, 70e5),
            heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND
          })
        })
      })
  }
  // 聚合
  handleCluster(data) {
    // 聚合
    const pixelRange = 20
    const minimumClusterSize = 2
    //clustering 获取或设置此数据源的群集选项。此对象可以在多个数据源之间共享。
    data.clustering.enabled = true //获取或设置是否启用群集。
    data.clustering.pixelRange = pixelRange //pixelRange 是聚合距离，也就是小于这个距离就会被聚合,以像素为单位
    data.clustering.minimumClusterSize = minimumClusterSize //minimumClusterSize是每个聚合点的最小聚合个数，这个值最好是设置为2，因为两个图标也可能叠压。
    let removeListener

    function customStyle() {
      if (window.MSIMEarth.defined(removeListener)) {
        removeListener()
        removeListener = undefined
      } else {
        removeListener = data.clustering.clusterEvent.addEventListener(
          function (clusteredEntities, cluster) {
            cluster.label.show = false
            cluster.billboard.show = true
            cluster.billboard.width = 0
            cluster.billboard.height = 0
          }
        )
      }
      // force a re-cluster with the new styling
      const pixelRange = data.clustering.pixelRange
      data.clustering.pixelRange = 0
      data.clustering.pixelRange = pixelRange
    }
    customStyle()
  }
  /**
   * 国界线-中国
   */
  guojiexian_C() {
    const options1 = {
      url: basicVectorData.guojiexian,
      color: new window.MSIMEarth.Color(164 / 255, 91 / 255, 82 / 255, 1.0),
      addLabel: false,
      dataType: 'vector',
      geoType: 'polyline',
      width: 2,
      id: 'guojiexian'
    }
    this.addGeojson(options1)
  }
  /**
   * 国界线-其他国家
   */
  guojiexian_O() {
    const options2 = {
      url: basicVectorData.guojiexian2,
      color: window.MSIMEarth.Color.YELLOW,
      addLabel: false,
      dataType: 'vector',
      geoType: 'polyline',
      width: 0.7,
      id: 'guojiexian2'
    }
    this.addGeojson(options2)
    const options3 = {
      url: basicVectorData.shengjiexian,
      color: window.MSIMEarth.Color.YELLOW,
      addLabel: false,
      dataType: 'vector',
      geoType: 'polyline',
      width: 1,
      id: 'shengjiexian'
    }
    this.addGeojson(options3)
  }
  /**
   * 添加行政区划
   */
  addTWxzquName() {
    taiwanCity.forEach((item) => {
      let center = window.MSIMEarth.Cartesian3.fromDegrees(
        item.longitude_,
        item.latitude_d,
        1
      )
      window.EarthViewer.entities.add({
        name: 'billboardlabeld',
        id: item.name + '_name',
        position: center,
        label: {
          text: item.name,
          // backgroundColor: new window.MSIMEarth.Color(1.0, 153 / 255, 18 / 255, 1.0),
          // showBackground: false,
          font: 'normal 35px Helvetica',
          scale: 0.56,
          fillColor: window.MSIMEarth.Color.WHITE,
          style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
          outlineWidth: 2,
          outlineColor: window.MSIMEarth.Color.BLACK,
          horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT, //水平位置
          verticalOrigin: window.MSIMEarth.VerticalOrigin.BOTTOM,
          pixelOffset: new window.MSIMEarth.Cartesian2(-35, -31),
          eyeOffset: new window.MSIMEarth.ConstantProperty(
            new window.MSIMEarth.Cartesian3(0, 0, -12)
          ),
          distanceDisplayCondition:
            new window.MSIMEarth.DistanceDisplayCondition(0, 100e5)
        }
      })
    })
  }
  /**
   * 添加行政区划
   */
  addTWXZQH() {
    this.addTWxzquName()
    const options = {
      url: basicVectorData.twxzqh,
      color: window.MSIMEarth.Color.RED.withAlpha(0.5),
      addLabel: false,
      dataType: 'vector',
      geoType: 'polyline',
      id: 'taiwanxzqh'
    }
    this.addGeojson(options)
  }

  /**
   *   清除primitive 'customCloud'
   * @param {*} primitiveName primitive名称
   */
  removePrimitive(primitiveName) {
    let self = this
    self.EarthViewer.scene.primitives._primitives.forEach((primitive) => {
      if (primitive.name && primitive.name == primitiveName) {
        self.EarthViewer.scene.primitives.remove(primitive)
      }
    })
  }

  /**
   * 添加arcServer发布的矢量底图
   */
  add_VectorBaseLayer() {
    let worldVectorLayer = new window.MSIMEarth.UrlTemplateImageryProvider({
      url: googleConfig.twArcServer
    })
    worldVectorLayer.name = 'world_vector_layer'
    window.EarthViewer.imageryLayers.addImageryProvider(worldVectorLayer)
  }
  /**
   * 添加arcServer发布的矢量底图
   */
  remove_VectorBaseLayer() {
    for (let i = 0; i < window.EarthViewer.imageryLayers._layers.length; i++) {
      const imageryLayer = window.EarthViewer.imageryLayers._layers[i]
      if (
        imageryLayer.imageryProvider.name &&
        imageryLayer.imageryProvider.name.includes('world_vector_layer')
      ) {
        window.EarthViewer.imageryLayers.remove(imageryLayer)
        i--
      }
    }
  }
  
  // 基于后处理效果名称移除该效果
  removePost(name) {
    if (window.ppsCollection) {
      window.ppsCollection._activeStages.forEach((element) => {
        if (element.name === name) {
          window.ppsCollection.remove(element)
        }
      })
    }
  }
 
  
  /**
   * 添加北部一二级标注
   */
  add_bblabel() {
    let height = 500
    if (window.EarthViewer.scene.globe.depthTestAgainstTerrain) {
      height = 5000
    }
    BB12biaozhu.forEach((e) => {
      window.EarthViewer.entities.add({
        position: window.MSIMEarth.Cartesian3.fromDegrees(
          e.coordinate[0],
          e.coordinate[1],
          height
        ),
        label: {
          text: e.name,
          font: e.font,
          fillColor: window.MSIMEarth.Color.BLACK,
          style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
          horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
          verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
          // pixelOffset: new window.MSIMEarth.Cartesian2(-35, -10),
          // showBackground: true,
          outlineColor: window.MSIMEarth.Color.WHITE,
          outlineWidth: e.outlineWidth,
          backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
          distanceDisplayCondition:
            new window.MSIMEarth.DistanceDisplayCondition(
              e.displayByDistance[0],
              e.displayByDistance[1]
            ),
          eyeOffset: new window.MSIMEarth.ConstantProperty(
            new window.MSIMEarth.Cartesian3(0, 0, -1)
          )
          // disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      })
      // if (e.lv === 2) {
      //   taiwanLabel.distanceDisplayCondition =
      //     new window.MSIMEarth.DistanceDisplayCondition(3e3, 25e5)
      // }
    })
  }
 
  clearLayerGeo(id) {
    window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
      if (dataSource._name == id) {
        dataSource.show = false
        // 移除czml路径
        // window.EarthViewer.dataSources.remove(dataSource)
      }
    })
  }
  // 重要目标
  addImportanceTarget() {
    importantPosition.map((item) => {
      window.EarthViewer.entities.add({
        id: item.name,
        position: window.MSIMEarth.Cartesian3.fromDegrees(
          item.position[0],
          item.position[1],
          100
        ),
        billboard: {
          image: item.billboard,
          // distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(4e3, 6e6),
          scale: 0.8
        },
        label: {
          text: item.name,
          font: 'bolder 9pt Lucida Console',
          horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
          pixelOffset: new window.MSIMEarth.Cartesian2(25, -2),
          style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
          fillColor: window.MSIMEarth.Color.fromCssColorString('#1E90FF'),
          outlineColor: window.MSIMEarth.Color.BLACK,
          outlineWidth: 5
          // distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(4e3, 1e6)
        }
      })
    })
  }
  clearImPort() {
    importantPosition.map((item) => {
      window.EarthViewer.entities.removeById(item.name)
    })
  }

  //机场
  addDLAirport = () => {
    console.log('被调用')
    // 图片材质
    // let imgMaterial = new window.MSIMEarth.ImageMaterialProperty({
    //   image: './static/billboard/1.png'
    //   // repeat: new window.MSIMEarth.Cartesian2(4, 4),
    //   // color: window.MSIMEarth.Color.BLUE,
    // })
    window.EarthViewer.dataSources
      .add(
        window.MSIMEarth.GeoJsonDataSource.load(
          './static/data/geojson/军民机场.json',
          {
            stroke: window.MSIMEarth.Color.WHITE,
            fill: window.MSIMEarth.Color.BLUE.withAlpha(0.3), //注意：颜色必须大写，即不能为blue
            strokeWidth: 5
          }
        )
      )
      .then((data) => {
        data.name = 'DALUJICHANG'
        const viewer = window.EarthViewer

        window.EarthViewer.scene.globe.depthTestAgainstTerrain = false
        // data.name = '机场'
        let array = data._entityCollection._entities._array
        for (const key in array) {
          const airplane11 = ['七美机场', '台南机场']
          const fitFly = ['台东丰年机场']
          array[key].billboard = undefined
          // // 机场信息标识判断
          // let colorc = airplane11.includes(
          //   array[key].properties.chineseName._value
          // )
          //   ? new window.MSIMEarth.Color(231 / 255, 64 / 255, 50 / 255, 1.0)
          //   : new window.MSIMEarth.Color(42 / 255, 156 / 255, 73 / 255, 1.0)
          // 机场适飞情况判断
          // let isfit = fitFly.includes(array[key].properties.chineseName._value)
          //   ? 'static/image/billboard/flyred.png'
          //   : 'static/image/billboard/flyblue.png'
          // 机场朝向
          // let direction = array[key].properties.rotation
          //   ? array[key].properties.rotation._value
          //   : 0
          let direction = Math.random() * 360 - 180

          // array[key]._billboard = undefined
          // array[key].label = new window.MSIMEarth.LabelGraphics({
          //   text: array[key].properties.chineseName,
          //   fillColor: window.MSIMEarth.Color.AQUA,
          //   // fillColor: new window.MSIMEarth.Color(0.0, 1.0, 1.0, 1.0), //250, 251, 0
          //   // outlineColor:
          //   showBackground: false,
          //   scale: 0.4,
          //   pixelOffset: new window.MSIMEarth.Cartesian2(0, -35),
          //   distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          //     0,
          //     // 2e5
          //     18e5
          //   )
          //   // scaleByDistance: new window.MSIMEarth.NearFarScalar(0, 2.2, 2e5, 1.2)
          // })

          array[key].billboard = {
            // image: 'static/image/billboard/空军基地.png',
            image: './static/image/billboard/flyblue.png',
            // rotation: window.MSIMEarth.Math.toRadians(direction),
            // scaleByDistance: new window.MSIMEarth.NearFarScalar(1.0e3, 10.0, 2.0e3, 1.0),
            scale: 2,
            distanceDisplayCondition:
              new window.MSIMEarth.DistanceDisplayCondition(0, 30e5),
            scaleByDistance: new window.MSIMEarth.NearFarScalar(
              0,
              0.2,
              6e5,
              0.15
            )
          }
          array[key].label = {
            text: array[key].properties.name._value,
            font: '18px black',
            fillColor: window.MSIMEarth.Color.WHITE,
            style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
            horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
            verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
            pixelOffset: new window.MSIMEarth.Cartesian2(-40, -40),
            outlineColor: window.MSIMEarth.Color.BLACK,
            outlineWidth: 2,
            // showBackground: true,
            backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
            heightReference:
              window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND,
            distanceDisplayCondition:
              new window.MSIMEarth.DistanceDisplayCondition(0, 10e5),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
          // let cartesian3 = array[key].position._value
          // createBillboardLabel_DC({
          //   cartesian3: cartesian3,
          //   text: array[key].properties.name._value,
          //   offset: new window.MSIMEarth.Cartesian2(0, -35),
          //   distanceDisplay: new window.MSIMEarth.DistanceDisplayCondition(
          //     0,
          //     18e5
          //   ),
          //   img: './static/billboard/border_bg01.png'
          // })

          // array[key]._id = array[key].properties.chineseName._value
          // array[key].ellipse = {
          //   semiMinorAxis: 10000,
          //   semiMajorAxis: 10000,
          //   material: new window.MSIMEarth.PulseMaterialProperty({
          //     color: new window.MSIMEarth.Color(231 / 255, 64 / 255, 50 / 255, 1.0), // 227, 62, 49
          //     // mixColor: new window.MSIMEarth.Color(227 / 255, 62 / 255, 49 / 255, 1.0),
          //     repeat: new window.MSIMEarth.Cartesian2(1.0, 1.0),
          //     // half: false,
          //     flowSpeed: 45
          //   })
          // }
        }
      })
  }
  //添加其他机场
  addTWAirport = () => {
    window.EarthViewer.dataSources
      .add(
        window.MSIMEarth.GeoJsonDataSource.load(
          './static/data/geojson/机场.json',
          {
            stroke: window.MSIMEarth.Color.WHITE,
            fill: window.MSIMEarth.Color.BLUE.withAlpha(0.3), //注意：颜色必须大写，即不能为blue
            strokeWidth: 5
          }
        )
      )
      .then((data) => {
        data.name = 'TAIWANJICHANG'
        const viewer = window.EarthViewer

        window.EarthViewer.scene.globe.depthTestAgainstTerrain = false
        // data.name = '机场'
        let array = data._entityCollection._entities._array
        for (const key in array) {
          const airplane11 = ['七美机场', '台南机场']
          const fitFly = ['台东丰年机场']
          array[key].billboard = undefined
          // // 机场信息标识判断
          // let colorc = airplane11.includes(
          //   array[key].properties.chineseName._value
          // )
          //   ? new window.MSIMEarth.Color(231 / 255, 64 / 255, 50 / 255, 1.0)
          //   : new window.MSIMEarth.Color(42 / 255, 156 / 255, 73 / 255, 1.0)
          // 机场适飞情况判断
          // let isfit = fitFly.includes(array[key].properties.chineseName._value)
          //   ? 'static/image/billboard/flyred.png'
          //   : 'static/image/billboard/flyblue.png'
          // 机场朝向
          // let direction = array[key].properties.rotation
          //   ? array[key].properties.rotation._value
          //   : 0
          let direction = Math.random() * 360 - 180

          // array[key]._billboard = undefined
          // array[key].label = new window.MSIMEarth.LabelGraphics({
          //   text: array[key].properties.chineseName,
          //   fillColor: window.MSIMEarth.Color.AQUA,
          //   // fillColor: new window.MSIMEarth.Color(0.0, 1.0, 1.0, 1.0), //250, 251, 0
          //   // outlineColor:
          //   showBackground: false,
          //   scale: 0.4,
          //   pixelOffset: new window.MSIMEarth.Cartesian2(0, -35),
          //   distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          //     0,
          //     // 2e5
          //     18e5
          //   )
          //   // scaleByDistance: new window.MSIMEarth.NearFarScalar(0, 2.2, 2e5, 1.2)
          // })

          array[key].billboard = {
            // image: 'static/image/billboard/空军基地.png',
            image: './static/image/billboard/flyblue.png',
            // rotation: window.MSIMEarth.Math.toRadians(direction),
            // scaleByDistance: new window.MSIMEarth.NearFarScalar(1.0e3, 10.0, 2.0e3, 1.0),
            scale: 2,
            distanceDisplayCondition:
              new window.MSIMEarth.DistanceDisplayCondition(0, 30e5),
            scaleByDistance: new window.MSIMEarth.NearFarScalar(
              0,
              0.2,
              6e5,
              0.15
            )
          }
          array[key].label = {
            text: array[key].properties.entity_name._value,
            font: '18px black',
            fillColor: window.MSIMEarth.Color.WHITE,
            style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
            horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
            verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
            pixelOffset: new window.MSIMEarth.Cartesian2(-40, -40),
            outlineColor: window.MSIMEarth.Color.BLACK,
            outlineWidth: 2,
            // showBackground: true,
            backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
            heightReference:
              window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND,
            distanceDisplayCondition:
              new window.MSIMEarth.DistanceDisplayCondition(0, 10e5),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
          // let cartesian3 = array[key].position._value
          // createBillboardLabel_DC({
          //   cartesian3: cartesian3,
          //   text: array[key].properties.name._value,
          //   offset: new window.MSIMEarth.Cartesian2(0, -35),
          //   distanceDisplay: new window.MSIMEarth.DistanceDisplayCondition(
          //     0,
          //     18e5
          //   ),
          //   img: './static/billboard/border_bg01.png'
          // })

          // array[key]._id = array[key].properties.chineseName._value
          // array[key].ellipse = {
          //   semiMinorAxis: 10000,
          //   semiMajorAxis: 10000,
          //   material: new window.MSIMEarth.PulseMaterialProperty({
          //     color: new window.MSIMEarth.Color(231 / 255, 64 / 255, 50 / 255, 1.0), // 227, 62, 49
          //     // mixColor: new window.MSIMEarth.Color(227 / 255, 62 / 255, 49 / 255, 1.0),
          //     repeat: new window.MSIMEarth.Cartesian2(1.0, 1.0),
          //     // half: false,
          //     flowSpeed: 45
          //   })
          // }
        }
      })
  }
  //清除entity
  removeEntity(option) {
    let entity = window.EarthViewer.entities.getById(option.entityId)
    if (entity) {
      window.EarthViewer.entities.remove(entity)
    }
  }
  //港口添加
  addPort() {
    window.EarthViewer.dataSources
      .add(
        window.MSIMEarth.GeoJsonDataSource.load(
          './static/data/geojson/港口.json',
          {
            stroke: window.MSIMEarth.Color.WHITE,
            fill: window.MSIMEarth.Color.BLUE.withAlpha(0.3), //注意：颜色必须大写，即不能为blue
            strokeWidth: 5
          }
        )
      )
      .then((data) => {
        data.name = 'TAIWANGANGKOU'
        const viewer = window.EarthViewer

        window.EarthViewer.scene.globe.depthTestAgainstTerrain = false
        // data.name = '机场'
        let array = data._entityCollection._entities._array
        for (const key in array) {
          array[key].billboard = undefined
          let direction = Math.random() * 360 - 180
          array[key].billboard = {
            // image: 'static/image/billboard/空军基地.png',
            image: './static/billboard/台湾图标/港口.png',
            // rotation: window.MSIMEarth.Math.toRadians(direction),
            // scaleByDistance: new window.MSIMEarth.NearFarScalar(1.0e3, 10.0, 2.0e3, 1.0),
            scale: 2,
            distanceDisplayCondition:
              new window.MSIMEarth.DistanceDisplayCondition(0, 30e5),
            scaleByDistance: new window.MSIMEarth.NearFarScalar(
              0,
              0.2,
              6e5,
              0.15
            )
          }
          array[key].label = {
            text: array[key].properties.entity_name._value,
            font: '18px black',
            fillColor: window.MSIMEarth.Color.WHITE,
            style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
            horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
            verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
            pixelOffset: new window.MSIMEarth.Cartesian2(-40, -40),
            outlineColor: window.MSIMEarth.Color.BLACK,
            outlineWidth: 2,
            // showBackground: true,
            backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
            heightReference:
              window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND,
            distanceDisplayCondition:
              new window.MSIMEarth.DistanceDisplayCondition(0, 10e5),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
        }
      })
    window.EarthViewer.dataSources
      .add(
        window.MSIMEarth.GeoJsonDataSource.load(
          './static/data/geojson/港口.json',
          {
            stroke: window.MSIMEarth.Color.WHITE,
            fill: window.MSIMEarth.Color.BLUE.withAlpha(0.3), //注意：颜色必须大写，即不能为blue
            strokeWidth: 5
          }
        )
      )
      .then((data) => {
        data.name = 'TAIWANGANGKOU'
        const viewer = window.EarthViewer

        window.EarthViewer.scene.globe.depthTestAgainstTerrain = false
        // data.name = '机场'
        let array = data._entityCollection._entities._array
        for (const key in array) {
          array[key].billboard = undefined
          let direction = Math.random() * 360 - 180
          array[key].billboard = {
            // image: 'static/image/billboard/空军基地.png',
            image: './static/billboard/台湾图标/港口.png',
            // rotation: window.MSIMEarth.Math.toRadians(direction),
            // scaleByDistance: new window.MSIMEarth.NearFarScalar(1.0e3, 10.0, 2.0e3, 1.0),
            scale: 5,
            distanceDisplayCondition:
              new window.MSIMEarth.DistanceDisplayCondition(0, 30e5),
            scaleByDistance: new window.MSIMEarth.NearFarScalar(
              0,
              0.2,
              6e5,
              0.15
            )
          }
          array[key].label = {
            text: array[key].properties.entity_name._value,
            font: '18px black',
            fillColor: window.MSIMEarth.Color.WHITE,
            style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
            horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
            verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
            pixelOffset: new window.MSIMEarth.Cartesian2(-40, -40),
            outlineColor: window.MSIMEarth.Color.BLACK,
            outlineWidth: 2,
            // showBackground: true,
            backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
            heightReference:
              window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND,
            distanceDisplayCondition:
              new window.MSIMEarth.DistanceDisplayCondition(0, 10e5),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
        }
      })
  }
  //九段线
  addNineLine() {
    let add = true
    window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
      if (dataSource._name == 'nineLine') {
        dataSource.show = true
        add = false
      }
    })
    if (!add) return
    var promise = window.MSIMEarth.GeoJsonDataSource.load(
      './static/data/geojson/nineLine.geojson'
    )
    promise.then(function (dataSource) {
      window.EarthViewer.dataSources.add(dataSource)
      dataSource.name = 'nineLine'
      var entities = dataSource.entities.values
      for (let i = 0; i < entities.length; i++) {
        let entity = entities[i]
        entity.polyline.material = new window.MSIMEarth.Color(
          186 / 255,
          105 / 255,
          102 / 255,
          0.7
        )
        entity.polyline.width = 3
        entity.polyline.clampToGround = true
      }
    })
  }
  // 添加西南太平洋蓝方基地
  importantPoint() {
    importantPosition.forEach((p) => {
      window.EarthViewer.entities.add({
        position: window.MSIMEarth.Cartesian3.fromDegrees(
          p.position[0],
          p.position[1],
          100
        ),
        billboard: {
          image: 'static/image/billboard/camera-normal.png',
          show: true,
          width: 5,
          height: 5,
          rotation: 0.0,
          eyeOffset: new window.MSIMEarth.ConstantProperty(
            new window.MSIMEarth.Cartesian3(0, 0, -1)
          ),
          pixelOffset: new window.MSIMEarth.Cartesian2(0.0, -45),
          scaleByDistance: new window.MSIMEarth.NearFarScalar(
            1.5e2,
            6.0,
            1.5e7,
            3.5
          ),
          distanceDisplayCondition:
            new window.MSIMEarth.DistanceDisplayCondition(0, 100e5)
          // disableDepthTestDistance: new window.MSIMEarth.CallbackProperty(() => {
          //   let curHeight2 = window.EarthViewer.camera.positionCartographic.height;
          //   if (curHeight2 > 600) {
          //     return 0;
          //   } else {
          //     return Number.POSITIVE_INFINITY;
          //   }
          // }, false), //防止深度测试导致的遮挡 默认为0会遮挡 Number.POSITIVE_INFINITY
        }
      })
    })
  }
  // haixia标注
  // 重要海峡/岛礁
  addImportantHaiXia() {
    importantHaiXiaPosition.map((item) => {
      window.EarthViewer.entities.add({
        id: item.name,
        position: window.MSIMEarth.Cartesian3.fromDegrees(
          item.position[0],
          item.position[1],
          100
        ),
        label: {
          text: item.name,
          font: 'bolder 9pt Lucida Console',
          horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
          verticalOrigin: window.MSIMEarth.VerticalOrigin.BOTTOM,
          pixelOffset: new window.MSIMEarth.Cartesian2(-10, 0),
          style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
          fillColor: window.MSIMEarth.Color.fromCssColorString('#fff'),
          backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
          outlineColor: window.MSIMEarth.Color.BLACK,
          outlineWidth: 2,
          distanceDisplayCondition:
            new window.MSIMEarth.DistanceDisplayCondition(2e3, 70e5) //10e5
          // distanceDisplayCondition: new Cesium.DistanceDisplayCondition(4e3, 1e6)
        }
      })
    })
  }
  clearImPortHaiXia() {
    importantHaiXiaPosition.map((item) => {
      window.EarthViewer.entities.removeById(item.name)
    })
  }
  
  /**
   * 添加bing全球高清影像
   */
  addbingLayer() {
    let addLayer = true
    // 便利当前底图集合，如果已经存在bing底图则切换为显示
    window.EarthViewer.imageryLayers._layers.forEach((layer) => {
      if (layer.imageryProvider && layer.imageryProvider.name === 'globalImage') {
        layer.show = true
        addLayer = false
      }
    })
    // 如果当前没有添加过全球矢量地图则添加
    if (addLayer) {
      let bingProvider = new window.MSIMEarth.UrlTemplateImageryProvider({
        url: layersUrlConfig.urlBingMap,
        tilingScheme: new window.MSIMEarth.WebMercatorTilingScheme() //WebMercatorTilingScheme() //GeographicTilingScheme()
      })
      bingProvider.name = 'globalImage'
      let bingLayer =
      window.EarthViewer.imageryLayers.addImageryProvider(bingProvider)
      bingLayer.show = true
      bingLayer.brightness = 1.5 //0.9 1.52
      bingLayer.contrast = 1.0
      bingLayer.hue = 0
      bingLayer.saturation = 1.6
      bingLayer.gamma = 0.7 //0.6 0.7
    }
  }

  /**
   * 添加矢量底图
   */
  addVectorLayer() {
    let addLayer = true
    // 便利当前底图集合，如果已经存在全球矢量底图则切换为显示
    window.EarthViewer.imageryLayers._layers.forEach((layer) => {
      if (layer.imageryProvider && layer.imageryProvider.name === 'vectorLayer') {
        layer.show = true
        addLayer = false
      }
    })
    // 如果当前没有添加过全球矢量地图则添加
    if (addLayer) {
      let baseLayer = new window.MSIMEarth.UrlTemplateImageryProvider({
        url: layersUrlConfig.urlTianDiMap
      })
      baseLayer.name = 'vectorLayer'
      window.EarthViewer.imageryLayers.addImageryProvider(baseLayer)
    }
  }
  /**
   * 添加矢量底图带标注
   */
  addAnnotationVectorLayer() {
    let addLayer = true
    // 便利当前底图集合，如果已经存在全球矢量底图则切换为显示
    window.EarthViewer.imageryLayers._layers.forEach((layer) => {
      if (layer.imageryProvider && layer.imageryProvider.name === 'annotationVectorLayer') {
        layer.show = true
        addLayer = false
      }
    })
    // 如果当前没有添加过全球矢量地图则添加
    if (addLayer) {
      let baseLayer = new window.MSIMEarth.UrlTemplateImageryProvider({
        url: layersUrlConfig.urlAnnotationMap
      })
      baseLayer.name = 'annotationVectorLayer'
      window.EarthViewer.imageryLayers.addImageryProvider(baseLayer)
    }
  }
  /**
 * 添加暗色矢量底图
 */
  addDarkVectorLayer() {
    let addLayer = true
    // 便利当前底图集合，如果已经存在全球矢量底图则切换为显示
    window.EarthViewer.imageryLayers._layers.forEach((layer) => {
      if (layer.imageryProvider && layer.imageryProvider.name === 'darkVectorLayer') {
        layer.show = true
        addLayer = false
      }
    })
    // 如果当前没有添加过全球矢量地图则添加
    if (addLayer) {
      let baseLayer = new window.MSIMEarth.UrlTemplateImageryProvider({
        url: layersUrlConfig.urldarkVectorMap
      })
      baseLayer.name = 'darkVectorLayer'
      window.EarthViewer.imageryLayers.addImageryProvider(baseLayer)
    }
  }
  /**
   * 添加带地形效果的影像图
   */
  addTerrainImageryLayer() {
    let addLayer = true
    // 便利当前底图集合，如果已经存在全球矢量底图则切换为显示
    window.EarthViewer.imageryLayers._layers.forEach((layer) => {
      if (layer.imageryProvider.name === '全球地形影像底图') {
        layer.show = true
        addLayer = false
      }
    })
    // 如果当前没有添加过全球矢量地图则添加
    if (addLayer) {
      let baseLayer = new window.MSIMEarth.UrlTemplateImageryProvider({
        url: layersUrlConfig.urlTerrainImageryMap
        // tilingScheme: new window.MSIMEarth.GeographicTilingScheme()
      })
      baseLayer.name = '全球地形影像底图'
      let imgLayer =
        window.EarthViewer.imageryLayers.addImageryProvider(baseLayer)
      // imgLayer.brightness = 0.7
      // imgLayer.contrast = 1.06
      // imgLayer.hue = 0
      imgLayer.saturation = 1.56
      imgLayer.gamma = 1.12
    }
  }
  /**
   * 根据图层名称移除（隐藏）图层
   * @param {string} layerNmae 图层名称
   */
  removeLayer(layerNmae) {
    window.EarthViewer.imageryLayers._layers.forEach((layer) => {
      if (layer.imageryProvider && layer.imageryProvider.name === layerNmae) {
        layer.show = false
      }
    })
  }
  // 添加天气区域数据
  addGeojsonWeather(options, visible) {
    window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
      if (dataSource._name == options.id) {
        if (options.backLoad) window.EarthViewer.dataSources.remove(dataSource)
        else {
          var entities = dataSource.entities.values
          for (let i = 0; i < entities.length; i++) {
            let entity = entities[i]
            if (entity.billboard) {
              entity.billboard.show = visible
            }
            if (entity.polygon) {
              entity.polygon.show = visible
            }
          }
        }
      }
    })
    if (!options.backLoad) return
    // var promise = window.MSIMEarth.GeoJsonDataSource.load(options.url)
    // promise.then(function (dataSource) {
    window.EarthViewer.dataSources
      .add(window.MSIMEarth.GeoJsonDataSource.load(options.url))
      .then((dataSource) => {
        window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
          if (dataSource._name == options.id) {
            window.EarthViewer.dataSources.remove(dataSource)
          }
        })
        dataSource.name = options.id
        var entities = dataSource.entities.values
        for (let i = 0; i < entities.length; i++) {
          let entity = entities[i]
          if (entity.billboard) {
            let position = worldPosToGraphic(entity.position._value)
            entity.position.setValue(
              window.MSIMEarth.Cartesian3.fromDegrees(
                position.lng,
                position.lat,
                VisParams.billboardHeight
              )
            )
            let imageUrl = ''
            if (localStorage.getItem('side') == 'admin') {
              imageUrl = staticUrl + entity.properties._billboard3d.getValue()
            } else {
              imageUrl = staticUrl + entity.properties._billboard2d.getValue()
            }
            //SYMBOLBUMP3.png:颠簸区;SYMBOLRAIN2.png:中雨区;SYMBOLRAIN3.png:大雨区;S3.png:卷积云;S2.png:卷积云;CL32.png:高层云;CM29.png:积雨云;
            entity.billboard = {
              scale: 1,
              image: imageUrl,
              show: visible,
              rotation: 0.0,
              eyeOffset: new window.MSIMEarth.ConstantProperty(
                new window.MSIMEarth.Cartesian3(0, 0, -1)
              ),
              // pixelOffset: new window.MSIMEarth.Cartesian2(0.0, -25),
              scaleByDistance: new window.MSIMEarth.NearFarScalar(
                1.5e2,
                1.0,
                1.5e8,
                0.6
              ),
              // heightReference: window.MSIMEarth.HeightReference.CLAMP_TO_GROUND,
              distanceDisplayCondition:
                new window.MSIMEarth.DistanceDisplayCondition(0, 10e6)
              // disableDepthTestDistance: 10000000,
            }
            entity['description'] = undefined
          }
          if (entity.polygon) {
            let fillColor = entity.properties.fill.getValue()
            let fill0pacity = entity.properties['fill-opacity']
              ? entity.properties['fill-opacity'].getValue()
              : entity.properties.fillOpacity
                ? entity.properties.fillOpacity.getValue()
                : 0.1
            entity.polygon.material =
              MSIMEarth.Color.fromCssColorString(fillColor).withAlpha(
                fill0pacity
              )
            entity.polygon.height.setValue(VisParams.vectorDataHeight)
            entity.polygon.perPositionHeight = false
            entity.polygon.show = visible
          }
        }
        // window.EarthViewer.dataSources.add(dataSource)
      })
  }
  /**
   * 清除geojson图层
   * @param {string} name 图层名称
   */
  removeGeoJSONWeather(name) {
    window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
      if (dataSource._name == name) {
        window.EarthViewer.dataSources.remove(dataSource)
      }
    })
  }
 
  // 添加 作战区域 数据
  addGeojsonByOperationalAreaFile(options, visible) {
    return
  }

  //添加航线规划
  addPlanFlyLine(id, position, side) {
    if (window.EarthViewer.entities.getById(id + '-planLine')) {
      window.EarthViewer.entities.removeById(id + '-planLine')
    }
    if (window.EarthViewer.entities.getById(id + '-endPoint')) {
      window.EarthViewer.entities.removeById(id + '-endPoint')
    }
    let entityName = store.getters.getCurrentFlyType.name

    let color = [225, 82, 88, 1] //红方颜色
    switch (side) {
      case 'red':
        break
      case 'blue':
        color = [0, 100, 231, 1] //蓝方颜色
        break
      case 'green':
        color = [0, 250, 0, 1] //绿方颜色
        break
      case 'purple':
        color = [130, 0, 250, 1] //紫方颜色
        break
      default:
        break
    }
    // if (side == 'blue') {
    //   color = [57, 173, 209, 1]
    // }
    //航线线路绘制
    window.EarthViewer.entities.add({
      name: 'plan dashed line',
      id: id + '-planLine',
      position: window.MSIMEarth.Cartesian3.fromDegrees(
        position[0],
        position[1],
        position[2]
      ),
      polyline: {
        positions:
          window.MSIMEarth.Cartesian3.fromDegreesArrayHeights(position),
        width: 2,
        //material: window.MSIMEarth.Color.AQUAMARINE .withAlpha(1),
        material: new window.MSIMEarth.PolylineDashMaterialProperty({
          color: new window.MSIMEarth.Color(
            color[0] / 255,
            color[1] / 255,
            color[2] / 255,
            color[3]
          )
        }),
        clampToGround: false,
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          0,
          100e8
        )
      },
      label: {
        font: 'normal 16px MicroSoft YaHei',
        scale: 1,
        text: `名称:${entityName ? entityName : ''}\n经度:${position[0].toFixed(
          2
        )}\n纬度:${position[1].toFixed(2)}`,
        fillColor: new window.MSIMEarth.Color(
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
          color[3]
        ),
        outlineColor: window.MSIMEarth.Color.BLACK,
        outlineWidth: 2,
        backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
        style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT, //水平位置
        verticalOrigin: window.MSIMEarth.VerticalOrigin.BOTTOM,
        pixelOffset: new window.MSIMEarth.Cartesian2(-40, -30),
        eyeOffset: new window.MSIMEarth.ConstantProperty(
          new window.MSIMEarth.Cartesian3(0, 0, 0)
        ),
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          0,
          10e3
        )
        //disableDepthTestDistance: Number.POSITIVE_INFINITY
      },
      point: {
        pixelSize: 10,
        color: window.MSIMEarth.Color.YELLOW
      }
    })
    //显示航线最后一个点的经纬度
    let endPos = [
      position[position.length - 3],
      position[position.length - 2],
      position[position.length - 1]
    ]
    window.EarthViewer.entities.add({
      name: 'plan dashed line',
      id: id + '-endPoint',
      position: window.MSIMEarth.Cartesian3.fromDegrees(
        endPos[0],
        endPos[1],
        endPos[2]
      ),
      label: {
        font: 'normal 16px MicroSoft YaHei',
        scale: 1,
        text: `经度:${endPos[0].toFixed(2)}\n纬度:${endPos[1].toFixed(2)}`,
        fillColor: new window.MSIMEarth.Color(
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
          color[3]
        ),
        outlineColor: window.MSIMEarth.Color.BLACK,
        outlineWidth: 2,
        backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
        style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        // outlineWidth: 2,
        horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT, //水平位置
        verticalOrigin: window.MSIMEarth.VerticalOrigin.BOTTOM,
        pixelOffset: new window.MSIMEarth.Cartesian2(-40, -30),
        eyeOffset: new window.MSIMEarth.ConstantProperty(
          new window.MSIMEarth.Cartesian3(0, 0, 0)
        ),
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          0,
          10e3
        )
        //disableDepthTestDistance: Number.POSITIVE_INFINITY
      },
      point: {
        pixelSize: 10,
        color: window.MSIMEarth.Color.YELLOW
      }
    })
  }
  //添加实时航线
  addPlanFlyLineFoRealTime(id, positions, side) {
    if (window.EarthViewer.entities.getById(id + '-planLine_realTime')) {
      window.EarthViewer.entities.removeById(id + '-planLine_realTime')
    }
    let color = [225, 255, 255, 1] //默认颜色
    switch (side) {
      case 'red':
        color = [225, 82, 88, 1] //红方颜色
        break
      case 'blue':
        color = [0, 100, 231, 1] //蓝方颜色
        break
      case 'green':
        color = [0, 250, 0, 1] //绿方颜色
        break
      case 'purple':
        color = [130, 0, 250, 1] //紫方颜色
        break
      default:
        break
    }
    //航线线路绘制
    window.EarthViewer.entities.add({
      name: 'plan realTime line',
      id: id + '-planLine_realTime',
      // position: window.MSIMEarth.Cartesian3.fromDegrees(
      //   position[0],
      //   position[1],
      //   position[2]
      // ),
      polyline: {
        positions:
          window.MSIMEarth.Cartesian3.fromDegreesArrayHeights(positions),
        width: 2,
        //material: window.MSIMEarth.Color.AQUAMARINE .withAlpha(1),
        material: new window.MSIMEarth.PolylineDashMaterialProperty({
          color: new window.MSIMEarth.Color(
            color[0] / 255,
            color[1] / 255,
            color[2] / 255,
            color[3]
          )
        }),
        clampToGround: false,
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          0,
          100e8
        )
      },
      // label: {
      //   font: 'normal 16px MicroSoft YaHei',
      //   scale: 1,
      //   text: `名称:${entityName ? entityName : ''}\n经度:${position[0].toFixed(
      //     2
      //   )}\n纬度:${position[1].toFixed(2)}`,
      //   fillColor: new window.MSIMEarth.Color(
      //     color[0] / 255,
      //     color[1] / 255,
      //     color[2] / 255,
      //     color[3]
      //   ),
      //   outlineColor: window.MSIMEarth.Color.BLACK,
      //   outlineWidth: 2,
      //   backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
      //   style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
      //   horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT, //水平位置
      //   verticalOrigin: window.MSIMEarth.VerticalOrigin.BOTTOM,
      //   pixelOffset: new window.MSIMEarth.Cartesian2(-40, -30),
      //   eyeOffset: new window.MSIMEarth.ConstantProperty(
      //     new window.MSIMEarth.Cartesian3(0, 0, 0)
      //   ),
      //   distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
      //     0,
      //     10e3
      //   )
      //   //disableDepthTestDistance: Number.POSITIVE_INFINITY
      // },
      // point: {
      //   pixelSize: 10,
      //   color: window.MSIMEarth.Color.YELLOW
      // }
    })
  }
  /**
   * 添加TWOSGB
   */
  addTWOSGB() {
    const tileset = new window.MSIMEarth.Cesium3DTileset({
      url: layersUrlConfig.OSGBUrl
    })

    tileset.readyPromise
      .then(function (tileset) {
        tileset.name = 'TWOSGB'
        window.EarthViewer.scene.primitives.add(tileset)
        window.EarthViewer.zoomTo(
          tileset,
          new window.MEarthX.HeadingPitchRange(
            0.0,
            -0.5,
            tileset.boundingSphere.radius * 2.0
          )
        )
        window.currentTileset = tileset
      })
      .catch(function (error) {
        console.log('OSGB没加上', error)
      })
  }
  /**
   * 移除TWOSGB
   */
  removeTWOSGB() {
    window.EarthViewer.scene.primitives._primitives.forEach((e) => {
      if (e.name === 'TWOSGB') {
        window.EarthViewer.scene.primitives.remove(e)
      }
    })
  }
 
  /**
   * 模拟光学卫星开机
   */
  satelliteTurnOn() {
    let options11 = {
      satelliteType: 'light',
      entityId: 'YAOGAN'
    }
    window.sceneAction.satelliteSixActController.spyOnEffect(options11) //开启扫描效果
  }
  /**
   * 模拟光学卫星关机
   */
  satelliteTurnOff() {
    let options11 = {
      satelliteType: 'light',
      entityId: 'YAOGAN'
    }
    window.sceneAction.satelliteSixActController.closeSpyOnEffect(options11) //移除扫描效果
  }
  /**
   * 加载作战区域
   */
  addZZQU(data) {
    const { addOperationalArea } = areaConfig()
    addOperationalArea(data)
  }

  /**
   * 移除作战区域
   */
  showZZQY(options) {
    window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
      if (dataSource._name == options.id) {
        dataSource.entities.show = options.checked
      }
    })
  }
  
  /**
   * 积冰区图层加载
   */
  addIcingAreaLayer(val) {
    this._loadWeatherOceanLayer(val)
  }

  /**
   * 积冰区图层删除
   */
  removeIcingAreaLayer(val) {
    this._removeWeatherOceanLayer(val)
  }

  /**
   * 颠簸区图层加载
   */
  addBumpyAreaLayer(val) {
    this._loadWeatherOceanLayer(val)
  }

  /**
   * 颠簸区图层删除
   */
  removeBumpyAreaLayer(val) {
    this._removeWeatherOceanLayer(val)
  }

  /**
   * 大风区图层加载
   */
  addStwAreaLayer(val) {
    this._loadWeatherOceanLayer(val)
  }

  /**
   * 大风区图层删除
   */
  removeStwAreaLayer(val) {
    this._removeWeatherOceanLayer(val)
  }

  /**
   * 湿度区图层加载
   */
  addRhuAreaLayer(val) {
    this._loadWeatherOceanLayer(val)
  }

  /**
   * 湿度区图层删除
   */
  removeRhuAreaLayer(val) {
    this._removeWeatherOceanLayer(val)
  }

  /**
   * 雷电强降水区图层加载
   */
  addPreAreaLayer(val) {
    this._loadWeatherOceanLayer(val)
  }

  /**
   * 雷电强降水区图层删除
   */
  removePreAreaLayer(val) {
    this._removeWeatherOceanLayer(val)
  }

  /**
   * 低能见度区图层加载
   */
  addVisAreaLayer(val) {
    this._loadWeatherOceanLayer(val)
  }

  /**
   * 低能见度区图层删除
   */
  removeVisAreaLayer(val) {
    this._removeWeatherOceanLayer(val)
  }

  /**
   * 高云量红外衰减区图层加载
   */
  addHccIrAreaLayer(val) {
    this._loadWeatherOceanLayer(val)
  }

  /**
   * 高云量红外衰减区图层删除
   */
  removeHccIrAreaLayer(val) {
    this._removeWeatherOceanLayer(val)
  }

  /**
   * 低空风切变高发区图层加载
   */
  addLlmsAreaLayer(val) {
    this._loadWeatherOceanLayer(val)
  }

  /**
   * 低空风切变高发区图层删除
   */
  removeLlmsAreaLayer(val) {
    this._removeWeatherOceanLayer(val)
  }

  /**
   * 通用气象海洋图层加载方法
   */
  async _loadWeatherOceanLayer(val) {
    const { code, layerNameCn, dataUrls, drawType, featureType } = val
    const cleanUrl = dataUrls[0]

    this._removeWeatherOceanLayer(val)

    switch (drawType) {
      case '面':
        await this._loadPolygonLayer(cleanUrl, layerNameCn, code, featureType)
        break
      case '线':
        await this._loadPolylineLayer(cleanUrl, layerNameCn, code, featureType)
        break
      case '点':
        await this._loadPointLayer(cleanUrl, layerNameCn, code, featureType)
        break
      default:
        await this._loadPolygonLayer(cleanUrl, layerNameCn, code, featureType)
        break
    }
  }

  /**
   * 删除气象海洋图层
   */
  _removeWeatherOceanLayer(val) {
    const { layerNameCn, code } = val
    const viewer = window.EarthViewer

    viewer.dataSources._dataSources.forEach((dataSource) => {
      if (dataSource._name === layerNameCn || dataSource._name === code) {
        viewer.dataSources.remove(dataSource)
      }
    })

    const entitiesToRemove = []
    viewer.entities.values.forEach((entity) => {
      if (
        entity.name &&
        (entity.name === layerNameCn ||
          entity.name === code ||
          entity.name.startsWith(layerNameCn + '_') ||
          entity.name.startsWith(code + '_'))
      ) {
        entitiesToRemove.push(entity.id)
      }
    })

    entitiesToRemove.forEach((id) => {
      viewer.entities.removeById(id)
    })

    viewer.scene.requestRender()
  }

  /**
   * 加载面类型图层
   */
  async _loadPolygonLayer(url, layerName, code, featureType) {
    try {
      const response = await fetch(url)
      const data = await response.json()

      switch (featureType) {
        case 'UU_VV':
          await this._loadUuVvPolygon(data, layerName, code)
          break
        case 'RHU':
          await this._loadRhuPolygon(data, layerName, code)
          break
        case 'PRE':
          await this._loadPrePolygon(data, layerName, code)
          break
        case 'VIS':
          await this._loadVisPolygon(data, layerName, code)
          break
        case 'CLO_COV':
          await this._loadClocovPolygon(data, layerName, code)
          break
        default:
          await this._loadDefaultPolygon(data, layerName, code)
          break
      }
    } catch (error) {
      console.error(`加载面类型图层 ${layerName} 失败:`, error)
    }
  }

  /**
   * 加载线类型图层
   */
  async _loadPolylineLayer(url, layerName, code, featureType) {
    try {
      const response = await fetch(url)
      const data = await response.json()

      switch (featureType) {
        case 'UU_VV':
          await this._loadUuVvPolyline(data, layerName, code)
          break
        case 'RHU':
          await this._loadRhuPolyline(data, layerName, code)
          break
        case 'PRE':
          await this._loadPrePolyline(data, layerName, code)
          break
        case 'VIS':
          await this._loadVisPolyline(data, layerName, code)
          break
        case 'CLO_COV':
          await this._loadClocovPolyline(data, layerName, code)
          break
        default:
          await this._loadDefaultPolyline(data, layerName, code)
          break
      }
    } catch (error) {
      console.error(`加载线类型图层 ${layerName} 失败:`, error)
    }
  }

  /**
   * 加载点类型图层
   */
  async _loadPointLayer(url, layerName, code, featureType) {
    try {
      const response = await fetch(url)
      const data = await response.json()

      switch (featureType) {
        case 'UU_VV':
          await this._loadUuVvPoint(data, layerName, code)
          break
        case 'RHU':
          await this._loadRhuPoint(data, layerName, code)
          break
        case 'PRE':
          await this._loadPrePoint(data, layerName, code)
          break
        case 'VIS':
          await this._loadVisPoint(data, layerName, code)
          break
        case 'CLO_COV':
          await this._loadClocovPoint(data, layerName, code)
          break
        default:
          await this._loadDefaultPoint(data, layerName, code)
          break
      }
    } catch (error) {
      console.error(`加载点类型图层 ${layerName} 失败:`, error)
    }
  }

  async _loadUuVvPolygon(data, layerName, code) {
    await this._loadGeoJsonPolygon(
      data,
      layerName,
      code,
      window.MSIMEarth.Color.CYAN
    )
  }

  async _loadRhuPolygon(data, layerName, code) {
    await this._loadGeoJsonPolygon(
      data,
      layerName,
      code,
      window.MSIMEarth.Color.BLUE
    )
  }

  async _loadPrePolygon(data, layerName, code) {
    await this._loadGeoJsonPolygon(
      data,
      layerName,
      code,
      window.MSIMEarth.Color.GREEN
    )
  }

  async _loadVisPolygon(data, layerName, code) {
    await this._loadGeoJsonPolygon(
      data,
      layerName,
      code,
      window.MSIMEarth.Color.GRAY
    )
  }

  async _loadClocovPolygon(data, layerName, code) {
    await this._loadGeoJsonPolygon(
      data,
      layerName,
      code,
      window.MSIMEarth.Color.WHITE
    )
  }

  async _loadDefaultPolygon(data, layerName, code) {
    await this._loadGeoJsonPolygon(
      data,
      layerName,
      code,
      window.MSIMEarth.Color.YELLOW
    )
  }

  async _loadGeoJsonPolygon(data, layerName, code, color) {
    const features = data.features || data
    const Cesium = window.MSIMEarth
    const viewer = window.EarthViewer

    features.forEach((feature) => {
      const geometry = feature.geometry
      const properties = feature.properties || {}
      const typeConfig = properties.type || {}
      const borderShape = typeConfig.borderShape || 'solid'
      const fillEnabled = typeConfig.fillEnabled !== false

      const fillColorHex = properties.fill || '#FF0000'
      const fillOpacity =
        properties['fill-opacity'] !== undefined
          ? properties['fill-opacity']
          : 0.4
      const strokeWidth =
        properties['stroke-width'] !== undefined
          ? properties['stroke-width']
          : 3

      const fillColor = Cesium.Color.fromCssColorString(fillColorHex)
      const strokeColor = Cesium.Color.fromCssColorString(fillColorHex)

      if (
        !geometry ||
        (geometry.type !== 'Polygon' && geometry.type !== 'MultiPolygon')
      ) {
        return
      }

      const coordinates =
        geometry.type === 'Polygon'
          ? [geometry.coordinates]
          : geometry.coordinates

      coordinates.forEach((polygonCoords) => {
        const outerRing = polygonCoords[0]
        const innerRings = polygonCoords.slice(1)

        let processedOuterRing = outerRing
        let processedInnerRings = innerRings

        if (borderShape === 'jagged' || borderShape === 'jagged2') {
          if (borderShape === 'jagged') {
            processedOuterRing = this._wavyPolygon(outerRing, {
              amplitude: 0.006,
              frequency: 70,
              segmentsPerEdge: 16
            })
            processedInnerRings = innerRings.map((ring) =>
              this._wavyPolygon(ring, {
                amplitude: 0.006,
                frequency: 70,
                segmentsPerEdge: 16
              })
            )
          } else if (borderShape === 'jagged2') {
            processedOuterRing = this._wavyPolygon(outerRing, {
              amplitude: 0.025,
              frequency: 30,
              segmentsPerEdge: 20
            })
            processedInnerRings = innerRings.map((ring) =>
              this._wavyPolygon(ring, {
                amplitude: 0.025,
                frequency: 30,
                segmentsPerEdge: 20
              })
            )
          }
        }

        const outerPositions = []
        processedOuterRing.forEach((coord) => {
          outerPositions.push(
            Cesium.Cartesian3.fromDegrees(coord[0], coord[1], 1000)
          )
        })

        const innerPositionsArray = []
        processedInnerRings.forEach((ring) => {
          const positions = []
          ring.forEach((coord) => {
            positions.push(
              Cesium.Cartesian3.fromDegrees(coord[0], coord[1], 1000)
            )
          })
          innerPositionsArray.push(positions)
        })

        const hierarchy = new Cesium.PolygonHierarchy(
          outerPositions,
          innerPositionsArray.length > 0 ? innerPositionsArray : undefined
        )

        if (fillEnabled) {
          viewer.entities.add({
            name: layerName,
            polygon: {
              hierarchy: hierarchy,
              material: fillColor.withAlpha(fillOpacity),
              outline: false,
              height: 1000,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              extrudedHeight: 1001,
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                0,
                Number.MAX_VALUE
              ),
              disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
          })
        }

        this._createBorderLine(
          viewer,
          Cesium,
          outerPositions,
          layerName,
          strokeColor,
          borderShape,
          strokeWidth
        )

        innerRings.forEach((ring) => {
          const innerPositions = []
          ring.forEach((coord) => {
            innerPositions.push(
              Cesium.Cartesian3.fromDegrees(coord[0], coord[1], 1000)
            )
          })
          this._createBorderLine(
            viewer,
            Cesium,
            innerPositions,
            layerName,
            strokeColor,
            borderShape,
            strokeWidth
          )
        })
      })

      const weatherPoints = properties.weatherPoint || []
      weatherPoints.forEach((point) => {
        const pointUrl = point.pointUrl
        const rotate = point.rotate || 0
        const coord = point.coordinates
        const describe = point.describe || ''

        if (pointUrl && coord && coord.length >= 2) {
          const position = Cesium.Cartesian3.fromDegrees(coord[0], coord[1], 1)

          viewer.entities.add({
            name: layerName + '_weatherPoint_image',
            position: position,
            billboard: {
              image: pointUrl,
              show: true,
              width: 40,
              height: 40,
              scale: 1.0,
              scaleByDistance: new Cesium.NearFarScalar(
                1000,
                1.5,
                1000000,
                0.3
              ),
              verticalOrigin: Cesium.VerticalOrigin.BOTTOM,
              heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
              distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                0,
                Number.MAX_VALUE
              ),
              disableDepthTestDistance: Number.POSITIVE_INFINITY
            }
          })

          if (describe && describe.length > 0) {
            viewer.entities.add({
              name: layerName + '_weatherPoint_label',
              position: position,
              label: {
                text: describe,
                show: true,
                font: 'bold 14px sans-serif',
                fillColor: Cesium.Color.WHITE,
                strokeColor: Cesium.Color.TRANSPARENT,
                strokeWidth: 0,
                style: Cesium.LabelStyle.FILL,
                scale: 1.0,
                scaleByDistance: new Cesium.NearFarScalar(
                  1000,
                  1.5,
                  1000000,
                  0.3
                ),
                verticalOrigin: Cesium.VerticalOrigin.TOP,
                heightReference: Cesium.HeightReference.CLAMP_TO_GROUND,
                distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
                  0,
                  Number.MAX_VALUE
                ),
                disableDepthTestDistance: Number.POSITIVE_INFINITY
              }
            })
          }
        }
      })
    })

    viewer.scene.requestRender()
  }

  _smoothPolygon(coordinates, tolerance = 5) {
    if (coordinates.length < 3) return coordinates
    const points = coordinates.slice(0, -1)
    const interpolatedPoints = []
    for (let i = 0; i < points.length; i++) {
      const p0 = points[(i - 1 + points.length) % points.length]
      const p1 = points[i]
      const p2 = points[(i + 1) % points.length]
      const p3 = points[(i + 2) % points.length]
      for (let t = 0; t < 1; t += 1 / tolerance) {
        const t2 = t * t,
          t3 = t2 * t
        const x =
          0.5 *
          (2 * p1[0] +
            (-p0[0] + p2[0]) * t +
            (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 +
            (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3)
        const y =
          0.5 *
          (2 * p1[1] +
            (-p0[1] + p2[1]) * t +
            (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 +
            (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3)
        interpolatedPoints.push([x, y])
      }
    }
    interpolatedPoints.push(interpolatedPoints[0])
    return interpolatedPoints
  }

  _wavyPolygon(coordinates, options = {}) {
    if (!coordinates || coordinates.length < 3) return coordinates
    const { amplitude = 0.015, frequency = 14, segmentsPerEdge = 16 } = options

    const closed =
      coordinates[0][0] === coordinates[coordinates.length - 1][0] &&
      coordinates[0][1] === coordinates[coordinates.length - 1][1]
    const verts = closed ? coordinates.slice(0, -1) : coordinates.slice()
    const n = verts.length
    if (n < 3) return coordinates

    let minLng = Infinity,
      maxLng = -Infinity
    let minLat = Infinity,
      maxLat = -Infinity
    for (const [lng, lat] of verts) {
      if (lng < minLng) minLng = lng
      if (lng > maxLng) maxLng = lng
      if (lat < minLat) minLat = lat
      if (lat > maxLat) maxLat = lat
    }
    const centerLng = (minLng + maxLng) / 2
    const centerLat = (minLat + maxLat) / 2

    const cosLat = Math.cos((centerLat * Math.PI) / 180) || 1

    const edgeLens = []
    let totalLen = 0
    for (let i = 0; i < n; i++) {
      const [lng1, lat1] = verts[i]
      const [lng2, lat2] = verts[(i + 1) % n]
      const dx = (lng2 - lng1) * cosLat
      const dy = lat2 - lat1
      const len = Math.sqrt(dx * dx + dy * dy)
      edgeLens.push(len)
      totalLen += len
    }

    if (totalLen === 0) return coordinates

    const totalSamples = n * segmentsPerEdge
    const result = []
    let progress = 0

    for (let i = 0; i < n; i++) {
      const [lng1, lat1] = verts[i]
      const [lng2, lat2] = verts[(i + 1) % n]
      const edgeLen = edgeLens[i]
      const samplesOnEdge = segmentsPerEdge

      for (let s = 0; s < samplesOnEdge; s++) {
        const t = s / samplesOnEdge

        const baseLng = lng1 + (lng2 - lng1) * t
        const baseLat = lat1 + (lat2 - lat1) * t

        const dxNorm = (baseLng - centerLng) * cosLat
        const dyNorm = baseLat - centerLat
        const dist = Math.sqrt(dxNorm * dxNorm + dyNorm * dyNorm)

        let ux, uy
        if (dist > 1e-10) {
          ux = dxNorm / dist
          uy = dyNorm / dist
        } else {
          const angle = Math.atan2(dyNorm, dxNorm) + Math.PI / 2
          ux = Math.cos(angle)
          uy = Math.sin(angle)
        }

        const phase = (progress / totalLen) * Math.PI * 2 * frequency
        const wave = Math.sin(phase)

        const newLng = baseLng + (ux * amplitude * wave) / cosLat
        const newLat = baseLat + uy * amplitude * wave

        result.push([newLng, newLat])

        progress += edgeLen / samplesOnEdge
      }
    }

    result.push(result[0])
    return result
  }

  _createBorderLine(
    viewer,
    Cesium,
    positions,
    layerName,
    color,
    borderShape,
    strokeWidth = 3
  ) {
    const material = color.withAlpha(0.9)
    const lineWidth = Math.max(1, strokeWidth)
    switch (borderShape) {
      case 'jagged':
      case 'jagged2':
        viewer.entities.add({
          name: layerName + '_outline',
          polyline: {
            positions: positions,
            width: lineWidth,
            material: material,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
              0,
              Number.MAX_VALUE
            ),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
        })
        break
      case 'dashed':
        viewer.entities.add({
          name: layerName + '_outline',
          polyline: {
            positions: positions,
            width: lineWidth,
            material: new Cesium.PolylineDashMaterialProperty({
              color: material,
              dashLength: 15,
              gapLength: 10
            }),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
              0,
              Number.MAX_VALUE
            ),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
        })
        break
      case 'dotted':
        viewer.entities.add({
          name: layerName + '_outline',
          polyline: {
            positions: positions,
            width: lineWidth,
            material: new Cesium.PolylineDashMaterialProperty({
              color: material,
              dashLength: 3,
              gapLength: 8
            }),
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
              0,
              Number.MAX_VALUE
            ),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
        })
        break
      case 'solid':
      default:
        viewer.entities.add({
          name: layerName + '_outline',
          polyline: {
            positions: positions,
            width: lineWidth,
            material: material,
            distanceDisplayCondition: new Cesium.DistanceDisplayCondition(
              0,
              Number.MAX_VALUE
            ),
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          }
        })
        break
    }
  }

  async _loadUuVvPolyline(data, layerName, code) {
    await this._loadGeoJsonPolyline(
      data,
      layerName,
      code,
      window.MSIMEarth.Color.CYAN
    )
  }

  async _loadRhuPolyline(data, layerName, code) {
    await this._loadGeoJsonPolyline(
      data,
      layerName,
      code,
      window.MSIMEarth.Color.BLUE
    )
  }

  async _loadPrePolyline(data, layerName, code) {
    await this._loadGeoJsonPolyline(
      data,
      layerName,
      code,
      window.MSIMEarth.Color.GREEN
    )
  }

  async _loadVisPolyline(data, layerName, code) {
    await this._loadGeoJsonPolyline(
      data,
      layerName,
      code,
      window.MSIMEarth.Color.GRAY
    )
  }

  async _loadClocovPolyline(data, layerName, code) {
    await this._loadGeoJsonPolyline(
      data,
      layerName,
      code,
      window.MSIMEarth.Color.WHITE
    )
  }

  async _loadDefaultPolyline(data, layerName, code) {
    await this._loadGeoJsonPolyline(
      data,
      layerName,
      code,
      window.MSIMEarth.Color.YELLOW
    )
  }

  async _loadGeoJsonPolyline(data, layerName, code, color) {
    const geojson = {
      type: 'FeatureCollection',
      features: data.features || data
    }

    window.EarthViewer.dataSources
      .add(window.MSIMEarth.GeoJsonDataSource.load(geojson))
      .then((dataSource) => {
        dataSource.name = layerName
        const entities = dataSource.entities.values
        for (let i = 0; i < entities.length; i++) {
          const entity = entities[i]
          if (entity.polyline) {
            entity.polyline.material = color
            entity.polyline.width = 2
            entity.polyline.clampToGround = true
            entity.polyline.distanceDisplayCondition =
              new window.MSIMEarth.DistanceDisplayCondition(0, 1000e5)
            entity.polyline.disableDepthTestDistance = Number.POSITIVE_INFINITY
          }
        }
      })
  }

  async _loadUuVvPoint(data, layerName, code) {
    await this._loadGeoJsonPoint(
      data,
      layerName,
      code,
      window.MSIMEarth.Color.CYAN
    )
  }

  async _loadRhuPoint(data, layerName, code) {
    await this._loadGeoJsonPoint(
      data,
      layerName,
      code,
      window.MSIMEarth.Color.BLUE
    )
  }

  async _loadPrePoint(data, layerName, code) {
    await this._loadGeoJsonPoint(
      data,
      layerName,
      code,
      window.MSIMEarth.Color.GREEN
    )
  }

  async _loadVisPoint(data, layerName, code) {
    await this._loadGeoJsonPoint(
      data,
      layerName,
      code,
      window.MSIMEarth.Color.GRAY
    )
  }

  async _loadClocovPoint(data, layerName, code) {
    await this._loadGeoJsonPoint(
      data,
      layerName,
      code,
      window.MSIMEarth.Color.WHITE
    )
  }

  async _loadDefaultPoint(data, layerName, code) {
    await this._loadGeoJsonPoint(
      data,
      layerName,
      code,
      window.MSIMEarth.Color.YELLOW
    )
  }

  async _loadGeoJsonPoint(data, layerName, code, color) {
    const geojson = {
      type: 'FeatureCollection',
      features: data.features || data
    }

    window.EarthViewer.dataSources
      .add(window.MSIMEarth.GeoJsonDataSource.load(geojson))
      .then((dataSource) => {
        dataSource.name = layerName
        const entities = dataSource.entities.values
        for (let i = 0; i < entities.length; i++) {
          const entity = entities[i]
          if (entity.point) {
            entity.point.color = color
            entity.point.pixelSize = 5
            entity.point.heightReference =
              window.MSIMEarth.HeightReference.CLAMP_TO_GROUND
          }
          if (entity.properties && entity.properties.imageUrl) {
            const imageUrl = entity.properties.imageUrl._value
            const position = entity.position._value
            if (imageUrl && position) {
              entity.billboard = {
                image: imageUrl,
                show: true,
                width: 5,
                height: 5,
                eyeOffset: new window.MSIMEarth.ConstantProperty(
                  new window.MSIMEarth.Cartesian3(0, 0, -1)
                ),
                pixelOffset: new window.MSIMEarth.Cartesian2(0, -25),
                scaleByDistance: new window.MSIMEarth.NearFarScalar(
                  1.5e2,
                  6.0,
                  1.5e7,
                  3.5
                ),
                heightReference:
                  window.MSIMEarth.HeightReference.CLAMP_TO_GROUND,
                distanceDisplayCondition:
                  new window.MSIMEarth.DistanceDisplayCondition(0, 100e5)
              }
            }
          }
        }
      })
  }
}
export default DataControl
