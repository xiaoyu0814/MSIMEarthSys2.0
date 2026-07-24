<template>
  <div class="realvideoInfo">
    <Transition
      name="custom-classes"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <img
        v-show="!vueData.rightShow"
        class="right-shrink"
        :src="
          vueData.rightShow
            ? require('@/assets/image/panelIcons/telescoping.png')
            : require('@/assets/image/panelIcons/telescoping_1.png')
        "
        @click="rightContentShow"
      />
    </Transition>
    <Transition
      name="custom-classes"
      enter-active-class="animate__animated animate__backInRight"
      leave-active-class="animate__animated animate__backOutRight"
    >
      <div class="log-information" v-show="vueData.rightShow">
        <div class="pie-interaction">
          <img
            class="content-img"
            :src="
              vueData.rightShow
                ? require('@/assets/image/panelIcons/telescoping_1.png')
                : require('@/assets/image/panelIcons/telescoping.png')
            "
            @click="rightContentShow"
          />
          <div class="formulate-title">
            <span>音视频对话</span>
          </div>
          <img
            src="@/assets/image/panelIcons/关闭icon.png"
            alt=""
            class="close_sty"
            @click="handleClose"
          />
          <div class="main-title">
            <div class="seatName">{{ vueData.seatName }}</div>
          </div>
          <div class="main-box">
            <video ref="remoteVideo" class="video2" autoplay="autoplay"></video>
          </div>
          <div
            style="
              text-align: center;
              display: flex;
              justify-content: center;
              align-content: center;
            "
            class="refresh-button"
          >
            <div
              @click="pauseTalkback()"
              :class="
                vueData.ispauseTalkback ? 'buttonStyle' : 'unable-buttonStyle'
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
              @click="pauseAudio()"
              :class="
                vueData.ispauseAudioEnable
                  ? 'buttonStyle'
                  : 'unable-buttonStyle'
              "
            >
              暂停音频
            </div>
            <div
              @click="restoreAudio()"
              :class="
                vueData.isrestoreAudioEnable
                  ? 'buttonStyle'
                  : 'unable-buttonStyle'
              "
            >
              恢复音频
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const localVideo = ref()
const remoteVideo = ref()
import { reactive, onMounted, watch, ref } from 'vue'
import store from '@/store'

const vueData = reactive({
  localStream: null,
  remoteStream: null,
  localVideo: null,
  remoteVideo: null,
  rightShow: true,
  seatName: '',
  ispauseTalkback: true, //暂停对讲按钮是否可用
  isrestoreTalkback: false, //暂停对讲按钮是否可用
  ispauseAudioEnable: true, //暂停音频按钮是否可用
  isrestoreAudioEnable: false //恢复音频按钮是否可用
})

onMounted(() => {
  vueData.seatName = store.state.sceneModule.seatName
  vueData.remoteVideo = remoteVideo.value
  vueData.localVideo = localVideo.value
  gotRemoteMediaStream(store.state.sceneModule.remotemedia)
})

const gotRemoteMediaStream = (stream) => {
  console.log(stream)
  if (stream) {
    vueData.remoteStream = stream
    vueData.remoteVideo.srcObject = stream
  }
}

const gotLocalMediaStream = (mediaStream) => {
  if (mediaStream) {
    vueData.localVideo.srcObject = mediaStream
    vueData.localStream = mediaStream
  }
}

const rightContentShow = () => {
  vueData.rightShow = !vueData.rightShow
}

const handleClose = () => {
  store.commit('closeBottomControlPanel', 'three')
  store.commit('setstopTalkback', true)
  emitter.emit('Showvideo', false)
}
/*
暂停对讲
*/
const pauseTalkback = () => {
  vueData.remoteStream.getTracks().forEach((track) => {
    track.enabled = false
  })
  updateButtonStyle(false, true)
  updateAudioButtonStyle(false, true)
}
/*
恢复对讲
*/
const restoreTalkback = () => {
  vueData.remoteStream.getTracks().forEach((track) => {
    track.enabled = true
  })
  updateButtonStyle(true, false)
  updateAudioButtonStyle(true, false)
}
const updateButtonStyle = (val2, val3) => {
  vueData.ispauseTalkback = val2
  vueData.isrestoreTalkback = val3
}

const updateAudioButtonStyle = (val1, val2) => {
  vueData.ispauseAudioEnable = val1
  vueData.isrestoreAudioEnable = val2
}

//停止音频
const pauseAudio = () => {
  vueData.remoteStream.getTracks().forEach((track) => {
    if (track.kind === 'audio') track.enabled = false
  })
  updateAudioButtonStyle(false, true)
}
//恢复音频
const restoreAudio = () => {
  vueData.remoteStream.getTracks().forEach((track) => {
    if (track.kind === 'audio') track.enabled = true
  })
  updateAudioButtonStyle(true, false)
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
.realvideoInfo {
  position: absolute;
  bottom: 32px;
  right: 0%;
  width: 17vw;
  height: 450px;
  .right-shrink {
    position: absolute;
    top: calc(50% - 31.5px);
    right: 0;
    transform: rotate(180deg);
    z-index: 2;
    cursor: pointer;
    width: 20px;
    font-size: 36px !important;
  }
  .log-information {
    width: 100%;
    height: 100%;

    background-image: url('~@/assets/image/panelIcons/装饰.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .pie-interaction {
      position: relative;
      width: 98.8%;
      height: 97.4%;
      background: rgba(2, 26, 70, 0.88);
      box-shadow: 0 0 25px #1092d5;
      color: #fff;
      .content-img {
        position: absolute;
        left: -6%;
        top: calc(50% - 31.5px);
        z-index: 2;
        cursor: pointer;
        font-size: 36px !important;
        transform: rotate(180deg);
      }

      .formulate-title {
        display: flex;
        align-items: center;
        padding: 10px 0 10px 30px;
        box-sizing: border-box;
        text-align: left;
        font-size: 20px;
        font-weight: bold;
      }
      .close_sty {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 10px;
        right: 10px;
        cursor: pointer;
      }
      .main-title {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        font-weight: bold;
        margin-top: 10px;
        .seatName {
          text-align: center;
          width: 100%;
          color: #06d6f9;
        }
      }
      .main-box {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        margin-left: 12px;
        width: 95%;
        margin-bottom: 10px;
        .video2 {
          display: flex;
          height: 275px;
          width: 100%;
          margin: 0;
        }
      }
      .refresh-button {
        display: flex;
        position: relative;
        margin-top: 25px;
        height: 55px;
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
      }
    }
  }
}
</style>
