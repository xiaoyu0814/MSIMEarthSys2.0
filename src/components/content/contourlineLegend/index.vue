<template>
  <div class="terrainBand-legend contourline-legend">
    <img
      src="@/assets/image/panelIcons/关闭icon.png"
      alt="关闭"
      class="close_sty"
      @click="handleClose"
    />
    <div class="title-div">等高线</div>
    <div v-for="item in state.colors" class="item" :key="item.height">
      <div class="itemWidth">
        <div class="color" :style="`background:${item.color}`"></div>
      </div>
      <div class="itemWidth1">
        <div class="height">{{ item.height }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import store from '@/store/index'
import emitter from '@/utils/eventbus'
import { moveBtnPanel } from '@/utils/mapTools'

const state = reactive({
  colors: [
    {
      color: 'rgba(0, 0, 0, 1)',
      height: '0~1000(m)'
    },
    {
      color: 'rgba(39, 87, 224, 1)',
      height: '1000~2000(m)'
    },
    {
      color: 'rgba(211, 59, 125, 1)',
      height: '2000~3000(m)'
    },
    {
      color: 'rgba(122, 12, 18, 1)',
      height: '3000~4000(m)'
    },
    {
      color: 'rgba(255, 151, 66, 1)',
      height: '4000~5000(m)'
    },
    {
      color: 'rgba(255, 215,0, 1)',
      height: '5000~6000(m)'
    },
    {
      color: 'rgba(255, 255, 255, 1)',
      height: '6000~8777(m)'
    }
    // {
    //   color: 'rgba(250, 252, 178, 1)',
    //   height: '雷达追踪'
    // },
    // {
    //   color: 'rgba(34, 63, 167, 1)',
    //   height: '雷达跟踪（无人机）'
    // },
    // {
    //   color: 'rgba(127, 156, 48, 1)',
    //   height: '杀伤'
    // },
    // {
    //   color: 'rgba(145, 54, 145, 1)',
    //   height: '路径'
    // }
  ]
})

const handleClose = () => {
  emitter.emit('changeContourlineLegend', false) // 关闭链路框
}

onMounted(() => {
  moveBtnPanel('contourline-legend')
})
</script>

<style lang="less" scoped>
.terrainBand-legend {
  position: absolute;
  // top: 12%;
  // right: 123px;
  // width: 200px;
  top: 8%;
  right: 90px;
  width: 140px;
  // height: 250px;
  // background: url('@/assets/image/voiceInteraction/qiyeliebiao.png');
  // background-size: 100% 100%;
  // background: rgba(7, 8, 11, 0.6);
  // box-shadow: 0 12px 12px 0 rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(2, 26, 70, 0.88);
  // border-top: transparent;
  border-radius: 4px;
  backdrop-filter: blur(1px);
  animation: zoomIn 0.4s;
  // margin-bottom: 1.5vh;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;

  .title-div {
    background: url('@/assets/image/panelIcons/title-bg3.png') no-repeat;
    background-size: 100.1% 48px;
    height: 40px;
    line-height: 48px;
    // font-size: 25px;
    font-size: 20px;
    color: #ffffff;
    letter-spacing: 2.4px;
    font-weight: 400;
    text-align: left;
    // padding-left: 50px;
    padding-left: 16px;
  }

  .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    // margin: 20px 10px;
    margin: 10px 10px;
    color: white;

    .itemWidth {
      width: 30%;
    }

    .itemWidth1 {
      width: 60%;
    }

    .color {
      width: 100%;
      height: 2px;
      margin: 0 auto;
      border-radius: 4px;
    }
  }

  .close_sty {
    cursor: pointer;
    position: absolute;
    top: 13px;
    right: 4px;
    width: 20px;
    height: 20px;
  }
}
</style>
