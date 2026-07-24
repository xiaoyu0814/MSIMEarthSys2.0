<!--
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2023-11-15 19:39:05
 * @LastEditors: 10.15.15.11 root@pie.cn
 * @LastEditTime: 2024-07-13 19:14:44
 * @FilePath: \BB\src\components\header\header.vue
 * @Description: 头部组件
-->
<template>
  <div id="header">
    <!-- 席位信息 -->
    <div
      class="seatName1"
      v-if="router.currentRoute.value.fullPath == '/architecturePlatform'"
    >
      <p>{{ displayTitle }}</p>
    </div>
    <div class="seatName" v-else>
      {{ vueData.seatName }}
    </div>
    <!-- 导航 -->
    <selfNav
      v-if="router.currentRoute.value.fullPath == '/architecturePlatform'"
    ></selfNav>
    <!-- 右侧组件 -->
    <div class="rightBox">
      <!-- 时间组件 -->
      <selfTime
        v-if="router.currentRoute.value.fullPath != '/architecturePlatform'"
      ></selfTime>
      <el-divider direction="vertical" />
      <!-- 用户组件 -->
      <selfUser></selfUser>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed } from 'vue'
import selfNav from './components/nav.vue'
import selfTime from './components/time.vue'
import selfUser from './components/user.vue'
import { useRouter } from 'vue-router'
import store from '@/store'

const router = useRouter()

let vueData = reactive({
  seatName: sessionStorage.getItem('roleName')
})
let sysTitle = ref(EarthAPP.sysTitle)

const displayTitle = computed(() => {
  const titleExtension = store.state.sceneModule.systemConfig.titleExtension
  if (titleExtension) {
    return EarthAPP.sysTitleQZ + EarthAPP.sysTitle
  }
  return EarthAPP.sysTitle
})
</script>

<style lang="less" scoped>
#header {
  height: 60px;
  background-color: rgba(8, 36, 62, 0.7);
  border-bottom: 1px solid #2d587e;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: relative;
  z-index: 1;

  .seatName1 {
    height: 100%;

    letter-spacing: 1px;
    padding: 0 20px;
    background: linear-gradient(180deg, #008aec 0%, #004d9d 54%, #005ab8 100%);
    box-shadow: 0px 0px 18px 0px #0066ba, inset 0px 0px 66px 0px #00a2ff;
    // opacity: 0.8;
    border: 2px solid #51c1ff;

    p {
      font-size: 26px;
      font-family: FZLTZHK--GBK1, FZLTZHK--GBK1;
      font-weight: normal;
      vertical-align: middle;
      line-height: 10px;
      // line-height: 36px;
      letter-spacing: 1px;
      color: #fff;
    }
  }

  .seatName {
    margin-left: 20px;
    width: 370px;
    text-align: left;
    font-size: 30px;
    font-weight: bold;
  }

  .rightBox {
    display: flex;
    align-items: center;
    // width: 370px;
  }
}
</style>
