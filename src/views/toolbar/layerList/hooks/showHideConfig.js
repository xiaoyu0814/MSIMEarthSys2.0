/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2026-01-10 17:05:52
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2026-07-15 10:55:09
 */
// 显隐配置文件
import store from '@/store/index'
import {
  removeSightTarget,
  thirdSightFrame,
  thirdSightFrame1,
  createRadarPenetrating,
  clearRadarPenetrating,
  clearFrustum,
  createFrustumFun,
  removeSightedFrame
} from '@/utils/earthPlugin/ThirdParty/cameraControl/cameraControl'
import { getTargetNameByMissileName, getInfoByPlatName } from '@/service/SSE.js'
import { getPlateSWMessageV2 } from '@/service/command'
import Bubble1 from '@/utils/bubble/dataBubble2'
import emitter from '@/utils/eventbus'
import { getRaderGR, getNoiseMap } from '@/service/radar'
import LocalCache from '@/utils/earthPlugin/ThirdParty/storageManagement/localStorage.js'
import { createEllipsoidRadar, clearEllipsoidRadar } from '@/utils/mapTools'
import {
  getPlatformState,
  getPlatformParts,
  getPlatformSensorVolumes,
  getPlatformJammerVolumes,
  getPlatformMovementRoutes
} from '@/service/afsim'
import { ElMessage } from 'element-plus'
let frustumFunObj = {} //缓存飞机的感知半径锥实体对象
let radarFunObj = {} //缓存飞机的感知半径雷达扫描实体对象
let radarEllipsoidObj = {} //缓存预警机感知半径雷达半球扫描实体对象
// 详标牌
export function detailedSignageCheckChange(value) {
  if (value) {
    console.log(store.getters.getCurrentNode)
    let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
      store.getters.getCurrentNode.code,
      'MSIMEarthCZMLProcessContainer'
    )
    if (!window.MSIMEarth.defined(curEntity)) return
    if (
      curEntity.properties &&
      typeof curEntity.properties.airplaneAction !== 'undefined'
    ) {
      let curSeat = window.localStorage.getItem('side') // 获取当前席位
      let fontColorRgb = []
      if (curSeat == 'admin') {
        //fontColorRgb = store.getters.getBubbleFontColorAdmin
        fontColorRgb = store.getters.getBubbleFontColor
      } else {
        fontColorRgb = store.getters.getBubbleFontColor
      }
      let titleName = curEntity ? curEntity.description : ''
      // let stateObj = getLdrwListArrValue(curEntity.description, EarthAPP.ldrw)
      // if (stateObj != null) {
      //   stateStr = stateObj.state
      // }
      // 速度 m/s 换算为 km/h
      let speedKm = 0
      if (curEntity.properties?.airplaneAction?._value?.speed) {
        speedKm =
          Number(curEntity.properties?.airplaneAction?._value?.speed) * 3.6
      }

      // 任务
      let stateStr = ''
      let currentSceneInfo = JSON.parse(
        window.localStorage.getItem('currentSceneInfo')
      )
      let params1 = { platform: store.getters.getCurrentNode.code }
      getPlatformState(params1).then((res) => {
        if (res.status == 'success') {
          let param = {
            platname: store.getters.getCurrentNode.code,
            scenarioId: currentSceneInfo.scenarioId
          }
          getInfoByPlatName(param).then((res1) => {
            // debugger
            if (res1.code == 200) {
              stateStr = res1.data.taskDescription
            }
            // 如果chineseName不为空并且undefined则使用chineseName
            if (
              typeof store.state.sceneModule.currentFlyType.chineseName !=
                'undefined' &&
              store.state.sceneModule.currentFlyType.chineseName !== ''
            ) {
              titleName = store.state.sceneModule.currentFlyType.chineseName
            } else {
              titleName = store.getters.getCurrentNode.code
            }
            let params = {
              id: store.getters.getCurrentNode.code,
              name: curEntity ? curEntity.description : '',
              //title: store.state.sceneModule.currentFlyType.chineseName,
              title: titleName,
              rgb: [],
              heading: res.data.Heading,
              pitch: res.data.Pitch,
              roll: res.data.Roll,
              speed: speedKm.toFixed(3),
              mach: 0,
              fuel: 0,
              type: res.data.Type,
              fontColorRgb: fontColorRgb,
              state: stateStr,
              sensor: '',
              radar: '',
              weapon: '',
              DamageFactor: res.data.DamageFactor,
              OpticalReflectivity: res.data.OpticalReflectivity,
              Members: res.data.Members,
              InitialMembers: res.data.InitialMembers
            }
            if (store.getters.getCurrentNode.side == 'red') {
              params['rgb'] = [225, 82, 88]
              createPanelInfor(params)
            } else if (store.getters.getCurrentNode.side == 'green') {
              params['rgb'] = [175, 247, 170]
              createPanelInfor(params)
            } else if (store.getters.getCurrentNode.side == 'blue') {
              params['rgb'] = [57, 173, 209]
              createPanelInfor(params)
            } else if (store.getters.getCurrentNode.side == 'purple') {
              params['rgb'] = [128, 8, 235]
              createPanelInfor(params)
            } else {
              params['rgb'] = [255, 255, 235]
              createPanelInfor(params)
            }
          })
        } else {
          // ElMessage.error("获取红方装备信息失败")
        }
      })
    }
  } else {
    if (window['curDivPoint' + store.getters.getCurrentNode.code]) {
      window['curDivPoint' + store.getters.getCurrentNode.code].closeEvent()
      window['curDivPoint' + store.getters.getCurrentNode.code] = null
    }
  }
}
//在l4阶段显示详标牌
export function detailedSignageCheckL4(value, messageObj) {
  let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
    messageObj.name + '-wz',
    'MSIMEarthCZMLProcessContainer'
  )
  if (!window.MSIMEarth.defined(curEntity)) return
  if (
    curEntity.properties &&
    typeof curEntity.properties.airplaneAction !== 'undefined'
  ) {
    let curSeat = window.localStorage.getItem('side') // 获取当前席位
    let fontColorRgb = []
    if (curSeat == 'admin') {
      // fontColorRgb = store.getters.getBubbleFontColorAdmin
      fontColorRgb = store.getters.getBubbleFontColor
    } else {
      fontColorRgb = store.getters.getBubbleFontColor
    }
    let titleName = curEntity
      ? curEntity._description._value == '未知目标'
        ? '未知'
        : curEntity.label.text
      : ''
    // 速度 m/s 换算为 km/h
    let speedKm = 0
    if (curEntity.properties?.airplaneAction?._value?.speed) {
      speedKm =
        Number(curEntity.properties?.airplaneAction?._value?.speed) * 3.6
    }
    let params = {
      id: messageObj.name + '-wz',
      name: curEntity ? curEntity.label.text : '',
      title: titleName,
      rgb: [],
      heading: curEntity.properties.airplaneAction._value.heading.toFixed(3),
      pitch: curEntity.properties.airplaneAction._value.pitch.toFixed(3),
      roll: curEntity.properties.airplaneAction._value.roll.toFixed(3),
      speed: speedKm.toFixed(3),
      type: curEntity.properties.airplaneAction._value.type,
      fontColorRgb: fontColorRgb,
      currentProcess: messageObj.currentProcess,
      qbStatus: messageObj.qbStatus,
      threatLevel: messageObj.threatLevel,
      sName: messageObj.sName ? messageObj.sName : '--'
    }
    params['rgb'] = [57, 173, 209]
    createPanelInL4(params)
  }
}

