/**
 * storage封装 使用示例 import localCache from '@/utils/cache'  const tas = localCache.getCache('tas')
 */
class SessionCache {
  // 设置
  setCache(key, value) {
    window.sessionStorage.setItem(key, JSON.stringify(value))
  }
  // 获取
  getCache(key) {
    const value = window.sessionStorage.getItem(key)
    if (value) {
      return JSON.parse(value)
    }
  }
  // 删除
  deleteCache(key) {
    window.sessionStorage.removeItem(key)
  }
  // 清除
  clearCache() {
    window.sessionStorage.clear()
  }
  // 判断数据类型
  isJSON(str) {
    if (typeof str == 'string') {
      try {
        var getValue = JSON.parse(str)
        if (typeof getValue == 'object' && getValue) {
          return true
        } else {
          return false
        }
      } catch (error) {
        return false
      }
    }
  }
}

export default new SessionCache()
