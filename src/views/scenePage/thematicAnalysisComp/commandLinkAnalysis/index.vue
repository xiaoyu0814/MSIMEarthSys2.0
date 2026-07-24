<template>
  <div id="commandLinkAnalysis">
    <header style="font-size: 20px; padding: 10px 0">指挥链路分析</header>
    <div class="top">
      <div class="chart">
        <!-- <p>指挥层级</p> -->
        <div id="chart_tree" style="width: 100%; height: calc(100%)"></div>
      </div>
      <div class="chart">
        <!-- <p>指令发送统计</p> -->
        <el-table
          :data="state.tableData"
          style="width: 100%"
          height="360"
          :header-cell-style="{
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0)'
          }"
        >
          <el-table-column prop="date" label="时间" width="180" />
          <el-table-column prop="name" label="发送" width="180" />
          <el-table-column prop="address" label="接收" />
          <el-table-column prop="address" label="指挥" />
        </el-table>
      </div>
    </div>
    <div class="bottom">
      <div class="chart" id="CLA_chart_bar"></div>
      <div class="chart" id="CLA_chart_pie"></div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import * as echarts from 'echarts'

const state = reactive({
  chart: null,
  data: null,
  chart_tree: null,
  chart_bar: null,
  chart_pie: null,
  tableData: [
    {
      date: '00:05',
      name: '红方指挥部',
      address: '野战训练基地',
      role: '战术指挥',
      status: '在线'
    },
    {
      date: '01:23',
      name: '侦察部门',
      address: '前沿观察哨',
      role: '情报收集',
      status: '离线'
    },
    {
      date: '02:45',
      name: '火力支援部',
      address: '火炮阵地',
      role: '火力支援',
      status: '在线'
    },
    {
      date: '03:10',
      name: '通信保障组',
      address: '红方通讯站',
      role: '信号传输',
      status: '离线'
    },
    {
      date: '04:25',
      name: '后勤补给部',
      address: '物资中转点',
      role: '资源调配',
      status: '在线'
    },
    {
      date: '05:35',
      name: '医疗救护队',
      address: '战地医院',
      role: '伤员救治',
      status: '离线'
    },
    {
      date: '06:12',
      name: '技术维护组',
      address: '指挥中心',
      role: '设备保障',
      status: '在线'
    },
    {
      date: '07:43',
      name: '运输车队',
      address: '补给线沿线',
      role: '物资运输',
      status: '离线'
    },
    {
      date: '08:29',
      name: '情报分析部',
      address: '指挥帐篷',
      role: '数据处理',
      status: '在线'
    },
    {
      date: '09:17',
      name: '通信中继站',
      address: '红方通讯塔',
      role: '信号转发',
      status: '在线'
    },
    {
      date: '10:32',
      name: '医疗支援队',
      address: '战地诊所',
      role: '辅助治疗',
      status: '离线'
    },
    {
      date: '11:48',
      name: '物资协调部',
      address: '补给中转站',
      role: '资源分配',
      status: '在线'
    },
    {
      date: '12:05',
      name: '技术保障组',
      address: '指挥中心',
      role: '技术支持',
      status: '离线'
    },
    {
      date: '13:21',
      name: '安全保卫部',
      address: '红方营地',
      role: '安全保障',
      status: '在线'
    }
  ]
})

