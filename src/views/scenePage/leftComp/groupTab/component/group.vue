<template>
  <div class="task-group">
    <div class="leftMenu-item">
      <el-button type="text" style="color: aliceblue" @click="clusterToPoint">
        聚合
      </el-button>
      <el-button type="text" style="color: aliceblue" @click="distributeGroup">
        分离
      </el-button>
    </div>
    <el-tree class="synthesizeDQTree" ref="treeRefXdj" :data="state.treeData" node-key="id"
      :props="state.defaultProps" default-expand-all :default-checked-keys="state.checkeys" @check-change="handleCheck"
      @node-click="handleNodeClick">
      <template v-slot="{ data }">
        <div v-if="data.level == '1'">
          <span>{{ data.nodeName }}</span>
        </div>
        <div v-else-if="data.nodeType == 'group'">
          <span>{{ data.nodeName }}</span>
          <el-icon style="margin-left: 30px" @click.stop="flyToGroup(data)" title="编组">
            <Location />
          </el-icon>
          <el-icon style="margin-left: 4px" title="详情">
            <Compass />
          </el-icon>
        </div>
        <div v-else>
          <img v-if="data.icon2dFileUrl" :src="data.icon2dFileUrl" alt="" class="equip-icon" />
          <span>{{ data.nodeName }}</span>
          <el-icon @click.stop="showRightBtn(data)" title="配置" style="margin-left: 30px">
            <Setting />
          </el-icon>
        </div>
      </template>
    </el-tree>
    <div class="groupDT-container" v-show="state.groupDTShow">
      <div class="groupDT-title">编组导调位置</div>
      <div>
        <li>
          <span>经度：</span>
          <el-input-number v-model="dtData.lng" size="small" controls-position="right" />
        </li>
        <li>
          <span>纬度：</span>
          <el-input-number v-model="dtData.lat" size="small" controls-position="right" />
        </li>
        <li>
          <span>高度：</span>
          <el-input-number v-model="dtData.alt" size="small" controls-position="right" />
        </li>
      </div>
      <div class="groupDT-click">
        <el-button size="small" type="primary" style="color: aliceblue" @click="groupDTclose">
          取消
        </el-button>
        <el-button size="small" type="primary" style="color: aliceblue" @click="groupDT">
          确定
        </el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import store from '@/store/index'
import {
  ref,
  reactive,
  onMounted,
  nextTick,
  onBeforeMount,
  computed,
  watch
} from 'vue'

import { ElMessage, ElNotification } from 'element-plus'

import { setPlateformStatus, setPlatformAttack } from '@/service/afsim/index'
import { groupConfigTree } from '@/service/tree/groupConfigTree'
import emitter from '@/utils/eventbus'

const props = defineProps({
  side: {
    type: String,
    required: true
  }
})

const state = reactive({
  defaultProps: {
    label: 'nodeName',
    id: 'id',
    children: 'child'
  },
  checkeys: [],
  isShowFlyLine: false, //是否显示航线
  isShowGroupGzLine: false, //是否显示当前编组的感知包络线
  isShowGroupZzLine: false, //是否显示当前编组的作战包络线
  isShowPlateGzLine: false, //显示当前平台的感知包络线
  isShowPlateZzLine: false, //显示当前平台的作战包络线
  isShowPlateGRLine: false, //显示当前平台的干扰包络
  treeData: [],
  targetTaskType: {
    sky: [],
    sea: [],
    land: []
  },
  obj: {
    x: 365,
    y: 142,
    show: false
  },
  clusterPointArr: [],
  clusterPointId: '',
  groupDTShow: false,
  groupData: {}
})
const dtData = reactive({
  lng: 129,
  lat: 37,
  alt: 5000
})

const groupDTclose = () => {
  state.groupDTShow = !state.groupDTShow
}
const groupDT = () => {
  toPositionFun()
}
onBeforeMount(() => { })
onMounted(() => {
  getTaskGroup()
})

// 聚合
const clusterToPoint = () => {
  let cbg = new window.EarthPlugn.ClusterByGroup(
    window.MSIMEarth,
    window.EarthViewer
  )

  for (let i = 0; i < state.treeData.length; i++) {
    if (!state.treeData[i].child) continue
    state.treeData[i].child.forEach((e) => {
      // 仅对编组节点进行聚合
      if (e.nodeType !== 'group' || !e.child) return
      let clusterArr = []
      let clusterId = ''
      for (let j = 0; j < e.child.length; j++) {
        clusterArr.push(e.child[j].id)
        clusterId = e.nodeName
      }
      if (clusterArr.length === 0) return //编组内无目标 不需要聚合

      cbg.createClusterByGroup(clusterArr, clusterId)
    })
  }
}

