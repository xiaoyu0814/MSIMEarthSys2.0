const fs = require('fs');
const path = require('path');

// 读取修复后的文件
const filePath = path.join(__dirname, 'public', 'static', 'config', 'json', 'test.json');
const content = fs.readFileSync(filePath, 'utf8');

try {
  // 尝试解析 JSON
  const parsed = JSON.parse(content);
  console.log('JSON 解析成功！');
  console.log('文件大小:', content.length, 'bytes');
  console.log('顶层键:', Object.keys(parsed));

  if (parsed.content) {
    console.log('content 字段存在');
    if (typeof parsed.content === 'object') {
      console.log('content 是对象，键:', Object.keys(parsed.content));
    }
  }

  console.log('验证完成，JSON 格式正确。');
} catch (error) {
  console.error('JSON 解析失败:', error.message);
}
