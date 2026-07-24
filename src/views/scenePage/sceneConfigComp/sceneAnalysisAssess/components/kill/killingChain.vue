<!--
 * @Author: dunqiancun duqiancun@piesat.cn
 * @Date: 2024-05-15 10:00:16
 * @LastEditors: ZX Li
 * @LastEditTime: 2024-06-01 16:39:24
 * @FilePath: \MSIMEarthSysN\src\views\analysisAssess\troops.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="flex-div">
    <div class="left-content">
      <div class="content-all">
        <ul class="leftBox">
          <li
            :class="item.target ? 'redSword' : 'sword'"
            v-for="(item, index) in state.info"
            :key="index"
          >
            <div class="sword_left">
              <img
                :src="item.target ? redSword : sword"
                style="padding-right: 5px"
              />
              <span class="leftBox-span">
                {{ item.target ? '目标方' : '攻击方' }}
              </span>
            </div>
            <el-tooltip
              class="item"
              effect="dark"
              :content="item.name"
              placement="bottom-start"
            >
              <p class="leftBox-p">{{ item.name }}</p>
            </el-tooltip>
          </li>
        </ul>
        <!-- <killRelationship  class='seriesData'/> -->
        <!--关系图--->
        <killRelationship :seriesData="state.seriesData" class="seriesData" />
      </div>

      <!---流程图--->
      <killingChainAxisFlowLogs />
    </div>

    <div class="right-content">
      <span class="form-title-all">实体列表</span>
      <div class="form-tree-style" id="smallShortBottomBg">
        <!-- <div class="search-tree">
        <el-input v-model="state.filterText" placeholder="请输入关键字过滤" clearable />
        <div class="search-icon" @click="filterNode">
          <img src="@/assets/images/indicator/search.png" />
        </div>
      </div> -->
        <el-tree
          ref="treeRef"
          show-checkbox
          class="filter-tree"
          :data="state.treeData"
          :props="state.defaultProps"
          default-expand-all
          node-key="id"
          @node-click="nodeClick"
          :highlight-current="true"
        >
        </el-tree>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, nextTick, watch, markRaw, onUnmounted } from 'vue'
import { getHitTableData } from '@/service/analysisAssess.js'
import killRelationship from './killRelationship.vue' //左上关系图
import killingChainAxisFlowLogs from './killingChainAxisFlowLogs.vue' //左下流程图

import sword from '@/assets/images/indicator/sword.png'
import redSword from '@/assets/images/indicator/redSword.png'
const vueData = reactive({
  deatroyData: [],
  activeName: 'red'
})
const state = reactive({
  switchValue: false,
  nodeLabel: '',
  nodeLabel2: '',
  nodeid: 0,
  nodeid2: 0,
  iconShow: true, //icon
  filterText: '', //过滤
  treeData: [
    {
      id: 1,
      label: 'Level one 1',
      children: [
        {
          id: 4,
          label: 'Level two 1-1',
          children: [
            {
              id: 9,
              label: 'Level three 1-1-1'
            },
            {
              id: 10,
              label: 'Level three 1-1-2'
            }
          ]
        }
      ]
    },
    {
      id: 2,
      label: 'Level one 2',
      children: [
        {
          id: 5,
          label: 'Level two 2-1'
        },
        {
          id: 6,
          label: 'Level two 2-2'
        }
      ]
    },
    {
      id: 3,
      label: 'Level one 3',
      children: [
        {
          id: 7,
          label: 'Level two 3-1'
        },
        {
          id: 8,
          label: 'Level two 3-2'
        }
      ]
    }
  ],
  seriesData: {},
  info: [
    {
      name: 'USS Halsey',
      target: false
    },
    {
      name: 'Tiger #02',
      target: true
    }
  ],
  defaultProps: {
    children: 'children',
    label: 'label'
  } //树结构
})
const nodeClick = () => {}
const getRedForceResult = () => {
  getResultReplay().then((res) => {
    state.treeData = []
    if (res.code != 200)
      ElMessage.warning(res.msg) || ElMessage.warning('网络错误，请稍后再试！')
    // const data = [...res.red.sideTypeJson.children, ...res.blue.sideTypeJson.children]
    state.treeData = res.red.sideTypeJson.children
  })
}
//表格数据查询
const onSearch = () => {
  let param = {
    labelName: vueData.name, //名称
    targetCategoryType: vueData.ownership, //兵力所属
    side: vueData.activeName //所属红蓝
  }
  getHitTableData({}).then((res) => {
    if (res.code != 200)
      ElMessage.warning(res.msg) || ElMessage.warning('网络错误，请稍后再试！')
    vueData.deatroyData = res.data.dataset.tableData
  })
}
onMounted(() => {
  //onSearch()
})
</script>

