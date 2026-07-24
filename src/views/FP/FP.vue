<template>
  <div class="home">
    <earth-viewer>
      <button
        style="
          position: absolute;
          top: 200px;
          left: 300px;
          color: aliceblue;
          z-index: 999;
          color: #fff;
        "
        @click="test111"
      >
        test2
      </button>
    </earth-viewer>
    <!-- 标题 联合作战仿真推演分析系统 防空反导虚数结合训练系统-->
    <Transition
      name="custom-classes"
      enter-active-class="animate__animated animate__backInDown animate__delay-10s"
      leave-active-class="animate__animated animate__fadeOutUp"
    >
      <div
        class="animate__animated animate__backInDown animate__delay-10s"
        style="position: relative; z-index: 2"
      >
        <home-header :title="systemTitle"> </home-header>
      </div>
    </Transition>
    <!-- 工具条显隐开关按钮 -->
    <toolbar @showTree="showTree"></toolbar>
    <experimentalDataAnalysis
      v-if="$store.state.experimentalDataAnalysis_visible"
    />
    <experimentalBasicDatabase
      v-if="$store.state.experimentalBasicDatabase_visible"
    />
    <!-- 页面弹窗组件 -->
    <child-comp></child-comp>
    <BubbleDiv></BubbleDiv>
    <BubbleDiv3></BubbleDiv3>
    <identify v-if="showIdentify"></identify>
    <!-- 左侧侧边栏伸缩按钮 -->
    <div class="left-sidebar">
      <el-tooltip effect="light" :content="'伸缩'" placement="right">
        <img
          class="toggle-button"
          :src="
            rightShow
              ? require('@/assets/image/panelIcons/telescoping.png')
              : require('@/assets/image/panelIcons/telescoping_1.png')
          "
          @click="changeRight"
        />
      </el-tooltip>
    </div>

    <!-- 底部预留区域 - 可以在这添加其他功能 -->
    <div class="bottom-panel-placeholder">
      <!-- 这里可以添加其他功能组件 -->
    </div>

    <Transition
      name="custom-classes"
      enter-active-class="animate__animated animate__fadeInUp"
      leave-active-class="animate__animated animate__fadeOutDown"
    >
      <div class="timeReplayBar" v-show="rightShow">
        <div id="timeProcess" class="time_box">
          <!-- 进度条 -->
          <el-tooltip
            effect="light"
            content="点击打开时间跳转面板"
            placement="top"
          >
            <div v-on:click="changeProcess" class="progress-bar-clickable">
              <el-progress
                :percentage="curTimeRate"
                style="color: white; font-size: 23px"
              />
            </div>
          </el-tooltip>
          <div class="processConfig" v-show="showProcessConfig">
            <!-- <el-input
              style="width: 56px; padding-right: 5px"
              v-model="processSeconds"
            ></el-input> -->
            <el-date-picker
              v-model="timeInfo"
              type="datetime"
              value-format="YYYY-MM-DD HH:mm:ss"
              placeholder="选择执行时间"
              :disabled-date="disabledDateFn"
              :disabled-hours="disabledHours"
              :disabled-minutes="disabledMinutes"
              :disabled-seconds="disabledSeconds"
            />
            <el-button @click="advanceToTime">跳转</el-button>
          </div>
        </div>
        <div class="timeControlDiv">
          <el-button @click="fpPause">暂停</el-button>
          <el-button @click="fpResume">继续</el-button>
          <el-button @click="fpStop">停止</el-button>
          <el-select
            v-model="value"
            placeholder="选择倍速"
            class="clockRateSelect"
            @change="controlSpeed($event)"
          >
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            />
          </el-select>
          <el-button @click="fpClockRate">速率</el-button>
          <el-button
            @click="toggleSceneConfig"
            :class="{ active: showSceneConfig }"
          >
            场景配置
          </el-button>
        </div>
      </div>
    </Transition>
    <loading v-if="showLoading" :loading-text="loadingText"></loading>
    <CloseAnimation v-if="isClosing" :close-text="closingText"></CloseAnimation>
    <!-- 场景配置面板 -->
    <!-- <SceneConfigPanel
      v-model:visible="showSceneConfig"
      :current-speed="clockRate"
      @close="showSceneConfig = false"
    /> -->
    <!-- <el-button
      @click="test111"
      style="position: absolute; left: 100px; top: 100px; z-index: 999"
      >重启</el-button
    > -->

    <div v-if="leftComp.name">
      <component :is="leftComp.name" :="leftComp.props"></component>
    </div>
    <div v-if="rightComp.name">
      <component :is="rightComp.name" :="rightComp.props"></component>
    </div>
    <div v-if="bottomComp.name">
      <component :is="bottomComp.name" :="bottomComp.props"></component>
    </div>
    <Transition
      name="custom-classes"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <div v-if="sceneConfigComp.name">
        <component
          :is="sceneConfigComp.name"
          :="sceneConfigComp.props"
        ></component>
      </div>
    </Transition>
    <!-- 页面展示逻辑控制组件 -->
    <control-comp v-show="side == 'admin' || side == 'admin_ts'"></control-comp>
  </div>
</template>

