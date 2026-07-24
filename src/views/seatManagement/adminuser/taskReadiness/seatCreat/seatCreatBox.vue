<template>
  <div class="create_box">
    <div class="header">
      <div class="title">新增席位</div>
      <div class="close_bold">
        <img src="@/assets/images/rwty/closeBLConfig.svg" @click="onCancel" />
      </div>
    </div>
    <div class="iden_form">
      <el-form :model="vueData.seatForm" label-width="80px">
        <el-form-item label="名称">
          <el-input
            v-model="vueData.seatForm.seatName"
            style="width: 250px"
            placeholder="请输入名称"
          />
        </el-form-item>
        <el-form-item label="描述">
          <el-input
            v-model="vueData.seatForm.seatDescribe"
            style="width: 250px"
            type="textarea"
            placeholder="请输入描述"
          />
        </el-form-item>
        <el-form-item style="padding-left: 50px">
          <el-button type="primary" @click="create_seatData">保存</el-button>
          <el-button @click="onCancel" class="concelBtn">取消</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { useStore } from 'vuex'
import emitter from '@/utils/eventbus'
import { reactive, onBeforeMount, onMounted, watch } from 'vue'
import { createSeat } from '@/service/missionPreparation/seatManagement'

const store = useStore()
const vueData = reactive({
  seatForm: {
    seatName: '',
    seatDescribe: ''
  }
})
// 取消
const onCancel = () => {
  emitter.emit('setShowCreatSeatBox', false)
}
/**
 * @description 创建席位方案
 */
let create_seatData = () => {
  if (!vueData.seatForm.seatName) {
    ElMessage({
      type: 'error',
      message: '请输入名称'
    })
    return
  }
  let params = {
    child: [
      {
        ctime: '',
        groupName: '',
        identifcation: 0,
        relations: [
          {
            assignmentId: '',
            equipmentName: '',
            ip: '',
            memberId: 0,
            memberName: '',
            roleKey: 'pilotseat',
            roleName: '导调席位',
            seatId: '',
            status: 0
          }
        ],
        seatId: 0,
        utime: ''
      }
    ],
    scenarioDescribe: vueData.seatForm.seatDescribe,
    scenarioName: vueData.seatForm.seatName
  }
  createSeat(params).then((res) => {
    if (res.code == 200) {
      ElMessage({
        type: 'success',
        message: '新建成功'
      })
      emitter.emit('setShowCreatSeatBox', false)
      emitter.emit('refreshSeatList', true)
    } else {
      ElMessage({
        type: 'error',
        message: '新建失败'
      })
    }
  })
}
</script>

<style lang="less" scoped>
.create_box {
  z-index: 38;
  position: fixed;
  left: 50%;
  top: 50%;
  width: 400px;
  height: 250px;
  margin-left: -205px;
  margin-top: -200px;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  .header {
    height: 40px;
    line-height: 40px;
    color: #ffffff;
    text-align: left;
    border-bottom: 1px solid #075d89;
    display: flex;
    justify-content: space-between;
    padding: 0 10px;
    .title {
      font-size: 15px;
    }
  }
  .iden_form {
    padding-top: 20px;
    :deep(.el-form-item__label) {
      color: #fff;
    }
    :deep(.el-input__wrapper) {
      background-color: #2b4559 !important;
      box-shadow: 0 0 0 1px #075d89 inset !important;
      .el-input__inner {
        color: #fff !important;
      }
    }
    :deep(.el-textarea__inner) {
      background-color: #2b4559 !important;
      box-shadow: 0 0 0 1px #075d89 inset !important;
      color: #fff !important;
    }
    .el-select {
      width: 100%;
      :deep(.el-select__wrapper) {
        background-color: #2b4559 !important;
        box-shadow: 0 0 0 1px #075d89 inset !important;
        .el-select__selected-item {
          color: #fff !important;
        }
        .el-select__placeholder.is-transparent {
          color: #a8abb2 !important;
        }
      }
    }
    .el-button {
      background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
      width: 65px;
      height: 33px;
      color: #ffff;
      border-radius: 5px;
      margin-left: 10px;
      cursor: pointer;
    }
    .concelBtn {
      background: #fff !important;
      color: black;
    }
  }
}
</style>
