/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2024-01-26 16:50:12
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2024-06-18 09:31:15
 * @FilePath: \LVC-SIMEngineEditor\src\utils\SIMPlotCircular.js
 * @Description: 绘制圆形图层方法类
 */

var circular = 1
class SIMPlotCircular {
  constructor(options = {}) {
    this.type = 'circular'
    this.name = options.name
    this.id =
      options.layerId !== undefined
        ? options.layerId
        : 'rectangleLayer' + circular++
    this.opacity = options.opacity !== undefined ? options.opacity : 1
    this.side = options.side !== undefined ? options.side : 1
    this.color = options.color !== undefined ? options.color : undefined
    this.semiMinorAxis = options.semiMinorAxis
    this.semiMajorAxis = options.semiMajorAxis
    // this.viewer = options.viewer;
    this.isShow = true
    this.areaType = options.areaType
    this.position = options.position
    this.outlineWidth =
      options.outlineWidth !== undefined ? options.outlineWidth : 3
    this.addLayer()
  }

  addLayer() {
    let position = window.MSIMEarth.Cartesian3.fromDegrees(
      Number(this.position[0]),
      Number(this.position[1]),
      this.position[2] ? Number(this.position[2]) : 0
    )
    const options = {
      id: this.id,
      show: true,
      name: 'circular',
      position: position,
      ellipse: {
        semiMinorAxis: this.semiMinorAxis,
        semiMajorAxis: this.semiMajorAxis,
        height: 0,
        material: window.MSIMEarth.Color.fromCssColorString(
          this.color
        ).withAlpha(this.opacity),
        outline: true, // height must be set for outlines to display
        outlineWidth: this.outlineWidth,
        outlineColor: window.MSIMEarth.Color.fromCssColorString(this.color)
      }
    }
    window.EarthViewer.entities.add(options)
  }

  getEntity() {
    return window.EarthViewer.entities.getById(this.id)
  }

  updateColor(color, opacity) {
    const entity = this.getEntity()
    let cesiumColor = window.MSIMEarth.Color.fromCssColorString(color)
    entity.ellipse.material.color.setValue(cesiumColor.withAlpha(opacity))
    entity.ellipse.outlineColor.setValue(cesiumColor)
  }

  setPosition(position) {
    let newposition = new window.MSIMEarth.Cartesian3.fromDegrees(
      Number(position[0]),
      Number(position[1]),
      position[2] ? Number(position[2]) : 0
    )
    if (this.getEntity()) {
      this.getEntity().position.setValue(newposition)
    }
  }

  setOutlineWidth(outlineWidth) {
    const entity = this.getEntity()
    entity.ellipse.outlineWidth.setValue(Number(outlineWidth))
  }

  setSemiMajorAxis(semiMajorAxis) {
    const entity = this.getEntity()
    entity.ellipse.semiMajorAxis.setValue(Number(semiMajorAxis))
  }

  setSemiMinorAxis(semiMinorAxis) {
    const entity = this.getEntity()
    entity.ellipse.semiMinorAxis.setValue(Number(semiMinorAxis))
  }

  setAngle(angle) {
    const entity = this.getEntity()
    entity.ellipse.rotation = window.MSIMEarth.Math.toRadians(angle)
  }

  isShowEntity(isShow) {
    const entity = this.getEntity()
    this.isShow = isShow
    entity.show = isShow
  }

  clearLayer() {
    window.EarthViewer.entities.removeById(this.id)
  }

  getData(data) {
    let dataList = []
    for (let i = 0; i < data.regionPointList.length; i++) {
      const element = data.regionPointList[i].position
      for (const key in element) {
        if (Object.hasOwnProperty.call(element, key)) {
          const item = element[key]
          if (key != 'z') {
            dataList.push(item)
          }
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
export default SIMPlotCircular
