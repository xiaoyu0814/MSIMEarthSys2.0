<template>
  <div class="voiceBoxShow" style="height: auto">
    <div class="voiceBox">
      <img
        :src="icon"
        @mousedown="btnEvent()"
        @mouseup="upEvent()"
        :class="testCss"
      />
    </div>
    <canvas id="canvas" v-show="isSpeaking"></canvas>
    <div class="content-text" v-show="isQuestion">{{ question }}</div>
    <div class="show-container" v-show="!showDia" @click="unfoldAndCollapse">
      <img src="@/assets/image/header/返回_关闭.png" width="25" height="25" />
    </div>
    <div
      class="dialogue arrow_box animate__animated animate__fadeInRight animate__delay-10s"
      :style="controlMapStyle"
      v-show="showDia"
    >
      <div class="title_11">
        <div class="qaTitle">小慧智能问答</div>
        <div
          class="drag"
          @dragstart="dragstart($event)"
          @dragend="dragend($event)"
        ></div>
        <div class="close" @click="close">X</div>
      </div>
      <div class="qacontainer">
        <div v-for="(item, index) in diaList" :key="index">
          <div :class="item.me ? 'ai_sty' : 'my_sty'">
            <img
              :src="
                item.me
                  ? require('../../assets/image/voice/头像1.png')
                  : require('@/assets/image/voice/头像12.png')
              "
              style="width: 30px; height: 30px; margin: 0 10px"
            />
            <div :class="item.me ? 'ai_main' : 'my_main'">
              <div style="margin: 5px 10px; text-align: right">
                {{ item.name }}
              </div>
              <div :class="item.me ? 'ai_chat' : 'my_chat'" class="chat_bg">
                {{ item.content }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="qabtn">
        <el-input
          size="large"
          v-model="textarea"
          :rows="2"
          placeholder="请输入"
        />
        <el-select
          v-model="orderName"
          placeholder="请选择指令"
          @change="changeSelect"
          v-if="isShowOrderTip"
        >
          <el-option
            v-if="isShowOrder"
            v-for="item in orderList"
            :key="item"
            :label="item.commandName"
            :value="item.commandName"
          />
        </el-select>
        <div class="norem-fasong" @click="addQA"></div>
      </div>
    </div>
  </div>
</template>

<script>
import Recorder from 'js-audio-recorder'
const lamejs = require('lamejs')
import {
  parseVoice,
  parseVoiceReplyOfOnePlate,
  parseVoiceReplyOfOnePlateText,
  getCommandName
} from '@/service/voice.js'
import {
  ref,
  watch,
  reactive,
  onBeforeUnmount,
  readonly,
  computed,
  toRefs,
  onBeforeMount,
  onMounted,
  nextTick,
  setTransitionHooks
} from 'vue'
import { useStore } from 'vuex'
import { getMessage } from '../../components/websocket/hooks/index'
import emitter from '@/utils/eventbus'
import loadVoice from './hooks/loadVoice'
// import echartsCom from '@/components/content/echarts/echartsCom.vue'
import { useRouter } from 'vue-router'
// import DataControl from '@/utils/earth/XEarth/dataControl.js'
export default {
  name: 'home',
  components: {
    // echartsCom
  },
  setup() {
    const store = useStore()
    const router = new useRouter()
    // loadVoice()
    const state = reactive({
      controlMapStyle: {}, //语音识别框css位置
      //波浪图-录音
      drawRecordId: null,
      oCanvas: null,
      ctx: null,
      //波浪图-播放
      drawPlayId: null,
      pCanvas: null,
      pCtx: null,
      playTime: 0,
      timer: null,
      voiceContent: '',
      loading: false,
      recorder: null,
      iconSelected: require('@/assets/image/voice/voice2.png'),
      icon: require('@/assets/image/voice/语音_old.png'),
      isSpeaking: false,
      isQuestion: false,
      testCss: 'test1',
      diaList: [
        // {
        //   name: '我',
        //   me: true,
        //   content: '测试'
        // },
        // {
        //   name: '机上僚机管家AI',
        //   me: false,
        //   content: '测试'
        // }
      ],
      question: '',
      showDia: false,
      spaceDown: false,
      textarea: '',
      rehearsal1Data: {},
      airPortList: [],
      airPortList2: [],
      showPlaceList: [],
      weatherData: {},
      fightData: {},
      pdfUrl: '',
      placeTotal: 0,
      placeCurrentPage: 1,
      placePageSize: 10,
      orderName: '',
      orderList: [
        {
          name: '爬升'
        }
      ],
      isShowOrder: store.state.sceneModule.OnePlate.name ? true : false,
      isShowOrderTip: store.state.sceneModule.toolBarType //只在右键快捷菜单显示时候才显示
    })

    const unfoldAndCollapse = () => {
      state.showDia = !state.showDia
    }
    //轮盘拖拽事件
    const dragstart = (event) => {
      // console.log(event)
    }
    const dragend = (event) => {
      // console.log(event)
      state.controlMapStyle = {
        left: event.x + 'px',
        top: event.y + 'px'
      }
    }
    //关闭语音识别框
    const close = () => {
      state.showDia = false
    }
    const startCanvas = () => {
      //录音波浪
      state.oCanvas = document.getElementById('canvas')
      state.ctx = state.oCanvas.getContext('2d')
      //播放波浪
      // state.pCanvas = document.getElementById("playChart");
      // setTimeout(()=>{
      //     state.pCtx = state.pCanvas.getContext("2d");
      // },10)
    }
    // 开始录音
    const startRecorder = () => {
      state.voiceContent = ''
      state.recorder = new Recorder({
        sampleBits: 16, // 采样位数，支持 8 或 16，默认是16
        sampleRate: 48000, // 采样率，支持 11025、16000、22050、24000、44100、48000，根据浏览器默认值，我的chrome是48000
        numChannels: 1 // 声道，支持 1 或 2， 默认是1
        // compiling: false,(0.x版本中生效,1.x增加中)  // 是否边录边转换，默认是false
      })
      state.recorder.start().then(
        () => {
          drawRecord() //开始绘制图片
        },
        (error) => {
          // 出错了
          console.log(`${error.name} : ${error.message}`)
        }
      )
    }
    // 继续录音
    const resumeRecorder = () => {
      state.recorder.resume()
    }
    // 暂停录音
    const pauseRecorder = () => {
      state.recorder.pause()
      state.drawRecordId && cancelAnimationFrame(state.drawRecordId)
      state.drawRecordId = null
    }
    // 结束录音
    const stopRecorder = () => {
      state.recorder.stop()
      state.drawRecordId && cancelAnimationFrame(state.drawRecordId)
      state.drawRecordId = null
      getRecorder()
    }
    // 录音播放
    const playRecorder = () => {
      state.recorder.play()
      drawPlay() //绘制波浪图
      // 播放时长
      state.timer = setInterval(() => {
        try {
          state.playTime = state.recorder.getPlayTime()
        } catch (error) {
          state.timer = null
        }
      }, 100)
    }
    // 暂停录音播放
    const pausePlayRecorder = () => {
      state.recorder.pausePlay()
      // 播放时长
      state.playTime = state.recorder.getPlayTime()
      state.time = null
    }
    // 恢复录音播放
    const resumePlayRecorder = () => {
      state.recorder.resumePlay()
      drawPlay() //绘制波浪图
      // 播放时长
      state.timer = setInterval(() => {
        try {
          state.playTime = state.recorder.getPlayTime()
        } catch (error) {
          state.timer = null
        }
      }, 100)
    }
    // 停止录音播放
    const stopPlayRecorder = () => {
      state.recorder.stopPlay()
      // 播放时长
      state.playTime = state.recorder.getPlayTime()
      state.timer = null
    }
    // 销毁录音
    const destroyRecorder = () => {
      state.recorder.destroy().then(function () {
        state.recorder = null
        state.drawRecordId && cancelAnimationFrame(state.drawRecordId)
        state.drawRecordId = null
      })

      state.timer = null
    }
    /**
     *  获取录音文件
     * */
    const getRecorder = () => {
      // let dataController = new DataControl({
      //   earth: window.PieEarthX,
      //   viewer: window.EarthViewer
      // })
      state.loading = true
      if (state.recorder == null || state.recorder.duration === 0) {
        // state.$message({
        //   message: '请先录音',
        //   type: 'error'
        // })
        // return false
      }

      // let toltime = state.recorder.duration //录音总时长
      // let fileSize = state.recorder.fileSize //录音总大小

      //录音结束，获取取录音数据
      // let PCMBlob = state.recorder.getPCMBlob() //获取 PCM 数据
      // let wav = state.recorder.getWAVBlob() //获取 WAV 数据

      // let channel = state.recorder.getChannelData() //获取左声道和右声道音频数据
      state.recorder.pause() // 暂停录音
      state.timer = null
      const fd = new FormData()
      const blob = state.recorder.getWAVBlob() // 获取wav格式音频数据
      // 此处获取到blob对象后需要设置fileName满足当前项目上传需求，其它项目可直接传把blob作为file塞入formData
      const newbolb = new Blob([blob], { type: 'audio/wav' })
      const fileOfBlob = new File([newbolb], new Date().getTime() + '.wav')
      // console.log(fileOfBlob)
      fd.append('file', fileOfBlob)
      // fd.append('uuid', store.state.client_uuid)

      if (store.state.sceneModule.OnePlate.name != '') {
        console.log(
          '点击完飞机标牌上的语音，想要点击工具条的语音时，需要把飞机标牌关闭，否则再次点击飞机标牌语音会不调用PPASR模型解析音频文件回复接口'
        )
        const fd2 = new FormData()
        fd2.append('MultipartFile', fileOfBlob)
        fd2.append('alt', store.state.sceneModule.OnePlate.height)
        fd2.append('platName', store.state.sceneModule.OnePlate.name)
        parseVoiceReplyOfOnePlate(fd2).then((res) => {
          console.log(res)
        })
      } else {
        parseVoice(fd).then((response) => {
          if (response.code == 200) {
            //   state.voiceContent = response.data
            //   state.$store.state.speechText = res.data.data
            let item = {
              name: '我',
              me: true,
              content: response.data
            }
            console.log('response.data', response.data)
            appear(response.data)
            // state.question = response.data
            state.diaList.push(item)
            // console.log('---', item)
            // state.showDia = true
            state.loading = false
            // dataController.loadingPost2(true)
          }
        })
      }
    }
    const appear = (content) => {
      state.question = ''
      clearTimeout(state.timer)
      var speed = 10 //设置定时的速度 越来越快
      var count = 1
      function changeContent() {
        var e = document.getElementsByClassName('content-text')[0]
        e.scrollTop = e.scrollHeight
        state.question = content.substring(0, count) //截取字符串
        count++

        if (count != content.length + 1) {
          // speed -= 1
          // if (speed < 5) speed = 5
          state.timer = setTimeout(changeContent, speed)
        }
      }
      changeContent()
    }
    const scrollToBottom = () => {
      setTimeout(() => {
        nextTick(() => {
          //注意要使用nexttick以免获取不到dom

          let chatContent = document.getElementsByClassName('qacontainer')[0]
          chatContent.scrollTop =
            chatContent.scrollHeight - chatContent.offsetHeight
        })
      }, 200)
    }
    watch(state.diaList, (newValue, oldValue) => {
      scrollToBottom()
    })
    watch(
      () => store.state.home.controlHeader,
      (val) => {
        if (val) {
          state.icon = require('@/assets/image/voice/语音_old.png')
        } else {
          state.icon = require('@/assets/image/voice/语音.png')
        }
      }
    )

    /**
     *  下载录音文件
     * */
    //下载pcm
    const downPCM = () => {
      //这里传参进去的时文件名
      state.recorder.downloadPCM('新文件')
    }
    //下载wav
    const downWAV = () => {
      //这里传参进去的时文件名
      state.recorder.downloadWAV('新文件')
    }
    /**
     *  获取麦克风权限
     * */
    const getPermission = () => {
      Recorder.getPermission().then(
        () => {
          // $message.success("获取权限成功");
          startRecorder()
        },
        (error) => {
          console.log(`${error.name} : ${error.message}`)
        }
      )
    }
    /**
     * 文件格式转换 wav-map3
     * */
    const getMp3Data = () => {
      const mp3Blob = convertToMp3(state.recorder.getWAV())
      state.recorder.download(mp3Blob, 'recorder', 'mp3')
    }
    const convertToMp3 = (wavDataView) => {
      // 获取wav头信息
      const wav = lamejs.WavHeader.readHeader(wavDataView) // 此处其实可以不用去读wav头信息，毕竟有对应的config配置
      const { channels, sampleRate } = wav
      const mp3enc = new lamejs.Mp3Encoder(channels, sampleRate, 128)
      // 获取左右通道数据
      const result = state.recorder.getChannelData()
      const buffer = []

      const leftData =
        result.left &&
        new Int16Array(result.left.buffer, 0, result.left.byteLength / 2)
      const rightData =
        result.right &&
        new Int16Array(result.right.buffer, 0, result.right.byteLength / 2)
      const remaining = leftData.length + (rightData ? rightData.length : 0)

      const maxSamples = 1152
      for (let i = 0; i < remaining; i += maxSamples) {
        const left = leftData.subarray(i, i + maxSamples)
        let right = null
        let mp3buf = null

        if (channels === 2) {
          right = rightData.subarray(i, i + maxSamples)
          mp3buf = mp3enc.encodeBuffer(left, right)
        } else {
          mp3buf = mp3enc.encodeBuffer(left)
        }

        if (mp3buf.length > 0) {
          buffer.push(mp3buf)
        }
      }

      const enc = mp3enc.flush()

      if (enc.length > 0) {
        buffer.push(enc)
      }

      return new Blob(buffer, { type: 'audio/mp3' })
    }

    /**
     * 绘制波浪图-录音
     * */
    const drawRecord = () => {
      // 用requestAnimationFrame稳定60fps绘制
      state.drawRecordId = requestAnimationFrame(drawRecord)

      // 实时获取音频大小数据
      let dataArray = state.recorder.getRecordAnalyseData(),
        bufferLength = dataArray.length
      let url = new Image()
      url.src = require('../../assets/image/voice/背景.png')
      url.onload = function () {
        state.ctx.drawImage(
          url,
          0,
          0,
          state.oCanvas.width,
          state.oCanvas.height
        )
      }
      // state.ctx.draw()
      // 填充背景色
      state.ctx.fillStyle = 'rgba(0,0,0,0)'
      state.ctx.fillRect(0, 0, state.oCanvas.width, state.oCanvas.height)

      // 设定波形绘制颜色
      state.ctx.lineWidth = 2
      state.ctx.strokeStyle = 'rgb(75,217,217)'

      state.ctx.beginPath()

      var sliceWidth = (state.oCanvas.width * 1.0 - 60) / bufferLength, // 一个点占多少位置，共有bufferLength个点要绘制
        x = 30 // 绘制点的x轴位置

      for (var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128.0
        var y = (v * state.oCanvas.height) / 2

        if (i === 0) {
          // 第一个点
          state.ctx.moveTo(x, y)
        } else {
          // 剩余的点
          state.ctx.lineTo(x, y)
        }
        // 依次平移，绘制所有点
        x += sliceWidth
      }

      state.ctx.lineTo(state.oCanvas.width - 60, state.oCanvas.height / 2)
      state.ctx.stroke()
    }
    /**
     * 绘制波浪图-播放
     * */
    const drawPlay = () => {
      // 用requestAnimationFrame稳定60fps绘制
      state.drawPlayId = requestAnimationFrame(state.drawPlay)

      // 实时获取音频大小数据
      let dataArray = state.recorder.getPlayAnalyseData(),
        bufferLength = dataArray.length

      // 填充背景色
      state.pCtx.fillStyle = 'rgba(5,15,46,0.3)'
      state.pCtx.fillRect(0, 0, state.pCanvas.width, state.pCanvas.height)

      // 设定波形绘制颜色
      state.pCtx.lineWidth = 2
      state.pCtx.strokeStyle = 'rgb(255, 255, 255)'

      state.pCtx.beginPath()

      var sliceWidth = (state.pCanvas.width * 1.0) / bufferLength, // 一个点占多少位置，共有bufferLength个点要绘制
        x = 0 // 绘制点的x轴位置

      for (var i = 0; i < bufferLength; i++) {
        var v = dataArray[i] / 128.0
        var y = (v * state.pCanvas.height) / 2

        if (i === 0) {
          // 第一个点
          state.pCtx.moveTo(x, y)
        } else {
          // 剩余的点
          state.pCtx.lineTo(x, y)
        }
        // 依次平移，绘制所有点
        x += sliceWidth
      }

      state.pCtx.lineTo(state.pCanvas.width, state.pCanvas.height / 2)
      state.pCtx.stroke()
    }
    // watch(
    //   //yyq
    //   () => store.state.message,
    //   (newValue, oldValue) => {
    //     let item = {
    //       name: '智能助手',
    //       me: false,
    //       content: newValue.msg.split('_')[0]
    //     }
    //     setTimeout(() => {
    //       state.diaList.push(item)
    //       // const audio = new Audio(
    //       //   path.speechPath + 'text2speech_well?text=' + val.msg
    //       // ) //文件路径
    //       console.log(val)
    //       // let audio = new Audio(
    //       //   require(`/public/static/speechSounds/${val.cmd}.wav`)
    //       // )
    //       // // 播放声音
    //       // audio.play()
    //     }, 100)

    //     setTimeout(() => {
    //       state.showDia = false
    //     }, 15000)
    //   }
    // )
    // const keydown = (event) => {
    //   if (event.code === 'Space') {
    //     if (state.spaceDown) return
    //     btnEvent() // bug 键盘按下事件初始化后只能触发一次
    //     state.spaceDown = true
    //   }
    // }
    // const keyup = (event) => {
    //   if (event.code === 'Space') {
    //     if (!state.spaceDown) return
    //     upEvent()
    //     state.spaceDown = false
    //   }
    // }
    const enters = (event) => {
      if (state.textarea != '') {
        if (event.code === 'Enter') {
          if (state.spaceDown) return
          addQA()
          state.spaceDown = true
        }
      }
    }
    const keyupenters = (event) => {
      if (event.code === 'Enter') {
        if (!state.spaceDown) return
        state.textarea = ''
        state.spaceDown = false
      }
    }
    onBeforeMount(() => {
      // emitter.off('changeCmd')
    })
    onBeforeUnmount(() => {
      emitter.off('changeCmd')
      // 在组件生命周期结束的时候销毁。
      // document.removeEventListener('keydown', keydown, false)
      // document.removeEventListener('keyup', keyup, false)
      document.addEventListener('keydown', enters, false)
      document.addEventListener('keyup', keyupenters, false)
    })
    onMounted(() => {
      // let dataController = new DataControl({
      //   earth: window.PieEarthX,
      //   viewer: window.EarthViewer
      // })
      // let spaceDown = false
      // document.addEventListener('keydown', function (event) {
      //   if (event.code === 'Space') {
      //     if (spaceDown) return
      //     if (event.repeat) return;
      //     btnEvent()
      //     // setDebounce()
      //     spaceDown = true
      //   }
      // })
      // document.addEventListener('keyup', function (event) {
      //   if (event.code === 'Space') {
      //     if (!spaceDown) return
      //     upEvent()
      //     spaceDown = false
      //   }
      // })
      getCommandName().then((res) => {
        if (res.code == 200) {
          state.orderList = res.data
        }
      })
      state.spaceDown = false
      document.addEventListener('keydown', enters)
      document.addEventListener('keyup', keyupenters)
      nextTick(() => {
        startCanvas()
      })
      // store.commit('initWebsocket')
      getMessage()
      // emitter.off('changeCmd')
      emitter.on('changePannel', (val) => {
        // console.log(val)
        if (val.client_uuid) {
          if (val.client_uuid != store.state.client_uuid) {
            return
          }
        } else {
          return
        }
        // if (val.client_exec_cmd != 'execute-task2') {
        //   dataController.loadingPost2(false)
        // }
        let msgString = val.msg_output_text ? val.msg_output_text : val.msg
        let item = msgString
          ? {
              name: '机上僚机管家AI',
              me: false,
              content: msgString
                .replace('，。', '，')
                .replace('任毅', '任意')
                .split(' ')[0],
              cmd: val.client_exec_cmd
              // data:val.client_exec_cmd=='mission-rehearsal1'?val.knowledge:(val.client_exec_cmd=='mission-rehearsal3'?val.airPortDataForm:'')
            }
          : {
              name: '机上僚机管家AI',
              me: false,
              content: '',
              cmd: val.client_exec_cmd
            }
        emitter.emit('showTuPu', { show: false })
        emitter.emit('showPdf', { url: '', type: false })
        setTimeout(() => {
          if (val.client_exec_cmd == 'mission-rehearsal2') {
            state.diaList.push(item) //显示知识图谱
            item.id = 'chart_rehe' + state.diaList.length
            let link = []
            let data = []
            if (val.knowledge == null) {
              knowledgeData().then((res) => {
                setTimeout(() => {
                  link = res.data[0].knowledgeData.links
                  data = res.data[0].knowledgeData.nodes
                  state.rehearsal1Data = {
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    tooltip: {
                      confine: true
                    },
                    animationDuration: 3000,
                    animationEasingUpdate: 'quinticInOut',
                    grid: {
                      top: 300,
                      bottom: 0
                    },
                    series: [
                      {
                        type: 'graph',
                        layout: 'force',
                        scaleLimit: {
                          min: 0.5
                        },
                        zoom: 2,
                        symbolSize: 45,
                        emphasis: {
                          focus: 'adjacency'
                        },
                        roam: true,
                        legendHoverLink: true,
                        // categories: [
                        //   {
                        //     name: '电力系统'
                        //   },
                        //   {
                        //     name: '发电厂'
                        //   },
                        //   {
                        //     name: '变电所'
                        //   },
                        //   {
                        //     name: '输电线'
                        //   }
                        // ],
                        label: {
                          show: true,
                          position: 'top',
                          fontSize: 12,
                          color: '#fff'
                        },
                        force: {
                          repulsion: 150
                        },
                        // label: {
                        //   show: true,
                        //   color: '#fff'
                        //   // color: 'inherit'
                        // },
                        nodeStyle: {
                          brushType: 'both',
                          borderColor: '#fff',
                          borderWidth: 1
                        },
                        edgeSymbolSize: [4, 10],
                        edgeLabel: {
                          show: false
                        },
                        data: data,
                        links: link,
                        lineStyle: {
                          opacity: 0.9,
                          width: 1,
                          curveness: 0
                        }
                      }
                    ]
                  }
                  router.push('/home')
                  emitter.emit('showTuPu', {
                    show: true,
                    val: state.rehearsal1Data
                  })
                }, 19000)
              })
            } else {
              setTimeout(() => {
                link = val.knowledge[0].knowledgeData.links
                data = val.knowledge[0].knowledgeData.nodes
                state.rehearsal1Data = {
                  backgroundColor: 'rgba(0,0,0,0.3)',
                  tooltip: {
                    confine: true
                  },
                  animationDuration: 3000,
                  animationEasingUpdate: 'quinticInOut',
                  grid: {
                    top: 300,
                    bottom: 0
                  },
                  series: [
                    {
                      type: 'graph',
                      layout: 'force',
                      scaleLimit: {
                        min: 0.5
                      },
                      zoom: 2,
                      symbolSize: 45,
                      emphasis: {
                        focus: 'adjacency'
                      },
                      roam: true,
                      legendHoverLink: true,
                      label: {
                        show: true,
                        position: 'top',
                        fontSize: 12,
                        color: '#fff'
                      },
                      force: {
                        repulsion: 150
                      },
                      // label: {
                      //   show: true,
                      //   color: '#fff'
                      //   // color: 'inherit'
                      // },
                      nodeStyle: {
                        brushType: 'both',
                        borderColor: '#fff',
                        borderWidth: 1
                      },
                      edgeSymbolSize: [4, 10],
                      edgeLabel: {
                        show: false
                      },
                      data: data,
                      links: link,
                      lineStyle: {
                        opacity: 0.9,
                        width: 1,
                        curveness: 0
                      }
                    }
                  ]
                }
                router.push('/home')
                emitter.emit('showTuPu', {
                  show: true,
                  val: state.rehearsal1Data
                })
              }, 19000)
            }
          } else if (val.client_exec_cmd == 'mission-rehearsal3') {
            setTimeout(() => {
              emitter.emit('showTuPu', { show: false })
              state.diaList.push(item)
              //state.airPortList = val.airPortDataForm.airPortList
              let airPort = JSON.parse(
                JSON.stringify(val.airPortDataForm.airPortList)
              )
              state.airPortList = airPort.reverse() //反序，将重要机场排前
              //  store.commit('home/changeHualian', 28)
              // console.log(store.state.home.hualian)
              //在步骤弹框之后出现
              router.push('/home')
              emitter.emit('changeAirList', state.airPortList) //起飞机场列表
            }, 8000)
          } else if (val.client_exec_cmd == 'show-airport') {
            state.diaList.push(item)
            state.airPortList2 = val.airPortDataForm.airPortList
            emitter.emit('changeAirList2', state.airPortList2) //降落机场列表
          } else if (val.client_exec_cmd == 'execute-task3') {
            state.diaList.push(item)
            state.weatherData = val.airPortWeatherInfoForm
            state.fightData = val.flyEffectForm
          } else if (val.client_exec_cmd == 'airport-removefog2') {
            state.diaList.push(item)
            state.pdfUrl = val.client_form_data
            emitter.emit('showPdf', {
              url: val.client_form_data,
              type: true
            }) //降落机场列表
          } else if (val.client_exec_cmd == 'airport-removefog4') {
            setTimeout(() => {
              state.diaList.push(item)
            }, 10000)
          } else if (val.client_exec_cmd == 'airport-removefog3') {
            setTimeout(() => {
              state.diaList.push(item)
            }, 4000)
          } else if (val.client_exec_cmd == 'mission-rehearsal1') {
          } else if (val.client_exec_cmd == 'card-search') {
            if (!val.client_form_data) return
            if (!val.client_form_data.airPortList) return
            if (!val.client_form_data.airPortList.length) return
            state.diaList.push(item)
            //state.airPortList = val.airPortDataForm.airPortList
            let airPort = val.client_form_data.airPortList
            state.airPortList = airPort //反序，将重要机场排前
            // console.log(val.client_form_data)
          } else if (val.client_exec_cmd == 'show-place') {
            if (!val.client_form_data) return
            if (!val.client_form_data instanceof Array) return
            state.diaList.push(item)
            let showPlaceList =
              val.client_form_data.length > 50
                ? val.client_form_data.slice(50)
                : val.client_form_data
            state.placeTotal = showPlaceList.length
            state.showPlaceList = showPlaceList
          } else if (val.client_exec_cmd == 'knowledge-search') {
            if (!val.client_form_data) return
            if (!val.client_form_data.knowledgeData) return
            if (!val.client_form_data.knowledgeData.nodes) return
            if (!val.client_form_data.knowledgeData.links) return
            state.diaList.push(item) //显示知识图谱
            item.id = 'chart_rehe' + state.diaList.length
            state.rehearsal1Data = {}
            state.rehearsal1Data = {
              backgroundColor: 'rgba(0,0,0,0.3)',
              tooltip: {
                confine: true
              },
              animationDuration: 3000,
              animationEasingUpdate: 'quinticInOut',
              grid: {
                top: 300,
                bottom: 0
              },
              series: [
                {
                  type: 'graph',
                  layout: 'force',
                  animation: true,
                  scaleLimit: {
                    min: 0.5
                  },
                  zoom: 1,
                  symbolSize: 20,
                  // emphasis: {
                  //   focus: 'adjacency'
                  // },
                  roam: true,
                  legendHoverLink: true,
                  label: {
                    show: true,
                    position: 'top',
                    fontSize: 12,
                    color: '#fff'
                  },
                  force: {
                    repulsion: 100,
                    // layoutAnimation: false,
                    friction: 0.1
                  },
                  draggable: true,
                  nodeStyle: {
                    brushType: 'both',
                    borderColor: '#fff',
                    borderWidth: 1
                  },
                  edgeSymbolSize: [4, 10],
                  edgeLabel: {
                    show: false
                  },
                  data: [],
                  links: [],
                  lineStyle: {
                    opacity: 0.9,
                    width: 1,
                    curveness: 0
                  }
                }
              ]
            }
            let arr = []
            let links = []
            val.client_form_data.knowledgeData.nodes.forEach((item) => {
              let color = ''
              if (item.style) {
                let stylehash = JSON.parse(item.style)
                color = stylehash.color ? stylehash.color : '#248dbf'
              } else {
                color = '#248dbf'
              }

              arr.push({
                id: item.id,
                label: item.name,
                name: item.name,
                category: item.id,
                itemStyle: {
                  normal: {
                    color: color
                  }
                },
                symbolSize: item.id == '义序机场' ? 20 : 20
              })
            })
            val.client_form_data.knowledgeData.links.forEach((item) => {
              links.push({
                source: item.sourceNodeId,
                target: item.targetNodeId
              })
            })
            state.rehearsal1Data.series[0].data = arr
            state.rehearsal1Data.series[0].links = links
          } else {
            state.diaList.push(item)
          }
          if (
            val.client_exec_cmd != 'mission-rehearsal3' &&
            val.client_exec_cmd != 'show-airport'
          ) {
            emitter.emit('closeAirList', false)
          }
          // const audio = new Audio(
          //   path.speechPath + 'text2speech_well?text=' + val.msg
          // ) //文件路径
          // console.log('面板接受:', val)
          // let audio = new Audio(
          //   require(`/public/static/speechSounds/${val.cmd}.wav`)
          // )
          // // 播放声音
          // audio.play()
        }, 800)

        setTimeout(() => {
          // state.showDia = false
        }, 15000)
      })
      scrollToBottom()
    })

    const btnEvent = () => {
      console.log('按下')
      state.isSpeaking = !state.isSpeaking
      state.question = ''
      state.testCss = 'test2'
      // state.diaList = []
      setTimeout(() => {
        state.testCss = 'test1'
      }, 10)
      getPermission()
      // if (state.isSpeaking) {
      //   getPermission()
      // } else {
      //   getRecorder()
      // }
    }
    const upEvent = () => {
      console.log('弹起')
      // state.diaList = []
      getRecorder()
      state.isSpeaking = false
      state.isQuestion = true
      setTimeout(() => {
        state.isQuestion = false
      }, 5000)
    }
    const addQA = () => {
      let item = {
        name: '我',
        me: true,
        content: state.textarea
      }
      state.diaList.push(item)
      const formData = new FormData()
      formData.append('alt', store.state.sceneModule.OnePlate.height)
      formData.append('plateName', store.state.sceneModule.OnePlate.name)
      formData.append('text', state.textarea)
      parseVoiceReplyOfOnePlateText(formData)
    }
    const placeHandleCurrentChange = (row) => {
      state.placeCurrentPage = row
    }
    const placeRowClick = (row) => {
      window.EarthViewer.camera.flyTo({
        destination: new window.PieEarthX.Cartesian3.fromDegrees(
          Number(row.lng),
          Number(row.lat),
          50000
        )
      })
    }

    const deepCopy = (data) => {
      let objClone = Array.isArray(data) ? [] : {}
      if (data && typeof data === 'object') {
        for (var key in data) {
          if (data.hasOwnProperty(key)) {
            //判断ojb子元素是否为对象，如果是，递归复制
            if (data[key] && typeof data[key] === 'object') {
              objClone[key] = deepCopy(data[key])
            } else {
              //如果不是，简单复制
              objClone[key] = data[key]
            }
          }
        }
      }
      return objClone
    }
    const changeSelect = () => {
      state.textarea = state.orderName
    }
    return {
      ...toRefs(state),
      startCanvas,
      startRecorder,
      getRecorder,
      getPermission,
      resumeRecorder,
      pauseRecorder,
      stopRecorder,
      downWAV,
      btnEvent,
      close,
      upEvent,
      dragstart,
      dragend,
      unfoldAndCollapse,
      addQA,
      placeHandleCurrentChange,
      placeRowClick,
      deepCopy,
      changeSelect
    }
  }
}
</script>
<style scoped lang="less">
.loadText {
  margin-top: 5px;
  height: 170px;
}

.voiceBox {
  height: 120px;
  width: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2px;
  cursor: pointer;
  position: fixed;
  bottom: 5%;
  right: 1%;
  // // display: flex;
  // justify-content: space-around;
  // align-items: center;
}

.leftBox {
  // width: 60%;
  height: 160px;
  display: inline-block;
}

.rightBox {
  width: 38%;
  height: 160px;
  display: inline-block;
  // border: 1px solid red;
}

.timeBox {
  font-size: 17px;
  height: 40px;
  line-height: 40px;
}

.bottonBox {
  height: 120px;
  display: flex;
  justify-content: space-around;
  align-items: center;
  flex-wrap: wrap;
}

#playChart {
  width: 100%;
  height: 100%;
}

