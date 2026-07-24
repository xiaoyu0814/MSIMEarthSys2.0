<!--
 * @description: 
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2025-10-09 10:13:49
 * @LastEditors: ZX Li
 * @LastEditTime: 2025-10-09 15:11:42
-->
<!-- 仿真时间进度条 -->
<template>
  <div id="timeProcess" class="time_box">
    <!-- 进度条 -->
    <el-progress
      :percentage="state.time"
      style="color: white; font-size: 23px"
    />
  </div>
</template>

<script setup>
import { reactive, onMounted, onUnmounted, watch, ref } from 'vue'
import { getAFSIMStatus, DeleteEntity } from '@/service/afsim/index'
import store from '@/store'

let state = reactive({
  time: ''
})

// 定时器
let timer = ref(null)

onMounted(() => {
  if (timer.value) {
    clearInterval(timer.value)
  }
  timer.value = setInterval(() => {
    getTimeProcess()
  }, 1000)
})
onUnmounted(() => {
  clearInterval(timer.value)
})

// 监听事件变化
watch(
  () => store.state.sceneModule.timeProcess,
  (newValue, oldValue) => {
    state.time = (newValue * 100).toFixed(2)
  }
)

// 获取时间进度
const getTimeProcess = () => {
  getAFSIMStatus().then((res) => {
    console.log('时间进度：' + res.progress)
    store.commit('setTimeProcess', res.progress)
  })
}
</script>

<style lang="less" scoped>
.time_box {
  width: 400px;
  height: 150px;
  position: absolute;
  right: 74%;
  top: 800px;
  // background-color: aquamarine;
  .el-progress--line {
    margin-bottom: 15px;
    max-width: 600px;
  }

  :deep(.el-progress__text) {
    color: white;
    font-size: 30px;
  }
}
</style>
