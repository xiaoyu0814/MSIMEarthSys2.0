<template>
  <div class="tabContainer">
    <div class="inputOption">
      <el-form
        ref="ruleFormRef"
        :model="state.formData"
        :rules="state.rules"
        label-width="90px"
      >
        <el-form-item label="兵力列表" prop="targetName">
          <el-select
            v-model="state.formData.targetName"
            class="scene_input"
            placeholder="请选择"
            size="small"
            @change="handleCheckChange"
            clearable
          >
            <el-option
              v-for="item in state.sideTargetList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="兵力阵营" prop="side">
          <el-select
            v-model="state.formData.side"
            class="scene_input"
            placeholder="请选择"
            size="small"
            clearable
          >
            <el-option label="红方" value="red" />
            <el-option label="蓝方" value="blue" />
          </el-select>
        </el-form-item>

        <el-form-item label="经度" prop="longitude">
          <el-input
            v-model="state.formData.longitude"
            style="width: 193px"
          ></el-input>
          <el-button
            type="primary"
            style="margin-left: 5px"
            size="small"
            @click="getCurLngLat"
            >拾取</el-button
          >
        </el-form-item>
        <el-form-item label="纬度" prop="latitude">
          <el-input
            v-model="state.formData.latitude"
            style="width: 193px"
          ></el-input>
          <el-button
            type="primary"
            style="margin-left: 5px"
            size="small"
            @click="getCurLngLat"
            >拾取</el-button
          >
        </el-form-item>
        <el-form-item label="高度" prop="height">
          <el-input v-model="state.formData.height"></el-input>
        </el-form-item>
        <!-- <el-form-item label="航向角" prop="headingAngle">
          <el-input-number
            v-model="state.formData.headingAngle"
            :min="-180"
            :max="180"
          />
        </el-form-item>
        <el-form-item label="速度(km/s)" prop="speed">
          <el-input v-model="state.formData.speed"></el-input>
        </el-form-item> -->
        <!-- <el-form-item label="载弹">
              <el-select
                v-model="state.formData.ammunitionCarrier"
                class="scene_input"
                placeholder="请选择"
                size="small"
                clearable
              >
                <el-option
                  label="PL-15中距离空空导弹"
                  value="PL-15中距离空空导弹"
                />
                <el-option
                  label="PL-10近距离格斗导弹"
                  value="PL-10近距离格斗导弹"
                />
              </el-select>
            </el-form-item>
            <el-form-item label="机载雷达">
              <el-select
                v-model="state.formData.airborneRadar"
                class="scene_input"
                placeholder="请选择"
                size="small"
                clearable
              >
                <el-option label="AESA相控阵雷达" value="AESA相控阵雷达" />
                <el-option label="有源相控阵雷达" value="有源相控阵雷达" />
              </el-select>
            </el-form-item> -->
        <!-- <el-form-item label="油量(吨)" prop="OilQuantity">
          <el-input-number
            v-model="state.formData.OilQuantity"
            :min="1"
            :max="10"
          />
        </el-form-item> -->
        <!-- <el-form-item label="">
          <div class="form_staticParameters">
            <div v-for="item in state.formData.staticParameters" :key="item">
              {{ item }}
            </div>
          </div>
        </el-form-item> -->
      </el-form>
    </div>
    <div class="select_btn">
      <el-button type="primary" size="small" @click="resetForm">重置</el-button>
      <el-button type="primary" size="small" @click="confirmScene(ruleFormRef)"
        >确定</el-button
      >
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
  createRedItem,
  createBlueItem,
  getSimTypeList,
  createItem
} from '@/service/directingAdjusting'
import { removeJtPaBaifangEntity, flyToEntity } from '@/utils/mapTools'
import { showMouseCurLngLat } from '@/views/toolbar/layerList/hooks/simModelGuideCommand' //模拟器相关导调指令
const state = reactive({
  sideTargetList: [
    {
      name: 'J-16-1',
      value: 'J-16-1',
      side: '',
      type: 'FIGHTER_JET',
      position: {
        x: 125.38798101038,
        y: 45.284830579520175,
        z: 3000
      }
    },
    {
      name: 'J-16-2',
      value: 'J-16-2',
      side: '',
      type: 'FIGHTER_JET',
      position: {
        x: 125.08295507024978,
        y: 45.36413732395401,
        z: 3000
      }
    }
  ],
  formData: {
    type: '',
    side: '',
    targetName: '',
    longitude: '121.412322',
    latitude: '23.978216',
    height: '3920.153176',
    headingAngle: '0',
    speed: '0.3', //0.5
    ammunitionCarrier: '',
    airborneRadar: '',
    OilQuantity: 1,
    staticParameters: [
      '机身长21.2米，高4.69米，翼展13.01米',
      '最大飞行速度2.0马赫',
      '最大起飞重量约37吨',
      '最大航程约4000公里',
      '最大作战半径约1500公里'
    ]
  },
  rules: {
    side: [
      {
        required: true,
        message: '请选择阵营',
        trigger: 'change'
      }
    ],
    targetName: [
      {
        required: true,
        message: '请选择目标名称',
        trigger: 'change'
      }
    ],
    longitude: [{ required: true, message: '请输入经度', trigger: 'blur' }],
    latitude: [{ required: true, message: '请输入纬度', trigger: 'blur' }],
    height: [{ required: true, message: '请输入高度', trigger: 'blur' }],
    headingAngle: [
      { required: true, message: '请输入航向角', trigger: 'blur' }
    ],
    speed: [{ required: true, message: '请输入速度', trigger: 'blur' }],
    OilQuantity: [{ required: true, message: '请输入油量', trigger: 'blur' }]
  }
})
const ruleFormRef = ref(null)

