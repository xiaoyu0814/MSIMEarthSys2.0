/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2026-01-09 19:00:00
 * @LastEditors: xiexiaoyu xiexiaoyu@piesat.cn
 * @LastEditTime: 2026-01-12 14:08:15
 */
// 基础路径 大厦：172.16.100.74  yi园局域网：172.16.100.74  10.1.51.95 yi园 单机 172.15.2.110  172.15.2.110

let baseUrl9080 = ''    //   登录、文书通信 9080端口
let baseUrl8504 = ''    //   视频聊天服务   8504端口
let baseUrl8505 = ''    //   仿真推演后台服务  8505端口
let baseUrl4041 = ''    //   静态资源地址    4041端口
let baseUrl9001 = ''    //   场景编辑服务（用于qb席）  9001端口
let baseUrl8503 = ''    //   场景websocket服务地址  8503端口
let baseUrl9024 = ''    //   文书通信websocket服务地址
let baseUrl9205 = ''    //   消息通信webscoket
let baseUrlAFSIMSCRIPT = '' //   仿真引擎脚本启动服务
let afsimUrl = '' //直接从AFSIM获取信息
let baseUrl16006 = '' // 实时统计类接口
let rbmqUrl = 'ws://34.15.87.10:15674/ws' //rabbitmq 地址
// 根据配置切换线上线下复盘接口 线上部署改为true
const onlineReview = false
const onlineSIM = false
const online = false
if (online) {
  // 线上
  baseUrl9080 = '34.15.87.10:16008'    //   登录、文书通信
  baseUrl8505 = '34.15.87.10:16001'    //   仿真推演后台服务
  baseUrl8504 = '172.16.100.74:8504'    //   视频聊天服务
  baseUrl4041 = '172.16.100.74:4041'    //   初始静态场景态势标注图标地址
  baseUrl9001 = '172.16.100.74:9001'    //   场景编辑服务（用于qb席）
  baseUrl8503 = '172.16.100.74:8503'    //   场景websocket服务地址
  baseUrl9024 = '172.16.100.74:9204'    //   文书通信websocket服务地址
  baseUrl9205 = '10.15.2.14:9205'    //   消息通信webscoket
  baseUrlAFSIMSCRIPT = '172.16.100.743:9004'   //   仿真引擎脚本启动服务
  baseUrl16006 = '34.15.87.10:16006/'// 实时统计类接口:油量 油耗等

} else {
  // 线下（开发）
  baseUrl9080 = '34.15.87.10:16008'//'172.16.100.74:9080'    //   登录、文书通信
  baseUrl8505 = '34.15.87.10:16001'//'172.16.100.74:8505'    //   仿真推演后台服务
  baseUrl8504 = '172.16.100.74:8504'    //   视频聊天服务
  baseUrl4041 = '172.16.100.74:4041'    //   初始静态场景态势标注图标地址
  baseUrl9001 = '172.16.100.74:9001'    //   场景编辑服务（用于qb席）
  baseUrl8503 = '172.16.100.74:8503'    //   场景websocket服务地址
  baseUrl9024 = '172.16.100.74:9204'    //   文书通信websocket服务地址
  baseUrl9205 = '10.15.2.14:9205'    //   消息通信webscoket
  baseUrlAFSIMSCRIPT = '10.15.7.2113:9004'   //   仿真引擎脚本启动服务
  baseUrl16006 = 'statistics'// 实时统计类接口:油量 油耗等
}
if (onlineSIM) {
  afsimUrl = 'http://34.15.87.48'
} else {
  afsimUrl = 'afsim'
}

