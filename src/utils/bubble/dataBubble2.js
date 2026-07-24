/**
 * @param {Viewer} val.viewer
 * @param {String}
 * @param {String} val.id
 * @return {*}
 */

import { createVNode, render, ref, reactive, toRefs } from 'vue' // 1. 从Vue 3中导入所需的函数
import Label1 from './bubble1.vue'
import Label2 from './BubbleDiv2.vue'
import store from '@/store'
import { formatDegree } from '@/utils/mapTools'
import {
  getPlatformState,
  getPlatformParts,
  getPlatformWeapons,
  getPlatformSensorVolumes,
  getPlatformJammerVolumes,
  getPlatformMasterTrackList
} from '@/service/afsim'
import { getSensorMatching } from '@/service/SSE.js'
export default class Bubble1 {
  constructor(val) {
    if (window['curDivPoint' + val.id]) {
      return
    }
    this.st = null
    this.number = 0
    this.speedData = 0 //速度
    this.lastCartesian = null //上一个位置
    this.lastTime = null //上一个时间
    this.content = val.content
    this.viewer = val.viewer
    this.id = val.id
    this.Cesium = val.Cesium
    this.datasource = val.name
    this.title = val.title
    this.isCloseClick = val.isCloseClick
    this.offsetY = val.offsetY ? val.offsetY : 0
    this.offsetX = val.offsetX
    this.rgb = val.rgb ? val.rgb : [255, 255, 255]
    this.fontColorRgb = val.fontColorRgb
      ? val.fontColorRgb
      : val.rgb
        ? val.rgb
        : [255, 255, 255]
    this.nearDistance =
      val.distanceDisplayCondition[0] == undefined
        ? 0
        : val.distanceDisplayCondition[0]
    this.farDistance =
      val.distanceDisplayCondition[1] == undefined
        ? 50000000
        : val.distanceDisplayCondition[1]
    if (val.div == 'style') {
      // 创建响应式引用
      this.titleRef = ref(this.title)
      this.contentRef = reactive(this.content)
      this.vmInstance = createVNode(Label1, {
        id: this.id,
        title: this.titleRef,
        content: this.contentRef
      }) // 3. 使用createApp来挂载组件
    } else if (val.div == 'planDetail') {
      if (typeof val.Members == 'number' && typeof val.InitialMembers == 'number') {
        // 如果this.title包含编组则不添加编组信息
        if (this.title.includes('编组') > -1) {
          let textArr = this.title.split('编组')
          this.title = textArr[0] + '编组' + '(' + val.InitialMembers + '/' + val.Members + ')'
        } else {
          this.title = this.title + '编组' + '(' + val.InitialMembers + '/' + val.Members + ')'
        }
      } else {
        // this.title = this.id
      }
      // 创建响应式引用
      this.titleRef = ref(this.title)
      this.contentRef = reactive(this.content)
      this.rgbRef = ref(this.rgb)
      this.fontColorRgbRef = ref(this.fontColorRgb)
      this.isCloseClickRef = ref(this.isCloseClick)
      this.vmInstance = createVNode(Label2, {
        id: this.id,
        title: this.titleRef,
        content: this.contentRef,
        rgb: this.rgbRef,
        fontColorRgb: this.fontColorRgbRef,
        isCloseClick: this.isCloseClickRef,
        Members: this.Members,
        InitialMembers: this.InitialMembers
      })
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
    window['curDivPoint' + this.id] = this.mountNode
    window['curDivPoint' + this.id].closeEvent = (e) => {
      this.windowClose(val.viewer)
    }
    this.move = false
    this.netColor = `rgb(${this.rgb[0]},${this.rgb[1]},${this.rgb[2]}`
    let canvasobj = this.createCanvas()
    this.canvas = canvasobj.canvas
    this.canvasDom = canvasobj.canvasDom
    this.postRenderUpdate()
    this.addPostRender()
    this.mousedownPublic(this.mountNode)
  }
  //添加场景事件
  addPostRender() {
    let that = this
    // 如果是实时计算用下面的方法
    this.viewer.scene.postRender.addEventListener(this.postRenderUpdate, this)
    // 如果是接口计算用下面的方式
    this.st = setInterval(() => {
      if (store.state.AFSIMModule.fp) {
        that.setLabelByAFSIMAPIFP(that.id)
      } else {
        // 基于plateform相关接口获取平台信息
        that.setLabelByAFSIMAPI(that.id)
      }
    }, 1000)
  }

  //场景渲染事件 实时更新窗口的位置 使其与笛卡尔坐标一致
  postRenderUpdate() {
    if (this.move) return
    if (!this.mountNode || !this.mountNode.style) return
    this.mountNode.style.position = 'absolute'
    let blueId = ''
    // 获取entity
    let entity = this.viewer.entities.getById(this.id)
    if (!entity) {
      let ds = this.viewer.dataSources.getByName(this.datasource)
      if (ds.length > 0) {
        entity = ds[0].entities.getById(this.id)
      } else {
        let entities = window.EarthPlugn.entity._GetCZMLEntity(
          this.id,
          'MSIMEarthCZMLProcessContainer'
        )
        if (!this.Cesium.defined(entities)) {
          // 判断entity实体是否存在在
          if (!entities) {
            this.windowClose() //实体不存在就移除详细标签
            return
          }
          if (!entities.show) {
            this.mountNode.style.display = 'none'
            this.canvasDom.style.display = 'none'
            return
          }
        }
        entity = entities
      }
    }

    // 判断entity实体是否存在在
    if (!entity || !entity.show) {
      this.mountNode.style.display = 'none'
      this.canvasDom.style.display = 'none'
      return
    }
    if (!window.MSIMEarth.defined(entity.position)) {
      return
    }
    // 判断实体位置是否存在
    let currentTime = this.viewer.clock.currentTime
    let cartesian = entity.position.getValue(currentTime)
    if (!cartesian) {
      this.mountNode.style.display = 'none'
      this.canvasDom.style.display = 'none'
      return
    }
    this.mountNode.style.display = 'block'
    this.canvasDom.style.display = 'block'
    // 设置标题
    // this.vmInstance.props.title.value = this.title

    // 计算经纬高度
    let curPositionGraphic = this.cartToGraphic(cartesian)
    if (
      !this.Cesium.defined(curPositionGraphic) ||
      !this.Cesium.defined(curPositionGraphic.lng) ||
      !this.Cesium.defined(curPositionGraphic.lat) ||
      !this.Cesium.defined(curPositionGraphic.alt) ||
      typeof curPositionGraphic.alt == 'undefined' ||
      typeof curPositionGraphic.lng == 'undefined' ||
      typeof curPositionGraphic.lat == 'undefined'
    ) {
      // console.log(curPositionGraphic)
      return
    }
    if (this.number == 1) {
      this.getSpeedByTwoPoint(curPositionGraphic)
    }
    // this.setLabel(curPositionGraphic, entity)
    // 设置标牌div的位置
    const canvasHeight = this.viewer.scene.canvas.height
    const windowPosition = new this.Cesium.Cartesian2()
    this.position = entity.position.getValue(this.viewer.clock.currentTime)
    if (!this.position) {
      return
    }
    this.Cesium.SceneTransforms.worldToWindowCoordinates(
      this.viewer.scene,
      this.position,
      windowPosition
    )
    this.mountNode.style.top = windowPosition.y + this.offsetY + 'px'
    this.mountNode.style.left = windowPosition.x + this.offsetX + 'px'
    let eltop = windowPosition.y + this.offsetY
    let elleft = windowPosition.x + this.offsetX
    if (this.canvas) {
      //标盘和目标连接线绘制方法
      //TODO:获取动态标盘元素框高的dom容器获得方法 如兼容多个模板 可以变为传值获取
      const divheight =
        this.vmInstance.el.getElementsByClassName('box-wrap1')[0].clientHeight
      const divWidth =
        this.vmInstance.el.getElementsByClassName('box-wrap1')[0].clientWidth
      this.canvas.height = this.viewer.canvas.clientHeight
      this.canvas.width = this.viewer.canvas.clientWidth
      let context = this.canvas.getContext('2d')
      context.beginPath()
      context.moveTo(windowPosition.x, windowPosition.y)
      context.lineTo(elleft + divWidth / 2, eltop + divheight + 2)
      context.strokeStyle = this.netColor
      context.lineWidth = 1
      context.stroke()
    }

    let camerPosition = this.viewer.camera.position
    let pitch = this.viewer.camera.pitch
    let camePosition = this.cartToGraphic(camerPosition)
    if (!this.Cesium.defined(camePosition)) return
    if (!this.Cesium.defined(camePosition.alt)) return
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
      (this.viewer.camera.positionCartographic.height > this.farDistance ||
        this.viewer.camera.positionCartographic.height < this.nearDistance)
    ) {
      this.mountNode.style.display = 'none'
      this.canvasDom.style.display = 'none'
    }
    // 保存本次的实体位置和时间,用于下次计算速度和方向
    if (this.number > 500) {
      this.lastCartesian = cartesian
      this.lastTime = currentTime
      this.number = 0
    }
    this.number++
  }

