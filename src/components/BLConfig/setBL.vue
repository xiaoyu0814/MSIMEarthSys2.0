<template>
  <div class="task">
    <el-divider content-position="left">{{ props.item.title }}</el-divider>
    <div class="task-content">
      <div>
        <el-button type="primary" @click="vueData.setDamage = true"
          >设置毁伤</el-button
        >
        <el-button type="primary" @click="vueData.setPosition = true"
          >设置位置</el-button
        >
        <el-button type="primary" @click="vueData.setBLGuide = true"
          >兵力引导</el-button
        >
        <br />
        <br />
        <el-button type="primary" @click="vueData.followRoute = true"
          >改变航路</el-button
        >
        <el-button type="primary" @click="vueData.setRoute = true"
          >立即改变航路</el-button
        >
        <br />
        <br />
        <el-button type="primary" @click="vueData.setTakeoff = true"
          >飞机起飞</el-button
        >
        <el-button type="primary" @click="vueData.setLanding = true"
          >飞机降落</el-button
        >
        <br />
        <br />
        <el-button type="primary" @click="vueData.fire = true">开火</el-button>
        <el-button type="primary">补充弹药</el-button>
        <br />
        <br />
        <el-button type="primary">传感器</el-button>
        <el-button type="primary">干扰器</el-button>
      </div>
      <setDamage
        v-if="vueData.setDamage"
        @sendClose="closePowerBox"
        :name="props.name"
      ></setDamage>
      <setPosition
        v-if="vueData.setPosition"
        @sendClose="closePowerBox"
        :name="props.name"
      ></setPosition>
      <setBLGuide
        v-if="vueData.setBLGuide"
        @sendClose="closePowerBox"
        :name="props.name"
      ></setBLGuide>
      <followRoute
        v-if="vueData.followRoute"
        @sendClose="closePowerBox"
        :name="props.name"
      ></followRoute>
      <setRoute
        v-if="vueData.setRoute"
        @sendClose="closePowerBox"
        :name="props.name"
      ></setRoute>
      <fire
        v-if="vueData.fire"
        @sendClose="closePowerBox"
        :name="props.name"
      ></fire>
      <setTakeoff
        v-if="vueData.setTakeoff"
        @sendClose="closePowerBox"
        :name="props.name"
      ></setTakeoff>
      <setLanding
        v-if="vueData.setLanding"
        @sendClose="closePowerBox"
        :name="props.name"
      ></setLanding>
    </div>
  </div>
</template>
<script setup>
import { reactive, onBeforeMount, onMounted, ref, watch } from 'vue'
import store from '@/store/index.js'
import setDamage from './setBLConfig/setDamage.vue'
import setPosition from './setBLConfig/setPosition.vue'
import setBLGuide from './setBLConfig/setBLGuide.vue'
import followRoute from './setBLConfig/followRoute.vue'
import setRoute from './setBLConfig/setRoute.vue'
import fire from './setBLConfig/fire.vue'
import setTakeoff from './setBLConfig/setTakeoff.vue'
import setLanding from './setBLConfig/setLanding.vue'
const props = defineProps({
  item: {
    type: Object,
    default: {}
  },
  node: {
    type: Object,
    default: {}
  },
  name: {
    type: String,
    default: ''
  }
})
let vueData = reactive({
  setDamage: false,
  setPosition: false,
  setBLGuide: false,
  followRoute: false,
  setRoute: false,
  fire: false,
  setTakeoff: false,
  setLanding: false
})
// 关闭弹框
let closePowerBox = () => {
  vueData.setDamage = false
  vueData.setPosition = false
  vueData.setBLGuide = false
  vueData.followRoute = false
  vueData.setRoute = false
  vueData.fire = false
  vueData.setTakeoff = false
  vueData.setLanding = false
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
  .setDamage {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 350px;
    height: 150px;
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
