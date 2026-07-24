/*
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-03-29 11:27:47
 * @LastEditors: yuqiangqiang yqq@piesat.cn
 * @LastEditTime: 2024-08-25 14:08:08
 * @FilePath: \MSIMEarthSysN\src\utils\earthPlugin\ThirdParty\eventSource\event\earthActionByEvent\RE_WeaponF.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import ConnectLine from '@/utils/earthPlugin/core/actionController/connectLineController'
import store from '@/store'

const option = {
  earth: window.MSIMEarth,
  viewer: window.EarthViewer
}

export default function () {
  const sceneAction = new window.EarthPlugn.sceneAction(option)
  const initWeaponFLine = (json) => {
    if (json.Data.WPName === json.Data.tName) return // 如果武器和目标相同，不创建线
    let color = lineColorConfig[json.Type]
    let colorC = new window.MSIMEarth.Color(
      color[0] / 255,
      color[1] / 255,
      color[2] / 255,
      0.5
    )
    json.Data.sSide = configWeapenPlateformCSV(json.Data.WPName).camp //后期仿真引擎阵营完善后可以去掉
    console.log('武器阵营', json.Data.sSide)
    setTimeout(() => {
      // console.log('json.Data.sName', json.Data.sName)
      // sceneAction.connectLineManagement.addDashLine({
      //   sourId: json.Data.WPName,
      //   targetId: json.Data.tName,
      //   color: colorC,
      //   side: json.Data.sSide,
      //   type: 'RE_WeaponF',
      //   width: 3, // 10
      //   show: store.state.sceneModule.sceneLinkConfig.fireHitting
      // })
      sceneAction.connectLineManagement.addLine({
        sourId: json.Data.WPName,
        targetId: json.Data.tName,
        color: colorC,
        side: json.Data.sSide,
        type: 'RE_WeaponF',
        width: 12,
        mix: 1,
        show: store.state.sceneModule.sceneLinkConfig.fireHitting
      })
      sceneAction.connectLineManagement.distanceLabel({
        sourId: json.Data.WPName,
        targetId: json.Data.tName,
        color: colorC,
        type: 'RE_WeaponF',
        show: store.state.sceneModule.sceneLinkConfig.fireHitting
      })
    }, 10)
  }

  // 从平台CSV配置文件获取阵营，后期仿真引擎完善后可以去掉
  const configWeapenPlateformCSV = (dataName) => {
    // 获取模型中文名称配置
    const plateformCSV = store.state.sceneModule.modelCHNNameValue
    // 基于dataName匹配数据
    const plateformCSVInfo = plateformCSV[dataName]

    // 检查匹配结果，确保安全返回name字段
    if (
      plateformCSVInfo &&
      typeof plateformCSVInfo === 'object' &&
      'camp' in plateformCSVInfo
    ) {
      return plateformCSVInfo
    }
  }

  return { initWeaponFLine }
}
