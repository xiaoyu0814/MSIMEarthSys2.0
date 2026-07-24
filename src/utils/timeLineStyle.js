/*
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-01-15 11:00:22
 * @LastEditors: ZX Li
 * @LastEditTime: 2024-01-16 14:44:18
 */
//cesium时钟时间格式化
function CesiumTimeFormatter(datetime, viewModel) {
  var julianDT = new window.MSIMEarth.JulianDate()
  window.MSIMEarth.JulianDate.addHours(datetime, 0, julianDT)
  var gregorianDT = window.MSIMEarth.JulianDate.toGregorianDate(julianDT)

  let hour = gregorianDT.hour + ''
  let minute = gregorianDT.minute + ''
  let second = gregorianDT.second + ''
  return `${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(
    2,
    '0'
  )}`
}
//cesium时钟日期格式化
function CesiumDateFormatter(datetime, viewModel, ignoredate) {
  var julianDT = new window.MSIMEarth.JulianDate()
  window.MSIMEarth.JulianDate.addHours(datetime, 0, julianDT)
  var gregorianDT = window.MSIMEarth.JulianDate.toGregorianDate(julianDT)

  return `${gregorianDT.year}/${gregorianDT.month}/${gregorianDT.day}`
}
//cesium时间轴格式化
function CesiumDateTimeFormatter(datetime, viewModel, ignoredate) {
  var julianDT = new window.MSIMEarth.JulianDate()
  window.MSIMEarth.JulianDate.addHours(datetime, 0, julianDT)
  var gregorianDT = window.MSIMEarth.JulianDate.toGregorianDate(julianDT)

  let hour = gregorianDT.hour + ''
  let minute = gregorianDT.minute + ''
  let second = gregorianDT.second + ''
  return `${gregorianDT.year}-${gregorianDT.month}-${
    gregorianDT.day
  } ${hour.padStart(2, '0')}:${minute.padStart(2, '0')}:${second.padStart(
    2,
    '0'
  )}`
}

function setTimeLimeStyle() {
  window.MSIMEarth.Timeline.prototype.makeLabel = CesiumDateTimeFormatter

  window.EarthViewer.animation.viewModel.dateFormatter = CesiumDateFormatter
  window.EarthViewer.animation.viewModel.timeFormatter = CesiumTimeFormatter
}
export { setTimeLimeStyle }
