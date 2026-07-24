/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2025-09-02 14:26:11
 * @LastEditors: chenguopeng2 chenguopeng.piesat.cn
 * @LastEditTime: 2026-07-15 15:44:23
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
  ARSIMInfoHandle
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
const MQ_TOPIC = '/exchange/AIRSIM_EXCHANGE'
const MQ_LOGIN = 'guest'
const MQ_PASSCODE = 'guest'

// 全局连接状态跟踪
let globalStompClient = null
let globalSubscribe = null
let isConnected = false

class EventARSIMByMQController {
  MQService = undefined
  topic = undefined
  login = undefined
  passcode = undefined
  messageHandlers = null
  messageWorker = null

  constructor(options) {
    this.MQService = options?.MQService || MQ_SERVICE
    this.topic = options?.topic || MQ_TOPIC
    this.login = options?.login || MQ_LOGIN
    this.passcode = options?.passcode || MQ_PASSCODE
    this.messageHandlers = new Map()
    this.initMessageHandlers()
    this.initWorker()
  }

  // 初始化消息处理worker
  initWorker() {
    try {
      this.messageWorker = new Worker('/static/js/arsimMessageWorker.js')
      this.messageWorker.onmessage = (e) => {
        console.log('Worker message:', e.data)
        const { type, data } = e.data
        switch (type) {
          case 'parseMessageResult':
            this.handleParsedMessage(data.contentObj)
            break
          case 'error':
            console.error('Worker error:', data.error)
            break
          default:
            break
        }
      }
      this.messageWorker.onerror = (error) => {
        console.error('Worker error:', error)
      }
    } catch (error) {
      console.error('Failed to initialize worker:', error)
      // 降级处理：如果worker初始化失败，使用主线程解析
      this.messageWorker = null
    }
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
    // 全局定时器
    console.log('initMessageHandlers');
    const { handlePA } = seaAirJointOperationsPA()
    const { handleState } = seaAirJointOperationsState()
    const { handlePD } = seaAirJointOperationsPD()
    const { getSceneTime } = seaAirJointOperationsSceneTime()
    const { handleCommand } = toWebCommand()
    const { createDepthMapByUEJson, createDepthPointMapByUEJson } = ARSIMInfoHandle()

    let cusP = new window.EarthPlugn.customPritive(
      window.MSIMEarth,
      window.EarthViewer
    )

    this.handlePA = handlePA
    this.handleState = handleState
    this.handlePD = handlePD
    this.getSceneTime = getSceneTime
    this.createDepthMapByUEJson = createDepthMapByUEJson
    this.createDepthPointMapByUEJson = createDepthPointMapByUEJson
    this.customPritive = cusP
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
    let that = this
    if (!messages) {
      return
    }

    // 使用worker处理消息解析
    if (this.messageWorker) {
      // 只传递body部分，避免传递包含函数的整个messages对象
      this.messageWorker.postMessage({
        type: 'parseMessage',
        data: { body: messages.body }
      })
    } else {
      // 降级处理：如果worker不可用，使用主线程解析
      try {
        // let contentStr = JSON.parse(messages.body).content
        // let contentObj = JSON.parse(contentStr)
        // this.handleParsedMessage(contentObj)
      } catch (error) {
        console.error('Error parsing message:', error)
      }
    }
  }

