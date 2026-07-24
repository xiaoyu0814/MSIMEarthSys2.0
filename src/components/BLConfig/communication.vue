<template>
  <div class="communication">
    <el-divider content-position="left">{{ props.item.title }}</el-divider>
    <div class="communication-content">
      <el-table
        :data="vueData.tableData"
        border
        style="width: 100%"
        :row-class-name="rowStyle"
        :header-cell-style="{ background: '#2b4559', color: ' #FFFFFF' }"
      >
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          align="center"
          v-for="(item, index) in vueData.tableHeader"
          :key="index"
          show-overflow-tooltip
        />
        <!-- <el-table-column label="操作" width="60" align="center">
          <template #default="scope">
            <el-button
              size="small"
              type="danger"
              link
              @click="handleDelete(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column> -->
      </el-table>
      <!-- <div class="tx-btn">
        <img
          src="@/assets/images/rwty/tx-icons.svg"
          v-if="props.item.name == '通信'"
        />
        <span>{{ props.item.name == '通信' ? '添加关系' : '添加下属' }}</span>
      </div> -->
    </div>
  </div>
</template>
<script setup>
import { reactive, onBeforeMount, onMounted, ref, watch } from 'vue'
import store from '@/store/index.js'
import { BLConfigData } from './BLConfigjason'
const props = defineProps({
  item: {
    type: Object,
    default: {}
  },
  node: {
    type: Object,
    default: {}
  }
})
let vueData = reactive({
  BLConfigData,
  tableHeader: [
    { prop: 'comObject', label: '通信对象' },
    { prop: 'channel', label: '频道' }
  ],
  tableData: [
    { comObject: 'XXX', channel: '121' },
    { comObject: 'XXX', channel: '123' }
  ]
})
/**
 * @description 删除
 * @param {*} index
 * @param {*} row
 * @return {*}
 */
const handleDelete = (index, row) => {
  // console.log(index, row)
}
const rowStyle = ({ row, rowIndex }) => {
  if (rowIndex % 2 == 1) {
    // console.log(rowIndex);
    return 'cellStyle'
  } else return 'cellStyle1'
}

watch(
  () => props.node,
  (nVal) => {
    if (props.item.name == '下属') {
      vueData.tableHeader = [
        {
          prop: 'name',
          label: '名称'
        }
      ]
      vueData.tableData = nVal.children
    } else {
      vueData.tableHeader = BLConfigData[props.item.name].tableHeader
      // vueData.tableData = BLConfigData[props.item.name].tableData
      vueData.tableData = nVal.Comm
    }
  },
  { immediate: true, deep: true }
)
</script>
<style lang="less" scoped>
.communication {
  .el-divider {
    border-top: 1px solid #0b3855;
    margin: 15px 0;

    :deep(.el-divider__text) {
      background-color: transparent !important;
      font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
      font-weight: 700;
      font-style: normal;
      font-size: 16px;
      color: #c2d7ee;
      left: 0 !important;
    }
  }
  :deep(
      .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell
    ) {
    background-color: #40a0ff3d !important;
  }
  .communication-content {
    padding: 10px;

    :deep(.el-table) {
      --el-table-border-color: #075d89 !important;
      --el-table-text-color: #ffffff;

      .cellStyle {
        background-color: #2b4559 !important;
        font-family: 'Arial Normal', 'Arial';
        font-weight: 400;
        font-style: normal;
        font-size: 13px;
        letter-spacing: normal;
      }

      .cellStyle1 {
        background-color: #1c2f42 !important;
        font-family: 'Arial Normal', 'Arial';
        font-weight: 400;
        font-style: normal;
        font-size: 13px;
        letter-spacing: normal;
      }
    }

    .tx-btn {
      background-image: url(@/assets/images/rwty/tx-btn.svg);
      width: 178px;
      height: 33px;
      margin: auto;
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;

      span {
        display: inline-block;
        color: #ffffff;
        padding-left: 10px;
      }
    }
  }
}
</style>
