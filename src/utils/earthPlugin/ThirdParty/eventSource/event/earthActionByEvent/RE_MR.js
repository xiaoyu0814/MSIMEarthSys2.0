/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-04-07 14:02:12
 * @LastEditors: chenguopeng2 chenguopeng.piesat.cn
 * @LastEditTime: 2026-08-10 10:25:31
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
    let side = getSideByXPN(json.Data.XPN)
    sceneAction.connectLineManagement.addLine({
      sourId: json.Data.XPN,
      targetId: json.Data.RPN,
      color: colorC,
      type: json.Type,
      side: side,
      width: 10,
      speed: 2, 
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
