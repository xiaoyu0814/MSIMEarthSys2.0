/*
 * @Author: 杜千存 duqiancun@piesat.cn
 * @Date: 2024-12-02 11:24:00
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2025-12-11 14:46:12
 * @FilePath: \GroundParallelSystemProcessWeb\src\service\experiment\experiment.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import { method } from 'lodash'
import http from '../request/http'
import { URL_CJ } from '../request/config'
// 第一步新增接口
export const createInsert = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.experiment}experiment/v1/insert`,
    data: data
  })
}
// 第一步列表接口
export const creategetPage = (data) => {
  return http({
    // url: `${serverUrls.experiment}experiment/v1/getPage`,
    url: `${URL_CJ}/experimentSubjects/query`,
    method: 'get',
    params: data
  })
}
//第二部实验规划编辑接口
export const experimentEdit = (data) => {
  return http({
    url: `${serverUrls.experiment}experiment/v1/edit`,
    method: 'post',
    data: data
  })
}
//第二部实验规划关联场景接口
export const experimentGetByPage = (data) => {
  return http({
    url: `${serverUrls.expeData}scenario/getByPage`,
    method: 'get',
    params: data
  })
}
//第三步实验想定计划新增接口
export const missionConfigInsert = (data) => {
  return http({
    url: `${serverUrls.experiment}task/v1/insert`,
    method: 'post',
    data: data
  })
}
//第三步实验想定计划目标接口
export const missionConfiggetBlueTargetList = (data) => {
  return http({
    url: `${serverUrls.experiment}experiment/v1/getBlueTargetList`,
    method: 'get',
    params: data
  })
}

//第三步实验想定计划查询接口
export const missionConfigGetPage = (data) => {
  return http({
    url: `${serverUrls.experiment}task/v1/getPage`,
    method: 'get',
    params: data
  })
}

//实验样本管理列表查询接口
export const getPageSimple = (data) => {
  return http({
    url: `${serverUrls.experiment}experiment/v1/getPageSimple`,
    method: 'get',
    params: data
  })
}

//实验样本管理列表删除接口
export const deleteExpeSampleMgtById = (data) => {
  return http({
    url: `${serverUrls.experiment}experiment/expe-sample-mgt/v1/deleteExpeSampleMgtById?id=${data}`,
    method: 'delete'
  })
}

//获取实验样本详情接口

export const getInfo = (data) => {
  return http({
    url: `${serverUrls.experiment}experiment/v1/getInfo`,
    method: 'get',
    params: data
  })
}

export const getInfo2 = (data) => {
  return http({
    url: `${serverUrls.experiment}experiment/record/v1/getInfo`,
    method: 'get',
    params: data
  })
}

// 分页查询想定信息
export const getMissionList = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.expeData}scenario/getByPage`,
    params
  })
}

//创建想定
export const createMission = (params) => {
  return http({
    method: 'post',
    url: `${serverUrls.expeData}scenario/v2/add`,
    data: params
  })
}
//想定删除
export const DeleteMission = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.expeData}scenario/delete`,
    params
  })
}
// 编辑想定
export const updataMission = (params) => {
  return http({
    method: 'post',
    url: `${serverUrls.expeData}/scenario/update`,
    data: params
  })
}

//实验样本生成
export const getExpeSampleMgtPage = (data) => {
  return http({
    url: `${serverUrls.experiment}experiment/expe-sample-mgt/v1/getExpeSampleMgtPage`,
    method: 'get',
    params: data
  })
}

//删除实验基本信息
export const getExpeSampleMgtremove = (data) => {
  return http({
    url: `${serverUrls.experiment}experiment/v1/remove`,
    method: 'post',
    data: data
  })
}

//样本生成
export const generateSamples = (data) => {
  return http({
    url: `${serverUrls.experiment}experiment/v1/generateSamples`,
    method: 'post',
    data: data
  })
}
//生成样本集
export const generateSampleByExperiment = (data) => {
  return http({
    url:
      `${serverUrls.experiment}experiment/expe-sample-mgt/v1/generateSampleByExperiment?experimentId=` +
      data,
    method: 'get'
    // prarms: data
  })
}
//样本数据
export const generateSampleBygetPage = (data) => {
  return http({
    url:
      `${serverUrls.experiment}experiment/record/v1/getPage?pageNum=` +
      data.pageNum +
      `&pageSize=` +
      data.pageSize +
      `&sampleId=` +
      data.sampleId,
    method: 'get'
    // prarms: data
  })
}

//获取当前运行中实验样本执行记录详情接口
export const getCurrentInfo = (data) => {
  return http({
    url: `${serverUrls.serversCalculation}experiment/record/v1/getCurrentInfo`,
    method: 'get'
  })
}
// 想定编辑系统
export const getById = (data) => {
  return http({
    url: `${serverUrls.serversCalculation}/scenario/getById`,
    method: 'get',
    params: data
  })
}

export const getGroupByScenarioId = (data) => {
  return http({
    url: `${serverUrls.serversCalculation}/groupConfiguration/v1/getInfoList`,
    method: 'get',
    params: data
  })
}

// 获取作战区域数据
export const getZZQYData = (data) => {
  return http({
    url: `${serverUrls.serversCalculation}/scenario/getById`,
    method: 'get',
    params: data
  })
}

// 查询实验效果JSON文件
export const queryExperimentJsonFile = (data) => {
  return http({
    url: `${serverUrls.serversCalculation}/experimentJsonFile/query`,
    method: 'get',
    params: data
  })
}

// 下载实验效果JSON文件
export const downloadExperimentJsonFile = (data) => {
  return http({
    url: `${serverUrls.serversCalculation}/experimentJsonFile/download`,
    method: 'get',
    params: data
  })
}

// 创建或更新实验效果JSON文件
export const createOrUpdate = (data) => {
  return http({
    url: `${serverUrls.serversCalculation}/experimentJsonFile/createOrUpdate?experimentId=${data.experimentId}`,
    method: 'post',
    data: data.list
  })
}

// 创建或更新实验效果JSON文件
export const getAllPlatByScenarioId = (params) => {
  return http({
    url: `${baseUrl16006}/troop-configuration/all`,
    method: 'get',
    params
  })
}
