import store from '@/store'
export default class ConnectLine {
  constructor(options) {
    // this.curLineState = 'straight'
  }
  /**
   * 添加链路流动线
   * @param {*} params
   * @returns
   */
  addLine(params) {
    let that = this
    let viewer = window.EarthViewer
    if (
      typeof params.type === 'undefined' ||
      typeof params.sourId === 'undefined' ||
      typeof params.targetId === 'undefined'
    ) {
      console.log(
        `addline缺少打击目标的必要属性--type${params.type}--sourId${params.sourId}--targetId${params.targetId}`
      )
      return
    }
    let linkId = `${params.type}==${params.sourId}==${params.targetId}`
    let hasLink = viewer.entities.getById(linkId)
    if (hasLink) return

    const entityMethod = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
    let addLineEntity1, addLineEntity2

    let showRef = params.show // 控制实时显隐的属性
    let repeatNum = params.repeat || 1
    let repeat = new window.MSIMEarth.Cartesian2(repeatNum, repeatNum)

    // 为了更好的控制链路显隐，需要基于showref之上再添加一层显隐控制，
    // 当前的链路显隐是通过遍历entities.id，对包含链路特定id群体进行显隐控制，每次接到新的链路消息即便当前处于隐藏状态仍然会展示最新链路
    // 增加的这一层级是想通过store/scene内的属性值在初始化层面判定显隐，以保证链路显隐控制
    //showref = store.getters.getLinkState
    let linkWidth = (params.width || 15) / store.getters.getLinkWidthScale // 根据不同席位会（目前主要是2D/3D显示区别）设定宽度
    // let missilePath = computeFlyline([targetLng, targetLat], [sourceLng, sourceLat], 80000)
    //console.log('线宽比例', store.getters.getLinkWidthScale)
    let mixColor = params.color || window.MSIMEarth.Color.RED
    let imgUrl = require('/public/static/image/texture/通信.png')
    switch (params.type) {
      case 'RE_STrackInit':
        imgUrl = require('/public/static/image/texture/RE_STrackInit.png')
        repeat = new window.MSIMEarth.Cartesian2(1, 1)
        linkWidth = 3
        break
      case 'RE_WeaponF':
        imgUrl = require('/public/static/image/texture/RE_WeaponF.png')
        params.speed = 2
        // repeat = new window.MSIMEarth.Cartesian2(4, 4)
        break
      case 'RE_JamA':
        imgUrl = require('/public/static/image/texture/RE_JamA.png')
        params.speed = 0.1
        break
      case 'RE_MR':
        imgUrl = require('/public/static/image/texture/RE_MR4.png')
        break
      default:
        break
    }
    let entity = window.EarthPlugn.entity._GetCZMLEntity(
      params.sourId,
      'MSIMEarthCZMLProcessContainer'
    )
    // 如果是红方登录且实体隐藏，即便当前状态为true仍然隐藏
    let user = window.localStorage.getItem('side')
    if (entity && user === 'red' && entity.show === false) {
      showRef = entity.show
    }
    if (params.type === 'RE_WeaponF') {
      if (params.side) {
        switch (params.side) {
          case 'red':
            mixColor = window.MSIMEarth.Color.RED.withAlpha(0.3)
            break
          case 'blue':
            mixColor = window.MSIMEarth.Color.BLUE.withAlpha(0.3)
            break
          case 'green':
            mixColor = window.MSIMEarth.Color.GREEN.withAlpha(0.3)
            break
          case 'purple':
            mixColor = window.MSIMEarth.Color.PURPLE.withAlpha(0.3)
            break
          default:
            mixColor = window.MSIMEarth.Color.WHITE
            break
        }
      }
      window.EarthViewer.entities.add({
        id: linkId,
        show: showRef,
        polyline: {
          positions: new window.MSIMEarth.CallbackProperty(
            addLineChangePos,
            false
          ),
          arcType: window.MSIMEarth.ArcType.NONE,
          width: 1,
          material: mixColor,
          distanceDisplayCondition:
            new window.MSIMEarth.DistanceDisplayCondition(0, 80e5)
        }
      })
    } else {
      if (params.side) {
        switch (params.side) {
          case 'red':
            mixColor = window.MSIMEarth.Color.RED
            break
          case 'blue':
            mixColor = new window.MSIMEarth.Color(
              7 / 255,
              173 / 255,
              225 / 255,
              1
            )
            break
          case 'green':
            mixColor = window.MSIMEarth.Color.GREEN
            break
          case 'purple':
            mixColor = window.MSIMEarth.Color.PURPLE
            break
          default:
            mixColor = window.MSIMEarth.Color.WHITE
            break
        }
      }
      window.EarthViewer.entities.add({
        id: linkId,
        show: showRef,
        polyline: {
          positions: new window.MSIMEarth.CallbackProperty(
            addLineChangePos,
            false
          ),
          arcType: window.MSIMEarth.ArcType.NONE,
          width: linkWidth,
          material: new window.MSIMEarth.FlowLineMaterialProperty({
            transparent: true,
            mixColor: mixColor || window.MSIMEarth.Color.WHITE,
            // repeat: new window.MSIMEarth.Cartesian2(8, 8),
            repeat: repeat,
            mixRatio: params.mix || 0.5,
            flowSpeed: params.speed ? params.speed : 5,
            image: imgUrl || params.materialImg
          }),
          distanceDisplayCondition:
            new window.MSIMEarth.DistanceDisplayCondition(0, 80e5)
        }
      })
    }

    function addLineChangePos() {
      if (
        typeof params.type === 'undefined' ||
        typeof params.sourId === 'undefined' ||
        typeof params.targetId === 'undefined'
      )
        return
      addLineEntity1 =
        entityMethod.getCZMLEntity(
          params.sourId,
          'MSIMEarthCZMLProcessContainer'
        ) || viewer.entities.getById(params.sourId)
      addLineEntity2 =
        entityMethod.getCZMLEntity(
          params.targetId,
          'MSIMEarthCZMLProcessContainer'
        ) || viewer.entities.getById(params.targetId)

      if (
        !window.MSIMEarth.defined(addLineEntity1) ||
        !window.MSIMEarth.defined(addLineEntity2)
      )
        return
      if (
        !window.MSIMEarth.defined(addLineEntity1.position) ||
        !window.MSIMEarth.defined(addLineEntity2.position)
      )
        return
      let entityPos1 = addLineEntity1.position._value
        ? addLineEntity1.position._value
        : addLineEntity1.position.getValue(viewer.clock.currentTime)
      let entityPos2 = addLineEntity2.position._value
        ? addLineEntity2.position._value
        : addLineEntity2.position.getValue(viewer.clock.currentTime)
      if (!entityPos1 || !entityPos2) return
      // 直线曲线切换
      let position
      if (
        params.type == 'RE_LTrackInit' ||
        params.type == 'RE_WeaponF' ||
        params.type == 'RE_JamS' ||
        params.type == 'RE_MR'
      ) {
        let entityCartographic =
          new window.MSIMEarth.Cartographic.fromCartesian(entityPos1)
        let sourceLng = window.MSIMEarth.Math.toDegrees(
          entityCartographic.longitude
        )
        let sourceLat = window.MSIMEarth.Math.toDegrees(
          entityCartographic.latitude
        )
        let sourceAlt = entityCartographic.height
        let entity1Cartographic =
          new window.MSIMEarth.Cartographic.fromCartesian(entityPos2)
        let destinateLng = window.MSIMEarth.Math.toDegrees(
          entity1Cartographic.longitude
        )
        let destinateLat = window.MSIMEarth.Math.toDegrees(
          entity1Cartographic.latitude
        )
        let destinateAlt = entity1Cartographic.height
        let curLineState = store.state.sceneModule.curDetectLineState
        if (curLineState == 'straight') {
          position = [entityPos1, entityPos2]
        } else if (curLineState == 'parabola') {
          position = that.computeFlyline(
            [sourceLng, sourceLat, sourceAlt],
            [destinateLng, destinateLat, destinateAlt],
            20000
          )
        }
      } else {
        position = [entityPos1, entityPos2]
      }
      // 只直线
      // let position = [entityPos1, entityPos2]
      return position
    }
  }
  /**
   * 通过动态射线方式实现链路
   * @param {object} params (earth viewer)
   */
  addLineByRay(params) {
    let that = this
    let viewer = window.EarthViewer
    if (
      typeof params.type === 'undefined' ||
      typeof params.sourId === 'undefined' ||
      typeof params.targetId === 'undefined'
    ) {
      console.log(
        `addline缺少打击目标的必要属性--type${params.type}--sourId${params.sourId}--targetId${params.targetId}`
      )
      return
    }
    // 标牌弹出
    // beautyToast.info({
    //   title: '通信',
    //   message: params.sourId + params.msgSource,
    //   darkTheme: true
    // })
    let startOptions = {
      entityId: params.sourId,
      czmlSource: 'MSIMEarthCZMLProcessContainer',
      type: params.type || 'SDC',
      title: params.sourId,
      msg: params.msgSource
    }
    // window.sceneAction.popUp.setStyleEffect(startOptions)
    // setTimeout(() => {
    //   // 清除
    //   sceneAction.connectLineManagement.removeStrikePlan({
    //     sourId: params.sourId,
    //     targetId: params.targetId,
    //     type: params.type || 'SDC'
    //   })
    //   window.sceneAction.popUp.cancleStyleEffect(startOptions)
    // }, params.startPopTime || 2000)
    let linkId = `${params.type}==${params.sourId}==${params.targetId}Ray`
    let hasLink = viewer.entities.getById(linkId)
    if (hasLink) return

    const entityMethod = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
    let addLineEntity1, addLineEntity2

    let showref = params.show // 控制实时显隐的属性
    let repeatNum = params.repeat || 2
    let repeat = new window.MSIMEarth.Cartesian2(repeatNum, repeatNum)

    // 为了更好的控制链路显隐，需要基于showref之上再添加一层显隐控制，
    // 当前的链路显隐是通过遍历entities.id，对包含链路特定id群体进行显隐控制，每次接到新的链路消息即便当前处于隐藏状态仍然会展示最新链路
    // 增加的这一层级是想通过store/scene内的属性值在初始化层面判定显隐，以保证链路显隐控制
    //showref = store.getters.getLinkState
    const linkWidthRay =
      (params.Raywidth || 6) / store.getters.getLinkWidthScale // 根据不同席位会（目前主要是2D/3D显示区别）设定宽度

    // let missilePath = computeFlyline([targetLng, targetLat], [sourceLng, sourceLat], 80000)
    //console.log('线宽比例', store.getters.getLinkWidthScale)
    let mixColor = params.color || window.MSIMEarth.Color.RED
    window.EarthViewer.entities.add({
      position: new window.MSIMEarth.CallbackProperty(changePosition, false),
      id: linkId,
      show: showref,
      polyline: {
        positions: new window.MSIMEarth.CallbackProperty(
          addLineChangePos,
          false
        ),
        arcType: window.MSIMEarth.ArcType.NONE,
        width: 1,
        material: mixColor
      }
      // ellipse: {
      //   semiMinorAxis: params.radius || 100000,
      //   semiMajorAxis: params.radius || 100000,
      //   material: new window.MSIMEarth.MultiCircleMaterialProperty({
      //     color: mixColor, // 127, 255, 212
      //     repeat: new window.MSIMEarth.Cartesian2(4.0, 4.0),
      //     half: true,
      //     flowSpeed: 0.2,
      //     transparent: 0.8
      //   }),
      //   // fill: true,
      //   height: new window.MSIMEarth.CallbackProperty(changeHeight, false)
      // }
    })
    // 长度百分比，当达到1时不再增加
    let LengthPercentage = 0.0001
    function addLineChangePos() {
      if (
        typeof params.type === 'undefined' ||
        typeof params.sourId === 'undefined' ||
        typeof params.targetId === 'undefined'
      )
        return
      addLineEntity1 =
        entityMethod.getCZMLEntity(
          params.sourId,
          'MSIMEarthCZMLProcessContainer'
        ) || viewer.entities.getById(params.sourId)
      addLineEntity2 =
        entityMethod.getCZMLEntity(
          params.targetId,
          'MSIMEarthCZMLProcessContainer'
        ) || viewer.entities.getById(params.targetId)

      if (
        !window.MSIMEarth.defined(addLineEntity1) ||
        !window.MSIMEarth.defined(addLineEntity2)
      )
        return
      if (
        !window.MSIMEarth.defined(addLineEntity1.position) ||
        !window.MSIMEarth.defined(addLineEntity2.position)
      )
        return
      let entityPos1 = addLineEntity1.position._value
        ? addLineEntity1.position._value
        : addLineEntity1.position.getValue(viewer.clock.currentTime)
      let entityPos2 = addLineEntity2.position._value
        ? addLineEntity2.position._value
        : addLineEntity2.position.getValue(viewer.clock.currentTime)
      if (!entityPos1 || !entityPos2) return
      // 直线曲线切换
      let position
      if (
        params.type == 'RE_LTrackInit' ||
        params.type == 'RE_WeaponF' ||
        params.type == 'RE_JamS' ||
        params.type == 'RE_MR'
      ) {
        let entityCartographic =
          new window.MSIMEarth.Cartographic.fromCartesian(entityPos1)
        let sourceLng = window.MSIMEarth.Math.toDegrees(
          entityCartographic.longitude
        )
        let sourceLat = window.MSIMEarth.Math.toDegrees(
          entityCartographic.latitude
        )
        let sourceAlt = entityCartographic.height
        let entity1Cartographic =
          new window.MSIMEarth.Cartographic.fromCartesian(entityPos2)
        let destinateLng = window.MSIMEarth.Math.toDegrees(
          entity1Cartographic.longitude
        )
        let destinateLat = window.MSIMEarth.Math.toDegrees(
          entity1Cartographic.latitude
        )
        let destinateAlt = entity1Cartographic.height
        let curLineState = store.state.sceneModule.curDetectLineState
        // 根据长度百分比计算目标位置 entityPos2
        let destinateLngPercentage =
          sourceLng + (destinateLng - sourceLng) * LengthPercentage
        let destinateLatPercentage =
          sourceLat + (destinateLat - sourceLat) * LengthPercentage
        let destinateAltPercentage =
          sourceAlt + (destinateAlt - sourceAlt) * LengthPercentage
        if (curLineState == 'straight') {
          entityPos2 = window.MSIMEarth.Cartesian3.fromDegrees(
            destinateLngPercentage,
            destinateLatPercentage,
            destinateAltPercentage
          )
          position = [entityPos1, entityPos2]
        } else if (curLineState == 'parabola') {
          position = that.computeFlyline(
            [sourceLng, sourceLat, sourceAlt],
            [destinateLngPercentage, destinateLatPercentage, destinateAlt],
            20000
          )
        }
      } else {
        let entityCartographic =
          new window.MSIMEarth.Cartographic.fromCartesian(entityPos1)
        let sourceLng = window.MSIMEarth.Math.toDegrees(
          entityCartographic.longitude
        )
        let sourceLat = window.MSIMEarth.Math.toDegrees(
          entityCartographic.latitude
        )
        let sourceAlt = entityCartographic.height
        let entity2Cartographic =
          new window.MSIMEarth.Cartographic.fromCartesian(entityPos2)
        let destinateLng = window.MSIMEarth.Math.toDegrees(
          entity2Cartographic.longitude
        )
        let destinateLat = window.MSIMEarth.Math.toDegrees(
          entity2Cartographic.latitude
        )
        let destinateAlt = entity2Cartographic.height
        // 根据长度百分比计算目标位置 entityPos2
        let destinateLngPercentage =
          sourceLng + (destinateLng - sourceLng) * LengthPercentage
        let destinateLatPercentage =
          sourceLat + (destinateLat - sourceLat) * LengthPercentage
        let destinateAltPercentage =
          sourceAlt + (destinateAlt - sourceAlt) * LengthPercentage
        entityPos2 = window.MSIMEarth.Cartesian3.fromDegrees(
          destinateLngPercentage,
          destinateLatPercentage,
          destinateAltPercentage
        )
        position = [entityPos1, entityPos2]
      }
      // 只直线
      // let position = [entityPos1, entityPos2]
      if (LengthPercentage < 1) {
        LengthPercentage += 0.03
      } else {
        // 清除当前绘制的连接线并调用addLine重新绘制
        window.EarthViewer.entities.removeById(linkId)
        // that.addLine(params)
        //生长动作完成后目标平台弹窗（即模拟收到对应指令）
        // window.sceneAction.popUp.setStyleEffect(params.endOptions)
        setTimeout(() => {
          // 清除
          sceneAction.connectLineManagement.removeStrikePlan({
            sourId: params.sourId,
            targetId: params.targetId,
            type: params.type || 'SDC'
          })
          // window.sceneAction.popUp.cancleStyleEffect(params.endOptions)
        }, params.endOptions.endPopTime || 2000)
      }
      return position
    }
    // 获取连线起点位置
    function changePosition() {
      if (
        typeof params.type === 'undefined' ||
        typeof params.sourId === 'undefined' ||
        typeof params.targetId === 'undefined'
      )
        return
      addLineEntity1 =
        entityMethod.getCZMLEntity(
          params.sourId,
          'MSIMEarthCZMLProcessContainer'
        ) || viewer.entities.getById(params.sourId)

      if (!window.MSIMEarth.defined(addLineEntity1)) return
      if (!window.MSIMEarth.defined(addLineEntity1.position)) return
      let entityPos1 = addLineEntity1.position._value
        ? addLineEntity1.position._value
        : addLineEntity1.position.getValue(viewer.clock.currentTime)
      if (!entityPos1) return
      return entityPos1
    }
    // 获取连线起点高度
    function changeHeight() {
      if (
        typeof params.type === 'undefined' ||
        typeof params.sourId === 'undefined' ||
        typeof params.targetId === 'undefined'
      )
        return
      addLineEntity1 =
        entityMethod.getCZMLEntity(
          params.sourId,
          'MSIMEarthCZMLProcessContainer'
        ) || viewer.entities.getById(params.sourId)

      if (!window.MSIMEarth.defined(addLineEntity1)) return
      if (!window.MSIMEarth.defined(addLineEntity1.position)) return
      let entityPos1 = addLineEntity1.position._value
        ? addLineEntity1.position._value
        : addLineEntity1.position.getValue(viewer.clock.currentTime)
      if (!entityPos1) return
      if (
        typeof entityPos1.x === 'undefined' ||
        typeof entityPos1.y === 'undefined' ||
        typeof entityPos1.z === 'undefined'
      ) {
        return
      }
      let entityCartographic =
        new window.MSIMEarth.Cartographic.fromCartesian(entityPos1)
      if (typeof entityCartographic.height === 'undefined') return
      let sourceAlt = entityCartographic.height
      return sourceAlt
    }
    // 获取连线终点位置
    function changePositionEnd() {
      if (
        typeof params.type === 'undefined' ||
        typeof params.sourId === 'undefined' ||
        typeof params.targetId === 'undefined'
      )
        return
      addLineEntity2 =
        entityMethod.getCZMLEntity(
          params.targetId,
          'MSIMEarthCZMLProcessContainer'
        ) || viewer.entities.getById(params.targetId)

      if (!window.MSIMEarth.defined(addLineEntity2)) return
      if (!window.MSIMEarth.defined(addLineEntity2.position)) return
      let entityPosEnd = addLineEntity2.position._value
        ? addLineEntity2.position._value
        : addLineEntity2.position.getValue(viewer.clock.currentTime)
      if (!entityPosEnd) return
      return entityPosEnd
    }
    // 获取连线终点高度
    function changeHeightEnd() {
      if (
        typeof params.type === 'undefined' ||
        typeof params.sourId === 'undefined' ||
        typeof params.targetId === 'undefined'
      )
        return
      addLineEntity2 =
        entityMethod.getCZMLEntity(
          params.targetId,
          'MSIMEarthCZMLProcessContainer'
        ) || viewer.entities.getById(params.targetId)

      if (!window.MSIMEarth.defined(addLineEntity2)) return
      if (!window.MSIMEarth.defined(addLineEntity2.position)) return
      let entityPosEnd = addLineEntity2.position._value
        ? addLineEntity2.position._value
        : addLineEntity2.position.getValue(viewer.clock.currentTime)
      if (!entityPosEnd) return
      if (
        typeof entityPosEnd.x === 'undefined' ||
        typeof entityPosEnd.y === 'undefined' ||
        typeof entityPosEnd.z === 'undefined'
      ) {
        return
      }
      let entityCartographicEnd =
        new window.MSIMEarth.Cartographic.fromCartesian(entityPosEnd)
      if (typeof entityCartographicEnd.height === 'undefined') return
      let sourceAltEnd = entityCartographicEnd.height
      return sourceAltEnd
    }
  }
  /**
   * 指令流动线 源信息与目标信息
   * @param {*} params
   * @returns
   */
  addCommConLineBySourTarget(params) {
    let that = this
    let viewer = window.EarthViewer
    let linkId = `${params.sourId}==${params.targetId}`
    let hasLink = viewer.entities.getById(linkId)
    if (hasLink) return

    const entityMethod = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
    let CommConLineEntity1, CommConLineEntity2

    let showref = params.show
    let repeatNum = params.repeat || 8
    let repeat = new window.MSIMEarth.Cartesian2(repeatNum, repeatNum)
    // let missilePath = computeFlyline([targetLng, targetLat], [sourceLng, sourceLat], 80000)
    let mixColor = params.color || window.MSIMEarth.Color.RED
    params.width = 3
    let b = window.EarthViewer.entities.add({
      id: linkId,
      polyline: {
        show: showref,
        positions: new window.MSIMEarth.CallbackProperty(
          CommConLineChangePos,
          false
        ),
        arcType: window.MSIMEarth.ArcType.NONE,
        width: params.width || 15,
        material: new window.MSIMEarth.FlowLineMaterialProperty({
          transparent: true,
          mixColor: mixColor,
          repeat: repeat,
          mixRatio: 0.9,
          flowSpeed: -5,
          image: require('/public/static/image/texture/materialline.png')
        })
      }
    })
    // if (params.type == 'RE_JamS') {
    // 	console.log(b);
    // }
    function CommConLineChangePos() {
      if (
        typeof params.sourId === 'undefined' ||
        typeof params.targetId === 'undefined'
      )
        return
      CommConLineEntity1 = entityMethod.getCZMLEntity(
        params.sourId,
        'MSIMEarthCZMLProcessContainer'
      )
      CommConLineEntity2 = entityMethod.getCZMLEntity(
        params.targetId,
        'MSIMEarthCZMLProcessContainer'
      )

      if (
        !window.MSIMEarth.defined(CommConLineEntity1) ||
        !window.MSIMEarth.defined(CommConLineEntity2)
      )
        return
      if (
        !window.MSIMEarth.defined(CommConLineEntity1.position) ||
        !window.MSIMEarth.defined(CommConLineEntity2.position)
      )
        return
      let entityPos1 = CommConLineEntity1.position._value
        ? CommConLineEntity1.position._value
        : CommConLineEntity1.position.getValue(viewer.clock.currentTime)
      let entityPos2 = CommConLineEntity2.position._value
        ? CommConLineEntity2.position._value
        : CommConLineEntity2.position.getValue(viewer.clock.currentTime)
      if (!entityPos1 || !entityPos2) return
      // 直线曲线切换
      let position
      if (
        params.type == 'RE_LTrackInit' ||
        params.type == 'RE_WeaponF' ||
        params.type == 'RE_JamS'
      ) {
        let entityCartographic =
          new window.MSIMEarth.Cartographic.fromCartesian(entityPos1)
        let sourceLng = window.MSIMEarth.Math.toDegrees(
          entityCartographic.longitude
        )
        let sourceLat = window.MSIMEarth.Math.toDegrees(
          entityCartographic.latitude
        )
        let sourceAlt = entityCartographic.height
        let entity1Cartographic =
          new window.MSIMEarth.Cartographic.fromCartesian(entityPos2)
        let destinateLng = window.MSIMEarth.Math.toDegrees(
          entity1Cartographic.longitude
        )
        let destinateLat = window.MSIMEarth.Math.toDegrees(
          entity1Cartographic.latitude
        )
        let destinateAlt = entity1Cartographic.height
        let curLineState = store.state.sceneModule.curDetectLineState
        if (curLineState == 'straight') {
          position = [entityPos1, entityPos2]
        } else if (curLineState == 'parabola') {
          position = that.computeFlyline(
            [sourceLng, sourceLat, sourceAlt],
            [destinateLng, destinateLat, destinateAlt],
            20000
          )
        }
      } else {
        position = [entityPos1, entityPos2]
      }
      // 只直线
      // let position = [entityPos1, entityPos2]
      return position
    }
  }
  /**
   * 指令流动线 只有源信息，线的另一端是固定位置点信息
   * @param {*} params
   * @returns
   */
  addCommConLineBySourFixedPostion(params) {
    let viewer = window.EarthViewer
    let linkId = `${params.sourId}==wzInfo`
    let hasLink = viewer.entities.getById(linkId)
    if (hasLink) return
    const entityMethod = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
    let SourFixedPostionEntity1
    let showref = params.show
    let repeatNum = params.repeat || 8
    let repeat = new window.MSIMEarth.Cartesian2(repeatNum, repeatNum)
    let mixColor = params.color || window.MSIMEarth.Color.RED
    let b = window.EarthViewer.entities.add({
      id: linkId,
      polyline: {
        show: showref,
        positions: new window.MSIMEarth.CallbackProperty(changePos, false),
        arcType: window.MSIMEarth.ArcType.NONE,
        width: params.width || 15,
        material: new window.MSIMEarth.FlowLineMaterialProperty({
          transparent: true,
          mixColor: mixColor,
          repeat: repeat,
          mixRatio: 0.9,
          flowSpeed: -5,
          image: require('/public/static/image/texture/materialline.png')
        })
      }
    })

    function changePos() {
      SourFixedPostionEntity1 = entityMethod.getCZMLEntity(
        params.sourId,
        'MSIMEarthCZMLProcessContainer'
      )
      if (!window.MSIMEarth.defined(SourFixedPostionEntity1)) return
      if (!window.MSIMEarth.defined(SourFixedPostionEntity1.position)) return
      let entityPos1 = SourFixedPostionEntity1.position._value
        ? SourFixedPostionEntity1.position._value
        : SourFixedPostionEntity1.position.getValue(viewer.clock.currentTime)
      if (!entityPos1) return
      let position
      // 只直线
      position = [entityPos1, params.entityPos2]
      return position
    }
  }
  /**
   * 删除 指令流动线 涉及源与目标两个位置连线
   * @param {*} params
   */
  removeCommControlLine(params) {
    let linkId = `${params.sourId}==${params.targetId}`
    let hasLink = window.EarthViewer.entities.getById(linkId)
    if (hasLink) {
      let a = window.EarthViewer.entities.removeById(
        `${params.sourId}==${params.targetId}`
      )
      // console.log('删除线',a);
    }
  }
  removeStrikePlan(params) {
    let a = window.EarthViewer.entities.removeById(
      `${params.type}==${params.sourId}==${params.targetId}`
    )
    // console.log('删除线',a);
  }
  showEntityByKeyword(key, show) {
    window.EarthViewer.entities.values.forEach((item) => {
      if (item.id.includes(key)) {
        item.show = show
      }
    })
  }

