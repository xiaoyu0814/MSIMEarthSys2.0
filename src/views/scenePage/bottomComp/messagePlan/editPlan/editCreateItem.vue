<template>
  <div class="editCreateItem">
    <el-form :model="vueData.formData" label-width="100px">
      <el-form-item label="计划名称:">
        <el-input v-model="vueData.formData.planName"></el-input>
      </el-form-item>
      <el-form-item label="属方:">
        <el-select
          v-model="vueData.formData.side"
          class="scene_input"
          placeholder="请选择"
          clearable
        >
          <el-option
            v-for="item in vueData.sideList"
            :key="item.value"
            :label="item.name"
            :value="item.value"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="名称:">
        <el-input v-model="vueData.formData.name"></el-input>
      </el-form-item>
      <el-form-item label="类型:">
        <el-input v-model="vueData.formData.type"></el-input>
      </el-form-item>
      <el-form-item label="经度:">
        <el-input v-model="vueData.formData.lon"></el-input>
      </el-form-item>
      <el-form-item label="纬度:">
        <el-input v-model="vueData.formData.lat"></el-input>
      </el-form-item>
      <el-form-item label="高度:">
        <el-input v-model="vueData.formData.alt"></el-input>
      </el-form-item>
      <el-form-item label="航向角:">
        <el-input v-model="vueData.formData.heading"></el-input>
      </el-form-item>
      <el-form-item label="速度:">
        <el-input v-model="vueData.formData.speed"></el-input>
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { reactive, onMounted, watch } from 'vue'
import emitter from '@/utils/eventbus'
const emit = defineEmits(['sendCloseEdit'])

const vueData = reactive({
  formData: {
    planName: '',
    side: '',
    name: '',
    type: '',
    lon: '',
    lat: '',
    alt: '',
    heading: '',
    speed: ''
  },
  sideList: [
    { name: '红方', value: 'red' },
    { name: '蓝方', value: 'blue' }
  ],
  checked: true,
  time: ''
})
const save = () => {}
const closePanel = () => {
  emit('sendCloseEdit', false)
}
watch(
  () => store.state.sceneModule.planDetail,
  (newVal, oldVal) => {
    if (newVal) {
      if (newVal.type == 'createEntity') {
        vueData.formData = newVal.content
      }
    }
  },
  { immediate: true, deep: true }
)
onMounted(() => {})
</script>
<style lang="less" scoped>
.editCreateItem {
  box-sizing: border-box;
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
  :deep(.el-textarea__inner) {
    height: 90px;
    border-radius: 5px;
    box-shadow: none;
    color: #ffff;
    background-color: #2b4559 !important;
    box-shadow: 0 0 0 1px #075d89 inset !important;
  }
  :deep(.el-select__placeholder) {
    color: #fff;
  }
}
</style>
