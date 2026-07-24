/** 卫星动作类 */
import { Function } from 'core-js'
import CreateFrustum from './customTool/CreateFrumstum.js'
import Prompt from './customTool/prompt/prompt.js'
import Bubble from './customTool/bubble.js'
import BubbleStatic from './customTool/bubbleStatic.js'
import store from '@/store'
import { Position } from '@element-plus/icons-vue'
function PopUp(options) {
  this.viewer = options.viewer
  this.earth = options.earth
  // 结构: [{"actorName":"动作名称", "entityId":"卫星id", "frustum": "视锥体对象", "interval": "视锥体定时器"}]
  this.satelliteActors = [] // 卫星所有动作数组
  this.timer = undefined
  this.promptArray = [] //存储当前弹出框的对象
}
//设置开关机的样式   单独设置样式
PopUp.prototype.setStyleEffect = function (options) {
  this.cancleStyleEffect(options)
  let viewer = this.viewer
  let ds = ''
  let entity = ''
  entity = viewer.entities.getById(options.entityId)
  if (!entity) {
    if (options.czmlSource) {
      let allSource = viewer.dataSources.getByName(options.czmlSource)
      if (allSource.length > 0) {
        ds = allSource[0]
        // ds = viewer.dataSources.getByName(options.czmlSource)[0]
        // 01 验证实体存在
        if (!ds) {
          return
        }
        entity = ds.entities.getById(options.entityId)
      } else {
        entity = window.EarthPlugn.entity._GetCZMLEntity(
          options.entityId,
          'MSIMEarthCZMLProcessContainer'
        )
      }
    } else {
      let allSource = viewer.dataSources.getByName(options.entityId)
      ds = allSource[0]
      // 验证实体存在
      if (!ds) {
        return
      }
      entity = ds.entities.values[0]
    }
  }

  let msg = options.msg || '开机扫描'
  let title = options.group || 'xx编组'
  let params = {
    type: options.type,
    title: title,
    msg: msg
  }
  let content = this.createContent(params)
  // if (entity && entity.label) {
  if (entity) {
    this.loadPrompt({
      type: options.type,
      id: options.entityId,
      content: content,
      entityId: options.entityId,
      datasourceName: options.czmlSource,
      entity: entity,
      msg: msg
    })
  }
}

//设置开关机的样式   单独设置样式
PopUp.prototype.setStyleEffectByReconnaissanceResults = function (options) {
  this.cancleStyleEffect(options)
  let viewer = this.viewer
  let ds = ''
  let entity = ''
  entity = viewer.entities.getById(options.entityId)
  if (!entity) {
    if (options.czmlSource) {
      let allSource = viewer.dataSources.getByName(options.czmlSource)
      if (allSource.length > 0) {
        ds = allSource[0]
        // ds = viewer.dataSources.getByName(options.czmlSource)[0]
        // 01 验证实体存在
        if (!ds) {
          return
        }
        entity = ds.entities.getById(options.entityId)
      } else {
        entity = window.EarthPlugn.entity._GetCZMLEntity(
          options.entityId,
          'MSIMEarthCZMLProcessContainer'
        )
      }
    } else {
      let allSource = viewer.dataSources.getByName(options.entityId)
      ds = allSource[0]
      // 验证实体存在
      if (!ds) {
        return
      }
      entity = ds.entities.values[0]
    }
  }
  let params = {
    type: options.type,
    typeCName: options.typeCName,
    specificCName: options.specificCName,
    name: options.name,
    threatLevel: options.threatLevel || '',
    confidence: options.confidence || '',
    msg: options.msg || '',
    side: options.side || ''
  }
  let content = this.createContent(params)
  // if (entity && entity.label) {
  let popUp = window.document.getElementById('prompt-' + options.entityId)
  if (entity && !popUp) {
    this.loadPrompt({
      type: options.type,
      id: options.entityId,
      content: content,
      entityId: options.entityId,
      datasourceName: options.czmlSource,
      entity: entity,
      msg: options.msg || '',
      side: options.side || ''
    })
  }
}

