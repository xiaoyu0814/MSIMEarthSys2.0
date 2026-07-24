<template>
  <div id="taskCheck">
    <div class="header">
      <span>任务详情</span>
      <img
        src="~@/assets/images/rwty/arrows.svg"
        alt=""
        @click="closeTaskCheckBox"
      />
    </div>
    <!-- <div class="btnList">
        <el-button type="primary">新建</el-button>
        <el-button type="primary">编辑</el-button>
        <el-button type="danger">删除</el-button>
      </div> -->
    <div class="content">
      <div class="boxStyle">
        <p>回放记录</p>
        <div class="taskDescriptions">
          <el-table
            :data="vueData.tableData"
            style="width: 100%; background: #0c192a"
            border
            :header-cell-style="{
              'font-size': '15px',
              background: '#0B456B',
              color: '#fff',
              'border-bottom': '1px solid #416582'
            }"
            :cell-style="{
              background: '#0A233B',
              color: '#fff',
              'border-bottom': '1px solid #416582'
            }"
          >
            <el-table-column
              type="index"
              width="50"
              align="center"
              label="序号"
            />
            <el-table-column
              :show-overflow-tooltip="true"
              prop="emulationName"
              label="名称"
              width="300"
            >
            </el-table-column>
            <el-table-column prop="astronomyStartTime" label="开始时间">
              <template #default="scope">
                {{ _getDate(scope.row.astronomyStartTime) }}
              </template>
            </el-table-column>
            <el-table-column prop="astronomyEndTime" label="结束时间">
              <template #default="scope">
                {{
                  scope.row.astronomyEndTime
                    ? _getDate(scope.row.astronomyEndTime)
                    : ''
                }}
              </template>
            </el-table-column>
            <el-table-column label="操作">
              <template #default="scope">
                <el-button
                  type="text"
                  size="small"
                  @click="reviewRecords(scope.row)"
                  >复盘回放</el-button
                >
                <el-button type="text" size="small" @click="editor(scope.row)"
                  >编辑</el-button
                >
                <el-button
                  type="text"
                  size="small"
                  @click="deleteRecord(scope.row)"
                  >删除</el-button
                >
              </template>
            </el-table-column>
          </el-table>
        </div>
      </div>
      <selfPage
        class="page_box"
        :currentPage="vueData.pageNum"
        :pageSize="vueData.pageSize"
        :total="vueData.total"
        @handleSizeChange="changePageSize"
        @handleCurrentChange="changePageNum"
      ></selfPage>
    </div>
    <div class="editor-name" v-show="vueData.dialogVisible">
      <div class="header">
        <span>修改名称</span>
        <img
          src="~@/assets/images/rwty/closeBLConfig.svg"
          alt=""
          @click="closeDialog"
        />
      </div>
      <div class="name-content">
        <label>名称</label
        ><el-input type="text" v-model="vueData.editorData.nameText" />
      </div>
      <div class="dialog-footer">
        <el-button type="primary" @click="editorName"> 确定 </el-button>
        <el-button @click="vueData.dialogVisible = false">取消</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import {
  getRecordQueryPage,
  deleteRecordById,
  editRecord
} from '@/service/reviewSever'
import selfPage from '@/components/page.vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import emitter from '@/utils/eventbus'
const store = useStore()
const emit = defineEmits(['closeTaskCheckBox'])

const props = defineProps({
  taskData: {
    type: Object,
    defind: {}
  }
})

