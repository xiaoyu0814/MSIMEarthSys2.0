import http from '../request/http'

// 根据阵营获取当前场景中的平台编组树接口
export const groupConfigTree = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCalculation}/scenario/force/construction/groupConfig/tree`,
    params
  })
}
