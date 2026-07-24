<!--
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2025-04-25 09:06:07
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2025-04-27 09:35:19
 * @FilePath: \MSIMEarthSys1.0\src\views\scenePage\thematicAnalysisComp\actionTrack\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="actionTrack">
    <header style="font-size: 20px; padding: 10px 0">行动轨迹</header>
    <EarthViewer2 :isShowListBox="true" />
  </div>
</template>

<script setup>
import EarthViewer2 from '@/views/3D/EarthViewer2.vue'
</script>

<style lang="less" scoped>
#actionTrack {
  position: absolute;
  top: 12%;
  left: 50%;
  transform: translate(-50%, 0%);
  z-index: 999;
  width: 1200px;
  //min-height:72%;
  height: calc(88vh - 220px);
  // background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-color: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  color: #ffffff;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
</style>
