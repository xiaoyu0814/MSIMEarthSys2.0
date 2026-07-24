import Index from '@/components/earthComp/redSituation/index.vue'
import store from '@/store/index.js'
import { changePosNowByDragEntity } from '@/views/toolbar/layerList/hooks/guideCommand'
/**
 * 初始化球上各种标注数据
 */
export function earthDataInit() {
  // 初始化 dataControl类
  let dataController = new window.EarthPlugn.DataControl({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  // dataController._addHAJX()
  // dataController._addDHFKSBQ()
  // dataController.addTWFKSBQ()
  // dataController.add_twlabel()
  // dataController.add_bblabel()
  //dataController.addTWGQYX()
  // dataController.importantPoint()

  // dataController.addTWTerrian()
  // dataController.addbingLayer() // 添加bing全球高清影像
  dataController._addDaoLian()
  // dataController.addRoadVecMapLayer()
  // dataController.addVectorLayer() // 添加矢量底图
  // dataController 保存到store内，可以进一步优化为直接绑定
  store.commit('setDataControl', dataController)
  // DD航迹label色调配置
  store.commit('setStateInfoOutLineColor', [0.0, 0.0, 0.0, 1.0])
  //store.commit('setStateInfoColor', [1.0, 1.0, 1.0, 1.0])
  store.commit('setStateInfoColor', [255 / 255, 165 / 255, 0, 1]) //橘色
  // dataController.addGeojsonWeather({
  //   url: basicVectorData.tianqiquyu,
  //   id: '矢量天气'
  // }) //加载天气区域数据
  //dataController.addAirports()//加载机场数据
  // 激活拖动目标方法
  if (store.state.sceneModule.systemConfig.isDragPositioning) {
    changePosNowByDragEntity()
  }
  // addAFSIMIndexDB()
  // addARCGISLayer()
}
/**
 * 激活earthPlugn封装的后处理效果-createVibration
 */
export function postRender() {
  // let pr = new window.EarthPlugn.postRender(window.MSIMEarth)
  // const collection = window.EarthViewer.scene.postProcessStages
  // pr.createVibration(collection)
}
/**
 * 激活earthPlugin内扩展的自定义功能-近景天空盒
 */
export function cusExtend() {
  // let cusExtender = new window.EarthPlugn.extend()
  // cusExtender.getSkyBoxOnGround({
  //   sources: {
  //     positiveX: './static/image/skybox/2/px.png',
  //     negativeX: './static/image/skybox/2/nx.png',
  //     positiveY: './static/image/skybox/2/pz.png',
  //     negativeY: './static/image/skybox/2/nz.png',
  //     positiveZ: './static/image/skybox/2/py.png',
  //     negativeZ: './static/image/skybox/2/ny.png'
  //   },
  //   earth: window.MSIMEarth
  // })
  // cusExtender.skyBoxOnGround.setSkyBox(window.EarthViewer)
}
/**
 * 全局辉光效果
 */
export function earthGlow() {
  const setGlow = (viewModel) => {
    var bloom = window.EarthViewer.scene.postProcessStages.bloom
    bloom.enabled = Boolean(viewModel.show)
    bloom.uniforms.glowOnly = Boolean(viewModel.glowOnly)
    bloom.uniforms.contrast = Number(viewModel.contrast)
    bloom.uniforms.brightness = Number(viewModel.brightness)
    bloom.uniforms.delta = Number(viewModel.delta)
    bloom.uniforms.sigma = Number(viewModel.sigma)
    bloom.uniforms.stepSize = Number(viewModel.stepSize)
  }
  // setGlow(viewModel)
}

/**
 * 基于postRender监听事件封装
 */
export function postRenderListener() {
  // window.EarthViewer.scene.postRender.addEventListener(() => {
  //   let viewer = window.EarthViewer
  //   let Cesium = window.MSIMEarth
  //   const cartesian3 = viewer.camera.position
  //   let ellipsoid = viewer.scene.globe.ellipsoid
  //   let cartographic = ellipsoid.cartesianToCartographic(position)
  //   let height = cartographic.height
  //   if (window.fog) {
  //     if (height > 1000000) {
  //       window.fog.show(false)
  //     } else {
  //       window.fog.show(true)
  //     }
  //   }
  // })
}

/**
 * 自定义dataSource
 */
export function customDataSource() {
  // const stdataSource = new window.MSIMEarth.CustomDataSource('staticLabel')//静态目标数据源
  // window.EarthViewer.dataSources.add(stdataSource).then(data => {
  //   console.log(data);
  //   handleCluster(data)
  // })
}

/**
 * 监听视高控制实时目标显隐
 */
const getViewExtend = () => {
  let params = {}
  let extend = window.EarthViewer.camera.computeViewRectangle()
  if (typeof extend === 'undefined') {
    //2D下会可能拾取不到坐标，extend返回undefined,所以做以下转换
    let canvas = window.EarthViewer.scene.canvas
    let upperLeft = new window.MSIMEarth.Cartesian2(0, 0) //canvas左上角坐标转2d坐标
    let lowerRight = new window.MSIMEarth.Cartesian2(
      canvas.clientWidth,
      canvas.clientHeight
    ) //canvas右下角坐标转2d坐标

    let ellipsoid = window.EarthViewer.scene.globe.ellipsoid
    let upperLeft3 = window.EarthViewer.camera.pickEllipsoid(
      upperLeft,
      ellipsoid
    ) //2D转3D世界坐标

    let lowerRight3 = window.EarthViewer.camera.pickEllipsoid(
      lowerRight,
      ellipsoid
    ) //2D转3D世界坐标

    let upperLeftCartographic =
      window.EarthViewer.scene.globe.ellipsoid.cartesianToCartographic(
        upperLeft3
      ) //3D世界坐标转弧度
    let lowerRightCartographic =
      window.EarthViewer.scene.globe.ellipsoid.cartesianToCartographic(
        lowerRight3
      ) //3D世界坐标转弧度

    let minx = window.MSIMEarth.Math.toDegrees(upperLeftCartographic.longitude) //弧度转经纬度
    let maxx = window.MSIMEarth.Math.toDegrees(lowerRightCartographic.longitude) //弧度转经纬度

    let miny = window.MSIMEarth.Math.toDegrees(lowerRightCartographic.latitude) //弧度转经纬度
    let maxy = window.MSIMEarth.Math.toDegrees(upperLeftCartographic.latitude) //弧度转经纬度

    console.log('经度：' + minx + '----' + maxx)
    console.log('纬度：' + miny + '----' + maxy)

    params.minx = minx
    params.maxx = maxx
    params.miny = miny
    params.maxy = maxy
  } else {
    //3D获取方式
    params.maxx = window.MSIMEarth.Math.toDegrees(extend.east)
    params.maxy = window.MSIMEarth.Math.toDegrees(extend.north)

    params.minx = window.MSIMEarth.Math.toDegrees(extend.west)
    params.miny = window.MSIMEarth.Math.toDegrees(extend.south)
  }
  return params //返回屏幕所在经纬度范围
}

export function computeViewExtend() {
  setInterval(() => {
    if (window.EarthViewer.camera.positionCartographic.height > 20e5) return
    let res = getViewExtend()
    window.EarthViewer.entities.removeById('t1')
    window.EarthViewer.entities.add({
      id: 't1',
      rectangle: {
        coordinates: window.MSIMEarth.Rectangle.fromDegrees(
          res.minx,
          res.miny,
          res.maxx,
          res.maxy
        ),
        material: window.MSIMEarth.Color.RED.withAlpha(0.5)
      }
    })
  }, 1000)
}

const addAFSIMIndexDB = () => {
  indexedDBController = new window.EarthPlugn.IndexDBControl()
  // const params = {
  //   dbName: 'test',
  //   cacheTableName: 'imageCache',
  //   keyPath: 'imageName',
  //   indexs: [
  //     { name: 'imageData', unique: false },
  //     { name: 'imageFile', unique: true }
  //   ]
  // }
  const params = {
    dbName: 'AFSIMDB',
    cacheTableName: 'AFSIMCache',
    keyPath: 'AFSIMPAKey',
    indexs: [
      { name: 'PAID', unique: true },
      { name: 'PAData', unique: false }
    ]
  }
  indexedDBController.clearDB()
  setTimeout(() => {
    indexedDBController.initIndexDB(params)
    // function RandomNumber() {
    //   return Math.floor(Math.random() * 100000000.0)
    // }
    // const data = {
    //   PAID: 'asdfasdfasdfads222',
    //   PAData: { data: '1232123123' },
    //   AFSIMPAKey: 'AFSIMPAID' + RandomNumber()
    // }
    // indexedDBController.writeData(data)
  }, 3000)
}

// 加载arcgis地图
const addARCGISLayer = () => {
  // const esri = new window.MSIMEarth.ArcGisMapServerImageryProvider({
  //   url: 'https://services.arcgisonline.com/arcgis/rest/services/World_Imagery/MapServer'
  // })
  // const index = 0
  // window.EarthViewer.imageryLayers.addImageryProvider(esri, index)
  var gaodeImageryProvider = new window.MSIMEarth.UrlTemplateImageryProvider({
    url: 'https://webst02.is.autonavi.com/appmaptile?style=6&x={x}&y={y}&z={z}',
    maximumLevel: 18,
    minimumLevel: 1,
    credit: 'Amap'
  })
  window.EarthViewer.imageryLayers.addImageryProvider(gaodeImageryProvider)
}
// ***********不知道什么东西****************
// let zztimes = ['11:28:13', '15:28:13', '21:28:13', '23:28:13', '5:28:13']
// let threat = [
//   {
//     threatLevel: '高',
//     obj: '无人机',
//     position: [],
//     capacity: '打击', // 打击 侦察 干扰 通信
//     intention: '预警探测', // 预警探测 目标指示
//     opportunity: '90%'
//   },
//   {
//     threatLevel: '低',
//     obj: '无人机',
//     position: [],
//     capacity: '通信', // 打击 侦察 干扰 通信
//     intention: '预警探测', // 预警探测 目标指示
//     opportunity: '90%'
//   },
//   {
//     threatLevel: '中',
//     obj: '无人机',
//     position: [],
//     capacity: '侦察', // 打击 侦察 干扰 通信
//     intention: '目标指示', // 预警探测 目标指示
//     opportunity: '90%'
//   }
// ]
// let zzIndex = 0
