/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-09-03 14:53:45
 * @LastEditors: ZX Li
 * @LastEditTime: 2024-09-30 14:35:14
 */
import store from '@/store'
import emitter from '@/utils/eventbus'
import Bubble1 from '@/utils/bubble/dataBubble2'
//********************** 接收消息 point_blue_qb  、 point_red_qb  用于显示静态位置信息,无Name属性
export default function () {
  // 场景初始化消息，默认消息点信息
  const handlePointQb = (json) => {
    if (typeof json === 'undefined' || typeof json.pointId === 'undefined')
      return
    // console.log(
    //   '静态 point_blue_qb  、 point_red_qb -点位信息 - ' + json.pointId,
    //   json
    // )
    //加载前先删除球上目标
    window.EarthViewer.entities.removeById(json.pointId)
    let height = 1000
    let scByNear = new window.MSIMEarth.NearFarScalar(1000, 0.5, 100e5, 0.3)
    let scale = 1.0
    let outColor = new window.MSIMEarth.Color(1.0, 1.0, 1.0, 1.0)
    let distance = new window.MSIMEarth.DistanceDisplayCondition(1000, 6e5) //40e5
    let pointColor = new window.MSIMEarth.Color(1.0, 1.0, 1.0, 1.0)
    let pixelOffset = new window.MSIMEarth.Cartesian2(2, -21)
    if (json.batchId && json.batchId.length > 1) {
      let curColor = window.MSIMEarth.Color.fromCssColorString('#FFA500')
      pointColor = new window.MSIMEarth.Color(
        curColor.red,
        curColor.green,
        curColor.blue,
        1.0
      )
    }
    if (
      json.lon &&
      json.lat &&
      typeof json.lon != 'undefined' &&
      typeof json.lat != 'undefined'
    ) {
      // 经纬度
      var log_String = json.lon.toFixed(2)
      var lat_String = json.lat.toFixed(2)
      let lngMarker = log_String < 0 ? 'W ' : 'E '
      let latMarker = lat_String < 0 ? 'S ' : 'N '
      if (
        EarthViewer.dataSources.getByName(json.name + '-pointData').length > 0
      ) {
        let entitiesPointData = {
          position: new window.MSIMEarth.Cartesian3.fromDegrees(
            json.lon,
            json.lat,
            json.alt
          ),
          point: {
            show: true,
            color: pointColor,
            pixelSize: 15,
            outlineWidth: 0
          },
          properties: {
            side: json.tSide, //red或blue
            labelName: json.labelName
          }
        }
        EarthViewer.dataSources
          .getByName(json.name + '-pointData')[0]
          .entities.add(entitiesPointData)
      } else {
        let dataSource = new MSIMEarth.CustomDataSource(
          json.name + '-pointData'
        )
        EarthViewer.dataSources.add(dataSource)
      }
    }
  }

  return { handlePointQb }
}
