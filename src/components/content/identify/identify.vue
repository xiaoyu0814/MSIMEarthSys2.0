<!--
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2025-06-30 11:06:47
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2025-12-17 14:56:27
 * @FilePath: \gfdx\src\components\content\identify\identify.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="identity">
    <section id="header" ref="header">
      <div class="wrap">
        <div class="ui-grid">
          <div class="ui-box">
            <h1 class="title" slot="content" :class="classObject">
              <!-- <span style="line-height: 60px; color: aqua">{{ title }}</span> -->
              <span class="content1">{{ textVal }} <em></em></span>
              <span class="content2" style="color: blue"> <em></em></span>
            </h1>
          </div>
        </div>
      </div>
    </section>
    <scan class="scanStyle"></scan>
  </div>
</template>

<script setup>
import scan from '@/components/content/scan/scan'
import { useStore } from 'vuex'
import { onMounted, nextTick, reactive, toRefs, ref, computed } from 'vue'
import emitter from '@/utils/eventbus'
import { speechSynthesis, audio } from './hooks/index'
import { tts } from '@/service/videoServer/videoManagement'
const store = useStore()

const title = ref('')
const textVal = ref('')
textVal.value = store.state.sceneModule.identifyInfo
const isActive1 = ref(false)
const isActive2 = ref(false)
const isActive3 = ref(true)

// 定义一个计算属性，它返回一个对象
const classObject = computed(() => {
  return {
    active1: isActive1.value,
    active2: isActive2.value,
    active3: isActive3.value
  }
})
onMounted(() => {
  nextTick(() => {
    let options = store.state.sceneModule.identifyColor
    switch (options.jd) {
      case 0:
        isActive1.value = true
        isActive2.value = false
        isActive3.value = false
        break
      case 1:
        isActive1.value = false
        isActive2.value = true
        isActive3.value = false
        break
      case 2:
        isActive1.value = false
        isActive2.value = false
        isActive3.value = true
        break
      default:
        isActive1.value = true
        isActive2.value = false
        isActive3.value = false
        break
    }
    introAnimation(options)
  })
})
// 播放语音
speechSynthesis()
let sysSoundShow = Number(window.localStorage.getItem('systemSoundEnabled'))
console.log('sysSoundShow', sysSoundShow)

// if (sysSoundShow) {
let text = textVal.value
const useTTS = () => {
  if (!text || !text.trim()) {
    console.log('textVal.value为空或只包含空格，跳过语音播报')
    store.state.sceneModule.showIdentify = false
    return
  }
  const punctuationRegex = /^[^\p{L}\p{N}]*$/u
  if (punctuationRegex.test(text.trim())) {
    console.log('textVal.value只包含标点符号，跳过语音播报')
    store.state.sceneModule.showIdentify = false
    return
  }
  if (text.indexOf('、') > -1) {
    text = text.replace(/、/g, '，')
  }

  let params = {
    text: `[breath]${text}[breath]`,
    speaker_id: store.state.sceneModule.speaker
      ? store.state.sceneModule.speaker
      : 'speaker4'
    // text: '不嘛！我就要跟贤者玩！难道他真的是赋能哥？颗秒。',
  }
  console.log('语音请求参数', params)
  tts(params)
    .then(async (res) => {
      if (res) {
        window.identifyShowTime = (text.length / 5) * 1000
        title.value = store.state.sceneModule.identifyTitle
        console.log('title', title.value)
        // 处理文件流并转换为可播放的URL
        const audioUrl = await audio.convertBlobToUrl(res)
        if (textVal.value && textVal.value.length > 0) {
          audio.playAudio(audioUrl, store, textVal)
        }
      } else {
        emitter.emit('configVoice', textVal.value)
      }
    })
    .catch((err) => {
      emitter.emit('configVoice', textVal.value)
    })
}
useTTS()
// }
</script>

<style lang="less" scoped>
@import '@/assets/css/style.css';

.identity {
  z-index: 999;
}

.scanStyle {
  visibility: hidden;
  right: 0;
  left: 0;
  top: 0;
  bottom: 0;
  margin: auto;
}

.active1 {
  font-size: 1.5vw;
  line-height: 1;
}

.active2 {
  font-size: 1.5vw;
  line-height: 1;
}

.active3 {
  font-size: 1.5vw;
  line-height: 1;
}

.title {
  color: aliceblue !important;
}
.content1 {
  font-size: 25px;
}
</style>
