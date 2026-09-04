<!--
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-05-07 09:27:43
 * @LastEditors: chenguopeng2 chenguopeng.piesat.cn
 * @LastEditTime: 2026-07-31 16:22:33
 * @FilePath: \MSIMEarthSysN\src\views\toolbar\layerList\viewContextMenuComp\layerConfig.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <li
    class="layerConfig"
    v-for="(item, index) in props.layerList"
    :key="index"
    @click="layerClick(item, index)"
  >
    <el-tooltip
      class="box-item"
      effect="dark"
      :content="item.disabled ? '该功能不可用' : item.name"
      placement="bottom-start"
    >
      <img
        :src="
          require(`@/assets/image/rightNavbar/viewContextMenu/${item.urlon}`)
        "
        v-if="item.isShow"
      />
      <img
        :src="
          require(`@/assets/image/rightNavbar/viewContextMenu/${item.urloff}`)
        "
        v-else
      />
    </el-tooltip>
  </li>
</template>

<script setup>
import store from '@/store'
import emitter from '@/utils/eventbus'
import { reactive, onMounted, watch } from 'vue'
import { detailedSignageCheckChange } from '@/views/toolbar/layerList/hooks/showHideConfig'
import GerneralRadar from '@/utils/renderRadar'
import {
  getSourceAndTargetEntity,
  removeEntityMbById
} from '@/views/toolbar/layerList/hooks/guideCommand'
import {
  pathCheckChange,
  planLineChange
} from '@/views/toolbar/layerList/hooks/showHideConfig'
import { RE_InterferenceRange } from '@/utils/earthPlugin/ThirdParty/eventSource/event/earthActionByEvent'
import { getRader3DStatic } from '@/service/radar' // 获取本地或服务器上的雷达遮罩数据
const { resumeSingleRadar } = RE_InterferenceRange()
// import { radarCreateBylanjieScenario } from '@/utils/mapTools'

const props = defineProps({
  layerList: {
    type: Array,
    defind: {}
  }
})
const state2 = reactive({
  connectLineManage: null,
  linkConfig: [
    'RE_SDC',
    'RE_LTrackInit',
    'RE_WeaponF',
    'distancelabel',
    'RE_JamA',
    'RE_MR',
    'Task_Aign',
    'RE_WeaponWH'
  ],
  entityRadarDetectSum: 6
})

