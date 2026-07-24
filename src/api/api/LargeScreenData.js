import request from '../request'

// 人员统计
export function login(data) {
  return request({
    url: '/api/login',
    method: 'post',
    data
  })
}
