<template>
  <div class="Tables">
    <!-- {{props.groupData}} -->
    <el-table
      :data="props.groupData"
      border
      style="width: 100%"
      show-overflow-tooltip
      :row-class-name="rowStyles"
      :max-height="200"
      :header-cell-style="{ background: '#2b4559', color: ' #FFFFFF' }"
      v-if="props.tableEdit"
      @cell-dblclick="cellClick"
    >
      <el-table-column type="index" width="50" align="center" />
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        align="center"
        v-for="(item, index) in props.groupDataHeader"
        :key="index"
      >
        <template #default="scope">
          <span v-if="!vueData.showInput">{{ scope.row[item.prop] }}</span>
          <el-input
            v-model="scope.row[item.prop]"
            placeholder="请输入内容"
            v-if="vueData.showInput"
            @blur="leaveTable"
          ></el-input>
        </template>
      </el-table-column>
    </el-table>

    <el-table
      :data="props.groupData"
      border
      style="width: 100%"
      :max-height="200"
      :row-class-name="rowStyle"
      :header-cell-style="{ background: '#2b4559', color: ' #FFFFFF' }"
      v-else
    >
      <el-table-column type="index" width="30" align="center" />
      <el-table-column
        :prop="item.prop"
        :label="item.label"
        align="center"
        v-for="(item, index) in props.groupDataHeader"
        :key="index"
      />
    </el-table>
  </div>
</template>
<script setup>
import { useStore } from 'vuex'
import { reactive, onMounted, ref, onBeforeMount, watch } from 'vue'
const store = useStore()
const props = defineProps({
  //表格数据
  groupData: {
    default: [],
    type: Array
  },
  //表头
  groupDataHeader: {
    type: Array
  },
  tableEdit: {
    type: Boolean
  }
})
let vueData = reactive({
  showInput: false,
  showEditeTable: false
})
const cellClick = () => {
  vueData.showInput = true
}
const leaveTable = () => {
  vueData.showInput = false
  console.log(props.groupData)
}
const rowStyle = ({ row, rowIndex }) => {
  if (rowIndex % 2 == 1) {
    return 'cellStyle'
  } else return 'cellStyle1'
}
const rowStyles = ({ row, rowIndex }) => {
  return 'cellStyle'
}
onMounted(() => {})
</script>
<style lang="less" scoped>
.Tables {
  :deep(table) {
    border-color: #075d89 !important;
  }

  table[border]:not([border='0']):not([style*='border-color']) td,
  table[border]:not([border='0']):not([style*='border-color']) th {
    border-color: #075d89 !important;
    color: #ffff;
    background-color: #2b4559;
  }

  table:not([cellpadding]) td,
  table:not([cellpadding]) th {
    // padding: 2px 0;
    // height: 32px;
    // font-size:14px;
  }

  .el-input {
    // padding-left: 15px;

    :deep(.el-input__wrapper) {
      background-color: #2b4559 !important;
      box-shadow: 0 0 0 0;

      .el-input__inner {
        color: #ffffff;
        text-align: center;
      }
    }
  }

  :deep(
      .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell
    ) {
    background-color: #40a0ff3d !important;
  }
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
}
</style>