onMounted(() => {
  const sceneAction = new window.EarthPlugn.sceneAction({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  state2.connectLineManage = sceneAction.connectLineManagement
  emitter.on('setDetailLabelChecked', (value) => {
    props.layerList[0].isShow = value
  })
  emitter.on('setCombatRadiusChecked', (value) => {
    props.layerList[1].isShow = value
  })
  emitter.on('setFireRadiusChecked', (value) => {
    props.layerList[2].isShow = value
  })
  emitter.on('setFrustumRadiusChecked', (value) => {
    props.layerList[3].isShow = value
  })
  emitter.on('setEntityLinkConfig', (value) => {
    props.layerList[4].isShow = value
  })
  emitter.on('setLocationChecked', (value) => {
    props.layerList[5].isShow = value
  })
  emitter.on('setAmmuntionChecked', (value) => {
    props.layerList[6].isShow = value
  })
  // 是否显示当前目标距离
  emitter.on('setTargetDistanceChecked', (value) => {
    props.layerList[7].isShow = value
  })
  // 是否显示当前目标正北方向
  emitter.on('setTargetDueNorthChecked', (value) => {
    props.layerList[8].isShow = value
  })
  // 是否显示当前目标航线
  emitter.on('setTargetPathChecked', (value) => {
    props.layerList[9].isShow = value
  })
  // 是否显示当前目标航线
  emitter.on('setTargetPlanLineChecked', (value) => {
    props.layerList[10].isShow = value
  })
  // 是否显示当前目标雷达探测
  emitter.on('setElectDetectChecked', (value) => {
    props.layerList[11].isShow = value
  })
  configToolbarState(store.state.sceneModule.currentFlyType.entityId)
})

watch(
  () => store.state.sceneModule.currentFlyType.entityId,
  (newVal) => {
    if (newVal) configToolbarState(newVal)
  },
  { deep: true }
)

watch(
  () => store.state.sceneModule.radarRender,
  (newVal) => {
    let entityId = store.state.sceneModule.currentFlyType.entityId
    let radarStateList = store.getters.getRadarRenderConfig // 雷达状态集合
    let index = radarStateList.findIndex((item) => item.radarName == entityId)
    if (newVal) {
      if (index > -1) {
        emitter.emit('setElectDetectChecked', true)
      }
    } else {
      if (index > -1) {
        emitter.emit('setElectDetectChecked', false)
      }
    }
  },
  { deep: true }
)

const configToolbarState = (entityId) => {
  if (store.state.sceneModule.entityLinkConfigList.indexOf(entityId) > -1) {
    emitter.emit('setLinkChecked', true)
    store.commit('setEntityLinkConfig', true)
    emitter.emit('setTargetDistanceChecked', true)
    emitter.emit('setTargetDueNorthChecked', true)
    emitter.emit('setCombatRadiusChecked', true)
    emitter.emit('setFireRadiusChecked', true)
    emitter.emit('setFrustumRadiusChecked', true)
    emitter.emit('setLocationChecked', true)
    emitter.emit('setAmmuntionChecked', true)
    emitter.emit('setTargetPathChecked', true) 
    emitter.emit('setTargetPlanLineChecked', true) 
    emitter.emit('setElectDetectChecked', true) 
  } else {
    emitter.emit('setLinkChecked', false)
    store.commit('setEntityLinkConfig', false)
    emitter.emit('setTargetDistanceChecked', false)
    emitter.emit('setTargetDueNorthChecked', false)
    emitter.emit('setCombatRadiusChecked', false)
    emitter.emit('setFireRadiusChecked', false)
    emitter.emit('setFrustumRadiusChecked', false)
    emitter.emit('setLocationChecked', false)
    emitter.emit('setAmmuntionChecked', false)
    emitter.emit('setTargetPathChecked', false) 
    emitter.emit('setTargetPlanLineChecked', false) 
    emitter.emit('setElectDetectChecked', false) 
  }
  
  let radarStateList = store.getters.getRadarRenderConfig // 雷达状态集合
  let index = radarStateList.findIndex((item) => item.radarName == entityId)
  if (index > -1) {
    //目标在实体状态集合
    console.log('radarStateList')
    props.layerList[11].disabled = false
    emitter.emit(
      'setElectDetectChecked',
      store.getters.getRadarRenderConfig[index].radarState
    )
  } else {
    props.layerList[11].disabled = true
    emitter.emit('setElectDetectChecked', false)
  }
  // 判断标签详表是否可用
  let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
    entityId,
    'MSIMEarthCZMLProcessContainer'
  )
  if (!window.MSIMEarth.defined(curEntity)) {
    console.log('window.MSIMEarth.defined(curEntity)')
    props.layerList[0].disabled = false
    if (
      store.state.sceneModule.toolbarEntityonfig.detailLabelList.indexOf(
        entityId
      ) > -1
    ) {
      emitter.emit('setDetailLabelChecked', true)
    } else {
      emitter.emit('setDetailLabelChecked', false)
    }
  } else {
    if (
      curEntity.properties &&
      typeof curEntity.properties.airplaneAction !== 'undefined'
    ) {
    console.log('curEntity.propertie')
      props.layerList[0].disabled = false
      if (
        store.state.sceneModule.toolbarEntityonfig.detailLabelList.indexOf(
          entityId
        ) > -1
      ) {
        emitter.emit('setDetailLabelChecked', true)
      } else {
        emitter.emit('setDetailLabelChecked', false)
      }
      if (
        store.state.sceneModule.toolbarEntityonfig.targetDistanceList.indexOf(
          entityId
        ) > -1
      ) {
        emitter.emit('setTargetDistanceChecked', true)
      } else {
        emitter.emit('setTargetDistanceChecked', false)
      }
      if (
        store.state.sceneModule.toolbarEntityonfig.targetDueNorthList.indexOf(
          entityId
        ) > -1
      ) {
        emitter.emit('setTargetDueNorthChecked', true)
      } else {
        emitter.emit('setTargetDueNorthChecked', false)
      }
      if (
        store.state.sceneModule.toolbarEntityonfig.combatRaduisList.indexOf(
          entityId
        ) > -1
      ) {
        emitter.emit('setCombatRadiusChecked', true)
      } else {
        emitter.emit('setCombatRadiusChecked', false)
      }
      if (
        store.state.sceneModule.toolbarEntityonfig.fireRaduisList.indexOf(
          entityId
        ) > -1
      ) {
        emitter.emit('setFireRadiusChecked', true)
      } else {
        emitter.emit('setFireRadiusChecked', false)
      }
      if (
        store.state.sceneModule.toolbarEntityonfig.frustumRaduisList.indexOf(
          entityId
        ) > -1
      ) {
        emitter.emit('setFrustumRadiusChecked', true)
      } else {
        emitter.emit('setFrustumRadiusChecked', false)
      }
      if (
        store.state.sceneModule.toolbarEntityonfig.linkList.indexOf(entityId) >
        -1
      ) {
        emitter.emit('setEntityLinkConfig', true)
      } else {
        emitter.emit('setEntityLinkConfig', false)
      }
      if (
        store.state.sceneModule.toolbarEntityonfig.locationList.indexOf(
          entityId
        ) > -1
      ) {
        emitter.emit('setLocationChecked', true)
      } else {
        emitter.emit('setLocationChecked', false)
      }
      if (
        store.state.sceneModule.toolbarEntityonfig.ammuntionList.indexOf(
          entityId
        ) > -1
      ) {
        emitter.emit('setAmmuntionChecked', true)
      } else {
        emitter.emit('setAmmuntionChecked', false)
      }
      if (
        store.state.sceneModule.toolbarEntityonfig.pathLiist.indexOf(
          entityId
        ) > -1
      ) {
        emitter.emit('setTargetPathChecked', true)
      } else {
        emitter.emit('setTargetPathChecked', false)
      }
       if (
        store.state.sceneModule.toolbarEntityonfig.planLineList.indexOf(
          entityId
        ) > -1
      ) {
        emitter.emit('setTargetPlanLineChecked', true)
      } else {
        emitter.emit('setTargetPlanLineChecked', false)
      }
      if (
        store.state.sceneModule.toolbarEntityonfig.electDetectList.indexOf(
          entityId
        ) > -1
      ) {
        emitter.emit('setElectDetectChecked', true)
      } else {
        emitter.emit('setElectDetectChecked', false)
      }
    } else {
      console.log('啥都没有')
      props.layerList[0].disabled = true
      emitter.emit('setDetailLabelChecked', false)
      //作战半径
      props.layerList[1].disabled = true
      emitter.emit('setCombatRadiusChecked', false)
      //火力半径
      props.layerList[2].disabled = true
      emitter.emit('setFireRadiusChecked', false)
      //侦察半径
      props.layerList[3].disabled = true
      emitter.emit('setFrustumRadiusChecked', false)
      //链路信息
      props.layerList[4].disabled = true
      emitter.emit('setEntityLinkConfig', false)
      //变更位置
      props.layerList[5].disabled = true
      emitter.emit('setLocationChecked', false)
      //弹药配置
      props.layerList[6].disabled = true
      emitter.emit('setAmmuntionChecked', false)
      // 目标距离、方位、高度差
      props.layerList[7].disabled = true
      emitter.emit('setTargetDistanceChecked', false)
      // 目标正北方向
      props.layerList[8].disabled = true
      emitter.emit('setTargetDueNorthChecked', false)
      //路径
      props.layerList[9].disabled = true
      emitter.emit('setTargetPathChecked', false)
      //航线
      props.layerList[10].disabled = true
      emitter.emit('setTargetPlanLineChecked', false)
       //雷达探测
      props.layerList[11].disabled = true
      emitter.emit('setElectDetectChecked', false)
    }
  }
}

const layerClick = (item, index) => {
  if (item.disabled) return
  props.layerList[index].isShow = !props.layerList[index].isShow

  switch (item.name) {
    case '路径':
      {
        let entityId = store.state.sceneModule.currentFlyType.entityId
        pathCheckChange(item.isShow)
        emitter.emit('setTargetPathChecked', item.isShow) 
        if(item.isShow)
        {
          //向列表中添加数据，再次打开右键菜单时，按钮状态为on
          store.state.sceneModule.toolbarEntityonfig.pathLiist.push(entityId)
        } else
        {
          //从列表中移除，再次打开右键菜单时，按钮状态为off
          let index =
            store.state.sceneModule.toolbarEntityonfig.pathLiist.indexOf(entityId)
          if (index > -1) {
            store.state.sceneModule.toolbarEntityonfig.pathLiist.splice(index, 1)
          }
        }
      }
      break
    case '航线':
      {
        let entityId = store.state.sceneModule.currentFlyType.entityId
        planLineChange(item.isShow)
        emitter.emit('setTargetPlanLineChecked', item.isShow) 
        if(item.isShow)
        {
          //向列表中添加数据，再次打开右键菜单时，按钮状态为on
          store.state.sceneModule.toolbarEntityonfig.planLineList.push(entityId)
        } else
        {
          //从列表中移除，再次打开右键菜单时，按钮状态为off
          let index =
            store.state.sceneModule.toolbarEntityonfig.planLineList.indexOf(entityId)
          if (index > -1) {
            store.state.sceneModule.toolbarEntityonfig.planLineList.splice(index, 1)
          }
        }
      }
    break
    case '正北方向':
      let entityIdDueNor = store.state.sceneModule.currentFlyType.entityId
      emitter.emit('setTargetDueNorthChecked', item.isShow)
      if (item.isShow) {
        store.state.sceneModule.toolbarEntityonfig.targetDueNorthList.push(
          entityIdDueNor
        )
        // 调用方法 调整正北方向
        setViewEarthByDueNorth(entityIdDueNor)
      } else {
        let index =
          store.state.sceneModule.toolbarEntityonfig.targetDueNorthList.indexOf(
            entityIdDueNor
          )
        if (index > -1) {
          store.state.sceneModule.toolbarEntityonfig.targetDueNorthList.splice(
            index,
            1
          )
        }
      }
      break
    case '目标距离':
      let entityId = store.state.sceneModule.currentFlyType.entityId
      emitter.emit('setTargetDistanceChecked', item.isShow)
      if (item.isShow) {
        store.state.sceneModule.toolbarEntityonfig.targetDistanceList.push(
          entityId
        )
        // 调用方法 显示 目标距离、方位、高度差
        getSourceAndTargetEntity()
      } else {
        let index =
          store.state.sceneModule.toolbarEntityonfig.targetDistanceList.indexOf(
            entityId
          )
        if (index > -1) {
          store.state.sceneModule.toolbarEntityonfig.targetDistanceList.splice(
            index,
            1
          )
        }
        // 删除距离、方位、高度差
        if (
          window.EarthViewer.entities.values &&
          window.EarthViewer.entities.values.length > 0
        ) {
          removeEntityMbById('RE_Distance')
        }
      }
      break
    // case '指挥链路':
    case '链路信息':
      {
        let entityId = store.state.sceneModule.currentFlyType.entityId
        store.commit('setEntityLinkConfig', item.isShow)
        state2.linkConfig.forEach((link) => {
          state2.connectLineManage.showEntityByTwoKeyword(
            link,
            entityId,
            item.isShow
          )

          state2.connectLineManage.showEntityByKeyword(
            `${link}==${entityId}==`,
            item.isShow
          )
        })
        if (item.isShow) {
          store.state.sceneModule.entityLinkConfigList.push(entityId)
        } else {
          let index =
            store.state.sceneModule.entityLinkConfigList.indexOf(entityId)
          if (index > -1) {
            store.state.sceneModule.entityLinkConfigList.splice(index, 1)
          }
        }
      }
      break
    case '标签详标':
      {
        let entityId = store.state.sceneModule.currentFlyType.entityId
        detailedSignageCheckChange(item.isShow)
        if (item.isShow) {
          store.state.sceneModule.toolbarEntityonfig.detailLabelList.push(
            entityId
          )
        } else {
          let index =
            store.state.sceneModule.toolbarEntityonfig.detailLabelList.indexOf(
              entityId
            )
          if (index > -1) {
            store.state.sceneModule.toolbarEntityonfig.detailLabelList.splice(
              index,
              1
            )
          }
        }
      }
      break
    case '雷达探测':
      {
        let entityId = store.state.sceneModule.currentFlyType.entityId
        radarRenderStatic(entityId, item)
      }
      break
    case '作战半径':
      {
        let entityId = store.state.sceneModule.currentFlyType.entityId
        emitter.emit('setCombatRadiusChecked', item.isShow)
        if (item.isShow) {
          store.state.sceneModule.toolbarEntityonfig.combatRaduisList.push(
            entityId
          )
        } else {
          let index =
            store.state.sceneModule.toolbarEntityonfig.combatRaduisList.indexOf(
              entityId
            )
          if (index > -1) {
            store.state.sceneModule.toolbarEntityonfig.combatRaduisList.splice(
              index,
              1
            )
          }
        }
        emitter.emit('operationalRadiusChange1', item.isShow)
      }
      break
    case '火力半径':
      {
        let entityId = store.state.sceneModule.currentFlyType.entityId
        emitter.emit('setFireRadiusChecked', item.isShow)
        if (item.isShow) {
          store.state.sceneModule.toolbarEntityonfig.fireRaduisList.push(
            entityId
          )
        } else {
          let index =
            store.state.sceneModule.toolbarEntityonfig.fireRaduisList.indexOf(
              entityId
            )
          if (index > -1) {
            store.state.sceneModule.toolbarEntityonfig.fireRaduisList.splice(
              index,
              1
            )
          }
        }
        emitter.emit('firepowerRadiusChange1', item.isShow)
      }
      break
    case '侦察半径':
      {
        let entityId = store.state.sceneModule.currentFlyType.entityId

        emitter.emit('setFrustumRadiusChecked', item.isShow)
        if (item.isShow) {
          store.state.sceneModule.toolbarEntityonfig.frustumRaduisList.push(
            entityId
          )
        } else {
          let index =
            store.state.sceneModule.toolbarEntityonfig.frustumRaduisList.indexOf(
              entityId
            )
          if (index > -1) {
            store.state.sceneModule.toolbarEntityonfig.frustumRaduisList.splice(
              index,
              1
            )
          }
        }
        emitter.emit('entityFrustumChange1', item.isShow)
      }
      break
    case '变更位置':
      {
        let entityId = store.state.sceneModule.currentFlyType.entityId
        emitter.emit('setLocationChecked', item.isShow)
        if (item.isShow) {
          store.state.sceneModule.toolbarEntityonfig.locationList.push(entityId)
          emitter.emit('moveToPositionChange1', item.isShow)
        } else {
          let index =
            store.state.sceneModule.toolbarEntityonfig.locationList.indexOf(
              entityId
            )
          if (index > -1) {
            store.state.sceneModule.toolbarEntityonfig.locationList.splice(
              index,
              1
            )
          }
          let obj = {
            isShow: false,
            commandFormData: {
              command: '变更位置'
            }
          }
          emitter.emit('showCommandControl', obj)
        }
      }
      break
    case '弹药配置':
      {
        let entityId = store.state.sceneModule.currentFlyType.entityId
        emitter.emit('setAmmuntionChecked', item.isShow)
        if (item.isShow) {
          store.state.sceneModule.toolbarEntityonfig.ammuntionList.push(
            entityId
          )
          emitter.emit('setWeaponNumChange1', item.isShow)
        } else {
          let index =
            store.state.sceneModule.toolbarEntityonfig.ammuntionList.indexOf(
              entityId
            )
          if (index > -1) {
            store.state.sceneModule.toolbarEntityonfig.ammuntionList.splice(
              index,
              1
            )
          }
          let obj = {
            isShow: false,
            commandFormData: {
              command: '变更弹药数量'
            }
          }
          emitter.emit('showCommandControl', obj)
        }
      }
      break
    default:
      break
  }
}

// 调整当前相机视角  正北方向
const setViewEarthByDueNorth = (entityId) => {
  // let sourIdEntity = window.EarthPlugn.entity._GetCZMLEntity(
  //   entityId,
  //   'MSIMEarthCZMLProcessContainer'
  // )
  // if (!window.MSIMEarth.defined(sourIdEntity)) return
  // let sourIdPosition = sourIdEntity.position.getValue(
  //   window.EarthViewer.clock.currentTime
  // )
  // if (!window.MSIMEarth.defined(sourIdPosition)) return

  //获取当前屏幕中心点的位置
  let centerResult = window.EarthViewer.camera.pickEllipsoid(
    new window.MSIMEarth.Cartesian2(
      window.EarthViewer.canvas.clientWidth / 2,
      window.EarthViewer.canvas.clientHeight / 2
    )
  )
  let centerPoint = centerResult
  let curPosition =
    window.MSIMEarth.Ellipsoid.WGS84.cartesianToCartographic(centerResult)
  let curLongitude = (curPosition.longitude * 180) / Math.PI
  let curLatitude = (curPosition.latitude * 180) / Math.PI

  // 获取相机位置坐标
  let a = {
    lon: curLongitude,
    lat: curLatitude
  }
  //获取当前相机的位置
  var position = window.EarthViewer.scene.camera.positionCartographic
  // 弧度转经纬度
  var longitude = window.MSIMEarth.Math.toDegrees(position.longitude)
  var latitude = window.MSIMEarth.Math.toDegrees(position.latitude)
  var height = position.height

  // 获取屏幕中心点位置坐标
  let b = { lng: longitude, lat: latitude, h: height }
  let clickPosition1 = window.MSIMEarth.Cartesian3.fromDegrees(a.lon, a.lat, 0)
  let clickPosition2 = window.MSIMEarth.Cartesian3.fromDegrees(
    b.lng,
    b.lat,
    b.h
  )
  // 计算两个点之间的距离
  let distancetemp = window.MSIMEarth.Cartesian3.distance(
    clickPosition1,
    clickPosition2
  )
  // console.log('屏幕到地图中心距离:', distancetemp)

  window.EarthViewer.camera.flyTo({
    // destination: new window.MSIMEarth.Cartesian3(
    //   sourIdPosition.x,
    //   sourIdPosition.y,
    //   window.EarthViewer.camera.position.z // 当前视角的高度
    // ),
    destination: window.MSIMEarth.Cartesian3.fromDegrees(
      curLongitude,
      curLatitude,
      distancetemp // 屏幕到地图中心距离
    ),
    duration: 0, // 以秒为单位的飞行持续时间。
    orientation: {
      heading: 0.0,
      pitch: -window.MSIMEarth.Math.PI_OVER_TWO,
      roll: 0
    }
  })
}

const radarRenderStatic = (entityId, item) => {
  let radarStateList = store.getters.getRadarRenderConfig // 雷达状态集合
  let radarconfig = true
  radarStateList.forEach((e) => {
    if (e.radarName === entityId) {
      e.radarState = item.isShow
    }
    radarconfig = radarconfig && e.radarState
  })
  let cusP = new window.EarthPlugn.customPritive(
    window.MSIMEarth,
    window.EarthViewer
  )
  if (item.isShow) {
    // 清除雷达遮罩
    window.EarthViewer.scene.primitives._primitives.forEach((e) => {
      if (e.id && e.id == entityId + 'TRIANGLES') {
        window.EarthViewer.scene.primitives.remove(e)
      }
    })
    window.EarthViewer.scene.primitives._primitives.forEach((e) => {
      if (e.id && e.id == entityId + 'LINES') {
        window.EarthViewer.scene.primitives.remove(e)
      }
    })
    // 1.1获取雷达位置并配置雷达属性
    let radarEntity = window.EarthPlugn.entity._GetCZMLEntity(
      entityId,
      'MSIMEarthCZMLProcessContainer'
    )
    if (!window.MSIMEarth.defined(radarEntity)) return
    let radarPosition = radarEntity.position.getValue(
      window.EarthViewer.clock.currentTime
    )
    if (!window.MSIMEarth.defined(radarPosition)) return
    let ellipsoid = window.EarthViewer.scene.globe.ellipsoid
    let radarCartographic = ellipsoid.cartesianToCartographic(radarPosition)
    let radarLat = window.MSIMEarth.Math.toDegrees(radarCartographic.latitude)
    let radarLng = window.MSIMEarth.Math.toDegrees(radarCartographic.longitude)
    let radarAlt = radarCartographic.height

    let renderPosition = window.MSIMEarth.Cartesian3.fromDegrees(
      radarLng,
      radarLat,
      radarAlt
    )
    getRader3DStatic(`./static/data/geojson/radar干扰/${entityId}.json`).then(
      (res) => {
        console.log(res)
        let radarSide = radarEntity.properties?.side?._value
        let colors = []
        switch (radarSide) {
          case 'red':
            res.probabilities.forEach((p) => {
              switch (p) {
                case 10:
                  colors.push(1.0, 0.0, 0.0, 0.4)
                  break
                case 9:
                  colors.push(1.0, 0.0, 0.0, 0.4)
                  break
                case 8:
                  colors.push(1.0, 0.0, 0.0, 0.4)
                  break
                case 7:
                  colors.push(1.0, 0.0, 0.0, 0.3)
                  break
                case 6:
                  colors.push(1.0, 0.0, 0.0, 0.3)
                  break
                case 5:
                  colors.push(1.0, 0.0, 0.0, 0.3)
                  break
                case 4:
                  colors.push(1.0, 0.0, 0.0, 0.2)
                  break
                case 3:
                  colors.push(1.0, 0.0, 0.0, 0.2)
                  break
                case 2:
                  colors.push(1.0, 0.0, 0.0, 0.2)
                  break
                case 1:
                  colors.push(1.0, 0.0, 0.0, 0.1)
                  break
                case 0:
                  colors.push(1.0, 0.0, 0.0, 0.1)
                  break
                default:
                  break
              }
            })
            break
          case 'blue':
            res.probabilities.forEach((p) => {
              switch (p) {
                case 10:
                  colors.push(0.0, 0.0, 1.0, 0.4)
                  break
                case 9:
                  colors.push(0.0, 0.0, 1.0, 0.4)
                  break
                case 8:
                  colors.push(0.0, 0.0, 1.0, 0.4)
                  break
                case 7:
                  colors.push(0.0, 0.0, 1.0, 0.3)
                  break
                case 6:
                  colors.push(0.0, 0.0, 1.0, 0.3)
                  break
                case 5:
                  colors.push(0.0, 0.0, 1.0, 0.3)
                  break
                case 4:
                  colors.push(0.0, 0.0, 1.0, 0.2)
                  break
                case 3:
                  colors.push(0.0, 0.0, 1.0, 0.2)
                  break
                case 2:
                  colors.push(0.0, 0.0, 1.0, 0.2)
                  break
                case 1:
                  colors.push(0.0, 0.0, 1.0, 0.1)
                  break
                case 0:
                  colors.push(0.0, 0.0, 1.0, 0.1)
                  break
                default:
                  break
              }
            })
            break
          default:
            break
        }
        console.log('cusP.createTriNetPrimitive')
        let rt = cusP.createTriNetPrimitive({
          position: renderPosition,
          viewer: window.EarthViewer,
          positions: res.positions,
          indices: res.indices,
          colors: colors,
          primitiveType: 'TRIANGLES',
          id: radarEntity.id + 'TRIANGLES'
        })
        let rt2 = cusP.createTriNetPrimitive({
          position: renderPosition,
          viewer: window.EarthViewer,
          positions: res.positions,
          indices: res.indices,
          colors: colors,
          primitiveType: 'LINES',
          id: radarEntity.id + 'LINES'
        })
        window.EarthViewer.scene.primitives.add(rt)
        window.EarthViewer.scene.primitives.add(rt2)
      }
    )
  } else {
    // store.commit('setradarRender', radarconfig)
    //关闭雷达遮罩
    window.EarthViewer.scene.primitives._primitives.forEach((e) => {
      if (e.id && e.id == entityId + 'TRIANGLES') {
        window.EarthViewer.scene.primitives.remove(e)
      }
    })
    window.EarthViewer.scene.primitives._primitives.forEach((e) => {
      if (e.id && e.id == entityId + 'LINES') {
        window.EarthViewer.scene.primitives.remove(e)
      }
    })
  }
}
</script>

<style lang="less" scoped>
.layerConfig {
  width: 34px;
  height: 34px;
  padding-right: 5px;
  margin-right: 5px;

  //border-right: 1px solid;
  img {
    width: 30px;
    height: 30px;
  }
}
</style>
