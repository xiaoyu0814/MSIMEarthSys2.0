<template>
  <div id="review" v-if="vueData.showList">
    <ul class="taskList_box">
      <li class="header">
        <span>任务管理</span>
      </li>
      <li class="content">
        <div class="search_create">
          <el-input
            v-model="vueData.search"
            :suffix-icon="Search"
            style="width: 200px"
            placeholder="请输入任务名称"
            clearable
          />
          <span>
            <el-button type="primary" :icon="Search" @click="_getTaskList">
              查询
            </el-button>
            <el-button type="primary" :icon="Plus" @click="openTaskCreateBox">
              新建
            </el-button>
          </span>
        </div>
        <ul class="taskItem_box">
          <li
            class="item_box"
            v-for="(item, index) in vueData.taskList"
            :key="index"
            :class="vueData.selectIndex == index ? 'select_style' : ''"
            @click="openTaskCheckBox(item, index)"
          >
            <div class="item_header">
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
            <ul class="item_content">
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
          :createOrEdit="vueData.createOrEdit"
          @closeTaskCreateBox="closeTaskCreateBox"
        ></taskCreateBox>
        <taskCheck
          v-if="vueData.checkBox_show"
          :taskData="vueData.taskData"
          @closeTaskCheckBox="closeTaskCheckBox"
        ></taskCheck>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import {
  Plus,
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
import taskCheck from './taskDetail.vue' // 任务详情页
import taskCreateBox from '@/views/seatManagement/adminuser/taskReadiness/taskCreate_box.vue'
const { loadingTask } = creatScene()
const store = useStore()
const vueData = reactive({
  showList: false,
  search: '',
  createBox_show: false,
  checkBox_show: false,
  taskList: [],
  pageNum: 1,
  pageSize: 4,
  total: 10,
  taskData: {},
  selectIndex: -1,
  uploadHeaders: {
    Authorization: sessionStorage.getItem('token')
  },
  systemTitles: '',
  createOrEdit: '新建任务'
})
emitter.on('closeTaskList', (val) => {
  vueData.showList = val
})
onMounted(() => {
  _getTaskList()
  vueData.systemTitles = window.localStorage.getItem('systemTitle')
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
  getTaskList(params, vueData.uploadHeaders).then((res) => {
    if (res.code == 200) {
      vueData.taskList = res.data.records
      vueData.total = res.data.total
      vueData.showList = true
    } else {
      ElMessage.error(res.data)
    }
  })
}
/**
 * @description 编辑任务
 * @param { Object } item 任务数据
 */
let _editTask = (item) => {
  store.commit('SET_TASKDATA', item)
  vueData.createBox_show = true
  vueData.checkBox_show = false
  vueData.createOrEdit = '编辑任务'
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
 * @description 打开任务创建/编辑窗口
 */
let openTaskCreateBox = () => {
  store.commit('SET_TASKDATA', {})
  vueData.createBox_show = true
  vueData.checkBox_show = false
  vueData.createOrEdit = '新建任务'
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
  store.state.curSceneInfo = curSceneObj
  vueData.taskData = item
  vueData.selectIndex = index
  store.commit('SET_TASKDATA', item)
  store.commit('setCurrentName', item.name)
  vueData.createBox_show = false
  vueData.checkBox_show = true
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
* {
  padding: 0;
  margin: 0;
}
#review {
  .taskList_box {
    position: absolute;
    left: 0px;
    top: 15%;
    width: 400px;
    height: 80vh;
    background-size: 100% 100%;
    z-index: 25;
    padding: 0;
    margin: 0;
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;
    .content {
      height: 80vh;
      padding: 0;
      .search_create {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px 10px 5px 10px;
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

      .taskItem_box {
        // height: calc(100% - 76px);
        width: 100%;
        padding: 0;
        margin: 0;
        text-align: left;

        .item_box,
        .create_box {
          background-color: #223b50;
          border: 1px solid #ffffff00;
          padding: 10px 15px;
          cursor: pointer;
          margin: 5px 10px;
          .item_header {
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
          .item_content {
            text-align: left;
            color: #b2bbc2;
            font-size: 12px;
            padding: 0;
            .describe {
              font-size: 14px;
              margin: 5px 0;
              height: 50px;
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
        padding: 10px 11px 0 0;
        :deep(.el-pagination) {
          justify-content: flex-end;
        }
      }
    }
    ::v-deep(li::marker) {
      content: '';
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      padding: 5px 15px;
      border-bottom: 1px solid #0b3855;
      height: 35px;
      span {
        font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
        font-weight: 700;
        font-style: normal;
        font-size: 19px;
        color: #c2d7ee;
      }
      img {
        cursor: pointer;
      }
    }
  }
}
</style>
