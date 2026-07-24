import store from '@/store'
export default class JBController {
  constructor() {
    this.init()
  }
  init() {
    createEarthModule().then(() => {
      const plotSystem = new PIE.PlotSystem()
      let layerManager = plotSystem.getPlotGraphicLayerManager()
      let graphicLayer = new PIE.PlotGraphicLayer()
      //添加根图层
      layerManager.addGraphicLayer(graphicLayer)
      //添加子图层
      let subGraphicLayer = new PIE.PlotSubGraphicLayer({
        parent: graphicLayer
      })
      window.subGraphicLayer = subGraphicLayer

      window.MEarth = window.MSIMEarth
      window.earthDraw = new EarthDraw.setup(window.EarthViewer, {})

      earthDraw.ctx.listener.on('draw.create', ({ feature, entity }) => {
        subGraphicLayer.addPlot(entity.plot)
      })
    })
  }
  addPlot() {
    let point = window.EarthViewer.entities.add(
      new Plot.Entity({
        plot: {
          code: 10201,
          position: window.MSIMEarth.Cartesian3.fromDegrees(128, 39)
        }
      })
    )
    subGraphicLayer.addPlot(point.plot)

    const drawAttr = point.plot.getDrawAttr()
    //线宽 毫米
    drawAttr.setLineWidth(1)
    //线色
    drawAttr.setLineColor([255, 255, 0, 255])
    //随图缩放
    drawAttr.setScaleWidthMap(true)
    drawAttr.setAngle(0)

    drawAttr.setSymbolSize([20, 20])

    drawAttr.setInlineTextString('中国')

    //三维属性--------
    const tdAttr = point.plot.getTDAttr()
    //拉伸厚度  毫米
    tdAttr.setDepth(1)
    //显示类型
    // tdAttr.setDisplayType(PIE.PlotDotDisplayType.Billboard)
    tdAttr.setDisplayType(PIE.PlotDotDisplayType.Lie)

    //注记属性--------
    const annoAttr = point.plot.getAnnoAttr()
    //注记文本
    annoAttr.setAnnoText('中国')
    //注记位置
    annoAttr.setAnnoPos(PIE.PlotAnnoPos.BottomCenter)
    //字体名称
    const fontName = '微软雅黑'
    annoAttr.setFontName(fontName)
    //字体颜色
    annoAttr.setFontColor([255, 255, 0, 255])
    //字体大小
    // annoAttr.setFontSize(1);
    //粗体
    annoAttr.setBold(false)
    //下划线
    annoAttr.setUnderline(false)
    //删除线
    annoAttr.setStrikeOut(false)
    //斜体
    annoAttr.setItalic(false)
    //背景色
    annoAttr.setBackColor([255, 0, 0, 100])
    //边界色
    annoAttr.setBorderColor([0, 255, 0, 255])
    //阴影色
    annoAttr.setShadowColor([255, 255, 255, 255])
    //边界宽度  毫米
    annoAttr.setBorderWidth(1)
    //阴影的X偏离值  毫米
    annoAttr.setShadowOffsetX(1)
    //阴影的Y偏离值  毫米
    annoAttr.setShadowOffsetY(1)
    console.log(point)
    //刷新接口，修改属性后可手动刷新
    point.updatePlot()

    window.EarthViewer.zoomTo(point)
  }
  addPlot2() {
    let line2 = window.EarthViewer.entities.add({
      plot: {
        code: 30303,
        positions: [118, 37, 118.39155, 37, 118.39155, 38]
      }
    })
    subGraphicLayer.addPlot(line2.plot)
    window.line2 = line2
    const drawAttr = line2.plot.getDrawAttr()
    //线宽 毫米
    drawAttr.setLineWidth(1)
    drawAttr.setFillStyle(PIE.PlotFillStyle.Solid)
    drawAttr.setFillColor([255, 255, 0, 255])

    const tdAttr = line2.plot.getTDAttr()
    //拉伸厚度 毫米
    tdAttr.setDepth(0.5)
    line2.updatePlot()
    window.EarthViewer.zoomTo(line2)
  }
  drawPlot() {
    window.earthDraw.changeMode('draw_pointPlot', {
      single: true,
      code: 10201
      // style: {
      // },
    })
  }
}
