<template>
  <div>
    <Transition
      name="custom-classes"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <img
        v-show="!vueData.leftShow"
        class="left-shrink"
        :src="
          vueData.leftShow
            ? require('@/assets/image/panelIcons/telescoping.png')
            : require('@/assets/image/panelIcons/telescoping_1.png')
        "
        @click="leftContentShow"
      />
    </Transition>
    <Transition
      name="custom-classes"
      enter-active-class="animate__animated animate__backInLeft"
      leave-active-class="animate__animated animate__backOutLeft"
    >
      <div class="menuPanel" v-show="vueData.leftShow">
        <img
          class="content-img"
          :src="
            vueData.leftShow
              ? require('@/assets/image/panelIcons/telescoping.png')
              : require('@/assets/image/panelIcons/telescoping_1.png')
          "
          @click="leftContentShow"
        />
        <ul class="leftMenu-item">
          <li>力量编成</li>
        </ul>
        <div class="LLBC">
          <ul class="topBtn-box" v-if="vueData.showEdit">
            <li class="top-btn">编成编组</li>
            <li class="top-btn" @click="vueData.createCamp_visible = true">
              新增阵营
            </li>
            <!-- <el-button type="primary">保存</el-button>
        <el-button type="primary">另存为</el-button> -->
          </ul>
          <div class="BL-content-box">
            <el-scrollbar>
              <div
                class="LLBC-box"
                v-for="(item, index) in vueData.llbc"
                :key="index"
                :class="LLBC_color[item.name].color"
                v-show="
                  item.side == vueData.side ||
                  vueData.side == 'admin' ||
                  vueData.side == 'red_zhkz'
                "
              >
                <div class="LLBC-item">
                  <div style="height: 30px">
                    <img :src="LLBC_color[item.name].flag" />
                    <span style="font-size: 15px">{{ item.name }}</span>
                  </div>
                  <div class="utilsBTN_box">
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="添加兵力"
                      placement="bottom-start"
                    >
                      <img
                        style="cursor: pointer"
                        src="@/assets/images/rwty/addCGF.svg"
                        v-if="vueData.showEdit"
                        @click="showEquipNode(item)"
                      />
                    </el-tooltip>
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="添加指挥官"
                      placement="bottom-start"
                    >
                      <img
                        style="cursor: pointer"
                        src="@/assets/images/rwty/big-tj.svg"
                        v-if="vueData.showEdit"
                        @click="showCommandNode(item)"
                      />
                    </el-tooltip>
                    <el-tooltip
                      class="box-item"
                      effect="dark"
                      content="删除阵营"
                      placement="bottom-start"
                    >
                      <img
                        style="cursor: pointer"
                        src="@/assets/images/rwty/delete.svg"
                        v-if="vueData.showEdit"
                        @click="removeCamp(item)"
                      />
                    </el-tooltip>
                  </div>
                </div>
                <el-tree
                  :data="item.children"
                  :props="vueData.defaultProps"
                  :expand-on-click-node="false"
                  default-expand-all
                  @node-click="handleNodeClick"
                  @current-change="currentChange"
                >
                  <template #default="{ node, data }">
                    <div class="node-box">
                      <span class="node-label">{{ data.name }}</span>
                      <!-- <div class="iconBox" >
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="添加兵力"
                    placement="bottom-start"
                  >
                    <img
                      style="cursor: pointer; width: 20px; height: 20px"
                      src="@/assets/images/rwty/addCGF.svg"
                      v-if="data.nodeType == '指挥'"
                      @click="showEquipNode(data)"
                    />
                  </el-tooltip>
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="添加指挥官"
                    placement="bottom-start"
                  >
                    <img
                      src="@/assets/images/rwty/tj.svg"
                      v-if="data.nodeType == '指挥'"
                      @click="showCommandNode(data)"
                    />
                  </el-tooltip>
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="定位"
                    placement="bottom-start"
                  >
                    <img
                      v-if="data.nodeType == '兵力'"
                      src="@/assets/images/rwty/dw.svg"
                      @click="setPosition(data)"
                    />
                  </el-tooltip>
                  <el-tooltip
                    class="box-item"
                    effect="dark"
                    content="删除"
                    placement="bottom-start"
                  >
                    <img
                      src="@/assets/images/rwty/delete.svg"
                      @click="removeCamp(item)"
                    />
                  </el-tooltip>

                  <img
                      src="@/assets/images/rwty/bj.svg"
                      @click="showEquipNodeHeight(data, node)"
                    />
                </div> -->
                    </div>
                  </template>
                </el-tree>
              </div>
            </el-scrollbar>
          </div>
          <div
            style="text-align: right; margin-top: 15px"
            v-if="vueData.showSave"
          >
            <el-button type="primary">保存</el-button>
            <el-button type="primary">另存为</el-button>
          </div>
          <!-- 新增阵营弹窗 -->
          <div class="createCamp_box" v-if="vueData.createCamp_visible">
            <div class="header">
              <span>新增阵营</span>
              <el-icon
                style="cursor: pointer"
                @click="vueData.createCamp_visible = false"
              >
                <Close />
              </el-icon>
            </div>
            <ul class="content">
              <li>
                <span>阵营：</span>
                <el-select v-model="vueData.campValue">
                  <el-option
                    v-for="(item, index) in vueData.campList"
                    :key="item.value"
                    :label="item.label"
                    :value="index"
                  />
                </el-select>
              </li>
              <li>
                <el-button type="primary" @click="createCamp">确定</el-button>
                <el-button @click="vueData.createCamp_visible = false">
                  取消
                </el-button>
              </li>
            </ul>
          </div>
          <!-- <modelZHG
        v-if="vueData.showCommandNodePanel"
        @closePanel="closePanel"
      ></modelZHG>
      <modelTemplate
        v-if="vueData.showEquiNodePanel"
        @closePanel="closePanel"
      ></modelTemplate>
      <changeHeight
        v-if="vueData.showEquiNodePanelH"
        :node="vueData.node"
        @closePanelH="closePanelH"
      ></changeHeight>
      <powerProgramme
        v-if="vueData.addBL"
        @closePowerBox="vueData.addBL = false"
      ></powerProgramme> -->
          <BLConfig
            :selectItem="vueData.selectItem"
            :node="vueData.node"
            v-if="vueData.llbcShow"
            @closePanels="closeBLConfig"
          ></BLConfig>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup>
