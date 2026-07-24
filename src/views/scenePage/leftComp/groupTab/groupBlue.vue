<!--
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2026-07-09 13:22:31
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2026-07-09 13:23:12
 * @FilePath: \MSIMEarthSystem\src\views\scenePage\leftComp\groupTab\groupBlue.vue
 * @Description: 蓝方编组
-->
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
    <el-tree class="synthesizeDQTree" ref="treeRefXdj" :data="state.treeData" node-key="code"
      :props="state.defaultProps" default-expand-all :default-checked-keys="state.checkeys" @check-change="handleCheck"
      @node-click="handleNodeClick">
      <template v-slot="{ data }">
        <div v-if="data.level == '1'">
          <span>{{ data.groupName }}</span>
        </div>
        <div v-else-if="data.level == '2'">
          <span>{{ data.groupName }}</span>
          <el-icon style="margin-left: 30px" @click.stop="flyToGroup(data, index)" title="编组">
            <Location />
          </el-icon>
          <el-icon style="margin-left: 4px" title="详情">
            <Compass />
          </el-icon>
        </div>
        <div v-else>
          <span>{{ data.nameCn }}</span>
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
import {
  changeDetailPanelContent,
  detailedSignageCheckChange,
  entityFrustumChange,
  entityJAMChange,
  firepowerRadiusChange,
  commChina
} from '@/views/toolbar/layerList/hooks/showHideConfig'
import { ElMessage, ElNotification } from 'element-plus'
import {
  getGroupInfo,
  getBattalionInfo,
  getCompanyInfo,
  getInfoTree,
  getAllEntityInfo,
  getPlatStatusGroupTreeBySide
} from '@/service/SSE'
import { getPlateSWMessageV2 } from '@/service/command'
const state = reactive({
  defaultProps: {
    label: 'name2',
    id: 'code',
    children: 'childList'
  },
  checkeys: [
    'skyTargetLng',
    'skyTargetLat',
    'skyTargetHeight',
    'skyTargetTask',
    'seaTargetLng',
    'seaTargetLat',
    'seaTargetHeight',
    'seaTargetTask'
  ],
  isShowFlyLine: false, //是否显示航线
  isShowGroupGzLine: false, //是否显示当前编组的感知包络线
  isShowGroupZzLine: false, //是否显示当前编组的作战包络线
  isShowPlateGzLine: false, //显示当前平台的感知包络线
  isShowPlateZzLine: false, //显示当前平台的作战包络线
  isShowPlateGRLine: false, //显示当前平台的干扰包络
  treeData: [
    {
      code: 'relationImg',
      name: '海军编组',
      disabled: true,
      clickable: false,
      childList: []
    },
    {
      code: 'relationImg',
      name: '陆军编组',
      disabled: true,
      clickable: false,
      childList: []
    },
    {
      code: 'relationImg',
      name: '空军编组',
      disabled: true,
      clickable: false,
      childList: []
    },
    {
      code: 'relationImg',
      name: '天军编组',
      disabled: true,
      clickable: false,
      childList: []
    },
    {
      code: 'relationImg',
      name: '其他编组',
      disabled: true,
      clickable: false,
      childList: []
    }
  ],
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
const loading = ref(false) // 控制加载状态的变量
// 定义一个方法来获取数据
const fetchData = async () => {
  loading.value = true // 开始加载
  try {
    const battalion = await getBattalionInfo()

    getCompanyInfo().then((company) => {
      if (battalion.code === 200) {
        console.log('company', company, battalion)
        let navyData = [] //海军数据
        let armyData = [] //陆军数据
        let airForceData = [] //空军数据
        let outerSpaceOperationsForceData = [] //天军数据
        let others = [] //其他军种
        let value = battalion.data
        if (value.length > 0) {
          value.forEach((element) => {
            if (element.side !== 'blue') return
            let targetCompany
            company.data.forEach((company) => {
              if (company.name === element.name) {
                targetCompany = company
              }
            })

            if (typeof targetCompany !== 'undefined') {
              targetCompany.childs.forEach((child) => {
                child.id = child.name
                let childNameArr = child.name.split('_')
                child.chineseName = getChineseNameByType(
                  targetCompany,
                  childNameArr
                )
              })
              element.childList = targetCompany.childs
              element.chineseName = targetCompany.chineseName
            }
            console.log('ele', element, element.name)
            //0:海；1：陆；2：空；4：太空
            if (element.groupType == 0) {
              element.code = 'seaScoutTask' + element.code
            } else if (element.groupType == 1) {
              element.code = 'landScoutTask' + element.code
            } else if (element.groupType == 2 || element.groupType == 4) {
              element.code = 'skyScoutTask' + element.code
            }
            if (element.childList && element.childList.length > 0) {
              element.childList.forEach((item) => {
                item.name = item.labelName
                item.code = 'taskEntiy-' + item.code
                item['entityId'] = item.entityName
              })
            }
            switch (element.groupType) {
              case 0:
                navyData.push(element)
                break
              case 1:
                armyData.push(element)
                break
              case 2:
                airForceData.push(element)
                break
              case 3:
                outerSpaceOperationsForceData.push(element)
                break
              default:
                others.push(element)
                break
            }
          })
        }
        state.treeData[0].childList = navyData
        state.treeData[1].childList = armyData
        state.treeData[2].childList = airForceData
        state.treeData[3].childList = outerSpaceOperationsForceData
        state.treeData[4].childList = others
      }
    })

    // const response2 = await getCompanyInfo()

    // treeData.value = response.data; // 假设后端返回的数据直接适用于el-tree
  } catch (error) {
    console.error('获取数据失败:', error)
  } finally {
    loading.value = false // 结束加载
  }
}

// 根据父节点编制类型匹配子节点中文名称
const getChineseNameByType = (targetCompany, childNameArr) => {
  let chineseName = ''
  if (targetCompany.chineseName.indexOf('营') > -1) {
    chineseName =
      targetCompany.chineseName +
      '_' +
      childNameArr[childNameArr.length - 1] +
      '连'
  } else if (targetCompany.chineseName.indexOf('雷达站') > -1) {
    chineseName =
      targetCompany.chineseName + '_' + childNameArr[childNameArr.length - 1]
  } else if (targetCompany.chineseName.indexOf('机编队') > -1) {
    chineseName =
      targetCompany.chineseName +
      '_' +
      childNameArr[childNameArr.length - 1] +
      '队'
  }

  return chineseName
}
// 编组导调位置
const groupDT = () => {
  toPositionFun()
}
const groupDTclose = () => {
  state.groupDTShow = !state.groupDTShow
}
// fetchData()
onBeforeMount(() => {
  getTaskGroup()
})
// onMounted(async () => {
//   await fetchData()
// })

// 聚合
const clusterToPoint = () => {
  let cbg = new window.EarthPlugn.ClusterByGroup(
    window.MSIMEarth,
    window.EarthViewer
  )

  for (let i = 0; i < state.treeData.length; i++) {
    state.treeData[i].childList.forEach((e) => {
      // console.log(e)
      let clusterArr = []
      let clusterId = ''
      if (e.childList) {
        for (let j = 0; j < e.childList.length; j++) {
          clusterArr.push(e.childList[j].code)
          clusterId = e.groupName
        }
        // console.log(clusterArr,clusterId)
        if (clusterArr.length === 0) return //编组内无目标 不需要聚合

        cbg.createClusterByGroup(clusterArr, clusterId)
        // clusterArr = []
        // clusterId = ''
      }
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
    state.treeData[i].childList.forEach((e) => {
      if (e.childList || !clusterArr) {
        for (let j = 0; j < e.childList.length; j++) {
          clusterArr.push(e.childList[j].code)
          clusterId = e.groupName
        }
        cbg.removeCluster(clusterArr, clusterId)
        clusterArr = []
        clusterId = ''
      }
    })
  }
}

// 获取编组列表
const getTaskGroup = () => {
  let data = JSON.parse(window.localStorage.getItem('currentSceneInfo'))
  let params = {
    side: 'blue',
    // scenarioId: '1862683600315482118'
    scenarioId: data.scenarioId
  }
  // getAllEntityInfo(params).then((res) => {
  getPlatStatusGroupTreeBySide(params).then((res) => {
    if (res.code == 200) {
      state.treeData = res.data
      // for (let i = 0; i < res.data.length; i++) {
      //   state.treeData[i] = res.data[i]
      // }
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
  data.childList.forEach((e) => {
    targetsIdArr.push(e.code)
    // e.childs.forEach((c) => {
    //   targetsIdArr.push(c.name)
    // })
  })
  let options = {
    entityId: targetsIdArr[0],
    czmlSource: 'MSIMEarthCZMLProcessContainer',
    type: 'group',
    group: data.groupName,
    msg: data.groupDescribe
  }
  // 判断是否已经存储在taskGroupChecked中
  if (store.state.sceneModule.taskGroupChecked.includes(data.code)) {
    // 已经存在则此次操作为清除编组缓冲和弹窗
    window.sceneAction.popUp.cancleStyleEffect(options)
    EF.removeGroupByTurf(targetsIdArr[0] + '_turf')
    const index = store.state.sceneModule.taskGroupChecked.indexOf(data.code)
    if (index > -1) {
      store.state.sceneModule.taskGroupChecked.splice(index, 1)
    }
  } else {
    //显示编组缓冲和弹窗并飞行定位到编组目标
    if (targetsIdArr.length > 0) {
      EF.createGroupByTurf(targetsIdArr, 'blue')
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
    store.state.sceneModule.taskGroupChecked.push(data.code)
  }
}
const handleCheck = (data, checked, indeterminate) => {
  return
  //判断是否为最子节点
  if (data.childList) return
  if (
    data.code.indexOf('seaTarget') > -1 ||
    data.code.indexOf('landTarget') > -1 ||
    data.code.indexOf('skyTarget') > -1
  ) {
    getTargetTaskTypeNode(data, checked) //敌关系图
    return
  }
  //我形式图
  if (
    data.code.indexOf('skyGoalType') > -1 ||
    data.code.indexOf('seaGoalType') > -1 ||
    data.code.indexOf('landGoalType') > -1
  ) {
    wxstAbility(data, checked)
  }
  // let entityId = data.entityId
  // //判断
  // if (!entityId) return
  // let entityObj = window.EarthPlugn.entity._GetCZMLEntity(
  //   entityId,
  //   'MSIMEarthCZMLProcessContainer'
  // )
  // if (!entityObj) {
  //   entityObj = EarthViewer.entities.getById(entityId)
  // }
  // if (checked) {
  //   if (entityObj) entityObj.show = true
  // } else {
  //   if (entityObj) entityObj.show = false
  // }
}
const handleNodeClick = (data, node, self) => {
  console.log('click node', data.code)
  if (data.code) {
    let entity = window.EarthPlugn.entity._GetCZMLEntity(
      data.code,
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
//存储选中的任务目标状态
const getTargetTaskTypeNode = (data, checked) => {
  let skyTargetType = state.targetTaskType['sky'],
    seaTargetType = state.targetTaskType['sea'],
    landTargetType = state.targetTaskType['land']
  if (data.code.indexOf('sky') > -1) {
    if (checked) {
      skyTargetType.push(data.code)
    } else {
      skyTargetType.splice(skyTargetType.indexOf(data.code), 1)
    }
  } else if (data.code.indexOf('sea') > -1) {
    if (checked) {
      seaTargetType.push(data.code)
    } else {
      seaTargetType.splice(seaTargetType.indexOf(data.code), 1)
    }
  } else if (data.code.indexOf('land') > -1) {
    if (checked) {
      landTargetType.push(data.code)
    } else {
      landTargetType.splice(landTargetType.indexOf(data.code), 1)
    }
  }
  let fightDQSynthesisPic = store.state.sceneModule.fightDQSynthesisPic
  fightDQSynthesisPic['sky'] = skyTargetType
  fightDQSynthesisPic['sea'] = seaTargetType
  fightDQSynthesisPic['land'] = landTargetType
  store.commit('setFightDQSynthesisPic', fightDQSynthesisPic)
  changeDetailPanelContent() //修改详标签要显示的字段
}
//获取D情关系图节点下数据
const getRelationData = async () => {
  await getCompanyInfo().then((companyRes) => {
    if (companyRes.code === 200) {
      store.state.sceneModule.companyInfo = companyRes.data
      console.log(store.state.sceneModule.companyInfo)
      getBattalionInfo().then((res) => {
        if (res.code == 200) {
          console.log(store.state.sceneModule.companyInfo)
          formatterRelationData(res.forces)
          store.state.sceneModule.BattalionData = res.forces
        }
      })
    }
  })
}
//将数据转成D情关系图节点下格式tree数据
const formatterRelationData = (value) => {
  let navyData = [] //海军数据
  let armyData = [] //陆军数据
  let airForceData = [] //空军数据
  let outerSpaceOperationsForceData = [] //天军数据
  let others = [] //其他军种
  if (value.length > 0) {
    value.forEach((element) => {
      // let targetCompany
      // store.state.sceneModule.companyInfo.forEach((company) => {
      //   if (company.name === element.name) {
      //     targetCompany = company
      //   }
      // });
      // // console.log('targetCompany', targetCompany);
      // if (typeof targetCompany !== 'undefined') {

      //   element.childList = targetCompany.childs
      // }
      // console.log('ele', element, element.name);
      //0:海；1：陆；2：空；4：太空
      if (element.groupType == 0) {
        element.code = 'seaScoutTask' + element.code
      } else if (element.groupType == 1) {
        element.code = 'landScoutTask' + element.code
      } else if (element.groupType == 2 || element.groupType == 4) {
        element.code = 'skyScoutTask' + element.code
      }
      if (element.childList && element.childList.length > 0) {
        element.childList.forEach((item) => {
          item.name = item.labelName
          item.code = 'taskEntiy-' + item.code
          item['entityId'] = item.entityName
        })
      }
      switch (element.groupType) {
        case 0:
          navyData.push(element)
          break
        case 1:
          armyData.push(element)
          break
        case 2:
          airForceData.push(element)
          break
        case 3:
          outerSpaceOperationsForceData.push(element)
          break
        default:
          others.push(element)
          break
      }
    })
    // res.childList = navyData
    // res.childList = armyData
    // res.childList = airForceData
    // res.childList = outerSpaceOperationsForceData
    // res.childList = others
  }

  return [
    navyData,
    armyData,
    airForceData,
    outerSpaceOperationsForceData,
    others
  ]
}
//显示或隐藏平台航线
const showFlyLine = (data) => {
  let dataController = new window.EarthPlugn.DataControl({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  if (data.id) {
    let curEntityId = data.id
    if (state.isShowFlyLine) {
      let positionData = store.state.sceneModule.planLineData[curEntityId]
      if (positionData && positionData.length > 0) {
        let color = [225, 82, 88, 1] //红方颜色
        if (store.getters.getCurrentNode.side == 'blue') {
          color = [57, 173, 209, 1]
        }
        let material = null
        material = new window.MSIMEarth.PolylineDashMaterialProperty({
          color: new window.MSIMEarth.Color(
            color[0] / 255,
            color[1] / 255,
            color[2] / 255,
            color[3]
          )
        })
        dataController.addPlanFlyLine(
          curEntityId,
          positionData,
          store.getters.getCurrentNode.side,
          material
        )
      }
    } else {
      if (window.EarthViewer.entities.getById(curEntityId + '-planLine')) {
        window.EarthViewer.entities.removeById(curEntityId + '-planLine')
      }
      if (window.EarthViewer.entities.getById(curEntityId + '-endPoint')) {
        window.EarthViewer.entities.removeById(curEntityId + '-endPoint')
      }
    }
  }
}
// 显示右键功能
const showRightBtn = (data) => {
  console.log(data)
  if (data.code) {
    store.commit('setCurrentFlyType', {
      name: data.code,
      entityId: data.code,
      chineseName: data.name
    })

    store.getters.getCurrentNode.code = data.code
    // console.log('当前节点:'+store.getters.getCurrentNode.code)
  }

  // 1、打开详情快捷菜单
  // 2、再次点击就关闭
  state.obj.show = !state.obj.show
  let radarEntity = window.EarthPlugn.entity._GetCZMLEntity(
    data.code,
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
  for (const child of state.groupData.childList) {
    let params = {
      platform: child.code,
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
        handleClose()
        // if (res.code == 200) {
        sendToCommandShowResMsg(
          res.data,
          '移动平台到指定位置指令完成',
          state.formData.sourceName
        )
        // }
      }
    })
  }
}
const handleClose_ = () => {
  emitter.emit('closeBottomControlPanel', 'left')
}
watch(
  () => store.state.sceneModule.toolBarType,
  (newVal, oldVal) => {
    state.obj.show = newVal
  },
  { deep: true }
)

//显示航线、详标签
const showFlyLineAndDes = (data) => {
  store.commit('setCurrentNode', { code: data.entityId, side: '', type: '' })
  state.isShowFlyLine = !state.isShowFlyLine
  showFlyLine(data)
  detailedSignageCheckChange(state.isShowFlyLine)
}
//是否显示当前点击编组的感知范围包络线
const showGzRangeLine = (data) => {
  state.isShowGroupGzLine = !state.isShowGroupGzLine
  let rangeConfigObj = {}
  getRangeByGroup(data).then((response) => {
    if (response instanceof Array) {
      response.forEach((element) => {
        Object.assign(rangeConfigObj, element)
      })
    }
    emitter.emit('showGroupPerceptionEnvelopeLine2', {
      side: 'red',
      type: 'perceptionRange',
      checked: state.isShowGroupGzLine,
      groupName: data.groupName,
      groupList: [data],
      groupRangeList: rangeConfigObj
    })
  })
}
//是否显示当前点击编组的作战范围包络线
const showZzRangeLine = (data) => {
  state.isShowGroupZzLine = !state.isShowGroupZzLine
  let rangeConfigObj = {}
  getRangeByGroup(data).then((response) => {
    if (response instanceof Array) {
      response.forEach((element) => {
        Object.assign(rangeConfigObj, element)
      })
    }
    emitter.emit('showGroupPerceptionEnvelopeLine2', {
      side: 'red',
      type: 'fireRange',
      checked: state.isShowGroupZzLine,
      groupName: data.groupName,
      groupList: [data],
      groupRangeList: rangeConfigObj
    })
  })
}
//显示单个平台的感知范围包络
const showPlanteGz = (data) => {
  state.isShowPlateGzLine = !state.isShowPlateGzLine
  store.commit('setCurrentNode', {
    code: data.id,
    side: data.side,
    type: data.type
  })
  entityFrustumChange(state.isShowPlateGzLine)
}
//显示单个平台的干扰范围
const showPlanteGr = (data) => {
  state.isShowPlateGRLine = !state.isShowPlateGRLine
  store.commit('setCurrentNode', {
    code: data.id,
    side: data.side,
    type: data.type
  })
  entityJAMChange(state.isShowPlateGRLine)
}

//显示单个平台的作战范围包络(此处暂时为显示通信链路)
const showPlanteZz = (data) => {
  state.isShowPlateZzLine = !state.isShowPlateZzLine
  store.commit('setCurrentNode', {
    code: data.id,
    side: data.side,
    type: data.type
  })
  // firepowerRadiusChange(state.isShowPlateZzLine)
  commChina(state.isShowPlateZzLine)
}
//根据编组信息获取感知范围和作战范围距离
const getRangeByGroup = (data) => {
  return new Promise((resolve1, reject1) => {
    let promiseData = []
    if (data.childList.length > 0) {
      data.childList.forEach((element) => {
        promiseData.push(getRangeConfig(element, {}))
      })
    }
    function getRangeConfig(element, rangeConfig) {
      return new Promise((resolve, reject) => {
        let entityId = element.entityId
        rangeConfig[entityId] = {
          fireRange: '',
          perceptionRange: ''
        }
        let params = { name: entityId }
        getPlateSWMessageV2(params).then((res) => {
          if (res.code == 200) {
            if (res.data['sensors'] && res.data['sensors'].length > 0) {
              let array = []
              //获取装备上所有传感器的范围
              res.data['sensors'].forEach((item) => {
                if (item.mr) {
                  array.push(item.mr)
                }
              })
              if (array.length == 0) {
                console.log('未查询到感知半径--' + entityId)
                // return
              }
              let range = Math.max.apply(null, array) //获取最远探测范围的传感器距离
              if (!range) return //没有感知范围就return
              rangeConfig[entityId]['perceptionRange'] = range
            }
            if (res.data['weapons'] && res.data['weapons'].length > 0) {
              let array = []
              //获取装备上所有武器的范围
              res.data['weapons'].forEach((item) => {
                if (item.pr) {
                  array.push(item.pr)
                }
              })
              if (array.length == 0) {
                console.log('未查询到火力半径--' + entityId)
                // return
              }
              let range = Math.max.apply(null, array) //获取最远攻击范围的距离
              if (!range) return //没有攻击范围就return
              rangeConfig[entityId]['fireRange'] = range
            } else {
              console.log('未查询到火力半径--' + entityId)
              // return
            }
            resolve(rangeConfig)
          }
        })
      })
    }
    Promise.all(promiseData)
      .then((res) => {
        resolve1(res)
      })
      .catch((error) => {
        reject1(error)
      })
  })
}
//我形式图下各能力显示效果
const wxstAbility = (data, checked) => {
  if (data.code.indexOf('skyGoalType') > -1) {
    switch (data.name) {
      case '空空作战组网':
        emitter.emit('showGroupPerceptionEnvelopeLine3', {
          side: 'blue',
          spaceType: 2,
          type: 'fireRange',
          checked: checked,
          ds: 'redFireRangeDs',
          color: [255, 255, 0, 0.1],
          groupList: store.state.sceneModule.groupListBlue,
          groupRangeList: store.state.sceneModule.groupRangeBlue
        }) //是否显示作战包络
        break
      case '空中预警探测组网':
        emitter.emit('showGroupPerceptionEnvelopeLine3', {
          side: 'blue',
          spaceType: 2,
          type: 'perceptionRange',
          checked: checked,
          ds: 'redPerceptionRangeDs',
          color: [45, 209, 45, 0.1],
          groupList: store.state.sceneModule.groupListBlue,
          groupRangeList: store.state.sceneModule.groupRangeBlue
        }) //是否显示作战包络
        break
      default:
        break
    }
  } else if (data.code.indexOf('seaGoalType') > -1) {
    switch (data.name) {
      case '舰对空组网拦截能力':
        emitter.emit('showGroupPerceptionEnvelopeLine3', {
          side: 'blue',
          spaceType: 0,
          type: 'fireRange',
          checked: checked,
          ds: 'redFireRangeDs',
          color: [255, 255, 0, 0.1],
          groupList: store.state.sceneModule.groupListBlue,
          groupRangeList: store.state.sceneModule.groupRangeBlue
        }) //是否显示作战包络
        break
      case '舰载雷达组网能力':
        emitter.emit('showGroupPerceptionEnvelopeLine3', {
          side: 'blue',
          spaceType: 0,
          type: 'perceptionRange',
          checked: checked,
          ds: 'redPerceptionRangeDs',
          color: [45, 209, 45, 0.1],
          groupList: store.state.sceneModule.groupListBlue,
          groupRangeList: store.state.sceneModule.groupRangeBlue
        }) //是否显示感知包络
        break
      default:
        break
    }
  } else if (data.code.indexOf('landGoalType') > -1) {
    switch (data.name) {
      case '地面雷达组网能力':
        emitter.emit('showGroupPerceptionEnvelopeLine3', {
          side: 'blue',
          spaceType: 1,
          type: 'perceptionRange',
          checked: checked,
          ds: 'redPerceptionRangeDs',
          color: [45, 209, 45, 0.1],
          groupList: store.state.sceneModule.groupListBlue,
          groupRangeList: store.state.sceneModule.groupRangeBlue
        }) //是否显示作战包络
        break
      case '地空组网拦截能力':
        emitter.emit('showGroupPerceptionEnvelopeLine3', {
          side: 'blue',
          spaceType: 1,
          type: 'fireRange',
          checked: checked,
          ds: 'redFireRangeDs',
          color: [255, 255, 0, 0.1],
          groupList: store.state.sceneModule.groupListBlue,
          groupRangeList: store.state.sceneModule.groupRangeBlue
        }) //是否显示感知包络
        break
      default:
        break
    }
  }
}
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
    color: #ffffff;
    cursor: pointer;
    position: absolute;
    top: 16px;
    right: 45px;
  }

  .el-tree {
    font-size: 15px;
    height: 100% !important;
    width: 100%;
    background: transparent;
    color: #e9fcfd;
    overflow-y: auto;
    box-sizing: border-box;

    .custom-icon {
      width: 17px;
      height: 17px;
      padding-right: 6px;
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
    color: #00c7fb;
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
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;
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
          color: #fff;
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
  // border-radius: 50%;
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
