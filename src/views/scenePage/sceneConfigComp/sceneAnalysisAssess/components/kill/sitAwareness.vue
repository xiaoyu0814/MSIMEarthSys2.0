<!--
 * @Author: dunqiancun duqiancun@piesat.cn
 * @Date: 2024-05-15 10:00:16
 * @LastEditors: dunqiancun duqiancun@piesat.cn
 * @LastEditTime: 2024-05-30 17:52:21
 * @FilePath: \MSIMEarthSysN\src\views\analysisAssess\troops.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="troops-Information">
    <div class="top-content">
      <div class="top-btn">
        <el-button
          @click="tableChange('red')"
          :class="vueData.isCurrent == 1 ? 'isCurrent' : ''"
          >红方</el-button
        >
        <el-button
          @click="tableChange('blue')"
          :class="vueData.isCurrent == 2 ? 'isCurrent' : ''"
          >蓝方</el-button
        >
      </div>
    </div>

    <div class="botton-content">
      <div class="echarts-bar">
        <span class="right-title">单位:({{ vueData.unit }})</span>
        <div
          :class="
            vueData.heightLight == item.id
              ? 'left-items-active left-items'
              : 'left-items'
          "
          v-for="(item, index) in vueData.leftList"
          :key="index"
          @click="getZYContrast(item.id)"
        >
          <div class="items-item">
            <div class="active-icon"></div>
            <div class="items-item-left">
              <img src="~@/assets/images/indicator/icon04.png" alt="" />
              <span>{{ item.name }}</span>
            </div>
            <span>{{ item.value }}</span>
          </div>
          <div class="items-item">
            <div class="items-item-left">
              <img src="~@/assets/images/indicator/icon04.png" alt="" />
              <span>{{ item.named }}</span>
            </div>
            <span>{{ item.valued }}</span>
          </div>
        </div>
        <sitAwarenessAxisEcharts />
        <!-- <sitAwarenessAxisEcharts :isCurRed="vueData.isCurrent" /> -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, nextTick, watch, markRaw, onUnmounted } from 'vue'
import { getHitTableData } from '@/service/analysisAssess.js'
import sitAwarenessAxisEcharts from './sitAwarenessAxisEcharts.vue' //z折线图
const vueData = reactive({
  activeName: 'red',
  unit: '目标个数',
  heightLight: '',
  isCurrent: 1,
  leftList: [
    {
      name: '探测',
      value: '9',
      named: '被探测',
      valued: '2'
    },
    {
      name: '识别',
      value: '7',
      named: '被识别',
      valued: '3'
    },
    {
      name: '跟踪',
      value: '4',
      named: '被跟踪',
      valued: '1'
    },
    {
      name: '匹配',
      value: '6',
      named: '被匹配',
      valued: '0'
    },
    {
      name: '打击',
      value: '3',
      named: '被打击',
      valued: '1'
    }
  ]
})
const tableChange = (color) => {
  vueData.isCurrent = color == 'red' ? 1 : 2
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

.troops-Information {
  width: 100vw;
  height: 100vh;
}
:deep(.el-tabs__nav-scroll) {
  border: 1px solid #387ca6 !important;
}

.right-title {
  text-align: center;
  height: 30px;
  line-height: 30px;
  font-size: 16px;
  color: #73e0fd;
}
.echarts-bar {
  width: 100%;
  height: 100%;
  padding: 30px 30px 20px 20px;
  box-sizing: border-box;
}

.left-items {
  width: 100%;
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  cursor: pointer;
  padding: 0 20px;
  box-sizing: border-box;
}

.left-items-active {
  background: rgba(0, 43, 59, 0.2);
  box-shadow: inset 0px 0px 15px 0px #3fc5ff;
  border: 1px solid #10c1ff;

  .items-item {
    .active-icon {
      background: url('@/assets/images/indicator/icon05.png') no-repeat;
      background-size: 100% 100%;
      position: relative;
      top: 2px;
    }
  }
}
.items-item {
  display: flex;
  align-items: center;

  .active-icon {
    width: 20px;
    height: 20px;
  }

  .items-item-left {
    white-space: nowrap;
    font-size: 14px;
    color: #d7f2ff;
    padding: 0 10px;
    box-sizing: border-box;
    img {
      height: 20px;
      margin-right: 5px;
    }
    span {
      padding: 0 10px;
    }
  }

  & > span {
    width: 80px;
    line-height: 26px;
    margin-left: 10px;
    font-size: 18px;
    font-weight: 600;
    color: #dcf4ff;
    background: linear-gradient(180deg, #ffffff 0%, #ffd760 100%);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
}
.top-content {
  height: 10%;
}
.botton-content {
  height: 90%;
}
</style>