// 分散
const distributeGroup = () => {
  let cbg = new window.EarthPlugn.ClusterByGroup(
    window.MSIMEarth,
    window.EarthViewer
  )
  let clusterArr = []
  let clusterId = ''

  for (let i = 0; i < state.treeData.length; i++) {
    if (!state.treeData[i].child) continue
    state.treeData[i].child.forEach((e) => {
      if (e.nodeType !== 'group' || !e.child) return
      for (let j = 0; j < e.child.length; j++) {
        clusterArr.push(e.child[j].id)
        clusterId = e.nodeName
      }
      cbg.removeCluster(clusterArr, clusterId)
      clusterArr = []
      clusterId = ''
    })
  }
}
// 获取编组列表
const getTaskGroup = () => {
  let data = JSON.parse(window.localStorage.getItem('currentSceneInfo'))
  if (!data) {
    return ElMessage.error('未获取到场景信息，请先选择场景！')
  }
  let params = {
    side: props.side,
    scenarioId: data.scenarioId
  }
  groupConfigTree(params).then((res) => {
    if (res.code == 200) {
      state.treeData = res.data || []
    } else {
      console.log('获取编组列表失败')
    }
  })
}
//定位编组
const flyToGroup = (data) => {
  let EF = new window.EarthPlugn.EffectByTurf(
    window.MSIMEarth,
    window.EarthViewer
  )
  let targetsIdArr = []
  if (data.child) {
    data.child.forEach((e) => {
      targetsIdArr.push(e.id)
    })
  }
  let options = {
    entityId: targetsIdArr[0],
    czmlSource: 'MSIMEarthCZMLProcessContainer',
    type: 'group',
    group: data.nodeName,
    msg: data.task
  }
  // 判断是否已经存储在taskGroupChecked中
  if (store.state.sceneModule.taskGroupChecked.includes(data.id)) {
    // 已经存在则此次操作为清除编组缓冲和弹窗
    window.sceneAction.popUp.cancleStyleEffect(options)
    EF.removeGroupCircleByTurf(targetsIdArr)
    const index = store.state.sceneModule.taskGroupChecked.indexOf(data.id)
    if (index > -1) {
      store.state.sceneModule.taskGroupChecked.splice(index, 1)
    }
  } else {
    //显示编组缓冲和弹窗并飞行定位到编组目标
    if (targetsIdArr.length > 0) {
      EF.createGroupCircleByTurf(targetsIdArr, window.MSIMEarth.Color.RED, 100)
      window.sceneAction.popUp.setStyleEffect(options)
      if (options.entityId) {
        let entity = window.EarthPlugn.entity._GetCZMLEntity(
          options.entityId,
          'MSIMEarthCZMLProcessContainer'
        )
        if (entity) {
          window.EarthViewer.flyTo(entity, {
            duration: 1.5,
            offset: new window.MSIMEarth.HeadingPitchRange(
              0,
              window.MSIMEarth.Math.toRadians(-90),
              60000
            )
          })
        } else {
          ElMessage.warning('未获取到待定位实体')
          console.log('未获取到待定位实体')
        }
      }
    } else {
      console.log('编组集合为空', targetsIdArr)
    }
    store.state.sceneModule.taskGroupChecked.push(data.id)
  }
}

const handleCheck = (data, checked, indeterminate) => {
  return
}

const handleNodeClick = (data, node, self) => {
  console.log('click node', data)
  if (data.id) {
    let entity = window.EarthPlugn.entity._GetCZMLEntity(
      data.platformName,
      'MSIMEarthCZMLProcessContainer'
    )
    if (entity) {
      window.EarthViewer.flyTo(entity, {
        duration: 1.5,
        offset: new window.MSIMEarth.HeadingPitchRange(
          0,
          window.MSIMEarth.Math.toRadians(-90),
          60000
        )
      })
    } else {
      ElMessage.warning('未获取到待定位实体')
      console.log('为获取到待定位实体')
    }
  }
}

// 显示右键功能
const showRightBtn = (data) => {
  if (data.id) {
    store.commit('setCurrentFlyType', {
      name: data.id,
      entityId: data.id,
      chineseName: data.nodeName
    })

    store.getters.getCurrentNode.code = data.id
  }
  // 1、打开详情快捷菜单
  // 2、再次点击就关闭
  state.obj.show = !state.obj.show
  let radarEntity = window.EarthPlugn.entity._GetCZMLEntity(
    data.id,
    'MSIMEarthCZMLProcessContainer'
  )
  let currentTime = window.EarthViewer.clock.currentTime
  let curposition = radarEntity.position.getValue(currentTime)

  // console.log('世界坐标:'+ curposition)
  // 获取Cesium的Scene实例
  const scene = window.EarthViewer.scene
  let position = window.MSIMEarth.SceneTransforms.wgs84ToWindowCoordinates(
    scene,
    curposition
  )
  // console.log('屏幕坐标：' + position)
  state.obj.x = Number(position.x) + 5
  state.obj.y = Number(position.y) + 5
  emitter.emit('showViewContextMenu', state.obj)
}

