<template>
  <div class="statistic-analysis">
    <div class="analysis-container">
      <div class="formulate-title">
        <span>任务评估分析</span>
      </div>
      <img
        src="@/assets/image/panelIcons/关闭icon.png"
        alt=""
        class="close_sty"
        @click="handleClose"
      />
      <el-tabs type="border-card" v-model="state.activeName">
        <el-tab-pane label="总览" name="first">
          <overview v-if="state.activeName == 'first'"></overview>
        </el-tab-pane>
        <el-tab-pane label="战况战果分析" name="second">
          <campaignTactics
            v-if="state.activeName == 'second'"
          ></campaignTactics>
        </el-tab-pane>
        <el-tab-pane label="指挥控制分析" name="third">
          <commandControl v-if="state.activeName == 'third'"></commandControl>
        </el-tab-pane>
        <el-tab-pane label="装备效能分析" name="forth">
          <equipmentEfficiency
            v-if="state.activeName == 'forth'"
          ></equipmentEfficiency>
        </el-tab-pane>
        <el-tab-pane label="通信链路分析" name="fifth">Task</el-tab-pane>
        <el-tab-pane label="仿真系统分析" name="sixth">
          <simulationSystem
            v-if="state.activeName == 'sixth'"
          ></simulationSystem>
        </el-tab-pane>
        <el-tab-pane label="侦察分析评估" name="seven">
          <data-analysis :name="state.activeName"></data-analysis>
        </el-tab-pane>
        <el-tab-pane label="打击分析评估" name="eighth">
          <strikeTest v-if="state.activeName == 'eighth'"></strikeTest>
        </el-tab-pane>
        <el-tab-pane label="分析评估结果" name="nine">
          <!-- <data-analysis></data-analysis> -->
          <div style="padding: 10px">
            <div class="text_bg_sty">
              通过两案对比实验的数据分析，可以得出“无人+火力”联合目标精毁战法设计，在信息获取利用、目标毁伤效果效益方面具有明显优势。但在平台毁伤数量和弹药消耗上，还存在不足，应在完善战法概念中进一步优化。
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import overview from './overview.vue'
import campaignTactics from './campaignTactics.vue'
import commandControl from './commandControl.vue'
import equipmentEfficiency from './equipmentEfficiency.vue'
import simulationSystem from './simulationSystem.vue'
import dataAnalysis from './dataAnalysis.vue'
import strikeTest from './strikeTest.vue'
import emitter from '@/utils/eventbus'
import { reactive } from 'vue'

const state = reactive({
  activeName: 'first'
})
const handleClose = () => {
  emitter.emit('closeBottomControlPanel', 'three')
}
</script>

<style lang="less" scoped>
.statistic-analysis {
  position: absolute;
  top: 12%;
  left: 50%;
  transform: translate(-50%, 0%);
  z-index: 999;
  width: 1200px;
  //min-height:72%;

  height: calc(88vh - 220px);
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  .analysis-container {
    position: relative;
    width: 100%;
    height: 99.5%;
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;

    .close_sty {
      cursor: pointer;
      position: absolute;
      top: 10px;
      right: 10px;
      width: 20px;
      height: 20px;
    }

    .formulate-title {
      padding: 10px 0 10px 30px;
      box-sizing: border-box;
      text-align: center;
      // font-size: 18px;
      font-family: MFLiHei_Noncommercial-Regular;
      font-size: 25px;
      color: #ffffff;
      letter-spacing: 1.82px;
      font-weight: 400;
    }

    :deep(.el-tabs--border-card > .el-tabs__content) {
      padding: 0;
      height: calc(100% - 39px);
      .el-tab-pane {
        height: 100%;
      }
    }

    :deep(.el-tabs--border-card) {
      background: rgba(0, 0, 0, 0);
      border: none;
      height: calc(100% - 48px);
    }

    :deep(.el-tabs--border-card > .el-tabs__header) {
      background: rgba(0, 0, 0, 0);
    }

    :deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active) {
      background-color: #1092d5;
      border: none;
    }

    :deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item) {
      color: white;
    }

    :deep(.el-tabs__item:focus-visible) {
      box-shadow: none;
    }

    :deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item) {
      border: none;
    }
  }
}
.text_bg_sty {
  color: rgba(0, 231, 255, 1);
  transition: color ease-out 0.3s, text-shadow ease-out 0.3s;
  text-shadow: 0 0 1rem #0cf;
  padding: 10px;
  margin: 10px auto;
  background: rgba(0, 231, 255, 0.1);
  border: 1px solid rgba(0, 231, 255, 0.4);
  text-align: left;
  font-size: 20px;
  letter-spacing: 3px;
  text-indent: 2em;
}
</style>
