/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-04-07 14:02:12
 * @LastEditors: chenguopeng2 chenguopeng.piesat.cn
 * @LastEditTime: 2026-08-11 16:21:05
 * @FilePath: \MSIMEarthSysN\src\utils\earthPlugin\ThirdParty\eventSource\event\earthActionByEvent\RE_LTrack.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import store from '@/store'

const option = {
  earth: window.MSIMEarth,
  viewer: window.EarthViewer
}

export default function () {
  const sceneAction = new window.EarthPlugn.sceneAction(option)
  const initSTrackLine = (json) => {
    let showCheck = store.state.sceneModule.sceneLinkConfig.sensorTracking
    if (typeof json.Line === 'undefined') {
      json.Line = [0, 0, 0, 255]
    }
    let colorC = new window.MSIMEarth.Color(0, 0, 1, 1)
    sceneAction.connectLineManagement.addLine({
      sourId: json.Data.sName,
      targetId: json.Data.tName,
      side: json.Data.sSide,
      color: colorC,
      type: 'RE_STrackInit',
      width: 15,
      mix: 1.0,
      show: showCheck,
      speed: 0.5
    })
  }

  const dropSTrackLine = (json) => {
    sceneAction.connectLineManagement.removeStrikePlan({
      sourId: json.Data.sName,
      targetId: json.Data.tName,
      type: 'RE_STrackInit'
    })
  }
  
  return { initSTrackLine, dropSTrackLine }
}
