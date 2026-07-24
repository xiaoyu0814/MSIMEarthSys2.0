import store from '@/store'
import emitter from '@/utils/eventbus'
import { moveCamera } from '@/service/directingAdjusting'
import { bubbleLabel } from '@/utils/bubble/bubble'
import Bubble1 from '@/utils/bubble/dataBubble2'
import { formatDegree } from '@/utils/mapTools'
import {
  configPlateformCHNName,
  configPlateformCHNName2
} from '@/utils/earthPlugin/ThirdParty/eventSource/event/earthEvent/czml/czmlRenderConfig/modelConfig/modelMatching.js'

/**
 * 地图鼠标相关事件
 * @param {*} options
 */
function MouseEventsController(options) {
  this.earth = options.earth
  this.viewer = options.viewer
  this.handler = new this.earth.ScreenSpaceEventHandler(
    this.viewer.scene.canvas
  )
}

/**
 * 鼠标左键、鼠标中键、鼠标右键、鼠标移动 相关事件
 *
 * @param {string} options.id  id-必填参数  eg:
 */
MouseEventsController.prototype.loadMouseEvents = function (options) {
  let earth = this.earth
  let viewer = this.viewer

  let handler = this.handler
  let preNum = 0
  //监听单击事件
  let curClickSatellitId = '',
    currentSatellitEntity = null
  let currentairportEntity = null
  handler.setInputAction(function (movement) {
    // let cartesian = viewer.scene.pickPosition(movement.position)
    let cartesian = viewer.scene.camera.pickEllipsoid(
      movement.position,
      viewer.scene.globe.ellipsoid
    )
    var picked = viewer.scene.pick(movement.position)
    if (earth.defined(cartesian)) {
      var cartographic = earth.Cartographic.fromCartesian(cartesian)
      var lat = earth.Math.toDegrees(cartographic.latitude)
      var lng = earth.Math.toDegrees(cartographic.longitude)
      var alt = cartographic.height
      let cameraInfo = {
        lng: lng,
        lat: lat,
        alt: alt < 0 ? 0 : parseInt(alt),
        heading: viewer.camera.heading,
        pitch: viewer.camera.pitch,
        roll: viewer.camera.roll
      }
      if (window.getCameraInfo) {
        console.log('cameraInfo', cameraInfo)
        window.getCameraInfo(cameraInfo)
      }
      // let pick = viewer.scene.pick(movement.position)
      if (earth.defined(picked) && picked.id) {
        if (picked.id.name == 'weatherAnalysis') {
          currentairportEntity = picked.id
          let name = currentairportEntity.id ? currentairportEntity.id : ''
          let weather = currentairportEntity.properties.weather
            ? currentairportEntity.properties.weather
            : ''
          let temperature = currentairportEntity.properties.temperature
            ? currentairportEntity.properties.temperature
            : ''
          let description = currentairportEntity.properties.description
            ? currentairportEntity.properties.description
            : ''

          let aa = {
            title: name,
            weather: weather,
            temperature: temperature,
            obj: '机场',
            description: description
          }
          aa.position = [lng.toFixed(2), lat.toFixed(2)]
          store.state.sceneModule.weatherAnalysis = aa
          window.EarthViewer.scene.postRender.removeEventListener(
            window.postRender1
          )
          for (
            let i =
              document.querySelectorAll('.weatherAnalysis-container').length -
              1;
            i > -1;
            i--
          ) {
            document.querySelectorAll('.weatherAnalysis-container')[i].remove()
          }
          let val = {
            Cesium: window.MSIMEarth,
            viewer: window.EarthViewer,
            position: [lng, lat],
            height: alt,
            distanceDisplayCondition: [0, 5000],
            offsetX: 75,
            offsetY: 75,
            div: 'style2'
          }
          bubbleLabel(val)
        } else if (
          picked.id.name == 'BB_beidou' ||
          picked.id.name == 'BB_A51'
        ) {
          let infoss = {
            name:
              picked.id && picked.id.description && picked.id.description._value
                ? picked.id.description._value
                : ''
          }
          emitter.emit('Showsatellite', true)
          store.commit('setSatelliteInfo', infoss)
        } else if (
          picked.id._model ||
          picked.id.label ||
          picked.id._billboard
        ) {
          if (
            picked.id._id &&
            typeof picked.id._id == 'string' &&
            picked.id._id.indexOf('satellit') > -1
          ) {
            //移除上一次的弹框
            if (curClickSatellitId) {
              if (window['curDivPoint' + curClickSatellitId]) {
                window['curDivPoint' + curClickSatellitId].closeEvent()
              }
              // currentSatellitEntity.label.text.setValue(text)
            }
            curClickSatellitId = picked.id._id
            currentSatellitEntity = picked.id
            //创建当前点击卫星的弹框
            if (!window['curDivPoint' + picked.id._id]) {
              let text = currentSatellitEntity.properties.name._value
              new Bubble1({
                content: [
                  { name: '经度', value: '131' },
                  { name: '纬度', value: '31' },
                  { name: '高度', value: '10000' }
                ],
                viewer: viewer,
                id: picked.id._id,
                Cesium: earth,
                name: 'simple',
                title: '',
                offsetY: -150,
                offsetX: 70,
                distanceDisplayCondition: [100, 100000000000],
                div: 'planDetail',
                rgb: [57, 173, 209], //红、蓝
                fontColorRgb: store.getters.getBubbleFontColor, // 字体颜色
                isCloseClick: false
              })
            }
          } else {
            let params = {
              entityID: ''
            }
            if (picked.id.properties && picked.id.properties.id) {
              //点击天气图标
              params.entityID = picked.id.properties.id.getValue()
            } else {
              let infors = {
                code: picked.id._id ? picked.id._id : '',
                name:
                  picked.id &&
                  picked.id.description &&
                  picked.id.description._value
                    ? picked.id.description._value
                    : '',
                type:
                  picked.id &&
                  picked.id.properties &&
                  picked.id.properties._airplaneAction &&
                  picked.id.properties._airplaneAction._value &&
                  picked.id.properties._airplaneAction._value.type
                    ? picked.id.properties._airplaneAction._value.type
                    : ''
              }
              store.commit('setTargetInfo', infors)
              params.entityID = infors.code
            }
          }
        }
        // let aa = threat[zzIndex]
        // aa.position = [lng.toFixed(2), lat.toFixed(2)]
        // store.state.sceneModule.threatTrendAnalysis = aa
        // console.log(store.state.sceneModule.threatTrendAnalysis)
        // zzIndex = zzIndex >= 2 ? 0 : zzIndex + 1
        // viewer.scene.postRender.removeEventListener(
        //   window.postRender1
        // )
        // for (
        //   let i =
        //     document.querySelectorAll('.threatTrendAnalysis-container')
        //       .length - 1;
        //   i > -1;
        //   i--
        // ) {
        //   document
        //     .querySelectorAll('.threatTrendAnalysis-container')
        //     [i].remove()
        // }
        // let val = {
        //   Cesium: earth,
        //   viewer: viewer,
        //   position: [lng, lat],
        //   height: alt,
        //   distanceDisplayCondition: [0, 5000],
        //   title: 'jij',
        //   id: 'jij',
        //   content: 'jij',
        //   offsetX: -75,
        //   offsetY: 75,
        //   div: 'style1'
        // }
        // divLabel(val)
      } else {
        if (currentSatellitEntity) {
          if (currentSatellitEntity) {
            window['curDivPoint' + curClickSatellitId].closeEvent()
          }
          curClickSatellitId = ''
          currentSatellitEntity = null
        }
      }
      // viewer.entities.add({
      //   position: earth.Cartesian3.fromDegrees(lng, lat, alt),
      //   point: {
      //     pixelSize: 10,
      //     color: earth.Color.RED
      //   }
      // })
    } else {
      if (currentSatellitEntity) {
        if (currentSatellitEntity) {
          window['curDivPoint' + curClickSatellitId].closeEvent()
        }
        curClickSatellitId = ''
        currentSatellitEntity = null
      }
    }
  }, earth.ScreenSpaceEventType.LEFT_CLICK)
  //监听右键单击事件
  handler.setInputAction(function (movement) {
    let picked = viewer.scene.pick(movement.position)
    let side = localStorage.getItem('side')
    switch (side) {
      case 'red_zhkz':
      case 'admin_cjpg':
      case 'admin':
      case 'admin_ts':
      case 'red_ts':
      case 'blue_ts':
      case 'blue_zhkz':
        if (earth.defined(picked) && picked.id) {
          if (picked.id._model || picked.id.billboard) {
            // 全局系统配置是否开启 鼠标右键提示消息
            if (store.state.sceneModule.systemConfig.isMouseInteractive) {
              let cartesian = viewer.scene.pickPosition(movement.position)
              if (earth.defined(cartesian)) {
                var cartographic = earth.Cartographic.fromCartesian(cartesian)
                var lat = earth.Math.toDegrees(cartographic.latitude)
                var lng = earth.Math.toDegrees(cartographic.longitude)

                // 操作配置
                // window.sceneAction.systemMessage.labelMessage({
                //   sysMessageId: 'config_sysMessage',
                //   sysMessagePosition: [lng, lat],
                //   sysMessageText: '请配置当前平台'
                // })
              }
            }
            let weatherTypeInfor =
              store.state.sceneModule.weatherTypeInfor[picked.id._id]
            let msg = weatherTypeInfor ? weatherTypeInfor.msg : ''
            let entitName =
              picked.id &&
              picked.id.description &&
              picked.id.description.getValue()
                ? picked.id.description.getValue()
                : ''
            if (entitName === '') {
              entitName =
                picked.id &&
                picked.id.label &&
                picked.id.label.text &&
                picked.id.label.text._value
                  ? picked.id.label.text._value
                  : ''
              if (!entitName) {
                entitName =
                  picked.id.properties && picked.id.properties.labelName
                    ? picked.id.properties.labelName.getValue()
                    : ''
              }
            }
            //存储当前点击飞机的状态信息
            // 获取中文名称后续要从实体本身获取，因为实体已经存在于场景不需要再去匹配，只需要在对应的实体获取即可，例如picked.id.text._value,由于label是用labelcollection构建，所以需要到对应collection获取。
            let chineseName = (
              configPlateformCHNName(picked.id._id) == picked.id._id
                ? configPlateformCHNName2(picked.id._id)
                : configPlateformCHNName(picked.id._id)
            )?.name
            store.commit('setCurrentFlyType', {
              name: entitName,
              entityId: picked.id._id,
              type: msg,
              // chineseName: configPlateformCHNName(picked.id._id)
              chineseName: chineseName
            })
            //存储飞机高度
            if (
              picked.id._properties._airplaneAction &&
              picked.id._properties._airplaneAction._value.altitute
            ) {
              store.commit('setOnePlate', {
                name: picked.id._id,
                height: picked.id._properties._airplaneAction._value.altitute
              })
            }
            // emitter.emit('showConfigPanel', true)
            // 取消浏览器默认右击事件
            document.oncontextmenu = function (e) {
              e.preventDefault()
            }
            let obj = {
              x: movement.position.x,
              y: movement.position.y,
              show: true
            }
            emitter.emit('setRightClick', true)
            emitter.emit('showViewContextMenu', obj)
            //等DOM显示后注册上监听事件
            const params = {
              code: picked.id._id ? picked.id._id : '',
              side:
                picked.id.properties &&
                picked.id.properties._airplaneAction &&
                picked.id.properties._airplaneAction._value &&
                picked.id.properties._airplaneAction._value.side
                  ? picked.id.properties._airplaneAction._value.side
                  : '',
              type:
                picked.id.properties &&
                picked.id.properties._airplaneAction &&
                picked.id.properties._airplaneAction._value &&
                picked.id.properties._airplaneAction._value.type
                  ? picked.id.properties._airplaneAction._value.type
                  : ''
            }
            setTimeout(() => {
              emitter.emit('handleNodeClick1', {
                clickable: true,
                code: params.code,
                side: params.side,
                type: params.type
              })
            }, 300)

            // // 全局系统配置是否开启 鼠标左键提示消息
            // let infoParams = {
            //   entityID: ''
            // }
            // if (picked.id.properties && picked.id.properties.id) {
            //   //点击天气图标
            //   infoParams.entityID = picked.id.properties.id.getValue()
            // } else {
            //   infoParams.entityID = params.code
            // }
            // moveCamera(infoParams).then((res) => {
            //   if (res.code == 200) {
            //     // 全局系统配置是否开启 鼠标左键提示消息
            //     if (
            //       store.state.sceneModule.systemConfig &&
            //         store.state.sceneModule.systemConfig.isMouseInteractive
            //         ? store.state.sceneModule.systemConfig.isMouseInteractive
            //         : true
            //     ) {
            //       if (!store.state.sceneModule.relatedRightClickConfig) {
            //         //和UE交互设置相机视角  定位
            //         window.sceneAction.systemMessage.labelMessage({
            //           sysMessageId: 'moveCamera_sysMessage',
            //           sysMessagePosition: [lng, lat],
            //           sysMessageText: '仿真目标空间定位'
            //         })
            //       }
            //     }
            //   }
            // })
          } else if (picked.id) {
            console.log('拾取id', picked.id)
          }
        }
        break
      case 'red_qb':
      case 'blue_qb':
        let qb_obj = {
          position: movement,
          entities: null,
          isShow: false
        }
        emitter.emit('setIdentShow', qb_obj)
        if (earth.defined(picked) && picked.id) {
          if (picked.id._model || picked.id.label) {
            let qb_obj = {
              position: movement,
              entities: picked,
              isShow: true
            }
            emitter.emit('setIdentShow', qb_obj)
            store.commit('setSname', picked.id._id ? picked.id._id : '')
            let entitName =
              picked.id &&
              picked.id.description &&
              picked.id.description.getValue()
                ? picked.id.description.getValue()
                : ''
            if (entitName === '') {
              entitName =
                picked.id &&
                picked.id.label &&
                picked.id.label.text &&
                picked.id.label.text._value
                  ? picked.id.label.text._value
                  : ''
              if (!entitName) {
                entitName =
                  picked.id.properties && picked.id.properties.labelName
                    ? picked.id.properties.labelName.getValue()
                    : ''
              }
            }
            store.commit('setCurrentFlyType', {
              name: entitName,
              entityId: picked.id._id,
              type: ''
            })

            let sside = ''
            if (
              picked.id.properties &&
              picked.id.properties['airplaneAction'] &&
              picked.id.properties['airplaneAction'].getValue().side
            ) {
              sside = picked.id.properties['airplaneAction'].getValue().side
            }
            store.commit('setSside', sside)
          }
        }
        break
      default:
        break
    }
    if (picked && picked.id && picked.id['_id'])
      store.commit('setCurrentEntityId', picked.id._id)
  }, earth.ScreenSpaceEventType.RIGHT_CLICK)
  //监听中键单击事件
  handler.setInputAction(function (movement) {
    let picked = viewer.scene.pick(movement.position)
    let lat, lng, cartographic
    if (earth.defined(picked) && picked.id) {
      if (picked.id._model || picked.id.billboard) {
        // 全局系统配置是否开启 鼠标左键提示消息
        const params = {
          code: picked.id._id ? picked.id._id : ''
        }
        let infoParams = {
          entityID: '',
          height: 0,
          itemName: '',
          itemTypeCode: 'aircraft',
          lat: 0,
          lng: 0,
          planName: '',
          runSeconds: 0
        }
        if (picked.id.properties && picked.id.properties.id) {
          //点击天气图标
          infoParams.entityID = picked.id.properties.id.getValue()
        } else {
          infoParams.entityID = params.code
        }
        let cartesian = viewer.scene.pickPosition(movement.position)
        if (earth.defined(cartesian)) {
          cartographic = earth.Cartographic.fromCartesian(cartesian)
          lat = earth.Math.toDegrees(cartographic.latitude)
          lng = earth.Math.toDegrees(cartographic.longitude)
        }
        console.log('infoParams', infoParams)
        moveCamera(infoParams)
          .then((res) => {
            // console.log(res)
            if (res.code == 200) {
              //和UE交互设置相机视角  定位
              window.sceneAction.systemMessage.labelMessage({
                sysMessageId: 'moveCamera_sysMessage',
                sysMessagePosition: [lng, lat],
                sysMessageText: '仿真目标空间定位',
                sysFillColor: [186 / 255, 123 / 255, 213 / 255, 1]
              })
            }
          })
          .catch((err) => {
            console.log('导调UE定位错误', err)
          })
      }
    }
  }, earth.ScreenSpaceEventType.MIDDLE_CLICK)
  // 移动事件
  let curMovePickedObject = null
  handler.setInputAction(function (movement) {
    // 全局系统配置是否开启 鼠标移动放大效果
    if (store.state.sceneModule.systemConfig.isMouseInteractive) {
      let pickedFeatureStart = viewer.scene.pick(movement.startPosition)
      let pickedObject = viewer.scene.pick(movement.endPosition)
      let cartesian = viewer.scene.pickPosition(movement.endPosition)
      if (
        viewer.scene.pickPositionSupported &&
        earth.defined(pickedObject) &&
        pickedObject.id &&
        (pickedObject.primitive instanceof window.MSIMEarth.Model ||
          pickedObject.primitive instanceof window.MSIMEarth.Billboard)
      ) {
        if (curMovePickedObject && curMovePickedObject == pickedObject) return //如果是相同实体执行return
        //过滤掉卫星模型
        if (
          pickedObject.id &&
          pickedObject.id._id &&
          typeof pickedObject.id._id == 'string' &&
          (pickedObject.id._id.indexOf('satellit') > -1 ||
            pickedObject.id._id.indexOf('_DragEntity') > -1)
        ) {
          return
        }
        //恢复上一个缓存下的实体对象scale
        if (curMovePickedObject) {
          changeEntityScale(viewer, earth, curMovePickedObject, false)
        }
        curMovePickedObject = pickedObject
        //当前实体对象scale放大
        changeEntityScale(viewer, earth, pickedObject, true)
      } else {
        if (curMovePickedObject) {
          //恢复上一个缓存下的实体对象scale
          changeEntityScale(viewer, earth, curMovePickedObject, false)
          curMovePickedObject = null
        }
      }
    }
    /*
     *pickedObject:实体对象;isScale:(true:放大;false:缩小)
     */
    function changeEntityScale(viewer, earth, pickedObject, isScale) {
      let side = localStorage.getItem('side')
      if (isScale) {
        if (pickedObject.primitive instanceof window.MSIMEarth.Model) {
          if (pickedObject.id._model || pickedObject.id.label) {
            // 红蓝 动态MB
            if (
              pickedObject.id.properties &&
              earth.defined(pickedObject.id.properties._airplaneAction)
            ) {
              viewer._container.style.cursor = 'pointer'
              if (
                side == 'admin' ||
                side == 'red_qb' ||
                side == 'red' ||
                side == 'blue' ||
                side == 'blue_qb' ||
                side == 'red_bz' ||
                side == 'blue_bz' ||
                side == 'red_zhkz' ||
                side == 'blue_zhkz' ||
                side == 'admin_cjpg' ||
                side == 'red_ts' ||
                side == 'blue_ts' ||
                side == 'admin_ts' ||
                side == 'undefined'
              ) {
                // 白方 控制席
                if (pickedObject.id._model.minimumPixelSize) {
                  pickedObject.id._model.minimumPixelSize._value += 25
                }
              } else {
                // 红方 指挥制
                pickedObject.id._model.minimumPixelSize = 90
              }
              // let cartographic = earth.Cartographic.fromCartesian(cartesian)
            }
          }
        } else if (
          pickedObject.primitive instanceof window.MSIMEarth.Billboard
        ) {
          viewer._container.style.cursor = 'pointer'
          if (pickedObject.id._billboard && pickedObject.id._billboard.scale) {
            pickedObject.id._billboard.scale += 0.5
          }
        }
      } else {
        viewer._container.style.cursor = 'default'
        if (
          pickedObject.primitive &&
          pickedObject.primitive instanceof window.MSIMEarth.Billboard
        ) {
          if (
            pickedObject.id &&
            pickedObject.id._billboard &&
            pickedObject.id._billboard.scale
          ) {
            pickedObject.id._billboard.scale -= 0.5
          }
        } else if (
          pickedObject.primitive &&
          pickedObject.primitive instanceof window.MSIMEarth.Model
        ) {
          if (
            pickedObject.id &&
            pickedObject.id._model &&
            (side == 'admin' ||
              side == 'red_qb' ||
              side == 'blue_qb' ||
              side == 'red' ||
              side == 'blue' ||
              side == 'red_bz' ||
              side == 'blue_bz' ||
              side == 'red_zhkz' ||
              side == 'blue_zhkz' ||
              side == 'admin_cjpg' ||
              side == 'red_ts' ||
              side == 'blue_ts' ||
              side == 'admin_ts' ||
              side == 'undefined')
          ) {
            if (pickedObject.id._model.minimumPixelSize) {
              pickedObject.id._model.minimumPixelSize._value -= 25
            }
          } else {
            pickedObject.id._model.minimumPixelSize = 50
          }
        }
      }
    }
    //动态经纬度视角高度
    var lngLatInfo = document.getElementById('lng-lat-info')
    //具体事件的实现
    var ellipsoid = viewer.scene.globe.ellipsoid
    // //捕获椭球体，将笛卡尔二维平面坐标转为椭球体的笛卡尔三维坐标，返回球体表面的点
    // var cartesian = viewer.camera.pickEllipsoid(
    //   movement.endPosition,
    //   ellipsoid
    // )
    var ray = viewer.camera.getPickRay(movement.endPosition)
    var cartesian = viewer.scene.globe.pick(ray, viewer.scene)
    if (cartesian) {
      //将笛卡尔三维坐标转为地图坐标（弧度）
      var cartographic =
        viewer.scene.globe.ellipsoid.cartesianToCartographic(cartesian)
      //将地图坐标（弧度）转为十进制的度数
      var lat_String = earth.Math.toDegrees(cartographic.latitude).toFixed(4)
      var log_String = earth.Math.toDegrees(cartographic.longitude).toFixed(4)
      // var alti_String = (cartographic.height / 1000).toFixed(2)
      // 右下角经纬度
      let lngMarker = log_String < 0 ? 'W&nbsp;&nbsp' : 'E&nbsp;&nbsp'
      let latMarker = lat_String < 0 ? 'S&nbsp;&nbsp' : 'N&nbsp;&nbsp'
      // 切换度分秒
      if (store.state.sceneModule.systemConfig.isSwitchDegMinsSconds) {
        // lngLatInfo.innerHTML =
        //   formatDegree(Number(log_String)) +
        //   lngMarker +
        //   formatDegree(Number(lat_String)) +
        //   latMarker +
        //   alti_String +
        //   'km'
        lngLatInfo.innerHTML =
          formatDegree(Number(log_String)) +
          lngMarker +
          formatDegree(Number(lat_String)) +
          latMarker
      } else {
        // lngLatInfo.innerHTML =
        //   log_String +
        //   '° ' +
        //   lngMarker +
        //   lat_String +
        //   '° ' +
        //   latMarker +
        //   alti_String +
        //   'km'
        lngLatInfo.innerHTML =
          log_String + '° ' + lngMarker + lat_String + '° ' + latMarker
      }
    }
  }, earth.ScreenSpaceEventType.MOUSE_MOVE)
}

/**
 * 相机移动 视点高度
 */
MouseEventsController.prototype.viewpointHeight = function () {
  let earth = this.earth
  let viewer = this.viewer
  viewer.camera.moveEnd.addEventListener(() => {
    var cameraHeight = document.getElementById('camera-height')
    const camera = viewer.camera
    let height = camera.positionCartographic.height / 1000
    // cameraHeight.innerHTML = 'H:&nbsp;' + height.toFixed(2) + 'km'
    cameraHeight.innerHTML = '&nbsp;' + height.toFixed(2) + 'km'
  })
}
export default MouseEventsController
