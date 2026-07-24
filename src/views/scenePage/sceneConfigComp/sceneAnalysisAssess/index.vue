<template>
  <div class="statistic-analysis" v-show="vueData.isShowAnalysis">
    <div class="analysis-container">
      <div class="formulate-title">
        <span>任务评估分析</span>
      </div>
      <img
        src="@/assets/image/panelIcons/最小化.png"
        alt="最小化"
        class="min_size"
        @click="handleMinSize"
      />
      <img
        src="@/assets/image/panelIcons/关闭icon.png"
        alt="关闭"
        class="close_sty"
        @click="handleClose"
      />
      <el-tabs
        v-model="state.activeName"
        class="demo-tabs"
        @tab-change="tabChange"
      >
        <el-tab-pane label="模拟器统计" name="simulator">
          <simulator v-if="vueData.simulator" />
        </el-tab-pane>
        <el-tab-pane label="综合评估" name="comprehensive">
          <comprehensive v-if="vueData.comprehensive" />
        </el-tab-pane>
        <el-tab-pane label="兵力分析" name="troops">
          <troops v-if="vueData.troops" />
        </el-tab-pane>
        <el-tab-pane label="战果分析" name="resultAna">
          <resultAna v-if="vueData.resultAna" />
        </el-tab-pane>
      </el-tabs>
      <el-button
        type="primary"
        style="position: absolute; top: 9%; right: 4%"
        @click="selectOpen"
        >上传/发布</el-button
      >
    </div>
  </div>
  <!-- <trajectoryReplay v-if="vueData.showTrajectoryReplay"></trajectoryReplay> -->
</template>

<script setup>
import { reactive, onMounted, onUnmounted } from 'vue'
import emitter from '@/utils/eventbus'
import comprehensive from './comprehensive.vue'
import troops from './troops.vue'
import resultAna from './resultAna.vue'
import simulator from './simulator.vue'
// import trajectoryReplay from './components/simulator/trajectoryReplay.vue' //轨迹回放
import { getTrajectoryReplayData } from '@/utils/mapTools'
import {
  getSimulatorCZML,
  uETrajectoryReplayStop,
  uETrajectoryReplaybegin,
  getSimulatorCZMLByTimeZone
} from '@/service/simulatorServer'
import { simulatorReplay } from '@/service/SSE'
import store from '@/store/index'
import { ElNotification } from 'element-plus'

const state = reactive({
  activeName: 'simulator'
})
const vueData = reactive({
  showTrajectoryReplay: false,
  comprehensive: false,
  troops: false,
  resultAna: false,
  simulator: true,
  isShowAnalysis: true,
  simulatorName: ''
})
const handleClose = () => {
  emitter.emit('closeBottomControlPanel', 'three')
}
const handleMinSize = () => {
  vueData.isShowAnalysis = false
  emitter.emit('isShowReturnImg', {
    simulatorName: vueData.simulatorName,
    isShow: true
  })
}
const selectOpen = () => {
  ElNotification({
    // title:'',
    message: '发布成功',
    type: 'success'
  })
}
const tabChange = (name) => {
  if (name == 'comprehensive') {
    vueData.comprehensive = true
    vueData.troops = false
    vueData.resultAna = false
    vueData.simulator = false
  } else if (name == 'troops') {
    vueData.troops = true
    vueData.comprehensive = false
    vueData.resultAna = false
    vueData.simulator = false
  } else if (name == 'simulator') {
    vueData.simulator = true
    vueData.comprehensive = false
    vueData.troops = false
    vueData.resultAna = false
  } else {
    vueData.resultAna = true
    vueData.comprehensive = false
    vueData.troops = false
    vueData.simulator = false
  }
}