//L4显示信息弹框
const createPanelInL4 = (params) => {
  let billboardBubble = new Bubble1({
    content: [
      { name: '经度', value: '' },
      { name: '纬度', value: '' },
      { name: '高度', value: '' },
      { name: '航向角', value: params.heading + '°' },
      // { name: '俯仰角', value: params.pitch + '°' },
      // { name: '滚转角', value: params.roll + '°' },
      { name: '速度', value: params.speed + 'km/h' },
      { name: '目标类型', value: params.type },
      { name: '信息', value: params.currentProcess },
      { name: '情报状态', value: params.qbStatus },
      { name: '威胁级别', value: params.threatLevel }
      // { name: '情报来源', value: params.sName},
      // { name: '任务', value: params.state }
    ],
    viewer: window.EarthViewer,
    id: params.id,
    Cesium: window.MSIMEarth,
    title: params.title,
    name: 'simple',
    offsetY: -300, //单位px,值越大越往上
    offsetX: 150, //单位px,值越小越往右
    distanceDisplayCondition: [0, 20e5],
    div: 'planDetail',
    rgb: params.rgb, //红、蓝
    fontColorRgb: params.fontColorRgb, // 字体颜色
    isCloseClick: false
  })
  if (!window.mubiaoObj[params.id]) {
    window.mubiaoObj[params.id] = billboardBubble
  }
}
//显示信息弹框
const createPanelInfor = (params) => {
  const labelType = localStorage.getItem('plateFormLabelType') || '10'
  let content = []
  if (labelType === '9') {
    content = [
      { name: '经度', value: '' },
      { name: '纬度', value: '' },
      { name: '高度', value: '' },
      { name: '速度', value: params.speed }
    ]
  } else if (labelType === '10') {
    content = [
      { name: '经度', value: '' },
      { name: '纬度', value: '' },
      { name: '高度', value: '' },
      { name: '速度', value: params.speed },
      { name: '航向角', value: params.heading + '°' },
      { name: '俯仰角', value: params.pitch + '°' },
      { name: '任务', value: params.state }
    ]
  } else if (labelType === '11') {
    content = [
      { name: '经度', value: '' },
      { name: '纬度', value: '' },
      { name: '高度', value: '' },
      { name: '速度', value: params.speed },
      { name: '航向角', value: params.heading + '°' },
      { name: '俯仰角', value: params.pitch + '°' },
      { name: '传感器', value: params.sensor },
      { name: '武器', value: params.weapon },
      { name: '任务', value: params.state }
    ]
  } else {
    content = [
      { name: '经度', value: '' },
      { name: '纬度', value: '' },
      { name: '高度', value: '' },
      { name: '速度', value: params.speed },
      { name: '航向角', value: params.heading + '°' },
      { name: '俯仰角', value: params.pitch + '°' },
      { name: '传感器', value: params.sensor },
      { name: '武器', value: params.weapon },
      { name: '任务', value: params.state }
    ]
  }
  // 如果params.OpticalReflectivity为空或者NaN则去掉反射率
  if (!params.OpticalReflectivity || isNaN(params.OpticalReflectivity)) {
    content = content.filter((item) => item.name != '反射率')
  }
  // 增加判断，如果油量为空则去掉油量
  if (params.fuel == 0) {
    console.log('当前油量为空')
    content = content.filter((item) => item.name != '油量')
  }
  let bubbleInstance = new Bubble1({
    content: filterContent(content),
    viewer: window.EarthViewer,
    id: params.id,
    Cesium: window.MSIMEarth,
    title: params.title,
    name: 'simple',
    offsetY: -300, //单位px 以当前目标点为中心+offsetY 负数向上 正数向下
    offsetX: 150, //单位px 以当前目标点为中心+offsetX 负数向左偏移 正数向右偏移
    distanceDisplayCondition: [0, 20e5],
    div: 'planDetail',
    rgb: params.rgb, //红、蓝
    fontColorRgb: params.fontColorRgb, // 字体颜色
    isCloseClick: false
  })
  if (!window.bubbleInstances) {
    window.bubbleInstances = {}
  }
  window.bubbleInstances[params.id] = bubbleInstance
}

emitter.on('labelTypeChange', () => {
  if (store.getters.getCurrentNode) {
    if (window['curDivPoint' + store.getters.getCurrentNode.code]) {
      window['curDivPoint' + store.getters.getCurrentNode.code].closeEvent()
      window['curDivPoint' + store.getters.getCurrentNode.code] = null
    }
    detailedSignageCheckChange(true)
  }
})

const filterContent = (content) => {
  let newContent = content.filter(function (value, index, arr) {
    let isTrue = true
    if (value.name) {
      let datavalue = LocalCache.getCache(value.name)
      if (datavalue != undefined) isTrue = datavalue
    }
    return isTrue
  })

  return newContent
}
// 查找 LD演示场景各个仿真平台任务划分  依据 description
const getLdrwListArrValue = (curData, datasArr) => {
  const i = datasArr.findIndex((item) => {
    return item.description == curData
  })
  return datasArr[i] ? datasArr[i] : null
}

