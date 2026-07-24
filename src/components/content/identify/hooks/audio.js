import emitter from '@/utils/eventbus'
// 新增函数：将文件流转换为可播放的URL
const convertBlobToUrl = (blob) => {
  return new Promise((resolve) => {
    // 创建一个Blob对象
    const audioBlob = new Blob([blob], { type: 'audio/wav' }) // 根据实际音频格式调整type
    // 创建可访问的URL
    const audioUrl = URL.createObjectURL(audioBlob)
    resolve(audioUrl)
  })
}

const playAudio = (dataPath, store, textVal) => {
  // 语音文件路径（支持 mp3/wav/ogg 等主流格式）
  const audio = new Audio(dataPath)

  // 播放（返回 Promise，可捕获播放失败）
  audio.play().catch((error) => {
    console.error('播放失败：', error)
    // 常见原因：浏览器要求用户交互后才能播放（如点击/触摸）
    console.log(textVal.value)

    emitter.emit('configVoice', textVal.value)
    setTimeout(() => {
      console.log('识别动画总时长')

      store.state.sceneModule.showIdentify = false
    }, identifyShowTime) // (identifyDuration * 3 + 10) * 1000  识别动画总时长
    // }, ((identifyDuration * 3 + 5) * 1000) / window.EarthViewer.clock.multiplier) // (identifyDuration * 3 + 10) * 1000  识别动画总时长
  })

  // 在音频播放结束后释放资源
  audio.addEventListener('loadstart', () => {
    // 可以在这里添加加载开始的逻辑
  })

  audio.addEventListener('ended', () => {
    // 播放结束后释放URL资源
    console.log('ended')
    store.state.sceneModule.showIdentify = false
    URL.revokeObjectURL(dataPath)
  })
}

const audio = {
  convertBlobToUrl,
  playAudio
}

export default audio
