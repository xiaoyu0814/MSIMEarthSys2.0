<template>
  <div id="taskCheck">
    <div class="header">
      <span style="font-size: 18px">任务详情</span>
      <img
        src="~@/assets/images/rwty/arrows.svg"
        alt=""
        @click="closeTaskCheckBox"
      />
    </div>
    <div class="content">
      <div class="boxStyle">
        <p>基本信息</p>
        <el-descriptions>
          <el-descriptions-item label="任务名称：" :span="2">
            {{ props.taskData.name }}
          </el-descriptions-item>
          <el-descriptions-item label="任务类型：" :span="2">
            {{ props.taskData.typeName }}
          </el-descriptions-item>
          <el-descriptions-item label="任务描述：" :span="4">
            {{ props.taskData.description }}
          </el-descriptions-item>
          <el-descriptions-item label="创建时间：" :span="2">{{
            props.taskData.ctime
          }}</el-descriptions-item>
          <el-descriptions-item label="修改时间：" :span="2">{{
            props.taskData.uptime
          }}</el-descriptions-item>
        </el-descriptions>
      </div>
      <div class="center">
        <!-- <div class="left"> -->
        <div class="boxStyle mission">
          <p>想定详情</p>
          <div v-if="props.taskData.scenarioForm">
            <div class="missionInfo">
              <el-descriptions style="width: 85%">
                <el-descriptions-item label="想定名称：" :span="2">
                  {{ props.taskData.scenarioForm.name }}
                </el-descriptions-item>
                <el-descriptions-item label="想定描述：" :span="2">
                  {{ props.taskData.typeName }}
                </el-descriptions-item>
                <el-descriptions-item label="创建时间：" :span="2">{{
                  props.taskData.scenarioForm.ctime
                }}</el-descriptions-item>
                <el-descriptions-item label="修改时间：" :span="2">{{
                  props.taskData.scenarioForm.uptime
                }}</el-descriptions-item>
              </el-descriptions>
              <img :src="props.taskData.scenarioForm.picUrl" alt="" />
            </div>
            <div class="content-form">
              <el-form
                class="form"
                label-width="130px"
                :model="vueData.formContent"
              >
                <div class="background-title">
                  <div class="cicrle"></div>
                  想定背景
                </div>
                <div class="background-content">
                  <div class="content-main">
                    <div class="content-text overflow-text">
                      {{ vueData.formContent.beijing }}
                    </div>
                  </div>
                </div>
                <div class="background-title">
                  <div class="cicrle"></div>
                  任务简报
                </div>
                <div class="background-content">
                  <div class="content-main">
                    <div class="content-text overflow-JB">
                      {{ vueData.formContent.jianbao }}
                    </div>
                  </div>
                </div>
                <div class="background-title">
                  <div class="cicrle"></div>
                  任务目的
                </div>
                <div class="background-content">
                  <div class="content-main">
                    <div class="content-text overflow-MD">
                      {{ vueData.formContent.mudi }}
                    </div>
                  </div>
                </div>
              </el-form>
            </div>
          </div>
          <div class="notMission" v-else>
            <span>无想定方案</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch } from 'vue'
import store from '@/store/index'
import { playVoice } from '@/utils/voice'

const emit = defineEmits()

const props = defineProps({
  taskData: {
    type: Object,
    defind: {}
  }
})

const vueData = reactive({
  formContent: {
    beijing: store.state.curSceneInfo.thinkGround,
    jianbao: store.state.curSceneInfo.taskInfo,
    mudi: store.state.curSceneInfo.taskPurpose
  }
})

onMounted(() => {})

// 深度监听任务详情
watch(
  () => store.state.curSceneInfo,
  (newValue, oldValue) => {
    if (newValue) {
      console.log('任务详情', newValue)
      vueData.formContent.beijing = newValue.thinkGround
      vueData.formContent.jianbao = newValue.taskInfo
      vueData.formContent.mudi = newValue.taskPurpose
    }
  },
  {
    deep: true
  }
)
/**
 * @description 关闭任务查看窗口
 */
