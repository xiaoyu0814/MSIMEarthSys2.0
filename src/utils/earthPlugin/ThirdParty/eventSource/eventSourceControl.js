/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-02-20 09:56:10
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2025-10-24 15:50:50
 */
import store from '@/store'
import {
  seaAirJointOperationsPA,
  seaAirJointOperationsPD,
  seaAirJointOperationsSceneTime,
  seaAirJointOperationsState,
  toWebCommand,
  controlResByafSim,
  startScene,
  computeFPS,
  pointQbByPositionData,
  pointRhQbData,
  qaOperationData,
  webCZML,
  entities,
  primitive
} from '@/utils/earthPlugin/ThirdParty/eventSource/event/earthEvent'
import ProtoBufController from './proto/protobufMQ'
import RedProtoBufController from './proto/redSideMQ'
import BlueProtoBufController from './proto/blueSideMQ'
import EventMQController from './proto/eventByMQ'
import UEMQController from './proto/UEByMQ'
import ARSIMByMQController from './proto/ARSIMByMQ'
import { RE_InterferenceRange } from '@/utils/earthPlugin/ThirdParty/eventSource/event/earthActionByEvent'
import { playVoice } from '@/utils/voice'
import emitter from '@/utils/eventbus'
// import SourceControlByWebSocket from './sourceControlByWebSocket'
import {
  radarCreateBylanjieScenario,
  eventControllerSSEClose
} from '@/utils/mapTools'
import { getNowTaskInfo } from '@/service/taskManagement'
import { startExperiment } from '@/service/combatSimulation.js'
import { toPosition } from '@/service/command'
import { sendToCommandShowResMsg } from '@/utils/mapTools'
import { setPlateformStatus } from '@/service/afsim/index'
class EventSourceController {
  constructor(options) {
    // this.czmlEventSource = null
    this.czmlEventSource = {}
    this.baseUrl = options.baseUrl
    this.option = null
  }
  initStream(type) {
    // isTopic 作为SSE和websocket两种接收消息模式切换的标识符，可通过系统右上角全局配置改变其值来切换消息获取模式，切换需要进入系统选中然后再刷新即可。
    if (!store.state.sceneModule.systemConfig.isTopic) {
      if (EarthAPP.useSSE) {
        //原来sse接收模式
        const newDate = new Date().getTime() //时间序列，确保SSE用户的唯一标识，方便后台管理

        window.curSceneIDArr = []
        window.curSceneIDArr.push(newDate)
        store.commit('setCurSceneIDArr', window.curSceneIDArr)

        window.curSceneID = newDate
        store.commit('setCurSceneID', newDate) // 逐步替换window.curSceneID
        let side =
          window.localStorage.getItem('systemTitle') == '复盘回放'
            ? 'admin-replay'
            : window.localStorage.getItem('side') // 获取阵营信息，阵营信息在登录的时候从后台获取并存储到localStorage，这里从缓存里获取并作为参数构建SSE连接的URL
        const url = `${serverUrls.serversCommunication1}EventSourceController/v1/getMsg/${side}@${window.curSceneIDArr[0]}` //SSE连接用的URL参数
        console.log('SSE连接方式URL', url)
        this.czmlEventSource[window.curSceneIDArr[0]] = new EventSource(url) // 初始化SSE
        this.czmlEventSource[window.curSceneIDArr[0]].onopen = function () {
          console.log('Connection to server opened.' + window.curSceneIDArr[0])
        }
        this.czmlEventSource[window.curSceneIDArr[0]].onerror = function () {
          console.log('EventSource failed.' + window.curSceneIDArr[0])
        }

        //获取当前场景信息
        getNowTaskInfo().then((res) => {
          //获取当前推演场景中的taskid
          if (res.code == 200) {
            if (
              res.data.length == 1 &&
              res.data[0].textInfo == '暂无场景启动'
            ) {
            } else {
              store.commit(
                'setCurSceneTime',
                res.data[0].textInfoData.startTime
              )
            }
          }
        })
        // 开始监听CZML实时数据和各种消息事件
        this.initEvent()
        // proto
        const protoController = new ProtoBufController()
        protoController.initProto()
      } else {
        //获取当前场景信息
        getNowTaskInfo().then((res) => {
          //获取当前推演场景中的taskid
          if (res.code == 200) {
            if (
              res.data.length == 1 &&
              res.data[0].textInfo == '暂无场景启动'
            ) {
            } else {
              store.commit(
                'setCurSceneTime',
                res.data[0].textInfoData.startTime
              )
            }
          }
        })
        // 开始监听CZML实时数据和各种消息事件
        // this.initEvent()
        this.initMQ()
      }
    } else {
      //websocket中间件模式 暂时把SourceControlByWebSocket对应js文件压缩了 此处先注销
      // let sourceControlByWebSocket = new SourceControlByWebSocket()
      // sourceControlByWebSocket.initClientSocket()
    }
  }
  initMQ() {
    // 需要增加根据当前登录的阵营判断使用哪个类别消息
    let side = window.localStorage.getItem('side')
    let protoController = null
    switch (side) {
      case 'red':
        // proto
        protoController = new RedProtoBufController()
        protoController.initProto()
        break
      case 'blue':
        protoController = new BlueProtoBufController()
        protoController.initProto()
        break
      case 'admin':
        // proto
        protoController = new ProtoBufController()
        protoController.initProto()
        break
      default:
        break
    }
    // event
    const eventMQController = new EventMQController()
    eventMQController.initEventMQ()
    const arSIMByMQController = new ARSIMByMQController()
    arSIMByMQController.initEventMQ()
    const ueMQController = new UEMQController()
    ueMQController.initEventMQ()
  }
  /**
   * 重启数据流
   * @param {*} params
   */
  async restartStream(type) {
    // 判断数据流容器当前状态
    // if (this.czmlEventSource) {
    //   // 关闭当前数据流
    //   this.czmlEventSource.close()
    //   // 重启数据流
    //   this.initStream()
    // }
    //需要添加接口关闭事件：eventControllerSSEClose
    if (this.czmlEventSource && Object.keys(this.czmlEventSource).length > 0) {
      for (const key in this.czmlEventSource) {
        const czmlEventSourceCur = this.czmlEventSource[key]
        // 判断数据流容器当前状态
        if (czmlEventSourceCur) {
          await eventControllerSSEClose(czmlEventSourceCur) //关闭sse连接
          store.state.sceneModule.sceneEnityData = [] //置空当前静态目标集合
          // 关闭当前数据流
          czmlEventSourceCur.close()
          delete this.czmlEventSource[key]
        }
      }
    }
    setTimeout(() => {
      store.commit('setCurSceneIDArr', [])
      this.czmlEventSource = {}
      EarthAPP.SIMInfoCount = 0
      EarthAPP.i = 0
      console.log(
        '重新连接前倍速',
        window.EarthViewer.clock.multiplier,
        EarthAPP.timeC
      )
      // 重启数据流
      this.initStream(type)
    }, 5000)
  }
  /**
   * 关闭数据流
   */
  closeStream() {
    // 判断数据流容器当前状态
    // if (this.czmlEventSource) {
    //   // 关闭当前数据流
    //   this.czmlEventSource.close()
    // }
    if (this.czmlEventSource && Object.keys(this.czmlEventSource).length > 0) {
      for (const key in this.czmlEventSource) {
        const czmlEventSourceCur = this.czmlEventSource[key]
        // 判断数据流容器当前状态
        if (czmlEventSourceCur) {
          // 关闭当前数据流
          if (czmlEventSourceCur) {
            czmlEventSourceCur.close()
            delete this.czmlEventSource[key]
          }
        }
      }
    }
    store.commit('setCurSceneIDArr', [])
    this.czmlEventSource = {}
  }
  /**
   *监听czml数据推送
   */
  addEventListenerCZML() {
    let that = this
    const { handleWebCzmlUpdate } = webCZML()
    const { handleWebEntitiesUpdate } = entities()
    const { handleWebPrimitiveUpdate } = primitive()
    for (const key in this.czmlEventSource) {
      const czmlEventSourceCur = this.czmlEventSource[key]
      // 基于席位判定仿真数据接收模式
      let currentSide = window.localStorage.getItem('side')
      if (currentSide === 'red_qb') {
        //监听红方请报席
        that.addEventListener(
          'czml_red_qb',
          function (json) {
            if (window.localStorage.getItem('side') == 'red_qb') {
              try {
                handleWebCzmlUpdate(json)
              } catch (t) {
                console.error(t ? t : '监听事件red_qb - that.addEventListener')
              }
            }
          },
          false
        )
      } else if (currentSide === 'blue_qb') {
        //监听蓝方请报席
        that.addEventListener(
          'czml_blue_qb',
          function (json) {
            if (window.localStorage.getItem('side') == 'blue_qb') {
              try {
                handleWebCzmlUpdate(json)
              } catch (t) {
                console.error(t ? t : '监听蓝方请报席 - that.addEventListener')
              }
            }
          },
          false
        )
      } else if (currentSide === 'red') {
        czmlEventSourceCur.addEventListener(
          'pathConfig',
          function (czmlUpdate) {
            try {
              let json = JSON.parse(czmlUpdate.data)
              console.log('red', json.data.vision, json.data)
              let entity = window.EarthPlugn.entity._GetCZMLEntity(
                json.data.name,
                'MSIMEarthCZMLProcessContainer'
              )
              if (entity) {
                switch (json.data.vision) {
                  case 'R':
                    entity.show = true
                    break
                  case 'B':
                    entity.show = false
                    break
                  case 'RB':
                    entity.show = true
                    break
                  default:
                    break
                }
              }
              handleWebCzmlUpdate(json)
              // handleWebEntitiesUpdate(json)
              // handleWebPrimitiveUpdate(json)
            } catch (t) {
              console.error(t)
            }
          },
          false
        )
      } else {
        czmlEventSourceCur.addEventListener(
          'pathConfig',
          function (czmlUpdate) {
            try {
              let json = JSON.parse(czmlUpdate.data)
              handleWebCzmlUpdate(json)
              // handleWebEntitiesUpdate(json)
              // handleWebPrimitiveUpdate(json)
            } catch (t) {
              console.error(t)
            }
          },
          false
        )
      }
    }
  }
  /**
   * 监听事件
   * @param {string} eventName 监听的事件名称
   * @param {string} callback 回调函数
   */
  addEventListener(eventName, callback) {
    // this.czmlEventSource.addEventListener(eventName, function (e) {
    //   try {
    //     let json = JSON.parse(e.data)
    //     if (typeof json === 'undefined' || json === null) return
    //     callback(json)
    //   } catch (t) {
    //     console.error(t)
    //   }
    // })

    for (const key in this.czmlEventSource) {
      const czmlEventSourceCur = this.czmlEventSource[key]
      czmlEventSourceCur.addEventListener(eventName, function (e) {
        try {
          if (e) {
            let json =
              e.data && typeof e.data === 'string'
                ? JSON.parse(e.data)
                : 'undefined'
            if (json === 'undefined' || json === null) return
            callback(json)
          }
        } catch (t) {
          console.error(
            t
              ? 'eventName:' +
              eventName +
              ', e.data:' +
              e.data +
              ', message:' +
              t.message
              : '监听事件 - addEventListener'
          )
        }
      })
    }
  }
  /**
   * 默认事件初始化
   */
  initEvent() {
    let that = this
    const { handlePA } = seaAirJointOperationsPA()
    const { handleState } = seaAirJointOperationsState()
    const { handlePD } = seaAirJointOperationsPD()
    const { getSceneTime } = seaAirJointOperationsSceneTime()
    const { createRadar } = RE_InterferenceRange()
    const { handleWebCzmlUpdate } = webCZML()
    const {
      handleCommand,
      showGroupScope,
      createGroupConnectLines,
      handleAreaFile,
      entityLock,
      handleOperationalAreaFile
    } = toWebCommand()
    const { handleControlRes } = controlResByafSim()
    const { handleStartScene } = startScene()
    //k3合并过来代码
    const { handlePointQb } = pointQbByPositionData()
    const { handlePointRhQb } = pointRhQbData()
    const { handleQaOperation } = qaOperationData()
    that.addEventListener('PA', function (json) {
      //初始化静态场景
      console.log('PA目标', json)
      store.state.AFSIMModule.paData.push(json)
      handlePA(json)
    })
    that.addEventListener('state', function (json) {
      //各种事件
      handleState(json)
    })
    that.addEventListener('Comment', function (json) {
      //各种事件
      handleState(json)
    })
    that.addEventListener('PD', function (json) {
      //清除目标
      // clearInterval(window.ListenerLabel)
      handlePD(json)
    })
    that.addEventListener('LogInfo', function (json) {
      store.commit('setCzmlEventSourceData', json)
    })
    that.addEventListener('Voice', function (json) {
      if (json && json.load) {
        playVoice(json.load)
      }
    })
    that.addEventListener('StartingFalse', function (json) {
      // 场景载入数据结束
      beautyToast.success({
        title: '添加',
        message: '红方目标布设完成',
        darkTheme: true
      })
      beautyToast.success({
        title: '添加',
        message: '蓝方目标布设完成',
        darkTheme: true
      })
    })
    that.addEventListener('StartingFalseInfo', function (json) {
      // 场景数据解析信息
      store.commit('setStartingFalseInfo', json)
    })
    // that.addEventListener('AT', function (json) {
    //   console.log('AT', json)
    //   // 仿真时间
    // let flyControl = store.state.experimentModule.flyControl
    //   if (!store.state.sceneModule.isReplayType && flyControl) {
    //     //判断是否为复盘功能进行过滤，防止影响复盘的时间轴倍速
    //     getSceneTime(json.Data)
    //   }
    // })
    that.addEventListener('Pausing', function (json) {
      // 场景暂停
      window.EarthViewer.clock.shouldAnimate = false
    })

    that.addEventListener('red_distribution_seat_message', function (json) {
      // 红方qb席上传文件
      if (window.localStorage.getItem('side') == 'red_zhkz') {
        // ElMessage.success("红方情报上传成功")
        ElNotification({
          title: '通知',
          type: 'success',
          message: `红方情报上传成功`,
          duration: 2000
        })
      }
    })
    that.addEventListener('blue_distribution_seat_message', function (json) {
      // 蓝方qb席上传文件
      if (window.localStorage.getItem('side') == 'blue_zhkz') {
        ElNotification({
          title: '通知',
          type: 'success',
          message: `蓝方情报上传成功`,
          duration: 2000
        })
      }
    })
    that.addEventListener('Resuming', function (json) {
      // 场景继续
      window.EarthViewer.clock.shouldAnimate = true
    })
    that.addEventListener('echartsInfo', function (json) {
      // 毁伤评估数据
      store.commit('setDamageAssessmentData', json)
    })
    that.addEventListener('timeOverview', function (json) {
      // 底部阶段性描述数据
      store.commit('settimeOverviewData', json)
    })
    // that.addEventListener('Starting', function (json) {  // 场景数据解析信息

    // })
    that.addEventListener('PA_Simulator', function (json) {
      // 模拟器接入   PA 消息 开机只发个一次（暂时注释）
      //store.commit('setTargetSimInfor', json)
    })
    that.addEventListener('atmosphereArea', function (json) {
      // 天气区域干扰飞机感知半径
      emitter.emit('changeFrumstumByInterference', JSON.parse(json.message))
    })
    that.addEventListener('operationalArea', function (json) {
      // 作战区域 提示信息
      // emitter.emit('jrOperationalAreaByInterference', JSON.parse(json.message))
    })
    that.addEventListener('operationalAreaFile', function (json) {
      //作战区域 geoJson 文件、天气区域文件
      handleOperationalAreaFile(json)
    })
    that.addEventListener('Command', function (json) {
      //接收后台发送的操作web端指令,数据格式：{Cmd:"radarEcho",Type:"loadData"}
      handleCommand(json)
    })
    that.addEventListener('command', function (json) {
      //接收后台发送的操作web端指令,数据格式：{Cmd:"radarEcho",Type:"loadData"}
      console.log(json)
    })
    that.addEventListener('AreaFile', function (json) {
      // 接收后台发送的操作web端指令,数据格式：{"fileName":"16.json"}
      handleAreaFile(json.fileName)
    })
    // GroupBuffer 和group是K3场景使用的，暂时不需要
    // that.addEventListener('GroupBuffer', function (json) {
    //   //接收飞机编组范围数据
    //   showGroupScope(json)
    // })
    // that.addEventListener('Group', function (json) {
    //   //接收编组构成成员关系数据
    //   createGroupConnectLines(json)
    // })
    that.addEventListener('ControlRes', function (json) {
      //接收afSim 指令回执信息数据  暂时不显示
      // handleControlRes(json)
    })
    //监听红方情报席修改后的数据
    that.addEventListener(
      'czml_red_qb_edited',
      function (json) {
        if (
          window.localStorage.getItem('side') != 'red_qb' &&
          window.localStorage.getItem('side') != 'blue_zhkz'
        ) {
          try {
            handleWebCzmlUpdate(json)
          } catch (t) {
            console.error(t ? t : '监听事件red_qb - that.addEventListener')
          }
        }
      },
      false
    )
    //监听蓝方请报席修改后的数据
    that.addEventListener(
      'czml_blue_qb_edited',
      function (json) {
        if (window.localStorage.getItem('side') != 'blue_qb') {
          try {
            handleWebCzmlUpdate(json)
          } catch (t) {
            console.error(t ? t : '监听蓝方请报席 - that.addEventListener')
          }
        }
      },
      false
    )
    that.addEventListener('weatherUrl', function (json) {
      //环境天气  降水
      // if (store.state.sceneModule.weatherOcanLayers.length > 0) {
      //   let paramsLayers = {
      //     layers: store.state.sceneModule.weatherOcanLayers
      //   }
      //   window.sceneAction.weatherOceanController.removePrePData(paramsLayers)
      //   store.commit('setWeatherOcanLayers', [])
      // }
      // //加载降水色斑图
      // if (json.Data && json.Data.length > 0) {
      //   let params = {
      //     tileUrl: json.Data
      //   }
      //   window.sceneAction.weatherOceanController.loadPrePData(params)
      // }
    })
    that.addEventListener(
      'Start',
      function (json) {
        console.log('场景开始', json)
        handleStartScene(json)
      },
      false
    )
    that.addEventListener('heartbeat', function (json) {
      //接收afSim 指令回执信息数据
    })
    that.addEventListener('UE_LockInfo', function (json) {
      //接收UE消息 锁定目标
      entityLock(json)
    })
    that.addEventListener('InterferenceRange', function (json) {
      // 创建雷达遮罩
      createRadar(json)
    })
    that.addEventListener('Comprehensive', function (json) {
      store.commit('setAnalysisInfoData', json)
    })
    that.addEventListener('simTaskInfo', function (json) {
      //red_zhkz、red_qb接收场景切换的提示消息
      if (window.localStorage.getItem('side') != 'admin') {
        ElMessage.success(json.textInfo)
      }
    })

    if (store.state.curSceneName !== EarthAPP.towthousand)
      that.addEventListener('positionConfig', function (json) {
        if (EarthAPP.SIMInfoCount < EarthAPP.SIMInfoMaxValue) {
          return
        }
        let curEn
        let curLabel
        EarthAPP.billboardCollection._billboards.forEach((e) => {
          if (e && e.id) {
            curEn = window.EarthPlugn.entity._GetCZMLEntity(
              e.id,
              'MSIMEarthCZMLProcessContainer'
            )
            curLabel = EarthAPP.labelCollectionD.get(e._index)
            if (window.MSIMEarth.defined(e)) {
              // if (window.MSIMEarth.defined(e) && window.MSIMEarth.defined(e.id)) {
              if (
                window.MSIMEarth.defined(curEn) &&
                window.MSIMEarth.defined(curEn.position)
              ) {
                let curPosition = curEn.position.getValue(
                  window.EarthViewer.clock.currentTime
                )
                if (
                  window.MSIMEarth.defined(curPosition) &&
                  window.MSIMEarth.defined(curLabel) &&
                  window.MSIMEarth.defined(e.position)
                ) {
                  curLabel.position = curPosition
                  e.position = curPosition
                  curLabel = null
                  curEn = null
                }
              }
            }
          }
        })
        // computeFPS()
      })
    //k3合并过来代码-接收点位qb位置数据
    that.addEventListener('point_red_qb', function (json) {
      // qb  特定场景 以及 特定席位下接受消息
      if (EarthAPP.qbXiaoxiBySceneName.indexOf(store.state.curSceneName) > -1) {
        // admin 接收点位信息  czml 动态MB之前显示，L2阶段（发现新目标，正在定位目标位置）
        handlePointQb(json)
      }
    })
    //接收L1-L10的qbZC阶段数据和提示消息   ---  qb  特定场景 以及 特定席位下接受消息
    that.addEventListener('qa_operation', function (json) {
      if (EarthAPP.qbXiaoxiBySceneName.indexOf(store.state.curSceneName) > -1) {
        handleQaOperation(json)
      }
    })
    //获取左侧弹框所有weixie目标数据
    that.addEventListener('ThreatPrediction', function (json) {
      if (json.length > 0) {
        json.forEach((element) => {
          element.weightValue = Math.round(element.weightValue * 100)
        })
        store.commit('setThreatAllData', json)
      }
    })
    //获取某一weixie目标的weixie评分表格数据
    that.addEventListener('OneThreatPrediction', function (json) {
      store.commit('setOnePlateThreatScore', json)
    })
    //获取某一weixie目标的雷达图数据
    that.addEventListener('ThreatPredictionRadarMap', function (json) {
      store.commit('setThreatPredictionRadarData', json)
    })
    // 获取基于AI机制获取的消息
    that.addEventListener('AI_INFO', function (json) {
      //接收afSim 指令回执信息数据
      console.log('AI_INFO~', json)

      // "camera&wz-7_1&focus"
      let info = json.command
      switch (info) {
        case '协同探测模型':
          startExperiment('4').then((res) => {
            if (res.code != 200) {
              return (
                ElMessage.error(res.message) ||
                ElMessage.error('网络请求失败,请稍后重试！')
              )
            }
            // 开启实验加载过程
            // ElMessage.success(`[${row.name}]${res.data}!`)
            // store.state.sceneModule.experimentInfo.name = row.name
            // store.state.sceneModule.experimentInfo.info = res.data

            if (EventController) {
              eventControllerSSEClose(EventController)
            }
            EventController = new window.EarthPlugn.EventSourceController({
              baseUrl: serverUrls.serversCommunication
            })
            EventController.initStream()
          })
          break
        case '持续侦察模型':
          startExperiment('5').then((res) => {
            if (res.code != 200) {
              return (
                ElMessage.error(res.message) ||
                ElMessage.error('网络请求失败,请稍后重试！')
              )
            }
            // 开启实验加载过程
            // ElMessage.success(`[${row.name}]${res.data}!`)
            // store.state.sceneModule.experimentInfo.name = row.name
            // store.state.sceneModule.experimentInfo.info = res.data

            if (EventController) {
              eventControllerSSEClose(EventController)
            }
            EventController = new window.EarthPlugn.EventSourceController({
              baseUrl: serverUrls.serversCommunication
            })
            EventController.initStream()
          })
          break
        case '序贯打击模型':
          startExperiment('7').then((res) => {
            if (res.code != 200) {
              return (
                ElMessage.error(res.message) ||
                ElMessage.error('网络请求失败,请稍后重试！')
              )
            }
            // 开启实验加载过程
            // ElMessage.success(`[${row.name}]${res.data}!`)
            // store.state.sceneModule.experimentInfo.name = row.name
            // store.state.sceneModule.experimentInfo.info = res.data

            if (EventController) {
              eventControllerSSEClose(EventController)
            }
            EventController = new window.EarthPlugn.EventSourceController({
              baseUrl: serverUrls.serversCommunication
            })
            EventController.initStream()
          })
          break
        default:
          if (info.indexOf('http') > -1) {
            let str = decodeURI(info)
            let arr = str.split('@')
            let name = arr[0]
            let temp_path = arr[1]
            let temp_path_1 = temp_path.replace('+', '://')
            let path = temp_path_1.replace(/,/g, '/')
            sessionStorage.setItem('name', name)
            sessionStorage.setItem('path', path)
            if (window.pushCallbacl) {
              window.pushCallbacl()
            }
          } else {
            let obj = JSON.parse(info)
            console.log(obj)
            startExperiment(obj.sceneId).then((res) => {
              if (res.code != 200) {
                return (
                  ElMessage.error(res.message) ||
                  ElMessage.error('网络请求失败,请稍后重试！')
                )
              }
              // 开启实验加载过程
              // ElMessage.success(`[${row.name}]${res.data}!`)
              // store.state.sceneModule.experimentInfo.name = row.name
              // store.state.sceneModule.experimentInfo.info = res.data

              if (EventController) {
                eventControllerSSEClose(EventController)
              }
              EventController = new window.EarthPlugn.EventSourceController({
                baseUrl: serverUrls.serversCommunication
              })
              EventController.initStream()
            })
          }

          break
      }
      let targetId = info.split('&')[1]
      console.log('AI_INFO2~', targetId)
      let targetEntity = window.EarthPlugn.entity._GetCZMLEntity(
        String(targetId),
        'MSIMEarthCZMLProcessContainer'
      )
      if (targetEntity) EarthViewer.flyTo(targetEntity)
    })
    // 模型选中调用场景消息
    that.addEventListener('message', function (json) {
      //各种事件
      console.log('模型调用', json)
    })
  }

