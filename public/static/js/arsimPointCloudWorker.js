/**
 * ARSIM 点云处理 Worker
 * 处理点云数据的计算和颜色生成，避免主线程卡顿
 */

// 监听主线程消息
self.onmessage = function (e) {
  const { type, data } = e.data;
  switch (type) {
    case 'processPointCloud':
      processPointCloud(data);
      break;
    default:
      console.error('Unknown message type:', type);
  }
};

/**
 * 处理点云数据
 * @param {Object} params 点云参数
 */
function processPointCloud(params) {
  const { geoPoints } = params;
  
  try {
    // 处理点云数据
    const processedPoints = [];
    
    // 遍历所有点并处理
    geoPoints.forEach((point) => {
      // 计算颜色（这里使用简单的高度颜色映射）
      const height = point[2];
      const color = getColorByHeight(height);
      
      // 添加处理后的点
      processedPoints.push({
        lon: point[1],
        lat: point[0],
        height: height,
        color: color
      });
    });
    
    // 发送结果回主线程
    self.postMessage({
      type: 'processPointCloudResult',
      data: {
        processedPoints: processedPoints
      }
    });
  } catch (error) {
    console.error('Error in processPointCloud:', error);
    self.postMessage({
      type: 'error',
      data: { error: error.message }
    });
  }
}

/**
 * 根据高度获取颜色
 * @param {number} height 高度值
 * @returns {Array} 颜色数组 [r, g, b, a]
 */
function getColorByHeight(height) {
  // 限制高度范围在0-3000米
  const clampedHeight = Math.max(0, Math.min(3000, height));

  // 定义丰富的颜色数组，覆盖多种颜色
  const colors = [
    [0, 0, 1, 1], // 蓝色
    [0, 0.5, 1, 1], // 亮蓝色
    [0, 1, 1, 1], // 青色
    [0, 1, 0.5, 1], // 蓝绿色
    [0, 1, 0, 1], // 绿色
    [0.5, 1, 0, 1], // 黄绿色
    [1, 1, 0, 1], // 黄色
    [1, 0.5, 0, 1], // 橙色
    [1, 0, 0, 1], // 红色
    [0.5, 0, 0.5, 1], // 紫色
    [1, 0, 1, 1], // 品红色
    [1, 0.5, 1, 1] // 粉色
  ];

  if (clampedHeight < 1000) {
    // 0-1000米：使用颜色数组实现丰富的颜色变化
    const index = Math.floor(clampedHeight / 10);
    const colorIndex = index % colors.length;
    const nextColorIndex = (colorIndex + 1) % colors.length;
    const ratio = (index % 10) / 10;

    const currentColor = colors[colorIndex];
    const nextColor = colors[nextColorIndex];

    // 在两个颜色之间进行线性插值
    const r = currentColor[0] + (nextColor[0] - currentColor[0]) * ratio;
    const g = currentColor[1] + (nextColor[1] - currentColor[1]) * ratio;
    const b = currentColor[2] + (nextColor[2] - currentColor[2]) * ratio;

    return [r, g, b, 1.0];
  } else if (clampedHeight < 2000) {
    // 1000-2000米：从橙色到红色
    const ratio = (clampedHeight - 1000) / 1000;
    const r = 1.0;
    const g = 0.5 - ratio * 0.5;
    const b = 0;
    return [r, g, b, 1.0];
  } else {
    // 2000-3000米：从红色到深红色
    const ratio = (clampedHeight - 2000) / 1000;
    const r = 1.0 - ratio * 0.3;
    const g = 0;
    const b = 0;
    return [r, g, b, 1.0];
  }
}
