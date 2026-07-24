class ListenerControl {
  constructor(config) {
    this.earth = config.earth || window.MSIMEarth
    this.viewer = config.viewer || window.EarthViewer
    this.clockListener = null
  }
  // 初始化基于时间的监听事件
  initClockListener(callback) {
    this.clockListener = this.viewer.clock.onTick.addEventListener(callback)
  }
  // 关闭基于时间的监听事件
  closeClockListenerr(callback) {
    this.clockListener()
    this.clockListener = null
    if (callback) callback()
  }
}

export default ListenerControl
