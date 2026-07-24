<!--
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2025-04-25 09:06:25
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2025-05-20 10:23:17
 * @FilePath: \MSIMEarthSys1.0\src\views\scenePage\thematicAnalysisComp\electromagneticFrequencyDomainAnalysis\frequencyDomain.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="frequencyDomain">
    <div id="FD_chart_bar"></div>
    <div id="FD_chart_bar2"></div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import * as echarts from 'echarts'

const state = reactive({
  chart_bar: null,
  chart_bar2: null
})

const chart_bar = () => {
  if (state.chart_bar == null) {
    state.chart_bar = echarts.init(document.getElementById('FD_chart_bar'))
  }
  // 2. 模拟频域数据（FFT 结果）
  const sampleRate = 1000 // 采样率 (Hz)
  const fftSize = 20 // FFT 点数
  const frequencies = []
  const magnitudes = []

  for (let i = 0; i < fftSize / 2; i++) {
    // 频率 = 索引 * (采样率 / FFT点数)
    const freq = i * (sampleRate / fftSize)
    frequencies.push(freq.toFixed(1) + 'Hz')

    // 模拟幅度（随机峰值在 50Hz 和 150Hz）
    let magnitude = Math.random() * 10
    if (Math.abs(freq - 50) < 5) magnitude = 30 + Math.random() * 20
    if (Math.abs(freq - 150) < 5) magnitude = 40 + Math.random() * 20
    magnitudes.push(magnitude.toFixed(2))
  }
  let option = {
    tooltip: {},
    animation: false,
    grid: {
      top: '10%',
      right: '0%',
      left: '0%',
      bottom: '0%',
      containLabel: true
    },
    xAxis: {
      data: [
        'KG-001',
        'GJ-11',
        'KV-002',
        '九天无人机_1',
        'WZ-7-1',
        'WZ-8-1',
        'Z-10-1',
        'GJ-11-1',
        'KVD-001_kvd-1',
        'WZ-10-1'
      ],
      axisLine: {
        show: true, //隐藏X轴轴线
        lineStyle: {
          color: '#11417a'
        }
      },
      axisTick: {
        show: false //隐藏X轴刻度
      },
      axisLabel: {
        show: true,
        margin: 14,
        fontSize: 13,
        textStyle: {
          color: '#A3C0DF' //X轴文字颜色
        },
        rotate: 45 // 防止频率标签重叠
      }
    },
    yAxis: [
      {
        type: 'value',
        gridIndex: 0,
        // splitNumber: 4,
        splitLine: {
          show: true,
          lineStyle: {
            color: '#113763',
            width: 1
          }
        },
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#11417a'
          }
        },
        axisLabel: {
          show: true,
          margin: 14,
          fontSize: 14,
          textStyle: {
            color: '#A3C0DF' //X轴文字颜色
          }
        }
      }
    ],
    series: [
      {
        name: '频谱',
        type: 'bar',
        barWidth: 20,
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#07ecd9'
              },
              {
                offset: 1,
                color: '#034881'
              }
            ])
          }
        },
        data: magnitudes,
        z: 10,
        zlevel: 0,
        label: {
          show: true,
          position: 'top',
          distance: 10,
          fontSize: 16,
          color: '#01fff4'
        }
      },
      {
        // 分隔
        type: 'pictorialBar',
        itemStyle: {
          normal: {
            color: '#0F375F'
          }
        },
        symbolRepeat: 'fixed',
        symbolMargin: 6,
        symbol: 'rect',
        symbolClip: true,
        symbolSize: [20, 2],
        symbolPosition: 'start',
        symbolOffset: [0, -1],
        // symbolBoundingData: this.total,
        data: [20, 80, 100, 40, 34, 90, 60],
        width: 25,
        z: 0,
        zlevel: 1
      }
    ]
  }
  state.chart_bar.setOption(option)
  window.addEventListener('resize', function () {
    state.chart_bar.resize()
  })
}

const chart_bar2 = () => {
  if (state.chart_bar2 == null) {
    state.chart_bar2 = echarts.init(document.getElementById('FD_chart_bar2'))
  }
  var baseDate = `${new Date().getFullYear()}/${
    new Date().getMonth() + 1
  }/${new Date().getDate()}`
  // echart配置
  var option = {
    color: '#0A8BFF',
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
          return val + ''
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
  state.chart_bar2.setOption(option)
  window.addEventListener('resize', function () {
    state.chart_bar2.resize()
  })
}

onMounted(() => {
  setTimeout(() => {
    chart_bar()
    chart_bar2()
  }, 50)
})
</script>

<style lang="less" scoped>
#frequencyDomain {
  width: 100%;
  height: 100%;

  #FD_chart_bar {
    width: 100%;
    height: 50%;
  }

  #FD_chart_bar2 {
    width: 100%;
    height: 50%;
  }
}
</style>
