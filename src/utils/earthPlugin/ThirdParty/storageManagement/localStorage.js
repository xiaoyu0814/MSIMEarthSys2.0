/**
 * storage封装  使用示例 import localCache from '@/utils/cache'  const tas = localCache.getCache('tas')
 */
class LocalCache {
  // 设置
  setCache(key, value) {
    window.localStorage.setItem(key, JSON.stringify(value))
  }
  // 获取
  getCache(key) {
    const value = window.localStorage.getItem(key)
    if (value) {
      return JSON.parse(value)
    }
  }
  // 删除
  deleteCache(key) {
    window.localStorage.removeItem(key)
  }
  // 清除
  clearCache() {
    window.localStorage.clear()
  }
}

export default new LocalCache()
