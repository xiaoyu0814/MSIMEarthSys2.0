<template>
  <div class="environment_plan">
    <div class="envir_content">
      <div class="seleteEnvir">
        <el-form :model="vueData.selectForm" label-width="100px">
          <el-form-item label="类型:">
            <el-select
              v-model="vueData.selectForm.selectedName"
              @change="selectChange"
            >
              <el-option
                v-for="(item, index) in vueData.selectList"
                :key="index"
                :label="item.name"
                :value="item.name"
              ></el-option>
            </el-select>
          </el-form-item>
        </el-form>
      </div>
      <div v-if="selectId">
        <component :is="selectId" @sendEnvironmentData="getWeather"></component>
      </div>
      <div class="envir_config">
        <div class="time-box">
          <el-checkbox v-model="vueData.checked" label="执行时间" />
          <el-date-picker
            v-if="vueData.checked"
            v-model="vueData.time"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择执行时间"
          />
          <!-- <el-checkbox v-model="vueData.drawPanel" label="区域设置" /> -->
          <drawPanel
            v-if="vueData.drawPanel"
            :tableEdit="true"
            @getTableData="getTableElectData"
          >
          </drawPanel>
        </div>
      </div>
    </div>
    <div class="envir_footer">
      <el-button
        type="primary"
        :disabled="vueData.checked"
        @click="save('立即执行')"
        >立即执行</el-button
      >
      <el-button
        type="primary"
        @click="save('保存')"
        :disabled="!vueData.checked"
        >保存</el-button
      >
      <el-button @click="closePanel" class="concelBtn">取消</el-button>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted, watch, ref } from 'vue'
import emitter from '@/utils/eventbus'
import weather from '@/views/scenePage/bottomComp/messagePlan/environment_plan/component/weather'
import ocean from '@/views/scenePage/bottomComp/messagePlan/environment_plan/component/ocean.vue'
import electromagnetism from '@/views/scenePage/bottomComp/messagePlan/environment_plan/component/electromagnetism.vue'
import drawPanel from '@/views/scenePage/bottomComp/messagePlan/drawPanel/drawPanel'
import store from '@/store/index'
import {
  changeWeatherAfsim,
  electromagnetismw,
  oceanx
} from '@/service/directingAdjusting'

const selectId = ref(weather)

const vueData = reactive({
  selectList: [
    { name: '气象', value: weather },
    { name: '海洋', value: ocean },
    { name: '电磁', value: electromagnetism }
  ],
  selectForm: {
    selectedName: '气象'
  },
  checked: false,
  time: '',
  drawPanel: false,
  environmentData: {},
  btnType: ''
})

// 动态组件切换h
const selectChange = (val) => {
  selectId.value = vueData.selectList.find(
    (element) => element.name == val
  ).value
}

// 保存
const save = (val) => {
  vueData.btnType = val
  emitter.emit('getEnvironmentData', vueData.selectForm.selectedName)
}
// 保存，获取参数调用接口
const getWeather = (val) => {
  vueData.environmentData = val
  let params = {}
  let runSeconds = null
  if (vueData.btnType == '保存') {
    if (!vueData.time) {
      ElMessage.warning('请选择执行时间！')
      return
    } else {
      let runTime = new Date(vueData.time).getTime()
      let msgMessionTime = new Date(
        store.state.sceneModule.msgMessionTime
      ).getTime()
      if (runTime && msgMessionTime) {
        runSeconds = Math.floor((msgMessionTime - runTime) / 1000)
      }
    }
  } else if (vueData.btnType == '立即执行') {
    runSeconds = null
  }
  switch (vueData.selectForm.selectedName) {
    case '气象':
      params = {
        planName: vueData.environmentData.planName,
        landCover: vueData.environmentData.landCover,
        landFormation: vueData.environmentData.landFormation,
        seaState: vueData.environmentData.seaState,
        rainRate: vueData.environmentData.rainRate,
        cloudWaterDensity: vueData.environmentData.cloudWaterDensity,
        rainAltitudeLimit: vueData.environmentData.rainAltitudeLimit,
        runSeconds: runSeconds
      }
      changeWeatherAfsim(params).then((res) => {
        if (res && res.code == 200) {
          ElMessage.success(res.data)
          emitter.emit('closeCreatePlan', false)
        } else {
          ElMessage.error('网络错误！')
        }
      })
      break
    case '海洋':
      params = {
        planName: vueData.environmentData.planName,
        level: vueData.environmentData.level,
        waveHeight: vueData.environmentData.waveHeight,
        runSeconds: runSeconds
      }
      oceanx(params).then((res) => {
        if (res && res.code == 200) {
          ElMessage.success(res.data)
          emitter.emit('closeCreatePlan', false)
        } else {
          ElMessage.error('网络错误！')
        }
      })
      break
    case '电磁':
      params = {
        planName: vueData.environmentData.planName,
        electIntensity: vueData.environmentData.electIntensity,
        frequency: vueData.environmentData.frequency,
        radSourceType: vueData.environmentData.radSourceType,
        ratedPower: vueData.environmentData.ratedPower,
        textGain: vueData.environmentData.textGain,
        runSeconds: runSeconds
      }
      electromagnetismw(params).then((res) => {
        console.log('电磁接口结果', res)
        if (res && res.code == 200) {
          ElMessage.success(res.data)
          emitter.emit('closeCreatePlan', false)
        } else {
          ElMessage.error('网络错误！')
        }
      })
      break
    default:
      break
  }
}
// 关闭
const closePanel = () => {
  emitter.emit('closeCreatePlan', false)
}

onMounted(() => {})
</script>
<style lang="less" scoped>
.environment_plan {
  .seleteEnvir {
    padding-top: 10px;
    text-align: left;
    .el-select {
      width: 100%;
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
    }
    :deep(.el-select__placeholder) {
      color: #fff;
    }
    :deep(.el-form-item__label) {
      color: #fff !important;
    }
  }
  .envir_content {
    box-sizing: border-box;
    text-align: left;
    height: 450px;
    overflow: auto;
    padding-right: 20px;
    .envir_config {
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
      .time-box {
        display: flex;
        flex-direction: column;
        padding-left: 20%;
        :deep(.el-checkbox) {
          color: #fff !important;
        }
      }
    }
  }
  .envir_footer {
    padding: 0px 20px 20px;
    display: flex;
    justify-content: flex-end;
    .el-button {
      background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
      width: 80px;
      height: 30px;
      color: #ffff;
      border-radius: 5px;
      margin-left: 10px;
      cursor: pointer;
    }
    .el-button:disabled {
      color: #cccccc;
      border: none;
      cursor: auto;
    }
    .concelBtn {
      background: #fff !important;
      color: black;
    }
  }
}
</style>
