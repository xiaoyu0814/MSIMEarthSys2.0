/**
 * ARSIM 多线程计算 Worker
 * 处理计算密集型任务，如网格生成、三角剖分和颜色计算
 */

// 监听主线程消息
self.onmessage = function (e) {
  const { type, data } = e.data;

  switch (type) {
    case 'generateGrid':
      generateGrid(data);
      break;
    case 'generateTriangles':
      generateTriangles(data);
      break;
    default:
      console.error('Unknown message type:', type);
  }
};

/**
 * 生成网格数据
 * @param {Object} params 计算参数
 */
function generateGrid(params) {
  const {
    fovPointData,
    fovGridValData,
    ROW_COUNT,
    COL_COUNT
  } = params;

  try {
    // 计算边界范围
    const minLon = Math.min(...fovPointData.map((p) => p[0]));
    const maxLon = Math.max(...fovPointData.map((p) => p[0]));
    const minLat = Math.min(...fovPointData.map((p) => p[1]));
    const maxLat = Math.max(...fovPointData.map((p) => p[1]));

    // 计算网格步长
    const lonStep = (maxLon - minLon) / (ROW_COUNT - 1);
    const latStep = (maxLat - minLat) / (COL_COUNT - 1);

    // 生成插值网格点
    const interpolatedData = [];
    for (let row = 0; row < ROW_COUNT; row++) {
      for (let col = 0; col < COL_COUNT; col++) {
        // 计算当前点的经纬度
        const lon = minLon + row * lonStep;
        const lat = minLat + col * latStep;

        // 从fovgridValData中获取对应的值（如果存在）
        let value = 0;
        if (col < fovGridValData.length && row < fovGridValData[col].length) {
          value = parseFloat(fovGridValData[col][row]) || 0;
        }

        // 参照TTTTT.JSON格式生成数据
        interpolatedData.push({
          O: lon.toFixed(6),
          L: lat.toFixed(6),
          A: value.toString(),
          value: value
        });
      }
    }

    // 计算高度范围（使用1260.99 - value作为高度）
    const heights = interpolatedData.map((item) => parseFloat(item.value));
    const minHeight = heights.length > 0 ? Math.min(...heights) : 0;
    const maxHeight = heights.length > 0 ? Math.max(...heights) : 0;

    // 整理网格
    const grid = new Array(ROW_COUNT);
    for (let row = 0; row < ROW_COUNT; row++) {
      grid[row] = new Array(COL_COUNT).fill(null);
    }

    interpolatedData.forEach((item, index) => {
      const lon = parseFloat(item.O);
      const lat = parseFloat(item.L);
      const value = parseFloat(item.value);
      const height = 1260.99 - value;
      const row = Math.floor(index / COL_COUNT);
      const col = index % COL_COUNT;

      if (row < ROW_COUNT && col < COL_COUNT) {
        grid[row][col] = { lon, lat, height, value };
      }
    });

    // 发送结果回主线程
    self.postMessage({
      type: 'generateGridResult',
      data: {
        interpolatedData,
        grid,
        minHeight,
        maxHeight
      }
    });
  } catch (error) {
    console.error('Error in generateGrid:', error);
    self.postMessage({
      type: 'error',
      data: { error: error.message }
    });
  }
}

/**
 * 生成三角形面片
 * @param {Object} params 计算参数
 */
function generateTriangles(params) {
  const {
    grid,
    ROW_COUNT,
    COL_COUNT,
    minHeight,
    maxHeight
  } = params;

  try {
    const positions = [];
    const indices = [];
    const colorsByP = [];
    const pointMap = new Map();
    let posIndex = 0;

    // 颜色渐变配置
    const colorRamp = [
      [1, 0, 0, 0.7], // 红色（最低）
      [1, 0.5, 0, 0.7], // 橙色
      [1, 1, 0, 0.7], // 黄色
      [0, 1, 0, 0.7], // 绿色
      [0, 0, 1, 0.7], // 蓝色
      [0.5, 0, 1, 0.7], // 靛蓝
      [1, 0, 1, 0.7] // 紫色（最高）
    ];

    // 收集所有有效网格点
    for (let row = 0; row < ROW_COUNT; row++) {
      for (let col = 0; col < COL_COUNT; col++) {
        const point = grid[row][col];
        if (!point) continue;

        // 这里只收集点的信息，坐标转换在主线程进行
        positions.push({
          lon: point.lon,
          lat: point.lat,
          height: point.height - 500
        });
        pointMap.set(`${row}-${col}`, posIndex);

        // 高度映射颜色
        const heightRatio = (point.height - minHeight) / (maxHeight - minHeight);
        const colorIndex = Math.min(
          Math.floor(heightRatio * colorRamp.length),
          colorRamp.length - 1
        );
        colorsByP.push(...colorRamp[colorIndex]);

        posIndex++;
      }
    }

    // 生成网格内三角面片
    for (let row = 0; row < ROW_COUNT - 1; row++) {
      for (let col = 0; col < COL_COUNT - 1; col++) {
        const topLeft = pointMap.get(`${row}-${col}`);
        const topRight = pointMap.get(`${row}-${col + 1}`);
        const bottomLeft = pointMap.get(`${row + 1}-${col}`);
        const bottomRight = pointMap.get(`${row + 1}-${col + 1}`);

        if (!topLeft || !topRight || !bottomLeft || !bottomRight) continue;

        indices.push(topLeft, topRight, bottomLeft);
        indices.push(topRight, bottomRight, bottomLeft);
      }
    }

    // 发送结果回主线程
    self.postMessage({
      type: 'generateTrianglesResult',
      data: {
        positions,
        indices,
        colorsByP
      }
    });
  } catch (error) {
    console.error('Error in generateTriangles:', error);
    self.postMessage({
      type: 'error',
      data: { error: error.message }
    });
  }
}
