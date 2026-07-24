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
          <div v-for="(item, key) in state.redDamageData" style="color: orange">
            {{ key }}：{{ item }}
          </div>
        </div>
        <div class="context-item" style="color: #6eb7f8">
          <div v-for="(item, key) in state.blueData">{{ key }}：{{ item }}</div>
          <br />
          <div
            v-for="(item, key) in state.blueDamageData"
            style="color: orange"
          >
            {{ key }}：{{ item }}
          </div>
        </div>
      </div>
      <div class="plan-charts" id="damageAssessment"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, nextTick, watch, markRaw, onUnmounted } from 'vue'
import emitter from '@/utils/eventbus'
import * as echarts from 'echarts'
import elementResizeDetectorMaker from 'element-resize-detector'
import store from '@/store'
import { getEquipment, getEquipmentOff } from '@/service/SSE.js'

const state = reactive({
  myEcharts: null,
  blueData: {
    // 指挥所: '2个',
    // 战斗机: '4架',
    // 雷达: '6台',
    // 导弹车: '3辆',
    // 导弹: '18枚'
  },
  blueDamageData: {
    // 指挥所损毁: '0个',
    // 战斗机损毁: '4架',
    // 导弹车损毁: '0辆',
    // 雷达损毁: '0台',
    // 导弹消耗: '18枚'
  },
  redData: {
    // 无人侦察机: '10架',
    // 无人轰炸机: '4架',
    // 歼击机: '4架',
    // 无人机: '4架',
    // 导弹: '23枚',
    // 驱逐舰: '2艘'
  },
  redDamageData: {
    // 无人轰炸机损毁: '2架',
    // 无人侦察机损毁: '5架',
    // 歼击机损毁: '0架',
    // 导弹消耗: '19枚',
    // 无人机损毁: '0架',
    // 驱逐舰损毁: '0艘'
  },
  damageAssessmentOption: {
    //   title: {
    //     text: "拥堵时序图",
    //   },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross',
        label: {
          backgroundColor: '#6a7985'
        }
      }
    },
    // legend: {
    //   data: ["红方", "蓝方"],
    // },
    grid: {
      left: '3%',
      right: '8%',
      bottom: '3%',
      top: '6%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        name: '时间',
        position: 'bottom',
        data: [],
        splitLine: {
          show: false,
          lineStyle: {
            type: 'dashed',
            color: '#00ffee'
          }
        },
        axisLabel: {
          color: 'white'
        }
      },
      {
        type: 'category',
        boundaryGap: true,
        data: [],
        splitLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: '#00ffee'
          }
        },
        axisLabel: {
          color: 'white'
        }
      }
    ],

    yAxis: [
      {
        type: 'value',
        show: false,
        splitLine: {
          show: false,
          lineStyle: {
            type: 'dashed',
            color: '#00ffee'
          }
        }
      },
      {
        type: 'category',
        name: '阵营',
        data: ['蓝方', '红方'],
        position: 'left',
        axisLabel: {
          textStyle: {
            fontSize: '12',
            color: 'white'
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          show: false,
          lineStyle: {
            type: 'dashed',
            color: 'rgba(255,225,225,0.2)'
          }
        }
      }
    ],

    series: [
      {
        name: '蓝方',
        type: 'line',
        stack: '总量',
        smooth: true,
        areaStyle: {},
        itemStyle: {
          normal: {
            color: '#3c94d9',
            lineStyle: {
              color: '#3c94d9',
              width: 1
            },
            areaStyle: {
              //color: '#94C9EC'
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: 'rgba(7,44,90,0.3)'
                },
                {
                  offset: 1,
                  color: '#3c94d9'
                }
              ])
            }
          }
        },
        color: '#FFE669',
        data: []
      },

      {
        name: '红方',
        type: 'line',
        stack: '总量',
        smooth: true,
        areaStyle: {},
        itemStyle: {
          normal: {
            color: '#f53730',
            lineStyle: {
              color: '#f53730',
              width: 1
            },
            areaStyle: {
              //color: '#94C9EC'
              color: new echarts.graphic.LinearGradient(0, 1, 0, 0, [
                {
                  offset: 0,
                  color: 'rgba(7,44,90,0.3)'
                },
                {
                  offset: 1,
                  color: '#f53730'
                }
              ])
            }
          }
        },
        color: '#ED7D31',
        data: []
      }
    ]
  }
})
const handleClose = () => {
  emitter.emit('handleConclusionPlan', false)
}
const initChart = () => {
  state.myEcharts.setOption(state.damageAssessmentOption)
  window.addEventListener('resize', function () {
    state.myEcharts.resize()
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('damageAssessment'), function () {
    nextTick(() => {
      state.myEcharts.resize()
    })
  })
}
watch(
  () => store.state.sceneModule.damageAssessmentData,
  (newValue) => {
    getEquipmentData()
    state.damageAssessmentOption.series[0].data = newValue.blue
    state.damageAssessmentOption.series[1].data = newValue.red
    state.damageAssessmentOption.xAxis[0].data = newValue.timeData
    state.damageAssessmentOption.xAxis[1].data = newValue.title
    initChart()
  }
)

// 获取席位方设备类型中文名称及数量
const getEquipmentData = () => {
  getEquipment().then((res) => {
    console.log(res, 'rrrrr')
    if (res.code == 200) {
      state.blueData = res.data.blueData
      state.redData = res.data.redData
    }
  })
  getEquipmentOff().then((res) => {
    console.log(res, 'eeeee')
    if (res.code == 200) {
      state.blueDamageData = res.data.blueDamageData
      state.redDamageData = res.data.redDamageData
    }
  })
}
onMounted(() => {
  getEquipmentData()
  state.damageAssessmentOption.series[0].data =
    store.state.sceneModule.damageAssessmentData.blue
  state.damageAssessmentOption.series[1].data =
    store.state.sceneModule.damageAssessmentData.red
  state.damageAssessmentOption.xAxis[0].data =
    store.state.sceneModule.damageAssessmentData.timeData
  state.damageAssessmentOption.xAxis[1].data =
    store.state.sceneModule.damageAssessmentData.title
  state.myEcharts = markRaw(
    echarts.init(document.getElementById('damageAssessment'))
  )
  initChart()
})
onUnmounted(() => {
  state.myEcharts.dispose()
})
</script>

<style lang="less" scoped>
.conclusion-plan {
  z-index: 9999999;
  width: 100%;
  height: 100%;
  // width: 700px;
  // height: 500px;
  color: #eee;
  // background: url('@/assets/image/panelIcons/背景.png') no-repeat;
  // background-size: 100% 100%;
  // border: 1px solid rgba(117, 252, 255, 0.8);
  // border-radius: 4px;
  // backdrop-filter: blur(1px);
  // animation: zoomIn 0.4s;

  .plan-container {
    // margin: 30px 15px;
    // height: calc(100% - 60px);

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
      // height: calc(100% - 110px);
      width: 100%;
      height: 360px;
      display: flex;
      align-items: flex-start;
      color: #6eb7f8;
      font-size: 24px;
      font-family: '黑体';
      justify-content: space-around;
      overflow: auto;

      .context-item {
        // width: 50%;
        // height: 100%;
        display: flex;
        flex-direction: column;
        align-items: baseline;
        justify-content: space-around;
        // margin-left: 80px;
      }
    }

    .plan-charts {
      width: 100%;
      height: 200px;
    }
  }
}
</style>
