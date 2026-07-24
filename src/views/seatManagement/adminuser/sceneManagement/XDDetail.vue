<!-- 想定详情弹框 -->
<template>
  <div
    class="conclusion-plan animate__animated animate__fadeIn animate__delay-200s show-img"
    :style="
      state.isMaximized
        ? 'position: fixed; left: 50%; top: 8%; width: 99%;height: 90%;'
        : 'position: fixed; left: 50%; top: 12%; width: 910px;height: 810px;'
    "
  >
    <div class="content-title">想定详情</div>
    <img
      :src="
        state.isMaximized
          ? require('@/assets/image/panelIcons/maxsize.png')
          : require('@/assets/image/panelIcons/normalsize.png')
      "
      alt=""
      class="size-window_sty"
      @click="sizeWindowSty"
    />
    <img
      src="@/assets/image/panelIcons/关闭icon.png"
      alt=""
      class="close_sty"
      @click="closeImg"
    />
    <div class="background-content">
      <img :src="state.content.scenarioDetailsPic" />
    </div>
    <div class="background-title">
      <div class="cicrle"></div>
      战场环境
    </div>
    <div class="background-content">
      <div class="content-main">
        <div
          class="content-text"
          v-html="
            highLightDisplay(
              state.serach.warEnvironment,
              state.content.warEnvironment
            )
          "
        ></div>
      </div>
    </div>
    <div class="background-title">
      <div class="cicrle"></div>
      参战兵力
    </div>
    <div class="background-content">
      <div class="content-main">
        <div
          class="content-text"
          v-html="
            highLightDisplay(
              state.serach.troopsDescription,
              state.content.troopsDescription
            )
          "
        ></div>
      </div>
    </div>
    <div class="background-title">
      <div class="cicrle"></div>
      敌方动态
    </div>
    <div class="background-content">
      <div class="content-main">
        <div
          class="content-text"
          v-html="state.content.intelligenceParam"
        ></div>
      </div>
    </div>
    <div class="background-title">
      <div class="cicrle"></div>
      作战详情
    </div>
    <div class="background-content">
      <div class="content-main">
        <div
          class="content-text"
          v-html="
            highLightDisplay(
              state.serach.scenarioDetail,
              state.content.scenarioDetail
            )
          "
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'
import emitter from '@/utils/eventbus'
import store from '@/store'
import { View, Microphone } from '@element-plus/icons-vue'

const state = reactive({
  isMaximized: false,
  content: {
    scenarioDetailsPic: require('@/assets/image/dt.jpg'), //+store.state.curSceneInfo.scenarioDetailsMarkPicUrl
    warEnvironment:
      '作战区域为：N23°30′~25°30′，E120°30′~121°30′。作战区域晴天，无影响飞行及作战的天气状况。', //战场环境
    intelligenceParam: '', //情报要素
    troopsDescription: `蓝方兵力：地导雷达、导弹基地、作战飞机、打击目标（台湾XX机场机库、跑道、航站楼、兵营等）。<br>&nbsp;&nbsp;&nbsp;&nbsp;红方兵力：由航母编队（指挥中心）、驱逐舰、电子战飞机、护航飞机、作战飞机、侦察无人机编队、攻击无人机编队、无人轰炸机组成。`,
    scenarioDetail: `（一）侦察无人机编队接收指挥中心指令，自东向西进入XX机场上空，开机对机场情报信息进行凌空侦察。侦察结果回传到指挥中心；
（二）指挥中心接收到侦察情报后，向驱逐舰发送打击指令，驱逐舰发送舰地导弹，对目标（XX机场机库）实施打击；
（三）电子战飞机、作战飞机及无人轰炸机编队接到指令后，自东向西向XX机场目标区域挺近，抵达任务空域后，对蓝方地面雷达进行电子干扰，作战飞机对蓝方作战飞机进行攻击，无人轰炸机对目标（台湾XX机场跑道、航站楼、兵营等）进行精准打击。完成任务后返航；
 （四）攻击无人机编队接到指令后，自东北方向向XX机场目标区域挺近，抵达任务空域后，通过人在回路语音交互方式，对攻击无人机下达作战指令，对蓝方作战飞机进行攻击；
（五）红方一架作战飞机突破蓝方防御，进入XX机场上空，与蓝方作战飞机进行空战；
（六）通过临机导调，红方一架作战飞机出现在XX机场南部区域，由模拟器控制，对蓝方目标进行打击。`
  },
  serach: {
    warEnvironment: '云区|雨区|大浪区',
    troopsDescription: '驱逐舰|护航飞机|作战飞机',
    scenarioDetail: '歼击机|运输机编队|目标空域'
  },
  earth: window.MSIMEarth,
  viewer: window.EarthViewer
})

