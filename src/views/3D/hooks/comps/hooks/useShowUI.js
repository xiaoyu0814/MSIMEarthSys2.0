/*
 * @Author: chenguopeng2 chenguopeng.piesat.cn
 * @Date: 2026-07-14 13:56:36
 * @LastEditors: chenguopeng2 chenguopeng.piesat.cn
 * @LastEditTime: 2026-08-06 09:30:19
 * @FilePath: \MSIMEarthSystem\src\views\3D\hooks\comps\hooks\useShowUI.js
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
 */
import store from '@/store'
import { getEntityInfo, getEntityParts } from '../../initConfig/HUD.js'

const getVisibleSensors = (parts = []) => {
  return parts.filter((item) => {
    return (
      item.PartType === 'SENSOR' &&
      item.Name &&
      item.Name[0] !== '_' &&
      item.Name !== 'rwr'
    )
  })
}

export const useShowUI = ({ entityInfo, sensorList }) => {
  let uiUpdateInterval = null

  const clearUIUpdateInterval = () => {
    if (uiUpdateInterval) {
      clearInterval(uiUpdateInterval)
      uiUpdateInterval = null
    }
  }

  // 更新实体信息包括挂件信息
  const updateEntityInfo = async () => {
    try {
      const currentNodeCode = store.getters.getCurrentNode.code
      const info = await getEntityInfo(currentNodeCode)
      const parts = await getEntityParts(currentNodeCode)
      console.log('updateEntityInfo', info);
      if (Array.isArray(parts)) {
        sensorList.value = getVisibleSensors(parts)
      }
      
      if (info) {
        Object.keys(info).forEach((key) => {
          if (Object.prototype.hasOwnProperty.call(entityInfo.value, key)) {
            entityInfo.value[key] = info[key]
          }
        })
      }
    } catch (error) {
      console.error('获取实体信息失败:', error)
    }
  }
  // 复盘状态更新实体信息包括挂件信息 - 第三视角
  const updateEntityInfoFP = async () => {
    try {
      const currentNodeCode = store.getters.getCurrentNode.code
      let muData = store.state.AFSIMModule.muData[currentNodeCode]
      entityInfo.value.Altitude = muData.Alt
      const totalSpeed = Math.hypot(muData?.SpeedNED0 || 0, muData?.SpeedNED1 || 0, muData?.SpeedNED2 || 0);
      entityInfo.value.Speed = totalSpeed
    } catch (error) {
      console.error('获取实体信息失败:', error)
    }
  }

  const handleShowUI = (res) => {
    const uiContainer = document.getElementById('uiContainer')

    if (res) {
      if (uiContainer) {
        uiContainer.classList.remove('hidden')
      }

      clearUIUpdateInterval()
      if (store.state.AFSIMModule.fp) {
        updateEntityInfoFP()
        uiUpdateInterval = setInterval(updateEntityInfoFP, 1000)
      } else {
        updateEntityInfo()
        uiUpdateInterval = setInterval(updateEntityInfo, 1000)
      }

      return
    }

    if (uiContainer) {
      uiContainer.classList.add('hidden')
    }
    clearUIUpdateInterval()
  }

  return {
    handleShowUI,
    clearUIUpdateInterval
  }
}
