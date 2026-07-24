<template>
  <div class="commandControl-container">
    <div class="container-main">
      <div class="buttonTitle">{{ state.formData.command }}指令</div>
      <img
        src="@/assets/image/panelIcons/关闭icon.png"
        alt=""
        class="close_sty"
        @click="handleClose"
      />
      <div class="formContainer">
        <div class="inputOption">
          <el-form :model="state.formData" label-width="70px">
            <el-form-item
              label="平台名称"
              v-if="
                state.formData.command == '列表目标攻击' ||
                state.formData.command == '攻击自定义' ||
                state.formData.command == '攻击目标' ||
                state.formData.command == '变更平台高度' ||
                state.formData.command == '变更航向' ||
                state.formData.command == '变更传感器开关' ||
                state.formData.command == '销毁' ||
                state.formData.command == '移动平台到指定位置' ||
                state.formData.command == '立即改变位置' ||
                state.formData.command == '改变位置' ||
                state.formData.command == '移动平台到目标距离' ||
                state.formData.command == '变更平台传感器频率' ||
                state.formData.command == '变更平台传感器模式' ||
                state.formData.command == '变更平台传感器状态' ||
                state.formData.command == '攻击' ||
                state.formData.command == '攻击指定目标' ||
                state.formData.command == '变更平台干扰状态' ||
                state.formData.command == '发送干扰弹' ||
                state.formData.command == '激光定向干扰' ||
                state.formData.command == '激光欺骗' ||
                state.formData.command == '伴飞' ||
                state.formData.command == '变更平台速度' ||
                state.formData.command == '变更烟雾干扰装置状态' ||
                state.formData.command == '发动机故障' ||
                state.formData.command == '油料缺失' ||
                state.formData.command == '缺失弹药' ||
                state.formData.command == '飞机起飞'
              "
            >
              <el-input v-model="state.formData.sourceName" disabled></el-input>
            </el-form-item>
            <el-form-item
              label="虚兵名称"
              v-if="state.formData.command == '列表目标攻击'"
            >
              <el-select
                v-model="state.formData.targetName"
                class="scene_input"
                placeholder="请选择虚兵名称"
                size="small"
                clearable
                @change="changeTargetNameList"
              >
                <el-option
                  v-for="item in state.formData.targetNameList"
                  :key="item.id"
                  :label="item.name"
                  :value="item.id"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="虚兵名称"
              v-if="
                state.formData.command == '攻击自定义' ||
                state.formData.command == '移动平台到目标距离' ||
                state.formData.command == '攻击指定目标' ||
                state.formData.command == '发送干扰弹' ||
                state.formData.command == '激光定向干扰' ||
                state.formData.command == '激光欺骗' ||
                state.formData.command == '伴飞'
              "
            >
              <el-input v-model="state.formData.targetName" disabled></el-input>
            </el-form-item>
            <el-form-item
              label="经度"
              v-if="
                state.formData.command == '攻击指定位置' ||
                state.formData.command == '移动平台到指定位置' ||
                state.formData.command == '改变位置' ||
                state.formData.command == '立即改变位置'
              "
            >
              <el-input v-model="state.formData.longitude" disabled></el-input>
            </el-form-item>
            <el-form-item
              label="纬度"
              v-if="
                state.formData.command == '攻击指定位置' ||
                state.formData.command == '移动平台到指定位置' ||
                state.formData.command == '改变位置' ||
                state.formData.command == '立即改变位置'
              "
            >
              <el-input v-model="state.formData.latitude" disabled></el-input>
            </el-form-item>
            <el-form-item
              label="位置高度"
              v-if="
                state.formData.command == '攻击指定位置' ||
                state.formData.command == '移动平台到指定位置' ||
                state.formData.command == '改变位置' ||
                state.formData.command == '立即改变位置'
              "
            >
              <el-input v-model="state.formData.height"></el-input>
            </el-form-item>
            <el-form-item
              label="武器名称"
              v-if="
                state.formData.command == '列表目标攻击' ||
                state.formData.command == '攻击自定义' ||
                state.formData.command == '攻击' ||
                state.formData.command == '攻击指定目标' ||
                state.formData.command == '攻击指定位置'
              "
            >
              <!-- <el-input v-model="state.formData.weaponName" disabled></el-input> -->
              <el-select
                v-model="state.formData.weaponName"
                class="scene_input"
                placeholder="请选择武器名称"
                size="small"
                clearable
                @change="changeWeapon"
              >
                <el-option
                  v-for="item in state.formData.weaponsArr"
                  :key="item.weaponsId"
                  :label="item.name"
                  :value="item.weaponsId"
                />
                <!-- <el-option label="mrm" value="mrm" /> -->
              </el-select>
            </el-form-item>
            <el-form-item
              label="发射数量"
              v-if="
                state.formData.command == '列表目标攻击' ||
                state.formData.command == '攻击自定义' ||
                state.formData.command == '攻击' ||
                state.formData.command == '攻击指定目标' ||
                state.formData.command == '攻击指定位置'
              "
              ><el-input-number
                v-model="state.formData.num"
                :min="0"
                :max="state.formData.quatRCount"
              />
            </el-form-item>
            <el-form-item
              label="源高度"
              v-if="state.formData.command == '变更平台高度'"
            >
              <el-input-number v-model="state.formData.height" disabled />
            </el-form-item>
            <el-form-item
              label="高度"
              v-if="state.formData.command == '变更平台高度'"
            >
              <el-input-number
                v-model="state.formData.alt"
                :min="500"
                :max="30000"
              />
            </el-form-item>
            <el-form-item
              label="距离(米)"
              v-if="state.formData.command == '移动平台到目标距离'"
            >
              <el-input-number
                v-model="state.formData.dist"
                :min="100"
                :max="20000"
              />
            </el-form-item>
            <el-form-item
              label="频率(Hz)"
              v-if="state.formData.command == '变更平台传感器频率'"
            >
              <el-input-number v-model="state.formData.frequency" :min="0" />
            </el-form-item>
            <el-form-item
              label-width="90px"
              label="传感器名称"
              v-if="state.formData.command == '变更平台传感器频率'"
            >
              <el-select
                v-model="state.formData.sensorName"
                class="scene_input"
                placeholder="请选择传感器名称"
                size="small"
                clearable
              >
                <!-- <el-option label="esm" value="esm" /> -->
                <el-option
                  v-for="item in state.formData.sensoresArr"
                  :key="item.id"
                  :label="item.name"
                  :value="item.name"
                />
              </el-select>
              <!-- <el-input v-model="state.formData.sensorName"></el-input> -->
            </el-form-item>
            <el-form-item
              label="模式"
              v-if="state.formData.command == '变更平台传感器模式'"
            >
              <el-select
                v-model="state.formData.modeValue"
                class="scene_input"
                placeholder="请选择"
                size="small"
                clearable
              >
                <el-option
                  v-for="(item, index) in state.formData.sensorModeArr"
                  :key="index"
                  :label="item"
                  :value="item"
                />
                <!-- <el-option label="ACQUIRE" value="ACQUIRE" />
                <el-option label="TRACK" value="TRACK" /> -->
              </el-select>
            </el-form-item>
            <el-form-item
              label="状态"
              v-if="state.formData.command == '变更平台传感器状态'"
            >
              <el-radio-group v-model="state.formData.stateValue">
                <el-radio label="1">开启</el-radio>
                <el-radio label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="状态"
              v-if="state.formData.command == '变更平台干扰状态'"
            >
              <el-radio-group v-model="state.formData.turnIsOpenStateValue">
                <el-radio label="1">开启</el-radio>
                <el-radio label="0">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="状态"
              v-if="state.formData.command == '变更烟雾干扰装置状态'"
            >
              <el-radio-group v-model="state.formData.infraredStateValue">
                <el-radio label="smoke">开启</el-radio>
                <el-radio label="default">关闭</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="源速度"
              class="chspeed"
              v-if="state.formData.command == '变更平台速度'"
            >
              <el-input-number
                v-model="state.formData.originalSpeed"
                disabled
              />
              <span class="chSpeed_dw">(km/h)</span>
            </el-form-item>
            <el-form-item
              label="速度"
              class="chspeed"
              v-if="state.formData.command == '变更平台速度'"
            >
              <el-input-number v-model="state.formData.changeSpeed" :min="50" />
              <span class="chSpeed_dw">(km/h)</span>
            </el-form-item>
            <el-form-item
              label="起飞机场"
              v-if="state.formData.command == '飞机起飞'"
            >
              <el-input v-model="state.formData.targetName" disabled></el-input>
              <!-- style="width: 126px" -->
              <!-- <el-button
                type="primary"
                style="margin-left: 5px"
                size="small"
                @click="getAirportName"
                round
                >拾取</el-button
              > -->
            </el-form-item>
            <!-- <el-form-item label="延迟时间（分）">
              <el-input v-model="state.seconds"></el-input>
            </el-form-item> -->
            <el-form-item
              label="航向"
              class="Heading"
              v-if="state.formData.command == '变更航向'"
            >
              <el-input-number v-model="state.formData.heading" />
              <!-- <span class="chSpeed_dw">(°)</span> -->
            </el-form-item>
            <el-form-item
              label="传感器"
              class="SensorName"
              v-if="state.formData.command == '变更传感器开关'"
            >
              <ul>
                <li
                  class="sensor_box"
                  v-for="(item, index) in state.formData.sensorArr"
                  :key="index"
                >
                  <div>
                    <span class="sensor_name" :title="item.Name">{{
                      item.Name
                    }}</span>
                    <el-switch
                      style="margin: 0 30px"
                      v-model="item.On"
                      active-color="#13ce66"
                      inactive-color="#ff4949"
                      @change="changeStatus(item, index)"
                    >
                    </el-switch>
                  </div>
                </li>
              </ul>
            </el-form-item>
            <el-form-item
              label="武器名称"
              v-if="state.formData.command == '变更弹药数量'"
            >
              <el-select
                v-model="state.formData.weaponName"
                class="scene_input"
                placeholder="请选择武器"
                size="small"
                clearable
                @change="weaponNameChange"
              >
                <el-option
                  v-for="(item, index) in state.weaponList"
                  :key="index"
                  :label="item.Name"
                  :value="item.Name"
                />
              </el-select>
            </el-form-item>
            <el-form-item
              label="弹药"
              v-if="state.formData.command == '变更弹药数量'"
            >
              <el-input-number
                v-model="state.formData.resupplyCount"
              ></el-input-number>
            </el-form-item>
          </el-form>
        </div>
        <div class="select_btn">
          <el-button type="primary" size="small" @click="confirmSceneBySetTime"
            >确定</el-button
          >
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch, defineProps } from 'vue'
import emitter from '@/utils/eventbus'
import store from '@/store/index'
import Bubble3 from '@/utils/bubble/dataBubble3'
import {
  sourceMbFlickerEntity,
  getIsInsideCircleByPoint,
  storage
} from '@/views/toolbar/layerList/hooks/guideCommand'
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
import { setPlatformJam, getPlatformWeapons } from '@/service/afsim'
import { ElMessage } from 'element-plus'
import { sendToCommandShowResMsg } from '@/utils/mapTools'
import { setPlateformStatus, setPlatformAttack } from '@/service/afsim/index'
import { getPlatformInfo } from '@/service/SSE.js'
const props = defineProps({
  commandFormData: {
    type: Object,
    default: {}
  }
})
// console.log(props.commandFormData)
const state = reactive({
  curSelect: '',
  SensorStatusList: [],
  seconds: 0, //导调延迟分钟数
  formData: {
    command: props.commandFormData.command,
    sourceName: props.commandFormData.sourceName,
    targetName: props.commandFormData['targetName'],
    targetNameTemp: '',
    longitude: props.commandFormData['longitude'],
    latitude: props.commandFormData['latitude'],
    height: props.commandFormData['height'],
    heading: props.commandFormData['Heading'],
    weaponsArr: props.commandFormData['weaponsArr'],
    sensoresArr: props.commandFormData['sensoresArr'],
    num: 1,
    weaponName: '',
    resupplyCount: 0,
    quatRCount: 0, // 当前导弹数量
    alt: props.commandFormData['height']
      ? Number(props.commandFormData['height'])
      : 500,
    dist: 100,
    frequency:
      props.commandFormData['sensoresArr'] &&
      props.commandFormData['sensoresArr'].length > 0 &&
      props.commandFormData['sensoresArr'][0]['xaF']
        ? Number(props.commandFormData['sensoresArr'][0]['xaF'])
        : 0,
    sensorName: '',
    modeValue:
      props.commandFormData['sensoresArr'] &&
      props.commandFormData['sensoresArr'].length > 0 &&
      props.commandFormData['sensoresArr'][0]['mcmn']
        ? props.commandFormData['sensoresArr'][0]['mcmn']
        : '',
    sensorModeArr:
      props.commandFormData['sensoresArr'] &&
      props.commandFormData['sensoresArr'].length > 0 &&
      props.commandFormData['sensoresArr'][0]['msml']
        ? JSON.parse(props.commandFormData['sensoresArr'][0]['msml'])
        : [],
    stateValue:
      props.commandFormData['sensoresArr'] &&
      props.commandFormData['sensoresArr'].length > 0 &&
      props.commandFormData['sensoresArr'][0]['onFlag'] == false
        ? '0'
        : '1',
    turnIsOpenStateValue: props.commandFormData['turnIsOpenStateValue'],
    infraredStateValue:
      props.commandFormData['infraredSign'] &&
      props.commandFormData['infraredSign'] == 'default'
        ? 'default'
        : props.commandFormData['infraredSign'], //变更烟雾干扰装置状态
    originalSpeed: props.commandFormData['originalSpeed'], // 原始速度,
    changeSpeed: 1800, // 变更速度
    targetNameList: props.commandFormData['entityNameIdObj'], // 所有被打击目标
    sensorArr: props.commandFormData.sensorArr, //传感器
    sensorStatusArr: []
  },
  currentSensor: {},
  weaponList: []
})

