<template>
  <div class="home-header">
    <div class="header-container">
      <div class="headbox_system"></div>
      <div class="headbox_timetw">
        <div class="time1"></div>
      </div>
      <div class="header">{{ state2.systemName }}</div>
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
    </div>
    <div class="sceneSelectDIV">
      <el-tooltip :content="state2.currentTaskName" placement="bottom" effect="dark">
        <span style="
            padding-left: 10px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            max-width: 150px;
            display: inline-block;
          " :style="state2.currentTaskName == '请选择场景'
            ? 'color:#cccccc; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 150px; display: inline-block;'
            : 'color:#ffffff; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; max-width: 150px; display: inline-block;'
            ">
          {{ state2.currentTaskName }}
        </span>
      </el-tooltip>
    </div>
    <div class="taskInfo_" v-if="state2.showTaskInfo">
      {{ state2.taskInfo ? state2.taskInfo?.taskName + ' — ' + state2.taskInfo?.factorName : '' }}
    </div>
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
import { eventControllerSSEClose } from '@/utils/mapTools'
const router = useRouter()

const props = defineProps({
  title: {
    type: String,
    default: EarthAPP.sysTitle
  }
})

const displayTitle = computed(() => {
  const titleExtension = store.state.sceneModule.systemConfig.titleExtension
  if (titleExtension) {
    return EarthAPP.sysTitleQZ + EarthAPP.sysTitle
  }
  return EarthAPP.sysTitle
})

const { state } = creatScene()
const state2 = reactive({
  systemName: `${displayTitle.value}-${store.state.experimentModule.subSysName ||
    window.localStorage.getItem('subSysName')
    }`, //'有人无人协同智能作战仿真支持系统',
  msgMessionTime: '', // 场景时间
  showHomePanel: false, // 左右两侧面板显隐
  loginSeat: {
    img: require('@/assets/image/homeHeader/logo_white.png')
  }, //登录席位
  systemConfig: false, //系统配置面板
  currentTaskName: '', // 当前任务名称
  minimize: false, //  任务名称右边图标显隐
  showTaskInfo: false,
  taskInfo: {}, // 数管系统当前正在复盘的任务信息
})

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
  () => displayTitle.value,
  (newValue) => {
    state2.systemName = `${newValue}-${store.state.experimentModule.subSysName ||
      window.localStorage.getItem('subSysName')
      }`
  },
  { immediate: true }
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
  // bottom控制header席位状态
  emitter.on('changeHeaderStatus', (val) => {
    state2.showHomePanel = val
  })
  emitter.on('sendMinimize', (val) => {
    state2.minimize = val
  })
  emitter.on('fpTaskInfo', (val) => {
    state2.taskInfo = val
  })
  setTimeout(() => {
    if (state2.taskInfo?.taskName) {
      state2.showTaskInfo = true
    } else {
      state2.showTaskInfo = false
    }
  }, 3000);
})
onUnmounted(() => {
  if (EventController) {
    eventControllerSSEClose(EventController)
  }
  state2.currentTaskName = ''
  store.state.sceneModule.sceneInfo = {}
})
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

  // background: url('~@/assets/image/top.png');
  background: url('@/assets/image/homeHeader/顶部背景图.png');
  // background: url('@/assets/image/dataScreen/切图蓝-2.png');
  background-size: 100% 100%;
  z-index: 21; // 云渲染上要添加系统头,zindex设置比云渲染高

  .header-container {
    display: flex;
    align-items: center;
    height: 68px;
    right: 30px;

    .headbox_system {
      height: 60px;
      // width: calc(50% - 210px);
      // flex: 1.5;
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
        color: white;
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
      font-size: 20px;
      line-height: 24px;
      font-weight: 700;
      color: white;
      font-family: Roboto;
      letter-spacing: 0px;
      display: flex;
      justify-content: center;
      padding-top: 10px;
      box-sizing: border-box;
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
        // padding: 0 10px;
        text-align: left;
      }

      .time1 {
        margin-right: 50px;
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
        // padding: 0 10px;
        text-align: left;
        margin-left: 70px;
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
        color: white;
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
      right: 30px;
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
    width: 350px;
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
  font-size: 17px;
  font-weight: 600;
}

.ledTime1 {
  color: #d1f6ff;
  /* font-family: "led regular"; */
  font-size: 17px;
  font-weight: 600;
  margin-left: 10px;
  font-family: 'digital-7', sans-serif;
}

.ledname2 {
  color: #00cbff;
  font-size: 17px;
  font-weight: 600;
}

.ledTime2 {
  color: #d1f6ff;
  /* font-family: "led regular"; */
  font-size: 17px;
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
}

.system-item2 {
  // width: 100px;
  height: 100%;
  background-size: 100% 100%;
  font-size: 17px;
  color: white;
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
    width: 150px;
    height: 200px;
    background-color: #172e51 !important;
    box-shadow: 0 0 25px #1092d5;

    .select-item:hover {
      background: url('@/assets/image/panelIcons/下拉选项背景.png');
      background-size: 100% 100%;
      //color: rgba(1, 230, 213, 1);
      color: #00cbff;

      //border: none !important;
      //box-shadow: none;
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
    color: #00cbff;
  }

  .scene_input {
    // margin-top: 25px;
    border: none !important;

    :deep(.el-input__inner) {
      font-size: 18px;
      font-weight: 500;
      color: #06d6f9;
      border: none !important;
      text-align: center;
    }

    :deep(.el-input__wrapper) {
      background-color: #172e51 !important;
      box-shadow: 0 0 25px #1092d5;
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
  }
}

.taskInfo_ {
  color: #ffc51f;
  font-size: 17px;
  font-weight: 600;
  position: absolute;
  top: 85px;
  left: 51%;
  transform: translate(-60%, 0);
}
</style>
