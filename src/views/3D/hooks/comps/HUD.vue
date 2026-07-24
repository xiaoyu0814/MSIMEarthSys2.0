<template>
  <div id="uiContainer" class="hidden">
    <div id="compass-container">
      <div id="compass-center-marker"></div>
      <div id="compass-tape"></div>
    </div>
    <!-- <div id="heading-display">
      {{ entityInfo.Heading.toFixed(0).padStart(3, '0') }}
    </div> -->

    <!-- <div id="hud-top-left">
      TIME <span id="time">00:00:00</span><br />
      SCORE <span id="score">000000</span>
    </div> -->

    <!-- <div id="hud-top-right">
      FPS <span id="fps">60</span><br />
      <span id="local-datetime">01 JAN 26 | 00:00:00</span>
    </div> -->

    <div id="hud-speed-box">
      <div class="label">速度</div>
      <div class="value-box">
        <span id="speed">{{
          (Number(entityInfo.Speed) * 3.6).toFixed(2)
        }}</span>
      </div>
    </div>

    <div id="hud-alt-box">
      <div class="label">高度</div>
      <div class="value-box">
        <span id="altitude">{{ entityInfo.Altitude.toFixed(2) }}</span>
      </div>
    </div>

    <!-- <div id="coords">
      {{ entityInfo.Latitude.toFixed(4) }},
      {{ entityInfo.Longitude.toFixed(4) }}
    </div> -->

    <div id="region-notification" class="hidden">
      <div class="region-label">当前平台</div>
      <div id="region-name">{{ store.getters.getCurrentNode.code }}</div>
    </div>

    <div id="pull-up-warning" class="hidden">爬升</div>

    <!-- <div id="kill-notification-container" class="hidden">
      <div id="kill-text">正在收到强风影响</div>
      <div id="kill-score">即将进入强风区域请躲避</div>
    </div> -->

    <div id="weapons-hud">
      <div id="aircraft-icon">
        <img src="/static/image/wrj.svg" alt="WRJ Icon" />
        <div id="aircraft-label">{{ store.getters.getCurrentNode.code }}</div>
      </div>
      <!-- <div id="weapon-list">
        <div class="weapon-item active" id="weapon-gun">
          <div class="weapon-progress"></div>
          <span class="weapon-name">PL15</span>
          <span class="weapon-ammo">1</span>
        </div>
        <div class="weapon-item" id="weapon-missile">
          <div class="weapon-progress"></div>
          <span class="weapon-name">PL12</span>
          <span class="weapon-ammo">1</span>
        </div>
        <div class="weapon-item" id="weapon-flare">
          <div class="weapon-progress"></div>
          <span class="weapon-name">PL13</span>
          <span class="weapon-ammo">1</span>
        </div>
      </div> -->
      <div id="sensor-list">
        <template v-for="(sensor, index) in sensorList" :key="sensor.Name">
          <div
            class="sensor-item"
            :class="{ active: sensor.On }"
            :id="'sensor-' + sensor.Name.toLowerCase()"
          >
            <div class="sensor-progress"></div>
            <span class="sensor-name">{{ sensor.Name }}</span>
            <span class="sensor-status">{{ sensor.On ? '开启' : '关闭' }}</span>
          </div>
        </template>
        <template v-if="sensorList.length < 3">
          <div
            class="sensor-item"
            v-for="i in 3 - sensorList.length"
            :key="'empty-' + i"
          >
            <div class="sensor-progress"></div>
            <span class="sensor-name"></span>
            <span class="sensor-status"></span>
          </div>
        </template>
      </div>
    </div>

    <!-- <div id="minimap-container">
      <div id="minimapCesium"></div>
      <canvas id="minimap"></canvas>
    </div> -->
    <!-- class="hidden" -->
    <div id="dialogue-container" class="hidden">
      <div class="dialogue-box">
        <img
          id="commander-img"
          src="/static/image/commander.png"
          alt="Commander"
        />
        <div class="dialogue-content">
          <div class="commander-name">智能体辅助决策信息</div>
          <div id="dialogue-text"></div>
          <!-- <div class="dialogue-hint">Press Z to skip</div> -->
        </div>
      </div>
    </div>
    <!-- <canvas
      style="
        position: absolute;
        left: 30px;
        bottom: 30px;
        border: 1px solid #00e5ff;
        z-index: 1000;
        transform: scale(1.5);
        transform-origin: bottom left;
        background: rgba(0, 40, 0, 0.4);
        box-shadow: 0 0 22.5px rgba(0, 229, 255, 0.25);
      "
      id="VideoWithNoiseCanvas"
      class="hidden"
    ></canvas> -->
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted } from 'vue'
import store from '@/store'
import emitter from '@/utils/eventbus'
// import { showWindArea } from './hooks/index.js'
import { handleShowDeduce } from './hooks/handleShowDeduce.js'
import { useShowUI } from './hooks/useShowUI.js'
export default {
  name: 'HUD',
  setup() {
    // 响应式实体信息
    let entityInfo = ref({
      Altitude: 0,
      DamageFactor: 0,
      FireRadius: 0,
      Fuel: 0,
      FuelCapacity: 0,
      FuelConsumptionRate: 0,
      Heading: 0,
      Index: 0,
      Latitude: 0,
      Longitude: 0,
      Mach: 0,
      Pitch: 0,
      Roll: 0,
      Side: '',
      SpatialDomain: '',
      Speed: 0,
      Type: ''
    })

    // 传感器列表
    let sensorList = ref([])

    const { handleShowUI, clearUIUpdateInterval } = useShowUI({
      entityInfo,
      sensorList
    })
    // 逐字显示相关变量
    let typewriterInterval = null
    let clearTimeoutId = null
    // 区域通知相关变量
    let regionNotificationTimeoutId = null

    // 监听 FLIGHT_TRAJECTORY_PREDICTION_ADVANCED 事件
    const handleFlightTrajectoryPrediction = (data) => {
      console.log('FLIGHT_TRAJECTORY_PREDICTION_ADVANCED', data)
      // 由于当前气象数据尚未完全匹配，所在范围暂时固定为120.12-120.48，24.05-24.20
      // showWindArea(data)
      try {
        // 处理对话文本
        const dialogueText = document.getElementById('dialogue-text')
        const dialogueContainer = document.getElementById('dialogue-container')
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
            if (
              data.Data &&
              data.Data.motion_analysis &&
              data.Data.motion_analysis.action_type
            ) {
              // 动作类型中英文映射
              const actionTypeMap = {
                HOVERING: '悬停',
                ASCENDING: '爬升',
                DESCENDING: '下降',
                FORWARD: '前进',
                BACKWARD: '后退',
                LEFT: '前方有障碍物',
                RIGHT: '前方有大风速区域，会对飞行造成影响',
                INTERFERING: '干扰', // 干扰
                //探测目标
                DETECTING: '探测到蓝方地面目标',
                // 颠簸动作
                BUMPING: '即将进入颠簸区域',
                // 积冰动作
                ICING: '即将进入积冰区域'
              }
              // 动作类型颜色映射
              const actionTypeColorMap = {
                HOVERING: '#4CAF50', // 绿色
                ASCENDING: '#2196F3', // 蓝色
                DESCENDING: '#FF9800', // 橙色
                FORWARD: '#9C27B0', // 紫色
                BACKWARD: '#607D8B', // 蓝灰色
                LEFT: '#FFFFFF', // 粉色
                RIGHT: '#FFFFFF', // 棕色
                INTERFERING: '#FF5722', // 棕色
                //探测目标
                DETECTING: '#00e5ff', // 蓝色
                // 颠簸动作
                BUMPING: '#FFFFFF', // 橙色
                // 积冰动作
                ICING: '#FFFFFF' // 棕色
              }
              const actionType =
                actionTypeMap[data.Data.motion_analysis.action_type] ||
                data.Data.motion_analysis.action_type
              content += `动作类型: ${actionType}\n`

              // 更新pull-up-warning显示action_type和颜色
              const pullUpWarning = document.getElementById('pull-up-warning')
              if (pullUpWarning) {
                pullUpWarning.textContent = actionType
                // 设置颜色与actionTypeColorMap对应
                const color =
                  actionTypeColorMap[data.Data.motion_analysis.action_type] ||
                  '#00e5ff'
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
                  'blink-hovering',
                  'blink-ascending',
                  'blink-descending',
                  'blink-forward',
                  'blink-backward',
                  'blink-left',
                  'blink-right',
                  'blink-interfering'
                )

                // 添加当前动作类型的闪烁效果
                const actionTypeClass =
                  'blink-' + data.Data.motion_analysis.action_type.toLowerCase()
                aircraftIcon.classList.add(actionTypeClass)

                // 设置闪烁颜色
                const color =
                  actionTypeColorMap[data.Data.motion_analysis.action_type] ||
                  '#00e5ff'
                aircraftIcon.style.setProperty('--blink-color', color)
              }
            }

            // 更新kill-score显示warning_detail
            if (data.warning_detail) {
              const killScore = document.getElementById('kill-score')
              if (killScore) {
                killScore.textContent = data.warning_detail
              }
            }
            if (data.Data.motion_analysis.predicted_heading_deg !== undefined) {
              content += `预测航向: ${data.Data.motion_analysis.predicted_heading_deg}°\n`
            }
            if (data.Data.motion_analysis.pitch_angle_deg !== undefined) {
              content += `俯仰角: ${data.Data.motion_analysis.pitch_angle_deg}°\n`
            }
            if (data.Data.motion_analysis.horizontal_distance_m !== undefined) {
              content += `水平距离: ${data.Data.motion_analysis.horizontal_distance_m}米\n`
            }
            if (data.Data.motion_analysis.vertical_distance_m !== undefined) {
              content += `垂直距离: ${data.Data.motion_analysis.vertical_distance_m}米\n`
            }
            if (
              data.Data.motion_analysis.total_prediction_time_s !== undefined
            ) {
              content += `总预测时间: ${data.Data.motion_analysis.total_prediction_time_s}秒\n`
            }
            if (data.Data.motion_analysis.predictedPath) {
              content += `预测路径点数量: ${data.Data.motion_analysis.predictedPath.length}\n`
            }
            if (data.Data.motion_analysis.estimatedTimeOfArrival) {
              content += `预计到达时间: ${data.Data.motion_analysis.estimatedTimeOfArrival}\n`
            }
            if (data.Data.motion_analysis.fuelRemaining) {
              content += `剩余燃料: ${data.Data.motion_analysis.fuelRemaining}\n`
            }
            if (data.Data.motion_analysis.waypoints) {
              content += `航点数量: ${data.Data.motion_analysis.waypoints.length}\n`
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
                const aircraftIcon = document.getElementById('aircraft-icon')
                if (aircraftIcon) {
                  aircraftIcon.classList.remove(
                    'blink-hovering',
                    'blink-ascending',
                    'blink-descending',
                    'blink-forward',
                    'blink-backward',
                    'blink-left',
                    'blink-right',
                    'blink-interfering'
                  )
                }
                // 隐藏VideoWithNoiseCanvas
                const videoCanvas = document.getElementById(
                  'VideoWithNoiseCanvas'
                )
                if (videoCanvas) {
                  videoCanvas.classList.add('hidden')
                }
              }, 10000)
            }
          }, 30) // 每30毫秒显示一个字符，加快显示速度
        } else {
          // 如果 dialogueText 不存在，直接设置定时器隐藏其他元素，保留dialogue-container
          clearTimeoutId = setTimeout(() => {
            if (pullUpWarning) {
              pullUpWarning.classList.add('hidden')
            }
            if (killNotificationContainer) {
              killNotificationContainer.classList.add('hidden')
            }
            // 清除aircraft-icon的闪烁效果
            const aircraftIcon = document.getElementById('aircraft-icon')
            if (aircraftIcon) {
              aircraftIcon.classList.remove(
                'blink-hovering',
                'blink-ascending',
                'blink-descending',
                'blink-forward',
                'blink-backward',
                'blink-left',
                'blink-right'
              )
            }
            // 隐藏VideoWithNoiseCanvas
            const videoCanvas = document.getElementById('VideoWithNoiseCanvas')
            if (videoCanvas) {
              videoCanvas.classList.add('hidden')
            }
          }, 10000)
        }
      } catch (error) {
        console.error('处理飞行轨迹预测数据失败:', error)
      }
      let startPoint = data.Data.motion_analysis.start_position_geo
      let endPoint = data.Data.motion_analysis.end_position_geo
      let lines = [
        startPoint.longitude,
        startPoint.latitude,
        startPoint.altitude,
        endPoint.longitude,
        endPoint.latitude,
        endPoint.altitude
      ]
      window.EarthViewer.entities.removeById('yuceluxian')
      window.EarthViewer.entities.add({
        id: 'yuceluxian',
        polyline: {
          positions: window.MSIMEarth.Cartesian3.fromDegreesArrayHeights(lines),
          width: 20,
          arcType: window.MSIMEarth.ArcType.NONE,
          material: new window.MSIMEarth.PolylineArrowMaterialProperty(
            window.MSIMEarth.Color.PURPLE
          )
        }
      })
    }

    // 监听视角变化，第三视角时显示当前选中的实体名称
    const handleViewModeChange = (isThirdPerson) => {
      try {
        const regionNotification = document.getElementById(
          'region-notification'
        )

        if (regionNotification) {
          if (isThirdPerson) {
            // 重置样式和动画
            regionNotification.classList.remove('hidden', 'region-exit')
            regionNotification.style.animation = 'none'
            regionNotification.offsetHeight // 触发重排

            // 添加由下到上飞入效果
            regionNotification.style.animation =
              'region-fly-in 0.5s ease-out forwards'
          } else {
            // 非第三视角时隐藏通知
            regionNotification.classList.add('region-exit')
            setTimeout(() => {
              regionNotification.classList.add('hidden')
            }, 500)
          }
        }
      } catch (error) {
        console.error('处理视角变化失败:', error)
      }
    }

    onMounted(() => {
      // 注册事件监听器
      emitter.on('showUI', handleShowUI)
      emitter.on(
        'FLIGHT_TRAJECTORY_PREDICTION_ADVANCED',
        handleFlightTrajectoryPrediction
      )
      emitter.on('viewModeChange', handleViewModeChange)
      emitter.on('showDeduce', handleShowDeduce)
    })

    onUnmounted(() => {
      // 清除事件监听器
      emitter.off('showUI', handleShowUI)
      emitter.off(
        'FLIGHT_TRAJECTORY_PREDICTION_ADVANCED',
        handleFlightTrajectoryPrediction
      )
      emitter.off('viewModeChange', handleViewModeChange)
      emitter.off('showDeduce', handleShowDeduce)

      // 清除定时器
      clearUIUpdateInterval()
      if (typewriterInterval) {
        clearInterval(typewriterInterval)
        typewriterInterval = null
      }
      if (clearTimeoutId) {
        clearTimeout(clearTimeoutId)
        clearTimeoutId = null
      }
      if (regionNotificationTimeoutId) {
        clearTimeout(regionNotificationTimeoutId)
        regionNotificationTimeoutId = null
      }
    })

    return { entityInfo, sensorList, store }
  }
}
</script>

