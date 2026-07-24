<template>
  <div class="detail-container detail-container-pos">
    <div class="container-main">
      <div class="buttonTitle">场景辅助信息：</div>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="关闭面板"
        placement="top"
      >
        <img
          src="@/assets/image/panelIcons/关闭icon.png"
          alt=""
          class="close_sty"
          @click="handleClose"
        />
      </el-tooltip>
      <el-checkbox-group
        v-model="state.curSelect"
        class="checkedOption"
        @change="handleCheckChange"
      >
        <!-- <el-checkbox label="传感器范围" /> -->
        <el-checkbox label="链路图例" />
        <!-- <el-checkbox label="作战范围" /> -->
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
  state.curSelect = store.state.sceneModule.earthObjectConfig
  emitter.on('changeEarthObjectConfig', (value) => {
    state.curSelect = store.state.sceneModule.earthObjectConfig
  })
})
const sceneAction = new window.EarthPlugn.sceneAction({
  earth: window.MSIMEarth,
  viewer: window.EarthViewer
})
const connectLineManage = sceneAction.connectLineManagement

const handleCheckChange = (value) => {
  let lastConfig = store.state.sceneModule.earthObjectConfig
  let filterAdd = value.filter((item) => {
    return lastConfig.findIndex((ritem) => item == ritem) == -1
  })
  let filterDelete = lastConfig.filter((item) => {
    let a = value.findIndex((ritem) => item == ritem)
    return a == -1
  })
  store.state.sceneModule.earthObjectConfig = value
  filterAdd.forEach((item) => {
    addChecked(item)
  })
  filterDelete.forEach((item) => {
    deleteChecked(item)
  })
}

const addChecked = (value) => {
  switch (value) {
    case '传感器范围':
      connectLineManage.showEntityByKeyword('SU==sensor', true)
      break
    case '链路图例':
      // store.commit('setLinkState', true)
      // connectLineManage.showEntityByKeyword('RE_LTrackInit', true)
      // connectLineManage.showEntityByKeyword('RE_WeaponF', true)
      // connectLineManage.showEntityByKeyword('RE_JamS', true)
      // connectLineManage.showEntityByKeyword('RE_Network', true)
      // connectLineManage.showEntityByKeyword('RE_MR', true)
      // connectLineManage.showEntityByKeyword('distancelabel', true)
      emitter.emit('changeConnectionLegend', true)
      break
    case '作战范围':
      connectLineManage.showEntityByKeyword('defendSurround', true)
      break

    default:
      break
  }
}

const deleteChecked = (value) => {
  switch (value) {
    case '传感器范围':
      connectLineManage.showEntityByKeyword('SU==sensor', false)
      break
    case '链路图例':
      // store.commit('setLinkState', false)
      // connectLineManage.showEntityByKeyword('RE_LTrackInit', false)
      // connectLineManage.showEntityByKeyword('RE_WeaponF', false)
      // connectLineManage.showEntityByKeyword('RE_JamS', false)
      // connectLineManage.showEntityByKeyword('RE_Network', false)
      // connectLineManage.showEntityByKeyword('RE_MR', false)
      // connectLineManage.showEntityByKeyword('distancelabel', false)
      emitter.emit('changeConnectionLegend', false)
      break
    case '作战范围':
      connectLineManage.showEntityByKeyword('defendSurround', false)
      break

    default:
      break
  }
}

const handleClose = () => {
  emitter.emit('closeBottomControlPanel', 'three')
}
</script>

<style lang="less" scoped>
.detail-container {
  position: absolute;
  right: calc(17vw + 20%);
  bottom: 4%;
  width: 180px;
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
      width: 16px;
      height: 16px;
      position: absolute;
      top: 16px;
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
