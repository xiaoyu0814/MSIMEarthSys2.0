var url1 = '' // 正式接口
var url2 = '' // 调试接口
var ip = process.env.NODE_ENV === 'production' ? '' : ''

export const devIp = ip
export const testIp = ip
export const timing = 10000
