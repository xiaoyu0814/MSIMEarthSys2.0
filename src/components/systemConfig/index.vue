<template>
  <div>
    <div class="systemConfig">
      <div class="configContainer">
        <div class="config_title">系统配置
          <el-tooltip effect="dark" content="关闭面板" placement="top">
            <img src="@/assets/image/panelIcons/关闭icon.png" alt="" class="close_sty" @click="handleClose" />
          </el-tooltip>
        </div>

        <!-- 第一部分：带复选框的配置选项 -->
        <div class="config-section">
          <div class="section-title">基本配置</div>
          <el-tree ref="treeRef" :data="state.checkboxItems" node-key="code" :props="state.defaultProps"
            :default-checked-keys="state.checkeys" show-checkbox @check="handleCheck">
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <span :title="data.name">{{ data.name }}</span>
              </span>
            </template>
          </el-tree>
        </div>

        <!-- 第二部分：不带复选框的设置选项 -->
        <div class="config-section">
          <div class="section-title">高级设置</div>
          <el-tree ref="settingTreeRef" :data="state.settingItems" node-key="code" :props="state.defaultProps"
            @node-click="handleSettingNodeClick" default-expand-all>
            <template #default="{ node, data }">
              <span class="custom-tree-node">
                <template v-if="node.level === 1">
                  <el-icon color="#409efc" :size="20" class="TreeSettingNode">
                    <Setting />
                  </el-icon>
                </template>
                <template v-else-if="node.level === 2">
                  <span class="radio-checkbox-wrapper">
                    <span class="radio-checkbox" :class="{ 'is-checked': data.checked }"
                      @click.stop="handleRadioClick(data)">
                      <span class="radio-inner"></span>
                    </span>
                  </span>
                </template>
                <span :title="data.name">{{ data.name }}</span>
              </span>
            </template>
          </el-tree>
        </div>
      </div>
    </div>
  </div>
  <dialDetailSetting v-if="state.isShowdialDetailSetting" @showDialDetailSetting="showDialDetailSetting" />
  <logoPageSelect v-if="state.isShowlogPageSelect" @showDialDetailSetting="showDialDetailSetting"></logoPageSelect>
  <modelSizeSetting v-if="state.isShowmodelSizeSetting" @showModelSizeSetting="showModelSizeSetting" />
</template>

<script setup>
import dialDetailSetting from '@/components/dialDetailSetting/dialDetailSetting.vue'
import logoPageSelect from '@/components/logoPageSelect/index.vue'
import modelSizeSetting from '@/components/modelSizeSetting/index.vue'
import store from '@/store'
import { getPAStatic } from '@/service/SSE'
import { reactive, onMounted, ref } from 'vue'
import emitter from '@/utils/eventbus'
import {
  changePosNowByDragEntity,
  removeEventHandler
} from '@/views/toolbar/layerList/hooks/guideCommand'

const state = reactive({
  // 带复选框的配置选项
  checkboxItems: [
    {
      code: 3,
      name: '启用鼠标交互',
      checked: true
    },
    {
      code: 7,
      name: '启用键盘快捷键',
      checked: false
    },
    {
      code: 9,
      name: '启用鼠标拖拽定位',
      checked: false
    },
    {
      code: 10,
      name: '启用精细模型',
      checked: true
    }
  ],
  // 不带复选框的设置选项（只有图标按钮）
  settingItems: [
    {
      code: 8,
      name: '实体标牌配置',
      childList: [
        {
          code: 9,
          name: '简洁标牌',
          checked: false
        }, {
          code: 10,
          name: '标准标牌',
          checked: true
        }, {
          code: 11,
          name: '详细标牌',
          checked: false
        }
      ]
    }
  ],
  defaultProps: {
    label: 'name',
    id: 'code',
    children: 'childList'
  },
  checkeys: [],
  isShowdialDetailSetting: false,
  isShowlogPageSelect: false,
  isShowmodelSizeSetting: false
})

