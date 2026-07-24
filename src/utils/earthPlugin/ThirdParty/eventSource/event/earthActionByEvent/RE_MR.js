/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-04-07 14:02:12
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2024-05-23 10:54:22
 * @FilePath: \MSIMEarthSysN\src\utils\earthPlugin\ThirdParty\eventSource\event\earthActionByEvent\RE_MR.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import store from '@/store'
import { join } from 'lodash'
import createLineMessage from './actionConfig'

const option = {
  earth: window.MSIMEarth,
  viewer: window.EarthViewer
}

export default function () {
  const sceneAction = new window.EarthPlugn.sceneAction(option)
  const initMRLine = (json) => {
    if (typeof json.Line === 'undefined') return

    let colorC = new window.MSIMEarth.Color(1.0, 0, 0, 0.7)
    // let curColor = [0, 0, 0, 0]
    // if (json.Line) {
    //   curColor = json.Line
    // }
    // let colorC = new window.MSIMEarth.Color(
    //   curColor[0] / 255,
    //   curColor[1] / 255,
    //   curColor[2] / 255,
    //   curColor[3] / 255
    // )
    // if (json.Data.RPN == 'BB_beidou' || json.Data.XPN == 'BB_beidou') {
    //   colorC = window.MSIMEarth.Color.RED
    // } else if (json.Data.RPN == 'BB_A51' || json.Data.XPN == 'BB_A51') {
    //   colorC = new window.MSIMEarth.Color(0, 1.0, 1.0, 1.0)
    // }
    let side = getSideByXPN(json.Data.XPN)
    sceneAction.connectLineManagement.addLine({
      sourId: json.Data.XPN,
      targetId: json.Data.RPN,
      color: colorC,
      type: json.Type,
      side: side,
      width: 10,
      speed: 2, //json.Data.speed ? json.Data.speed : 5,
      show: store.state.sceneModule.sceneLinkConfig.networkCommunication,
      mix: 1.0,
      repeat: 4
    })
  }

  const dropMRLine = (json) => {
    sceneAction.connectLineManagement.removeStrikePlan({
      sourId: json.Data.XPN,
      targetId: json.Data.RPN,
      type: 'RE_MR'
    })
  }

  /**
   * 获取实体阵营
   * @param {string} id
   * @description 通过id获取实体并进一步确认阵营
   */
  const getSideByXPN = (id) => {
    let entity = window.EarthPlugn.entity._GetCZMLEntity(
      id,
      'MSIMEarthCZMLProcessContainer'
    )
    if (typeof entity === 'undefined') return 'white'
    let side
    if (entity.properties.side && entity.properties.side._value) {
      side = entity.properties.side._value
    }
    if (
      entity.properties.airplaneAction &&
      entity.properties.airplaneAction._value.side
    ) {
      side = entity.properties.airplaneAction._value.side
    }

    return side
  }

  return { initMRLine, dropMRLine }
}