import BLConfig from '../../BLConfig/BLConfig.vue'
import { useStore } from 'vuex'
import { reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import { LLBC_color, showList } from '@/utils/LLBC_Utils.js' //LLBC配置
import { getLeftForceResult } from '@/service/SSE.js'
// import { children } from 'cesium'
// import modelTemplate from '@/components/leftMenu/components/LLBC/modelTemplate.vue' //装备模型
// import modelZHG from '@/components/leftMenu/components/LLBC/modelZHG.vue' //ZHG
// import changeHeight from '@/components/leftMenu/components/LLBC/changeHeight.vue' //修改高度窗口
// import powerProgramme from '../dispatchingPlan/components/powerProgramme.vue' //新增BL窗口
// import { uuid } from '@/utils/utils.js'
const store = useStore()
const props = defineProps({})
let vueData = reactive({
  redData: [
    {
      label: '智慧所1',
      children: [
        {
          label: '冰粒1-1',
          children: []
        },
        {
          label: '冰粒1-2',
          children: []
        },
        {
          label: '冰粒1-3',
          children: []
        },
        {
          label: '冰粒1-4',
          children: []
        }
      ]
    },
    {
      label: '智慧所2',
      children: [
        {
          label: '冰粒2-1',
          children: []
        },
        {
          label: '冰粒2-2',
          children: []
        },
        {
          label: '冰粒2-3',
          children: []
        },
        {
          label: '冰粒2-4',
          children: []
        }
      ]
    },
    {
      label: '智慧所3',
      children: [
        {
          label: '冰粒3-1',
          children: []
        },
        {
          label: '冰粒3-2',
          children: []
        },
        {
          label: '冰粒3-3',
          children: []
        },
        {
          label: '冰粒3-4',
          children: []
        }
      ]
    }
  ],
  blueData: [
    {
      label: '智慧所1',
      children: [
        {
          label: '冰粒1-1',
          children: []
        },
        {
          label: '冰粒1-2',
          children: []
        },
        {
          label: '冰粒1-3',
          children: []
        },
        {
          label: '冰粒1-4',
          children: []
        }
      ]
    },
    {
      label: '智慧所2',
      children: [
        {
          label: '冰粒2-1',
          children: []
        },
        {
          label: '冰粒2-2',
          children: []
        },
        {
          label: '冰粒2-3',
          children: []
        },
        {
          label: '冰粒2-4',
          children: []
        }
      ]
    },
    {
      label: '智慧所3',
      children: [
        {
          label: '冰粒3-1',
          children: []
        },
        {
          label: '冰粒3-2',
          children: []
        },
        {
          label: '冰粒3-3',
          children: []
        },
        {
          label: '冰粒3-4',
          children: []
        }
      ]
    }
  ],
  defaultProps: {
    children: 'children',
    label: 'name'
  },
  llbc: [
    {
      name: '红方',
      side: 'red',
      children: [
        {
          name: '红方力量',
          children: []
        }
      ]
    },
    {
      name: '蓝方',
      side: 'blue',
      children: [
        {
          name: '蓝方力量',
          children: []
        }
      ]
    }
  ],
  llbcShow: false,
  selectItem: null, //选中的节点数据
  showEquiNodePanel: false,
  showEquiNodePanelH: false,
  leftShow: true, // 左侧伸缩关闭按钮

  showCommandNodePanel: false, //指挥面板
  node: {
    data: {
      position: {
        z: 0
      }
    }
  },
  showEdit: false, //topBar显隐
  addBL: false,
  showSave: false,
  createCamp_visible: false,
  campValue: '',
  campList: PIESIM.AreaAscriptions,
  side: ''
  // datamodel: new PIESIM.CGFDataModel(),
})
const handleNodeClick = (data, node) => {
  console.log(data)
  console.log(node)
  // vueData.selectItem = data
  // vueData.node = node
  // vueData.llbcShow = true
}
const currentChange = (data, node) => {
  // console.log("data", data);
  // console.log("node", node);
}
const closeBLConfig = () => {
  vueData.llbcShow = false
}
//添加指挥面板
const showCommandNode = (data) => {
  console.log('showCommand')
  let seatType = sessionStorage.getItem('roleName')
  if (seatType == '想定编辑席') {
    vueData.showCommandNodePanel = true
    vueData.addBL = false
    store.dispatch('set_CGF_data', data)
  } else {
    vueData.showCommandNodePanel = false
    vueData.addBL = true
  }
}

// 控制伸缩按钮
const leftContentShow = () => {
  vueData.leftShow = !vueData.leftShow
}
const showEquipNode = (data) => {
  console.log('showEquip', data)

  let seatType = sessionStorage.getItem('roleName')
  if (seatType == '想定编辑席') {
    vueData.showEquiNodePanel = true
    vueData.addBL = false
    store.dispatch('set_CGF_data', data)
  } else {
    vueData.showEquiNodePanel = false
    vueData.addBL = true
  }
}
const closePanel = (val) => {
  vueData.showEquiNodePanel = val
  vueData.showCommandNodePanel = val
}
const showEquipNodeHeight = (data, node) => {
  // vueData.node = node
  console.log('data', data)
  console.log('node', node)
  vueData.showEquiNodePanelH = true
}
const closePanelH = (val) => {
  vueData.showEquiNodePanelH = val
  store.state.missionRehearsal.llbcShow = false
}

/**
 * @description 设置位置
 * @param { Object } data 选中的实体数据
 */
const setPosition = (data) => {
  viewer.camera.flyTo({
    destination: MEarth.Cartesian3.fromDegrees(
      data.position.x,
      data.position.y,
      5000.0
    )
  })
}

/**
 * @description 新建阵营
 */
let createCamp = () => {
  var pRootCGFEntity = new PIESIM.CGFEntity(
    null,
    PIESIM.NodeUnit.NodeType.NodeGroup
  )
  pRootCGFEntity.setName(vueData.campList[vueData.campValue].label)
  pRootCGFEntity.setSide(vueData.campList[vueData.campValue].value)
  pRootCGFEntity.setId(uuid())
  // vueData.datamodel.vecNodes.push(pRootCGFEntity);
  store.commit('PUSH_LLBCNODE', pRootCGFEntity)
  vueData.createCamp_visible = false
}

/**
 * @description 删除阵营
 * @param { Object } data 阵营数据
 */
let removeCamp = (data) => {
  // vueData.datamodel.vecNodes = vueData.datamodel.vecNodes.filter((item) => {
  //   return item != data;
  // });
  let llbcNode = store.getters.get_llbcNode.filter((item) => {
    return item != data
  })
  store.commit('SET_LLBCNODE', llbcNode)
}
onMounted(() => {
  //获取兵力的数据
  getLeftForceResult().then((res) => {
    let redValue = res.red.sideTypeJson
    let blueValue = res.blue.sideTypeJson
    vueData.llbc[0].children[0].children = redValue.children
    vueData.llbc[1].children[0].children = blueValue.children
  })
  vueData.side = window.localStorage.getItem('side')
  // console.log(store.getters.get_llbcNode)
  // let seatType = sessionStorage.getItem("roleName");
  // vueData.showEdit = showList[seatType].showEdit;
  // vueData.showSave = showList[seatType].showSave;
  // console.log(store.state.missionRehearsal.dataModelNode);
})
</script>
<style lang="less" scoped>
.left-shrink {
  position: fixed;
  top: calc(50% - 31.5px);
  left: 0;
  // transform: translate(0, -50%);
  // z-index: 2;
  cursor: pointer;
  width: 20px;
  font-size: 36px !important;
}
.menuPanel {
  border-width: 0px;
  // z-index: 3;
  position: fixed;
  left: 0px;
  top: 10%;
  width: 400px;
  height: 810px;
  // max-height: 810px;
  // background-image: url(@/assets/images/rwty/background.svg);
  // background-size: 100% 100%;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  .content-img {
    position: absolute;
    //  right: 0;
    // top: -10px;
    right: -5%;
    top: calc(50% - 31.5px);
    z-index: 2;
    cursor: pointer;
    font-size: 36px !important;
  }
  .leftMenu-item {
    font-size: 20px;
    list-style: none;
    text-align: left;
    margin: 0;
    padding: 0 0 0 20px;
    height: 50px;
    line-height: 50px;
    color: #ffffff;
    cursor: pointer;
    border-bottom: 1px solid #0b3855;
  }
  .LLBC {
    // height: calc(100% - 37.59px);
    padding: 10px 15px;
    box-sizing: content-box;
    position: fixed;
    width: 360px;

    .BL-content-box {
      height: calc(720px);
    }

    .topBtn-box {
      align-items: center;
      display: flex;
      justify-content: end;
      padding-bottom: 15px;

      .top-btn {
        background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
        width: 83px;
        height: 33px;
        color: #ffff;
        border-radius: 5px;
        margin-left: 10px;
        line-height: 33px;
        cursor: pointer;
      }
    }

    .node-box {
      display: flex;
      justify-content: space-between;
      align-items: center;
      width: 100%;
      height: 100%;

      .iconBox {
        /* width: 30%; */
        padding: 0 2px;
        display: flex;
        justify-content: space-around;
        align-items: center;
      }
    }

    .LLBC-box {
      padding: 10px;
      box-sizing: content-box;
      margin-bottom: 15px;
      width: 35vh;

      .LLBC-item {
        text-align: left;
        font-family: 'Arial Normal', 'Arial';
        font-weight: 400;
        font-style: normal;
        color: #ffffff;
        display: flex;
        justify-content: space-between;
        align-items: center;
        .utilsBTN_box {
          img {
            width: 26px;
          }
        }
        span {
          padding: 0 5px;
        }
      }

      :deep(.el-tree) {
        background: transparent;
        font-family: 'Arial Normal', 'Arial';
        font-weight: 700;
        font-style: normal;
        font-size: 13px;
        letter-spacing: normal;
        color: #ffffff;
      }
    }

    .LLBC-red {
      background-color: rgba(65, 27, 42, 1);
      border: 1px solid rgba(200, 8, 13, 1);
      :deep(.el-tree) {
        .el-tree-node__content:hover {
          background-color: rgba(161, 45, 45, 0.2);
        }

        .el-tree-node:focus > .el-tree-node__content {
          background-color: rgba(200, 8, 13, 0.8);
        }
      }
    }

    .LLBC-blue {
      background-color: rgba(16, 55, 91, 1);
      border: 1px solid rgba(9, 110, 180, 1);
      :deep(.el-tree) {
        .el-tree-node__content:hover {
          background-color: rgba(8, 165, 239, 0.2);
        }

        .el-tree-node:focus > .el-tree-node__content {
          background-color: rgba(9, 110, 180, 1);
        }
      }
    }

    .LLBC-green {
      background-color: rgb(0, 63, 5);
      border: 1px solid rgb(9, 180, 9);
      :deep(.el-tree) {
        .el-tree-node__content:hover {
          background-color: rgba(62, 239, 8, 0.2);
        }

        .el-tree-node:focus > .el-tree-node__content {
          background-color: rgb(23, 180, 9);
        }
      }
    }

    .LLBC-orange {
      background-color: rgb(91, 65, 16);
      border: 1px solid rgb(180, 120, 9);
      :deep(.el-tree) {
        .el-tree-node__content:hover {
          background-color: rgba(239, 177, 8, 0.2);
        }

        .el-tree-node:focus > .el-tree-node__content {
          background-color: rgb(180, 134, 9);
        }
      }
    }

    .LLBC-yellow {
      background-color: rgb(69, 91, 16);
      border: 1px solid rgb(163, 180, 9);
      :deep(.el-tree) {
        .el-tree-node__content:hover {
          background-color: rgba(197, 239, 8, 0.2);
        }

        .el-tree-node:focus > .el-tree-node__content {
          background-color: rgb(154, 180, 9);
        }
      }
    }

    .LLBC-purple {
      background-color: rgb(48, 5, 59);
      border: 1px solid rgb(146, 9, 180);
      :deep(.el-tree) {
        .el-tree-node__content:hover {
          background-color: rgba(200, 8, 239, 0.2);
        }

        .el-tree-node:focus > .el-tree-node__content {
          background-color: rgb(180, 9, 180);
        }
      }
    }

    .createCamp_box {
      position: fixed;
      left: 50%;
      top: 50%;
      width: 300px;
      height: 160px;
      margin-left: -150px;
      margin-top: -150px;
      background-color: rgba(8, 36, 62, 0.7);
      .header {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 10px;
        border-bottom: 1px solid #0b3855;
      }
      .content {
        height: calc(100% - 64px);
        padding: 10px;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: space-between;
      }
    }
  }
}
</style>
