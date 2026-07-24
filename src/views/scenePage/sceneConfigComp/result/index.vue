<template>
  <div
    class="conclusion-plan animate__animated animate__fadeInUp animate__delay-2200s"
  >
    <!-- <div class="content-title">想定</div> -->
    <!-- <div class="system-config" @click="showScenarioDetails">
      <el-tooltip effect="light" content="" placement="left">
        <img
          src="@/assets/image/homeHeader/ai.png"
          alt=""
          srcset=""
          style="width: 20px; height: 20px"
        />
      </el-tooltip>
    </div> -->
    <img
      src="@/assets/image/panelIcons/关闭icon.png"
      alt=""
      class="close_sty"
      @click="handleClose"
    />
    <div class="content-form">
      <el-form class="form" label-width="130px" :model="state.formContent">
        <div class="background-title">
          <div class="cicrle"></div>
          推演结果
        </div>
        <div class="background-content">
          <div class="content-main">
            <div class="content-text overflow-text">
              此时，红方已完成既定战略目的。通过陆海空天协同结合无人装备集群作战优势，以多手段攻击、分批次攻击、全域式攻击等攻击方式对蓝方预警雷达、指控系统等高价值实体目标实施跟踪、干扰及攻击。依靠数量、速度、协同、情报等作战优势，多方向、度空间、多领域对蓝方实施攻击，直至达成作战目标。
            </div>
          </div>
        </div>
        <!-- <div class="background-title">
          <div class="cicrle"></div>
          任务简报
        </div> -->
        <!-- <div class="background-content">
          <div class="content-main">
            <div class="content-text overflow-JB">
              {{ state.formContent.jianbao }}
            </div>
          </div>
        </div>
        <div class="background-title">
          <div class="cicrle"></div>
          任务目的
        </div> -->
        <!-- <div class="background-content">
          <div class="content-main">
            <div class="content-text overflow-MD">
              {{ state.formContent.mudi }}
            </div>
          </div>
        </div> -->
        <!-- <div class="background-title">
          <div class="cicrle"></div>
          战场环境
        </div>
        <div class="background-content">
          <div class="content-main">
            <div class="content-text">
              {{ state.formContent.taskEnvironment }}
            </div>
          </div>
        </div>
        <div class="background-title">
          <div class="cicrle"></div>
          情报要素
        </div>
        <div class="background-content">
          <div class="content-main">
            <div class="content-text">
              {{ state.formContent.taskIntel }}
            </div>
          </div>
        </div> -->
        <!-- <div class="confrontation-class">
          <div class="ourStrength"></div>
          <div class="ourStrength-content">
            <div class="title">蓝方兵力</div>
            <div class="blueForce">
              <div style="font-size: 80px" v-if="state.side == 'red'">未知</div>
              <div style="display: flex; flex-wrap: wrap" v-else>
                <el-form-item
                  class="blueForce-item"
                  v-for="(value, key) in state.formContent.blueForce"
                  >{{ key }}：{{ value }}
                </el-form-item>
              </div>
            </div>
          </div>
          <div class="enemyTarget"></div>
          <div class="enemyTarget-content">
            <div class="title">红方兵力</div>
            <div class="redForce">
              <div style="font-size: 80px" v-if="state.side == 'blue'">
                未知
              </div>
              <div style="display: flex; flex-wrap: wrap" v-else>
                <el-form-item
                  class="redForce-item"
                  v-for="(value, key) in state.formContent.redForce"
                  >{{ key }}：{{ value }}
                </el-form-item>
              </div>
            </div>
          </div>
        </div> -->
        <div class="form-image">
          <div class="image-path"></div>
          <div class="image-airport"></div>
        </div>
        <!-- <div class="form-btnList">
          <el-button type="primary" :icon="Microphone" @click="setVoice"
            >播放语音</el-button
          >
          <el-button type="primary" :icon="Microphone" @click="pauseVoice"
            >暂停语音</el-button
          > -->
        <!-- <el-button
            v-if="state.showSceneBtn"
            type="primary"
            :icon="View"
            @click="checkMemberOfTask(store.state.curSceneInfo, true)"
            >想定推演</el-button
          > -->
        <!-- </div> -->
      </el-form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'
import emitter from '@/utils/eventbus'
import { speechSynthesis } from './hooks/index'
import store from '@/store'
import { playVoice } from '@/utils/voice'
import { View, Microphone } from '@element-plus/icons-vue'
import { creatScene } from '@/views/homeHeader/hooks/index'
import { getResultByRefresh } from '@/service/SSE'
import { loadingTask } from '@/views/seatManagement/adminuser/taskManagement/hooks/index.js'
const { checkMemberOfTask } = loadingTask()
const { sceneSelectChange } = creatScene()
import { useRouter } from 'vue-router'

const router = useRouter()

