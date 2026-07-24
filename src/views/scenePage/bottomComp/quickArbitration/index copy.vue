<template>
  <div class="logSteps-container">
    <div class="stageBox">
      <div
        class="stageChild"
        v-for="(item, index) in state.stageDescriptionData"
        :key="index"
      >
        <div class="stageTitle" :style="item.title.sty">
          {{ item.title.name }}
        </div>
        <div class="stageContent" @click="showStageDescription(item)">
          <div class="numberDiv" :style="item.bg">
            {{ item.value }}
          </div>
        </div>
      </div>
    </div>
    <div class="stageLine"></div>
  </div>
</template>

<script setup>
import emitter from '@/utils/eventbus'
import { computed, onMounted, reactive, watch } from 'vue'
import store from '@/store'

const state = reactive({
  active: 0,
  stageDescriptionData: [
    {
      value: 1,
      title: {
        name: '前出接敌',
        sty: null
      },
      bg: null
    },
    {
      value: 2,
      title: {
        name: '探测发现',
        sty: null
      },
      bg: null
    },
    {
      value: 3,
      title: {
        name: '干扰对抗',
        sty: null
      },
      bg: null
    },
    {
      value: 4,
      title: {
        name: '目标锁定',
        sty: null
      },
      bg: null
    },
    {
      value: 5,
      title: {
        name: '目标分配',
        sty: null
      },
      bg: null
    },
    {
      value: 6,
      title: {
        name: '瞄准打击',
        sty: null
      },
      bg: null
    },
    {
      value: 7,
      title: {
        name: '毁伤评估',
        sty: null
      },
      bg: null
    }
  ]
})
watch(
  () => state.active,
  (val) => {
    changeLogState(val)
  }
)
watch(
  () => store.state.sceneModule.process,
  (val) => {
    state.stageDescriptionData.map((item) => {
      if (item.title.name == val) {
        state.active = item.value
        if (state.active == 7) {
          setTimeout(() => {
            state.active = 8
          }, 1000)
        }
      }
    })
  }
)

onMounted(() => {
  emitter.on('changeLogState', (val) => {
    state.active = val
  })
  changeLogState(state.active)
  // let timer = setInterval(() => {
  //   state.active++
  //   if (state.active == 8) {
  //     clearInterval(timer)
  //   }
  // }, 2000);
})
const changeLogState = (active) => {
  state.stageDescriptionData.forEach((item, index) => {
    if (index + 1 < active) {
      item.title.sty = {
        color: '#0cf394',
        fontSize: '25px',
        fontWeight: '800'
      }
      item.bg = {
        backgroundImage:
          'url(' +
          require('@/assets/image/bottomStageDescription/完成icon.png') +
          ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      }
      item.value = ''
    } else if (index + 1 == active) {
      item.title.sty = {
        color: '#fed615',
        fontSize: '25px',
        fontWeight: '800'
      }
      item.bg = {
        backgroundImage:
          'url(' +
          require('@/assets/image/bottomStageDescription/步骤2.png') +
          ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      }
      item.value = index + 1
    } else if (index + 1 > active || active == 0) {
      item.title.sty = {
        color: '#63edff'
      }
      item.bg = {
        backgroundImage:
          'url(' +
          require('@/assets/image/bottomStageDescription/步骤1.png') +
          ')',
        backgroundRepeat: 'no-repeat',
        backgroundSize: '100% 100%'
      }
      item.value = index + 1
    }
  })
}
const showStageDescription = (item) => {
  switch (item.title.name) {
    case '毁伤评估':
      if (store.state.sceneModule.process == '毁伤评估') {
        emitter.emit('handleConclusionPlan', true)
      }
      break

    default:
      break
  }
}
</script>

<style lang="less" scoped>
.logSteps-container {
  position: absolute;
  left: calc(50% - 650px);
  bottom: 20px;
  // height: 60px;
  // width: 1050px;
  font-family: Georgia, serif;

  // position: relative;
  display: flex;
  justify-content: center;

  .stageBox {
    width: 1300px;
    height: 100px;
    display: flex;
    justify-content: center;
    z-index: 2;

    .stageChild {
      width: 16.67%;
      height: 100%;

      .stageTitle {
        height: 20%;
        text-align: center;
        font-size: 20px;
        font-weight: '600';
      }

      .stageContent {
        height: 80%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        .numberDiv {
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          font-size: 16px;
          font-weight: 700;
          color: #04244c;
          // background: crimson;
        }
      }
    }
  }

  .stageLine {
    position: absolute;
    top: 58%;
    height: 1px;
    width: 90%;
    background: cornsilk;
  }
}
</style>
