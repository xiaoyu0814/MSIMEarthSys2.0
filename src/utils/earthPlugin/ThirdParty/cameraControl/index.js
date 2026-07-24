import { speechSynthesis } from '../voiceControl/index'
import store from '@/store'
import emitter from '@/utils/eventbus'
import { moveCamera } from '@/service/directingAdjusting'
class CameraControl {
  constructor(config) {
    this.earth = config.earth || window.MSIMEarth
    this.viewer = config.viewer || window.EarthViewer
  }
  flyByNodebak(options) {
    options.forEach((e) => {
      if (e.show) {
        setTimeout(() => {
          let position = e.position
          let duration = e.duration
          let orientation = e.orientation
          // 视角跳转到目标区域
          this.viewer.camera.flyTo({
            destination: window.MSIMEarth.Cartesian3.fromDegrees(
              position.x,
              position.y,
              position.z
            ),
            duration: duration,
            orientation: {
              heading: orientation.heading,
              pitch: orientation.pitch,
              roll: orientation.roll
            },
            complete: () => {
              {
                window.sceneAction.popUp.detailedSignageCheckChangeStatic(e)
                let id = e.id
                if (e.isShow) {
                  store.state.sceneModule.toolbarEntityonfig.detailLabelList.push(
                    id
                  )
                } else {
                  let index =
                    store.state.sceneModule.toolbarEntityonfig.detailLabelList.indexOf(
                      id
                    )
                  if (index > -1) {
                    store.state.sceneModule.toolbarEntityonfig.detailLabelList.splice(
                      index,
                      1
                    )
                  }
                }
              }

              // 播放语音
              speechSynthesis()
              emitter.emit('configVoice', e.message)
            }
          })
        }, e.time)
      } else {
        setTimeout(() => {
          window.sceneAction.popUp.detailedSignageCheckChangeStatic(e)
          let id = e.id
          if (e.isShow) {
            store.state.sceneModule.toolbarEntityonfig.detailLabelList.push(id)
          } else {
            let index =
              store.state.sceneModule.toolbarEntityonfig.detailLabelList.indexOf(
                id
              )
            if (index > -1) {
              store.state.sceneModule.toolbarEntityonfig.detailLabelList.splice(
                index,
                1
              )
            }
          }
        }, e.time)
      }
    })
  }
  /**
   * 基于节点配置信息完成视角跳转及事件弹窗和语音播报等
   * @param {*} options
   */
  flyByNode(options) {
    // emitter.emit('initScenePauseState')
    let position = options.position
    let duration = options.duration
    let orientation = options.orientation
    // 视角跳转到目标区域
    this.viewer.camera.flyTo({
      destination: window.MSIMEarth.Cartesian3.fromDegrees(
        position.x,
        position.y,
        position.z
      ),
      duration: duration,
      orientation: {
        heading: orientation.heading,
        pitch: orientation.pitch,
        roll: orientation.roll
      },
      complete: () => {
        {
          window.sceneAction.popUp.detailedSignageCheckChangeStatic(options)
          let id = options.id
          if (options.isShow) {
            store.state.sceneModule.toolbarEntityonfig.detailLabelList.push(id)
          } else {
            let index =
              store.state.sceneModule.toolbarEntityonfig.detailLabelList.indexOf(
                id
              )
            if (index > -1) {
              store.state.sceneModule.toolbarEntityonfig.detailLabelList.splice(
                index,
                1
              )
            }
          }
        }

        // 播放语音
        speechSynthesis()
        let sysSoundShow = Number(
          window.localStorage.getItem('systemSoundEnabled')
        )
        if (sysSoundShow) {
          emitter.emit('configVoice', options.message)
        }
      }
    })
  }
  // 基于Cartesian3坐标完成视角跳转及事件弹窗和语音播报等
  flyByNodeCar3(options) {
    // emitter.emit('initScenePauseState')
    let position = options.position
    let duration = options.duration
    let orientation = options.orientation
    // 视角跳转到目标区域
    this.viewer.camera.flyTo({
      destination: window.MSIMEarth.Cartesian3(
        position.x,
        position.y,
        position.z
      ),
      duration: duration,
      orientation: {
        heading: orientation.heading,
        pitch: orientation.pitch,
        roll: orientation.roll
      },
      complete: () => {
        {
          window.sceneAction.popUp.detailedSignageCheckChangeStatic(options)
          let id = options.id
          if (options.isShow) {
            store.state.sceneModule.toolbarEntityonfig.detailLabelList.push(id)
          } else {
            let index =
              store.state.sceneModule.toolbarEntityonfig.detailLabelList.indexOf(
                id
              )
            if (index > -1) {
              store.state.sceneModule.toolbarEntityonfig.detailLabelList.splice(
                index,
                1
              )
            }
          }
        }

        // 播放语音
        speechSynthesis()
        let sysSoundShow = Number(
          window.localStorage.getItem('systemSoundEnabled')
        )
        if (sysSoundShow) {
          emitter.emit('configVoice', options.message)
        }
      }
    })
  }
  /**
   * 执行飞行动作集合
   */
  // option = {
  //   flyArr: [
  //     {
  //       position: {
  //         x: 119.3316,
  //         y: 27.9142,
  //         z: 300000
  //       },
  //       duration: 2,
  //       orientation: {
  //         heading: 6.283185307179586,
  //         pitch: -1.570670086201004,
  //         roll: 0
  //       }
  //     },
  //     {
  //       position: {
  //         x: 119.4316,
  //         y: 26.8142,
  //         z: 300000
  //       },
  //       duration: 2,
  //       orientation: {
  //         heading: 6.283185307179586,
  //         pitch: -1.570670086201004,
  //         roll: 0
  //       }
  //     },
  //     {
  //       position: {
  //         x: 119.5316,
  //         y: 25.7142,
  //         z: 300000
  //       },
  //       duration: 2,
  //       orientation: {
  //         heading: 6.283185307179586,
  //         pitch: -1.570670086201004,
  //         roll: 0
  //       }
  //     }
  //   ],
  //   time: 200,
  //   id: 'test1',
  //   show: true,
  //   message:
  //     '据台媒“联合新闻网”报道，台湾高雄兴达电厂9日晚新2号燃气复循环机组在测试时突发爆炸，现场火光冲天。所幸此次事故未造成人员伤亡。',
  //   rendered: false,
  //   curFly: 0,
  //   flyInterval: 1000
  // }
  // 基于经纬度完成视角跳转及事件弹窗和语音播报等
  flyRecursion(option) {
    let that = this
    let curFly = option.curFly
    if (curFly >= option.flyArr.length) return
    // if (option.flyArr.length > 1) {
    let position = option.flyArr[curFly].position
    let duration = option.flyArr[curFly].duration
    let orientation = option.flyArr[curFly].orientation
    this.viewer.camera.flyTo({
      destination: new window.MSIMEarth.Cartesian3.fromDegrees(
        position.x,
        position.y,
        position.z
      ),
      duration: duration,
      orientation: {
        heading: orientation.heading,
        pitch: orientation.pitch,
        roll: orientation.roll
      },
      complete: () => {
        console.log('option.curFly', option.curFly)
        option.curFly++
        if (option.flyArr[curFly].identifyInfo) {
          let id = option.flyArr[curFly].jd || 0
          that.identifyInfoCOnfig(
            option.flyArr[curFly].identifyInfo,
            id,
            option.speaker
          )
        }
        if (option.flyArr[curFly].UEId) {
          that.UECameraConfig(option.flyArr[curFly].UEId)
        }
        setTimeout(() => {
          that.flyRecursion(option)
        }, option.flyArr[curFly].flyInterval)
      }
    })
    // }
  }
  // 基于Cartesian3坐标完成视角跳转及事件弹窗和语音播报等
  flyRecursionByCartesian3(option) {
    console.log('镜头跳转', option)
    let that = this
    let curFly = option.curFly
    if (curFly >= option.flyArr.length) return
    // if (option.flyArr.length > 1) {
    let position = option.flyArr[curFly].position
    let duration = option.flyArr[curFly].duration
    let orientation = option.flyArr[curFly].orientation
    this.viewer.camera.flyTo({
      destination: new window.MSIMEarth.Cartesian3(
        position.x,
        position.y,
        position.z
      ),
      duration: duration,
      orientation: {
        heading: orientation.heading,
        pitch: orientation.pitch,
        roll: orientation.roll
      },
      complete: () => {
        console.log('option.curFly', option.curFly)
        option.curFly++
        if (option.flyArr[curFly].identifyInfo) {
          let id = option.flyArr[curFly].jd || 0
          that.identifyInfoCOnfig(
            option.flyArr[curFly].identifyInfo,
            id,
            option.speaker,
            option.title
          )
        }
        if (option.flyArr[curFly].UEId) {
          that.UECameraConfig(option.flyArr[curFly].UEId)
        }
        setTimeout(() => {
          that.flyRecursionByCartesian3(option)
        }, option.flyArr[curFly].flyInterval)
      }
    })
    // }
  }
  /**
   * @description: 意外停电事件在地图上显示电厂的标注和矩形框，并导航至相应视角
   * @param {Object} val - 包含电厂信息的对象
   * @return {void} 无返回值
   */
  accidentalPowerStationDMX(val) {
    // 清除之前标注的电站信息
    clearStation()
    // 设置默认参数值
    let options = val || []
    let ccolor = options.color || [228, 63, 50]
    let tt = options.title || '大甲溪电厂马鞍分厂'
    let pos = options.position || [120.80614326267549, 24.22321058432321]
    let ccontent = options.content || '2022年3月3日电站停电'
    let strLength = ccontent.length
    let entity = val.entity
    // 电站标注的参数对象
    const divval = {
      Cesium: window.MEarthX,
      viewer: window.EarthViewer,
      position: pos,
      height: 6000,
      distanceDisplayCondition: [0, 500000],
      title: tt,
      id: tt,
      content: ccontent,
      offsetX: -120,
      offsetY: 245 + strLength,
      div: 'powerStation',
      color: ccolor
    }
    divLabel(divval)
    let option = {
      longitude: pos[0],
      latitude: pos[1],
      bId: 'Rectangular111',
      name: 'Rectangular111',
      color: ccolor,
      minHeight: 1000
    }
    // 在地图上绘制电站矩形框
    drawRectangular(option)

    // 如果存在电站实体对象
    if (entity) {
      // 获取绘制的矩形框实体
      let aa = window.EarthViewer.entities.getById('Rectangular111')
      window.EarthViewer.flyTo(aa, {
        offset: new window.MEarthX.HeadingPitchRange(
          0.09968812017971729,
          -0.532050685326225,
          70000
        )
      })
      setTimeout(() => {
        if (val.callback) {
          val.callback()
        }
      }, 3100)
    } else {
      // 匹配视角
      let cameraV = stationCamera[tt]
      let desti = null
      let orien = null
      // 如果存在电站视角信息
      if (cameraV) {
        // 提取视角的目标位置和朝向
        desti = new window.MEarthX.Cartesian3(...cameraV[0])
        orien = cameraV[1]
        console.log(cameraV, desti, orien)
      } else {
        clearStation()
        return
      }
      window.EarthViewer.camera.flyTo({
        destination: desti,
        orientation: orien,
        duration: 5,
        complete: () => {
          if (val.callback) {
            val.callback()
          } else {
          }
        }
      })
    }

    createWall({
      color: ccolor,
      position: pos
    })
  }
  /**
   * 文字语音播报
   * @param {*} info 播报信息
   * @param {*} jd 文字配色选项
   */
  identifyInfoCOnfig(info, jd, speaker, identifyTitle) {
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
    store.state.sceneModule.speaker = speaker
    store.state.sceneModule.identifyTitle = identifyTitle
    store.state.sceneModule.phasedDescription.push({
      time: '',
      key: 'suicide attack',
      value: info
    })
    store.state.sceneModule.showIdentify = true
  }
  /**
   * 配置UE视角跳转
   * @param {*} id
   */
  UECameraConfig(id) {
    let infoParams = {
      entityID: id,
      height: 0,
      itemName: '',
      itemTypeCode: 'aircraft',
      lat: 0,
      lng: 0,
      planName: '',
      runSeconds: 0
    }
    moveCamera(infoParams)
      .then((res) => {
        // console.log(res)
        if (res.code == 200) {
          console.log('UE视角跳转成功', id)
        }
      })
      .catch((err) => {
        console.log('导调UE定位错误', err)
      })
  }
}
export default CameraControl
