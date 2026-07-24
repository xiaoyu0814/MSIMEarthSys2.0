<template>
  <div class="creat_plan animate__animated animate__fadeIn">
    <div class="header">
      <span class="header-left">编辑计划</span
      ><img src="@/assets/images/rwty/closeBLConfig.svg" @click="closePanel" />
    </div>
    <div class="creat_plan_content">
      <el-scrollbar style="height: 100%">
        <weather
          v-if="vueData.currentRows.typeCode == 'changeWeatherAfsimPlan'"
        ></weather>
        <electromagnetism
          v-if="
            vueData.currentRows.typeCode == 'changeElectromagnetismAfsimPlan'
          "
        ></electromagnetism>
        <ocean
          v-if="vueData.currentRows.typeCode == 'changeOceanAfsimPlan'"
        ></ocean>
        <editCreateItem
          v-if="vueData.currentRows.typeCode == 'createEntity'"
        ></editCreateItem>
        <editDeleteItem
          v-if="vueData.currentRows.typeCode == 'removeEntity'"
        ></editDeleteItem>
        <editWenDian
          v-if="vueData.currentRows.typeCode == 'wenDian'"
        ></editWenDian>

        <div class="time-box">
          <el-checkbox v-model="vueData.checked" label="执行时间" />
          <el-date-picker
            v-if="vueData.checked"
            v-model="vueData.time"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择执行时间"
          />
        </div>
      </el-scrollbar>
    </div>
    <div class="message_footer">
      <el-button type="primary" @click="save">保存</el-button>
      <el-button @click="closePanel">取消</el-button>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted, watch } from 'vue'
import emitter from '@/utils/eventbus'
import weather from '@/views/scenePage/bottomComp/messagePlan/environment_plan/component/weather.vue'
import electromagnetism from '@/views/scenePage/bottomComp/messagePlan/environment_plan/component/electromagnetism.vue'
import ocean from '@/views/scenePage/bottomComp/messagePlan/environment_plan/component/ocean.vue'
import editCreateItem from '@/views/scenePage/bottomComp/messagePlan/editPlan/editCreateItem'
import editDeleteItem from '@/views/scenePage/bottomComp/messagePlan/editPlan/editDeleteItem'
import editWenDian from '@/views/scenePage/bottomComp/messagePlan/editPlan/editWenDian.vue'
import { getDetail, editPlan } from '@/service/directingAdjusting'
import store from '@/store/index'
const emit = defineEmits(['sendCloseEdit'])
const props = defineProps({
  currentRow: {
    type: Object,
    default: {}
  }
})
const vueData = reactive({
  checked: true,
  time: '',
  currentRows: ''
})
// 获取详情
const getPlanDetail = () => {
  let params = {
    id: vueData.currentRows.id
  }
  getDetail(params).then((res) => {
    if (res.code == 200) {
      let detailObj = {
        type: vueData.currentRows.typeCode,
        content: res.data,
        save: false
      }
      store.commit('setPlanDetail', detailObj)
      let fzTime = new Date(store.state.sceneModule.msgMessionTime).getTime()
      let d = new Date(fzTime - res.data.runSeconds * 1000)
      let year = d.getFullYear()
      let month =
        d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
      let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
      let hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
      let minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
      let second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
      vueData.time =
        year +
        '-' +
        month +
        '-' +
        day +
        ' ' +
        hour +
        ':' +
        minute +
        ':' +
        second
    }
  })
}
const save = () => {
  if (vueData.checked) {
    if (!vueData.time) {
      ElMessage.warning('请选择执行时间!')
      return
    } else {
      let runTime = new Date(vueData.time).getTime()
      let msgMessionTime = new Date(
        store.state.sceneModule.msgMessionTime
      ).getTime()
      if (runTime && msgMessionTime) {
        store.state.sceneModule.planDetail.content.runSeconds = Math.floor(
          (msgMessionTime - runTime) / 1000
        )
      }
    }
  }
  if (store.state.sceneModule.planDetail.content) {
    editPlan(store.state.sceneModule.planDetail.content).then((res) => {
      if (res.code == 200) {
        ElMessage.success(res.data)
        store.state.sceneModule.planDetail.content = {}
        emit('sendCloseEdit', false)
      } else {
        ElMessage.error(res.data || '网络错误！')
      }
    })
  }
}
const closePanel = () => {
  store.state.sceneModule.planDetail.content = {}
  emit('sendCloseEdit', false)
}
watch(
  () => props.currentRow,
  (newVal, oldVal) => {
    if (newVal) {
      vueData.currentRows = newVal
      // 获取详情
      getPlanDetail()
    }
  },
  { immediate: true, deep: true }
)
onMounted(() => {})
</script>
<style lang="less" scoped>
.creat_plan {
  z-index: 1000;
  width: 550px;
  height: 600px;
  position: fixed;
  left: calc(50% - 275px);
  top: 13%;
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
  }
  .creat_plan_content {
    padding: 30px 30px 0 0;
    height: 480px;
    box-sizing: border-box;
    :deep(.el-form-item__label) {
      color: #fff !important;
    }
    :deep(.el-input) {
      .el-input__wrapper {
        border-radius: 5px;
        box-shadow: none;
        background-color: #2b4559 !important;
        box-shadow: 0 0 0 1px #075d89 inset !important;
      }
      .el-input__inner {
        color: #fff !important;
      }
    }
    .el-select {
      width: 100%;
      :deep(.el-select__wrapper) {
        background-color: #2b4559 !important;
        box-shadow: 0 0 0 1px #075d89 inset !important;
      }
    }
    :deep(.el-textarea__inner) {
      height: 90px;
      border-radius: 5px;
      box-shadow: none;
      color: #ffff;
      background-color: #2b4559 !important;
      box-shadow: 0 0 0 1px #075d89 inset !important;
    }
    :deep(.el-select__placeholder) {
      color: #fff;
    }
    .time-box {
      display: flex;
      flex-direction: column;
      padding-left: 20%;
      :deep(.el-checkbox) {
        color: #fff !important;
      }
    }
  }
  .message_footer {
    padding: 15px 30px;
    display: flex;
    justify-content: flex-end;
  }
}
</style>
