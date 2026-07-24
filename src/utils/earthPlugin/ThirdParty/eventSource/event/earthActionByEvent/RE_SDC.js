/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-04-07 14:02:12
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2024-05-20 16:52:23
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
  const initSDCLine = (json) => {
    let showcheck = store.state.sceneModule.sceneLinkConfig.radarDetect
    if (typeof json.Line === 'undefined') {
      json.Line = [0, 0, 0, 255]
    }
    //let curColor = [0, 0, 0, 1]
    let colorC = new window.MSIMEarth.Color(0.9, 0.5, 0.2, 1)
    // if (json.Line) {
    //   curColor = json.Line
    // }
    // let colorC = new window.MSIMEarth.Color(
    //   curColor[0] / 255,
    //   curColor[1] / 255,
    //   curColor[2] / 255,
    //   curColor[3] / 255
    // )
    sceneAction.connectLineManagement.addLine({
      sourId: json.Data.EN,
      targetId: json.Data.TN,
      color: colorC,
      type: 'RE_SDC',
      width: 12,
      mix: 1.0,
      show: showcheck
    })
  }

  const dropSDCLine = (json) => {
    sceneAction.connectLineManagement.removeStrikePlan({
      sourId: json.Data.EN,
      targetId: json.Data.TN,
      type: 'RE_SDC'
    })
  }

  return { initSDCLine, dropSDCLine }
}
