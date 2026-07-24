<template>
  <div class="arbitrationResult_box">
    <div class="header">
      <div class="title">裁决结果</div>
      <!-- <img src="@/assets/images/rwty/closeBLConfig.svg" @click="closePanel" /> -->
    </div>
    <div class="result_table">
      <el-table
        :data="state.resultTable"
        style="width: 100%"
        show-overflow-tooltip
        :header-cell-style="{ color: ' #FFFFFF' }"
        height="140px"
      >
        <el-table-column label="序号" width="40" type="index" align="center">
        </el-table-column>
        <el-table-column label="裁决发起方" width="100" align="center">
          <template #default="scope">
            {{ scope.row.eventMgt ? scope.row.eventMgt.eventOwner : '' }}
          </template>
        </el-table-column>
        <el-table-column label="关键事件" width="80" align="center">
          <template #default="scope">
            {{ scope.row.eventMgt ? scope.row.eventMgt.eventName : '' }}
          </template>
        </el-table-column>
        <el-table-column prop="details" label="裁决内容" align="center" />
        <el-table-column prop="voteCount" label="表决票数" align="center" />
        <el-table-column prop="viaCount" label="已通过" align="center" />
        <el-table-column prop="failCount" label="未通过" align="center" />
        <el-table-column label="执行状态" align="center">
          <template #default="scope">
            <el-tag
              type="success"
              size="small"
              v-if="
                scope.row.executionStatus == '0' &&
                (state.roleKey == 'pilotseat' || state.seatName == '裁判评估')
              "
              >已执行</el-tag
            >
            <el-tag
              type="danger"
              size="small"
              v-if="
                (scope.row.executionStatus == '1' &&
                  state.roleKey != 'pilotseat') ||
                (scope.row.ruleStatus == '2' &&
                  state.roleKey == 'pilotseat' &&
                  scope.row.executionStatus == '1')
              "
              >未执行</el-tag
            >
            <el-button
              link
              type="primary"
              size="small"
              @click.prevent="dispose_arbit(scope.row)"
              v-if="
                scope.row.executionStatus == '1' &&
                state.roleKey == 'pilotseat' &&
                ['0', '1'].includes(scope.row.ruleStatus)
              "
            >
              未执行
            </el-button>
          </template>
        </el-table-column>
        <el-table-column
          :label="
            state.seatName == '裁判评估'
              ? '操作'
              : state.roleKey == 'pilotseat'
              ? '状态'
              : ''
          "
          align="center"
        >
          <template #default="scope">
            <el-button
              link
              type="primary"
              size="small"
              @click.prevent="dispose_arbit(scope.row)"
              v-if="scope.row.ruleStatus == '2' && state.seatName == '裁判评估'"
            >
              裁决处理
            </el-button>
            <el-tag
              type="success"
              size="small"
              v-if="scope.row.ruleStatus == '0' && state.seatName == '裁判评估'"
              >已同意</el-tag
            >
            <el-tag
              type="danger"
              size="small"
              v-if="scope.row.ruleStatus == '1' && state.seatName == '裁判评估'"
              >已拒绝</el-tag
            >
            <!-- <el-tag
              type="success"
              size="small"
              v-if="
                scope.row.executionStatus == '0' &&
                (state.seatName == '导调控制' || state.seatName == '裁判评估')
              "
              >已执行</el-tag
            >
            <el-tag
              type="success"
              size="small"
              @click.prevent="dispose_arbit(scope.row)"
              v-if="
                scope.row.executionStatus == '1' &&
                (state.seatName == '导调控制' || state.seatName == '裁判评估')
              "
              >未执行</el-tag
            > -->
            <el-tag
              type="success"
              size="small"
              v-if="
                ['0', '1'].includes(scope.row.ruleStatus) &&
                state.roleKey == 'pilotseat'
              "
              >已处理</el-tag
            >
            <el-tag
              type="danger"
              size="small"
              v-if="state.roleKey == 'pilotseat' && scope.row.ruleStatus == '2'"
              >未处理</el-tag
            >
          </template>
        </el-table-column>
      </el-table>
      <selfPage
        class="page_box"
        :currentPage="state.pageNum"
        :pageSize="state.pageSize"
        :total="state.total"
        @handleSizeChange="changePageSize"
        @handleCurrentChange="changePageNum"
      ></selfPage>
    </div>
  </div>
  <arbitrationDispose
    v-if="state.showDispose"
    :currentRow="state.currentRow"
  ></arbitrationDispose>
  <!-- <eventClass v-if="state.showEventClass"></eventClass> -->
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'
import store from '@/store'
import arbitrationDispose from './arbitrationDispose.vue'
// import eventClass from './eventClass.vue'
import { getRuleListByRuleUserId } from '@/service/adjudication'
import selfPage from '@/components/page.vue'
const state = reactive({
  resultTable: [],
  showDispose: false,
  currentRow: {},
  showEventClass: false,
  seatName: localStorage.getItem('systemTitle'),
  pageNum: 1,
  pageSize: 5,
  total: 20,
  pagerCount: 10,
  roleKey: sessionStorage.getItem('roleKey') // pilotseat:导调控制    Commandseat：红方指挥控制席  Informationseat:红方情报系
})
// 同意
const dispose_arbit = (row) => {
  console.log('当前行', row)
  state.currentRow = row
  state.showDispose = true
}

emitter.on('sendShowDispose', (val) => {
  state.showDispose = val
  if (!val) {
    let pamras = {
      userId: sessionStorage.getItem('userId'),
      pageNum: state.pageNum,
      pageSize: state.pageSize
    }
    getApplyList(pamras)
  }
})
// emitter.on('sendShowEventClass', (val) => {
//   state.showEventClass = val
// })

onMounted(() => {
  let pamras = {
    userId: sessionStorage.getItem('userId'),
    pageNum: state.pageNum,
    pageSize: state.pageSize
  }
  getApplyList(pamras)
})
const getApplyList = (pamras) => {
  getRuleListByRuleUserId(pamras).then((res) => {
    if (res.code == 200) {
      state.resultTable = res.data.records
      state.total = res.data.total
    }
  })
}
const changePageSize = (pageSize) => {
  state.pageSize = pageSize
  let params = {
    userId: sessionStorage.getItem('userId'),
    pageNum: state.pageNum,
    pageSize: state.pageSize
  }
  getApplyList(params)
}
const changePageNum = (value) => {
  state.pageNum = value
  let params = {
    userId: sessionStorage.getItem('userId'),
    pageNum: state.pageNum,
    pageSize: state.pageSize
  }
  getApplyList(params)
}
const closePanel = () => {
  emitter.emit('showApplyList', false)
}
</script>

<style lang="less" scoped>
.arbitrationResult_box {
  position: absolute;
  left: calc(50% - 800px);
  bottom: 32px;
  color: #ffffff;
  width: 1600px;
  height: 230px;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  .header {
    .title {
      padding: 8px 20px;
      text-align: left;
      box-sizing: border-box;
      font-size: 15px;
      font-weight: bold;
      border-bottom: 1px solid #224d7c;
    }
    img {
      position: absolute;
      right: 10px;
      top: 10px;
    }
  }

  .result_table {
    padding: 10px;
    box-sizing: border-box;
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
  }
  :deep(.el-tag) {
    margin-left: 3px;
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
</style>
