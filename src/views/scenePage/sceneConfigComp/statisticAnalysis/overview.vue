<template>
  <!-- 战役战术 -->
  <div class="conclusion-plan">
    <div class="plan-container">
      <div class="plan-title">
        <div class="title1"></div>
        <div class="title2"></div>
      </div>
      <div class="plan-context">
        <div class="context-item" style="color: #f18b8b">
          <div v-for="(item, key) in state.redData">{{ key }}：{{ item }}</div>
          <br />
        </div>
        <div class="context-item" style="color: #6eb7f8">
          <div v-for="(item, key) in state.blueData">{{ key }}：{{ item }}</div>
          <br />
        </div>
      </div>
      <div class="plan-charts" id="overView"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, nextTick, watch, markRaw, onUnmounted } from 'vue'
import emitter from '@/utils/eventbus'
import * as echarts from 'echarts'
import elementResizeDetectorMaker from 'element-resize-detector'
import store from '@/store'
import { getOverView } from '@/service/SSE.js'
import axios from 'axios'
const colorList = ['#C64611', '#076BCF']
const state = reactive({
  myEcharts: null,
  blueData: {},
  redData: {},
  echartData: []
})
const handleClose = () => {
  emitter.emit('handleConclusionPlan', false)
}
const get_overview = () => {
  let params = {
    id: sessionStorage.getItem('taskId')
  }
  getOverView(params).then((res) => {
    let data = res.data
    state.blueData['成员数量'] = data['PA'].blue
    state.redData['成员数量'] = data['PA'].red
    state.blueData['战损'] = data['PD'].blue
    state.redData['战损'] = data['PD'].red
    state.blueData['打击目标个数'] = data['RE'].blue
    state.redData['打击目标个数'] = data['RE'].red
    state.blueData['侦察目标个数'] = data['RE_STrackInit'].blue
    state.redData['侦察目标个数'] = data['RE_STrackInit'].red
    let arrRed = [
      data['PA'].red,
      data['PD'].red,
      data['RE'].red,
      data['RE_STrackInit'].red
    ]
    let arrBlue = [
      data['PA'].blue,
      data['PD'].blue,
      data['RE'].blue,
      data['RE_STrackInit'].blue
    ]
    state.echartData.push(arrRed)
    state.echartData.push(arrBlue)
    initEchart()
  })
}
const initEchart = () => {
  var chartDom = document.getElementById('overView')
  state.myEcharts = echarts.init(chartDom)
  var option

  option = {
    parallelAxis: [
      {
        dim: 0,
        name: '成员数量',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        nameTextStyle: {
          fontSize: 15
        }
      },
      {
        dim: 1,
        name: '战损',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        nameTextStyle: {
          fontSize: 15
        }
      },
      {
        dim: 2,
        name: '打击目标个数',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        nameTextStyle: {
          fontSize: 15
        }
      },
      {
        dim: 3,
        name: '侦察目标个数',
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        nameTextStyle: {
          fontSize: 15
        }
      }
    ],
    series: {
      type: 'parallel',
      lineStyle: {
        width: 3,
        color: function (params) {
          return colorList[params.dataIndex]
        }
      },
      data: state.echartData
    }
  }

  state.myEcharts.setOption(option)
}

onMounted(() => {
  get_overview()
})
onUnmounted(() => {})
</script>

<style lang="less" scoped>
.conclusion-plan {
  z-index: 9999999;
  width: 100%;
  height: 100%;
  color: #eee;
  .plan-container {
    height: 100%;
    .close_sty {
      cursor: pointer;
      position: absolute;
      top: 10px;
      right: 10px;
      width: 20px;
      height: 20px;
    }
    .plan-title {
      height: 60px;
      width: 100%;
      display: flex;
      align-items: center;
      .title1 {
        width: 50%;
        height: 100%;
        background: url('@/assets/image/panelIcons/红.png') no-repeat;
        background-position: center;
      }
      .title2 {
        width: 50%;
        height: 100%;
        background: url('@/assets/image/panelIcons/蓝.png') no-repeat;
        background-position: center;
      }
    }
    .plan-context {
      width: 100%;
      height: 170px;
      display: flex;
      align-items: flex-start;
      color: #6eb7f8;
      font-size: 24px;
      font-family: '黑体';
      justify-content: space-around;
      overflow: auto;

      .context-item {
        display: flex;
        flex-direction: column;
        align-items: baseline;
        justify-content: space-around;
      }
    }

    .plan-charts {
      width: 70%;
      height: calc(100% - 230px);
      margin-left: 15%;
    }
  }
}
</style>
