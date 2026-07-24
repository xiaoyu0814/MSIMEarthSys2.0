/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2024-01-20 14:41:40
 * @LastEditors: error: git config user.name && git config user.email & please set dead value or install git
 * @LastEditTime: 2024-08-25 09:15:23
 * @FilePath: \LVC-SIMEngineEditor\src\utils\SIMPlotLineLayer.js
 * @Description: 绘制线图层方法类
 */

var plotLineLayerArea = 1
class SIMPlotLineLayerByArea {
  constructor(options = {}) {
    this.type = 'PlotLineLayerByArea'
    this.navPath = options.navPath
    this.hierarchy = options.hierarchy
    this.id =
      options.id !== undefined
        ? 'path_' + options.id
        : 'plotLineLayer' + plotLineLayerArea++
    this.side = options.side !== undefined ? options.side : 1
    this.color = options.color !== undefined ? options.color : undefined
    this.lineWidth = options.lineWidth ? options.lineWidth : 1
    // this.viewer = options.viewer;
    // this.entity = null;
    this.isShow = true
    this.addLayer()
  }

  addLayer() {
    let color = ''
    if (this.color == undefined) {
      color = this.getColor(this.side)
    } else {
      color = window.MSIMEarth.Color.fromCssColorString(this.color)
    }
    // 创建带高度线
    window.EarthViewer.entities.add({
      id: this.id,
      polyline: {
        positions: window.MSIMEarth.Cartesian3.fromDegreesArrayHeights(
          this.getData(this.hierarchy)
        ),
        // clampToGround: true,
        material: color, // 普通线
        // material: new window.MSIMEarth.PolylineArrowMaterialProperty(color), // 带箭头线
        // material: new window.MSIMEarth.PolylineDashMaterialProperty({
        //   color,
        //   dashLength: 10.0, // 虚线的段长度
        //   spaceLength: 10.0 // 虚线之间的空白长度
        // }), // 虚线
        width: this.lineWidth
      }
    })
  }

  getEntity() {
    return window.EarthViewer.entities.getById(this.id)
  }

  updateWidth(width) {
    const entity = this.getEntity()
    this.lineWidth = width
    entity.polyline.width.setValue(width)
  }

  updateColor(color) {
    const entity = this.getEntity()
    let cesiumColor = window.MSIMEarth.Color.fromCssColorString(color)
    entity.polyline.material.color.setValue(cesiumColor)
  }

  updatePosition(data, index) {
    this.hierarchy[index] = data
    this.updateData(this.hierarchy)
  }

  updateData(navPath) {
    const entity = this.getEntity()
    this.hierarchy = navPath
    let newNavPath = window.MSIMEarth.Cartesian3.fromDegreesArrayHeights(
      this.getData(navPath)
    )
    // let newNavPath = window.MSIMEarth.Cartesian3.fromDegreesArray(
    //   this.getData(navPath)
    // );
    entity.polyline.positions.setValue(newNavPath)
  }

  isShowEntity(isShow) {
    const entity = this.getEntity()
    this.isShow = isShow
    entity.show = isShow
  }

  removePosition(index) {
    this.hierarchy.areaPointlist.splice(index, 1)
    this.updateData(this.hierarchy)
  }

  getData(data) {
    let dataList = []
    for (let i = 0; i < data.areaPointlist.length; i++) {
      const element = data.areaPointlist[i].position
      for (const key in element) {
        if (Object.hasOwnProperty.call(element, key)) {
          const item = element[key]
          // if (key != "z") {
          dataList.push(item)
          // }
        }
      }
    }
    return dataList
  }
  clearLayer() {
    window.EarthViewer.entities.removeById(this.id)
  }
  getColor(side) {
    let color = PIESIM.SideTOColor(side)
    return window.MSIMEarth.Color.fromCssColorString(color)
  }
}

export default SIMPlotLineLayerByArea
