/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-03-11 17:30:16
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2024-05-20 11:00:18
 * @FilePath: \MSIMEarthSysN\src\components\seatManangement\hooks\Informationseat\rightConfig.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import emitter from '@/utils/eventbus'

export default function () {
  const store = useStore()
  // 只有等元素挂载渲染后，才可以将 html元素与cesium的viewer挂载wjxian
  onMounted(() => {})
  onUnmounted(() => {})
  let getRightMenu_qb = (item, index) => {
    let changeCompName = {}
    switch (item.label) {
      case '兵力信息':
        emitter.emit('sendShowLeftTree', true)
        break
      case '战况统计':
        changeCompName.label = '战况统计'
        changeCompName.name = 'quickArbitration'
        changeCompName.value = 'bottomCompName'
        changeCompName.methods = 'changeBottomComp'
        break
      case '战损评估':
        changeCompName.label = '战损评估'
        changeCompName.name = 'statisticAnalysis'
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
      case '目标标识':
        emitter.emit('sendAddTargets', true)
        break
      case '目标情报':
        emitter.emit('sendShowTargetProps', true)
        break
      case '敌情通报':
        emitter.emit('sendShowTargetNotific', true)
        break
      case '电磁情报':
        emitter.emit('sendShowElectroQB', true)
        break
      case '音视频通话':
        changeCompName.label = '音视频通话'
        changeCompName.name = 'videoChat'
        changeCompName.value = 'threeDimensional'
        changeCompName.methods = 'changeThreeDimensional'
        break
      case '目标信息':
        emitter.emit('showTargetInfo', 'targetInformations')
        break
      case '威胁等级':
        emitter.emit('showThreatAnalysisList', 'billboardList')
        break
      default:
        break
    }
    if (Object.keys(changeCompName).length > 0) {
      store.commit('setCompList', changeCompName)
    }
  }
  return { getRightMenu_qb }
}
