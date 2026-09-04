<template>
  <div class="ai-chat-wrap">
    <!-- 悬浮图片入口：点击高亮并弹出聊天界面 -->
    <div class="ai-float-btn" :class="{ active: visible }" @click="toggleChat">
      <img :src="aiImg" alt="导调" />
    </div>

    <!-- 导调指令界面 -->
    <transition name="ai-pop">
      <div v-if="visible" class="ai-chat-panel">
        <!-- 头部 -->
        <div class="ai-header">
          <div class="ai-header__title">
            <!-- 导调指令图标头像（非 AI 机器人） -->
            <span class="ai-header__avatar">
              <svg viewBox="0 0 1024 1024" width="22" height="22">
                <path
                  d="M192 288v448l320 192V480L192 288z m640 0L512 480v448l320-192V288zM512 64L192 224l320 160 320-160L512 64z"
                  fill="currentColor" />
              </svg>
            </span>
            导调指令
          </div>
          <div class="ai-header__close" @click="toggleChat">×</div>
        </div>

        <!-- 内容部：消息展示区 + 文本域输入 -->
        <div class="ai-content">
          <div class="ai-message-list" ref="msgListRef">
            <transition-group name="msg">
              <div v-for="(msg, idx) in messageList" :key="idx" class="ai-msg" :class="msg.role">
                <div class="ai-msg__avatar">{{ msg.role === 'user' ? '我' : '导' }}</div>
                <div class="ai-msg__bubble">{{ msg.text }}</div>
              </div>
            </transition-group>
            <div v-if="aiThinking" class="ai-msg ai">
              <div class="ai-msg__avatar">导</div>
              <div class="ai-msg__bubble ai-typing">
                <span class="dot"></span>
                <span class="dot"></span>
                <span class="dot"></span>
              </div>
            </div>
            <div v-if="!messageList.length && !executing" class="ai-empty">
              您好，请输入导调指令内容，点击确定执行～
            </div>
          </div>
          <div class="ai-textarea-wrap">
            <textarea
              v-model="inputText"
              class="ai-textarea"
              :class="{ typing: isTyping }"
              :readonly="executing"
              placeholder="请输入导调指令..."
              rows="3"
              @keydown.enter.exact.prevent="onConfirm"
            ></textarea>
          </div>
        </div>

        <!-- 脚部：确定按钮 -->
        <div class="ai-footer">
          <button
            class="ai-send-btn"
            :class="{ 'btn-active': sendBtnActive }"
            :disabled="executing"
            @click="onConfirm"
          >
            {{ executing ? '执行中' : '确 定' }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, nextTick, onUnmounted } from 'vue'
import { ElMessage } from 'element-plus'
import aiImg from '@/assets/image/homeHeader/ai.png'
import { chatRecords, PLAY_TRIGGER } from './chatRecords'

const visible = ref(false)
const inputText = ref('')
const messageList = ref([])
const msgListRef = ref(null)
const executing = ref(false) // 播放中（禁用按钮/输入）
const aiThinking = ref(false) // 对方思考中（三点动画，仅普通输入路径使用）
const isTyping = ref(false) // 自动输入中（输入框逐字显示）
const sendBtnActive = ref(false) // 自动点击确定效果
const playTimers = [] // 预设记录播放定时器集合
let playCancelled = false // 播放取消标志

const toggleChat = () => {
  if (visible.value) {
    // 关闭界面：停止播放并清空历史记录、重置状态
    clearPlayTimers()
    messageList.value = []
    inputText.value = ''
    executing.value = false
    aiThinking.value = false
    isTyping.value = false
    sendBtnActive.value = false
  }
  visible.value = !visible.value
}

const scrollToBottom = () => {
  nextTick(() => {
    const el = msgListRef.value
    if (el) el.scrollTop = el.scrollHeight
  })
}

const sleep = (ms) =>
  new Promise((resolve) => {
    const t = setTimeout(resolve, ms)
    playTimers.push(t)
  })

// 清理播放定时器
const clearPlayTimers = () => {
  playCancelled = true
  playTimers.forEach((t) => clearTimeout(t))
  playTimers.length = 0
}

