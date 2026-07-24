import http from '@/service/request/http'
//word上传
export const directDataCommand = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.wordK3Server}seat/v1/messages/distributionSeat`,
    data: data
  })
}
//word下载
export const seatPageList = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.wordK3Server}seat/v1/messages/seatPageList`,
    params
  })
}