let closeTaskCheckBox = () => {
  emit('closeTaskCheckBox')
}
</script>

<style lang="less" scoped>
#taskCheck {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 1200px;
  height: 860px;
  margin-left: -520px;
  margin-top: -400px;
  background: rgba(2, 26, 70, 0.88);

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #2e4b64;
    padding: 10px;

    span {
      color: #c2d7ee;
    }

    img {
      cursor: pointer;
    }
  }

  ::v-deep(.el-table__empty-block) {
    background-color: #0c192a;
  }

  .content {
    height: 100%;

    .boxStyle {
      height: 135px;
      position: relative;
      border: 1px solid #2e4b64;
      margin: 10px;
      padding: 10px;
      box-sizing: border-box;

      p {
        position: absolute;
        left: 10px;
        top: -28px;
        color: #81d3f8;
        font-size: 16px !important;
      }

      ::v-deep(.el-descriptions__body) {
        background-color: #223b50;
        padding: 10px 0 0 20px;
      }

      ::v-deep(.el-descriptions__label) {
        color: #e5eaf3;
        font-weight: bold;
      }

      ::v-deep(.el-descriptions__content) {
        color: #e5eaf3;
      }

      tr {
        padding: 0px;
      }

      td {
        padding: 0px;
      }
    }

    .overflow-text {
      height: 120px;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      overflow: auto;
    }

    .overflow-JB {
      height: 50px;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      overflow: auto;
    }

    .overflow-MD {
      height: 30px;
      word-break: break-all;
      text-overflow: ellipsis;
      display: -webkit-box;
      overflow: auto;
    }

    .center {
      .boxStyle {
        height: 646px;
        width: calc(100% - 20px);
      }

      .mission {
        font-size: 14px;
        color: #fff;

        .missionInfo {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px;
          text-align: left;

          .describe {
            margin-top: 5px;
            height: 60px;
            display: flex;
            align-items: center;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          img {
            width: 150px;
            height: 90px;
          }
        }

        .missionDate {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 5px;
          padding-top: 0;
        }

        .content-form {
          .form {
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

                font-size: 18px;
                display: flex;
                flex-direction: column;

                .task-time {
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
                  .blueForce-item {
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
                  .redForce-item {
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

      .seat {
        height: 426px;
        width: 48.5%;
        color: #fff;

        .seatInfo_box {
          padding-top: 5px;
          text-align: left;
          font-size: 14px;

          li {
            padding: 1px 10px;
          }
        }

        .statistics {
          height: 50px;

          display: flex;
          align-items: center;
          justify-content: space-around;

          li {
            margin: 5px;
            background-image: linear-gradient(
              to right,
              #223b5099 50%,
              #ffffff00
            );
            padding: 5px 10px;
          }
        }

        .group_box {
          display: grid;
          grid-template-columns: repeat(2, 49%);
          grid-template-rows: repeat(2, 126px);
          grid-row-gap: 10px;
          grid-column-gap: 10px;
          box-sizing: border-box;

          .group_item {
            background-color: #223b50;
            border-radius: 5px;

            h6 {
              text-align: left;
              padding: 5px 15px;
            }

            .seat_box {
              display: grid;
              grid-template-columns: repeat(5, 20%);
              grid-template-rows: 50px;
              grid-row-gap: 5px;

              .seat_item {
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;

                img {
                  width: 30px;
                }

                span {
                  font-size: 10px;
                  margin-top: 2px;
                }
              }
            }
          }
        }
      }

      .notSeat,
      .notMission {
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 20px;
        font-weight: bold;
      }
    }
  }
}

/deep/ table:not([cellpadding]) td,
table:not([cellpadding]) th {
  padding: 0px;
}
</style>

<style>
/* table:not([cellpadding]) td, table:not([cellpadding]) th{
    padding: 0px;
  } */
</style>
