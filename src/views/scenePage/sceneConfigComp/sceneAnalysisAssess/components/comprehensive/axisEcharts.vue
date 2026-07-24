<!--
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-05-15 10:25:47
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2024-06-12 14:12:10
 * @FilePath: \MSIMEarthSysN\src\views\analysisAssess\components\axisEcharts.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- <div class="pie-echart" id="echartsAxis"></div> -->
  <div
    class="pie-echart"
    id="echartsAxis"
    style="width: 90%; height: calc(100% - 40px)"
  ></div>
</template>

<script setup>
import * as echarts from 'echarts'
import { useStore } from 'vuex'
import { onMounted, reactive, watch } from 'vue'

const store = useStore()

const vueData = reactive({
  dimensions: [],
  source: []
})

watch(
  () => store.getters.getAnalysisInfoData,
  (newVal) => {
    let situationAnalysis = newVal.comparison.ForceSize
    vueData.dimensions = situationAnalysis.dataset.dimensions
    vueData.source = situationAnalysis.dataset.source
    getEcharts()
  },
  { deep: true }
)
const getEcharts = () => {
  let option = {
    title: {
      // text: '兵力规模'
    },
    legend: {
      textStyle: {
        color: '#fff' // 这里设置颜色
      }
    },
    tooltip: {},
    dataset: {
      dimensions: vueData.dimensions,
      source: vueData.source
    },
    xAxis: {
      type: 'category',
      axisLabel: {
        color: '#fff'
      }
    },
    yAxis: {
      axisLabel: {
        color: '#fff'
      }
    },
    series: [
      {
        type: 'bar',
        barWidth: 30,
        itemStyle: {
          color: '#f56c6c' // 修改第一个柱状图的颜色为红色
        }
      },
      {
        type: 'bar',
        barWidth: 30,
        itemStyle: {
          color: '#409eff' // 修改第一个柱状图的颜色为蓝色
        }
      }
    ]
  }
  let myChart = echarts.init(document.getElementById('echartsAxis'))

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}
onMounted(() => {
  // getEcharts()
})
</script>

<style lang="less" scoped>
:deep(.pie-echart) {
  border: 1px solid #387ca6;
  width: 100%;
  height: calc(100% - 30px);
  margin-right: 6px;
}
</style>
