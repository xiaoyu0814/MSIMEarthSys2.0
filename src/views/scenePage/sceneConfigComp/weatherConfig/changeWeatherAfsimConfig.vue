<template>
  <!-- 气象环境配置 -->
  <div class="chaWeaAfsimConfig-container">
    <div class="container-main">
      <div class="buttonTitle">导调配置</div>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="关闭面板"
        placement="top"
      >
        <img
          src="@/assets/image/panelIcons/关闭icon.png"
          alt=""
          class="close_sty"
          @click="handleClose"
        />
      </el-tooltip>
      <div class="tabContainer">
        <el-form
          ref="ruleFormRef"
          :model="state.formData"
          :rules="state.rules"
          label-width="136px"
        >
          <div class="block_content">
            <div class="block_title">地理导调</div>
            <div class="block_msg">
              <el-form-item label="陆地覆盖" prop="landCover">
                <el-select
                  v-model="state.formData.landCover"
                  class="scene_input"
                  placeholder="请选择"
                  size="small"
                  clearable
                >
                  <el-option
                    v-for="item in state.landCoverList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
              <el-form-item label="地形" prop="landFormation">
                <el-select
                  v-model="state.formData.landFormation"
                  class="scene_input"
                  placeholder="请选择"
                  size="small"
                  clearable
                >
                  <el-option
                    v-for="item in state.landFormationList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
          </div>
          <div class="block_content">
            <div class="block_title">气象环境导调</div>
            <div class="block_msg">
              <el-form-item label="降雨量" prop="rainRate">
                <el-select
                  v-model="state.formData.rainRate"
                  class="scene_input"
                  placeholder="请选择"
                  size="small"
                  clearable
                >
                  <el-option
                    v-for="item in state.rainRateList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
                <!-- <el-input-number
                v-model="state.formData.rainRate"
                :precision="6"
                :min="0"
                :max="300"
              /> -->
              </el-form-item>
              <el-form-item label="云水含量(kg/m^3)" prop="cloudWaterDensity">
                <el-input-number
                  v-model="state.formData.cloudWaterDensity"
                  :min="0"
                  :max="300"
                />
              </el-form-item>
              <el-form-item label="云底高(m)" prop="rainAltitudeLimit">
                <el-input-number
                  v-model="state.formData.rainAltitudeLimit"
                  :min="0"
                  :max="100000"
                />
              </el-form-item>
              <el-form-item label="海况等级" prop="seaState">
                <el-select
                  v-model="state.formData.seaState"
                  class="scene_input"
                  placeholder="请选择"
                  size="small"
                  clearable
                >
                  <el-option
                    v-for="item in state.seaStateList"
                    :key="item.value"
                    :label="item.name"
                    :value="item.value"
                  />
                </el-select>
              </el-form-item>
            </div>
          </div>
        </el-form>
        <div class="select_btn">
          <el-button type="primary" size="small" @click="resetForm"
            >重置</el-button
          >
          <el-button
            type="primary"
            size="small"
            @click="confirmScene(ruleFormRef)"
            >确定</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  reactive,
  onMounted,
  defineProps,
  nextTick,
  watch,
  ref,
  unref
} from 'vue'
import emitter from '@/utils/eventbus'
import store from '@/store/index'
import {
  changeWeatherAfsim,
  resetWeatherAfsim
} from '@/service/directingAdjusting'
import { ElMessage } from 'element-plus'
const state = reactive({
  landCoverList: [
    {
      name: '普通',
      value: '0',
      en: 'general'
    },
    {
      name: '城市',
      value: '1',
      en: 'urban'
    },
    {
      name: '农业',
      value: '2',
      en: 'agricultural'
    },
    {
      name: '草地牧场',
      value: '3',
      en: 'rangeland_herbaceous'
    },
    {
      name: '灌木牧场',
      value: '4',
      en: 'rangeland_shrub'
    },
    {
      name: '落叶林',
      value: '5',
      en: 'forest_deciduous'
    },
    {
      name: '针叶林',
      value: '6',
      en: 'forest_coniferous'
    },
    {
      name: '混合森林',
      value: '7',
      en: 'forest_mixed'
    },
    {
      name: '森林完全砍伐',
      value: '8',
      en: 'forest_clear_cut'
    },
    {
      name: '森林局部砍伐',
      value: '9',
      en: 'forest_block_cut'
    },
    {
      name: '森林湿地',
      value: '10',
      en: 'forest_coniferous'
    },
    {
      name: '非森林湿地',
      value: '11',
      en: 'wetland_non_forested'
    }
  ],
  landFormationList: [
    {
      name: '平地',
      value: '1',
      en: 'level'
    },
    {
      name: '倾斜',
      value: '2',
      en: 'inclined'
    },
    {
      name: '起伏',
      value: '3',
      en: 'undulating'
    },
    {
      name: '山丘',
      value: '4',
      en: 'rolling'
    },
    {
      name: '丘陵',
      value: '5',
      en: 'hummocky'
    },
    {
      name: '脊状凸起',
      value: '6',
      en: 'ridged'
    },
    {
      name: '陡峭',
      value: '7',
      en: 'moderately_steep'
    },
    {
      name: '陡峭的山脉',
      value: '8',
      en: 'steep'
    },
    {
      name: '不规则、崎岖和多变的地势',
      value: '9',
      en: 'broken'
    }
  ],
  seaStateList: [
    {
      name: '0级',
      value: '0'
    },
    {
      name: '1级',
      value: '1'
    },
    {
      name: '2级',
      value: '2'
    },
    {
      name: '3级',
      value: '3'
    },
    {
      name: '4级',
      value: '4'
    },
    {
      name: '5级',
      value: '5'
    },
    {
      name: '6级',
      value: '6'
    }
  ],
  rainRateList: [
    {
      name: '晴天',
      value: '0'
    },
    {
      name: '小雨',
      value: '0.15'
    },
    {
      name: '中雨',
      value: '0.27'
    },
    {
      name: '大雨',
      value: '0.55'
    },
    {
      name: '暴雨',
      value: '1.1'
    },
    {
      name: '大暴雨',
      value: '2'
    },
    {
      name: '特大暴雨',
      value: '2.2'
    }
  ],
  formData: {
    landCover: '0',
    landFormation: '6',
    seaState: '3',
    rainRate: '2.2', //0.000027
    cloudWaterDensity: '0.05',
    rainAltitudeLimit: '15000'
  },
  rules: {
    landCover: [
      {
        required: true,
        message: '请选择陆地覆盖',
        trigger: 'change'
      }
    ],
    landFormation: [
      {
        required: true,
        message: '请选择地形',
        trigger: 'change'
      }
    ],
    seaState: [
      {
        required: true,
        message: '请选择海况等级',
        trigger: 'change'
      }
    ],
    rainRate: [
      {
        required: true,
        message: '请选择降雨量',
        trigger: 'change'
      },
      { required: true, message: '请输入降雨量', trigger: 'blur' }
    ],
    cloudWaterDensity: [
      { required: true, message: '请输入云雨密度', trigger: 'blur' }
    ],
    rainAltitudeLimit: [
      { required: true, message: '请输入降雨高度限制', trigger: 'blur' }
    ]
  }
})
const ruleFormRef = ref(null)

