/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-05-31 19:28:32
 * @LastEditors: ZX Li
 * @LastEditTime: 2024-06-01 15:12:20
 */
/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-02-22 10:36:49
 * @LastEditors: ZX Li
 * @LastEditTime: 2024-02-22 10:38:41
 */
import http from './request/http'
import { BASE_URL } from './request/config'
//消息中间件
//根据席位获取交换机列表
export const getExchangeList = (params) => {
  return http({
    method: 'get',
    url: `${serverUrls.serversCommunication}/data/sim-topic-mgt/v1/getSimTopicSeatRelationList`,
    params
  })
}
/*
 *设置通信模式
 *isTopic:（true:交换机通信；false:SSE通信）
 */
export const changeInforType = (params) => {
  return http({
    method: 'post',
    url: `${serverUrls.serversCommunication}/data/sim-topic-mgt/v1/setTopicSchema`,
    params
  })
}
