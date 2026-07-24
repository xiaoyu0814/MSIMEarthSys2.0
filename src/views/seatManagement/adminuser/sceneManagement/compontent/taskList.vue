<template>
  <div id="taskManagement">
    <div class="search_create">
      <el-input
        v-model="vueData.search"
        :suffix-icon="Search"
        style="width: 30%"
        placeholder="请输入任务名称"
        clearable
      />
      <el-button type="primary" :icon="Search" @click="_getTaskList">
        查询
      </el-button>
    </div>
    <ul class="taskList_box">
      <li
        class="item_box"
        v-for="(item, index) in vueData.taskList"
        :key="index"
        :class="vueData.selectIndex == index ? 'select_style' : ''"
        @click="openTaskCheckBox(item, index)"
      >
        <div class="header">
          <span class="title">
            <img src="~@/assets/images/rwty/想定查询.svg" alt="" />
            <span>{{ item.name }}</span>
          </span>
          <div v-if="vueData.systemTitles == '任务准备' ? true : false">
            <el-button
              type="primary"
              :icon="Edit"
              link
              @click.stop="_editTask(item)"
            />
            <el-button
              type="danger"
              :icon="Delete"
              link
              @click.stop="_removeTask(item)"
            />
          </div>
        </div>
        <ul class="content">
          <li class="describe">描述：{{ item.description }}</li>
          <li>
            <p>生成时间：{{ item.ctime }}</p>
            <p>修改时间：{{ item.uptime }}</p>
          </li>
        </ul>
      </li>
    </ul>
    <selfPage
      class="page_box"
      :currentPage="vueData.pageNum"
      :pageSize="vueData.pageSize"
      :total="vueData.total"
      @handleSizeChange="changePageSize"
      @handleCurrentChange="changePageNum"
    ></selfPage>
    <taskCreateBox
      v-if="vueData.createBox_show"
      @closeTaskCreateBox="closeTaskCreateBox"
    ></taskCreateBox>
    <taskCheck
      v-if="vueData.checkBox_show"
      :taskData="vueData.taskData"
      @closeTaskCheckBox="closeTaskCheckBox"
    >
    </taskCheck>
    <reviewRecord
      v-if="vueData.showreviewRecord"
      @closeTaskCheckBox="closeTaskCheckBox"
    ></reviewRecord>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import {
  Search,
  Delete,
  Refresh,
  RefreshLeft,
  Edit
} from '@element-plus/icons-vue'
import { ElMessage, ElMessageBox } from 'element-plus'
import selfPage from '@/components/page.vue'
import { getTaskList, removeTask } from '@/service/taskManagement'
import emitter from '@/utils/eventbus'
import { creatScene } from '@/views/homeHeader/hooks/index'
import reviewRecord from './reviewRecords.vue' // 复盘回放记录页
import taskCheck from './taskDetail.vue' // 任务详情页
import taskCreateBox from '@/views/seatManagement/adminuser/taskReadiness/taskCreate_box.vue'
import commonMethods from '@/utils/commonMethods/commonMethods.js'

const vueData = reactive({
  search: '',
  createBox_show: false,
  checkBox_show: false,
  taskList: [
    {
      name: '测试1',
      description: '这是一段描述1',
      createTime: '2024-01-14 22:03:06',
      updateTime: '2024-01-14 22:03:06'
    },
    {
      name: '测试2',
      description: '这是一段描述2',
      createTime: '2024-01-14 22:03:06',
      updateTime: '2024-01-14 22:03:06'
    },
    {
      name: '测试3',
      description: '这是一段描述3',
      createTime: '2024-01-14 22:03:06',
      updateTime: '2024-01-14 22:03:06'
    },
    {
      name: '测试4',
      description: '这是一段描述4',
      createTime: '2024-01-14 22:03:06',
      updateTime: '2024-01-14 22:03:06'
    }
  ],
  pageNum: 1,
  pageSize: 6,
  total: 10,
  taskData: {},
  selectIndex: -1,
  uploadHeaders: {
    Authorization: sessionStorage.getItem('token')
  },
  showreviewRecord: false, // 复盘回放记录表
  systemTitles: ''
})

const store = useStore()

const props = defineProps({
  environment: {
    type: String,
    defined: ''
  }
})

const emit = defineEmits(['getTaskItem'])

onMounted(() => {
  _getTaskList()
  vueData.systemTitles = window.localStorage.getItem('systemTitle')
})
emitter.on('closeCheckBox', (val) => {
  vueData.checkBox_show = val
})

/**
 * @description 获取任务列表
 */
let _getTaskList = () => {
  let params = {
    name: vueData.search,
    pageNum: vueData.pageNum,
    pageSize: vueData.pageSize
  }
  //console.log(params, vueData.uploadHeaders)
  getTaskList(params, vueData.uploadHeaders).then((res) => {
    //console.log(res)
    if (res.code == 200) {
      vueData.taskList = res.data.records
      vueData.total = res.data.total
    } else {
      ElMessage.error(res.data)
    }
  })
}
let _getDate = (time) => {
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
/**
 * @description 编辑任务
 * @param { Object } item 任务数据
 */
let _editTask = (item) => {
  store.commit('SET_TASKDATA', item)
  vueData.createBox_show = true
  vueData.checkBox_show = false
}

/**
 * @description 删除任务
 * @param { Object } item 任务数据
 */
let _removeTask = (item) => {
  ElMessageBox.confirm('确定删除当前数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      let params = {
        id: item.id
      }
      removeTask(params).then((res) => {
        if (res.code == 200) {
          _getTaskList()
          ElMessage.success('删除成功')
        } else {
          ElMessage.error(res.data)
        }
      })
    })
    .catch(() => {
      ElMessage.info('取消删除')
    })
}

