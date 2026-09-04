<!--
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2026-07-07 14:17:07
 * @LastEditors: chenguopeng2 chenguopeng.piesat.cn
 * @LastEditTime: 2026-08-26 13:57:04
 * @FilePath: \MSIMEarthSystem\src\views\homeHeader\HomeHeader.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="home-header">
    <div class="header-container">
      <div class="headbox_system">
        <div style="position: absolute; left: 70px; font-size: 20px; color: var(--text-primary)" title="用户名称">
          {{ state2.account }}
        </div>
      </div>
      <div class="headbox_timetw">
        <div class="time1">
          <span class="ledname1">天文时间:</span>
          <span class="ledTime1">{{ state2.currentTime }}</span>
        </div>
      </div>
      <div class="header">
        <span style="font-size: 24px; color: var(--title-color-soft)">{{
          displayTitle
        }}</span><br />
        {{ state2.systemName }}
      </div>
      <div class="headbox_time">
        <div class="time2">
          <span class="ledname2">仿真时间:</span>
          <span class="ledTime2">{{
            store.state.sceneModule.msgMessionTime
          }}</span>
        </div>
      </div>
      <div class="header_img" @click="changeHomePanel">
        <img :src="state2.loginSeat.img" alt="" srcset="" style="width: 32px; height: 32px" />
      </div>
      <!-- 用户 -->
      <el-tooltip effect="light" content="返回" placement="bottom" offset="-5">
        <div class="user-config">
          <el-popover trigger="click" placement="top-start" width="200" effect="dark">
            <div class="user_box" style="
                display: flex;
                flex-direction: column;
                justify-content: space-between;
                align-items: center;
              ">
              <div style="
                  display: flex;
                  flex-direction: column;
                  justify-content: space-between;
                  align-items: center;
                  margin-bottom: 10px;
                ">
                <img src="~@/assets/images/user.png" style="width: 20px; height: 20px" />
                <span style="font-size: 16px; font-weight: 600; margin-top: 3px">
                  {{ state2.account }}</span>
              </div>
              <el-button size="small" type="primary" style="margin: 10px 0" @click="gotoHomePage">
                返回首页
              </el-button>
            </div>
            <template #reference>
              <el-badge :is-dot="false" class="badge">
                <img src="~@/assets/images/user.png" alt="用户" style="width: 20px; height: 20px" />
              </el-badge>
            </template>
          </el-popover>
        </div>
      </el-tooltip>
      <!-- 录屏 -->
      <ScreenRecorder />
      <!-- 系统配置 -->
      <div class="system-config" @click="systemConfig">
        <el-tooltip effect="light" content="系统配置" placement="bottom">
          <img src="@/assets/image/homeHeader/ai.png" alt="" srcset="" style="width: 20px; height: 20px" />
        </el-tooltip>
      </div>
    </div>
    <div class="sceneSelectDIV">
      <el-tooltip :content="state2.currentTaskName" placement="bottom" effect="dark">
        <span style="
            padding-left: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 200px;
            display: inline-block;
          " :style="state2.currentTaskName == '请选择场景'
            ? 'color:var(--text-tertiary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 550px; display: inline-block;'
            : 'color:var(--text-primary); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 550px; display: inline-block;'
            ">
          {{ state2.currentTaskName }}
        </span>
      </el-tooltip>
    </div>
  </div>
  <div class="custom-dialog-class">
    <el-dialog v-model="state2.dialogShow" :width="400" :height="350" title="修改密码" model="false"
      :before-close="handleClose" class="custom-dialog-class">
      <pwdView />
    </el-dialog>
  </div>
</template>

<script setup>
import { creatScene } from '@/views/homeHeader/hooks/index'
import {
  onMounted,
  reactive,
  ref,
  defineProps,
  watch,
  computed,
  onUnmounted
} from 'vue'
import store from '@/store/index'
import emitter from '@/utils/eventbus'
import { useRouter } from 'vue-router'
import pwdView from '../hooks/passwordManagement/index.vue' //基本信息详情
import route from '@/router'
import ScreenRecorder from './child/ScreenRecorder.vue' // 录屏组件
import { eventControllerSSEClose } from '@/utils/mapTools'
const router = useRouter()

const sysTitle = ref(EarthAPP.sysTitle)

const props = defineProps({
  title: {
    type: String,
    default: EarthAPP.sysTitle
  },
  showList: {
    type: String,
    default: ''
  }
})

