import store from '@/store'

export function defensiveRange(params) {
  let viewer = window.EarthViewer
  viewer.entities.removeById(`${params.type}==${params.sourId}==big`)
  viewer.entities.removeById(`${params.type}==${params.sourId}==small`)

  let czmlEn = window.EarthViewer.dataSources._dataSources.find((item) => {
    if (
      typeof item.processName !== 'undefined' &&
      item.processName === 'MSIMEarthCZMLProcessContainer'
    ) {
      return item
    }
  })

  const entityMethod = new window.EarthPlugn.entity({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })

  if (window.MSIMEarth.defined(czmlEn)) {
    let entity = entityMethod.getCZMLEntity(
      params.sourId,
      'MSIMEarthCZMLProcessContainer'
    )
    if (!window.MSIMEarth.defined(entity)) return

    let radius = params.radius || 18520
    let radius1 = params.radius1 || 74080
    let mixColor = params.color || [0, 0, 255]
    var changePos = function () {
      if (!entity.position) return
      let entityPos = entity.position._value
        ? entity.position._value
        : entity.position.getValue(window.EarthViewer.clock.currentTime)
      if (!entityPos) return
      return entityPos
    }
    var changeHeight = function () {
      // let position
      if (!entity.position) return
      let entityPos = entity.position._value
        ? entity.position._value
        : entity.position.getValue(window.EarthViewer.clock.currentTime)
      if (entityPos == undefined) {
        return
      }
      if (
        typeof entityPos.x === 'undefined' ||
        typeof entityPos.y === 'undefined' ||
        typeof entityPos.z === 'undefined'
      ) {
        return
      }
      if (!entityPos) return
      let entityCartographic =
        window.MSIMEarth.Cartographic.fromCartesian(entityPos)
      if (typeof entityCartographic.height === 'undefined') return
      return entityCartographic.height
    }

    window.EarthViewer.entities.add({
      id: `${params.type}==${params.sourId}==small`,
      position: new window.MSIMEarth.CallbackProperty(changePos, false),
      ellipse: {
        semiMinorAxis: radius1,
        semiMajorAxis: radius1,
        material: new window.MSIMEarth.Color(
          mixColor[0] / 255,
          mixColor[1] / 255,
          mixColor[2] / 255,
          0.1
        ),
        // heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND,
        outline: true,
        height: new window.MSIMEarth.CallbackProperty(changeHeight, false),
        outlineColor: new window.MSIMEarth.Color(
          mixColor[0] / 255,
          mixColor[1] / 255,
          mixColor[2] / 255,
          1
        ),
        outlineWidth: 2
      },
      show: false
    })
  }

  // let datasource = window.EarthViewer.dataSources.getByName(params.sourId)
  // // console.log(datasource)
  // // let entity = datasource[0].entities.values[0]
  // let entity = datasource.length
  //   ? datasource[0].entities.values[0]
  //   : viewer.entities.getById(params.sourId)
  // // let entity = datasource[0].entities.values.find(item => item.name == msid)z
  // if (!entity) return
  // // let name = entity.properties.entity_name._value
  // // let pos = entity.position._value
  // // let cartog =
  // //   window.EarthViewer.scene.globe.ellipsoid.cartesianToCartographic(pos)
  // // 判断类型
  // let radius = params.radius || 18520
  // let radius1 = params.radius1 || 74080
  // let mixColor = params.color || [0, 0, 255]

  // window.EarthViewer.entities.add({
  //   id: `${params.type}==${params.sourId}==big`,
  //   position: new window.MSIMEarth.CallbackProperty(changePos, false),
  //   ellipse: {
  //     semiMinorAxis: radius,
  //     semiMajorAxis: radius,
  //     // material: new window.MSIMEarth.Color(
  //     //   mixColor[0] / 255,
  //     //   mixColor[1] / 255,
  //     //   mixColor[2] / 255,
  //     //   0.1
  //     // ),
  //     // material: new window.MSIMEarth.GradientCircleMaterialProperty({
  //     //   color: new window.MSIMEarth.Color(
  //     //     mixColor[0] / 255,
  //     //     mixColor[1] / 255,
  //     //     mixColor[2] / 255,
  //     //     0.3
  //     //   )
  //     // }),
  //     height: new window.MSIMEarth.CallbackProperty(changeHeight, false),
  //     outline: false,
  //     // heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND,
  //     outlineColor: new window.MSIMEarth.Color(
  //       mixColor[0] / 255,
  //       mixColor[1] / 255,
  //       mixColor[2] / 255,
  //       1
  //     ),
  //     outlineWidth: 2
  //   },
  //   show: false
  // })
}

export function defendSurround() {
  // 侦察范围对象
  zflynop.forEach((item) => {
    defensiveRange({
      sourId: item,
      type: 'defendSurround',
      radius: 18520,
      radius1: 74080,
      // color: [120, 82, 26]
      color: [0, 255, 255]
    })
  })

  zflynop2.forEach((item) => {
    defensiveRange({
      sourId: item,
      type: 'defendSurround',
      radius: 14520,
      radius1: 54080,
      color: [120, 82, 26]
    })
  })

  zflynop3.forEach((item) => {
    defensiveRange({
      sourId: item,
      type: 'defendSurround',
      radius: 18520,
      radius1: 74080,
      color: [120, 82, 26]
    })
  })
  // defensiveRange({
  //   sourId: 'escort_south',
  //   type: 'defendSurround',
  //   radius: 60 * 1852,
  //   radius1: 65 * 1852,
  //   color: [206, 114, 60]
  // })
  // defensiveRange({
  //   sourId: 'escort_north',
  //   type: 'defendSurround',
  //   radius: 60 * 1852,
  //   radius1: 65 * 1852,
  //   color: [206, 114, 60]
  // })
  // defensiveRange({
  //   sourId: 'soj_north',
  //   type: 'defendSurround',
  //   radius: 60 * 1852,
  //   radius1: 65 * 1852,
  //   color: [206, 114, 60]
  // })
  // defensiveRange({
  //   sourId: 'soj_south',
  //   type: 'defendSurround',
  //   radius: 60 * 1852,
  //   radius1: 65 * 1852,
  //   color: [206, 114, 60]
  // })
}

export function gradientCircle() {
  window.EarthViewer.entities.add({
    id: `qweqweqw`,
    position: new window.MSIMEarth.Cartesian3.fromDegrees(122, 20, 100),
    ellipse: {
      semiMinorAxis: 200000,
      semiMajorAxis: 200000,
      // material: new window.MSIMEarth.GradientCircleMaterialProperty({
      //   color: new Cesium.Color(1.0, 0.0, 0.0, 1.0)
      //   // speed: 10.0
      // }),
      height: 1000,
      outline: true,
      outlineColor: new window.MSIMEarth.Color(255 / 255, 0 / 255, 0 / 255, 1),
      outlineWidth: 2
    }
  })
}