//取消设置开关机的样式   单独设置样式
PopUp.prototype.cancleStyleEffect = function (options) {
  let Cesium = this.Cesium
  let viewer = this.viewer
  let ds = ''
  let entity = ''
  entity = viewer.entities.getById(options.entityId)
  if (!entity) {
    if (options.czmlSource) {
      let allSource = viewer.dataSources.getByName(options.czmlSource)
      if (allSource.length > 0) {
        ds = allSource[0]
        // 01 验证实体存在
        if (!ds) {
          console.log('数据源不正常')
          return
        }
        entity = ds.entities.getById(options.entityId)
      } else {
        entity = window.EarthPlugn.entity._GetCZMLEntity(
          options.entityId,
          'MSIMEarthCZMLProcessContainer'
        )
      }
    }
  }
  if (!entity) {
    return
  }
  let popUp = window.document.getElementById('prompt-' + options.entityId)
  if (!popUp) {
    this.removePrompt({ entityId: options.entityId, entity: entity })
  }
}
PopUp.prototype.getModelMatrix = function (originPosition, targetPosition) {
  //向量AB
  let vector2 = Cesium.Cartesian3.subtract(
    targetPosition,
    originPosition,
    new Cesium.Cartesian3()
  )
  //归一化
  let normal = Cesium.Cartesian3.normalize(vector2, new Cesium.Cartesian3())
  //旋转矩阵 rotationMatrixFromPositionVelocity源码中有，并未出现在cesiumAPI中
  let rotationMatrix3 = Cesium.Transforms.rotationMatrixFromPositionVelocity(
    originPosition,
    normal
  )
  let orientation = Cesium.Quaternion.fromRotationMatrix(rotationMatrix3)
  const modelMatrix4 = Cesium.Matrix4.fromRotationTranslation(
    rotationMatrix3,
    originPosition
  )
  //点B的模型矩阵
  //const modelMatrix4 = Cesium.Matrix4.fromRotationTranslation(rotationMatrix3, pointB);
  const hpr = Cesium.HeadingPitchRoll.fromQuaternion(orientation)
  var orientation2 = Cesium.Transforms.headingPitchRollQuaternion(
    originPosition,
    hpr
  )
  return modelMatrix4
}

//添加信息提示框
PopUp.prototype.loadPrompt = function (options) {
  let viewer = this.viewer
  if (!options.entity) {
    return
  }
  let style = {}
  switch (options.type) {
    case 'Comment': //通信类communication：战术描述等
      style = {
        background: '#18d6aca6',
        color: 'ivory',
        fieldColor: 'yellow',
        contentColor: 'chartreuse',
        boxShadow: '0 0 25px chartreuse'
      }
      break
    case 'Weapon_Warning': //通信类communication：预警（被攻击）
      style = {
        background: '#e9670aa3', //橙色半透明
        color: '#e9670a', //橙色全色
        fieldColor: 'yellow', //面板字段颜色
        contentColor: 'white', //面板字段对应属性值
        boxShadow: '0 0 25px #e9670aa3' // 面板阴影
      }
      break
    case 'RE_JamS': // 干扰类：？
      style = {
        background: '#bc0ae9ba', //紫色半透明
        color: '#bc0ae9', //紫色全色
        fieldColor: 'yellow', //面板字段颜色
        contentColor: 'white', //面板字段对应属性值
        boxShadow: '0 0 25px #bc0ae9ba' // 面板阴影
      }
      break
    case 'RE_JamA': // 干扰类：雷达？
      style = {
        background: '#bc0ae9ba', //紫色半透明
        color: '#bc0ae9', //紫色全色
        fieldColor: 'yellow', //面板字段颜色
        contentColor: 'white', //面板字段对应属性值
        boxShadow: '0 0 25px #bc0ae9ba' // 面板阴影
      }
      break
    case 'SDC': //通信类communication：雷达探测/预警
      style = {
        background: '#dbe90aad', //黄色半透明
        color: '#dbe90a', //黄色全色
        fieldColor: 'yellow', //面板字段颜色
        contentColor: 'white', //面板字段对应属性值
        boxShadow: '0 0 25px #dbe90aad' // 面板阴影
      }
      break
    case 'RE_MR': //通信类communication：卫星通信
      style = {
        background: '#0a78e9ba', //蓝色半透明
        color: '#0a78e9', //蓝色全色
        fieldColor: 'yellow', //面板字段颜色
        contentColor: 'white', //面板字段对应属性值
        boxShadow: '0 0 25px #0a78e9ba' // 面板阴影
      }
      break
    case 'Weapon_WH': //攻击类1：
      style = {
        background: '#e90a0aad', //红色半透明
        color: '#e90a0a', //红色全色
        fieldColor: 'yellow', //面板字段颜色
        contentColor: 'white', //面板字段对应属性值
        boxShadow: '0 0 25px #e90a0aad' // 面板阴影
      }
      break
    case 'RE_WeaponF': //攻击类2：
      style = {
        background: '#8a0202ff', //红色半透明
        color: '#e90a0a', //红色全色
        fieldColor: 'yellow', //面板字段颜色
        contentColor: 'white', //面板字段对应属性值
        boxShadow: '0 0 25px #e90a0aad' // 面板阴影
      }
      break
    case 'reconnaissance': // 气象影像
      if (options.side === 'red') {
        style = {
          background: '#5c0606ff', //红色半透明
          color: '#d14747ff', //红色全色
          fieldColor: 'yellow', //面板字段颜色
          contentColor: 'white', //面板字段对应属性值
          boxShadow: '0 0 25px #f796960c' // 面板阴影
        }
      } else if (options.side === 'blue') {
        style = {
          background: '#0a78e9ba', //蓝色半透明
          color: '#0a78e9', //蓝色全色
          fieldColor: 'yellow', //面板字段颜色
          contentColor: 'white', //面板字段对应属性值
          boxShadow: '0 0 25px #0a78e9ba' // 面板阴影
        }
      } else if (options.side === 'green') {
        style = {
          background: '#09b409ba', //绿色半透明
          color: '#09b409', //绿色全色
          fieldColor: 'yellow', //面板字段颜色
          contentColor: 'white', //面板字段对应属性值
          boxShadow: '0 0 25px #09b409ba' // 面板阴影
        }
      } else if (options.side === 'purple') {
        style = {
          background: '#9209b4ba', //紫色半透明
          color: '#9209b4', //紫色全色
          fieldColor: 'yellow', //面板字段颜色
          contentColor: 'white', //面板字段对应属性值
          boxShadow: '0 0 25px #9209b4ba' // 面板阴影
        }
      } else {
        style = {
          background: '#666666ba', //灰色半透明
          color: '#666666', //灰色全色
          fieldColor: 'yellow', //面板字段颜色
          contentColor: 'white', //面板字段对应属性值
          boxShadow: '0 0 25px #666666ba' // 面板阴影
        }
      }
      break
    default:
      style = {
        background: '#18d6ad25',
        color: 'ivory',
        fieldColor: 'yellow',
        contentColor: 'chartreuse',
        boxShadow: 'chartreuse'
      }
      break
  }

  // options.entity.model.show = true
  let pro = new Prompt(viewer, {
    type: 2,
    id: options.entityId,
    content: options.content,
    entityId: options.entityId,
    datasourceName: options.datasourceName,
    close: function () {
      return false
    }, // 点击关闭按钮的回调函数
    style: style
  })
  // options.entity.viewFrom = new Cesium.Cartesian3(-42080, -35715, 38079)
}
//删除信息提示框
PopUp.prototype.removePrompt = function (options) {
  //let Cesium = this.Cesium
  let viewer = this.viewer
  if (!options.entity) {
    return
  }
  // options.entity.model.show = false
  //  viewer.trackedEntity =''
  let div = window.document.getElementById('prompt-' + options.entityId)
  if (div) {
    window.document.getElementById(viewer.container.id).removeChild(div)
  }
}
/**
 * 填充编组弹窗内容
 * @param {object} options
 * @returns
 */
