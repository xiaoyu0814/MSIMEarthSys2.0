<template>
  <div class="bottomControl">
    <div class="float-left">
      <el-tooltip effect="light" :content="state.rightShow ? '隐藏时间控制面板' : '显示时间控制面板'" placement="bottom">
        <img class="left-shrink" :src="state.rightShow
            ? require('@/assets/image/panelIcons/telescoping.png')
            : require('@/assets/image/panelIcons/telescoping_1.png')
          " @click="changeRight" />
      </el-tooltip>
    </div>
    <Transition name="custom-classes" enter-active-class="animate__animated animate__fadeInUp"
      leave-active-class="animate__animated animate__fadeOutDown">
      <!-- <div class="float-right" v-show="state.rightShow"> -->
      <div class="float-right" v-show="false">
        <el-select v-model="state.leftCompName" class="scene_input" placeholder="编组信息" size="small"
          @change="changeLeftComp" clearable v-show="state.isBottomPermisson1">
          <el-option v-for="item in state.leftList" :key="item.name" :label="item.label" :value="item.name" />
        </el-select>
        <el-select v-model="state.rightCompName" class="scene_input" placeholder="请选择" size="small"
          @change="changeRightComp" clearable v-show="state.isBottomPermisson2">
          <el-option v-for="item in state.rightList" :key="item.name" :label="item.label" :value="item.name" />
        </el-select>
        <el-select v-model="state.bottomCompName" class="scene_input" placeholder="请选择" size="small"
          @change="changeBottomComp" clearable v-show="state.isBottomPermisson3">
          <el-option v-for="item in state.bottomList" :key="item.name" :label="item.label" :value="item.name" />
        </el-select>
        <el-select v-model="state.threeDimensional" class="scene_input" placeholder="场景配置" size="small"
          @change="changeThreeDimensional" clearable v-show="state.isBottomPermisson4">
          <el-option v-for="item in state.threeDimensionalList" :key="item.name" :label="item.label"
            :value="item.name" />
        </el-select>
        <!-- <el-select
          v-model="state.thematicAnalysis"
          class="scene_input"
          placeholder="专题分析"
          size="small"
          @change="changeThematicAnalysis"
          clearable
          value-key="name"
          v-show="state.isBottomPermisson5"
        >
          <el-option
            v-for="item in state.thematicAnalysisList"
            :key="item.name"
            :label="item.label"
            :value="item"
          />
        </el-select> -->
      </div>
    </Transition>
  </div>
</template>

<script setup>
import emitter from '@/utils/eventbus'
import { onMounted, reactive, watch } from 'vue'
import store from '@/store'
import { pauseTime } from '@/service/timeline'
import { StartSceneRunSetData } from '@/service/SSE'
import { permissionList } from '@/components/permission/data.js'

