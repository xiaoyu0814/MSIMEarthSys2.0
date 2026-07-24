<!--
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2023-11-15 19:39:05
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2024-01-09 16:06:49
 * @FilePath: \BB\src\components\header\components\time.vue
 * @Description: 时间组件
-->
<template>
  <div id="time">
    <div>
      <span class="timeTitle">天文时间：</span>{{ vueData.astronomicalTime }}
    </div>
    <div v-if="vueData.roleName != '训练数据管理系统'">
      <span class="timeTitle">作战时间：</span>{{ vueData.operationalTime }}
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
let vueData = reactive({
  astronomicalTime: '',
  operationalTime: '0000年00月00日 00:00:00',
  roleName: sessionStorage.getItem('roleName')
})

onMounted(() => {
  getAstronomicalTime()
  setInterval(() => {
    getAstronomicalTime()
  }, 1000)
})

/**
 * @description 获取天文时间
 */
let getAstronomicalTime = () => {
  let date = new Date()
  let year = date.getFullYear()
  let month =
    date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
  let day = date.getDate() < 10 ? '0' + date.getDate() : date.getDate()
  let hours = date.getHours() < 10 ? '0' + date.getHours() : date.getHours()
  let minutes =
    date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes()
  let seconds =
    date.getSeconds() < 10 ? '0' + date.getSeconds() : date.getSeconds()
  vueData.astronomicalTime = `${year}年${month}月${day}日 ${hours}:${minutes}:${seconds}`
}
</script>

<style lang="less" scoped>
#time {
  text-align: right;
  .timeTitle {
    color: #06c4ff;
  }
}
</style>
