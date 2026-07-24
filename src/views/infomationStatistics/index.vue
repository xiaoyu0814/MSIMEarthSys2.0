<template>
  <div id="particles-js" class="main">
    <div class="main_con">
      <info-header
        :platformCountHeader="middlePlafromCount"
        :sseMessage="sseMessage"
        :startTime="startTime"
        :currentSceneInfo="currentSceneInfo"
        :bottomData="{
          ZSTJData: state.ZSTJData,
          ZGTJData: state.ZGTJData,
          youliangData: state.youliangData,
          danyaoData: state.danyaoData,
          SXTJListData: state.SXTJListData,
          JCFXData: state.JCFXData
        }"
      ></info-header>
      <!-- <info-middle
        :platformCountMiddle="middlePlafromCount"
        :sseMessage="sseMessage"
      ></info-middle> -->
      <info-bottom
        :sceneId="state.sceneId"
        :sseMessage="sseMessage"
        @ZSTJData="getZSTJData"
        @ZGTJData="getZGTJData"
        @youliangData="getYouliangData"
        @danyaoData="getDanyaoData"
        @SXTJListData="getSXTJListData"
        @JCFXData="getJCFXData"
      ></info-bottom>
    </div>
  </div>
</template>

<script setup>
import { creatScene } from '@/views/homeHeader/hooks/index'
import { onMounted, reactive, ref, defineProps, watch } from 'vue'
import store from '@/store/index'
import emitter from '@/utils/eventbus'
import InfoHeader from './components/InfoHeader.vue'
import InfoMiddle from './components/InfoMiddle.vue'
import InfoBottom from './components/InfoBottom.vue'
import sseLink from './components/utils/sse'
import EventMQStatistic from './components/utils/mq'
import {
  getCurrentInfo,
  queryExperimentJsonFile,
  getById
} from '@/service/experiment/experiment.js'

let middlePlafromCount = ref(100)

let sseMessage = ref()

let num = ref(0)

let startTime = ref()

let state = reactive({})

let currentSceneInfo = ref({ sampleName: '' })

setInterval(() => {
  middlePlafromCount.value = Math.random() * 100
}, 1000)

const _getCurrentInfo = () => {
  getCurrentInfo().then((res) => {
    if (res.code == 200) {
      if (res.data) {
        currentSceneInfo.value = res.data
        _queryExperimentJsonFile(res.data.sampleId)
        state.sceneId = res.data.sceneId
        let params = {
          id: res.data.sceneId
        }
        getById(params).then((res) => {
          if (res.code == 200) {
            startTime.value = res.data.startTime
          }
        })
      }
      state.timeoutData = window.setTimeout(() => {
        if (res.data) {
          window.clearTimeout(state.timeoutData)
          return
        }
        _getCurrentInfo()
      }, 1000)
    } else {
      ElMessage.error('当前没有运行的实验数据')
    }
  })
}

const _queryExperimentJsonFile = (id) => {
  const params = {
    experimentId: id
  }
  queryExperimentJsonFile(params).then((res) => {
    if (res.code == 200) {
      console.log('res.data', res.data)
      store.commit('setCameraOptionList', res.data)
    } else {
      ElMessage.error(res.data)
    }
  })
}

const getZSTJData = (option) => {
  state.ZSTJData = option
}

const getZGTJData = (option) => {
  state.ZGTJData = option
}

const getYouliangData = (option) => {
  state.youliangData = option
}

const getDanyaoData = (option) => {
  state.danyaoData = option
}

const getSXTJListData = (option) => {
  state.SXTJListData = option
}

const getJCFXData = (data) => {
  state.JCFXData = data
}

const sse_callback = (e) => {
  sseMessage.value = {
    data: e,
    num: num.value++
  }
}

onMounted(() => {
  _getCurrentInfo()
  if (EarthAPP.useSSE) {
    window.sseLink = new sseLink(sse_callback, startTime.value)
  } else {
    console.log('MQ模式')
    window.sseLink = new EventMQStatistic({}, sse_callback, startTime.value)
  }
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
