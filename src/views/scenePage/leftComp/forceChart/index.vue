<template>
  <div class="leftForceChart">
    <Transition
      name="custom-classes"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <img
        v-show="!state.leftShow"
        class="left-shrink"
        :src="
          state.leftShow
            ? require('@/assets/image/panelIcons/telescoping.png')
            : require('@/assets/image/panelIcons/telescoping_1.png')
        "
        @click="leftContentShow"
      />
    </Transition>
    <Transition
      name="custom-classes"
      enter-active-class="animate__animated animate__backInLeft"
      leave-active-class="animate__animated animate__backOutLeft"
    >
      <div class="log-info" v-show="state.leftShow">
        <div class="log-content">
          <img
            class="content-img"
            :src="
              state.leftShow
                ? require('@/assets/image/panelIcons/telescoping.png')
                : require('@/assets/image/panelIcons/telescoping_1.png')
            "
            @click="leftContentShow"
          />
          <div class="content-main">
            <div
              class="pie-think-info"
              v-if="state.side != 'red'"
              :style="`height:${state.side == 'admin' ? '50%' : '100%'}`"
            >
              <div class="blue-container">
                <div class="formulate-title">
                  <span style="color: #3c94d9">蓝方兵力</span>
                  <div class="total-static">
                    <div class="xc-static">
                      <label for="现存">现存:</label
                      ><span>{{ store.state.sceneModule.blueStatic.xc }}</span>
                    </div>
                    <div class="hs-static">
                      <label for="毁伤">毁伤:</label
                      ><span>{{ store.state.sceneModule.blueStatic.hs }}</span>
                    </div>
                  </div>
                </div>

                <div class="situation-content">
                  <blueForce></blueForce>
                </div>
              </div>
            </div>

            <div
              class="pie-think-info"
              v-if="state.side != 'blue'"
              :style="`height:${state.side == 'admin' ? '50%' : '100%'}`"
            >
              <div class="red-container">
                <div class="formulate-title">
                  <span style="color: #eb1e17">红方兵力</span>
                  <div class="total-static">
                    <div class="xc-static">
                      <label for="现存">现存:</label
                      ><span>{{ store.state.sceneModule.redStatic.xc }}</span>
                    </div>
                    <div class="hs-static">
                      <label for="毁伤">毁伤:</label
                      ><span>{{ store.state.sceneModule.redStatic.hs }}</span>
                    </div>
                  </div>
                </div>
                <div class="situation-content">
                  <redForce></redForce>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { toRefs, reactive, watch, onMounted, ref, version } from 'vue'
import emitter from '@/utils/eventbus'
import blueForce from '@/components/content/blueForce/blueForce'
import redForce from '@/components/content/redForce/redForce'
import * as echarts from 'echarts'
import { useStore } from 'vuex'
import {
  getEquipmentCountByRedis,
  getEquipmentCountByRedisReplay
} from '@/service/replayTime'
// import { worldPosToGraphic } from '@/utils/mapTools'
const store = useStore()
onMounted(() => {
  window.emitter = emitter
  // 时间轴显示隐藏
  emitter.on('changeTimeLineState', (val) => {
    state.legendShow = val
  })
  emitter.on('isShowMuBiaoInfor', (val) => {
    state.showMuBiaoPointInfo = val
  })
  //统计兵力数据
  if (store.state.sceneModule.isReplayType) {
    getEquipmentCountByRedisReplay().then((res) => {
      if (res.code == 200) {
        store.commit('setRedStatic', {
          xc: res.data.redData.redCount,
          hs: res.data.redData.redCountOff
        })
        store.commit('setBlueStatic', {
          xc: res.data.blueData.blueCount,
          hs: res.data.blueData.blueCountOff
        })
      }
    })
  } else {
    getEquipmentCountByRedis().then((res) => {
      if (res.code == 200) {
        store.commit('setRedStatic', {
          xc: res.data.redData.redCount,
          hs: res.data.redData.redCountOff
        })
        store.commit('setBlueStatic', {
          xc: res.data.blueData.blueCount,
          hs: res.data.blueData.blueCountOff
        })
      }
    })
  }
})

const state = reactive({
  leftShow: true, // 左侧显隐
  legendShow: false, //时间轴显隐
  showMuBiaoPointInfo: false, //目标点位信息框
  side: window.localStorage.getItem('side')
})

