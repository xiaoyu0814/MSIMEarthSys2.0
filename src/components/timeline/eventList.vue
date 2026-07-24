<template>
  <!-- 事件列表 -->
  <div class="eventListContainer">
    <div class="header">
      <span class="header-left">重要事件列表</span
      ><img
        src="@/assets/images/rwty/closeBLConfig.svg"
        @click="closePanel"
        style="position: absolute; right: 5px"
      />
    </div>
    <div class="content">
      <el-table
        :data="vueData.keyEventTable"
        style="width: 94%"
        show-overflow-tooltip
        :header-cell-style="{ color: '#FFFFFF' }"
        max-height="500px"
        @selection-change="handleCheck"
        ref="tableRef"
      >
        <el-table-column type="selection" width="30" />
        <el-table-column type="index" label="序号" width="50" align="center" />
        <el-table-column
          label="事件名称"
          prop="eventName"
          width="400"
          align="center"
        />
      </el-table>
      <selfPage
        class="page_box"
        :currentPage="vueData.pageNum"
        :pageSize="vueData.pageSize"
        :total="vueData.total"
        @handleSizeChange="changePageSize"
        @handleCurrentChange="changePageNum"
      ></selfPage>
    </div>
    <div class="apply_footer">
      <el-button type="primary" @click="submit">跳转</el-button>
      <el-button @click="closePanel">取消</el-button>
    </div>
  </div>
</template>

<script setup>
import { reactive, ref, toRefs, onMounted, watch } from 'vue'
import store from '@/store/index'
import { replayUpdateTime, getSimReplayEventPage } from '@/service/replayTime'
import { ElMessage, ElMessageBox } from 'element-plus'
import selfPage from '@/components/page.vue'
import emitter from '@/utils/eventbus'
import { date2String } from '@/utils/mapTools'
const vueData = reactive({
  currentChecked: [],
  keyEventTable: [],
  pageNum: 1,
  pageSize: 10,
  total: 20,
  pagerCount: 10,
  messageTime: 0
})
onMounted(() => {
  let params = {
    pageNum: vueData.pageNum,
    pageSize: vueData.pageSize,
    recordId: store.state.sceneModule.recordId
  }
  getKeyEventInforList(params)
})
const tableRef = ref()
const handleCheck = (val) => {
  if (val.length > 0) {
    if (val.length > 1) {
      tableRef.value.clearSelection()
      tableRef.value.toggleRowSelection(val.pop())
      vueData.currentChecked = val
    } else if (val.length == 1) {
      vueData.currentChecked = val
    }
  }
}
const changePageSize = (pageSize) => {
  vueData.pageSize = pageSize
  let params = {
    recordId: store.state.sceneModule.recordId,
    pageNum: vueData.pageNum,
    pageSize: vueData.pageSize
  }
  getKeyEventInforList(params)
}
const changePageNum = (value) => {
  vueData.pageNum = value
  let params = {
    recordId: store.state.sceneModule.recordId,
    pageNum: vueData.pageNum,
    pageSize: vueData.pageSize
  }
  getKeyEventInforList(params)
}
//获取关键事件基本信息列表
const getKeyEventInforList = (params) => {
  const loading = ElLoading.service({
    lock: true,
    text: '加载数据中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  getSimReplayEventPage(params).then((res) => {
    if (res.code == 200) {
      loading.close()
      vueData.keyEventTable = res.data.records
      console.log(vueData.keyEventTable)
      vueData.total = res.data.total
    }
  })
}
const submit = () => {
  if (vueData.currentChecked.length == 0) return
  let messageTime = vueData.currentChecked[0].messageTime
  const formData = new URLSearchParams()
  formData.append('recordId', store.state.sceneModule.recordId)
  formData.append('time', messageTime)
  replayUpdateTime(formData).then((res) => {
    if (res.code != 200) {
      ElMessage.error('事件跳转失败!')
      return
    }
    let timeStr = date2String(
      new Date(store.state.sceneModule.fightStartTime),
      messageTime * 1000
    )
    let newTimeStr = date2String(new Date(timeStr), 0)
    sceneTimeSkip(newTimeStr)
  })
}
const closePanel = () => {
  emitter.emit('showEventPanel', false) // 打开任务列表
}
const sceneTimeSkip = (newTimeStr) => {
  EarthViewer.clock.currentTime = MSIMEarth.JulianDate.fromDate(
    new Date(newTimeStr)
  )
  EarthViewer.clock.shouldAnimate = true
}
</script>

<style lang="less" scoped>
.eventListContainer {
  background-color: rgba(2, 33, 74, 1);
  width: 450px;
  position: fixed;
  bottom: 10%;
  right: 0;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  .header {
    // display: flex;
    // justify-content: space-between;
    // align-items: center;
    padding: 10px 15px;
    border-bottom: 1px solid #2671ac66;

    .header-left {
      font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
      font-weight: 700;
      font-style: normal;
      font-size: 19px;
      color: #c2d7ee;
    }
  }
  .apply_footer {
    padding: 20px 15px;
    display: flex;
    justify-content: flex-end;
  }
  .page_box {
    display: flex;
    justify-content: center;
    padding-top: 15px;
    :deep(.el-pagination) {
      justify-content: flex-end;
    }
  }
}
::v-deep(.el-tabs__item) {
  color: #ffffff;
}
::v-deep(.el-tabs__item.is-active) {
  color: #409eff;
}
::v-deep(.el-tabs__item:hover) {
  color: #409eff;
}

::v-deep(.el-checkbox) {
  color: #ffffff;
}
::v-deep .el-table td.el-table__cell,
::v-deep .el-table th.el-table__cell.is-leaf,
::v-deep .el-table__body-wrapper {
  background: #2b4559 !important;
  color: #a3a6ad;
}
.el-table {
  --el-table-border-color: #075d89;
}
::v-deep(.el-table th.el-table__cell:nth-child(1) .cell) {
  visibility: hidden;
}
</style>
