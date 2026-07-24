<template>
  <div class="main_top" style="height: 10%">
    <div class="main_top_middle" style="width: 100%">
      <div class="main_top_middle_top_title">
        {{ infoHeaderTitle }}
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  onMounted,
  reactive,
  ref,
  defineProps,
  onUnmounted,
  getCurrentInstance,
  computed
} from 'vue'
import store from '@/store/index'
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
  getResultsAndLossesStatistics
} from '@/service/infomationStatistics/index'

const { proxy } = getCurrentInstance()

const displayTitle = computed(() => {
  const titleExtension = store.state.sceneModule.systemConfig.titleExtension
  if (titleExtension) {
    return EarthAPP.sysTitleQZ + EarthAPP.sysTitle
  }
  return EarthAPP.sysTitle
})

const infoHeaderTitle = computed(() => displayTitle.value + '-实验日志')

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
  bluePlatformCountByType: [] //蓝方各类型平台数量
})

let redBlood = ref('0%')
let blueBlood = ref('0%')

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
        console.log('血量', redBlood)
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

onMounted(() => {
  currentValue.value = props.platformCountHeader
})

onUnmounted(() => {})

// nextTick(() => { });

// watch(
//   () => props.platformCountHeader,
//   (newVal) => {
//     gsap.to(currentValue, {
//       duration: props.duration,
//       value: newVal,
//       ease: 'power1.out',
//       onUpdate: () => {
//         // 可以在这里添加额外的逻辑
//       }
//     })
//   }
// )
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
    background-image: linear-gradient(to right, #00468f, #00468f00);
  }
}
.main_top_middle_top_titl {
  font-size: 20px;
}
</style>
