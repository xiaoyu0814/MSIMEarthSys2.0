//导调指令配置
import { getPlateSWMessageV2 } from '@/service/command'
import store from '@/store/index'
import emitter from '@/utils/eventbus'
import { getIsTrackTarget, setPosition, byRaw } from '@/service/command'
import { getLaserDesignatorState } from '@/service/radar'
import { showSysMessage, sendToCommandShowResMsg } from '@/utils/mapTools'
import { ElMessage } from 'element-plus'
import {
  ref,
  onMounted,
  reactive,
  watch,
  getCurrentInstance,
  defineEmits
} from 'vue'
import {
  createEntityCircleFun,
  removeEntityCircleById
} from '@/views/toolbar/layerList/hooks/showHideConfig'
import { get, set } from 'lodash'
import {
  getPlatformParts,
  DeleteEntity,
  setPlateformStatus,
  getPlatformState
} from '@/service/afsim'
let state2 = {
  handlerCommControl: null,
  clickTimer: null, //单击事件的定时器
  handlerCommControl1: null, //鼠标左键双击，执行立即改变位置指令
  handlerCommControl2: null, //鼠标左键单击，执行攻击指令
  handlerCommControl3: null, // 鼠标左键单击，拖拽实体重新定位 -- 执行立即改变位置指令
  curDragEntitySouId: '', // 当前拖拽实体id
  curEntityPick: null, // 储存实体  当前实体(拖拽实体重新定位)
  curEntityPickId: '', // 储存实体Id  当前实体(拖拽实体重新定位)
  leftDownFlag: false // 是否点击左键 按下标志 (拖拽实体重新定位)
}
let options = {}
const instance = {}
// 攻击指定位置
export function fireAtPositionChange(value) {
  if (value) {
    sourceAndTargetSetCommand('攻击指定位置')
  } else {
  }
}
const getIsTrackTargetFun = async (fireName, targetName) => {
  // 获取平台探测状态
  let params = {
    FireName: fireName,
    TargetName: targetName
  }
  let res = await getIsTrackTarget(params)
  if (res.code == 200) {
    // beautyToast.success({
    //   title: '导调指令',
    //   message: '平台探测状态指令已发出!',
    //   darkTheme: true
    // })
    if (res.data['IsSendToCommand'] == 'true') {
      let controlResData = JSON.parse(res.data.data)
      if (controlResData && Object.keys(controlResData).length > 0) {
        if (controlResData.status == 'success') {
          showSysMessage(fireName, '平台可以探测到!')
          return true
        } else {
          ElMessage({
            type: 'error',
            message: '导调指令：平台探测不到!'
          })
          clearCommandControlFun()
          emitter.emit('clearRedioData')
          return false
        }
      }
    }
  }
}
// 指令设置
const sourceAndTargetSetCommand = async (textStr) => {
  let weaponsArr = []
  if (
    textStr == '攻击指定位置' ||
    textStr == '攻击指定目标' ||
    textStr == '攻击自定义' ||
    textStr == '攻击目标'
  ) {
    if (store.getters.getCurrentNode) {
      // weaponsArr = await getWeapons()
      // if (weaponsArr && weaponsArr.length == 0) {
      //   beautyToast.warning({
      //     title: '导调指令',
      //     message: '未挂载相关武器装备信息!',
      //     darkTheme: true
      //   })
      //   clearCommandControlFun()
      //   emitter.emit('clearRedioData')
      //   return false
      // }
    }
  }
  if (store.getters.getCurrentNode) {
    sourceMbFlickerEntity(store.getters.getCurrentNode.code)
  }
  if (
    textStr == '攻击指定目标' ||
    textStr == '攻击自定义' ||
    textStr == '移动平台到目标距离' ||
    textStr == '发送干扰弹' ||
    textStr == '激光定向干扰' ||
    textStr == '激光欺骗' ||
    textStr == '攻击目标'
  ) {
    // 记录鼠标右键是否关联左键操作
    store.commit('setRelatedRightClickConfig', true)
  }
  let positions = [],
    poly,
    sourceSource
  // 选择连线指向
  let PolyLinePrimitive = (function () {
    function _(id, positions) {
      options = {
        id: id,
        name: '线',
        show: true,
        polyline: {
          show: true,
          positions: [],
          // material: window.MSIMEarth.Color.AQUA,
          // width: 3,
          material: new MSIMEarth.PolylineArrowMaterialProperty(
            MSIMEarth.Color.fromCssColorString('#00ffff').withAlpha(0.8)
          ),
          width: 16,
          clampToGround: false,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      }
      let updatePolyline = function () {
        if (
          typeof positions[0] === 'undefined' ||
          typeof positions[1] === 'undefined'
        ) {
          return
        }
        return positions
      }
      instance.positions = positions
      //实时更新polyline
      options.polyline.positions = new window.MSIMEarth.CallbackProperty(
        updatePolyline,
        false
      )
      instance.entity = window.EarthViewer.entities.add(options)
    }
    return _
  })()
  if (store.getters.getCurrentNode) {
    let entitypath = window.EarthPlugn.entity._GetCZMLEntity(
      store.getters.getCurrentNode.code,
      'MSIMEarthCZMLProcessContainer'
    )
    if (!window.MSIMEarth.defined(entitypath)) {
      return false
    }
    if (!window.MSIMEarth.defined(entitypath.position)) {
      return false
    }
    let currentTime = window.EarthViewer.clock.currentTime
    let positionArr = entitypath.position.getValue(currentTime)
    // 有位置信息
    if (Object.keys(positionArr).length > 1) {
      if (positions.length == 0) {
        positions.push(positionArr.clone())
      }
      positions.push(positionArr)

      let sourcePositionArr = getEititiesPostion(entitypath)
      // 攻击范围
      if (
        textStr == '攻击指定目标' ||
        textStr == '攻击自定义' ||
        textStr == '攻击指定位置'
      ) {
        // if (!weaponsArr[0]['pr']) {
        //   weaponsArr[0]['pr'] = 160000
        // }
        // if (weaponsArr[0]['pr'] && Number(weaponsArr[0]['pr']) > 0) {
        //   // 火力攻击范围 需要火力半径
        //   createEntityCircleFun(
        //     'operationalRadius1',
        //     weaponsArr[0]['pr'],
        //     [0, 255, 0, 0.3],
        //     true
        //   )
        // }
      }

      let entityLabel = window.EarthViewer.entities.add({
        name: '移动提示信息',
        label: {
          show: false,
          scale: 0.5,
          font: '32px monospace',
          horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
          verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
          pixelOffset: new window.MSIMEarth.Cartesian2(20, 0),
          style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
          fillColor: window.MSIMEarth.Color.WHITE,
          outlineColor: window.MSIMEarth.Color.BLACK,
          outlineWidth: 5,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      })
      let ellipsoid = window.EarthViewer.scene.globe.ellipsoid
      state2.handlerCommControl = new window.MSIMEarth.ScreenSpaceEventHandler(
        window.EarthViewer.scene.canvas
      )
      //去掉单双击的效果
      // window.EarthViewer.screenSpaceEventHandler.removeInputAction(
      //   window.MSIMEarth.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
      // )
      //鼠标移动
      state2.handlerCommControl.setInputAction(function (movement) {
        let cartesian = window.EarthViewer.scene.camera.pickEllipsoid(
          movement.endPosition,
          ellipsoid
        )
        if (!window.MSIMEarth.defined(cartesian)) return
        if (window.MSIMEarth.defined(cartesian)) {
          window.EarthViewer._container.style.cursor = 'pointer'
          if (!window.MSIMEarth.defined(entitypath)) {
            return false
          }
          if (!window.MSIMEarth.defined(entitypath.position)) {
            return false
          }
          // 实时更新模型点位
          currentTime = window.EarthViewer.clock.currentTime
          positionArr = entitypath.position.getValue(currentTime)
          if (!window.MSIMEarth.defined(positionArr)) {
            return false
          }
          positions[0] = positionArr
          positions.pop()
          // cartesian.y += 1 + Math.random()
          positions.push(cartesian)
          if (!window.MSIMEarth.defined(poly)) {
            poly = new PolyLinePrimitive(new Date().getTime(), positions)
          }
          entityLabel.position = cartesian
          entityLabel.label.show = true
          if (textStr == '攻击自定义' || textStr == '攻击目标') {
            entityLabel.label.text = '请选择攻击目标,左击确认完成'
            entityLabel.label.pixelOffset = new window.MSIMEarth.Cartesian2(
              40,
              -40
            )
          } else if (textStr == '飞机起飞') {
            entityLabel.label.text = '请选择机场,左击确认完成'
          } else {
            entityLabel.label.text = '请选择' + textStr + ',左击确认完成'
          }
        } else {
          entityLabel.label.show = false
        }
      }, window.MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE)
      //鼠标左键单击
      state2.handlerCommControl.setInputAction(function (click) {
        // 清除可能存在的双击事件定时器
        if (state2.clickTimer) {
          window.clearTimeout(state2.clickTimer)
          state2.clickTimer = null
        }
        // 设置单击事件的定时器
        state2.clickTimer = window.setTimeout(() => {
          // 单击事件的处理逻辑
          if (textStr == '攻击指定位置') {
            // let cartesianClick = window.EarthViewer.scene.camera.pickEllipsoid(
            //   click.position,
            //   ellipsoid
            // )
            // 获取地表坐标
            let ray = window.EarthViewer.camera.getPickRay(click.position)
            let cartesianClick = window.EarthViewer.scene.globe.pick(
              ray,
              window.EarthViewer.scene
            )
            if (window.MSIMEarth.defined(cartesianClick)) {
              entityLabel.label.show = false
              // 去掉鼠标事件
              if (state2.handlerCommControl) {
                state2.handlerCommControl.destroy()
                state2.handlerCommControl = null
              }
              //删除
              tempEntityDel()
              // 位置信息
              var cartographic =
                window.MSIMEarth.Cartographic.fromCartesian(cartesianClick)
              let enPositionArr2 = [
                window.MSIMEarth.Math.toDegrees(cartographic.longitude),
                window.MSIMEarth.Math.toDegrees(cartographic.latitude),
                cartographic.height
              ]
              if (weaponsArr[0]['pr'] && Number(weaponsArr[0]['pr']) > 0) {
                if (
                  sourcePositionArr &&
                  sourcePositionArr.length > 0 &&
                  enPositionArr2 &&
                  enPositionArr2.length > 0
                ) {
                  // 判断 点是否在火力攻击范围
                  let isSideCircle = getIsInsideCircleByPoint(
                    [sourcePositionArr[0], sourcePositionArr[1]],
                    weaponsArr[0]['pr'],
                    [enPositionArr2[0], enPositionArr2[1]]
                  )
                  if (!isSideCircle) {
                    //火力打击 范围删除
                    removeEntityCircleById(
                      'operationalRadius1' + store.getters.getCurrentNode.code
                    )
                    beautyToast.warning({
                      title: '导调指令',
                      message: '您选择的位置已超出攻击范围!',
                      darkTheme: true
                    })
                    return false
                  }
                }
              }
              // 添加流线连线
              addCommConLineBySourFixedPostion(cartesianClick)
              if (enPositionArr2.length > 0) {
                enPositionArr2[2] = Number(sourcePositionArr[2])
                onFireAtPosition(enPositionArr2, textStr, weaponsArr)
              }
            }
          } else {
            // 获取地表坐标
            let ray = window.EarthViewer.camera.getPickRay(click.position)
            let cartesianPickPosition = window.EarthViewer.scene.globe.pick(
              ray,
              window.EarthViewer.scene
            )
            // let cartesianPickPosition = window.EarthViewer.scene.pickPosition(
            //   click.position
            // )
            if (window.MSIMEarth.defined(cartesianPickPosition)) {
              var picked = window.EarthViewer.scene.pick(click.position)
              if (window.MSIMEarth.defined(picked) && picked.id) {
                if (
                  picked.id._model ||
                  picked.id.label ||
                  picked.id.billboard
                ) {
                  entityLabel.label.show = false
                  // 去掉鼠标事件
                  if (state2.handlerCommControl) {
                    state2.handlerCommControl.destroy()
                    state2.handlerCommControl = null
                  }
                  //删除
                  tempEntityDel()
                  poly = null
                  let infors = {
                    code: picked.id && picked.id['_id'] ? picked.id['_id'] : '',
                    name:
                      picked.id.description && picked.id.description._value
                        ? picked.id.description._value
                        : '',
                    type:
                      picked.id.properties &&
                        picked.id.properties._airplaneAction &&
                        picked.id.properties._airplaneAction._value &&
                        picked.id.properties._airplaneAction._value.type
                        ? picked.id.properties._airplaneAction._value.type
                        : ''
                  }
                  store.commit('setTargetInfo', infors)
                  // if (textStr == '攻击指定目标' || textStr == '攻击自定义') {
                  //   if (
                  //     weaponsArr[0]['pr'] &&
                  //     Number(weaponsArr[0]['pr']) > 0
                  //   ) {
                  //     let enPositionArr2 = getTargetPositionData()
                  //     if (
                  //       sourcePositionArr &&
                  //       sourcePositionArr.length > 0 &&
                  //       enPositionArr2 &&
                  //       enPositionArr2.length > 0
                  //     ) {
                  //       // 判断 点是否在火力攻击范围
                  //       let isSideCircle2 = getIsInsideCircleByPoint(
                  //         [sourcePositionArr[0], sourcePositionArr[1]],
                  //         weaponsArr[0]['pr'],
                  //         [enPositionArr2[0], enPositionArr2[1]]
                  //       )
                  //       if (!isSideCircle2) {
                  //         //火力打击 范围删除
                  //         removeEntityCircleById(
                  //           'operationalRadius1' +
                  //           store.getters.getCurrentNode.code
                  //         )
                  //         beautyToast.warning({
                  //           title: '导调指令',
                  //           message: '您选择的目标已超出攻击范围!',
                  //           darkTheme: true
                  //         })
                  //         return false
                  //       }
                  //     }
                  //   }
                  // }
                  // 添加流线连线
                  addCommConLineBySourTarget()
                  if (textStr == '攻击指定目标') {
                    onFireAtTarget(textStr, weaponsArr)
                  } else if (textStr == '攻击目标') {
                    onFireToTarget(textStr) //afsim接口
                  } else if (textStr == '攻击自定义') {
                    onFireByRaw(textStr, weaponsArr)
                  } else if (textStr == '移动平台到目标距离') {
                    onMoveToTarget(textStr)
                  } else if (textStr == '发送干扰弹') {
                    onMoveToTarget(textStr)
                    emitter.emit('setDisruptor', '发送干扰弹')
                  } else if (textStr == '激光定向干扰') {
                    onMoveToTarget(textStr)
                    emitter.emit('setDisruptor', '激光定向干扰')
                  } else if (textStr == '激光欺骗') {
                    onMoveToTarget(textStr)
                    emitter.emit('setDisruptor', '激光欺骗')
                  } else if (textStr == '伴飞') {
                    onMoveToTarget(textStr)
                    emitter.emit('setDisruptor', '伴飞')
                  } else if (textStr == '飞机起飞') {
                    onMoveToTarget(textStr)
                    emitter.emit('setDisruptor', '飞机起飞')
                  }
                }
              }
            }
          }
        }, 300) // 300毫秒内没有第二次点击则认为是单击
      }, window.MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)
      //鼠标左键双击
      state2.handlerCommControl.setInputAction(function (doubleClick) {
        if (doubleClick.position) {
          // 清除可能存在的双击事件定时器
          if (state2.clickTimer) {
            window.clearTimeout(state2.clickTimer)
            state2.clickTimer = null
          }
          clearCommandControlFun()
          emitter.emit('clearRedioData')
        }
      }, window.MSIMEarth.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
    }
  }
}
// 攻击指定目标
export function fireAtTargetChange(value) {
  if (value) {
    sourceAndTargetSetCommand('攻击指定目标')
  } else {
  }
}
// 攻击自定义
export function fireByRawChange(value) {
  if (value) {
    sourceAndTargetSetCommand('攻击自定义')
  } else {
  }
}
// 攻击指令接口
export async function openFireChange(value) {
  if (value) {
    if (store.getters.getCurrentNode) {
      leftDoubleClickFun()
      let weaponsArr = await getWeapons()
      if (weaponsArr && weaponsArr.length > 0) {
        sourceMbFlickerEntity(store.getters.getCurrentNode.code)
        let commandControlObj = {
          isShow: true,
          commandFormData: {
            command: '攻击',
            sourceName: store.getters.getCurrentNode.code,
            weaponsArr: weaponsArr
          }
        }
        emitter.emit('showCommandControl', commandControlObj)
      } else {
        beautyToast.warning({
          title: '导调指令',
          message: '未挂载相关武器装备信息!',
          darkTheme: true
        })
        clearCommandControlFun()
        emitter.emit('clearRedioData')
      }
    }
  } else {
  }
}
// 列表目标攻击
export async function listTargetToFireChange(value) {
  if (value) {
    if (store.getters.getCurrentNode) {
      let weaponsArr = await getWeapons()
      if (weaponsArr && weaponsArr.length > 0) {
        let mbFlickerEntity = window.EarthPlugn.entity._GetCZMLEntity(
          store.getters.getCurrentNode.code,
          'MSIMEarthCZMLProcessContainer'
        )
        let side =
          mbFlickerEntity &&
            mbFlickerEntity.properties &&
            mbFlickerEntity.properties.airplaneAction &&
            mbFlickerEntity.properties.airplaneAction._value &&
            mbFlickerEntity.properties.airplaneAction._value.side
            ? mbFlickerEntity.properties.airplaneAction._value.side
            : mbFlickerEntity?.properties?.side?._value
              ? mbFlickerEntity?.properties?.side?._value
              : ''
        if (side && side.length > 0) {
          let czmlDatasource = window.EarthViewer.dataSources._dataSources.find(
            (item) => {
              if (
                typeof item.processName !== 'undefined' &&
                item.processName === 'MSIMEarthCZMLProcessContainer'
              ) {
                return item
              }
            }
          )
          if (
            !czmlDatasource ||
            !czmlDatasource.entities ||
            !czmlDatasource.entities.values
          )
            return
          let entityArr = czmlDatasource.entities.values
          let entityNameIdObj = []
          for (let x = 0; x < entityArr.length; x++) {
            if (entityArr[x].properties._airplaneAction._value.side != side) {
              // 获取相反阵营实体
              entityNameIdObj.push({
                id: entityArr[x].id,
                name: entityArr[x].description.getValue()
              })
            }
          }
          if (entityNameIdObj && entityNameIdObj.length > 0) {
            let commandControlObj = {
              isShow: true,
              commandFormData: {
                command: '列表目标攻击',
                sourceName: store.getters.getCurrentNode.code,
                weaponsArr: weaponsArr,
                entityNameIdObj: entityNameIdObj
              }
            }
            emitter.emit('showCommandControl', commandControlObj)
            sourceMbFlickerEntity(store.getters.getCurrentNode.code)
          } else {
            ElMessage({
              type: 'error',
              message: '列表目标攻击：相反阵营平台无!'
            })
          }
        }
      } else {
        beautyToast.warning({
          title: '导调指令',
          message: '未挂载相关武器装备信息!',
          darkTheme: true
        })
        clearCommandControlFun()
        emitter.emit('clearRedioData')
      }
    }
  } else {
  }
}
// 鼠标双击 清除效果
const leftDoubleClickFun = () => {
  state2.handlerCommControl = new window.MSIMEarth.ScreenSpaceEventHandler(
    window.EarthViewer.scene.canvas
  )
  //鼠标左键双击
  state2.handlerCommControl.setInputAction(function (doubleClick) {
    if (doubleClick.position) {
      clearCommandControlFun()
      emitter.emit('clearRedioData')
    }
  }, window.MSIMEarth.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
}
// 获取 飞机挂载武器属性信息
let getWeapons = async () => {
  let airplaneActionWeaponsData = []
  let params = { name: store.getters.getCurrentNode.code }
  console.log('武器查询参数', params)
  store.commit('setSensorShow', {})
  let res = await getPlateSWMessageV2(params)
  store.commit('setSensorShow', res)
  if (res.code == 200) {
    let weaponsArr = res.data && res.data['weapons']
    airplaneActionWeaponsData =
      weaponsArr && weaponsArr.length > 0 ? weaponsArr : []
  }
  return airplaneActionWeaponsData
}
// 清空指令
export const clearCommandControlFun = (commandControlRadio) => {
  if (state2.handlerCommControl) {
    // 去掉鼠标事件
    if (state2.handlerCommControl) {
      state2.handlerCommControl.destroy()
      state2.handlerCommControl = null
    }
    store.commit('setRelatedRightClickConfig', false)
  }
  // 删除 流线连线
  if (store.getters.getCurrentNode.code) {
    let targetId = ''
    if (commandControlRadio == 'fireAtPosition') {
      targetId = 'wzInfo'
    } else {
      targetId = store.state.sceneModule.targetInfo.code
    }
    window.sceneAction.connectLineManagement.removeCommControlLine({
      sourId: store.getters.getCurrentNode.code,
      targetId: targetId
    })
  }
  window.EarthViewer._container.style.cursor = 'default'
  removeEntityCircleById(
    'operationalRadius1' + store.getters.getCurrentNode.code
  )
  //删除
  tempEntityDel()
  let commandControlObj = {
    isShow: false,
    commandFormData: {}
  }
  emitter.emit('showCommandControl', commandControlObj)
}
// 源目标点闪烁效果
export const sourceMbFlickerEntity = (mbId) => {
  let mbFlickerEntity = window.EarthPlugn.entity._GetCZMLEntity(
    mbId,
    'MSIMEarthCZMLProcessContainer'
  )
  let x = 1
  let flag = true
  window.EarthViewer.entities.add({
    name: '点闪烁',
    position: new window.MSIMEarth.CallbackProperty(() => {
      if (!mbFlickerEntity) return
      if (!mbFlickerEntity.position) return
      let entityPos1 = mbFlickerEntity.position._value
        ? mbFlickerEntity.position._value
        : mbFlickerEntity.position.getValue(
          window.EarthViewer.clock.currentTime
        )
      return entityPos1
    }, false),
    point: {
      show: true,
      color: new window.MSIMEarth.CallbackProperty(() => {
        if (flag) {
          x = x - 0.05
          if (x <= 0) {
            flag = false
          }
        } else {
          x = x + 0.05
          if (x >= 1) {
            flag = true
          }
        }
        let earthColorEntity = null
        let side =
          mbFlickerEntity &&
            mbFlickerEntity.properties &&
            mbFlickerEntity.properties.airplaneAction &&
            mbFlickerEntity.properties.airplaneAction._value &&
            mbFlickerEntity.properties.airplaneAction._value.side
            ? mbFlickerEntity.properties.airplaneAction._value.side
            : mbFlickerEntity?.properties?.side?._value
              ? mbFlickerEntity?.properties?.side?._value
              : ''
        if (side === 'blue') {
          earthColorEntity = window.MSIMEarth.Color.BLUE.withAlpha(x)
        } else if (side === 'red') {
          earthColorEntity = window.MSIMEarth.Color.RED.withAlpha(x)
        } else {
          earthColorEntity = window.MSIMEarth.Color.BLUE.withAlpha(x)
        }
        return earthColorEntity
      }, false),
      pixelSize: 15,
      outlineWidth: 0
    }
  })
}
export function tempEntityDel() {
  // 删除连线以及鼠标提示信息
  for (let i = window.EarthViewer.entities.values.length - 1; i >= 0; i--) {
    let entity = window.EarthViewer.entities.values[i]
    if (
      entity &&
      entity.name &&
      (entity.name.indexOf('线') > -1 ||
        entity.name.indexOf('移动提示信息') > -1 ||
        entity.name.indexOf('点闪烁') > -1)
    ) {
      window.EarthViewer.entities.remove(entity) //移除
    }
  }
}
// 添加流线连线
const addCommConLineBySourFixedPostion = (entityPos2) => {
  window.sceneAction.connectLineManagement.addCommConLineBySourFixedPostion({
    sourId: store.getters.getCurrentNode.code,
    entityPos2: entityPos2,
    color: new window.MSIMEarth.Color(225 / 255, 179 / 255, 21 / 255, 1),
    show: true
  })
}
// 攻击指定位置
export function onFireAtPosition(enPositionArr2, textStr, weaponsArr) {
  let commandControlObj = {
    isShow: true,
    commandFormData: {
      command: textStr,
      sourceName: store.getters.getCurrentNode.code,
      targetName: 'wzInfo',
      longitude: enPositionArr2[0],
      latitude: enPositionArr2[1],
      height: enPositionArr2[2],
      weaponsArr: weaponsArr
    }
  }
  emitter.emit('showCommandControl', commandControlObj)
}

/**
 * 判断 点是否在圆内
 * @param {*} circleCenterPointArr  [longitude, latitude]
 * @param {*} radius
 * @param {*} pointArr [longitude, latitude]
 * @returns
 */
export function getIsInsideCircleByPoint(
  circleCenterPointArr,
  radius,
  pointArr
) {
  console.log('当前半径', radius)
  // 创建一个圆形要素 longitude、latitude为圆心经度和纬度，radius为半径 单位KM
  radius = Number(radius / 1000)
  let circle = window.turf.circle(circleCenterPointArr, radius)
  // 将圆形要素转换成 GeoJSON 格式
  // let geojsonCircle = window.turf.feature(circle)
  // 创建一个点要素 longitude、latitude为点的经度和纬度
  let point = window.turf.point(pointArr)
  // 将点要素转换成 GeoJSON 格式
  // let geojsonPoint = window.turf.feature(point)
  // 使用 window.turf.js 中的 within 函数来判断点是否在圆内
  // let isInsideCircle = window.turf.booleanWithin(geojsonPoint, geojsonCircle)
  let isInsideCircle = window.turf.booleanWithin(point, circle)
  // 多边形判断方式
  // let polygon = window.turf.polygon([circle.geometry.coordinates[0]])
  // isInsideCircle = window.turf.booleanPointInPolygon(point, polygon)
  return isInsideCircle
}
// 添加流线连线
const addCommConLineBySourTarget = () => {
  window.sceneAction.connectLineManagement.addCommConLineBySourTarget({
    sourId: store.getters.getCurrentNode.code,
    targetId: store.state.sceneModule.targetInfo.code,
    color: new window.MSIMEarth.Color(225 / 255, 179 / 255, 21 / 255, 1),
    show: true
  })
}
// 攻击目标(afism接口)
export function onFireToTarget(textStr) {
  // 攻击目标指令接口
  let commandControlObj = {
    isShow: true,
    commandFormData: {
      command: textStr,
      sourceName: store.getters.getCurrentNode.code,
      targetName: store.state.sceneModule.targetInfo.code
    }
  }
  emitter.emit('showCommandControl', commandControlObj)
}

// 攻击指定目标
export function onFireAtTarget(textStr, weaponsArr) {
  // 攻击指定目标指令接口
  let commandControlObj = {
    isShow: true,
    commandFormData: {
      command: textStr,
      sourceName: store.getters.getCurrentNode.code,
      targetName: store.state.sceneModule.targetInfo.code,
      weaponsArr: weaponsArr
    }
  }
  emitter.emit('showCommandControl', commandControlObj)
}
// 攻击自定义
export async function onFireByRaw(textStr, weaponsArr) {
  let isTrackTarget = await getIsTrackTargetFun(
    store.getters.getCurrentNode.code,
    store.state.sceneModule.targetInfo.code
  )
  if (isTrackTarget) {
    let commandControlObj = {
      isShow: true,
      commandFormData: {
        command: textStr,
        sourceName: store.getters.getCurrentNode.code,
        targetName: store.state.sceneModule.targetInfo.code,
        weaponsArr: weaponsArr
      }
    }
    emitter.emit('showCommandControl', commandControlObj)
  }
}
// 移动平台到目标距离指令接口 、生成干扰弹接口、激光定向干扰接口(立即导调指令)、激光欺骗、飞机起飞
const onMoveToTarget = (textStr) => {
  setTimeout(() => {
    let commandControlObj = {
      isShow: true,
      commandFormData: {
        command: textStr,
        sourceName: store.getters.getCurrentNode.code,
        targetName: store.state.sceneModule.targetInfo.code
      }
    }
    emitter.emit('showCommandControl', commandControlObj)
  }, 400)
}
//变更平台高度
export function moveToAltitudeChange(value) {
  if (value) {
    if (store.getters.getCurrentNode) {
      leftDoubleClickFun()
      sourceMbFlickerEntity(store.getters.getCurrentNode.code)
      let entitypath2 = window.EarthPlugn.entity._GetCZMLEntity(
        store.getters.getCurrentNode.code,
        'MSIMEarthCZMLProcessContainer'
      )
      let enPositionArr2
      if (window.MSIMEarth.defined(entitypath2)) {
        enPositionArr2 = getEititiesPostion(entitypath2)
        setTimeout(() => {
          let commandControlObj = {
            isShow: true,
            commandFormData: {
              command: '变更平台高度',
              sourceName: store.getters.getCurrentNode.code,
              longitude: enPositionArr2[0],
              latitude: enPositionArr2[1],
              height: parseInt(enPositionArr2[2])
            }
          }
          emitter.emit('showCommandControl', commandControlObj)
        }, 400)
      }
    }
  } else {
  }
}

// 移动平台到指定位置 与 立即改变位置
const getEarthPosition = (textStr) => {
  sourceMbFlickerEntity(store.getters.getCurrentNode.code)
  let entityLabel = window.EarthViewer.entities.add({
    name: '移动提示信息',
    label: {
      show: false,
      scale: 0.5,
      font: '32px monospace',
      horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
      verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
      pixelOffset: new window.MSIMEarth.Cartesian2(20, 0),
      style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
      fillColor: window.MSIMEarth.Color.WHITE,
      outlineColor: window.MSIMEarth.Color.BLACK,
      outlineWidth: 5,
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    }
  })
  let positions = [],
    poly,
    sourceSource
  // 选择连线指向
  let PolyLinePrimitive = (function () {
    function _(id, positions) {
      options = {
        id: id,
        name: '线',
        show: true,
        polyline: {
          show: true,
          positions: [],
          // material: window.MSIMEarth.Color.AQUA,
          // width: 3,
          material: new MSIMEarth.PolylineArrowMaterialProperty(
            MSIMEarth.Color.fromCssColorString('#00ffff').withAlpha(0.8)
          ),
          width: 16,
          clampToGround: false,
          disableDepthTestDistance: Number.POSITIVE_INFINITY
        }
      }
      let updatePolyline = function () {
        if (
          typeof positions[0] === 'undefined' ||
          typeof positions[1] === 'undefined'
        ) {
          return
        }
        return positions
      }
      instance.positions = positions
      //实时更新polyline
      options.polyline.positions = new window.MSIMEarth.CallbackProperty(
        updatePolyline,
        false
      )
      instance.entity = window.EarthViewer.entities.add(options)
    }
    return _
  })()
  let entitypath = window.EarthPlugn.entity._GetCZMLEntity(
    store.getters.getCurrentNode.code,
    'MSIMEarthCZMLProcessContainer'
  )
  if (!window.MSIMEarth.defined(entitypath)) {
    return false
  }
  if (!window.MSIMEarth.defined(entitypath.position)) {
    return false
  }
  let currentTime = window.EarthViewer.clock.currentTime
  let positionArr = entitypath.position.getValue(currentTime)
  // 有位置信息
  if (positionArr && Object.keys(positionArr).length > 1) {
    if (positions.length == 0) {
      positions.push(positionArr.clone())
    }
    positions.push(positionArr)
  }
  state2.handlerCommControl = new window.MSIMEarth.ScreenSpaceEventHandler(
    window.EarthViewer.scene.canvas
  )
  //去掉单双击的效果
  // window.EarthViewer.screenSpaceEventHandler.removeInputAction(
  //   window.MSIMEarth.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
  // )
  //鼠标移动
  let ellipsoid = window.EarthViewer.scene.globe.ellipsoid
  state2.handlerCommControl.setInputAction(function (movement) {
    let cartesian = window.EarthViewer.scene.camera.pickEllipsoid(
      movement.endPosition,
      ellipsoid
    )
    if (window.MSIMEarth.defined(cartesian)) {
      if (!window.MSIMEarth.defined(entitypath.position)) {
        return false
      }
      window.EarthViewer._container.style.cursor = 'pointer'
      // 实时更新模型点位
      currentTime = window.EarthViewer.clock.currentTime
      positionArr = entitypath.position.getValue(currentTime)
      positions[0] = positionArr
      positions.pop()
      // cartesian.y += 1 + Math.random()
      positions.push(cartesian)
      if (!window.MSIMEarth.defined(poly)) {
        poly = new PolyLinePrimitive(new Date().getTime(), positions)
      }
      entityLabel.position = cartesian
      entityLabel.label.show = true
      entityLabel.label.text = '请在地图上拾取位置,左击确认完成'
    } else {
      entityLabel.label.show = false
    }
  }, window.MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE)
  //鼠标左键单击
  state2.handlerCommControl.setInputAction(function (click) {
    // 清除可能存在的双击事件定时器
    if (state2.clickTimer) {
      window.clearTimeout(state2.clickTimer)
      state2.clickTimer = null
    }
    // 设置单击事件的定时器
    state2.clickTimer = window.setTimeout(() => {
      // 单击事件的处理逻辑
      // 获取场景坐标
      // let cartesian = window.EarthViewer.scene.pickPosition(click.position)
      // var picked = window.EarthViewer.scene.pick(click.position)
      // 获取椭球面坐标
      // let cartesian = window.EarthViewer.scene.camera.pickEllipsoid(
      //   click.position,
      //   ellipsoid
      // )
      // 获取地表坐标
      let ray = window.EarthViewer.camera.getPickRay(click.position)
      let cartesian = window.EarthViewer.scene.globe.pick(
        ray,
        window.EarthViewer.scene
      )
      if (window.MSIMEarth.defined(cartesian)) {
        entityLabel.label.show = false
        // 去掉鼠标事件
        if (state2.handlerCommControl) {
          state2.handlerCommControl.destroy()
          state2.handlerCommControl = null
        }
        //删除
        tempEntityDel()
        poly = null
        var cartographic =
          window.MSIMEarth.Cartographic.fromCartesian(cartesian)
        var lng = window.MSIMEarth.Math.toDegrees(cartographic.longitude)
        var lat = window.MSIMEarth.Math.toDegrees(cartographic.latitude)
        var alt = cartographic.height
        let entitypath2 = window.EarthPlugn.entity._GetCZMLEntity(
          store.getters.getCurrentNode.code,
          'MSIMEarthCZMLProcessContainer'
        )
        let enPositionArr2
        if (window.MSIMEarth.defined(entitypath2)) {
          enPositionArr2 = getEititiesPostion(entitypath2)

          let commandControlObj = {
            isShow: true,
            commandFormData: {
              command: textStr,
              sourceName: store.getters.getCurrentNode.code,
              longitude: lng,
              latitude: lat,
              height: parseInt(enPositionArr2[2])
            }
          }
          emitter.emit('showCommandControl', commandControlObj)
          leftDoubleClickFun()
        }
      }
    }, 300) // 300毫秒内没有第二次点击则认为是单击
  }, window.MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)
  //鼠标左键双击
  state2.handlerCommControl.setInputAction(function (doubleClick) {
    if (doubleClick.position) {
      // 清除可能存在的双击事件定时器
      if (state2.clickTimer) {
        window.clearTimeout(state2.clickTimer)
        state2.clickTimer = null
      }
      clearCommandControlFun()
      emitter.emit('clearRedioData')
    }
  }, window.MSIMEarth.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
  console.log(positions)
}

// 移动平台到指定位置指令接口
export function moveToPositionChange(value) {
  if (value) {
    if (store.getters.getCurrentNode) {
      getEarthPosition('移动平台到指定位置')
    }
  } else {
  }
}

// 立即改变位置指令接口
export function setPositionChange(value) {
  if (value) {
    if (store.getters.getCurrentNode) {
      getEarthPosition('立即改变位置')
    }
  } else {
  }
}
//移动平台到目标距离指令接口
export function moveToTargetChange(value) {
  if (value) {
    sourceAndTargetSetCommand('移动平台到目标距离')
  } else {
  }
}

//变更平台传感器频率指令接口
export async function sensorChangeFrequencyChange(value) {
  if (value) {
    if (store.getters.getCurrentNode) {
      leftDoubleClickFun()
      sourceMbFlickerEntity(store.getters.getCurrentNode.code)
      let sensorsArr = await getSensors()
      if (sensorsArr && sensorsArr.length > 0) {
        let haFrequency = sensorsArr[0]['xaF']
        if (haFrequency && Number(haFrequency) > 0) {
          setTimeout(() => {
            let commandControlObj = {
              isShow: true,
              commandFormData: {
                command: '变更平台传感器频率',
                sourceName: store.getters.getCurrentNode.code,
                sensoresArr: sensorsArr
              }
            }
            emitter.emit('showCommandControl', commandControlObj)
          }, 400)
        } else {
          beautyToast.warning({
            title: '导调指令',
            message: '未挂载相关传感器频率信息!',
            darkTheme: true
          })
          clearCommandControlFun()
          emitter.emit('clearRedioData')
        }
      } else {
        beautyToast.warning({
          title: '导调指令',
          message: '未挂载相关传感器信息!',
          darkTheme: true
        })
        clearCommandControlFun()
        emitter.emit('clearRedioData')
      }
    }
  } else {
  }
}

// 获取 飞机搭载的传感器属性信息
let getSensors = async () => {
  let airplaneActionSensors = []
  let params = { name: store.getters.getCurrentNode.code }
  let res = await getPlateSWMessageV2(params)

  if (res.code == 200) {
    let sensorsArr = res.data && res.data['sensors']
    airplaneActionSensors =
      sensorsArr && sensorsArr.length > 0 ? sensorsArr : []
    console.log(airplaneActionSensors)
  }
  return airplaneActionSensors
}

// //激光欺骗干扰状态模式指令接口
// export async function LaserDesignatorStateChange(value) {
//   setTimeout(() => {
//     let commandControlObj = {
//       isShow: true,
//       commandFormData: {
//         command: '激光欺骗干扰状态状态',
//         sourceName: store.getters.getCurrentNode.code,
//         sensoresArr: sensorsArr
//       }
//     }
//     emitter.emit('showCommandControl', commandControlObj)
//   }, 400)
//   console.log(value)
// }
//
export async function sensorChangeModeChange(value) {
  if (value) {
    if (store.getters.getCurrentNode) {
      leftDoubleClickFun()
      sourceMbFlickerEntity(store.getters.getCurrentNode.code)
      let sensorsArr = await getSensors()
      if (sensorsArr && sensorsArr.length > 0) {
        let commandControlObj = {
          isShow: true,
          commandFormData: {
            command: '变更平台传感器模式',
            sourceName: store.getters.getCurrentNode.code,
            sensoresArr: sensorsArr
          }
        }
        emitter.emit('showCommandControl', commandControlObj)
      } else {
        beautyToast.warning({
          title: '导调指令',
          message: '未挂载相关传感器信息!',
          darkTheme: true
        })
        clearCommandControlFun()
        emitter.emit('clearRedioData')
      }
    }
  } else {
  }
}
//变更平台传感器状态指令接口
export async function sensorChangeStateChange(value) {
  if (value) {
    if (store.getters.getCurrentNode) {
      leftDoubleClickFun()
      sourceMbFlickerEntity(store.getters.getCurrentNode.code)
      let sensorsArr = await getSensors()
      if (sensorsArr && sensorsArr.length > 0) {
        setTimeout(() => {
          let commandControlObj = {
            isShow: true,
            commandFormData: {
              command: '变更平台传感器状态',
              sourceName: store.getters.getCurrentNode.code,
              sensoresArr: sensorsArr
            }
          }
          emitter.emit('showCommandControl', commandControlObj)
        }, 400)
      } else {
        beautyToast.warning({
          title: '导调指令',
          message: '未挂载相关传感器信息!',
          darkTheme: true
        })
        clearCommandControlFun()
        emitter.emit('clearRedioData')
      }
    }
  } else {
  }
}

//变更平台干扰状态指令接口
export async function fireTurnOnWeaponChange(value) {
  if (value) {
    if (store.getters.getCurrentNode) {
      leftDoubleClickFun()
      sourceMbFlickerEntity(store.getters.getCurrentNode.code)
      let weaponsArr = await getWeapons()
      // 获取平台干扰状态 实时 开关信息
      let turnIsOpenStateValue = '0'
      if (weaponsArr && weaponsArr.length > 0) {
        let JammerData = getJammerArrValue('WSF_RF_JAMMER', weaponsArr)
        turnIsOpenStateValue =
          JammerData && JammerData['isOpen'] == false ? '0' : '1'
      }
      setTimeout(() => {
        let commandControlObj = {
          isShow: true,
          commandFormData: {
            command: '变更平台干扰状态',
            sourceName: store.getters.getCurrentNode.code,
            turnIsOpenStateValue: turnIsOpenStateValue
          }
        }
        emitter.emit('showCommandControl', commandControlObj)
      }, 400)
    }
  } else {
  }
}
//激光定向干扰(立即导调指令)
export async function LaserDesignatorStateChange(value) {
  let data = {
    pltName: store.getters.getCurrentNode.code,
    value: value ? 1 : 0
  }
  getLaserDesignatorState(data).then((res) => { })
}

// 查找武器 干扰 类型 -- WSF_RF_JAMMER
const getJammerArrValue = (curData, datasArr) => {
  const i = datasArr.findIndex((item) => {
    return item.btype == curData
  })
  return datasArr[i] ? datasArr[i] : null
}

//生成干扰弹接口(立即导调指令)
export async function generatingJammerChange(value) {
  if (value) {
    sourceAndTargetSetCommand('发送干扰弹')
  } else {
  }
}

//激光定向干扰(立即导调指令)
export async function laserDirectedJammingChange(value) {
  if (value) {
    sourceAndTargetSetCommand('激光定向干扰')
  } else {
  }
}

// 激光欺骗
export async function laserDeceptionChange(value) {
  if (value) {
    sourceAndTargetSetCommand('激光欺骗')
  } else {
  }
}

// 伴飞
export async function accompanyingFlightChange(value) {
  if (value) {
    sourceAndTargetSetCommand('伴飞')
  } else {
  }
}

//变更平台速度
export function moveToSpeedKMHChange(value) {
  if (value) {
    if (store.getters.getCurrentNode) {
      leftDoubleClickFun()
      sourceMbFlickerEntity(store.getters.getCurrentNode.code)
      let entitypath2 = window.EarthPlugn.entity._GetCZMLEntity(
        store.getters.getCurrentNode.code,
        'MSIMEarthCZMLProcessContainer'
      )
      let enPositionArr2
      if (window.MSIMEarth.defined(entitypath2)) {
        enPositionArr2 = getEititiesPostion(entitypath2)
        // 查询平台速度
        let params = { platform: store.getters.getCurrentNode.code }
        getPlatformState(params).then((res) => {
          if (res.status == 'success') {
            // 速度 m/s 换算为 km/h
            let speedKm = 0
            if (res.data.Speed) {
              speedKm = Number(res.data.Speed) * 3.6
            }
            setTimeout(() => {
              let commandControlObj = {
                isShow: true,
                commandFormData: {
                  command: '变更平台速度',
                  sourceName: store.getters.getCurrentNode.code,
                  longitude: enPositionArr2[0],
                  latitude: enPositionArr2[1],
                  originalSpeed: speedKm.toFixed(3)
                }
              }
              emitter.emit('showCommandControl', commandControlObj)
            }, 400)
          }
        })
      }
    }
  } else {
  }
}

//变更航向
export function moveToHeadingChange(value) {
  if (value) {
    if (store.getters.getCurrentNode) {
      leftDoubleClickFun()
      sourceMbFlickerEntity(store.getters.getCurrentNode.code)
      let entitypath2 = window.EarthPlugn.entity._GetCZMLEntity(
        store.getters.getCurrentNode.code,
        'MSIMEarthCZMLProcessContainer'
      )
      let enPositionArr2
      if (window.MSIMEarth.defined(entitypath2)) {
        enPositionArr2 = getEititiesPostion(entitypath2)
        // 查询平台航向
        let params = { platform: store.getters.getCurrentNode.code }
        getPlatformState(params).then((res) => {
          if (res.status == 'success') {
            setTimeout(() => {
              let commandControlObj = {
                isShow: true,
                commandFormData: {
                  command: '变更航向',
                  sourceName: store.getters.getCurrentNode.code,
                  Heading: res.data.Heading
                }
              }
              emitter.emit('showCommandControl', commandControlObj)
            }, 400)
          }
        })
      }
    }
  } else {
  }
}

// 变更传感器开关
export function switchToSensorChange(value) {
  if (value) {
    if (store.getters.getCurrentNode) {
      leftDoubleClickFun()
      sourceMbFlickerEntity(store.getters.getCurrentNode.code)
      let entitypath2 = window.EarthPlugn.entity._GetCZMLEntity(
        store.getters.getCurrentNode.code,
        'MSIMEarthCZMLProcessContainer'
      )
      let params = {
        platform: store.getters.getCurrentNode.code
      }
      let sensorArr = []
      // let sensorArrName = []
      getPlatformParts(params).then((res) => {
        if (res.status == 'success') {
          for (let i = 0; i < res.data.length; i++) {
            if (
              res.data[i].PartType == 'SENSOR' &&
              res.data[i].Name.indexOf('_') == -1
            ) {
              sensorArr.push(res.data[i])
              // sensorArrName.push(res.data[i].Name)
            }
            if (
              res.data[i].PartType == 'RADAR' &&
              res.data[i].Name.indexOf('_') == -1
            ) {
              sensorArr.push(res.data[i])
              // sensorArrName.push(res.data[i].Name)
            }
          }
        }
      })
      if (window.MSIMEarth.defined(entitypath2)) {
        setTimeout(() => {
          let commandControlObj = {
            isShow: true,
            commandFormData: {
              command: '变更传感器开关',
              sourceName: store.getters.getCurrentNode.code,
              sensorArr: sensorArr
              // sensorArrName: sensorArrName
            }
          }
          emitter.emit('showCommandControl', commandControlObj)
        }, 400)
      }
    }
  } else {
  }
}

// 变更弹药数量
export function setWeaponNum(value) {
  let commandControlObj = {
    isShow: true,
    commandFormData: {
      command: '变更弹药数量',
      sourceName: store.getters.getCurrentNode.code
    }
  }
  emitter.emit('showCommandControl', commandControlObj)
}

// 攻击目标
export function attackTargetChange(value) {
  if (value) {
    sourceAndTargetSetCommand('攻击目标')
  } else {
  }
}

// 销毁
export function destroyTargetChange(value) {
  if (value) {
    if (store.getters.getCurrentNode) {
      leftDoubleClickFun()
      sourceMbFlickerEntity(store.getters.getCurrentNode.code)
      let entitypath2 = window.EarthPlugn.entity._GetCZMLEntity(
        store.getters.getCurrentNode.code,
        'MSIMEarthCZMLProcessContainer'
      )
      // let params = {
      //   platform: store.getters.getCurrentNode.code
      // }
      // getPlatformParts(params).then((res) => {
      //   if (res.status == 'success') {
      //     //
      //   }
      // })
      if (window.MSIMEarth.defined(entitypath2)) {
        setTimeout(() => {
          let commandControlObj = {
            isShow: true,
            commandFormData: {
              command: '销毁',
              sourceName: store.getters.getCurrentNode.code
            }
          }
          emitter.emit('showCommandControl', commandControlObj)
        }, 400)
      }
    }
  } else {
  }
}

// 获取 飞机搭载的 烟雾干扰装置 状态
let getInfraredSign = async () => {
  let params = { name: store.getters.getCurrentNode.code }
  let res = await getPlateSWMessageV2(params)
  let infraredSignStr = ''
  if (res.code == 200) {
    infraredSignStr = res.data && res.data['infraredSign']
  }
  return infraredSignStr
}

// 变更烟雾干扰装置状态
export async function changeInfraredStateChange(value) {
  if (value) {
    if (store.getters.getCurrentNode) {
      leftDoubleClickFun()
      sourceMbFlickerEntity(store.getters.getCurrentNode.code)
      let infraredSignStr = await getInfraredSign()
      setTimeout(() => {
        let commandControlObj = {
          isShow: true,
          commandFormData: {
            command: '变更烟雾干扰装置状态',
            sourceName: store.getters.getCurrentNode.code,
            infraredSign: infraredSignStr
          }
        }
        console.log(commandControlObj)
        emitter.emit('showCommandControl', commandControlObj)
      }, 400)
    }
  } else {
  }
}

//特情 方法
const commandSpecialFun = (commandStr) => {
  if (store.getters.getCurrentNode) {
    sourceMbFlickerEntity(store.getters.getCurrentNode.code)
    let entitypath2 = window.EarthPlugn.entity._GetCZMLEntity(
      store.getters.getCurrentNode.code,
      'MSIMEarthCZMLProcessContainer'
    )
    if (window.MSIMEarth.defined(entitypath2)) {
      setTimeout(() => {
        let commandControlObj = {
          isShow: true,
          commandFormData: {
            command: commandStr,
            sourceName: store.getters.getCurrentNode.code
          }
        }
        emitter.emit('showCommandControl', commandControlObj)
      }, 400)
    }
  }
}

//特情：发动机故障
export function breakMoverChange(value) {
  if (value) {
    commandSpecialFun('发动机故障')
  } else {
  }
}

//特情：油料缺失
export function deficiencyFuelChange(value) {
  if (value) {
    commandSpecialFun('油料缺失')
  } else {
  }
}

//特情：缺失弹药
export function deficiencyWeaponQuantityChange(value) {
  if (value) {
    commandSpecialFun('缺失弹药')
  } else {
  }
}

//飞机起飞
export function taskOffChange(value) {
  if (value) {
    sourceAndTargetSetCommand('飞机起飞')
    // if (store.getters.getCurrentNode) {
    //   leftDoubleClickFun()
    //   sourceMbFlickerEntity(store.getters.getCurrentNode.code)
    //   setTimeout(() => {
    //     let commandControlObj = {
    //       isShow: true,
    //       commandFormData: {
    //         command: '飞机起飞',
    //         sourceName: store.getters.getCurrentNode.code
    //       }
    //     }
    //     emitter.emit('showCommandControl', commandControlObj)
    //   }, 400)
    // }
  } else {
  }
}

//获取czml实体经纬度信息
function getEititiesPostion(entitypath) {
  if (!window.MSIMEarth.defined(entitypath.position)) {
    return []
  }

  let currentTime = window.EarthViewer.clock.currentTime
  let positionArr = entitypath.position.getValue(currentTime)
  let entitiesCartographic =
    window.MSIMEarth.Cartographic.fromCartesian(positionArr)
  console.log(entitiesCartographic)
  return [
    window.MSIMEarth.Math.toDegrees(entitiesCartographic.longitude),
    window.MSIMEarth.Math.toDegrees(entitiesCartographic.latitude),
    entitiesCartographic.height
  ]
}
// 查找目标位置信息
const getTargetPositionData = () => {
  let entitypath2 = window.EarthPlugn.entity._GetCZMLEntity(
    store.state.sceneModule.targetInfo.code,
    'MSIMEarthCZMLProcessContainer'
  )
  let enPositionArr2
  if (window.MSIMEarth.defined(entitypath2)) {
    // 非固定
    enPositionArr2 = getEititiesPostion(entitypath2)
  } else {
    // 固定
    let entities = window.EarthViewer.entities.getById(
      store.state.sceneModule.targetInfo.code
    )
    if (!window.MSIMEarth.defined(entities.position)) {
      return []
    }
    let entitiesCartographic = window.MSIMEarth.Cartographic.fromCartesian(
      entities.position._value
    )
    enPositionArr2 = [
      window.MSIMEarth.Math.toDegrees(entitiesCartographic.longitude),
      window.MSIMEarth.Math.toDegrees(entitiesCartographic.latitude),
      entitiesCartographic.height
    ]
  }
  return enPositionArr2
}
//鼠标移动 拾取目标
const showMouseCurTarget = (callback) => {
  let entityLabel = window.EarthViewer.entities.add({
    name: '当前拾取目标',
    id: '当前拾取目标',
    label: {
      show: false,
      scale: 0.5,
      font: '32px monospace',
      horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
      verticalOrigin: window.MSIMEarth.VerticalOrigin.verticalOrigin,
      pixelOffset: new window.MSIMEarth.Cartesian2(20, -50),
      style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
      fillColor: window.MSIMEarth.Color.WHITE,
      outlineColor: window.MSIMEarth.Color.BLACK,
      outlineWidth: 5,
      disableDepthTestDistance: Number.POSITIVE_INFINITY
    }
  })
  let ellipsoid = window.EarthViewer.scene.globe.ellipsoid
  state2.handlerCommControl = new window.MSIMEarth.ScreenSpaceEventHandler(
    window.EarthViewer.scene.canvas
  )
  //鼠标移动
  state2.handlerCommControl.setInputAction(function (movement) {
    let cartesian = window.EarthViewer.scene.camera.pickEllipsoid(
      movement.endPosition,
      ellipsoid
    )
    if (window.MSIMEarth.defined(cartesian)) {
      window.EarthViewer._container.style.cursor = 'pointer'
      entityLabel.position = cartesian
      entityLabel.label.show = true
      entityLabel.label.text = `请在地图上选取目标,左击确认完成!`
    } else {
      entityLabel.label.show = false
    }
  }, window.MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE)
  //鼠标左键单击
  state2.handlerCommControl.setInputAction(function (click) {
    // 清除可能存在的双击事件定时器
    if (state2.clickTimer) {
      window.clearTimeout(state2.clickTimer)
      state2.clickTimer = null
    }
    // 设置单击事件的定时器
    state2.clickTimer = window.setTimeout(() => {
      // 获取地表坐标
      let ray = window.EarthViewer.camera.getPickRay(click.position)
      let cartesianClick = window.EarthViewer.scene.globe.pick(
        ray,
        window.EarthViewer.scene
      )
      if (window.MSIMEarth.defined(cartesianClick)) {
        var picked = window.EarthViewer.scene.pick(click.position)
        if (window.MSIMEarth.defined(picked) && picked.id) {
          if (picked.id._model || picked.id.label || picked.id.billboard) {
            entityLabel.label.show = false
            // 去掉鼠标事件
            if (state2.handlerCommControl) {
              state2.handlerCommControl.destroy()
              state2.handlerCommControl = null
            }
            //移除label提示框
            window.EarthViewer.entities.removeById('当前拾取目标')
            window.EarthViewer._container.style.cursor = 'default'
            let targetName =
              picked.id && picked.id['_id'] ? picked.id['_id'] : ''
            callback({
              sourceName: store.getters.getCurrentNode.code,
              targetName: targetName
            })
          }
        }
      }
    }, 300) // 300毫秒内没有第二次点击则认为是单击
  }, window.MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)
  //鼠标左键双击
  state2.handlerCommControl.setInputAction(function (doubleClick) {
    if (doubleClick.position) {
      // 清除可能存在的双击事件定时器
      if (state2.clickTimer) {
        window.clearTimeout(state2.clickTimer)
        state2.clickTimer = null
      }
      removeEntityMbById('RE_Distance')
    }
  }, window.MSIMEarth.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
}
// 获取源于目标id，显示距离、方位、高度差
export const getSourceAndTargetEntity = () => {
  removeEntityMbById('RE_Distance')
  showMouseCurTarget((sourceAndtargetObj) => {
    let colorC = new window.MSIMEarth.Color(0, 255 / 255, 255 / 255, 1)
    // 增加攻击时两机的距离
    // window.sceneAction.connectLineManagement.addDashLine({
    //   sourId: sourceAndtargetObj.sourceName,
    //   targetId: sourceAndtargetObj.targetName,
    //   color: colorC,
    //   type: 'RE_Distance_LiuDLine',
    //   width: 10,
    //   show: true
    // })
    window.sceneAction.connectLineManagement.addSolidLine({
      sourId: sourceAndtargetObj.sourceName,
      targetId: sourceAndtargetObj.targetName,
      color: window.MSIMEarth.Color.fromCssColorString('#48cbd7'),
      type: 'RE_Distance_LiuDLine',
      width: 2,
      show: true
    })

    window.sceneAction.connectLineManagement.sourAndTargetDistanceLabel({
      sourId: sourceAndtargetObj.sourceName,
      targetId: sourceAndtargetObj.targetName,
      color: colorC,
      type: 'RE_Distance',
      show: true
    })
  })
}

// 删除MB-Entity 使用倒序
export const removeEntityMbById = (mbId) => {
  if (state2.handlerCommControl) {
    // 去掉鼠标事件
    if (state2.handlerCommControl) {
      state2.handlerCommControl.destroy()
      state2.handlerCommControl = null
    }
  }
  //移除label提示框
  window.EarthViewer.entities.removeById('当前拾取目标')
  for (let i = window.EarthViewer.entities.values.length - 1; i >= 0; i--) {
    let entityMbJl = window.EarthViewer.entities.values[i]
    if (typeof entityMbJl.id !== 'undefined') {
      if (
        typeof entityMbJl.id == 'string' &&
        entityMbJl.id.indexOf(mbId) > -1
      ) {
        if (window.EarthViewer.entities.getById(entityMbJl.id)) {
          window.EarthViewer.entities.removeById(entityMbJl.id)
        }
      }
    }
  }
}
//快捷方式-鼠标左键双击，执行立即改变位置导调指令
export function changePosNow() {
  state2.handlerCommControl1 = new window.MSIMEarth.ScreenSpaceEventHandler(
    window.EarthViewer.scene.canvas
  )
  //鼠标左键双击
  state2.handlerCommControl1.setInputAction(function (doubleClick) {
    if (doubleClick.position) {
      // 获取地表坐标
      let ray = window.EarthViewer.camera.getPickRay(doubleClick.position)
      let cartesian = window.EarthViewer.scene.globe.pick(
        ray,
        window.EarthViewer.scene
      )
      if (window.MSIMEarth.defined(cartesian)) {
        var cartographic =
          window.MSIMEarth.Cartographic.fromCartesian(cartesian)
        var lng = window.MSIMEarth.Math.toDegrees(cartographic.longitude)
        var lat = window.MSIMEarth.Math.toDegrees(cartographic.latitude)
        let entitypath2 = window.EarthPlugn.entity._GetCZMLEntity(
          store.getters.getCurrentNode.code,
          'MSIMEarthCZMLProcessContainer'
        )
        let enPositionArr2
        if (window.MSIMEarth.defined(entitypath2)) {
          enPositionArr2 = getEititiesPostion(entitypath2)
          // 立即改变位置指令接口
          let params = {
            lng: lng,
            lat: lat,
            alt: parseInt(enPositionArr2[2]),
            pltName: store.getters.getCurrentNode.code
          }
          setPosition(params).then((res) => {
            window.EarthViewer._container.style.cursor = 'default'
            if (res.code == 200) {
              let sendToCommandData = JSON.parse(res.data)
              if (sendToCommandData['IsSendToCommand'] == 'true') {
                let controlResData = JSON.parse(sendToCommandData.data)
                if (controlResData && Object.keys(controlResData).length > 0) {
                  if (controlResData.status == 'successes') {
                    window.sceneAction.systemMessage.labelMessage({
                      sysMessageId:
                        store.getters.getCurrentNode.code + '_sysMessage',
                      sysMessagePosition: [params.lng, params.lat, params.alt],
                      sysMessageText: '设置平台到指定位置(立刻)指令完成',
                      sysFillColor: store.state.seatModule.getStateInfoColor
                    })
                  } else {
                    if (
                      controlResData['reason'] &&
                      controlResData['reason'].length > 0
                    ) {
                      ElMessage({
                        type: 'error',
                        message: '导调指令失败：' + controlResData['reason']
                      })
                    } else {
                      ElMessage({
                        type: 'error',
                        message:
                          '导调' + controlResData['commandName'] + '指令失败!'
                      })
                    }
                  }
                }
              }
              //sendToCommandShowResMsg(res.data, '设置平台到指定位置(立刻)指令完成', store.getters.getCurrentNode.code)
            }
          })
        }
      }
    }
  }, window.MSIMEarth.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
}
//快捷方式-鼠标左键单击实体目标，执行攻击导调指令
export async function fireTargetEntity() {
  let weaponsArr = []
  if (store.getters.getCurrentNode) {
    weaponsArr = await getWeapons()
  }
  if (store.getters.getCurrentNode && store.getters.getCurrentNode.code) {
    let entitypath = window.EarthPlugn.entity._GetCZMLEntity(
      store.getters.getCurrentNode.code,
      'MSIMEarthCZMLProcessContainer'
    )
    if (!window.MSIMEarth.defined(entitypath)) {
      return false
    }
    if (!window.MSIMEarth.defined(entitypath.position)) {
      return false
    }
    let currentTime = window.EarthViewer.clock.currentTime
    let positionArr = entitypath.position.getValue(currentTime)
    if (!window.MSIMEarth.defined(positionArr)) return
    // 有位置信息
    if (Object.keys(positionArr).length > 1) {
      let sourcePositionArr = getEititiesPostion(entitypath)
      state2.handlerCommControl2 = new window.MSIMEarth.ScreenSpaceEventHandler(
        window.EarthViewer.scene.canvas
      )
      //鼠标左键单击
      state2.handlerCommControl2.setInputAction(function (click) {
        let picked = window.EarthViewer.scene.pick(click.position)
        // 清除可能存在的双击事件定时器
        if (state2.clickTimer) {
          window.clearTimeout(state2.clickTimer)
          state2.clickTimer = null
        }
        // 设置单击事件的定时器
        state2.clickTimer = window.setTimeout(async () => {
          // 获取地表坐标
          let ray = window.EarthViewer.camera.getPickRay(click.position)
          let cartesianPickPosition = window.EarthViewer.scene.globe.pick(
            ray,
            window.EarthViewer.scene
          )
          if (window.MSIMEarth.defined(cartesianPickPosition)) {
            if (window.MSIMEarth.defined(picked) && picked.id) {
              if (picked.id._model || picked.id.label || picked.id.billboard) {
                //判断实体是否有挂载弹
                if (weaponsArr && weaponsArr.length == 0) {
                  beautyToast.warning({
                    title: '导调指令',
                    message: '未挂载相关武器装备信息!',
                    darkTheme: true
                  })
                  return false
                }
                let infors = {
                  code: picked.id && picked.id['_id'] ? picked.id['_id'] : ''
                }
                //判断平台是否能探测到被打击目标
                let params = {
                  FireName: store.getters.getCurrentNode.code,
                  TargetName: infors.code
                }
                let trackRes = await getIsTrackTarget(params)
                if (trackRes.code == 200) {
                  if (trackRes.data['IsSendToCommand'] == 'true') {
                    let controlResData = JSON.parse(trackRes.data.data)
                    if (
                      controlResData &&
                      Object.keys(controlResData).length > 0
                    ) {
                      if (controlResData.status != 'success') {
                        ElMessage({
                          type: 'error',
                          message: '导调指令：平台探测不到!'
                        })
                        return false
                      }
                    }
                  } else {
                    ElMessage({
                      type: 'error',
                      message: '导调指令：未获取到探测数据!'
                    })
                  }
                }
                //判断是否在火力范围内
                if (weaponsArr[0]['pr'] && Number(weaponsArr[0]['pr']) > 0) {
                  let enPositionArr2 = getTargetPositionData()
                  if (
                    sourcePositionArr &&
                    sourcePositionArr.length > 0 &&
                    enPositionArr2 &&
                    enPositionArr2.length > 0
                  ) {
                    let isSideCircle2 = getIsInsideCircleByPoint(
                      [sourcePositionArr[0], sourcePositionArr[1]],
                      weaponsArr[0]['pr'],
                      [enPositionArr2[0], enPositionArr2[1]]
                    )
                    if (!isSideCircle2) {
                      beautyToast.warning({
                        title: '导调指令',
                        message: '您选择的目标已超出攻击范围!',
                        darkTheme: true
                      })
                      return false
                    }
                    let isTrackTarget = await getIsTrackTargetFun(
                      store.getters.getCurrentNode.code,
                      store.state.sceneModule.targetInfo.code
                    )
                    if (isTrackTarget) {
                      let commandControlObj = {
                        isShow: true,
                        commandFormData: {
                          command: '攻击自定义',
                          sourceName: store.getters.getCurrentNode.code,
                          targetName: store.state.sceneModule.targetInfo.code,
                          weaponsArr: weaponsArr
                        }
                      }
                      emitter.emit('showFirePanel', commandControlObj)
                    }
                  }
                }
              }
            }
          }
        }, 300) // 300毫秒内没有第二次点击则认为是单击
      }, window.MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)
    }
  }
}
//快捷方式- 拖拽实体重新定位 (导调立即改变位置)
export function changePosNowByDragEntity() {
  state2.handlerCommControl3 = new window.MSIMEarth.ScreenSpaceEventHandler(
    window.EarthViewer.scene.canvas
  )
  //鼠标左键按下
  state2.handlerCommControl3.setInputAction(function (eClick) {
    let pick = window.EarthViewer.scene.pick(eClick.position)
    if (window.MSIMEarth.defined(pick) && pick.id.id) {
      let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
        pick.id.id,
        'MSIMEarthCZMLProcessContainer'
      )
      // 获取实体且实体必须存在
      if (window.MSIMEarth.defined(curEntity)) {
        // 获取实体 是动态目标
        if (
          curEntity.properties &&
          typeof curEntity.properties.airplaneAction !== 'undefined'
        ) {
          window.EarthViewer._container.style.cursor = 'move'
          // state2.curEntityPick = pick
          state2.leftDownFlag = true
          window.EarthViewer.scene.screenSpaceCameraController.enableRotate = false //锁定相机

          state2.curEntityPickId = pick.id.id + '_DragEntity'
          state2.curDragEntitySouId = pick.id.id
          if (window.EarthViewer.entities.getById(state2.curEntityPickId)) {
            window.EarthViewer.entities.removeById(state2.curEntityPickId)
          }
          // 实体颜色
          let colorObj = new window.MSIMEarth.Color(
            pick.id.model.color._value.red,
            pick.id.model.color._value.green,
            pick.id.model.color._value.blue,
            pick.id.model.color._value.alpha
          )
          // 飞机方向
          let orientation = curEntity.orientation.getValue(
            window.EarthViewer.clock.currentTime
          )
          let entitiesDataByPick = {
            id: state2.curEntityPickId,
            position: new window.MSIMEarth.Cartesian3(
              pick.id.position._property?._interpolationResult[0],
              pick.id.position._property?._interpolationResult[1],
              pick.id.position._property?._interpolationResult[2]
            ),
            orientation: orientation,
            model: {
              uri: pick.id.model.uri._value._url,
              colorBlendAmount: pick.id.model.colorBlendAmount._value
                ? pick.id.model.colorBlendAmount._value
                : 0.7,
              colorBlendMode: window.MSIMEarth.ColorBlendMode.MIX,
              scale: pick.id.model.scale
                ? pick.id.model.scale
                : pick.id.model.minimumPixelSize._value
                  ? pick.id.model.minimumPixelSize._value
                  : 30,
              minimumPixelSize: pick.id.model.minimumPixelSize._value
                ? pick.id.model.minimumPixelSize._value
                : 30,
              color: colorObj,
              silhouetteColor: pick.id.model.silhouetteColor
                ? new window.MSIMEarth.Color(
                  pick.id.model.silhouetteColor._value.red,
                  pick.id.model.silhouetteColor._value.green,
                  pick.id.model.silhouetteColor._value.blue,
                  pick.id.model.silhouetteColor._value.alpha
                )
                : new window.MSIMEarth.Color(
                  255 / 255,
                  255 / 255,
                  0 / 255,
                  200 / 255
                ),
              silhouetteSize: pick.id.model.silhouetteSize._value
                ? pick.id.model.silhouetteSize._value
                : 2
              // scale: 1222.0
            }
          }
          window.EarthViewer.entities.add(entitiesDataByPick)
          // 开始拖动时 隐藏当前实体   还是先不做任何操作
          // curEntity.show = false
        }
      }
    }
  }, window.MSIMEarth.ScreenSpaceEventType.LEFT_DOWN)
  //鼠标移动
  state2.handlerCommControl3.setInputAction(function (eClick) {
    if (state2.leftDownFlag === true && state2.curEntityPickId != '') {
      // state2.curEntityPick != null
      let ray = window.EarthViewer.camera.getPickRay(eClick.endPosition)
      let cartesian = window.EarthViewer.scene.globe.pick(
        ray,
        window.EarthViewer.scene
      )

      let curEntityPick = window.EarthViewer.entities.getById(
        state2.curEntityPickId
      )
      if (curEntityPick) {
        curEntityPick.position = cartesian
      }

      // state2.curEntityPick.id.position = cartesian
      // state2.curEntityPick.id.position = new Cesium.CallbackProperty(() => {
      //   return cartesian
      // }, false) //感觉拖拽有点卡顿
    }
  }, window.MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE)
  //鼠标左键抬起
  state2.handlerCommControl3.setInputAction(function (eClick) {
    if (state2.leftDownFlag === true && state2.curEntityPickId != '') {
      // state2.curEntityPick != null
      window.EarthViewer._container.style.cursor = 'default'
      state2.leftDownFlag = false
      // state2.curEntityPick = null

      // 拿当前模型的实体位置
      let curEntityPick = window.EarthViewer.entities.getById(
        state2.curEntityPickId
      )
      if (window.MSIMEarth.defined(curEntityPick.position)) {
        var cartographic = window.MSIMEarth.Cartographic.fromCartesian(
          curEntityPick.position._value
        )
        var lng = window.MSIMEarth.Math.toDegrees(cartographic.longitude)
        var lat = window.MSIMEarth.Math.toDegrees(cartographic.latitude)
        let entitypath2 = window.EarthPlugn.entity._GetCZMLEntity(
          state2.curDragEntitySouId,
          'MSIMEarthCZMLProcessContainer'
        )
        let enPositionArr2
        if (window.MSIMEarth.defined(entitypath2)) {
          enPositionArr2 = getEititiesPostion(entitypath2)
          // 立即改变位置指令接口
          let params = {
            lng: lng,
            lat: lat,
            alt: parseInt(enPositionArr2[2]),
            pltName: state2.curDragEntitySouId
          }
          setPosition(params).then((res) => {
            setTimeout(() => {
              if (window.EarthViewer.entities.getById(state2.curEntityPickId)) {
                window.EarthViewer.entities.removeById(state2.curEntityPickId)
              }
              state2.curEntityPickId = ''
              state2.curDragEntitySouId = ''
              // 开始拖动完成显示当前实体  还是先不做任何操作
              // entitypath2.show = true
            }, 1500)
            if (res.code == 200) {
              let sendToCommandData = JSON.parse(res.data)
              if (sendToCommandData['IsSendToCommand'] == 'true') {
                let controlResData = JSON.parse(sendToCommandData.data)
                if (controlResData && Object.keys(controlResData).length > 0) {
                  if (controlResData.status == 'successes') {
                    window.sceneAction.systemMessage.labelMessage({
                      sysMessageId: state2.curDragEntitySouId + '_sysMessage',
                      sysMessagePosition: [params.lng, params.lat, params.alt],
                      sysMessageText: '设置平台到指定位置(立刻)指令完成',
                      sysFillColor: store.state.seatModule.getStateInfoColor
                    })
                  } else {
                    if (
                      controlResData['reason'] &&
                      controlResData['reason'].length > 0
                    ) {
                      ElMessage({
                        type: 'error',
                        message: '导调指令失败：' + controlResData['reason']
                      })
                    } else {
                      ElMessage({
                        type: 'error',
                        message:
                          '导调' + controlResData['commandName'] + '指令失败!'
                      })
                    }
                  }
                }
              }
            }
          })
        }
      }
      window.EarthViewer.scene.screenSpaceCameraController.enableRotate = true //解锁相机
    }
  }, window.MSIMEarth.ScreenSpaceEventType.LEFT_UP)
}
//快捷方式-移除鼠标事件
export function removeEventHandler() {
  // 去掉鼠标事件
  if (state2.handlerCommControl1) {
    state2.handlerCommControl1.destroy()
    state2.handlerCommControl1 = null
  }
  if (state2.handlerCommControl2) {
    state2.handlerCommControl2.destroy()
    state2.handlerCommControl2 = null
  }
  // 清除可能存在的双击事件定时器
  if (state2.clickTimer) {
    window.clearTimeout(state2.clickTimer)
    state2.clickTimer = null
  }
  // 鼠标左键单击，拖拽实体重新定位 -- 执行立即改变位置指令
  if (state2.handlerCommControl3) {
    state2.handlerCommControl3.removeInputAction(
      window.MSIMEarth.ScreenSpaceEventType.LEFT_DOWN
    )
    state2.handlerCommControl3.removeInputAction(
      window.MSIMEarth.ScreenSpaceEventType.LEFT_UP
    )
    state2.handlerCommControl3.removeInputAction(
      window.MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE
    )
    state2.handlerCommControl3.destroy()
    state2.handlerCommControl3 = null
  }
}

//传感器状态变更存储
export const storage = {
  set(key, val) {
    seesionStorage.setItem(key, JSON.stringify(val))
  },
  get(key) {
    const value = seesionStorage.getItem(key)
    return value ? JSON.parse(value) : null
  },
  remove(key) {
    seesionStorage.removeItem(key)
  }
}
