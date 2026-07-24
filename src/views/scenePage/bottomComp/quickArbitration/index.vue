<template>
  <div class="logSteps-container">
    <div id="statusEcharts"></div>
    <el-tooltip
      class="box-item"
      effect="dark"
      content="关闭面板"
      placement="top"
    >
      <img
        src="@/assets/image/panelIcons/关闭icon.png"
        alt=""
        class="close_sty"
        @click="handleClose"
      />
    </el-tooltip>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import elementResizeDetectorMaker from 'element-resize-detector'
import { nextTick, onMounted, reactive, markRaw, watch } from 'vue'
import store from '@/store'
const hashMap = [
  '#75d0e4',
  '#bd6d6c',
  '#e0bc78',
  '#7b9ce1',
  '#75d878',
  '#0f6f6f',
  '#f0bc78'
]
const threatLevels = [
  { level: 1, name: '安全', color: '#00b42a' },
  { level: 2, name: '极低风险', color: '#36cf66' },
  { level: 3, name: '低风险', color: '#6ddf85' },
  { level: 4, name: '一般风险', color: '#ffc51f' },
  { level: 5, name: '中等风险', color: '#ff9f2e' },
  { level: 6, name: '较高风险', color: '#ff7d00' },
  { level: 7, name: '高风险', color: '#f53f3f' },
  { level: 8, name: '严重风险', color: '#e02020' },
  { level: 9, name: '极高风险', color: '#c00000' },
  { level: 10, name: '致命风险', color: '#8b0000' }
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
    瞄准打击: 'false',
    战场环境: 'false'
  },
  startTime: {
    // 场景载入: null,
    // "前出接敌": null,
    探测发现: null,
    干扰对抗: null,
    目标锁定: null,
    // "目标分配": null,
    瞄准打击: null,
    战场环境: null
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
  state.myEcharts.setOption(state.stageDescriptionOption)
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
const handleClose = () => {
  emitter.emit('closeBottomControlPanel', 'bottom')
  emitter.emit('tagActiveClose', 'quickDecision')
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
        state.myEcharts.setOption(state.stageDescriptionOption)
      }
      if (newValue[i].includes('image')) {
        state.stageDescriptionOption.series[
          seriesLength - 3
        ].markPoint.data.push({
          name: '',
          symbolSize: 16,
          symbol: newValue[i],
          yAxis: '毁伤情况',
          xAxis: store.state.sceneModule.msgMessionTime
        })
        state.myEcharts.setOption(state.stageDescriptionOption)
      }
    }
    state.lastInfo = newValue
  }
)
watch(
  () => store.state.sceneModule.timeOverviewDataEnviroment,
  (newValue, oldValue) => {
    console.log('params,newValue', newValue)
    let seriesLength = state.stageDescriptionOption.series.length
    let startDate = new Date(store.state.sceneModule.startDate)
    let targetTime = new Date(
      startDate.getTime() + newValue.abnormalTimeSeconds * 1000
    )
    let name = ''
    let side = ''
    if (newValue.abnormalTypeCode == 'SENSOR') {
      name = newValue.platformType
      side = newValue.detectorSide
    } else {
      name = newValue.platformCName
      side = newValue.side
    }
    console.log('newValue.details', newValue.details)
    let temp = {
      装备名称: name,
      时间: timestampToTime(targetTime),
      位置: `${newValue.longitude.toFixed(3)}°E,${newValue.latitude.toFixed(
        3
      )}°N,${parseInt(Number(newValue.altitude || 0))}m`,
      影响类型: newValue.abnormalTypeCName,
      详情: newValue.details,
      影响等级: threatLevels[newValue.severity - 1]
    }
    state.stageDescriptionOption.series[seriesLength - 2].markPoint.data.push({
      name: '',
      temp,
      symbolSize: 25,
      // symbol: 'rect',
      symbol: getImgUrl(newValue),
      yAxis: '战场环境',
      xAxis: timestampToTime(targetTime)
    })
    state.myEcharts.setOption(state.stageDescriptionOption)
  },
  { deep: true }
)