const handleClose = () => {
  let commandControlObj = {
    isShow: false,
    commandFormData: {}
  }
  emitter.emit('showCommandControl', commandControlObj)
  emitter.emit('showFirePanel', commandControlObj)
  tempEntityDel()
  // 删除 流线连线
  if (state.formData.targetNameTemp) {
    state.formData.targetName = state.formData.targetNameTemp
    state.formData.targetNameTemp = ''
  }
  if (
    state.formData.command == '列表目标攻击' ||
    state.formData.command == '攻击指定位置' ||
    state.formData.command == '攻击自定义' ||
    state.formData.command == '攻击目标' ||
    state.formData.command == '移动平台到目标距离' ||
    state.formData.command == '攻击指定目标' ||
    state.formData.command == '发送干扰弹' ||
    state.formData.command == '激光定向干扰' ||
    state.formData.command == '激光欺骗' ||
    state.formData.command == '伴飞'
  ) {
    store.commit('setRelatedRightClickConfig', false)
    // 删除 流线连线
    window.sceneAction.connectLineManagement.removeCommControlLine({
      sourId: state.formData.sourceName,
      targetId: state.formData.targetName
    })
  }
  if (
    state.formData.command == '列表目标攻击' ||
    state.formData.command == '攻击指定位置' ||
    state.formData.command == '攻击自定义' ||
    state.formData.command == '攻击' ||
    state.formData.command == '攻击目标' ||
    state.formData.command == '攻击指定目标'
  ) {
    removeEntityCircleById('operationalRadius1' + state.formData.sourceName)
  }
  emitter.emit('clearRedioData')
}

