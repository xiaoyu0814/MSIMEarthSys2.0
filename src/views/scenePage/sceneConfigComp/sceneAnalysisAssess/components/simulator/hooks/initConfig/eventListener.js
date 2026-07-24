import { gsap } from 'gsap'
export function eventListenerInit() {
  // 标签碰撞分析容器
  let oldSet = new Set() // 上一次显示哪些label的id
  let tweenMap = new Map()
  let running = false
  let labelObj = {
    alpha: 0
  }
  function getBoundingRectangle(label) {
    let pos = window.MSIMEarth.SceneTransforms.wgs84ToWindowCoordinates(
      window.EarthViewer.scene,
      label.position
    )
    if (pos !== undefined) {
      let charWidth = Number(label._fontSize) * 1.1
      let charHeight = Number(label._fontSize) * 1.1
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
  EarthAPP.labelCollection = window.EarthViewer.scene.primitives.add(
    new window.MSIMEarth.LabelCollection()
  )
  window.EarthViewer.scene.preRender.addEventListener(function () {
    let labelObj = {
      alpha: 0.01
    }
    let labelObj2 = {
      alpha: 1
    }

    let newSet = getNonIntersectingRectangles(EarthAPP.labelCollection)

    // oldSet 和 newSet 求差集,结果是要隐藏的ids
    let hideIds = new Set([...oldSet].filter((x) => !newSet.has(x)))

    // newSet 和 oldSet 求差集,结果是新增的要显示的ids
    let showIds = new Set([...newSet].filter((x) => !oldSet.has(x)))

    for (let id of hideIds) {
      if (tweenMap.has(id)) {
        let tween = tweenMap.get(id)
        tween.kill()
        tweenMap.delete(id)
      }

      let tween = gsap.to(labelObj2, {
        duration: 1,
        alpha: 0,
        onUpdate: () => {
          let label = EarthAPP.labelCollection.get(id)
          let oldFillColor = label.fillColor._value || label.fillColor
          let newFillColor = new window.MSIMEarth.Color(
            oldFillColor.red,
            oldFillColor.green,
            oldFillColor.blue,
            labelObj2.alpha
          )
          label.fillColor = newFillColor
          let oldOutLineColor = label.outlineColor._value || label.outlineColor
          let newOutLineColor = new window.MSIMEarth.Color(
            oldOutLineColor.red,
            oldOutLineColor.green,
            oldOutLineColor.blue,
            labelObj2.alpha
          )
          label.outlineColor = newOutLineColor
          // label.fillColor = window.MSIMEarth.Color.WHITE.withAlpha(
          //   labelObj2.alpha
          // )
        }
      })
      tweenMap.set(id, tween)
    }
    for (let id of showIds) {
      if (tweenMap.has(id)) {
        let tween = tweenMap.get(id)
        tween.kill()
        tweenMap.delete(id)
      }

      let tween = gsap.to(labelObj, {
        duration: 2 + Math.random(),
        alpha: 1,
        onUpdate: () => {
          let label = EarthAPP.labelCollection.get(id)
          let oldFillColor = label.fillColor._value || label.fillColor
          let newFillColor = new window.MSIMEarth.Color(
            oldFillColor.red,
            oldFillColor.green,
            oldFillColor.blue,
            labelObj.alpha
          )
          label.fillColor = newFillColor
          let oldOutLineColor = label.outlineColor._value || label.outlineColor
          let newOutLineColor = new window.MSIMEarth.Color(
            oldOutLineColor.red,
            oldOutLineColor.green,
            oldOutLineColor.blue,
            labelObj.alpha
          )
          label.outlineColor = newOutLineColor
          // label.fillColor = window.MSIMEarth.Color.WHITE.withAlpha(
          //   labelObj.alpha
          // )
        }
      })
      tweenMap.set(id, tween)
    }

    oldSet = newSet
  })
}