<script>
// @ is an alias to /src
import EarthViewer from '@/views/3D/EarthViewer.vue'
import HomeHeader from '@/views/homeHeader/FPHomeHeader.vue'
import systemConfig from '@/components/systemConfig/index.vue'
// 场景面板展示操控组件
import ScenePage from '@/views/scenePage/index.vue'
import childComp from '@/views/hooks/childComp/index.vue'
import toolbar from '@/views/toolbar/index.vue'
import BubbleDiv from '@/utils/bubble/BubbleDiv'
import BubbleDiv3 from '@/utils/bubble/BubbleDiv3'
import identify from '@/components/content/identify/identify'
import loading from '@/components/content/loading.vue'
import CloseAnimation from './comps/CloseAnimation.vue'
import SceneConfigPanel from './comps/SceneConfigPanel.vue'
import GraphViewer from '@/views/3D/GraphViewer.vue'
import { getOperationInof } from '@/service/SSE'
// 导入hooks
import { useStore } from 'vuex'
import {
  reactive,
  ref,
  toRefs,
  onMounted,
  onUnmounted,
  computed,
  watch,
  nextTick
} from 'vue'
import emitter from '@/utils/eventbus'
import chat_img from '@/assets/images/15.png'
import chat_img_select from '@/assets/images/15_select.png'
import experimentalDataAnalysis from '@/views/scenePage/experimentalDataAnalysis/index.vue' // 实验数据分析
import experimentalBasicDatabase from '@/views/scenePage/experimentalResourceManagement/experimentalBasicDatabase/index.vue' // 实验基础数据库
import AIchat from '@/components/AIchat/index.vue'
import sceneConstruction from '@/views/experimentalPreparation/sceneConstruction/index.vue'
import conceptDevelopment from '@/views/experimentalPreparation/conceptDevelopment/index.vue'
import dataConfig from '@/views/experimentalPreparation/dataConfig/index.vue'
// 页面展示操控逻辑组件
import controlComp from '@/views/scenePage/controlComp/index.vue'
// 编组
import taskGroup from '@/views/scenePage/leftComp/taskGroupRed/index.vue'
import taskGroupBlue from '@/views/scenePage/leftComp/taskGroupBlue/index.vue'
import taskGroupGreen from '@/views/scenePage/leftComp/taskGroupGreen/index.vue'
import taskGroupPurple from '@/views/scenePage/leftComp/taskGroupPurple/index.vue'
// 场景左侧弹窗rightComp组件
import realTimeInformation from '@/views/scenePage/rightComp/realTimeInformation/index.vue'
// 场景底部弹窗bottomComp组件
import quickArbitration from '@/views/scenePage/bottomComp/quickArbitration/index.vue'
// 场景中间部分弹窗sceneConfigComp组件
import earthObjectConfig from '@/views/scenePage/sceneConfigComp/earthObjectConfig/index.vue'
import scenario from '@/views/scenePage/sceneConfigComp/scenario/index.vue'
// 复盘操控接口
import {
  fpStartService,
  fpPauseService,
  fpSetclockRateService,
  fpResumeService,
  fpStopService,
  getExperimentRecordInfo,
  getExperimentRowInfo,
  fpSetadvancetotime
} from '@/service/review/index'
import { ClusterByGroup } from '@/utils/earthPlugin/earthPlugin'
import commonMethods from '@/utils/commonMethods/commonMethods.js'
import {
  startExperiment,
  getExpeSampleMgtPage
} from '@/service/combatSimulation.js'
import { getScenarioById } from '@/service/experimentalPreparation.js'
import { eventControllerSSEClose } from '@/utils/mapTools'
import { FP } from './hooks/index'
import { getTaskClosureTimeDetail } from '@/service/replay/index'
export default {
  name: 'HomeView',
  components: {
    EarthViewer,
    HomeHeader,
    systemConfig,
    toolbar,
    BubbleDiv,
    BubbleDiv3,
    identify,
    childComp,
    ScenePage,
    loading,
    CloseAnimation,
    SceneConfigPanel,
    experimentalDataAnalysis,
    experimentalBasicDatabase,
    AIchat,
    sceneConstruction,
    conceptDevelopment,
    dataConfig,
    GraphViewer,
    controlComp,
    taskGroup,
    taskGroupBlue,
    taskGroupGreen,
    taskGroupPurple,
    realTimeInformation,
    quickArbitration,
    earthObjectConfig,
    scenario
  },
  setup() {
    FP()
    // 定时器管理
    const timers = reactive({
      intervals: [],
      timeouts: [],
      requestAnimationFrames: []
    })

    // 清除所有定时器的函数
    const clearAllTimers = () => {
      timers.timeouts.forEach((id) => clearTimeout(id))
      timers.timeouts = []

      timers.intervals.forEach((id) => clearInterval(id))
      timers.intervals = []

      timers.requestAnimationFrames.forEach((id) => cancelAnimationFrame(id))
      timers.requestAnimationFrames = []
    }

    let currentSeat = localStorage.getItem('systemTitle')
    const store = useStore()
    const state = reactive({
      loadingText: '加载中...',
      showLoading: false,
      // 进度
      progress: 0,
      isShowScene: false,
      entitiesCount: 0,
      leftComp: {
        name: '',
        props: {}
      },
      rightComp: {
        name: '',
        props: {}
      },
      bottomComp: {
        name: '',
        props: {}
      },
      sceneConfigComp: {
        name: '',
        props: {}
      },
      isShowTree: false, //图层树显隐
      showIdentify: false, //识别
      showMilitaryPlot: false, //军标面板
      showSystemConfig: false, //系统配置面板
      showReplayTimeLine: false, //是否显示复盘功能时间轴
      systemTitle: '智能作战概念创新运用支持系统-复盘回放', // 系统标题
      side: localStorage.getItem('side'), // 席位
      ttt: 0,
      socketApi_doc: null,
      lonlatShow: true, //经纬图标按钮
      lonImg: require('@/assets/image/rightNavbar/measure/left.png'),
      latImg: require('@/assets/image/rightNavbar/measure/right.png'),
      showSearch: false,
      lngAltHeight: '',
      leftShow: true,
      ThreatInformation: false, //是否显示威胁信息
      list: [
        {
          label: '组织架构管理',
          name: 'chat',
          img: chat_img,
          select_img: chat_img_select
        }
      ],
      showAI: false,
      showGraphDiv: false,
      ddd: 0,
      clockRate: 1,
      options: [
        {
          value: '1',
          label: 'x1'
        },
        {
          value: '2',
          label: 'x2'
        },
        {
          value: '3',
          label: 'x3'
        },
        {
          value: '4',
          label: 'x4'
        },
        {
          value: '5',
          label: 'x5'
        }
      ],
      processSeconds: 0,
      curExperimentInfo: '',
      startTime: null,
      endTime: null,
      effectStartTime: null,
      effectEndTime: null,
      reviewTime: 0,
      continueReviewContent: true,
      curTimeRate: 0,
      showProcessConfig: false,
      showSceneConfig: false,
      timeInfo: '',
      rightShow: false,
      isClosing: false,
      closingText: '正在关闭复盘...',
      side: localStorage.getItem('side'),
      sceneConfigComp: {
        name: '',
        props: {}
      },
      leftComp: {
        name: '',
        props: {}
      },
      rightComp: {
        name: '',
        props: {}
      },
      bottomComp: {
        name: '',
        props: {}
      }
    })
    state.systemTitle = computed(() => {
      const titleExtension = store.state.sceneModule.systemConfig.titleExtension
      if (titleExtension) {
        return EarthAPP.sysTitleQZ + EarthAPP.sysTitle + '-复盘回放'
      }
      return EarthAPP.sysTitle + '-复盘回放'
    })
    store.state.experimentModule.subSysName = '复盘回放'
    // if (EarthAPP.systemTitle != '') {
    //   state.systemTitle = EarthAPP.systemTitle
    // }

    const value = ref('x1')
    // 实验列表
    watch(
      () => store.getters.get_isSimulationList,
      (newVal) => {
        state.isShowScene = !newVal
      },
      { deep: true, immediate: true }
    )
    watch(
      () => state.startTime,
      (newVal) => {
        // state.timeInfo = '2027-09-12 10:00:00' //newVal 暂时固定 后续场景编辑实现后再实时获取
        state.timeInfo = store.state.sceneModule.startDate
      },
      { deep: true, immediate: true }
    )

    // 监听 store 中的 startDate 变化，同步更新 timeInfo
    watch(
      () => store.state.sceneModule.startDate,
      (newVal) => {
        if (newVal) {
          state.timeInfo = newVal
        }
      },
      { deep: true, immediate: true }
    )
    // 复盘进入场景同步高倍速时间差
    watch(
      () => store.state.sceneModule.multiplier,
      (newVal) => {
        console.log('获取新倍率', newVal)
        // 根据当前传递过来的消息动态修改系统时间倍率，主要是timeC,最好每次进入场景出发一次
        if (newVal !== 1) {
          if (reComputetTimeC) {
            reComputetTimeC = false
            // 现重新连接再更新场景从而实现速度切换
            EarthAPP.timeC = newVal * EarthAPP.timeVal
            if (EventController) {
              eventControllerSSEClose(EventController)
            }
            EventController = new window.EarthPlugn.EventSourceController({
              baseUrl: serverUrls.serversCommunication
            })
            EventController.restartStream(2)
          }
        }
      },
      { deep: true, immediate: true }
    )

    //控制图层树显隐
    const showTree = (val) => {
      state.isShowTree = val
    }
    emitter.on('showGraphVal', (val) => {
      state.showGraphDiv = val.show
      if (val.show) {
        const timeoutId = setTimeout(() => {
          emitter.emit('showGraphData', val)
        }, 100)
        timers.timeouts.push(timeoutId)
      }
    })
    watch(
      () => store.state.sceneModule.showIdentify,
      (newValue) => {
        if (newValue) {
          state.showIdentify = newValue
          let sysSoundShow = Number(
            window.localStorage.getItem('systemSoundEnabled')
          )
          if (!sysSoundShow) {
            const timeoutId2 = setTimeout(() => {
              store.state.sceneModule.showIdentify = false
            }, ((identifyDuration * 3 + 5) * 1000) / window.EarthViewer.clock.multiplier) // (identifyDuration * 3 + 10) * 1000  识别动画总时长
            timers.timeouts.push(timeoutId2)
          }
        } else {
          state.showIdentify = newValue
        }
      }
    )
    watch(
      () => store.state.AFSIMModule.reconnaissanceResults,
      (newValue) => {
        // 监听到ReconnaissanceResults变化，模拟通过消息平台获取大模型预测结果
        // console.log(newValue)
        // 读取newValue中的data,基于threat_assessment获取目标编组信息，威胁等级等信息
        if (newValue && store.getters.getChangeCameraView != '第三视角') {
          // const entityMethod = new window.EarthPlugn.entity({
          //   earth: window.MSIMEarth,
          //   viewer: window.EarthViewer
          // })
          let entityId = ''
          let side = ''
          if (newValue.sensorType == 'WSF_OPTICAL_SENSOR') {
            entityId = newValue.detectorName
            side = newValue.detectorSide
          } else {
            entityId = newValue.platformName
            side = newValue.side
          }
          let options = {
            entityId: entityId,
            name: newValue.platformCName,
            czmlSource: 'MSIMEarthCZMLProcessContainer',
            type: 'reconnaissance',
            typeCName: newValue.abnormalTypeCName,
            specificCName: newValue.specificDesc,
            side: side
          }
          // entityMethod.createRotateEntity(
          //   item.unit_name,
          //   2300.0,
          //   'static/image/texture/rotate1.png'
          // )
          window.sceneAction.popUp.setStyleEffectByReconnaissanceResults(
            options
          )
          resetReconnaissancePromptRemoveTimer(newValue.platformName, options)
        }
      },
      { immediate: true, deep: true }
    )
    const reconnaissancePromptTimers = new Map()
    const getReconnaissancePromptEntity = (options) => {
      let entity = window.EarthViewer?.entities?.getById(options.entityId)
      if (!entity) {
        entity = window.EarthPlugn?.entity?._GetCZMLEntity(
          options.entityId,
          options.czmlSource
        )
      }
      return entity
    }
    const resetReconnaissancePromptRemoveTimer = (platformName, options) => {
      if (!platformName) return

      const oldTimer = reconnaissancePromptTimers.get(platformName)
      if (oldTimer) {
        clearTimeout(oldTimer)
      }

      const timer = setTimeout(() => {
        const removeOptions = {
          ...options,
          entity: getReconnaissancePromptEntity(options)
        }

        window.sceneAction.popUp.removePrompt(removeOptions)
        reconnaissancePromptTimers.delete(platformName)
      }, 3000)

      reconnaissancePromptTimers.set(platformName, timer)
    }
    const { configldrw } = commonMethods()
    onMounted(() => {
      state.showLoading = true // 在onMounted中显示loading动画
      store.state.AFSIMModule.fp = true //表示进入复盘状态，时间seaAirJointOperationsSceneTime内的时间配置以及视锥体构建等会基于这个状态进行逻辑判定
      window.mubiaoObj = {} //存储L3阶段创建的new Bubble1()实例对象
      window.zyts = false //设置取消勾选战役态势图层状态,解决标绘代码中时间轴监听事件影响动态数据推送问题
      // UE
      // let { loadPixelStream } = ueStreamApp('play-ue')
      // loadPixelStream(BASE_URL_UE)
      // 军标图例
      emitter.on('changeMilitaryPlot', (val) => {
        state.showMilitaryPlot = val
      })
      // 系统配置面板
      emitter.on('systemConfig', (val) => {
        state.showSystemConfig = val
      })
      //威胁信息
      emitter.on('ThreatInformation', (val) => {
        state.ThreatInformation = val
      })
      // 显示复盘回放时间轴
      emitter.on('showReplayLine', (val) => {
        state.showReplayTimeLine = val
      })
      // 显示复盘回放时间轴
      emitter.on('showLoading', (val) => {
        state.showLoading = val
      })
      emitter.on('AT', (data) => {
        state.reviewTime = data.T
        store.state.experimentModule.reviewTime = data.Data.T
      })

      emitter.on('leftComp', (val) => {
        if (!val) return
        state.leftComp.name = val.name
        store.commit('set_isSimulationList', false)
      })
      emitter.on('rightComp', (val) => {
        if (!val) return
        state.rightComp.name = val.name
      })
      emitter.on('bottomComp', (val) => {
        if (!val) return
        state.bottomComp.name = val.name
      })
      emitter.on('sceneConfigComp', (val) => {
        if (!val) return
        state.sceneConfigComp.name = val.name
      })
      getCurentEntitiesCount()

      // 1.获取url并提取参数
      let curUrl = window.location.href
      if (curUrl.split('?').length > 1) {
        // 取出 id 和 time，直接放进 paramsArr 数组中
        const paramsArr = Object.values(
          Object.fromEntries(new URLSearchParams(location.hash.split('?')[1]))
        ) || ['', '']
        console.log('paramsArr', paramsArr)
        if (paramsArr[1]) {
          getTaskInfo(paramsArr[1])
        }
        // 2.promise链方式调用接口获取实验信息并启动实验
        if (paramsArr[1]) {
          _getTaskClosureTimeDetail(paramsArr[1])
        }
        const timeoutId3 = setTimeout(() => {
          getExperimentRecordInfo({ id: paramsArr[0] }).then((res) => {
            if (res.code === 200) {
              let ExperimentRowInfoId = res.data.sampleId
              console.log('res', res)
              state.startTime = res.data.startTime
              state.endTime = res.data.endTime
              getExperimentRowInfo({
                id: ExperimentRowInfoId,
                pageNum: 1,
                pageSize: 10
              }).then((res) => {
                if (res.code === 200) {
                  console.log('experimentSubjects', res.data)
                  state.curExperimentInfo = res.data.experimentSubjects
                  // comuptedTime()
                  effectTime()
                  ContinueRunCurrentScene(state.curExperimentInfo[0])
                  updateCurSceneTime(state.curExperimentInfo[0])
                  store.state.experimentModule.review = true
                  // setTimeout(() => {
                  //   EventController.restartStream(1)
                  // }, 4000)
                  const hasInit = window.sessionStorage.getItem(
                    'has_init_default_time'
                  )
                  // 如果获取到受影响开始时间，则执行跳转时间
                  // if (hasInit && paramsArr[1]) {
                  // if (paramsArr[1]) {
                  //   setTimeout(() => {
                  //     getTaskInfo(paramsArr[1])
                  //   }, 3000)
                  // }
                  let st = setInterval(() => {
                    // comuptedTime()
                    effectTime()
                  }, 1000)
                  timers.intervals.push(st)
                }
              })
            }
          })
        }, 3000)
        timers.timeouts.push(timeoutId3)
      } else {
        ElMessage.warning('未获取到ID！')
      }

      // 2.调用实验开始接口启动SSE PROTO
    })
    onUnmounted(() => {
      // 清除所有定时器
      clearAllTimers()
      store.state.AFSIMModule.fp = false
      // window.localStorage.removeItem('has_init_default_time')
    })
    const _getTaskClosureTimeDetail = (taskId) => {
      getTaskClosureTimeDetail().then((res) => {
        if (res.code == 200) {
          for (let i = 0; i < res.data.length; i++) {
            const element = res.data[i]
            if (element.id == taskId) {
              state.effectStartTime = element.effectStartTime
              state.effectEndTime = element.effectEndTime
            }
          }
          // addFactorData()
        }
      })
    }
    const getTaskInfo = async (id) => {
      try {
        const response = await fetch(
          './static/config/json/fp/taskClosureTimeDetail.json'
        )
        const result = await response.json()
        if (result.code == 200 && result.data) {
          result.data.forEach((element) => {
            if (element.id == id) {
              let time_ = new Date(element.effectStartTime).getTime()
              emitter.emit('fpTaskInfo', element)
              // advanceTime(time_)
              // window.sessionStorage.setItem('has_init_default_time', 'true')
            }
          })
          return
        }
      } catch (error) {
        console.warn('环境因素评估分析数据加载失败，使用模拟数据')
      }
    }
    // 更新场景开始和结束时间
    const updateCurSceneTime = (item) => {
      let params = {
        id: item.scenarioIdStr
      }
      getScenarioById(params).then((res) => {
        if (res.code == 200) {
          if (res.data) {
            store.state.sceneModule.startDate = res.data.startTime
            store.state.sceneModule.endDate = res.data.endTime
            store.state.sceneModule.curSceneTime = res.data.startTime
            store.state.sceneModule.msgMessionTime = res.data.startTime
            // 同步更新时间选择器的默认值
            state.timeInfo = res.data.startTime
            console.log(
              '更新场景开始和结束时间',
              res.data,
              store.state.sceneModule.startDate,
              state.timeInfo
            )
          }
        }
      })
    }
    // 设置默认跳转时间
    const advanceTime = (time) => {
      let timeDifference = 15
      const currtentSceneTime = new Date(Number(time) - timeDifference * 1000)
      const startSceneTime = new Date(store.state.sceneModule.startDate)
      let timeDif =
        (currtentSceneTime.getTime() - startSceneTime.getTime()) / 1000
      if (timeDif <= 0) {
        return
      }
      state.timeInfo = store.state.sceneModule.startDate
      console.log('调整的时间', timeDif)
      fpSetadvancetotime({ time: timeDif })
        .then((res) => {
          if (res.code === 200) {
            // state.showLoading = true
            setTimeout(() => {
              // state.showLoading = false
              EventController.restartStream()
            }, 5000)
          }
        })
        .catch((err) => {
          console.log('时间跳转失败', err)
        })
    }
    const getTimeRange = () => {
      const startTime = new Date(store.state.sceneModule.startDate)
      const endTime = new Date(store.state.sceneModule.endDate)
      return { startTime, endTime }
    }
    const ONE_DAY_MS = 24 * 3600 * 1000

    const disabledDateFn = (time) => {
      const { startTime, endTime } = getTimeRange()
      return time.getTime() < startTime - ONE_DAY_MS || time.getTime() > endTime
    }

    const disabledHours = () => {
      const { startTime, endTime } = getTimeRange()
      const a = []
      for (let i = 0; i < 24; i++) {
        if (i < startTime.getHours()) a.push(i)
        if (i > endTime.getHours()) a.push(i)
      }
      return a
    }

    const disabledMinutes = (hour) => {
      const { startTime, endTime } = getTimeRange()
      const a = []
      if (hour === startTime.getHours()) {
        for (let i = 0; i < 60; i++) {
          if (i < startTime.getMinutes()) a.push(i)
        }
      }
      if (hour === endTime.getHours()) {
        for (let i = 0; i < 60; i++) {
          if (i > endTime.getMinutes()) a.push(i)
        }
      }

      return a
    }

    const disabledSeconds = (hour, mins) => {
      const { startTime, endTime } = getTimeRange()
      const a = []
      if (hour === startTime.getHours() && mins === startTime.getMinutes()) {
        for (let i = 0; i < 60; i++) {
          if (i < startTime.getSeconds()) a.push(i)
        }
      }
      if (hour === endTime.getHours() && mins === endTime.getMinutes()) {
        for (let i = 0; i < 60; i++) {
          if (i > endTime.getSeconds()) a.push(i)
        }
      }

      return a
    }
    const comuptedTime = () => {
      if (state.startTime && state.endTime) {
        let sTime = new Date(state.startTime)
        let eTime = new Date(state.endTime)
        let time = (eTime.getTime() - sTime.getTime()) % 1000
        let curTime = store.state.experimentModule.reviewTime
        state.curTimeRate = Number(((curTime / time) * 10).toFixed())
      }
    }

    const effectTime = () => {
      if (state.effectStartTime && state.effectEndTime && state.timeInfo) {
        let sTime2 = new Date(state.timeInfo).getTime() / 1000
        let sTime = new Date(state.effectStartTime).getTime() / 1000
        let eTime = new Date(state.effectEndTime).getTime() / 1000
        let delayTime = sTime - sTime2
        let time = eTime - sTime
        let curTime = state.reviewTime - delayTime
        if (curTime < 0) {
          state.curTimeRate = 0
        } else {
          state.curTimeRate = ((curTime / time) * 100).toFixed()
        }
        if (state.curTimeRate > 100) {
          state.curTimeRate = 100
          if (state.continueReviewContent) {
            fpPause()
            state.continueReviewContent = false
            ElMessageBox.confirm(
              '当前复盘内容已播放完毕，是否结束观看?',
              '提示',
              {
                confirmButtonText: '结束',
                cancelButtonText: '继续',
                type: 'warning'
              }
            )
              .then(() => {
                fpStop()
              })
              .catch(() => {
                ElMessage.info('继续播放')
                fpResume()
              })
          }
        }
      }
    }

    const startsCreateBox = (row) => {
      window.localStorage.setItem('isRestartScene', false)
      window.localStorage.setItem('currentSceneInfo', JSON.stringify(row))
      // // 开启加载动画
      // loadingControl()
      // 通过切换地球实现地球初始化
      store.state.sceneModule.showEarth = !store.state.sceneModule.showEarth
      // 开启实验加载过程动画
      const timeoutId4 = setTimeout(() => {
        store.state.sceneModule.showSatellite = true
      }, 500)
      timers.timeouts.push(timeoutId4)
      sceneInfoConfig(row)
      configldrw(store.state.sceneModule.sceneInfo.name)
      // 地球切换完成后才开始实验
      // emitter.on('startExperiment', (value) => {})
      startExperiment(row.id).then((res) => {
        if (res.code != 200) {
          return (
            ElMessage.error(res.data) ||
            ElMessage.error('网络请求失败,请稍后重试！')
          )
        }
        // 开启实验加载过程
        // ElMessage.success(`[${row.name}]${res.data}!`)
        // store.state.sceneModule.experimentInfo.name = row.name
        // store.state.sceneModule.experimentInfo.info = res.data

        if (EventController) {
          eventControllerSSEClose(EventController)
        }
        EventController = new window.EarthPlugn.EventSourceController({
          baseUrl: serverUrls.serversCommunication
        })
        EventController.initStream()
        // _startExperimentReport()
        // switch (row.id) {
        //   case '11':
        //     initFlyTo()
        //     break

        //   default:
        //     break
        // }
        // 绘制对应场景作战区域数据
        // 获取对应场景作战区域数据
        // zzqy(row.scenarioId)
      })
    }
    /**
     * 继续试验
     * @param row 实验id
     */
    const ContinueRunCurrentScene = (row) => {
      window.localStorage.setItem('isRestartScene', false)
      window.localStorage.setItem('currentSceneInfo', JSON.stringify(row))
      // 开启加载动画
      // loadingControl()
      sceneInfoConfig(row)
      configldrw(store.state.sceneModule.sceneInfo.name)
      if (EventController) {
        eventControllerSSEClose(EventController)
      }
      EventController = new window.EarthPlugn.EventSourceController({
        baseUrl: serverUrls.serversCommunication
      })
      EventController.initStream()
      // _startExperimentReport()
      // switch (row.id) {
      //   case '11':
      //     initFlyTo()
      //     break

      //   default:
      //     break
      // }
      // 绘制对应场景作战区域数据
      // zzqy(row.scenarioId)
    }
    // 选择实验（初始或者继续）后配置当前场景信息
    const sceneInfoConfig = (row) => {
      console.log('row', row)
      store.state.sceneModule.sceneInfo = row
      // 如果想要使用本地配置则修改localSceneInfo的useCurrentConfig为true
      if (EarthAPP.localSceneInfo.useCurrentConfig) {
        store.state.sceneModule.sceneInfo = EarthAPP.localSceneInfo
      }
    }

    const getCurentEntitiesCount = () => {
      const intervalId = setInterval(() => {
        // if (MSIMEarthCZMLProcessContainer) {
        //   // state.entitiesCount = '当前场景内实体数量：'+MSIMEarthCZMLProcessContainer.entities.values.length
        //   state.entitiesCount = '当前场景内实体数量：'+window.EarthViewer.entities.values.length
        //   console.log(state.entitiesCount)
        // }
        if (window.EarthViewer) {
          state.entitiesCount =
            '当前场景内实体数量：' +
            window.EarthViewer.scene.primitives._primitives.length //window.EarthViewer.entities.values.length
        }
      }, 1000)
      timers.intervals.push(intervalId)
    }
    /**
     * 实验列表点击事件
     */
    const changeList = () => {
      state.leftShow = !state.leftShow
      store.commit('set_isSimulationList', !state.leftShow)
      store.commit('set_isSampleDetail', false)
    }
    const showRadar = () => {
      function infoConfig(res, text) {
        let info = res['operation'][text]
        let jd = 0
        if (typeof info === 'undefined') {
          info = res['method'][text]
          jd = 1
          if (typeof info === 'undefined') {
            info = res['phase'][text]
            jd = 2
          }
        }
        return {
          info: info,
          jd: jd
        }
      }
      getOperationInof().then((res) => {
        let { info, jd } = infoConfig(res, 'suicide attack')
        switch (jd) {
          case 0:
            store.state.sceneModule.identifyColor = {
              color1: 'rgba(19, 240, 240, 0.26)',
              color2: 'rgba(0, 255, 195, 0)',
              textShadow1: '#00ffc3',
              textShadow2: '#00ffc3',
              jd: 0
            }
            break
          case 1:
            store.state.sceneModule.identifyColor = {
              color1: 'rgba(255, 2, 2, 0.06)',
              color2: 'rgba(255, 2, 2, 0.06)',
              textShadow1: '#f63b4c',
              textShadow2: '#f63b4c',
              jd: 1
            }
            break
          case 2:
            store.state.sceneModule.identifyColor = {
              color1: 'rgba(240, 236, 19, 0.26)',
              color2: 'rgba(240, 236, 19, 0.26)',
              textShadow1: '#ecf013',
              textShadow2: '#ecf013',
              jd: 2
            }
            break
          default:
            break
        }
        store.state.sceneModule.identifyInfo = info
        store.state.sceneModule.phasedDescription.push({
          time: '',
          key: 'suicide attack',
          value: info
        })
        store.state.sceneModule.showIdentify = true
      })
    }
    const showRadar2 = () => {
      function infoConfig(res, text) {
        let info = res['operation'][text]
        let jd = 0
        if (typeof info === 'undefined') {
          info = res['method'][text]
          jd = 1
          if (typeof info === 'undefined') {
            info = res['phase'][text]
            jd = 2
          }
        }
        return {
          info: info,
          jd: jd
        }
      }
      getOperationInof().then((res) => {
        let { info, jd } = infoConfig(
          res,
          'at all costs, area-specific strong perception'
        )
        switch (jd) {
          case 0:
            store.state.sceneModule.identifyColor = {
              color1: 'rgba(19, 240, 240, 0.26)',
              color2: 'rgba(0, 255, 195, 0)',
              textShadow1: '#00ffc3',
              textShadow2: '#00ffc3',
              jd: 0
            }
            break
          case 1:
            store.state.sceneModule.identifyColor = {
              color1: 'rgba(255, 2, 2, 0.06)',
              color2: 'rgba(255, 2, 2, 0.06)',
              textShadow1: '#f63b4c',
              textShadow2: '#f63b4c',
              jd: 1
            }
            break
          case 2:
            store.state.sceneModule.identifyColor = {
              color1: 'rgba(240, 236, 19, 0.26)',
              color2: 'rgba(240, 236, 19, 0.26)',
              textShadow1: '#ecf013',
              textShadow2: '#ecf013',
              jd: 2
            }
            break
          default:
            break
        }
        store.state.sceneModule.identifyInfo = info
        store.state.sceneModule.phasedDescription.push({
          time: '',
          key: 'suicide attack',
          value: info
        })
        emitter.emit('showIdentify', true)
        store.state.sceneModule.showIdentify = true
      })
    }
    const tongxinmoni = () => {
      let startOptions = {
        entityId: 'KJ-500',
        czmlSource: 'MSIMEarthCZMLProcessContainer',
        type: 'Weapon_Warning',
        title: 'KJ-500',
        msg: '发送攻击预警'
      }
      window.sceneAction.popUp.setStyleEffect(startOptions)
      const option = {
        earth: window.MSIMEarth,
        viewer: window.EarthViewer
      }
      const sceneAction = new window.EarthPlugn.sceneAction(option)
      let color = window.MSIMEarth.Color.fromCssColorString('#e9670aa3')
      sceneAction.connectLineManagement.addLineByRay({
        sourId: 'KJ-500',
        targetId: 'gj-11_4',
        color: color,
        type: 'Weapon_Warning',
        width: 32,
        Raywidth: 8,
        mix: 1.0,
        show: true,
        endOptions: {
          entityId: 'gj-11_4',
          czmlSource: 'MSIMEarthCZMLProcessContainer',
          type: 'Weapon_Warning',
          title: 'gj-11_4',
          msg: '接收攻击预警'
        },
        materialImg: `/public/static/image/texture/materiallineF2.png`
      })
    }
    const test = () => {
      let cameraController = new window.EarthPlugn.CameraControl({})
      let option = {
        flyArr: [
          {
            position: {
              x: -3988512.2711926647,
              y: 7154964.368865551,
              z: 2820126.23336271
            },
            duration: 2,
            orientation: {
              heading: 0.025082752943152542,
              pitch: -1.3160234488933868,
              roll: 0.000014032089539206538
            },
            flyInterval: 5000
          },
          {
            position: {
              x: -2984323.637431134,
              y: 5029556.585663191,
              z: 2580914.1324627097
            },
            duration: 2,
            orientation: {
              heading: 0.1332615221475404,
              pitch: -0.36019124720576956,
              roll: 6.28175815570365
            },
            flyInterval: 1000
          }
          // {
          //   position: {
          //     x: 119.4316,
          //     y: 26.8142,
          //     z: 300000
          //   },
          //   duration: 2,
          //   orientation: {
          //     heading: 6.283185307179586,
          //     pitch: -1.570670086201004,
          //     roll: 0
          //   }
          // },
          // {
          //   position: {
          //     x: 119.5316,
          //     y: 25.7142,
          //     z: 300000
          //   },
          //   duration: 2,
          //   orientation: {
          //     heading: 6.283185307179586,
          //     pitch: -1.570670086201004,
          //     roll: 0
          //   }
          // }
        ],
        time: 200,
        id: 'test1',
        show: true,
        message:
          '据台媒“联合新闻网”报道，台湾高雄兴达电厂9日晚新2号燃气复循环机组在测试时突发爆炸，现场火光冲天。所幸此次事故未造成人员伤亡。',
        rendered: false,
        curFly: 0,
        flyInterval: 1000
      }
      cameraController.flyRecursion(option)
      // let options = [
      //   {
      //     position: {
      //       x: 119.3316,
      //       y: 26.9142,
      //       z: 300000
      //     },
      //     duration: 2,
      //     orientation: {
      //       heading: 6.283185307179586,
      //       pitch: -1.570670086201004,
      //       roll: 0
      //     },
      //     time: 1000,
      //     id: 'test1',
      //     show: true,
      //     message:
      //       '据台媒“联合新闻网”报道，台湾高雄兴达电厂9日晚新2号燃气复循环机组在测试时突发爆炸，现场火光冲天。所幸此次事故未造成人员伤亡。'
      //   },
      //   {
      //     position: {
      //       x: 119.3316,
      //       y: 26.9142,
      //       z: 300000
      //     },
      //     duration: 2,
      //     orientation: {
      //       heading: 6.283185307179586,
      //       pitch: -1.570670086201004,
      //       roll: 0
      //     },
      //     time: 7000,
      //     id: 'test1',
      //     show: false
      //   },
      //   {
      //     position: {
      //       x: 119.5316,
      //       y: 26.9142,
      //       z: 300000
      //     },
      //     duration: 2,
      //     orientation: {
      //       heading: 6.283185307179586,
      //       pitch: -1.570670086201004,
      //       roll: 0
      //     },
      //     time: 7100,
      //     id: 'test2',
      //     show: true,
      //     message:
      //       '据台媒“联合新闻网”报道，台湾高雄兴达电厂9日晚新2号燃气复循环机组在测试时突发爆炸，现场火光冲天。所幸此次事故未造成人员伤亡。'
      //   },
      //   {
      //     position: {
      //       x: 119.5316,
      //       y: 26.9142,
      //       z: 300000
      //     },
      //     duration: 2,
      //     orientation: {
      //       heading: 6.283185307179586,
      //       pitch: -1.570670086201004,
      //       roll: 0
      //     },
      //     time: 13000,
      //     id: 'test2',
      //     show: false
      //   }
      // ]
      // cameraController.flyByNode(options)
    }
    const getIsInsideCircleByPoint = (
      circleCenterPointArr,
      radius,
      pointArr
    ) => {
      // 创建一个圆形要素 longitude、latitude为圆心经度和纬度，radius为半径 单位KM
      radius = Number(radius / 1000)
      let circle = window.turf.circle(circleCenterPointArr, radius)
      let point = window.turf.point(pointArr)
      let isInsideCircle = window.turf.booleanWithin(point, circle)
      // 多边形判断方式
      let polygon = window.turf.polygon([circle.geometry.coordinates[0]])
      isInsideCircle = window.turf.booleanPointInPolygon(point, polygon)
      return isInsideCircle
    }
    const createPolygon = (circleCenterPointArr, radius) => {
      radius = Number(radius / 1000)
      let circle = window.turf.circle(circleCenterPointArr, radius)
      console.log('circle.geometry.coordinates[0]', circle.geometry.coordinates)
      let polygon = window.turf.polygon(
        [circle.geometry.coordinates[0].map((p) => [p[0], p[1]])],
        { combine: 'yes' }
      )
      return polygon
    }
    //*************时间控制 */

    // -----------------------------
    // 节流工具：限制一定时间内只执行一次（防止快速重复点击）
    // -----------------------------
    const throttle = (fn, delay = 500) => {
      let last = 0
      return function (...args) {
        const now = Date.now()
        if (now - last >= delay) {
          last = now
          fn.apply(null, args)
        }
      }
    }

    // -----------------------------
    // 防抖工具：最后一次触发后 delay 毫秒才执行（下拉选值变化）
    // -----------------------------
    const debounce = (fn, delay = 300) => {
      let timer = null
      return function (...args) {
        if (timer) clearTimeout(timer)
        timer = setTimeout(() => fn.apply(null, args), delay)
      }
    }

    // 复盘暂停后开始
    const fpResume = throttle(() => {
      fpResumeService()
      window.EarthViewer.clock.shouldAnimate = true
    }, 800)

    // 复盘暂停
    const fpPause = throttle(() => {
      window.EarthViewer.clock.shouldAnimate = false
      fpPauseService().then((res) => {
        if (res.code === 200) {
          console.log('复盘场景暂停成功')
        }
      })
    }, 800)

    // 复盘加减速
    const fpClockRate = throttle(() => {
      fpSetclockRateService({ clockrate: state.clockRate }).then((res) => {
        if (res.code === 200) {
          console.log('当前倍率', res.data.clockRate)
          window.EarthViewer.clock.multiplier = parseFloat(res.data.clockrate)
          window.EarthViewer.clock.shouldAnimate = true
          EarthAPP.timeC = res.data.clockrate * EarthAPP.timeVal
          console.log(
            '当前倍率',
            window.EarthViewer.clock.multiplier,
            EarthAPP.timeC
          )
          if (res.data.clockrate === 1) {
            EarthAPP.timeC = EarthAPP.dTime
          }
          const restartStreamTimer = setTimeout(() => {
            EventController.restartStream()
          }, 1000)
          timers.timeouts.push(restartStreamTimer)
        }
      })
    }, 800)

    // test
    const test111 = () => {
      getTaskInfo('0526002')
    }
    // 复盘停止
    const fpStop = throttle(() => {
      // 显示正在关闭的 CloseAnimation 效果
      state.isClosing = true
      fpStopService()
        .then((res) => {
          window.sessionStorage.removeItem('has_init_default_time')
          // 清除复盘状态
          store.state.AFSIMModule.fp = false
          store.state.experimentModule.review = false
          // 清除所有定时器
          clearAllTimers()
          // 关闭 SSE 连接
          if (EventController) {
            eventControllerSSEClose(EventController)
          }
          if (res.code === 200) {
            // 延迟关闭页面，让用户能看到动画效果
            setTimeout(() => {
              window.close()
            }, 2000)
          }
        })
        .catch((err) => {
          console.log('停止服务失败', err)
          // 即使服务调用失败，也尝试清理状态并关闭页面
          window.sessionStorage.removeItem('has_init_default_time')
          store.state.AFSIMModule.fp = false
          store.state.experimentModule.review = false
          clearAllTimers()
          if (EventController) {
            eventControllerSSEClose(EventController)
          }
          setTimeout(() => {
            window.close()
          }, 2000)
        })
    }, 1500)

    //控制倍速（下拉框：防抖避免频繁修改）
    const controlSpeed = debounce((val) => {
      state.clockRate = parseInt(val)
    }, 300)

    // 销毁连接
    function destroyConnection() {
      if (currentSubscribe.value) {
        currentSubscribe.value.unsubscribe()
      }

      if (client.value) {
        client.value.disconnect(() => {
          console.log('已关闭rabbitmq连接')
        })
      }
    }
    // changeProcess
    const changeProcess = () => {
      state.showProcessConfig = !state.showProcessConfig
    }
    // 时间向前跳转
    const advanceToTime = throttle(() => {
      console.log('跳转时间', state.timeInfo)
      const currtentSceneTime = new Date(state.timeInfo)
      // const startSceneTime = new Date('2027-09-12 10:00:00') //new Date(state.startTime)
      const startSceneTime = new Date(store.state.sceneModule.startDate)
      let timeDif =
        (currtentSceneTime.getTime() - startSceneTime.getTime()) / 1000
      console.log(
        '当前时间',
        state.timeInfo,
        timeDif,
        currtentSceneTime,
        startSceneTime
      )
      if (timeDif <= 0) {
        // el-message 调整的时间智能向前
        return
      }
      console.log('调整的时间', timeDif)
      fpSetadvancetotime({ time: timeDif })
        .then((res) => {
          console.log('res', res)
          if (res.code === 200) {
            setTimeout(() => {
              // window.location.reload()
              EventController.restartStream()
            }, 1000)
          }
        })
        .catch((err) => {
          console.log('时间跳转失败', err)
        })
    }, 1200)
    //控制器、进度条收缩
    const changeRight = () => {
      state.rightShow = !state.rightShow
    }
    //场景配置面板开关
    const toggleSceneConfig = () => {
      state.showSceneConfig = !state.showSceneConfig
    }
    return {
      value,
      ...toRefs(state),
      showTree,
      showRadar,
      showRadar2,
      changeList,
      tongxinmoni,
      fpResume,
      fpPause,
      fpClockRate,
      fpStop,
      controlSpeed,
      changeProcess,
      advanceToTime,
      test111,
      disabledDateFn,
      disabledHours,
      disabledMinutes,
      disabledSeconds,
      changeRight,
      toggleSceneConfig
    }
  }
}
</script>
<style lang="less" scoped>
.home {
  width: 100%;
  height: 100%;

  #toogle-btn {
    z-index: 100;
    position: absolute;
    top: 20px;
    right: 100px;
  }

  #toogle-btn2 {
    z-index: 100;
    position: absolute;
    top: 60px;
    right: 60px;
    color: red;
  }

  #toogle-btn3 {
    z-index: 100;
    position: absolute;
    top: 20px;
    right: 100px;
  }

  #toogle-btn4 {
    z-index: 100;
    position: absolute;
    top: 80px;
    right: 100px;
  }

  #toogle-btn5 {
    z-index: 100;
    position: absolute;
    top: 120px;
    right: 100px;
  }

  .toogle {
    position: absolute;
    top: 110px;
    right: 100px;
    z-index: 100;

    #toogle-btn3 {
      z-index: 100;
      // position: absolute;
      // top: 200px;
      // right: 100px;
    }
  }

  /* 左侧侧边栏伸缩按钮样式 */
  .left-sidebar {
    position: fixed;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;

    .toggle-button {
      cursor: pointer;
      width: 14px;
      height: 24px;
      z-index: 100;
      filter: drop-shadow(0 0 10px rgba(6, 214, 249, 0.6));
    }
  }

  /* 底部预留区域样式 */
  .bottom-panel-placeholder {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 150px;
    z-index: 10;
    pointer-events: none;
    /* 这里可以添加背景或其他占位样式 */
  }
}

