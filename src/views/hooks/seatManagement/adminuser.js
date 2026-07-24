import { onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import emitter from '@/utils/eventbus'

export default function () {
  const store = useStore()
  onMounted(() => {})
  return {}
}
