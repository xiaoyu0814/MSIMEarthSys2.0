<template>
  <div id="missionConfig">
    <div class="searchBox">
      <el-input
        v-model="vueData.search"
        :suffix-icon="Search"
        style="width: 200px"
        @change="getMissionList"
      />
    </div>
    <ul class="mission_box">
      <li
        v-for="(item, index) in vueData.missionList"
        :key="index"
        class="item_box"
        @click="selectMission(item, index)"
        :class="vueData.selectMissionId == item.id ? 'selectStyle' : ''"
      >
        <div class="header">
          <span class="title">
            <img src="~@/assets/images/rwty/想定查询.svg" alt="" />
            <span>{{ item.name }}</span>
          </span>
        </div>
        <div class="bottom">
          <ul class="content">
            <li class="describe">描述：{{ item.scenarioDescribe }}</li>
            <li>
              <p>生成时间：{{ item.ctime }}</p>
              <p>修改时间：{{ item.uptime }}</p>
            </li>
          </ul>
          <img v-if="item.picUrl" :src="item.picUrl" alt="" />
          <div v-else class="badImage">
            <el-icon><icon-picture /></el-icon>
          </div>
        </div>
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
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Picture as IconPicture, Search } from '@element-plus/icons-vue'
import selfPage from '@/components/page.vue'
import { getXDList } from '@/service/contingencyEditing/contingencyEditing.js'

const emit = defineEmits()

const vueData = reactive({
  search: '',
  pageNum: 1,
  pageSize: 9,
  total: 10,
  missionList: [],
  selectIndex: -1,
  selectMissionId: ''
})

const store = useStore()

onMounted(() => {
  if (store.getters.get_taskData.scenarioId) {
    vueData.selectMissionId = store.getters.get_taskData.scenarioId
  } else if (store.getters.get_taskData.scenarioForm) {
    vueData.selectMissionId = store.getters.get_taskData.scenarioForm.id
  } else {
    vueData.selectMissionId = ''
  }
  getMissionList()
})

/**
 * @description 获取想定列表
 */
let getMissionList = () => {
  let params = {
    name: vueData.search,
    pageNum: vueData.pageNum,
    pageSize: vueData.pageSize
  }
  getXDList(params).then((res) => {
    if (res.code == 200) {
      vueData.total = res.data.total
      vueData.missionList = res.data.records
    }
  })
}

/**
 * @description 获取选择的想定数据
 * @param { Object } item 想定数据
 * @param { Number } index 想定索引
 */
let selectMission = (item, index) => {
  emit('selectMissionId', item.id)
  vueData.selectMissionId = item.id
  vueData.selectIndex = index
}

/**
 * @description 改变页数量
 * @param { Number } pageSize 页数量
 */
let changePageSize = (pageSize) => {
  vueData.pageSize = pageSize
  getMissionList()
}

/**
 * @description 切换页码
 * @param { Number } pageNum 页码
 */
let changePageNum = (pageNum) => {
  vueData.pageNum = pageNum
  getMissionList()
}
</script>

<style lang="less" scoped>
#missionConfig {
  height: 100%;
  box-sizing: border-box;
  padding: 10px;
  .searchBox {
    text-align: right;
    :deep(.el-input) {
      .el-input__wrapper {
        border-radius: 5px;
        box-shadow: none;
        background-color: #2b4559 !important;
        box-shadow: 0 0 0 1px #075d89 inset !important;
      }
    }
  }
  .mission_box {
    height: calc(100% - 68px);
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: center;
    align-content: flex-start;
    padding: 0;
    .item_box {
      width: 31%;
      background-color: #223b50;
      border: 1px solid #ffffff00;
      border-radius: 5px;
      padding: 10px;
      margin-top: 10px;
      cursor: pointer;
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
      .bottom {
        display: flex;
        .content {
          width: 50%;
          text-align: left;
          color: #b2bbc2;
          font-size: 12px;
          padding: 0;
          .describe {
            font-size: 14px;
            margin: 5px 0;
            height: 35px;
            display: flex;
            align-items: center;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }
        }

        img {
          width: 50%;
          padding-top: 10px;
          padding-left: 10px;
          box-sizing: border-box;
          height: 100px;
        }
        .badImage {
          display: flex;
          align-items: center;
          justify-content: center;
          width: calc(50% - 10px);
          margin-top: 10px;
          margin-left: 10px;
          height: calc(100px - 10px);
          background-color: #262727;
        }
      }
    }
  }

  .page_box {
    margin-top: 10px;
    :deep(.el-pagination) {
      justify-content: flex-end;
    }
  }

  .selectStyle {
    border: 1px solid #ffffff !important;
    background-color: #40a0ff3d !important;
  }
}
</style>
