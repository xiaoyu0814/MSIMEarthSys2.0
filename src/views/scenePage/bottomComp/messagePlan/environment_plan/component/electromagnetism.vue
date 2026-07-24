<template>
  <div class="electromagnetism_config">
    <el-form :model="vueData.elect" label-width="100px">
      <el-form-item label="计划名称:">
        <el-input v-model="vueData.elect.planName" placeholder="" />
      </el-form-item>
      <el-form-item label="电磁强度:">
        <el-select v-model="vueData.elect.electIntensity" placeholder="">
          <el-option
            v-for="item in vueData.electOption"
            :key="item"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="辐射源类型:">
        <el-select v-model="vueData.elect.radSourceType" placeholder="">
          <el-option
            v-for="item in vueData.electOption"
            :key="item.value"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="额定功率:">
        <el-input v-model="vueData.elect.ratedPower" placeholder="" />
      </el-form-item>
      <el-form-item label="天线增益:">
        <el-input v-model="vueData.elect.textGain" placeholder="" />
      </el-form-item>
      <el-form-item label="频率:">
        <el-input v-model="vueData.elect.frequency" placeholder="" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { reactive, onMounted, watch } from 'vue'
import emitter from '@/utils/eventbus'
const emit = defineEmits(['sendEnvironmentData'])
const vueData = reactive({
  electOption: ['简单', '轻度', '中度', '重度'],
  elect: {
    planName: '',
    electIntensity: '',
    radSourceType: '',
    ratedPower: '',
    textGain: '',
    frequency: '',
    checked: false,
    time: '',
    drawPanel: false
  }
})
emitter.on('getEnvironmentData', (val) => {
  if (val == '电磁') {
    emit('sendEnvironmentData', vueData.elect)
  }
})
watch(
  () => store.state.sceneModule.planDetail,
  (newVal, oldVal) => {
    if (newVal) {
      if (newVal.type == 'changeElectromagnetismAfsimPlan') {
        vueData.elect = newVal.content
      }
    }
  },
  { immediate: true, deep: true }
)
onMounted(() => {})
</script>
<style lang="less" scoped>
.electromagnetism_config {
  :deep(.el-form-item__label) {
    color: #fff !important;
  }
  :deep(.el-input) {
    .el-input__wrapper {
      border-radius: 5px;
      box-shadow: none;
      background-color: #2b4559 !important;
      box-shadow: 0 0 0 1px #075d89 inset !important;
    }
    .el-input__inner {
      color: #fff !important;
    }
  }
  .el-select {
    width: 100%;
    :deep(.el-select__wrapper) {
      background-color: #2b4559 !important;
      box-shadow: 0 0 0 1px #075d89 inset !important;
    }
  }
  :deep(.el-select__placeholder) {
    color: #fff;
  }
  .time-box {
    display: flex;
    flex-direction: column;
    padding-left: 20%;
    :deep(.el-checkbox) {
      color: #fff !important;
    }
  }
}
</style>