onMounted(() => {
  state.content = {
    scenarioDetailsPic: store.state.curSceneInfo.scenarioDetailsMarkPicUrl, //require('@/assets/image/dt.jpg')
    warEnvironment: store.state.curSceneInfo.scenarioWarEnvironment, //战场环境
    intelligenceParam: store.state.curSceneInfo.intelligenceParam, //情报要素
    scenarioDetail: store.state.curSceneInfo.scenarioDetail, //详情
    troopsDescription: store.state.curSceneInfo.troopsDescription
  }
})
const sizeWindowSty = () => {
  state.isMaximized = !state.isMaximized
}
const closeImg = () => {
  emitter.emit('isShowDetails', false)
}
/*
点击高亮文本进行后续操作
*/
window.clickhighligtStr = function (_var) {
  switch (_var) {
    case '云区':
      {
        state.viewer.camera.flyTo({
          destination: new state.earth.Cartesian3(
            -3458813.895454278,
            5781550.034114407,
            2929028.2304659183
          ),
          orientation: {
            heading: 6.164207376288082, //偏航角
            pitch: -1.5424107973690484, //-0.08401170275668313, //水平俯仰角
            roll: 0
          },
          duration: 4
        })
      }
      break
    default:
      break
  }
  console.log(_var)
}
/*
关键字高亮显示
*/
const highLightDisplay = (searchstr, contentStr) => {
  if (searchstr && contentStr) {
    var serachkey = searchstr.split('|')
    serachkey.forEach((element) => {
      // 如果文本中包含关键字就替换
      if (contentStr.includes(element)) {
        contentStr = contentStr.replace(
          element,
          //替换高亮显示样式
          `<span onclick="clickhighligtStr('${element}')" style="color:yellow;font-weight: bold; cursor: pointer">${element}</span>`
        )
      }
    })
    return contentStr
  }
  return contentStr
}
</script>

