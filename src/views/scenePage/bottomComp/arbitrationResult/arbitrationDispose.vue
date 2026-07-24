<!-- 裁决处理 -->
<template>
  <div class="dispose_config">
    <div class="header">
      <span class="header-left">裁决处理</span
      ><img src="@/assets/images/rwty/closeBLConfig.svg" @click="closePanel" />
    </div>
    <div class="dispose_content">
      <div class="dispose_header">
        <p>关键事件基本信息</p>
        <!-- <p style="cursor: pointer" @click="openEventClass">
          <img
            src="@/assets/images/rwty/任务中心.png"
            alt=""
            style="vertical-align: middle"
          />
          事件分类
        </p> -->
      </div>
      <el-table
        :data="vueData.keyEventTable"
        style="width: 100%"
        show-overflow-tooltip
        :header-cell-style="{ color: '#FFFFFF' }"
        max-height="200px"
        ref="tableRef"
      >
        <!-- <el-table-column type="selection" width="30" /> -->
        <el-table-column label="关键事件" width="80" align="center">
          <template #default="scope">
            {{ scope.row.eventMgt ? scope.row.eventMgt.eventName : '' }}
          </template>
        </el-table-column>
        <el-table-column label="时间" width="80" align="center">
          <template #default="scope">
            {{ scope.row.eventMgt ? scope.row.eventMgt.createTime : '' }}
          </template>
        </el-table-column>
        <el-table-column label="类型" align="center">
          <template #default="scope">
            {{ scope.row.eventMgt ? scope.row.eventMgt.eventType : '' }}
          </template>
        </el-table-column>
        <el-table-column label="发起方" align="center">
          <template #default="scope">
            {{ scope.row.eventMgt ? scope.row.eventMgt.eventOwner : '' }}
          </template>
        </el-table-column>
        <el-table-column label="阵营" align="center">
          <template #default="scope">
            {{ scope.row.eventMgt ? scope.row.eventMgt.side : '' }}
          </template>
        </el-table-column>
        <el-table-column label="内容" align="center">
          <template #default="scope">
            {{
              scope.row.eventMgt && scope.row.eventMgt.eventMsg
                ? JSON.parse(scope.row.eventMgt.eventMsg).Data.LabelName
                : ''
            }}
          </template>
        </el-table-column>
      </el-table>

      <p>申请裁决内容</p>
      <el-input
        v-model="vueData.content"
        type="textarea"
        placeholder="请输入申请裁决内容"
        :rows="4"
        disabled="disabled"
        resize="none"
      />
      <p>预期结果</p>
      <el-input
        v-model="vueData.resulted"
        type="textarea"
        placeholder="请输入预期结果"
        :rows="4"
        disabled="disabled"
        resize="none"
      />
    </div>
    <div class="dispose_footer">
      <el-button
        type="primary"
        v-show="vueData.seatName == '裁判评估'"
        @click="sendDispose(true)"
        >同意</el-button
      >
      <el-button
        type="danger"
        v-show="vueData.seatName == '裁判评估'"
        @click="sendDispose(false)"
        class="delBtn"
        >拒绝</el-button
      >
      <el-button
        type="primary"
        v-show="vueData.roleKey == 'pilotseat'"
        @click="sendExcute(true)"
        >执行</el-button
      >
      <el-button
        type="primary"
        v-show="vueData.roleKey == 'pilotseat'"
        @click="sendExcute(false)"
        class="concelBtn"
        >取消</el-button
      >
    </div>
  </div>
</template>
<script setup>
import { reactive, onBeforeMount, onMounted, watch } from 'vue'
import emitter from '@/utils/eventbus'
import { executeRule, executeEvent } from '@/service/adjudication'
import { ElMessage, ElNotification } from 'element-plus'
const props = defineProps({
  currentRow: {
    type: Object,
    default: {}
  }
})
const vueData = reactive({
  keyEventTable: [],
  content: '',
  resulted: '',
  currentChecked: [],
  ruleId: '',
  seatName: localStorage.getItem('systemTitle'),
  roleKey: sessionStorage.getItem('roleKey') // pilotseat:导调控制    Commandseat：红方指挥控制席  Informationseat:红方情报系
})

onBeforeMount(() => {})