// 根据当前传放的 weaponsId 获取实体信息
const getArrValue = (curData, datasArr) => {
  const i = datasArr.findIndex((item) => {
    return item.weaponsId == curData
  })
  return datasArr[i] ? datasArr[i] : null
}
const atPositionFun = () => {
  // 攻击指定位置指令接口
  let params = {
    lng: Number(state.formData.longitude),
    lat: Number(state.formData.latitude),
    alt: Number(state.formData.height),
    pltName: state.formData.sourceName
  }
  atPosition(params).then((res) => {
    window.EarthViewer._container.style.cursor = 'default'
    beautyToast.success({
      title: '导调指令',
      message: '攻击指定位置指令已发出!',
      darkTheme: true
    })
    handleClose()
    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '攻击指定位置指令完成',
        state.formData.sourceName
      )
    }
  })
}

const byRawFun = () => {
  // 攻击自定义指令接口
  let params = {
    num: Number(state.formData.num), //发射数量
    weaponName: state.formData.weaponName, //武器名称
    pltName: state.formData.sourceName,
    tgtName: state.formData.targetName
  }
  byRaw(params).then((res) => {
    // console.log(res)
    window.EarthViewer._container.style.cursor = 'default'
    beautyToast.success({
      title: '导调指令',
      message: '攻击自定义指令已发出!',
      darkTheme: true
    })
    handleClose()
    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '攻击自定义指令完成',
        state.formData.sourceName
      )
    }
  })
}

const openFireFun = () => {
  // 攻击指令接口
  let params = {
    pltName: state.formData.sourceName
  }
  openFire(params).then((res) => {
    //右上角消息提示弹框
    beautyToast.success({
      title: '导调指令',
      message: '攻击指令已发出!',
      darkTheme: true
    })
    handleClose()
    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '攻击指令完成',
        state.formData.sourceName
      )
    }
  })
}

const atTargetFun = () => {
  // 攻击指定目标指令接口
  let params = {
    pltName: state.formData.sourceName,
    tgtName: state.formData.targetName
  }
  atTarget(params).then((res) => {
    // console.log(res)
    beautyToast.success({
      title: '导调指令',
      message: '攻击指定目标指令已发出!',
      darkTheme: true
    })

    handleClose()
    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '攻击指定目标指令完成',
        state.formData.sourceName
      )
    }
  })
}

