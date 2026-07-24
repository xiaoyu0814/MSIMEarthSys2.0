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

// 首先分析原始数据的风向分布，找出主要的风流动方向
console.log('分析原始数据中...');

// 计算每个点的风速和风向
const speedData = [];
const directionData = [];

for (let z = 0; z < nz; z++) {
  for (let y = 0; y < ny; y++) {
    for (let x = 0; x < nx; x++) {
      const idx = z * ny * nx + y * nx + x;
      const u = windData.u[idx];
      const v = windData.v[idx];
      const speed = Math.sqrt(u * u + v * v);
      const direction = Math.atan2(-u, -v) * (180 / Math.PI); // 风向（来向）
      
      speedData.push({ x, y, z, speed, u, v, w: windData.w[idx] });
      directionData.push(direction);
    }
  }
}

// 找出风速最大的区域作为主要风流动路线
console.log('找出主要风流动路线...');
const maxSpeedPoints = [...speedData].sort((a, b) => b.speed - a.speed).slice(0, 100);

console.log(`找到 ${maxSpeedPoints.length} 个高风速点`);

// 选择一条从左上角到右下角的对角线作为主要路线
// 或者选择一条从左到右的主要风向路线

// 现在我们创建一个新的风场数据，只保留一条主要的风流动路线
console.log('生成单路线风场数据...');

const newU = new Float32Array(windData.u.length);
const newV = new Float32Array(windData.v.length);
const newW = new Float32Array(windData.w.length);

// 首先全部设为0
for (let i = 0; i < newU.length; i++) {
  newU[i] = 0;
  newV[i] = 0;
  newW[i] = 0;
}

// 定义一条主要的风流动路线 - 从左上到右下的对角线
// 路线宽度为2个网格，并有一定的衰减

// 选择主要风向 - 假设是西北风
const mainDirection = 135; // 东南风（或者根据数据调整）
const mainSpeed = 15; // 主要风速（m/s）

// 路线参数
const routeWidth = 2; // 路线宽度（网格数）
const startX = 0;
const startY = 0;
const endX = nx - 1;
const endY = ny - 1;

console.log(`路线: (${startX}, ${startY}) → (${endX}, ${endY})`);
console.log(`路线宽度: ${routeWidth} 网格`);
console.log();

// 为每个点计算是否在路线上，以及离路线的距离
for (let z = 0; z < nz; z++) {
  for (let y = 0; y < ny; y++) {
    for (let x = 0; x < nx; x++) {
      const idx = z * ny * nx + y * nx + x;
      
      // 计算点到对角线的距离
      const distToRoute = Math.abs((endY - startY) * x - (endX - startX) * y + endX * startY - endY * startX) 
                        / Math.sqrt((endY - startY) ** 2 + (endX - startX) ** 2);
      
      // 在路线范围内的点给予风速
      if (distToRoute <= routeWidth) {
        // 距离衰减因子
        const attenuation = Math.max(0, 1 - distToRoute / routeWidth);
        
        // 使用原始数据中该位置的风向，但增强风速
        const origU = windData.u[idx];
        const origV = windData.v[idx];
        const origSpeed = Math.sqrt(origU * origU + origV * origV);
        
        if (origSpeed > 0.1) {
          // 保留原始风向，增强风速
          const speedFactor = 2.0 * attenuation; // 风速增强
          newU[idx] = origU * speedFactor;
          newV[idx] = origV * speedFactor;
          newW[idx] = windData.w[idx] * speedFactor * 0.5;
        } else {
          // 如果原始风速太小，使用预设风向
          const dirRad = (135 - 90) * Math.PI / 180; // 东南风转换为移动方向
          const speed = mainSpeed * attenuation;
          newU[idx] = -Math.sin(dirRad) * speed;
          newV[idx] = -Math.cos(dirRad) * speed;
          newW[idx] = 0;
        }
      }
    }
  }
}

// 再添加一些小的扰动让风场看起来更自然
console.log('添加细节扰动...');
for (let z = 0; z < nz; z++) {
  for (let y = 0; y < ny; y++) {
    for (let x = 0; x < nx; x++) {
      const idx = z * ny * nx + y * nx + x;
      
      if (newU[idx] !== 0 || newV[idx] !== 0) {
        // 添加小的随机扰动
        const noiseX = (Math.random() - 0.5) * 2.0;
        const noiseY = (Math.random() - 0.5) * 2.0;
        newU[idx] += noiseX;
        newV[idx] += noiseY;
      }
    }
  }
}

console.log();
console.log('✓ 数据生成完成！');
console.log('统计:');
let keptPoints = 0;
for (let i = 0; i < newU.length; i++) {
  if (newU[i] !== 0 || newV[i] !== 0) {
    keptPoints++;
  }
}
console.log(`保留数据点: ${keptPoints} / ${newU.length} (${(keptPoints / newU.length * 100).toFixed(1)}%)`);
console.log();

// 保存新数据
const outputPath = path.join(__dirname, 'wind_single_route.json');
const outputData = {
  header: {
    ...header,
    comment: 'Single wind flow route - extracted from original data'
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
console.log('你可以使用这个新数据文件来查看单一的风流动路线！');
