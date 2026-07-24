<template>
  <div class="task" v-show="vueData.getPosition">
    <div class="task-content">
      <div class="followRoute">
        <div class="header" ref="powerProgramme_header">
          <span>改变航路</span>
          <el-icon style="cursor: pointer" @click="closePowerBox">
            <Close />
          </el-icon>
        </div>
        <el-form
          style="margin-top: 20px"
          label-width="80px"
          :model="vueData.formRoute"
        >
          <el-form-item label="航路名称" size="small">
            <el-input
              v-model="vueData.formRoute.routeName"
              style="width: 250px"
            />
          </el-form-item>
          <el-form-item label="航路位置" size="small">
            <el-input
              v-model="vueData.formRoute.routePosition"
              style="width: 250px"
            />
            <el-tooltip
              class="box-item"
              effect="dark"
              content="选择航路位置"
              placement="bottom-start"
            >
              <img src="@/assets/images/rwty/dw.svg" @click="setPosition()" />
            </el-tooltip>
          </el-form-item>
          <el-form-item label="航路高度" size="small">
            <el-input v-model="vueData.formRoute.alt" style="width: 250px" />
          </el-form-item>
          <el-button type="primary" @click="followRoute"> 确定 </el-button>
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
  formRoute: {
    routeName: '',
    routePosition: '',
    alt: ''
  }
})
// 设置航路
const followRoute = () => {
  let arr = vueData.formRoute.routePosition.split(';')
  let positionList = []
  for (let i = 0; i < arr.length; i++) {
    let positionObj = {
      index: i,
      lon: arr[i].split(',')[0],
      lat: arr[i].split(',')[1],
      alt: vueData.formRoute.alt
    }
    positionList.push(positionObj)
  }
  let obj = {
    routeName: vueData.formRoute.routeName,
    wayPointList: positionList
  }
  let params =
    'platform:' + props.name + ',' + 'setRoute:' + JSON.stringify(obj)
  SIMManager.simEntityController.setCGF(params)
  vueData.formRoute.routeName = ''
  vueData.formRoute.routePosition = ''
  vueData.formRoute.alt = ''
  emit('sendClose', false)
}
// 关闭弹框
let closePowerBox = () => {
  vueData.formRoute.routeName = ''
  emit('sendClose', false)
}
// 选择航路位置
let setPosition = () => {
  vueData.getPosition = false
  // this.$message("请在地图上绘制航路，点击右键结束绘制");
  map.drawLayer('draw_line', getLayer)
}
let getLayer = (feature) => {
  if (feature.type == 'line') {
    let positionList = ''
    for (let i = 0; i < feature.vertexs.length; i++) {
      const element = feature.vertexs[i]
      if (positionList == '') {
        positionList += element[0] + ',' + element[1]
      } else {
        positionList += ';' + element[0] + ',' + element[1]
      }
    }
    vueData.formRoute.routePosition = positionList
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
  .followRoute {
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
