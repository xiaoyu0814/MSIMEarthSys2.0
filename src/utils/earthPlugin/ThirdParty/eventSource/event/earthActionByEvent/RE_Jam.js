import ConnectLine from '@/utils/earthPlugin/core/actionController/connectLineController'
import {
  createReJamSFrustumFun,
  removeDetectFrustum
} from '@/utils/earthPlugin/ThirdParty/cameraControl/cameraControl'
import store from '@/store'

// 创建连线类
let connectLineManage = new ConnectLine()
const option = {
  earth: window.MSIMEarth,
  viewer: window.EarthViewer
}

export default function () {
  const sceneAction = new window.EarthPlugn.sceneAction(option)
  const initJamLine = (json) => {
    let color = lineColorConfig[json.Type]
    let earthObjectConfig = store.state.sceneModule.earthObjectConfig
    let show = earthObjectConfig.findIndex((item) => item == '链路') > -1
    let colorC = new window.MSIMEarth.Color(
      color[0] / 255,
      color[1] / 255,
      color[2] / 255,
      color[3]
    )
    sceneAction.connectLineManagement.addLine({
      sourId: json.Data.sName,
      targetId: json.Data.tName,
      color: colorC,
      type: json.Type,
      show: show,
      width: 15
    })
  }

  const dropJamLine = (json) => {
    sceneAction.connectLineManagement.removeStrikePlan({
      sourId: json.Data.sName,
      targetId: json.Data.tName,
      type: 'RE_JamS'
    })
    removeDetectFrustum('RE_JamS_' + json.Data.sName)
    // createPan 与 removeById 一起注释
    // window.EarthViewer.entities.removeById(json.Data.sName + 'pan' + 'RE_JamS')
    // 雷达干扰半圆  删除暂时去掉
    // if (!json.Data.tName) {
    //   json.Data.tName = 'BB_threat-radio'
    //   sceneAction.planeCzmlManage.removePlaneElectronicInterfer(json.Data.tName)
    // }
  }

  const sensorJam = (json) => {
    if (json.Data.sName) {
      // 飞机开启电子干扰
      // sceneAction.planeCzmlManage.createPan({
      //   sourId: json.Data.sName,
      //   type: json.Type,
      //   radius:
      // json.Data['AP'] && json.Data['AP'].length > 0
      //   ? Number(json.Data['AP'][0]['MR'])
      //   : 7040,
      //   color: [0, 0, 255, 0.3], //[192, 125, 252],
      //   angle: 90
      // })
      let yawPa = json.Data['yaw'] ? json.Data['yaw'] : 0
      let pitchPa = json.Data['pitch'] ? json.Data['pitch'] : -10
      let rollpa = 0
      let far =
        json.Data['AP'] && json.Data['AP'].length > 0
          ? Number(json.Data['AP'][0]['MR'])
          : 7040
      // (json.Data['AP'] && json.Data['AP'].length > 0
      //   ? Number(json.Data['AP'][0]['MR'])
      //   : 7040) * 0.5
      // 应该尝试通过目标实体获取其高度再赋值给far，这样避免视锥穿地下
      let color =
        json.Data.sSide == 'blue'
          ? [0, 0, 255]
          : json.Data.sSide == 'red'
          ? [255, 0, 0]
          : [0, 0, 255]
      createReJamSFrustumFun(
        'RE_JamS_',
        json.Data.sName,
        color,
        yawPa,
        pitchPa,
        rollpa,
        far
      )
    }
    if (!json.Data.tName) {
      json.Data.tName = 'BB_threat-radio'
    }

    // if (json.Data.tName) {
    //   if (window.EarthViewer.scene.mode !== 2) {
    //     // 三维显示
    //     let winstonId = 'primitive_virtual_' + json.Data.tName
    //     let curPrimitiEn = window.EarthViewer.scene.primitives._primitives.find(
    //       (p) => {
    //         if (typeof p.id !== 'undefined' && p.id !== winstonId) {
    //           return p
    //         }
    //       }
    //     )
    //     if (window.MSIMEarth.defined(curPrimitiEn)) {
    //       let cusP = new window.EarthPlugn.customPritive(
    //         window.MSIMEarth,
    //         window.EarthViewer
    //       )
    //       let winston = cusP.createWinstonHalf(
    //         [100000, 100000, 100000],
    //         [115.4345, 22.8775, 100],
    //         {
    //           color: new window.MSIMEarth.Color(
    //             255 / 255,
    //             0 / 255,
    //             0 / 255,
    //             1.0
    //           ),
    //           id: 'primitive_virtual_' + 'BB_threat-radio'
    //         }
    //       )
    //       window.EarthViewer.scene.primitives.add(winston)
    //     }
    //   } else {
    //     // 雷达干扰半圆
    //     sceneAction.planeCzmlManage.planeElectronicInterfer({
    //       sourId: json.Data.tName,
    //       radius: 100000
    //     })
    //     // // let id = `SU==sensor==${json.Data.tName}`
    //     // let id = `${json.Data.tName}_ElectronicInterfer`
    //     // // 雷达干扰 console.log('缩小', json.tabelDesc)
    //     // sceneAction.planeCzmlManage.changeSensorRange({
    //     //   id: id,
    //     //   multiple: 2 / 3,
    //     //   text: json.tabelDesc
    //     // })
    //   }
    // }
  }

  return { initJamLine, dropJamLine, sensorJam }
}
