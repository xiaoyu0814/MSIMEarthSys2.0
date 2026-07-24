import IndexDBCache from './indexDBCache.js'
// //初始化数据库
// const initIndexDB = () => {
//   // 根据项目实际需求，设置对应数据库名、表名和数据库主键（主键需要为添加对象内的key，否则新增和获取会失败）
//   const params = {
//     dbName: 'test',
//     cacheTableName: 'imageCache',
//     keyPath: 'imageName',
//     indexs: [
//       { name: 'imageData', unique: false },
//       { name: 'imageFile', unique: true }
//     ]
//   }
//   window.imageDB = new window.EarthPlugn.IndexDBCache(params)
//   window.imageDB
//     .initDB()
//     .then((res) => {
//       if (res.type == 'upgradeneeded') {
//         console.log('indexDB 数据库创建或更新成功!')
//         // changeVal()
//       } else {
//         console.log('indexDB 数据库初始化成功!')
//         // changeVal()
//         // getImageByName('uploadImgName59832302')
//         getDataByIndexDB()
//       }
//     })
//     .catch((err) => {
//       console.log('indexDB 数据库初始化失败! ', err)
//     })
// }
// // 写入数据库
// function RandomNumber() {
//   return Math.floor(Math.random() * 100000000.0)
// }
// const changeVal = () => {
//   const data = {
//     imageName: 'uploadImgName' + RandomNumber(),
//     imageData: 'uploadImgUrl' + RandomNumber(),
//     imageFile: 'uploadFile' + RandomNumber()
//   }
//   imageDB
//     .addData(data)
//     .then((res) => {
//       console.log('写入 indexDB 数据库成功', res)
//     })
//     .catch((err) => {
//       console.log('写入 indexDB 数据库失败==>', err)
//     })
// }

// // 基于primary key 移除数据 eg.:'uploadImgName51227290'
// const removeIndexDB = (primaryKey) => {
//   window.imageDB.remove(primaryKey)
// }

// const updateIndexDB = () => {
//   imageDB.update({
//     imageData: 'uploadImgUrl123',
//     imageFile: 'uploadFile123',
//     imageName: 'uploadImgName59832302'
//   })
// }

// // 从数据库获取数据
// // imageName 可为空或者 null,即返回所有数据否则是指定key对应的值
// const getImageByName = (imageName) => {
//   imageDB
//     .getDataByKey(imageName)
//     .then((res) => {
//       console.log('从indexDB数据库获取数据成功', res)
//     })
//     .catch((err) => {
//       console.log('从indexDB数据库获取数据失败==>', err)
//     })
// }

// const getDataByIndexDB = () => {
//   imageDB.getDataByIndex({
//     index: 'imageData',
//     value: 'uploadImgUrl123'
//   })
// }

// const closeIndexDB = () => {
//   imageDB.closeDB()
// }

class IndexDBControl {
  currentDbVersion = 0
  db = null
  constructor(options) {
    // 初始化参数
  }
  // 初始化数据库（新建或打开）
  initIndexDB(params) {
    // 根据项目实际需求，设置对应数据库名、表名和数据库主键（主键需要为添加对象内的key，否则新增和获取会失败）
    // const params = {
    //   dbName: 'test',
    //   cacheTableName: 'imageCache',
    //   keyPath: 'imageName',
    //   indexs: [
    //     { name: 'imageData', unique: false },
    //     { name: 'imageFile', unique: true }
    //   ]
    // }
    window.customIndexDB = new IndexDBCache(params)
    window.customIndexDB
      .initDB()
      .then((res) => {
        if (res.type == 'upgradeneeded') {
          console.log('indexDB 数据库创建或更新成功!')
        } else {
          console.log('indexDB 数据库初始化成功!')
        }
      })
      .catch((err) => {
        console.log('indexDB 数据库初始化失败! ', err)
      })
  }

