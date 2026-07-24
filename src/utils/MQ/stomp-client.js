import Stomp from 'stompjs'
import {
  RMQ_SERVER,
  RMQ_VIRTUAL_HOST,
  RMQ_ACCOUNT,
  RMQ_PASSWORD
} from './mqConfig'
import { getQueue } from '@/api/queue'
import router from '@/router'
import { downloadURL } from '@/config'
import { ElNotification } from 'element-plus'

class StompClient {
  // eslint-disable-next-line space-before-function-paren
  constructor(rmqServer, rmqVirtualHost, rmqAccount, rmqPassword) {
    this.subscribes = '' // 订阅信息
    this.queueName = '' // 队列名
    this.client = null
    this.frame = null
    this.options = {
      vhost: rmqVirtualHost,
      incoming: 10000,
      outgoing: 10000,
      account: rmqAccount,
      pwd: rmqPassword,
      server: `ws://${rmqServer}/ws`
    }
  }
  async getQueueName() {
    let res = await getQueue()
    if (res.code == 200) {
      this.queueName = res.data.name
    }
  }
  // eslint-disable-next-line no-unused-vars
  connect(options) {
    let mqUrl = this.options.server
    let ws = new WebSocket(mqUrl)
    ws.onclose = (close) => {
      console.log('webSocket关闭', close)
    }
    ws.onerror = (error) => {
      console.log('webSocket异常', error)
    }
    ws.onopen = (success) => {
      console.log('webSocket连接成功', success)
    }
    this.client = Stomp.over(ws)
    this.client.heartbeat.incoming = this.options.incoming
    this.client.heartbeat.outgoing = this.options.outgoing
    this.client.debug = null // 关闭控制台调试
    // mq连接
    let onConnect = async () => {
      console.log('stomp 连接成功！')
      this.subscribe()
    }
    // mq错误重新进行连接
    let onError = (errorMsg) => {
      console.error(`stomp 断开连接，正在准备重新连接...`, errorMsg)
      this.connect(this.options)
    }
    // 连接
    this.client.connect(
      this.options.account,
      this.options.pwd,
      onConnect,
      onError,
      this.options.vhost
    )
  }
  //消息订阅
  subscribe() {
    if (!this.queueName) {
      return
    }
    this.client.subscribe(
      `/amq/queue/${this.queueName}`,
      this.onMessage.bind(this),
      this.onSubscribeFailed.bind(this)
    )
  }
  // 关闭mq连接
  closeConnect() {
    this.client.disconnect(() => {
      console.log('已关闭mq连接')
    })
  }
  onMessage(frame) {
    let data = JSON.parse(frame.body)
    let endStr = data.content ? data.content.split('，')[1] : ''
    let str = data.content
      ? '<span>' + data.content.split('，')[0] + ',' + endStr + '</span>'
      : ''
    ElNotification({
      title: data.title ? data.title : '温馨提示',
      message: str,
      dangerouslyUseHTMLString: true,
      type:
        data.levelId == 'ORDINARY'
          ? 'success'
          : data.levelId == 'CLAMANT'
          ? 'info'
          : data.levelId == 'URGENT'
          ? 'warning'
          : 'error',
      duration: 5000,
      position: 'top-right',
      onClick: () => {
        this.handleClick(data)
      }
    })
  }
  handleClick(data) {
    if (data.messageTypeId == 'file') {
      let url = downloadURL + data.link
      var x = new XMLHttpRequest()
      x.open('GET', url, true)
      let fileName = data.content.split('导出的')[1].split('已导出')[0]
      x.responseType = 'blob'
      x.onload = function () {
        let url = window.URL.createObjectURL(x.response)
        let a = document.createElement('a')
        a.href = url
        a.download = fileName // 名字可自定义
        a.click()
      }
      x.send()
    } else {
      router.push('/message/my-message')
    }
  }
  // const Download = (data, FileName, MimeType) => {
  //   // 创建请求下载，否则下载的文件内容是文件地址
  //   var x = new XMLHttpRequest();
  //   x.open("GET", data, true);
  //   x.setRequestHeader("Content-Type", "application/x-www-form-urlencoded;");//缺少这句，后台无法获取参数
  //   x.responseType = 'blob';
  //   x.onload = function (e) {
  //     download(x.response, FileName, MimeType);
  //   }
  //   x.send();
  // }
  //eslint-disable - next - line no - unused - vars
  onSubscribeFailed(frame) {
    console.log('rabbitmq subscribe failed')
  }
}
export default new StompClient(
  RMQ_SERVER,
  RMQ_VIRTUAL_HOST,
  RMQ_ACCOUNT,
  RMQ_PASSWORD
)
