<!-- 工具条 -->
<template>
  <div class="left-navbar" id="toolBar">
    <div class="navbar-btn">
      <div v-show="!state.navbarBtn[0].actived" @click="showoff(true)" @mouseenter="enterItem(state.navbarBtn[0])"
        @mouseout="outItem(state.navbarBtn[0])">
        <el-tooltip effect="light" :content="state.navbarBtn[0].name" placement="left">
          <div>
            <img :src="state.navbarBtn[0].sign
              ? state.navbarBtn[0].img4
              : state.navbarBtn[0].img3
              " :alt="state.navbarBtn[0].name" style="padding: 5px; width: 30px; height: 30px" />
          </div>
        </el-tooltip>
      </div>
      <div v-show="state.navbarBtn[0].actived">
        <div v-for="(item, index) in state.navbarBtn" :key="index" @click="selectMenu(item)"
          @mouseenter="enterItem(item)" @mouseout="outItem(item)" class="btn-item pointer-cursor"
          :class="{ earthType: item.name == '二三维切换' }">
          <el-tooltip effect="light" :content="item.name" placement="left">
            <div>
              <img :src="item.actived || state.activeMenu == item.tag || item.sign
                ? item.img2
                : item.img
                " :alt="item.name" style="padding: 5px; width: 30px; height: 30px" />
            </div>
          </el-tooltip>
        </div>
      </div>
      <layerList v-show="state.isShowTree" @showTree="showTree"
        class="animate__animated animate__backInDown animate__delay-10s">
      </layerList>
      <infoCom v-if="state.infoCom" :socketApi="state.socketApi_msg" :newMessage="state.newMessage"
        :liveType="state.liveType" @closeMessageBox="closeMessageBox"></infoCom>
      <documentCom v-if="state.documentCom" @closeDocumentBox="closeMessageBox"></documentCom>
      <!-- 量算面板 -->
      <measurePanel v-if="state.isShowMeasurePanel" class="animate__animated animate__backInDown animate__delay-10s">
      </measurePanel>
      <!-- 军标面板 -->
      <plot_XiAn v-if="state.isShowplot_XiAn" class="animate__animated animate__backInDown animate__delay-10s">
      </plot_XiAn>
      <!-- 时间控制 -->
      <Transition name="custom-classes" enter-active-class="animate__animated animate__fadeIn"
        leave-active-class="animate__animated animate__fadeOut">
        <timeControl v-if="state.isShowtimeline"></timeControl>
      </Transition>
      <!-- 语音 -->
      <VoiceConversation class="voice" v-if="state.isShowVoice"></VoiceConversation>
      <!-- 空间盒示例 -->
      <spaceBoxLegend v-if="state.showSpaceGrid"></spaceBoxLegend>
      <!-- 地形夸张 -->
      <terrainExagg v-if="state.isShowTerrainExagg"></terrainExagg>
      <!-- 仿真时间进度 -->
      <timeProcess v-if="state.isShowTimeProcess"></timeProcess>
      <!-- 根据经纬度定位 -->
      <div class="search-container animate__animated animate__backInDown animate__delay-10s" v-if="state.showSearch">
        <el-input v-model="state.lngAltHeight" style="width: 200px" placeholder="127.31,25.36,1000"
          :suffix-icon="Search" @keyup.enter.native="searchPosition()" @change="searchPosition" />
      </div>
      <!-- 历史日志表格展示 -->
      <historyLogInfor v-if="state.isShowHistoryTable"></historyLogInfor>
      <!-- acmi文件解析 -->
      <div v-if="state.isShowAcmiFileUp">
        <el-upload ref="uploadRefFile" class="upload-File" accept=".acmi" action :show-file-list="false"
          :auto-upload="true" :http-request="handleFileSuccess">
          <template #trigger>
            <el-button type="primary">acmi导入</el-button>
          </template>
        </el-upload>
      </div>
      <!-- aco文件解析 -->
      <div v-if="state.isShowAcoFileUp">
        <el-upload ref="uploadRefAcoFile" class="upload-File" accept=".xml" action :show-file-list="false"
          :auto-upload="true" :http-request="handleAcoFileSuccess">
          <template #trigger>
            <el-button type="primary">aco导入</el-button>
          </template>
        </el-upload>
      </div>
      <!-- ato文件解析 -->
      <div v-if="state.isShowAtoFileUp">
        <el-upload ref="uploadRefAtoFile" class="upload-File" accept=".xml" action :show-file-list="false"
          :auto-upload="true" :http-request="handleAtoFileSuccess">
          <template #trigger>
            <el-button type="primary">ato导入</el-button>
          </template>
        </el-upload>
      </div>
      <!-- <floatToolBar /> -->
    </div>
    <div class="videoBox" v-if="state.videoVisible">
      <h3>{{ state.videoName }}</h3>
      <video :src="state.videoPath" controls autoplay></video>
    </div>
    <!-- 根据输入名称定位弹框 -->
    <div class="search-name-container search_create" v-if="state.showNameSearch">
      <div class="searNameBox">
        <el-card v-if="state.searchNameArray.length != 0" shadow="never" style="border: none"
          class="name-search-popover">
          <el-scrollbar style="height: 355px">
            <div v-for="item in state.searchNameArray" :key="item.id" class="list-item pointer-cursor"
              @click="setstateNamePosition(item)">
              {{ item.name }}
              <div style="font-size: 10px">{{ item.description }}</div>
            </div>
          </el-scrollbar>
        </el-card>
        <el-input v-model="state.stateNamePosition" style="width: 250px; height: 32px; font-size: 14px; padding: 0 10px"
          placeholder="请输入位置名称" @keyup="searchNamePosition" clearable @clear="removeTextEntityId" />
      </div>
    </div>
  </div>
