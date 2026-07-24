<template>
  <!-- 复盘功能使用的底部时间轴 -->
  <div class="exercise_timeline" v-show="state.bottomShow">
    <div class="timeconfig-div" v-if="state.speedSliderVisiable">
      <el-row>
        <el-col :span="20">
          <el-slider
            v-model="state.curSpeed"
            :min="-50"
            :max="50"
            show-input
            input-size="mini"
          >
          </el-slider>
        </el-col>
        <el-col :span="4">
          <el-button class="bar_btn" @click="setSpeed" size="mini"
            >确定</el-button
          >
        </el-col>
      </el-row>
    </div>

    <!-- 操作按钮 -->
    <div class="timeline_btns">
      <div class="btns_container">
        <div class="speed_bar">
          <p title="播放速度">
            x <span>{{ state.curSpeed }}</span>
          </p>
        </div>
        <div class="time_item" @click="fastBackNow" title="-1">
          <i
            class="icon-arrowleftdl iconfont"
            :class="state.playState == 'back' ? 'on' : ''"
          ></i>
        </div>
        <div
          class="time_item"
          @click="pause"
          :title="state.playState == 'pause' ? '开始' : '暂停'"
        >
          <i
            class="iconfont"
            :class="
              state.playState == 'pause' ? 'icon-bofang_o' : 'icon-zanting'
            "
          ></i>
        </div>
        <div class="time_item" @click="fastForwardNow" title="+1">
          <i
            class="icon-arrowrightdl iconfont"
            :class="state.playState == 'forward' ? 'on' : ''"
          ></i>
        </div>
        <div class="time_item" @click="stop" title="停止">
          <i class="stop_iconfont"></i>
        </div>
        <!-- <div class="time_select">
          <el-select
            v-model="state.selectSpeed"
            @change="handleSelectSpeed"
            popper-class="selectSpeed"
            class="select_item"
            value-key="value"
            size="mini"
            placeholder="请选择倍速"
          >
            <el-option
              v-for="(item, index) in state.speedList"
              :key="index"
              :label="item.speed"
              :value="item.speed"
            >
              <span style="float: left">{{ item.speed }}</span>
            </el-option>
          </el-select>
        </div> -->
      </div>
    </div>
    <!-- <div class="eventBtn" @click="clickBtn">重要事件列表</div> -->
    <eventList v-if="state.showEventList"></eventList>
  </div>
</template>

<script setup>
import {
  reactive,
  onMounted,
  watch,
  computed,
  defineEmits,
  onUnmounted
} from 'vue'
import { useStore } from 'vuex'
import {
  deduceInit,
  deduceStart,
  deduceStop,
  replayUpdateTime,
  replayUpdateTimeSpeed,
  deducePause,
  replayGetSpeed
} from '@/service/replayTime'
import { seaAirJointOperationsCzml } from '@/utils/earthPlugin/ThirdParty/eventSource/event/earthEvent'
import emitter from '@/utils/eventbus'
import { date2String, loadScenarioOperationalAreaFile } from '@/utils/mapTools'
import {
  SSEClose,
  sceneControl,
  getPAStatic,
  setPlateMoveCommond,
  SSECloseReplay
} from '@/service/SSE'
import { BASE_URL } from '@/service/request/config'
import { ElLoading } from 'element-plus'
import eventList from './eventList'
// const { sceneTimeSkip } = creatScene()
const store = useStore()
const props = defineProps({
  bottomShow: {
    default: true
  }
})
const state = reactive({
  sceneEndTime: '',
  sceneStartTime: '',
  playState: '',
  curSpeed: '1', // 滑块里面的值
  speed: 1, // 当前场景速度
  speedSliderVisiable: false, // 滑块的显隐
  bottomShow: props.bottomShow, // 整个时间轴显隐
  sceneBId: '', //当前场景id
  skipTime: '', // 跳转的时间点
  selectEvent: '', //选择某一事件
  eventList: [], //选择事件列表
  speedList: [
    { speed: 1 },
    { speed: 2 },
    { speed: 3 },
    { speed: 4 },
    { speed: 5 },
    { speed: 6 }
  ],
  selectSpeed: 1,
  recordId: '1747132403692417026', //任务id
  fightStartTime: '2027-05-30T12:00:00Z', //场景开始时间
  fightEndTime: '2027-05-30T12:16:02Z', //场景结束时间
  sceneId: '1666340262760284163',
  showEventList: false,
  delayTime: 1
})
var emit = defineEmits(['changeState']) //定义事件

