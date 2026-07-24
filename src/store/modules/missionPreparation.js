const missionPreparation = {
  state: {
    taskData: {}
  },
  mutations: {
    SET_TASKDATA(state, data) {
      state.taskData = data
    }
  },
  actions: {
    set_taskData({ commit }, data) {
      commit('SET_TASKDATA', data)
    }
  },
  getters: {
    get_taskData: (state) => state.taskData
  },
  modules: {}
}
export default missionPreparation
