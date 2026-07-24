<template>
  <div class="menu-bottom">
    <ul class="astronomicalTime">
      <li class="day">作战时间：{{ data.zzday }}</li>
      <li class="date">{{ data.zzdate }}</li>
    </ul>
    <span class="solid"></span>
    <ul class="btnLeft cursor">
      <li
        v-for="(item, index) in data.btnLeftList"
        :key="index"
        @click="leftGroup_fun(item)"
      >
        <span>{{ item.label }}</span>
      </li>
    </ul>
    <span class="solid"></span>
    <ul class="btnCenter">
      <li
        v-for="(item, index) in data.btnCenterList"
        :key="index"
        @click="btnCenter_fun(item)"
      >
        <img :src="item.url" :title="item.label" />
      </li>
    </ul>
    <span class="solid"></span>
    <ul class="btnLeft cursor">
      <li
        v-for="(item, index) in data.btnRightList"
        :key="index"
        @click="rightGroup_fun(item, index)"
      >
        <span v-if="item.label != '情报上报'">{{ item.label }}</span>
        <div v-else="state.isShowWordFile">
          <el-upload
            ref="uploadRefFile"
            class="upload-File"
            accept=".docx"
            action
            :show-file-list="false"
            :auto-upload="true"
            :http-request="handlewordFileSuccess"
          >
            <template #trigger>
              <el-button class="bottomfile">{{ item.label }}</el-button>
            </template>
          </el-upload>
        </div>
      </li>
    </ul>
    <span class="solid"></span>
    <div class="aBox cursor">
      <div class="controllar">
        <p>平台：{{ data.entityInfo }}</p>
        <!-- <p>纬度：{{ data.latitude }}</p> -->
        <!-- <img src="@/assets/images/seat/slider.png" /> -->
      </div>
      <!-- <div style="padding: 0 10px; display: flex">
        <div class="redBtn">
          <span>系统电文</span>
        </div>
        <div class="grayBtn">
          <span>其他****</span>
        </div>
      </div> -->
      <div class="grayEllipse">
        <!-- <img src="@/assets/images/seat/grayEllipse.png" />
        <img src="@/assets/images/seat/grayEllipse.png" /> -->
      </div>
    </div>
    <span class="solid"></span>
    <ul class="astronomicalTime">
      <li class="day">天文时间：{{ data.day }}</li>
      <li class="date">{{ data.date }}</li>
    </ul>
  </div>
  <!-- <weatherLegend
    v-if="data.showQxldWeatherLegend"
    :lengendData="data.winddatas"
  ></weatherLegend> -->
</template>
<script setup>
import { receiveFile } from '@/service/adjustControl/document'
// qb席
import { leftConfig, rightConfig } from './hooks/Informationseat/index'
import { websocketUrl_document } from '@/service/request/config'
import { reactive, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useStore } from 'vuex'
// import weatherLegend from '@/views/seatManagement/weatherOcean/weatherLegend.vue'
import hand from '@/assets/images/seat/hand.png'
import minus from '@/assets/images/seat/minus.png'
import plus from '@/assets/images/seat/plus.png'
import header from '@/assets/images/seat/header.png'
import zw from '@/assets/images/seat/占位.png'
import ls from '@/assets/images/seat/量算.png'
import sj from '@/assets/images/seat/时间.png'
import fw from '@/assets/images/seat/复位.png'
import qh from '@/assets/images/seat/切换.png'
import sd from '@/assets/images/seat/深度.png'
import sy from '@/assets/images/seat/声音.png'
import { directDataCommand } from '@/components/seatManangement/blueusercomponents/wordflie'
// 指控席
import { specialConfig } from './hooks/Commandseat/index'
import { generalConfig } from './hooks/Commandseat/index'
import { resetEarth } from '@/utils/mapTools'
const { getRightMenu } = specialConfig()
const { btnLeft_fun } = generalConfig()
const { getLeftMenu_qb } = leftConfig()
const { getRightMenu_qb } = rightConfig()

