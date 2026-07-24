//模拟器导调指令配置
import store from '@/store/index'
import emitter from '@/utils/eventbus'

import { showSysMessage, worldPosToGraphic } from '@/utils/mapTools'
import { ElMessage } from 'element-plus'
import {
  ref,
  onMounted,
  reactive,
  watch,
  getCurrentInstance,
  defineEmits
} from 'vue'
let state2 = {
  handlerCommControl: null,
  clickTimer: null //单击事件的定时器
}
let options = {}
const instance = {}
//管理运控指令
export function managerControlChange(value) {
  if (value) {
    clearSimModelCommand()
    setTimeout(() => {
      let commandControlObj = {
        isShow: true,
        simModelCommandFormData: {
          command: '运控',
          targetName: store.state.sceneModule.currentNode.code, //实体名称
          side: 'red', //阵营
          orderTypeRadio: '', //演练命令类型
          isChangeOrderRadio: '', //是否修改演练命令
          bdstNums: 1, //实体数量
          managerOrderRadio: '', //命令
          wtype: store.state.sceneModule.wtypeObj['运控']
        }
      }
      emitter.emit('showSimModelCommandControl', commandControlObj)
    }, 400)
  }
}
//集合指令
export function gatherAroundChange(value) {
  if (value) {
    clearSimModelCommand()
    showMouseCurLngLat((position) => {
      let commandControlObj = {
        //集合初始化参数设置
        isShow: true,
        simModelCommandFormData: {
          command: '集合',
          targetName: store.state.sceneModule.currentNode.code, //实体名称
          longitude: position.lng, //集合点经度
          latitude: position.lat, //集合点纬度
          height: '2000', //集合点高度
          changeSpeed: '100', //速度
          headingAngle: '0', //方向
          bdstNums: 1, //实体数量
          bisGather: 1, //集合命令
          side: 'red', //阵营
          wtype: store.state.sceneModule.wtypeObj['集合']
        }
      }
      emitter.emit('showSimModelCommandControl', commandControlObj)
    })
  } else {
  }
}
//显示当前鼠标经度纬度
export function showMouseCurLngLat(callback) {
  let entityLabel = window.EarthViewer.entities.add({
    name: '当前经纬度',
    id: '当前经纬度',
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
      let curPos = worldPosToGraphic(cartesian)
      window.EarthViewer._container.style.cursor = 'crosshair'
      entityLabel.position = cartesian
      entityLabel.label.show = true
      entityLabel.label.text = `请在地图上拾取集合位置,左击确认完成\nlng:${curPos.lng.toFixed(
        6
      )}\nlat:${curPos.lat.toFixed(6)}`
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
        entityLabel.label.show = false
        // 去掉鼠标事件
        if (state2.handlerCommControl) {
          state2.handlerCommControl.destroy()
          state2.handlerCommControl = null
        }
        //移除label提示框
        window.EarthViewer.entities.removeById('当前经纬度')
        // 位置信息
        var cartographic =
          window.MSIMEarth.Cartographic.fromCartesian(cartesianClick)
        // store.commit('setCurMouseLngLat', {
        //   lng: window.MSIMEarth.Math.toDegrees(cartographic.longitude),
        //   lat: window.MSIMEarth.Math.toDegrees(cartographic.latitude),
        //   height: cartographic.height,
        // })

        window.EarthViewer._container.style.cursor = 'default'
        callback({
          lng: window.MSIMEarth.Math.toDegrees(cartographic.longitude).toFixed(
            6
          ),
          lat: window.MSIMEarth.Math.toDegrees(cartographic.latitude).toFixed(6)
        })
      }
    }, 300) // 300毫秒内没有第二次点击则认为是单击
  }, window.MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)
}
// 清空指令
export const clearSimModelCommand = (commandControlRadio) => {
  if (state2.handlerCommControl) {
    // 去掉鼠标事件
    if (state2.handlerCommControl) {
      state2.handlerCommControl.destroy()
      state2.handlerCommControl = null
    }
  }
  //移除label提示框
  window.EarthViewer.entities.removeById('当前经纬度')
  let commandControlObj = {
    isShow: false,
    commandFormData: {}
  }
  emitter.emit('showSimModelCommandControl', commandControlObj)
}
//机场天气导调
export function airPortWeatherChange(value) {
  if (value) {
    clearSimModelCommand()
    setTimeout(() => {
      let commandControlObj = {
        isShow: true,
        simModelCommandFormData: {
          command: '机场气象',
          WeatherEnum: 0, //天气现象
          visible: 400000, //能见度
          angle: 0, //风向
          speed: 0, //风速
          cloud: 0, //云量
          wbottomCloud: 3000, //云底高
          wtopCloud: 4000, //云顶高
          weatherState: '5',
          targetName: store.state.sceneModule.currentNode.code, //实体名称
          typesRain: 0,
          typesSnow: 0,
          typesCloud: 0,
          winCloud: 0,
          woutCloud: 0,
          wtype: store.state.sceneModule.wtypeObj['气象'],
          side: 'red',
          stateTime: ''
        }
      }
      emitter.emit('showSimModelCommandControl', commandControlObj)
    }, 400)
  } else {
  }
}
//海洋海况导调
export function oceanChange(value) {
  if (value) {
    clearSimModelCommand()
    setTimeout(() => {
      let commandControlObj = {
        isShow: true,
        simModelCommandFormData: {
          command: '海洋海况',
          seaState: '0' //海况
        }
      }
      emitter.emit('showSimModelCommandControl', commandControlObj)
    }, 400)
  } else {
  }
}
