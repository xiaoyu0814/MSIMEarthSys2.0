<template>
  <div class="home-header">
    <div class="header-container">
      <div class="headbox_system">
        <div
          class="headbox_system_left"
          v-for="item in state2.navbarBtn_left"
          :key="item.name"
          @click="clickHeaderItem(item)"
        >
          <div :class="['ststem-list', { 'ststem-list_blue': item.show }]">
            {{ item.name }}
          </div>
          <!-- <a :class="['ststem-list', { 'ststem-list_blue': item.show }]" :href="`#${item.name}`">
            {{ item.name }}
          </a> -->
        </div>
      </div>
      <div class="header">{{ props.title }}</div>
      <div class="headbox_time"></div>
    </div>
  </div>
</template>

<script setup>
import { creatScene } from '@/views/homeHeader/hooks/index'
import { onMounted, reactive, ref, defineProps, watch } from 'vue'
import store from '@/store/index'
import emitter from '@/utils/eventbus'
import { useRouter } from 'vue-router'
const router = useRouter()

const props = defineProps({
  title: {
    type: String,
    default: '无人智能XX概念创新运用支持系统'
  }
})

const { state, sceneSelectChange } = creatScene()

const state2 = reactive({
  systemName: '无人智能XX概念创新运用支持系统',
  isSimulationPop: false,
  experimentalDesign: false,
  currentTime: '', // 天文时间
  ws: null, // 场景时间消息对象
  msgMessionTime: '', // 场景时间
  isShowSys: false,
  navigationShowage: '',
  title11: require('@/assets/image/homeHeader/顶部背景图.png'),
  title22: require('@/assets/image/homeHeader/头部.png'),
  showHomePanel: false, // 左右两侧面板显隐
  loginSeat: {
    img: require('@/assets/image/homeHeader/logo_white.png')
  }, //登录席位
  systemConfig: false, //系统配置面板
  currentTaskName: '', // 当前任务名称
  minimize: false, //  任务名称右边图标显隐
  side: localStorage.getItem('side'),
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
      name: '想定背景',
      show: false,
      url: '',
      child: [
        // { name: '实验基础数据库', url: '' },
        // { name: '战（案）例数据库', url: '' },
        // { name: '想定数据库', url: '' },
        // { name: '仿真实验数据库', url: '' },
        // { name: '模型库', url: '' },
        // { name: '数据安全管理', url: '' },
        // { name: '设备权限管理', url: '' }
      ]
    },
    {
      name: '任务简报',
      url: '',
      show: false,
      child: [
        // { name: '作战场景构建', url: 'sceneConstruction' },
        // { name: '作战概念开发', url: 'conceptDevelopment' },
        // { name: '实验数据配置', url: 'dataConfig' }
      ]
    },
    {
      name: '任务目的',
      url: '',
      show: false,
      child: []
    },
    {
      name: '兵力部署',
      url: '',
      show: false,
      child: []
    },
    {
      name: '执行流程',
      url: '',
      show: false,
      child: []
    }
  ]
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
})
//点击头部按钮
const clickHeaderItem = (item) => {
  // return
  const element = document.getElementById(item.name)
  if (element) {
    // 平滑滚动到元素位置
    element.scrollIntoView({
      behavior: 'smooth',
      block: 'center' // 对齐到顶部
    })
  }
}

const selectItemClick = (item) => {
  item.show = !item.show
  store.commit('setExperimentalBasicDatabaseVisible', false)
  if (item.url) {
    // router.push(item.url)
    store.commit('setUrl', item.url)
  }
  if (item.name == '实验基础数据库') {
    store.commit('setUrl', '')
    store.commit('setExperimentalBasicDatabaseVisible', true)
  }
}

const changeHomePanel = () => {
  router.push('/homeMap/HomeMapHeader')
}
/**
 * @description 修改密码
 */
let changePwd = () => {
  state2.dialogShow = true
}
/**
 * @description 重置密码
 */
let resetPwd = () => {
  ElMessageBox.confirm('确认重置密码？', '提示', {})
    .then(() => {
      //返回登录页面
      logout()
    })
    .catch(() => {})
}

const getHeight = (item) => {
  let height = item.child.length * 36
  let str = 'height:' + height + 'px'
  return str
}
/**
 * @description 登出
 */
