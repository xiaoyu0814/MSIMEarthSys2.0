<!--
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2025-05-15 14:50:44
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2025-07-11 10:42:43
 * @FilePath: \sjzWeb\src\views\experimentalPreparation\conceptDevelopment\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<!-- 智能作战场景构建 -->
<template>
  <div class="sceneConstruction">
    <div class="s-header">
      <div class="titleBox">
        <div class="s-title">智能作战场景构建</div>
        <el-icon size="30" style="cursor: pointer" @click="closeBox"
          ><Close
        /></el-icon>
      </div>
      <div class="info">
        用于战场环境态势按需构设和编辑，兵力快速部署，重要设施、重要目标、作战区域、战场范围等作战要素的参数配置。
      </div>
      <el-divider></el-divider>
    </div>
    <div class="s-content">
      <div class="search_box">
        <div>
          <el-input
            v-model="vueData.searchByName"
            style="width: 300px"
            placeholder="请输入场景名称"
            clearable
          />
          <el-button type="primary" :icon="Search" @click="_getList"
            >查询</el-button
          >
        </div>
        <div>
          <el-button type="primary" :icon="Plus" @click="addScene"
            >新建场景</el-button
          >
        </div>
      </div>
      <el-table
        :data="vueData.tableData"
        border
        :row-class-name="rowStyle"
        :header-cell-style="{
          background: '#00254E',
          color: ' #FFFFFF',
          height: '60px',
          fontSize: '18px'
        }"
      >
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column label="场景名称" prop="name" align="center" />
        <el-table-column label="场景类型" prop="type" align="center" />
        <el-table-column label="场景创建时间" prop="ctime" align="center" />
        <el-table-column label="场景要素" prop="ele" align="center" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="privew(scope)">
              预览
            </el-button>
            <el-button size="small" type="primary" link @click="edit(scope)">
              编辑
            </el-button>
            <el-button size="small" type="danger" link @click="_delete(scope)">
              删除
            </el-button>
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
</template>

<script setup>
import { Plus, Search } from '@element-plus/icons-vue'
import { onMounted, reactive } from 'vue'
import selfPage from '@/components/page.vue'
import { getScenarioByPage } from '@/service/experimentalPreparation.js'
import { Close } from '@element-plus/icons-vue'
import store from '@/store/index'
const vueData = reactive({
  tableData: [
    {
      name: 'xxx',
      type: 'xxx',
      time: 'xxx',
      ele: 'xxx'
    },
    {
      name: 'xxx',
      type: 'xxx',
      time: 'xxx',
      ele: 'xxx'
    },
    {
      name: 'xxx',
      type: 'xxx',
      time: 'xxx',
      ele: 'xxx'
    },
    {
      name: 'xxx',
      type: 'xxx',
      time: 'xxx',
      ele: 'xxx'
    }
  ],
  searchByName: '',
  pageNum: 1,
  pageSize: 10,
  total: 100
})
// 隔行变色
const rowStyle = ({ row, rowIndex }) => {
  if (rowIndex % 2 == 1) {
    // console.log(rowIndex);
    return 'cellStyle'
  } else return 'cellStyle1'
}
// 获取场景列表
const _getList = () => {
  let params = {
    pageNum: vueData.pageNum,
    pageSize: vueData.pageSize
  }
  getScenarioByPage(params).then((res) => {
    if (res.code == 200) {
      vueData.tableData = res.data.records
      vueData.total = res.data.total
    }
  })
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
// 预览
const privew = (row) => {}

// 编辑
const edit = (row) => {}

// 删除
const _delete = (row) => {}

// 新建场景
const addScene = () => {
  window.open(serverUrls.sceneUrl + '/SAAEdit/#/')
}
onMounted(() => {
  _getList()
})

const closeBox = () => {
  store.commit('setUrl', '')
}
</script>
<style lang="less" scoped>
.sceneConstruction {
  width: 100%;
  height: 100%;
  position: fixed;
  bottom: 0;
  left: 0;
  top: 60px;
  background: #00254e;
  box-shadow: 0 0 25px #1092d5;
  .s-header {
    height: 120px;
    padding: 20px 20px 0;
    text-align: left;
    color: #fff;
    box-sizing: border-box;
    .titleBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .s-title {
        font-size: 28px;
        font-weight: bolder;
      }
    }
    .info {
      font-size: 20px;
      margin-top: 10px;
    }
  }
  .s-content {
    height: calc(100% - 120px);
    width: 100%;
    padding: 20px;
    box-sizing: border-box;
    .search_box {
      height: 50px;
      line-height: 50px;
      display: flex;
      justify-content: space-between;
      margin-bottom: 10px;
      .el-button {
        background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
        background-size: 100% 100%;
        width: 100px;
        height: 34px;
        color: #ffff;
        border-radius: 5px;
        margin-left: 10px;
        cursor: pointer;
        border: none !important;
      }
    }
    .page_box {
      margin-top: 10px;
      :deep(.el-pagination) {
        justify-content: flex-end;
      }
    }
  }
}
.el-table {
  --el-table-border-color: #075d89;
}
:deep(.el-input) {
  .el-input__wrapper {
    border-radius: 5px;
    box-shadow: none;
    background-color: #00254e !important;
    box-shadow: 0 0 0 1px #81d3f8 inset !important;
  }
  .el-input__inner {
    color: #fff !important;
  }
}
:deep(.el-table) {
  .cellStyle {
    background-color: #00254e !important;
    color: #fff !important;
    font-family: 'Arial Normal', 'Arial';
    font-weight: 400;
    font-style: normal;
    font-size: 16px;
    height: 50px;
    letter-spacing: normal;
  }

  .cellStyle1 {
    background-color: #335171 !important;
    color: #fff !important;
    font-family: 'Arial Normal', 'Arial';
    font-weight: 400;
    font-style: normal;
    font-size: 16px;
    height: 50px;
    letter-spacing: normal;
  }
}
.el-table {
  --el-table-row-hover-bg-color: none;
}
.el-button--small {
  font-size: 15px;
}
* {
  box-sizing: border-box;
}
</style>
