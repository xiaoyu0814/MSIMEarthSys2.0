<template>
  <div class="task">
    <!-- <el-divider content-position="left">{{ props.item.title }}</el-divider> -->
    <div class="task-content">
      <div class="setTakeoff">
        <div class="header" ref="powerProgramme_header">
          <span>飞机起飞</span>
          <el-icon style="cursor: pointer" @click="closePowerBox">
            <Close />
          </el-icon>
        </div>
        <el-form
          style="margin-top: 20px"
          label-width="80px"
          :model="vueData.setTakeoff"
        >
          <el-form-item label="航向角" size="small">
            <el-input
              v-model="vueData.setTakeoff.runwayHeading"
              style="width: 250px"
            />
          </el-form-item>
          <el-form-item label="最大高度" size="small">
            <el-input
              v-model="vueData.setTakeoff.targetHeight"
              style="width: 250px"
            />
          </el-form-item>
          <el-button type="primary" @click="setTakeoff"> 确定 </el-button>
          <el-button @click="closePowerBox">取消</el-button>
        </el-form>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, onBeforeMount, onMounted, ref, watch } from 'vue'
import store from '@/store/index.js'
// import SIMManager from "@/utils/SIM/SIMController/SIMManger";
const props = defineProps({
  name: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['sendClose'])
let vueData = reactive({
  setTakeoff: {
    runwayHeading: '',
    targetHeight: ''
  }
})
// 设置飞机起飞
const setTakeoff = () => {
  let takeoff = {
    runwayHeading: vueData.setTakeoff.runwayHeading,
    targetHeight: vueData.setTakeoff.targetHeight
  }
  let params = 'platform:' + props.name + ',takeoff:' + JSON.stringify(takeoff)
  SIMManager.simEntityController.setCGF(params)
  vueData.setTakeoff.runwayHeading = ''
  vueData.setTakeoff.targetHeight = ''
  emit('sendClose', false)
}
// 关闭弹框
let closePowerBox = () => {
  vueData.setTakeoff.runwayHeading = ''
  vueData.setTakeoff.targetHeight = ''
  emit('sendClose', false)
}
</script>

<style lang="less" scoped>
.task {
  height: calc(100%);
  .el-divider {
    border-top: 1px solid #0b3855;
    margin: 15px 0;

    :deep(.el-divider__text) {
      background-color: transparent !important;
      font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
      font-weight: 700;
      font-style: normal;
      font-size: 16px;
      color: #c2d7ee;
      left: 0 !important;
    }
  }
  .setTakeoff {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 350px;
    height: 200px;
    margin-left: -175px;
    margin-top: -245px;
    background-color: rgba(8, 36, 62, 0.7);
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      border-bottom: 1px solid #0b3855;
    }
  }
  .task-content {
    padding: 10px;
    height: calc(100% - 55px);
    :deep(.el-timeline) {
      --el-timeline-node-size-normal: 12px;
      --el-timeline-node-size-large: 14px;
      --el-timeline-node-color: #eee;
    }

    :deep(.el-card__header) {
      padding: 5px 0 5px 10px;
      border-bottom: none;
      box-sizing: border-box;
      text-align: left;
    }

    :deep(.el-card__body) {
      padding: 5px 20px;
      text-align: left;
    }
    :deep(.el-card) {
      color: #eee;
      --el-card-border-color: #075d89 !important;
      --el-card-bg-color: #2b4559 !important;
    }
  }
}
</style>