PopUp.prototype.createContent = function (options) {
  let content
  switch (options.type) {
    case 'group': //编组
      content = [
        { type: '编组', value: options.title }
        // { type: '任务', value: options.msg }
      ]
      break
    case 'Weapon_Warning': //攻击预警
      content = [
        { type: '平台', value: options.title },
        { type: '事件', value: options.msg }
      ]
      break
    case 'Comment': //战术描述
      content = [
        { type: '平台', value: options.title },
        { type: '事件', value: options.msg }
      ]
      break
    case 'RE_JamS': //干扰1
      content = [
        { type: '平台', value: options.title },
        { type: '事件', value: options.msg }
      ]
      break
    case 'RE_JamA': //干扰2
      content = [
        { type: '平台', value: options.title },
        { type: '事件', value: options.msg }
      ]
      break
    case 'SDC': //雷达探测
      content = [
        { type: '平台', value: options.title },
        { type: '事件', value: options.msg }
      ]
      break
    case 'RE_MR': //卫星通信
      content = [
        { type: '平台', value: options.title },
        { type: '事件', value: options.msg }
      ]
      break
    case 'Weapon_WH': //攻击类1
      content = [
        { type: '平台', value: options.title },
        { type: '事件', value: options.msg }
      ]
      break
    case 'RE_WeaponF': //攻击类2
      content = [
        { type: '平台', value: options.title },
        { type: '事件', value: options.msg }
      ]
      break
    case 'RE_LTrackInit': //雷达探测
      content = [
        { type: '平台', value: options.title },
        { type: '事件', value: options.msg }
      ]
      break
    case 'reconnaissance': //通信类communication：卫星通信
      content = [
        { type: '类型', value: options.typeCName },
        { type: '事件', value: options.specificCName }
        // { type: '置信度', value: options.confidence }
      ]
      break
    default:
      content = [
        { type: '名称', value: options.title },
        { type: '动作', value: msg }
      ]
      break
  }

  return content
}
/**
 * 动态目标详标牌显隐控制
 * @param {boolean} 动态目标详情面板显隐状态
 * @returns
 */
