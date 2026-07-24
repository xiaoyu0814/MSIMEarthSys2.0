import axios from 'axios'

axios.defaults.timeout = 1000 * 15

// 请求拦截器
axios.interceptors.request.use(
  (config) => {
    // config.headers.auth-session = session
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
    return Promise.reject(error)
  }
)

// 请求方法
function httpQuery(params) {
  let CancelToken = axios.CancelToken
  let source = CancelToken.source()
  let options = {
    cancelToken: source.token
  }
  options = {
    ...options,
    ...params
  }
  let _promise = new Promise((resolve) => {
    axios(options)
      .then((response) => {
        resolve({
          data: response.data
        })
      })
      .catch((error) => {
        resolve({
          error: error
        })
      })
  })
  _promise.cancel = source.cancel
  return _promise
}

export default httpQuery
