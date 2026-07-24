/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-11-14 16:57:40
 * @LastEditors: dingxuanyu
 * @LastEditTime: 2024-10-23 13:33:33
 * @FilePath: \vue3+js+vite\src\api\adjustControl\document.js
 * @Description: 保障席位接口
 */
// import request from "@/api/http";
import http from '@/service/request/http'
import { URL_CJ } from './request/config'

// 天气状态-上传
export function addWeatherFile(data, headers) {
  return http({
    url: `${URL_CJ}/weather​/addWeatherFile`,
    headers,
    method: 'POST',
    data
  })
}

// 获取展示形式列表
export function getDisplayModeByElementID(data) {
  return http({
    url: `${serverUrls.numericalElement}/showPrd/getDisplayModeByElementID`,
    method: 'GET',
    params: data
  })
}

// 航线分析
export function getWindyChangeFaceData(data) {
  return http({
    url: `${serverUrls.numericalElement}/synAnalysis/getWindyChangeFaceData`,
    method: 'GET',
    params: data
  })
}

// 保障席位-选择路线
export function directDataLine(data, headers) {
  return http({
    url: `${URL_CJ}/simulation-service-simswitch/SimulatorDirectController/directDataLine`,
    headers,
    method: 'post',
    data
  })
}
