<!-- 海况导调面板 -->
<template>
  <div class="formContainer">
    <div class="inputOption">
      <el-form :model="state.formData" label-width="70px">
        <el-form-item label="海况">
          <el-select
            v-model="state.formData.seaState"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in state.stateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item>
      </el-form>
    </div>
    <div class="select_btn">
      <el-button type="primary" size="small" @click="confirmScene"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch, defineProps } from 'vue'
import emitter from '@/utils/eventbus'
import store from '@/store/index'
import { directDataWeather } from '@/service/simModelCommand'
import { ElMessage } from 'element-plus'
import { showCommandSysMessage, worldPosToGraphic } from '@/utils/mapTools'
const props = defineProps({
  formDataObj: {
    type: Object,
    default: {}
  }
})
const state = reactive({
  curSelect: '',
  formData: {
    command: props.formDataObj.command
  },
  stateList: [
    {
      label: '0级',
      value: '0'
    },
    {
      label: '1级',
      value: '1'
    },
    {
      label: '2级',
      value: '2'
    },
    {
      label: '3级',
      value: '3'
    },
    {
      label: '4级',
      value: '4'
    },
    {
      label: '5级',
      value: '5'
    },
    {
      label: '6级',
      value: '6'
    }
  ]
})
const confirmScene = () => {
  // let params = {
  //   btDay: 0,
  //   btMonth: 0,
  //   btMoonlight: 0,
  //   btYear: 0,
  //   bweatherFlag: 0,
  //   fdaytime: 0,
  //   fwindSpeed: 0,
  //   lvisibility: 0,
  //   name: '',
  //   side: '',
  //   typesCloud: 0,
  //   typesRain: 0,
  //   typesSnow: 0,
  //   wbottomCloud: 0,
  //   winCloud: 0,
  //   woutCloud: 0,
  //   wtopCloud: 0,
  //   wtype: '',
  //   wwindDirection: 0
  // }
  // directDataWeather(params).then((res) => {
  //   if (res.code == 200) {
  //     beautyToast.success({
  //       title: '导调指令',
  //       message: '天气指令导调成功!',
  //       darkTheme: true
  //     })
  //     emitter.emit('closePanel', '') //关闭弹框
  //   } else {
  //     beautyToast.success({
  //       title: '导调指令',
  //       message: '天气指令导调失败!',
  //       darkTheme: true
  //     })
  //   }
  // })
  emitter.emit('closePanel', '') //关闭弹框
}
onMounted(() => {})
</script>

<style lang="less" scoped>
.formContainer {
  .scene_input {
    // margin-top: 25px;
    border: none !important;

    :deep(.el-input__inner) {
      font-size: 18px;
      font-weight: 500;
      color: #06d6f9;
      border: none !important;
      text-align: center;
    }

    :deep(.el-input__wrapper) {
      background-color: #172e51 !important;
      box-shadow: 0 0 25px #1092d5;
    }

    :deep(.el-input) {
      --el-input-border-color: #e5e5e500 !important;
      --el-input-hover-border: transparent !important;
      --el-input-focus-border: transparent !important;
      --el-input-placeholder-color: #06d6f9;
    }

    :deep(.el-select) {
      --el-select-border-color-hover: transparent !important;
      --el-select-input-focus-border-color: transparent !important;
    }

    :deep(.el-input__wrapper:hover) {
      border: none !important;
      box-shadow: none;
    }
  }

  :deep(.el-tabs--border-card > .el-tabs__content) {
    padding: 0;
    height: calc(100% - 39px);

    .el-tab-pane {
      height: 100%;
    }
  }

  :deep(.el-tabs--border-card) {
    background: rgba(0, 0, 0, 0);
    border: none;
    height: calc(100% - 48px);
  }

  :deep(.el-tabs--border-card > .el-tabs__header) {
    background: rgba(0, 0, 0, 0);
  }

  :deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active) {
    background-color: #1092d5;
    border: none;
  }

  :deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item) {
    color: white;
  }

  :deep(.el-tabs__item:focus-visible) {
    box-shadow: none;
  }

  :deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item) {
    border: none;
  }
}

.select_btn {
  display: flex;
  justify-content: flex-end;
}

:deep(.el-radio) {
  color: white;
  margin: 0 10px;
}

:deep .el-radio__inner {
  background-color: rgba(17, 181, 236, 0.5);
  border: 1px solid #11b5ec;
}

.chspeed {
  :deep .el-input-number {
    width: 130px !important;
  }

  .chSpeed_dw {
    color: #fff;
    position: relative;
    display: inline-flex;
    width: 30px;
  }
}

// :deep .el-radio {
//   color: #11b5ec;
// }

.scene_input {
  // margin-top: 25px;
  border: none !important;

  :deep(.el-input__inner) {
    font-size: 18px;
    font-weight: 500;
    color: #06d6f9;
    border: none !important;
    text-align: center;
  }

  :deep(.el-input__wrapper) {
    background-color: #172e51 !important;
    box-shadow: 0 0 25px #1092d5;
  }

  :deep(.el-input) {
    --el-input-border-color: #e5e5e500 !important;
    --el-input-hover-border: transparent !important;
    --el-input-focus-border: transparent !important;
    --el-input-placeholder-color: #06d6f9;
  }

  :deep(.el-select) {
    --el-select-border-color-hover: transparent !important;
    --el-select-input-focus-border-color: transparent !important;
  }

  :deep(.el-input__wrapper:hover) {
    border: none !important;
    box-shadow: none;
  }
}

.formContainer {
  padding: 10px;
}

.inputOption {
  :deep(.el-form-item__label) {
    color: white;
  }

  :deep .el-input__wrapper {
    background: rgba(32, 97, 121, 0.45);
    border: 1px solid rgba(100, 199, 213, 1);
    border-radius: 4px;

    .el-input__inner {
      color: white;
    }
  }

  .form_staticParameters {
    color: white;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

:deep(.el-form-item) {
  margin-bottom: 10px;
}

:deep(.el-form-item__content) {
  margin-left: 0 !important;
}
</style>
