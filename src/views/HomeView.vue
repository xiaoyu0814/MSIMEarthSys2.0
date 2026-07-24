<template>
  <div class="home">
    <!-- <button
      style="
        position: absolute;
        top: 200px;
        left: 200px;
        color: aliceblue;
        z-index: 999;
      "
      @click="test4"
    >
      test
    </button>
    <button
      style="
        position: absolute;
        top: 200px;
        left: 300px;
        color: aliceblue;
        z-index: 999;
      "
      @click="test5"
    >
      图层控制
    </button> -->
    <!-- <button
      style="
        position: absolute;
        top: 200px;
        left: 300px;
        color: aliceblue;
        z-index: 999;
      "
      @click="test5"
    >
      test2
    </button> -->
    <earth-viewer> </earth-viewer>
    <graph-viewer v-show="showGraphDiv"></graph-viewer>
    <!-- 标题 联合作战仿真推演分析系统 防空反导虚数结合训练系统-->
    <Transition name="custom-classes" enter-active-class="animate__animated animate__backInDown animate__delay-10s"
      leave-active-class="animate__animated animate__fadeOutUp">
      <div class="animate__animated animate__backInDown animate__delay-10s" style="position: relative; z-index: 2">
        <home-header :title="systemTitle"> </home-header>
      </div>
    </Transition>
    <!-- 场景面板切换组件 包括 左侧/右侧/底部/场景中间四大模块 -->
    <scene-page></scene-page>
    <Transition name="custom-classes" enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut">
      <div>
        <component :is="sceneConfigComp.name" :="sceneConfigComp.props"></component>
      </div>
    </Transition>
    <!-- 工具条显隐开关按钮 -->
    <toolbar @showTree="showTree"></toolbar>
    <!-- 页面弹窗组件 -->
    <child-comp></child-comp>
    <BubbleDiv></BubbleDiv>
    <BubbleDiv3></BubbleDiv3>
    <identify v-if="showIdentify"></identify>
    <!-- 系统配置 -->
    <systemConfig v-if="showSystemConfig" class="animate__animated animate__backInDown animate__delay-10s">
    </systemConfig>
    <router-view></router-view>
    <experimentalDataAnalysis v-if="$store.state.experimentalDataAnalysis_visible" />
    <experimentalBasicDatabase v-if="$store.state.experimentalBasicDatabase_visible" />
    <sceneConstruction v-if="$store.state.url == 'sceneConstruction'" />
    <conceptDevelopment v-if="$store.state.url == 'conceptDevelopment'" />
    <dataConfig v-if="$store.state.url == 'dataConfig'" />
    <experimentEventList v-if="showExperimentEventList" :showList="showExperimentEventList" />
    <BLEventList v-if="showBlEventList" />
    <!-- AI聊天 -->
    <!-- <ul class="navbar_box">
      <li v-for="(item, index) in list" :key="index" @click="showAI = !showAI">
        <img :src="showAI ? item.select_img : item.img" :alt="item.label" />
      </li>
    </ul> -->
    <!-- <AIchat v-if="showAI" /> -->
    <loading v-if="showLoading" :loading-text="loadingText"></loading>
    <div v-show="plateFormCategoryStatisticShow" style="
        position: absolute;
        bottom: 20%;
        right: 5%;
        z-index: 999;
        color: aliceblue;
        width: 200px;
        height: 150px;
        font-size: 20px;
      ">
      <div>
        <h3>固定目标：{{ PAStatisticCount }}</h3>
      </div>
      <div>
        <h3>有人装备：{{ yrCount }}</h3>
      </div>
      <div>
        <h3>无人装备：{{ wrCount }}</h3>
      </div>
      <div>
        <h3>防空装备：{{ fkCount }}</h3>
      </div>
      <div>
        <h3>多实例数量：{{ tsydCount }}</h3>
      </div>
    </div>
    <result v-show="tyResultShow"></result>
    0.0<img id="transferFunctionImg" />1.0
  </div>
</template>

<script>
// @ is an alias to /src
import EarthViewer from '@/views/3D/EarthViewer.vue'
import HomeHeader from '@/views/homeHeader/HomeHeader'
import systemConfig from '@/components/systemConfig/index.vue'
// 场景面板展示操控组件
import ScenePage from '@/views/scenePage/index.vue'
import childComp from '@/views/hooks/childComp/index.vue'
import toolbar from '@/views/toolbar/index.vue'
import BubbleDiv from '@/utils/bubble/BubbleDiv'
import BubbleDiv3 from '@/utils/bubble/BubbleDiv3'
import identify from '@/components/content/identify/identify'

import loading from '@/components/content/loading.vue'
import GraphViewer from '@/views/3D/GraphViewer.vue'
import result from '@/views/scenePage/sceneConfigComp/result/index.vue'
import experimentEventList from './experimentEventList.vue'
import BLEventList from '@/views/bianzudaotiao/index.vue'

