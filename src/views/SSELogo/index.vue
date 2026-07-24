<template>
  <div id="particles-js" class="main">
    <div class="main_con">
      <info-header></info-header>
      <div class="eventState">
        <el-select
          v-model="state.eventState"
          placeholder="请选择"
          size="small"
          @change="selectChanged"
        >
          <el-option
            v-for="item in state.stateList"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
      </div>
      <info-Panel :sseEventType="state.curSSEEvent"></info-Panel>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref, defineProps, watch } from 'vue'
import emitter from '@/utils/eventbus'

import InfoHeader from './components/InfoHeader.vue'
import InfoPanel from './components/InfoPanel.vue'

const state = reactive({
  curSelect: '',
  eventState: '',
  stateList: [
    {
      label: '时间',
      labelSSE: 'AT',
      key: '0',
      value: '时间'
    },
    {
      label: '场景事件',
      labelSSE: 'state',
      key: '1',
      value: '场景事件'
    },
    {
      label: '添加平台',
      labelSSE: 'PA',
      key: '2',
      value: '添加平台'
    },
    {
      label: '平台销毁',
      labelSSE: 'PD',
      key: '3',
      value: '平台销毁'
    },
    {
      label: '场景操控',
      labelSSE: 'control',
      key: '4',
      value: '场景操控'
    }
  ],
  curSSEEvent: '',
  curEventLabelSSE: '',
  SSEEventList: ['PA', 'state', 'PD', 'Voice', 'AT', 'Pausing', 'Resuming']
})
// 选择事件主题
const selectChanged = (value) => {
  console.log('select', value)
  state.curSSEEvent = value
  const selectedOption = state.stateList.find((opt) => opt.value === value)
  state.curEventLabelSSE = selectedOption.labelSSE
  emitter.emit('clearList')
}
// 初始化SSE
const initSSE = () => {
  let side = 'admin'
  let curSceneIDArr = new Date().getTime()
  let url = `${serverUrls.serversCommunication}EventSourceController/v1/getMsg/${side}@${curSceneIDArr}` //SSE连接用的URL参数
  let sse = new EventSource(url)
  let msg = null
  sse.onopen = () => {
    console.log('Connection to server opened.' + curSceneIDArr)
  }

  sse.onerror = () => {
    console.log('EventSource failed.' + curSceneIDArr)
  }
  sse.onmessage = (e) => {
    console.log('msg' + e)
  }
  for (let i = 0; i < state.SSEEventList.length; i++) {
    const event = state.SSEEventList[i]
    sse.addEventListener(event, function (json) {
      if (json.type === state.curEventLabelSSE) {
        msg = json.data //JSON.parse(json.data)
        emitter.emit('sseMsg', msg)
      }
    })
  }

  sse.addEventListener('Pausing', function (json) {
    if (state.curEventLabelSSE === 'control') {
      msg = json.data //JSON.parse(json.data)
      emitter.emit('sseMsg', msg)
    }
  })
  sse.addEventListener('Resuming', function (json) {
    if (state.curEventLabelSSE === 'control') {
      msg = json.data //JSON.parse(json.data)
      emitter.emit('sseMsg', msg)
    }
  })
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
.eventState {
  position: absolute;
  top: 46px;
  right: 3px;
}
:deep(.el-select) {
  --el-select-border-color-hover: transparent !important;
  --el-select-input-focus-border-color: transparent !important;
}
</style>
