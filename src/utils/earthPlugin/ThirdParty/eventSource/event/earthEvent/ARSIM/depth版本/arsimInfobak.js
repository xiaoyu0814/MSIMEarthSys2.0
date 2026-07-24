/*
 * @Author: root root@example.com
 * @Date: 2024-07-05 17:14:01
 * @LastEditors: root root@example.com
 * @LastEditTime: 2024-07-05 18:41:16
 * @FilePath: \src\utils\earthPlugin\ThirdParty\eventSource\event\earthEvent\ARSIM\arsimInfo.js
 * @Description: ARSIM事件处理
 */
import store from '@/store'
import { getColorByHeight } from './colors'

/**
 * ARSIM 消息处理
 * @returns {Object} 包含处理方法的对象
 */
export default function ARSIMInfoHandle() {
  // 基于UE发送的高程点构建深度图
  const createDepthMapByUEJson = (json) => {
    let viewer = window.EarthViewer

    // 读取fovpoint.json作为范围四至点
    let cameraGeoProjection = json.camera_geo_projection.corners
    const fovPointData = [
      [cameraGeoProjection[0].lon, cameraGeoProjection[0].lat, 0.0],
      [cameraGeoProjection[1].lon, cameraGeoProjection[1].lat, 0.0],
      [cameraGeoProjection[2].lon, cameraGeoProjection[2].lat, 0.0],
      [cameraGeoProjection[3].lon, cameraGeoProjection[3].lat, 0.0]
    ]
    if (!fovPointData) return
    console.log('FOV Point Data:', fovPointData)

    // 读取fovgridVal.json作为网格值
    const fovGridValData = json.depth_planar.depth_image.data
    if (!fovGridValData) return
    console.log(
      'FOV Grid Val Data rows:',
      fovGridValData,
      fovGridValData.length
    )

    // 定义目标分辨率(可改成根据数据源实时获取)
    const ROW_COUNT = json.depth_planar.camera_info.height // 总行数 288
    const COL_COUNT = json.depth_planar.camera_info.width // 总列数 512

    // 检查fovGridValData的结构和数据范围
    let fovMinVal = Infinity
    let fovMaxVal = -Infinity
    fovGridValData.forEach((row, rowIndex) => {
      if (Array.isArray(row)) {
        row.forEach((val, colIndex) => {
          const numVal = parseFloat(val)
          if (!isNaN(numVal)) {
            fovMinVal = Math.min(fovMinVal, numVal)
            fovMaxVal = Math.max(fovMaxVal, numVal)
          }
        })
      }
    })
    console.log('FOV Grid Val range:', fovMinVal, 'to', fovMaxVal)

    // 计算边界范围
    let minLon, maxLon, minLat, maxLat
    minLon = Math.min(...fovPointData.map((p) => p[0]))
    maxLon = Math.max(...fovPointData.map((p) => p[0]))
    minLat = Math.min(...fovPointData.map((p) => p[1]))
    maxLat = Math.max(...fovPointData.map((p) => p[1]))
    console.log('Boundary:', minLon, maxLon, minLat, maxLat)

    // 计算网格步长
    const lonStep = (maxLon - minLon) / (ROW_COUNT - 1)
    const latStep = (maxLat - minLat) / (COL_COUNT - 1)

    // 生成插值网格点
    const interpolatedData = []
    for (let row = 0; row < ROW_COUNT; row++) {
      for (let col = 0; col < COL_COUNT; col++) {
        // 计算当前点的经纬度
        const lon = minLon + row * lonStep
        const lat = minLat + col * latStep

        // 从fovgridValData中获取对应的值（如果存在）
        let value = parseFloat(fovGridValData[col][row])
        // if (row < fovGridValData.length && col < fovGridValData[row].length) {
        //   value = parseFloat(fovGridValData[row][col]) || 0
        // }
        // console.log('value:', value)
        // viewer.entities.add({
        //   position: new window.MSIMEarth.Cartesian3.fromDegrees(lon, lat, value),
        //   point: {
        //     color: window.MSIMEarth.Color.RED.withAlpha(0.5),
        //     pixelSize: 2
        //   }
        // })

        // 参照TTTTT.JSON格式生成数据
        interpolatedData.push({
          O: lon.toFixed(6),
          L: lat.toFixed(6),
          A: value.toString(), // 高度暂时设为0
          // value: value + this.valueOffset
          // value: 5076.15 - value + this.valueOffset
          value: value
        })
      }
    }
    // 输出value中的最大值
    let maxVal =
      interpolatedData.length > 0
        ? interpolatedData.reduce((max, item) => {
          const val = parseFloat(item.value)
          return val > max ? val : max
        }, parseFloat(interpolatedData[0].value))
        : 0
    console.log('Max value:', maxVal)

    console.log(
      'Generated interpolated data:',
      interpolatedData,
      interpolatedData.length,
      'points'
    )

    // 使用插值数据
    // 计算高度范围（使用1260.99 - value作为高度）
    let heights = interpolatedData.map((item) => 1260.99 - parseFloat(item.value))
    let minHeight =
      heights.length > 0
        ? heights.reduce((min, val) => (val < min ? val : min), heights[0])
        : 0
    let maxHeight =
      heights.length > 0
        ? heights.reduce((max, val) => (val > max ? val : max), heights[0])
        : 0
    console.log('Height range:', minHeight, 'to', maxHeight)

    // ===================== 2. 网格整理（严格按行列分配） =====================
    const grid = new Array(ROW_COUNT)

    // 初始化网格
    for (let row = 0; row < ROW_COUNT; row++) {
      grid[row] = new Array(COL_COUNT).fill(null)
    }

    // 填充网格（严格按索引分配，避免越界）
    interpolatedData.forEach((item, index) => {
      const lon = parseFloat(item.O)
      const lat = parseFloat(item.L)
      const value = parseFloat(item.value)
      const height = 1260.99 - value // 使用1260.99 - value作为高度
      const row = Math.floor(index / COL_COUNT)
      const col = index % COL_COUNT

      if (row < ROW_COUNT && col < COL_COUNT) {
        grid[row][col] = { lon, lat, height, value: value }
      }
    })

    // ===================== 3. 规则网格三角剖分（核心：100%无边界越界） =====================
    const positions = [] // 笛卡尔坐标数组（x,y,z 依次存储）
    const indices = [] // 三角面片索引（严格在网格内）
    const colorsByP = [] // 颜色数组
    const pointMap = new Map() // 行列→索引映射
    let posIndex = 0

    // 颜色渐变配置
    const colorRamp = [
      [1, 0, 0, 0.7], // 红色（最低）
      [1, 0.5, 0, 0.7], // 橙色
      [1, 1, 0, 0.7], // 黄色
      [0, 1, 0, 0.7], // 绿色
      [0, 0, 1, 0.7], // 蓝色
      [0.5, 0, 1, 0.7], // 靛蓝
      [1, 0, 1, 0.7] // 紫色（最高）
    ]

    // 第一步：收集所有有效网格点（按行列顺序）
    for (let row = 0; row < ROW_COUNT; row++) {
      for (let col = 0; col < COL_COUNT; col++) {
        const point = grid[row][col]
        if (!point) continue

        // 转换为笛卡尔坐标
        const cartesian = window.MSIMEarth.Cartesian3.fromDegrees(
          point.lon,
          point.lat,
          point.height - 500
        )
        positions.push(cartesian.x, cartesian.y, cartesian.z)
        pointMap.set(`${row}-${col}`, posIndex)

        // 高度映射颜色
        const heightRatio =
          (point.height - minHeight) / (maxHeight - minHeight)
        const colorIndex = Math.min(
          Math.floor(heightRatio * colorRamp.length),
          colorRamp.length - 1
        )
        colorsByP.push(...colorRamp[colorIndex])

        posIndex++
      }
    }

    // 第二步：生成网格内三角面片（仅在相邻网格单元内生成，无跨边界）
    for (let row = 0; row < ROW_COUNT - 1; row++) {
      for (let col = 0; col < COL_COUNT - 1; col++) {
        // 获取当前网格单元的四个顶点索引
        const topLeft = pointMap.get(`${row}-${col}`)
        const topRight = pointMap.get(`${row}-${col + 1}`)
        const bottomLeft = pointMap.get(`${row + 1}-${col}`)
        const bottomRight = pointMap.get(`${row + 1}-${col + 1}`)

        // 跳过有缺失点的网格单元（避免无效三角形）
        if (!topLeft || !topRight || !bottomLeft || !bottomRight) continue

        // 生成两个三角形（严格在当前网格单元内）
        indices.push(topLeft, topRight, bottomLeft) // 左上→右上→左下
        indices.push(topRight, bottomRight, bottomLeft) // 右上→右下→左下
      }
    }

    // ===================== 4. 构造Geometry和Primitive =====================
    // 转换为TypedArray（window.MSIMEarth要求）
    const vertices = new Float64Array(positions) // 用DOUBLE精度避免坐标偏差
    const colorArray = new Float32Array(colorsByP)
    const indexArray = new Uint32Array(indices) // 使用Uint32Array以支持超过65535的索引

    // 计算包围球（用于相机定位）
    const boundingSphere = window.MSIMEarth.BoundingSphere.fromVertices(positions)

    // 创建Geometry
    const geometry = new window.MSIMEarth.Geometry({
      attributes: {
        position: new window.MSIMEarth.GeometryAttribute({
          componentDatatype: window.MSIMEarth.ComponentDatatype.DOUBLE,
          componentsPerAttribute: 3,
          values: vertices
        }),
        color: new window.MSIMEarth.GeometryAttribute({
          componentDatatype: window.MSIMEarth.ComponentDatatype.FLOAT,
          componentsPerAttribute: 4,
          values: colorArray
        })
      },
      indices: indexArray,
      primitiveType: window.MSIMEarth.PrimitiveType.TRIANGLES,
      boundingSphere: boundingSphere
    })

    // 创建GeometryInstance
    const instance = new window.MSIMEarth.GeometryInstance({
      geometry: geometry
    })

    // 创建Primitive（带颜色渲染）
    const primitive = new window.MSIMEarth.Primitive({
      geometryInstances: instance,
      appearance: new window.MSIMEarth.PerInstanceColorAppearance({
        flat: true, // 禁用光照，直接显示顶点颜色
        translucent: true, // 启用半透明
        closed: true, // 标记为闭合几何体，优化渲染
        vertexFormat: window.MSIMEarth.VertexFormat.POSITION_AND_COLOR
      }),
      asynchronous: false // 禁用异步加载，避免_workerName错误  
    })
    primitive.name = 'targetId' + 'ARSIMDepthMap'

    viewer.scene.primitives._primitives.forEach(p => {
      if (p.name && p.name === primitive.name) {
        viewer.scene.primitives.remove(p)
      }
    });

    // 添加到场景
    viewer.scene.primitives.add(primitive)
  }

  const createDepthPointMapByUEJson = (contentObj) => {
    console.log(contentObj);
    window.EarthViewer.scene.primitives._primitives.forEach((item) => {
      if (item.name === 'ARSIMDepthPoints') {
        window.EarthViewer.scene.primitives.remove(item)
      }
    })
    let pointCollection = new window.MSIMEarth.PointPrimitiveCollection()
    pointCollection.name = 'ARSIMDepthPoints'
    let pointsPrimitive = window.EarthViewer.scene.primitives.add(pointCollection);

    // points.add({
    //   position: new window.MSIMEarth.Cartesian3(1.0, 2.0, 3.0),
    //   color: window.MSIMEarth.Color.YELLOW
    // });
    // points.add({
    //   position: new window.MSIMEarth.Cartesian3(4.0, 5.0, 6.0),
    //   color: window.MSIMEarth.Color.CYAN
    // });
  }

  // 返回方法对象
  return {
    createDepthMapByUEJson,
    createDepthPointMapByUEJson
  }
}
