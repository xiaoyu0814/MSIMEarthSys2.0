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
          <!-- <div class="type-infor">
            <ul>
              <li v-for="(item, index) in state2.inforList" :key="index">
                <label>{{ item.name }}：</label><span>{{ item.value }}</span>
              </li>
            </ul>
          </div> -->
          <el-tabs
            type="border-card"
            v-model="state2.tabSelect"
            @tab-click="getCardTabs"
          >
            <!-- <el-tab-pane label="视角配置" name="视角配置">
              <el-radio-group
                v-model="state2.statusRadio"
                @change="changeSelected1"
              >
                <el-radio label="first">第一视角</el-radio>
                <el-radio label="three">第三视角</el-radio>
                <el-radio label="lockEntity">锁定实体</el-radio>
                <el-radio label="free">自由视角</el-radio>
                <el-radio label="viewAngle">观看视角</el-radio>
              </el-radio-group>
            </el-tab-pane> -->
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
            <el-tab-pane
              label="模拟器"
              name="模拟器"
              v-if="state2.isShowSimModel"
            >
              <div class="checkedOption">
                <el-radio-group
                  v-model="state2.simModelControlRadio"
                  @change="changeCommandControl"
                >
                  <el-radio
                    v-for="(item, index) in state2.simModelControlObj"
                    :key="index"
                    :label="item.value"
                  >
                    {{ item.name }}
                  </el-radio>
                </el-radio-group>
              </div>
              <div
                v-if="state2.simModelControlRadio.length > 0"
                class="redioBtnClar"
              >
                <el-button
                  type="primary"
                  size="small"
                  @click="clearSimModelCommandControl"
                  >取消</el-button
                >
              </div>
            </el-tab-pane>
            <!--这里解开特情就能显示-->
            <!-- <el-tab-pane label="特情" name="特情" v-if="state2.isShowHuifang">
              <div class="checkedOption">
                <el-radio-group
                  v-model="state2.commandSpecialRadio"
                  @change="changeCommandControl"
                >
                  <el-radio
                    v-for="(item, index) in state2.commandSpecialObj"
                    :key="index"
                    :label="item.value"
                  >
                    {{ item.name }}
                  </el-radio>
                </el-radio-group>
              </div>
            </el-tab-pane> -->
            <el-tab-pane
              label="链路↓"
              name="链路↓"
              v-if="state2.isShowLianLuModel"
            >
              <div class="checkedOption">
                <el-checkbox-group v-model="state2.commandinCommingCheck">
                  <div
                    v-for="(item, index) in state2.commandinCommingObj"
                    :key="index"
                    style="text-align: left"
                  >
                    <el-checkbox
                      :label="item.value"
                      @change="commandinCommingControl(item.value)"
                    >
                      {{ item.name }}
                    </el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
            </el-tab-pane>
            <el-tab-pane
              label="链路↑"
              name="链路↑"
              v-if="state2.isShowLianLuModel"
            >
              <div class="checkedOption">
                <el-checkbox-group v-model="state2.ommandinOutGoingCheck">
                  <div
                    v-for="(item, index) in state2.commandinOutGoingObj"
                    :key="index"
                    style="text-align: left"
                  >
                    <el-checkbox
                      :label="item.value"
                      @change="commandinOutGoingControl(item.value)"
                    >
                      {{ item.name }}
                    </el-checkbox>
                  </div>
                </el-checkbox-group>
              </div>
            </el-tab-pane>
          </el-tabs>

          <!-- <div class="buttonTitle">视角配置：</div> -->
          <!-- <div class="buttonTitle">显隐配置：</div> -->
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
    // {
    //   name: '攻击指定位置',
    //   value: 'fireAtPosition'
    // },
    // { name: '攻击指定目标', value: 'fireAtTarget' },
    // {
    //   name: '攻击自定义指令',
    //   value: 'fireByRaw'
    // },
    // {
    //   name: '攻击',
    //   value: 'openFire'
    // },
    // {
    //   name: '变更高度',
    //   value: 'moveToAltitude'
    // },
    // {
    //   name: '变更到指定位置',
    //   value: 'moveToPosition'
    // },
    // {
    //   name: '改变位置',
    //   value: 'setPosition'
    // },
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
    // {
    //   name: '变更到目标距离',
    //   value: 'moveToTarget'
    // },
    // {
    //   name: '变更传感器频率',
    //   value: 'sensorChangeFrequency'
    // },
    {
      name: '变更传感器模式',
      value: 'sensorChangeMode'
    },
    // {
    //   name: '变更雷达工作状态',
    //   value: 'sensorChangeState'
    // },
    {
      name: '变更干扰机工作状态',
      value: 'fireTurnOnWeapon'
    },
    {
      name: '攻击目标',
      value: 'attackTarget'
    },
    {
      name: '销毁',
      value: 'destroyTarget'
    }
    // {
    //   name: '变更弹药数量',
    //   value: 'setWeaponNum'
    // }
    // {
    //   name: '发送干扰弹',
    //   value: 'generatingJammer'
    // },
    // {
    //   name: '激光定向干扰',
    //   value: 'laserDirectedJamming'
    // },
    // {
    //   name: '激光欺骗',
    //   value: 'laserDeception'
    // },
    // {
    //   name: '变更烟雾干扰装置状态',
    //   value: 'changeInfraredState'
    // },
    // {
    //   name: '伴飞',
    //   value: 'accompanyingFlight'
    // },
    // {
    //   name: '飞机起飞',
    //   value: 'taskOff'
    // }
    // {
    //   name: '语音控制',
    //   value: 'ShowVoice'
    // }
  ],
  commandSpecialRadio: '',
  commandSpecialObj: [
    {
      name: '发动机故障',
      value: 'breakMover'
    },
    {
      name: '油料缺失',
      value: 'deficiencyFuel'
    },
    {
      name: '缺失弹药',
      value: 'deficiencyWeaponQuantity'
    }
  ],
  inComming: {
    detectChecked: false,
    SensorTrackChecked: false,
    localTrackChecked: false,
    jamChecked: false,
    fireChecked: false,
    killChecked: false,
    commChecked: false,
    taskChecked: false
  },
  outGoing: {
    detectChecked: false,
    SensorTrackChecked: false,
    localTrackChecked: false,
    jamChecked: false,
    fireChecked: false,
    killChecked: false,
    commChecked: false,
    taskChecked: false
  },
  connectLineManage: null,
  entityConfigSum: 14,
  entityConfigCount: 0,
  isShowHuifang: localStorage.getItem('systemTitle') !== '复盘回放',
  simModelControlRadio: '',
  simModelControlObj: [
    {
      name: '运控',
      value: 'controlOrder'
    },
    {
      name: '集合',
      value: 'gatherAround'
    },
    {
      name: '机场气象',
      value: 'airPortWeather'
    }
    // {
    //   name: '海洋海况',
    //   value: 'ocean'
    // }
  ],
  commandVisibleRadio: [],
  commandVisibleObj: [
    {
      name: '路径',
      value: 'pathCheck'
    },
    {
      name: '路径墙',
      value: 'entityWall'
    },
    {
      name: '尾迹',
      value: 'entityWack'
    },
    {
      name: '航线',
      value: 'planLine'
    },
    // {
    //   name: '瞄准框',
    //   value: 'sightFrame'
    // },
    // {
    //   name: '导弹线',
    //   value: 'missileLine'
    // },
    // {
    //   name: '作战半径',
    //   value: 'operationalRadius'
    // },
    // {
    //   name: '防空范围',
    //   value: 'fkfw'
    // },
    // {
    //   name: '感知能力',
    //   value: 'entityFrustum'
    // },
    // {
    //   name: '通信半径',
    //   value: 'communicationRadius'
    // },
    {
      name: '卫星开机',
      value: 'satelliteTurnOn'
    }
    // {
    //   name: '火力半径',
    //   value: 'communicationRadius'
    // },
    // {
    //   name: '传感器范围',
    //   value: 'entitySensor'
    // },
    // {
    //   name: '干扰范围(全频)',
    //   value: 'fullBandDisb'
    // },
    // {
    //   name: '干扰范围(窄带)',
    //   value: 'narrowBandDisb'
    // },
    // {
    //   name: '雷达覆盖与探测可能性图',
    //   value: 'getEMToolInfo'
    // },
    // {
    //   name: '杂波图',
    //   value: 'getNoiseMap'
    // },
    // {
    //   name: '激光干扰机工作状态',
    //   value: 'LaserDesignatorState'
    // }
  ],
  commandinCommingCheck: [],
  commandinCommingObj: [
    {
      name: '雷达探测',
      value: 'InDetectChange'
    },
    {
      name: '传感器追踪',
      value: 'InSensorChange'
    },
    {
      name: '局域追踪',
      value: 'InLocalChange'
    },
    {
      name: '火力打击',
      value: 'InFireChange'
    },
    {
      name: '电磁干扰',
      value: 'InJamChange'
    },
    {
      name: '网络通信',
      value: 'InCommChange'
    },
    {
      name: '任务关联',
      value: 'InTaskChange'
    }
  ],
  ommandinOutGoingCheck: [],
  commandinOutGoingObj: [
    {
      name: '雷达探测',
      value: 'OutDetectChange'
    },
    {
      name: '传感器追踪',
      value: 'OutSensorChange'
    },
    {
      name: '局域追踪',
      value: 'OutLocalChange'
    },
    {
      name: '火力打击',
      value: 'OutFireChange'
    },
    {
      name: '电磁干扰',
      value: 'OutJamChange'
    },
    {
      name: '网络通信',
      value: 'OutCommChang'
    },
    {
      name: '任务关联',
      value: 'OutTaskChange'
    }
  ],
  isShowSimModel: false,
  isShowLianLuModel: false
  // isShowSimModel:
  // localStorage.getItem('systemTitle') !== '复盘回放' &&
  // store.state.sceneModule.currentNode.code == 'green'
})

