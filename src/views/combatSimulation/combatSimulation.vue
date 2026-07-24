<template>
  <!-- 实验列表显示控制按钮 -->
  <div class="float-experiment">
    <el-tooltip effect="light" :content="vueData.isExperimentList ? '隐藏实验列表' : '显示实验列表'" placement="top-start">
      <img
        class="left-shrinks"
        :src="
          vueData.isLeftEcharts
            ? require('@/assets/image/panelIcons/telescoping_1.png')
            : require('@/assets/image/panelIcons/telescoping.png')
        "
        @click="changeList"
      />
    </el-tooltip>
  </div>
  <experimentList v-if="vueData.isExperimentList" />

  <!-- 实验样本详情 -->
  <Transition
    name="custom-classes"
    enter-active-class="animate__animated animate__backInDown animate__delay-10s"
    leave-active-class="animate__animated animate__fadeOutUp"
  >
    <!-- 实验样本 -->
    <taskCreateBox
      v-if="vueData.createBox_show"
      :createOrEdit="vueData.createOrEdit"
      @closeTaskCreateBox="closeTaskCreateBox"
    ></taskCreateBox>
  </Transition>

  <!-- 实验样本详情 -->
  <Transition
    name="custom-classes"
    enter-active-class="animate__animated animate__backInDown animate__delay-10s"
    leave-active-class="animate__animated animate__fadeOutUp"
  >
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
.list-icon {
  position: absolute;
  top: 9%;
  left: 20px;
  font-size: 30px;
  z-index: 10;
  color: #fff;
}
// }
.content-all {
  width: 100%;
  height: 50px;
  line-height: 50px;
  padding-left: 10px;
  padding-size: border-box;
}
.title {
  text-align: left;
  width: 100%;
  padding: 0 20px;
  display: block;
  box-sizing: border-box;
  position: relative;
  color: #fff;
  font-size: 18px;
  position: relative;
  line-height: 30px;
}
.title-all {
  text-align: left;
  width: 100%;
  padding: 0 20px;
  display: block;
  box-sizing: border-box;
  position: relative;
  color: #fff;
  font-size: 14px;
  position: relative;
  line-height: 30px;

  span {
    position: absolute;
    top: 6px;
    right: 10px;
    width: 60px;
    color: blue;
    text-align: center;
    height: 100%;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
  }

  &:after {
    content: '';
    position: absolute;
    top: 10px;
    left: 6px;
    width: 10px;
    height: 10px;
    background: #00cbff;
    border-radius: 50%;
  }
}
.img-btn {
  cursor: pointer;
  width: 20px;
  height: 20px;
  position: absolute;
  top: 11%;
  right: 220px;
  font-size: 40px;
  z-index: 10;
  color: #fff;
}

.float-experiment {
  display: flex;
  align-items: flex-end;
  width: 50px;
  height: 50px;
  position: absolute;
  top: 7%;
  left: 0;

  .left-shrinks {
    transform: translate(0, -8%);
    z-index: 2;
    cursor: pointer;
    width: 16px;
    font-size: 36px !important;
  }
}
.float-right {
  display: flex;
  align-items: flex-end;
  /* width: 50px; */
  height: 50px;
  position: absolute;
  top: 5%;
  right: 0;

  .left-shrinks {
    transform: rotate(180deg);
    z-index: 2;
    cursor: pointer;
    width: 10px;
    font-size: 36px !important;
  }
}
</style>
