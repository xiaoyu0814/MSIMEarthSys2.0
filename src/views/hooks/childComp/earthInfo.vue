<template>
  <div class="earth-info">
    <div id="lng-lat-info" class="lng-lat-info text-stroke"></div>
    <div id="camera-height" class="camera-height text-stroke"></div>
  </div>
</template>

<script setup></script>

<style lang="less" scoped>
.lng-lat-info {
  position: fixed;
  right: 185px;
  bottom: 0px;
  color: #fff;
  z-index: 9999;
  font-weight: 500;
  font-size: 12px;
}

.camera-height {
  position: fixed;
  right: 120px;
  bottom: 0px;
  color: #fff;
  z-index: 9999;
  display: block;
  font-weight: 500;
  font-size: 12px;
}
</style>
