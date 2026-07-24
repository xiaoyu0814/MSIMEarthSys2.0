//模糊查询地点接口
import http from './request/http'
export const getRequestNameInput = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCalculation}area/getByLikeName`,
    params
  })
}

// 根据查询条件模糊匹配中文、拼音、拼音首字母，返回融合的POI数据
export const getPoiFusionByQuery = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCalculation}/area/getPoiFusionByQuery`,
    params
  })
}
