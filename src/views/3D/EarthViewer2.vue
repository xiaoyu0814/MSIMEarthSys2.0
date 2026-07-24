<!--
 * @Author: root you@example.com
 * @Date: 2024-07-05 17:14:02
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2025-05-15 13:43:35
 * @FilePath: \MSIMEarthSysN\src\views\3D\EarthViewer.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div
    :class="
      store.state.sceneModule.currentScreen == 'earthView'
        ? 'containerFullScreen'
        : 'containerSmallScreen'
    "
  >
    <div id="container"></div>
    <div id="hawkEyeMap" v-show="showHawkEye">
      <div id="hawkEye3dMap"></div>
    </div>
  </div>
</template>

<script>
// 工具条
// import ToolBar from '@/components/toolBar/ToolBar.vue'
import { onMounted, ref, watch, computed, shallowRef } from 'vue'
import { useStore } from 'vuex'
import { earth } from './hooks/index'
import store from '@/store'
import emitter from '@/utils/eventbus'

// import moment from 'moment'
// vue2中是export default Vue.extend; vue3中是 export default defineComponent
export default {
  name: 'EarthViewer',
  components: {},
  setup() {
    earth()
    let showHawkEye = ref(false)
    emitter.on('showHawkEye', (res) => {
      showHawkEye.value = res
    })
    return { store, showHawkEye }
  }
}
</script>

<style lang="less" scoped>
.containerFullScreen {
  position: absolute;
  width: 100%;
  height: 100%;
  #container {
    width: 100%;
    height: 100%;
  }
}
.containerSmallScreen {
  position: absolute;
  bottom: 32px;
  right: 0%;
  width: 550px;
  height: 500px;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 99;
  #container {
    position: relative;
    width: 98.8%;
    height: 97.4%;
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;
  }
}
#hawkEyeMap {
  position: absolute;
  top: 10%;
  right: 5%;
  #hawkEye3dMap {
    position: absolute;
    right: 5%;
    top: 10%;
    border-radius: 50%;
    height: 200px;
    width: 200px;
    overflow: hidden;
    border: 2px solid #002fa7;
  }
}

:deep .cesium-viewer-toolbar {
  display: none;
}
:deep .cesium-viewer-timelineContainer {
  // left: 2% !important;
  bottom: 7% !important;
  // width: 96% !important;
  z-index: 12;
  height: 50px !important;
  width: 62%;
  left: 19% !important;
}
:deep .cesium-timeline-bar {
  background: none !important;
  border-bottom: 1px solid #3093d5 !important;
  height: 50px !important;
  top: -1px !important;
  // width: 100% !important;
  // left: 18% !important;
}

:deep .cesium-timeline-main {
  border: none !important;
}
:deep .cesium-timeline-ticLabel {
  top: 7px !important;
}
:deep .cesium-timeline-icon16 {
  width: 17px !important;
  height: 25px !important;
}
:deep .cesium-viewer-animationContainer {
  visibility: hidden;
}
</style>
