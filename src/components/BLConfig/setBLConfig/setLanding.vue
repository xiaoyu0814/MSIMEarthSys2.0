<template>
  <div class="task" v-show="vueData.getPosition">
    <div class="task-content">
      <div class="setLanding">
        <div class="header" ref="powerProgramme_header">
          <span>飞机降落</span>
          <el-icon style="cursor: pointer" @click="closePowerBox">
            <Close />
          </el-icon>
        </div>
        <el-form
          style="margin-top: 20px"
          label-width="80px"
          :model="vueData.formLanding"
        >
          <el-form-item label="航向角" size="small">
            <el-input
              v-model="vueData.formLanding.runwayHeading"
              style="width: 250px"
            />
          </el-form-item>
          <el-form-item label="降落点" size="small">
            <el-input
              v-model="vueData.formLanding.targetPosition"
              style="width: 250px"
            />
            <el-tooltip
              class="box-item"
              effect="dark"
              content="选择降落点"
              placement="bottom-start"
            >
              <img src="@/assets/images/rwty/dw.svg" @click="getPoint()" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="降落点高度" size="small">
            <el-input
              v-model="vueData.formLanding.targetAlt"
              style="width: 250px"
            />
          </el-form-item>
          <el-button type="primary" @click="setLanding"> 确定 </el-button>
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
// import map from "@/utils/map/map.js";
const props = defineProps({
  name: {
    type: String,
    default: ''
  }
})
const emit = defineEmits(['sendClose'])
let vueData = reactive({
  getPosition: true,
  formLanding: {
    runwayHeading: '',
    targetPosition: '',
    targetAlt: ''
  }
})
// 飞机降落
const setLanding = () => {
  let landing = {
    runwayHeading: vueData.formLanding.runwayHeading,
    targetLon: vueData.formLanding.targetPosition.split(',')[0],
    targetLat: vueData.formLanding.targetPosition.split(',')[1],
    targetAlt: vueData.formLanding.targetAlt
  }
  let params = 'platform:' + props.name + ',landing:' + JSON.stringify(landing)
  SIMManager.simEntityController.setCGF(params)
  vueData.formLanding.runwayHeading = ''
  vueData.formLanding.targetHeight = ''
  emit('sendClose', false)
}
// 选择位置
let getPoint = () => {
  vueData.getPosition = false
  // this.$message("请在地图上绘制航路，点击右键结束绘制");
  map.drawLayer('draw_point', getLayer)
}
let getLayer = (feature) => {
  if (feature.type == 'point') {
    let newPoint = feature.vertexs[0]
    vueData.formLanding.targetPosition = newPoint[0] + ',' + newPoint[1]
    vueData.getPosition = true
  }
  earthDraw.clearFeatures()
  map.drawLayer(true, null)
}
// 关闭弹框
let closePowerBox = () => {
  vueData.formLanding.runwayHeading = ''
  vueData.formLanding.targetHeight = ''
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
  .setLanding {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 350px;
    height: 250px;
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
