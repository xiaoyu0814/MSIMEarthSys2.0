<!--
 * @description: 
 * @Version: 1.0
 * @Author: dingxuanyu
 * @Date: 2024-10-25 13:54:23
 * @LastEditors: dingxuanyu
 * @LastEditTime: 2024-10-25 17:56:46
-->
<template>
  <div class="speed-details" v-show="show" style="transforms: rotateZ(0deg)">
    <div class="details-content">
      <span class="spanStyle">速度:{{ statelMsg.infors.speed }} km/h</span>
    </div>
  </div>
  <div class="height-details" v-show="show" style="transforms: rotateZ(0deg)">
    <div class="details-content">
      <span class="spanStyle">高度:{{ statelMsg.infors.height }} m</span>
    </div>
  </div>
  <div class="name-details" v-show="show" style="transforms: rotateZ(0deg)">
    <div class="details-content" @click="showInfo">
      <span class="spanStyle">名称:{{ statelMsg1.infors1.name }}</span>
    </div>
  </div>
  <div class="weapons-details" v-show="show" style="transforms: rotateZ(0deg)">
    <div class="details-content">
      <span class="spanStyle">x6 {{ statelMsg.infors.weapons }}</span>
      <img class="imgStyle" src="" alt="" />
    </div>
  </div>
  <div class="oil-details" v-show="show" style="transforms: rotateZ(0deg)">
    <div class="details-content">
      <span class="spanStyle">x6 {{ statelMsg.infors.oil }}</span>
      <img class="imgStyle" src="" alt="" />
    </div>
  </div>
  <div class="sensor-details" v-show="show" style="transforms: rotateZ(0deg)">
    <div class="details-content">
      <span class="spanStyle">x6 {{ statelMsg.infors.sensor }}</span>
      <img class="imgStyle" src="" alt="" />
    </div>
  </div>
  <div class="up-details" v-show="show" style="transforms: rotateZ(0deg)">
    <div class="up-content">
      <span class="spanUpStyle">上</span>
    </div>
  </div>
  <div class="down-details" v-show="show" style="transforms: rotateZ(0deg)">
    <div class="down-content">
      <span class="spanDownStyle">下</span>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  readonly,
  computed,
  onMounted,
  watch,
  toRefs
} from 'vue'
import store from '@/store/index'
import gsap from 'gsap'
// import getWeapons from '@/views/toolbar/layerList/hooks/guideCommand.js'

const state = reactive({
  isShowviewContextMenu: {
    show: false
  } // 快捷菜单弹窗
})

// 计算属性
const show = computed(() => {
  return store.state.sceneModule.showThirdDiv
})
let statelMsg = reactive({
  infors: {
    speed: '2400',
    height: '1600.123000',
    pitch: '正常运行中',
    oil: '',
    weapons: ''
  }
})
let statelMsg1 = reactive({
  infors1: {
    name: '正常运行中'
  }
})
function closeDiv() {
  show.value = false
}
let obj = {
  x: '500px',
  y: '300px',
  show: false
}
function showInfo(event) {
  var e = event || window.event
  // let distanceX = 120;
  let distanceY = 490
  // obj.x = e.screenX - distanceX;
  obj.y = e.screenY + distanceY
  if (!obj.show) {
    obj.show = true
    emitter.emit('showViewContextMenu', obj)
  } else {
    obj.show = false
    emitter.emit('closeViewContextMenu', obj)
  }
}
watch(
  () => store.state.sceneModule.showThirdDiv,
  (newValue, oldValue) => {
    var tl1
    var tl2
    var tl3
    var nameTeewn
    var upDownTween
    tl1 = gsap.timeline()
    tl2 = gsap.timeline()
    tl3 = gsap.timeline()
    upDownTween = gsap.timeline()
    nameTeewn = gsap.timeline()
    tl1.fromTo(
      '.speed-details',
      {
        x: 0,
        opacity: 0
      },
      {
        x: '10vw',
        opacity: 1,
        ease: 'strong.inOut',
        duration: 3
      }
    )
    tl2.fromTo(
      '.height-details',
      {
        x: 0,
        opacity: 0
      },
      {
        x: '-10vw',
        opacity: 1,
        ease: 'strong.inOut',
        duration: 3
      }
    )
    tl3.fromTo(
      ['.oil-details', '.weapons-details', '.sensor-details'],
      {
        x: 0,
        opacity: 0
      },
      {
        x: '-10vw',
        opacity: 1,
        ease: 'strong.inOut',
        duration: 3
      }
    )
    nameTeewn.fromTo(
      '.name-details',
      {
        opacity: 0
      },
      {
        opacity: 1,
        ease: 'strong.inOut',
        duration: 3
      }
    )
    upDownTween.fromTo(
      ['.up-details', '.down-details'],
      {
        x: 0,
        opacity: 0
      },
      {
        x: '12vw',
        opacity: 1,
        ease: 'strong.inOut',
        duration: 3
      }
    )
  }
)

watch(
  () => store.state.sceneModule.thirdInfors,
  (newValue, oldValue) => {
    statelMsg.infors = {
      height: newValue.height,
      pitch: newValue.pitch,
      speed: newValue.speed
    }
    statelMsg.infors.height = parseFloat(statelMsg.infors.height).toFixed(3)
    statelMsg.infors.speed = parseFloat(statelMsg.infors.speed).toFixed(3)
    var tl4
    var tl5
    tl4 = gsap.timeline()
    tl5 = gsap.timeline()
    // 判断俯仰角
    if (newValue.pitch > 0) {
      tl4.to('.spanUpStyle', {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: '30px'
      })
      tl5.to('.spanDownStyle', {
        color: 'white',
        fontSize: '18px'
      })
    } else {
      tl4.to('.spanUpStyle', {
        color: 'white',
        fontSize: '18px'
      })
      tl5.to('.spanDownStyle', {
        color: 'blue',
        fontWeight: 'bold',
        fontSize: '30px'
      })
    }
  }
)