</template>

<script setup>
import emitter from '@/utils/eventbus'
import { useStore } from 'vuex'
import { reactive, watch, onMounted, onUnmounted, ref } from 'vue'
import ConnectLine from '@/utils/earthPlugin/core/actionController/connectLineController'
import infoCom from '../../components/communication/message.vue'
import socketApi_msg from '@/utils/websocket/websocketStore'
import documentCom from '../../components/communication/document.vue'
import measurePanel from '@/views/toolbar/measurePanel/measurePanel.vue'
import plot_XiAn from '@/views/toolbar/plot/plot.vue'
import timeControl from '../../components/timeline/timeControl.vue'
import terrainExagg from '../../components/terrainExagg/index.vue'
import spaceBoxLegend from '@/views/toolbar/layerList/spaceBoxLegend/index.vue'
import layerList from '@/views/toolbar/layerList/index.vue'
import {
  resetEarth,
  loadAcmiFileParser,
  loadFileParser
} from '@/utils/mapTools'
import { Search, Location } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import historyLogInfor from '@/views/toolbar/historyLogInfor.vue'
import { acmiFileParserFun, analysisACOXML } from '@/service/fileParser'
import {
  getPoiFusionByQuery
} from '@/service/getByLikeName'
import { websocketUrl_message } from '@/service/request/config'
const emit = defineEmits(['changeModel', 'openLog', 'openMessage']) //定义事件
const props = defineProps({ foo: String }) // 获取props
import { permissionList } from '@/components/permission/data.js'
onMounted(() => {
  // 权限
  getPermissionList()
  emitter.on('tagActiveClose', val => {
    state.navbarBtn.forEach(item => {
      if (item.tag == val) {
        item.actived = false
        state.activeMenu = ''
      }
    });
    switch (val) {
      case 'quickDecision':
        state.showQuickDecision = false
        break;
      case 'groupInfo':
        state.showGroupInfo = false
        break;
      case 'battleInfo':
        state.showBattleInfo = false
        break;
      case 'weatherControl':
        state.showWeatherControl = false
      case 'scenarioContent':
        state.showScenarioContent = false
      default:
        break;
    }
  })
  emitter.on('showTree', (val) => {
    let param = {
      name: '图层',
      tag: 'showTree',
      actived: false,
      img: require('@/assets/image/rightNavbar/图层.png'),
      img2: require('@/assets/image/rightNavbar/图层备份.png')
    }
    selectMenu(param)
  })
  emitter.on('gridHot', (val) => {
    state.gridHot = !val
    let param = {
      name: '侦察需求热力图',
      tag: 'gridHot',
      actived: false,
      sign: false,
      img: require('@/assets/image/rightNavbar/地球自转.png'),
      img2: require('@/assets/image/rightNavbar/地球自转-p.png')
    }
    selectMenu(param)
  })
  // 选择UE场景后可以控制UE全屏
  emitter.on('viewUE', (val) => {
    if (val) {
      state.navbarBtn.push({
        name: 'UE全屏',
        tag: 'switchingScreens',
        actived: false,
        sign: false,
        img: require('@/assets/image/rightNavbar/隐藏卫星.png'),
        img2: require('@/assets/image/rightNavbar/隐藏卫星备份.png')
      })
    } else {
      store.state.sceneModule.currentScreen = 'earthView'
      let switchingScreensIndex = state.navbarBtn.findIndex((item) => {
        return item.name == 'UE全屏'
      })
      state.navbarBtn.splice(switchingScreensIndex, 1)
    }
  })
  emitter.on('spaceGrid', (val) => {
    state.showSpaceGrid = val
  })
  emitter.on('changeTimeLineState', (val) => {
    state.isShowtimeline = val
  })
  emitter.on('changeMilitaryPlot', (val) => {
    state.showMilitaryPlot = val
  })
  emitter.on('ShowVoiceChange1', (val) => {
    state.isShowVoice = val
  })
  // socketMessage()
  //非导调席位不可切换
  if (window.localStorage.getItem('side') != 'admin') {
    if (document.getElementsByClassName('earthType').length > 0) {
      document.getElementsByClassName('earthType')[0].style.display = 'none'
    }
  }

  // 从localStorage恢复声音状态
  const savedSoundState = localStorage.getItem('systemSoundEnabled')
  if (savedSoundState !== null) {
    state.systemSoundEnabled = JSON.parse(savedSoundState)
    // 更新对应按钮的激活状态
    const systemSoundBtn = state.navbarBtn.find(
      (item) => item.tag === 'systemSound'
    )
    if (systemSoundBtn) {
      systemSoundBtn.actived = state.systemSoundEnabled
    }
  } else {
    // 如果localStorage中没有保存状态，使用默认状态并写入localStorage
    const systemSoundBtn = state.navbarBtn.find(
      (item) => item.tag === 'systemSound'
    )
    if (systemSoundBtn) {
      state.systemSoundEnabled = systemSoundBtn.actived
      localStorage.setItem(
        'systemSoundEnabled',
        JSON.stringify(state.systemSoundEnabled)
      )
    }
  }

  // 应用声音状态到所有媒体元素
  const audioElements = document.querySelectorAll('audio')
  const videoElements = document.querySelectorAll('video')

  audioElements.forEach((audio) => {
    audio.muted = !state.systemSoundEnabled
  })

  videoElements.forEach((video) => {
    video.muted = !state.systemSoundEnabled
  })
})
onMounted(() => {
  // 添加点击外部区域关闭弹框的事件监听
  // document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  // state.socketApi_msg.closeWebSocket()
  // 清除名称查询定时器
  clearinptNameSearchState()
  // 移除事件监听
  // document.removeEventListener('click', handleClickOutside)
})

