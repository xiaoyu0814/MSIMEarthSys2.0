<!--
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-05-07 09:27:43
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2026-06-23 13:25:59
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
    // 'RE_STrackInit',
    'RE_LTrackInit',
    'RE_WeaponF',
    'distancelabel',
    'RE_JamA',
    'RE_MR',
    'Task_Aign',
    'RE_WeaponWH'
  ],
  entityRadarDetectSum: 6
  //entityRadarDetectCount: 0
})

onMounted(() => {
  const sceneAction = new window.EarthPlugn.sceneAction({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  state2.connectLineManage = sceneAction.connectLineManagement
  // emitter.on('setElectDetectChecked', (value) => {
  //   props.layerList[1].isShow = value
  // })

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
  }
  let radarStateList = store.getters.getRadarRenderConfig // 雷达状态集合
  let index = radarStateList.findIndex((item) => item.radarName == entityId)
  if (index > -1) {
    //目标在实体状态集合
    // props.layerList[1].disabled = false
    emitter.emit(
      'setElectDetectChecked',
      store.getters.getRadarRenderConfig[index].radarState
    )
  } else {
    // props.layerList[1].disabled = true
    emitter.emit('setElectDetectChecked', false)
  }
  // 判断标签详表是否可用 或
  // 判断当前目标距离是否可用 或
  // 判断当前目标正北方向是否可用
  let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
    entityId,
    'MSIMEarthCZMLProcessContainer'
  )
  if (!window.MSIMEarth.defined(curEntity)) {
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
    // 存储显隐
    if (
      curEntity.properties &&
      typeof curEntity.properties.airplaneAction !== 'undefined'
    ) {
      props.layerList[0].disabled = false
      if (
        store.state.sceneModule.toolbarEntityonfig.detailLabelList.indexOf(
          entityId
        ) > -1
      ) {
        emitter.emit('setDetailLabelChecked', true)
        // emitter.emit('setTargetDistanceChecked', true)
      } else {
        emitter.emit('setDetailLabelChecked', false)
        // emitter.emit('setTargetDistanceChecked', false)
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
    } else {
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
    case '天气':
      // if (item.isShow) {
      //   window.EarthViewer.camera.setView({
      //     destination: new window.MSIMEarth.Cartesian3.fromDegrees(
      //       122.557,
      //       24.18,
      //       2100000
      //     )
      //   })
      // } else {
      // }
      store.state.sceneModule.quyuWeatherVisible =
        !store.state.sceneModule.quyuWeatherVisible
      // 创建数据管理对象
      let dataController = new window.EarthPlugn.DataControl({
        earth: window.MSIMEarth,
        viewer: window.EarthViewer
      })
      dataController.addGeojsonWeather(
        {
          url: basicVectorData.tianqiquyu,
          id: '矢量天气',
          backLoad: false
        },
        store.state.sceneModule.quyuWeatherVisible
      )
      store.commit('setVectorWeatherConfig', item.isShow)
      break
    case '雷达探测':
      {
        let entityId = store.state.sceneModule.currentFlyType.entityId
        if (entityId === 'ew_radar') {
          radarRenderStatic(entityId, item)
          return
        }
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
          if (EarthAPP.ldzzInternal) {
            console.log('清除了')
            clearInterval(EarthAPP.ldzzInternal)
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
          }
          // 显示雷达遮罩，每500毫秒更新一次
          // 1获取场景内地方干扰源,包括阵营判断、距离判断、参数详情等内容，暂时只有阵营和距离
          EarthAPP.ldzzInternal = setInterval(() => {
            // 雷达参数
            let RadarMsg = {}
            // 干扰源参数
            let disMsg = []
            // 1.0 如果存在则清除当前雷达渲染图元
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
            let radarSide = radarEntity.properties?.side?._value
            let grySide = 'red'
            if (radarSide === 'red') {
              grySide = 'blue'
            } else if (radarSide === 'blue') {
              grySide = 'red'
            } else {
              //其他阵营或者没获取到阵营属性
            }
            let radarPosition = radarEntity.position.getValue(
              window.EarthViewer.clock.currentTime
            )
            if (!window.MSIMEarth.defined(radarPosition)) return
            let ellipsoid = window.EarthViewer.scene.globe.ellipsoid
            let radarCartographic =
              ellipsoid.cartesianToCartographic(radarPosition)
            let radarLat = window.MSIMEarth.Math.toDegrees(
              radarCartographic.latitude
            )
            let radarLng = window.MSIMEarth.Math.toDegrees(
              radarCartographic.longitude
            )
            let radarAlt = radarCartographic.height
            RadarMsg = {
              Pt: Math.pow(10, 6), //雷达的发射功率 W
              Gt: 40, //雷达的天线主瓣增益 db
              lanBuda: 0.026, // 信号波长m  // 决定了雷达覆盖面范围 值越小范围越小
              thegema: 3, // 目标的雷达反射截面积 m2
              n: 16, //脉冲积累数
              k: 1.38 * Math.pow(10, -23), //玻尔兹曼常数
              Bn: 1.6 * Math.pow(10, 2), //接收机通频带宽度 1.6* pow(10, 6)
              Fn: 10, //雷达接收机噪声系数
              S_Delta_N: 13, //雷达接收机最小可检测信噪比 2
              T0: 290, //以绝对温度表示的雷达接收机噪声温度
              Az_SEnd_Angle: { x: 0, y: 360 }, //方位角
              Pitch_SEnd_Angle: { x: -90, y: 90 }, //俯仰角
              bParameterMiss: false,
              radius: 1500,
              maxRadius: -1,
              lobeWidth_h: 15,
              lobeWidth_v: 10, //天线图主瓣垂直宽度，单位度

              lobeWidth_halfPt_h: 7, //天线图主瓣半功率水平宽度，单位度
              lobeWidth_halfPt_v: 1.5, //天线图主瓣半功率垂直宽度，单位度
              lobeK: 0.07, //k为计算天线图的比例常数
              // 当前使用的位置  116.77067265277556 24.139422679307664

              // pos:{'x':110,'y':34,'z':1200},
              // pos:{'x':116.11102995145029,'y':23.238310896696376,'z':100},
              pos: { x: radarLng, y: radarLat, z: radarAlt },
              merctorPos: { x: 110.5, y: 34.1, z: 1200 },

              dRadarAntenaSpeed: 0.0001,
              dRadarAntenaR_S: 10, //雷达天线的开始方位角
              dRadarAntenaR_E: 100
            }
            // 1.2 更新干扰机参数
            // 1.2遍历场景内动态目标，确认地方干扰源
            if (
              typeof MSIMEarthCZMLProcessContainer !== 'undefined' ||
              typeof MSIMEarthCZMLProcessContainer.entities !== 'undefined'
            ) {
              let czmlEntities = MSIMEarthCZMLProcessContainer.entities.values
              if (typeof czmlEntities !== 'undefined') {
                // 1.2.1遍历当前干扰源集合并遍历CZML实体集合并将确认为干扰源的实体构造成干扰源填充到干扰源集合
                EarthAPP.grjh.forEach((gry) => {
                  czmlEntities.forEach((e) => {
                    // 首先确认实体为敌对阵营并且是干扰源并且开机状态
                    if (e.properties.airplaneAction._value.side === grySide) {
                      // if (e.properties.airplaneAction._value?.jammers?.Type === 'RE_JamS') {
                      if (gry.name === e.id && gry.state) {
                        let gryPosition = e.position.getValue(
                          window.EarthViewer.clock.currentTime
                        )
                        if (!window.MSIMEarth.defined(gryPosition)) return
                        let gryCartographic =
                          ellipsoid.cartesianToCartographic(gryPosition)
                        let gryLat = window.MSIMEarth.Math.toDegrees(
                          gryCartographic.latitude
                        )
                        let gryLng = window.MSIMEarth.Math.toDegrees(
                          gryCartographic.longitude
                        )
                        let gryAlt = gryCartographic.height
                        disMsg.push({
                          Pj: 10, //干扰机发射功率
                          Gj: 10, //干扰机的发射增益
                          Bj: 2 * Math.pow(10, 6), //干扰机进入雷达天线的信号带宽
                          Yj: 0.5, //为雷达天线接收干扰机信号的极化损耗
                          Kj: 2, //为指定的压制系数
                          K: 0.04, //为雷达天线的方向性系数0.04-0.1
                          Theta_Half: 20, // 雷达半功率波束宽度 单位度
                          // pos: { x: -85.53768690545911, y: -55.941874522928224, z: 1200000 }
                          pos: {
                            x: gryLng,
                            y: gryLat,
                            z: gryAlt
                          }
                        })
                      }
                    }
                  })
                })
              }
            }
            // 1.3 可视化干扰效果
            let colors2 = [
              '#020C64',
              '#071E78',
              '#11318B',
              '#1B449F',
              '#2657B3',
              '#306AC7',
              '#3B7EDB',
              '#4E8ADD',
              '#6196E0',
              '#747BE2',
              '#87AFE5',
              '#9BBCE8',
              '#99CDD0',
              '#98D6D4',
              '#97E8AD',
              '#D7DE7E',
              '#EADB70',
              '#F4D9C7',
              '#F4D963',
              '#FAD64F',
              '#F7B42D',
              '#F29B00',
              '#F19303',
              '#F0840A',
              '#EF7511',
              '#EE6618',
              '#EE581F',
              '#E74B1A',
              '#E03F16',
              '#D93312',
              '#D0240E',
              '#C20003',
              '#B50109',
              '#A90210',
              '#8A0519',
              '#6F0015',
              '#50000f'
            ]
            if (radarSide === 'blue') {
              colors2 = colors2.reverse()
            }
            function getDistance(point1, point2) {
              var point1cartographic =
                window.MSIMEarth.Cartographic.fromCartesian(point1)
              var point2cartographic =
                window.MSIMEarth.Cartographic.fromCartesian(point2)
              /**根据经纬度计算出距离**/
              var geodesic = new window.MSIMEarth.EllipsoidGeodesic()
              geodesic.setEndPoints(point1cartographic, point2cartographic)
              var s = geodesic.surfaceDistance
              //返回两点之间的距离
              s = Math.sqrt(
                Math.pow(s, 2) +
                  Math.pow(
                    point2cartographic.height - point1cartographic.height,
                    2
                  )
              )
              return s
            }
            if (disMsg.length === 0) {
              RadarMsg.lanBuda = 0.086
            }
            // let distanceRes = getDistance(oPosition, curP)
            let res = GerneralRadar(RadarMsg, disMsg)
            var val = res
            var positions = val.positions //new Float32Array(data.positions);
            var indices = new Uint16Array(val.indices)
            let colors = new Float32Array(val.colors)
            let curColor
            let colorsByDistance = []
            for (let i = 0; i < val.distance.length; i++) {
              const e = val.distance[i]
              if (e < 3000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(colors2[0])
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 6000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(colors2[1])
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 9000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(colors2[2])
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 12000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(colors2[3])
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 15000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(colors2[4])
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 20000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(colors2[5])
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 25000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(colors2[6])
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 30000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(colors2[7])
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 35000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(colors2[8])
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 40000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(colors2[9])
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 41000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[10]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 42000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[11]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 43000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[12]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 44000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[13]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 45000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[14]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 46000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[15]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 47000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[16]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 48000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[17]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 49000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[18]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 50000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[19]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 51000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[20]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 51500) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[21]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 52000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[22]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 52500) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[23]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 53000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[24]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 53500) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[25]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 54000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[26]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 54500) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[27]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 55000) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[28]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 55500) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[29]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 55600) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[30]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 55700) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[31]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 55800) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[32]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else if (e < 55900) {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[33]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              } else {
                curColor = window.MSIMEarth.Color.fromCssColorString(
                  colors2[36]
                )
                colorsByDistance.push(
                  curColor.red,
                  curColor.green,
                  curColor.blue,
                  0.1
                )
              }
            }
            colors = new Float32Array(colorsByDistance)

            let renderPosition = window.MSIMEarth.Cartesian3.fromDegrees(
              radarLng,
              radarLat,
              radarAlt
            )
            let rt = cusP.createTriNetPrimitive({
              position: renderPosition,
              viewer: window.EarthViewer,
              positions: positions,
              indices: indices,
              colors: colors,
              primitiveType: 'TRIANGLES',
              id: radarEntity.id + 'TRIANGLES'
            })
            let rt2 = cusP.createTriNetPrimitive({
              position: renderPosition,
              viewer: window.EarthViewer,
              positions: positions,
              indices: indices,
              colors: colors,
              primitiveType: 'LINES',
              id: radarEntity.id + 'LINES'
            })
            window.EarthViewer.scene.primitives.add(rt)
            window.EarthViewer.scene.primitives.add(rt2)
          }, 500)
        } else {
          // store.commit('setradarRender', radarconfig)
          //关闭雷达遮罩
          if (EarthAPP.ldzzInternal) {
            console.log('清除了')
            clearInterval(EarthAPP.ldzzInternal)
            EarthAPP.ldzzInternal = null
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

        // if (!item.isShow) {
        //   //根据场景进行不同操作
        //   if (store.state.curSceneName.indexOf('拦截') > -1) {
        //     window.EarthViewer.entities.values.forEach((item) => {
        //       if (item.id == entityId) {
        //         if (
        //           item.id.indexOf('sensor_command_radar') > -1 &&
        //           item.label?.text?._value &&
        //           item.label?.text?._value.indexOf('地面雷达') > -1
        //         ) {
        //           if (window.EarthViewer.scene.mode !== 2) {
        //             let t
        //             window.EarthViewer.scene.primitives._primitives.forEach(
        //               (p) => {
        //                 if (p.id && p.id === 'primitive_virtual_' + entityId) {
        //                   t = p
        //                   window.EarthViewer.scene.primitives.remove(t) //删除雷达探测效果
        //                 }
        //               }
        //             )
        //           } else {
        //             window.sceneAction.planeCzmlManage.removePlaneElectronicInterfer(
        //               entityId
        //             )
        //           }
        //         }
        //       }
        //     })
        //   } else {
        //     if (window.EarthViewer.scene.mode !== 2) {
        //       // 清除当前雷达遮罩
        //       let t
        //       window.EarthViewer.scene.primitives._primitives.forEach((p) => {
        //         if (p.id && p.id === entityId + 'radar') {
        //           t = p
        //           window.EarthViewer.scene.primitives.remove(t) //删除雷达遮罩
        //         }
        //       })
        //     } else {
        //       window.sceneAction.planeCzmlManage.removePlaneElectronicInterfer(
        //         entityId
        //       )
        //     }
        //     store.commit('setradarRender', false)
        //   }
        // } else {
        //   if (store.state.curSceneName.indexOf('拦截') > -1) {
        //     window.EarthViewer.entities.values.forEach((item) => {
        //       if (item.id == entityId) {
        //         if (
        //           item.id.indexOf('sensor_command_radar') > -1 &&
        //           item.label?.text?._value &&
        //           item.label?.text?._value.indexOf('地面雷达') > -1
        //         ) {
        //           radarCreateBylanjieScenario(item, entityId)
        //         }
        //       }
        //     })
        //   } else {
        //     resumeSingleRadar(entityId)
        //     store.commit('setradarRender', radarconfig)
        //   }
        // }
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

// 更新版 暂不使用
// const radarRenderStatic = (entityId, item) => {
//   let radarStateList = store.getters.getRadarRenderConfig // 雷达状态集合
//   let radarconfig = true
//   radarStateList.forEach((e) => {
//     if (e.radarName === entityId) {
//       e.radarState = item.isShow
//     }
//     radarconfig = radarconfig && e.radarState
//   })
//   let cusP = new window.EarthPlugn.customPritive(
//     window.MSIMEarth,
//     window.EarthViewer
//   )
//   if (item.isShow) {
//     if (EarthAPP.ldzzInternal) {
//       console.log('清除雷达遮罩', entityId)
//       clearInterval(EarthAPP.ldzzInternal)
//       // 清除雷达遮罩
//       window.EarthViewer.scene.primitives._primitives.forEach((e) => {
//         if (e.id && e.id == entityId + 'TRIANGLES') {
//           window.EarthViewer.scene.primitives.remove(e)
//         }
//       })
//       window.EarthViewer.scene.primitives._primitives.forEach((e) => {
//         if (e.id && e.id == entityId + 'LINES') {
//           window.EarthViewer.scene.primitives.remove(e)
//         }
//       })
//     }
//     // 显示雷达遮罩，每500毫秒更新一次
//     // 1获取场景内地方干扰源,包括阵营判断、距离判断、参数详情等内容，暂时只有阵营和距离
//     EarthAPP.ldzzInternal = setInterval(() => {
//       // 1.0 如果存在则清除当前雷达渲染图元
//       window.EarthViewer.scene.primitives._primitives.forEach((e) => {
//         if (e.id && e.id == entityId + 'TRIANGLES') {
//           window.EarthViewer.scene.primitives.remove(e)
//         }
//       })
//       window.EarthViewer.scene.primitives._primitives.forEach((e) => {
//         if (e.id && e.id == entityId + 'LINES') {
//           window.EarthViewer.scene.primitives.remove(e)
//         }
//       })
//       // 1.1获取雷达位置并配置雷达属性
//       let radarEntity = window.EarthPlugn.entity._GetCZMLEntity(
//         entityId,
//         'MSIMEarthCZMLProcessContainer'
//       )
//       if (!window.MSIMEarth.defined(radarEntity)) return
//       let radarPosition = radarEntity.position.getValue(
//         window.EarthViewer.clock.currentTime
//       )
//       if (!window.MSIMEarth.defined(radarPosition)) return
//       let ellipsoid = window.EarthViewer.scene.globe.ellipsoid
//       let radarCartographic = ellipsoid.cartesianToCartographic(radarPosition)
//       let radarLat = window.MSIMEarth.Math.toDegrees(radarCartographic.latitude)
//       let radarLng = window.MSIMEarth.Math.toDegrees(
//         radarCartographic.longitude
//       )
//       let radarAlt = radarCartographic.height

//       let renderPosition = window.MSIMEarth.Cartesian3.fromDegrees(
//         radarLng,
//         radarLat,
//         radarAlt
//       )
//       getRader3DStatic(`./static/data/geojson/radar干扰/${entityId}.json`).then(
//         (res) => {
//           let radarSide = radarEntity.properties?.side?._value
//           let colors = []
//           switch (radarSide) {
//             case 'red':
//               res.probabilities.forEach((p) => {
//                 switch (p) {
//                   case 10:
//                     colors.push(1.0, 0.0, 0.0, 0.4)
//                     break
//                   case 9:
//                     colors.push(1.0, 0.0, 0.0, 0.4)
//                     break
//                   case 8:
//                     colors.push(1.0, 0.0, 0.0, 0.4)
//                     break
//                   case 7:
//                     colors.push(1.0, 0.0, 0.0, 0.3)
//                     break
//                   case 6:
//                     colors.push(1.0, 0.0, 0.0, 0.3)
//                     break
//                   case 5:
//                     colors.push(1.0, 0.0, 0.0, 0.3)
//                     break
//                   case 4:
//                     colors.push(1.0, 0.0, 0.0, 0.2)
//                     break
//                   case 3:
//                     colors.push(1.0, 0.0, 0.0, 0.2)
//                     break
//                   case 2:
//                     colors.push(1.0, 0.0, 0.0, 0.2)
//                     break
//                   case 1:
//                     colors.push(1.0, 0.0, 0.0, 0.1)
//                     break
//                   case 0:
//                     colors.push(1.0, 0.0, 0.0, 0.1)
//                     break
//                   default:
//                     break
//                 }
//               })
//               break
//             case 'blue':
//               res.probabilities.forEach((p) => {
//                 switch (p) {
//                   case 10:
//                     colors.push(0.0, 0.0, 1.0, 0.4)
//                     break
//                   case 9:
//                     colors.push(0.0, 0.0, 1.0, 0.4)
//                     break
//                   case 8:
//                     colors.push(0.0, 0.0, 1.0, 0.4)
//                     break
//                   case 7:
//                     colors.push(0.0, 0.0, 1.0, 0.3)
//                     break
//                   case 6:
//                     colors.push(0.0, 0.0, 1.0, 0.3)
//                     break
//                   case 5:
//                     colors.push(0.0, 0.0, 1.0, 0.3)
//                     break
//                   case 4:
//                     colors.push(0.0, 0.0, 1.0, 0.2)
//                     break
//                   case 3:
//                     colors.push(0.0, 0.0, 1.0, 0.2)
//                     break
//                   case 2:
//                     colors.push(0.0, 0.0, 1.0, 0.2)
//                     break
//                   case 1:
//                     colors.push(0.0, 0.0, 1.0, 0.1)
//                     break
//                   case 0:
//                     colors.push(0.0, 0.0, 1.0, 0.1)
//                     break
//                   default:
//                     break
//                 }
//               })
//               break
//             default:
//               break
//           }

//           let rt = cusP.createTriNetPrimitive({
//             position: renderPosition,
//             viewer: window.EarthViewer,
//             positions: res.positions,
//             indices: res.indices,
//             colors: colors,
//             primitiveType: 'TRIANGLES',
//             id: radarEntity.id + 'TRIANGLES'
//           })
//           let rt2 = cusP.createTriNetPrimitive({
//             position: renderPosition,
//             viewer: window.EarthViewer,
//             positions: res.positions,
//             indices: res.indices,
//             colors: colors,
//             primitiveType: 'LINES',
//             id: radarEntity.id + 'LINES'
//           })
//           window.EarthViewer.scene.primitives.add(rt)
//           window.EarthViewer.scene.primitives.add(rt2)
//         }
//       )
//     }, 1000)
//   } else {
//     // store.commit('setradarRender', radarconfig)
//     //关闭雷达遮罩
//     if (EarthAPP.ldzzInternal) {
//       console.log('清除了')
//       clearInterval(EarthAPP.ldzzInternal)
//       EarthAPP.ldzzInternal = null
//       window.EarthViewer.scene.primitives._primitives.forEach((e) => {
//         if (e.id && e.id == entityId + 'TRIANGLES') {
//           window.EarthViewer.scene.primitives.remove(e)
//         }
//       })
//       window.EarthViewer.scene.primitives._primitives.forEach((e) => {
//         if (e.id && e.id == entityId + 'LINES') {
//           window.EarthViewer.scene.primitives.remove(e)
//         }
//       })
//     }
//   }
// }
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
