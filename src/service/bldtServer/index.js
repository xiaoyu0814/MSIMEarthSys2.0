/*
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2026-01-14 11:04:17
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2026-01-16 20:52:33
 * @FilePath: \gfdx\src\service\bldtServer\index.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import http from '../request/http'
import { URL_CJ } from '../request/config'
//
// 根据阵营获取当前场景中的平台编组节点接口
export function getPlatStatusGroupNodeBySide(params) {
  return http({
    url: `${baseUrl16006}/scene/v1/getPlatStatusGroupNodeBySide`,
    method: 'get',
    params
  })
}
// 按编组获取筹划结果
export function getPlanningResultsByGroup(data) {
  return http({
    url: `${serverUrls.afsimControl}/taskplanning/v1/getPlanningResultsByGroup`,
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data
  })
}
// 批量下达指令
export function issueBatchCommand(data) {
  return http({
    url: `${serverUrls.afsimControl}/taskplanning/v1/issueBatchCommand`,
    method: 'post',
    data
  })
}

// 查询全部想定关联数据
export function getDataList(params) {
  return http({
    url: `${URL_CJ}/expeScenarioRelatedData/v1/getList`,
    method: 'get',
    params
  })
}

// 创建想定关联数据
export function saveRelatedData(data) {
  return http({
    url: `${URL_CJ}/expeScenarioRelatedData/save`,
    method: 'post',
    data
  })
}
