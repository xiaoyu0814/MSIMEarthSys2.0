import {
  changeCzmlModel,
  modelUnknownConfig,
  configPlateformCHNName
} from './czmlRenderConfig/modelConfig/modelMatching'
import { getQuaternion, modelConfig, getUTF8NameByPA } from './czmlRenderConfig/index'
import { getPAStatic } from '@/service/SSE.js'
import store from '@/store'
import LocalCache from '@/utils/earthPlugin/ThirdParty/storageManagement/localStorage.js'
let czml = null
export default function () {
  const handleWebCzmlUpdate = (json) => {
    //屏蔽干扰弹
    // if (
    //   (!EarthAPP.showGRD && json.Data.Type === 'CHAFF') ||
    //   json.Data.Type === 'FLARE' ||
    //   json.Data.Type === 'GenericLoiteringMunition'
    // )

    if (EarthAPP.SIMInfoCount < 10) {
      // let pr = new window.EarthPlugn.postRender(window.MSIMEarth)
      if (EarthAPP.SIMInfoCount === 0) {
        
        let side = window.localStorage.getItem('side')
        getPAStatic({ side: side }).then((res) => { })
      }
      EarthAPP.SIMInfoCount++
      return
    }
    let curSide = getSideByCSV(json)
    if (curSide) {
      json.Data.Side = curSide
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
          text: `${json.Data.Name}`, //`${json.Data.Type}`,
          font: 'bold 12px MicroSoft YaHei',
          show: true,
          showBackground: true,
          backgroundColor: {
            rgba: [0, 0, 0, 55]
          },
          outlineColor: {
            rgba: [0, 255, 255, 100]
          },
          outlineWidth: 2,
          style: 'FILL_AND_OUTLINE',
          pixelOffset: {
            cartesian2: [-5, -35]
          }
          
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
        
        properties: {
          airplaneAction: {
            altitute: `${Number(json.Data.Alt)}`,
            side: `${json.Data.Side}` || 'red',
            type: `${json.Data.Type}`,
            heading: json.Data.HDG || 0,
            pitch: json.Data.Pitch || 0,
            roll: json.Data.Roll || 0,
            speed: 0,
            stepT: json.Data.T,
            realT: window.EarthViewer.clock.currentTime
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
    czml[0].clock.multiplier = window.EarthViewer.clock.multiplier
    czml[1].position.cartographicDegrees[0] = Number(json.Data.T)
    czml[1].position.cartographicDegrees[1] = Number(json.Data.Lon)
    czml[1].position.cartographicDegrees[2] = Number(json.Data.Lat)
    czml[1].position.cartographicDegrees[3] = Number(json.Data.Alt)

    // 坏数据 监测
    // 只有当SpeedNED0不是undefined时，才检查是否为无效数字
    if (
      typeof json.Data.SpeedNED0 !== 'undefined' &&
      isNaN(json.Data.SpeedNED0)
    )
      return
    if (Number(json.Data.Lon) === 0 && Number(json.Data.Lat) === 0) return
    
    // 存储MU消息数据到store，供复盘场景使用
    if (json.Data && json.Data.Name) {
      store.commit('AFSIMModule/setMuData', {
        name: json.Data.Name,
        data: { ...json.Data }
      })
    }

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
      if (typeof res !== 'undefined') {
        czml[1].model = res.model
        czml[1].model.silhouetteSize = 0 // 去掉之前的所有描边
      }
      czml[1].billboard = {
        pixelOffset: {
          cartesian2: [0, -30]
        }
      }
      czml[1].label.outlineColor = czml[1].model.silhouetteColor
      czml[1].label.distanceDisplayCondition = {
        distanceDisplayCondition: [0, 100e5] //res.labelDistanceDisplay
      }
      // 根据PA消息收到的数据控制czml label：静态标注显示时隐藏对应czml label
      let paShowInfo = store.state.AFSIMModule.paShowData[json.Data.Name]
      let curPAShow = false
      if (paShowInfo) {
        curPAShow = window.EarthPlugn.entity._getPAShow(
          store.state.AFSIMModule.paDataShow,
          paShowInfo.side,
          paShowInfo.vision
        )
      }
      czml[1].label.show = LocalCache.getCache('labelShow') && !curPAShow
      if (res && res.chineseName) {
        czml[1].label.text = res.chineseName
        
      }
      // 仿真端追加了脚本启动PA携带的UTF-8格式中文Name
      let utf8Name = getUTF8NameByPA(json.Data.Name)
      if (utf8Name) {
        czml[1].label.text = utf8Name
      }

      czml[1].properties.airplaneAction.side = getSideByCSV(json)

      MSIMEarthCZMLProcessContainer.process(czml).then((res) => {
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
      if (json.Data.SPD === 0) {
        delete czml[1].orientation
      }
      EarthAPP.entitiesCount += 1
      let res = modelConfig({
        type: json.Data.Type,
        side: json.Data.Side,
        id: czml[1].id
      })
      
      if (typeof res !== 'undefined') {
        czml[1].model = res.model
        czml[1].model.silhouetteSize = 0 // 去掉之前的所有描边
      }

      czml[1].billboard = {
        pixelOffset: {
          cartesian2: [0, -30]
        },
        show: false
      }

      czml[1].label.outlineColor = czml[1].model.silhouetteColor
      czml[1].label.distanceDisplayCondition = {
        distanceDisplayCondition: [0, 100e5] //res.labelDistanceDisplay
      }
      // 根据PA消息收到的数据控制czml label：静态标注显示时隐藏对应czml label
      let paShowInfo = store.state.AFSIMModule.paShowData[json.Data.Name]
      let curPAShow = false
      if (paShowInfo) {
        curPAShow = window.EarthPlugn.entity._getPAShow(
          store.state.AFSIMModule.paDataShow,
          paShowInfo.side,
          paShowInfo.vision
        )
      }
      console.log('curPAShow',store.state.AFSIMModule.paShowData,json.Data.Name,curPAShow)
      czml[1].label.show = !curPAShow
      if (res && res.chineseName) {
        czml[1].label.text = res.chineseName
      }
      // 仿真端追加了脚本启动PA携带的UTF-8格式中文Name
      // let utf8Name = getUTF8NameByPA(json.Data.Name)
      // if (utf8Name) {
      //   console.log('utf8Name', utf8Name)
      //   czml[1].label.text = utf8Name
      // }
      czml[1].properties.airplaneAction.side = res.side
      
      czml[1].properties.airplaneAction.side = getSideByCSV(json)
      MSIMEarthCZMLProcessContainer.process(czml).then((res) => {
        let curEn = res.entities.getById(json.Data.Name)
        // 如果不是复盘状态动态计算方向，当前复盘状态姿态参数与推演状态不一致无法直接使用,0616日仿真端更新了版本，观察了一次看起来是正确的，当前先放开限制直接使用SIM端姿态
        // if (!store.state.AFSIMModule.fp) {
        curEn.orientation = new window.MSIMEarth.CallbackProperty(function (
          time,
          result
        ) {
          // 获取当前位置
          const position = curEn.position.getValue(time)
          if (!window.MSIMEarth.defined(position)) return
          // 示例：随时间变化的HPR
          let curH = curEn.properties.airplaneAction._value.heading
          let curP = curEn.properties.airplaneAction._value.pitch
          let curR = curEn.properties.airplaneAction._value.roll

          const hpr = new window.MSIMEarth.HeadingPitchRoll(
            window.MSIMEarth.Math.toRadians(curH - 90),
            -window.MSIMEarth.Math.toRadians(curP),
            -window.MSIMEarth.Math.toRadians(curR)
          )
          return window.MSIMEarth.Transforms.headingPitchRollQuaternion(
            position,
            hpr
          )
        },
          false)
        czml = null
      })
    } else {
      let jsonClone = JSON.parse(JSON.stringify(json))
      delete czml[1].model
      delete czml[1].orientation
      delete czml[1].path
      delete czml[0].clock
      delete czml[1].availability
      delete czml[1].label
      delete czml[1].billboard
      MSIMEarthCZMLProcessContainer.process(czml).then((res) => {
        let curEn = res.entities.getById(czml[1].id)
        if (store.state.sceneModule.isChangeModel) {
          console.log('精简切换')
          //设置精模简模切换
          changeCzmlModel(jsonClone)
          store.state.sceneModule.isChangeModel = false
        }
        let curEnModelInfo = modelConfig({
          type: json.Data.Type,
          side: json.Data.Side,
          id: czml[1].id
        })
        if (typeof res !== 'undefined') {
          // console.log(json.Data.Type, czml[1].id, curEnModelInfo.model.gltf)
          curEn.model.uri.setValue(curEnModelInfo.model.gltf)
        }
        let curH = curEn.properties.airplaneAction._value.heading
        let curP = curEn.properties.airplaneAction._value.pitch
        let curR = curEn.properties.airplaneAction._value.roll

        const position = curEn.position.getValue(
          window.EarthViewer.clock.currentTime
        )
        // if (window.MSIMEarth.defined(position) && !store.state.AFSIMModule.fp) {
        if (window.MSIMEarth.defined(position)) {
          // 创建HeadingPitchRoll对象
          let hpr = new window.MSIMEarth.HeadingPitchRoll(
            window.MSIMEarth.Math.toRadians(curH - 90),
            window.MSIMEarth.Math.toRadians(curP),
            window.MSIMEarth.Math.toRadians(curR)
          )

          // 计算方向四元数
          const orientation =
            window.MSIMEarth.Transforms.headingPitchRollQuaternion(
              position,
              hpr
            )

          // 更新entity方向
          curEn.orientation = orientation
        }

        if (curEn.position && curEn.position._property._values.length > 99) {
          let curValues = curEn.position._property._values.slice(-99)
          let curTimes = curEn.position._property._times.slice(-33)
          curEn.position._property._values = curValues
          curEn.position._property._times = curTimes
        }
        if (store.state.experimentModule.plateformCluster.length > 0) {
          store.state.experimentModule.plateformCluster.forEach((e) => {
            if (curEn.id === e.id) {
              curEn.show = e.show
            }
          })
        } else {
          curEn.show = true
        }
        // 根据PA消息数据更新已有实体的label显隐
        let paShowInfo = store.state.AFSIMModule.paShowData[json.Data.Name]
        let curPAShow = false
        if (paShowInfo) {
          curPAShow = window.EarthPlugn.entity._getPAShow(
            store.state.AFSIMModule.paDataShow,
            paShowInfo.side,
            paShowInfo.vision
          )
        }
        if (curEn.label) {
          curEn.label.show = !curPAShow
        }
        czml = null
      })
    }
  }
  // 计算四元数
  const computeOrientation = (json) => {
    let heading = json.Data.HDG || 0
    let pitch = json.Data.Pitch || 0
    let roll = json.Data.Roll || 0
    if (heading && pitch && roll) {
      let position = new window.MSIMEarth.Cartesian3.fromDegrees(
        json.Data.Lon,
        json.Data.Lat,
        json.Data.Alt
      )
      let hpr = new window.MSIMEarth.HeadingPitchRoll(
        window.MSIMEarth.Math.toRadians(heading - 90),
        window.MSIMEarth.Math.toRadians(pitch),
        window.MSIMEarth.Math.toRadians(roll)
      )
      let orientation = window.MSIMEarth.Transforms.headingPitchRollQuaternion(
        position,
        hpr
      )
      return orientation
    }
  }

  //获取阵营
  const getSideByCSV = (json) => {
    // 匹配阵营
    let plateformConfigInfo = configPlateformCHNName(json.Data.Name)
    let side = json.Data.Side ||'white'
    //已将阵营修改正确，后续模型匹配时不需要再进行匹配阵营（后续修改modelConfig方法）
    if (
      typeof plateformConfigInfo !== 'undefined' &&
      plateformConfigInfo.camp
    ) {
      side = plateformConfigInfo.camp
    }
    return side
  }

  return { handleWebCzmlUpdate }
}