onMounted(() => {
  vueData.keyEventTable = [props.currentRow]
  vueData.content = vueData.keyEventTable[0].details //申请裁决内容
  vueData.resulted = vueData.keyEventTable[0].expectation //期望结果
  vueData.ruleId = vueData.keyEventTable[0].id
})
// 关闭裁决处理弹框
const closePanel = () => {
  emitter.emit('sendShowDispose', false)
}
// 打开事件分类
// const openEventClass = () => {
//   emitter.emit('sendShowEventClass', true)
// }
const sendExcute = async (flag) => {
  if (flag) {
    if (!vueData.ruleId) {
      ElMessage({
        showClose: true,
        message: '请勾选关键事件',
        type: 'warning'
      })
      return
    }
    let params = {
      isAgree: true,
      ruleId: vueData.ruleId
      //userId: sessionStorage.getItem('userId')
    }
    await executeEvent(params).then((response) => {
      if (response.code == 200) {
        ElMessage({
          showClose: true,
          message: '提交成功',
          type: 'success'
        })
      } else {
        ElMessage({
          showClose: true,
          message: '提交失败',
          type: 'error'
        })
      }
    })
  }
  await closePanel()
}
const sendDispose = async (flag) => {
  if (!vueData.ruleId) {
    ElMessage({
      showClose: true,
      message: '请勾选关键事件',
      type: 'warning'
    })
    return
  }
  let params = {
    isAgree: flag,
    ruleId: vueData.ruleId,
    userId: sessionStorage.getItem('userId')
  }
  await executeRule(params).then((response) => {
    if (response.code == 200) {
      ElMessage({
        showClose: true,
        message: '提交成功',
        type: 'success'
      })
    } else {
      ElMessage({
        showClose: true,
        message: '提交失败',
        type: 'error'
      })
    }
  })
  await closePanel()
}
const handleCheck = (val) => {
  if (val.length > 0) {
    if (val.length > 1) {
      tableRef.value.clearSelection()
      tableRef.value.toggleRowSelection(val.pop())
      vueData.currentChecked = val
    } else if (val.length == 1) {
      vueData.currentChecked = val
    }
    vueData.content = val[0].details //申请裁决内容
    vueData.resulted = val[0].expectation //期望结果
    vueData.ruleId = val[0].id
  } else {
    vueData.content = ''
    vueData.resulted = ''
    vueData.ruleId = ''
  }
}
</script>
<style lang="less" scoped>
.dispose_config {
  z-index: 1000;
  width: 800px;
  height: 620px;
  position: fixed;
  right: calc(50% - 400px);
  top: 14%;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    border-bottom: 1px solid #2671ac66;

    .header-left {
      font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
      font-weight: 700;
      font-style: normal;
      font-size: 19px;
      color: #c2d7ee;
    }

    img {
      position: absolute;
      right: 10px;
      top: 10px;
      cursor: pointer;
    }
  }
  .dispose_content {
    padding: 0px 15px;
    .dispose_header {
      display: flex;
      justify-content: space-between;
    }
    p {
      text-align: left;
      color: #fff;
      font-size: 14px;
      padding: 0;
      margin: 0;
      padding: 10px 0;
    }
    :deep(.el-textarea__inner) {
      background-color: #2b4559 !important;
      box-shadow: 0 0 0 1px #075d89 inset !important;
      color: #fff !important;
    }
  }
  .dispose_footer {
    padding: 20px 15px;
    display: flex;
    justify-content: flex-end;
    .el-button {
      background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
      width: 65px;
      height: 32px;
      color: #ffff;
      border-radius: 5px;
      margin-left: 10px;
      cursor: pointer;
    }
    .delBtn {
      box-shadow: inset 0px 0px 15px 5px rgba(224, 18, 8, 0.46),
        inset 0px 0px 25px 3px rgba(224, 18, 8, 0.61);
      border: 1px solid #e03608;
    }
    .concelBtn {
      background: #fff !important;
      color: black;
    }
  }
}
::v-deep(.el-tabs__item) {
  color: #ffffff;
}
::v-deep(.el-tabs__item.is-active) {
  color: #409eff;
}
::v-deep(.el-tabs__item:hover) {
  color: #409eff;
}

::v-deep(.el-checkbox) {
  color: #ffffff;
}
::v-deep .el-table td.el-table__cell,
::v-deep .el-table th.el-table__cell.is-leaf,
::v-deep .el-table__body-wrapper {
  background: #2b4559 !important;
  color: #a3a6ad;
}
.el-table {
  --el-table-border-color: #075d89;
}
::v-deep(.el-table th.el-table__cell:nth-child(1) .cell) {
  visibility: hidden;
}
</style>
