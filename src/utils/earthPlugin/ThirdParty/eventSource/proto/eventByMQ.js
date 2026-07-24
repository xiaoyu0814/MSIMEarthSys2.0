/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2025-09-02 14:26:11
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2026-06-02 17:49:47
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

const MQ_SERVICE = rbmqUrl
const MQ_TOPIC = '/exchange/SIMULATION_UDP'
const MQ_LOGIN = 'guest'
const MQ_PASSCODE = 'guest'

// 全局连接状态跟踪
let globalStompClient = null
let globalSubscribe = null
let isConnected = false

class EventMQController {
  MQService = undefined
  topic = undefined
  login = undefined
  passcode = undefined
  messageHandlers = null

  constructor(options) {
    this.MQService = options?.MQService || MQ_SERVICE
    this.topic = options?.topic || MQ_TOPIC
    this.login = options?.login || MQ_LOGIN
    this.passcode = options?.passcode || MQ_PASSCODE
    this.messageHandlers = new Map()
    this.initMessageHandlers()
  }
  async initEventMQ() {
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

  initMessageHandlers() {
    const { handlePA } = seaAirJointOperationsPA()
    const { handleState } = seaAirJointOperationsState()
    const { handlePD } = seaAirJointOperationsPD()
    const { getSceneTime } = seaAirJointOperationsSceneTime()
    const { handleCommand } = toWebCommand()

    this.handlePA = handlePA
    this.handleState = handleState
    this.handlePD = handlePD
    this.getSceneTime = getSceneTime

    // this.messageHandlers.set('eventType', callBack)
  }
  connectByClient() {
    let that = this

    // 先断开已有连接
    this.disconnectExistingConnection().then(() => {
      let client = Stomp.client(this.MQService)
      // 禁用STOMP调试日志
      client.debug = function () { }
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
        EarthAPP.MQCount += 1
        console.log(
          `事件MQ消息初始化成功,当前页面连接事件MQ次数:${EarthAPP.MQCount}`
        )
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
    if (!messages) {
      return
    }
    try {
      let curType = JSON.parse(messages.body).type //最外层消息类型
      let contentStr = JSON.parse(messages.body).content //消息主体
      if (
        curType === 'LogInfo' ||
        curType === 'timeOverview' ||
        curType === 'deduce'
      ) {
        // 后续更新优化的的消息，和else内的消息相比少了一层解构逻辑
        switch (curType) {
          case 'LogInfo':
            let logInfo = {}
            let arr = contentStr.split('(')[1].split(')')[0].split(',')
            for (let i = 0; i < arr.length; i++) {
              const element = arr[i]
              let item = element.split(':')
              let key = item[0].trim()
              item[1] = item[1] === 'null' ? null : item[1]
              logInfo[key] = item[1]
            }
            store.commit('setCzmlEventSourceData', logInfo)
            break
          case 'timeOverview':
            let timeOverview = {}
            let arr2 = contentStr.split('{')[1].split('}')[0].split(',')
            for (let i = 0; i < arr2.length; i++) {
              const element = arr2[i]
              let item = element.split(':')
              let key = item[0].trim()
              // item[1] = item[1] === "true" ? true : false
              timeOverview[key] = item[1]
            }
            store.commit('settimeOverviewData', timeOverview)
            break
          case 'deduce':
            let deduceLogInfo = JSON.parse(contentStr)
            console.log('deduce', contentStr, deduceLogInfo)
            deduceLogInfo.Type = curType
            store.commit('setCzmlEventSourceData', deduceLogInfo)
            emitter.emit('getDeduce', deduceLogInfo)
            store.commit('setTimeOverviewDataEnviroment', deduceLogInfo)
            store.commit('AFSIMModule/setReconnaissanceResults', deduceLogInfo)
            // store.commit(
            //   'setTimeOverviewDataEnviroment',
            //   deduceLogInfo.abnormalTimeSeconds
            // )
            // 解析消息主体并将参数传入各种回调函数
            // 一场消息类
            // {
            //   "code": 200,
            //     "content": "{\"abnormalTimeSeconds\":173,\"abnormalTypeCName\":\"飞机颠簸\",\"abnormalTypeCode\":\"TURBULENCE\",\"altitude\":6475.844203344546,\"details\":\"飞机颠簸: 高度波动1301m, 俯仰角波动99.6°, 转向频率1.0次/秒\",\"latitude\":23.671504160988857,\"longitude\":120.01509444968812,\"platformCName\":\"无人机\",\"platformName\":\"ss-uav_1_client_suicide_drone_4\",\"severity\":5,\"side\":\"red\"}",
            //       "sendTime": "2026-06-02T10:16:42.949+08:00",
            //         "type": "deduce"
            // }
            break
        }
      } else {
        // 早期双层解构的消息，如果后续使用新结构则可以和if内各类消息合并
        let contentObj = JSON.parse(contentStr)
        switch (contentObj.Type) {
          case 'PA':
            store.state.AFSIMModule.paData.push(contentObj)
            this.handlePA(contentObj)
            break
          case 'AT':
            this.getSceneTime(contentObj.Data)
            emitter.emit('AT', contentObj)
            break
          case 'PD':
            this.handlePD(contentObj)
            break
          case 'Command':
            this.handleCommand(contentObj)
            break
          case '完整态势识别':
            // 南京方面大模型计算结果
            console.log('完整态势识别', contentObj)
            break
          case 'UE_INFO':
            // 来自UE的信息信息
            console.log('UE_INFO', contentObj)
            break
          case 'LogInfo':
            let logInfo = {}
            let arr = contentStr.split('(')[1].split(')')[0].split(',')
            for (let i = 0; i < arr.length; i++) {
              const element = arr[i]
              let item = element.split(':')
              let key = item[0].trim()
              item[1] = item[1] === 'null' ? null : item[1]
              logInfo[key] = item[1]
            }
            store.commit('setCzmlEventSourceData', logInfo)
            break
          case 'timeOverview':
            let json = JSON.parse(contentObj.Data)
            // 底部阶段性描述数据
            store.commit('settimeOverviewData', json)
            break
          case 'deduce':
            console.log('deduce', contentObj)
            break
          default:
            this.handleState(contentObj)
            break
        }
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
}

export default EventMQController
