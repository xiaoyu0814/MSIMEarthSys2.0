import { onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import * as MSIMEarth from 'pieearthweb'
import emitter from '@/utils/eventbus'
import * as EarthPlugn from '@/utils/earthPlugin/earthPlugin.js'
// import CesiumNavigation from 'cesium-navigation-es6'

const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNGNmNjU4Yi1iMWM0LTQ5YzEtYjkyZC0wNzliODdkYzlhMWIiLCJpZCI6NDUzNTAsImlhdCI6MTYxNDkzMjg1Mn0.lt2c05x6ZZYu6-tlJ1xMUnFIbr3a7KJOZNB_Afkt9RQ'

export default function () {
  const store = useStore()
  // 只有等元素挂载渲染后，才可以将 html元素与cesium的viewer挂载wjxian
  onMounted(() => {
    // *****************初始化地球********************
    window.MSIMEarthContainerTraReplay = new MSIMEarth.XCEarth(
      'containerTrajectoryReplay',
      {
        timeline: true,
        animation: true,
        shouldAnimate: true,
        homeButton: false, // 是否显示Home按钮
        fullscreenButton: false, // 是否显示全屏按钮
        baseLayerPicker: true, // 是否显示图层选择控件
        geocoder: false, // 是否显示地名查找控件
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
    )
    window.MSIMEarthTraReplay = window.MSIMEarthContainerTraReplay.XEarth
    window.MSIMEarthTraReplay.Ion.defaultAccessToken = token
    window.EarthViewerTraReplay = window.MSIMEarthContainerTraReplay.EarthViewer
    window.EarthPlugnTraReplay = EarthPlugn

    // 1 ************地图初始化*******************
    // 初始化 dataControl类
    let dataController = new window.EarthPlugnTraReplay.DataControl({
      earth: window.MSIMEarthTraReplay,
      viewer: window.EarthViewerTraReplay
    })
    dataController.addVectorLayer() // 添加矢量底图

    // ****************配置沙盘********************
    var options = {}
    // 用于在使用重置导航重置地图视图时设置默认视图控制。接受的值是window.MSIMEarth.Cartographic 和window.MSIMEarth.Rectangle.
    options.defaultResetView = window.MSIMEarthTraReplay.Rectangle.fromDegrees(
      65.82077251432172,
      47.06889581479351,
      158.32151176063513,
      33.7335741260239
    )
    // 用于启用或禁用罗盘。true是启用罗盘，false是禁用罗盘。默认值为true。如果将选项设置为false，则罗盘将不会添加到地图中。
    options.enableCompass = false
    // 用于启用或禁用缩放控件。true是启用，false是禁用。默认值为true。如果将选项设置为false，则缩放控件 将不会添加到地图中。
    options.enableZoomControls = false
    // 用于启用或禁用距离图例。true是启用，false是禁用。默认值为true。如果将选项设置为false，距离图例将不会添加到地图中。
    options.enableDistanceLegend = true
    // 用于启用或禁用指南针外环。true是启用，false是禁用。默认值为true。如果将选项设置为false，则该环将可见但无效。
    options.enableCompassOuterRing = false
    // new CesiumNavigation(window.EarthViewerTraReplay, options)

    // ****************地球基础显示效果配置**********************
    window.EarthViewerTraReplay.scene.globe.depthTestAgainstTerrain = false
    // 打开fps
    window.EarthViewerTraReplay.scene.debugShowFramesPerSecond = false

    window.EarthViewerTraReplay.scene.skyBox =
      new window.MSIMEarthTraReplay.SkyBox({
        sources: {
          positiveX: 'static/image/skyBox/px.png',
          negativeX: 'static/image/skyBox/nx.png',
          positiveY: 'static/image/skyBox/py.png',
          negativeY: 'static/image/skyBox/ny.png',
          positiveZ: 'static/image/skyBox/pz.png',
          negativeZ: 'static/image/skyBox/nz.png'
        }
      })
    window.EarthViewerTraReplay.scene.skyAtmosphere.show = true
    window.EarthViewerTraReplay.scene.skyAtmosphere.perFragmentAtmosphere = true
    window.EarthViewerTraReplay.scene.skyAtmosphere.saturationShift = 1.0
    window.EarthViewerTraReplay.scene.undergroundMode = true
    window.EarthViewerTraReplay.scene.sun.show = true
    window.EarthViewerTraReplay.scene.fog.enabled = true
    window.EarthViewerTraReplay.scene.globe.enableLighting = false
    window.EarthViewerTraReplay.scene.globe.showGroundAtmosphere = true
    //window.EarthViewerTraReplay.scene.postProcessStages.fxaa.enabled = true //去锯齿 是文字清晰
    window.EarthViewerTraReplay.scene.postProcessStages.fxaa.enabled = true
    // window.EarthViewerTraReplay.scene.fxaa = false // 新版本使用上面的方式
    // window.EarthViewerTraReplay.scene.globe.maximumScreenSpaceError = 1.2

    if (
      window.MSIMEarthTraReplay.FeatureDetection.supportsImageRenderingPixelated()
    ) {
      //判断是否支持图像渲染像素化处理
      window.EarthViewerTraReplay.resolutionScale = window.devicePixelRatio
    }
    let imageryProviderViewModels =
      window.EarthViewerTraReplay.baseLayerPicker.viewModel
        .imageryProviderViewModels
    window.EarthViewerTraReplay.baseLayerPicker.viewModel.selectedImagery =
      window.EarthViewerTraReplay.baseLayerPicker.viewModel.imageryProviderViewModels[
      imageryProviderViewModels.length - 1
      ]
    let baseLayerConfig = window.EarthViewerTraReplay.imageryLayers.get(1)
    if (baseLayerConfig) {
      baseLayerConfig.brightness = 0.9
      baseLayerConfig.contrast = 1.0
      baseLayerConfig.hue = 0
      baseLayerConfig.saturation = 1.6
      baseLayerConfig.gamma = 0.6
      baseLayerConfig.magnificationFilter =
        window.MSIMEarthTraReplay.TextureMagnificationFilter.NEAREST
      baseLayerConfig.minificationFilter =
        window.MSIMEarthTraReplay.TextureMinificationFilter.NEAREST
    }
    window.EarthViewerTraReplay.scene.globe.terrainExaggeration = 1.0
    window.EarthViewerTraReplay.scene.skyAtmosphere.show = true
    window.EarthViewerTraReplay.scene.skyAtmosphere.perFragmentAtmosphere = true
    // window.EarthViewerTraReplay.scene.skyAtmosphere.saturationShift = 1.0  //同步pieearth大气圈色调
    // window.EarthViewerTraReplay.scene.screenSpaceCameraController.minimumZoomDistance = 200
    window.EarthViewerTraReplay.scene.screenSpaceCameraController.maximumZoomDistance = 110000000 //最大缩放距离 17016740 //
    // window.EarthViewerTraReplay.trackedEntityChanged.addEventListener(function () {
    //   window.EarthViewerTraReplay.trackedEntity = undefined
    // })

    // 设置隐藏时间轴
    window.EarthViewerTraReplay.timeline.container.style.zIndex = -1

    const sceneAction = new window.EarthPlugnTraReplay.sceneAction({
      earth: window.MSIMEarthTraReplay,
      viewer: window.EarthViewerTraReplay
    })
    window.sceneAction = sceneAction
    // 鼠标事件
    // window.sceneAction.mouseEventsController.loadMouseEvents({})
    // 相机移动
    window.sceneAction.mouseEventsController.viewpointHeight()
    window.EarthViewerTraReplay.scene.morphComplete.addEventListener(
      function () {
        //解决2D模式下相机高度过高，不显示模型问题
        if (window.EarthViewerTraReplay.scene.mode === 2) {
          window.EarthViewerTraReplay.scene.camera.position.z = 63781370
        }
      }
    )
    // 进入系统的第一个默认视角
    window.EarthViewerTraReplay.camera.flyTo({
      destination: new window.MSIMEarthTraReplay.Cartesian3(
        // -5418244.193941416,
        // 17724932.69795304,
        // 14148138.71947941
        -5028870.068229716,
        15522392.614902738,
        12037042.562695488
      ),
      complete: () => {
        // *************底图定位到初始位置后激活对应功能************
      }
    })
  })
  onUnmounted(() => { })
  return {}
}
