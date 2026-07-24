<!--
 * @Author:杜千存 duqiancun@piesat.cn
 * @Date: 2024-05-15 10:25:47
 * @LastEditors: 杜千存 duqiancun@piesat.cn
 * @LastEditTime: 2024-11-27 14:59:30
 * @FilePath: \MSIMEarthSysN\src\views\combatSimulation\hooks\lineEcharts.vue
 * @Description: 时效性-线图
-->
<template>
  <!-- 初始 -->
  <div
    class="pie-echart"
    id="echartsLine"
    style="width: 260px; height: 400px"
  ></div>
</template>

<script setup>
import { dataSource } from '@/utils/earthPlugin/scene/dataSource/dataSource'
import * as echarts from 'echarts'
import { onMounted, reactive, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const vueData = reactive({
  nameArr: [],
  seriesData: []
})

const getEcharts = () => {
  let option = {
    title: {
      text: ''
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      // data: ['0时', 'X时', 'X时', 'X时', 'X时'],
      data: vueData.nameArr,
      axisLabel: {
        textStyle: {
          color: '#fff' // 修改x轴刻度文本颜色为绿色
        }
      },
      textStyle: {
        color: '#fff' //
      },
      left: 10, // 距离左侧10像素
      top: 20 // 距离顶部20像素
      // 设置工具箱的位置
      // toolbox: {
      //     show: true,
      //     right: 10,        // 距离右侧10像素
      //     top: 20          // 距离顶部20像素
      // }
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      containLabel: true
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      // data: ['0时', 'x时', 'x时', 'x时', 'x时', 'x时', 'x时'],
      data: vueData.nameArr,
      axisLabel: {
        textStyle: {
          color: '#fff' // 修改x轴刻度文本颜色为绿色
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        textStyle: {
          color: '#fff' // 修改x轴刻度文本颜色为绿色
        }
      }
    },
    series: [...vueData.seriesData]
    // series: [
    //    {
    //      name: 'Direct',
    //      type: 'line',
    //     stack: 'Total',
    //     data: [320, 332, 301, 334, 390, 330, 320]
    //    },
    //   {
    //     name: 'Search Engine',
    //    type: 'line',
    //      stack: 'Total',
    //      data: [820, 932, 901, 934, 1290, 1330, 1320]
    //    }
    //  ]
  }
  let myChart = echarts.init(document.getElementById('echartsLine'))

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}
onMounted(() => {
  // getEcharts()
})
watch(
  () => store.getters.get_sampleEchartsData,
  (newVal) => {
    if (!newVal) {
      vueData.nameArr = []
      vueData.seriesData = []
      return false
    }
    vueData.nameArr = []
    vueData.dataArr = []
    let line = newVal.line || {}
    vueData.nameArr = line.data1
    if (!line.data2) return false
    for (let i = 0; i < line.data2.length; i++) {
      vueData.seriesData.push({
        name: line.data2[i].name,
        type: 'line',
        stack: 'Total',
        data: line.data2[i].data
      })
    }
    nextTick(() => {
      getEcharts()
    })
  },
  // { deep: true }
  { deep: true, immediate: true }
)
</script>

<style lang="less" scoped></style>
