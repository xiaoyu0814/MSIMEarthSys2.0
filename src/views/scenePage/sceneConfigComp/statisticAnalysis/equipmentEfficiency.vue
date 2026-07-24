<template>
  <!-- 装备效能 -->
  <div class="equipment-efficiency">
    <div class="efficiency-item1">
      <div class="item1_title">
        <div class="title_block"></div>
        无人机装备效能分析
      </div>
      <div class="item1_container">
        <div class="item1_echarts">
          <div id="youliangxiaohao"></div>
          <div id="dianliangxiaohao"></div>
        </div>
        <div class="item1_desc">
          <div class="desc_content">
            <div class="content_num">198</div>
            <div>飞行时间</div>
          </div>
          <div class="desc_content">
            <div class="content_num">211</div>
            <div>飞行里程</div>
          </div>
        </div>
      </div>
    </div>
    <div class="efficiency-item2">
      <!-- 作战效能 -->
      <div class="item2-center1">
        <div class="item1_title">
          <div class="title_block"></div>
          作战效能
        </div>
        <div id="combatEffectiveness"></div>
      </div>
      <!-- 威胁指数 -->
      <div class="item2-center2">
        <div class="item1_title">
          <div class="title_block"></div>
          威胁指数
        </div>
        <div id="threatIndex"></div>
      </div>
    </div>
    <div class="efficiency-item3">
      <div class="item1_title">
        <div class="title_block"></div>
        侦察图像分析
      </div>
      <div id="imageAnalysis"></div>
    </div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import elementResizeDetectorMaker from 'element-resize-detector'