const handleClose = () => {
  emitter.emit('closeTargentConfig')
}
const handleCheckChange = (val) => {
  if (val) {
    let selectTarget = state.sideTargetList.find((item) => item.value == val)
    if (selectTarget) {
      state.formData.targetName = selectTarget.name
      state.formData.type = selectTarget.type
      state.formData.longitude = selectTarget.position.x
      state.formData.latitude = selectTarget.position.y
      state.formData.height = selectTarget.position.z
    }
  }
}
const resetForm = () => {
  const form = unref(ruleFormRef)
  form.resetFields()
}

const confirmScene = async (formEl) => {
  await formEl.validate((valid, fields) => {
    if (valid) {
      state.formData.speed = state.formData.speed > 2 ? 2 : state.formData.speed
      let speed =
        Number(state.formData.speed) < 1
          ? Number(state.formData.speed) * 1000
          : Number(state.formData.speed) * 500
      let param = {
        alt: Number(state.formData.height),
        heading: Number(state.formData.headingAngle),
        lat: Number(state.formData.latitude),
        lon: Number(state.formData.longitude),
        name: state.formData.targetName,
        side: state.formData.side,
        speed: Number(speed),
        type: state.formData.type // 暂时写死 RUAV 'RAUAV'
      }
      createItem(param).then((res) => {
        if (res && res.code == 200) {
          ElMessage.success(res.data)
          removeJtPaBaifangEntity(state.formData.targetName)
          emitter.emit('closeBottomControlPanel', 'three') //关闭导调面板
          handleClose()
          // 重新加载兵力树
          setTimeout(() => {
            let rgbArr = []
            if (state.formData.side == 'red') {
              rgbArr = [225, 82, 88]
            } else {
              rgbArr = [57, 173, 209]
            }
            flyToEntity({
              name: state.formData.targetName,
              id: state.formData.targetName,
              rgb: rgbArr,
              fontColorRgb: store.getters.getBubbleFontColor
            })
            emitter.emit('reLoadGetLeftForceResult')
          }, 5000)
        }
      })
    }
  })
}

// 拾取
const getCurLngLat = () => {
  showMouseCurLngLat((position) => {
    state.formData.latitude = position.lat //集合纬度
    state.formData.longitude = position.lng //集合经度
  })
}

onMounted(() => {
  nextTick(() => {})
})
</script>

<style lang="less" scoped>
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

.tabContainer {
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
  .fromItemLabel {
    color: #fff;
    cursor: pointer;
    margin-left: -50px !important;
  }
  .form_staticParameters {
    color: white;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
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

:deep(.el-form-item) {
  margin-bottom: 10px;
}
</style>
