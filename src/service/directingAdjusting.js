/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-01-16 15:47:51
 * @LastEditors: ZX Li
 * @LastEditTime: 2025-10-11 16:35:39
 */
// 导调
import http from './request/http'
import { BASE_URL_GATEWAY, BASE_URL } from './request/config'

// 导调白方修改天气
export const changeWeather = (params) => {
  return http({
    method: 'post',
    url: `${serverUrls.serverWeather}guide/v1/white/changeWeather`,
    data: params
  })
}

// 导调白方修改天气
export const changeSeason = (params) => {
  return http({
    method: 'post',
    url: `${serverUrls.serverWeather}guide/v1/white/changeSeason`,
    data: params
  })
}

// 导调红方创建Item
export const createRedItem = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}guide/v1/red/createItem`,
    data
  })
}

// 导调蓝方创建Item
export const createBlueItem = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}guide/v1/blue/createItem`,
    data
  })
}
//和UE交互设置相机视角
export const moveCamera = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.afsimControl}/guide/v1/white/moveCamera`,
    data: data
  })
}
//获取模拟器类型列表接口
export const getSimTypeList = () => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCalculation}guide/v1/sim/getSimTypeList`
  })
}
//获取已初始化模拟器列表接口
export const getSimList = (data) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCalculation}guide/v1/sim/getSimList?simTypeId=${data.simTypeId}&camp=${data.camp}`,
    data
  })
}
/**
 * 导调立刻删除Item
 * @param {*} data
 *  "entityID": "" -- 必添 实例ID,英文名称
 * @returns
 */
export const removeEntity = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}guide/v1/white/removeEntity`,
    data: data
  })
}
/**
 * 导调创建Item(非模拟器接口)
 * @param {*} data
    "name": "", //实例名称 只能输入英文和数字
    "side": "red", //阵营
    "type": "ACOUSTIC_TARGET", //实例类型 RUAV
    "lng": 0, //经度
    "lat": 0, //纬度
 *  "alt": 0, //高度
    "heading": 0,//航向角
    "speed": 0 //速度
 * @returns
 */
export const createItem = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}guide/v1/white/createItem`,
    data
  })
}

/**
 * 导调白方修改气象环境
 * @param {*} params
 *  cloudWaterDensity	云雨密度(作用于衰减模型) kg/m^3
    landCover	陆地覆盖(作用于杂波模型)
    landFormation	地形(作用于杂波模型)
    rainAltitudeLimit	降雨高度限制，最大高度(作用于衰减模型) m
    rainRate	降雨量(作用于衰减模型) m/s
    seaState	海况等级(作用于杂波模型) 0-6
 * @returns
 */
export const changeWeatherAfsim = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}guide/v1/white/changeWeatherAfsim`,
    data: data
  })
}
// 获取导调计划列表
export const getGuideList = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}guide/v1/guide/getList`,
    data: data
  })
}
// 批量执行导调计划
export const executes = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}guide/v1/guide/execute`,
    data: data
  })
}
// 批量删除导调计划
export const deletes = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}guide/v1/guide/delete`,
    data: data
  })
}

// 白方添加导调-环境-电磁
export const electromagnetismw = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}guide/v1/white/add/electromagnetism`,
    data: data
  })
}

// 白方添加导调-环境-海洋
export const oceanx = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}guide/v1/white/add/ocean`,
    data: data
  })
}
// 白方添加导调-文电（可计划导调）
export const wenDian = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}guide/v1/white/add/wenDian`,
    data: data
  })
}
// 获取导调计划详情
export const getDetail = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCalculation}guide/v1/guide/detail`,
    params
  })
}
// 编辑导调
export const editPlan = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}guide/v1/guide/edit`,
    data: data
  })
}

// 导调白方复位气象环境
export const resetWeatherAfsim = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}guide/v1/white/resetWeatherAfsim`
  })
}

//获取计划导调队列接口
export const getGuideQueue = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.afsimControl}/guide/v1/white/getGuideQueue`,
    params
  })
}

// 获取计划导调导调项类型
export const getEnumList = () => {
  return http({
    method: 'get',
    url: `${serverUrls.afsimControl}/guide/v1/white/getEnumList`
  })
}

// 新增导调计划
export const addList = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.afsimControl}/guide/v1/white/addList`,
    data: data
  })
}

// 查询导调对象
export const getAllPlatWithCondition = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversData}/SceneDeterminateController/v1/getAllPlatWithCondition`,
    data: data
  })
}

// 删除导调计划
export const deleteListById = (params) => {
  return http({
    method: 'delete',
    url: `${serverUrls.afsimControl}/guide/v1/white/deleteListById`,
    params
  })
}

// 修改导调计划
export const updateListById = (data) => {
  return http({
    method: 'put',
    url: `${serverUrls.afsimControl}/guide/v1/white/updateListById`,
    data: data
  })
}
