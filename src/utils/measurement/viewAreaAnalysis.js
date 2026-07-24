import { getCatesian3FromPX } from './utils.js'

class ViewAreaAnalysis {
  constructor(viewer) {
    this.viewer = viewer
    this.handler = null
    this.frustrumLabel = undefined
    this.viewPointFlag = false
    this.pickPositions = []
    this.boardLines = []
    this.pickPoints = []
    this.lineList = []
    this.activeLine = null
    this.drawLayer = viewer.entities
  }

  setBuildFrustrumHandler(flag) {
    if (flag) {
      this.handler.setInputAction((event) => {
        const earthPosition = getCatesian3FromPX(event.position)
        if (MSIMEarth.defined(earthPosition)) {
          if (this.pickPositions.length > 1) {
            for (let i = 0; i < this.boardLines.length; ++i) {
              this.viewer.entities.remove(this.boardLines[i])
            }
            this.frustrumLabel.label.text = '可视域分析中...'
            this.setBuildFrustrumHandler(false)
            this.viewAreaAnalysis(
              45,
              this.pickPositions[0],
              this.pickPositions[1]
            )
          }
          this.pickPositions.push(earthPosition)
          this.viewPointFlag = true
          const dynamicPositions = new MSIMEarth.CallbackProperty(() => {
            return this.pickPositions
          }, false)
          this.pickPositions.push(earthPosition)
          this.activeLine = this.drawLine(
            dynamicPositions,
            MSIMEarth.Color.WHITE,
            MSIMEarth.Color.WHITE
          )
        }
      }, MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)

      this.handler.setInputAction((event) => {
        const newPosition = getCatesian3FromPX(event.endPosition)
        if (MSIMEarth.defined(newPosition)) {
          if (this.frustrumLabel == undefined) {
            this.frustrumLabel = this.createLabel(newPosition, '点击选择视点')
          } else {
            this.frustrumLabel.position = newPosition
            if (this.viewPointFlag == true) {
              this.frustrumLabel.label.text = '点击视线方向'
              this.pickPositions.pop()
              this.pickPositions.push(newPosition)
              if (this.boardLines.length > 1) {
                for (let i = 0; i < this.boardLines.length; ++i) {
                  this.viewer.entities.remove(this.boardLines[i])
                }
              }
              if (this.pickPositions.length > 1) {
                this.boardLines = this.drawSector(
                  this.pickPositions[0],
                  this.pickPositions[1]
                )
              }
            }
          }
        }
      }, MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE)
    } else {
      this.handler.removeInputAction(MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE)
      this.handler.removeInputAction(MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)
    }
  }

  drawSector(startPoint, endPoint) {
    let lines = []
    let leftLine = this.rotateLine(
      MSIMEarth.Math.toRadians(45),
      startPoint,
      endPoint
    )
    let rightLine = this.rotateLine(
      MSIMEarth.Math.toRadians(-45),
      startPoint,
      endPoint
    )
    lines.push(leftLine)
    lines.push(rightLine)
    return lines
  }

  rotateLine(radian, startPoint, endPoint) {
    let position_Cartesian3 = this.rotatePoint(radian, startPoint, endPoint)
    let LinePoints = []
    LinePoints.push(startPoint)
    LinePoints.push(position_Cartesian3)
    let line = this.drawLine(
      LinePoints,
      new MSIMEarth.PolylineDashMaterialProperty({
        color: MSIMEarth.Color.YELLOW
      }),
      MSIMEarth.Color.YELLOW
    )
    return line
  }

  rotatePoint(radian, startPoint, endPoint) {
    let startCartographic = MSIMEarth.Cartographic.fromCartesian(startPoint)
    let endCartographic = MSIMEarth.Cartographic.fromCartesian(endPoint)
    let webMercatorProjection = new MSIMEarth.WebMercatorProjection(
      this.viewer.scene.globe.ellipsoid
    )
    let startMercator = webMercatorProjection.project(startCartographic)
    let endMercator = webMercatorProjection.project(endCartographic)
    let position_Mercator = new MSIMEarth.Cartesian3(
      (endMercator.x - startMercator.x) * Math.cos(radian) -
        (endMercator.y - startMercator.y) * Math.sin(radian) +
        startMercator.x,
      (endMercator.x - startMercator.x) * Math.sin(radian) +
        (endMercator.y - startMercator.y) * Math.cos(radian) +
        startMercator.y,
      startMercator.z
    )
    let position_Cartographic =
      webMercatorProjection.unproject(position_Mercator)
    let position_Cartesian3 = MSIMEarth.Cartographic.toCartesian(
      position_Cartographic.clone()
    )
    return position_Cartesian3
  }

