<!-- 导调席位左侧兵力树 -->
<template>
  <!-- 树图 -->
  <div class="redRadar-container">
    <!-- <div style="position: absolute;top: 0;left: 0;width: 10px;height: 10px;" @click="handleClick">111</div> -->
    <div id="redRadar"></div>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import elementResizeDetectorMaker from 'element-resize-detector'
import { onMounted, reactive, nextTick, ref, watch } from 'vue'
import { getLeftForceResult } from '@/service/SSE.js'
import store from '@/store'
import { getResultReplay } from '@/service/replayTime'
const state = reactive({
  myEcharts: null,
  redAndBlueRadarOption: {}
})
/**
 * 设置画布大小自适应
 */
const makeOption = (data) => {
  return {
    series: [
      {
        type: 'tree',
        data: data,
        // edgeShape: "polyline", //链接线是折现还是曲线
        top: '0%',
        left: '-25%',
        bottom: '3%',
        right: '20%',
        symbolSize: 30,
        label: {
          position: 'bottom',
          // verticalAlign: "bottom",
          // align: "center",
          fontSize: 14,
          color: '#fff'
        },
        // offset:[10,0],
        // leaves: {
        //   label: {
        //     position: "right",
        //     verticalAlign: "middle",
        //     align: "left",
        //   },
        // },
        emphasis: {
          // focus: "descendant",
        },
        expandAndCollapse: true,
        animationDuration: 550,
        animationDurationUpdate: 750
      }
    ]
  }
}
const initEcharts = () => {
  state.myEcharts.setOption(state.redAndBlueRadarOption)
  window.addEventListener('resize', function () {
    state.myEcharts.resize()
  })
  // 第二层禁止展开收起
  state.myEcharts.on('mousedown', function (param) {
    state.myEcharts._chartsViews[0]._data.tree._nodes.find((item) => {
      if (item.name == param.name) {
        if (item.depth == 2) {
          item.isExpand = false
        }
      }
      return item.name == param.name
    })
  })
  let erd = elementResizeDetectorMaker()
  erd.listenTo(document.getElementById('redRadar'), function () {
    nextTick(() => {
      state.myEcharts.resize()
    })
  })
}
const getRedForceResult = () => {
  return new Promise((resolve, reject) => {
    if (store.state.sceneModule.isReplayType) {
      getResultReplay().then((res) => {
        state.redAndBlueRadarOption = makeOption([res.red.sideTypeJson])
        resolve(state.redAndBlueRadarOption)
      })
    } else {
      getLeftForceResult().then((res) => {
        state.redAndBlueRadarOption = makeOption([res.red.sideTypeJson])
        resolve(state.redAndBlueRadarOption)
      })
    }
  })
}
onMounted(async () => {
  await getRedForceResult()
  state.myEcharts = echarts.init(document.getElementById('redRadar'))
  initEcharts()
})
const handleClick = () => {
  pickSameName(state.redAndBlueRadarOption.series[0].data, 'qqq')
}
watch(
  () => store.state.sceneModule.pdTargetTreeData,
  (newValue, oldValue) => {
    console.log(newValue)
    pickSameName(
      state.redAndBlueRadarOption.series[0].data,
      newValue,
      'symbolPd'
    )
  }
)
const pickSameName = (option, name, type) => {
  state.redAndBlueRadarOption.series[0].data[0].children.map((i) => {
    i.children.map((ii) => {
      if (
        ii.children &&
        ii.children.find((iii) => {
          return iii.targetName == name
        })
      ) {
        ii.collapsed = false
      } else {
        ii.collapsed = true
      }
    })
  })
  option.map((item) => {
    if (item.targetName == name) {
      item.symbol = item[type]
      item.symbolSize = 50
      initEcharts()
      setTimeout(() => {
        item.symbolSize = 30
        initEcharts()
      }, 500)
      setTimeout(() => {
        item.symbolSize = 50
        initEcharts()
      }, 1000)
      setTimeout(() => {
        item.symbolSize = 30
        initEcharts()
      }, 1500)
      setTimeout(() => {
        item.symbolSize = 50
        initEcharts()
      }, 2000)
      setTimeout(() => {
        item.symbolSize = 30
        initEcharts()
      }, 2500)
      return
    } else {
      if (item.children) {
        pickSameName(item.children, name, type)
      }
    }
  })
}
</script>

<style lang="less" scoped>
.redRadar-container {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  // border: 1px solid #f53730;
  #redRadar {
    width: 15vw;
    // height: calc(44vh - 80px);
    height: 100%;
  }
}
</style>
