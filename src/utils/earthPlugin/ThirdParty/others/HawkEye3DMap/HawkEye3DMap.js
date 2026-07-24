import emitter from '@/utils/eventbus'
/**
 * @description: 三维鹰眼地图及与主图联动
 * @param {*}
 * @return {*}
 */
export default class HawkEye3DMap {
  constructor(option) {
    // 主图
    this._viewer = option.viewer
    this.earth = option.earth
    // 鹰眼图
    this._hawkEyeMap = null
    // 判断事件是主图触发还是鹰眼地图触发
    this._isMainMapTrigger = false
    this._isEyeMapTrigger = false
  }

  // 初始化函数
  _init() {
    // this._divInit()
    this._mapInit()
  }

  // 创建div，并设置样式
  _divInit() {
    let hawkEyeDiv = document.createElement('div')
    hawkEyeDiv.setAttribute('id', 'hawkEye3dMap')
    hawkEyeDiv.style.cssText =
      'position: absolute;right: 5% ;top: 10% ;border-radius: 50% ;height: 200px;width: 200px;overflow: hidden;border: 2px solid #002FA7;'
    document.getElementsByTagName('body').item(0).appendChild(hawkEyeDiv)
  }

  _mapInit() {
    let that = this
    // div创建完成后才能初始化地图，否则会找不到div保错
    // 初始化地图
    this._hawkEyeMap = new this.earth.Viewer('hawkEye3dMap', {
      infoBox: false,
      geocoder: false,
      homeButton: false,
      sceneModePicker: false,
      baseLayerPicker: false,
      navigationHelpButton: false,
      animation: false,
      timeline: false,
      fullscreenButton: false
    })
    this._hawkEyeMap.cesiumWidget.creditContainer.style.display = 'none'
    this._hawkEyeMap.scene.backgroundColor = this.earth.Color.TRANSPARENT
    this._hawkEyeMap.imageryLayers.removeAll()

    // 鹰眼图中添加高德路网中文注记图（鹰眼图中坐标偏移一点不影响）
    // this._hawkEyeMap.imageryLayers.addImageryProvider(
    //   new that.earth.UrlTemplateImageryProvider({
    //     url: 'http://webrd02.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    //     minimumLevel: 3,
    //     maximumLevel: 18
    //   })
    // )
    this.addbingLayer()

    // 引起事件监听的相机变化幅度
    this._viewer.camera.percentageChanged = 0.02
    this._hawkEyeMap.camera.percentageChanged = 0.5
    this._hawkEyeMap.camera.setView({
      destination: new that.earth.Cartesian3(
        -3586306.731164629,
        6428618.952729358,
        3519330.8827421856
      )
    })

    // this._bindEvent()
    emitter.on('hawkEye3d', (res) => {
      this._hawkEyeMap.camera.flyTo({
        // destination: new window.MSIMEarth.Cartesian3.fromDegrees(109.87, 34.706, 21851000),
        destination: new window.MSIMEarth.Cartesian3(
          res.position.x,
          res.position.y,
          res.position.z
        ),
        // duration: 1,
        // orientation: {
        //   heading: 0,
        //   pitch: 0,
        //   roll: 0
        // },
        complete: () => {}
      })
    })
  }

  /**
   * 添加bing全球高清影像
   */
  addbingLayer() {
    let that = this
    let addLayer = true
    // 便利当前底图集合，如果已经存在bing底图则切换为显示
    this._hawkEyeMap.imageryLayers._layers.forEach((layer) => {
      if (layer.imageryProvider.name === 'bing底图hawk') {
        layer.show = true
        addLayer = false
      }
    })
    // 如果当前没有添加过全球矢量地图则添加
    if (addLayer) {
      let bingProvider = new that.earth.UrlTemplateImageryProvider({
        url: `http://192.168.1.30:9000/bingmaps/{z}/{x}/{y}.jpg`,
        tilingScheme: new that.earth.WebMercatorTilingScheme() //WebMercatorTilingScheme() //GeographicTilingScheme()
      })
      bingProvider.name = 'bing底图hawk'
      let bingLayer =
        this._hawkEyeMap.imageryLayers.addImageryProvider(bingProvider)
      bingLayer.show = true
      bingLayer.brightness = 1.5 //0.9 1.52
      bingLayer.contrast = 1.0
      bingLayer.hue = 0
      bingLayer.saturation = 1.6
      bingLayer.gamma = 0.7 //0.6 0.7
      // let baseLayerBZ = new window.MSIMEarth.UrlTemplateImageryProvider({
      //   url: layersUrlConfig.urlVBlackMap
      // })

      // baseLayerBZ.name = 'bing底图标注'
      // window.EarthViewer.imageryLayers.addImageryProvider(baseLayerBZ)
      // window.cameraListener2 = function () {
      //   var e = window.EarthViewer.camera.position
      //   if (window.MSIMEarth.Cartographic.fromCartesian(e).height < 80000) {
      //     // 显示自定义的天空盒
      //     bingLayer.show = true
      //   } else {
      //     bingLayer.show = false
      //   }
      // }
      // window.EarthViewer.camera.changed.addEventListener(window.cameraListener2)
    }
  }

  // 绑定事件
  _bindEvent() {
    // 鹰眼与主图同步
    this._viewer.camera.changed.addEventListener(this._syncEyeMap, this)
    // 第一次刷新渲染时联动
    this._viewer.scene.preRender.addEventListener(this._syncEyeMap, this)

    // 主图与鹰眼图同步
    this._hawkEyeMap.camera.changed.addEventListener(this._syncMap, this)
    this._hawkEyeMap.scene.preRender.addEventListener(this._syncMap, this)
  }

  // 同步主图与鹰眼地图
  _syncEyeMap() {
    let that = this
    // 监听主图
    new this.earth.ScreenSpaceEventHandler(this._viewer.canvas).setInputAction(
      () => {
        this._isMainMapTrigger = true
        this._isEyeMapTrigger = false
      },
      that.earth.ScreenSpaceEventType.MOUSE_MOVE
    )

    // 判断是否为主图移动
    if (!this._isMainMapTrigger) {
      return false
    }

    this._hawkEyeMap.camera.flyTo({
      destination: this._viewer.camera.position,
      orientation: {
        heading: this._viewer.camera.heading,
        pitch: this._viewer.camera.pitch,
        roll: this._viewer.camera.roll
      },
      duration: 0.0
    })
  }

  // 鹰眼地图与主图联动效果
  _syncMap() {
    let that = this
    // 监听鹰眼地图
    new that.earth.ScreenSpaceEventHandler(
      this._hawkEyeMap.canvas
    ).setInputAction(() => {
      this._isMainMapTrigger = false
      this._isEyeMapTrigger = true
    }, that.earth.ScreenSpaceEventType.LEFT_DOWN)

    // 判断是否为鹰眼地图移动
    if (!this._isEyeMapTrigger) {
      return false
    }
    this._viewer.camera.flyTo({
      destination: this._hawkEyeMap.camera.position,
      orientation: {
        heading: this._hawkEyeMap.camera.heading,
        pitch: this._hawkEyeMap.camera.pitch,
        roll: this._hawkEyeMap.camera.roll
      },
      duration: 0.0
    })
  }
}
