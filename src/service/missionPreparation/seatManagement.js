import http from '../request/http'
import { URL_CJ } from '../request/config'

// 分页查询席位信息
export function getSeatList(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/seat/getByPage`,
    method: 'get',
    params: params
  })
}
// 根据任务id查询席位组信息
export function getUseSeatSchemeByTaskId(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/seat/getUseSeatSchemeByTaskId`,
    method: 'get',
    params: params
  })
}

// 分页查询未被使用的席位信息
export function getUseSeatScheme(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/seat/getUseSeatScheme`,
    method: 'get',
    params: params
  })
}

// 删除席位方案
export function deleteSeat(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/seat/delete`,
    method: 'get',
    params: params
  })
}

// 席位创建
export function createSeat(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/seat/add`,
    method: 'post',
    data: params
  })
}

// 席位方案编辑（只修改席位方案名称、描述及组信息，不包括成员信息）
export function addSeatScheme(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/seat/update`,
    method: 'post',
    data: params
  })
}

// 获取角色（席位）列表
export function getRoleSeatList(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/role/v1/getList`,
    method: 'get',
    params: params
  })
}

// 获取用户列表
export function getUserList(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/userInfo/v1/getUserList`,
    method: 'get',
    params: params
  })
}

// 席位增删改查
export function updateSeat(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/seat/updateMemeber`,
    method: 'post',
    data: params
  })
}

// 席位组编辑 （添加/删除/编辑席位组）
export function updateGroup(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/seat/updateGroup`,
    method: 'post',
    data: params
  })
}

// 根据key查询角色
export function getRoleInfoByRoleKey(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/role/v1/getByKey`,
    method: 'get',
    params: params
  })
}

// 模拟器列表
export function getSimulatorList1(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/simulator/getByShemceId?` + params,
    method: 'get'
    // params: params,
  })
}

// 模拟器列表
export function getSimulatorList(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/simulator/getSimulator`,
    method: 'get'
    // params: params,
  })
}

// 获取阵营列表
export function getCampList(params) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/belonging/getBelonging`,
    method: 'get',
    params: params
  })
}
