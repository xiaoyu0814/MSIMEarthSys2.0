import store from '@/store'

export default function () {
  const option = {
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  }
  const sceneAction = new window.EarthPlugn.sceneAction(option)
  const sensorSwitch = (json) => {
    // 日志展示
    // store.commit('setCzmlEventSourceData', json)
    // 传感器开关
    if (json.Data.ON) {
      let a = window.EarthViewer.entities.getById(json.Data.PName)
      if (!json.Data.MR) return
      let earthObjectConfig = store.state.sceneModule.earthObjectConfig
      let show =
        earthObjectConfig.findIndex((item) => item == '传感器范围') > -1
      sceneAction.planeCzmlManage.sensorRange({
        sourId: json.Data.PName,
        type: json.Type,
        radius: json.Data.MR,
        side: json.Data.Side,
        show: show
      })
    } else {
      sceneAction.planeCzmlManage.removeRange({
        sourId: json.Data.PName,
        type: json.Type
      })
    }
  }

  const sensorSwitch2 = (json) => {
    let sensorId = json.Data.PName + '_SU==sensor'
    // 根据NO状态判断开关
    if (json.Data.ON) {
      //传感器开启 Data.Name 表示类型 PName 表示挂载平台 MR表示范围 XA表示频率等 side表示阵营
      window.EarthViewer.entities.removeById(json.Data.PName + 'sensor')
      let earthObjectConfig = store.state.sceneModule.earthObjectConfig
      let show =
        earthObjectConfig.findIndex((item) => item == '传感器范围') > -1
      console.log('sensor', show)
      // 1.根据阵营给定基本颜色
      let sensorColor
      // 2.根据类型给定基本形态结构
      switch (json.Data.Side) {
        case 'red':
          sensorColor = new window.MSIMEarth.Color(1.0, 0.0, 0.0, 0.5)
          break
        case 'blue':
          // sensorColor = new window.MSIMEarth.Color(
          //   56 / 255.0,
          //   225 / 255.0,
          //   255 / 255.0,
          //   1.0
          // )
          sensorColor = new window.MSIMEarth.Color(0.0, 0.0, 1.0, 0.5)
          break
        default:
          sensorColor = new window.MSIMEarth.Color(1.0, 1.0, 1.0, 0.5)
          break
      }

      var getSensorPosition = function () {
        let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
          json.Data.PName,
          'MSIMEarthCZMLProcessContainer'
        )
        let currentTime = window.EarthViewer.clock.currentTime
        if (!window.MSIMEarth.defined(curEntity)) return
        let p = curEntity.position.getValue(currentTime)
        return p
      }

      window.EarthViewer.entities.removeById(sensorId)
      window.EarthViewer.entities.add({
        position: new window.MSIMEarth.CallbackProperty(
          getSensorPosition,
          false
        ),
        id: sensorId,
        ellipse: {
          semiMinorAxis: json.Data.MR,
          semiMajorAxis: json.Data.MR,
          // material: window.MSIMEarth.Color.GREEN,
          material: new window.MSIMEarth.GradientMaterialProperty({
            repeat: new window.MSIMEarth.Cartesian2(1.0, 1.0),
            color: sensorColor,
            flowSpeed: 25.0,
            diffusePower: 1.2,
            alphaPower: 0.8,
            center: new window.MSIMEarth.Cartesian2(0.5, 0.5),
            globalAlpha: 0x1,
            transparent: true
          }),
          fill: false,
          outlineColor: sensorColor,
          outlineWidth: 5,
          distanceDisplayCondition:
            new window.MSIMEarth.DistanceDisplayCondition(0, 100e5),
          outline: true // height must be set for outline to display
        },
        show: show
      })
    } else {
      // 传感器关闭
      window.EarthViewer.entities.removeById(json.Data.PName + 'sensor')
      window.EarthViewer.entities.removeById(json.Data.PName + 'sensor')
      window.EarthViewer.entities.removeById(sensorId)
      // window.EarthViewer.entities.removeById(sensorId + 'outline')
    }
  }

  return { sensorSwitch, sensorSwitch2 }
}
