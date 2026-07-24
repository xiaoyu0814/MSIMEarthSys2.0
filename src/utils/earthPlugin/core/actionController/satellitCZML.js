/*
 * 加载卫星轨迹通过czml的消息方式
 * @param params  卫星的czml数据
 */
export function LoadSatellitByCzml(zcmlArray) {
  zcmlArray.forEach((curCZML) => {
    if (curCZML.label) {
      curCZML.id = curCZML.id + '-satellit'
    }
  })
  // 加载czml，监听label内容
  window.EarthViewer.dataSources
    .add(window.MSIMEarth.CzmlDataSource.load(zcmlArray))
    .then((ds) => {
      //czmlConfig(ds, color)
      ds.entities._entities._array.forEach((element) => {
        if (element.billboard) {
          element.billboard.distanceDisplayCondition =
            new window.MSIMEarth.DistanceDisplayCondition(6e7, 10e9)
        }
        // element.billboard.show=false
        if (element.model) {
          element.model.distanceDisplayCondition =
            new window.MSIMEarth.DistanceDisplayCondition(10e2, 6e7)
        }
        if (element.label) {
          element.properties = {
            name: element.label.text._value
          }
          element.label.pixelOffset = new window.MSIMEarth.Cartesian2(20, 0)
        }
      })
      let sourIds = [
        'C24-satellit',
        'C25-satellit',
        'C38-satellit',
        'C41-satellit'
      ]
      // for (let x = 0; x < sourIds.length; x++) {
      //   let params = {
      //     sourId: sourIds[x],
      //     targetId: 'left_flanker_2',
      //     color: new window.MSIMEarth.Color(136 / 255, 8 / 255, 1 / 255, 1),
      //     type: '',
      //     show: true
      //   }
      //   setTimeout(() => {
      //     if (
      //       window.EarthViewer.entities.getById(
      //         `${sourIds[x - 1]}==${params.targetId}`
      //       )
      //     ) {
      //       window.EarthViewer.entities.removeById(
      //         `${sourIds[x - 1]}==${params.targetId}`
      //       )
      //     }
      //     addLine2(params)
      //   }, x * 20000)
      // }
    })
}
export function showSatellitLngLat(satellitId) {
  if (window.EarthViewer.dataSources.getByName('simple').length > 0) {
    let ds = EarthViewer.dataSources.getByName('simple')[0]
    if (ds.entities.getById(satellitId)) {
      let sourceLng, sourceLat, sourceAlt
      let curEntity = ds.entities.getById(satellitId)
      let text = '名称:' + curEntity.properties.name._value
      let position = curEntity.position
      let curposition = position.getValue(window.EarthViewer.clock.currentTime)
      if (curposition) {
        let entityCartographic =
          window.MSIMEarth.Cartographic.fromCartesian(curposition)

        sourceLng = window.MSIMEarth.Math.toDegrees(
          entityCartographic.longitude
        )
        sourceLat = window.MSIMEarth.Math.toDegrees(entityCartographic.latitude)
        sourceAlt = entityCartographic.height
        text +=
          '\n' +
          '经度:' +
          sourceLng.toFixed(3) +
          '\n' +
          '纬度:' +
          sourceLat.toFixed(3) +
          '\n' +
          '高度:' +
          sourceAlt.toFixed(3)

        curEntity.label.text.setValue(text)
      }
    }
  }
}
//添加北斗卫星和飞机连线
function addLine2(params) {
  // this.distanceLabel(params)
  let that = this
  let viewer = window.EarthViewer
  let linkId = `${params.sourId}==${params.targetId}`
  let hasLink = viewer.entities.getById(linkId)
  if (hasLink) return

  let sourceSource, targetSource
  let entity1, entity2
  let showref = params.show
  let repeatNum = params.repeat || 8
  let repeat = new window.MSIMEarth.Cartesian2(repeatNum, repeatNum)

  // let missilePath = computeFlyline([targetLng, targetLat], [sourceLng, sourceLat], 80000)
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
        repeat: new window.MSIMEarth.Cartesian2(8, 8),
        mixRatio: 0.9,
        flowSpeed: -5,
        image: require('/public/static/image/texture/materialline.png')
      })
    }
  })
  let stepNum = 60
  let stepIndex = 1
  function changePos() {
    if (params.sourId.indexOf('satellit') > -1) {
      sourceSource = viewer.dataSources.getByName('simple')
      entity1 = sourceSource.length
        ? sourceSource[0].entities.getById(params.sourId)
        : viewer.entities.getById(params.sourId)
    } else {
      sourceSource = viewer.dataSources.getByName(params.sourId)
      entity1 = sourceSource.length
        ? sourceSource[0].entities.values[0]
        : viewer.entities.getById(params.sourId)
    }
    if (params.targetId.indexOf('satellit') > -1) {
      targetSource = viewer.dataSources.getByName('simple')
      entity2 = targetSource.length
        ? targetSource[0].entities.getById(params.targetId)
        : viewer.entities.getById(params.targetId)
    } else {
      targetSource = viewer.dataSources.getByName(params.targetId)
      entity2 = targetSource.length
        ? targetSource[0].entities.values[0]
        : viewer.entities.getById(params.targetId)
    }
    if (!entity1 || !entity2) return
    // let entityPos1 = entity1.position.getValue(viewer.clock.currentTime)
    // let entityPos2 = entity2.position.getValue(viewer.clock.currentTime)
    // if (!entityPos1 || !entityPos2) {
    //   return
    // }
    // var entityCartographic = window.MSIMEarth.Cartographic.fromCartesian(entityPos1)
    // let sourceLng = window.MSIMEarth.Math.toDegrees(entityCartographic.longitude)
    // let sourceLat = window.MSIMEarth.Math.toDegrees(entityCartographic.latitude)
    // let sourceAlt = entityCartographic.height
    // var entity1Cartographic = window.MSIMEarth.Cartographic.fromCartesian(entityPos2)
    // let destinateLng = window.MSIMEarth.Math.toDegrees(entity1Cartographic.longitude)
    // let destinateLat = window.MSIMEarth.Math.toDegrees(entity1Cartographic.latitude)
    // let destinateAlt = entity1Cartographic.height
    // let lngStep = (destinateLng - sourceLng) / stepNum
    // let latStep = (destinateLat - sourceLat) / stepNum
    // let altStep = (destinateAlt - sourceAlt) / stepNum
    // let changelng = sourceLng,
    //   changelat = sourceLat,
    //   changealt = sourceAlt
    // if (stepIndex < stepNum) {
    //   changelng += stepIndex * lngStep
    //   changelat += stepIndex * latStep
    //   changealt += stepIndex * altStep
    // } else {
    //   changelng = destinateLng
    //   changelat = destinateLat
    //   changealt = destinateAlt
    // }
    // stepIndex += 1
    // let position = window.MSIMEarth.Cartesian3.fromDegreesArrayHeights([
    //   sourceLng,
    //   sourceLat,
    //   sourceAlt,
    //   changelng,
    //   changelat,
    //   changealt
    // ])

    if (!entity1.position || !entity2.position) return
    let entityPos1 = entity1.position._value
      ? entity1.position._value
      : entity1.position.getValue(viewer.clock.currentTime)
    let entityPos2 = entity2.position._value
      ? entity2.position._value
      : entity2.position.getValue(viewer.clock.currentTime)
    if (!entityPos1 || !entityPos2) return
    // 只直线
    let position = [entityPos1, entityPos2]
    return position
  }
}