// 场景加载完毕后才初始化时间轴参数
onMounted(async () => {
  emitter.on('showEventPanel', (type) => {
    state.showEventList = type
  })
  // 接收时间暂停消息
  emitter.on('timePause', (val) => {
    console.log('初始暂停了')
    state.playState = val
    const formData2 = new FormData()
    formData2.append('recordId', store.getters.getRecordId)
    deducePause(formData2) //任务id
    window.EarthViewer.clock.shouldAnimate = false
  })
  init() //初始化
  const loading = ElLoading.service({
    lock: true,
    text: '加载数据中...',
    background: 'rgba(0, 0, 0, 0.7)'
  })
  //初始化复盘接口
  initReplay().then((res) => {
    const { handleReplayCzmlUpdate } = seaAirJointOperationsCzml()
    if (res.code == 200) {
      let czmlData = res.data
      window.EarthViewer.clock.shouldAnimate = false

      //判断返回的对象里是否有czml数据
      if (Object.keys(czmlData).length > 1) {
        //注册czml流监听事件
        getInforByType()
        state.playState = 'pause'
        let endTime = 0
        for (let item in czmlData) {
          //返回的数组中有个endTime字段，是场景的运行的秒数，其他数据是实体的czml
          if (item != 'endTime') {
            handleReplayCzmlUpdate(czmlData[item])
          } else {
            endTime = czmlData[item]
          }
        }
        setTimeout(() => {
          if (endTime) {
            setZoomTime(endTime) //设置时间轴范围
          }
          loading.close()
        }, 4000)
      } else {
        ElMessage.warning('返回数据有问题，请检查数据格式!')
      }
    }
  })
})
//初始化
const init = () => {
  store.commit('setIsReplayType', true) //设置复盘状态
  state.recordId = store.state.sceneModule.recordId
  //调用停止场景接口
  const formData = new FormData()
  formData.append('recordId', store.getters.getRecordId)
  deduceStop(formData)

  window.EarthViewer.clock.shouldAnimate = false
  // 显示时间轴
  window.EarthViewer.timeline.container.style.zIndex = 1
  window.EarthViewer.timeline.container.style.visibility = 'visible'
  //隐藏头部DOM
  isHideDom(false)
  // 加载作战区域信息
  loadScenarioOperationalAreaFile()
}
//设置时间轴范围
const setZoomTime = (endTime) => {
  //场景开始时间
  let fightStartTime = store.state.sceneModule.fightStartTime
  //获取场景结束时间
  let fightEndTime = window.date2String(
    new Date(fightStartTime),
    endTime * 1000
  )

  store.commit('setFightEndTime', state.fightEndTime) //存储场景结束时间
  //设置时间轴范围
  let startTime = window.MSIMEarth.JulianDate.addHours(
    window.MSIMEarth.JulianDate.fromDate(new Date(fightStartTime)),
    8,
    new window.MSIMEarth.JulianDate()
  )

  let stopTime = window.MSIMEarth.JulianDate.addHours(
    window.MSIMEarth.JulianDate.fromDate(new Date(fightEndTime)),
    8,
    new window.MSIMEarth.JulianDate()
  )

  window.EarthViewer.clock.startTime = startTime.clone()
  window.EarthViewer.clock.stopTime = stopTime.clone()
  window.EarthViewer.clock.currentTime = startTime.clone()
  // 定义时间线参数，设置开始时间、结束时间和当前时间刻度颜色
  window.EarthViewer.timeline.zoomTo(startTime.clone(), stopTime.clone())
}
// 深度监听当前场景速度的变化
watch(
  () => state.speed,
  (newValue, oldValue) => {
    // 修改状态
    if (newValue == 0) state.playState = 'pause'
    if (newValue > 0) state.playState = 'forward'
    if (newValue < 0) state.playState = 'back'
    // 同步滑块上的显示值
    state.curSpeed = state.speed
    // // 修改场景速度
    // window.EarthViewer.clock.multiplier = state.speed
    // store.commit('setMultiplier', state.speed)
    // // 速度同步到后台
    // let parmas = {
    //   recordId: state.recordId,
    //   timeSpeed: state.speed
    // }
    // updateTimeSpeedToServe(parmas)
  },
  {
    deep: true
  }
)
onUnmounted(() => {
  stop()
})
// 暂停或启动
const pause = async () => {
  // 启动
  if (state.playState == 'pause') {
    //播放
    const formData1 = new FormData()
    formData1.append('recordId', store.getters.getRecordId)
    await deduceStart(formData1) //任务id

    if (state.curSpeed < 0) {
      state.playState = 'back'
    } else {
      state.playState = 'forward'
    }
    window.EarthViewer.clock.shouldAnimate = true
  } else {
    // 暂停
    const formData2 = new FormData()
    formData2.append('recordId', store.getters.getRecordId)
    await deducePause(formData2) //任务id
    window.EarthViewer.clock.shouldAnimate = false
    state.playState = 'pause'
  }
}