watch(
  () => store.state.sceneModule.currentFlyType,
  (newValue, oldValue) => {
    // let data = getWeapons();
    // console.log('---------------')
    // console.log(data)
    // console.log('---------------')
    statelMsg1.infors1 = {
      name: newValue.name
    }
  }
)
</script>

<style lang="less" scoped>
.speed-details {
  display: flex;
  width: 14%;
  height: 2%;
  background: url('@/assets/image/voiceInteraction/info.png');
  padding: 35px 18px;
  background-size: 100% 100%;
  position: absolute;
  top: 20%;
  left: 5%;
  transform: translate(-50%, -50%);
  .details-content {
    color: white;
    text-align: left;
    font-size: 14px;
    padding: 0 13px;
    height: 100%;
    width: 100%;
    position: relative;

    .spanStyle {
      font-size: 18px;
      left: 5px;
      color: rgb(255, 255, 255);
    }
  }
}
.height-details {
  display: flex;
  width: 14%;
  height: 2%;
  background: url('@/assets/image/voiceInteraction/info.png');
  padding: 40px 18px;
  background-size: 100% 100%;
  position: absolute;
  top: 28%;
  left: 25%;
  transform: translate(-50%, -50%);
  .details-content {
    color: white;
    text-align: left;
    font-size: 14px;
    padding: 0 13px;
    height: 100%;
    width: 100%;
    position: relative;

    .spanStyle {
      font-size: 18px;
      left: 5px;
      color: rgb(255, 255, 255);
    }
  }
}
.name-details {
  cursor: pointer;
  width: 20%;
  height: 2%;
  // background: url('@/assets/image/voiceInteraction/info.png');
  padding: 40px 20px;
  background-size: 100% 100%;
  position: absolute;
  top: 15%;
  right: -8%;
  transform: translate(-50%, -50%);
  .details-content {
    color: white;
    position: relative;

    .spanStyle {
      font-size: 18px;
      left: 5px;
      color: rgb(255, 255, 255);
    }
  }
}
.weapons-details {
  width: 8%;
  height: 10%;
  background: url('@/assets/image/voiceInteraction/info.png');
  padding: 40px 20px;
  background-size: 100% 100%;
  position: absolute;
  top: 40%;
  right: 8%;
  transform: translate(-50%, -50%);
  .details-content {
    width: 100%;
    color: white;
    position: relative;
    .spanStyle {
      font-size: 18px;
      color: rgb(255, 255, 255);
      position: relative;
      top: 60px;
    }
    .imgStyle {
      width: 50%;
      height: 80%;
      background-color: rgb(255, 255, 255);
    }
  }
}
.oil-details {
  width: 8%;
  height: 10%;
  background: url('@/assets/image/voiceInteraction/info.png');
  padding: 40px 20px;
  background-size: 100% 100%;
  position: absolute;
  top: 53%;
  right: 8%;
  transform: translate(-50%, -50%);
  .details-content {
    width: 100%;
    color: white;
    position: relative;
    .spanStyle {
      font-size: 18px;
      color: rgb(255, 255, 255);
      position: relative;
      top: 60px;
    }
    .imgStyle {
      width: 50%;
      height: 80%;
      background-color: rgb(255, 255, 255);
    }
  }
}

.sensor-details {
  width: 8%;
  height: 10%;
  background: url('@/assets/image/voiceInteraction/info.png');
  padding: 40px 20px;
  background-size: 100% 100%;
  position: absolute;
  top: 66%;
  right: 8%;
  transform: translate(-50%, -50%);
  .details-content {
    width: 100%;
    color: white;
    position: relative;
    .spanStyle {
      font-size: 18px;
      color: rgb(255, 255, 255);
      position: relative;
      top: 60px;
    }
    .imgStyle {
      width: 50%;
      height: 80%;
      background-color: rgb(255, 255, 255);
    }
  }
}

.up-details {
  width: 12%;
  height: 16%;
  background: url('@/assets/image/voiceInteraction/info.png');
  padding: 40px 20px;
  background-size: 100% 100%;
  position: absolute;
  top: 50%;
  left: 4%;
  transform: translate(-50%, -50%);
  .up-content {
    color: white;
    padding: 55px 0;
    position: relative;

    .spanUpStyle {
      font-size: 25px;
      left: 5px;
      color: rgb(255, 255, 255);
    }
  }
}
.down-details {
  width: 12%;
  height: 16%;
  background: url('@/assets/image/voiceInteraction/info.png');
  padding: 40px 20px;
  background-size: 100% 100%;
  position: absolute;
  top: 70%;
  left: 4%;
  transform: translate(-50%, -50%);
  .down-content {
    color: white;
    padding: 55px 0;
    position: relative;

    .spanDownStyle {
      font-size: 25px;
      left: 5px;
      color: rgb(255, 255, 255);
    }
  }
}
/* 定义滚动条样式 */
&::-webkit-scrollbar {
  width: 6px;
  height: 6px;
  background-color: rgba(240, 240, 240, 0.4);
}
/*定义滚动条轨道 内阴影+圆角*/
&::-webkit-scrollbar-track {
  box-shadow: inset 0 0 0px rgba(240, 240, 240, 0.5);
  border-radius: 10px;
  background-color: rgba(240, 240, 240, 0.5);
}
/*定义滑块 内阴影+圆角*/
&::-webkit-scrollbar-thumb {
  border-radius: 10px;
  box-shadow: inset 0 0 0px aqua;
  background-color: aqua;
}
</style>
