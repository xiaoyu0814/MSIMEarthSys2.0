<!--
 * @Author: dunqiancun duqiancun@piesat.cn
 * @Date: 2024-05-15 10:00:16
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2024-06-12 16:47:37
 * @FilePath: \MSIMEarthSysN\src\views\analysisAssess\troops.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="result-Information">
    <el-tabs
      :tab-position="vueData.tabPosition"
      v-model="vueData.activeName"
      style="height: 100%"
      @tab-click="handleClick"
      @tab-change="tabChange"
    >
      <el-tab-pane label="命中击毁" name="destroy">
        <destroy v-if="vueData.isDestroy" />
      </el-tab-pane>
      <el-tab-pane label="战损" name="damage"
        ><damage v-if="vueData.isDamage"
      /></el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup>
import { onMounted, reactive, nextTick, watch, markRaw, onUnmounted } from 'vue'
import { getNowTroopsPaPd } from '@/service/analysisAssess.js'
import destroy from './components/resultAna/destroy.vue' //命中击毁
import damage from './components/resultAna/damage.vue' //战损
import * as echarts from 'echarts'
const vueData = reactive({
  tabPosition: 'left',
  activeName: 'destroy',
  tableData: [],
  isDamage: false,
  isDestroy: true
})
const tabChange = (name) => {
  if (name == 'damage') {
    vueData.isDamage = true
    vueData.isDestroy = false
  } else {
    vueData.isDamage = false
    vueData.isDestroy = true
  }
}
const onSearch = () => {
  let param = {
    labelName: vueData.name, //名称
    targetCategoryType: vueData.ownership, //兵力所属
    side: vueData.activeName //所属红蓝
  }
  getNowTroopsPaPd({}).then((res) => {
    if (res.code != 200) {
      ElMessage.warning('获取数据失败，请稍后再试！')
      return
    }
    if (!res.data) return
    vueData.tableData = res.data
  })
}
onMounted(() => {
  onSearch()
})
const tableRowClassName = ({ row, rowIndex }) => {
  return rowIndex % 2 == 0 ? 'warning-row' : 'success-row'
}
</script>

<style lang="less" scoped>
.result-Information {
  color: #fff;
  width: 100%;
  height: 100%;
}
.content-all {
  height: 50%;
  display: flex;
  padding: 6px 10px;
  box-sizing: border-box;
  :deep(.pie-echart) {
    width: 50%;
  }
  .content-all-flex {
    width: 50%;
    height: 100%;
    border: 1px solid #387ca6;
    ul {
      width: 100%;
      height: 100%;
      padding: 0;

      li {
        width: 100%;
        height: 33%;
        margin-bottom: 2px;
        font-size: 14px;
        display: flex;
        padding: 6px 0;
        box-sizing: border-box;
        justify-content: center;
      }
    }
  }
}
:deep(.warning-row) {
  background-color: #132437 !important;
  color: #fff;
}
:deep(.success-row) {
  background-color: #16334f !important;
  color: #fff;
}
:deep(.el-table__header-wrapper),
:deep(.el-table tr),
:deep(.el-table thead) {
  background-color: rgba(2, 26, 70, 0.88) !important;
}
:deep(.el-table tbody tr:hover > td) {
  background-color: transparent !important;
}
:deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
  background: rgba(2, 26, 70, 0.88) !important;
  color: #fff;
}
:deep(.el-table thead),
:deep(.el-table th.el-table__cell) {
  color: white;
  background-color: rgba(2, 26, 70, 0.88) !important;
}
:deep(.pie-echart) {
  border: 1px solid #387ca6;
  width: 50%;
  margin-right: 6px;
}
.labelName {
  width: 80px;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}
:deep(.el-progress-bar__inner) {
  text-align: right;
  left: auto;
  right: 0;
  border: 1px solid #fff;
}
:deep(.progress .el-progress-bar__inner) {
  text-align: left !important;
  left: 0;
  right: auto;
  border: 1px solid #fff;
}
.progress-all {
  width: 40%;
}
.text-all {
  line-height: 32px;
}
:deep(.el-tabs__panel) {
  width: 80%;
}
:deep(.el-tabs__item) {
  color: #fff !important;
}
:deep(.el-tabs--left .el-tabs__nav-wrap.is-left::after) {
  width: 0;
}
:deep(.el-tabs--left .el-tabs__active-bar.is-left) {
  display: none;
}
:deep(.el-tabs__item.is-active) {
  color: #409eff !important;
}
:deep(.el-tabs__nav-wrap) {
  padding-top: 10px;
  box-sizing: border-box;
}
</style>
