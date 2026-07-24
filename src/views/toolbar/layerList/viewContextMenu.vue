<template>
  <ul class="viewContextMenu" :style="vueData.styles">
    <div class="closeImg">
      <span class="entityName">{{
        store.state.sceneModule.currentFlyType.chineseName
      }}</span>
      <img
        src="@/assets/image/panelIcons/关闭icon.png"
        alt=""
        class="close_Sty"
        @click="handleClose"
      />
    </div>
    <viewConfig :viewList="vueData.viewList"></viewConfig>
    <layerConfig :layerList="vueData.layerList"></layerConfig>
    <!-- <renderConfig :renderList="vueData.renderList"></renderConfig> -->
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
    // {
    //   name: '第一视角',
    //   urlon: '第一视角on.png',
    //   urloff: '第一视角off.png',
    //   isShow: false,
    //   disabled: false
    // },
    {
      name: '第三视角',
      urlon: '第三视角on.png',
      urloff: '第三视角off.png',
      isShow: false,
      disabled: false
    }
    // {
    //   name: '场景视角',
    //   urlon: '场景视角on.png',
    //   urloff: '场景视角off.png',
    //   isShow: false,
    //   disabled: false
    // }
  ],
  layerList: [
    // {
    //   name: '天气',
    //   urlon: '天气on.png',
    //   urloff: '天气off.png',
    //   isShow: store.state.sceneModule.toolbarGlobalConfig.vectorWeather,
    //   disabled: false
    // },
    // {
    //   name: '雷达探测',
    //   urlon: '雷达探测on.png',
    //   urloff: '雷达探测off.png',
    //   isShow: true,
    //   disabled: true
    // },
    {
      name: '标签详标',
      urlon: '标签详标on.png',
      urloff: '标签详标off.png',
      isShow: false,
      disabled: false
    },
    {
      name: '作战半径',
      urlon: '作战半径_on.png',
      urloff: '作战半径_off.png',
      isShow: false,
      disabled: false
    },
    {
      name: '火力半径',
      urlon: '火力半径_on.png',
      urloff: '火力半径_off.png',
      isShow: false,
      disabled: false
    },
    {
      name: '侦察半径',
      urlon: '侦察半径_on.png',
      urloff: '侦察半径_off.png',
      isShow: false,
      disabled: false
    },
    {
      name: '链路信息',
      urlon: '指挥链路on.png',
      urloff: '指挥链路off.png',
      isShow: false,
      disabled: false
    },
    {
      name: '变更位置',
      urlon: '变更位置_on.png',
      urloff: '变更位置_off.png',
      isShow: false,
      disabled: false
    },
    {
      name: '弹药配置',
      urlon: '弹药配置_on.png',
      urloff: '弹药配置_off.png',
      isShow: false,
      disabled: false
    },
    {
      name: '目标距离',
      urlon: '目标距离on.png',
      urloff: '目标距离off.png',
      isShow: false,
      disabled: false
    },
    {
      name: '正北方向',
      urlon: '正北方向设置on.png',
      urloff: '正北方向设置off.png',
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
    }
  ],
  renderList: [
    // {
    //   name: '孪生场景',
    //   urlon: '孪生场景on.png',
    //   urloff: '孪生场景off.png',
    //   isShow: store.state.sceneModule.showUEContainer
    // },
    {
      name: '语音交互',
      urlon: '语音交互on.png',
      urloff: '语音交互off.png',
      isShow: store.state.sceneModule.toolbarGlobalConfig.voiceInteraction
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
  styles: {}
})
onMounted(() => {
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
  // console.log(vueData.styles)
  moveBtnPanel('viewContextMenu')
  setTimeout(() => {
    changePosNow()
    fireTargetEntity()
  }, 800)
})

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
  // emitter.emit('setRightClick', false)
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
  width: 584px;
  height: 90px;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  position: fixed;
  right: 30px;
  top: 40%;
  display: flex;
  align-items: flex-end;
  padding: 0;
  margin: 0;
  padding-left: 12px;
  padding-bottom: 10px;
  box-sizing: border-box;
  z-index: 1000;

  .closeImg {
    .entityName {
      color: #00c7fb;
      position: absolute;
      top: 10px;
      left: 12px;
      cursor: pointer;
      font-size: 16px;

      &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 15px;
        margin-right: 5px;
        vertical-align: middle;
        background: #1092d5;
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