import { reactive, onMounted, nextTick, markRaw, onUnmounted } from 'vue'
let angle = reactive(0)
let timerId = reactive(null)
const colors = ['#A098FC', '#4386FA', '#4FADFD', '#0CD3DB', '#646CF9']
//获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
const getCirlPoint = (x0, y0, r, angle) => {
  let x1 = x0 + r * Math.cos((angle * Math.PI) / 180)
  let y1 = y0 + r * Math.sin((angle * Math.PI) / 180)
  return {
    x: x1,
    y: y1
  }
}
const hexToRgba = (hex, opacity) => {
  let rgbaColor = ''
  let reg = /^#[\da-f]{6}$/i
  if (reg.test(hex)) {
    rgbaColor = `rgba(${parseInt('0x' + hex.slice(1, 3))},${parseInt(
      '0x' + hex.slice(3, 5)
    )},${parseInt('0x' + hex.slice(5, 7))},${opacity})`
  }
  return rgbaColor
}
const state = reactive({
  myChart1: null,
  myChart2: null,
  myChart3: null,
  myChart4: null,
  myChart5: null,
  chartOption1: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: colors,
    title: {
      text: '油量消耗',
      textStyle: {
        color: '#fff',
        fontSize: 16
      },
      padding: 0,
      top: 'bottom',
      left: 'center'
    },
    tooltip: {
      show: false
    },
    legend: {
      show: false
    },
    series: [
      {
        name: '',
        type: 'pie',
        center: ['50%', '50%'], //圆心的位置
        radius: ['32%', '35%'], //环形图的本质就在这里 [内半径!=0，外半径] 外半径越大，圆越大
        avoidLabelOverlap: false, //做同心圆用到
        clockwise: false, //顺时针排列
        startAngle: 90, //起始角度 影响不大
        label: {
          // 显示data的name值
          show: true, //false不显示饼图上的标签
          position: 'center', //inside（在饼图上显示）,outside(默认就会出现引导线) center
          // formatter: "{d}%",
          fontSize: 18,
          fontWeight: 'bold'
        },

        data: [
          {
            value: '1000',
            name: '1000',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [0, 0.3, 0.6, 0.8, 1].map((offset, index) => ({
                  offset,
                  color: colors[index]
                })),
                global: false // 缺省为 false
              },
              opacity: 1
            }
          }
        ], //数组从大到小排序

        emphasis: {
          scale: false
        }
      },
      {
        name: '',
        type: 'pie',
        center: ['50%', '50%'], //圆心的位置
        radius: ['40%', '50%'], //环形图的本质就在这里 [内半径!=0，外半径] 外半径越大，圆越大
        avoidLabelOverlap: false, //做同心圆用到
        clockwise: false, //顺时针排列
        startAngle: 90, //起始角度 影响不大

        label: {
          show: false //false不显示饼图上的标签
        },

        data: [
          {
            value: '1000',
            name: '1000',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [0, 0.3, 0.6, 0.8, 1].map((offset, index) => ({
                  offset,
                  color: colors[index]
                })),
                global: false // 缺省为 false
              },
              opacity: 1
            }
          }
        ], //数组从大到小排序

        emphasis: {
          scale: false
        }
      },
      {
        name: 'ring5',
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: function (params, api) {
          return {
            type: 'arc',
            shape: {
              cx: api.getWidth() / 2,
              cy: api.getHeight() / 2,
              r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6,
              startAngle: ((0 + angle) * Math.PI) / 180,
              endAngle: ((90 + angle) * Math.PI) / 180
            },
            style: {
              stroke: colors[0],
              fill: 'transparent',
              lineWidth: 1.5
            },
            silent: true
          }
        },
        data: [0]
      },
      {
        name: 'ring5', //        //colors[0]dot
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: function (params, api) {
          let x0 = api.getWidth() / 2
          let y0 = api.getHeight() / 2
          let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6
          let point = getCirlPoint(x0, y0, r, 90 + angle)
          return {
            type: 'circle',
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4
            },
            style: {
              stroke: colors[0],
              fill: colors[0]
            },
            silent: true
          }
        },
        data: [0]
      },
      // 蓝色

      {
        name: 'ring5',
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: function (params, api) {
          return {
            type: 'arc',
            shape: {
              cx: api.getWidth() / 2,
              cy: api.getHeight() / 2,
              r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6,
              startAngle: ((180 + angle) * Math.PI) / 180,
              endAngle: ((270 + angle) * Math.PI) / 180
            },
            style: {
              stroke: colors[1],
              fill: 'transparent',
              lineWidth: 1.5
            },
            silent: true
          }
        },
        data: [0]
      },
      {
        name: 'ring5', // 蓝色
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: function (params, api) {
          let x0 = api.getWidth() / 2
          let y0 = api.getHeight() / 2
          let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6
          let point = getCirlPoint(x0, y0, r, 180 + angle)
          return {
            type: 'circle',
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4
            },
            style: {
              stroke: colors[1], //绿
              fill: colors[1]
            },
            silent: true
          }
        },
        data: [0]
      },

      {
        name: 'ring5',
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: function (params, api) {
          return {
            type: 'arc',
            shape: {
              cx: api.getWidth() / 2,
              cy: api.getHeight() / 2,
              r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65,
              startAngle: ((270 + -angle) * Math.PI) / 180,
              endAngle: ((40 + -angle) * Math.PI) / 180
            },
            style: {
              stroke: colors[2],
              fill: 'transparent',
              lineWidth: 1.5
            },
            silent: true
          }
        },
        data: [0]
      },
      // 橘色

      {
        name: 'ring5',
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: function (params, api) {
          return {
            type: 'arc',
            shape: {
              cx: api.getWidth() / 2,
              cy: api.getHeight() / 2,
              r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65,
              startAngle: ((90 + -angle) * Math.PI) / 180,
              endAngle: ((220 + -angle) * Math.PI) / 180
            },
            style: {
              stroke: colors[2],
              fill: 'transparent',
              lineWidth: 1.5
            },
            silent: true
          }
        },
        data: [0]
      },
      {
        name: 'ring5',
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: function (params, api) {
          let x0 = api.getWidth() / 2
          let y0 = api.getHeight() / 2
          let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65
          let point = getCirlPoint(x0, y0, r, 90 + -angle)
          return {
            type: 'circle',
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4
            },
            style: {
              stroke: colors[3], //粉
              fill: colors[3]
            },
            silent: true
          }
        },
        data: [0]
      },
      {
        name: 'ring5', //绿点
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: function (params, api) {
          let x0 = api.getWidth() / 2
          let y0 = api.getHeight() / 2
          let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65
          let point = getCirlPoint(x0, y0, r, 270 + -angle)
          return {
            type: 'circle',
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4
            },
            style: {
              stroke: colors[3], //绿
              fill: colors[3]
            },
            silent: true
          }
        },
        data: [0]
      }
    ]
  },
  chartOption2: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: colors,
    title: {
      text: '电量消耗',
      textStyle: {
        color: '#fff',
        fontSize: 16
      },
      padding: 0,
      top: 'bottom',
      left: 'center'
    },
    tooltip: {
      show: false
    },
    legend: {
      show: false
    },
    series: [
      {
        name: '',
        type: 'pie',
        center: ['50%', '50%'], //圆心的位置
        radius: ['32%', '35%'], //环形图的本质就在这里 [内半径!=0，外半径] 外半径越大，圆越大
        avoidLabelOverlap: false, //做同心圆用到
        clockwise: false, //顺时针排列
        startAngle: 90, //起始角度 影响不大
        label: {
          // 显示data的name值
          show: true, //false不显示饼图上的标签
          position: 'center', //inside（在饼图上显示）,outside(默认就会出现引导线) center
          // formatter: "{d}%",
          fontSize: 18,
          fontWeight: 'bold'
        },

        data: [
          {
            value: '1000',
            name: '66',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [0, 0.3, 0.6, 0.8, 1].map((offset, index) => ({
                  offset,
                  color: colors[index]
                })),
                global: false // 缺省为 false
              },
              opacity: 1
            }
          }
        ], //数组从大到小排序

        emphasis: {
          scale: false
        }
      },
      {
        name: '',
        type: 'pie',
        center: ['50%', '50%'], //圆心的位置
        radius: ['40%', '50%'], //环形图的本质就在这里 [内半径!=0，外半径] 外半径越大，圆越大
        avoidLabelOverlap: false, //做同心圆用到
        clockwise: false, //顺时针排列
        startAngle: 90, //起始角度 影响不大

        label: {
          show: false //false不显示饼图上的标签
        },

        data: [
          {
            value: '1000',
            name: '66',
            itemStyle: {
              color: {
                type: 'linear',
                x: 0,
                y: 0,
                x2: 0,
                y2: 1,
                colorStops: [0, 0.3, 0.6, 0.8, 1].map((offset, index) => ({
                  offset,
                  color: colors[index]
                })),
                global: false // 缺省为 false
              },
              opacity: 1
            }
          }
        ], //数组从大到小排序

        emphasis: {
          scale: false
        }
      },
      {
        name: 'ring5',
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: function (params, api) {
          return {
            type: 'arc',
            shape: {
              cx: api.getWidth() / 2,
              cy: api.getHeight() / 2,
              r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6,
              startAngle: ((0 + angle) * Math.PI) / 180,
              endAngle: ((90 + angle) * Math.PI) / 180
            },
            style: {
              stroke: colors[0],
              fill: 'transparent',
              lineWidth: 1.5
            },
            silent: true
          }
        },
        data: [0]
      },
      {
        name: 'ring5', //        //colors[0]dot
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: function (params, api) {
          let x0 = api.getWidth() / 2
          let y0 = api.getHeight() / 2
          let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6
          let point = getCirlPoint(x0, y0, r, 90 + angle)
          return {
            type: 'circle',
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4
            },
            style: {
              stroke: colors[0],
              fill: colors[0]
            },
            silent: true
          }
        },
        data: [0]
      },
      // 蓝色

      {
        name: 'ring5',
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: function (params, api) {
          return {
            type: 'arc',
            shape: {
              cx: api.getWidth() / 2,
              cy: api.getHeight() / 2,
              r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6,
              startAngle: ((180 + angle) * Math.PI) / 180,
              endAngle: ((270 + angle) * Math.PI) / 180
            },
            style: {
              stroke: colors[1],
              fill: 'transparent',
              lineWidth: 1.5
            },
            silent: true
          }
        },
        data: [0]
      },
      {
        name: 'ring5', // 蓝色
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: function (params, api) {
          let x0 = api.getWidth() / 2
          let y0 = api.getHeight() / 2
          let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.6
          let point = getCirlPoint(x0, y0, r, 180 + angle)
          return {
            type: 'circle',
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4
            },
            style: {
              stroke: colors[1], //绿
              fill: colors[1]
            },
            silent: true
          }
        },
        data: [0]
      },

      {
        name: 'ring5',
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: function (params, api) {
          return {
            type: 'arc',
            shape: {
              cx: api.getWidth() / 2,
              cy: api.getHeight() / 2,
              r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65,
              startAngle: ((270 + -angle) * Math.PI) / 180,
              endAngle: ((40 + -angle) * Math.PI) / 180
            },
            style: {
              stroke: colors[2],
              fill: 'transparent',
              lineWidth: 1.5
            },
            silent: true
          }
        },
        data: [0]
      },
      // 橘色

      {
        name: 'ring5',
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: function (params, api) {
          return {
            type: 'arc',
            shape: {
              cx: api.getWidth() / 2,
              cy: api.getHeight() / 2,
              r: (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65,
              startAngle: ((90 + -angle) * Math.PI) / 180,
              endAngle: ((220 + -angle) * Math.PI) / 180
            },
            style: {
              stroke: colors[2],
              fill: 'transparent',
              lineWidth: 1.5
            },
            silent: true
          }
        },
        data: [0]
      },
      {
        name: 'ring5',
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: function (params, api) {
          let x0 = api.getWidth() / 2
          let y0 = api.getHeight() / 2
          let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65
          let point = getCirlPoint(x0, y0, r, 90 + -angle)
          return {
            type: 'circle',
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4
            },
            style: {
              stroke: colors[3], //粉
              fill: colors[3]
            },
            silent: true
          }
        },
        data: [0]
      },
      {
        name: 'ring5', //绿点
        type: 'custom',
        coordinateSystem: 'none',
        renderItem: function (params, api) {
          let x0 = api.getWidth() / 2
          let y0 = api.getHeight() / 2
          let r = (Math.min(api.getWidth(), api.getHeight()) / 2) * 0.65
          let point = getCirlPoint(x0, y0, r, 270 + -angle)
          return {
            type: 'circle',
            shape: {
              cx: point.x,
              cy: point.y,
              r: 4
            },
            style: {
              stroke: colors[3], //绿
              fill: colors[3]
            },
            silent: true
          }
        },
        data: [0]
      }
    ]
  },
  chartOption3: {
    backgroundColor: 'rgba(0,0,0,0)',
    tooltip: {
      formatter: '{b}{c}'
    },
    series: [
      //   线
      {
        tooltip: {
          show: false
        },
        name: '刻度',
        type: 'gauge',
        radius: '60%',
        z: 1,
        min: 0,
        max: 1,
        center: ['50%', '60%'],
        splitNumber: 5, //刻度数量
        startAngle: 200,
        endAngle: -20,
        axisLine: {
          show: true,
          lineStyle: {
            width: 5,
            color: [
              [0.125, '#E71A6D'],
              [0.25, '#FBF76B'],
              [0.375, '#70C27E'],
              [0.5, '#FBF76B'],
              [0.625, '#7AD4DF'],
              [0.75, '#70C27E'],
              [0.875, '#FBF76B'],
              [1.0, '#E71A6D']
            ]
          }
        }, //仪表盘轴线
        axisLabel: {
          show: false
        }, //刻度标签。
        axisTick: {
          show: true,
          lineStyle: {
            color: 'auto',
            width: 0
          },
          length: -15
        }, //刻度样式
        splitLine: {
          show: true,
          length: 0,
          lineStyle: {
            color: 'auto',
            width: 2
          }
        }, //分隔线样式
        detail: {
          show: false
        },
        pointer: {
          show: false
        }
      },
      {
        name: '综合得分',
        type: 'gauge',
        radius: '100%',
        min: 0,
        max: 1,
        center: ['50%', '60%'],
        data: [
          {
            value: 0.98,
            name: '综合得分'
          }
        ],
        splitNumber: 8, //刻度数量
        startAngle: 200,
        endAngle: -20,
        z: 5,
        axisLine: {
          show: true,
          lineStyle: {
            width: 0,
            color: [
              [0.125, '#E71A6D'],
              [0.25, '#FBF76B'],
              [0.375, '#70C27E'],
              [0.5, '#FBF76B'],
              [0.625, '#7AD4DF'],
              [0.75, '#70C27E'],
              [0.875, '#FBF76B'],
              [1.0, '#E71A6D']
            ]
          }
        }, //仪表盘轴线
        axisLabel: {
          show: true,
          color: '#fff',
          fontSize: 16,
          distance: -50,
          formatter: function (params) {
            var value = params.toFixed(2)

            if (value == 0.0) {
              return '20'
            } else if (value <= 0.2) {
              return '30'
            } else if (value <= 0.25) {
              return '40'
            } else if (value <= 0.4) {
              return '50'
            } else if (value <= 0.5) {
              return '60'
            } else if (value <= 0.7) {
              return '70'
            } else if (value <= 0.75) {
              return '80'
            } else if (value <= 0.9) {
              return '90'
            } else if (value == 1.0) {
              return '100'
            }
          }
        }, //刻度标签。
        axisTick: {
          splitNumber: 4,
          show: true,
          lineStyle: {
            color: 'auto',
            width: 2
          },
          length: 20
        }, //刻度样式
        splitLine: {
          show: true,
          length: 25,
          lineStyle: {
            color: 'auto',
            width: 5
          }
        }, //分隔线样式

        itemStyle: {
          normal: {
            color: '#24D8E7' //指针颜色
          }
        },
        pointer: {
          show: false,
          width: 10,
          length: '80%'
        },
        detail: {
          formatter: function (params) {
            return (params * 100).toFixed(0)
          },
          fontSize: 18,
          color: '#fff',
          offsetCenter: ['0%', '10%']
        },
        title: {
          offsetCenter: ['0', '-20%'],
          fontSize: 18,
          color: '#fff',
          show: true
        }
      }
    ]
  },
  chartOption4: {
    backgroundColor: 'rgba(0,0,0,0)',
    title: {
      show: false
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        lineStyle: {
          color: '#57617B'
        }
      }
    },
    legend: {
      show: false,
      icon: 'rect',
      itemWidth: 14,
      itemHeight: 5,
      itemGap: 13,
      data: ['移动', '电信', '联通'],
      right: '4%',
      textStyle: {
        fontSize: 12,
        color: '#fff'
      }
    },
    grid: {
      left: '3%',
      right: '10%',
      bottom: '3%',
      top: '8%',
      containLabel: true
    },
    xAxis: [
      {
        name: '时间',
        type: 'category',
        boundaryGap: false,
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        data: [
          '13:00',
          '13:05',
          '13:10',
          '13:15',
          '13:20',
          '13:25',
          '13:30',
          '13:35',
          '13:40',
          '13:45',
          '13:50',
          '13:55'
        ]
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '',
        axisTick: {
          show: false
        },
        axisLine: {
          show: true,
          lineStyle: {
            color: '#fff'
          }
        },
        axisLabel: {
          margin: 10,
          textStyle: {
            fontSize: 14
          }
        },
        splitLine: {
          show: false,
          lineStyle: {
            color: '#eee'
          }
        }
      }
    ],
    series: [
      {
        name: '威胁指数',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          normal: {
            width: 1
          }
        },
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: 'rgba(137, 189, 27, 0.3)'
                },
                {
                  offset: 0.8,
                  color: 'rgba(137, 189, 27, 0)'
                }
              ],
              false
            ),
            shadowColor: 'rgba(0, 0, 0, 0.1)',
            shadowBlur: 10
          }
        },
        itemStyle: {
          normal: {
            color: 'rgb(137,189,27)',
            borderColor: 'rgba(137,189,2,0.27)',
            borderWidth: 12
          }
        },
        data: [220, 182, 191, 134, 150, 120, 110, 125, 145, 122, 165, 122]
      }
    ]
  },
  chartOption5: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: ['#8B5CFF', '#00CA69'],
    legend: {
      show: false,
      top: 20
    },
    tooltip: {
      trigger: 'axis',
      formatter: function (params) {
        let html = ''
        params.forEach((v) => {
          html += `<div style="color: #666;font-size: 14px;line-height: 24px">
                <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                  ['#8B5CFF', '#00CA69'][v.componentIndex]
                };"></span>
                ${v.seriesName}2020.${v.name}  
                <span style="color:${
                  ['#8B5CFF', '#00CA69'][v.componentIndex]
                };font-weight:700;font-size: 18px;margin-left:5px">${
            v.value
          }</span>
                万元`
        })
        return html
      },
      extraCssText:
        'background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;',
      axisPointer: {
        //   type: "shadow",
        shadowStyle: {
          color: '#ffffff',
          shadowColor: 'rgba(225,225,225,1)',
          shadowBlur: 5
        }
      }
    },
    grid: {
      left: '3%',
      right: '10%',
      bottom: '3%',
      top: '8%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        axisLabel: {
          formatter: '{value}',
          textStyle: {
            color: '#fff'
          }
        },
        axisLine: {
          lineStyle: {
            color: '#fff'
          }
        },
        data: ['1', '2', '3', '4', '5', '6', '7', '8']
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '单位（万/亿KWh）',
        axisLabel: {
          textStyle: {
            color: '#fff'
          }
        },
        nameTextStyle: {
          color: '#fff',
          fontSize: 12,
          lineHeight: 40
        },
        // 分割线
        splitLine: {
          lineStyle: {
            type: 'dashed',
            color: '#E9E9E9'
          }
        },
        axisLine: {
          show: true,
          lineStyle: {
            type: 'dashed',
            color: '#fff'
          }
        },
        axisTick: {
          show: false
        }
      }
    ],
    series: [
      {
        // name: "2018",
        name: '预测出电量',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        zlevel: 3,
        lineStyle: {
          normal: {
            color: '#8B5CFF',
            shadowBlur: 3,
            shadowColor: hexToRgba('#8B5CFF', 0.5),
            shadowOffsetY: 8
          }
        },
        symbol: 'circle', //数据交叉点样式
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: hexToRgba('#8B5CFF', 0.3)
                },
                {
                  offset: 1,
                  color: hexToRgba('#8B5CFF', 0.1)
                }
              ],
              false
            ),
            shadowColor: hexToRgba('#8B5CFF', 0.1),
            shadowBlur: 10
          }
        },
        data: [100, 138, 350, 173, 180, 150, 180, 230]
      },
      {
        name: '实际用电量',
        type: 'line',
        smooth: true,
        symbolSize: 8,
        zlevel: 3,
        lineStyle: {
          normal: {
            color: '#00CA69',
            shadowBlur: 3,
            shadowColor: hexToRgba('#00CA69', 0.5),
            shadowOffsetY: 8
          }
        },
        symbol: 'circle', //数据交叉点样式 (实心点)
        areaStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: hexToRgba('#00CA69', 0.3)
                },
                {
                  offset: 1,
                  color: hexToRgba('#00CA69', 0.1)
                }
              ],
              false
            ),
            shadowColor: hexToRgba('#00CA69', 0.1),
            shadowBlur: 10
          }
        },
        data: [233, 233, 200, 180, 199, 233, 210, 180]
      }
    ]
  }
})

