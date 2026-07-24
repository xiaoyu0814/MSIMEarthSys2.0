<!--
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-05-08 14:37:30
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2026-06-04 18:34:11
 * @FilePath: \MSIMEarthSysN\src\views\toolbar\layerList\viewContextMenuComp\viewConfig.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <li class="viewConfig" v-for="(item, index) in props.viewList" :key="index" @click="viewClick(item, index)">
    <el-tooltip class="box-item" effect="dark" :content="item.disabled ? '该功能不可用' : item.name" placement="bottom-start">
      <img :src="require(`@/assets/image/rightNavbar/viewContextMenu/${item.urlon}`)
        " v-if="item.isShow" />
      <img :src="require(`@/assets/image/rightNavbar/viewContextMenu/${item.urloff}`)
        " v-else />
    </el-tooltip>
  </li>
</template>

<script setup>
import { ElMessage } from 'element-plus'
import emitter from '@/utils/eventbus'
import { reactive, onMounted, ref } from 'vue'
import { changeCameraView } from '@/utils/earthPlugin/ThirdParty/cameraControl/cameraControl'
import { detailedSignageCheckChange } from '@/views/toolbar/layerList/hooks/showHideConfig'
import store from '@/store'
const props = defineProps({
  viewList: {
    type: Array,
    defind: {}
  }
})

// watch(
//   () => store.state.sceneModule.getViewerState,
//   (newVal, oldVal) => {
//     if (newVal) {
//     }
//   },
//   { immediate: true, deep: true }
// )

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
      panel_show_hidden(false)
      store.commit('experimentModule/SET_FLY_CONTROL', true)// 开启镜头跳转
      break
    case '第一视角':
      changeCameraView(store.getters.getCurrentNode.code, 'first')
      store.commit('setViewerState', 1)
      emitter.emit('showUI', false)
      emitter.emit('showDeduce', false)
      planLine_show_hidden(false)
      panel_show_hidden(false)
      store.commit('experimentModule/SET_FLY_CONTROL', true)// 开启镜头跳转
      break
    case '第三视角':
      changeCameraView(store.getters.getCurrentNode.code, 'three')
      store.commit('setViewerState', 2)
      emitter.emit('showUI', true)
      emitter.emit('showDeduce', true)
      planLine_show_hidden(true)
      panel_show_hidden(true)
      store.commit('experimentModule/SET_FLY_CONTROL', false)// 关闭镜头跳转
      removePopUp() // 删除PopUp气泡
      break
    case '场景视角':
      changeCameraView(store.getters.getCurrentNode.code, 'viewAngle')
      store.commit('setViewerState', 3)
      emitter.emit('showUI', false)
      emitter.emit('showDeduce', false)
      planLine_show_hidden(false)
      panel_show_hidden(false)
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
  width: 34px;
  height: 34px;
  padding-right: 5px;
  margin-right: 5px;

  //border-right: 1px solid;
  img {
    width: 30px;
    height: 30px;
  }

  // &:nth-child(5n) {
  //   border-right: 1px solid;
  // }
}
</style>