//路径显隐
export function pathCheckChange(value) {
  if (value) {
    window.sceneAction.planeCzmlManage.addPathLine(
      store.getters.getCurrentNode.code
    )
  } else {
    window.sceneAction.planeCzmlManage.removePathLine(
      store.getters.getCurrentNode.code
    )
  }
}
//路径墙
export function entityWallChange(value) {
  if (value) {
    window.sceneAction.planeCzmlManage.addPathWall(
      store.getters.getCurrentNode.code
    )
  } else {
    window.sceneAction.planeCzmlManage.removePathWall(
      store.getters.getCurrentNode.code
    )
  }
}
//尾迹
export function entityWackChange(value) {
  if (value) {
    window.sceneAction.planeCzmlManage.addwjxian(
      store.getters.getCurrentNode.code,
      store.getters.getCurrentNode.side
    )
  } else {
    window.sceneAction.planeCzmlManage.removewjxian(
      store.getters.getCurrentNode.code
    )
  }
}
//显示航线
export function planLineChange(value) {
  let dataController = new window.EarthPlugn.DataControl({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  let curEntityId = store.getters.getCurrentNode.code
  if (value) {
    console.log('显示航线', store.state.sceneModule.planLineData)
    let positionData = store.state.sceneModule.planLineData[curEntityId]
    let side =
      configPlateformSide(curEntityId) || store.getters.getCurrentNode.side
    if (positionData && positionData.length > 0) {
      dataController.addPlanFlyLine(curEntityId, positionData, side)
      addPlanFlyLineFoRealTime(curEntityId, side, dataController)
    }
  } else {
    if (window.EarthViewer.entities.getById(curEntityId + '-planLine')) {
      window.EarthViewer.entities.removeById(curEntityId + '-planLine')
    }
    if (window.EarthViewer.entities.getById(curEntityId + '-endPoint')) {
      window.EarthViewer.entities.removeById(curEntityId + '-endPoint')
    }
    if (
      window.EarthViewer.entities.getById(curEntityId + '-planLine_realTime')
    ) {
      window.EarthViewer.entities.removeById(curEntityId + '-planLine_realTime')
    }
  }
}

function addPlanFlyLineFoRealTime(platform, side, dataController) {
  const params = { platform }
  getPlatformMovementRoutes(params).then((res) => {
    if (res && res.status == 'success') {
      const positions = getPointList(res.data)
      if (positions && positions.length) {
        dataController.addPlanFlyLineFoRealTime(platform, positions, side)
      }
    }
  })
}

function getPointList(data) {
  let positions = []
  if (data.Waypoints && data.Waypoints.length) {
    let dataList = data.Waypoints
    let lastPoint = null
    for (let i = 0; i < dataList.length; i++) {
      const element = dataList[i]
      let point = [element.Longitude, element.Latitude, element.Altitude]
      positions.push(...point)
      if (element.Label == 'start') {
        lastPoint = [element.Longitude, element.Latitude, element.Altitude]
      }
      if (element.GoTo == 'start' && dataList.length == i + 1) {
        positions.push(...lastPoint)
      }
    }
  }
  return positions
}

//瞄准框
export function sightFrameChange(value) {
  let entity = window.EarthPlugn.entity._GetCZMLEntity(
    store.getters.getCurrentNode.code,
    'MSIMEarthCZMLProcessContainer'
  )
  if (!entity) return
  if (value) {
    thirdSightFrame(entity)
    // thirdSightFrame1(entity)
  } else {
    removeSightTarget(store.getters.getCurrentNode.code)
  }
}
//导弹线
export function missileLineChange(value) {
  let data = {
    missileName: store.getters.getCurrentNode.code
  }
  getTargetNameByMissileName(data).then((res) => {
    if (res.code) {
      let id = `RE_WeaponF==${store.getters.getCurrentNode.code}==${res.data}`
      let entityMissileLine = window.EarthViewer.entities.getById(id)
      if (entityMissileLine) {
        entityMissileLine.show = value
      }
      let distanceid = `distancelabel==${store.getters.getCurrentNode.code}==${res.data}`
      let distance = window.EarthViewer.entities.getById(distanceid)
      if (distance) {
        distance.show = value
      }
    }
  })
}
//作战半径
export function operationalRadiusChange(value) {
  if (value) {
    let combatRaduis
    let entity = window.EarthPlugn.entity._GetCZMLEntity(
      store.getters.getCurrentNode.code,
      'MSIMEarthCZMLProcessContainer'
    )
    let color
    if (entity?.properties?.airplaneAction?._value?.side == 'red') {
      color = [255, 0, 0, 0]
    } else if (entity?.properties?.airplaneAction?._value?.side == 'blue') {
      color = [0, 0, 255, 0]
    } else if (entity?.properties?.airplaneAction?._value?.side == 'green') {
      color = [0, 255, 0, 0]
    } else if (entity?.properties?.airplaneAction?._value?.side == 'purple') {
      color = [128, 8, 235, 0]
    }
    // createEntityCircleFun('operationalRadius', 50000, [255, 0, 0, 0], true) // 与感知半径同理，请看感知半径说明
    let params1 = { platform: store.getters.getCurrentNode.code }
    getPlatformState(params1).then((res) => {
      if (res.status == 'success') {
        combatRaduis = res.data?.CombatRadius * 1000
        if (combatRaduis) {
          createEntityCircleFun('operationalRadius', combatRaduis, color, true)
        } else {
          ElMessage.warning(
            store.state.sceneModule.currentFlyType.chineseName + '无作战半径！'
          )
        }
      }
    })
  } else {
    removeEntityCircleById(
      'operationalRadius' + store.getters.getCurrentNode.code
    )
  }
}
export function createEntityCircleFun(type, radius, color, isShowMaterial) {
  window.sceneAction.planeCzmlManage.createEntityCircle({
    sourId: store.getters.getCurrentNode.code,
    type: type,
    radius: radius,
    color: color,
    isShowMaterial: isShowMaterial
  })
}

export function removeEntityCircleById(id) {
  if (window.EarthViewer.entities.getById(id)) {
    window.EarthViewer.entities.removeById(id)
  }
}
//勾选功能菜单感知范围
export function entityFrustumChange(value) {
  if (value) {
    let params = { name: store.getters.getCurrentNode.code }
    if (!params) return
    // 根据传感器类型开启对应形态的volumes
    getPlatformSensorVolumes({ platform: params.name })
      .then((res) => {
        debugger
        console.log(`获取平台渲染图形信息${res.status}`, res.data)
        let volumesDatas = res.data
        // 1.1获取雷达位置并配置雷达属性
        let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
          params.name,
          'MSIMEarthCZMLProcessContainer'
        )
        if (!window.MSIMEarth.defined(curEntity)) return
        let radarSide
        if (
          curEntity.properties.airplaneAction &&
          curEntity.properties.airplaneAction?._value?.side
        ) {
          radarSide = curEntity.properties.airplaneAction?._value?.side
        } else {
          radarSide = curEntity.properties?.side?._value
        }
        if (!volumesDatas || volumesDatas.length <= 0) {
          console.log('获取不到传感器渲染体数据', volumesDatas, params.name)
          return
        }
        let curside = configPlateformSide(curEntity.id)
        radarSide = curside //基于csv配置文件更新阵营，后续数据流阵营匹配完善后可删除
        switch (radarSide) {
          case 'red':
            params.color = window.MSIMEarth.Color.RED.withAlpha(0.1)
            break
          case 'blue':
            params.color = window.MSIMEarth.Color.BLUE.withAlpha(0.1)
            break
          case 'green':
            params.color = window.MSIMEarth.Color.GREEN.withAlpha(0.1)
            break
          case 'purple':
            params.color = window.MSIMEarth.Color.PURPLE.withAlpha(0.1)
            break
          default:
            break
        }
        configPlatformSensorVolumes(volumesDatas, params)
      })
      .catch((err) => {
        console.log('获取平台渲染图形信息失败', err)
      })
  } else {
    // 清除传感器遮罩
    let params = { name: store.getters.getCurrentNode.code }
    // 根据传感器类型开启对应形态的volumes
    getPlatformSensorVolumes({ platform: params.name })
      .then((res) => {
        console.log(`获取平台渲染图形信息${res.status}`, res.data)
        let volumesDatas = res.data
        let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
          params.name,
          'MSIMEarthCZMLProcessContainer'
        )
        if (!window.MSIMEarth.defined(curEntity)) return

        let getPosition = function () {
          let currentTime = window.EarthViewer.clock.currentTime
          let curposition = curEntity.position.getValue(currentTime)
          if (!curposition) return
          return curposition
        }
        // 实例化传感器绘制类
        let sensor = new window.EarthPlugn.sensor({
          earth: window.MSIMEarth,
          viewer: window.EarthViewer
        })
        let idCol = []
        if (!volumesDatas || volumesDatas.length <= 0) {
          console.log('获取不到传感器渲染体数据', volumesDatas)
          return
        }
        volumesDatas.forEach((volumesData) => {
          if (volumesData) {
            let options = {}
            switch (volumesData.Name) {
              case 'acq_radar':
                console.log('清除传感器类型acq_radar', volumesData.Name)
                let id = curEntity.id + '_acq_radar'
                idCol.push(id)
                let removeAcqRadar = sensor.removeSensorAcqRadar()
                removeAcqRadar(id)
                break
              case 'ccd': // Charge-Coupled Device	可见光成像	EO/IR (EO部分)	高分辨率可见光成像、目标识别	被动	白天侦察、目标识别、激光制导
                console.log('清除传感器类型ccd', volumesData)
                // // 构建参数
                // options.id = params.name
                // let removeCCD = sensor.removeSensorCCD()
                // removeCCD(options.id)
                // curEntity.id + '_ccd'
                let ccd_id = curEntity.id //frustum应该只传id就行了，里面会默认拼接
                idCol.push(ccd_id)
                let removeCCD = sensor.removeSensorCCD()
                removeCCD(ccd_id)
                break
              case 'IR': // Infrared	热辐射探测	IRST / EO/IR (IR部分)	红外搜索跟踪(IRST) / 热成像(FLIR)	被动	夜间/恶劣天气探测、导弹告警(MAWS)
                console.log('清除传感器类型IR', volumesData)
                // options.id = params.name
                // let removeIR = sensor.removeSensorIR()
                // removeIR(options)
                let IR_id = curEntity.id + '_IR'
                idCol.push(IR_id)
                let removeIR = sensor.removeSensorIR()
                removeIR(IR_id)
                break
              case 'sar':
                console.log('清除传感器类型sar', volumesData)
                let sar_id = curEntity.id + '_sar'
                idCol.push(sar_id)
                let removeSar = sensor.removeSensorSar()
                removeSar(sar_id)
                break
              case 'rwr': // Radar Warning Receiver	射频信号接收	ESM	雷达威胁告警、辐射源识别与定向	被动	战机/直升机自卫告警、态势感知
                console.log('清除传感器类型rwr', volumesData)
                let rwr_id = curEntity.id + '_rwr'
                idCol.push(rwr_id)
                let removeRwr = sensor.removeSensorRwr()
                removeRwr(rwr_id)
                break
              case 'laser_designator': //一种关键的目标照射设备，主要用于为激光制导武器（如导弹、炸弹、炮弹）提供精确制导。吊舱集成（如瞄准吊舱），飞行员锁定目标后自动照射	美军“狙击手”吊舱、中国WMD-7吊舱
                console.log('清除传感器类型laser_designator', volumesData)
                let laser_designator_id = curEntity.id + '_laser_designator'
                idCol.push(laser_designator_id)
                let removeLaserDesignator = sensor.removeSensorLaserDesignator()
                removeLaserDesignator(laser_designator_id)
                break
              case 'laser_tracker': //激光跟踪器（Laser Tracker） 是一种高精度动态测量设备，通过激光测距和角度反馈实时追踪目标的空间位置和运动轨迹。其核心价值在于微米级实时定位，应用领域远超单纯的军事用途。导弹/无人机试飞轨迹跟踪,舰载武器平台动态校准, 隐身战机RCS测量辅助定位
                console.log('清除传感器类型laser_tracker', volumesData)
                let laser_tracker_id = curEntity.id + '_laser_tracker'
                idCol.push(laser_tracker_id)
                let removeLaser_tracker = sensor.removeSensorLaser_tracker()
                removeLaser_tracker(laser_tracker_id)
                break
              case 'ew_radar':
                options.id = params.name
                let removeEW_Radar = sensor.removeSensorEW_RadarJam()
                removeEW_Radar(options.id)
                let ew_radar_id = curEntity.id + '_ew_radar'
                // idCol.push(ew_radar_id)
                window.EarthViewer.entities.removeById(ew_radar_id)
                break
              case 'eyes':
                let eyes_id = curEntity.id + '_eyes'
                idCol.push(eyes_id)
                let removeEyes = sensor.removeSensorEyes()
                removeEyes(eyes_id)
                break
              case 'radar':
                let radar_id = curEntity.id + '_radar'
                idCol.push(radar_id)
                window.EarthViewer.entities.removeById(radar_id)
                break
              case 'milds':
                let milds_id = curEntity.id + '_milds'
                idCol.push(milds_id)
                let removeMilds = sensor.removeSensorMilds()
                removeMilds(milds_id)
                break
              case 'geo_sensor':
                let geo_sensor_id = curEntity.id + '_geo_sensor'
                idCol.push(geo_sensor_id)
                let removeGeo_sensor = sensor.removeSensorGeo_sensor()
                removeGeo_sensor(geo_sensor_id)
                break
              case 'EnvelopePaintSensor':
                let envelope_paint_sensor_id =
                  curEntity.id + '_envelope_paint_sensor'
                idCol.push(envelope_paint_sensor_id)
                let removeEnvelopePaintSensor =
                  sensor.removeSensorEnvelopePaintSensor()
                removeEnvelopePaintSensor(envelope_paint_sensor_id)
                break
              default:
                console.log(
                  '传感器类型不在当前设定范围内，需要基于仿真平台可视化效果扩展类型' +
                    volumesData.Name,
                  volumesData
                )
                break
            }
          }
        })
      })
      .catch((err) => {
        console.log('获取平台渲染图形信息失败', err)
      })
    // 清除各类传感器感知范围
    // let params = {
    //   name: store.getters.getCurrentNode.code
    // }
    // window.EarthViewer.entities.removeById(params.name)
    // if (store.getters.getCurrentNode.code == 'soj_south') {
    //   clearRadarPenetrating(store.getters.getCurrentNode.code)
    //   if (radarFunObj[store.getters.getCurrentNode.code]) {
    //     delete radarFunObj[store.getters.getCurrentNode.code]
    //   }
    // } else if (store.getters.getCurrentNode.code.indexOf('KJ-500') > -1) {
    //   clearEllipsoidRadar(store.getters.getCurrentNode.code)
    //   if (radarEllipsoidObj[store.getters.getCurrentNode.code]) {
    //     delete radarEllipsoidObj[store.getters.getCurrentNode.code]
    //   }
    // } else {
    //   clearFrustum(store.getters.getCurrentNode.code)
    //   if (frustumFunObj[store.getters.getCurrentNode.code]) {
    //     delete frustumFunObj[store.getters.getCurrentNode.code]
    //   }
    // }
    // setTimeout(() => {
    //   removeSightedFrame()
    // }, 1000)
  }
}
// 匹配通过CSV文件配置的平台信息
export function configPlateformSide(id) {
  // 处理PA消息类型后缀
  if (id.slice(-2) === 'PA') {
    id = id.slice(0, -2)
  }
  // 获取模型中文名称配置
  const plateValues = store.state.sceneModule.modelCHNNameValue
  // 基于id匹配数据
  const plateValue = plateValues[id]

  // 检查匹配结果，确保安全返回camp字段
  if (
    plateValue &&
    typeof plateValue === 'object' &&
    'name' in plateValue &&
    'camp' in plateValue
  ) {
    return plateValue.camp
  }

  // 如果未找到匹配数据，返回默认值side white
  return 'white'
}
// 根据平台渲染图形信息配置传感器感知范围
function configPlatformSensorVolumes(volumesDatas, params) {
  // 实例化传感器绘制类
  let sensor = new window.EarthPlugn.sensor({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  let idCol = []
  volumesDatas.forEach((volumesData) => {
    if (volumesData) {
      let options = {}
      switch (volumesData.Name) {
        case 'acq_radar':
          console.log('传感器类型acq_radar', volumesData.Name)
          let createAcqRadar = sensor.initSensorAcq_radar()
          createAcqRadar(params, volumesData)
          break
        case 'ccd': // Charge-Coupled Device	可见光成像	EO/IR (EO部分)	高分辨率可见光成像、目标识别	被动	白天侦察、目标识别、激光制导
          console.log('传感器类型ccd', volumesData)
          // 构建参数
          options.id = params.name
          options.heading = volumesData.Yaw
          options.pitch = volumesData.Pitch
          options.roll = volumesData.YawRoll
          let modeCCD = volumesData.Modes[0]
          if (modeCCD) {
            options.AzimuthMax = modeCCD.Beams[0].AzimuthMax
            options.AzimuthMin = modeCCD.Beams[0].AzimuthMin
            options.RangeMax = modeCCD.Beams[0].RangeMax
          }
          let createCCD = sensor.initSensorCCD()
          createCCD(options)

          break
        case 'IR': // Infrared	热辐射探测	IRST / EO/IR (IR部分)	红外搜索跟踪(IRST) / 热成像(FLIR)	被动	夜间/恶劣天气探测、导弹告警(MAWS)
          console.log('传感器类型IR', volumesData)
          let createIR = sensor.initSensorIR()
          createIR(options)

          break
        case 'sar':
          // console.log('传感器类型sar', volumesData)
          let createSar = sensor.initSensorSar()
          createSar(params, volumesData)
          break
        case 'rwr': // Radar Warning Receiver	射频信号接收	ESM	雷达威胁告警、辐射源识别与定向	被动	战机/直升机自卫告警、态势感知
          console.log('传感器类型rwr', volumesData)
          let createRwr = sensor.initSensorRwr()
          createRwr(params, volumesData)
          break
        case 'laser_designator': //一种关键的目标照射设备，主要用于为激光制导武器（如导弹、炸弹、炮弹）提供精确制导。吊舱集成（如瞄准吊舱），飞行员锁定目标后自动照射	美军“狙击手”吊舱、中国WMD-7吊舱
          let createLaserDesignator = sensor.initSensorLaserDesignator()
          createLaserDesignator(params, volumesData)
          break
        case 'laser_tracker': //激光跟踪器（Laser Tracker） 是一种高精度动态测量设备，通过激光测距和角度反馈实时追踪目标的空间位置和运动轨迹。其核心价值在于微米级实时定位，应用领域远超单纯的军事用途。导弹/无人机试飞轨迹跟踪,舰载武器平台动态校准, 隐身战机RCS测量辅助定位
          let createLaser_tracker = sensor.initSensorLaser_tracker()
          createLaser_tracker(params, volumesData)
          break
        case 'ew_radar':
          options.id = params.name
          options.heading = volumesData.Yaw
          options.pitch = volumesData.Pitch
          options.roll = volumesData.YawRoll
          options.color = window.MSIMEarth.Color.RED.withAlpha(0.1)
          let modeEW_Radar = volumesData.Modes[0]
          if (modeEW_Radar) {
            options.AzimuthMax = modeEW_Radar.Beams[0].AzimuthMax
            options.AzimuthMin = modeEW_Radar.Beams[0].AzimuthMin
            options.RangeMax = modeEW_Radar.Beams[0].RangeMax
          }
          let createEW_Radar = sensor.initSensorEW_Radar()
          createEW_Radar(options)
          break
        case 'eyes':
          console.log('传感器eyes', volumesData)
          let createEyes = sensor.initSensorEyes()
          createEyes(params, volumesData)
          break
        case 'radar':
          console.log('传感器radar', volumesData)
          volumesData.Modes.forEach((Mode) => {
            let id = curEntity.id + '_radar'
            idCol.push(id)
            window.EarthViewer.entities.removeById(id)
            window.EarthViewer.entities.add({
              id: id,
              position: new window.MSIMEarth.CallbackProperty(
                getPosition,
                false
              ),
              ellipsoid: {
                radii: new window.MSIMEarth.Cartesian3(
                  Mode.Beams[0].RangeMax,
                  Mode.Beams[0].RangeMax,
                  Mode.Beams[0].RangeMax
                ),
                innerRadii: new window.MSIMEarth.Cartesian3(10.0, 10.0, 10.0),
                // minimumClock:
                //   window.MSIMEarth.Math.PI * 2 -
                //   Mode.Beams[0].FOVAzimuthMax +
                //   window.MSIMEarth.Math.ONE_OVER_TWO_PI,
                // maximumClock:
                //   window.MSIMEarth.Math.PI * 2 -
                //   Mode.Beams[0].FOVAzimuthMin +
                //   window.MSIMEarth.Math.ONE_OVER_TWO_PI,
                minimumCone: Mode.Beams[0].AzimuthMax * 0.25,
                maximumCone: window.MSIMEarth.Math.PI_OVER_TWO - 3.1,
                material: params.color,
                stackPartitions: 16,
                slicePartitions: 16,
                outline: true,
                outlineColor: window.MSIMEarth.Color.BLACK.withAlpha(0.5)
              }
            })
          })
          // volumesData.Modes.forEach((Mode) => {
          //   let id = curEntity.id + '_radar'
          //   idCol.push(id)
          //   window.EarthViewer.entities.removeById(id)
          //   window.EarthViewer.entities.add({
          //     id: id,
          //     position: new window.MSIMEarth.CallbackProperty(
          //       getPosition,
          //       false
          //     ),
          //     ellipsoid: {
          //       radii: new window.MSIMEarth.Cartesian3(
          //         Mode.Beams[0].RangeMax,
          //         Mode.Beams[0].RangeMax,
          //         Mode.Beams[0].RangeMax
          //       ),
          //       innerRadii: new window.MSIMEarth.Cartesian3(
          //         10.0,
          //         10.0,
          //         10.0
          //       ),
          //       minimumClock:
          //         window.MSIMEarth.Math.PI * 2 -
          //         Mode.Beams[0].FOVAzimuthMax +
          //         window.MSIMEarth.Math.ONE_OVER_TWO_PI,
          //       maximumClock:
          //         window.MSIMEarth.Math.PI * 2 -
          //         Mode.Beams[0].FOVAzimuthMin +
          //         window.MSIMEarth.Math.ONE_OVER_TWO_PI,
          //       minimumCone: Mode.Beams[0].AzimuthMax * 0.25,
          //       maximumCone: window.MSIMEarth.Math.PI_OVER_TWO,
          //       material: window.MSIMEarth.Color.RED.withAlpha(0.1),
          //       stackPartitions: 16,
          //       slicePartitions: 16,
          //       outline: true
          //     }
          //   })
          // })
          break
        case 'milds':
          console.log('传感器milds', volumesData)
          let createMilds = sensor.initSensorMilds()
          createMilds(params, volumesData)
          break
        case 'geo_sensor':
          console.log('传感器geo_sensor', volumesData)
          let createGeo_sensor = sensor.initSensorGeo_sensor()
          createGeo_sensor(params, volumesData)
          break
        case 'EnvelopePaintSensor':
          console.log('传感器EnvelopePaintSensor', volumesData)
          let createEnvelopePaintSensor = sensor.initSensorEnvelopePaintSensor()
          createEnvelopePaintSensor(params, volumesData)
          break
        default:
          console.log(
            '传感器类型不在当前设定范围内，需要基于仿真平台可视化效果扩展类型' +
              volumesData.Name,
            volumesData
          )
          break
      }
    }
  })
}
// 勾选功能干扰范围
export function entityJAMChange(value) {
  if (value) {
    let params = { name: store.getters.getCurrentNode.code }
    // 根据传感器类型开启对应形态的volumes
    getPlatformJammerVolumes({ platform: params.name })
      .then((res) => {
        console.log(`获取平台干扰图形信息${res.status}`, res.data)
        let volumesDatas = res.data
        let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
          params.name,
          'MSIMEarthCZMLProcessContainer'
        )
        if (!window.MSIMEarth.defined(curEntity)) return

        console.log(curEntity)

        let getPosition = function () {
          let currentTime = window.EarthViewer.clock.currentTime
          let curposition = curEntity.position.getValue(currentTime)
          if (!curposition) return
          return curposition
        }
        // 实例化传感器绘制类
        let sensor = new window.EarthPlugn.sensor({
          earth: window.MSIMEarth,
          viewer: window.EarthViewer
        })
        let idCol = []
        if (!volumesDatas || volumesDatas.length <= 0) {
          console.log('获取不到传感器渲染体数据', volumesDatas, params.name)
          return
        }
        volumesDatas.forEach((volumesData) => {
          if (volumesData) {
            let options = {}
            switch (volumesData.Name) {
              case 'acq_radar':
                console.log('传感器类型acq_radar', volumesData.Name)
                volumesData.Modes.forEach((Mode) => {
                  let id = curEntity.id + 'acq_radar'
                  idCol.push(id)
                  window.EarthViewer.entities.removeById(id)
                  window.EarthViewer.entities.add({
                    id: id,
                    position: new window.MSIMEarth.CallbackProperty(
                      getPosition,
                      false
                    ),
                    ellipsoid: {
                      radii: new window.MSIMEarth.Cartesian3(
                        Mode.Beams[0].RangeMax,
                        Mode.Beams[0].RangeMax,
                        Mode.Beams[0].RangeMax
                      ),
                      innerRadii: new window.MSIMEarth.Cartesian3(
                        10.0,
                        10.0,
                        10.0
                      ),
                      minimumCone: Mode.Beams[0].AzimuthMax * 0.25,
                      maximumCone: window.MSIMEarth.Math.PI_OVER_TWO,
                      material: window.MSIMEarth.Color.BLUE.withAlpha(0.1),
                      stackPartitions: 16,
                      slicePartitions: 16,
                      outline: true
                    }
                  })
                })
                break
              case 'ccd': // Charge-Coupled Device	可见光成像	EO/IR (EO部分)	高分辨率可见光成像、目标识别	被动	白天侦察、目标识别、激光制导
                console.log('传感器类型ccd', volumesData)
                // 构建参数
                options.id = params.name
                // options.heading = volumesData.Yaw
                // options.pitch = volumesData.Pitch
                // options.roll = volumesData.YawRoll

                // let modeCCD = volumesData.Modes[0]
                // if (modeCCD) {
                //   options.AzimuthMax = modeCCD.Beams[0].AzimuthMax
                //   options.AzimuthMin = modeCCD.Beams[0].AzimuthMin
                //   options.RangeMax = modeCCD.Beams[0].RangeMax
                // }
                let createCCD = sensor.initSensorCCD()
                createCCD(options)
                break
              case 'IR': // Infrared	热辐射探测	IRST / EO/IR (IR部分)	红外搜索跟踪(IRST) / 热成像(FLIR)	被动	夜间/恶劣天气探测、导弹告警(MAWS)
                console.log('传感器类型IR', volumesData)
                options.id = params.name
                let createIR = sensor.initSensorIR()
                createIR(options)
                break
              case 'sar':
                console.log('传感器类型sar', volumesData)
                break
              case 'rwr': // Radar Warning Receiver	射频信号接收	ESM	雷达威胁告警、辐射源识别与定向	被动	战机/直升机自卫告警、态势感知
                console.log('传感器类型rwr', volumesData)
                break
              case 'laser_designator': //一种关键的目标照射设备，主要用于为激光制导武器（如导弹、炸弹、炮弹）提供精确制导。吊舱集成（如瞄准吊舱），飞行员锁定目标后自动照射	美军“狙击手”吊舱、中国WMD-7吊舱
                break
              case 'laser_tracker': //激光跟踪器（Laser Tracker） 是一种高精度动态测量设备，通过激光测距和角度反馈实时追踪目标的空间位置和运动轨迹。其核心价值在于微米级实时定位，应用领域远超单纯的军事用途。导弹/无人机试飞轨迹跟踪,舰载武器平台动态校准, 隐身战机RCS测量辅助定位
                break
              case 'ew_radar':
                options.id = params.name
                let createEW_Radar = sensor.initSensorEW_Radar()
                createEW_Radar(options.id)
                break
              case 'fwd_jammer':
                options.id = params.name
                options.heading = volumesData.Yaw
                options.pitch = volumesData.Pitch
                options.roll = volumesData.YawRoll
                let modeJAM = volumesData.Modes[0]
                if (modeJAM) {
                  options.AzimuthMax = modeJAM.Beams[0].AzimuthMax
                  options.AzimuthMin = modeJAM.Beams[0].AzimuthMin
                  options.RangeMax = modeJAM.Beams[0].RangeMax
                }
                let createJAM = sensor.initSensorJAM()
                createJAM(options)
                break
              default:
                console.log(
                  '传感器类型不在当前设定范围内，需要基于仿真平台可视化效果扩展类型' +
                    volumesData.Name,
                  volumesData
                )
                break
            }
          }
        })
      })
      .catch((err) => {
        console.log('获取平台渲染图形信息失败', err)
      })
  } else {
    let params = { name: store.getters.getCurrentNode.code }
    // 根据传感器类型开启对应形态的volumes
    getPlatformJammerVolumes({ platform: params.name })
      .then((res) => {
        console.log(`获取平台渲染图形信息${res.status}`, res.data)
        let volumesDatas = res.data
        let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
          params.name,
          'MSIMEarthCZMLProcessContainer'
        )
        if (!window.MSIMEarth.defined(curEntity)) return

        let getPosition = function () {
          let currentTime = window.EarthViewer.clock.currentTime
          let curposition = curEntity.position.getValue(currentTime)
          if (!curposition) return
          return curposition
        }
        // 实例化传感器绘制类
        let sensor = new window.EarthPlugn.sensor({
          earth: window.MSIMEarth,
          viewer: window.EarthViewer
        })
        let idCol = []
        if (!volumesDatas || volumesDatas.length <= 0) {
          console.log('获取不到传感器渲染体数据', volumesDatas)
          return
        }
        volumesDatas.forEach((volumesData) => {
          if (volumesData) {
            let options = {}
            switch (volumesData.Name) {
              case 'acq_radar':
                console.log('清除传感器类型acq_radar', volumesData.Name)
                break
              case 'ccd': // Charge-Coupled Device	可见光成像	EO/IR (EO部分)	高分辨率可见光成像、目标识别	被动	白天侦察、目标识别、激光制导
                debugger
                console.log('清除传感器类型ccd', volumesData)
                options.id = params.name
                options.heading = volumesData.Yaw
                options.pitch = volumesData.Pitch
                options.roll = volumesData.YawRoll

                let modeCCD = volumesData.Modes[0]
                if (modeCCD) {
                  options.AzimuthMax = modeCCD.Beams[0].AzimuthMax
                  options.AzimuthMin = modeCCD.Beams[0].AzimuthMin
                  options.RangeMax = modeCCD.Beams[0].RangeMax
                }
                let removeCCD = sensor.removeSensorCCD()
                removeCCD(options)
                break
              case 'IR': // Infrared	热辐射探测	IRST / EO/IR (IR部分)	红外搜索跟踪(IRST) / 热成像(FLIR)	被动	夜间/恶劣天气探测、导弹告警(MAWS)
                console.log('清除传感器类型IR', volumesData)
                options.id = params.name
                options.heading = volumesData.Yaw
                options.pitch = volumesData.Pitch
                options.roll = volumesData.YawRoll
                let modeIR = volumesData.Modes[0]
                if (modeIR) {
                  options.AzimuthMax = modeIR.Beams[0].AzimuthMax
                  options.AzimuthMin = modeIR.Beams[0].AzimuthMin
                  options.RangeMax = modeIR.Beams[0].RangeMax
                }
                let removeIR = sensor.removeSensorIR()
                removeIR(options)
                break
              case 'sar':
                console.log('清除传感器类型sar', volumesData)
                break
              case 'rwr': // Radar Warning Receiver	射频信号接收	ESM	雷达威胁告警、辐射源识别与定向	被动	战机/直升机自卫告警、态势感知
                console.log('清除传感器类型rwr', volumesData)
                break
              case 'laser_designator': //一种关键的目标照射设备，主要用于为激光制导武器（如导弹、炸弹、炮弹）提供精确制导。吊舱集成（如瞄准吊舱），飞行员锁定目标后自动照射	美军“狙击手”吊舱、中国WMD-7吊舱
                console.log('清除传感器类型laser_designator', volumesData)
                break
              case 'laser_tracker': //激光跟踪器（Laser Tracker） 是一种高精度动态测量设备，通过激光测距和角度反馈实时追踪目标的空间位置和运动轨迹。其核心价值在于微米级实时定位，应用领域远超单纯的军事用途。导弹/无人机试飞轨迹跟踪,舰载武器平台动态校准, 隐身战机RCS测量辅助定位
                console.log('清除传感器类型laser_tracker', volumesData)
                break
              case 'ew_radar':
                options.id = params.name
                options.heading = volumesData.Yaw
                options.pitch = volumesData.Pitch
                options.roll = volumesData.YawRoll
                let modeEW_Radar = volumesData.Modes[0]
                if (modeEW_Radar) {
                  options.AzimuthMax = modeEW_Radar.Beams[0].AzimuthMax
                  options.AzimuthMin = modeEW_Radar.Beams[0].AzimuthMin
                  options.RangeMax = modeEW_Radar.Beams[0].RangeMax
                }
                let removeEW_Radar = sensor.removeSensorEW_RadarJam()
                removeEW_Radar(options.id)
                break
              case 'fwd_jammer':
                options.id = params.name
                options.heading = volumesData.Yaw
                options.pitch = volumesData.Pitch
                options.roll = volumesData.YawRoll
                let modeJAM = volumesData.Modes[0]
                if (modeJAM) {
                  options.AzimuthMax = modeJAM.Beams[0].AzimuthMax
                  options.AzimuthMin = modeJAM.Beams[0].AzimuthMin
                  options.RangeMax = modeJAM.Beams[0].RangeMax
                }
                let removeJAM = sensor.removeSensorJAM()
                removeJAM(options)
                break
              default:
                console.log(
                  '传感器类型不在当前设定范围内，需要基于仿真平台可视化效果扩展类型' +
                    volumesData.Name,
                  volumesData
                )
                break
            }
          }
        })
      })
      .catch((err) => {
        console.log('获取平台渲染图形信息失败', err)
      })
  }
}

