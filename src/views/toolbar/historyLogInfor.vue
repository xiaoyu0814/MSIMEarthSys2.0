<!--
 * @description: 
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-10-11 13:19:27
 * @LastEditors: RENAO
 * @LastEditTime: 2024-10-21 17:12:33
-->
<!-- 历史日志信息 -->
<template>
  <div class="logContainer">
    <!-- 头部 -->
    <div class="header">
      <div class="header-title">
        <div>历史作战日志</div>
        <!-- <img
          style="margin-right: 10px"
          src="@/assets/image/panelIcons/关闭icon.png"
          alt=""
          class="close_sty"
          @click="selectClone"
        /> -->
      </div>
    </div>
    <div class="logs-table">
      <el-table
        :data="vueData.tableData"
        border
        style="width: 100%"
        :row-class-name="rowStyle"
        :header-cell-style="{ background: '#2b4559', color: ' #FFFFFF' }"
        max-height="500px"
      >
        <el-table-column
          label="序号"
          width="55"
          type="index"
          align="center"
          fit
        />
        <el-table-column
          prop="time"
          label="时间"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="objectiveSide"
          label="阵营"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="type"
          label="类型"
          align="center"
          show-overflow-tooltip
        />
        <el-table-column
          prop="message"
          label="内容"
          align="center"
          show-overflow-tooltip
        />
      </el-table>
    </div>
  </div>
</template>
<script setup>
import { reactive, onBeforeMount, onMounted, ref, watch } from 'vue'
import store from '@/store/index.js'
import { getAllLogInfo } from '@/service/threatAnalysis.js'
const props = defineProps({})
let vueData = reactive({
  tableData: []
})
onMounted(() => {
  getTableData()
})
const getTableData = () => {
  getAllLogInfo().then((res) => {
    if (res.code == 200) {
      let responseData = res.data
      responseData.forEach((element, index) => {
        let item = {
          time: element.time,
          objectiveSide: element.logInfo.objectiveSide
            ? element.logInfo.objectiveSide
            : '',
          type: element.logInfo.type ? element.logInfo.type : '',
          message: element.logInfo.message ? element.logInfo.message : ''
        }
        vueData.tableData.push(item)
      })
    }
  })
}
</script>
<style lang="less" scoped>
.logContainer {
  width: 1100px;
  height: 600px;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  padding: 3px 9px;
  position: fixed;
  right: calc(50% - 550px);
  top: 22%;
  color: #fff;
  .header {
    width: 100%;
    height: 45px;
    border-bottom: 1px solid #fff;
    margin-bottom: 10px;
    .header-title {
      width: 100%;
      font-size: 25px;
      text-align: left;
      line-height: 45px;
      padding-left: 10px;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
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
    background-color: rgba(0, 123, 204, 0.15) !important;
  }
  :deep(.el-table) {
    .el-table__body tr.current-row > td {
      background-color: rgba(255, 255, 255, 1) !important;
    }
    /* 用来设置当前页面element全局table 选中某行时的背景色*/
    .el-table__body tr.current-row > td {
      background-color: #223b0b !important;
      color: #fff;
      /* color: #f19944; */ /* 设置文字颜色，可以选择不设置 */
    }
    /* 用来设置当前页面element全局table 鼠标移入某行时的背景色*/
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: #f1dfb2;
      color: #fff;
      /* color: #f19944; */ /* 设置文字颜色，可以选择不设置 */
    }
    .el-table__empty-block {
      background: rgba(2, 26, 70, 0.88);
      .el-table__empty-text {
        color: #fff;
      }
    }
  }
}
</style>
