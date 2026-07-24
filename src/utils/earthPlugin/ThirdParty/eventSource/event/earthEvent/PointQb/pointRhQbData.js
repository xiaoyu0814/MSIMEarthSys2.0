/**
 * @Author: RENAO
 * @Date: 2024-09-02 14:09:20
 * @LastEditTime: 2024-09-05 15:54:15
 * @LastEditors: RENAO
 * @Description:
 * @FilePath: \SituationAwarenessAnalysisWeb\src\utils\earthPlugin\ThirdParty\eventSource\event\earthEvent\PointQb\pointRhQbData.js
 * @
 */
import store from '@/store'
import emitter from '@/utils/eventbus'

//********************** 接收消息 point_blue_rh_qb  点迹融合 (线尾迹显示) **********************//
export default function () {
  // 场景初始化消息，默认消息点信息
  const handlePointRhQb = (json) => {
    if (typeof json === 'undefined' || json.length == 0) return
    let colorsArr = [
      '#000080',
      '#0000FF',
      '#00FFFF',
      '#00FF00',
      '#8B4513',
      '#FF7F50',
      '#C71585',
      '#4876FF',
      '#FFA500',
      '#747BE2',
      '#87AFE5',
      '#008B8B',
      '#99CDD0'
    ]
    let batchColorIndex = Number(json[0].batchId.substr(-1, 1))
    let curColor = window.MSIMEarth.Color.fromCssColorString(
      colorsArr[batchColorIndex]
    )
    let pointLineColor = new window.MSIMEarth.Color(
      curColor.red,
      curColor.green,
      curColor.blue,
      1.0
    )
    let listLinePoint = []
    json.forEach((item) => {
      listLinePoint.push(item.lon, item.lat, item.alt)
    })

    //点迹融合线路绘制
    let rgPolylineData = window.EarthViewer.entities.add({
      position: window.MSIMEarth.Cartesian3.fromDegrees(
        listLinePoint[0],
        listLinePoint[1],
        listLinePoint[2]
      ),
      polyline: {
        positions:
          window.MSIMEarth.Cartesian3.fromDegreesArrayHeights(listLinePoint),
        width: 2,
        //material: window.MSIMEarth.Color.AQUAMARINE.withAlpha(1),
        material: new window.MSIMEarth.PolylineDashMaterialProperty({
          color: pointLineColor
        }),
        clampToGround: false
        // distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
        //   0,
        //   100e8
        // )
      },
      point: {
        pixelSize: 10,
        color: window.MSIMEarth.Color.YELLOW
      }
    })
    //显示点迹融合最后一个点的经纬度
    let endPos = [
      listLinePoint[listLinePoint.length - 3],
      listLinePoint[listLinePoint.length - 2],
      listLinePoint[listLinePoint.length - 1]
    ]
    let rgEndPosData = window.EarthViewer.entities.add({
      position: window.MSIMEarth.Cartesian3.fromDegrees(
        endPos[0],
        endPos[1],
        endPos[2]
      ),
      label: {
        font: 'normal 16px MicroSoft YaHei',
        scale: 1,
        text: `经度:${endPos[0].toFixed(2)}\n纬度:${endPos[1].toFixed(2)}`,
        fillColor: pointLineColor,
        outlineColor: window.MSIMEarth.Color.BLACK,
        outlineWidth: 2,
        backgroundColor: new window.MSIMEarth.Color.fromBytes(235, 155, 33),
        style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        // outlineWidth: 2,
        horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT, //水平位置
        verticalOrigin: window.MSIMEarth.VerticalOrigin.BOTTOM,
        pixelOffset: new window.MSIMEarth.Cartesian2(-40, -30),
        eyeOffset: new window.MSIMEarth.ConstantProperty(
          new window.MSIMEarth.Cartesian3(0, 0, 0)
        )
        // distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
        //   0,
        //   10e3
        // )
        //disableDepthTestDistance: Number.POSITIVE_INFINITY
      },
      point: {
        pixelSize: 10,
        color: window.MSIMEarth.Color.YELLOW
      }
    })

    // 10 秒之后删除
    setTimeout(() => {
      if (window.EarthViewer.entities.getById(rgPolylineData.id)) {
        window.EarthViewer.entities.removeById(rgPolylineData.id)
      }
      if (window.EarthViewer.entities.getById(rgEndPosData.id)) {
        window.EarthViewer.entities.removeById(rgEndPosData.id)
      }
    }, 5000)
  }

  return { handlePointRhQb }
}
