const fs = require('fs');
const path = require('path');

// 读取原始数据
const inputPath = path.join(__dirname, 'wind3d2_radar_taipei.json');
const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const { header, data: windData } = data;
const { nx, ny, nz, lo1, lo2, la1, la2, dx, dy } = header;

console.log('原始网格:', nx, '×', ny, '×', nz);
console.log('原始范围:');
console.log('  经度:', lo1, '-', lo2);
console.log('  纬度:', la1, '-', la2);
console.log();

// 分析数据中的主要风流动
console.log('分析原始数据中的主要风流动...');

// 找出所有有效风速点
const validPoints = [];
let totalU = 0, totalV = 0, validCount = 0;

for (let z = 0; z < nz; z++) {
  for (let y = 0; y < ny; y++) {
    for (let x = 0; x < nx; x++) {
      const idx = z * ny * nx + y * nx + x;
      const u = windData.u[idx];
      const v = windData.v[idx];
      const speed = Math.sqrt(u * u + v * v);
      
      if (speed > 1.0) { // 只考虑风速大于1m/s的点
        validPoints.push({ x, y, z, speed, u, v, w: windData.w[idx] });
        totalU += u;
        totalV += v;
        validCount++;
      }
    }
  }
}

console.log(`有效风速点: ${validPoints.length} / ${nx * ny * nz}`);
console.log();

// 计算平均风向
const avgU = totalU / validCount;
const avgV = totalV / validCount;
const avgSpeed = Math.sqrt(avgU * avgU + avgV * avgV);
const avgDirection = Math.atan2(-avgU, -avgV) * (180 / Math.PI);

console.log('平均风向分析:');
console.log(`  平均风向: ${avgDirection.toFixed(1)}° (0°=北, 90°=东, 180°=南, 270°=西)`);
console.log(`  平均风速: ${avgSpeed.toFixed(2)} m/s`);
console.log();

// 找出数据中的主要风流动区域 - 寻找连续的高风速区域
console.log('寻找主要风流动区域...');

// 按风速排序
const sortedPoints = [...validPoints].sort((a, b) => b.speed - a.speed);

// 寻找最大的连续区域
// 简单方法：取前100个最高速点，看看它们分布在哪里
const top100 = sortedPoints.slice(0, 100);

// 计算这些点的中心
let centerX = 0, centerY = 0, centerZ = 0;
top100.forEach(p => {
  centerX += p.x;
  centerY += p.y;
  centerZ += p.z;
});
centerX = Math.round(centerX / top100.length);
centerY = Math.round(centerY / top100.length);
centerZ = Math.round(centerZ / top100.length);

console.log(`高风速区域中心: (${centerX}, ${centerY}, ${centerZ})`);

// 现在，让我们基于原始数据，创建一条主要的风流动路线
// 我们会选择从东向西的主要流动，或者根据数据的实际情况调整

console.log();
console.log('生成单路线风场数据...');

// 创建新的数据数组
const newU = new Float32Array(windData.u.length);
const newV = new Float32Array(windData.v.length);
const newW = new Float32Array(windData.w.length);

// 初始化为0
for (let i = 0; i < newU.length; i++) {
  newU[i] = 0;
  newV[i] = 0;
  newW[i] = 0;
}

// 定义参数
const routeWidth = 3; // 路线宽度
const routeStrength = 1.5; // 强度因子
const mainDirection = avgDirection; // 使用平均风向

console.log(`使用参数:`);
console.log(`  路线宽度: ${routeWidth} 网格`);
console.log(`  强度因子: ${routeStrength}`);
console.log(`  主要风向: ${mainDirection.toFixed(1)}°`);
console.log();

// 找出所有点到主要流动路线的距离
// 我们将创建一条从(0, centerY)到(nx-1, centerY)的主要路线
const routeY = centerY;

// 统计信息
let keptPoints = 0;

// 生成数据
for (let z = 0; z < nz; z++) {
  for (let y = 0; y < ny; y++) {
    for (let x = 0; x < nx; x++) {
      const idx = z * ny * nx + y * nx + x;
      
      // 计算到中心线的垂直距离
      const distToCenter = Math.abs(y - routeY);
      
      // 如果在路线宽度范围内
      if (distToCenter <= routeWidth) {
        // 距离衰减因子
        const attenuation = Math.max(0, 1 - distToCenter / routeWidth);
        
        // 获取原始数据
        const origU = windData.u[idx];
        const origV = windData.v[idx];
        const origSpeed = Math.sqrt(origU * origU + origV * origV);
        
        if (origSpeed > 0.5) {
          // 保留原始风向，增强风速
          const speedFactor = routeStrength * attenuation;
          newU[idx] = origU * speedFactor;
          newV[idx] = origV * speedFactor;
          newW[idx] = windData.w[idx] * speedFactor * 0.5;
          keptPoints++;
        } else {
          // 如果原始数据很弱，使用平均风向
          const dirRad = (mainDirection - 90) * Math.PI / 180; // 转换为移动方向
          const baseSpeed = avgSpeed * routeStrength * attenuation;
          newU[idx] = -Math.sin(dirRad) * baseSpeed;
          newV[idx] = -Math.cos(dirRad) * baseSpeed;
          newW[idx] = 0;
          if (baseSpeed > 0.1) keptPoints++;
        }
        
        // 添加一些自然的扰动
        if (newU[idx] !== 0 || newV[idx] !== 0) {
          const noiseStrength = 0.3 * attenuation;
          newU[idx] += (Math.random() - 0.5) * noiseStrength;
          newV[idx] += (Math.random() - 0.5) * noiseStrength;
        }
      }
    }
  }
}

console.log();
console.log('✓ 数据生成完成！');
console.log('统计:');
console.log(`保留数据点: ${keptPoints} / ${newU.length} (${(keptPoints / newU.length * 100).toFixed(1)}%)`);
console.log();

// 保存新数据
const outputPath = path.join(__dirname, 'wind_single_route_v2.json');
const outputData = {
  header: {
    ...header,
    comment: `Single wind flow route - extracted from original data, centered at y=${routeY}`
  },
  data: {
    u: Array.from(newU),
    v: Array.from(newV),
    w: Array.from(newW)
  }
};

fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));

console.log('✓ 数据已保存到:', outputPath);
console.log();
console.log('已生成两条路线版本：');
console.log('  1. wind_single_route.json - 对角线路线');
console.log('  2. wind_single_route_v2.json - 基于数据的主要风流动路线（推荐）');
console.log();
console.log('你可以使用这些数据文件来查看单一的风流动路线！');
