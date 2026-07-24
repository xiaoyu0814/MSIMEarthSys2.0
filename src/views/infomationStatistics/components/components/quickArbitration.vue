<template>
  <div class="logSteps-container">
    <div
      style="
        height: 54px;
        line-height: 54px;
        font-size: 1vw;
        text-align: center;
        color: #00ffff;
        text-shadow: 0 0 5px #00ffff;
      "
    >
      行动时序图
    </div>
    <div id="statusEcharts"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import elementResizeDetectorMaker from 'element-resize-detector'
import { nextTick, onMounted, reactive, markRaw, watch, toRaw } from 'vue'
import store from '@/store'

const emit = defineEmits()

const hashMap = [
  '#75d0e4',
  '#bd6d6c',
  '#e0bc78',
  '#7b9ce1',
  '#75d878',
  '#0f6f6f',
  '#f0bc78'
]

const state = reactive({
  myEcharts: null,
  stageDescriptionOption: {},
  lastInfo: {
    // 场景载入: 'false',
    // "前出接敌": 'false',
    探测发现: 'false',
    干扰对抗: 'false',
    目标锁定: 'false',
    // "目标分配": 'false',
    瞄准打击: 'false'
  },
  startTime: {
    // 场景载入: null,
    // "前出接敌": null,
    探测发现: null,
    干扰对抗: null,
    目标锁定: null,
    // "目标分配": null,
    瞄准打击: null
    // "毁伤评估": null,
  },
  logData: {},
  currentTime: null
})

onMounted(() => {
  // var baseDate = `${new Date().getFullYear()}/${new Date().getMonth() + 1
  //   }/${new Date().getDate()}`;
  setInterval(() => {
    let d = new Date()
    let year = d.getFullYear()
    let month =
      d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
    let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
    let hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
    let minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
    let second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
    state.currentTime =
      year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  }, 1000)
  state.stageDescriptionOption = makeOption()
  initEcharts()
})

