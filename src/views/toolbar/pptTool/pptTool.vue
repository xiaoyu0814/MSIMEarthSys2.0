<!--
 * @Author: lvzhui
 * @Date: 2024-04-01 11:23:42
 * @LastEditTime: 2024-04-01 15:00:12
 * @LastEditors: lvzhui
 * @Description: 演播模式面板组件
 * @FilePath: \smartearthsys\src\components\pptTool\pptTool.vue
-->
<template>
  <div class="ppt-tool"></div>
</template>
<script setup>
import {
  reactive,
  toRefs,
  ref,
  onUnmounted,
  onMounted,
  watch,
  nextTick,
  getCurrentInstance
} from 'vue'
// const store = useStore()

// const state = reactive({
//   List: [],
//   isShowList: false,
//   curIndex: -1,
//   treeData: '',
//   curSecId: '',
//   cardItemTitle: '',
//   myTimeDisplay: null, //定时器
//   isUpdateDate: false,
//   currentDate: {}, //当前日期
//   currentTime: '', //当前时间
//   controlMapStyle: {
//     top: '90%',
//     left: '50%'
//   }, //菜单栏css位置
//   listStyle: {
//     top: '57%',
//     right: '70%'
//   }, //场景列表css
//   showToolBar: false, //右上角工具栏
//   isShowVoice: true, // 是否展示右下角语音按钮
//   videoUrl: '',
//   showVideo: false,
//   isfloatMenu: true,
//   curScence: null,
//   datePickRef: ref()
// })
</script>

<style lang="less" scoped>
.ppt-tool {
  caret-color: transparent;
}

.norem-header-title {
  position: absolute;
  left: 1%;
  top: 0;
  z-index: 1001;

  img {
    height: 50px;
    margin: 5px;
  }
}

.norem-tool-main {
  position: absolute;
  // right: calc(50% - 215px);
  // bottom: calc(10% - 50px);
  // bottom: 0;
  //left:13px;
  right: calc(100% - 450px);
  bottom: 30px;
  display: flex;
  flex-direction: column-reverse;
  align-items: baseline;
  z-index: 999;
  .float-tool {
    // left: 700px;
    // bottom: 15px;
  }

  .list_con {
    background: rgba(0, 34, 47, 0.78);
    color: #fff;
    // margin: 10px;
    // position: fixed;
    // bottom: 50%;
    // right: 1%;
    padding: 10px;
    overflow: auto;
    max-height: 400px;
    border-top: 4px solid #229e71;
    border-bottom: 2px solid #229e71;
    width: 300px;
    z-index: 11111;

    .title_main {
      display: flex;
      justify-content: space-between;
      align-items: center;

      .title_bg {
        display: flex;
        align-items: center;

        img {
          margin-right: 10px;
        }
      }

      .square {
        width: 5px;
        height: 5px;
        background: #00ffb0;
        margin-right: 5px;
      }

      .square1 {
        background: #00ff1a;
      }
    }

    .norem-tree_sty {
      text-align: left;

      .tree_label {
        display: flex;
        align-items: center;
        background: rgba(0, 185, 150, 0.48);
        margin-bottom: 5px;
        padding-left: 10px;
        font-size: 18px;
      }

      .tree_info {
        // padding: 5px 15px;
        font-size: 15px;
        margin-bottom: 10px;

        div {
          background: rgba(0, 180, 146, 0.15);
          margin-bottom: 5px;
          padding-left: 35px;
        }

        .color_active {
          color: #00ff1a;
          cursor: default;
        }

        .color_com {
          color: #fff;
          cursor: default;
        }
      }
    }
  }
}

.container_sty {
  display: flex;
  background: #fff;
  color: #000;

  div {
    margin: 10px;
  }

  div:hover {
    color: #409eff;
  }
}

