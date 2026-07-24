import { onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
// import * as MSIMEarth from 'pieearthweb'
import {
  handleCluster,
  date2String,
  eventControllerSSEClose
} from '@/utils/mapTools'
import emitter from '@/utils/eventbus'
import * as EarthPlugn from '@/utils/earthPlugin/earthPlugin.js'
import { SSEClose } from '@/service/SSE'
import { setTimeLimeStyle } from '@/utils/timeLineStyle'
import { replayUpdateTime, deduceStart } from '@/service/replayTime'
import { ElLoading } from 'element-plus'
import {
  seatInit,
  plotInit,
  earthDataInit,
  timeInit,
  sceneInit,
  eventListenerInit,
  eventListenerDInit,
  tempSimulationScript,
  restartScene
} from './initConfig/index'
import { showSatellitLngLat } from '@/utils/earthPlugin/core/actionController/satellitCZML'
import { entityShowByViewExtend } from '@/utils/earthPlugin/ThirdParty/cameraControl/cameraControl'
import {
  webCZML,
  primitive,
  seaAirJointOperationsPA,
  seaAirJointOperationsPD,
  seaAirJointOperationsSceneTime
} from '@/utils/earthPlugin/ThirdParty/eventSource/event/earthEvent'
import {
  RE_STrack,
  RE_LTrack,
  SU,
  RE_WeaponF,
  RE_Jam,
  RE_MissileIntercept,
  RE_MR,
  Task_Aign,
  RE_WeaponWH,
  RE_SDC,
  RE_InterferenceRange,
  RE_JamA,
  RE_Comment
} from '@/utils/earthPlugin/ThirdParty/eventSource/event/earthActionByEvent'
import cameraZoom from './initConfig/cameraListener.js'
import EventMQController from '@/utils/earthPlugin/ThirdParty/eventSource/proto/ARSIMByMQ.js'
import { getEntityInfo } from './initConfig/HUD.js'
import { ARSIMInfoHandle } from '@/utils/earthPlugin/ThirdParty/eventSource/event/earthEvent'
const token =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqdGkiOiIxNGNmNjU4Yi1iMWM0LTQ5YzEtYjkyZC0wNzliODdkYzlhMWIiLCJpZCI6NDUzNTAsImlhdCI6MTYxNDkzMjg1Mn0.lt2c05x6ZZYu6-tlJ1xMUnFIbr3a7KJOZNB_Afkt9RQ'
import ProtoBufController from '@/utils/earthPlugin/ThirdParty/eventSource/proto/protobufMQ'
export default function () {
  const store = useStore()
  // 只有等元素挂载渲染后，才可以将 html元素与cesium的viewer挂载wjxian
  onMounted(() => {

    const isLowPerformance =
      window.devicePixelRatio > 1.5 ||
      navigator.userAgent.match(/Mobile|Android|iOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/)

    // *****************初始化地球********************
    let viewer = new Cesium.Viewer('container', {
      targetFrameRate: 120,
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
      requestRenderMode: false, // 启用请求渲染模式,false时禁用按需渲染
      scene3DOnly: true, // 每个几何实例将只能以3D渲染以节省GPU内存
      sceneMode: 3, // 初始场景模式 1 2D模式 2 2D循环模式 3 3D模式  Cesium.SceneMode
      fullscreenElement: document.body, // 全屏时渲染的HTML元素 暂时没发现用处
      selectionIndicator: false, //双击绿框
      distanceEntitise: [],
      orderIndependentTranslucency: false, // 关闭顺序无关透明度
      // contextOptions: {
      //   requestWebgl2: true,
      //   webgl: {
      //     alpha: false,
      //     depth: true,
      //     stencil: false,
      //     antialias: !isLowPerformance, // 低性能设备关闭抗锯齿
      //     preserveDrawingBuffer: false
      //   }
      // }
    })
    window.MSIMEarth = Cesium
    window.MSIMEarth.Ion.defaultAccessToken = token
    window.EarthViewer = viewer
    window.EarthPlugn = EarthPlugn
    window.MEarth = window.MSIMEarth

    window.MSIMEarth.defaultValue = (a3, b) => {
      if (a3 !== void 0 && a3 !== null) {
        return a3
      }
      return b
    }

    // let terrainProvider = window.MSIMEarth.createWorldTerrain({
    //   requestVertexNormals: true, // 向服务器请求顶点法线，开启山体光照
    //   requestWaterMask: true      // 向服务器请求水掩码，开启海面动画
    // })

    // window.EarthViewer.terrainProvider = terrainProvider

    // 初始化数据控制器
    let dataController = new window.EarthPlugn.DataControl({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
    // 添加bing全球高清影像
    dataController.addbingLayer()
    // 保存数据控制器供图层控制使用
    store.commit('setDataControl', dataController)

    // ****************地球基础显示效果配置**********************
    window.EarthViewer.scene.globe.depthTestAgainstTerrain = true
    // 打开fps
    window.EarthViewer.scene.debugShowFramesPerSecond = false

    window.EarthViewer.scene.skyBox = new window.MSIMEarth.SkyBox({
      sources: {
        positiveX: 'static/image/skyBox/px.png',
        negativeX: 'static/image/skyBox/nx.png',
        positiveY: 'static/image/skyBox/py.png',
        negativeY: 'static/image/skyBox/ny.png',
        positiveZ: 'static/image/skyBox/pz.png',
        negativeZ: 'static/image/skyBox/nz.png'
      }
    })
    window.EarthViewer.scene.skyAtmosphere.show = true
    window.EarthViewer.scene.skyAtmosphere.perFragmentAtmosphere = !isLowPerformance // 低性能设备关闭每片段大气计算
    // window.EarthViewer.scene.skyAtmosphere.saturationShift = 1.0
    // window.EarthViewer.scene.skyAtmosphere.hueShift = -1.0
    window.EarthViewer.scene.undergroundMode = true
    window.EarthViewer.scene.sun.show = true
    window.EarthViewer.scene.fog.enabled = true
    window.EarthViewer.scene.globe.enableLighting = false
    window.EarthViewer.scene.globe.showGroundAtmosphere = true
    window.EarthViewer.scene.postProcessStages.fxaa.enabled = true
    // window.EarthViewer.scene.fxaa = false // 新版本使用上面的方式
    window.EarthViewer.scene.globe.maximumScreenSpaceError = 1.2
    // 开启雾效，用白色或淡蓝色雾覆盖远处的渲染错误

    window.EarthViewer._cesiumWidget._creditContainer.style.display = 'none'

    window.EarthViewer.cesiumWidget.screenSpaceEventHandler.removeInputAction(
      window.MSIMEarth.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    )

    // const imageryProvider =
    //   new window.MSIMEarth.WebMapTileServiceImageryProvider({
    //     url: 'http://{s}.tianditu.gov.cn/vec_w/wmts?tk=816517e17d1cc31c6eec03ef9fc4bb5b',
    //     layer: 'vec',
    //     style: 'default',
    //     format: 'tiles',
    //     tileMatrixSetID: 'w',
    //     subdomains: ['t0', 't1', 't2', 't3', 't4', 't5', 't6', 't7'],
    //     minimumLevel: 0,
    //     maximumLevel: 18,
    //     credit: 'Tianditu'
    //   })
    // window.EarthViewer.imageryLayers.addImageryProvider(imageryProvider) //加载矢量底图

    // const tdtImgProvider = new Cesium.UrlTemplateImageryProvider({
    //   // 天地图影像瓦片URL模板（关键！）
    //   // 参数说明：T=img_w 表示影像底图；x,y,z为行列号与层级；tk=你的密钥
    //   url: 'https://t{s}.tianditu.gov.cn/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=816517e17d1cc31c6eec03ef9fc4bb5b',
    //   // 子域列表，用于负载均衡，加速瓦片加载
    //   subdomains: ['0', '1', '2', '3', '4', '5', '6', '7'],
    //   // 投影方式：天地图在线服务使用Web墨卡托投影(EPSG:3857)
    //   tilingScheme: new Cesium.WebMercatorTilingScheme(),
    //   // 最大缩放级别（天地图影像一般支持18级）
    //   maximumLevel: 18,
    //   // 最小缩放级别
    //   minimumLevel: 1
    // })

    // // 4. 将图层添加到Viewer中
    // viewer.imageryLayers.addImageryProvider(tdtImgProvider)

    if (window.MSIMEarth.FeatureDetection.supportsImageRenderingPixelated()) {
      //判断是否支持图像渲染像素化处理
      window.EarthViewer.resolutionScale = window.devicePixelRatio
    }

    let imageryProviderViewModels =
      window.EarthViewer.baseLayerPicker.viewModel.imageryProviderViewModels
    window.EarthViewer.baseLayerPicker.viewModel.selectedImagery =
      window.EarthViewer.baseLayerPicker.viewModel.imageryProviderViewModels[
      imageryProviderViewModels.length - 1
      ]
    let baseLayerConfig = window.EarthViewer.imageryLayers.get(1)
    baseLayerConfig.brightness = 0.9
    baseLayerConfig.contrast = 1.0
    baseLayerConfig.hue = 0
    baseLayerConfig.saturation = 1.6
    baseLayerConfig.gamma = 0.6
    baseLayerConfig.magnificationFilter = window.MSIMEarth.TextureMagnificationFilter.NEAREST
    baseLayerConfig.minificationFilter = window.MSIMEarth.TextureMinificationFilter.NEAREST
    window.EarthViewer.scene.globe.terrainExaggeration = 1.0
    // window.EarthViewer.scene.skyAtmosphere.perFragmentAtmosphere = true
    // window.EarthViewer.scene.skyAtmosphere.saturationShift = 1.0  //同步pieearth大气圈色调
    // window.EarthViewer.scene.screenSpaceCameraController.minimumZoomDistance = 200
    window.EarthViewer.scene.screenSpaceCameraController.maximumZoomDistance = 110000000 //最大缩放距离 17016740 //
    // window.EarthViewer.trackedEntityChanged.addEventListener(function () {
    //   window.EarthViewer.trackedEntity = undefined
    // })

    // // 优化地球表面材质
    // viewer.scene.globe.enableLighting = !isLowPerformance
    // viewer.scene.globe.depthTestAgainstTerrain = true

    // 调整分辨率以提高性能
    if (isLowPerformance) {
      viewer.resolutionScale = 0.75
    }

    // // 优化内存管理
    // viewer.memory.minimumBytesNeeded = 512 * 1024 * 1024 // 512MB

    // 优化渲染循环
    viewer.scene.requestRenderMode = true
    viewer.scene.maximumRenderTimeChange = 1.0 / 30 // 最低30fps

    // 关闭不必要的后处理效果
    viewer.scene.postProcessStages.fxaa.enabled = false

    // 设置隐藏时间轴
    window.EarthViewer.timeline.container.style.zIndex = -1
    // 修改距离比例尺样式 .distance-legend .distance-legend-label
    const distanceLegent =
      window.EarthViewer.container.querySelector('.distance-legend')
    const distanceLegentLabel = window.EarthViewer.container.querySelector(
      '.distance-legend-label'
    )
    if (distanceLegent) {
      distanceLegent.style.right = '0px'
    }
    if (distanceLegentLabel) {
      distanceLegent.style.fontSize = '12px'
    }
    const sceneAction = new window.EarthPlugn.sceneAction({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
    window.sceneAction = sceneAction
    // 鼠标事件
    window.sceneAction.mouseEventsController.loadMouseEvents({})
    // 相机移动
    window.sceneAction.mouseEventsController.viewpointHeight()
    window.EarthViewer.scene.morphComplete.addEventListener(function () {
      //解决2D模式下相机高度过高，不显示模型问题
      if (window.EarthViewer.scene.mode === 2) {
        window.EarthViewer.scene.camera.position.z = 63781370
      }
    })
    // const gaodeVector = new window.MSIMEarth.UrlTemplateImageryProvider({
    //   url: 'https://webrd01.is.autonavi.com/appmaptile?lang=zh_cn&size=1&scale=1&style=8&x={x}&y={y}&z={z}',
    //   name: '高德矢量地图'
    // })
    // window.EarthViewer.imageryLayers.addImageryProvider(gaodeVector)
    // window.EarthViewer.scene.morphTo2D(0)
    // LoadClouds(window.EarthViewer, window.MSIMEarth)
    // 进入系统的第一个默认视角
    window.EarthViewer.camera.flyTo({
      // destination: new window.MSIMEarth.Cartesian3.fromDegrees(109.87, 34.706, 21851000),
      destination: new window.MSIMEarth.Cartesian3(
        // -5418244.193941416,
        // 17724932.69795304,
        // 14148138.71947941
        -5028870.068229716,
        15522392.614902738,
        12037042.562695488
      ),
      complete: async () => {

        var handler = new window.MSIMEarth.ScreenSpaceEventHandler(window.EarthViewer.scene.canvas) // 鼠标移动
        let movePosition
        let cartesian
        let lat2
        let lng2
        let alt2
        handler.setInputAction(function (movement) {
          // cartesian = viewer.scene.pickPosition(movement.endPosition);
          cartesian = viewer.camera.pickEllipsoid(movement.position, viewer.scene.globe.ellipsoid)
          if (window.MSIMEarth.defined(cartesian)) {
            var cartographic = window.MSIMEarth.Cartographic.fromCartesian(cartesian)
            lat2 = window.MSIMEarth.Math.toDegrees(cartographic.latitude)
            lng2 = window.MSIMEarth.Math.toDegrees(cartographic.longitude)
            alt2 = cartographic.height //469718
            movePosition = window.MSIMEarth.Cartesian3.fromDegrees(lng2, lat2, alt2)
            console.log(lng2, lat2, alt2)
          }
        }, window.MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)
        // 1 时间体系初始化
        timeInit()
        // setTimeout(()=>{
        //   window.plot = new EarthPlugn.plot()
        // },2000)
        //初始化场景配置
        sceneInit()
        // 1 ************地图初始化*******************
        earthDataInit()
        // window.EarthViewer.entities.add({
        //   id: 'point',
        //   position: window.MSIMEarth.Cartesian3.fromDegrees(86.90394, 39.347151, 1000),
        //   point: {
        //     pixelSize: 10,
        //     color: window.MSIMEarth.Color.RED
        //   }
        // })

        // // proto
        // const protoController = new ProtoBufController()
        // protoController.initProto()
        // // event
        // const eventMQController = new EventMQController()
        // eventMQController.initEventMQ()

        // setTimeout(() => {
        //   dataController._addDaoLian()
        //   dataController.addNineLine()
        // }, 1000)
        // // 监听相机缩放事件
        // // cameraZoom()

        // // 是否重启
        // if (JSON.parse(localStorage.getItem('isRestartScene'))) {
        //   let row = window.localStorage.getItem('currentSceneInfo')
        //   row = JSON.parse(row)
        //   // 重启
        //   restartScene(row)
        // }
        return

        // 取消return语句，让后续代码继续执行
        const { handleWebCzmlUpdate } = webCZML()
        const { handlePD } = seaAirJointOperationsPD()
        const { handlePA } = seaAirJointOperationsPA()
        const { handleWebPrimitiveUpdate } = primitive()
        const { initTrackLine, dropTrackLine } = RE_LTrack()
        const { initSTrackLine, dropSTrackLine } = RE_STrack()
        const { sensorSwitch2 } = SU()
        const { getSceneTime } = seaAirJointOperationsSceneTime()
        const { initWeaponFLine } = RE_WeaponF()
        const { initJamATrackLine, dropJamATrackLine } = RE_JamA()
        const { initJamLine, dropJamLine, sensorJam } = RE_Jam()

        window.localStorage.setItem('side', 'admin')

        const socket = new WebSocket('ws://192.168.1.48:8091') //ws://10.1.58.60:8091
        socket.binaryType = 'arraybuffer'
        socket.addEventListener('open', function (event) {
          // 发送UDP数据
        })
        socket.onopen = function () {
          console.log('Connected to server 192.168.1.48:8091')
        }
        socket.onclose = function () {
          console.log('Disconnected from server')
        }
        socket.onmessage = function (event) {
          // const data = new Uint8Array(event.data)
          // const message = MyMessage.decode(data)
          // console.log('message', event.blob())

          // return
          try {
            // let msg = JSON.parse(event.data)
            let msg = arrayBufferToJson(event.data)
            switch (msg.Type) {
              case 'MU':
                handleWebPrimitiveUpdate(msg)
                // handleWebCzmlUpdate(msg)
                break
              case 'Statistics':
                break
              case 'AT':
                window.EarthViewer.clock.multiplier = msg.Data.R
                getSceneTime(msg.Data)
                if (msg.Data.T === 12) {
                  zlsz()
                }
                if (msg.Data.T === 15) {
                  console.log('自定义效果', msg.Data.T)
                  // 模拟卫星开机SU事件
                  let dataController = new window.EarthPlugn.DataControl({
                    earth: window.MSIMEarth,
                    viewer: window.EarthViewer
                  })
                  dataController.satelliteTurnOn()
                  setTimeout(() => {
                    dataController.satelliteTurnOff()
                  }, 44000)
                }
                if (msg.Data.T === 60) {
                  // dmz_1给kj-500通信
                  console.log('dmztokj500')
                  dmzToKJ500()
                }
                if (msg.Data.T === 63) {
                  // dmz_1给kj-500通信
                  KJ500ToOthers()
                }
                break
              // case 'RE_STrackInit':
              //   // handlePA(msg)
              //   break
              // case 'RE_LTrackInit':
              //   // handlePA(msg)
              //   break
              // case 'RE_STrackDrop':
              //   // handlePA(msg)
              //   break
              // case 'SimState':
              //   // handlePA(msg)
              //   break
              case 'PD':
                handlePD(msg)
                break
              default:
                // console.log('状态类事件', msg.Type, msg)
                // store.state.AFSIMModule.initData.push(msg)
                stateMsg(msg)
                break
            }
          } catch (error) {
            console.log('error', error)
          }
        }

        function arrayBufferToJson(arrayBuffer) {
          // 将 ArrayBuffer 转换为字符串
          const decoder = new TextDecoder('utf-8')
          const jsonString = decoder.decode(arrayBuffer)

          // 将字符串解析为 JSON 对象
          const jsonData = JSON.parse(
            jsonString.substring(0, jsonString.length - 1)
          )
          return jsonData
        }
        function stateMsg(msg) {
          switch (msg.Type) {
            case 'PA':
              handlePA(msg)
              // const data = {
              //   PAID: msg.Data.Name,
              //   PAData: msg.Data,
              //   AFSIMPAKey: msg.Data.Name
              // }
              // indexedDBController.writeData(data)
              break
            case 'NotifyMessage':
              // 场景第一条信息，每个场景只在启动时法一次
              //   {
              //     "Data": {
              //         "message": "begin send message"
              //     },
              //     "Type": "NotifyMessage"
              // }
              // 可以配置一个全局变量来相应该信息并进一步判定系统页面是刷新操作还是首次获取信息等（indexDB存储PA需要保证只存当前进行的场景，避免数据不断增加）
              break
            case 'RE_LTrackInit':
              // 更复杂的雷达探测类消息链，可能包含上一层的消息源SourceTrackID，这里SourceTrackID与OwnPID通信，SourceTrackID与tName（即对应的RE_STrackInit）形成探测连
              // sName即OwnPID与tName先不连线
              if (
                msg.Data.SourceTrackID === 'YAOGAN' &&
                (msg.Data.OwnPID === 'dmz_1' || msg.Data.OwnPID === 'YAOGAN')
              ) {
                // console.log('RE_LTrackInit', msg.Type, msg)
                initTrackLine(msg)
              }

              break
            case ' RE_LTrackDrop':
              // console.log('RE_LTrackDrop', msg.Type, msg)
              dropTrackLine(msg)
              break
            case 'RE_STrackInit':
              // console.log('RE_STrackInit', msg.Type, msg)
              //连线探测，即RE_LTrackInit 中SourceTrackID到TName的直接表达，暂时只用RE_LTrackInit
              //传感器追踪目标
              initSTrackLine(msg)
              break
            case 'RE_STrackDrop':
              // console.log('RE_STrackDrop', msg.Type, msg)
              //传感器追踪删除
              dropSTrackLine(msg)
              break
            case 'SU':
              console.log('SU', msg.Type, msg)
              sensorSwitch2(msg)
              break
            case 'RE_MR':
              break
            case 'RE_WeaponF':
              // console.log('RE_WeaponF', msg.Type, msg)
              initWeaponFLine(msg)
              break
            case 'RE_JamE':
              // console.log('RE_JamE', msg.Type, msg)
              dropJamATrackLine(msg)
              break
            case 'RE_JamA':
              console.log('RE_JamA', msg.Type, msg)
              initJamATrackLine(msg)
              break
            case 'RE_JamT':
              // console.log('RE_JamT', msg.Type, msg)
              dropJamATrackLine(msg)
              // 恢复雷达遮罩
              // resumeRadar(json)
              break
            default:
              // console.log('others', msg.Type, msg)
              break
          }
        }
      }
    })
    // setTimeLimeStyle() //格式化时间轴
    // 监听时间轴点击事件
    window.date2String = date2String
    window.EarthViewer.timeline.addEventListener('mouseup', function (event) {
      window.EarthViewer.clock.shouldAnimate = false
      let newTimeStr = date2String(
        window.MSIMEarth.JulianDate.toDate(
          window.EarthViewer.clock.currentTime
        ),
        -8 * 3600 * 1000
      )
      updataTimeByReplay(newTimeStr)
      const loading = ElLoading.service({
        lock: true,
        text: '加载数据中...',
        background: 'rgba(0, 0, 0, 0.7)'
      })
      setTimeout(() => {
        const formData1 = new FormData()
        formData1.append('recordId', store.getters.getRecordId)
        console.log('当前记录id', formData1)
        deduceStart(formData1).then((res) => {
          if (res.code == 200) {
            loading.close()
            window.EarthViewer.clock.shouldAnimate = true
          }
        })
      }, 3000)
    })
    const updataTimeByReplay = async (newTime) => {
      // 更新当前场景时间后台
      const formData = new URLSearchParams()
      if (!store.state.sceneModule.recordId) return
      let sceneStartTime = new Date(
        store.state.sceneModule.fightStartTime
      ).getTime()
      let currentTime = new Date(newTime).getTime()
      if (currentTime < sceneStartTime) return
      let diff = (currentTime - sceneStartTime) / 1000
      formData.append('recordId', store.state.sceneModule.recordId)
      formData.append('time', diff)
      let res = await replayUpdateTime(formData)
      if (res.code != 200) return
      // window.EarthViewer.clock.currentTime = window.MSIMEarth.JulianDate.fromDate(new Date(newTime))
    }
    // 指令上注
    const zlsz = () => {
      const option = {
        earth: window.MSIMEarth,
        viewer: window.EarthViewer
      }
      const sceneAction = new window.EarthPlugn.sceneAction(option)
      let color = window.MSIMEarth.Color.fromCssColorString('#0a78e9')
      sceneAction.connectLineManagement.addLineByRay({
        sourId: 'dmz_2',
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
          msg: '信息发送↓↓'
        },
        materialImg: require('/public/static/image/texture/通信.png')
      })
    }
    // 地面站向kj500发消息
    const dmzToKJ500 = () => {
      const option = {
        earth: window.MSIMEarth,
        viewer: window.EarthViewer
      }
      const sceneAction = new window.EarthPlugn.sceneAction(option)
      let color = window.MSIMEarth.Color.fromCssColorString('#0a78e9')
      sceneAction.connectLineManagement.addLineByRay({
        sourId: 'dmz_1',
        targetId: 'KJ-500',
        color: color,
        type: 'RE_MR',
        width: 32,
        Raywidth: 8,
        mix: 1.0,
        show: true,
        radius: 300000,
        endOptions: {
          entityId: 'KJ-500',
          czmlSource: 'MSIMEarthCZMLProcessContainer',
          type: 'RE_MR',
          title: 'KJ-500',
          msg: '指令上注↓↓'
        },
        materialImg: require('/public/static/image/texture/jt11.png')
      })
    }
    // kj500向其他编组发消息
    const KJ500ToOthers = () => {
      const option = {
        earth: window.MSIMEarth,
        viewer: window.EarthViewer
      }
      const sceneAction = new window.EarthPlugn.sceneAction(option)
      let color = window.MSIMEarth.Color.fromCssColorString('#0a78e9')
      let targets = [
        'wz-7_1',
        'wz-10_1',
        'ss-uav_1',
        'ss-uav_2',
        'wz-8_1',
        'gj-11_1'
      ]
      targets.forEach((e) => {
        sceneAction.connectLineManagement.addLineByRay({
          sourId: 'KJ-500',
          targetId: e,
          color: color,
          type: 'RE_MR',
          width: 32,
          Raywidth: 8,
          mix: 1.0,
          show: true,
          radius: 300000,
          endOptions: {
            entityId: e,
            czmlSource: 'MSIMEarthCZMLProcessContainer',
            type: 'RE_MR',
            title: e,
            msg: '接收情报↓↓'
          },
          materialImg: require('/public/static/image/texture/jt11.png')
        })
      })
    }
  })

  onUnmounted(() => {
    if (EventController) {
      eventControllerSSEClose(EventController)
    }
  })
  return {}
}
