import { onMounted, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import emitter from '@/utils/eventbus'

// 优化后的语音合成实现
export default function () {
  let voices = []
  const utterance = new SpeechSynthesisUtterance()
  let isSpeaking = false
  let isPaused = false

  // 配置语音合成，优先选择高质量中文语音
  const configureSpeech = () => {
    // 延迟获取语音列表，确保浏览器已加载所有语音
    setTimeout(() => {
      voices = window.speechSynthesis.getVoices()

      // 优先选择年轻的中文语音（男性优先）
      const preferredVoices = [
        // 年轻男性语音 - 优先级1
        voices.find(
          (voice) =>
            voice.lang === 'zh-CN' &&
            voice.name.includes('Microsoft') &&
            (voice.name.includes('Yunfeng') || voice.name.includes('Xiaoyao'))
        ),
        voices.find(
          (voice) =>
            voice.lang === 'zh-CN' &&
            voice.name.includes('Google') &&
            voice.name.includes('Male')
        ),
        // 其他高质量男性语音 - 优先级2
        voices.find(
          (voice) => voice.lang === 'zh-CN' && voice.name.includes('Male')
        ),
        // 年轻女性语音 - 优先级3
        voices.find(
          (voice) =>
            voice.lang === 'zh-CN' &&
            voice.name.includes('Microsoft') &&
            (voice.name.includes('Xiaoxiao') ||
              voice.name.includes('Yunxi') ||
              voice.name.includes('Aoxue'))
        ),
        voices.find(
          (voice) =>
            voice.lang === 'zh-CN' &&
            voice.name.includes('Google') &&
            voice.name.includes('Female')
        ),
        // 其他高质量中文语音 - 优先级4
        voices.find(
          (voice) => voice.lang === 'zh-CN' && voice.name.includes('Microsoft')
        ),
        voices.find(
          (voice) => voice.lang === 'zh-CN' && voice.name.includes('Google')
        ),
        voices.find((voice) => voice.lang === 'zh-CN'),
        // 台湾语音 - 备选
        voices.find(
          (voice) => voice.lang === 'zh-TW' && voice.name.includes('Male')
        ),
        voices.find((voice) => voice.lang === 'zh-TW'),
        // 香港语音 - 备选
        voices.find(
          (voice) => voice.lang === 'zh-HK' && voice.name.includes('Sam')
        ),
        voices.find((voice) => voice.lang === 'zh-HK')
      ]

      // 使用找到的最佳语音
      const bestVoice = preferredVoices.find((voice) => voice !== undefined)
      if (bestVoice) {
        utterance.voice = bestVoice
      }
    }, 100)
  }

  // 初始配置
  const initConfig = () => {
    utterance.lang = 'zh-CN'
    utterance.rate = 0.9 // 稍微放慢语速，提高清晰度
    utterance.volume = 1.0
    utterance.pitch = 1.0
    utterance.voiceURI = 'native'

    // 优化语音质量的配置
    utterance.rate = 0.85 // 减慢语速，使语音更自然
    utterance.pitch = 1.1 // 稍微提高音调，使语音更生动
  }

  // 监听语音列表变化
  if (window.speechSynthesis.onvoiceschanged !== undefined) {
    window.speechSynthesis.onvoiceschanged = configureSpeech
  }

  initConfig()
  configureSpeech()

  // 配置播放语音
  emitter.on('configVoice', (val) => {
    if (isSpeaking) {
      window.speechSynthesis.pause()
      return
    }

    window.speechSynthesis.cancel()
    utterance.text = val

    // 针对中文文本的特殊处理，优化断句
    // 添加适当的停顿标记
    utterance.text = addPauseMarks(val)

    window.speechSynthesis.speak(utterance)
    isSpeaking = true
  })

  // 中文文本断句优化
  const addPauseMarks = (text) => {
    // 在中文标点后添加适当停顿
    return text
      .replace(/([。！？；])/g, '$1\u00A0\u00A0') // 在句号、感叹号、问号、分号后添加两个空格作为停顿
      .replace(/([，、：])/g, '$1\u00A0') // 在逗号、顿号、冒号后添加一个空格作为停顿
  }

  // 暂停
  emitter.on('pauseVoice', (val) => {
    if (!isSpeaking || isPaused) return
    window.speechSynthesis.pause()
    isPaused = true
  })

  // 重置
  emitter.on('resumeVoice', (val) => {
    if (!isSpeaking || !isPaused) return
    window.speechSynthesis.resume()
    isPaused = false
  })

  // 退出
  emitter.on('cancelVoice', (val) => {
    if (!isSpeaking) return
    window.speechSynthesis.cancel()
    isSpeaking = false
    isPaused = false
  })

  // 当朗读结束时更新状态
  utterance.onend = function () {
    isSpeaking = false
  }

  // 当朗读出错时更新状态
  utterance.onerror = function () {
    isSpeaking = false
  }

  return {}
}
