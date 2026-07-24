/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2025-06-30 11:06:47
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2025-12-12 10:02:43
 * @FilePath: \gfdx\src\service\videoServer\videoManagement.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import http from '@/service/request/http'
import { BASE_URL } from '../request/config'

// 获取任务列表
export const requestTalkback = (parms) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCommunication}EventSourceController/requestVideo`,
    params: parms
  })
}

// 获取任务列表
export const tts = (parms) => {
  return http({
    method: 'post',
    // url: `${serverUrls.serversCommunication}EventSourceController/requestVideo`,
    url: `${serverUrls.audioService}/tts`,
    responseType: 'blob',
    data: parms
  })
}

// 获取播报员列表
export const speakersList = (parms) => {
  return http({
    method: 'get',
    // url: `${serverUrls.serversCommunication}EventSourceController/requestVideo`,
    url: `${serverUrls.audioService}/list_speakers`,
    parms
  })
}
