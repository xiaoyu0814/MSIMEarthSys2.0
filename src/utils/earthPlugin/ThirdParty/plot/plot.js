/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2024-03-04 15:59:21
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2026-07-15 14:50:41
 * @FilePath: \missionEdit\src\utils\drawLine.js
 * @Description: BH类
 */
import drawLine from './drawLine.js'
import weatherData from './Weather@2x.js'

class plot {
  constructor(viewer) {
    this.viewer = window.EarthViewer
    this.earthDraw = null
    this.callback = null
    this.drawCreate = null
    this.layerManager = null
    this.graphicLayer = null
    this.subGraphicLayer = null
    this.updataLayerManagement = null
    this.renderPlots = []
    this.temPlots = []
    this.weatherData = null
    this.initPolt()
  }

  initPolt() {
    this.weatherData = weatherData
    // 引入西安标绘资源
    if (!window.plot) {
      var script3 = document.createElement('script')
      script3.src = './EarthPlotCore.js'
      var script4 = document.createElement('script')
      script4.src = './EarthDraw.js'
      document.body.appendChild(script3)
      document.body.appendChild(script4)
    } else {
      window.plot.removeAll()
    }

    createEarthPlotModule().then(() => {
      // this.plotSystem = new PIE.PlotSystem()
      // this.layerManager = this.plotSystem.getPlotGraphicLayerManager()
      // this.graphicLayer = new PIE.PlotGraphicLayer()
      // //添加根图层
      // this.layerManager.addGraphicLayer(this.graphicLayer)
      // //添加子图层
      // this.subGraphicLayer = new PIE.PlotSubGraphicLayer({
      //   parent: this.graphicLayer
      // })
      this.earthDraw = new EarthDraw.setup(this.viewer, {})
      window.earthDraw = this.earthDraw
      this.earthDraw.ctx.listener.on('draw.create', (monitor_obj) => {
        console.log(monitor_obj)
        if (this.drawCreate) {
          this.subGraphicLayer.addPlot(monitor_obj.entity.plot)
          this.drawCreate(monitor_obj)
        }
        if (this.updataLayerManagement) {
          this.updataLayerManagement(monitor_obj)
        }
      })
      this.earthDraw.ctx.listener.on('selectFeature', (monitor_obj) => {
        console.log(monitor_obj)
        if (this.callback) {
          this.callback(monitor_obj)
        }
      })

      setTimeout(() => {
        window.viewer = this.viewer
        this.plotdraw = new Plot.PlotDraw(this.viewer)
        this.plotSystem = this.plotdraw.GetInstance()._plotManager.system
        this.layerManager = this.plotSystem.getPlotGraphicLayerManager()
        this.subGraphicLayer = this.plotSystem
          .getPlotGraphicLayerManager()
          .graphicLayer(0)
          .getSubGraphicLayer(0)
      }, 2000)
    })
  }

  drawLayer(modeType, options = {}, callback, drawCreate) {
    this.earthDraw.changeMode(modeType, options)
    this.callback = callback
    this.drawCreate = drawCreate
  }

  openFile2(file, type) {
    const innerFileName = 'ss'
    var data = new Uint8Array(file)
    console.log(data)
    var stream = PlotModule.FS.open(innerFileName, 'w+')
    PlotModule.FS.write(stream, data, 0, data.length, 0)
    PlotModule.FS.close(stream)
    const instance = window.plot.plotdraw.GetInstance()
    console.log(instance)
    instance._plotManager.system.open(innerFileName)
    // this.dfs(this.plotSystem.getPlotGraphicLayerManager(), [], 0)
    instance._plotManager._plotLayerControl.refreshPlotTree()
    setTimeout(() => {
      instance._plotManager._plotPlayControl.updateActionList()
    }, 1000)
    this.earthDraw.changeMode('simple_select')
    if (type) {
      this.allHide(false)
    }
  }

