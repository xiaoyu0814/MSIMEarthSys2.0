<template>
  <div class="detail-container detail-container-pos">
    <div class="container-main">
      <div class="buttonTitle">目标信息配置：</div>
      <img
        src="@/assets/image/panelIcons/关闭icon.png"
        alt=""
        class="close_sty"
        @click="handleClose"
      />
      <el-checkbox-group
        v-model="state.curSelect"
        class="checkedOption"
        @change="handleCheckChange"
      >
        <!-- <el-checkbox label="位置" />
        <el-checkbox label="姿态" />
        <el-checkbox label="速度" />
        <el-checkbox label="类型" />
        <el-checkbox label="状态" /> -->
        <el-checkbox label="编组" />
      </el-checkbox-group>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  onMounted,
  reactive,
  watch,
  getCurrentInstance,
  defineEmits
} from 'vue'
// import loadEvent from '@/utils/earth/cesium/loadEvent'
import store from '@/store/index'
import emitter from '@/utils/eventbus'

const state = reactive({
  curSelect: []
})

onMounted(() => {
  state.curSelect = store.state.sceneModule.planeConfig
})

const handleCheckChange = (value) => {
  store.state.sceneModule.planeConfig = value
}
const handleClose = () => {
  store.commit('setPlane', '')
  emitter.emit('closeBottomControlPanel', 'three')
}
</script>

<style lang="less" scoped>
.detail-container {
  position: absolute;
  right: calc(17vw + 18%);
  bottom: 3%;
  width: 150px;
  z-index: 99;
  // height: 250px;
  // background: url('@/assets/image/voiceInteraction/zjDiv.png');
  // background-size: 100% 100%;
  // padding: 40px 20px;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  &.detail-container-pos {
    z-index: 99;
  }
  .container-main {
    padding: 15px;
    height: 97%;
    width: 100%;
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;
    .buttonTitle {
      width: 100%;
      text-align: left;
      font-size: 16px;
      font-weight: 500;
      color: #00c7fb;
    }
    .close_sty {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }
    .el-radio-group {
      display: inline-flex;
      align-items: flex-start;
      font-size: 0;
      flex-direction: column;
      padding: 0;
    }
  }
}

.checkedOption {
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}
:deep .el-checkbox {
  color: #11b5ec !important;
}

:deep .el-checkbox__inner {
  background-color: rgba(17, 181, 236, 0.5);
  border: 1px solid #11b5ec;
  border-radius: 50%;
  color: #11b5ec;
}

:deep .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: rgba(17, 181, 236, 0.5);
  color: rgba(17, 181, 236, 1);
}

:deep .el-checkbox__input.is-disabled .el-checkbox__inner {
  background-color: rgba(17, 181, 236, 0.5);
  color: rgba(17, 181, 236, 1);
  border-color: rgba(17, 181, 236, 1);
}

:deep .el-checkbox__input.is-disabled {
  background-color: rgba(17, 181, 236, 0.5);
  color: rgba(17, 181, 236, 1);
}
</style>
