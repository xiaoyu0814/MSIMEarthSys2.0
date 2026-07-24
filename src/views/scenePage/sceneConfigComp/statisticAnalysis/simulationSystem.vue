<template>
  <div class="simulation-system">
    <div class="system-item">
      <div class="info boxdiv">
        <div class="info-title">
          <p>服务器状态</p>
        </div>

        <div class="info-content">
          <div class="left">
            <div class="server" v-for="item in state.serverList" :key="item">
              <img :src="item.img" />
              <div class="quantity">
                <div class="num" :style="{ color: item.color }">
                  {{ item.num1 }}
                </div>
                <div class="text">{{ item.text1 }}</div>
              </div>
              <div class="quantity">
                <div class="num" :style="{ color: item.color }">
                  {{ item.num2 }}
                </div>
                <div class="text">{{ item.text2 }}</div>
              </div>
            </div>
          </div>

          <div class="progress">
            <div
              class="single-progress"
              v-for="(item, index) in state.exportData"
              :key="index"
            >
              <div class="top">
                <div class="rank">
                  <p>{{ item.rank }}</p>
                </div>
                <!-- <div class="name">{{ item.name }}</div> -->
                <div class="num">
                  <p>{{ item.percentage }}%</p>
                </div>
              </div>
              <el-progress
                :percentage="item.percentage"
                :color="item.color"
                :show-text="false"
              ></el-progress>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="system-item">
      <div class="info boxdiv">
        <div class="info-title">
          <p>磁盘使用率</p>
        </div>
        <div class="info-content">
          <div id="cpsyl" class="echart-style"></div>
        </div>
      </div>
    </div>
    <div class="system-item">
      <div class="info boxdiv">
        <div class="info-title">
          <p>测站统计</p>
        </div>
        <div class="info-content">
          <div id="option2021" class="echart-style"></div>
        </div>
      </div>
    </div>
    <div class="system-item">
      <div class="info boxdiv">
        <div class="info-title">
          <p>CPU统计</p>
        </div>
        <div class="info-content">
          <div id="option2022" class="echart-style"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, nextTick, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import elementResizeDetectorMaker from 'element-resize-detector'

