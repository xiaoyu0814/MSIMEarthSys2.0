/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-04-07 14:02:12
 * @LastEditors: chenguopeng2 chenguopeng.piesat.cn
 * @LastEditTime: 2026-08-07 16:52:17
 * @FilePath: \MSIMEarthSysN\src\utils\earthPlugin\ThirdParty\eventSource\event\earthActionByEvent\RE_LTrack.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import store from '@/store'
/**
 * 位各种事件准备的文字提示
 * @param {json} json 链路数据源
 * @returns
 */
function createLineMessage(json, lineType) {
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
      sysMessageId: lineType + json.Data.sName,
      sysMessagePosition: [lng, lat, 500],
      fontSize: 'normal 32px MicroSoft YaHei',
      sysMessageText: `探测到${json.Data.tLabelName}`,
      sysFillColor: [16 / 255, 231 / 255, 142 / 255, 1]
    })
  }
}

function getColorBySide(side) {
  let color 
  switch (side) {
    case 'red':
      color = window.MSIMEarth.Color.RED.withAlpha(0.3)
      break
    case 'blue':
      color = window.MSIMEarth.Color.BLUE.withAlpha(0.3)
      break
    case 'green':
      color = window.MSIMEarth.Color.GREEN.withAlpha(0.3)
      break
    case 'purple':
      color = window.MSIMEarth.Color.PURPLE.withAlpha(0.3)
      break
    default:
      color = window.MSIMEarth.Color.WHITE
      break
  }
  return color
}

export { createLineMessage,getColorBySide}
export default { createLineMessage, getColorBySide}
