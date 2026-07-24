/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-05-30 16:38:09
 * @LastEditors: ZX Li
 * @LastEditTime: 2024-05-31 17:02:02
 */
// qb席

import http from './request/http'
import { URL_CJBJ, BASE_URL } from './request/config'

// 获取树状分类接口（类别）
export const getCategoryTreeList = () => {
  return http({
    method: 'get',
    url: `${URL_CJBJ}/scene/catalog/list/tree`
  })
}
// 获取场景编辑实体列表（型号）
export const getScenarioTypeList = (params) => {
  return http({
    method: 'get',
    url: `${URL_CJBJ}/scene/elementEntity/getScenarioEntityList`,
    params: params
  })
}
// 获取qb席探测到zb列表（2级）
export const getPlateList = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}SimIntelligenceSensorController/v1/getPlateList`,
    params: params
  })
}
// 获取qb席探测到zb列表（3级）
export const getSensorList = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}SimIntelligenceSensorController/v1/getSensorList`,
    params: params
  })
}
// 获取qb席探测到qb的数据（4级）
export const getSensorData = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}SimIntelligenceSensorController/v1/getSensorData`,
    params: params
  })
}
// 标识qbzb数据
export const editSensorData = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversData}SimIntelligenceSensorController/v1/editSensorData`,
    data
  })
}
// 获取已编辑的qbzb数据
export const getEditedIntelligencePlate = (data) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}SimIntelligenceSensorController/v1/getEditedIntelligencePlate`,
    params: data
  })
}
