import emitter from '@/utils/eventbus'
export function eventListenerDInit() {
  // 标签碰撞分析容器
  let oldSetD = new Set() // 上一次显示哪些label的id
  // let tweenMap = new Map()
  // let running = false
  // let labelObj = {
  //   alpha: 0
  // }
  // 帧率计算参数
  let lastTime = Date.now()
  let frameCount = 0
  function getBoundingRectangle(label) {
    let pos = window.MSIMEarth.SceneTransforms.wgs84ToWindowCoordinates(
      window.EarthViewer.scene,
      label.position
    )
    if (pos !== undefined) {
      let charWidth = Number(label._fontSize) * 0.9
      let charHeight = Number(label._fontSize) * 0.9
      return new window.MSIMEarth.BoundingRectangle(
        pos.x,
        pos.y,
        charWidth * label.text.length,
        charHeight
      )
    }
    return new window.MSIMEarth.BoundingRectangle(0, 0, 1, 1)
  }
  function isPointOnFrontOfGlobe(position) {
    const ellipsoid = window.MSIMEarth.Ellipsoid.WGS84
    const camera = window.EarthViewer.camera //viewer为你的Cesium Viewer对象
    const occluder = new window.MSIMEarth.EllipsoidalOccluder(
      ellipsoid,
      camera.position
    )
    const visible = occluder.isPointVisible(position)
    //visible为true说明点在球的正面，否则点在球的背面。
    return visible
  }
  function getNonIntersectingRectangles(labels) {
    let nonIntersectingRectangles = []

    for (let i = 0; i < labels.length; i++) {
      let intersects = false
      let rect1 = getBoundingRectangle(labels.get(i))

      if (
        rect1.x < 0 ||
        rect1.x > window.EarthViewer.canvas.clientWidth ||
        rect1.y < 0 ||
        rect1.y > window.EarthViewer.canvas.clientHeight
      ) {
        continue
      } else if (nonIntersectingRectangles.length === 0) {
        if (isPointOnFrontOfGlobe(labels.get(i).position)) {
          nonIntersectingRectangles.push(i)
          continue
        }
      } else {
        for (let j = 0; j < nonIntersectingRectangles.length; j++) {
          let rect2 = getBoundingRectangle(
            labels.get(nonIntersectingRectangles[j])
          )

          if (
            window.MSIMEarth.Intersect.OUTSIDE !==
              window.MSIMEarth.BoundingRectangle.intersect(rect1, rect2) ||
            !isPointOnFrontOfGlobe(labels.get(i).position)
          ) {
            intersects = true
            break
          }
        }

        if (!intersects) {
          nonIntersectingRectangles.push(i)
        }
      }
    }

    return new Set(nonIntersectingRectangles)
  }
  EarthAPP.labelCollectionD = window.EarthViewer.scene.primitives.add(
    new window.MSIMEarth.LabelCollection()
  )
  EarthAPP.billboardCollection = window.EarthViewer.scene.primitives.add(
    new window.MSIMEarth.BillboardCollection()
  )
  let curPositionB
  let curPositionL
  // 计算标签显隐
  function computeLabels() {
    if (
      window.EarthViewer.clock.multiplier > 2 ||
      typeof MSIMEarthCZMLProcessContainer === 'undefined'
    ) {
      console.log('加速了我就我算了')
      return
    }
    EarthAPP.labelCollectionD.removeAll()
    let labelData = {
      // position: window.MSIMEarth.Cartesian3.fromDegrees(0, 0, 0),
      font: 'bold 32px MicroSoft YaHei',
      show: false,
      // fillColor: new window.MSIMEarth.Color(1.0, 1.0, 1.0, 1),
      // outlineColor: new window.MSIMEarth.Color(1.0, 1.0, 1.0, 1),
      // outlineWidth: 1,
      style: window.MSIMEarth.LabelStyle.FILL, //FILL_AND_OUTLINE
      // horizontalOrigin: window.MSIMEarth.HorizontalOrigin.CENTER, //水平位置
      // pixelOffset: new window.MSIMEarth.Cartesian2(5, -30),
      // eyeOffset: new window.MSIMEarth.Cartesian3(0.0, 0.0, -10.0),
      horizontalOrigin: window.MSIMEarth.HorizontalOrigin.CENTER, // default
      verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER // default: CENTER
      // distanceDisplayCondition:
      //   new window.MSIMEarth.DistanceDisplayCondition(1000, 6e5), //20e5
      // distanceDisplayCondition: distance
      // heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND
      // disableDepthTestDistance: Number.POSITIVE_INFINITY
    }
    MSIMEarthCZMLProcessContainer.entities.values.forEach((e) => {
      labelData.text = e.label.text._value
      labelData.position = e.position.getValue(
        window.EarthViewer.clock.currentTime
      )
      labelData.id = e.id
      EarthAPP.labelCollectionD.add(labelData)
    })
    setTimeout(() => {
      let newSet = getNonIntersectingRectangles(EarthAPP.labelCollectionD)

      // oldSetD 和 newSet 求差集,结果是要隐藏的ids
      let hideIds = new Set([...oldSetD].filter((x) => !newSet.has(x)))

      // newSet 和 oldSetD 求差集,结果是新增的要显示的ids
      let showIds = new Set([...newSet].filter((x) => !oldSetD.has(x)))
      console.log(hideIds, showIds, EarthAPP.labelCollectionD)

      for (let id of hideIds) {
        let hasLabel = MSIMEarthCZMLProcessContainer.entities.values[id]
        if (typeof hasLabel !== 'undefined') {
          // hasLabel.billboard.show = false
          hasLabel.label.show = false
        }
      }
      for (let id of showIds) {
        // 由于动态更新机制，需要先确认该id对应的label是否存在
        let hasLabel = MSIMEarthCZMLProcessContainer.entities.values[id]
        if (typeof hasLabel !== 'undefined') {
          // hasLabel.billboard.show = true
          hasLabel.label.show = true
        }
        // let hasLabel = EarthAPP.billboardCollection.get(id)
        // if (typeof hasLabel !== 'undefined') {
        //   // 增加该目标和视点距离判定，当局里小于某个值则隐藏
        //   // console.log('hasLabel', hasLabel)
        //   // let distance = getDistanceCameraToLabel(
        //   //   hasLabel._actualPosition,
        //   //   window.EarthViewer.camera.position
        //   // )
        //   // if (distance < 1000000) {
        //   //   hasLabel.show = false
        //   //   return
        //   // }
        //   let viewerState = store.state.sceneModule.viewerState
        //   if (viewerState === 1 || viewerState === 2) {
        //     hasLabel.show = false
        //     return
        //   }
        //   hasLabel.show = true
        // }
      }
      // oldSetD = null
      // oldSetD = new Set()
      oldSetD = newSet
    }, 100)
  }
  // 计算帧率
  function computeFPS() {
    const currentTime = Date.now()
    const deltaTime = currentTime - lastTime
    if (deltaTime > 1000) {
      EarthAPP.fps = (frameCount * 1000) / deltaTime
      lastTime = currentTime
      frameCount = 0
    } else {
      frameCount++
    }
  }
  // 计算标签位置和视点位置间的距离
  function getDistanceCameraToLabel(point1, point2) {
    let point1cartographic = window.MSIMEarth.Cartographic.fromCartesian(point1)
    let point2cartographic = window.MSIMEarth.Cartographic.fromCartesian(point2)
    /**根据经纬度计算出距离**/
    let geodesic = new window.MSIMEarth.EllipsoidGeodesic()
    geodesic.setEndPoints(point1cartographic, point2cartographic)
    let s = geodesic.surfaceDistance
    //返回两点之间的距离
    s = Math.sqrt(
      Math.pow(s, 2) +
        Math.pow(point2cartographic.height - point1cartographic.height, 2)
    )
    return s
  }
  // setTimeout(() => {
  //   setInterval(() => {
  //     computeLabels()
  //   }, 4000)
  // }, 5000)
  // emitter.on('listenerLabel', (value) => {
  //   window.ListenerLabel = window.EarthViewer.scene.preRender.addEventListener(
  //     function () {
  //       EarthAPP.billboardCollection._billboards.forEach((e) => {
  //         if (window.MSIMEarth.defined(e) && window.MSIMEarth.defined(e.id)) {
  //           let curEn = window.EarthPlugn.entity._GetCZMLEntity(
  //             e.id,
  //             'MSIMEarthCZMLProcessContainer'
  //           )
  //           if (
  //             window.MSIMEarth.defined(curEn) &&
  //             window.MSIMEarth.defined(curEn.position)
  //           ) {
  //             let curPosition = curEn.position.getValue(
  //               window.EarthViewer.clock.currentTime
  //             )
  //             if (window.MSIMEarth.defined(curPosition)) {
  //               e.position = curPosition
  //             }
  //           }
  //         }
  //       })
  //       EarthAPP.labelCollectionD._labels.forEach((e) => {
  //         if (window.MSIMEarth.defined(e) && window.MSIMEarth.defined(e.id)) {
  //           let curEn = window.EarthPlugn.entity._GetCZMLEntity(
  //             e.id,
  //             'MSIMEarthCZMLProcessContainer'
  //           )
  //           if (
  //             window.MSIMEarth.defined(curEn) &&
  //             window.MSIMEarth.defined(curEn.position)
  //           ) {
  //             let curPosition = curEn.position.getValue(
  //               window.EarthViewer.clock.currentTime
  //             )
  //             if (window.MSIMEarth.defined(curPosition)) {
  //               e.position = curPosition
  //             }
  //           }
  //         }
  //       })
  //       computeFPS()
  //     }
  //   )
  // })
}
