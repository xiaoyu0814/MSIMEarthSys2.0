<!--
 * @description: 
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2025-10-11 13:51:53
 * @LastEditors: ZX Li
 * @LastEditTime: 2025-10-11 16:09:56
-->
<template>
  <div class="creat_plan animate__animated animate__fadeIn">
    <div class="header">
      <span class="header-left">修改计划</span
      ><img src="@/assets/images/rwty/closeBLConfig.svg" @click="closePanel" />
    </div>
    <div class="creat_plan_content">
      <el-tabs v-model="vueData.activeName" class="demo-tabs">
        <el-tab-pane label="兵  力" name="troops">
          <editDailog :currentEidtData="vueData.currentEidtData"></editDailog>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted, watch } from 'vue'
import editDailog from '@/views/scenePage/bottomComp/messagePlan/editNewPlan/editDailog.vue'
import { currentData } from '@/utils/earthPlugin/layers/LayerOceanCurrent/current/CurrentData'
const emit = defineEmits(['sendCloseEdit'])
const props = defineProps({
  currentRow: {
    type: Object,
    default: {}
  }
})

const vueData = reactive({
  activeName: 'troops',
  currentEidtData: {}
})

const save = () => {}
const closePanel = () => {
  emit('sendCloseEdit', false)
}

watch(
  () => props.currentRow,
  (newVal, oldVal) => {
    // console.log(newVal)
    if (newVal) {
      vueData.currentEidtData = newVal
    }
  },
  { deep: true }
)

onMounted(() => {})
</script>
<style lang="less" scoped>
.creat_plan {
  z-index: 1000;
  width: 700px;
  height: 300px;
  position: fixed;
  left: calc(50% - 350px);
  top: 33%;
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
  .creat_plan_content {
    padding: 0px 0px 0 20px;
    box-sizing: border-box;
    :deep(.el-tabs__item) {
      color: #a0abb8 !important;
      font-size: 16px;
    }
    :deep(.el-tabs__item.is-active) {
      color: #ffffff !important;
      font-weight: bold !important;
    }
    :deep(.el-tabs__nav-wrap::after) {
      background-color: #2671ac66;
    }
    :deep(.el-tabs__header) {
      margin: 0 !important;
    }
  }
  .creat_plan_footer {
    padding: 10px 15px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
