<template>
  <div id="dataStatisticalAnalysis">
    <ul class="searthBox">
      <li>
        <span>实验数据类型：</span>
        <el-select v-model="state.dataType" placeholder="请选择">
          <el-option
            v-for="(item, index) in state.dataTypeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </li>
      <li>
        <span>统计维度：</span>
        <el-select v-model="state.statisticalDimension" placeholder="请选择">
          <el-option
            v-for="(item, index) in state.statisticalDimensionList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </li>
      <li>
        <el-button type="primary" @click="chart_pie">统计</el-button>
      </li>
      <li>
        <el-button type="primary" @click="reset">重置</el-button>
      </li>
    </ul>
    <ul class="chartsBox">
      <li id="charts_bar"></li>
      <li id="charts_pie" v-if="state.pieBox_visible"></li>
    </ul>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import * as echarts from 'echarts'

const state = reactive({
  dataType: '',
  dataTypeList: [
    { label: '想定数据', value: '1' },
    { label: '任务规划数据', value: '2' },
    { label: '仿真过程数据', value: '3' },
    { label: '态势推演数据', value: '4' },
    { label: '裁决分析数据', value: '5' },
    { label: '导条评估数据', value: '6' }
  ],
  statisticalDimension: '',
  statisticalDimensionList: [
    { label: '数据属性', value: '1' },
    { label: '实验指标', value: '2' }
  ],
  chart_bar: null,
  chart_pie: null,
  pieBox_visible: false
})

const chart_bar = () => {
  if (state.chart_bar == null) {
    state.chart_bar = echarts.init(document.getElementById('charts_bar'))
  }
  var option = {
    grid: {
      top: '5%',
      right: '5%',
      left: '5%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: [
      {
        type: 'category',
        data: [
          '目标识别',
          '火力分配',
          '打击效果评估',
          '敌方防御系统',
          '火力支援请求',
          '二次打击准备',
          '指挥通信保障'
        ],
        axisLine: {
          lineStyle: {
            color: 'rgba(255,255,255,0.12)'
          }
        },
        axisLabel: {
          margin: 10,
          color: '#e2e9ff',
          textStyle: {
            fontSize: 14
          }
        }
      }
    ],
    yAxis: [
      {
        axisLabel: {
          formatter: '{value}',
          color: '#e2e9ff'
        },
        axisLine: {
          show: false
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(255,255,255,0.12)'
          }
        }
      }
    ],
    series: [
      {
        type: 'bar',
        data: [300, 450, 770, 203, 255, 188, 156],
        barWidth: '20px',
        itemStyle: {
          normal: {
            color: new echarts.graphic.LinearGradient(
              0,
              0,
              0,
              1,
              [
                {
                  offset: 0,
                  color: 'rgba(0,244,255,1)' // 0% 处的颜色
                },
                {
                  offset: 1,
                  color: 'rgba(0,77,167,1)' // 100% 处的颜色
                }
              ],
              false
            ),
            barBorderRadius: [30, 30, 30, 30],
            shadowColor: 'rgba(0,160,221,1)',
            shadowBlur: 4
          }
        },
        label: {
          normal: {
            show: false
          }
        }
      }
    ]
  }
  state.chart_bar.setOption(option)
  window.addEventListener('resize', function () {
    state.chart_bar.resize()
  })
}

const chart_pie = () => {
  state.pieBox_visible = true
  setTimeout(() => {
    if (state.chart_pie == null) {
      state.chart_pie = echarts.init(document.getElementById('charts_pie'))
    }
    var option = {
      color: [
        '#37a2da',
        '#32c5e9',
        '#9fe6b8',
        '#ffdb5c',
        '#ff9f7f',
        '#fb7293',
        '#e7bcf3',
        '#8378ea'
      ],
      // backgroundColor: '#0D2753',
      tooltip: {
        //雷达图的tooltip不会超出div，也可以设置position属性，position定位的tooltip 不会随着鼠标移动而位置变化，不友好
        confine: true,
        enterable: true //鼠标是否可以移动到tooltip区域内
      },
      grid: {
        position: 'center'
      },
      polar: {
        center: ['50%', '50%'], // 默认全局居中
        radius: '0%'
      },
      angleAxis: {
        min: 0,
        interval: 5,
        clockwise: false,
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        axisLine: {
          show: false
        },
        splitLine: {
          show: false
        }
      },
      radiusAxis: {
        min: 0,
        interval: 20,
        splitLine: {
          show: false
        }
      },
      series: [
        {
          name: '资源统计表',
          type: 'pie',
          radius: [20, '80%'],
          center: ['50%', '50%'],
          roseType: 'area',
          label: {
            show: true
          },
          data: [
            { value: 10, name: '无人机资源利用率' },
            { value: 5, name: '传感器网络延迟' },
            { value: 15, name: '虚拟环境负载率' },
            { value: 25, name: '仿真服务器状态' },
            { value: 20, name: '数据处理速率' },
            { value: 35, name: '模拟器运行效率' },
            { value: 30, name: '实时反馈延迟率' },
            { value: 40, name: '系统资源分配比例' }
          ]
        }
      ]
    }
    state.chart_pie.setOption(option)
    window.addEventListener('resize', function () {
      state.chart_pie.resize()
    })
  }, 0)
}

const reset = () => {
  state.pieBox_visible = false
  state.chart_pie = null
}

onMounted(() => {
  chart_bar()
})
</script>

<style lang="less" scoped>
#dataStatisticalAnalysis {
  .searthBox {
    display: flex;
    align-items: center;
    li {
      padding: 20px;
      padding-left: 0;
    }
  }

  .chartsBox {
    display: flex;
    justify-content: space-between;
    align-items: center;

    #charts_bar {
      width: 70%;
      height: 550px;
      // background-color: aqua;
    }
    #charts_pie {
      width: 30%;
      height: 550px;
      // background-color: orange;
    }
  }

  :deep(.el-input__wrapper) {
    background-color: transparent;
    box-shadow: 0 0 0 1px #81d3f8 inset;
    .el-input__inner {
      color: #ffffff;
    }
  }
}
</style>