.home {
  height: 100%;
  width: 100%;
}

/* .test-height {
    position: fixed;
    right: 135px;
    bottom: 300px;
    color: white;
    z-index: 9999;
    display: block;
    font-weight: bold;
    font-size: 26px;
  }

  .test-height::before,
  .test-height::after {
    content: attr(data-cotent);
    -webkit-text-stroke: 1px red;
    position: absolute;
    left: 0;
    top: 0;
    z-index: 1;
    display: block;
    color: red
  } */

.text-stroke {
  -webkit-text-stroke: 1px #fff;
  -webkit-text-fill-color: #000;
  -webkit-text-stroke-width: thin;
}

.voice {
  position: absolute;
  bottom: 10px;
  right: 10px;
  z-index: 999;
  // width:300px!important;
}

#time-div {
  position: absolute;
  z-index: 99;
  left: 100px;
  top: 30px;
  font-size: 30px;
  color: rgb(14, 203, 233);
}

#trailer {
  position: absolute;
  z-index: 99;
  top: 290px;
  left: 162px;
  width: 500px;
  height: 450px;
}

.conclusion_plan {
  position: absolute;
  top: 12%;
  left: 50%;
  transform: translate(-50%, 0%);
}

.panelCom.bottom_panel {
  z-index: 0;
}