  // 评估
  initStreamByEstimate() {
    //原来sse接收模式
    const newDate = new Date().getTime() //时间序列，确保SSE用户的唯一标识，方便后台管理
    window.curSceneID = newDate
    store.commit('setCurSceneID', newDate) // 逐步替换window.curSceneID

    const newDate2 = new Date().getTime() //时间序列，确保SSE2用户的唯一标识，方便后台管理
    const newDate3 = new Date().getTime() //时间序列，确保SSE3用户的唯一标识，方便后台管理
    window.curSceneIDArr = []
    window.curSceneIDArr.push(newDate)
    window.curSceneIDArr.push(Number(newDate2) + 1)
    window.curSceneIDArr.push(Number(newDate3) + 2)
    store.commit('setCurSceneIDArr', window.curSceneIDArr)

    let side = 'admin' // 获取阵营信息，暂时写死
    // const url = `${this.baseUrl}EventSourceController/v1/getMsg/${side}@${window.curSceneID}` //SSE连接用的URL参数

    const url = `${serverUrls.serversCommunication1}EventSourceController/v1/getMsg/${side}@${window.curSceneIDArr[0]}` //SSE连接用的URL参数
    const url2 = `${serverUrls.serversCommunication2}EventSourceController/v1/getMsg/${side}@${window.curSceneIDArr[1]}` //SSE连接用2的URL参数
    const url3 = `${serverUrls.serversCommunication3}EventSourceController/v1/getMsg/${side}@${window.curSceneIDArr[2]}` //SSE连接用3的URL参数
    console.log('SSE连接方式URL', url)
    // this.czmlEventSource = new EventSource(url) // 初始化SSE
    this.czmlEventSource[window.curSceneIDArr[0]] = new EventSource(url) // 初始化SSE
    this.czmlEventSource[window.curSceneIDArr[1]] = new EventSource(url2) // 初始化SSE2
    this.czmlEventSource[window.curSceneIDArr[2]] = new EventSource(url3) // 初始化SSE3

    // 连接刚被打开,收到 open 事件。
    // this.czmlEventSource.onopen = function () {
    //   console.log('Connection to server opened.')
    // }
    this.czmlEventSource[window.curSceneIDArr[0]].onerror = function () {
      console.log('EventSource failed.' + window.curSceneIDArr[0])
    }
    this.czmlEventSource[window.curSceneIDArr[1]].onerror = function () {
      console.log('EventSource failed.' + window.curSceneIDArr[1])
    }
    this.czmlEventSource[window.curSceneIDArr[2]].onerror = function () {
      console.log('EventSource failed.' + window.curSceneIDArr[2])
    }

    //获取当前场景信息
    getNowTaskInfo().then((res) => {
      //获取当前推演场景中的taskid
      if (res.code == 200) {
        if (res.data.length == 1 && res.data[0].textInfo == '暂无场景启动') {
        } else {
          store.commit('setCurSceneTime', res.data[0].textInfoData.startTime)
        }
      }
    })
    // 开始监听各种消息事件
    this.initEventByEstimate()
  }
  // 评估  各种消息事件
  initEventByEstimate() {
    const { getSceneTime } = seaAirJointOperationsSceneTime()
    let that = this
    that.addEventListener('Comprehensive', function (json) {
      store.commit('setAnalysisInfoData', json)
    })
    that.addEventListener('LogInfo', function (json) {
      //日志
      store.commit('setCzmlEventSourceData', json)
    })
    that.addEventListener('AT', function (json) {
      //仿真时间
      // 仿真时间
      getSceneTime(json.Data)
    })
  }
  //复盘所需的sse连接方法
  initStreamReplay() {
    // isTopic 作为SSE和websocket两种接收消息模式切换的标识符，可通过系统右上角全局配置改变其值来切换消息获取模式，切换需要进入系统选中然后再刷新即可。
    if (!store.state.sceneModule.systemConfig.isTopic) {
      //原来sse接收模式
      const newDate = new Date().getTime() //时间序列，确保SSE用户的唯一标识，方便后台管理
      window.curSceneIDArr = []
      window.curSceneIDArr.push(newDate)

      store.commit('setCurSceneIDArr', window.curSceneIDArr)

      window.curSceneID = newDate
      store.commit('setCurSceneID', newDate) // 逐步替换window.curSceneID
      let side = 'admin-replay' // 获取阵营信息，阵营信息在登录的时候从后台获取并存储到localStorage，这里从缓存里获取并作为参数构建SSE连接的URL
      // const url = `${this.baseUrl}EventSourceController/v1/getMsg/${side}@${window.curSceneID}` //SSE连接用的URL参数
      const url = `${serverUrls.serversCommunication1}SseEmitterReplayController/v1/getMsg/${side}@${window.curSceneIDArr[0]}` //SSE连接用的URL参数
      console.log('SSE连接方式URL', url)
      // this.czmlEventSource = new EventSource(url) // 初始化SSE
      this.czmlEventSource[window.curSceneIDArr[0]] = new EventSource(url)
      // 连接刚被打开,收到 open 事件。
      // this.czmlEventSource.onopen = function () {
      //   console.log('Connection to server opened.')
      // }
      this.czmlEventSource[window.curSceneIDArr[0]].onopen = function () {
        console.log('Connection to server opened.' + window.curSceneIDArr[0])
      }

      this.czmlEventSource[window.curSceneIDArr[0]].onerror = function () {
        console.log('EventSource failed.' + window.curSceneIDArr[0])
      }

      //获取当前场景信息
      getNowTaskInfo().then((res) => {
        //获取当前推演场景中的taskid
        if (res.code == 200) {
          if (res.data.length == 1 && res.data[0].textInfo == '暂无场景启动') {
          } else {
            store.commit('setCurSceneTime', res.data[0].textInfoData.startTime)
          }
        }
      })
      // 开始监听CZML实时数据和各种消息事件
      this.addEventListenerCZML()
      this.initEvent()
    } else {
      //websocket中间件模式 暂时把SourceControlByWebSocket对应js文件压缩了 此处先注销
      // let sourceControlByWebSocket = new SourceControlByWebSocket()
      // sourceControlByWebSocket.initClientSocket()
    }
  }
  // 指令上注
  zlsz() {
    const option = {
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    }
    const sceneAction = new window.EarthPlugn.sceneAction(option)
    let color = window.MSIMEarth.Color.fromCssColorString('#ff0000') //('#0a78e9')
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
      materialImg: require('/public/static/image/texture/jt11.png')
    })
  }
  // 地面站向kj500发消息
  dmzToKJ500() {
    const option = {
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    }
    const sceneAction = new window.EarthPlugn.sceneAction(option)
    let color = window.MSIMEarth.Color.fromCssColorString('#ff0000') //('#0a78e9')
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
  KJ500ToOthers() {
    const option = {
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    }
    const sceneAction = new window.EarthPlugn.sceneAction(option)
    let color = window.MSIMEarth.Color.fromCssColorString('#ff0000') //('#0a78e9')
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
  identifyInfoCOnfig(info, jd) {
    console.log('alksdfkdasf', info, jd)
    switch (jd) {
      case 0:
        store.state.sceneModule.identifyColor = {
          color1: 'rgba(19, 240, 240, 0.26)',
          color2: 'rgba(0, 255, 195, 0)',
          textShadow1: '#00ffc3',
          textShadow2: '#00ffc3',
          jd: 0
        }
        break
      case 1:
        store.state.sceneModule.identifyColor = {
          color1: 'rgba(255, 2, 2, 0.06)',
          color2: 'rgba(255, 2, 2, 0.06)',
          textShadow1: '#f63b4c',
          textShadow2: '#f63b4c',
          jd: 1
        }
        break
      case 2:
        store.state.sceneModule.identifyColor = {
          color1: 'rgba(240, 236, 19, 0.26)',
          color2: 'rgba(240, 236, 19, 0.26)',
          textShadow1: '#ecf013',
          textShadow2: '#ecf013',
          jd: 2
        }
        break
      default:
        break
    }
    store.state.sceneModule.identifyInfo = info
    store.state.sceneModule.phasedDescription.push({
      time: '',
      key: 'suicide attack',
      value: info
    })
    store.state.sceneModule.showIdentify = true
  }
}
export default EventSourceController
