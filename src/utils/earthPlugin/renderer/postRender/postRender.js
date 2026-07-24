import createVibrationStage from './vibration.js'
import createLoadStage from './load.js'

class postRender {
  constructor(Earth, viewer) {
    this.Earth = Earth
    this.viewer = viewer
  }
  /**
   * 创建震动效果后处理
   * @param {*} postProcessStages 容器
   * @param {*} time 执行时长
   */
  createVibration(postProcessStages, time) {
    if (typeof time === 'undefined') {
      time = 1000
    }
    const vibration = createVibrationStage(this.Earth)
    postProcessStages.add(vibration)
    setTimeout(() => {
      postProcessStages.remove(vibration)
    }, time)
  }
  /**
   * 创建震动效果后处理
   * @param {*} postProcessStages 容器
   * @param {*} time 执行时长
   */
  createLoad(postProcessStages, time, callback) {
    if (typeof time === 'undefined') {
      time = 1000
    }
    const load = createLoadStage(this.Earth)
    postProcessStages.add(load)
    setTimeout(() => {
      postProcessStages.remove(load)
      if (callback) {
        callback()
      }
    }, time)
  }
}
export default postRender
