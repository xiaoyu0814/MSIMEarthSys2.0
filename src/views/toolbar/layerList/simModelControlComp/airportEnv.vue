<!-- 机场天气导调面板 -->
<template>
  <div class="formContainer">
    <div class="inputOption">
      <el-form :model="state.formData" label-width="88px">
        <el-form-item label="平台名称">
          <el-input v-model="state.formData.targetName" disabled></el-input>
        </el-form-item>
        <el-form-item label="阵营">
          <el-select
            v-model="state.formData.side"
            class="scene_input"
            placeholder="请选择"
            size="small"
            clearable
          >
            <el-option
              v-for="item in state.sideLists"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="时间状况">
          <el-select
            v-model="state.formData.weatherState"
            class="scene_input"
            placeholder="请选择"
            size="small"
            clearable
          >
            <el-option
              v-for="item in state.weatherStateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="天气类型">
          <el-select
            @change="selectChange"
            v-model="state.formData.WeatherEnum"
            class="scene_input"
            placeholder="请选择"
            size="small"
            clearable
          >
            <el-option
              v-for="item in state.stateList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="雨级别" v-if="state.formData.WeatherEnum == 2">
          <el-select
            v-model="state.formData.typesRain"
            class="scene_input"
            placeholder="请选择"
            size="small"
            clearable
          >
            <el-option
              v-for="item in state.typesRainList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="雪级别" v-if="state.formData.WeatherEnum == 3">
          <el-select
            v-model="state.formData.typesSnow"
            class="scene_input"
            placeholder="请选择"
            size="small"
            clearable
          >
            <el-option
              v-for="item in state.typesSnowList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="云级别">
          <el-select
            v-model="state.formData.typesCloud"
            class="scene_input"
            placeholder="请选择"
            size="small"
            clearable
          >
            <el-option
              v-for="item in state.typesCloudList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="能见度" class="chspeed">
          <el-input-number
            v-model="state.formData.visible"
            :min="100"
            :max="800000"
            size="small"
          /><span class="colorWhite">m</span>
          <!-- <el-select
            v-model="state.formData.visible"
            class="scene_input"
            placeholder="请选择"
            size="small"
            clearable
          >
            <el-option
              v-for="item in state.visibleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select> -->
        </el-form-item>

        <!-- 风向 <el-select
            v-model="state.formData.angle"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in state.angleList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select> -->
        <!-- <el-form-item label="风向:">
          <el-input-number
            v-model="state.formData.angle"
            :min="0"
            :max="360"
            size="small"
            controls-position="right"
          />
        </el-form-item>
        <el-form-item label="风速:">
          <el-input-number
            v-model="state.formData.speed"
            :min="0"
            :max="359"
            size="small"
            controls-position="right"
          /><span class="colorWhite">m/s</span>
        </el-form-item> -->
        <!-- <el-form-item label="云量:">
          <el-select
            v-model="state.formData.cloud"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in state.cloudLevel"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            >
            </el-option>
          </el-select>
        </el-form-item> -->
        <el-form-item label="云底高:" class="chspeed">
          <el-input-number
            v-model="state.formData.wbottomCloud"
            :min="1000"
            :max="10000"
            size="small"
          /><span class="colorWhite">m</span>
        </el-form-item>
        <el-form-item label="云顶高:" class="chspeed">
          <el-input-number
            v-model="state.formData.wtopCloud"
            :min="1000"
            :max="10000"
            size="small"
          /><span class="colorWhite">m</span>
        </el-form-item>
        <!-- <el-form-item label="云淡入距离:">
          <el-input-number
            v-model="state.formData.winCloud"
            :min="0"
            :max="30000"
            size="small"
            controls-position="right"
          /><span class="colorWhite">m</span>
        </el-form-item>
        <el-form-item label="云淡出距离:">
          <el-input-number
            v-model="state.formData.woutCloud"
            :min="0"
            :max="30000"
            size="small"
            controls-position="right"
          /><span class="colorWhite">m</span>
        </el-form-item> -->
        <el-form-item label="时间:" class="chspeed">
          <el-date-picker
            class="airPlaneTime"
            v-model="state.formData.stateTime"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            placeholder="选择时间"
          />
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
import { changeWeather } from '@/service/directingAdjusting'
const props = defineProps({
  formDataObj: {
    type: Object,
    default: {}
  }
})
const state = reactive({
  curSelect: '',
  formData: {
    command: props.formDataObj.command,
    WeatherEnum: props.formDataObj.WeatherEnum,
    visible: props.formDataObj.visible, //能见度
    angle: props.formDataObj.angle, //风向
    speed: props.formDataObj.speed, //速度
    cloud: props.formDataObj.cloud,
    wbottomCloud: props.formDataObj.wbottomCloud,
    wtopCloud: props.formDataObj.wtopCloud,
    weatherState: props.formDataObj.weatherState,
    targetName: props.formDataObj.targetName,
    typesRain: props.formDataObj.typesRain,
    typesSnow: props.formDataObj.typesSnow,
    typesCloud: props.formDataObj.typesCloud,
    winCloud: props.formDataObj.winCloud,
    woutCloud: props.formDataObj.woutCloud,
    wtype: props.formDataObj.wtype,
    side: props.formDataObj.side,
    stateTime: props.formDataObj.stateTime
  },
  weatherStateList: [
    { label: '凌晨', value: '0' },
    { label: '黎明', value: '1' },
    { label: '拂晓', value: '2' },
    { label: '清晨', value: '3' },
    { label: '早晨', value: '4' },
    { label: '上午', value: '5' },
    { label: '中午', value: '6' },
    { label: '下午', value: '7' },
    { label: '晚上', value: '8' },
    { label: '傍晚', value: '9' },
    { label: '黄昏', value: '10' },
    { label: '午夜', value: '11' },
    { label: '夜间', value: '12' },
    { label: '傍晚', value: '13' }
  ],
  stateList: [
    {
      label: '晴天',
      value: 0
    },
    // {
    //   label: '阴天',
    //   value: 1
    // },
    {
      label: '雨',
      value: 2
    },
    {
      label: '雪',
      value: 3
    }
    // {
    //   label: '多云',
    //   value: '1'
    // },
    // {
    //   label: '雾',
    //   value: '2'
    // },
    // {
    //   label: '浓积云',
    //   value: '3'
    // },
    // {
    //   label: '部分多云',
    //   value: '4'
    // },
    // {
    //   label: '大雨',
    //   value: '5'
    // },
    // {
    //   label: '小雨',
    //   value: '6'
    // },
    // {
    //   label: '雷阵雨',
    //   value: '7'
    // },
    // {
    //   label: '沙尘',
    //   value: '8'
    // },
    // {
    //   label: '沙尘暴',
    //   value: '9'
    // },
    // {
    //   label: '雪',
    //   value: '10'
    // },
    // {
    //   label: '暴雪',
    //   value: '11'
    // },
    // {
    //   label: '小雪',
    //   value: '12'
    // }
  ],
  visibleList: [
    {
      label: '<100m',
      value: 100
    },
    {
      label: '<200m',
      value: 200
    },
    {
      label: '<500m',
      value: 500
    },
    {
      label: '<1km',
      value: 1000
    },
    {
      label: '<2km',
      value: 2000
    },
    {
      label: '<3km',
      value: 3000
    },
    {
      label: '<4km',
      value: 4000
    },
    {
      label: '<5km',
      value: 5000
    },
    {
      label: '>5km',
      value: 6000
    }
  ],
  angleList: [
    {
      label: '北风',
      value: 0
    },
    {
      label: '东北偏北风',
      value: 22.5
    },
    {
      label: '东北风',
      value: 45
    },
    {
      label: '东北偏东风',
      value: 67.5
    },
    {
      label: '东风',
      value: 90
    },
    {
      label: '东南偏东风',
      value: 112.5
    },
    {
      label: '东南风',
      value: 135
    },
    {
      label: '东南偏南风',
      value: 157.5
    },
    {
      label: '南风',
      value: 180
    },
    {
      label: '西南偏南风',
      value: 202.5
    },
    {
      label: '西南风',
      value: 225
    },
    {
      label: '西南偏西风',
      value: 247.5
    },
    {
      label: '西风',
      value: 270
    },
    {
      label: '西北偏西风',
      value: 292.5
    },
    {
      label: '西北风',
      value: 315
    },
    {
      label: '西北偏北风',
      value: 337.5
    }
  ],
  cloudLevel: [
    {
      label: '0成',
      value: 0
    },
    {
      label: '1成',
      value: 1
    },
    {
      label: '2成',
      value: 2
    },
    {
      label: '3成',
      value: 3
    },
    {
      label: '4成',
      value: 4
    },
    {
      label: '5成',
      value: 5
    },
    {
      label: '6成',
      value: 6
    },
    {
      label: '7成',
      value: 7
    },
    {
      label: '8成',
      value: 8
    },
    {
      label: '9成',
      value: 9
    },
    {
      label: '10成',
      value: 10
    }
  ],
  sideLists: [
    { value: 'red', name: '红方' },
    { value: 'blue', name: '蓝方' },
    { value: 'green', name: '绿方' }
  ],
  typesRainList: [
    { label: '小雨', value: 0 },
    { label: '雷阵雨', value: 1 },
    { label: '中雨', value: 2 },
    { label: '大雨', value: 3 },
    { label: '暴雨', value: 4 }
  ],
  typesSnowList: [
    { label: '小雪', value: 0 },
    { label: '中雪', value: 1 },
    { label: '大雪', value: 2 }
  ],
  typesCloudList: [
    { label: '无云', value: 0 },
    { label: '片云', value: 1 },
    { label: '层云', value: 2 }
  ]
})
const confirmScene = () => {
  // 仿真时间
  let btYear = 0,
    btMonth = 0,
    btDay = 0,
    fdaytime = 0
  if (store.state.sceneModule.msgMessionTime) {
    var now = new Date(store.state.sceneModule.msgMessionTime)
    btYear = now.getFullYear() // 获取完整的年份(4 位, 1970-???)
    btMonth = now.getMonth() + 1 // 获取当前月份(0-11,0 代表 1 月)
    btDay = now.getDate() // 获取当前日(1-31)
    var hour = Number(now.getHours()) * 3600 //获取小时
    var minute = Number(now.getMinutes()) * 60 //获取分钟
    var second = now.getSeconds() //获取秒
    fdaytime = Math.round((hour + minute + second) / 3600)
  }
  if (!state.formData.stateTime) {
    ElMessage.warning('请选择时间!')
    return
  }
  let params = {
    // btDay: btDay,
    // btMonth: btMonth,
    btMoonlight: 0, // 无月夜--0,有月夜---1
    // btYear: btYear,
    bweatherFlag: state.formData.WeatherEnum, //天气类型
    // fdaytime: fdaytime,
    fwindSpeed: state.formData.speed, //风速
    lvisibility: state.formData.visible, //能见度
    name: state.formData.targetName, //实体名称
    side: state.formData.side, //阵营
    typesCloud: Number(state.formData.typesCloud),
    typesRain: Number(state.formData.typesRain),
    typesSnow: Number(state.formData.typesSnow),
    wbottomCloud: state.formData.wbottomCloud, //云底高
    winCloud: state.formData.winCloud, //云淡入距离
    woutCloud: state.formData.woutCloud, //云淡出距离
    wtopCloud: state.formData.wtopCloud, //云顶高
    wtype: state.formData.wtype,
    wwindDirection: state.formData.angle, //风向
    stateTime: state.formData.stateTime //时间，后台进行拆解
    // weatherState:state.formData.weatherState
  }
  directDataWeather(params).then((res) => {
    if (res.code == 200) {
      showCommandSysMessage(
        state.formData.targetName,
        '天气指令导调完成!',
        store.getters.getSucceStateInfoOutColor
      )
      ElMessage({
        type: 'success',
        message: '天气指令导调成功'
      })
      emitter.emit('closePanel', '') //关闭弹框
      changeUEWeather()
    } else {
      ElMessage({
        type: 'error',
        message: '天气指令导调失败'
      })
    }
  })
}
onMounted(() => {
  //jiao10
  if (state.formData.targetName == '<dis>2:3:10') {
    state.formData.wtopCloud = 3658 //云顶高
    state.formData.wbottomCloud = 3048 //云底高
    state.formData.visible = 400000 //晴天能见度
  }
})
const selectChange = (value) => {
  switch (value) {
    case 0:
      state.formData.visible = 400000 //晴天能见度
      break
    case 1: //阴天
      break
    case 2:
    case 3:
      state.formData.visible = 5000 //雪天、雨天能见度
      break
    default:
      break
  }
}
//根据模拟器机场天气参数动态设置UE天气
const changeUEWeather = () => {
  let typeUe = 0 //默认晴天
  if (state.formData.WeatherEnum == 2) {
    //雨
    switch (state.formData.typesRain) {
      case 0: //小雨
        typeUe = 6
        break
      case 1: //雷阵雨
        typeUe = 7
        break
      case 2: //中雨
      case 3: //大雨
      case 4: //暴雨
        typeUe = 5
        break
    }
    //weatherTime:时间
    changeWeather({
      weatherCode: typeUe,
      weatherTime: state.formData.stateTime
    })
  } else if (state.formData.WeatherEnum == 3) {
    //雪
    switch (state.formData.typesSnow) {
      case 0: //小雪
        typeUe = 12
        break
      case 1: //中雪
        typeUe = 10
        break
      case 2: //大雪
        typeUe = 11
        break
    }
    changeWeather({
      weatherCode: typeUe,
      weatherTime: state.formData.stateTime
    })
  } else if (state.formData.WeatherEnum == 0) {
    //晴天
    changeWeather({
      weatherCode: typeUe,
      weatherTime: state.formData.stateTime
    })
  }
}
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
    width: 150px !important;
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

  :deep(.el-input__wrapper:hover) {
    border: none !important;
    box-shadow: none;
  }

  :deep(.el-select) {
    --el-select-border-color-hover: transparent !important;
    --el-select-input-focus-border-color: transparent !important;
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

.colorWhite {
  color: #fff;
}
</style>
