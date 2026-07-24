/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-04-19 09:42:04
 * @LastEditors: ZX Li
 * @LastEditTime: 2024-06-12 09:31:11
 */
import SockJS from 'sockjs-client'
import Stomp from 'stompjs'
import { VIDEO_URL } from '../request/config'
const socket = (username) => {
  let baseUrl = serverUrls.serversCommunication
  //请求的起始地址，根据开发环境变量确定
  let stompClient = Stomp.over(new SockJS(baseUrl + '/chat-websocket'))
  // //用SockJS代替brokenURL
  let user = username
  return {
    log(v) {
      console.log(v)
    },
    stompClient: stompClient,
    connect(callback) {
      console.log('连接111')
      let that = this
      this.stompClient.connect(
        {
          user: user,
          reconnectDelay: 10000, //重连时间
          heartbeatIncoming: 4000,
          heartbeatOutgoing: 4000
        },
        function (f) {
          that.log('Info: STOMP connection opened：' + f)
          callback()
        },
        function () {
          //断开处理
          that.log('Info: STOMP connection closed.')
        }
      )
      //启动
    },
    close() {
      if (this.stompClient !== null) {
        this.stompClient.deactivate()
      }
    },
    //发送消息
    send(addr, to, msg) {
      console.log('发送消息', addr, to, msg)
      this.stompClient.send(
        '/webSocket' + addr,
        {},
        JSON.stringify({
          message: msg,
          datetime: '2019-09-25',
          from: user,
          to: to
        })
      )
    },
    //订阅消息
    subscribe(addr, callback) {
      this.stompClient.subscribe(addr, (res) => {
        var result = JSON.parse(res.body)
        callback(result)
      })
    }
  }
}
export default socket
