/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2025-09-17 18:46:54
 * @LastEditors: ZX Li
 * @LastEditTime: 2025-12-24 10:07:58
 */
import store from '@/store/index'
import { getZZQYData } from '@/service/experiment/experiment.js'
import { startExperiment } from '@/service/combatSimulation.js'
import { eventControllerSSEClose } from '@/utils/mapTools'
import commonMethods from '@/utils/commonMethods/commonMethods.js'
import { ElMessage } from 'element-plus'

// 重启场景
const { configldrw } = commonMethods()
export function restartScene(row) {
  // console.log(row)
  // row = JSON.parse(row)
  window.localStorage.setItem('isRestartScene', false)
  // 开启加载动画
  loadingControl()
  // 通过切换地球实现地球初始化
  store.state.sceneModule.showEarth = !store.state.sceneModule.showEarth
  // 开启实验加载过程动画
  setTimeout(() => {
    store.state.sceneModule.showSatellite = true
  }, 500)
  sceneInfoConfig(row)
  // console.log(row.name)
  configldrw(row.name)
  // 地球切换完成后才开始实验
  // emitter.on('startExperiment', (value) => {})
  startExperiment(row.id).then((res) => {
    if (res.code != 200) {
      return (
        ElMessage.error(res.data) ||
        ElMessage.error('网络请求失败,请稍后重试！')
      )
    }

    ElMessage.success('场景重启成功！')

    if (EventController) {
      eventControllerSSEClose(EventController)
    }
    EventController = new window.EarthPlugn.EventSourceController({
      baseUrl: serverUrls.serversCommunication
    })
    EventController.initStream()
    _startExperimentReport()
    // 获取对应场景作战区域数据
    getZZQYData().then((res) => {
      console.log('res', res)
    })
  })
}

const loadingControl = () => {
  // 初始化三维场景时间控制器
  emitter.emit('showLoading', true)
  setTimeout(() => {
    emitter.emit('showLoading', false)
    // store.state.sceneModule.playState = 'pause'
    emitter.emit('initScenePauseState')
  }, 3000)
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

/****
 * 配置实验过程中汇报的内容
 */
const _startExperimentReport = () => {
  if (store.state.experimentModule.experimentReportList.length === 0) {
    console.log(
      `请先配置汇报内容${store.state.experimentModule.experimentReportList}`
    )
    return
  }
  let curExperimentReportList = []
  store.state.experimentModule.experimentReportList.forEach((e) => {
    if (e.time >= store.state.AFSIMModule.ATValue) {
      // 1.1 判断当前AT，已经在当前AT之前的事件不列为监听内容，未监听的内容推到监听队列中
      curExperimentReportList.push(e)
    }
  })
  console.log('当前仍需要执行的事件', curExperimentReportList)
  let cameraController = new window.EarthPlugn.CameraControl({})
  // 1 开启监听
  setInterval(() => {
    curExperimentReportList.forEach((e) => {
      // 1.2 基于场景判断是否到达事件所在时间点
      if (e.time <= store.state.AFSIMModule.ATValue && e.rendered === false) {
        console.log('还没执行的事件', e)
        // 1.2 如果到了则判断是否已经执行，如果没执行则执行该事件并暂停场景
        cameraController.flyByNode(e)
        e.rendered = true
      }
    })
  }, 1000)

  // 1.3 如果已经执行过则跳过该事件继续执行
}
