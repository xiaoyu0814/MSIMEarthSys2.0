import { onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import emitter from '@/utils/eventbus'

export default function () {
  let voices = []
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices
  }
  const utterance = new SpeechSynthesisUtterance()
  let isSpeaking = false
  let isPaused = false
  // 配置播放语音
  emitter.on('configVoice', (val) => {
    if (isSpeaking) {
      window.speechSynthesis.pause()
      // pauseButton.disabled = true
      // updateButtons()
      return
    }
    window.speechSynthesis.cancel()
    utterance.text = val
    // utterance.voice =
    //voices.find((voice) => voice.name === voiceSelect.value)
    utterance.lang = 'zh-CN' //langSelect.value
    utterance.rate = 1 //rateRange.value
    utterance.volume = 1 //volumeRange.value
    utterance.pitch = 1 //pitchRange.value
    window.speechSynthesis.speak(utterance)
    isSpeaking = true
    // updateButtons()
  })

  // 暂停
  emitter.on('pauseVoice', (val) => {
    if (!isSpeaking || isPaused) return
    window.speechSynthesis.pause()
    isPaused = true
    // updateButtons()
  })

  // 重置
  emitter.on('resumeVoice', (val) => {
    if (!isSpeaking || !isPaused) return
    window.speechSynthesis.resume()
    isPaused = false
    // updateButtons()
  })
  // 退出
  emitter.on('cancelVoice', (val) => {
    if (!isSpeaking) return
    window.speechSynthesis.cancel()
    isSpeaking = false
    isPaused = false
    // updateButtons()
  })
  // 当朗读结束时更新状态
  utterance.onend = function () {
    isSpeaking = false
    // updateButtons()
  }

  // 当朗读出错时更新状态
  utterance.onerror = function () {
    isSpeaking = false
    // updateButtons()
  }

  // 页面加载完成后立即尝试填充语音列表
  populateVoices()
  // 如果在页面加载时语音列表不可用，那么当它变得可用时填充语音列表
  if (speechSynthesis.onvoiceschanged !== undefined) {
    speechSynthesis.onvoiceschanged = populateVoices
  }
  function populateVoices() {
    voices = speechSynthesis.getVoices()
    // voiceSelect.innerHTML = ''
    voices.forEach((voice) => {
      const option = document.createElement('option')
      option.textContent = voice.name + ' (' + voice.lang + ')'
      option.value = voice.name
      // voiceSelect.appendChild(option)
    })
  }
  return {}
}