// 逐字输入动画：在输入框中字一个个出来，约 3 秒输入完一条
const typeText = async (fullText) => {
  isTyping.value = true
  inputText.value = ''
  const total = 3000
  const interval = Math.max(30, Math.floor(total / fullText.length))
  for (let i = 0; i < fullText.length; i++) {
    if (playCancelled) return
    inputText.value += fullText[i]
    await sleep(interval)
  }
  isTyping.value = false
}

// 自动点击确定的效果
const triggerConfirmEffect = async () => {
  if (playCancelled) return
  sendBtnActive.value = true
  await sleep(200)
  sendBtnActive.value = false
}

// 播放预设聊天记录：我方自动逐字输入 → 自动确定 → 对方直接回复，依次循环
const playRecords = async () => {
  clearPlayTimers()
  playCancelled = false
  executing.value = true
  for (const record of chatRecords) {
    if (playCancelled) return
    if (record.role === 'user') {
      // 非首条指令：等待 1 秒后再开始输入下一条我方指令
      if (messageList.value.length > 0) {
        await sleep(1000)
        if (playCancelled) return
      }
      // 我方：输入框逐字输入
      await typeText(record.text)
      if (playCancelled) return
      // 自动点击确定
      await triggerConfirmEffect()
      if (playCancelled) return
      // 内容加入消息列表
      messageList.value.push({ role: 'user', text: record.text })
      inputText.value = ''
      scrollToBottom()
    } else {
      // 对方：回复内容直接显示
      await sleep(300)
      if (playCancelled) return
      messageList.value.push({ role: 'assistant', text: record.text })
      scrollToBottom()
    }
  }
  executing.value = false
  ElMessage({ message: '导调指令执行成功！', type: 'success', customClass: 'ai-el-msg' })
}

const onConfirm = () => {
  const text = inputText.value.trim()
  if (!text) {
    ElMessage({ message: '请输入导调指令内容后再发送', type: 'warning', customClass: 'ai-el-msg' })
    return
  }
  if (executing.value) return

  // 触发关键词：自动播放预设聊天记录（不在列表中显示「开始执行指令」这条输入）
  if (text === PLAY_TRIGGER) {
    inputText.value = ''
    // ElMessage({ message: '导调指令正在执行中...', type: 'info', customClass: 'ai-el-msg', duration: 0 })
    playRecords()
    return
  }

  // 其它输入：原有逻辑
  messageList.value.push({ role: 'user', text })
  inputText.value = ''
  scrollToBottom()
  executing.value = true
  aiThinking.value = true
  ElMessage({ message: '导调指令正在执行中...', type: 'info', customClass: 'ai-el-msg', duration: 0 })
  scrollToBottom()
  setTimeout(() => {
    executing.value = false
    aiThinking.value = false
    ElMessage.closeAll()
    ElMessage({ message: '导调指令执行成功！', type: 'success', customClass: 'ai-el-msg' })
    messageList.value.push({ role: 'ai', text: '导调指令已成功执行。' })
    scrollToBottom()
  }, 2000)
}

onUnmounted(() => {
  clearPlayTimers()
})
</script>

<style lang="less" scoped>
@primary: #11b5ec;
@primary-bright: #00c7fb;
@panel-bg: rgba(2, 26, 70, 0.92);
@border: #0372a6;
@text: #d1f6ff;

.ai-chat-wrap {
  position: fixed;
  right: 30px;
  bottom: 30px;
  z-index: 9999;
}

// ===== 悬浮按钮 =====
.ai-float-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  background: radial-gradient(circle, rgba(17, 181, 236, 0.35) 0%, rgba(2, 26, 70, 0.6) 100%);
  border: 1px solid @border;
  box-shadow: 0 0 12px rgba(17, 181, 236, 0.4);
  transition: all 0.3s ease;
  animation: ai-float 3s ease-in-out infinite;

  img {
    width: 32px;
    height: 32px;
    filter: brightness(0.85);
    transition: filter 0.3s ease;
  }

  &:hover {
    box-shadow: 0 0 20px rgba(17, 181, 236, 0.7);
    transform: scale(1.08);
  }

  // 高亮状态
  &.active {
    animation: none;
    box-shadow: 0 0 28px rgba(0, 199, 251, 0.95);
    border-color: @primary-bright;

    img {
      filter: brightness(1.4) drop-shadow(0 0 6px @primary-bright);
    }
  }
}

