<template>
  <div class="keyEvent_box">
    <div class="title">关键事件</div>
    <div class="keyEvent_table">
      <el-table
        :data="state.keyEventTable"
        style="width: 100%"
        show-overflow-tooltip
        :header-cell-style="{ color: ' #FFFFFF' }"
        height="140px"
      >
        <el-table-column prop="name" label="关键事件" align="center" />
        <el-table-column prop="time" label="时间" align="center" />
        <el-table-column prop="type" label="类型" align="center" />
        <el-table-column prop="sendSide" label="发起方" align="center" />
        <el-table-column prop="getSide" label="接收方" align="center" />
        <el-table-column prop="content" label="内容" align="center" />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'
import store from '@/store'
const state = reactive({
  keyEventTable: [
    {
      name: '自由文电',
      time: '2024-03-07 10:00:00',
      type: '自由文电',
      sendSide: '导演部席位',
      getSide: '导演部席位',
      content: '发送一条自由文电：31231'
    },
    {
      name: '自由文电',
      time: '2024-03-07 10:00:00',
      type: '自由文电',
      sendSide: '导演部席位',
      getSide: '导演部席位',
      content: '发送一条自由文电：31231'
    },
    {
      name: '自由文电',
      time: '2024-03-07 10:00:00',
      type: '自由文电',
      sendSide: '导演部席位',
      getSide: '导演部席位',
      content: '发送一条自由文电：31231'
    },
    {
      name: '自由文电',
      time: '2024-03-07 10:00:00',
      type: '自由文电',
      sendSide: '导演部席位',
      getSide: '导演部席位',
      content: '发送一条自由文电：31231'
    },
    {
      name: '自由文电',
      time: '2024-03-07 10:00:00',
      type: '自由文电',
      sendSide: '导演部席位',
      getSide: '导演部席位',
      content: '发送一条自由文电：31231'
    },
    {
      name: '自由文电',
      time: '2024-03-07 10:00:00',
      type: '自由文电',
      sendSide: '导演部席位',
      getSide: '导演部席位',
      content: '发送一条自由文电：31231'
    }
  ]
})

onMounted(() => {})
</script>

<style lang="less" scoped>
.keyEvent_box {
  position: absolute;
  left: calc(50% - 800px);
  bottom: 32px;
  color: #ffffff;
  width: 1600px;
  height: 200px;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  .title {
    padding: 8px 20px;
    text-align: left;
    box-sizing: border-box;
    font-size: 15px;
    font-weight: bold;
    border-bottom: 1px solid #224d7c;
  }
  .keyEvent_table {
    padding: 10px;
    box-sizing: border-box;
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
}
</style>