const settingTreeRef = ref(null)
onMounted(() => {
  let obj = {
    code: 12,
    name: '简要显示',
    checked: false
  }

  if (
    sessionStorage.getItem('roleKey') == 'pilotseat' ||
    sessionStorage.getItem('roleKey') == 'Commandseat' ||
    sessionStorage.getItem('roleKey') == 'RedCommandseat' ||
    sessionStorage.getItem('roleKey') == 'BlueCommandseat'
  ) {
    state.checkboxItems.splice(state.checkboxItems.length - 1, 0, obj)
  }
  let checkdata = []
  if (store.state.sceneModule.systemConfig.damageAssessmentTimePause)
    checkdata.push(1)
  if (store.state.sceneModule.systemConfig.isFlyToSimModel) checkdata.push(2)
  if (store.state.sceneModule.systemConfig.isMouseInteractive) checkdata.push(3)
  if (store.state.sceneModule.systemConfig.isShowPanel) checkdata.push(5)
  if (store.state.sceneModule.systemConfig.usableControlKeyCode)
    checkdata.push(7)
  if (store.state.sceneModule.systemConfig.isDragPositioning) checkdata.push(9)
  if (store.state.sceneModule.systemConfig.isShowFineModel) {
    checkdata.push(10)
    getFineModel()
  }
  if (store.state.sceneModule.systemConfig.BriefShow) checkdata.push(12)

  if (store.state.sceneModule.systemConfig.labelShow) checkdata.push(11)
  if (store.state.sceneModule.systemConfig.titleExtension) checkdata.push(13)

  state.checkeys = checkdata
  //为白方席位时，不显示面板弹框选项
  if (localStorage.getItem('side') == 'admin') {
    let filterData = state.checkboxItems.filter((item, index) => {
      return item.code != 5
    })
    state.checkboxItems = filterData
  }
  const savedLabelType = localStorage.getItem('plateFormLabelType') || '10'
  state.settingItems.forEach(item => {
    if (item.childList) {
      item.childList.forEach(child => {
        child.checked = child.code == savedLabelType
      })
    }
  })
})

const handleClose = () => {
  emitter.emit('systemConfig', false)
  emitter.emit('setSystemConfigStatus', false)
}

const handleCheck = (val, arg) => {
  switch (val.name) {
    case '启用鼠标交互':
      store.commit(
        'setIsMouseInteractive',
        !store.state.sceneModule.systemConfig.isMouseInteractive
      )
      break
    case '启用键盘快捷键':
      store.commit(
        'setUsableControlKeyCode',
        !store.state.sceneModule.systemConfig.usableControlKeyCode
      )
      break
    case '启用精细模型':
      store.commit(
        'setIsShowFineModel',
        !store.state.sceneModule.systemConfig.isShowFineModel
      )
      getFineModel()
      break
    case '启用鼠标拖拽定位':
      store.commit(
        'setIsDragPositioning',
        !store.state.sceneModule.systemConfig.isDragPositioning
      )
      // 如配置开启 在此增加实现 拖拽实体重新定位功能
      if (store.state.sceneModule.systemConfig.isDragPositioning) {
        changePosNowByDragEntity()
      } else {
        removeEventHandler()
      }
      break
    default:
      break
  }
}

const handleSettingNodeClick = (data, node) => {
  if (node.level === 1) {
    handleSettingFirstLevelClick(data)
  } else if (node.level === 2) {
    handleRadioClick(data)
  }
}

const handleRadioClick = (data) => {
  if (data.clickable === false) return
  state.settingItems.forEach(item => {
    if (item.childList) {
      item.childList.forEach(child => {
        child.checked = child.code === data.code
      })
    }
  })
  handleSettingChange(data)
}

const handleSettingChange = (data) => {
  localStorage.setItem('plateFormLabelType', data.code)
  emitter.emit('labelTypeChange', data.code)
}

const handleSettingFirstLevelClick = (data) => {
}

