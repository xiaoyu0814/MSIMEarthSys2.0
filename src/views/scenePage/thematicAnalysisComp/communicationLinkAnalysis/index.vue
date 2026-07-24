<template>
  <div id="communicationLinkAnalysis">
    <header style="font-size: 20px; padding: 10px 0">通信链路分析</header>
    <div class="top">
      <div class="chart">
        <!-- <p>红方 蓝方</p> -->
        <div id="chart_tree" style="width: 100%; height: calc(100%)"></div>
      </div>
      <div class="chart">
        <!-- <p>通信情况</p> -->
        <el-table
          :data="state.tableData"
          style="width: 100%"
          height="360"
          :header-cell-style="{
            color: 'white',
            backgroundColor: 'rgba(0,0,0,0)'
          }"
        >
          <el-table-column prop="timestamp" label="时间" />
          <el-table-column prop="node_name" label="节点名称" />
          <el-table-column prop="node_ip" label="节点IP" />
          <el-table-column prop="target_node" label="目标节点" />
          <el-table-column prop="link_type" label="链路类型" />
        </el-table>
      </div>
    </div>
    <div class="bottom">
      <div class="chart" id="CLA_chart_pie"></div>
      <div class="chart" id="CLA_chart_bar"></div>
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
      timestamp: '00:01:00',
      node_name: '红方总指挥终端',
      node_ip: '192.168.1.100',
      target_node: '前线指挥所A',
      protocol: '军用加密协议v2.3',
      signal_strength: -45,
      latency_ms: 12,
      link_type: '光纤主干',
      encryption_status: 'AES-256',
      data_volume_kbps: 850
    },
    {
      timestamp: '00:01:02',
      node_name: '红方总指挥终端',
      node_ip: '192.168.1.100',
      target_node: '无人机控制中心',
      protocol: 'SATCOM-7',
      signal_strength: -68,
      latency_ms: 320,
      link_type: '卫星中继',
      encryption_status: '量子密钥',
      data_volume_kbps: 210
    },
    {
      timestamp: '00:01:05',
      node_name: '红方总指挥终端',
      node_ip: '192.168.1.100',
      target_node: '电子战单元B',
      protocol: '跳频扩频',
      signal_strength: -72,
      latency_ms: 85,
      link_type: '微波定向',
      encryption_status: '动态混淆',
      data_volume_kbps: 150,
      jamming_status: '抗干扰模式'
    },
    {
      timestamp: '00:01:08',
      node_name: '红方总指挥终端',
      node_ip: '192.168.1.100',
      target_node: '装甲集群指挥车',
      protocol: '战术数据链TDL-12',
      signal_strength: -55,
      latency_ms: 45,
      link_type: '短波电台',
      encryption_status: '端到端加密',
      data_volume_kbps: 320
    },
    {
      timestamp: '00:01:10',
      node_name: '红方总指挥终端',
      node_ip: '192.168.1.100',
      target_node: '防空雷达站',
      protocol: '数据链Link-16',
      signal_strength: -60,
      latency_ms: 28,
      link_type: '军用微波',
      encryption_status: 'AES-512',
      data_volume_kbps: 420
    },
    {
      timestamp: '00:01:12',
      node_name: '红方总指挥终端',
      node_ip: '192.168.1.100',
      target_node: '特种作战小队',
      protocol: '低截获概率(LPI)通信',
      signal_strength: -80,
      latency_ms: 150,
      link_type: '超短波战术电台',
      encryption_status: '动态密钥',
      data_volume_kbps: 95
    },
    {
      timestamp: '00:01:15',
      node_name: '红方总指挥终端',
      node_ip: '192.168.1.100',
      target_node: '海军舰艇指挥中心',
      protocol: '卫星通信(SATCOM)',
      signal_strength: -70,
      latency_ms: 280,
      link_type: '舰载数据链',
      encryption_status: '国密算法SM4',
      data_volume_kbps: 380
    },
    {
      timestamp: '00:01:18',
      node_name: '红方总指挥终端',
      node_ip: '192.168.1.100',
      target_node: '后勤保障中心',
      protocol: '军用Wi-Fi 6',
      signal_strength: -50,
      latency_ms: 18,
      link_type: '战术局域网',
      encryption_status: 'WPA3-Enterprise',
      data_volume_kbps: 520
    },
    {
      timestamp: '00:01:20',
      node_name: '红方总指挥终端',
      node_ip: '192.168.1.100',
      target_node: '空中预警机',
      protocol: '数据链Link-22',
      signal_strength: -65,
      latency_ms: 110,
      link_type: '机载中继',
      encryption_status: '量子抗破解',
      data_volume_kbps: 290
    },
    {
      timestamp: '00:01:22',
      node_name: '红方总指挥终端',
      node_ip: '192.168.1.100',
      target_node: '导弹发射单元',
      protocol: '抗干扰数据链',
      signal_strength: -58,
      latency_ms: 35,
      link_type: '定向微波',
      encryption_status: '动态密钥分发',
      data_volume_kbps: 180
    },
    {
      timestamp: '00:01:25',
      node_name: '红方总指挥终端',
      node_ip: '192.168.1.100',
      target_node: '网络战中心',
      protocol: 'IPSec VPN',
      signal_strength: -42,
      latency_ms: 22,
      link_type: '光纤专线',
      encryption_status: '国密算法SM2',
      data_volume_kbps: 640
    },
    {
      timestamp: '00:01:28',
      node_name: '红方总指挥终端',
      node_ip: '192.168.1.100',
      target_node: '侦察无人机群',
      protocol: '低可观测通信',
      signal_strength: -75,
      latency_ms: 90,
      link_type: '蜂群自组网',
      encryption_status: '动态跳频加密',
      data_volume_kbps: 230
    },
    {
      timestamp: '00:01:30',
      node_name: '红方总指挥终端',
      node_ip: '192.168.1.100',
      target_node: '战略支援部队',
      protocol: '高保密专线',
      signal_strength: -48,
      latency_ms: 15,
      link_type: '地下光缆',
      encryption_status: '多层混合加密',
      data_volume_kbps: 750
    }
  ]
})

