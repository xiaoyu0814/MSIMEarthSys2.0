<!--
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2025-10-16 16:17:05
 * @LastEditors: ZX Li
 * @LastEditTime: 2025-10-16 16:17:23
-->
<template>
  <div id="ss_message">
    <div class="collapse-interaction" id="log_con">
      <div class="single-log" v-for="item in state.logList" :key="item">
        <div class="left-point">
          <div class="line" :class="item.first ? 'line-first' : ''"></div>
          <div>
            <img
              class="point"
              v-if="item.camp == '0'"
              src="@/assets/image/realTimeInformation/circleWhite.png"
              alt=""
            />
            <img
              class="point"
              v-else-if="item.camp == '1'"
              src="@/assets/image/realTimeInformation/circleRed.png"
              alt=""
            />
            <img
              class="point"
              v-else-if="item.camp == '2'"
              src="@/assets/image/realTimeInformation/circleBlue.png"
              alt=""
            />
            <img
              class="point"
              v-else
              src="@/assets/image/realTimeInformation/circleGreen.png"
              alt=""
            />
          </div>

          <!-- camp  0白 1红 2蓝 3系统  -->
        </div>
        <div class="log-side">
          <div class="log-item">
            <span class="time" v-if="item.sendTime">
              {{ item.sendTime }}
            </span>
            <!-- <span>{{ item.msg }}</span> -->
            <!-- 判断 如果是合并的多条数据 -->
            <div class="msg">
              <div v-if="item.more" class="more-msg">
                <div
                  :style="{ color: item.color }"
                  v-for="(e, eindex) in item.msg"
                  :key="eindex"
                >
                  <span>
                    <img
                      class="point"
                      v-if="item.camp == '0'"
                      src="@/assets/image/realTimeInformation/circleWhite.png"
                      alt=""
                    />
                    <img
                      class="point"
                      v-else-if="item.camp == '1'"
                      src="@/assets/image/realTimeInformation/circleRed.png"
                      alt=""
                    />
                    <img
                      class="point"
                      v-else-if="item.camp == '2'"
                      src="@/assets/image/realTimeInformation/circleBlue.png"
                      alt=""
                    />
                    <img
                      class="point"
                      v-else
                      src="@/assets/image/realTimeInformation/circleGreen.png"
                      alt=""
                    />
                  </span>
                  <span
                    class="text-content"
                    v-for="(citem, cindex) in e.msg.split('${')"
                    :key="cindex"
                  >
                    <span v-if="citem.indexOf('}') == -1" style="text">
                      {{ citem }}
                    </span>
                    <span
                      v-else
                      v-for="(ccitem, ccindex) in citem.split('}')"
                      :key="ccindex"
                      :class="ccindex == 0 ? 'underLine pointer-cursor' : ''"
                      @click="showDia(ccitem, ccindex, e)"
                    >
                      {{ ccitem }}
                    </span>
                  </span>
                </div>
              </div>
              <span v-else :style="{ color: item.color }">
                <span
                  class="text-content"
                  v-for="(citem, cindex) in item.msg.split('${')"
                  :key="cindex"
                >
                  <span v-if="citem.indexOf('}') == -1" style="text">
                    {{ citem }}
                  </span>
                  <span
                    v-else
                    v-for="(ccitem, ccindex) in citem.split('}')"
                    :key="ccindex"
                    :class="ccindex == 0 ? 'underLine pointer-cursor' : ''"
                    @click="showDia(ccitem, ccindex, item)"
                  >
                    {{ ccitem }}
                  </span>
                </span>
              </span>
            </div>
            <!-- 三角样式 -->
            <div class="log-triangle"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch } from 'vue'
import store from '@/store'
import emitter from '@/utils/eventbus'
const state = reactive({
  logList: [] //打印消息list
})
emitter.on('Task_Aign', (msg) => {
  let newValue = msg.Data
  console.log('日志', store.state.sceneModule.czmlEventSourceData)
  let czmlEventSourceData = {
    color: '',
    msg: '',
    camp: ''
  }
  let message = configTaskMessage(newValue)
  czmlEventSourceData.msg = message
  czmlEventSourceData.camp = newValue.sSide == '2'
  czmlEventSourceData.color = newValue.sSide == '#8df6f3'
  // if (newValue.sSide) {
  //   czmlEventSourceData.camp = newValue.sSide == 'blue' ? '2' : '1'
  //   czmlEventSourceData.color = newValue.sSide == 'blue' ? '#8df6f3' : '#df5a51'
  // }
  if (czmlEventSourceData.msg) {
    state.logList.unshift(czmlEventSourceData)
  }
  if (state.logList.length > 100) {
    state.logList.pop()
  }
  // 日志置顶
  document.getElementById('log_con').scrollTop = 0
})
const configTaskMessage = (data) => {
  let message = ''
  switch (data.Type) {
    case 'ENGAGE':
      message = `${data.SName}向${data.RName}下达任务指令，任务目标${data.TName}`
      break
    case 'Track':
      message = `${data.SName}向${data.RName}下达追踪指令，追踪目标${data.TName}`
      break
    case 'Shoot':
      message = `${data.RName}针对敌方目标：${data.TName}下达打击指令，打击目标${data.TName}`
      break
    case 'CLUSTER':
      message = `发现目标${data.TName},${data.RName}针对敌方目标：${data.TName}下达集合指令`
      break

    default:
      break
  }
  return message
}
</script>