const state = reactive({
  serverList: [
    {
      img: require('@/assets/image/middleware/cpuicon@2x.png'),
      color: '#19CD83',
      num1: 1,
      text1: 'CPU核数',
      num2: '12%',
      text2: 'CPU使用率'
    },
    {
      img: require('@/assets/image/middleware/内存icon@2x.png'),
      color: '#35B1FD',
      num1: '3.68G',
      text1: '内存总量',
      num2: '12%',
      text2: '内存使用率'
    },
    {
      img: require('@/assets/image/middleware/磁盘icon@2x.png'),
      color: '#F59F49',
      num1: 1,
      text1: '磁盘总量',
      num2: '12%',
      text2: '磁盘使用率'
    }
  ], //服务器状态list
  exportData: [
    {
      rank: '总CPU使用率',
      name: '磁盘1',
      color: '#f56c6c',
      percentage: 12
    },
    { rank: '内存使用率', name: '磁盘2', color: '#e6a23c', percentage: 30 },
    { rank: '磁盘使用率', name: '磁盘3', color: '#5cb87a', percentage: 60 }
  ],
  myChart1: null,
  myChart2: null,
  myChart3: null,
  chartOption1: {
    series: [
      {
        type: 'gauge',
        startAngle: 90,
        endAngle: -270,
        radius: '99%',
        pointer: {
          show: false
        },
        progress: {
          show: true,
          overlap: false,
          roundCap: true,
          clip: false,
          itemStyle: {
            borderWidth: 0,
            borderColor: '#464646'
          }
        },
        axisLine: {
          show: false,
          lineStyle: {
            width: 30
          }
        },
        splitLine: {
          show: false,
          distance: 10,
          length: 10
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false,
          distance: 50
        },
        data: [
          {
            value: 20,
            name: '磁盘1',
            title: {
              offsetCenter: ['0%', '-55%']
            },
            detail: {
              valueAnimation: true,
              offsetCenter: ['0%', '-35%']
            }
          },
          {
            value: 40,
            name: '磁盘2',
            title: {
              offsetCenter: ['0%', '-10%']
            },
            detail: {
              valueAnimation: true,
              offsetCenter: ['0%', '10%']
            }
          },
          {
            value: 90,
            name: '磁盘3',
            title: {
              offsetCenter: ['0%', '35%']
            },
            detail: {
              valueAnimation: true,
              offsetCenter: ['0%', '55%']
            }
          }
        ],
        title: {
          show: true,
          fontSize: 14,
          color: '#ffffff'
        },
        anchor: {
          show: true,
          showAbove: false,
          size: 0
        },
        detail: {
          width: 40,
          height: 10,
          fontSize: 10,
          color: 'inherit',
          borderColor: 'inherit',
          borderRadius: 20,
          borderWidth: 1,
          formatter: '{value}'
        }
      }
    ]
  },
  chartOption2: {
    tooltip: {
      trigger: 'axis'
    },
    radar: [
      {
        indicator: [
          { text: '可用测站', max: 100 },
          { text: '测站', max: 100 },
          { text: '不可用测站', max: 100 },
          { text: '即将出站', max: 100 }
        ],
        // center: ['25%', '40%'],
        radius: 80
      }
    ],
    series: [
      {
        type: 'radar',
        tooltip: {
          trigger: 'item'
        },
        areaStyle: {},
        data: [
          {
            value: [60, 73, 85, 40],
            name: '测站统计'
          }
        ]
      }
    ]
  },
  chartOption3: {
    animationDuration: 3000,
    grid: {
      top: '30px',
      left: '5%',
      right: '5%',
      // bottom: "3%",
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      position: 'left'
    },
    legend: {
      top: '1%',
      left: '10%',
      itemWidth: 10, // 设置宽度
      itemHeight: 10, // 设置高度
      data: ['今年'],
      textStyle: {
        fontSize: 12, //字体大小
        color: '#fff' //字体颜色（图例与图例文字配色保持一致）
      }
    },
    color: ['#0078D1'],
    radar: {
      center: ['50%', '50%'],
      radius: '70%',
      nameGap: 5, // 图中工艺等字距离图的距离
      name: {
        // (圆外的标签)雷达图每个指示器名称的配置项。
        // formatter: "{value}+{d}",
        textStyle: {
          fontSize: 12,
          color: '#fff'
        }
      },
      shape: 'polygon',
      indicator: [
        { name: 'CPU-1', max: 8 },
        { name: 'CPU-2', max: 8 },
        { name: 'CPU-3', max: 25 },
        { name: 'CPU-4', max: 8 },
        { name: 'CPU-5', max: 8 }
      ],
      splitArea: {
        areaStyle: {
          color: ['rgba(0, 0, 0, 0.2)'],
          shadowColor: 'rgba(0, 0, 0, 0.2)',
          shadowBlur: 10
        }
      },
      axisLine: {
        lineStyle: {
          color: '#0078D1'
        }
      },
      splitLine: {
        lineStyle: {
          color: '#0078D1'
        }
      }
    },
    series: [
      {
        name: 'Budget vs spending',
        type: 'radar',
        symbol: 'none',
        tooltip: {
          trigger: 'item'
        },
        // 单个数据标记的图形。
        // symbolSize: 3,
        data: [
          {
            value: [2.466, 2.195, 23.5, 5.3, 2.9],
            name: 'CPU使用率'
          }
        ],
        areaStyle: {
          color: '#2AD0FF'
        }
      }
    ]
  }
})
const initChart1 = () => {
  if (state.myChart1 == null) {
    state.myChart1 = echarts.init(document.getElementById('cpsyl'))
  }
  state.myChart1.setOption(state.chartOption1)
  window.addEventListener('resize', function () {
    state.myChart1.resize()
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('cpsyl'), function () {
    nextTick(() => {
      state.myChart1.resize()
    })
  })
}
const initChart2 = () => {
  if (state.myChart2 == null) {
    state.myChart2 = echarts.init(document.getElementById('option2021'))
  }
  state.myChart2.setOption(state.chartOption2)
  window.addEventListener('resize', function () {
    state.myChart2.resize()
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('option2021'), function () {
    nextTick(() => {
      state.myChart2.resize()
    })
  })
}
const initChart3 = () => {
  if (state.myChart3 == null) {
    state.myChart3 = echarts.init(document.getElementById('option2022'))
  }
  state.myChart3.setOption(state.chartOption3)
  window.addEventListener('resize', function () {
    state.myChart3.resize()
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('option2022'), function () {
    nextTick(() => {
      state.myChart3.resize()
    })
  })
}
onMounted(() => {
  initChart1()
  initChart2()
  initChart3()
})
onUnmounted(() => {
  state.myChart1.dispose()
  state.myChart2.dispose()
  state.myChart3.dispose()
})
</script>

<style lang="less" scoped>
.simulation-system {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  box-sizing: border-box;
  .system-item {
    width: 50%;
    height: 50%;

    .info {
      // margin-right: 20px;
      padding: 10px;
      box-sizing: border-box;
      width: 100%;
      height: 100%;

      .info-title {
        color: #fff;
        // margin-bottom: 10px;
        width: 50%;
        // height: 10px;
        background-image: url('@/assets/image/sysMonitor/titlebg.png');
        background-size: 100% 50%;
        background-position: bottom;
        background-repeat: no-repeat;

        p {
          // position: relative;
          text-align: left;
          // margin-left: 10px;
          font-size: 16px;
          margin: 0 10px;
          // left: 18px;
          // top: -20px;
        }
      }

      .info-content {
        height: calc(100% - 21px);
        display: flex;
        overflow-x: auto;

        .left {
          width: 60%;
          display: flex;
          flex-direction: column;
          justify-content: space-around;

          .server {
            width: 100%;
            display: flex;
            justify-content: space-around;
            color: #fff;

            img {
              height: 40px;
            }

            .quantity {
              display: flex;
              flex-direction: column;

              .num {
                font-size: 25px;
              }
            }
          }
        }

        .progress {
          height: 100%;
          width: 40%;
          // padding-top: 50px;
          margin-left: 10px;
          display: flex;
          flex-direction: column;
          justify-content: space-around;
          color: #fff;

          .single-progress {
            margin-bottom: 20px;
            display: flex;
            flex-direction: column;

            .top {
              display: flex;

              // justify-content: space-between;
              .rank {
                // color: aqua;
                width: 240px;
                margin-right: 10px;
                font-size: 14px;
                text-align: left;
              }

              .name {
                width: 180px;
              }

              .num {
                // width: 100%;
                text-align: right;
              }
            }
          }
        }

        .echart-style {
          width: 100%;
          height: 100%;
        }

        #cpsyl,
        #option2021,
        #option2022 {
          width: 100%;
          height: 100%;
        }
      }
    }
  }
}
</style>
