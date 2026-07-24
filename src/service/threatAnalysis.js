//weixie分析所需接口

import http from './request/http'
import { BASE_URL } from './request/config'

// 获取红蓝双方被探测到进入wx预测的数据
export const getAllThreatPrediction = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serverUrl}/statistics/v1/getAllThreatPrediction`,
    params
  })
}
// 根据平台名称获取weixie评分表格
export const getOneThreatPrediction = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serverUrl}/statistics/v1/getOneThreatPrediction`,
    params: params
  })
}
// 点击获取mubiaoweixie表格数据
export const getAllLogInfo = () => {
  return http({
    method: 'get',
    url: `${serverUrls.serverUrl}/getAllLogInfo`
  })
}
// 获取mubiaoweixie雷达图
export const getThreatPredictionRadarMap = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serverUrl}/statistics/v1/getThreatPredictionRadarMap`,
    params
  })
}
