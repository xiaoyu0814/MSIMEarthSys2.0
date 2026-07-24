/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-04-07 14:02:12
 * @LastEditors: ZX Li
 * @LastEditTime: 2025-09-04 10:56:52
 * @FilePath: \MSIMEarthSysN\src\utils\earthPlugin\ThirdParty\eventSource\event\earthActionByEvent\RE_LTrack.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import store from '@/store'

import {
  getPlatformSensorVolumes,
  getPlatformJammerVolumes
} from '@/service/afsim'
import { filter } from 'lodash'

const option = {
  earth: window.MSIMEarth,
  viewer: window.EarthViewer
}

export default function () {
  const sceneAction = new window.EarthPlugn.sceneAction(option)
  const initJamATrackLine = (json) => {
    let showcheck = store.state.sceneModule.sceneLinkConfig.electInterference
    if (typeof json.Line === 'undefined') {
      json.Line = [0, 0, 0, 255]
    }
    // 将干扰对象存储到当前场景干扰对象数组中
    configJamPlateform(json.Data.tName)
    changeJamAMaterial(json.Data.tName, true)
    //let curColor = [0, 0, 0, 1]
    let colorC = new window.MSIMEarth.Color(0, 1, 0, 1)
    // if (json.Line) {
    //   curColor = json.Line
    // }
    // let curColor = [0, 0, 0, 1]
    // if (json.Line) {
    //   curColor = json.Line
    // }
    // let colorC = new window.MSIMEarth.Color(
    //   curColor[0] / 255,
    //   curColor[1] / 255,
    //   curColor[2] / 255,
    //   curColor[3] / 255
    // )
    let side = getSideBySname(json.Data.sName)
    sceneAction.connectLineManagement.addLine({
      sourId: json.Data.sName,
      targetId: json.Data.tName,
      color: colorC,
      side: side,
      type: 'RE_JamA',
      width: 20,
      show: showcheck
    })
  }

  const dropJamATrackLine = (json) => {
    sceneAction.connectLineManagement.removeStrikePlan({
      sourId: json.Data.sName,
      targetId: json.Data.tName,
      type: 'RE_JamA'
    })
    dropJamPlateform(json.Data.tName)
    changeJamAMaterial(json.Data.tName, false)
  }
  /**
   * 获取实体阵营
   * @param {string} id
   * @description 通过id获取实体并进一步确认阵营
   */
  const getSideBySname = (id) => {
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
  // 配置被干扰目标集合
  const configJamPlateform = (tName) => {
    let curJamArr = store.state.AFSIMModule.jamArr
    let push = true
    curJamArr.forEach((e) => {
      if (e === tName) {
        push = false
        return
      }
    })
    if (push) {
      store.state.AFSIMModule.jamArr.push(tName)
    }
  }
  // 改变被干扰目标材质（从没被干扰到被干扰）
  const changeJamAMaterial = (tName, jamAShow) => {
    // 目前只针对霍克雷达，后续如果扩展需要优化
    let frustumId = 'ew_radar_sensor_ellipse' + tName
    let entityTarget = window.EarthPlugn.entity._GetCZMLEntity(
      frustumId,
      'MSIMEarthCZMLProcessContainer'
    )
    // let side = 'white'
    // if (entityTarget.properties.side) {
    //   switch (entityTarget.properties.side._value) {
    //     case 'red':

    //       break;
    //     case 'blue':

    //       break;
    //     default:
    //       break;
    //   }
    // }
    if (entityTarget && entityTarget.ellipse) {
      if (jamAShow) {
        entityTarget.ellipse.material =
          new window.MSIMEarth.NoSignalMaterialProperty({
            transparent: true,
            color: new window.MSIMEarth.Color(
              0 / 255,
              128 / 255,
              255 / 255,
              0.3
            ),
            // color: new window.MSIMEarth.Color(80 / 255, 255 / 255, 50 / 255, 0.3),
            repeat: new window.MSIMEarth.Cartesian2(0.1, 0.1)
          }) //window.MSIMEarth.Color.BLUE.withAlpha(0.1),
      } else {
        entityTarget.ellipse.material = new window.MSIMEarth.Color(
          4 / 255,
          92 / 255,
          245 / 255,
          0.3
        )
      }
    }
  }
  // 移除被干扰的目标
  const dropJamPlateform = (tName) => {
    let curJamArr = store.state.AFSIMModule.jamArr
    let newArr = curJamArr.filter((item) => item != tName)
    store.state.AFSIMModule.jamArr = newArr
  }

  return { initJamATrackLine, dropJamATrackLine }
}
