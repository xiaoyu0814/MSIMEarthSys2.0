/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-02-28 15:49:34
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2024-06-26 13:22:19
 */
import store from '@/store'
import LocalCache from '@/utils/earthPlugin/ThirdParty/storageManagement/localStorage.js'
// 根据角色席位权限通知对应组件初始化
export function seatInit() {
  let curSeat = window.localStorage.getItem('side') // 获取当前席位
  let pr = new window.EarthPlugn.postRender(window.MSIMEarth)
  const collection = window.EarthViewer.scene.postProcessStages
  // 不同角色权限激活不同的初始化方式
  switch (curSeat) {
    case 'red_zhkz': //红方指挥控制席
      pr.createLoad(collection, 1500, () => {
        store.commit('setMessageConnector', true)
      })
      // configVectorData()
      break
    case 'red_qb': //红方情报席
      pr.createLoad(collection, 1500, () => {
        store.commit('setMessageConnector', true)
      })
      // configVectorData()
      break
    case 'blue_qb': //蓝方情报席
      pr.createLoad(collection, 1500, () => {
        store.commit('setMessageConnector', true)
      })
      // configVectorData()
      break
    default:
      break
  }
}

// 配置图层管理默认加载选项
function configVectorData() {
  let layerData = store.getters.getLayerManagementData
  let newVectorLayerData = layerData[0].childList.map(function (item) {
    if (item.name) {
      if (
        item.name === '九段线' ||
        item.name === '岛链' ||
        item.name === '九段线' ||
        item.name === '国家点' ||
        item.name === '地名' ||
        item.name === '国家边界线' ||
        item.name === '重要目标'
      ) {
        item.checked = true
      }
    }
    return item
  })
  layerData[0].childList = newVectorLayerData
  store.commit('setLayerManagementData', layerData)
}