const props = defineProps({
  btnList: Array,
  headerText: String
})
const emit = defineEmits()
const data = reactive({
  date: null,
  day: null,
  zzdate: null,
  zzday: null,
  headerText: '',
  btnLeftList: [
    { label: '图层面板' },
    // { label: '自建地标' },
    { label: '自建空域' },
    { label: '标牌配置' },
    { label: '系统退出' },
    { label: '作战资料' },
    { label: '代码指令' },
    { label: '指挥文电' },
    { label: '重演' }
  ],
  btnCenterList: [
    { url: sj, label: '时间控制' },
    { url: fw, label: '复位' },
    { url: qh, label: '二三维切换' },
    { url: sd, label: '深度' },
    // { url: ls, label: '量算' },
    { url: header, label: '导航栏' },
    { url: sy, label: '系统音效' }
    // { url: zw, label: '' },
    // { url: zw, label: '' },
    // { url: zw, label: '' }
  ],
  btnRightList: [
    { label: '数传指挥' },
    { label: '目标标识' },
    // { label: '关键事件' },
    { label: '战况统计' },
    { label: '协同文电' },
    { label: '目标属性' },
    { label: '目标共享' },
    { label: '兵力信息' },
    { label: '任务计划' },
    { label: '其他数传' }
  ],
  latitude: '117.333344 25,2123 ** 112122123',
  entityInfo: '', //选中目标的相关信息
  isShowTimeLine: false,
  measurementVisible: false,
  showQxldWeatherLegend: false, //气象显示
  winddatas: {
    name: '气象雷达',
    datas: [
      {
        name: '气象雷达',
        type: 'tile',
        visible: true,
        url: '',
        legend: [0, 20, 30, 40, 50, 60],
        ext: '气象雷达（dBZ）',
        colors:
          'rgb(40, 16, 159), rgb(40, 16, 159), rgb(40, 16, 159), rgb(40, 16, 159), rgb(24, 44, 168), rgb(0, 145, 148), rgb(0, 174, 129), rgb(70, 205, 96), rgb(195, 219, 38), rgb(245, 203, 8), rgb(244, 159, 33), rgb(223, 102, 68), rgb(190, 52, 94), rgb(157, 16, 109), rgb(157, 16, 109)'
      }
    ]
  },
  side: sessionStorage.getItem('roleKey')
})
const router = useRouter()
const store = useStore()

const showTime = () => {
  var now = new Date()
  var year = now.getFullYear() // 获取完整的年份(4 位, 1970-???)
  var month = now.getMonth() + 1 // 获取当前月份(0-11,0 代表 1 月)
  var day = now.getDate() // 获取当前日(1-31)
  var hour = now.getHours() //获取小时
  var minute = now.getMinutes() //获取分钟
  var second = now.getSeconds() //获取秒
  data.date =
    (hour < 10 ? '0' + hour : hour) +
    ':' +
    (minute < 10 ? '0' + minute : minute) +
    ':' +
    (second < 10 ? '0' + second : second)
  data.day = year + '年' + month + '月' + day + '日'
}
emitter.on('showWeatherClick', (val) => {
  data.showQxldWeatherLegend = val
})
const getzzTime = () => {
  if (store.state.sceneModule.msgMessionTime) {
    var now = new Date(store.state.sceneModule.msgMessionTime)
    var year = now.getFullYear() // 获取完整的年份(4 位, 1970-???)
    var month = now.getMonth() + 1 // 获取当前月份(0-11,0 代表 1 月)
    var day = now.getDate() // 获取当前日(1-31)
    var hour = now.getHours() //获取小时
    var minute = now.getMinutes() //获取分钟
    var second = now.getSeconds() //获取秒
    data.zzdate =
      hour +
      ':' +
      (minute < 10 ? '0' + minute : minute) +
      ':' +
      (second < 10 ? '0' + second : second)
    data.zzday = year + '年' + month + '月' + day + '日'
  }
}
emitter.on('showWeatherClick', (val) => {
  data.showQxldWeatherLegend = val
})
const btnCenter_fun = (item) => {
  if (item.label == '时间控制') {
    data.isShowTimeLine = !data.isShowTimeLine
    emitter.emit('changeTimeLineState', data.isShowTimeLine)
  } else if (item.label == '复位') {
    reset()
  } else if (item.label == '二三维切换') {
    toogleDimension()
  } else if (item.label == '深度') {
    if (window.EarthViewer.scene.globe.depthTestAgainstTerrain) {
      window.EarthViewer.scene.globe.depthTestAgainstTerrain = false
      ElMessage.success('深度关闭')
      return
    }
    window.EarthViewer.scene.globe.depthTestAgainstTerrain = true
    ElMessage.success('深度开启')
  } else if (item.label == '量算') {
    data.measurementVisible = !data.measurementVisible
    store.dispatch('set_measurementVisible', data.measurementVisible)
  } else if (item.label == '导航栏') {
    let curShowVal = store.state.homeModule.headerShow
    store.commit('homeModule/changeHeaderShow', !curShowVal)
  } else if (item.label == '系统音效') {
    let curSystemSound = store.getters.getSystemSound
    console.log('音效状态', curSystemSound)
    store.commit('setSystemSound', !curSystemSound)
  }
}
const showWeatherClick = () => {}

