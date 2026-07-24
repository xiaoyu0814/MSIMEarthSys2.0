import store from '@/store'
import emitter from '@/utils/eventbus'
import { clusterPA, savePA, layerConfigByPA, PAConfig } from './PAConfig'
import { getUTF8NameByPA } from '../czml/czmlRenderConfig/index'
export default function () {
  // const { collectGroundRadarName } = radarConfig() // 更新store内地面雷达列表
  let options = {
    earth: window.MSIMEarth,
    viewer: window.EarthViewer,
    type: 'panel'
  }
  // 静态目标聚合效果，例如TH地区的静态目标太过密集了，远视角的时候需要聚合效果
  let layerList = new window.EarthPlugn.treeManagement(options)

  // 场景初始化消息，主要用于配置场景初始时态势信息展示。目前获取的静态信息已经没有飞机等动态目标的初始信息了，需要确认这样是否合适
  const handlePA = (json) => {
    const { savePAData } = savePA()
    savePAData(json) //保存PA信息到store,可进一步优化
    if (typeof json.Data.MType !== 'undefined') {
      // 暂时动态目标不匹配，后续可修改为动态标注，推演后清除
      console.log('被拒绝的PA消息', json)
      return
    }
    console.log('静态目标', json, json.Data.Type, json.Data.Route, json.Data)
    const { initLayerConfig } = layerConfigByPA()
    const { configPAEntity } = PAConfig()
    initLayerConfig(json) //基于PA消息初始化图层信息
    let params = configPAEntity(json) //可以根据PA目标是否为纯动态目标优化方法
    let { imageUrl, scale, distance } = params
    let chineseName = params.chineseName || json.Data.LabelName
    let utf8Name = getUTF8NameByPA(json.Data.Name)
    if (utf8Name) {
      console.log('utf8NamePA', utf8Name)
      chineseName = utf8Name
    }

    let height = 1
    let outColor = new window.MSIMEarth.Color(1.0, 1.0, 1.0, 1.0)
    let pixelOffset = new window.MSIMEarth.Cartesian2(2, -21)
    switch (json.Data.Side) {
      case 'blue':
        outColor = new window.MSIMEarth.Color(0, 0, 1.0, 1.0)
        break
      case 'red':
        outColor = new window.MSIMEarth.Color(1.0, 0, 0, 1.0)
        break
      case 'neutral':
        outColor = new window.MSIMEarth.Color(0 / 255, 0 / 255, 0 / 255, 1.0)
        break
      default:
        outColor = new window.MSIMEarth.Color(0.0, 1.0, 1.0, 1.0)
        break
    }
    // 静态标注是否显示
    let curPAShow = window.EarthPlugn.entity._getPAShow(
      store.state.AFSIMModule.paDataShow,
      json.Data.Side,
      json.Data.Vision
    )
    let entitiesData = {
      id: json.Data.Name + 'PA',
      position: window.MSIMEarth.Cartesian3.fromDegrees(
        parseFloat(json.Data.Lon),
        parseFloat(json.Data.Lat),
        parseFloat(json.Data.Alt) + height
      ),
      billboard: {
        image: imageUrl,
        scale: scale,
        distanceDisplayCondition: distance,
        heightReference: window.MSIMEarth.HeightReference.CLAMP_TO_GROUND,
        // heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND,// 聚合影响显示，注释
        // // scaleByDistance: scByNear
        // disableDepthTestDistance: Number.POSITIVE_INFINITY
      },
      label: {
        text: chineseName || json.Data.Type, //json.Data.Name,
        font: 'normal 29px MicroSoft YaHei',
        scale: 0.5,
        fillColor: window.MSIMEarth.Color.WHITE.withAlpha(0.01),
        outlineColor: outColor,
        outlineWidth: 3,
        style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT, //水平位置
        verticalOrigin: window.MSIMEarth.VerticalOrigin.BOTTOM,
        pixelOffset: pixelOffset,
        eyeOffset: new window.MSIMEarth.ConstantProperty(
          new window.MSIMEarth.Cartesian3(0, 0, -11)
        ),
        // distanceDisplayCondition:
        //   new window.MSIMEarth.DistanceDisplayCondition(1000, 6e5), //20e5
        distanceDisplayCondition: distance
      },
      point: {
        pixelSize: 5,
        color: outColor,
        outlineColor: window.MSIMEarth.Color.WHITE,
        outlineWidth: 2,
        // scaleByDistance: new window.MSIMEarth.NearFarScalar(
        //   1500,
        //   1,
        //   20000,
        //   0.3
        // ),
        // translucencyByDistance: new window.MSIMEarth.NearFarScalar(
        //   1500,
        //   1,
        //   20000,
        //   0.2
        // ),
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          50e4,
          100e5
        )
      },
      show: curPAShow,
      properties: {
        side: json.Data.Side, //red或blue
        Name: json.Data.Name,
        Weapons: json.Data.Weapons || {},
        airplaneAction: {
          side: json.Data.Side,
          heading: 0,
          pitch: 0,
          roll: 0,
          type: json.Data.Type || '',
          _value: {
            heading: 0,
            pitch: 0,
            roll: 0,
            type: json.Data.Type || ''
          }
        }
      }
    }
    // 机场方向调整
    // if (
    //   json.Data.Name.indexOf('fixed_air_port') !== -1 ||
    //   json.Data.Name.indexOf('Airport') !== -1
    // ) {
    //   // 0 为正比方向
    //   // let rotation = 0 //Math.random() * 360 - 180
    //   let rotation = -json.Data['HDG']
    //   entitiesData.billboard['rotation'] = rotation ? rotation : 0
    // }
    let labelData = {
      id: json.Data.Name,
      position: window.MSIMEarth.Cartesian3.fromDegrees(
        parseFloat(json.Data.Lon),
        parseFloat(json.Data.Lat),
        parseFloat(json.Data.Alt) + height
      ),
      text: chineseName || json.Data.Type, //json.Data.Name,
      font: 'normal 29px MicroSoft YaHei',
      scale: 0.5,
      fillColor: window.MSIMEarth.Color.WHITE.withAlpha(0.01),
      outlineColor: outColor,
      outlineWidth: 3,
      style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
      horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT, //水平位置
      verticalOrigin: window.MSIMEarth.VerticalOrigin.BOTTOM,
      pixelOffset: pixelOffset,
      eyeOffset: new window.MSIMEarth.ConstantProperty(
        new window.MSIMEarth.Cartesian3(0, 0, -11)
      ),
      // distanceDisplayCondition:
      //   new window.MSIMEarth.DistanceDisplayCondition(1000, 6e5), //20e5
      distanceDisplayCondition: distance,
      // heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND
      // disableDepthTestDistance: Number.POSITIVE_INFINITY,
      show: curPAShow
    }
    //加载前先删除球上目标
    let curEn = window.EarthViewer.entities.getById(json.Data.Name)
    if (curEn) {
      // return
      window.EarthViewer.entities.removeById(json.Data.Name)
      // 单个实体形式
      window.EarthViewer.entities.add(entitiesData)

      for (let i = 0; i < EarthAPP.labelCollection.length; ++i) {
        const l = EarthAPP.labelCollection.get(i)
        if (l.text === json.Data.Name) {
          EarthAPP.labelCollection.remove(l)
        }
      }

      // let entityLabel = EarthAPP.labelCollection.add(labelData)
      // entityLabel['name'] = json.Data.Name + '&&' + json.Data.Side
    } else {
      window.EarthViewer.entities.add(entitiesData)
      // let entityLabel = EarthAPP.labelCollection.add(labelData)
      // entityLabel['name'] = json.Data.Name + '&&' + json.Data.Side
    }

    // // 单个实体形式
    // window.EarthViewer.entities.add(entitiesData)
    // for (let i = 0; i < EarthAPP.labelCollection.length; ++i) {
    //   const l = EarthAPP.labelCollection.get(i)
    //   if (l.text === json.Data.Name) {
    //     EarthAPP.labelCollection.remove(l)
    //   }
    // }
    // let entityLabel = EarthAPP.labelCollection.add(labelData)
    // entityLabel['name'] = json.Data.Name + '&&' + json.Data.Side
  }
  return { handlePA }
}
