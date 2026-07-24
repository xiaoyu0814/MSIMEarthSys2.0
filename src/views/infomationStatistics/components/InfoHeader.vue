<template>
  <div class="main_top">
    <div class="main_top_left">
      <div class="main_top_left_top">
        <img src="~@/assets/images/infoStatistics/main_top_left.png" />
        <div class="main_top_left_top_title" @click="setPlatformBox('红方')">
          红方平台
        </div>
        <div class="main_top_left_top_con">
          <el-scrollbar height="100%">
            <div
              v-for="(children, key, index) in store.getters.getRedCGFList"
              :key="index"
            >
              <div class="header" v-if="children.length">{{ key }}</div>
              <div
                style="display: flex; flex-wrap: wrap; gap: 5px; padding: 5px"
                v-if="children.length"
              >
                <div
                  ref="counter"
                  class="main_top_left_top_con_list"
                  :style="`background-color:${state.background[index]}`"
                  v-for="(item, item_index) in children"
                  :key="item_index"
                >
                  <span
                    :class="`main_top_left_c_l_n main_top_left_c_l_n${
                      item_index + 1
                    }`"
                  >
                    {{ item.count }}
                  </span>
                  <p>{{ item.typeCn }}</p>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <div class="main_top_middle">
      <div class="main_top_middle_top_title">
        <!-- <img class="title_bg" src="~@/assets/images/infoStatistics/title_bg.png" /> -->
        <span style="font-size: 17px; color: #fff; text-shadow: none">
          {{ displayTitle }}
        </span>
        <br />
        <span>仿真实验数据统计分析子系统</span>
        <!-- 终端数据智能管控平台 -->
        <a class="title_web" style="cursor: pointer" @click="save">保存数据</a>
        <!-- <a class="title_web" href="" target="blank">系统管理</a> -->
        <!-- <a class="title_admin" href="" target="blank">仿真入口</a> -->
        <div style="position: fixed; top: 24px; left: 70px; font-size: 20px">
          天文时间:{{ state.astronomicalTime }}
        </div>
        <div
          style="position: fixed; top: 24px; right: 70px; font-size: 20px"
          v-if="state.showSceneTime"
        >
          场景时间:{{ state.sceneTime }}
        </div>
        <div class="systemConfig">
          <!-- 用户 -->
          <el-tooltip
            effect="light"
            content="返回"
            placement="bottom"
            offset="-5"
          >
            <div class="user-config">
              <el-popover
                trigger="click"
                placement="top-start"
                width="200"
                effect="dark"
              >
                <div class="user_box">
                  <div class="user-item">
                    <img
                      src="~@/assets/images/user.png"
                      style="width: 20px; height: 20px"
                    />
                    <span
                      style="font-size: 16px; font-weight: 600; margin-top: 3px"
                    >
                      {{ state.account }}</span
                    >
                  </div>
                  <el-button
                    size="small"
                    type="primary"
                    style="margin: 10px 0"
                    @click="gotoHomePage"
                  >
                    返回首页
                  </el-button>
                  <!-- <el-button
                    size="small"
                    type="primary"
                    style="margin: 0"
                    @click="logout"
                  >
                    退出登录
                  </el-button> -->
                </div>
                <template #reference>
                  <el-badge :is-dot="false" class="badge">
                    <img
                      src="~@/assets/images/user.png"
                      alt="用户"
                      style="width: 20px; height: 20px"
                    />
                  </el-badge>
                </template>
              </el-popover>
            </div>
          </el-tooltip>
        </div>
      </div>
      <div class="main_top_middle_num">
        <div class="main_top_middle_num_red">
          <div class="main_top_middle_num_red_health-bar-container">
            <div
              class="main_top_middle_num_red_health-bar"
              :style="{ '--hpred': redBlood }"
            >
              <div class="countBox">{{ state.redNum }}</div>
            </div>
          </div>
        </div>
        <div class="main_top_middle_num_center">
          <img src="~@/assets/images/infoStatistics/vs.png" alt="" />
        </div>
        <div class="main_top_middle_num_blue">
          <div class="main_top_middle_num_blue_health-bar-container">
            <div
              class="main_top_middle_num_blue_health-bar"
              :style="{ '--hpblue': blueBlood }"
            >
              <div class="countBox">{{ state.blueNum }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="main_top_middle_bottom">
        <div class="main_top_middle_bottom_echarts">
          <img src="~@/assets/images/infoStatistics/main_top_bottom.png" />
          <div class="main_top_echarts_con">
            <div
              class="main_bottom_b_title1"
              @click="state.battleDamage_dialog = true"
            >
              <span
                v-if="
                  props.currentSceneInfo && props.currentSceneInfo.sampleName
                "
                style="font-weight: bolder"
              >
                {{ props.currentSceneInfo.sampleName }} - </span
              >实时信息
            </div>
            <!-- <div id="threeTasksId" class="main_top_echarts_pie"></div> -->
            <ss_message
              @getLogList="getLogList"
              :startTime="state.sceneTime"
              :showSceneTime="state.showSceneTime"
            />
          </div>
        </div>
        <div
          class="main_top_middle_bottom_echarts main_top_middle_bottom_echarts_right"
          v-if="false"
        >
          <img src="~@/assets/images/infoStatistics/main_top_bottom.png" />
          <div class="main_top_echarts_con">
            <div
              class="main_top_echarts_con_title"
              @click="state.results_dialog = true"
            >
              战损统计
            </div>
            <div id="publicityId" class="main_top_echarts_pie"></div>
          </div>
        </div>
      </div>
    </div>
    <div class="main_top_left main_top_right">
      <div class="main_top_left_top">
        <img src="~@/assets/images/infoStatistics/main_top_left.png" />
        <div class="main_top_left_top_title" @click="setPlatformBox('蓝方')">
          蓝方平台
        </div>
        <div class="main_top_left_top_con">
          <el-scrollbar height="100%">
            <div
              v-for="(children, key, index) in store.getters.getBlueCGFList"
              :key="index"
            >
              <div class="header" v-if="children.length">{{ key }}</div>
              <div
                style="display: flex; flex-wrap: wrap; gap: 5px; padding: 5px"
                v-if="children.length"
              >
                <div
                  ref="counter"
                  class="main_top_left_top_con_list"
                  :style="`background-color:${state.background[index]}`"
                  v-for="(item, item_index) in children"
                  :key="item_index"
                >
                  <span
                    :class="`main_top_left_c_l_n main_top_left_c_l_n${
                      item_index + 1
                    }`"
                  >
                    {{ item.count }}
                  </span>
                  <p>{{ item.typeCn }}</p>
                </div>
              </div>
            </div>
          </el-scrollbar>
        </div>
      </div>
    </div>
    <!-- <el-dialog v-model="state.platform_dialog" :title="`${state.platform_type}平台`" width="1000">
      <red_blue_platform :type="state.platform_type" />
    </el-dialog>
    <el-dialog v-model="state.results_dialog" title="战果对比" width="1000">
      <results />
    </el-dialog>
    <el-dialog v-model="state.battleDamage_dialog" title="战损对比" width="1000">
      <battleDamage />
    </el-dialog>
    <el-dialog v-model="state.equipment_dialog" :title="`${state.equipment_type}平台装备`" width="1000">
      <red_blue_equipment :type="state.equipment_type"
        :dataList="{ red: state.redPlatform, blue: state.bluePlatform }" />
    </el-dialog> -->
  </div>
</template>

<script setup>
import {
  onMounted,
  reactive,
  ref,
  defineProps,
  watch,
  nextTick,
  onUnmounted,
  getCurrentInstance,
  computed
} from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
import { DArrowRight } from '@element-plus/icons-vue'
import red_blue_platform from './dialog/red_blue_platform.vue'
import results from './dialog/results.vue'
import battleDamage from './dialog/battleDamage.vue'
import red_blue_equipment from './dialog/red_blue_equipment.vue'
import ss_message from './components/ss_message.vue'
import store from '@/store/index'
import emitter from '@/utils/eventbus'
import * as echarts from 'echarts'
import gsap from 'gsap'
import IndexDBControl from '@/utils/earthPlugin/ThirdParty/indexDB/index.js'
import { getTime } from '@/utils/meteorology/utils'
import {
  getPlatformState,
  getPlatformWeapons,
  getPlatformParts
} from '@/service/afsim/index'
import { ElMessage } from 'element-plus'
import {
  getForceTypeStatistics,
  getRelativeForceStatistics,
  expeSampleRecordRealTimeData,
  getPlatformCHNName
} from '@/service/infomationStatistics/index'
import { eventControllerSSEClose } from '@/utils/mapTools'

const { proxy } = getCurrentInstance()

const props = defineProps({
  platformCountHeader: {
    type: Number,
    required: true,
    default: 100
  },
  duration: {
    type: Number,
    default: 3
  },
  sseMessage: {
    type: Object,
    default: ''
  },
  startTime: {
    type: String,
    default: ''
  },
  bottomData: {
    type: Object,
    default: {}
  },
  currentSceneInfo: {
    type: Object,
    default: {
      sampleName: ''
    }
  }
})

let state = reactive({
  astronomicalTime: '',
  combatTime: '',
  battleDamage_dialog: false,
  results_dialog: false,
  equipment_dialog: false,
  platform_dialog: false,
  platform_type: '',
  equipment_type: '',
  redList: {
    a: [{ data: { labelType: 'text' } }]
  },
  blueList: {
    a: [{ data: { labelType: 'text' } }]
  },
  background: [
    '#37d2d4',
    '#19ca88',
    '#858ff8',
    '#2e8cff',
    '#f6580e',
    '#fd9133',
    '#f6d10e',
    '#1E3A5F',
    '#121212',
    '#2E7D32',
    '#5D4037',
    '#4527A0',
    '#C2185B',
    '#0277BD',
    '#FF5722',
    '#689F38',
    '#7B1FA2',
    '#424242',
    '#37474F'
  ],
  redPlatform: [],
  bluePlatform: [],
  redPlatformInfo: {
    name: '',
    fuel: '',
    quantity: '',
    sensor: ''
  },
  bluePlatformInfo: {
    name: '',
    fuel: '',
    quantity: '',
    sensor: ''
  },
  redNum: 0,
  blueNum: 0,
  redPlatformCountByType: [], //红方各类型平台数量
  bluePlatformCountByType: [], //蓝方各类型平台数量
  currentSceneInfo: {}, // 当前启动的场景信息row
  logList: [],
  sceneTime: '2027-09-12 10:00:00',
  showSceneTime: false,
  account: localStorage.getItem('account'),
  allPlatList: {}
})

let statisticTitle = ref(EarthAPP.sysTitle)
let redBlood = ref('0%')
let blueBlood = ref('0%')

const displayTitle = computed(() => {
  const titleExtension = store.state.sceneModule.systemConfig.titleExtension
  if (titleExtension) {
    return EarthAPP.sysTitleQZ + EarthAPP.sysTitle
  }
  return EarthAPP.sysTitle
})

const currentValue = ref(0)
const counter = ref(null)

setInterval(() => {
  state.astronomicalTime = getTime(new Date(), 'yyyy-MM-dd HH:mm:ss')
}, 1000)

// 获取各类平台数量统计信息
const st = setInterval(() => {
  getForceTypeStatistics()
    .then((res) => {
      // console.log('获取各类平台实时数量', res)
      if (res.code === 200) {
        let data = res.data
        let redData = {
          地: [],
          陆: [],
          海: [],
          天: [],
          空: []
        }
        let blueData = {
          地: [],
          陆: [],
          海: [],
          天: [],
          空: []
        }
        // data.forEach((e) => {
        //   if (statisticArr.indexOf(e.type) > -1) {
        //     switch (e.side) {
        //       case 'red':
        //         console.log('typeCn', e.typeCn)
        //         redData.push({ count: e.count, type: e.type, typeCn: e.typeCn })
        //         break
        //       case 'blue':
        //         blueData.push({
        //           count: e.count,
        //           type: e.type,
        //           typeCn: e.typeCn
        //         })
        //         // state.redPlatformCountByType.push({
        //         //   count: e.count,
        //         //   type: e.type
        //         // })
        //         break
        //       default:
        //         break
        //     }
        //   }
        // })
        data.forEach((e) => {
          if (e.domain == '地') {
            e.data.forEach((item) => {
              if (item.side == 'red') {
                redData['地'].push(item)
              } else {
                blueData['地'].push(item)
              }
            })
          } else if (e.domain == '陆') {
            e.data.forEach((item) => {
              if (item.side == 'red') {
                redData['陆'].push(item)
              } else {
                blueData['陆'].push(item)
              }
            })
          } else if (e.domain == '海') {
            e.data.forEach((item) => {
              if (item.side == 'red') {
                redData['海'].push(item)
              } else {
                blueData['海'].push(item)
              }
            })
          } else if (e.domain == '天') {
            e.data.forEach((item) => {
              if (item.side == 'red') {
                redData['天'].push(item)
              } else {
                blueData['天'].push(item)
              }
            })
          } else if (e.domain == '空') {
            e.data.forEach((item) => {
              if (item.side == 'red') {
                redData['空'].push(item)
              } else {
                blueData['空'].push(item)
              }
            })
          }
        })
        store.commit('setRedCGFList', redData)
        store.commit('setBlueCGFList', blueData)
      }
    })
    .catch((err) => {
      console.log('获取各类平台实时数量失败', err)
    })
  getRelativeForceStatistics()
    .then((res) => {
      if (res.code === 200) {
        let data = res.data
        state.redNum = data[0].count
        state.blueNum = data[1].count
        let count = data[0].count + data[1].count
        redBlood.value = (data[0].count / count) * 100 + '%'
        blueBlood.value = (data[1].count / count) * 100 + '%'
        // console.log('血量', redBlood)
      }
    })
    .catch((err) => {
      console.log('获取红蓝平台数量统计信息失败', err)
    })
  // getPlatformState({ platform: 'wz-7_1' }).then((res) => {
  //   if (res.status == 'success') {
  //     console.log('state', res.data)
  //     state.redPlatformInfo.fuel = res.data.Fuel
  //     // ? res.data.Fuel
  //     // : getRandomNumber(16, 25)
  //   } else {
  //     // ElMessage.error("获取红方装备信息失败")
  //   }
  // })
  // getPlatformWeapons({ platform: 'wz-7_1' }).then((res) => {
  //   if (res.status == 'success') {
  //     console.log('武器', res.data)
  //     state.redPlatformInfo.quantity = res.data.Quantity
  //   } else {
  //     // ElMessage.error("获取红方装备武器失败")
  //   }
  // })
}, 5000)

// setInterval(() => {
//   getRedPlatfrom()
//   getBluePlatfrom()
// }, 1000 * 3)

let redIndex = 0
let blueIndex = 0

const getRedPlatfrom = () => {
  if (!state.redPlatform.length) return
  // let platform_name = state.redList[state.redPlatform[redIndex]][0].data.name
  // state.redPlatformInfo.name = state.redList[state.redPlatform[redIndex]][0].data.labelName.split('_')[0]
  let platform_name = state.redPlatform[redIndex].data[0].Name
  state.redPlatformInfo.name =
    state.redPlatform[redIndex].data[0].LabelName.split('_')[0]
  let params = { platform: platform_name }
  getPlatformState(params).then((res) => {
    if (res.status == 'success') {
      state.redPlatformInfo.fuel = res.data.Fuel
      // ? res.data.Fuel
      // : getRandomNumber(16, 25)
    } else {
      // ElMessage.error("获取红方装备信息失败")
    }
  })
  getPlatformWeapons(params).then((res) => {
    if (res.status == 'success') {
      state.redPlatformInfo.quantity = res.data.Quantity
    } else {
      // ElMessage.error("获取红方装备武器失败")
    }
  })
  getPlatformParts(params).then((res) => {
    if (res.status == 'success') {
      for (let i = 0; i < res.data.length; i++) {
        const element = res.data[i]
        if (element.PartType == 'SENSOR') {
          state.redPlatformInfo.sensor = element.Type
        }
      }
    } else {
      // ElMessage.error("获取红方装备组件失败")
    }
  })
  redIndex++
  if (redIndex == state.redPlatform.length) {
    redIndex = 0
  }
}

const getBluePlatfrom = () => {
  if (!state.bluePlatform.length) return
  // let platform_name = state.blueList[state.bluePlatform[blueIndex]][0].data.name
  // state.bluePlatformInfo.name = state.blueList[state.bluePlatform[blueIndex]][0].data.labelName.split('_')[0]
  let platform_name = state.bluePlatform[redIndex].data[0].Name
  state.bluePlatformInfo.name =
    state.bluePlatform[redIndex].data[0].LabelName.split('_')[0]
  let params = { platform: platform_name }
  getPlatformState(params).then((res) => {
    if (res.status == 'success') {
      state.bluePlatformInfo.fuel = res.data.Fuel
        ? res.data.Fuel
        : getRandomNumber(16, 25)
    } else {
      // ElMessage.error("获取蓝方装备信息失败")
    }
  })
  getPlatformParts(params).then((res) => {
    if (res.status == 'success') {
      state.bluePlatformInfo.quantity = res.data.Quantity
    } else {
      // ElMessage.error("获取蓝方装备武器失败")
    }
  })
  getPlatformWeapons(params).then((res) => {
    if (res.status == 'success') {
      for (let i = 0; i < res.data.length; i++) {
        const element = res.data[i]
        if (element.PartType == 'SENSOR') {
          state.bluePlatformInfo.sensor = element.Type
        }
      }
    } else {
      // ElMessage.error("获取蓝方装备组件失败")
    }
  })
  blueIndex++
  if (blueIndex == state.bluePlatform.length) {
    blueIndex = 0
  }
}

const setPlatformBox = (type) => {
  state.platform_type = type
  state.platform_dialog = true
}

const setEquipmentDialog = (type) => {
  state.equipment_type = type
  state.equipment_dialog = true
}

let num = 0
const sse_callback = (e) => {
  state.redPlatform = []
  state.bluePlatform = []
  // setTimeout(() => {
  if (e.type == 'PD') {
  } else {
    getCFGnum(e)
    if (!num) {
      // getRedPlatfrom()
      // getBluePlatfrom()
      num++
    }
  }
  // }, 100);
}

const getCFGnum = (e) => {
  state.redPlatform = e.redcgfList
  state.bluePlatform = e.bluecgfList
  // state.redList = e.redList
  // state.blueList = e.blueList
  proxy.$forceUpdate() // 强制重新渲染组件
  let redNum = 0
  let blueNum = 0
  // for (const key in state.redList) {
  //   if (Object.prototype.hasOwnProperty.call(state.redList, key)) {
  //     const element = state.redList[key]
  //     state.redPlatform.push(key)
  //     element.forEach(() => {
  //       redNum += 1
  //     })
  //   }
  // }
  // for (const key in state.blueList) {
  //   if (Object.prototype.hasOwnProperty.call(state.blueList, key)) {
  //     const element = state.blueList[key]
  //     state.bluePlatform.push(key)
  //     element.forEach(() => {
  //       blueNum += 1
  //     })
  //   }
  // }
  state.redPlatform.forEach((item) => {
    item.data.forEach(() => {
      redNum += 1
    })
  })
  state.bluePlatform.forEach((item) => {
    item.data.forEach(() => {
      blueNum += 1
    })
  })
  let totle = redNum + blueNum
  redBlood = (redNum / totle) * 100 + '%'
  blueBlood = (blueNum / totle) * 100 + '%'
  window.redNum = redNum
  window.blueNum = blueNum
}

const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

const getLogList = (logList) => {
  state.logList = logList
}

const save = () => {
  let data = {
    redCGFList: store.getters.getRedCGFList,
    blueCGFList: store.getters.getBlueCGFList,
    redNum: state.redNum,
    blueNum: state.blueNum,
    logList: state.logList,
    ZSTJData: props.bottomData.ZSTJData,
    ZGTJData: props.bottomData.ZGTJData,
    youliangData: props.bottomData.youliangData,
    danyaoData: props.bottomData.danyaoData,
    SXTJListData: props.bottomData.SXTJListData,
    JCFXData: props.bottomData.JCFXData
  }
  let params = {
    realTimeStatisticsDataJson: JSON.stringify(data)
  }
  expeSampleRecordRealTimeData(params).then((res) => {
    if (res.code == 200) {
      ElMessage.success('保存成功')
    } else {
      ElMessage.error('保存失败')
    }
  })
}

/**
 * @description 登出
 */
let logout = () => {
  sessionStorage.clear()
  localStorage.clear()
  setTimeout(() => {
    router.push('/login')
    if (EventController) {
      eventControllerSSEClose(EventController)
    }
    state2.currentTaskName = ''
    store.state.sceneModule.sceneInfo = {}
  }, 500)
  // window.location.reload()
}
/**
 * @description 返回首页
 */
let gotoHomePage = () => {
  setTimeout(() => {
    router.push('/architecturePlatform')
    state2.currentTaskName = ''
    store.state.sceneModule.sceneInfo = {}
  }, 500)
  // window.location.reload()
}

const _getPlatformCHNName = () => {
  getPlatformCHNName().then((res) => {
    if (res.code == 200) {
      state.allPlatList = res.data
    } else {
      ElMessage.error('中文对照列表获取失败')
    }
  })
}

const getSpeTime = (timeStr) => {
  let time = new Date(timeStr)
  var year = time.getFullYear()
  var month =
    time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1
  var date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
  var hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
  var minutes =
    time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
  var seconds =
    time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()
  return (
    year +
    '-' +
    month +
    '-' +
    date +
    ' ' +
    hours +
    ':' +
    minutes +
    ':' +
    seconds
  )
}

onMounted(() => {
  _getPlatformCHNName()
  currentValue.value = props.platformCountHeader
})

onUnmounted(() => {})

watch(
  () => store.getters.getStartDate,
  (nVal) => {
    let startTime = new Date(props.startTime).getTime()
    console.log(startTime)

    if (isNaN(startTime)) {
      state.showSceneTime = false
    } else {
      state.showSceneTime = true
      let at = nVal * 1000
      state.sceneTime = getTime(new Date(startTime + at), 'yyyy-MM-dd HH:mm:ss')
      let ss = new Date(state.sceneTime).getTime()
      store.commit('setMsgMessionTime', getSpeTime(ss))
    }
  }
)
</script>

<style lang="less" scoped>
.main_top_middle_num_red_health-bar-container {
  width: 100%;
  height: 25px;
  background-color: #33333346;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
  transform: scaleX(-1);

  .main_top_middle_num_red_health-bar {
    height: 100%;
    width: var(--hpred);
    background: linear-gradient(to right, #ff0000 0%, #ff8000 50%);
    border-radius: 10px;
    transition: width 0.3s ease;
    display: flex;
    align-items: center;

    .countBox {
      transform: scaleX(-1);
      color: white;
      margin-left: 20px;
      font-weight: bold;
      font-size: 20px;
    }
  }
}

.main_top_middle_num_blue_health-bar-container {
  width: 100%;
  height: 25px;
  background-color: #33333346;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);

  .main_top_middle_num_blue_health-bar {
    height: 100%;
    width: var(--hpblue);
    background: linear-gradient(to left, #0e72e4 0%, #041beb 50%);
    border-radius: 10px;
    transition: width 0.3s ease;
    display: flex;
    align-items: center;

    .countBox {
      color: white;
      margin-left: 20px;
      font-weight: bold;
      font-size: 20px;
    }
  }
}

.activered {
  --hpred: 75%;
}

.activeblue {
  --hpblue: 45%;
}

.dialog_btn {
  position: absolute;
  right: 5px;
  top: 5px;
  z-index: 1;
}

:deep(.el-dialog) {
  background-color: #00777f6e;
}

:deep(.el-dialog__title) {
  color: #fff;
}

.platformBox {
  margin-top: 0;

  .platformItem {
    display: flex;
    align-items: center;

    // justify-content: center;
    .label {
      width: 80px;
      font-weight: bold;
      text-align: right;
      margin-right: 50px;
      font-size: 14px;
    }
  }
}

.main_top {
  .header {
    display: flex;
    align-items: center;
    padding: 5px 10px;
    background-image: linear-gradient(
      to right,
      rgba(14, 252, 255, 0.3),
      rgba(14, 252, 255, 0.05)
    );
    color: var(--tech-primary);
    font-weight: bold;
  }
}

/* 平台列表项增强样式 */
.main_top_left_top_con_list {
  border: var(--tech-border);
  border-radius: 4px;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.main_top_left_top_con_list:hover {
  box-shadow: var(--tech-glow);
  transform: translateY(-2px);
}

.main_top_left_top_con_list::before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent,
    rgba(255, 255, 255, 0.1),
    transparent
  );
  transition: left 0.5s ease;
}

.main_top_left_top_con_list:hover::before {
  left: 100%;
}

/* 数字计数动画 */
.main_top_left_c_l_n {
  animation: countUp 0.8s ease-out forwards;
  display: block;
  font-weight: bold;
  color: #fff;
  text-shadow: 0 0 5px rgba(0, 0, 0, 0.8);
}

/* 标题样式增强 */
.main_top_middle_top_title {
  text-shadow: var(--tech-glow);
  font-size: 25px !important;
  background: url(@/assets/images/infoStatistics/title_bg.png) no-repeat;
  background-size: 100% 100%;
  height: 85px;
  // font-size: 1.8vw !important;
}

/* 对话框科技感样式 */
:deep(.el-dialog) {
  background: var(--tech-bg-dark);
  border: var(--tech-border);
  border-radius: 8px;
  box-shadow: var(--tech-glow);
}

:deep(.el-dialog__header) {
  background: rgba(14, 252, 255, 0.1);
  border-bottom: var(--tech-border);
}

:deep(.el-dialog__title) {
  color: var(--tech-primary);
  font-weight: bold;
}

/* 健康条增强样式 */
.main_top_middle_num_red_health-bar-container,
.main_top_middle_num_blue_health-bar-container {
  border: var(--tech-border);
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.5) inset;
}

.main_top_middle_num_red_health-bar {
  background: linear-gradient(
    90deg,
    #ff0000 0%,
    #ff6b35 50%,
    #ff8c42 100%
  ) !important;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.5);
}

.main_top_middle_num_blue_health-bar {
  background: linear-gradient(
    90deg,
    #0066ff 0%,
    #3399ff 50%,
    #66ccff 100%
  ) !important;
  box-shadow: 0 0 10px rgba(0, 102, 255, 0.5);
}

.countBox {
  text-shadow: 0 0 10px rgba(255, 255, 255, 0.8);
  font-weight: bold;
}

.systemConfig {
  position: fixed;
  top: 27px;
  right: 34px;
}

.user-config {
  cursor: pointer;
}

.user_box {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;

  .user-item {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 10px;
  }
}
</style>
