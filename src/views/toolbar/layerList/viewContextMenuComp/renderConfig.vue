<!--
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-05-08 09:19:33
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2025-10-16 17:11:31
 * @FilePath: \MSIMEarthSysN\src\views\toolbar\layerList\viewContextMenuComp\renderConfig.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <li
    class="renderConfig"
    v-for="(item, index) in props.renderList"
    :key="index"
    @click="renderClick(item, index)"
  >
    <el-tooltip
      class="box-item"
      effect="dark"
      :content="item.name"
      placement="bottom-start"
    >
      <img
        :src="
          require(`@/assets/image/rightNavbar/viewContextMenu/${item.urlon}`)
        "
        v-if="item.isShow"
      />
      <img
        :src="
          require(`@/assets/image/rightNavbar/viewContextMenu/${item.urloff}`)
        "
        v-else
      />
    </el-tooltip>
    <canvas id="canvas" v-show="state.isSpeaking"></canvas>
    <div class="content-text" v-show="state.isQuestion">
      {{ state.question }}
    </div>
  </li>
</template>

<script setup>
import Recorder from 'js-audio-recorder'
import emitter from '@/utils/eventbus'
import { reactive, nextTick, watch } from 'vue'
import {
  linkUEIframe,
  closeUEIfram
} from '@/components/earthComp/linkUE/logLinkUEIframe'
import store from '@/store/index'
import {
  parseVoiceStream,
  parseVoiceSend,
  parseVoiceFileSimulation,
  parseVoiceStreamSimulation,
  parseVoiceReplyOfOnePlate,
  parseVoice
} from '@/service/voice.js'
import { ElMessage } from 'element-plus'

const props = defineProps({
  renderList: {
    type: Array,
    defind: {}
  }
})

const state = reactive({
  isSpeaking: false,
  recorder: null,
  drawRecordId: null,
  isQuestion: false,
  question: ''
})

// watch(
//   () => store.sceneModule.showUEContainer,
//   (newVal, oldVal) => {
//     props.renderList[0].isShow = newVal
//   },
//   { deep: true }
// )
const renderClick = (item, index) => {
  props.renderList[index].isShow = !props.renderList[index].isShow
  switch (item.name) {
    case '孪生场景':
      if (item.isShow) {
        //显示UE云渲染
        let params = {
          entityID: store.getters.getCurrentEntityId
        }
        linkUEIframe(params, () => {
          store.commit('setShowUEContainer', item.isShow)
          nextTick(() => {
            document.getElementById('iframe-play-ue5').style.display = 'block' // 打开播放窗口
          })
        })
      } else {
        closeUEIfram(() => {
          // 关闭播放窗口
          document.getElementById('iframe-play-ue5').style.display = 'none' //关闭ue渲染面板
          store.commit('setShowUEContainer', item.isShow)
        })
      }
      break
    case '语音交互':
      {
        if (item.isShow) {
          //开始语音交互
          startRecording()
        } else {
          //关闭语音交互
          stopRecording()
        }
        store.commit('setVoiceInteractionConfig', item.isShow)
      }
      break
    default:
      break
  }
}
let mediaStream
let mediaRecorder
let audioChunks = []
async function startRecording() {
  try {
    // 请求麦克风权限
    mediaStream = await navigator.mediaDevices.getUserMedia({
      audio: true
    })

    // 创建 MediaRecorder，指定使用 audio/webm格式
    const mimeType = 'audio/webm'
    if (!MediaRecorder.isTypeSupported(mimeType)) {
      alert(`不支持的音频格式: ${mimeType}`)
      return
    }

    mediaRecorder = new MediaRecorder(mediaStream, { mimeType })
    console.log('mediaRecorder', mediaRecorder)
    audioChunks = []

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        audioChunks.push(event.data)
      }
    }

    mediaRecorder.onstop = async () => {
      // 合并音频块为一个 Blob
      const audioBlob = new Blob(audioChunks, { type: 'audio/wav' })
      let entitypath2 = window.EarthPlugn.entity._GetCZMLEntity(
        store.getters.getCurrentNode.code,
        'MSIMEarthCZMLProcessContainer'
      )
      const entitiesCartographic = getEititiesPostion(entitypath2)
      const platName = store.getters.getCurrentNode.code
      const formData = new FormData()
      formData.append('MultipartFile', audioBlob)
      formData.append('alt', entitiesCartographic[2])
      formData.append('platName', platName)
      // const arrayBuffer = await audioBlob.arrayBuffer()

      // 转换为 File 对象
      //const audioFile = new File([audioBlob], 'recording.webm', { type: "audio/webm" });
      // 发送到后端
      try {
        parseVoiceReplyOfOnePlate(formData).then((res) => {
          console.log('res', res)
          if (res.code == 200) {
            // const formData = new FormData()
            // formData.append('text', res.text)
            // formData.append('pltName', store.getters.getCurrentNode.code)
            // console.log(formData)
            // parseVoiceSend(formData)
            ElMessage.success('导调成功')
          }
        })
      } catch (error) {
        ElMessage.error('识别失败，请检查网络或服务状态')
        console.log('识别失败，请检查网络或服务状态')
      }
      const fd = new FormData()
      const blob = state.recorder.getWAVBlob()
      const newbolb = new Blob([blob], { type: 'audio/wav' })
      const fileOfBlob = new File([newbolb], new Date().getTime() + '.wav')
      fd.append('file', fileOfBlob)
      parseVoice(fd).then((response) => {
        if (response.code == 200) {
          console.log('response.data', response.data)
          state.isQuestion = true
          appear(response.data)
        }
      })
    }

    mediaRecorder.start()
    console.log('正在录音...')
    state.isSpeaking = true
    state.recorder = new Recorder({
      sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
      sampleRate: 48000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
      numChannels: 1 // 声道，支持 1 或 2， 默认是1
      // compiling: false,(0.x版本中生效,1.x增加中)  // 是否边录边转换，默认是false
    })
    state.recorder.start().then(
      () => {
        drawRecord() //开始绘制图片
      },
      (error) => {
        // 出错了
        console.log(`${error.name} : ${error.message}`)
      }
    )
    // drawRecord()
  } catch (err) {
    alert('无法访问麦克风，请允许权限。')
  }
}

