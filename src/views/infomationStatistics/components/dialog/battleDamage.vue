<!--
 * @Author: dunqiancun duqiancun@piesat.cn
 * @Date: 2024-05-15 10:00:16
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2024-06-12 16:53:53
 * @FilePath: \MSIMEarthSysN\src\views\analysisAssess\troops.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="troops-Information">
    <div class="top-content">
      <div class="content-all">
        <span class="form-title-all">战损统计</span>
        <!-- <damageAxisEcharts /> -->
      </div>
    </div>
    <!--表格-->
    <div class="bottom-content">
      <span class="form-title-all">战损统计</span>

      <el-scrollbar max-height="500px">
        <el-table
          :data="vueData.damageData"
          style="width: 100%"
          :row-class-name="tableRowClassName"
        >
          <el-table-column prop="side" label="阵营" align="center" fit />
          <el-table-column prop="hitName" label="中文名称" align="center" fit />
          <el-table-column prop="arms" label="打击武器" align="center" fit />
          <el-table-column
            prop="launchName"
            label="打击者"
            align="center"
            fit
          />
        </el-table>
      </el-scrollbar>
      <!-- </el-tab-pane>
        </el-tabs> -->
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, nextTick, watch, markRaw, onUnmounted } from 'vue'
import { getBattleDamageTableData } from '@/service/analysisAssess.js'
// import damageAxisEcharts from './damageAxisEcharts.vue' //柱状图
const vueData = reactive({
  damageData: [],
  activeName: 'red'
})
//表格数据查询
const onSearch = () => {
  let param = {
    labelName: vueData.name, //名称
    targetCategoryType: vueData.ownership, //兵力所属
    side: vueData.activeName //所属红蓝
  }
  getBattleDamageTableData({}).then((res) => {
    if (res.code != 200) {
      ElMessage.warning('获取数据失败，请稍后再试！')
      return
    }
    if (res.data && res.data.dataset) {
      vueData.damageData = res.data.dataset.tableData
    }
  })
}

onMounted(() => {
  // onSearch()
})
</script>

<style lang="less" scoped>
.troops-Information {
  color: #fff;
  width: 100%;
  height: 100%;
}

.content-all {
  flex: 1;

  :deep(.pie-echart) {
    width: 50%;
  }
}

.content-all-flex {
  display: flex;
  padding: 0;

  // li {
  //   width: 100%;
  height: 33%;
  margin-bottom: 2px;
  font-size: 14px;
  display: flex;
  padding: 6px 0;
  box-sizing: border-box;
  justify-content: center;
  // }
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

.top-content {
  display: flex;
  //height: 300px;
}

.top-content,
.bottom-content {
  height: 49%;
  width: 100%;
  overflow: hidden;
  padding: 6px 10px;
  box-sizing: border-box;
}

.progress-all {
  width: 40%;
}

.text-all {
  line-height: 32px;
}

:deep(.el-form) {
  color: #fff;
  font-size: 16px;
  margin-top: 10px;
  display: flex;

  .el-form-item__label,
  .el-form-item__label-wrap {
    color: #fff;
  }
}

:deep(.el-input__wrapper) {
  marign-right: 10px !important;
}

:deep(.el-table__empty-block) {
  background: rgba(2, 26, 70, 0.88) !important;

  .el-table__empty-text {
    color: #fff;
  }
}

:deep(.el-form-item) {
  margin-right: 10px !important;
}

.form-title-all {
  display: block;
  height: 40px;
  background: url('~@/assets/images/indicator/icon01.png');
  background-size: 100% 100%;
  padding: 0 10px;
  box-sizing: border-box;
  align-items: left;
  text-align: left;
  color: #fff;
  font-size: 18px;
  line-height: 40px;
}
</style>