<style lang="less" scoped>
#uiContainer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  color: #00e5ff;
  pointer-events: none;
  box-sizing: border-box;
  padding: 30px;
  z-index: 10;
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.6);
}

#uiContainer.hidden {
  display: block !important;
  visibility: hidden !important;
  pointer-events: none !important;
}

#hud-top-left {
  position: absolute;
  top: 30px;
  left: 30px;
  font-size: 20px;
}

#hud-top-right {
  position: absolute;
  top: 30px;
  right: 30px;
  font-size: 20px;
  text-align: right;
}

#hud-speed-box {
  position: absolute;
  top: 49%;
  left: 30%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  filter: drop-shadow(0 0 10px rgba(0, 229, 255, 0.5));
}

#hud-alt-box {
  position: absolute;
  top: 49%;
  right: 30%;
  transform: translateY(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  filter: drop-shadow(0 0 10px rgba(0, 229, 255, 0.5));
}

.value-box {
  margin-top: 5px;
  min-width: 100px;
  text-align: center;
  background: rgba(0, 40, 0, 0.25);
  position: relative;
  box-shadow: none;
}

.value-box::before {
  content: '';
  position: absolute;
  inset: 0;
  background: #00e5ff;
  pointer-events: none;
}

.value-box span {
  display: flex;
  align-items: center;
  justify-content: center;
  background: transparent;
  padding: 5px 15px;
  font-size: 24px;
  box-sizing: border-box;
  min-height: 40px;
  position: relative;
  z-index: 2;
}

