/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-06-05 10:46:50
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2026-05-28 09:46:21
 * @FilePath: \MSIMEarthSysNHFY\src\utils\earthPlugin\ThirdParty\eventSource\event\earthEvent\sceneTime\seaAirJointOperationsSceneTime.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import store from '@/store'
import emitter from '@/utils/eventbus'

export default function () {
  const getSceneTime = (time) => {
    store.state.AFSIMModule.ATValue = time.T //保存当前仿真引擎提供的已执行时间（秒数）
    let curTime = store.getters.getSceneTime
    let startTime = new Date(curTime).getTime()
    startTime += time.T * 1000
    store.commit('setMsgMessionTime', getSpeTime(startTime))
    emitter.emit('AT', time)
    if (window.EarthViewer) {
      if (!store.state.AFSIMModule.fp) {
        window.EarthViewer.clock.multiplier = time.R //可能会影响复盘
        store.state.sceneModule.multiplier = time.R
      }
      // 追加时间同步
      let startTime = store.getters.getSceneStartTime
      try {
        let timeArr = startTime.split(' ')
        let jTime = timeArr[0] + 'T' + timeArr[1] + 'Z'
        let newTime = window.MSIMEarth.JulianDate.addSeconds(
          window.MSIMEarth.JulianDate.fromIso8601(jTime),
          time.T,
          new window.MSIMEarth.JulianDate()
        )
        // window.EarthViewer.clock.currentTime =
        //   window.MSIMEarth.JulianDate.fromIso8601(newTime)
      } catch (error) {}
    }
  }
  // getSimulationState接口的回调函数  目前尚未替换，可考虑 AT消息使用getSceneTime更新时间 getSimulationState接口使用getSceneTimeForSimulationState更新window.EarthViewer.clock.multiplier
  const getSceneTimeForSimulationState = (time) => {
    store.state.AFSIMModule.ATValue = time.T //保存当前仿真引擎提供的已执行时间（秒数）
    let curTime = store.getters.getSceneTime
    let startTime = new Date(curTime).getTime()
    startTime += time.T * 1000
    store.commit('setMsgMessionTime', getSpeTime(startTime))
    if (window.EarthViewer) {
      window.EarthViewer.clock.multiplier = time.R //可能会影响复盘
      store.state.sceneModule.multiplier = time.R
      // 追加时间同步
      let startTime = store.getters.getSceneStartTime
      try {
        let timeArr = startTime.split(' ')
        let jTime = timeArr[0] + 'T' + timeArr[1] + 'Z'
        let newTime = window.MSIMEarth.JulianDate.addSeconds(
          window.MSIMEarth.JulianDate.fromIso8601(jTime),
          time.T,
          new window.MSIMEarth.JulianDate()
        )
        // window.EarthViewer.clock.currentTime =
        //   window.MSIMEarth.JulianDate.fromIso8601(newTime)
      } catch (error) {}
    }
  }
  // 毫秒转日期
  const getSpeTime = (timeStr) => {
    let time = new Date(timeStr)
    var year = time.getFullYear()
    var month =
      time.getMonth() + 1 < 10
        ? '0' + (time.getMonth() + 1)
        : time.getMonth() + 1
    var date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
    var hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
    var minutes =
      time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
    var seconds =
      time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()
    return (
      year +
      '-' +
      month +
      '-' +
      date +
      ' ' +
      hours +
      ':' +
      minutes +
      ':' +
      seconds
    )
  }
  return { getSceneTime }
}
