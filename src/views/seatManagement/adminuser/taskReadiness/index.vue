<template>
  <div id="taskReadine">
    <!-- 头部 -->
    <home-header
      :title="state.systemTitles"
      class="animate__animated animate__backInDown animate__delay-10s"
    ></home-header>
    <taskList></taskList>
    <seatCreatBox v-if="state.showSeatCreatBox"></seatCreatBox>
  </div>
</template>

<script setup>
import { reactive, ref, toRefs, onMounted, watch, nextTick } from 'vue'
import emitter from '@/utils/eventbus'
import HomeHeader from '@/views/homeHeader/HomeHeader'
import taskList from './taskList/index.vue' // 任务列表
import seatCreatBox from '@/views/seatManagement/adminuser/taskReadiness/seatCreat/seatCreatBox.vue'

const state = reactive({
  systemTitles: '',
  showSeatCreatBox: false
})
onMounted(() => {
  state.systemTitles = '数据资源中心-' + localStorage.getItem('systemTitle')
})
emitter.on('setShowCreatSeatBox', (val) => {
  state.showSeatCreatBox = val
})
</script>

<style lang="less" scoped>
#taskReadine {
  width: 100%;
  height: 100%;
  background-image: url('~@/assets/images/taskReadiness-bg.png');
  background-size: 100% 100%;
}
</style>