const chart_tree = () => {
  if (state.chart_tree == null) {
    state.chart_tree = echarts.init(document.getElementById('chart_tree'))
  }
  // 指定图表的配置项和数据
  var option = {
    tooltip: {},
    animationDuration: 3000,
    animationEasingUpdate: 'quinticInOut',
    series: [
      {
        name: '通信链路分析',
        type: 'graph',
        layout: 'force',
        force: {
          repulsion: 300
        },
        data: [
          // 核心通信节点
          {
            name: '主通信中心',
            symbolSize: 70,
            category: '核心节点',
            value: 100
          },
          {
            name: '区域通信枢纽',
            symbolSize: 60,
            category: '核心节点',
            value: 95
          },
          // 传输链路
          {
            name: '海底光缆链路',
            symbolSize: 35,
            category: '传输链路',
            value: 90
          },
          {
            name: '高空微波链路',
            symbolSize: 30,
            category: '传输链路',
            value: 85
          },
          {
            name: '卫星中继链路',
            symbolSize: 30,
            category: '传输链路',
            value: 80
          },
          // 协议标准
          {
            name: 'SDN 协议',
            symbolSize: 35,
            category: '协议标准',
            value: 85
          },
          {
            name: 'MPLS 协议',
            symbolSize: 30,
            category: '协议标准',
            value: 80
          },
          {
            name: '5G 空口协议',
            symbolSize: 25,
            category: '协议标准',
            value: 75
          },
          // 接入设备
          {
            name: '5G 基站集群',
            symbolSize: 45,
            category: '接入设备',
            value: 80
          },
          {
            name: 'Wi-Fi 6 接入点',
            symbolSize: 35,
            category: '接入设备',
            value: 70
          },
          {
            name: '光纤接入终端',
            symbolSize: 35,
            category: '接入设备',
            value: 70
          },
          // 安全防护
          {
            name: '链路加密网关',
            symbolSize: 25,
            category: '安全防护',
            value: 60
          },
          {
            name: '入侵检测系统',
            symbolSize: 20,
            category: '安全防护',
            value: 55
          },
          // 应用服务
          {
            name: '实时通信服务',
            symbolSize: 40,
            category: '应用服务',
            value: 75
          },
          {
            name: '高清视频流服务',
            symbolSize: 35,
            category: '应用服务',
            value: 70
          }
        ],
        links: [
          // 核心节点连接
          {
            source: '主通信中心',
            target: '区域通信枢纽'
          },
          // 传输链路连接
          {
            source: '主通信中心',
            target: '海底光缆链路'
          },
          {
            source: '区域通信枢纽',
            target: '高空微波链路'
          },
          {
            source: '区域通信枢纽',
            target: '卫星中继链路'
          },
          // 协议关联
          {
            source: 'SDN 协议',
            target: '主通信中心'
          },
          {
            source: 'MPLS 协议',
            target: '区域通信枢纽'
          },
          {
            source: '5G 空口协议',
            target: '5G 基站集群'
          },
          // 接入设备连接
          {
            source: '5G 基站集群',
            target: '区域通信枢纽'
          },
          {
            source: 'Wi-Fi 6 接入点',
            target: '光纤接入终端'
          },
          {
            source: '光纤接入终端',
            target: '海底光缆链路'
          },
          // 安全防护链路
          {
            source: '链路加密网关',
            target: '主通信中心'
          },
          {
            source: '入侵检测系统',
            target: '区域通信枢纽'
          },
          // 应用服务关联
          {
            source: '实时通信服务',
            target: 'SDN 协议'
          },
          {
            source: '高清视频流服务',
            target: 'MPLS 协议'
          },
          {
            source: '主通信中心',
            target: 'SDN 协议'
          },
          {
            source: '区域通信枢纽',
            target: 'MPLS 协议'
          }
        ],
        categories: [
          {
            name: '核心节点'
          },
          {
            name: '传输链路'
          },
          {
            name: '协议标准'
          },
          {
            name: '接入设备'
          },
          {
            name: '安全防护'
          },
          {
            name: '应用服务'
          }
        ],
        focusNodeAdjacency: true,
        roam: 'scale',
        label: {
          normal: {
            show: true,
            position: 'top',
            textStyle: {
              color: 'white'
            }
          }
        },
        lineStyle: {
          width: 10,
          normal: {
            color: 'source',
            curveness: 0.2, // 增加少量曲率更美观
            width: 2,
            type: 'solid'
          }
        },
        color: [
          '#5470C6', // 核心节点 - 蓝色
          '#91CC75', // 传输链路 - 绿色
          '#EE6666', // 协议标准 - 红色
          '#FAC858', // 接入设备 - 黄色
          '#73C0DE', // 安全防护 - 浅蓝
          '#3BA272' // 应用服务 - 深绿
        ]
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
  var option = {
    color: ['#FF4D4F', '#36CFC9', '#597EF7'], // 红（警报）、青（正常）、蓝（稳定）
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      formatter: function (params) {
        let result = params[0].axisValue + '<br/>'
        params.forEach((param) => {
          result += `${param.seriesName}: <strong>${param.value}</strong>${
            param.seriesIndex === 0
              ? 'ms'
              : param.seriesIndex === 1
              ? 'dBm'
              : 'kbps'
          }<br/>`
        })
        return result
      }
    },
    grid: {
      top: '20%',
      left: '0%',
      right: '10%',
      bottom: '5%',
      containLabel: true
    },
    legend: {
      data: ['通信延迟', '信号强度', '数据吞吐量'],
      textStyle: { color: '#FFF' } // 白色图例文字
    },
    xAxis: {
      type: 'category',
      data: [
        '00:01',
        '00:02',
        '00:03',
        '00:04',
        '00:05',
        '00:06',
        '00:07',
        '00:08',
        '00:09',
        '00:10'
      ],
      axisLine: { lineStyle: { color: '#6E7079' } },
      axisLabel: { color: '#FFF' }
    },
    yAxis: [
      {
        name: '延迟 (ms)',
        type: 'value',
        axisLine: { show: true, lineStyle: { color: '#FF4D4F' } },
        axisLabel: { color: '#FF4D4F' },
        splitLine: {
          lineStyle: { type: 'dashed', color: 'rgba(255,255,255,0.1)' }
        }
      },
      {
        name: '信号强度 (dBm)',
        type: 'value',
        position: 'right',
        axisLine: { show: true, lineStyle: { color: '#36CFC9' } },
        axisLabel: { color: '#36CFC9' },
        splitLine: { show: false }
      },
      {
        name: '数据量 (kbps)',
        type: 'value',
        position: 'right',
        offset: 60,
        axisLine: { show: true, lineStyle: { color: '#597EF7' } },
        axisLabel: { color: '#597EF7' },
        splitLine: { show: false }
      }
    ],
    series: [
      {
        name: '通信延迟',
        type: 'line',
        symbol: 'triangle',
        symbolSize: 10,
        lineStyle: { width: 3 },
        data: [12, 15, 8, 22, 18, 25, 30, 17, 13, 20],
        label: {
          show: true,
          position: 'top',
          color: '#FF4D4F',
          formatter: '{c}ms'
        }
      },
      {
        name: '信号强度',
        type: 'line',
        yAxisIndex: 1,
        symbol: 'diamond',
        symbolSize: 10,
        lineStyle: { width: 3 },
        data: [-45, -50, -55, -60, -62, -58, -65, -70, -68, -60],
        label: {
          show: true,
          position: 'bottom',
          color: '#36CFC9',
          formatter: '{c}dBm'
        }
      },
      {
        name: '数据吞吐量',
        type: 'bar',
        yAxisIndex: 2,
        barWidth: '20%',
        data: [850, 780, 920, 650, 730, 810, 680, 750, 880, 790],
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: 'rgba(89, 126, 247, 0.8)' },
            { offset: 1, color: 'rgba(89, 126, 247, 0.1)' }
          ])
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
    state.chart_pie = echarts.init(document.getElementById('CLA_chart_pie'))
  }
  var option = {
    // backgroundColor:'black',
    normal: {
      top: 200,
      left: 300,
      width: 500,
      height: 400,
      zIndex: 6,
      backgroundColor: ''
    },
    color: ['rgba(245, 166, 35, 1)', 'rgba(19, 173, 255, 1)'],
    tooltip: {
      show: true,
      trigger: 'item'
    },
    radar: {
      name: {
        show: false
      },
      center: ['80%', '50%'],
      radius: '80%',
      startAngle: 90,
      splitNumber: 4,
      shape: 'circle',
      splitArea: {
        areaStyle: {
          color: ['transparent']
        }
      },
      axisLabel: {
        show: false,
        fontSize: 18,
        color: '#fff',
        fontStyle: 'normal',
        fontWeight: 'normal'
      },
      axisLine: {
        show: true,
        lineStyle: {
          color: 'grey' //
        }
      },
      splitLine: {
        show: true,
        lineStyle: {
          color: 'grey' //
        }
      },
      indicator: [
        { name: '延迟(ms)', max: 100 },
        { name: '信号强度(dBm)', max: -30 }, // 负值范围
        { name: '带宽(Mbps)', max: 1000 },
        { name: '加密等级', max: 100 },
        { name: '抗干扰指数', max: 100 },
        { name: '链路稳定性', max: 100 }
      ]
    },
    series: [
      {
        name: '主通信链路',
        type: 'radar',
        symbol: 'circle',
        symbolSize: 10,
        areaStyle: {
          normal: {
            color: 'rgba(245, 166, 35, 0.4)'
          }
        },
        itemStyle: {
          color: 'rgba(245, 166, 35, 1)',
          borderColor: 'rgba(245, 166, 35, 0.3)',
          borderWidth: 10
        },
        lineStyle: {
          normal: {
            type: 'dashed',
            color: 'rgba(245, 166, 35, 1)',
            width: 2
          }
        },
        data: [[32, -55, 850, 90, 75, 92]]
      },
      {
        name: '备用链路',
        type: 'radar',
        symbol: 'circle',
        symbolSize: 10,
        itemStyle: {
          normal: {
            color: 'rgba(19, 173, 255, 1)',
            borderColor: 'rgba(19, 173, 255, 0.4)',
            borderWidth: 10
          }
        },
        areaStyle: {
          normal: {
            color: 'rgba(19, 173, 255, 0.5)'
          }
        },
        lineStyle: {
          normal: {
            color: 'rgba(19, 173, 255, 1)',
            width: 2,
            type: 'dashed'
          }
        },
        data: [[68, -72, 420, 60, 45, 63]]
      },
      {
        name: '通信节点类型',
        type: 'pie',
        center: ['20%', '50%'],
        radius: ['35%', '80%'],
        clockwise: false, //饼图的扇区是否是顺时针排布
        avoidLabelOverlap: false,
        label: {
          normal: {
            show: false,
            position: 'outter',
            formatter: function (parms) {
              return parms.data.legendname
            }
          }
        },
        labelLine: {
          normal: {
            length: 5,
            length2: 3,
            smooth: true
          }
        },
        data: [
          { value: 35, name: '指挥中心', itemStyle: { color: '#8d7fec' } },
          { value: 28, name: '无人机终端', itemStyle: { color: '#5085f2' } },
          { value: 20, name: '装甲电台', itemStyle: { color: '#e75fc3' } },
          { value: 12, name: '卫星终端', itemStyle: { color: '#f87be2' } },
          { value: 5, name: '电子战设备', itemStyle: { color: '#f2719a' } }
        ]
      },
      {
        name: '协议分布',
        type: 'pie',
        radius: '80%',
        center: ['50%', '50%'],
        clockwise: false,
        data: [
          {
            value: 40,
            name: '加密战术数据链',
            itemStyle: { color: '#00acee' }
          },
          { value: 30, name: '卫星通信', itemStyle: { color: '#52cdd5' } },
          { value: 15, name: '跳频电台', itemStyle: { color: '#79d9f1' } },
          { value: 10, name: '光纤专线', itemStyle: { color: '#a7e7ff' } },
          { value: 5, name: '自组网协议', itemStyle: { color: '#c8efff' } }
        ],
        label: {
          normal: {
            show: false,
            textStyle: {
              color: '#999',
              fontSize: 14
            }
          }
        },
        labelLine: {
          normal: {
            show: false
          }
        },
        itemStyle: {
          normal: {
            borderWidth: 4,
            borderColor: 'rgba(255,255,255,0.1)'
          },
          emphasis: {
            borderWidth: 0,
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)'
          }
        }
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
#communicationLinkAnalysis {
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
