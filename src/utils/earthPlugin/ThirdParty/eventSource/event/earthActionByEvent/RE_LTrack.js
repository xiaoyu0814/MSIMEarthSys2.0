/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-04-07 14:02:12
 * @LastEditors: chenguopeng2 chenguopeng.piesat.cn
 * @LastEditTime: 2026-08-11 16:21:53
 * @FilePath: \MSIMEarthSysN\src\utils\earthPlugin\ThirdParty\eventSource\event\earthActionByEvent\RE_LTrack.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import store from '@/store'
import LocalCache from '@/utils/earthPlugin/ThirdParty/storageManagement/localStorage.js'
import { join } from 'lodash'
import { createLineMessage } from './actionConfig'

const option = {
  earth: window.MSIMEarth,
  viewer: window.EarthViewer
}

export default function () {
  const sceneAction = new window.EarthPlugn.sceneAction(option)
  const initLTrackLine = (json) => {
    let showCheck = store.state.sceneModule.sceneLinkConfig.localTracking
    let color  = '#ff0000'
    let side = json.Data.sSide
    let curSide = window.EarthPlugn.entity._GetCZMLEntitySide(
      json.Data.sName,
      'MSIMEarthCZMLProcessContainer'
    )
    if (typeof curSide !== 'undefined') {
      side = curSide
    }
    switch (side) {
      case 'red':
        color = '#ff0000'
        break
      case 'blue':
        color = '#00a9ff'
        break

      case 'green':
        color = '#54ff00'
        break

      case 'purple':
        color = '#ab00ff'
        break
      default:
        break
    }
    sceneAction.connectLineManagement.addLineByRay({
      sourId: json.Data.sName,
      targetId: json.Data.tName,
      color: window.MSIMEarth.Color.fromCssColorString(color),
      type: 'RE_LTrackInit',
      width: 4,
      Raywidth: 8,
      mix: 1.0,
      show: showCheck,
      radius: window.EarthViewer.camera.positionCartographic.height / 500,
      endOptions: {
        entityId: json.Data.tName,
        czmlSource: 'MSIMEarthCZMLProcessContainer',
        type: 'RE_LTrackInit',
        title: json.Data.tName,
        endPopTime: 3000 //毫秒
      },
      startPopTime: 3000 //毫秒
    })

    createLineMessage(json, 'RE_LTrackInit_sysMessage')
  }

  const dropLTrackLine = (json) => {
    sceneAction.connectLineManagement.removeStrikePlan({
      sourId: json.Data.sName,
      targetId: json.Data.tName,
      type: 'RE_LTrackInit'
    })
    let sensor = new window.EarthPlugn.sensor({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
    let removeEW_Radar = sensor.removeSensorEW_RadarJam()
    removeEW_Radar({ id: json.Data.tName })
  }

  return { initLTrackLine, dropLTrackLine }
}
