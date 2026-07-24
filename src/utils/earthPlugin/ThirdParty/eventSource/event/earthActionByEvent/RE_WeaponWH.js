/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-05-07 11:26:41
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2024-05-08 14:22:36
 * @FilePath: \MSIMEarthSysN\src\utils\earthPlugin\ThirdParty\eventSource\event\earthActionByEvent\RE_WeaponWH.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import store from '@/store'

const option = {
  earth: window.MSIMEarth,
  viewer: window.EarthViewer
}

export default function () {
  const sceneAction = new window.EarthPlugn.sceneAction(option)
  const initWeaponWHLine = (json) => {
    let showcheck = store.state.sceneModule.sceneLinkConfig.targetKill
    if (typeof json.Line === 'undefined') {
      json.Line = [0, 0, 0, 255]
    }
    // let curColor = [0, 0, 0, 255]
    // let colorC = new window.MSIMEarth.Color(
    //   curColor[0] / 255,
    //   curColor[1] / 255,
    //   curColor[2] / 255,
    //   curColor[3] / 255
    // )
    let colorC = new window.MSIMEarth.Color(1, 0, 0, 1)
    sceneAction.connectLineManagement.addLine({
      sourId: json.Data.sName,
      targetId: json.Data.tName,
      color: colorC,
      type: 'RE_WeaponWH',
      width: 12,
      show: showcheck
    })
  }

  const dropWeaponWHLine = (json) => {
    sceneAction.connectLineManagement.removeStrikePlan({
      sourId: json.Data.sName,
      targetId: json.Data.tName,
      type: 'RE_WeaponWH'
    })
  }

  return { initWeaponWHLine, dropWeaponWHLine }
}
