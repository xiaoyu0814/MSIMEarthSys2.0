<!--
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2025-06-30 11:06:48
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2025-12-11 10:44:25
 * @FilePath: \gfdx\src\views\hooks\childComp\homeConfig.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="home-config">
    <el-button
      id="toolTip"
      size="small"
      type="primary"
      style="
        position: absolute;
        top: 100px;
        left: 50px;
        z-index: 999;
        font-size: 30px;
      "
      @click="showRadar2"
    >
      播报1
    </el-button>
    <!-- <identify v-if="showIdentify"></identify> -->
    <!-- <loading v-if="showLoading"></loading>
    <BubbleDiv></BubbleDiv>
    <BubbleDiv3></BubbleDiv3> -->
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import { reactive, watch, onMounted } from 'vue'

import BubbleDiv from '@/utils/bubble/BubbleDiv'
import BubbleDiv3 from '@/utils/bubble/BubbleDiv3'
import identify from '@/components/content/identify/identify'
import loading from '@/components/content/loading.vue'

import emitter from '@/utils/eventbus'
const store = useStore()
const state = reactive({
  showIdentify: false, //识别
  showLoading: true //是否显示loading
})

watch(
  () => store.state.sceneModule.showIdentify,
  (newValue) => {
    console.log(newValue)
    if (newValue) {
      state.showIdentify = newValue
      let sysSoundShow = Number(
        window.localStorage.getItem('systemSoundEnabled')
      )
      if (!sysSoundShow) {
        setTimeout(() => {
          // beautyToast.info({
          //   title: 'Info',
          //   message: '情报回传中',
          //   darkTheme: true,
          //   animation: true
          // })
          store.state.sceneModule.showIdentify = false
        }, ((identifyDuration * 3 + 5) * 1000) / window.EarthViewer.clock.multiplier) // (identifyDuration * 3 + 10) * 1000  识别动画总时长
      }
    } else {
      state.showIdentify = newValue
    }
  }
)
const showRadar2 = () => {
  store.state.sceneModule.showIdentify = true
  console.log(state.showIdentify)
}
onMounted(() => {
  // 显示复盘回放时间轴
  emitter.on('showLoading', (val) => {
    state.showLoading = val
  })
})
</script>

<style lang="less" scoped>
.home-config {
  position: absolute;
  top: 100px;
  left: 50px;
  z-index: 999;
}
</style>
