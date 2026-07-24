/*
 * @description:模拟器统计相关接口
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-05-30 16:38:09
 * @LastEditors: root you@example.com
 * @LastEditTime: 2024-08-25 14:53:58
 */
// qb席

import http from './request/http'
import { BASE_URL } from './request/config'

// 模拟器事件汇总饼图查询
export const getAirDataJson = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.qidongMnqSjJsServerUrl2}/simulation-service-analysis/SimulatorController/getAirDataJson`,
    data: data
  })
}
// 根据时间区间--模拟器事件汇总饼图查询
export const getAirDataJsonByTimeZone = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.qidongMnqSjJsServerUrl2}/simulation-service-analysis/SimulatorController/v2/getAirDataJsonByTimeZone`,
    data: data
  })
}

// 获取模拟器事件列表
export const getAirDataList = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.qidongMnqSjJsServerUrl2}/simulation-service-analysis/SimulatorController/getAirDataList`,
    data: data
  })
}
// 获取模拟器详细事件列表
export const getAirDataByPage = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.qidongMnqSjJsServerUrl2}/simulation-service-analysis/SimulatorController/getAirDataByPage`,
    data: data
  })
}
// 根据时间区间--获取模拟器详细事件列表
export const getAirDataByPageByTimeZone = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.qidongMnqSjJsServerUrl2}/simulation-service-analysis//SimulatorController/v2/getAirDataByPageByTimeZone`,
    data: data
  })
}

// 获取事件列表
export const getChainStatus = () => {
  return http({
    method: 'get',
    url: `${serverUrls.qidongMnqSjJsServerUrl2}/simulation-service-analysis/SimulatorController/getChainStatus`
  })
}
// 获取czml回放数据
export const getSimulatorCZML = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.qidongMnqSjJsServerUrl2}/simulation-service-analysis/SimulatorController/getSimulatorCZML`,
    params
  })
}
// 根据时间区间--获取czml回放数据
export const getSimulatorCZMLByTimeZone = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.qidongMnqSjJsServerUrl2}/simulation-service-analysis/SimulatorController/v2/getSimulatorCZMLByTimeZone`,
    params
  })
}

// 获取模拟器折线图数据
export const getMinuteCount = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.qidongMnqSjJsServerUrl2}/simulation-service-analysis/SimulatorController/getMinuteCount`,
    params
  })
}

// UE 轨迹回放  暂时不调用
// 停止
export const uETrajectoryReplayStop = () => {
  return http({
    method: 'get',
    url: `${serverUrls.uETrajectoryReplayUrl}/?state=stop`
  })
}
// 启动  暂时不调用
export const uETrajectoryReplaybegin = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.uETrajectoryReplayUrl}?state=begin&file=${params.fileName}_Dis.txt&mode=multicast&dstip=224.0.1.0&dstport=3000`
  })
}
// 获取模拟器每分钟高度折线图
export const getSimHeightForm = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.qidongMnqSjJsServerUrl2}/simulation-service-analysis/SimulatorController/getSimHeightForm`,
    params
  })
}
// 根据时间区间--获取模拟器每分钟高度折线图
export const getSimHeightFormByTimeZone = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.qidongMnqSjJsServerUrl2}/simulation-service-analysis/SimulatorController/v2/getSimHeightFormByTimeZone`,
    params
  })
}
// 模拟器 信息获取
export const getSimStatistics = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.qidongMnqSjJsServerUrl2}/simulation-service-analysis/SimulatorController/getSimStatistics`,
    params
  })
}
// 根据时间区间---模拟器 信息获取
export const getSimStatisticsByTimeZone = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.qidongMnqSjJsServerUrl2}/simulation-service-analysis/SimulatorController/v2/getSimStatisticsByTimeZone`,
    params
  })
}

// 模拟器 模拟器时序图统计
export const getSimTimeStatistics = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.qidongMnqSjJsServerUrl2}/simulation-service-analysis/SimulatorController/getSimTimeStatistics`,
    params
  })
}
// 根据时间区间--模拟器 模拟器时序图统计
export const getSimTimeStatisticsByTimeZone = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.qidongMnqSjJsServerUrl2}/simulation-service-analysis/SimulatorController/v2/getSimTimeStatisticsByTimeZone`,
    params
  })
}
