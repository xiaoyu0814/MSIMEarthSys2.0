<template>
  <div id="particles-js" class="main">
    <div class="main_con">
      <info-header></info-header>
      <info-Panel
        :platformCountHeader="middlePlafromCount"
        :sseMessage="sseMessage"
      ></info-Panel>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, defineProps, watch } from 'vue'
import emitter from '@/utils/eventbus'

import InfoHeader from './components/InfoHeader.vue'
import InfoPanel from './components/InfoPanel.vue'
// 解析分发消息体
const getMessage = (e) => {
  let msg = JSON.parse(e.data)
  // console.log(msg)
  switch (msg.Type) {
    case 'RE_STrackInit':
      emitter.emit('RE_STrackInit', msg)
      break
    case 'RE_STrackDrop':
      break
    case 'RE_LTrackInit':
      break
    case 'RE_LTrackDrop':
      break
    case 'Task_Aign':
      emitter.emit('Task_Aign', msg)
      break
    case 'Task_Cancel':
      break
    case 'Task_Completed':
      break
    case 'RE_WeaponF':
      emitter.emit('RE_WeaponF', msg)
      break
    case 'RE_WeaponT':
      break
    case 'Weapon_WH':
      break
    case 'RE_JamA':
      break
    case 'RE_JamT':
      break
    case 'RE_JamE':
      break
    case 'RE_JamS':
      emitter.emit('RE_JamS', msg)
      break
    case 'SU':
      break
    case 'Statistics':
      break
    case 'Comment':
      break

    default:
      break
  }
}
// 初始化SSE
const initSSE = () => {
  let side = 'admin'
  let curSceneIDArr = new Date().getTime()
  let url = `${serverUrls.serversCommunication}EventSourceController/v1/getMsg/${side}@${curSceneIDArr}` //SSE连接用的URL参数
  let sse = new EventSource(url)
  sse.onopen = () => {
    console.log('Connection to server opened.' + curSceneIDArr)
  }

  sse.onerror = () => {
    console.log('EventSource failed.' + curSceneIDArr)
  }
  sse.onmessage = (e) => {
    console.log('msg' + e)
  }
  sse.addEventListener('state', getMessage)
}
onMounted(() => {
  initSSE()
})
</script>

<style lang="less" scoped>
@import '@/assets/css/infoStatistic/infoStatistic.css';
@import '@/assets/css/infoStatistic/reset.css';

.infomation-statistics {
  width: 100%;
  height: 100%;
  font-size: 12px;
  position: relative;
  background: url(@/assets/images/infoStatistics/background.jpg) no-repeat;
  background-size: cover;

  .info_statistics_main_con {
    position: absolute;
    width: 97%;
    height: 95%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    margin: auto;
    /* background: white; */
  }
}
</style>
