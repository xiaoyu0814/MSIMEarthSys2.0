/*
 * @Description:
 * @Version: 2.0
 * @Autor: wx
 * @Date: 2022-05-06 01:28:50
 * @LastEditors: chenguopeng2 chenguopeng.piesat.cn
 * @LastEditTime: 2026-08-07 16:45:19
 */
const AFSIMModule = {
  namespaced: true, //独立使用
  state() {
    return {
      AFSIMCounter: 100,
      initData: [], //AFSIM程序启动时推送的初始数据，为后续的查询通信链路 武器挂载 设定路径等提供数据支撑
      rw_radarShow: true,
      stracklineData: {
        nodes: [{ id: `wz-10_1`, group: 0 }],
        links: [
          // { "source": "罗纳德·里根号", "target": "USS Ronald Reagan", "value": 1 },
        ],
        frustumShowArr: []
      },
      paData: [], //用来保存PA数据，改成通过图层控制显隐
      paDataShow: true, //控制paData图层显隐，默认显示，通过图层管理中的图层显隐按钮控制
      ATValue: -1,
      jamArr: [], //存放当前场景被干扰对象
      dtList: [], //
      simulationState: {},
      simClientIp: '', //实验开始或者继续时获取，进而实现时间接口循环自调用
      heatMapContainer: null, // 热力图容器
      reconnaissanceResults: null, // 通过大模型计算获取的侦察结果
      showReconnaissanceResults: true, // 是否显示侦察结果，默认显示
      dqST: true,// 决定受大气影响的侦察包括是否调取光学探测区域
      opticalDqST: true,// 决定受大气影响的侦察包括是否调取光学探测区域
      infraredDqST: true,// 决定受大气影响的侦察包括是否调取红外探测区域
      radarDqST: true,// 决定受大气影响的侦察包括是否调取雷达探测区域
      showARMultiPoints: true, // 是否显示地表影像，默认显示
      isEnterScene: false,// 是否已经进入场景
      labelColor: {
        rgba: [255, 255, 255, 255]
      },//'#fff', //#fff #000000 默认为#fff，当切换成白色地图时改成#000000
      wind3d: null, // 存储风场对象
      windGui: null, // 存储风场GUI对象
      fp: false,// 是否打开的是复盘问价
      PA_UTF8_Name: [],//从PA消息中获取的中文名称映射
      muData: {},//存储MU消息数据，key为平台Name，value为MU消息的Data对象
      volumeDataDict: {},//存储传感器包络信息字典
      paShowData: {},//存储PA消息的Side和Vision，key为平台Name，用于控制czml label显隐
    }
  },
  getters: {
    doubleAFSIMCounter(state, getters, rootState, rootGetters) {
      return state.AFSIMCounter * 2
    },
    // 获取热力图容器
    getHeatMapContainer(state) {
      return state.heatMapContainer
    },
    // 获取侦察结果
    getReconnaissanceResults(state) {
      return state.reconnaissanceResults
    },
    // 获取是否已经进入场景
    getIsEnterScene(state) {
      return state.isEnterScene
    },
  },
  mutations: {
    increment(state) {
      state.AFSIMCounter++
    },
    // 设置热力图容器
    setHeatMapContainer(state, payload) {
      state.heatMapContainer = payload
    },
    // 设置侦察结果
    setReconnaissanceResults(state, payload) {
      state.reconnaissanceResults = payload
    },
    // 设置是否已经进入场景
    set_isEnterScene(state, payload) {
      state.isEnterScene = payload
    },
    // 设置风场对象
    setWind3d(state, payload) {
      state.wind3d = payload
    },
    // 设置风场GUI对象
    setWindGui(state, payload) {
      state.windGui = payload
    },
    // 清除风场对象
    clearWind3d(state) {
      state.wind3d = null
    },
    // 清除风场GUI对象
    clearWindGui(state) {
      state.windGui = null
    },
    // 设置MU消息数据
    setMuData(state, { name, data }) {
      state.muData[name] = data
    },
    // 清除所有MU消息数据
    clearMuData(state) {
      state.muData = {}
    },
    // 设置传感器包络信息字典
    setVolumeDataDict(state, payload) {
      state.volumeDataDict = payload
    },
    // 清除所有传感器包络信息字典
    clearVolumeDataDict(state) {
      state.volumeDataDict = {}
    },
    // 设置PA消息的Side和Vision
    setPaShowData(state, { name, side, vision }) {
      state.paShowData[name] = { side, vision }
    },
    // 清除所有PA消息的Side和Vision
    clearPaShowData(state) {
      state.paShowData = {}
    },
  },
  actions: {
    incrementAction({
      commit,
      dispatch,
      state,
      rootState,
      getters,
      rootGetters
    }) {
      commit('increment')
      commit('increment', null, { root: true }) // 提交根里面，即index.js里得increment

      // dispatch
      // dispatch("incrementAction", null, {root: true})
    }
  }
}

export default AFSIMModule
