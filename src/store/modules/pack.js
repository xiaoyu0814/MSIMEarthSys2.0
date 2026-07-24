/*
 * @Author: yuqiangqiang yqq@piesat.cn
 * @Date: 2024-08-14 15:15:34
 * @LastEditors: yuqiangqiang yqq@piesat.cn
 * @LastEditTime: 2024-09-12 11:31:34
 * @FilePath: \MSIMEarthSysN\src\store\modules\pack.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
const packModule = {
  // namespaced: true, //独立使用
  state: {
    dataControl: null, // 图层树地理数据管理对象
    gridData: {}, // 格网数据
    ShowLaser: false, //激光功能显隐
    SensorShow: {}, //传感器显示数据
    SensorStatusList: [] //传感器状态列表
  },
  getters: {
    getDataControl(state) {
      return state.dataControl
    },
    getGridData(state) {
      return state.gridData
    },
    getShowLaser(state) {
      return state.ShowLaser
    },
    getSensorShow(state) {
      return state.SensorShow
    },
    getSensorStatusList(state) {
      return state.SensorStatusList
    }
  },
  mutations: {
    setDataControl(state, payload) {
      state.dataControl = payload
    },
    setGridData(state, payload) {
      state.gridData = payload
    },
    setShowLaser(state, payload) {
      state.ShowLaser = payload
    },
    setSensorShow(state, payload) {
      state.SensorShow = payload
    },
    setSensorStatusList(state, payload) {
      state.SensorStatusList = payload
    }
  },
  actions: {}
  // modules: {
  //   Events
  // }
}

export default packModule
