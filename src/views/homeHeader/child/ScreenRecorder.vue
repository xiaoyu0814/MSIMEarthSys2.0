<template>
  <div class="screen-recorder-container">
    <!-- 录屏控制按钮 -->
    <div class="control-buttons">
      <!-- 开始/暂停/继续按钮 -->
      <div class="screen-recorder" @click="toggleRecord">
        <el-tooltip
          effect="light"
          :content="
            isRecording ? (isPaused ? '继续录屏' : '暂停录屏') : '开始录屏'
          "
          placement="bottom"
        >
          <div
            class="record-button"
            :class="{
              recording: isRecording && !isPaused,
              paused: isRecording && isPaused,
              idle: !isRecording
            }"
          >
            <!-- 科技风录屏图标 -->
            <svg
              v-if="!isRecording"
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <rect x="2" y="6" width="20" height="12" rx="2" ry="2" />
              <circle cx="8" cy="12" r="2" />
              <line x1="16" y1="10" x2="22" y2="10" />
              <line x1="16" y1="14" x2="22" y2="14" />
            </svg>
            <!-- 录制中状态 -->
            <div v-else-if="!isPaused" class="recording-dot"></div>
            <!-- 暂停状态 -->
            <svg
              v-else
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="3"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path d="M6 4h4v16H6zM14 4h4v16h-4z" />
            </svg>
          </div>
        </el-tooltip>
      </div>

      <!-- 结束录制按钮 -->
      <div class="stop-recorder" @click="stopRecording" v-if="isRecording">
        <el-tooltip effect="light" content="结束录屏" placement="bottom">
          <div
            :style="{
              width: '20px',
              height: '20px',
              borderRadius: '4px',
              backgroundColor: '#f44336',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#ffffff',
              fontSize: '10px',
              fontWeight: 'bold',
              marginLeft: '10px'
            }"
          >
            ■
          </div>
        </el-tooltip>
      </div>
    </div>

    <!-- 自定义文件名输入弹窗 -->
    <div v-if="showFileNameInput" class="file-name-dialog-overlay">
      <div class="file-name-dialog">
        <h3>保存录制视频</h3>
        <div class="input-group">
          <label for="videoFileName">视频名称：</label>
          <el-input
            v-model="customFileName"
            placeholder="请输入视频名称"
            maxlength="50"
            show-word-limit
            @keyup.enter="saveVideo"
          ></el-input>
        </div>
        <div class="dialog-buttons">
          <el-button type="primary" @click="saveVideo">保存</el-button>
          <el-button @click="cancelSave">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'

const isRecording = ref(false)
const isPaused = ref(false)
const customFileName = ref('')
const showFileNameInput = ref(false)
let mediaRecorder = null
let recordedChunks = []
let recordedStream = null // 保存媒体流引用，用于后续清理

const toggleRecord = async () => {
  if (isRecording.value) {
    if (isPaused.value) {
      resumeRecording()
    } else {
      pauseRecording()
    }
  } else {
    await startRecording()
  }
}

const startRecording = async () => {
  try {
    const stream = await navigator.mediaDevices.getDisplayMedia({
      video: {
        cursor: 'always',
        displaySurface: 'monitor' // 尝试指定显示表面类型，可能影响提示位置
      },
      audio: true,
      selfBrowserSurface: 'exclude' // 排除浏览器自身的UI元素
    })

    // 保存媒体流引用，用于后续直接停止流
    recordedStream = stream

    // 获取浏览器支持的 mimeType，优先使用 mp4 格式
    const supportedMimeTypes = [
      'video/mp4',
      'video/webm;codecs=vp9,opus',
      'video/webm;codecs=vp8,opus',
      'video/webm'
    ]

    const mimeType =
      supportedMimeTypes.find((type) => MediaRecorder.isTypeSupported(type)) ||
      'video/webm'

    mediaRecorder = new MediaRecorder(stream, {
      mimeType: mimeType
    })

    recordedChunks = []

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) {
        recordedChunks.push(event.data)
      }
    }

    mediaRecorder.onstop = () => {
      // 保存录制数据，等待用户输入文件名
      const finalBlob = new Blob(recordedChunks, {
        type: mediaRecorder.mimeType
      })

      // 保存流信息，用于后续下载
      const savedStream = stream
      const savedUrl = URL.createObjectURL(finalBlob)

      // 添加保存文件的方法
      window.saveRecordedVideo = (fileName) => {
        const a = document.createElement('a')
        a.href = savedUrl
        // 使用自定义文件名或默认名称
        const finalFileName = fileName || `recording_${new Date().getTime()}`
        a.download = `${finalFileName}.mp4`
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(savedUrl)

        // 清理流
        savedStream.getTracks().forEach((track) => track.stop())

        // 清理保存的方法
        delete window.saveRecordedVideo
      }

      // 显示文件名输入框
      showFileNameInput.value = true
    }

    mediaRecorder.start()
    isRecording.value = true
  } catch (error) {
    console.error('录屏开始失败:', error)
  }
}

