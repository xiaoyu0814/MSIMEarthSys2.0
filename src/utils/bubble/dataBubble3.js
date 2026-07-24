/**
 * @param {Viewer} val.viewer
 * @param {String} 指令 变更平台高度-成功之后显示 上升或下降 高度
 *                 指令 变更平台速度-成功之后显示 快或慢 速度
 * @param {String} val.id
 * @return {*}
 */
import { createVNode, render, ref, reactive, toRefs } from 'vue'
import Label1 from './bubble1.vue'
export default class Bubble3 {
  constructor(val) {
    if (window['curDivPoint_commContr_' + val.id]) {
      return
    }
    this.entityMethod = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
    this.moreAndLess = val.moreAndLess
    this.content = val.content
    this.viewer = val.viewer
    this.id = val.id
    this.Cesium = val.Cesium
    this.datasource = val.name
    this.title = val.title
    this.offsetY = val.offsetY ? val.offsetY : 0
    this.nearDistance =
      val.distanceDisplayCondition[0] == undefined
        ? 0
        : val.distanceDisplayCondition[0]
    this.farDistance =
      val.distanceDisplayCondition[1] == undefined
        ? 50000000
        : val.distanceDisplayCondition[1]
    if (val.div == 'style') {
      this.vmInstance = createVNode(
        Label1,
        toRefs({
          id: ref(this.id),
          title: ref(this.title),
          content: reactive(this.content)
        })
        //   {
        //   id: this.id,
        //   title: this.title,
        //   content: this.content
        // }
      ) // 3. 使用createApp来挂载组件
    }

    this.mountNode = document.createElement('div')
    render(this.vmInstance, this.mountNode)
    // this.mountNode.config.globalProperties.Cesium = this.Cesium
    // this.mountNode.config.globalProperties.viewer = this.viewer

    // this.mountNode.config.globalProperties.windowClose = () => {
    //   this.windowClose()
    // }

    // this.vmInstance.mount(document.createElement('div')) // 将组件挂载到一个元素上

    this.viewer.cesiumWidget.container.appendChild(this.mountNode)
    window['curDivPoint_commContr_' + this.id] = this.mountNode
    window['curDivPoint_commContr_' + this.id].closeEvent = (e) => {
      this.windowClose(val.viewer)
    }

    this.addPostRender()
  }
  //添加场景事件
  addPostRender() {
    this.viewer.scene.postRender.addEventListener(this.postRenderUpdate, this)
  }

