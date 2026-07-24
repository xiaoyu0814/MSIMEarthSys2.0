/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2025-12-12 14:59:00
 * @LastEditors: ZX Li
 * @LastEditTime: 2026-01-10 14:24:19
 */
import http from './request/http'
import { BASE_URL_GATEWAY, URL_CJ } from './request/config'

// 登录系统
// export const loginSystem_ = (params) => {
//   return http({
//     method: 'get',
//     url: `http://10.1.30.102:16001/login/v1/login`,
//     params
//   })
// }
export const loginSystem_ = (params) => {
  return http({
    method: 'get',
    url: `${BASE_URL_GATEWAY}/login/v1/login?account=${params.account}&password=${params.password}`
  })
}
// 登录系统
export const loginSystem = (params) => {
  return http({
    method: 'post',
    url: `${URL_CJ}/hierarchyPlatform/bigDataUser/v1/login`,
    data: params
  })
}
// 获取当前登录用户接口30.82
export const getCurrentUser_ = () => {
  return http({
    method: 'get',
    url: `${URL_CJ}/hierarchyPlatform/bigDataUser/v1/getCurrentUser`
  })
}

// 获取当前登录用户接口
export const getCurrentUser = () => {
  return http({
    method: 'get',
    url: `${BASE_URL_GATEWAY}/login/v1/getCurrentUser`,
    headers: {
      Cookie: window.localStorage.getItem('sessionId')
    }
  })
}

// 查询权限接口
export const getCurrentRoleAuthInfo = () => {
  return http({
    method: 'get',
    url: `${BASE_URL_GATEWAY}/lvc-service-system/authority/v1/getCurrentRoleAuthInfo`
  })
}

//获取用户列表
export const getUsers = (option) => {
  return http({
    method: 'get',
    url: `${BASE_URL_GATEWAY}/login/v1/getUserPage`,
    params: option
  })
}

//更新限制用户会话时间
export const refreshLimitSession = (option) => {
  return http({
    method: 'get',
    url: `${BASE_URL_GATEWAY}/login/v1/refreshLimitSession`,
    params: option
  })
}

//删除限制用户会话时间
export const deleteLimitSession = (option) => {
  return http({
    method: 'get',
    url: `${BASE_URL_GATEWAY}/login/v1/deleteLimitSession`,
    params: option
  })
}
