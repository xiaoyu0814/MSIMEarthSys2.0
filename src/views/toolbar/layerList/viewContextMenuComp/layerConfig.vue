<!--
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-05-07 09:27:43
 * @LastEditors: chenguopeng2 chenguopeng.piesat.cn
 * @LastEditTime: 2026-08-28 18:11:43
 * @FilePath: \MSIMEarthSysN\src\views\toolbar\layerList\viewContextMenuComp\layerConfig.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <li class="layerConfig" v-for="(item, index) in props.layerList" :key="index" @click="layerClick(item, index)"
    :class="{ 'active': item.isShow }">
    <el-tooltip class="box-item" effect="dark" :content="item.disabled ? '该功能不可用' : item.name" placement="left">
      <img :src="getThemeImg(item.urlon)" v-if="item.isShow" />
      <img :src="getThemeImg(item.urloff)" v-else />
    </el-tooltip>
    <div class="contentName" :class="{ 'activeName': item.isShow }">{{ item.name }}</div>
  </li>
</template>

<script setup>
import store from '@/store'
import emitter from '@/utils/eventbus'
import { reactive, onMounted, watch } from 'vue'
import { detailedSignageCheckChange } from '@/views/toolbar/layerList/hooks/showHideConfig'
import {
  getSourceAndTargetEntity,
  removeEntityMbById
} from '@/views/toolbar/layerList/hooks/guideCommand'
import {
  pathCheckChange,
  planLineChange
} from '@/views/toolbar/layerList/hooks/showHideConfig'
import { getRader3DStatic } from '@/service/radar' // 获取本地或服务器上的雷达遮罩数据
import { themeType } from '@/config/theme.js'
import {
  RE_Radar
} from '@/utils/earthPlugin/ThirdParty/eventSource/event/earthActionByEvent'

const props = defineProps({
  layerList: {
    type: Array,
    defind: {}
  }
})

const { initRadar,clearRadar } = RE_Radar()

