<template>
  <div class="data-container">
    <div class="layerList">
      <div class="layerTitle">
        图层管理
        <el-tooltip class="box-item" effect="dark" content="关闭面板" placement="bottom-start">
          <img src="@/assets/image/panelIcons/关闭icon.png" alt="" class="close_sty" @click="handleClose_" />
        </el-tooltip>
      </div>
      <el-menu ref="treeRef" :default-active="''" mode="vertical" class="menu-tree" @select="handleMenuSelect">
        <template v-for="item in store.state.sceneModule.layerManagementData" :key="item.code">
          <el-sub-menu :index="String(item.code)">
            <template #title>
              <img style="margin-right: 6px; width: 17px; height: 17px"
                :src="require(`@/assets/image/layerlist/${item.image}`)" />
              <span>{{ item.name }}</span>
            </template>
            <template v-for="child in item.childList" :key="child.code">
              <el-menu-item v-if="!child.childList" :index="String(child.code)"
                @click="(e) => handleMenuItemClick(child, e)">
                <span @click.stop>
                  <el-checkbox v-model="child.checked"
                    @change="(val) => handleCheck(child, { checkedKeys: getCheckedKeys() })" />
                </span>
                <span v-if="child.name == '网络通信'">
                  {{ child.name }}<img style="margin-left: 6px;width: 150px; height: 15px;vertical-align: middle;"
                    src="@/assets/image/texture/RE_MR.png" />
                </span>
                <span v-else-if="child.name == '电磁干扰'">
                  {{ child.name }}<img style="margin-left: 6px;width: 150px; height: 15px;vertical-align: middle;"
                    src="@/assets/image/texture/RE_JamA.png" />
                </span>
                <span v-else-if="child.name == '火力打击'">
                  {{ child.name }}<img style="margin-left: 6px;width: 150px; height: 15px;vertical-align: middle;"
                    src="@/assets/image/texture/RE_WeaponF.png" />
                </span>
                <span v-else-if="child.name == '局域追踪'">
                  {{ child.name }}<img style="margin-left: 6px;width: 150px; height: 15px;vertical-align: middle;"
                    src="@/assets/image/texture/RE_STrackInit.png" />
                </span>
                <span v-else>{{ child.name }}</span>
              </el-menu-item>
              <el-sub-menu v-else :index="String(child.code)">
                <template #title>
                  <span>{{ child.name }}</span>
                </template>
                <template v-for="grandchild in child.childList" :key="grandchild.code">
                  <el-menu-item :index="String(grandchild.code)" @click="(e) => handleMenuItemClick(grandchild, e)">
                    <span @click.stop>
                      <el-checkbox v-model="grandchild.checked"
                        @change="(val) => handleCheck(grandchild, { checkedKeys: getCheckedKeys() })" />
                    </span>
                    <span>{{ grandchild.name }}</span>
                  </el-menu-item>
                </template>
              </el-sub-menu>
            </template>
          </el-sub-menu>
        </template>
      </el-menu>
      <div class="detail-container" v-show="state.detailVisible">
        <div class="container-main">
          <img src="@/assets/image/panelIcons/关闭icon.png" alt="" class="close_Sty" @click="handleClose" />
          <!-- <div class="buttonTitle">视角配置：</div>
          <el-radio-group v-model="state.statusRadio" @change="changeSelected">
            <el-radio label="first">第一视角</el-radio>
            <el-radio label="three">第三视角</el-radio>
            <el-radio label="lockEntity">锁定实体</el-radio>
            <el-radio label="free">自由视角</el-radio>
            <el-radio label="viewAngle">观看视角</el-radio>
          </el-radio-group> -->
          <div class="buttonTitle">显隐配置：</div>
          <div class="checkedOption">
            <el-checkbox v-show="state2.existPath" v-model="state2.pathChecked" @change="pathCheckChange" label="路径"
              size="default" />
            <el-checkbox v-show="state2.existWall" v-model="state2.wallChecked" @change="entityWallChange" label="路径墙"
              size="default" />
            <el-checkbox v-show="state2.existWack" v-model="state2.wackChecked" @change="entityWackChange" label="尾迹"
              size="default" />
            <!-- <el-checkbox
              v-show="state2.existSightFrame"
              v-model="state2.sightFrameChecked"
              @change="sightFrameChange"
              label="瞄准框"
              size="default"
            /> -->
            <el-checkbox v-show="state2.existMissileLine" v-model="state2.missileLineChecked"
              @change="missileLineChange" label="导弹线" size="default" />
            <el-checkbox v-show="state2.existOperationalRadius" v-model="state2.operationalRadiusChecked"
              @change="operationalRadiusChange" label="作战半径" size="default" />
            <el-checkbox v-show="state2.existFrustum" v-model="state2.frustumChecked" @change="entityFrustumChange"
              label="感知半径" size="default" />
            <el-checkbox v-show="state2.existCommunicationRadius" v-model="state2.communicationRadiusChecked"
              @change="communicationRadiusChange" label="通信半径" size="default" />
            <el-checkbox v-show="state2.existFirepowerRadius" v-model="state2.firepowerRadiusChecked"
              @change="firepowerRadiusChange" label="火力半径" size="default" />
            <el-checkbox v-show="state2.existSensor" v-model="state2.sensorChecked" @change="entitySensorChange"
              label="传感器范围" size="default" />
            <el-checkbox v-show="state2.existFullBandDisb" v-model="state2.fullBandDisbChecked"
              @change="fullBandDisbChange" label="干扰范围(全频)" size="default" />
            <el-checkbox v-show="state2.existNarrowBandDisb" v-model="state2.narrowBandDisbChecked"
              @change="narrowBandDisbChange" label="干扰范围(窄带)" size="default" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { loadData } from './hooks/index.js'