const vueData = reactive({
  currentTask: {},
  pageNum: 1,
  pageSize: 10,
  total: 100,
  tableData: [],
  dialogVisible: false,
  editorData: {
    nameText: '',
    id: ''
  }
})
// 获取任务记录列表
let _getTaskList = () => {
  let params = {
    pageNum: vueData.pageNum,
    pageSize: vueData.pageSize,
    taskId: vueData.currentTask.id
  }
  getRecordQueryPage(params).then((res) => {
    if (res.code == 200) {
      vueData.tableData = res.data.records
      vueData.total = res.data.total
    } else {
      ElMessage.error(res.data)
    }
  })
}
// 时间格式化
let _getDate = (time) => {
  if (time.indexOf('T') > -1 && time.indexOf('Z') > -1) {
    time = time.replace('T', ' ').replace('Z', '')
    let d = new Date(time)
    let year = d.getFullYear()
    let month =
      d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
    let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
    let hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
    let minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
    let second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
    return (
      year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
    )
  }
}
let changePageSize = (pageSize) => {
  vueData.pageSize = pageSize
  _getTaskList()
}
let changePageNum = (pageNum) => {
  vueData.pageNum = pageNum
  _getTaskList()
}
let reviewRecords = (row) => {
  emitter.emit('showReplayLine', true) // 显示复盘时间轴
  window.EarthViewer.timeline.container.style.zIndex = 1
  emitter.emit('hiddenBottom', false) // 隐藏底部选项框
  emitter.emit('leftComp', '') // 关闭左侧任务列表
  emitter.emit('scenarioExecution', false) // 关闭工具栏
  emit('closeTaskCheckBox', false) // 关闭任务记录回放详情页
  emitter.emit('closeTaskList', false) // 关闭任务列表
  store.commit('setRecordId', row.id)
  console.log('当前id', store.getters.getRecordId)
}
// 删除记录
let deleteRecord = (row) => {
  ElMessageBox.confirm('确定删除当前数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      let param = {
        id: row.id
      }
      deleteRecordById(param).then((res) => {
        if (res.code == 200) {
          vueData.pageNum = 1
          _getTaskList()
          vueData.pageNum = 1
          vueData.pageSize = 10
          ElMessage.success('删除成功')
        } else {
          ElMessage.error(res.data)
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}
// store.getters.get_taskData  当前选择的任务
onMounted(() => {
  vueData.currentTask = store.getters.get_taskData
  _getTaskList()
})
/**
 * @description 关闭任务查看窗口
 */
let closeTaskCheckBox = () => {
  emit('closeTaskCheckBox')
}
//提交编辑修改名称
const editorName = () => {
  let params = {
    id: vueData.editorData.id,
    emulationName: vueData.editorData.nameText
  }
  editRecord(params).then((res) => {
    if (res.code == 200) {
      ElMessage.success('名称修改成功!')
      closeDialog()
      _getTaskList()
    } else {
      ElMessage.error('名称修改失败!')
    }
  })
}
//关闭修改名称弹框
const closeDialog = () => {
  vueData.dialogVisible = false
  vueData.editorData.nameText = ''
}
//点击编辑按钮
const editor = (row) => {
  vueData.dialogVisible = true
  vueData.editorData.nameText = row.emulationName
  vueData.editorData.id = row.id
}
</script>

<style lang="less" scoped>
#taskCheck {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 1100px;
  height: 720px;
  margin-left: -520px;
  margin-top: -360px;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #2e4b64;
    padding: 10px;

    span {
      color: #c2d7ee;
      font-size: 16px;
      font-weight: bold;
    }

    img {
      cursor: pointer;
    }
  }

  .btnList {
    text-align: right;
    padding: 10px;
  }

  .content {
    height: 100%;

    .boxStyle {
      height: 580px;
      position: relative;
      border: 1px solid #2e4b64;
      margin: 20px 10px 10px;
      padding: 10px;
      box-sizing: border-box;

      p {
        position: absolute;
        left: 10px;
        top: -27px;
        color: #81d3f8;
        font-size: 16px !important;
      }

      .taskDescriptions {
        padding-top: 10px;

        :deep(.el-table) {
          --el-table-border-color: #416582 !important;
        }
      }
    }

    .page_box {
      // margin-top: 10px;
      padding: 10px 20px;

      :deep(.el-pagination) {
        justify-content: flex-end;
      }
    }
  }

  .editor-name {
    position: absolute;
    left: calc(50% - 220px);
    top: 15%;
    width: 440px;
    height: 150px;
    background-size: 100% 100%;
    z-index: 25;
    padding: 0;
    margin: 0;
    // margin-left: -500px;
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;

    .name-content {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin: 12px 28px;

      label {
        color: #fff;
        font-size: 18px;
        display: inline;
        margin-right: 50px;
      }

      :deep(.el-input) {
        width: 70%;

        .el-input__wrapper {
          border-radius: 5px;
          box-shadow: none;
          background-color: #2b4559 !important;
          box-shadow: 0 0 0 1px #075d89 inset !important;
        }

        .el-input__inner {
          color: #fff !important;
        }
      }
    }
  }
}
</style>
