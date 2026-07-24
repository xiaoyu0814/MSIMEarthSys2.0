/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-01-16 15:47:51
 * @LastEditors: ZX Li
 * @LastEditTime: 2024-06-01 18:10:58
 */
import http from './request/http'
import { BASE_URL_GATEWAY, BASE_URL } from './request/config'

// 时间启动
export const activeTime = (data) => {
  // return http({
  //   method: 'post',
  //   url: `${serverUrls.serversCalculation}/time/v1/activeTime`,
  //   data: data
  // })
  return http({
    method: 'get',
    url: `${serverUrls.serversCalculation}/experimentSubjects/activeTime/${data}`,
    data: data
  })
}

// 时间启动
export const pauseTime = (data) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCalculation}/experimentSubjects/terminateTime/${data}`,
    data: data
  })
}

// 时间启动
export const updateTimeSpeed = (data) => {
  return http({
    method: 'get',
    // url: `${serverUrls.serversCalculation}/time/v1/updateTimeSpeed`,
    url: `${serverUrls.serversCalculation}/experimentSubjects/updateTimeSpeed?id=${data.id}&timeSpeed=${data.speed}`,
    data: data
  })
}
// 停止afsim
export const stopAfsimServer = (id) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCalculation}/experimentSubjects/stop/${id}`
  })
}
// 启动afsim，后台不掺杂其他业务处理的接口。
export const startAfsimServer = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}/time/v1/start`,
    params: data
  })
}
// 通过接口获取时间倍速
export function getTimeSpeed(id) {
  return http({
    url: `${serverUrls.serversCalculation}/experimentSubjects/getTimeSpeed/${id}`,
    method: 'get'
  })
}
// 通过接口获取时间倍速
export function getExpeSimClientInformation(params) {
  return http({
    url: `${serverUrls.serversCalculation}/engine/v1/getExpeSimClientInformation`,
    method: 'post',
    data: params
  })
}
