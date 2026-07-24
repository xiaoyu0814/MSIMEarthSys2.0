<!--
 * @description: 杜千存 duqiancun@piesat.com
 * @Version: 1.0
 * @Author:杜千存 duqiancun@piesat.com
 * @Date: 2024-11-24 10:46:05
 * @LastEditors: 杜千存 duqiancun@piesat.cn
 * @LastEditTime: 2024-12-11 16:22:31
-->
<template>
  <div class="report_config" v-show="reportConfigPaneVisible">
    <div class="report_config_header">流程列表</div>
    <ul>
      <li>播报模式1</li>
      <li>播报模式2</li>
      <li>播报模式3</li>
      <li>播报模式4</li>
    </ul>
  </div>
</template>

<script setup>
import { reactive, onMounted, defineEmits, ref } from 'vue'
import { useStore } from 'vuex'
// 定义一个 ref 变量来控制组件的显示和隐藏
const reportConfigPaneVisible = ref(false)

// 切换面板显示/隐藏状态
const toggleReportConfigPaneVisibility = () => {
  reportConfigPaneVisible.value = !reportConfigPaneVisible.value
}

// 暴露方法和变量给父组件
defineExpose({
  toggleReportConfigPaneVisibility
})

onMounted(() => {})
</script>

<style lang="less" scoped>
.report_config {
  width: 470px;
  height: 361px; //72vh;
  background-size: 100% 100%;
  z-index: 25;
  padding: 0;
  margin: 0;
  padding: 0 10px;
  box-sizing: border-box;
  //background-image: url('@/assets/images/com_left_bg.png');
  //background-size: 100% 100%;
  position: absolute;
  top: -56px;
  left: 104%;
  background: rgba(2, 26, 70, 0.58);
  box-shadow: 0 0 25px #1092d58a;
  color: #c2d7ee;
  .report_config_header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    padding: 5px 15px;
    border-bottom: 1px solid #0b3855;
    height: 35px;
    font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
    font-weight: 700;
    font-style: normal;
    font-size: 19px;
    color: #c2d7ee;
    padding-top: 16px;
  }
  .report_config_content {
    height: 75vh;
    padding: 0;
    position: relative;
  }
}
</style>