#hud-speed-box .value-box {
  clip-path: polygon(
    0% 0%,
    calc(100% - 20px) 0%,
    100% 50%,
    calc(100% - 20px) 100%,
    0% 100%
  );
}

#hud-speed-box .value-box::before {
  clip-path: polygon(
    evenodd,
    0% 0%,
    calc(100% - 20px) 0%,
    100% 50%,
    calc(100% - 20px) 100%,
    0% 100%,
    0% 0%,
    2px 2px,
    2px calc(100% - 2px),
    calc(100% - 20.8px) calc(100% - 2px),
    calc(100% - 2.8px) 50%,
    calc(100% - 20.8px) 2px,
    2px 2px
  );
}

#hud-speed-box span {
  padding-right: 30px;
}

#hud-alt-box .value-box {
  clip-path: polygon(20px 0%, 100% 0%, 100% 100%, 20px 100%, 0% 50%);
  min-width: 120px;
}

#hud-alt-box .value-box::before {
  clip-path: polygon(
    evenodd,
    20px 0%,
    100% 0%,
    100% 100%,
    20px 100%,
    0% 50%,
    20px 0%,
    20.8px 2px,
    2.8px 50%,
    20.8px calc(100% - 2px),
    calc(100% - 2px) calc(100% - 2px),
    calc(100% - 2px) 2px,
    20.8px 2px
  );
}

