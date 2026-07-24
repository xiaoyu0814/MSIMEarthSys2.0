<!--
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2025-05-15 13:56:34
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2025-05-16 16:51:42
 * @FilePath: \sjzWeb\src\views\scenePage\experimentalDataAnalysis\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="experimentalDataAnalysis">
    <header>
      <div class="title">实验数据分析</div>
      <span
        >用于对实验过程数据、结果数据以及相关专业数据进行统计分析、专题分析、关联分析等</span
      >
    </header>
    <ul class="content">
      <li class="searthBox">
        <el-input
          v-model="state.searth"
          style="width: 200px"
          clearable
        ></el-input>
        <el-button type="primary">查询</el-button>
      </li>
      <li class="tableBox">
        <el-table :data="state.tableData" style="width: 100%" height="400">
          <el-table-column
            prop="name"
            label="实验名称"
            width="180"
            align="center"
          />
          <el-table-column
            prop="type"
            label="实验类型"
            width="180"
            align="center"
          />
          <el-table-column
            prop="date"
            label="实验创建时间"
            width="180"
            align="center"
          />
          <el-table-column
            prop="status"
            label="实验状态"
            width="180"
            align="center"
          />
          <el-table-column label="操作" align="center">
            <template #default>
              <el-button type="primary" size="small">详情</el-button>
              <el-button
                type="primary"
                size="small"
                @click="openStatisticalAnalysis"
                >统计分析</el-button
              >
            </template>
          </el-table-column>
        </el-table>
      </li>
      <li class="pageBox">
        <el-pagination
          background
          v-model:page-size="state.size"
          :page-sizes="[10, 20, 30, 40]"
          layout="sizes, prev, pager, next, jumper"
          :total="50"
          :page-size="10"
        />
      </li>
    </ul>

    <statisticalAnalysis
      v-if="state.statisticalAnalysis_visible"
      @closeBox="state.statisticalAnalysis_visible = false"
    />
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import statisticalAnalysis from './components/statisticalAnalysis.vue'

const state = reactive({
  searth: '',
  tableData: [
    {
      name: '实验1',
      type: '实验类型1',
      date: '2025-05-15',
      status: '进行中'
    }
  ],
  size: 10,
  statisticalAnalysis_visible: false
})

const openStatisticalAnalysis = () => {
  state.statisticalAnalysis_visible = true
}
</script>

<style lang="less" scoped>
#experimentalDataAnalysis {
  width: 1000px;
  height: 600px;
  position: fixed;
  top: 50%;
  left: 50%;
  margin-left: -500px;
  margin-top: -300px;
  // transform: translate(-50%, -50%);
  background-color: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  color: #ffffff;
  text-align: left;
  padding: 20px;
  z-index: 1;

  header {
    border-bottom: 1px solid #02a7f0;
    margin-bottom: 20px;
    .title {
      font-size: 24px;
      font-weight: bold;
      margin-bottom: 10px;
    }
  }

  .content {
    list-style: none;
    margin: 0;
    padding: 0;
    .searthBox {
      :deep(.el-input__inner) {
        color: #ffffff;
      }
      :deep(.el-input__wrapper) {
        background-color: transparent;
        box-shadow: 0 0 0 1px rgba(129, 211, 248, 1) inset;
      }
      :deep(.el-button) {
        background-color: transparent;
        border-color: rgba(129, 211, 248, 1);
      }
    }
    .tableBox {
      padding: 20px 0;
      :deep(.el-table) {
        background-color: transparent;
        color: #ffffff;
        thead {
          color: #ffffff;
        }
        tr,
        th {
          background-color: transparent;
        }
        tr:hover {
          td.el-table__cell {
            background-color: rgba(129, 211, 248, 0.1);
          }
        }
      }
    }
    .pageBox {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      :deep(.el-input__wrapper) {
        background-color: transparent;
        .el-input__inner {
          color: #ffffff;
        }
      }
      :deep(.el-pagination__jump) {
        color: #ffffff;
      }
      :deep(.el-pager) {
        li {
          background-color: transparent;
          color: #ffffff;
          border: 1px solid #ffffff;
        }
        .is-active {
          color: #409eff;
        }
      }
      :deep(.el-pagination button) {
        background-color: transparent;
        color: #ffffff;
        border: 1px solid #ffffff;
      }
    }
  }
}
</style>
