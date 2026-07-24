<!--
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-06-05 10:46:50
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2024-06-12 14:04:33
 * @FilePath: \MSIMEarthSysNHFY\src\views\scenePage\sceneConfigComp\sceneAnalysisAssess\components\comprehensive\radarEcharts.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- 初始 -->
  <div
    class="pie-echart"
    id="echartsRadar"
    style="width: 90%; height: calc(100% - 40px)"
  ></div>
  <!-- <div class="pie-echart" id="echartsRadar" style="width: 90%;height:220px"></div> -->
</template>

<script setup>
import * as echarts from 'echarts'
import { useStore } from 'vuex'
import { onMounted, reactive, watch } from 'vue'

const store = useStore()
const vueData = reactive({
  indicator: [],
  data: []
})

watch(
  () => store.getters.getAnalysisInfoData,
  (newVal) => {
    let situationAnalysis = newVal.situationAnalysis
    vueData.indicator = situationAnalysis.indicator
    vueData.data = situationAnalysis.data
    getEcharts()
  },
  { deep: true }
)
const getEcharts = () => {
  let option = {
    title: {
      text: ''
    },
    // color:['#f56c6c','#409eff'],
    legend: {
      show: true,
      data: ['红方', '蓝方'],
      textStyle: {
        color: '#fff' // 这里设置颜色
      },
      orient: 'horizontal', // 图例列表的布局朝向，'horizontal' 为水平,'vertical' 为垂直
      left: 'left' // 图例组件离容器左侧的距离
    },
    radar: {
      // shape: 'circle',
      indicator: vueData.indicator,
      name: {
        textStyle: {
          fontSize: 12,
          color: '#fff'
        }
      },
      splitArea: {
        areaStyle: {
          color: ['rgba(0, 20, 43, 0.2)'],
          shadowColor: 'rgba(0, 0, 0, 0.1)',
          shadowBlur: 10
        }
      }
    },
    series: [
      {
        name: '红方',
        type: 'radar',
        itemStyle: {
          color: '#f56c6c'
        },
        areaStyle: {
          color: '#f56c6c',
          opacity: 0.4
        },
        //data: [{ value: vueData.data[0].data }]
        data: [
          {
            value: vueData.data[0].value
          }
        ]
      },
      {
        name: '蓝方',
        type: 'radar',
        itemStyle: {
          color: '#409eff'
        },
        areaStyle: {
          color: '#409eff',
          opacity: 0.4
        },
        data: [
          {
            value: vueData.data[1].value
          }
        ]
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
</script>

<style lang="less" scoped></style>
