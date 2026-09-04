<!--
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-05-07 14:29:54
 * @LastEditors: root you@example.com
 * @LastEditTime: 2024-08-21 19:14:21
 * @FilePath: \MSIMEarthSysN\src\views\toolbar\layerList\viewContextMenuComp\showMoreConfig.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <li class="showMoreConfig" v-for="(item, index) in props.moreList" :key="index" @click="moreClick(item, index)"
    :class="{ 'active': item.isShow }">
    <el-tooltip class="box-item" effect="dark" :content="item.disabled ? '该功能不可用' : item.name" placement="left">
      <img :src="getThemeImg(item.urlon)" v-if="item.isShow" />
      <img :src="getThemeImg(item.urloff)" v-else />
    </el-tooltip>
    <div class="contentName" :class="{ 'activeName': item.isShow }">{{ item.name }}</div>
  </li>
</template>

<script setup>
import emitter from '@/utils/eventbus'
import { reactive, onMounted, ref } from 'vue'
import { removeEventHandler } from '@/views/toolbar/layerList/hooks/guideCommand'
import { themeType } from '@/config/theme.js'
const props = defineProps({
  moreList: {
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
  emitter.on('setMoreChecked', (value) => {
    props.moreList[0].isShow = value
  })
})
const moreClick = (item, index) => {
  if (item.disabled) return
  props.moreList[0].isShow = !props.moreList[0].isShow
  // 打开详情菜单
  emitter.emit('showConfigPanel', props.moreList[0].isShow)
  removeEventHandler() //移除快捷事件监听
}
</script>

<style lang="less" scoped>
.showMoreConfig {
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