.cloud-card {
  position: fixed;
  left: 50%;
  top: 38px;
  z-index: 1000;
  color: #ddf7ff;
  font-family: PingFangSC-Regular;
  font-size: 38px;
  font-weight: 700;
  letter-spacing: 10px;
  // transform: translate(-50%, -50%);

  p {
    text-wrap: nowrap;
  }
}

.top-bg {
  position: fixed;
  width: 100vw;
  z-index: 999;
  top: 0;
  left: 0;
  height: 80px;
  // background: linear-gradient(
  //   180deg,
  //   rgba(247, 252, 255, 0.14) 19%,
  //   rgba(10, 211, 145, 0.63) 84%
  // );
  background: url('@/assets/image/header/new-bkg.png') no-repeat;
}

.cur-time {
  position: fixed;
  right: 2%;
  top: 25px;
  z-index: 1000;
  // background: linear-gradient(to top, #5ae4ff00, #70ecff, #5ae4ff00);
  // background-image: linear-gradient(180deg, #5AE3FF 0%, #70ECFF 100%,#82FFFF 0%);
  // -webkit-background-clip: text;
  // -webkit-text-fill-color: transparent;
  font-family: PingFangSC-Medium;
  font-size: 24px;
  font-weight: 500;
  border-radius: 2px;
  letter-spacing: 3px;
  color: #abecff;
  .cur-time-xian {
    background: linear-gradient(to top, #5ae4ff00, #70ecff, #5ae4ff00);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }
  .cur-time-date {
    position: relative;
    text-align: center;
    color: #84ffe0;
    padding: 4px 13px;
  }
  .cur-time-date::before {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    z-index: -1;
    transform: skew(157deg);
    background-image: linear-gradient(
      180deg,
      rgba(130, 208, 210, 0) 0%,
      rgba(102, 185, 187, 0.52) 46%,
      rgba(75, 163, 166, 0) 100%
    );
    border-radius: 2px;
  }
  .time-icon {
    margin: 0 10px 0 0;
    img {
      width: 20px;
      height: 20px;
    }
  }
  .time-text {
    font-family: PingFangSC-Medium;
  }
  .timeClass {
    cursor: pointer;
    margin: 0 15px 0 15px;
  }
}

.page_con {
  width: 100vw;
  // height: 100px;
  // background: url('~@/assets/image/newBg/底部备份.png');
  // background-size: 100% 100%;
  position: absolute;
  bottom: 0;
  left: 0;

  .next_prev_sty {
    position: absolute;
    color: #fff;
    bottom: 129px;
    display: flex;
    left: 50%;
    transform: translate(-50%, -50%);

    .empty_sty {
      width: 688px;
    }

    .prev_sty:hover {
      color: #06cf38;
    }

    .next_sty:hover {
      color: #06cf38;
    }
  }

  .page_show_sty {
    position: absolute;
    color: #fff;
    bottom: 149px;
    display: flex;
    right: 32%;
    transform: rotate(-4deg);
    cursor: default;
  }
}

// .transitionAnimation {
//   opacity: 0;
//   position: absolute;
//   width: 100%;
//   height: 100%;
//   top: 0;
//   left: 0;
// }
// .dynamicStyle {
//   animation: rotate 3s;
// }
// @keyframes rotate {
//   from {
//     opacity: 1;
//     transform: rotate(0deg);
//   }
//   to {
//     opacity: 0;
//     transform: rotate(360deg);
//   }
// }

.test_video {
  width: 100%;
  height: 100vh;
  z-index: 11111;
  position: absolute;
  top: 0;
  left: 0;
  background: #000;
  animation: disappear 5s ease-in-out;
  background: url('@/assets/image/ppt/背景.jpg');
  background-size: 100% 100%;
}

@keyframes disappear {
  0% {
    opacity: 1;
  }

  100% {
    opacity: 0;
  }
}

.test_video2 {
  min-width: 400px !important;
  min-height: 400px !important;
  position: absolute !important;
  top: 50% !important;
  left: 50% !important;
  transform: translate(-50%, -50%) !important;
}
</style>
