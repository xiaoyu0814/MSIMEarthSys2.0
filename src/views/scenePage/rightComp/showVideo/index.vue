<template>
  <div class="showVideo">
    <div class="video-container">
      <video
        ref="video"
        :src="state.audioUrl"
        controls
        autoplay
        volume="0"
        @timeupdate="handleTimeUpdate"
      ></video>
    </div>
  </div>
</template>

<script setup>
import store from '@/store'
import emitter from '@/utils/eventbus'
import { reactive, onMounted, watch } from 'vue'

const state = reactive({
  audioUrl: ''
})
const handleTimeUpdate = () => {}
watch(
  () => store.state.sceneModule.audioUrl,
  (newValue) => {
    state.audioUrl = 'static/video/' + newValue + '.mp4'
  }
)
onMounted(() => {
  state.audioUrl = 'static/video/' + store.state.sceneModule.audioUrl + '.mp4'
  // 视频播放完毕关闭视频组件
  var md = document.getElementsByTagName('video')[0]
  md.addEventListener('ended', function () {
    emitter.emit('closeBottomControlPanel', 'right')
  })
})
</script>

<style lang="less" scoped>
.showVideo {
  position: absolute;
  bottom: 32px;
  right: 0%;
  width: 550px;
  height: 500px;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  .video-container {
    position: relative;
    width: 98.8%;
    height: 97.4%;
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;
    video {
      width: 100%;
      height: 100%;
    }
  }
  z-index: 999;
}
</style>
