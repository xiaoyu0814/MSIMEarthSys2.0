const fs = require('fs');
const path = require('path');

// 读取原始数据
const inputPath = path.join(__dirname, 'filtered_wind_data2.json');
const data = JSON.parse(fs.readFileSync(inputPath, 'utf8'));
const { header, data: windData } = data;
const { nx, ny, nz, lo1, lo2, la1, la2, dx, dy } = header;

console.log('原始网格:', nx, '×', ny, '×', nz);
console.log('原始范围:', '经度', lo1, '-', lo2, '纬度', la1, '-', la2);
console.log();

// 九等分：x方向3段，y方向3段
const numX = 3;
const numY = 3;

// 计算每段的范围（尽可能均匀）
const segmentNx = Math.floor(nx / numX);
const segmentNy = Math.floor(ny / numY);
const remainNx = nx % numX;
const remainNy = ny % numY;

let startX = 0, startY = 0;

for (let yIdx = 0; yIdx < numY; yIdx++) {
  const currentNy = segmentNy + (yIdx < remainNy ? 1 : 0);
  
  for (let xIdx = 0; xIdx < numX; xIdx++) {
    const currentNx = segmentNx + (xIdx < remainNx ? 1 : 0);
    
    const endX = startX + currentNx;
    const endY = startY + currentNy;
    
    console.log(`区域 ${yIdx * 3 + xIdx + 1}: X[${startX}-${endX}] Y[${startY}-${endY}] (${currentNx}×${currentNy})`);
    
    // 计算新的地理边界
    const newLo1 = lo1 + startX * dx;
    const newLo2 = lo1 + (endX - 1) * dx;
    const newLa1 = la1 + startY * dy;
    const newLa2 = la1 + (endY - 1) * dy;
    
    // 提取数据
    const newU = [], newV = [], newW = [];
    
    for (let z = 0; z < nz; z++) {
      for (let y = startY; y < endY; y++) {
        for (let x = startX; x < endX; x++) {
          const idx = z * ny * nx + y * nx + x;
          newU.push(windData.u[idx]);
          newV.push(windData.v[idx]);
          newW.push(windData.w[idx]);
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
    const outputPath = path.join(__dirname, `wind_part${yIdx * 3 + xIdx + 1}.json`);
    const outputData = {
      header: newHeader,
      data: {
        u: newU,
        v: newV,
        w: newW
      }
    };
    
    fs.writeFileSync(outputPath, JSON.stringify(outputData, null, 2));
    console.log(`  保存到: wind_part${yIdx * 3 + xIdx + 1}.json (${newLo1.toFixed(4)}-${newLo2.toFixed(4)} E, ${newLa1.toFixed(4)}-${newLa2.toFixed(4)} N)`);
    console.log();
    
    startX += currentNx;
  }
  
  startX = 0;
  startY += currentNy;
}

console.log('\n✓ 完成！9个文件已生成');
