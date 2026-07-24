/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2025-06-30 11:06:47
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2026-01-08 13:38:11
 * @FilePath: \gfdx\src\service\request\http.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import axios from 'axios'

function getSession(key) {
  let json = window.sessionStorage.getItem(key)
  if (key == 'token') {
    return json
  } else {
    return JSON.parse(json)
  }
}

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // 确保withCredentials始终为true
    config.withCredentials = false

    if (getSession('token')) {
      config.headers['Authorization'] = `${getSession('token')}`
    }

    // 打印请求配置，查看withCredentials是否生效
    // console.log('请求配置:', config)
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 响应拦截器
axios.interceptors.response.use(
  (response) => {
    return response
  },
  (error) => {
    error.response.data = {
      error: error.response.statusText
    }
    return Promise.reject(error.response)
  }
)

// 请求方法
function http(params) {
  let CancelToken = axios.CancelToken
  let options = {
    cancelToken: new CancelToken(function (cancel) {
      params.cancel = cancel
    }),
    // 配置withCredentials为true，允许携带cookie（包括HttpOnly cookie）
    withCredentials: false
  }
  options = {
    ...options,
    ...params
  }
  return new Promise((resolve, reject) => {
    axios(options)
      .then((response) => {
        // console.log(response)

        // if (response.data.code && response.data.code !== 200) {
        if (response.status && response.status !== 200) {
          resolve({
            error: response.data.message || ''
          })
        } else {
          resolve(response.data)
        }
      })
      .catch((error) => {
        resolve({
          error: error.data || ''
        })
      })
  })
}

export default http
