import store from '@/store'
// 判断是否显示为JB
export function renderJB(json) {
  if (store.state.sceneModule.showJB) {
    // JB模式
    json[1].billboard.show = true
    json[1].model.show = false
  }
}
/**
 * 匹配JB模式模型
 * @param {*} json
 * @returns 配置好JB模型后的CZML
 */
export function JBConfig(json) {
  let res
  if (json[1].description.indexOf('电子战飞机') > -1) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/jb/blue/20608_电子干扰机B.glb',
        minimumPixelSize: 50
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/jb/red/20608_电子干扰机R.glb',
        minimumPixelSize: 50
      }
    }
  } else if (
    json[1].description.indexOf('无人轰炸机') > -1 ||
    json[1].description.indexOf('无人机') > -1 ||
    json[1].description.indexOf('无-') > -1
  ) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/jb/blue/20613_无人机B.glb',
        minimumPixelSize: 50
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/jb/red/20613_无人机R.glb',
        minimumPixelSize: 50
      }
    }
  } else if (json[1].description.indexOf('无人侦察机') > -1) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/jb/blue/2061505_无人机B.glb',
        minimumPixelSize: 50
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/jb/red/2061505_无人机R.glb',
        minimumPixelSize: 50
      }
    }
  } else if (
    json[1].description.indexOf('战斗机') > -1 ||
    json[1].description.indexOf('歼击机') > -1 ||
    json[1].description.indexOf('作战飞机') > -1 ||
    json[1].description.indexOf('模拟器') > -1 ||
    json[1].description.indexOf('J11') > -1 ||
    json[1].description.indexOf('F18') > -1
  ) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/jb/blue/20603_歼击机B.glb',
        minimumPixelSize: 50
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/jb/red/20603_歼击机R.glb',
        minimumPixelSize: 50
      }
    }
  } else if (
    json[1].description.indexOf('有人侦察机') > -1 ||
    json[1].description.indexOf('蓝方侦察机') > -1 ||
    json[1].description == '侦察机1' ||
    json[1].description == '红方侦察机' ||
    json[1].description == '超音速侦察机'
  ) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/jb/blue/20607_侦察机B.glb',
        minimumPixelSize: 50
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/jb/red/20607_侦察机R.glb',
        minimumPixelSize: 50
      }
    }
  } else if (json[1].description.indexOf('有人机') > -1) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/jb/blue/20601_指挥机B.glb',
        minimumPixelSize: 50
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/jb/red/20601_指挥机R.glb',
        minimumPixelSize: 50
      }
    }
  } else if (json[1].description == '激光干扰机') {
    if (json[1].properties.airplaneAction.side === 'blue') {
      json[1].model = {
        gltf: 'static/data/gltf/jb/blue/直升机B.glb',
        minimumPixelSize: 50
      }
    } else {
      json[1].model = {
        gltf: 'static/data/gltf/jb/red/直升机R.glb',
        minimumPixelSize: 50
      }
    }
  } else if (
    json[1].description.indexOf('护航飞机') > -1 ||
    json[1].description.indexOf('干扰机') > -1
  ) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/jb/blue/20608_电子干扰机B.glb',
        minimumPixelSize: 50
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/jb/red/20608_电子干扰机R.glb',
        minimumPixelSize: 50
      }
    }
  } else if (
    json[1].description.indexOf('运输机') > -1 ||
    json[1].description.indexOf('运-20') > -1
  ) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/jb/blue/20610_运输机B.glb',
        minimumPixelSize: 50
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/jb/red/20610_运输机R.glb',
        minimumPixelSize: 50
      }
    }
  } else if (json[1].description.indexOf('预警机') > -1) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/jb/blue/20602_预警机B.glb',
        minimumPixelSize: 50
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/jb/red/20602_预警机R.glb',
        minimumPixelSize: 50
      }
    }
  } else if (json[1].description.indexOf('战斗轰炸机') > -1) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/jb/blue/20605_轰炸机B.glb',
        minimumPixelSize: 50
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/jb/red/20605_轰炸机R.glb',
        minimumPixelSize: 50
      }
    }
  } else if (json[1].description.indexOf('导弹发射车') > -1) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/jb/blue/20407_导弹发射车B.glb',
        minimumPixelSize: 50
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/jb/red/20407_导弹发射车R.glb',
        minimumPixelSize: 50
      }
    }
  } else if (json[1].description.indexOf('驱逐舰') > -1) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/jb/blue/20503_驱逐舰B.glb',
        minimumPixelSize: 50
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/jb/red/20503_驱逐舰R.glb',
        minimumPixelSize: 50
      }
    }
  } else if (json[1].description.indexOf('航母编队') > -1) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/jb/blue/20501_航空母舰B.glb',
        minimumPixelSize: 50
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/jb/red/20501_航空母舰R.glb',
        minimumPixelSize: 50
      }
    }
  } else if (json[1].description.indexOf('北斗卫星') > -1) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/jb/blue/2070303_通信卫星B.glb',
        minimumPixelSize: 50
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/jb/red/2070303_通信卫星R.glb',
        minimumPixelSize: 50
      }
    }
  } else if (json[1].description.indexOf('A51卫星') > -1) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/jb/blue/20703_军用卫星B.glb',
        minimumPixelSize: 50
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/jb/red/20703_军用卫星R.glb',
        minimumPixelSize: 50
      }
    }
  } else if (json[1].description.indexOf('弹') > -1) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/jb/blue/空基巡航导弹B.glb',
        minimumPixelSize: 50
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/jb/red/空基巡航导弹R.glb',
        minimumPixelSize: 50
      }
    }
  } else if (
    json[1].description.indexOf('载机') > -1 ||
    json[1].description.indexOf('激光指示器') > -1
  ) {
    if (json[1].properties.airplaneAction.side === 'blue') {
      json[1].model = {
        gltf: 'static/data/gltf/jb/blue/直升机B.glb',
        minimumPixelSize: 50
      }
    } else {
      json[1].model = {
        gltf: 'static/data/gltf/jb/red/直升机R.glb',
        minimumPixelSize: 50
      }
    }
  } else if (
    json[1].description.indexOf('目标') > -1 ||
    json[1].description.indexOf('假目标') > -1
  ) {
    if (json[1].properties.airplaneAction.side === 'blue') {
      json[1].model = {
        gltf: 'static/data/gltf/jb/blue/装甲输送车B.glb',
        minimumPixelSize: 50
      }
    } else {
      json[1].model = {
        gltf: 'static/data/gltf/jb/red/装甲输送车R.glb',
        minimumPixelSize: 50
      }
    }
  } else if (json[1].description.indexOf('未识别') > -1) {
    json[1].model = {
      gltf: 'static/data/gltf/jb/不明物体.glb',
      minimumPixelSize: 50
    }
  } else {
    json[1].model = {
      gltf: 'static/data/gltf/jb/不明物体.glb',
      minimumPixelSize: 50
    }
  }
  res = json
  return res
}

