/*
 * @description: 杜千存 duqiancun@piesat.com
 * @Version: 1.0
 * @Author:杜千存 duqiancun@piesat.com
 * @Date: 2024-11-24 10:46:05
 * @LastEditors: 杜千存 duqiancun@piesat.cn
 * @LastEditTime: 2024-12-10 13:23:59
 */

import http from './request/http'
// 获取实验分析结果列表
export const getPageSimple = (data) => {
  return http({
    method: 'GET',
    url: `${serverUrls.experiment}experiment/v1/getPage`,
    params: data
  })
}

// 获取实验样本管理列表接口
export const getExpeSampleMgtList = (data) => {
  return http({
    method: 'GET',
    url: `${serverUrls.resultAnalysis}experiment/expe-sample-mgt/v1/getExpeSampleMgtList`,
    params: data
  })
}

// 获取统计结果-可视化分析
export const getStatisticsRes = (data) => {
  return http({
    method: 'GET',
    url: `${serverUrls.resultAnalysis}experiment/statistics/v1/getStatisticsRes`,
    params: data
  })
}

// 获取统计结果-获取任务规划结果列表
export const taskPlanResultList = (data) => {
  return http({
    method: 'POST',
    url: `${serverUrls.resultAnalysis}planningResult/v1/taskPlanPageResult`,
    data
  })
}
