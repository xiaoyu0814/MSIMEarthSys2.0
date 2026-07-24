<template>
  <div ref="echartBl" class="echart-bl" id="echartBl"></div>
</template>

<script setup>
import * as echarts from 'echarts'
import { useStore } from 'vuex'
import {
  reactive,
  onMounted,
  getCurrentInstance,
  ref,
  watch,
  nextTick,
  onUnmounted
} from 'vue'
import iconImg from '@/assets/images/indicator/typeIcon.png'
import FJ1 from '@/assets/images/indicator/plane5.png'
import FJ2 from '@/assets/images/indicator/plane2.png'
import FJ6 from '@/assets/images/indicator/qianting6.png'
import QT1 from '@/assets/images/indicator/qianting5.png'
import QT2 from '@/assets/images/indicator/qianting4.png'
import QT3 from '@/assets/images/indicator/qianting1.png'
import JQ1 from '@/assets/images/indicator/ship3.png'
import JQ2 from '@/assets/images/indicator/ship1.png'
const store = useStore()

const vueData = reactive({
  dimensions: [],
  source: []
})
const state = reactive({
  nodes: [
    {
      id: 1,
      name: 'QT',
      draggable: false, // 节点是否可拖拽，只在使用力引导布局的时候有用。
      itemStyle: {
        color: '#F65D48'
      },
      category: '1', // 数据项所在类目的 index。
      type: QT3
    },
    {
      id: 2,
      name: 'FJ',
      draggable: false,
      itemStyle: {
        color: '#5998FF'
      },
      category: '2',
      type: FJ2,
      isCheck: true
    },
    {
      id: 21,
      name: '',
      draggable: false,
      category: '2'
    },
    {
      id: 22,
      name: '',
      draggable: false,
      category: '2'
    },
    {
      id: 23,
      name: '',
      draggable: false,
      category: '2'
    },
    {
      id: 24,
      name: '',
      draggable: false,
      category: '2'
    },
    {
      id: 3,
      name: 'QT',
      draggable: false,
      itemStyle: {
        color: '#FF76F1'
      },
      category: '3',
      type: QT2,
      isCheck: true
    },
    {
      id: 31,
      name: '',
      draggable: false,
      category: '3'
    },
    {
      id: 32,
      name: '',
      draggable: false,
      category: '3'
    },
    {
      id: 33,
      name: '',
      draggable: false,
      category: '3'
    },
    {
      id: 34,
      name: '',
      draggable: false,
      category: '3'
    },
    {
      id: 4,
      name: 'FJ',
      draggable: false,
      itemStyle: {
        color: '#5998FF'
      },
      category: '4',
      type: FJ1,
      isCheck: true
    },
    {
      id: 41,
      name: '',
      draggable: false,
      category: '4'
    },
    {
      id: 42,
      name: '',
      draggable: false,
      category: '4'
    },
    {
      id: 43,
      name: '',
      draggable: false,
      category: '4'
    },
    {
      id: 44,
      name: '',
      draggable: false,
      category: '4'
    },
    {
      id: 5,
      name: 'QT',
      draggable: false,
      itemStyle: {
        color: '#FF76F1'
      },
      category: '5',
      type: QT1,
      isCheck: true
    },
    {
      id: 51,
      name: '',
      draggable: false,
      category: '5'
    },
    {
      id: 52,
      name: '',
      draggable: false,
      category: '5'
    },
    {
      id: 53,
      name: '',
      draggable: false,
      category: '5'
    },
    {
      id: 54,
      name: '',
      draggable: false,
      category: '5'
    },
    {
      id: 6,
      name: 'FJ',
      draggable: false,
      itemStyle: {
        color: '#58E0EA'
      },
      category: '6',
      type: FJ6,
      isCheck: true
    },
    {
      id: 61,
      name: '',
      draggable: false,
      category: '6'
    },
    {
      id: 62,
      name: '',
      draggable: false,
      category: '6'
    },
    {
      id: 63,
      name: '',
      draggable: false,
      category: '6'
    },
    {
      id: 64,
      name: '',
      draggable: false,
      category: '6'
    },
    {
      id: 7,
      name: 'JQ',
      draggable: false,
      itemStyle: {
        color: '#4DD68F'
      },
      category: '7',
      type: JQ1,
      isCheck: true
    },
    {
      id: 71,
      name: '',
      draggable: false,
      category: '7'
    },
    {
      id: 72,
      name: '',
      draggable: false,
      category: '7'
    },
    {
      id: 73,
      name: '',
      draggable: false,
      category: '7'
    },
    {
      id: 74,
      name: '',
      draggable: false,
      category: '7'
    }
  ],
  categories: [
    {
      name: '1'
    },
    {
      name: '2'
    },
    {
      name: '3'
    },
    {
      name: '4'
    },
    {
      name: '5'
    },
    {
      name: '6'
    },
    {
      name: '7'
    },
    {
      name: '8'
    }
  ],
  links: [
    {
      source: '1',
      target: '2',
      category: '1'
    },
    {
      source: '2',
      target: '21',
      category: '2'
    },
    {
      source: '2',
      target: '22',
      category: '2'
    },
    {
      source: '2',
      target: '23',
      category: '2'
    },
    {
      source: '2',
      target: '24',
      category: '2'
    },
    {
      source: '1',
      target: '3',
      category: '1'
    },
    {
      source: '3',
      target: '31',
      category: '3'
    },
    {
      source: '3',
      target: '32',
      category: '3'
    },
    {
      source: '3',
      target: '33',
      category: '3'
    },
    {
      source: '3',
      target: '34',
      category: '3'
    },
    {
      source: '1',
      target: '4',
      category: '1'
    },
    {
      source: '4',
      target: '41',
      category: '4'
    },
    {
      source: '4',
      target: '42',
      category: '4'
    },
    {
      source: '4',
      target: '43',
      category: '4'
    },
    {
      source: '4',
      target: '44',
      category: '4'
    },
    {
      source: '1',
      target: '5',
      category: '1'
    },
    {
      source: '5',
      target: '51',
      category: '5'
    },
    {
      source: '5',
      target: '52',
      category: '5'
    },
    {
      source: '5',
      target: '53',
      category: '5'
    },
    {
      source: '5',
      target: '54',
      category: '5'
    },
    {
      source: '1',
      target: '6',
      category: '1'
    },
    {
      source: '6',
      target: '61',
      category: '6'
    },
    {
      source: '6',
      target: '62',
      category: '6'
    },
    {
      source: '6',
      target: '63',
      category: '6'
    },
    {
      source: '6',
      target: '64',
      category: '6'
    },
    {
      source: '1',
      target: '7',
      category: '1'
    },
    {
      source: '7',
      target: '71',
      category: '7'
    },
    {
      source: '7',
      target: '72',
      category: '7'
    },
    {
      source: '7',
      target: '73',
      category: '7'
    },
    {
      source: '7',
      target: '74',
      category: '7'
    }
  ],
  category2: [
    {
      id: 21,
      name: '',
      draggable: false,
      category: '2',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    },
    {
      id: 22,
      name: '',
      draggable: false,
      category: '2',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    },
    {
      id: 23,
      name: '',
      draggable: false,
      category: '2',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    },
    {
      id: 24,
      name: '',
      draggable: false,
      category: '2',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    }
  ],
  category3: [
    {
      id: 31,
      name: '',
      draggable: false,
      category: '3',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    },
    {
      id: 32,
      name: '',
      draggable: false,
      category: '3',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    },
    {
      id: 33,
      name: '',
      draggable: false,
      category: '3',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    },
    {
      id: 34,
      name: '',
      draggable: false,
      category: '3',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    }
  ],
  category4: [
    {
      id: 41,
      name: '',
      draggable: false,
      category: '4',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    },
    {
      id: 42,
      name: '',
      draggable: false,
      category: '4',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    },
    {
      id: 43,
      name: '',
      draggable: false,
      category: '4',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    },
    {
      id: 44,
      name: '',
      draggable: false,
      category: '4',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    }
  ],
  category5: [
    {
      id: 51,
      name: '',
      draggable: false,
      category: '5',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    },
    {
      id: 52,
      name: '',
      draggable: false,
      category: '5',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    },
    {
      id: 53,
      name: '',
      draggable: false,
      category: '5',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    },
    {
      id: 54,
      name: '',
      draggable: false,
      category: '5',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    }
  ],
  category6: [
    {
      id: 61,
      name: '',
      draggable: false,
      category: '6',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    },
    {
      id: 62,
      name: '',
      draggable: false,
      category: '6',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    },
    {
      id: 63,
      name: '',
      draggable: false,
      category: '6',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    },
    {
      id: 64,
      name: '',
      draggable: false,
      category: '6',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    }
  ],
  category7: [
    {
      id: 71,
      name: '',
      draggable: false,
      category: '7',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    },
    {
      id: 72,
      name: '',
      draggable: false,
      category: '7',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    },
    {
      id: 73,
      name: '',
      draggable: false,
      category: '7',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    },
    {
      id: 74,
      name: '',
      draggable: false,
      category: '7',
      symbol: '@/assets/images/indicator/typeIcon.png',
      symbolSize: 40
    }
  ]
})

