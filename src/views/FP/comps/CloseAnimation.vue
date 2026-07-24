<template>
  <div class="close-wrapper">
    <div class="close-content">
      <div class="close-circle">
        <svg viewBox="0 0 100 100" class="close-svg">
          <circle
            cx="50"
            cy="50"
            r="40"
            fill="none"
            stroke="#ff4d4f"
            stroke-width="4"
            stroke-dasharray="251.2"
            stroke-dashoffset="251.2"
            class="circle-path"
          ></circle>
          <line x1="35" y1="35" x2="65" y2="65" stroke="#ff4d4f" stroke-width="4" class="line-1"></line>
          <line x1="65" y1="35" x2="35" y2="65" stroke="#ff4d4f" stroke-width="4" class="line-2"></line>
        </svg>
      </div>
      <div class="close-text">{{ closeText }}</div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  closeText: {
    type: String,
    default: '正在关闭复盘...'
  }
})
</script>

<style lang="less" scoped>
.close-wrapper {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
  text-align: center;
  z-index: 999;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  justify-content: center;
  align-items: center;
  animation: fadeIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.close-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 250px;
}

.close-circle {
  width: 120px;
  height: 120px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.close-svg {
  height: 100%;
  width: 100%;
  overflow: visible;
}

.circle-path {
  animation: drawCircle 1.2s ease-out forwards;
}

@keyframes drawCircle {
  from {
    stroke-dashoffset: 251.2;
  }
  to {
    stroke-dashoffset: 0;
  }
}

.line-1,
.line-2 {
  opacity: 0;
  animation: drawLine 0.4s ease-out forwards;
  transform-origin: center;
}

.line-1 {
  animation-delay: 0.8s;
}

.line-2 {
  animation-delay: 1s;
}

@keyframes drawLine {
  from {
    opacity: 0;
    transform: scale(0);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.close-text {
  margin-top: 30px;
  font-size: 24px;
  font-family: yahei, 'Courier New', monospace;
  font-weight: bold;
  background: linear-gradient(135deg, #ff4d4f 0%, #ffffff 50%, #ff4d4f 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  background-size: 200% auto;
  text-shadow: 0 0 15px rgba(255, 77, 79, 0.8), 0 0 30px rgba(255, 77, 79, 0.5),
    0 0 45px rgba(255, 77, 79, 0.3);
  letter-spacing: 2px;
  padding: 10px 20px;
  border-radius: 4px;
}
</style>
