import {
  changeCzmlModel,
  modelUnknownConfig
} from './czmlRenderConfig/modelConfig/modelMatching'
import { getQuaternion, modelConfig } from './czmlRenderConfig/index'
import { setLabelCanvas } from '@/utils/mapTools'
import { billboardConfig } from './czmlRenderConfig/billboardConfig'
import { getPAStatic } from '@/service/SSE.js'
import emitter from '@/utils/eventbus'
let czml = null
export default function () {
  const handleWebCzmlUpdate = (json) => {
    if (json.Data.Type === 'CHAFF' || json.Data.Type === 'FLARE') return //屏蔽干扰弹
    // if (json.Data.Name !== 'wz-8_1' && json.Data.Name !== 'wz-8_2') return
    if (EarthAPP.SIMInfoCount < 500) {
      // let pr = new window.EarthPlugn.postRender(window.MSIMEarth)
      if (EarthAPP.SIMInfoCount === 0) {
        // pr.createLoadingEffect(window.EarthViewer.scene.postProcessStages)
        // 加载效果
        getPAStatic({ side: 'admin' }).then((res) => {})
      }
      EarthAPP.SIMInfoCount++
      if (EarthAPP.SIMInfoCount === 499) {
        // 临时挂载两个地面站
        // let entitiesData = {
        //   id: 'dmz_2',
        //   position: new window.MSIMEarth.Cartesian3.fromDegrees(
        //     116.2134,
        //     23.7846,
        //     100
        //   ),
        //   label: {
        //     text: 'dmz_2',
        //     font: 'normal 29px MicroSoft YaHei',
        //     scale: 0.5,
        //     showBackground: false,
        //     backgroundColor: window.MSIMEarth.Color.RED.withAlpha(0.3),
        //     // fillColor: color,
        //     outlineColor: window.MSIMEarth.Color.RED,
        //     outlineWidth: 1,
        //     style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        //     horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT, //水平位置
        //     verticalOrigin: window.MSIMEarth.VerticalOrigin.BOTTOM,
        //     pixelOffset: new window.MSIMEarth.Cartesian2(-15, -21),
        //     eyeOffset: new window.MSIMEarth.ConstantProperty(
        //       new window.MSIMEarth.Cartesian3(0, 0, -11)
        //     ),
        //     // distanceDisplayCondition:
        //     //   new window.MSIMEarth.DistanceDisplayCondition(1000, 6e5), //20e5
        //     distanceDisplayCondition:
        //       new window.MSIMEarth.DistanceDisplayCondition(100, 40e5),
        //     heightReference:
        //       window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND,
        //     disableDepthTestDistance: Number.POSITIVE_INFINITY
        //   },
        //   billboard: {
        //     image: './static/image/billboard/静态目标/dmz_red.png',
        //     scale: 0.5,
        //     distanceDisplayCondition:
        //       new window.MSIMEarth.DistanceDisplayCondition(100, 40e5),
        //     // heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND,// 聚合影响显示，注释
        //     // // scaleByDistance: scByNear
        //     disableDepthTestDistance: Number.POSITIVE_INFINITY
        //   },
        //   properties: {
        //     side: 'red', //red或blue
        //     labelName: '地面站'
        //   }
        // }
        // window.EarthViewer.entities.add(entitiesData)
        // // 加载效果结束
        // pr.removePREffect('czm_laod')
        // pr = null
      }
      return
    }
    czml = [
      {
        id: 'document',
        version: '1.0',
        clock: {
          currentTime: '2027-05-01T00:00:00Z',
          multiplier: 1,
          range: 'LOOP_STOP',
          interval: '2027-05-01T00:00:00Z/2027-05-30T21:00:00Z',
          step: 'SYSTEM_CLOCK_MULTIPLIER'
        }
      },
      {
        id: 'Vehicle',
        availability: '2027-05-01T00:00:00Z/2027-05-30T21:00:00Z',
        description: `${json.Data.Name}`,
        orientation: {
          velocityReference: '#position'
        },
        label: {
          text: `${json.Data.Type}`, //`${json.Data.Name}`,
          font: 'bold 12px MicroSoft YaHei',
          show: true,
          showBackground: true,
          backgroundColor: {
            rgba: [0, 0, 0, 55]
          },
          outlineColor: {
            rgba: [0, 255, 255, 100]
          },
          outlineWidth: 1,
          style: 'FILL_AND_OUTLINE',
          pixelOffset: {
            cartesian2: [-5, -35]
          }
          // distanceDisplayCondition: {
          //   distanceDisplayCondition: [1, 100e5]
          // }
          // curEn.label.outlineWidth = 2
          // curEn.label.style = window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE
        },
        model: {
          gltf: 'static/data/gltf/3DModel/pyramid.glb',
          scale: 2600.0
        },
        path: {
          material: {
            solidColor: {
              color: {
                rgba: [255, 0, 0, 255]
              }
            }
          },
          leadTime: 0,
          trailTime: 1000,
          show: false,
          width: 2,
          resolution: 10
        },
        // billboard: {
        //   image: 'static/image/billboard/satellite/DZ.png',
        //   scale: 0.5,
        //   distanceDisplayCondition: {
        //     distanceDisplayCondition: [1, 250e5]
        //   }
        // },
        properties: {
          airplaneAction: {
            altitute: `${Number(json.Data.Alt)}`,
            side: `${json.Data.Side}`,
            type: `${json.Data.Type}`,
            heading: 0,
            pitch: 0,
            roll: 0,
            speed: 0
          }
        },
        position: {
          interpolationAlgorithm: 'LAGRANGE',
          interpolationDegree: 1,
          epoch: '2027-05-01T00:00:00Z',
          cartographicDegrees: []
        }
      }
    ]
    czml[1].id = json.Data.Name
    czml[1].position.cartographicDegrees[0] = Number(json.Data.T)
    czml[1].position.cartographicDegrees[1] = Number(json.Data.Lon)
    czml[1].position.cartographicDegrees[2] = Number(json.Data.Lat)
    czml[1].position.cartographicDegrees[3] = Number(json.Data.Alt)
    czml[0].clock.multiplier = window.EarthViewer.clock.multiplier

    if (json.Data.Name === '071__1' || json.Data.Name === '071__2') {
      // 暂时先给定方向，后续根据机场跑到方位匹配（hpr:000)
      czml[1].orientation = {
        unitQuaternion: [
          0.368025056154162, 0.13037461007920348, -0.3074176587695252,
          -0.867787071905364
        ]
      }
    }

    // window.EarthViewer.entities.add({
    //   position: new window.MSIMEarth.Cartesian3.fromDegrees(
    //     Number(json.Data.Lon),
    //     Number(json.Data.Lat),
    //     Number(json.Data.Alt)
    //   ),
    //   point: {
    //     piexlSize: 3
    //   }
    // })

    if (EarthAPP.i < 1) {
      console.log('初始化')
      EarthAPP.entitiesCount += 1
      let czmlEn = window.EarthViewer.dataSources._dataSources.find((item) => {
        if (
          typeof item.processName !== 'undefined' &&
          item.processName === 'MSIMEarthCZMLProcessContainer'
        ) {
          return item
        }
      })
      if (czmlEn) {
        czmlEn.entities.removeAll()
        window.EarthViewer.dataSources.remove(czmlEn)
      }

      MSIMEarthCZMLProcessContainer = null
      MSIMEarthCZMLProcessContainer = new window.MSIMEarth.CzmlDataSource(
        'MSIMEarthCZMLProcessContainer'
      )
      MSIMEarthCZMLProcessContainer.processName =
        'MSIMEarthCZMLProcessContainer'
      window.EarthViewer.dataSources.add(MSIMEarthCZMLProcessContainer)

      let startTime = window.MSIMEarth.JulianDate.fromIso8601(
        czml[0].clock.currentTime
      )
      let difference = Number(json.Data.T)
      let currentTime = window.MSIMEarth.JulianDate.addSeconds(
        startTime,
        difference - EarthAPP.timeC,
        new window.MSIMEarth.JulianDate()
      )
      czml[0].clock.currentTime =
        window.MSIMEarth.JulianDate.toIso8601(currentTime)
      let res = modelConfig({
        type: json.Data.Type,
        side: json.Data.Side,
        id: czml[1].id
      })
      czml[1].model = res.model
      czml[1].model.silhouetteSize = 0 // 去掉之前的所有描边
      czml[1].billboard = {
        pixelOffset: {
          cartesian2: [0, -30]
        }
        // distanceDisplayCondition: {
        //   distanceDisplayCondition: labelImgDistance
        // }
      }
      czml[1].label.distanceDisplayCondition = {
        distanceDisplayCondition: [0, 100e5] //res.labelDistanceDisplay
      }
      MSIMEarthCZMLProcessContainer.process(czml).then((res) => {
        // setLabelCanvas(
        //   json.Data.labelName,
        //   'static/image/billboard/动态目标/planeB.png'
        // ).then((response) => {
        //   let curEn = res.entities.getById(json.Data.name)
        //   if (curEn) {
        //     curEn.billboard.image = response
        //     // curEn.billboard.distanceDisplayCondition =
        //     //   new window.MSIMEarth.DistanceDisplayCondition(0, 30e5)
        //   }
        // })
        czml = null
      })
      EarthAPP.i++
      return
    }
    czml[0].clock.currentTime = window.EarthViewer.clock.currentTime.toString()
    let targetMEntity = MSIMEarthCZMLProcessContainer.entities.getById(
      czml[1].id
    )
    if (!window.MSIMEarth.defined(targetMEntity)) {
      console.log('首次加载', json.Data)
      //清除对应静态图标
      window.EarthViewer.entities.removeById(czml[1].id)
      EarthAPP.labelCollection._labels.forEach((e) => {
        if (e?.id === czml[1].id) {
          EarthAPP.labelCollection.remove(e)
        }
      })
      if (json.Data.SPD === 0) {
        delete czml[1].orientation
      }
      EarthAPP.entitiesCount += 1
      let res = modelConfig({
        type: json.Data.Type,
        side: json.Data.Side,
        id: czml[1].id
      })
      // let billboard = billboardConfig({
      //   type: json.Data.type,
      //   side: json.Data.side,
      //   id: czml[1].id
      // })
      czml[1].model = res.model
      czml[1].model.silhouetteSize = 0 // 去掉之前的所有描边
      czml[1].billboard = {
        pixelOffset: {
          cartesian2: [0, -30]
        },
        show: false
        // distanceDisplayCondition: {
        //   distanceDisplayCondition: labelImgDistance
        // }
      }
      czml[1].label.distanceDisplayCondition = {
        distanceDisplayCondition: [0, 100e5] //res.labelDistanceDisplay
      }
      if (res.chineseName) {
        czml[1].label.text = res.chineseName
      }

      // czml[1].billboard = billboard

      MSIMEarthCZMLProcessContainer.process(czml).then((res) => {
        // setLabelCanvas(
        //   json.Data.labelName,
        //   'static/image/billboard/动态目标/planeB.png'
        // ).then((response) => {
        //   let curEn = res.entities.getById(json.Data.name)
        //   if (curEn) {
        //     curEn.billboard.image = response
        //     // curEn.billboard.distanceDisplayCondition =
        //     //   new window.MSIMEarth.DistanceDisplayCondition(0, 30e5)
        //   }
        // })
        czml = null
      })
    } else {
      delete czml[1].model
      // delete czml[1].orientation
      delete czml[1].path
      delete czml[0].clock
      delete czml[1].availability
      delete czml[1].label
      delete czml[1].billboard
      if (json.Data.Type !== 'WZ-8' || json.Data.Type !== 'WZ-10') {
        delete czml[1].orientation
      }
      MSIMEarthCZMLProcessContainer.process(czml).then((res) => {
        let curEn = res.entities.getById(czml[1].id)
        if (curEn.position && curEn.position._property._values.length > 99) {
          let curValues = curEn.position._property._values.slice(-99)
          let curTimes = curEn.position._property._times.slice(-33)
          curEn.position._property._values = curValues
          curEn.position._property._times = curTimes
        }
        czml = null
      })
    }
  }

  return { handleWebCzmlUpdate }
}