//通过sse消息通知进入某天气区域，感知锥被干扰
export function rangeByWeather(value) {
  let params = { name: value.id }
  // setWeatherText(value)//临时注释进出天气的消息通知
  if (
    !frustumFunObj[value.id] &&
    !radarFunObj[value.id] &&
    !radarEllipsoidObj[value.id]
  )
    return
  getPlateSWMessageV2(params).then((res) => {
    if (res.code == 200) {
      if (res.data['sensors'] && res.data['sensors'].length > 0) {
        let argument = res.data['sensors'][0]
        let range = argument.mr
        let color = argument.color
          ? JSON.parse(argument.color)
          : [255, 255, 255]
        let type = argument.type
        if (!range) return
        value.range = range
        value.color = color
        value.type = type
        changeFrumstumByInterference(value)
      }
    }
  })
}
//存储进入天气状态的文字
function setWeatherText(value) {
  let id = value.id,
    isEnter = value.isIN,
    msg = value.msg.split('-')[1]
  //右上角消息提示弹框
  // beautyToast.success({
  //   title: '添加',
  //   // message: value.msg.split('-')[0] + value.msg.split('-')[1],
  //   message: value.msg,
  //   darkTheme: true
  // })
  let weatherTypeInfor = store.state.sceneModule.weatherTypeInfor
  if (!weatherTypeInfor[id]) {
    weatherTypeInfor[id] = {}
  }
  weatherTypeInfor[id].msg = msg
  weatherTypeInfor[id].isEnter = isEnter
  // showTip({ id: id, msg: value.msg.split('-')[0] + value.msg.split('-')[1] })
  showTip({ id: id, msg: value.msg })
  store.commit('setWeatherTypeInfor', weatherTypeInfor)
}
//组装视锥变化的参数
const changeFrumstumByInterference = (value) => {
  let id = value.id,
    isEnter = value.isIN,
    msg = value.msg.split('-')[1]
  //右上角消息提示弹框
  // beautyToast.success({
  //   title: '添加',
  //   message: value.msg.split('-')[0] + value.msg.split('-')[1],
  //   darkTheme: true
  // })
  let planeAreaConfig = store.state.sceneModule.planeAreaConfig
  if (!planeAreaConfig[id]) {
    planeAreaConfig[id] = {}
  }
  // planeAreaConfig[id].msg = msg
  // planeAreaConfig[id].isEnter = isEnter
  planeAreaConfig[id].range = value.range
  planeAreaConfig[id].color = value.color
  planeAreaConfig[id].type = value.type
  // showTip({ id: id, msg: value.msg.split('-')[0] + value.msg.split('-')[1] })
  store.commit('setPlaneAreaConfig', planeAreaConfig)
  let currentConfig = planeAreaConfig[id]
  if (frustumFunObj[id]) {
    changePerceptionDis({
      subject: frustumFunObj[id],
      type: 'frustum',
      currentConfig: currentConfig
    })
  } else if (radarFunObj[id]) {
    changePerceptionDis({
      subject: radarFunObj[id],
      type: 'radar',
      currentConfig: currentConfig
    })
  } else if (radarEllipsoidObj[id]) {
    changePerceptionDis({
      subject: radarEllipsoidObj[id],
      type: 'radarEllipsoid',
      currentConfig: currentConfig
    })
  }
}
//显示淡出提示文字
const showTip = (params) => {
  let id = params.id
  let entity = window.EarthPlugn.entity._GetCZMLEntity(
    id,
    'MSIMEarthCZMLProcessContainer'
  )
  // let sourceSource = window.EarthViewer.dataSources.getByName(id)
  // let entity = sourceSource.length
  //   ? sourceSource[0].entities.values[0]
  //   : window.EarthViewer.entities.getById(id)
  if (!entity) return
  let position = entity.position
  let curposition = position.getValue(window.EarthViewer.clock.currentTime)
  if (!curposition) return
  if (
    typeof curposition.x === 'undefined' ||
    typeof curposition.y === 'undefined' ||
    typeof curposition.z === 'undefined'
  ) {
    return
  }
  if (curposition) {
    let entityCartographic =
      window.MSIMEarth.Cartographic.fromCartesian(curposition)

    let sourceLng = window.MSIMEarth.Math.toDegrees(
      entityCartographic.longitude
    )
    let sourceLat = window.MSIMEarth.Math.toDegrees(entityCartographic.latitude)
    let sourceAlt = entityCartographic.height
    window.sceneAction.systemMessage.labelMessage({
      sysMessageId: 'moveCamera_sysMessage',
      sysMessagePosition: [sourceLng, sourceLat],
      sysMessageText: params.msg
    })
  }
}
//改变视锥的距离和颜色
const changePerceptionDis = (params) => {
  if (params.subject) {
    let perceptionObj = params.subject
    let originalColor =
      params.type == 'frustum'
        ? params.currentConfig.color
        : perceptionObj.ellipse.material._color.getValue()
    if (params.type == 'frustum') {
      //锥
      perceptionObj.far = params.currentConfig.range
      let colorType = false
      let changeColor = window.setInterval(() => {
        colorType = !colorType
        perceptionObj.outlineColor = colorType ? [241, 236, 67] : originalColor //黄色
      }, 900)
      setTimeout(() => {
        window.clearInterval(changeColor)
        perceptionObj.outlineColor = originalColor
        changeColor = null
      }, 8000)
    } else if (params.type == 'radar') {
      let radius = params.currentConfig.range / 2
      perceptionObj.ellipse._semiMinorAxis.setValue(radius)
      perceptionObj.ellipse._semiMajorAxis.setValue(radius)
      perceptionObj.ellipse.material.flicker.setValue(true)
    }
  }
}
//通信半径
export function communicationRadiusChange(value) {
  if (value) {
    createEntityCircleFun('communicationRadius', 30000, [0, 255, 0, 1], true) // 最后一个参数控制绘制圆面或者圆圈，true为画圈
  } else {
    removeEntityCircleById(
      'communicationRadius' + store.getters.getCurrentNode.code
    )
  }
}
//火力半径
export function firepowerRadiusChange(value) {
  if (value) {
    let fireRaduis
    // createEntityCircleFun('operationalRadius', 50000, [255, 0, 0, 0], true) // 与感知半径同理，请看感知半径说明
    let entity = window.EarthPlugn.entity._GetCZMLEntity(
      store.getters.getCurrentNode.code,
      'MSIMEarthCZMLProcessContainer'
    )
    let color
    if (entity?.properties?.airplaneAction?._value?.side == 'red') {
      color = [255, 0, 0, 0]
    } else if (entity?.properties?.airplaneAction?._value?.side == 'blue') {
      color = [0, 0, 255, 0]
    } else if (entity?.properties?.airplaneAction?._value?.side == 'green') {
      color = [0, 255, 0, 0]
    } else if (entity?.properties?.airplaneAction?._value?.side == 'purple') {
      color = [128, 8, 235, 0]
    }
    let params1 = { platform: store.getters.getCurrentNode.code }
    getPlatformState(params1).then((res) => {
      if (res.status == 'success') {
        fireRaduis = res.data?.FireRadius
        if (fireRaduis) {
          window.sceneAction.planeCzmlManage.createPan({
            sourId: store.getters.getCurrentNode.code,
            type: 'firepowerRadius',
            radius: fireRaduis,
            color: color,
            angle: 140
          })
        } else {
          ElMessage.warning(
            store.state.sceneModule.currentFlyType.chineseName + '无火力半径！'
          )
        }
      }
    })
  } else {
    removePanFirePowerRadiusEntityById()
  }
}
// 通信链路
export function commChina(value) {
  const id = store.getters.getCurrentNode.code
  if (value) {
    const entityMethod = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
    if (id) {
      store.state.sceneModule.sceneEnityData.forEach((json) => {
        if (json.Data.Name === id) {
          // 根据通信链路信息可视化链路
          json.Data.CommandChain.forEach((chain) => {
            // sourceid: id   targetid: chain.CName   chain.ChainName: "default"
            // 根据ChainName构建对应类型的通信链路，目前多是default所以先不区分
            let sourcePosition = entityMethod.getPositionGraphicByEntityId(id)
            let targetPosition = entityMethod.getPositionGraphicByEntityId(
              chain.CName
            )
            if (!sourcePosition || sourcePosition.length <= 0) return
            if (!targetPosition || targetPosition.length <= 0) return
            window.EarthViewer.entities.add({
              id: `${id}==${chain.CName}==${chain.ChainName}`,
              polyline: {
                positions: window.MSIMEarth.Cartesian3.fromDegreesArrayHeights([
                  sourcePosition[0],
                  sourcePosition[1],
                  sourcePosition[2],
                  targetPosition[0],
                  targetPosition[1],
                  targetPosition[2]
                ]),
                width: 5,
                arcType: window.MSIMEarth.ArcType.NONE,
                material: new window.MSIMEarth.PolylineArrowMaterialProperty(
                  window.MSIMEarth.Color.BLUE
                ),
                distanceDisplayCondition: [0, 50e5]
              }
            })
          })
          json.Data.Comm.forEach((c) => {
            let positionCar3 = entityMethod.getPositionCartesian3ByEntityId(id)
            if (positionCar3) {
              window.EarthViewer.entities.add({
                id: `${id}==${c.Type}`,
                position: positionCar3,
                ellipse: {
                  semiMinorAxis: parseFloat(c.MaxRange),
                  semiMajorAxis: parseFloat(c.MaxRange),
                  material: window.MSIMEarth.Color.BLUE,
                  fill: false,
                  outlineColor: window.MSIMEarth.Color.BLUE,
                  outlineWidth: 5,
                  distanceDisplayCondition:
                    new window.MSIMEarth.DistanceDisplayCondition(0, 50e5),
                  outline: true // height must be set for outline to display
                }
              })
            } else {
              console.log('绘制comm通信范围时没有拿到远点位置', positionCar3)
            }
          })
        }
      })
    }
  } else {
    if (id) {
      store.state.sceneModule.sceneEnityData.forEach((json) => {
        if (json.Data.Name === id) {
          // 根据通信链路信息可视化链路
          json.Data.CommandChain.forEach((chain) => {
            window.EarthViewer.entities.removeById(
              `${id}==${chain.CName}==${chain.ChainName}`
            )
          })
          json.Data.Comm.forEach((c) => {
            window.EarthViewer.entities.removeById(`${id}==${c.Type}`)
          })
        }
      })
    }
  }
}
const removePanFirePowerRadiusEntityById = () => {
  if (
    window.EarthViewer.entities.getById(
      store.getters.getCurrentNode.code + 'pan' + 'firepowerRadius'
    )
  ) {
    window.EarthViewer.entities.removeById(
      store.getters.getCurrentNode.code + 'pan' + 'firepowerRadius'
    )
  }
}
// 传感器范围
export function entitySensorChange(value) {
  if (value) {
    let res = store.getters.getSensorShow
    let max = 0
    for (let i = 0; i < res.data.sensors.length; i++) {
      if (res.data.sensors[i].mr > max) {
        max = res.data.sensors[i].mr
      }
    }
    let list = JSON.parse(localStorage.getItem('currentFlyType'))
    for (let i = 0; i < list.length; i++) {
      if (list[i].name == store.state.sceneModule.currentFlyType.name) {
        removeEntityCircleById('entitySensor' + list[i].name)
      } else {
        createEntityCircleFun('entitySensor', max, [255, 255, 0, 1], true) // 与感知半径同理，请看感知半径说明
      }
    }
  } else {
    removeEntityCircleById('entitySensor' + store.getters.getCurrentNode.code)
  }
}
//干扰范围(全频)
export function fullBandDisbChange(value) {
  if (value) {
    createEntityCircleFun('fullBandDisb', 40000, [192, 125, 252, 1], true) //和通信半径同理，请参考通信配置
  } else {
    removeEntityCircleById('fullBandDisb' + store.getters.getCurrentNode.code)
  }
}
//干扰范围(窄带)
export function narrowBandDisbChange(value) {
  if (value) {
    window.sceneAction.planeCzmlManage.createPan({
      sourId: store.getters.getCurrentNode.code,
      type: 'narrowBandDisb',
      radius: 40000,
      color: [192, 125, 252],
      angle: 90
    })
  } else {
    window.EarthViewer.entities.removeById(
      store.getters.getCurrentNode.code + 'pan' + 'narrowBandDisb'
    )
  }
}
// 雷达覆盖、探测可能性图
export function getEMToolInfoChange(value) {
  if (value) {
    let params = {
      entityName: store.getters.getCurrentNode.code,
      sceneId: store.getters.get_taskData.id
    }
    getRaderGR(params).then(async (res) => {
      if (res.code == 200 && res.data) {
        window.EarthViewer.dataSources
          .add(
            window.MSIMEarth.GeoJsonDataSource.load(res.data.radarCoverage, {
              stroke: window.MSIMEarth.Color.HOTPINK,
              fill: window.MSIMEarth.Color.PINK.withAlpha(0.5),
              strokeWidth: 3,
              clampToGround: true
            })
          )
          .then((dataSources) => {
            dataSources.name = 'eMToolInfo_radarCoverage'
          })
        window.EarthViewer.entities.add({
          id: 'eMToolInfo_probability',
          name: 'eMToolInfo_probability',
          rectangle: {
            coordinates: window.MSIMEarth.Rectangle.fromDegrees(
              res.data.minLon,
              res.data.minLat,
              res.data.maxLon,
              res.data.maxLat
            ),
            material: res.data.probability
          }
        })
      }
    })
  } else {
    window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
      if (dataSource._name == 'eMToolInfo_radarCoverage') {
        window.EarthViewer.dataSources.remove(dataSource)
      }
    })
    removeEntityCircleById('eMToolInfo_probability')
  }
}
// 杂波图
export function getNoiseMapChange(value) {
  if (value) {
    let params = {
      entityName: store.getters.getCurrentNode.code
    }
    getNoiseMap(params).then(async (res) => {
      if (res.code == 200 && res.data && res.data.noiseJson) {
        window.EarthViewer.entities.add({
          id: 'noiseMap',
          name: 'noiseMap',
          rectangle: {
            coordinates: window.MSIMEarth.Rectangle.fromDegrees(
              res.data.noiseJson.minLon,
              res.data.noiseJson.minLat,
              res.data.noiseJson.maxLon,
              res.data.noiseJson.maxLat
            ),
            material: res.data.imgUrl
          }
        })
      }
    })
  } else {
    removeEntityCircleById('noiseMap')
  }
}
// 雷达遮罩
export function getLDZZInfoChange1(value) {
  // console.log(
  //   '我也是遮罩状态呀',
  //   store.getters.getCurrentNode.code,
  //   MSIMEarthCZMLProcessContainer
  // )
  if (value) {
    if (EarthAPP.ldzzInternal) {
      console.log('清除了')
      clearInterval(EarthAPP.ldzzInternal)
    }
    // 雷达参数
    let RadarMsg = {}
    // 干扰源参数
    let disMsg = []
    // 雷达载体
    let rt = null
    let rt2 = null
    let cusP = new window.EarthPlugn.customPritive(
      window.MSIMEarth,
      window.EarthViewer
    )
    // 显示雷达遮罩，每500毫秒更新一次
    // 1获取场景内地方干扰源,包括阵营判断、距离判断、参数详情等内容，暂时只有阵营和距离
    EarthAPP.ldzzInternal = setInterval(() => {
      // 1.0 如果存在则清除当前雷达渲染图元
      if (typeof rt !== 'undefined')
        window.EarthViewer.scene.primitives.remove(rt)
      if (typeof rt2 !== 'undefined')
        window.EarthViewer.scene.primitives.remove(rt2)
      // 1.1获取雷达位置并配置雷达属性
      let radarEntity = window.EarthPlugn.entity._GetCZMLEntity(
        store.getters.getCurrentNode.code,
        'MSIMEarthCZMLProcessContainer'
      )
      if (!window.MSIMEarth.defined(radarEntity)) return
      let radarSide = radarEntity.properties?.side?._value
      let grySide = 'red'
      if (radarSide === 'red') {
        grySide = 'blue'
      } else if (radarSide === 'blue') {
        grySide = 'red'
      } else {
        //其他阵营或者没获取到阵营属性
      }
      console.log('当前干扰源阵营', grySide)
      let radarPosition = radarEntity.position.getValue(
        window.EarthViewer.clock.currentTime
      )
      if (!window.MSIMEarth.defined(radarPosition)) return
      let ellipsoid = window.EarthViewer.scene.globe.ellipsoid
      let radarCartographic = ellipsoid.cartesianToCartographic(radarPosition)
      let radarLat = window.MSIMEarth.Math.toDegrees(radarCartographic.latitude)
      let radarLng = window.MSIMEarth.Math.toDegrees(
        radarCartographic.longitude
      )
      let radarAlt = radarCartographic.height
      RadarMsg = {
        Pt: Math.pow(10, 6), //雷达的发射功率 W
        Gt: 40, //雷达的天线主瓣增益 db
        lanBuda: 0.026, // 信号波长m  // 决定了雷达覆盖面范围 值越小范围越小
        thegema: 3, // 目标的雷达反射截面积 m2
        n: 16, //脉冲积累数
        k: 1.38 * Math.pow(10, -23), //玻尔兹曼常数
        Bn: 1.6 * Math.pow(10, 2), //接收机通频带宽度 1.6* pow(10, 6)
        Fn: 10, //雷达接收机噪声系数
        S_Delta_N: 13, //雷达接收机最小可检测信噪比 2
        T0: 290, //以绝对温度表示的雷达接收机噪声温度
        Az_SEnd_Angle: { x: 0, y: 360 }, //方位角
        Pitch_SEnd_Angle: { x: -90, y: 90 }, //俯仰角
        bParameterMiss: false,
        radius: 1500,
        maxRadius: -1,
        lobeWidth_h: 15,
        lobeWidth_v: 10, //天线图主瓣垂直宽度，单位度

        lobeWidth_halfPt_h: 7, //天线图主瓣半功率水平宽度，单位度
        lobeWidth_halfPt_v: 1.5, //天线图主瓣半功率垂直宽度，单位度
        lobeK: 0.07, //k为计算天线图的比例常数
        // 当前使用的位置  116.77067265277556 24.139422679307664

        // pos:{'x':110,'y':34,'z':1200},
        // pos:{'x':116.11102995145029,'y':23.238310896696376,'z':100},
        pos: { x: radarLng, y: radarLat, z: radarAlt },
        merctorPos: { x: 110.5, y: 34.1, z: 1200 },

        dRadarAntenaSpeed: 0.0001,
        dRadarAntenaR_S: 10, //雷达天线的开始方位角
        dRadarAntenaR_E: 100
      }
      // 1.2 更新干扰机参数
      // 1.2遍历场景内动态目标，确认地方干扰源
      if (
        typeof MSIMEarthCZMLProcessContainer !== 'undefined' ||
        typeof MSIMEarthCZMLProcessContainer.entities !== 'undefined'
      ) {
        let czmlEntities = MSIMEarthCZMLProcessContainer.entities.values
        if (typeof czmlEntities !== 'undefined') {
          console.log('我要遍历', czmlEntities)
          // 1.2.1遍历CZML实体集合并将确认为干扰源的实体构造成干扰源填充到干扰源集合
          czmlEntities.forEach((e) => {
            // 首先确认实体为敌对阵营并且是干扰源并且开机状态
            if (e.properties.airplaneAction._value.side === grySide) {
              if (e.id === 'red-yg-9') {
                console.log('我是一个干扰源', e)
                let gryPosition = e.position.getValue(
                  window.EarthViewer.clock.currentTime
                )
                if (!window.MSIMEarth.defined(gryPosition)) return
                let gryCartographic =
                  ellipsoid.cartesianToCartographic(gryPosition)
                let gryLat = window.MSIMEarth.Math.toDegrees(
                  gryCartographic.latitude
                )
                let gryLng = window.MSIMEarth.Math.toDegrees(
                  gryCartographic.longitude
                )
                let gryAlt = gryCartographic.height
                disMsg.push({
                  Pj: 10, //干扰机发射功率
                  Gj: 10, //干扰机的发射增益
                  Bj: 2 * Math.pow(10, 6), //干扰机进入雷达天线的信号带宽
                  Yj: 0.5, //为雷达天线接收干扰机信号的极化损耗
                  Kj: 2, //为指定的压制系数
                  K: 0.04, //为雷达天线的方向性系数0.04-0.1
                  Theta_Half: 20, // 雷达半功率波束宽度 单位度
                  // pos: { x: -85.53768690545911, y: -55.941874522928224, z: 1200000 }
                  pos: {
                    x: gryLng,
                    y: gryLat,
                    z: gryAlt
                  }
                })
                console.log('干扰源参数集合', disMsg)
              }
            }
          })
        }
      }
      // 1.3 可视化干扰效果
      let colors2 = [
        '#020C64',
        '#071E78',
        '#11318B',
        '#1B449F',
        '#2657B3',
        '#306AC7',
        '#3B7EDB',
        '#4E8ADD',
        '#6196E0',
        '#747BE2',
        '#87AFE5',
        '#9BBCE8',
        '#99CDD0',
        '#98D6D4',
        '#97E8AD',
        '#D7DE7E',
        '#EADB70',
        '#F4D9C7',
        '#F4D963',
        '#FAD64F',
        '#F7B42D',
        '#F29B00',
        '#F19303',
        '#F0840A',
        '#EF7511',
        '#EE6618',
        '#EE581F',
        '#E74B1A',
        '#E03F16',
        '#D93312',
        '#D0240E',
        '#C20003',
        '#B50109',
        '#A90210',
        '#8A0519',
        '#6F0015',
        '#50000f'
      ]
      function getDistance(point1, point2) {
        var point1cartographic =
          window.MSIMEarth.Cartographic.fromCartesian(point1)
        var point2cartographic =
          window.MSIMEarth.Cartographic.fromCartesian(point2)
        /**根据经纬度计算出距离**/
        var geodesic = new window.MSIMEarth.EllipsoidGeodesic()
        geodesic.setEndPoints(point1cartographic, point2cartographic)
        var s = geodesic.surfaceDistance
        //返回两点之间的距离
        s = Math.sqrt(
          Math.pow(s, 2) +
            Math.pow(point2cartographic.height - point1cartographic.height, 2)
        )
        return s
      }
      // let distanceRes = getDistance(oPosition, curP)
      let res = GerneralRadar(RadarMsg, disMsg)
      var val = res
      var positions = val.positions //new Float32Array(data.positions);
      var indices = new Uint16Array(val.indices)
      let colors = new Float32Array(val.colors)
      let curColor
      let colorsByDistance = []
      for (let i = 0; i < val.distance.length; i++) {
        const e = val.distance[i]
        if (e < 3000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[0])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 6000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[1])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 9000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[2])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 12000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[3])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 15000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[4])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 20000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[5])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 25000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[6])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 30000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[7])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 35000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[8])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 40000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[9])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 41000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[10])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 42000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[11])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 43000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[12])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 44000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[13])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 45000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[14])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 46000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[15])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 47000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[16])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 48000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[17])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 49000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[18])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 50000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[19])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 51000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[20])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 51500) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[21])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 52000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[22])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 52500) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[23])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 53000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[24])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 53500) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[25])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 54000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[26])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 54500) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[27])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 55000) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[28])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 55500) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[29])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 55600) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[30])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 55700) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[31])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 55800) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[32])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else if (e < 55900) {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[33])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        } else {
          curColor = window.MSIMEarth.Color.fromCssColorString(colors2[36])
          colorsByDistance.push(
            curColor.red,
            curColor.green,
            curColor.blue,
            0.3
          )
        }
      }
      colors = new Float32Array(colorsByDistance)

      let renderPosition = window.MSIMEarth.Cartesian3.fromDegrees(
        radarLng,
        radarLat,
        radarAlt
      )
      rt = cusP.createTriNetPrimitive({
        position: renderPosition,
        viewer: window.EarthViewer,
        positions: positions,
        indices: indices,
        colors: colors,
        primitiveType: 'TRIANGLES',
        id: radarEntity.id + 'TRIANGLES'
      })
      rt2 = cusP.createTriNetPrimitive({
        position: renderPosition,
        viewer: window.EarthViewer,
        positions: positions,
        indices: indices,
        colors: colors,
        primitiveType: 'LINES',
        id: radarEntity.id + 'LINES'
      })
      window.EarthViewer.scene.primitives.add(rt)
      window.EarthViewer.scene.primitives.add(rt2)
    }, 500)
  } else {
    //关闭雷达遮罩
    if (EarthAPP.ldzzInternal) {
      console.log('清除了')
      clearInterval(EarthAPP.ldzzInternal)
      EarthAPP.ldzzInternal = null
      RadarMsg = {}
      disMsg = []
      if (typeof rt !== 'undefined')
        window.EarthViewer.scene.primitives.remove(rt)
      if (typeof rt2 !== 'undefined')
        window.EarthViewer.scene.primitives.remove(rt2)
    }
  }
}