//复位
const reset = () => {
  resetEarth()
}

// 二三维切换
let mapType = ref('mapView')
const toogleDimension = () => {
  const viewer = window.EarthViewer
  const Cesium = window.MSIMEarth
  if (mapType.value === 'sceneView') {
    if (viewer.view === 'sceneView') {
      return
    }
    viewer.view = 'sceneView'
    viewer.scene.morphTo3D(0)
    mapType.value = 'mapView'
  } else {
    if (viewer.view === 'mapView') {
      return
    }
    viewer.scene.morphTo2D(0)
    viewer.view = 'mapView'
    mapType.value = 'sceneView'
  }
}

// const getItemPanel = (item, index) => {
//   let obj = {
//     item,
//     index
//   }
//   emit('getItemPanel', obj)
// }
//
// 第一栏点击事件
const leftGroup_fun = (item) => {
  console.log('第一栏', item)
  switch (data.side) {
    case 'Commandseat':
    case 'RedCommandseat':
    case 'BlueCommandseat':
      // 指挥席
      btnLeft_fun(item)
      break
    case 'adjudicatoryseatadmin':
      // 裁决席
      btnLeft_fun(item)
      break
    case 'DimensionalSituation':
      // 态势席
      btnLeft_fun(item)
      break
    case 'Informationseat':
      // qb席
      getLeftMenu_qb(item)
      break
    case 'trainingseat':
      // 作训席
      break
    case 'electronicCountermeasureseat':
      // DK席
      break
    case 'floorShield':
      // DF席
      break
    default:
      break
  }
}
// 第三栏点击事件
const rightGroup_fun = (item, index) => {
  switch (data.side) {
    case 'Commandseat':
    case 'RedCommandseat':
    case 'BlueCommandseat':
      // 指挥席
      getRightMenu(item, index)
      break
    case 'adjudicatoryseatadmin':
      // 裁决席
      getRightMenu(item, index)
      break
    case 'DimensionalSituation':
      // 态势席
      getRightMenu(item, index)
      break
    case 'Informationseat':
      // qb席
      getRightMenu_qb(item, index)
      break
    case 'trainingseat':
      // 作训席
      break
    case 'electronicCountermeasureseat':
      // DK席
      break
    case 'floorShield':
      // DF席
      break
    default:
      break
  }
}

/**
 * @description 获取socket推送的消息--文书通信
 * @param { Object } res 消息数据
 */
let getsocketResult_doc = (res) => {
  if (res.currentTarget.readyState == 1) {
    let data = JSON.parse(res.data)
    if (data.status == 'websocket连接成功!') {
    } else {
      _receiveFile(res.data)
    }
  }
}
let _receiveFile = (id) => {
  let params = { id }
  receiveFile(params).then((res) => {
    if (res.code == 200) {
      ElNotification({
        title: '通知',
        message: '收到一封新邮件',
        duration: 2000
      })
    } else {
      ElMessage.error('邮件接收失败')
    }
  })
}

onMounted(() => {
  setInterval(showTime, 1000) //每秒调用showTime()方法
  data.btnLeftList = props.btnList[0]
  data.btnRightList = props.btnList[1]
  data.headerText = props.headerText
  getzzTime()

  // 连接webscoket
  let url_doc = `${websocketUrl_document}/${sessionStorage.getItem('userId')}`
  data.socketApi_doc = new WebSocket(url_doc)
  data.socketApi_doc.onopen = function () {
    console.log('socket_doc链接成功')
  }
  data.socketApi_doc.onmessage = function (e) {
    getsocketResult_doc(e)
  }
  data.socketApi_doc.onclose = function (e) {
    getsocketResult_doc(e)
  }
})
watch(
  () => store.state.sceneModule.msgMessionTime,
  (newValue, oldValue) => {
    getzzTime(newValue)
  }
)

watch(
  () => store.state.sceneModule.currentFlyType,
  (newValue, oldValue) => {
    data.entityInfo = newValue.name
  }
)

