import {
  toRefs,
  reactive,
  onMounted,
  ref,
  watch,
  onBeforeUnmount,
  defineEmits
} from 'vue'
// import { useStore } from 'vuex'
import store from '@/store/index'
import emitter from '@/utils/eventbus'
import * as turf from '@turf/turf'
import { selectAllScene, selectAllSceneByPage } from '@/service/SSE.js'
import { getPAStatic } from '@/service/SSE.js'
import { BASE_URL } from '@/service/request/config'
import {
  SSEClose,
  sceneControl,
  startAFSIM,
  startTask,
  stopAFSIM
} from '@/service/SSE'
import { eventControllerSSEClose } from '@/utils/mapTools'

export default function () {
  const state = reactive({
    sceneList: [],
    sceneSelectContent: ''
  })
  watch(
    () => store.state.message,
    (newValue, oldValue) => {
      if (newValue.type != 'LOAD_SCENE_MSG') {
        return 0
      }
      sceneSelectChange(JSON.parse(newValue.content).sceneId)
    }
  )

  onMounted(() => {
    window.fireParticle = []
    window.turf = turf
    const hash = window.location.hash
    const match = hash.match(/sceneBId=(\d+)/)
    const sceneBId = match ? match[1] : null
    // 获取所有场景列表
    // AllScene()
    AllSceneByPage()
  })

  // 获取所有场景列表
  function AllScene() {
    selectAllScene().then((res) => {
      state.sceneList = []
      let data = res.data
      if (data && data.length > 0) {
        data.forEach((e) => {
          let curScene = {
            value: e.simulationName,
            label: e.simulationName,
            info: e.simulationInfo,
            bId: e.id
            // wsPort: e.port
          }
          state.sceneList.push(curScene)
        })
      }
    })
  }

  // 获取所有场景列表（带分页器）
  function AllSceneByPage() {
    let params = {
      pageNum: '2',
      pageSize: '10'
    }
    selectAllSceneByPage(params).then((res) => {
      state.sceneList = []
      if (res.code == 200) {
        let data = res.data.records
        data.forEach((e) => {
          let curScene = {
            value: e.name,
            label: e.name,
            taskInfo: e.taskInfo,
            taskPurpose: e.taskPurpose,
            thinkGround: e.thinkGround,
            voiceName: e.voiceName,
            bId: e.id,
            scenarioDetailsMarkPicUrl: staticUrl + e.scenarioDetailsMarkPicUrl,
            scenarioWarEnvironment: e.scenarioWarEnvironment,
            intelligenceParam: e.intelligenceParam, //情报要素
            scenarioDetail: e.scenarioDetail, //详情
            troopsDescription: e.troopsDescription //参战兵力
            // wsPort: e.port
          }
          state.sceneList.push(curScene)
        })
      }
    })
  }

  // 场景选择
  function sceneSelectChange(val) {
    // SIMManager.simController.stopSim() // 停止afsmin引擎
    store.commit('setCurrentName', val)
    emitter.emit('sceneConfigComp', '')
    emitter.emit('closeCheckBox', false)
    state.sceneList.forEach((e) => {
      if (e.value == val) {
        console.log(e)
        state.sceneSelectContent = e
        store.state.curSceneName = e.label
        // store.state.curSceneInfo = JSON.parse(e.info)
        let curSceneObj = {
          taskInfo: e.taskInfo,
          taskPurpose: e.taskPurpose,
          thinkGround: e.thinkGround,
          voiceName: staticUrl + e.voiceName,
          name: val
        }
        store.state.curSceneInfo = curSceneObj
        emitter.emit('initSceneTime', true)
        if (EventController) {
          eventControllerSSEClose(EventController)
        }
        EventController = new window.EarthPlugn.EventSourceController({
          baseUrl: serverUrls.serversCommunication
        })
        EventController.initStream()
        // window.EventController = EventController
        toggleScene(e.bId)
        const side = window.localStorage.getItem('side')
        setTimeout(() => {
          getPAStatic({ side: side }).then((res) => {})
        }, 1500)
      }
    })
    stopAFSIM().then((res) => {
      console.log('停止afsim', res)
      if (res.code == 200) {
        startById()
      }
    })
    // 初始化选中的地理数据
    // let options = {
    //   earth: window.MSIMEarth,
    //   viewer: window.EarthViewer,
    //   type: 'panel'
    // }
    // let layerList = new window.EarthPlugn.treeManagement(options)
    // let resultTreeData = layerList.panelManagement.updateTickStatus(
    //   store.state.sceneModule.layerManagementData,
    //   [
    //     { name: '九段线', code: 'nineLine' },
    //     { name: '地名', code: 'mainCity' },
    //     { name: '国家点', code: 'china' }
    //   ],
    //   'add'
    // )
    // store.commit(
    //   'setLayerManagementData',
    //   JSON.parse(JSON.stringify(resultTreeData))
    // )
  }
  // 启动afsim引擎接口
  function startById() {
    let params = {
      sceneID: state.sceneSelectContent.bId
    }
    startAFSIM(params).then((res) => {
      console.log('启动afsim', res)
    })
  }
  // 任务加载
  function loadingTask(val, isRestart) {
    // SIMManager.simController.stopSim()
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
    }, 1500)
    let params = {
      taksId: val.id
    }
    if (isRestart) {
      stopAFSIM().then((res) => {
        console.log('停止afsim', res)
        if (res.code == 200) {
          startTask(params).then((res) => {
            console.log('启动任务加载', res)
          })
        }
      })
    }
  }
  // 接到场景加载消息后 （暂时不用这个）
  function sceneChange(val) {
    state.sceneList.forEach((e) => {
      if (e.bId == val) {
        state.sceneSelectContent = e
        toggleScene(e.bId)
      }
    })
  }

  // 场景变化后执行函数
  async function toggleScene(bId) {
    let viewer = window.EarthViewer
    // 保存场景id
    store.commit('setSceneID', bId)
  }

  return {
    state,
    sceneSelectChange,
    sceneChange,
    loadingTask
  }
}
