<template>
  <div id="dataStatistics">
    <header>
      <span>实验基础数据统计</span>
      <el-icon @click="emits('close')" class="icon">
        <Close />
      </el-icon>
    </header>
    <div style="padding: 10px">
      <div class="searchBox">
        <span>请选择统计时间段：</span>
        <el-date-picker
          v-model="state.selectDate"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          style="width: 200px"
        />
        <el-button type="primary" size="mini">查询</el-button>
      </div>
      <div class="chartsBox">
        <div id="chart_pie"></div>
        <div id="chart_bar"></div>
      </div>
      <el-table :data="state.tableData" height="180" style="width: 100%">
        <el-table-column prop="dataName" label="数据名称" align="center" />
        <el-table-column
          prop="createTime"
          label="数据录入时间"
          align="center"
        />
        <el-table-column prop="dataType" label="数据类型" align="center" />
        <el-table-column
          prop="experimentalQuantity"
          label="实验量"
          width="80"
          align="center"
        />
        <el-table-column
          prop="uuseName"
          label="数据录入人"
          width="120"
          align="center"
        />
        <el-table-column
          prop="updateTime"
          label="数据更新时间"
          align="center"
        />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { Close } from '@element-plus/icons-vue'
import * as echarts from 'echarts'

const emits = defineEmits(['close'])

const state = reactive({
  visible: false,
  selectDate: [],
  chart_bar: null,
  chart_pie: null,
  tableData: [
    {
      dataName: '无人机飞行轨迹数据',
      createTime: '2024-01-01 08:00:00',
      dataType: '实时动态数据',
      experimentalQuantity: 50,
      uuseName: '李明',
      updateTime: '2024-01-01 09:30:00'
    },
    {
      dataName: '传感器网络状态数据',
      createTime: '2024-01-02 10:30:00',
      dataType: '监测反馈数据',
      experimentalQuantity: 35,
      uuseName: '王丽',
      updateTime: '2024-01-02 11:45:00'
    },
    {
      dataName: '虚拟环境参数配置数据',
      createTime: '2024-01-03 14:15:00',
      dataType: '静态配置数据',
      experimentalQuantity: 20,
      uuseName: '张伟',
      updateTime: '2024-01-03 15:30:00'
    },
    {
      dataName: '气象监测传感器数据',
      createTime: '2024-01-04 13:20:00',
      dataType: '环境监测数据',
      experimentalQuantity: 42,
      uuseName: '陈华',
      updateTime: '2024-01-04 14:05:00'
    },
    {
      dataName: '武器装备性能测试数据',
      createTime: '2024-01-05 09:45:00',
      dataType: '装备评估数据',
      experimentalQuantity: 28,
      uuseName: '赵刚',
      updateTime: '2024-01-05 11:10:00'
    },
    {
      dataName: '通信链路质量检测数据',
      createTime: '2024-01-06 15:30:00',
      dataType: '通信保障数据',
      experimentalQuantity: 33,
      uuseName: '孙颖',
      updateTime: '2024-01-06 16:45:00'
    }
  ]
})

const chart_bar = () => {
  if (state.chart_bar == null) {
    state.chart_bar = echarts.init(document.getElementById('chart_bar'))
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
  if (state.chart_pie == null) {
    state.chart_pie = echarts.init(document.getElementById('chart_pie'))
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
}

onMounted(() => {
  chart_bar()
  chart_pie()
})
</script>

<style lang="less" scoped>
#dataStatistics {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 800px;
  height: 600px;
  background-color: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  color: #ffffff;
  z-index: 1;
  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    font-size: 16px;
    font-weight: bold;
    padding: 10px;
    border-bottom: 1px solid #ffffff;

    .icon {
      cursor: pointer;
    }
  }

  .searchBox {
    display: flex;
    justify-content: center;
    align-items: center;
    :deep(.el-input__inner) {
      color: #ffffff;
    }
    :deep(.el-input__wrapper) {
      background-color: transparent;
      box-shadow: 0 0 0 1px rgba(129, 211, 248, 1) inset;
    }
    :deep(.el-button) {
      background-color: transparent;
      border-color: rgba(129, 211, 248, 1);
    }
  }

  .chartsBox {
    height: 300px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin: 10px 0;
    div {
      height: 100%;
    }
    #chart_pie {
      width: 300px;
      // background-color: #ffffff;
    }
    #chart_bar {
      width: 450px;
      // background-color: #cccccc;
    }
  }
  :deep(.el-table) {
    background-color: transparent;
    color: #ffffff;
    thead {
      color: #ffffff;
    }
    tr,
    th {
      background-color: transparent;
    }
    tr:hover {
      td.el-table__cell {
        background-color: rgba(129, 211, 248, 0.1);
      }
    }
  }
}
</style>
