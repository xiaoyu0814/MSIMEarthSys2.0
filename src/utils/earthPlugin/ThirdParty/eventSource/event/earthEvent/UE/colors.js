/**
 * 色带函数 - 根据归一化值(0-1)返回对应的颜色
 */
export function getColorByValue(value) {
  // 确保值在 0-1 范围内
  value = Math.max(0, Math.min(1, value));
  
  // 定义色带颜色（从蓝色到红色的渐变）
  const colorStops = [
    { value: 0, color: [0, 0, 1, 1] },     // 蓝色
    { value: 0.3, color: [0, 1, 1, 1] },   // 青色
    { value: 0.5, color: [0, 1, 0, 1] },   // 绿色
    { value: 0.7, color: [1, 1, 0, 1] },   // 黄色
    { value: 0.9, color: [1, 0.5, 0, 1] }, // 橙色
    { value: 1, color: [1, 0, 0, 1] }       // 红色
  ];
  
  // 找到当前值所在的颜色区间
  for (let i = 0; i < colorStops.length - 1; i++) {
    const stop1 = colorStops[i];
    const stop2 = colorStops[i + 1];
    
    if (value >= stop1.value && value <= stop2.value) {
      // 计算插值比例
      const t = (value - stop1.value) / (stop2.value - stop1.value);
      
      // 线性插值计算颜色
      const r = stop1.color[0] + (stop2.color[0] - stop1.color[0]) * t;
      const g = stop1.color[1] + (stop2.color[1] - stop1.color[1]) * t;
      const b = stop1.color[2] + (stop2.color[2] - stop1.color[2]) * t;
      const a = stop1.color[3] + (stop2.color[3] - stop1.color[3]) * t;
      
      // 创建并返回 Cesium 颜色
      return new window.MSIMEarth.Color(r, g, b, a);
    }
  }
  
  // 默认返回红色
  return window.MSIMEarth.Color.RED;
}

/**
 * 生成完整色带数组 - 间隔为 0.01
 */
export function generateColorRamp() {
  const colorRamp = [];
  for (let i = 0; i <= 100; i++) {
    const value = i / 100;
    colorRamp.push({
      value,
      color: getColorByValue(value)
    });
  }
  return colorRamp;
}