  showEntityByTwoKeyword(key1, key2, show) {
    let linkId = `${key1}==${key2}`
    window.EarthViewer.entities.values.forEach((item) => {
      if (item.id.startsWith(key1) && item.id.endsWith(key2)) {
        item.show = show
      }
    })
  }
  connecting(params) {
    let Cesium = window.MSIMEarth
    //
    // let sourceSource = viewer.dataSources.getByName(params.sourType)
    // let targetSource = viewer.dataSources.getByName(params.targType)
    // if (sourceSource.length == 0 || targetSource.length == 0) {
    //   return
    // }
    //获取实体

    if (
      typeof params.sourId === 'undefined' ||
      typeof params.targetId === 'undefined'
    ) {
      console.log(
        `connecting方法的缺少打击目标的必要属性--type${params.type}--sourId${params.sourId}--targetId${params.targetId}`
      )
      return
    }
    let entity1 = sourceSource[0].entities.getById(params.sourID)
    let entity2 = targetSource[0].entities.getById(params.targID)

    if (
      !window.MSIMEarth.defined(entity1) ||
      !window.MSIMEarth.defined(entity2)
    ) {
      return
    }

    let mixColor = params.netColor
    // window.EarthViewer.clock.shouldAnimate = false
    window.EarthViewer.entities.removeById(
      `${params.sourId}==${params.targetId}`
    )
    window.EarthViewer.entities.add({
      id: `${params.sourId}==${params.targetId}`,
      polyline: {
        positions: new window.MSIMEarth.CallbackProperty(changePos, false),
        arcType: window.MSIMEarth.ArcType.NONE,
        width: 10,
        material: new window.MSIMEarth.PolylineGlowMaterialProperty({
          color: mixColor,
          glowPower: 0.1
        })
      }
    })
    params.net.entities.push({
      id: `${params.sourID}==${params.targID}`
    })

    let sp = window.EarthViewer.clock.multiplier
    let stepNum = sp < 5 ? 100 - sp * 20 : 2
    let stepIndex = 1
    //改变位置
    function changePos() {
      if (
        typeof params.sourId === 'undefined' ||
        typeof params.targetId === 'undefined'
      ) {
        return
      }
      // if (!window.MSIMEarth.defined(params.net)) return
      let position
      if (
        !window.MSIMEarth.defined(entity1) ||
        !window.MSIMEarth.defined(entity2)
      )
        return
      let entityPos1 = entity1.position.getValue(viewer.clock.currentTime)
      let entityPos2 = entity2.position.getValue(viewer.clock.currentTime)
      if (!entityPos1 || !entityPos2) {
        return
      }
      let entityCartographic =
        new window.MSIMEarth.Cartographic.fromCartesian(entityPos1)
      let sourceLng = window.MSIMEarth.Math.toDegrees(
        entityCartographic.longitude
      )
      let sourceLat = window.MSIMEarth.Math.toDegrees(
        entityCartographic.latitude
      )
      let sourceAlt = entityCartographic.height
      let entity1Cartographic =
        new window.MSIMEarth.Cartographic.fromCartesian(entityPos2)
      let destinateLng = window.MSIMEarth.Math.toDegrees(
        entity1Cartographic.longitude
      )
      let destinateLat = window.MSIMEarth.Math.toDegrees(
        entity1Cartographic.latitude
      )
      let destinateAlt = entity1Cartographic.height
      let lngStep = (destinateLng - sourceLng) / stepNum
      let latStep = (destinateLat - sourceLat) / stepNum
      let altStep = (destinateAlt - sourceAlt) / stepNum
      let changelng = sourceLng,
        changelat = sourceLat,
        changealt = sourceAlt
      if (stepIndex < stepNum) {
        changelng += stepIndex * lngStep
        changelat += stepIndex * latStep
        changealt += stepIndex * altStep
      } else {
        changelng = destinateLng
        changelat = destinateLat
        changealt = destinateAlt
        showPoseFlag = true
      }
      stepIndex += 1
      position = window.MSIMEarth.Cartesian3.fromDegreesArrayHeights([
        sourceLng,
        sourceLat,
        sourceAlt,
        changelng,
        changelat,
        changealt
      ])
      return position
    }
  }
  distanceLabel(params) {
    if (
      typeof params.type === 'undefined' ||
      typeof params.sourId === 'undefined' ||
      typeof params.targetId === 'undefined'
    )
      return
    let that = this
    let distance = 0
    let text = ''
    let linkId = `distancelabel==${params.sourId}==${params.targetId}`
    let distanceEntity1, distanceEntity2
    window.EarthViewer.entities.removeById(linkId)
    let distanceLabel = window.EarthViewer.entities.add({
      id: linkId,
      show: params.show,
      position: new window.MSIMEarth.CallbackProperty(
        changeDistanceCenter,
        false
      ),
      label: {
        //文字标签
        font: 'normal 29px MicroSoft YaHei',
        text: '',
        style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        // outlineColor: new window.MSIMEarth.Color(
        //   store.getters.getStateInfoOutLineColor[0],
        //   store.getters.getStateInfoOutLineColor[1],
        //   store.getters.getStateInfoOutLineColor[2],
        //   store.getters.getStateInfoOutLineColor[3]
        // ),
        outlineColor: window.MSIMEarth.Color.BLACK,
        outlineWidth: store.getters.getStateInfoWidth,
        fillColor: new window.MSIMEarth.Color(
          store.getters.getMissileDistanceColor[0],
          store.getters.getMissileDistanceColor[1],
          store.getters.getMissileDistanceColor[2],
          store.getters.getMissileDistanceColor[3]
        ),
        scaleByDistance: new window.MSIMEarth.NearFarScalar(
          1000,
          1.2,
          100000,
          0.4
        )
      }
    })
    function changeDistanceCenter() {
      // 获取czml实体集合
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
        distanceEntity1 =
          entityMethod.getCZMLEntity(
            params.sourId,
            'MSIMEarthCZMLProcessContainer'
          ) || window.EarthViewer.entities.getById(params.sourId)
        distanceEntity2 =
          entityMethod.getCZMLEntity(
            params.targetId,
            'MSIMEarthCZMLProcessContainer'
          ) || window.EarthViewer.entities.getById(params.targetId)
      }

      if (
        !window.MSIMEarth.defined(distanceEntity1) ||
        !window.MSIMEarth.defined(distanceEntity2)
      )
        return

      if (
        typeof distanceEntity1 === 'undefined' ||
        typeof distanceEntity2 === 'undefined'
      )
        return
      // 如果目标隐藏状态则不获取实时距离
      if (!distanceEntity1.show || !distanceEntity2.show) return
      if (
        !window.MSIMEarth.defined(distanceEntity1.position) ||
        !window.MSIMEarth.defined(distanceEntity2.position)
      )
        return
      let entityPos1 = distanceEntity1.position._value
        ? distanceEntity1.position._value
        : distanceEntity1.position.getValue(
          window.EarthViewer.clock.currentTime
        )
      let entityPos2 = distanceEntity2.position._value
        ? distanceEntity2.position._value
        : distanceEntity2.position.getValue(
          window.EarthViewer.clock.currentTime
        )
      if (!entityPos1 || !entityPos2) return

      distance = that.getSpaceDistance([entityPos1, entityPos2])
      text =
        distance > 1000
          ? `${(distance / 1000).toFixed(0)}公里`
          : `${distance.toFixed(2)}米`
      distanceLabel.label.text = text
      let entityCartographic1 =
        new window.MSIMEarth.Cartographic.fromCartesian(entityPos1)
      let entityCartographic2 =
        new window.MSIMEarth.Cartographic.fromCartesian(entityPos2)

      let sourceLng = window.MSIMEarth.Math.toDegrees(
        entityCartographic1.longitude
      )
      let sourceLat = window.MSIMEarth.Math.toDegrees(
        entityCartographic1.latitude
      )
      let sourceAlt = entityCartographic1.height
      let sourceLng1 = window.MSIMEarth.Math.toDegrees(
        entityCartographic2.longitude
      )
      let sourceLat1 = window.MSIMEarth.Math.toDegrees(
        entityCartographic2.latitude
      )
      let sourceAlt1 = entityCartographic2.height
      let lng = (sourceLng + sourceLng1) / 2
      let lat = (sourceLat + sourceLat1) / 2
      let alt = (sourceAlt + sourceAlt1) / 2
      return window.MSIMEarth.Cartesian3.fromDegrees(lng, lat, alt)
    }
  }
  getSpaceDistance(positions) {
    let distance = 0
    for (var i = 0; i < positions.length - 1; i++) {
      var point1cartographic = new window.MSIMEarth.Cartographic.fromCartesian(
        positions[i]
      )
      var point2cartographic = new window.MSIMEarth.Cartographic.fromCartesian(
        positions[i + 1]
      )
      /**根据经纬度计算出距离**/
      var geodesic = new window.MSIMEarth.EllipsoidGeodesic()
      geodesic.setEndPoints(point1cartographic, point2cartographic)
      var s = geodesic.surfaceDistance
      //返回两点之间的距离
      s = Math.sqrt(
        Math.pow(s, 2) +
        Math.pow(point2cartographic.height - point1cartographic.height, 2)
      )
      distance = distance + s
    }
    return distance
  }
  // 两机 (目标与源) 距离
  sourAndTargetDistanceLabel(params) {
    if (
      typeof params.type === 'undefined' ||
      typeof params.sourId === 'undefined' ||
      typeof params.targetId === 'undefined'
    )
      return
    let that = this
    let distance = 0
    let text = ''
    let linkId = `${params.type}==${params.sourId}==${params.targetId}`
    let distanceEntity1, distanceEntity2
    window.EarthViewer.entities.removeById(linkId)
    let distanceLabel = window.EarthViewer.entities.add({
      id: linkId,
      show: params.show,
      position: new window.MSIMEarth.CallbackProperty(
        changeDistanceCenter,
        false
      ),
      label: {
        //文字标签
        font: 'normal 29px MicroSoft YaHei',
        text: '',
        style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        // outlineColor: new window.MSIMEarth.Color(
        //   store.getters.getStateInfoOutLineColor[0],
        //   store.getters.getStateInfoOutLineColor[1],
        //   store.getters.getStateInfoOutLineColor[2],
        //   store.getters.getStateInfoOutLineColor[3]
        // ),
        horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
        verticalOrigin: window.MSIMEarth.VerticalOrigin.verticalOrigin,
        pixelOffset: new window.MSIMEarth.Cartesian2(-50, 0),
        // style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        // fillColor: window.MSIMEarth.Color.WHITE,
        // outlineColor: window.MSIMEarth.Color.BLACK,
        style: window.MSIMEarth.LabelStyle.FILL,
        fillColor: window.MSIMEarth.Color.BLACK,
        outlineWidth: 5,
        showBackground: true,
        backgroundColor: window.MSIMEarth.Color.WHITE,
        disableDepthTestDistance: Number.POSITIVE_INFINITY,
        scaleByDistance: new window.MSIMEarth.NearFarScalar(
          1000,
          1.2,
          100000,
          0.4
        )
      }
    })
    function changeDistanceCenter() {
      // 获取czml实体集合
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
        distanceEntity1 =
          entityMethod.getCZMLEntity(
            params.sourId,
            'MSIMEarthCZMLProcessContainer'
          ) || window.EarthViewer.entities.getById(params.sourId)
        distanceEntity2 =
          entityMethod.getCZMLEntity(
            params.targetId,
            'MSIMEarthCZMLProcessContainer'
          ) || window.EarthViewer.entities.getById(params.targetId)
      }

      if (
        !window.MSIMEarth.defined(distanceEntity1) ||
        !window.MSIMEarth.defined(distanceEntity2)
      )
        return

      if (
        typeof distanceEntity1 === 'undefined' ||
        typeof distanceEntity2 === 'undefined'
      )
        return
      // 如果目标隐藏状态则不获取实时距离
      if (!distanceEntity1.show || !distanceEntity2.show) return
      if (
        !window.MSIMEarth.defined(distanceEntity1.position) ||
        !window.MSIMEarth.defined(distanceEntity2.position)
      )
        return
      let entityPos1 = distanceEntity1.position._value
        ? distanceEntity1.position._value
        : distanceEntity1.position.getValue(
          window.EarthViewer.clock.currentTime
        )
      let entityPos2 = distanceEntity2.position._value
        ? distanceEntity2.position._value
        : distanceEntity2.position.getValue(
          window.EarthViewer.clock.currentTime
        )
      if (!entityPos1 || !entityPos2) return

      distance = that.getSpaceDistance([entityPos1, entityPos2])
      text =
        distance > 1000
          ? `距目标距离: ${(distance / 1000).toFixed(1)}公里`
          : `距目标距离: ${distance.toFixed(2)}米`

      // 角度
      const firstPoint = cartesianToLngLat(entityPos1)
      const endPoints = cartesianToLngLat(entityPos2)
      let angelText = courseAngle(
        firstPoint[0],
        firstPoint[1],
        endPoints[0],
        endPoints[1]
      ).toFixed(1)
      angelText = '\n航向：' + Math.floor(angelText) + ' °'
      let altCha = Math.abs(firstPoint[2] - endPoints[2])
        ? Number(firstPoint[2] - endPoints[2]).toFixed(2)
        : '0'
      // Math.abs(firstPoint[2] - endPoints[2]).toFixed(2)
      let altChaStr = ''
      if (altCha != '0') {
        altChaStr = '\n高度差：' + Math.floor(altCha) + ' 米'
      }
      // 距离 角度 高度差
      distanceLabel.label.text = text + angelText + altChaStr
      let entityCartographic1 =
        new window.MSIMEarth.Cartographic.fromCartesian(entityPos1)
      let entityCartographic2 =
        new window.MSIMEarth.Cartographic.fromCartesian(entityPos2)

      let sourceLng = window.MSIMEarth.Math.toDegrees(
        entityCartographic1.longitude
      )
      let sourceLat = window.MSIMEarth.Math.toDegrees(
        entityCartographic1.latitude
      )
      let sourceAlt = entityCartographic1.height
      let sourceLng1 = window.MSIMEarth.Math.toDegrees(
        entityCartographic2.longitude
      )
      let sourceLat1 = window.MSIMEarth.Math.toDegrees(
        entityCartographic2.latitude
      )
      let sourceAlt1 = entityCartographic2.height
      let lng = (sourceLng + sourceLng1) / 2
      let lat = (sourceLat + sourceLat1) / 2
      let alt = (sourceAlt + sourceAlt1) / 2
      return window.MSIMEarth.Cartesian3.fromDegrees(lng, lat, alt)
    }

    /**
     * 转换为经纬度
     * @param cartesian {MSIMEarth.Cartesian3}
     * @return [lng,lat]
     */
    function cartesianToLngLat(cartesian) {
      const latlng =
        window.EarthViewer.scene.globe.ellipsoid.cartesianToCartographic(
          cartesian
        )
      const lat = window.MSIMEarth.Math.toDegrees(latlng.latitude)
      const lng = window.MSIMEarth.Math.toDegrees(latlng.longitude)
      let alt = latlng.height
      if (typeof alt == 'undefined') {
        alt = 0
      }
      return [lng, lat, alt]
    }

    /**
     * 计算两个点的角度
     * @param lng_a
     * @param lat_a
     * @param lng_b
     * @param lat_b
     * @return {number}
     */
    function courseAngle(lng_a, lat_a, lng_b, lat_b) {
      //以a点为原点建立局部坐标系（东方向为y轴,北方向为x轴,垂直于地面为z轴），得到一个局部坐标到世界坐标转换的变换矩阵
      // const localToWorld_Matrix = MSIMEarth.Transforms.northEastDownToFixedFrame(
      //     new MSIMEarth.Cartesian3.fromDegrees(lng_a, lat_a)
      // );

      //以a点为原点建立局部坐标系（东方向为x轴,北方向为y轴,垂直于地面为z轴），得到一个局部坐标到世界坐标转换的变换矩阵
      const localToWorld_Matrix =
        window.MSIMEarth.Transforms.eastNorthUpToFixedFrame(
          window.MSIMEarth.Cartesian3.fromDegrees(lng_a, lat_a)
        )
      //求世界坐标到局部坐标的变换矩阵
      const worldToLocal_Matrix = window.MSIMEarth.Matrix4.inverse(
        localToWorld_Matrix,
        new window.MSIMEarth.Matrix4()
      )
      //a点在局部坐标的位置，其实就是局部坐标原点
      const localPosition_A = window.MSIMEarth.Matrix4.multiplyByPoint(
        worldToLocal_Matrix,
        window.MSIMEarth.Cartesian3.fromDegrees(lng_a, lat_a),
        new window.MSIMEarth.Cartesian3()
      )
      //B点在以A点为原点的局部的坐标位置
      const localPosition_B = window.MSIMEarth.Matrix4.multiplyByPoint(
        worldToLocal_Matrix,
        window.MSIMEarth.Cartesian3.fromDegrees(lng_b, lat_b),
        new window.MSIMEarth.Cartesian3()
      )

      //弧度
      // const angle = Math.atan2(
      //     localPosition_B.y - localPosition_A.y,
      //     localPosition_B.x - localPosition_A.x
      // );
      //弧度
      const angle = Math.atan2(
        localPosition_B.x - localPosition_A.x,
        localPosition_B.y - localPosition_A.y
      )
      //角度
      let theta = angle * (180 / Math.PI)
      if (theta < 0) {
        theta = theta + 360
      }
      return theta
    }
  }
  computeFlyline(point1, point2, h) {
    let Cesium = window.MSIMEarth
    return getBSRxyz(...point1, ...point2, h)
    function getBSRxyz(x1, y1, h1, x2, y2, h2, h) {
      let arr3d = getBSRPoints(x1, y1, h1, x2, y2, h2, h)
      let arrAll = []
      let max = 0
      let ll = []
      for (let ite of arr3d) {
        arrAll.push(ite[0])
        arrAll.push(ite[1])
        arrAll.push(ite[2])
        if (ite[2] > max) {
          max = ite[2]
          ll = [ite[0], ite[1], ite[2]]
        }
      }
      return window.MSIMEarth.Cartesian3.fromDegreesArrayHeights(arrAll)
    }
    function getBSRPoints(x1, y1, h1, x2, y2, h2, h) {
      let point1 = [y1, h1]
      let point2 = [(y2 + y1) / 2, (h1 + h2) / 2 + h]
      let point3 = [y2, h2]
      let arr = getBSR(point1, point2, point3)
      let arr3d = []
      for (let i = 0; i < arr.length; i++) {
        let x = ((x2 - x1) * (arr[i][0] - y1)) / (y2 - y1) + x1
        arr3d.push([x, arr[i][0], arr[i][1]])
      }
      return arr3d
    }
    // 生成贝塞尔曲线
    function getBSR(point1, point2, point3) {
      var ps = [
        { x: point1[0], y: point1[1] },
        { x: point2[0], y: point2[1] },
        { x: point3[0], y: point3[1] }
      ]
      // 100 每条线由100个点组成
      let guijipoints = CreateBezierPoints(ps, 100)
      return guijipoints
    }
    // 贝赛尔曲线算法
    // anchorpoints: [{ x: 116.30, y: 39.60 }, { x: 37.50, y: 40.25 }, { x: 39.51, y: 36.25 }]
    function CreateBezierPoints(anchorpoints, pointsAmount) {
      var points = []
      for (var i = 0; i < pointsAmount; i++) {
        var point = MultiPointBezier(anchorpoints, i / pointsAmount)
        points.push([point.x, point.y])
      }
      return points
    }
    function MultiPointBezier(points, t) {
      var len = points.length
      var x = 0,
        y = 0
      var erxiangshi = function (start, end) {
        var cs = 1,
          bcs = 1
        while (end > 0) {
          cs *= start
          bcs *= end
          start--
          end--
        }
        return cs / bcs
      }
      for (var i = 0; i < len; i++) {
        var point = points[i]
        x +=
          point.x *
          Math.pow(1 - t, len - 1 - i) *
          Math.pow(t, i) *
          erxiangshi(len - 1, i)
        y +=
          point.y *
          Math.pow(1 - t, len - 1 - i) *
          Math.pow(t, i) *
          erxiangshi(len - 1, i)
      }
      return { x: x, y: y }
    }
  }
  addDashLine(params) {
    // this.distanceLabel(params)
    let that = this
    let viewer = window.EarthViewer
    if (
      typeof params.type === 'undefined' ||
      typeof params.sourId === 'undefined' ||
      typeof params.targetId === 'undefined'
    ) {
      console.log(
        `addDashLine的缺少打击目标的必要属性--type${params.type}--sourId${params.sourId}--targetId${params.targetId}`
      )
      return
    }

    let linkId = `${params.type}==${params.sourId}==${params.targetId}`
    let hasLink = viewer.entities.getById(linkId)
    if (hasLink) return

    let dashEntity1, dashEntity2
    const entityMethod = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })

    let showref = params.show

    // 为了更好的控制链路显隐，需要基于showref之上再添加一层显隐控制，
    // 当前的链路显隐是通过遍历entities.id，对包含链路特定id群体进行显隐控制，每次接到新的链路消息即便当前处于隐藏状态仍然会展示最新链路
    // 增加的这一层级是想通过store/scene内的属性值在初始化层面判定显隐，以保证链路显隐控制
    //showref = store.getters.getLinkState
    const linkWidth = (params.width || 15) / store.getters.getLinkWidthScale // 根据不同席位会（目前主要是2D/3D显示区别）设定宽度
    //console.log('线宽比例', store.getters.getLinkWidthScale)
    // let missilePath = computeFlyline([targetLng, targetLat], [sourceLng, sourceLat], 80000)
    let mixColor = params.color || window.MSIMEarth.Color.RED
    if (params.side) {
      switch (params.side) {
        case 'red':
          mixColor = window.MSIMEarth.Color.RED.withAlpha(0.2)
          break
        case 'blue':
          mixColor = window.MSIMEarth.Color.BLUE.withAlpha(0.3)
          break
        case 'green':
          mixColor = window.MSIMEarth.Color.GREEN.withAlpha(0.3)
          break
        case 'purple':
          mixColor = window.MSIMEarth.Color.PURPLE.withAlpha(0.3)
          break
        default:
          mixColor = window.MSIMEarth.Color.WHITE.withAlpha(0.3)
          break
      }
    }
    let b = window.EarthViewer.entities.add({
      id: linkId,
      show: showref,
      polyline: {
        positions: new window.MSIMEarth.CallbackProperty(changePos, false),
        arcType: window.MSIMEarth.ArcType.NONE,
        width: linkWidth,
        // material: new window.MSIMEarth.PolylineDashMaterialProperty({
        //   color: mixColor
        // })
        material: mixColor
        // material: new window.MSIMEarth.FlowLineMaterialProperty({
        //   transparent: true,
        //   mixColor: mixColor,
        //   repeat: new window.MSIMEarth.Cartesian2(1, 1),
        //   mixRatio: 0.9,
        //   flowSpeed: 5,
        //   image: require('/public/static/image/texture/jt22.png')
        // })
      }
      // position: new window.MSIMEarth.CallbackProperty(changeTPos, false),
      // ellipse: {
      //   semiMinorAxis: 40000.0,
      //   semiMajorAxis: 40000.0,
      //   material: new window.MSIMEarth.TargetMaterialProperty({
      //     // tColor: new window.MSIMEarth.Color(0.933, 0.01, 0.106, 1.0),
      //     tColor: new window.MSIMEarth.Color(1.0, 1.0, 0.1, 1.0),
      //     transparent: true
      //   })
      //   // outline: true // height must be set for outline to display
      // }
    })
    // if (params.type == 'RE_JamS') {
    // 	console.log(b);
    // }

    function changePos() {
      if (
        typeof params.sourId === 'undefined' ||
        typeof params.targetId === 'undefined'
      )
        return
      dashEntity1 =
        entityMethod.getCZMLEntity(
          params.sourId,
          'MSIMEarthCZMLProcessContainer'
        ) || viewer.entities.getById(params.sourId)
      dashEntity2 =
        entityMethod.getCZMLEntity(
          params.targetId,
          'MSIMEarthCZMLProcessContainer'
        ) || viewer.entities.getById(params.targetId)
      if (
        !window.MSIMEarth.defined(dashEntity1) ||
        !window.MSIMEarth.defined(dashEntity2)
      )
        return
      if (
        typeof dashEntity1 === 'undefined' ||
        typeof dashEntity2 === 'undefined'
      )
        return
      // 如果目标隐藏状态则不获取实时距离
      if (!dashEntity1.show || !dashEntity1.show) return
      if (
        !window.MSIMEarth.defined(dashEntity1.position) ||
        !window.MSIMEarth.defined(dashEntity2.position)
      )
        return
      let entityPos1 = dashEntity1.position._value
        ? dashEntity1.position._value
        : dashEntity1.position.getValue(viewer.clock.currentTime)
      let entityPos2 = dashEntity2.position._value
        ? dashEntity2.position._value
        : dashEntity2.position.getValue(viewer.clock.currentTime)
      if (!entityPos1 || !entityPos2) return
      // 直线曲线切换
      let position
      if (
        params.type == 'RE_LTrackInit' ||
        params.type == 'RE_WeaponF' ||
        params.type == 'RE_JamS'
      ) {
        let entityCartographic =
          new window.MSIMEarth.Cartographic.fromCartesian(entityPos1)
        let sourceLng = window.MSIMEarth.Math.toDegrees(
          entityCartographic.longitude
        )
        let sourceLat = window.MSIMEarth.Math.toDegrees(
          entityCartographic.latitude
        )
        let sourceAlt = entityCartographic.height
        let entity1Cartographic =
          new window.MSIMEarth.Cartographic.fromCartesian(entityPos2)
        let destinateLng = window.MSIMEarth.Math.toDegrees(
          entity1Cartographic.longitude
        )
        let destinateLat = window.MSIMEarth.Math.toDegrees(
          entity1Cartographic.latitude
        )
        let destinateAlt = entity1Cartographic.height
        let curLineState = store.state.sceneModule.curDetectLineState
        if (curLineState == 'straight') {
          position = [entityPos1, entityPos2]
        } else if (curLineState == 'parabola') {
          position = that.computeFlyline(
            [sourceLng, sourceLat, sourceAlt],
            [destinateLng, destinateLat, destinateAlt],
            20000
          )
        }
      } else {
        position = [entityPos1, entityPos2]
      }
      // 只直线
      // let position = [entityPos1, entityPos2]
      return position
    }
    function changeTPos() {
      if (
        !window.MSIMEarth.defined(dashEntity2) ||
        !window.MSIMEarth.defined(dashEntity1)
      )
        return
      // 如果目标隐藏状态则不获取实时距离
      if (!dashEntity2.show) return
      if (!window.MSIMEarth.defined(dashEntity2.position)) return
      let entityPos2 = dashEntity2.position.getValue(
        window.EarthViewer.clock.currentTime
      )
      console.log('entityPos2', entityPos2)
      if (!window.MSIMEarth.defined(entityPos2)) return

      var cartographic = new window.MSIMEarth.Cartographic.fromCartesian(entityPos2)
      var lat = window.MSIMEarth.Math.toDegrees(cartographic.latitude)
      var lng = window.MSIMEarth.Math.toDegrees(cartographic.longitude)
      // var alt = cartographic.height
      return window.MSIMEarth.Cartesian3.fromDegrees(lng, lat, 100)
    }
  }
  addParabolaLine(params) {
    // this.distanceLabel(params)
    let that = this
    let viewer = window.EarthViewer
    if (
      typeof params.sourId === 'undefined' ||
      typeof params.targetId === 'undefined'
    )
      return
    let linkId = `${params.type}==${params.sourId}==${params.targetId}`
    let hasLink = viewer.entities.getById(linkId)
    if (hasLink) return
    let position = that.computeFlyline(params.first, params.last, params.height)

    let showref = params.show
    let repeatNum = params.repeat || 8
    let repeat = new window.MSIMEarth.Cartesian2(repeatNum, repeatNum)

    // let missilePath = computeFlyline([targetLng, targetLat], [sourceLng, sourceLat], 80000)
    let mixColor = params.color || window.MSIMEarth.Color.RED
    let b = window.EarthViewer.entities.add({
      id: linkId,
      show: showref,
      polyline: {
        positions: position,
        arcType: window.MSIMEarth.ArcType.NONE,
        width: params.width || 15,
        material: new window.MSIMEarth.FlowLineMaterialProperty({
          transparent: true,
          mixColor: mixColor,
          // repeat: new window.MSIMEarth.Cartesian2(8, 8),
          repeat: repeat,
          mixRatio: 0.9,
          flowSpeed: -5,
          image: require('/public/static/image/texture/materialline.png')
        })
      }
    })
  }
  testpa() {
    let pos = that.computeFlyline(
      [123.55143679911512, 26.224414453614685, 357600.29161686916],
      [123.53644982665996, 26.22315129868038, 356906.1015768526],
      511285 - 357600
    )
    window.EarthViewer.entities.add({
      id: 'ewqeqweqwaa',
      polyline: {
        show: true,
        positions: pos,
        arcType: window.MSIMEarth.ArcType.NONE,
        width: params.width || 15,
        material: new window.MSIMEarth.FlowLineMaterialProperty({
          transparent: true,
          mixColor: window.MSIMEarth.Color.RED,
          // repeat: new window.MSIMEarth.Cartesian2(8, 8),
          repeat: new window.MSIMEarth.Cartesian2(9, 9),
          mixRatio: 0.9,
          flowSpeed: 5,
          image: require('/public/static/image/texture/materiallineF.png')
        })
      }
    })
    window.sceneAction.planeCzmlManage.setPointLabel({
      id: 'highest',
      position: [130.0656735123653, 26.623911310754558, json.Data.TA_Alt],
      text: '最高点',
      color: [245, 204, 89]
    })
    window.sceneAction.planeCzmlManage.setPointLabel({
      id: 'strikePot',
      position: [130.0656735123653, 26.623911310754558, 511285.13680355716],
      text: '撞击点',
      color: [255, 0, 0]
    })
  }
  /**
   * 添加激光干扰发射线
   * @param {*} params
   * @returns
   */
  addLaserJammingLine(params) {
    let that = this
    let viewer = window.EarthViewer
    if (
      typeof params.type === 'undefined' ||
      typeof params.sourId === 'undefined' ||
      typeof params.targetId === 'undefined'
    ) {
      console.log(
        `addline缺少打击目标的必要属性--type${params.type}--sourId${params.sourId}--targetId${params.targetId}`
      )
      return
    }
    let linkId = `${params.type}==${params.sourId}==${params.targetId}`
    let hasLink = viewer.entities.getById(linkId)
    if (hasLink) return

    const entityMethod = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
    let addLineEntity1, addLineEntity2
    let showref = params.show // 控制实时显隐的属性
    let b = window.EarthViewer.entities.add({
      id: linkId,
      show: showref,
      polyline: {
        positions: new window.MSIMEarth.CallbackProperty(
          addLineChangePos,
          false
        ),
        arcType: window.MSIMEarth.ArcType.NONE,
        width: params.linkWidth,
        material: new window.MSIMEarth.PolylineGlowMaterialProperty({
          color: params.color,
          glowPower: 1
        })
      }
    })
    function addLineChangePos() {
      if (
        typeof params.type === 'undefined' ||
        typeof params.sourId === 'undefined' ||
        typeof params.targetId === 'undefined'
      )
        return
      addLineEntity1 =
        entityMethod.getCZMLEntity(
          params.sourId,
          'MSIMEarthCZMLProcessContainer'
        ) || viewer.entities.getById(params.sourId)
      addLineEntity2 =
        entityMethod.getCZMLEntity(
          params.targetId,
          'MSIMEarthCZMLProcessContainer'
        ) || viewer.entities.getById(params.targetId)

      if (
        !window.MSIMEarth.defined(addLineEntity1) ||
        !window.MSIMEarth.defined(addLineEntity2)
      )
        return
      if (
        !window.MSIMEarth.defined(addLineEntity1.position) ||
        !window.MSIMEarth.defined(addLineEntity2.position)
      )
        return
      let entityPos1 = addLineEntity1.position._value
        ? addLineEntity1.position._value
        : addLineEntity1.position.getValue(viewer.clock.currentTime)
      let entityPos2 = addLineEntity2.position._value
        ? addLineEntity2.position._value
        : addLineEntity2.position.getValue(viewer.clock.currentTime)
      if (!entityPos1 || !entityPos2) return
      // 直线曲线切换
      let position
      if (
        params.type == 'RE_LTrackInit' ||
        params.type == 'RE_WeaponF' ||
        params.type == 'RE_JamS' ||
        params.type == 'RE_MR'
      ) {
        let entityCartographic =
          new window.MSIMEarth.Cartographic.fromCartesian(entityPos1)
        let sourceLng = window.MSIMEarth.Math.toDegrees(
          entityCartographic.longitude
        )
        let sourceLat = window.MSIMEarth.Math.toDegrees(
          entityCartographic.latitude
        )
        let sourceAlt = entityCartographic.height
        let entity1Cartographic =
          new window.MSIMEarth.Cartographic.fromCartesian(entityPos2)
        let destinateLng = window.MSIMEarth.Math.toDegrees(
          entity1Cartographic.longitude
        )
        let destinateLat = window.MSIMEarth.Math.toDegrees(
          entity1Cartographic.latitude
        )
        let destinateAlt = entity1Cartographic.height
        let curLineState = store.state.sceneModule.curDetectLineState
        if (curLineState == 'straight') {
          position = [entityPos1, entityPos2]
        } else if (curLineState == 'parabola') {
          position = that.computeFlyline(
            [sourceLng, sourceLat, sourceAlt],
            [destinateLng, destinateLat, destinateAlt],
            20000
          )
        }
      } else {
        position = [entityPos1, entityPos2]
      }
      // 只直线
      // let position = [entityPos1, entityPos2]
      return position
    }
  }
  //移除激光干扰线
  removeLaserJammingLine(params) {
    let a = window.EarthViewer.entities.removeById(
      `${params.type}==${params.sourId}==${params.targetId}`
    )
  }
  //添加实线
  addSolidLine(params) {
    // this.distanceLabel(params)
    let that = this
    let viewer = window.EarthViewer
    if (
      typeof params.type === 'undefined' ||
      typeof params.sourId === 'undefined' ||
      typeof params.targetId === 'undefined'
    ) {
      console.log(
        `addDashLine的缺少打击目标的必要属性--type${params.type}--sourId${params.sourId}--targetId${params.targetId}`
      )
      return
    }

    let linkId = `${params.type}==${params.sourId}==${params.targetId}`
    let hasLink = viewer.entities.getById(linkId)
    if (hasLink) return

    let dashEntity1, dashEntity2
    const entityMethod = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })

    let showref = params.show

    // 为了更好的控制链路显隐，需要基于showref之上再添加一层显隐控制，
    // 当前的链路显隐是通过遍历entities.id，对包含链路特定id群体进行显隐控制，每次接到新的链路消息即便当前处于隐藏状态仍然会展示最新链路
    // 增加的这一层级是想通过store/scene内的属性值在初始化层面判定显隐，以保证链路显隐控制
    //showref = store.getters.getLinkState
    const linkWidth = (params.width || 15) / store.getters.getLinkWidthScale // 根据不同席位会（目前主要是2D/3D显示区别）设定宽度
    //console.log('线宽比例', store.getters.getLinkWidthScale)
    // let missilePath = computeFlyline([targetLng, targetLat], [sourceLng, sourceLat], 80000)
    let mixColor = params.color || window.MSIMEarth.Color.RED
    let b = window.EarthViewer.entities.add({
      id: linkId,
      show: showref,
      polyline: {
        positions: new window.MSIMEarth.CallbackProperty(changePos, false),
        arcType: window.MSIMEarth.ArcType.NONE,
        width: linkWidth * 2,
        material: mixColor
      }
    })
    function changePos() {
      if (
        typeof params.sourId === 'undefined' ||
        typeof params.targetId === 'undefined'
      )
        return
      dashEntity1 =
        entityMethod.getCZMLEntity(
          params.sourId,
          'MSIMEarthCZMLProcessContainer'
        ) || viewer.entities.getById(params.sourId)
      dashEntity2 =
        entityMethod.getCZMLEntity(
          params.targetId,
          'MSIMEarthCZMLProcessContainer'
        ) || viewer.entities.getById(params.targetId)
      if (
        !window.MSIMEarth.defined(dashEntity1) ||
        !window.MSIMEarth.defined(dashEntity2)
      )
        return
      if (
        typeof dashEntity1 === 'undefined' ||
        typeof dashEntity2 === 'undefined'
      )
        return
      // 如果目标隐藏状态则不获取实时距离
      if (!dashEntity1.show || !dashEntity1.show) return
      if (
        !window.MSIMEarth.defined(dashEntity1.position) ||
        !window.MSIMEarth.defined(dashEntity2.position)
      )
        return
      let entityPos1 = dashEntity1.position._value
        ? dashEntity1.position._value
        : dashEntity1.position.getValue(viewer.clock.currentTime)
      let entityPos2 = dashEntity2.position._value
        ? dashEntity2.position._value
        : dashEntity2.position.getValue(viewer.clock.currentTime)
      if (!entityPos1 || !entityPos2) return
      // 直线曲线切换
      let position
      if (
        params.type == 'RE_LTrackInit' ||
        params.type == 'RE_WeaponF' ||
        params.type == 'RE_JamS'
      ) {
        let entityCartographic =
          new window.MSIMEarth.Cartographic.fromCartesian(entityPos1)
        let sourceLng = window.MSIMEarth.Math.toDegrees(
          entityCartographic.longitude
        )
        let sourceLat = window.MSIMEarth.Math.toDegrees(
          entityCartographic.latitude
        )
        let sourceAlt = entityCartographic.height
        let entity1Cartographic =
          new window.MSIMEarth.Cartographic.fromCartesian(entityPos2)
        let destinateLng = window.MSIMEarth.Math.toDegrees(
          entity1Cartographic.longitude
        )
        let destinateLat = window.MSIMEarth.Math.toDegrees(
          entity1Cartographic.latitude
        )
        let destinateAlt = entity1Cartographic.height
        let curLineState = store.state.sceneModule.curDetectLineState
        if (curLineState == 'straight') {
          position = [entityPos1, entityPos2]
        } else if (curLineState == 'parabola') {
          position = that.computeFlyline(
            [sourceLng, sourceLat, sourceAlt],
            [destinateLng, destinateLat, destinateAlt],
            20000
          )
        }
      } else {
        position = [entityPos1, entityPos2]
      }
      // 只直线
      // let position = [entityPos1, entityPos2]
      return position
    }
  }
}
