const measurement = {
  state: {
    measurement_visible: false
  },
  getters: {
    get_measurementVisible: (state) => state.measurement_visible
  },
  mutations: {
    SET_MEASUREMENTVISIBLE(state, val) {
      state.measurement_visible = val
    }
  },
  actions: {
    set_measurementVisible({ commit }, data) {
      commit('SET_MEASUREMENTVISIBLE', data)
    }
  }
}
export default measurement
