/*
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2025-05-16 15:29:52
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2025-05-16 17:24:57
 * @FilePath: \sjzWeb\src\service\experimentalPreparation.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 实验课目管理层
import http from './request/http'

// 查询实验课目列表
export const getExperimentSubjects = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCalculation}/experimentSubjects/query`,
    params
  })
}
// 分页查询想定信息
export const getScenarioByPage = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCalculation}/scenario/getByPage`,
    params
  })
}
// 分页查询想定信息
export const getScenarioById = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCalculation}/scenario/getById`,
    params
  })
}