PopUp.prototype.detailedSignageCheckChange = function (value) {
  if (value) {
    let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
      store.getters.getCurrentNode.code,
      'MSIMEarthCZMLProcessContainer'
    )
    console.log(curEntity)
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
      // 任务
      let stateStr = ''
      let currentSceneInfo = JSON.parse(
        window.localStorage.getItem('currentSceneInfo')
      )
      let param = {
        platname: store.getters.getCurrentNode.code,
        scenarioId: currentSceneInfo.scenarioId
      }
      getInfoByPlatName(param).then((res) => {
        // console.log(res)
        if (res.code == 200) {
          stateStr = res.data.taskDescription
        }
      })
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
      let params = {
        id: store.getters.getCurrentNode.code,
        name: curEntity ? curEntity.description : '',
        title: titleName,
        rgb: [],
        heading: curEntity.properties.airplaneAction._value.heading.toFixed(3),
        pitch: curEntity.properties.airplaneAction._value.pitch.toFixed(3),
        roll: curEntity.properties.airplaneAction._value.roll.toFixed(3),
        speed: speedKm.toFixed(3),
        mach: 0,
        DamageFactor: 0,
        fuel: 0,
        type: curEntity.properties.airplaneAction._value.type,
        fontColorRgb: fontColorRgb,
        state: stateStr,
        sensor: '',
        radar: '',
        weapon: ''
      }
      if (store.getters.getCurrentNode.side == 'red') {
        params['rgb'] = [225, 82, 88]
        createPanel(params)
      } else if (store.getters.getCurrentNode.side == 'green') {
        params['rgb'] = [175, 247, 170]
        createPanel(params)
      } else {
        params['rgb'] = [57, 173, 209]
        createPanel(params)
      }
    }
  } else {
    if (window['curDivPoint' + store.getters.getCurrentNode.code]) {
      window['curDivPoint' + store.getters.getCurrentNode.code].closeEvent()
      window['curDivPoint' + store.getters.getCurrentNode.code] = null
    }
  }
}
/**
 * 静态位置详标牌显隐控制
 * @param {boolean} 静态位置详情面板显隐状态
 * @returns
 */
PopUp.prototype.detailedSignageCheckChangeStatic = function (options) {
  if (options.show) {
    let params = {
      id: 'wz_7-1',
      name: '',
      title: '123',
      rgb: [225, 82, 88],
      position: options.position,
      message: options.message
    }
    store.commit('setCurrentNode', { code: params.id, side: '', type: '' })
    createPanelStatic(params)
  } else {
    if (window['curDivPoint' + store.getters.getCurrentNode.code]) {
      window['curDivPoint' + store.getters.getCurrentNode.code].closeEvent()
      window['curDivPoint' + store.getters.getCurrentNode.code] = null
    }
  }
}

// 查找 LD演示场景各个仿真平台任务划分  依据 description
const getLdrwListArrValue = (curData, datasArr) => {
  const i = datasArr.findIndex((item) => {
    return item.description == curData
  })
  return datasArr[i] ? datasArr[i] : null
}

//显示信息弹框
const createPanel = (params) => {
  //默认展示数据
  let content = [
    { name: '经度', value: '' },
    { name: '纬度', value: '' },
    { name: '高度', value: '' },
    { name: '航向角', value: params.heading + '°' },
    { name: '俯仰角', value: params.pitch + '°' },
    { name: '马赫', value: params.mach },
    // { name: '滚转角', value: params.roll + '°' },
    { name: '速度', value: params.speed + 'km/h' },
    { name: '油量', value: params.fuel + 'L' },
    { name: '传感器', value: params.sensor },
    // { name: '雷达', value: params.radar },
    { name: '武器', value: params.weapon },
    // { name: '类型', value: params.type },
    { name: '任务', value: params.state }
  ]
  new Bubble({
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
}
//显示信息弹框
const createPanelStatic = (params) => {
  //默认展示数据
  let content = [
    { name: '经度', value: '' },
    { name: '纬度', value: '' },
    { name: '高度', value: '' },
    { name: '航向角', value: 3 + '°' },
    { name: '俯仰角', value: 3 + '°' },
    // { name: '马赫', value: 3 },
    // { name: '滚转角', value: params.roll + '°' },
    { name: '速度', value: 3 + 'km/h' },
    { name: '油量', value: 3 + 'L' },
    { name: '传感器', value: 3 },
    { name: '雷达', value: 3 },
    { name: '武器', value: 3 },
    // { name: '类型', value: params.type },
    { name: '任务', value: 3 }
  ]
  new BubbleStatic({
    content: content,
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
    isCloseClick: false,
    position: params.position
  })
}

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

export default PopUp
