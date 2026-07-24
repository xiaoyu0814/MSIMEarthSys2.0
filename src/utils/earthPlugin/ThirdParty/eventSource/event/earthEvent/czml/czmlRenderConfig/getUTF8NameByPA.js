import store from '@/store'

// 将十六进制字符串转换成 UTF-8 中文
// 例如: "E99C8DE5858B" -> 中文字符
function hexToUtf8(hex) {
  if (!hex || typeof hex !== 'string') return ''
  // 如果字符串中包含 %，说明是 percent-encode 格式
  if (hex.indexOf('%') !== -1) {
    try {
      return decodeURIComponent(hex)
    } catch (e) {
      // 继续尝试其他方式
    }
  }
  // 处理纯十六进制格式 (例如 "E99C8DE5858B")
  // 1. 移除可能存在的空格、逗号等分隔符
  const cleanHex = hex.replace(/[\s,]/g, '')
  // 2. 校验是否是合法的十六进制字符串且长度为偶数
  if (/^[0-9A-Fa-f]+$/.test(cleanHex) && cleanHex.length % 2 === 0) {
    try {
      const bytes = new Uint8Array(cleanHex.length / 2)
      for (let i = 0; i < cleanHex.length; i += 2) {
        bytes[i / 2] = parseInt(cleanHex.substring(i, i + 2), 16)
      }
      return new TextDecoder('utf-8').decode(bytes)
    } catch (e) {
      return hex
    }
  }
  // 不满足十六进制格式时，尝试用 decodeURIComponent 处理
  // 最后兜底：如果字符串本身已经是中文，直接返回
  try {
    return decodeURIComponent(hex)
  } catch (e) {
    return hex
  }
}

// 从缓存的PA数据中根据Name获取UTF-8Name
export function getUTF8NameByPA(name) {
  const pa = store.state.sceneModule.sceneEnityData.find((pa) => {
    // 如果name等于pa.Data.Name则把pa.Data.UTF-8Name返回
    return name === pa.Data.Name
  })
  if (pa) {
    // pa.Data['UTF-8Name']可能是十六进制编码的UTF-8字节序列
    // 例如: "E99C8DE5858BE99BB7E8BEBEE7AB99"
    return hexToUtf8(pa.Data['UTF-8Name'])
  }
}