/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2024-03-04 15:59:21
 * @LastEditors: yuqiangqiang yqq@piesat.cn
 * @LastEditTime: 2024-09-22 17:10:10
 * @FilePath: \missionEdit\src\utils\drawLine.js
 * @Description: BH类
 */
import drawLine from '@/utils/meteorology/draw/drawLine'
import drawPolygon from '@/utils/meteorology/draw/drawPolygon'
import drawRect from '@/utils/meteorology/draw/drawRect'
import drawCircular from '@/utils/meteorology/draw/drawCircular'
import { transformCartesianToWGS84 } from '@/utils/meteorology/utils.js'

const { conventionalSymbolsList } = window

class meteorology {
  constructor() {
    this.earthDraw = window.earthDraw
    this.callback = null
    this.drawCreate = null
    this.layerManager = null
    this.graphicLayer = null
    this.subGraphicLayer = null
    this.updataLayerManagement = null
    this.meteorologySymbolLib = null
    this.renderMeteorologys = []
    this.temMeteorologys = []
    this.meteorologyTree = []
    this.meteorologyList = {}
    // this.initPolt()
  }

  // initPolt() {
  //   setTimeout(() => {
  //     meteorology.MeteorologyDraw.GetInstance()
  //       ._meteorologyManager.system.getPlotGraphicLayerManager()
  //       .graphicLayer(0)
  //       .setReferenceScale(1000000)
  //     Meteorology.meteorologyDraw.setLineGeometryType('PolylineGeometry')
  //   }, 1000)
  //   this.earthDraw.ctx.listener.on('draw.create', (monitor_obj) => {
  //     if (this.drawCreate) {
  //       this.drawCreate(monitor_obj)
  //     }
  //     if (this.updataLayerManagement) {
  //       this.updataLayerManagement(monitor_obj)
  //     }
  //   })
  //   this.earthDraw.ctx.listener.on('selectFeature', (monitor_obj) => {
  //     if (this.callback) {
  //       this.callback(monitor_obj)
  //     }
  //   })
  //   this.earthDraw.ctx.listener.on('draw.commit', (monitor_obj) => {
  //     if (this.callback) {
  //       this.callback(monitor_obj)
  //     }
  //   })
  // }

  drawLayer(modeType, options = {}, callback, drawCreate) {
    this.earthDraw.changeMode(modeType, options)
    this.callback = callback
    this.drawCreate = drawCreate
  }

  // 替换底层plotEntity为渲染层plotEntity
  getRenderPlot(plot) {
    const renderPlot = this.renderPlots.find(
      (item) => item.handle === plot.handle
    )
    if (renderPlot) {
      this.temPlots.push(renderPlot)
    }
    return renderPlot
  }

  drawPoint(callback) {
    let ellipsoid = window.EarthViewer.scene.globe.ellipsoid
    let handler = new window.MSIMEarth.ScreenSpaceEventHandler(
      window.EarthViewer.scene.canvas
    )
    let cartesian = null
    // let mapElement = document.getElementById('map')
    let mapElement = document.getElementById('container')
    mapElement.style.cursor = 'crosshair'
    handler.setInputAction(function (movement) {
      cartesian = window.EarthViewer.scene.camera.pickEllipsoid(
        movement.position,
        ellipsoid
      )
      handler.destroy() //关闭事件句柄
      mapElement.style.cursor = 'default'
      let object = {
        feature: {
          type: 'point',
          vertexs: transformCartesianToWGS84(cartesian)
        }
      }
      if (callback) {
        callback(object)
      }
    }, window.MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)
  }

