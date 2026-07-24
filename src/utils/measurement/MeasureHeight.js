import { getCatesian3FromPX } from './utils.js'

export default class MeasureHeight {
  constructor(viewer) {
    this.viewer = viewer
    this.labelEntities = []
    this.pointEntities = []
    this.positions = []
    this.handler = null
  }

  initDraw() {
    this.positions = []
    if (!this.handler) {
      this.handler = new MSIMEarth.ScreenSpaceEventHandler(
        this.viewer.scene.canvas
      )
    }

    this.handler.setInputAction((evt) => {
      var cartesian = getCatesian3FromPX(evt.position)
      if (!cartesian) return

      this.positions.push(cartesian)
      this.showHeightOnMap(cartesian)
      this.showPointOnMap(cartesian)
    }, MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)

    this.handler.setInputAction((evt) => {
      var cartesian = getCatesian3FromPX(evt.endPosition)
      if (!cartesian) return
    }, MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE)

    this.handler.setInputAction((evt) => {
      this.clear()
      this.initDraw()
    }, MSIMEarth.ScreenSpaceEventType.RIGHT_CLICK)
  }

  showPointOnMap(cartesian) {
    const pointEntity = this.viewer.entities.add({
      position: cartesian,
      point: {
        pixelSize: 8,
        color: MSIMEarth.Color.RED,
        outlineColor: MSIMEarth.Color.WHITE,
        outlineWidth: 2,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    })
    this.pointEntities.push(pointEntity)
    return pointEntity
  }

  showHeightOnMap(cartesian) {
    const cartographic = MSIMEarth.Cartographic.fromCartesian(cartesian)
    const height = cartographic.height.toFixed(2)

    const labelEntity = this.viewer.entities.add({
      position: cartesian,
      label: {
        text: '高度: ' + height + ' m',
        font: '16px sans-serif',
        fillColor: MSIMEarth.Color.GOLD,
        style: MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        outlineWidth: 2,
        outlineColor: MSIMEarth.Color.BLACK,
        verticalOrigin: MSIMEarth.VerticalOrigin.BOTTOM,
        pixelOffset: new MSIMEarth.Cartesian2(0, -20),
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    })
    this.labelEntities.push(labelEntity)
    return labelEntity
  }

  clear() {
    this.labelEntities.forEach((item) => {
      this.viewer.entities.remove(item)
    })
    this.labelEntities = []

    this.pointEntities.forEach((item) => {
      this.viewer.entities.remove(item)
    })
    this.pointEntities = []

    this.positions = []

    if (this.handler) {
      this.handler.destroy()
      this.handler = null
    }
  }

  activate() {
    this.initDraw()
  }

  deactivate() {
    this.clear()
  }
}
