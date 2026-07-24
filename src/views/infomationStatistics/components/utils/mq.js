/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2025-09-02 14:26:11
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2026-05-26 13:14:41
 */
import store from '@/store'
import {
  seaAirJointOperationsPA,
  seaAirJointOperationsPD,
  seaAirJointOperationsSceneTime,
  seaAirJointOperationsState,
  toWebCommand,
  controlResByafSim,
  startScene,
  computeFPS,
  pointQbByPositionData,
  pointRhQbData,
  qaOperationData,
  webCZML,
  entities,
  primitive
} from '@/utils/earthPlugin/ThirdParty/eventSource/event/earthEvent'
import { RE_InterferenceRange } from '@/utils/earthPlugin/ThirdParty/eventSource/event/earthActionByEvent'
import { playVoice } from '@/utils/voice'
import emitter from '@/utils/eventbus'
import {
  radarCreateBylanjieScenario,
  eventControllerSSEClose
} from '@/utils/mapTools'
import { getNowTaskInfo } from '@/service/taskManagement'
import { startExperiment } from '@/service/combatSimulation.js'
import { toPosition } from '@/service/command'
import { sendToCommandShowResMsg } from '@/utils/mapTools'
import { setPlateformStatus } from '@/service/afsim/index'
import { SSEClose } from '@/service/SSE'
import Stomp from 'stompjs'

let self = null
window.tableList = []
let time = new Date().getTime()
let redData = 0
let blueData = 0

const MQ_SERVICE = rbmqUrl
const MQ_TOPIC = '/exchange/SIMULATION_UDP'
const MQ_LOGIN = 'guest'
const MQ_PASSCODE = 'guest'

// 全局连接状态跟踪
let globalStompClient = null
let globalSubscribe = null
let isConnected = false
// 基于MQ方式接受仿真信息，后续和EarthPlugn版本合并到一起，避免重复构建
class EventMQStatistic {
  MQService = undefined
  topic = undefined
  login = undefined
  passcode = undefined
  messageHandlers = null

  constructor(options, callback) {
    self = this
    this.callback = callback
    this.redList = {}
    this.blueList = {}
    this.redcgfList = []
    this.bluecgfList = []
    this.arr = []
    this.side = 'admin'
    this.curSceneIDArr = new Date().getTime()
    this.url = `${serverUrls.serversCommunication}EventSourceController/v1/getMsg/${this.side}@${this.curSceneIDArr}` //SSE连接用的URL参数
    //
    this.MQService = options?.MQService || MQ_SERVICE
    this.topic = options?.topic || MQ_TOPIC
    this.login = options?.login || MQ_LOGIN
    this.passcode = options?.passcode || MQ_PASSCODE
    this.messageHandlers = new Map()
    this.initMessageHandlers()
    this.connectByClient()
  }
  initEventMQ() {
    this.connectByClient()
  }

  disconnectExistingConnection() {
    return new Promise((resolve) => {
      if (globalStompClient && isConnected) {
        console.log('检测到已有MQ连接，正在断开...')

        try {
          if (globalSubscribe) {
            globalSubscribe.unsubscribe()
            globalSubscribe = null
          }

          if (globalStompClient && globalStompClient.connected) {
            globalStompClient.disconnect(() => {
              console.log('已有MQ连接已断开')
              globalStompClient = null
              isConnected = false
              resolve()
            })
          } else {
            globalStompClient = null
            isConnected = false
            resolve()
          }
        } catch (error) {
          console.error('断开MQ连接时出错:', error)
          globalStompClient = null
          globalSubscribe = null
          isConnected = false
          resolve()
        }
      } else {
        console.log('没有检测到已有MQ连接')
        resolve()
      }
    })
  }

  initMessageHandlers() { }
  connectByClient() {
    let that = this

    // 先断开已有连接
    this.disconnectExistingConnection().then(() => {
      let client = Stomp.client(this.MQService)
      let exchange = this.topic
      var headers = {
        login: this.login,
        passcode: this.passcode,
        host: '/'
      }

      client.connect(headers, onConnected, onFailed)

      function onConnected() {
        globalStompClient = client
        isConnected = true

        let currentSubscribe = client.subscribe(exchange, function (messages) {
          that.handleMessage(messages)
        })
      }

      function onFailed(frame) {
        console.log('Failed: ' + frame)
        console.log('一秒后重新连接')
        globalStompClient = null
        globalSubscribe = null
        isConnected = false
        setTimeout(() => {
          that.connectByClient()
        }, 1000)
      }
    })
  }

