<!--
 * @Author:杜千存 duqiancun@piesat.cn
 * @Date: 2024-05-15 10:25:47
 * @LastEditors: 杜千存 duqiancun@piesat.cn
 * @LastEditTime: 2024-12-10 15:43:47
 * @FilePath: \MSIMEarthSysN\src\views\combatSimulation\hooks\axisEcharts.vue
 * @Description:
-->
<template>
  <div
    class="pie-echart"
    id="doubleEchartsAxis"
    style="width: 260px; height: 230px"
  ></div>
</template>
<script setup>
import * as echarts from 'echarts'
import { useStore } from 'vuex'
import { onMounted, reactive, watch, nextTick } from 'vue'

const store = useStore()

let vueData = reactive({
  nameArr: [],
  seriesData: []
})

const getEcharts = () => {
  let option = {
    title: {
      text: '',
      subtext: ''
    },
    tooltip: {
      trigger: 'axis'
    },
    legend: {
      data: ['已规划', '未规划', '损毁'],
      //data: vueData.nameArr,
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
    toolbox: {
      show: true,
      feature: {
        saveAsImage: { show: true }
      }
    },
    calculable: true,
    xAxis: [
      {
        type: 'category',
        //  data: ['电子', '红外', '高光谱', 'SAR', '可见光'],
        data: vueData.nameArr,
        axisLabel: {
          textStyle: {
            color: '#fff' // 修改x轴刻度文本颜色为绿色
          }
        }
      }
    ],
    yAxis: [
      {
        type: 'value',
        axisLabel: {
          textStyle: {
            color: '#fff' // 修改x轴刻度文本颜色为绿色
          }
        }
      }
    ],
    series: vueData.seriesData
    //  series: [
    //    {
    //      name: '',
    //      type: 'bar',
    //      data: [162.2, 32.6, 20.0, 6.4, 3.3],
    //      markPoint: {
    //        data: [
    //          { type: 'max', name: 'Max' },
    //          { type: 'min', name: 'Min' }
    //        ]
    //      }
    //    },
    //    {
    //      name: 'Evaporation',
    //      type: 'bar',
    //      data: [182.2, 48.7, 18.8, 6.0, 2.3]
    //    }
    //  ]
  }

  let myChart = echarts.init(document.getElementById('doubleEchartsAxis'))

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}
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
    let bar1 = newVal.bar1 || {}
    vueData.nameArr = bar1.data1
    if (!bar1.data2) return false
    for (let i = 0; i < bar1.data2.length; i++) {
      vueData.seriesData.push({
        type: 'bar',
        name: bar1.data2[i].name,
        data: bar1.data2[i].data,
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        }
      })
    }
    nextTick(() => {
      getEcharts()
    })
  },
  // { deep: true }
  { deep: true, immediate: true }
)
onMounted(() => {
  // getEcharts()
})
</script>

<style lang="less" scoped>
:deep(.pie-echart) {
  //border: 1px solid #387ca6;
  width: 100%;
}
</style>
