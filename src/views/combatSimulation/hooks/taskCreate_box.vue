<template>
  <div id="taskCreate_box">
    <div class="header">
      <span>{{ props.createOrEdit }}</span>
      <img
        src="~@/assets/image/panelIcons/关闭icon.png"
        alt=""
        @click="closeTaskCreateBox"
      />
    </div>
    <div class="content">
      <div class="center">
        <el-table
          :data="vueData.tableData"
          style="width: 100%"
          height="520"
          border
        >
          <el-table-column
            type="index"
            width="55"
            label="序号"
            align="center"
          />
          <el-table-column prop="name" label="样本名称" align="center" />
          <!-- <el-table-column prop="" label="测控数传频次" align="center" /> -->
          <!-- <el-table-column prop="" label="不同时效性任务占比" align="center" />
          <el-table-column
            prop=""
            label="不同侦查频次任务占比"
            align="center"
          />
          <el-table-column
            prop=""
            label="不同侦查时间间隔任务占比"
            align="center"
          /> -->
          <!-- <el-table-column
            prop=""
            label="地面站网资源预分配比例"
            align="center"
          />
          <el-table-column prop="" label="网格尺寸" align="center" />
          <el-table-column prop="" label="热力图更新频次" align="center" /> -->
          <!-- <el-table-column
            prop="Time"
            label="实验进程"
            align="center"
           >
             <template #default="scope">
              <el-progress
                  :text-inside="true"
                  :stroke-width="20"
                  :percentage="scope.sim_progress"
                />
                </template>
          </el-table-colum> -->

          <el-table-column label="操作" align="center" width="200px">
            <template #default="scope">
              <el-button
                link
                type="primary"
                size="small"
                @click="lookInstruct(scope.row)"
                >样本详情</el-button
              >
              <el-button
                link
                type="primary"
                size="small"
                @click="lookDataPop(scope.row)"
                >样本数据</el-button
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
      </div>
    </div>

    <!-- 实验样本弹窗数据 -->
    <el-dialog
      v-model="vueData.isDataPop"
      :title="vueData.dataPopTitle"
      width="500px"
      class="dialog-box"
      style="background: #2b4559 !important; color: #fff"
      append-to-body
      @close="closeIsDataPop"
    >
      <seatConfig
        :createOrData="vueData.createOrData"
        @closeDataCreateBox="closeDataCreateBox"
      ></seatConfig>
    </el-dialog>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import selfPage from '@/components/page.vue'
import seatConfig from '../components/seatConfig.vue'
import {
  createTask,
  updataTask,
  getSeatCheckUser
} from '@/service/taskManagement'
import { eventControllerSSEClose } from '@/utils/mapTools'
const vueData = reactive({
  createTaskInfo: {
    taskName: '',
    taskType: '',
    taskDescription: ''
  },
  isDataPop: false,
  dataPopTitle: '',
  createOrData: {},
  // tableData: [
  //   {
  //     name: 'FJZZ实验计划模板',
  //     type: 'FJ场景',
  //     Time: '2024-02-21 10:00:00'
  //   },
  //   {
  //     name: 'FJZZ实验计划模板02',
  //     type: 'FJ场景02',
  //     Time: '2024-02-21 10:00:00'
  //   }
  // ],
  // selectvalue: '',
  // options: [
  //   {
  //     value: '反舰场景实验计划模板',
  //     label: '反舰场景实验计划模板'
  //   }
  // ],
  tableData: [],
  pageNum: 1,
  pageSize: 13,
  total: 10
})

const store = useStore()

const emit = defineEmits()

const props = defineProps({
  createOrEdit: {
    type: String,
    defind: {}
  }
})

onMounted(() => {
  if (store.getters.get_taskData.id) {
    vueData.createTaskInfo.taskName = store.getters.get_taskData.name
    vueData.createTaskInfo.taskType = store.getters.get_taskData.typeId
    vueData.createTaskInfo.taskDescription =
      store.getters.get_taskData.description
  }
})

