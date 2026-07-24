<!--
 * @description: 
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-07-05 16:54:58
 * @LastEditors: ZX Li
 * @LastEditTime: 2024-07-06 18:56:27
-->
<!-- 模拟器 -->
<template>
  <div class="simulator-Information">
    <el-tabs
      type="border-card"
      v-model="state.tabSelect"
      @tab-click="handleClick"
    >
      <el-tab-pane label="Y8" name="Y8">
        <div class="checkedOption">
          <simulatorIndex
            :curData="state.curData"
            v-if="state.tabSelect == 'Y8'"
          ></simulatorIndex>
        </div>
      </el-tab-pane>
      <el-tab-pane label="Y9" name="Y9">
        <div class="checkedOption">
          <simulatorIndex
            :curData="state.curData"
            v-if="state.tabSelect == 'Y9'"
          ></simulatorIndex>
        </div>
      </el-tab-pane>
      <el-tab-pane label="教10" name="教10">
        <div class="checkedOption">
          <simulatorIndex
            :curData="state.curData"
            v-if="state.tabSelect == '教10'"
          ></simulatorIndex>
        </div>
      </el-tab-pane>
      <el-tab-pane label="轰6H" name="轰6H">
        <div class="checkedOption">
          <simulatorIndex
            :curData="state.curData"
            v-if="state.tabSelect == '轰6H'"
          ></simulatorIndex>
        </div>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import * as echarts from 'echarts'
import { onMounted, reactive, nextTick, watch, markRaw, onUnmounted } from 'vue'
import simulatorIndex from './components/simulator/simulatorIndex.vue'
import emitter from '@/utils/eventbus'
const state = reactive({
  curData: {
    id: '13',
    name: 'Y8'
  },
  tabSelect: 'Y8'
})

//点击tab切换
const handleClick = (item) => {
  state.tabSelect = item.props.label
  state.curData = {
    name: item.props.label
  }
  if (item.props.name == 'Y8') {
    state.curData['id'] = '13'
  } else if (item.props.name == 'Y9') {
    state.curData['id'] = '12'
  } else if (item.props.name == '教10') {
    state.curData['id'] = '10'
  } else if (item.props.name == '轰6H') {
    state.curData['id'] = '15'
  }
}

onMounted(() => {
  window.shipAndMissileLabel = {}
})
</script>

<style lang="less" scoped>
.statistic-analysis .analysis-container .el-tabs--border-card {
  background: rgba(0, 0, 0, 0);
  border: none;
  height: 100% !important;
}

.simulator-Information {
  color: #fff;
  width: 100%;
  height: 100% !important;
}

:deep(.el-tabs__panel) {
  width: 80%;
}

:deep(.el-tabs__item) {
  color: #fff !important;
}

:deep(.el-tabs--left .el-tabs__nav-wrap.is-left::after) {
  width: 0;
}

:deep(.el-tabs--left .el-tabs__active-bar.is-left) {
  display: none;
}

:deep(.el-tabs__item.is-active) {
  color: #409eff !important;
}

:deep(.el-tabs__nav-wrap) {
  padding-top: 10px;
  box-sizing: border-box;
}

:deep(.el-form-item) {
  margin-right: 10px !important;
}

:deep(.el-tabs__header .el-tabs__item.is-active) {
  color: #fff !important;
}
</style>