#hud-alt-box span {
  padding-left: 30px;
}

#minimap-container {
  position: absolute;
  bottom: 30px;
  left: 30px;
  width: 250px;
  height: 250px;
  border: 1px solid #00e5ff;
  background: rgba(0, 40, 0, 0.3);
  overflow: hidden;
  box-sizing: border-box;
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.25);
}

#coords {
  position: absolute;
  bottom: 280px;
  left: 30px;
  width: 250px;
  font-size: 13px;
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.6);
  background: rgba(0, 40, 0, 0.5);
  border: 1px solid #00e5ff;
  border-bottom: none;
  box-sizing: border-box;
  padding: 4px;
  text-align: center;
  letter-spacing: 1px;
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.25);
}

#compass-container {
  position: absolute;
  top: 120px;
  left: 50%;
  transform: translateX(-50%);
  width: 320px;
  height: 40px;
  border-bottom: 2px solid rgba(0, 229, 255, 0.8);
  box-shadow: 0 5px 15px -5px rgba(0, 229, 255, 0.4);
  overflow: hidden;
  pointer-events: none;
  display: flex;
  mask-image: linear-gradient(
    to right,
    transparent,
    black 25%,
    black 75%,
    transparent
  );
  -webkit-mask-image: linear-gradient(
    to right,
    transparent,
    black 25%,
    black 75%,
    transparent
  );
}

