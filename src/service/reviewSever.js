/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-06-17 19:32:30
 * @LastEditors: ZX Li
 * @LastEditTime: 2024-06-22 15:42:22
 */
import http from './request/http'
import { BASE_URL } from './request/config'
// 任务记录
export const getRecordQueryPage = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}simRehearsalTaskRecord/getRecordQueryPage`,
    params
  })
}
// 删除记录
export const deleteRecordById = (params) => {
  return http({
    method: 'delete',
    url: `${serverUrls.serversData}simRehearsalTaskRecord/deleteRecordById`,
    params
  })
}
// 修改名称
export const editRecord = (data) => {
  return http({
    method: 'put',
    url: `${serverUrls.serversData}simRehearsalTaskRecord/editRecord`,
    data: data,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
}