import store from '@/store/index'
import emitter from '@/utils/eventbus'
import { reactive, onMounted, nextTick } from 'vue'

const vuedata = reactive({
  lockout: true,
  switchValue: false
})
const {
  state,
  state2,
  handleCheck,
  treeRef,
  sceneRealTimeTreeRef,
  handleSwitchLayers,
  handleCheckSceneRealTimeEntity,
  changeCheck,
  changeSelected,
  handleNodeClick,
  handleClose,
  pathCheckChange,
  entityWackChange,
  entityWallChange,
  entitySensorChange,
  entityFrustumChange,
  sightFrameChange,
  missileLineChange,
  firepowerRadiusChange,
  communicationRadiusChange,
  operationalRadiusChange,
  fullBandDisbChange,
  narrowBandDisbChange
} = loadData()

onMounted(() => {
  vuedata.lockout = store.state.sceneModule.islayerListLock
  nextTick(() => {
    if (treeRef.value) {
      store.state.sceneModule.layerManagementData.forEach((item) => {
        treeRef.value.open(String(item.code))
      })
    }
    if (sessionStorage.getItem('roleKey') != 'pilotseat') {
      //非导调席位
      // if (treeRef.value.getNode('31')) {
      //   treeRef.value.remove(treeRef.value.getNode('31')) //移除场景配置图层节点下的模型树节点，因为在2D模式下模型描边不显示
      // }
      // if (treeRef.value.getNode('campaignSituation')) {
      //   treeRef.value.remove(treeRef.value.getNode('campaignSituation')) //移除战役态势图层，因为在2D模式下会报错，因为当前cesium版本过低，需要1.103以上的版本
      // }
    }
  })
})

