<template>
  <div
    class="data-container panelContextMenu animate__animated animate__fadeIn"
  >
    <div class="layerList">
      <div class="detail-container">
        <div class="container-main">
          <div class="item-title">
            {{ state2.entityTitle }}
          </div>
          <img
            src="@/assets/image/panelIcons/关闭icon.png"
            alt=""
            class="close_Sty"
            @click="handleClose"
          />
          <el-tabs
            type="border-card"
            v-model="state2.tabSelect"
            @tab-click="getCardTabs"
          >
            <el-tab-pane label="平台信息" name="显隐">
              <div class="checkedOption">
                <el-checkbox-group v-model="state2.commandVisibleRadio">
                  <div
                    v-for="(item, index) in state2.commandVisibleObj"
                    :key="index"
                    style="text-align: left"
                  >
                    <el-checkbox
                      :label="item.value"
                      @change="changeVisibleControl(item.value)"
                    >
                      {{ item.name }}
                    </el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
            </el-tab-pane>
            <el-tab-pane label="指令" name="指令" v-if="state2.isShowHuifang">
              <div class="checkedOption">
                <el-radio-group
                  v-model="state2.commandControlRadio"
                  @change="changeCommandControl"
                >
                  <el-radio
                    v-for="(item, index) in state2.commandControlObj"
                    :key="index"
                    :label="item.value"
                  >
                    {{ item.name }}
                  </el-radio>
                </el-radio-group>
              </div>
              <div
                v-if="state2.commandControlRadio.length > 0"
                class="redioBtnClar"
              >
                <el-button
                  type="primary"
                  size="small"
                  @click="clearCommandControl"
                  >取消</el-button
                >
              </div>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
  </div>
  <commandControl
    v-if="state2.commandControlIsShow"
    :commandFormData="state2.commandFormData"
  ></commandControl>
  <simModelControl
    v-if="state2.simModelCommandControlIsShow"
    :simModelCommandFormData="state2.simModelCommandFormData"
  >
  </simModelControl>
</template>

<script setup>
import { nextTick, onMounted, reactive, markRaw, watch } from 'vue'
// import store from '@/store'
import { useStore } from 'vuex'
import emitter from '@/utils/eventbus'
import commandControl from './commandControl.vue'
import simModelControl from './simModelControl.vue'
import { moveBtnPanel } from '@/utils/mapTools'
const store = useStore()
const state2 = reactive({
  inforList: [{ name: '名称', value: '战斗机' }],
  detailedSignage: true,
  existPath: true,
  existWack: true,
  existSensor: true,
  existWall: true,
  existSightFrame: true,
  existMissileLine: true,
  existOperationalRadius: true,
  existdetectionRadius: true,
  existfireRadius: true,
  existlinkInfos: true,
  existCommunicationRadius: true,
  existFirepowerRadius: true,
  existFrustum: true,
  existFullBandDisb: true,
  existNarrowBandDisb: true,
  LaserDesignatorState: false,
  LaserDesignatorStateState: true,
  fireAtPosition: true,
  fireAtTarget: true,
  fireByRaw: true,
  openFire: true,
  moveToAltitude: true,
  moveToPosition: true,
  setPosition: true,
  moveToTarget: true,
  sensorChangeFrequency: true,
  sensorChangeMode: true,
  sensorChangeState: true,
  getEMToolInfo: true,
  getNoiseMap: true,
  detailedSignageChecked: false,
  pathChecked: false,
  wackChecked: false,
  sensorChecked: false,
  wallChecked: false,
  frustumChecked: false,
  sightFrameChecked: false,
  missileLineChecked: false,
  operationalRadiusChecked: false,
  detectionRadiusChecked: false,
  fireRadiusChecked: false,
  linkInfosChecked: false,
  communicationRadiusChecked: false,
  firepowerRadiusChecked: false,
  narrowBandDisbChecked: false,
  fullBandDisbChecked: false,
  fireAtPositionChecked: false,
  fireAtTargetChecked: false,
  fireByRawChecked: false,
  openFireChecked: false,
  moveToAltitudeChecked: false,
  moveToPositionChecked: false,
  moveToTargetChecked: false,
  setPositionChecked: false,
  sensorChangeFrequencyChecked: false,
  sensorChangeModeChecked: false,
  sensorChangeStateChecked: false,
  getEMToolInfoChecked: false,
  getNoiseMapChecked: false,
  statusRadio: 'free',
  commandControlIsShow: false,
  simModelCommandControlIsShow: false,
  entityTitle: '战斗机',
  commandFormData: {
    command: '',
    sourceName: '',
    targetName: '',
    longitude: '',
    latitude: '',
    height: '',
    originalSpeed: '',
    weaponsArr: []
  },
  simModelCommandFormData: {
    command: '',
    sourceName: '',
    targetName: '',
    longitude: '',
    latitude: '',
    height: '',
    originalSpeed: '',
    changeSpeed: '', //速度
    headingAngle: 0 //航向
  },
  tabSelect:
    localStorage.getItem('systemTitle') !== '复盘回放' ? '指令' : '显隐',
  commandControlRadio: '',
  commandControlObj: [
    {
      name: '变更高度',
      value: 'moveToAltitude'
    },
    {
      name: '变更速度',
      value: 'moveToSpeedKMH'
    },
    {
      name: '变更航向',
      value: 'moveToHeading'
    },
    {
      name: '变更传感器开关',
      value: 'switchToSensor'
    },
    {
      name: '变更传感器模式',
      value: 'sensorChangeMode'
    },
    {
      name: '变更干扰机工作状态',
      value: 'fireTurnOnWeapon'
    },
    {
      name: '攻击目标',
      value: 'attackTarget'
    },
    {
      name: '弹药配置',
      value: 'setWeaponNum'
    }
  ],
  connectLineManage: null,
  entityConfigSum: 14,
  entityConfigCount: 0,
  isShowHuifang: localStorage.getItem('systemTitle') !== '复盘回放',
  simModelControlRadio: '',
  commandVisibleRadio: [],
  commandVisibleObj: [
    {
      name: '路径墙',
      value: 'entityWall'
    },
    {
      name: '尾迹',
      value: 'entityWack'
    },
    {
      name: '侦察半径',
      value: 'entityFrustum'
    },
    {
      name: '作战半径',
      value: 'operationalRadius'
    },
    {
      name: '火力半径',
      value: 'fireRadius'
    },
    {
      name: '链路信息',
      value: 'linkInfos'
    }
  ],
  isShowSimModel: false,
  isShowLianLuModel: false
})