const baseUrlLayer = 'http://34.15.87.49'    //  影像  8967端口
const baseUrlLayer2 = 'http://34.15.87.210'    //  影像  8967端口
const baseUrlTerrain = 'http://34.15.87.49'    //  地形服务
const globalVectorMapUrl = 'http://172.16.100.74:10000' //全球矢量底图UrlIp
const BBUrlLayer = 'http://172.16.100.74:8080/'
const xiAnMapUrl = 'http://172.16.100.74:30080/'
const xiAnMapServerUrl = 'http://172.16.100.74:31132/'//西安提供的地图服务集合
// image图层路径配置
const layersUrlConfig = {
  // GG底图 34.15.87.10
  url: `http://10.1.30.102:9000/wmts?tilematrix={z}&layer=wmts_ifile&style=wmts_satellite&tilerow={y}&tilecol={x}&tilematrixset=Global_ifile&format=image%2Fjpeg&service=WMTS&version=1.0.0&request=GetTile`,
  // bing底图
  urlB: `${baseUrlLayer}:9000/bingmaps/{z}/{x}/{y}.jpg`,//`${baseUrlLayer}:9010/bingmaps/{z}/{x}/{y}.jpg`,//`http://172.16.100.74:8976/bingmaps/{z}/{x}/{y}.jpg`, //102用8976
  //urlB:`${BBUrlLayer}v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_0897db72720e1000/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&layer=l0897db72790e1000&format=image/sqlitedb&style=default&TileMatrixSet=WGS84Quad&TILEROW={y}&TILECOL={x}&TILEMATRIX={z}&key=0897db7a174e1001`,
  urlWindy: `${baseUrlLayer}:9000/windydarkmaps/{z}/{x}/{y}.jpg`, // 矢量底图
  urlWindy2: `${baseUrlLayer2}:8080/tile-server/v1?Layer=arcgis_lightcolor&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}`, // 矢量底图
  // urlB: `${baseUrlLayer}windydarkmaps/{z}/{x}/{y}.jpg`,
  // urlB:`${baseUrlLayer}/googleMercatorImagery/{z}/{x}/{y}.jpg`,
  // 台湾高清影像
  twHDImage: `${baseUrlLayer}:9000/TWtms/{z}/{x}/{reverseY}.png`,
  // 全球矢量底图
  urlGlobalVectorMap: `${globalVectorMapUrl}/service/v1/tile?map=world_web&x={x}&y={y}&z={z}`,// http://10.15.2.13:30080/tile-server/v1?Layer=qian&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}`,
  urlGlobalVectorMap2: `${globalVectorMapUrl}/service/v1/tile?map=china_web&x={x}&y={y}&z={z}`,
  urlBaseMapVec: "http://192.168.1.110:9000/basemapvec/{z}/{x}/{y}.jpg",
  urlLocalMap: "http://172.16.100.74:5041/googleMercatorImagery/{z}/{x}/{y}.jpg",
  //urlGlobalVectorMap2: `${baseUrlLayer}:9000/terrainmaps/{z}/{x}/{y}.jpg`,//地形晕染底图
  // urlVBlackMap:`http://10.15.2.14:30080/tile-server/v1?Layer=qian&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}`
  urlVBlackMap: `${xiAnMapUrl}/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_09780d47780e1000/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&layer=l09780d47858e1000&format=auto&style=l09780d47858e1000&TileMatrixSet=WorldWebMercatorQuad&TILEROW={y}&TILECOL={x}&TILEMATRIX={z}`,
  xiAnBlackMapUrl: `${xiAnMapUrl}/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_09512934f38e1000/wmts?SERVICE=WMTS&REQUEST=GetTile&VERSION=1.0.0&layer=l09512934f64e1000&format=image/bundle&style=default&TileMatrixSet=WorldWebMercatorQuad&TILEROW={y}&TILECOL={x}&TILEMATRIX={z}`,
  urlXiAnAreaMap1: `${baseUrlLayer}:30941/tile-server/v1?Layer=LaLin-0d5m&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`,
  urlXiAnYunXuanMap: `${baseUrlLayer}:30941/tile-server/v1?Layer=bing-map&TILEMATRIX={z}&TILEROW={y}&TILECOL={x}`,//全球晕眩图
  urlTerrainImageryMap: `${baseUrlLayer}:8976/tacviewmaps/{z}/{x}/{y}.jpg`,//tacview视频里的地形影像图
  OSGBUrl: 'http://34.15.87.10:4041/3dtiles/tileset.json'
}
// 地形路径配置
const terrainUrlConfig = {
  terrainTW: 'http://34.15.87.49:8088/OceanTerrain/',//'http://34.15.87.49:8088/CesiumWorldTerrain/',//`${baseUrlTerrain}:8088/CesiumWorldTerrain`,//'http://172.16.100.74:4041/CesiumWorldTerrain',//'http://172.96.195.15:4041/CesiumTerrain', // `${baseUrlLayer}:4041/CesiumTerrain/`,//http://172.16.100.74:4041/CesiumTerrain/
  // terrianWorld :`${baseUrlLayer}:4041/GLOBAL-DEM-MESH/`
  terrianWorld: `${BBUrlLayer}v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_0896e34c24ce1000/http/1.1.0/?layer=l0896e34c32ce1000&key=0896e354104e1001`
}
// 基础矢量数据
const basicVectorData = {
  guojiexian: 'static/data/geojson/Chinabianjie.geojson',
  guojiexian2: 'static/data/geojson/国界线2.json',
  shengjiexian: 'static/data/geojson/省界线.json',
  river: 'static/data/geojson/river.json',
  daolian1: './static/data/geojson/firstIslandLain.geojson',
  daolian2: './static/data/geojson/secondIslandLain.geojson',
  daolian3: './static/data/geojson/thirdIslandLain.geojson',
  haiyun: './static/data/geojson/taiwan/航运线带名称.geojson',
  haiyunfsq: './static/data/geojson/taiwan/封锁区域.geojson',
  twhangxian: './static/data/geojson/taiwan/机场港口航线-处理后.json',
  twVect: './static/data/geojson/taiwan/taiwanCityPolygon.geojson',
  dianwang: './static/data/geojson/taiwan/电厂点线2.json',
  dianwanghx: './static/data/geojson/taiwan/关键核心枢纽.geojson',
  fourSeaTwoBorder: './static/data/geojson/4H2B.geojson',
  dalangqu: './static/data/geojson/SeaHightArea.geojson',
  tianqiquyu: './static/data/geojson/天气区域数据.json',
}
//交换机配置
const exchangeConfig = {
  ipAddr: "ws://34.15.87.10:15674/ws",//10.1.51.95:15674
  userName: 'guest',
  pwd: 'guest',
  exchangeUrl: [
    '/exchange/SIMULATION_PA',
    '/exchange/SIMULATION_STATE',
    '/exchange/SIMULATION_PD',
    '/exchange/SIMULATION_LOGINFO',
    '/exchange/SIMULATION_VOICE',
    '/exchange/SIMULATION_STARTINGFALSE',
    '/exchange/SIMULATION_STARTINGFALSEINFO',
    '/exchange/SIMULATION_AT',
    '/exchange/SIMULATION_PAUSING',
    '/exchange/SIMULATION_RESUMING',
    '/exchange/SIMULATION_ECHARTSINFO',
    '/exchange/SIMULATION_TIMEOVERVIEW',
    '/exchange/SIMULATION_PA_SIMULATOR',
    '/exchange/SIMULATION_AREA',
    '/exchange/SIMULATION_COMMAND',
    '/exchange/SIMULATION_CZML'
  ]
}
// ***********静态场景*******************
const baseUrl = '34.15.87.10'
// 初始静态场景态势标注图标地址
const staticUrl = `http://${baseUrl}:4041/`
//云渲染地址配置
const UEConfigUrl = {
  ueWsUrl: 'ws://10.15.2.103:18001', //云渲染消息地址（UE提供）
  //serverUrl3: "http://172.16.100.74:8010", //通过后台接口给UE发送消息
}

