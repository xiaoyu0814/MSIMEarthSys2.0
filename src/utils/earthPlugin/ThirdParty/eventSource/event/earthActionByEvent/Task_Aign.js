/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-04-07 14:02:12
 * @LastEditors: ZX Li
 * @LastEditTime: 2025-12-19 17:39:09
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
  const initTaskAign = (json) => {
    // switch (data.Type) {
    //   case 'Track':
    //     message = `${data.SName}向${data.RName}下达追踪指令，追踪目标${data.TName}`
    //     break
    //   case 'Shoot':
    //     message = `${data.RName}针对敌方目标：${data.TName}下达打击指令，打击目标${data.TName}`
    //     break
    //   case 'CLUSTER':
    //     message = `发现目标${data.TName},${data.RName}针对敌方目标：${data.TName}下达集合指令`
    //     break

    //   default:
    //     break
    // }
    // if (json.Data.Type === 'Track' || json.Data.Type === 'ENGAGE') return
    let showcheck = store.state.sceneModule.sceneLinkConfig.taskAssociation
    if (typeof json.Line === 'undefined') {
      json.Line = [0, 0, 0, 255]
    }
    //107, 47, 12
    // let curColor = [0, 0, 0, 1]
    let sEntity = window.EarthPlugn.entity._GetCZMLEntity(
      json.Data.SName,
      'MSIMEarthCZMLProcessContainer'
    )
    // console.log(sEntity)
    let colorC
    if (sEntity?.properties?.airplaneAction?._value?.side == 'blue') {
      colorC = window.MSIMEarth.Color.BLUE.withAlpha(0.5)
    } else if (sEntity?.properties?.airplaneAction?._value?.side == 'red') {
      colorC = window.MSIMEarth.Color.RED.withAlpha(0.5)
    }

    // let colorC = window.MSIMEarth.Color.BLUE.withAlpha(0.5) //new window.MSIMEarth.Color(0.9, 0.5, 0.7, 1)
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
      sourId: json.Data.SName,
      targetId: json.Data.RName,
      color: colorC,
      type: 'Task_Aign',
      width: 12,
      show: showcheck,
      mix: 1.0
    })
  }

  const dropTaskAign = (json) => {
    sceneAction.connectLineManagement.removeStrikePlan({
      sourId: json.Data.SName,
      targetId: json.Data.TName,
      type: 'Task_Aign'
    })
  }

  return { initTaskAign, dropTaskAign }
}