const fireTargetFun = () => {
  let params = {
    platform: state.formData.sourceName,
    fire: `{"targetName":"${state.formData.targetName}"}`
  }
  // console.log(state.formData.targetName)
  setPlatformAttack(params).then((res) => {
    const parsedData = JSON.parse(res.data)
    if (parsedData.status == 'success') {
      beautyToast.success({
        title: '攻击指令',
        message: '攻击指令已发出!',
        darkTheme: true
      })
      handleClose()
      sendToCommandShowResMsg(
        res.data,
        '攻击指令完成',
        state.formData.sourceName
      )
    }
  })
}

const toAltitudeFun = () => {
  // 变更平台高度接口
  let params = {
    alt: Number(state.formData.alt),
    pltName: state.formData.sourceName
  }
  toAltitude(params).then((res) => {
    // console.log(res)
    beautyToast.success({
      title: '导调指令',
      message: '变更平台高度指令已发出!',
      darkTheme: true
    })

    handleClose()
    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '修改高度指令完成',
        state.formData.sourceName
      )
      if (window['curDivPoint_commContr_' + state.formData.sourceName]) {
        window[
          'curDivPoint_commContr_' + state.formData.sourceName
        ].closeEvent()
        window['curDivPoint_commContr_' + state.formData.sourceName] = null
      }
      let infors = store.state.sceneModule.currentFlyType
      let titleName = Object.keys(infors).length > 0 ? infors.name : ''
      let moreAndLess = ''
      if (Number(state.formData.alt) > Number(state.formData.height)) {
        moreAndLess = 'more'
      } else {
        moreAndLess = 'less'
      }
      new Bubble3({
        moreAndLess: moreAndLess,
        content: [
          { name: '名称', value: titleName },
          { name: '原始', value: Number(state.formData.height) },
          { name: '目标', value: Number(state.formData.alt) },
          { name: '变更', value: state.formData.height }
        ],
        viewer: window.EarthViewer,
        Cesium: window.MSIMEarth,
        id: state.formData.sourceName,
        name: state.formData.sourceName, //datasource
        title: '变更平台高度指令',
        offsetY: 100,
        distanceDisplayCondition: [100, 5000000],
        div: 'style'
      })
    }
  })
}

const toPositionFun = () => {
  let params = {
    platform: state.formData.sourceName,
    setPosition: `{"lon":"${state.formData.longitude}","lat":"${state.formData.latitude}","alt":"${state.formData.height}"}`
  }
  setPlateformStatus(params).then((res) => {
    const parsedData = JSON.parse(res.data)
    if (parsedData.status == 'success') {
      window.EarthViewer._container.style.cursor = 'default'
      beautyToast.success({
        title: '导调指令',
        message: '移动平台到指定位置指令已发出!',
        darkTheme: true
      })
      handleClose()
      // if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '移动平台到指定位置指令完成',
        state.formData.sourceName
      )
      // }
    }
  })
}

const setPositionFun = () => {
  // 立即改变位置指令接口
  let params = {
    lng: Number(state.formData.longitude),
    lat: Number(state.formData.latitude),
    alt: Number(state.formData.height),
    pltName: state.formData.sourceName
  }
  setPosition(params).then((res) => {
    // console.log(res)
    window.EarthViewer._container.style.cursor = 'default'
    beautyToast.success({
      title: '导调指令',
      message: '设置平台到指定位置(立刻)已发出!',
      darkTheme: true
    })
    handleClose()
    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '设置平台到指定位置(立刻)指令完成',
        state.formData.sourceName
      )
    }
  })
}

const toTargetFun = () => {
  debugger
  // 移动平台到目标距离指令接口
  let params = {
    dist: Number(state.formData.dist),
    pltName: state.formData.sourceName,
    tgtName: state.formData.targetName
  }
  console.log('params', params)
  toTarget(params).then((res) => {
    // console.log(res)
    window.EarthViewer._container.style.cursor = 'default'
    beautyToast.success({
      title: '导调指令',
      message: '移动平台到目标距离指令已发出!',
      darkTheme: true
    })
    handleClose()
    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '移动平台到目标距离指令完成',
        state.formData.sourceName
      )
    }
  })
}

const toChangeFrequencyFun = () => {
  // 变更平台传感器频率指令接口
  let params = {
    pltName: state.formData.sourceName,
    frequency: state.formData.frequency,
    sensorName: state.formData.sensorName
  }
  changeFrequency(params).then((res) => {
    // console.log(res)
    beautyToast.success({
      title: '导调指令',
      message: '变更平台传感器频率指令已发出!',
      darkTheme: true
    })
    handleClose()
    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '变更平台传感器频率指令完成',
        state.formData.sourceName
      )
    }
  })
}

const toChangeModeFun = () => {
  // 变更平台传感器模式指令接口
  let params = {
    pltName: state.formData.sourceName,
    value: state.formData.modeValue
  }
  changeMode(params).then((res) => {
    // console.log(res)
    beautyToast.success({
      title: '导调指令',
      message: '变更平台传感器模式指令已发出!',
      darkTheme: true
    })
    handleClose()
    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '变更平台传感器模式指令完成',
        state.formData.sourceName
      )
    }
  })
}

const toChangeStateFun = () => {
  // 变更平台传感器状态指令接口
  let params = {
    pltName: state.formData.sourceName,
    value: Number(state.formData.stateValue)
  }
  changeState(params).then((res) => {
    // console.log(res)
    beautyToast.success({
      title: '导调指令',
      message: '变更平台传感器状态指令已发出!',
      darkTheme: true
    })
    handleClose()
    if (res.code == 200) {
      console.log(store.getters.getCurrentNode.code)
      console.log(state.formData.stateValue)
      if (state.formData.stateValue == 0) {
        //关闭
        //变更传感器状态存储
        let list = JSON.parse(localStorage.getItem('currentFlyType'))
        list.push(store.state.sceneModule.currentFlyType)
        localStorage.setItem('currentFlyType', JSON.stringify(list))
        removeEntityCircleById(
          'entitySensor' + store.getters.getCurrentNode.code
        )
      } else if (state.formData.stateValue == 1) {
        //开启
        //开启后，将变更传感器状态存储数据删除，显示线路
        let list = JSON.parse(localStorage.getItem('currentFlyType'))
        for (let i = 0; i < list.length; i++) {
          if (
            list[i].name.indexOf(store.state.sceneModule.currentFlyType.name) !=
            -1
          ) {
            list.splice(i, 1)
          }
        }
        // list.filter(
        //   (item) => store.state.sceneModule.currentFlyType.name.indexOf(item.name) != -1
        // )
        localStorage.setItem('currentFlyType', JSON.stringify(list))
      }
      store.commit('setSensorStatusList', state.SensorStatusList)
      sendToCommandShowResMsg(
        res.data,
        '变更平台传感器状态指令完成',
        state.formData.sourceName
      )
    }
  })
}

