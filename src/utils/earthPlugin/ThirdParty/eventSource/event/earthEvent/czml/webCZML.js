import {
  changeCzmlModel,
  modelUnknownConfig
} from './czmlRenderConfig/modelConfig/modelMatching'
import store from '@/store'
import { getQuaternion, modelConfig } from './czmlRenderConfig/index'
import { setLabelCanvas } from '@/utils/mapTools'
import { billboardConfig } from './czmlRenderConfig/billboardConfig'
import { getPAStatic } from '@/service/SSE.js'
import emitter from '@/utils/eventbus'
let czml = null
export default function () {
  const handleWebCzmlUpdate = (json) => {
    if (json.data.type === 'CHAFF') return //屏蔽干扰弹
    if (EarthAPP.SIMInfoCount < 400) {
      // let pr = new window.EarthPlugn.postRender(window.MSIMEarth)
      if (EarthAPP.SIMInfoCount === 0) {
        // pr.createLoadingEffect(window.EarthViewer.scene.postProcessStages)
        // 加载效果
        getPAStatic({ side: 'admin' }).then((res) => {})
      }
      EarthAPP.SIMInfoCount++
      if (EarthAPP.SIMInfoCount === 399) {
        // 临时挂载两个地面站
        let entitiesData = {
          id: 'dmz_2',
          position: new window.MSIMEarth.Cartesian3.fromDegrees(
            116.2134,
            23.7846,
            100
          ),
          label: {
            text: 'dmz_2',
            font: 'normal 29px MicroSoft YaHei',
            scale: 0.5,
            showBackground: false,
            backgroundColor: window.MSIMEarth.Color.RED.withAlpha(0.3),
            // fillColor: color,
            outlineColor: window.MSIMEarth.Color.RED,
            outlineWidth: 1,
            style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
            horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT, //水平位置
            verticalOrigin: window.MSIMEarth.VerticalOrigin.BOTTOM,
            pixelOffset: new window.MSIMEarth.Cartesian2(-15, -21),
            eyeOffset: new window.MSIMEarth.ConstantProperty(
              new window.MSIMEarth.Cartesian3(0, 0, -11)
            ),
            // distanceDisplayCondition:
            //   new window.MSIMEarth.DistanceDisplayCondition(1000, 6e5), //20e5
            distanceDisplayCondition:
              new window.MSIMEarth.DistanceDisplayCondition(100, 40e5),
            heightReference:
              window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND,
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          },
          billboard: {
            image: './static/image/billboard/静态目标/dmz_red.png',
            scale: 0.5,
            distanceDisplayCondition:
              new window.MSIMEarth.DistanceDisplayCondition(100, 40e5),
            // heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND,// 聚合影响显示，注释
            // // scaleByDistance: scByNear
            disableDepthTestDistance: Number.POSITIVE_INFINITY
          },
          properties: {
            side: 'red', //red或blue
            labelName: '地面站'
          }
        }
        window.EarthViewer.entities.add(entitiesData)
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
        description: `${json.data.labelName}`,
        orientation: {
          velocityReference: '#position'
        },
        label: {
          text: `${json.data.type}`,
          font: 'bold 12px MicroSoft YaHei',
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
            altitute: `${Number(json.data.alt)}`,
            side: `${json.data.side}`,
            type: `${json.data.type}`,
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
    czml[1].id = json.data.name
    czml[1].position.cartographicDegrees[0] = Number(json.data.t)
    czml[1].position.cartographicDegrees[1] = Number(json.data.lon)
    czml[1].position.cartographicDegrees[2] = Number(json.data.lat)
    czml[1].position.cartographicDegrees[3] = Number(json.data.alt)
    if (json.data.name === '071__1' || json.data.name === '071__2') {
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
    //     Number(json.data.lon),
    //     Number(json.data.lat),
    //     Number(json.data.alt)
    //   ),
    //   point: {
    //     piexlSize: 3
    //   }
    // })

    // let heading = json.data.hdg
    // let pitch = json.data.pitch
    // let roll = json.data.roll
    // if (heading && pitch && roll) {
    //   let orientation = getQuaternion(json.data)
    //   if (orientation) {
    //     czml[1].orientation = {
    //       unitQuaternion: [
    //         orientation.x,
    //         orientation.y,
    //         orientation.z,
    //         orientation.w
    //       ]
    //     }
    //   }
    // }
    // let heading = json.data.hdg
    // let pitch = json.data.pitch
    // let roll = json.data.roll
    // if (heading && pitch && roll) {
    //   let position = new window.MSIMEarth.Cartesian3.fromDegrees(
    //     json.data.lon,
    //     json.data.lat,
    //     json.data.alt
    //   )
    //   let hpr = new window.MSIMEarth.HeadingPitchRoll(
    //     window.MSIMEarth.Math.toRadians(heading - 90),
    //     window.MSIMEarth.Math.toRadians(pitch),
    //     window.MSIMEarth.Math.toRadians(roll)
    //   )
    //   let orientation = window.MSIMEarth.Transforms.headingPitchRollQuaternion(
    //     position,
    //     hpr
    //   )
    //   if (orientation) {
    //     czml[1].orientation = {
    //       unitQuaternion: [
    //         orientation.x,
    //         orientation.y,
    //         orientation.z,
    //         orientation.w
    //       ]
    //     }
    //   }
    // }
    // if (json.data.spd === 0) {
    //   // 暂时先给定方向，后续根据机场跑到方位匹配（hpr:000)
    //   // czml[1].orientation = {
    //   //   unitQuaternion: [
    //   //     0.368025056154162, 0.13037461007920348, -0.3074176587695252,
    //   //     -0.867787071905364
    //   //   ]
    //   // }
    //   delete czml[1].orientation
    // }
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
      let difference = Number(json.data.t)
      let currentTime = window.MSIMEarth.JulianDate.addSeconds(
        startTime,
        difference - EarthAPP.timeC,
        new window.MSIMEarth.JulianDate()
      )
      czml[0].clock.currentTime =
        window.MSIMEarth.JulianDate.toIso8601(currentTime)
      let res = modelConfig({
        type: json.data.type,
        side: json.data.side,
        id: czml[1].id
      })
      czml[1].model = res.model
      czml[1].billboard = {
        pixelOffset: {
          cartesian2: [0, -30]
        }
        // distanceDisplayCondition: {
        //   distanceDisplayCondition: labelImgDistance
        // }
      }
      czml[1].label.distanceDisplayCondition = {
        distanceDisplayCondition: res.labelDistanceDisplay
      }
      if (res.chineseName) {
        czml[1].label.text = res.chineseName
      }
      MSIMEarthCZMLProcessContainer.process(czml).then((res) => {
        // setLabelCanvas(
        //   json.data.labelName,
        //   'static/image/billboard/动态目标/planeB.png'
        // ).then((response) => {
        //   let curEn = res.entities.getById(json.data.name)
        //   if (curEn) {
        //     curEn.billboard.image = response
        //     // curEn.billboard.distanceDisplayCondition =
        //     //   new window.MSIMEarth.DistanceDisplayCondition(0, 30e5)
        //   }
        // })
        // 清除DB库里的数据
        if (indexedDBController) {
          indexedDBController.removeIndexDB(json.data.name)
        }
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
      console.log('首次加载', json.data)
      EarthAPP.labelCollection._labels.forEach((e) => {
        if (e?.id === czml[1].id) {
          EarthAPP.labelCollection.remove(e)
        }
      })
      if (json.data.spd === 0) {
        delete czml[1].orientation
      }
      EarthAPP.entitiesCount += 1
      let res = modelConfig({
        type: json.data.type,
        side: json.data.side,
        id: czml[1].id
      })
      // let billboard = billboardConfig({
      //   type: json.data.type,
      //   side: json.data.side,
      //   id: czml[1].id
      // })
      czml[1].model = res.model
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
        distanceDisplayCondition: res.labelDistanceDisplay
      }

      // czml[1].billboard = billboard
      
      MSIMEarthCZMLProcessContainer.process(czml).then((res) => {
        // store.state.sceneModule.sceneEnityData.forEach((item) => {
        //   if (item.Data.Name === czml[1].id) {
        //     item.hidden = true
        //   }
        // })
        // setLabelCanvas(
        //   json.data.labelName,
        //   'static/image/billboard/动态目标/planeB.png'
        // ).then((response) => {
        //   let curEn = res.entities.getById(json.data.name)
        //   if (curEn) {
        //     curEn.billboard.image = response
        //     // curEn.billboard.distanceDisplayCondition =
        //     //   new window.MSIMEarth.DistanceDisplayCondition(0, 30e5)
        //   }
        // })
        if (indexedDBController) {
          indexedDBController.removeIndexDB(json.data.name)
        }
        czml = null
      })
    } else {
      let jsonClone = JSON.parse(JSON.stringify(json))
      delete czml[1].model
      // delete czml[1].orientation
      delete czml[1].path
      delete czml[0].clock
      delete czml[1].availability
      delete czml[1].label
      delete czml[1].billboard
      if (json.data.type !== 'WZ-8' || json.data.type !== 'WZ-10') {
        delete czml[1].orientation
      }
      MSIMEarthCZMLProcessContainer.process(czml).then((res) => {
        let curEn = res.entities.getById(czml[1].id)
        if (store.state.sceneModule.isChangeModel) {
          console.log('精简切换')
          //设置精模简模切换
          changeCzmlModel(jsonClone)
          store.state.sceneModule.isChangeModel = false
          //设置模型是否描边
          // setModelSilhouetteColor(
          //   json[1].name,
          //   json[1].properties.airplaneAction.side
          // )
        }
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