.processConfig {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 10px);
  z-index: 12;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(2, 26, 70, 0.9);
  border: 1px solid rgba(16, 146, 213, 0.75);
  box-shadow: 0 0 22px rgba(16, 146, 213, 0.45);
  transform: translateX(-50%);
  backdrop-filter: blur(6px);

  :deep(.el-button) {
    min-width: 58px;
    height: 32px;
    padding: 0 16px;
    color: #dff8ff;
    background: rgba(7, 93, 137, 0.85);
    border: 1px solid rgba(0, 199, 251, 0.75);
    box-shadow: 0 0 10px rgba(16, 146, 213, 0.35) inset;
    transition: transform 120ms ease, background-color 150ms ease,
      box-shadow 150ms ease, border-color 150ms ease;
    cursor: pointer;
    user-select: none;
  }

  :deep(.el-button:hover) {
    color: #ffffff;
    background: rgba(0, 123, 204, 0.9);
    border-color: #06d6f9;
    box-shadow: 0 0 12px rgba(16, 146, 213, 0.6);
  }

  :deep(.el-button:active) {
    transform: scale(0.92);
    background: rgba(3, 95, 158, 0.95);
    border-color: #0288d1;
    box-shadow: 0 0 6px rgba(16, 146, 213, 0.8) inset;
  }

  :deep(.el-button.is-disabled) {
    cursor: not-allowed;
    opacity: 0.55;
    transform: none;
  }

  :deep(.el-date-editor) {
    width: 220px;
  }

  :deep(.el-input__wrapper) {
    background: rgba(4, 29, 72, 0.9);
    border: 1px solid rgba(0, 199, 251, 0.55);
    box-shadow: none;
  }

  :deep(.el-input__inner),
  :deep(.el-input__prefix) {
    color: #dff8ff;
  }
}

