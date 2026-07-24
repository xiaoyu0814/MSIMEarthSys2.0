/*
 * @Author: root you@example.com
 * @Date: 2024-08-12 15:46:17
 * @LastEditors: root you@example.com
 * @LastEditTime: 2024-08-12 15:48:26
 * @FilePath: \MSIMEarthSysN时间同步\src\utils\earthPlugin\ThirdParty\eventSource\event\earthEvent\system\system.js
 * @Description: 封装一些针对系统性能配置的方法
 */

export default function () {
  // 计算帧率
  const computeFPS = () => {
    const currentTime = Date.now()
    const deltaTime = currentTime - lastTime
    if (deltaTime > 1000) {
      EarthAPP.fps = (frameCount * 1000) / deltaTime
      lastTime = currentTime
      frameCount = 0
    } else {
      frameCount++
    }
  }
  return {
    computeFPS
  }
}
