<!--
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2025-05-16 09:22:56
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2025-05-16 16:41:20
 * @FilePath: \sjzWeb\src\views\experimentalPreparation\dataConfig\components\step1.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="sceneConstruction">
    <div class="s-content">
      <div class="search_box">
        <div>
          <el-input
            v-model="vueData.searchByName"
            style="width: 300px"
            placeholder="请输入想定名称"
            clearable
          />
          <el-button type="primary" :icon="Search" @click="_getList"
            >查询</el-button
          >
        </div>
        <div>
          <el-button
            type="primary"
            style="width: 160px"
            :icon="Plus"
            @click="add"
            >新建作战实验想定</el-button
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
        <el-table-column label="想定名称" prop="name" align="center" />
        <el-table-column label="作战实验目的" prop="type" align="center" />
        <el-table-column label="作战计划" prop="time" align="center" />
        <el-table-column label="想定背景" prop="time" align="center" />
        <el-table-column label="想定目的" prop="time" align="center" />
        <el-table-column label="操作" align="center" width="400px">
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
            <el-button size="small" type="primary" link @click="glScene(scope)">
              关联场景
            </el-button>
            <el-button
              size="small"
              type="primary"
              link
              @click="saveScene(scope)"
            >
              使用该想定
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
    <el-dialog
      v-model="vueData.isEditTask"
      :title="vueData.popTitle"
      width="1000px"
      append-to-body
      class="dialog-box"
      style="
        background: rgba(2, 26, 70, 0.88) !important;
        color: #fff;
        box-shadow: 0 0 25px #1092d5;
      "
      @close="closeEditTask"
    >
      <el-form
        label-width="120px"
        :inline="true"
        style="display: flex; flex-wrap: wrap"
      >
        <el-form-item label="作战想定名称">
          <el-input
            v-model="vueData.createSceneInfo.name"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="作战时间">
          <el-date-picker
            v-model="vueData.createSceneInfo.startDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 300px"
          />
        </el-form-item>
        <el-form-item label="作战背景">
          <el-input
            type="textarea"
            v-model="vueData.createSceneInfo.background"
            resize="none"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="任务目的">
          <el-input
            type="textarea"
            v-model="vueData.createSceneInfo.purpose"
            resize="none"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="任务简报">
          <el-input
            type="textarea"
            v-model="vueData.createSceneInfo.info"
            resize="none"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="想定描述">
          <el-input
            type="textarea"
            v-model="vueData.createSceneInfo.scenarioDetail"
            resize="none"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="环境影响">
          <el-input
            type="textarea"
            v-model="vueData.createSceneInfo.scenarioWarEnvironment"
            resize="none"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="兵力配置">
          <el-input
            type="textarea"
            v-model="vueData.createSceneInfo.troopsDescription"
            resize="none"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="情报要素">
          <el-input
            type="textarea"
            v-model="vueData.createSceneInfo.intelligenceParam"
            resize="none"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="作战文书">
          <el-input
            type="textarea"
            v-model="vueData.createSceneInfo.background"
            resize="none"
            :rows="3"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="缩略图">
          <el-upload
            ref="uploadElement"
            style="width: 100px"
            list-type="picture-card"
            :limit="1"
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
      </el-form>
    </el-dialog>
  </div>
</template>

<script setup>
import { Plus, Search } from '@element-plus/icons-vue'
import { reactive } from 'vue'
import emitter from '@/utils/eventbus'
import selfPage from '@/components/page.vue'

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
  total: 100,
  isEditTask: false,
  popTitle: '新建作战想定',
  createSceneInfo: {}
})
// 隔行变色
const rowStyle = ({ row, rowIndex }) => {
  if (rowIndex % 2 == 1) {
    // console.log(rowIndex);
    return 'cellStyle'
  } else return 'cellStyle1'
}
// 获取场景列表
const _getList = () => {}
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
const edit = (row) => {
  vueData.isEditTask = true
  vueData.popTitle = '编辑作战想定'
}

// 删除
const _delete = (row) => {}

// 使用该想定
const saveScene = (row) => {
  emitter.emit('sendScene', row)
}
// 新建
const add = () => {
  vueData.isEditTask = true
  vueData.popTitle = '新建作战想定'
}
// 关联场景
const glScene = (row) => {}
</script>
<style lang="less" scoped>
.sceneConstruction {
  width: 100%;
  height: 100%;
  background: #00254e;
  .s-content {
    height: 100%;
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
.el-select {
  width: 100%;
  :deep(.el-select__wrapper) {
    background-color: #00254e !important;
    box-shadow: 0 0 0 1px #81d3f8 inset !important;
  }
}
:deep(.el-textarea__inner) {
  height: 90px;
  border-radius: 5px;
  box-shadow: none;
  color: #ffff;
  background-color: #00254e !important;
  box-shadow: 0 0 0 1px #81d3f8 inset !important;
}
::v-deep(.el-select__placeholder) {
  color: #fff;
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
:deep(.el-form-item__label) {
  color: #fff;
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
