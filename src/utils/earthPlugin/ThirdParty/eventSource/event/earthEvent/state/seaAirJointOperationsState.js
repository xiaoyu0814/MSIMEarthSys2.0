import store from '@/store'
import {
  RE_STrack,
  RE_LTrack,
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
import { airplaneSensorOFF, initSuSensorOn, initSuSensorOff } from './stateControlMethods'
import { showSysMessage } from '@/utils/mapTools'
import emitter from '@/utils/eventbus'
import { airplaneSensorONFPByTime } from './ActionByEvent/Opt_FPSensorType'
export default function () {
  const { initLTrackLine, dropLTrackLine } = RE_LTrack()
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
        console.log('SU',json.Data.PName,json);
        // getPlatformSensorVolumes({ platform: json.Data.PName }).then((res) => {
        //   if (res.status == 'success') 
        //   console.log('successsuccess',res)
        // })
        if (sensorPlateformArr.indexOf(json.Data.PName) > -1) {
          if (json.Data.ON) {
            if (store.state.AFSIMModule.fp) {
              // 如果当前运行的是复盘场景则使用复盘对应的方法打开遮罩
              airplaneSensorONFPByTime({
                platformName: json.Data.PName,
                targetName: 'M142_1',
                sensorType: json.Data.Name
              })
            } else {
              initSuSensorOn(json)
            }
          } else {
            if (store.state.AFSIMModule.fp) {
              // 如果当前运行的是复盘场景则使用复盘对应的方法打开遮罩
            airplaneSensorOFF({platformName: json.Data.PName})
            
            } else {
              initSuSensorOff(json)
            }
          }
        }
        break
      case 'plateMove':
        //添加延迟1s，以免在PA创建之前就执行
        setTimeout(() => {
          window.EarthViewer.entities.removeById(json.Data.Name)
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
      case 'RE_STrackInit':  //传感器追踪开启
        if (sensorPlateformArr.indexOf(json.Data.sName) > -1 && json.Data.sSide == 'red') {
          initSTrackLine(json) 
        }
        break
      case 'RE_STrackDrop': //传感器追踪断开
        dropSTrackLine(json)
        break
      case 'RE_LTrackInit': //局域追踪开启
        initLTrackLine(json)
        break
      case 'RE_LTrackDrop': //局域追踪断开
        //dropLTrackLine(json)  //事件现在是射线方式，无需断开
        break
      case 'Weapon_WH':
        // initWeaponWHLine(json)
        // 体现打击结果 PD里的爆炸效果可以尝试放到这
        break
      case 'RE_WeaponF': //火力打击
        initWeaponFLine(json)
        break
      case 'RE_WeaponT': //火力打击断开
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
      case 'RE_JamA': //电磁干扰开启
        initJamATrackLine(json)
        break
      case 'RE_JamT': //电磁干扰关闭
        dropJamATrackLine(json)
        break
      case 'Task_Aign':  //任务关联开启
        initTaskAign(json)
        break
      case 'Task_Cancel':   //任务关联断开
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
      case 'RE_MR': //卫星通信开启
        initMRLine(json)
        break
      case 'RE_MRE': //卫星通信断开
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