const appear = (content) => {
  state.question = ''
  clearTimeout(state.timer)
  var speed = 10 //设置定时的速度 越来越快
  var count = 1
  function changeContent() {
    var e = document.getElementsByClassName('content-text')[0]
    e.scrollTop = e.scrollHeight
    state.question = content.substring(0, count) //截取字符串
    count++

    if (content.length == count) {
      setTimeout(() => {
        state.isQuestion = false
      }, 5000)
    }
    if (count != content.length + 1) {
      // speed -= 1
      // if (speed < 5) speed = 5
      state.timer = setTimeout(changeContent, speed)
    }
  }
  changeContent()
}

/**
 * 绘制波浪图-录音
 * */
const drawRecord = () => {
  // 用requestAnimationFrame稳定60fps绘制
  state.drawRecordId = requestAnimationFrame(drawRecord)

  const oCanvas = document.getElementById('canvas')
  const ctx = oCanvas.getContext('2d')

  // 实时获取音频大小数据
  let dataArray = state.recorder.getRecordAnalyseData()
  let bufferLength = dataArray.length
  let url = new Image()
  url.src = require('@/assets/image/voice/背景.png')
  url.onload = function () {
    ctx.drawImage(url, 0, 0, oCanvas.width, oCanvas.height)
  }
  // state.ctx.draw()
  // 填充背景色
  ctx.fillStyle = 'rgba(0,0,0,0)'
  ctx.fillRect(0, 0, oCanvas.width, oCanvas.height)

  // 设定波形绘制颜色
  ctx.lineWidth = 2
  ctx.strokeStyle = 'rgb(75,217,217)'

  ctx.beginPath()

  var sliceWidth = (oCanvas.width * 1.0 - 60) / bufferLength, // 一个点占多少位置，共有bufferLength个点要绘制
    x = 30 // 绘制点的x轴位置

  for (var i = 0; i < bufferLength; i++) {
    var v = dataArray[i] / 128.0
    var y = (v * oCanvas.height) / 2

    if (i === 0) {
      // 第一个点
      ctx.moveTo(x, y)
    } else {
      // 剩余的点
      ctx.lineTo(x, y)
    }
    // 依次平移，绘制所有点
    x += sliceWidth
  }

  ctx.lineTo(oCanvas.width - 60, oCanvas.height / 2)
  ctx.stroke()
}

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
  }

  // 停止所有音轨以释放麦克风
  if (mediaStream) {
    mediaStream.getTracks().forEach((track) => track.stop())
  }

  state.isSpeaking = false
}

//获取czml实体经纬度信息
function getEititiesPostion(entitypath) {
  if (!window.MSIMEarth.defined(entitypath.position)) {
    return []
  }

  let currentTime = window.EarthViewer.clock.currentTime
  let positionArr = entitypath.position.getValue(currentTime)
  let entitiesCartographic =
    window.MSIMEarth.Cartographic.fromCartesian(positionArr)
  console.log(entitiesCartographic)
  return [
    window.MSIMEarth.Math.toDegrees(entitiesCartographic.longitude),
    window.MSIMEarth.Math.toDegrees(entitiesCartographic.latitude),
    entitiesCartographic.height
  ]
}
</script>

<style lang="less" scoped>
.renderConfig {
  width: 34px;
  height: 34px;
  padding-right: 5px;
  margin-right: 5px;

  //border-right: 1px solid;
  img {
    width: 30px;
    height: 30px;
  }

  #canvas {
    width: 500px;
    height: 100px;
    position: fixed;
    // top: 120px;
    // right: 90px;
    top: 90%;
    left: 50%;
    transform: translate(-50%, -50%);
    background: url('@/assets/image/voice/背景.png');
    background-size: 100% 100%;
    border-radius: 20px;
  }

  .content-text {
    position: fixed;
    // top: 120px;
    // right: 90px;
    // top: calc(90% + 50px);
    bottom: 2%;
    left: 50%;
    transform: translate(-50%, 0);
    font-size: 30px;
    background: rgba(0, 0, 0, 0.19);
    padding: 10px 20px;
    font-family: PingFangSC-Semibold;
    color: #25edff;
    letter-spacing: 0.31px;
    text-align: center;
    font-weight: 600;
  }
}
</style>
