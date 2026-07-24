import {
  ref,
  onMounted,
  reactive,
  watch,
  getCurrentInstance,
  defineEmits
} from 'vue'
// import loadEvent from '@/utils/earth/cesium/loadEvent'
import store from '@/store/index'
// import { getSceneList } from '@/service/api/coreApi'
import emitter from '@/utils/eventbus'
import LayerManagementSource from './layerManagementSource'
import {
  changeCameraView,
  frustumObjectArray,
  radarPenetratingArray
} from '@/utils/earthPlugin/ThirdParty/cameraControl/cameraControl'
import { getTargetNameByMissileName } from '@/service/SSE.js'
import axios from 'axios' // 接口封装后导入接口即可
import { getPlateSWMessageV2 } from '@/service/command'
import {
  getMinHangJSON,
  getSpaceBoxData
} from '@/service/battlefieldEnvironment'
import { ElMessage, ElNotification } from 'element-plus'
import {
  detailedSignageCheckChange,
  pathCheckChange,
  entityWallChange,
  entityWackChange,
  missileLineChange,
  createEntityCircleFun,
  removeEntityCircleById,
  rangeByWeather,
  communicationRadiusChange,
  firepowerRadiusChange,
  entitySensorChange,
  fullBandDisbChange,
  narrowBandDisbChange,
  sightFrameChange,
  operationalRadiusChange,
  entityFrustumChange,
  getEMToolInfoChange,
  getNoiseMapChange,
  showTextByOperationalArea,
  getLDZZInfoChange1,
  planLineChange,
  showFKFW
} from '@/views/toolbar/layerList/hooks/showHideConfig'
import {
  fireAtPositionChange,
  fireAtTargetChange,
  fireByRawChange,
  listTargetToFireChange,
  openFireChange,
  moveToAltitudeChange,
  moveToPositionChange,
  setPositionChange,
  moveToTargetChange,
  sensorChangeFrequencyChange,
  sensorChangeModeChange,
  LaserDesignatorStateChange,
  sensorChangeStateChange,
  fireTurnOnWeaponChange,
  generatingJammerChange,
  laserDirectedJammingChange,
  laserDeceptionChange,
  accompanyingFlightChange,
  moveToSpeedKMHChange,
  moveToHeadingChange,
  switchToSensorChange,
  attackTargetChange,
  destroyTargetChange,
  clearCommandControlFun,
  tempEntityDel,
  changeInfraredStateChange,
  breakMoverChange,
  deficiencyFuelChange,
  deficiencyWeaponQuantityChange,
  taskOffChange,
  setWeaponNum
} from '@/views/toolbar/layerList/hooks/guideCommand'
import {
  managerControlChange,
  gatherAroundChange,
  clearSimModelCommand,
  airPortWeatherChange,
  oceanChange
} from '@/views/toolbar/layerList/hooks/simModelGuideCommand' //模拟器相关导调指令
import { getLayerList } from '@/views/toolbar/layerList/hooks/layerServerData' //获取西安发布的图层服务列表数据
// const { imageUrl } = path.url

