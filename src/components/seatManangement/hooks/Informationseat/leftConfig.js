import { onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import emitter from '@/utils/eventbus'
import { useRouter } from 'vue-router'

export default function () {
  const store = useStore()
  // 只有等元素挂载渲染后，才可以将 html元素与cesium的viewer挂载wjxian
  onMounted(() => {})
  const router = useRouter()
  onUnmounted(() => {})
  let getLeftMenu_qb = (item) => {
    let changeCompName = {}
    switch (item.label) {
      case '图层面板':
        emitter.emit('showTree', {})
        break
      case '标牌配置':
        store.commit('setPlane', 'planeLabelConfig')
        break
      case '系统退出':
        localStorage.clear()
        sessionStorage.clear()
        router.push('/')
        break

      case '战况统计':
        changeCompName.label = '战况统计'
        changeCompName.name = 'quickArbitration'
        changeCompName.value = 'bottomCompName'
        changeCompName.methods = 'changeBottomComp'
        break
      case '兵力信息':
        changeCompName.label = '兵力信息'
        changeCompName.name = 'forceChart'
        changeCompName.value = 'leftCompName'
        changeCompName.methods = 'changeLeftComp'
        break
      case '要素导调':
        // let changeCompName={}
        changeCompName.label = '要素导调'
        changeCompName.name = 'targetConfig'
        changeCompName.value = 'threeDimensional'
        changeCompName.methods = 'changeThreeDimensional'
        // if (Object.keys(changeCompName).length > 0) {
        //   store.commit('setCompList', changeCompName)
        // }
        break
      default:
        break
    }
    if (Object.keys(changeCompName).length > 0) {
      store.commit('setCompList', changeCompName)
    }
  }
  return { getLeftMenu_qb }
}
