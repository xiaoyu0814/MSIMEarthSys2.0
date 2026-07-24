<template>
  <div class="body-left">
    <div
      style="margin-top: 5px"
      v-for="(item, index) in state2.functionList"
      :key="index"
    >
      <div style="display: flex; justify-content: space-between">
        <div
          style="
            display: flex;
            align-items: center;
            color: #fff;
            font-size: 14px;
          "
        >
          {{ item.name }}：
        </div>
        <el-input
          v-if="item.name == '变更高度' || item.name == '变更速度'"
          v-model="item.value"
          style="
            width: 200px;
            height: 30px;
            margin-right: 10px;
            background: rgba(32, 97, 121, 0.45);
            border: 1px solid #64c7d5;
            border-radius: 4px;
          "
          size="large"
          :placeholder="'请输入' + item.name"
        />
        <el-button
          v-if="item.name == '变更高度' || item.name == '变更速度'"
          size="20"
          type="primary"
          @click="btnChangeHeightAndSpeed(item)"
        >
          确定
        </el-button>
        <el-switch
          style="margin-right: 60px; --el-switch-on-color: #0494c5"
          v-if="
            item.name == '变更雷达工作状态' ||
            item.name == '变更干扰机工作状态' ||
            item.name == '变更烟雾干扰装置状态'
          "
          :disabled="item.disabledValue"
          v-model="item.value"
          size="small"
          active-text=""
          inactive-text=""
        >
        </el-switch>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted, defineProps } from 'vue'
import { useStore } from 'vuex'
import emitter from '@/utils/eventbus'
import { ElMessage } from 'element-plus'
import { sourceMbFlickerEntity } from '@/views/toolbar/layerList/hooks/guideCommand'
import { topFunction } from './hooks/index.js'

const store = useStore()
const {
  toAltitudeFun,
  updateSpeedFun,
  toChangeStateFun,
  toFireTurnOnWeaponFun,
  changeInfraredStateFun,
  getSensors,
  getWeapons,
  getInfraredSign
} = topFunction()
// const props = defineProps({
//   entityHeight: {
//     type: String,
//     default: ''
//   },
//   entitySpeedKm: {
//     type: String,
//     default: ''
//   }
// })

const handleChangeBySwitch = (val) => {
  let sourceName = store.state.sceneModule.currentFlyType.entityId
  switch (val.name) {
    case '变更雷达工作状态':
      let stateValue = val.value
      toChangeStateFun(sourceName, stateValue)
      break
    case '变更干扰机工作状态':
      let turnIsOpenStateValue = val.value
      toFireTurnOnWeaponFun(sourceName, turnIsOpenStateValue)
      break
    case '变更烟雾干扰装置状态':
      let infraredState = val.value
      let infraredStateValue = false
      if (infraredState) {
        infraredStateValue = 'smoke'
      } else {
        infraredStateValue = 'default'
      }
      changeInfraredStateFun(sourceName, infraredStateValue)
      break
    default:
      break
  }
}

const btnChangeHeightAndSpeed = (val) => {
  let sourceName = store.state.sceneModule.currentFlyType.entityId
  switch (val.name) {
    case '变更高度':
      if (!val.value) {
        ElMessage.error('变更高度为空')
        return false
      }
      sourceMbFlickerEntity(sourceName)
      let alt = Number(val.value)
      let height = Number(state2.entityHeight)
      toAltitudeFun(alt, height, sourceName)
      break
    case '变更速度':
      if (!val.value) {
        ElMessage.error('变更速度为空')
        return false
      }
      sourceMbFlickerEntity(sourceName)
      let changeSpeed = Number(val.value)
      let originalSpeed = Number(state2.entitySpeedKm)
      updateSpeedFun(sourceName, changeSpeed, originalSpeed)
      break
    case '变更雷达工作状态':
      let stateValue = val.value
      toChangeStateFun(sourceName, stateValue)
      break
    case '变更干扰机工作状态':
      let turnIsOpenStateValue = val.value
      toFireTurnOnWeaponFun(sourceName, turnIsOpenStateValue)
      break
    case '变更烟雾干扰装置状态':
      let infraredStateValue = val.value
      changeInfraredStateFun(sourceName, infraredStateValue)
      break
    default:
      break
  }
}

let state2 = reactive({
  functionList: [
    // {
    //   name: '变更高度',
    //   value: '',
    //   funValue: 'moveToAltitude',
    //   type: 1
    // },
    // {
    //   name: '变更速度',
    //   value: '',
    //   funValue: 'moveToSpeedKMH',
    //   type: 1
    // },
    {
      name: '变更雷达工作状态',
      value: true,
      disabledValue: false,
      funValue: 'sensorChangeState',
      type: 2
    },
    {
      name: '变更干扰机工作状态',
      value: true,
      disabledValue: false,
      funValue: 'fireTurnOnWeaponf',
      type: 2
    },
    {
      name: '变更烟雾干扰装置状态',
      value: true,
      disabledValue: false,
      funValue: 'changeInfraredState',
      type: 2
    }
    // {
    //   name: '发动机故障：',
    //   type: 3
    // },
    // {
    //   name: '油料缺失：',
    //   type: 3
    // },
    // {
    //   name: '缺失弹药：',
    //   type: 3
    // }
  ],
  entityTitle: '',
  inforList: [],
  entityHeight: '', // 实体高度
  entitySpeedKm: '' // 实体速度
})

