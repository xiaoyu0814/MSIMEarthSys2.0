/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2024-03-04 15:59:21
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2024-10-31 13:50:55
 * @FilePath: \missionEdit\src\utils\SIMRegionNameLayer.js
 * @Description: 绘制区域名称图层方法类
 */
class SIMRegionNameLayer {
  constructor(options) {
    this.id = options.id
    this.position = options.position
    this.code = options.code
    this.color = options.color != undefined ? options.color : [255, 0, 0, 255]
    this.lineWidth = options.lineWidth != undefined ? options.lineWidth : 0.2
    this.size = options.size != undefined ? options.size : [5, 5]
    this.rotation = options.rotation != undefined ? options.rotation : 0
    this.text = options.text != undefined ? options.text : '无'
    this.img = options.img != undefined ? options.img : this.text
    this.isShow = true
    this.addLayer()
  }

  addLayer() {
    console.log('这里呢', this.img)

    let position = window.MSIMEarth.Cartesian3.fromDegrees(
      Number(this.position[0]),
      Number(this.position[1]),
      this.position[2] ? Number(this.position[2]) : 0
    )
    let entity = window.EarthViewer.entities.add({
      show: this.isShow,
      id: this.id,
      position: position,
      label: {
        // text: this.text,
        text: '',
        font: 'bolder 16pt Lucida Console',
        style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        fillColor: window.MSIMEarth.Color.fromCssColorString(this.color)
      },
      billboard: {
        image: this.img,
        width: 100,
        height: 100
      }
    })
  }

  getEntity() {
    return window.EarthViewer.entities.getById(this.id)
  }

  setText(name) {
    this.getEntity().label.text = name
  }

  setColor(color) {
    this.getEntity().label.fillColor =
      window.MSIMEarth.Color.fromCssColorString(color)
  }

  setPosition(position) {
    let newposition = new window.MSIMEarth.Cartesian3.fromDegrees(
      Number(position[0]),
      Number(position[1]),
      Number(position[2])
    )
    if (this.getEntity()) {
      this.getEntity().position.setValue(newposition)
    }
  }

  setVisible(isShow) {
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

export default SIMRegionNameLayer
