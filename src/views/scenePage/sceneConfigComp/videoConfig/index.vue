<template>
  <div class="videoConfig">
    <div class="title">音视频通话</div>
    <img
      src="@/assets/image/panelIcons/最小化.png"
      alt=""
      class="min_size"
      @click="handleMinSize"
    />
    <img
      src="@/assets/image/panelIcons/关闭icon.png"
      alt=""
      class="close_sty"
      @click="handleClose"
    />
    <div class="videoContent">
      <div class="main-title">
        <div class="video1Name">{{ vueData.localSeatName }}</div>
        <div class="video2Name">{{ vueData.remoteSeatName }}</div>
      </div>
      <div class="main-box">
        <video ref="localVideo" class="video1" autoplay="autoplay"></video>
        <video ref="remoteVideo" class="video2" autoplay="autoplay"></video>
      </div>
      <div
        style="
          text-align: center;
          display: flex;
          justify-content: left;
          padding: 5px;
          margin-left: 30px;
          margin-bottom: 5px;
          align-content: center;
        "
      >
        <div
          @click="requestConnect()"
          ref="callBtn"
          :class="vueData.isStartenable ? 'buttonStyle' : 'unable-buttonStyle'"
        >
          开始对讲
        </div>
        <div
          @click="pauseTalkback()"
          :class="
            vueData.ispauseTalkback ? 'red-buttonStyle' : 'unable-buttonStyle'
          "
        >
          暂停对讲
        </div>
        <div
          @click="restoreTalkback()"
          :class="
            vueData.isrestoreTalkback ? 'buttonStyle' : 'unable-buttonStyle'
          "
        >
          恢复对讲
        </div>
        <div
          @click="hangupHandle()"
          ref="hangupBtn"
          :class="
            !vueData.isStartenable ? 'red-buttonStyle' : 'unable-buttonStyle'
          "
        >
          结束对讲
        </div>
        <div
          style="margin-left: 220px"
          @click="autio"
          :class="
            vueData.ispauseAudioEnable ? 'buttonStyle' : 'unable-buttonStyle'
          "
        >
          停止音频
        </div>
        <div
          @click="restoreAudio"
          :class="
            vueData.isrestoreAudioEnable ? 'buttonStyle' : 'unable-buttonStyle'
          "
        >
          恢复音频
        </div>
        <div
          @click="video"
          :class="
            vueData.ispauseVideoEnable ? 'buttonStyle' : 'unable-buttonStyle'
          "
        >
          停止视频
        </div>
        <div
          @click="restoreVideo"
          :class="
            vueData.isrestoreVideoEnable ? 'buttonStyle' : 'unable-buttonStyle'
          "
        >
          恢复视频
        </div>
      </div>
      <div class="main-user">
        <div style="text-align: center; font-size: 14px; margin-left: 20px">
          <label for="name">发送人：</label>
          <el-input
            type="text"
            id="name"
            v-model="vueData.userId"
            class="form-control"
            style="width: 350px"
            :readonly="true"
          />
        </div>
        <el-form
          :model="vueData.formData"
          label-width="32%"
          style="align-content: left"
          margin="10px"
        >
          <el-form-item label="接收人：">
            <el-select
              v-model="vueData.toUserId"
              class="scene_input"
              placeholder="请选择"
              size="small"
              @change="handleChangeSimulator"
              clearable
            >
              <el-option
                v-for="item in vueData.simList"
                :key="item.simulatorTypeName"
                :label="item.simulatorTypeName"
                :value="item.simulatorTypeName"
              />
            </el-select>
          </el-form-item>
        </el-form>
        <div class="refresh-button">
          <div @click="refreshReceivers()" class="refreshbuttonStyle">刷新</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import emitter from '@/utils/eventbus'
import { onMounted, reactive, watch, ref } from 'vue'
import videoService from '@/service/videoServer/request'
import Websocket from '@/service/videoServer/websocket'
import store from '@/store'

const localVideo = ref()
const remoteVideo = ref()
const callBtn = ref()
const hangupBtn = ref()