onMounted(() => {
  const sceneAction = new window.EarthPlugn.sceneAction({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  // 是否选中实体标牌
  emitter.on('setDetailLabelChecked', (value) => {
    props.layerList[0].isShow = value
  })
  // 是否选中路径
  emitter.on('setTargetPathChecked', (value) => {
    props.layerList[1].isShow = value
  })
  // 是否选中航线
  emitter.on('setTargetPlanLineChecked', (value) => {
    props.layerList[2].isShow = value
  })
  // 是否选中传感器显隐
  emitter.on('setElectDetectChecked', (value) => {
    props.layerList[3].isShow = value
  })
  // 是否选中变更位置
  emitter.on('setLocationChecked', (value) => {
    props.layerList[4].isShow = value
  })
  // 是否选中目标距离
  emitter.on('setTargetDistanceChecked', (value) => {
    props.layerList[5].isShow = value
  })
  configToolbarState(store.state.sceneModule.currentFlyType.entityId)
})
// 根据主题类型动态加载图片资源
// 注意：Webpack 的 require() 需要静态路径前缀才能在构建时分析依赖
// 因此每个主题分支使用独立的 require() + 模板字符串，确保路径可被静态分析
const getThemeImg = (name) => {
  switch (themeType) {
    // 蓝色
    case 1:
      return require(`@/assets/image/rightNavbar/viewContextMenu/${name}`)
    // 黑色
    case 2:
      return require(`@/assets/image/rightNavbar/viewContextMenu/${name}`)
    // 白色
    case 3:
      return require(`@/assets/image/rightNavbar/viewContextMenu/${name}`)
    // 绿色
    case 4:
      return require(`@/assets/image/rightNavbar/viewContextMenu/menu_green/${name}`)
    default:
      return require(`@/assets/image/rightNavbar/viewContextMenu/${name}`)
  }
}

watch(
  () => store.state.sceneModule.currentFlyType.entityId,
  (newVal) => {
    if (newVal) configToolbarState(newVal)
  },
  { deep: true }
)

const configToolbarState = (entityId) => {

  let curEntity = window.EarthPlugn.entity._GetCZMLEntity(
    entityId,
    'MSIMEarthCZMLProcessContainer'
  )
  // 判断场景中是否存在该实体，若不存在，所有菜单不可用
  if (window.MSIMEarth.defined(curEntity)) {
    if (
      curEntity.properties &&
      typeof curEntity.properties.airplaneAction !== 'undefined'
    ) {
      //实体标牌是否可用及选中
      props.layerList[0].disabled = false
      if (
        store.state.sceneModule.toolbarEntityonfig.detailLabelList.indexOf(entityId) > -1) {
        emitter.emit('setDetailLabelChecked', true)
      } else {
        emitter.emit('setDetailLabelChecked', false)
      }

      //路径是否可用及选中
      props.layerList[1].disabled = false
      if (store.state.sceneModule.toolbarEntityonfig.pathLiist.indexOf(entityId) > -1) {
        emitter.emit('setTargetPathChecked', true)
      } else {
        emitter.emit('setTargetPathChecked', false)
      }

      //航线是否可用及选中
      props.layerList[2].disabled = false
      if (store.state.sceneModule.toolbarEntityonfig.planLineList.indexOf(entityId) > -1) {
        emitter.emit('setTargetPlanLineChecked', true)
      } else {
        emitter.emit('setTargetPlanLineChecked', false)
      }

      //传感器显隐是否可用及选中
      props.layerList[3].disabled = false
      if (store.state.sceneModule.toolbarEntityonfig.electDetectList.indexOf(entityId) > -1) {
        emitter.emit('setElectDetectChecked', true)
      } else {
        emitter.emit('setElectDetectChecked', false)
      }

      //变更位置是否可用及选中
      props.layerList[4].disabled = false
      if (store.state.sceneModule.toolbarEntityonfig.locationList.indexOf(entityId) > -1) {
        emitter.emit('setLocationChecked', true)
      } else {
        emitter.emit('setLocationChecked', false)
      }

      //目标距离是否可用及选中
      if (store.state.sceneModule.toolbarEntityonfig.targetDistanceList.indexOf(entityId) > -1) {
        props.layerList[5].disabled = false
        emitter.emit('setTargetDistanceChecked', true)
      } else {
        emitter.emit('setTargetDistanceChecked', false)
      }
    } else {
      //实体标牌
      props.layerList[0].disabled = true
      emitter.emit('setDetailLabelChecked', false)
      //路径
      props.layerList[1].disabled = true
      emitter.emit('setTargetPathChecked', false)
      //航线
      props.layerList[2].disabled = true
      emitter.emit('setTargetPlanLineChecked', false)
      //传感器显隐
      props.layerList[3].disabled = true
      emitter.emit('setElectDetectChecked', false)
      //变更位置
      props.layerList[4].disabled = true
      emitter.emit('setLocationChecked', false)
      // 目标距离
      props.layerList[5].disabled = true
      emitter.emit('setTargetDistanceChecked', false)
    }
  }
}

const layerClick = (item, index) => {
  if (item.disabled) return
  props.layerList[index].isShow = !props.layerList[index].isShow

  switch (item.name) {
    case '实体标牌':
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
    case '路径':
      {
        let entityId = store.state.sceneModule.currentFlyType.entityId
        pathCheckChange(item.isShow)
        emitter.emit('setTargetPathChecked', item.isShow)
        if (item.isShow) {
          //向列表中添加数据，再次打开右键菜单时，按钮状态为on
          store.state.sceneModule.toolbarEntityonfig.pathLiist.push(entityId)
        } else {
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
        if (item.isShow) {
          //向列表中添加数据，再次打开右键菜单时，按钮状态为on
          store.state.sceneModule.toolbarEntityonfig.planLineList.push(entityId)
        } else {
          //从列表中移除，再次打开右键菜单时，按钮状态为off
          let index =
            store.state.sceneModule.toolbarEntityonfig.planLineList.indexOf(entityId)
          if (index > -1) {
            store.state.sceneModule.toolbarEntityonfig.planLineList.splice(index, 1)
          }
        }
      }
      break
    case '传感器显隐':
      {
        let entityId = store.state.sceneModule.currentFlyType.entityId
        if (entityId === 'PAC-3') {
          if (item.isShow) {
            initRadar(entityId)
          } 
          else {
            clearRadar(entityId)
          }
        }
        else
        {
          radarRenderStatic(entityId, item)
        }
        //radarRenderStatic(entityId, item)
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
    default:
      break
  }
}

//传感器显隐方法
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
  width: 95%;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  padding-right: 5px;
  margin-right: 5px;
  margin-top: 8px;
  cursor: pointer;
  box-sizing: border-box;

  img {
    width: 30px;
    height: 30px;
  }

  .contentName {
    font-size: 14px;
    font-weight: bolder;
    color: var(--text-primary);
    margin-left: 4px;
    letter-spacing: 1.2px;
  }
}

.active {
  background-color: var(--primary-color-half);
}

.activeName {
  color: var(--title-color) !important;
}
</style>
