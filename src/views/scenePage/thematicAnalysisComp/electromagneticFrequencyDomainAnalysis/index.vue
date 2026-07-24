<template>
  <div id="electromagneticFrequencyDomainAnalysis">
    <header style="font-size: 20px; padding: 10px 0">电磁频域分析</header>
    <el-tabs
      v-model="state.activeName"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane label="频域" name="first">
        <frequencyDomain v-if="state.activeName == 'first'"></frequencyDomain>
      </el-tab-pane>
      <el-tab-pane label="时域" name="second">
        <timeDomain v-if="state.activeName == 'second'"></timeDomain>
      </el-tab-pane>
      <el-tab-pane label="空域" name="third">
        <spaceDomain v-if="state.activeName == 'third'"></spaceDomain>
      </el-tab-pane>
      <el-tab-pane label="能域" name="fourth">
        <energyDomain v-if="state.activeName == 'fourth'"></energyDomain>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { reactive, toRefs, onMounted, watch, nextTick } from 'vue'
import energyDomain from './energyDomain.vue'
import frequencyDomain from './frequencyDomain.vue'
import spaceDomain from './spaceDomain.vue'
import timeDomain from './timeDomain.vue'

const state = reactive({
  activeName: 'first'
})
</script>

<style lang="less" scoped>
#electromagneticFrequencyDomainAnalysis {
  position: absolute;
  top: 12%;
  left: 50%;
  transform: translate(-50%, 0%);
  z-index: 999;
  width: 1200px;
  //min-height:72%;
  height: calc(88vh - 220px);
  // background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-color: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  // padding-top: 20px;

  :deep(.el-tabs--border-card > .el-tabs__content) {
    padding: 0;
    height: calc(100% - 39px);

    .el-tab-pane {
      height: 100%;
    }
  }

  :deep(.el-tabs__item.is-top) {
    color: #fff;
    font-size: 16px;
  }

  :deep(.el-tabs__nav-scroll) {
    padding-left: 10px;
    box-sizing: border-box;
  }

  :deep(.demo-tabs) {
    height: calc(100%);
  }

  :deep(.el-tabs__content) {
    height: calc(100% - 40px);
    box-sizing: border-box;
  }

  :deep(.el-tabs__header) {
    margin: 0 !important;
  }

  :deep(.el-tab-pane) {
    height: 100%;
  }
}
</style>
