<!--
 * @Author: dunqiancun duqiancun@piesat.cn
 * @Date: 2024-05-15 10:00:16
 * @LastEditors: ZX Li
 * @LastEditTime: 2024-05-31 13:34:56
 * @FilePath: \MSIMEarthSysN\src\views\analysisAssess\components\lineEcharts.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <!-- 初始 -->
  <div
    class="pie-echart"
    id="sitEchartsLine"
    style="width: 90%; height: calc(100% - 440px)"
  ></div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, reactive, watch, nextTick, defineProps } from 'vue'
import { useStore } from 'vuex'
const store = useStore()
const vueData = reactive({})

const getEcharts = () => {
  let option = {
    title: {
      // text: 'Temperature Change in the Coming Week'
      textStyle: {
        //文字颜色
        color: '#fff'
      }
    },
    legend: {
      textStyle: {
        color: '#fff' // 这里设置颜色
      }
    },
    tooltip: {
      trigger: 'axis'
    },
    toolbox: {
      show: true,
      feature: {
        dataZoom: {
          yAxisIndex: 'none'
        },
        dataView: { readOnly: false },
        magicType: { type: ['line', 'bar'] },
        restore: {},
        saveAsImage: {}
      }
    },
    xAxis: {
      type: 'category',
      boundaryGap: false,
      data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        formatter: '{value} '
      }
    },
    series: [
      {
        name: 'Highest',
        type: 'line',
        data: [10, 11, 13, 11, 12, 12, 9],
        markPoint: {
          data: [
            { type: 'max', name: 'Max' },
            { type: 'min', name: 'Min' }
          ]
        },
        markLine: {
          data: [{ type: 'average', name: 'Avg' }]
        }
      },
      {
        name: 'Lowest',
        type: 'line',
        data: [1, -2, 2, 5, 3, 2, 0],
        markPoint: {
          data: [{ name: '周最低', value: -2, xAxis: 1, yAxis: -1.5 }]
        },
        markLine: {
          data: [
            { type: 'average', name: 'Avg' },
            [
              {
                symbol: 'none',
                x: '90%',
                yAxis: 'max'
              },
              {
                symbol: 'circle',
                label: {
                  position: 'start',
                  formatter: 'Max'
                },
                type: 'max',
                name: '最高点'
              }
            ]
          ]
        }
      }
    ]
  }
  let myChart = echarts.init(document.getElementById('sitEchartsLine'))

  // 使用刚指定的配置项和数据显示图表。
  myChart.setOption(option)
}
onMounted(() => {
  nextTick(() => {
    getEcharts()
  })
})
</script>

<style lang="less" scoped></style>