// 点击外部区域关闭弹框
const handleClickOutside = (event) => {
  const searchContainer = document.querySelector('.search-name-container')
  if (searchContainer && !searchContainer.contains(event.target)) {
    state.showNameSearchList = false
  }
}
const store = useStore()

const state = reactive({
  activeMenu: '', //当前选中的左侧列表
  earthswitch: store.state.sceneModule.earthRotate,
  gridHot: true, //热力图
  constellationVisible: false, //是否星座面板
  legendoffShow: false,
  navbarBtn: [
    {
      name: '工具栏',
      tag: 'showoff',
      actived: false,
      sign: false,
      img: require('@/assets/image/rightNavbar/显.png'),
      img2: require('@/assets/image/rightNavbar/显-p.png'),
      img3: require('@/assets/image/rightNavbar/显.png'),
      img4: require('@/assets/image/rightNavbar/隐-p.png')
    },
    {
      name: '图层管理',
      tag: 'showTree',
      actived: false,
      img: require('@/assets/image/rightNavbar/图层.png'),
      img2: require('@/assets/image/rightNavbar/图层备份.png')
    },
    {
      name: '复位',
      tag: 'reset',
      actived: false,
      sign: false,
      img: require('@/assets/image/rightNavbar/复位.png'),
      img2: require('@/assets/image/rightNavbar/复位备份.png')
    },
    {
      name: '二三维切换',
      tag: 'toogleDimension',
      actived: false,
      sign: false,
      img: require('@/assets/image/rightNavbar/二三维.png'),
      img2: require('@/assets/image/rightNavbar/二三维备份.png')
    },
    {
      name: '量算',
      tag: 'measurement',
      actived: false,
      sign: false,
      img: require('@/assets/image/rightNavbar/dgx1.png'),
      img2: require('@/assets/image/rightNavbar/dgx2.png')
    },
    {
      name: '名称定位',
      tag: 'inputNamePosition',
      actived: false,
      sign: false,
      img: require('@/assets/image/rightNavbar/地球自转.png'),
      img2: require('@/assets/image/rightNavbar/地球自转-p.png')
    },
    {
      name: '正北方向',
      tag: 'dueNorth',
      actived: false,
      sign: false,
      img: require('@/assets/image/rightNavbar/正北方向+.png'),
      img2: require('@/assets/image/rightNavbar/正北方向--.png')
    },
    {
      name: '编组信息',
      tag: 'groupInfo',
      actived: false,
      sign: false,
      img: require('@/assets/image/rightNavbar/编组信息.png'),
      img2: require('@/assets/image/rightNavbar/编组信息-.png')
    },
    {
      name: '作战信息',
      tag: 'battleInfo',
      actived: false,
      sign: false,
      img: require('@/assets/image/rightNavbar/图例.png'),
      img2: require('@/assets/image/rightNavbar/图例-p.png')
    },
    {
      name: '天气导调',
      tag: 'weatherControl',
      actived: false,
      sign: false,
      img: require('@/assets/image/rightNavbar/天气导调.png'),
      img2: require('@/assets/image/rightNavbar/天气导调-.png')
    },
    {
      name: '快速裁决',
      tag: 'quickDecision',
      actived: false,
      sign: false,
      img: require('@/assets/image/rightNavbar/快速裁决.png'),
      img2: require('@/assets/image/rightNavbar/快速裁决-.png')
    },
    {
      name: '想定面板',
      tag: 'scenarioContent',
      actived: false,
      sign: false,
      img: require('@/assets/image/rightNavbar/想定面板.png'),
      img2: require('@/assets/image/rightNavbar/想定面板-.png')
    }
  ],
  isShowTree: false, //是否展示图层列表
  isScenarioExecution: false, //场景执行按钮
  isShowMeasurePanel: false, //量算面板
  isShowGroup: false, // 切换编组单个显示和群体显示
  isShowEntities: true, //第一次点击隐藏
  isShowDia: false,
  isShowlegent: false,
  GraticuleController: null, // 经纬网对象
  showReconnaissanceArea: true, // 侦察区域
  showReconnaissanceObject: true, // 侦察对象
  showMilitaryPlot: false, //军标
  isShowVoice: false, //czml路径
  detectLineStates: ['straight', 'parabola', 'hide'], // 所有探测线状态
  curDetectLineState: 'straight', // 当前探测线状态
  infoCom: false, // 信息通信
  documentCom: false, // 文电通信
  isShowplot_XiAn: false, //军标面板
  isShowtimeline: false, //时间控制
  showSpaceGrid: false, //空间盒
  socketApi_msg: socketApi_msg,
  isShowTerrainExagg: false,
  isShowTimeProcess: false, //仿真时间进度
  newMessage: {},
  liveType: true,
  lngAltHeight: '',
  showSearch: false,
  isShowHistoryTable: false,
  isShowAcmiFileUp: false,
  isShowAcmiFileParser: false, //Acmi文件解析
  isShowAcoFileUp: false, //aco解析
  isShowAcoFileParser: false, //Acmi文件解析
  isShowAtoFileUp: false, //ato解析
  isShowAtoFileParser: false, //Acmi文件解析
  videoPath: '',
  videoName: '当前无视频',
  videoVisible: false,
  systemSoundEnabled: true, // 系统声音开关状态
  isShowSceneEvent: true, // 场景事件
  showNameSearch: false, // 名称定位状态
  showNameSearchList: false, // 结果列表状态
  stateNamePosition: '', // 名称定位输入名称
  searchNameArray: [], // 模糊查询名称的数组
  showBattleInfo: false,  //作战信息显隐
  showQuickDecision: false,  // 快速裁决显隐
  showWeatherControl: false,  // 天气导调显隐
  showGroupInfo: false, // 编组信息显隐
  showScenarioContent: false  // 想定面板显隐
})

