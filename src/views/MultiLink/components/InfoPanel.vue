<template>
  <div class="link-info">
    <!-- 网格背景 -->
    <div class="grid-bg"></div>

    <!-- 脉冲元素 -->
    <div class="pulse pulse1"></div>
    <div class="pulse pulse2"></div>
    <div class="pulse pulse3"></div>
    <div class="pulse pulse4"></div>

    <!-- 数据流效果 -->
    <div
      class="data-stream"
      style="top: 15%; width: 30%; animation-delay: 0s"
    ></div>
    <div
      class="data-stream"
      style="top: 35%; width: 40%; animation-delay: 1s"
    ></div>
    <div
      class="data-stream"
      style="top: 55%; width: 35%; animation-delay: 2s"
    ></div>
    <div
      class="data-stream"
      style="top: 75%; width: 45%; animation-delay: 3s"
    ></div>

    <!-- 内容区域 -->
    <div class="container">
      <!-- 上面两个div -->
      <div class="row">
        <div class="panel panel-1">
          <div class="icon">🌐</div>
          <h2>指挥</h2>
          <TaskMessage></TaskMessage>
        </div>

        <div class="panel panel-2">
          <div class="icon">🌐</div>
          <h2>数据</h2>
          <TrackInitMessage></TrackInitMessage>
        </div>
      </div>

      <!-- 下面两个div -->
      <div class="row">
        <div class="panel panel-3">
          <div class="icon">🌐</div>
          <h2>打击</h2>
          <WeaponMessage></WeaponMessage>
        </div>

        <div class="panel panel-4">
          <div class="icon">🌐</div>
          <h2>通信</h2>
          <!-- <JamMessage></JamMessage> -->
          <Communication></Communication>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import TrackInitMessage from './components/TrackInitMessage'
import JamMessage from './components/JamMessage'
import WeaponMessage from './components/WeaponMessage'
import TaskMessage from './components/TaskMessage'
import Communication from './components/Communication'
</script>

<style lang="less" scoped>
/* 网格背景 */
.grid-bg {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-image: linear-gradient(
      rgba(0, 200, 255, 0.05) 1px,
      transparent 1px
    ),
    linear-gradient(90deg, rgba(0, 200, 255, 0.05) 1px, transparent 1px);
  background-size: 40px 40px;
  z-index: -2;
  animation: gridMove 20s linear infinite;
}

@keyframes gridMove {
  0% {
    transform: translate(0, 0);
  }
  100% {
    transform: translate(40px, 40px);
  }
}

/* 标题区域 */
.header {
  text-align: center;
  padding: 30px 20px;
  background: rgba(10, 15, 35, 0.7);
  border-bottom: 1px solid rgba(0, 200, 255, 0.3);
  margin-bottom: 20px;
}

.header h1 {
  font-size: 2.8rem;
  margin-bottom: 10px;
  text-transform: uppercase;
  letter-spacing: 3px;
  background: linear-gradient(90deg, #00c8ff, #ff0080, #00ffaa, #ffcc00);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  text-shadow: 0 0 20px rgba(255, 255, 255, 0.3);
}

.header p {
  font-size: 1.2rem;
  max-width: 600px;
  margin: 0 auto;
  opacity: 0.9;
}

/* 容器布局 */
.container {
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 20px;
}

.row {
  display: flex;
  width: 100%;
  gap: 20px;
  height: 41vh;
}

/* 通用面板样式 */
.panel {
  flex: 1;
  border: 1px solid;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(10, 15, 35, 0.85);
  backdrop-filter: blur(8px);
  box-shadow: 0 0 20px rgba(0, 0, 0, 0.5);
  transition: all 0.4s ease;
  overflow: hidden;
  padding: 20px;
  position: relative;
  color: aliceblue;
}

.panel:hover {
  transform: translateY(-5px);
  box-shadow: 0 0 30px currentColor;
  z-index: 10;
}

/* 各个面板的独特样式 */
.panel-1 {
  border-color: #00c8ff;
  box-shadow: 0 0 20px rgba(0, 200, 255, 0.3);
}

.panel-2 {
  border-color: #ff0080;
  box-shadow: 0 0 20px rgba(255, 0, 128, 0.3);
}

.panel-3 {
  border-color: #00ffaa;
  box-shadow: 0 0 20px rgba(0, 255, 170, 0.3);
}

.panel-4 {
  border-color: #ffcc00;
  box-shadow: 0 0 20px rgba(255, 204, 0, 0.3);
}

/* 面板内容样式 */
.icon {
  position: absolute;
  top: 11px;
  left: 10px;
  font-size: 25px;
  margin-bottom: 15px;
  text-shadow: 0 0 15px currentColor;
  filter: drop-shadow(0 0 5px currentColor);
}

.panel h2 {
  position: absolute;
  top: 11px;
  left: 50px;
  font-size: 26px;
  margin-bottom: 15px;
  text-transform: uppercase;
  letter-spacing: 2px;
  text-shadow: 0 0 10px currentColor;
  font-weight: 300;
}

.panel p {
  font-size: 1rem;
  text-align: center;
  line-height: 1.6;
  max-width: 80%;
  opacity: 0.9;
}

/* 科技感按钮 */
.tech-button {
  padding: 10px 25px;
  background: rgba(0, 200, 255, 0.1);
  border: 1px solid #00c8ff;
  color: #e0e0ff;
  font-size: 1rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
  box-shadow: 0 0 10px rgba(0, 200, 255, 0.3);
  margin-top: 20px;
  border-radius: 4px;
}

.tech-button:hover {
  background: rgba(0, 200, 255, 0.3);
  box-shadow: 0 0 20px rgba(0, 200, 255, 0.6);
  transform: translateY(-2px);
}

/* 脉冲动画元素 */
.pulse {
  position: fixed;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  box-shadow: 0 0 0 0 rgba(0, 200, 255, 0.7);
  animation: pulse 3s infinite;
  z-index: -1;
}

@keyframes pulse {
  0% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 200, 255, 0.7);
  }
  70% {
    transform: scale(1.5);
    box-shadow: 0 0 0 20px rgba(0, 200, 255, 0);
  }
  100% {
    transform: scale(0.95);
    box-shadow: 0 0 0 0 rgba(0, 200, 255, 0);
  }
}

.pulse1 {
  top: 10%;
  left: 5%;
  background: #00c8ff;
}
.pulse2 {
  top: 10%;
  right: 5%;
  background: #ff0080;
}
.pulse3 {
  bottom: 10%;
  left: 5%;
  background: #00ffaa;
}
.pulse4 {
  bottom: 10%;
  right: 5%;
  background: #ffcc00;
}

/* 数据流效果 */
.data-stream {
  position: fixed;
  height: 1px;
  background: linear-gradient(90deg, transparent, #00c8ff, transparent);
  box-shadow: 0 0 10px #00c8ff;
  z-index: -1;
  animation: streamMove 5s linear infinite;
}

@keyframes streamMove {
  0% {
    transform: translateX(-100%);
    opacity: 0;
  }
  50% {
    opacity: 1;
  }
  100% {
    transform: translateX(100%);
    opacity: 0;
  }
}

/* 响应式调整 */
@media (max-width: 768px) {
  .row {
    flex-direction: column;
    height: auto;
  }

  .panel {
    min-height: 200px;
  }

  .header h1 {
    font-size: 2rem;
  }

  .header p {
    font-size: 1rem;
  }
}
</style>