//通过sse消息通知进入作战区域，显示文字
export function showTextByOperationalArea(value) {
  let id = value.id,
    isEnter = value.isIN,
    msg = value.msg.split('-')[1]
  //右上角消息提示弹框
  // beautyToast.success({
  //   title: '作战区域信息',
  //   message: value.msg,
  //   darkTheme: true
  // })
  showTip({ id: id, msg: value.msg })
}

// 展示防空范围
export function showFKFW(value) {
  let params = { name: store.getters.getCurrentNode.code }
  if (!params) return
  // 获取对应实体
  let fkfwPEntity = window.EarthPlugn.entity._GetCZMLEntity(
    params.name,
    'MSIMEarthCZMLProcessContainer'
  )
  if (!window.MSIMEarth.defined(fkfwPEntity)) return
  let fkfwEntityId = fkfwPEntity.id + 'fkfw'
  if (value) {
    let weapens = fkfwPEntity.properties.Weapons
    if (weapens && weapens._value[0]) {
      let PR = weapens._value[0].PR
      let getfkfwPPosition = function () {
        let currentTime = window.EarthViewer.clock.currentTime
        if (!currentTime) return
        let curPosition = fkfwPEntity.position.getValue(currentTime)
        if (!curPosition) return
        return curPosition
      }
      window.EarthViewer.entities.removeById(fkfwEntityId)
      window.EarthViewer.entities.add({
        id: fkfwEntityId,
        position: new window.MSIMEarth.CallbackProperty(
          getfkfwPPosition,
          false
        ),
        ellipsoid: {
          radii: new window.MSIMEarth.Cartesian3(PR, PR, PR),
          innerRadii: new window.MSIMEarth.Cartesian3(10.0, 10.0, 10.0),
          material: window.MSIMEarth.Color.BLUE.withAlpha(0.1),
          maximumCone: window.MSIMEarth.Math.PI_OVER_TWO,
          stackPartitions: 16,
          slicePartitions: 16,
          outline: true
        }
      })
    }
  } else {
    window.EarthViewer.entities.removeById(fkfwEntityId)
  }
}
