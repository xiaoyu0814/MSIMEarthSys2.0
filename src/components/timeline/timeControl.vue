<template>
  <div class="time_container">
    <div class="timeline-control">
      <div class="btns_container">
        <div class="speed_bar">
          <el-dropdown placement="top" :teleported="false" trigger="click" @command="changeTimeSpeed">
            <span class="el-dropdown-link" style="color: var(--title-color); font-size: 21px; margin-left: 10px">
              x {{ state.curSpeed + '倍速' }}
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item v-for="(item, index) in state.speedList" :key="index" :command="item">{{ item
                }}</el-dropdown-item>
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="time_item" @click="restartInfors" title="仿真消息重连接" @mouseenter="timeItemEnter(1)"
          @mouseout="timeItemOut(1)">
          <img style="width: 40px" :src="state.restartStatus ?
            getThemeImg('重连1.png')
            :
            getThemeImg('重连.png')" class="iconfont" />
        </div>
        <div class="time_item" @click="pause" :title="state.playState == 'pause' ? '开始' : '暂停'"
          @mouseenter="timeItemEnter(2)" @mouseout="timeItemOut(2)">
          <img style="width: 40px" :src="state.playState == 'pause'
            ? state.playStatus ? getThemeImg('播放1.png') : getThemeImg('播放.png')
            : state.playStatus ? getThemeImg('暂停1.png') : getThemeImg('暂停.png')
            " class="iconfont" />
        </div>
        <div class="time_item" @click="stop" title="场景停止" @mouseenter="timeItemEnter(3)" @mouseout="timeItemOut(3)">
          <img style="width: 40px" :src="state.stopStatus ?
            getThemeImg('停止1.png')
            :
            getThemeImg('停止.png')" class="iconfont" />
        </div>
        <div class="navbar-btn">
          <div v-for="(item, index) in state.navbarBtn" :key="index" @click="selectMenu(item)"
            @mouseenter="enterItem(item)" @mouseout="outItem(item)" class="btn-item pointer-cursor">
            <!-- <el-tooltip effect="dark" :content="item.name" placement="top"> -->
            <div :title="item.name">
              <img :src="item.actived || state.activeMenu == item.tag || item.sign
                ? getThemeImg(item.img2)
                : getThemeImg(item.img)
                " :alt="item.name" :style="{ padding: '5px', width: '30px', height: '30px' }" />
            </div>
            <!-- </el-tooltip> -->
          </div>
        </div>
      </div>
    </div>
    <Transition name="custom-classes" leave-active-class="animate__animated animate__fadeOut">
      <div class="timeline-pause" v-if="state.showPause">
        <img class="iconfont icon-bofang_o" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch } from 'vue'
import store from '@/store/index'
import {
  activeTime,
  pauseTime,
  updateTimeSpeed,
  stopAfsimServer
} from '@/service/timeline'
import { ElMessage } from 'element-plus'
import emitter from '@/utils/eventbus'
import { useRouter } from 'vue-router'
import { themeType } from '@/config/theme.js'
const state = reactive({
  playState: 'pause',
  curSpeed: 1,
  restartStatus: false,
  playStatus: false,
  stopStatus: false,
  showPause: false, //暂停图标,
  speedList: [1, 2, 3, 4, 5],
  curIndex: 0,
  timer: null,
  navbarBtn: [
    {
      name: '编组信息',
      tag: 'groupInfo',
      actived: false,
      sign: false,
      img: '编组信息.png',
      img2: '编组信息1.png'
    },
    {
      name: '作战信息',
      tag: 'battleInfo',
      actived: false,
      sign: false,
      img: '作战信息.png',
      img2: '作战信息1.png'
    },
    {
      name: '天气导调',
      tag: 'weatherControl',
      actived: false,
      sign: false,
      img: '天气导调.png',
      img2: '天气导调1.png'
    },
    {
      name: '快速裁决',
      tag: 'quickDecision',
      actived: false,
      sign: false,
      img: '快速裁决.png',
      img2: '快速裁决1.png'
    },
    {
      name: '想定面板',
      tag: 'scenarioContent',
      actived: false,
      sign: false,
      img: '想定面板.png',
      img2: '想定面板1.png'
    }
  ],
  activeMenu: '',
  showBattleInfo: false,  //作战信息显隐
  showQuickDecision: false,  // 快速裁决显隐
  showWeatherControl: false,  // 天气导调显隐
  showGroupInfo: false, // 编组信息显隐
  showScenarioContent: false  // 想定面板显隐
})
const router = useRouter()
onMounted(async () => {
  //获取后台时间倍速
  initSceneTimeandSpeed()
  emitter.on('initScenePauseState', () => {
    let currentSceneId = getCurrentSceneId()
    window.EarthViewer.clock.shouldAnimate = false
    window.EarthViewer.clock.multiplier = 0
    pauseTime(currentSceneId).then((res) => {
      if (res.code == 200) {
        state.playState = 'pause'
        state.showPause = true
        store.commit('setPlayState', state.playState)
        setTimeout(() => {
          state.showPause = false
        }, 1000)
      }
    })
  })
  emitter.on('tagNavbarBtnClose', val => {
    state.navbarBtn.forEach(item => {
      if (item.tag == val) {
        item.actived = false
        state.activeMenu = ''
      }
    });
    switch (val) {
      case 'quickDecision':
        state.showQuickDecision = false
        break;
      case 'groupInfo':
        state.showGroupInfo = false
        break;
      case 'battleInfo':
        state.showBattleInfo = false
        break;
      case 'weatherControl':
        state.showWeatherControl = false
      case 'scenarioContent':
        state.showScenarioContent = false
      case 'measurement':
        state.isShowMeasurePanel = false
      default:
        break;
    }
  })
})