// 权限
const getPermissionList = () => {
  // 获取用户权限列表
  let userRole = window.localStorage.getItem('roleCode')
  state.userPermissionList = permissionList[userRole]
  const index1 = state.userPermissionList?.toolbarList?.indexOf('时间控制')
  const index2 = state.userPermissionList?.toolbarList?.indexOf('语音交互')
  if (index1 == -1 && index2 == -1) {
    const barIndex1 = state.navbarBtn.findIndex(
      (item) => item.name === '时间控制'
    )
    if (barIndex1 > -1) state.navbarBtn.splice(barIndex1, 1)
    const barIndex2 = state.navbarBtn.findIndex(
      (item) => item.name === '语音交互'
    )
    // 不存在，删除选项
    if (barIndex2 > -1) state.navbarBtn.splice(barIndex2, 1)
  }
}

window.pushCallbacl = () => {
  let path = sessionStorage.getItem('path')
  if (path.indexOf('mp') > -1) {
    state.navbarBtn[5].actived = false
  } else {
    state.navbarBtn[5].actived = true
  }
  selectMenu(state.navbarBtn[5])
}
// 按钮移入移出
const enterItem = (item) => {
  // if (item.actived == false) {
  //   return
  // }
  item.sign = true
}
// 关闭
const closeMessageBox = (item) => {
  state.infoCom = false
  state.documentCom = false
}
const outItem = (item) => {
  if (item.name == '复位') {
    item.actived = false
  }
  item.sign = false
}
// 连接webscoket--消息通信
const socketMessage = () => {
  let url_msg = `${websocketUrl_message}/${sessionStorage.getItem('userId')}`
  state.socketApi_msg.initWebSocket(getsocketResult_msg, url_msg)
}
// 工具条点击事件
const selectMenu = (item) => {
  state.activeMenu = ''
  item.actived = !item.actived
  // 创建连线类
  let connectLineManage = new ConnectLine()
  switch (item.tag) {
    case 'showTree':
      if (state.isShowTree) {
        state.activeMenu = ''
      } else {
        state.activeMenu = item.tag
      }
      showTree()
      break
    case 'reset':
      reset()
      break
    case 'dueNorth':
      item.actived = !item.actived
      setViewEarthByDueNorth()
      break
    case 'toogleDimension':
      toogleDimension()
      break
    case 'systemSound':
      // 切换系统声音开关状态
      state.systemSoundEnabled = !state.systemSoundEnabled
      item.actived = state.systemSoundEnabled
      // 获取所有音频和视频元素
      const audioElements = document.querySelectorAll('audio')
      const videoElements = document.querySelectorAll('video')

      // 设置所有媒体元素的静音状态
      audioElements.forEach((audio) => {
        audio.muted = !state.systemSoundEnabled
      })

      videoElements.forEach((video) => {
        video.muted = !state.systemSoundEnabled
      })
      // 保存声音状态到localStorage，以便刷新后保持
      localStorage.setItem(
        'systemSoundEnabled',
        JSON.stringify(state.systemSoundEnabled)
      )

      console.log(`系统声音已${state.systemSoundEnabled ? '开启' : '关闭'}`)
      return
      store.commit('setSystemSound', !curSystemSound)
      emitter.emit('showHawkEye', curSystemSound)
      console.log('系统声音')
      break
    // 图例
    case 'legendoff':
      // store.state.sceneModule.legendoff = !store.state.sceneModule.legendoff
      state.legendoffShow = !state.legendoffShow
      store.commit('setLegendoffShow', state.legendoffShow)
      legendoff(state.legendoffShow)
      break
    case 'showoff':
      showoff(false)
      break
    // 网格热力图
    case 'gridHot':
      if (!state.gridHot) {
        state.activeMenu = item.tag
      } else {
        state.activeMenu = ''
      }
      item.actived = !item.actived
      state.gridHot = !state.gridHot
      // addHeatMap(state.gridHot)
      reset()
      break
    case 'switchingScreens':
      store.state.sceneModule.currentScreen =
        store.state.sceneModule.currentScreen == 'earthView'
          ? 'UEView'
          : 'earthView'
      break
    case 'infoCom':
      state.infoCom = true
      break
    case 'documentCom':
      state.documentCom = true
      break
    case 'timeProcess':
      state.isShowTimeProcess = !state.isShowTimeProcess
      state.isShowTimeProcess
        ? (state.activeMenu = item.tag)
        : (state.activeMenu = '')
      break
    case 'inputNamePosition': // 名称定位
      state.stateNamePosition = null
      state.showNameSearch = !state.showNameSearch
      if (!state.showNameSearch) {
        state.searchNameArray = []
      }
      removeTextEntityId()
      break
    case 'battleInfo':
      // 作战信息
      state.showBattleInfo = !state.showBattleInfo
      let params = {
        label: '作战信息',
        name: 'realTimeInformation',
        props: {}
      }
      if (state.showBattleInfo) {
        emitter.emit('rightComp', params)
      } else {
        emitter.emit('closeBottomControlPanel', 'right')
      }
      break
    case 'quickDecision':
      // 快速裁决
      state.showQuickDecision = !state.showQuickDecision
      let params1 = {
        label: '快速裁决',
        name: 'quickArbitration',
        props: {}
      }
      if (state.showQuickDecision) {
        emitter.emit('bottomComp', params1)
      } else {
        emitter.emit('closeBottomControlPanel', 'bottom')
      }
      break
    case 'weatherControl':
      // 天气导调
      state.showWeatherControl = !state.showWeatherControl
      let params2 = {
        label: '天气导调',
        name: 'weatherConfig',
        props: {}
      }
      if (state.showWeatherControl) {
        emitter.emit('sceneConfigComp', params2)
      } else {
        emitter.emit('closeBottomControlPanel', 'three')
      }
      break
    case 'groupInfo':
      // 编组信息
      state.showGroupInfo = !state.showGroupInfo
      let params3 = {
        label: '编组信息',
        name: 'groupTab',
        props: {}
      }
      if (state.showGroupInfo) {
        emitter.emit('leftComp', params3)
      } else {
        emitter.emit('closeBottomControlPanel', 'left')
      }
      break
    case 'scenarioContent':
      // 想定信息
      state.showScenarioContent = !state.showScenarioContent
      let params4 = {
        label: '想定内容',
        name: 'scenario',
        props: {}
      }
      if (state.showScenarioContent) {
        emitter.emit('sceneConfigComp', params4)
      } else {
        emitter.emit('closeBottomControlPanel', 'three')
      }
      break
    case 'measurement':
      state.isShowMeasurePanel = !state.isShowMeasurePanel
      break
    default:
      break
  }
}

