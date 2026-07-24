// import taskConfig from './taskConfig'

// export { taskConfig }

export default class CommonMethods {
  taskConfig(name) {
    console.log('当前任务', name)
    switch (name) {
      case '小体系对抗-宫古控制区':
        break
      case '虚实对抗训练':
        EarthAPP.ldrw = EarthAPP.xsdk
        break
      case '超低空飞行':
        EarthAPP.ldrw = EarthAPP.dkfx
        break
      case '低空飞行-拉林':
        EarthAPP.ldrw = EarthAPP.dkll
        break
      case '转场训练':
        EarthAPP.ldrw = EarthAPP.zcxl
      case '本场飞行训练':
        EarthAPP.ldrw = EarthAPP.bcfx
        break
      case '作战任务行为模型构建及指挥决策模型构建':
        EarthAPP.ldrw = EarthAPP.gjzh
        break
      // 为了灵活配置，此处的case在全局配置中设置
      case sceneName:
        EarthAPP.ldrw = EarthAPP.LH
        break
      default:
        EarthAPP.ldrw = ['没有匹配到']
        break
    }
  }
}
