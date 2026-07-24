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

// 创建Worker实例
let arsimWorker = null;

// 初始化Worker
function initWorker() {
  if (!arsimWorker) {
    try {
      // 使用绝对路径指向public/static/js/arsimWorker.js
      arsimWorker = new Worker('/static/js/arsimWorker.js');
    } catch (error) {
      console.error('Failed to create worker:', error);
    }
  }
  return arsimWorker;
}

// 终止Worker
function terminateWorker() {
  if (arsimWorker) {
    arsimWorker.terminate();
    arsimWorker = null;
  }
}

/**
 * ARSIM 消息处理
 * @returns {Object} 包含处理方法的对象
 */
export default function ARSIMInfoHandle() {
  // 基于UE发送的高程点构建深度图
  const createDepthMapByUEJson = (json) => {
    let viewer = window.EarthViewer

    // 读取fovpoint.json作为范围四至点
    let cameraGeoProjection = json.camera_position.corners
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

    // 初始化Worker
    const worker = initWorker();
    if (!worker) {
      console.error('Worker initialization failed, falling back to main thread');
      // 这里可以添加主线程计算的备选方案
      return;
    }

    // 监听Worker消息
    worker.onmessage = function (e) {
      const { type, data } = e.data;

      switch (type) {
        case 'generateGridResult':
          handleGenerateGridResult(data, viewer, ROW_COUNT, COL_COUNT);
          break;
        case 'generateTrianglesResult':
          handleGenerateTrianglesResult(data, viewer);
          terminateWorker();
          break;
        case 'error':
          console.error('Worker error:', data.error);
          terminateWorker();
          break;
        default:
          console.error('Unknown message type:', type);
      }
    };

    // 发送网格生成任务到Worker
    worker.postMessage({
      type: 'generateGrid',
      data: {
        fovPointData,
        fovGridValData,
        ROW_COUNT,
        COL_COUNT
      }
    });
  }

  // 处理网格生成结果
  function handleGenerateGridResult(data, viewer, ROW_COUNT, COL_COUNT) {
    const { grid, minHeight, maxHeight } = data;

    console.log('Grid generation completed, starting triangle generation');

    // 初始化Worker
    const worker = initWorker();
    if (!worker) {
      console.error('Worker initialization failed, falling back to main thread');
      return;
    }

    // 监听Worker消息
    worker.onmessage = function (e) {
      const { type, data } = e.data;

      switch (type) {
        case 'generateTrianglesResult':
          handleGenerateTrianglesResult(data, viewer);
          terminateWorker();
          break;
        case 'error':
          console.error('Worker error:', data.error);
          terminateWorker();
          break;
        default:
          console.error('Unknown message type:', type);
      }
    };

    // 发送三角剖分任务到Worker
    worker.postMessage({
      type: 'generateTriangles',
      data: {
        grid,
        ROW_COUNT,
        COL_COUNT,
        minHeight,
        maxHeight
      }
    });
  }

  // 处理三角剖分结果
  function handleGenerateTrianglesResult(data, viewer) {
    const { positions, indices, colorsByP } = data;

    console.log('Triangle generation completed, creating primitive');

    // 转换为笛卡尔坐标并创建位置数组
    const cartesianPositions = [];
    positions.forEach(pos => {
      const cartesian = window.MSIMEarth.Cartesian3.fromDegrees(
        pos.lon,
        pos.lat,
        pos.height
      );
      cartesianPositions.push(cartesian.x, cartesian.y, cartesian.z);
    });

    // ===================== 4. 构造Geometry和Primitive =====================
    // 转换为TypedArray（window.MSIMEarth要求）
    const vertices = new Float64Array(cartesianPositions) // 用DOUBLE精度避免坐标偏差
    const colorArray = new Float32Array(colorsByP)
    const indexArray = new Uint32Array(indices) // 使用Uint32Array以支持超过65535的索引

    // 计算包围球（用于相机定位）
    const boundingSphere = window.MSIMEarth.BoundingSphere.fromVertices(cartesianPositions)

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