watch(
  () => store.state.sceneModule.multiplier,
  (newValue, oldValue) => {
    // 获取当前场景信息
    if (newValue) {
      state.curSpeed = newValue
      state.speedList.map((item, index) => {
        if (state.curSpeed == item) {
          state.curIndex = index
        }
      })
      if (state.curSpeed > 1) {
        ElMessage.warning('超实时状态下无法使用语音播报模式')
      }
    }
  },
  {
    deep: true
  }
)

watch(
  () => store.state.sceneModule.playState,
  (newValue, oldValue) => {
    // 获取当前场景信息
    if (newValue) {
      state.playState = newValue
    }
  }
)
// 根据主题类型动态加载图片资源
// 注意：Webpack 的 require() 需要静态路径前缀才能在构建时分析依赖
// 因此每个主题分支使用独立的 require() + 模板字符串，确保路径可被静态分析
const getThemeImg = (name) => {
  switch (themeType) {
    // 蓝色
    case 1:
      return require(`@/assets/image/timeline/play/${name}`)
    // 黑色
    case 2:
      return require(`@/assets/image/timeline/play/${name}`)
    // 白色
    case 3:
      return require(`@/assets/image/timeline/play/${name}`)
    // 绿色
    case 4:
      return require(`@/assets/image/timeline/play/menu_green/${name}`)
    default:
      return require(`@/assets/image/timeline/play/${name}`)
  }
}

// 按钮移入移出
const enterItem = (item) => {
  item.sign = true
}
const outItem = (item) => {
  item.sign = false
}
const timeItemEnter = (type) => {
  switch (type) {
    case 1:
      state.restartStatus = true
      break;
    case 2:
      state.playStatus = true
      break;
    case 3:
      state.stopStatus = true
      break;
    default:
      break;
  }
}
const timeItemOut = (type) => {
  switch (type) {
    case 1:
      state.restartStatus = false
      break;
    case 2:
      state.playStatus = false
      break;
    case 3:
      state.stopStatus = false
      break;
    default:
      break;
  }
}
// 面板菜单选择
const selectMenu = (item) => {
  state.activeMenu = ''
  item.actived = !item.actived
  switch (item.tag) {
    case 'battleInfo':
      // 作战信息
      state.showBattleInfo = !state.showBattleInfo
      let params = {
        label: '作战信息',
        name: 'realTimeInformation',
        props: {}
      }
      if (state.showBattleInfo) {
        emitter.emit('rightComp', params)
      } else {
        emitter.emit('closeBottomControlPanel', 'right')
      }
      break
    case 'quickDecision':
      // 快速裁决
      state.showQuickDecision = !state.showQuickDecision
      let params1 = {
        label: '快速裁决',
        name: 'quickArbitration',
        props: {}
      }
      if (state.showQuickDecision) {
        emitter.emit('bottomComp', params1)
      } else {
        emitter.emit('closeBottomControlPanel', 'bottom')
      }
      break
    case 'weatherControl':
      // 天气导调
      state.showWeatherControl = !state.showWeatherControl
      let params2 = {
        label: '天气导调',
        name: 'weatherConfig',
        props: {}
      }
      if (state.showWeatherControl) {
        emitter.emit('sceneConfigComp', params2)
      } else {
        emitter.emit('closeBottomControlPanel', 'three')
      }
      break
    case 'groupInfo':
      // 编组信息
      state.showGroupInfo = !state.showGroupInfo
      let params3 = {
        label: '编组信息',
        name: 'groupTab',
        props: {}
      }
      if (state.showGroupInfo) {
        emitter.emit('leftComp', params3)
      } else {
        emitter.emit('closeBottomControlPanel', 'left')
      }
      break
    case 'scenarioContent':
      // 想定信息
      state.showScenarioContent = !state.showScenarioContent
      let params4 = {
        label: '想定内容',
        name: 'scenario',
        props: {}
      }
      if (state.showScenarioContent) {
        emitter.emit('sceneConfigComp', params4)
      } else {
        emitter.emit('closeBottomControlPanel', 'three')
      }
      break
    default:
      break
  }
}