.panelCom {
  position: absolute;
  z-index: 5;

  &.left_panel {
    top: 90px;
    left: 20px;
    width: 302px;
    height: 500px;
    animation: slideInLeft 3s;
  }

  &.move_out {
    display: none;
    animation: aims 1s ease-in-out;
  }

  @keyframes aims {
    0% {
      opacity: 1;
    }

    100% {
      opacity: 0;
    }
  }

  &.right_panel {
    top: 90px;
    right: 20px;
    width: 302px;
    height: 500px;
    animation: slideInRight 3s;
  }

  &.bottom_panel {
    left: 20px;
    right: 20px;
    bottom: 20px;
    height: 110px;

    // animation: slideInUp 3s;
    .wrap {
      width: 65%;
      left: 17.5%;
    }
  }
}

.search-container {
  position: absolute;
  right: 2%;
  bottom: 4%;

  :deep(.el-input__icon) {
    cursor: pointer;
  }
}

.slide-enter-active,
.slide-leave-active {
  transition: transform 0.5s ease-in-out;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateX(100%);
}

:deep(.panel_comp .wrap) {
  background-image: url('@/assets/image/时间轴.png');
  background-repeat: no-repeat;
  /* 可选，设定是否重复背景图片 */
  background-size: 100% 100%;
  /* 可选，设定背景图片的尺寸和位置 */
  // border: none;
  // border: 1px solid rgb(1, 1, 1);
}

