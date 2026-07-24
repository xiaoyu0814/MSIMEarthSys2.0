import TrackMatte from '@/utils/radar.js'
import DrawFanShape from './customTool/drawFanShape'
import store from '@/store'

/**
 * 飞行目标CZML相关动作管理工具
 * @param
 */
export default class PlaneCzmlManage {
  constructor(options) {
    this.Earth = options.earth || window.MSIMEarth // 初始化Earth对象
    this.viewer = options.viewer || window.EarthViewer // 初始化viewer对象
    this.entityMethodFun = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
  }
  /**
   * 控制所有czml路径显隐
   * @param {boolean} value 显示或隐藏
   */
  showCZMLPath(value) {
    window.EarthViewer.dataSources._dataSources.forEach((item) => {
      let path = item.entities.values[0].path
      if (path) {
        path.show._value = value
      }
    })
  }
  /**
   * 控制czml或entity显隐
   * @param {string} id entity的id或datasource的name
   * @param {boolean} value 显示或隐藏
   */
  showDynamicEntity(id, value) {
    let sourceSource = window.EarthViewer.dataSources.getByName(id)
    let entity = sourceSource.length
      ? sourceSource[0].entities.values[0]
      : window.EarthViewer.entities.getById(id)
    if (!entity) return
    entity.show = value
  }
  /**
   * 控制实体传感器范围
   * @param {string} id entity的id或datasource的name
   * @param {boolean} value 显示或隐藏
   */
  showSensorRange(id, value) {
    let entity = window.EarthViewer.entities.getById(`SU==sensor==${id}`)
    if (!entity) return
    entity.show = value
  }
  /**
   * 控制单个czml路径显隐
   * @param {string} id entity的id或datasource的name
   * @param {boolean} value 显示或隐藏
   */
  showSingleCZMLPath(id, value) {
    let sourceSource = window.EarthViewer.dataSources.getByName(id)
    if (sourceSource.length == 0) return
    // let entity = sourceSource.length ? sourceSource[0].entities.values[0] : window.EarthViewer.entities.getById(id)
    let entity = sourceSource[0].entities.values[0]
    if (!entity) return
    let path = entity.path
    if (path) {
      path.show._value = value
    }
  }
  /*
  添加尾迹线
  */
  addwjxian(czmlname, side) {
    let that = this
    let collection = []
    let targetDs = window.EarthViewer.entities.getById(czmlname + 'weijixian')
    if (targetDs) return
    function changeLength() {
      let targetEntity = that.entityMethodFun.getCZMLEntity(
        czmlname,
        'MSIMEarthCZMLProcessContainer'
      )
      if (!targetEntity || !targetEntity.position) return
      var YGPosition = targetEntity.position.getValue(
        window.EarthViewer.clock.currentTime
      )
      if (typeof YGPosition === 'undefined') {
        return
      }
      if (YGPosition == undefined) {
        return
      }
      if (
        typeof YGPosition.x === 'undefined' ||
        typeof YGPosition.y === 'undefined' ||
        typeof YGPosition.z === 'undefined'
      ) {
        return
      }
      if (!YGPosition) return
      if (!window.MSIMEarth.defined(YGPosition)) return
      var YGCartographic =
        window.MSIMEarth.Cartographic.fromCartesian(YGPosition)
      if (
        !window.MSIMEarth.defined(YGCartographic.longitude) ||
        !window.MSIMEarth.defined(YGCartographic.latitude) ||
        !window.MSIMEarth.defined(YGCartographic.height)
      )
        return

      let starLinkLng = window.MSIMEarth.Math.toDegrees(
        YGCartographic.longitude
      )
      let starLinkLat = window.MSIMEarth.Math.toDegrees(YGCartographic.latitude)
      let starLinkAlt = YGCartographic.height
      if (
        typeof YGCartographic.longitude === 'undefined' ||
        typeof YGCartographic.latitude === 'undefined' ||
        typeof YGCartographic.height === 'undefined'
      ) {
        return
      }
      if (length > 3) {
        let length = collection.length
        let lastDegrees = [
          collection[length - 3],
          collection[length - 2],
          collection[length - 1]
        ]
        if (
          !window.MSIMEarth.defined(lastDegrees[0]) ||
          !window.MSIMEarth.defined(lastDegrees[1]) ||
          !window.MSIMEarth.defined(lastDegrees[2])
        )
          return

        let lastCartesian = window.MSIMEarth.Cartesian3.fromDegrees(
          ...lastDegrees
        )
        let distance =
          window.sceneAction.connectLineManagement.getSpaceDistance([
            YGPosition,
            lastCartesian
          ])
        if (distance < wjdistance) return
      }
      if (typeof starLinkLng === 'undefined') {
        window.EarthViewer.entities.removeById(czmlname)
        return
      }
      if (EarthAPP.fps < 25) return
      collection.push(starLinkLng)
      collection.push(starLinkLat)
      collection.push(starLinkAlt + 10)
      if (collection.length >= 2100) {
        collection.splice(0, 3)
      }

      return window.MSIMEarth.Cartesian3.fromDegreesArrayHeights(collection)
    }
    let imageUrl = 'static/image/texture/materiallineR.png'
    if (side === 'blue') {
      imageUrl = 'static/image/texture/materialline3.png'
    }
    window.EarthViewer.entities.add({
      id: czmlname + 'weijixian',
      name: 'Wide blue dashed line with a gap color',
      show: true,
      polyline: {
        positions: new window.MSIMEarth.CallbackProperty(changeLength, false),
        width: 45,
        material: new window.MSIMEarth.FlowLineMaterialProperty({
          image: imageUrl,
          mixColor: new window.MSIMEarth.Color(1.0, 1.0, 0.6, 1.0),
          mixRatio: 0.5,
          repeat: new window.MSIMEarth.Cartesian2(1, 1),
          flowSpeed: -0.00001,
          transparent: true
        }),
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          0,
          10e5
        )
      }
    })
  }
  /*
   删除尾迹线
   */
  removewjxian(czmlname) {
    let entity = window.EarthViewer.entities.getById(czmlname + 'weijixian')
    if (!entity) return
    window.EarthViewer.entities.removeById(czmlname + 'weijixian')
  }
  /**
   * 添加路径墙
   * @param {string} id entity的id或datasource的name
   * @param {boolean} value 显示或隐藏
   */
  addPathWall(czmlname) {
    let that = this
    window.EarthViewer.scene.globe.depthTestAgainstTerrain = true
    let side = 'red'
    let collection = []
    let sidecolor = new window.MSIMEarth.Color(1.0, 0.0, 0.0, 1.0)
    let entity = that.entityMethodFun.getCZMLEntity(
      czmlname,
      'MSIMEarthCZMLProcessContainer'
    )
    if (!entity || !entity.position) return
    side = entity.properties.airplaneAction._value.side
    let img = 'static/image/texture/loudongRed.png'
    if (side === 'blue') {
      sidecolor = new window.MSIMEarth.Color(0.0, 1.0, 1.0, 1.0)
      img = 'static/image/texture/loudong3.png'
    }
    // entity
    function changePositions() {
      let entity = that.entityMethodFun.getCZMLEntity(
        czmlname,
        'MSIMEarthCZMLProcessContainer'
      )
      if (!entity || !entity.position) return
      let curPosition = entity.position.getValue(
        window.EarthViewer.clock.currentTime
      )
      if (!curPosition) return
      if (
        typeof curPosition.x === 'undefined' ||
        typeof curPosition.y === 'undefined' ||
        typeof curPosition.z === 'undefined'
      ) {
        return
      }
      collection.push(curPosition)
      return collection
    }
    window.EarthViewer.entities.add({
      id: czmlname + 'pathWall',
      wall: {
        positions: new window.MSIMEarth.CallbackProperty(
          changePositions,
          false
        ),
        material: new window.MSIMEarth.ImageMaterialProperty({
          image: img,
          color: sidecolor,
          transparent: true
        })
      }
    })
  }
  // 雷达圈
  sensorRange(params) {
    let viewer = window.EarthViewer
    viewer.entities.removeById(`${params.type}==${params.sourId}`)

    let datasource = window.EarthViewer.dataSources.getByName(params.sourId)
    // let entity = datasource[0].entities.values[0]
    let entity = datasource.length
      ? datasource[0].entities.values[0]
      : viewer.entities.getById(params.sourId)
    if (!entity) return
    let radius = params.radius || 18520
    let showref = params.show
    // let mixColor = params.color || [0,0,255]
    let mixColor = params.side == 'blue' ? [37, 209, 255] : [255, 0, 0]

    let trackMatte = new TrackMatte({
      viewer: window.EarthViewer,
      earth: window.MSIMEarth,
      id: `${params.type}==sensor==${params.sourId}`,
      shortwaveRange: Number(radius),
      entity: entity,
      speed: 2,
      color: mixColor,
      show: showref
    })
  }
  // 雷达受到干扰缩小效果
  changeSensorRange(params) {
    let id = params.id
    let that = this
    let sensorEn = window.EarthViewer.entities.getById(id)
    if (!sensorEn) return
    let radii = sensorEn.ellipsoid.radii._value.x
    // let newRadii = (parseFloat(radii) * 2) / 3
    let multiple = params.multiple || 2 / 3
    let newRadii = parseFloat(radii) * multiple
    let step = (radii - newRadii) / 300 //步长
    let lMaterial = sensorEn.ellipsoid.material
    let lastShow = sensorEn.show
    sensorEn.show = true
    sensorEn.ellipsoid.radii = new window.MSIMEarth.CallbackProperty(
      callbackRadii,
      false
    )
    sensorEn.ellipsoid.material =
      new window.MSIMEarth.BlingColorMaterialProperty({
        color: new window.MSIMEarth.Color(0, 255 / 255, 255 / 255, 0.5),
        speed: 5.0
      })
    that.blingLabel({
      targetId: id,
      text: params.text,
      fillColor: [0, 255, 255]
    })
    function callbackRadii() {
      if (!sensorEn) return
      if (typeof radii === 'undefined') return
      let curRadii = new window.MSIMEarth.Cartesian3(radii, radii, radii)
      if (radii >= newRadii) {
        radii -= step
        return curRadii
      } else {
        sensorEn.ellipsoid.radii = curRadii
        sensorEn.ellipsoid.material = lMaterial
        setTimeout(() => {
          sensorEn.show = lastShow
          that.removeBlingLabel(id)
        }, 2000)
      }
    }
  }
  blingLabel(params) {
    let viewer = window.EarthViewer
    let targetSource = viewer.dataSources.getByName(params.targetId)
    let targetEntity = targetSource.length
      ? targetSource[0].entities.values[0]
      : viewer.entities.getById(params.targetId)
    if (!targetEntity) return
    let sizeNum = 1
    let fillColor = params.fillColor || [255, 128, 1]
    let outlineColor = params.outlineColor || [0, 0, 0]
    let fillColorC = new window.MSIMEarth.Color(
      fillColor[0] / 255,
      fillColor[1] / 255,
      fillColor[2] / 255,
      1.0
    )
    let outlineColorC = new window.MSIMEarth.Color(
      outlineColor[0] / 255,
      outlineColor[1] / 255,
      outlineColor[2] / 255,
      1.0
    )
    function changePos() {
      if (!targetEntity) return
      let entityPos = targetEntity.position._value
        ? targetEntity.position._value
        : targetEntity.position.getValue(viewer.clock.currentTime)
      if (!entityPos) return
      return entityPos
    }
    function changeSize() {
      sizeNum += 0.1
      let size = 0.4 + Math.sin(sizeNum) * 0.1
      let ns = new window.MSIMEarth.NearFarScalar(
        10000,
        0.7 + size,
        20e5,
        0.2 + size
      )
      return ns
    }
    viewer.entities.add({
      id: 'blingLabel' + params.targetId,
      position: new window.MSIMEarth.CallbackProperty(changePos, false),
      label: {
        text: params.text,
        font: 'bold 32px MicroSoft YaHei',
        style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        fillColor: fillColorC,
        outlineColor: outlineColorC,
        outlineWidth: 5,
        horizontalOrigin: window.MSIMEarth.HorizontalOrigin.CENTER,
        pixelOffset: new window.MSIMEarth.Cartesian2(0, -25),
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          0,
          100e5
        ),
        // scaleByDistance: new window.MSIMEarth.NearFarScalar(
        //   10000,
        //   0.9,
        //   20e5,
        //   0.4
        // ),
        scaleByDistance: new window.MSIMEarth.CallbackProperty(
          changeSize,
          false
        ),
        showBackground: false,
        backgroundColor: new window.MSIMEarth.Color(
          235 / 255,
          255 / 255,
          255 / 255,
          0.3
        )
      }
    })
  }
  removeBlingLabel(targetId) {
    window.EarthViewer.entities.removeById('blingLabel' + targetId)
  }
  testChange() {
    let that = this
    let po = window.EarthViewer.entities.add({
      id: `test1`,
      position: new window.MSIMEarth.Cartesian3.fromDegrees(120, 22, 100000),
      point: {
        pixelSize: 5,
        color: window.MSIMEarth.Color.RED
      }
    })
    // let trackMatte = new TrackMatte({
    //   viewer: window.EarthViewer,
    //   earth: window.MSIMEarth,
    //   id: `test1`,
    //   shortwaveRange: 200000,
    //   entity: po,
    //   speed: 2,
    //   color: [0, 255, 255]
    // })
    setTimeout(() => {
      // that.changeSensorRange({
      //   id: `test1`,
      //   multiple: 2 / 3,
      //   text: '受到干扰'
      // })
      // that.planeElectronicInterfer({
      //   sourId: `test1`
      // })
    }, 4000)
  }
  // czmlLabel飞机label
  changePlaneLabel(params) {
    let configContent = params.configContent
    let data = params.data
    let name = params.name
    // let entity = params.entity
    let config = configContent || ['姿态', '速度', '类型', '位置', '状态']
    let text = name
    if (config.find((item) => item == '姿态')) {
      let headingData =
        data.heading && data.heading != undefined
          ? Number(data.heading) != 0
            ? data.heading.toFixed(3)
            : 0
          : 0
      let pitchData =
        data.pitch && data.pitch != undefined
          ? Number(data.pitch) != 0
            ? data.pitch.toFixed(3)
            : 0
          : 0
      let rollData =
        data.roll && data.roll != undefined
          ? Number(data.roll) != 0
            ? data.roll.toFixed(3)
            : 0
          : 0
      text +=
        '\n' + '航向角:' + headingData + '° ' + '俯仰角:' + pitchData + '° '
      //  + '滚转角:' +
      // rollData +
      // '° '
    }
    if (config.find((item) => item == '速度')) {
      // 速度 m/s 换算为 km/h
      let speedKm = 0
      if (data.speed) {
        speedKm = Number(data.speed) * 3.6
      }
      text += '\n' + '速度:' + speedKm.toFixed(3) + 'km/h'
    }
    if (config.find((item) => item == '类型')) {
      text += '\n' + '类型:' + data.type
    }
    if (config.find((item) => item == '位置')) {
      let sourceLng, sourceLat, sourceAlt
      let entity = this.entityMethodFun.getCZMLEntity(
        params.czmlName,
        'MSIMEarthCZMLProcessContainer'
      )
      if (entity && entity.position) {
        let position = entity.position
        let curposition = position.getValue(
          window.EarthViewer.clock.currentTime
        )
        if (curposition) {
          let entityCartographic =
            window.MSIMEarth.Cartographic.fromCartesian(curposition)

          sourceLng = window.MSIMEarth.Math.toDegrees(
            entityCartographic.longitude
          )
          sourceLat = window.MSIMEarth.Math.toDegrees(
            entityCartographic.latitude
          )
          sourceAlt = entityCartographic.height
          text +=
            '\n' +
            '经度:' +
            sourceLng.toFixed(3) +
            ' ' +
            '纬度:' +
            sourceLat.toFixed(3) +
            ' ' +
            '高度:' +
            sourceAlt.toFixed(3)
        }
      }
    }
    if (config.find((item) => item == '状态')) {
      let weatherTypeInfor = store.state.sceneModule.weatherTypeInfor
      for (let item in weatherTypeInfor) {
        let msg = weatherTypeInfor[item].msg
        let id = item
        if (id == params.czmlName) {
          // if (msg.indexOf('离开') > -1 && msg.indexOf('积云') > -1) {
          //   text += ''
          // } else {
          //   text += msg
          // }
          if (msg.indexOf('离开') > -1) {
            text += ''
          } else {
            text += '\n' + '状态:' + msg
          }
        }
      }
    }
    let label = {
      show: true,
      font: 'normal 14px MicroSoft YaHei',
      text: text,
      // style: 'FILL_AND_OUTLINE',
      // showBackground: false,
      // fillColor: {
      //   rgba: [255, 255, 255, 255]
      // },
      // outlineColor: {
      //   rgba: [0, 0, 0, 255]
      // },
      // outlineWidth: 2,
      // backgroundColor: [1, 1, 1, 0.8],
      horizontalOrigin: 'LEFT',
      pixelOffset: {
        cartesian2: [20, -30]
      }

      // height: 40
    }
    return label
  }
  // 飞机开启电子干扰
  planeElectronicInterfer(params) {
    let that = this
    if (this.viewer.entities.getById(params.sourId + '_ElectronicInterfer')) {
      return
    } // let sourceSource = this.viewer.dataSources.getByName(params.sourId)
    // let entity = sourceSource.length
    //   ? sourceSource[0].entities.values[0]
    //   : this.viewer.entities.getById(params.sourId)
    const entityMethod = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
    let entity = entityMethod.getCZMLEntity(
      params.sourId,
      'MSIMEarthCZMLProcessContainer'
    )
    if (!entity) return
    let radius = params.radius || 30000
    function changePos() {
      let entityPos = entity.position._value
        ? entity.position._value
        : entity.position.getValue(that.viewer.clock.currentTime)
      return entityPos
    }
    let colorC = new window.MSIMEarth.Color(1.0, 0, 0, 1)
    if (params.color) {
      if (params.color == 'blue')
        colorC = new window.MSIMEarth.Color(0, 0, 1.0, 1.0)
    }
    this.viewer.entities.add({
      id: params.sourId + '_ElectronicInterfer',
      position: new that.Earth.CallbackProperty(changePos, false),
      ellipsoid: {
        radii: new that.Earth.Cartesian3(radius, radius, radius),
        maximumCone: that.Earth.Math.PI_OVER_TWO,
        material: new that.Earth.Color(colorC[0], colorC[1], colorC[2], 0.3),
        // material: new that.Earth.EMIMaterialProperty({
        //   transparent: true,
        //   flowSpeed: 1.0,
        //   half: false,
        //   color: new that.Earth.Color(1.0, 0.0, 0.0, 1.0),
        //   EMITransparent: 0.3
        // }),
        fill: false,
        outline: true,
        // outline: false,
        outlineColor: colorC,
        outlineWidth: 5
      }
      // show: false
    })
  }
  // 删除 飞机开启电子干扰
  removePlaneElectronicInterfer(sourId) {
    if (window.EarthViewer.entities.getById(sourId + '_ElectronicInterfer')) {
      window.EarthViewer.entities.removeById(sourId + '_ElectronicInterfer')
    }
  }
  // 点标注
  setPointLabel(params) {
    let position = new this.Earth.Cartesian3.fromDegrees(
      params.position[0],
      params.position[1],
      params.position[2]
    )
    let outlineColor = new this.Earth.Color(
      params.color[0] / 255,
      params.color[1] / 255,
      params.color[2] / 255,
      params.color[3]
    )
    let flog = true
    let size = params.pointSize || 3
    let updateSize = function () {
      if (flog) {
        size = size - 0.4
        if (size <= 0) {
          flog = false
        }
      } else {
        size = size + 0.4
        if (size >= 6) {
          flog = true
        }
      }
      return size
    }
    this.viewer.entities.add({
      id: params.id,
      position: position,
      point: {
        scaleByDistance: new this.Earth.NearFarScalar(6e6, 1.6, 2e8, 1.2),
        pixelSize: new this.Earth.CallbackProperty(updateSize, false),
        outlineColor: outlineColor,
        outlineWidth: 2.5,
        color: this.Earth.Color.WHITE
      },
      label: {
        text: params.text,
        font: 'bold 32px MicroSoft YaHei',
        style: this.Earth.LabelStyle.FILL_AND_OUTLINE,
        fillColor: this.Earth.Color.WHITE,
        outlineColor: outlineColor,
        outlineWidth: 2,
        horizontalOrigin: this.Earth.HorizontalOrigin.CENTER,
        pixelOffset: new this.Earth.Cartesian2(0, -25),
        distanceDisplayCondition: new this.Earth.DistanceDisplayCondition(
          0,
          100e5
        ),
        scaleByDistance: new window.MSIMEarth.NearFarScalar(
          10000,
          0.9,
          20e5,
          0.6
        ),
        // scaleByDistance: new this.Earth.CallbackProperty(
        //   changeSize,
        //   false
        // ),
        showBackground: true,
        backgroundColor: new this.Earth.Color(
          params.color[0] / 255,
          params.color[1] / 255,
          params.color[2] / 255,
          0.3
        )
      }
    })
  }
  // 删除雷达圈
  removeRange(params) {
    window.EarthViewer.entities.removeById(`${params.type}==${params.sourId}`)
    window.EarthViewer.entities.removeById(
      `${params.type}==${params.sourId}==big`
    )
    window.EarthViewer.entities.removeById(
      `${params.type}==${params.sourId}==small`
    )
  }
  // 删除路径墙
  removePathWall(czmlname) {
    window.EarthViewer.scene.globe.depthTestAgainstTerrain = false
    window.EarthViewer.entities.removeById(czmlname + 'pathWall')
  }
  /**
   * 添加路径线
   * @param {string} id entity的id或datasource的name
   * @param {boolean} value 显示或隐藏
   */
  addPathLine(czmlname) {
    let that = this
    let side = 'red'
    let collection = []
    let sidecolor = new window.MSIMEarth.Color(1.0, 0.0, 0.0, 1.0)
    let entity = that.entityMethodFun.getCZMLEntity(
      czmlname,
      'MSIMEarthCZMLProcessContainer'
    )
    if (!entity || !entity.position) return
    side = entity.properties.airplaneAction._value.side
    if (side === 'blue') {
      sidecolor = new window.MSIMEarth.Color(0.0, 1.0, 1.0, 1.0)
    }
    // entity
    function changePositions() {
      let entity = that.entityMethodFun.getCZMLEntity(
        czmlname,
        'MSIMEarthCZMLProcessContainer'
      )
      if (!entity || !entity.position) return
      let YGPosition = entity.position.getValue(
        window.EarthViewer.clock.currentTime
      )
      if (!YGPosition) return
      if (
        typeof YGPosition.x === 'undefined' ||
        typeof YGPosition.y === 'undefined' ||
        typeof YGPosition.z === 'undefined'
      ) {
        return
      }
      collection.push(YGPosition)
      return collection
    }
    window.EarthViewer.entities.add({
      id: czmlname + 'pathLine',
      polyline: {
        positions: new window.MSIMEarth.CallbackProperty(
          changePositions,
          false
        ),
        width: 1,
        material: sidecolor
      }
    })
  }
  // 删除路径线
  removePathLine(czmlname) {
    window.EarthViewer.entities.removeById(czmlname + 'pathLine')
  }
  createEntityCircle(params) {
    let viewer = window.EarthViewer
    viewer.entities.removeById(`${params.type}==${params.sourId}`)
    // let datasource = window.EarthViewer.dataSources.getByName(params.sourId)
    // let entity = datasource.length
    //   ? datasource[0].entities.values[0]
    //   : viewer.entities.getById(params.sourId)
    const entityMethod = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
    let entity = entityMethod.getCZMLEntity(
      params.sourId,
      'MSIMEarthCZMLProcessContainer'
    )
    if (!entity) return
    // let name = entity.properties.entity_name._value
    // let pos = entity.position._value
    // 判断类型
    let radius = params.radius || 18520
    let mixColor = params.color || [0, 0, 255]
    let ellipseObj = {
      semiMinorAxis: radius,
      semiMajorAxis: radius,
      // material: new window.MSIMEarth.GradientCircleMaterialProperty({
      //   color: new window.MSIMEarth.Color(
      //     mixColor[0] / 255,
      //     mixColor[1] / 255,
      //     mixColor[2] / 255,
      //     0.3
      //   )
      // }),
      height: new window.MSIMEarth.CallbackProperty(changeHeight, false), // 高度会遮挡选择MB 暂时去掉
      outline: true,
      fill: !params.isShowMaterial,
      // heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND,
      outlineColor: new window.MSIMEarth.Color(
        mixColor[0] / 255,
        mixColor[1] / 255,
        mixColor[2] / 255,
        1
      ),
      outlineWidth: 2
    }
    if (params.isShowMaterial) {
      ellipseObj['material'] = new window.MSIMEarth.Color(
        mixColor[0] / 255,
        mixColor[1] / 255,
        mixColor[2] / 255,
        mixColor[3] * 0.5
      )
    }
    window.EarthViewer.entities.add({
      id: `${params.type}${params.sourId}`,
      position: new window.MSIMEarth.CallbackProperty(changePos, false),
      ellipse: ellipseObj,
      show: true
    })

    function changePos() {
      if (!entity.position) return
      let entityPos = entity.position._value
        ? entity.position._value
        : entity.position.getValue(window.EarthViewer.clock.currentTime)
      if (!entityPos) return
      if (
        typeof entityPos.x === 'undefined' ||
        typeof entityPos.y === 'undefined' ||
        typeof entityPos.z === 'undefined'
      ) {
        return
      }
      return entityPos
    }
    function changeHeight() {
      if (!entity.position) return
      let entityPos = entity.position._value
        ? entity.position._value
        : entity.position.getValue(window.EarthViewer.clock.currentTime)
      if (!entityPos) return
      if (
        typeof entityPos.x === 'undefined' ||
        typeof entityPos.y === 'undefined' ||
        typeof entityPos.z === 'undefined'
      ) {
        return
      }
      let entityCartographic =
        window.MSIMEarth.Cartographic.fromCartesian(entityPos)
      if (typeof entityCartographic.height === 'undefined') return
      let sourceAlt = entityCartographic.height
      return sourceAlt
    }
  }
  //创建不带填充色的圆
  createEntityCircleLine(params) {
    let viewer = window.EarthViewer
    viewer.entities.removeById(`${params.type}==${params.sourId}`)

    // let datasource = window.EarthViewer.dataSources.getByName(params.sourId)
    // let entity = datasource.length
    //   ? datasource[0].entities.values[0]
    //   : viewer.entities.getById(params.sourId)
    const entityMethod = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
    let entity = entityMethod.getCZMLEntity(
      params.sourId,
      'MSIMEarthCZMLProcessContainer'
    )
    if (!entity) return
    // let name = entity.properties.entity_name._value
    // let pos = entity.position._value
    // 判断类型
    let radius = params.radius || 18520
    let mixColor = params.color || [0, 0, 255]
    window.EarthViewer.entities.add({
      id: `${params.type}==${params.sourId}`,
      position: new window.MSIMEarth.CallbackProperty(changePos, false),
      ellipse: {
        semiMinorAxis: radius,
        semiMajorAxis: radius,
        material: new window.MSIMEarth.MultiCircleMaterialProperty({
          color: new window.MSIMEarth.Color(0 / 255, 255 / 255, 255 / 255, 1.0), // 127, 255, 212
          repeat: new window.MSIMEarth.Cartesian2(2.0, 1.0),
          half: false,
          flowSpeed: 0.2,
          transparent: 0.1
        }),
        fill: false,
        height: new window.MSIMEarth.CallbackProperty(changeHeight, false),
        outline: true,
        // heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND,
        outlineColor: new window.MSIMEarth.Color(
          mixColor[0] / 255,
          mixColor[1] / 255,
          mixColor[2] / 255,
          1
        ),
        outlineWidth: 2
      },
      show: true
    })

    function changePos() {
      if (!entity.position) return
      let entityPos = entity.position._value
        ? entity.position._value
        : entity.position.getValue(window.EarthViewer.clock.currentTime)
      if (!entityPos) return
      if (
        typeof entityPos.x === 'undefined' ||
        typeof entityPos.y === 'undefined' ||
        typeof entityPos.z === 'undefined'
      ) {
        return
      }
      return entityPos
    }
    function changeHeight() {
      if (!entity.position) return
      let entityPos = entity.position._value
        ? entity.position._value
        : entity.position.getValue(window.EarthViewer.clock.currentTime)
      if (!entityPos) return
      if (
        typeof entityPos.x === 'undefined' ||
        typeof entityPos.y === 'undefined' ||
        typeof entityPos.z === 'undefined'
      ) {
        return
      }
      let entityCartographic =
        window.MSIMEarth.Cartographic.fromCartesian(entityPos)
      if (typeof entityCartographic.height === 'undefined') return
      let sourceAlt = entityCartographic.height
      return sourceAlt
    }
  }
  createPan(params) {
    console.log('创建活力覆盖范围')
    let czmlEn = window.EarthViewer.dataSources._dataSources.find((item) => {
      if (
        typeof item.processName !== 'undefined' &&
        item.processName === 'MSIMEarthCZMLProcessContainer'
      ) {
        return item
      }
    })
    const entityMethod = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })

    if (window.MSIMEarth.defined(czmlEn)) {
      let targetMEntity =
        entityMethod.getCZMLEntity(
          params.sourId,
          'MSIMEarthCZMLProcessContainer'
        ) || window.EarthViewer.entities.getById(params.sourId)
      if (!window.MSIMEarth.defined(targetMEntity)) return
      const DF = new DrawFanShape(window.EarthViewer, 'pan')
      let color = params.color || [0, 255, 255]
      DF.createDynamicPan({
        id: params.sourId + 'pan' + params.type,
        entity: targetMEntity,
        color: new window.MSIMEarth.Color(
          color[0] / 255,
          color[1] / 255,
          color[2] / 255,
          0.3
        ),
        radius: params.radius || 1000000,
        angle: params.angle || 90
      })
    }
  }
  //
  /**
   * 指挥链路 添加指挥链路动作
   * @param {*} params
   */
  creatNetToSource(params) {
    //此处获取datasource  是因为第一次加载卫星使用的是czml  现在已不使用czml方式
    let sourceSource = window.EarthViewer.dataSources.getByName(params.sourType)
    let targetSource = window.EarthViewer.dataSources.getByName(params.targType)
    if (sourceSource.length == 0 || targetSource.length == 0) return
    //获取实体
    let entity1 = sourceSource[0].entities.getById(params.sourID)
    let entity2 = targetSource[0].entities.getById(params.targID)
    if (
      !window.MSIMEarth.defined(entity1) ||
      !window.MSIMEarth.defined(entity2)
    )
      return

    //改变位置
    function changePos() {
      // if (!viewer.dataSources.contains(params.net)) {
      //   window.EarthViewer.clock.shouldAnimate = true
      //   return
      // }
      let position
      let entityPos1 = entity1.position.getValue(
        window.EarthViewer.clock.currentTime
      )
      let entityPos2 = entity2.position.getValue(
        window.EarthViewer.clock.currentTime
      )
      if (!entityPos1 || !entityPos2) return
      if (
        typeof entityPos1.x === 'undefined' ||
        typeof entityPos1.y === 'undefined' ||
        typeof entityPos1.z === 'undefined'
      ) {
        return
      }
      if (
        typeof entityPos2.x === 'undefined' ||
        typeof entityPos2.y === 'undefined' ||
        typeof entityPos2.z === 'undefined'
      ) {
        return
      }
      position = [entityPos1, entityPos2]

      return position
    }
    // let mixColor =
    //   entity1.point.color._value ||
    //   new window.Cesium.Color(0 / 255, 0 / 255, 255 / 255, 1.0)
    let mixColor = params.netColor

    let lineEntity = window.EarthViewer.entities.getById(
      `${params.sourID}==${params.sourType}==${params.targID}==${params.targType}`
    )
    let polylinegraph = {
      positions: new window.MSIMEarth.CallbackProperty(changePos, false),
      arcType: window.MSIMEarth.ArcType.NONE,
      width: 15,
      material: new window.MSIMEarth.FlowLineMaterialProperty({
        transparent: true,
        mixColor: mixColor,
        repeat: new window.MSIMEarth.Cartesian2(8, 8),
        mixRatio: 0.9,
        flowSpeed: 5,
        image: require('/public/static/image/texture/materialline.png')
      })
    }
    let polylinegraphReverse = {
      positions: new window.Cesium.CallbackProperty(changePos, false),
      // arcType: window.Cesium.ArcType.NONE,
      width: 15,
      material: new window.MSIMEarth.FlowLineMaterialProperty({
        transparent: true,
        mixColor: mixColor,
        repeat: new window.MSIMEarth.Cartesian2(8, 8),
        mixRatio: 0.9,
        flowSpeed: -5,
        image: require('/public/static/image/texture/materiallineR.png')
      })
    }
    // console.log(lineEntity)
    if (lineEntity) {
      lineEntity.polyline = polylinegraph
      let reverseId = `reverse${params.sourID}==${params.sourType}==${params.targID}==${params.targType}`
      let reverseEn = window.EarthViewer.entities.getById(reverseId)
      if (reverseEn) return
      window.EarthViewer.entities.add({
        id: reverseId,
        polyline: polylinegraphReverse
      })
      // params.net.entities.push({id: })
    }
    // else {
    //   params.net.entities.add({
    //     id: `${params.sourID}==${params.sourType}==${params.targID}==${params.targType}`,
    //     polyline: polylinegraph
    //   })
    // }
  }
  /**
   * 锁定目标
   * @param {*} params
   */
  createLockEntity(params) {
    // 改方法需要扩展效果为：锁定目标显示状态值为被锁定，可以是label值里的一个属性，下面的效果只是作为被锁定时的一个可视化效果
    let that = this
    const entityMethod = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
    let entity = entityMethod.getCZMLEntity(
      params.sourId,
      'MSIMEarthCZMLProcessContainer'
    )
    if (!entity) return
    // this.lockEntity()
    function changePos() {
      let entityPos = entity.position._value
        ? entity.position._value
        : entity.position.getValue(that.viewer.clock.currentTime)
      return entityPos
    }
    function changeHeight() {
      if (!entity.position) return
      let entityPos = entity.position._value
        ? entity.position._value
        : entity.position.getValue(window.EarthViewer.clock.currentTime)
      if (!entityPos) return
      if (
        typeof entityPos.x === 'undefined' ||
        typeof entityPos.y === 'undefined' ||
        typeof entityPos.z === 'undefined'
      ) {
        return
      }
      let entityCartographic =
        window.MSIMEarth.Cartographic.fromCartesian(entityPos)
      if (typeof entityCartographic.height === 'undefined') return
      let sourceAlt = entityCartographic.height
      return sourceAlt
    }

    let radius = params.radius || 1500
    let yz = 20
    var changeScale = function () {
      radius -= yz
      if (radius < 1000) {
        radius = 1000
      }
      return radius
    }
    this.viewer.entities.add({
      id: params.sourId + '_UELockInfo',
      name: '目标锁定',
      position: new that.Earth.CallbackProperty(changePos, false),
      // orientation: new Cesium.VelocityOrientationProperty(property), // 根据位置移动自动计算方向
      ellipse: {
        // semiMinorAxis: new that.Earth.CallbackProperty(changeScale, false),
        // semiMajorAxis: new that.Earth.CallbackProperty(changeScale, false),
        semiMinorAxis: radius,
        semiMajorAxis: radius,
        height: new window.MSIMEarth.CallbackProperty(changeHeight, false),
        material: new window.MSIMEarth.PulseMaterialProperty({
          // color: new window.MSIMEarth.Color(0.2, 0.0, 1.0, 1.0),//蓝方锁定
          //color: new window.MSIMEarth.Color(0.8, 0.1, 0.1, 1.0),
          color: new window.MSIMEarth.Color(255 / 255, 255 / 255, 0 / 255, 0.1),
          // mixColor: new window.MSIMEarth.Color(
          //   227 / 255,
          //   62 / 255,
          //   49 / 255,
          //   1.0
          // ),
          mixColor: new window.MSIMEarth.Color(
            // 165 / 255,
            // 160 / 255,
            // 79 / 255,
            // 1.0
            0 / 255,
            255 / 255,
            15 / 255,
            1.0
          ),
          repeat: new window.MSIMEarth.Cartesian2(1.0, 1.0),
          // half: false,
          flowSpeed: -205,
          transparent: true,
          distanceDisplayCondition:
            new window.MSIMEarth.DistanceDisplayCondition(20e5, 1000e5)
        })
        // material: new that.Earth.RotateMaterialProperty({
        //   image: 'static/image/texture/target.png',
        //   flowSpeed: 3.0,
        //   reverse: -1.0,
        //   transparent: true
        // })
        // material: new window.MSIMEarth.TargetMaterialProperty({
        //   // tColor: new window.MSIMEarth.Color(0.933, 0.01, 0.106, 1.0),
        //   tColor: new window.MSIMEarth.Color(1.0, 1.0, 0.1, 1.0),
        //   transparent: true
        // })
      }
    })
    setTimeout(() => {
      this.viewer.entities.removeById(params.sourId + '_UELockInfo')
    }, 2000)
  }
  /**
   * 锁定目标雪碧图方式
   * @param {*} params
   */
  createLockSprite(params) {
    // 改方法需要扩展效果为：锁定目标显示状态值为被锁定，可以是label值里的一个属性，下面的效果只是作为被锁定时的一个可视化效果
    let that = this
    const entityMethod = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
    let entity = entityMethod.getCZMLEntity(
      params.sourId,
      'MSIMEarthCZMLProcessContainer'
    )
    if (!entity) return
    let entityPos = entity.position._value
      ? entity.position._value
      : entity.position.getValue(that.viewer.clock.currentTime)
    entityMethod.createFocus(entityPos, params.sourId)
  }
  /**
   * 扩展锁定目标雪碧图方式
   * @param {*} params
   */
  createLockSpriteExtend(params) {
    // 改方法需要扩展效果为：锁定目标显示状态值为被锁定，可以是label值里的一个属性，下面的效果只是作为被锁定时的一个可视化效果
    let that = this
    const entityMethod = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
    let entity = entityMethod.getCZMLEntity(
      params.sourId,
      'MSIMEarthCZMLProcessContainer'
    )
    if (!entity) return
    let entityPos = entity.position._value
      ? entity.position._value
      : entity.position.getValue(that.viewer.clock.currentTime)
    entityMethod.createFocusExtend({
      position: entityPos,
      id: params.sourId,
      image: require('@/utils/earthPlugin/Assets/image/mz.png')
    })
  }
  /**
   * 删除锁定目标
   * @param {*} params
   */
  revmoeLockEntity(sourId) {
    if (window.EarthViewer.entities.getById(sourId + '_UELockInfo')) {
      window.EarthViewer.entities.removeById(sourId + '_UELockInfo')
    }
  }

  // 定位
  lockEntity(entity) {
    let sourceLngLat = entity.position._value
      ? entity.position._value
      : entity.position.getValue(window.EarthViewer.clock.currentTime)
    let entityCartographic =
      window.MSIMEarth.Cartographic.fromCartesian(sourceLngLat)
    window.EarthViewer.camera.setView({
      destination: new window.MSIMEarth.Cartesian3.fromDegrees(
        window.MSIMEarth.Math.toDegrees(entityCartographic.longitude),
        window.MSIMEarth.Math.toDegrees(entityCartographic.latitude),
        entityCartographic.height
      )
    })
  }
}
