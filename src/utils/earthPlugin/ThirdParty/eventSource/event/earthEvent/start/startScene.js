/*
 * @Author: root root@example.com
 * @Date: 2024-07-05 17:14:01
 * @LastEditors: root root@example.com
 * @LastEditTime: 2024-07-05 18:41:16
 * @FilePath: \MSIMEarthSysN\src\utils\earthPlugin\ThirdParty\eventSource\event\earthEvent\start\startScene.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEe
 */
import store from '@/store'
/**
 * 场景启动 消息回调
 * @returns
 */
export default function () {
  const handleStartScene = (json) => {
    if (json.msg && json.msg == '场景启动') {
      window.EarthViewer.scene.globe.depthTestAgainstTerrain = false // 默认深度不开始
      window.EarthPlugn.entity._ClearCZMLEntity('MSIMEarthCZMLProcessContainer')
      // 初始化球上各种标注数据
      let dataController = new window.EarthPlugn.DataControl({
        earth: window.MSIMEarth,
        viewer: window.EarthViewer
      })
      dataController.add_bblabel()
      dataController.addImportantHaiXia()
      dataController.addChina()

      let curTime = store.getters.getSceneStartTime
      try {
        let timeArr = curTime.split(' ')
        let newTime = timeArr[0] + 'T' + timeArr[1] + 'Z'
        window.EarthViewer.clock.currentTime =
          window.MSIMEarth.JulianDate.fromIso8601(newTime)
        window.EarthViewer.clock.shouldAnimate = false
      } catch (error) {
        console.log(error, '可能无法获取当前场景开始时间')
        window.EarthViewer.clock.shouldAnimate = false
      }
    }
  }
  return { handleStartScene }
}