const displayTitle = computed(() => {
  const titleExtension = store.state.sceneModule.systemConfig.titleExtension
  if (titleExtension) {
    return EarthAPP.sysTitleQZ + EarthAPP.sysTitle
  }
  return EarthAPP.sysTitle
})
const { state, sceneSelectChange } = creatScene()
const state2 = reactive({
  // systemName: `智能作战仿真实验分系统-${
  //   store.state.experimentModule.subSysName ||
  //   window.localStorage.getItem('subSysName')
  // }`, //'有人无人协同智能作战仿真支持系统',
  systemName: `无人智能作战仿真推演分系统`, //环境影响仿真推演及态势多维呈现
  isSimulationPop: false,
  experimentalDesign: false,
  currentTime: '', // 天文时间
  ws: null, // 场景时间消息对象
  msgMessionTime: '', // 场景时间
  isShowSys: false,
  navigationShowage: '',
  showHomePanel: false, // 左右两侧面板显隐
  loginSeat: {
    img: require('@/assets/image/homeHeader/logo_white.png')
  }, //登录席位
  systemConfig: false, //系统配置面板
  currentTaskName: '', // 当前任务名称
  minimize: false, //  任务名称右边图标显隐
  account: localStorage.getItem('account'),
  headerShow: true, //导航栏显隐
  groupType: sessionStorage.getItem('groupType'),
  dialogShow: false,
  // selectIndex: 10,
  selectArrList: [
    {
      name: '软件入口',
      selet: 0,
      show: false
    }
  ],
  earthShow: false,
  navbarBtn_left: [
    {
      name: '实验资源管理',
      show: false,
      url: '',
      child: [
        { name: '实验基础数据库', url: '' },
        { name: '战（案）例数据库', url: '' },
        { name: '想定数据库', url: '' },
        { name: '仿真实验数据库', url: '' },
        { name: '模型库', url: '' },
        { name: '数据安全管理', url: '' },
        { name: '设备权限管理', url: '' }
      ]
    },
    {
      name: '作战实验准备',
      url: '',
      show: false,
      child: [
        { name: '作战场景构建', url: 'sceneConstruction' },
        { name: '作战概念开发', url: 'conceptDevelopment' },
        { name: '实验数据配置', url: 'dataConfig' }
      ]
    },
    {
      name: '作战仿真实验',
      url: '',
      show: false,
      child: []
    },
    {
      name: '实验数据分析',
      url: '',
      show: false,
      child: []
    }
  ]
})

// 计算属性：截断currentTaskName，只显示10个字符
const truncatedTaskName = computed(() => {
  if (state2.currentTaskName.length > 10) {
    return state2.currentTaskName.substring(0, 10) + '...'
  }
  return state2.currentTaskName
})
// 系统配置
const systemConfig = () => {
  state2.systemConfig = !state2.systemConfig
  emitter.emit('systemConfig', state2.systemConfig)
}
watch(
  () => store.state.sceneModule.sceneInfo,
  (newValue, oldValue) => {
    // 获取当前任务名称或者想定名称
    if (newValue) {
      state2.currentTaskName = newValue.name //'1000批：最大节点容量'
      // 增加本地配置，如果本地配置不为空则使用本地配置
      if (EarthAPP.currentTaskName !== null) {
        state2.currentTaskName = EarthAPP.currentTaskName
      }
    }
  },
  { immediate: true, deep: true }
)
watch(
  () => store.state.experimentModule.subSysName,
  (newValue, oldValue) => {
    // 获取当前任务名称或者想定名称
    if (newValue) {
      state2.systemName
    }
  },
  { immediate: true, deep: true }
)
watch(
  () => store.getters.getAnalysisInfoData,
  (newVal) => {
    if (newVal) {
      if (
        typeof newVal.comparison === 'undefined' ||
        typeof newVal.comparison.ForceSize === 'undefined'
      )
        return
      let situationAnalysis = newVal.comparison.ForceSize
      vueData.dimensions = situationAnalysis.dataset.dimensions
      vueData.source = situationAnalysis.dataset.source
      getEcharts()
    }
  },
  { deep: true }
)

onMounted(() => {
  // 定时天文时间
  setInterval(() => {
    let d = new Date()
    let year = d.getFullYear()
    let month =
      d.getMonth() + 1 < 10 ? '0' + (d.getMonth() + 1) : d.getMonth() + 1
    let day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate()
    let hour = d.getHours() < 10 ? '0' + d.getHours() : d.getHours()
    let minute = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes()
    let second = d.getSeconds() < 10 ? '0' + d.getSeconds() : d.getSeconds()
    state2.currentTime =
      year + '-' + month + '-' + day + ' ' + hour + ':' + minute + ':' + second
  }, 1000)

  // bottom控制header席位状态
  emitter.on('changeHeaderStatus', (val) => {
    state2.showHomePanel = val
  })
  emitter.on('sendMinimize', (val) => {
    state2.minimize = val
  })
  emitter.on('setSystemConfigStatus', val => {
    state2.systemConfig = val
  })
})
onUnmounted(() => {
  if (EventController) {
    eventControllerSSEClose(EventController)
  }
  state2.currentTaskName = ''
  store.state.sceneModule.sceneInfo = {}
})
//点击头部按钮
const clickHeaderItem = (item) => {
  item.show = !item.show
  if (item.url) {
    router.push(item.url)
  }
  if (item.name == '实验数据分析') {
    if (item.show) {
      store.commit('setExperimentalDataAnalysisVisible', true)
    } else {
      store.commit('setExperimentalDataAnalysisVisible', false)
    }
    store.commit('setUrl', '')
    store.commit('setExperimentalBasicDatabaseVisible', false)
  } else if (item.name == '作战仿真实验') {
    store.commit('setUrl', '')
    store.commit('setExperimentalBasicDatabaseVisible', false)
    store.commit('setExperimentalDataAnalysisVisible', false)
  }
}

