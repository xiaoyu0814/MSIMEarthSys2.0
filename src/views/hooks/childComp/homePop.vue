<template>
  <div class="home-pop">
    <!-- 图例 -->
    <connectionLegend v-if="state.isShowconnectionLegend"></connectionLegend>
    <!-- 想定详情-->
    <XDDetail v-if="state.isShowDetails"></XDDetail>
    <!--  视角配置和显隐配置弹框 -->
    <viewAndIsShowConfig v-if="state.isShowviewAndShow"></viewAndIsShowConfig>
    <!--  卫星信息弹窗 -->
    <satellite v-if="state.isShowsatellite"></satellite>
    <videoChat v-if="state.isShowvideo"></videoChat>
    <!--  快捷菜单弹窗 -->
    <viewContextMenu
      :isShowviewContextMenu="state.isShowviewContextMenu"
      v-if="state.isShowviewContextMenu.show"
    >
    </viewContextMenu>
    <!-- 简要信息弹窗 -->
    <MoveMore v-if="state.isShowviewAndShow02 && state.BriefShow"></MoveMore>
    <!-- 右键菜单--改变位置及弹药设置以及快捷显示攻击弹框显隐弹框 -->
    <commandControl
      v-if="state.commandControlIsShow"
      :commandFormData="state.commandFormData"
    ></commandControl>
    <!-- 等高线图例 -->
    <contourlineLegend v-if="state.isShowContourlineLegend"></contourlineLegend>
  </div>
</template>

<script setup>
import emitter from '@/utils/eventbus'
import { reactive, onMounted, ref } from 'vue'
import connectionLegend from '@/components/content/connectionLegend/index.vue' //图例面板
import XDDetail from '@/views/seatManagement/adminuser/sceneManagement/XDDetail.vue' // 想定详情
import viewAndIsShowConfig from '@/views/toolbar/layerList/viewAndIsShowConfig.vue' // 视角配置和显隐配置
import satellite from '@/components/sate/index.vue' // 卫星信息弹窗
import videoChat from '@/views/scenePage/sceneConfigComp/videoConfig/video.vue'
import viewContextMenu from '@/views/toolbar/layerList/viewContextMenu.vue' // 快捷菜单
import MoveMore from '@/components/MoveComponet/MoveMore.vue'
import store from '@/store'
import commandControl from '@/views/toolbar/layerList/commandControl.vue'
import contourlineLegend from '@/components/content/contourlineLegend/index.vue' //等高线图例面板
import { permissionList } from '@/components/permission/data.js'

onMounted(() => {
  // 权限
  getPermissionList()
  // 连线图例
  emitter.on('changeConnectionLegend', (val) => {
    state.isShowconnectionLegend = val
  })
  // 显示想定详情
  emitter.on('isShowDetails', (val) => {
    state.isShowDetails = val
  })
  // 相机视角和显隐配置面板显隐
  emitter.on('showConfigPanel', (val) => {
    state.isShowviewAndShow = val
  })
  //是否显示右键指令弹框
  emitter.on('showCommandControl', (value) => {
    if (
      value.commandFormData.command == '变更传感器开关' ||
      value.commandFormData.command == '变更航向' ||
      value.commandFormData.command == '变更平台速度' ||
      value.commandFormData.command == '销毁' ||
      value.commandFormData.command == '攻击目标' ||
      value.commandFormData.command == '变更平台干扰状态'
    ) {
      state.commandControlIsShow == false
    } else {
      state.commandControlIsShow = value.isShow
      if (value.isShow) {
        state.commandFormData.command = value.commandFormData.command
        state.commandFormData.sourceName = value.commandFormData['sourceName']
        state.commandFormData.targetName = value.commandFormData['targetName']
        state.commandFormData.longitude = value.commandFormData['longitude']
        state.commandFormData.latitude = value.commandFormData['latitude']
        state.commandFormData.height = value.commandFormData['height']
        state.commandFormData.weaponsArr = value.commandFormData['weaponsArr']
      }
    }
  })
  // 卫星信息弹窗显隐
  emitter.on('Showsatellite', (val) => {
    state.isShowsatellite = val
  })
  // 视频小窗口
  emitter.on('Showvideo', (val) => {
    state.isShowvideo = val
  })

  // // 打开详情快捷菜单
  // emitter.on('showViewContextMenu', (val) => {
  //   console.log(val)
  //   state.isShowviewContextMenu = val
  //   store.commit('setToolBarType', val.show)
  //   // store.commit('setToolBarLocation', val)
  // })
  // 关闭详情快捷菜单
  emitter.on('closeViewContextMenu', (val) => {
    state.isShowviewContextMenu = val.show
  })
  //是否快捷显示攻击弹框
  emitter.on('showFirePanel', (value) => {
    state.commandControlIsShow = value.isShow
    if (value.isShow) {
      state.commandFormData.command = value.commandFormData.command
      state.commandFormData.sourceName = value.commandFormData['sourceName']
      state.commandFormData.targetName = value.commandFormData['targetName']
      state.commandFormData.weaponsArr = value.commandFormData['weaponsArr']
      state.commandFormData['sensoresArr'] =
        value.commandFormData['sensoresArr']
    }
  })
  // 等高线图例
  emitter.on('changeContourlineLegend', (val) => {
    state.isShowContourlineLegend = val
  })

  //简要信息弹窗
  emitter.on('setRightClick', (val) => {
    console.log(val)
    state.isShowviewAndShow02 = val
    state.BriefShow = store.state.sceneModule.systemConfig.BriefShow
  })
})

const state = reactive({
  isShowDetails: false, //是否显示想定详情
  isShowviewAndShow: false, //是否显示视角配置和显隐配置
  isShowCommand: false, //是否显示右键指令面板
  isShowconnectionLegend: false, //是否显示图例面板
  isShowsatellite: false, //是否显示卫星信息弹窗
  isShowvideo: false, //是否显示卫星信息弹窗
  isShowviewContextMenu: {
    show: false
  }, // 快捷菜单弹窗
  commandControlIsShow: false, //是否快捷显示攻击弹框
  commandFormData: {}, //快捷攻击弹框信息
  isShowContourlineLegend: false, //是否显示等高线图例面板
  isShowviewAndShow02: false,
  BriefShow: false,
  userPermissionList: {}
})
const getPermissionList = () => {
  // 获取用户权限列表
  let userRole = window.localStorage.getItem('roleCode')
  state.userPermissionList = permissionList[userRole]
  if (state.userPermissionList?.buttonList?.indexOf(1) > -1) {
    // 打开详情快捷菜单
    emitter.on('showViewContextMenu', (val) => {
      console.log(val)
      state.isShowviewContextMenu = val
      store.commit('setToolBarType', val.show)
      // store.commit('setToolBarLocation', val)
    })
  }
}
</script>

<style lang="less" scoped></style>
