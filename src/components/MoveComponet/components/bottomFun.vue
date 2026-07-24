<template>
  <div class="body-right">
    <el-checkbox-group v-model="state2.commandControlRadio" :min="0" :max="1">
      <el-checkbox
        v-for="(item, index) in state2.list"
        :key="index"
        style="width: 150px; color: #fff; height: 30px"
        v-model="item.checked1"
        :label="item.name"
        size="large"
        @change="changeCommandControl(item)"
      />
    </el-checkbox-group>
    <div
      style="margin-top: 8px"
      v-for="(item, index) in state2.functionList"
      :key="index"
    >
      <div
        style="display: flex; align-items: center"
        :style="{ justifyContent: index > 1 ? 'space-between' : '' }"
      >
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
          style="margin-right: 10px"
          size="large"
          :placeholder="'请输入' + item.name"
          class="custom-input"
        />
        <el-button
          v-if="item.name == '变更高度' || item.name == '变更速度'"
          size="20"
          type="primary"
          @click="btnChangeHeightAndSpeed(item)"
        >
          确定
        </el-button>
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import emitter from '@/utils/eventbus'
import { bottomFun } from './hooks/index.js'
import {
  atPosition,
  byRaw,
  toAltitude,
  toPosition,
  setPosition,
  openFire,
  toTarget,
  atTarget,
  changeFrequency,
  changeMode,
  changeState,
  turnOnWeapon,
  generatingJammer,
  laserDirectedJamming,
  accompanyingFlight,
  updateSpeed,
  breakMover,
  deficiencyFuel,
  deficiencyWeaponQuantity,
  changeInfraredState,
  taskOff
} from '@/service/command'
import { sendToCommandShowResMsg, getEititiesPostion } from '@/utils/mapTools'
import { sourceMbFlickerEntity } from '@/views/toolbar/layerList/hooks/guideCommand'
import { topFunction } from './hooks/index.js'

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

const store = useStore()

let state2 = reactive({
  list: [
    // {
    //   checked1: false,
    //   name: '攻击自定义指令',
    //   value: 'fireByRaw',
    //   type: 1
    // },
    // {
    //   checked1: false,
    //   name: '变更到指定位置',
    //   value: 'moveToPosition',
    //   type: 1
    // },
    {
      checked1: false,
      name: '立即改变位置',
      value: 'setPosition',
      type: 1
    }
    // {
    //   checked1: false,
    //   name: '发送干扰弹',
    //   value: 'generatingJammer',
    //   type: 1
    // },
    // {
    //   checked1: false,
    //   name: '激光定向干扰',
    //   value: 'laserDirectedJamming',
    //   type: 1
    // },
    // {
    //   checked1: false,
    //   name: '激光欺骗',
    //   value: 'laserDeception',
    //   type: 1
    // },
    // {
    //   checked1: false,
    //   name: '伴飞',
    //   value: 'accompanyingFlight',
    //   type: 1
    // },
    // {
    //   checked1: false,
    //   name: '飞机起飞',
    //   value: 'taskOff',
    //   type: 1
    // }
  ],
  entityTitle: '',
  inforList: [],
  commandControlRadio: [],
  formData: {},
  functionList: [
    {
      name: '变更高度',
      value: '',
      funValue: 'moveToAltitude',
      type: 1
    },
    {
      name: '变更速度',
      value: '',
      funValue: 'moveToSpeedKMH',
      type: 1
    }
  ]
})

