<!--
 * @Author:杜千存 duqiancun@piesat.cn
 * @Date: 2024-05-15 10:25:47
 * @LastEditors: 杜千存 duqiancun@piesat.cn
 * @LastEditTime: 2024-11-27 14:39:12
 * @FilePath: \MSIMEarthSysN\src\views\combatSimulation\hooks\radarEcharts.vue
 * @Description: 时效性
-->
<template>
  <!-- 初始 -->
  <div
    class="pie-echart"
    id="echartsRadar"
    style="width: 260px; height: 230px"
  ></div>
</template>

<script setup>
import * as echarts from 'echarts'
import { useStore } from 'vuex'
import { onMounted, reactive, watch, nextTick } from 'vue'

const store = useStore()
const vueData = reactive({
  nameArr: [],
  seriesData: []
})

const getEcharts = () => {
  let option = {
    tooltip: {
      trigger: 'item',
      axisLabel: {
        textStyle: {
          color: '#fff' // 修改x轴刻度文本颜色为绿色
        }
      }
    },
    legend: {
      top: '5%',
      left: 'center',
      show: false,
      textStyle: {
        color: '#fff' // 修改x轴刻度文本颜色为绿色
      }
    },
    toolbox: {
      feature: {
        saveAsImage: {}
      }
    },
    series: [
      {
        // // name: '已完成',
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        axisLabel: {
          textStyle: {
            color: '#fff' // 修改x轴刻度文本颜色为绿色
          }
        },
        label: {
          show: false,
          position: 'center'
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 40,
            fontWeight: 'bold'
          }
        },
        labelLine: {
          show: false
        },
        //  data: [
        //    { value: 1048, name: '已完成' },
        //   { value: 735, name: '未完成' }
        //  ]
        data: vueData.seriesData
      }
    ]
  }
  let myChart = echarts.init(document.getElementById('echartsRadar'))
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
    vueData.seriesData = []
    let pie = newVal.pie || {}
    vueData.seriesData = pie.data1
    nextTick(() => {
      getEcharts()
    })
  },
  // { deep: true }
  { deep: true, immediate: true }
)
</script>

<style lang="less" scoped></style>