/**
 * 匹配精模模式模型
 * @param {*} json
 * @returns 配置好精模模型后的CZML
 */
export function modelConfig(json) {
  let res
  if (json[1].description.indexOf('电子战飞机') > -1) {
    if (json[1].properties.airplaneAction.side === 'blue')
      // 当前场景蓝方无电子战飞机，此处暂时用E2C替代
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/E2C.glb',
        minimumPixelSize: 35
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/J16.glb',
        minimumPixelSize: 35
      }
    }
  } else if (json[1].description.indexOf('J11') > -1) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/J11.glb',
        minimumPixelSize: 45
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/J11.glb',
        minimumPixelSize: 45
      }
    }
  } else if (json[1].description.indexOf('F18') > -1) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/f18.glb',
        minimumPixelSize: 35
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/f18.glb',
        minimumPixelSize: 35
      }
    }
  } else if (
    json[1].description.indexOf('无人机') > -1 ||
    json[1].description.indexOf('无-') > -1
  ) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/wz7.glb',
        minimumPixelSize: 45
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/wz7.glb',
        minimumPixelSize: 45
      }
    }
  } else if (json[1].description.indexOf('无人轰炸机') > -1) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/wz7.glb',
        minimumPixelSize: 45
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/wz7.glb',
        minimumPixelSize: 45
      }
    }
  } else if (json[1].description.indexOf('无人侦察机') > -1) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/wz7.glb',
        minimumPixelSize: 45
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/wz7.glb',
        minimumPixelSize: 45
      }
    }
  } else if (
    json[1].description.indexOf('战斗机') > -1 ||
    json[1].description.indexOf('歼击机') > -1 ||
    json[1].description.indexOf('作战飞机') > -1
  ) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/f16.glb',
        minimumPixelSize: 45
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/J10C.glb',
        minimumPixelSize: 25
      }
    }
  } else if (json[1].description.indexOf('模拟器') > -1) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/f16.glb',
        minimumPixelSize: 45
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/J10.glb',
        minimumPixelSize: 25
      }
    }
  } else if (
    json[1].description.indexOf('有人侦察机') > -1 ||
    json[1].description.indexOf('蓝方侦察机') > -1 ||
    json[1].description == '侦察机1' ||
    json[1].description == '红方侦察机' ||
    json[1].description == '超音速侦察机'
  ) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/JH8F.glb',
        minimumPixelSize: 35
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/JH8F.glb',
        minimumPixelSize: 35
      }
    }
  } else if (json[1].description.indexOf('有人机') > -1) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/f16.glb',
        minimumPixelSize: 35
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/J10B.glb',
        minimumPixelSize: 35
      }
    }
  } else if (json[1].description == '激光干扰机') {
    if (json[1].properties.airplaneAction.side === 'blue') {
      json[1].model = {
        gltf: 'static/data/gltf/M24.glb',
        minimumPixelSize: 35
      }
    } else {
      json[1].model = {
        gltf: 'static/data/gltf/M24.glb',
        minimumPixelSize: 35
      }
    }
  } else if (
    json[1].description.indexOf('护航飞机') > -1 ||
    json[1].description.indexOf('干扰机') > -1
  ) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/E2C.glb',
        minimumPixelSize: 35
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/J16.glb',
        minimumPixelSize: 35
      }
    }
  } else if (
    json[1].description.indexOf('运输机') > -1 ||
    json[1].description.indexOf('运-20') > -1
  ) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/运9.glb',
        scale: 2,
        minimumPixelSize: 55
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/运9.glb',
        scale: 2,
        minimumPixelSize: 55
      }
    }
  } else if (json[1].description.indexOf('预警机') > -1) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/KJ500.glb',
        minimumPixelSize: 35
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/KJ500.glb',
        minimumPixelSize: 35
      }
    }
  } else if (json[1].description.indexOf('战斗轰炸机') > -1) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/B52.glb',
        minimumPixelSize: 35
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/H6K.glb',
        minimumPixelSize: 35
      }
    }
  } else if (json[1].description.indexOf('导弹发射车') > -1) {
    if (json[1].properties.airplaneAction.side === 'blue')
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/DFDDC.glb',
        minimumPixelSize: 35
      }
    else {
      json[1].model = {
        gltf: 'static/data/gltf/3DModel/DFDDC.glb',
        minimumPixelSize: 35
      }
    }
  } else if (
    json[1].description.indexOf('载机') > -1 ||
    json[1].description.indexOf('激光指示器') > -1
  ) {
    if (json[1].properties.airplaneAction.side === 'blue') {
      json[1].model = {
        gltf: 'static/data/gltf/M24.glb',
        minimumPixelSize: 35
      }
    } else {
      json[1].model = {
        gltf: 'static/data/gltf/M24.glb',
        minimumPixelSize: 35
      }
    }
  } else if (
    json[1].description.indexOf('目标') > -1 ||
    json[1].description.indexOf('假目标') > -1
  ) {
    if (json[1].properties.airplaneAction.side === 'blue') {
      json[1].model = {
        gltf: 'static/data/gltf/运输车.glb',
        minimumPixelSize: 25
      }
    } else {
      json[1].model = {
        gltf: 'static/data/gltf/运输车.glb',
        minimumPixelSize: 25
      }
    }
  }
  // else if (json[1].description.indexOf('驱逐舰') > -1) {
  //   if (json[1].properties.airplaneAction.side === 'blue')
  //     json[1].model = {
  //       gltf: 'static/data/gltf/jb/blue/20503_驱逐舰B.glb',
  //       minimumPixelSize: 35
  //     }
  //   else {
  //     json[1].model = {
  //       gltf: 'static/data/gltf/jb/red/20503_驱逐舰R.glb',
  //       minimumPixelSize: 35
  //     }
  //   }
  // } else if (json[1].description.indexOf('航母编队') > -1) {
  //   if (json[1].properties.airplaneAction.side === 'blue')
  //     json[1].model = {
  //       gltf: 'static/data/gltf/jb/blue/20501_航空母舰B.glb',
  //       minimumPixelSize: 35
  //     }
  //   else {
  //     json[1].model = {
  //       gltf: 'static/data/gltf/jb/red/20501_航空母舰R.glb',
  //       minimumPixelSize: 35
  //     }
  //   }
  // } else if (json[1].description.indexOf('北斗卫星') > -1) {
  //   if (json[1].properties.airplaneAction.side === 'blue')
  //     json[1].model = {
  //       gltf: 'static/data/gltf/jb/blue/2070303_通信卫星B.glb',
  //       minimumPixelSize: 35
  //     }
  //   else {
  //     json[1].model = {
  //       gltf: 'static/data/gltf/jb/red/2070303_通信卫星R.glb',
  //       minimumPixelSize: 35
  //     }
  //   }
  // } else if (json[1].description.indexOf('A51卫星') > -1) {
  //   if (json[1].properties.airplaneAction.side === 'blue')
  //     json[1].model = {
  //       gltf: 'static/data/gltf/jb/blue/20703_军用卫星B.glb',
  //       minimumPixelSize: 35
  //     }
  //   else {
  //     json[1].model = {
  //       gltf: 'static/data/gltf/jb/red/20703_军用卫星R.glb',
  //       minimumPixelSize: 35
  //     }
  //   }
  // } else if (json[1].description.indexOf('弹') > -1) {
  //   if (json[1].properties.airplaneAction.side === 'blue')
  //     json[1].model = {
  //       gltf: 'static/data/gltf/jb/blue/空基巡航导弹B.glb',
  //       minimumPixelSize: 35
  //     }
  //   else {
  //     json[1].model = {
  //       gltf: 'static/data/gltf/jb/red/空基巡航导弹R.glb',
  //       minimumPixelSize: 35
  //     }
  //   }
  // } else if (json[1].description.indexOf('未识别') > -1) {
  //   json[1].model = {
  //     gltf: 'static/data/gltf/jb/不明物体.glb',
  //     minimumPixelSize: 35
  //   }
  // }
  res = json
  return res
}