let logout = () => {
  sessionStorage.clear()
  localStorage.clear()
  setTimeout(() => {
    router.push('/login')
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
  // src: url('../../assets/css/fonts/digital-7.ttf');
}

.home-header {
  width: 100%;
  height: 75px;
  // position: absolute;
  // top: 0;
  color: #000;

  // background: url('~@/assets/image/top.png');
  // background: url('@/assets/image/homeHeader/顶部背景图.png');
  // background: url('@/assets/image/dataScreen/切图蓝-2.png');
  background-size: 100% 100%;
  z-index: 21; // 云渲染上要添加系统头,zindex设置比云渲染高

  .header-container {
    display: flex;
    align-items: center;
    height: 68px;
    .headbox_system {
      height: 60px;
      // width: calc(50% - 210px);
      flex: 1.5;
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
        // color: white;
        color: #000;
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

    .header {
      height: 40px;
      // width: 870px;
      flex: 2;
      font-size: 40px;
      line-height: 24px;
      font-weight: 700;
      // color: white;
      color: #000;
      font-family: Roboto;
      letter-spacing: 0px;
      display: flex;
      justify-content: center;
      padding-top: 10px;
      box-sizing: border-box;
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
        width: 209px;
        // padding: 0 10px;
        text-align: left;
      }
      .time1 {
        margin-right: 50px;
      }
    }
    .header_img {
      cursor: pointer;
      // width: 60px;
      // height: 60px;
      padding: 10px;
      box-sizing: border-box;
      // background: #123a5d;
      // border-radius: 10px;
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
        color: #000;
        // color: white;
        //text-shadow: 3px 3px 5px #aeb2b3;
        font-weight: bolder;
      }

      .seat_blue {
        color: #06d6f9;
        //text-shadow: 3px 3px 5px #06d6f9;
        font-weight: bolder;
      }

      .seat_red {
        color: #f00;
        //text-shadow: 3px 3px 5px #f00;
        font-weight: bolder;
      }
    }
    .user-config {
      cursor: pointer;
      padding: 10px;
      box-sizing: border-box;
      position: absolute;
      top: 14px;
      right: 20px;
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

  // .sceneSelectDIV {
  //   margin-top: -7px;
  //   font-size: 20px;
  //   color: #fff;
  //   position: relative;
  //   cursor: pointer;

  //   .scene_input {
  //     margin-top: 25px;
  //     border: none !important;

  //     :deep .el-input__inner {
  //       font-size: 18px;
  //       font-weight: 500;
  //       // width: 150px;
  //       // background-color: transparent;
  //       color: #06d6f9;
  //       border: none !important;
  //       text-align: center;
  //       height: 30px;
  //     }

  //     :deep .el-input__wrapper {
  //       background-color: transparent;
  //     }
  //   }

  //   .arrowImg {
  //     margin: 0 0 3px -10px;
  //   }

  //   .arrow_img_left {
  //     margin: 0 0 3px 5px;
  //   }
  // }

  .sceneSelectDIV {
    position: absolute;
    left: 51%;
    top: 49%;
    transform: translate(-60%, 0);
    overflow: hidden;
    /* line-height: 30px; */
    width: 500px;
    cursor: pointer;
    // background-image: url('@/assets/image/dataScreen/补充切图-5.png');
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
      // height: 50px;
      // width: 50px;
    }
  }

  .header {
    height: 60px;
    width: 230px;
    line-height: 70px;
    font-size: 28px;
    line-height: 60px;
    font-weight: 700;
    color: white;
    font-family: Roboto;
    letter-spacing: 10px;
    display: flex;
    // align-items: center;
    justify-content: center;
  }
}

// .time1 {
//   position: absolute;
//   top: 18%;
//   left: 10%;
// }
// .time2 {
//   position: absolute;
//   top: 18%;
//   left: 67%;
// }
.ledname1 {
  color: #00cbff;
  font-size: 14px;
  font-weight: 600;
}

.ledTime1 {
  color: #d1f6ff;
  /* font-family: "led regular"; */
  font-size: 16px;
  font-weight: 600;
  margin-left: 10px;
  font-family: 'digital-7', sans-serif;
}

.ledname2 {
  color: #00cbff;
  font-size: 14px;
  font-weight: 600;
}

.ledTime2 {
  color: #d1f6ff;
  /* font-family: "led regular"; */
  font-size: 16px;
  font-weight: 600;
  margin-left: 10px;
  font-family: 'digital-7', sans-serif;
}

:deep(.el-input) {
  --el-input-border-color: #e5e5e500 !important;
  --el-input-hover-border: transparent !important;
  --el-input-focus-border: transparent !important;
  --el-input-placeholder-color: #06d6f9;
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
  background: url(@/assets/image/panelIcons/背景框.png);
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
  color: #fff;
}

:deep(.el-dialog__header) {
  padding: var(--el-dialog-padding-primary);
  padding-bottom: 10px;
  margin-right: 16px;
  text-align: left;
}
.ststem-list {
  white-space: nowrap;
  // background: url('@/assets/images/situationInforRelevance/默认.png');
  background-size: 100% 100%;
  height: 35px;
  padding: 0 15px;
  color: #000;
}
.system-item2 {
  // width: 100px;
  height: 100%;
  background-size: 100% 100%;
  font-size: 17px;
  // color: white;
  color: #000;
  height: 38px;
  line-height: 32px;
  display: flex;
  justify-content: center;
  cursor: pointer;
  margin-right: 8px;
  margin-left: 65px;
}

.ststem-list:hover {
  //background: url('@/assets/images/situationInforRelevance/选中.png');
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
  color: white;
  height: 40px;
  line-height: 36px;
  // display: flex;
  // justify-content: center;
  cursor: pointer;
  margin-right: 6px;
  .selectList {
    width: 130px;
    height: 200px;
    background: #09a9fc;
    .select-item:hover {
      background: #cccccc;
    }
  }
  .ststem-list {
    white-space: nowrap;
    //background: url("@/assets/images/默认.png");
    background-size: 100% 100%;
    height: 44px;
    padding: 0 15px;
  }

  .ststem-list:hover {
    //background: url("@/assets/images/选中.png");
    background-size: 100% 100%;
  }
  .ststem-list_blue {
    // color: #00cbff;
    color: #252b2c;
  }
}
</style>
