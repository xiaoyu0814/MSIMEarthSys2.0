import http from './request/http'
import {
  BASE_URL,
  BASE_URL_GATEWAY,
  URL_CJ,
  simulationIp
} from './request/config'

// 获取评估分析页面- 基本信息接口
export const getTaskInfoTaskId = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCalculation}sceneRehearsalTaskData/getTaskInfoByTaskId`,
    params
  })
}

// 兵力信息- 表格查询接口
export const getNowTroopsPaPd = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}sceneAnalysisController/getNowTroopsPaPd`,
    params
  })
}

// 兵力分析- 查询初始兵力
export const getBeginTroopsPA = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}sceneAnalysisController/getBeginTroopsPA`,
    params
  })
}

//兵力分析- 查询当前红蓝方兵力比率
export const getNowTroopsPaRatio = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}sceneAnalysisController/getNowTroopsPaRatio`,
    params
  })
}

//战果分析- 命中击毁柱状图
export const getHitHistogram = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}sceneAnalysisController/getHitHistogram`,
    params
  })
}

//战果分析- 命中击毁柱状图
export const getHitTableData = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}sceneAnalysisController/getHitTableData`,
    params
  })
}

//战果分析- 战损柱状图
export const getBattleDamageHistogram = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}sceneAnalysisController/getBattleDamageHistogram`,
    params
  })
}

//战果分析- 战损表格
export const getBattleDamageTableData = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}sceneAnalysisController/getBattleDamageTableData`,
    params
  })
}
// 评估指标 - 查询评估数据
export const getAssessData = (params) => {
  return http({
    method: 'get',
    url: `${URL_CJ}/hierarchyPublicServicePlatform/assess/getAssessData`,
    params
  })
}