//复位
const reset = () => {
  resetEarth()
}

// 正北方向
const setViewEarthByDueNorth = () => {
  //获取当前屏幕中心点的位置
  let centerResult = window.EarthViewer.camera.pickEllipsoid(
    new window.MSIMEarth.Cartesian2(
      window.EarthViewer.canvas.clientWidth / 2,
      window.EarthViewer.canvas.clientHeight / 2
    )
  )
  let curPosition =
    window.MSIMEarth.Ellipsoid.WGS84.cartesianToCartographic(centerResult)
  let curLongitude = (curPosition.longitude * 180) / Math.PI
  let curLatitude = (curPosition.latitude * 180) / Math.PI

  // 获取相机位置坐标
  let a = {
    lon: curLongitude,
    lat: curLatitude
  }
  //获取当前相机的位置
  var position = window.EarthViewer.scene.camera.positionCartographic
  // 弧度转经纬度
  var longitude = window.MSIMEarth.Math.toDegrees(position.longitude)
  var latitude = window.MSIMEarth.Math.toDegrees(position.latitude)
  var height = position.height

  // 获取屏幕中心点位置坐标
  let b = { lng: longitude, lat: latitude, h: height }
  let clickPosition1 = window.MSIMEarth.Cartesian3.fromDegrees(a.lon, a.lat, 0)
  let clickPosition2 = window.MSIMEarth.Cartesian3.fromDegrees(
    b.lng,
    b.lat,
    b.h
  )
  // 计算两个点之间的距离
  let distancetemp = window.MSIMEarth.Cartesian3.distance(
    clickPosition1,
    clickPosition2
  )

  window.EarthViewer.camera.flyTo({
    destination: window.MSIMEarth.Cartesian3.fromDegrees(
      curLongitude,
      curLatitude,
      distancetemp // 屏幕到地图中心距离
    ),
    duration: 0, // 以秒为单位的飞行持续时间。
    orientation: {
      heading: 0.0,
      pitch: -window.MSIMEarth.Math.PI_OVER_TWO,
      roll: 0
    }
  })
}