const chart_tree = () => {
  if (state.chart_tree == null) {
    state.chart_tree = echarts.init(document.getElementById('chart_tree'))
  }
  const data = {
    name: '红方',
    children: [
      {
        name: '攻击群',
        children: [
          { name: '地面目标_1' },
          // { name: '地面目标_2' },
          { name: '九天无人机_1', value: 3322 }
          // { name: '九天无人机_2', value: 3322 },
        ]
      },
      // {
      //   name: '舰船',
      //   children: [
      //     { name: 'Carrier_1', value: 8833 },
      //   ]
      // },
      {
        name: '预警群',
        children: [
          { name: '可见光卫星', value: 4116 },
          { name: '卫星地面站', value: 4116 },
          { name: '空警500预警机', value: 4116 }
        ]
      },
      {
        name: '支援组',
        children: [
          { name: 'WZ-7-1', value: 2105 },
          // { name: 'WZ-7-2', value: 1316 },
          // { name: 'WZ-7-3', value: 3151 },
          { name: 'WZ-8-1', value: 3770 },
          // { name: 'WZ-8-2', value: 2435 },
          // { name: 'WZ-8-3', value: 4839 },
          { name: 'WZ-10-1', value: 1756 },
          // { name: 'WZ-10-2', value: 4268 },
          // { name: 'WZ-10-3', value: 1821 },
          { name: 'GJ-2-1', value: 5833 },
          // { name: 'GJ-2-2', value: 5833 },
          // { name: 'GJ-2-3', value: 5833 },
          { name: 'GJ-11-1', value: 5833 },
          { name: 'KVD-001_kvd-1', value: 5833 },
          { name: 'Z-10-1', value: 5833 }
        ]
      }
    ]
  }
  const data2 = {
    name: '蓝方',
    children: [
      {
        name: '空军',
        children: [
          {
            name: '北部飞行中队',
            children: [
              { name: 'F-16A战斗机_1', value: 7000 },
              { name: 'F-16A战斗机_2', value: 7000 },
              { name: 'F-16A战斗机_3', value: 7000 }
            ]
          },
          {
            name: '南部飞行中队',
            children: [
              { name: 'IDF战斗机_1', value: 6800 },
              { name: 'IDF战斗机_2', value: 6800 },
              { name: 'IDF战斗机_3', value: 6800 }
            ]
          },
          {
            name: '西部飞行中队',
            children: [
              { name: '幻影-2000战斗机_1', value: 7500 },
              { name: '幻影-2000战斗机_2', value: 7500 }
            ]
          },
          {
            name: '运输机',
            children: [
              { name: 'C-130运输机_1', value: 8500 },
              { name: 'C-130运输机_2', value: 8500 }
            ]
          }
        ]
      },
      {
        name: '防空系统',
        children: [
          { name: '爱国者导弹连_1', value: 9000 },
          { name: '爱国者导弹连_2', value: 9000 },
          { name: '天弓II导弹营_1', value: 8500 },
          { name: '天弓II导弹营_2', value: 8500 },
          { name: 'AN/TPS-59雷达站_1', value: 7000 },
          { name: 'AN/TPS-59雷达站_2', value: 7000 }
        ]
      },
      {
        name: '指挥中心',
        children: [
          { name: '北部防空指挥部', value: 10000 },
          { name: '南部防空指挥部', value: 10000 },
          { name: '中部作战指挥所', value: 9500 }
        ]
      }
    ]
  }
  var option = {
    tooltip: {
      trigger: 'item',
      triggerOn: 'mousemove'
    },
    legend: {
      top: '2%',
      left: '3%',
      orient: 'vertical',
      data: [
        {
          name: '红方',
          icon: 'rectangle'
        },
        {
          name: '蓝方',
          icon: 'rectangle'
        }
      ],
      borderColor: '#c23531',
      textStyle: {
        color: '#ffffff'
      }
    },
    color: ['#FF000', '#0000FF'],
    series: [
      {
        type: 'tree',
        name: '红方',
        data: [data],
        top: '5%',
        left: '7%',
        bottom: '45%',
        right: '10%',
        symbolSize: 7,
        label: {
          position: 'top',
          verticalAlign: 'middle',
          align: 'right',
          color: '#FFFFFF'
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        lineStyle: {
          color: '#FF0000'
        },
        itemStyle: {
          color: '#FF0000'
        }
      },
      {
        type: 'tree',
        name: '蓝方',
        data: [data2],
        top: '55%',
        left: '6%',
        bottom: '5%',
        right: '10%',
        symbolSize: 7,
        label: {
          position: 'top',
          verticalAlign: 'middle',
          align: 'right',
          color: '#FFFFFF'
        },
        leaves: {
          label: {
            position: 'right',
            verticalAlign: 'middle',
            align: 'left'
          }
        },
        lineStyle: {
          color: '#0000FF'
        },
        itemStyle: {
          color: '#0000FF'
        }
        // expandAndCollapse: true,
        // emphasis: {
        //   focus: 'descendant'
        // },
        // animationDuration: 550,
        // animationDurationUpdate: 750
      }
    ]
  }
  state.chart_tree.setOption(option)
  window.addEventListener('resize', function () {
    state.chart_tree.resize()
  })
}

const chart_bar = () => {
  if (state.chart_bar == null) {
    state.chart_bar = echarts.init(document.getElementById('CLA_chart_bar'))
  }
  var data = [
    {
      name: '传感器追踪',
      value: 80
    },
    {
      name: '火力打击',
      value: 87.8
    },
    {
      name: '电磁干扰',
      value: 71
    },
    {
      name: '网络通信',
      value: 80
    },
    {
      name: '任务关联',
      value: 66
    },
    {
      name: '雷达探测',
      value: 80
    }
  ]
  var xData = [],
    yData = []
  var min = 50
  data.map(function (a, b) {
    xData.push(a.name)
    if (a.value === 0) {
      yData.push(a.value + min)
    } else {
      yData.push(a.value)
    }
  })
  var option = {
    // backgroundColor: "#111c4e",
    color: ['#3398DB'],
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'line',
        lineStyle: {
          opacity: 0
        }
      },
      formatter: function (prams) {
        if (prams[0].data === min) {
          return '合格率：0%'
        } else {
          return '合格率：' + prams[0].data + '%'
        }
      }
    },
    grid: {
      left: '0%',
      right: '0%',
      bottom: '5%',
      top: '5%',
      containLabel: true,
      z: 22
    },
    xAxis: [
      {
        type: 'category',
        gridIndex: 0,
        data: xData,
        axisTick: {
          alignWithLabel: true
        },
        axisLine: {
          lineStyle: {
            color: '#0c3b71'
          }
        },
        axisLabel: {
          show: true,
          color: 'rgb(170,170,170)',
          fontSize: 12
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        gridIndex: 0,
        splitLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        min: min,
        max: 100,
        axisLine: {
          lineStyle: {
            color: '#0c3b71'
          }
        },
        axisLabel: {
          color: 'rgb(170,170,170)',
          formatter: '{value} %'
        }
      },
      {
        type: 'value',
        gridIndex: 0,
        min: min,
        max: 100,
        splitNumber: 12,
        splitLine: {
          show: false
        },
        axisLine: {
          show: false
        },
        axisTick: {
          show: false
        },
        axisLabel: {
          show: false
        },
        splitArea: {
          show: true,
          areaStyle: {
            color: ['rgba(250,250,250,0.0)', 'rgba(250,250,250,0.05)']
          }
        }
      }
    ],
    series: [
      {
        name: '合格率',
        type: 'bar',
        barWidth: '30%',
        xAxisIndex: 0,
        yAxisIndex: 0,
        itemStyle: {
          normal: {
            barBorderRadius: 30,
            color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
              {
                offset: 0,
                color: '#00feff'
              },
              {
                offset: 0.5,
                color: '#027eff'
              },
              {
                offset: 1,
                color: '#0286ff'
              }
            ])
          }
        },
        data: yData,
        zlevel: 11
      },
      {
        name: '背景',
        type: 'bar',
        barWidth: '50%',
        xAxisIndex: 0,
        yAxisIndex: 1,
        barGap: '-135%',
        data: [100, 100, 100, 100, 100, 100, 100],
        itemStyle: {
          normal: {
            color: 'rgba(255,255,255,0.1)'
          }
        },
        zlevel: 9
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
    state.chart_pie = echarts.init(document.getElementById('CLA_chart_pie'))
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
    radar: {
      name: {
        show: false,
        textStyle: {
          color: '#05D5FF',
          fontSize: 14
        }
      },
      shape: 'polygon',
      center: ['80%', '50%'],
      radius: '80%',
      startAngle: 120,
      scale: true,
      axisLine: {
        lineStyle: {
          color: 'rgba(5, 213, 255, .8)'
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          width: 1,
          color: 'rgba(5, 213, 255, .8)' // 设置网格的颜色
        }
      },
      indicator: [
        {
          name: '关键目标',
          max: 100
        },
        {
          name: '情报收集',
          max: 100
        },
        {
          name: '突袭行动',
          max: 100
        },
        {
          name: '战斗事件',
          max: 100
        },
        {
          name: '协同任务',
          max: 100
        },
        {
          name: '后勤保障',
          max: 100
        }
      ],
      splitArea: {
        show: false
      }
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
        name: '个人雷达图',
        type: 'radar',
        symbol: 'circle', // 拐点的样式，还可以取值'rect','angle'等
        symbolSize: 10, // 拐点的大小
        itemStyle: {
          normal: {
            color: '#05D5FF'
          }
        },
        areaStyle: {
          normal: {
            color: '#05D5FF',
            opacity: 0.5
          }
        },
        lineStyle: {
          width: 2,
          color: '#05D5FF'
        },
        label: {
          show: false,
          normal: {
            show: false,
            formatter: (params) => {
              return params.value
            },
            color: '#fff'
          }
        },
        data: [
          {
            value: [20, 50, 60, 60, 90, 80]
          }
        ]
      },
      {
        name: '',
        type: 'pie',
        selectedMode: 'single',
        radius: [0, '80%'],
        center: ['50%', '50%'],
        label: {
          normal: {
            show: false,
            position: 'inner',
            formatter: '{d}%',
            textStyle: {
              color: '#fff',
              fontWeight: 'normal',
              fontSize: 20
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        data: [
          {
            value: 85,
            name: '关键目标'
          },
          {
            value: 92,
            name: '核心指挥所'
          },
          {
            value: 76,
            name: '重要物资储备'
          },
          {
            value: 64,
            name: '医疗支援点'
          },
          {
            value: 89,
            name: '协同作战单元'
          },
          {
            value: 58,
            name: '敌方情报网络'
          },
          {
            value: 72,
            name: '战略预备队'
          },
          {
            value: 61,
            name: '后勤补给线'
          }
        ]
      },
      {
        name: '资源统计表',
        type: 'pie',
        radius: [20, '80%'],
        center: ['20%', '50%'],
        roseType: 'area',
        label: {
          show: false
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
  chart_tree()
  chart_bar()
  chart_pie()
})
</script>

<style lang="less" scoped>
#commandLinkAnalysis {
  position: absolute;
  top: 12%;
  left: 50%;
  transform: translate(-50%, 0%);
  z-index: 999;
  width: 1200px;
  //min-height:72%;
  height: calc(88vh - 220px);
  // background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-color: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;

  .top {
    height: 68%;
    width: 100%;
    display: flex;
    justify-content: space-between;

    .chart {
      height: 100%;
      width: 49%;
    }
  }

  .bottom {
    height: 30%;
    width: 100%;
    display: flex;
    justify-content: space-between;

    .chart {
      height: 100%;
      width: 49%;
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
</style>
