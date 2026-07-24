<template>
  <div class="threatTrendAnalysis-container">
    <div class="item-container">
      <div class="item-title">威胁趋势分析</div>
      <el-form :model="state.threatTrendAnalysisData" label-width="90px">
        <el-form-item label="威胁等级：">
          <div
            :style="`color:${
              state.threatTrendAnalysisData.threatLevel == '高' ? '#00c7fb' : ''
            };padding:0 10px`"
          >
            高
          </div>
          <div>/</div>
          <div
            :style="`color:${
              state.threatTrendAnalysisData.threatLevel == '中' ? '#00c7fb' : ''
            };padding:0 10px`"
          >
            中
          </div>
          <div>/</div>
          <div
            :style="`color:${
              state.threatTrendAnalysisData.threatLevel == '低' ? '#00c7fb' : ''
            };padding:0 10px`"
          >
            低
          </div>
        </el-form-item>
        <el-form-item label="对象：">{{
          state.threatTrendAnalysisData.obj
        }}</el-form-item>
        <el-form-item label="位置：">{{
          state.threatTrendAnalysisData.position
        }}</el-form-item>
        <el-form-item label="能力：">
          <div
            :style="`color:${
              state.threatTrendAnalysisData.capacity == '打击' ? '#00c7fb' : ''
            };padding:0 10px`"
          >
            打击
          </div>
          <div>/</div>
          <div
            :style="`color:${
              state.threatTrendAnalysisData.capacity == '侦察' ? '#00c7fb' : ''
            };padding:0 10px`"
          >
            侦察
          </div>
          <div>/</div>
          <div
            :style="`color:${
              state.threatTrendAnalysisData.capacity == '干扰' ? '#00c7fb' : ''
            };padding:0 10px`"
          >
            干扰
          </div>
          <div>/</div>
          <div
            :style="`color:${
              state.threatTrendAnalysisData.capacity == '通信' ? '#00c7fb' : ''
            };padding:0 10px`"
          >
            通信
          </div></el-form-item
        >
        <el-form-item label="意图：">
          <div
            :style="`color:${
              state.threatTrendAnalysisData.intention == '预警探测'
                ? '#00c7fb'
                : ''
            };padding:0 10px`"
          >
            预警探测
          </div>
          <div>/</div>
          <div
            :style="`color:${
              state.threatTrendAnalysisData.intention == '目标指示'
                ? '#00c7fb'
                : ''
            };padding:0 10px`"
          >
            目标指示
          </div>
        </el-form-item>
        <el-form-item label="机会："
          >{{ state.threatTrendAnalysisData.opportunity }}
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import store from '@/store'

const state = reactive({
  threatTrendAnalysisData: store.state.sceneModule.threatTrendAnalysis
})
watch(
  () => store.state.sceneModule.threatTrendAnalysis,
  (newValue, oldValue) => {
    state.threatTrendAnalysisData = newValue
  }
)
</script>

<style lang="less" scoped>
.threatTrendAnalysis-container {
  position: absolute;
  // left: 5%;
  // bottom: 32px;

  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 320px;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  .item-container {
    width: 98.8%;
    height: 97.4%;
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;
    .item-title {
      text-align: left;
      font-size: 20px;
      font-weight: 500;
      color: #00c7fb;
      display: flex;
      align-items: center;
      margin: 5px 10px;
      font-family: Georgia, serif;
      &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 20px;
        margin-right: 5px;
        background: #1092d5;
      }
    }
    :deep(.el-form) {
      margin: 0 10px;
    }
    :deep(.el-form-item__label) {
      color: white;
    }
    :deep(.el-form-item__content) {
      color: white;
    }
    :deep(.el-form-item) {
      margin-bottom: 10px;
    }
  }
}
</style>