const state = reactive({
  leftCompName: '',
  leftList: [
    // {
    //   label: '兵力树',
    //   name: 'forceChart',
    //   props: {}
    // },
    // {
    //   label: '力量编成',
    //   name: 'LLBC',
    //   props: {}
    // },
    // {
    //   label: '兵力列表',
    //   name: 'guidePowerComp',
    //   props: {}
    // },
    {
      label: '红方编组',
      name: 'taskGroup',
      props: {}
    },
    {
      label: '蓝方编组',
      name: 'taskGroupBlue',
      props: {}
    },
    {
      label: '绿方编组',
      name: 'taskGroupGreen',
      props: {}
    },
    {
      label: '紫方编组',
      name: 'taskGroupPurple',
      props: {}
    },
    {
      label: '编组信息',
      name: 'groupTab',
      props: {}
    }
    // {
    //   label: '计划导调',
    //   name: 'adjustPlan',
    //   props: {}
    // }
    // {
    //   label: '目标信息',
    //   name: 'targetInformations',
    //   props: {}
    // }
  ],
  rightCompName: '',
  rightList: [
    {
      label: '作战信息',
      name: 'realTimeInformation',
      props: {}
    }
    // {
    //   label: '视频',
    //   name: 'showVideo',
    //   props: {}
    // },
    // {
    //   label: '仿真推演',
    //   name: 'showUE',
    //   props: {}
    // }
  ],
  bottomCompName: '',
  bottomList: [
    {
      label: '快速裁决',
      name: 'quickArbitration',
      props: {}
    },
    // {
    //   label: '识别结果',
    //   name: 'recognitionResult',
    //   props: {}
    // },
    // {
    //   label: '目标展示',
    //   name: 'showTarget',
    //   props: {}
    // },
    // {
    //   label: '关键事件',
    //   name: 'keyEvents',
    //   props: {}
    // },
    // {
    //   label: '裁决结果',
    //   name: 'arbitrationResult',
    //   props: {}
    // },
    // {
    //   label: '计划导调',
    //   name: 'messagePlan',
    //   props: {}
    // }
  ],
  threeDimensional: '',
  threeDimensionalList: [
    // {
    //   label: '目标实时信息',
    //   name: 'planeLabelConfig',
    //   props: {}
    // },
    {
      label: '辅助信息',
      name: 'earthObjectConfig',
      props: {}
    },
    {
      label: '天气导调',
      name: 'weatherConfig',
      props: {}
    },
    // {
    //   label: '模拟器导调',
    //   name: 'targetConfig',
    //   props: {}
    // },
    // {
    //   label: '兵力添加',
    //   name: 'virtualSoldierConfig',
    //   props: {}
    // },
    {
      label: '想定内容',
      name: 'scenario',
      props: {}
    }
    // {
    //   label: '评估分析',
    //   name: 'assessment',
    //   props: {}
    // },
    // {
    //   label: '任务回传',
    //   name: 'taskFeedback',
    //   props: {}
    // },
    // {
    //   label: '席位准备情况',
    //   name: 'seatReadySituation',
    //   props: {}
    // },
    // {
    //   label: '音视频通话',
    //   name: 'videoChat',
    //   props: {}
    // },
    // {
    //   label: '战损评估',
    //   name: 'statisticAnalysis',
    //   props: {}
    // },
    // {
    //   label: '实体清单',
    //   name: 'entityList',
    //   props: {}
    // },
    // {
    //   label: '模拟器攻击',
    //   name: 'simulatorAttack',
    //   props: {}
    // },
    // {
    //   label: '威胁等级',
    //   name: 'billboardList',
    //   props: {}
    // }
  ],
  thematicAnalysis: '',
  thematicAnalysisList: [
    // {
    //   label: '行动轨迹',
    //   name: 'actionTrack',
    //   props: {}
    // },
    // {
    //   label: '指挥链路分析',
    //   name: 'commandLinkAnalysis',
    //   props: {}
    // },
    // {
    //   label: '火力打击链路分析',
    //   name: 'analysisOfFirepowerStrikeLink',
    //   props: {}
    // },
    // {
    //   label: '通信链路分析',
    //   name: 'communicationLinkAnalysis',
    //   props: {}
    // },
    // {
    //   label: '电磁频域分析',
    //   name: 'electromagneticFrequencyDomainAnalysis',
    //   props: {}
    // }
  ],
  rightShow: false,
  isBottomPermisson1: EarthAPP.isBottomPermisson1, //编组
  isBottomPermisson2: EarthAPP.isBottomPermisson2, //作战信息
  isBottomPermisson3: EarthAPP.isBottomPermisson3, //计划导调
  isBottomPermisson4: EarthAPP.isBottomPermisson4, //场景配置
  isBottomPermisson5: EarthAPP.isBottomPermisson5, //专题分析
  userPermissionList: {}
})

