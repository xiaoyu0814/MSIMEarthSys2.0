<template>
  <div class="time_container">
    <div class="timeline-control">
      <div class="btns_container">
        <div class="speed_bar">
          <!-- <p title="播放速度">
            x <span>{{ state.curSpeed.toFixed(1) }}
          </p> -->
          <el-dropdown
            placement="top"
            :teleported="false"
            trigger="click"
            @command="changeTimeSpeed"
          >
            <span
              class="el-dropdown-link"
              style="color: #2faeff; font-size: 21px; margin-left: 10px"
            >
              x {{ state.curSpeed + '倍速' }}
              <!-- <el-icon class="el-icon--right">
                <arrow-down />
              </el-icon> -->
            </span>
            <template #dropdown>
              <el-dropdown-menu>
                <el-dropdown-item
                  v-for="(item, index) in state.speedList"
                  :key="index"
                  :command="item"
                  >{{ item }}</el-dropdown-item
                >
              </el-dropdown-menu>
            </template>
          </el-dropdown>
        </div>
        <div class="time_item" @click="restartInfors" title="仿真消息重连接">
          <img
            style="width: 40px"
            src="@/assets/image/timeline/play/重连.png"
            class="iconfont"
          />
        </div>
        <!-- <div class="time_item" @click="fastBackNow" title="-1">
          <img
            style="width: 40px"
            src="@/assets/image/timeline/play/左.png"
            class="iconfont"
            :class="state.playState == 'back' ? 'on' : ''"
          />
        </div> -->
        <div
          class="time_item"
          @click="pause"
          :title="state.playState == 'pause' ? '开始' : '暂停'"
        >
          <img
            style="width: 40px"
            :src="
              state.playState == 'pause'
                ? require('@/assets/image/timeline/play/播放.png')
                : require('@/assets/image/timeline/play/暂停.png')
            "
            class="iconfont"
          />
        </div>
        <!-- <div class="time_item" @click="fastForwardNow" title="+1">
          <img
            style="width: 40px"
            src="@/assets/image/timeline/play/右.png"
            class="iconfont"
            :class="state.playState == 'forward' ? 'on' : ''"
          />
        </div> -->
        <div class="time_item" @click="stop" title="场景停止">
          <img
            style="width: 40px"
            src="@/assets/image/timeline/play/停止.png"
            class="iconfont"
          />
        </div>
        <!-- <div class="time_item" @click="restart" title="场景重启">
          <img
            style="width: 40px"
            src="@/assets/image/timeline/play/同步.png"
            class="iconfont"
          />
        </div>
        <div class="time_item" @click="stopAfsimYq" title="停止仿真引擎">
          <img
            style="width: 40px"
            src="@/assets/image/timeline/play/停止仿真.png"
            class="iconfont"
          />
        </div> -->
      </div>
    </div>
    <Transition
      name="custom-classes"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <div class="timeline-pause" v-if="state.showPause">
        <!-- <i class="iconfont icon-bofang_o"></i> -->
        <img class="iconfont icon-bofang_o" />
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { reactive, ref, toRefs, onMounted, watch } from 'vue'
import store from '@/store/index'
import {
  activeTime,
  pauseTime,
  updateTimeSpeed,
  stopAfsimServer,
  getTimeSpeed
} from '@/service/timeline'
import { freezeAFSIM, resumeAFSIM, stopAFSIM } from '@/service/SSE'
import { ElMessage, ElMessageBox } from 'element-plus'
import { StartSceneRunSetData } from '@/service/SSE'
import emitter from '@/utils/eventbus'
import { debounceBtn, eventControllerSSEClose } from '@/utils/mapTools'
import { useRouter } from 'vue-router'
import { restartScene } from '@/views/3D/hooks/initConfig/restart'
const state = reactive({
  playState: 'pause',
  speedArray: [1, 2, 5, 10],
  curSpeed: 1,
  showPause: false, //暂停图标,
  speedList: [1, 2, 3, 4, 5],
  curIndex: 0,
  timer: null
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

const fastBackNow = () => {
  // 清除之前的定时器
  clearTimeout(state.timer)
  // 设置新的定时器
  state.timer = setTimeout(() => {
    if (state.curIndex > 0) {
      state.curIndex -= 1
      state.curSpeed = state.speedList[state.curIndex]
      changeSpeed(state.curSpeed)
    }
  }, 800) // 设置防抖的时间间隔，例如800毫秒
}

const fastForwardNow = () => {
  // 清除之前的定时器
  clearTimeout(state.timer)
  // 设置新的定时器
  state.timer = setTimeout(() => {
    if (state.curIndex >= 7) {
      return
    }
    state.curIndex += 1
    state.curSpeed = state.speedList[state.curIndex]
    changeSpeed(state.curSpeed)
    if (state.curSpeed > 5) {
      let text = configText.timeSpeedWarn
      beautyToast.error({
        title: 'Warning',
        // message: `超过5倍速`,
        message: text,
        darkTheme: true
      })
    }
  }, 800) // 设置防抖的时间间隔，例如800毫秒
}

const pause = () => {
  // 清除之前的定时器
  clearTimeout(state.timer)
  state.timer = setTimeout(() => {
    // 启动
    let currentSceneId = getCurrentSceneId()
    if (state.playState == 'pause') {
      // updateTimeSpeedToServe({ speed: state.speed })
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
  // sceneConfig(speed) // 场景加减速或暂停时的实时配置 需要考虑是否在接口回调使用
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
      // ***************
      if (state.curSpeed >= 10) {
        let text = configText.timeSpeedWarn
        beautyToast.error({
          title: 'Warning',
          // message: `超过5倍速`,
          message: text,
          darkTheme: true
        })
      }
    }
  })
}
const changeTimeSpeed = (val) => {
  console.log('改变速度', val)
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
      // StartSceneRunSetDataFun(false) //停止模拟器数据入库
      ElMessage.success('停止仿真场景成功')
      // 刷新页面重置浏览器 暂时路由跳转，后续追加过场动画
      router.push('/architecturePlatform')
      router.push('/home/combatSimulation')
      setTimeout(() => {
        window.location.reload()
      }, 600)
      // window.location.reload()
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
// 时间同步
const timeSync = () => {
  setTimeout(() => {
    ElMessage.success('时间同步成功')
  }, 400)
}

// 场景重启
const restart = () => {
  let data = window.localStorage.getItem('currentSceneInfo')
  data = JSON.parse(data)
  stopAfsimServer(data.id).then((res) => {
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
  window.localStorage.setItem('isRestartScene', true)
  window.localStorage.setItem('currentSceneInfo', JSON.stringify(data))
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
const stopAfsimYq = () => {
  stopAfsimServer().then((res) => {
    if (res.code == 200) {
      ElMessage.success('停止仿真引擎成功')
      EarthAPP.billboardCollection.removeAll() //移除所有动态billboard图标
      StartSceneRunSetDataFun(false) //停止模拟器数据入库
    } else {
      ElMessage.error('停止仿真引擎失败')
    }
  })
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
/* .time_container {
    position: relative;
  } */

.timeline-control {
  width: 300px;
  height: 60px;
  position: fixed;
  bottom: 6%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
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
  width: 200px;
  display: flex;
  align-items: center;
  // justify-content: space-evenly;
  justify-content: space-around;
  position: relative;

  .speed_bar {
    position: absolute;
    right: -75px;
    // top: -9px;
    z-index: 999;
    cursor: pointer;

    p {
      font-size: 21px;
      font-style: italic;
      color: #2faeff;
      // border: 1px solid #2faeff;
      padding: 1px 6px;
      line-height: 1;
      border-radius: 3px;
      display: flex;

      span {
        font-size: 21px;
        font-weight: 800;
      }
    }

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

      > div {
        flex-grow: 1;
      }
    }
  }

  .time_item {
    display: flex;
    // width: 50px;
    width: 33%;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;

    img {
      color: #2faeff;
      text-align: center;
      font-size: 39px;

      // &.on {
      //  font-weight: 600;
      //  background: rgba(255, 255, 255, 0.2);
      //  padding: 0px;
      //  border-radius: 4px;
      //  box-shadow: 0 0 4px #ddd;
      // }
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
    background: #172e51 !important;
  }
}
</style>
