import http from './request/http'
import { URL_CJBJ } from './request/config'

// 登录系统
export const exportSML = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serverSml}/scene/scenario/exportSML`,
    // responseType: 'blob',
    params
  })
}