/**
 * @description 打开任务查看窗口
 * @param { Object } item 任务数据
 * @param { Number } index 任务数据索引
 */
let openTaskCheckBox = (item, index) => {
  let curSceneObj = {
    taskInfo: '',
    taskPurpose: '',
    thinkGround: '',
    voiceName: '',
    name: item.name,
    id: item.id,
    scenarioDetailsMarkPicUrl:
      staticUrl + item.scenarioForm.scenarioDetailsMarkPicUrl, //images-sim/dt.jpg
    scenarioWarEnvironment: item.scenarioForm.scenarioWarEnvironment,
    intelligenceParam: item.scenarioForm.intelligenceParam, //情报要素
    scenarioDetail: item.scenarioForm.scenarioDetail, //详情
    troopsDescription: item.scenarioForm.troopsDescription, //参战兵力
    scenarioId: item.scenarioForm.id // 想定ID
  }
  if (item.scenarioForm) {
    if (item.scenarioForm.taskInfo) {
      curSceneObj.taskInfo = item.scenarioForm.taskInfo
    }
    if (item.scenarioForm.taskPurpose) {
      curSceneObj.taskPurpose = item.scenarioForm.taskPurpose
    }
    if (item.scenarioForm.thinkGround) {
      curSceneObj.thinkGround = item.scenarioForm.thinkGround
    }
    if (item.scenarioForm.voiceName) {
      curSceneObj.voiceName = staticUrl + item.scenarioForm.voiceName
    }
  }
  const { configldrw } = commonMethods()
  configldrw(store.state.sceneModule.sceneInfo.name)
  store.state.curSceneInfo = curSceneObj
  vueData.taskData = item
  vueData.selectIndex = index
  store.commit('SET_TASKDATA', item)
  store.commit('setCurrentName', item.name)
  //pilotseat:导调控制席，DimensionalSituation：态势席
  if (
    sessionStorage.getItem('roleKey') == 'pilotseat' &&
    localStorage.getItem('systemTitle') != '复盘回放'
  ) {
    vueData.checkBox_show = true
  } else if (localStorage.getItem('systemTitle') == '复盘回放') {
    vueData.showreviewRecord = true
  }
  if (item.scenarioForm) {
    store.commit('setSceneStartTime', item.scenarioForm.startTime)
    store.commit('setCurSceneTime', item.scenarioForm.startTime)
  }
  store.state.curSceneName = item.scenarioForm.name
}

/**
 * @description 关闭任务创建/编辑窗口
 */
let closeTaskCreateBox = () => {
  vueData.createBox_show = false
  _getTaskList()
}

/**
 * @description 关闭任务查看窗口
 */
let closeTaskCheckBox = (val) => {
  vueData.checkBox_show = val
  vueData.showreviewRecord = val
}

/**
 * @description 改变页数量
 * @param { Number } pageSize 页数量
 */
let changePageSize = (pageSize) => {
  vueData.pageSize = pageSize
  _getTaskList()
}

/**
 * @description 切换页码
 * @param { Number } pageNum 页码
 */
let changePageNum = (pageNum) => {
  vueData.pageNum = pageNum
  _getTaskList()
}
</script>

<style lang="less" scoped>
#taskManagement {
  .search_create {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 10px 0 0 14px;

    :deep(.el-input__wrapper) {
      background-color: #2b4559 !important;
      box-shadow: 0 0 0 1px #075d89 inset;

      .el-input__inner {
        color: #ffffff;
      }
    }

    .el-button {
      background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
      width: 80px;
      height: 30px;
      color: #ffff;
      border-radius: 5px;
      margin-left: 10px;
      cursor: pointer;
    }
  }

  .taskList_box {
    // height: calc(100% - 32px);
    width: 100%;
    padding: 0;
    margin: 0;
    text-align: left;

    .item_box,
    .create_box {
      background-color: #223b50;
      border: 1px solid #ffffff00;
      padding: 10px;
      cursor: pointer;
      display: inline-block;
      width: 46%;
      margin: 10px 0 0 13px;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #81d3f8;

        .title {
          display: flex;
          justify-content: center;
          align-items: center;
        }
      }

      .content {
        text-align: left;
        color: #b2bbc2;
        font-size: 12px;
        padding: 0;

        .describe {
          font-size: 14px;
          margin: 5px 0;
          height: 30px;
          display: flex;
          align-items: center;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
          text-overflow: ellipsis;
        }
      }
    }

    .select_style {
      background-color: #02a7f04a;
      border-color: #02a7f0;
    }
  }

  .page_box {
    display: flex;
    justify-content: center;
    padding-top: 15px;

    :deep(.el-pagination) {
      justify-content: flex-end;
    }
  }
}
</style>