const pauseRecording = () => {
  if (mediaRecorder && mediaRecorder.state === 'recording') {
    mediaRecorder.pause()
    isPaused.value = true
  }
}

const resumeRecording = () => {
  if (mediaRecorder && mediaRecorder.state === 'paused') {
    mediaRecorder.resume()
    isPaused.value = false
  }
}

const stopRecording = () => {
  if (mediaRecorder && mediaRecorder.state !== 'inactive') {
    mediaRecorder.stop()
    isRecording.value = false
    isPaused.value = false
  }
}

const saveVideo = () => {
  if (window.saveRecordedVideo) {
    window.saveRecordedVideo(customFileName.value.trim())
    showFileNameInput.value = false
    customFileName.value = ''
  }
}

const cancelSave = () => {
  if (window.saveRecordedVideo) {
    // 清理资源
    try {
      const savedUrl = window.saveRecordedVideo.toString().match(/blob:.*?'/)
      if (savedUrl && savedUrl[0]) {
        URL.revokeObjectURL(savedUrl[0].slice(0, -1))
      }
    } catch (error) {
      console.error('清理录制资源失败:', error)
    }
    // 确保删除保存的方法，无论资源清理是否成功
    delete window.saveRecordedVideo
  }

  // 直接停止保存的媒体流，这是解决黄框问题的关键
  if (recordedStream) {
    // 停止所有轨道
    recordedStream.getTracks().forEach((track) => {
      if (track.readyState === 'live') {
        track.stop()
      }
    })
    // 清空流引用
    recordedStream = null
  }

  showFileNameInput.value = false
  customFileName.value = ''
}
</script>

<style scoped>
.screen-recorder-container {
  position: absolute;
  top: 14px;
  right: 70px;
  display: flex;
  align-items: center;
}

.control-buttons {
  display: flex;
  align-items: center;
}

.screen-recorder {
  cursor: pointer;
  padding: 10px;
  box-sizing: border-box;
}

.stop-recorder {
  cursor: pointer;
  padding: 10px;
  box-sizing: border-box;
}

/* 科技风录屏按钮样式 */
.record-button {
  width: 20px;
  height: 20px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

/* 按钮背景效果 */
.record-button::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(
    135deg,
    rgba(16, 146, 213, 0.3),
    rgba(16, 146, 213, 0.1)
  );
  border: 1px solid rgba(0, 203, 255, 0.3);
  border-radius: inherit;
  transition: all 0.3s ease;
}

.record-button:hover::before {
  background: linear-gradient(
    135deg,
    rgba(16, 146, 213, 0.5),
    rgba(16, 146, 213, 0.2)
  );
  border-color: rgba(0, 203, 255, 0.6);
  box-shadow: 0 0 10px rgba(0, 203, 255, 0.4);
}

/* 空闲状态 */
.record-button.idle {
  background-color: rgba(64, 158, 255, 0.2);
  color: #00cbff;
}

/* 录制中状态 */
.record-button.recording {
  background-color: rgba(255, 0, 0, 0.2);
  border-color: rgba(255, 0, 0, 0.6);
}

.record-button.recording::before {
  background: linear-gradient(
    135deg,
    rgba(255, 0, 0, 0.3),
    rgba(255, 0, 0, 0.1)
  );
  border-color: rgba(255, 0, 0, 0.3);
}

.record-button.recording:hover::before {
  background: linear-gradient(
    135deg,
    rgba(255, 0, 0, 0.5),
    rgba(255, 0, 0, 0.2)
  );
  border-color: rgba(255, 0, 0, 0.6);
  box-shadow: 0 0 10px rgba(255, 0, 0, 0.4);
}

/* 暂停状态 */
.record-button.paused {
  background-color: rgba(255, 152, 0, 0.2);
  color: #ffffff;
}

.record-button.paused::before {
  background: linear-gradient(
    135deg,
    rgba(255, 152, 0, 0.3),
    rgba(255, 152, 0, 0.1)
  );
  border-color: rgba(255, 152, 0, 0.3);
}

.record-button.paused:hover::before {
  background: linear-gradient(
    135deg,
    rgba(255, 152, 0, 0.5),
    rgba(255, 152, 0, 0.2)
  );
  border-color: rgba(255, 152, 0, 0.6);
  box-shadow: 0 0 10px rgba(255, 152, 0, 0.4);
}

/* 录制中点动画 */
.recording-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background-color: #ff0000;
  box-shadow: 0 0 10px #ff0000;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
    opacity: 1;
  }
  50% {
    transform: scale(1.2);
    opacity: 0.8;
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

/* SVG图标样式 */
.record-button svg {
  z-index: 1;
  transition: all 0.3s ease;
}

.record-button.idle svg {
  color: #00cbff;
}

.record-button.paused svg {
  color: #ffffff;
}

/* 自定义文件名弹窗样式 */
.file-name-dialog-overlay {
  position: fixed;
  top: 300px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.file-name-dialog {
  background-color: #172e51;
  border: 1px solid #1092d5;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  box-shadow: 0 0 20px rgba(16, 146, 213, 0.5);
  color: #ffffff;
}

.file-name-dialog h3 {
  margin-top: 0;
  margin-bottom: 20px;
  text-align: center;
  color: #00cbff;
  font-size: 18px;
  font-weight: bold;
}

.input-group {
  margin-bottom: 20px;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 14px;
  color: #ffffff;
}

.dialog-buttons {
  display: flex;
  justify-content: center;
  gap: 10px;
}

/* 调整Element UI组件样式 */
:deep(.el-input__wrapper) {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: #1092d5;
}

:deep(.el-input__inner) {
  color: #ffffff;
}

:deep(.el-input__placeholder) {
  color: rgba(255, 255, 255, 0.5);
}

:deep(.el-button--primary) {
  background-color: #1092d5;
  border-color: #1092d5;
}

:deep(.el-button--primary:hover) {
  background-color: #0e7fa8;
  border-color: #0e7fa8;
}

:deep(.el-button) {
  border-color: #1092d5;
  color: #ffffff;
  background-color: rgba(255, 255, 255, 0.1);
}

:deep(.el-button:hover) {
  background-color: rgba(16, 146, 213, 0.3);
  border-color: rgba(0, 203, 255, 0.6);
}

/* 取消按钮特定样式 */
:deep(.el-button:not(.el-button--primary)) {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(0, 203, 255, 0.3);
}

:deep(.el-button:not(.el-button--primary):hover) {
  background-color: rgba(255, 255, 255, 0.15);
  border-color: rgba(0, 203, 255, 0.5);
}
</style>

<!-- 全局样式，用于隐藏浏览器原生的屏幕共享提示框 -->
<style>
/* 隐藏Chrome浏览器的屏幕共享提示 */
:root {
  --sharing-indicator-display: none !important;
}

/* 尝试隐藏各种浏览器的屏幕共享提示 */
video::-webkit-media-controls-enclosure,
video::-webkit-media-controls,
video::-webkit-media-controls-overlay-play-button,
video::-webkit-media-controls-play-button,
video::-webkit-media-controls-volume-slider,
video::-webkit-media-controls-mute-button,
video::-webkit-media-controls-timeline,
video::-webkit-media-controls-current-time-display,
video::-webkit-media-controls-time-remaining-display,
video::-webkit-media-controls-timeline-container,
video::-webkit-media-controls-seek-back-button,
video::-webkit-media-controls-seek-forward-button,
video::-webkit-media-controls-fullscreen-button {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
}

/* 隐藏Firefox浏览器的屏幕共享提示 */
video::-moz-media-controls {
  display: none !important;
}

/* 隐藏Edge浏览器的屏幕共享提示 */
video::-ms-media-controls {
  display: none !important;
}

/* 隐藏浏览器原生的共享指示器 */
#screen-sharing-indicator,
.screen-sharing-indicator,
.recording-indicator,
#recording-indicator {
  display: none !important;
  visibility: hidden !important;
  opacity: 0 !important;
  pointer-events: none !important;
  z-index: -1 !important;
}
</style>