  drawLine(callback) {
    let ellipsoid = window.EarthViewer.scene.globe.ellipsoid
    let handler = new window.MSIMEarth.ScreenSpaceEventHandler(
      window.EarthViewer.scene.canvas
    )
    let positions = []
    let poly = null
    let cartesian = null
    // let mapElement = document.getElementById('map')
    let mapElement = document.getElementById('container')
    mapElement.style.cursor = 'crosshair'
    handler.setInputAction(function (movement) {
      //移动结束位置
      cartesian = window.EarthViewer.scene.camera.pickEllipsoid(
        movement.endPosition,
        ellipsoid
      )
      //判断点是否在画布上
      if (window.MSIMEarth.defined(cartesian)) {
        if (positions.length == 1) {
          positions.push(cartesian)
        }
        if (positions.length >= 2) {
          if (!window.MSIMEarth.defined(poly)) {
            // 画线
            poly = new drawLine({
              color: window.MSIMEarth.Color.YELLOW,
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
      cartesian = window.EarthViewer.scene.camera.pickEllipsoid(
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
      poly.remove()
      mapElement.style.cursor = 'default'
      let pointList = []
      for (let i = 0; i < positions.length; i++) {
        const element = positions[i]
        pointList.push(transformCartesianToWGS84(element))
      }
      let object = {
        feature: {
          type: 'line',
          vertexs: pointList
        }
      }
      if (callback) {
        callback(object)
      }
    }, window.MSIMEarth.ScreenSpaceEventType.RIGHT_CLICK)
    handler.setInputAction(function (movement) {
      handler.destroy() //关闭事件句柄
      // positions.pop(); //最后一个点无效
      poly.remove()
      mapElement.style.cursor = 'default'
      let pointList = []
      for (let i = 0; i < positions.length; i++) {
        const element = positions[i]
        pointList.push(transformCartesianToWGS84(element))
      }
      let object = {
        feature: {
          type: 'line',
          vertexs: pointList
        }
      }
      if (callback) {
        callback(object)
      }
      // let WGS84 = []
      // for (let i = 0; i < positions.length; i++) {
      //   const element = positions[i];
      //   WGS84.push(poly.transformCartesianToWGS84(element))
      // }
    }, window.MSIMEarth.ScreenSpaceEventType.LEFT_DOUBLE_CLICK)
  }

  drawPolygon(callback) {
    let ellipsoid = window.EarthViewer.scene.globe.ellipsoid
    let handler = new window.MSIMEarth.ScreenSpaceEventHandler(
      window.EarthViewer.scene.canvas
    )
    let positions = []
    let polyline = null
    let polygon = null
    let cartesian = null
    // let mapElement = document.getElementById('map')
    let mapElement = document.getElementById('container')
    mapElement.style.cursor = 'crosshair'
    handler.setInputAction(function (movement) {
      //移动结束位置
      cartesian = window.EarthViewer.scene.camera.pickEllipsoid(
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
            polyline = new drawLine({
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
            polygon = new drawPolygon({
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
      cartesian = window.EarthViewer.scene.camera.pickEllipsoid(
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
    let ellipsoid = window.EarthViewer.scene.globe.ellipsoid
    let handler = new window.MSIMEarth.ScreenSpaceEventHandler(
      window.EarthViewer.scene.canvas
    )
    let positions = []
    let rect = null
    let cartesian = null
    // let mapElement = document.getElementById('map')
    let mapElement = document.getElementById('container')
    mapElement.style.cursor = 'crosshair'
    handler.setInputAction(function (movement) {
      //移动结束位置
      cartesian = window.EarthViewer.scene.camera.pickEllipsoid(
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
            rect = new drawRect({
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
      cartesian = window.EarthViewer.scene.camera.pickEllipsoid(
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
          type: 'rectangle',
          vertexs: pointList
        }
      }
      if (callback) {
        callback(object)
      }
    }, window.MSIMEarth.ScreenSpaceEventType.RIGHT_CLICK)
  }

  drawCircular(callback) {
    let ellipsoid = window.EarthViewer.scene.globe.ellipsoid
    let handler = new window.MSIMEarth.ScreenSpaceEventHandler(
      window.EarthViewer.scene.canvas
    )
    let positions = []
    let circular = null
    let cartesian = null
    let semiMinorAxis = 0
    let semiMajorAxis = 0
    // let mapElement = document.getElementById('map')
    let mapElement = document.getElementById('container')
    mapElement.style.cursor = 'crosshair'
    handler.setInputAction(function (movement) {
      //移动结束位置
      cartesian = window.EarthViewer.scene.camera.pickEllipsoid(
        movement.endPosition,
        ellipsoid
      )
      //判断点是否在画布上
      if (window.MSIMEarth.defined(cartesian)) {
        if (positions.length == 1) {
          // positions.push(cartesian);
          var from = transformCartesianToWGS84(positions[0])
          var to = transformCartesianToWGS84(cartesian)
          semiMajorAxis =
            turf.rhumbDistance(
              [from.lng, from.lat, from.alt],
              [to.lng, to.lat, to.alt]
            ) * 1000
          semiMinorAxis =
            turf.rhumbDistance(
              [from.lng, from.lat, from.alt],
              [to.lng, to.lat, to.alt]
            ) * 1000
          circular.semiMajorAxis = semiMajorAxis
          circular.semiMinorAxis = semiMinorAxis
        }
        if (positions.length == 2) {
          // positions.push(cartesian);
          var from = transformCartesianToWGS84(positions[0])
          var to = transformCartesianToWGS84(cartesian)
          semiMinorAxis =
            turf.rhumbDistance(
              [from.lng, from.lat, from.alt],
              [to.lng, to.lat, to.alt]
            ) * 1000
          if (semiMinorAxis > semiMajorAxis) {
            semiMinorAxis = semiMajorAxis
          }
          circular.semiMinorAxis = semiMinorAxis
        }
      }
    }, window.MSIMEarth.ScreenSpaceEventType.MOUSE_MOVE)

    //监听单击事件
    handler.setInputAction(function (movement) {
      cartesian = window.EarthViewer.scene.camera.pickEllipsoid(
        movement.position,
        ellipsoid
      )
      positions.push(cartesian)
      if (window.MSIMEarth.defined(cartesian)) {
        if (positions.length == 1) {
          circular = new drawCircular({
            color: window.MSIMEarth.Color.YELLOW,
            position: cartesian,
            semiMinorAxis,
            semiMajorAxis
          })
        }
        if (positions.length == 3) {
          handler.destroy() //关闭事件句柄
          // positions.pop(); //最后一个点无效
          circular.remove()
          mapElement.style.cursor = 'default'
          let object = {
            feature: {
              type: 'circular',
              position: transformCartesianToWGS84(positions[0]),
              semiMinorAxis,
              semiMajorAxis
            }
          }
          if (callback) {
            callback(object)
          }
        }
      }
    }, window.MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)

    handler.setInputAction(function (movement) {
      cartesian = window.EarthViewer.scene.camera.pickEllipsoid(
        movement.position,
        ellipsoid
      )
      positions.push(cartesian)
      if (positions.length > 1) {
        handler.destroy() //关闭事件句柄
        // positions.pop(); //最后一个点无效
        circular.remove()
        mapElement.style.cursor = 'default'
        let object = {
          feature: {
            type: 'circular',
            position: transformCartesianToWGS84(positions[0]),
            semiMinorAxis,
            semiMajorAxis
          }
        }
        if (callback) {
          callback(object)
        }
      }
    }, window.MSIMEarth.ScreenSpaceEventType.RIGHT_CLICK)
  }
}

const createGuid = () => {
  // http://stackoverflow.com/questions/105034/how-to-create-a-guid-uuid-in-javascript
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

export default meteorology
