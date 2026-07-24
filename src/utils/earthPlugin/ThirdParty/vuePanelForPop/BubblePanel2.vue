<template>
  <div :id="id" class="box">
    <!-- <div class="pine" :style="`border-bottom: 1px solid ${netColor};`"></div> -->
    <div
      class="box-wrap1"
      :style="`
      color: ${fontColorRgb})`"
    >
      <div class="close" v-if="isCloseClick" @click="closeClick">x</div>
      <div class="content">
        <div class="area-title fontColor text-stroke">{{ title }}</div>
        <div
          class="data-li textColor"
          v-for="(item, index) in currentContent.content"
          :key="index"
        >
          <div class="data-value">
            <label class="labelName text-stroke">{{ item.name }}</label
            ><span class="label-num yellowColor text-stroke">
              {{ item.value }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { reactive, onUnmounted, onMounted, getCurrentInstance, ref } from 'vue'
import store from '@/store/index'
export default {
  props: {
    title: {
      type: String,
      default: '标题'
    },
    id: {
      type: String,
      default: '001'
    },
    position: {
      type: String,
      default: '001'
    },
    content: {
      type: Array,
      default: '001'
    },
    rgb: {
      type: Array,
      default: [255, 255, 255]
    },
    fontColorRgb: {
      type: Array,
      default: [255, 255, 255]
    },
    isCloseClick: {
      type: Boolean,
      default: false
    }
  },
  setup(props) {
    let currentContent = reactive({})
    let id = ref(props.id.value)
    let title = ref(props.title.value)
    let netColor = ref(
      `rgb(${props.rgb.value[0]},${props.rgb.value[1]},${props.rgb.value[2]}`
    )
    let netColorRgba = ref(
      `rgb(${props.rgb.value[0]},${props.rgb.value[1]},${props.rgb.value[2]},0.1)`
    )
    let fontColorRgb = ref(
      `rgb(${props.fontColorRgb.value[0]},${props.fontColorRgb.value[1]},${props.fontColorRgb.value[2]}`
    )
    currentContent.content = props.content
    let isCloseClick = props.isCloseClick
    // currentInstance.value = getCurrentInstance()
    const closeClick = () => {
      if (window['curDivPoint' + props.id.value]) {
        window['curDivPoint' + props.id.value].closeEvent()
      }
    }
    return {
      closeClick,
      netColor,
      netColorRgba,
      fontColorRgb,
      currentContent,
      id,
      title,
      isCloseClick
    }
  }
}
</script>

<style lang="less" scoped>
.box {
  width: 300px;
  position: relative;
  bottom: 0;
  left: 0;
}

.close {
  position: absolute;
  color: #fff;
  top: 1px;
  right: 10px;
  text-shadow: 2px 2px 2px #022122;
  cursor: pointer;
  animation: fontColor 1s;
}

.box-wrap1 {
  position: absolute;
  /* left: 2%;
  bottom: -190px; */
  // left: 21.5%;
  // bottom: -139px;
  max-width: 280px;
  border-radius: 5px 0 5px 0;
  border: 1px solid v-bind(netColor);
  background-color: v-bind(netColorRgba);
  // box-shadow: 0 0 10px 2px v-bind(netColor);
  animation: slide 2s;
}

.box-wrap1 .area {
  position: absolute;
  top: 2px;
  right: 2.5%;
  width: 95%;
  height: 30px;
  /* background-image: linear-gradient(to left, #4cdef9, #4cdef96b); */
  /* border-radius: 30px 0 0 0; */
  animation: area 1s;
}

.pine {
  position: absolute;
  width: 37px;
  height: 107px;
  box-sizing: border-box;
  line-height: 120px;
  text-indent: 5px;
}

.pine::before {
  content: '';
  position: absolute;
  left: -7px;
  bottom: -87px;
  /* width: 40%; */
  width: 220%;
  height: 60px;
  box-sizing: border-box;
  /* border-bottom: 1px solid #38e1ff; */
  border-bottom: 1px solid v-bind(netColor);
  transform-origin: bottom center;
  /* transform: rotateZ(135deg) scale(1.5); */
  transform: rotateZ(120deg) scale(1.5);
  animation: slash 0.5s;
  filter: drop-shadow(1px 0px 2px v-bind(netColor));
}

.area-title {
  text-align: left;
  line-height: 25px;
  border-bottom: 1px dashed #fff;
  /* color: #f09e28; */
  /* color: #29baf1; */
}

.textColor {
  font-size: 14px;
  font-weight: 600;
  /* color: #ffffff; */
  // text-shadow: 1px 1px 5px v-bind(netColor);
  animation: fontColor 0.2s;
  line-height: 21px;
}

.yellowColor {
  font-size: 14px;
  font-weight: 600;
  /* color: #29baf1; */
  padding-left: 10px;
  // text-shadow: 1px 1px 5px #002520d2;
  animation: fontColor 0.2s;
}

.fontColor {
  font-size: 16px;
  font-weight: 600;
  /* color: #ffffff; */
  // text-shadow: 1px 1px 5px v-bind(netColor);
  animation: fontColor 0.2s;
}

.content {
  padding: 10px 10px 10px 10px;
  /* height: 345px; */
  overflow-y: auto;
  margin-top: 5px;
  width: 200px;
  min-width: 200px;
}

.content .data-li {
  display: flex;
}

.content .data-li .labelName {
  width: 50px;
  text-align: left;
  display: inline-block;
  vertical-align: top;
}

.content .data-li .label-num {
  display: inline-block;
  width: 137px;
  text-align: left;
}

@keyframes fontColor {
  0% {
    color: #ffffff00;
    text-shadow: 1px 1px 5px #00252000;
  }

  40% {
    color: #ffffff00;
    text-shadow: 1px 1px 5px #00252000;
  }

  100% {
    color: #ffffff00;
    text-shadow: 1px 1px 5px v-bind(netColorRgba);
  }
}

@keyframes slide {
  0% {
    border: 1px solid #38e1ff00;
    background-color: #38e1ff00;
    // box-shadow: 0 0 10px 2px #29baf100;
  }

  100% {
    border: 1px solid v-bind(netColor);
    background-color: v-bind(netColorRgba);
    // box-shadow: 0 0 10px 2px v-bind(netColor);
  }
}

@keyframes area {
  0% {
    width: 0%;
  }

  25% {
    width: 0%;
  }

  100% {
    width: 95%;
  }
}

@keyframes slash {
  0% {
    transform: rotateZ(135deg) scale(0);
  }

  100% {
    transform: rotateZ(135deg) scale(1.5);
  }
}

.text-stroke {
  text-shadow: -1px 0 0 #fff, 1px 0 0 #fff, 0 -1px 0 #fff, 0 1px 0 #fff;
}
</style>