  createTable(options) {
    console.log(1)

    let dbName = options.dbName
    let tableName = options.tableName
    let keyPath = options.keyPath
    let dataList = options.dataList
    if (!dbName) return
    if (!tableName) return
    if (this.db) {
      this.db.close()
      this.db = null
    }
    const request = indexedDB.open(dbName, this.currentDbVersion + 1)
    this.currentDbVersion++
    request.onerror = (event) => {
      console.log(`数据库错误: ${event.target.error}`, 'error')
    }

    request.onupgradeneeded = (event) => {
      console.log(2)
      const db = event.target.result
      this.db = db

      // 检查表是否已存在
      if (!db.objectStoreNames.contains(tableName)) {
        // 创建新表
        db.createObjectStore(tableName, {
          keyPath: keyPath
        })

        console.log(`表 "${tableName}" 创建成功！`, 'success')
      } else {
        console.log(`表 "${tableName}" 已存在`, 'error')
      }
    }

    request.onsuccess = (event) => {
      console.log(3)
      console.log('onsuccess', dataList)
      dataList.forEach((element) => {
        this.writeDataByTableName(
          event.currentTarget.result,
          tableName,
          element
        )
      })
    }
  }

  writeDataByTableName(db, tableName, data) {
    console.log(db.readyState)

    if (db.readyState == 'pending') return
    const transaction = db.transaction(tableName, 'readwrite')
    const store = transaction.objectStore(tableName)
    const response = store.add(data)
    response.onerror = (event) => {
      console.log('error', data)
    }
  }

  // 写入数据
  writeData(data) {
    // const data = {
    //   imageName: 'uploadImgName' + RandomNumber(),
    //   imageData: 'uploadImgUrl' + RandomNumber(),
    //   imageFile: 'uploadFile' + RandomNumber()
    // }
    if (window.customIndexDB) {
      window.customIndexDB
        .addData(data)
        .then((res) => {
          console.log('写入 indexDB 数据库成功', res)
        })
        .catch((err) => {
          console.log('写入 indexDB 数据库失败==>', err)
          // this.updateIndexDB(data)
        })
    }
  }
  // 基于primary key 移除数据 eg.:'uploadImgName51227290'
  removeIndexDB(primaryKey) {
    if (window.customIndexDB) {
      window.customIndexDB.remove(primaryKey)
    }
  }
  // 更新数据
  updateIndexDB(data) {
    // imageDB.update({
    //   imageData: 'uploadImgUrl123',
    //   imageFile: 'uploadFile123',
    //   imageName: 'uploadImgName59832302'
    // })
    if (window.customIndexDB) {
      window.customIndexDB.update(data)
    }
  }
  // 从数据库获取数据
  // imageName 可为空或者 null,即返回所有数据否则是指定key对应的值
  getImageByName(imageName, callback) {
    if (window.customIndexDB) {
      window.customIndexDB
        .getDataByKey(imageName)
        .then((res) => {
          console.log('从indexDB数据库获取数据成功', res)
          callback(res)
        })
        .catch((err) => {
          console.log('从indexDB数据库获取数据失败==>', err)
        })
    }
  }
  getDataByIndexDB(data) {
    // imageDB.getDataByIndex({
    //   index: 'imageData',
    //   value: 'uploadImgUrl123'
    // })
    if (window.customIndexDB) {
      window.customIndexDB.getDataByIndex(data)
    }
  }
  // 遍历数据
  readAll(callback) {
    if (window.customIndexDB) {
      window.customIndexDB.readAll(callback)
    }
  }
  // 通过遍历获取数据并操作
  getAllPAData(callback) {
    if (window.customIndexDB) {
      const objectStore = window.customIndexDB._db
        .transaction(window.customIndexDB._cacheTableName)
        .objectStore(window.customIndexDB._cacheTableName)
      objectStore.openCursor().onsuccess = function (event) {
        const cursor = event.target.result
        if (cursor) {
          callback({ Data: cursor.value.PAData })
          cursor.continue()
        } else {
          console.log('PA遍历完成！')
        }
      }
    }
  }
  // 清除PA消息渲染的实体
  removePAData(callback) {
    if (window.customIndexDB) {
      const objectStore = window.customIndexDB._db
        .transaction(window.customIndexDB._cacheTableName)
        .objectStore(window.customIndexDB._cacheTableName)
      objectStore.openCursor().onsuccess = function (event) {
        const cursor = event.target.result
        if (cursor) {
          callback({ Data: cursor.value.PAData })
          cursor.continue()
        } else {
          console.log('PA遍历完成！')
        }
      }
    }
  }
  // 关闭数据库
  closeIndexDB() {
    if (window.customIndexDB) {
      window.customIndexDB.closeDB()
    }
  }
  clearDB() {
    if (window.customIndexDB) {
      window.customIndexDB.clearDB()
    }
  }
}

export default IndexDBControl