// 根据实验启动或继续时返回的状态值初始化场景延迟倍率和速度倍率等
const initSceneTimeandSpeed = () => {
  let curSimulationState = store.state.AFSIMModule.simulationState
  if (curSimulationState && curSimulationState.clockRate) {
    state.curSpeed = curSimulationState.clockRate
    EarthAPP.timeC = state.curSpeed * EarthAPP.timeVal
    if (state.curSpeed === 1) {
      EarthAPP.timeC = EarthAPP.dTime
    }
    let index = state.speedList.indexOf(state.curSpeed)
    if (index > -1) {
      state.curIndex = index
    }
  }
  state.playState = store.state.sceneModule.playState
}

const pause = () => {
  // 清除之前的定时器
  clearTimeout(state.timer)
  state.timer = setTimeout(() => {
    // 启动
    let currentSceneId = getCurrentSceneId()
    if (state.playState == 'pause') {
      if (EarthAPP.pauseConfig) {
        window.EarthViewer.clock.multiplier = store.state.sceneModule.multiplier
        window.EarthViewer.clock.shouldAnimate = true
      }
      activeTime(currentSceneId).then((res) => {
        if (res.code == 200) {
          window.EarthViewer.clock.multiplier =
            store.state.sceneModule.multiplier
          if (EarthAPP.shouldAnimateConfig) {
            window.EarthViewer.clock.shouldAnimate = true
          }
          console.log('当前运行状态', window.EarthViewer.clock.multiplier)
          state.playState = 'forward'
          state.showPause = false
          store.commit('setPlayState', state.playState)
          // 通知实验列表更新状态
          emitter.emit('experimentStatusChanged')
          setTimeout(() => {
            restartInfors()
          }, 1000)
        }
      })
    } else {
      // // 暂停msgMessionTime
      // updateTimeSpeedToServe({ speed: 0 })
      if (EarthAPP.pauseConfig) {
        window.EarthViewer.clock.multiplier = 0
        window.EarthViewer.clock.shouldAnimate = false
      }
      pauseTime(currentSceneId).then((res) => {
        if (res.code == 200) {
          console.log('当前暂停状态', window.EarthViewer.clock.multiplier)
          window.EarthViewer.clock.multiplier = 0
          if (EarthAPP.shouldAnimateConfig) {
            window.EarthViewer.clock.shouldAnimate = false
          }
          state.playState = 'pause'
          state.showPause = true
          store.commit('setPlayState', state.playState)

          // 通知实验列表更新状态
          emitter.emit('experimentStatusChanged')

          // setTimeout(() => {
          //   restartInfors()
          // }, 1000)
          setTimeout(() => {
            state.showPause = false
          }, 1000)
        }
      })
    }
  }, 800) // 设置防抖的时间间隔，例如1500毫秒
}

