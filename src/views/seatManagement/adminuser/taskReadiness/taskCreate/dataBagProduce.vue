<template>
  <div id="dataBagProduce">
    <div class="header">
      <span>
        <el-input
          v-model="vueData.search"
          :suffix-icon="Search"
          style="width: 200px"
          @change="_getTaskDataBagList"
        />
      </span>
      <span>
        <el-button type="primary" @click="_reportTaskDataBag"> 上报 </el-button>
        <el-button type="primary" @click="_releaseTaskDataBag">
          发布
        </el-button>
      </span>
    </div>
    <el-table
      :data="vueData.tableData"
      style="width: 100%"
      height="520"
      border
      @selection-change="getSelectTableRowData"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" width="55" label="序号" align="center" />
      <el-table-column prop="name" label="数据名称" align="center" />
      <el-table-column
        prop="type"
        label="数据类型"
        width="100"
        align="center"
      />
      <el-table-column prop="dataDescribe" label="数据描述" align="center" />
      <el-table-column
        prop="simulator"
        label="使用台位"
        width="180"
        align="center"
      />
      <el-table-column
        prop="size"
        label="数据大小"
        width="100"
        align="center"
      />
      <el-table-column
        prop="userName"
        label="使用人员"
        width="100"
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
    <el-dialog
      v-model="vueData.dialogVisible"
      title=""
      width="500"
      :before-close="handleClose"
    >
      <span>确认是否覆盖</span>
      <template #footer>
        <div class="dialog-footer">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="affirm"> 确定 </el-button>
        </div>
      </template>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage } from 'element-plus'
import { Search } from '@element-plus/icons-vue'
import selfPage from '@/components/page.vue'
import {
  getTaskDataBagList,
  reportTaskDataBag,
  releaseTaskDataBag
} from '@/service/taskManagement'

const emit = defineEmits()

const vueData = reactive({
  search: '',
  pageNum: 1,
  pageSize: 13,
  total: 10,
  tableData: [],
  tableSelection: [],
  dialogVisible: false,
  exist: 0,
  titleObj: ''
})

const store = useStore()

onMounted(() => {
  _getTaskDataBagList()
})

/**
 * @description 获取勾选的表格数据
 * @param { Array } selection 表格刚数据
 */
let getSelectTableRowData = (selection) => {
  vueData.tableSelection = selection
}

/**
 * @description 获取勾选数据ID
 * @return { Array } 数据ID
 */
let getTableSelectionId = () => {
  let id_array = []
  for (let i = 0; i < vueData.tableSelection.length; i++) {
    const element = vueData.tableSelection[i]
    id_array.push(element.id)
  }
  return id_array
}

/**
 * @description 获取任务数据包列表
 */
let _getTaskDataBagList = () => {
  let params = {
    name: vueData.search,
    scenarioId: store.getters.get_taskData.scenarioForm.id,
    pageNum: vueData.pageNum,
    pageSize: vueData.pageSize
  }
  getTaskDataBagList(params).then((res) => {
    if (res.code == 200) {
      vueData.tableData = res.data.records
      vueData.total = res.data.total
      store.getters.get_taskData.packageId = ''
      for (let i = 0; i < res.data.records.length; i++) {
        const element = res.data.records[i]
        store.getters.get_taskData.packageId += element.id + ';'
      }
    } else {
      ElMessage.error('任务数据包获取失败')
    }
  })
}

/**
 * @description 上报任务数据包
 */
let _reportTaskDataBag = () => {
  console.log(vueData.exist)
  vueData.dialogVisible = false
  let idArray = getTableSelectionId()
  // let params = { scenarioId: store.getters.get_taskData.scenarioId }
  let params = {
    scenarioId: store.getters.get_taskData.scenarioForm.id,
    ids: idArray,
    exist: vueData.exist,
    identifying: 1
  }
  reportTaskDataBag(params).then((res) => {
    vueData.exist = 0
    if (res.code == 200) {
      ElMessage.success('上报成功')
    } else {
      if (res.error == '数据已存在') {
        vueData.dialogVisible = true
        vueData.titleObj = '上报'
      } else {
        ElMessage.error(res.data)
      }
    }
  })
}

//确认
let affirm = () => {
  vueData.exist = 1
  vueData.dialogVisible = false
  if (vueData.titleObj == '上报') {
    _reportTaskDataBag()
  } else {
    _releaseTaskDataBag()
  }
}
//取消
let cancel = () => {
  // vueData.exist = 2
  vueData.dialogVisible = false
  // _releaseTaskDataBag()
}
/**
 * @description 发布任务数据包
 */
let _releaseTaskDataBag = () => {
  vueData.dialogVisible = false
  let idArray = getTableSelectionId()
  // let params = { scenarioId: store.getters.get_taskData.scenarioId }
  let params = {
    scenarioId: store.getters.get_taskData.scenarioForm.id,
    ids: idArray,
    exist: vueData.exist,
    identifying: 2
  }
  releaseTaskDataBag(params).then((res) => {
    vueData.exist = 0
    if (res.code == 200) {
      ElMessage.success('发布成功')
    } else {
      if (res.error == '数据已存在') {
        vueData.dialogVisible = true
        vueData.titleObj = '发布'
      } else {
        ElMessage.error(res.data)
      }
    }
  })
}

/**
 * @description 改变页数量
 * @param { Number } pageSize 页数量
 */
let changePageSize = (pageSize) => {
  vueData.pageSize = pageSize
}

/**
 * @description 切换页码
 * @param { Number } pageNum 页码
 */
let changePageNum = (pageNum) => {
  vueData.pageNum = pageNum
}
</script>

<style lang="less" scoped>
#dataBagProduce {
  padding: 10px;
  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
    :deep(.el-input) {
      .el-input__wrapper {
        border-radius: 5px;
        box-shadow: none;
        background-color: #2b4559 !important;
        box-shadow: 0 0 0 1px #075d89 inset !important;
      }
    }
    .el-button {
      background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
      width: 65px;
      height: 30px;
      color: #ffff;
      border-radius: 5px;
      margin-left: 10px;
      cursor: pointer;
    }
  }

  .page_box {
    margin-top: 10px;
    :deep(.el-pagination) {
      justify-content: flex-end;
    }
  }
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
</style>
