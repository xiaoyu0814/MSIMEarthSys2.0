/*
 * @Author: root root@example.com
 * @Date: 2024-07-05 17:14:01
 * @LastEditors: root root@example.com
 * @LastEditTime: 2024-07-05 18:41:16
 * @FilePath: \MSIMEarthSysN\src\utils\earthPlugin\ThirdParty\eventSource\event\earthEvent\start\startScene.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AEe
 */
import store from '@/store'
// 从dataControl/methodConfig/heatmap3d.js引入Heatmap3d
import Heatmap3d from '../../../../../scene/others/dataControl/methodConfig/heatmap3d.js'
// 引入色带函数
import { getColorByValue } from './colors.js'
/**
 * 场景启动 消息回调
 * @returns
 */
export default function () {
  // 示例代码
  // const { createHeatMapByUEJson, removeHeatMap } = ueInfoHandle()
  // const response = await fetch('static/data/json/UE.json')
  // const jsonData = await response.json()
  // createHeatMapByUEJson(jsonData)
  // setTimeout(() => {
  //   removeHeatMap()
  // }, 5000);
  // 基于UE发送的高程点构建热力图
  const createHeatMapByUEJson = (json) => {
    let viewer = window.EarthViewer
    let heatMap = store.state.AFSIMModule.heatMapContainer
    if (heatMap) {
      heatMap.destroy()
    }
    try {
      const jsonData = json

      // 计算数据范围
      let minValue = Infinity
      let maxValue = -Infinity
      for (let i = 0; i < jsonData.length; i++) {
        const value = parseFloat(jsonData[i].A)
        if (value < minValue) minValue = value
        if (value > maxValue) maxValue = value
      }

      let heatList = []
      for (let i = 0; i < jsonData.length; i++) {
        let item = jsonData[i]
        let value = parseFloat(item.A)
        // 归一化到 0-1 范围
        let normalizedValue = (value - minValue) / (maxValue - minValue)
        // 确保值在 0-1 范围内
        normalizedValue = Math.max(0, Math.min(1, normalizedValue))

        let param = {
          lnglat: [parseFloat(item.O), parseFloat(item.L)],
          value: normalizedValue // 使用归一化后的值作为热力值
        }
        heatList.push(param)
        viewer.entities.add({
          position: window.MSIMEarth.Cartesian3.fromDegrees(param.lnglat[0], param.lnglat[1], parseFloat(item.A || 0)),
          point: {
            pixelSize: 5,
            color: window.MSIMEarth.Color.RED
          }
        })
      }

      // heatMap = new Heatmap3d(window.EarthViewer, {
      //   list: heatList,
      //   raduis: 15,
      //   baseHeight: 200,
      //   // primitiveType: "TRNGLE",
      //   primitiveType: "LINES",
      //   gradient: {
      //     ".3": "blue",
      //     ".5": "green",
      //     ".7": "yellow",
      //     ".95": "red",
      //   },
      // })
      // store.state.AFSIMModule.heatMapContainer = heatMap
    } catch (error) {
      console.error('加载热力图数据失败:', error)
    }
  }
  // 移除热力图
  const removeHeatMap = () => {
    let heatMap = store.state.AFSIMModule.heatMapContainer
    if (heatMap) {
      heatMap.destroy()
    }
  }
  // 基于UE发送的高程点构建热力图
  const createPointMapByUEJson = (json) => {
    let viewer = window.EarthViewer
    // 移除已存在的点图
    let existingPointPrimitiveCollection = viewer.scene.primitives._primitives.find(primitive => primitive.id === 'ue_wrj_points')
    if (existingPointPrimitiveCollection) {
      console.log('移除已存在的点图', existingPointPrimitiveCollection)
      viewer.scene.primitives.remove(existingPointPrimitiveCollection)
    }
    // 基于PointPrimitiveCollection构建点图
    let pointPrimitiveCollection = new window.MSIMEarth.PointPrimitiveCollection()
    pointPrimitiveCollection.id = 'ue_wrj_points'
    viewer.scene.primitives.add(pointPrimitiveCollection)
    // 计算数据范围
    let minValue = Infinity
    let maxValue = -Infinity
    for (let i = 0; i < json.length; i++) {
      const value = parseFloat(json[i].A)
      if (value < minValue) minValue = value
      if (value > maxValue) maxValue = value
    }
    for (let i = 0; i < json.length; i++) {
      let item = json[i]
      let value = parseFloat(item.A)
      // 归一化到 0-1 范围
      let normalizedValue = (value - minValue) / (maxValue - minValue)
      // 确保值在 0-1 范围内
      normalizedValue = Math.max(0, Math.min(1, normalizedValue))

      // 根据归一化值获取颜色
      const pointColor = getColorByValue(normalizedValue)
      // 调整透明度
      pointColor.a = 0.3
      // 构建点图
      pointPrimitiveCollection.add({
        position: window.MSIMEarth.Cartesian3.fromDegrees(parseFloat(item.O), parseFloat(item.L), parseFloat(item.A || 0)),
        color: pointColor
      })
    }

  }
  // 根据json点集合计算中心点
  const createFrustumEntityByCenterPoint = (json) => {
    // 获取当前实体
    let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
      json.EnName,
      'MSIMEarthCZMLProcessContainer'
    )
    if (!window.MSIMEarth.defined(curEntity)) return
    // 计算扫描区域中心
    let data = json.data
    let centerX = 0
    let centerY = 0
    let centerZ = 0
    for (let i = 0; i < data.length; i++) {
      let item = data[i]
      centerX += parseFloat(item.O)
      centerY += parseFloat(item.L)
      centerZ += parseFloat(item.A || 0)
    }
    centerX /= data.length
    centerY /= data.length
    centerZ /= data.length
    let centerPosition = window.MSIMEarth.Cartesian3.fromDegrees(centerX, centerY, centerZ)
    const entityMethod = new window.EarthPlugn.entity({
      earth: window.MSIMEarth,
      viewer: window.EarthViewer
    })
    entityMethod.createEntityFrustumByUEInfo(json.EnName,
      centerPosition,)
  }

  // ECEF转WGS84
  const ecefToWgs84 = (x, y, z) => {
    // 创建ECEF坐标
    const ecefPosition = new window.MSIMEarth.Cartesian3(x, y, z)
    // 转换为WGS84地理坐标
    const cartographic = window.MSIMEarth.Cartographic.fromCartesian(ecefPosition)
    // 转换为度分秒
    const longitude = window.MSIMEarth.Math.toDegrees(cartographic.longitude)
    const latitude = window.MSIMEarth.Math.toDegrees(cartographic.latitude)
    const height = cartographic.height
    return {
      longitude,
      latitude,
      height
    }
  }

  return { createHeatMapByUEJson, removeHeatMap, createPointMapByUEJson, createFrustumEntityByCenterPoint, ecefToWgs84 }
}
