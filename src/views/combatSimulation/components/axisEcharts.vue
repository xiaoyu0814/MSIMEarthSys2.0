<!--
 * @Author:杜千存 duqiancun@piesat.cn
 * @Date: 2024-05-15 10:25:47
 * @LastEditors: 杜千存 duqiancun@piesat.cn
 * @LastEditTime: 2024-12-11 15:03:45
 * @FilePath: \MSIMEarthSysN\src\views\combatSimulation\hooks\axisEcharts.vue
 * @Description:
-->
<template>
  <div
    class="pie-echart"
    id="echartsAxis"
    style="width: 260px; height: 400px"
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
    title: {
      text: '',
      textStyle: {
        color: '#fff' //
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true }
      }
    },
    legend: {
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
    xAxis: {
      type: 'category',
      axisLabel: {
        textStyle: {
          color: '#fff' // 修改x轴刻度文本颜色为绿色
        }
      },
      data: vueData.nameArr
      //  data: ['已规划', '未规划', '损毁']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        textStyle: {
          color: '#fff' // 修改x轴刻度文本颜色为绿色
        }
      }
    },
    //  series: [
    //    {
    //      data: [120, 200, 150],
    //      type: 'bar'
    //    }
    // ]
    series: vueData.seriesData
  }
  let myChart = echarts.init(document.getElementById('echartsAxis'))
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
    let bar2 = newVal.bar2 || {}
    vueData.nameArr = bar2.data1
    vueData.seriesData.push({
      data: bar2.data2,
      type: 'bar'
    })
    nextTick(() => {
      getEcharts()
    })
  },
  // { deep: true }
  { deep: true, immediate: true }
)
</script>

<style lang="less" scoped>
:deep(.pie-echart) {
  //border: 1px solid #387ca6;
  width: 100%;
}
</style>