const getImgUrl = (newValue) => {
  let imgUrl = ''
  switch (newValue.specificCode) {
    case 'TURBULENCE':
      imgUrl =
        'image:///static/image/environmentFactorIcon/颠簸/SYMBOLBUMP' +
        newValue.severity +
        '.png'
      return imgUrl
      break
    case 'WEICHTLESS':
      imgUrl =
        'image:///static/image/environmentFactorIcon/异常/飞机失重/飞机失重' +
        newValue.severity +
        '.png'
      return imgUrl
      break
    case 'ALTITUDE_ABNORMAL':
      imgUrl =
        'image:///static/image/environmentFactorIcon/异常/高度异常/高度异常' +
        newValue.severity +
        '.png'
      return imgUrl
      break
    case 'SPEED_ABNORMAL':
      imgUrl =
        'image:///static/image/environmentFactorIcon/异常/速度异常/速度异常' +
        newValue.severity +
        '.png'
      return imgUrl
      break
    case 'FUEL_ABNORMAL':
      imgUrl =
        'image:///static/image/environmentFactorIcon/异常/燃油异常/燃油异常' +
        newValue.severity +
        '.png'
      return imgUrl
      break
    case 'ATTITUDE_ABNORMAL':
      imgUrl =
        'image:///static/image/environmentFactorIcon/异常/姿态异常/姿态异常' +
        newValue.severity +
        '.png'
      return imgUrl
      break
    case 'GLOAD_ABNORMAL':
      imgUrl =
        'image:///static/image/environmentFactorIcon/异常/G力异常/G力异常' +
        newValue.severity +
        '.png'
      return imgUrl
      break
    default:
      imgUrl =
        'image:///static/image/environmentFactorIcon/异常/默认/异常' +
        newValue.severity +
        '.png'
      return imgUrl
      break
  }
  return imgUrl
}
const timestampToTime = (timestamp) => {
  const date = new Date(timestamp)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  return `${year}/${month}/${day} ${hours}:${minutes}:${seconds}`
}
const makeOption = () => {
  return {
    color: '#0A8BFF',
    backgroundColor: 'rgba(2, 26, 70, 0.88)',
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
        { name: '瞄准打击', icon: 'roundRect' },
        { name: '战场环境', icon: 'roundRect' }
        // '探测发现',
        // '干扰对抗',
        // '目标锁定',
        // "目标分配",
        // '瞄准打击'
        // "毁伤评估",
      ],
      left: '60px',
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
        '毁伤情况',
        '战场环境'
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
                type: 'dashed',
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
          animation: false,
          tooltip: {
            show: true,
            formatter: function (params) {
              console.log('params毁伤情况', params)
              // 这里可以自定义提示内容
              return `毁伤情况：${params.data.coord[0]}`
            }
          },
          data: []
        }
      },
      {
        name: '战场环境',
        type: 'line',
        data: [],
        // barMaxWidth: 2,
        itemStyle: {
          color: hashMap[4]
        },
        xAxisIndex: 1,
        markPoint: {
          animation: false,
          tooltip: {
            show: true,
            backgroundColor: 'rgba(10, 18, 46, 0.8)',
            borderColor: 'rgba(26, 115, 232, 0.8)',
            borderWidth: 2,
            textStyle: { color: '#fff', fontSize: 14 },
            padding: [8, 12],
            formatter: function (params) {
              console.log('params战场环境', params)
              return `<strong style="font-size:17px;color:#66b2ff"> 战场环境影响</strong><br/>
              装备名称：${params.data.temp['装备名称']}<br/>
              影响时间：${params.data.temp['时间']}<br/>
              影响位置：${params.data.temp['位置']}<br/>
              影响类型：${params.data.temp['影响类型']}<br/>
              详情: ${params.data.temp['详情']}<br/>
              影响等级：<span style="color:${params.data.temp['影响等级'].color}">${params.data.temp['影响等级'].level}（${params.data.temp['影响等级'].name}）</span>`
            }
          },
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
</script>

<style lang="less" scoped>
.logSteps-container {
  position: absolute;
  left: calc(50% - 600px);
  bottom: 32px; //1%;
  // height: 60px;
  // width: 1050px;
  font-family: Georgia, serif;

  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 1100px;
  height: 230px;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  z-index: 10;

  #statusEcharts {
    width: 100%;
    height: 99%;
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;
  }
  .close_sty {
    cursor: pointer;
    position: absolute;
    top: 9px;
    right: 12px;
    width: 14px;
    height: 14px;
    z-index: 1;
  }
}
</style>
