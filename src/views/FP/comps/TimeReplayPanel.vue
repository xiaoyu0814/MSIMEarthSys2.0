<template>
  <div class="timeReplayBar" v-show="showPanel">
    <div id="timeProcess" class="time_box">
      <!-- 进度条 -->
      <div v-on:click="onChangeProcess">
        <el-progress
          :percentage="curTimeRate"
          :stroke-width="18"
          :show-text="true"
          text-inside="false"
        />
      </div>
      <div class="processConfig" v-show="showProcessConfig">
        <el-date-picker
          v-model="localTimeInfo"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="选择执行时间"
          :disabled-date="disabledDateFn"
          :disabled-hours="disabledHours"
          :disabled-minutes="disabledMinutes"
          :disabled-seconds="disabledSeconds"
        />
        <el-button @click="onAdvanceToTime">跳转</el-button>
      </div>
    </div>
    <div class="timeControlDiv">
      <el-button @click="onFpPause">暂停</el-button>
      <el-button @click="onFpResume">继续</el-button>
      <el-button @click="onFpStop">停止</el-button>
      <el-select
        v-model="localValue"
        placeholder="选择倍速"
        class="clockRateSelect"
        @change="onControlSpeed"
      >
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
      <el-button @click="onFpClockRate">速率</el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  showPanel: {
    type: Boolean,
    default: true
  },
  curTimeRate: {
    type: Number,
    default: 0
  },
  showProcessConfig: {
    type: Boolean,
    default: false
  },
  timeInfo: {
    type: String,
    default: ''
  },
  value: {
    type: [String, Number],
    default: '1'
  },
  options: {
    type: Array,
    default: () => [
      { value: '1', label: 'x1' },
      { value: '2', label: 'x2' },
      { value: '3', label: 'x3' },
      { value: '4', label: 'x4' },
      { value: '5', label: 'x5' }
    ]
  },
  disabledDateFn: {
    type: Function,
    default: () => false
  },
  disabledHours: {
    type: Function,
    default: () => []
  },
  disabledMinutes: {
    type: Function,
    default: () => []
  },
  disabledSeconds: {
    type: Function,
    default: () => []
  }
})

const emit = defineEmits([
  'changeProcess',
  'advanceToTime',
  'fpPause',
  'fpResume',
  'fpStop',
  'controlSpeed',
  'fpClockRate',
  'update:timeInfo',
  'update:value'
])

// 创建本地状态
const localTimeInfo = ref(props.timeInfo)
const localValue = ref(props.value)

// 监听 prop 变化，同步到本地状态
watch(
  () => props.timeInfo,
  (newVal) => {
    localTimeInfo.value = newVal
  }
)
watch(
  () => props.value,
  (newVal) => {
    localValue.value = newVal
  }
)

// 监听本地状态变化，emit 更新事件
watch(localTimeInfo, (newVal) => {
  emit('update:timeInfo', newVal)
})
watch(localValue, (newVal) => {
  emit('update:value', newVal)
  emit('controlSpeed', newVal)
})

const onChangeProcess = () => {
  emit('changeProcess')
}

const onAdvanceToTime = () => {
  emit('advanceToTime')
}

const onFpPause = () => {
  emit('fpPause')
}

const onFpResume = () => {
  emit('fpResume')
}

const onFpStop = () => {
  emit('fpStop')
}

const onControlSpeed = (val) => {
  localValue.value = val // 更新本地状态，会自动触发 watch emit
}

const onFpClockRate = () => {
  emit('fpClockRate')
}
</script>

<style lang="less" scoped>
.timeReplayBar {
  position: absolute;
  left: 22%;
  bottom: 24px;
  z-index: 11;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 12px;
  width: min(1080px, calc(100vw - 48px));
}

.timeControlDiv {
  display: flex;
  align-items: center;
  flex: 0 0 auto;
  gap: 10px;
  height: 58px;
  box-sizing: border-box;
  padding: 10px 14px;
  background: rgba(2, 26, 70, 0.88);
  border: 1px solid rgba(16, 146, 213, 0.7);
  box-shadow: 0 0 24px rgba(16, 146, 213, 0.4);
  backdrop-filter: blur(6px);

  :deep(.el-button) {
    min-width: 58px;
    height: 36px;
    padding: 0 16px;
    color: #dff8ff;
    background: rgba(7, 93, 137, 0.85);
    border: 1px solid rgba(0, 199, 251, 0.75);
    box-shadow: 0 0 10px rgba(16, 146, 213, 0.35) inset;
  }

  :deep(.el-button:hover) {
    color: #ffffff;
    background: rgba(0, 123, 204, 0.9);
    border-color: #06d6f9;
  }

  /* 优化速率下拉框宽度 */
  :deep(.clockRateSelect) {
    width: 80px !important;
  }

  :deep(.clockRateSelect .el-select__wrapper) {
    background: rgba(4, 29, 72, 0.9);
    border: 1px solid rgba(0, 199, 251, 0.55);
    box-shadow: none;
  }
}

.time_box {
  flex: 0 0 auto;
  width: 600px;
  height: 58px;
  box-sizing: border-box;
  padding: 10px 20px;
  background: rgba(2, 26, 70, 0.88);
  border: 1px solid rgba(16, 146, 213, 0.7);
  box-shadow: 0 0 24px rgba(16, 146, 213, 0.4);
  backdrop-filter: blur(6px);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;

  /* 优化进度条显示 */
  :deep(.el-progress) {
    width: 100%;
  }

  :deep(.el-progress-bar) {
    padding-right: 0;
    margin-right: 0;
    width: 100%;
  }

  :deep(.el-progress-bar__outer) {
    height: 18px !important;
    background-color: rgba(0, 0, 0, 0.5);
    border-radius: 9px;
  }

  :deep(.el-progress-bar__inner) {
    height: 18px !important;
    background: linear-gradient(90deg, #06d6f9, #00ff88);
    border-radius: 9px;
  }

  :deep(.el-progress__text) {
    color: #dff8ff;
    font-size: 14px;
    font-weight: bold;
  }
}

.processConfig {
  position: absolute;
  left: 50%;
  bottom: calc(100% + 10px);
  z-index: 12;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 12px;
  background: rgba(2, 26, 70, 0.9);
  border: 1px solid rgba(16, 146, 213, 0.75);
  box-shadow: 0 0 22px rgba(16, 146, 213, 0.45);
  transform: translateX(-50%);
  backdrop-filter: blur(6px);

  :deep(.el-button) {
    min-width: 58px;
    height: 36px;
    padding: 0 16px;
    color: #dff8ff;
    background: rgba(7, 93, 137, 0.85);
    border: 1px solid rgba(0, 199, 251, 0.75);
    box-shadow: 0 0 10px rgba(16, 146, 213, 0.35) inset;
  }

  :deep(.el-button:hover) {
    color: #ffffff;
    background: rgba(0, 123, 204, 0.9);
    border-color: #06d6f9;
  }

  :deep(.el-date-editor) {
    width: 220px;
  }

  :deep(.el-input__wrapper) {
    background: rgba(4, 29, 72, 0.9);
    border: 1px solid rgba(0, 199, 251, 0.55);
    box-shadow: none;
  }

  :deep(.el-input__inner),
  :deep(.el-input__prefix) {
    color: #dff8ff;
  }
}
</style>
