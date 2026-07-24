import { onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import emitter from '@/utils/eventbus'
import { SSEClose, sceneControl, getPAStatic } from '@/service/SSE'
import { BASE_URL } from '@/service/request/config'
import { eventControllerSSEClose } from '@/utils/mapTools'

export default function () {
  const store = useStore()
  const getMsg = () => {
    let side = localStorage.getItem('side')
    if (side != 'admin') {
      emitter.emit('initSceneTime', true)
      if (EventController) {
        eventControllerSSEClose(EventController)
      }
      EventController = new window.EarthPlugn.EventSourceController({
        baseUrl: serverUrls.serversCommunication
      })
      EventController.initStream()
      const side = window.localStorage.getItem('side')
      setTimeout(() => {
        getPAStatic({ side: 'admin' }).then((res) => {})
      }, 1500)
    }
  }
  onMounted(() => {})
  return { getMsg }
}
