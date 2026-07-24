/**
 * 色带生成工具
 * 基于高度从0到1500米生成颜色渐变
 */

// 颜色渐变配置（RGB值，范围0-1）
const colorStops = [
  { height: 0, color: [0, 0, 1] },     // 蓝色（最低）
  { height: 300, color: [0, 1, 1] },    // 青色
  { height: 600, color: [0, 1, 0] },    // 绿色
  { height: 900, color: [1, 1, 0] },    // 黄色
  { height: 1200, color: [1, 0.5, 0] }, // 橙色
  { height: 1500, color: [1, 0, 0] }    // 红色（最高）
];

/**
 * 线性插值
 * @param {number} start 起始值
 * @param {number} end 结束值
 * @param {number} ratio 比例（0-1）
 * @returns {number} 插值结果
 */
const lerp = (start, end, ratio) => {
  return start + (end - start) * ratio;
};

/**
 * 根据高度获取颜色
 * @param {number} height 高度值（0-1500）
 * @returns {Array} RGB颜色值（范围0-1）
 */
export const getColorByHeight = (height) => {
  // 确保高度在有效范围内
  const clampedHeight = Math.max(0, Math.min(1500, height));
  
  // 找到当前高度所在的颜色区间
  for (let i = 0; i < colorStops.length - 1; i++) {
    const stop1 = colorStops[i];
    const stop2 = colorStops[i + 1];
    
    if (clampedHeight >= stop1.height && clampedHeight <= stop2.height) {
      // 计算当前高度在区间内的比例
      const ratio = (clampedHeight - stop1.height) / (stop2.height - stop1.height);
      
      // 对RGB三个通道分别进行插值
      const r = lerp(stop1.color[0], stop2.color[0], ratio);
      const g = lerp(stop1.color[1], stop2.color[1], ratio);
      const b = lerp(stop1.color[2], stop2.color[2], ratio);
      
      return [r, g, b, 1]; // 添加alpha通道，值为1（不透明）
    }
  }
  
  // 默认返回最后一个颜色
  return [...colorStops[colorStops.length - 1].color, 1];
};

/**
 * 生成完整的色带映射（0-1500米，每1米一个颜色）
 * @returns {Array} 颜色数组，索引对应高度（0-1500）
 */
export const generateColorRamp = () => {
  const colorRamp = [];
  for (let height = 0; height <= 1500; height++) {
    colorRamp[height] = getColorByHeight(height);
  }
  return colorRamp;
};

/**
 * 预生成色带映射，提高性能
 */
export const colorRamp = generateColorRamp();

export default {
  getColorByHeight,
  generateColorRamp,
  colorRamp
};
