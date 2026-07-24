import store from '@/store'
/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-03-03 13:05:23
 * @LastEditors: yuqiangqiang yqq@piesat.cn
 * @LastEditTime: 2024-08-24 15:31:13
 */
/**
 * 各种系统提示消息，包括球上的动态label、billboard、model等
 * @param {*} options
 */
function SystemMessage(options) {
  this.earth = options.earth
  this.viewer = options.viewer
  this.objArr = [] //存放对象
}

/**
 * 提示消息
 *
 * @param {Array} options.sysMessagePosition  提示消息位置-必填参数-经纬高 [110.0, 20.3, 0]
 * @param {string} options.sysMessageId  提示消息id-必填参数
 * @param {string} options.sysMessageText  提示消息信息-必填参数
 * @param {string} options.sysFillColor  提示消息颜色
 * @param {string} options.sysMessageIcon  提示消息图标-默认值 './static/billboard/地面站.png'
 */
SystemMessage.prototype.labelMessage = function (options) {
  let earth = this.earth
  let viewer = this.viewer
  let i = 0
  function changeOffset() {
    if (i < 10) {
      i += 0.1
    } else {
      i += 0.2
    }

    return new earth.Cartesian2(-33, -11 - i)
  }

  let transparent = 1.0
  function changeTransparent() {
    if (transparent > 0.7) {
      transparent -= 0.0001
    } else {
      transparent -= 0.05
    }
    if (transparent < 0) {
      transparent = 0
    }

    let fillColor = options.sysFillColor || store.getters.getStateInfoColor
    return new earth.Color(
      fillColor[0],
      fillColor[1],
      fillColor[2],
      transparent
    )
  }

  function removeLabelMessage(options) {
    if (viewer && options.sysMessageId) {
      viewer.entities.removeById(options.sysMessageId)
    }
  }
  // 防止3秒之前连续点击
  if (window.EarthViewer.entities.getById(options.sysMessageId)) {
    return false
  }
  viewer.entities.add({
    id: options.sysMessageId,
    position: earth.Cartesian3.fromDegrees(
      options.sysMessagePosition[0],
      options.sysMessagePosition[1],
      options.sysMessagePosition[2] ? options.sysMessagePosition[2] : 10000
    ),
    label: {
      text: options.sysMessageText,
      font: options.fontSize || 'normal 42px MicroSoft YaHei',
      scale: 0.5,
      outlineColor: new earth.Color(
        store.getters.getStateInfoOutLineColor[0],
        store.getters.getStateInfoOutLineColor[1],
        store.getters.getStateInfoOutLineColor[2],
        store.getters.getStateInfoOutLineColor[3]
      ),
      showBackground: true,
      // backgroundColor:new earth.CallbackProperty(changeTransparent, false),
      backgroundColor: window.MSIMEarth.Color.BLACK.withAlpha(0.1),
      // backgroundPadding: new window.MSIMEarth.Cartesian2(7, 5),
      outlineWidth: store.getters.getStateInfoWidth,
      style: earth.LabelStyle.FILL_AND_OUTLINE,
      horizontalOrigin: earth.HorizontalOrigin.LEFT, //水平位置
      verticalOrigin: earth.VerticalOrigin.BOTTOM,
      fillColor: new earth.CallbackProperty(changeTransparent, false), //earth.Color.SKYBLUE,
      pixelOffset: new earth.CallbackProperty(changeOffset, false) //earth.Cartesian2(-33, -11)
    }
  })

  setTimeout(() => {
    removeLabelMessage(options)
  }, 5000)
}

export default SystemMessage
