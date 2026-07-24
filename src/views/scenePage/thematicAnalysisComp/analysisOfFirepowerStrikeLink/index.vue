<template>
  <div id="analysisOfFirepowerStrikeLink">
    <header style="font-size: 20px; padding: 10px 0">火力打击链路分析</header>
    <div style="display: flex; height: calc(100% - 30px - 20px); width: 100%">
      <div class="left">
        <div class="table_box">
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
            <el-table-column prop="target" label="接收" />
            <el-table-column prop="action" label="指挥" />
          </el-table>
        </div>
        <div class="chart" id="CLA_chart_bar"></div>
      </div>
      <div class="right">
        <div class="chart" id="CLA_chart_line"></div>
        <div class="chart" id="CLA_chart_pie"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'
import * as echarts from 'echarts'
import flyRed from '@/assets/image/billboard/flyred.png'
import flyblue from '@/assets/image/billboard/flyblue.png'
import { useStore } from 'vuex'
const store = useStore()
watch(
  () => store.state.sceneModule.sceneBid,
  (newValue, oldValue) => {
    console.log('123')
  }
)
const state = reactive({
  chart: null,
  data: null,
  chart_bar: null,
  chart_line: null,
  CLA_chart_pie: null,
  tableData: [
    {
      date: '00:01',
      name: '红方侦察机',
      action: '空中侦察',
      target: '敌方装甲部队'
    },
    {
      date: '00:05',
      name: '蓝方雷达站',
      action: '追踪目标',
      target: 'T-72坦克群'
    },
    {
      date: '00:10',
      name: '红方导弹部队',
      action: '精确打击',
      target: '敌方装甲指挥中心'
    },
    {
      date: '00:15',
      name: '蓝方战斗机',
      action: '拦截增援',
      target: '敌方空中支援部队'
    },
    {
      date: '00:20',
      name: '红方无人机',
      action: '侦察部署',
      target: '敌方防空系统'
    },
    {
      date: '00:25',
      name: '蓝方电子战部队',
      action: '信号干扰',
      target: '敌方雷达系统'
    },
    {
      date: '00:30',
      name: '红方火炮部队',
      action: '火力打击',
      target: '敌方后勤补给线'
    },
    {
      date: '00:35',
      name: '蓝方导弹艇',
      action: '海上攻击',
      target: '敌方沿海雷达站'
    },
    {
      date: '00:40',
      name: '红方网络战部队',
      action: '系统渗透',
      target: '敌方指挥通信网络'
    },
    {
      date: '00:45',
      name: '蓝方隐身战斗机',
      action: '远程打击',
      target: '敌方导弹发射架'
    },
    {
      date: '00:50',
      name: '红方电子情报飞机',
      action: '信号监测',
      target: '敌方通信网络'
    },
    {
      date: '00:55',
      name: '蓝方导弹防御系统',
      action: '拦截攻击',
      target: '敌方弹道导弹'
    },
    {
      date: '01:00',
      name: '红方特种部队',
      action: '突袭行动',
      target: '敌方指挥节点'
    }
  ],
  imgred: flyRed,
  imgblue: flyblue
})