// 变更平台干扰状态
const toFireTurnOnWeaponFun = () => {
  // 变更平台干扰状态指令接口
  let params = {
    pltName: state.formData.sourceName,
    value: Number(state.formData.turnIsOpenStateValue)
  }
  let message = `${state.formData.sourceName}干扰开启`
  if (state.formData.turnIsOpenStateValue === '0') {
    message = `${state.formData.sourceName}干扰停止`
  }
  turnOnWeapon(params).then((res) => {
    // console.log(res)
    beautyToast.success({
      title: '导调指令',
      message: '变更平台干扰状态指令已发出!',
      darkTheme: true
    })
    handleClose()
    if (res.code == 200) {
      sendToCommandShowResMsg(res.data, message, state.formData.sourceName)
      // 如果开启成功则把该平台干扰状态更新到集合当中
      EarthAPP.grjh.forEach((e) => {
        if (e.name === state.formData.sourceName) {
          if (state.formData.turnIsOpenStateValue === '1') {
            e.state = true
          } else {
            e.state = false
          }
        }
      })
    }
  })
}

// 激光定向干扰接口(立即导调指令)
const laserDirectedJammingFun = () => {
  let params = {
    platform: state.formData.sourceName,
    parameter: state.formData.targetName
  }
  laserDirectedJamming(params).then((res) => {
    // console.log(res)
    beautyToast.success({
      title: '导调指令',
      message: '激光定向干扰指令已发出!',
      darkTheme: true
    })

    handleClose()
    if (res && res.code && res.code == 200) {
      showSysMessage(state.formData.sourceName, '激光定向干扰指令成功')
      window.sceneAction.connectLineManagement.addLaserJammingLine({
        //创建激光干扰效果
        sourId: state.formData.sourceName,
        targetId: state.formData.targetName,
        type: 'laser-jamming',
        show: true,
        color: window.MSIMEarth.Color.RED,
        linkWidth: 5
      })
      setTimeout(() => {
        window.sceneAction.connectLineManagement.removeLaserJammingLine({
          type: 'laser-jamming',
          sourId: state.formData.sourceName,
          targetId: state.formData.targetName
        })
      }, 3000)
    } else {
      ElMessage.error('激光发射装备不可用!')
    }
  })
}

// 激光欺骗 调用攻击开火指令
const laserDeceptionFun = () => {
  let params = {
    pltName: state.formData.sourceName,
    tgtName: state.formData.targetName
  }
  atTarget(params).then((res) => {
    // console.log(res)
    beautyToast.success({
      title: '导调指令',
      message: '激光欺骗攻击指令已发出!',
      darkTheme: true
    })

    handleClose()
    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '激光欺骗攻击指令完成',
        state.formData.sourceName
      )
    }
  })
}

// 伴飞
const accompanyingFlightFun = () => {
  let params = {
    platName: state.formData.sourceName, // 当前平台
    accomPlatName: state.formData.targetName // 伴飞目标平台
  }
  accompanyingFlight(params).then((res) => {
    // console.log(res)
    beautyToast.success({
      title: '导调指令',
      message: '伴飞指令已发出!',
      darkTheme: true
    })

    handleClose()
    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '伴飞指令完成',
        state.formData.sourceName
      )
    }
  })
}

// 改变速度
const updateSpeedFun = () => {
  let params = {
    platform: state.formData.sourceName,
    changeSpeed: state.formData.changeSpeed
  }
  // console.log(params)
  setPlateformStatus(params).then((res) => {
    // console.log(res)
    const parsedData = JSON.parse(res.data)
    if (parsedData.status == 'success') {
      ElMessage.success('速度变更成功！')
    }
  })

  handleClose()

  // let params = {
  //   pltName: state.formData.sourceName, // 当前平台
  //   value: Number(state.formData.changeSpeed) // 值
  // }
  // updateSpeed(params).then((res) => {
  //   // console.log(res)
  //   beautyToast.success({
  //     title: '导调指令',
  //     message: '改变速度指令已发出!',
  //     darkTheme: true
  //   })

  //   handleClose()
  //   if (res.code == 200) {
  //     sendToCommandShowResMsg(
  //       res.data,
  //       '改变速度指令完成',
  //       state.formData.sourceName
  //     )
  //     if (window['curDivPoint_commContr_' + state.formData.sourceName]) {
  //       window[
  //         'curDivPoint_commContr_' + state.formData.sourceName
  //       ].closeEvent()
  //       window['curDivPoint_commContr_' + state.formData.sourceName] = null
  //     }
  //     let infors = store.state.sceneModule.currentFlyType
  //     let titleName = Object.keys(infors).length > 0 ? infors.name : ''
  //     let moreAndLess = ''
  //     if (
  //       Number(state.formData.changeSpeed) >
  //       Number(state.formData.originalSpeed)
  //     ) {
  //       moreAndLess = 'more'
  //     } else {
  //       moreAndLess = 'less'
  //     }
  //     new Bubble3({
  //       moreAndLess: moreAndLess,
  //       content: [
  //         { name: '名称', value: titleName },
  //         { name: '原始', value: Number(state.formData.originalSpeed) },
  //         { name: '目标', value: Number(state.formData.changeSpeed) },
  //         { name: '变更', value: state.formData.originalSpeed }
  //       ],
  //       viewer: window.EarthViewer,
  //       Cesium: window.MSIMEarth,
  //       id: state.formData.sourceName,
  //       name: state.formData.sourceName, //datasource
  //       title: '变更平台速度指令',
  //       offsetY: 100,
  //       distanceDisplayCondition: [100, 5000000],
  //       div: 'style'
  //     })
  //   }
  // })
}

