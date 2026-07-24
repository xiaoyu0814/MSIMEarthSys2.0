import http from './request/http'
import { URL_CJ, BASE_URL } from './request/config'

// 获取任务列表
export const getTaskList = (params) => {
  return http({
    method: 'get',
    url: `${URL_CJ}/hierarchyPlatform/assignment/getPage`,
    params: params
  })
}

// 删除任务
export function removeTask(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/assignment/delete`,
    method: 'get',
    params: params
  })
}

// 创建任务
export function createTask(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/assignment/add`,
    method: 'POST',
    data: params
  })
}

// 更新任务
export function updataTask(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/assignment/update`,
    method: 'POST',
    data: params
  })
}

// 获取任务类型列表
export function getTaskTypeList(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/assignment/getTypeList`,
    method: 'get',
    params: params
  })
}

// 检测席位组成员是否都已绑定
export function getSeatCheckUser(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/assignment/checkMember`,
    method: 'get',
    params: params
  })
}

// 分页查询文书信息
export function getTaskDocList(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/writ/getByPage`,
    method: 'get',
    params: params
  })
}

// 批量删除任务文书
export function batchRemoveTaskDoc(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/writ/deleteBath`,
    method: 'post',
    data: params
  })
}

//删除任务文书
export function singleDelete(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/writ/delete`,
    method: 'get',
    params: params
  })
}

// 上报任务文书
export function reportTaskDoc(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/writ/escalation`,
    method: 'post',
    data: params
  })
}

// 发布任务文书
export function publishTaskDoc(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/writ/release`,
    method: 'post',
    data: params
  })
}

// 分页查询指令信息
export function getTaskInstructList(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/order/getByPage`,
    method: 'get',
    params: params
  })
}

// 单个删除任务指令
export function batchTaskInstructObj(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/order/delete`,
    method: 'get',
    params: params
  })
}

// 批量删除任务指令
export function batchRemoveTaskInstruct(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/order/deleteBath`,
    method: 'post',
    data: params
  })
}

// 上报任务指令
export function reportTaskInstruct(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/order/escalation`,
    method: 'post',
    data: params
  })
}

// 发布任务指令
export function releaseTaskInstruct(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/order/release`,
    method: 'post',
    data: params
  })
}

// 分页查询数据包信息
export function getTaskDataBagList(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/package/getByPage`,
    method: 'get',
    params: params
  })
}

// 上报任务数据包
export function reportTaskDataBag(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/package/escalation`,
    method: 'post',
    data: params
  })
}

// 发布任务数据包
export function releaseTaskDataBag(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/package/release`,
    method: 'post',
    data: params
  })
}

// 模拟器分配人员
export function setSimulatorBL(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/assignment/personnelAssignment`,
    method: 'post',
    data: params
  })
}

// 检测席位组成员是否正在任务推演中
export const checkMemberOfTasking = (params) => {
  return http({
    // http://10.1.51.68:9080
    method: 'get',
    url: `${URL_CJ}/hierarchyPlatform/assignment/checkMemberOfTasking`,
    params
  })
}

// 清空任务集合中的用户
export const clearSeatMemberSet = (params) => {
  return http({
    method: 'post',
    url: `${URL_CJ}/hierarchyPlatform/assignment/clearSeatMemberSet`,
    data: params
  })
}
// 获取当前启动场景仿真信息,指挥控制席、情报系显示任务列表卡片
export const getNowTaskInfo = () => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}simRehearsalTaskRecord/getNowTaskInfo`
  })
}
// 根据不同条件类型获取任务列表
export const getTaskListByConditions = (params) => {
  return http({
    method: 'post',
    url: `${URL_CJ}/hierarchyPlatform/assignment/v2/getPage`,
    params: params
  })
}
