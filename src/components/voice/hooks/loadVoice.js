import { ref, onMounted, reactive, watch, onBeforeUnmount } from 'vue'
// import { useStore } from 'vuex'
import store from '@/store'
import emitter from '@/utils/eventbus'
export default function () {
  // const store = useStore()
  // const destroyWatch = function() {
  //   watch(
  //     () => store.state.earthData.loadVioce,
  //     (newValue, oldValue) => {
  //       if (newValue.cmd == oldValue.cmd) {
  //         return false
  //       }
  //       // let audio = new Audio(
  //       //   require(`/public/static/speechSounds/${newValue.cmd}.wav`)
  //       // )
  //       let url = ''
  //         // if (!newValue.msg) {
  //       url = require(`/public/static/speechSounds/${newValue.cmd}.wav`)
  //         // } else {
  //         // url = path.speechPath + 'text2speech_well?text=' + newValue.msg
  //         // }
  //       let audio = new Audio(url)
  //         // 播放声音,如果上一次声音存在，则暂停
  //       if (store.state.audio != null) {
  //         store.state.audio.pause()
  //       }
  //       //清除定时器，防止语音切换后，上个场景延时发送得消息推送,造成多个语音通视播放
  //       if (store.state.curSecence != 1) {
  //         store.state.timeoutVal.map((item) => {
  //           clearTimeout(item)
  //         })
  //       }
  //       if (store.state.curSecence != 2) {
  //         store.state.timeoutSea.map((item) => {
  //           clearTimeout(item)
  //         })
  //       }
  //       //将当前语音赋值给store
  //       store.state.audio = audio
  //       audio.play()
  //         //重置界面按钮状态
  //         // emitter.emit('resetBtnControl', false)
  //       audio.addEventListener(
  //         'ended',
  //         function() {
  //           if (newValue.callback && audio.ended) {
  //             //语音播放结束后，将语音置空，避免点击播放暂停按钮重复播放本条语音
  //             store.state.audio = null
  //             setTimeout(() => {
  //               newValue.callback()
  //             }, 1000)
  //           }
  //         },
  //         false
  //       )
  //     }
  //   )
  // }
  // const playVoice = function(cmd, msg, action, time) {
  //     let waitTime = time ? time : 1000
  //     const p = new Promise((resolve, reject) => {
  //       // let audio = new Audio(require(`/public/static/speechSounds/${cmd}.wav`))
  //       let url = ''
  //         // if (!msg) {
  //       if (!cmd) return
  //       if (cmd.indexOf('http://') > -1) {
  //         url = cmd
  //       } else {
  //         url = require(`/public/static/speechSounds/${cmd}.wav`)
  //       }
  //       // } else {
  //       //   url = path.speechPath + 'text2speech_well?text=' + msg
  //       // }
  //       let audio = new Audio(url)
  //         // 播放声音,如果上一次声音存在，则暂停
  //       if (store.state.audio != null) {
  //         store.state.audio.pause()
  //       }
  //       store.state.audio = audio
  //         // //清除定时器，防止语音切换后，上个场景延时发送得消息推送,造成多个语音通视播放
  //         // if (store.state.curSecence != 1) {
  //         //   store.state.timeoutVal.map((item) => {
  //         //     clearTimeout(item)
  //         //   })
  //         // }
  //         // if (store.state.curSecence != 2) {
  //         //   store.state.timeoutSea.map((item) => {
  //         //     clearTimeout(item)
  //         //   })
  //         // }
  //       audio.play()
  //         //重置界面按钮状态，将新语音赋值给store
  //       emitter.emit('resetBtnControl', false)
  //       store.state.audio = audio
  //       if (action) {
  //         action()
  //       }
  //       audio.addEventListener(
  //         'ended',
  //         function() {
  //           //语音播放结束后，将语音置空，避免点击播放暂停按钮重复播放本条语音
  //           store.state.audio = null
  //           setTimeout(() => {
  //             resolve()
  //           }, waitTime)
  //         },
  //         false
  //       )
  //     })
  //     return p
  //   }
  //   // onBeforeUnmount(() => {
  //   //   destroyWatch()
  //   // })
  // return { playVoice, destroyWatch }
}
