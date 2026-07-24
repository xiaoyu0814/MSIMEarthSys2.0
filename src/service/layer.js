/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-05-30 16:38:09
 * @LastEditors: root you@example.com
 * @LastEditTime: 2024-07-19 16:47:45
 */
import http from './request/http'
import { URL_CJBJ } from './request/config'

/*获取西安服务
 *params.scope:'public'
 *params.keywords:'地理数据服务'
 */
export const getServices = (params) => {
  return http({
    method: 'get',
    url: `${xiAnMapServerUrl}v1/rest/publishing/services`,
    params
  })
}
/*获取西安服务图层列表
 *params.serviceId:服务id
 */
export const getServiceLayerList = (params) => {
  return http({
    method: 'get',
    url: `${xiAnMapServerUrl}v1/rest/publishing/services/${params.serviceId}`
  })
}
