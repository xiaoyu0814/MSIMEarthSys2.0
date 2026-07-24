<template>
  <div id="review" v-if="vueData.showList">
    <ul class="taskList_box">
      <li class="header">
        <span>XXXX</span>
      </li>
      <li class="content">
        <div class="search_create">
          <el-input
            v-model="vueData.search"
            :suffix-icon="Search"
            style="width: 200px"
            placeholder="请输入实验名称"
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
        <!-- <selfPage
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
        ></taskCheck> -->
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
import emitter from '@/utils/eventbus'
import taskCreateBox from '@/views/seatManagement/adminuser/taskReadiness/taskCreate_box.vue'
// const { loadingTask } = creatScene()
const store = useStore()
const vueData = reactive({
  showList: false,
  search: '',
  createBox_show: true,
  checkBox_show: false,
  taskList: [
    {
      name: '11111111',
      description: '详情',
      ctime: '2024-01-01 02:00:00',
      uptime: '2024-01-01 02:00:00'
    }
  ],
  pageNum: 1,
  pageSize: 4,
  total: 10,
  taskData: {},
  selectIndex: -1,
  uploadHeaders: {
    Authorization: sessionStorage.getItem('token')
  },
  systemTitles: '',
  createOrEdit: '新建实验'
})
emitter.on('closeTaskList', (val) => {
  vueData.showList = val
})
onMounted(() => {
  // _getTaskList()
  vueData.systemTitles = window.localStorage.getItem('systemTitle')
})
/**
 * @description 获取任务列表
 */
let _getTaskList = () => {}
/**
 * @description 编辑任务
 * @param { Object } item 任务数据
 */

/**
 * @description 删除任务
 * @param { Object } item 任务数据
 */

/**
 * @description 打开任务创建/编辑窗口
 */
let openTaskCreateBox = () => {
  store.commit('SET_TASKDATA', {})
  vueData.createBox_show = true
  vueData.checkBox_show = false
  vueData.createOrEdit = '新建实验'
}
/**
 * @description 打开任务查看窗口
 * @param { Object } item 任务数据
 * @param { Number } index 任务数据索引
 */

/**
 * @description 关闭任务创建/编辑窗口
 */
let closeTaskCreateBox = () => {
  // store.commit('SET_TASKDATA', {})
  vueData.createBox_show = false
  vueData.checkBox_show = false
  vueData.createOrEdit = '新建实验'
}
/**
 * @description 关闭任务查看窗口
 */

/**
 * @description 改变页数量
 * @param { Number } pageSize 页数量
 */

/**
 * @description 切换页码
 * @param { Number } pageNum 页码
 */
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
    top: 0%;
    width: 400px;
    height: 85vh;
    background-size: 100% 100%;
    z-index: 25;
    padding: 0;
    margin: 0;
    //background: rgba(2, 26, 70, 0.88);
    //box-shadow: 0 0 25px #1092d5;
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