  //场景渲染事件 实时更新窗口的位置 使其与笛卡尔坐标一致
  postRenderUpdate() {
    if (!this.mountNode || !this.mountNode.style) return
    this.mountNode.style.position = 'absolute'
    let blueId = ''
    // 获取entity
    let entity = this.viewer.entities.getById(this.id)
    if (!entity) {
      // let ds = this.viewer.dataSources.getByName(this.datasource)
      // if (ds.length > 0) {
      //   entity = ds[0].entities.getById(this.id)
      // }
      entity = this.entityMethod.getCZMLEntity(
        this.datasource,
        'MSIMEarthCZMLProcessContainer'
      )
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
    // this.vmInstance.props.title.value = this.title

    // 计算经纬高度
    let curPositionGraphic = this.cartToGraphic(cartesian)
    if (
      !curPositionGraphic ||
      !curPositionGraphic.lng ||
      !curPositionGraphic.lat ||
      !curPositionGraphic.alt ||
      typeof curPositionGraphic.alt == 'undefined' ||
      typeof curPositionGraphic.lng == 'undefined' ||
      typeof curPositionGraphic.lat == 'undefined'
    ) {
      // console.log(curPositionGraphic)
      return
    }
    // 变更平台高度[3] 判断高度是否到达目标高度[2] 到达关闭
    if (this.moreAndLess == 'more') {
      if (
        this.vmInstance.props.content.value[3].value >=
        this.vmInstance.props.content.value[2].value
      ) {
        this.windowClose(this.viewer)
        return
      }
    } else {
      if (
        this.vmInstance.props.content.value[3].value <=
        this.vmInstance.props.content.value[2].value
      ) {
        this.windowClose(this.viewer)
        return
      }
    }

    let lng = Number(curPositionGraphic.lng.toFixed(3))
    if (this.vmInstance.props.content.value[1].name == '经度') {
      this.vmInstance.props.content.value[1].value = lng
    }
    if (lng >= 0) {
      lng = lng + '°E'
    } else {
      lng = lng + '°W'
    }

    let lat = Number(curPositionGraphic.lat.toFixed(3))
    if (this.vmInstance.props.content.value[2].name == '纬度') {
      this.vmInstance.props.content.value[2].value = lat
    }
    if (this.vmInstance.props.content.value[3].name == '高度') {
      this.vmInstance.props.content.value[3].value =
        (curPositionGraphic.alt / 1000).toFixed(1) + 'km'
    }
    // 1 2 3  经纬高 暂时不显示
    if (this.vmInstance.props.content.value[3].name == '变更') {
      if (
        Number(this.vmInstance.props.content.value[2].value) >
        Number(this.vmInstance.props.content.value[1].value)
      ) {
        this.vmInstance.props.content.value[3].value =
          Number(this.vmInstance.props.content.value[3].value) + 2
      } else {
        this.vmInstance.props.content.value[3].value =
          Number(this.vmInstance.props.content.value[3].value) - 2
      }
    }
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
    else this.mountNode.style.top = windowPosition.y - this.offsetY + 'px'
    const elWidth = this.mountNode.offsetWidth
    this.mountNode.style.left = windowPosition.x - elWidth / 2 + 'px'
    let camerPosition = this.viewer.camera.position
    let pitch = this.viewer.camera.pitch
    let camePosition = this.cartToGraphic(camerPosition)
    if (camePosition.alt < 0) {
      const lngDegree = Cesium.Math.toDegrees(
        viewer.camera.positionCartographic.longitude
      )
      const latDegree = Cesium.Math.toDegrees(
        viewer.camera.positionCartographic.latitude
      )
      const curHeight = viewer.camera.positionCartographic.height
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
      this.viewer.camera.positionCartographic.height > this.farDistance &&
      this.viewer.camera.positionCartographic.height < this.nearDistance
    ) {
      this.mountNode.style.display = 'none'
    }
  }

  // 关闭
  windowClose() {
    const elementContains = (parent, child) =>
      parent !== child && parent.contains(child)
    // 事例
    if (window['curDivPoint_commContr_' + this.id]) {
      //this.mountNode.remove();
      //this.mountNode.$destroy();
      //let boolean = elementContains(document.querySelector('body'), document.querySelector('box-wrap'));
      //if (boolean) {
      this.viewer.cesiumWidget.container.removeChild(
        window['curDivPoint_commContr_' + this.id]
      )
      window['curDivPoint_commContr_' + this.id] = null
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
    let ori = entity.orientation.getValue(viewer.clock.currentTime)
    // 获取位置
    let center = entity.position.getValue(viewer.clock.currentTime)
    if (ori && center) {
      // 1、由四元数计算三维旋转矩阵
      var mtx3 = Cesium.Matrix3.fromQuaternion(ori)
      // 2、计算四维转换矩阵：
      var mtx4 = Cesium.Matrix4.fromRotationTranslation(mtx3, center)
      // 3、计算角度：
      var hpr = Cesium.Transforms.fixedFrameToHeadingPitchRoll(mtx4)
      // 获取角度（弧度）
      const headingTemp = hpr.heading
      const pitchTemp = hpr.pitch
      const rollTemp = hpr.roll
      return {
        heading: Cesium.Math.toDegrees(headingTemp),
        pitch: Cesium.Math.toDegrees(pitchTemp),
        roll: Cesium.Math.toDegrees(rollTemp)
      }
    } else {
      return 'undefined'
    }
  }
}
