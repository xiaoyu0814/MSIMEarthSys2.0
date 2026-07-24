<template>
  <div id="details">
    <ul class="searchBox">
      <li>
        <el-input v-model="state.search" style="width: 200px"></el-input>
        <el-button type="primary" @click="search">查询</el-button>
      </li>
      <li>
        <el-select v-model="state.dataTime">
          <el-option
            v-for="item in state.dataTimeList"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          ></el-option>
        </el-select>
        <el-date-picker
          v-model="state.dataDate"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          style="width: 200px"
        />
      </li>
      <li>
        <el-button type="primary" @click="search">数据录入</el-button>
        <el-button type="primary" @click="search">数据导入</el-button>
        <el-button type="primary" @click="search">批量导出</el-button>
        <el-button type="primary" @click="_back">返回</el-button>
      </li>
    </ul>
    <div class="tableBox">
      <el-table :data="state.tableData" style="width: 100%">
        <el-table-column type="selection" width="55" align="center" />
        <el-table-column prop="dataName" label="数据名称" align="center" />
        <el-table-column prop="dataTime" label="数据时间" align="center" />
        <el-table-column prop="updataTime" label="更新时间" align="center" />
        <el-table-column prop="dataSize" label="数据量" align="center" />
        <el-table-column label="操作" align="center">
          <template #default>
            <el-button type="primary" size="small"> 详情 </el-button>
            <el-button type="primary" size="small"> 编辑 </el-button>
            <el-button type="primary" size="small"> 数据导出 </el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="pageBox">
      <el-pagination
        background
        v-model:page-size="state.size"
        :page-sizes="[10, 20, 30, 40]"
        layout="sizes, prev, pager, next, jumper"
        :total="50"
        :page-size="10"
      />
    </div>
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'

const emits = defineEmits(['back'])

const state = reactive({
  search: '',
  dataTime: '',
  dataTime: '1',
  dataTimeList: [
    { label: '数据时间', value: '1' },
    { label: '数据更新时间', value: '2' }
  ],
  datDate: '',
  tableData: [
    {
      dataName: '全球海洋温度分布数据',
      dataTime: '2024-01-10 09:30:00',
      updataTime: '2024-01-11 14:15:00',
      dataSize: '500MB'
    },
    {
      dataName: '大陆板块运动监测报告',
      dataTime: '2024-01-12 11:45:00',
      updataTime: '2024-01-13 16:30:00',
      dataSize: '750MB'
    },
    {
      dataName: '全球森林覆盖率统计数据',
      dataTime: '2024-01-14 13:00:00',
      updataTime: '2024-01-15 17:45:00',
      dataSize: '1GB'
    },
    {
      dataName: '大气污染物分布数据',
      dataTime: '2024-01-16 15:15:00',
      updataTime: '2024-01-17 19:00:00',
      dataSize: '600MB'
    },
    {
      dataName: '冰川融化速度研究文档',
      dataTime: '2024-01-18 17:30:00',
      updataTime: '2024-01-19 20:15:00',
      dataSize: '450MB'
    },
    {
      dataName: '全球降水模式反馈数据',
      dataTime: '2024-01-20 19:45:00',
      updataTime: '2024-01-21 22:30:00',
      dataSize: '800MB'
    },
    {
      dataName: '全球气候经济影响报表',
      dataTime: '2024-01-24 23:15:00',
      updataTime: '2024-01-25 02:30:00',
      dataSize: '700MB'
    },
    {
      dataName: '自然灾害风险评估汇总数据',
      dataTime: '2024-01-26 01:30:00',
      updataTime: '2024-01-27 04:45:00',
      dataSize: '950MB'
    },
    {
      dataName: '地理环境研究培训资料',
      dataTime: '2024-01-28 03:45:00',
      updataTime: '2024-01-29 07:00:00',
      dataSize: '550MB'
    }
  ],
  size: 10
})

const _back = () => {
  console.log('back')
  emits('back')
}

const search = () => {
  console.log('search')
}
</script>

<style lang="less" scoped>
#details {
  position: absolute;
  left: 0;
  top: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(2, 26, 70, 1);
  padding: 20px;
  .searchBox {
    padding: 0;
    margin: 0;
    display: flex;
    justify-content: space-between;
    align-items: center;
    li {
      display: flex;
      align-items: center;
    }
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
    padding: 10px 0;
    height: calc(100% - 36px - 32px - 20px);
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
  }
}
</style>