  drawLine(positionData, material, depthFailMaterial) {
    let shape
    shape = this.viewer.entities.add({
      polyline: {
        positions: positionData,
        // arcType: MSIMEarth.ArcType.NONE,
        width: 5,
        material: material
        // depthFailMaterial: depthFailMaterial,
      }
    })
    return shape
  }

  viewAreaAnalysis(degree, startPoint, endPoint) {
    for (let i = -degree; i <= degree; ++i) {
      let radian = MSIMEarth.Math.toRadians(i)
      let destPoint = this.rotatePoint(radian, startPoint, endPoint)
      this.getIntersectPoint(startPoint, destPoint)
    }
    this.viewer.entities.remove(this.frustrumLabel)
    this.viewer.entities.remove(this.activeLine)
    this.pickPositions = []
    for (let i = 0; i < this.pickPoints.length; ++i) {
      this.viewer.entities.remove(this.pickPoints[i])
    }
    this.pickPoints = []
  }

  getIntersectPoint(startPoint, endPoint) {
    let direction = MSIMEarth.Cartesian3.normalize(
      MSIMEarth.Cartesian3.subtract(
        endPoint,
        startPoint,
        new MSIMEarth.Cartesian3()
      ),
      new MSIMEarth.Cartesian3()
    )
    let ray = new MSIMEarth.Ray(startPoint, direction)
    let result = this.viewer.scene.pickFromRay(ray)
    if (MSIMEarth.defined(result)) {
      let intesectPosition = result.position
      if (
        this.distanceBetweenTwoPoints(startPoint, endPoint) >
        this.distanceBetweenTwoPoints(intesectPosition, startPoint)
      ) {
        this.lineList.push(
          this.drawLine(
            [startPoint, result.position],
            MSIMEarth.Color.GREEN,
            MSIMEarth.Color.GREEN
          )
        )
        this.lineList.push(
          this.drawLine(
            [result.position, endPoint],
            MSIMEarth.Color.RED,
            MSIMEarth.Color.RED
          )
        )
      } else {
        this.lineList.push(
          this.drawLine(
            [startPoint, endPoint],
            MSIMEarth.Color.GREEN,
            MSIMEarth.Color.GREEN
          )
        )
      }
    } else {
      this.lineList.push(
        this.drawLine(
          [startPoint, endPoint],
          MSIMEarth.Color.GREEN,
          MSIMEarth.Color.GREEN
        )
      )
    }
  }

  distanceBetweenTwoPoints(startpoint, endpoint) {
    if (!startpoint || !endpoint) {
      return 0
    }
    let distance = MSIMEarth.Cartesian3.distance(startpoint, endpoint)
    return distance
  }

  createLabel(startpoint, endpoint) {
    let label = this.viewer.entities.add({
      position: startpoint,
      label: {
        text: endpoint
      }
    })
    return label
  }

  activate() {
    this.clear()
    this.pickPositions = []
    this.boardLines = []
    this.frustrumLabel = undefined
    this.viewPointFlag = false
    this.handler = new MSIMEarth.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    )
    this.setBuildFrustrumHandler(true)
  }

  deactivate() {
    if (this.handler) {
      this.handler.removeInputAction(MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE)
      this.handler.removeInputAction(MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)
      this.handler = null
    }
  }

  clear() {
    this.deactivate()
    if (this.frustrumLabel) {
      this.viewer.entities.remove(this.frustrumLabel)
      this.frustrumLabel = undefined
    }
    if (this.activeLine) {
      this.viewer.entities.remove(this.activeLine)
      this.activeLine = null
    }
    for (let i = 0; i < this.boardLines.length; ++i) {
      this.viewer.entities.remove(this.boardLines[i])
    }
    this.boardLines = []
    for (let i = 0; i < this.pickPoints.length; ++i) {
      this.viewer.entities.remove(this.pickPoints[i])
    }
    for (let i = 0; i < this.lineList.length; i++) {
      this.viewer.entities.remove(this.lineList[i])
    }
    this.pickPoints = []
    this.pickPositions = []
    this.lineList = []
    this.viewPointFlag = false
  }
}

export default ViewAreaAnalysis
