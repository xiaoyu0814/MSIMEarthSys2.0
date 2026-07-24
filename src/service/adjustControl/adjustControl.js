/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2023-11-17 18:19:40
 * @Description:导调控制接口配置
 */
import http from '@/service/request/http'
import { URL_CJ } from '../request/config'

// 获取联系人列表
export function getFriendsList(params, headers) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/seat/userGroupList/` + params,
    headers,
    method: 'get',
    params: ''
  })
}
