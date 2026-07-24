<!--
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2025-05-16 13:21:29
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2025-07-11 10:36:06
 * @FilePath: \sjzWeb\src\views\scenePage\experimentalResourceManagement\experimentalBasicDatabase\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="experimentalBasicDatabase">
    <div class="header">
      <div class="titleBox">
        <div class="title">智能作战实验基础数据库</div>
        <el-icon size="30" style="cursor: pointer" @click="closeBox"
          ><Close
        /></el-icon>
      </div>
      <div class="infoBox">
        <span
          >用于对无人作战相关基础数据进行管理，支持各类基础数据的录入、编辑、统计、查询、导入导出等管理操作</span
        >
        <el-button
          type="primary"
          size="mini"
          @click="state.dataStatistics_visible = true"
        >
          数据统计
        </el-button>
      </div>
    </div>
    <div class="bottomBox">
      <div class="treeBox">
        <el-scrollbar height="100%">
          <el-tree
            style="max-width: 600px"
            :data="state.treeData"
            default-expand-all
            highlight-current
            :expand-on-click-node="false"
            @node-click="handleNodeClick"
          >
            <template #default="{ node }">
              <div class="custom-tree-node">
                <span>{{ node.label }}</span>
              </div>
            </template>
          </el-tree>
        </el-scrollbar>
      </div>
      <div class="contentBox">
        <ul class="searchBox">
          <li>
            <el-input v-model="state.search" style="width: 200px"></el-input>
            <el-button type="primary" size="mini">查询</el-button>
          </li>
          <li>
            <el-button type="primary" size="mini">数据录入</el-button>
            <el-button type="primary" size="mini">数据导入</el-button>
          </li>
        </ul>
        <div class="labelBox">
          <p>
            <span>{{ state.selectData.label }}</span>
            <span>总数：{{ state.selectData.dataList.length }}个</span>
          </p>
        </div>
        <ul class="dataBox">
          <li v-for="item in state.selectData.dataList" :key="item">
            <img
              src="~@/assets/images/dataaaa/u349.png"
              alt=""
              @click="state.details_visible = true"
            />
            <p>{{ item.label }}</p>
            <div>
              <el-button
                type="primary"
                size="mini"
                link
                @click="state.details_visible = true"
                >查看详情</el-button
              >
              <el-button type="primary" size="mini" link>编辑</el-button>
              <el-button type="primary" size="mini" link>删除</el-button>
              <el-button type="primary" size="mini" link>导出</el-button>
            </div>
          </li>
        </ul>
        <detailsCpn
          v-if="state.details_visible"
          @back="state.details_visible = false"
        />
      </div>
    </div>
    <dataStatistics
      v-if="state.dataStatistics_visible"
      @close="state.dataStatistics_visible = false"
    />
  </div>
</template>

<script setup>
import { reactive, ref } from 'vue'
import dataStatistics from './components/dataStatistics.vue'
import detailsCpn from './components/details.vue'
import { Close } from '@element-plus/icons-vue'
import store from '@/store/index'