// 二三维切换
let mapType = ref('mapView')
const toogleDimension = () => {
  //非导调席位不可切换
  if (window.localStorage.getItem('side') != 'admin') return
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
    if (
      store.getters.getChangeCameraView == '第一视角' ||
      store.getters.getChangeCameraView == '第三视角'
    ) {
      ElMessage.error('此视角只能在三维下进行切换!')
      return false
    }
    if (window.zyts) {
      ElMessage.warning('战役态势图层只能在三维下显示,请先关闭图层!')
      return
    }
    viewer.scene.morphTo2D(0)
    viewer.view = 'mapView'
    mapType.value = 'sceneView'
  }
}

// 显示图层列表
const showTree = () => {
  state.isShowTree = !state.isShowTree
  emit('showTree', state.isShowTree)
  emitter.emit('constellationVisible', false) //星座配置隐藏
  state.navbarBtn.map((item) => {
    if (item.tag == 'constellationConfiguration') {
      item.actived = false
    }
  })
}

watch(
  () => store.state.sceneModule.sceneBid,
  (newValue, oldValue) => {
    if (store.state.sceneModule.sceneBid != '') {
      state.navbarBtn = arr
    }
  }
)

// 图例开关
const legendoff = (e) => {
  store.commit('setLegendoff', e)
}

// 工具条开关
const arr = state.navbarBtn
const showoff = (e) => {
  state.navbarBtn[0].actived = e
  if (!store.state.sceneModule.legendoff) {
    state.navbarBtn = state.navbarBtn.filter((item) => item.name != '图例')
    // state.navbarBtn = state.navbarBtn.filter((item) => item.name != '导调控制')
    state.navbarBtn = state.navbarBtn.filter(
      (item) => item.name != '导出推演结果'
    )
  } else {
    state.navbarBtn = arr
  }
}
/**
 * @description 获取socket推送的消息--信息通信
 * @param { Object } res 消息数据
 */
let getsocketResult_msg = (res) => {
  if (res.type) {
    if (res.type == 1) {
      state.newMessage = res
      store.commit('ADD_MESSAGESTORE', res)
    }
  }
  if (res.content && res.content.userId != sessionStorage.getItem('userId')) {
    state.liveType = !state.liveType
    if (res.content.liveType == 1) {
      ElNotification({
        title: '通知',
        dangerouslyUseHTMLString: true,
        message: `用户 <span style="font-weight:bold">${res.content.nickName}</span> 下线`,
        duration: 2000
      })
    }
    if (res.content.liveType == 2) {
      ElNotification({
        title: '通知',
        dangerouslyUseHTMLString: true,
        message: `用户 <span style="font-weight:bold">${res.content.nickName}</span> 上线`,
        duration: 2000
      })
    }
  }
}
//根据经纬度进行定位
const searchPosition = () => {
  if (window.EarthViewer.entities.getById('point-position')) {
    window.EarthViewer.entities.removeById('point-position')
  }
  let positoins = state.lngAltHeight
  if (positoins.split(',').length != 3) {
    ElMessage.warning('请输入正确的格式')
    return
  }
  let lng = positoins.split(',')[0],
    lat = positoins.split(',')[1],
    height = positoins.split(',')[2]
  if (lng && lat && height) {
    let entity = window.EarthViewer.entities.add({
      id: 'point-position',
      position: window.MSIMEarth.Cartesian3.fromDegrees(
        Number(lng),
        Number(lat),
        Number(height)
      ),
      point: {
        pixelSize: 4,
        color: window.MSIMEarth.Color.RED, // 设置颜色并设置透明度,
        outlineColor: window.MSIMEarth.Color.YELLOW,
        outlineWidth: 2
        // distanceDisplayCondition:
        //   new window.MSIMEarth.Color.WHITE.DistanceDisplayCondition(0, 25e5)
      }
    })
    // 视角跳转到目标区域
    window.EarthViewer.flyTo(entity)
    // window.EarthViewer.camera.flyTo({
    //   destination: window.MSIMEarth.Cartesian3.fromDegress(
    //     Number(lng),
    //     Number(lat),
    //     Number(height)
    //   ),
    //   duration: 1.5,
    //   complete: () => { }
    // })
  }
}

