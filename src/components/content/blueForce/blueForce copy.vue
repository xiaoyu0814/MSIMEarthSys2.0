<template>
  <div class="blueRadar">
    <div class="pie-echart" id="blueRadar"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import elementResizeDetectorMaker from 'element-resize-detector'
import { onMounted, reactive, nextTick } from 'vue'
import emitter from '@/utils/eventbus'

const symbol1 = require('@/assets/image/leftForceChart/4.png')
const symbol1r = require('@/assets/image/leftForceChart/4r.png')
const symbol2 = require('@/assets/image/leftForceChart/1.png')
const symbol2r = require('@/assets/image/leftForceChart/1r.png')
const symbol3 = require('@/assets/image/leftForceChart/2.png')
const symbol3r = require('@/assets/image/leftForceChart/2r.png')
const symbol4 = require('@/assets/image/leftForceChart/3.png')
const symbol4r = require('@/assets/image/leftForceChart/3r.png')

const state = reactive({
  myEcharts: null,
  redAndBlueRadarOption: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    tooltip: {
      trigger: 'item',
      show: false,
      textStyle: { fontSize: '100%' }
      // backgroundColor: 'none',
    },
    grid: {
      right: '20%'
    },
    // legend: {
    //   show: true,
    //   bottom: "5%",
    //   right: "2%",
    //   textStyle: { color: "#fff" },
    //   itemWidth: 20,
    //   itemHeight: 20,
    //   orient: "vertical",
    //   data: [
    //     { name: "未感染", icon: legend1 },
    //     { name: "无症状感染", icon: legend2 },
    //     { name: "确诊病例", icon: legend3 },
    //   ],
    // },
    series: {
      type: 'graph',
      layout: 'none', // 图的布局
      //   symbol: symbol1, // 默认是「未感染」
      symbolSize: 30,
      categories: [
        { name: '未感染' },
        { name: '无症状感染' },
        { name: '确诊病例' }
      ],
      edgeSymbol: ['circle', 'arrow'],
      edgeSymbolSize: [4, 8],
      edgeLabel: {
        show: true,
        // textStyle: {
        fontSize: 10,
        // },
        formatter: '{c}'
      },
      data: [
        {
          name: '蓝方',
          value: { num: 55, type: 0 },
          draggable: true,
          x: -80,
          y: 30,
          symbol: 'rect',
          symbolSize: 30,
          label: {
            show: true,
            align: 'center',
            // textStyle: {
            fontSize: 12,
            color: '#fff'
            // }
          },
          itemStyle: {
            //配置节点的颜色
            // normal: {
            color: '#3c94d9',
            opacity: 0.9 //设置透明度，为0时不绘制
            // }
          }
        },
        {
          name: '空中指挥',
          value: { num: 55, type: 1 },
          category: 1,
          draggable: true,
          x: -50,
          y: 10,
          symbol: 'image://' + symbol2,
          label: {
            show: true,
            align: 'center',
            // textStyle: {
            fontSize: 12,
            color: '#fff',
            // },
            formatter: (params) => {
              return `{a${params.value.type}|}\n\n\n${params.name}`
            },
            rich: {
              a0: {
                color: '#fff',
                padding: [4, 5],
                backgroundColor: 'rgba(255, 86, 76, .45)'
              }
            }
          }
        },
        {
          name: '地面指挥',
          value: { num: 55, type: 2 },
          category: 1,
          draggable: true,
          x: -50,
          y: 55,
          symbol: 'image://' + symbol2,
          label: {
            show: true,
            align: 'center',
            // textStyle: {
            fontSize: 12,
            color: '#fff',
            // },
            formatter: (params) => {
              return `{a${params.value.type}|}\n\n\n${params.name}`
            },
            rich: {
              a0: {
                color: '#fff',
                padding: [4, 5],
                backgroundColor: 'rgba(255, 86, 76, .45)'
              }
            }
          }
        },
        {
          name: '飞行中队',
          value: { num: 55, type: 1 },
          category: 1,
          draggable: true,
          x: -10,
          y: -10,
          symbol: 'image://' + symbol2,
          label: {
            show: true,
            align: 'center',
            // textStyle: {
            fontSize: 12,
            color: '#fff',
            // },
            formatter: (params) => {
              return `{a${params.value.type}|}\n\n\n${params.name}`
            },
            rich: {
              a0: {
                color: '#fff',
                padding: [4, 5],
                backgroundColor: 'rgba(255, 86, 76, .45)'
              }
            }
          }
        },

        {
          name: '蓝方战斗机',
          value: { num: 55, type: 3 },
          category: 1,
          draggable: true,
          x: 20,
          y: -20,
          symbol: 'image://' + symbol4,
          label: {
            show: true,
            align: 'center',
            // textStyle: {
            fontSize: 12,
            color: '#fff',
            // },
            formatter: (params) => {
              return `{a${params.value.type}|}\n\n\n${params.name}`
            },
            rich: {
              a0: {
                color: '#fff',
                padding: [4, 5],
                backgroundColor: 'rgba(255, 86, 76, .45)'
              }
            }
          }
        },
        {
          name: '地面预警1',
          value: { num: 55, type: 3 },
          category: 1,
          draggable: true,
          x: -10,
          y: 20,
          symbol: 'image://' + symbol2,
          label: {
            show: true,
            align: 'center',
            // textStyle: {
            fontSize: 12,
            color: '#fff',
            // },
            formatter: (params) => {
              return `{a${params.value.type}|}\n\n\n${params.name}`
            },
            rich: {
              a0: {
                color: '#fff',
                padding: [4, 5],
                backgroundColor: 'rgba(255, 86, 76, .45)'
              }
            }
          }
        },
        {
          name: '地面预警2',
          value: { num: 55, type: 3 },
          category: 1,
          draggable: true,
          x: -10,
          y: 70,
          symbol: 'image://' + symbol2,
          label: {
            show: true,
            align: 'center',
            // textStyle: {
            fontSize: 12,
            color: '#fff',
            // },
            formatter: (params) => {
              return `{a${params.value.type}|}\n\n\n${params.name}`
            },
            rich: {
              a0: {
                color: '#fff',
                padding: [4, 5],
                backgroundColor: 'rgba(255, 86, 76, .45)'
              }
            }
          }
        },
        {
          name: '预警雷达',
          value: { num: 55, type: 3 },
          category: 1,
          draggable: true,
          x: 20,
          y: 20,
          symbol: 'image://' + symbol3,
          label: {
            show: true,
            align: 'center',
            // textStyle: {
            fontSize: 12,
            color: '#fff',
            // },
            formatter: (params) => {
              return `{a${params.value.type}|}\n\n\n${params.name}`
            },
            rich: {
              a0: {
                color: '#fff',
                padding: [4, 5],
                backgroundColor: 'rgba(255, 86, 76, .45)'
              }
            }
          }
        },
        {
          name: '追踪雷达1',
          value: { num: 55, type: 3 },
          category: 1,
          draggable: true,
          x: 20,
          y: 50,
          symbol: 'image://' + symbol3,
          label: {
            show: true,
            align: 'center',
            // textStyle: {
            fontSize: 12,
            color: '#fff',
            // },
            formatter: (params) => {
              return `{a${params.value.type}|}\n\n\n${params.name}`
            },
            rich: {
              a0: {
                color: '#fff',
                padding: [4, 5],
                backgroundColor: 'rgba(255, 86, 76, .45)'
              }
            }
          }
        },
        {
          name: '追踪雷达2',
          value: { num: 55, type: 3 },
          category: 1,
          draggable: true,
          x: 20,
          y: 75,
          symbol: 'image://' + symbol3,
          label: {
            show: true,
            align: 'center',
            // textStyle: {
            fontSize: 12,
            color: '#fff',
            // },
            formatter: (params) => {
              return `{a${params.value.type}|}\n\n\n${params.name}`
            },
            rich: {
              a0: {
                color: '#fff',
                padding: [4, 5],
                backgroundColor: 'rgba(255, 86, 76, .45)'
              }
            }
          }
        },
        {
          name: '导弹车',
          value: { num: 55, type: 3 },
          category: 1,
          draggable: true,
          x: 20,
          y: 100,
          symbol: 'image://' + symbol1,
          label: {
            show: true,
            align: 'center',
            // textStyle: {
            fontSize: 12,
            color: '#fff',
            // },
            formatter: (params) => {
              return `{a${params.value.type}|}\n\n\n${params.name}`
            },
            rich: {
              a0: {
                color: '#fff',
                padding: [4, 5],
                backgroundColor: 'rgba(255, 86, 76, .45)'
              }
            }
          }
        }
      ],
      links: [
        { source: 0, target: 1, value: '' },
        { source: 0, target: 2, value: '' },
        { source: 1, target: 3, value: '' },
        { source: 3, target: 4, value: '' },
        { source: 2, target: 5, value: '' },
        { source: 2, target: 6, value: '' },
        { source: 5, target: 7, value: '' },
        { source: 6, target: 8, value: '' },
        { source: 6, target: 9, value: '' },
        { source: 6, target: 10, value: '' }
      ],
      lineStyle: {
        opacity: 0.9,
        width: 1,
        curveness: 0,
        color: '#fff'
      }
    }
  }
})
onMounted(() => {
  state.myEcharts = echarts.init(document.getElementById('blueRadar'))
  initEcharts()
  emitter.on('changeBlueState', (val) => {
    state.redAndBlueRadarOption.series.data.forEach((element) => {
      if (element.name == val) {
        const hapMap = {
          空中指挥: symbol2r,
          地面指挥: symbol2r,
          地面预警: symbol2r,
          飞行中队: symbol2r,
          地面预警1: symbol2r,
          地面预警2: symbol2r,
          蓝方战斗机: symbol4r,
          预警雷达: symbol3r,
          追踪雷达1: symbol3r,
          追踪雷达2: symbol3r,
          导弹车: symbol1r
        }
        const hapMap1 = {
          空中指挥: symbol2,
          地面指挥: symbol2,
          地面预警: symbol2,
          飞行中队: symbol2,
          地面预警1: symbol2,
          地面预警2: symbol2,
          蓝方战斗机: symbol4,
          预警雷达: symbol3,
          追踪雷达1: symbol3,
          追踪雷达2: symbol3,
          导弹车: symbol1
        }
        element.symbol = 'image://' + hapMap[val]
        initEcharts()
        // setTimeout(() => {
        //   element.symbol = 'image://' + hapMap1[val]
        //   initEcharts()
        // }, 2000);
      }
    })
  })
  setTimeout(() => {
    state.redAndBlueRadarOption.series.data[1].symbol = 'image://' + symbol3
    // initEcharts()
    // setTimeout(() => {
    //   state.redAndBlueRadarOption.series.data[1].symbol = 'image://'+ symbol2
    //   initEcharts()
    // }, 2000);
  }, 10000)
})
const initEcharts = () => {
  state.myEcharts.setOption(state.redAndBlueRadarOption)
  window.addEventListener('resize', function () {
    state.myEcharts.resize()
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('blueRadar'), function () {
    nextTick(() => {
      state.myEcharts.resize()
    })
  })
}
</script>

<style lang="less" scoped>
.blueRadar {
  // width: 100%;
  // height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #3c94d9;

  .pie-echart {
    width: 15vw;
    height: calc(44vh - 70px);
  }
}
</style>
