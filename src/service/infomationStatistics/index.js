/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2025-09-04 10:18:55
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2026-01-08 16:21:38
 * @FilePath: \gfdx\src\service\infomationStatistics\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import http from '../request/http'
import { URL_CJ } from '../request/config'

//                 getPlatformState
//                 getPlatformMaster Track List
//                 getPlatformWeapons
//                 getPlatformParts
//                 getPlatformSensor Volumes
//                 getPlatformMovementRoutes
//                 getPlatformJammerVolumes

/**
 * 获取平台各个类型设备实时数量
 * @returns
 */
export function getForceTypeStatistics() {
  return http({
    url: `/${baseUrl16006}/statistics/v1/getForceTypeStatistics`,
    method: 'get'
  })
}

/**
 * 获取平台红蓝数量总和
 * @returns
 */
export function getRelativeForceStatistics() {
  return http({
    url: `/${baseUrl16006}/statistics/v1/getRelativeForceStatistics`,
    method: 'get'
  })
}

/**
 * 获取战国战损
 * @returns
 */
export function getResultsAndLossesStatistics() {
  return http({
    url: `/${baseUrl16006}/statistics/v1/getResultsAndLossesStatistics`,
    method: 'get'
  })
}

/**
 * 多目标剩余油量，最大油量，油耗比
 * @returns
 */
export function getPlatformFuelQuantityStatistics() {
  return http({
    url: `/${baseUrl16006}/statistics/v1/getPlatformFuelQuantityStatistics`,
    method: 'get'
  })
}

/**
 * 多目标剩余油量，最大油量，油耗比
 * @returns
 */
export function getPlatformWeaponsStatistics() {
  return http({
    url: `/${baseUrl16006}/statistics/v1/getPlatformWeaponsStatistics`,
    method: 'get'
  })
}

/**
 * 单目标基于时序的油量
 * @returns
 */
export function getRealTimePlatformFuelQuantityStatistics(params) {
  return http({
    url: `/${baseUrl16006}/statistics/v1/getRealTimePlatformFuelQuantityStatistics`,
    method: 'get',
    params
  })
}

/**
 * 单目标武器挂载
 * @returns
 */
export function getRealTimePlatformWeaponsStatistics(params) {
  return http({
    url: `/${baseUrl16006}/statistics/v1/getRealTimePlatformWeaponsStatistics`,
    method: 'get',
    params
  })
}

/**
 * 查询当前场景实体列表
 * @returns
 */
export function getPlatformArray() {
  return http({
    url: `/${baseUrl16006}/statistics/v1/getPlatformArray`,
    method: 'get'
  })
}

/**
 * 查询实体中英文对照表
 * @returns
 */
export function getPlatformCHNName() {
  return http({
    url: `/${baseUrl16006}/SceneDeterminateController/v1/getAllPlat`,
    method: 'get'
  })
}

/**
 * 保存实时统计数据
 * @returns
 */
export function expeSampleRecordRealTimeData(params) {
  return http({
    url: `${serverUrls.serversCalculation}expeSampleRecordRealTimeData/save`,
    method: 'post',
    data: params
  })
}

/**
 * 根据阵营获取当前场景中的平台编组节点接口
 * @returns
 */
export function getPlatStatusGroupNodeBySide(params) {
  return http({
    url: `/${baseUrl16006}/scene/v1/getPlatStatusGroupNodeBySide`,
    method: 'get',
    params
  })
}
