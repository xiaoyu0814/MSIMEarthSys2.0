<template>
  <div
    :id="id.value"
    class="box-container prompt-content-container"
    style="display: flex"
  >
    <div class="prompt-close" @click="closeClick">x</div>
    <div>
      <div class="title title-next">
        {{ title.value }}
      </div>
      <div class="prompt-content">
        <div
          class="data-li"
          v-for="(item, index) in content.value"
          :key="index"
        >
          <!-- <div class="data-label labelStyle">{{ item }}:</div> -->
          <div class="data-label labelStyle">{{ item.name }}:</div>
          <div class="data-value">
            <span class="text-value"> {{ item.value }} </span>
          </div>
        </div>
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
    content: {
      type: Array,
      default: []
    }
  },
  setup(props) {
    const closeClick = () => {
      if (window['curDivPoint' + props.id]) {
        window['curDivPoint' + props.id].closeEvent()
      }
    }

    onMounted(() => {})
    return {
      closeClick
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
  cursor: pointer;
  position: absolute;
  top: -13px;
  right: 0;
  padding: 4px 4px 0 0;
  border: none;
  text-align: center;
  width: 13px;
  height: 11px;
  font: 15px Tahoma, Verdana, sans-serif;
  color: #c3c3c3;
  text-decoration: none;
  font-weight: bold;
  background: transparent;
}

.prompt-content-container {
  display: block;
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

    .data-li {
      .data-label {
        display: inline-block;
        margin-right: 10px;
        width: 40px;
        text-align: right;
      }

      .data-value {
        display: inline-block;
        width: 90px;
        text-align: left;

        .text-value {
          color: #fff;
        }
      }
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
  /*border: 0.5px dashed; */
  color: yellow;
  font-size: 16px;
  border-radius: 6px;
  background: none;
  border: none;
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