@keyframes ai-float {

  0%,
  100% {
    transform: translateY(0);
  }

  50% {
    transform: translateY(-6px);
  }
}

// ===== 聊天面板 =====
.ai-chat-panel {
  position: fixed;
  top: 11%;
  right: 3px;
  width: 400px;
  height: 800px;
  display: flex;
  flex-direction: column;
  background: @panel-bg;
  border: 1px solid @border;
  border-radius: 10px;
  overflow: hidden;
  box-shadow: 0 0 30px rgba(16, 146, 213, 0.6),
    inset 0 0 30px rgba(17, 181, 236, 0.08);
  backdrop-filter: blur(6px);
  animation: panel-glow 3s ease-in-out infinite;
}

@keyframes panel-glow {

  0%,
  100% {
    box-shadow: 0 0 30px rgba(16, 146, 213, 0.6), inset 0 0 30px rgba(17, 181, 236, 0.08);
  }

  50% {
    box-shadow: 0 0 42px rgba(0, 199, 251, 0.85), inset 0 0 30px rgba(17, 181, 236, 0.15);
  }
}

// 头部
.ai-header {
  height: 56px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  background: linear-gradient(90deg, rgba(17, 181, 236, 0.45) 0%, rgba(2, 26, 70, 0.2) 100%);
  border-bottom: 1px solid @border;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    left: 0;
    bottom: 0;
    width: 100%;
    height: 1px;
    background: linear-gradient(90deg, transparent, @primary-bright, transparent);
    animation: scan-line 2.5s linear infinite;
  }

  &__title {
    display: flex;
    align-items: center;
    font-size: 20px; // 字体调大
    font-weight: 700;
    color: @text;
    letter-spacing: 2px;
    text-shadow: 0 0 8px rgba(0, 199, 251, 0.6);
  }

  &__avatar {
    width: 34px;
    height: 34px;
    margin-right: 10px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    color: @primary-bright;
    background: radial-gradient(circle, rgba(17, 181, 236, 0.4) 0%, rgba(2, 26, 70, 0.3) 100%);
    border: 1px solid @primary;
    box-shadow: 0 0 10px rgba(17, 181, 236, 0.6);
    animation: avatar-pulse 2s ease-in-out infinite;
  }

  &__close {
    font-size: 26px;
    line-height: 1;
    color: @text;
    cursor: pointer;
    opacity: 0.7;
    transition: opacity 0.2s, transform 0.2s;

    &:hover {
      opacity: 1;
      transform: rotate(90deg);
    }
  }
}

@keyframes scan-line {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

@keyframes avatar-pulse {

  0%,
  100% {
    box-shadow: 0 0 10px rgba(17, 181, 236, 0.6);
  }

  50% {
    box-shadow: 0 0 18px rgba(0, 199, 251, 0.95);
  }
}

// 内容部
.ai-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
}

.ai-message-list {
  flex: 1;
  overflow-y: auto;
  padding: 14px;
  display: flex;
  flex-direction: column;
  gap: 12px;

  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-thumb {
    background: rgba(17, 181, 236, 0.5);
    border-radius: 3px;
  }
}

.ai-empty {
  margin: auto;
  color: rgba(209, 246, 255, 0.55);
  font-size: 13px;
  text-align: center;
}

