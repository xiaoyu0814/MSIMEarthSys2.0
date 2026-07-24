/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2025-09-02 14:26:11
 * @LastEditors: ZX Li
 * @LastEditTime: 2025-09-02 15:18:05
 */
// 基于protobuf协议获取rabbitMQ交换过来的仿真实体路径等信息
import Stomp from 'stompjs'
import protobuf from 'protobufjs'
import { base64ToArrayBuffer } from './protoMQConfig/index'
import {
  webCZML,
  webPrimitive
} from '@/utils/earthPlugin/ThirdParty/eventSource/event/earthEvent'
// rabbitMQ结合protobuf接收AFSIM消息配置信息
const MQ_SERVICE = rbmqUrl // mq服务地址
const MQ_TOPIC = '/exchange/SIMULATION_MU_RED' // 订阅频道
const MQ_LOGIN = 'guest' // 用户名
const MQ_PASSCODE = 'guest' // 密码
const PROTO_URL = 'static/config/json/MU.proto' // 密码

// 全局连接状态跟踪
let globalStompClient = null
let globalSubscribe = null
let isConnected = false

class RedProtoBufController {
  protoUrl = undefined
  MQService = undefined
  topic = undefined
  login = undefined
  passcode = undefined
  protoMessageFormat
  constructor(options) {
    this.protoUrl = options?.protoUrl || PROTO_URL
    this.MQService = options?.MQService || MQ_SERVICE
    this.topic = options?.topic || MQ_TOPIC
    this.login = options?.login || MQ_LOGIN
    this.passcode = options?.passcode || MQ_PASSCODE
    this.protoMessageFormat = null
  }
  async initProto() {
    //1. 配置.proto文件地址
    const protoUrl = this.protoUrl
    //2. 订阅proto文件
    const response = await fetch(protoUrl)
    const content = await response.text()
    //3. 解析.proto 文件
    const root = await protobuf.parse(content).root
    //4. 保存需要的消息对象
    this.protoMessageFormat = root.lookupType('MU')
    const { handleWebCzmlUpdate } = webCZML()
    const { handleWebPrimitiveUpdate } = webPrimitive()
    this.connectByClient(handleWebCzmlUpdate)
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

  connectByClient(handleWebCzmlUpdate) {
    let that = this
    let protoMessageFormat = this.protoMessageFormat
    let exchange = this.topic

    // 先断开已有连接
    this.disconnectExistingConnection().then(() => {
      //1. 初始化stomp对象
      let client = Stomp.client(this.MQService)
      // 禁用STOMP调试日志
      client.debug = function () {}
      //2. 初始化参数对象
      var headers = {
        login: this.login,
        passcode: this.passcode,
        host: '/'
      }

      //3. 创建连接,放入连接成功和失败回调函数
      client.connect(headers, onConnected, onFailed)

      function onConnected() {
        globalStompClient = client
        isConnected = true

        //2. 绑定交换机,放入收到消息后的回调函数和失败的回调函数
        EarthAPP.MQCount += 1
        console.log(
          `仿真轨迹数据MQ消息初始化成功,当前页面连接仿真数据MQ次数:${EarthAPP.MQCount}`
        )

        //订阅监听成功回调
        globalSubscribe = client.subscribe(exchange, function (messages) {
          let arr8buffer = base64ToArrayBuffer(messages.body)
          let res = protoMessageFormat.decode(arr8buffer)
          renderMessage(res)
        })
      }

      function renderMessage(res) {
        switch (res.MessageType) {
          case 'MU':
            let msg = {
              Data: res
            }
            handleWebCzmlUpdate(msg)
            break
          default:
            break
        }
      }

      function onFailed(frame) {
        console.log('Failed: ' + frame)
        console.log('一秒后重新连接')
        globalStompClient = null
        globalSubscribe = null
        isConnected = false
        setTimeout(() => {
          that.connectByClient(handleWebCzmlUpdate)
        }, 1000)
      }
    })
  }
}
export default RedProtoBufController