let vueData = reactive({
  stompClient: null,
  userId: '',
  socket: null,
  toUserId: '',
  localStream: null,
  remoteStream: null,
  localVideo: null,
  remoteVideo: null,
  localSeatName: '',
  remoteSeatName: '',
  callBtn: null,
  hangupBtn: null,
  peerConnection: null,
  dialogVisible: false,
  msg: '',
  config: {
    iceServers: [{ urls: 'stun:global.stun.twilio.com:3478?transport=udp' }]
  },
  video1: true,
  autio1: true,
  formData: {
    toUserId: ''
  },
  simList: [
    {
      simulatorTypeName: 'admin',
      id: 1
    },
    {
      simulatorTypeName: 'admin123',
      id: 2
    }
  ],
  isStartenable: true, //开始对讲按钮是否可用
  ispauseTalkback: false, //暂停对讲按钮是否可用
  isrestoreTalkback: false, //暂停对讲按钮是否可用
  ispauseAudioEnable: false, //暂停音频按钮是否可用
  isrestoreAudioEnable: false, //恢复音频按钮是否可用
  ispauseVideoEnable: false, //暂停视频按钮是否可用
  isrestoreVideoEnable: false, //恢复视频按钮是否可用
  seatList: [
    { key: 'admin', seatName: '导调控制席' },
    { key: 'red_zhkz', seatName: '指挥控制席' },
    { key: 'red_qb', seatName: '情报席' }
  ]
})
watch(
  () => store.state.sceneModule.isstopTalkback,
  (newValue) => {
    if (newValue) {
      hangupHandle
    }
  }
)
/*
开始对讲
*/
const requestConnect = () => {
  if (!vueData.toUserId) {
    ElMessage.error('请输入对方id')
    return false
  } else if (!vueData.stompClient) {
    ElMessage.error('请先打开websocket')
    return false
  } else if (vueData.toUserId == vueData.userId) {
    ElMessage.error('自己不能和自己连接')
    return false
  }
  //准备连接
  startHandle().then(() => {
    vueData.stompClient.send('/api/chat', vueData.toUserId, { type: 'connect' })
  })
}
/*
结束对讲
*/
const hangupHandle = () => {
  // 关闭连接并设置为空
  if (vueData.peerConnection) {
    vueData.peerConnection.close()
    vueData.peerConnection = null
  }

  if (vueData.localStream) {
    vueData.localStream.getTracks().forEach((track) => {
      console.log(track)
      track.stop()
    })
  }
  updateButtonStyle(true, false, false)
  updateAudioButtonStyle(false, false)
  updateVideoButtonStyle(false, false)
}
/*
暂停对讲
*/
const pauseTalkback = () => {
  vueData.localStream.getTracks().forEach((track) => {
    track.enabled = false
  })
  updateButtonStyle(false, false, true)
  updateAudioButtonStyle(false, true)
  updateVideoButtonStyle(false, true)
}
/*
恢复对讲
*/
const restoreTalkback = () => {
  vueData.localStream.getTracks().forEach((track) => {
    track.enabled = true
  })
  updateButtonStyle(false, true, false)
  updateAudioButtonStyle(true, false)
  updateVideoButtonStyle(true, false)
}
const updateButtonStyle = (val1, val2, val3) => {
  vueData.isStartenable = val1
  vueData.ispauseTalkback = val2
  vueData.isrestoreTalkback = val3
}

const updateAudioButtonStyle = (val1, val2) => {
  vueData.ispauseAudioEnable = val1
  vueData.isrestoreAudioEnable = val2
}

const updateVideoButtonStyle = (val1, val2) => {
  vueData.ispauseVideoEnable = val1
  vueData.isrestoreVideoEnable = val2
}
//停止音频
const autio = () => {
  vueData.autio1 = !vueData.autio1
  vueData.localStream.getTracks().forEach((track) => {
    if (track.kind === 'audio') track.enabled = false
  })
  updateAudioButtonStyle(false, true)
  if (!vueData.ispauseAudioEnable && !vueData.ispauseVideoEnable) {
    vueData.ispauseTalkback = false
    vueData.isrestoreTalkback = true
  }
}
//恢复音频
const restoreAudio = () => {
  vueData.autio1 = !vueData.autio1
  vueData.localStream.getTracks().forEach((track) => {
    if (track.kind === 'audio') track.enabled = true
  })
  updateAudioButtonStyle(true, false)
  if (!vueData.isrestoreAudioEnable && !vueData.isrestoreVideoEnable) {
    vueData.ispauseTalkback = true
    vueData.isrestoreTalkback = false
  }
}
//停止视频
const video = () => {
  vueData.video1 != vueData.video1
  vueData.localStream.getTracks().forEach((track) => {
    if (track.kind === 'video') track.enabled = false
  })
  updateVideoButtonStyle(false, true)
  if (!vueData.ispauseAudioEnable && !vueData.ispauseVideoEnable) {
    vueData.ispauseTalkback = false
    vueData.isrestoreTalkback = true
  }
}
//恢复视频
const restoreVideo = () => {
  vueData.video1 != vueData.video1
  vueData.localStream.getTracks().forEach((track) => {
    if (track.kind === 'video') track.enabled = true
  })
  updateVideoButtonStyle(true, false)
  if (!vueData.isrestoreAudioEnable && !vueData.isrestoreVideoEnable) {
    vueData.ispauseTalkback = true
    vueData.isrestoreTalkback = false
  }
}

