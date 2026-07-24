import axios from 'axios'
// import {Message} from 'element-ui'
import { devIp } from '@/api/ipConfig'
// 刷新token的一个开关，防止重复请求
let isRefreshing = true

const service = axios.create({
  baseURL: devIp + '', // 测试IP
  timeout: 100000 // request timeout
})

// request interceptor
service.interceptors.request.use(
  (config) => {
    let token = localStorage.getItem('access_token')
    if (token) {
      config.headers['Authorization'] = 'Basic c2FiZXI6c2FiZXJfc2VjcmV0' // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
      config.headers['Blade-Auth'] = token // 让每个请求携带token-- ['X-Token']为自定义key 请根据实际情况自行修改
    }
    return config
  },
  (error) => {
    Promise.reject(error)
  }
)

// respone interceptor
service.interceptors.response.use(
  // response => response,
  (response) => {
    const res = response.data
    return res
  },
  (error) => {
    if (error.response.data.code == 401) {
      if (isRefreshing) {
        isRefreshing = false
        return refreshToken()
          .then((res) => {
            const data = res.data
            if (data.access_token) {
              localStorage.setItem('access_token', data.access_token)
              // 已经刷新了token，将所有队列中的请求进行重试
              window.location.reload()
            } else {
              return false
            }
          })
          .catch(() => {
            return false
          })
          .finally(() => {
            isRefreshing = true
          })
      }
    }
    return Promise.reject(error)
  }
)

// 刷新token请求
function refreshToken() {
  return axios.post(
    `${devIp}/api/blade-auth/oauth/token?tenantId=000000&username=DP001&password=efc3d451b28e58fdbffde31ec4c37b86&grant_type=password&scope=all&type=account`,
    null,
    {
      headers: {
        'Tenant-Id': '000000',
        Authorization: 'Basic c2FiZXI6c2FiZXJfc2VjcmV0'
      }
    }
  )
}

export default service