import { getCloudList } from '@/utils/earthPlugin/core/treeManagement/methods/cloud'
import { getHumidityList } from '@/utils/earthPlugin/core/treeManagement/methods/humidity'
import { getTurbulenceList } from '@/utils/earthPlugin/core/treeManagement/methods/turbulence'
// 导入hooks
import { useStore } from 'vuex'
import {
  reactive,
  ref,
  toRefs,
  onMounted,
  onUnmounted,
  watch,
  nextTick,
  computed
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
import { eventControllerSSEClose } from '@/utils/mapTools'
import { moveCamera } from '@/service/directingAdjusting'
import { getPlatformParts, getPlatformSensorVolumes } from '@/service/afsim'
import { sensorInfoDict, updateSensorVolume } from '@/utils/earthPlugin/ThirdParty/eventSource/event/earthEvent/state/stateControlMethods'

import * as dat from 'dat.gui'
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
    experimentalDataAnalysis,
    experimentalBasicDatabase,
    AIchat,
    sceneConstruction,
    conceptDevelopment,
    dataConfig,
    GraphViewer,
    result,
    experimentEventList,
    BLEventList
  },
  setup() {
    window.isBack = true
    let currentSeat = localStorage.getItem('systemTitle')
    const store = useStore()
    const state = reactive({
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
      showExperimentEventList: false,
      showBlEventList: false,
      systemTitle: '数据资源中心-' + currentSeat, // 系统标题
      showBlEventList: false,
      side: localStorage.getItem('side'), // 席位
      ttt: 0,
      socketApi_doc: null,
      showLoading: true, //是否显示loading
      loadingText: '推演环境正在初始化', //loading提示文字
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
      PAStatisticCount: 0, //静态
      yrCount: 0, //有人平台
      wrCount: 0, //无人平台
      fkCount: 0, // 地面防空
      tsydCount: 0, // 同时运动平台
      stPlatefromStatistic: null,
      tyResultShow: false,
      layerGui: null,
      intervalArr: [],
      volumeUpdateInterval: 500,
      sensorVolumeTimer: null
    })
    if (EarthAPP.systemTitle != '') {
      state.systemTitle = EarthAPP.systemTitle
    }

    // 实验列表
    watch(
      () => store.getters.get_isSimulationList,
      (newVal) => {
        state.isShowScene = !newVal
      },
      { deep: true, immediate: true }
    )
    watch(
      () => store.state.sceneModule.systemConfig.plateFormCategoryStatisticShow,
      (newVal) => {
        if (newVal) {
          state.stPlatefromStatistic = setInterval(() => {
            state.PAStatisticCount =
              statisticPlateformCount() + statisticFKPlateformCount()
            state.tsydCount = statisticTSYDPlateformCount()
            state.yrCount = statisticYRPlateformCount()
            state.wrCount = statisticWRPlateformCount()
            state.fkCount = statisticFKPlateformCount()
          }, 5)
        } else {
          // 关闭统计
          if (state.stPlatefromStatistic) {
            clearInterval(state.stPlatefromStatistic)
            state.stPlatefromStatistic = null
          }
        }
      },
      { deep: true, immediate: true }
    )
    // 每次进入场景同步上次高倍速时间差
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

    const PAStatisticCount = computed(() => {
      return state.PAStatisticCount
    })

    const yrCount = computed(() => {
      return state.yrCount
    })

    const wrCount = computed(() => {
      return state.wrCount
    })

    const fkCount = computed(() => {
      return state.fkCount
    })

    const tsydCount = computed(() => {
      return state.tsydCount
    })
    const plateFormCategoryStatisticShow = computed(() => {
      return store.state.sceneModule.systemConfig.plateFormCategoryStatisticShow
    })

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
      }, 1000)

      reconnaissancePromptTimers.set(platformName, timer)
    }

    // 统计PA类别平台数量
    const statisticPlateformCount = () => {
      // PA
      let paCount = window.EarthViewer.entities.values.length
      // window.EarthViewer.entities.values.forEach((e) => {
      //   if (e.properties) {
      //     paCount += 1
      //   }
      // })
      return paCount
    }
    // 统计有人类别平台数量
    const statisticYRPlateformCount = () => {
      let yrCount = 0
      yrCount = state.tsydCount - state.wrCount
      return yrCount
    }
    // 统计有无类别平台数量
    const statisticWRPlateformCount = () => {
      let wrCount = 0
      window.EarthViewer.entities.values.forEach((e) => {
        EarthAPP.plateformStatistic.wr.forEach((r) => {
          if (
            typeof e.properties === 'undefined' ||
            typeof e.properties.airplaneAction === 'undefined' ||
            typeof e.properties.airplaneAction._value === 'undefined'
          )
            return
          if (r === e.properties.airplaneAction._value.type) {
            wrCount += 1
          }
        })
      })
      // MSIMEarthCZMLProcessContainer.entities.values.forEach((e) => {
      //   EarthAPP.plateformStatistic.wr.forEach((r) => {
      //     if (!e.properties) return
      //     if (r === e.properties.airplaneAction._value.type) {
      //       wrCount += 1
      //     }
      //   })
      // })
      window.EarthViewer.scene.primitives._primitives.forEach((e) => {
        EarthAPP.plateformStatistic.wr.forEach((r) => {
          if (typeof e.Type === 'undefined') return
          if (r === e.Type) {
            wrCount += 1
          }
        })
      })
      return wrCount
    }
    // 统计防空类别平台数量
    const statisticFKPlateformCount = () => {
      let fkCount = 0
      window.EarthViewer.entities.values.forEach((e) => {
        EarthAPP.plateformStatistic.fk.forEach((r) => {
          if (
            typeof e.properties === 'undefined' ||
            typeof e.properties.airplaneAction === 'undefined' ||
            typeof e.properties.airplaneAction._value === 'undefined'
          )
            return
          if (r === e.properties.airplaneAction._value.type) {
            fkCount += 1
          }
        })
      })
      // MSIMEarthCZMLProcessContainer.entities.values.forEach((e) => {
      //   EarthAPP.plateformStatistic.fk.forEach((r) => {
      //     if (!e.properties) return
      //     if (r === e.properties.airplaneAction._value.type) {
      //       fkCount += 1
      //     }
      //   })
      // })
      window.EarthViewer.scene.primitives._primitives.forEach((e) => {
        EarthAPP.plateformStatistic.fk.forEach((r) => {
          if (typeof e.Type === 'undefined') return
          if (r === e.Type) {
            fkCount += 1
          }
        })
      })
      return fkCount
    }
    // 统计同时移动类别平台数量
    const statisticTSYDPlateformCount = () => {
      let tsydCount = 0
      tsydCount = window.EarthViewer.scene.primitives._primitives.length //MSIMEarthCZMLProcessContainer.entities.values.length
      return tsydCount
    }

    //控制图层树显隐
    const showTree = (val) => {
      state.isShowTree = val
    }
    emitter.on('showGraphVal', (val) => {
      state.showGraphDiv = val.show
      if (val.show) {
        setTimeout(() => {
          emitter.emit('showGraphData', val)
        }, 100)
      }
    })
    emitter.on('tyResultShow', (val) => {
      state.tyResultShow = val
    })
    emitter.on('showEventList', (val) => {
      console.log(val)
      state.showExperimentEventList = val
    })
    emitter.on('showBLEventList', (val) => {
      state.showBlEventList = val
    })
    emitter.on('sensorSwitch', (val) => {
      let id = val.platformName + 'atmospheric_influence_sensor'
      if (val.onFlag) {
        let curPosition, newOrientation, targetPosition
        // 如果目标实体不存在或者位置获取不到则返回
        let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
          val.platformName,
          'MSIMEarthCZMLProcessContainer'
        )
        if (!window.MSIMEarth.defined(curEntity)) return
        let curTime = window.EarthViewer.clock.currentTime
        curPosition = curEntity.position.getValue(curTime)
        if (typeof curPosition === 'undefined') return
        let cf = function () {
          getPlatformParts({ platform: val.platformName })
            .then((res) => {
              //  Name: 'opt_sensor' 是传感器
              let opt_sensor = res.data.find(
                (item) => item.Name == 'opt_sensor' || item.Name == 'CCD'
              )
              if (opt_sensor.On) {
                // 传感器开启
                let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
                  val.platformName,
                  'MSIMEarthCZMLProcessContainer'
                )
                if (!window.MSIMEarth.defined(curEntity)) return
                let curTime = window.EarthViewer.clock.currentTime
                let fTime = window.MSIMEarth.JulianDate.addSeconds(
                  curTime,
                  0.001 * window.EarthViewer.clock.multiplier,
                  new window.MSIMEarth.JulianDate()
                )
                curPosition = curEntity.position.getValue(curTime)
                let fPosition = curEntity.position.getValue(fTime)

                let targetEntity = window.EarthPlugn.entity._GetCZMLEntity(
                  'M142_1',
                  'MSIMEarthCZMLProcessContainer'
                )
                targetPosition = targetEntity.position.getValue(curTime)
                if (!window.MSIMEarth.defined(targetPosition)) return
                const newVector2 = window.MSIMEarth.Cartesian3.subtract(
                  targetPosition,
                  curPosition,
                  new window.MSIMEarth.Cartesian3()
                )
                const newNormal = window.MSIMEarth.Cartesian3.normalize(
                  newVector2,
                  new window.MSIMEarth.Cartesian3()
                )
                const newRotationMatrix3 =
                  window.MSIMEarth.Transforms.rotationMatrixFromPositionVelocity(
                    newVector2,
                    newNormal,
                    window.MSIMEarth.Ellipsoid.WGS84
                  )
                newOrientation =
                  window.MSIMEarth.Quaternion.fromRotationMatrix(
                    newRotationMatrix3
                  )
              } else {
                // 传感器关闭
              }
            })
            .catch((err) => {
              console.log('获取平台渲染图形信息失败', err)
            })
          return newOrientation
        }
        let cp = function () {
          let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
            val.platformName,
            'MSIMEarthCZMLProcessContainer'
          )
          if (!window.MSIMEarth.defined(curEntity)) return
          let curTime = window.EarthViewer.clock.currentTime
          curPosition = curEntity.position.getValue(curTime)
          if (typeof curPosition === 'undefined') return
          return curPosition
        }
        window.EarthViewer.entities.removeById(id)
        window.EarthViewer.entities.add({
          id: id,
          position: new window.MSIMEarth.CallbackProperty(cp, false),
          orientation: new window.MSIMEarth.CallbackProperty(cf, false),
          ellipsoid: {
            radii: new window.MSIMEarth.Cartesian3(30000.0, 30000.0, 30000.0),
            innerRadii: new window.MSIMEarth.Cartesian3(100.0, 100.0, 100.0),
            minimumClock: window.MSIMEarth.Math.toRadians(-7.5),
            maximumClock: window.MSIMEarth.Math.toRadians(7.5),
            minimumCone: window.MSIMEarth.Math.toRadians(75.0),
            maximumCone: window.MSIMEarth.Math.toRadians(105.0),
            // material: window.MSIMEarth.Color.DARKCYAN.withAlpha(0.1),
            material: window.MSIMEarth.Color.RED.withAlpha(0.2),
            // material: new window.MSIMEarth.PulseMaterialProperty({
            //   repeat: new window.MSIMEarth.Cartesian2(1.0, 1.0),
            //   color: new window.MSIMEarth.Color(1.0, 0.1, 0.1, 1.0), // new window.MSIMEarth.Color(0.8, 0.1, 0.5, 1.0),
            //   flowSpeed: 35.0,
            //   transparent: true
            // }),
            // material: new window.MSIMEarth.frustumMaterialProperty({
            //   transparent: true
            // }),
            outline: true
          }
        })
      } else {
        window.EarthViewer.entities.removeById(id)
      }
    })
    watch(
      () => store.state.sceneModule.showIdentify,
      (newValue) => {
        console.log('homeview', newValue)
        if (newValue) {
          state.showIdentify = newValue
          let sysSoundShow = Number(
            window.localStorage.getItem('systemSoundEnabled')
          )
          // if (!sysSoundShow) {
          //   setTimeout(() => {
          //     // beautyToast.info({
          //     //   title: 'Info',
          //     //   message: '情报回传中',
          //     //   darkTheme: true,
          //     //   animation: true
          //     // })
          //     store.state.sceneModule.showIdentify = false
          //   }, ((identifyDuration * 3 + 5) * 1000) / window.EarthViewer.clock.multiplier) // (identifyDuration * 3 + 10) * 1000  识别动画总时长
          // }
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
          return
          if (!newValue.data || !newValue.data.threat_assessment) return
          let threatAssessment = newValue.data.threat_assessment
          let captainName = threatAssessment[0].unit_name
          let targetsIdArr = []
          if (threatAssessment) {
            threatAssessment.forEach((item) => {
              // 如果item.unit_name为threatAssessment【0】，则添加菱形图标
              let name = item.unit_name
              if (item.unit_name == captainName) {
                name = item.unit_name + '♦♦♦'
              }
              targetsIdArr.push(item.unit_name)
              let options = {
                entityId: item.unit_name,
                name: name,
                czmlSource: 'MSIMEarthCZMLProcessContainer',
                type: 'reconnaissance',
                threatLevel: item.threat_level,
                confidence: Math.floor(item.confidence * 100) / 100 // 保留两位小数但不四舍五入
              }
              // entityMethod.createRotateEntity(
              //   item.unit_name,
              //   2300.0,
              //   'static/image/texture/rotate1.png'
              // )
              window.sceneAction.popUp.cancleStyleEffect(options)
              window.sceneAction.popUp.setStyleEffectByReconnaissanceResults(
                options
              )
            })

            let EF = new window.EarthPlugn.EffectByTurf(
              window.MSIMEarth,
              window.EarthViewer
            )
            // targetIdArr ['red_3', 'red_4']
            EF.removeGroupCircleByTurf(targetsIdArr)
            EF.createGroupCircleByTurf(
              targetsIdArr,
              window.MSIMEarth.Color.BLUE,
              130
            )
            // 增加编组目标闪烁，其中targetsIdArr【0】为队长，其他为队员
          }
        }
      },
      { immediate: true, deep: true }
    )
    onMounted(() => {
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
        if (typeof val === 'boolean') {
          state.showLoading = val
        } else if (typeof val === 'object') {
          state.showLoading = val.show
          if (val.text) {
            state.loadingText = val.text
          }
        }
      })
      getCurentEntitiesCount()
      getCloudList(0)
      getHumidityList(0)
      getTurbulenceList(0)
      // 开启全局包络循环
      state.sensorVolumeTimer = setInterval(() => {
        updateSensorVolume()
      }, state.volumeUpdateInterval)
    })
    onUnmounted(() => {
      window.localStorage.setItem('bluePrint', -1)
      reconnaissancePromptTimers.forEach((timer) => {
        clearTimeout(timer)
      })
      reconnaissancePromptTimers.clear()
      if (state.sensorVolumeTimer) {
        clearInterval(state.sensorVolumeTimer)
        state.sensorVolumeTimer = null
      }
    })

    const getCurentEntitiesCount = () => {
      setInterval(() => {
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
    }
    /**
     * 实验列表点击事件
     */
    const changeList = () => {
      state.leftShow = !state.leftShow
      store.commit('set_isSimulationList', !state.leftShow)
      store.commit('set_isSampleDetail', false)
    }
    function clusterToPoint(clusterArr, clusterId) {
      let cbg = new window.EarthPlugn.ClusterByGroup(
        window.MSIMEarth,
        window.EarthViewer
      )
      cbg.createClusterByGroup(clusterArr, clusterId)
    }
    // 分散
    function distributeGroup(clusterArr, clusterId) {
      let cbg = new window.EarthPlugn.ClusterByGroup(
        window.MSIMEarth,
        window.EarthViewer
      )
      cbg.removeCluster(clusterArr, clusterId)
    }
    const test3 = () => {
      let clusterTarget = store.state.AFSIMModule.reconnaissanceResults
      let clusterArr = [],
        clusterId = '多机协同探测'
      const entityMethod = new window.EarthPlugn.entity({
        earth: window.MSIMEarth,
        viewer: window.EarthViewer
      })

      if (clusterTarget) {
        clusterTarget.data.threat_assessment.forEach((item) => {
          entityMethod.removeRotateEntity(item.unit_name)
          let options = {
            entityId: item.unit_name,
            czmlSource: 'MSIMEarthCZMLProcessContainer'
          }
          window.sceneAction.popUp.cancleStyleEffect(options)
          clusterArr.push(item.unit_name)
        })
      }

      clusterToPoint(clusterArr, clusterId)
      // 根据传感器类型开启对应形态的volumes
      // getPAStatic({ side: '' }).then((res) => {
      //   console.log('获取平台静态信息', res)
      // })
      // setSatelliteType({
      //   satelliteId: 'CH-5',
      //   czmlSource: 'MSIMEarthCZMLProcessContainer',
      //   satelliteType: 'light',
      //   onFlag: true
      // })
      // return
      // getPlatformParts({ platform: 'YAOGAN' })
      //   .then((res) => {
      //     console.log(`11111${res.status}`, res, res.data)
      //   })
      //   .catch((err) => {
      //     console.log('获取平台渲染图形信息失败', err)
      //   })
      // let resupplyCount = '500'
      // let weaponNameVal = 'AAGun35mm'
      // let params = {
      //   platform: 'AAA-1',
      //   resupplyAmmunition: `{"weaponName":"${weaponNameVal}","resupplyCount":"${resupplyCount}"}`
      // }
      // setPlatformJam(params).then((res) => {
      //   console.log('attack', res)
      // })
      // return
      let infoParams = {
        type: 'modelPreview',
        value: {
          DisType: '1:2:1:6:77:0:0'
        }
      }
      moveCamera(infoParams)
        .then((res) => {
          // console.log(res)
          if (res.code == 200) {
            //和UE交互设置相机视角  定位
            window.sceneAction.systemMessage.labelMessage({
              sysMessageId: 'moveCamera_sysMessage',
              sysMessagePosition: [lng, lat],
              sysMessageText: '仿真目标空间定位',
              sysFillColor: [186 / 255, 123 / 255, 213 / 255, 1]
            })
          }
        })
        .catch((err) => {
          console.log('导调UE定位错误', err)
        })
    }
    const switchTexture = async (config) => {
      if (config.newPath) {
        //  && window.humidityInstance && window.humidityInstance.primitive && window.humidityInstance.primitive.appearance
        let humidityPrimitive
        for (let primitive of window.EarthViewer.scene.primitives._primitives) {
          if (primitive.id === config.id || 'humidity_Test') {
            humidityPrimitive = primitive
          }
        }
        if (typeof humidityPrimitive === 'undefined') return
        const earth = window.MSIMEarth
        const viewer = window.EarthViewer
        earth.Resource.createIfNeeded(config.newPath)
          .fetchImage()
          .then((res) => {
            const cubeTex = new earth.Texture({
              context: viewer.scene.context,
              source: res
            })
            cubeTex.type = 'sampler2D'
            humidityPrimitive.appearance.uniforms.cubeTex = cubeTex
          })
          .catch((error) => {
            console.error('加载湿度纹理失败：', error)
          })
      }
    }

    const removeCloud = () => {
      window.EarthViewer.scene.primitives._primitives.forEach((item) => {
        if (item.id === 'Cloud_Test') {
          window.EarthViewer.scene.primitives.remove(item)
        }
      })
    }
    const test4 = (config) => {
      let DC = new window.EarthPlugn.DCPrimitive({
        viewer: window.EarthViewer,
        earth: window.MSIMEarth
      })

      const humidityTexturePaths = [
        {
          name: config.name || 'CloudTest',
          path:
            config.path ||
            '/static/image/texture/CLOUDpicture_120.75-122.75__22-25/TCC_2024-02-05_0100_z_interp_crop_100m_crop_lat_vertical_16x16.png'
        }
      ]

      const humidityConfig = {
        xmin: config.xmin || 120.1,
        xmax: config.xmax || 121.3,
        ymin: config.ymin || 24.1,
        ymax: config.ymax || 25.1,
        zmin: config.zmin || 100.0,
        zmax: config.zmax || 15000.0,
        steps: config.steps || 320.0,
        alphaCorrection: config.alphaCorrection || 0.9,
        humidityLowColor: config.humidityLowColor || '#0000ff',
        humidityMidColor: config.humidityMidColor || '#00ffff',
        humidityHighColor: config.humidityHighColor || '#84ff84',
        gamma: config.gamma || 0.6,
        alphaPower: config.alphaPower || 3.0,
        minThreshold: config.minThreshold || 0.05,
        maxThreshold: config.maxThreshold || 1.0,
        opacityScale: config.opacityScale || 0.48,
        dataCompression: config.dataCompression || 0.5,
        texturePath: config.texturePath || humidityTexturePaths[0].path,
        currentTextureIndex: config.currentTextureIndex || 0,
        texturePaths: config.texturePaths || humidityTexturePaths,
        // 剖切参数
        clipXEnabled: config.clipXEnabled || false,
        clipXMin: config.clipXMin || 0.0,
        clipXMax: config.clipXMax || 1.0,
        clipYEnabled: config.clipYEnabled || false,
        clipYMin: config.clipYMin || 0.0,
        clipYMax: config.clipYMax || 1.0,
        clipZEnabled: config.clipZEnabled || false,
        clipZMin: config.clipZMin || 0.0,
        clipZMax: config.clipZMax || 1.0,
        // 颜色过滤参数
        colorFilterEnabled: config.colorFilterEnabled || false,
        targetColor: config.targetColor || '#ffffff',
        colorTolerance: config.colorTolerance || 0.3,
        id: config.id || 'Cloud_Test'
      }

      DC.createCloudTextureAliasOD(humidityConfig)
      // switchTexture({
      //   newPath:
      //     '/static/image/texture/ICEpicture_BLUE_new/RH_2024-02-05_0400_z_interp_crop_100m_lat_vertical_16x16_green.png',
      //   id: 'humidity_Test'
      // })
    }

    function createHumidity(config) {
      let DC = new window.EarthPlugn.DCPrimitive({
        viewer: window.EarthViewer,
        earth: window.MSIMEarth
      })

      const humidityTexturePaths = [
        {
          name: config.name || 'HumidityTest',
          path:
            config.path ||
            '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_0000_z_interp_crop_100m_lat_vertical_16x16_green.png'
        }
      ]

      const humidityConfig = {
        xmin: config.xmin || 121.2,
        xmax: config.xmax || 121.4,
        ymin: config.ymin || 24.9,
        ymax: config.ymax || 25.1,
        zmin: config.zmin || 100.0,
        zmax: config.zmax || 15000.0,
        steps: config.steps || 320.0,
        alphaCorrection: config.alphaCorrection || 0.9,
        humidityLowColor: config.humidityLowColor || '#0000ff',
        humidityMidColor: config.humidityMidColor || '#00ffff',
        humidityHighColor: config.humidityHighColor || '#84ff84',
        gamma: config.gamma || 0.6,
        alphaPower: config.alphaPower || 3.0,
        minThreshold: config.minThreshold || 0.05,
        maxThreshold: config.maxThreshold || 1.0,
        opacityScale: config.opacityScale || 0.48,
        dataCompression: config.dataCompression || 0.5,
        texturePath: config.texturePath || humidityTexturePaths[0].path,
        currentTextureIndex: config.currentTextureIndex || 0,
        texturePaths: config.texturePaths || humidityTexturePaths,
        // 剖切参数
        clipXEnabled: config.clipXEnabled || false,
        clipXMin: config.clipXMin || 0.0,
        clipXMax: config.clipXMax || 1.0,
        clipYEnabled: config.clipYEnabled || false,
        clipYMin: config.clipYMin || 0.0,
        clipYMax: config.clipYMax || 1.0,
        clipZEnabled: config.clipZEnabled || false,
        clipZMin: config.clipZMin || 0.0,
        clipZMax: config.clipZMax || 1.0,
        // 颜色过滤参数
        colorFilterEnabled: config.colorFilterEnabled || false,
        targetColor: config.targetColor || '#ffffff',
        colorTolerance: config.colorTolerance || 0.3,
        id: config.id || 'humidity_Test'
      }

      DC.createHumidityTextureAliasOD(humidityConfig)
    }
    const test5 = async () => {
      window.EarthViewer.entities.add({
        position: window.MSIMEarth.Cartesian3.fromDegrees(
          121.25412591,
          25.03663923,
          1000000
        ),
        point: {
          pixelSize: 10.0,
          color: window.MSIMEarth.Color.RED.withAlpha(0.5)
        }
      })
      // let config = {
      //   name: 'HumidityTest',
      //   path: '/static/image/texture/ICEpicture_BLUE_new/KTICE2025111000.000.grb_lat_vertical_16x16_blue.png'
      // }
      // createHumidity(config)
    }

    const openLayerControl = () => {
      if (!window.EarthViewer) {
        console.error('EarthViewer 未初始化')
        return
      }

      const baseLayer = window.EarthViewer.imageryLayers.get(1)
      if (!baseLayer) {
        console.error('未找到基础图层')
        return
      }

      if (state.layerGui) {
        state.layerGui.destroy()
      }

      const gui = new dat.GUI()
      state.layerGui = gui

      const layerParams = {
        brightness: baseLayer.brightness || 0.9,
        contrast: baseLayer.contrast || 1.0,
        hue: baseLayer.hue || 0,
        saturation: baseLayer.saturation || 1.6,
        gamma: baseLayer.gamma || 0.6,
        autoAdjust: false,
        currentZoom: 0,
        zoomLow: {
          brightness: 0.7,
          contrast: 0.8,
          hue: 0,
          saturation: 1.2,
          gamma: 0.6
        },
        zoomMid: {
          brightness: 0.9,
          contrast: 1.0,
          hue: 0,
          saturation: 1.6,
          gamma: 0.6
        },
        zoomHigh: {
          brightness: 1.2,
          contrast: 1.2,
          hue: 0,
          saturation: 1.8,
          gamma: 0.5
        }
      }

      const manualFolder = gui.addFolder('手动调整参数')
      manualFolder.open()

      manualFolder.add(layerParams, 'brightness', 0, 3).onChange((value) => {
        baseLayer.brightness = value
      })

      manualFolder.add(layerParams, 'contrast', 0, 3).onChange((value) => {
        baseLayer.contrast = value
      })

      manualFolder
        .add(layerParams, 'hue', -Math.PI, Math.PI)
        .onChange((value) => {
          baseLayer.hue = value
        })

      manualFolder.add(layerParams, 'saturation', 0, 3).onChange((value) => {
        baseLayer.saturation = value
      })

      manualFolder.add(layerParams, 'gamma', 0.1, 5).onChange((value) => {
        baseLayer.gamma = value
      })

      const autoFolder = gui.addFolder('自动调整（按缩放级别）')

      autoFolder
        .add(layerParams, 'autoAdjust')
        .name('启用自动调整')
        .onChange((value) => {
          if (value) {
            startAutoAdjust()
          } else {
            stopAutoAdjust()
          }
        })

      const zoomLowFolder = autoFolder.addFolder('低缩放级别（看全球/大洲）')
      zoomLowFolder.add(layerParams.zoomLow, 'brightness', 0, 3).name('亮度')
      zoomLowFolder.add(layerParams.zoomLow, 'contrast', 0, 3).name('对比度')
      zoomLowFolder
        .add(layerParams.zoomLow, 'hue', -Math.PI, Math.PI)
        .name('色调')
      zoomLowFolder.add(layerParams.zoomLow, 'saturation', 0, 3).name('饱和度')
      zoomLowFolder.add(layerParams.zoomLow, 'gamma', 0.1, 5).name('伽马')

      const zoomMidFolder = autoFolder.addFolder('中缩放级别（看国家/区域）')
      zoomMidFolder.add(layerParams.zoomMid, 'brightness', 0, 3).name('亮度')
      zoomMidFolder.add(layerParams.zoomMid, 'contrast', 0, 3).name('对比度')
      zoomMidFolder
        .add(layerParams.zoomMid, 'hue', -Math.PI, Math.PI)
        .name('色调')
      zoomMidFolder.add(layerParams.zoomMid, 'saturation', 0, 3).name('饱和度')
      zoomMidFolder.add(layerParams.zoomMid, 'gamma', 0.1, 5).name('伽马')

      const zoomHighFolder = autoFolder.addFolder('高缩放级别（看城市/细节）')
      zoomHighFolder.add(layerParams.zoomHigh, 'brightness', 0, 3).name('亮度')
      zoomHighFolder.add(layerParams.zoomHigh, 'contrast', 0, 3).name('对比度')
      zoomHighFolder
        .add(layerParams.zoomHigh, 'hue', -Math.PI, Math.PI)
        .name('色调')
      zoomHighFolder
        .add(layerParams.zoomHigh, 'saturation', 0, 3)
        .name('饱和度')
      zoomHighFolder.add(layerParams.zoomHigh, 'gamma', 0.1, 5).name('伽马')

      const currentZoomDisplay = autoFolder
        .add(layerParams, 'currentZoom')
        .name('当前缩放级别')
        .listen()
      currentZoomDisplay.domElement.style.pointerEvents = 'none'

      let autoAdjustCallback = null

      function getCurrentZoomLevel() {
        const camera = window.EarthViewer.camera
        const position = camera.position
        const cartographic =
          window.MSIMEarth.Cartographic.fromCartesian(position)
        const height = cartographic.height
        layerParams.currentZoom = Math.round(height / 1000000)
        return height
      }

      function applyParamsForZoom(height) {
        let params
        if (height > 5000000) {
          params = layerParams.zoomLow
        } else if (height > 1000000) {
          const t = (height - 1000000) / 4000000
          params = {
            brightness:
              layerParams.zoomLow.brightness * t +
              layerParams.zoomMid.brightness * (1 - t),
            contrast:
              layerParams.zoomLow.contrast * t +
              layerParams.zoomMid.contrast * (1 - t),
            hue:
              layerParams.zoomLow.hue * t + layerParams.zoomMid.hue * (1 - t),
            saturation:
              layerParams.zoomLow.saturation * t +
              layerParams.zoomMid.saturation * (1 - t),
            gamma:
              layerParams.zoomLow.gamma * t +
              layerParams.zoomMid.gamma * (1 - t)
          }
        } else {
          const t = Math.max(0, Math.min(1, (height - 100000) / 900000))
          params = {
            brightness:
              layerParams.zoomMid.brightness * t +
              layerParams.zoomHigh.brightness * (1 - t),
            contrast:
              layerParams.zoomMid.contrast * t +
              layerParams.zoomHigh.contrast * (1 - t),
            hue:
              layerParams.zoomMid.hue * t + layerParams.zoomHigh.hue * (1 - t),
            saturation:
              layerParams.zoomMid.saturation * t +
              layerParams.zoomHigh.saturation * (1 - t),
            gamma:
              layerParams.zoomMid.gamma * t +
              layerParams.zoomHigh.gamma * (1 - t)
          }
        }

        baseLayer.brightness = params.brightness
        baseLayer.contrast = params.contrast
        baseLayer.hue = params.hue
        baseLayer.saturation = params.saturation
        baseLayer.gamma = params.gamma

        layerParams.brightness = params.brightness
        layerParams.contrast = params.contrast
        layerParams.hue = params.hue
        layerParams.saturation = params.saturation
        layerParams.gamma = params.gamma

        for (let i in manualFolder.__controllers) {
          manualFolder.__controllers[i].updateDisplay()
        }
      }

      function startAutoAdjust() {
        if (autoAdjustCallback) {
          return
        }

        autoAdjustCallback = function () {
          const height = getCurrentZoomLevel()
          applyParamsForZoom(height)
        }

        window.EarthViewer.scene.postRender.addEventListener(autoAdjustCallback)
      }

      function stopAutoAdjust() {
        if (autoAdjustCallback) {
          window.EarthViewer.scene.postRender.removeEventListener(
            autoAdjustCallback
          )
          autoAdjustCallback = null
        }
      }

      const resetBtn = {
        reset: () => {
          layerParams.brightness = 0.9
          layerParams.contrast = 1.0
          layerParams.hue = 0
          layerParams.saturation = 1.6
          layerParams.gamma = 0.6

          layerParams.zoomLow = {
            brightness: 0.7,
            contrast: 0.8,
            hue: 0,
            saturation: 1.2,
            gamma: 0.6
          }
          layerParams.zoomMid = {
            brightness: 0.9,
            contrast: 1.0,
            hue: 0,
            saturation: 1.6,
            gamma: 0.6
          }
          layerParams.zoomHigh = {
            brightness: 1.2,
            contrast: 1.2,
            hue: 0,
            saturation: 1.8,
            gamma: 0.5
          }

          baseLayer.brightness = 0.9
          baseLayer.contrast = 1.0
          baseLayer.hue = 0
          baseLayer.saturation = 1.6
          baseLayer.gamma = 0.6

          for (let i in gui.__controllers) {
            gui.__controllers[i].updateDisplay()
          }
          for (let i in manualFolder.__controllers) {
            manualFolder.__controllers[i].updateDisplay()
          }
          for (let i in zoomLowFolder.__controllers) {
            zoomLowFolder.__controllers[i].updateDisplay()
          }
          for (let i in zoomMidFolder.__controllers) {
            zoomMidFolder.__controllers[i].updateDisplay()
          }
          for (let i in zoomHighFolder.__controllers) {
            zoomHighFolder.__controllers[i].updateDisplay()
          }
        }
      }

      gui.add(resetBtn, 'reset').name('重置所有参数')

      const closeBtn = {
        close: () => {
          stopAutoAdjust()
          if (state.layerGui) {
            state.layerGui.destroy()
            state.layerGui = null
          }
        }
      }

      gui.add(closeBtn, 'close').name('关闭面板')

      getCurrentZoomLevel()
    }
    return {
      ...toRefs(state),
      showTree,
      changeList,
      test3,
      test4,
      test5,
      openLayerControl,
      PAStatisticCount,
      tsydCount,
      yrCount,
      wrCount,
      fkCount,
      plateFormCategoryStatisticShow
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
}

.home {
  height: 100%;
  width: 100%;
}

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
</style>
