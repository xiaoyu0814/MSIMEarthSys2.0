/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-05-30 16:38:09
 * @LastEditors: yuqiangqiang yqq@piesat.cn
 * @LastEditTime: 2024-09-06 18:10:30
 */
import http from './request/http'
import { URL_CJBJ, BASE_URL_GATEWAY, URL_CJ } from './request/config'

// 获取雷达探测干扰geojson和对应png
//let params = {
//entityName: 123,
//  }
//雷达覆盖图
export const getRaderGR = (params) => {
  return http({
    method: 'get',
    url: `${URL_CJBJ}/scene/catalog/getEMToolInfo`,
    params
  })
}
// 获取三维雷达遮罩数据
export const getRader3D = (url) => {
  return http({
    method: 'get',
    url: url //`./static/data/geojson/radar干扰/S1.json`
  })
}

// 聚焦雷达 platformName 平台名称 调用接口成功之后5秒恢复，如再受到干扰再次改变
export const radarInterferenceFocus = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversData}InterferenceController/v1/interference/focus`,
    data
  })
}

// 雷达遮罩消息测试接口
// {
//   "interferenceSources": [
//     {
//       "jam_range": "5000",
//       "jammerX": "1000",
//       "jammerY": "0",
//       "maxPitchAngle": "50",
//       "minPitchAngle": "0",
//       "platformName": "ew_radar"
//     }
//   ]
// }
export const radarInfoTest = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversData}InterferenceController/v1/interference/getRange`,
    data
  })
}

//获取电磁环境信息
export const getEMEnvironmentInfo = (params) => {
  return http({
    method: 'get',
    url: `${URL_CJBJ}/scene/catalog/getEMEnvironmentInfo`,
    params
  })
}

// 获取杂波图信息
export const getNoiseMap = (params) => {
  return http({
    method: 'get',
    url: `${URL_CJBJ}/scene/catalog/getNoiseMap`,
    params
  })
}

// 获取本地或服务器三维雷达遮罩数据
export const getRader3DStatic = (url) => {
  return http({
    method: 'get',
    url: url //`./static/data/geojson/radar干扰/S1.json`
  })
}

//激光欺骗干扰状态
export const getLaserDesignatorState = (data) => {
  return http({
    url: `${serverUrls.serversCalculation}/command/v1/sensor/LaserDesignatorState`,
    method: 'post',
    data
  })
}