const getFineModel = () => {
  if (store.state.sceneModule.systemConfig.isShowFineModel) {
    store.commit('setdetailedModel', true)
    // 开启模型切换判定条件，切换成功后立即关闭
    store.state.sceneModule.isChangeModel = true
    // 需要切换静态目标显示模式为非JB模式并调用PA接口重置静态目标
    store.state.sceneModule.showJB = false
    let curSide = window.localStorage.getItem('side')
    setTimeout(() => {
      getPAStatic({ side: curSide }).then((res) => { })
    }, 1500)
  } else {
    store.commit('setdetailedModel', false)
    // 开启模型切换判定条件，切换成功后立即关闭
    store.state.sceneModule.isChangeModel = true
    // 需要切换静态目标显示模式为JB模式并调用PA接口重置静态目标
    store.state.sceneModule.showJB = true
    let curSide = window.localStorage.getItem('side')
    console.log('curSide', curSide)
    setTimeout(() => {
      getPAStatic({ side: curSide }).then((res) => { })
    }, 1500)
  }
}
const showDialDetailSetting = (isTrue, data) => {
  if (data) {
    if (data.type) {
      switch (data.type) {
        case 'logoPage':
          state.isShowlogPageSelect = isTrue
          break
        case 'dialDetail':
          state.isShowdialDetailSetting = isTrue
          break
        case 'modelSize':
          state.isShowmodelSizeSetting = isTrue
          break
        default:
          break
      }
    } else {
      switch (data.code) {
        case 8:
          state.isShowdialDetailSetting = isTrue
          break
        case 9:
          state.isShowlogPageSelect = isTrue
          break

        default:
          break
      }
    }
  } else {
    state.isShowdialDetailSetting = isTrue
    state.isShowlogPageSelect = isTrue
  }
}
</script>

<style lang="less" scoped>
.systemConfig {
  position: absolute;
  right: 3%;
  top: 10%;
  margin-top: 0px;
  height: auto;
  min-height: 420px;
  max-height: 600px;
  width: 15vw;
  z-index: 998;

  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: linear-gradient(135deg,
      rgba(2, 26, 70, 0.95) 0%,
      rgba(0, 199, 251, 0.1) 100%);
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;
  box-shadow: 0 0 30px rgba(16, 146, 213, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 199, 251, 0.3);

  .configContainer {
    height: 97%;
    width: 100%;
    background: transparent;
    display: flex;
    flex-direction: column;
    overflow-y: auto;
    padding: 15px;
    box-sizing: border-box;

    .config_title {
      width: 100%;
      text-align: left;
      font-size: 20px;
      font-weight: 600;
      margin-bottom: 10px;
      color: #00c7fb;
      font-family: 'Arial', sans-serif;
      box-sizing: border-box;
      text-shadow: 0 0 10px rgba(0, 199, 251, 0.5);
      letter-spacing: 1px;
      position: relative;

      .close_sty {
        cursor: pointer;
        position: absolute;
        top: 2px;
        right: 4px;
        width: 16px;
        height: 16px;
        z-index: 1;
      }
    }

    // 配置项分组样式
    .config-section {
      padding: 0;
      box-sizing: border-box;

      // 分组标题样式
      .section-title {
        font-size: 16px;
        font-weight: 500;
        color: #409efc;
        padding-left: 8%;
        border-bottom: 1px solid rgba(0, 199, 251, 0.3);
        padding-bottom: 5px;
        text-shadow: 0 0 5px rgba(64, 158, 252, 0.5);
      }
    }
  }
}

.el-tree {
  font-size: 14px;
  height: auto !important;
  max-height: 200px;
  width: 95%;
  background: transparent;
  color: #c2d7ee;
  overflow-y: auto;
  box-sizing: border-box;
  padding-left: 8%;
  margin-bottom: 10px;
  font-family: 'Arial', sans-serif;
  letter-spacing: 0.5px;
}

:deep .el-tree-node {
  margin-top: 12px;
}