<style lang="less" scoped>
.conclusion-plan {
  resize: both;
  transform: translate(-50%, 0%);

  z-index: 999;
  width: 910px;
  color: #eee;
  background: url('@/assets/image/panelIcons/背景.png') no-repeat;
  background-size: 100% 100%;
  border: 1px solid rgba(117, 252, 255, 0.8);
  border-radius: 4px;
  backdrop-filter: blur(1px);
  // animation: zoomIn 0.4s;

  .content-title {
    background: url('@/assets/image/panelIcons/title-bg3.png') no-repeat;
    background-size: 100.1% 48px;
    height: 40px;
    line-height: 48px;
    font-size: 25px;
    color: #ffffff;
    letter-spacing: 2.4px;
    font-weight: 400;
    text-align: left;
    padding-left: 90px;
  }
  .size-window_sty {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 50px;
    width: 22px;
    height: 22px;
  }
  .close_sty {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 20px;
    width: 20px;
    height: 20px;
  }

  .content-form {
    .form {
      // margin: 0 0 10px;
      color: white;

      .background-title {
        color: #fff;
        font-size: 16px;
        font-weight: 600;
        letter-spacing: 1px;
        padding-left: 20px;
        height: 35px;
        position: relative;
        display: flex;
        align-items: center;

        &::after {
          content: '';
          position: absolute;
          height: 2px;
          width: 40%;
          background-image: linear-gradient(45deg, #48edff, transparent);
          bottom: 0px;
          left: 19px;
        }

        .cicrle {
          background: #80fbff;
          border: 3.5px solid rgba(128, 251, 255, 1);
          box-shadow: 0px 2px 3px 1px rgba(0, 0, 0, 0.3);
          box-shadow: 0px 0px 6px 1px rgba(0, 255, 245, 0.75);
          margin-right: 12px;
        }
      }

      .background-content {
        width: calc(97% - 40px);
        padding: 10px;
        margin: 10px auto;
        background: rgba(0, 231, 255, 0.1);
        border: 1px solid rgba(0, 231, 255, 0.4);
        text-align: left;
        font-size: 20px;
        letter-spacing: 3px;
        text-indent: 2em;

        .content-main {
          // height: 150px;
          padding: 10px;
          overflow: auto;

          .content-text {
            color: rgba(0, 231, 255, 1);
            transition: color ease-out 0.3s, text-shadow ease-out 0.3s;
            text-shadow: 0 0 1rem #0cf;
            text-indent: 2em;
          }

          /*滚动条高宽度*/
          &::-webkit-scrollbar {
            width: 4px;
            height: 4px;
          }

          /*滚动条滑块*/
          &::-webkit-scrollbar-thumb {
            border-radius: 3px;
            box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
            background: rgba(48, 50, 53, 0.7);
          }

          /*滚动条里面轨道*/
          &::-webkit-scrollbar-track {
            box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2) inset;
          }

          /*滚动条的小边角*/
          &::-webkit-scrollbar-corner {
            background: transparent;
          }
        }

        .content-detail {
          width: 100%;
          height: 100px;
          // padding-top: 10px;
          font-size: 18px;
          display: flex;
          flex-direction: column;

          .task-time {
            // width: 50%;
            height: 100%;
            display: flex;
            text-indent: initial;

            .time-img {
              width: 10%;
              height: 100%;
              background: url('~@/assets/image/panelIcons/任务时间.png')
                no-repeat;
              background-size: 100%;
              margin-right: 10px;
              background-position: center;
            }

            .time-content {
              width: 85%;
              height: 100%;

              .time-title {
                color: rgba(196, 255, 255, 1);
              }

              .time-main {
                color: rgba(0, 231, 255, 1);
              }
            }
          }

          .task-area {
            // width: 50%;
            height: 100%;
            display: flex;
            text-indent: initial;

            .area-img {
              width: 10%;
              height: 100%;
              background: url('~@/assets/image/panelIcons/任务区域.png')
                no-repeat;
              background-size: 100%;
              background-position: center;
              margin-right: 10px;
            }

            .area-content {
              width: 85%;
              height: 100%;

              .area-title {
                color: rgba(196, 255, 255, 1);
              }

              .area-main {
                color: rgba(0, 231, 255, 1);
              }
            }
          }
        }
      }

      .confrontation-class {
        font-size: 20px;
        // height: 200px;
        width: calc(97% - 40px);
        margin: 10px auto;
        position: relative;
        display: flex;
        justify-content: space-between;

        .ourStrength {
          height: 100%;
          width: 55%;
          background: url('~@/assets/image/panelIcons/ourStrength.png');
          background-size: 100% 100%;
          position: absolute;
          top: 0;
          left: 0;
        }

        .ourStrength-content {
          height: 100%;
          width: 50%;
          font-size: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          text-align: left;
          z-index: 999;

          .title {
            font-size: 20px;
            margin: 10px 0;
          }

          .blueForce {
            // display: flex;
            .blueForce-item {
              // margin: 10px;
            }
          }
        }

        .enemyTarget {
          height: 100%;
          width: 55%;
          background: url('~@/assets/image/panelIcons/enemyTarget.png');
          background-size: 100% 100%;
          position: absolute;
          top: 0;
          right: 0;
        }

        .enemyTarget-content {
          height: 100%;
          width: 45%;
          font-size: 20px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: flex-start;
          text-align: left;
          z-index: 999;

          .title {
            font-size: 20px;
            margin: 10px 0;
          }

          .redForce {
            // display: flex;
            .redForce-item {
              // margin: 10px;
            }
          }
        }

        :deep .el-form-item {
          display: flex;
          --font-size: 15px;
          margin-bottom: 0px;
          width: 120px;
          .el-form-item__content {
            margin: 0 !important;
          }
        }
      }

      .form-image {
        height: 100px;
        width: 100%;
        background: url('@/assets/image/panelIcons/map.png');
        background-size: 100% 100%;
        position: relative;

        .image-path {
          position: absolute;
          top: 0;
          height: 10%;
          width: 100%;
          background: url('~@/assets/image/panelIcons/path.png');
          background-size: 100% 100%;
        }

        .image-airport {
          width: 50px;
          height: 50px;
          position: absolute;
          top: -10%;
          left: 50%;
          background: url('~@/assets/image/panelIcons/airport.png');
          background-size: 100% 100%;
        }
      }

      .form-type {
        height: 50px;
      }

      .form-content {
        width: 100%;
        text-align: left;
        font-size: 30px;
        letter-spacing: 3px;
        background: rgba(255, 255, 255, 0.1);
        border-radius: 4px;
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: #eee;
        // padding: 10px;

        :deep .el-input__wrapper {
          background-color: rgba(255, 255, 255, 0.1);
          border: none !important;
          padding: 10px;
        }

        :deep .el-textarea__inner {
          background-color: rgba(255, 255, 255, 0.1);
          color: #eee;
        }

        :deep .el-input__inner {
          color: #eee;
        }
      }

      .form-button {
        :deep .el-form-item__content {
          justify-content: space-evenly;
        }

        .button-item {
          width: 60px;
          height: 30px;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 4px;
          padding: 10px;
          color: #eee;
          font-size: 30px;

          &:hover {
            cursor: pointer;
          }
        }
      }
    }
    .form-btnList {
      padding: 0 20px 20px;
      text-align: right;
    }
  }
}

