<template>
  <div id="user">
    <!-- 通知 -->
    <el-popover trigger="click" :width="160">
      <div style="text-align: center; margin: 0">
        <div v-if="store.getters.get_newEmail || store.getters.get_newMessage">
          <p v-if="store.getters.get_newEmail" @click="setEmailType">
            收到新邮件，请查收
          </p>
          <p v-if="store.getters.get_newMessage" @click="setMessageType">
            收到新消息，请查收
          </p>
        </div>
        <p v-else>暂无消息</p>
      </div>
      <template #reference>
        <el-badge
          :is-dot="store.getters.get_newEmail || store.getters.get_newMessage"
          class="badge"
        >
          <img src="~@/assets/images/通知.png" alt="通知" />
        </el-badge>
      </template>
    </el-popover>
    <!-- 用户 -->
    <el-popover trigger="click" placement="top-start" width="200">
      <div
        class="user_box"
        style="
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          align-items: center;
        "
      >
        <el-button
          size="small"
          type="primary"
          style="margin: 0"
          @click="logout"
        >
          退出登录
        </el-button>
      </div>
      <template #reference>
        <el-badge :is-dot="false" class="badge">
          <img src="~@/assets/images/user.png" alt="用户" />
        </el-badge>
      </template>
    </el-popover>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'

const router = useRouter()

const store = useStore()

const vueData = reactive({
  newEmail: store.getters.get_newEmail,
  newMessage: store.getters.get_newMessage,
  routesContent: ''
})

var topic = 'push_message_topic'

const rabbitMQ_mqtt = () => {
  // mqtt连接
  var client = new Paho.MQTT.Client(
    brokerIp,
    port,
    '/ws',
    'clientId_' + parseInt(Math.random() * 100, 10)
  )
  var options = {
    timeout: 3, //超时时间
    keepAliveInterval: 30, //心跳时间
    // userName:"admin",  //用户名
    // password: "pwd",  //密码
    onSuccess: function () {
      client.subscribe(topic, { qos: 1 })
    },
    onFailure: function (message) {
      console.log('连接失败~' + message.errorMessage)
    }
  }
  // 考虑到https的情况
  if (location.protocol == 'https:') {
    options.useSSL = true
  }
  client.connect(options)
  console.log('已经连接到' + brokerIp + ':' + port)

  // 连接断开事件
  client.onConnectionLost = function (responseObject) {
    console.log('失去连接 - ' + responseObject.errorMessage)
  }

  // 接收消息事件
  client.onMessageArrived = function (message) {
    console.log(message)
    console.log(
      '接受主题： ' +
        message.destinationName +
        '的消息： ' +
        message.payloadString
    )
    let str = {}
    let val = JSON.parse(message.payloadString).split(',')
    val.forEach((item) => {
      let o = item.split(':')
      str[o[0]] = o[1]
    })
    if (str.toUserId == sessionStorage.getItem('userId')) {
      store.commit('SET_NEWMESSAGE', true)
      console.log(store.getters.get_newMessage)
    }
    console.log(str)
  }
}
// let client = Stomp.client(`ws://${serverUrl}/ws`);
const rabbitMQ = () => {
  // let serverUrl = window.rabbitMQ;
  // let client = Stomp.client(`ws://${serverUrl}/ws`);
  // 设置心跳
  client.heartbeat.outgoing = 3000
  client.heartbeat.incoming = 5000

  let onConnect = (frame) => {
    console.log(frame)
    //交换机名称
    client.subscribe(`/exchange/exchange_pushmsg/rk_recivemsg`, (data) => {
      console.log('data', data)
      let str = {}
      let val = JSON.parse(data.body).split(',')
      val.forEach((item) => {
        let o = item.split(':')
        str[o[0]] = o[1]
      })
      if (str.toUserId == sessionStorage.getItem('userId')) {
        store.commit('SET_NEWMESSAGE', true)
        console.log(store.getters.get_newMessage)
      }
      console.log(str)
    })
    // store.state.rabbitMQ.Interval=setInterval(() => {
    try {
      client.send('test')
      console.log('发送消息')
    } catch (err) {
      console.log('断开了：' + err)
      client.connect(
        clientInfo.login,
        clientInfo.passcode,
        onConnect,
        onError,
        '/'
      )
    }
    // })
  }
  let onError = (frame) => {
    console.log('通讯连接失败，将无法收到信息！')
    client.connect(
      clientInfo.login,
      clientInfo.passcode,
      onConnect,
      onError,
      '/'
    )
  }
  // 定义客户端信息
  let clientInfo = {
    login: 'admin',
    passcode: 'pwd'
  }
  // 连接rabbitmq
  client.connect(clientInfo.login, clientInfo.passcode, onConnect, onError, '/')
}

const setData = (url) => {
  if (url != null) {
    var xhrRouts = new XMLHttpRequest()
    xhrRouts.timeout = 0
    xhrRouts.withCredentials = false
    xhrRouts.responseType = ''
    xhrRouts.onload = function (response) {
      console.log('response', response)
      vueData.routesContent = response
    }
    console.log(url)
    xhrRouts.open('GET', url, true)
    xhrRouts.send(null)
  }
}

let toRouter = (path) => {
  router.push(path)
}

/**
 * @description 登出
 */
let logout = () => {
  sessionStorage.clear()
  router.push('/')
}

/**
 * @description 设置邮件状态
 */
let setEmailType = () => {
  store.commit('SET_NEWEMAIL', false)
}

/**
 * @description 更新信息状态
 */
let setMessageType = () => {
  store.commit('SET_NEWMESSAGE', false)
  store.state.leftMenu.showLeftMeneContent = true
  store.state.leftMenu.menuItem.id = 'cjjg'
}

onMounted(() => {
  // rabbitMQ()
  // rabbitMQ_mqtt();
})
</script>

<style lang="less" scoped>
#user {
  .badge {
    margin-right: 10px;
    img {
      width: 24px;
      // margin-right: 10px;
      cursor: pointer;
    }
  }
}

::v-deep(.user_box) {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
}
</style>
