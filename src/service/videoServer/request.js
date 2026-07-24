/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-04-17 10:17:19
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2024-04-22 10:19:16
 * @FilePath: \MSIMEarthSysN\src\service\videoServer\request.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
// import axios from 'axios'
import http from '../request/http'
// axios.defaults.headers['Content-Type'] = 'application/json;charset=utf-8'
import { VIDEO_URL } from '../request/config'
// 创建axios实例
// const service = axios.create({
//   // axios中请求配置有baseURL选项，表示请求URL公共部分
//   baseURL: VIDEO_URL,
//   // 超时
//   timeout: 10000
// })

const videoService = () => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCommunication}/getUsers`,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8'
    }
  })
}

export default videoService