  // 处理解析后的消息
  handleParsedMessage(contentObj) {
    let that = this
    try {
      switch (contentObj.Type) {
        case 'DEPTH_PLANAR':
          // 来自ARSIM平面信息
          console.log(contentObj);
          this.createDepthMapByUEJson(contentObj)
          // this.createDepthPointMapByUEJson(contentObj)
          break
        case 'DEPTH_PLANAR_IMAGE':
          // 来自ARSIM平面图像信息
          console.log(contentObj);
          // this.createDepthPointMapByUEJson(contentObj.Data)
          break
        case 'DEPTH_POINT_CLOUD':
          // 来自ARSIM点云信息
          console.log('DEPTH_POINT_CLOUD', contentObj);
          // if (!store.state.AFSIMModule.showARMultiPoints) {
          //   return
          // }
          // const geoPoints = contentObj.Data.geo_points
          // let instances = []
          // geoPoints.forEach((point, index) => {
          //   let origin = Cesium.Cartesian3.fromDegrees(
          //     point[1], // 注意：Cesium的fromDegrees参数是(经度, 纬度, 高度)
          //     point[0],
          //     point[2]
          //   )
          //   let modelMatrix = Cesium.Transforms.eastNorthUpToFixedFrame(origin)
          //   instances.push({
          //     id: 'instance' + index,
          //     color: that.getColorByHeightForDepth(point[2]),
          //     matrix: modelMatrix
          //   })
          // })

          // // 如果当前已存在则更新否则创建
          // let create = true
          // window.EarthViewer.scene.primitives._primitives.forEach((p) => {
          //   if (p.name && p.name === 'DEPTH_POINT_CLOUD_DCInstance') {
          //     // console.log('更新');
          //     // p.updateInstances(instances)
          //     // create = false
          //     window.EarthViewer.scene.primitives.remove(p)
          //   }
          // })
          // if (create) {
          //   console.log('创建');
          //   // this.customPritive.removeDCInstance('DEPTH_POINT_CLOUD')
          //   that.customPritive.createDCInstance(null, instances, false, 'DEPTH_POINT_CLOUD')
          // }

          // //////////////////////////
          let pointsCol = new window.MSIMEarth.PointPrimitiveCollection()
          pointsCol.name = 'depthPointCloud'
          window.EarthViewer.scene.primitives._primitives.forEach(p => {
            if (p.name === 'depthPointCloud') {
              // p.removeAll()
              window.EarthViewer.scene.primitives.remove(p)
            }
          });
          const points = window.EarthViewer.scene.primitives.add(pointsCol)
          const geoPoints = contentObj.Data.geo_points
          // 遍历所有点并添加到集合中
          geoPoints.forEach((point) => {
            // 使用getColorByHeight函数获取颜色
            const color = that.getColorByHeight(point[2])

            // 添加点到集合
            points.add({
              position: window.MSIMEarth.Cartesian3.fromDegrees(point[1], point[0], point[2]),
              color: color
            })
          })
          //////////////////////////
          // this.createDepthPointMapByUEJson(contentObj.Data)
          break
        case 'FLIGHT_TRAJECTORY_PREDICTION_ADVANCED':
          // 来自ARSIM实体信息
          // emitter.emit('FLIGHT_TRAJECTORY_PREDICTION_ADVANCED', contentObj)
          break
        default:
          break
      }
    } catch (error) {
      console.error('Error handling parsed message:', error)
    }
  }
  // 定义从0米到3000米的颜色映射，0-1000米每隔10米一个颜色
  getColorByHeight(height) {
    // 限制高度范围在0-3000米
    const clampedHeight = Math.max(0, Math.min(3000, height))

    // 定义丰富的颜色数组，覆盖多种颜色
    const colors = [
      [0, 0, 1], // 蓝色
      [0, 0.5, 1], // 亮蓝色
      [0, 1, 1], // 青色
      [0, 1, 0.5], // 蓝绿色
      [0, 1, 0], // 绿色
      [0.5, 1, 0], // 黄绿色
      [1, 1, 0], // 黄色
      [1, 0.5, 0], // 橙色
      [1, 0, 0], // 红色
      [0.5, 0, 0.5], // 紫色
      [1, 0, 1], // 品红色
      [1, 0.5, 1] // 粉色
    ]

    if (clampedHeight < 1000) {
      // 0-1000米：使用颜色数组实现丰富的颜色变化
      // 计算颜色索引：0-1000米对应0-999，每10米一个颜色，共100个颜色
      const index = Math.floor(clampedHeight / 10)
      // 计算在颜色数组中的位置，循环使用颜色
      const colorIndex = index % colors.length
      const nextColorIndex = (colorIndex + 1) % colors.length
      // 计算在两个颜色之间的插值比例
      const ratio = (index % 10) / 10

      // 获取当前颜色和下一个颜色
      const currentColor = colors[colorIndex]
      const nextColor = colors[nextColorIndex]

      // 在两个颜色之间进行线性插值
      const r = currentColor[0] + (nextColor[0] - currentColor[0]) * ratio
      const g = currentColor[1] + (nextColor[1] - currentColor[1]) * ratio
      const b = currentColor[2] + (nextColor[2] - currentColor[2]) * ratio

      return new window.MSIMEarth.Color(r, g, b, 1.0)
    } else if (clampedHeight < 2000) {
      // 1000-2000米：从橙色到红色
      const ratio = (clampedHeight - 1000) / 1000
      const r = 1.0
      const g = 0.5 - ratio * 0.5
      const b = 0
      return new window.MSIMEarth.Color(r, g, b, 1.0)
    } else {
      // 2000-3000米：从红色到深红色
      const ratio = (clampedHeight - 2000) / 1000
      const r = 1.0 - ratio * 0.3
      const g = 0
      const b = 0
      return new window.MSIMEarth.Color(r, g, b, 1.0)
    }
  }

