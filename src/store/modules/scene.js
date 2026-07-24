import LocalCache from '@/utils/earthPlugin/ThirdParty/storageManagement/localStorage.js'
const sceneModule = {
  // namespaced: true, //独立使用
  state: {
    cameraOptionList: {}, // 事件列表
    planObject: {}, //计划导调对象
    isUpdatePlan: false, //更新导调计划
    timeProcess: '', //时间进程
    jamAtargetId: [], //被干扰目标Id
    sceneBid: '', //1537697435244036096 1511952921024004096
    layerManagementData: [], //图层数据
    sceneEnityData: [], //图层数据备份
    reconnaissanceArea: true, //侦察区域
    curDetectLineState: 'straight', //探测线状态
    process: '', //底部阶段性描述
    czmlEventSourceData: '', //实时信息数据存储
    earthRotate: false, //地球自转
    earthLight: false, //地球光照开关
    cEarthComp: '', //图层面板机场港口导弹阵地
    sceneTestTime: 60, //地球自转速度
    danInfors: {}, //保存第一视角面板相关信息
    thirdInfors: {}, //保存第三视角面板相关信息
    showFirstDiv: false,
    showThirdDiv: false, //第三视角
    voiceUrl: null, // 语音播放
    msgMessionTime: '', //仿真时间
    startingFalseInfo: '', //场景载入数据结束
    curViewEntityID: '', //图层上次点击实体
    damageAssessmentData: {}, //毁伤评估数据
    timeOverviewData: {}, //底部阶段性描述
    showIdentify: false, //识别
    showCarousel: false, //轮播图片
    multiplier: 1,
    playState: 'forward',
    engineIp: '',
    pdTargetTreeData: '', //左侧兵力树节点图片
    timeDelayVal: 0.3, // 仿真端真实延迟（暂时未实现）
    planeConfig: [], //['姿态', '速度', '类型']
    redPlaneConfig: [], //红 ['姿态', '速度', '类型']
    bluePlaneConfig: [], //蓝 ['姿态', '速度', '类型']
    earthObjectConfig: [], //['传感器范围', '链路', '作战范围']
    audioUrl: '', //右下角视频名称
    redSituation: '5:28:13', //11:28:13  15:28:13  21:28:13 23:28:13
    threatTrendAnalysis: {
      threatLevel: '高', // 高  中 低
      obj: '无人机',
      position: '121.597593,24.0304',
      capacity: '打击', //  打击 侦察 干扰 通信
      intention: '预警探测', // 预警探测 目标指示
      opportunity: '90%'
    }, // 威胁趋势分析
    weatherAnalysis: {
      title: 'xxxx机场', //
      weather: '多云', // 晴 多云 雨 云
      temperature: '21',
      obj: '机场',
      position: '121.597593，24.0304',
      description: '对机场起降的影响比较大' //  天气影响的详细描述
    }, // 天气分析
    currentScreen: 'earthView', //当前屏幕为earthView，控制UE全屏
    recordId: '', //复盘所需的记录id
    fightStartTime: '', //复盘所需的场景开始时间
    fightEndTime: '', //复盘所需的场景结束时间
    isReplayType: false, //判断是否为复盘状态
    blueStatic: {
      //蓝方兵力统计现存和毁伤数据
      xc: 0,
      hs: 0
    },
    redStatic: {
      //红方兵力统计现存和毁伤数据
      xc: 0,
      hs: 0
    },
    showJB: false,
    systemConfig: {
      damageAssessmentTimePause: true,
      isFlyToSimModel: true, // 定位模拟器模型
      isMouseInteractive: true,
      isTopic: false, //true:交换机通信；false:SSE通信
      isShowPanel: false, //默认隐藏兵力、快速裁决、作战信息、想定的弹框
      isShowUE: false, //默认不开启UE云渲染弹框功能
      usableControlKeyCode: usableControlKeyCode, //默认不开启快捷键功能
      isDragPositioning: isDragPositioning, //默认不开启 拖拽实体重新定位功能
      isShowFineModel: true, //默认开启 显示细模型功能
      isSwitchDegMinsSconds: false, //默认不开启 切换度分秒
      Interpolation: false, //默认不开启 插值转换
      BriefShow: false, //默认不开启 简要显隐
      plateFormCategoryStatisticShow: false, //控制平台类别数量统计显隐
      labelShow: true, //控制标牌显隐
      titleExtension: false //控制标题扩展，是否在标题前添加"无人"
    }, //系统配置
    modelConfig: {
      detailedModel: true,
      modelOutline: true
    }, //模型配置
    targetInfo: {}, //存储点击模型相关信息
    targetSimInfor: {}, //存储当前新增模拟器模型的数据信息
    planeAreaConfig: {}, //存储飞机雷达受天气干扰情况
    messageConnector: false, //进入到主页面后等待地球初始化完成再通知系统链接SSE消息
    relatedRightClickConfig: false, // 记录鼠标右键是否关联左键操作
    currentFlyType: {}, //存储当前飞机是否进入环境区域状态
    tname: '', // qbzb标识名称
    sside: '', // qbzb标识sside
    curSceneID: '', // SSE模式下当前场景的时间序列id，之前版本是放在window.curSceneID里，现在改成放在这里。
    curSceneIDArr: [], // SSE模式下当前场景的时间序列id， 现在改成放在这里 多个改为数组。
    curSceneTime: '2027-09-12 10:00:00', //场景开始时间
    sensorsInfo: [], // 场景内传感器信息
    weatherOcanLayers: [], //天气 瓦片图层数据
    filterEvents: [], //存储裁决席位筛选的事件id
    showEventDialog: false, //是否显示事件列表
    satelliteInfo: {}, //微信信息
    planDetail: {}, // 导调计划详情
    quyuWeatherVisible: false, // 区域天气数据显隐
    seatName: '',
    localmedia: null, // 本地视频流
    remotemedia: null, // 远端视频流
    isstopTalkback: false, //开始对讲按钮是否可用
    sceneStartTime: '', // 场景开始时间
    showUEContainer: false, //是否显示UE弹框
    showSilhouetteColor: false, //是否显示模型描边
    redTagsConfig: {
      redPositionTag: false,
      redPostureTag: false,
      redSpeedTag: false,
      redTypeTag: false
    }, //红方目标实时信息配置
    blueTagsConfig: {
      bluePositionTag: false,
      bluePostureTag: false,
      blueSpeedTag: false,
      blueTypeTag: false
    }, //蓝方目标实时信息配置,
    sceneLinkConfig: {
      radarDetect: false,
      sensorTracking: false,
      localTracking: false,
      fireHitting: false,
      targetKill: false,
      electInterference: false,
      networkCommunication: false,
      taskAssociation: false
    }, //链路信息配置
    entityLinkConfig: false,
    entityLinkConfigList: [], // 场景内传感器信息
    isChangeModelProperty: true, //是否执行模型描边显隐、精模简模切换功能
    isChangeModel: false, // 是否执行模型切换
    islayerListLock: true, //停止更新场景配置
    currentNode: {}, //当前选中的节点
    currentEntityId: '', //缓存当前右键模型的id
    toolbarGlobalConfig: {
      vectorWeather: false,
      voiceInteraction: false
    },
    toolbarEntityonfig: {
      electDetectList: [],
      detailLabelList: [],
      targetDistanceList: [],
      targetDueNorthList: [],
      combatRaduisList: [],
      fireRaduisList: [],
      frustumRaduisList: [],
      linkList: [],
      locationList: [],
      ammuntionList: [],
      pathLiist:[],
      planLineList:[]
    },
    weatherTypeInfor: {}, //存储飞机进入天气状态的相关信息
    radarRenderConfig: radarRenderConfig,
    radarRender: true,
    changeCameraView: '', // 当前视角 在工具条切换视角中使用
    terrainExaggeration: 1,
    clockCurrentTime: '', //保存当前时间轴时间，iso格式时间：'2027-05-30T12:00:00Z'
    wtypeObj: {
      //模拟器导调指令所需参数wtype的配置
      运控: '0x0209',
      集合: '0x0307',
      初始化: '0x0201',
      气象: '0x020c'
    },
    // 模拟器开机默认停止时 计数  用于解决飞机动态摆头问题
    mnqPauseStateShow: {
      Y8: 1,
      Y9: 1,
      教10: 1,
      轰6H: 1
    },
    OnePlate: {
      name: ''
    },
    toolBarType: false, //右键快捷菜单显示状态
    toolBarLocation: {}, //存储右键菜单位置
    sceneReplayId: '0', //参数为0时，获取上一次的模拟器统计数据；每次调用模拟器连接接口会生成一个新的回放id，用于模拟器统计分析,
    planLineData: {}, //存储规划的航线数据
    startSceneTime: '', //记录场景启动的时间,模拟器统计要用
    endSeeStaticTime: '', //存储查看模拟器统计功能模块的时间
    threatCardData: [
      {
        level: 4,
        name: '航母1',
        inforList: [
          { name: '类型', value: '航母' },
          { name: '速度', value: '100km/h' },
          { name: '航向角', value: '285°' }
        ],
        pc: '1',
        levelName: '低',
        imgSrc: require('@/assets/images/indicator/aircraftcarrier2.png')
      },
      {
        level: 4,
        name: '驱逐舰1',
        inforList: [
          { name: '类型', value: '驱逐舰' },
          { name: '速度', value: '100km/h' },
          { name: '航向角', value: '285°' }
        ],
        pc: '1',
        levelName: '低',
        imgSrc: require('@/assets/images/indicator/ship4.png')
      },
      {
        level: 4,
        name: '驱逐舰2',
        inforList: [
          { name: '类型', value: '驱逐舰' },
          { name: '速度', value: '100km/h' },
          { name: '航向角', value: '285°' }
        ],
        pc: '1',
        levelName: '低',
        imgSrc: require('@/assets/images/indicator/ship4.png')
      }
    ], //底部威胁级别列表数据
    viewerState: 0, // 目标视角状态，0为默认视角 1为第一视角 2为第三视角 3为场景视角 方便基于视角状态进行各种控制
    briefAllData: [
      {
        checked1: false,
        name: '路径',
        value: 'pathCheck'
      },
      {
        checked1: false,
        name: '路径墙',
        value: 'entityWall'
      },
      {
        checked1: false,
        name: '尾迹',
        value: 'entityWack'
      }
    ], //存放简要列表数据
    threatAllData: [], //存放所有威胁目标的列表数据
    onePlateThreatScore: [], //存放单个weixie目标的weixie评分列表数据
    threatPredictionRadarData: [], //存放单个weixie目标的雷达图数据
    showIntelligenceList: false,
    modelConfigValue: {}, //模型匹配数据，场景初始化时供模型匹配使用
    modelConfigJBValue: {}, //JB模型匹配数据，场景初始化时供模型匹配使用
    modelCHNNameValue: {}, //模型中文名称对照表
    modelCHNNameValue1: {}, //模型中文名称对照表
    identifyInfo: '数据回传中', // 弹出的文字信息
    speaker: 'speaker4',
    identifyColor: {
      // iendtify颜色配置
      color1: 'rgba(19, 240, 240, 0.26)',
      color2: 'rgba(19, 240, 240, 0.26)',
      textShadow1: '#afe3d7',
      textShadow2: '#afe3d7',
      fontSize: 4
    },
    // 保存阶段性描述信息 {time,key,value}
    phasedDescription: [],
    sceneInfo: {},
    taskGroupChecked: [], //存储已经选中的任务编组的groupName，选中时把groupName存进数组，再次点击取出
    bluePrintTempIndex: 0,
    groupData: {},
    redCGFList: [],
    blueCGFList: [],
    BattalionData: {}, //应对信息
    companyInfo: [], //连队信息
    startDate: '', //场景开始时间
    endDate: '', //场景结束时间
    timeOverviewDataEnviroment: {}, //时间概述数据-战场环境
  },
  getters: {
    getCameraOptionList(state) {
      return state.cameraOptionList
    },
    getTimeProcess(state) {
      return state.timeProcess
    },
    getJamAtargetId(state) {
      return state.jamAtargetId
    },
    getRedCGFList(state, list) {
      return state.redCGFList
    },
    getBlueCGFList(state, list) {
      return state.blueCGFList
    },
    getTargetInfo(state) {
      return state.targetInfo
    },
    getSceneTestTime(state) {
      return state.sceneTestTime
    },
    getTimeDelay(state) {
      return state.timeDelayVal
    },
    getRecordId(state) {
      return state.recordId
    },
    getRelatedRightClickConfig(state) {
      return state.relatedRightClickConfig
    },
    getCurrentFlyType(state) {
      return state.currentFlyType
    },
    getCurSceneID(state) {
      return state.curSceneID
    },
    getCurSceneIDArr(state) {
      return state.curSceneIDArr
    },
    getWeatherOcanLayers(state) {
      return state.weatherOcanLayers
    },
    getFilterEvents(state) {
      return state.filterEvents
    },
    getShowEventDialog(state) {
      return state.showEventDialog
    },
    getLayerManagementData(state) {
      return state.layerManagementData
    },
    getSceneStartTime(state) {
      return state.sceneStartTime
    },
    getSceneTime(state) {
      return state.curSceneTime
    },
    getSceneLinkConfig(state) {
      return state.sceneLinkConfig
    },
    getSceneEnityData(state) {
      return state.sceneEnityData
    },
    getCurrentNode(state) {
      return state.currentNode
    },
    getCurrentEntityId(state) {
      return state.currentEntityId
    },
    getRadarRenderConfig(state) {
      return state.radarRenderConfig
    },
    getChangeCameraView(state) {
      return state.changeCameraView
    },
    getClockCurrentTime(state) {
      return state.clockCurrentTime
    },
    getOnePlate(state) {
      return state.OnePlate
    },
    getToolBarLocation(state) {
      return state.toolBarLocation
    },
    getToolBarType(state) {
      return state.toolBarType
    },
    getShowIntelligenceList(state) {
      return state.showIntelligenceList
    },
    getSceneReplayId(state) {
      return state.sceneReplayId
    },
    getPlanLineData(state) {
      return state.planLineData
    },
    getStartSceneTime() {
      return state.startSceneTime
    },
    getEndSeeStaticTime() {
      return state.endSeeStaticTime
    },
    getThreatCardData(state) {
      return state.threatCardData
    },
    getThreatAllData(state) {
      return state.threatAllData
    },
    getBriefAllData(state) {
      return state.briefAllData
    },
    getViewerState(state) {
      return state.viewerState
    },
    getOnePlateThreatScore(state) {
      return state.onePlateThreatScore
    },
    getThreatPredictionRadarData(state) {
      return state.threatPredictionRadarData
    },
    getStartDate(state) {
      return state.startDate
    },
    getEndDate(state) {
      return state.endDate
    },
    getCzmlEventSourceData() {
      return state.czmlEventSourceData
    }
  },
  mutations: {
    setCameraOptionList(state, data) {
      state.cameraOptionList = data
    },
    setPlanObject(state, payload) {
      state.planObject = payload
    },
    setUpdatePlan(state, payload) {
      state.isUpdatePlan = payload
    },
    setTimeProcess(state, payload) {
      state.timeProcess = payload
    },
    setJamAtargetId(state, payload) {
      state.jamAtargetId.push(payload)
    },
    setRedCGFList(state, list) {
      state.redCGFList = list
    },
    setBlueCGFList(state, list) {
      state.blueCGFList = list
    },
    setSceneID(state, payload) {
      state.sceneBid = payload
    },
    setLayerManagementData(state, payload) {
      state.layerManagementData = payload
    },
    setReconnaissanceArea(state, payload) {
      state.reconnaissanceArea = payload
    },
    setDetectLineState(state, payload) {
      state.curDetectLineState = payload
    },
    setProcess(state, payload) {
      state.process = payload
    },
    setCzmlEventSourceData(state, payload) {
      state.czmlEventSourceData = payload
    },
    setEarthRotate(state, payload) {
      state.earthRotate = payload
    },
    setEarthLight(state, payload) {
      state.earthLight = payload
    },
    changeCEarthComp(state, val) {
      state.cEarthComp = val
    },
    setSceneTest(state, payload) {
      state.sceneTestTime = payload
    },
    setDanInfor(state, payload) {
      state.danInfors = payload
    },
    setThirdInfor(state, payload) {
      state.thirdInfors = payload
    },
    setShowFirstDiv(state, payload) {
      state.showFirstDiv = payload
    },
    setShowThirdDiv(state, payload) {
      state.showThirdDiv = payload
    },
    setMsgMessionTime(state, payload) {
      state.msgMessionTime = payload
    },
    setStartingFalseInfo(state, payload) {
      state.startingFalseInfo = payload
    },
    setViewEntityID(state, payload) {
      state.curViewEntityID = payload
    },
    setDamageAssessmentData(state, payload) {
      state.damageAssessmentData = payload
    },
    settimeOverviewData(state, payload) {
      state.timeOverviewData = payload
    },
    setTimeOverviewDataEnviroment(state, payload) {
      state.timeOverviewDataEnviroment = payload
    },
    setPdTargetTreeData(state, payload) {
      state.pdTargetTreeData = payload
    },
    setTimeDealy(state, payload) {
      state.timeDelayVal = payload
    },
    setRecordId(state, payload) {
      state.recordId = payload
    },
    setFightStartTime(state, payload) {
      state.fightStartTime = payload
    },
    setFightEndTime(state, payload) {
      state.fightEndTime = payload
    },
    setMultiplier(state, payload) {
      state.multiplier = payload
    },
    setIsReplayType(state, payload) {
      state.isReplayType = payload
    },
    setBlueStatic(state, payload) {
      state.blueStatic = payload
    },
    setRedStatic(state, payload) {
      state.redStatic = payload
    },
    setTargetInfo(state, payload) {
      state.targetInfo = payload
    },
    setTargetSimInfor(state, payload) {
      state.targetSimInfor = payload
    },
    setPlaneAreaConfig(state, payload) {
      state.planeAreaConfig = payload
    },
    setMessageConnector(state, payload) {
      state.messageConnector = payload
    },
    setRelatedRightClickConfig(state, payload) {
      state.relatedRightClickConfig = payload
    },
    setCurrentFlyType(state, payload) {
      state.currentFlyType = payload
    },
    setSname(state, payload) {
      state.tname = payload
    },
    setSside(state, payload) {
      state.sside = payload
    },
    setDamageAssessmentTimePause(state, val) {
      state.systemConfig.damageAssessmentTimePause = val
      LocalCache.setCache('damageAssessmentTimePause', val)
    },
    setIsFlyToSimModel(state, val) {
      state.systemConfig.isFlyToSimModel = val
      LocalCache.setCache('isFlyToSimModel', val)
    },
    setIsMouseInteractive(state, val) {
      state.systemConfig.isMouseInteractive = val
      LocalCache.setCache('isMouseInteractive', val)
    },
    setIsTopic(state, val) {
      state.systemConfig.isTopic = val
      LocalCache.setCache('isTopic', val)
    },
    initSystemConfig(state) {
      let dama = LocalCache.getCache('damageAssessmentTimePause')
      if (dama != undefined) state.systemConfig.damageAssessmentTimePause = dama

      let fly = LocalCache.getCache('isFlyToSimModel')
      if (fly != undefined) state.systemConfig.isFlyToSimModel = fly

      let mouse = LocalCache.getCache('isMouseInteractive')
      if (mouse != undefined) state.systemConfig.isMouseInteractive = mouse

      let topic = LocalCache.getCache('isTopic')
      if (topic != undefined) state.systemConfig.isTopic = topic

      let showPanel = LocalCache.getCache('isShowPanel')
      if (showPanel != undefined) state.systemConfig.isShowPanel = showPanel

      let showUE = LocalCache.getCache('isShowUE')
      if (showUE != undefined) state.systemConfig.isShowUE = showUE

      let usableControlKeyCode = LocalCache.getCache('usableControlKeyCode')
      if (usableControlKeyCode != undefined)
        state.systemConfig.usableControlKeyCode = usableControlKeyCode

      let isDragPositioning = LocalCache.getCache('isDragPositioning')
      if (isDragPositioning != undefined)
        state.systemConfig.isDragPositioning = isDragPositioning

      let isShowFineModel = LocalCache.getCache('isShowFineModel')
      if (isShowFineModel != undefined)
        state.systemConfig.isShowFineModel = isShowFineModel

      let isSwitchDegMinsSconds = LocalCache.getCache('isSwitchDegMinsSconds')
      if (isSwitchDegMinsSconds != undefined)
        state.systemConfig.isSwitchDegMinsSconds = isSwitchDegMinsSconds

      let Interpolation = LocalCache.getCache('Interpolation')
      if (Interpolation != undefined)
        state.systemConfig.Interpolation = Interpolation

      let BriefShow = LocalCache.getCache('BriefShow')
      if (BriefShow != undefined) state.systemConfig.BriefShow = BriefShow

      // 标牌控制层配置
      let labelShow = LocalCache.getCache('labelShow')
      if (labelShow != undefined) state.systemConfig.labelShow = labelShow

      // 标题扩展配置
      let titleExtension = LocalCache.getCache('titleExtension')
      if (titleExtension != undefined)
        state.systemConfig.titleExtension = titleExtension
    },
    initSceneConfig(state) {
      let modelOutline = LocalCache.getCache('modelOutline')
      if (modelOutline != undefined)
        state.modelConfig.modelOutline = modelOutline

      let radarDetect = LocalCache.getCache('radarDetect')
      if (radarDetect != undefined)
        state.sceneLinkConfig.radarDetect = radarDetect

      let sensorTracking = LocalCache.getCache('sensorTracking')
      if (sensorTracking != undefined)
        state.sceneLinkConfig.sensorTracking = sensorTracking

      let localTracking = LocalCache.getCache('localTracking')
      if (localTracking != undefined)
        state.sceneLinkConfig.localTracking = localTracking

      let fireHitting = LocalCache.getCache('fireHitting')
      if (fireHitting != undefined)
        state.sceneLinkConfig.fireHitting = fireHitting

      let targetKill = LocalCache.getCache('targetKill')
      if (targetKill != undefined) state.sceneLinkConfig.targetKill = targetKill

      let electInterference = LocalCache.getCache('electInterference')
      if (electInterference != undefined)
        state.sceneLinkConfig.electInterference = electInterference

      let networkCommunication = LocalCache.getCache('networkCommunication')
      if (networkCommunication != undefined)
        state.sceneLinkConfig.networkCommunication = networkCommunication

      let taskAssociation = LocalCache.getCache('taskAssociation')
      if (taskAssociation != undefined)
        state.sceneLinkConfig.taskAssociation = taskAssociation

      let redpositionTag = LocalCache.getCache('redpositionTag')
      if (redpositionTag != undefined)
        state.redTagsConfig.redPositionTag = redpositionTag

      let redpostureTag = LocalCache.getCache('redpostureTag')
      if (redpostureTag != undefined)
        state.redTagsConfig.redpostureTag = redpostureTag

      let redspeedTag = LocalCache.getCache('redspeedTag')
      if (redspeedTag != undefined)
        state.redTagsConfig.redspeedTag = redspeedTag

      let redtypeTag = LocalCache.getCache('redtypeTag')
      if (redtypeTag != undefined) state.redTagsConfig.redtypeTag = redtypeTag

      let bluepositionTag = LocalCache.getCache('bluepositionTag')
      if (bluepositionTag != undefined)
        state.blueTagsConfig.bluepositionTag = bluepositionTag

      let bluepostureTag = LocalCache.getCache('bluepostureTag')
      if (bluepostureTag != undefined)
        state.blueTagsConfig.bluepostureTag = bluepostureTag

      let bluespeedTag = LocalCache.getCache('bluespeedTag')
      if (bluespeedTag != undefined)
        state.blueTagsConfig.bluespeedTag = bluespeedTag

      let bluetypeTag = LocalCache.getCache('bluetypeTag')
      if (bluetypeTag != undefined)
        state.blueTagsConfig.bluetypeTag = bluetypeTag
    },
    setCurSceneID(state, payload) {
      state.curSceneID = payload
      console.log('SSE模式下配置当前场景的时间序列ID', state.curSceneID)
    },
    setCurSceneIDArr(state, payload) {
      state.curSceneIDArr = payload
      console.log('SSE模式下配置当前场景的时间序列ID数组', state.curSceneIDArr)
    },
    setCurSceneTime(state, payload) {
      state.curSceneTime = payload
      console.log('SSE模式下更新当前场景的时间', state.curSceneTime)
    },
    setWeatherOcanLayers(state, payload) {
      state.weatherOcanLayers = payload
    },
    setFilterEvents(state, payload) {
      state.filterEvents = payload
    },
    setShowEventDialog(state, payload) {
      state.showEventDialog = payload
    },
    setIsShowPanel(state, val) {
      state.systemConfig.isShowPanel = val
      LocalCache.setCache('isShowPanel', val)
    },
    setIsShowUE(state, val) {
      state.systemConfig.isShowUE = val
      LocalCache.setCache('isShowUE', val)
    },
    setUsableControlKeyCode(state, val) {
      state.systemConfig.usableControlKeyCode = val
      LocalCache.setCache('usableControlKeyCode', val)
    },
    // 标牌控制层配置
    setLabelShow(state, val) {
      state.systemConfig.labelShow = val
      LocalCache.setCache('labelShow', val)
    },
    setIsDragPositioning(state, val) {
      state.systemConfig.isDragPositioning = val
      LocalCache.setCache('isDragPositioning', val)
    },
    setIsShowFineModel(state, val) {
      state.systemConfig.isShowFineModel = val
      LocalCache.setCache('isShowFineModel', val)
    },
    setIsSwitchDegMinsSconds(state, val) {
      state.systemConfig.isSwitchDegMinsSconds = val
      LocalCache.setCache('isSwitchDegMinsSconds', val)
    },
    setInterpolation(state, val) {
      state.systemConfig.Interpolation = val
      LocalCache.setCache('Interpolation', val)
    },
    setBriefShow(state, val) {
      state.systemConfig.BriefShow = val
      LocalCache.setCache('BriefShow', val)
    },
    setTitleExtension(state, val) {
      state.systemConfig.titleExtension = val
      LocalCache.setCache('titleExtension', val)
    },
    setSatelliteInfo(state, payload) {
      state.satelliteInfo = payload
    },
    setPlanDetail(state, payload) {
      state.planDetail = payload
    },
    setstopTalkback(state, payload) {
      state.isstopTalkback = payload
    },
    setSceneStartTime(state, payload) {
      state.sceneStartTime = payload
    },
    setPlayState(state, payload) {
      state.playState = payload
    },
    setEngineIp(state, val) {
      state.engineIp = val
    },
    setdetailedModel(state, val) {
      state.modelConfig.detailedModel = val
    },
    setmodelOutline(state, val) {
      state.modelConfig.modelOutline = val
      LocalCache.setCache('modelOutline', val)
    },
    setShowUEContainer(state, payload) {
      state.showUEContainer = payload
    },
    setShowSilhouetteColor(state, payload) {
      state.showSilhouetteColor = payload
    },
    setredPositionTag(state, val) {
      state.redTagsConfig.redPositionTag = val
      LocalCache.setCache('redpositionTag', val)
    },
    setredPostureTag(state, val) {
      state.redTagsConfig.redPostureTag = val
      LocalCache.setCache('redpostureTag', val)
    },
    setredSpeedTag(state, val) {
      state.redTagsConfig.redSpeedTag = val
      LocalCache.setCache('redspeedTag', val)
    },
    setredTypeTag(state, val) {
      state.redTagsConfig.redTypeTag = val
      LocalCache.setCache('redtypeTag', val)
    },
    setbluePositionTag(state, val) {
      state.blueTagsConfig.bluePositionTag = val
      LocalCache.setCache('bluepositionTag', val)
    },
    setbluePostureTag(state, val) {
      state.blueTagsConfig.bluePostureTag = val
      LocalCache.setCache('bluepostureTag', val)
    },
    setblueSpeedTag(state, val) {
      state.blueTagsConfig.blueSpeedTag = val
      LocalCache.setCache('bluespeedTag', val)
    },
    setblueTypeTag(state, val) {
      state.blueTagsConfig.blueTypeTag = val
      LocalCache.setCache('bluetypeTag', val)
    },
    setSDC(state, val) {
      state.sceneLinkConfig.radarDetect = val
      LocalCache.setCache('radarDetect', val)
    },
    setLocalTracking(state, val) {
      state.sceneLinkConfig.localTracking = val
      LocalCache.setCache('localTracking', val)
    },
    setSensorTracking(state, val) {
      state.sceneLinkConfig.sensorTracking = val
      LocalCache.setCache('sensorTracking', val)
    },
    setFireHitting(state, val) {
      state.sceneLinkConfig.fireHitting = val
      LocalCache.setCache('fireHitting', val)
    },
    setTargetKill(state, val) {
      state.sceneLinkConfig.targetKill = val
      LocalCache.setCache('targetKill', val)
    },
    setElectInterference(state, val) {
      state.sceneLinkConfig.electInterference = val
      LocalCache.setCache('electInterference', val)
    },
    setNetworkCommunication(state, val) {
      state.sceneLinkConfig.networkCommunication = val
      LocalCache.setCache('networkCommunication', val)
    },
    setTaskAssociation(state, val) {
      state.sceneLinkConfig.taskAssociation = val
      LocalCache.setCache('taskAssociation', val)
    },
    setIsChangeModelProperty(state, payload) {
      state.isChangeModelProperty = payload
    },
    setIslayerListLock(state, payload) {
      state.islayerListLock = payload
    },
    setSceneEnityData(state, payload) {
      state.sceneEnityData = payload
    },
    setCurrentNode(state, payload) {
      state.currentNode = payload
    },
    setCurrentEntityId(state, payload) {
      state.currentEntityId = payload
    },
    setEntityLinkConfig(state, payload) {
      state.entityLinkConfig = payload
    },
    setVectorWeatherConfig(state, payload) {
      state.toolbarGlobalConfig.vectorWeather = payload
    },
    setVoiceInteractionConfig(state, payload) {
      state.toolbarGlobalConfig.voiceInteraction = payload
    },
    setWeatherTypeInfor(state, payload) {
      state.weatherTypeInfor = payload
    },
    setRadarRenderConfig(state, payload) {
      return (state.radarRenderConfig = payload)
    },
    setradarRender(state, payload) {
      state.radarRender = payload
      //LocalCache.setCache('radarRender', payload)
    },
    setChangeCameraView(state, payload) {
      state.changeCameraView = payload
    },
    setClockCurrentTime(state, payload) {
      state.clockCurrentTime = payload
    },
    setTerrainExaggeration(state, payload) {
      state.terrainExaggeration = payload
      console.log(state.terrainExaggeration)
    },
    setOnePlate(state, payload) {
      state.OnePlate = payload
    },
    setToolBarLocation(state, payload) {
      state.toolBarLocation = payload
    },
    setToolBarType(state, payload) {
      state.toolBarType = payload
    },
    setShowIntelligenceList(state, payload) {
      state.showIntelligenceList = payload
    },
    setSceneReplayId(state, payload) {
      state.sceneReplayId = payload
    },
    setPlanLineData(state, payload) {
      state.planLineData = payload
    },
    setStartSceneTime(state, payload) {
      state.startSceneTime = payload
    },
    setEndSeeStaticTime(state, payload) {
      state.endSeeStaticTime = payload
    },
    setThreatCardData(state, payload) {
      state.threatCardData = payload
    },
    setThreatAllData(state, payload) {
      state.threatAllData = payload
    },
    setBriefAllData(state, payload) {
      state.briefAllData = payload
    },
    setViewerState(state, payload) {
      console.log('payload', payload)
      state.viewerState = payload
    },
    setOnePlateThreatScore(state, payload) {
      state.onePlateThreatScore = payload
    },
    setThreatPredictionRadarData(state, payload) {
      state.threatPredictionRadarData = payload
    },
    setStartDate(state, payload) {
      state.startDate = payload
    },
    setEndDate(state, payload) {
      state.endDate = payload
    }
  },
  actions: {}
  // modules: {
  // }
}

export default sceneModule