  handleMessage(messages) {
    let that = this
    if (!messages) {
      return
    }

    try {
      let contentStr = JSON.parse(messages.body).content
      let type = JSON.parse(messages.body).type
      if (type == 'LogInfo') {
        let logInfo = {}
        let arr = contentStr.split('(')[1].split(')')[0].split(',')
        for (let i = 0; i < arr.length; i++) {
          const element = arr[i];
          let item = element.split(':')
          let key = item[0].trim()
          item[1] = item[1] === "null" ? null : item[1]
          logInfo[key] = item[1]
        }
        console.log('LogInfo', logInfo)
        store.commit('setCzmlEventSourceData', logInfo)
      }
      if (type == 'timeOverview') {
        let timeOverview = {}
        let arr = contentStr.split("{")[1].split("}")[0].split(",")
        for (let i = 0; i < arr.length; i++) {
          const element = arr[i];
          let item = element.split(':')
          let key = item[0].trim()
          // item[1] = item[1] === "true" ? true : false
          timeOverview[key] = item[1]

        }
        console.log('timeOverview', timeOverview)
        store.commit('settimeOverviewData', timeOverview)
      }
      let contentObj = JSON.parse(contentStr)
      // console.log('contentObj', contentObj)
      switch (contentObj.Type) {
        case 'AT':
          let AT = contentObj.Data.T
          store.commit('setStartDate', AT)
          break
        case 'pathConfig':
          that.getPathConfig(contentObj.Data)
          break
        case 'LogInfo':
          let logInfo = contentObj.Data
          logInfo.time = contentObj.timeStamp
          store.commit('setCzmlEventSourceData', logInfo)
          break
        case 'timeOverview':
          let json = JSON.parse(contentObj.Data)
          // 底部阶段性描述数据
          store.commit('settimeOverviewData', json)
          break
        default:
          that.getMessage(contentStr)
          break
      }
      // let contentStr = JSON.parse(messages.body).content
      // let contentObj = JSON.parse(contentStr)
      // const messageType = contentObj.Type || 'unkonw'
      // const handler = this.messageHandlers.get(messageType)
      // if (handler && typeof handler === 'function') {
      //   try {
      //     handler(contentObj)
      //   } catch (error) {
      //     console.error(`Error handling message:`, error)
      //   }
      // } else {
      //   console.warn(`No handler found for message`)
      // }
    } catch (error) { }
  }

  //试听
  audioEvent(item, index) {
    if (!item.flyArr[0].identifyInfo) {
      ElMessage.error('请输入演播内容')
    }
    if (!item.speaker) {
      ElMessage.error('请选择播音员')
    }
    // cameraController.identifyInfoCOnfig(
    //   item.flyArr[0].identifyInfo,
    //   item.flyArr[0].jd,
    //   item.speaker,
    //   item.title
    // )
    store.state.sceneModule.identifyInfo = item.flyArr[0].identifyInfo
    store.state.sceneModule.speaker = item.speaker
    store.state.sceneModule.identifyTitle = item.title
    store.state.sceneModule.phasedDescription.push({
      time: '',
      key: 'suicide attack',
      value: item.flyArr[0].identifyInfo
    })
    store.state.sceneModule.showIdentify = true
  }

  // async getMessage(e) {
  //   let msg = JSON.parse(e.data)
  //   if (!msg.Data.sName) return
  //   if (self.arr.indexOf(msg.Type) < 0) {
  //     self.arr.push(msg.Type)
  //     let params = {
  //       dbName: 'CFG_control', // 数据库名
  //       tableName: msg.Type, // 表名
  //       keyPath: 'sName', // 设置主键 （需要为添加对象内的key，否则新增和获取都会失败）
  //       dataList: [msg.Data]
  //     }
  //     await createTable(params)
  //   }
  //   await addDataToTable('CFG_control', msg.Type, msg.Data)
  // }