  // 关闭
  windowClose() {
    const elementContains = (parent, child) =>
      parent !== child && parent.contains(child)
    // 事例
    if (window['curDivPoint' + this.id]) {
      //this.mountNode.remove();
      //this.mountNode.$destroy();
      //let boolean = elementContains(document.querySelector('body'), document.querySelector('box-wrap'));
      //if (boolean) {
      this.viewer.cesiumWidget.container.removeChild(
        window['curDivPoint' + this.id]
      )
      window['curDivPoint' + this.id] = null
      this.mountNode = null
      //}
    }
    // 如果采用的是接口获取则清除setInterval事件
    if (this.st) {
      clearInterval(this.st)
    }
    this.viewer.scene.postRender.removeEventListener(this.postRenderUpdate)
    this.viewer.cesiumWidget.container.children[0].removeChild(this.canvasDom)
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

  /**
   * canvas画布创建连接线容器
   * @returns {Object} - 两个操作数的和
   * @returns {canvas} canvas- canvas对象
   * @returns {dom} canvasDom - canvasDom对象
   */
  createCanvas() {
    let canvas = document.createElement('canvas')
    // canvas.setAttribute('id', 'canvaslines');
    canvas.height = this.viewer.canvas.clientHeight
    canvas.width = this.viewer.canvas.clientWidth
    canvas.style = 'position: absolute;left: 0px;top: 0px;pointer-events: none;'
    let canvasDom =
      this.viewer.cesiumWidget.container.children[0].appendChild(canvas)
    return {
      canvas: canvas,
      canvasDom: canvasDom
    }
  }

  /**
   * 详标签拖拽拖拽事件
   * @param {dom} -selectElement  需要拖拽的dom元素
   */
  mousedownPublic(selectElement) {
    let that = this
    const divheight =
      selectElement.getElementsByClassName('box-wrap1')[0].clientHeight
    const divWidth =
      selectElement.getElementsByClassName('box-wrap1')[0].clientWidth
    selectElement.onmousedown = (e) => {
      that.move = true
      let distanceX = e.clientX - selectElement.offsetLeft
      let distanceY = e.clientY - selectElement.offsetTop
      document.onmousemove = function (ev) {
        ev.preventDefault()
        ev.stopPropagation()
        selectElement.style.cursor = 'move'
        let oevent = ev
        selectElement.style.left = oevent.clientX - distanceX + 'px'
        selectElement.style.top = oevent.clientY - distanceY + 'px'
        let upperLeft = new that.Cesium.Cartesian2(
          oevent.clientX - distanceX,
          oevent.clientY - distanceY
        )
        let ysposition = that.Cesium.SceneTransforms.worldToWindowCoordinates(
          that.viewer.scene,
          that.position
        )
        //计算偏移量
        that.offsetX = upperLeft.x - ysposition.x
        that.offsetY = upperLeft.y - ysposition.y
        if (that.canvas) {
          that.canvas.height = that.viewer.canvas.clientHeight
          that.canvas.width = that.viewer.canvas.clientWidth
          let context = that.canvas.getContext('2d')
          context.beginPath()
          if (ysposition.x && ysposition.y) {
            context.moveTo(ysposition.x, ysposition.y)
            context.lineTo(upperLeft.x + divWidth / 2, upperLeft.y + divheight)
            context.strokeStyle = that.netColor
            context.lineWidth = 1

            // context.strokeStyle = gradient
            context.lineWidth = 2
            context.lineCap = 'round'
            context.stroke()
          }
        }
      }

      document.onmouseup = function (e) {
        console.log('onmouseup')
        that.move = false
        document.onmousemove = null
        document.onmouseup = null
      }
    }
    // selectElement.ondblclick = e => {
    //     this.windowClose();
    // };
  }

  //设置要显示字段
  setLabel(curPositionGraphic, entity) {
    let contentArr = this.vmInstance.props.content.value
    for (let x = 0; x < contentArr.length; x++) {
      if (contentArr[x].name == '经度') {
        let lng = Number(curPositionGraphic.lng.toFixed(3))
        // 切换度分秒
        if (store.state.sceneModule.systemConfig.isSwitchDegMinsSconds) {
          if (lng >= 0) {
            lng = formatDegree(lng) + 'E'
          } else {
            lng = formatDegree(lng) + 'W'
          }
        } else {
          if (lng >= 0) {
            lng = lng + '°E'
          } else {
            lng = lng + '°W'
          }
        }
        contentArr[x].value = lng
      } else if (contentArr[x].name == '纬度') {
        let lat = Number(curPositionGraphic.lat.toFixed(3))
        // 切换度分秒
        if (store.state.sceneModule.systemConfig.isSwitchDegMinsSconds) {
          if (lat >= 0) {
            lat = formatDegree(lat) + 'E'
          } else {
            lat = formatDegree(lat) + 'W'
          }
        } else {
          if (lat >= 0) {
            lat = lat + '°N'
          } else {
            lat = lat + '°S'
          }
        }
        contentArr[x].value = lat
      } else if (contentArr[x].name == '高度') {
        contentArr[x].value = Math.floor(curPositionGraphic.alt) + '米'
      } else if (contentArr[x].name == '航向角') {
        let headingAir = 0
        if (
          entity.properties?.airplaneAction?._value &&
          entity.properties?.airplaneAction?._value.heading &&
          typeof entity.properties?.airplaneAction?._value.heading !=
          'undefined'
        ) {
          headingAir = entity.properties?.airplaneAction?._value.heading
          if (headingAir < 0) headingAir = 360 + Number(headingAir) //航向角0-360，后台推送的是正负180，前端做处理显示0-360
        }
        contentArr[x].value = Math.floor(headingAir) + '°'
      } else if (contentArr[x].name == '俯仰角') {
        let pitchAir = 0
        if (
          entity.properties?.airplaneAction?._value &&
          entity.properties?.airplaneAction?._value.pitch &&
          typeof entity.properties?.airplaneAction?._value.pitch != 'undefined'
        ) {
          pitchAir = entity.properties?.airplaneAction?._value.pitch
        }
        contentArr[x].value = Math.floor(pitchAir) + '°'
      } else if (contentArr[x].name == '滚转角') {
        let rollAir = 0
        if (
          entity.properties?.airplaneAction?._value &&
          entity.properties?.airplaneAction?._value.roll &&
          typeof entity.properties?.airplaneAction?._value.roll != 'undefined'
        ) {
          // rollAir = entity.properties?.airplaneAction?._value.roll.toFixed(3)
          rollAir = entity.properties?.airplaneAction?._value.roll
        }
        contentArr[x].value = rollAir + '°'
      } else if (contentArr[x].name == '速度') {
        let typeAir = entity.properties?.airplaneAction?._value.type
        // 速度 m/s 换算为 km/h
        let speedKm = 0
        if (
          entity.properties?.airplaneAction?._value?.speed &&
          typeof entity.properties?.airplaneAction?._value.speed != 'undefined'
        ) {
          speedKm =
            Number(entity.properties?.airplaneAction?._value?.speed) * 3.6
          // speedKm = speedKm.toFixed(3)
        }

        if (store.state.sceneModule.isReplayType) {
          //复盘功能下根据两点计算出的速度
          contentArr[x].value = (this.speedData ? this.speedData : 0) + 'km/h'
        } else {
          contentArr[x].value = Math.floor(speedKm) + 'km/h'
        }
      }
    }
  }
  /**
   * 基于AFSIM提供的接口获取实时信息
   * @param {string} id 实体id
   */
  async setLabelByAFSIMAPI(id) {
    let params = { platform: id }
    let formState = await getPlatformState(params)
    let formPart = await getPlatformParts(params)
    let weapons = await getPlatformWeapons(params)
    let jam = await getPlatformJammerVolumes(params)
    // let tracklines = await getPlatformMasterTrackList(params)
    // console.log('jam', jam)
    // 详标值获取
    if (typeof formState.data.Members == 'number' && typeof formState.data.InitialMembers == 'number') {
      if (this.title.includes('编组') > -1) {
        let textArr = this.title.split('编组')
        this.title = textArr[0] + '编组' + '(' + formState.data.InitialMembers + '/' + formState.data.Members + ')'
      } else {
        this.titleRef.value = id + '编组(' + formState.data.InitialMembers + '/' + formState.data.Members + ')'
      }
    } else {
      // this.titleRef.value = id
    }
    let contentArr = this.contentRef
    for (let x = 0; x < contentArr.length; x++) {
      if (formState.status === 'success') {
        if (contentArr[x].name == '经度') {
          let lng = Number(formState.data.Longitude.toFixed(3))
          // 切换度分秒
          if (store.state.sceneModule.systemConfig.isSwitchDegMinsSconds) {
            if (lng >= 0) {
              lng = formatDegree(lng) + 'E'
            } else {
              lng = formatDegree(lng) + 'W'
            }
          } else {
            if (lng >= 0) {
              lng = lng + '°E'
            } else {
              lng = lng + '°W'
            }
          }
          contentArr[x].value = lng
        } else if (contentArr[x].name == '纬度') {
          let lat = Number(formState.data.Latitude.toFixed(3))
          // 切换度分秒
          if (store.state.sceneModule.systemConfig.isSwitchDegMinsSconds) {
            if (lat >= 0) {
              lat = formatDegree(lat) + 'E'
            } else {
              lat = formatDegree(lat) + 'W'
            }
          } else {
            if (lat >= 0) {
              lat = lat + '°N'
            } else {
              lat = lat + '°S'
            }
          }
          contentArr[x].value = lat
        } else if (contentArr[x].name == '高度') {
          contentArr[x].value = Math.floor(formState.data.Altitude) + '米'
        } else if (contentArr[x].name == '航向角') {
          let headingAir = formState.data.Heading.toFixed(3)
          contentArr[x].value = Math.floor(headingAir) + '°'
        } else if (contentArr[x].name == '俯仰角') {
          let pitchAir = formState.data.Pitch.toFixed(3)
          contentArr[x].value = Math.floor(pitchAir) + '°'
        } else if (contentArr[x].name == '滚转角') {
          let rollAir = formState.data.Roll.toFixed(3)
          contentArr[x].value = rollAir + '°'
        } else if (contentArr[x].name == '速度') {
          let speedKm = Number(formState.data.Speed)
          // 速度保留整数
          contentArr[x].value = Math.floor(speedKm * 3.6) + 'km/h'
        } else if (contentArr[x].name == '马赫') {
          let mach = parseFloat(formState.data.Mach)
          // 如果马赫为NaN或undefined则不显示马赫
          if (!isNaN(mach) && typeof mach !== 'undefined') {
            contentArr[x].value = mach.toFixed(3) + 'mach'
          } else {
            contentArr[x].value = ''
          }
          // contentArr[x].value = mach.toFixed(3) + 'mach'
        } else if (contentArr[x].name == '油量') {
          let fuel = parseFloat(formState.data.Fuel)
          // 如果油量为NaN或undefined则不显示油量
          if (!isNaN(fuel) && typeof fuel !== 'undefined') {
            contentArr[x].value = Math.floor(fuel) + 'kg'
          } else {
            contentArr[x].value = ''
          }
        }
      }
      if (formPart.status === 'success') {
        if (contentArr[x].name == '传感器') {
          let sensorArr = []
          let sensorChineseArr = []
          formPart.data.forEach((e) => {
            if (e.PartType === 'SENSOR') {
              sensorArr.push(e.Name)
            }
          })
          getSensorMatching().then((res) => {
            const keyArr = Object.keys(res)
            sensorArr.forEach((e) => {
              if (keyArr.includes(e)) {
                const chineseName = res[e]?.chineseName // 可选链避免报错
                if (chineseName) {
                  sensorChineseArr.push(chineseName)
                  let sensorValue = sensorChineseArr.join('、')
                  contentArr[x].value = sensorValue
                } else {
                  console.warn(`key=${e} 对应的 chineseName 不存在：`, res[e])
                }
              }
            })
          })
        } else if (contentArr[x].name === '雷达') {
          let radarArr = []
          formPart.data.forEach((e) => {
            if (e.PartType === 'RADAR') {
              radarArr.push(e.EW_RADAR)
            }
          })
          let radarValue = radarArr.join(' ')
          contentArr[x].value = radarValue
        }
      }
      if (weapons.status === 'success') {
        if (contentArr[x].name == '武器') {
          let weaponArr = []
          weapons.data.forEach((e) => {
            // 过滤掉 chaff 和 flare 两种类型
            const weaponName = e.Name.toLowerCase()
            if (weaponName !== 'chaff' && weaponName !== 'flare') {
              weaponArr.push(e.Name + '*' + e.Quantity)
            }
          })
          let weaponValue = weaponArr.join(' ')
          contentArr[x].value = weaponValue
        }
      }
      // // 如果contentArr中有值为空则移除
      // console.log('移除前', contentArr)
      // contentArr = contentArr.filter((item) => item.value !== '')
      // console.log('移除后', contentArr)
    }
  }
  /**
 * 基于AFSIM提供的接口获取实时信息
 * @param {string} id 实体id
 */
  async setLabelByAFSIMAPIFP(id) {
    let params = { platform: id }
  }
  //根据两点计算速度
  getSpeedByTwoPoint(curPositionGraphic) {
    // 计算速度和方向
    if (this.lastCartesian && this.lastTime) {
      let currentTime = this.viewer.clock.currentTime
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
      let speed = distance / seconds
      if (!window.MSIMEarth.defined(speed) || typeof speed == 'undefined')
        return
      this.speedData = (speed * 3.6).toFixed(3)
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
}