// 快退-1(新)
const fastBackNow = () => {
  state.speed = state.speed - 1
  if (state.speed < 1) {
    beautyToast.info({
      title: 'Warning',
      message: `倍速不能为负数`,
      darkTheme: true
    })
    window.EarthViewer.clock.multiplier = state.speed
  } else {
    let params = {
      recordId: state.recordId,
      timeSpeed: state.speed
    }
    updateTimeSpeedToServe(params)
  }
}

// 快进+1(新)
const fastForwardNow = () => {
  state.speed = state.speed + 1
  if (state.speed < 1) {
    window.EarthViewer.clock.multiplier = state.speed
  } else {
    let params = {
      recordId: state.recordId,
      timeSpeed: state.speed
    }
    updateTimeSpeedToServe(params)
  }
}
// 设置速度
function setSpeed() {
  state.speed = state.curSpeed
}

// 更新后台场景时间流速
function updateTimeSpeedToServe(parmas) {
  // 速度同步到后台
  const formData = new URLSearchParams()
  formData.append('recordId', parmas.recordId)
  formData.append('timeSpeed', parmas.timeSpeed)
  replayUpdateTimeSpeed(formData).then((res) => {
    if (res.code == 200) {
      window.EarthViewer.clock.multiplier = parmas.timeSpeed
      store.commit('setMultiplier', parmas.timeSpeed)
    }
  })
}

