<template>
  <!-- echarts版本电网知识图谱 -->
  <div class="knowledgeGraph">
    <div :id="chartId" class="charts-main"></div>
  </div>
</template>

<script>
import * as echarts from 'echarts'
import { nextTick, onMounted, onUnmounted, reactive, markRaw } from 'vue'

export default {
  props: {
    chartId: {
      type: String,
      default: 'chart11'
    },
    option: {
      type: Object,
      default: {}
    }
  },
  setup() {
    const state = reactive({
      knowledgeGraphOption: {
        backgroundColor: 'rgba(0,0,0,0.3)',
        tooltip: {
          confine: true
        },
        legend: {
          x: 'left',
          y: 10,
          show: true,
          data: [
            '电力系统',
            '发电厂',
            '变电所',
            '输电线'
            // '火电',
            // '水电',
            // '核电',
            // '风电',
            // '太阳能',
            // '一次变电所',
            // '超高压变电所',
            // '一次输电线161KV',
            // '超高压输电线345KV'
          ],
          textStyle: {
            color: 'inherit' //字体颜色
          }
        },
        animationDuration: 3000,
        animationEasingUpdate: 'quinticInOut',
        grid: {
          top: 300,
          bottom: 0
        },
        series: [
          {
            type: 'graph',
            layout: 'force',
            scaleLimit: {
              min: 0.5
            },
            symbolSize: 45,
            emphasis: {
              focus: 'adjacency'
            },
            roam: true,
            legendHoverLink: true,
            categories: [
              {
                name: '电力系统'
              },
              {
                name: '发电厂'
              },
              {
                name: '变电所'
              },
              {
                name: '输电线'
              }
            ],
            label: {
              show: true,
              position: 'top',
              fontSize: 12
            },
            force: {
              repulsion: 150
            },
            label: {
              show: true,
              color: 'inherit'
            },
            nodeStyle: {
              brushType: 'both',
              borderColor: '#fff',
              borderWidth: 1
            },
            edgeSymbolSize: [4, 10],
            edgeLabel: {
              show: false
            },
            data: [
              {
                id: '1',
                name: '发电厂',
                symbolSize: 8,
                // x: -459.1107,
                // y: -362.5133,
                value: 4,
                category: 1
              },
              {
                id: '2',
                name: '变电所',
                symbolSize: 8,
                // x: -459.1107,
                // y: -362.5133,
                value: 4,
                category: 2
              },
              {
                id: '3',
                name: '输电线',
                symbolSize: 8,
                // x: -459.1107,
                // y: -362.5133,
                value: 4,
                category: 3
              },
              {
                id: '4',
                name: '电力系统',
                symbolSize: 50,
                // x: -200.93029,
                // y: -60.8120565,
                value: 50,
                category: 0
              },
              {
                id: '15',
                name: '火电',
                symbolSize: 8,
                // x: -127.701546,
                // y: 242.55057,
                value: 4,
                category: 1
              },
              {
                id: '16',
                name: '风电',
                symbolSize: 10,
                // x: -379.30386,
                // y: 429.06424,
                value: 20.457146,
                category: 1
              },
              {
                id: '17',
                name: '水电',
                symbolSize: 21,
                // x: 313.42786,
                // y: 289.44803,
                value: 42.4,
                category: 1
              },
              {
                id: '18',
                name: '核电',
                symbolSize: 15,
                // x: 4.6313396,
                // y: -273.8517,
                value: 31.428574,
                category: 1
              },
              {
                id: '19',
                name: '太阳能',
                symbolSize: 15,
                // x: 78.64646,
                // y: -31.512747,
                value: 31.428574,
                category: 1
              },

              {
                id: '20',
                name: '一次变电所',
                symbolSize: 11,
                // x: -385.6842,
                // y: -20.206686,
                value: 23.2,
                category: 2
              },
              {
                id: '21',
                name: '超高压变电所',
                symbolSize: 15,
                // x: 78.64646,
                // y: -31.512747,
                value: 31.428574,
                category: 2
              },
              {
                id: '22',
                name: '一次输电线161KV',
                symbolSize: 15,
                // x: 78.64646,
                // y: -31.512747,
                value: 31.428574,
                category: 3
              },
              {
                id: '23',
                name: '超高压输电线345KV',
                symbolSize: 15,
                // x: 78.64646,
                // y: -31.512747,
                value: 31.428574,
                category: 3
              }
            ],
            links: [
              {
                source: '1',
                target: '4'
              },
              {
                source: '2',
                target: '4'
              },
              {
                source: '3',
                target: '4'
              },
              {
                source: '15',
                target: '1'
              },
              {
                source: '16',
                target: '1'
              },
              {
                source: '17',
                target: '1'
              },
              {
                source: '18',
                target: '1'
              },
              {
                source: '19',
                target: '1'
              },
              {
                source: '20',
                target: '2'
              },
              {
                source: '21',
                target: '2'
              },
              {
                source: '22',
                target: '3'
              },
              {
                source: '23',
                target: '3'
              }
            ],
            lineStyle: {
              opacity: 0.9,
              width: 1,
              curveness: 0
            }
          }
        ]
      },
      myChart: null
    })
    onMounted(() => {
      if (
        state.myChart != null &&
        state.myChart != '' &&
        state.myChart != undefined
      ) {
        state.myChart.dispose() //销毁
      }
      nextTick(() => {
        initCharts()
      })
    })
    onUnmounted(() => {
      if (
        state.myChart != null &&
        state.myChart != '' &&
        state.myChart != undefined
      ) {
        state.myChart.dispose() //销毁
      }
    })
    const initCharts = () => {
      let elementResizeDetectorMaker = require('element-resize-detector')
      let erd = elementResizeDetectorMaker()
      const chartDom = document.getElementById('powerGridKnowledgeGraph')
      echarts.dispose(chartDom)
      chartDom.style.width = '100%'
      chartDom.style.height = '100%'
      chartDom.style.auto = 'auto'
      state.myChart = markRaw(echarts.init(chartDom))
      state.myChart.on('click', function (param) {
        if (param.dataType == 'node') {
          // param.data.name
        }
      })
      state.knowledgeGraphOption &&
        state.myChart.setOption(state.knowledgeGraphOption, true)
      setTimeout(() => {
        state.myChart.resize()
      })
      erd.listenTo(
        document.getElementById('powerGridKnowledgeGraph'),
        function (element) {
          nextTick(function () {
            //使echarts尺寸重置
            state.myChart.resize()
          })
        }
      )
    }
    return {}
  }
}
</script>

<style lang="less" scoped>
.knowledgeGraph {
  width: 100%;
  height: 33%;
  background-color: rgba(8, 36, 41, 0.7);
  border-radius: 10px;
  overflow: hidden;

  .charts-container {
    width: 100%;
    height: 100%;
    box-sizing: border-box;
    border: 1.5px solid;
    border-image: linear-gradient(
        270deg,
        rgba(255, 255, 255, 1),
        rgba(255, 255, 255, 0.4)
      )
      1 1;

    .charts-title {
      height: 40px;
      width: 100%;
      background: url('@/assets/image/header/头.png');
      background-size: 100% 100%;
      text-align: left;
      color: white;
      font-size: 23px;
      font-weight: 500;

      .title-span {
        display: flex;
        align-items: center;
        height: 100%;
        margin: auto 20px;
        font-family: PangMenZhengDao;
        // padding: 8px 15px;
      }
    }

    .charts-main {
      margin: 20px;
      height: calc(100% - 80px) !important;
      width: calc(100% - 40px) !important;
      border: 1px solid rgba(0, 0, 0, 0.3);
      border-radius: 10px;
      overflow: hidden;
    }
  }
}
</style>
