<template>
  <div class="ocean_config">
    <el-form :model="vueData.sea" label-width="100px">
      <el-form-item label="计划名称:">
        <el-input v-model="vueData.sea.planName" placeholder="" />
      </el-form-item>
      <el-form-item label="浪高:">
        <el-input v-model="vueData.sea.waveHeight" placeholder="" />
      </el-form-item>
      <el-form-item label="海况等级:">
        <el-select v-model="vueData.sea.level" placeholder="">
          <el-option
            v-for="item in vueData.seaStateList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { reactive, onMounted, watch } from 'vue'
import emitter from '@/utils/eventbus'
const emit = defineEmits(['sendEnvironmentData'])
const vueData = reactive({
  seaStateList: [
    { id: '0', name: '0' },
    { id: '1', name: '0 - 0.10' },
    { id: '2', name: '0.10 - 0.50' },
    { id: '3', name: '0.50 - 1.25' },
    { id: '4', name: '1.25 - 2.50' },
    { id: '5', name: '2.50 - 4.00' },
    { id: '6', name: '4.00 - 6.00' }
  ],
  sea: {
    planName: '',
    waveHeight: '0m',
    level: 1,
    checked: false,
    time: '',
    drawPanel: false
  }
})
emitter.on('getEnvironmentData', (val) => {
  if (val == '海洋') {
    emit('sendEnvironmentData', vueData.sea)
  }
})
watch(
  () => store.state.sceneModule.planDetail,
  (newVal, oldVal) => {
    if (newVal) {
      if (newVal.type == 'changeOceanAfsimPlan') {
        vueData.sea = newVal.content
      }
    }
  },
  { immediate: true, deep: true }
)
onMounted(() => {})
</script>
<style lang="less" scoped>
.ocean_config {
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
