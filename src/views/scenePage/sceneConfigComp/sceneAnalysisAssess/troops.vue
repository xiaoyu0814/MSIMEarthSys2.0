<!--
 * @Author: dunqiancun duqiancun@piesat.cn
 * @Date: 2024-05-15 10:00:16
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2024-06-18 15:50:07
 * @FilePath: \MSIMEarthSysN\src\views\analysisAssess\troops.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="troops-Information">
    <div class="top-content">
      <div class="content-all">
        <span class="form-title-all">初始兵力</span>
        <troopsAxisEcharts />
      </div>

      <div class="content-all">
        <span class="form-title-all">实时兵力</span>
        <el-scrollbar max-height="390px">
          <ul>
            <li
              v-for="(item, idx) in vueData.progressData"
              :key="idx"
              class="content-all-flex"
            >
              <div class="progress-all">
                <span class="text-all"
                  >当前兵力/初始兵力：{{ item.redCurInfoNum }}/{{
                    item.redInfoNum
                  }}</span
                >
                <el-progress
                  :text-inside="true"
                  :stroke-width="20"
                  :percentage="item.red"
                  status="exception"
                />
              </div>
              <span class="labelName">{{ item.label }}</span>
              <div class="progress-all progress">
                <span class="text-all"
                  >当前兵力/初始兵力：{{ item.blueCurInfoNum }}/{{
                    item.blueInfoNum
                  }}</span
                >
                <el-progress
                  :text-inside="true"
                  :stroke-width="20"
                  :percentage="item.blue"
                />
              </div>
            </li>
          </ul>
        </el-scrollbar>
      </div>
    </div>

    <!--表格-->
    <div class="bottom-content">
      <span class="form-title-all">详细兵力</span>
      <el-tabs
        v-model="vueData.activeName"
        class="border-card"
        style="width: 100%"
        @tab-click="handleClick"
      >
        <el-tab-pane label="红方" name="red">
          <el-form>
            <el-form-item label="中文名称">
              <el-input v-model="vueData.name" />
            </el-form-item>
            <el-form-item label="所属兵力">
              <el-input v-model="vueData.ownership" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch">查询</el-button>
            </el-form-item>
          </el-form>
          <el-scrollbar max-height="300px">
            <el-table
              :data="vueData.tableData"
              style="width: 100%"
              :row-class-name="tableRowClassName"
            >
              <el-table-column prop="side" label="阵营" align="center" fit>
                <template #default="scope">
                  <span>{{ scope.row.side == 'red' ? '红方' : '蓝方' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="中文名称"
                align="center"
                fit
              />
              <el-table-column
                prop="ownership"
                label="所属兵力"
                align="center"
                fit
              />
              <el-table-column
                prop="targetType"
                label="目标类型"
                align="center"
                fit
              />
              <el-table-column
                prop="isSurvival"
                label="是否存活"
                align="center"
                fit
              >
                <template #default="scope">
                  <span>{{ scope.row ? '是' : '否' }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </el-tab-pane>

        <el-tab-pane label="蓝方" name="blue">
          <el-form>
            <el-form-item label="中文名称">
              <el-input v-model="vueData.name" />
            </el-form-item>
            <el-form-item label="所属兵力">
              <el-input v-model="vueData.ownership" />
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSearch">查询</el-button>
            </el-form-item>
          </el-form>

          <el-scrollbar max-height="300px">
            <el-table
              :data="vueData.tableData"
              style="width: 100%"
              :row-class-name="tableRowClassName"
            >
              <el-table-column prop="side" label="阵营" align="center" fit>
                <template #default="scope">
                  <span>{{ scope.row.side == 'red' ? '红方' : '蓝方' }}</span>
                </template>
              </el-table-column>
              <el-table-column
                prop="name"
                label="中文名称"
                align="center"
                fit
              />
              <el-table-column
                prop="ownership"
                label="所属兵力"
                align="center"
                fit
              />
              <el-table-column
                prop="targetType"
                label="目标类型"
                align="center"
                fit
              />
              <el-table-column
                prop="isSurvival"
                label="是否存活"
                align="center"
                fit
              >
                <template #default="scope">
                  <span>{{ scope.row ? '是' : '否' }}</span>
                </template>
              </el-table-column>
            </el-table>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, nextTick, watch, markRaw, onUnmounted } from 'vue'
import {
  getNowTroopsPaPd,
  getNowTroopsPaRatio
} from '@/service/analysisAssess.js'
import troopsAxisEcharts from './components/troops/troopsAxisEcharts.vue' //柱状图
const vueData = reactive({
  activeName: 'red',
  ownership: '', //表格查询-兵力归属
  name: '', //表格查询-name
  progressData: [], //试试兵力
  tableData: [] //表格数据
})

//点击tab切换
const handleClick = (item) => {
  vueData.activeName = item.paneName
  onSearch()
}

//实时兵力对比
const _getNowTroopsPaRatio = () => {
  getNowTroopsPaRatio({}).then((res) => {
    if (res.code != 200) {
      ElMessage.warning('获取数据失败，请稍后再试！')
      return
    }
    if (res.data && res.data.dataset) {
      vueData.progressData = res.data.dataset.tableData
    }
  })
}
//表格数据查询
const onSearch = () => {
  let param = {
    labelName: vueData.name, //名称
    targetCategoryType: vueData.ownership, //兵力所属
    side: vueData.activeName //所属红蓝
  }
  getNowTroopsPaPd(param).then((res) => {
    if (res.code != 200) {
      ElMessage.warning('获取数据失败，请稍后再试！')
      return
    }
    if (res.data && res.data.dataset) {
      vueData.tableData = res.data.dataset.tableData
    }
  })
}
onMounted(() => {
  onSearch()
  _getNowTroopsPaRatio()
})
const tableRowClassName = ({ row, rowIndex }) => {
  return rowIndex % 2 == 0 ? 'warning-row' : 'success-row'
}
</script>

<style lang="less" scoped>
.troops-Information {
  color: #fff;
  width: 100%;
  height: 100%;
}
.top-content {
  display: flex;
}
.top-content,
.bottom-content {
  height: 47%;
  width: 100%;
  overflow: hidden;
  padding: 6px 10px;
  box-sizing: border-box;
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
