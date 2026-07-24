import store from '@/store'
export default class ClusterByGroup {
  constructor(config) {
    this.earth = config.earth
    this.viewer = config.viewer
    this.idAppend = 'cluster'
  }
  /**
   * 创建编组集合
   * @param {*} clusterArr ['wz-7_1', 'wz-7_2']
   * @param {*} clusterId  'wz-7_'
   */
  createClusterByGroup(clusterArr, clusterId) {
    let that = this
    let EF = new window.EarthPlugn.EffectByTurf(
      window.MSIMEarth,
      window.EarthViewer
    )
    let curEntityForModel = null
    clusterArr.forEach((e) => {
      curEntityForModel = window.EarthPlugn.entity._GetCZMLEntity(
        e,
        'MSIMEarthCZMLProcessContainer'
      )
      if (curEntityForModel) return
    })
    if (!curEntityForModel) {
      console.log('场景无当前聚合类型', clusterArr)
      return
    }
    let model = null
    let properties = null
    let outlineColor = null
    if (curEntityForModel) {
      outlineColor = curEntityForModel.label.outlineColor
      model = curEntityForModel.model
      // properties = {
      //   _airplaneAction: curEntityForModel.properties._airplaneAction
      // }
      properties = curEntityForModel.properties
    }
    this.changeClusterState(clusterArr)

    let getCenterPosition = function () {
      if (window.EarthViewer.clock.multiplier === 0) return
      let centerToPosition
      let graphicArr = []
      let centerHeight = 0
      clusterArr.forEach((e) => {
        let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
          e,
          'MSIMEarthCZMLProcessContainer'
        )
        if (typeof curEntity === 'undefined') return
        let currentTime = window.EarthViewer.clock.currentTime
        if (typeof currentTime === 'undefined') return
        let p = curEntity.position.getValue(currentTime)
        // console.log('实时计算位置', e, p, curEntity)
        if (typeof p === 'undefined') return
        let graphicP = that.coordinateConvert(p)
        if (
          typeof graphicP === 'undefined' ||
          typeof graphicP.lng === 'undefined' ||
          typeof graphicP.lat === 'undefined'
        )
          return
        graphicArr.push([graphicP.lng, graphicP.lat])
        centerHeight = graphicP.alt
      })
      if (graphicArr.length === 0) return
      let center = EF.getCenterPointByMultiPoints(graphicArr)
      if (typeof center === 'undefined') return
      centerToPosition = new window.MSIMEarth.Cartesian3.fromDegrees(
        center.geometry.coordinates[0],
        center.geometry.coordinates[1],
        centerHeight
      )
      return centerToPosition
    }
    let computeOrientation = function () {
      let orientation
      let curEntity
      clusterArr.forEach((e) => {
        curEntity = window.EarthPlugn.entity._GetCZMLEntity(
          e,
          'MSIMEarthCZMLProcessContainer'
        )
        if (curEntity) return
      })
      if (typeof curEntity === 'undefined') return

      let modleMatrix = curEntity.computeModelMatrix(
        window.EarthViewer.clock.currentTime
      )
      if (modleMatrix) {
        const hpr = window.MSIMEarth.Transforms.fixedFrameToHeadingPitchRoll(
          modleMatrix,
          window.MSIMEarth.Ellipsoid.WGS84
        )
        if (typeof hpr === 'undefined') return
        let p = curEntity.position.getValue(
          window.EarthViewer.clock.currentTime
        )
        if (typeof p === 'undefined') return
        orientation = window.MSIMEarth.Transforms.headingPitchRollQuaternion(
          p,
          hpr
        )
      }

      if (typeof orientation === 'undefined') return
      return orientation
    }
    let groupId = clusterId + that.idAppend
    // console.log(properties)
    properties.id = groupId

    window.EarthViewer.entities.removeById(groupId)
    window.EarthViewer.entities.add({
      id: groupId,
      position: new window.MSIMEarth.CallbackProperty(getCenterPosition, false),
      orientation: new window.MSIMEarth.CallbackProperty(
        computeOrientation,
        false
      ),
      // point: {
      //   pixelSize: 6,
      //   color: window.MSIMEarth.Color.RED
      // },
      label: {
        text: `${clusterId}`, //`${json.Data.Name}`,
        font: 'bold 12px MicroSoft YaHei',
        show: true,
        showBackground: true,
        backgroundColor: new window.MSIMEarth.Color(0, 0, 0, 55 / 255),
        outlineColor: outlineColor,
        outlineWidth: 1,
        style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: new window.MSIMEarth.Cartesian2(-5, -35),
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          0,
          100e5
        )
      },
      model: model,
      properties: properties
    })
  }
  coordinateConvert(positionC3) {
    if (typeof positionC3 === 'undefined') return
    let cartographic = window.MSIMEarth.Cartographic.fromCartesian(positionC3)
    if (typeof cartographic === 'undefined') return
    var lng = window.MSIMEarth.Math.toDegrees(cartographic.longitude)
    var lat = window.MSIMEarth.Math.toDegrees(cartographic.latitude)
    var alt = cartographic.height
    return { lng: lng, lat: lat, alt: alt }
  }
  // 移除聚合点，恢复聚合前状态
  removeCluster(clusterArr, clusterId) {
    let that = this
    let id = clusterId + that.idAppend
    window.EarthViewer.entities.removeById(id)
    store.state.experimentModule.plateformCluster = []
    //   .forEach((e) => {
    //   // clusterArr.forEach((c) => {
    //     // if (e.id === c.id) {
    //       e.show = true
    //     // }
    //   // })
    // })
  }
  // 判断store数组里是否有该目标点信息，有则根据需求改变状态，无则添加或清除
  changeClusterState(clusterArr) {
    // ['071__1', '071__4', '071__3', '071__2']
    let group = clusterArr.join('+')

    for (let i = 0; i < clusterArr.length; i++) {
      const e = clusterArr[i]
      let includeCurElement = null
      let plateformCluster = store.state.experimentModule.plateformCluster
      for (let j = 0; j < plateformCluster.length; j++) {
        const r = plateformCluster[j]
        if (r.id === e) {
          store.state.experimentModule.plateformCluster[j].show = false
          includeCurElement = r
          return
        }
      }
      if (!includeCurElement) {
        store.state.experimentModule.plateformCluster.push({
          id: e,
          show: false,
          group: group + '_cluster'
        })
      }
    }
    // console.log(store.state.experimentModule.plateformCluster)
  }
}