const handleLock = () => {
  vuedata.lockout = !vuedata.lockout
  store.commit('setIslayerListLock', vuedata.lockout)
}
const getCheckedKeys = () => {
  let keys = []
  const data = store.state.sceneModule.layerManagementData
  const check = (list) => {
    list.forEach(item => {
      if (item.checked) {
        keys.push(item.code)
      }
      if (item.childList) {
        check(item.childList)
      }
    })
  }
  check(data)
  return keys
}
const findNodeByCode = (data, code) => {
  for (let item of data) {
    if (item.code == code) {
      return item
    }
    if (item.childList) {
      const found = findNodeByCode(item.childList, code)
      if (found) return found
    }
  }
  return null
}
const handleMenuSelect = (index) => {
  const node = findNodeByCode(store.state.sceneModule.layerManagementData, index)
  if (node) {
    handleNodeClick(node)
  }
}
const handleMenuItemClick = (data, e) => {
  e.stopPropagation()
}
const handleRefresh = () => {
  let options = {
    earth: window.MSIMEarth,
    viewer: window.EarthViewer,
    type: 'panel'
  }
  let layerList = new window.EarthPlugn.treeManagement(options)
  let layerData = store.getters.getLayerManagementData
  layerData[3].childList = []
  layerData[4].childList = []
  let resultTreeData
  console.log(store.state.sceneModule.sceneEnityData)
  store.state.sceneModule.sceneEnityData.forEach((json) => {
    if (json.Data.Side == 'blue') {
      // 图层添加
      resultTreeData = layerList.panelManagement.addNode(
        layerData,
        {
          name: json.Data.LabelName,
          type: json.Data.Type,
          code: json.Data.Name,
          checked: true,
          clickable: true
        },
        '蓝方实体'
      )
      // 图层勾选
      resultTreeData = layerList.panelManagement.updateTickStatus(
        layerData,
        {
          name: json.Data.LabelName,
          type: json.Data.Type,
          code: json.Data.Name
        },
        'add'
      )
      // 蓝方目标布设完成 绿色
    } else if (json.Data.Side == 'red') {
      // 图层添加
      resultTreeData = layerList.panelManagement.addNode(
        layerData,
        {
          name: json.Data.LabelName,
          type: json.Data.Type,
          code: json.Data.Name,
          checked: true,
          clickable: true
        },
        '红方实体'
      )
      // 图层勾选
      resultTreeData = layerList.panelManagement.updateTickStatus(
        layerData,
        {
          name: json.Data.LabelName,
          type: json.Data.Type,
          code: json.Data.Name
        },
        'add'
      )
    }
  })
  store.commit('setLayerManagementData', resultTreeData)
}
const handleClose_ = () => {
  emitter.emit('showTree', {})
  emitter.emit('tagActiveClose', 'showTree')
}
</script>

