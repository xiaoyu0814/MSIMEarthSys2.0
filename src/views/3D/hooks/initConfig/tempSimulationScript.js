import emitter from '@/utils/eventbus'
import store from '@/store'
// 临时表达用脚本函数
export function tempSimulationScript() {
  //1 地面站1指令上注
  zlsz()
  //2 为真侦察
  setTimeout(() => {
    wxzc()
  }, 7000)
  //3 数据回传
  setTimeout(() => {
    sjhc()
  }, 15000)
  //4 通信 向预警机传递情报
  setTimeout(() => {
    cdqbToYJ()
  }, 27000)
  //5 预警指挥
  setTimeout(() => {
    yjzh()
  }, 34000)
  //5 侦察信息回传
  setTimeout(() => {
    zcxxhc()
  }, 43000)
  //6 指挥饱和攻击
  setTimeout(() => {
    zhbhgj()
  }, 53000)
}

// 指令上注
const zlsz = () => {
  window.localStorage.setItem('bluePrint', 0)
  beautyToast.info({
    title: '通信',
    message: `卫星指令上注`,
    darkTheme: true
  })
  let startOptions = {
    entityId: 'dmz-01',
    czmlSource: 'MSIMEarthCZMLProcessContainer',
    type: 'RE_MR',
    title: 'dmz-01',
    msg: '指令上注↑↑'
  }
  window.sceneAction.popUp.setStyleEffect(startOptions)
  const option = {
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  }
  const sceneAction = new window.EarthPlugn.sceneAction(option)
  let color = window.MSIMEarth.Color.fromCssColorString('#0a78e9')
  sceneAction.connectLineManagement.addLineByRay({
    sourId: 'dmz-01',
    targetId: 'YAOGAN',
    color: color,
    type: 'RE_MR',
    width: 32,
    Raywidth: 8,
    mix: 1.0,
    show: true,
    radius: 300000,
    endOptions: {
      entityId: 'YAOGAN',
      czmlSource: 'MSIMEarthCZMLProcessContainer',
      type: 'RE_MR',
      title: 'YAOGAN',
      msg: '指令上注↓↓'
    },
    materialImg: require('/public/static/image/texture/jt11.png')
  })

  setTimeout(() => {
    // 清除
    sceneAction.connectLineManagement.removeStrikePlan({
      sourId: 'dmz-01',
      targetId: 'YAOGAN',
      type: 'RE_MR'
    })
    window.sceneAction.popUp.cancleStyleEffect(startOptions)
    // window.sceneAction.popUp.cancleStyleEffect({
    //   entityId: 'YAOGAN',
    //   czmlSource: 'MSIMEarthCZMLProcessContainer',
    //   type: 'RE_MR',
    //   title: 'YAOGAN',
    //   msg: '指令上注↓↓'
    // })
  }, 8000)
}