const handleClose = () => {
  emitter.emit('closeChanWeatAfsimConfig')
}
const resetForm = () => {
  const form = unref(ruleFormRef)
  form.resetFields()
  // 导调白方复位气象环境
  resetWeatherAfsim().then((res) => {
    if (res && res.code == 200) {
      let sendToCommandData = JSON.parse(res.data)
      if (sendToCommandData['IsSendToCommand'] == 'true') {
        if (
          sendToCommandData.data &&
          Object.keys(sendToCommandData.data).length > 0
        ) {
          let controlResData = JSON.parse(sendToCommandData.data)
          if (controlResData.status == 'successes') {
            ElMessage.success('复位气象环境成功')
          } else {
            ElMessage.error('复位气象环境失败: ' + controlResData['reason'])
          }
        } else {
          ElMessage.error('复位气象环境失败!')
        }
      }
    }
  })
}

const confirmScene = async (formEl) => {
  await formEl.validate((valid, fields) => {
    if (valid) {
      let param = {
        landCover: state.formData.landCover,
        landFormation: state.formData.landFormation,
        seaState: state.formData.seaState,
        rainRate: state.formData.rainRate,
        cloudWaterDensity: state.formData.cloudWaterDensity,
        rainAltitudeLimit: state.formData.rainAltitudeLimit
      }
      changeWeatherAfsim(param).then((res) => {
        if (res && res.code == 200) {
          if (res.data) {
            let resData = JSON.parse(res.data)
            if (resData['IsSendToCommand'] === 'false') {
              ElMessage.error('sfSim未开启!')
            } else {
              let succData = JSON.parse(resData['data'])
              if (succData && Object.keys(succData).length > 0) {
                if (succData.status == 'successes') {
                  ElMessage.success('气象环境导调成功!')
                  handleClose()
                }
              }
            }
          } else {
            ElMessage.error('sfSim未开启!')
          }
        }
      })
    }
  })
}

onMounted(() => {})
</script>

<style lang="less" scoped>
.chaWeaAfsimConfig-container {
  position: absolute;
  left: calc(66%);
  top: 39%;
  width: 356px;
  // height: 250px;
  // background: url('@/assets/image/voiceInteraction/zjDiv.png');
  // background-size: 100% 100%;
  // padding: 40px 20px;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 100;

  .container-main {
    padding: 15px;
    height: 97%;
    width: 100%;
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;
    display: flex;
    flex-direction: column;

    .buttonTitle {
      width: 100%;
      text-align: left;
      font-size: 20px;
      font-weight: 500;
      color: #00c7fb;
      display: flex;
      align-items: center;

      &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 20px;
        margin-right: 5px;
        background: #1092d5;
      }
    }
    .close_sty {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }
    .tabContainer {
      padding: 10px;

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
    }
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

    .select_btn {
      display: flex;
      justify-content: flex-end;
      .el-button {
        background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
        width: 50px;
        height: 25px;
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
    }

    :deep(.el-radio) {
      color: white;
      margin: 10px 0;
    }
  }
}

.block_content {
  position: relative;
  // width: 100%;
  padding: 24px 10px 0 10px;
  border: 1px solid #056199;
  box-sizing: border-box;
  margin: 16px;

  .block_title {
    position: absolute;
    top: -12px;
    left: 10px;
    font-size: 18px;
    padding: 0 10px;
    color: #ffffff;
    background: #12415f;
  }

  .block_msg {
    padding: 0 0px 0 5px;
    text-align: center;
    color: #ffffff;

    .content_info {
      padding: 5px 0;
      display: flex;
      align-items: center;

      .content_info_title {
        width: 190px;
        text-align: left;
        font-size: 15px;
      }
    }
  }
}
</style>
