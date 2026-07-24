import drawLine from './drawLine'
import drawPolygon from './drawPolygon'
import drawRect from './drawRect'
import { transformCartesianToWGS84 } from '@/utils/plot/utils.js'

class plot {
  constructor(viewer) {
    this.viewer = viewer
    this.earthDraw = null
    this.callback = null
    this.drawCreate = null
    this.layerManager = null
    this.graphicLayer = null
    this.subGraphicLayer = null
    this.updataLayerManagement = null
    this.initPolt()
  }

  initPolt() {
    createEarthModule().then(() => {
      this.plotSystem = new PIE.PlotSystem()
      this.layerManager = this.plotSystem.getPlotGraphicLayerManager()
      this.graphicLayer = new PIE.PlotGraphicLayer()
      //添加根图层
      this.layerManager.addGraphicLayer(this.graphicLayer)
      //添加子图层
      this.subGraphicLayer = new PIE.PlotSubGraphicLayer({
        parent: this.graphicLayer
      })
      this.earthDraw = new EarthDraw.setup(this.viewer, {})
    })
  }

  drawPolygon(callback) {
    let self = this
    let ellipsoid = this.viewer.scene.globe.ellipsoid
    let handler = new window.MSIMEarth.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    )
    let positions = []
    let polyline = null
    let polygon = null
    let cartesian = null
    let mapElement = document.getElementById('container')
    mapElement.style.cursor = 'crosshair'
    handler.setInputAction(function (movement) {
      //移动结束位置
      cartesian = self.viewer.scene.camera.pickEllipsoid(
        movement.endPosition,
        ellipsoid
      )
      //判断点是否在画布上
      if (window.MSIMEarth.defined(cartesian)) {
        if (positions.length == 1) {
          positions.push(cartesian)
        }
        if (positions.length >= 2) {
          if (!window.MSIMEarth.defined(polyline)) {
            // 画线
            polyline = new drawLine(self.viewer, {
              color: window.MSIMEarth.Color.YELLOW,
              positions
            })
          } else {
            positions.pop()
            positions.push(cartesian)
          }
        }
        if (positions.length >= 3) {
          if (!window.MSIMEarth.defined(polygon)) {
            // 画线
            polyline.remove()
            polygon = new drawPolygon(self.viewer, {
              color: window.MSIMEarth.Color.YELLOW.withAlpha(0.4),
              positions
            })
          } else {
            positions.pop()
            positions.push(cartesian)
          }
        }
      }
    }, window.MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE)

    //监听单击事件
    handler.setInputAction(function (movement) {
      cartesian = self.viewer.scene.camera.pickEllipsoid(
        movement.position,
        ellipsoid
      )
      if (window.MSIMEarth.defined(cartesian)) {
        positions.push(cartesian)
      }
    }, window.MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)

    // 监听右击事件
    handler.setInputAction(function (movement) {
      handler.destroy() //关闭事件句柄
      // positions.pop(); //最后一个点无效
      polygon.remove()
      mapElement.style.cursor = 'default'
      let pointList = []
      for (let i = 0; i < positions.length; i++) {
        const element = positions[i]
        pointList.push(transformCartesianToWGS84(element))
      }
      let object = {
        feature: {
          type: 'polygon',
          vertexs: pointList
        }
      }
      if (callback) {
        callback(object)
      }
    }, window.MSIMEarth.ScreenSpaceEventType.RIGHT_CLICK)
  }

  drawRect(callback) {
    let self = this
    let ellipsoid = this.viewer.scene.globe.ellipsoid
    let handler = new window.MSIMEarth.ScreenSpaceEventHandler(
      this.viewer.scene.canvas
    )
    let positions = []
    let rect = null
    let cartesian = null
    let mapElement = document.getElementById('container')
    mapElement.style.cursor = 'crosshair'
    handler.setInputAction(function (movement) {
      //移动结束位置
      cartesian = self.viewer.scene.camera.pickEllipsoid(
        movement.endPosition,
        ellipsoid
      )
      //判断点是否在画布上
      if (window.MSIMEarth.defined(cartesian)) {
        if (positions.length == 1) {
          positions.push(cartesian)
        }
        if (positions.length == 2) {
          if (!window.MSIMEarth.defined(rect)) {
            rect = new drawRect(self.viewer, {
              color: window.MSIMEarth.Color.YELLOW.withAlpha(0.4),
              positions
            })
          } else {
            positions.pop()
            positions.push(cartesian)
          }
        }
      }
    }, window.MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE)

    //监听单击事件
    handler.setInputAction(function (movement) {
      cartesian = self.viewer.scene.camera.pickEllipsoid(
        movement.position,
        ellipsoid
      )
      if (window.MSIMEarth.defined(cartesian)) {
        if (positions.length == 0) {
          positions.push(cartesian)
        } else {
          // handler.destroy(); //关闭事件句柄
          // // positions.pop(); //最后一个点无效
          // rect.remove();
          // mapElement.style.cursor = "default";
        }
      }
    }, window.MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)

    handler.setInputAction(function (movement) {
      handler.destroy() //关闭事件句柄
      // positions.pop(); //最后一个点无效
      rect.remove()
      mapElement.style.cursor = 'default'
      let pointList = []
      for (let i = 0; i < positions.length; i++) {
        const element = positions[i]
        pointList.push(transformCartesianToWGS84(element))
      }
      let object = {
        feature: {
          type: 'rect',
          vertexs: pointList
        }
      }
      if (callback) {
        callback(object)
      }
    }, window.MSIMEarth.ScreenSpaceEventType.RIGHT_CLICK)
  }
}

export default plot