const handleConnection = (event) => {
  // 获取到触发 icecandidate 事件的 RTCPeerConnection 对象
  const peerConnection = event.target
  const icecandidate = event.candidate

  if (icecandidate) {
    vueData.stompClient.send('/api/chat', vueData.toUserId, {
      type: 'icecandidate',
      icecandidate: icecandidate
    })
  }
}

const handleMinSize = () => {
  emitter.emit('Showvideo', true)
  emitter.emit('closeBottomControlPanel', 'three')
}

const handleClose = () => {
  emitter.emit('closeBottomControlPanel', 'three')
  hangupHandle()
}

const startWebsocket = (user) => {
  vueData.stompClient = Websocket(user)
  console.log('vueData.stompClient', vueData.stompClient)
  vueData.stompClient.connect(() => {
    vueData.stompClient.subscribe(
      '/user/' + vueData.userId + '/queue/notifications',
      function (result) {
        onmessage(result)
      }
    )
  })
}
const gotLocalMediaStream = (mediaStream) => {
  vueData.localVideo.srcObject = mediaStream
  vueData.localStream = mediaStream
  store.state.sceneModule.localmedia = mediaStream
}
const createConnection = () => {
  vueData.peerConnection = new RTCPeerConnection()
  if (vueData.localStream) {
    // 视频轨道
    const localVideoTrack = vueData.localStream.getVideoTracks()
    // 音频轨道
    const localAudioTrack = vueData.localStream.getAudioTracks()
    // 判断视频轨道是否有值
    if (localVideoTrack.length > 0) {
      console.log(`使用的设备为: ${localVideoTrack[0].label}.`)
    }
    // 判断音频轨道是否有值
    if (localAudioTrack.length > 0) {
      console.log(`使用的设备为: ${localAudioTrack[0].label}.`)
    }

    vueData.localStream.getTracks().forEach((track) => {
      console.log(track)
      vueData.peerConnection.addTrack(track, vueData.localStream)
    })
  }

  // 监听返回的 Candidate
  vueData.peerConnection.addEventListener('icecandidate', handleConnection)
  // 监听 ICE 状态变化
  vueData.peerConnection.addEventListener(
    'iceconnectionstatechange',
    handleConnectionChange
  )
  vueData.peerConnection.addEventListener(
    'onicecandidateerror',
    handleerrorChange
  )
  //拿到流的时候调用
  vueData.peerConnection.addEventListener('track', gotRemoteMediaStream)
}
const startConnection = () => {
  // 发送offer
  vueData.peerConnection
    .createOffer()
    .then((description) => {
      console.log(`本地创建offer返回的sdp:\n${description.sdp}`)
      vueData.peerConnection
        .setLocalDescription(description)
        .then(() => {
          console.log('local 设置本地描述信息成功')
          vueData.stompClient.send('/api/chat', vueData.toUserId, description)
        })
        .catch((err) => {
          console.log('local 设置本地描述信息错误', err)
        })
    })
    .catch((err) => {
      console.log('createdOffer 错误', err)
    })

  //获取远端对讲席位
  vueData.seatList.forEach((item) => {
    if (item.key == vueData.toUserId) vueData.remoteSeatName = item.seatName
  })
}
const startHandle = async () => {
  vueData.callBtn = callBtn.value
  vueData.hangupBtn = hangupBtn.value
  vueData.remoteVideo = remoteVideo.value
  vueData.localVideo = localVideo.value
  // 1.获取本地音视频流
  // 调用 getUserMedia API 获取音视频流
  let constraints = {
    video: true,
    audio: {
      // 设置回音消除
      noiseSuppression: true,
      // 设置降噪
      echoCancellation: true
    }
  }
  navigator.getUserMedia =
    navigator.getUserMedia ||
    navigator.webkitGetUserMedia ||
    navigator.mozGetUserMedia ||
    navigator.msGetUserMedia
  await navigator.mediaDevices
    .getUserMedia(constraints)
    .then(gotLocalMediaStream)
    .catch((err) => {
      console.log('getUserMedia 错误', err)
      //创建点对点连接对象
    })

  createConnection()
  //获取本地席位
  vueData.seatList.forEach((item) => {
    if (item.key == vueData.userId) vueData.localSeatName = item.seatName
  })
  updateButtonStyle(false, true, false)
  updateAudioButtonStyle(true, false)
  updateVideoButtonStyle(true, false)
}
const onmessage = (e) => {
  const description = e.message
  vueData.toUserId = e.from
  switch (description.type) {
    case 'refuse':
      vueData.dialogVisible = false
      ElMessageBox.alert(vueData.toUserId + '已拒绝连接!', '警告', {
        confirmButtonText: '确定',
        type: 'warning'
      })
      break
    case 'connect':
      vueData.dialogVisible = true
      console.log(vueData.toUserId)
      ElMessageBox.confirm(vueData.toUserId + '请求连接!', '提示', {})
        .then(() => {
          startHandle().then(() => {
            vueData.stompClient.send('/api/chat', vueData.toUserId, {
              type: 'start'
            })
          })
          console.log('提示：请求连接!  111111')
          //获取远端对讲席位
          vueData.seatList.forEach((item) => {
            if (item.key == vueData.toUserId)
              vueData.remoteSeatName = item.seatName
          })
        })
        .catch(() => {
          //用户拒绝连接
          vueData.stompClient.send('/api/chat', vueData.toUserId, {
            type: 'refuse'
          })
        })
      break
    case 'start':
      //同意连接之后开始连接
      startConnection()
      break
    case 'offer':
      vueData.peerConnection
        .setRemoteDescription(new RTCSessionDescription(description))
        .then(() => {})
        .catch((err) => {
          console.log('local 设置远端描述信息错误', err)
        })

      vueData.peerConnection
        .createAnswer()
        .then(function (answer) {
          vueData.peerConnection
            .setLocalDescription(answer)
            .then(() => {
              console.log('设置本地answer成功!')
            })
            .catch((err) => {
              console.error('设置本地answer失败', err)
            })
          vueData.stompClient.send('/api/chat', vueData.toUserId, answer)
        })
        .catch((e) => {
          console.error(e)
        })
      break
    case 'icecandidate':
      // 创建 RTCIceCandidate 对象
      let newIceCandidate = new RTCIceCandidate(description.icecandidate)
      // 将本地获得的 Candidate 添加到远端的 RTCPeerConnection 对象中
      vueData.peerConnection
        .addIceCandidate(newIceCandidate)
        .then(() => {
          console.log(`addIceCandidate 成功`)
        })
        .catch((error) => {
          console.log(`addIceCandidate 错误:\n` + `${error.toString()}.`)
        })
      break
    case 'answer':
      vueData.peerConnection
        .setRemoteDescription(new RTCSessionDescription(description))
        .then(() => {
          console.log('设置remote answer成功!')
        })
        .catch((err) => {
          console.log('设置remote answer错误', err)
        })
      break
    default:
      break
  }
}
const handleChangeSimulator = (item) => {
  console.log(item)
  vueData.toUserId = item
}

