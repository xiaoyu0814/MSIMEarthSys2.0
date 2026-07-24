<!--
 * @description:
 * @Version: 1.0
 * @Author: duqiancun
 * @Date: 2024-05-14 14:38:14
 * @LastEditors: root you@example.com
 * @LastEditTime: 2024-08-21 15:25:17
-->
<template>
  <el-row class="basic-Information" :gutter="20">
    <el-col :span="8" class="left-Information">
      <div class="content-all h-50 content-overflow">
        <span class="form-title-all">综合信息</span>
        <div class="title-all">
          基本信息 <span @click="detailsClick">更多</span>
        </div>
        <ul class="colunm-item">
          <li v-for="(item, idx) in vueData.formInfo" :key="idx" class="itemLi">
            <span class="itemLabel">{{ item.label }}</span>
            <el-tooltip :content="item.value">
              <span
                :class="{
                  itemValue: true,
                  setHieght: item.label == '想定详情' ? true : false,
                  textStyle: item.label == '任务目的' ? true : false
                }"
                >{{ item.value }}</span
              >
            </el-tooltip>
          </li>
        </ul>
      </div>

      <div class="content-all content-info h-50">
        <span class="title-all">推演日志</span>
        <realTimeInformation></realTimeInformation>
      </div>
    </el-col>

    <el-col :span="16" class="right-Information">
      <div class="content-all h-50">
        <span class="form-title-all">态势对比分析</span>
        <div class="flex-all h-48">
          <radarEcharts></radarEcharts>
          <lineEcharts></lineEcharts>
        </div>
      </div>
      <div class="content-all h-50">
        <span class="form-title-all">综合对比</span>
        <div class="flex-all h-48">
          <div class="comparison-all">
            <span class="title-all">兵力规模</span>
            <axisEcharts></axisEcharts>
          </div>

          <div class="comparison-all">
            <span class="title-all">战果对比</span>
            <el-table
              :data="vueData.tableData"
              style="width: 100%"
              :row-class-name="tableRowClassName"
            >
              <el-table-column
                prop="value"
                label="作战工具"
                align="center"
                fit
              />
              <el-table-column
                prop="results"
                label="战果对比"
                align="center"
                fit
              />
              <el-table-column
                prop="damage"
                label="战损对比"
                align="center"
                fit
              />
            </el-table>
          </div>
        </div>
      </div>
    </el-col>
  </el-row>
  <el-dialog
    v-model="vueData.isShow"
    width="800"
    height="400"
    title="想定详情"
    model="false"
    :before-close="handleClose"
    custom-class="custom-dialog-background"
  >
    <XDDetail />
  </el-dialog>
</template>
<script setup>
import { reactive, watch, onMounted, getCurrentInstance } from 'vue'
import realTimeInformation from '@/views/scenePage/rightComp/realTimeInformation/index.vue' //日志
import axisEcharts from './components/comprehensive/axisEcharts.vue' //柱状图
import radarEcharts from './components/comprehensive/radarEcharts.vue' //雷达图
import lineEcharts from './components/comprehensive/lineEcharts.vue' //折线图
import XDDetail from './components/comprehensive/XDDetail.vue' //基本信息详情
// import XDDetail from '@/views/seatManagement/adminuser/sceneManagement/XDDetail.vue' //基本信息详情
import { useStore } from 'vuex'
import { getTaskInfoTaskId } from '@/service/analysisAssess.js'
import { ElMessage } from 'element-plus'
const store = useStore()
const { proxy } = getCurrentInstance()

watch(
  () => store.getters.getAnalysisInfoData,
  (newVal) => {
    let tableData = newVal.comparison.ComparisonOfResults.tableData
    vueData.tableData = tableData
  }
)

const vueData = reactive({
  formTitle: '',
  formInfo: [],
  formDetailData: {},
  isShow: false,
  tableData: []
})
//关闭详情弹窗
const handleClose = () => {
  vueData.isShow = false
}
//显示详情弹窗
const detailsClick = () => {
  vueData.isShow = true
}
//  获取基本信息及详情
const _getTaskInfoByTaskId = () => {
  let param = {
    taskId: sessionStorage.getItem('taskId')
  }
  getTaskInfoTaskId(param).then((res) => {
    if (res.code != 200)
      ElMessage.warning(res.msg) || ElMessage.warning('网络错误，请稍后再试！')
    vueData.formDetailData = res.data
    store.commit('setTaskInfoTaskIdData', vueData.formDetailData) //关闭模型描边、精模简模切换功能
    vueData.formInfo = [
      {
        label: '想定名称',
        value:
          vueData.formDetailData && vueData.formDetailData.name
            ? vueData.formDetailData.name
            : ''
      },
      {
        label: '想定时间',
        value: vueData.formDetailData.ctime
      },

      {
        label: '想定详情',
        value: vueData.formDetailData.scenarioDetail
      },
      {
        label: '任务目的',
        value: vueData.formDetailData.taskPurpose
      }
    ]
  })
}
const tableRowClassName = ({ row, rowIndex }) => {
  return rowIndex % 2 == 0 ? 'warning-row' : 'success-row'
}
onMounted(() => {
  _getTaskInfoByTaskId()
  proxy.$showLoading('.basic-Information')
  setTimeout(() => {
    proxy.$hideLoading()
  }, 5000)
})
</script>

