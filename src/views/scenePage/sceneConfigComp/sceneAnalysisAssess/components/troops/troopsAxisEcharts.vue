<!--
 * @Author: dunqiancun duqiancun@piesat.cn
 * @Date: 2024-05-16 15:16:39
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2024-06-12 14:01:34
 * @FilePath: \MSIMEarthSysN\src\views\analysisAssess\components\troopsAxisEcharts.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- 初始 -->
  <div
    class="pie-echart"
    id="troopsEchartsAxis"
    style="width: 98%; height: calc(100% - 40px)"
  ></div>
</template>

<script setup>
import * as echarts from 'echarts'
import { useStore } from 'vuex'
import { onMounted, reactive, watch } from 'vue'
import { getBeginTroopsPA } from '@/service/analysisAssess.js'
const store = useStore()

const vueData = reactive({
  dimensions: [],
  source: []
})

const _getBeginTroopsPA = () => {
  getBeginTroopsPA({}).then((res) => {
    if (res.code != 200)
      ElMessage.warning(res.msg) || ElMessage.warning('网络错误，请稍后再试！')
    const dataset = res.data.dataset
    vueData.dimensions = dataset.dimensions
    vueData.source = dataset.source
    getEcharts()
  })
}

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
          color: '#409eff' // 修改第二个柱状图的颜色为蓝色
        }
      }
    ]
  }
  let myChart = echarts.init(document.getElementById('troopsEchartsAxis'))

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}
onMounted(() => {
  _getBeginTroopsPA()
})
</script>

<style lang="less" scoped>
:deep(.pie-echart) {
  border: 1px solid #387ca6;
  width: 50%;
  margin-right: 6px;
}
</style>