const chart_bar = () => {
  if (state.chart_bar == null) {
    state.chart_bar = echarts.init(document.getElementById('CLA_chart_bar'))
  }
  var option = {
    grid: {
      top: '5%',
      right: '0',
      left: '0',
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
            fontSize: 10
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

const chart_line = () => {
  if (state.chart_tree == null) {
    state.chart_tree = echarts.init(document.getElementById('CLA_chart_line'))
  }
  var option = {
    // backgroundColor: "#0f375f",
    color: ['rgba(15,179,243,0.3)', 'rgba(23,216,161,0.3)'],
    grid: {
      top: '5%',
      right: '5%',
      left: '5%',
      bottom: '5%',
      containLabel: true
    },
    xAxis: {
      axisLine: {
        //  改变x轴颜色
        lineStyle: {
          color: '#26D9FF'
        }
      },
      axisLabel: {
        //  改变x轴字体颜色和大小
        textStyle: {
          color: 'rgba(250,250,250,0.6)',
          fontSize: 16
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.2)'
        }
      }
    },
    yAxis: {
      axisLine: {
        //  改变y轴颜色
        lineStyle: {
          color: '#26D9FF'
        }
      },
      axisLabel: {
        //  改变y轴字体颜色和大小
        //formatter: '{value} m³ ', //  给y轴添加单位
        textStyle: {
          color: 'rgba(250,250,250,0.6)',
          fontSize: 16
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(255,255,255,0.2)'
        }
      }
    },
    series: [
      {
        itemStyle: {
          borderColor: '#0FC5F3',
          borderWidth: 2,
          shadowColor: '#0FC5F3',
          shadowBlur: 10
        },
        symbolSize: 22,
        data: [
          [10.0, 8.04],
          [8.0, 6.95],
          [13.0, 7.58],
          [9.0, 8.81],
          [11.0, 8.33],
          [14.0, 9.96],
          [6.0, 7.24],
          [4.0, 4.26],
          [12.0, 10.84],
          [7.0, 4.82],
          [5.0, 5.68]
        ],
        type: 'scatter'
      },
      {
        itemStyle: {
          borderColor: '#17D8A1',
          borderWidth: 2,
          shadowColor: '#17D8A1',
          shadowBlur: 10
        },
        symbolSize: 22,
        data: [
          [9.0, 5.04],
          [11.0, 7.95],
          [12.0, 8.58],
          [5.0, 11.81],
          [7.0, 12.33],
          [11.0, 7.96],
          [7.0, 9.24],
          [6.0, 8.26],
          [10.0, 11.84],
          [7.0, 3.82],
          [6.0, 4.68]
        ],
        type: 'scatter'
      }
    ]
  }
  state.chart_tree.setOption(option)
  window.addEventListener('resize', function () {
    state.chart_tree.resize()
  })
}

const chart_pie = () => {
  if (state.chart_pie == null) {
    state.chart_pie = echarts.init(document.getElementById('CLA_chart_pie'))
  }
  let data = {
    title: '图谱',
    dataName: ['歼击机1', '运输机', '歼击机2', '侦察机'],
    dataLink: [
      ['歼击机1', '运输机', 40, 1, '通讯'],
      ['运输机', '歼击机1', 40, 2, '侦察'],
      ['歼击机1', '运输机', 40, 3, '攻击'],
      ['歼击机2', '侦察机', 40, 3, '攻击'],
      ['侦察机', '歼击机2', 40, 2, '侦察']
    ],
    color: [
      '#4CB7F2',
      '#458FF0',
      '#F5B751',
      '#70C6A2',
      '#70649A',
      '#4F726C',
      '#E58980',
      '#BC9F77',
      '#EDC7C7',
      '#B55D4C',
      '#69A8A0',
      '#4CB7F2',
      '#458FF0',
      '#F5B751',
      '#70C6A2',
      '#B28ECC',
      '#68A79F',
      '#E58980',
      '#BC9F77',
      '#EDC7C7',
      '#E19665',
      '#8AA38A'
    ]
  }
  var { title, dataName, dataLink, color } = data
  var le = data.size || dataName.length
  if (le == 2) {
    var symbolSize = 60
    var xIndex = ['1', '2']
    var yIndex = ['1', '2']
  } else if (le == 3) {
    var symbolSize = 62
    var xIndex = ['100', '80', '120']
    var yIndex = ['80', '95', '95']
  } else if (le == 4) {
    var symbolSize = 59
    var xIndex = ['3', '1', '3', '1']
    var yIndex = ['1', '2', '3', '4']
  }
  function getDate() {
    let _data = []
    for (var i = 0, le = dataName.length; i < le; i++) {
      _data.push({
        name: dataName[i],
        symbol: 'image://' + (i % 2 == 0 ? state.imgred : state.imgblue),
        symbolSize: symbolSize,
        x: xIndex[i],
        y: yIndex[i],
        label: { position: i == dataName.length - 1 ? 'top' : 'bottom' }
      })
    }
    return _data
  }
  function getLinks() {
    let _data = []
    var num = 0
    var xishu = 0.2
    for (var i = 0, le = dataLink.length; i < le; i++) {
      if (i % 2 != 0) {
        num++
      }
      var curveness = num * xishu
      _data.push({
        source: dataLink[i][0],
        target: dataLink[i][1],
        lineStyle: {
          normal: {
            opacity: 0.9,
            width: dataLink[i][2] * 0.1,
            curveness: curveness,
            color: color[dataLink[i][3] - 1]
          }
        },
        value: dataLink[i][4],
        ignoreForceLayout: true
      })
    }
    return _data
  }
  var option = {
    series: [
      {
        type: 'graph',
        layout: 'none',
        label: {
          normal: {
            show: true
          }
        },
        edgeSymbol: ['circle', 'arrow'],
        // edgeSymbolSize: [0, 0],
        edgeLabel: {
          normal: {
            show: true,
            textStyle: {
              fontSize: 12
            },
            formatter: '{c}'
          }
        },
        data: getDate(),
        links: getLinks()
      }
    ]
  }

  state.chart_pie.setOption(option)
  window.addEventListener('resize', function () {
    state.chart_pie.resize()
  })
}

onMounted(() => {
  chart_line()
  chart_bar()
  chart_pie()
})
</script>

<style lang="less" scoped>
#analysisOfFirepowerStrikeLink {
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

  .left {
    height: 100%;
    width: 50%;
    // display: flex;
    // justify-content: space-between;

    .table_box {
      height: calc(70% - 17px);
      width: 100%;
    }

    .chart {
      height: 35%;
      width: 100%;
    }
  }

  .right {
    height: 100%;
    width: 50%;
    // display: flex;
    // justify-content: space-between;

    .chart {
      height: 50%;
      width: 100%;
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
