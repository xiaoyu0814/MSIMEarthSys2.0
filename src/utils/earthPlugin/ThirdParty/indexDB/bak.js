const indexDB =
  window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB
class IndexDBCache {
  // 构造函数
  constructor() {
    this._db = null //数据库
    this._transaction = null //事务
    this._request = null
    this._dbName = 'loginInfoDb' //数据库名
    this._cacheTableName = 'loginInfoTable' //表名
    this._dbversion = 1 //数据库版本
  }
  initDB(val) {
    return new Promise((resolve, reject) => {
      this._request = indexDB.open(this._dbName, this._dbversion) // 打开数据库
      // 数据库初始化成功
      this._request.onsuccess = (event) => {
        this._db = this._request.result
        resolve(event)
      }
      // 数据库初始化失败
      this._request.onerror = (event) => {
        reject(event)
      }
      // 数据库初次创建或更新时会触发
      this._request.onupgradeneeded = (event) => {
        let db = this._request.result
        if (!db.objectStoreNames.contains(this._cacheTableName)) {
          db.createObjectStore(this._cacheTableName, {
            keyPath: val // 设置主键
          })
        }
        resolve(event)
      }
    })
  }
  closeDB() {
    this._db.close()
    console.log(`关闭数据库`)
  }
  addData(params) {
    return new Promise((resolve, reject) => {
      let transaction = this._db.transaction(this._cacheTableName, 'readwrite')
      let store = transaction.objectStore(this._cacheTableName)
      let response = store.add(params)
      // 操作成功
      response.onsuccess = (event) => {
        console.log('操作成功')
        resolve(event)
      }
      // 操作失败
      response.onerror = (event) => {
        console.log('操作失败')
        reject(event)
      }
    })
  }
  // 通过主键读取数据
  getDataByKey(key) {
    return new Promise((resolve, reject) => {
      let transaction = this._db.transaction(this._cacheTableName)
      let objectStore = transaction.objectStore(this._cacheTableName)
      // 通过主键读取数据
      let request = objectStore.get(key)
      // 操作成功
      request.onsuccess = () => {
        resolve(request.result)
      }
      // 操作失败
      request.onerror = (event) => {
        reject(event)
      }
    })
  }
  // 清空数据库数据
  clearDB() {
    return new Promise((resolve, reject) => {
      let transaction =
        this._db && this._db.transaction(this._cacheTableName, 'readwrite')
      let store = transaction && transaction.objectStore(this._cacheTableName)
      let response = store && store.clear()
      // 操作成功
      response.onsuccss = (event) => {
        console.log('清空数据库数据')
        resolve(event)
      }
      // 操作失败
      response.onerror = (event) => {
        reject(event)
      }
    })
  }

  deleteDBAll(dbName) {
    console.log(dbName)
    let deleteRequest = indexDB.deleteDatabase(this._dbName)
    return new Promise((resolve, reject) => {
      deleteRequest.onerror = function (event) {
        console.log('删除失败')
      }
      deleteRequest.onsuccess = function (event) {
        console.log('删除数据库成功')
      }
    })
  }
}
export default IndexDBCache
