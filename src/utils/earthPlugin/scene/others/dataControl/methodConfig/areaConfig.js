// 测试数据
// const testData = {
//   color: '#0051FF',
//   ascription: '',
//   num: 2,
//   drawType: 'polygon',
//   type: '军事区',
//   areaPointlist: [
//     {
//       position_dms: {
//         x: '121:35:39',
//         y: '26:21:36',
//         z: 121.59431899347192
//       },
//       position: {
//         x: 121.59431899347192,
//         y: 26.360267114598884,
//         z: 0
//       }
//     },
//     {
//       position: {
//         x: 119.23865585167958,
//         y: 22.13747074676069,
//         z: 0
//       }
//     },
//     {
//       position_dms: {
//         x: '120:35:33',
//         y: '21:29:15',
//         z: 120.59266202096349
//       },
//       position: {
//         x: 120.59266202096349,
//         y: 21.487720462515046,
//         z: 4.6566128730773926e-10
//       }
//     },
//     {
//       position: {
//         x: 122.85792712528921,
//         y: 25.76845487238848,
//         z: 0
//       }
//     }
//   ],
//   lineWidth: 1,
//   semiMajorAxis: 0,
//   lineType: 'Solid',
//   semiMinorAxis: 0,
//   name: '蓝方待战区',
//   labelCenter: [121.0482914884844, 23.812408585356735],
//   angle: 0,
//   id: '8ecc235f256ce241812bcc72b148e2f6',
//   opacity: 0.2
// }
/**
 * 场景启动 消息回调
 * @returns
 */
export default function () {
  /**
   * 添加作战区域
   * @param {*} data  作战区域参数，包括区域点集、标注位置、颜色等等
   */
  const addOperationalArea = (data) => {
    let color = window.MSIMEarth.Color.fromCssColorString(data.color)
    color.alpha = data.opacity
    let pointArr = []
    data.areaPointlist.forEach((e) => {
      if (e.position) {
        pointArr.push(e.position.x)
        pointArr.push(e.position.y)
      }
    })
    let lineData = JSON.parse(JSON.stringify(pointArr))
    lineData[lineData.length] = lineData[0]
    lineData[lineData.length] = lineData[1]
    let polylinePositions =
      window.MSIMEarth.Cartesian3.fromDegreesArray(lineData)
    let polylineMaterial = window.MSIMEarth.Color.fromCssColorString(data.color)
    if (data.lineType == 'Dash') {
      polylineMaterial = new window.MSIMEarth.PolylineDashMaterialProperty({
        color: window.MSIMEarth.Color.fromCssColorString(data.color),
        dashLength: 10.0, // 虚线的段长度
        spaceLength: 10.0 // 虚线之间的空白长度
      })
    } else if (data.lineType == 'Arrow') {
      polylineMaterial = new window.MSIMEarth.PolylineArrowMaterialProperty(
        window.MSIMEarth.Color.fromCssColorString(data.color)
      )
    }
    window.EarthViewer.entities.add({
      id: data.id,
      position: new window.MSIMEarth.Cartesian3.fromDegrees(
        data.labelCenter[0],
        data.labelCenter[1]
      ),
      polygon: {
        hierarchy: window.MSIMEarth.Cartesian3.fromDegreesArray(pointArr),
        material: color,
        outline: false
        // arcType: window.MSIMEarth.ArcType.RHUMB
      },
      polyline: {
        positions: polylinePositions,
        width: data.outlineWidth,
        material: polylineMaterial
      },
      label: {
        text: data.name,
        font: 'normal 60px MicroSoft YaHei',
        scale: 0.5,
        showBackground: false,
        // backgroundColor: window.MSIMEarth.Color.RED.withAlpha(0.3),
        fillColor: color,
        outlineColor: window.MSIMEarth.Color.WHITE,
        outlineWidth: 3,
        style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE,
        horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT, //水平位置
        verticalOrigin: window.MSIMEarth.VerticalOrigin.BOTTOM,
        pixelOffset: new window.MSIMEarth.Cartesian2(-15, -31),
        eyeOffset: new window.MSIMEarth.ConstantProperty(
          new window.MSIMEarth.Cartesian3(0, 0, -11)
        ),
        // distanceDisplayCondition:
        //   new window.MSIMEarth.DistanceDisplayCondition(1000, 6e5), //20e5
        distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
          100,
          30e5
        ),
        heightReference: window.MSIMEarth.HeightReference.RELATIVE_TO_GROUND,
        disableDepthTestDistance: Number.POSITIVE_INFINITY
      }
    })
  }
  /**
   * 移除区域
   * @param {*} id 区域id
   */
  const removeArea = (id) => {}
  /**
   * 添加天气区域
   * @param {*} data  作战区域参数，包括区域点集、标注位置、颜色等等
   */
  const addMeteorologyArea = (data) => {}
  return { addOperationalArea, addMeteorologyArea, removeArea }
}