// headr席位控制左侧侧面板显隐
emitter.on('changeHomePanel', (val) => {
  if (val) {
    changeLeftComp('forceChart')
  } else {
    changeLeftComp('')
  }
})
emitter.on('hiddenBottom', (val) => {
  state.rightShow = val
})
// 关闭面板
emitter.on('closeBottomControlPanel', (val) => {
  switch (val) {
    case 'left':
      changeLeftComp('')
      break
    case 'right':
      changeRightComp('')
      break
    case 'bottom':
      changeBottomComp('')
      break
    case 'three':
      changeThreeDimensional('')
      break

    default:
      break
  }
})
// 播放视频
emitter.on('playVideo', (val) => {
  store.state.sceneModule.audioUrl = val
  changeRightComp('showVideo')
})

// 目标识别完成切换识别结果面板
emitter.on('identifyFinish', (val) => {
  // changeBottomComp('recognitionResult')
  // setTimeout(() => {
  //   changeBottomComp('quickArbitration')
  // }, (identifyDuration * 1.5 + 2) * 1000)
})

onMounted(() => {
  // 权限
  window.emitter = emitter
  // 登录角色
  if (
    window.localStorage.getItem('roleCode') == 'admin' ||
    window.localStorage.getItem('roleCode') == 'daotiao' ||
    // window.localStorage.getItem('side') == 'admin' ||
    window.localStorage.getItem('side') == 'admin_ts' ||
    window.localStorage.getItem('side') == 'red_zhkz'
  ) {
    // state.threeDimensionalList.push({
    //   label: '场景天气导调',
    //   name: 'weatherConfig',
    //   props: {}
    // })
    // state.threeDimensionalList.push({
    //   label: '干扰机开机',
    //   name: 'jammerMeachOn',
    //   props: {}
    // })
    // state.threeDimensionalList.push({
    //   label: '红方受干扰机干扰',
    //   name: 'jammerDistrub',
    //   props: {}
    // })
    // state.threeDimensionalList.push({
    //   label: '干扰机关闭',
    //   name: 'jammerClose',
    //   props: {}
    // })
    // state.threeDimensionalList.push({
    //   label: '雷达恢复',
    //   name: 'radarRestore',
    //   props: {}
    // })
    // state.threeDimensionalList.push({
    //   label: '卫星通信',
    //   name: 'satellite',
    //   props: {}
    // })
  }
  if (window.localStorage.getItem('roleCode') == 'shiyan') {
    // state.isBottomPermisson1 = false
    state.isBottomPermisson3 = false
    state.isBottomPermisson5 = false
    state.userPermissionList =
      permissionList[window.localStorage.getItem('roleCode')]
    const index = state.userPermissionList?.bottomBarList?.indexOf('兵力添加')
    if (index == -1) {
      const barIndex = state.threeDimensionalList.findIndex(
        (item) => item.label === '兵力添加'
      )
      // 不存在，删除选项
      state.threeDimensionalList.splice(barIndex, 1)
    }
  }
  // 快捷键是否可用
  if (store.state.sceneModule.systemConfig.usableControlKeyCode) {
    addEventListenerKeyDown()
  }
  // changeLeftComp('')
  let urlRouter = JSON.parse(window.localStorage.getItem('addMenu'))
  if (urlRouter) {
    state.leftList.push(urlRouter)
    state.leftCompName = urlRouter.name
  }
  //目标实时信息弹框
  emitter.on('showGoalInfor', (name) => {
    changeThreeDimensional(name)
  })
  //威胁分析底部标牌弹框
  emitter.on('showThreatAnalysisList', (name) => {
    changeThreeDimensional(name)
  })
  //威胁分析底部标牌弹框
  emitter.on('showTargetInfo', (name) => {
    changeLeftComp(name)
  })
})

