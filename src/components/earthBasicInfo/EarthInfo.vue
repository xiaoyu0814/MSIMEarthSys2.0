<template>
  <div class="earth-info">
    <div id="lng-lat-info" class="lng-lat-info text-stroke"></div>
    <div id="camera-height" class="camera-height text-stroke"></div>
  </div>
</template>
<script setup>
import { ref } from 'vue'
</script>

<style lang="less" scoped>
.lng-lat-info {
  position: fixed;
  right: 246px;
  bottom: 3px;
  color: #000;
  z-index: 9999;
  font-weight: 800;
  font-size: 14px;
}

.camera-height {
  position: fixed;
  right: 135px;
  bottom: 3px;
  color: #000;
  z-index: 9999;
  display: block;
  font-weight: 800;
  font-size: 14px;
}
</style>
