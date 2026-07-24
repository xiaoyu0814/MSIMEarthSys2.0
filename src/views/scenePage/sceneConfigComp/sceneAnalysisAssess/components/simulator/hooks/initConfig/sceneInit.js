/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-04-24 10:43:59
 * @LastEditors: root you@example.com
 * @LastEditTime: 2024-07-23 10:24:22
 * @FilePath: \MSIMEarthSysN\src\views\3D\hooks\initConfig\sceneInit.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import store from '@/store'
import LocalCache from '@/utils/earthPlugin/ThirdParty/storageManagement/localStorage.js'

// 根据登录角色初始化场景配置
export function sceneInit() {
  let curSeat = window.localStorage.getItem('side') // 获取当前席位
  //只在admin席位下才显示'场景配置'图层下的'模型'的节点
  if (curSeat == 'admin') {
    configAdminSeatData(curSeat)
  } else {
    configOtherSeatData()
  }
}

function configAdminSeatData(seat) {
  let layerData = store.getters.getLayerManagementData
  let newModelLayerData = layerData[3].childList
  if (newModelLayerData && newModelLayerData.length === 0) return
  if (seat == 'admin') {
    //默认勾选精模建模切换图层节点
    newModelLayerData[0].childList.map(function (item) {
      item.checked = true
      store.state.sceneModule.modelConfig.detailedModel = true
      if (item.name == '模型描边') {
        item.checked = store.state.sceneModule.modelConfig.modelOutline
      }
    })
  } else {
    // newModelLayerData[0].childList.map(function (item) {
    //   item.checked = false
    //   store.state.sceneModule.modelConfig.detailedModel = false
    // })
  }

  //初始化链路配置
  newModelLayerData[1].childList.map(function (item) {
    item.checked = LocalCache.getCache(item.code)
  })

  //初始化红方标签配置
  // newModelLayerData[2].childList[0].childList.map(function (item) {
  //   item.checked = LocalCache.getCache(item.code)
  //   if (item.checked) store.state.sceneModule.redPlaneConfig.push(item.name)
  // })
  //初始化蓝方标签配置
  // newModelLayerData[2].childList[1].childList.map(function (item) {
  //   item.checked = LocalCache.getCache(item.code)
  //   if (item.checked) store.state.sceneModule.bluePlaneConfig.push(item.name)
  // })

  //初始化雷达干扰配置
  let radarStateList = store.getters.getRadarRenderConfig // 雷达状态集合
  radarStateList.forEach((e) => {
    store.state.sceneModule.radarRender =
      store.state.sceneModule.radarRender && e.radarState
  })
  newModelLayerData[2].checked = store.state.sceneModule.radarRender

  layerData[3].childList = newModelLayerData
  store.commit('setLayerManagementData', layerData)
}

function configOtherSeatData() {
  let layerData = store.getters.getLayerManagementData
  let newModelLayerData = layerData[3].childList
  if (newModelLayerData && newModelLayerData.length === 0) return

  //初始化链路配置
  newModelLayerData[0].childList.map(function (item) {
    item.checked = LocalCache.getCache(item.code)
  })

  //初始化红方标签配置
  // newModelLayerData[1].childList[0].childList.map(function (item) {
  //   item.checked = LocalCache.getCache(item.code)
  //   if (item.checked) store.state.sceneModule.redPlaneConfig.push(item.name)
  // })
  // //初始化蓝方标签配置
  // newModelLayerData[1].childList[1].childList.map(function (item) {
  //   item.checked = LocalCache.getCache(item.code)
  //   if (item.checked) store.state.sceneModule.bluePlaneConfig.push(item.name)
  // })

  //初始化雷达干扰配置
  let radarStateList = store.getters.getRadarRenderConfig // 雷达状态集合
  radarStateList.forEach((e) => {
    store.state.sceneModule.radarRender =
      store.state.sceneModule.radarRender && e.radarState
  })
  newModelLayerData[1].checked = store.state.sceneModule.radarRender
  layerData[3].childList = newModelLayerData
  store.commit('setLayerManagementData', layerData)
}
