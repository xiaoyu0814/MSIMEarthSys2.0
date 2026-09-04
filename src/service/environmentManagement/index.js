/*
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2026-07-16 10:18:01
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2026-07-16 10:18:31
 * @FilePath: \MSIMEarthSystem\src\service\environmentManagement\index.js
 * @Description: 工具栏——图层管理——气象海洋环境相关服务配置
 */

import http from '../request/http'
import { URL_EVVIROMENT } from '../request/config'

// 分页条件查询环境影响情况
export const pageQuery = (data) => {
  return http({
    url: `${URL_EVVIROMENT}/env/impact/v1/queryGroup`,
    method: 'post',
    data: data
  })
}

// 根据id查询环境影响情况
export const creategetPage = (data) => {
  return http({
    url: `${URL_EVVIROMENT}/env/impact/v1/getById`,
    method: 'get',
    params: data
  })
}
