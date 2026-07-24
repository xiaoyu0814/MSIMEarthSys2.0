/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2024-03-04 15:59:21
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2024-06-17 17:00:55
 * @FilePath: \missionEdit\src\utils\SIMPlotPointLayer.js
 * @Description: 绘制区域名称图层方法类
 */
class SIMPlotPointLayer {
  constructor(options) {
    this.id = options.id
    this.type = 'point'
    this.position = options.position
    this.color = options.color != undefined ? options.color : '#FF0000'
    this.opacity = options.opacity != undefined ? options.opacity : 1
    this.name = options.name != undefined ? options.name : '无'
    this.isShow = true
    this.addLayer()
  }

  addLayer() {
    let position = window.MSIMEarth.Cartesian3.fromDegrees(
      Number(this.position[0]),
      Number(this.position[1]),
      this.position[2] ? Number(this.position[2]) : 0
    )
    let entity = window.EarthViewer.entities.add({
      show: this.isShow,
      id: this.id,
      position: position,
      point: {
        color: window.MSIMEarth.Color.fromCssColorString(this.color).withAlpha(
          this.opacity
        ),
        pixelSize: 10
      },
      label: {
        text: this.name,
        font: 'bolder 16pt Lucida Console',
        style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        fillColor: window.MSIMEarth.Color.fromCssColorString(this.color),
        pixelOffset: new window.MSIMEarth.Cartesian2(15, 20)
      }
    })
  }

  getEntity() {
    return window.EarthViewer.entities.getById(this.id)
  }

  setText(name) {
    this.getEntity().label.text = name
  }

  updateColor(color, opacity) {
    this.getEntity().point.color =
      window.MSIMEarth.Color.fromCssColorString(color).withAlpha(opacity)
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

  isShowEntity(isShow) {
    this.isShow = isShow
    this.getEntity().show = isShow
  }

  updateLayer(options) {
    this.setText(options.name)
    this.setColor(options.color)
  }

  clearLayer() {
    window.EarthViewer.entities.removeById(this.id)
  }
}

export default SIMPlotPointLayer
