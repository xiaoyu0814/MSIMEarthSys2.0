/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2024-01-20 14:41:40
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2024-05-28 19:38:11
 * @FilePath: \LVC-SIMEngineEditor\src\utils\SIMPlotLineLayer.js
 * @Description: 绘制线图层方法类
 */

var plotLineLayer = 1
class SIMPlotLineLayer {
  constructor(options = {}) {
    this.type = 'PlotLineLayer'
    this.navPath = options.navPath
    this.id =
      options.id !== undefined
        ? 'path_' + options.id
        : 'plotLineLayer' + plotLineLayer++
    this.side = options.side !== undefined ? options.side : 1
    this.color = options.color !== undefined ? options.color : undefined
    this.lineWidth = options.navPath.num ? options.navPath.num : 1
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
          this.getData(this.navPath)
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
    this.navPath.NavPointlist[index] = data
    this.updateData(this.navPath)
  }

  updateData(navPath) {
    const entity = this.getEntity()
    this.navPath = navPath
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
    this.navPath.NavPointlist.splice(index, 1)
    this.updateData(this.navPath)
  }

  getData(data) {
    let dataList = []
    for (let i = 0; i < data.NavPointlist.length; i++) {
      const element = data.NavPointlist[i].position
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
  getColor(side) {
    let color = PIESIM.SideTOColor(side)
    return window.MSIMEarth.Color.fromCssColorString(color)
  }
}

export default SIMPlotLineLayer
