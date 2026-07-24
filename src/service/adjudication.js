/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-03-13 16:15:44
 * @LastEditors: ZX Li
 * @LastEditTime: 2024-04-23 10:57:49
 */
import http from './request/http'
import { BASE_URL } from './request/config'
//裁决所需接口
/**
 * 获取裁决事件类型列表
 * @returns
 */
export const getAdjudicationEventList = () => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}rule/getArbitramentEventList`
  })
}

// 申请裁决接口
export const applyForRuling = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversData}rule/applyForRuling`,
    data: data
  })
}

// 执行裁决接口
export const executeRule = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversData}rule/executeRule`,
    data: data
  })
}
// 获取裁决信息列表接口(申请人查询)
export const getRuleList = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversData}rule/getRuleList`,
    data: data
  })
}
// 筛选事件列表
export const getSimEventMgtList = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversData}SimEvent/getSimEventMgtList`,
    data: data
  })
}
// 获取裁决信息列表接口(审批用户查询)
export const getRuleListByRuleUserId = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversData}rule/getRuleListByRuleUserId`,
    data: data
  })
}
// 执行裁决事件
export const executeEvent = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversData}rule/executeEvent`,
    data: data
  })
}
