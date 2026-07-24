import { createStore } from 'vuex'
import axios from 'axios' // 接口封装后导入接口即可
import home from './modules/home'
import sceneModule from './modules/scene'
import packModule from './modules/pack'
import homeModule from './modules/home'
import measurement from './modules/measurement'
import missionPreparation from './modules/missionPreparation'
import plot from './modules/plot'
import adjustControl from './modules/adjustControl'
import specialConfig from './modules/specialConfig'
import generalConfig from './modules/generalConfig'
import { WS_PATH } from '../service/request/config.js'
import seatModule from './modules/seat.js'
import combatSimulation from './modules/combatSimulation' //作战方针
import AFSIMModule from './modules/AFSIM'
import experimentModule from './modules/experiment'

const store = createStore({
  state() {
    return {
      name: 'wx', //测试用
      list: [], //测试用
      message: { name: 'wx', age: 18 },
      webSocket: null, //ws
      wsUrl: WS_PATH, //通信地址
      frequency: 1,
      operationTime: '',
      curSceneName: '',
      curSceneInfo: {
        taskInfo:
          '采用“一案多推”方式，对本方案进行50-200次推演，将仿真推演过程中的数据及结果数据进行采集处理，并分析统计，形成作战方案的评估结论。',
        // '根据红方前期情报侦察，已判明蓝军台岛东部地面作战力量部署情况，红方参战飞机从航母起飞，实施打击任务。',
        taskPurpose:
          '快速夺取台军台北桃园机场、台北附近暗滩、花莲机场、花莲港口等关键区域控制权，最小化人员伤亡，突出“陆/海/空/天协同+无人装备集群作战”优势。', //'红方摧毁蓝方地面指挥中心、导弹基地、作战飞机',
        thinkGround:
          '2027年5月21日，台湾当局公然进行“台独宣誓”“独立公投”等分裂活动，为遏制台独分裂活动，促进祖国统一大业，我方决定发起对台无人智能化作战，实施“对台无人饱和攻击”，以最小化伤亡快速夺取台军台北桃园机场、台北附近暗滩、花莲机场、花莲港口等关键区域控制权。',
        // '2027年9月，在一次全向围岛打击重大军事行动中，红方某航母编队担负对蓝方的台岛东部某机场实施侦察探测电子对抗及打击任务。',
        voiceName: 'http://10.1.51.95:4041//voice/海空联合作战.wav',
        name: '海空联合作战',
        id: '1749713542019284992',
        scenarioDetailsMarkPicUrl:
          'http://10.1.51.95:4041/images-sim/台海标图.png',
        scenarioWarEnvironment:
          '作战区域内存在云区、雨区、大浪区，会对作战任务产生影响。',
        intelligenceParam:
          '据侦知：蓝方机场上空两架飞机由北到南巡航。地导雷达已开机。',
        scenarioDetail:
          '红方为进攻方，由运输机、轰炸机、对地攻击、电子干扰等编队组成。蓝方为防守方，在目标阵地或靶场布置了雷达、高炮、歼击机、目标等CGF。\r\n          （一）运输机编队\r\n          运-8运输机所属部队接上级指令，将一批军事物资从该旅所属辽阳机场装载起飞，绕飞蓝方目标空域，抵达拉林机场后返场降落。\r\n          （二）轰炸机编队\r\n          轰炸机所属部队接上级指令进行打击，多机编队对某敌方目标进行轰炸。领航参谋计算航线，接到指令后，长僚机依次起飞，在长机指令下，组成轰炸编队，向蓝方目标空域挺近，抵达任务空域后，投放航空炸弹，完成任务后返航。\r\n          （三）对地攻击编队\r\n          歼击机所属部队接上级指令进行打击，接近目标空域，实施抵近侦察、目标识别，建立攻击航线。发射武器对蓝方空中力量实施攻击，结束任务后，返航。\r\n          （四）电子干扰编队\r\n          电子干扰编队所属部队接上级指令进行护航任务，在轰炸机执行任务期间，进行电子干扰。'
      }, // 想定信息
      currentTaskName: '', // 当前任务名称或者想定名称
      targetDetailsConfig: null, //映射表配置文件
      targetDetailsCheck: {}, //目标选中效果详情记录
      experimentalDataAnalysis_visible: false, //实验数据分析
      experimentalBasicDatabase_visible: false, //实验基础数据库
      url: '',
      sensorInfoDict:{} // 推演场景包络信息
    }
  },
  getters: {
    nameInfo(state) {
      return `name:${state.name}`
    },
    getMessage(state) {
      return state.message
    },
    getOperationTime(state) {
      return state.operationTime
    },
    getCurrentName(state) {
      return state.currentTaskName
    },
    getTargetDetailsConfig(state) {
      return state.targetDetailsConfig
    },
    getTargetDetailsCheck(state) {
      return state.targetDetailsCheck
    },
    getSensorInfoDict(state){
      return state.sensorInfoDict
    }
  },
  mutations: {
    initWebsocket(state) {
      state.webSocket = new WebSocket(state.wsUrl)
      //连接
      state.webSocket.onopen = function (event) {
        // 如果连接成功则发送心跳，防止ws协议自动断联
        // console.log(event)
        // setInterval(() => {
        //   console.log('1')
        //   state.webSocket.send('1')
        // }, 1000 * state.frequency)
      }
      // 消息接收
      state.webSocket.onmessage = function (e) {
        let messageStructure = JSON.parse(e.data)
        if (messageStructure) {
          state.message = messageStructure
        } else {
          state.message = messageStructure.data
        }
        // console.log('获取到的消息:', messageStructure)
      }
      // 通讯异常
      state.webSocket.onerror = function () {
        console.log('通讯出现了异常')
      }
      // 关闭连接
      state.webSocket.onclose = function () {
        console.log('关闭连接')
      }
    },
    changeName(state, payload) {
      state.name = payload
    },
    addData(state, payload) {
      state.list = payload
    },
    setOperationTime(state, payload) {
      state.operationTime = payload
    },
    setCurrentName(state, payload) {
      state.currentTaskName = payload
    },
    setTargetDetailsConfig(state, payload) {
      state.targetDetailsConfig = payload
    },
    setTargetDetailsCheck(state, payload) {
      state.targetDetailsCheck = payload
    },
    setExperimentalDataAnalysisVisible(state, type) {
      state.experimentalDataAnalysis_visible = type
    },
    setExperimentalBasicDatabaseVisible(state, type) {
      state.experimentalBasicDatabase_visible = type
    },
    setUrl(state, type) {
      state.url = type
    },
    setSensorInfoDict(state, type) {
      state.sensorInfoDict = type
    },
  },
  actions: {
    getxxx(context, payload) {
      return new Promise((resolve, reject) => {
        axios
          .get('xxx')
          .then((res) => {
            context.commit('addData', res.data.list)
            resolve({ name: 'wx', age: 9 })
          })
          .catch((err) => {
            reject(err)
          })
      })
    }
  },
  modules: {
    home,
    sceneModule: sceneModule,
    packModule: packModule,
    homeModule: homeModule,
    measurement,
    missionPreparation,
    plot,
    adjustControl,
    specialConfig,
    generalConfig,
    seatModule: seatModule,
    combatSimulation, //作战仿真
    AFSIMModule: AFSIMModule,
    experimentModule: experimentModule
  }
})

export default store