const leftContentShow = () => {
  state.leftShow = !state.leftShow
}
</script>

<style lang="less" scoped>
@font-face {
  font-family: 'MFLiHei_Noncommercial-Regular';
  src: url('@/assets/iconfont/MFLiHei_Noncommercial-Regular-2.otf')
    format('opentype');
}

.leftForceChart {
  position: absolute;
  // top: 80px;
  top: 15%;
  left: 0%;
  height: 88vh;
  z-index: 1;
  .left-shrink {
    position: absolute;
    top: calc(50% - 31.5px);
    left: 0;
    // transform: translate(0, -50%);
    z-index: 2;
    cursor: pointer;
    width: 20px;
    font-size: 36px !important;
  }

  .log-info {
    text-align: left;
    height: 100%;
    // width: 18vw;
    background-size: 100% 100%;

    z-index: 2;
    display: flex;
    // flex-direction: row-reverse;
    align-items: center;
    color: #fff;
    // margin-top: -10px;

    background-image: url('~@/assets/image/panelIcons/装饰.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .left-shrink {
      position: absolute;
      //  right: 0;
      // top: -10px;
      // right: -2%;
      // top: 47%;
      z-index: 2;
      cursor: pointer;
      font-size: 36px !important;
    }

    .log-content {
      // overflow-y: auto;
      width: 17vw;
      // margin-left: 15px;
      height: inherit;

      // width: 98.8%;
      height: 99%;
      background: rgba(2, 26, 70, 0.88);
      box-shadow: 0 0 25px #1092d5;

      // background: url('@/assets/newUI/日志.png');
      // background-size: 100% 100%;
      .content-img {
        position: absolute;
        //  right: 0;
        // top: -10px;
        right: -6%;
        top: calc(50% - 31.5px);
        z-index: 2;
        cursor: pointer;
        font-size: 36px !important;
      }

      .content-main {
        overflow-y: auto;
        width: 100%;
        // margin-left: 15px;
        height: 100%;

        .pie-think-info {
          position: relative;
          width: 100%;
          // height: 50%;
          // background: url(../../../src/assets/image/thinkInfo.png);
          background-size: 100% 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          // color: @main-font-color;

          // padding-top: 10px;

          .blue-container {
            width: 93%;
            height: 95%;
            border: 1px solid #2671ac66;

            .formulate-title {
              display: flex;
              align-items: center;
              padding: 10px;
              box-sizing: border-box;
              text-align: left;
              // font-size: 18px;
              font-family: MFLiHei_Noncommercial-Regular;
              font-size: 20px;
              color: #ffffff;
              letter-spacing: 1.82px;
              font-weight: 400;
            }
            .situation-content {
              width: auto;
              height: calc(100% - 42px);
              display: flex;
              align-content: center;
              align-items: center;
              justify-content: center;
              flex-wrap: wrap;
              // margin-left: 15px;
              box-sizing: border-box;
              margin: 0 auto;
            }
          }

          .red-container {
            width: 93%;
            height: 95%;
            border: 1px solid #f537304a;

            .formulate-title {
              display: flex;
              align-items: center;
              padding: 10px;
              box-sizing: border-box;
              text-align: left;
              // font-size: 18px;
              font-family: MFLiHei_Noncommercial-Regular;
              font-size: 20px;
              color: #ffffff;
              letter-spacing: 1.82px;
              font-weight: 400;
            }

            .situation-content {
              width: auto;
              height: calc(100% - 42px);
              display: flex;
              align-content: center;
              align-items: center;
              justify-content: center;
              flex-wrap: wrap;
              // margin-left: 15px;
              box-sizing: border-box;
              margin: 0 auto;
            }
          }
        }
      }
    }
  }
  .total-static {
    text-align: center;
    .xc-static {
      margin-left: 20px;
      display: inline-block;
      margin-right: 20px;
      label {
        font-weight: normal;
        font-size: 16px;
      }
      span {
        font-size: 15px;
        vertical-align: baseline;
        color: yellow;
      }
    }
    .hs-static {
      display: inline-block;
      label {
        font-weight: normal;
        font-size: 16px;
      }
      span {
        font-size: 15px;
        vertical-align: baseline;
        color: gray;
      }
    }
  }
}
</style>
