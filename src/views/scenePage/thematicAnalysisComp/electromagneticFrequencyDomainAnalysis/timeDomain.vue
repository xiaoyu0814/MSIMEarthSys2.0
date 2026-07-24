<template>
  <div id="timeDomain">
    <el-scrollbar height="100%">
      <div id="chart_1"></div>
      <div id="chart_2"></div>
      <div id="chart_3"></div>
    </el-scrollbar>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import * as echarts from 'echarts'

const state = reactive({
  chart_1: null,
  chart_2: null,
  chart_3: null
})

const chart_bar = () => {
  if (state.chart_1 == null) {
    state.chart_1 = echarts.init(document.getElementById('chart_1'))
  }
  let dedicatedData = [45, 106, 126, 52, 74, 50, 56, 88, 125]
  let generalData = [42, 126, 146, 22, 54, 80, 96, 78, 165]
  let labelData = [
    '地面站',
    '歼击机',
    '舰船',
    '坦克',
    '指挥车',
    '侦察机',
    '弹药',
    '雷达',
    '武器'
  ]
  //对话框图片
  let titleArray = ['红方', '蓝方']
  var option = {
    title: {
      text: '装备数量',
      textStyle: {
        color: '#fff'
      }
    },
    grid: {
      top: '15%',
      right: '0%',
      left: '0%',
      bottom: '0%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        color: '#59588D',
        data: labelData,
        axisLabel: {
          margin: 20,
          color: '#fff',
          textStyle: {
            fontSize: 18
          }
        },
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        axisTick: {
          show: false,
          lineStyle: {
            color: '#fff'
          }
        }
      }
    ],
    yAxis: [
      {
        min: 0,
        axisLabel: {
          color: '#fff',
          textStyle: {
            fontSize: 18
          }
        },
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        axisTick: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: '#fff',
            type: 'dashed'
          }
        }
      }
    ],
    series: [
      {
        name: titleArray[0],
        type: 'bar',
        data: dedicatedData,
        barWidth: '17px',
        itemStyle: {
          normal: {
            color: '#397cf9',
            barBorderRadius: [0, 0, 0, 0]
          }
        }
      },
      {
        name: titleArray[1],
        type: 'bar',
        data: generalData,
        barWidth: '17px',
        itemStyle: {
          normal: {
            color: '#ff0000',
            barBorderRadius: [0, 0, 0, 0]
          }
        }
      }
    ]
  }
  state.chart_1.setOption(option)
  window.addEventListener('resize', function () {
    state.chart_1.resize()
  })
}