  // 为深度点云生成基于高度的色带
  getColorByHeightForDepth(height) {
    // 低于0米：统一颜色（深蓝色）
    if (height < 0) {
      return Cesium.Color.fromCssColorString('#000080')
    }

    // 超过500米：统一颜色（深红色）
    if (height > 500) {
      return Cesium.Color.fromCssColorString('#800000')
    }

    // 定义颜色数组
    const colors = [
      [0, 0, 1],     // 蓝色 (0米)
      [0, 0.2, 1],   // 亮蓝色
      [0, 0.4, 1],   // 浅蓝色
      [0, 0.6, 1],   // 天蓝色
      [0, 0.8, 1],   // 淡蓝色
      [0, 1, 1],     // 青色
      [0, 1, 0.8],   // 蓝绿色
      [0, 1, 0.6],   // 绿色
      [0, 1, 0.4],   // 深绿色
      [0, 1, 0.2],   // 暗绿色
      [0.2, 1, 0],   // 黄绿色
      [0.4, 1, 0],   // 浅绿色
      [0.6, 1, 0],   // 亮绿色
      [0.8, 1, 0],   // 黄绿色
      [1, 1, 0],     // 黄色 (100米)
      [1, 0.9, 0],   // 浅黄色
      [1, 0.8, 0],   // 中黄色
      [1, 0.7, 0],   // 深黄色
      [1, 0.6, 0],   // 橙黄色
      [1, 0.5, 0],   // 橙色
      [1, 0.4, 0],   // 深橙色
      [1, 0.3, 0],   // 橙红色
      [1, 0.2, 0],   // 红色
      [1, 0.1, 0],   // 深红色 (200米)
      [0.9, 0, 0],   // 暗红色
      [0.8, 0, 0],   // 深红色
      [0.7, 0, 0.1],  // 红紫色
      [0.6, 0, 0.2],  // 紫色
      [0.5, 0, 0.3],  // 深紫色
      [0.4, 0, 0.4],  // 紫色 (300米)
      [0.3, 0, 0.5],  // 深紫色
      [0.2, 0, 0.6],  // 蓝紫色
      [0.1, 0, 0.7],  // 蓝紫色
      [0, 0, 0.8],    // 深蓝色
      [0, 0, 0.9],    // 深蓝色 (400米)
      [0, 0.1, 1],    // 亮蓝色
      [0, 0.2, 1],    // 亮蓝色
      [0, 0.3, 1],    // 亮蓝色
      [0, 0.4, 1],    // 亮蓝色
      [0, 0.5, 1]     // 亮蓝色 (500米)
    ]

    let colorIndex, ratio

    if (height <= 100) {
      // 前100米：每5米一个颜色
      const step = 5
      colorIndex = Math.floor(height / step)
      ratio = (height % step) / step
    } else {
      // 100米后：每10米一个颜色
      const step = 10
      colorIndex = Math.floor((height - 100) / step) + 20 // 20是前100米的颜色数量
      ratio = ((height - 100) % step) / step
    }

    // 确保颜色索引在范围内
    colorIndex = Math.min(colorIndex, colors.length - 2)

    // 获取当前颜色和下一个颜色
    const currentColor = colors[colorIndex]
    const nextColor = colors[colorIndex + 1]

    // 在两个颜色之间进行线性插值
    const r = currentColor[0] + (nextColor[0] - currentColor[0]) * ratio
    const g = currentColor[1] + (nextColor[1] - currentColor[1]) * ratio
    const b = currentColor[2] + (nextColor[2] - currentColor[2]) * ratio

    return Cesium.Color.fromRgba(Math.floor(r * 255), Math.floor(g * 255), Math.floor(b * 255), 255)
  }
}

export default EventARSIMByMQController
