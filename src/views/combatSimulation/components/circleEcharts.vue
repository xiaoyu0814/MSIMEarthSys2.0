<!--
 * @Author: dunqiancun duqiancun@piesat.cn
 * @Date: 2024-05-15 10:00:16
 * @LastEditors: 杜千存 duqiancun@piesat.cn
 * @LastEditTime: 2024-12-11 14:36:15
 * @FilePath: \MSIMEarthSysN\src\views\analysisAssess\components\lineEcharts.vue
 * @Description: 侦查类型-雷达图
-->
<template>
  <!-- 初始 -->
  <div
    class="pie-echart"
    id="circleEcharts"
    style="width: 260px; height: 230px"
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
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true }
      }
    },
    legend: {
      data: ['', 'Actual Spending'],
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
    radar: {
      //   // shape: 'circle',
      indicator: vueData.nameArr
      //   indicator: [{
      //     name:'',max:5
      //   },{
      //     name:'',max:5
      //   },{
      //     name:'',max:5
      //   }]
    },
    series: vueData.seriesData
    // series: [{
    //   value:[1,0,0]
    // },
    // {
    //   value:[1,3,0]
    // }]
  }
  let myChart = echarts.init(document.getElementById('circleEcharts'))
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
    let radar = newVal.radar || {}
    if (!radar.data1) return false
    for (let i = 0; i < radar.data1.indicator.length; i++) {
      vueData.nameArr.push({
        name: radar.data1.indicator[i].name,
        max: radar.data1.indicator[i].max
      })
    }
    vueData.seriesData = radar.data2
    nextTick(() => {
      getEcharts()
    })
  },
  // { deep: true }
  { deep: true, immediate: true }
)
</script>

<style lang="less" scoped></style>