<style lang="less" scoped>
.content-all {
  flex: 1;
  :deep(.pie-echart) {
    width: 50%;
  }
}
.content-all-flex {
  display: flex;
  padding: 0;

  // li {
  //   width: 100%;
  height: 33%;
  margin-bottom: 2px;
  font-size: 14px;
  display: flex;
  padding: 6px 0;
  box-sizing: border-box;
  justify-content: center;
  // }
}
:deep(.warning-row) {
  background-color: #132437 !important;
  color: #fff;
}
:deep(.success-row) {
  background-color: #16334f !important;
  color: #fff;
}
:deep(.el-table__header-wrapper),
:deep(.el-table tr),
:deep(.el-table thead) {
  background-color: rgba(2, 26, 70, 0.88) !important;
}
:deep(.el-table tbody tr:hover > td) {
  background-color: transparent !important;
}
:deep(.el-table td.el-table__cell, .el-table th.el-table__cell.is-leaf) {
  background: rgba(2, 26, 70, 0.88) !important;
  color: #fff;
}
:deep(.el-table thead),
:deep(.el-table th.el-table__cell) {
  color: white;
  background-color: rgba(2, 26, 70, 0.88) !important;
}
:deep(.pie-echart) {
  border: 1px solid #387ca6;
  width: 50%;
  margin-right: 6px;
}
.labelName {
  width: 80px;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  font-weight: 600;
  text-align: center;
}

.left-content,
.right-content {
  height: 100%;
  width: 75%;
  overflow: hidden;
  padding: 6px 10px;
  box-sizing: border-box;
}
.left-content {
  .content-all {
    display: flex;
    height: 50%;
    ul {
      width: 30%;
    }
    .seriesData {
      width: 70%;
    }
  }
}

.right-content {
  width: 25%;
}
:deep(.el-progress-bar__inner) {
  text-align: right;
  left: auto;
  right: 0;
  border: 1px solid #fff;
}
:deep(.progress .el-progress-bar__inner) {
  text-align: left !important;
  left: 0;
  right: auto;
  border: 1px solid #fff;
}
.progress-all {
  width: 40%;
}
.text-all {
  line-height: 32px;
}
:deep(.el-form) {
  color: #fff;
  font-size: 16px;
  margin-top: 10px;
  display: flex;
  .el-form-item__label,
  .el-form-item__label-wrap {
    color: #fff;
  }
}
:deep(.el-input__wrapper) {
  marign-right: 10px !important;
}
:deep(.el-table__empty-block) {
  background: rgba(2, 26, 70, 0.88) !important;
  .el-table__empty-text {
    color: #fff;
  }
}
:deep(.el-form-item) {
  margin-right: 10px !important;
}
.form-title-all {
  display: block;
  height: 40px;
  background: url('~@/assets/images/indicator/icon01.png');
  background-size: 100% 100%;
  padding: 0 10px;
  box-sizing: border-box;
  align-items: left;
  text-align: left;
  color: #fff;
  font-size: 18px;
  line-height: 40px;
}
.flex-div {
  display: flex;
  winth: 99vw;
  height: 100vh;
  padding: 10px;
  box-sizing: border-box;
}
// 搜搜
.search-tree {
  display: flex;
  align-items: center;
  height: 35px;
  cursor: pointer;
  .search-icon {
    line-height: 32px;
    text-align: center;
    width: 32px;
    height: 32px;
    border-radius: 4px;
    margin-top: 8px;
  }
}
:deep(.el-tree__empty-block),
:deep(.el-tree),
:deep(.el-input__inner),
:deep(.el-input__wrapper) {
  background-color: rgba(2, 26, 70, 0.88) !important;
  color: #fff;
}
ul,
li {
  list-style: none;
}
.leftBox {
  height: 100%;
  flex-grow: 1;
  padding: 0 20px;
  width: 26%;
  font-size: 16px;
  font-family: MicrosoftYaHei;
  color: #ffffff;
  overflow-y: auto;

  li {
    margin: 10px 0;
  }

  .sword {
    background-image: url('@/assets/images/indicator/blueRectangle.png');
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 10px;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 100%;
    box-sizing: border-box;
    p {
      margin: 4px 0;
    }
    span {
      font-family: MicrosoftYaHeiSemibold;
      background: linear-gradient(180deg, #ffffff 0%, #a0d6ff 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }

  .redSword {
    background-image: url('@/assets/images/indicator/redRectangle.png');
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 2px 10px;
    box-sizing: border-box;
    background-repeat: no-repeat;
    background-size: 100% 100%;
    width: 100%;
    p {
      margin: 4px 0;
    }
    span {
      text-shadow: 0px 2px 4px rgba(0, 0, 0, 0.5);
      background: linear-gradient(180deg, #ffffff 0%, #ff7676 98%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
    }
  }
}
.filter-tree {
  height: calc (100% - 100px);
}
.mainBox {
  height: 50%;
}
</style>
