<template>
  <div id="instructProduce">
    <div class="header">
      <span>
        <el-input
          v-model="vueData.search"
          :suffix-icon="Search"
          style="width: 200px"
          @change="_getTaskInstructList"
        />
      </span>
      <span>
        <el-button type="primary" @click="_reportTaskInstruct">
          上报
        </el-button>
        <el-button type="primary" @click="_releaseTaskInstruct">
          发布
        </el-button>
        <el-button
          type="danger"
          @click="_batchRemoveTaskInstruct('')"
          class="delBtn"
        >
          删除
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
      <el-table-column prop="name" label="指令名称" align="center" />
      <el-table-column prop="type" label="指令类型" align="center" />
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
            @click="editInstruct(scope.row, scope.$index)"
            >编辑</el-button
          >
          <el-button
            link
            type="danger"
            size="small"
            @click="_batchRemoveTaskInstruct(scope.row)"
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
    <ul class="edit_box" v-if="vueData.edit_box">
      <li class="header">
        <span style="color: #fff; font-size: 25px">指令编辑</span>
        <el-icon>
          <Close @click="vueData.edit_box = false" />
        </el-icon>
      </li>
      <li class="content" style="display: flex; justify-content: center">
        <el-form :model="vueData.instructInfo" label-width="120px">
          <el-form-item label="指令名称">
            <el-input v-model="vueData.instructInfo.name" />
          </el-form-item>
          <el-form-item label="区域">
            <el-select
              v-model="vueData.instructInfo.region"
              placeholder="请选择区域"
            >
              <el-option label="区域一" value="区域一" />
              <el-option label="区域二" value="区域二" />
            </el-select>
          </el-form-item>
          <el-form-item label="时间">
            <el-col :span="11">
              <el-date-picker
                v-model="vueData.instructInfo.date1"
                type="date"
                placeholder="请选择日期"
                style="width: 100%"
              />
            </el-col>
            <el-col :span="2" class="text-center">
              <span class="text-gray-500">-</span>
            </el-col>
            <el-col :span="11">
              <el-time-picker
                v-model="vueData.instructInfo.date2"
                placeholder="请选择时间"
                style="width: 100%"
              />
            </el-col>
          </el-form-item>
          <!-- <el-form-item label="Instant delivery">
            <el-switch v-model="vueData.instructInfo.delivery" />
          </el-form-item> -->
          <el-form-item label="性质">
            <el-checkbox-group v-model="vueData.instructInfo.type">
              <el-checkbox label="空中" name="type" />
              <el-checkbox label="海上" name="type" />
              <el-checkbox label="地面" name="type" />
              <!-- <el-checkbox label="Simple brand exposure"
                           name="type" /> -->
            </el-checkbox-group>
          </el-form-item>
          <el-form-item label="兵力">
            <el-radio-group v-model="vueData.instructInfo.resource">
              <el-radio label="有后备兵力" />
              <el-radio label="无后备兵力" />
            </el-radio-group>
          </el-form-item>
          <el-form-item label="描述">
            <el-input v-model="vueData.instructInfo.desc" type="textarea" />
          </el-form-item>
        </el-form>
      </li>
      <li class="footer">
        <el-button @click="vueData.edit_box = false">取消</el-button>
        <el-button type="primary" @click="instructSave">保存</el-button>
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
import {
  getTaskInstructList,
  batchRemoveTaskInstruct,
  batchTaskInstructObj,
  reportTaskInstruct,
  releaseTaskInstruct
} from '@/service/taskManagement'

const emit = defineEmits()

const vueData = reactive({
  search: '',
  pageNum: 1,
  pageSize: 13,
  total: 10,
  tableData: [],
  tableSelection: [],
  edit_box: false,
  instructInfo: {
    name: '',
    region: '',
    date1: '',
    date2: '',
    delivery: false,
    type: [],
    resource: '',
    desc: ''
  },
  index: 0,
  dialogVisible: false,
  exist: 0
})

const store = useStore()

onMounted(() => {
  _getTaskInstructList()
})

let instructSave = () => {
  ElMessage.success('编辑成功')
  vueData.edit_box = false
  vueData.tableData[vueData.index].name = vueData.instructInfo.name
}

/**
 * @description 获取指令数据列表
 */
let _getTaskInstructList = () => {
  let params = {
    name: vueData.search,
    scenarioId: store.getters.get_taskData.scenarioForm.id,
    pageNum: vueData.pageNum,
    pageSize: vueData.pageSize
  }
  getTaskInstructList(params).then((res) => {
    if (res.code == 200) {
      vueData.tableData = res.data.records
      vueData.total = res.data.total
      store.getters.get_taskData.orderId = ''
      for (let i = 0; i < res.data.records.length; i++) {
        const element = res.data.records[i]
        store.getters.get_taskData.orderId += element.id + ';'
      }
    } else {
      ElMessage.error('任务指令列表获取失败')
    }
  })
}

/**
 * @description 删除指令数据
 * @param { Object } row 指令数据
 */
let _batchRemoveTaskInstruct = (row) => {
  ElMessageBox.confirm('确定删除数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      let idArray = []
      if (row) {
        idArray.push(row.id)
        let params = {
          id: row.id
        }
        batchTaskInstructObj(params).then((res) => {
          if (res.code == 200) {
            ElMessage.success('删除成功')
            _getTaskInstructList()
          } else {
            ElMessage.error(res.data)
          }
        })
      } else {
        idArray = getTableSelectionId()
        let params = { ids: idArray }
        batchRemoveTaskInstruct(idArray).then((res) => {
          if (res.code == 200) {
            ElMessage.success('删除成功')
            _getTaskInstructList()
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

/**
 * @description 上报任务指令
 */
let _reportTaskInstruct = () => {
  vueData.dialogVisible = false
  let idArray = getTableSelectionId()
  // let params = { scenarioId: store.getters.get_taskData.scenarioId }
  let params = {
    scenarioId: store.getters.get_taskData.scenarioForm.id,
    ids: idArray,
    exist: vueData.exist,
    identifying: 1
  }
  reportTaskInstruct(params).then((res) => {
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
    _reportTaskInstruct()
  } else {
    _releaseTaskInstruct()
  }
}
//取消
let cancel = () => {
  // vueData.exist = 2
  vueData.dialogVisible = false
  // _releaseTaskDataBag()
}
/**
 * @description 发布任务指令
 */
let _releaseTaskInstruct = () => {
  vueData.dialogVisible = false
  let idArray = getTableSelectionId()
  // let params = { scenarioId: store.getters.get_taskData.scenarioId }
  let params = {
    scenarioId: store.getters.get_taskData.scenarioForm.id,
    ids: idArray,
    exist: vueData.exist,
    identifying: 2
  }
  releaseTaskInstruct(params).then((res) => {
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
 * @description 编辑指令
 * @param { Object } row 指令数据
 */
let editInstruct = (row, idx) => {
  // vueData.instructInfo = row;
  vueData.instructInfo.name = row.name
  vueData.index = idx
  vueData.edit_box = true
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
#instructProduce {
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

  .edit_box {
    position: fixed;
    left: 50%;
    top: 50%;
    width: 1000px;
    height: 510px;
    margin-top: -255px;
    margin-left: -500px;
    background-color: rgba(8, 36, 62, 0.7);
    z-index: 10;
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
