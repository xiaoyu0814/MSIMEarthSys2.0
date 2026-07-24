import store from '@/store'
export const playVoice = function (voiceUrl, time) {
  let waitTime = time ? time : 1000
  const p = new Promise((resolve, reject) => {
    console.log('voiceUrl', voiceUrl)
    let url = ''
    if (!voiceUrl) return
    if (!store.getters.getSystemSound) return
    if (voiceUrl.indexOf('http://') > -1) {
      url = voiceUrl
    } else {
      // url = require(`/public/static/speechSounds/${voiceUrl}`)
    }
    // url = voiceUrl
    let audio = new Audio(url)
    // 播放声音,如果上一次声音存在，则暂停
    // if (store.state.sceneModule.voiceUrl != null) {
    //   store.state.sceneModule.voiceUrl.pause()
    // }
    store.state.sceneModule.voiceUrl = audio

    audio.play()
    //重置界面按钮状态，将新语音赋值给store

    audio.addEventListener(
      'ended',
      function () {
        //语音播放结束后，将语音置空，避免点击播放暂停按钮重复播放本条语音
        store.state.sceneModule.voiceUrl = null
        setTimeout(() => {
          resolve()
        }, waitTime)
      },
      false
    )
  })
  return p
}