.ai-msg {
  display: flex;
  align-items: flex-start;
  gap: 8px;

  &.user {
    flex-direction: row-reverse;

    .ai-msg__bubble {
      background: linear-gradient(135deg, @primary 0%, #0a87b0 100%);
      color: #fff;
      border-color: transparent;
    }
  }

  &__avatar {
    flex-shrink: 0;
    width: 30px;
    height: 30px;
    border-radius: 50%;
    background: rgba(17, 181, 236, 0.25);
    border: 1px solid @primary;
    color: @primary-bright;
    font-size: 12px;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &__bubble {
    max-width: 240px;
    padding: 8px 12px;
    font-size: 13px;
    line-height: 1.5;
    color: @text;
    background: rgba(17, 181, 236, 0.12);
    border: 1px solid rgba(17, 181, 236, 0.3);
    border-radius: 8px;
    word-break: break-all;
  }
}

// 打字动画
.ai-typing {
  display: flex;
  gap: 4px;
  align-items: center;

  .dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: @primary-bright;
    animation: typing 1.2s infinite ease-in-out;

    &:nth-child(2) {
      animation-delay: 0.2s;
    }

    &:nth-child(3) {
      animation-delay: 0.4s;
    }
  }
}

@keyframes typing {

  0%,
  60%,
  100% {
    transform: translateY(0);
    opacity: 0.5;
  }

  30% {
    transform: translateY(-5px);
    opacity: 1;
  }
}

// 消息进入动画
.msg-enter-active {
  transition: all 0.35s cubic-bezier(0.4, 0, 0.2, 1);
}

.msg-enter-from {
  opacity: 0;
  transform: translateY(12px) scale(0.9);
}

.ai-textarea-wrap {
  flex-shrink: 0;
  padding: 10px 14px;
  border-top: 1px solid rgba(3, 114, 166, 0.4);
}

.ai-textarea {
  width: 100%;
  resize: none;
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid @border;
  border-radius: 6px;
  color: @text;
  font-size: 13px;
  line-height: 1.5;
  padding: 8px 10px;
  outline: none;
  box-sizing: border-box;
  transition: border-color 0.2s, box-shadow 0.2s;

  &::placeholder {
    color: rgba(194, 215, 238, 0.45);
  }

  &:focus {
    border-color: @primary;
    box-shadow: 0 0 8px rgba(17, 181, 236, 0.4);
  }

  // 自动输入中：边框高亮 + 闪烁光标
  &.typing {
    border-color: @primary-bright;
    box-shadow: 0 0 10px rgba(0, 199, 251, 0.55);
    caret-color: @primary-bright;
    animation: typing-cursor 1s step-end infinite;
  }
}

@keyframes typing-cursor {
  0%, 100% {
    box-shadow: 0 0 10px rgba(0, 199, 251, 0.55);
  }
  50% {
    box-shadow: 0 0 4px rgba(0, 199, 251, 0.25);
  }
}

// 脚部
.ai-footer {
  flex-shrink: 0;
  padding: 10px 14px 14px;
  display: flex;
  justify-content: flex-end;
}

.ai-send-btn {
  background: var(--img-button-bg);
  width: 100px;
  height: 35px;
  color: var(--text-primary);
  border-radius: 3px;
  margin: 0px 1px;
  cursor: pointer;
  border: none;
  padding: 0;
  font-size: 15px;
  display: block;
  text-align: center;
  line-height: 35px;
  transition: all 0.3s ease;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  box-shadow: 0 0 5px var(--glow-shadow);
  letter-spacing: 6px;
  filter: brightness(0.9);

  &:hover:not(:disabled) {
    box-shadow: 0 0 10px var(--el-button-primary-hover-bg);
    color: var(--text-primary);
    filter: brightness(1.05);
  }

  &:not(:disabled):hover {
    box-shadow: 0 0 14px rgba(0, 199, 251, 0.7);
    transform: translateY(-1px);

    &::before {
      left: 100%;
    }
  }

  &:active {
    transform: translateY(0);
  }

  // 自动点击确定的效果
  &.btn-active {
    transform: translateY(1px) scale(0.96);
    box-shadow: 0 0 18px rgba(0, 199, 251, 0.9);
    filter: brightness(1.3);
  }

  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
  }
}

// 弹出动画
.ai-pop-enter-active,
.ai-pop-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transform-origin: top right;
}
.ai-pop-enter-from,
.ai-pop-leave-to {
  opacity: 0;
  transform: scale(0.85) translateY(-20px);
}
</style>

<style lang="less">
// ElMessage 科技蓝样式
.ai-el-msg {
  background: rgba(2, 26, 70, 0.95) !important;
  border: 1px solid #0372a6 !important;
  color: #d1f6ff !important;
  box-shadow: 0 0 18px rgba(16, 146, 213, 0.55) !important;

  .el-message__content {
    color: #d1f6ff !important;
  }
}
</style>
