<!--
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-05-07 14:29:54
 * @LastEditors: root you@example.com
 * @LastEditTime: 2024-08-21 19:14:21
 * @FilePath: \MSIMEarthSysN\src\views\toolbar\layerList\viewContextMenuComp\showMoreConfig.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <li
    class="showMoreConfig"
    v-for="(item, index) in props.moreList"
    :key="index"
    @click="moreClick(item, index)"
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
import emitter from '@/utils/eventbus'
import { reactive, onMounted, ref } from 'vue'
import { removeEventHandler } from '@/views/toolbar/layerList/hooks/guideCommand'
const props = defineProps({
  moreList: {
    type: Array,
    defind: {}
  }
})

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