  openFile(file) {
    const innerFileName = "ss";
    var data = new Uint8Array(file);
    var stream = window.PlotModule.FS.open(innerFileName, "w+");
    window.PlotModule.FS.write(stream, data, 0, data.length, 0);
    window.PlotModule.FS.close(stream);
    let plotManager = Plot.PlotDraw.GetInstance()._plotManager;
    plotManager.system.open(innerFileName);
    plotManager._plotLayerControl.refreshPlotTree();
    // this.dfs(system.getPlotGraphicLayerManager(), [], 0);
  }

  openString(str) {
    let file = this.stringToFile(str);
    file.arrayBuffer().then((e) => {
      this.openFile(e);
    });
  }

  stringToFile(str, fileName = "BH.sml", mimeType = "application/octet-stream") {
    // 1. 字符串转 Blob
    const blob = new Blob([str], { type: mimeType });
    // 2. Blob 转 File
    const file = new File([blob], fileName, { type: mimeType });
    return file;
  }

  dfs(data, res, index = 0) {
    if (data instanceof PIE.PlotGraphicLayerManager) {
      // PlotGraphicLayerManager只加GraphicLayer-图元层 GraphicLayer加SubGraphicLayer-可加标号和嵌套SubGraphicLayer；
      const counts = data.graphicLayerCount()
      for (let i = 0; i < counts; i++) {
        const layer = data.graphicLayer(i)
        const item = {
          key: index++,
          label: layer.getName(),
          ratio: layer.getReferenceScale().toFixed(0),
          type: 'root',
          visible: layer.getVisible(),
          valObject: layer,
          children: [],
          editShow: false, // 重命名
          moreShow: false // 更多面板显示
        }
        res.push(item)
        this.dfs(layer, item.children, index)
      }
    } else {
      const counts = data.getSubGraphicLayerCount() // 获取图元层
      for (let i = 0; i < counts; i++) {
        const subLayer = data.getSubGraphicLayer(i) // 通过索引获取子图层
        // const subLayer = layer.getSubGraphicLayer(0);
        const item = {
          key: index++,
          label: subLayer.getName(),
          type: 'group',
          visible: subLayer.getVisible(),
          valObject: subLayer,
          children: [],
          editShow: false,
          moreShow: false
        }
        const plots = subLayer.getPlotCount() // 获取当前子图层的标绘数量
        for (let j = 0; j < plots; j++) {
          const plotEntity = subLayer.getPlot(j)
          let plot = this.getRenderPlot(plotEntity) // 底层实体换成应用层
          Plot.isSmlBH = false
          if (!plot) {
            // 渲染层没有但底层有，说明是打开sml操作，需要手动加到渲染层
            Plot.isSmlBH = true // sml打开的标号记录-不再重新setSymbolCode，不重置样式
            const feature =
              this.earthDraw.ctx.store.geometryToFeature(plotEntity)
            const entity =
              this.earthDraw.ctx.store.render[feature.type].getEntity(feature)
            plot = entity.plot
            this.renderPlots.push(plot)
            this.temPlots.push(plot)
          }
          Plot.isSmlBH = false
          const plotItem = {
            key: index++,
            label: plot.getName(),
            type: 'plot',
            visible: plot.isVisible(),
            valObject: plot,
            children: [],
            editShow: false,
            moreShow: false
          }
          item.children.push(plotItem)
        }
        res.push(item)

        this.dfs(subLayer, item.children, index)
      }
    }
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

  loadSml(url, callback) {
    let self = this
    // url = "/data/第一回合红方力量图层7.sml"
    myAsyncFunctionGet(url).then(function (xml) {
      xml.response.arrayBuffer().then((e) => {
        // self.openFile(e, type)
        callback(e)
      })
    })

    function myAsyncFunctionGet(url) {
      return new Promise((resolve, reject) => {
        const xhr = new XMLHttpRequest()
        xhr.open('GET', url, true)
        xhr.responseType = 'blob'
        xhr.onload = () => resolve(xhr)
        xhr.onerror = () => reject(xhr.statusText)
        xhr.send()
      })
    }
  }

  allHide(visible) {
    let length = this.layerManager.graphicLayerCount()
    for (let i = 1; i < length; i++) {
      const element = this.layerManager.graphicLayer(i)
      let length1 = element.getSubGraphicLayerCount()
      for (let j = 0; j < length1; j++) {
        const item = element.getSubGraphicLayer(j)
        let length2 = item.getPlotCount()
        for (let k = 0; k < length2; k++) {
          const plot = item.getPlot(k)
          plot.setVisible(visible)
        }
      }
    }
  }

  allShowHide(visible, name) {
    let them = {
      green: '绿方力量',
      red: '红方力量',
      blue: '蓝方力量'
    }
    let graphicLayerCount = this.layerManager.graphicLayerCount()
    for (let i = graphicLayerCount - 1; i >= 0; i--) {
      let graphicLayer = this.layerManager.graphicLayer(i)
      if (graphicLayer.getName() == them[name]) {
        let length1 = graphicLayer && graphicLayer.getSubGraphicLayerCount()
        for (let j = 0; j < length1; j++) {
          const item = graphicLayer.getSubGraphicLayer(j)
          let length2 = item.getPlotCount()
          for (let k = 0; k < length2; k++) {
            const plot = item.getPlot(k)
            plot.setVisible(visible)
          }
        }
      }
    }
  }

  setVisible(rgb, index, visible) {
    let getSubGraphicLayer = this.layerManager
      .graphicLayer(rgb)
      .getSubGraphicLayer(index)
    let length = getSubGraphicLayer.getPlotCount()
    for (var i = 0; i < length; i++) {
      getSubGraphicLayer.getPlot(i).setVisible(visible)
    }
  }

  show(rgb, index) {
    this.setVisible(rgb, index, true)
  }

  hide(rgb, index) {
    this.setVisible(rgb, index, false)
  }

  setVisibleByName(name, index, visible) {
    let them = {
      green: '绿方力量',
      red: '红方力量',
      blue: '蓝方力量'
    }
    let graphicLayerCount = this.layerManager.graphicLayerCount()
    for (let i = graphicLayerCount - 1; i >= 0; i--) {
      let graphicLayer = this.layerManager.graphicLayer(i)
      if (graphicLayer.getName() == them[name]) {
        let subGraphicLayer = graphicLayer.getSubGraphicLayer(index)
        let plotCount = subGraphicLayer.getPlotCount()
        for (let k = plotCount - 1; k >= 0; k--) {
          let plot = subGraphicLayer.getPlot(k)
          plot.setVisible(visible)
        }
      }
    }
  }

  hideByName(name, index) {
    this.setVisibleByName(name, index, false)
  }

  showByName(name, index) {
    this.setVisibleByName(name, index, true)
  }

  //type 为 红方力量、绿方力量
  update(url, type) {
    this.remove(type)
    this.loadSml(url)
  }
  remove(type) {
    let graphicLayerCount = this.layerManager.graphicLayerCount()
    for (let i = graphicLayerCount - 1; i >= 0; i--) {
      let graphicLayer = this.layerManager.graphicLayer(i)
      if (graphicLayer.getName() == type) {
        let subGraphicLayerCount = graphicLayer.getSubGraphicLayerCount()
        for (let j = 0; j < subGraphicLayerCount; j++) {
          let subGraphicLayer = graphicLayer.getSubGraphicLayer(j)
          let plotCount = subGraphicLayer.getPlotCount()
          for (let k = plotCount - 1; k >= 0; k--) {
            let plot = subGraphicLayer.getPlot(k)
            // subGraphicLayer.removePlot(plot);
            plot.setVisible(false)
            // console.log(subGraphicLayer)
          }
        }
        this.layerManager.removeGraphicLayerByIndex(i)
      }
    }
    this.dfs(this.plotSystem.getPlotGraphicLayerManager(), [], 0)
  }
  removeAll() {
    // this.plotSystem = new PIE.PlotSystem()
    // this.layerManager = this.plotSystem.getPlotGraphicLayerManager()
    // this.graphicLayer = new PIE.PlotGraphicLayer()
    // //添加根图层
    // this.layerManager.addGraphicLayer(this.graphicLayer)
    // //添加子图层
    // this.subGraphicLayer = new PIE.PlotSubGraphicLayer({
    //   parent: this.graphicLayer
    // })
    this.earthDraw.ctx.editedLayer.removeAll()
    this.plotdraw = new Plot.PlotDraw(this.viewer)
    this.plotSystem = this.plotdraw.GetInstance()._plotManager.system
    this.layerManager = this.plotSystem.getPlotGraphicLayerManager()
    this.subGraphicLayer = this.plotSystem
      .getPlotGraphicLayerManager()
      .graphicLayer(0)
      .getSubGraphicLayer(0)
    this.earthDraw.ctx.editedLayer.removeAll()
  }
  drawPoint(callback) {
    let self = this
    let ellipsoid = window.EarthViewer.scene.globe.ellipsoid
    let handler = new window.MSIMEarth.ScreenSpaceEventHandler(
      window.EarthViewer.scene.canvas
    )
    let cartesian = null
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
          vertexs: self.transformCartesianToWGS84(cartesian)
        }
      }
      if (callback) {
        callback(object)
      }
    }, window.MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)
  }
  /**
   * @description 坐标转换 笛卡尔转84
   * @param {Object} Cartesian3 三维位置坐标
   * @return {Object} {lng,lat,alt} 地理坐标
   */
  transformCartesianToWGS84(cartesian) {
    if (window.EarthViewer && cartesian) {
      var ellipsoid = window.MSIMEarth.Ellipsoid.WGS84
      var cartographic = ellipsoid.cartesianToCartographic(cartesian)
      return {
        lng: window.MSIMEarth.Math.toDegrees(cartographic.longitude),
        lat: window.MSIMEarth.Math.toDegrees(cartographic.latitude),
        alt: cartographic.height
      }
    }
  }

  drawLine_fn(callback) {
    let self = this
    let ellipsoid = window.EarthViewer.scene.globe.ellipsoid
    let handler = new window.MSIMEarth.ScreenSpaceEventHandler(
      window.EarthViewer.scene.canvas
    )
    let positions = []
    let poly = null
    let cartesian = null
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
              color: window.MSIMEarth.Color.RED,
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
      if (positions.length == 3) {
        handler.destroy() //关闭事件句柄
        positions.pop() //最后一个点无效
        // poly.remove()
        mapElement.style.cursor = 'default'
        let pointList = []
        for (let i = 0; i < positions.length; i++) {
          const element = positions[i]
          pointList.push(self.transformCartesianToWGS84(element))
        }
        let object = {
          feature: {
            type: 'line',
            vertexs: pointList
          }
        }
        if (callback) {
          callback(object, poly)
        }
      }
    }, window.MSIMEarth.ScreenSpaceEventType.LEFT_CLICK)

    // 监听右击事件
    handler.setInputAction(function (movement) {
      handler.destroy() //关闭事件句柄
      // positions.pop(); //最后一个点无效
      // poly.remove()
      mapElement.style.cursor = 'default'
      let pointList = []
      for (let i = 0; i < positions.length; i++) {
        const element = positions[i]
        pointList.push(self.transformCartesianToWGS84(element))
      }
      let object = {
        feature: {
          type: 'line',
          vertexs: pointList
        }
      }
      if (callback) {
        callback(object, poly)
      }
      // let WGS84 = []
      // for (let i = 0; i < positions.length; i++) {
      //   const element = positions[i];
      //   WGS84.push(poly.transformCartesianToWGS84(element))
      // }
      // console.log(WGS84);
    }, window.MSIMEarth.ScreenSpaceEventType.RIGHT_CLICK)
  }
}

export default plot
