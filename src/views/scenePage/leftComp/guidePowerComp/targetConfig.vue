<template>
  <!-- 目标配置 -->
  <div class="target-container">
    <div class="container-main">
      <div class="buttonTitle">虚兵导调（无后备兵力）</div>
      <img
        src="@/assets/image/panelIcons/关闭icon.png"
        alt=""
        class="close_sty"
        @click="handleClose"
      />
      <div class="tabContainer">
        <div class="inputOption">
          <el-form
            ref="ruleFormRef"
            :model="state.formData"
            :rules="state.rules"
            label-width="90px"
          >
            <!-- <el-form-item label="模拟器" prop="simTypeName">
              <el-select
                v-model="state.formData.simTypeName"
                class="scene_input"
                placeholder="请选择"
                size="small"
                @change="handleChangeSimulator"
                clearable
              >
                <el-option
                  v-for="item in state.simList"
                  :key="item.simulatorTypeName"
                  :label="item.simulatorTypeName"
                  :value="item.id"
                />
              </el-select>
            </el-form-item> -->
            <el-form-item label="虚兵阵营" prop="side">
              <el-select
                v-model="state.formData.side"
                class="scene_input"
                placeholder="请选择"
                size="small"
                @change="handleChangeSide"
                clearable
              >
                <el-option label="红方" value="red" />
                <el-option label="蓝方" value="blue" />
              </el-select>
            </el-form-item>
            <el-form-item label="虚兵类型" prop="targetName">
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
              <!-- <el-input v-model="state.formData.targetName"></el-input> -->
            </el-form-item>
            <el-form-item label="经度" prop="longitude">
              <el-input v-model="state.formData.longitude"></el-input>
            </el-form-item>
            <el-form-item label="纬度" prop="latitude">
              <el-input v-model="state.formData.latitude"></el-input>
            </el-form-item>
            <el-form-item label="高度" prop="height">
              <el-input v-model="state.formData.height"></el-input>
            </el-form-item>
            <el-form-item label="航向角" prop="headingAngle">
              <el-input-number
                v-model="state.formData.headingAngle"
                :min="-180"
                :max="180"
              />
              <!-- <el-input v-model="state.formData.headingAngle"></el-input> -->
            </el-form-item>
            <el-form-item label="速度(km/s)" prop="speed">
              <el-input v-model="state.formData.speed"></el-input>
            </el-form-item>
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
            <el-form-item label="油量(吨)" prop="OilQuantity">
              <el-input-number
                v-model="state.formData.OilQuantity"
                :min="1"
                :max="10"
              />
            </el-form-item>
            <el-form-item label="">
              <div class="form_staticParameters">
                <div
                  v-for="item in state.formData.staticParameters"
                  :key="item"
                >
                  {{ item }}
                </div>
              </div>
            </el-form-item>
          </el-form>
        </div>
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
  createRedItem,
  createBlueItem,
  getSimList,
  getSimTypeList,
  createItem
} from '@/service/directingAdjusting'
const props = defineProps({
  treelistblue: {
    type: Array,
    default: []
  },
  treelistred: {
    type: Array,
    default: []
  }
})

