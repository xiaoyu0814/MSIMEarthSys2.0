<template>
  <div id="taskCreate_box">
    <div class="header">
      <span>{{ props.createOrEdit }}</span>
      <img
        src="~@/assets/images/rwty/arrows.svg"
        alt=""
        @click="closeTaskCreateBox"
      />
    </div>
    <div class="content">
      <div class="top">
        <el-steps :active="vueData.steps" finish-status="success" align-center>
          <el-step title="任务创建" />
          <el-step title="想定配置" />
          <el-step title="席位配置" />
          <el-step title="文书生成" />
          <el-step title="指令生成" />
          <el-step title="数据包生成" />
        </el-steps>
      </div>
      <div class="center">
        <taskCreate
          :createTaskInfo="vueData.createTaskInfo"
          v-if="vueData.steps == 0"
        ></taskCreate>
        <missionConfig
          @selectMissionId="updateTaskDataMission"
          v-if="vueData.steps == 1"
        ></missionConfig>
        <seatConfig
          @selectSeatId="updateTaskDataSeat"
          v-if="vueData.steps == 2"
        ></seatConfig>
        <docProduce v-if="vueData.steps == 3"></docProduce>
        <instructProduce v-if="vueData.steps == 4"></instructProduce>
        <dataBagProduce v-if="vueData.steps == 5"></dataBagProduce>
      </div>
      <div class="bottom">
        <el-button
          type="primary"
          @click="next('上一步')"
          v-if="vueData.steps > 0"
        >
          上一步
        </el-button>
        <el-button
          type="primary"
          @click="next('下一步')"
          v-if="vueData.steps < 5"
        >
          下一步
        </el-button>
        <el-button
          type="primary"
          @click="next('完成')"
          v-if="vueData.steps == 5"
        >
          完 成
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import taskCreate from '@/views/seatManagement/adminuser/taskReadiness/taskCreate/taskCreate.vue'
import missionConfig from '@/views/seatManagement/adminuser/taskReadiness/taskCreate/missionConfig.vue'
import seatConfig from '@/views/seatManagement/adminuser/taskReadiness/taskCreate/seatConfig.vue'
import docProduce from '@/views/seatManagement/adminuser/taskReadiness/taskCreate/docProduce.vue'
import instructProduce from '@/views/seatManagement/adminuser/taskReadiness/taskCreate/instructProduce.vue'
import dataBagProduce from '@/views/seatManagement/adminuser/taskReadiness/taskCreate/dataBagProduce.vue'
import {
  createTask,
  updataTask,
  getSeatCheckUser
} from '@/service/taskManagement'

const vueData = reactive({
  steps: 0,
  createTaskInfo: {
    taskName: '',
    taskType: '',
    taskDescription: ''
  },
  selectDocId: '',
  selectInstruct: '',
  selectDataBag: ''
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
 * @description 进入上一步/下一步
 * @param { String } type 类型
 */
let next = (type) => {
  if (type == '上一步') {
    if (vueData.steps > 0) {
      vueData.steps--
    } else {
      vueData.steps = 0
    }
  } else if (type == '下一步') {
    if (store.getters.get_taskData.id) {
      if (vueData.steps == 2) {
        _getSeatCheckUser()
      } else {
        _updataTask()
      }
    } else {
      _createTask()
    }
  } else {
    _updataTask()
  }
}

/**
 * @description 创建任务
 */
let _createTask = () => {
  let params = {
    name: vueData.createTaskInfo.taskName,
    typeId: vueData.createTaskInfo.taskType,
    describe: vueData.createTaskInfo.taskDescription
  }
  createTask(params).then((res) => {
    if (res.code == 200) {
      res.data.scenarioForm = {}
      store.commit('SET_TASKDATA', res.data)
      ElMessage.success('创建成功')
      vueData.steps++
    } else {
      ElMessage.error('创建失败')
      vueData.steps = 0
    }
  })
}

/**
 * @description 编辑任务
 */
let _updataTask = () => {
  let params = store.getters.get_taskData
  params.name = vueData.createTaskInfo.taskName
  params.typeId = vueData.createTaskInfo.taskType
  params.description = vueData.createTaskInfo.taskDescription
  updataTask(params).then((res) => {
    if (res.code == 200) {
      ElMessage.success('更新成功')
      vueData.steps++
      if (vueData.steps == 6) {
        closeTaskCreateBox()
      }
    } else {
      ElMessage.error('更新失败')
    }
  })
}

let _getSeatCheckUser = () => {
  let params = {
    schemeId: store.getters.get_taskData.schemeId
  }
  getSeatCheckUser(params).then((res) => {
    if (res.code == 200) {
      _updataTask()
    } else {
      ElMessageBox.confirm('有席位未绑定用户，确定要进入下一步吗？', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      })
        .then(() => {
          _updataTask()
        })
        .catch(() => {
          ElMessage.info('已取消')
        })
    }
  })
}

/**
 * @description 更新想定文件ID
 * @param { String } missionId 想定ID
 */
let updateTaskDataMission = (missionId) => {
  store.getters.get_taskData.scenarioId = missionId
  store.getters.get_taskData.scenarioForm.id = missionId
}

/**
 * @description 更新席位数据ID
 * @param { String } seatId 席位ID
 */
let updateTaskDataSeat = (seatId) => {
  store.getters.get_taskData.schemeId = seatId
}

/**
 * @description 关闭任务创建/编辑窗口
 */
let closeTaskCreateBox = () => {
  emit('closeTaskCreateBox')
}
</script>

<style lang="less" scoped>
#taskCreate_box {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 1270px;
  height: 800px;
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
</style>
