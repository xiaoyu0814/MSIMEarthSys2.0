import http from './request/http'
import { BASE_URL } from './request/config'

/**
 * 攻击指定位置指令接口
 * pltNam 平台名称-写平台的英文名称
 * @param {*} data
 * @returns
 */
export const atPosition = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}/command/v1/fire/atPosition`,
    data: data
  })
}

// 攻击指定目标指令接口
export const atTarget = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}/command/v1/fire/atTarget`,
    data: data
  })
}

// 攻击自定义指令接口
export const byRaw = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}/command/v1/fire/byRaw`,
    data: data
  })
}

// 攻击指令接口
export const openFire = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}/command/v1/fire/openFire`,
    data: data
  })
}

// 变更平台高度接口
export const toAltitude = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}/command/v1/move/toAltitude`,
    data: data
  })
}

// 移动平台到指定位置指令接口
export const toPosition = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}/command/v1/move/toPosition`,
    data: data
  })
}

// 设置平台到指定位置（立刻）指令接口
export const setPosition = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.afsimControl}/command/v1/move/setPosition`,
    data: data
  })
}

/**
 * 移动平台到目标距离指令接口
 * dist: 距离 m
 * @param {*} data
 * @returns
 */
export const toTarget = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}/command/v1/move/toTarget`,
    data: data
  })
}
/**
 * 变更平台传感器频率指令接口
 * @param {*} data
 * @returns
 */
export const changeFrequency = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}/command/v1/sensor/changeFrequency`,
    data: data
  })
}
/**
 * 变更平台传感器模式指令接口
 * value 传字符 ACQUIRE 与 TRACK
 * @param {*} data
 * @returns
 */
export const changeMode = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}/command/v1/sensor/changeMode`,
    data: data
  })
}

// 变更平台传感器状态指令接口
export const changeState = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}/command/v1/sensor/changeState`,
    data: data
  })
}

/**
 * 获取平台（飞机）搭载的传感器和武器装备接口
 * @param {*} params name   afSim 平台名称
 * @returns
 */
export const getPlateSWMessage = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCalculation}/SceneInferController/v1/getPlateSWMessage`,
    params: params
  })
}
/**
 * 获取平台（飞机）搭载的传感器和武器装备接口
 * @param {*} params name   afSim 平台名称
 * @returns
 */
export const getPlateSWMessageV2 = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}SceneInferController/v2/getPlateSWMessage`,
    params: params
  })
}

// 变更平台干扰状态指令接口
export const turnOnWeapon = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}/command/v1/fire/turnOnWeapon`,
    data: data
  })
}

// 生成干扰弹接口(立即导调指令)
export const generatingJammer = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}/command/v1/guide/generatingJammer`,
    data: data
  })
}

// 激光定向干扰接口(立即导调指令)
export const laserDirectedJamming = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}/command/v1/guide/laserDirectedJamming`,
    data: data
  })
}
/**
 * 获取平台探测状态
 * @param {*} params
 * @returns
 */
export const getIsTrackTarget = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}SceneInferController/v2/getIsTrackTarget`,
    params: params
  })
}

// 伴飞接口(立即导调指令)
export const accompanyingFlight = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}/command/v1/guide/accompanyingFlight`,
    data: data
  })
}

// 光学干扰(立即导调指令) 变更烟雾干扰装置状态
export const changeInfraredState = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}/command/v1/guide/changeInfraredState`,
    data: data
  })
}

// 改变速度(立即导调指令)
export const updateSpeed = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}/command/v1/guide/updateSpeed`,
    data: data
  })
}

// 特情：发动机故障
export const breakMover = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}/command/v1/special/breakMover`,
    data: data
  })
}

// 特情：油料缺失
export const deficiencyFuel = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}/command/v1/special/deficiencyFuel`,
    data: data
  })
}

// 特情：缺失弹药
export const deficiencyWeaponQuantity = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}/command/v1/special/deficiencyWeaponQuantity`,
    data: data
  })
}

// 飞机起飞指令
export const taskOff = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}/command/v1/guide/taskOff`,
    data: data
  })
}