#compass-tape {
  position: absolute;
  display: flex;
  height: 100%;
  align-items: flex-end;
  font-size: 12px;
  color: #00e5ff;
  will-change: transform;
  width: 4320px;
}

.compass-tick {
  position: absolute;
  bottom: 0;
  width: 2px;
  background: #00e5ff;
  box-shadow: 0 0 5px rgba(0, 229, 255, 0.8);
}

.compass-label {
  position: absolute;
  bottom: 12px;
  width: 40px;
  margin-left: -20px;
  text-align: center;
  font-size: 11px;
}

#compass-center-marker {
  position: absolute;
  top: 100;
  left: 50%;
  transform: translateX(-50%);
  width: 3px;
  height: 100%;
  background: #00e5ff;
  z-index: 10;
  box-shadow: 0 0 10px #00e5ff;
}

#heading-display {
  position: absolute;
  top: 165px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 18px;
  color: #00e5ff;
  text-shadow: 0 0 10px #00e5ff;
  background: rgba(0, 40, 0, 0.25);
  padding: 2px 8px;
  border: 1px solid rgba(0, 229, 255, 0.3);
  min-width: 60px;
  text-align: center;
}

#minimapCesium {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0.8;
  pointer-events: none;
  filter: brightness(0.9) contrast(1.2);
}

