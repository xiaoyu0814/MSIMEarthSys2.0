import store from '@/store'
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
import {
  createDetectFrustumFun,
  removeDetectFrustum,
  createNoManDetectFrustumFun
} from '@/utils/earthPlugin/ThirdParty/cameraControl/cameraControl'
import { airplaneSensorON, airplaneSensorONFP, airplaneSensorOFF, initSuSensorOn, updateSensorVolume,initSuSensorOff } from './stateControlMethods'
import { showSysMessage, setSatelliteType } from '@/utils/mapTools'
import emitter from '@/utils/eventbus'
export default function () {
  const { initTrackLine, dropTrackLine } = RE_LTrack()
  const { sensorSwitch } = SU()
  const { initWeaponFLine } = RE_WeaponF()
  const { initJamLine, dropJamLine, sensorJam } = RE_Jam()
  const { initMissileIntercept } = RE_MissileIntercept()
  const { initMRLine, dropMRLine } = RE_MR()
  const { initSTrackLine, dropSTrackLine } = RE_STrack()
  const { initTaskAign, dropTaskAign } = Task_Aign()
  const { initWeaponWHLine, dropWeaponWHLine } = RE_WeaponWH()
  const { initSDCLine, dropSDCLine } = RE_SDC()
  const { createRadar, resumeRadar } = RE_InterferenceRange()
  const { initJamATrackLine, dropJamATrackLine } = RE_JamA()
  const { handleComment } = RE_Comment()
  // 场景演播过程中各种消息
  const handleState = (json) => {
    switch (json.Type) {
      case 'SU':
        console.log('SU',json);
        //可见光卫星开机或关机
        if (satellitePlateformArr.indexOf(json.Data.PName) > -1 || airplanePlateformArr.indexOf(json.Data.PName) > -1) {
          if (json.Data.ON) {
            if (store.state.AFSIMModule.fp) {
              // 如果当前运行的是复盘场景则使用复盘对应的方法打开遮罩
              airplaneSensorONFP({
                platformName: json.Data.PName,
                targetName: 'M142_1',
                sensorType: json.Data.Name
              })
            } else {
              initSuSensorOn(json)
              // airplaneSensorON({
              //   platformName: json.Data.PName,
              //   targetName: 'M142_1',
              //   sensorType: json.Data.Name,
              // })
            }
          } else {
            if (store.state.AFSIMModule.fp) {
              // 如果当前运行的是复盘场景则使用复盘对应的方法打开遮罩
            airplaneSensorOFF({platformName: json.Data.PName})
            // airplaneSensorONFP({
            //     platformName: json.Data.PName,
            //     targetName: 'M142_1',
            //     sensorType: json.Data.Name
            //   })
            } else {
              initSuSensorOff(json)
              // airplaneSensorON({
              //   platformName: json.Data.PName,
              //   targetName: 'M142_1',
              //   sensorType: json.Data.Name,
              // })
            }
          }
        }
        break
      case 'plateMove':
        //添加延迟1s，以免在PA创建之前就执行
        setTimeout(() => {
          window.EarthViewer.entities.removeById(json.Data.Name)
          // for (let i = 0; i < EarthAPP.labelCollection.length; ++i) {
          //   const l = EarthAPP.labelCollection.get(i)
          //   if (l.text === json.Data.LabelName) {
          //     EarthAPP.labelCollection.remove(l)
          //   }
          // }
          window.EarthViewer.entities.removeById(`SU==${json.Data.Name}`)
          window.EarthViewer.entities.removeById(`SU==${json.Data.Name}==big`)
          window.EarthViewer.entities.removeById(`SU==${json.Data.Name}==small`)
        }, 1000)
        break
      case 'SDC':
        //雷达探测
        if (json.Data.D) {
          initSDCLine(json)
        } else {
          dropSDCLine(json)
        }
        break
      case 'RE_STrackInit':
        //传感器追踪目标
        // console.log('RE_STrackInit', json)
        if (json.Data.sName === 'wz-10_1') {
          store.state.AFSIMModule.stracklineData.links.push({
            source: `wz-10_1`,
            target: json.Data.tName,
            value: 1
          })
          console.log(store.state.AFSIMModule.stracklineData)
        }
        // if (json.Data.sSide === 'red' && store.state.AFSIMModule.showReconnaissanceResults) {
        //   // 挂载大模型单侧结果效果
        //   // 随机1到5之间的数字
        //   const randomNum = Math.floor(Math.random() * 5) + 1
        //   const url = `/static/config/json/logo/notification_${randomNum}.json`
        //   // 加载notification_1.json文件并推进到store内保存
        //   fetch(url)
        //     .then((response) => response.json())
        //     .then((data) => {
        //       store.commit('AFSIMModule/setReconnaissanceResults', data)
        //     })
        //     .catch((error) => {
        //       console.error(`Error loading ${url}:`, error)
        //     })
        // }
        
        if (airplanePlateformArr.indexOf(json.Data.sName) > -1 && airplanePlateformArr.indexOf(json.Data.tName) > -1) {
          console.log('RE_STrackInit', json)
          initSTrackLine(json) // 针对目标开启传感器追踪
          // if (store.state.AFSIMModule.fp) {
          //   // 如果当前运行的是复盘场景则使用复盘对应的方法打开遮罩
          //   airplaneSensorONFP({
          //     platformName: json.Data.sName,
          //     targetName: json.Data.tName,
          //     sensorType: 'CCD'
          //   })
          // } else {
          //   airplaneSensorON({
          //     platformName: json.Data.sName,
          //     targetName: json.Data.tName,
          //     sensorType: 'CCD'
          //   })
          // }

        }
        if (satellitePlateformArr.indexOf(json.Data.sName) > -1) {
          console.log('RE_STrackInit', json)
          console.log('卫星追踪目标', json)
          initSTrackLine(json) // 针对卫星开启传感器追踪
        }
        break
      case 'RE_STrackDrop':
        //传感器追踪删除
        dropSTrackLine(json)
        // if (json.Data.sSide === 'red') {
        //   // 清除大模型单侧结果效果
        //   store.commit('AFSIMModule/setReconnaissanceResults', {})
        // }
        // airplaneSensorOFF({
        //   platformName: json.Data.sName
        // })
        break
      case 'RE_LTrackInit':
        // 局域追踪
        if (store.state.sceneModule.sceneLinkConfig.localTracking) {
          initTrackLine(json)
        }

        const climbData = {
          Data: {
            motion_analysis: {
              action_type: 'DETECTING' //'ASCENDING', // 行动类型
              // predicted_heading_deg: 90,
              // pitch_angle_deg: 15,
              // horizontal_distance_m: 5000,
              // vertical_distance_m: 1000,
              // total_prediction_time_s: 60,
              // predictedPath: [
              //   { lat: 25.208709, lon: 121.817667, alt: 1000 },
              //   { lat: 25.210709, lon: 121.819667, alt: 1500 },
              //   { lat: 25.212709, lon: 121.821667, alt: 2000 }
              // ],
              // estimatedTimeOfArrival: new Date().toISOString(),
              // fuelRemaining: '85%',
              // waypoints: [
              //   {
              //     lat: 25.208709,
              //     lon: 121.817667,
              //     alt: 1000,
              //     name: 'Waypoint 1'
              //   },
              //   {
              //     lat: 25.212709,
              //     lon: 121.821667,
              //     alt: 2000,
              //     name: 'Waypoint 2'
              //   }
              // ],
              // start_position_geo: {
              //   lat: 25.208709,
              //   lon: 121.817667,
              //   alt: 1000
              // },
              // end_position_geo: {
              //   lat: 25.212709,
              //   lon: 121.821667,
              //   alt: 2000
              // },
              // weapon_status: [], //武器状况
              // sensorList_status: [] //传感器状况
            }
          },
          warning_detail: '正在进行侦察行动' // 预警详情
        }
        // 需要判断当前第三视角的平台是否和json.Data.sName一致，一致的才触发事件
        if (store.getters.getCurrentNode.code === json.Data.sName) {
          // emitter.emit('FLIGHT_TRAJECTORY_PREDICTION_ADVANCED', climbData)
        }

        // if (json.Data.SourceTrackID === 'YAOGAN') {
        //   if (store.state.AFSIMModule.ATValue < 35) {
        //     initTrackLine(json)
        //   }
        // }

        // if (
        //   json.Data.SourceTrackID === 'YAOGAN' &&
        //   (json.Data.OwnPID === 'dmz_1' || json.Data.OwnPID === 'YAOGAN')
        // ) {
        //   // console.log('RE_LTrackInit', json.Type, json)
        //   initTrackLine(json)
        // }
        break
      case 'RE_LTrackDrop':
        // 局域追踪断开
        // dropTrackLine(json)
        dropSTrackLine(json) //L事件现在是射线方式，所以此处先改用S
        break
      case 'Weapon_WH':
        // initWeaponWHLine(json)
        // 体现打击结果 PD里的爆炸效果可以尝试放到这
        break
      case 'RE_WeaponF':
        initWeaponFLine(json)
        break
      case 'RE_WeaponT':
        console.log('武器断开', json)
        //武器断开
        break
      case 'RE_JamS':
        // 受到干扰
        initJamLine(json)
        // sensorJam(json)//干扰机干扰视椎
        break
      case 'RE_JamE':
        dropJamLine(json)
        dropJamATrackLine(json)
        break
      case 'RE_JamA':
        initJamATrackLine(json)
        break
      case 'RE_JamT':
        dropJamATrackLine(json)
        // 恢复雷达遮罩
        // resumeRadar(json)
        break
      case 'Task_Aign':
        //任务关联
        initTaskAign(json)
        break
      case 'Task_Cancel':
      case 'Task_Completed':
        dropTaskAign(json)
        break
      case 'process':
        // 底部阶段性描述
        store.commit('setProcess', json.Name)
        break
      case 'RE_MissileIntercept':
        // 反导
        initMissileIntercept(json)
        break
      case 'RE_MR':
        //卫星通信
        initMRLine(json)
        break
      case 'RE_MRE':
        dropMRLine(json)
        break
      case 'Weapon_Warning': //蓝方发射导弹，红方收到导弹来袭的消息
        let targetId = json.Data.EffectPN
        let distance = json.Data.Distance ? json.Data.Distance.toFixed(2) : 0
        if (targetId) {
          showSysMessage(targetId, '导弹距离我方飞机' + distance + '米')
        }
        break
      case 'Comment': //战术描述等
        let commentJson = commentTringToJson(json.Data.Comment)
        json.Data.Comment = commentJson
        let PN = json.Data.PN
        if (typeof PN !== undefined && PN !== '') {
          store.state.experimentModule.taskByComment[PN] = json.Data
        } else {
          console.log('Comment事件数据可能不合法', json)
        }
        // if (TTSPlateformArr.includes(PN)) {
        //   // 使用TTS
        //   let cameraController = new window.EarthPlugn.CameraControl({})
        //   let info = TTSVoiceArr[json.Data.Comment.Action].value
        //   cameraController.identifyInfoCOnfig(info, 1)
        // }

        break
      default:
        break
    }
  }

  // comment字符串转换为JSON对象
  const commentTringToJson = (commentString) => {
    let jsonObj = {}
    commentString.split('\n').forEach((line) => {
      const [key, value] = line.split(':')
      if (key && value) {
        jsonObj[key.trim()] = value.trim()
      }
    })
    return jsonObj
  }

  /**
   * comment文字语音播报内容配置
   * @param {*} info 播报信息
   * @param {*} jd 文字配色选项
   */
  const commentIdentifyInfoCOnfig = (info, jd) => {
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

  return { handleState }
}
