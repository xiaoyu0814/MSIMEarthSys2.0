// 想定编辑
import http from './request/http'
import { URL_CJ } from './request/config'

// 获取想定列表
export const getXDList = (data) => {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/scenario/getByPage`,
    method: 'get',
    params: data
  })
}
