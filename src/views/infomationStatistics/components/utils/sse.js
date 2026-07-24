/*
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2025-07-24 09:58:40
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2026-01-08 15:23:09
 * @FilePath: \gfdx\src\views\infomationStatistics\components\utils\sse.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
/*
 * @Author: 谢小宇
 * @Date: 2025-07-24 09:58:40
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2025-08-12 10:50:33
 * @FilePath: \gfdx\src\views\infomationStatistics\components\utils\sse.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import IndexDBControl from '@/utils/earthPlugin/ThirdParty/indexDB/index.js'
import { createTable, addDataToTable } from './indexedDB'
import store from '@/store'

let self = null
window.tableList = []
let time = new Date().getTime()
let redData = 0
let blueData = 0

class sseLink {
  constructor(callback) {
    self = this
    this.callback = callback
    this.redList = {}
    this.blueList = {}
    this.redcgfList = []
    this.bluecgfList = []
    this.arr = []
    this.side = 'admin'
    this.curSceneIDArr = new Date().getTime()
    this.url = `${serverUrls.serversCommunication}EventSourceController/v1/getMsg/${this.side}@${this.curSceneIDArr}` //SSE连接用的URL参数
    this.init()
  }

  init() {
    this.db = new IndexDBControl()
    this._sse = new EventSource(this.url)
    this._sse.onopen = () => {
      console.log('Connection to server opened.' + self.curSceneIDArr)
    }

    this._sse.onerror = () => {
      console.log('EventSource failed.' + self.curSceneIDArr)
    }
    this._sse.onmessage = (e) => {
      console.log('msg' + e)
    }
    this._sse.addEventListener('AT', (e) => {
      let AT = JSON.parse(e.data).Data.T
      store.commit('setStartDate', AT)
      // let cameraOptionList = store.state.sceneModule.cameraOptionList
      // if (cameraOptionList[AT]) {
      //   this.audioEvent(cameraOptionList[json.Data.T])
      // }
    })
    this._sse.addEventListener('pathConfig', this.getPathConfig)
    this._sse.addEventListener('state', this.getMessage)
    // this._sse.addEventListener('PA', this.getPA)
    // this._sse.addEventListener('PD', this.getPD)
    this._sse.addEventListener('LogInfo', function (e) {
      // console.log('sse',e);
      let logInfo = JSON.parse(e.data)
      logInfo.time = e.timeStamp
      store.commit('setCzmlEventSourceData', logInfo)
    })
    this._sse.addEventListener('timeOverview', function (e) {
      let json = JSON.parse(e.data)
      console.log(json)

      // 底部阶段性描述数据
      store.commit('settimeOverviewData', json)
    })

    // setInterval(() => {
    //   store.state.sceneModule.redCGFList.push([])
    //   store.state.sceneModule.redCGFList.pop()
    //   store.state.sceneModule.blueCGFList.push([])
    //   store.state.sceneModule.blueCGFList.pop()
    // }, 1000)
  }

  //试听
  audioEvent(item, index) {
    if (!item.flyArr[0].identifyInfo) {
      ElMessage.error('请输入演播内容')
    }
    if (!item.speaker) {
      ElMessage.error('请选择播音员')
    }
    // cameraController.identifyInfoCOnfig(
    //   item.flyArr[0].identifyInfo,
    //   item.flyArr[0].jd,
    //   item.speaker,
    //   item.title
    // )
    store.state.sceneModule.identifyInfo = item.flyArr[0].identifyInfo
    store.state.sceneModule.speaker = item.speaker
    store.state.sceneModule.identifyTitle = item.title
    store.state.sceneModule.phasedDescription.push({
      time: '',
      key: 'suicide attack',
      value: item.flyArr[0].identifyInfo
    })
    store.state.sceneModule.showIdentify = true
  }

  // async getMessage(e) {
  //   let msg = JSON.parse(e.data)
  //   if (!msg.Data.sName) return
  //   if (self.arr.indexOf(msg.Type) < 0) {
  //     self.arr.push(msg.Type)
  //     let params = {
  //       dbName: 'CFG_control', // 数据库名
  //       tableName: msg.Type, // 表名
  //       keyPath: 'sName', // 设置主键 （需要为添加对象内的key，否则新增和获取都会失败）
  //       dataList: [msg.Data]
  //     }
  //     await createTable(params)
  //   }
  //   await addDataToTable('CFG_control', msg.Type, msg.Data)
  // }

  addCGF = (cgf, box) => {
    if (box.length) {
      let isHave1 = false
      let index = -1
      for (let i = 0; i < box.length; i++) {
        if (`${cgf.Side}_${cgf.Type}` == box[i].type) {
          isHave1 = true
          index = i
        }
      }
      if (isHave1) {
        let isHave = false
        for (let j = 0; j < box[index].data.length; j++) {
          const item = box[index].data[j]
          if (cgf.Id == item.Id) {
            isHave = true
          }
        }
        if (!isHave) {
          box[index].data.push(cgf)
        }
      } else {
        let temp = {
          type: `${cgf.Side}_${cgf.Type}`,
          name:
            cgf.LabelName.split('_')[0] == 'red'
              ? cgf.LabelName.split('_')[1] + '_' + cgf.LabelName.split('_')[2]
              : cgf.LabelName.split('_')[0],
          data: [cgf]
        }
        box.push(temp)
      }
    } else {
      let temp = {
        type: `${cgf.Side}_${cgf.Type}`,
        name:
          cgf.LabelName.split('_')[0] == 'red'
            ? cgf.LabelName.split('_')[1] + '_' + cgf.LabelName.split('_')[2]
            : cgf.LabelName.split('_')[0],
        data: [cgf]
      }
      box.push(temp)
    }
  }
  removeCGF = (cgf, box) => {
    if (box.length) {
      for (let i = 0; i < box.length; i++) {
        if (cgf.Type == box[i].type) {
          for (let j = 0; j < box[i].data.length; j++) {
            const item = box[i].data[j]
            if (cgf.Id == item.Id) {
              box[i].data.splice(j, 1)
              if (box[i].data.length == 0) {
                box.splice(i, 1)
              }
            }
          }
        }
      }
    }
  }
  getPA(e) {
    console.log('pa', e)
    let msg = JSON.parse(e.data)
    self.addCGF(msg.Data, self[`${msg.Data.Side}cgfList`])
    if (msg.Data.Side == 'red') {
      store.commit('setRedCGFList', self[`${msg.Data.Side}cgfList`])
    } else {
      store.commit('setBlueCGFList', self[`${msg.Data.Side}cgfList`])
    }
    if (self.callback) {
      self.callback(self)
    }
  }
  getPD(e) {
    let msg = JSON.parse(e.data)
    // self.removeCGF(msg.Data, self[`${msg.Data.Side}cgfList`])
    if (msg.Data.Side == 'red') {
      store.commit('setRedCGFList', self[`${msg.Data.Side}cgfList`])
    } else {
      store.commit('setBlueCGFList', self[`${msg.Data.Side}cgfList`])
    }
    if (msg.Data.Side == 'red') {
      blueData++
    } else {
      redData++
    }
    let temp = {
      type: 'PD',
      redData,
      blueData
    }
    if (self.callback) {
      self.callback(temp)
    }
  }
  getMessage(e) {
    let msg = JSON.parse(e.data)
    // console.log(msg)
    switch (msg.Type) {
      case 'RE_STrackInit':
        break
      case 'RE_STrackDrop':
        break
      case 'RE_LTrackInit':
        break
      case 'RE_LTrackDrop':
        break
      case 'Task_Aign':
        break
      case 'Task_Cancel':
        break
      case 'Task_Completed':
        break
      case 'RE_WeaponF':
        break
      case 'RE_WeaponT':
        break
      case 'Weapon_WH':
        break
      case 'RE_JamA':
        break
      case 'RE_JamT':
        break
      case 'RE_JamE':
        break
      case 'RE_JamS':
        break
      case 'SU':
        break
      case 'Statistics':
        break
      case 'Comment':
        break

      default:
        break
    }
  }
  getPathConfig(e) {
    let msg = JSON.parse(e.data)
    // self.addCGF(msg.Data, self[`${msg.Data.Side}cgfList`])
    let list = `${msg.data.side}List`
    let presence = self.checkKeyExists(self[list], msg.data.type)
    if (presence) {
      let isHave = false
      for (let i = 0; i < self[list][msg.data.type].length; i++) {
        const element = self[list][msg.data.type][i]
        if (element.data.id == msg.data.id) {
          isHave = true
          break
        } else {
          isHave = false
        }
      }
      if (isHave) {
        self[list][msg.data.type].shift()
        self[list][msg.data.type].push(msg)
      } else {
        self[list][msg.data.type].push(msg)
      }
    } else {
      self[list][msg.data.type] = [msg]
    }
    let newTime = new Date().getTime()
    if (self.callback && newTime - time > 2000) {
      time = newTime
      self.callback(self)
    }
  }
  checkKeyExists(obj, key) {
    // 方法1: in 操作符
    const method1 = key in obj
    // 方法2: hasOwnProperty
    const method2 = Object.prototype.hasOwnProperty.call(obj, key)
    // 方法3: Object.hasOwn (ES2022)
    const method3 = Object.hasOwn ? Object.hasOwn(obj, key) : false
    // 方法4: 与 undefined 比较 (不可靠)
    const method4 = obj[key] !== undefined
    // 方法5: Reflect.has
    const method5 = Reflect.has(obj, key)
    // 方法6: Object.keys
    const method6 = Object.keys(obj).includes(key)
    // 打印所有方法结果用于调试
    // console.log(`检测 key: ${key}`)
    // console.log(`方法1 (in): ${method1}`)
    // console.log(`方法2 (hasOwnProperty): ${method2}`)
    // console.log(`方法3 (Object.hasOwn): ${method3}`)
    // console.log(`方法4 (undefined比较): ${method4}`)
    // console.log(`方法5 (Reflect.has): ${method5}`)
    // console.log(`方法6 (Object.keys): ${method6}`)

    // 返回最可靠的检测结果
    return method1 // 使用 hasOwnProperty 作为主要检测方法
  }
}

export default sseLink