// 改变航向
const updateHeadingFun = () => {
  let params = {
    platform: state.formData.sourceName,
    changeHeading: state.formData.heading
  }
  setPlateformStatus(params).then((res) => {
    const parsedData = JSON.parse(res.data)
    console.log(parsedData)
    if (parsedData.status == 'success') {
      ElMessage.success('航向变更成功！')
    }
  })

  handleClose()
}

// 变更传感器开关
const switchSensorFun = () => {
  let action = null
  state.formData.sensorStatusArr.forEach((e, index) => {
    state.currentSensor = e
    if (state.currentSensor.On) {
      action = 'on'
    } else {
      action = 'off'
    }
    let params = {
      platform: state.formData.sourceName,
      sensorAction: `{"sensorName":"${state.currentSensor.Name}","action":"${action}"}`
    }
    setPlateformStatus(params).then((res) => {
      return JSON.parse(res.data)
    })
  })
  ElMessage.success('变更成功！')
  handleClose()
}

// 销毁
const destroyTargetFun = () => {
  let params = {
    DeleteEntity: `{"name":"${state.formData.sourceName}"}`
  }
  setPlateformStatus(params).then((res) => {
    let parsedData = JSON.parse(res.data)
    if (parsedData.status == 'success') {
      ElMessage.success('销毁成功！')
      handleClose()
    }
  })
}

// 生成干扰弹接口(立即导调指令)
const generatingJammerFun = () => {
  let params = {
    fireName: state.formData.sourceName,
    targetName: state.formData.targetName
  }
  generatingJammer(params).then((res) => {
    // console.log(res)
    beautyToast.success({
      title: '导调指令',
      message: '生成干扰弹指令已发出!',
      darkTheme: true
    })

    handleClose()
    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '生成干扰弹指令完成',
        state.formData.sourceName
      )
    }
  })
}

// 变更烟雾干扰装置状态
const changeInfraredStateFun = () => {
  // 变更烟雾干扰装置状态指令接口
  let params = {
    pltName: state.formData.sourceName,
    value: state.formData.infraredStateValue
  }
  changeInfraredState(params).then((res) => {
    beautyToast.success({
      title: '导调指令',
      message: '变更烟雾干扰装置状态指令已发出!',
      darkTheme: true
    })

    handleClose()
    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '变更烟雾干扰装置状态指令完成',
        state.formData.sourceName
      )
    }
  })
}

// 发动机故障
const breakMoverFun = () => {
  let params = {
    pltName: state.formData.sourceName // 当前平台
  }
  breakMover(params).then((res) => {
    // console.log(res)
    beautyToast.success({
      title: '导调指令',
      message: '导调特情设置发动机故障指令已发出!',
      darkTheme: true
    })

    handleClose()
    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '导调特情设置发动机故障指令完成',
        state.formData.sourceName
      )
    }
  })
}

//油料缺失
const deficiencyFuelFun = () => {
  let params = {
    pltName: state.formData.sourceName // 当前平台
  }
  deficiencyFuel(params).then((res) => {
    // console.log(res)
    beautyToast.success({
      title: '导调指令',
      message: '导调特情设置油料缺失指令已发出!',
      darkTheme: true
    })

    handleClose()
    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '导调特情设置油料缺失指令完成',
        state.formData.sourceName
      )
    }
  })
}

//缺失弹药
const deficiencyWeaponQuantityFun = () => {
  let params = {
    pltName: state.formData.sourceName // 当前平台
  }
  deficiencyWeaponQuantity(params).then((res) => {
    // console.log(res)
    beautyToast.success({
      title: '导调指令',
      message: '导调特情设置缺失弹药指令已发出!',
      darkTheme: true
    })

    handleClose()
    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '导调特情设置缺失弹药指令完成',
        state.formData.sourceName
      )
    }
  })
}

//飞机起飞
const taskOffFun = () => {
  let params = {
    platFormName: state.formData.sourceName, // 当前平台
    airportName: state.formData.targetName,
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

    handleClose()
    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '飞机起飞指令完成',
        state.formData.sourceName
      )
    }
  })
}

const tempEntityDel = () => {
  // 删除连线以及鼠标提示信息
  for (let i = window.EarthViewer.entities.values.length - 1; i >= 0; i--) {
    let entity = window.EarthViewer.entities.values[i]
    if (entity && entity.name && entity.name.indexOf('点闪烁') > -1) {
      window.EarthViewer.entities.remove(entity) //移除
    }
  }
}

const removeEntityCircleById = (id) => {
  if (window.EarthViewer.entities.getById(id)) {
    window.EarthViewer.entities.removeById(id)
  }
}

const confirmSceneBySetTime = () => {
  // alert(111)
  console.log(state.formData.command)
  if (state.formData.command) confirmScene()
  // let time = parseFloat(state.seconds) * 60 * 1000
  // if (time === 0) {
  //   confirmScene()
  // } else {
  //   setTimeout(() => {
  //     confirmScene()
  //     ElMessage.success('计划导调成功')
  //   }, time)
  // }
}

const changeStatus = (item, index) => {
  state.formData.sensorStatusArr.push(item)
  console.log(state.formData.sensorStatusArr)
}

