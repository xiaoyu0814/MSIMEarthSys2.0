<template>
  <div class="weatherAnalysis-container animate__animated animate__fadeIn">
    <div class="item-container" v-show="state.detailVisible">
      <div class="item-title">
        {{ state.weatherAnalysisData.title }}
      </div>
      <img
        src="@/assets/image/panelIcons/关闭icon.png"
        alt=""
        class="close_sty"
        @click="handleClose"
      />
      <el-form :model="state.weatherAnalysisData" label-width="90px">
        <el-form-item label="天气：">
          {{ state.weatherAnalysisData.weather }}
        </el-form-item>
        <el-form-item label="温度："
          >{{ state.weatherAnalysisData.temperature }}℃</el-form-item
        >
        <el-form-item label="位置：">{{
          state.weatherAnalysisData.position
        }}</el-form-item>
        <el-form-item label="描述："
          >{{ state.weatherAnalysisData.description }}
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import store from '@/store'
import emitter from '@/utils/eventbus'

const state = reactive({
  detailVisible: true,
  weatherAnalysisData: store.state.sceneModule.weatherAnalysis
})
watch(
  () => store.state.sceneModule.weatherAnalysis,
  (newValue, oldValue) => {
    state.weatherAnalysisData = newValue
  }
)
const handleClose = () => {
  state.detailVisible = false
}
emitter.on('closeWeatherAnalysis', (val) => {
  state.detailVisible = val
})
</script>

<style lang="less" scoped>
.weatherAnalysis-container {
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
    .close_sty {
      cursor: pointer;
      position: absolute;
      top: 10px;
      right: 20px;
      width: 20px;
      height: 20px;
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
