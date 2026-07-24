/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-06-17 19:32:30
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2026-06-10 10:27:46
 */
import http from './request/http'
import { BASE_URL } from './request/config'

/**
 * 推送天气区域文件
 * @param {*} data
 * @returns
 */
export const sendArea = () => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}weather/v1/weather/sendArea`
  })
}
/**
 * 现场使用--推送天气区域文件
 * @param {*} data
 * @returns
 */
export const sendAreaNew = () => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCalculation}weather/v1/weather/sendAreaNew`
  })
}

export const getTextureImage = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.weather_image}/get_texture_image`,
    data
  })
}