/**
 * @description 登出
 */
let gotoHomePage = () => {
  setTimeout(() => {
    router.push('/architecturePlatform')
    if (EventController) {
      eventControllerSSEClose(EventController)
    }
    state2.currentTaskName = ''
    store.state.sceneModule.sceneInfo = {}
  }, 500)
  // window.location.reload()
}
let handleClose = () => {
  state2.dialogShow = false
}
</script>
<style lang="less" scoped>
@font-face {
  font-family: 'digital-7';
  src: url('../../assets/css/fonts/digital-7.ttf');
}

.home-header {
  width: 100%;
  height: 80px;
  position: absolute;
  top: 0;

  background: var(--img-header);
  background-size: 100% 100%;
  z-index: 21; // 云渲染上要添加系统头,zindex设置比云渲染高

  .header-container {
    display: flex;
    align-items: center;
    height: 68px;
    right: 30px;

    .headbox_system {
      height: 60px;
      display: flex;
      align-items: center;
      justify-content: space-evenly;

      .headbox_system_left {
        width: 40px;
        height: 40px;

        .images {
          width: 50px;
          height: 50px;
          border: 1px solid red;
        }
      }

      .system-item {
        width: 23%;
        height: 100%;
        font-size: 17px;
        color: var(--text-primary);
        line-height: 30px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;

        .imagebody {
          width: 20px;
          height: 20px;
          margin: 0 10px;
        }
      }
    }
    // 单标题样式
    // .header {
    //   flex: 0.9;
    //   font-size: 20px;
    //   font-weight: 700;
    //   color: var(--text-primary);
    //   letter-spacing: 6px;
    //   box-sizing: border-box;
    //   position: relative;
    //   top: 0px;
    //   margin: 0 auto;
    //   text-align: center;
    //   word-break: break-all;
    // }
    // 双标题样式
    .header{
      height: 40px;
      width: 100%;
      flex: 2;
      font-size: 20px;
      font-weight: 700;
      color: var(--text-primary);
      letter-spacing: 5px;
      box-sizing: border-box;
      position: relative;
      top: -9px;
      letter-spacing: 6px;
    }
    .headbox_timetw {
      height: 60px;
      flex: 1.5;
      display: flex;
      align-items: center;
      justify-content: center; //space-evenly;
      margin-top: 2px;

      .headbox_system_right {
        width: 50px;
        height: 50px;

        .images {
          width: 50px;
          height: 50px;
          border: 1px solid red;
        }
      }

      .time1,
      .time2 {
        width: 243px;
        text-align: left;
      }

      .time1 {
        margin-right: 200px;
      }
    }

    .headbox_time {
      height: 60px;
      flex: 1.5;
      display: flex;
      align-items: center;
      justify-content: center; //space-evenly;
      margin-top: 2px;

      .headbox_system_right {
        width: 50px;
        height: 50px;

        .images {
          width: 50px;
          height: 50px;
          border: 1px solid red;
        }
      }

      .time1,
      .time2 {
        width: 243px;
        text-align: left;
        margin-left: 220px;
      }

      .time1 {
        margin-right: 50px;
      }
    }

    .header_img {
      cursor: pointer;
      padding: 10px;
      box-sizing: border-box;
      position: absolute;
      top: 8px;
      left: 10px;
      display: flex;
      align-items: center;

      .seat_name {
        padding: 10px;
        font-size: 20px;
      }

      .seat_admin {
        color: var(--text-primary);
        font-weight: bolder;
      }

      .seat_blue {
        color: var(--cyan-color);
        font-weight: bolder;
      }

      .seat_red {
        color: var(--accent-red);
        font-weight: bolder;
      }
    }

    .user-config {
      cursor: pointer;
      padding: 10px;
      box-sizing: border-box;
      position: absolute;
      top: 14px;
      right: 34px;
    }

    .system-config {
      cursor: pointer;
      padding: 10px;
      box-sizing: border-box;
      position: absolute;
      top: 14px;
      right: 2px;
    }
  }

  .sceneSelectDIV {
    position: absolute;
    left: 52%;
    top: 86%;
    transform: translate(-60%, 0);
    overflow: hidden;
    width: 450px;
    cursor: pointer;
    background-size: 100% 120%;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 50px;
    font-size: 20px;
  }

  .navbar-btn {
    display: flex;
    position: absolute;
    align-items: center;
    top: 20px;

    .switch {
      width: 30px;
      height: 30px;
    }

    .btn-item {
      display: inline-block;
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  .header {
    height: 60px;
    width: 230px;
    font-size: 20px;
    font-weight: 700;
    color: var(--text-primary);
    letter-spacing: 10px;
  }
}

.ledname1 {
  color: var(--cyan-bright);
  font-size: 17px;
  font-weight: 600;
}

.ledTime1 {
  color: #d1f6ff;
  font-size: 17px;
  font-weight: 600;
  margin-left: 10px;
  font-family: 'digital-7', sans-serif;
}

.ledname2 {
  color: var(--cyan-bright);
  font-size: 17px;
  font-weight: 600;
}

.ledTime2 {
  color: #d1f6ff;
  font-size: 17px;
  font-weight: 600;
  margin-left: 10px;
  font-family: 'digital-7', sans-serif;
}

:deep(.el-input) {
  --el-input-border-color: #e5e5e500 !important;
  --el-input-hover-border: transparent !important;
  --el-input-focus-border: transparent !important;
  --el-input-placeholder-color: var(--cyan-placeholder);
}

:deep(.el-select) {
  --el-select-border-color-hover: transparent !important;
  --el-select-input-focus-border-color: transparent !important;
}

:deep(.el-input__wrapper:hover) {
  border: none !important;
  box-shadow: none;
}

:deep(.el-input__suffix) {
  position: absolute;
  bottom: -55%;
  left: 40%;
}

:deep(.el-dialog),
:deep(.custom-dialog-class),
.custom-dialog-class {
  background: var(--img-panel-frame);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: fixed;
  left: 50%;
  top: 30%;
  transform: translate(-50%, 0%);
}

:deep(.el-dialog__body) {
  padding: 10px var(--el-dialog-padding-primary);
  color: var(--el-text-color-regular);
  font-size: var(--el-dialog-content-font-size);
  margin-bottom: 15px;
}

:deep(.el-icon),
:deep(.el-dialog__title) {
  text-align: left;
  box-sizing: border-box;
  font-size: 22px;
  font-weight: 900;
  color: var(--text-primary);
}

:deep(.el-dialog__header) {
  padding: var(--el-dialog-padding-primary);
  padding-bottom: 10px;
  margin-right: 16px;
  text-align: left;
}

.ststem-list {
  white-space: nowrap;
  background-size: 100% 100%;
  height: 35px;
  padding: 0 15px;
}

.system-item2 {
  height: 100%;
  background-size: 100% 100%;
  font-size: 17px;
  color: var(--text-primary);
  height: 38px;
  line-height: 32px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  margin-right: 8px;
  margin-left: 65px;
}

.ststem-list:hover {
  background-size: 100% 100%;
}

.select {
  background: url('@/assets/images/situationInforRelevance/选中.png');
  background-size: 100% 100%;
}

.headbox_system_left {
  width: 25%;
  height: 100%;
  background-size: 100% 100%;
  font-size: 15px;
  color: var(--text-primary);
  height: 40px;
  line-height: 36px;
  cursor: pointer;
  margin-right: 6px;

  .selectList {
    width: 150px;
    height: 200px;
    background-color: var(--input-bg) !important;
    box-shadow: var(--box-shadow-glow);

    .select-item:hover {
      background: var(--img-dropdown);
      background-size: 100% 100%;
      color: var(--cyan-bright);
    }
  }

  .ststem-list {
    white-space: nowrap;
    background-size: 100% 100%;
    height: 44px;
    padding: 0 15px;
  }

  .ststem-list:hover {
    background-size: 100% 100%;
  }

  .ststem-list_blue {
    color: var(--cyan-bright);
  }

  .scene_input {
    border: none !important;

    :deep(.el-input__inner) {
      font-size: 18px;
      font-weight: 500;
      color: var(--cyan-color);
      border: none !important;
      text-align: center;
    }

    :deep(.el-input__wrapper) {
      background-color: var(--input-bg) !important;
      box-shadow: var(--box-shadow-glow);
    }

    :deep(.el-input) {
      --el-input-border-color: #e5e5e500 !important;
      --el-input-hover-border: transparent !important;
      --el-input-focus-border: transparent !important;
      --el-input-placeholder-color: var(--cyan-placeholder);
    }

    :deep(.el-select) {
      --el-select-border-color-hover: transparent !important;
      --el-select-input-focus-border-color: transparent !important;
    }

    :deep(.el-input__wrapper:hover) {
      border: none !important;
      box-shadow: none;
    }
  }
}
</style>