const handlewordFileSuccess = (param) => {
  let file = param.file
  let formData = new FormData()
  formData.append('file', file)
  formData.append('sceneId', sessionStorage.getItem('taskId'))
  formData.append('camp', window.localStorage.side)
  directDataCommand(formData).then((res) => {
    ElMessage.success('上传导入成功!')
  })
  // analysisACOXML(formData).then((res) => {
  //   state.isShowAcoFileUp = false
  //   if (res.code == 200) {
  //     if (res.data) {
  //       loadFileParser(JSON.parse(res.data.geoJson), 'acoFile')
  //       ElMessage.success('上传导入成功!')
  //     }
  //   }
  // })
}
</script>
<style lang="less" scope>
.menu-bottom02 {
  height: 60px !important;
}
.menu-bottom {
  width: 100%;
  height: 100px;
  background: rgba(6, 29, 72, 0.9);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  align-items: center;

  .solid {
    display: inline-block;
    height: 76px;
    border: 1px solid #767ea3;
  }

  .solid02 {
    height: 40px !important;
  }

  .btnLeft {
    width: 25%;
    height: 76px;
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    // align-content: space-between;
    vertical-align: middle;
    list-style-type: none;
    align-items: center;
    padding: 0;

    .bottomfile {
      width: 88px;
      height: 32px;
      font-size: 14px;
      font-family: MicrosoftYaHeiSemibold;
      background: #1f436d;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      color: rgba(255, 255, 255, 0.8);
      margin-right: 5px;
      line-height: 32px;
      border-radius: 10px;
      border: 1px solid #1f436d;
    }

    &.cursor {
      li {
        cursor: pointer;
      }
    }

    li {
      width: 88px;
      height: 32px;
      font-size: 14px;
      font-family: MicrosoftYaHeiSemibold;
      // background: url(@/assets/images/seat/btn.png);
      background: #1f436d;
      background-repeat: no-repeat;
      background-size: 100% 100%;
      color: rgba(255, 255, 255, 0.8);
      margin-right: 5px;
      line-height: 32px;
      border-radius: 10px;
    }
  }

  .btnCenter {
    display: flex;
    width: 15%;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    padding: 0;

    li {
      background: url(@/assets/images/seat/ellipse.png);
      width: 34px;
      height: 36px;
      margin: 5px;
      display: flex;
      align-items: center;
      justify-content: center;

      img {
        height: 21px;
        width: 19px;
      }
    }
  }

  .aBox {
    display: flex;
    width: 12%;
    justify-content: center;
    padding: 0 15px;

    &.cursor {
      div {
        cursor: pointer;
      }
    }

    // height: 100%;
    .controllar {
      height: 76px;
      width: 55%;
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
      align-items: center;
      // padding: 0 15px;

      p {
        font-size: 14px;
        font-family: MicrosoftYaHeiSemibold;
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .redBtn {
      background: url(@/assets/images/seat/redBtn.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 92px;
      height: 36px;

      span {
        line-height: 36px;
        vertical-align: middle;
        font-size: 14px;
        font-family: MicrosoftYaHeiSemibold;
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .grayBtn {
      background: url(@/assets/images/seat/grayBtn.png);
      background-repeat: no-repeat;
      background-size: 100% 100%;
      width: 92px;
      height: 36px;

      span {
        line-height: 36px;
        vertical-align: middle;
        font-size: 14px;
        font-family: MicrosoftYaHeiSemibold;
        color: rgba(255, 255, 255, 0.8);
      }
    }

    .grayEllipse {
      display: flex;
      flex-direction: column;
      justify-content: space-evenly;
    }
  }

  .astronomicalTime02 {
    height: 60px !important;
    .day02 {
      font-size: 13px !important;
      font-family: MicrosoftYaHeiSemibold;
      color: rgba(255, 255, 255, 0.6);
    }
  }

  .astronomicalTime {
    flex-grow: 1;
    text-align: center;
    padding: 10px 15px 0;
    height: 76px;
    width: 200px;
    list-style-type: none;

    .day {
      font-size: 14px;
      font-family: MicrosoftYaHeiSemibold;
      color: rgba(255, 255, 255, 0.6);
    }

    .date {
      font-size: 24px;
      font-family: MicrosoftYaHeiSemibold;
      color: rgba(255, 255, 255, 0.6);
      width: 100%;
    }
  }
}
</style>