<style lang="less" scoped>
.basic-Information {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: space-between;
  padding: 4px 0;
  // padding: 0;
  box-sizing: border-box;
  margin: 0 !important;
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

.title-all {
  text-align: left;
  width: 100%;
  padding: 0 20px;
  display: block;
  box-sizing: border-box;
  position: relative;
  color: #fff;
  font-size: 14px;
  position: relative;
  line-height: 30px;

  span {
    position: absolute;
    top: 6px;
    right: 10px;
    width: 30px;
    text-align: center;
    height: 100%;
    font-size: 12px;
    color: #fff;
    cursor: pointer;
  }

  &:after {
    content: '';
    position: absolute;
    top: 10px;
    left: 6px;
    width: 10px;
    height: 10px;
    background: #00cbff;
    border-radius: 50%;
  }
}

.itemLi {
  display: flex;
  padding-right: 5px;
  margin-bottom: 5px;
  height: 40px;
  margin-left: -30px;

  .itemLabel {
    width: 100px;
    height: 30px;
    display: inline-block;
    background: url('~@/assets/images/indicator/icon03.png');
    background-size: 100% 100%;
    text-align: center;
    vertical-align: top;
    line-height: 30px;
    font-size: 14px;
    color: #73e0fd;
  }

  .itemValue {
    font-size: 14px;
    color: #ffffff;
    padding-left: 8px;
    padding-top: 6px;
    margin-left: 3px;
    margin-right: 5px;
    flex: 1;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    height: 25px;
    //background: rgba(48, 163, 255, 0.1);
    text-align: left;
  }
}

.content-info {
  position: relative;
  margin-top: 10px;
}

.realTimeInfo {
  position: absolute;
  left: 0 !important;
  right: auto !important;
  bottom: 0 !important;
  top: 40px !important;
}

.flex-all {
  width: 100%;
  display: flex;
}

:deep(.content-info .content-img, .scrollbar .content-img) {
  display: none !important;
}

.realTimeInfo {
  width: 100% !important;
  height: 96% !important;
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

.left-Information {
  height: 100%;

  // .content-overflow {
  //   overflow: auto;
  // }
  .content-all {
    width: 100%;

    .colunm-item {
      // 40px 综合信息title高     30px 基本信息title高
      height: calc(100% - 40px - 30px);
      overflow: auto;
    }

    // 弹框zz信息溢出问题
    :deep(.collapse-interaction) {
      height: calc(100% - 68px) !important;
      padding-bottom: 2px !important;
    }

    // height: 50%;
    // overflow-y: scroll;
  }
}

.right-Information {
  height: 100%;

  .content-all {
    // height: 50%;
  }
}

.comparison-all {
  width: 50%;
  height: 100%;
  text-align: left;
}

:deep(.pie-echart) {
  border: 1px solid #387ca6;
  width: 50%;
  height: calc(100% - 30px);
  margin-right: 6px;
}

:deep(
    .el-table__body-wrapper,
    .el-table__footer-wrapper,
    .el-table__header-wrapper
  ) {
  background-color: rgba(2, 26, 70, 0.88) !important;
}

:deep(.el-dialog__header),
:deep(.el-dialog__body),
:deep(.el-dialog),
:deep(.custom-dialog-background),
.custom-dialog-background {
  background: rgba(2, 26, 70, 0.88) !important;
}

:deep(.el-tab-pane) {
  height: 100%;
}

.h-50 {
  height: 47%;
  width: 100%;
}

.h-48 {
  height: calc(100% - 40px);
  width: 100%;
}

:deep(.el-dialog),
.custom-dialog-background {
  background: rgba(2, 26, 70, 0.88) !important;
}

.setHieght {
  display: block !important;
  height: 169px !important;
  overflow: auto !important;
}

.textStyle {
  overflow: hidden !important;
  text-overflow: ellipsis !important;
  white-space: nowrap !important;
  display: inline-block !important;
}
</style>