<style lang="less" scoped>
.data-container {
  position: fixed;
  right: 6%;
  top: 10%;
  // right: 10px;
  margin-top: 0px;
  height: 460px;
  width: 17vw;
  z-index: 998;

  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  .layerList {
    height: 97%;
    width: 100%;
    background: rgba(2, 26, 70, 0.58);
    box-shadow: 0 0 25px #1092d58a;

    .layerTitle {
      height: 40px;
      width: 100%;
      display: flex;
      align-items: center;
      padding: 10px 0 10px 15px;
      box-sizing: border-box;
      text-align: left;
      font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
      font-weight: 700;
      font-style: normal;
      font-size: 19px;
      color: #c2d7ee;
      border-bottom: 2px solid #0372a6;

      .lock_sty {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 16px;
        right: 40px;
        cursor: pointer;
      }

      .refresh_sty {
        width: 20px;
        height: 20px;
        position: absolute;
        top: 16px;
        right: 70px;
        cursor: pointer;
      }

      .close_sty {
        width: 18px;
        height: 18px;
        position: absolute;
        top: 17px;
        right: 12px;
        cursor: pointer;
      }
    }

    .detail-container {
      position: absolute;
      right: calc(17vw + 6%);
      top: 0;
      width: 150px;
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

      .container-main {
        padding: 15px;
        height: 97%;
        width: 100%;
        background: rgba(2, 26, 70, 0.88);
        box-shadow: 0 0 25px #1092d5;

        .close_Sty {
          width: 20px;
          height: 20px;
          position: absolute;
          top: 10px;
          right: 20px;
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
  }

  .el-tree {
    font-size: 15px;
    // margin-top: 20px;
    height: 90% !important;
    width: 95%;
    background: transparent;
    color: #e9fcfd;
    overflow-y: auto;
    box-sizing: border-box;
    padding-left: 3%;

    .custom-icon {
      width: 17px;
      height: 17px;
      padding-right: 6px;
    }
  }

  .buttonTitle {
    width: 100%;
    text-align: left;
    font-size: 16px;
    font-weight: 500;
    color: #00c7fb;
  }

  .checkedOption {
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .setView {
    height: 8%;
    // position: absolute;
    // bottom: 0;

    .el-radio {
      margin-right: 10px;
    }

    .check-box {
      text-align: right;
      padding-right: 14px;
      display: inline-block;
      margin-left: 6px;
    }

    /deep/ .el-select {
      height: 20px;

      .el-input__wrapper {
        background: rgba(0, 0, 0, 0.2);

        .el-input__inner {
          color: #fff;
        }
      }
    }
  }

  /*滚动条高宽度*/
  ::-webkit-scrollbar {
    width: 4px;
    height: 4px;
  }

  /*滚动条滑块*/
  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: rgba(48, 50, 53, 0.7);
  }

  /*滚动条里面轨道*/
  ::-webkit-scrollbar-track {
    box-shadow: 1px 1px 5px rgba(0, 0, 0, 0.2) inset;
  }

  /*滚动条的小边角*/
  ::-webkit-scrollbar-corner {
    background: transparent;
  }
}

//去掉父级的复选框
:deep(.root-node > .el-tree-node__content) {
  .el-checkbox {
    display: none;
  }
}

:deep .el-radio__inner {
  background-color: rgba(17, 181, 236, 0.5);
  border: 1px solid #11b5ec;
}

:deep .el-radio {
  color: #11b5ec;
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

:deep .el-tree-node {
  margin-top: 10px;
}

:deep .el-tree-node__content:hover,
.el-upload-list__item:hover {
  background-color: rgba(17, 181, 236, 0.5);
}

:deep .el-tree-node .is-current>.el-tree-node__content {
  background-color: rgba(17, 181, 236, 0.5);
}

:deep .el-tree-node:focus>.el-tree-node__content {
  background-color: rgba(17, 181, 236, 0.5);
}

:deep el-tree-node__expand-icon el-icon-caret-right:before {
  color: rgba(17, 181, 236, 1);
}

:deep .menu-tree {
  height: 90% !important;
  width: 100%;
  background: transparent;
  color: #e9fcfd;
  overflow-y: auto;
  box-sizing: border-box;
  border: none;
}

:deep .menu-tree .el-menu-item,
:deep .menu-tree .el-sub-menu__title {
  height: 40px;
  line-height: 32px;
  font-size: 16px;
  letter-spacing: 0.5px;
  padding: 10px 0 10px 20px;
  background: rgba(2, 26, 70, 0.95);
  color: #e9fcfd;
  border: none;
}

:deep .menu-tree .el-menu-item:hover,
:deep .menu-tree .el-sub-menu__title:hover {
  background-color: rgba(17, 181, 236, 0.5);
}


:deep .menu-tree .el-sub-menu .el-menu-item:hover {
  background-color: rgba(2, 26, 70, 0.75);
  color: rgba(17, 181, 236, 1);
}

:deep .menu-tree .el-sub-menu .el-sub-menu__title {
  color: #a8d8ea;
  padding-left: 20px;
  height: 40px;
  line-height: 40px;
  font-size: 16px;
  letter-spacing: 0.5px;
}

:deep .menu-tree .el-sub-menu .el-sub-menu__title:hover {
  background-color: rgba(17, 181, 236, 0.5);
}

:deep .menu-tree .el-sub-menu__icon-arrow {
  color: rgba(17, 181, 236, 1);
  font-size: 15px;
}

:deep .menu-tree .el-menu-item .el-checkbox {
  margin-right: 8px;
}
</style>
