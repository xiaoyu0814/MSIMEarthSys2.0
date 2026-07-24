/*
 * @Author: root root@example.com
 * @Date: 2024-06-25 11:16:52
 * @LastEditors: root root@example.com
 * @LastEditTime: 2024-06-25 17:40:54
 * @FilePath: \MSIMEarthSysN\src\service\simModelCommand.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import http from './request/http'
import { BASE_URL } from './request/config'

/**
 * 集合指令接口
 * @param {*} data
 * @returns
 */
export const directDataCommand = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.simModelServer}SimulatorDirectController/directDataCommand`,
    data: data
  })
}
/**
 * 演练管理运控指令接口
 * @param {*} data
 * @returns
 */
export const directDataControl = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.simModelServer}SimulatorDirectController/directDataControl`,
    data: data
  })
}
/**
 * 演练管理初始化接口
 * @param {*} data
 * @returns
 */
export const directDataInit = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.simModelServer}SimulatorDirectController/directDataInit`,
    data: data
  })
}
/**
 * 演练管理气象命令
 * @param {*} data
 * @returns
 */
export const directDataWeather = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.simModelServer}SimulatorDirectController/directDataWeather`,
    data: data
  })
}
