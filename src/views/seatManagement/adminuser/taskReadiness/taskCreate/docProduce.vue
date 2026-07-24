<template>
  <div id="docProduce">
    <div class="header">
      <span>
        <el-input
          v-model="vueData.search"
          :suffix-icon="Search"
          style="width: 200px"
          @change="_getTaskDocList"
        />
      </span>
      <span>
        <el-button type="primary" @click="_reportTaskDoc"> 上报 </el-button>
        <el-button type="primary" @click="_publishTaskDoc"> 发布 </el-button>
        <el-button
          type="danger"
          @click="_batchRemoveTaskDoc('')"
          class="delBtn"
        >
          删除
        </el-button>
      </span>
    </div>
    <el-table
      :data="vueData.tableData"
      style="width: 100%"
      height="510"
      border
      @selection-change="getSelectTableRowData"
    >
      <el-table-column type="selection" width="50" align="center" />
      <el-table-column type="index" width="55" label="序号" align="center" />
      <el-table-column prop="name" label="文书名称" align="center" />
      <el-table-column prop="type" label="文书类型" align="center" />
      <el-table-column
        prop="sendSeat"
        label="发送席位"
        width="100"
        align="center"
      />
      <el-table-column
        prop="sendTime"
        label="发送时间"
        width="180"
        align="center"
      />
      <el-table-column
        prop="receiveSeat"
        label="接收席位"
        width="100"
        align="center"
      />
      <el-table-column label="操作" width="120" align="center">
        <template #default="scope">
          <el-button
            link
            type="primary"
            size="small"
            @click="editDoc(scope.row, scope.$index)"
            >编辑</el-button
          >
          <el-button
            link
            type="danger"
            size="small"
            @click="_batchRemoveTaskDoc(scope.row)"
            >删除</el-button
          >
        </template>
      </el-table-column>
    </el-table>
    <selfPage
      class="page_box"
      :currentPage="vueData.pageNum"
      :pageSize="vueData.pageSize"
      :total="vueData.total"
      @handleSizeChange="changePageSize"
      @handleCurrentChange="changePageNum"
    ></selfPage>
    <!-- 编辑窗口 -->
    <ul class="editDoc_box" v-if="vueData.editDoc_box">
      <li class="header">
        <span style="color: #fff; font-size: 25px; margin-left: 10px"
          >文书编辑</span
        >
        <!-- <el-icon>
          <Close @click="vueData.editDoc_box = false" />
        </el-icon> -->
      </li>
      <!-- <li>
        <richText :content="vueData.content"></richText>
      </li> -->
      <li style="display: flex; justify-content: center">
        <el-form
          :model="vueData.form"
          label-width="auto"
          style="max-width: 600px"
        >
          <el-form-item label="文书名称：">
            <el-input v-model="vueData.form.name" />
          </el-form-item>
        </el-form>
      </li>
      <li class="footer">
        <el-button @click="vueData.editDoc_box = false">取消</el-button>
        <el-button type="primary" @click="documentSave">保存</el-button>
      </li>
    </ul>
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
import { ElMessage, ElMessageBox } from 'element-plus'
import { Search, Close } from '@element-plus/icons-vue'
import selfPage from '@/components/page.vue'
import richText from '@/components/communication/document/richText.vue'
import {
  getTaskDocList,
  batchRemoveTaskDoc,
  singleDelete,
  reportTaskDoc,
  publishTaskDoc
} from '@/service/taskManagement.js'

const emit = defineEmits()

const vueData = reactive({
  search: '',
  pageNum: 1,
  pageSize: 13,
  total: 10,
  tableData: [],
  editDoc_box: false,
  content: '',
  form: {
    name: ''
  },
  index: 0,
  dialogVisible: false,
  exist: 0
})

const store = useStore()

onMounted(() => {
  _getTaskDocList()
})

/**
 * @description 获取任务文书列表
 */
let _getTaskDocList = () => {
  let params = {
    name: vueData.search,
    scenarioId: store.getters.get_taskData.scenarioForm.id,
    pageNum: vueData.pageNum,
    pageSize: vueData.pageSize
  }
  getTaskDocList(params).then((res) => {
    if (res.code == 200) {
      vueData.tableData = res.data.records
      vueData.total = res.data.total
      store.getters.get_taskData.writId = ''
      for (let i = 0; i < res.data.records.length; i++) {
        const element = res.data.records[i]
        store.getters.get_taskData.writId += element.id + ';'
      }
    } else {
      ElMessage.error('任务文书列表获取失败')
    }
  })
}

