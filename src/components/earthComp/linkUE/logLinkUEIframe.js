/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-04-23 14:24:23
 * @LastEditors: ZX Li
 * @LastEditTime: 2024-04-28 15:41:00
 */
//web端渲染ue
import { moveCamera } from '@/service/directingAdjusting'
import store from '@/store/index'
//创建UE渲染连接
export const linkUEIframe = function (options, callback) {
  let { loadPixelStream, restartStream } = ueStreamApp('iframe-play-ue5')
  //通过后台接口给UE发送参数
  moveCamera(options).then((res) => {
    if (res.code == 200) {
      if (!store.state.sceneModule.showUEContainer) {
        loadPixelStream(UEConfigUrl.ueWsUrl) //与UE建立连接
      }
      callback()
    }
  })
}
//关闭UE渲染连接
export const closeUEIfram = function (callback) {
  let { closeStream } = ueStreamApp('iframe-play-ue5')
  closeStream('iframe-play-ue5') //关闭视频流
  callback()
}