const serverUrls = {
  experiment: 'http://34.15.87.10:9101/', // 实验设计
  serversData: 'http://34.15.87.10:16006',
  ueServer: '/ue',//'http://34.15.87.144:41451',
  serversData2: 'http://192.168.1.44:16006',
  serversCalculation: 'http://34.15.87.10:16008/',
  afsimControl: 'http://34.15.87.10:16004',
  serversCommunication: 'http://34.15.87.10:16005/',//sse链接
  serversSimswich: 'http://34.15.87.10:9080/simulation-service-simswich/',
  serverScene: 'http://34.15.87.10:9080/se-north-scene/',
  serverSml: 'http://34.15.87.10:9001',
  wordK3Server: 'http://34.15.87.10:9506/',//wordk3接口
  simModelServer: 'http://34.15.87.10:8504/',//模拟器导调指令接口
  qidongMnqSjJsServerUrl: 'http://34.15.87.10:3899',//'http://10.15.2.106:3899',http://10.15.2.12:8509/ // 启动模拟器接收数据
  qidongMnqSjJsServerUrl2: 'http://34.15.87.10:9080',//'http://10.15.2.106:3899', //模拟器数据统计所需
  uETrajectoryReplayUrl: 'http://34.15.87.10:6795',  // UE 轨迹回放服务地址
  serverUrl: 'http://34.15.87.10:9506',//威胁分析
  serversBigdataGateway: 'http://34.15.87.10:9080/simulation-service-file/',
  numericalElement: 'http://34.15.87.10:8821/api/meteo/numerical',  // 气象要素服务
  // numericalElement: 'http://172.16.100.74:4041/WeatherDATA/cloud/20210723/fy4a_trueColor_20210723000000.png',  // 气象要素服务
  // numericalElement: 'http://172.16.100.74:4041/WeatherDATA/LiDAR/resize_3857_QREF000.20230323.000000.png',  // 气象要素服务
  cloudAndRadar: 'http://34.15.87.10:4041/WeatherDATA',  // 云图、雷达图要素服务
  cloudFY4: 'http://34.15.87.10:7029',  // 云图、雷达图要素服务
  sceneUrl: 'http://34.15.87.10', // 想定编辑地址
  AIUrl: 'http://34.15.87.110',// AI聊天服务地址
  token: 'LKXMg13AbeEZxd7z', // AI聊天token地址
  platformUrl: 'http://34.15.87.110:4041',
  liveBroadcastUrl: 'http://34.15.87.10:8888/hls/hls',
  voiceUrl: 'http://34.15.87.30:5000',
  reviewService: 'http://34.15.87.49:5000', //复盘回访
  audioService: 'http://34.15.87.49:8000', // 语音播报
  daqiService: 'http://34.15.87.49:8888/', // 大气影响范围包络数据
  weather_image: 'http://34.15.87.49:25000', // 气象影像图片数据
}

if (onlineReview) {
  serverUrls.reviewService = 'review'
  serverUrls.daqiService = 'helper'
} else {
  serverUrls.reviewService = 'review'
  serverUrls.daqiService = 'dqData'
}

const experimentalPreparation = "http://34.15.87.10:6060/SAAEdit/#/"; //实验准备分系统
const experimentalResourceManagement = "http://34.15.87.10/data/#/home/battlefield"//实验资源管理分系统
const HomeUrl = "http://10.15.2.12:6060/dist/#/"
const experimentalStatics = "http://34.15.87.10/#/infomationStatistics"; //实验数据统计分系统
const experimentalSimulation = '/home/combatSimulation' //仿真实验分系统
const experimentalReview = '/review' //仿真实验分系统
const experimentalUE = '' //多维呈现分系统
const forceMapUrl = 'http://localhost:8081/#/experimentalDataConfiguration' //兵力态势图分系统

