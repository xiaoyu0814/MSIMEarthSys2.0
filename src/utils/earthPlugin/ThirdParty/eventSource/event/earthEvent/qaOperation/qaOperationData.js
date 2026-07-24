import store from '@/store'
import emitter from '@/utils/eventbus'
import { detailedSignageCheckL4 } from '@/views/toolbar/layerList/hooks/showHideConfig'
import { createEllipsoidRadar } from '@/utils/mapTools'
import Bubble1 from '@/utils/bubble/dataBubble2'
import { createFrustumFun2 } from '@/utils/earthPlugin/ThirdParty/cameraControl/cameraControl'
//********************** 接收消息 qa_operation  ***************//
export default function () {
  /**
   * 目前 需要在收到消息之后 把 姿态识别，目标识别 的类型数据中的 message=> currentProcess 利用浮动消息给出提示信息
   * L1("发现目标","l1"),
     L2("点迹分析","l2"),
     L3("点迹融合","l3"),
     L4("姿态识别","l4"),
     L5("电磁特征识别","l5"),
    L6("红外特征识别","l6"),
     L7("几何特征识别","l7"),
     L8("目标识别","l8"),
     L9("趋势预测","l9"),
     L10("威胁预测","l10")
   * @param {*} json
   * @returns
   */
  const handleQaOperation = (json) => {
    if (
      typeof json === 'undefined' ||
      typeof json.type === 'undefined' ||
      typeof json.message === 'undefined'
    )
      return
    // console.log('qa_operation消息信息 - ' + json.type, json)

    let messageObj = JSON.parse(json.message)
    if (
      json.type &&
      json.type.indexOf('_') == 2 &&
      messageObj.side &&
      messageObj.side == 'blue'
    ) {
      //加载前先删除球上目标
      let type = json.type.split('_')[2]
      switch (type) {
        case 'l1':
          if (!EarthViewer.entities.getById(messageObj.name + '-wzpoint')) {
            let curColor = window.MSIMEarth.Color.fromCssColorString('#99CDD0')
            let pointColor = new window.MSIMEarth.Color(
              curColor.red,
              curColor.green,
              curColor.blue,
              1.0
            )
            let entitiesPointData = {
              id: messageObj.name + '-wzpoint',
              position: new window.MSIMEarth.Cartesian3.fromDegrees(
                messageObj.lon,
                messageObj.lat,
                messageObj.alt
              ),
              point: {
                show: true,
                color: pointColor,
                pixelSize: 25,
                outlineWidth: 0
              }
            }
            window.EarthViewer.entities.add(entitiesPointData)
          }

          showQaOperationMessage(
            messageObj.name,
            messageObj.lon,
            messageObj.lat,
            messageObj.alt,
            messageObj.currentProcess
          )
          new Bubble1({
            content: [
              { name: '经度', value: '' },
              { name: '纬度', value: '' },
              { name: '高度', value: '' }
            ],
            viewer: window.EarthViewer,
            id: messageObj.name + '-wzpoint',
            Cesium: window.MSIMEarth,
            title: '未识别目标',
            name: 'simple',
            offsetY: -300, //单位px,值越大越往上
            offsetX: 150, //单位px,值越小越往右
            distanceDisplayCondition: [0, 20e5],
            div: 'planDetail',
            rgb: [57, 173, 209], //红、蓝
            fontColorRgb: store.getters.getBubbleFontColor, // 字体颜色
            isCloseClick: false
          })
          setTimeout(() => {
            if (EarthViewer.entities.getById(messageObj.name + '-wzpoint')) {
              EarthViewer.entities.removeById(messageObj.name + '-wzpoint')
            }
            // 移除显示经纬度的弹框
            if (window['curDivPoint' + messageObj.name + '-wzpoint']) {
              window['curDivPoint' + messageObj.name + '-wzpoint'].closeEvent()
              window['curDivPoint' + messageObj.name + '-wzpoint'] = null
              delete window['curDivPoint' + messageObj.name + '-wzpoint']
            }
          }, 15000)
          break
        case 'l2':
          showQaOperationMessage(
            messageObj.name,
            messageObj.lon,
            messageObj.lat,
            messageObj.alt,
            messageObj.currentProcess
          )
          setTimeout(() => {
            if (
              EarthViewer.dataSources.getByName(messageObj.name + '-pointData')
                .length > 0
            ) {
              EarthViewer.dataSources.remove(
                EarthViewer.dataSources.getByName(
                  messageObj.name + '-pointData'
                )[0]
              )
            }
          }, 12000)
          break
        case 'l3': //姿态识别
          showQaOperationMessage(
            messageObj.name,
            messageObj.lon,
            messageObj.lat,
            messageObj.alt,
            messageObj.currentProcess
          )
          detailedSignageCheckL4(true, messageObj)
          break
        case 'l4': //电磁识别
          if (window.mubiaoObj[messageObj.name + '-wz']) {
            let domNode = window.mubiaoObj[messageObj.name + '-wz']
            domNode.content[6].value = messageObj.currentProcess //信息
            domNode.content[7].value = messageObj.qbStatus //情报状态
            domNode.content[8].value = messageObj.threatLevel //威胁级别
            // domNode.content[9].value = messageObj.sName//情报来源
          }
          if (messageObj.sensors) {
            showQaOperationMessage(
              messageObj.name,
              messageObj.lon,
              messageObj.lat,
              messageObj.alt,
              messageObj.currentProcess
            )
          }

          // setTimeout(() => {
          //   detailedSignageCheckL4(true, messageObj)
          // }, 1000)

          break
        case 'l5': //红外识别
          if (window.mubiaoObj[messageObj.name + '-wz']) {
            let domNode = window.mubiaoObj[messageObj.name + '-wz']
            domNode.content[6].value = messageObj.currentProcess //信息
            domNode.content[7].value = messageObj.qbStatus //情报状态
            domNode.content[8].value = messageObj.threatLevel //威胁级别
            // domNode.content[9].value = messageObj.sName//情报来源
          }
          if (messageObj.sensors) {
            showQaOperationMessage(
              messageObj.name,
              messageObj.lon,
              messageObj.lat,
              messageObj.alt,
              messageObj.currentProcess
            )
          }
          break
        case 'l6': //几何识别
          if (window.mubiaoObj[messageObj.name + '-wz']) {
            let domNode = window.mubiaoObj[messageObj.name + '-wz']
            domNode.content[6].value = messageObj.currentProcess //信息
            domNode.content[7].value = messageObj.qbStatus //情报状态
            domNode.content[8].value = messageObj.threatLevel //威胁级别
            // domNode.content[9].value = messageObj.sName//情报来源
          }
          if (messageObj.sensors) {
            showQaOperationMessage(
              messageObj.name,
              messageObj.lon,
              messageObj.lat,
              messageObj.alt,
              messageObj.currentProcess
            )
          }
          break
        case 'l7': //正在融合qingbao信息进行数据融合
          if (messageObj.sensors) {
            showQaOperationMessage(
              messageObj.name,
              messageObj.lon,
              messageObj.lat,
              messageObj.alt,
              messageObj.currentProcess
            )
          }
          break
        case 'l8': //目标***识别成功
          // 关闭L3创建的显示详标签弹框
          if (window['curDivPoint' + messageObj.name + '-wz']) {
            window['curDivPoint' + messageObj.name + '-wz'].closeEvent()
            window['curDivPoint' + messageObj.name + '-wz'] = null
            delete window['curDivPoint' + messageObj.name + '-wz']
          }
          //移除L3阶段存储的new Bubble1()实例对象
          if (window.mubiaoObj[messageObj.name + '-wz']) {
            delete window.mubiaoObj[messageObj.name + '-wz']
          }
          let czmlEn = window.EarthViewer.dataSources._dataSources.find(
            (item) => {
              if (
                typeof item.processName !== 'undefined' &&
                item.processName === 'MSIMEarthCZMLProcessContainer'
              ) {
                return item
              }
            }
          )
          const entityMethod = new window.EarthPlugn.entity({
            earth: window.MSIMEarth,
            viewer: window.EarthViewer
          })
          if (window.MSIMEarth.defined(czmlEn)) {
            let targetMEntity = entityMethod.getCZMLEntity(
              messageObj.name + '-wz',
              'MSIMEarthCZMLProcessContainer'
            )
            if (!window.MSIMEarth.defined(targetMEntity)) return
            //移除未知目标的实体
            window.EarthPlugn.entity._DeleteCZMLEntity(
              messageObj.name + '-wz',
              'MSIMEarthCZMLProcessContainer'
            )
            czmlEn.entities.removeById(messageObj.name + '-wz')
            console.log('清除的id', messageObj.name + '-wz')
            if (EarthAPP.billboardCollection && EarthAPP.labelCollectionD) {
              EarthAPP.billboardCollection._billboards.forEach((e) => {
                if (e?.id === messageObj.name + '-wz') {
                  // 清除billboardCollection PD类标牌
                  EarthAPP.billboardCollection.remove(e)
                  let index = EarthAPP.elementArr.indexOf(e.id)
                  if (index > -1) {
                    EarthAPP.elementArr.splice(index, 1)
                  }
                }
              })
              EarthAPP.labelCollectionD._labels.forEach((e) => {
                if (e?.id === messageObj.name + '-wz') {
                  // 清除labelCollection PD类标牌
                  EarthAPP.labelCollectionD.remove(e)
                  let index = EarthAPP.elementArr.indexOf(e.id)
                  if (index > -1) {
                    EarthAPP.elementArr.splice(index, 1)
                  }
                }
              })
            }
          }
          if (messageObj.sensors) {
            showQaOperationMessage(
              messageObj.name,
              messageObj.lon,
              messageObj.lat,
              messageObj.alt,
              messageObj.currentProcess
            )
          }
          break
        case 'l9': //完成对***目标的趋势预测分析
          //视锥id 依据场景目前写死
          if (messageObj.name == 'E-2C20602937d8e_air_early_warning_aircraft') {
            createFrustumFun2(
              'KJ-500206021bf2f1_air_early_warning_aircraft',
              messageObj.name
            )
            //完成趋势预测分析后，底部目标卡牌数据填充
            // let threatData1 = store.state.sceneModule.threatCardData
            // threatData1.unshift({
            //   level: 1,
            //   name: 'F16-1',
            //   inforList: [
            //     { name: '类型', value: 'F16' },
            //     { name: '速度', value: '800km/h' },
            //     { name: '航向角', value: '285°' }
            //   ],
            //   pc: '1',
            //   levelName: '高',
            //   imgSrc: require('@/assets/images/indicator/plane2.png')
            // })
            // threatData1.unshift({
            //   level: 1,
            //   name: 'F16-2',
            //   inforList: [
            //     { name: '类型', value: 'F16' },
            //     { name: '速度', value: '800km/h' },
            //     { name: '航向角', value: '285°' }
            //   ],
            //   pc: '1',
            //   levelName: '高',
            //   imgSrc: require('@/assets/images/indicator/plane2.png')
            // })
            // threatData1.unshift({
            //   level: 1,
            //   name: 'E-2C',
            //   inforList: [
            //     { name: '类型', value: '预警机' },
            //     { name: '速度', value: '800km/h' },
            //     { name: '航向角', value: '285°' }
            //   ],
            //   pc: '1',
            //   levelName: '高',
            //   imgSrc: require('@/assets/images/indicator/plane2.png')
            // })
            // store.commit('setThreatCardData', threatData1)
          }
          if (messageObj.name == 'F-22206032dff41_air_fighter_aircraft') {
            //创建跟踪视锥
            createFrustumFun2(
              'KJ-500206021bf2f1_air_early_warning_aircraft',
              messageObj.name
            )
          }
          if (messageObj.name == 'F-16V206039d6de3_air_fighter_aircraft') {
            //创建跟踪视锥
            createFrustumFun2(
              'KJ-500206021bf2f1_air_early_warning_aircraft',
              messageObj.name
            )
            // let threatData2 = store.state.sceneModule.threatCardData
            // threatData2.unshift({
            //   level: 2,
            //   name: 'F16-1',
            //   inforList: [
            //     { name: '类型', value: 'F16' },
            //     { name: '速度', value: '600km/h' },
            //     { name: '航向角', value: '120°' }
            //   ],
            //   pc: '1',
            //   levelName: '中',
            //   imgSrc: require('@/assets/images/indicator/plane2.png')
            // })
            // threatData2.unshift({
            //   level: 2,
            //   name: 'F16-2',
            //   inforList: [
            //     { name: '类型', value: 'F16' },
            //     { name: '速度', value: '600km/h' },
            //     { name: '航向角', value: '120°' }
            //   ],
            //   pc: '1',
            //   levelName: '中',
            //   imgSrc: require('@/assets/images/indicator/plane2.png')
            // })
            // store.commit('setThreatCardData', threatData2)
          }

          if (messageObj.sensors) {
            showQaOperationMessage(
              messageObj.name,
              messageObj.lon,
              messageObj.lat,
              messageObj.alt,
              messageObj.currentProcess
            )
          }
          break
        case 'l10': //完成对***目标的威胁分析
          setTimeout(() => {
            if (messageObj['weapons'] && messageObj['weapons'].length > 0) {
              if (
                messageObj['weapons'][0]['bType'] &&
                messageObj['weapons'][0]['bType'].indexOf('_WEAPON') > -1
              ) {
                // 增加默认值 WQ攻击范围
                let pr = messageObj['weapons'][0]['pR']
                  ? messageObj['weapons'][0]['pR']
                  : 150000
                if (
                  !window.EarthViewer.entities.getById(
                    messageObj.name + '-ellipsoidEntity'
                  )
                ) {
                  //创建蓝方感知范围半球效果
                  createEllipsoidRadar(
                    messageObj.name,
                    Number(pr),
                    [57, 173, 209, 0.3]
                  )
                }
                showQaOperationMessage(
                  messageObj.name,
                  messageObj.lon,
                  messageObj.lat,
                  messageObj.alt,
                  messageObj.currentProcess
                )
              }
            }
            //只有在导调席和情报席才显示威胁信息弹框和威胁卡牌弹框
            if (
              window.localStorage.getItem('side') == 'red_qb' ||
              window.localStorage.getItem('side') == 'admin'
            ) {
              //显示左侧威胁信息列表弹框 -- 目标
              if (messageObj.name == 'F-22206032dff41_air_fighter_aircraft') {
                emitter.emit('showTargetInfo', 'targetInformations')
              }
              //显示底部威胁卡片弹框
              if (
                document.getElementsByClassName('arbitrationResult_box')
                  .length == 0
              ) {
                emitter.emit('showThreatAnalysisList', 'billboardList')
              }
            }
          }, 1000)
          break
        default:
          break
      }
    }
  }

  /**
   * 浮动显示提示信息
   * @param {*} entityId 实体名称
   * @param {*} lon 经度
   * @param {*} lat 纬度
   * @param {*} alt 高度
   * @param {*} currentProcess 提示信息
   */
  const showQaOperationMessage = (entityId, lon, lat, alt, currentProcess) => {
    window.sceneAction.systemMessage.labelMessage({
      sysMessageId: entityId + '_QaOperation_sysMessage',
      sysMessagePosition: [lon, lat, alt],
      sysMessageText: currentProcess,
      sysFillColor: store.getters.getSucceStateInfoOutColor
    })
  }

  /**
   * 火力范围
   * @param {*} sourId 平台ID
   * @param {*} type 类型
   * @param {*} radius 半径
   * @param {*} color 颜色
   * @param {*} isShowMaterial 是否显示颜色
   */
  const createEntityCircleFun = (
    sourId,
    type,
    radius,
    color,
    isShowMaterial
  ) => {
    window.sceneAction.planeCzmlManage.createEntityCircle({
      sourId: sourId,
      type: type,
      radius: radius,
      color: color,
      isShowMaterial: isShowMaterial
    })

    // 2分钟之后删除
    setTimeout(() => {
      if (window.EarthViewer.entities.getById(type + sourId)) {
        window.EarthViewer.entities.removeById(type + sourId)
      }
    }, 1000 * 120)
  }

  /**
   * 创建活力覆盖范围
   * @param {*} sourId
   * @param {*} type
   * @param {*} radius
   * @param {*} color
   * @param {*} angle
   */
  const createEntityCreatePanFun = (sourId, type, radius, color, angle) => {
    window.sceneAction.planeCzmlManage.createPan({
      sourId: sourId,
      type: type,
      radius: radius,
      color: color,
      angle: angle
    })

    // 2分钟之后删除
    setTimeout(() => {
      if (
        window.EarthViewer.entities.getById(sourId + 'pan' + 'firepowerRadius')
      ) {
        window.EarthViewer.entities.removeById(
          sourId + 'pan' + 'firepowerRadius'
        )
      }
    }, 1000 * 120)
  }

  return { handleQaOperation }
}
