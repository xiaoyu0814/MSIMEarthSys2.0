<!--
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2026-07-09 13:27:19
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2026-07-09 13:27:25
 * @FilePath: \MSIMEarthSystem\src\views\scenePage\leftComp\groupTab\index.vue
 * @Description: 编组信息tab总览
-->
<template>
  <div class="groupTab">
    <div class="panel-header">
      <h3 class="panel-title">编组信息</h3>
      <el-tooltip class="box-item" effect="dark" content="关闭面板" placement="top">
        <img src="@/assets/image/panelIcons/关闭icon.png" alt="" class="close_sty" @click="handleClose" />
      </el-tooltip>
    </div>
    <div class="tabsTitle">
      <span v-for="(item, index) in vueData.tabList" :class="vueData.activeName == item.value ? 'tabsActive' : ''"
        :key="index" @click="handleClickTab(item)">
        {{ item.label }}
      </span>
      <div class="tabContent">
        <groupRed v-if="vueData.activeName == 'red'" />
        <groupBlue v-if="vueData.activeName == 'blue'" />
        <groupGreen v-if="vueData.activeName == 'green'" />
        <groupPurple v-if="vueData.activeName == 'purple'" />
      </div>
    </div>
  </div>
</template>
<script setup>
import groupRed from './groupRed'
import groupBlue from './groupBlue'
import groupGreen from './groupGreen'
import groupPurple from './groupPurple'
import { reactive } from 'vue'
import emitter from '@/utils/eventbus'

let vueData = reactive({
  activeName: "red", // tab页绑定
  side: 'red',
  tabList: [
    { label: "红方编组", value: "red" },
    { label: "蓝方编组", value: "blue" },
    { label: "绿方编组", value: "green" },
    { label: "紫方编组", value: "purple" },
  ],
})

// tab点击事件
const handleClickTab = (tab) => {
  vueData.side = tab.value;
  vueData.activeName = tab.value;
}
const handleClose = () => {
  emitter.emit('closeBottomControlPanel', 'left')
  emitter.emit('tagActiveClose', 'groupInfo')
}
</script>


<style lang="less" scoped>
.groupTab {
  position: fixed;
  top: 90px;
  left: 24px;
  width: 400px;
  height: calc(100vh - 110px);
  background: rgba(16, 55, 91, .8);
  box-shadow: 0 0 25px #1092d5;
  border: 1px solid rgba(9, 110, 180, 1);
  border-radius: 8px;
  backdrop-filter: blur(10px);

  .panel-header {
    height: 60px;
    padding: 16px;
    border-bottom: 2px solid #2671ac66;
    background: rgba(16, 55, 91, 1);
    border-radius: 8px 8px 8px 8px;
    position: relative;
    box-sizing: border-box;

    .panel-title {
      margin: 0;
      font-size: 20px;
      color: #ffffff;
      font-weight: 800;
      text-align: center;
      text-shadow: 0 0 10px rgba(64, 158, 255, 0.5);
      letter-spacing: 1.5px;
    }

    .close_sty {
      cursor: pointer;
      position: absolute;
      top: 24px;
      right: 14px;
      width: 16px;
      height: 16px;
      z-index: 1;
    }
  }

  .tabsTitle {
    height: calc(100% - 60px);
    padding: 20px 0px 10px;
    box-sizing: border-box;

    span {
      font-size: 16px;
      font-weight: bolder;
      text-align: center;
      display: inline-block;
      width: 80px;
      height: 28px;
      margin: 0 5px;
      letter-spacing: 2px;
      color: #a0abb8;
      cursor: pointer;
      box-sizing: border-box;
    }

    .tabsActive {
      color: #ffffff !important;
      font-weight: 800;
      border-bottom: 2px solid #409eff;
    }

    .tabContent {
      height: calc(100% - 28px);
    }
  }


}
</style>