onMounted(() => {
  // 轨迹回放
  emitter.on('isShowTrajectoryReplay', (val) => {
    vueData.simulatorName = val.simulatorName
    ueReplay() //调用接口给UE下达轨迹回放消息

    // vueData.showTrajectoryReplay = val
    let startTime = store.state.sceneModule.startSceneTime
    let endTime = store.state.sceneModule.endSeeStaticTime
    let params = {
      mnq: val.simulatorId + '', //模拟器Id,将数字转成字符串
      startSceneTime: startTime,
      endSceneTime: endTime
    }
    // let params = {
    //   "id": store.state.curSceneInfo.id,//场景Id
    //   "mnq": val.simulatorId + '', //模拟器Id,将数字转成字符串
    //   "replayId": store.state.sceneModule.sceneReplayId//回放id
    // }
    // getSimulatorCZML(params).then((res) => {
    getSimulatorCZMLByTimeZone(params).then((res) => {
      if (res.code != 200) {
        ElMessage.warning('获取数据失败，请稍后再试！')
        return
      }
      if (
        res.data &&
        res.data.czml &&
        res.data.czml[1].position.cartographicDegrees.length > 0
      ) {
        if (res.data) {
          getTrajectoryReplayData(res.data)
          handleMinSize()
        }
      } else {
        ElMessage.warning('获取轨迹数据失败!')
      }
    })

    // uETrajectoryReplayStop().then(() => { })
    // setTimeout(() => {
    //   uETrajectoryReplaybegin({ fileName: fileName }).then(() => {
    //   })
    // }, 2000)
  })
  //监听是否关闭评估分析弹框
  emitter.on('isShowAnalysis', (val) => {
    vueData.isShowAnalysis = val
  })
})
//调用接口给UE下达轨迹回放消息
const ueReplay = () => {
  // 调用UE轨迹回放
  let fileName = ''
  if (vueData.simulatorName == 'Y8') {
    fileName = 'yun-8'
  } else if (vueData.simulatorName == 'Y9') {
    fileName = 'yun-9'
  } else if (vueData.simulatorName == '教10') {
    fileName = 'jiao-10'
  } else if (vueData.simulatorName == '轰6H') {
    fileName = 'hong6-h'
  }
  //通过给UE轨迹回放发送指令
  const formData = new FormData()
  formData.append('mnq', fileName)
  simulatorReplay(formData).then((res) => {
    if (res.code == 200) {
      console.log(res.data)
    }
  })
}
onUnmounted(() => {
  emitter.off('isShowTrajectoryReplay')
  emitter.emit('isShowReturnImg', {
    simulatorName: '',
    isShow: false
  })
})
</script>

<style lang="less" scoped>
.statistic-analysis {
  position: absolute;
  top: 12%;
  left: 50%;
  transform: translate(-50%, 0%);

  // z-index: 999;
  // width: 1200px;
  // height: calc(88vh - 220px);
  // background-image: url('~@/assets/image/panelIcons/装饰.png');
  // background-repeat: no-repeat;
  // background-size: 100% 100%;
  // display: flex;
  // justify-content: center;
  // align-items: flex-end;
  width: 1200px;
  height: calc(88vh - 155px);
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  box-sizing: border-box;

  .analysis-container {
    position: relative;
    width: 100%;
    height: 99.5%;
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;

    .close_sty {
      cursor: pointer;
      position: absolute;
      top: 10px;
      right: 10px;
      width: 20px;
      height: 20px;
    }

    .min_size {
      width: 24px;
      height: 20px;
      position: absolute;
      top: 11px;
      right: 45px;
      cursor: pointer;
    }

    .formulate-title {
      padding: 10px 0 10px 30px;
      box-sizing: border-box;
      text-align: center;
      // font-size: 18px;
      font-family: MFLiHei_Noncommercial-Regular;
      font-size: 25px;
      color: #ffffff;
      letter-spacing: 1.82px;
      font-weight: 400;
    }

    :deep(.el-tabs--border-card > .el-tabs__content) {
      padding: 0;
      height: calc(100% - 39px);

      .el-tab-pane {
        height: 95.5%;
      }
    }

    :deep(.el-tabs--border-card) {
      background: rgba(0, 0, 0, 0);
      border: none;
      height: calc(100% - 48px);
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
  }
}

.text_bg_sty {
  color: rgba(0, 231, 255, 1);
  transition: color ease-out 0.3s, text-shadow ease-out 0.3s;
  text-shadow: 0 0 1rem #0cf;
  padding: 10px;
  margin: 10px auto;
  background: rgba(0, 231, 255, 0.1);
  border: 1px solid rgba(0, 231, 255, 0.4);
  text-align: left;
  font-size: 20px;
  letter-spacing: 3px;
  text-indent: 2em;
}

:deep(.el-tabs__item.is-top) {
  color: #fff;
  font-size: 16px;
}

:deep(.el-tabs__nav-scroll) {
  padding-left: 10px;
  box-sizing: border-box;
}

:deep(.demo-tabs) {
  height: calc(100% - 55px);
}

:deep(.el-tabs__content) {
  height: calc(100% - 40px);
  box-sizing: border-box;
}

:deep(.el-tabs__header) {
  margin: 0 !important;
}

:deep(.el-tab-pane) {
  height: 100%;
}

:deep(.el-dialog),
.custom-dialog-background {
  background: rgba(16, 58, 101, 0.88) !important;
}

:deep(.el-icon),
:deep(.el-dialog__title) {
  color: #fff;
}
</style>
