/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-01-15 14:10:42
 * @LastEditors: root you@example.com
 * @LastEditTime: 2024-08-21 14:55:04
 */
// 复盘功能所需接口
import http from './request/http'
import { BASE_URL } from './request/config'

// 复盘接口初始化
export const deduceInit = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}replay/v1/deduceInit`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    },
    timeout: 50000,
    data: data
  })
}

// 复盘接口启动
export const deduceStart = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}replay/v1/deduceStart`,
    data: data
  })
}
// 复盘接口暂停
export const deducePause = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}replay/v1/deducePause`,
    data: data
  })
}
//  复盘接口停止
export const deduceStop = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}replay/v1/deduceStop`,
    data: data
  })
}
//  修改复盘时间接口
export const replayUpdateTime = (data) => {
  return http({
    method: 'put',
    url: `${serverUrls.serversCalculation}/replay/v1/updateTime`,
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
}
//  修改当前复盘时间流速接口
export const replayUpdateTimeSpeed = (data) => {
  return http({
    method: 'put',
    url: `${serverUrls.serversCalculation}replay/v1/updateTimeSpeed`,
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
}
//  获取当前倍速
export const replayGetSpeed = () => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCalculation}replay/v1/getReplayInfo`
  })
}
//  获取当前兵力统计数据
export const getEquipmentCount = () => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}InferResultController/v1/getEquipmentCount`
  })
}
//  最新获取当前兵力统计数据,现存、战损的个数
export const getEquipmentCountByRedis = () => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}InferResultController/v1/getEquipmentCountByRedis`
  })
}
//  获取当前兵力统计数据
export const getSimReplayEventPage = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}simReplayEvent/getSimReplayEventPage`,
    params
  })
}
//  获取复盘左侧兵力统计树数据
export const getResultReplay = () => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}SceneDeterminateController/v1/getResultReplay`
  })
}
//  获取复盘当前兵力左侧统计现存、战损的个数接口
export const getEquipmentCountByRedisReplay = () => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}InferResultController/v1/getEquipmentCountByRedisReplay`
  })
}
