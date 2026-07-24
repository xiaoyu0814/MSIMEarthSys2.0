import store from '@/store'
import { join } from 'lodash'

export default function () {
  const initMissileIntercept = (json) => {
    let colorC = new window.MSIMEarth.Color(1, 1, 1, 1)

    let firstp = [120.66555000090091, 27.897855555335, 6]
    let lastp = [97.35416418318471, 38.52803626872026, 10]
    let height = 511285.13680355716
    window.EarthViewer.entities.add({
      id: 'raderda',
      show: false,
      position: window.MSIMEarth.Cartesian3.fromDegrees(
        97.51452383590536,
        38.29058555310779,
        10
      ),
      point: {
        color: window.MSIMEarth.Color.RED
      }
    })
    window.sceneAction.planeCzmlManage.sensorRange({
      sourId: 'raderda',
      type: 'SUU',
      radius: 900000,
      side: 'red',
      show: true
    })
    // window.sceneAction.planeCzmlManage.setPointLabel({
    //   id: 'ljd1',
    //   position: [json.Data.FI_Lon, json.Data.FI_Lat, json.Data.FI_Alt],
    //   text: '拦截窗口点',
    //   color: [220, 184, 98]
    // })
    window.sceneAction.planeCzmlManage.setPointLabel({
      id: 'ljd2',
      position: [
        json.Data.InterPoint_Lon,
        json.Data.InterPoint_Lat,
        json.Data.InterPoint_Alt
      ],
      text: '拦截点',
      color: [220, 184, 98]
    })
    // window.sceneAction.planeCzmlManage.setPointLabel({
    //   id: 'strikePot',
    //   position: [json.Data.TI_Lon, json.Data.TI_Lat, json.Data.TI_Alt],
    //   text: '撞击点',
    //   color: [255, 0, 0]
    // })
    // window.sceneAction.planeCzmlManage.setPointLabel({
    //   id: 'strikePot',
    //   position: [json.Data.LI_Lon, json.Data.LI_Lat, json.Data.LI_Alt],
    //   text: 'LI点',
    //   color: [255, 0, 0]
    // })
    // window.sceneAction.planeCzmlManage.setPointLabel({
    //   id: 'strikePot',
    //   position: [json.Data.TA_Lon, json.Data.TA_Lat, json.Data.TA_Alt],
    //   text: '最高点',
    //   color: [255, 0, 0]
    // })
  }

  return { initMissileIntercept }
}
