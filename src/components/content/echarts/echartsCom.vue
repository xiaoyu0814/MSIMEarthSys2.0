<!--
 * @Author: root you@example.com
 * @Date: 2024-08-13 16:28:08
 * @LastEditors: root you@example.com
 * @LastEditTime: 2024-08-21 17:28:57
 * @FilePath: \MSIMEarthSysN\src\components\content\echarts\echartsCom.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div :id="chartId"></div>
</template>

<script>
import {
  reactive,
  toRefs,
  ref,
  onMounted,
  onUnmounted,
  nextTick,
  watch
} from 'vue'
import * as echarts from 'echarts'

export default {
  name: 'chartCommon',
  props: {
    chartId: {
      type: String,
      default: 'chart11'
    },
    option: {
      type: Object,
      default: {}
    }
  },
  setup(props, ctx) {
    let echart = echarts
    onMounted(() => {
      setTimeout(() => {
        nextTick(() => {
          initChart()
        })
      }, 800)
    })

    onUnmounted(() => {
      echart.dispose
    })
    watch(props, (oldVale, newVale) => {
      nextTick(() => {
        initChart()
      })
    })
    const initChart = () => {
      let elementResizeDetectorMaker = require('element-resize-detector')
      let erd = elementResizeDetectorMaker()
      // console.log(ctx.echarts)
      const chartDom = document.getElementById(props.chartId)
      chartDom.style.width = '100%'
      chartDom.style.height = '100%'
      chartDom.style.auto = 'auto'
      let chart = echart.init(chartDom)
      // chart.showLoading()
      chart.clear()
      chart.setOption(props.option, true)
      // chart.hideLoading()
      window.onresize = function () {
        //自适应大小
      }
      setTimeout(() => {
        chart.resize()
      })
      erd.listenTo(document.getElementById(props.chartId), function (element) {
        nextTick(function () {
          //使echarts尺寸重置
          chart.resize()
        })
      })
    }

    return {
      initChart
    }
  }
}
</script>

<style lang="less" scoped>
.panel {
}
</style>