// 名称查询定时器
let inptNameSearchState = null
// 清除定时器
const clearinptNameSearchState = () => {
  if (inptNameSearchState) {
    clearTimeout(inptNameSearchState)
  }
}
// 清除名称查询的地图实体
const removeTextEntityId = () => {
  const entitiesArrar = Array.from(window.EarthViewer.entities.values)
  entitiesArrar.forEach((item) => {
    const TextEntityId = item.id
    if (
      TextEntityId.includes('TextEntityName') ||
      TextEntityId.includes('TextPolygonName')
    ) {
      window.EarthViewer.entities.remove(item)
    }
  })
  window.EarthViewer.dataSources._dataSources.forEach((e) => {
    if (e.name.includes('TextEntityPolygon')) {
      window.EarthViewer.dataSources.remove(e)
    }
  })
}

// 设置选中的位置名称
const setstateNamePosition = async (item) => {
  removeTextEntityId()
  if (!item.geojson) {
    // 视角跳转到目标区域
    cameraFlyTo(item.lon, item.lat, 100000)
    // 地图上添加名称
    ceateTextEntities(item.id, item.lon, item.lat, item.name)
  } else {
    // 在地图上添加区域
    createPolygonEntities(item.id, item.lon, item.lat, item.name, item.geojson)
  }
}
// 请求名称的位置信息方法
const requestInputNamePosition = (inputName) => {
  if (inputName.query && inputName.query.trim() != '') {
    getPoiFusionByQuery(inputName)
      .then((res) => {
        if (res.code == 200 && res.data.length != 0) {
          let areaState = res.data
          state.searchNameArray = areaState.map((item) => ({
            name: item.name,
            lon: item.lng,
            lat: item.lat,
            id: item.adcode,
            description: item.description.replace(/^-/, ''),
            geojson: item.geojson
          }))
        } else {
          ElMessage.error('未找到该名称对应的位置信息')
          // 无搜索结果时关闭 popover
        }
      })
      .catch((error) => {
        ElMessage.error('查询位置失败')
      })
  }
}
// - 名称输入框键盘事件
const searchNamePosition = (e) => {
  clearinptNameSearchState()
  // 位置名称
  let inputName = { query: state.stateNamePosition }
  if (inputName.query.trim() == '') {
    state.searchNameArray = []
  }
  // 名称查询-点击enter直接查询
  if (e && e.key === 'Enter') {
    removeTextEntityId()
    clearinptNameSearchState() // 确保定时器被清除
    requestInputNamePosition(inputName)
  } else {
    inptNameSearchState = setTimeout(() => {
      removeTextEntityId()
      requestInputNamePosition(inputName)
    }, 2000)
  }
}
// 名称搜索创建文本实体
const ceateTextEntities = (id, lon, lat, name) => {
  window.EarthViewer.dataSources._dataSources.forEach((e) => {
    if (e.name.includes('TextEntityPolygon')) {
      window.EarthViewer.dataSources.remove(e)
    }
  })
  window.EarthViewer.entities.add({
    id: `TextEntityName_${id}`,
    name: name,
    position: window.MSIMEarth.Cartesian3.fromDegrees(lon, lat, 1000),
    label: {
      text: name,
      font: '24px 微软雅黑',
      fillColor: window.MSIMEarth.Color.WHITE,
      backgroundColor: window.MSIMEarth.Color.BLACK.withAlpha(0.5),
      padding: new window.MSIMEarth.Cartesian2(5, 5),
      verticalOrigin: window.MSIMEarth.VerticalOrigin.BOTTOM,
      horizontalOrigin: window.MSIMEarth.HorizontalOrigin.CENTER,
      scaleByDistance: new window.MSIMEarth.NearFarScalar(
        1.0e2,
        1.0,
        1.0e7,
        0.1
      )
    }
  })
}
// 创建面区域
const createPolygonEntities = (id, lon, lat, name, geojson) => {
  window.EarthViewer.dataSources._dataSources.forEach((e) => {
    if (e.name.includes('TextEntityPolygon')) {
      window.EarthViewer.dataSources.remove(e)
    }
  })
  window.EarthViewer.dataSources
    .add(
      window.MSIMEarth.GeoJsonDataSource.load(geojson, {
        stroke: window.MSIMEarth.Color.HOTPINK,
        fill: window.MSIMEarth.Color.PINK.withAlpha(0.5),
        strokeWidth: 3,
        clampToGround: true,
        text: name
      })
    )
    .then((dataSources) => {
      dataSources.name = `TextEntityPolygon_${id}`
    })

  window.EarthViewer.entities.add({
    id: `TextPolygonName_${id}`,
    position: window.MSIMEarth.Cartesian3.fromDegrees(lon, lat, 1000),
    label: {
      //文字标签
      text: name,
      font: '18px sans-serif',
      horizontalOrigin: window.MSIMEarth.HorizontalOrigin.LEFT,
      verticalOrigin: window.MSIMEarth.VerticalOrigin.CENTER,
      pixelOffset: new window.MSIMEarth.Cartesian2(0, -20),
      fillColor: window.MSIMEarth.Color.WHITE,
      distanceDisplayCondition: new window.MSIMEarth.DistanceDisplayCondition(
        0,
        20e5
      ),
      outlineColor: window.MSIMEarth.Color.WHITE,
      outlineWidth: 1,
      style: window.MSIMEarth.LabelStyle.FILL_AND_OUTLINE
    }
  })

  window.EarthViewer.camera.flyTo({
    destination: window.MSIMEarth.Cartesian3.fromDegrees(lon, lat, 1000000)
  })
}
// 视角跳转
const cameraFlyTo = (lon, lat, height) => {
  window.EarthViewer.camera.flyTo({
    destination: window.MSIMEarth.Cartesian3.fromDegrees(lon, lat, height)
  })
}
// - 根据下拉选项定位
const selectNamePosition = () => {
  state.searchNameArray.forEach((item) => {
    if (item.name == state.stateNamePosition) {
      removeTextEntityId()
      // 定位
      cameraFlyTo(item.lon, item.lat, 100000)
      // 地图上添加名称
      ceateTextEntities(item.id, item.lon, item.lat, item.name)
    }
  })
}
watch(
  () => state.stateNamePosition,
  () => {
    selectNamePosition()
  }
)
// 隐藏名称查询框时清除定时器
watch(
  () => state.showNameSearch,
  () => {
    if (inptNameSearchState) {
      clearTimeout(inptNameSearchState)
    }
  }
)
/**
 * @description 导入 成功后调用 解析上图
 * @param {*} res
 * @param {*} file
 * @return {*}
 */