#minimap {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  pointer-events: none;
}

#dialogue-container {
  position: absolute;
  top: 120px;
  left: 15%;
  transform: translateX(-50%);
  min-width: 600px;
  max-width: 800px;
  background: rgba(0, 40, 0, 0.7);
  border: 1px solid #00e5ff;
  box-shadow: 0 0 20px rgba(0, 229, 255, 0.3),
    inset 0 0 10px rgba(0, 229, 255, 0.2);
  padding: 20px;
  transition: opacity 0.5s ease, transform 0.3s ease;
  z-index: 100;
  border-radius: 8px;
}

#dialogue-container.hidden {
  opacity: 0;
  pointer-events: none;
  transform: translateX(-50%) translateY(-20px);
}

.dialogue-box {
  display: flex;
  gap: 20px;
  align-items: flex-start;
}

#commander-img {
  width: 100px;
  height: 100px;
  border: 1px solid #00e5ff;
  object-fit: cover;
  filter: grayscale(1) contrast(1.2) brightness(0.8) sepia(1) hue-rotate(80deg)
    saturate(3);
  box-shadow: 0 0 10px rgba(0, 229, 255, 0.5);
  border-radius: 50%;
  flex-shrink: 0;
}

.dialogue-content {
  flex: 1;
  min-width: 0;
}

.commander-name {
  font-size: 28px;
  color: #00e5ff;
  margin-bottom: 15px;
  font-weight: bold;
  text-shadow: 0 0 5px rgba(0, 229, 255, 0.8);
}

#dialogue-text {
  font-size: 20px;
  color: #fff;
  line-height: 1.6;
  text-shadow: 0 0 5px rgba(0, 229, 255, 0.5);
  min-height: 60px;
  white-space: pre-wrap;
  word-wrap: break-word;
}

.dialogue-hint {
  font-size: 11px;
  color: #00e5ff;
  margin-top: 10px;
  opacity: 0.6;
  font-weight: normal;
  animation: blink 2s infinite;
}

#region-notification {
  position: absolute;
  top: 10%;
  right: 20%;
  transform: translate(-50%, -50%);
  text-align: center;
  z-index: 100;
  animation: region-in 1s ease-out forwards;
}

#region-notification .region-label {
  font-size: 20px;
  color: rgba(0, 229, 255, 0.7);
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.6);
  margin-bottom: 5px;
}

#region-name {
  font-size: 32px;
  color: #00e5ff;
  text-shadow: 0 0 8px rgba(0, 229, 255, 0.6);
}

#pull-up-warning {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 24px;
  color: #f00;
  text-shadow: 0 0 10px #f00;
  z-index: 200;
  border: 2px solid #f00;
  padding: 10px 20px;
  background: rgba(255, 0, 0, 0.1);
  box-shadow: 0 0 15px rgba(255, 0, 0, 0.3);
  animation: pull-up-blink 0.4s infinite alternate;
  pointer-events: none;
}