export default function () {
  // const instance = getCurrentInstance()
  window.emitter = emitter
  let viewer = window.EarthViewer
  let Cesium = window.MSIMEarth
  const treeRef = ref(null)
  const state2 = reactive({
    radioValue: 'free',
    clickEntityID: '',
    isShowFrumstum: false,
    showFrumstumDiv: false,
    pathChecked: false,
    wackChecked: false,
    sensorChecked: false,
    wallChecked: false,
    frustumChecked: false,
    sightFrameChecked: false,
    missileLineChecked: false,
    operationalRadiusChecked: false,
    communicationRadiusChecked: false,
    firepowerRadiusChecked: false,
    narrowBandDisbChecked: false,
    fullBandDisbChecked: false,
    existFullBandDisb: true,
    existNarrowBandDisb: true,
    existFrustum: true,
    existPath: true,
    existWack: true,
    existSensor: true,
    existWall: true,
    existSightFrame: true,
    existMissileLine: true,
    existOperationalRadius: true,
    existCommunicationRadius: true,
    existFirepowerRadius: true,
    minhangData: {},
    spaceBoxData: [],
    wackSign: [
      'uav',
      'RUAV',
      'Y8',
      'escort',
      'leader',
      'wingman',
      'flanker',
      'RAircraft',
      'cap',
      'F',
      'J',
      'soj',
      '<dis>2',
      '<dis:',
      'PursuitFighter',
      'ManeuverFighter'
    ],
    entityMethod: null
  })
  const sceneRealTimeTreeRef = ref(null)
  let layerManagementSource = new LayerManagementSource({
    viewer: window.EarthViewer,
    Cesium: window.MSIMEarth
  })
  let options = {
    earth: window.MSIMEarth,
    viewer: window.EarthViewer,
    type: 'panel'
  }
  let layerList
  // 战场环境数据
  const getBattlefieldEnvironmentData = () => {
    getMinHangJSON().then((res) => {
      state2.minhangData = res
    })
    let params = {
      heightMax: 10000,
      heightMin: 1000,
      latMax: 43,
      latMin: 32,
      level: 9,
      lonMax: 123,
      lonMin: 112,
      maxNum: 100,
      minNum: 4
    }
    // 功能暂时不用，所以注释掉下面接口
    // getSpaceBoxData(params).then((res) => {
    //   state2.spaceBoxData = res.data
    // })
  }
  onMounted(async () => {
    let options = {
      earth: window.MSIMEarth,
      viewer: window.EarthViewer,
      type: 'panel'
    }
    // 判断如果是admin席位才默认显示九段线等矢量标注
    // if(window.localStorage.getItem('side') == 'admin'){
    //   state.treeDataDefault.
    // }
    // 获取西安图层服务列表
    // await getXiAnLayerServer()

    getBattlefieldEnvironmentData()
    layerList = new window.EarthPlugn.treeManagement(options)
    state.treeData = layerList.panelManagement.initTreeNodes(
      state.treeDataDefault
    )
    // 根据store中的sceneLinkConfig更新链路节点的选中状态
    if (
      state.treeData &&
      state.treeData.length > 2 &&
      state.treeData[2].childList &&
      state.treeData[2].childList.length > 1
    ) {
      const linkNodes = state.treeData[2].childList
      linkNodes.forEach((node) => {
        if (store.state.sceneModule.sceneLinkConfig[node.code] !== undefined) {
          node.checked = store.state.sceneModule.sceneLinkConfig[node.code]
        }
      })
    }
    console.log('state.treeData', state.treeData)
    store.commit('setLayerManagementData', state.treeData)
    // 初始化时图层树只包含地理数据
    // state.treeData = JSON.parse(JSON.stringify(state.treeDataDefault))
    // 初始化选中的地理数据
    let resTree
    if (state.treeData && state.treeData.length > 0) {
      state.treeData[0].childList.forEach((layer) => {
        if (layer.checked) {
          resTree = layerList.panelManagement.updateTickStatus(
            state.treeData,
            layer,
            'add'
          )
        }
      })
    }
    emitter.on('changehandleCheck', (value) => {
      layerList.panelManagement.updateTickStatus(
        store.state.sceneModule.layerManagementData,
        value.val,
        'add'
      )
    })
    state2.entityMethod = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
  })
  watch(
    () => store.state.sceneModule.sceneBid,
    (newValue, oldValue) => {
      if (newValue) {
        // 重新加载树
        getSceneListData(newValue)
      }
    }
  )
  watch(
    () => store.state.sceneModule.layerManagementData,
    (newValue, oldValue) => {
    },
    { deep: true }
  )
  watch(
    () => store.state.sceneModule.radarRender,
    (newValue) => {
      let layerData = store.getters.getLayerManagementData
      let newModelLayerData = layerData[2].childList
      const side = window.localStorage.getItem('side')
      // 雷达探测
      if (side == 'admin') {
        if (newModelLayerData[2]) {
          newModelLayerData[2].checked = newValue
        }
      } else {
        if (newModelLayerData[1]) {
          newModelLayerData[1].checked = newValue
        }
      }
    }
  )
  //获取西安服务列表
  const getXiAnLayerServer = async () => {
    let paramsList = state.layerParams
    for (let x = 0; x < paramsList.length; x++) {
      let params = paramsList[x]
      let serverDataList = await getLayerList(params)
      if (serverDataList && serverDataList.length > 0) {
        state.treeDataDefault[0].childList[x].childList = serverDataList
      }
    }
  }
  // tree动态类名 (先声明再调用)
  const customNodeClass = (data, node) => {
    if (data.isPenultimate) {
      // 不显示复选框
      return 'root-node'
    }
    return null
  }
  // 获取全局对象
  const state = reactive({
    defaultProps: {
      label: 'name',
      id: 'code',
      children: 'childList',
      class: customNodeClass
    },
    currentLayer: true, // true 默认图层 false 场景实时实体
    treeData: [], //树结构
    treeDataDefault: [
      {
        code: 1,
        name: '地理遥感',
        disabled: true,
        isPenultimate: true,
        clickable: false,
        image: '地理数据.png',
        childList: [
          {
            name: '全球高清影像',
            code: 'bingLayer',
            checked: true,
            clickable: false,
            geoType: '',
            callback: 'bingLayer'
          },
          {
            name: '全球地形',
            code: 'globalTerrain',
            checked: false,
            clickable: false,
            geoType: '',
            callback: 'globalTerrain'
          },
          {
            name: '矢量底图',
            code: 'vectorLayer',
            checked: false,
            clickable: false,
            geoType: '',
            callback: 'vectorLayer'
          },
          {
            name: '矢量底图（带标注）',
            code: 'vectorLayer2',
            checked: false,
            clickable: false,
            geoType: '',
            callback: 'vectorLayer2'
          },
          {
            name: '矢量底图（暗色）',
            code: 'vectorLayer3',
            checked: false,
            clickable: false,
            geoType: '',
            callback: 'vectorLayer3'
          }
        ]
      },
      {
        code: 2,
        name: '气象海洋',
        disabled: true,
        isPenultimate: true,
        clickable: false,
        image: '战场环境.png',
        childList: [
          {
            name: '光学探测区域',
            code: 'opticalDetectionZone',
            clickable: false,
            checked: false,
            callback: 'opticalDetectionZone'
          },
          {
            name: '红外探测区域',
            code: 'infraredDetectionZone',
            clickable: false,
            checked: false,
            callback: 'infraredDetectionZone'
          },
          {
            name: '云层',
            code: 'cloud',
            clickable: false,
            checked: false,
            callback: 'cloud'
          },
          {
            name: '湿度',
            code: 'humiditytj',
            clickable: false,
            checked: false,
            callback: 'humiditytj'
          },
          {
            name: '积冰区',
            code: 'icetj',
            clickable: false,
            checked: false,
            callback: 'icetj'
          },
          {
            name: '颠簸区',
            code: 'turbulencetj',
            clickable: false,
            checked: false,
            callback: 'turbulencetj'
          },
          {
            name: '风场',
            code: 'wind',
            clickable: false,
            checked: false,
            callback: 'wind'
          }
        ]
      },
      {
        code: 3,
        name: '场景信息',
        disabled: true,
        isPenultimate: true,
        clickable: false,
        image: '场景配置.png',
        childList: [
          {
            name: '传感器追踪',
            code: 'localTracking',
            clickable: false,
            checked: false,
            callback: 'localTracking'
          },
          {
            name: '局域追踪',
            code: 'sensorTracking',
            clickable: false,
            checked: false,
            callback: 'sensorTracking'
          },
          {
            name: '火力打击',
            code: 'fireHitting',
            clickable: false,
            checked: false,
            callback: 'fireHitting'
          },
          {
            name: '电磁干扰',
            code: 'electInterference',
            clickable: false,
            checked: false,
            callback: 'electInterference'
          },
          {
            name: '网络通信',
            code: 'networkCommunication',
            clickable: false,
            checked: false,
            callback: 'networkCommunication'
          },
          {
            name: '任务关联',
            code: 'taskAssociation',
            clickable: false,
            checked: false,
            callback: 'taskAssociation'
          }
        ]
      },
      {
        code: 4,
        name: '地理要素',
        disabled: true,
        isPenultimate: true,
        clickable: false,
        image: '地理数据.png',
        childList: [
          {
            name: '九段线',
            code: 'nineLine',
            checked: true,
            clickable: false,
            addname: true,
            callback: 'nineLine'
          },
          {
            name: '岛链',
            code: 'islandChain',
            checked: true,
            clickable: false,
            url: '',
            geoType: 'polyline',
            callback: 'islandChain'
          },
          {
            name: '四海两边',
            code: 'fourSeaTwoBorder',
            checked: false,
            clickable: false,
            geoType: 'polygon',
            callback: 'fourSeaTwoBorder'
          },
          {
            name: '国家边界线',
            code: 'nationalBoundaryLine',
            checked: false,
            geoType: 'polyline',
            clickable: false,
            wcodeth: 4,
            callback: 'nationalBoundaryLine'
          },
          {
            name: '台湾海运线',
            code: 'taiwanShippingLine',
            clickable: false,
            checked: false,
            callback: 'taiwanShippingLine'
          },
          {
            name: '台海禁航区',
            code: 'taiwanStraitNoNavigationZone',
            clickable: false,
            checked: false,
            callback: 'taiwanStraitNoNavigationZone'
          },
          {
            name: '防空识别区',
            code: 'identificationZone',
            clickable: false,
            checked: false,
            callback: 'identificationZone'
          }
        ]
      },
      {
        code: 5,
        name: '地图注记',
        disabled: true,
        isPenultimate: true,
        clickable: false,
        image: '地理数据.png',
        childList: [
          {
            name: '地名',
            code: 'mainCity',
            checked: false,
            geoType: 'point',
            clickable: false,
            addname: true,
            callback: 'mainCity'
          },
          {
            name: '重要目标',
            code: 'importanceTarget',
            geoType: 'point',
            clickable: false,
            callback: 'importanceTarget'
          }
        ]
      },
      // {
      //   code: 6,
      //   name: '作战态势',
      //   disabled: true,
      //   isPenultimate: true,
      //   clickable: false,
      //   image: '地理数据.png',
      //   childList: [
      //     {
      //       name: '静态标注',
      //       code: 'addStaticTarget',
      //       clickable: false,
      //       checked: true,
      //       callback: 'addStaticTarget'
      //     },
      //     {
      //       name: '作战区域',
      //       code: 'addZuoZhanArea',
      //       clickable: false,
      //       checked: false,
      //       callback: 'addZuoZhanArea'
      //     },
      //     {
      //       name: '作战态势',
      //       code: 'campaignSituation',
      //       clickable: false,
      //       checked: false,
      //       callback: 'campaignSituation'
      //     }
      //   ]
      // }
    ],
    sceneRealTimeEntity: [], // 场景实时实体树结构
    currentChecked: {},
    checkeys: [],
    radioValue: 'free',
    isShowFrumstum: false,
    showFrumstumDiv: false,
    detailVisible: false,
    statusRadio: 'free',
    layerParams: [
      {
        scope: 'public',
        keywords: '地理数据服务'
      },
      {
        scope: 'public',
        keywords: '机场数据服务'
      },
      {
        scope: 'public',
        keywords: '中国影像数据服务'
      }
    ],
    treeClickCount: 0,
    timer: null
  })

  // 重新加载树
  const getSceneListData = async (sceneID) => {
    // 深拷贝赋值初始地理数据
    state.treeData = store.state.sceneModule.layerManagementData
    store.commit('setLayerManagementData', state.treeData)
  }

  const findNodeByCode = (data, code) => {
    for (let item of data) {
      if (item.code === code) {
        return item
      }
      if (item.childList) {
        const found = findNodeByCode(item.childList, code)
        if (found) return found
      }
    }
    return null
  }
  const findParentNode = (data, code) => {
    for (let item of data) {
      if (item.childList) {
        if (item.childList.some(child => child.code === code)) {
          return item
        }
        const found = findParentNode(item.childList, code)
        if (found) return found
      }
    }
    return null
  }

  const uncheckAllNodes = (data) => {
    for (let item of data) {
      item.checked = false
      if (item.childList) {
        uncheckAllNodes(item.childList)
      }
    }
  }

  // 图层勾选
  const handleCheck = (val, arg) => {
    if (!val) return
    if (state.currentLayer) {
      window.sceneAction.planeCzmlManage.showDynamicEntity(
        val.code,
        val.checked
      )
      if (
        arg.checkedKeys.includes('firstGrid') ||
        arg.checkedKeys.includes('secondGrid')
      ) {
        emitter.emit('spaceGrid', true)
      } else {
        emitter.emit('spaceGrid', false)
      }
      let resultTreeData
      if (!val.checked) {
        resultTreeData = layerList.panelManagement.updateTickStatus(
          store.state.sceneModule.layerManagementData,
          val,
          ''
        )
      } else {
        if (val.name == '民航航线') {
          val.data = state2.minhangData
        }
        if (val.name == '空间盒') {
          val.data = state2.spaceBoxData
        }
        resultTreeData = layerList.panelManagement.updateTickStatus(
          store.state.sceneModule.layerManagementData,
          val,
          'add'
        )
      }
    } else {
      uncheckAllNodes(store.state.sceneModule.layerManagementData)
      val.checked = true
      state.currentChecked = val
      if (!state.currentLayer) {
        state.radioValue = 'free'
        changeSelected('free')
        state.isShowFrumstum = false
        changeCheck(false)
      }
    }
  }
  // 实体场景勾选
  const handleCheckSceneRealTimeEntity = (val, arg) => {
    uncheckAllNodes(store.state.sceneModule.layerManagementData)
    val.checked = true
    state.currentChecked = val
    if (!state.currentLayer) {
      state.radioValue = 'free'
      changeSelected('free')
      state.isShowFrumstum = false
      changeCheck(false)
    }
  }

  const changeSelected = (value) => {
    changeCameraView(state2.clickNode.code, value)
  }
  const changeCheck = (value) => {
    emitter.emit('changeFrumstum', value)
  }

  // 切换图层
  const handleSwitchLayers = () => {
    let realEntityList = store.getters.getRealTimeEntityList
    let arr = []
    realEntityList.forEach((item) => {
      if (store.state.sceneModule.side == 1) {
        if (item.code == 2) {
          arr.push(item)
        }
      } else if (store.state.sceneModule.side == 0) {
        if (item.code == 1) {
          arr.push(item)
        }
      } else {
        arr.push(item)
      }
    })
    state.sceneRealTimeEntity = arr
    if (state.currentLayer) {
      store.commit('setLayerManagementData', state.sceneRealTimeEntity)
      uncheckAllNodes(store.state.sceneModule.layerManagementData)
    } else {
      store.commit('setLayerManagementData', state.treeData)
    }
    state.currentLayer = !state.currentLayer
  }
  //单击图层菜单节点
  const handleNodeClick = (data) => {
    state.treeClickCount++
    if (state.treeClickCount >= 2) {
      return
    }
    if (state.timer) {
      window.clearTimeout(state.timer)
      state.timer = null
    }
    state.timer = window.setTimeout(() => {
      if (state.treeClickCount == 1) {
        state.treeClickCount = 0
        if (data.clickable) {
          state2.clickNode = data
          store.commit('setCurrentNode', data)
          configCheckBoxShow(state2.clickNode)
          configChecked(state2.clickNode)
        }
      } else if (state.treeClickCount > 1) {
        state.treeClickCount = 0
        const parent = findParentNode(store.state.sceneModule.layerManagementData, data.code)
        if (parent && parent.code == '02') {
          if (data.checked) {
            let layerName = data.name
            let layers = window.EarthViewer.imageryLayers._layers
            let bbox = data.bbox
            for (let x = 0; x < layers.length; x++) {
              if (layers[x].imageryProvider.name === layerName) {
                flyToImageryBybounds(bbox)
                break
              }
            }
          }
        }
      }
    }, 300)
  }
  /*
   *根据bbox进行定位
   *bbox"-180.00000000 -85.00000000 180.00000000 85.00000000"；
   *bounds:"POLYGON ((-180.0 85.0,-180.0 -85.0,180.0 -85.0,180.0 85.0,-180.0 85.0))"
   */
  const flyToImageryBybounds = (bbox) => {
    //if (!bounds) return
    // let polygon = bounds.replace('POLYGON ((', '[').replace('))', ']').replaceAll(',', '],[').replaceAll(' ', ',')
    // let center = window.turf.centerOfMass(window.turf.polygon([[polygon]], { name: 'poly1' }))
    // if (!center) return
    // window.EarthViewer.camera.flyTo({
    //   destination: window.MSIMEarth.Cartesian3.fromDegrees(
    //     center.geometry.coordinates[0],
    //     center.geometry.coordinates[1],
    //     500000
    //   )
    // })
    let bboxPos = bbox.split(' ')
    let entity = window.EarthViewer.entities.add({
      rectangle: {
        coordinates: window.MSIMEarth.Rectangle.fromDegrees(
          bboxPos[0],
          bboxPos[1],
          bboxPos[2],
          bboxPos[3]
        )
      },
      show: false
    })
    EarthViewer.flyTo(entity)
    setTimeout(() => {
      window.EarthViewer.entities.remove(entity)
    }, 2000)
  }
  const configChecked = (node) => {
    //尾迹线
    state2.existWack = isExistWack(node.code)
    emitter.emit('existWack', state2.existWack)
    // 路径线
    let entitypath = window.EarthViewer.entities.getById(node.code + 'pathLine')
    state2.pathChecked = entitypath ? true : false
    emitter.emit('pathChecked', state2.pathChecked)
    // 路径墙
    let entitywall = window.EarthViewer.entities.getById(node.code + 'pathWall')
    state2.wallChecked = entitywall ? true : false
    emitter.emit('wallChecked', state2.wallChecked)
    // 传感器范围
    let entitysensor = window.EarthViewer.entities.getById(
      `SU==sensor==${node.code}`
    )
    if (entitysensor) {
      state2.sensorChecked = entitysensor.show
      emitter.emit('sensorChecked', state2.sensorChecked)
    }
    // 瞄准框
    let entitySightFrame = window.EarthViewer.entities.getById(
      node.code + 'thirdSight'
    )
    state2.sightFrameChecked = entitySightFrame ? true : false
    emitter.emit('sightFrameChecked', state2.sightFrameChecked)
    // 视锥
    let frustum = frustumObjectArray.find((item) => item.id == node.code)
    if (!frustum)
      frustum = radarPenetratingArray.find((item) => item.id == node.code)
    state2.frustumChecked = frustum ? true : false
    emitter.emit('frustumChecked', state2.frustumChecked)
    // 导弹线
    let data = {
      missileName: state2.clickNode.code
    }
    getTargetNameByMissileName(data).then((res) => {
      if (res.code) {
        let id = `RE_WeaponF==${state2.clickNode.code}==${res.data}`
        let entityMissileLine = window.EarthViewer.entities.getById(id)
        if (entityMissileLine) {
          state2.missileLineChecked = entityMissileLine.show
          emitter.emit('missileLineChecked', state2.missileLineChecked)
        }
      }
    })
    // 半径
    let entityoperational = window.EarthViewer.entities.getById(
      'operationalRadius' + node.code
    )
    state2.operationalRadiusChecked = entityoperational ? true : false
    emitter.emit('operationalRadiusChecked', state2.operationalRadiusChecked)
    let entitycommunicationRadius = window.EarthViewer.entities.getById(
      'communicationRadius' + node.code
    )
    state2.communicationRadiusChecked = entitycommunicationRadius ? true : false
    emitter.emit(
      'communicationRadiusChecked',
      state2.communicationRadiusChecked
    )
    let entityfirepowerRadiusChecked = window.EarthViewer.entities.getById(
      node.code + 'pan' + 'firepowerRadius'
    )
    state2.firepowerRadiusChecked = entityfirepowerRadiusChecked ? true : false
    emitter.emit('firepowerRadiusChecked', state2.firepowerRadiusChecked)
    let entityfullBandDisbChecked = window.EarthViewer.entities.getById(
      'fullBandDisb' + node.code
    )
    state2.fullBandDisbChecked = entityfullBandDisbChecked ? true : false
    emitter.emit('fullBandDisbChecked', state2.fullBandDisbChecked)
    let entitynarrowBandDisbChecked = window.EarthViewer.entities.getById(
      node.code + 'pan' + 'narrowBandDisb'
    )
    state2.narrowBandDisbChecked = entitynarrowBandDisbChecked ? true : false
    emitter.emit('narrowBandDisbChecked', state2.narrowBandDisbChecked)
  }

  //判断实体是否有尾迹线
  const isExistWack = (code) => {
    let exist = false
    state2.wackSign.forEach((sign) => {
      if (code.includes(sign)) {
        exist = true
      }
    })
    return exist
  }

  const configCheckBoxShow = (node) => {
    let entitywack = window.EarthViewer.entities.getById(
      node.code + 'weijixian'
    )
    state2.existWack = entitywack ? true : false
    emitter.emit('existWack', state2.existWack)
    let entitysensor = window.EarthViewer.entities.getById(
      `SU==sensor==${node.code}`
    )
    state2.existSensor = entitysensor ? true : false
    emitter.emit('existSensor', state2.existSensor)
    let missileTypes = ['MEDIUM_RANGE_RADAR_MISSILE', 'LARGE_SAM']
    state2.existMissileLine = missileTypes.find((item) => item == node.type)
      ? true
      : false
    state2.entityMethod = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
    let entitypath = state2.entityMethod.getCZMLEntity(
      node.code,
      'MSIMEarthCZMLProcessContainer'
    )
    // let sourceSource = window.EarthViewer.dataSources.getByName(node.code)
    // if (sourceSource.length == 0) return
    // if (sourceSource.length > 0) {
    if (window.MSIMEarth.defined(entitypath)) {
      // let entitypath = sourceSource[0].entities.values[0]
      state2.existFrustum = true
      state2.existPath = entitypath.path ? true : false
      state2.existWall = entitypath.path ? true : false
      state2.existSightFrame = entitypath.path ? true : false
    } else {
      state2.existFrustum = false
      state2.existPath = false
      state2.existWall = false
      state2.existSightFrame = false
    }
    emitter.emit('existPath', state2.existPath)
    emitter.emit('existWall', state2.existWall)
    emitter.emit('existSightFrame', state2.existSightFrame)
    emitter.emit('existMissileLine', state2.existMissileLine)
    emitter.emit('existFrustum', state2.existFrustum)
    // let data = {
    //   missileName: id
    // }
    // getTargetNameByMissileName(data).then(res => {
    //   if (res.code == 200) {
    //     state2.existMissileLine = true
    //   } else {
    //     state2.existMissileLine = false
    //   }
    // })
  }

  const handleClose = () => {
    state.detailVisible = false
  }

  // 添加热力图点击显示label监听
  let handlerEvent = null
  let clickShowLabels = {}
  const addMouseMove = (type) => {
    if (!handlerEvent) {
      handlerEvent = new Cesium.ScreenSpaceEventHandler(viewer.canvas)
    }

    function showHotNum(event) {
      var picked = viewer.scene.pick(event.position)
      if (Cesium.defined(picked) && picked.id) {
        // 过滤掉线和面
        if (picked.id.polygon && picked.id.properties._number) {
          let hotNumber = picked.id.properties._number.getValue()
          let centerLongitude = picked.id.properties._centerLongitude.getValue()
          let centerLatitude = picked.id.properties._centerLatitude.getValue()
          if (!clickShowLabels[picked.id.id + '-label']) {
            let entity = viewer.entities.add({
              id: picked.id.id + '-label',
              position: Cesium.Cartesian3.fromDegrees(
                centerLongitude,
                centerLatitude,
                1500
              ),
              label: {
                text: '热力值:' + hotNumber,
                font: '400 18px MicroSoft YaHei',
                fillColor: new window.MSIMEarth.Color(
                  230 / 255,
                  0 / 255,
                  0 / 255,
                  0.7
                ),
                style: window.MSIMEarth.LabelStyle.FILL,
                // style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
                horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
                verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
                pixelOffset: new window.MSIMEarth.Cartesian2(-25, -20),
                // showBackground: true,
                backgroundColor: new window.MSIMEarth.Color.fromBytes(
                  235,
                  155,
                  33
                ),
                distanceDisplayCondition:
                  new window.MSIMEarth.DistanceDisplayCondition(0, 350e5)
                // scaleByDistance: new window.MSIMEarth.NearFarScalar(30e5, 1.0, 80e5, 0.7),
                // outlineColor: window.MSIMEarth.Color.BLACK,
                // outlineWidth: 2
              }
            })
            clickShowLabels[picked.id.id + '-label'] = entity
          }
        }
      }
    }
    if (type) {
      if (handlerEvent)
        handlerEvent.setInputAction(
          showHotNum,
          Cesium.ScreenSpaceEventType.LEFT_CLICK
        )
    } else {
      //移除事件监听并清除label
      if (handlerEvent) handlerEvent.removeInputAction(showHotNum)
      handlerEvent = null
      if (Object.keys(clickShowLabels).length > 0) {
        for (let i = 0; i < clickShowLabels.length; i++) {
          if (clickShowLabels[i]) viewer.entities.remove(clickShowLabels[i])
        }
        clickShowLabels = {}
      }
    }
  }
  //注册viewAndIsShowConfig组件下视角和显隐配置和特情配置的事件监听
  const emitterDataChange = () => {
    emitter.on('changeSelected1', (value) => {
      changeSelected(value)
    })
    // 详标牌
    emitter.on('detailedSignageCheckChange1', (value) => {
      detailedSignageCheckChange(value)
    })
    // 路径
    emitter.on('pathCheckChange1', (value) => {
      pathCheckChange(value)
    })
    // 路径墙
    emitter.on('entityWallChange1', (value) => {
      entityWallChange(value)
    })
    // 尾迹
    emitter.on('entityWackChange1', (value) => {
      entityWackChange(value)
    })
    // 航线
    emitter.on('planLineChange1', (value) => {
      planLineChange(value)
    })
    // 瞄准框
    emitter.on('sightFrameChange1', (value) => {
      sightFrameChange(value)
    })
    // 导弹线
    emitter.on('missileLineChange1', (value) => {
      missileLineChange(value)
    })
    // 作战半径
    emitter.on('operationalRadiusChange1', (value) => {
      operationalRadiusChange(value)
    })
    // 感知半径
    emitter.on('entityFrustumChange1', (value) => {
      entityFrustumChange(value)
    })
    // 通信半径
    emitter.on('communicationRadiusChange1', (value) => {
      communicationRadiusChange(value)
    })
    // 火力半径
    emitter.on('firepowerRadiusChange1', (value) => {
      firepowerRadiusChange(value)
    })
    // 传感器范围
    emitter.on('entitySensorChange1', (value) => {
      console.log(value)
      entitySensorChange(value)
    })
    // 干扰范围全频
    emitter.on('fullBandDisbChange1', (value) => {
      fullBandDisbChange(value)
    })
    // 干扰范围(窄带)
    emitter.on('narrowBandDisbChange1', (value) => {
      narrowBandDisbChange(value)
    })
    emitter.on('handleNodeClick1', (value) => {
      handleNodeClick(value)
    })
    //雷达覆盖、探测可能性图
    emitter.on('getEMToolInfoChange1', (value) => {
      getEMToolInfoChange(value)
    })
    //杂波图
    emitter.on('getNoiseMapChange1', (value) => {
      getNoiseMapChange(value)
    })
    //防空范围
    emitter.on('fkfwChange1', (value) => {
      // 展示防空范围
      showFKFW(value)
    })
    // 雷达遮罩
    emitter.on('getLDZZInfoChange1', (value) => {
      getLDZZInfoChange1(value)
    })
    // 攻击指定位置
    emitter.on('fireAtPositionChange1', (value) => {
      fireAtPositionChange(value)
    })
    // 攻击指定目标
    emitter.on('fireAtTargetChange1', (value) => {
      fireAtTargetChange(value)
    })
    // 攻击自定义
    emitter.on('fireByRawChange1', (value) => {
      fireByRawChange(value)
    })
    // 攻击指令接口
    emitter.on('openFireChange1', (value) => {
      openFireChange(value)
    })
    // 列表目标攻击
    emitter.on('listTargetToFireChange1', (value) => {
      listTargetToFireChange(value)
    })
    //变更平台高度
    emitter.on('moveToAltitudeChange1', (value) => {
      moveToAltitudeChange(value)
    })
    // 移动平台到指定位置指令接口
    emitter.on('moveToPositionChange1', (value) => {
      moveToPositionChange(value)
    })
    // 立即改变位置指令接口
    emitter.on('setPositionChange1', (value) => {
      setPositionChange(value)
    })
    //移动平台到目标距离指令接口
    emitter.on('moveToTargetChange1', (value) => {
      moveToTargetChange(value)
    })
    //变更平台传感器频率指令接口
    emitter.on('sensorChangeFrequencyChange1', (value) => {
      sensorChangeFrequencyChange(value)
    })
    //变更平台传感器模式指令接口
    emitter.on('sensorChangeModeChange1', (value) => {
      sensorChangeModeChange(value)
    })
    //变更平台传感器状态指令接口
    emitter.on('sensorChangeStateChange1', (value) => {
      sensorChangeStateChange(value)
    })
    //激光
    emitter.on('LaserDesignatorStateChange1', (value) => {
      LaserDesignatorStateChange(value)
    })
    // 清空
    emitter.on('clearCommandControl', (commandControlRadio) => {
      clearCommandControlFun(commandControlRadio)
    })
    //变更平台干扰状态指令接口
    emitter.on('fireTurnOnWeaponChange1', (value) => {
      fireTurnOnWeaponChange(value)
    })
    //生成干扰弹接口(立即导调指令)
    emitter.on('generatingJammerChange1', (value) => {
      generatingJammerChange(value)
    })
    //激光定向干扰(立即导调指令)
    emitter.on('laserDirectedJammingChange1', (value) => {
      laserDirectedJammingChange(value)
    })
    //激光定向干扰(立即导调指令)
    emitter.on('laserDeceptionChange1', (value) => {
      laserDeceptionChange(value)
    })
    //伴飞(立即导调指令)
    emitter.on('accompanyingFlightChange1', (value) => {
      accompanyingFlightChange(value)
    })
    //变更速度
    emitter.on('moveToSpeedKMHChange1', (value) => {
      moveToSpeedKMHChange(value)
    })
    //变更航向
    emitter.on('moveToHeadingChange1', (value) => {
      moveToHeadingChange(value)
    })
    //变更传感器开关
    emitter.on('switchToSensorChange1', (value) => {
      switchToSensorChange(value)
    })
    //攻击目标（afsim）
    emitter.on('attackTargetChange1', (value) => {
      attackTargetChange(value)
    })
    //销毁
    emitter.on('destroyTargetChange1', (value) => {
      destroyTargetChange(value)
    })
    //变更烟雾干扰装置状态
    emitter.on('changeInfraredStateChange1', (value) => {
      changeInfraredStateChange(value)
    })
    //特情：发动机故障
    emitter.on('breakMoverChange1', (value) => {
      breakMoverChange(value)
    })
    //特情：油料缺失
    emitter.on('deficiencyFuelChange1', (value) => {
      deficiencyFuelChange(value)
    })
    //特情：缺失弹药
    emitter.on('deficiencyWeaponQuantityChange1', (value) => {
      deficiencyWeaponQuantityChange(value)
    })
    //飞机起飞
    emitter.on('taskOffChange1', (value) => {
      taskOffChange(value)
    })
    // 清空模拟器导调
    emitter.on('clearSimModelCommandControl', (commandControlRadio) => {
      clearSimModelCommand(commandControlRadio)
    })
    // 变更弹药数量
    emitter.on('setWeaponNumChange1', (value) => {
      setWeaponNum(value)
    })
  }
  emitterDataChange()

  //通过sse消息通知进入某天气区域，感知锥被干扰
  emitter.on('changeFrumstumByInterference', (value) => {
    rangeByWeather(value)
  })

  //通过sse消息通知进入作站区域区域，显示提示信息
  emitter.on('jrOperationalAreaByInterference', (value) => {
    showTextByOperationalArea(value)
  })

  //-----------------模拟器导调开始------------------------------------------
  //运控指令
  emitter.on('controlOrderChange1', (value) => {
    managerControlChange(value)
  })
  //集合指令
  emitter.on('gatherAroundChange1', (value) => {
    gatherAroundChange(value)
  })
  //机场天气设置指令
  emitter.on('airPortWeatherChange1', (value) => {
    airPortWeatherChange(value)
  })
  //海洋海况设置指令
  emitter.on('oceanChange1', (value) => {
    oceanChange(value)
  })
  //-----------------模拟器导调结束------------------------------------------
  return {
    state,
    state2,
    handleCheck,
    handleCheckSceneRealTimeEntity,
    treeRef,
    sceneRealTimeTreeRef,
    handleSwitchLayers,
    changeCheck,
    changeSelected,
    handleNodeClick,
    configChecked,
    handleClose,
    pathCheckChange
  }
}