const toPositionFun = () => {
  if (!state.groupData.child) return
  for (const child of state.groupData.child) {
    let params = {
      platform: child.id,
      setPosition: `{"lon":"${dtData.lng}","lat":"${dtData.lat}","alt":"${dtData.alt}"}`
    }
    setPlateformStatus(params).then((res) => {
      const parsedData = JSON.parse(res.data)
      if (parsedData.status == 'success') {
        window.EarthViewer._container.style.cursor = 'default'
        beautyToast.success({
          title: '导调指令',
          message: '移动平台到指定位置指令已发出!',
          darkTheme: true
        })
        groupDTclose()
      }
    })
  }
}

watch(
  () => store.state.sceneModule.toolBarType,
  (newVal, oldVal) => {
    state.obj.show = newVal
  },
  { deep: true }
)

</script>

<style lang="less" scoped>
.task-group {
  height: 100%;
  width: 100%;
  z-index: 1;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: center;

  .leftMenu-item {
    color: var(--text-primary);
    cursor: pointer;
    position: absolute;
    top: 16px;
    right: 45px;
  }

  .el-tree {
    font-size: 15px;
    // margin-top: 20px;
    height: 100% !important;
    width: 100%;
    background: transparent;
    color: var(--text-highlight);
    overflow-y: auto;
    box-sizing: border-box;

    // padding-left: 8%;
    .custom-icon {
      width: 17px;
      height: 17px;
      padding-right: 6px;
    }

    .equip-icon {
      width: 17px;
      height: 17px;
      padding-right: 6px;
      vertical-align: middle;
    }

    .lineStyle {
      width: 50px;
      height: 3px;
      display: inline-block;
      margin-bottom: 9px;
    }

    .descriptionContent {
      // 超出部分用省略号表示
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 148px;
      margin-left: 10px;
    }

    div {
      color: rgba(0, 241, 255, 1);
    }
  }

  .buttonTitle {
    width: 100%;
    text-align: left;
    font-size: 16px;
    font-weight: 500;
    color: var(--title-color);
  }

  .checkedOption {
    padding: 5px;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
  }

  .groupDT-container {
    position: absolute;
    top: 10px;
    left: 424px;
    width: 258px;
    height: 187px;
    z-index: 1;
    background: var(--panel-bg-deep);
    box-shadow: var(--box-shadow-glow);
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    align-items: center;
    color: aliceblue;

    .groupDT-title {
      margin-right: 91px;
      font-size: 15px;
    }

    .groupDT-click {
      margin-right: -130px;
    }
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
          color: var(--text-primary);
        }
      }
    }
  }

  /*滚动条高宽度*/
  ::-webkit-scrollbar {
    width: 2px;
    height: 2px;
  }

  /*滚动条滑块*/
  ::-webkit-scrollbar-thumb {
    border-radius: 3px;
    box-shadow: inset 0 0 5px rgba(50, 4, 212, 0.2);
    background: rgba(3, 94, 231, 0.7);
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

:deep [data-key='relationImg'] {
  .el-checkbox {
    display: none;
  }
}

:deep .el-radio__inner {
  background-color: var(--primary-color-half);
  border: 1px solid var(--primary-color);
}

:deep .el-radio {
  color: var(--primary-color);
}

:deep .el-checkbox {
  color: var(--primary-color) !important;
}

:deep .el-checkbox__inner {
  background-color: var(--primary-color-half);
  border: 1px solid var(--primary-color);
  // border-radius: 50%;
  color: var(--primary-color);
}

:deep .el-checkbox__input.is-checked .el-checkbox__inner {
  background-color: var(--primary-color-half);
  color: var(--primary-color-full);
}

:deep .el-checkbox__input.is-disabled .el-checkbox__inner {
  background-color: var(--primary-color-half);
  color: var(--primary-color-full);
  border-color: var(--primary-color-full);
}

:deep .el-checkbox__input.is-disabled {
  background-color: var(--primary-color-half);
  color: var(--primary-color-full);
}

:deep .el-tree-node {
  margin-top: 10px;
}


:deep .el-tree-node__content:hover,
.el-upload-list__item:hover {
  background-color: var(--primary-color-half);
}

:deep .el-tree-node .is-current>.el-tree-node__content {
  background-color: var(--primary-color-half);
}

:deep .el-tree-node:focus>.el-tree-node__content {
  background-color: var(--primary-color-half);
}

:deep el-tree-node__expand-icon el-icon-caret-right:before {
  color: var(--primary-color-full);
}

:deep .el-checkbox .el-checkbox__inner {
  display: none;
}

:deep .is-leaf+.el-checkbox .el-checkbox__inner {
  display: inline-block;
}

:deep .el-icon {
  margin-left: 14px;
  vertical-align: middle;
}
</style>
