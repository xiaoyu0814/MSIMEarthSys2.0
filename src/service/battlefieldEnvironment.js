/*
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2026-06-22 18:28:44
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2026-06-23 10:40:42
 * @FilePath: \MSIMEarthSys\src\service\battlefieldEnvironment.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// 战场环境图层

import http from './request/http'
import { BASE_URL_DATAFUSION } from './request/config'

// 民航数据
export const getMinHangJSON = () => {
  return http({
    method: 'get',
    url: `./static/data/geojson/minhang1.json`
  })
}
// 空间盒
export const getSpaceBoxData = (data) => {
  return http({
    method: 'post',
    url: `${BASE_URL_DATAFUSION}/fusion-data-index/gridCode/getBoundsIntelligent3D`,
    data
  })
}
// 卫星轨道
export const getSatlliteData = (name) => {
  return http({
    method: 'get',
    url: `./static/data/geojson/${name}.json`
  })
}