const handleFileSuccess = (param) => {
  let file = param.file
  let formData = new FormData()
  formData.append('file', file)
  acmiFileParserFun(formData).then((res) => {
    state.isShowAcmiFileUp = false
    if (res.code == 200) {
      if (res.data) {
        loadAcmiFileParser(res.data)
        ElMessage.success('上传导入成功!')
      }
    }
  })
}
//导入ACO成功回调
const handleAcoFileSuccess = (param) => {
  let file = param.file
  let formData = new FormData()
  formData.append('file', file)
  formData.append('scenarioId', store.state.curSceneInfo.id)
  analysisACOXML(formData).then((res) => {
    state.isShowAcoFileUp = false
    if (res.code == 200) {
      if (res.data) {
        loadFileParser(JSON.parse(res.data.geoJson), 'acoFile')
        ElMessage.success('上传导入成功!')
      }
    }
  })
}

</script>

<style lang="less" scoped>
.left-navbar {
  height: 50px;
  width: auto;
  background: transparent;
  z-index: 999;
  position: absolute;
  right: 1%;
  top: 7%;

  .navbar-logo {
    height: 50px;
    padding: 10px 0;
  }

  .navbar-btn {
    display: flex;

    .btn-item pointer-cursor {
      display: inline-block;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 50px;
      width: 50px;
    }
  }

  .videoBox {
    position: fixed;
    right: 100px;
    top: 100px;
    height: 300px;
    width: 300px;
    background-image: url('~@/assets/image/panelIcons/装饰.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    background-color: rgba(2, 26, 70, 0.58);
    box-shadow: 0 0 25px #1092d58a;
    padding: 5px;

    h3 {
      color: #fff;
      margin: 5px 0;
    }

    video {
      height: calc(100% - 34px);
      width: 100%;
    }
  }
}

.search-container {
  position: absolute;
  right: 68px;
  top: 5px;

  :deep(.el-input__icon) {
    cursor: pointer;
  }
}

.upload-File {
  position: absolute;
  right: 60px;
  top: 40px;
}

.search-name-container {
  position: fixed;
  right: 332px;
  bottom: 2px;

  :deep(.el-input__icon) {
    cursor: pointer;
  }
}

.search_create {
  display: flex;
  align-items: center;
  justify-content: space-between;

  :deep(.el-input__wrapper) {
    font-size: 14px;
    background-color: #2b4559 !important;
    box-shadow: 0 0 0 1px #075d89 inset;

    .el-input__inner {
      color: #ffffff;
      font-size: 14px;
    }
  }

  .el-button {
    background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
    width: 80px;
    height: 30px;
    color: #ffff;
    border-radius: 5px;
    margin-left: 10px;
    cursor: pointer;
  }

  .right-item {
    width: 83px;
    height: 33px;
    margin-left: 10px;
    background-image: url(@/assets/images/xdbj/big-bg.svg);
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;

    span {
      color: #ffff;
      padding-left: 5px;
    }

    span:hover {
      padding-left: 5px;
      color: #a5a4b5;
      cursor: pointer;
    }
  }
}

.searNameBox {
  display: flex;
  flex-direction: column;
  align-items: center;
}

// 优化 el-popover 的 UI 样式，与 search_create 风格一致
.name-search-popover {
  width: 229px;
  background-color: #2b4559 !important;
  border: 1px solid #075d89 !important;
  box-shadow: 0 0 15px rgba(16, 146, 213, 0.5);
  margin-bottom: 5px;

  .popper__arrow {
    border-top-color: #2b4559 !important;
    border-bottom-color: #2b4559 !important;
  }

  .el-card {
    background-color: transparent !important;
    border: none !important;
  }

  .el-card__body {
    padding: 0 !important;
  }

  .list-item {
    padding: 10px 15px;
    color: #ffffff;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      background-color: #075d89;
      color: #ffffff;
    }
  }

  .el-scrollbar__wrap {
    overflow-x: hidden;
  }
}
</style>
