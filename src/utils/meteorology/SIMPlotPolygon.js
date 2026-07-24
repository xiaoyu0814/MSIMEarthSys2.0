/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2024-01-24 14:16:44
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2024-06-18 12:17:22
 * @FilePath: \LVC-SIMEngineEditor\src\utils\SIMPlotPolygon.js
 * @Description: 绘制多边形图层方法类
 */

var polygon = 1
class SIMPlotPolygon {
  constructor(options = {}) {
    this.type = 'polygon'
    this.name = options.name
    this.hierarchy = options.hierarchy
    this.id =
      options.layerId !== undefined
        ? options.layerId
        : 'polygonLayer' + polygon++
    this.opacity = options.opacity !== undefined ? options.opacity : 1
    this.side = options.side !== undefined ? options.side : 1
    this.heightReference = options.heightReference ? true : false
    this.color = options.color !== undefined ? options.color : undefined
    this.isShow = true
    this.areaType = options.areaType
    this.outlineWidth = options.lineWidth !== undefined ? options.lineWidth : 3
    this.lineType = options.lineType !== undefined ? options.lineType : 'Solid'
    this.addLayer()
  }

  addLayer() {
    const options = {
      id: this.id,
      show: true,
      name: 'polygon',
      polygon: {
        hierarchy: window.MSIMEarth.Cartesian3.fromDegreesArray(
          this.getData(this.hierarchy)
        ),
        heightReference: this.heightReference
          ? window.MSIMEarth.HeightReference.CLAMP_TO_GROUND
          : window.MSIMEarth.HeightReference.NONE,
        material:
          this.color !== undefined
            ? window.MSIMEarth.Color.fromCssColorString(this.color).withAlpha(
                this.opacity
              )
            : this.getColor(this.side).withAlpha(this.opacity),
        height: 0,
        outline: false
        // outlineColor:
        //   this.color !== undefined
        //     ? window.MSIMEarth.Color.fromCssColorString(this.color).withAlpha(1)
        //     : this.getColor(this.side).withAlpha(1),
        // outlineWidth: this.outlineWidth, // 边框宽度
      }
    }
    if (this.outlineWidth > 0) {
      let lineData = JSON.parse(JSON.stringify(this.hierarchy))
      lineData.areaPointlist[lineData.areaPointlist.length] =
        lineData.areaPointlist[0]
      options.polyline = {
        positions: window.MSIMEarth.Cartesian3.fromDegreesArray(
          this.getData(lineData)
        ),
        // clampToGround: true,
        width: this.outlineWidth
      }
      if (this.lineType == 'Dash') {
        options.polyline.material =
          new window.MSIMEarth.PolylineDashMaterialProperty({
            color: window.MSIMEarth.Color.fromCssColorString(this.color),
            dashLength: 10.0, // 虚线的段长度
            spaceLength: 10.0 // 虚线之间的空白长度
          }) // 虚线
      } else if (this.lineType == 'Arrow') {
        options.polyline.material =
          new window.MSIMEarth.PolylineArrowMaterialProperty(
            window.MSIMEarth.Color.fromCssColorString(this.color)
          ) // 带箭头线
      } else {
        options.polyline.material = window.MSIMEarth.Color.fromCssColorString(
          this.color
        ) // 普通线
      }
    }
    window.EarthViewer.entities.add(options)
  }

  getEntity() {
    return window.EarthViewer.entities.getById(this.id)
  }

  setOutlineWidth(outlineWidth) {
    const entity = this.getEntity()
    entity.polyline.width.setValue(Number(outlineWidth))
  }

  updateColor(color, opacity, lineType) {
    if (lineType) {
      this.lineType = lineType
    }
    const entity = this.getEntity()
    const cesiumColor = window.MSIMEarth.Color.fromCssColorString(color)
    entity.polygon.material.color.setValue(cesiumColor.withAlpha(opacity))
    // entity.polygon.outlineColor.setValue(cesiumColor.withAlpha(1));
    if (this.lineType == 'Dash') {
      entity.polyline.material =
        new window.MSIMEarth.PolylineDashMaterialProperty({
          color: cesiumColor,
          dashLength: 10.0, // 虚线的段长度
          spaceLength: 10.0 // 虚线之间的空白长度
        })
    } else if (this.lineType == 'Arrow') {
    } else {
      entity.polyline.material = cesiumColor
    }
  }

  updatePosition(data, index) {
    this.hierarchy.areaPointlist[index] = data
    this.updateData(this.hierarchy)
  }

  removePosition(index) {
    this.hierarchy.areaPointlist.splice(index, 1)
    this.updateData(this.hierarchy)
  }

  updateData(hierarchy) {
    const entity = this.getEntity()
    this.hierarchy = hierarchy
    let newHierarchy = window.MSIMEarth.Cartesian3.fromDegreesArray(
      this.getData(hierarchy)
    )
    entity.polygon.hierarchy.setValue(
      new window.MSIMEarth.PolygonHierarchy(newHierarchy)
    )
    let lineData = JSON.parse(JSON.stringify(hierarchy))
    lineData.areaPointlist[lineData.areaPointlist.length] =
      lineData.areaPointlist[0]
    entity.polyline.positions.setValue(
      window.MSIMEarth.Cartesian3.fromDegreesArray(this.getData(lineData))
    )
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
    for (let i = 0; i < data.areaPointlist.length; i++) {
      const element = data.areaPointlist[i].position
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
export default SIMPlotPolygon
