/*
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2025-07-10 09:59:46
 * @LastEditors: 谢小宇
 * @LastEditTime: 2025-10-13 14:38:40
 * @FilePath: \gfdx\src\service\voice.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import http from './request/http'
import { BASE_URL_GATEWAY, BASE_URL_VOICE } from './request/config'

// 录音接口
export const parseVoice = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCommunication}/voiceAi/v3/parseVoiceReply`,
    data
  })
}

//PPASR模型解析音频文件回复
export const parseVoiceReplyOfOnePlate = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCommunication}voiceAi/v3/parseVoiceReplyOfOnePlate`,
    headers: {
      'Content-Type': 'multipart/form-data'
    },
    data
  })
}
//获取所有导调接口
export const getCommandName = () => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCommunication}/textAi/v3/getCommandName`
  })
}

//PPASR模型解析音频文件回复(单架飞机指令)alt:高度，plateName:平台名称,text:文本内容
export const parseVoiceReplyOfOnePlateText = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCommunication}/textAi/v3/parseVoiceReplyOfOnePlate`,
    data
  })
}

//(单架飞机指令)file:语音文件，pltName:平台名称
export const parseVoiceFileSimulation = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.voiceUrl}/transcribe/file_simulation`,
    data
  })
}

//(单架飞机指令：流方式)file:语音文件，pltName:平台名称
export const parseVoiceStreamSimulation = (data, formData) => {
  return http({
    method: 'post',
    url: `${serverUrls.voiceUrl}/transcribe/stream_simulation`,
    data: data,
    form: formData
  })
}

//(单架飞机指令：流方式)file:语音文件，pltName:平台名称
export const parseVoiceStream = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.voiceUrl}/transcribe/stream`,
    data,
    headers: {
      'Content-Type': 'application/octet-stream'
    }
  })
}

export const parseVoiceSend = (data) => {
  return http({
    method: 'post',
    url: `${serverUrls.voiceUrl}/simulation/send`,
    data
  })
}
