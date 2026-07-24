import http from '../request/http'
import { URL_CJ } from '../request/config'

// 获取想定列表
export function getXDList(data) {
  return http({
    url: URL_CJ + '/hierarchyPlatform/scenario/getByPage',
    method: 'get',
    params: data
  })
}

//上传缩略显示图
export function uploadPic(data) {
  return http({
    url: URL_CJ + '/hierarchyPlatform/scenario/uploadPic',
    method: 'post',
    headers: { 'Content-Type': 'multipart/form-data' },
    data: data
  })
}

//创建想定
export function createXD(data) {
  return http({
    url: URL_CJ + '/hierarchyPlatform/scenario/add',
    method: 'post',
    data: data
  })
}

//想定编辑
export function updateXD(data) {
  return http({
    url: URL_CJ + '/hierarchyPlatform/scenario/update',
    method: 'post',
    data: data
  })
}

//下载想定
export function downloadXD(data) {
  return http({
    url: URL_CJ + '/hierarchyPlatform/scenario/v1/download',
    method: 'get',
    params: data
  })
}

//根据id查询
export function getMissionByid(data) {
  return http({
    url: URL_CJ + '/hierarchyPlatform/scenario/getById',
    method: 'get',
    params: data
  })
}
