<!--
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2025-05-16 10:51:13
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2025-05-16 14:27:00
 * @FilePath: \sjzWeb\src\views\scenePage\experimentalDataAnalysis\comporents\statisticalAnalysis.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="statisticalAnalysis">
    <header>
      <div class="titleBox">
        <div class="title">实验名称：XXXXXX实验</div>
        <el-icon size="30" style="cursor: pointer" @click="closeBox"
          ><Close
        /></el-icon>
      </div>
      <ul class="infoBox">
        <li>实验创建时间：XXXX</li>
        <li>实验完成时间：XXXX</li>
        <li>实验方法：XXXX</li>
        <li>评估指标：XXXX</li>
        <li>实验计划：XXXXXXXXXX</li>
      </ul>
    </header>
    <el-tabs
      v-model="state.activeName"
      class="demo-tabs"
      @tab-click="handleClick"
    >
      <el-tab-pane label="数据统计分析" name="first">
        <dataStatisticalAnalysis />
      </el-tab-pane>
      <el-tab-pane label="数据专题分析" name="second">
        <dataThematicAnalysis />
      </el-tab-pane>
      <el-tab-pane label="数据关联分析" name="third">
        <dataCorrelationAnalysis />
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { Close } from '@element-plus/icons-vue'
import dataStatisticalAnalysis from './components/dataStatisticalAnalysis.vue' // 数据统计分析
import dataThematicAnalysis from './components/dataThematicAnalysis.vue' // 数据专题分析
import dataCorrelationAnalysis from './components/dataCorrelationAnalysis.vue' // 数据关联分析

const emits = defineEmits(['close'])

const state = reactive({
  activeName: 'first'
})

const handleClick = (tab, event) => {
  console.log(tab, event)
}

const closeBox = () => {
  emits('closeBox')
}
</script>

<style lang="less" scoped>
#statisticalAnalysis {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 100px;
  background-color: rgba(2, 26, 70, 1);
  box-shadow: 0 0 25px #1092d5;
  color: #ffffff;
  text-align: left;
  z-index: 9;
  padding: 20px;

  header {
    .titleBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: 24px;
        font-weight: bold;
        color: rgba(255, 255, 128, 1);
      }
    }
    .infoBox {
      display: flex;
      justify-content: space-evenly;
      align-items: center;
      font-size: 20px;
    }
  }
  :deep(.el-tabs__item) {
    color: #ffffff;
  }
  :deep(.is-active) {
    color: #409eff;
  }
}
</style>
