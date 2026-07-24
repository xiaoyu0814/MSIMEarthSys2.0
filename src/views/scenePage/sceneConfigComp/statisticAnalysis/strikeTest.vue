<template>
  <div class="strike-test">
    <div class="test-both">
      <div class="both-info">
        <div class="info-title">
          <p>目标毁伤率</p>
        </div>
        <div class="info-content">
          <div id="targetDamage" class="echart-style"></div>
        </div>
      </div>
      <div class="both-info">
        <div class="info-title">
          <p>火力毁伤持续效果</p>
        </div>
        <div class="info-content">
          <div id="sustainedEffect" class="echart-style"></div>
        </div>
      </div>
      <div class="both-info">
        <div class="info-title">
          <p>时敏目标打击完成率</p>
        </div>
        <div class="info-content">
          <div id="strikeCompletionRate" class="echart-style"></div>
        </div>
      </div>
    </div>
    <div class="test-center">
      <div class="info-title">
        <p>全局打击能力评估</p>
      </div>
      <div class="info-content">
        <div id="capabilityAssessment" class="echart-style"></div>
      </div>
    </div>
    <div class="test-both">
      <div class="both-info">
        <div class="info-title">
          <p>目标毁伤效果</p>
        </div>
        <div class="info-content">
          <div id="damageEffect" class="echart-style"></div>
        </div>
      </div>
      <div class="both-info">
        <div class="info-title">
          <p>火力毁伤效益</p>
        </div>
        <div class="info-content" style="padding: 10px">
          <el-table
            ref="multipleTableRef"
            :data="state.tableData"
            style="width: 100%"
            stripe
            :header-cell-style="{
              color: 'white',
              backgroundColor: 'rgba(0,0,0,0)'
            }"
            @selection-change="handleSelectionChange"
          >
            <el-table-column
              property="droneLoss"
              label="无人机损耗"
              width="90"
            />
            <el-table-column
              property="lossOfMannedAircraft"
              label="有人机损耗"
              width="90"
            />
            <el-table-column
              property="potentialCasualties"
              label="人员潜在伤亡可能性"
              show-overflow-tooltip
            />
          </el-table>
          <!-- <div id="mubiaohs" class="echart-style"></div> -->
        </div>
      </div>
      <div class="both-info">
        <div class="info-title">
          <p>弹药消耗量</p>
        </div>
        <div class="info-content">
          <div class="desc_content">
            <div class="content_num">{{ state.ammunitionConsumption }}</div>
            <div>弹药消耗</div>
          </div>
          <!-- <div id="mubiaohs" class="echart-style"></div> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, nextTick, markRaw, watch, onUnmounted } from 'vue'
import * as echarts from 'echarts'
import elementResizeDetectorMaker from 'element-resize-detector'
import store from '@/store'

