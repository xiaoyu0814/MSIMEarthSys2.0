import Websocket from '@/service/videoServer/websocket'
import store from '@/store'
class videoConfig {
  constructor(config) {
    this.stompClient = null
    this.userId = config.userId
    this.socket = null
    this.toUserId = ''
    this.localStream = null
    this.remoteStream = null
    this.remoteVideo = null
    this.peerConnection = null
  }
  /*
  建立websocket连接
  */
  startWebsocket = (user) => {
    this.stompClient = Websocket(user)
    console.log('this.stompClient', this.stompClient)
    this.stompClient.connect(() => {
      this.stompClient.subscribe(
        '/user/' + this.userId + '/queue/notifications',
        function (result) {
          onmessage(result)
        }
      )
    })
  }
  /*
开始对讲
*/
  requestConnect = (toUserId) => {
    this.toUserId = toUserId
    if (!this.toUserId) {
      ElMessage.error('请输入对方id')
      return false
    } else if (!this.stompClient) {
      ElMessage.error('请先打开websocket')
      return false
    } else if (this.toUserId == this.userId) {
      ElMessage.error('自己不能和自己连接')
      return false
    }
    //准备连接
    startHandle().then(() => {
      this.stompClient.send('/api/chat', this.toUserId, {
        type: 'connect'
      })
    })
  }
  /*
结束对讲
*/
  hangupHandle = () => {
    // 关闭连接并设置为空
    if (this.peerConnection) {
      this.peerConnection.close()
      this.peerConnection = null
    }
  }
  /*
  websocket消息监听
  */
  onmessage = (e) => {
    const description = e.message
    this.toUserId = e.from
    switch (description.type) {
      case 'refuse':
        ElMessageBox.alert(this.toUserId + '已拒绝连接!', '警告', {
          confirmButtonText: '确定',
          type: 'warning'
        })
        break
      case 'connect':
        console.log(this.toUserId)
        ElMessageBox.confirm(this.toUserId + '请求连接!', '提示', {})
          .then(() => {
            startHandle().then(() => {
              this.stompClient.send('/api/chat', this.toUserId, {
                type: 'start'
              })
            })
          })
          .catch(() => {
            //用户拒绝连接
            this.stompClient.send('/api/chat', this.toUserId, {
              type: 'refuse'
            })
          })
        break
      case 'start':
        //同意连接之后开始连接
        startConnection()
        break
      case 'offer':
        this.peerConnection
          .setRemoteDescription(new RTCSessionDescription(description))
          .then(() => {})
          .catch((err) => {
            console.log('local 设置远端描述信息错误', err)
          })

        this.peerConnection
          .createAnswer()
          .then(function (answer) {
            this.peerConnection
              .setLocalDescription(answer)
              .then(() => {
                console.log('设置本地answer成功!')
              })
              .catch((err) => {
                console.error('设置本地answer失败', err)
              })
            this.stompClient.send('/api/chat', this.toUserId, answer)
          })
          .catch((e) => {
            console.error(e)
          })
        break
      case 'icecandidate':
        // 创建 RTCIceCandidate 对象
        let newIceCandidate = new RTCIceCandidate(description.icecandidate)
        // 将本地获得的 Candidate 添加到远端的 RTCPeerConnection 对象中
        this.peerConnection
          .addIceCandidate(newIceCandidate)
          .then(() => {
            console.log(`addIceCandidate 成功`)
          })
          .catch((error) => {
            console.log(`addIceCandidate 错误:\n` + `${error.toString()}.`)
          })
        break
      case 'answer':
        this.peerConnection
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
  /*
  开始连接
  */
  startHandle = async () => {
    // 调用 getUserMedia API 获取本地音视频流
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
  }
  /*
  接收远端数据流
  */
  gotRemoteMediaStream = (event) => {
    if (event.streams[0]) {
      console.log('remoteVideo')
      //在这个地方将event.streams[0]传给显示窗口的remoteStream
      this.remoteStream = event.streams[0]
      store.state.sceneModule.remotemedia = event.streams[0]
    }
  }
  /*
  通信状态变化监听
  */
  handleConnectionChange = (event) => {
    const peerConnection = event.target
    console.log('ICE state change event: ', event)
    console.log(`ICE state: ` + `${peerConnection.iceConnectionState}.`)
    if (peerConnection.iceConnectionState == 'failed') {
      ElMessage.error('对方已拒绝连接!')
    }
    if (peerConnection.iceConnectionState == 'disconnected') {
      ElMessage.error('对方已结束对讲!')
      this.remoteStream.getTracks().forEach((track) => {
        track.stop()
      })
    }
  }
  /*
  接收本地数据流
  */
  gotLocalMediaStream = (mediaStream) => {
    //在这个地方将mediaStream传给显示窗口的localStream
    this.localStream = mediaStream
    store.state.sceneModule.localmedia = mediaStream
  }
  /*
  peerConnection创建连接
  */
  createConnection = () => {
    this.peerConnection = new RTCPeerConnection()
    if (this.localStream) {
      // 视频轨道
      const localVideoTrack = this.localStream.getVideoTracks()
      // 音频轨道
      const localAudioTrack = this.localStream.getAudioTracks()
      // 判断视频轨道是否有值
      if (localVideoTrack.length > 0) {
        console.log(`使用的设备为: ${localVideoTrack[0].label}.`)
      }
      // 判断音频轨道是否有值
      if (localAudioTrack.length > 0) {
        console.log(`使用的设备为: ${localAudioTrack[0].label}.`)
      }

      this.localStream.getTracks().forEach((track) => {
        this.peerConnection.addTrack(track, this.localStream)
      })
    }

    // 监听返回的 Candidate
    this.peerConnection.addEventListener('icecandidate', handleConnection)
    // 监听 ICE 状态变化
    this.peerConnection.addEventListener(
      'iceconnectionstatechange',
      handleConnectionChange
    )
    //拿到流的时候调用
    this.peerConnection.addEventListener('track', gotRemoteMediaStream)
  }
  /*
  peerConnection开始连接
  */
  startConnection = () => {
    // 发送offer
    this.peerConnection
      .createOffer()
      .then((description) => {
        this.peerConnection
          .setLocalDescription(description)
          .then(() => {
            console.log('local 设置本地描述信息成功')
            this.stompClient.send('/api/chat', this.toUserId, description)
          })
          .catch((err) => {
            console.log('local 设置本地描述信息错误', err)
          })
      })
      .catch((err) => {
        console.log('createdOffer 错误', err)
      })
  }
}
