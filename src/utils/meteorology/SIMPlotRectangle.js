/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2024-01-26 16:50:12
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2024-06-18 12:19:05
 * @FilePath: \LVC-SIMEngineEditor\src\utils\SIMPlotRectangle.js
 * @Description: 绘制矩形图层方法类
 */

var rectangle = 1
class SIMPlotRectangle {
  constructor(options = {}) {
    this.type = 'rectangle'
    this.name = options.name
    this.coordinates = options.coordinates
    this.id =
      options.layerId !== undefined
        ? options.layerId
        : 'rectangleLayer' + rectangle++
    this.opacity = options.opacity !== undefined ? options.opacity : 1
    this.side = options.side !== undefined ? options.side : 1
    this.heightReference = options.heightReference ? true : false
    this.color = options.color !== undefined ? options.color : undefined
    // this.viewer = options.viewer;
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
      name: 'rectangle',
      rectangle: {
        coordinates: window.MSIMEarth.Rectangle.fromCartesianArray(
          window.MSIMEarth.Cartesian3.fromDegreesArray(
            this.getData(this.coordinates)
          )
        ),
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
      let lineData = JSON.parse(JSON.stringify(this.coordinates))
      let newLineData = this.getLineData(lineData)
      options.polyline = {
        positions: window.MSIMEarth.Cartesian3.fromDegreesArray(
          this.getData(newLineData)
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
    entity.rectangle.material.color.setValue(cesiumColor.withAlpha(opacity))
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

  updateData(coordinates) {
    const entity = this.getEntity()
    this.coordinates = coordinates
    let newCoordinates = window.MSIMEarth.Cartesian3.fromDegreesArray(
      this.getData(coordinates)
    )
    entity.rectangle.coordinates.setValue(
      new window.MSIMEarth.Rectangle.fromCartesianArray(newCoordinates)
    )
    let lineData = JSON.parse(JSON.stringify(coordinates))
    let newLineData = this.getLineData(lineData)
    entity.polyline.positions.setValue(
      window.MSIMEarth.Cartesian3.fromDegreesArray(this.getData(newLineData))
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

  getLineData(lineData) {
    let data = {
      regionPointList: []
    }
    let lonlat = []
    for (let i = 0; i < lineData.regionPointList.length; i++) {
      const element = lineData.regionPointList[i].position
      let temp = [element.x, element.y, element.z]
      lonlat.push(temp)
    }
    let point1 = turf.point(lonlat[0])
    let point2 = turf.point(lonlat[1])
    let features = turf.featureCollection([point1, point2])
    const rectangle = turf.envelope(features)
    for (let j = 0; j < rectangle.geometry.coordinates[0].length; j++) {
      const element = rectangle.geometry.coordinates[0][j]
      element[0]
      element[1]
      let temp = {
        position: {
          x: element[0],
          y: element[1],
          z: 0
        }
      }
      data.regionPointList.push(temp)
    }
    return data
  }

  getColor(side) {
    let color = PIESIM.SideTOColor(side)
    return window.MSIMEarth.Color.fromCssColorString(color)
  }
}
export default SIMPlotRectangle
