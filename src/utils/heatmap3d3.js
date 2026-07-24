/*
 * @description:
 * @Version: 1.0
 * @Author: Li
 * @Date: 2023-06-20 15:22:50
 * @LastEditors: ZX Li
 * @LastEditTime: 2024-12-12 11:17:24
 */
/**
 * @description 三维热力图类，基于h337类扩展
 */
class Heatmap3d {
  /**
   * @param {Cesium.} viewer 地图viewer对象
   * @param {Object} opt 基础参数
   * @param {Array} opt.list 热力值数组
   * @param {Array} opt.gradient 颜色配置
   */
  constructor(viewer, cesium, opt) {
    this.viewer = viewer
    this.cesium = cesium
    this.opt = opt || {}
    this.list = this.opt.list || []
    if (!this.list || this.list.length < 2) {
      console.log('热力图点位不得少于3个！')
      return
    }
    this.dom = undefined
    this.entity = undefined
    this.lngArr = []
    this.latArr = []
    this.canvasw = 600

    this.createDom()
    let config = {
      container: document.getElementById(`easy3d-heatmap-${this.id}`),
      radius: this.opt.raduis || 20,
      maxOpacity: 0.7,
      minOpacity: 0,
      blur: 0.75,
      gradient: this.opt.gradient || {
        '.1': 'blue',
        '.5': 'yellow',
        '.7': 'red',
        '.99': 'white'
      }
    }
    this.heatmapInstance = h337.create(config)
    this.init()
  }

  init() {
    for (let ind = 0; ind < this.list.length; ind++) {
      if (
        this.list[ind].lnglat[0] == undefined ||
        this.list[ind].lnglat[1] == undefined
      )
        continue
      this.lngArr.push(this.list[ind].lnglat[0])
      this.latArr.push(this.list[ind].lnglat[1])
    }

    let points = []
    let maxLng = Math.max(...this.lngArr)
    let minLng = Math.min(...this.lngArr)
    let maxLat = Math.max(...this.latArr)
    let minLat = Math.min(...this.latArr)

    let e = new this.cesium.Rectangle()
    e.east = (maxLng * Math.PI) / 180
    e.west = (minLng * Math.PI) / 180
    e.north = (maxLat * Math.PI) / 180
    e.south = (minLat * Math.PI) / 180

    let xRange = e.east - e.west
    let yRange = e.north - e.south

    let lngArray1 = [],
      lngArray2 = []
    if (e.east - e.west > Math.PI) {
      this.lngArr.forEach((lng) => {
        if (lng >= 0) {
          lngArray1.push((lng * Math.PI) / 180)
        } else {
          lngArray2.push((lng * Math.PI) / 180)
        }
      })
      e.west = Math.min(...lngArray1)
      e.east = Math.max(...lngArray2)
      xRange = 2 * Math.PI + e.east - e.west
    }

    let epsilon = this.cesium.Math.EPSILON7
    if (e.east - e.west < epsilon) {
      e.east += epsilon * 2.0
    }
    if (e.north - e.south < epsilon) {
      e.north += epsilon * 2.0
    }

    for (let i = 0; i < this.list.length; i++) {
      if (this.list[i].value == 0) {
        continue
      }
      let lng = this.list[i].lnglat[0]
      let lat = this.list[i].lnglat[1]
      if (lng < 0) {
        points.push({
          y: Number(
            (((e.north * 180) / Math.PI - lat) / ((yRange * 180) / Math.PI)) *
              this.canvasw
          ).toFixed(0),
          x: Number(
            ((360 + lng - (e.west * 180) / Math.PI) /
              ((xRange * 180) / Math.PI)) *
              this.canvasw
          ).toFixed(0),
          value: Number(this.list[i].value)
        })
      } else {
        points.push({
          y: Number(
            (((e.north * 180) / Math.PI - lat) / ((yRange * 180) / Math.PI)) *
              this.canvasw
          ).toFixed(0),
          x: Number(
            ((lng - (e.west * 180) / Math.PI) / ((xRange * 180) / Math.PI)) *
              this.canvasw
          ).toFixed(0),
          value: Number(this.list[i].value)
        })
      }
    }

    this.heatmapInstance.setData({ max: 20, data: points })
    var canvas = document.getElementsByClassName('heatmap-canvas')
    this.entity = this.viewer.entities.add({
      id: 'heatmap',
      rectangle: {
        coordinates: e,
        material: new this.cesium.ImageMaterialProperty({
          image: canvas[0],
          transparent: true
        })
      }
    })
  }

  /**
   * 销毁
   */
  destroy() {
    let dom = document.getElementById(`easy3d-heatmap-${this.id}`)
    if (dom) dom.remove()
    if (this.entity) {
      this.viewer.entities.remove(this.entity)
      this.entity = undefined
    }
  }

  // 创建dom对象
  createDom() {
    this.dom = window.document.createElement('div')
    this.dom.id = `easy3d-heatmap-${this.id}`
    this.dom.className = `easy3d-heatmap`
    this.dom.style.width = this.canvasw + 'px'
    this.dom.style.height = this.canvasw + 'px'
    this.dom.style.position = 'absolute'
    this.dom.style.display = 'none'
    let mapDom = window.document.getElementById(this.viewer.container.id)
    mapDom.appendChild(this.dom)
  }
}

export { Heatmap3d }