<style lang="less" scoped>
#ss_message {
  position: relative;
  width: 100%;
  height: 80%;
  // background: rgba(2, 26, 70, 0.88);
  // box-shadow: 0 0 25px #1092d5;
  color: #fff;

  .collapse-interaction {
    width: 100%;
    height: 100%;
    overflow-y: auto;
    // padding: 10px 16px;
    font-size: 14px;
    transition: all 0.3s;

    .single-log {
      display: flex;
      font-size: 15px;
      // justify-content: space-between;
      flex-wrap: nowrap;
      // align-items: center;
      align-items: stretch; //左右高度一致

      // height: 100px;//高度自适应
      .left-point {
        // height: 100%;
        display: flex;
        // align-items: center;
        margin-left: 10px;
        width: 10%;

        // flex-direction: column;
        .line {
          height: 100%;
          width: 1px;
          margin-top: 30px;
          // height: calc(100% + 20px);
          background-color: #38e1ff;
        }

        //最开始一条的特殊css
        .line-first {
          height: 0;
        }

        .point {
          width: 20px;
          height: 20px;
          position: relative;
          right: 10px;
          top: 20px;
          // transform: translate(0px, 30px);
        }
      }

      .log-side {
        height: 100%;
        width: 80%;
        padding: 10px 0;
      }

      .log-item {
        position: relative;
        padding-top: 10px;
        display: flex;
        flex-direction: column;
        font-size: 15px;
        // justify-content: space-between;
        flex-wrap: nowrap;
        // margin-bottom: 14px;
        align-items: start;
        // box-shadow: 0 0 10px 2px #29baf1;
        border: 1px solid #38e1ff;
        // background-color: #0a254f;
        text-shadow: 1px 2px 2px mediumblue;
        padding: 10px;

        background: rgba(0, 29, 66, 0.9);
        box-shadow: inset 0px 0px 10px 1px rgba(50, 194, 255, 0.38);
        border-radius: 2px;

        .time {
          font-family: MicrosoftYaHeiSemibold;
          font-size: 14px;
          color: #ffffff;
          line-height: 17px;
          text-shadow: 0 0 5px #5fcaff;
          font-weight: 600;
        }

        .msg {
          font-family: PingFangSC-Regular;
          font-size: 14px;
          font-weight: 400;
          text-align: left;
        }

        .point {
          width: 10px;
          margin-right: 8px;
        }

        .text-content {
          // margin-left: 10px;
          // text-wrap:nowrap;
          span {
            // text-wrap:nowrap;
            flex-shrink: 0;
          }
        }

        .log-triangle {
          position: absolute;
          right: 0;
          bottom: 0;
          opacity: 0.6;
          border-width: 0 12px 12px 0;
          border-style: solid;
          border-color: transparent #00fde6;
          transform: rotate(90deg);
        }
      }
    }

    // .log-item::after {
    //   content: '';
    //   display: block;
    //   /* width: 8px; */
    //   // border-top: 10px solid transparent;
    //   border-right: 7px solid #0173dd;
    //   // border-bottom: 10px solid transparent;
    //   /* border-right: 10px solid red; */
    //   height: 100%;
    //   width: 2px;
    //   position: absolute;
    //   right: 0px;
    //   top: 67%;
    // }

    :deep(.el-collapse) {
      --el-collapse-border-color: transparent;
      --el-collapse-header-height: 40px;
      --el-collapse-header-bg-color: var(--el-color-white);
      --el-collapse-header-text-color: var(--el-text-color-primary);
      --el-collapse-header-font-size: 14px;
      --el-collapse-content-bg-color: transparent !important;
      --el-collapse-content-font-size: 14px;
      --el-collapse-content-text-color: var(--el-text-color-primary);
      border-top: 1px solid transparent;
      border-bottom: 1px solid transparent;
    }

    .collapse-title {
      flex: 1 0 90%;
      order: 1;
    }

    :deep(.el-collapse-item__header) {
      padding-left: 10px;
      box-sizing: border-box;
      background: transparent;
      border: 1px solid rgba(99, 237, 255, 0.1);
      color: #98dcff;
    }

    :deep(.el-icon svg) {
      color: #63edff;
    }

    .detail-style {
      width: 100%;
      color: #98dcff;
      padding: 10px 10px 10px 20px;
      box-sizing: border-box;
    }

    :deep(.el-collapse-item__content) {
      padding: 0 !important;
    }
  }

  .collapse-interaction::-webkit-scrollbar {
    display: none;
  }
}
</style>