const state = reactive({
  targetList: [
    {
      name: 'J-20',
      value: 'J-200',
      side: 'red',
      type: 'FIGHTER_JET'
    },
    {
      name: 'J-16',
      value: 'J-16',
      side: 'red',
      type: 'FIGHTER_JET'
    },
    {
      name: 'J-11',
      value: 'J-11',
      side: 'red',
      type: 'FIGHTER_JET'
    },
    {
      name: 'J-10',
      value: 'J-10',
      side: 'red',
      type: 'FIGHTER_JET'
    },
    {
      name: 'Y8-3',
      value: 'Y8-3',
      side: 'red',
      type: 'TRANSPORT_PLANE'
    },
    {
      name: 'F-22',
      value: 'F-22',
      side: 'blue',
      type: 'FIGHTER_JET'
    },
    {
      name: 'F-35',
      value: 'F-35',
      side: 'blue',
      type: 'FIGHTER_JET'
    }
  ],
  sideTargetList: [],
  formData: {
    side: '',
    targetName: '',
    targetName02: '',
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
    ],
    simTypeName: ''
  },
  rules: {
    side: [
      {
        required: true,
        message: '请选择阵营',
        trigger: 'change'
      }
    ],
    simTypeName: [
      {
        required: true,
        message: '请选择模拟器',
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
  },
  simList: [
    {
      simulatorTypeName: '模拟器1(哈飞院)',
      id: 1
    },
    {
      simulatorTypeName: '模拟器2(操纵杆)',
      id: 2
    }
  ],
  selectBlue: [],
  selectred: []
})
const ruleFormRef = ref(null)

const handleClose = () => {
  emitter.emit('closeTargentConfig')
}
const handleCheckChange = (val) => {
  console.log(val)
  state.sideTargetList.forEach((item) => {
    if (item.value == val) {
      console.log(item)
      state.formData.targetName02 = item.type
    }
  })
}
const handleChangeSide = (val) => {
  if (val) {
    state.sideTargetList = []
    state.formData.targetName = ''
    // 0907更改旧版本数据
    // if (val == 'red') {
    //   state.targetList.forEach((item) => {
    //     if (item.side == 'red') {
    //       state.sideTargetList.push(item)
    //     }
    //   })
    // } else {
    //   state.targetList.forEach((item) => {
    //     if (item.side == 'blue') {
    //       state.sideTargetList.push(item)
    //     }
    //   })
    // }
    //0907更改新版本
    if (val == 'red') {
      state.selectred.forEach((item) => {
        let obj = {
          name: item.Data.Type,
          value: item.Data.Name,
          side: item.Data.Side,
          type: item.Data.Type
        }
        console.log('item', obj)
        state.sideTargetList.push(obj)
      })
    } else {
      state.selectBlue.forEach((item) => {
        let obj = {
          name: item.Data.Type,
          value: item.Data.Name,
          side: item.Data.Side,
          type: item.Data.Type
        }
        state.sideTargetList.push(obj)
      })
    }
  }
}
const resetForm = () => {
  const form = unref(ruleFormRef)
  form.resetFields()
}

const confirmSceneOld = async (formEl) => {
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 选择的目标
      let selectTarget = state.targetList.find(
        (item) => item.value == state.formData.targetName
      )
      let param = {
        height: state.formData.height,
        itemName: state.formData.simTypeName,
        itemTypeCode: 'aircraft',
        lat: state.formData.latitude,
        lng: state.formData.longitude,
        entityID: state.formData.targetName //模拟器id名称
      }
      if (selectTarget.type == 'red') {
        createRedItem(param).then((res) => {
          if (res && res.code == 200) {
            ElMessage.success(res.data)
            handleClose()
          }
        })
      } else {
        createBlueItem(param).then((res) => {
          if (res && res.code == 200) {
            ElMessage.success(res.data)
            handleClose()
          }
        })
      }
    }
  })
}

const confirmScene = async (formEl) => {
  await formEl.validate((valid, fields) => {
    if (valid) {
      // 选择的目标
      let selectTarget = state.targetList.find(
        (item) => item.value == state.formData.targetName
      )
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
        type: state.formData.targetName02 // 暂时写死 RUAV 'RAUAV'
      }
      createItem(param).then((res) => {
        if (res && res.code == 200) {
          ElMessage.success(res.data)
          handleClose()
          // 重新加载兵力树
          setTimeout(() => {
            emitter.emit('reLoadGetLeftForceResult')
          }, 5000)
        }
      })
    }
  })
}

// 模拟器 返回
const handleChangeSimulator = (item) => {
  state.targetList = []
  state.formData.targetName = ''
  getSimList({ simTypeId: item }).then((res) => {
    if (res.code == 200) {
      if (res.data && res.data.length > 0) {
        let listArr = []
        res.data.forEach((item) => {
          listArr.push({
            name: item.simulatorEntityName,
            value: item.simulatorEntityName,
            side: 'red',
            type: 'FIGHTER_JET'
          })
        })
        state.targetList = listArr
      } else {
        if (item == 1) {
          state.targetList.push({
            name: 'Y8-3',
            value: 'Y8-3',
            side: 'red',
            type: 'TRANSPORT_PLANE'
          })
        } else if (item == 2) {
          state.targetList.push({
            name: 'J16',
            value: 'J16',
            side: 'red',
            type: 'FIGHTER_JET'
          })
        }
      }
    }
  })
}

//获取场景模拟器类型列表
const getSimListData = () => {
  getSimTypeList().then((res) => {
    if (res.code == 200) {
      state.simList = res.data
    }
  })
}

onMounted(() => {
  console.log(props.treelistblue)
  console.log(props.treelistred)
  state.selectBlue = props.treelistblue
  state.selectred = props.treelistred
  console.log('红方兵力', state.selectred)
  nextTick(() => {
    // 不从模拟器中获取实体
    // getSimListData()
  })
})
</script>

<style lang="less" scoped>
.target-container {
  position: fixed;
  left: 410px;
  top: 13%;
  width: 388px;
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
  z-index: 10;

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
}

.inputOption {
  .form_staticParameters {
    color: white;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

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
</style>