.navbar_box {
  position: fixed;
  right: 10px;
  bottom: 100px;
}

.timeReplayBar {
  position: absolute;
  left: 22%;
  bottom: 24px;
  z-index: 11;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: min(1080px, calc(100vw - 48px));
  // transform: translateX(-50%);
}

.timeControlDiv {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 10px;
  height: 58px;
  box-sizing: border-box;
  padding: 10px 14px;
  background: rgba(2, 26, 70, 0.88);
  border: 1px solid rgba(16, 146, 213, 0.75);
  box-shadow: 0 0 25px rgba(16, 146, 213, 0.55);
  backdrop-filter: blur(6px);

  :deep(.el-button) {
    min-width: 62px;
    height: 34px;
    padding: 0 16px;
    color: #dff8ff;
    font-size: 14px;
    background: rgba(43, 69, 89, 0.9);
    border: 1px solid #075d89;
    box-shadow: 0 0 10px rgba(16, 146, 213, 0.28) inset;
    transition: transform 120ms ease, background-color 150ms ease,
      box-shadow 150ms ease, border-color 150ms ease;
    cursor: pointer;
    user-select: none;
  }

  :deep(.el-button:hover),
  :deep(.el-button:focus) {
    color: #ffffff;
    background: rgba(0, 123, 204, 0.9);
    border-color: #06d6f9;
    box-shadow: 0 0 14px rgba(16, 146, 213, 0.65);
  }

  :deep(.el-button:active) {
    transform: scale(0.92);
    background: rgba(3, 95, 158, 0.95);
    border-color: #0288d1;
    box-shadow: 0 0 6px rgba(16, 146, 213, 0.8) inset;
  }

  :deep(.el-button.is-disabled) {
    cursor: not-allowed;
    opacity: 0.55;
    transform: none;
  }

  :deep(.el-button.active) {
    background: rgba(0, 153, 255, 0.85);
    border-color: #00d4ff;
    color: #ffffff;
    box-shadow: 0 0 18px rgba(0, 212, 255, 0.75);
  }
}

