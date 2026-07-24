<template>
  <div style="display: flex; width: 100%; height: 100%">
    <div class="flex_com">
      <div style="height: 50%">
        <div class="title_chart">目标发现率</div>
        <div id="targetPie"></div>
      </div>
      <div style="height: 50%">
        <div class="title_chart">侦察响应能力</div>
        <div class="zcXy">
          <div class="text_sty_bg">{{ state.text }}</div>
          <div class="text_zcXy">响应侦察能力</div>
        </div>
      </div>
    </div>
    <div class="flex_com" style="height: 100%">
      <div class="title_chart">侦察能力综合对比</div>
      <div id="zcAllChart"></div>
    </div>
    <div class="flex_com">
      <div style="height: 50%">
        <div class="title_chart">侦察效费比</div>
        <div id="zcXfChart"></div>
      </div>
      <div style="height: 50%">
        <div class="title_chart">综合侦察能力</div>
        <div id="zhZcChart"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, nextTick, watch } from 'vue'
import * as echarts from 'echarts'
import elementResizeDetectorMaker from 'element-resize-detector'
import store from '@/store/index'
const props = defineProps({
  name: String
})
const colorList = ['#0090ff', '#06d3c4']
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
  option1: {
    title: [
      {
        text: '90%',
        x: 'center',
        y: 'center',
        textStyle: {
          fontWeight: 'normal',
          color: '#3BA1FF',
          fontSize: 30
        },
        itemGap: 220
      }
    ],
    angleAxis: {
      show: false,

      // max: (getmax * 360) / 270, //-45度到225度，二者偏移值是270度除360度
      type: 'value',
      startAngle: 90, //极坐标初始角度
      splitLine: {
        show: false
      }
    },
    barMaxWidth: 20, //圆环宽度
    radiusAxis: {
      show: false,

      type: 'category'
    },
    //圆环位置和大小
    polar: {
      center: ['50%', '50%'],
      radius: '120%'
    },
    series: [
      {
        type: 'bar',
        animation: true,
        animationDelay: 2000,
        data: [
          {
            //上层圆环，显示数据

            value: 90,

            itemStyle: {
              color: '#1598FF'
            }
          }
        ],

        barGap: '-100%', //柱间距离,上下两层圆环重合

        coordinateSystem: 'polar',

        roundCap: true, //顶端圆角

        z: 3 //圆环层级，同zindex
      },

      {
        //下层圆环，显示最大值

        type: 'bar',

        data: [
          {
            value: 100,

            itemStyle: {
              color: '#1598FF',

              opacity: 0.2,

              borderWidth: 0
            }
          }
        ],

        barGap: '-100%',

        coordinateSystem: 'polar',

        roundCap: true,

        z: 1
      }
    ]
  },
  option2: {
    backgroundColor: 'transparent',
    color: ['#3D91F7', '#f9cf67'],
    tooltip: {
      show: false // 弹层数据去掉
    },
    legend: {
      icon: 'roundRect',
      // left: '47%',
      top: '10%',
      show: true,
      padding: [3, 5],
      // right: '50',
      y: '1',
      center: 0,
      itemWidth: 20,
      itemHeight: 10,
      itemGap: 26,
      z: 3,
      // orient: 'horizontal',
      data: ['无人', '有人'],
      textStyle: {
        fontSize: 12,
        color: '#F1F7FF'
      }
    },
    radar: {
      center: ['50%', '50%'], // 外圆的位置
      radius: '50%',
      name: {
        textStyle: {
          color: '#fff',
          fontSize: 14,
          fontWeight: 400,
          fontFamily: 'PingFangSC-Regular,PingFang SC',
          fontStyle: 'normal'
        }
      },
      // TODO:
      indicator: [
        {
          name: '目标发现能力',
          max: 35
        },
        {
          name: '信息更新速度',
          max: 35
        },
        {
          name: '时敏MBZC能力',
          max: 35
        },
        {
          name: '侦察效费比',
          max: 35
        },
        {
          name: '侦察响应能力',
          max: 35
        },
        {
          name: '侦察情报质量',
          max: 35
        }
      ],
      splitArea: {
        // 坐标轴在 grid 区域中的分隔区域，默认不显示。
        show: true,
        areaStyle: {
          //     // 分隔区域的样式设置。
          color: ['transparent'] // 分隔区域颜色。分隔区域会按数组中颜色的顺序依次循环设置颜色。默认是一个深浅的间隔色。
        }
      },
      axisLine: {
        // 指向外圈文本的分隔线样式
        lineStyle: {
          color: 'rgba(255,255,255,0.2)'
        }
      },
      splitLine: {
        lineStyle: {
          type: 'solid',
          color: '#1781BA', // 分隔线颜色
          width: 1 // 分隔线线宽
        }
      }
    },
    series: [
      {
        type: 'radar',
        symbolSize: 5,
        data: [
          {
            // TODO:
            value: [32, 32, 28, 28, 27, 30],
            name: '无人',
            areaStyle: {
              normal: {
                color: {
                  type: 'radial',
                  x: 0.5,
                  y: 0.5,
                  r: 0.5,
                  colorStops: [
                    {
                      offset: 0,
                      color: 'rgba(46,203,255, 0.14)' // 0% 处的颜色
                    },
                    {
                      offset: 0.15,
                      color: 'rgba(46,203,255, 0.14)' // 100% 处的颜色
                    },
                    {
                      offset: 0.75,
                      color: 'rgba(46,203,255, 0.4)' // 100% 处的颜色
                    },
                    {
                      offset: 1,
                      color: 'rgba(46,203,255, 0.5)' // 100% 处的颜色
                    }
                  ],
                  global: false // 缺省为 false
                }
              }
            },
            itemStyle: {
              // 折线拐点标志的样式。
              normal: {
                // 普通状态时的样式
                lineStyle: {
                  width: 1
                },
                opacity: 0.3
              },
              emphasis: {
                // 高亮时的样式
                lineStyle: {
                  width: 5
                },
                opacity: 0
              }
            }
          }
        ]
      }
    ]
  },
  option3: {
    backgroundColor: 'transparent',
    tooltip: {
      formatter: function (param) {
        if (param.data.type == null) {
          return param.data.name + ':' + param.value + '%'
        } else {
          return param.data.type + ':' + param.value + '%'
        }
      }
    },
    legend: {
      textStyle: {
        color: '#fff'
      }
    },
    series: [
      {
        name: '无人',
        type: 'pie',
        radius: [0, '80%'],
        label: {
          position: 'inner',
          color: '#fff',
          itemStyle: {
            color: '#fff'
          }
        },
        itemStyle: {
          normal: {
            borderColor: 'rgba(0,0,0,0.2)',
            borderWidth: 2,
            color: function (params) {
              return colorList[params.dataIndex]
            }
          }
        },

        // selectedMode: "single",
        data: [
          {
            value: 30,
            name: '毁伤'
          },
          {
            value: 70,
            name: '生存'
          }
        ]
      }
    ]
  },
  option4: {
    backgroundColor: 'rgba(0,0,0,0)',
    color: ['#8B5CFF', '#00CA69'],
    legend: {
      show: false,
      top: 20
    },
    // tooltip: {
    //     trigger: "axis",
    //     formatter: function (params) {
    //         let html = "";
    //         params.forEach((v) => {
    //             html += `<div style="color: #666;font-size: 14px;line-height: 24px">
    //         <span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${["#8B5CFF", "#00CA69"][v.componentIndex]
    //                 };"></span>
    //         ${v.seriesName}2020.${v.name}
    //         <span style="color:${["#8B5CFF", "#00CA69"][v.componentIndex]
    //                 };font-weight:700;font-size: 18px;margin-left:5px">${v.value
    //                 }</span>
    //         万元`;
    //         });
    //         return html;
    //     },
    //     extraCssText:
    //         "background: #fff; border-radius: 0;box-shadow: 0 0 3px rgba(0, 0, 0, 0.2);color: #333;",
    //     axisPointer: {
    //         //   type: "shadow",
    //         shadowStyle: {
    //             color: "#ffffff",
    //             shadowColor: "rgba(225,225,225,1)",
    //             shadowBlur: 5,
    //         },
    //     },
    // },
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
  },
  text: '实时'
})
onMounted(() => {
  // console.log(store.state.curSceneName)
  // nextTick(()=>{
  //     setTimeout(()=>{
  //         curChartData()
  //     },200)
  // })
})
const initChart1 = () => {
  let myChart1 = echarts.init(document.getElementById('targetPie'))
  myChart1.setOption(state.option1)
  window.addEventListener('resize', function () {
    myChart1.resize({
      animation: {
        duration: 2800
        //   easing: 'cubicInOut',
        // delay: 500,
      }
    })
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('targetPie'), function () {
    nextTick(() => {
      myChart1.resize({
        animation: {
          duration: 2800
          //   easing: 'cubicInOut',
          // delay: 500,
        }
      })
    })
  })
}
const initChart2 = () => {
  let myChart2 = echarts.init(document.getElementById('zcAllChart'))
  myChart2.setOption(state.option2)
  console.log(myChart2)
  window.addEventListener('resize', function () {
    myChart2.resize({
      animation: {
        duration: 2800
        //   easing: 'cubicInOut',
        // delay: 500,
      }
    })
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('zcAllChart'), function () {
    nextTick(() => {
      myChart2.resize({
        animation: {
          duration: 2800
          //   easing: 'cubicInOut',
          // delay: 500,
        }
      })
    })
  })
}
const initChart3 = () => {
  let myChart3 = echarts.init(document.getElementById('zcXfChart'))
  myChart3.setOption(state.option3)
  window.addEventListener('resize', function () {
    myChart3.resize({
      animation: {
        duration: 2800
        //   easing: 'cubicInOut',
        // delay: 500,
      }
    })
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('zcXfChart'), function () {
    nextTick(() => {
      myChart3.resize({
        animation: {
          duration: 2800
          //   easing: 'cubicInOut',
          // delay: 500,
        }
      })
    })
  })
}
const initChart4 = () => {
  let myChart4 = echarts.init(document.getElementById('zhZcChart'))
  myChart4.setOption(state.option4)
  window.addEventListener('resize', function () {
    myChart4.resize({
      animation: {
        duration: 2800,
        easing: 'cubicOut'
        // delay: 500,
      }
    })
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('zhZcChart'), function () {
    nextTick(() => {
      myChart4.resize({
        animation: {
          duration: 2800,
          easing: 'cubicOut',
          delay: 500
        }
      })
    })
  })
}
const curChartData = () => {
  if (
    store.state.curSceneName == '有人抵近侦察推演' ||
    store.state.curSceneName == '传统有人海空联合作战'
  ) {
    state.option1.title[0].text = '70%'
    state.option1.series[0].data[0].value = 70
    state.text = '延迟30s'
    state.option2.series[0].data[0] = {
      // TODO:
      value: [13, 12, 15, 18, 18, 25],
      name: '有人',
      areaStyle: {
        normal: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(255, 127,0, 0.14)' // 0% 处的颜色
              },
              {
                offset: 0.15,
                color: 'rgba(255, 127,0, 0.14)' // 100% 处的颜色
              },
              {
                offset: 0.75,
                color: 'rgba(2255, 127,0, 0.4)' // 100% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(255, 127,0, 0.5)' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        }
      },
      itemStyle: {
        // 折线拐点标志的样式。
        normal: {
          // 普通状态时的样式
          lineStyle: {
            width: 1
          },
          opacity: 0.3
        },
        emphasis: {
          // 高亮时的样式
          lineStyle: {
            width: 5
          },
          opacity: 0
        }
      }
    }
    state.option3.series[0].data = [
      {
        value: 50,
        name: '毁伤'
      },
      {
        value: 50,
        name: '生存'
      }
    ]
  } else if (
    store.state.curSceneName == '无人侦察体系推演' ||
    store.state.curSceneName == '有人无人海空联合作战'
  ) {
    state.option1.title[0].text = '90%'
    state.option1.series[0].data[0].value = 90
    state.text = '实时'
    state.option2.series[0].data[0] = {
      // TODO:
      value: [32, 32, 28, 28, 27, 30],
      name: '无人',
      areaStyle: {
        normal: {
          color: {
            type: 'radial',
            x: 0.5,
            y: 0.5,
            r: 0.5,
            colorStops: [
              {
                offset: 0,
                color: 'rgba(46,203,255, 0.14)' // 0% 处的颜色
              },
              {
                offset: 0.15,
                color: 'rgba(46,203,255, 0.14)' // 100% 处的颜色
              },
              {
                offset: 0.75,
                color: 'rgba(46,203,255, 0.4)' // 100% 处的颜色
              },
              {
                offset: 1,
                color: 'rgba(46,203,255, 0.5)' // 100% 处的颜色
              }
            ],
            global: false // 缺省为 false
          }
        }
      },
      itemStyle: {
        // 折线拐点标志的样式。
        normal: {
          // 普通状态时的样式
          lineStyle: {
            width: 1
          },
          opacity: 0.3
        },
        emphasis: {
          // 高亮时的样式
          lineStyle: {
            width: 5
          },
          opacity: 0
        }
      }
    }
    state.option3.series[0].data = [
      {
        value: 30,
        name: '毁伤'
      },
      {
        value: 70,
        name: '生存'
      }
    ]
  }
  initChart1()
  initChart2()
  initChart3()
  initChart4()
}
watch(
  () => store.state.curSceneName,
  (newValue, oldValue) => {
    console.log(newValue)
    curChartData()
  }
)
watch(
  () => props.name,
  (newValue, oldValue) => {
    console.log(newValue)
    if (newValue == 'seven') {
      curChartData()
    }
    //
  }
)
</script>

<style lang="less" scoped>
.title_chart {
  color: #fff;
  // margin-bottom: 10px;
  width: 50%;
  // height: 10px;
  background-image: url('@/assets/image/sysMonitor/titlebg.png');
  background-size: 100% 50%;
  background-position: bottom;
  background-repeat: no-repeat;
  font-size: 16px;
  text-align: left;
  padding-left: 10px;
}

.flex_com {
  flex: 1;
}

#targetPie,
#zcXfChart,
#zhZcChart {
  width: 400px;
  height: 267px;
}

.zcXy {
  height: calc(100% - 21px);
  font-size: 18px;
  color: #fff;
  display: flex;
  flex-direction: column;
  justify-content: center;
  letter-spacing: 2px;
  align-items: center;
}

.text_zcXy {
  margin-top: 40px;
  color: #1ec5f3;
}

#zcAllChart {
  width: 400px;
  height: 555px;
}

.text_sty_bg {
  background-image: url('@/assets/image/bt_默认.png');
  background-size: 100% 100%;
  background-position: top;
  background-repeat: no-repeat;
  height: 100px;
  font-size: 24px;
  padding-top: 10px;
  text-shadow: #1ec5f3;
  width: 200px;
}
</style>
