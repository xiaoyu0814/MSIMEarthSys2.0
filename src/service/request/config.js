/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-05-07 13:06:01
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2025-09-18 13:39:35
 * @FilePath: \MSIMEarthSysN\src\service\request\config.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */

let BASE_URL = `http://${baseUrl8505}/` // 初始开发时后台提供的操控仿真端的接口地址，也是SSE连接时使用的地址
let BASE_URL_GATEWAY = `http://${baseUrl8505}` // 网关
let BASE_URL_VOICE = `http://${baseUrl8505}/` // 语音控制  导调控制
let BASE_URL_DATAFUSION = `http://10.15.2.11:8900` // 多元数据融合索引服务--战场环境   //不确定是否还在使用
let WS_PATH = `ws://${baseUrl8503}/websocket/${1234}` //不确定是否还在使用
let VIDEO_URL = `http://${baseUrl8504}/` // 音视频端口
let URL_CJ = `http://${baseUrl9080}` //
let URL_CJBJ = `http://${baseUrl9001}` // 场景编辑（qb席目标类别和型号）
let URL_VEDIOCHAT = `http://${baseUrl8504}` // 视频聊天
let BASE_URL_XiControl = `ws://${baseUrl9205}` //消息
let websocketUrl_message = BASE_URL_XiControl + '/imserver' // 消息
let BASE_URL_FILEControl = `ws://${baseUrl9024}` //文书通信
let simulationIp = `http://` //仿真端ip   //不确定是否还在使用
let URL_AFSIMSCRIPT = `http://${baseUrlAFSIMSCRIPT}` //
let websocketUrl_document = BASE_URL_FILEControl + `/websocket`
const TIME_OUT = 10000
if (process.env.NODE_ENV === 'development') {
  BASE_URL_GATEWAY = '/gateway' //http://172.16.100.204:8505
  BASE_URL_VOICE = '/voiceControl' //http://172.16.100.204:8505
  VIDEO_URL = `/dev-api`
}

export {
  BASE_URL,
  // BASE_URL_TIME,
  WS_PATH,
  TIME_OUT,
  BASE_URL_GATEWAY,
  BASE_URL_VOICE,
  BASE_URL_DATAFUSION,
  URL_CJ,
  BASE_URL_FILEControl,
  websocketUrl_message,
  websocketUrl_document,
  simulationIp,
  URL_CJBJ,
  URL_VEDIOCHAT,
  VIDEO_URL,
  URL_AFSIMSCRIPT
}