// 添加事件
const addEventListenerKeyDown = () => {
  function keydownEventListener(event) {
    switch (event.keyCode) {
      // 增加键盘1和2的事件
      case keyCodeObj[showPanelShow.keyboard1]:
        changeTopNumber('1')
        break
      case keyCodeObj[showPanelShow.keyboard2]:
        changeTopNumber('2')
        break
      case keyCodeObj[showPanelShow.keyboard3]:
        changeTopNumber('3')
        break
      case keyCodeObj[showPanelShow.keyboard4]:
        changeTopNumber('4')
        break
      case keyCodeObj[showPanelShow.keyboard5]:
        changeTopNumber('5')
        break
      case keyCodeObj[showPanelShow.leftPanelShow]:
        if (state.leftCompName == 'forceChart') {
          state.leftCompName = ''
          changeLeftComp('')
        } else {
          state.leftCompName = 'forceChart'
          changeLeftComp('forceChart')
        }
        break
      case keyCodeObj[showPanelShow.realTimeInformation]:
        if (state.rightCompName == 'realTimeInformation') {
          state.rightCompName = ''
          changeRightComp('')
        } else {
          changeRightComp('realTimeInformation')
        }
        break
      case keyCodeObj[showPanelShow.showVideo]:
        console.log(state.rightCompName)
        store.state.sceneModule.audioUrl = '导弹拦截'
        if (state.rightCompName == 'showVideo') {
          state.rightCompName = ''
          changeRight('')
          emitter.emit('closeBottomControlPanel', 'right')
        } else {
          state.rightCompName = 'showVideo'
          changeRightComp('showVideo')
        }
        break
      case keyCodeObj[showPanelShow.quickArbitration]:
        if (state.bottomCompName == 'quickArbitration') {
          changeBottomComp('')
          state.bottomCompName = ''
        } else {
          changeBottomComp('quickArbitration')
          state.bottomCompName = 'quickArbitration'
        }
        break
      case keyCodeObj[showPanelShow.recognitionResult]:
        if (state.bottomCompName == 'recognitionResult') {
          changeBottomComp('')
          state.bottomCompName = ''
        } else {
          changeBottomComp('recognitionResult')
          state.bottomCompName = 'recognitionResult'
        }
        break
      case keyCodeObj[showPanelShow.showTarget]:
        if (state.bottomCompName == 'showTarget') {
          changeBottomComp('')
          state.bottomCompName = ''
        } else {
          changeBottomComp('showTarget')
          state.bottomCompName = 'showTarget'
        }
        break
      case keyCodeObj[showPanelShow.scenario]:
        if (state.threeDimensional == 'scenario') {
          changeThreeDimensional('')
          state.threeDimensional = ''
        } else {
          changeThreeDimensional('scenario')
          state.threeDimensional = 'scenario'
        }
        break
      case keyCodeObj[showPanelShow.statisticAnalysis]:
        if (state.threeDimensional == 'statisticAnalysis') {
          changeThreeDimensional('')
          state.threeDimensional = ''
        } else {
          changeThreeDimensional('statisticAnalysis')
          state.threeDimensional = 'statisticAnalysis'
        }
        break
      case keyCodeObj[showPanelShow.taskFeedback]:
        if (state.threeDimensional == 'taskFeedback') {
          changeThreeDimensional('')
          state.threeDimensional = ''
        } else {
          changeThreeDimensional('taskFeedback')
          state.threeDimensional = 'taskFeedback'
        }
        break
      case keyCodeObj[showPanelShow.jammerMeachOn]:
        if (state.threeDimensional == 'jammerMeachOn') {
          changeThreeDimensional('')
          state.threeDimensional = ''
        } else {
          changeThreeDimensional('jammerMeachOn')
          state.threeDimensional = 'jammerMeachOn'
        }
        break
      case keyCodeObj[showPanelShow.jammerDistrub]:
        if (state.threeDimensional == 'jammerDistrub') {
          changeThreeDimensional('')
          state.threeDimensional = ''
        } else {
          changeThreeDimensional('jammerDistrub')
          state.threeDimensional = 'jammerDistrub'
        }
        break
      case keyCodeObj[showPanelShow.jammerClose]:
        if (state.threeDimensional == 'jammerClose') {
          changeThreeDimensional('')
          state.threeDimensional = ''
        } else {
          changeThreeDimensional('jammerClose')
          state.threeDimensional = 'jammerClose'
        }
        break
      case keyCodeObj[showPanelShow.radarRestore]:
        if (state.threeDimensional == 'radarRestore') {
          changeThreeDimensional('')
          state.threeDimensional = ''
        } else {
          changeThreeDimensional('radarRestore')
          state.threeDimensional = 'radarRestore'
        }
        break
      case keyCodeObj[showPanelShow.simulatorAttack]: //模拟器攻击弹框
        if (state.threeDimensional == 'simulatorAttack') {
          changeThreeDimensional('')
          state.threeDimensional = ''
        } else {
          changeThreeDimensional('simulatorAttack')
          state.threeDimensional = 'simulatorAttack'
        }
        break
      // case keyCodeObj[showPanelShow.satellite]:
      //   if (state.threeDimensional == 'satellite') {
      //     changeThreeDimensional('')
      //     state.threeDimensional = ''
      //   } else {
      //     changeThreeDimensional('satellite')
      //     state.threeDimensional = 'satellite'
      //   }
      //   break
    }
  }
  document.addEventListener('keydown', keydownEventListener)
  window.keydownEventListener = keydownEventListener
}

