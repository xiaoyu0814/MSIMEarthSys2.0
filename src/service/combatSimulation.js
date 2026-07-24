/*
 * @description: 杜千存 duqiancun@piesat.com
 * @Version: 1.0
 * @Author:杜千存 duqiancun@piesat.com
 * @Date: 2024-11-24 10:46:05
 * @LastEditors: 杜千存 duqiancun@piesat.cn
 * @LastEditTime: 2024-12-04 10:42:19
 */

import http from './request/http'
import { URL_CJ } from './request/config'

// 开始实验
export const startExperiment = (id) => {
  return http({
    method: 'get',
    url: `${URL_CJ}/experimentSubjects/start/${id}`
  })
}

///experimentSubjects/start/{id}

//获取样本列表接口
export const getExpeSampleMgtPage = (data) => {
  return http({
    url: `${serverUrls.combatSim}experiment/expe-sample-mgt/v1/getExpeSampleMgtPage`,
    method: 'GET',
    params: data
  })
}

// 结束当前样本
export const stopExperiment = (data) => {
  return http({
    method: 'POST',
    url: `${serverUrls.combatSim}/experiment/process/v1/stop`,
    data: data
  })
}
