const adjustControl = {
  state: {
    newEmail: true,
    newMessage: false,
    messageLength: 0,
    messageStore: []
  },
  mutations: {
    SET_NEWEMAIL(state, data) {
      console.log(data)
      state.newEmail = data
    },
    SET_NEWMESSAGE(state, data) {
      state.newMessage = data
    },
    SET_MESSAGELENGTH(state, data) {
      console.log(state.messageLength)
      state.messageLength = data == 0 ? data : ++state.messageLength
    },
    ADD_MESSAGESTORE(state, data) {
      if (state.messageStore.length < 1) {
        let temp = {
          length: 1,
          userId: data.from
        }
        state.messageStore.push(temp)
      } else {
        let noHave = true
        for (let i = 0; i < state.messageStore.length; i++) {
          const element = state.messageStore[i]
          if (element.toUserId == data.toUserId) {
            noHave = false
            element.length += 1
          }
        }
        if (noHave) {
          let temp = {
            length: 1,
            userId: data.toUserId
          }
          state.messageStore.push(temp)
        }
      }
    },
    REMOVE_MESSAGESTORE(state, userId) {
      let index = null
      for (let i = 0; i < state.messageStore.length; i++) {
        const element = state.messageStore[i]
        if (element.userId == userId) {
          index = i
        }
      }
      state.messageStore.splice(index, 1)
    }
  },
  actions: {
    set_newEmail({ commit }, data) {
      commit('SET_NEWEMAIL', data)
    },
    set_newMessage({ commit }, data) {
      commit('SET_NEWMESSAGE', data)
    },
    set_messageLength({ commit }, data) {
      commit('SET_MESSAGELENGTH', data)
    }
  },
  getters: {
    get_newEmail: (state) => state.newEmail,
    get_newMessage: (state) => state.newMessage,
    get_messageLength: (state) => {
      let num = 0
      for (let i = 0; i < state.messageStore.length; i++) {
        const element = state.messageStore[i]
        num += element.length
      }
      return num
    },
    get_messageStore: (state) => state.messageStore
  },
  modules: {}
}
export default adjustControl
