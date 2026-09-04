<template>
  <!-- 实验列表显示控制按钮 -->
  <div class="float-experiment">
    <el-tooltip effect="light" :content="vueData.isExperimentList ? '隐藏实验列表' : '显示实验列表'" placement="top-start">
      <div class="left-shrinks" :style="{
        backgroundImage: vueData.isLeftEcharts ? 'var(--img-telescoping_1)' : 'var(--img-telescoping)'
      }" @click="changeList"></div>
    </el-tooltip>
  </div>
  <experimentList v-if="vueData.isExperimentList" />

  <!-- 实验样本详情 -->
  <Transition name="custom-classes" enter-active-class="animate__animated animate__backInDown animate__delay-10s"
    leave-active-class="animate__animated animate__fadeOutUp">
    <!-- 实验样本 -->
    <taskCreateBox v-if="vueData.createBox_show" :createOrEdit="vueData.createOrEdit"
      @closeTaskCreateBox="closeTaskCreateBox"></taskCreateBox>
  </Transition>

  <!-- 实验样本详情 -->
  <Transition name="custom-classes" enter-active-class="animate__animated animate__backInDown animate__delay-10s"
    leave-active-class="animate__animated animate__fadeOutUp">
    <basicInfo v-if="vueData.isBasicInfo" />
  </Transition>

  <!-- </div> -->
</template>

<script setup>
import { reactive, ref, toRefs, onMounted, watch, nextTick } from 'vue'
import emitter from '@/utils/eventbus'
import experimentList from './hooks/experimentList.vue'
import basicInfo from './hooks/basicInfo.vue'
import taskCreateBox from './hooks/taskCreate_box.vue'
import {
  Menu,
  SuccessFilled,
  CircleCloseFilled,
  Loading,
  DocumentCopy
} from '@element-plus/icons-vue'
import { useStore } from 'vuex'
const store = useStore()

const vueData = reactive({
  isExperimentList: true, //实验列表
  isBasicInfo: false, //实验样本详情
  createBox_show: true, //实验样本列表
  createOrEdit: '实验样本',
  isLeftEcharts: true,
  isrightEcharts: false
  // isExperimentCase:false,//实验样本
  // iscollapse: true,
  // sourceWidth: 280,
  // showSource: true,
  // showTimeline: true
})

// const closePanel = () => {
//   if (vueData.sourceWidth == 280) {
//     vueData.sourceWidth = 90
//     vueData.showSource = false
//   } else if (vueData.sourceWidth == 90) {
//     vueData.sourceWidth = 280
//     vueData.showSource = true
//   }
// }
/**
 * 实验列表点击事件
 */
const changeList = () => {
  vueData.isLeftEcharts = !vueData.isLeftEcharts
  vueData.isExperimentList = !vueData.isExperimentList
  store.commit('set_isSimulationList', vueData.isExperimentList)
  store.commit('set_isSampleDetail', false)
}
emitter.on('isExperimentListShow', (data) => {
  vueData.isExperimentList = data
  store.commit('set_isSimulationList', vueData.isExperimentList)
})
/**
 * 实验详情显隐点击事件
 */
const closeTaskCreateBox = () => {
  const isShow = store.getters.get_isSampleDetail
  isShow
    ? store.commit('set_isSampleDetail', false)
    : store.commit('set_isSampleDetail', true)
  store.commit('set_isSimulationList', false)
  store.commit('set_isSamplelist', false)
}
onMounted(() => {
  window.isBack = true
  emitter.on('closeExperimentList', (val) => {
    vueData.isExperimentList = val
    vueData.isLeftEcharts = val
  })
})

//监测样本详情页面
watch(
  () => store.getters.get_isSampleDetail,
  (newVal) => {
    vueData.isBasicInfo = newVal
  },
  { deep: true, immediate: true }
)
//样本列表显隐
watch(
  () => store.getters.get_isSamplelist,
  (newVal) => {
    vueData.createBox_show = newVal
  },
  { deep: true, immediate: true }
)
</script>
<style lang="less" scoped>
.float-experiment {
  display: flex;
  align-items: flex-end;
  width: 50px;
  height: 54px;
  position: absolute;
  top: 7%;
  left: 0;

  .left-shrinks {
    z-index: 2;
    cursor: pointer;
    width: 18px;
    height: 54px;
    background-size: 100% 100%;
    background-repeat: no-repeat;
    font-size: 36px !important;
  }
}
</style>