// 跳转到输入的时间
function skipTimeChange() {
  // 即将跳转的时间
  let timeStr = date2String(state.skipTime)
  sceneTimeSkip(timeStr)
}
//复盘接口初始化
const initReplay = () => {
  const formData = new URLSearchParams()
  formData.append('recordId', state.recordId)
  return deduceInit(formData)
}
//复盘接口停止
const stop = () => {
  exitReplayFun()
}
const isHideDom = (boolean) => {
  if (boolean) {
    document.getElementsByClassName('sceneSelectDIV')[0].style.display = 'block'
    document.getElementsByClassName('headbox_time')[0].style.visibility = 'none'
  } else {
    document.getElementsByClassName('sceneSelectDIV')[0].style.display = 'none'
    document.getElementsByClassName('headbox_time')[0].style.visibility =
      'hidden'
  }
  if (document.getElementsByClassName('bottomControl').length > 0) {
    document.getElementsByClassName('bottomControl')[0].style.display = 'none' //左下角的底部菜单快捷图标
  }
}
//退出复盘功能
const exitReplayFun = () => {
  //显示头部DOM
  isHideDom(true)
  if (EventController) {
    if (!window.curSceneID) return
    SSECloseReplay({ userid: window.curSceneID })
      .then((res) => {
        if (res.code == 200) {
          console.log(window.curSceneID, '客户端关闭成功')
          if (EventController) {
            EventController.closeStream()
            EventController = null
          }
        }
      })
      .catch((err) => {
        console.log(err)
      })
    // sceneControl({ kill: 0 }).then((res) => {})
  }
  EarthAPP.i = 0
  store.commit('setFightStartTime', '')
  store.commit('setFightEndTime', '')
  window.EarthViewer.timeline.container.style.zIndex = -1
  //调用停止场景接口
  const formData = new FormData()
  formData.append('recordId', store.getters.getRecordId)
  deduceStop(formData)

  store.commit('setIsReplayType', false) //设置复盘状态为关闭
  emitter.emit('leftComp', { name: '' }) // 打开任务列表
  emitter.emit('bottomComp', { name: '' }) // 关闭裁决框
  emitter.emit('rightComp', { name: '' }) //  关闭zz详情框
  emitter.emit('showReplayLine', false) // 关闭复盘时间轴
  emitter.emit('changeConnectionLegend', false) // 关闭链路框
  if (document.getElementsByClassName('bottomControl').length > 0) {
    document.getElementsByClassName('bottomControl')[0].style.display = 'flex' //左下角的底部菜单快捷图标
  }
  //隐藏右侧的工具条
  if (document.getElementsByClassName('left-navbar').length > 0) {
    document.getElementsByClassName('left-navbar')[0].style.display = 'none'
  }
  setTimeout(() => {
    emitter.emit('closeTaskList', true) // 打开任务记录回放详情页
  }, 100)
  // 上一场景实体清除
  window.EarthViewer.entities.removeAll()
  //window.EarthPlugn.entity._ClearCZMLEntity('MSIMEarthCZMLProcessContainer')
  for (let x = 0; x < EarthViewer.dataSources.length; x++) {
    if (
      EarthViewer.dataSources.get(x).processName ==
      'MSIMEarthCZMLProcessContainer'
    ) {
      EarthViewer.dataSources.remove(EarthViewer.dataSources.get(x))
    }
  }
  if (EarthViewer.dataSources.getByName('矢量天气').length > 0) {
    EarthViewer.dataSources.remove(
      EarthViewer.dataSources.getByName('矢量天气')[0]
    ) //移除天气
  }
  // 初始化球上各种标注数据
  let dataController = new window.EarthPlugn.DataControl({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  dataController.add_bblabel()
  dataController.addChina()
  removeOperationalArea()
  // let cusP = new window.EarthPlugn.customPritive(
  //   window.MSIMEarth,
  //   window.EarthViewer
  // )
  // cusP.clearMulti()
  //EarthAPP.timeVal = state.delayTime //恢复延迟时间
  //删除雷达效果
  deleteRader()
  EarthAPP.billboardCollection.removeAll() //移除动态聚合标牌
  EarthAPP.labelCollection.removeAll() //移除静态聚合label
}
//建立sse或者消息中间键通信
const getInforByType = () => {
  EventController = new window.EarthPlugn.EventSourceController({
    baseUrl: serverUrls.serversCommunication
  })
  EventController.initStreamReplay()
  setTimeout(() => {
    //getPAStatic({ side: 'admin' }).then((res) => {})//复盘中不需要调用PAStatic接口
    // setTimeout(() => {
    //   setPlateMoveCommond({ side: 'admin' }).then((res) => {})//复盘中不需要调用静态清除变动态的接口
    // },3000)
  }, 1500)
}
const clickBtn = () => {
  emitter.emit('showEventPanel', true) // 打开任务列表
}
// 删除雷达效果
const deleteRader = () => {
  for (
    let i = window.EarthViewer.scene.primitives._primitives.length - 1;
    i >= 0;
    i--
  ) {
    let p = window.EarthViewer.scene.primitives._primitives[i]
    if (typeof p.id !== 'undefined') {
      if (typeof p.id == 'string' && p.id.indexOf('radar') > -1) {
        if (typeof p !== 'undefined') {
          window.EarthViewer.scene.primitives.remove(p)
        }
      }
    }
  }
  for (
    let ii = window.EarthViewer.scene.primitives._primitives.length - 1;
    ii >= 0;
    ii--
  ) {
    let item = window.EarthViewer.scene.primitives._primitives[ii]
    if (typeof item.id !== 'undefined') {
      if (
        typeof item.id == 'string' &&
        item.id.indexOf('_ElectronicInterfer') > -1
      ) {
        if (window.EarthViewer.entities.getById(item.id)) {
          window.EarthViewer.entities.removeById(item.id)
        }
      }
    }
  }
}
//移除作战区域
const removeOperationalArea = () => {
  window.EarthViewer.dataSources._dataSources.forEach((dataSource) => {
    if (dataSource._name == '作战区域') {
      window.EarthViewer.dataSources.remove(dataSource)
    }
  })
}
</script>

<style lang="less" scoped>
* {
  margin: 0;
  padding: 0;
}

.exercise_timeline {
  height: 100%;
  position: absolute;
  width: 100%;
  top: 0px;

  .timeline {
    width: 96%;
    margin: 50px auto auto;
    display: flex;

    .hide {
      display: none;
    }

    .Control {
      .play {
        width: 50px;
        height: 50px;
        border-radius: 50px;
        line-height: 51px;
        box-shadow: 0 0 4px 0 black;
        background-color: #fff;
        color: #fff;
        text-align: center;
        cursor: pointer;

        .iconplay {
          font-size: 20px;
          color: #2faeff;
          margin-left: 4px;
        }

        .iconpause {
          font-size: 20px;
          color: #2faeff;
          margin-left: 1px;
        }
      }
    }

    .line_box {
      position: relative;
      width: 100%;

      .line {
        position: relative;
        top: 50%;
        width: 100%;
        height: 1.5625rem;
        // border: 0.625rem solid transparent;
        border-left: none;
        border-right: none;
        margin-top: -0.75rem;

        .cover {
          width: 100%;
          height: 100%;
          position: absolute;
          top: 0;
          left: 0;
          z-index: 999;
          cursor: pointer;
        }

        .progerss_line {
          width: 100%;
          position: absolute;
          top: 5px;
          left: 0px;
          right: 0px;
          transition: width ease-in-out 0.3s;

          .palyed {
            background-color: #2faeff;
            height: 2px;
            float: left;
            border-top-left-radius: 3px;
            border-bottom-left-radius: 3px;
            width: 0%;
            transition: width ease-in-out 0.3s;
          }

          .bg {
            height: 2px;
            background-color: rgba(68, 65, 65, 0.8);
            width: 100%;
            border-radius: 6px;
          }
        }

        .calendar {
          position: absolute;
          left: 0;
          right: 0;
          top: -25px;
          white-space: nowrap;

          .calendar_lab {
            display: inline-block;
            box-sizing: border-box;
            text-align: center;
            font-size: 12px;
            height: 28px;
            white-space: nowrap;
            text-shadow: 0 0 4px black;
            color: #fff;
            position: relative;
            bottom: -3px;

            .calendar_lab_name {
              position: absolute;
              left: -25px;
              bottom: 15px;
            }
          }

          .calendar_lab:not(:first-child)::after {
            content: '';
            position: absolute;
            bottom: 0px;
            left: 0px;
            width: 0px;
            height: 13px;
            border-left: 1px solid rgb(116, 114, 114);
            border-top: none;
          }

          .calendar_lab:first-child::after {
            content: '';
            position: absolute;
            bottom: 0px;
            left: 0px;
            width: 0px;
            height: 13px;
            border-right: 1px solid rgb(116, 114, 114);
            border-top: none;
          }
        }

        .calendars {
          position: absolute;
          left: 0;
          right: 0;
          top: 4px;
          white-space: nowrap;

          .calendar_lab {
            display: inline-block;
            box-sizing: border-box;
            font-size: 12px;
            line-height: 12px;
            height: 12px;
            white-space: nowrap;
            overflow: hidden;
            text-shadow: 0 0 4px black;
            color: #fff;
            position: relative;
            bottom: 10px;
          }

          // .calendar_lab:not(:first-child)::after {
          //     content: "";
          //     position: absolute;
          //     top: 0px;
          //     left: 0px;
          //     width: 0px;
          //     height: 8px;
          //     border-left: 1px solid rgb(116, 114, 114);;
          //     border-top: none;
          // }
          .calendar_lab:not(:last-child)::before {
            content: '';
            position: absolute;
            top: 0px;
            left: 0px;
            width: 0px;
            height: 8px;
            border-left: 1px solid rgb(116, 114, 114);
            border-top: none;
          }
        }

        .time_code {
          z-index: 999;
          font-size: 13px;
          position: absolute;
          left: 0px;
          top: -30px;
          pointer-events: none;
          box-sizing: border-box;
          transition: left ease-in-out 0.3s;
          transform: translateX(-50%);

          .box {
            cursor: pointer;
            color: white;
            text-shadow: 0 0 4px #2faeff;
            background-color: #2faeff;
            box-shadow: 0 0 4px 0 black;
            white-space: nowrap;
            text-align: center;
            border-radius: 2px;
            padding: 2px 8px;

            &::before {
              top: 100%;
              left: 50%;
              border: solid transparent;
              content: ' ';
              height: 0;
              width: 0;
              position: absolute;
              border-top-color: #2faeff;
              border-width: 6px;
              margin-left: -5px;
            }
          }
        }

        .pointer_code {
          opacity: 0;
          font-size: 13px;
          position: absolute;
          left: 0px;
          top: -50px;
          pointer-events: none;
          box-sizing: border-box;
          transition: 0.3s opacity 0s;
          transform: translateX(-50%);

          .box {
            box-shadow: none;
            cursor: pointer;
            color: white;
            text-shadow: 0 0 4px #000000;
            background-color: rgba(78, 78, 78, 0.84);
            box-shadow: 0 0 4px 0 black;
            white-space: nowrap;
            text-align: center;
            border-radius: 2px;
            padding: 2px 8px;

            &::before {
              top: 100%;
              left: 50%;
              border: solid transparent;
              content: ' ';
              height: 0;
              width: 0;
              position: absolute;
              border-top-color: rgba(78, 78, 78, 0.84);
              border-width: 6px;
              margin-left: -5px;
            }
          }
        }

        .line_time {
          z-index: 999;
          position: absolute;
          top: 2px;
          margin-left: -3px;
          transition: left ease-in-out 0.3s;
          width: 8px;
          height: 8px;
          background-color: #2faeff;
          border-radius: 50%;
        }
      }
    }
  }

  .timeline_btns {
    // margin-top: 4%;
    // margin-top: 83px;
    // margin: 10px auto auto;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .btns_container {
      display: flex;
      position: relative;

      .speed_bar {
        position: absolute;
        left: 200px;
        top: 8px;
        z-index: 9999;
        cursor: default;

        p {
          font-size: 12px;
          font-style: italic;
          color: #2faeff;
          border: 1px solid #2faeff;
          padding: 1px 6px;
          line-height: 1;
          border-radius: 3px;
          display: flex;

          span {
            font-size: 13px;
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
        width: 40px;
        align-items: center;
        justify-content: space-between;
        cursor: pointer;

        i {
          color: #2faeff;
          text-align: center;
          font-size: 20px;

          &.on {
            font-weight: 600;
            background: rgba(255, 255, 255, 0.2);
            padding: 2px;
            border-radius: 4px;
            box-shadow: 0 0 4px #ddd;
          }
        }

        .stop_iconfont {
          width: 20px;
          height: 20px;
          background-image: url('@/assets/image/停止.png');
          background-repeat: no-repeat;
          background-size: 100% 100%;
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

    // div {
    //   display: flex;
    //   position: relative;
    // }

    // div > div {
    //   display: flex;
    //   width: 40px;
    //   align-items: center;
    //   justify-content: space-between;
    //   cursor: pointer;
    //   i {
    //     color: #2faeff;
    //     text-align: center;
    //     font-size: 20px;

    //     &.on {
    //       font-weight: 600;
    //       background: rgba(255, 255, 255, 0.2);
    //       padding: 2px;
    //       border-radius: 4px;
    //       box-shadow: 0 0 4px #ddd;
    //     }
    //   }
    // }
  }

  .eventBtn {
    position: absolute;
    right: 90px;
    bottom: 10px;
    color: #2faeff;
    border: 1px solid #2faeff;
    padding: 2px 3px;
  }
}

.bar_btn {
  // margin-top: 5px;
  font-size: 12px;
  border: 1px solid #3093d5;
  color: #3093d5;
  background: rgba(0, 0, 0, 0.4);
  margin-left: 14px;
}

.timeconfig-div {
  position: absolute;
  left: 70%;
  bottom: 100px;
  width: 350px;
  background-color: #02152c6e;
  height: 43px;
  padding: 5px;
  border: 1px solid rgb(21, 115, 173);
}

.el-input-number {
  width: 110px !important;
}

.bottomshow {
  position: absolute;
  left: 13%;
  top: -10%;
  z-index: 2;
  cursor: pointer;
  // font-size: 36px !important;
}

.bottomshow2 {
  position: absolute;
  left: 13%;
  bottom: -50%;
  z-index: 2;
  cursor: pointer;
  // font-size: 36px !important;
}

// 选择时间
:deep .el-input__wrapper {
  background: rgba(0, 0, 0, 0);
  border: 1px solid #0373a1;
}

:deep .el-input__inner {
  color: white !important;
}
</style>
<style lang="less">
.skipTimeSelect {
  .el-picker-panel {
    background: #002c68 !important;
    color: #ffffff;
    border: 1px solid #0373a1 !important;
    line-height: 20px;

    .el-picker-panel__icon-btn {
      width: 20px;
      height: 20px;
      margin: 0 5px;
      padding: 4px;
      color: #cbd3f0 !important;
      background: #093a7e;
      border-radius: 3px;
    }

    .el-date-picker__time-header {
      border-bottom-color: #143e78;

      .el-input__wrapper {
        background: #002c68 !important;
        border: 1px solid #044ebb;
        box-shadow: none;

        .el-input__inner {
          color: white;
        }
      }
    }

    .el-date-table th {
      border-bottom: none;
    }

    .el-date-table td.next-month,
    .el-date-table td.prev-month {
      color: rgba(255, 255, 255, 0.26);
      font-size: 14px;
    }

    .el-date-table td.today .el-date-table-cell__text {
      font-family: PingFangSC-Medium;
      font-size: 14px;
      color: #3e8eff;
      text-align: center;
      font-weight: 500;
    }
  }

  .el-popper__arrow::before {
    background: #002c68 !important;
    border: 1px solid #0373a1 !important;
  }

  .el-date-picker__header-label {
    color: #3e8eff !important;
  }

  .el-date-picker__header-label:hover {
    color: #ffffff;
  }

  .el-date-table td.disabled div {
    background-color: #002c68 !important;
  }

  .el-picker-panel .el-date-table th {
    color: #c3e3ec;
  }

  .el-picker-panel .el-date-table td.available {
    font-size: 14px;
    font-weight: 500;
    color: rgba(255, 255, 255, 0.9);
  }

  .el-picker-panel .el-date-table td.available:hover {
    color: #ffffff;
  }

  .el-date-table td.disabled .el-date-table-cell {
    color: rgba(255, 255, 255, 0.26);
    font-size: 14px;
  }

  .el-picker-panel__footer {
    background: #002c68 !important;
    border-top-color: #143e78;
  }

  .el-button.is-text {
    color: #ffffff;
  }

  .el-button.is-plain {
    background: #3e8eff !important;
    border: 1px solid #044ebb00;
    color: #fff;
  }

  .el-picker-panel .el-time-panel {
    background: #002c68 !important;
    border: 1px solid #044ebb;
  }

  .el-time-spinner__item {
    color: rgba(255, 255, 255, 0.26);
  }

  .el-time-spinner__item.is-active:not(.is-disabled) {
    color: white;
  }

  .el-time-spinner__item:hover:not(.is-disabled):not(.is-active) {
    background: #044ebb;
  }

  .el-time-panel__btn {
    color: white;
  }

  .el-time-panel__btn.confirm {
    background: #3e8eff !important;
    border: 1px solid #044ebb00;
    color: white;
    border-radius: 2px;
  }
}

.eventSelect {
  background: #002c68;
  border: 0.5px solid rgba(3, 115, 161, 1);
  box-shadow: 0px 8px 10px -5px rgba(0, 0, 0, 0.08);
  box-shadow: 0px 16px 24px 2px rgba(0, 0, 0, 0.04);
  box-shadow: 0px 6px 30px 5px rgba(0, 0, 0, 0.05);
  border-radius: 3px 0px 0px 0px 3px 3px 0px 0px 0px 3px;

  .el-select-dropdown__item.hover,
  .el-select-dropdown__item:hover {
    background: rgba(4, 163, 255, 0.47) !important;
  }

  .el-select-dropdown__item {
    padding: 0 5px !important;
    margin: 10px 20px;
    background: rgba(4, 163, 255, 0.1) !important;
  }

  .el-select-dropdown__wrap {
    max-height: 400px !important;
  }

  .el-popper__arrow::before {
    background: #002c68 !important;
    border: 0.5px solid rgba(3, 115, 161, 1) !important;
  }
}
</style>
