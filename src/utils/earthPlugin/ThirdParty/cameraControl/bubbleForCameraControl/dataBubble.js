/**
 * @Author: lvzhui
 * @Date: 2024-03-30 14:18:40
 * @LastEditTime: 2024-04-01 09:55:28
 * @LastEditors: lvzhui
 * @Description: 数据气泡弹出窗组件
 * @FilePath: \smartearthsys3.0\src\components\earthComponents\dataBubbleWindow\dataBubble.js
 */
import { Component, createApp, getCurrentInstance } from 'vue'
import accidentLabel from './accidentPower.vue'
// let instance = null, unmount = null;
// // 创建一个loading组件
// export function addPostRender() {
// 	({ instance, unmount } = mountComponent(Loading));
// 	console.log(instance);
// }
//场景渲染事件 实时更新窗口的位置 使其与笛卡尔坐标一致

// const instance = getCurrentInstance()
// const _this = instance.appContext.config.globalProperties

/**
 * @description: 循环渲染完成处理
 * @param {*} val
 * @return {*}
 */
window.postRender1 = function (val) {
  if (!val || !val.root.style) return
  val.root.style.position = 'absolute'
  const canvasHeight = val.viewer.scene.canvas.height
  const windowPosition = new val.Cesium.Cartesian2()
  val.Cesium.SceneTransforms.wgs84ToWindowCoordinates(
    val.viewer.scene,
    val.position,
    windowPosition
  )

  let offsetX = val.offsetX ? val.offsetX : 0
  let offsetY = val.offsetY ? val.offsetY : 0
  let lv = document.querySelector('body')
  if (val.viewer.scene.canvas.width > 1920)
    // val.root.style.bottom = canvasHeight - windowPosition.y - 350 + "px"; //canvasHeight - windowPosition.y + 260 + "px";
    val.root.style.top = windowPosition.y - offsetY + 'px'
  //canvasHeight - windowPosition.y + 260 + "px";
  // val.root.style.bottom = canvasHeight - windowPosition.y + 260 + "px";
  else val.root.style.top = windowPosition.y - offsetY + 'px'
  const elWidth = val.root.offsetWidth
  // val.root.style.left = windowPosition.x - elWidth / 2 + "px";
  // val.root.style.left = windowPosition.x + offsetX + 'px'
  val.root.style.left = windowPosition.x - val.root.offsetWidth / 2 + 'px'
  // console.log(val.root.style)
  // console.log(val.root.offsetWidth)
  // console.log(val.offsetWidth)
  const camerPosition = val.viewer.camera.position
  let height =
    val.viewer.scene.globe.ellipsoid.cartesianToCartographic(
      camerPosition
    ).height
  height += val.viewer.scene.globe.ellipsoid.maximumRadius
}

/**
 * @description: 定义div弹出窗体
 * @param {Object} val 定义入参对象
 */
export function divLabel(val) {
  const Cesium = val.Cesium
  const viewer = val.viewer
  const height = val.height
  const nearDistance =
    val.distanceDisplayCondition[0] == undefined
      ? 0
      : val.distanceDisplayCondition[0]
  const farDistance =
    val.distanceDisplayCondition[1] == undefined
      ? 50000000
      : val.distanceDisplayCondition[1]
  const position = val.Cesium.Cartesian3.fromDegrees(
    val.position[0],
    val.position[1],
    val.height
  )
  let title = val.title
  let id = val.id
  let content = val.content
  let ccolor = val.color
  let date = val.date
  let posname = val.name
  let posInfor = val.posInfor
  let weatherData = val.weatherData
  let metarData = val.metarData
  // const vmInstance = new WindowVm({
  // 	propsData: {
  // 		title,
  // 		id
  // 	}
  // }).$mount(); //根据模板创建一个面板
  let app = null
  app = createApp(accidentLabel, {
    title,
    id,
    content,
    ccolor,
    date,
    posname
  })
  // const
  const root = document.createElement('div')
  document.body.appendChild(root)

  app.mount(root)
  // console.log(root);

  const option = {
    Cesium,
    viewer,
    height,
    nearDistance,
    farDistance,
    position,
    root,
    offsetX: val.offsetX,
    offsetY: val.offsetY
  }

  //添加每一帧刷新监听处理
  viewer.scene.postRender.addEventListener(function () {
    window.postRender1(option)
  })
}
