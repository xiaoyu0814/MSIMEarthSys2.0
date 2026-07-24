import { createSensors } from './entityCallbackProperty'
/**
 * entity数据的加载、更新、清除等
 * @param
 */
export default class entity {
  constructor(config) {
    this.earth = config.earth
    this.viewer = config.viewer
  }
  //添加点
  addPoint(options) {
    this.viewer.entities.add({
      id: options.text,
      position: this.earth.Cartesian3.fromDegrees(
        options.longitude,
        options.latitude,
        0
      ),
      point: {
        pixelSize: options.pixelSize || 7,
        color: options.color || this.earth.Color.WHITE, // 设置颜色并设置透明度,
        outlineColor: this.earth.Color.BLACK.withAlpha(0.5),
        outlineWidth: 4,
        distanceDisplayCondition:
          options.distanceDisplayCondition ||
          new this.earth.DistanceDisplayCondition(0, 25e5)
      },
      label: {
        text: options.text,
        font: 'bold 16px MicroSoft YaHei',
        outlineColor: this.earth.Color.WHITE,
        outlineWidth: 2,
        style: this.earth.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: options.pixelOffset || new this.earth.Cartesian2(-20, -30),
        fillColor:
          options.labelColor || window.MSIMEarth.Color.BLACK.withAlpha(0.5),
        horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
        verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
        // pixelOffset: new window.MSIMEarth.Cartesian2(-35, -10),
        backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
        distanceDisplayCondition:
          options.distanceDisplayCondition ||
          new this.earth.DistanceDisplayCondition(0, 20e5),
        eyeOffset: new window.MSIMEarth.ConstantProperty(
          new window.MSIMEarth.Cartesian3(0, 0, -1)
        )
      }
    })
  }
  // 添加线
  addPolyline(options) {
    this.viewer.entities.add({
      id: options.text,
      position:
        options.position ||
        this.earth.Cartesian3.fromDegrees(
          options.coordinate[2],
          options.coordinate[3],
          0
        ),
      polyline: {
        positions: this.earth.Cartesian3.fromDegreesArray(options.coordinate),
        width: options.width || 5.0,
        material: options.material || this.earth.Color.BLUE,
        distanceDisplayCondition:
          options.distanceDisplayCondition ||
          new this.earth.DistanceDisplayCondition(0, 25e5)
      },
      label: {
        text: options.text,
        verticalOrigin: this.earth.VerticalOrigin.TOP,
        font: '12px sans-serif',
        fillColor: options.fillColor || this.earth.Color.WHITE,
        pixelOffset: options.pixelOffset || new this.earth.Cartesian2(0, -30),
        distanceDisplayCondition:
          options.distanceDisplayCondition ||
          new this.earth.DistanceDisplayCondition(0, 25e5)
      }
    })
  }
  // 添加空间盒
  addPolygon(options) {
    this.viewer.entities.add({
      id: options.code,
      polygon: {
        hierarchy: this.earth.Cartesian3.fromDegreesArray([
          options.lonMin,
          options.latMin,
          options.lonMax,
          options.latMin,
          options.lonMax,
          options.latMax,
          options.lonMin,
          options.latMax
        ]),
        extrudedHeight: options.heightMax - options.heightMin,
        material: this.earth.Color.RED.withAlpha(0.2),
        outline: true,
        outlineColor: this.earth.Color.RED.withAlpha(0.5),
        arcType: this.earth.ArcType.RHUMB
      }
    })
  }
  // 添加第一层网格
  addfirtsGrid(maxLon, minLon, maxLat, minLat, lonD, latD) {
    // 经线
    let latS = []
    for (let lat = minLat; lat <= maxLat; lat += latD) {
      latS.push(lat)
    }
    //每隔6读绘制一条经度线和经度标注,自己控制间隔
    for (let lon = minLon; lon <= maxLon; lon += lonD) {
      // let text = ''
      // if (lon === 0) {
      //   text = '0'
      // }
      // text += lon === 0 ? '' : '' + lon + '°'
      // if (lon === minLon) {
      //   text = ''
      // }

      this.viewer.entities.add({
        id: 'lon间隔' + lonD + '-' + lon,
        position: this.earth.Cartesian3.fromDegrees(lon, 0),
        polyline: {
          positions: this.earth.Cartesian3.fromDegreesArray(
            latS
              .map((lat) => {
                return [lon, lat].join(',')
              })
              .join(',')
              .split(',')
              .map((item) => Number(item))
          ),
          width: 1.0,
          material: this.earth.Color.RED
        }
        // label: {
        //   text: text,
        //   verticalOrigin: this.earth.VerticalOrigin.TOP,
        //   font: '12px sans-serif',
        //   fillColor: this.earth.Color.WHITE
        // }
      })
    }

    // 纬线
    let lonS = []
    for (let lon = minLon; lon <= maxLon; lon += lonD) {
      lonS.push(lon)
    }
    //每隔10读绘制一条纬度线和纬度标注,自己控制间隔
    for (let lat = minLat; lat <= maxLat; lat += latD) {
      let text = ''
      text += '' + lat + '°'
      if (lat === 0) {
        text = ''
      }
      this.viewer.entities.add({
        id: 'lat间隔' + latD + '-' + lat,
        position: this.earth.Cartesian3.fromDegrees(0, lat),
        polyline: {
          positions: this.earth.Cartesian3.fromDegreesArray(
            lonS
              .map((long) => {
                return [long, lat].join(',')
              })
              .join(',')
              .split(',')
              .map((item) => Number(item))
          ),
          width: 1.0,
          material: this.earth.Color.RED
        }
        // label: {
        //   text: text,
        //   font: '12px sans-serif',
        //   fillColor: this.earth.Color.WHITE
        // }
      })
    }

    for (let lat = -80; lat < 80; lat += 4) {
      for (let lon = -180; lon <= 180; lon += 6) {
        let latText
        if (lat > 0) {
          latText = String.fromCharCode(64 + lat / 4 + 1)
        } else if (lat < 0) {
          latText = String.fromCharCode(64 + Math.abs(lat) / 4)
        } else {
          latText = String.fromCharCode(64 + Math.abs(lat) / 4 + 1)
        }
        let text =
          (lat < 0 ? 'S' : 'N') +
          ((180 - lon) / 6 < 10 ? '0' + (180 - lon) / 6 : (180 - lon) / 6) +
          latText
        this.viewer.entities.add({
          id: text,
          position: this.earth.Cartesian3.fromDegrees(lon + 3, lat + 2, 0),
          label: {
            text: text,
            font: '14px sans-serif',
            fillColor: this.earth.Color.YELLOW,
            outlineColor: this.earth.Color.BLACK,
            outlineWidth: 2,
            style: this.earth.LabelStyle.FILL_AND_OUTLINE,
            // pixelOffset: new this.earth.Cartesian2(0, -30),
            distanceDisplayCondition: new this.earth.DistanceDisplayCondition(
              0,
              100e5
            )
          }
        })
        // this.addPoint({
        //   text: text,
        //   latitude: lat,
        //   longitude: lon,
        //   distanceDisplayCondition: new this.earth.DistanceDisplayCondition(
        //     0,
        //     100e5
        //   )
        // })
      }
    }
  }
  // 添加第二层网格
  // 123, 112, 43, 32, 0.5, 0.5
  addSecondGrid(maxLon, minLon, maxLat, minLat, lonD, latD) {
    // 经线
    let latS = []
    for (let lat = minLat; lat <= maxLat; lat += latD) {
      if (lat > maxLat) break
      if (lat < minLat) continue
      latS.push(lat)
    }
    //每隔6读绘制一条经度线和经度标注,自己控制间隔
    for (let lon = -180; lon <= 180; lon += lonD) {
      if (lon > maxLon) break
      if (lon < minLon) continue

      this.viewer.entities.add({
        id: 'lon间隔' + lonD + '-' + lon,
        position: this.earth.Cartesian3.fromDegrees(lon, 0),
        polyline: {
          positions: this.earth.Cartesian3.fromDegreesArray(
            latS
              .map((lat) => {
                return [lon, lat].join(',')
              })
              .join(',')
              .split(',')
              .map((item) => Number(item))
          ),
          width: 1.0,
          material: this.earth.Color.WHITE.withAlpha(0.5)
        }
        // label: {
        //   text: text,
        //   verticalOrigin: this.earth.VerticalOrigin.TOP,
        //   font: '12px sans-serif',
        //   fillColor: this.earth.Color.WHITE
        // }
      })
    }

    // 纬线
    let lonS = []
    for (let lon = minLon; lon <= maxLon; lon += lonD) {
      if (lon > maxLon) break
      if (lon < minLon) continue
      lonS.push(lon)
    }
    //每隔10读绘制一条纬度线和纬度标注,自己控制间隔
    for (let lat = -80; lat <= 80; lat += latD) {
      if (lat > maxLat) break
      if (lat < minLat) continue
      // if (lat >= minLat && lat - latD > minLat) lat = lat
      let text = ''
      text += '' + lat + '°'
      if (lat === 0) {
        text = ''
      }
      this.viewer.entities.add({
        id: 'lat间隔' + latD + '-' + lat,
        position: this.earth.Cartesian3.fromDegrees(0, lat),
        polyline: {
          positions: this.earth.Cartesian3.fromDegreesArray(
            lonS
              .map((long) => {
                return [long, lat].join(',')
              })
              .join(',')
              .split(',')
              .map((item) => Number(item))
          ),
          width: 1.0,
          material: this.earth.Color.WHITE.withAlpha(0.5)
        }
        // label: {
        //   text: text,
        //   font: '12px sans-serif',
        //   fillColor: this.earth.Color.WHITE
        // }
      })
    }

    for (let lon = -180; lon <= 180; lon += lonD) {
      if (lon >= maxLon) break
      if (lon < minLon) continue
      for (let lat = -80; lat <= 80; lat += latD) {
        if (lat >= maxLat) break
        if (lat < minLat) continue
        let second = 12 * (8 - (lat % 4) / 0.5) - (lon % 6) / 0.5
        let text =
          (lat < 0 ? 'S' : 'N') +
          (((360 - lon - 180) / 6).toFixed() < 10
            ? '0' + ((360 - lon - 180) / 6).toFixed()
            : ((360 - lon - 180) / 6).toFixed()) +
          String.fromCharCode(64 + Math.abs(lat) / 4 + 1) +
          (Number(second) < 10 ? '0' + second : second)
        // this.viewer.entities.add({
        //   id: text,
        //   position: this.earth.Cartesian3.fromDegrees(
        //     lon + lonD / 2,
        //     lat + latD / 2,
        //     0
        //   ),
        //   label: {
        //     text: text,
        //     font: '14px sans-serif',
        //     fillColor: this.earth.Color.YELLOW,
        //     outlineColor: this.earth.Color.BLACK,
        //     outlineWidth: 2,
        //     style: this.earth.LabelStyle.FILL_AND_OUTLINE,
        //     // pixelOffset: new this.earth.Cartesian2(0, -30),
        //     distanceDisplayCondition: new this.earth.DistanceDisplayCondition(
        //       0,
        //       10e5
        //     )
        //   }
        // })
      }
    }

    // if (lonD == 30 / 60) {
    // 添加点线道
    this.addPoint({
      longitude: 116,
      latitude: 39,
      text: 'PN11J20',
      color: this.earth.Color.YELLOW,
      labelColor: this.earth.Color.YELLOW,
      pixelSize: 40,
      distanceDisplayCondition: new this.earth.DistanceDisplayCondition(0, 15e5)
    })
    this.addPolyline({
      text: 'YN11J20',
      coordinate: [116, 39, 116, 39.5],
      position: this.earth.Cartesian3.fromDegrees(116, 39.25, 0),
      material: this.earth.Color.GREEN,
      pixelOffset: new this.earth.Cartesian2(-30, -30),
      width: 20,
      distanceDisplayCondition: new this.earth.DistanceDisplayCondition(0, 15e5)
      // fillColor: this.earth.Color.GREEN,
    })
    this.addPolyline({
      text: 'XN11J20',
      coordinate: [116, 39, 116.5, 39],
      position: this.earth.Cartesian3.fromDegrees(116.25, 39, 0),
      material: this.earth.Color.GREEN,
      pixelOffset: new this.earth.Cartesian2(0, -30),
      width: 20,
      distanceDisplayCondition: new this.earth.DistanceDisplayCondition(0, 15e5)
      // fillColor: this.earth.Color.GREEN,
    })
    this.viewer.entities.add({
      id: '道',
      // name: '道',
      polyline: {
        show: true, //是否显示，默认显示
        positions: this.earth.Cartesian3.fromDegreesArray([
          116, 36.5, 116.5, 36.5, 116.5, 37, 116.5, 37.5, 117, 37.5, 117.5,
          37.5, 117.5, 38, 118, 38, 119, 38
        ]),
        width: 50, //线的宽度（像素），默认为1
        material: this.earth.Color.BLUE, //线的颜色，默认为白色
        clampToGround: true,
        zIndex: 99,
        distanceDisplayCondition: new this.earth.DistanceDisplayCondition(
          0,
          15e5
        )
        // zIndex: 1
      }
    })
  }
  // 添加广告牌
  addBillboard(options) {
    this.viewer.entities.add({
      id: options.text,
      position: this.earth.Cartesian3.fromDegrees(
        options.longitude,
        options.latitude,
        0
      ),
      label: {
        text: options.text,
        font: 'bold 26px MicroSoft YaHei',
        outlineColor: this.earth.Color.WHITE,
        outlineWidth: 2,
        style: this.earth.LabelStyle.FILL_AND_OUTLINE,
        pixelOffset: options.pixelOffset || new this.earth.Cartesian2(0, -30),
        fillColor: options.labelColor || window.MSIMEarth.Color.BLACK,
        horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
        verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
        // pixelOffset: new window.MSIMEarth.Cartesian2(-35, -10),
        backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
        distanceDisplayCondition:
          options.distanceDisplayCondition ||
          new this.earth.DistanceDisplayCondition(0, 25e5),
        eyeOffset: new window.MSIMEarth.ConstantProperty(
          new window.MSIMEarth.Cartesian3(0, 0, -1)
        )
      }
    })
  }
  // }
  // 删除实体
  deleteEntities(id) {
    if (this.viewer.entities.getById(id)) {
      this.viewer.entities.removeById(id)
    }
  }
  // 实体绑定callbackProperty
  entityCallBackProtery(type, params) {
    switch (type) {
      case 'sensor':
        // 创建目标的传感器实时范围
        createSensors(params)
        break

      default:
        break
    }
  }
  /**
   * 获取czml数据源内指定id对应的单个实体
   * @param {string} id 实体id
   * @param {string} processName  czml数据集合容器名称,例如'MSIMEarthCZMLProcessContainer'
   * @returns 获取到的实体
   */
  getCZMLEntity(id, processName) {
    if (typeof id === 'undefined') return
    let czmlEn = window.EarthViewer.dataSources._dataSources.find((item) => {
      if (
        typeof item.processName !== 'undefined' &&
        item.processName === processName
      ) {
        return item
      }
    })
    let targetMEntity =
      (czmlEn && czmlEn.entities.getById(id)) ||
      window.EarthViewer.entities.getById(id) || window.EarthViewer.entities.getById(id + 'PA')
    if (!window.MSIMEarth.defined(targetMEntity)) return

    return targetMEntity
  }
  /**
   * 获取czml数据源内指定id对应的单个实体的静态方法
   * @param {string} id 实体id
   * @param {string} processName  czml数据集合容器名称,例如'MSIMEarthCZMLProcessContainer'
   * @returns 获取到的实体
   */
  static _GetCZMLEntity(id, processName) {
    let czmlEn = window.EarthViewer.dataSources._dataSources.find((item) => {
      if (
        typeof item.processName !== 'undefined' &&
        item.processName === processName
      ) {
        return item
      }
    })
    let targetMEntity =
      (czmlEn && czmlEn.entities.getById(id)) ||
      window.EarthViewer.entities.getById(id) || window.EarthViewer.entities.getById(id + 'PA')
    if (!window.MSIMEarth.defined(targetMEntity)) return

    return targetMEntity

    // if (!window.MSIMEarth.defined(czmlEn)) return
    // let targetMEntity =
    //   czmlEn.entities.getById(id) || window.EarthViewer.entities.getById(id)
    // if (!window.MSIMEarth.defined(targetMEntity)) return

    // return targetMEntity
  }
  /**
   * 获取czml数据源内指定id对应的单个实体的静态方法
   * @param {string} id 实体id
   * @param {string} processName  czml数据集合容器名称,例如'MSIMEarthCZMLProcessContainer'
   * @returns 获取到的实体
   */
  static _GetCZMLEntitySide(id, processName) {
    let side = 'white'
    let czmlEn = window.EarthViewer.dataSources._dataSources.find((item) => {
      if (
        typeof item.processName !== 'undefined' &&
        item.processName === processName
      ) {
        return item
      }
    })

    let targetMEntity =
      (czmlEn && czmlEn.entities.getById(id)) ||
      window.EarthViewer.entities.getById(id)
    if (!window.MSIMEarth.defined(targetMEntity)) return

    if (
      targetMEntity.properties &&
      typeof targetMEntity.properties.airplaneAction !== 'undefined'
    ) {
      side = targetMEntity.properties.airplaneAction._value.side
    }

    return side

    // if (!window.MSIMEarth.defined(czmlEn)) return
    // let targetMEntity =
    //   czmlEn.entities.getById(id) || window.EarthViewer.entities.getById(id)
    // if (!window.MSIMEarth.defined(targetMEntity)) return

    // return targetMEntity
  }
  /**
   * 移除czml数据源内指定id对应的单个实体的静态方法
   * @param {string} id 实体id
   * @param {string} processName  czml数据集合容器名称,例如'MSIMEarthCZMLProcessContainer'
   * @returns 获取到的实体
   */
  static _DeleteCZMLEntity(id, processName) {
    let czmlEn = window.EarthViewer.dataSources._dataSources.find((item) => {
      if (
        typeof item.processName !== 'undefined' &&
        item.processName === processName
      ) {
        return item
      }
    })

    let targetMEntity = czmlEn && czmlEn.entities.getById(id)
    if (!window.MSIMEarth.defined(targetMEntity)) return
    czmlEn.entities.remove(czmlEn.entities.getById(id))
  }
  /**
   * 清除CZML容器内实体和直接加载的实体
   * @returns
   */
  static _ClearCZMLEntity(processName) {
    EarthAPP.timeC = 0
    EarthAPP.i = 0
    window.EarthViewer.entities.removeAll()
  }
  /**
   * 作战区域
   */
  addZZQY() {
    const redRectangle = window.EarthViewer.entities.add({
      name: 'Red translucent rectangle',
      id: 'red_zzqy',
      rectangle: {
        coordinates: window.MSIMEarth.Rectangle.fromDegrees(
          117.87,
          34.61,
          130.85,
          44.76
        ),
        material: new window.MSIMEarth.GradientMaterialProperty({
          repeat: new window.MSIMEarth.Cartesian2(8.0, 8.0),
          color: new window.MSIMEarth.Color(1.0, 0.0, 0.0, 1.0),
          flowSpeed: 25.0,
          diffusePower: 2.2,
          alphaPower: 0.6,
          center: new window.MSIMEarth.Cartesian2(0.5, 0.5),
          globalAlpha: 0x1,
          transparent: true
        }),
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          0,
          200e5
        )
      },
      polyline: {
        positions: window.MSIMEarth.Cartesian3.fromDegreesArray([
          117.87, 44.76, 117.87, 34.61, 130.85, 34.61, 130.85, 44.76, 117.87,
          44.76
        ]),
        width: 1,
        arcType: window.MSIMEarth.ArcType.RHUMB,
        material: window.MSIMEarth.Color.RED,
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          0,
          200e5
        )
      },
      position: window.MSIMEarth.Cartesian3.fromDegrees(119.95, 42.98),
      label: {
        text: '红方待战区',
        font: 'bold 14px MicroSoft YaHei',
        style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        fillColor: window.MSIMEarth.Color.WHITE,
        outlineColor: window.MSIMEarth.Color.BLACK,
        outlineWidth: 5,
        horizontalOrigin: window.MSIMEarth.HorizontalOrigin.CENTER,
        pixelOffset: new window.MSIMEarth.Cartesian2(0, -25),
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          0,
          150e5
        )
      }
    })
    const blueRectangle = window.EarthViewer.entities.add({
      name: 'blue translucent rectangle',
      id: 'blue_zzqy',
      position: window.MSIMEarth.Cartesian3.fromDegrees(130.92, 31.83),
      label: {
        text: '蓝方待战区',
        font: 'bold 14px MicroSoft YaHei',
        style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        fillColor: window.MSIMEarth.Color.WHITE,
        outlineColor: window.MSIMEarth.Color.BLACK,
        outlineWidth: 5,
        horizontalOrigin: window.MSIMEarth.HorizontalOrigin.CENTER,
        pixelOffset: new window.MSIMEarth.Cartesian2(0, -25),
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          0,
          150e5
        )
      },
      polyline: {
        positions: window.MSIMEarth.Cartesian3.fromDegreesArray([
          125.01, 39.09, 125.01, 30.54, 135.09, 30.54, 135.09, 39.09, 125.01,
          39.09
        ]),
        width: 1,
        arcType: window.MSIMEarth.ArcType.RHUMB,
        material: window.MSIMEarth.Color.BLUE,
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          0,
          200e5
        )
      },
      rectangle: {
        coordinates: window.MSIMEarth.Rectangle.fromDegrees(
          125.01,
          30.54,
          135.09,
          39.09
        ),
        material: new window.MSIMEarth.GradientMaterialProperty({
          repeat: new window.MSIMEarth.Cartesian2(8.0, 8.0),
          color: window.MSIMEarth.Color.BLUE,
          flowSpeed: 25.0,
          diffusePower: 1.0,
          alphaPower: 0.6,
          center: new window.MSIMEarth.Cartesian2(0.5, 0.5),
          globalAlpha: 1.0,
          transparent: true
        }),
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          0,
          200e5
        )
      }
    })
    const greenCircle = window.EarthViewer.entities.add({
      position: window.MSIMEarth.Cartesian3.fromDegrees(126.69, 37.34, 0.0),
      name: '交战区',
      id: 'zc_jzq',
      ellipse: {
        semiMinorAxis: 300000.0,
        semiMajorAxis: 300000.0,
        material: window.MSIMEarth.Color.GREEN,
        fill: false,
        outlineColor: window.MSIMEarth.Color.WHITE,
        outlineWidth: 5,
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          0,
          200e5
        ),
        outline: true // height must be set for outline to display
      },
      label: {
        text: '交战区',
        font: 'bold 14px MicroSoft YaHei',
        style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        fillColor: window.MSIMEarth.Color.WHITE,
        outlineColor: window.MSIMEarth.Color.BLACK,
        outlineWidth: 5,
        horizontalOrigin: window.MSIMEarth.HorizontalOrigin.CENTER,
        pixelOffset: new window.MSIMEarth.Cartesian2(0, -25),
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          0,
          150e5
        )
      }
    })
  }
  /**
   * 清除作战区域
   */
  removeZZQY() {
    window.EarthViewer.entities.removeById('red_zzqy')
    window.EarthViewer.entities.removeById('blue_zzqy')
    window.EarthViewer.entities.removeById('zc_jzq')
  }
  /**
   * 创建删除效果实体
   * @param {object} position 删除位置
   * @param {string} id 删除实体id
   */
  createClearEntity(position, id, orientation, model) {
    // let boomModel = this.viewer.entities.add({
    //   id: bzMID,
    //   position: position,
    //   orientation: orientation,
    //   model: model
    // })
    // 爆炸
    let that = this
    const bzID = id + 'dz'
    let curBZ = this.viewer.entities.getById(bzID)
    if (window.MSIMEarth.defined(curBZ)) return
    let boomBillboard = this.viewer.entities.add({
      id: bzID,
      position: position,
      billboard: {
        image: require('../../Assets/image/deleteY.png'), //'static/image/billboard/boom.png',
        width: 60,
        height: 60,
        imageSubRegion: new that.earth.BoundingRectangle(0, 1000, 200, 200),
        clampToGround: true // 将实体贴地,
      }
    })
    const imageSize = 1200
    const tileSize = 200
    let k = 0

    // 更新 billboard 的纹理，实现精灵动画效果
    let intervalID = setInterval(function () {
      if (k < (imageSize / tileSize) ** 2) {
        const tileX = (k % (imageSize / tileSize)) * tileSize
        const tileY =
          imageSize -
          tileSize -
          Math.floor(k / (imageSize / tileSize)) * tileSize
        boomBillboard.billboard.imageSubRegion =
          new that.earth.BoundingRectangle(tileX, tileY, tileSize, tileSize)
        k++
      } else {
        boomBillboard.show = false
        that.viewer.entities.removeById(bzID)
        clearInterval(intervalID)
      }
    }, 100)
  }

  /**
   * 创建爆炸效果实体
   * @param {object} position 爆炸位置
   * @param {string} id 爆炸实体id
   */
  createBoom(position, id) {
    // 爆炸
    let that = this
    const bzID = id + 'mz'
    let curBZ = this.viewer.entities.getById(bzID)
    if (window.MSIMEarth.defined(curBZ)) return
    let boomBillboard = this.viewer.entities.add({
      id: bzID,
      position: position,
      billboard: {
        image: require('../../Assets/image/boom.png'), //'static/image/billboard/boom.png',
        width: 20 + EarthAPP.boomSize,
        height: 20 + EarthAPP.boomSize,
        imageSubRegion: new that.earth.BoundingRectangle(0, 1000, 200, 200),
        clampToGround: true, // 将实体贴地,
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          10,
          30e5
        )
      }
    })
    const imageSize = 1200
    const tileSize = 200
    let k = 0

    // 更新 billboard 的纹理，实现精灵动画效果
    let intervalIDB = setInterval(function () {
      if (k < (imageSize / tileSize) ** 2) {
        const tileX = (k % (imageSize / tileSize)) * tileSize
        const tileY =
          imageSize -
          tileSize -
          Math.floor(k / (imageSize / tileSize)) * tileSize
        boomBillboard.billboard.imageSubRegion =
          new that.earth.BoundingRectangle(tileX, tileY, tileSize, tileSize)
        k++
      } else {
        boomBillboard.show = false
        that.viewer.entities.removeById(bzID)
        clearInterval(intervalIDB)
      }
    }, 100)
  }
  /**
   * 创建锁定瞄准实体
   * @param {object} position 锁定位置
   * @param {string} id 锁定实体id
   */
  createFocus(position, id) {
    // 瞄准
    let that = this
    const mzID = id + 'mz'
    let curMZ = this.viewer.entities.getById(mzID)
    if (window.MSIMEarth.defined(curMZ)) return
    // this.viewer.entities.removeById(mzID)
    let boomBillboard = this.viewer.entities.add({
      id: mzID,
      position: position,
      billboard: {
        image: require('../../Assets/image/mz.png'), //'static/image/billboard/boom.png',
        width: 200,
        height: 200,
        imageSubRegion: new that.earth.BoundingRectangle(0, 1000, 200, 200),
        clampToGround: true // 将实体贴地,
      }
    })
    const imageSize = 1200
    const tileSize = 200
    let k = 0

    // 更新 billboard 的纹理，实现精灵动画效果
    let intervalIDF = setInterval(function () {
      if (k < (imageSize / tileSize) ** 2) {
        const tileX = (k % (imageSize / tileSize)) * tileSize
        const tileY =
          imageSize -
          tileSize -
          Math.floor(k / (imageSize / tileSize)) * tileSize
        boomBillboard.billboard.imageSubRegion =
          new that.earth.BoundingRectangle(tileX, tileY, tileSize, tileSize)
        k++
      } else {
        boomBillboard.show = false
        that.viewer.entities.removeById(mzID)
        clearInterval(intervalIDF)
      }
    }, 50)
  }
  /**
   * 扩展创建锁定瞄准实体
   * @param {object} params:position 锁定位置
   * @param {string} params:id 锁定实体id
   */
  createFocusExtend(params) {
    // 瞄准
    let that = this
    const mzID = params.id + 'mz'
    let curMZ = this.viewer.entities.getById(mzID)
    if (window.MSIMEarth.defined(curMZ)) return
    // this.viewer.entities.removeById(mzID)
    let boomBillboard = this.viewer.entities.add({
      id: mzID,
      position: params.position,
      billboard: {
        image: params.image
          ? params.image
          : require('../../Assets/image/mz.png'), //'static/image/billboard/boom.png',
        width: 200,
        height: 200,
        imageSubRegion: new that.earth.BoundingRectangle(0, 1000, 200, 200),
        clampToGround: true // 将实体贴地,
      }
    })
    const imageSize = 1200
    const tileSize = 200
    let k = 0

    // 更新 billboard 的纹理，实现精灵动画效果
    let intervalID = setInterval(function () {
      if (k < (imageSize / tileSize) ** 2) {
        const tileX = (k % (imageSize / tileSize)) * tileSize
        const tileY =
          imageSize -
          tileSize -
          Math.floor(k / (imageSize / tileSize)) * tileSize
        boomBillboard.billboard.imageSubRegion =
          new that.earth.BoundingRectangle(tileX, tileY, tileSize, tileSize)
        k++
      } else {
        boomBillboard.show = false
        that.viewer.entities.removeById(mzID)
        clearInterval(intervalID)
      }
    }, 50)
  }
  /**
   * 获取实体的实时位置（经纬度和高）
   * @param {string} id 实体id
   * @returns
   */
  getPositionGraphicByEntityId(id) {
    let that = this
    let sEntity = this.getCZMLEntity(id, 'MSIMEarthCZMLProcessContainer')
    if (!sEntity) return
    let sPosition = sEntity.position.getValue(that.viewer.clock.currentTime)
    if (!sPosition) return
    let sCartographic = this.earth.Cartographic.fromCartesian(sPosition)
    let sLng = this.earth.Math.toDegrees(sCartographic.longitude)
    let sLat = this.earth.Math.toDegrees(sCartographic.latitude)
    let sAlt = sCartographic.height
    return [sLng, sLat, sAlt]
  }
  /**
   * 获取实体的实时位置（经纬度和高）
   * @param {string} id 实体id
   * @returns
   */
  getPositionCartesian3ByEntityId(id) {
    let that = this
    let sEntity = this.getCZMLEntity(id, 'MSIMEarthCZMLProcessContainer')
    if (!sEntity) return
    let sPosition = sEntity.position.getValue(that.viewer.clock.currentTime)
    return sPosition
  }
  /**
   * 获取静态标注是否显示
   * @param {boolean} storePAShow 静态标注是否显示底层控制
   * @param {string} curSide 当前阵营
   * @param {string} PAVision 静态标注可见阵营
   * @returns {boolean} 是否显示
   */
  static _getPAShow(storePAShow, curSide, PAVision) {
    let res = false
    if (storePAShow) {
      // 如果storePAShow为true，则进入二级判定（基于阵营）
      switch (curSide) {
        // 二级判定：根据当前阵营和PAVision判断是否显示
        case 'red':
          // 如果当前阵营为red，PAVision为R，说明只有red阵营可以看到静态标注
          if (PAVision === 'R') res = true
          else res = false
          break
        case 'blue':
          // 如果当前阵营为blue，PAVision为B，说明只有blue阵营可以看到静态标注
          if (PAVision === 'B') res = true
          else res = false
          break
        case 'green':
          // 如果当前阵营为green，PAVision为G，说明只有green阵营可以看到静态标注
          if (PAVision === 'G') res = true
          else res = false
          break
        case 'purple':
          // 如果当前阵营为purple，PAVision为P，说明只有purple阵营可以看到静态标注
          if (PAVision === 'P') res = true
          else res = false
          break
        case 'admin':
          // 如果当前阵营为admin，PAVision为RB，说明只有admin阵营可以看到静态标注
          if (PAVision === 'RB') res = true
          else res = false
          break
        default:
          break
      }
      res = true
    } else {
      // 如果storePAShow为false，说明静态标注不显示
      res = false
    }
    return res
  }
  /**
   * 使用实体方式基于UE消息绘制视锥体
   * @param {*} entityId 实体id
   * @param {*} targetPosition 目标位置
   * @returns 
   */
  createEntityFrustumByUEInfo(entityId, targetPosition) {
    let entityFrustumId = entityId + 'enFrustum'
    // 如果目标实体不存在或者位置获取不到则返回
    let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
      entityId,
      'MSIMEarthCZMLProcessContainer'
    )
    if (!window.MSIMEarth.defined(curEntity)) return
    let curTime = window.EarthViewer.clock.currentTime
    let curPosition, newOrientation
    curPosition = curEntity.position.getValue(curTime)
    if (typeof curPosition === 'undefined') return
    var cf = function () {
      let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
        entityId,
        'MSIMEarthCZMLProcessContainer'
      )
      if (!window.MSIMEarth.defined(curEntity)) return
      let curTime = window.EarthViewer.clock.currentTime
      curPosition = curEntity.position.getValue(curTime)
      if (!window.MSIMEarth.defined(targetPosition)) return
      const newVector2 = window.MSIMEarth.Cartesian3.subtract(
        targetPosition,
        curPosition,
        new window.MSIMEarth.Cartesian3()
      )
      const newNormal = window.MSIMEarth.Cartesian3.normalize(
        newVector2,
        new window.MSIMEarth.Cartesian3()
      )
      const newRotationMatrix3 =
        window.MSIMEarth.Transforms.rotationMatrixFromPositionVelocity(
          newVector2,
          newNormal,
          window.MSIMEarth.Ellipsoid.WGS84
        )
      newOrientation =
        window.MSIMEarth.Quaternion.fromRotationMatrix(
          newRotationMatrix3
        )
      return newOrientation
    }
    var cp = function () {
      let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
        entityId,
        'MSIMEarthCZMLProcessContainer'
      )
      if (!window.MSIMEarth.defined(curEntity)) return
      let curTime = window.EarthViewer.clock.currentTime
      curPosition = curEntity.position.getValue(curTime)
      if (typeof curPosition === 'undefined') return
      return curPosition
    }
    window.EarthViewer.entities.removeById(entityFrustumId)
    window.EarthViewer.entities.add({
      id: entityFrustumId,
      position: new window.MSIMEarth.CallbackProperty(cp, false),
      orientation: new window.MSIMEarth.CallbackProperty(cf, false),
      ellipsoid: {
        radii: new window.MSIMEarth.Cartesian3(30000.0, 30000.0, 30000.0),
        innerRadii: new window.MSIMEarth.Cartesian3(100.0, 100.0, 100.0),
        minimumClock: window.MSIMEarth.Math.toRadians(-7.5),
        maximumClock: window.MSIMEarth.Math.toRadians(7.5),
        minimumCone: window.MSIMEarth.Math.toRadians(75.0),
        maximumCone: window.MSIMEarth.Math.toRadians(105.0),
        // material: window.MSIMEarth.Color.DARKCYAN.withAlpha(0.1),
        material: window.MSIMEarth.Color.RED.withAlpha(0.3),
        // material: new window.MSIMEarth.PulseMaterialProperty({
        //   repeat: new window.MSIMEarth.Cartesian2(1.0, 1.0),
        //   color: new window.MSIMEarth.Color(1.0, 0.1, 0.1, 1.0), // new window.MSIMEarth.Color(0.8, 0.1, 0.5, 1.0),
        //   flowSpeed: 35.0,
        //   transparent: true
        // }),
        // material: new window.MSIMEarth.Stars1MaterialProperty({
        //   transparent: true
        // }),
        outline: true
      }
    })
    this.createRotateEntity(entityId)
  }
  /**
   * 息创建旋转实体
   * @param {*} entityId 实体id
   * @returns 
   */
  createRotateEntity(entityId, rotateRadius, imgUrl) {
    let entityRotateId = entityId + 'enRotate'
    // 实时计算位置
    let dynamicPosition = new window.MSIMEarth.CallbackProperty(function () {
      let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
        entityId,
        'MSIMEarthCZMLProcessContainer'
      )
      if (!window.MSIMEarth.defined(curEntity)) return
      let curTime = window.EarthViewer.clock.currentTime
      let curPosition
      curPosition = curEntity.position.getValue(curTime)
      if (typeof curPosition === 'undefined') return
      return curPosition
    }, false)
    // 实时计算高度
    let dynamicHeight = new window.MSIMEarth.CallbackProperty(function () {
      let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
        entityId,
        'MSIMEarthCZMLProcessContainer'
      )
      if (!window.MSIMEarth.defined(curEntity)) return
      let curTime = window.EarthViewer.clock.currentTime
      let curPosition
      curPosition = curEntity.position.getValue(curTime)
      if (typeof curPosition === 'undefined') return
      // curPosition转换为经纬度高度
      const cartographic = window.MSIMEarth.Cartographic.fromCartesian(curPosition);
      const coords = {
        lon: window.MSIMEarth.Math.toDegrees(cartographic.longitude),
        lat: window.MSIMEarth.Math.toDegrees(cartographic.latitude),
        height: cartographic.height
      };
      return coords.height
    }, false)
    // 如果旋转实体已经存在则返回
    let rotateEntity = window.EarthPlugn.entity._GetCZMLEntity(
      entityRotateId,
      'MSIMEarthCZMLProcessContainer'
    )
    if (window.MSIMEarth.defined(rotateEntity)) return
    // window.EarthViewer.entities.removeById(entityRotateId)
    window.EarthViewer.entities.add({
      id: entityRotateId,
      position: dynamicPosition,
      orientation: new window.MSIMEarth.Quaternion(0.0, 0.0, 0.0, 1.0),
      ellipse: {
        semiMinorAxis: rotateRadius || 1300.0,
        semiMajorAxis: rotateRadius || 1300.0,
        height: dynamicHeight,
        material: new window.MSIMEarth.RotateMaterialProperty({
          image: imgUrl || 'static/image/texture/rotate1.png',
          flowSpeed: 3.0,
          reverse: -1.0,
          transparent: true
        })
      }
    })
  }
  /**
   * 移除旋转实体
   * @param {*} entityId 实体id
   * @returns 
   */
  removeRotateEntity(entityId) {
    let entityRotateId = entityId + 'enRotate'
    window.EarthViewer.entities.removeById(entityRotateId)
  }
  /**
 * 使用实体方式基于UE消息移除视锥体
 * @param {*} entityId 实体id
 * @returns 
 */
  removeEntityFrustumByUEInfo(entityId) {
    window.EarthViewer.entities.removeById(entityId)
  }
  /**
   * 飘带顶点计算
   * @param {*} position 位置
   * @param {*} heading  heading
   * @param {*} pitch pitch
   * @param {*} roll roll
   * @param {*} length 长度
   * @param {*} width 宽度
   * @returns 
   */
  computeRibbonVertices(
    position,
    heading,
    pitch,
    roll,
    length,
    width
  ) {
    let hpr = new Cesium.HeadingPitchRoll(heading, pitch, roll)
    var transform = Cesium.Transforms.headingPitchRollToFixedFrame(position, hpr)

    let startPoint = Cesium.Matrix4.multiplyByPoint(
      transform,
      new Cesium.Cartesian3(-length, 0, 0),
      new Cesium.Cartesian3()
    )
    let endPoint = Cesium.Matrix4.multiplyByPoint(
      transform,
      new Cesium.Cartesian3(length, 0, 0),
      new Cesium.Cartesian3()
    )

    let upVector = new Cesium.Cartesian3(0, 0, 1)
    let forwardVector = Cesium.Cartesian3.normalize(
      Cesium.Matrix4.multiplyByPointAsVector(
        transform,
        new Cesium.Cartesian3(1, 0, 0),
        new Cesium.Cartesian3()
      ),
      new Cesium.Cartesian3()
    )

    let leftVector = Cesium.Cartesian3.normalize(
      Cesium.Cartesian3.cross(upVector, forwardVector, new Cesium.Cartesian3()),
      new Cesium.Cartesian3()
    )
    let rightVector = Cesium.Cartesian3.negate(leftVector, new Cesium.Cartesian3())

    let leftStart = Cesium.Cartesian3.add(
      startPoint,
      Cesium.Cartesian3.multiplyByScalar(leftVector, width / 2, new Cesium.Cartesian3()),
      new Cesium.Cartesian3()
    )
    let rightStart = Cesium.Cartesian3.add(
      startPoint,
      Cesium.Cartesian3.multiplyByScalar(rightVector, width / 2, new Cesium.Cartesian3()),
      new Cesium.Cartesian3()
    )
    let leftEnd = Cesium.Cartesian3.add(
      endPoint,
      Cesium.Cartesian3.multiplyByScalar(leftVector, width / 2, new Cesium.Cartesian3()),
      new Cesium.Cartesian3()
    )
    let rightEnd = Cesium.Cartesian3.add(
      endPoint,
      Cesium.Cartesian3.multiplyByScalar(rightVector, width / 2, new Cesium.Cartesian3()),
      new Cesium.Cartesian3()
    )

    return [leftStart, rightStart, rightEnd, leftEnd]
  }
}
