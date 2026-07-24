<template>
  <div class="scenePage">
    <div v-if="leftComp.name" v-show="isShowleftPanel">
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
    <!-- 云渲染全屏窗口 -->
    <linkUE v-if="isShowUE"></linkUE>
    <div class="return_size" v-show="isShowImage">
      <img
        src="@/assets/image/header/返回_关闭.png"
        alt=""
        @click="showAnalysisContainer"
        title="显示评估"
      />
    </div>
  </div>
</template>

<script>
// vue内部调用
import { reactive, toRefs, onMounted, watch, nextTick } from 'vue'
// 第三方封装调用
import emitter from '@/utils/eventbus'
// 页面展示操控逻辑组件
import controlComp from '@/views/scenePage/controlComp/index.vue'
// 场景右侧弹窗leftComp组件
import forceChart from '@/views/scenePage/leftComp/forceChart/index.vue'
// import LLBC from '@/views/seatManagement/reduser/informationseat/component/index.vue'
import guidePowerComp from '@/views/scenePage/leftComp/guidePowerComp/index.vue'
import taskGroup from '@/views/scenePage/leftComp/taskGroupRed/index.vue'
import taskGroupBlue from '@/views/scenePage/leftComp/taskGroupBlue/index.vue'
import taskGroupGreen from '@/views/scenePage/leftComp/taskGroupGreen/index.vue'
import taskGroupPurple from '@/views/scenePage/leftComp/taskGroupPurple/index.vue'
import groupTab from '@/views/scenePage/leftComp/groupTab/index.vue'
import adjustPlan from '@/views/scenePage/leftComp/adjustPlan/index.vue'
// 场景左侧弹窗rightComp组件
import realTimeInformation from '@/views/scenePage/rightComp/realTimeInformation/index.vue'
import showVideo from '@/views/scenePage/rightComp/showVideo/index.vue'
import showUE from '@/views/scenePage/rightComp/showUE/index.vue'
// 场景底部弹窗bottomComp组件
import quickArbitration from '@/views/scenePage/bottomComp/quickArbitration/index.vue'
import recognitionResult from '@/views/scenePage/bottomComp/recognitionResult/index.vue'
import showTarget from '@/views/scenePage/bottomComp/showTarget/index.vue'
import keyEvents from '@/views/scenePage/bottomComp/keyEvents/index.vue'
import arbitrationResult from '@/views/scenePage/bottomComp/arbitrationResult/index.vue'
import messagePlan from '@/views/scenePage/bottomComp/messagePlan/index.vue'
// 场景中间部分弹窗sceneConfigComp组件
import planeLabelConfig from '@/views/scenePage/sceneConfigComp/planeLabelConfig/index.vue'
import earthObjectConfig from '@/views/scenePage/sceneConfigComp/earthObjectConfig/index.vue'
import scenario from '@/views/scenePage/sceneConfigComp/scenario/index.vue'
import targetConfig from '@/views/scenePage/sceneConfigComp/targetConfig/index.vue'
import virtualSoldierConfig from '@/views/scenePage/sceneConfigComp/virtualSoldierConfig/index.vue'
import statisticAnalysis from '@/views/scenePage/sceneConfigComp/statisticAnalysis/index.vue'
import weatherConfig from '@/views/scenePage/sceneConfigComp/weatherConfig/index.vue'
import taskFeedback from '@/views/scenePage/sceneConfigComp/taskFeedback/index.vue'
import jammerMeachOn from '@/views/scenePage/sceneConfigComp/jammerMeachOn/index.vue'
import jammerDistrub from '@/views/scenePage/sceneConfigComp/jammerDistrub/index.vue'
import jammerClose from '@/views/scenePage/sceneConfigComp/jammerClose/index.vue'
import radarRestore from '@/views/scenePage/sceneConfigComp/radarRestore/index.vue'
import seatReadySituation from '@/views/scenePage/sceneConfigComp/seatReadySituation/index.vue'
import videoChat from '@/views/scenePage/sceneConfigComp/videoConfig/index.vue'
import assessment from '@/views/scenePage/sceneConfigComp/sceneAnalysisAssess/index.vue' // 评估分析
import satellite from '@/views/scenePage/sceneConfigComp/satellite/satellite.vue' // 卫星信息弹窗
import entityList from './sceneConfigComp/entityList/index.vue' // 实体列表
import linkUE from '@/components/earthComp/linkUE/index.vue'
import simulatorAttack from '@/views/scenePage/sceneConfigComp/simulatorAttack/index.vue'
import store from '@/store'
import { removeAirPlanePathLine } from '@/utils/mapTools'
import billboardList from '@/views/scenePage/bottomComp/billboardList/index.vue' //底部标牌列表
import targetInformations from '@/views/scenePage/bottomComp/targetInformations/index.vue' //左侧目标信息
import commandLinkAnalysis from '@/views/scenePage/thematicAnalysisComp/commandLinkAnalysis/index.vue' //指挥链路分析
import analysisOfFirepowerStrikeLink from '@/views/scenePage/thematicAnalysisComp/analysisOfFirepowerStrikeLink/index.vue' //火力打击链路分析
import actionTrack from '@/views/scenePage/thematicAnalysisComp/actionTrack/index.vue' //行动轨迹
import communicationLinkAnalysis from '@/views/scenePage/thematicAnalysisComp/communicationLinkAnalysis/index.vue' //通信链路分析
import electromagneticFrequencyDomainAnalysis from '@/views/scenePage/thematicAnalysisComp/electromagneticFrequencyDomainAnalysis/index.vue' //电磁频域分析
export default {
  name: 'ScenePage',
  components: {
    forceChart,
    // LLBC,
    guidePowerComp,
    realTimeInformation,
    showVideo,
    showUE,
    quickArbitration,
    keyEvents,
    arbitrationResult,
    messagePlan,
    recognitionResult,
    showTarget,
    planeLabelConfig,
    earthObjectConfig,
    scenario,
    targetConfig,
    virtualSoldierConfig,
    statisticAnalysis,
    weatherConfig,
    taskFeedback,
    jammerMeachOn,
    jammerDistrub,
    jammerClose,
    radarRestore,
    //satellite,
    seatReadySituation,
    controlComp,
    videoChat,
    assessment,
    entityList,
    linkUE,
    simulatorAttack,
    billboardList,
    targetInformations,
    commandLinkAnalysis,
    analysisOfFirepowerStrikeLink,
    actionTrack,
    communicationLinkAnalysis,
    electromagneticFrequencyDomainAnalysis,
    taskGroup,
    taskGroupBlue,
    taskGroupGreen,
    taskGroupPurple,
    groupTab,
    adjustPlan
  },
  setup() {
    const state = reactive({
      isShowleftPanel: false,
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
      },
      side: localStorage.getItem('side'),
      isShowUE: store.state.sceneModule.showUEContainer,
      isShowImage: false,
      simulatorName: ''
    })
    onMounted(() => {
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
      emitter.on('isShowReturnImg', (val) => {
        if (!val) return
        state.simulatorName = val.simulatorName
        state.isShowImage = val.isShow
      })
      emitter.on('thematicAnalysisComp', (val) => {
        if (!val) return
        state.sceneConfigComp.name = val.name
      })
      emitter.on('topNum', (val) => {
        // 监听顶部数字键弹框
        if (!val) return
        switch (val) {
          case '1':
            emitter.emit('showUI', true)
            const climbData = {
              Data: {
                motion_analysis: {
                  action_type: 'LEFT', //'ASCENDING', // 行动类型
                  predicted_heading_deg: 73,
                  pitch_angle_deg: 31,
                  horizontal_distance_m: 4331,
                  vertical_distance_m: 540,
                  total_prediction_time_s: 43,
                  predictedPath: [
                    { lat: 25.208709, lon: 121.817667, alt: 1000 },
                    { lat: 25.210709, lon: 121.819667, alt: 1500 },
                    { lat: 25.212709, lon: 121.821667, alt: 2000 }
                  ],
                  estimatedTimeOfArrival: '2026-05-13T00:02:01Z',
                  fuelRemaining: '85%',
                  eta: '2026-05-13T00:02:01Z',
                  fuel: '85%',
                  waypoints: [
                    {
                      lat: 25.208709,
                      lon: 121.817667,
                      alt: 1000,
                      name: 'Waypoint 1'
                    },
                    {
                      lat: 25.212709,
                      lon: 121.821667,
                      alt: 2000,
                      name: 'Waypoint 2'
                    }
                  ],
                  start_position_geo: {
                    lat: 25.208709,
                    lon: 121.817667,
                    alt: 1000
                  },
                  end_position_geo: {
                    lat: 25.212709,
                    lon: 121.821667,
                    alt: 2000
                  },
                  weapon_status: [], //武器状况
                  sensorList_status: [], //传感器状况
                  weather: {
                    type: 'wind',
                    region: {
                      min_lat: 24,
                      max_lat: 26,
                      min_lon: 118,
                      max_lon: 120,
                      min_alt: 500,
                      max_alt: 3000
                    },
                    res_url:
                      '/static/data/json/wind_json_output/wind_your_region.json',
                    code: 'wind_Test'
                  },
                  targets: [
                    {
                      id: 'CH-5-1',
                      camp: 'red'
                    },
                    {
                      id: 'CH-5-2',
                      camp: 'blue'
                    }
                  ]
                }
              },
              warning_detail: '受到强气流影像', // 预警详情
              msg: {
                level: 'WARN',
                content:
                  'Detected severe turbulence ahead, recommend LEFT turn to avoid'
              }
            }

            emitter.emit('FLIGHT_TRAJECTORY_PREDICTION_ADVANCED', climbData)
            // 加载notification_1.json文件并推进到store内保存
            // configTopNum('/static/config/json/logo/notification_1.json')
            break
          case '2':
            const climbData2 = {
              Data: {
                motion_analysis: {
                  action_type: 'RIGHT', //'ASCENDING', // 行动类型
                  predicted_heading_deg: 80,
                  pitch_angle_deg: 25,
                  horizontal_distance_m: 4003,
                  vertical_distance_m: 1120,
                  total_prediction_time_s: 48,
                  predictedPath: [
                    { lat: 25.208709, lon: 121.817667, alt: 1000 },
                    { lat: 25.210709, lon: 121.819667, alt: 1500 },
                    { lat: 25.212709, lon: 121.821667, alt: 2000 }
                  ],
                  estimatedTimeOfArrival: '2026-05-13T00:02:01Z',
                  fuelRemaining: '84%',
                  waypoints: [
                    {
                      lat: 25.208709,
                      lon: 121.817667,
                      alt: 1000,
                      name: 'Waypoint 1'
                    },
                    {
                      lat: 25.212709,
                      lon: 121.821667,
                      alt: 2000,
                      name: 'Waypoint 2'
                    }
                  ],
                  start_position_geo: {
                    lat: 25.208709,
                    lon: 121.817667,
                    alt: 1000
                  },
                  end_position_geo: {
                    lat: 25.212709,
                    lon: 121.821667,
                    alt: 2000
                  },
                  weapon_status: [], //武器状况
                  sensorList_status: [] //传感器状况
                }
              },
              warning_detail: '前方发现建筑物' // 预警详情
            }

            emitter.emit('FLIGHT_TRAJECTORY_PREDICTION_ADVANCED', climbData2)
            // val为2时切换可视化显示内容
            // configTopNum('/static/config/json/logo/notification_2.json')
            break
          case '3':
            const climbData3 = {
              Data: {
                motion_analysis: {
                  action_type: 'BUMPING', //'ASCENDING', // 行动类型
                  predicted_heading_deg: 92,
                  pitch_angle_deg: 47,
                  horizontal_distance_m: 5200,
                  vertical_distance_m: 1046,
                  total_prediction_time_s: 61,
                  predictedPath: [
                    { lat: 25.208709, lon: 121.817667, alt: 1000 },
                    { lat: 25.210709, lon: 121.819667, alt: 1500 },
                    { lat: 25.212709, lon: 121.821667, alt: 2000 }
                  ],
                  estimatedTimeOfArrival: '2026-05-13T00:02:23Z',
                  fuelRemaining: '82%',
                  waypoints: [
                    {
                      lat: 25.208709,
                      lon: 121.817667,
                      alt: 1000,
                      name: 'Waypoint 1'
                    },
                    {
                      lat: 25.212709,
                      lon: 121.821667,
                      alt: 2000,
                      name: 'Waypoint 2'
                    }
                  ],
                  start_position_geo: {
                    lat: 25.208709,
                    lon: 121.817667,
                    alt: 1000
                  },
                  end_position_geo: {
                    lat: 25.212709,
                    lon: 121.821667,
                    alt: 2000
                  },
                  weapon_status: [], //武器状况
                  sensorList_status: [] //传感器状况
                }
              },
              warning_detail: '前方发现建筑物' // 预警详情
            }

            emitter.emit('FLIGHT_TRAJECTORY_PREDICTION_ADVANCED', climbData3)
            // configTopNum('/static/config/json/logo/notification_3.json')
            break
          case '4':
            const climbData4 = {
              Data: {
                motion_analysis: {
                  action_type: 'ICING', //'ASCENDING', // 行动类型
                  predicted_heading_deg: 90,
                  pitch_angle_deg: 15,
                  horizontal_distance_m: 5000,
                  vertical_distance_m: 1000,
                  total_prediction_time_s: 60,
                  predictedPath: [
                    { lat: 25.208709, lon: 121.817667, alt: 1000 },
                    { lat: 25.210709, lon: 121.819667, alt: 1500 },
                    { lat: 25.212709, lon: 121.821667, alt: 2000 }
                  ],
                  estimatedTimeOfArrival: '2026-05-13T00:03:00Z', //new Date().toISOString()
                  fuelRemaining: '85%',
                  waypoints: [
                    {
                      lat: 25.208709,
                      lon: 121.817667,
                      alt: 1000,
                      name: 'Waypoint 1'
                    },
                    {
                      lat: 25.212709,
                      lon: 121.821667,
                      alt: 2000,
                      name: 'Waypoint 2'
                    }
                  ],
                  start_position_geo: {
                    lat: 25.208709,
                    lon: 121.817667,
                    alt: 1000
                  },
                  end_position_geo: {
                    lat: 25.212709,
                    lon: 121.821667,
                    alt: 2000
                  },
                  weapon_status: [], //武器状况
                  sensorList_status: [] //传感器状况
                }
              },
              warning_detail: '前方发现建筑物' // 预警详情
            }

            emitter.emit('FLIGHT_TRAJECTORY_PREDICTION_ADVANCED', climbData4)
            // configTopNum('/static/config/json/logo/notification_4.json')
            break
          case '5':
            // configTopNum('/static/config/json/logo/notification_5.json')
            break
        }
      })
    })
    // 加载topNum对应数据，例如'/static/config/json/logo/notification_1.json'
    const configTopNum = (url) => {
      // 加载notification_1.json文件并推进到store内保存
      fetch(url)
        .then((response) => response.json())
        .then((data) => {
          store.commit('AFSIMModule/setReconnaissanceResults', data)
        })
        .catch((error) => {
          console.error(`Error loading ${url}:`, error)
        })
    }

    const showAnalysisContainer = () => {
      emitter.emit('isShowAnalysis', true)
      state.isShowImage = false
      // 轨迹清空
      removeAirPlanePathLine(state.simulatorName)
      if (window.shipAndMissileLabel[state.simulatorName]) {
        window.shipAndMissileLabel[state.simulatorName].closeEvent()
      }
    }
    // 监听实验管理面板的显隐
    watch(
      () => store.getters.get_isSimulationList,
      (newVal) => {
        state.isShowleftPanel = !newVal
      },
      { deep: true, immediate: true }
    )
    //监听UE面板是否显示或隐藏
    watch(
      () => store.state.sceneModule.showUEContainer,
      (newValue) => {
        state.isShowUE = newValue
      }
    )
    return { ...toRefs(state), showAnalysisContainer }
  }
}
</script>

<style lang="less" scoped>
.return_size {
  position: fixed;
  bottom: 100px;
  left: 80px;
  z-index: 1111;
  cursor: pointer;
}
</style>