const confirmScene = () => {
  if (state.formData.command == '攻击指定位置') {
    if (!state.formData.weaponName) {
      beautyToast.warning({
        title: 'Warning',
        message: '请输入武器名称!',
        darkTheme: true
      })
      return false
    }
    if (Number(state.formData.num) > 0) {
      atPositionFun()
    } else {
      beautyToast.warning({
        title: 'Warning',
        message: '请武器数量为0,不可攻击!',
        darkTheme: true
      })
    }
  } else if (state.formData.command == '攻击自定义') {
    if (!state.formData.weaponName) {
      beautyToast.warning({
        title: 'Warning',
        message: '请输入武器名称!',
        darkTheme: true
      })
      return false
    }
    if (Number(state.formData.num) > 0) {
      byRawFun()
    } else {
      beautyToast.warning({
        title: 'Warning',
        message: '请武器数量为0,不可攻击!',
        darkTheme: true
      })
    }
  } else if (state.formData.command == '列表目标攻击') {
    if (!state.formData.targetName) {
      beautyToast.warning({
        title: 'Warning',
        message: '请选择虚兵名称!',
        darkTheme: true
      })
      return false
    }
    if (!state.formData.weaponName) {
      beautyToast.warning({
        title: 'Warning',
        message: '请输入武器名称!',
        darkTheme: true
      })
      return false
    }
    if (Number(state.formData.num) > 0) {
      byRawFun()
    } else {
      beautyToast.warning({
        title: 'Warning',
        message: '请武器数量为0,不可攻击!',
        darkTheme: true
      })
    }
  } else if (state.formData.command == '攻击') {
    if (!state.formData.weaponName) {
      beautyToast.warning({
        title: 'Warning',
        message: '请输入武器名称!',
        darkTheme: true
      })
      return false
    }
    if (Number(state.formData.num) > 0) {
      openFireFun()
    } else {
      beautyToast.warning({
        title: 'Warning',
        message: '请武器数量为0,不可攻击!',
        darkTheme: true
      })
    }
  } else if (state.formData.command == '攻击指定目标') {
    if (!state.formData.weaponName) {
      beautyToast.warning({
        title: 'Warning',
        message: '请输入武器名称!',
        darkTheme: true
      })
      return false
    }
    if (Number(state.formData.num) > 0) {
      atTargetFun()
    } else {
      beautyToast.warning({
        title: 'Warning',
        message: '请武器数量为0,不可攻击!',
        darkTheme: true
      })
    }
  } else if (state.formData.command == '攻击目标') {
    // afsim接口 攻击目标
    let isHave = true
    getPlatformInfo().then((res) => {
      for (let i = 0; i < res.length; i++) {
        if (res[i].type == state.formData.sourceName) {
          if (res[i].firstTask) {
            ElMessage.warning(
              state.formData.sourceName +
                '不能执行打击任务,正在执行' +
                res[i].firstTask +
                '任务'
            )
            handleClose()
            return
          }
        } else {
          isHave = false
        }
      }
      if (!isHave) {
        fireTargetFun()
      }
    })
  } else if (state.formData.command == '变更平台高度') {
    toAltitudeFun()
  } else if (state.formData.command == '移动平台到指定位置') {
    let isHave = true
    getPlatformInfo().then((res) => {
      for (let i = 0; i < res.length; i++) {
        if (res[i].type == state.formData.sourceName) {
          if (state.formData.height > res[i].maxHeight) {
            ElMessage.warning(state.formData.sourceName + '超过最大高度！')
            return
          }
        } else {
          isHave = false
        }
      }
      if (!isHave) {
        toPositionFun()
      }
    })
  } else if (state.formData.command == '立即改变位置') {
    setPositionFun()
  } else if (state.formData.command == '改变位置') {
    setPositionFun()
  } else if (state.formData.command == '移动平台到目标距离') {
    toTargetFun()
  } else if (state.formData.command == '变更平台传感器频率') {
    if (!state.formData.sensorName) {
      beautyToast.warning({
        title: 'Warning',
        message: '请输入传感器名称!',
        darkTheme: true
      })
      return false
    }
    toChangeFrequencyFun()
  } else if (state.formData.command == '变更平台传感器模式') {
    if (!state.formData.modeValue) {
      beautyToast.warning({
        title: 'Warning',
        message: '请选择传感器模式!',
        darkTheme: true
      })
      return false
    }
    toChangeModeFun()
  } else if (state.formData.command == '变更平台传感器状态') {
    if (!state.formData.stateValue) {
      beautyToast.warning({
        title: 'Warning',
        message: '请选择传感器状态!',
        darkTheme: true
      })
      return false
    }
    toChangeStateFun()
  } else if (state.formData.command == '变更平台干扰状态') {
    toFireTurnOnWeaponFun()
  } else if (state.formData.command == '激光定向干扰') {
    laserDirectedJammingFun()
  } else if (state.formData.command == '发送干扰弹') {
    generatingJammerFun()
  } else if (state.formData.command == '激光欺骗') {
    laserDeceptionFun()
  } else if (state.formData.command == '伴飞') {
    accompanyingFlightFun()
  } else if (state.formData.command == '变更平台速度') {
    let isHave = true
    getPlatformInfo().then((res) => {
      for (let i = 0; i < res.length; i++) {
        if (res[i].type == state.formData.sourceName) {
          console.log(state.formData.changeSpeed)
          console.log(res[i].maxSpeed)
          if (state.formData.changeSpeed > res[i].maxSpeed) {
            ElMessage.warning(
              state.formData.sourceName + '超过最大速度，会造成时间重叠！'
            )
            return
          }
        } else {
          isHave = false
        }
      }
      if (!isHave) {
        updateSpeedFun()
      }
    })
  } else if (state.formData.command == '变更航向') {
    updateHeadingFun()
  } else if (state.formData.command == '变更传感器开关') {
    switchSensorFun()
  } else if (state.formData.command == '销毁') {
    destroyTargetFun()
  } else if (state.formData.command == '变更烟雾干扰装置状态') {
    changeInfraredStateFun()
  } else if (state.formData.command == '发动机故障') {
    breakMoverFun()
  } else if (state.formData.command == '油料缺失') {
    deficiencyFuelFun()
  } else if (state.formData.command == '缺失弹药') {
    deficiencyWeaponQuantityFun()
  } else if (state.formData.command == '飞机起飞') {
    taskOffFun()
  } else if (state.formData.command == '变更弹药数量') {
    setWeaponNums()
  }
}

// 拾取起飞机场信息
const getAirportName = () => {}

