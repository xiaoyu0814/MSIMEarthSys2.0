<!--
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-05-08 14:37:30
 * @LastEditors: chenguopeng2 chenguopeng.piesat.cn
 * @LastEditTime: 2026-08-13 14:04:44
 * @FilePath: \MSIMEarthSysN\src\views\toolbar\layerList\viewContextMenuComp\viewConfig.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <li class="viewConfig" v-for="(item, index) in props.viewList" :key="index" @click="viewClick(item, index)"
    :class="{ 'active': item.isShow }">
    <el-tooltip class="box-item" effect="dark" :content="item.disabled ? '该功能不可用' : item.name" placement="left">
      <img :src="getThemeImg(item.urlon)" v-if="item.isShow" />
      <img :src="getThemeImg(item.urloff)" v-else />
    </el-tooltip>
    <div class="contentName" :class="{ 'activeName': item.isShow }">{{ item.name }}</div>
  </li>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import emitter from '@/utils/eventbus'
import { reactive, onMounted, ref } from 'vue'
import { changeCameraView } from '@/utils/earthPlugin/ThirdParty/cameraControl/cameraControl'
import { detailedSignageCheckChange } from '@/views/toolbar/layerList/hooks/showHideConfig'
import { themeType } from '@/config/theme.js'
import store from '@/store'
const props = defineProps({
  viewList: {
    type: Array,
    defind: {}
  }
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
onMounted(() => {
  if (window.EarthViewer.scene.mode === 2) {
    //第一和锁定视角不可用
    props.viewList[1].disabled = true
    props.viewList[2].disabled = true
  }
  if (store.getters.getChangeCameraView == '第三视角') {
    props.viewList.forEach((element) => {
      element.isShow = false
    })
    props.viewList[1].isShow = true
  }
  emitter.on("changeViewToFree", () => {
    viewClick(props.viewList[0], 0)

  })
})

const viewClick = (item, index) => {
  if (item.disabled) return
  props.viewList.forEach((element) => {
    element.isShow = false
  })
  props.viewList[index].isShow = true
  if (item.name == '第一视角' || item.name == '第三视角') {
    if (window.EarthViewer.scene.mode != 3) {
      ElMessage.error('此视角只能在三维下进行切换!')
      return false
    }
  }
  store.commit('setChangeCameraView', item.name)
  switch (item.name) {
    case '自由视角':
      changeCameraView(store.getters.getCurrentNode.code, 'free')
      store.commit('setViewerState', 0)
      emitter.emit('showUI', false)
      emitter.emit('showDeduce', false)
      planLine_show_hidden(false)
      //panel_show_hidden(false)
      store.commit('experimentModule/SET_FLY_CONTROL', true)// 开启镜头跳转
      break
    case '第一视角':
      changeCameraView(store.getters.getCurrentNode.code, 'first')
      store.commit('setViewerState', 1)
      emitter.emit('showUI', false)
      emitter.emit('showDeduce', false)
      planLine_show_hidden(false)
      //panel_show_hidden(false)
      store.commit('experimentModule/SET_FLY_CONTROL', true)// 开启镜头跳转
      break
    case '第三视角':
      changeCameraView(store.getters.getCurrentNode.code, 'three')
      store.commit('setViewerState', 2)
      emitter.emit('showUI', true)
      emitter.emit('showDeduce', true)
      planLine_show_hidden(true)
      //panel_show_hidden(true)
      store.commit('experimentModule/SET_FLY_CONTROL', false)// 关闭镜头跳转
      removePopUp() // 删除PopUp气泡
      break
    case '场景视角':
      changeCameraView(store.getters.getCurrentNode.code, 'viewAngle')
      store.commit('setViewerState', 3)
      emitter.emit('showUI', false)
      emitter.emit('showDeduce', false)
      planLine_show_hidden(false)
      //panel_show_hidden(false)
      store.commit('experimentModule/SET_FLY_CONTROL', true)// 开启镜头跳转
      break
    default:
      break
  }
  console.log('viewerState', store.state.sceneModule.getViewerState)
}

const planLine_show_hidden = (res) => {
  if (res) {
    store.state.targetDetailsCheck[store.getters.getCurrentNode.code] = ['planLine']
    emitter.emit('planLineChange1', true)
  } else {
    store.state.targetDetailsCheck[store.getters.getCurrentNode.code] = []
    emitter.emit('planLineChange1', false)
  }
}

const panel_show_hidden = (res) => {
  emitter.emit('setDetailLabelChecked', res)
  let entityId = store.state.sceneModule.currentFlyType.entityId
  detailedSignageCheckChange(res)
  if (res) {
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

const removePopUp = () => {
  let div = window.document.getElementById('prompt-' + store.getters.getCurrentNode.code)
  if (div) {
    window.document.getElementById(viewer.container.id).removeChild(div)
  }
}
</script>

<style lang="less" scoped>
.viewConfig {
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
