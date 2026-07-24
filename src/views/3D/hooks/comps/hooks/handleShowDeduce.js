import store from '@/store'
import { showWindArea } from './index'

let typewriterInterval = null
let clearTimeoutId = null
let classNameList = ['blink-turbulence', 'blink-flight']
export const handleShowDeduce = (res) => {
  if (res) {
    emitter.on('getDeduce', (deduceLogInfo) => {
      let data = deduceLogInfo
      if (store.getters.getCurrentNode.code != data.platformName) {
        hiddenElement()
        return
      }
      try {
        // 处理对话文本
        const dialogueText = document.getElementById('dialogue-text')
        const dialogueContainer = null // document.getElementById('dialogue-container')
        const pullUpWarning = document.getElementById('pull-up-warning')
        const killNotificationContainer = document.getElementById(
          'kill-notification-container'
        )

        // 清除之前的定时器
        if (typewriterInterval) {
          clearInterval(typewriterInterval)
          typewriterInterval = null
        }
        if (clearTimeoutId) {
          clearTimeout(clearTimeoutId)
          clearTimeoutId = null
        }

        // 显示所有相关容器
        if (dialogueContainer) {
          dialogueContainer.classList.remove('hidden')
        }
        if (pullUpWarning) {
          pullUpWarning.classList.remove('hidden')
        }
        if (killNotificationContainer) {
          killNotificationContainer.classList.remove('hidden')
        }
        // 显示VideoWithNoiseCanvas
        const videoCanvas = document.getElementById('VideoWithNoiseCanvas')
        if (videoCanvas) {
          videoCanvas.classList.remove('hidden')
        }

        if (dialogueText) {
          // 构建显示内容
          let content = ''
          if (data) {
            // 根据数据结构构建显示内容
            if (data.details && data.specificCode) {
              // 添加风场数据
              if (data.specificCode == 'TURBULENCE') {
                let isHave = false
                window.EarthViewer.scene.primitives._primitives.forEach(
                  (item) => {
                    if (item.id === 'wind_Test') {
                      isHave = true
                    }
                  }
                )
                if (!isHave) {
                  showWindArea()
                }
              }

              // 动作类型中英文映射
              const actionTypeMap = {
                FLIGHT: '飞行异常',
                TURBULENCE: '飞机颠簸'
              }
              // 动作类型颜色映射
              const actionTypeColorMap = {
                FLIGHT: '#FF0000', // 红色
                TURBULENCE: '#FF0000' // 红色
              }
              // const actionType =
              //   actionTypeMap[data.Data.motion_analysis.action_type] ||
              //   data.Data.motion_analysis.action_type
              const actionType =
                data.details || data.specificDesc || data.abnormalTypeCName
              content += `动作类型: ${actionType}\n`

              // 更新pull-up-warning显示action_type和颜色
              const pullUpWarning = document.getElementById('pull-up-warning')
              if (pullUpWarning) {
                pullUpWarning.textContent = actionType
                // 设置颜色与actionTypeColorMap对应
                const color = actionTypeColorMap[data.specificCode] || '#00e5ff'
                const colorBorder = '#FF9800'
                pullUpWarning.style.color = color
                pullUpWarning.style.textShadow = `0 0 10px ${color}`
                pullUpWarning.style.borderColor = colorBorder
                pullUpWarning.style.background = `${color}11` // 33是透明度，约20%
                pullUpWarning.style.boxShadow = `0 0 15px ${color}80` // 80是透明度，约50%
              }

              // 为aircraft-icon添加闪烁效果
              const aircraftIcon = document.getElementById('aircraft-icon')
              if (aircraftIcon) {
                // 清除之前的闪烁效果
                aircraftIcon.classList.remove(
                  'blink-turbulence',
                  'blink-flight'
                )

                // 添加当前动作类型的闪烁效果
                const actionTypeClass =
                  'blink-' + data.specificCode.toLowerCase()
                aircraftIcon.classList.add(actionTypeClass)

                // 设置闪烁颜色
                const color = actionTypeColorMap[data.specificCode] || '#00e5ff'
                aircraftIcon.style.setProperty('--blink-color', color)
              }
            }
          }

          // 如果没有具体数据，显示默认信息
          if (!content) {
            content = '收到飞行轨迹预测数据'
          }

          // 显示边框闪烁效果
          if (dialogueContainer) {
            dialogueContainer.classList.add('border-blink')
          }

          // 逐字显示效果
          let index = 0
          dialogueText.innerHTML = ''
          typewriterInterval = setInterval(() => {
            if (index < content.length) {
              dialogueText.innerHTML += content.charAt(index)
              index++
            } else {
              clearInterval(typewriterInterval)
              typewriterInterval = null

              // 10秒后清除其他元素，清除对话文本，停止闪烁
              clearTimeoutId = setTimeout(() => {
                hiddenElement()
              }, 10000)
            }
          }, 30) // 每30毫秒显示一个字符，加快显示速度
        } else {
          // 如果 dialogueText 不存在，直接设置定时器隐藏其他元素，保留dialogue-container
          clearTimeoutId = setTimeout(() => {
            hiddenElement()
          }, 10000)
        }
      } catch (error) {
        console.error('处理飞行轨迹预测数据失败:', error)
      }
    })
  } else {
    emitter.off('getDeduce', () => {
      console.log('关闭getDeduce回调')
      hiddenElement()
    })
  }
}

const hiddenElement = () => {
  const dialogueText = document.getElementById('dialogue-text')
  const dialogueContainer = null // document.getElementById('dialogue-container')
  const pullUpWarning = document.getElementById('pull-up-warning')
  const killNotificationContainer = document.getElementById(
    'kill-notification-container'
  )
  const aircraftIcon = document.getElementById('aircraft-icon')
  const videoCanvas = document.getElementById('VideoWithNoiseCanvas')

  // 清除对话文本
  dialogueText.innerHTML = ''
  // 停止对话框闪烁
  if (dialogueContainer) {
    dialogueContainer.classList.remove('border-blink')
  }
  // 隐藏其他元素
  if (pullUpWarning) {
    pullUpWarning.classList.add('hidden')
  }
  if (killNotificationContainer) {
    killNotificationContainer.classList.add('hidden')
  }
  // 清除aircraft-icon的闪烁效果
  if (aircraftIcon) {
    removeClassName(aircraftIcon, classNameList)
  }
  // 隐藏VideoWithNoiseCanvas
  if (videoCanvas) {
    videoCanvas.classList.add('hidden')
  }
}

const removeClassName = (element, classList) => {
  for (let i = 0; i < classList.length; i++) {
    const className = classList[i]
    element.classList.remove(className)
  }
}
