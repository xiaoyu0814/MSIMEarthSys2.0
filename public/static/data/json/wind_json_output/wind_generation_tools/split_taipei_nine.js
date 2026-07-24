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

// 九等分：x方向3段，y方向3段，从左上角开始
const numX = 3;
const numY = 3;

// 计算每段的网格数（尽可能均匀分配）
const segmentNxList = [];
const segmentNyList = [];

for (let i = 0; i < numX; i++) {
  segmentNxList.push(Math.floor(nx / numX) + (i < (nx % numX) ? 1 : 0));
}

for (let i = 0; i < numY; i++) {
  segmentNyList.push(Math.floor(ny / numY) + (i < (ny % numY) ? 1 : 0));
}

console.log('网格分配:');
console.log('  X方向:', segmentNxList);
console.log('  Y方向:', segmentNyList);
console.log();

// 遍历每个区块
let startX = 0;
let startY = 0;

for (let yIdx = 0; yIdx < numY; yIdx++) {
  const currentNy = segmentNyList[yIdx];
  
  for (let xIdx = 0; xIdx < numX; xIdx++) {
    const currentNx = segmentNxList[xIdx];
    
    const endX = startX + currentNx - 1;
    const endY = startY + currentNy - 1;
    
    const partNum = yIdx * numX + xIdx + 1;
    console.log(`区块 ${partNum} (${xIdx}, ${yIdx}):`);
    console.log(`  网格: X[${startX}-${endX}] Y[${startY}-${endY}] (${currentNx}×${currentNy})`);
    
    // 计算新的地理边界
    const newLo1 = lo1 + startX * dx;
    const newLo2 = lo1 + endX * dx;
    const newLa1 = la1 + startY * dy;
    const newLa2 = la1 + endY * dy;
    
    console.log(`  范围: 经度 ${newLo1.toFixed(6)} - ${newLo2.toFixed(6)} | 纬度 ${newLa1.toFixed(6)} - ${newLa2.toFixed(6)}`);
    
    // 提取数据
    const newU = [];
    const newV = [];
    const newW = [];
    
    for (let z = 0; z < nz; z++) {
      for (let y = startY; y <= endY; y++) {
        for (let x = startX; x <= endX; x++) {
          const origIdx = z * ny * nx + y * nx + x;
          newU.push(windData.u[origIdx]);
          newV.push(windData.v[origIdx]);
          newW.push(windData.w[origIdx]);
        }
      }
    }
    
    // 创建新的header
    const newHeader = {
      ...header,
      nx: currentNx,
      ny: currentNy,
      lo1: newLo1,
      lo2: newLo2,
      la1: newLa1,
      la2: newLa2
    };
    
    // 保存文件
    const outputPath = path.join(__dirname, `taipei_part${partNum}.json`);
    const outputData = {
      header: newHeader,
      data: {
        u: newU,
        v: newV,
        w: newW
      }
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
    console.log(`  ✓ 保存到: taipei_part${partNum}.json (${newU.length} 数据点)`);
    console.log();
    
    startX += currentNx;
  }
  
  startX = 0;
  startY += currentNy;
}

console.log('✓ 完成！9个区块文件已生成');
console.log('  布局:');
console.log('    ┌─────────┬─────────┬─────────┐');
console.log('    │ part1   │ part2   │ part3   │');
console.log('    │ (左上)  │         │ (右上)  │');
console.log('    ├─────────┼─────────┼─────────┤');
console.log('    │ part4   │ part5   │ part6   │');
console.log('    │         │ (中心)  │         │');
console.log('    ├─────────┼─────────┼─────────┤');
console.log('    │ part7   │ part8   │ part9   │');
console.log('    │ (左下)  │         │ (右下)  │');
console.log('    └─────────┴─────────┴─────────┘');
