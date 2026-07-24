<template>
  <div
    :class="
      store.state.sceneModule.currentScreen == 'earthView'
        ? 'UESmallScreen'
        : 'UEFullScreen'
    "
  >
    <div class="UE-container">
      <div id="play-ue" class="play-ue"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import store from '@/store'

let { loadPixelStream, closeStream, restartStream } = ueStreamApp('play-ue')
onMounted(() => {
  restartStream('play-ue')
})
onUnmounted(() => {
  closeStream('play-ue')
})
</script>

<style lang="less" scoped>
.UESmallScreen {
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
  .UE-container {
    position: relative;
    width: 98.8%;
    height: 97.4%;
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;
    .play-ue {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border: none;
      display: block;
    }
  }
}
.UEFullScreen {
  position: absolute;
  width: 100%;
  height: 100%;
  .UE-container {
    position: relative;
    width: 100%;
    height: 100%;
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;
    .play-ue {
      width: 100%;
      height: 100%;
      overflow: hidden;
      border: none;
      display: block;
    }
  }
}
</style>