const initEcharts = () => {
  state.myEcharts = markRaw(
    echarts.init(document.getElementById('statusEcharts'))
  )
  let echartsData = toRaw(state.stageDescriptionOption)
  state.myEcharts.setOption(echartsData)
  let nOption = state.myEcharts.getOption()
  emit('JCFXData', nOption)
  window.addEventListener('resize', function () {
    state.myEcharts.resize()
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('statusEcharts'), function () {
    nextTick(() => {
      state.myEcharts.resize()
    })
  })
}

const makeOption = () => {
  return {
    color: '#0A8BFF',
    // backgroundColor: 'rgba(2, 26, 70, 0.88)',
    // title: {
    //   text: "工时统计甘特图",
    //   subtext: "不同日期的当日工时统计",
    // },
    tooltip: {
      enterable: true,
      //alwaysShowContent:true,
      hideDelay: 100,
      backgroundColor: 'rgba(255,255,255,1)', //背景颜色（此时为默认色）
      borderRadius: 5, //边框圆角
      padding: [5, 0, 5, 0], // [5, 10, 15, 20] 内边距
      color: '#000',
      position: function (point, params, dom, rect, size) {
        if (params.name && params.name.indexOf(',') > -1) {
          dom.innerHTML =
            '<div style="font-size:14px;color:rgba(0,0,0,0.65)" class="tip"><h1 style="font-size:14px;color:rgba(0,0,0,0.85);height:25px;display:flex;align-items: center;padding:0 0 5px 8px;margin:0;border-bottom:1px solid rgba(0,0,0,0.06);font-weight:bold">' +
            params.name.split(',')[0] +
            '</h1> <p style="margin:0;padding:0 8px 0 8px;height:25px;display:flex;align-items: center;">时段:' +
            params.value[1].split(' ')[1] +
            '~' +
            params.value[2].split(' ')[1] +
            ' </p></div>'
        }
      }
    },
    legend: {
      //图例
      data: [
        // '场景载入',
        // "前出接敌",
        { name: '探测发现', icon: 'roundRect' },
        { name: '干扰对抗', icon: 'roundRect' },
        { name: '目标锁定', icon: 'roundRect' },
        { name: '瞄准打击', icon: 'roundRect' }
        // '探测发现',
        // '干扰对抗',
        // '目标锁定',
        // "目标分配",
        // '瞄准打击'
        // "毁伤评估",
      ],
      left: '90px',
      top: '6%',
      itemWidth: 16,
      itemHeight: 16,
      selectedMode: false, // 图例设为不可点击
      textStyle: {
        color: '#eee',
        fontSize: 14
      }
    },
    grid: {
      //绘图网格
      left: '3%',
      right: '3%',
      top: '20%',
      bottom: '0%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'value',
        show: false
      },
      {
        type: 'time',
        position: 'bottom',
        axisLabel: {
          color: '#eee', //更改坐标轴文字颜色
          fontSize: 14, //更改坐标轴文字大小
          showMaxLabel: true
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#eee'
          }
        }
      }
    ],
    yAxis: {
      axisLine: {
        lineStyle: {
          color: '#eee'
        }
      },
      data: [
        // '场景载入',
        // "前出接敌",
        '探测发现',
        '干扰对抗',
        '目标锁定',
        // "目标分配",
        '瞄准打击',
        '毁伤情况'
      ],
      axisLabel: {
        color: '#eee', //刻度颜色
        fontSize: 14 //刻度大小
      }
    },
    series: [
      {
        name: '背景',
        type: 'bar',
        barWidth: 20,
        // barGap: "50%",
        data: [50000000, 50000000, 50000000, 50000000, 50000000],
        itemStyle: {
          color: 'rgba(0,0,0,0.2)'
          //   barBorderRadius: 30,
        },
        markLine: {
          symbol: 'none',
          animation: false,
          label: {
            // 设置markLine显示名称
            show: true,
            // backgroundColor: "#fff",
            color: '#eee',
            formatter: (val) => {
              return '进度'
            }
          },
          tooltip: {
            formatter: function () {
              return store.state.sceneModule.msgMessionTime
            }
          },
          itemStyle: {
            type: 'line',
            normal: {
              lineStyle: {
                color: '#ff0000',
                width: 1,
                type: 'dashed'
              }
            }
          },
          data: [
            {
              xAxis: 50000000
            }
          ]
        },
        z: -11,
        xAxisIndex: 0,
        tooltip: {
          show: false
        }
      },
      // 用空bar来显示三个图例
      // {
      //   name: '场景载入',
      //   type: 'line',
      //   data: [],
      //  // barMaxWidth: 2,
      //   itemStyle: {
      //     color: hashMap[0]
      //   }
      // },
      // {
      //   name: "前出接敌",
      //   type: "bar",
      //   data: [],
      //  // barMaxWidth: 2,
      //   itemStyle: {
      //     color: hashMap[1],
      //   },
      // },
      {
        name: '探测发现',
        type: 'line',
        data: [],
        // barMaxWidth: 2,
        itemStyle: {
          color: hashMap[0]
        }
      },
      {
        name: '干扰对抗',
        type: 'line',
        data: [],
        // barMaxWidth: 2,
        itemStyle: {
          color: hashMap[1]
        }
      },
      {
        name: '目标锁定',
        type: 'line',
        data: [],
        // barMaxWidth: 2,
        itemStyle: {
          color: hashMap[2]
        }
      },
      // {
      //   name: "目标分配",
      //   type: "bar",
      //   data: [],
      //  // barMaxWidth: 2,
      //   itemStyle: {
      //     color: hashMap[5],
      //   },
      // },
      {
        name: '瞄准打击',
        type: 'line',
        data: [],
        // barMaxWidth: 2,
        itemStyle: {
          color: hashMap[3]
        }
      },
      {
        name: '毁伤情况',
        type: 'line',
        data: [],
        // barMaxWidth: 2,
        itemStyle: {
          color: hashMap[0]
        },
        xAxisIndex: 1,
        markPoint: {
          data: []
        }
      },
      {
        type: 'custom',
        renderItem: function (params, api) {
          //开发者自定义的图形元素渲染逻辑，是通过书写 renderItem 函数实现的
          var categoryIndex = api.value(0) //这里使用 api.value(0) 取出当前 dataItem 中第一个维度的数值。
          var start = api.coord([api.value(1), categoryIndex]) // 这里使用 api.coord(...) 将数值在当前坐标系中转换成为屏幕上的点的像素值。
          var end = api.coord([api.value(2), categoryIndex])
          // var height = api.size([0, 1])[1];
          var height = 10

          return {
            type: 'rect', // 表示这个图形元素是矩形。还可以是 'circle', 'sector', 'polygon' 等等。
            shape: echarts.graphic.clipRectByRect(
              {
                // 矩形的位置和大小。
                x: start[0],
                y: start[1] - height / 2,
                width: end[0] - start[0],
                height: height
              },
              {
                // 当前坐标系的包围盒。
                x: params.coordSys.x,
                y: params.coordSys.y,
                width: params.coordSys.width,
                height: params.coordSys.height
              }
            ),
            style: api.style()
          }
        },
        encode: {
          x: [1, 2], // data 中『维度1』和『维度2』对应到 X 轴
          y: 0 // data 中『维度0』对应到 Y 轴
        },
        z: 1,
        itemStyle: {
          color: function (params) {
            return hashMap[params.data['value'][0]]
          }
        },
        data: [
          // 维度0 维度1 维度2
          // {
          //   value: [0, `${baseDate} 1:28:13`, `${baseDate} 5:28:13`], //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
          // {
          //   value: [0, `${baseDate} 7:28:13`, `${baseDate} 15:28:13`], //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
          // {
          //   value: [1, `${baseDate} 2:18:13`, `${baseDate} 4:28:13`], //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
          // {
          //   value: [1, `${baseDate} 6:15:13`, `${baseDate} 17:58:13`], //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
          // {
          //   value: [1, `${baseDate} 19:18:13`, `${baseDate} 20:28:13`], //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
          // {
          //   value: [1, `${baseDate} 21:15:13`, `${baseDate} 23:38:13`], //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
          // {
          //   value: [2, `${baseDate} 19:18:13`, `${baseDate} 20:28:13`], //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
          // {
          //   value: [2, `${baseDate} 21:15:13`, `${baseDate} 23:38:13`], //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
          // {
          //   value: [3, `${baseDate} 1:28:13`, `${baseDate} 5:28:13`], //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
          // {
          //   value: [3, `${baseDate} 7:28:13`, `${baseDate} 15:28:13`], //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
          // {
          //   value: [4, `${baseDate} 8:28:13`, `${baseDate} 9:28:13`], //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
          // {
          //   value: [5, `${baseDate} 9:28:13`, `${baseDate} 10:28:13`], //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
          // {
          //   value: [6, `${baseDate} 10:28:13`, `${baseDate} 11:28:13`], //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
          // {
          //   value: [7, `${baseDate} 11:28:13`, `${baseDate} 12:28:13`], //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
          // {
          //   value: [8, `${baseDate} 12:28:13`, `${baseDate} 13:28:13`], //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
          // {
          //   value: [9, `${baseDate} 13:28:13`, `${baseDate} 14:28:13`], //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
        ],
        xAxisIndex: 1
      }
    ]
  }
}
// 日志监听
watch(
  () => store.state.sceneModule.timeOverviewData,
  (newValue, oldValue) => {
    let xAxisData = [
      // '场景载入',
      // "前出接敌",
      '探测发现',
      '干扰对抗',
      '目标锁定',
      // "目标分配",
      '瞄准打击'
      // "毁伤评估",
    ]
    xAxisData.forEach((item) => {
      // 上一个值为false，当前值为true，存储初始时间，更新开始时间
      state.startTime[item] =
        state.lastInfo[item] == 'false' && newValue[item] == 'true'
          ? store.state.sceneModule.msgMessionTime
          : state.startTime[item]
      // state.startTime[item] = state.lastInfo[item] == 'false' && newValue[item] == 'true' ? state.currentTime : state.startTime[item]
    })
    let seriesLength = state.stageDescriptionOption.series.length
    for (let i in newValue) {
      if (newValue[i] == 'true') {
        if (state.stageDescriptionOption.series[seriesLength - 1].data.length) {
          let sameIndex = state.stageDescriptionOption.series[
            seriesLength - 1
          ].data.findIndex((item) => {
            return (
              item.value[0] == xAxisData.findIndex((item) => item == i) &&
              item.value[1] == state.startTime[i]
            )
          })
          if (sameIndex == -1) {
            // 更新开始时间
            state.stageDescriptionOption.series[seriesLength - 1].data.push({
              value: [
                xAxisData.findIndex((item) => item == i),
                state.startTime[i],
                store.state.sceneModule.msgMessionTime
              ]
              // value: [xAxisData.findIndex(item => item == i), state.startTime[i], state.currentTime]
            })
          } else {
            // echarts有旧值，只更新结束时间
            state.stageDescriptionOption.series[seriesLength - 1].data[
              sameIndex
            ].value[2] = store.state.sceneModule.msgMessionTime
            // state.stageDescriptionOption.series[5].data[sameIndex].value[2] = state.currentTime
          }
        } else {
          state.stageDescriptionOption.series[seriesLength - 1].data.push({
            value: [
              xAxisData.findIndex((item) => item == i),
              state.startTime[i],
              store.state.sceneModule.msgMessionTime
            ]
            // value: [xAxisData.findIndex(item => item == i), state.startTime[i], state.currentTime]
          })
        }
        let echartsData = toRaw(state.stageDescriptionOption)
        state.myEcharts.setOption(echartsData, true)
        let nOption = state.myEcharts.getOption()
        emit('JCFXData', nOption)
      }
      if (newValue[i].includes('image')) {
        state.stageDescriptionOption.series[
          seriesLength - 2
        ].markPoint.data.push({
          name: '',
          symbolSize: 20,
          symbol: newValue[i],
          yAxis: '毁伤情况',
          xAxis: store.state.sceneModule.msgMessionTime,
          tooltip: {
            show: false
          }
        })
        let echartsData = toRaw(state.stageDescriptionOption)
        state.myEcharts.setOption(echartsData, true)
        let nOption = state.myEcharts.getOption()
        emit('JCFXData', nOption)
      }
    }
    state.lastInfo = newValue
  }
)
</script>

<style lang="less" scoped>
.logSteps-container {
  position: absolute;
  // left: calc(50% - 320px);
  right: -10px;
  bottom: 10px;
  // height: 60px;
  // width: 1050px;
  font-family: Georgia, serif;
  // width: 1260px;
  // width: 68%;
  width: 100%;
  // height: 220px;
  // height: 45%;
  height: 96%;
  background-image: url('~@/assets/images/infoStatistics/main_bootm_middle.png');
  // background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  z-index: 10;

  #statusEcharts {
    width: 100%;
    height: 84%;
    // background: rgba(2, 26, 70, 0.88);
    // box-shadow: 0 0 25px #1092d5;
  }
}
</style>
