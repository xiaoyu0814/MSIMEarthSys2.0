<!--
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2025-05-15 14:50:44
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2025-05-16 13:45:50
 * @FilePath: \sjzWeb\src\views\experimentalPreparation\conceptDevelopment\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!-- 无人智能实验数据配置 -->
<template>
  <div class="dataConfig">
    <div class="s-header">
      <div class="s-title">无人智能实验数据配置</div>
      <div class="info">
        用于无人智能实验数据配置过程的流程化、结构化和可视化，为智能作战理论创新和概念开发提供支撑。
      </div>
      <el-divider></el-divider>
    </div>
    <div class="s-content">
      <div class="step">
        <el-steps
          style="width: 100%"
          :active="active"
          align-center
          finish-status="success"
        >
          <el-step
            title="步骤1：作战实验规划"
            description="根据实验需求规划作战实验活动"
          />
          <el-step
            title="步骤2：作战想定设计"
            description="根据实验规划，设计作战实验想定，包括作战环境、兵力编成等信息"
          />
          <el-step
            title="步骤3：实验数据配置"
            description="根据作战实验想定设计，配置和录入实验参数"
          />
        </el-steps>
      </div>
      <div class="setp-content">
        <setp1 v-if="active == 0" />
        <setp2 v-if="active == 1" />
        <setp3 v-if="active == 2" />
      </div>
    </div>
  </div>
</template>
<script setup>
import setp1 from './components/step1.vue'
import setp2 from './components/step2.vue'
import setp3 from './components/step3.vue'
import { onMounted, ref } from 'vue'
import emitter from '@/utils/eventbus'
const active = ref(0)
onMounted(() => {
  emitter.on('sendTestRule', (val) => {
    active.value++
  })
  emitter.on('sendScene', (val) => {
    active.value++
  })
  emitter.on('setpGoBack', (val) => {
    active.value--
  })
})
</script>
<style lang="less" scoped>
.dataConfig {
  width: 100%;
  height: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  top: 60px;
  background: #00254e;
  box-shadow: 0 0 25px #1092d5;
  .s-header {
    height: 120px;
    padding: 20px 20px 0;
    text-align: left;
    color: #fff;
    box-sizing: border-box;
    .s-title {
      font-size: 28px;
      font-weight: bolder;
    }
    .info {
      font-size: 20px;
      margin-top: 10px;
    }
  }
  .s-content {
    height: calc(100% - 120px);
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    .step {
      width: 100%;
      height: 90px;
    }
    .setp-content {
      width: 100%;
      height: calc(100% - 90px);
    }
  }
}
:deep(.el-step__title.is-process) {
  font-weight: 700;
  color: #409eff !important;
}
:deep(.el-step__description.is-process) {
  color: #409eff !important;
}
</style>
