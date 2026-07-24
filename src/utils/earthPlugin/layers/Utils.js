/*
 * @Descripttion: 统一公共方法出口
 * @version: 1.0
 * @Author: HK
 * @Date: 2021-06-24 11:01:40
 * @LastEditors: HK
 * @LastEditTime: 2021-06-30 10:18:02
 */

import UtilsHttpQuery from './HttpQuery'

// 生成uuid
function uuid() {
  function S4() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1)
  }
  return (
    S4() +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    '-' +
    S4() +
    S4() +
    S4()
  )
}

// 解析时间
function dateUnmake(date = new Date()) {
  if (!(date instanceof Date)) return
  let year = date.getFullYear()
  let month = date.getMonth() + 1
  let day = date.getDate()
  let hours = date.getHours()
  let minutes = date.getMinutes()
  let seconds = date.getSeconds()
  let weekDay = date.getDay()
  let time = new Date(
    `${year}-${month}-${day} ${hours}:${minutes}:00`
  ).getTime()
  month = (month + '').length == 1 ? '0' + month : month + ''
  day = (day + '').length == 1 ? '0' + day : day + ''
  hours = (hours + '').length == 1 ? '0' + hours : hours + ''
  minutes = (minutes + '').length == 1 ? '0' + minutes : minutes + ''
  seconds = (seconds + '').length == 1 ? '0' + seconds : seconds + ''
  return {
    year,
    month,
    day,
    hours,
    minutes,
    seconds,
    weekDay,
    time
  }
}

/* 
  毫秒转为正常格式时间过滤器 
  编写过滤器传入需要的时间格式，例如：yyyy-MM-dd hh:mm:ss或者yyyy年MM月dd日
  注意：月MM必须大写，目的为了区分月与分，其他都为小写
  时间格式定义：
    参数为0格式：yyyy-MM-dd hh:mm:ss 
    参数为1格式：yyyy-MM-dd 
    参数为2格式：hh:mm:ss 
    参数为3格式：yyyy年MM月dd日 hh时mm分ss秒
    参数为4格式：yyyy年MM月dd日 
    参数为5格式：hh时mm分ss秒
    参数为6格式：yyyy年MM月 
    参数为7格式：yyyy
    参数为8格式：yyyy/MM/dd 
*/
const formatDate = (date, fmt) => {
  var dates = new Date(date)

  if (fmt == 0) {
    fmt = 'yyyy-MM-dd hh:mm:ss'
  } else if (fmt == 1) {
    fmt = 'yyyy-MM-dd'
  } else if (fmt == 2) {
    fmt = 'hh:mm:ss'
  } else if (fmt == 3) {
    fmt = 'yyyy年MM月dd日 hh时mm分ss秒'
  } else if (fmt == 4) {
    fmt = 'yyyy年MM月dd日'
  } else if (fmt == 5) {
    fmt = 'hh时mm分ss秒'
  } else if (fmt == 6) {
    fmt = 'yyyy年MM月'
  } else if (fmt == 7) {
    fmt = 'yyyy'
  } else if (fmt == 8) {
    fmt = 'yyyy/MM/dd'
  } else if (fmt == 9) {
    fmt = 'yyyyMMddhhmmss'
  } else if (fmt == 10) {
    fmt = 'yyyy年MM月dd日 hh时'
  } else if (fmt == 11) {
    fmt = 'MM月dd日 hh时'
  } else if (fmt == 12) {
    fmt = 'MM'
  } else if (fmt == 13) {
    fmt = 'dd日hh时'
  } else if (fmt == 14) {
    fmt = 'hh时'
  } else if (fmt == 15) {
    fmt = 'yyyy年MM月dd日 hh时mm分'
  } else if (fmt == 16) {
    fmt = 'dd日 hh时mm分'
  }
  if (/(y+)/.test(fmt)) {
    fmt = fmt.replace(
      RegExp.$1,
      (dates.getFullYear() + '').substring(4 - RegExp.$1.length)
    )
  }
  let o = {
    'M+': dates.getMonth() + 1,
    'd+': dates.getDate(),
    'h+': dates.getHours(),
    'm+': dates.getMinutes(),
    's+': dates.getSeconds()
  }
  for (let k in o) {
    if (new RegExp(`(${k})`).test(fmt)) {
      let str = o[k] + ''
      fmt = fmt.replace(
        RegExp.$1,
        RegExp.$1.length === 1 ? str : padLeftZero(str)
      )
    }
  }
  return fmt
}

/* 一位数两位数转换 */
const padLeftZero = (str) => {
  return ('00' + str).substring(str.length)
}

export {
  UtilsHttpQuery,
  uuid as UtilsUuid,
  dateUnmake as UtilsDateUnmake,
  formatDate as UtilsFormatDate
}