onMounted(() => {
  state2.Oldlist = state2.list
  //显示当前飞机状态属性信息
  showPlaneInfo(store.state.sceneModule.currentFlyType)
  emitter.on('showCommandControl', (val) => {
    emitter.emit('showCommandControl02', val)
    state2.list.forEach((item) => {
      item.checked1 = false
    })
    if (val.isShow) {
      console.log(val)
      if (val.commandFormData.command == '发送干扰弹') {
        generatingJammerFun()
      } else if (val.commandFormData.command == '激光定向干扰') {
        laserDirectedJammingFun()
      } else if (val.commandFormData.command == '激光欺骗') {
        laserDeceptionFun()
      } else if (val.commandFormData.command == '伴飞') {
        accompanyingFlightFun()
      } else if (val.commandFormData.command == '飞机起飞') {
        taskOffFun()
      }
      // else if(val.commandFormData.command == '移动平台到指定位置'){
      //   state2.formData = val.commandFormData
      //   toPositionFun()
      // }else if(val.commandFormData.command == '立即改变位置'){
      //   state2.formData = val.commandFormData
      //   toPositionFun()
      // }
    }
  })
  emitter.on('setDisruptor', (val) => {})
})

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
    default:
      break
  }
}

const toPositionFun = () => {
  // 移动平台到指定位置指令接口
  let params = {
    lng: Number(state2.formData.longitude),
    lat: Number(state2.formData.latitude),
    alt: Number(state2.formData.height),
    pltName: state2.formData.sourceName
  }
  toPosition(params).then((res) => {
    // console.log(res)
    window.EarthViewer._container.style.cursor = 'default'
    beautyToast.success({
      title: '导调指令',
      message: '移动平台到指定位置指令已发出!',
      darkTheme: true
    })
    // handleClose()
    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '移动平台到指定位置指令完成',
        state2.formData.sourceName
      )
      state2.commandControlRadio = []
      state2.list.forEach((item) => {
        item.checked1 = false
      })
    }
  })
}

const changeCommandControl = (value) => {
  if (state2.commandControlRadio.length > 0) {
    state2.list.forEach((item) => {
      if (item.name == state2.commandControlRadio[0]) {
        item.checked1 = !item.checked1
      }
    })
  } else {
    state2.list.forEach((item) => {
      item.checked1 = false
    })
  }
  console.log(value)
  // bottomFun(value)
  if (value.checked1) {
    emitter.emit('clearCommandControl', value.value)
    if (value.value) {
      emitter.emit(value.value + 'Change1', true)
    }
    // if(value.name == '发送干扰弹'){
    //   generatingJammerFun()
    // }
  } else {
    clearCommandControl(value)
  }
}

// 激光定向干扰接口(立即导调指令)
const laserDirectedJammingFun = () => {
  let params = {
    platform: store.getters.getCurrentNode.code,
    parameter: store.state.sceneModule.targetInfo.code
  }
  laserDirectedJamming(params).then((res) => {
    // console.log(res)
    beautyToast.success({
      title: '导调指令',
      message: '激光定向干扰指令已发出!',
      darkTheme: true
    })

    if (res && res.code && res.code == 200) {
      showSysMessage(store.getters.getCurrentNode.code, '激光定向干扰指令成功')
      window.sceneAction.connectLineManagement.addLaserJammingLine({
        //创建激光干扰效果
        sourId: store.getters.getCurrentNode.code,
        targetId: store.state.sceneModule.targetInfo.code,
        type: 'laser-jamming',
        show: true,
        color: window.MSIMEarth.Color.RED,
        linkWidth: 5
      })
      setTimeout(() => {
        window.sceneAction.connectLineManagement.removeLaserJammingLine({
          type: 'laser-jamming',
          sourId: store.getters.getCurrentNode.code,
          targetId: store.state.sceneModule.targetInfo.code
        })
      }, 3000)
      state2.commandControlRadio = []
    } else {
      ElMessage.error('激光发射装备不可用!')
      state2.commandControlRadio = []
    }
    state2.list.forEach((item) => {
      item.checked1 = false
    })
  })
}

/**
 * 地图显示提示信息
 */
