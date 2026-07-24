const fs = require('fs');
const path = require('path');

// 读取文件
const filePath = path.join(__dirname, 'public', 'static', 'config', 'json', 'test.json');
const content = fs.readFileSync(filePath, 'utf8');

// 修复 JSON 格式
function fixJSON(str) {
  // 移除首尾的空白字符
  str = str.trim();

  // 处理最外层的对象
  // 找到所有的键值对
  let result = {};

  // 简单的解析逻辑，处理键值对
  let i = 0;
  while (i < str.length) {
    // 跳过空白字符
    while (i < str.length && /\s/.test(str[i])) i++;

    // 读取键
    if (str[i] === "'" || str[i] === '"') {
      const quote = str[i];
      i++;
      let key = '';
      while (i < str.length && str[i] !== quote) {
        key += str[i];
        i++;
      }
      i++;

      // 跳过冒号和空白字符
      while (i < str.length && /\s/.test(str[i])) i++;
      if (str[i] === ':') i++;
      while (i < str.length && /\s/.test(str[i])) i++;

      // 读取值
      let value;
      if (str[i] === "'" || str[i] === '"') {
        // 字符串值
        const valueQuote = str[i];
        i++;
        let valueStr = '';
        while (i < str.length && str[i] !== valueQuote) {
          valueStr += str[i];
          i++;
        }
        i++;

        // 如果值看起来像 JSON，尝试解析
        if (valueStr.startsWith('{') || valueStr.startsWith('[')) {
          // 替换单引号为双引号
          valueStr = valueStr.replace(/'/g, '"');
          try {
            value = JSON.parse(valueStr);
          } catch (e) {
            value = valueStr;
          }
        } else {
          value = valueStr;
        }
      } else if (str[i] === '{') {
        // 对象值
        let depth = 1;
        let objStr = '{';
        i++;
        while (i < str.length && depth > 0) {
          objStr += str[i];
          if (str[i] === '{') depth++;
          if (str[i] === '}') depth--;
          i++;
        }
        // 替换单引号为双引号
        objStr = objStr.replace(/'/g, '"');
        try {
          value = JSON.parse(objStr);
        } catch (e) {
          value = objStr;
        }
      } else if (str[i] === '[') {
        // 数组值
        let depth = 1;
        let arrStr = '[';
        i++;
        while (i < str.length && depth > 0) {
          arrStr += str[i];
          if (str[i] === '[') depth++;
          if (str[i] === ']') depth--;
          i++;
        }
        // 替换单引号为双引号
        arrStr = arrStr.replace(/'/g, '"');
        try {
          value = JSON.parse(arrStr);
        } catch (e) {
          value = arrStr;
        }
      } else if (!isNaN(str[i]) || str[i] === '-') {
        // 数字值
        let numStr = '';
        while (i < str.length && /[0-9.eE+-]/.test(str[i])) {
          numStr += str[i];
          i++;
        }
        value = parseFloat(numStr);
      } else if (str.substring(i, i + 4) === 'true') {
        value = true;
        i += 4;
      } else if (str.substring(i, i + 5) === 'false') {
        value = false;
        i += 5;
      } else if (str.substring(i, i + 4) === 'null') {
        value = null;
        i += 4;
      }

      // 存储键值对
      result[key] = value;

      // 跳过逗号
      while (i < str.length && /\s/.test(str[i])) i++;
      if (str[i] === ',') i++;
    } else {
      i++;
    }
  }

  return result;
}

try {
  // 解析文件内容
  const parsed = fixJSON(content);
  console.log('JSON 解析成功！');

  // 写入修复后的文件
  fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2));
  console.log('修复后的 JSON 已写入文件。');
} catch (error) {
  console.error('处理失败:', error.message);
  console.error(error.stack);
}
