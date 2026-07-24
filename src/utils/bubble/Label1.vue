<template>
  <div
    :id="id.value"
    class="box-container prompt-content-container"
    style="display: flex"
  >
    <div class="prompt-close" @click="closeClick">X</div>
    <div>
      <div class="title" :class="sateliteStyle ? 'title-next' : ''">
        {{ title.value }}
      </div>
      <div class="prompt-content">
        <ul style="margin-right: 16px">
          <li>
            <label>经度：</label><span> {{ lng.value }} </span>
          </li>
          <li>
            <label>纬度：</label><span> {{ lat.value }} </span>
          </li>
          <li>
            <label>高度：</label><span> {{ height.value }} </span>
          </li>
          <!-- <li>
            <label>航向角：</label><span>{{ heading.value }}</span>
          </li>
          <li>
            <label>俯仰角：</label><span>{{ pitch.value }}</span>
          </li>
          <li v-show="isShow">
            <label>翻滚角：</label><span>{{ roll.value }}</span>
          </li> -->
        </ul>
      </div>
    </div>
  </div>
</template>

<script>
import {
  reactive,
  onUnmounted,
  onMounted,
  getCurrentInstance,
  ref,
  watch
} from 'vue'
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
    lng: {
      type: String,
      default: ''
    },
    lat: {
      type: String,
      default: ''
    },
    height: {
      type: String,
      default: ''
    },
    speed: {
      type: String,
      default: ''
    },
    forward: {
      type: String,
      default: ''
    },
    heading: {
      type: String,
      default: ''
    },
    pitch: {
      type: String,
      default: ''
    },
    roll: {
      type: String,
      default: ''
    },
    content: {
      type: String,
      default: ''
    }
  },
  setup(props) {
    const isShow = ref(false)
    const sateliteStyle = ref(false)
    const currentInstance = ref([])

    const closeClick = () => {
      if (window['curDivPointTrajectory' + props.id.value]) {
        window['curDivPointTrajectory' + props.id.value].closeEvent()
      }
    }

    onMounted(() => {
      // console.log(props,'子组件接收');
    })

    return {
      closeClick,
      currentInstance,
      isShow,
      sateliteStyle
    }
  }
}
</script>

<style lang="less" scoped>
.easy3d-prompt {
  position: absolute;
  top: -9999px;
  left: -9999px;
  opacity: 0;
  /* 设置元素初始透明度为 0*/
  animation: fade-in 1s ease-out forwards;
  /* 使用动画使元素逐渐显示 */
}

@keyframes fade-in {
  to {
    opacity: 1;
    /* 动画结束时元素完全显示 */
  }
}

.prompt-close {
  position: absolute;
  top: 0;
  right: 0;
  padding: 4px 4px 0 0;
  border: none;
  text-align: center;
  width: 13px;
  height: 11px;
  font: 14px Tahoma, Verdana, sans-serif;
  color: #ede6e6;
  text-decoration: none;
  font-weight: bold;
  background: transparent;
  cursor: pointer;
}

.prompt-content-container {
  /* 不给padding撑不开div */
  max-width: 500px;
  border-radius: 4px;
  padding: 1px;
  /* background: white; */
  color: #333;
  box-shadow: 0 0 10px 2px #29baf1;
  border: 1px solid #38e1ff;
  background-color: #38e1ff3d;
  text-shadow: 1px 2px 2px mediumblue;

  /* animation: Containerblink 2s linear infinite; */
  .prompt-content {
    margin: 3px 4px;
    font: 14px Tahoma, Verdana, sans-serif;

    /* animation: blink 2s linear infinite; */
    ul li {
      color: #fff;
      text-align: left;
    }

    .intelligentDeal li {
      margin-top: 8px;
    }

    .guidance-type {
      label,
      span {
        color: yellow;
        font-size: 18px;
      }
    }

    .redColor {
      color: red !important;
    }
  }

  .title {
    color: lawngreen;
    text-align: left;
    font-size: 16px;
    display: contents;
  }

  .title-next {
    color: yellow;
    text-align: left;
    font-size: 14px;
  }
}

.labelStyle {
  color: yellow;
}

@keyframes blink {
  0% {
    /* opacity: 1; */
    color: aqua;
  }

  50% {
    /* opacity: 0.5; */
    color: white;
  }

  100% {
    /* opacity: 0.8; */
    color: greenyellow;
  }
}

@keyframes Containerblink {
  0% {
    /* opacity: 1; */
    border: 1px solid #38e1ff;
    box-shadow: 0 0 10px 2px #38e1ff;
  }

  50% {
    /* opacity: 0.5; */
    border: 1px solid white;
    box-shadow: 0 0 10px 2px white;
  }

  100% {
    /* opacity: 0.8; */
    border: 1px solid greenyellow;
    box-shadow: 0 0 10px 2px greenyellow;
  }
}

.prompt-anchor-container {
  position: absolute;
  width: 40px;

  height: 20px;
  left: 50%;
  margin-left: -20px;
  overflow: hidden;
  pointer-events: none;
}

.prompt-anchor {
  margin: -10px auto 0;
  background: aqua;
  width: 17px;
  height: 17px;
  -webkit-transform: rotate(45deg);
  transform: rotate(45deg);
}

.buttonClass {
  /* background-color: beige; */
  border: 0.5px dashed;
  color: yellow;
  font-size: 16px;
  border-radius: 6px;
  background: none;
}

.futureButton {
  border: 0.5px dashed;
  color: yellow;
  font-size: 14px;
  border-radius: 4px;
  background: none;
  padding: 0 5px;
  text-align: center;
}
</style>