const showSysMessage = (platformName, textStr) => {
  const entityMethod = new window.EarthPlugn.entity({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  setTimeout(() => {
    let entitypath2 = entityMethod.getCZMLEntity(
      platformName,
      'MSIMEarthCZMLProcessContainer'
    )
    if (window.MSIMEarth.defined(entitypath2)) {
      let postionArr = getEititiesPostion(entitypath2)
      window.sceneAction.systemMessage.labelMessage({
        sysMessageId: platformName + '_sysMessage',
        sysMessagePosition: [postionArr[0], postionArr[1]],
        sysMessageText: textStr,
        sysFillColor: store.getters.getSucceStateInfoOutColor
      })
    }
  }, 1000)
}

// 激光欺骗 调用攻击开火指令
const laserDeceptionFun = () => {
  let params = {
    pltName: store.getters.getCurrentNode.code,
    tgtName: store.state.sceneModule.targetInfo.code
  }
  atTarget(params).then((res) => {
    // console.log(res)
    beautyToast.success({
      title: '导调指令',
      message: '激光欺骗攻击指令已发出!',
      darkTheme: true
    })

    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '激光欺骗攻击指令完成',
        store.getters.getCurrentNode.code
      )
    }
    state2.commandControlRadio = []
    state2.list.forEach((item) => {
      item.checked1 = false
    })
  })
}

// 伴飞
const accompanyingFlightFun = () => {
  let params = {
    platName: store.getters.getCurrentNode.code, // 当前平台
    accomPlatName: store.state.sceneModule.targetInfo.code // 伴飞目标平台
  }
  accompanyingFlight(params).then((res) => {
    // console.log(res)
    beautyToast.success({
      title: '导调指令',
      message: '伴飞指令已发出!',
      darkTheme: true
    })

    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '伴飞指令完成',
        store.getters.getCurrentNode.code
      )
    }
    state2.commandControlRadio = []
    state2.list.forEach((item) => {
      item.checked1 = false
    })
  })
}
//飞机起飞
const taskOffFun = () => {
  let params = {
    platFormName: store.getters.getCurrentNode.code, // 当前平台
    airportName: store.state.sceneModule.targetInfo.code,
    runningDistance: '1500', // 起飞滑跑距离 m
    takeoffSpeed: '200' // 起飞速度 km/h
  }
  taskOff(params).then((res) => {
    // console.log(res)
    beautyToast.success({
      title: '导调指令',
      message: '飞机起飞指令已发出!',
      darkTheme: true
    })

    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '飞机起飞指令完成',
        store.getters.getCurrentNode.code
      )
    }
    state2.commandControlRadio = []
    state2.list.forEach((item) => {
      item.checked1 = false
    })
  })
}
// 生成干扰弹接口(立即导调指令)
const generatingJammerFun = () => {
  let params = {
    fireName: store.getters.getCurrentNode.code,
    targetName: store.state.sceneModule.targetInfo.code
  }
  generatingJammer(params).then((res) => {
    // console.log(res)
    beautyToast.success({
      title: '导调指令',
      message: '生成干扰弹指令已发出!',
      darkTheme: true
    })

    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '生成干扰弹指令完成',
        store.getters.getCurrentNode.code
      )
      state2.commandControlRadio = []
      state2.list.forEach((item) => {
        item.checked1 = false
      })
    }
  })
}
//取消
const clearCommandControl = (val) => {
  emitter.emit('clearCommandControl', val.value)
  state2.commandControlRadio = []
  // state2.list.forEach((item)=>{
  //   item.checked1=false
  // })
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
  filterDetailsField(fieldSetting, 'list')

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
.body-right {
  font-size: 16px;
  display: flex;
  flex-wrap: wrap;
  align-items: center;

  .custom-input {
    height: 20px;
    width: 150px;
  }

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
.el-checkbox.el-checkbox--large .el-checkbox__label {
  font-size: 16px;
}
.el-checkbox {
  margin-right: 0px;
}
:deep(.el-input .el-input__wrapper) {
  background-color: rgba(32, 97, 121, 0.45) !important;
}
</style>