/**
 * @description 删除任务文书
 * @param { Object } row 表格行数据
 */
let _batchRemoveTaskDoc = (row) => {
  let idArray = []
  console.log(row)
  idArray.push(row.id)

  ElMessageBox.confirm('确定删除数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      let idArray = []
      if (row != '') {
        idArray.push(row.id)
        let params = {
          id: row.id
        }

        singleDelete(params).then((res) => {
          if (res.code == 200) {
            _getTaskDocList()
            ElMessage.success('删除成功')
          } else {
            ElMessage.error(res.data)
          }
        })
      } else {
        idArray = getTableSelectionId()
        let params = { idArray }
        batchRemoveTaskDoc(idArray).then((res) => {
          if (res.code == 200) {
            _getTaskDocList()
            ElMessage.success('删除成功')
          } else {
            ElMessage.error(res.data)
          }
        })
      }
    })
    .catch(() => {
      ElMessage.info('取消删除')
    })
}

let documentSave = () => {
  vueData.tableData[vueData.index].name = vueData.form.name
  ElMessage.success('编辑成功')
  vueData.editDoc_box = false
}

/**
 * @description 文书上报
 */
let _reportTaskDoc = () => {
  vueData.dialogVisible = false
  let idArray = getTableSelectionId()
  // let params = { scenarioId: store.getters.get_taskData.scenarioId }
  let params = {
    scenarioId: store.getters.get_taskData.scenarioForm.id,
    ids: idArray,
    exist: vueData.exist,
    identifying: 1
  }
  reportTaskDoc(params).then((res) => {
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
    _reportTaskDoc()
  } else {
    _publishTaskDoc()
  }
}
//取消
let cancel = () => {
  // vueData.exist = 2
  vueData.dialogVisible = false
  // _releaseTaskDataBag()
}
/**
 * @description 文书发布
 */
let _publishTaskDoc = () => {
  vueData.dialogVisible = false
  let idArray = getTableSelectionId()
  // let params = { scenarioId: store.getters.get_taskData.scenarioId }
  let params = {
    scenarioId: store.getters.get_taskData.scenarioForm.id,
    ids: idArray,
    exist: vueData.exist,
    identifying: 2
  }
  publishTaskDoc(params).then((res) => {
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
 * @description 获取表格勾选的数据
 * @param { Array } selection 勾选的数据
 */
let getSelectTableRowData = (selection) => {
  vueData.tableSelection = selection
}

/**
 * @description 获取表格勾选的数据ID
 */
let getTableSelectionId = () => {
  let id_array = []
  for (let i = 0; i < vueData.tableSelection.length; i++) {
    const element = vueData.tableSelection[i]
    id_array.push(element.id)
  }
  console.log(id_array)
  return id_array
}

/**
 * @description 编辑任务文书
 * @param { Object } row 文书数据
 */
let editDoc = (row, idx) => {
  console.log(row, idx)
  vueData.index = idx
  vueData.form.name = row.name
  vueData.content = row.content
  vueData.editDoc_box = true
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
#docProduce {
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
    .delBtn {
      box-shadow: inset 0px 0px 15px 5px rgba(224, 18, 8, 0.46),
        inset 0px 0px 25px 3px rgba(224, 18, 8, 0.61);
      border: 1px solid #e03608;
    }
  }

  .page_box {
    margin-top: 10px;
    :deep(.el-pagination) {
      justify-content: flex-end;
    }
  }
  .editDoc_box {
    position: fixed;
    left: 58%;
    top: 60%;
    width: 650px;
    height: 210px;
    margin-top: -255px;
    margin-left: -500px;
    background-color: rgba(8, 36, 62, 0.7);
    z-index: 10;
    padding-left: 0px;
    li {
      padding: 0 10px;
    }
    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #2e4b64;
    }
    .footer {
      display: flex;
      justify-content: space-around;
      align-items: center;
      padding: 10px;
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
::v-deep .el-form .el-form-item__label {
  color: #fff; /* 你想要的文本颜色 */
}
</style>
