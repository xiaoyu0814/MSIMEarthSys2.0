/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-05-30 16:38:09
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2026-01-15 10:12:26
 */
import http from './request/http'
import {
  BASE_URL,
  BASE_URL_GATEWAY,
  URL_CJ,
  URL_AFSIMSCRIPT,
  simulationIp
} from './request/config'

// 关闭SSE当前用户 参数为当前所连接用户ID
export const SSEClose = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCommunication}EventSourceController/close/${params.userid}`
  })
}
// 关闭复盘-SSE当前用户 参数为当前所连接用户ID
export const SSECloseReplay = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCommunication}SseEmitterReplayController/close/${params.userid}`
  })
}
// 获取所有场景列表
export const selectAllScene = () => {
  return http({
    method: 'get',
    url: `${BASE_URL_GATEWAY}/lvc-service-middleware/simulation/v1/querySimulationList`
    // url: `http://172.15.14.72:8001/sbs-lvc-scene/scene/v1/selectSceneRecordList`
  })
}

// 获取所有场景列表2
export const selectAllSceneByPage = (data) => {
  return http({
    method: 'get',
    url: `${URL_CJ}/scenario/getByPage`,
    params: data
  })
}

// 兵力树
export const getLeftForceResult = () => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}/SceneDeterminateController/v1/getResult`
  })
}

// 获取导弹目标
export const getTargetNameByMissileName = (data) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}/SceneDeterminateController/v1/getTargetNameByMissileName`,
    // url: `/getData/SceneDeterminateController/v1/getTargetNameByMissileName`,
    params: data
  })
}

// 时间启动
export const getPAStatic = (data) => {
  return http({
    method: 'get',
    // url: `${serverUrls.serversData}/v2/getStatic`,
    url: `${serverUrls.serversData}/v2/getPAStaticByVision`,
    params: data
  })
}

// 刷新获取动态PA目标
export const getPADynamic = (data) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}/v2/getDynamic`,
    params: data
  })
}

// 获取席位方设备类型中文名称及数量
export const getEquipment = () => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}/InferResultController/v1/getEquipment`
  })
}

// 获取席位方损毁的设备类型中文名称及数量
export const getEquipmentOff = () => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}/InferResultController/v1/getEquipmentOff`
  })
}

// 无界面启动file=joint.txt  场景关闭kill=0
export const sceneControl = (params) => {
  return http({
    method: 'get',
    url: `${simulationIp}mission`,
    params
  })
}

// 有界面启动
export const interfaceStartup = (params) => {
  return http({
    method: 'get',
    url: `${simulationIp}warlock`,
    params
  })
}

// 启动afsim引擎
// export const startAFSIM = (params) => {
//   return http({
//     method: 'get',
//     url: `${URL_CJ}/hierarchyPlatform/plan/startAFSIM`,
//     params
//   })
// }
// 启动afsim引擎
export const startAFSIM = (data) => {
  return http({
    method: 'post',
    url: `${URL_AFSIMSCRIPT}/invoke/startAFSIMByScenarioScript`,
    data: data
  })
}
// 任务加载
export const startTask = (params) => {
  return http({
    method: 'get',
    url: `${URL_CJ}/hierarchyPlatform/plan/startTask`,
    params
  })
}
// 停止afsim引擎
export const stopAFSIM = () => {
  return http({
    method: 'get',
    url: `${URL_CJ}/hierarchyPlatform/plan/stopAFSIM`
  })
}
// 暂停afsim引擎
export const freezeAFSIM = () => {
  return http({
    method: 'get',
    url: `${URL_CJ}/hierarchyPlatform/plan/freezeAFSIM`
  })
}
// 继续afsim引擎
export const resumeAFSIM = () => {
  return http({
    method: 'get',
    url: `${URL_CJ}/hierarchyPlatform/plan/resumeAFSIM`
  })
}
//填充任务数据接口（落库复盘功能所需的推演数据）
export const fillTaskInfo = (data) => {
  console.log('调用了fillTaskInfo')
  return http({
    method: 'post',
    url: `${serverUrls.serversData}/simRehearsalTaskRecord/fillTaskInfo`,
    data: data
  })
}
// 获取评估页总览模块内容
export const getOverView = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCalculation}sceneRehearsalTaskData/toTheEndMessage`,
    params
  })
}
// 获取想定弹框的兵力数据
export const getResultByRefresh = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCalculation}/sceneRehearsalTaskData/getResultByRefresh`,
    params
  })
}

// 获取评估分析页面- 基本信息接口
export const getTaskInfoTaskId = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCalculation}/sceneRehearsalTaskData/getTaskInfoByTaskId`,
    params
  })
}
// 断开重连获取PA目标，发送platemove移除静态变动态消息
export const setPlateMoveCommond = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}v2/getStatic`,
    params
  })
}

// 设置场景 增加模拟器 数据
// String messageId ---> 场景ID,Boolean StartStu true--->存，false----->不存
export const StartSceneRunSetData = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.qidongMnqSjJsServerUrl}/StartSceneController/run`,
    data: data
  })
}

// 开启数据回放 UE轨迹回访
export const simulatorReplay = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.qidongMnqSjJsServerUrl}/StartSceneController/v1/simulatorReplay`,
    data: data
  })
}

// 获取模型匹配数据
export const getModelMatchingData = () => {
  return http({
    method: 'get',
    url: `./static/config/json/modelMatching.json`
  })
}

// 获取JB模型匹配数据
export const getModelMatchingDataJB = () => {
  return http({
    method: 'get',
    url: `./static/config/json/modelMatchingJB.json`
  })
}

// 获取ZZ阶段性描述信息
export const getOperationInof = () => {
  return http({
    method: 'get',
    url: `./static/config/json/operationConfig.json`
  })
}

// 获取ZZ阶段性描述信息
export const getGroupInfo = () => {
  return http({
    method: 'get',
    url: `./static/config/json/groupdata.json`
  })
}
export const getGroupInfoBlue = () => {
  return http({
    method: 'get',
    url: `./static/config/json/groupdataBlue.json`
  })
}
// 获取编辑系统生成的营编制数据
export const getBattalionInfo = () => {
  return http({
    method: 'get',
    url: `./static/config/json/JD编制/Battalion.json`
  })
}

// 获取编辑系统生成的连编制数据 暂时包含所有类型连队（常规company 炮兵Battery）
export const getCompanyInfo = () => {
  return http({
    method: 'get',
    url: `./static/config/json/JD编制/company.json`
  })
}

// 获取装备编组列表
export const getInfoTree = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCalculation}groupConfiguration/v1/getInfoTree`,
    params
  })
}

// 获取装备编组列表
export const getAllEntityInfo = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}/scene/scenario/getAllEntityInfo`,
    params
  })
}

// 获取平台信息
export const getPlatformInfo = () => {
  return http({
    method: 'get',
    url: `./static/config/json/platform.json`
  })
}

//匹配传感器中文名称
export const getSensorMatching = () => {
  return http({
    method: 'get',
    url: `./static/config/json/sensorMatching.json`
  })
}

//获取任务
export const getInfoByPlatName = (data) => {
  return http({
    url: `${serverUrls.serversCalculation}/task/v1/getInfoByPlatName`,
    method: 'get',
    params: data
  })
}

// 根据阵营获取当前场景中的平台编组树接口
export const getPlatStatusGroupTreeBySide = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversData}/scene/v1/getPlatStatusGroupTreeBySide`,
    params
  })
}

// 获取logo日志
export const getLogoLog = (url) => {
  return http({
    method: 'get',
    url: url
  })
}