const state = reactive({
  myChart1: null,
  myChart2: null,
  myChart3: null,
  myChart4: null,
  myChart5: null,
  targetDamageOption: {}, //目标毁伤率
  sustainedEffectOption: {}, //火力毁伤持续效果
  strikeCompletionRateOption: {}, //时敏目标打击完成率
  capabilityAssessmentOption: {}, //全局打击能力评估
  damageEffectOption: {}, //目标毁伤效果
  tableData: [],
  ammunitionConsumption: 200 //弹药消耗
})
const handleSelectionChange = () => {}
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
const makeTargetDamageOption = (value) => {
  return {
    backgroundColor: 'rgba(0,0,0,0)',
    title: {
      text: '{a|' + value + '}{c|%}',
      x: 'center',
      y: 'center',
      textStyle: {
        rich: {
          a: {
            fontSize: 48,
            color: '#29EEF3'
          },

          c: {
            fontSize: 20,
            color: '#ffffff'
            // padding: [5,0]
          }
        }
      }
    },
    series: [
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
              stroke: '#0CD3DB',
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
              stroke: '#0CD3DB',
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
              stroke: '#0CD3DB',
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
              stroke: '#0CD3DB',
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
              stroke: '#0CD3DB', //粉
              fill: '#0CD3DB'
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
              stroke: '#0CD3DB', //绿
              fill: '#0CD3DB'
            },
            silent: true
          }
        },
        data: [0]
      },
      {
        name: '吃猪肉频率',
        type: 'pie',
        radius: ['58%', '45%'],
        silent: true,
        clockwise: true,
        startAngle: 90,
        z: 0,
        zlevel: 0,
        label: {
          normal: {
            position: 'center'
          }
        },
        data: [
          {
            value: value,
            name: '',
            itemStyle: {
              normal: {
                color: {
                  // 完成的圆环的颜色
                  colorStops: [
                    {
                      offset: 0,
                      color: '#4FADFD' // 0% 处的颜色
                    },
                    {
                      offset: 1,
                      color: '#28E8FA' // 100% 处的颜色
                    }
                  ]
                }
              }
            }
          },
          {
            value: 100 - value,
            name: '',
            label: {
              normal: {
                show: false
              }
            },
            itemStyle: {
              normal: {
                color: '#173164'
              }
            }
          }
        ]
      },

      {
        name: '',
        type: 'gauge',
        radius: '58%',
        center: ['50%', '50%'],
        startAngle: 0,
        endAngle: 359.9,
        splitNumber: 8,
        hoverAnimation: true,
        axisTick: {
          show: false
        },
        splitLine: {
          length: 60,
          lineStyle: {
            width: 5,
            color: '#061740'
          }
        },
        axisLabel: {
          show: false
        },
        pointer: {
          show: false
        },
        axisLine: {
          lineStyle: {
            opacity: 0
          }
        },
        detail: {
          show: false
        },
        data: [
          {
            value: 0,
            name: ''
          }
        ]
      }
    ]
  }
}
const initChart1 = () => {
  if (state.myChart1 == null) {
    state.myChart1 = echarts.init(document.getElementById('targetDamage'))
  }
  state.myChart1.setOption(state.targetDamageOption)
  window.addEventListener('resize', function () {
    state.myChart1.resize()
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('targetDamage'), function () {
    nextTick(() => {
      state.myChart1.resize()
    })
  })
}
const makeSustainedEffectOption = (seriesData) => {
  return {
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
    grid: {
      left: '3%',
      right: '12%',
      bottom: '3%',
      top: '20%',
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
        data: ['13:00', '13:05', '13:10', '13:15']
      }
    ],
    yAxis: [
      {
        type: 'value',
        name: '打击火力',
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
        name: '火力毁伤持续效果',
        type: 'line',
        smooth: true,
        symbol: 'circle',
        symbolSize: 5,
        showSymbol: false,
        lineStyle: {
          normal: {
            color: '#8B5CFF',
            shadowBlur: 3,
            shadowColor: hexToRgba('#8B5CFF', 0.5),
            shadowOffsetY: 8
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
        // itemStyle: {
        //   normal: {
        //     color: "rgb(137,189,27)",
        //     borderColor: "rgba(137,189,2,0.27)",
        //     borderWidth: 12,
        //   },
        // },
        data: seriesData
      }
    ]
  }
}
const initChart2 = () => {
  if (state.myChart2 == null) {
    state.myChart2 = markRaw(
      echarts.init(document.getElementById('sustainedEffect'))
    )
  }
  state.myChart2.setOption(state.sustainedEffectOption)
  window.addEventListener('resize', function () {
    state.myChart2.resize()
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('sustainedEffect'), function () {
    nextTick(() => {
      state.myChart2.resize()
    })
  })
}
const makeStrikeCompletionRateOption = (value) => {
  return {
    backgroundColor: 'rgba(0,0,0,0)',
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {d}%'
    },
    color: ['#A098FC', '#00ccff'],
    series: [
      {
        name: '时敏目标打击完成率',
        type: 'pie',
        radius: '55%',
        center: ['40%', '50%'],
        data: [
          { value: value, name: '完成' },
          { value: 100 - value, name: '未完成' }
        ],
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        },
        itemStyle: {
          normal: {
            label: {
              show: true,
              color: '#fff',
              //	                            position:'inside',
              formatter: '{b} : {d}%'
            }
          },
          labelLine: { show: true }
        }
      }
    ]
  }
}
const initChart3 = () => {
  if (state.myChart3 == null) {
    state.myChart3 = markRaw(
      echarts.init(document.getElementById('strikeCompletionRate'))
    )
  }
  state.myChart3.setOption(state.strikeCompletionRateOption)
  window.addEventListener('resize', function () {
    state.myChart3.resize()
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('strikeCompletionRate'), function () {
    nextTick(() => {
      state.myChart3.resize()
    })
  })
}
const makeCapabilityAssessmentOption = (seriesData) => {
  return {
    backgroundColor: 'rgba(0,0,0,0)',
    color: ['#00c2ff', '#f9cf67', '#e92b77'],
    radar: [
      {
        indicator: [
          {
            text: '目标毁伤能力',
            max: 35,
            axisLabel: {
              //展示刻度
              show: true
            }
          },
          {
            text: '目标打击效果',
            max: 35
          },
          {
            text: '火力毁伤周期',
            max: 35
          },
          {
            text: '火力毁伤效益',
            max: 35
          },
          {
            text: '时敏目标打击能力',
            max: 35
          },
          {
            text: '弹药使用效率',
            max: 35
          }
        ],

        textStyle: {
          color: 'red'
        },
        center: ['50%', '50%'],
        radius: 142,
        startAngle: 90,
        splitNumber: 7,
        orient: 'horizontal', // 图例列表的布局朝向,默认'horizontal'为横向,'vertical'为纵向.
        // shape: 'circle',
        // backgroundColor: {
        //     image:imgPath[0]
        // },
        name: {
          formatter: '{value}',
          textStyle: {
            fontSize: 14, //外圈标签字体大小
            color: '#fff' //外圈标签字体颜色
          }
        },
        splitArea: {
          // 坐标轴在 grid 区域中的分隔区域，默认不显示。
          show: true,
          areaStyle: {
            // 分隔区域的样式设置。
            color: ['#141c42', '#141c42'] // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
          }
        },

        axisLine: {
          //指向外圈文本的分隔线样式
          show: false,
          lineStyle: {
            color: '#fff'
          }
        },
        splitLine: {
          lineStyle: {
            color: '#113865', // 分隔线颜色
            width: 1 // 分隔线线宽
          }
        }
      }
    ],
    series: [
      {
        name: '雷达图',
        type: 'radar',
        itemStyle: {
          emphasis: {
            lineStyle: {
              width: 4
            }
          }
        },
        data: [
          {
            name: '全局打击能力评估',
            value: seriesData,
            areaStyle: {
              normal: {
                // 单项区域填充样式
                color: {
                  type: 'linear',
                  x: 0, //右
                  y: 0, //下
                  x2: 1, //左
                  y2: 1, //上
                  colorStops: [
                    {
                      offset: 0,
                      color: '#00c2ff'
                    },
                    {
                      offset: 0.5,
                      color: 'rgba(0,0,0,0)'
                    },
                    {
                      offset: 1,
                      color: '#00c2ff'
                    }
                  ],
                  globalCoord: false
                },
                opacity: 1 // 区域透明度
              }
            },
            symbolSize: 2.5, // 单个数据标记的大小，可以设置成诸如 10 这样单一的数字，也可以用数组分开表示宽和高，例如 [20, 10] 表示标记宽为20，高为10。
            label: {
              // 单个拐点文本的样式设置
              normal: {
                show: true, // 单个拐点文本的样式设置。[ default: false ]
                position: 'top', // 标签的位置。[ default: top ]
                distance: 2, // 距离图形元素的距离。当 position 为字符描述值（如 'top'、'insideRight'）时候有效。[ default: 5 ]
                color: '#6692e2', // 文字的颜色。如果设置为 'auto'，则为视觉映射得到的颜色，如系列色。[ default: "#fff" ]
                fontSize: 14, // 文字的字体大小
                formatter: function (params) {
                  return params.value
                }
              }
            },
            itemStyle: {
              normal: {
                //图形悬浮效果
                borderColor: '#00c2ff',
                borderWidth: 2.5
              }
            }
            // lineStyle: {
            //     normal: {
            //         opacity: 0.5// 图形透明度
            //     }
            // }
          }
        ]
      }
    ]
  }
}
const initChart4 = () => {
  if (state.myChart4 == null) {
    state.myChart4 = markRaw(
      echarts.init(document.getElementById('capabilityAssessment'))
    )
  }
  state.myChart4.setOption(state.capabilityAssessmentOption)
  window.addEventListener('resize', function () {
    state.myChart4.resize()
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('capabilityAssessment'), function () {
    nextTick(() => {
      state.myChart4.resize()
    })
  })
}
const colors = ['#A098FC', '#4386FA', '#4FADFD', '#0CD3DB', '#646CF9']
const makeDamageEffectOption = (value) => {
  return {
    backgroundColor: 'rgba(0,0,0,0)',
    color: colors,
    title: {
      show: false,
      text: '目标毁伤效果',
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
          formatter: value + '%',
          fontSize: 18,
          color: '#A098FC',
          fontWeight: 'bold'
        },

        data: [
          {
            value: value,
            name: '完成',
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
          },
          {
            value: 100 - value,
            name: '未完成',
            itemStyle: { color: '#282c40' }
          }
        ].sort((a, b) => b.value - a.value), //数组从大到小排序

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
            value: value,
            name: '完成',
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
          },
          {
            value: 100 - value,
            name: '未完成',
            itemStyle: { color: '#282c40' }
          }
        ].sort((a, b) => b.value - a.value), //数组从大到小排序

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
  }
}
const initChart5 = () => {
  if (state.myChart5 == null) {
    state.myChart5 = echarts.init(document.getElementById('damageEffect'))
  }
  state.myChart5.setOption(state.damageEffectOption)
  window.addEventListener('resize', function () {
    state.myChart5.resize()
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('damageEffect'), function () {
    nextTick(() => {
      state.myChart5.resize()
    })
  })
}
//获取圆上面某点的坐标(x0,y0表示坐标，r半径，angle角度)
const getCirlPoint = (x0, y0, r, angle) => {
  let x1 = x0 + r * Math.cos((angle * Math.PI) / 180)
  let y1 = y0 + r * Math.sin((angle * Math.PI) / 180)
  return {
    x: x1,
    y: y1
  }
}

let angle = reactive(0)
const draw = () => {
  angle = angle + 3
  state.myChart1.setOption(state.targetDamageOption, true)
  state.myChart5.setOption(state.damageEffectOption, true)
  //window.requestAnimationFrame(draw);
}
let timerId = reactive(null)
const curChartData = () => {
  if (
    store.state.curSceneName == '无人侦察体系推演' ||
    store.state.curSceneName == '有人无人海空联合作战'
  ) {
    state.targetDamageOption = makeTargetDamageOption(80)
    state.sustainedEffectOption = makeSustainedEffectOption([220, 182, 0, 0])
    state.strikeCompletionRateOption = makeStrikeCompletionRateOption(90)
    state.capabilityAssessmentOption = makeCapabilityAssessmentOption([
      32, 32, 28, 28, 27, 15
    ])
    state.damageEffectOption = makeDamageEffectOption(50)
    state.ammunitionConsumption = 200
    state.tableData = [
      {
        droneLoss: '20',
        lossOfMannedAircraft: '3',
        potentialCasualties: '少'
      }
    ]
  } else if (
    store.state.curSceneName == '有人抵近侦察推演' ||
    store.state.curSceneName == '传统有人海空联合作战'
  ) {
    state.targetDamageOption = makeTargetDamageOption(60)
    state.sustainedEffectOption = makeSustainedEffectOption([220, 182, 134, 0])
    state.strikeCompletionRateOption = makeStrikeCompletionRateOption(20)
    state.capabilityAssessmentOption = makeCapabilityAssessmentOption([
      13, 12, 15, 18, 18, 30
    ])
    state.damageEffectOption = makeDamageEffectOption(20)
    state.ammunitionConsumption = 100
    state.tableData = [
      {
        droneLoss: '/',
        lossOfMannedAircraft: '5',
        potentialCasualties: '多'
      }
    ]
  }

  initChart1()
  initChart2()
  initChart3()
  initChart4()
  initChart5()
}
watch(
  () => store.state.curSceneName,
  (newValue, oldValue) => {
    curChartData()
  }
)
onMounted(() => {
  curChartData()
  draw()
  setTimeout(function () {
    if (timerId) {
      clearInterval(timerId)
    }
    timerId = setInterval(function () {
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
.strike-test {
  width: 100%;
  height: 100%;
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  box-sizing: border-box;

  .test-both {
    width: 30%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .both-info {
      height: 33%;
      width: 100%;
      padding: 10px 10px 0;
      box-sizing: border-box;

      .info-title {
        color: #fff;
        width: 50%;
        background-image: url('@/assets/image/sysMonitor/titlebg.png');
        background-size: 100% 50%;
        background-position: bottom;
        background-repeat: no-repeat;

        p {
          text-align: left;
          font-size: 16px;
          margin: 0 10px;
        }
      }

      .info-content {
        height: calc(100% - 21px);
        display: flex;
        overflow-x: auto;
        justify-content: center;

        .echart-style {
          width: 100%;
          height: 100%;
        }

        .desc_content {
          // width: 50%;
          display: flex;
          flex-direction: column;
          justify-content: space-evenly;
          font-size: 24px;
          color: #8fd4ec;

          .content_num {
            font-family: 'digit';
            font-size: 30px;
            font-style: italic;
            color: white;
          }
        }

        :deep(.el-table) {
          background: rgba(0, 0, 0, 0);
          color: white;
        }

        :deep(.el-table thead) {
          color: white;
          background: #387ca6;
        }

        :deep(.el-table tr) {
          background: rgba(0, 0, 0, 0);
        }

        :deep(.el-table__body tr.el-table__row--striped td) {
          background-color: rgba(17, 33, 111, 0.5);
        }

        :deep(.el-table__body tr:hover > td) {
          background-color: rgb(2, 26, 70, 1) !important;
        }
      }
    }
  }

  .test-center {
    width: 40%;
    height: 100%;
    padding: 10px;
    box-sizing: border-box;

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

      .echart-style {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