// 武器选择改变
const changeWeapon = (valueData) => {
  if (valueData) {
    let curData = getArrValue(valueData, state.formData.weaponsArr)
    state.formData.weaponName = curData.name
    state.formData.quatRCount = curData.quatR ? curData.quatR : 0
    if (state.formData.command == '攻击') {
      if (!curData['pr']) {
        curData['pr'] = 160000
      }
      // 火力攻击范围 需要火力半径
      if (curData['pr'] && Number(curData['pr']) > 0) {
        //火力打击 范围删除
        removeEntityCircleById('operationalRadius1' + state.formData.sourceName)
        createEntityCircleFun(
          'operationalRadius1',
          Number(curData['pr']),
          [0, 255, 0, 0.3],
          true
        )
      }
    } else if (state.formData.command == '列表目标攻击') {
      if (!curData['pr']) {
        curData['pr'] = 160000
      }
      // 火力攻击范围 需要火力半径
      if (curData['pr'] && Number(curData['pr']) > 0) {
        //火力打击 范围删除
        removeEntityCircleById('operationalRadius1' + state.formData.sourceName)
        createEntityCircleFun(
          'operationalRadius1',
          Number(curData['pr']),
          [0, 255, 0, 0.3],
          true
        )
        const entityMethod = new window.EarthPlugn.entity({
          earth: window.MSIMEarth,
          viewer: window.EarthViewer
        })
        let entitySourceName = entityMethod.getCZMLEntity(
          state.formData.sourceName,
          'MSIMEarthCZMLProcessContainer'
        )
        let entityTargetName = entityMethod.getCZMLEntity(
          state.formData.targetName,
          'MSIMEarthCZMLProcessContainer'
        )
        if (
          window.MSIMEarth.defined(entityTargetName) &&
          window.MSIMEarth.defined(entitySourceName)
        ) {
          let postionSourceArr = getEititiesPostion(entitySourceName)
          let postionTargeArr = getEititiesPostion(entityTargetName)
          if (
            postionSourceArr &&
            postionSourceArr.length > 0 &&
            postionTargeArr &&
            postionTargeArr.length > 0
          ) {
            // 判断 点是否在火力攻击范围
            let isSideCircle2 = getIsInsideCircleByPoint(
              [postionSourceArr[0], postionSourceArr[1]],
              Number(curData['pr']),
              [postionTargeArr[0], postionTargeArr[1]]
            )
            if (!isSideCircle2) {
              //火力打击 范围删除
              removeEntityCircleById(
                'operationalRadius1' + state.formData.sourceName
              )
              beautyToast.warning({
                title: '导调指令',
                message: '您选择的目标已超出攻击范围!',
                darkTheme: true
              })
              return false
            }
          }
        }
      }
    }
  }
}

// 列表目标攻击 改变 - afSimId
const changeTargetNameList = (valueData) => {
  tempEntityDel()
  // 删除 流线连线
  if (state.formData.targetNameTemp) {
    window.sceneAction.connectLineManagement.removeCommControlLine({
      sourId: state.formData.sourceName,
      targetId: state.formData.targetNameTemp
    })
  }

  if (valueData) {
    state.formData.targetNameTemp = valueData
    sourceMbFlickerEntity(valueData)
    // 添加流线连线
    window.sceneAction.connectLineManagement.addCommConLineBySourTarget({
      sourId: state.formData.sourceName,
      targetId: state.formData.targetName,
      color: new window.MSIMEarth.Color(225 / 255, 179 / 255, 21 / 255, 1),
      show: true
    })
  }
}

// 火力范围
const createEntityCircleFun = (type, radius, color, isShowMaterial) => {
  window.sceneAction.planeCzmlManage.createEntityCircle({
    sourId: state.formData.sourceName,
    type: type,
    radius: radius,
    color: color,
    isShowMaterial: isShowMaterial
  })
}

//获取czml实体经纬度信息
const getEititiesPostion = (entitypath) => {
  let positionArr = entitypath.position._value
    ? entitypath.position._value
    : entitypath.position.getValue(window.EarthViewer.clock.currentTime)
  let entitiesCartographic =
    window.MSIMEarth.Cartographic.fromCartesian(positionArr)
  return [
    window.MSIMEarth.Math.toDegrees(entitiesCartographic.longitude),
    window.MSIMEarth.Math.toDegrees(entitiesCartographic.latitude),
    entitiesCartographic.height
  ]
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

// 变更弹药数量
const setWeaponNums = () => {
  let object_ = {
    weaponName: state.formData.weaponName,
    resupplyCount: state.formData.resupplyCount + ''
  }
  if (
    typeof state.formData.weaponName === 'undefined' ||
    state.formData.weaponName === ''
  ) {
    ElMessage.warning('请选择武器类型!')
    return
  }
  let params = {
    platform: state.formData.sourceName,
    resupplyAmmunition: JSON.stringify(object_)
  }
  setPlatformJam(params).then((res) => {
    if (res && res.data && JSON.parse(res.data).status == 'success') {
      ElMessage.success(
        `${store.state.sceneModule.currentFlyType.chineseName}的${state.formData.weaponName}弹药数量设置成功！`
      )
      // handleClose()
    } else {
      ElMessage.error('武器弹药数量设置失败！')
    }
  })
  handleClose()
}

// 武器选择变化
const weaponNameChange = (value) => {
  if (value == '' || value == null || value == undefined) {
    state.formData.resupplyCount = 0
  } else {
    for (let i = 0; i < state.weaponList.length; i++) {
      if (state.weaponList[i].Name == value) {
        state.formData.resupplyCount = state.weaponList[i].Quantity
      }
    }
  }
}
// 获取武器列表
const getWeaponList = () => {
  let params = { platform: state.formData.sourceName }
  getPlatformWeapons(params).then((res) => {
    if (res.status == 'success') {
      state.weaponList = res.data
    } else {
      ElMessage.error('获取武器装备列表失败！')
    }
  })
}

onMounted(() => {
  if (state.formData.command == '变更弹药数量') {
    getWeaponList()
  }
})
</script>

<style lang="less" scoped>
.commandControl-container {
  position: absolute;
  right: 22%;
  top: 41%;
  width: 300px;
  z-index: 101;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;

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

.SensorName {
  padding-top: 5px;

  .sensor_box {
    color: #fff;
    padding: 5px 8px;
    display: flex;
    width: 100%;

    .sensor_name {
      display: inline-block;
      width: 70px;
      text-align: left;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
  }
}

ul {
  padding: 0;
  margin: 0;
  margin-top: 20px;
  width: 100%;
}
</style>
