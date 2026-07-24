/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-04-07 14:02:12
 * @LastEditors: ZX Li
 * @LastEditTime: 2025-12-19 15:09:00
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
  const initTrackLine = (json) => {
    let showCheck = store.state.sceneModule.sceneLinkConfig.localTracking
    //配置时间，基于SourceTrackID
    let msgSource = '',
      type = 'SDC',
      color = '#ff0000', //'#0a78e9ba',
      msgSource2 = '',
      type2 = 'SDC',
      color2 = '#ff0000' //'#0a78e9ba'
    switch (json.Data.SourceTrackID) {
      case 'YAOGAN':
        // 侦察探测
        msgSource = '卫星扫描'
        type = 'SDC'
        color = '#ff0000' //'#dbe90aad'
        break
      case 'dmz_2':
        msgSource = '指令上柱'
        type = 'RE_MR'
        color = '#ff0000' //'#0a78e9ba'
        break
      default:
        break
    }
    switch (json.Data.OwnPID) {
      case 'YAOGAN':
        // 侦察探测
        msgSource2 = '卫星扫描'
        type2 = 'SDC'
        color2 = '#ff0000' //'#dbe90aad'
        break
      case 'dmz_1':
        msgSource2 = '数据传输'
        type2 = 'RE_MR'
        color2 = '#ff0000' //'#0a78e9ba'
        break
      case 'dmz_2':
        msgSource2 = '数据传输'
        type2 = 'RE_MR'
        color2 = '#ff0000' //'#0a78e9ba'
        break
      default:
        break
    }
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
        color2 = '#ff0000'
        break
      case 'blue':
        color = '#00a9ff'
        color2 = '#00a9ff'
        break

      case 'green':
        color = '#54ff00'
        color2 = '#54ff00'
        break

      case 'purple':
        color = '#ab00ff'
        color2 = '#ab00ff'
        break

      default:
        break
    }

    sceneAction.connectLineManagement.addLineByRay({
      sourId: json.Data.sName,
      targetId: json.Data.tName,
      color: window.MSIMEarth.Color.fromCssColorString(color),
      type: type,
      width: 4,
      Raywidth: 8,
      mix: 1.0,
      show: showCheck,
      // show: true,
      radius: window.EarthViewer.camera.positionCartographic.height / 500,
      endOptions: {
        entityId: json.Data.tName,
        czmlSource: 'MSIMEarthCZMLProcessContainer',
        type: type,
        title: json.Data.tName,
        msg: `${msgSource}⬇⬇`,
        endPopTime: 3000 //毫秒
      },
      materialImg: require('/public/static/image/texture/jt44.png'),
      msgSource: `${msgSource}⬆⬆`,
      startPopTime: 3000 //毫秒
    })

    // if (json.Data.OwnPID === json.Data.SourceTrackID) {
    //   // 平台自身传感器探测
    //   sceneAction.connectLineManagement.addLineByRay({
    //     sourId: json.Data.sName,
    //     targetId: json.Data.tName,
    //     color: window.MSIMEarth.Color.fromCssColorString(color),
    //     type: type,
    //     width: 4,
    //     Raywidth: 8,
    //     mix: 1.0,
    //     show: showCheck,
    //     // show: true,
    //     radius: window.EarthViewer.camera.positionCartographic.height / 500,
    //     endOptions: {
    //       entityId: json.Data.tName,
    //       czmlSource: 'MSIMEarthCZMLProcessContainer',
    //       type: type,
    //       title: json.Data.tName,
    //       msg: `${msgSource}⬇⬇`,
    //       endPopTime: 3000 //毫秒
    //     },
    //     materialImg: require('/public/static/image/texture/jt11.png'),
    //     msgSource: `${msgSource}⬆⬆`,
    //     startPopTime: 3000 //毫秒
    //   })
    // } else {
    //   //平台通信链路组内其他平台传感器探测并将信息传给 OwnPID  具体可观察sourId和targetId的不同
    //   sceneAction.connectLineManagement.addLineByRay({
    //     sourId: json.Data.SourceTrackID,
    //     targetId: json.Data.tName,
    //     color: window.MSIMEarth.Color.fromCssColorString(color),
    //     type: type,
    //     width: 4,
    //     Raywidth: 8,
    //     mix: 1.0,
    //     show: showCheck,
    //     // show: true,
    //     radius: window.EarthViewer.camera.positionCartographic.height / 500,
    //     endOptions: {
    //       entityId: json.Data.tName,
    //       czmlSource: 'MSIMEarthCZMLProcessContainer',
    //       type: type,
    //       title: json.Data.tName,
    //       msg: `${msgSource}⬇⬇`,
    //       endPopTime: 3000 //毫秒
    //     },
    //     materialImg: require('/public/static/image/texture/jt44.png'),
    //     msgSource: `${msgSource}⬆⬆`,
    //     startPopTime: 3000 //毫秒
    //   })
    //   // setTimeout(() => {
    //   //   sceneAction.connectLineManagement.addLineByRay({
    //   //     sourId: json.Data.SourceTrackID,
    //   //     targetId: json.Data.OwnPID,
    //   //     color: window.MSIMEarth.Color.fromCssColorString(color2),
    //   //     type: type2,
    //   //     width: 4,
    //   //     Raywidth: 8,
    //   //     mix: 1.0,
    //   //     show: showCheck,
    //   //     // show: true,
    //   //     radius: window.EarthViewer.camera.positionCartographic.height / 500,
    //   //     endOptions: {
    //   //       entityId: json.Data.OwnPID,
    //   //       czmlSource: 'MSIMEarthCZMLProcessContainer',
    //   //       type: type2,
    //   //       title: json.Data.OwnPID,
    //   //       msg: `${msgSource2}⬇⬇`,
    //   //       endPopTime: 3000 //毫秒
    //   //     },
    //   //     materialImg: require('/public/static/image/texture/jt11.png'),
    //   //     msgSource: `${msgSource2}⬆⬆`,
    //   //     startPopTime: 3000 //毫秒
    //   //   })
    //   // }, 1000)
    // }
    createLineMessage(json, 'RE_LTrackInit_sysMessage')
  }

  const dropTrackLine = (json) => {
    //let tracktype = `RE_LTrackInit_${json.LineEnumeratorNum}`
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

  return { initTrackLine, dropTrackLine }
}