/**
 * @description 查看
 * @param { Object } row
 */
let lookInstruct = (row) => {
  store.commit('set_isSampleDetailData', row)
  store.commit('set_isSampleDetail', true)
  store.commit('set_isSimulationList', false)
  store.commit('set_isSamplelist', false)
  connectScene()
}
/**
 * 样本数据
 */
const lookDataPop = (row) => {
  vueData.isDataPop = true
  vueData.dataPopTitle = row.name
  vueData.createOrData = row
}
/**
 * 实验详情弹窗
 */
const closeDataCreateBox = () => {
  vueData.isDataPop = false
}

/**
 * 实验详情显隐点击事件
 */
const closeTaskCreateBox = () => {
  store.commit('set_isSampleDetail', false)
  store.commit('set_isSamplelist', false) //实验样本列表
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

//监测样本详情页面
watch(
  () => store.getters.get_isSampleData,
  (newVal) => {
    vueData.tableData = newVal
  },
  { deep: true, immediate: true }
)
/**
 * 场景连接
 */
const connectScene = (row) => {
  if (EventController) {
    eventControllerSSEClose(EventController)
  }
  EventController = new window.EarthPlugn.EventSourceController({
    baseUrl: serverUrls.serversCommunication
  })
  EventController.initStream()
}
</script>

<style lang="less" scoped>
#taskCreate_box {
  position: fixed;
  left: 55%;
  top: 566px;
  width: 1270px;
  height: 700px;
  margin-left: -550px;
  margin-top: -382px;
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
      font-size: 18px;
      padding-left: 10px;
    }
    img {
      cursor: pointer;
    }
  }
  .content {
    height: calc(100% - 43px);
    .top {
      width: 70%;
      padding: 10px;
      margin: auto;
      :deep(.el-step__title.is-process) {
        color: #fff;
      }
    }
    .center {
      height: calc(100% - 140px);
      width: 96%;
      margin: auto;
      border: 1px solid #2e4b64;
    }
    .bottom {
      display: flex;
      align-items: center;
      justify-content: space-around;
      padding: 10px;
      .el-button {
        background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
        width: 85px;
        height: 33px;
        color: #ffff;
        border-radius: 5px;
        margin-left: 10px;
        cursor: pointer;
      }
    }
  }
}
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
:deep(.el-form-item__label) {
  color: #fff;
}
:deep(.el-input) {
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
.el-select {
  width: 100%;
  :deep(.el-select__wrapper) {
    background-color: #2b4559 !important;
    box-shadow: 0 0 0 1px #075d89 inset !important;
  }
}
:deep(.el-textarea__inner) {
  height: 90px;
  border-radius: 5px;
  box-shadow: none;
  color: #ffff;
  background-color: #2b4559 !important;
  box-shadow: 0 0 0 1px #075d89 inset !important;
}
::v-deep(.el-select__placeholder) {
  color: #fff;
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

:deep(.el-dialog) {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, -50%);
  background: rgba(8, 36, 62, 0.7) !important;
  color: #fff;
  z-index: 10;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #2e4b64;
    color: #fff;
    font-size: 18px;
  }
  .footer {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 10px;
  }
}
:deep(.el-form-item__label) {
  color: #fff;
  justify-content: left;
}
:deep(.el-input) {
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
.el-select {
  width: 100%;
  :deep(.el-select__wrapper) {
    background-color: #2b4559 !important;
    box-shadow: 0 0 0 1px #075d89 inset !important;
  }
}
:deep(.el-textarea__inner) {
  height: 90px;
  border-radius: 5px;
  box-shadow: none;
  color: #ffff;
  background-color: #2b4559 !important;
  box-shadow: 0 0 0 1px #075d89 inset !important;
}
::v-deep(.el-select__placeholder) {
  color: #fff;
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
:deep(.el-dialog),
.el-dialog,
.dialog-box {
  background: rgba(8, 36, 62, 0.7) !important;
}
</style>
