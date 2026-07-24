<!--
 * @description: 
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-09-19 15:14:20
 * @LastEditors: ZX Li
 * @LastEditTime: 2024-10-25 10:12:29
-->
<template>
  <div>
    <Transition
      name="custom-classes"
      enter-active-class="animate__animated animate__backInLeft"
      leave-active-class="animate__animated animate__backOutLeft"
    >
      <div class="target-container menuPanel-guidePowerComp">
        <img
          src="@/assets/image/panelIcons/关闭icon.png"
          alt=""
          class="close_sty"
          @click="handleClose"
        />
        <div class="target-infor">
          <div class="title-name">目标信息</div>
          <div class="container">
            <el-row>
              <el-col
                :span="12"
                class="card"
                v-for="(item, index) in vueData.targetInforData"
                :key="index"
              >
                <div class="content">
                  <label>{{ item.name }}:</label><span>{{ item.value }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="equipment-infor">
          <div class="title-name">设施信息</div>
          <div
            class="container"
            style="height: 150px; overflow: auto; margin-right: 10px"
          >
            <el-row v-for="(item, index) in vueData.equimentData" :key="index">
              <el-col :span="8">
                <div class="content">
                  <label>名称：</label><span>{{ item.name }}</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="content">
                  <label>类型:</label><span>{{ item.type }}</span>
                </div>
              </el-col>
              <el-col :span="8">
                <div class="content">
                  <label>半径:</label><span>{{ item.raduis }}</span>
                </div>
              </el-col>
            </el-row>
          </div>
        </div>
        <div class="target-table">
          <el-table
            :data="vueData.tableData"
            border
            show-overflow-tooltip
            style="width: 100%; background: #061d476e; height: 224px"
            @row-click="clickRowFun"
            highlight-current-row
            ref="tableRef"
          >
            <el-table-column
              label="序号"
              width="55"
              type="index"
              align="center"
              fit
            />
            <el-table-column
              label="目标名称"
              align="center"
              prop="labelName"
              fit
            />
            <!-- <el-table-column label="mubiao批次" align="center" prop="pc" fit /> -->
            <el-table-column
              label="威胁等级"
              align="center"
              prop="weightValue"
              fit
            />
          </el-table>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup>
import { useStore } from 'vuex'
import { reactive, onMounted, onUnmounted, watch, ref } from 'vue'
import { ElMessage } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import emitter from '@/utils/eventbus'
import { getAllThreatPrediction } from '@/service/threatAnalysis.js'
const store = useStore()
const props = defineProps({})
const tableRef = ref()
let vueData = reactive({
  defaultProps: {
    children: 'children',
    label: 'name'
  },
  targetInforData: [
    {
      name: '名称',
      value: '航母1'
    },
    {
      name: '类型',
      value: '航母'
    },
    {
      name: '编号',
      value: '324523232'
    },
    {
      name: '速度',
      value: '100KM/H'
    },
    {
      name: '航向角',
      value: '280°'
    }
  ],
  equimentData: [
    {
      name: 'F-35',
      type: '战斗机',
      raduis: '1000KM'
    },
    {
      name: '雷达',
      type: '雷达',
      raduis: '800KM'
    },
    {
      name: '雷达',
      type: '雷达',
      raduis: '800KM'
    }
  ],
  tableData: [],
  clickRowIndex: 0
})
//监听所有weixie目标数据变化
watch(
  () => store.state.sceneModule.threatAllData,
  (newValue, oldValue) => {
    vueData.tableData = newValue
  }
)
const handleClose = () => {
  emitter.emit('closeBottomControlPanel', 'left')
}
const tableRowClassName = (row) => {
  if (row.rowIndex == vueData.clickRowIndex) {
    return 'cellStyle'
  }
}
const clickRowFun = (row, column, event) => {
  emitter.emit('ThreatInformation', true)
}
onMounted(() => {
  let params = {
    flag: true
  }
  getAllThreatPrediction(params).then((res) => {
    if (res.code == 200) {
      res.data.forEach((element) => {
        element.weightValue = Math.round(element.weightValue * 100)
      })
      vueData.tableData = res.data
      tableRef.value.setCurrentRow(vueData.tableData[0])
      store.commit('setThreatAllData', res.data)
    }
  })
})
onUnmounted(() => {
  //调用接口参数flag:false，执行停止eventsourceControl中的事件消息推送ThreatPrediction
  getAllThreatPrediction({ flag: false })
})
</script>
<style lang="less" scoped>
.menuPanel-guidePowerComp {
  border-width: 0px;
  // z-index: 3;
  position: fixed;
  left: 0px;
  top: 10%;
  width: 400px;
  height: 615px;
  // max-height: 810px;
  // background-image: url(@/assets/images/rwty/background.svg);
  // background-size: 100% 100%;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  font-size: 16px;
  color: #fff;
  .title-name {
    height: 50px;
    text-align: left;
    padding-left: 20px;
    line-height: 50px;
    font-size: 18px;
    font-weight: 600;
  }
  .container {
    border-top: 1px solid #0b3855;
    border-bottom: 1px solid #0b3855;
  }
  .target-infor {
    .content {
      text-align: left;
      margin: 6px 30px;
    }
  }
  .equipment-infor {
    :deep(.el-row) {
      margin-top: 10px;
    }
  }
  .target-table {
    margin: 20px;
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
    background-color: rgba(0, 123, 204, 0.15) !important;
  }
  .close_sty {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 20px;
    width: 20px;
    height: 20px;
  }
  :deep(.el-table) {
    .cellStyle {
      background-color: rgba(255, 255, 255, 0.5) !important;
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 13px;
      letter-spacing: normal;
      color: #000;
    }
    .cellStyle1 {
      background-color: #394b2a !important;
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 13px;
      letter-spacing: normal;
    }
    .el-table__body tr.current-row > td {
      background-color: rgba(255, 255, 255, 1) !important;
    }
    /* 用来设置当前页面element全局table 选中某行时的背景色*/
    .el-table__body tr.current-row > td {
      background-color: #223b0b !important;
      color: #fff;
      /* color: #f19944; */ /* 设置文字颜色，可以选择不设置 */
    }
    /* 用来设置当前页面element全局table 鼠标移入某行时的背景色*/
    .el-table--enable-row-hover .el-table__body tr:hover > td {
      background-color: #f1dfb2;
      color: #fff;
      /* color: #f19944; */ /* 设置文字颜色，可以选择不设置 */
    }
  }
}
</style>
