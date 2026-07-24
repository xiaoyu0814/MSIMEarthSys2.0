<!--
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2025-05-16 09:22:56
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2025-05-16 16:27:40
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
            placeholder="请输入作战实验名称"
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
            >新建作战实验规则</el-button
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
        <el-table-column label="作战实验名称" prop="name" align="center" />
        <el-table-column label="任务类型" prop="type" align="center" />
        <el-table-column label="实验课目" prop="type" align="center" />
        <el-table-column label="实验对象" prop="type" align="center" />
        <el-table-column label="实验方法" prop="type" align="center" />
        <el-table-column label="实验评估" prop="type" align="center" />
        <el-table-column label="操作" align="center">
          <template #default="scope">
            <el-button size="small" type="primary" link @click="privew(scope)">
              详情
            </el-button>
            <el-button size="small" type="primary" link @click="edit(scope)">
              编辑
            </el-button>
            <el-button size="small" type="danger" link @click="_delete(scope)">
              删除
            </el-button>
            <el-button
              size="small"
              type="primary"
              link
              @click="saveRule(scope)"
            >
              使用该规则
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
      <div style="display: flex">
        <el-form :model="vueData.instructInfo" label-width="120px">
          <el-form-item label="作战实验名称">
            <el-input
              v-model="vueData.instructInfo.name"
              :disabled="true"
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item label="作战任务类型">
            <el-input
              v-model="vueData.instructInfo.sceneName"
              :disabled="true"
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item label="作战实验内容">
            <el-input
              v-model="vueData.instructInfo.experimentTarget"
              :disabled="true"
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item label="作战实验对象">
            <el-input
              v-model="vueData.instructInfo.delivery"
              :disabled="true"
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item label="作战实验方法">
            <el-input
              v-model="vueData.instructInfo.experimentExpectedResults"
              :disabled="true"
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item label="作战实验评估">
            <el-input
              v-model="vueData.instructInfo.describe"
              :disabled="true"
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item label="实验组织实施">
            <el-input
              v-model="vueData.instructInfo.describe"
              :disabled="true"
              style="width: 300px"
            />
          </el-form-item>
          <el-form-item>
            <el-button type="primary" size="small">提交</el-button>
            <el-button size="small" @click="closeEditTask">取消</el-button>
          </el-form-item>
        </el-form>
        <div style="height: 450px; overflow-y: auto">
          <img src="@/assets/images/u3232.png" style="margin-left: 20px" />
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { Plus, Search } from '@element-plus/icons-vue'
import { reactive, onMounted } from 'vue'
import emitter from '@/utils/eventbus'
import selfPage from '@/components/page.vue'
import { getExperimentSubjects } from '@/service/experimentalPreparation.js'

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
  popTitle: '新建实验规则',
  instructInfo: {}
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
  let params = {}
  getExperimentSubjects(params).then((res) => {
    if (res.code == 200) {
      vueData.tableData = res.data.experimentSubjects
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
const privew = (row) => {
  vueData.isEditTask = true
  vueData.popTitle = '查看实验规则'
}

// 编辑
const edit = (row) => {
  vueData.isEditTask = true
  vueData.popTitle = '编辑实验规则'
}

// 删除
const _delete = (row) => {}

// 使用规则
const saveRule = (row) => {
  emitter.emit('sendTestRule', row)
}
// 新建
const add = () => {
  vueData.isEditTask = true
  vueData.popTitle = '新建实验规则'
}
// 关闭
const closeEditTask = () => {
  vueData.isEditTask = false
}
onMounted(() => {
  _getList()
})
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
        width: 90px;
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
:deep(.el-form-item__label) {
  color: #fff;
}
:deep(.el-dialog) {
  .header {
    color: #00e4e9 !important;
  }
}
* {
  box-sizing: border-box;
}
</style>
<style lang="less">
.el-dialog__title {
  color: #00e4e9 !important;
  font-weight: bolder;
}
</style>
