<template>
  <ul class="viewContextMenu" :style="vueData.styles">
    <div class="closeImg">
      <span class="entityName">{{
        vueData.entityTitle
      }}</span>
      <el-tooltip class="box-item" effect="dark" content="关闭面板" placement="top">
        <img src="@/assets/image/panelIcons/关闭icon.png" alt="" class="close_Sty" @click="handleClose" />
      </el-tooltip>
    </div>
    <viewConfig :viewList="vueData.viewList"></viewConfig>
    <layerConfig :layerList="vueData.layerList"></layerConfig>
    <showMoreConfig :moreList="vueData.moreList"></showMoreConfig>
  </ul>
</template>

<script setup>
import emitter from '@/utils/eventbus'
import store from '@/store'
import {
  reactive,
  onMounted,
  ref,
  watch,
  onBeforeMount,
  onUnmounted
} from 'vue'
import viewConfig from '@/views/toolbar/layerList/viewContextMenuComp/viewConfig.vue'
import layerConfig from '@/views/toolbar/layerList/viewContextMenuComp/layerConfig.vue'
import renderConfig from '@/views/toolbar/layerList/viewContextMenuComp/renderConfig.vue'
import showMoreConfig from '@/views/toolbar/layerList/viewContextMenuComp/showMoreConfig.vue'
import { moveBtnPanel } from '@/utils/mapTools'
import { permissionList } from '@/components/permission/data.js'
import {
  changePosNow,
  fireTargetEntity,
  changePosNowByDragEntity,
  removeEventHandler
} from '@/views/toolbar/layerList/hooks/guideCommand'
const props = defineProps({
  isShowviewContextMenu: {
    type: Object,
    defind: {}
  }
})

let vueData = reactive({
  viewList: [
    {
      name: '自由视角',
      urlon: '自由视角on.png',
      urloff: '自由视角off.png',
      isShow: true,
      disabled: false
    },
    {
      name: '第三视角',
      urlon: '第三视角on.png',
      urloff: '第三视角off.png',
      isShow: false,
      disabled: false
    }
  ],
  layerList: [
    {
      name: '实体标牌',
      urlon: '标签详标on.png',
      urloff: '标签详标off.png',
      isShow: false,
      disabled: false
    },
    {
      name: '路径',
      urlon: '路径on.png',
      urloff: '路径off.png',
      isShow: false,
      disabled: false
    },
    {
      name: '航线',
      urlon: '航线on.png',
      urloff: '航线off.png',
      isShow: false,
      disabled: false
    },
    {
      name: '传感器显隐',
      urlon: '雷达探测on.png',
      urloff: '雷达探测off.png',
      isShow: false,
      disabled: false
    },
    {
      name: '变更位置',
      urlon: '变更位置on.png',
      urloff: '变更位置off.png',
      isShow: false,
      disabled: false
    },
    {
      name: '目标距离',
      urlon: '目标距离on.png',
      urloff: '目标距离off.png',
      isShow: false,
      disabled: false
    }
  ],
  moreList: [
    {
      name: '更多',
      urlon: '更多on.png',
      urloff: '更多off.png',
      status: 'off',
      isShow: false,
      disabled: false
    }
  ],
  styles: {},
  entityTitle: '战斗机'
})
onMounted(() => {
  vueData.entityTitle = store.state.sceneModule.currentFlyType.chineseName
  // 获取当前登录角色
  const roleCode = localStorage.getItem('roleCode') || 'shiyan'

  // 获取当前角色的权限配置
  const rolePermission = permissionList[roleCode]
  const rightBarList = rolePermission.rightBarList || { item: [], more: false }

  // 更新layerList中按钮的disabled状态
  vueData.layerList.forEach((item) => {
    // 如果rightBarList.item中不包含当前按钮名称，则禁用该按钮
    item.disabled = !rightBarList.item.includes(item.name)
  })

  // 更新moreList中按钮的disabled状态
  vueData.moreList[0].disabled = !rightBarList.more

  vueData.styles.left = props.isShowviewContextMenu.x + 'px'
  vueData.styles.top = props.isShowviewContextMenu.y + 'px'
  moveBtnPanel('viewContextMenu')
  setTimeout(() => {
    changePosNow()
    fireTargetEntity()
  }, 800)
})

// 深度监听
watch(
  () => store.state.sceneModule.currentFlyType,
  (newValue, oldValue) => {
    vueData.entityTitle = newValue.chineseName
  },
  { deep: true }
)

onUnmounted(() => {
  removeEventHandler()
})
const handleClose = () => {
  let obj = {
    show: false
  }
  let obj1 = {
    isShow: false,
    commandFormData: {
      command: ''
    }
  }

  emitter.emit('showViewContextMenu', obj)
  emitter.emit('showCommandControl', obj1)
}
watch(
  () => props.isShowviewContextMenu,
  (newVal, oldVal) => {
    if (newVal.x) {
      vueData.styles.left = newVal.x + 'px'
      vueData.styles.top = newVal.y + 'px'
    }
  },
  { deep: true }
)
</script>

<style lang="less" scoped>
.viewContextMenu {
  width: 180px;
  height: 400px;
  background: var(--panel-bg);
  box-shadow: var(--box-shadow-glow);
  border-top: 2px solid var(--border-color);
  border-bottom: 1px solid var(--border-color);
  position: fixed;
  right: 30px;
  top: 40%;
  // display: flex;
  // align-items: flex-end;
  padding: 0;
  margin: 0;
  padding-left: 12px;
  padding-bottom: 10px;
  padding-top: 40px;
  box-sizing: border-box;
  z-index: 1000;

  .closeImg {
    .entityName {
      color: var(--title-color);
      position: absolute;
      top: 10px;
      left: 12px;
      cursor: pointer;
      font-size: 16px;

      &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 16px;
        margin-right: 10px;
        margin-bottom: 4px;
        vertical-align: middle;
        background: var(--border-color);
      }
    }

    .close_Sty {
      width: 18px;
      height: 18px;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }
  }
}
</style>
