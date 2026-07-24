/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-04-07 14:02:12
 * @LastEditors: yuqiangqiang yqq@piesat.cn
 * @LastEditTime: 2024-08-23 11:51:54
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
    //let curColor = [0, 0, 0, 1]
    let colorC = new window.MSIMEarth.Color(0, 0, 1, 1)
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
    // sceneAction.connectLineManagement.addDashLine({
    //   sourId: json.Data.sName,
    //   targetId: json.Data.tName,
    //   color: colorC,
    //   side: json.Data.sSide,
    //   type: 'RE_WeaponF',
    //   width: 3, // 10
    //   show: showcheck
    // })
    // 如果 showcheck 为true则附加消息提示
    // if (showcheck) {
    //   createTrackMessage(json)
    // }
  }

  const dropSTrackLine = (json) => {
    sceneAction.connectLineManagement.removeStrikePlan({
      sourId: json.Data.sName,
      targetId: json.Data.tName,
      type: 'RE_STrackInit'
    })
  }

  /**
   * 传感器类信息弹窗
   * @param {json} json 传感器及探测信息
   * @returns
   */
  const createTrackMessage = (json) => {
    // 需要去除弹
    let sourceEntity =
      window.EarthPlugn.entity._GetCZMLEntity(
        json.Data.sName,
        'MSIMEarthCZMLProcessContainer'
      ) || window.EarthViewer.entities.getById(json.Data.sName)
    if (
      !window.MSIMEarth.defined(sourceEntity) ||
      !window.MSIMEarth.defined(sourceEntity.position)
    )
      return
    let entityPos = sourceEntity.position._value
      ? sourceEntity.position._value
      : sourceEntity.position.getValue(window.EarthViewer.clock.currentTime)
    if (window.MSIMEarth.defined(entityPos)) {
      let cartographic = window.MSIMEarth.Cartographic.fromCartesian(entityPos)
      let lat = window.MSIMEarth.Math.toDegrees(cartographic.latitude)
      let lng = window.MSIMEarth.Math.toDegrees(cartographic.longitude)
      window.sceneAction.systemMessage.labelMessage({
        sysMessageId: 'RE_LTrackInit_sysMessage' + json.Data.sName,
        sysMessagePosition: [lng, lat, 500],
        fontSize: 'normal 32px MicroSoft YaHei',
        sysMessageText: `探测到${json.Data.tLabelName}`,
        sysFillColor: [16 / 255, 231 / 255, 142 / 255, 1]
      })
    }
  }

  return { initSTrackLine, dropSTrackLine }
}