// 卫星侦察
const wxzc = () => {
  beautyToast.info({
    title: '通信',
    message: `光学卫星扫描`,
    darkTheme: true
  })
  let dataController = new window.EarthPlugn.DataControl({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  dataController.satelliteTurnOn()
  let startOptions = {
    entityId: 'YAOGAN',
    czmlSource: 'MSIMEarthCZMLProcessContainer',
    type: 'RE_MR',
    title: 'YAOGAN',
    msg: '卫星侦察'
  }
  window.sceneAction.popUp.setStyleEffect(startOptions)
}
// 数据回传
const sjhc = () => {
  window.localStorage.setItem('bluePrint', 1)
  beautyToast.info({
    title: '通信',
    message: `数据回传`,
    darkTheme: true
  })
  let startOptions = {
    entityId: 'YAOGAN',
    czmlSource: 'MSIMEarthCZMLProcessContainer',
    type: 'RE_MR',
    title: 'YAOGAN',
    msg: '数据回传↑↑'
  }
  window.sceneAction.popUp.setStyleEffect(startOptions)
  const option = {
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  }
  const sceneAction = new window.EarthPlugn.sceneAction(option)
  let color = window.MSIMEarth.Color.fromCssColorString('#0a78e9')
  sceneAction.connectLineManagement.addLineByRay({
    sourId: 'YAOGAN',
    targetId: 'dmz-02',
    color: color,
    type: 'RE_MR',
    width: 32,
    Raywidth: 8,
    mix: 1.0,
    show: true,
    endOptions: {
      entityId: 'dmz-02',
      czmlSource: 'MSIMEarthCZMLProcessContainer',
      type: 'RE_MR',
      title: 'dmz-02',
      msg: '数据回传↓↓'
    },
    materialImg: require('/public/static/image/texture/jt11.png')
  })
  setTimeout(() => {
    // 清除连线
    sceneAction.connectLineManagement.removeStrikePlan({
      sourId: 'YAOGAN',
      targetId: 'dmz-02',
      type: 'RE_MR'
    })
    // 清除标牌
    window.sceneAction.popUp.cancleStyleEffect(startOptions)
    window.sceneAction.popUp.cancleStyleEffect({
      entityId: 'dmz-02',
      czmlSource: 'MSIMEarthCZMLProcessContainer',
      type: 'RE_MR',
      title: 'dmz-02',
      msg: '数据回传↓↓'
    })
    // 清除视锥
    let dataController = new window.EarthPlugn.DataControl({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
    dataController.satelliteTurnOff()
  }, 8000)
}

// 传递情报给预警机
const cdqbToYJ = () => {
  window.localStorage.setItem('bluePrint', 2)
  beautyToast.info({
    title: '预警指挥',
    message: `情报回传`,
    darkTheme: true
  })
  let startOptions = {
    entityId: 'dmz-02',
    czmlSource: 'MSIMEarthCZMLProcessContainer',
    type: 'RE_MR',
    title: 'dmz-02',
    msg: '情报传输↑↑'
  }
  window.sceneAction.popUp.setStyleEffect(startOptions)
  const option = {
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  }
  const sceneAction = new window.EarthPlugn.sceneAction(option)
  let color = window.MSIMEarth.Color.fromCssColorString('#0a78e9')
  sceneAction.connectLineManagement.addLineByRay({
    sourId: 'dmz-02',
    targetId: 'KJ-500',
    color: color,
    type: 'RE_MR',
    width: 32,
    Raywidth: 8,
    mix: 1.0,
    show: true,
    endOptions: {
      entityId: 'KJ-500',
      czmlSource: 'MSIMEarthCZMLProcessContainer',
      type: 'RE_MR',
      title: 'KJ-500',
      msg: '情报传输↓↓'
    },
    materialImg: require('/public/static/image/texture/jt11.png')
  })
  setTimeout(() => {
    // 清除连线
    sceneAction.connectLineManagement.removeStrikePlan({
      sourId: 'dmz-02',
      targetId: 'KJ-500',
      type: 'RE_MR'
    })
    // 清除标牌
    window.sceneAction.popUp.cancleStyleEffect(startOptions)
    window.sceneAction.popUp.cancleStyleEffect({
      entityId: 'KJ-500',
      czmlSource: 'MSIMEarthCZMLProcessContainer',
      type: 'RE_MR',
      title: 'KJ-500',
      msg: '数据回传↓↓'
    })
  }, 8000)
}

// 预警机指挥侦察
const yjzh = () => {
  window.localStorage.setItem('bluePrint', 3)
  beautyToast.success({
    title: '预警指挥',
    message: `预警侦察`,
    darkTheme: true
  })
  let startOptions = {
    entityId: 'KJ-500',
    czmlSource: 'MSIMEarthCZMLProcessContainer',
    type: 'SDC',
    title: 'KJ-500',
    msg: '侦察预警↑↑'
  }
  window.sceneAction.popUp.setStyleEffect(startOptions)
  //#dbe90a
  const option = {
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  }
  const sceneAction = new window.EarthPlugn.sceneAction(option)
  let color = window.MSIMEarth.Color.fromCssColorString('#dbe90a')
  let targetArr = ['wz-7_1', 'wz-7_2', 'wz-7_3', 'wz-7_4']
  targetArr.forEach((e) => {
    sceneAction.connectLineManagement.addLineByRay({
      sourId: 'KJ-500',
      targetId: e,
      color: color,
      type: 'SDC',
      width: 32,
      Raywidth: 8,
      mix: 1.0,
      show: true,
      endOptions: {
        entityId: e,
        czmlSource: 'MSIMEarthCZMLProcessContainer',
        type: 'SDC',
        title: e,
        msg: '侦察预警↓↓'
      },
      materialImg: require('/public/static/image/texture/jt11.png')
    })
  })
  setTimeout(() => {
    window.sceneAction.popUp.cancleStyleEffect({
      entityId: 'KJ-500',
      czmlSource: 'MSIMEarthCZMLProcessContainer',
      type: 'SDC',
      title: 'KJ-500',
      msg: '侦察预警↓↓'
    })
    targetArr.forEach((e) => {
      // 清除连线
      sceneAction.connectLineManagement.removeStrikePlan({
        sourId: 'KJ-500',
        targetId: e,
        type: 'SDC'
      })
      window.sceneAction.popUp.cancleStyleEffect({
        entityId: e,
        czmlSource: 'MSIMEarthCZMLProcessContainer',
        type: 'SDC',
        title: e,
        msg: '侦察预警↓↓'
      })
    })
  }, 8000)
}

// 侦察信息回传
const zcxxhc = () => {
  window.localStorage.setItem('bluePrint', 4)
  beautyToast.success({
    title: '预警指挥',
    message: `情报回传`,
    darkTheme: true
  })
  const option = {
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  }
  const sceneAction = new window.EarthPlugn.sceneAction(option)
  let color = window.MSIMEarth.Color.fromCssColorString('#dbe90a')
  let targetArr = ['wz-7_1', 'wz-7_2', 'wz-7_3', 'wz-7_4']
  targetArr.forEach((e) => {
    let startOptions = {
      entityId: e,
      czmlSource: 'MSIMEarthCZMLProcessContainer',
      type: 'SDC',
      title: e,
      msg: '侦察信息回传↑↑'
    }
    window.sceneAction.popUp.setStyleEffect(startOptions)
    sceneAction.connectLineManagement.addLineByRay({
      sourId: e,
      targetId: 'KJ-500',
      color: color,
      type: 'SDC',
      width: 32,
      Raywidth: 8,
      mix: 1.0,
      show: true,
      endOptions: {
        entityId: 'KJ-500',
        czmlSource: 'MSIMEarthCZMLProcessContainer',
        type: 'SDC',
        title: 'KJ-500',
        msg: '侦察信息回传↓↓'
      },
      materialImg: require('/public/static/image/texture/jt11.png')
    })
  })
  setTimeout(() => {
    window.sceneAction.popUp.cancleStyleEffect({
      entityId: 'KJ-500',
      czmlSource: 'MSIMEarthCZMLProcessContainer',
      type: 'SDC',
      title: 'e',
      msg: '侦察预警↓↓'
    })
    targetArr.forEach((e) => {
      // 清除连线
      sceneAction.connectLineManagement.removeStrikePlan({
        sourId: e,
        targetId: 'KJ-500',
        type: 'SDC'
      })
      window.sceneAction.popUp.cancleStyleEffect({
        entityId: e,
        czmlSource: 'MSIMEarthCZMLProcessContainer',
        type: 'SDC',
        title: e,
        msg: '侦察预警↓↓'
      })
    })
  }, 8000)
}

// 指挥饱和攻击
const zhbhgj = () => {
  window.localStorage.setItem('bluePrint', 5)
  beautyToast.warning({
    title: '饱和耗能',
    message: '抵近耗能，自杀性攻击',
    darkTheme: true
  })
  let startOptions = {
    entityId: 'KJ-500',
    czmlSource: 'MSIMEarthCZMLProcessContainer',
    type: 'Weapon_Warning',
    title: 'KJ-500',
    msg: '预警指挥↑↑'
  }
  window.sceneAction.popUp.setStyleEffect(startOptions)
  const option = {
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  }
  const sceneAction = new window.EarthPlugn.sceneAction(option)
  let color = window.MSIMEarth.Color.fromCssColorString('#e9670a')
  let targetArr = ['ss-uav_1', 'ss-uav_2']
  targetArr.forEach((e) => {
    sceneAction.connectLineManagement.addLineByRay({
      sourId: 'KJ-500',
      targetId: e,
      color: color,
      type: 'Weapon_Warning',
      width: 32,
      Raywidth: 8,
      mix: 1.0,
      show: true,
      endOptions: {
        entityId: e,
        czmlSource: 'MSIMEarthCZMLProcessContainer',
        type: 'Weapon_Warning',
        title: e,
        msg: '预警指挥↓↓'
      },
      materialImg: require('/public/static/image/texture/jt11.png')
    })
  })
  setTimeout(() => {
    window.sceneAction.popUp.cancleStyleEffect({
      entityId: 'KJ-500',
      czmlSource: 'MSIMEarthCZMLProcessContainer',
      type: 'Weapon_Warning',
      title: 'KJ-500',
      msg: '预警指挥↓↓'
    })
    targetArr.forEach((e) => {
      // 清除连线
      sceneAction.connectLineManagement.removeStrikePlan({
        sourId: 'KJ-500',
        targetId: e,
        type: 'Weapon_Warning'
      })
      window.sceneAction.popUp.cancleStyleEffect({
        entityId: e,
        czmlSource: 'MSIMEarthCZMLProcessContainer',
        type: 'Weapon_Warning',
        title: e,
        msg: '预警指挥↓↓'
      })
    })
  }, 10000)
}

export { zlsz }
