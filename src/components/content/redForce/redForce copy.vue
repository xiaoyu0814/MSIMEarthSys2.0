<template>
  <!-- 初始 -->
  <div class="redRadar">
    <div class="pie-echart" id="redRadar"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import elementResizeDetectorMaker from 'element-resize-detector'
import { onMounted, reactive, nextTick } from 'vue'
import emitter from '@/utils/eventbus'

const symbol1 = require('@/assets/image/leftForceChart/hong1.png')
const symbol1r = require('@/assets/image/leftForceChart/hong1r.png')
const symbol2 = require('@/assets/image/leftForceChart/hong2.png')
const symbol2r = require('@/assets/image/leftForceChart/hong2r.png')
const symbol3 = require('@/assets/image/leftForceChart/hong3.png')
const symbol3r = require('@/assets/image/leftForceChart/hong3r.png')

const state = reactive({
  myEcharts: null,
  redAndBlueRadarOption: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    tooltip: {
      trigger: 'item',
      textStyle: { fontSize: '100%' },
      show: false
      // backgroundColor: 'none',
    },
    grid: {
      right: '80%'
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
          name: '红方',
          value: { num: 55, type: 0 },
          draggable: true,
          x: -80,
          y: 50,
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
            color: '#f53730',
            opacity: 0.9 //设置透明度，为0时不绘制
            // }
          }
        },
        {
          name: '航母编队',
          value: { num: 55, type: 1 },
          category: 1,
          draggable: true,
          x: -50,
          y: 20,
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
        },
        {
          name: '无人机',
          value: { num: 55, type: 2 },
          category: 1,
          draggable: true,
          x: -50,
          y: 60,
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
          name: '无线电干扰机',
          value: { num: 55, type: 1 },
          category: 1,
          draggable: true,
          x: -10,
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
          name: '护航机',
          value: { num: 55, type: 2 },
          category: 1,
          draggable: true,
          x: -10,
          y: 30,
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
          name: '战斗机',
          value: { num: 55, type: 3 },
          category: 1,
          draggable: true,
          x: -10,
          y: 50,
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
        }
      ],
      links: [
        { source: 0, target: 1, value: '' },
        { source: 0, target: 2, value: '' },
        { source: 1, target: 3, value: '' },
        { source: 1, target: 4, value: '' },
        { source: 1, target: 5, value: '' }
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
  state.myEcharts = echarts.init(document.getElementById('redRadar'))
  initEcharts()
  emitter.on('changeRedState', (val) => {
    state.redAndBlueRadarOption.series.data.forEach((element) => {
      if (element.name == val) {
        const hapMap = {
          航母编队: symbol1r,
          无人机: symbol3r,
          无线电干扰机: symbol2r,
          护航机: symbol2r,
          战斗机: symbol2r
        }
        const hapMap1 = {
          航母编队: symbol1,
          无人机: symbol3,
          无线电干扰机: symbol2,
          护航机: symbol2,
          战斗机: symbol2
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
})
const initEcharts = () => {
  state.myEcharts.setOption(state.redAndBlueRadarOption)
  window.addEventListener('resize', function () {
    state.myEcharts.resize()
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('redRadar'), function () {
    nextTick(() => {
      state.myEcharts.resize()
    })
  })
}
</script>

<style lang="less" scoped>
.redRadar {
  // width: 100%;
  // height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #f53730;

  .pie-echart {
    width: 15vw;
    height: calc(44vh - 80px);
  }
}
</style>
