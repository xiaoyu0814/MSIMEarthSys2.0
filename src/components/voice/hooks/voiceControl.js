import { ref, watch } from 'vue'
import store from '@/store'
import emitter from '@/utils/eventbus'
import { playVoice } from '@/utils/voice'

export default function () {
  const getMessage = () => {
    emitter.on('changeCmd', async (val) => {
      if (val.client_uuid) {
        if (val.client_uuid != store.state.client_uuid) {
          return
        }
      }
      switch (val.client_exec_cmd) {
        case 'error1':
          playVoice()
          break
      }
    })
  }
  return {
    getMessage
  }
}
