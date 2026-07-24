let db = null
let dbVersion = 1 // 跟踪当前数据库版本
const pendingOperations = [] // 等待数据库初始化的操作队列

// 统一管理数据库连接
async function getDatabase(dbName, version) {
  return new Promise((resolve, reject) => {
    if (db && db.version === version) {
      resolve(db)
      return
    }

    // 关闭旧连接
    if (db) {
      db.close()
      db = null
    }

    const request = indexedDB.open(dbName, version)

    request.onerror = (event) => {
      reject(`数据库打开失败: ${event.target.error}`)
    }

    request.onupgradeneeded = (event) => {
      db = event.target.result
      dbVersion = event.newVersion // 更新全局版本
      console.log(`数据库升级到版本 ${dbVersion}`)
    }

    request.onsuccess = (event) => {
      db = event.target.result
      resolve(db)

      // 执行等待中的操作
      pendingOperations.forEach((op) => op())
      pendingOperations.length = 0
    }
  })
}

// 创建表
async function createTable(options) {
  const { dbName, tableName, keyPath } = options

  // 验证输入
  if (!dbName || !tableName || !keyPath) {
    throw new Error('缺少必要参数: dbName, tableName 或 keyPath')
  }

  try {
    // 获取数据库连接（触发升级）
    const db = await getDatabase(dbName, dbVersion + 1)

    // 检查表是否存在
    if (!db.objectStoreNames.contains(tableName)) {
      // 在事务外创建表需要重新打开连接
      await new Promise((resolve) => {
        const createRequest = indexedDB.open(dbName, dbVersion + 1)

        createRequest.onupgradeneeded = (event) => {
          const db = event.target.result
          db.createObjectStore(tableName, { keyPath })
          console.log(`表 "${tableName}" 创建成功`)
          resolve()
        }
      })
    }

    return true
  } catch (error) {
    console.error(`创建表失败: ${error}`, 'error')
    throw error
  }
}

// 添加数据
async function addDataToTable(dbName, tableName, data) {
  if (!tableName || !data) {
    throw new Error('缺少必要参数: tableName 或 data')
  }

  try {
    // 确保数据库已初始化
    const db = await getDatabase(dbName, dbVersion)

    // 验证表是否存在
    if (!db.objectStoreNames.contains(tableName)) {
      throw new Error(`表 "${tableName}" 不存在`)
    }

    const transaction = db.transaction([tableName], 'readwrite')
    const store = transaction.objectStore(tableName)

    return new Promise((resolve, reject) => {
      const request = store.add(data)

      request.onsuccess = () => resolve()
      request.onerror = (event) => reject(event.target.error)
    })
  } catch (error) {
    console.error(`添加数据失败: ${error}`, 'error')
    throw error
  }
}

export { createTable, addDataToTable }