.clockRateSelect {
  width: 96px;

  :deep(.el-input__wrapper) {
    min-height: 34px;
    background: rgba(4, 29, 72, 0.9);
    border: 1px solid rgba(0, 199, 251, 0.55);
    box-shadow: none;
  }

  :deep(.el-input__wrapper:hover),
  :deep(.el-input__wrapper.is-focus) {
    border-color: #06d6f9;
    box-shadow: 0 0 12px rgba(16, 146, 213, 0.45);
  }

  :deep(.el-input__inner),
  :deep(.el-select__caret) {
    color: #dff8ff;
  }
}

.progress-bar-clickable {
  cursor: pointer;
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 0.85;
  }
}

.time_box {
  position: relative;
  flex: 1 1 480px;
  height: 58px;
  min-width: 360px;
  box-sizing: border-box;
  padding: 13px 18px;
  background: rgba(2, 26, 70, 0.82);
  border: 1px solid rgba(16, 146, 213, 0.68);
  box-shadow: 0 0 24px rgba(16, 146, 213, 0.5);
  backdrop-filter: blur(6px);

  > div:first-child {
    height: 100%;
    display: flex;
    align-items: center;
  }

  .el-progress--line {
    width: 100%;
    margin-bottom: 0;
  }

  :deep(.el-progress-bar__outer) {
    height: 12px !important;
    background-color: rgba(255, 255, 255, 0.14);
    border: 1px solid rgba(0, 199, 251, 0.26);
  }

  :deep(.el-progress-bar__inner) {
    background: linear-gradient(90deg, #06d6f9 0%, #00ffc3 100%);
    box-shadow: 0 0 14px rgba(0, 255, 195, 0.6);
  }

  :deep(.el-progress__text) {
    min-width: 64px;
    color: #dff8ff;
    font-size: 18px !important;
    text-shadow: 0 0 8px rgba(6, 214, 249, 0.65);
  }
}
</style>
