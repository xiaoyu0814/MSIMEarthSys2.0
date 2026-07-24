/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-11-14 16:57:40
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2024-06-17 14:05:49
 * @FilePath: \vue3+js+vite\src\api\adjustControl\document.js
 * @Description: 文电通讯接口配置
 */
// import request from "@/api/http";
import http from '@/service/request/http'
import { URL_CJ } from '../request/config'
// 根据模板名称查询
export function getDocumentByName(params, headers) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/documentTemplate/v1/getDocumentByName`,
    headers,
    method: 'get',
    params: params
  })
}

// 删除模板
export function delDocument(params, headers) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/documentTemplate/delDocument`,
    headers,
    method: 'get',
    params: params
  })
}

// 打开模板
export function readDocument(params, headers) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/documentTemplate/readDocument`,
    headers,
    method: 'get',
    params: params
  })
}

// 打开模板
export function readDocumentTwo(params, headers) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/documentTemplate/readDocumentTwo`,
    headers,
    method: 'get',
    params: params
  })
}

// 保存模板
export function saveDocument(params, headers) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/documentTemplate/saveDocument`,
    headers,
    method: 'post',
    data: params
  })
}

// 文件列表展示
export function getDocumentList(params, headers) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/fileInfo/v1/showFileInfo`,
    headers,
    method: 'get',
    params: params
  })
}

// 打开文件
export function readFile(params, headers) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/fileInfo/v1/readFile`,
    headers,
    method: 'get',
    params: params
  })
}

// 保存文件
export function saveFile(params, headers) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/fileInfo/v1/saveFile`,
    headers,
    method: 'post',
    data: params
  })
}

// 文件批量删除
export function deleteFile(params, headers) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/fileInfo/v1/delete`,
    headers,
    method: 'post',
    data: params
  })
}

// 发送文件
export function sendFile(params, headers) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/fileInfo/v1/sendFile`,
    headers,
    method: 'get',
    params: params
  })
}

// 接收文件
export function receiveFile(params, headers) {
  return http({
    url: `${URL_CJ}/hierarchyPlatform/fileInfo/v1/receiveFile`,
    headers,
    method: 'get',
    params: params
  })
}
