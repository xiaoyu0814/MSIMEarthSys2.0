<!-- web显示UE的面板 -->
<template>
  <div class="ue-container animate__animated">
    <div class="header">
      <span class="title-content">孪生场景</span>
      <div class="btns-img">
        <!-- <el-icon class="icon-style" @click="switchContainer">
          <Switch />
        </el-icon> -->
        <el-icon class="icon-style" @click="changeFullScreen" title="切换窗口">
          <FullScreen />
        </el-icon>
        <el-icon class="icon-style" @click="closeUEContainer" title="关闭">
          <Close />
        </el-icon>
      </div>
    </div>
    <div id="iframe-play-ue5" class="iframe-ue5"></div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted, onUnmounted } from 'vue'
import store from '@/store'
import { closeUEIfram } from '@/components/earthComp/linkUE/logLinkUEIframe'
const state = reactive({
  isFullScreen: false,
  defaultStyle: {
    width: '348px',
    height: '202px',
    right: '5px',
    bottom: '30px',
    top: 'auto'
  },
  fullScreenStyle: {
    width: '100vw',
    height: 'calc(100vh + 100px)',
    right: '0px',
    bottom: '0px',
    top: '-100px'
  }
})
const switchContainer = () => {}
//关闭UE窗口
const closeUEContainer = () => {
  closeUEIfram(() => {
    // 关闭播放窗口
    document.getElementById('iframe-play-ue5').style.display = 'none' //关闭ue渲染面板
    store.commit('setShowUEContainer', false)
    document.getElementById('toolBar').style.display = 'block'
  })
}
const changeFullScreen = () => {
  state.isFullScreen = !state.isFullScreen
  let params = {}
  let element = document.getElementsByClassName('ue-container')[0]
  if (state.isFullScreen) {
    //全屏
    params = state.fullScreenStyle
    element.classList.remove('low-animate-box')
    element.classList.add('animate-box')
    document.getElementById('toolBar').style.display = 'none'
    document
      .getElementsByClassName('ue-container')[0]
      .getElementsByClassName('header')[0].style.top = '215px'
  } else {
    params = state.defaultStyle
    element.classList.remove('animate-box')
    element.classList.add('low-animate-box')
    document.getElementById('toolBar').style.display = 'block'
    document
      .getElementsByClassName('ue-container')[0]
      .getElementsByClassName('header')[0].style.top = '3px'
  }
  document.getElementsByClassName('ue-container')[0].style.width = params.width
  document
    .getElementsByClassName('ue-container')[0]
    .style.setProperty('height', params.height, 'important')
  document.getElementsByClassName('ue-container')[0].style.right = params.right
  document.getElementsByClassName('ue-container')[0].style.bottom =
    params.bottom

  // document.getElementById('iframe-play-ue5').style.width = params.width
  // document.getElementById('iframe-play-ue5').style.height = params.height
  document.getElementsByClassName('ue-container')[0].style.top = params.top
}
onMounted(() => {
  state.isFullScreen = true
  changeFullScreen()
})
onUnmounted(() => {
  setTimeout(() => {
    if (store.state.sceneModule.showUEContainer) {
      closeUEContainer()
    }
  }, 1500)
  document.getElementById('toolBar').style.display = 'block'
})
</script>

<style lang="less" scoped>
.ue-container {
  position: absolute;
  overflow: hidden;
  border: none;
  z-index: 0;
  right: 5px;
  bottom: 30px;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  width: 348px;
  height: 202px;
  .header {
    position: absolute;
    top: 3px;
    right: 3px;
    z-index: 1111;
    width: 100%;
    text-align: left;
    .title-content {
      margin-left: 20px;
      line-height: 48px;
      font-size: 25px;
      color: #ffffff;
      letter-spacing: 2.4px;
      font-weight: 400;
    }
    .btns-img {
      display: inline-block;
      text-align: right;
      width: calc(100% - 140px);
      .icon-style {
        font-size: 20px;
        color: #637b97;
        cursor: pointer;
        font-weight: 800;
        margin-right: 8px;
      }
    }
  }
  #iframe-play-ue5 {
    width: 100%;
    height: 100%;
  }
}
@keyframes growFromBottomRight {
  0% {
    // transform: scale(0);
    // transform-origin: bottom right;
    opacity: 0;
    width: 0;
    height: 0;
  }
  100% {
    // transform: scale(1);
    // transform-origin: top left;
    opacity: 1;
    width: 100%;
    height: 100%;
  }
}
@keyframes lowFromLeftTop {
  100% {
    transform: scale(1);
    transform-origin: top left;
    opacity: 1;
  }
  0% {
    transform: scale(0);
    transform-origin: bottom right;
    opacity: 1;
  }
}
.animate-box {
  animation: growFromBottomRight 2s ease-in-out;
  /* 设置动画的时长，缓动函数，迭代次数等属性 */
  animation-duration: 2s;
  animation-fill-mode: forwards; /* 在动画完成后保持最后一帧的样式 */
}
.low-animate-box {
  animation: lowFromLeftTop 2s ease-in-out;
  /* 设置动画的时长，缓动函数，迭代次数等属性 */
  animation-duration: 2s;
  animation-fill-mode: forwards; /* 在动画完成后保持最后一帧的样式 */
}
</style>
