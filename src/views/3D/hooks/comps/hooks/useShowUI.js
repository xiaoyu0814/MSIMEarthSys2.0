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
  // 复盘状态更新实体信息包括挂件信息
  const updateEntityInfoFP = async () => {
    try {
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
