const sepcialModule = {
  state() {
    return {
      compList: {}
    }
  },
  getters: {
    getCompList(state) {
      return state.compList
    }
  },
  mutations: {
    setCompList(state, payload) {
      state.compList = payload
    }
  }
}

export default sepcialModule
