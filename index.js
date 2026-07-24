// import { reject, resolve } from "core-js/fn/promise";
let Cesium = require('cesium/Cesium')
let widgets = require('cesium/Widgets/widgets.css')

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNGNmNjU4Yi1iMWM0LTQ5YzEtYjkyZC0wNzliODdkYzlhMWIiLCJpZCI6NDUzNTAsImlhdCI6MTYxNDkzMjg1Mn0.lt2c05x6ZZYu6-tlJ1xMUnFIbr3a7KJOZNB_Afkt9RQ'

class XCEarth {
  XEarth
  domID
  EarthViewer
  viewerConfig = {
    animation: false, // 是否显示动画控件
    shouldAnimate: true,
    homeButton: false, // 是否显示Home按钮
    fullscreenButton: false, // 是否显示全屏按钮
    baseLayerPicker: true, // 是否显示图层选择控件
    geocoder: false, // 是否显示地名查找控件
    timeline: false, // 是否显示时间线控件
    sceneModePicker: false, // 是否显示投影方式控件
    navigationHelpButton: false, // 是否显示帮助信息控件
    infoBox: false, // 是否显示点击要素之后显示的信息
    requestRenderMode: true, // 启用请求渲染模式
    scene3DOnly: false, // 每个几何实例将只能以3D渲染以节省GPU内存
    sceneMode: 3, // 初始场景模式 1 2D模式 2 2D循环模式 3 3D模式  Cesium.SceneMode
    fullscreenElement: document.body, // 全屏时渲染的HTML元素 暂时没发现用处
    selectionIndicator: false, //双击绿框
    distanceEntitise: []
  }

  constructor(domID, viewerConfig) {
    this.XEarth = Cesium
    this.domID = domID
    this.viewerConfig = Object.assign(viewerConfig || {}, this.viewerConfig)
    this.initEarth(this.domID)
  }
  initEarth(domID) {
    this.XEarth.Ion.defaultAccessToken = token
    this.EarthViewer = new this.XEarth.Viewer(domID, this.viewerConfig)
    //去cesium logo水印
    this.EarthViewer.cesiumWidget.creditContainer.style.display = 'none'
    //取消双击事件
    this.EarthViewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      this.XEarth.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    )

    //取消跟踪实体
    // this.EarthViewer.trackedEntityChanged.addEventListener(function () {
    //   this.EarthViewer.trackedEntity = undefined;
    // });
  }
}
export default XCEarth