const state = reactive({
  details_visible: false,
  dataStatistics_visible: false,
  treeData: [
    {
      label: '战场环境数据',
      children: [
        {
          label: '地理信息数据',
          children: [
            {
              label: '全球地理环境数据',
              dataList: [
                { label: '××地理环境数据' },
                { label: '××地理环境数据' },
                { label: '××地理环境数据' },
                { label: '××地理环境数据' },
                { label: '××地理环境数据' },
                { label: '××地理环境数据' },
                { label: '××地理环境数据' },
                { label: '××地理环境数据' }
              ]
            },
            { label: '自然地形地貌', dataList: [] },
            { label: '人工地物数据', dataList: [] }
          ]
        },
        {
          label: '气象水文数据',
          children: [
            { label: '中国地面高空气象观测数据', dataList: [] },
            { label: '卫星云图', dataList: [] },
            { label: '气象雷达拼图', dataList: [] }
          ]
        },
        {
          label: '电磁环境数据',
          children: [
            { label: '敌方电子对抗装备', dataList: [] },
            { label: '己方电子装备', dataList: [] },
            { label: '民用电子设备', dataList: [] },
            { label: '频域分布状态数据', dataList: [] },
            { label: '时域分布状态数据', dataList: [] }
          ]
        },
        {
          label: '海洋环境数据',
          children: [
            { label: '海洋海浪数值预报产品', dataList: [] },
            { label: '风浪流耦合数值预报', dataList: [] },
            { label: '海洋水文观测资料', dataList: [] },
            { label: '海洋区划', dataList: [] },
            { label: '海底地貌与底质', dataList: [] },
            { label: '电子海图', dataList: [] }
          ]
        },
        {
          label: '重要设施数据',
          children: [
            { label: '重要经济设施', dataList: [] },
            { label: '重要交通设施', dataList: [] },
            { label: '城市重要机构及设施', dataList: [] },
            { label: '重要信息设施', dataList: [] },
            { label: '重要作战设施', dataList: [] },
            { label: '重要后期装备设施', dataList: [] }
          ]
        }
      ]
    },
    {
      label: '作战力量数据',
      children: [
        { label: '兵力编制数据', children: [] },
        { label: '能力指标数据', children: [] },
        { label: '武器配备数据', children: [] },
        { label: '作战部署数据', children: [] }
      ]
    },
    {
      label: '武器装备数据',
      children: [
        { label: '图文资料数据', children: [] },
        { label: '三维模型数据', children: [] },
        { label: '战技性能数据', children: [] },
        { label: '指标参数数据', children: [] }
      ]
    },
    {
      label: '军事设施数据',
      children: [
        { label: '图文资料数据', children: [] },
        { label: '三维模型数据', children: [] },
        { label: '战技性能数据', children: [] },
        { label: '指标参数数据', children: [] }
      ]
    }
  ],
  search: '',
  selectData: {
    dataList: [] // 初始化 selectData 为一个空数组或其他默认值，以避免未定义的错误
  }
})

const basicDBTitle = ref(EarthAPP.sysTitle)

const handleNodeClick = (data, node) => {
  console.log(data)
  state.details_visible = false
  if (data.dataList) state.selectData = data
  else return
}

const closeBox = () => {
  store.commit('setExperimentalBasicDatabaseVisible', false)
}
</script>

<style lang="less" scoped>
#experimentalBasicDatabase {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  top: 100px;
  z-index: 1;
  background-color: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  color: #ffffff;
  padding: 20px;

  .header {
    height: 90px;
    text-align: left;
    border-bottom: 1px solid #1092d5;
    .titleBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .title {
        font-size: 28px;
        font-weight: bolder;
      }
    }
    .infoBox {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
  }

  .bottomBox {
    display: flex;
    height: calc(100% - 100px);
  }

  .treeBox {
    width: 300px;
    height: 100%;
    border-right: 1px solid #ffffff;

    :deep(.el-tree) {
      background-color: transparent;
      color: #ffffff;
      .el-tree-node__content:hover {
        background-color: rgba(255, 255, 255, 0.1);
      }
      .el-tree-node:focus > .el-tree-node__content {
        background-color: rgba(255, 255, 255, 0.1);
      }
    }

    :deep(
        .el-tree--highlight-current
          .el-tree-node.is-current
          > .el-tree-node__content
      ) {
      background-color: #409eff;
    }
  }
  .contentBox {
    position: relative;
    flex: 1;
    padding: 20px;
    .searchBox {
      margin: 0;
      padding: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 20px;
    }
    .labelBox {
      text-align: left;
      margin-bottom: 20px;
      p {
        font-size: 18px;
        font-weight: bold;
      }
    }
    .dataBox {
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      gap: 40px;
      li {
        width: 17.9%;
        background-color: #ffffff;
        color: #000000;
        img {
          height: 150px;
          width: 100%;
        }
      }
    }
  }
}
</style>