const gotRemoteMediaStream = (event) => {
  console.log('remote 开始接受远端流')
  console.log(event)
  if (event.streams[0]) {
    console.log(' remoteVideo')
    store.state.sceneModule.seatName = vueData.remoteSeatName
    store.state.sceneModule.remotemedia = event.streams[0]
    if (vueData.autio1) {
      vueData.remoteStream = event.streams[0]
    }
    if (vueData.video1) {
      vueData.remoteVideo.srcObject = event.streams[0]
    }
  }
}
const handleConnectionChange = (event) => {
  const peerConnection = event.target
  console.log('ICE state change event: ', event)
  console.log(`ICE state: ` + `${peerConnection.iceConnectionState}.`)
  if (peerConnection.iceConnectionState == 'failed') {
    ElMessage.error('对方已拒绝连接!')
  }
  if (peerConnection.iceConnectionState == 'disconnected') {
    ElMessage.error('对方已结束对讲!')
    vueData.remoteStream.getTracks().forEach((track) => {
      track.stop()
    })
  }
}
const handleerrorChange = (event) => {
  console.error('ICE Candidate Error:', event)
}

onMounted(() => {
  vueData.localSeatName = ''
  vueData.remoteSeatName = ''
  vueData.userId = window.localStorage.getItem('side')
  refreshReceivers()
  startWebsocket(vueData.userId)
})
const refreshReceivers = () => {
  videoService().then((response) => {
    console.log(response)
    let index = 1
    vueData.simList = []
    response.forEach((item) => {
      if (item != vueData.userId) {
        vueData.simList.push({ simulatorTypeName: item, id: index })
        index++
      }
    })
  })
}
</script>

