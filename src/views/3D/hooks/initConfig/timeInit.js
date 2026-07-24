import emitter from '@/utils/eventbus'
import store from '@/store/index.js'
// 毫秒转日期
function getSpeTime(timeStr) {
  let time = new Date(timeStr)
  var year = time.getFullYear()
  var month =
    time.getMonth() + 1 < 10 ? '0' + (time.getMonth() + 1) : time.getMonth() + 1
  var date = time.getDate() < 10 ? '0' + time.getDate() : time.getDate()
  var hours = time.getHours() < 10 ? '0' + time.getHours() : time.getHours()
  var minutes =
    time.getMinutes() < 10 ? '0' + time.getMinutes() : time.getMinutes()
  var seconds =
    time.getSeconds() < 10 ? '0' + time.getSeconds() : time.getSeconds()
  return (
    year +
    '-' +
    month +
    '-' +
    date +
    ' ' +
    hours +
    ':' +
    minutes +
    ':' +
    seconds
  )
}
export function timeInit() {
  emitter.on('initSceneTime', (val) => {
    let startTime = new Date('2027/09/12 10:00:00').getTime()
    store.commit('setMsgMessionTime', getSpeTime(startTime))
  })
}
