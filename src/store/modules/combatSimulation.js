/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2025-06-30 11:06:47
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2025-11-19 15:12:23
 * @FilePath: \gfdx\src\store\modules\combatSimulation.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const combatSimulationModule = {
  state() {
    return {
      isShowleftPanel: true, //左侧任务列表
      isSimulationList: false, //实验管理列表
      isSamplelist: false, //样本列表框是否显示
      isSampleData: {}, //样本列表数据
      isSampleDetail: false, //实验样本详情
      isSampleDetailData: {}, //实验样本详情数据
      sampleEchartsData: {} //实验样本图表详情
    }
  },
  getters: {
    get_isShowLeftList(state) {
      return state.isShowleftPanel
    },
    get_isSimulationList(state) {
      return state.isSimulationList
    },
    get_isSamplelist(state) {
      return state.isSamplelist
    },
    get_isSampleData(state) {
      return state.isSampleData
    },
    get_isSampleDetail(state) {
      return state.isSampleDetail
    },
    get_isSampleDetailData(state) {
      return state.isSampleDetailData
    },
    get_sampleEchartsData(state) {
      return state.sampleEchartsData
    }
  },
  mutations: {
    set_isShowLeftList(state, data) {
      state.isShowleftPanel = data
    },
    set_isSimulationList(state, data) {
      state.isSimulationList = data
    },
    set_isSamplelist(state, data) {
      state.isSamplelist = data
    },
    set_isSampleData(state, data) {
      state.isSampleData = data
    },
    set_isSampleDetail(state, data) {
      state.isSampleDetail = data
    },
    set_isSampleDetailData(state, data) {
      state.isSampleDetailData = data
    },
    set_sampleEchartsData(state, data) {
      state.sampleEchartsData = data
    }
  }
}

export default combatSimulationModule
