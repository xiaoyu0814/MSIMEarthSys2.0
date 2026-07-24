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
    let en = MSIMEarthCZMLProcessContainer.entities.getById(label.id)
    let position = en.position.getValue(window.EarthViewer.clock.currentTime)
    console.log('position1', position)
    let pos = window.MSIMEarth.SceneTransforms.wgs84ToWindowCoordinates(
      window.EarthViewer.scene,
      position
    )
    if (pos !== undefined) {
      // let charWidth = Number(label._fontSize) * 0.9
      // let charHeight = Number(label._fontSize) * 0.9
      let charWidth = 12 * 1.1
      let charHeight = 12 * 1.1
      console.log('label.text._value.length', label.text._value.length)
      return new window.MSIMEarth.BoundingRectangle(
        pos.x,
        pos.y,
        charWidth * label.text._value.length,
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
      let rect1 = getBoundingRectangle(labels[i])

      if (
        rect1.x < 0 ||
        rect1.x > window.EarthViewer.canvas.clientWidth ||
        rect1.y < 0 ||
        rect1.y > window.EarthViewer.canvas.clientHeight
      ) {
        continue
      } else if (nonIntersectingRectangles.length === 0) {
        let en = MSIMEarthCZMLProcessContainer.entities.getById(labels[i].id)
        let position = en.position.getValue(
          window.EarthViewer.clock.currentTime
        )
        console.log('position2', position)
        if (isPointOnFrontOfGlobe(position)) {
          nonIntersectingRectangles.push(i)
          continue
        }
      } else {
        for (let j = 0; j < nonIntersectingRectangles.length; j++) {
          let rect2 = getBoundingRectangle(labels[nonIntersectingRectangles[j]])
          let en = MSIMEarthCZMLProcessContainer.entities.getById(
            labels[nonIntersectingRectangles[j]].id
          )
          let position = en.position.getValue(
            window.EarthViewer.clock.currentTime
          )
          console.log('position3', position)
          if (
            window.MSIMEarth.Intersect.OUTSIDE !==
              window.MSIMEarth.BoundingRectangle.intersect(rect1, rect2) ||
            !isPointOnFrontOfGlobe(position)
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
  // 计算标签显隐
  function computeLabels() {
    if (
      window.EarthViewer.clock.multiplier > 2 ||
      typeof MSIMEarthCZMLProcessContainer === 'undefined'
    ) {
      // console.log('加速了我就算了')
      return
    }
    let labelCollectionD = []
    MSIMEarthCZMLProcessContainer.entities.values.forEach((e) => {
      e.label.id = e.id
      labelCollectionD.push(e.label)
    })
    let newSet = getNonIntersectingRectangles(labelCollectionD)

    // oldSetD 和 newSet 求差集,结果是要隐藏的ids
    let hideIds = new Set([...oldSetD].filter((x) => !newSet.has(x)))
    console.log('hideIds', hideIds)

    // newSet 和 oldSetD 求差集,结果是新增的要显示的ids
    let showIds = new Set([...newSet].filter((x) => !oldSetD.has(x)))

    for (let id of hideIds) {
      // let hasLabel = EarthAPP.billboardCollection.get(id)
      let hasLabel = MSIMEarthCZMLProcessContainer.entities.values[id]
      if (typeof hasLabel !== 'undefined') {
        if (hasLabel.text) hasLabel.text.show = false
        if (hasLabel.billboard) hasLabel.billboard.show = false
      }
    }
    for (let id of showIds) {
      // 由于动态更新机制，需要先确认该id对应的label是否存在
      // let hasLabel = EarthAPP.billboardCollection.get(id)
      let hasLabel = MSIMEarthCZMLProcessContainer.entities.values[id]
      if (typeof hasLabel !== 'undefined') {
        // let viewerState = store.state.sceneModule.viewerState
        // if (viewerState === 1 || viewerState === 2) {
        //   hasLabel.show = false
        //   return
        // }
        if (hasLabel.text) hasLabel.text.show = true
        if (hasLabel.billboard) hasLabel.billboard.show = true
      }
    }
    // oldSetD = null
    // oldSetD = new Set()
    oldSetD = newSet
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
  setTimeout(() => {
    setInterval(() => {
      computeLabels()
    }, 2000)
  }, 8000)
}
