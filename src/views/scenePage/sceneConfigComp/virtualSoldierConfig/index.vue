<template>
  <div class="target-container xubingdiaotiao">
    <div class="container-main">
      <div class="buttonTitle">兵力导调</div>
      <img
        src="@/assets/image/panelIcons/关闭icon.png"
        alt=""
        class="close_sty"
        @click="handleClose"
      />
      <el-tabs type="border-card" v-model="state.tabSelect">
        <el-tab-pane
          v-for="item in state.tabList"
          :key="item.name"
          :label="item.label"
          :name="item.name"
          :disabled="item.disabled"
        >
          <hasSoldier v-if="state.tabSelect == 'first'"></hasSoldier>
          <noneSoldier v-if="state.tabSelect == 'second'"></noneSoldier>
          <!-- <targetConfigTab :tab-select="state.tabSelect"></targetConfigTab> -->
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch } from 'vue'
import emitter from '@/utils/eventbus'
import store from '@/store/index'
import hasSoldier from './hasSoldier.vue'
import noneSoldier from './noneSoldier.vue'
import { moveBtnPanel } from '@/utils/mapTools'
const state = reactive({
  tabSelect: 'first',
  tabList: [
    {
      name: 'first',
      label: '兵力添加',
      disabled: false
    },
    {
      name: 'second',
      label: '兵力删除',
      disabled: false
    }
  ]
})

const handleClose = () => {
  emitter.emit('closeBottomControlPanel', 'three')
}
onMounted(() => {
  moveBtnPanel('xubingdiaotiao')
})
</script>

<style lang="less" scoped>
.target-container {
  position: absolute;
  right: calc(17vw + 18%);
  bottom: 3%;
  width: 388px;
  height: 361px;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1111;

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

    .scene_input {
      // margin-top: 25px;
      border: none !important;

      :deep(.el-input__inner) {
        font-size: 18px;
        font-weight: 500;
        color: #06d6f9;
        border: none !important;
        text-align: center;
      }

      :deep(.el-input__wrapper) {
        background-color: #172e51 !important;
        box-shadow: 0 0 25px #1092d5;
      }

      :deep(.el-input) {
        --el-input-border-color: #e5e5e500 !important;
        --el-input-hover-border: transparent !important;
        --el-input-focus-border: transparent !important;
        --el-input-placeholder-color: #06d6f9;
      }

      :deep(.el-select) {
        --el-select-border-color-hover: transparent !important;
        --el-select-input-focus-border-color: transparent !important;
      }

      :deep(.el-input__wrapper:hover) {
        border: none !important;
        box-shadow: none;
      }
    }

    :deep(.el-tabs--border-card > .el-tabs__content) {
      padding: 0;
      height: calc(100% - 39px);

      .el-tab-pane {
        height: 100%;
      }
    }

    :deep(.el-tabs--border-card) {
      background: rgba(0, 0, 0, 0);
      border: none;
      height: calc(100% - 48px);
    }

    :deep(.el-tabs--border-card > .el-tabs__header) {
      background: rgba(0, 0, 0, 0);
    }

    :deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active) {
      background-color: #1092d5;
      border: none;
    }

    :deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item) {
      color: white;
    }

    :deep(.el-tabs__item:focus-visible) {
      box-shadow: none;
    }

    :deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item) {
      border: none;
    }
  }
}

.inputOption {
  :deep(.el-form-item__label) {
    color: white;
  }

  :deep .el-input__wrapper {
    background: rgba(32, 97, 121, 0.45);
    border: 1px solid rgba(100, 199, 213, 1);
    border-radius: 4px;

    .el-input__inner {
      color: white;
    }
  }
}

.select_btn {
  display: flex;
  justify-content: flex-end;
}

:deep(.el-radio) {
  color: white;
  margin: 10px 0;
}
</style>