const getEcharts = () => {
  let option = {
    series: [
      {
        zoom: '',
        type: 'graph',
        roam: true,
        force: {
          repulsion: 50,
          edgeLength: [80, 50]
        },
        layout: 'force',
        lineStyle: {
          normal: {
            color: 'source',
            width: 2,
            type: 'dashed',
            opacity: 1,
            curveness: 0.3
          }
        },
        label: {
          normal: {
            show: true,
            position: 'top',
            textStyle: {
              fontSize: 16,
              color: '#A6FFB8'
            }
          }
        },
        edgeSymbol: ['circle', 'circle'],
        edgeSymbolSize: [0, 0],
        data: state.nodes,
        categories: state.categories,
        links: state.links
      }
    ]
  }

  let myChart = echarts.init(document.getElementById('echartBl'))
  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}
onMounted(() => {
  nextTick(() => {
    getEcharts()
  })
})
</script>
<style lang="less" scoped>
.LeftBottom-title {
  width: 100%;
  display: flex;
  justify-content: space-between;
  height: 36px;
  font-size: 14px;
  font-family: MicrosoftYaHei-Bold, MicrosoftYaHei;
  font-weight: bold;
  color: #ffffff;
  line-height: 28px;
  padding: 0 10px;
  text-shadow: 0px 1px 6px #0bbbff;
  vertical-align: middle;
  background: url(@/assets/images/indicator/group_25.png);
  background-size: cover;
  background-repeat: no-repeat;

  .blowUp {
    height: 14px;
    width: 14px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    line-height: 28px;
    margin-top: 8px;
  }
}

.echart-bl {
  width: 100%;
  // height: calc(100% - 36px);
  height: 100%;
  // height: 240px;
  // background: #1a3d5470;
}

.dialog {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(0, 0, 0, 0.5);
  z-index: 99;

  .bigger-icon {
    position: relative;
    top: 11vh;
    left: 86vw;
    z-index: 101;

    img {
      margin-left: 10px;
      width: 25px;
      cursor: pointer;

      &:nth-child(1) {
        width: 18px;
      }
    }
  }

  .bigGantt {
    padding-right: 20px;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 80vw;
    height: 80vh;
    background-color: rgba(27, 56, 76);
    z-index: 100;
  }

  .icon {
    position: relative;
    top: 1vh;
    left: 98vw;
    background: rgba(27, 56, 76);
    z-index: 101;

    img {
      cursor: pointer;
      width: 25px;
    }
  }

  .fullGantt {
    padding-right: 20px;
    position: absolute;
    top: 0;
    width: 100vw;
    height: 100vh;
    background-color: rgba(27, 56, 76);
    z-index: 100;
  }
}
</style>
