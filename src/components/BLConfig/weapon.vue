<template>
  <div class="weapon">
    <el-divider content-position="left">{{ props.item.title }}</el-divider>
    <div class="weapon-content">
      <!-- <div class="weapon-select">
        <span class="item-span">雷达型号：</span>
        <el-select
          v-model="vueData.optionItem"
          class="m-2"
          placeholder="Select"
        >
          <el-option
            v-for="item in vueData.options"
            :key="item"
            :label="item.name"
            :value="item"
          />
        </el-select>
        <span class="item-span">
          <img
            style="cursor: pointer"
            src="@/assets/images/rwty/big-tj.svg"
            @click="addWeapon(item)"
        /></span>
        <span class="item-span">{{ vueData.optionItem }}</span>
      </div> -->
      <el-table
        :data="vueData.tableData"
        border
        style="width: 100%"
        :row-class-name="rowStyle"
        :header-cell-style="{ background: '#2b4559', color: ' #FFFFFF' }"
      >
        <el-table-column type="index" width="50" align="center" />
        <el-table-column
          :prop="item.prop"
          :label="item.label"
          align="center"
          v-for="(item, index) in vueData.tableHeader"
          :key="index"
          show-overflow-tooltip
        />
      </el-table>
    </div>
  </div>
</template>
<script setup>
import { useStore } from 'vuex'
import { reactive, onMounted, ref, watch } from 'vue'
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
const store = useStore()
let vueData = reactive({
  tableHeader: [
    { prop: 'Name', label: '名称' },
    { prop: 'Type', label: '类型' },
    { prop: 'PR', label: '威力范围' },
    { prop: 'CR', label: '视锥半径' }
  ],
  tableData: [],
  options: [
    {
      name: 'AN_MPQ-65',
      enName: 'AN_MPQ-65',
      type: 'AN_MPQ-65'
    },
    {
      name: 'GEO_AA_RADAR',
      enName: 'GEO_AA_RADAR',
      type: 'GEO_AA_RADAR'
    }
  ],
  optionItem: ''
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
    return 'cellStyle'
  } else return 'cellStyle1'
}

/***
 *@description 添加雷达
 *
 *
 */
const addWeapon = () => {
  console.log('addWeapon', vueData.optionItem)
  vueData.tableData.push({ ...vueData.optionItem })
  let pCGF = store.getters.get_CGF_data
}
watch(
  () => props.node,
  (nVal) => {
    vueData.tableData = nVal.Weapons
  },
  { immediate: true, deep: true }
)
</script>
<style lang="less" scoped>
.weapon {
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
    background-color: #42a1ff3d !important;
  }

  .weapon-content {
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

    .weapon-select {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;

      .m-2 {
        width: 60%;
      }
    }

    .item-span {
      display: inline-block;
      text-align: left;
      color: #ffffff;
      font-size: 16px;
    }

    .el-select {
      width: 100%;
      // padding-left: 15px;

      // :deep(.el-input) {
      :deep(.el-input__wrapper) {
        background-color: #2b4559 !important;
        box-shadow: 0 0 0 1px #075d89 inset !important;

        .el-input__inner {
          color: #ffffff;
        }
      }
    }
  }
}
</style>
