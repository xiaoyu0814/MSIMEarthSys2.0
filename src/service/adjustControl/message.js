import http from '@/service/request/http'
import { URL_CJ } from '../request/config'

// 获取房间（群）聊天历史记录
export function getHistoryMessage(params, headers) {
  return http({
    url: `${URL_CJ}/hierarchyDirecting/chatHistory/page`,
    headers,
    method: 'get',
    params: params
  })
}

// 获取私聊聊天历史记录
export function getChatHistory(params, headers) {
  return http({
    url: `${URL_CJ}/hierarchyDirecting/chatHistory/single`,
    headers,
    method: 'get',
    params
  })
}

// 获取房间（群）列表
export function getRoomList(params, headers) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/seat/userChatList/${params}`,
    headers,
    method: 'get'
  })
}
