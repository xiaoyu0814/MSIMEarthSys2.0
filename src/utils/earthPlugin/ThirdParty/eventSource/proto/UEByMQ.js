/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2025-09-02 14:26:11
 * @LastEditors: ZX Li
 * @LastEditTime: 2025-09-02 15:18:05
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
  primitive,
  ueInfoHandle
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
const MQ_TOPIC = '/exchange/SIMULATION_UE_ENV'
const MQ_LOGIN = 'guest'
const MQ_PASSCODE = 'guest'

// 全局连接状态跟踪
let globalStompClient = null
let globalSubscribe = null
let isConnected = false

class UEMQController {
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
    const { createHeatMapByUEJson, removeHeatMap, createPointMapByUEJson, createFrustumEntityByCenterPoint } = ueInfoHandle()

    this.handlePA = handlePA
    this.handleState = handleState
    this.handlePD = handlePD
    this.getSceneTime = getSceneTime
    this.handleCommand = handleCommand
    this.createHeatMapByUEJson = createHeatMapByUEJson
    this.removeHeatMap = removeHeatMap
    this.createPointMapByUEJson = createPointMapByUEJson
    this.createFrustumEntityByCenterPoint = createFrustumEntityByCenterPoint



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
      let contentStr = JSON.parse(messages.body).content
      let contentObj = JSON.parse(contentStr)
      console.log(contentObj)
      switch (contentObj.Type) {
        case 'UE_Info':
          // 来自UE的信息信息
          console.log('UE_Info', contentObj)
          // // 更新基于UE消息绘制的实时高度图（以热力图方式）
          // this.createPointMapByUEJson(contentObj.data)
          // // 计算并显示中心点
          // this.createFrustumEntityByCenterPoint(contentObj)
          break
        default:
          this.handleState(contentObj)
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
}

export default UEMQController