const chart_bar2 = () => {
  if (state.chart_2 == null) {
    state.chart_2 = echarts.init(document.getElementById('chart_2'))
  }
  var baseDate = `${new Date().getFullYear()}/${
    new Date().getMonth() + 1
  }/${new Date().getDate()}`
  // echart配置
  var option = {
    color: '#0A8BFF',
    title: {
      text: '装备类型'
    },
    tooltip: {
      show: false,
      enterable: true,
      //alwaysShowContent:true,
      hideDelay: 100,
      backgroundColor: 'rgba(255,255,255,1)', //背景颜色（此时为默认色）
      borderRadius: 5, //边框圆角
      padding: [5, 0, 5, 0], // [5, 10, 15, 20] 内边距
      textStyle: {
        color: '#000'
      },
      position: function (point, params, dom, rect, size) {
        $(dom).html(
          '<div style="font-size:14px;color:rgba(0,0,0,0.65)" class="tip"><h1 style="font-size:14px;color:rgba(0,0,0,0.85);height:25px;display:flex;align-items: center;padding:0 0 5px 8px;margin:0;border-bottom:1px solid rgba(0,0,0,0.06);font-weight:bold">' +
            params.name.split(',')[0] +
            '</h1> <p style="margin:0;padding:0 8px 0 8px;height:25px;display:flex;align-items: center;">时段:' +
            params.value[1].split(' ')[1] +
            '~' +
            params.value[2].split(' ')[1] +
            ' </p><p style="margin:0;padding:0 8px 0 8px;height:25px;display:flex;align-items: center;">总工时:' +
            params.name.split(',')[1] +
            ' </p></div>'
        )
      }
    },
    //     data: ['工时'],
    //     left: '90px',
    //     top:"6%",
    //     itemWidth:16,
    //     itemHeight:16,
    //     selectedMode: false, // 图例设为不可点击
    //     textStyle: {
    //         color: 'rgba(0, 0, 0, 0.45)',
    //         fontSize:14
    //     }
    // },
    grid: {
      //绘图网格
      left: '0%',
      right: '3%',
      top: '5%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      type: 'time',
      // position: 'top',
      // interval: 3600 * 1000,   //以一个小时递增
      // max: `${baseDate} 24:00`,
      // min: `${baseDate} 00:00`, //将data里最小时间的整点时间设为min,否则min会以data里面的min为开始进行整点递增
      maxInterval: 3600 * 1000,
      axisLabel: {
        formatter: function (value, index) {
          var val = index * 450 + ''
          return index + ''
        },
        textStyle: {
          color: 'rgba(255, 255, 255, 0.65)', //更改坐标轴文字颜色
          fontSize: 14 //更改坐标轴文字大小
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0,0,0,0.1)'
        }
      }
    },
    yAxis: {
      axisLine: {
        lineStyle: {
          color: 'rgba(0,0,0,0.1)'
        }
      },
      data: [
        ['KG-001'],
        ['GJ-11'],
        ['KV-002'],
        ['九天无人机_1'],
        ['WZ-7-1'],
        ['WZ-8-1'],
        ['Z-10-1'],
        ['GJ-11-1'],
        ['KVD-001_kvd-1'],
        ['WZ-10-1']
      ],
      axisLabel: {
        textStyle: {
          color: 'rgba(255, 255, 255, 0.65)', //刻度颜色
          fontSize: 14 //刻度大小
        }
      }
    },
    series: [
      // 用空bar来显示三个图例
      { name: '工时', type: 'bar', data: [], barMaxWidth: 10 },
      // { name: state[1], type: 'bar', data: [],barMaxWidth:10 },
      // { name: state[2], type: 'bar', data: [],barMaxWidth:10 },
      {
        type: 'custom',
        renderItem: function (params, api) {
          //开发者自定义的图形元素渲染逻辑，是通过书写 renderItem 函数实现的
          var categoryIndex = api.value(0) //这里使用 api.value(0) 取出当前 dataItem 中第一个维度的数值。
          var start = api.coord([api.value(1), categoryIndex]) // 这里使用 api.coord(...) 将数值在当前坐标系中转换成为屏幕上的点的像素值。
          var end = api.coord([api.value(2), categoryIndex])
          // var height = api.size([0, 1])[1];
          var height = 20
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
        itemStyle: {
          normal: {
            color: function (params) {
              // 			console.log(params)
              if (
                params.data !== null &&
                params.data['value'] &&
                params.data['value'][3] == 'in'
              ) {
                return '#0A8BFF'
              } else {
                return 'red'
              }
            }
          }
        },
        data: [
          // 维度0 维度1 维度2
          {
            value: [0, `${baseDate} 1:28`, `${baseDate} 5:28`, 'in'] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          },
          {
            value: [0, `${baseDate} 7:28`, `${baseDate} 15:28`, 'in'] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          },
          {
            value: [1, `${baseDate} 2:18`, `${baseDate} 4:28`, 'in'] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          },
          {
            value: [1, `${baseDate} 6:15`, `${baseDate} 17:58`, 'in'] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          },
          {
            value: [1, `${baseDate} 19:18`, `${baseDate} 20:28`, 'in'] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          },
          {
            value: [1, `${baseDate} 21:15`, `${baseDate} 23:38`, 'in'] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          },
          {
            value: [2, `${baseDate} 19:18`, `${baseDate} 20:28`, 'in'] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          },
          {
            value: [2, `${baseDate} 21:15`, `${baseDate} 23:38`, 'in'] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          },
          {
            value: [3, `${baseDate} 1:28`, `${baseDate} 5:28`, 'in'] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          },
          {
            value: [3, `${baseDate} 7:28`, `${baseDate} 15:28`, 'in'] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          },
          {
            value: [4, `${baseDate} 8:28`, `${baseDate} 9:28`, 'in'] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          },
          {
            value: [5, `${baseDate} 9:28`, `${baseDate} 10:28`, 'in'] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          },
          {
            value: [6, `${baseDate} 10:28`, `${baseDate} 11:28`, 'in'] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          },
          {
            value: [7, `${baseDate} 11:28`, `${baseDate} 12:28`, 'in'] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          },
          {
            value: [8, `${baseDate} 12:28`, `${baseDate} 13:28`, 'in'] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          },
          {
            value: [9, `${baseDate} 13:28`, `${baseDate} 14:28`, 'in'] //0,1,2代表y轴的索引，后两位代表x轴数据开始和结束
          }
        ]
      }
    ]
  }
  state.chart_2.setOption(option)
  window.addEventListener('resize', function () {
    state.chart_2.resize()
  })
}

const chart_bar3 = () => {
  if (state.chart_3 == null) {
    state.chart_3 = echarts.init(document.getElementById('chart_3'))
  }
  // echart配置
  var option = {
    title: {
      text: '装备'
    },
    grid: {
      top: '15%',
      right: '0%',
      left: '0%',
      bottom: '0%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: [
          '2023-01',
          '2023-02',
          '2023-03',
          '2023-04',
          '2023-05',
          '2023-06'
        ],
        axisLine: {
          lineStyle: {
            color: '#999'
          }
        },
        axisLabel: {
          interval: 4
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        splitNumber: 4,
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#DDD'
          }
        },
        axisLine: {
          show: false,
          lineStyle: {
            color: '#333'
          }
        },
        nameTextStyle: {
          color: '#999'
        },
        splitArea: {
          show: false
        }
      }
    ],
    series: [
      {
        name: '价格',
        type: 'line',
        data: [23, 60, 20, 36, 23, 85],
        lineStyle: {
          normal: {
            width: 8,
            color: {
              type: 'linear',

              colorStops: [
                {
                  offset: 0,
                  color: '#A9F387' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: '#48D8BF' // 100% 处的颜色
                }
              ],
              globalCoord: false // 缺省为 false
            },
            shadowColor: 'rgba(72,216,191, 0.3)',
            shadowBlur: 10,
            shadowOffsetY: 20
          }
        },
        itemStyle: {
          normal: {
            color: '#fff',
            borderWidth: 10,
            /*shadowColor: 'rgba(72,216,191, 0.3)',
          shadowBlur: 100,*/
            borderColor: '#A9F387'
          }
        },
        smooth: true
      }
    ]
  }

  state.chart_3.setOption(option)
  window.addEventListener('resize', function () {
    state.chart_3.resize()
  })
}

onMounted(() => {
  setTimeout(() => {
    chart_bar()
    chart_bar2()
    chart_bar3()
  }, 50)
})
</script>

<style lang="less" scoped>
#timeDomain {
  width: 100%;
  height: calc(100% - 50px);

  #chart_1 {
    width: 100%;
    height: 300px;
  }

  #chart_2 {
    width: 100%;
    height: 300px;
  }

  #chart_3 {
    width: 100%;
    height: 300px;
  }
}
</style>
