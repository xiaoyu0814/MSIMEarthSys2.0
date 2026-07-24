<template>
  <div class="task" v-show="vueData.getPosition">
    <!-- <el-divider content-position="left">{{ props.item.title }}</el-divider> -->
    <div class="task-content">
      <div class="setPosition">
        <div class="header" ref="powerProgramme_header">
          <span>设置位置</span>
          <el-icon style="cursor: pointer" @click="closePowerBox">
            <Close />
          </el-icon>
        </div>
        <el-form
          style="margin-top: 20px"
          label-width="80px"
          :model="vueData.formPosition"
        >
          <el-form-item label="位置" size="small">
            <el-input
              v-model="vueData.formPosition.position"
              style="width: 250px"
            />
            <el-tooltip
              class="box-item"
              effect="dark"
              content="选择航路位置"
              placement="bottom-start"
            >
              <img src="@/assets/images/rwty/dw.svg" @click="getPoint()" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="高度" size="small">
            <el-input v-model="vueData.formPosition.alt" style="width: 250px" />
          </el-form-item>
          <el-button type="primary" @click="setPosition"> 确定 </el-button>
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
  formPosition: {
    position: '',
    alt: ''
  }
})
// 设置位置
const setPosition = () => {
  let obj = {
    lon: vueData.formPosition.position.split(',')[0],
    lat: vueData.formPosition.position.split(',')[1],
    alt: vueData.formPosition.alt
  }
  let params =
    'platform:' + props.name + ',' + 'setPosition:' + JSON.stringify(obj)
  console.log(params)
  SIMManager.simEntityController.setCGF(params)
  vueData.formPosition.lat = ''
  vueData.formPosition.lon = ''
  vueData.formPosition.alt = ''
  emit('sendClose', false)
}
// 关闭弹框
let closePowerBox = () => {
  vueData.formPosition.lat = ''
  vueData.formPosition.lon = ''
  vueData.formPosition.alt = ''
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
    vueData.formPosition.position = newPoint[0] + ',' + newPoint[1]
    vueData.getPosition = true
  }
  earthDraw.clearFeatures()
  map.drawLayer(true, null)
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
  .setPosition {
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
