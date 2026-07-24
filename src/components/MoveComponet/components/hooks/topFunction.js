import {
  toAltitude,
  updateSpeed,
  changeState,
  turnOnWeapon,
  changeInfraredState,
  getPlateSWMessageV2
} from '@/service/command'
import { ElMessage } from 'element-plus'
import { sendToCommandShowResMsg } from '@/utils/mapTools'
import Bubble3 from '@/utils/bubble/dataBubble3'
import { useStore } from 'vuex'

export default function () {
  const store = useStore()

  /**
   * 变更平台高度
   * @param {*} alt 目标高度
   * @param {*} height 源高度
   * @param {*} sourceName 目标实体id
   */
  const toAltitudeFun = (alt, height, sourceName) => {
    // 变更平台高度接口
    let params = {
      alt: Number(alt),
      pltName: sourceName
    }
    toAltitude(params).then((res) => {
      // console.log(res)
      beautyToast.success({
        title: '导调指令',
        message: '变更平台高度指令已发出!',
        darkTheme: true
      })

      if (res.code == 200) {
        sendToCommandShowResMsg(res.data, '修改高度指令完成', sourceName)
        if (window['curDivPoint_commContr_' + sourceName]) {
          window['curDivPoint_commContr_' + sourceName].closeEvent()
          window['curDivPoint_commContr_' + sourceName] = null
        }
        let infors = store.state.sceneModule.currentFlyType
        let titleName = Object.keys(infors).length > 0 ? infors.name : ''
        let moreAndLess = ''
        if (Number(alt) > Number(height)) {
          moreAndLess = 'more'
        } else {
          moreAndLess = 'less'
        }
        new Bubble3({
          moreAndLess: moreAndLess,
          content: [
            { name: '名称', value: titleName },
            { name: '原始', value: Number(height) },
            { name: '目标', value: Number(alt) },
            { name: '变更', value: height }
          ],
          viewer: window.EarthViewer,
          Cesium: window.MSIMEarth,
          id: sourceName,
          name: sourceName,
          title: '变更平台高度指令',
          offsetY: 100,
          distanceDisplayCondition: [100, 5000000],
          div: 'style'
        })

        setTimeout(() => {
          tempEntityDel()
        }, 1500)
      }
    })
  }

  /**
   * 改变速度
   * @param {*} sourceName 目标实体id
   * @param {*} changeSpeed 变更速度
   * @param {*} originalSpeed 原始速度
   */
  const updateSpeedFun = (sourceName, changeSpeed, originalSpeed) => {
    let params = {
      pltName: sourceName, // 当前平台
      value: Number(changeSpeed) // 值 变更速度
    }
    updateSpeed(params).then((res) => {
      // console.log(res)
      beautyToast.success({
        title: '导调指令',
        message: '改变速度指令已发出!',
        darkTheme: true
      })

      if (res.code == 200) {
        sendToCommandShowResMsg(res.data, '改变速度指令完成', sourceName)
        if (window['curDivPoint_commContr_' + sourceName]) {
          window['curDivPoint_commContr_' + sourceName].closeEvent()
          window['curDivPoint_commContr_' + sourceName] = null
        }
        let infors = store.state.sceneModule.currentFlyType
        let titleName = Object.keys(infors).length > 0 ? infors.name : ''
        let moreAndLess = ''
        if (Number(changeSpeed) > Number(originalSpeed)) {
          moreAndLess = 'more'
        } else {
          moreAndLess = 'less'
        }
        new Bubble3({
          moreAndLess: moreAndLess,
          content: [
            { name: '名称', value: titleName },
            { name: '原始', value: Number(originalSpeed) }, //原始速度
            { name: '目标', value: Number(changeSpeed) }, // 变更速度
            { name: '变更', value: Number(originalSpeed) } //原始速度
          ],
          viewer: window.EarthViewer,
          Cesium: window.MSIMEarth,
          id: sourceName,
          name: sourceName, //datasource
          title: '变更平台速度指令',
          offsetY: 100,
          distanceDisplayCondition: [100, 5000000],
          div: 'style'
        })

        setTimeout(() => {
          tempEntityDel()
        }, 1500)
      }
    })
  }

  /**
   * 变更雷达工作状态 -- 变更平台传感器状态
   * @param {*} sourceName 目标实体id
   * @param {*} stateValue 状态值  0-关闭  1-开启
   */
  const toChangeStateFun = (sourceName, stateValue) => {
    // 变更平台传感器状态指令接口
    let params = {
      pltName: sourceName,
      value: Number(stateValue)
    }
    changeState(params).then((res) => {
      beautyToast.success({
        title: '导调指令',
        message: '变更平台传感器状态指令已发出!',
        darkTheme: true
      })

      if (res.code == 200) {
        if (stateValue == 0) {
          //关闭
          //变更传感器状态存储
          let list = JSON.parse(localStorage.getItem('currentFlyType'))
          list.push(store.state.sceneModule.currentFlyType)
          localStorage.setItem('currentFlyType', JSON.stringify(list))
          removeEntityCircleById(
            'entitySensor' + store.getters.getCurrentNode.code
          )
        } else if (stateValue == 1) {
          //开启
          //开启后，将变更传感器状态存储数据删除，显示线路
          let list = JSON.parse(localStorage.getItem('currentFlyType'))
          for (let i = 0; i < list.length; i++) {
            if (
              list[i].name.indexOf(
                store.state.sceneModule.currentFlyType.name
              ) != -1
            ) {
              list.splice(i, 1)
            }
          }
          // list.filter(
          //   (item) => store.state.sceneModule.currentFlyType.name.indexOf(item.name) != -1
          // )
          localStorage.setItem('currentFlyType', JSON.stringify(list))
        }
        // 不清除数据哪里来
        // store.commit('setSensorStatusList', state.SensorStatusList)
        sendToCommandShowResMsg(
          res.data,
          '变更平台传感器状态指令完成',
          sourceName
        )
      }
    })
  }

  /**
   * 变更干扰机工作状态  -- 变更平台干扰状态
   * @param {*} sourceName 目标实体id
   * @param {*} turnIsOpenStateValue 状态值  0-关闭  1-开启
   */
  const toFireTurnOnWeaponFun = (sourceName, turnIsOpenStateValue) => {
    // 变更平台干扰状态指令接口
    let params = {
      pltName: sourceName,
      value: Number(turnIsOpenStateValue)
    }
    let message = `${sourceName}干扰开启`
    if (turnIsOpenStateValue === '0') {
      message = `${sourceName}干扰停止`
    }
    turnOnWeapon(params).then((res) => {
      beautyToast.success({
        title: '导调指令',
        message: '变更平台干扰状态指令已发出!',
        darkTheme: true
      })

      if (res.code == 200) {
        sendToCommandShowResMsg(res.data, message, sourceName)
        // 如果开启成功则把该平台干扰状态更新到集合当中
        EarthAPP.grjh.forEach((e) => {
          if (e.name === sourceName) {
            if (turnIsOpenStateValue === '1') {
              e.state = true
            } else {
              e.state = false
            }
          }
        })
      }
    })
  }

  /**
   * 变更烟雾干扰装置状态
   * @param {*} sourceName 目标实体id
   * @param {*} infraredStateValue 状态值 default-关闭 smoke-开启
   */
  const changeInfraredStateFun = (sourceName, infraredStateValue) => {
    // 变更烟雾干扰装置状态指令接口
    let params = {
      pltName: sourceName,
      value: infraredStateValue
    }
    changeInfraredState(params).then((res) => {
      beautyToast.success({
        title: '导调指令',
        message: '变更烟雾干扰装置状态指令已发出!',
        darkTheme: true
      })

      if (res.code == 200) {
        sendToCommandShowResMsg(
          res.data,
          '变更烟雾干扰装置状态指令完成',
          sourceName
        )
      }
    })
  }

  const removeEntityCircleById = (id) => {
    if (window.EarthViewer.entities.getById(id)) {
      window.EarthViewer.entities.removeById(id)
    }
  }

  const tempEntityDel = () => {
    // 删除连线以及鼠标提示信息
    for (let i = window.EarthViewer.entities.values.length - 1; i >= 0; i--) {
      let entity = window.EarthViewer.entities.values[i]
      if (entity && entity.name && entity.name.indexOf('点闪烁') > -1) {
        window.EarthViewer.entities.remove(entity) //移除
      }
    }
  }

  // 获取 飞机搭载的传感器属性信息
  let getSensors = async () => {
    let airplaneActionSensors = []
    let params = { name: store.state.sceneModule.currentFlyType.entityId }
    let res = await getPlateSWMessageV2(params)

    if (res.code == 200) {
      let sensorsArr = res.data && res.data['sensors']
      airplaneActionSensors =
        sensorsArr && sensorsArr.length > 0 ? sensorsArr : []
    }
    return airplaneActionSensors
  }

  // 获取 飞机挂载武器属性信息
  let getWeapons = async () => {
    let airplaneActionWeaponsData = []
    let params = { name: store.state.sceneModule.currentFlyType.entityId }

    store.commit('setSensorShow', {})
    let res = await getPlateSWMessageV2(params)
    store.commit('setSensorShow', res)
    if (res.code == 200) {
      let weaponsArr = res.data && res.data['weapons']
      airplaneActionWeaponsData =
        weaponsArr && weaponsArr.length > 0 ? weaponsArr : []
    }
    return airplaneActionWeaponsData
  }

  // 获取 飞机搭载的 烟雾干扰装置 状态
  let getInfraredSign = async () => {
    let params = { name: store.state.sceneModule.currentFlyType.entityId }
    let res = await getPlateSWMessageV2(params)
    let infraredSignStr = ''
    if (res.code == 200) {
      infraredSignStr = res.data && res.data['infraredSign']
    }
    return infraredSignStr
  }

  return {
    toAltitudeFun,
    updateSpeedFun,
    getWeapons,
    getSensors,
    getInfraredSign,
    toChangeStateFun,
    toFireTurnOnWeaponFun,
    changeInfraredStateFun
  }
}