onMounted(() => {
  state2.OldfunctionList = state2.functionList
  //显示当前飞机状态属性信息
  showPlaneInfo(store.state.sceneModule.currentFlyType)

  //实体高度 与 速度 传值
  emitter.on('getEntityHeightAndSpeed', (val) => {
    state2.entityHeight = val.entityHeight
    state2.entitySpeedKm = val.entitySpeedKm
    // 获取当前实体 变更雷达工作当前状态
    getSensorState()
    // 获取当前实体 变更干扰机工作状态
    getFireTurnOnByWeaponState()
    // 获取当前实体 变更烟雾干扰装置状态
    getInfraredState()
  })
})

// 根据当前传放的 name 获取实体信息
const getArrValue = (curData, datasArr) => {
  const i = datasArr.findIndex((item) => {
    return item.name == curData
  })
  return datasArr[i] ? datasArr[i] : null
}

// 获取当前实体 变更雷达工作当前状态
const getSensorState = async () => {
  let sensorCurObj = getArrValue('变更雷达工作状态', state2.functionList)
  // 获取 变更平台传感器状态
  let sensorsArr = await getSensors()
  if (sensorsArr && sensorsArr.length > 0) {
    let stateValue = sensorsArr[0]['onFlag'] == false ? false : true

    sensorCurObj.value = stateValue
    sensorCurObj.disabledValue = false
  } else {
    sensorCurObj.value = false
    sensorCurObj.disabledValue = true
  }
}

// 查找武器 干扰 类型 -- WSF_RF_JAMMER
const getJammerArrValue = (curData, datasArr) => {
  const i = datasArr.findIndex((item) => {
    return item.btype == curData
  })
  return datasArr[i] ? datasArr[i] : null
}

//变更平台干扰状态指令接口
const getFireTurnOnByWeaponState = async () => {
  let weaponCurObj = getArrValue('变更干扰机工作状态', state2.functionList)
  let weaponsArr = await getWeapons()
  // 获取平台干扰状态 实时 开关信息
  if (weaponsArr && weaponsArr.length > 0) {
    let JammerData = getJammerArrValue('WSF_RF_JAMMER', weaponsArr)
    let turnIsOpenStateValue =
      JammerData && JammerData['isOpen'] == false ? false : true

    weaponCurObj.value = turnIsOpenStateValue
    weaponCurObj.disabledValue = false
  } else {
    weaponCurObj.value = false
    weaponCurObj.disabledValue = true
  }
}

// 变更烟雾干扰装置状态
const getInfraredState = async () => {
  let infraredCurObj = getArrValue('变更烟雾干扰装置状态', state2.functionList)
  let infraredSignStr = await getInfraredSign()
  if (infraredSignStr) {
    infraredCurObj.value = infraredSignStr == 'default' ? false : true
    infraredCurObj.disabledValue = false
  } else {
    infraredCurObj.value = false
    infraredCurObj.disabledValue = true
  }
}

//显示飞机当前状态的信息
const showPlaneInfo = (inforData) => {
  state2.inforList = []
  let infors = inforData
  state2.inforList = [
    // {
    //   name: '名称',
    //   value: infors.name
    // },
    {
      name: '状态',
      value: infors.type
    }
  ]
  state2.entityTitle = infors.name
  //过滤飞机详情字段
  //TODO:暂时不太清楚哪个字段为武器装备类型暂时先使用name作为类型
  controlFieldShowOrHide(state2.entityTitle)
}

/**
 * @description 控制详情页字段是否展示方法
 * @param { String } typeName 平台类型
 */
const controlFieldShowOrHide = (typeName) => {
  if (!store.state.targetDetailsConfig) {
    fetch('/static/config/targetDetailsConfig/targetDetailsConfig.json')
      .then((response) => response.json())
      .then((res) => {
        store.commit('setTargetDetailsConfig', res)
        controlFieldShowOrHide(typeName)
      })
    return
  }

  let fieldSetting =
    store.state.targetDetailsConfig.defaultSetting.detailsConfigArray
  store.state.targetDetailsConfig.platformTypeConfig.forEach((element) => {
    if (element.name == typeName) fieldSetting = element.detailsConfigArray
  })
  //过滤指令
  filterDetailsField(fieldSetting, 'functionList')

  // controlFieldCheck()
}
/**
 * @description 根据字段配置文件过滤页面上vuedata的数值 控制字段是否展示
 * @param { Array } fieldSetting 配置文件配置展示功能列表
 * @param { String } key vuedata中展示的数据源名称
 */
const filterDetailsField = (fieldSetting, key) => {
  if (!state2['Old' + key]) return
  let newDataArray = state2['Old' + key].filter((item, index) => {
    return fieldSetting.includes(item.name)
  })
  state2[key] = newDataArray
}
</script>
<style lang="less" scoped>
.body-left {
  // width: 100%;
}
.el-checkbox.el-checkbox--large .el-checkbox__label {
  font-size: 16px;
}
</style>