#kill-notification-container {
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  color: #00e5ff;
  text-shadow: 0 0 10px rgba(0, 229, 255, 0.8), 0 0 20px rgba(0, 0, 0, 0.5);
  pointer-events: none;
  animation: kill-pop 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275);
  z-index: 15;
}

#pull-up-warning.hidden,
#kill-notification-container.hidden {
  display: none !important;
  visibility: hidden !important;
  pointer-events: none !important;
}

#kill-text {
  font-size: 24px;
  margin-bottom: 5px;
  color: rgb(0, 225, 255);
}

#kill-score {
  font-size: 32px;
  font-weight: bold;
  color: rgb(0, 225, 255);
}

#weapons-hud {
  position: absolute;
  bottom: 30px;
  // right: 30px;
  left: 30px;
  display: flex;
  align-items: stretch;
  pointer-events: none;
  gap: 15px;
  // transform: scale(1.5);
  transform-origin: bottom right;
}

#weapon-list {
  display: flex;
  flex-direction: column;
  gap: 7.5px;
}

#sensor-list {
  display: flex;
  flex-direction: column;
  gap: 7.5px;
}

.weapon-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 150px;
  padding: 7.5px 15px;
  background: rgba(0, 40, 0, 0.4);
  border: 1px solid rgba(0, 110, 255, 0.2);
  font-size: 24px;
  opacity: 0.6;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.weapon-progress {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0%;
  background: rgba(0, 162, 255, 0.2);
  pointer-events: none;
  transition: width 0.1s linear;
  z-index: 0;
}

.weapon-item.overheated .weapon-progress {
  background: rgba(255, 0, 0, 0.3);
}

.weapon-name,
.weapon-ammo {
  position: relative;
  z-index: 1;
}

.weapon-item.active {
  background: rgba(0, 80, 0, 0.6);
  border: 1px solid #00e5ff;
  opacity: 1;
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.25);
  position: relative;
}

.weapon-item.active::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  width: 4.5px;
  height: 100%;
  background: #00e5ff;
  box-shadow: 0 0 12px #00e5ff;
}

.weapon-ammo {
  font-weight: bold;
}

.sensor-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 150px;
  padding: 7.5px 15px;
  background: rgba(0, 40, 0, 0.4);
  border: 1px solid rgba(0, 110, 255, 0.2);
  font-size: 24px;
  opacity: 0.6;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.sensor-progress {
  position: absolute;
  left: 0;
  top: 0;
  height: 100%;
  width: 0%;
  background: rgba(0, 162, 255, 0.2);
  pointer-events: none;
  transition: width 0.1s linear;
  z-index: 0;
}

.sensor-name,
.sensor-status {
  position: relative;
  z-index: 1;
}

.sensor-item.active {
  background: rgba(0, 80, 0, 0.6);
  border: 1px solid #00e5ff;
  opacity: 1;
  box-shadow: 0 0 15px rgba(0, 229, 255, 0.25);
  position: relative;
}

.sensor-item.active::after {
  content: '';
  position: absolute;
  right: 0;
  top: 0;
  width: 4.5px;
  height: 100%;
  background: #00e5ff;
  box-shadow: 0 0 12px #00e5ff;
}

.sensor-status {
  font-weight: bold;
}

#aircraft-icon {
  width: 105px;
  border: 1px solid #00e5ff;
  background: rgba(0, 40, 0, 0.4);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 15px;
  box-sizing: border-box;
  box-shadow: 0 0 22.5px rgba(0, 229, 255, 0.25);
}

#aircraft-icon img {
  width: auto;
  height: calc(100% - 30px);
  max-width: 100%;
  filter: invert(48%) sepia(79%) saturate(2476%) hue-rotate(180deg)
    brightness(118%) contrast(119%) drop-shadow(0 0 12px rgba(0, 229, 255, 0.6));
}

#aircraft-label {
  font-size: 21px;
  margin-top: 9px;
  text-align: center;
}