<style lang="less" scoped>
.unable-buttonStyle {
  background-color: #808080;
  width: 83px;
  height: 33px;
  color: #ffff;
  border-radius: 5px;
  margin-left: 10px;
  line-height: 33px;
  pointer-events: none;
}
.red-buttonStyle {
  background-color: #cb1c01;
  width: 83px;
  height: 33px;
  color: #ffff;
  border-radius: 5px;
  margin-left: 10px;
  line-height: 33px;
  cursor: pointer;
}
.videoConfig {
  z-index: 100;
  position: absolute;
  left: calc(50% - 530px);
  top: calc(50% - 350px);
  color: #ffffff;
  width: 1050px;
  height: 600px;
  background: url(@/assets/image/panelIcons/背景框.png);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  //background: rgba(2, 26, 70, 0.88);
  //box-shadow: 0 0 25px #1092d5;
  justify-content: center;
  align-items: center;
  .min_size {
    width: 24px;
    height: 20px;
    position: absolute;
    top: 25px;
    right: 45px;
    cursor: pointer;
  }
  .close_sty {
    width: 20px;
    height: 20px;
    position: absolute;
    top: 25px;
    right: 15px;
    cursor: pointer;
  }
  .title {
    margin-top: 25px;
    margin-left: 40px;
    text-align: left;
    box-sizing: border-box;
    font-size: 22px;
    font-weight: 900;
    color: #60abff;
    //border-bottom: 1px solid #224d7c;
  }
  .videoContent {
    .main-title {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      font-size: 18px;
      font-weight: bold;
      margin-top: 10px;
      .video1Name {
        text-align: center;
        width: 500px;
        color: #06d6f9;
        height: 25px;
      }
      .video2Name {
        text-align: center;
        width: 500px;
        color: #06d6f9;
        height: 25px;
      }
    }
    .main-box {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      //margin: 10px;
      .video1 {
        display: flex;
        height: 400px;
        width: 500px;
        margin-right: 1px;
      }
      .video2 {
        display: flex;
        height: 400px;
        width: 500px;
        margin-left: 1px;
      }
    }
    .main-user {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: left;
      margin-left: 10px;
      margin-right: 10px;
      height: 55px;
      border-top: 1px solid #224d7c;
    }
    .refresh-button {
      display: flex;
      position: absolute;
      right: 5%;
      .refreshbuttonStyle {
        background: #01abe6;
        width: 83px;
        height: 33px;
        color: #ffff;
        border-radius: 5px;
        margin-left: 10px;
        line-height: 33px;
        cursor: pointer;
      }
    }
    .buttonStyle {
      background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
      width: 83px;
      height: 33px;
      color: #ffff;
      border-radius: 5px;
      margin-left: 10px;
      line-height: 33px;
      cursor: pointer;
    }
    :deep(.el-input) {
      .el-input__wrapper {
        border-radius: 5px;
        box-shadow: none;
        background-color: #2b4559 !important;
        box-shadow: 0 0 0 1px #075d89 inset !important;
      }
      .el-input__inner {
        color: #fff !important;
      }
    }
  }
  .scene_input {
    // margin-top: 25px;
    border: none !important;
    right: 1%;
    height: 15px;

    :deep(.el-input__inner) {
      font-size: 13px;
      font-weight: 500;
      color: #06d6f9;
      border: none !important;
      text-align: left;
      width: 300px;
      height: 30px;
    }
    :deep(.el-input__wrapper) {
      background-color: #172e51 !important;
      box-shadow: 0 0 25px #1092d5;
    }

    :deep(.el-input) {
      --el-input-border-color: #e5e5e500 !important;
      --el-input-hover-border: transparent !important;
      --el-input-focus-border: transparent !important;
      --el-input-placeholder-color: #06d6f9;
    }

    :deep(.el-select) {
      --el-select-border-color-hover: transparent !important;
      --el-select-input-focus-border-color: transparent !important;
    }

    :deep(.el-input__wrapper:hover) {
      border: none !important;
      box-shadow: none;
    }
  }
  :deep(.el-form-item__label) {
    color: white;
    margin: 8px 0px;
    padding: 8px;
  }
  :deep(.el-form-item_content) {
    right: 30%;
    height: 40px;
    position: relative;
  }
}
</style>
