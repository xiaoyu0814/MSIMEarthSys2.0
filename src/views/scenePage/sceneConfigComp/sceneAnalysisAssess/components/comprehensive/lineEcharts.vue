<!--
 * @Author: dunqiancun duqiancun@piesat.cn
 * @Date: 2024-05-15 10:00:16
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2024-06-12 14:14:04
 * @FilePath: \MSIMEarthSysN\src\views\analysisAssess\components\lineEcharts.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- 初始 -->
  <div
    class="pie-echart"
    id="echartsLine"
    style="width: 100%; height: calc(100% - 40px)"
  ></div>
  <!-- <div  class="pie-echart" id="echartsLine" style="width: 90%; height: 220px" ></div> -->
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, reactive, watch } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const vueData = reactive({
  xAxisData: [],
  seriesData: []
})

watch(
  () => store.getters.getAnalysisInfoData,
  (newVal) => {
    let situationAnalysis = newVal.situationAnalysis
    vueData.xAxisData = situationAnalysis.xAxisData
    vueData.seriesData = situationAnalysis.seriesData
    getEcharts()
  }
)
const getEcharts = () => {
  let option = {
    title: {
      text: '',
      textStyle: {
        color: '#fff' // 标题字体颜色
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      textStyle: {
        color: '#fff' // 这里设置颜色
      }
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
      data: vueData.xAxisData,
      axisLabel: {
        color: '#fff'
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#fff'
      }
    },
    //series: vueData.seriesData
    series: [
      {
        name: '红方',
        type: 'line',
        itemStyle: {
          color: '#f56c6c'
        },
        data: vueData.seriesData[0].data
      },
      {
        name: '蓝方',
        type: 'line',
        itemStyle: {
          color: '#409eff' // 修改第一个柱状图的颜色为蓝色
        },
        data: vueData.seriesData[1].data
      }
    ]
  }
  let myChart = echarts.init(document.getElementById('echartsLine'))

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}
onMounted(() => {})
</script>

<style lang="less" scoped></style>
