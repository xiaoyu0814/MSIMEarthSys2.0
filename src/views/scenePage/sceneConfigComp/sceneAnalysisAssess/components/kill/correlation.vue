<!--
 * @Author: dunqiancun duqiancun@piesat.cn
 * @Date: 2024-05-15 10:00:16
 * @LastEditors: ZX Li
 * @LastEditTime: 2024-05-31 13:27:30
 * @FilePath: \MSIMEarthSysN\src\views\analysisAssess\troops.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="troops-Information">
    <div class="top-content">
      <div class="content-all">
        <el-tree
          :data="vueData.redData"
          show-checkbox
          node-key="id"
          :default-expanded-keys="[2, 3]"
          :default-checked-keys="[5]"
          :props="defaultProps"
        />
        <div class="sift-operate-box">
          <div
            class="operate"
            :class="{ 'operate-choice': item.select }"
            v-for="(item, key) in vueData.operate"
            :key="key"
          >
            <span @click="operateFn(item)">{{ item.label }}</span>
          </div>
        </div>
        <el-tree
          style="margin-left: 19%"
          :data="vueData.blueData"
          show-checkbox
          node-key="id"
          :default-expanded-keys="[2, 3]"
          :default-checked-keys="[5]"
          :props="defaultProps"
        />
      </div>
    </div>
    <!--表格-->
    <div class="bottom-content">
      <span class="form-title-all">探测</span>
      <correlationAxisEcharts />
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, nextTick, watch, markRaw, onUnmounted } from 'vue'
import { getHitTableData } from '@/service/analysisAssess.js'
import correlationAxisEcharts from './correlationAxisEcharts.vue' //柱状图
import { getResultReplay } from '@/service/replayTime'

const vueData = reactive({
  deatroyData: [],
  activeName: 'red',
  operate: [
    {
      id: 0,
      label: '探测',
      select: true
    },
    {
      id: 1,
      label: '识别',
      select: false
    },
    {
      id: 2,
      label: '跟踪',
      select: false
    },
    {
      id: 3,
      label: '匹配',
      select: false
    },
    {
      id: 4,
      label: '打击',
      select: false
    }
  ],
  blueData: [
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
  redData: [
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
  ]
})
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
const getRedForceResult = () => {
  getResultReplay().then((res) => {
    if (res.code != 200)
      ElMessage.warning(res.msg) || ElMessage.warning('网络错误，请稍后再试！')
    vueData.redData = res.red.sideTypeJson.children
    vueData.blueData = res.blue.sideTypeJson.children
  })
}
const operateFn = (ele) => {
  vueData.operate.map((item) => {
    item.select = false
  })
  ele.select = true
}

onMounted(async () => {
  //await getRedForceResult()
  //onSearch()
})
</script>

<style lang="less" scoped>
.content-all {
  width: 100%;
  display: flex;
  .el-tree:nth-child(2) {
    margin-left: 19%;
  }
}
.content-all-flex {
  display: flex;
  padding: 0;
  height: 33%;
  margin-bottom: 2px;
  font-size: 14px;
  display: flex;
  padding: 6px 0;
  box-sizing: border-box;
  justify-content: center;
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
.left-content {
  display: flex;
  width: 10%;
  overflow: hidden;
  padding: 6px 10px;
  box-sizing: border-box;
}
.bottom-content {
  height: 50%;
  width: 90%;
  overflow: hidden;
  padding: 6px 10px;
  box-sizing: border-box;
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

.troops-Information {
  width: 100vw;
  height: 100vh;
  .top-content {
  }
}
.flex1 {
  flex: 1;
}

:deep(.el-tree) {
  background: rgba(2, 26, 70, 0.88) !important;
  color: #fff;
  width: 30%;
}
:deep(.el-tree .el-tree-node__content:hover) {
  background-color: transparent !important;
}
.sift-operate-box {
  width: 10%;
  height: 100%;
  padding: 30px 0;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  margin-left: 5%;
  .operate {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 50px;
    font-size: 20px;
    font-family: YouSheBiaoTiHei;
    background: url('~@/assets/images/indicator/icon06.png') no-repeat;
    background-size: 100% 100%;
    cursor: pointer;

    span {
      color: #69a9d2;
    }

    &.operate-choice {
      background: url('~@/assets/images/indicator/icon07.png') no-repeat top
        left;
      background-size: 100% 100%;

      span {
        font-size: 20px;
        font-family: YouSheBiaoTiHei;
        color: #ffffff;
        background: linear-gradient(180deg, #ffffff 0%, #6dffe5 100%);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }
    }
  }
}
</style>