const state = reactive({
  side: window.localStorage.getItem('side'),
  formContent: {
    beijing: store.state.curSceneInfo.thinkGround,
    jianbao: store.state.curSceneInfo.taskInfo,
    mudi: store.state.curSceneInfo.taskPurpose,
    // ourStrength: '指挥所、兵营\n战斗机、雷达、导弹车',
    // enemyTarget: '航母、驱逐舰、护卫舰\n舰载战斗机、无人机、电子战飞机',
    redForce: {
      // 护航飞机: 1,
      // 航母编队: 1,
      // 驱逐舰: 2,
      // 无人轰炸机: 4,
      // 有人机: 1,
      // 歼击机: 4,
      // 电子战飞机: 2,
      // 指挥基地: 2,
      // 无人机: 4,
      // 无人侦察机: 11
    },
    blueForce: {
      // 雷达: 6,
      // 指挥基地: 3,
      // 地面站: 4,
      // 飞机场: 1,
      // 目标: 4,
      // 作战飞机: 4,
      // 导弹发射车: 3
    },
    taskTime: '2023年5月30日12时',
    taskArea: '113.33- 122.65E，23.96 -24.07N',
    goon: false
  },
  showSceneBtn:
    window.localStorage.getItem('systemTitle') == '任务推演' ? true : false
})
//显示详情详情
const showScenarioDetails = () => {
  // emitter.emit('DetailsShow', true)

  // router.push({
  //   path: '/home/ThinkAboutDetails',
  //   target: '_blank'
  // })
  window.open('http://localhost:8080/#/ThinkAboutDetails', '_blank')
  // router.push({ name: '/home/ThinkAboutDetails' }) // 使用命名路由或直接传递路径和参数
}
speechSynthesis()
onMounted(() => {
  // 打开想定播报背景，暂时关闭，采用手动播报
  // if (store.state.curSceneInfo.voiceName) {
  //   playVoice(store.state.curSceneInfo.voiceName)
  // }
  let taskId = store.state.curSceneInfo.id ? store.state.curSceneInfo.id : ''
  let params = {
    id: taskId
  }
  getResultByRefresh(params).then((res) => {
    if (res.code == 200) {
      state.formContent.redForce = res.data.red.typeOfEquipment
      state.formContent.blueForce = res.data.blue.typeOfEquipment
    }
  })
})
const setVoice = () => {
  emitter.emit('configVoice', state.formContent.beijing)
  // if (store.state.curSceneInfo.voiceName) {
  //   playVoice(store.state.curSceneInfo.voiceName)
  // }
}
//暂停语音播放
const pauseVoice = () => {
  if (state.goon) {
    emitter.emit('resumeVoice')
    state.goon = !state.goon
    return
  }
  emitter.emit('pauseVoice')
  state.goon = !state.goon
  // if (store.state.sceneModule.voiceUrl) {
  //   store.state.sceneModule.voiceUrl.pause()
  // }
}
// watch(
//   () => store.state.sceneModule.startingFalseInfo,
//   (newVal) => {
//     state.formContent.redForce = newVal.red.typeOfEquipment
//     state.formContent.blueForce = newVal.blue.typeOfEquipment
//   }
// )
// 深度监听任务详情
watch(
  () => store.state.curSceneInfo,
  (newValue, oldValue) => {
    if (newValue) {
      console.log('任务详情', newValue)
      state.formContent.beijing = newValue.thinkGround
      state.formContent.jianbao = newValue.taskInfo
      state.formContent.mudi = newValue.taskPurpose
    }
  },
  {
    deep: true
  }
)
const handleClose = () => {
  emitter.emit('tyResultShow', false)
}
</script>

<style lang="less" scoped>
.conclusion-plan {
  position: absolute;
  top: 46%;
  left: 28%;
  transform: translate(-50%, 0%);

  z-index: 0;
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

  .close_sty {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 20px;
    width: 20px;
    height: 20px;
    z-index: 1;
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
          --font-size: 13px;
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

      .el-button {
        background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
        width: 100px;
        height: 35px;
        color: #ffff;
        border-radius: 5px;
        margin-left: 10px;
        cursor: pointer;
      }
    }

    .overflow-text {
      height: 120px;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      overflow: auto;
      /* -webkit-box-orient: vertical; */
      /* -webkit-line-clamp: 5;*/
    }

    .overflow-JB {
      height: 50px;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      overflow: auto;
      /* -webkit-box-orient: vertical; */
      /* -webkit-line-clamp: 5;*/
    }

    .overflow-MD {
      height: 30px;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      overflow: auto;
      /* -webkit-box-orient: vertical; */
      /* -webkit-line-clamp: 5;*/
    }
  }

  .overflow-JB {
    height: 50px;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    overflow: auto;
    /* -webkit-box-orient: vertical; */
    /* -webkit-line-clamp: 5;*/
  }

  .overflow-MD {
    height: 30px;
    word-break: break-all;
    text-overflow: ellipsis;
    display: -webkit-box;
    overflow: auto;
    /* -webkit-box-orient: vertical; */
    /* -webkit-line-clamp: 5;*/
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
</style>
