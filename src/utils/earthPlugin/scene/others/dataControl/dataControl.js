// import { loadGLSL } from '@/utils/postProcess/load.js'
// import { galaxyLineGLSL } from '@/utils/postProcess/galaxyline.js'
import store from '@/store'
// import SuperGif from '@/utils/libgif.js'
import { worldPosToGraphic } from '@/utils/mapTools'
import { airport } from './data/airport2.js'
//import { airport } from '@/utils/earthPlugin/Assets/data/airport/airportTH.js'
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

  // 地面和船显隐
  showGroundTargetOrResource(actorId, flag) {
    let viewer = window.EarthViewer
    let entity = viewer.entities.getById(actorId)
    if (!entity) {
      let ds = viewer.dataSources.getByName(actorId)
      if (ds.length > 0) {
        entity = ds[0].entities.getById(actorId)
      }
    }
    if (entity) {
      entity.show = flag
    }
  }

  // 热力图显隐
  async addHeatMap(type) {
    let viewer = window.EarthViewer
    let heatMap = store.state.AFSIMModule.heatMapContainer
    if (type) {
      try {
        // 从UE.json文件获取热力图数据
        const response = await fetch('static/data/json/UE.json')
        const jsonData = await response.json()

        // 计算数据范围
        let minValue = Infinity
        let maxValue = -Infinity
        for (let i = 0; i < jsonData.length; i++) {
          const value = parseFloat(jsonData[i].A)
          if (value < minValue) minValue = value
          if (value > maxValue) maxValue = value
        }

        let heatList = []
        for (let i = 0; i < jsonData.length; i++) {
          let item = jsonData[i]
          let value = parseFloat(item.A)
          // 归一化到 0-1 范围
          let normalizedValue = (value - minValue) / (maxValue - minValue)
          // 确保值在 0-1 范围内
          normalizedValue = Math.max(0, Math.min(1, normalizedValue))

          let param = {
            lnglat: [parseFloat(item.O), parseFloat(item.L)],
            value: normalizedValue // 使用归一化后的值作为热力值
          }
          heatList.push(param)
          viewer.entities.add({
            position: window.MSIMEarth.Cartesian3.fromDegrees(
              param.lnglat[0],
              param.lnglat[1],
              parseFloat(item.A || 0)
            ),
            point: {
              pixelSize: 5,
              color: window.MSIMEarth.Color.RED
            }
          })
        }

        heatMap = new Heatmap3d(window.EarthViewer, {
          list: heatList,
          raduis: 15,
          baseHeight: 200,
          // primitiveType: "TRNGLE",
          primitiveType: 'LINES',
          gradient: {
            '.3': 'blue',
            '.5': 'green',
            '.7': 'yellow',
            '.95': 'red'
          }
        })
        store.state.AFSIMModule.heatMapContainer = heatMap
      } catch (error) {
        console.error('加载热力图数据失败:', error)
      }
    } else {
      if (heatMap) {
        heatMap.destroy()
      }
    }
  }

  //加载geojson数据 （暂时不用这个
  addGeojsonData(options) {
    let viewer = window.EarthViewer
    let Cesium = window.MSIMEarth
    var promise = window.MSIMEarth.GeoJsonDataSource.load(options.url)
    if (!options.geoType) return
    promise.then(function (dataSource) {
      dataSource.name = options.id
      viewer.dataSources.add(dataSource).then
      var entities = dataSource.entities.values
      for (let i = 0; i < entities.length; i++) {
        let entity = entities[i]
        entity.billboard = undefined
        let geoType = options.geoType
        switch (geoType) {
          case 'point':
            entity.point = {
              color: options.color,
              pixelSize: options.size || 5
            }
            break
          case 'polyline':
            // entity.polyline.material = options.color
            entity.polyline.material =
              new window.MSIMEarth.PolylineGlowMaterialProperty({
                glowPower: 0.1,
                color: options.color
              })
            entity.polyline.width = options.width || 12
            break
          case 'polygon':
            // if (entity._name == '中印' || entity._name == '中朝') {
            //   entity.polygon.material = window.MSIMEarth.Color.CYAN.withAlpha(0.2)
            //   entity.polygon.outlineColor = window.MSIMEarth.Color.CYAN.withAlpha(0.7)
            // } else if (entity._name.indexOf('海') > -1) {
            //   entity.polygon.material = window.MSIMEarth.Color.CRIMSON.withAlpha(0.2)
            //   entity.polygon.outlineColor = window.MSIMEarth.Color.CRIMSON.withAlpha(0.7)
            // } else {
            //   entity.polygon.material = options.color
            // }
            entity.polygon.material = window.MSIMEarth.Color.CYAN.withAlpha(0.2)
            entity.polygon.outlineColor =
              window.MSIMEarth.Color.CYAN.withAlpha(0.6)
            entity.polyline = {
              positions: entity.polygon.hierarchy._value.positions,
              width: 10,
              material: new window.MSIMEarth.AreaLineBMaterialProperty({
                color: window.MSIMEarth.Color.CYAN,
                duration: 400
              })
            }
            break
          default:
            break
        }
        if (options.addLabel) {
          let textVal = ''
          if (entity.properties) {
            textVal = entity.properties.zhname || entity.properties.NAME
            let nearDis = options.nearDis || 1e2
            let farDis = options.farDis || 1e6
            let color = window.MSIMEarth.Color.WHITE
            if (textVal == '中华人民共和国') {
              color = window.MSIMEarth.Color.RED
            }
            entity.label = {
              text: textVal,
              font: 'normal 29px MicroSoft YaHei',
              scale: options.scale || 0.5,
              fillColor: color,
              outlineColor: color,
              outlineWidth: 1,
              style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
              horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT, //水平位置
              verticalOrigin: window.MSIMEarth.VerticalOrigin.BOTTOM,
              pixelOffset: new window.MSIMEarth.Cartesian2(-33, -11),
              eyeOffset: new window.MSIMEarth.ConstantProperty(
                new window.MSIMEarth.Cartesian3(0, 0, -11)
              ),
              distanceDisplayCondition:
                new window.MSIMEarth.DistanceDisplayCondition(nearDis, farDis)
            }
          }
        }
      }
    })
  }

  delGeojsonData() { }

  //卫星显隐控制 {dataSourceName:"czml的name",isVisible:true/false,entityId:""}
  satelliteIsvisible(params) {
    console.log(params)
    let dataSource = viewer.dataSources.getByName(params.dataSourceName)
    if (params.entityId) {
      let es = dataSource.getByName(params.entityId)
      es.forEach((element) => {
        element.show = params.isVisible
      })
    } else {
      if (dataSource.length > 0) {
        for (let k = 0; k < dataSource.length; k++) {
          dataSource[k].show = params.isVisible
        }
      }
    }
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
    const options = {
      url: 'static/data/geojson/FK识别区/DH防空识别点数据.json',
      color: window.MSIMEarth.Color.RED, //152, 56, 93
      addLabel: false,
      dataType: 'vector',
      geoType: 'point',
      id: '防空1'
    }
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
    let center = new window.MSIMEarth.Cartesian3.fromDegrees(
      124.56142578414978,
      29.088438770842423
    )
    let centerTW = new window.MSIMEarth.Cartesian3.fromDegrees(
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
        // text: '财政局西门',
        text: '东海防空识别区',
        // backgroundColor: new window.MSIMEarth.Color(1.0, 153 / 255, 18 / 255, 1.0),
        // showBackground: false,
        font: 'normal 46px MicroSoft YaHei',
        scale: 0.5,
        fillColor: window.MSIMEarth.Color.RED,
        style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        // outlineWidth: 2,
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
    let centerTW = new window.MSIMEarth.Cartesian3.fromDegrees(
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
  /**
   * 添加四海两边
   */
  _add4H2B() {
    // const options = {
    //   url: basicVectorData.fourSeaTwoBorder,
    //   color: window.MSIMEarth.Color.RED,
    //   addLabel: false,
    //   dataType: 'vector',
    //   geoType: 'polygon',
    //   id: '4H2B'
    // }
    // this.addGeojson(options)
    let add = true
    window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
      if (dataSource._name == '4H2B') {
        dataSource.show = true
        add = false
        // 移除czml路径
        // window.EarthViewer.dataSources.remove(dataSource)
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
    // const options3 = {
    //   url: basicVectorData.daolian3,
    //   color: window.MSIMEarth.Color.YELLOW,
    //   addLabel: false,
    //   dataType: 'vector',
    //   geoType: 'polyline',
    //   id: 'daolian3'
    // }
    // this.addGeojson(options3)
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
      url: layersUrlConfig.twHDImage
      // minimumLevel: 14 //最小层级
      // maximumLevel: 18 //最大层级
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

  //添加中国 北京点
  addChina() {
    // window.EarthViewer.entities.add({
    //   id: 'shoudu',
    //   position: window.MSIMEarth.Cartesian3.fromDegrees(
    //     116.41228426717022,
    //     40.18554306975011
    //   ),
    //   billboard: {
    //     image: './static/image/billboard/实五角星3.png',
    //     show: true,
    //     width: 5,
    //     height: 5,
    //     rotation: 0.0,
    //     eyeOffset: new window.MSIMEarth.ConstantProperty(
    //       new window.MSIMEarth.Cartesian3(0, 0, -1)
    //     ),
    //     pixelOffset: new window.MSIMEarth.Cartesian2(0.0, -1),
    //     scaleByDistance: new window.MSIMEarth.NearFarScalar(
    //       1.5e2,
    //       6.0,
    //       1.5e7,
    //       3.5
    //     ),
    //     distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
    //       0,
    //       350e5
    //     ),
    //     disableDepthTestDistance: Number.POSITIVE_INFINITY
    //   },
    //   label: {
    //     text: '北京市',
    //     font: '400 18px MicroSoft YaHei',
    //     fillColor: new window.MSIMEarth.Color(230 / 255, 0 / 255, 0 / 255, 0.7),
    //     style: window.MSIMEarth.LabelStyle.FILL,
    //     // style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
    //     horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
    //     verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
    //     pixelOffset: new window.MSIMEarth.Cartesian2(-25, -20),
    //     // showBackground: true,
    //     backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
    //     distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
    //       0,
    //       350e5
    //     ),
    //     scaleByDistance: new window.MSIMEarth.NearFarScalar(
    //       30e5,
    //       1.0,
    //       80e5,
    //       0.7
    //     ),
    //     outlineColor: window.MSIMEarth.Color.BLACK,
    //     outlineWidth: 2,
    //     // disableDepthTestDistance: Number.POSITIVE_INFINITY
    //     disableDepthTestDistance: 100000
    //   }
    // })
    // window.EarthViewer.entities.add({
    //   id: 'china',
    //   position: window.MSIMEarth.Cartesian3.fromDegrees(
    //     108.90773811396551,
    //     30.345157066965147
    //   ),
    //   label: {
    //     text: '中华人民共和国',
    //     font: '400 28px MicroSoft YaHei',
    //     fillColor: new window.MSIMEarth.Color(230 / 255, 0 / 255, 0 / 255, 0.7),
    //     style: window.MSIMEarth.LabelStyle.FILL,
    //     // style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
    //     horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
    //     verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
    //     pixelOffset: new window.MSIMEarth.Cartesian2(-25, -80),
    //     // showBackground: true,
    //     backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
    //     distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
    //       20e5,
    //       350e5
    //     ),
    //     scaleByDistance: new window.MSIMEarth.NearFarScalar(
    //       30e5,
    //       1.0,
    //       80e5,
    //       0.6
    //     ),
    //     outlineColor: window.MSIMEarth.Color.BLACK,
    //     outlineWidth: 2,
    //     disableDepthTestDistance: Number.POSITIVE_INFINITY
    //   }
    // })
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
          // e.billboard = {
          //   image: 'static/image/billboard/城市.png',
          //   show: true,
          //   width: 10,
          //   height: 10,
          //   rotation: 0.0,
          //   eyeOffset: new window.MSIMEarth.ConstantProperty(
          //     new window.MSIMEarth.Cartesian3(0, 0, -1)
          //   ),
          //   // pixelOffset: new window.MSIMEarth.Cartesian2(0.0, -45),
          //   scaleByDistance: new window.MSIMEarth.NearFarScalar(
          //     1.5e2,
          //     6.0,
          //     1.5e7,
          //     3.5
          //   ),
          //   distanceDisplayCondition:
          //     new window.MSIMEarth.DistanceDisplayCondition(0, 300e5)
          // }
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

    // window.EarthViewer.entities.add({
    //   position: window.MSIMEarth.Cartesian3.fromDegrees(
    //     120.26157328273332,
    //     38.57415106853603
    //   ),
    //   label: {
    //     text: '渤海',
    //     font: '20px 黑体',
    //     fillColor: window.MSIMEarth.Color.BLUE,
    //     style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
    //     horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
    //     verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
    //     pixelOffset: new window.MSIMEarth.Cartesian2(-35, -10),
    //     // showBackground: true,
    //     outlineColor: window.MSIMEarth.Color.WHITE,
    //     outlineWidth: 2,
    //     backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
    //     distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
    //       20e5,
    //       100e5
    //     )
    //   }
    // })
    // window.EarthViewer.entities.add({
    //   position: window.MSIMEarth.Cartesian3.fromDegrees(
    //     123.59699699558637,
    //     34.167035046098306
    //   ),
    //   label: {
    //     text: '黄海',
    //     font: '20px 黑体',
    //     fillColor: window.MSIMEarth.Color.BLUE,
    //     style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
    //     horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
    //     verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
    //     pixelOffset: new window.MSIMEarth.Cartesian2(-35, -10),
    //     // showBackground: true,
    //     outlineColor: window.MSIMEarth.Color.WHITE,
    //     outlineWidth: 2,
    //     backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
    //     distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
    //       20e5,
    //       100e5
    //     )
    //   }
    // })
    // window.EarthViewer.entities.add({
    //   position: window.MSIMEarth.Cartesian3.fromDegrees(
    //     122.81499205347458,
    //     27.3254533714982
    //   ),
    //   label: {
    //     text: '东海',
    //     font: '20px 黑体',
    //     fillColor: window.MSIMEarth.Color.BLUE,
    //     style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
    //     horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
    //     verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
    //     // pixelOffset: new window.MSIMEarth.Cartesian2(-85, -10),
    //     // showBackground: true,
    //     outlineColor: window.MSIMEarth.Color.WHITE,
    //     outlineWidth: 2,
    //     backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
    //     distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
    //       20e5,
    //       100e5
    //     )
    //   }
    // })
    // window.EarthViewer.entities.add({
    //   position: window.MSIMEarth.Cartesian3.fromDegrees(
    //     113.98819955558463,
    //     12.282693794963846
    //   ),
    //   label: {
    //     text: '南海',
    //     font: '20px 黑体',
    //     fillColor: window.MSIMEarth.Color.BLUE,
    //     style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
    //     horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
    //     verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
    //     pixelOffset: new window.MSIMEarth.Cartesian2(-35, -10),
    //     // showBackground: true,
    //     outlineColor: window.MSIMEarth.Color.WHITE,
    //     outlineWidth: 2,
    //     backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
    //     distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
    //       20e5,
    //       100e5
    //     )
    //   }
    // })
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
  //台湾地理数据测试
  addTWDL() {
    const options = {
      url: 'static/geojson/gis_osm_waterways_free_1.json',
      color: window.MSIMEarth.Color.RED.withAlpha(0.5),
      addLabel: false,
      dataType: 'vector',
      geoType: 'polyline',
      id: 'test'
    }
    this.addGeojson(options)
  }
  /**
   * 中印等高点
   */
  addElevation() {
    elevationPoints.forEach((element) => {
      window.EarthViewer.entities.add({
        position: window.MSIMEarth.Cartesian3.fromDegrees(
          element.coordinate[0],
          element.coordinate[1],
          element.coordinate[2]
        ),
        label: {
          text: `${element.value}`,
          distanceDisplayCondition:
            new window.MSIMEarth.DistanceDisplayCondition(
              0,
              // 2e5
              10e5
            ),
          height: 1000,
          heightReference: window.MSIMEarth.HeightReference.CLAMP_TO_GROUND,
          // backgroundColor: new window.MSIMEarth.Color(1.0, 153 / 255, 18 / 255, 1.0),
          // showBackground: false,
          font: 'normal 32px BLACK',
          scale: 0.6,
          fillColor: window.MSIMEarth.Color.YELLOW,
          style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
          // horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT, //水平位置
          // verticalOrigin: window.MSIMEarth.VerticalOrigin.BOTTOM,
          pixelOffset: new window.MSIMEarth.Cartesian2(0, -15),
          eyeOffset: new window.MSIMEarth.ConstantProperty(
            new window.MSIMEarth.Cartesian3(0, 0, -1)
          )
        }
      })
    })
  }
  /**
   * 中印态势初始
   */
  addZYTS() {
    // 219国道
    const options1 = {
      url: basicVectorData.g219,
      color: window.MSIMEarth.Color.YELLOW,
      addLabel: false,
      dataType: 'vector',
      geoType: 'polyline',
      width: 4,
      id: 'g219'
    }
    this.addGeojson(options1)
    // 印度河和狮泉河
    const options2 = {
      url: basicVectorData.yinduheshiquanhe,
      color: window.MSIMEarth.Color.YELLOW,
      addLabel: false,
      dataType: 'vector',
      geoType: 'polyline',
      width: 4,
      id: 'yindushiquan'
    }
    this.addGeojson(options2)
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
   * 中印边界班公湖坡度坡向
   * @param {*} type '中印边界坡度' '中印边界坡向'
   */
  add_ZY_Slope_Aspect(type) {
    switch (type) {
      case '中印边界坡度':
        window.EarthViewer.camera.flyTo({
          destination: new window.MSIMEarth.Cartesian3(
            893450.427911107,
            5503791.00276749,
            3361838.329586078
          ),
          orientation: {
            heading: 6.208681757063205, //偏航角
            pitch: -0.601335396103261, //-0.08401170275668313, //水平俯仰角
            roll: 0.00014297250188821664
          },
          complete: () => { }
        })
        let slope = new window.MSIMEarth.UrlTemplateImageryProvider({
          url: googleConfig.slope
        })
        slope.name = '中印边界坡度'
        window.EarthViewer.imageryLayers.addImageryProvider(slope)
        break
      case '中印边界坡向':
        window.EarthViewer.camera.flyTo({
          destination: new window.MSIMEarth.Cartesian3(
            893450.427911107,
            5503791.00276749,
            3361838.329586078
          ),
          orientation: {
            heading: 6.208681757063205, //偏航角
            pitch: -0.601335396103261, //-0.08401170275668313, //水平俯仰角
            roll: 0.00014297250188821664
          },
          complete: () => { }
        })
        let aspect = new window.MSIMEarth.UrlTemplateImageryProvider({
          url: googleConfig.aspect
        })
        aspect.name = '中印边界坡向'
        window.EarthViewer.imageryLayers.addImageryProvider(aspect)
        break
      default:
        break
    }
  }
  /**
   * 班公湖地形
   */
  add_ZY_BGHTerrain() {
    try {
      window.EarthViewer.scene.globe.depthTestAgainstTerrain = true
      let terrainLayer = new window.MSIMEarth.CesiumTerrainProvider({
        url: googleConfig.bangonghuTerrian,
        tilingScheme: new window.MSIMEarth.GeographicTilingScheme()
      })
      window.EarthViewer.scene.terrainProvider = terrainLayer
    } catch (error) {
      console.error('添加班公湖地形失败:', error)
      // 使用椭球体地形作为备选方案
      window.EarthViewer.scene.terrainProvider =
        new window.MSIMEarth.EllipsoidTerrainProvider({})
    }
  }

  /**
   * 中印班公湖附近区域等高线
   */
  add_ZYContourLine() {
    let webmercator1 = new window.MSIMEarth.UrlTemplateImageryProvider({
      url: googleConfig.bangonghuContourLine,
      minimumLevel: 0, //最小层级
      maximumLevel: 18 //最大层级
    })
    webmercator1.name = '中印班公湖等高线1'
    window.EarthViewer.imageryLayers.addImageryProvider(webmercator1)
    let webmercator2 = new window.MSIMEarth.UrlTemplateImageryProvider({
      url: googleConfig.bangonghuContourLine2,
      minimumLevel: 0, //最小层级
      maximumLevel: 18 //最大层级
    })
    webmercator2.name = '中印班公湖等高线2'
    window.EarthViewer.imageryLayers.addImageryProvider(webmercator2)
    // window.cameraListener = function () {
    //   var e = window.EarthViewer.camera.position
    //   // console.log(window.MSIMEarth.Cartographic.fromCartesian(e).height, webmercator2.show);
    //   if (
    //     window.MSIMEarth.Cartographic.fromCartesian(e).height < 50000 &&
    //     window.MSIMEarth.Cartographic.fromCartesian(e).height > 5000
    //   ) {
    //     webmercator1.show = true
    //     webmercator2.show = true
    //   } else {
    //     webmercator1.show = false
    //     webmercator2.show = false
    //   }
    // }
    // window.EarthViewer.camera.changed.addEventListener(window.cameraListener)
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
  // // 等待效果
  // loadingPost(time, callback) {
  //   console.log(time)
  //   let loadPost = new window.MSIMEarth.PostProcessStage({
  //     name: 'load',
  //     fragmentShader: loadGLSL
  //   })
  //   window.ppsCollection.add(loadPost)
  //   setTimeout(() => {
  //     window.ppsCollection.remove(loadPost)
  //     callback()
  //   }, time)
  // }
  // // 星线效果
  // galaxyLinePost(time, callback) {
  //   let loadPost = new window.MSIMEarth.PostProcessStage({
  //     name: 'galaxyline',
  //     fragmentShader: galaxyLineGLSL
  //   })
  //   window.ppsCollection.add(loadPost)
  //   setTimeout(() => {
  //     window.ppsCollection.remove(loadPost)
  //     callback()
  //   }, 10000)
  // }
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
  // // 控制loading显示隐藏
  // loadingPost2(type) {
  //   if (window.loadPost2) {
  //     window.ppsCollection.remove(window.loadPost2)
  //     window.loadPost2 = null
  //   }
  //   if (type) {
  //     window.loadPost2 = new window.MSIMEarth.PostProcessStage({
  //       name: 'load',
  //       fragmentShader: loadGLSL
  //     })
  //     window.ppsCollection.add(window.loadPost2)
  //   }
  // }
  // 翻页下拉效果
  // pageDropPost(time, callback) {
  //   let loadPost = new window.MSIMEarth.PostProcessStage({
  //     name: 'pageDrop',
  //     fragmentShader: pageDrop,
  //     uniforms: {
  //       // iMouse: { x: 1.0, y: 1.0 },
  //       iMouse: { x: 0.0, y: 0.0, z: 0.0, w: 1.0 },
  //       direction: 0
  //     }
  //   })
  //   window.ppsCollection.add(loadPost)
  //   setTimeout(() => {
  //     window.ppsCollection.remove(loadPost)
  //     callback()
  //   }, time)
  // }
  // // 翻页网格效果
  // pageGridPost(time, callback) {
  //   let loadPost = new window.MSIMEarth.PostProcessStage({
  //     name: 'pageGrid',
  //     fragmentShader: pageGrid,
  //     uniforms: {
  //       // iMouse: { x: 1.0, y: 1.0 },
  //       iMouse: { x: 0.0, y: 0.0, z: 0.0, w: 1.0 },
  //       direction: 0
  //     }
  //   })
  //   window.ppsCollection.add(loadPost)
  //   setTimeout(() => {
  //     window.ppsCollection.remove(loadPost)
  //     callback()
  //   }, time)
  // }
  // // 全局高光效果
  // bloomAllPost(time, callback) {
  //   let loadPost = new window.MSIMEarth.PostProcessStage({
  //     name: 'bloomAll',
  //     fragmentShader: bloomAll,
  //     uniforms: {
  //       // iMouse: { x: 1.0, y: 1.0 },
  //       iMouse: { x: 0.0, y: 0.0, z: 0.0, w: 1.0 },
  //       direction: 0,
  //       bloomVal: 0.1
  //     }
  //   })
  //   window.ppsCollection.add(loadPost)
  //   setTimeout(() => {
  //     window.ppsCollection.remove(loadPost)
  //     callback()
  //   }, time)
  // }
  // 中印灾害数据展示
  add_ZYZH() {
    const options1 = {
      url: basicVectorData.zyzh_nishiliu,
      color: window.MSIMEarth.Color.YELLOW,
      addLabel: false,
      dataType: 'vector',
      geoType: 'point',
      width: 4,
      id: 'debris'
    }
    this.addGeojson(options1)
    const options2 = {
      url: basicVectorData.yzzh_huapo,
      color: window.MSIMEarth.Color.YELLOW,
      addLabel: false,
      dataType: 'vector',
      geoType: 'point',
      width: 4,
      id: 'landslide'
    }
    this.addGeojson(options2)
    const options3 = {
      url: basicVectorData.zyzh_dizhen,
      color: window.MSIMEarth.Color.YELLOW,
      addLabel: false,
      dataType: 'vector',
      geoType: 'point',
      width: 4,
      id: 'earthquake'
    }
    this.addGeojson(options3)
  }
  // 中印水纹湖泊冰川
  add_ZYRiver() {
    const options1 = {
      url: basicVectorData.zyRiver_link,
      color: window.MSIMEarth.Color.YELLOW,
      addLabel: false,
      dataType: 'vector',
      geoType: 'polyline',
      width: 4,
      id: 'zyRiver_link'
    }
    this.addGeojson(options1)
    // const options2 = {
    //   url: basicVectorData.zyWater_area,
    //   color: window.MSIMEarth.Color.YELLOW,
    //   addLabel: false,
    //   dataType: 'vector',
    //   geoType: 'polygon',
    //   width: 4,
    //   id: 'zyWater_area'
    // }
    // this.addGeojson(options2)
    // const options3 = {
    //   url: basicVectorData.zyGlacier,
    //   color: window.MSIMEarth.Color.YELLOW,
    //   addLabel: false,
    //   dataType: 'vector',
    //   geoType: 'polygon',
    //   width: 4,
    //   id: 'zyGlacier'
    // }
    // this.addGeojson(options3)
  }
  // 中印边界整体态势展示地点名
  add_ZYBJ() {
    zy_taishiPoints.forEach((item) => {
      window.EarthViewer.entities.add({
        position: window.MSIMEarth.Cartesian3.fromDegrees(
          item.coordinate[0],
          item.coordinate[1],
          100
        ),
        billboard: {
          image: 'static/image/billboard/省会2.png',
          show: true,
          width: 2,
          height: 2,
          rotation: 0.0,
          eyeOffset: new window.MSIMEarth.ConstantProperty(
            new window.MSIMEarth.Cartesian3(0, 0, -1)
          ),
          pixelOffset: new window.MSIMEarth.Cartesian2(0, -3),
          // pixelOffset: new window.MSIMEarth.Cartesian2(0.0, -20),
          scaleByDistance: new window.MSIMEarth.NearFarScalar(
            1.5e2,
            6.0,
            1.5e7,
            3.5
          ),
          distanceDisplayCondition:
            new window.MSIMEarth.DistanceDisplayCondition(0, 10e5),
          heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND
        },
        label: {
          text: item.name,
          font: '18px black',
          fillColor: window.MSIMEarth.Color.WHITE,
          style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
          horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
          verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
          pixelOffset: new window.MSIMEarth.Cartesian2(0, -40),
          outlineColor: window.MSIMEarth.Color.BLACK,
          outlineWidth: 2,
          // showBackground: true,
          backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
          heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND,
          distanceDisplayCondition:
            new window.MSIMEarth.DistanceDisplayCondition(0, 10e5)
        }
      })
    })
  }
  /**
   * 中印气象点位标注
   */
  add_ZYQixiangPositions() {
    // 印度河和狮泉河
    const options = {
      url: basicVectorData.ZY_qixiang_position,
      color: window.MSIMEarth.Color.YELLOW,
      addLabel: false,
      dataType: 'vector',
      geoType: 'point',
      width: 4,
      id: 'zy_QixiangPositions'
    }
    this.addGeojson(options)
  }
  /*****************************7月新数据 ******************************/
  /**
   * 添加等温线
   */
  add_dengwenxian() {
    var promise = window.MSIMEarth.GeoJsonDataSource.load(
      basicVectorData.dengwenxian
    )
    // console.log(options)
    // if (!options.geoType) return
    promise.then(function (dataSource) {
      // dataSource.name = options.id
      window.EarthViewer.dataSources.add(dataSource)
    })
  }
  /**
   * 降水
   */
  add_jiangshui() {
    var promise = window.MSIMEarth.GeoJsonDataSource.load(
      basicVectorData.jiangshui
    )
    // console.log(options)
    // if (!options.geoType) return
    promise.then(function (dataSource) {
      // dataSource.name = options.id
      console.log('dataSource :>> ', dataSource)
      window.EarthViewer.dataSources.add(dataSource)
    })
  }
  /**
   * 电厂
   */
  add_dianchang() {
    var promise = window.MSIMEarth.GeoJsonDataSource.load(
      basicVectorData.dianchang
    )
    // console.log(options)
    // if (!options.geoType) return
    promise.then(function (dataSource) {
      // dataSource.name = options.id
      console.log('dataSource :>> ', dataSource)
      dataSource.entities.values.forEach((ds) => {
        console.log(ds)
      })
      window.EarthViewer.dataSources.add(dataSource)
    })
  }
  add_taiwan_dem_vector() {
    let webmercator1 = new window.MSIMEarth.UrlTemplateImageryProvider({
      url: googleConfig.taiWanDem
      // minimumLevel: 0, //最小层级
      // maximumLevel: 18 //最大层级
    })
    webmercator1.name = '台湾地形'
    window.EarthViewer.imageryLayers.addImageryProvider(webmercator1)
  }
  add_taiwan_terrain_vector() {
    let webmercato1 = new window.MSIMEarth.UrlTemplateImageryProvider({
      url: googleConfig.taiWanTerrain
      // minimumLevel: 0, //最小层级
      // maximumLevel: 18 //最大层级
    })
    webmercato1.name = '台湾地势'
    window.EarthViewer.imageryLayers.addImageryProvider(webmercato1)
  }
  add_taiwan_soil_vector() {
    let webmercato1 = new window.MSIMEarth.UrlTemplateImageryProvider({
      url: googleConfig.taiWanSoil
      // minimumLevel: 0, //最小层级
      // maximumLevel: 18 //最大层级
    })
    webmercato1.name = '台湾土壤'
    window.EarthViewer.imageryLayers.addImageryProvider(webmercato1)
  }
  /**
   * 添加台湾一二级标注
   */
  add_twlabel() {
    let height = 500
    if (window.EarthViewer.scene.globe.depthTestAgainstTerrain) {
      height = 5000
    }
    taiwan12biaozhu.forEach((e) => {
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
  /**
   * 夜间灯光
   */
  add_YJDG() {
    // var bloom = window.EarthViewer.scene.postProcessStages.bloom
    // bloom.enabled = Boolean(viewModel.show)
    // bloom.uniforms.glowOnly = Boolean(viewModel.glowOnly)
    // bloom.uniforms.contrast = Number(viewModel.contrast)
    // bloom.uniforms.brightness = Number(viewModel.brightness)
    // bloom.uniforms.delta = Number(viewModel.delta)
    // bloom.uniforms.sigma = Number(viewModel.sigma)
    // bloom.uniforms.stepSize = Number(viewModel.stepSize)
    let color
    basicVectorData.yejiandengguang.forEach((dg) => {
      var promise = window.MSIMEarth.GeoJsonDataSource.load(dg.dgUrl)
      promise.then(function (dataSource) {
        dataSource.name = dg.name
        var entities = dataSource.entities.values
        for (let index = 0; index < entities.length; index++) {
          let en = entities[index]

          switch (en.properties.ContourMin._value) {
            case 10:
              color = new window.MSIMEarth.Color(0.9, 0.9, 0.9, 0.7)
              break
            case 30:
              color = new window.MSIMEarth.Color(0.92, 0.92, 0.92, 0.75)
              break
            case 40:
              color = new window.MSIMEarth.Color(0.94, 0.94, 0.94, 0.84)
              break
            case 50:
              color = new window.MSIMEarth.Color(0.96, 0.96, 0.96, 0.88)
              break
            case 60:
              color = new window.MSIMEarth.Color(0.98, 0.98, 0.98, 0.92)
              break
            default:
              color = new window.MSIMEarth.Color(0.99, 0.99, 0.99, 0.98)
              break
          }
          en.polygon.material = color
          en.polygon.outline = false
        }
        window.EarthViewer.dataSources.add(dataSource)
      })
    })
    basicVectorData.yejiandengguangLine.forEach((dg) => {
      var promise = window.MSIMEarth.GeoJsonDataSource.load(dg.dgUrl)
      promise.then(function (dataSource) {
        dataSource.name = dg.name
        var entities = dataSource.entities.values
        for (let index = 0; index < entities.length; index++) {
          let en = entities[index]

          switch (en.properties.ContourMin._value) {
            case 10:
              color = new window.MSIMEarth.Color(0.9, 0.9, 0.9, 0.7)
              break
            case 30:
              color = new window.MSIMEarth.Color(0.92, 0.92, 0.92, 0.75)
              break
            case 40:
              color = new window.MSIMEarth.Color(0.94, 0.94, 0.94, 0.84)
              break
            case 50:
              color = new window.MSIMEarth.Color(0.96, 0.96, 0.96, 0.88)
              break
            case 60:
              color = new window.MSIMEarth.Color(0.98, 0.98, 0.98, 0.92)
              break
            default:
              color = new window.MSIMEarth.Color(0.99, 0.99, 0.99, 0.98)
              break
          }
          // en.polyline.material = color
          en.polyline.material = new window.MSIMEarth.FlowLineMaterialProperty({
            transparent: true,
            mixColor: new window.MSIMEarth.Color(1.0, 1.0, 1.0, 1.0),
            // mixColor: color,
            mixRatio: 0.9,
            flowSpeed: 2.0,
            repeat: new window.MSIMEarth.Cartesian2(4, 4),
            image: require('@/assets/image/knowleadge/materialline.png')
          })
          en.polyline.width = 5
        }
        window.EarthViewer.dataSources.add(dataSource)
      })
    })
  }
  /**
   * 地图颜色控制
   */
  change_BaseLayerColor() {
    // 此处改成requestAnimationFrame动态变暗  展示完成后再恢复并移除cancelAnimationFrame
    let baseLayerConfig // = window.EarthViewer.imageryLayers.get(1)
    window.EarthViewer.imageryLayers._layers.forEach((e) => {
      if (e.imageryProvider.name === '影像底图服务') {
        baseLayerConfig = e
      }
    })
    baseLayerConfig.brightness = 0.42
    baseLayerConfig.contrast = 1.52
    baseLayerConfig.hue = 0.16
    baseLayerConfig.saturation = 1.58
    baseLayerConfig.gamma = 1.04
    // 获取图层
    // let targetLayer
    // window.EarthViewer.imageryLayers._layers.forEach((layer) => {
    //   if (layer.imageryProvider.name === '影像底图服务') {
    //     targetLayer = layer
    //   }
    // })

    // if (targetLayer) window.EarthViewer.imageryLayers.remove(targetLayer)

    // let imageryProvider = new window.MSIMEarth.UrlTemplateImageryProvider({
    //   url: googleConfig.url4,
    //   // tilingScheme: new window.MSIMEarth.WebMercatorTilingScheme() //url5
    //   tilingScheme: new window.MSIMEarth.GeographicTilingScheme() //url4
    // })
    // let layer =
    //   window.EarthViewer.imageryLayers.addImageryProvider(imageryProvider)

    // // 参数配置
    // const baseLayerController = new BaseLayerControl({
    //   bkColor: 'black',
    //   alpha: 0.5,
    //   invert: true
    // })
    // //rewrite requestImage method
    // const requestImage = layer.imageryProvider.requestImage
    // imageryProvider.requestImage = function (x, y, level, request) {
    //   var promise = requestImage.bind(imageryProvider)(x, y, level, request)
    //   if (promise) {
    //     promise = promise.then((image) => {
    //       var imageProcessed = baseLayerController.process(image)
    //       return imageProcessed || image
    //     })
    //   }
    //   return promise
    // }
  }
  /**
   * 按照给定的10条数据依次清除
   */
  clear_YJDG() {
    // 1 按照0-9顺序清除灯光数据
    let index = 0
    let st = setInterval(() => {
      let polygonName = basicVectorData.yejiandengguang[index].name
      let PolylineName = basicVectorData.yejiandengguangLine[index].name
      window.EarthViewer.dataSources._dataSources.forEach((e) => {
        if (e.name == polygonName) {
          window.EarthViewer.dataSources.remove(e)
        }
      })
      window.EarthViewer.dataSources._dataSources.forEach((e) => {
        if (e.name == PolylineName) {
          window.EarthViewer.dataSources.remove(e)
        }
      })
      index++
      if (index === 10) {
        clearInterval(st)
        setTimeout(() => {
          // 最好自然过度
          let baseLayerConfig // = window.EarthViewer.imageryLayers.get(1)
          window.EarthViewer.imageryLayers._layers.forEach((e) => {
            if (e.imageryProvider.name === '影像底图服务') {
              baseLayerConfig = e
            }
          })
          baseLayerConfig.brightness = 0.9
          baseLayerConfig.contrast = 1.0
          baseLayerConfig.hue = 0
          baseLayerConfig.saturation = 1.6
          baseLayerConfig.gamma = 0.6
        }, 1000)
      }
    }, 500)
    // requestAnimationFrame(clear_YJDG)
    //2 清除完毕后恢复底图配色，去除环境光
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
  // baseGif(e) {
  //   const viewer = window.EarthViewer
  //   let options = e
  //   let url = ''

  //   switch (options.type) {
  //     case 0:
  //       url = require('/public/static/image/gif/中雨.gif')
  //       break
  //     case 1:
  //       url = require('/public/static/image/gif/大雨.gif')
  //       break
  //     case 2:
  //       url = require('/public/static/image/gif/多云.gif')
  //       break
  //     case 3:
  //       url = require('/public/static/image/gif/晴.gif')
  //       break
  //     default:
  //       break
  //   }
  //   let gifDiv = document.createElement('div')
  //   let gifImg = document.createElement('img')
  //   // gif库需要img标签配置下面两个属性
  //   gifImg.setAttribute('rel:animated_src', url)
  //   gifImg.setAttribute('rel:auto_play', '1') // 设置自动播放属性 118.34573072478551 32.25604843382856
  //   gifDiv.appendChild(gifImg)

  //   let superGif = new SuperGif({
  //     gif: gifImg
  //   })
  //   viewer.entities.removeById(e.name + 'gifff')
  //   superGif.load(function () {
  //     viewer.entities.add({
  //       id: e.name + 'gifff',
  //       position: window.MSIMEarth.Cartesian3.fromDegrees(
  //         e.position[0],
  //         e.position[1],
  //         3000
  //       ),
  //       billboard: {
  //         image: new window.MSIMEarth.CallbackProperty(() => {
  //           // 转成base64,直接加canvas理论上是可以的，这里设置有问题
  //           return superGif.get_canvas().toDataURL()
  //         }, false),
  //         scale: 0.5,
  //         // pixelOffset: new window.MSIMEarth.Cartesian2(-73, -38),
  //         pixelOffset: new window.MSIMEarth.Cartesian2(20, 0),
  //         eyeOffset: new window.MSIMEarth.Cartesian3(0, 0, -2)
  //       }
  //     })
  //   })
  // }
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
  // T矢量底图标注
  addTLayer() {
    const tiandituTk = '7711a24780452f03bb7c02fba98183b9'
    const vec = 'vec'
    const cva = 'cva'
    // 添加天地图影像底图
    const tMapImagery = new window.MSIMEarth.WebMapTileServiceImageryProvider({
      url: `http://t0.tianditu.gov.cn/${vec}_w/wmts?tk=${tiandituTk}`,
      layer: vec,
      style: 'default',
      tileMatrixSetID: 'w',
      format: 'tiles',
      maximumLevel: 18
    })
    tMapImagery.hue = 3
    tMapImagery.contrast = -1.2
    window.EarthViewer.imageryLayers.addImageryProvider(tMapImagery)
    // 添加注记底图
    const tMapImagery2 = new window.MSIMEarth.WebMapTileServiceImageryProvider({
      url: `http://t0.tianditu.gov.cn/${cva}_w/wmts?tk=${tiandituTk}`,
      layer: cva,
      style: 'default',
      tileMatrixSetID: 'w',
      format: 'tiles',
      maximumLevel: 18
    })
    window.EarthViewer.imageryLayers.addImageryProvider(tMapImagery2)
  }

  /**
   * 添加bing全球高清影像
   */
  addbingLayer() {
    let addLayer = true
    // 便利当前底图集合，如果已经存在bing底图则切换为显示
    window.EarthViewer.imageryLayers._layers.forEach((layer) => {
      if (layer.imageryProvider && layer.imageryProvider.name === 'bing底图') {
        layer.show = true
        addLayer = false
      }
    })
    // 如果当前没有添加过全球矢量地图则添加
    if (addLayer) {
      let bingProvider = new window.MSIMEarth.UrlTemplateImageryProvider({
        url: layersUrlConfig.urlB,
        tilingScheme: new window.MSIMEarth.WebMercatorTilingScheme() //WebMercatorTilingScheme() //GeographicTilingScheme()
      })
      bingProvider.name = 'bing底图'
      let bingLayer =
        window.EarthViewer.imageryLayers.addImageryProvider(bingProvider)
      bingLayer.show = true
      bingLayer.brightness = 1.5 //0.9 1.52
      bingLayer.contrast = 1.0
      bingLayer.hue = 0
      bingLayer.saturation = 1.6
      bingLayer.gamma = 0.7 //0.6 0.7
      // let baseLayerBZ = new window.MSIMEarth.UrlTemplateImageryProvider({
      //   url: layersUrlConfig.urlVBlackMap
      // })

      // baseLayerBZ.name = 'bing底图标注'
      // window.EarthViewer.imageryLayers.addImageryProvider(baseLayerBZ)
      // window.cameraListener2 = function () {
      //   var e = window.EarthViewer.camera.position
      //   if (window.MSIMEarth.Cartographic.fromCartesian(e).height < 80000) {
      //     // 显示自定义的天空盒
      //     bingLayer.show = true
      //   } else {
      //     bingLayer.show = false
      //   }
      // }
      // window.EarthViewer.camera.changed.addEventListener(window.cameraListener2)
    }
  }
  /**
   * 添加西安发布的区域高清影像
   */
  addXiAnAreaLayer() {
    let addLayer = true
    let addLayer2 = true
    // 便利当前底图集合，如果已经存在bing底图则切换为显示
    window.EarthViewer.imageryLayers._layers.forEach((layer) => {
      if (
        layer.imageryProvider.name === '齐齐哈尔机场' ||
        layer.imageryProvider.name === '拉林机场'
      ) {
        layer.show = true
        addLayer = false
        addLayer2 = false
      }
    })
    // 如果当前没有添加过全球矢量地图则添加
    if (addLayer) {
      let baseLayerBZ = new window.MSIMEarth.UrlTemplateImageryProvider({
        url: layersUrlConfig.urlVBlackMap
      })
      baseLayerBZ.name = '齐齐哈尔机场'
      window.EarthViewer.imageryLayers.addImageryProvider(baseLayerBZ)
    }

    if (addLayer) {
      let baseLayerXiAnAreaMap1 =
        new window.MSIMEarth.UrlTemplateImageryProvider({
          url: layersUrlConfig.urlXiAnAreaMap1,
          tilingScheme: new window.MSIMEarth.WebMercatorTilingScheme() //GeographicTilingScheme()
        })
      baseLayerXiAnAreaMap1.name = '拉林机场'
      window.EarthViewer.imageryLayers.addImageryProvider(baseLayerXiAnAreaMap1)
    }
  }
  /**
   * 添加西安发布的晕眩图
   */
  addXiAnYunXuanLayer() {
    let addLayer = true
    // 便利当前底图集合，如果已经存在bing底图则切换为显示
    window.EarthViewer.imageryLayers._layers.forEach((layer) => {
      if (layer.imageryProvider.name === '全球晕眩图') {
        layer.show = true
        addLayer = false
      }
    })
    // 如果当前没有添加过全球矢量地图则添加
    if (addLayer) {
      let baseLayerBZ = new window.MSIMEarth.UrlTemplateImageryProvider({
        url: layersUrlConfig.urlXiAnYunXuanMap
      })
      baseLayerBZ.name = '全球晕眩图'
      let XYlayer =
        window.EarthViewer.imageryLayers.addImageryProvider(baseLayerBZ)
      XYlayer.show = true
      XYlayer.brightness = 0.8 //0.9 1.52
      XYlayer.contrast = 1.2
      XYlayer.hue = 0.1
      XYlayer.saturation = 1.3
      XYlayer.gamma = 0.6 //0.6 0.7
    }
  }
  /**
   * 添加瓦片图层服务
   * url:图层服务地址；name：图层名称
   */
  addImagerServer(url, name) {
    let addLayer = true
    // 便利当前底图集合，如果已经存在则切换为显示
    window.EarthViewer.imageryLayers._layers.forEach((layer) => {
      if (layer.imageryProvider.name === name) {
        layer.show = true
        addLayer = false
      }
    })
    // 如果当前没有添加过地图则添加
    if (addLayer) {
      let baseLayerBZ = new window.MSIMEarth.UrlTemplateImageryProvider({
        url: url
      })
      baseLayerBZ.name = name
      window.EarthViewer.imageryLayers.addImageryProvider(baseLayerBZ)
    }
  }
  /**
   * 添加西安发布矢量深色底图
   */
  addBlackMapUrlLayer() {
    let addLayer = true
    // 便利当前底图集合，如果已经存在bing底图则切换为显示
    window.EarthViewer.imageryLayers._layers.forEach((layer) => {
      if (layer.imageryProvider.name === '矢量深色底图') {
        layer.show = true
        addLayer = false
      }
    })
    // 如果当前没有添加过全球矢量地图则添加
    if (addLayer) {
      let xiAnBlackMapProvider =
        new window.MSIMEarth.UrlTemplateImageryProvider({
          url: layersUrlConfig.xiAnBlackMapUrl
        })
      xiAnBlackMapProvider.name = '矢量深色底图'
      let xiAnBlackMapLayer =
        window.EarthViewer.imageryLayers.addImageryProvider(
          xiAnBlackMapProvider
        )
      xiAnBlackMapLayer.show = true
      xiAnBlackMapLayer.brightness = 1.5 //0.9 1.52
      xiAnBlackMapLayer.contrast = 1.0
      xiAnBlackMapLayer.hue = 0
      xiAnBlackMapLayer.saturation = 1.6
      xiAnBlackMapLayer.gamma = 0.7 //0.6 0.7
    }
  }

  // baseMapVec
  /**
   * 添加西安发布矢量深色底图
   */
  addRoadVecMapLayer() {
    let addLayer = true
    // 便利当前底图集合，如果已经存在bing底图则切换为显示
    window.EarthViewer.imageryLayers._layers.forEach((layer) => {
      if (layer.imageryProvider.name === '路网底图') {
        layer.show = true
        addLayer = false
      }
    })
    // 如果当前没有添加过全球矢量地图则添加
    if (addLayer) {
      let xiAnBlackMapProvider =
        new window.MSIMEarth.UrlTemplateImageryProvider({
          url: layersUrlConfig.urlBaseMapVec
        })
      xiAnBlackMapProvider.name = '路网底图'
      let xiAnBlackMapLayer =
        window.EarthViewer.imageryLayers.addImageryProvider(
          xiAnBlackMapProvider
        )
      xiAnBlackMapLayer.show = true
      xiAnBlackMapLayer.brightness = 1.5 //0.9 1.52
      xiAnBlackMapLayer.contrast = 1.0
      xiAnBlackMapLayer.hue = 0
      xiAnBlackMapLayer.saturation = 1.6
      xiAnBlackMapLayer.gamma = 0.7 //0.6 0.7
    }
  }
  /**
   * bing全球高清影像  与 全球矢量底图 切换
   * 默认 全球矢量底图
   */
  toogleEarthFun(layertoogle) {
    if (layertoogle) {
      // 切换 bing
      window.EarthViewer.imageryLayers._layers.forEach((layer) => {
        if (layer.imageryProvider.name === 'bing底图') {
          layer.show = true
          window.EarthViewer.imageryLayers.raiseToTop(layer)
        }
        if (layer.imageryProvider.name === '全球矢量底图') {
          layer.show = false
        }
      })
    } else {
      // 切换 全球矢量底图
      window.EarthViewer.imageryLayers._layers.forEach((layer) => {
        if (layer.imageryProvider.name === 'bing底图') {
          layer.show = false
        }
        if (layer.imageryProvider.name === '全球矢量底图') {
          layer.show = true
          window.EarthViewer.imageryLayers.raiseToTop(layer)
        }
      })
    }
  }
  /**
   * 添加矢量底图
   */
  addVectorLayer() {
    let addLayer = true
    // 便利当前底图集合，如果已经存在全球矢量底图则切换为显示
    window.EarthViewer.imageryLayers._layers.forEach((layer) => {
      if (layer.imageryProvider && layer.imageryProvider.name === '全球矢量底图') {
        layer.show = true
        addLayer = false
      }
    })
    // 如果当前没有添加过全球矢量地图则添加
    if (addLayer) {
      let baseLayer = new window.MSIMEarth.UrlTemplateImageryProvider({
        url: layersUrlConfig.urlWindy
        // tilingScheme: new window.MSIMEarth.GeographicTilingScheme()
      })
      baseLayer.name = '全球矢量底图'
      window.EarthViewer.imageryLayers.addImageryProvider(baseLayer)
      // let baseLayer2 = new window.MSIMEarth.UrlTemplateImageryProvider({
      //   url: layersUrlConfig.urlGlobalVectorMap2
      //   // tilingScheme: new window.MSIMEarth.GeographicTilingScheme()
      // })
      // baseLayer2.name = '全球矢量底图2'
      // let imgLayer =
      //   window.EarthViewer.imageryLayers.addImageryProvider(baseLayer2)
      // imgLayer.brightness = 0.7
      // imgLayer.contrast = 1.06
      // imgLayer.hue = 0
      // imgLayer.saturation = 1.82
      // imgLayer.gamma = 0.64
    }
  }
  /**
   * 添加矢量底图带标注
   */
  addVectorLayer2() {
    let addLayer = true
    // 便利当前底图集合，如果已经存在全球矢量底图则切换为显示
    window.EarthViewer.imageryLayers._layers.forEach((layer) => {
      if (layer.imageryProvider && layer.imageryProvider.name === '全球矢量底图2') {
        layer.show = true
        addLayer = false
      }
    })
    // 如果当前没有添加过全球矢量地图则添加
    if (addLayer) {
      let baseLayer = new window.MSIMEarth.UrlTemplateImageryProvider({
        url: layersUrlConfig.urlWindy2
        // tilingScheme: new window.MSIMEarth.GeographicTilingScheme()
      })
      baseLayer.name = '全球矢量底图2'
      window.EarthViewer.imageryLayers.addImageryProvider(baseLayer)
    }
  }
  /**
 * 添加暗色矢量底图
 */
  addVectorLayerDark() {
    let addLayer = true
    // 便利当前底图集合，如果已经存在全球矢量底图则切换为显示
    window.EarthViewer.imageryLayers._layers.forEach((layer) => {
      if (layer.imageryProvider && layer.imageryProvider.name === '全球矢量底图3') {
        layer.show = true
        addLayer = false
      }
    })
    // 如果当前没有添加过全球矢量地图则添加
    if (addLayer) {
      let baseLayer = new window.MSIMEarth.UrlTemplateImageryProvider({
        url: layersUrlConfig.urlWindy3
        // tilingScheme: new window.MSIMEarth.GeographicTilingScheme()
      })
      baseLayer.name = '全球矢量底图3'
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
  removeLaer(layerNmae) {
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
  // 机场标注-天气
  addAirportWeather() {
    airport.forEach((e) => {
      // 图片材质
      let imgMaterial = ''
      let image = ''
      switch (e.type) {
        case 1:
          {
            switch (e.status) {
              case '0':
                image = './static/image/billboard/0_R.png'
                break
              case '1':
                image = './static/image/billboard/2_R.png'
                break
              case '2':
                image = './static/image/billboard/3_R.png'
                break
              case '3':
                image = './static/image/billboard/4_R.png'
                break
              case '4':
                image = './static/image/billboard/6_R.png'
                break
              case '5':
                image = './static/image/billboard/8_R.png'
                break
              default:
                break
            }
          }
          break
        case 2:
          {
            switch (e.status) {
              case '0':
                image = './static/image/billboard/0_B.png'
                break
              case '1':
                image = './static/image/billboard/2_B.png'
                break
              case '2':
                image = './static/image/billboard/3_B.png'
                break
              case '3':
                image = './static/image/billboard/4_B.png'
                break
              case '4':
                image = './static/image/billboard/6_B.png'
                break
              case '5':
                image = './static/image/billboard/8_B.png'
                break
              default:
                break
            }
          }
          break
      }

      let center = window.MSIMEarth.Cartesian3.fromDegrees(e.lng, e.lat, 100)
      var heading = -window.MSIMEarth.Math.PI_OVER_TWO
      var pitch = window.MSIMEarth.Math.PI_OVER_FOUR
      var roll = 0.0
      var hpr = new window.MSIMEarth.HeadingPitchRoll(heading, pitch, roll)
      var quaternion = window.MSIMEarth.Transforms.headingPitchRollQuaternion(
        center,
        hpr
      )
      //let rotation = Math.random() * 360 - 180
      let rotation = e.rd
      window.EarthViewer.entities.removeById(e.airportName)
      window.EarthViewer.entities.add({
        name: 'weatherAnalysis',
        id: e.airportName,
        position: center,
        orientation: quaternion,
        properties: {
          weather: e.weatherDesc,
          temperature: e.temperature,
          description: e.stationWeatherDesc
        },
        billboard: {
          image: image,
          show: true,
          width: 10,
          height: 10,
          eyeOffset: new window.MSIMEarth.ConstantProperty(
            new window.MSIMEarth.Cartesian3(0, 0, -10)
          ),
          pixelOffset: new window.MSIMEarth.Cartesian2(0, -35),
          scale: 3,
          distanceDisplayCondition:
            new window.MSIMEarth.DistanceDisplayCondition(0, 30e5)
        },
        label: {
          text: e.airportName,
          font: '14px Lucida Console',
          fillColor: window.MSIMEarth.Color.BLACK,
          style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
          horizontalOrigin: window.MSIMEarth.HorizontalOrigin.CENTER,
          verticalOrigin: window.MSIMEarth.VerticalOrigin.TOP,
          pixelOffset: new window.MSIMEarth.Cartesian2(0, -17),
          outlineColor: window.MSIMEarth.Color.WHITE,
          outlineWidth: 3,
          eyeOffset: new window.MSIMEarth.ConstantProperty(
            new window.MSIMEarth.Cartesian3(0, 0, -12)
          ),
          distanceDisplayCondition:
            new window.MSIMEarth.DistanceDisplayCondition(0, 30e5)
        }
      })
    })
  }
  //清除标注-天气
  removeAirportWeather() {
    airport.forEach((e) => {
      window.EarthViewer.entities.removeById(e.airportName)
    })
  }
  //添加北斗卫星轨道数据
  addBeiDou() {
    if (EarthViewer.dataSources.getByName('simple').length > 0) {
      EarthViewer.dataSources.getByName('simple')[0].show = true
    } else {
      let czmlData = require('/public/static/data/czml/czmlArray.js')
      LoadSatellitByCzml(czmlData.starlinkCZML2)
    }
  }
  //隐藏北斗卫星
  removeBeiDou() {
    if (EarthViewer.dataSources.getByName('simple').length > 0) {
      EarthViewer.dataSources.getByName('simple')[0].show = false
    }
  }
  /**
   * 加载雷达探测图层
   */
  addleidaganrao(param) {
    let viewer = this.viewer || window.EarthViewer
    let earth = this.earth || window.MSIMEarth
    let position = new earth.Cartesian3.fromDegrees(121.61619, 23.983558)
    let imgUrl =
      'static/image/texture/leida/20240304083445_pd_118_126_20_28_三部雷达一起_高分辨率.png'
    switch (param) {
      case 0:
        imgUrl =
          'static/image/texture/leida/20240304083445_pd_118_126_20_28_三部雷达一起_高分辨率.png'
        position = new earth.Cartesian3.fromDegrees(121.61619, 23.983558)
        // 三合一雷达图，需要添加两外两个雷达目标
        viewer.entities.add({
          id: 'leidaganrao1_2',
          position: new earth.Cartesian3.fromDegrees(121.610147, 24.064019),
          billboard: {
            distanceDisplayCondition: new earth.DistanceDisplayCondition(
              0,
              // 2e5
              100e5
            ),
            image: 'static/image/billboard/路基常规对空情报雷达b.png',
            name: 'singleWarning',
            show: true,
            width: 3,
            height: 3,
            // alignedAxis: new window.MSIMEarth.Cartesian3(10, 0, 0),
            eyeOffset: new earth.ConstantProperty(
              new earth.Cartesian3(0, 0, -1)
            ),
            // sizeInMeters: true, //图像的尺寸被指定成图像实际的尺寸
            // pixelOffset: new window.MSIMEarth.Cartesian2(0.0, 0),
            // position: window.MSIMEarth.Cartesian3.fromDegrees(116.2, 39.53, 15),
            //   distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(0, 6.8e10),
            // verticalOrigin: window.MSIMEarth.VerticalOrigin.TOP,
            scale: 1,
            scaleByDistance: new window.MSIMEarth.NearFarScalar(
              1.5e2,
              6.0,
              1.5e7,
              3.5
            )
            // disableDepthTestDistance: Number.POSITIVE_INFINITY, //防止深度测试导致的遮挡 默认为0会遮挡
          },
          label: {
            distanceDisplayCondition: new earth.DistanceDisplayCondition(
              0,
              // 2e5
              30e5
            ),
            text: '地面雷达',
            // backgroundColor: new window.MSIMEarth.Color(1.0, 153 / 255, 18 / 255, 1.0),
            // showBackground: false,
            font: 'normal 32px MicroSoft YaHei',
            scale: 0.4,
            fillColor: earth.Color.BLUE,
            style: earth.LabelStyle.FILL_AND_OUTLINE,
            horizontalOrigin: earth.HorizontalOrigin.LEFT, //水平位置
            verticalOrigin: earth.VerticalOrigin.BOTTOM,
            pixelOffset: new earth.Cartesian2(-20, -15),
            eyeOffset: new earth.ConstantProperty(
              new earth.Cartesian3(0, 0, -1)
            )
          }
        })
        viewer.entities.add({
          id: 'leidaganrao1_3',
          position: new earth.Cartesian3.fromDegrees(121.592024, 23.999455),
          billboard: {
            distanceDisplayCondition: new earth.DistanceDisplayCondition(
              0,
              // 2e5
              100e5
            ),
            image: 'static/image/billboard/路基常规对空情报雷达b.png',
            name: 'singleWarning',
            show: true,
            width: 3,
            height: 3,
            // alignedAxis: new window.MSIMEarth.Cartesian3(10, 0, 0),
            eyeOffset: new earth.ConstantProperty(
              new earth.Cartesian3(0, 0, -1)
            ),
            // sizeInMeters: true, //图像的尺寸被指定成图像实际的尺寸
            // pixelOffset: new window.MSIMEarth.Cartesian2(0.0, 0),
            // position: window.MSIMEarth.Cartesian3.fromDegrees(116.2, 39.53, 15),
            //   distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(0, 6.8e10),
            // verticalOrigin: window.MSIMEarth.VerticalOrigin.TOP,
            scale: 1,
            scaleByDistance: new window.MSIMEarth.NearFarScalar(
              1.5e2,
              6.0,
              1.5e7,
              3.5
            )
            // disableDepthTestDistance: Number.POSITIVE_INFINITY, //防止深度测试导致的遮挡 默认为0会遮挡
          },
          label: {
            distanceDisplayCondition: new earth.DistanceDisplayCondition(
              0,
              // 2e5
              30e5
            ),
            text: '地面雷达',
            // backgroundColor: new window.MSIMEarth.Color(1.0, 153 / 255, 18 / 255, 1.0),
            // showBackground: false,
            font: 'normal 32px MicroSoft YaHei',
            scale: 0.4,
            fillColor: earth.Color.BLUE,
            style: earth.LabelStyle.FILL_AND_OUTLINE,
            horizontalOrigin: earth.HorizontalOrigin.LEFT, //水平位置
            verticalOrigin: earth.VerticalOrigin.BOTTOM,
            pixelOffset: new earth.Cartesian2(-20, -15),
            eyeOffset: new earth.ConstantProperty(
              new earth.Cartesian3(0, 0, -1)
            )
          }
        })
        break
      case 1:
        imgUrl =
          'static/image/texture/leida/20240304084227_200_pd_118_126_20_28_24.064019n_121.610147e.png'
        position = new earth.Cartesian3.fromDegrees(121.610147, 24.064019)
        break
      case 2:
        imgUrl =
          'static/image/texture/leida/20240304104209_3510_pd_118_126_20_28_23.999455n_121.592024e.png'
        position = new earth.Cartesian3.fromDegrees(121.592024, 23.999455)
        break
      default:
        break
    }
    viewer.entities.add({
      id: 'leidaganrao1',
      name: '受干扰的雷达区域',
      position: position,
      rectangle: {
        coordinates: earth.Rectangle.fromDegrees(118.0, 20.0, 126.0, 28.0),
        material: imgUrl,
        // rotation: new earth.CallbackProperty(getRotationValue, false),
        // stRotation: new earth.CallbackProperty(getRotationValue, false),
        classificationType: earth.ClassificationType.TERRAIN
      },
      billboard: {
        distanceDisplayCondition: new earth.DistanceDisplayCondition(
          0,
          // 2e5
          100e5
        ),
        image: 'static/image/billboard/路基常规对空情报雷达b.png',
        name: 'singleWarning',
        show: true,
        width: 3,
        height: 3,
        // alignedAxis: new window.MSIMEarth.Cartesian3(10, 0, 0),
        eyeOffset: new earth.ConstantProperty(new earth.Cartesian3(0, 0, -1)),
        // sizeInMeters: true, //图像的尺寸被指定成图像实际的尺寸
        // pixelOffset: new window.MSIMEarth.Cartesian2(0.0, 0),
        // position: window.MSIMEarth.Cartesian3.fromDegrees(116.2, 39.53, 15),
        //   distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(0, 6.8e10),
        // verticalOrigin: window.MSIMEarth.VerticalOrigin.TOP,
        scale: 1,
        scaleByDistance: new window.MSIMEarth.NearFarScalar(
          1.5e2,
          6.0,
          1.5e7,
          3.5
        )
        // disableDepthTestDistance: Number.POSITIVE_INFINITY, //防止深度测试导致的遮挡 默认为0会遮挡
      },
      label: {
        distanceDisplayCondition: new earth.DistanceDisplayCondition(
          0,
          // 2e5
          30e5
        ),
        text: '地面雷达',
        // backgroundColor: new window.MSIMEarth.Color(1.0, 153 / 255, 18 / 255, 1.0),
        // showBackground: false,
        font: 'normal 32px MicroSoft YaHei',
        scale: 0.4,
        fillColor: earth.Color.BLUE,
        style: earth.LabelStyle.FILL_AND_OUTLINE,
        horizontalOrigin: earth.HorizontalOrigin.LEFT, //水平位置
        verticalOrigin: earth.VerticalOrigin.BOTTOM,
        pixelOffset: new earth.Cartesian2(-20, -15),
        eyeOffset: new earth.ConstantProperty(new earth.Cartesian3(0, 0, -1))
      }
    })
  }
  /**
   * 卸载雷达探测图层
   */
  removeLeidaganrao() {
    let viewer = this.viewer || window.EarthViewer
    viewer.entities.removeById('leidaganrao1')
    viewer.entities.removeById('leidaganrao1_2')
    viewer.entities.removeById('leidaganrao1_3')
    viewer.entities.removeById('leidaganrao2')
    viewer.entities.removeById('leidaganrao3')
  }
  /*
  加载雷达矢量数据
  */
  addleidashiliang() {
    var promise = window.MSIMEarth.GeoJsonDataSource.load(
      './static/data/geojson/leidashiliang.json'
    )
    promise.then(function (dataSource) {
      window.EarthViewer.dataSources.add(dataSource)
      dataSource.name = 'leidashiliang'
      dataSource.id = 'leidashiliang'
      var entities = dataSource.entities.values
      for (let i = 0; i < entities.length; i++) {
        let entity = entities[i]
        entity.polygon.material = new window.MSIMEarth.Color(0.6, 0.7, 0.8, 0.3)
        entity.polygon.outlineColor = new window.MSIMEarth.Color(
          0.8,
          0.8,
          0.8,
          1.0
        )
        entity.polygon.outlineWidth = 5
      }
    })
  }
  // 添加天气区域降水
  addGeojsonAreaWeather(options) {
    window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
      if (dataSource._name == options.id) {
        window.EarthViewer.dataSources.remove(dataSource)
      }
    })
    var promise = window.MSIMEarth.GeoJsonDataSource.load(options.url)
    promise.then(function (dataSource) {
      window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
        if (dataSource._name == options.id) {
          window.EarthViewer.dataSources.remove(dataSource)
        }
      })
      dataSource.name = options.id
      // var entities = dataSource.entities.values
      // for (let i = 0; i < entities.length; i++) {
      //   let entity = entities[i]
      //   if (entity.polygon) {
      //     let fillColor = entity.properties.fill.getValue()
      //     let fill0pacity = entity.properties['fill-opacity'].getValue()
      //     if (localStorage.getItem('side') == 'admin') {
      //       fill0pacity = 0.3
      //     }
      //     entity.polygon.material =
      //       MSIMEarth.Color.fromCssColorString(fillColor).withAlpha(fill0pacity)
      //     entity.polygon.height.setValue(VisParams.vectorDataHeight)
      //     entity.polygon.perPositionHeight = false
      //     // entity.polygon.heightReference= window.MSIMEarth.HeightReference.CLAMP_TO_GROUND
      //     // entity.polygon._classificationType = window.MSIMEarth.ClassificationType.TERRAIN
      //   }
      // }
      window.EarthViewer.dataSources.add(dataSource)
    })
  }
  //添加机场静态数据
  addAirports() {
    airPorts.forEach((value) => {
      addStaticEntity(value)
    })
    function addStaticEntity(param) {
      let imageParams = {}
      if (param.side == 'blue')
        imageParams.imageUrl = './static/image/billboard/静态目标/机场B.png'
      else imageParams.imageUrl = './static/image/billboard/静态目标/机场R.png'
      imageParams.scale = 0.5
      // = new window.MSIMEarth.Color(1.0, 0, 0, 1.0)
      if (store.state.sceneModule.showJB) {
        if (param.side == 'blue')
          imageParams.imageUrl = './static/image/TOPNG/blue/60101_四级机场B.png'
        else
          imageParams.imageUrl = './static/image/TOPNG/red/60101_四级机场R.png'
        imageParams.scale = 1.0
      }
      let outColor = null
      if (param.side == 'blue')
        outColor = new window.MSIMEarth.Color(0, 0, 1.0, 1.0)
      else if (param.side == 'red')
        outColor = new window.MSIMEarth.Color(1.0, 0, 0, 1.0)
      else outColor = new window.MSIMEarth.Color(0.0, 1.0, 1.0, 1.0)
      let entitiesData = {
        id: param.name,
        position: new window.MSIMEarth.Cartesian3.fromDegrees(
          param.lon,
          param.lat,
          param.alt + 1000
        ),
        label: {
          text: param.labelName,
          font: 'normal 29px MicroSoft YaHei',
          scale: 0.5,
          // fillColor: color,
          outlineColor: outColor,
          outlineWidth: 3,
          style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
          horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT, //水平位置
          verticalOrigin: window.MSIMEarth.VerticalOrigin.BOTTOM,
          pixelOffset: new window.MSIMEarth.Cartesian2(-33, -21),
          eyeOffset: new window.MSIMEarth.ConstantProperty(
            new window.MSIMEarth.Cartesian3(0, 0, -11)
          ),
          // distanceDisplayCondition:
          //   new window.MSIMEarth.DistanceDisplayCondition(1000, 6e5), //20e5
          distanceDisplayCondition:
            new window.MSIMEarth.DistanceDisplayCondition(10, 70e5),
          heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        },
        billboard: {
          image: imageParams.imageUrl,
          scale: imageParams.scale,
          distanceDisplayCondition:
            new window.MSIMEarth.DistanceDisplayCondition(10, 60e5)
        }
      }
      // 单个实体形式
      if (window.EarthViewer.entities.getById(param.name))
        window.EarthViewer.entities.removeById(param.name)
      window.EarthViewer.entities.add(entitiesData)
    }
  }
  // 添加 作战区域 数据
  addGeojsonByOperationalAreaFile(options, visible) {
    return
  }

  // 添加空域 数据
  addGeojsonByKyAreaFile(options, visible) {
    window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
      if (dataSource._name == options.id) {
        if (options.backLoad) {
          window.EarthViewer.dataSources.remove(dataSource)
        } else {
          var entities = dataSource.entities.values
          for (let i = 0; i < entities.length; i++) {
            let entity = entities[i]
            if (entity.label) {
              entity.label.show = visible
            }
            if (entity.billboard) {
              entity.billboard.show = visible
            }
            if (entity.polyline) {
              entity.polyline.show = visible
            }
            if (entity.polygon) {
              entity.polygon.show = visible
            }
          }
        }
      }
    })
    if (!options.backLoad) return
    var promise = window.MSIMEarth.GeoJsonDataSource.load(options.url)
    promise.then(function (dataSource) {
      window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
        if (dataSource._name == options.id) {
          window.EarthViewer.dataSources.remove(dataSource)
        }
      })
      dataSource.name = options.id
      var entities = dataSource.entities.values
      for (let i = 0; i < entities.length; i++) {
        let entity = entities[i]
        // point===>billboard 改为 lable
        if (entity.billboard) {
          if (entity.properties['color']) {
            let fillColor = entity.properties['color'].getValue()
            entity.label = {
              text: entity.properties.label._value,
              font: '22px black',
              fillColor: MSIMEarth.Color.fromCssColorString(fillColor),
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
                window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND
            }
          }
          entity.billboard = undefined
          entity['description'] = undefined
        }
        // 区域
        if (entity.polygon) {
          if (entity.properties['color']) {
            let fillColor = entity.properties['color'].getValue()
            let fill0pacity = entity.properties['opacity']
              ? entity.properties['opacity'].getValue()
              : 0.1
            entity.polygon.material =
              MSIMEarth.Color.fromCssColorString(fillColor).withAlpha(
                fill0pacity
              )
            // entity.polygon['height'].setValue(VisParams.vectorDataHeight)
            entity.polygon['perPositionHeight'] = false
            entity.polygon.show = visible
          }
          if (entity.properties['lineWidth']) {
            let lineWidth = entity.properties['lineWidth'].getValue()
            entity.polygon.outline = true
            entity.polygon.outlineWidth = lineWidth
            entity.polygon.outlineColor = MSIMEarth.Color.fromCssColorString(
              entity.properties['color'].getValue()
            )
          }
        }
        // 线段
        if (entity.polyline) {
          entity.polyline.material = MSIMEarth.Color.fromCssColorString(
            entity.properties['color'].getValue()
          )
          let lineWidth = entity.properties['lineWidth'].getValue()
          entity.polyline.width = lineWidth
          entity.polyline.clampToGround = true
        }
      }
      window.EarthViewer.dataSources.add(dataSource)
    })
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
   * 添加雷达遮罩
   */
  addRadarEllipse() {
    let names = ['10_soc_cmdr', '3500_large_sam_battalion']
    let farDis = 55500
    names.forEach((name) => {
      //显示半球效果
      const entityMethod = new window.EarthPlugn.entity({
        earth: window.MSIMEarth,
        viewer: window.EarthViewer
      })
      let entity = entityMethod.getCZMLEntity(
        name,
        'MSIMEarthCZMLProcessContainer'
      )
      if (!entity || !entity.position) return
      if (!farDis) return
      let changePositions = function () {
        let updateEntity = entityMethod.getCZMLEntity(
          name,
          'MSIMEarthCZMLProcessContainer'
        )
        if (!updateEntity) return
        let YGPosition = updateEntity.position.getValue(
          window.EarthViewer.clock.currentTime
        )
        if (!window.MSIMEarth.defined(YGPosition)) return
        return YGPosition
      }
      let radarEllipsoid = EarthViewer.entities.add({
        id: name + '-ellipsoidEntity',
        position: new window.MSIMEarth.CallbackProperty(changePositions, false),
        ellipsoid: {
          radii: new MSIMEarth.Cartesian3(farDis, farDis, farDis),
          maximumCone: MSIMEarth.Math.PI_OVER_TWO,
          material: new window.MSIMEarth.Color(
            55 / 255,
            55 / 255,
            255 / 255,
            0.1
          ),
          fill: true,
          outline: true,
          outlineColor: new window.MSIMEarth.Color(
            55 / 255,
            55 / 255,
            255 / 255,
            0.2
          ),
          outlineWidth: 0.1
        }
      })
    })
  }
  /**
   * 移除雷达遮罩
   */
  removeRadarEllipse() {
    let names = ['10_soc_cmdr', '3500_large_sam_battalion']
    names.forEach((name) => {
      window.EarthViewer.entities.removeById(name)
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
    // window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
    //   if (dataSource._name == options.id) {
    //     window.EarthViewer.dataSources.remove(dataSource)
    //   }
    // })

    // var promise = window.MSIMEarth.GeoJsonDataSource.load(options.url)
    // promise.then(function (dataSource) {
    //   window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
    //     if (dataSource._name == options.id) {
    //       window.EarthViewer.dataSources.remove(dataSource)
    //     }
    //   })
    //   dataSource.name = options.id
    //   var entities = dataSource.entities.values
    //   for (let i = 0; i < entities.length; i++) {
    //     let entity = entities[i]
    //     entity.billboard = undefined
    //     if (entity.polygon) {
    //       let fillColor = entity.properties.color.getValue()
    //       let fill0pacity = entity.properties['opacity'].getValue()
    //       if (localStorage.getItem('side') == 'admin') {
    //         fill0pacity = 0.3
    //       }
    //       entity.polygon.material =
    //         MSIMEarth.Color.fromCssColorString(fillColor).withAlpha(fill0pacity)
    //       // entity.polygon.height.setValue(VisParams.vectorDataHeight)
    //       entity.polygon.perPositionHeight = false
    //       entity.polygon.outlineColor = window.MSIMEarth.Color.BLACK
    //       entity.polygon.outlineWidth = 1
    //       // entity.polygon.heightReference= window.MSIMEarth.HeightReference.CLAMP_TO_GROUND
    //       // entity.polygon._classificationType = window.MSIMEarth.ClassificationType.TERRAIN
    //     }
    //     // EarthAPP.labelCollection.add({
    //     //   id: entity.id,
    //     //   position: entity.position._value,
    //     //   text: entity.properties.label._value,
    //     //   font: '22px black',
    //     //   fillColor:
    //     //     MSIMEarth.Color.fromCssColorString(fillColor).withAlpha(0.01),
    //     //   style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
    //     //   horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
    //     //   verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
    //     //   pixelOffset: new window.MSIMEarth.Cartesian2(0, -40),
    //     //   outlineColor: window.MSIMEarth.Color.BLACK,
    //     //   outlineWidth: 2,
    //     //   // showBackground: true,
    //     //   backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
    //     //   distanceDisplayCondition:
    //     //     new window.MSIMEarth.DistanceDisplayCondition(0, 60e5)
    //     //   // heightReference:
    //     //   //   window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND
    //     // })
    //   }
    //   window.EarthViewer.dataSources.add(dataSource)
    // })
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
   * 加载湿度区域
   */
  async addHumidity(url, name) {
    let DC = new window.EarthPlugn.DCPrimitive({
      viewer: window.EarthViewer,
      earth: window.MSIMEarth
    })
    const response = await fetch(url)
    const data = await response.json()
    DC.createCloud(data, name)
  }
  /**
   * 移除湿度区域
   */
  removeHumidity(name) {
    window.EarthViewer.scene.primitives._primitives.forEach((e) => {
      if (e.name == name) {
        window.EarthViewer.scene.primitives.remove(e)
      }
    })
  }
  /**
   * 加载云层
   */
  async addCloud(url, name) {
    let DC = new window.EarthPlugn.DCPrimitive({
      viewer: window.EarthViewer,
      earth: window.MSIMEarth
    })
    const response = await fetch(url)
    const data = await response.json()
    DC.createCloud(data, name)
  }
  /**
   * 移除云层
   */
  removeCloud(name) {
    window.EarthViewer.scene.primitives._primitives.forEach((e) => {
      if (e.name == name) {
        window.EarthViewer.scene.primitives.remove(e)
      }
    })
  }
  /**
   * 加载风场数据
   */
  loadWindData(levels, windDataList) {
    const fetchPromises = levels.map((level) => {
      return fetch(
        `static/data/json/wind_json_output/wind_level_${level}.json`
      )
        .then((res) => res.json())
        .then((res) => {
          // res.wdata内的值全是-1，将值改成1
          res.wdata = res.wdata.map((item) => (item === -1 ? 1 : item))
          windDataList.push(res)
        })
        .catch((error) => {
          console.error(`加载风场数据 wind_level_${level}.json 失败:`, error)
        })
    })
  }
}
export default DataControl
