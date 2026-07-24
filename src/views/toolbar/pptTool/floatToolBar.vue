<!--
 * @Author: lvzhui
 * @Date: 2024-03-30 14:18:40
 * @LastEditTime: 2024-04-01 11:08:00
 * @LastEditors: lvzhui
 * @Description: 工具条组件
 * @FilePath: \smartearthsys3.0\src\components\floatToolBar\floatToolBar.vue
-->
<template>
  <div class="float-tool">
    <!-- <div class="float-left">
      <el-tooltip effect="light" :content="'伸缩'" placement="bottom">
        <div
          class="left-btn"
          @click="changeRight"
          :style="state.leftOpacity"
        ></div>
      </el-tooltip>
    </div> -->
    <div class="float-right" v-show="state.rightShow">
      <div
        class="bar-item"
        v-for="(item, index) in state.rightBarList"
        :key="index"
        @click="selectRightBar(item)"
      >
        <el-tooltip effect="light" :content="item.name" placement="bottom">
          <img
            :src="item.img"
            :alt="item.tooptip"
            style="width: 100%; height: 100%"
          />
        </el-tooltip>
      </div>
    </div>
    <!-- <Transition
      name="custom-classes"
      enter-active-class="animate__animated animate__backInDown "
      leave-active-class="animate__animated animate__backOutUp"
    >
      <earthDataManage
        v-if="showTree"
        class="animate__animated"
      ></earthDataManage>
    </Transition> -->
  </div>
</template>
<script setup>
import { toRefs } from 'vue'
// import { toolBar3 } from '../toolBar3/hooks/index'
// import earthDataManage from '@/components/earthComponents/earthDataManage/index.vue'
import { ref, onMounted, reactive } from 'vue'

//定义事件发送器
const emit = defineEmits(['changeBtn'])

const state = reactive({
  rightBarList: [
    {
      img: require('@/assets/image/rightBar/语音.png'),
      // img: require('@/assets/image/rightBar/icon2备份.svg'),
      name: '语音功能',
      tag: 'voice'
    },
    // {
    //   img: require('@/assets/image/rightBar/新工具栏.png'),
    //   // img: require('@/assets/image/rightBar/icon2备份.svg'),
    //   name: '工具栏',
    //   tag: 'tool'
    // },
    {
      img: require('@/assets/image/rightBar/场景列表.png'),
      // img: require('@/assets/image/rightBar/icon1备份.svg'),
      name: '流程列表',
      tag: 'list'
    },
    {
      img: require('@/assets/image/rightBar/新上一页.png'),
      // img: require('@/assets/image/rightBar/icon3备份.svg'),
      name: '上一场景',
      tag: 'Previous'
    },
    {
      img: require('@/assets/image/rightBar/新下一页.png'),
      name: '下一场景',
      tag: 'next'
    },
    // {
    //   img: require('@/assets/image/rightBar/新重播.png'),
    //   name: '重播',
    //   tag: 'replay'
    // },
    {
      img: require('@/assets/image/rightBar/新退出.png'),
      name: '退出',
      tag: 'exit'
    }
  ], //按钮列表
  rightShow: true, //右侧列表是否展开
  //透明度
  leftOpacity: {
    opacity: 0.5
  }
})
//
/**
 * @description: 工具条右侧收缩及显示透明度调整
 */
const changeRight = () => {
  state.rightShow = !state.rightShow
  if (state.rightShow) {
    state.leftOpacity = {
      opacity: 1
    }
  } else {
    state.leftOpacity = {
      opacity: 0.5
    }
  }
}
/**
 * @description: 按钮点击事件
 * @param {Object} item 按钮点击参数
 */
const selectRightBar = (item) => {
  emit('changeBtn', item)
}
/**
 * @description: window键盘按下事件处理
 * @param {Event} e 键盘按键事件对象
 */
const selectRightkeydown = (e) => {
  if (e.code == 'ArrowLeft') {
    // 上一场景
    emit('changeBtn', state.rightBarList[3])
  } else if (e.code == 'ArrowRight') {
    // 下一场景
    emit('changeBtn', state.rightBarList[4])
  }
}

onMounted(() => {
  window.removeEventListener('keydown', selectRightkeydown)
  window.addEventListener('keydown', selectRightkeydown)
})
</script>

<style lang="less" scoped>
.float-tool {
  position: absolute;
  right: 100px;
  top: 5px;
  z-index: 999;
  display: flex;
  justify-content: space-around;
  align-items: center;
  height: 100px;
  // .float-left {
  //   // height: 120px;
  //   margin-right: 30px;
  //   display: flex;
  //   align-items: center;
  //   .left-btn {
  //     height: 50px;
  //     width: 50px;
  //     border-radius: 50%;
  //     border: 1px solid #0000006e;
  //     // opacity: 0.5;
  //     background: linear-gradient(154deg, #fefefe94 25%, #26c7b887 63%);
  //   }
  //   .left-btn:hover {
  //     opacity: 1 !important;
  //   }
  // }
  .float-right {
    display: flex;
    align-items: center;
    // height: 100px;
    // background-color: #151c2cad;
    // background: url('@/assets/image/rightBar/新控制面-矩形.png');
    // background-size: 100% 100%;
    padding: 10px;
    border-radius: 5px;
    background: rgba(2, 26, 70, 0.58);
    box-shadow: 0 0 25px #1092d58a;
    box-sizing: border-box;
  }
  .bar-item {
    height: 50px;
    width: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    // padding: 10px;
    margin-right: 15px;
    margin-left: 15px;
    // background-color: #0000007a;
    border-radius: 10px;
    .el-tooltip__trigger {
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      // img {
      //   width: 40px;
      //   height: 40px;
      // }
    }
  }
}
</style>