onMounted(() => {
  state2.OldcommandControlObj = state2.commandControlObj
  state2.OldcommandSpecialObj = state2.commandSpecialObj
  state2.OldsimModelControlObj = state2.simModelControlObj
  state2.OldcommandVisibleObj = state2.commandVisibleObj
  state2.OldcommandinCommingObj = state2.commandinCommingObj
  state2.OldcommandinOutGoingObj = state2.commandinOutGoingObj
  //显示当前飞机状态属性信息
  showPlaneInfo(store.state.sceneModule.currentFlyType)
  showEntityConfig(store.state.sceneModule.entityLinkConfig)
  emitOnListener()
  const sceneAction = new window.EarthPlugn.sceneAction({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  state2.LaserDesignatorState = store.getters.getShowLaser
  state2.connectLineManage = sceneAction.connectLineManagement
  moveBtnPanel('panelContextMenu')
})
simModelList.forEach((item) => {
  console.log('更多', item)
  if (store.state.sceneModule.currentNode.code == item.value) {
    state2.isShowSimModel = true
  } else {
    state2.isShowSimModel = false
  }
})
console.log('更多中模拟器', state2.isShowSimModel)
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
  //过滤特情
  filterDetailsField(fieldSetting, 'commandSpecialObj')
  //过滤模拟器
  filterDetailsField(fieldSetting, 'simModelControlObj')
  //过滤显隐
  filterDetailsField(fieldSetting, 'commandVisibleObj')
  //链路↓
  filterDetailsField(fieldSetting, 'commandinCommingObj')
  //链路↑
  filterDetailsField(fieldSetting, 'commandinOutGoingObj')
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
const showEntityConfig = (configData) => {
  let config = configData
  if (configData) {
    let commandinCommingCheck = []
    let ommandinOutGoingCheck = []
    state2.commandinCommingObj.forEach((element) => {
      commandinCommingCheck.push(element.value)
    })
    state2.commandinOutGoingObj.forEach((element) => {
      ommandinOutGoingCheck.push(element.value)
    })
    state2.commandinCommingCheck = commandinCommingCheck
    state2.ommandinOutGoingCheck = ommandinOutGoingCheck
  }
  // state2.inComming.detectChecked = config
  // state2.outGoing.detectChecked = config

  // state2.inComming.SensorTrackChecked = config
  // state2.outGoing.SensorTrackChecked = config

  // state2.inComming.localTrackChecked = config
  // state2.outGoing.localTrackChecked = config

  // state2.inComming.jamChecked = config
  // state2.outGoing.jamChecked = config

  // state2.inComming.fireChecked = config
  // state2.outGoing.fireChecked = config

  // state2.inComming.killChecked = config
  // state2.outGoing.killChecked = config

  // state2.inComming.commChecked = config
  // state2.outGoing.commChecked = config

  // state2.inComming.taskChecked = config
  // state2.outGoing.taskChecked = config
  if (config) state2.entityConfigCount = state2.entityConfigSum
  else state2.entityConfigCount = 0
}
const emitOnListener = () => {
  //监听是否显示
  emitter.on('existPath', (value) => {
    state2.existPath = value
  })
  emitter.on('existWack', (value) => {
    state2.existWack = value
  })
  emitter.on('existSensor', (value) => {
    state2.existSensor = value
  })
  emitter.on('existWall', (value) => {
    state2.existWall = value
  })
  emitter.on('existSightFrame', (value) => {
    state2.existSightFrame = value
  })
  emitter.on('existMissileLine', (value) => {
    state2.existMissileLine = value
  })
  emitter.on('existOperationalRadius', (value) => {
    state2.existOperationalRadius = value
  })
  emitter.on('existCommunicationRadius', (value) => {
    state2.existCommunicationRadius = value
  })
  emitter.on('existFirepowerRadius', (value) => {
    state2.existFirepowerRadius = value
  })
  emitter.on('existFrustum', (value) => {
    state2.existFrustum = value
  })
  emitter.on('existFullBandDisb', (value) => {
    state2.existFullBandDisb = value
  })
  emitter.on('existNarrowBandDisb', (value) => {
    state2.existNarrowBandDisb = value
  })
  emitter.on('existFrustum', (value) => {
    state2.existFrustum = value
  })
  emitter.on('fireAtPosition', (value) => {
    state2.fireAtPosition = value
  })
  //监听是否选中
  emitter.on('pathChecked', (value) => {
    state2.pathChecked = value
  })
  emitter.on('wackChecked', (value) => {
    state2.wackChecked = value
  })
  emitter.on('sensorChecked', (value) => {
    state2.sensorChecked = value
  })
  emitter.on('frustumChecked', (value) => {
    state2.frustumChecked = value
  })
  emitter.on('wallChecked', (value) => {
    state2.wallChecked = value
  })
  emitter.on('sightFrameChecked', (value) => {
    state2.sightFrameChecked = value
  })
  emitter.on('missileLineChecked', (value) => {
    state2.missileLineChecked = value
  })
  emitter.on('operationalRadiusChecked', (value) => {
    state2.operationalRadiusChecked = value
  })
  emitter.on('communicationRadiusChecked', (value) => {
    state2.communicationRadiusChecked = value
  })
  emitter.on('firepowerRadiusChecked', (value) => {
    state2.firepowerRadiusChecked = value
  })
  emitter.on('narrowBandDisbChecked', (value) => {
    state2.narrowBandDisbChecked = value
  })
  emitter.on('fullBandDisbChecked', (value) => {
    state2.fullBandDisbChecked = value
  })
  emitter.on('fireAtPositionChecked', (value) => {
    state2.fireAtPositionChecked = value
  })
  // emitter.off('showCommandControl')
  // 指令控制弹窗显示
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
  // 模拟器指令控制弹窗显示
  emitter.on('showSimModelCommandControl', (value) => {
    state2.simModelCommandControlIsShow = value.isShow
    if (value.isShow) {
      state2.simModelCommandFormData = value.simModelCommandFormData
    }
  })
  // 清空单选
  emitter.on('clearRedioData', () => {
    state2.commandControlRadio = ''
    state2.commandSpecialRadio = ''
  })
  // 模拟器导调清空单选
  emitter.on('clearSimModelRadioData', () => {
    state2.simModelControlRadio = ''
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
/**
 * @description 链路↑所有方法调用集合
 * @param { String } value 勾选value值
 */
const commandinOutGoingControl = (value) => {
  let isHave = state2.ommandinOutGoingCheck.includes(value)
  entityInFunctionObj['entity' + value](isHave)
}
/**
 * @description 链路↓所有方法调用集合
 * @param { String } value 勾选value值
 */
const commandinCommingControl = (value) => {
  let isHave = state2.ommandinOutGoingCheck.includes(value)
  entityInFunctionObj['entity' + value](isHave)
}

const clearCommandControl = () => {
  emitter.emit('clearCommandControl', state2.commandControlRadio)
  state2.commandControlRadio = ''
}
const clearSimModelCommandControl = () => {
  emitter.emit('clearSimModelCommandControl', state2.simModelControlRadio)
  state2.simModelControlRadio = ''
}
const entityConfig = (itemcheck) => {
  let entityId = store.state.sceneModule.currentFlyType.entityId
  if (itemcheck) {
    state2.entityConfigCount += 1
    if (state2.entityConfigCount >= state2.entityConfigSum) {
      emitter.emit('setLinkChecked', true)
      store.state.sceneModule.entityLinkConfigList.push(entityId)
    } else {
      emitter.emit('setLinkChecked', false)
      let index = store.state.sceneModule.entityLinkConfigList.indexOf(entityId)
      if (index > -1) {
        store.state.sceneModule.entityLinkConfigList.splice(index, 1)
      }
    }
  } else {
    state2.entityConfigCount -= 1
    emitter.emit('setLinkChecked', false)
    let index = store.state.sceneModule.entityLinkConfigList.indexOf(entityId)
    if (index > -1) {
      store.state.sceneModule.entityLinkConfigList.splice(index, 1)
    }
  }
}

let entityInFunctionObj = {}
entityInFunctionObj.entityInDetectChange = (value) => {
  state2.inComming.detectChecked = value
  state2.connectLineManage.showEntityByTwoKeyword(
    'RE_SDC',
    store.state.sceneModule.currentFlyType.entityId,
    value
  )
  entityConfig(state2.inComming.detectChecked)
}
entityInFunctionObj.entityInSensorChange = (value) => {
  state2.inComming.SensorTrackChecked = value
  console.log('是这里吗', store.state.sceneModule.currentFlyType.entityId)
  state2.connectLineManage.showEntityByTwoKeyword(
    'RE_STrackInit',
    store.state.sceneModule.currentFlyType.entityId,
    value
  )
  entityConfig(state2.inComming.SensorTrackChecked)
}

entityInFunctionObj.entityInLocalChange = (value) => {
  state2.inComming.localTrackChecked = value
  state2.connectLineManage.showEntityByTwoKeyword(
    'RE_LTrackInit',
    store.state.sceneModule.currentFlyType.entityId,
    value
  )
  entityConfig(state2.inComming.localTrackChecked)
}

entityInFunctionObj.entityInFireChange = (value) => {
  state2.inComming.fireChecked = value
  state2.connectLineManage.showEntityByTwoKeyword(
    'RE_WeaponF',
    store.state.sceneModule.currentFlyType.entityId,
    value
  )
  state2.connectLineManage.showEntityByTwoKeyword(
    'distancelabel',
    store.state.sceneModule.currentFlyType.entityId,
    value
  )
  entityConfig(state2.inComming.fireChecked)
}

entityInFunctionObj.entityInJamChange = (value) => {
  state2.inComming.jamChecked = value
  state2.connectLineManage.showEntityByTwoKeyword(
    'RE_JamA',
    store.state.sceneModule.currentFlyType.entityId,
    value
  )
  entityConfig(state2.inComming.jamChecked)
}

entityInFunctionObj.entityInCommChange = (value) => {
  state2.inComming.commChecked = value
  state2.connectLineManage.showEntityByTwoKeyword(
    'RE_MR',
    store.state.sceneModule.currentFlyType.entityId,
    value
  )
  entityConfig(state2.inComming.commChecked)
}

entityInFunctionObj.entityInTaskChange = (value) => {
  state2.inComming.taskChecked = value
  state2.connectLineManage.showEntityByTwoKeyword(
    'Task_Aign',
    store.state.sceneModule.currentFlyType.entityId,
    value
  )
  entityConfig(state2.inComming.taskChecked)
}

entityInFunctionObj.entityInKillChange = (value) => {
  state2.inComming.killChecked = value
  state2.connectLineManage.showEntityByTwoKeyword(
    'RE_WeaponWH',
    store.state.sceneModule.currentFlyType.entityId,
    value
  )
  entityConfig(state2.inComming.killChecked)
}

entityInFunctionObj.entityOutDetectChange = (value) => {
  state2.outGoing.detectChecked = value
  let linkId = `RE_SDC==${store.state.sceneModule.currentFlyType.entityId}==`
  state2.connectLineManage.showEntityByKeyword(linkId, value)
  entityConfig(state2.outGoing.detectChecked)
}

entityInFunctionObj.entityOutSensorChange = (value) => {
  state2.outGoing.SensorTrackChecked = value
  console.log('还是这里', store.state.sceneModule.currentFlyType.entityId)
  let linkId = `RE_STrackInit==${store.state.sceneModule.currentFlyType.entityId}==`
  state2.connectLineManage.showEntityByKeyword(linkId, value)
  entityConfig(state2.outGoing.SensorTrackChecked)
}

entityInFunctionObj.entityOutLocalChange = (value) => {
  state2.outGoing.localTrackChecked = value
  let linkId = `RE_LTrackInit==${store.state.sceneModule.currentFlyType.entityId}==`
  state2.connectLineManage.showEntityByKeyword(linkId, value)
  entityConfig(state2.outGoing.localTrackChecked)
}

entityInFunctionObj.entityOutFireChange = (value) => {
  state2.outGoing.fireChecked = value
  let linkId = `RE_WeaponF==${store.state.sceneModule.currentFlyType.entityId}==`
  let labelId = `distancelabel==${store.state.sceneModule.currentFlyType.entityId}==`
  state2.connectLineManage.showEntityByKeyword(linkId, value)
  state2.connectLineManage.showEntityByKeyword(labelId, value)
  entityConfig(state2.outGoing.fireChecked)
}

entityInFunctionObj.entityOutJamChange = (value) => {
  state2.outGoing.jamChecked = value
  let linkId = `RE_JamA==${store.state.sceneModule.currentFlyType.entityId}==`
  state2.connectLineManage.showEntityByKeyword(linkId, value)
  entityConfig(state2.outGoing.jamChecked)
}

entityInFunctionObj.entityOutCommChange = (value) => {
  state2.outGoing.commChecked = value
  let linkId = `RE_MR==${store.state.sceneModule.currentFlyType.entityId}==`
  state2.connectLineManage.showEntityByKeyword(linkId, value)
  entityConfig(state2.outGoing.commChecked)
}

entityInFunctionObj.entityOutTaskChange = (value) => {
  state2.outGoing.taskChecked = value
  let linkId = `Task_Aign==${store.state.sceneModule.currentFlyType.entityId}==`
  state2.connectLineManage.showEntityByKeyword(linkId, value)
  entityConfig(state2.outGoing.taskChecked)
}

entityInFunctionObj.entityOutKillChange = (value) => {
  state2.outGoing.killChecked = value
  let linkId = `RE_WeaponWH==${store.state.sceneModule.currentFlyType.entityId}==`
  state2.connectLineManage.showEntityByKeyword(linkId, value)
  entityConfig(state2.outGoing.killChecked)
}
// 深度监听
watch(
  () => store.state.sceneModule.currentFlyType,
  (newValue, oldValue) => {
    showPlaneInfo(newValue)
  },
  { deep: true }
)
watch(
  () => store.state.sceneModule.entityLinkConfig,
  (newValue) => {
    showEntityConfig(newValue)
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
