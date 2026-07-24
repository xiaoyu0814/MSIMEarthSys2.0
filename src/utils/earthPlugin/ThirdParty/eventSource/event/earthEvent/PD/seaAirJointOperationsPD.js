import store from '@/store'
import emitter from '@/utils/eventbus'
import { explotEffect } from '@/utils/earthPlugin/scene/particle/爆炸.js'
import {
  getEquipmentCountByRedis,
  getEquipmentCountByRedisReplay
} from '@/service/replayTime'
import {
  resetView,
  clearFrustum,
  removeDetectFrustum
} from '@/utils/earthPlugin/ThirdParty/cameraControl/cameraControl'
import { sensorInfoDict } from '../state/stateControlMethods'
export default function () {
  let bz = new explotEffect(window.EarthViewer)

  let options = {
    earth: window.MSIMEarth,
    viewer: window.EarthViewer,
    type: 'panel'
  }
  let layerList = new window.EarthPlugn.treeManagement(options)
  // let targetOrientation
  let curPosition
  const hpr = new window.MSIMEarth.HeadingPitchRoll(0, 0, 0) //heading,pitch,roll以0.1单位调整
  let entityMethodFun = new window.EarthPlugn.entity({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  const handlePD = (json) => {
    if (json.Data.Name) {
      let currentTime = window.EarthViewer.clock.currentTime
      let model
      // 目前弹不考虑标牌，所以可以考虑目标是弹的时候直接清除并return
      let targetMEntity = window.EarthPlugn.entity._GetCZMLEntity(
        json.Data.Name,
        'MSIMEarthCZMLProcessContainer'
      )

      let p = window.EarthViewer.scene.primitives._primitives.find((item) => {
        if (item.id && item.id === json.Data.Name) {
          return item
        }
      })
      console.log('要清楚的primitive', p)
      window.EarthViewer.scene.primitives.remove(p)
      if (!window.MSIMEarth.defined(targetMEntity)) {
        console.log('获取销毁目标实体不正确', targetMEntity, json.Data.Name)
        return
      }
      offThreeView(json.Data.Name)
      //如果有航线显示就移除掉
      if (window.EarthViewer.entities.getById(json.Data.Name + '-planLine')) {
        window.EarthViewer.entities.removeById(json.Data.Name + '-planLine')
      }
      //移除航线显示最后一个点的经纬度label
      if (window.EarthViewer.entities.getById(json.Data.Name + '-endPoint')) {
        window.EarthViewer.entities.removeById(json.Data.Name + '-endPoint')
      }
      //如果有实时航线显示就移除掉
      if (window.EarthViewer.entities.getById(json.Data.Name + '-planLine_realTime')) {
        window.EarthViewer.entities.removeById(json.Data.Name + '-endPoint')
      }
      //如果有包络体显示就移除掉
      if (window.EarthViewer.entities.getById(json.Data.Name + 'atmospheric_influence_sensor')) {
        window.EarthViewer.entities.removeById(json.Data.Name + 'atmospheric_influence_sensor')
        delete sensorInfoDict[json.Data.Name]
      }
      // 潜在静态目标爆炸
      let targetS = window.EarthViewer.entities.getById(json.Data.Name)
      if (window.MSIMEarth.defined(targetS)) {
        if (window.EarthViewer.scene.mode == 3) {
          if (window.EarthViewer.clock.multiplier < 2) {
            // setTimeout(() => {
            //   entityMethodFun.createClearEntity(
            //     targetS._position._value,
            //     json.Data.Name
            //   )
            // }, 500)
          }
        } else {
          bz.init(targetS._position._value)
          setTimeout(() => {
            bz.remove()
          }, 500)
        }
        // 当前目标爆炸同时移除战场环境
        window.EarthViewer.entities.removeById(json.Data.Name)
      }
      curPosition = new window.MSIMEarth.Cartesian3(
        targetMEntity.position._property?._interpolationResult[0],
        targetMEntity.position._property?._interpolationResult[1],
        targetMEntity.position._property?._interpolationResult[2]
      )
      // targetOrientation = targetMEntity.orientation.getValue(currentTime)
      // console.log('targetOrientation', targetOrientation)
      // if (typeof targetOrientation === 'undefined') {
      //   targetOrientation =
      //     window.MSIMEarth.Transforms.headingPitchRollQuaternion(
      //       curPosition,
      //       hpr
      //     )
      // }

      if (window.MSIMEarth.defined(curPosition)) {
        // bz.init(TargetPosition)
        if (window.EarthViewer.scene.mode == 3) {
          if (window.EarthViewer.clock.multiplier < 2) {
            if (json.Data.Type !== 'CHAFF') {
              // model = {
              //   uri: targetMEntity.model.uri._value.url,
              //   colorBlendMode: window.MSIMEarth.ColorBlendMode.MIX,
              //   colorBlendAmount: 0.7,
              //   color: targetMEntity.model.color._value,
              //   minimumPixelSize:
              //     targetMEntity.model.minimumPixelSize._value + 5,
              //   side: targetMEntity.properties?.airplaneAction?._value?.side
              // }
              setTimeout(() => {
                targetMEntity.show = false
                let curPosition2 = new window.MSIMEarth.Cartesian3(
                  targetMEntity.position._property?._interpolationResult[0],
                  targetMEntity.position._property?._interpolationResult[1],
                  targetMEntity.position._property?._interpolationResult[2]
                )
                entityMethodFun.createBoom(curPosition2, json.Data.Name)
                // entityMethodFun.createClearEntity(curPosition2, json.Data.Name)
                // 移除上面隐藏的爆炸实体
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
                window.EarthViewer.scene.primitives._primitives.find((item) => {
                  if (item.id && item.id === json.Data.Name) {
                    window.EarthViewer.scene.primitives(item)
                  }
                })
                czmlEn.entities.removeById(json.Data.Name)
                // 因为MNQ无法及时触发导弹消除信息，此处暂时追加清除MNQ类别导弹的方法
                removeMNQDD()
              }, EarthAPP.PTDelayTime)
              // emitter.emit('listenerLabel', false) // 关闭链路框
            } else {
              setTimeout(() => {
                // 移除上面隐藏的爆炸实体
                window.EarthViewer.scene.primitives._primitives.find((item) => {
                  if (item.id && item.id === json.Data.Name) {
                    window.EarthViewer.scene.primitives(item)
                  }
                })
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
                if (window.MSIMEarth.defined(czmlEn)) {
                  czmlEn.entities.removeById(json.Data.Name)
                }
              }, EarthAPP.DDDelayTime)
            }
          }
        } else {
          if (
            json.Data.LabelName.indexOf('弹') == -1 &&
            json.Data.Type !== 'CHAFF'
          ) {
            bz.init(TargetPosition)
            setTimeout(() => {
              bz.remove()
              // 移除上面隐藏的爆炸实体
              window.EarthViewer.scene.primitives._primitives.find((item) => {
                if (item.id && item.id === json.Data.Name) {
                  window.EarthViewer.scene.primitives(item)
                }
              })
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
              console.log('要删除的实体', czmlEn.entities)
              if (window.MSIMEarth.defined(czmlEn)) {
                czmlEn.entities.removeById(json.Data.Name)
              }
            }, 500)
          }
        }
        // ******缺少删除攻击距离的动态标签
        // ******如果只隐藏会影响场景执行效率的化可以扩展，给删除的czml数据做一个标记，然后按固定时间间隔删除，例如每秒删除一个，避免时间回调，同时更新标记列表。
        // ******但如果有些目标有修复后重新出现的需求则需要更新标记列表。
      }
      store.commit('setPdTargetTreeData', json.Data.Name)
      // 若观看的实体被删除，切换自由视角
      let viewid = store.state.sceneModule.curViewEntityID
      if (viewid == json.Data.Name) {
        resetView()
      }
      clearFrustum(json.Data.Name) // 删除视锥传感器效果
      removeDetectFrustum(json.Data.Name) //删除侦察视锥效果
      removeDetectFrustum('RE_JamS_' + json.Data.Name) //删除 干扰机 视锥效果
      //更新兵力统计信息
      if (store.state.sceneModule.isReplayType) {
        getEquipmentCountByRedisReplay().then((res) => {
          if (res.code == 200) {
            store.commit('setRedStatic', {
              xc: res.data.redData.redCount,
              hs: res.data.redData.redCountOff
            })
            store.commit('setBlueStatic', {
              xc: res.data.blueData.blueCount,
              hs: res.data.blueData.blueCountOff
            })
          }
        })
      } else {
        getEquipmentCountByRedis().then((res) => {
          if (res.code == 200) {
            store.commit('setRedStatic', {
              xc: res.data.redData.redCount,
              hs: res.data.redData.redCountOff
            })
            store.commit('setBlueStatic', {
              xc: res.data.blueData.blueCount,
              hs: res.data.blueData.blueCountOff
            })
          }
        })
      }

      // 如果自动更新，则更新图层
      if (!store.state.sceneModule.islayerListLock) {
        let resultTreeData = layerList.panelManagement.deleteNode(
          store.state.sceneModule.layerManagementData,
          json.Data.Name
        )
        store.commit(
          'setLayerManagementData',
          JSON.parse(JSON.stringify(resultTreeData))
        )
      }
      //图层红蓝方实体列表中删除该目标
      let index = store.state.sceneModule.sceneEnityData.findIndex(
        (item) => item.Data.Name == json.Data.Name
      )
      if (index > -1) {
        store.state.sceneModule.sceneEnityData.splice(index, 1)
      }
      // 右上角消息提示(暂时不用)
      // if (json.Data.LabelName.indexOf('弹') == -1) {
      //   beautyToast.error({
      //     title: '销毁',
      //     message: json.Data.LabelName + '移除战场环境',
      //     darkTheme: true
      //   })
      // }
      // 清除标签
      EarthAPP.billboardCollection._billboards.forEach((e) => {
        if (e?.id === json.Data.Name) {
          // 清除billboardCollection PD类标牌
          console.log('清楚了标牌billboard', e)
          EarthAPP.billboardCollection.remove(e)
          let index = EarthAPP.elementArr.indexOf(e.id)
          if (index > -1) {
            EarthAPP.elementArr.splice(index, 1)
          }
        }
      })
      EarthAPP.labelCollectionD._labels.forEach((e) => {
        if (e?.id === json.Data.Name) {
          // 清除labelCollection PD类标牌
          console.log('清楚了标牌label', e)
          EarthAPP.labelCollectionD.remove(e)
          let index = EarthAPP.elementArr.indexOf(e.id)
          if (index > -1) {
            EarthAPP.elementArr.splice(index, 1)
          }
        }
      })
      EarthAPP.labelCollection._labels.forEach((e) => {
        if (e?.id === json.Data.Name) {
          // 清除labelCollection PD类标牌
          console.log('清楚了静态标牌label', e)
          EarthAPP.labelCollection.remove(e)
        }
      })
      // // 清除DB库里的数据
      // if (indexedDBController) {
      //   indexedDBController.removeIndexDB(json.Data.Name)
      // }
      // 清除图层管理没需要删除的静态目标 同时图层管理目录中关联的PD目标
      store.state.AFSIMModule.paData.forEach((e) => {
        if (e.Data.Name === json.Data.Name) {
          window.EarthViewer.entities.removeById(json.Data.Name)
          e.show = false
        }
      })
    }
  }
  // 临时结局MNQ导弹不消除的方法
  const removeMNQDD = () => {
    EarthAPP.MNQDDList.forEach((id) => {
      let czmlEn = window.EarthViewer.dataSources._dataSources.find((item) => {
        if (
          typeof item.processName !== 'undefined' &&
          item.processName === 'MSIMEarthCZMLProcessContainer'
        ) {
          return item
        }
      })
      czmlEn.entities.removeById(id)
    })
  }
  return { handlePD }
}

const offThreeView = (name) => {
  if (store.getters.getChangeCameraView == '第三视角' && name === store.getters.getCurrentNode.code) {
    emitter.emit('changeViewToFree') // 切换自由视角
  }
}
