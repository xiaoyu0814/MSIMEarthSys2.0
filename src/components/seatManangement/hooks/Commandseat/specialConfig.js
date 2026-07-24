/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-03-30 16:18:49
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2024-05-20 11:00:15
 * @FilePath: \MSIMEarthSysN\src\components\seatManangement\hooks\Commandseat\specialConfig.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import emitter from '@/utils/eventbus'

export default function () {
  const store = useStore()
  // 只有等元素挂载渲染后，才可以将 html元素与cesium的viewer挂载wjxian
  let getRightMenu = (item) => {
    let changeCompName = {}
    switch (item.label) {
      case '作战部署':
        changeCompName.label = '作战部署'
        changeCompName.name = 'scenario'
        changeCompName.value = 'threeDimensional'
        changeCompName.methods = 'changeThreeDimensional'
        break
      case '关键事件':
        const toastWrapper = document.querySelector('.beautyToast-wrapper')
        let toastStyle = toastWrapper.getAttribute('style')
        if (toastStyle == null) {
          toastWrapper.setAttribute('style', 'display:block')
        } else if (toastStyle.split(':')[1] == 'block') {
          toastWrapper.setAttribute('style', 'display:none')
        } else if (toastStyle.split(':')[1] == 'none') {
          toastWrapper.setAttribute('style', 'display:block')
        } else {
          toastWrapper.setAttribute('style', 'display:none')
        }
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
      case '力量编成':
        changeCompName.label = '力量编成'
        changeCompName.name = 'LLBC'
        changeCompName.value = 'leftCompName'
        changeCompName.methods = 'changeLeftComp'
        break
      case '编成导调':
        emitter.emit('showZHKZTree', true)
        break
      case '天气导调':
        changeCompName.label = '天气导调'
        changeCompName.name = 'weatherConfig'
        changeCompName.value = 'threeDimensional'
        changeCompName.methods = 'changeThreeDimensional'
        break
      case '要素导调':
        changeCompName.label = '要素导调'
        changeCompName.name = 'targetConfig'
        changeCompName.value = 'threeDimensional'
        changeCompName.methods = 'changeThreeDimensional'
        break
      case '战损评估':
        changeCompName.label = '战损评估'
        changeCompName.name = 'statisticAnalysis'
        changeCompName.value = 'threeDimensional'
        changeCompName.methods = 'changeThreeDimensional'
        break
      case '申请裁决':
        emitter.emit('sendShowApply', true)
        break
      case '裁决结果':
        emitter.emit('showApplyList', true)
        break
      case '音视频通话':
        changeCompName.label = '音视频通话'
        changeCompName.name = 'videoChat'
        changeCompName.value = 'threeDimensional'
        changeCompName.methods = 'changeThreeDimensional'
        break
      case '评估分析':
        changeCompName.label = '评估分析'
        changeCompName.name = 'assessment'
        changeCompName.value = 'threeDimensional'
        changeCompName.methods = 'changeThreeDimensional'
        //emitter.emit('showAssessment', true)
        break
      case '情报下载':
        store.state.sceneModule.toolBarType =
          !store.state.sceneModule.toolBarType
        emitter.emit('onshowWordFile', store.state.sceneModule.toolBarType)
        break
      default:
        break
    }
    if (Object.keys(changeCompName).length > 0) {
      store.commit('setCompList', changeCompName)
    }
  }
  onMounted(() => {})
  onUnmounted(() => {})
  return { getRightMenu }
}
