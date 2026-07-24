import analysisVisible from '@/utils/measurement/analysisVisible'

const generalModule = {
  state() {
    return {
      planeLabelClick: {},
      battlefieldClick: {},
      analysisInfoData: {},
      taskInfoTaskIdData: {}
    }
  },
  getters: {
    getPlane(state) {
      return state.planeLabelClick
    },
    getEarth(state) {
      return state.battlefieldClick
    },
    getAnalysisInfoData(state) {
      return state.analysisInfoData
    },
    getTaskInfoTaskIdData(state) {
      return state.taskInfoTaskIdData
    }
  },
  mutations: {
    setPlane(state, payload) {
      state.planeLabelClick = payload
    },
    setEarth(state, payload) {
      state.battlefieldClick = payload
    },
    setAnalysisInfoData(state, payload) {
      state.analysisInfoData = payload
    },
    setTaskInfoTaskIdData(state, payload) {
      state.taskInfoTaskIdData = payload
    }
  }
}

export default generalModule