:deep .el-form-item__label {
  color: white;
  font-size: 30px;
  padding: 10px;
}
.system-config {
  cursor: pointer;
  // width: 60px;
  // height: 60px;
  padding: 10px;
  box-sizing: border-box;
  // background: #123a5d;
  // border-radius: 10px;
  position: absolute;
  top: 1px;
  right: 40px;
}
.show-img {
  position: absolute;
  top: 12%;
  left: 50%;
  transform: translate(-50%, 0%);
  height: 790px;
  overflow: auto;
  z-index: 9999;
  width: 910px;
  color: #eee;
  background: url('@/assets/image/panelIcons/背景.png') no-repeat;
  background-size: 100% 100%;
  border: 1px solid rgba(117, 252, 255, 0.8);
  border-radius: 4px;
  backdrop-filter: blur(1px);
  .close_sty {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 20px;
    width: 20px;
    height: 20px;
  }
  img {
    width: 90%;
    height: 450px;
  }
  .content-title {
    background: url('@/assets/image/panelIcons/title-bg3.png') no-repeat;
    background-size: 100.1% 48px;
    height: 40px;
    line-height: 48px;
    font-size: 25px;
    color: #ffffff;
    letter-spacing: 2.4px;
    font-weight: 400;
    text-align: left;
    padding-left: 90px;
  }
  .background-title {
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    letter-spacing: 1px;
    padding-left: 20px;
    height: 35px;
    position: relative;
    display: flex;
    align-items: center;

    &::after {
      content: '';
      position: absolute;
      height: 2px;
      width: 40%;
      background-image: linear-gradient(45deg, #48edff, transparent);
      bottom: 0px;
      left: 19px;
    }

    .cicrle {
      background: #80fbff;
      border: 3.5px solid rgba(128, 251, 255, 1);
      box-shadow: 0px 2px 3px 1px rgba(0, 0, 0, 0.3);
      box-shadow: 0px 0px 6px 1px rgba(0, 255, 245, 0.75);
      margin-right: 12px;
    }
  }
  .background-content {
    width: calc(97% - 40px);
    padding: 10px;
    margin: 10px auto;
    background: rgba(0, 231, 255, 0.1);
    border: 1px solid rgba(0, 231, 255, 0.4);
    text-align: left;
    font-size: 20px;
    letter-spacing: 3px;
    text-indent: 2em;

    .content-main {
      // height: 150px;
      padding: 10px;
      overflow: auto;

      .content-text {
        color: rgba(0, 231, 255, 1);
        transition: color ease-out 0.3s, text-shadow ease-out 0.3s;
        text-shadow: 0 0 1rem #0cf;
        text-indent: 2em;
      }

      /*滚动条高宽度*/
      &::-webkit-scrollbar {
        width: 4px;
        height: 4px;
      }

      /*滚动条滑块*/
      &::-webkit-scrollbar-thumb {
        border-radius: 3px;
        box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
        background: rgba(48, 50, 53, 0.7);
      }

      /*滚动条里面轨道*/
      &::-webkit-scrollbar-track {
        box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2) inset;
      }

      /*滚动条的小边角*/
      &::-webkit-scrollbar-corner {
        background: transparent;
      }
    }

    .content-detail {
      width: 100%;
      height: 100px;
      // padding-top: 10px;
      font-size: 18px;
      display: flex;
      flex-direction: column;

      .task-time {
        // width: 50%;
        height: 100%;
        display: flex;
        text-indent: initial;

        .time-img {
          width: 10%;
          height: 100%;
          background: url('~@/assets/image/panelIcons/任务时间.png') no-repeat;
          background-size: 100%;
          margin-right: 10px;
          background-position: center;
        }

        .time-content {
          width: 85%;
          height: 100%;

          .time-title {
            color: rgba(196, 255, 255, 1);
          }

          .time-main {
            color: rgba(0, 231, 255, 1);
          }
        }
      }

      .task-area {
        // width: 50%;
        height: 100%;
        display: flex;
        text-indent: initial;

        .area-img {
          width: 10%;
          height: 100%;
          background: url('~@/assets/image/panelIcons/任务区域.png') no-repeat;
          background-size: 100%;
          background-position: center;
          margin-right: 10px;
        }

        .area-content {
          width: 85%;
          height: 100%;

          .area-title {
            color: rgba(196, 255, 255, 1);
          }

          .area-main {
            color: rgba(0, 231, 255, 1);
          }
        }
      }
    }
  }
}
</style>
