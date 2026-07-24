// 初始化席位权限状态
const seatModule = {
  // namespaced: true, //独立使用
  state: {
    linkState: true, // 链路显示状态
    linkWidthScale: 2, // 链路宽度比率
    stateInfoWidth: 2, // 浮动信息宽度
    stateInfoOutLineColor: [0, 0, 0, 1], // 浮动信息边框颜色,黑色
    stateInfoOutColor: [1.0, 1.0, 0, 1], // 浮动信息颜色，黄色
    succeStateInfoOutColor: [51.0 / 255, 1.0, 0, 1.0], //成功修改显示浮动信息颜色，绿色
    missileDistanceColor: [1.0, 1.0, 1.0, 1.0], // 导弹距离目标公里的实时信息展示颜色
    systemSound: true, //开关系统音效
    qbModelShow: false, // 请报席位未知目标使用位置类型的模型
    qbSelectTreeInfo: {}, // qb席当前树节点信息
    bubbleFontColorAdmin: [255.0, 255.0, 255.0], // admin 白方 标牌字体颜色
    bubbleFontColor: [1.0, 1.0, 1.0] // red_zhkz 导调 标牌字体颜色
  },
  getters: {
    getLinkState(state) {
      return state.linkState
    },
    getLinkWidthScale(state) {
      return state.linkWidthScale
    },
    getStateInfoWidth(state) {
      return state.stateInfoWidth
    },
    getStateInfoOutLineColor(state) {
      return state.stateInfoOutLineColor
    },
    getStateInfoColor(state) {
      return state.stateInfoOutColor
    },
    getSucceStateInfoOutColor(state) {
      return state.succeStateInfoOutColor
    },
    getMissileDistanceColor(state) {
      return state.missileDistanceColor
    },
    getSystemSound(state) {
      return state.systemSound
    },
    getqbModelShow(state) {
      return state.qbModelShow
    },
    getqbSelectTreeInfo(state) {
      return state.qbSelectTreeInfo
    },
    getBubbleFontColorAdmin(state) {
      return state.bubbleFontColorAdmin
    },
    getBubbleFontColor(state) {
      return state.bubbleFontColor
    }
  },
  mutations: {
    setLinkState(state, payload) {
      state.linkState = payload
    },
    setLinkWidthScale(state, payload) {
      state.linkWidthScale = payload
    },
    setStateInfoWidth(state, payload) {
      state.stateInfoWidth = payload
    },
    setStateInfoOutLineColor(state, payload) {
      state.stateInfoOutLineColor = payload
    },
    setStateInfoColor(state, payload) {
      state.stateInfoOutColor = payload
    },
    setSucceStateInfoOutColor(state, payload) {
      state.succeStateInfoOutColor = payload
    },
    setMissileDistanceColor(state, payload) {
      state.missileDistanceColor = payload
    },
    setSystemSound(state, payload) {
      state.systemSound = payload
    },
    setqbModelShow(state, payload) {
      state.qbModelShow = payload
    },
    setqbSelectTreeInfo(state, payload) {
      state.qbSelectTreeInfo = payload
    },
    setBubbleFontColorAdmin(state, payload) {
      state.bubbleFontColorAdmin = payload
    },
    setBubbleFontColor(state, payload) {
      state.bubbleFontColor = payload
    }
  },
  actions: {}
  // modules: {
  //   Events
  // }
}

export default seatModule
