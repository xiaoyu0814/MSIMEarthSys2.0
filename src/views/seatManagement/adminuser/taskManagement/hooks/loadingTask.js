import { reactive, onMounted } from 'vue'
import store from '@/store/index'
import emitter from '@/utils/eventbus'
import { getPAStatic, getPADynamic, fillTaskInfo } from '@/service/SSE.js'
import { BASE_URL } from '@/service/request/config'
import {
  SSEClose,
  sceneControl,
  startTask,
  stopAFSIM,
  setPlateMoveCommond
} from '@/service/SSE'
import { checkMemberOfTasking } from '@/service/taskManagement'
import { changeInforType } from '@/service/websoketServer'
import { startAfsimServer, stopAfsimServer } from '@/service/timeline'
import {
  loadScenarioOperationalAreaFile,
  laodJtPaBaifangEntity,
  eventControllerSSEClose,
  date2String
} from '@/utils/mapTools'
import { toWebCommand } from '@/utils/earthPlugin/ThirdParty/eventSource/event/earthEvent'
import commonMethods from '@/utils/commonMethods/commonMethods.js'
export default function () {
  const state = reactive({})

  onMounted(() => {})

  // 检测席位组成员是否正在任务推演中
  function checkMemberOfTask(val, isRestart) {
    emitter.emit('sendXDShow', false)
    const { configldrw } = commonMethods()
    configldrw(val.name)
    store.state.sceneModule.showJB = false //设置为显示模型模式
    // 飞行到目标区域
    // flyToAreaByScene()
    // 如果isShow为false则不执行跳转
    if (!EarthAPP.sceneCamera.isShow) {
      // 不执行跳转时直接载入数据
      afterCheckMemberOfTaskFun(val, isRestart)
      return
    }

    // 视角跳转到目标区域
    window.EarthViewer.camera.flyTo({
      // destination: new window.MSIMEarth.Cartesian3.fromDegrees(109.87, 34.706, 21851000),
      destination: new window.MSIMEarth.Cartesian3(
        EarthAPP.sceneCamera.x,
        EarthAPP.sceneCamera.y,
        EarthAPP.sceneCamera.z
      ),
      duration: EarthAPP.sceneCamera.duration,
      orientation: {
        heading: EarthAPP.sceneCamera.h,
        pitch: EarthAPP.sceneCamera.p,
        roll: EarthAPP.sceneCamera.r
      },
      complete: () => {
        afterCheckMemberOfTaskFun(val, isRestart)
      }
    })
  }
  // 场景选择后执行checkMemberOfTask函数时传入的回调函数，前一版本直接在checkMemberOfTask函数里执行
  // 这里为了优化视角跳转把该函数抽离出来，待视角飞行到目标区域后再执行
  function afterCheckMemberOfTaskFun(val, isRestart) {
    let params = {
      assignmentId: val.id
    }
    console.log('val.name', val.name)
    if (!isRestart) {
      //继续推演
      store.commit('setPlayState', 'pause') //修改时间轴播放状态
      start_task(val, isRestart)
    } else {
      checkMemberOfTasking(params).then((res) => {
        if (res.code == '200') {
          if (res.data == 'ok') {
            start_task(val, isRestart)
            store.commit('setPlayState', 'pause') //修改时间轴播放状态
          } else {
            let msg = res.data.replace(/(\n|\r|\r\n)/g, '<br/>')
            ElMessage({
              type: 'warning',
              dangerouslyUseHTMLString: true,
              message: msg
            })
          }
        } else {
          ElMessage({
            type: 'error',
            dangerouslyUseHTMLString: true,
            message: res.message
          })
        }
      })
    }
  }

  // 导调控制席位的任务推演
  function start_task(val, isRestart) {
    const { commandWeather } = toWebCommand()
    // changeInforType({
    //   isTopic: store.state.sceneModule.systemConfig.isTopic
    // }).then((response) => {
    sessionStorage.setItem('taskId', val.id) //存储taskId
    sessionStorage.setItem('taskName', val.name)
    emitter.emit('initSceneTime', true)
    store.commit('setCurrentName', val.name)
    emitter.emit('closeCheckBox', false) // 关闭当前任务详情框
    emitter.emit('closeTaskList', false) // 关闭任务列表框
    store.state.curSceneName = val.name
    if (EventController) {
      eventControllerSSEClose(EventController)
    }
    EventController = new window.EarthPlugn.EventSourceController({
      baseUrl: serverUrls.serversCommunication
    })
    EventController.initStream()
    toggleScene(val.id)
    const side = window.localStorage.getItem('side')
    setTimeout(() => {
      getPAStatic({ side: side }).then((res) => {})
      getPADynamic({ sideCode: side }).then((res) => {})
      //调用发送platemove指令接口，移除动态数据的静态图标
      setTimeout(() => {
        // 飞行到目标区域
        //静态转动态删除
        setPlateMoveCommond({ sideCode: 'admin' }).then((res) => {
          console.log('静态转动态删除')
        })
      }, 3000)
      // 加载作战区域信息
      loadScenarioOperationalAreaFile()
      //通过接口下达推送天气区域数据指令
      commandWeather()
      // 加载白方静态数据 虚兵导调 -- J-16-1 and  J-16-2
      //laodJtPaBaifangEntity()
      store.commit('setStartSceneTime', date2String(new Date(), 0)) //存储当前启动场景这一刻的计算机时间，后面模拟器统计用
    }, 1500)

    let currentScreenInfor = store.getters.get_taskData //当前场景相关信息
    let params = {
      //taksId: val.id
      scenarioName: currentScreenInfor.scenarioForm.scenarioScriptsPath
    }
    //重启afsim
    if (isRestart) {
      stopAfsimServer().then(async (res) => {
        if (res.code == 200) {
          //记录推演数据接口
          let paramsInfor = {
            endTime: currentScreenInfor.scenarioForm.endTime,
            startTime: currentScreenInfor.scenarioForm.startTime,
            taskID: store.state.curSceneInfo.id
              ? store.state.curSceneInfo.id
              : '', //currentScreenInfor.id
            scenarioId: store.state.curSceneInfo.scenarioId,
            taskName: currentScreenInfor.name
          }
          //填充数据，复盘功能使用
          await fillTaskInfo(paramsInfor).then((res) => {
            if (res.code == 200) {
              console.log(res.data)
            } else {
              console.log('数据落库失败!')
            }
          })
          //await startTask(params).then((res) => { })
          setTimeout(() => {
            startAfsimServer(params).then((res) => {
              //判断链路，显示图例
              if (
                store.state.sceneModule.earthObjectConfig.indexOf('链路') > -1
              ) {
                emitter.emit('changeConnectionLegend', false)
              }
            })
          }, 2000)
        }
      })
    } else {
      if (store.state.sceneModule.earthObjectConfig.indexOf('链路') > -1) {
        emitter.emit('changeConnectionLegend', false)
      }
    }
    // })
  }

  // 场景变化后执行函数
  async function toggleScene(bId) {
    let viewer = window.EarthViewer
    // 保存场景id
    store.commit('setSceneID', bId)
  }

  return {
    state,
    checkMemberOfTask
  }
}