const changeSpeed = (speed) => {
  let currentSceneId = getCurrentSceneId()
  const params = {
    id: currentSceneId,
    speed: speed
  }
  updateTimeSpeed(params).then((res) => {
    if (res.code == 200) {
      console.log('改变了速度', speed)
      state.curSpeed = speed
      // **************改重proto后 改变速度目前不会有大量数据堆积，目前尝试取消延迟倍率
      EarthAPP.timeC = speed * EarthAPP.timeVal
      if (speed === 1) {
        EarthAPP.timeC = EarthAPP.dTime
      }
      restartInfors()
      if (state.curSpeed >= 10) {
        let text = configText.timeSpeedWarn
        beautyToast.error({
          title: 'Warning',
          message: text,
          darkTheme: true
        })
      }
    }
  })
}
const changeTimeSpeed = (val) => {
  state.curSpeed = val
  state.speedList.map((item, index) => {
    if (val == item) {
      state.curIndex = index
    }
  })
  changeSpeed(state.curSpeed)
}
//停止afsim
const stop = () => {
  let currentSceneId = getCurrentSceneId()
  console.log('当前停止的场景：', currentSceneId)
  stopAfsimServer(currentSceneId).then((res) => {
    if (res.code == 200) {
      ElMessage.success('停止仿真场景成功')
      // 刷新页面重置浏览器 暂时路由跳转，后续追加过场动画
      router.push('/architecturePlatform')
      router.push('/home/combatSimulation')
      setTimeout(() => {
        window.location.reload()
      }, 600)
    } else {
      ElMessage.error('停止仿真场景失败', res)
    }
  })
}
// 返回当前选择的场景的id
const getCurrentSceneId = () => {
  let currentSceneId = store.state.sceneModule.sceneInfo.id
  if (EarthAPP.localSceneInfo.useCurrentConfig) {
    currentSceneId = EarthAPP.localSceneInfo.id
  }
  return currentSceneId
}

// 重新连接sse消息
const restartInfors = () => {
  console.log('重新连接')
  EventController.restartStream()

  // 通知实验列表重连状态
  let currentSceneId = getCurrentSceneId()
  emitter.emit('experimentStatusChanged')
}
</script>

<style lang="less" scoped>
.timeline-control {
  width: 480px;
  position: fixed;
  bottom: 2%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  background: var(--panel-bg);
  border-bottom: 1px solid var(--border-color);
  box-shadow: var(--box-shadow-glow);
  border-radius: 10px;
}

.timeline-pause {
  width: 500px;
  height: 500px;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;

  .iconfont {
    // width: 100%;
    // height: 100%;
    // font-size: 500px;
    // color: #2faeff;
  }
}

.btns_container {
  height: 50px;
  display: flex;
  align-items: center;
  justify-content: space-around;

  .speed_bar {
    position: absolute;
    left: 162px;
    top: 14px;
    z-index: 999;
    cursor: pointer;
    padding-right: 10px;
    box-sizing: border-box;

    .speed_box {
      position: absolute;
      z-index: 999;
      width: 250px;
      height: 20px;
      background: rgba(0, 0, 0, 0.4);
      border: 1px solid #3093d5;
      display: flex;
      align-items: center;
      padding: 3px 5px 3px 9px;
      border-radius: 2px;
      bottom: 26px;
      transform: translateX(-50%);

      .bar_btn {
        padding: 2px 4px;
        font-size: 12px;
        border: 1px solid #3093d5;
        color: #3093d5;
        background: rgba(0, 0, 0, 0.4);
        margin-left: 1px;
        margin-left: -5px;
        width: 36px;
      }

      >div {
        flex-grow: 1;
      }
    }
  }

  .time_item {
    display: flex;
    width: 33%;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;

  }

  .navbar-btn {
    display: flex;
    width: 230px;
    margin-top: 4px;
    margin-left: 90px;

    .btn-item pointer-cursor {
      display: inline-block;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
      width: 50px;
      margin-left: 12px;
    }
  }

  .time_select {
    position: absolute;
    width: 400px;
    height: 32px;
    left: 200px;
    bottom: 2px;
    background-color: transparent;
    display: flex;
    align-items: center;
    justify-content: space-between;

    .select_item {
      width: 45%;
      height: 100%;
    }

    // 去除边框
    :deep .el-input__wrapper {
      box-shadow: none !important;
    }

    // 去除选中时蓝色边框（下面两个都要加上）
    :deep.el-input .el-input__wrapper.is-focus {
      box-shadow: none !important;
    }

    :deep .el-input.is-focus .el-input__wrapper {
      border-color: #3e8eff !important;
      box-shadow: none !important;
    }
  }
}

.speed_container {
  height: 100%;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  position: relative;

  .speed_item {
    width: 28px;
    height: 18px;
    border-radius: 3px;
    font-style: italic;
    border: 1px solid rgb(47, 174, 255);
    color: rgb(47, 174, 255);
    background-color: rgba(47, 174, 255, 0.2);
    cursor: pointer;
  }

  .active {
    color: #fff;
    background-color: rgba(47, 174, 255, 0.8);
  }
}

.time_container {

  :deep(.el-dropdown-menu),
  :deep(.el-popper.is-light .el-popper__arrow::before) {
    background: var(--panel-bg-deep) !important;
  }
}
</style>
