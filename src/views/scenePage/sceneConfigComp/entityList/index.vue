<template>
  <div class="entityList">
    <div class="title">
      实体清单
      <img
        src="@/assets/image/panelIcons/关闭icon.png"
        alt=""
        class="close_sty"
        @click="handleClose"
      />
    </div>
    <div class="entityList_content">
      <el-tabs
        v-model="state.activeName"
        class="demo-tabs"
        @tab-change="handleChange"
      >
        <el-tab-pane label="红  方" name="red"> </el-tab-pane>
        <el-tab-pane label="蓝  方" name="blue"> </el-tab-pane>
      </el-tabs>
      <el-table
        :data="state.entityListTable"
        style="width: 100%"
        show-overflow-tooltip
        :header-cell-style="{ color: ' #FFFFFF' }"
        max-height="500px"
      >
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column prop="name" label="名称" align="center" />
        <el-table-column prop="type" label="型号" align="center" />
        <el-table-column prop="number" label="生命值" align="center" />
        <el-table-column prop="oil" label="油量" align="center" />
        <el-table-column prop="position" label="位置" align="center" />
        <el-table-column prop="height" label="高度" align="center" />
        <el-table-column prop="speed" label="速度" align="center" />
        <el-table-column prop="command" label="行为" align="center" />
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
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'
import selfPage from '@/components/page.vue'
import emitter from '@/utils/eventbus'
import store from '@/store'
const state = reactive({
  entityListTable: [
    {
      name: 'test1',
      type: 'test1',
      number: '20',
      oil: '30',
      position: '127.232,25.245',
      height: '3353',
      speed: '235',
      command: '---'
    },
    {
      name: 'test2',
      type: 'test2',
      number: '70',
      oil: '30',
      position: '127.232,25.245',
      height: '3353',
      speed: '235',
      command: '---'
    },
    {
      name: 'test3',
      type: '未知',
      number: '100',
      oil: '30',
      position: '127.232,25.245',
      height: '3353',
      speed: '235',
      command: '---'
    },
    {
      name: 'test4',
      type: 'test4',
      number: '70',
      oil: '30',
      position: '127.232,25.245',
      height: '3353',
      speed: '235',
      command: '---'
    },
    {
      name: 'test5',
      type: 'test5',
      number: '40',
      oil: '30',
      position: '127.232,25.245',
      height: '3353',
      speed: '235',
      command: '---'
    },
    {
      name: 'test6',
      type: '位置',
      number: '50',
      oil: '30',
      position: '127.232,25.245',
      height: '3353',
      speed: '235',
      command: '---'
    }
  ],
  activeName: 'red',
  pageNum: 1,
  pageSize: 10,
  total: 20
})
/**
 * tab页切换
 */
const handleChange = (tab) => {
  console.log(tab) // red  blue
}
// 分页器事件
const changePageSize = (pageSize) => {
  state.pageSize = pageSize
}
const changePageNum = (value) => {
  state.pageNum = value
}
// 关闭
const handleClose = () => {
  emitter.emit('closeBottomControlPanel', 'three')
}
onMounted(() => {})
</script>

<style lang="less" scoped>
.entityList {
  z-index: 10;
  position: absolute;
  left: calc(50% - 700px);
  top: calc(50% - 340px);
  color: #ffffff;
  width: 1400px;
  height: 700px;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  box-sizing: border-box;
  .title {
    padding: 12px 20px;
    text-align: left;
    box-sizing: border-box;
    font-size: 20px;
    font-weight: bold;
    border-bottom: 1px solid #224d7c;
    .close_sty {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 17px;
      right: 20px;
      cursor: pointer;
    }
  }
  .entityList_content {
    padding: 20px;
    box-sizing: border-box;
    height: calc(100% - 53px);
    position: relative;
    // tab切换
    :deep(.el-tabs__item) {
      color: #a0abb8 !important;
      padding-left: 25px;
      font-size: 16px;
    }
    :deep(.el-tabs__item.is-active) {
      color: #ffffff !important;
      padding-left: 25px;
      font-size: 16px;
      font-weight: 500 !important;
    }
    :deep(.el-tabs__active-bar) {
      left: -6px !important;
      width: 50px !important;
    }
    :deep(.el-tabs__nav-wrap::after) {
      height: 2px !important;
      background-color: #2671ac66;
    }
    // 表格
    ::v-deep .el-table td.el-table__cell,
    ::v-deep .el-table th.el-table__cell.is-leaf,
    ::v-deep .el-table__body-wrapper {
      background: #2b4559 !important;
      color: #a3a6ad;
    }
    .el-table {
      --el-table-border-color: #075d89;
    }
    // 分页器
    .page_box {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      padding-top: 15px;
      position: absolute;
      bottom: 25px;
      right: 25px;
      :deep(.el-pagination) {
        justify-content: flex-end;
      }
    }
  }
}
</style>