const setListValue = (val) => {
  state.leftList.push(val)
}
const StartSceneRunSetDataFun = (startStu) => {
  // 增加模拟器数入库   messageId ---> 场景ID,startStu true--->存
  StartSceneRunSetData({
    messageId: sessionStorage.getItem('taskId'),
    startStu: startStu
  }).then((res) => {
    if (res == 200) {
      if (res.data) {
        store.commit('setSceneReplayId', res.data)
      }
    }
  })
}

watch(
  () => store.state.sceneModule.startingFalseInfo,
  (newValue, oldValue) => {
    //白方席位一直显示弹框，zhkz和qb席位通过变量控制是否显示
    if (
      store.state.sceneModule.systemConfig.isShowPanel ||
      localStorage.getItem('side') == 'admin'
    ) {
      //防止场景掉帧，场景重启后，临时注释掉左侧、右侧，底部的弹框
      // changeLeftComp('forceChart')//左侧兵力树弹框
      // changeRightComp('realTimeInformation')//右侧日志弹框
      // changeBottomComp('quickArbitration')//底部杀伤链弹框
      changeThreeDimensional('scenario') //中间想定弹框
      // 链路图例显示
      store.state.sceneModule.earthObjectConfig.push('链路图例')
      emitter.emit('changeConnectionLegend', false)
      //弹出时间轴
      if (store.state.sceneModule.isReplayType) {
        //复盘功能，隐藏推演时间轴
        emitter.emit('changeTimeLineState', false)
      } else {
        emitter.emit('changeTimeLineState', true)
      }
    }
  }
)
watch(
  // 标配配置-目标实现信息
  () => store.getters.getPlane,
  (newValue, oldValue) => {
    console.log(newValue, '--350标配', oldValue)
    if (newValue === '') return
    changeThreeDimensional('planeLabelConfig')
  },
  {
    deep: true
  }
)
watch(
  // 战场信息-战场信息展示
  () => store.getters.getEarth,
  (newValue, oldValue) => {
    console.log(newValue, '--356战场', oldValue)
    changeThreeDimensional('earthObjectConfig')
  },
  {
    deep: true
  }
)
// 指控席菜单控制
watch(
  () => store.getters.getCompList,
  (newValue, oldValue) => {
    if (state[newValue.value]) {
      if (state[newValue.value] == newValue.name) {
        state[newValue.value] = ''
      } else {
        state[newValue.value] = newValue.name
      }
    } else {
      state[newValue.value] = newValue.name
    }
    let currentName = state[newValue.value]
    eval(newValue['methods'] + '(currentName)')
  }
)
// 毁伤评估
watch(
  () => store.state.sceneModule.damageAssessmentData,
  (newValue) => {
    if (newValue) {
      //StartSceneRunSetDataFun(false)
      // setTimeout(() => {
      //   ElMessageBox.confirm('场景推演结束，是否查看任务评估分析？', '提示', {})
      //     .then(() => {
      //       changeThreeDimensional('assessment')
      //     })
      //     .catch(() => {})
      // }, 1000)
    }
  }
)
// 快捷键是否可用
watch(
  () => store.state.sceneModule.systemConfig.usableControlKeyCode,
  (newValue, oldValue) => {
    if (newValue) {
      addEventListenerKeyDown()
    } else {
      if (window.keydownEventListener) {
        document.removeEventListener(
          'keydown',
          window.keydownEventListener,
          false
        )
        window.keydownEventListener = null
      }
    }
  }
)
// 切换左侧弹框
const changeLeftComp = (name) => {
  let value = name
    ? state.leftList.find((item) => item.name == name)
    : { label: '', name: '', props: {} }
  emitter.emit('leftComp', value)
  state.leftCompName = name
  // header席位状态
  emitter.emit('changeHeaderStatus', name == 'forceChart' ? true : false)
}
// 切换右侧弹框
const changeRightComp = (name) => {
  let value = name
    ? state.rightList.find((item) => item.name == name)
    : { label: '', name: '', props: {} }
  emitter.emit('rightComp', value)
  state.rightCompName = name
  // 控制UE全屏按钮显示隐藏
  emitter.emit('viewUE', name == 'showUE' ? true : false)
}
// 切换底部弹框
const changeBottomComp = (name) => {
  let value = name
    ? state.bottomList.find((item) => item.name == name)
    : { label: '', name: '', props: {} }
  emitter.emit('bottomComp', value)
  state.bottomCompName = name
}
// 切换中间想定弹框
const changeThreeDimensional = (name) => {
  let value = name
    ? state.threeDimensionalList.find((item) => item.name == name)
    : { label: '', name: '', props: {} }
  emitter.emit('sceneConfigComp', value)
  state.threeDimensional = name
  if (
    name == 'statisticAnalysis' &&
    store.state.sceneModule.systemConfig.damageAssessmentTimePause
  ) {
    pauseTime({ simulationId: '45465' }).then(() => { })
  }
}
// 切换专题分析弹框
const changeThematicAnalysis = (item) => {
  console.log(item)
  let value = { label: '', name: '', props: {} }
  if (item) {
    value = item
  }
  emitter.emit('thematicAnalysisComp', value)
}
//右侧收缩
const changeRight = () => {
  state.rightShow = !state.rightShow
  emitter.emit('changeTimeLineState', state.rightShow)
}
// 切换顶部数字键弹框 暂时不增加面板弹出，只用于缓存数据等数据等级操作
const changeTopNumber = (name) => {
  let value = name
  emitter.emit('topNum', value)
}
</script>

<style lang="less" scoped>
.bottomControl {
  position: absolute;
  left: 0;
  bottom: 0;
  display: flex;
  justify-content: center;
  align-items: flex-end;
  width: 100%;

  .float-left {
    display: flex;
    align-items: flex-end;
    transform: rotate(-90deg);
    width: 50px;
    height: 50px;
    position: absolute;
    bottom: 0;
    left: 12px;

    .left-shrink {
      z-index: 2;
      cursor: pointer;
      width: 16px;
      font-size: 36px !important;
    }
  }

  .float-right {
    display: flex;
    align-items: flex-end;
    justify-content: center;
    width: auto;
    gap: 10px;
    padding: 10px;

    .scene_input {
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
  }
}
</style>