  addCGF = (cgf, box) => {
    if (box.length) {
      let isHave1 = false
      let index = -1
      for (let i = 0; i < box.length; i++) {
        if (`${cgf.Side}_${cgf.Type}` == box[i].type) {
          isHave1 = true
          index = i
        }
      }
      if (isHave1) {
        let isHave = false
        for (let j = 0; j < box[index].data.length; j++) {
          const item = box[index].data[j]
          if (cgf.Id == item.Id) {
            isHave = true
          }
        }
        if (!isHave) {
          box[index].data.push(cgf)
        }
      } else {
        let temp = {
          type: `${cgf.Side}_${cgf.Type}`,
          name:
            cgf.LabelName.split('_')[0] == 'red'
              ? cgf.LabelName.split('_')[1] + '_' + cgf.LabelName.split('_')[2]
              : cgf.LabelName.split('_')[0],
          data: [cgf]
        }
        box.push(temp)
      }
    } else {
      let temp = {
        type: `${cgf.Side}_${cgf.Type}`,
        name:
          cgf.LabelName.split('_')[0] == 'red'
            ? cgf.LabelName.split('_')[1] + '_' + cgf.LabelName.split('_')[2]
            : cgf.LabelName.split('_')[0],
        data: [cgf]
      }
      box.push(temp)
    }
  }
  removeCGF = (cgf, box) => {
    if (box.length) {
      for (let i = 0; i < box.length; i++) {
        if (cgf.Type == box[i].type) {
          for (let j = 0; j < box[i].data.length; j++) {
            const item = box[i].data[j]
            if (cgf.Id == item.Id) {
              box[i].data.splice(j, 1)
              if (box[i].data.length == 0) {
                box.splice(i, 1)
              }
            }
          }
        }
      }
    }
  }
  getPA(e) {
    console.log('pa', e)
    let msg = JSON.parse(e.data)
    self.addCGF(msg.Data, self[`${msg.Data.Side}cgfList`])
    if (msg.Data.Side == 'red') {
      store.commit('setRedCGFList', self[`${msg.Data.Side}cgfList`])
    } else {
      store.commit('setBlueCGFList', self[`${msg.Data.Side}cgfList`])
    }
    if (self.callback) {
      self.callback(self)
    }
  }
  getPD(e) {
    let msg = JSON.parse(e.data)
    // self.removeCGF(msg.Data, self[`${msg.Data.Side}cgfList`])
    if (msg.Data.Side == 'red') {
      store.commit('setRedCGFList', self[`${msg.Data.Side}cgfList`])
    } else {
      store.commit('setBlueCGFList', self[`${msg.Data.Side}cgfList`])
    }
    if (msg.Data.Side == 'red') {
      blueData++
    } else {
      redData++
    }
    let temp = {
      type: 'PD',
      redData,
      blueData
    }
    if (self.callback) {
      self.callback(temp)
    }
  }
  getMessage(e) {
    let msg = JSON.parse(e.data)
    // console.log(msg)
    switch (msg.Type) {
      case 'RE_STrackInit':
        break
      case 'RE_STrackDrop':
        break
      case 'RE_LTrackInit':
        break
      case 'RE_LTrackDrop':
        break
      case 'Task_Aign':
        break
      case 'Task_Cancel':
        break
      case 'Task_Completed':
        break
      case 'RE_WeaponF':
        break
      case 'RE_WeaponT':
        break
      case 'Weapon_WH':
        break
      case 'RE_JamA':
        break
      case 'RE_JamT':
        break
      case 'RE_JamE':
        break
      case 'RE_JamS':
        break
      case 'SU':
        break
      case 'Statistics':
        break
      case 'Comment':
        break

      default:
        break
    }
  }
  getPathConfig(e) {
    let msg = JSON.parse(e.data)
    // self.addCGF(msg.Data, self[`${msg.Data.Side}cgfList`])
    let list = `${msg.data.side}List`
    let presence = self.checkKeyExists(self[list], msg.data.type)
    if (presence) {
      let isHave = false
      for (let i = 0; i < self[list][msg.data.type].length; i++) {
        const element = self[list][msg.data.type][i]
        if (element.data.id == msg.data.id) {
          isHave = true
          break
        } else {
          isHave = false
        }
      }
      if (isHave) {
        self[list][msg.data.type].shift()
        self[list][msg.data.type].push(msg)
      } else {
        self[list][msg.data.type].push(msg)
      }
    } else {
      self[list][msg.data.type] = [msg]
    }
    let newTime = new Date().getTime()
    if (self.callback && newTime - time > 2000) {
      time = newTime
      self.callback(self)
    }
  }
  checkKeyExists(obj, key) {
    // 方法1: in 操作符
    const method1 = key in obj
    // 方法2: hasOwnProperty
    const method2 = Object.prototype.hasOwnProperty.call(obj, key)
    // 方法3: Object.hasOwn (ES2022)
    const method3 = Object.hasOwn ? Object.hasOwn(obj, key) : false
    // 方法4: 与 undefined 比较 (不可靠)
    const method4 = obj[key] !== undefined
    // 方法5: Reflect.has
    const method5 = Reflect.has(obj, key)
    // 方法6: Object.keys
    const method6 = Object.keys(obj).includes(key)
    // 打印所有方法结果用于调试
    // console.log(`检测 key: ${key}`)
    // console.log(`方法1 (in): ${method1}`)
    // console.log(`方法2 (hasOwnProperty): ${method2}`)
    // console.log(`方法3 (Object.hasOwn): ${method3}`)
    // console.log(`方法4 (undefined比较): ${method4}`)
    // console.log(`方法5 (Reflect.has): ${method5}`)
    // console.log(`方法6 (Object.keys): ${method6}`)

    // 返回最可靠的检测结果
    return method1 // 使用 hasOwnProperty 作为主要检测方法
  }
}

export default EventMQStatistic
