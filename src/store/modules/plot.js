const plot = {
  state: {
    plot_visible: false,
    plot_select: null,
    plot_layerList: []
  },
  getters: {
    get_plotVisible: (state) => state.plot_visible,
    get_plotSelect: (state) => state.plot_select,
    get_plotLayerList: (state) => state.plot_layerList
  },
  mutations: {
    SET_PLOTVISIBLE(state, val) {
      state.plot_visible = val
    },
    SET_PLOTSELECT(state, val) {
      state.plot_select = val
    },
    PUSH_PLOTLAYERLIST(state, val) {
      state.plot_layerList.push(val)
    },
    DELETE_PLOTLAYERLIST(state, index) {
      state.plot_layerList.splice(index, 1)
    }
  },
  actions: {
    set_plotVisible({ commit }, data) {
      commit('SET_PLOTVISIBLE', data)
    },
    set_plotSelect({ commit }, data) {
      commit('SET_PLOTSELECT', data)
    },
    push_plotLayerList({ commit }, data) {
      commit('PUSH_PLOTLAYERLIST', data)
    },
    delete_plotLayerList({ commit }, data) {
      commit('DELETE_PLOTLAYERLIST', data)
    }
  }
}
export default plot
