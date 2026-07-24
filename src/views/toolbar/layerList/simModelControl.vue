<!-- 模拟器导调面板 -->
<template>
  <div class="simModelCommandControlContainer">
    <div class="container-main">
      <div class="buttonTitle">{{ state.formData.command }}指令</div>
      <img
        src="@/assets/image/panelIcons/关闭icon.png"
        alt=""
        class="close_sty"
        @click="handleClose"
      />
      <simModelNormalComp
        v-if="
          state.formData.command == '运控' || state.formData.command == '集合'
        "
        :formDataObj="props.simModelCommandFormData"
      ></simModelNormalComp>
      <airportEnv
        v-if="state.formData.command == '机场气象'"
        :formDataObj="props.simModelCommandFormData"
      >
      </airportEnv>
      <ocean
        v-if="state.formData.command == '海洋海况'"
        :formDataObj="props.simModelCommandFormData"
      >
      </ocean>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch, defineProps } from 'vue'
import emitter from '@/utils/eventbus'
import store from '@/store/index'
import Bubble3 from '@/utils/bubble/dataBubble3'
import simModelNormalComp from './simModelControlComp/simModelNormalComp'
import airportEnv from './simModelControlComp/airportEnv'
import ocean from './simModelControlComp/ocean'
import { ElMessage } from 'element-plus'
import { moveBtnPanel } from '@/utils/mapTools'
const props = defineProps({
  simModelCommandFormData: {
    type: Object,
    default: {}
  }
})
const state = reactive({
  curSelect: '',
  formData: {
    command: props.simModelCommandFormData.command
  }
})

const handleClose = () => {
  let commandControlObj = {
    isShow: false,
    simModelCommandFormData: {}
  }
  emitter.emit('showSimModelCommandControl', commandControlObj)
  emitter.emit('clearSimModelRadioData')
}
onMounted(() => {
  emitter.on('closePanel', () => {
    handleClose()
  })
  moveBtnPanel('simModelCommandControlContainer')
})
</script>

<style lang="less" scoped>
.simModelCommandControlContainer {
  position: absolute;
  right: 22%;
  top: 41%;
  width: 300px;
  z-index: 1111;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;

  .container-main {
    padding: 15px;
    height: 97%;
    width: 100%;
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;
    display: flex;
    flex-direction: column;

    .buttonTitle {
      width: 100%;
      text-align: left;
      font-size: 20px;
      font-weight: 500;
      color: #00c7fb;
      display: flex;
      align-items: center;

      &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 20px;
        margin-right: 5px;
        background: #1092d5;
      }
    }

    .close_sty {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }
  }
}
</style>
