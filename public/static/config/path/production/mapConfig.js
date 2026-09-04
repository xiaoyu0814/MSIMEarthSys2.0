/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2026-01-09 19:00:00
 * @LastEditors: chenguopeng2 chenguopeng.piesat.cn
 * @LastEditTime: 2026-08-28 14:46:46
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
let baseUrl16014 = ''
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
  baseUrl16014 = '34.15.87.10:16014'

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
  baseUrl16014 = '34.15.87.10:16014'
}
if (onlineSIM) {
  afsimUrl = 'http://34.15.87.49'
} else {
  afsimUrl = 'afsim'
}

const baseUrlLayer = 'http://34.15.87.52'    //地图服务
const baseUrlTerrain = 'http://34.15.87.52'    //  地形服务
const globalVectorMapUrl = 'http://172.16.100.74:10000' //全球矢量底图UrlIp
const xiAnMapServerUrl = 'http://172.16.100.74:31132/'//西安提供的地图服务集合
const OSGBUrl = 'http://34.15.87.10/'//OSGB地图服务地址
// image图层路径配置
const layersUrlConfig = {
  urlBingMap: `${baseUrlLayer}:9000/bingmaps/{z}/{x}/{y}.jpg`,  // bing底图
  urlTianDiMap: `${baseUrlLayer}:9000/tiandimaps/{z}/{x}/{y}.jpg`, // 矢量底图
  urlAnnotationMap: `${baseUrlLayer}:8080/tile-server/v1?Layer=arcgis_lightcolor&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}`, // 矢量底图（带标注）
  urldarkVectorMap: `${baseUrlLayer}:8080/tile-server/v1?Layer=arcgis_lightcolor&TILEMATRIX={z}&TILECOL={x}&TILEROW={y}`, // 矢量底图（带标注）
  twImage: `${baseUrlLayer}:9000/TWtms/{z}/{x}/{reverseY}.png`, // 台湾高清影像
  urlTerrainImageryMap: `${baseUrlLayer}:8976/tacviewmaps/{z}/{x}/{y}.jpg`,//tacview视频里的地形影像图
  OSGBUrl: `${OSGBUrl}:4041/3dtiles/tileset.json`
}
// 地形路径配置
const terrainUrlConfig = {
  terrainTW: `${baseUrlTerrain}:8088/OceanTerrain/`,//
  terrianWorld: `${baseUrlTerrain}:8080/v1/rest/services/tile/mtVVauqB2stXsnryVk6ve/ows_0896e34c24ce1000/http/1.1.0/?layer=l0896e34c32ce1000&key=0896e354104e1001`
}
// 基础矢量数据
const basicVectorData = {
  guojiexian: 'static/data/geojson/Chinabianjie.geojson',
  guojiexian2: 'static/data/geojson/国界线2.json',
  shengjiexian: 'static/data/geojson/省界线.json',
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
  ueServer: '/ue',
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
  cloudAndRadar: 'http://34.15.87.10:4041/WeatherDATA',  // 云图、雷达图要素服务
  cloudFY4: 'http://34.15.87.10:7029',  // 云图、雷达图要素服务
  sceneUrl: 'http://34.15.87.10', // 想定编辑地址
  AIUrl: 'http://34.15.87.110',// AI聊天服务地址
  platformUrl: 'http://34.15.87.110:4041',
  liveBroadcastUrl: 'http://34.15.87.10:8888/hls/hls',
  voiceUrl: 'http://34.15.87.30:5000',
  reviewService: 'http://34.15.87.49:5000', //复盘回放
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

