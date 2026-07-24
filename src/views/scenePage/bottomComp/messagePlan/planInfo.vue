<template>
  <div class="planInfo animate__animated animate__fadeIn">
    <div class="header">
      <span class="header-left">导调计划详情</span
      ><img src="@/assets/images/rwty/closeBLConfig.svg" @click="closePanel" />
    </div>
    <div class="planInfo_content">
      <p>类型：{{ vueData.showCurrentRow.type }}</p>
      <el-row>
        <el-col
          :span="12"
          v-for="(item, index) in vueData.showCurrentRow.content"
          :key="index"
        >
          {{ item }}</el-col
        >
      </el-row>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted, watch } from 'vue'
import emitter from '@/utils/eventbus'
const emit = defineEmits(['sendCloseCreate'])
const vueData = reactive({
  activeName: 'troops',
  showCurrentRow: ''
})
const props = defineProps({
  currentRow: Object
})
// 关闭弹框
const closePanel = () => {
  emit('sendClosePlanInfo', false)
}
watch(
  () => props.currentRow,
  (newVal, oldVal) => {
    if (newVal) {
      vueData.showCurrentRow = newVal
    }
  },
  { deep: true, immediate: true }
)
onMounted(() => {})
</script>
<style lang="less" scoped>
.planInfo {
  z-index: 1000;
  width: 600px;
  height: 400px;
  position: fixed;
  left: calc(50% - 300px);
  top: calc(50% - 250px);
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    border-bottom: 1px solid #2671ac66;
    .header-left {
      font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
      font-weight: 700;
      font-style: normal;
      font-size: 19px;
      color: #c2d7ee;
    }
  }
  .planInfo_content {
    padding: 5px 20px;
    box-sizing: border-box;
    font-size: 16px;
    color: #c2d7ee;
    p {
      text-align: left;
      padding-left: 18px;
      font-weight: bold;
    }
    .el-col-12 {
      padding: 20px;
      text-align: left;
      font-size: 14px;
    }
  }
}
</style>