const draw = () => {
  angle = angle + 3
  state.myChart1.setOption(state.chartOption1, true)
  state.myChart2.setOption(state.chartOption2, true)
}
const initChart1 = () => {
  if (state.myChart1 == null) {
    state.myChart1 = echarts.init(document.getElementById('youliangxiaohao'))
  }
  state.myChart1.setOption(state.chartOption1)
  window.addEventListener('resize', function () {
    state.myChart1.resize()
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('youliangxiaohao'), function () {
    nextTick(() => {
      state.myChart1.resize()
    })
  })
}
const initChart2 = () => {
  if (state.myChart2 == null) {
    state.myChart2 = echarts.init(document.getElementById('dianliangxiaohao'))
  }
  state.myChart2.setOption(state.chartOption2)
  window.addEventListener('resize', function () {
    state.myChart2.resize()
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('dianliangxiaohao'), function () {
    nextTick(() => {
      state.myChart2.resize()
    })
  })
}
const initChart3 = () => {
  if (state.myChart3 == null) {
    state.myChart3 = echarts.init(
      document.getElementById('combatEffectiveness')
    )
  }
  state.myChart3.setOption(state.chartOption3)
  window.addEventListener('resize', function () {
    state.myChart3.resize()
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('combatEffectiveness'), function () {
    nextTick(() => {
      state.myChart3.resize()
    })
  })
}
const initChart4 = () => {
  if (state.myChart4 == null) {
    state.myChart4 = markRaw(
      echarts.init(document.getElementById('threatIndex'))
    )
  }
  state.myChart4.setOption(state.chartOption4)
  window.addEventListener('resize', function () {
    state.myChart4.resize()
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('threatIndex'), function () {
    nextTick(() => {
      state.myChart4.resize()
    })
  })
}
const initChart5 = () => {
  if (state.myChart5 == null) {
    state.myChart5 = markRaw(
      echarts.init(document.getElementById('imageAnalysis'))
    )
  }
  state.myChart5.setOption(state.chartOption5)
  window.addEventListener('resize', function () {
    state.myChart5.resize()
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('imageAnalysis'), function () {
    nextTick(() => {
      state.myChart5.resize()
    })
  })
}
onMounted(() => {
  initChart1()
  initChart2()
  initChart3()
  initChart4()
  initChart5()
  draw()
  setTimeout(function () {
    if (timerId) {
      clearInterval(timerId)
    }
    timerId = setInterval(function () {
      //用setInterval做动画感觉有问题
      draw()
    }, 100)
  }, 500)
})
onUnmounted(() => {
  state.myChart1.dispose()
  state.myChart2.dispose()
  state.myChart3.dispose()
  state.myChart4.dispose()
  state.myChart5.dispose()
  clearInterval(timerId)
})
</script>

<style lang="less" scoped>
@font-face {
  font-family: 'digit';
  /* Project id 3968143 */
  src: url('@/assets/iconfont/DS-DIGI.TTF') format('truetype'),
    url('@/assets/iconfont/DS-DIGIB.TTF') format('truetype'),
    url('@/assets/iconfont/DS-DIGII.TTF') format('truetype'),
    url('@/assets/iconfont/DS-DIGIT.TTF') format('truetype');
}

.equipment-efficiency {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding: 10px;
  box-sizing: border-box;

  .efficiency-item1 {
    width: 100%;
    height: 28%;

    .item1_title {
      display: flex;
      color: white;
      align-items: center;
      font-size: 18px;

      .title_block {
        background-color: #3399ff;
        width: 4px;
        height: 20px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        margin: 0 10px;
      }
    }

    .item1_container {
      height: calc(100% - 24px);
      display: flex;

      .item1_echarts {
        width: 50%;
        height: 100%;
        display: flex;

        #youliangxiaohao {
          width: 50%;
          height: 100%;
        }

        #dianliangxiaohao {
          width: 50%;
          height: 100%;
        }
      }

      .item1_desc {
        color: white;
        width: 50%;
        height: 100%;
        display: flex;

        .desc_content {
          width: 50%;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          font-size: 16px;
          color: #8fd4ec;

          .content_num {
            font-family: 'digit';
            font-size: 24px;
            font-style: italic;
            color: white;
          }
        }
      }
    }
  }

  .efficiency-item2 {
    width: 100%;
    height: 35%;
    display: flex;

    .item2-center1 {
      width: 40%;
      height: 100%;

      .item1_title {
        display: flex;
        color: white;
        align-items: center;
        font-size: 18px;

        .title_block {
          background-color: #3399ff;
          width: 4px;
          height: 20px;
          -webkit-border-radius: 3px;
          -moz-border-radius: 3px;
          border-radius: 3px;
          margin: 0 10px;
        }
      }

      #combatEffectiveness {
        height: calc(100% - 24px);
      }
    }

    .item2-center2 {
      width: 60%;
      height: 100%;

      .item1_title {
        display: flex;
        color: white;
        align-items: center;
        font-size: 18px;

        .title_block {
          background-color: #3399ff;
          width: 4px;
          height: 20px;
          -webkit-border-radius: 3px;
          -moz-border-radius: 3px;
          border-radius: 3px;
          margin: 0 10px;
        }
      }

      #threatIndex {
        height: calc(100% - 24px);
      }
    }
  }

  .efficiency-item3 {
    width: 100%;
    height: 35%;
    // display: flex;

    .item1_title {
      display: flex;
      color: white;
      align-items: center;
      font-size: 18px;

      .title_block {
        background-color: #3399ff;
        width: 4px;
        height: 20px;
        -webkit-border-radius: 3px;
        -moz-border-radius: 3px;
        border-radius: 3px;
        margin: 0 10px;
      }
    }

    #imageAnalysis {
      width: 100%;
      height: calc(100% - 24px);
    }
  }
}
</style>