:deep .el-tree-node__content {
  transition: all 0.3s ease;
  border-radius: 4px;
  padding: 4px 8px;
  margin-right: 8px;
  border: 1px solid transparent;

  &:hover {
    background-color: rgba(0, 199, 251, 0.15) !important;
    color: #00c7fb;
    border-color: rgba(0, 199, 251, 0.4);
    box-shadow: 0 0 15px rgba(0, 199, 251, 0.3);
  }
}

:deep .el-tree-node .is-current>.el-tree-node__content {
  background-color: rgba(0, 199, 251, 0.2) !important;
  color: #00c7fb;
  border-color: rgba(0, 199, 251, 0.6);
  box-shadow: 0 0 15px rgba(0, 199, 251, 0.4);
}

:deep .el-tree-node:focus>.el-tree-node__content {
  background-color: rgba(0, 199, 251, 0.15) !important;
  color: #00c7fb;
  border-color: rgba(0, 199, 251, 0.4);
}

:deep el-tree-node__expand-icon el-icon-caret-right:before {
  color: rgba(0, 199, 251, 0.8);
  text-shadow: 0 0 5px rgba(0, 199, 251, 0.5);
}


/* 设置图标样式 */
.TreeSettingNode {
  margin-right: 8px;
  top: 4px;
  color: #00c7fb !important;
  text-shadow: 0 0 10px rgba(0, 199, 251, 0.8);
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    text-shadow: 0 0 15px rgba(0, 199, 251, 1);
  }
}

/* 复选框样式 */
:deep .el-checkbox {
  .el-checkbox__input {
    .el-checkbox__inner {
      background-color: rgba(2, 26, 70, 0.8);
      border-color: rgba(64, 158, 252, 0.6);
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(0, 199, 251, 0.8);
        box-shadow: 0 0 10px rgba(0, 199, 251, 0.5);
      }
    }

    &:checked {
      .el-checkbox__inner {
        background-color: rgba(0, 199, 251, 0.8);
        border-color: rgba(0, 199, 251, 1);
        box-shadow: 0 0 10px rgba(0, 199, 251, 0.6);
      }

      +.el-checkbox__label {
        color: #00c7fb;
        text-shadow: 0 0 5px rgba(0, 199, 251, 0.5);
      }
    }
  }

  .el-checkbox__label {
    color: #409efc;
    transition: all 0.3s ease;
  }
}

/* 滚动条样式 */
:deep ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

:deep ::-webkit-scrollbar-track {
  background: rgba(2, 26, 70, 0.3);
  border-radius: 3px;
}

:deep ::-webkit-scrollbar-thumb {
  background: rgba(0, 199, 251, 0.6);
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(0, 199, 251, 0.5);

  &:hover {
    background: rgba(0, 199, 251, 0.8);
    box-shadow: 0 0 15px rgba(0, 199, 251, 0.8);
  }
}

:deep ::-webkit-scrollbar-corner {
  background: rgba(2, 26, 70, 0.3);
}

.radio-checkbox-wrapper {
  margin-right: 8px;
  vertical-align: middle;
}

.radio-checkbox {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  cursor: pointer;
  position: relative;
  vertical-align: middle;

  .radio-inner {
    width: 16px;
    height: 15px;
    border-radius: 50%;
    background-color: rgba(17, 181, 236, 0.5);
    border: 1px solid #11b5ec;
    position: relative;
    transition: all 0.3s ease;

    &::after {
      content: '';
      position: absolute;
      top: 48%;
      left: 50%;
      transform: translate(-50%, -50%) scale(0);
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background-color: #11b5ec;
      transition: transform 0.3s ease;
    }
  }

  &.is-checked {
    .radio-inner {
      &::after {
        transform: translate(-50%, -50%) scale(1);
      }
    }
  }

  &[disabled] {
    cursor: not-allowed;

    .radio-inner {
      opacity: 0.5;
    }
  }

  &:hover:not([disabled]) .radio-inner {
    border-color: rgba(0, 199, 251, 1);
    box-shadow: 0 0 10px rgba(0, 199, 251, 0.5);
  }
}
</style>
