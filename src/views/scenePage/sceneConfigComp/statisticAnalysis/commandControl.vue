<template>
  <div class="command-control">
    <el-table
      ref="multipleTableRef"
      :data="state.tableData"
      style="width: 100%"
      stripe
      :header-cell-style="{ color: 'white', backgroundColor: 'rgba(0,0,0,0)' }"
      @selection-change="handleSelectionChange"
    >
      <el-table-column type="selection" width="55" />
      <el-table-column label="指令时间">
        <template #default="scope">{{ scope.row.time }}</template>
      </el-table-column>
      <el-table-column property="Sender" label="发送方" />
      <el-table-column
        property="receiver"
        label="接收方"
        show-overflow-tooltip
      />
      <el-table-column
        property="implementation"
        label="执行情况"
        show-overflow-tooltip
      />
    </el-table>
    <el-pagination
      v-model:current-page="state.currentPage"
      v-model:page-size="state.pageSize"
      :small="false"
      :disabled="false"
      :background="false"
      layout="total, prev, pager, next, jumper"
      :total="state.total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
    />
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'

const state = reactive({
  tableData: [
    {
      time: '00:01',
      Sender: '总指挥',
      receiver: '红方指挥员',
      implementation: '完成'
    },
    {
      time: '00:10',
      Sender: '总指挥',
      receiver: '蓝方指挥员',
      implementation: '完成'
    },
    {
      time: '01:00',
      Sender: '组训参谋',
      receiver: '红方指挥员',
      implementation: '完成'
    },
    {
      time: '01:30',
      Sender: '组训参谋',
      receiver: '蓝方指挥员',
      implementation: '完成'
    },
    {
      time: '03:09',
      Sender: '组训参谋',
      receiver: '全体指挥员',
      implementation: '完成'
    },
    {
      time: '03:30',
      Sender: '红方指挥员',
      receiver: '红方作训席',
      implementation: '完成'
    },
    {
      time: '03:40',
      Sender: '蓝方指挥员',
      receiver: '蓝方作训席',
      implementation: '完成'
    },
    {
      time: '05:10',
      Sender: '导控席',
      receiver: '红方指挥员',
      implementation: '完成'
    },
    {
      time: '05:30',
      Sender: '导控席',
      receiver: '蓝方指挥员',
      implementation: '完成'
    },
    {
      time: '08:40',
      Sender: '导控席',
      receiver: '红方指挥员',
      implementation: '完成'
    },
    {
      time: '09:10',
      Sender: '导控席',
      receiver: '蓝方指挥员',
      implementation: '完成'
    }
  ],
  currentPage: 1,
  pageSize: 11,
  total: 20
})
onMounted(() => {
  state.currentPage = 1
  state.pageSize = 11
  state.total = state.tableData.length
})
const handleSelectionChange = () => {}
const handleSizeChange = () => {}
const handleCurrentChange = () => {}
</script>

<style lang="less" scoped>
.command-control {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-end;
  padding: 10px;
  box-sizing: border-box;

  :deep(.el-table) {
    background: rgba(0, 0, 0, 0);
    color: white;
  }

  :deep(.el-table thead) {
    color: white;
    background: #387ca6;
  }

  :deep(.el-table tr) {
    background: rgba(0, 0, 0, 0);
  }

  :deep(.el-table__body tr.el-table__row--striped td) {
    background-color: rgba(17, 33, 111, 0.5);
  }

  :deep(.el-table__body tr:hover > td) {
    background-color: rgb(2, 26, 70, 1) !important;
  }
}
</style>