onMounted(() => {
  state2.OldcommandControlObj = state2.commandControlObj
  state2.OldcommandVisibleObj = state2.commandVisibleObj
  //显示当前飞机状态属性信息
  showPlaneInfo(store.state.sceneModule.currentFlyType)
  emitOnListener()
  const sceneAction = new window.EarthPlugn.sceneAction({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  state2.LaserDesignatorState = store.getters.getShowLaser
  state2.connectLineManage = sceneAction.connectLineManagement
  moveBtnPanel('panelContextMenu')
})

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
  state2.entityTitle = infors.chineseName
  //过滤飞机详情字段
  //TODO:暂时不太清楚哪个字段为武器装备类型暂时先使用name作为类型
  controlFieldShowOrHide(state2.entityTitle)
}

// 激光干扰机工作状态
const LaserDesignatorStateChange1 = (value) => {
  store.commit('setShowLaser', state2.LaserDesignatorState)
  emitter.emit('LaserDesignatorStateChange1', state2.LaserDesignatorState)
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
  filterDetailsField(fieldSetting, 'commandControlObj')
  //过滤显隐
  filterDetailsField(fieldSetting, 'commandVisibleObj')
  controlFieldCheck()
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

/**
 * @description 控制字段选中方法
 */
const controlFieldCheck = () => {
  //设置指令
  checkDetailsField('commandVisibleRadio')
}

/**
 * @description 控制字段选中方法
 * @param { String } Radio vuedata中选中的数据源名称
 */
const checkDetailsField = (Radio) => {
  state2[Radio] = []
  let entityId = store.state.sceneModule.currentFlyType.entityId
  if (
    store.state.targetDetailsCheck[entityId] &&
    store.state.targetDetailsCheck[entityId].length > 0
  ) {
    state2[Radio] = store.state.targetDetailsCheck[entityId]
  }
}
/**
 * @description 点击时获取当前tab页
 * @param { Object } name 标签对象
 */
let getCardTabs = (name) => {
  emitter.emit('clearCommandControl', state2.commandControlRadio)
  state2.commandControlRadio = ''
  state2.commandSpecialRadio = ''

  emitter.emit('clearSimModelCommandControl', state2.simModelControlRadio)
  state2.simModelControlRadio = ''
}
const emitOnListener = () => {
  //监听是否显示
  emitter.on('existWack', (value) => {
    state2.existWack = value
  })
  emitter.on('existWall', (value) => {
    state2.existWall = value
  })
  emitter.on('existOperationalRadius', (value) => {
    state2.existOperationalRadius = value
  })
  emitter.on('existdetectionRadius', (value) => {
    state2.existdetectionRadius = value
  })
  emitter.on('existfireRadius', (value) => {
    state2.existfireRadius = value
  })
  emitter.on('existlinkInfos', (value) => {
    state2.existlinkInfos = value
  })
  //监听是否选中
  emitter.on('wackChecked', (value) => {
    state2.wackChecked = value
  })
  emitter.on('wallChecked', (value) => {
    state2.wallChecked = value
  })
  emitter.on('operationalRadiusChecked', (value) => {
    state2.operationalRadiusChecked = value
  })
  emitter.on('detectionRadiusChecked', (value) => {
    state2.detectionRadiusChecked = value
  })
  emitter.on('fireRadiusChecked', (value) => {
    state2.fireRadiusChecked = value
  })
  emitter.on('linkInfosChecked', (value) => {
    state2.linkInfosChecked = value
  })

  emitter.on('showCommandControl', (value) => {
    state2.commandControlIsShow = value.isShow
    if (value.isShow) {
      state2.commandFormData.command = value.commandFormData.command
      state2.commandFormData.sourceName = value.commandFormData['sourceName']
      state2.commandFormData.targetName = value.commandFormData['targetName']
      state2.commandFormData.longitude = value.commandFormData['longitude']
      state2.commandFormData.latitude = value.commandFormData['latitude']
      state2.commandFormData.height = value.commandFormData['height']
      state2.commandFormData.Heading = value.commandFormData['Heading']
      state2.commandFormData.originalSpeed =
        value.commandFormData['originalSpeed']
      state2.commandFormData.weaponsArr = value.commandFormData['weaponsArr']
      state2.commandFormData['sensoresArr'] =
        value.commandFormData['sensoresArr']
      state2.commandFormData['turnIsOpenStateValue'] =
        value.commandFormData['turnIsOpenStateValue']
      state2.commandFormData['infraredSign'] =
        value.commandFormData['infraredSign']
      state2.commandFormData['sensorArr'] = value.commandFormData['sensorArr']
    }
  })
  
  // 清空单选
  emitter.on('clearRedioData', () => {
    state2.commandControlRadio = ''
    state2.commandSpecialRadio = ''
  })
  
}
const handleClose = () => {
  emitter.emit('showConfigPanel', false)
  emitter.emit('clearCommandControl', state2.commandControlRadio)
  emitter.emit('setMoreChecked', false)
}
const changeCommandControl = (value) => {
  emitter.emit('clearCommandControl', state2.commandControlRadio)
  if (value) {
    emitter.emit(value + 'Change1', true)
  }
}
/**
 * @description 显隐所有方法调用集合 并记录勾选状态
 * @param { String } value 勾选value值
 */
const changeVisibleControl = (value) => {
  let isHave = state2.commandVisibleRadio.includes(value)
  emitter.emit(value + 'Change1', isHave)
  let entityId = store.state.sceneModule.currentFlyType.entityId
  let newtargetDetailsCheck = store.state.targetDetailsCheck
  if (!newtargetDetailsCheck[entityId]) {
    newtargetDetailsCheck[entityId] = []
  }
  newtargetDetailsCheck[entityId] = state2.commandVisibleRadio
  store.commit('setTargetDetailsCheck', newtargetDetailsCheck)
}

const clearCommandControl = () => {
  emitter.emit('clearCommandControl', state2.commandControlRadio)
  state2.commandControlRadio = ''
}
const clearSimModelCommandControl = () => {
  emitter.emit('clearSimModelCommandControl', state2.simModelControlRadio)
  state2.simModelControlRadio = ''
}
// 深度监听
watch(
  () => store.state.sceneModule.currentFlyType,
  (newValue, oldValue) => {
    showPlaneInfo(newValue)
  },
  { deep: true }
)


</script>

<style lang="less" scoped>
.data-container {
  position: absolute;
  right: 6%;
  top: 24%;
  // // right: 10px;
  margin-top: 0px;
  // height: 420px;
  // width: 8vw;
  width: 290px;
  z-index: 9999;

  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: block;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  .layerList {
    height: 97%;
    //width: 100%;
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;

    .detail-container {
      position: absolute;
      //right: calc(17vw + 6%);
      top: 0;
      // width: 150px;
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

      .container-main {
        padding: 10px;
        height: 97%;
        // width: 100%;
        width: 350px;
        background: rgba(2, 26, 70, 0.88);
        box-shadow: 0 0 25px #1092d5;

        .item-title {
          text-align: left;
          animation: ZoomIn 0.4s;
          font-size: 20px;
          font-weight: 500;
          color: #00c7fb;
          display: flex;
          align-items: center;
          margin: 5px 10px;
          font-family: sans-serif;

          &::before {
            content: '';
            display: inline-block;
            width: 4px;
            height: 20px;
            margin-right: 5px;
            background: #1092d5;
          }
        }

        .close_Sty {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 10px;
          right: 20px;
          cursor: pointer;
        }

        .el-radio-group {
          display: inline-flex;
          align-items: flex-start;
          font-size: 0;
          flex-direction: column;
          padding: 0;
          float: left;
        }

        .type-infor {
          ul {
            padding: 0;

            li {
              text-align: left;
              color: #11b5ec;
              font-size: 14px;

              label {
                margin-right: 20px;
              }
            }
          }
        }
      }
    }
  }

  .el-tree {
    font-size: 15px;
    // margin-top: 20px;
    height: 100% !important;
    width: 95%;
    background: transparent;
    color: #e9fcfd;
    overflow-y: auto;
    box-sizing: border-box;
    padding-left: 8%;
  }

  .buttonTitle {
    width: 100%;
    text-align: left;
    font-size: 16px;
    font-weight: 500;
    color: #00c7fb;
  }

  .checkedOption {
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .redioBtnClar {
    position: absolute;
    top: 10px;
    right: 10px;
  }

  .setView {
    height: 8%;
    // position: absolute;
    // bottom: 0;

    .el-radio {
      margin-right: 10px;
    }

    .check-box {
      text-align: right;
      padding-right: 14px;
      display: inline-block;
      margin-left: 6px;
    }

    /deep/ .el-select {
      height: 20px;

      .el-input__wrapper {
        background: rgba(0, 0, 0, 0.2);

        .el-input__inner {
          color: #fff;
        }
      }
    }
  }

  /*滚动条高宽度*/
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  /*滚动条滑块*/
  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(48, 50, 53, 0.7);
  }

  /*滚动条里面轨道*/
  ::-webkit-scrollbar-track {
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2) inset;
  }

  /*滚动条的小边角*/
  ::-webkit-scrollbar-corner {
    background: transparent;
  }
}

//去掉父级的复选框
:deep(.root-node > .el-tree-node__content) {
  .el-checkbox {
    display: none;
  }
}

:deep .el-radio__inner {
  background-color: rgba(17, 181, 236, 0.5);
  border: 1px solid #11b5ec;
}

:deep .el-radio {
  color: #11b5ec;
}

:deep .el-checkbox {
  color: #11b5ec !important;
}

:deep .el-checkbox__inner {
  background-color: rgba(17, 181, 236, 0.5);
  border: 1px solid #11b5ec;
  border-radius: 50%;
  color: #11b5ec;
}

:deep .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: rgba(17, 181, 236, 0.5);
  color: rgba(17, 181, 236, 1);
}

:deep .el-checkbox__input.is-disabled .el-checkbox__inner {
  background-color: rgba(17, 181, 236, 0.5);
  color: rgba(17, 181, 236, 1);
  border-color: rgba(17, 181, 236, 1);
}

:deep .el-checkbox__input.is-disabled {
  background-color: rgba(17, 181, 236, 0.5);
  color: rgba(17, 181, 236, 1);
}

:deep .el-tree-node {
  margin-top: 10px;
}

:deep .el-tree-node__content:hover,
.el-upload-list__item:hover {
  background-color: rgba(17, 181, 236, 0.5);
}

:deep .el-tree-node .is-current > .el-tree-node__content {
  background-color: rgba(17, 181, 236, 0.5);
}

:deep .el-tree-node:focus > .el-tree-node__content {
  background-color: rgba(17, 181, 236, 0.5);
}

:deep el-tree-node__expand-icon el-icon-caret-right:before {
  color: rgba(17, 181, 236, 1);
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
  margin-top: 14px;
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
</style>
