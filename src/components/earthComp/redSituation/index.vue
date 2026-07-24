<template>
  <div class="red-situation">
    <div id="situationEcharts"></div>
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
const state = reactive({
  myEcharts: null,
  stageDescriptionOption: {},
  baseDate: null
})
watch(
  () => store.state.sceneModule.redSituation,
  (newValue, oldValue) => {
    state.stageDescriptionOption = makeOption()
    state.myEcharts.setOption(state.stageDescriptionOption, true)
  }
)
onMounted(() => {
  let d = new Date()
  let year = d.getFullYear()
  let month =
    d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
  let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
  state.baseDate = year + '-' + month + '-' + day
  state.stageDescriptionOption = makeOption()
  initEcharts()
})
const initEcharts = () => {
  state.myEcharts = markRaw(
    echarts.init(document.getElementById('situationEcharts'))
  )
  state.myEcharts.setOption(state.stageDescriptionOption)
  window.addEventListener('resize', function () {
    state.myEcharts.resize()
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('situationEcharts'), function () {
    nextTick(() => {
      state.myEcharts.resize()
    })
  })
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
      confine: true,
      //alwaysShowContent:true,
      hideDelay: 100,
      backgroundColor: 'rgba(255,255,255,1)', //背景颜色（此时为默认色）
      borderRadius: 5, //边框圆角
      padding: [5, 0, 5, 0], // [5, 10, 15, 20] 内边距
      color: '#000',
      position: function (point, params, dom, rect, size) {
        console.log(params, 'ppppppp')
        if (params.componentType === 'series') {
          dom.innerHTML =
            '<div style="font-size:14px;color:rgba(0,0,0,0.65)" class="tip"><h1 style="font-size:14px;color:rgba(0,0,0,0.85);height:25px;display:flex;align-items: center;padding:0 0 5px 8px;margin:0;border:1px solid rgba(0,0,0,0.06);font-weight:bold">' +
            params.name.split(',')[0] +
            '</h1> <p style="margin:0;padding:0 8px 0 8px;height:25px;display:flex;align-items: center;">时段:' +
            params.value[1] +
            '~' +
            params.value[2] +
            ' </p></div>'
        } else if (params.componentType === 'markLine') {
          dom.innerHTML =
            '<div style="font-size:14px;color:rgba(0,0,0,0.65)" class="tip"><h1 style="font-size:14px;color:rgba(0,0,0,0.85);height:25px;display:flex;align-items: center;padding:0 0 5px 8px;margin:0;border:1px solid rgba(0,0,0,0.06);font-weight:bold">' +
            '当前时间:' +
            '</h1> <p style="margin:0;padding:0 8px 0 8px;height:25px;display:flex;align-items: center;">' +
            params.value +
            ' </p></div>'
        }
      }
    },
    grid: {
      //绘图网格
      left: '3%',
      right: '10%',
      top: '12%',
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
      data: ['被发现', '被锁定', '被跟踪', '被目标指示', '被空中截击'],
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
        // markLine: {
        //   symbol: 'none',
        //   animation: false,
        //   label: {
        //     // 设置markLine显示名称
        //     show: true,
        //     // backgroundColor: "#fff",
        //     color: '#eee',
        //     formatter: (val) => {
        //       return '当前时间'
        //     }
        //   },
        //   tooltip: {
        //     formatter: function () {
        //       return new Date()
        //     }
        //   },
        //   itemStyle: {
        //     type: 'line',
        //     normal: {
        //       lineStyle: {
        //         color: '#ff0000',
        //         width: 1,
        //         type: 'dashed'
        //       }
        //     }
        //   },
        //   data: [
        //     {
        //       xAxis: 30000000
        //     }
        //   ]
        // },
        z: -11,
        xAxisIndex: 0,
        tooltip: {
          show: false
        }
      },
      {
        type: 'custom',
        markLine: {
          symbol: 'none',
          animation: false,
          label: {
            // 设置markLine显示名称
            show: true,
            // backgroundColor: "#fff",
            color: '#eee',
            formatter: (val) => {
              return '当前时间'
            }
          },
          tooltip: {
            show: true,
            formatter: function (params) {
              // console.log(params,'ppppppppp')
              return params.data.coord[0]
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
              xAxis: `${state.baseDate} ${store.state.sceneModule.redSituation}`
            }
          ]
        },
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
          {
            value: [0, `${state.baseDate} 1:28:13`, `${state.baseDate} 5:28:13`] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          },
          // {
          //   value: [
          //     0,
          //     `${state.baseDate} 7:28:13`,
          //     `${state.baseDate} 15:28:13`
          //   ] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
          {
            value: [
              1,
              `${state.baseDate} 7:28:13`,
              `${state.baseDate} 11:28:13`
            ] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          },
          // {
          //   value: [
          //     1,
          //     `${state.baseDate} 6:15:13`,
          //     `${state.baseDate} 17:58:13`
          //   ] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
          // {
          //   value: [
          //     1,
          //     `${state.baseDate} 19:18:13`,
          //     `${state.baseDate} 20:28:13`
          //   ] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
          // {
          //   value: [
          //     1,
          //     `${state.baseDate} 21:15:13`,
          //     `${state.baseDate} 23:38:13`
          //   ] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
          {
            value: [
              2,
              `${state.baseDate} 12:18:13`,
              `${state.baseDate} 15:28:13`
            ] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          },
          // {
          //   value: [
          //     2,
          //     `${state.baseDate} 21:15:13`,
          //     `${state.baseDate} 23:38:13`
          //   ] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
          {
            value: [
              3,
              `${state.baseDate} 17:28:13`,
              `${state.baseDate} 21:28:13`
            ] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          },
          // {
          //   value: [
          //     3,
          //     `${state.baseDate} 7:28:13`,
          //     `${state.baseDate} 15:28:13`
          //   ] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          // },
          {
            value: [
              4,
              `${state.baseDate} 21:28:13`,
              `${state.baseDate} 23:28:13`
            ] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          }
        ],
        xAxisIndex: 1
      }
    ]
  }
}
</script>

<style lang="less" scoped>
.red-situation {
  position: absolute;
  // left: 5%;
  // bottom: 32px;
  font-family: Georgia, serif;

  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 400px;
  height: 200px;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;

  #situationEcharts {
    width: 100%;
    height: 99%;
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;
  }
}
</style>