#canvas {
  width: 500px;
  height: 100px;
  position: fixed;
  // top: 120px;
  // right: 90px;
  top: 90%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: url('@/assets/image/voice/背景.png');
  background-size: 100% 100%;
  border-radius: 20px;
}

.content-text {
  position: fixed;
  // top: 120px;
  // right: 90px;
  // top: calc(90% + 50px);
  bottom: 2%;
  left: 50%;
  transform: translate(-50%, 0);
  font-size: 30px;
  background: rgba(0, 0, 0, 0.19);
  padding: 10px 20px;
  font-family: PingFangSC-Semibold;
  color: #25edff;
  letter-spacing: 0.31px;
  text-align: center;
  font-weight: 600;
}

h3 {
  color: white;
  font-size: 19px !important;
}

:deep .el-button {
  height: 50px;
}

.test1 {
  width: 150px;
  height: auto;
}

.test2 {
  width: 120px;
  height: auto;
}

.show-container {
  z-index: -1 !important;
  position: fixed;
  right: 10px;
  top: 87px;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: 1px solid rgba(255, 255, 255, 0.1);
  font-size: 18px;
}

.dialogue {
  width: 600px;
  height: 70%;
  background: rgba(0, 84, 122, 0.65);
  // border-radius: 10px;
  // background: rgba(0, 0, 0, 0.6);
  position: fixed;
  // right: 10px;
  right: 95px;
  top: 93px;
  // padding: 10px;
  color: #eee;
  border: 1px solid linear-gradient(90deg, #7dfffd 70%, #1b4f4e 61%);

  .title_11 {
    height: 50px;
    width: 600px;
    line-height: 50px;
    // background-image: linear-gradient(
    //   180deg,
    //   #58a6bd 0%,
    //   rgba(0, 0, 0, 0) 100%
    // );
    background: url('@/assets/image/voice/背景框.png') no-repeat;
    background-size: 100% 100%;
    border-radius: 10px 10px 0px 0px;
    // width: 100%;
    // display: flex;
    // height: 20px;
    border-bottom: 1px solid
      linear-gradient(#0ee6e7 2%, rgba(78, 188, 154, 0) 100%);

    .qaTitle {
      font-family: zihun35hao-jindianyahei;
      font-size: 25px;
      color: #ffffff;
      letter-spacing: 2.25px;
      font-weight: 400;
      text-align: left;
      padding-left: 10%;
    }

    .drag {
      width: 80%;
    }

    .close {
      font-size: 20px;
      cursor: pointer;
      position: absolute;
      top: 0px;
      right: 10px;
      z-index: 111;
    }
  }

  .qacontainer {
    height: calc(100% - 135px);
    overflow-y: auto;
    overflow-x: hidden;
  }

  .qabtn {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 20px;
    opacity: 0.8;
    background: #00405c;
    border: 1px solid rgba(0, 86, 95, 1);
    border-radius: 2px 0px 0px 0px;

    :deep .el-input__wrapper {
      background: rgba(32, 97, 121, 0.45);
      border: 1px solid rgba(100, 199, 213, 1);
      border-radius: 4px;

      .el-input__inner {
        color: white;
      }
    }

    .norem-fasong {
      background: url('@/assets/image/voice/发送.png');
      background-size: 100% 100%;
      width: 50px;
      height: 32px;
      margin: 0 0 0 10px;
      cursor: pointer;
    }

    .el-select {
      margin-left: 10px;

      :deep .el-input__inner {
        width: 73px;
        height: 38px;
      }
    }
  }
}

.my_sty {
  display: flex;
  align-items: flex-start;
  margin-bottom: 10px;
  margin-left: 10px;

  .my_main {
    width: calc(100% - 50px);
    display: flex;
    align-items: flex-start;
    flex-direction: column;
  }
}

.ai_sty {
  display: flex;
  flex-direction: row-reverse;
  align-items: flex-start;
  margin: 10px;

  .ai_main {
    width: calc(100% - 50px);
    display: flex;
    align-items: flex-end;
    flex-direction: column;
  }
}

// .ai_sty1 {
// }

.chat_bg {
  // old
  // background: rgba(85, 172, 227, 0.2);
  // padding: 10px;
  // border-radius: 10px;
  // color: rgba(238, 238, 238, 0.2);
  // margin-left: 10px;
  // margin-right: 10px;
  // margin-top: 14px;
  //------------new
  max-width: calc(100% - 20px);
  // background: rgba(7, 4, 36, 0.5);
  padding: 10px 20px;
  margin: 5px 10px;
  // box-shadow: inset 0px 0px 30px 0px rgba(92, 208, 234, 0.3),
  // inset 0px 0px 100px 0px rgba(93, 209, 235, 0.2);
  border-radius: 8px;
  // background: rgba(37, 109, 132, 0.62);
  border-radius: 10px 10px 10px 10px;
  // margin-top: -40px;
  text-align: left;
  // text-indent: 2em;
}

.ai_chat {
  // background: rgba(37, 109, 132, 0);
  background: rgba(82, 203, 255, 0.13);
  border: 1px solid rgba(63, 250, 255, 1);
  box-shadow: inset 0px 0px 4px 3px rgba(18, 201, 251, 0.54);
  // box-shadow: 0px 1px 4px 0px rgba(91,255,236,0.39);
  border-radius: 4px;
}

.my_chat {
  // background: rgba(37, 109, 132, 0.62);
  background: rgba(0, 40, 59, 0.5);
  border: 1px solid rgba(0, 187, 255, 0.21);
  border-radius: 4px;
}

.arrow_box {
  animation: glow 800ms ease-out infinite alternate;
}

@keyframes glow {
  0% {
    border-color: rgb(51, 114, 153);
    box-shadow: 0 0 5px rgba(51, 114, 153, 0.2),
      inset 0 0 5px rgba(51, 114, 153, 0.1), 0 1px 0 rgb(51, 114, 153);
  }

  100% {
    border-color: rgb(51, 114, 153);
    box-shadow: 0 0 20px rgba(51, 114, 153, 0.6),
      inset 0 0 10px rgba(51, 114, 153, 0.4), 0 1px 0 rgb(51, 114, 153);
  }
}

.show_pdf {
  display: flex;
  width: 96%;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  flex-direction: row-reverse;
  padding: 0 5%;
  height: 300px;
  // embed {
  //   width: 100%;
  //   height: 100%;
  // }
  border-radius: 5px;

  img {
    width: 250px;
    height: 290px;
    border-radius: 9px;
  }
}

.aiport_con {
  display: flex;
  color: #fff;
  text-align: left;
  align-items: center;
  padding: 0px 30px;
  margin-bottom: 10px;

  img {
    width: 100px;
  }

  .img_air_con {
    margin-right: 20px;
  }

  .air_name {
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
  }

  .des_item {
    overflow: hidden;
    text-overflow: ellipsis;
    -webkit-line-clamp: 2;
    display: -webkit-box;
    -webkit-box-orient: vertical;
  }
}

.knowleg_con {
  // display: flex;
  color: #fff;
  text-align: left;
  // align-items: center;
  padding: 0px 30px;
  margin-bottom: 10px;

  img {
    width: 100%;
  }

  // .img_air_con {
  //   margin-right: 20px;
  // }

  .air_name {
    margin-bottom: 10px;
    font-size: 18px;
    font-weight: bold;
  }

  .des_item {
    // overflow: hidden;
    // text-overflow: ellipsis;
    // -webkit-line-clamp: 2;
    // display: -webkit-box;
    // -webkit-box-orient: vertical;
  }
}

.card_con1 {
  display: flex;
  width: 96%;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;

  img {
    width: 200px;
  }
}

.card_con2 {
  display: flex;
  width: 96%;
  align-items: center;
  justify-content: center;
  margin-bottom: 20px;
  flex-direction: row-reverse;

  img {
    width: 200px;
  }
}

.info_sty_con_weather {
  display: flex;
  margin-left: 50px;
  font-size: 18px;
  margin-bottom: 10px;
}

.info_sty_con_weather:nth-child(2) > .label_wea {
  color: #ff8417;
}

.label_wea {
  width: 100px;
  text-align: left;
}

.label_wea:nth-child(2) {
  color: #ff8417;
}

.danger {
  color: #f00;
}

.safe {
  color: #0f0;
}

.table_con {
  max-height: 500px;
  margin-bottom: 40px;

  .list_title {
    font-size: 20px;
    color: #0fff;
  }
}

.page-style {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 10px;
}

.table_con /deep/ .el-table--fit {
  padding: 20px;
}

.table_con /deep/ .el-table,
.el-table__expanded-cell {
  background-color: transparent;
}

.table_con /deep/ .el-table tr {
  background-color: transparent !important;
}

.table_con /deep/ .el-table--enable-row-transition .el-table__body td,
.el-table .cell {
  background-color: transparent;
}

.el-table::before {
  //去除底部白线
  left: 0;
  bottom: 0;
  //   width: 100%;
  height: 0px;
}

.el-table td.el-table__cell {
  //   border-bottom: 1px solid transparent;
}

.el-table th.el-table__cell.is-leaf {
  border-bottom: 1px solid #eee;
}

.el-table__body {
  tbody {
    .hover-row {
      background: transparent !important;
      background-color: transparent !important;
    }
  }
}

.table_con /deep/.el-table th.el-table__cell {
  background: rgba(0, 7, 21, 0.1);
  color: #5ab5ca;
}

.table_con /deep/.el-table tr {
  background: transparent;
}

.table_con /deep/ .el-table,
.table_con /deep/ .el-table__expanded-cell {
  background: transparent;
  color: #5ab5ca;
}

.table_con /deep/.el-table tbody tr:hover > td {
  background-color: transparent !important;
}

// .el-table tr{
//   background-color: transparent;
// }
.el-table::before {
  z-index: inherit;
  //   width: 0;
  height: 0;
  // color: #5AB5CA;
}

.table_con
  /deep/.el-table--striped
  .el-table__body
  tr.el-table__row--striped
  td.el-table__cell {
  background: rgba(129, 159, 255, 0.06);
}

.table_con /deep/.el-table td.el-table__cell {
  //   border-bottom: 1px solid transparent;
}

.table_con /deep/.el-table th.el-table__cell.is-leaf {
  border-top: 1px solid #eee;
  border-bottom: 1px solid #eee;
}

.table_con /deep/.el-table--border .el-table__inner-wrapper::after,
.table_con /deep/.el-table--border::after,
.table_con /deep/.el-table--border::before,
.table_con /deep/.el-table__inner-wrapper::before {
  background-color: transparent;
}

:deep .el-pagination > .is-last {
  background: #5ab5ca;
  color: white;
}

:deep .el-pagination > .is-first {
  background: #5ab5ca;
  color: white;
}

:deep .el-pagination.is-background .btn-prev:disabled {
  background: #5ab5ca37;
}

:deep .el-pagination.is-background .btn-next:disabled {
  background: #5ab5ca37;
}

:deep .el-pagination.is-background .el-pager li {
  background: #5ab5ca;
  color: white;

  &:hover {
    color: #030d0f;
  }
}

:deep .el-pager li.is-active {
  color: #030d0f !important;
}
</style>
