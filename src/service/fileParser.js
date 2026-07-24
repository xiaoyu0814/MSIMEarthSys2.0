/*
 * @description: 文件解析
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-03-13 16:15:44
 * @LastEditors: ZX Li
 * @LastEditTime: 2024-04-23 10:57:49
 */
import http from './request/http'

// acmi文件解析
export const acmiFileParserFun = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversBigdataGateway}acmiFileParser/fileParser`,
    data: data
  })
}
// aco文件解析
export const analysisACOXML = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serverUrl}/air/v1/analysisACOXML`,
    data: data
  })
}