/* 闪烁动画 */
@keyframes aircraft-blink {
  0% {
    box-shadow: 0 0 22.5px rgba(0, 229, 255, 0.25);
    border-color: #00e5ff;
  }

  50% {
    box-shadow: 0 0 45px var(--blink-color, #00e5ff);
    border-color: var(--blink-color, #00e5ff);
  }

  100% {
    box-shadow: 0 0 22.5px rgba(0, 229, 255, 0.25);
    border-color: #00e5ff;
  }
}

/* 不同动作类型的闪烁效果 */
#aircraft-icon.blink-hovering,
#aircraft-icon.blink-ascending,
#aircraft-icon.blink-descending,
#aircraft-icon.blink-forward,
#aircraft-icon.blink-backward,
#aircraft-icon.blink-left,
#aircraft-icon.blink-right,
#aircraft-icon.blink-turbulence,
#aircraft-icon.blink-flight {
  animation: aircraft-blink 1s infinite;
}

.weapon-item.overheated {
  background: rgba(80, 0, 0, 0.6) !important;
  border: 1px solid #f00 !important;
  color: #f00 !important;
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.4) !important;
  text-shadow: 0 0 5px rgba(255, 0, 0, 0.5);
}

.weapon-item.active.overheated {
  animation: blink 0.5s infinite;
}

.weapon-item.overheated::after {
  background: #f00 !important;
  box-shadow: 0 0 8px #f00 !important;
}

@keyframes blink {
  0% {
    opacity: 1;
  }

  50% {
    opacity: 0.5;
  }

  100% {
    opacity: 1;
  }
}

@keyframes region-in {
  0% {
    opacity: 0;
    transform: translate(-50%, -60%) scale(0.9);
    filter: blur(10px);
  }

  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    filter: blur(0);
  }
}

/* 由下到上飞入动画 */
@keyframes region-fly-in {
  0% {
    opacity: 0;
    transform: translate(-50%, 100%) scale(0.8);
    filter: blur(10px);
  }

  50% {
    opacity: 0.8;
    transform: translate(-50%, -30%) scale(1.05);
    filter: blur(5px);
  }

  100% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    filter: blur(0);
  }
}

@keyframes pull-up-blink {
  from {
    opacity: 0.4;
    box-shadow: 0 0 5px rgba(255, 0, 0, 0.2);
  }

  to {
    opacity: 1;
    box-shadow: 0 0 20px rgba(255, 0, 0, 0.6);
    background: rgba(255, 0, 0, 0.3);
  }
}

@keyframes kill-pop {
  0% {
    transform: translate(-50%, -50%) scale(0.5);
    opacity: 0;
  }

  100% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
}

@keyframes kill-out {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
    filter: blur(0);
  }

  100% {
    transform: translate(-50%, -60%) scale(1.2);
    opacity: 0;
    filter: blur(10px);
  }
}

.kill-notification-exit {
  animation: kill-out 0.5s ease-in forwards !important;
}

.region-exit {
  animation: region-out 1s ease-in forwards !important;
}

@keyframes region-out {
  0% {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
    filter: blur(0);
  }

  100% {
    opacity: 0;
    transform: translate(-50%, -40%) scale(1.1);
    filter: blur(10px);
  }
}

/* 边框闪烁动画 */
@keyframes border-blink {
  0% {
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.3),
      inset 0 0 10px rgba(0, 229, 255, 0.2);
    border-color: #00e5ff;
  }

  50% {
    box-shadow: 0 0 30px rgba(0, 229, 255, 0.8),
      inset 0 0 20px rgba(0, 229, 255, 0.6);
    border-color: #ffffff;
  }

  100% {
    box-shadow: 0 0 20px rgba(0, 229, 255, 0.3),
      inset 0 0 10px rgba(0, 229, 255, 0.2);
    border-color: #00e5ff;
  }
}

.border-blink {
  animation: border-blink 1s infinite;
}

.label {
  font-size: 24px;
}
</style>
