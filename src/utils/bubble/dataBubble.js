/*
 * @description: 轨迹回放飞行标牌
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-07-06 18:02:02
 * @LastEditors: root you@example.com
 * @LastEditTime: 2024-08-14 10:22:33
 */
/**
 * @param {Viewer} val.viewer
 * @param {String}
 * @param {String} val.id
 * @return {*}
 */

import { createVNode, render, ref, reactive, toRefs } from 'vue' // 1. 从Vue 3中导入所需的函数
import Label1 from './Label1.vue'
export default class BubbleAirPlane {
  constructor(val) {
    if (window['curDivPointTrajectory' + val.id]) {
      return
    }
    this.content = val.content
    this.viewer = val.viewer
    this.id = val.id
    this.Cesium = val.Cesium
    this.datasource = val.name
    this.title = val.title
    this.lng = val.lng
    this.lat = val.lat
    this.height = val.height
    this.position = ''
    this.speed = ''
    this.forward = ''
    this.heading = val.heading
    this.pitch = val.pitch
    this.roll = val.roll
    this.distance = 0 //弹目距离
    this.lastCartesian = null
    this.lastTime = null
    this.offsetY = val.offsetY ? val.offsetY : 0
    this.nearDistance =
      val.distanceDisplayCondition[0] == undefined
        ? 0
        : val.distanceDisplayCondition[0]
    this.farDistance =
      val.distanceDisplayCondition[1] == undefined
        ? 50000000
        : val.distanceDisplayCondition[1]
    this.handler = undefined

    const props = {
      id: this.id,
      title: this.title,
      content: this.content,
      lng: this.lng,
      lat: this.lat,
      height: this.height,
      speed: this.speed,
      forward: this.forward,
      heading: this.heading,
      pitch: this.pitch,
      roll: this.roll
    }

    this.vmInstance = createVNode(
      Label1,
      toRefs({
        id: ref(this.id),
        title: ref(this.title),
        content: reactive(this.content),
        lng: ref(this.lng),
        lat: ref(this.lat),
        height: ref(this.height),
        speed: ref(this.speed),
        forward: ref(this.forward),
        heading: ref(this.heading),
        pitch: ref(this.pitch),
        roll: ref(this.roll)
      })
    ) // 3. 使用createApp来挂载组件

    this.mountNode = document.createElement('div')
    render(this.vmInstance, this.mountNode)
    // this.mountNode.config.globalProperties.Cesium = this.Cesium
    // this.mountNode.config.globalProperties.viewer = this.viewer

    // this.mountNode.config.globalProperties.windowClose = () => {
    //   this.windowClose()
    // }

    // this.vmInstance.mount(document.createElement('div')) // 将组件挂载到一个元素上

    this.viewer.cesiumWidget.container.appendChild(this.mountNode)
    window['curDivPointTrajectory' + this.id] = this.mountNode
    window['curDivPointTrajectory' + this.id].closeEvent = (e) => {
      this.windowClose()
    }

    this.addPostRender()
  }
  //添加场景事件
  addPostRender() {
    this.viewer.scene.postRender.addEventListener(this.postRenderUpdate, this)

    if (this.handler !== undefined) {
      if (!this.handler.isDestroyed()) {
        this.handler.destroy()
      }
    }
    //去掉单双击的效果
    this.viewer.screenSpaceEventHandler.removeInputAction(
      this.Cesium.ScreenSpaceEventType.LEFT_DOUBLE_CLICK
    )
    this.viewer.screenSpaceEventHandler.removeInputAction(
      this.Cesium.ScreenSpaceEventType.LEFT_CLICK
    )
    this.handler = new this.Cesium.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    )
    this.handler.setInputAction((e) => {
      var pick = this.viewer.scene.pick(e.position)
      if (pick && pick.id) {
        //点击物体的属性都存在 pick.id._id 内部
        if (pick.id._id) {
          if (pick.id._id === this.id) {
            if (!window['curDivPointTrajectory' + this.id]) {
              this.mountNode = document.createElement('div')
              render(this.vmInstance, this.mountNode)

              this.viewer.cesiumWidget.container.appendChild(this.mountNode)
              window['curDivPointTrajectory' + this.id] = this.mountNode
              window['curDivPointTrajectory' + this.id].closeEvent = (e) => {
                this.windowClose()
              }
            }
          }
        }
      }
    }, this.Cesium.ScreenSpaceEventType.LEFT_CLICK)
  }

  //场景渲染事件 实时更新窗口的位置 使其与笛卡尔坐标一致
  postRenderUpdate() {
    if (!this.mountNode || !this.mountNode.style) return
    this.mountNode.style.position = 'absolute'
    let blueId = ''
    // 获取entity
    let entity = this.viewer.entities.getById(this.id)
    if (!entity) {
      let ds = this.viewer.dataSources.getByName(this.datasource)
      if (ds.length > 0) {
        entity = ds[0].entities.getById(this.id)
      }
    }

    // 判断entity实体是否存在在
    if (!entity || !entity.show) {
      this.mountNode.style.display = 'none'
      return
    }
    // 判断实体位置是否存在
    let currentTime = this.viewer.clock.currentTime
    let cartesian = entity.position.getValue(currentTime)
    if (!cartesian) {
      this.mountNode.style.display = 'none'
      return
    }

    // 设置标题
    this.vmInstance.props.title.value = this.title

    // 计算经纬高度
    let curPositionGraphic = this.cartToGraphic(cartesian)
    if (!this.Cesium.defined(curPositionGraphic)) return
    if (
      !curPositionGraphic.lng ||
      !curPositionGraphic.lat ||
      !curPositionGraphic.alt ||
      typeof curPositionGraphic.alt == 'undefined' ||
      typeof curPositionGraphic.lng == 'undefined' ||
      typeof curPositionGraphic.lat == 'undefined'
    ) {
      return
    }
    let lng = Number(curPositionGraphic.lng.toFixed(3))
    if (lng >= 0) {
      lng = lng + '°E'
    } else {
      lng = lng + '°W'
    }
    this.vmInstance.props.lng.value = lng

    let lat = Number(curPositionGraphic.lat.toFixed(3))
    if (lat >= 0) {
      lat = lat + '°N'
    } else {
      lat = lat + '°S'
    }
    this.vmInstance.props.lat.value = lat
    // this.vmInstance.props.height.value =
    //   (curPositionGraphic.alt / 1000).toFixed(1) + 'km'
    this.vmInstance.props.height.value = curPositionGraphic.alt.toFixed(2) + 'm'

    // 计算速度和方向
    if (this.lastCartesian && this.lastTime) {
      // 计算速度
      let lastPositionGraphic = this.cartToGraphic(this.lastCartesian)
      let lastLng = lastPositionGraphic.lng
      let lastLat = lastPositionGraphic.lat
      let curLng = curPositionGraphic.lng
      let curLat = curPositionGraphic.lat
      let seconds =
        (this.Cesium.JulianDate.toDate(currentTime).getTime() -
          this.Cesium.JulianDate.toDate(this.lastTime).getTime()) /
        1000
      let distance = this.getDistance(lastLat, lastLng, curLat, curLng)
      let speed = distance / seconds / 0.514
      if (!window.MSIMEarth.defined(speed) || typeof speed == 'undefined')
        return
      this.vmInstance.props.speed.value = speed.toFixed(2) + '节'

      // 计算方向
      let forward = this.bearing([lastLng, lastLat], [curLng, curLat])
      if (!window.MSIMEarth.defined(forward) || typeof forward == 'undefined')
        return
      this.vmInstance.props.forward.value = forward.toFixed(2) + '°'
    } else {
      this.vmInstance.props.speed.value = ''
      this.vmInstance.props.forward.value = ''
    }

    // 计算hpr
    let orientation = this.getEntityOir(entity)
    //if (typeof orientation == 'undefined' || typeof orientation.roll == 'undefined' || !orientation.heading ||  !orientation.pitch || !orientation.roll || typeof orientation.heading == 'undefined' || typeof orientation.pitch == 'undefined') {
    if (
      typeof orientation == 'undefined' ||
      typeof orientation.roll == 'undefined' ||
      typeof orientation.heading == 'undefined' ||
      typeof orientation.pitch == 'undefined'
    ) {
      return
    }
    this.vmInstance.props.heading.value = orientation.heading.toFixed(3) + '°'
    this.vmInstance.props.pitch.value = orientation.pitch.toFixed(3) + '°'
    this.vmInstance.props.roll.value = orientation.roll.toFixed(3) + '°'

    // 保存本次的实体位置和时间,用于下次计算速度和方向
    this.lastCartesian = cartesian
    this.lastTime = currentTime

    // 设置标牌div的位置
    const canvasHeight = this.viewer.scene.canvas.height
    const windowPosition = new this.Cesium.Cartesian2()
    this.position = entity.position.getValue(this.viewer.clock.currentTime)
    if (!this.position) {
      return
    }
    this.Cesium.SceneTransforms.wgs84ToWindowCoordinates(
      this.viewer.scene,
      this.position,
      windowPosition
    )
    if (this.viewer.scene.canvas.width > 1920)
      this.mountNode.style.top = windowPosition.y - this.offsetY + 'px'
    //canvasHeight - windowPosition.y + 260 + "px";
    else this.mountNode.style.top = windowPosition.y - this.offsetY - 20 + 'px'
    const elWidth = this.mountNode.offsetWidth
    this.mountNode.style.left = windowPosition.x - elWidth / 2 + 'px'
    let camerPosition = this.viewer.camera.position
    let pitch = this.viewer.camera.pitch
    let camePosition = this.cartToGraphic(camerPosition)
    if (camePosition.alt < 0) {
      const lngDegree = this.Cesium.Math.toDegrees(
        this.viewer.camera.positionCartographic.longitude
      )
      const latDegree = this.Cesium.Math.toDegrees(
        this.viewer.camera.positionCartographic.latitude
      )
      const curHeight = this.viewer.camera.positionCartographic.height
      camerPosition = this.Cesium.Cartesian3.fromDegrees(
        lngDegree,
        latDegree,
        curHeight
      )
    }
    let height =
      this.viewer.scene.globe.ellipsoid.cartesianToCartographic(
        camerPosition
      ).height
    height += this.viewer.scene.globe.ellipsoid.maximumRadius

    if (
      !(
        this.Cesium.Cartesian3.distance(camerPosition, this.position) > height
      ) &&
      this.viewer.camera.positionCartographic.height < this.farDistance &&
      this.viewer.camera.positionCartographic.height > this.nearDistance
    ) {
      if (this.Cesium.Math.toDegrees(pitch) > -13) {
        this.mountNode.style.display = 'none'
      } else {
        this.mountNode.style.display = 'block'
      }
    } else {
      this.mountNode.style.display = 'none'
    }
  }

  // 关闭
  windowClose() {
    const elementContains = (parent, child) =>
      parent !== child && parent.contains(child)
    // 事例
    if (window['curDivPointTrajectory' + this.id]) {
      //this.mountNode.remove();
      //this.mountNode.$destroy();
      //let boolean = elementContains(document.querySelector('body'), document.querySelector('box-wrap'));
      //if (boolean) {
      this.viewer.cesiumWidget.container.removeChild(
        window['curDivPointTrajectory' + this.id]
      )
      window['curDivPointTrajectory' + this.id] = null
      this.mountNode = null
      //}
    }
    this.viewer.scene.postRender.removeEventListener(this.postRenderUpdate)
  }

  showControl() {
    // if (!this.vmInstance.$el || !this.vmInstance.$el.style) return;
    if (this.vmInstance) {
      this.vmInstance.remove()
      this.vmInstance.$destroy()
    }
    this.viewer.scene.postRender.removeEventListener(
      this.postRenderUpdate,
      this
    ) //移除事件监听

    if (this.handler !== undefined) {
      if (!this.handler.isDestroyed()) {
        this.handler.destroy()
      }
    }
  }

  coordinateConvert(cartesian3) {
    // 世界坐标转经纬度
    let ellipsoid = this.viewer.scene.globe.ellipsoid
    let cartographic = ellipsoid.cartesianToCartographic(cartesian3)
    let lat = this.Cesium.Math.toDegrees(cartographic.latitude)
    let lng = this.Cesium.Math.toDegrees(cartographic.longitude)
    let alt = cartographic.height
    let cartographic2 = this.Cesium.Cartographic.fromDegrees(
      lng,
      lat,
      agetValuelt
    )
    let newCartesian3 = ellipsoid.cartographicToCartesian(cartographic2)
    return newCartesian3
  }

  cartToGraphic(cartesian3) {
    if (!this.Cesium.defined(cartesian3)) return
    if (typeof cartesian3.x == 'undefined' || !cartesian3.x) return
    if (typeof cartesian3.y == 'undefined' || !cartesian3.y) return
    if (typeof cartesian3.z == 'undefined' || !cartesian3.z) return
    let ellipsoid = this.viewer.scene.globe.ellipsoid
    let cartographic = ellipsoid.cartesianToCartographic(cartesian3)
    let lat = this.Cesium.Math.toDegrees(cartographic.latitude)
    if (typeof lat == 'undefined') return
    let lng = this.Cesium.Math.toDegrees(cartographic.longitude)
    if (typeof lng == 'undefined') return
    let alt = cartographic.height
    if (typeof alt == 'undefined') return
    return { lng: lng, lat: lat, alt: alt }
  }

  // 获取实体朝向角
  getEntityOir(entity) {
    // 获取偏向角
    if (!entity.orientation) {
      return {
        heading: 0,
        pitch: 0,
        roll: 0
      }
    }
    let ori = entity.orientation.getValue(this.viewer.clock.currentTime)
    // 获取位置
    let center = entity.position.getValue(this.viewer.clock.currentTime)
    if (ori && center) {
      // 1、由四元数计算三维旋转矩阵
      var mtx3 = this.Cesium.Matrix3.fromQuaternion(ori)
      // 2、计算四维转换矩阵：
      var mtx4 = this.Cesium.Matrix4.fromRotationTranslation(mtx3, center)
      // 3、计算角度：
      var hpr = this.Cesium.Transforms.fixedFrameToHeadingPitchRoll(mtx4)
      // 获取角度（弧度）
      const headingTemp = hpr.heading
      const pitchTemp = hpr.pitch
      const rollTemp = hpr.roll
      return {
        heading: this.Cesium.Math.toDegrees(headingTemp),
        pitch: this.Cesium.Math.toDegrees(pitchTemp),
        roll: this.Cesium.Math.toDegrees(rollTemp)
      }
    } else {
      return 'undefined'
    }
  }

  // 计算两点间的距离(单位: m)
  getDistance(lat1, lng1, lat2, lng2) {
    let EARTH_RADIUS = 6378137.0
    let PI = Math.PI

    function getRad(d) {
      return (d * PI) / 180.0
    }
    let f = getRad((lat1 + lat2) / 2)
    let g = getRad((lat1 - lat2) / 2)
    let l = getRad((lng1 - lng2) / 2)

    let sg = Math.sin(g)
    let sl = Math.sin(l)
    let sf = Math.sin(f)

    let s, c, w, r, d, h1, h2
    let a = EARTH_RADIUS
    let fl = 1 / 298.257

    sg = sg * sg
    sl = sl * sl
    sf = sf * sf

    s = sg * (1 - sl) + (1 - sf) * sl
    c = (1 - sg) * (1 - sl) + sf * sl

    w = Math.atan(Math.sqrt(s / c))
    r = Math.sqrt(s * c) / w
    d = 2 * w * a
    h1 = (3 * r - 1) / 2 / c
    h2 = (3 * r + 1) / 2 / s

    return d * (1 + fl * (h1 * sf * (1 - sg) - h2 * (1 - sf) * sg))
  }

  // 计算两点方向(正北为0)
  bearing(from, to) {
    let radiansPerDegree = Math.PI / 180.0
    let degreesPerRadian = 180.0 / Math.PI
    let lat1 = from[1] * radiansPerDegree
    let lon1 = from[0] * radiansPerDegree
    let lat2 = to[1] * radiansPerDegree
    let lon2 = to[0] * radiansPerDegree
    let angle = -Math.atan2(
      Math.sin(lon1 - lon2) * Math.cos(lat2),
      Math.cos(lat1) * Math.sin(lat2) -
        Math.sin(lat1) * Math.cos(lat2) * Math.cos(lon1 - lon2)
    )
    if (angle < 0) {
      angle += Math.PI * 2.0
    }
    angle = angle * degreesPerRadian
    return angle
  }
}
