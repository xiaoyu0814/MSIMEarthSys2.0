<template>
  <div id="spaceDomain">
    <EarthViewer2 :isShowListBox="false" :type="'chart'" />
  </div>
</template>

<script setup>
import EarthViewer2 from '@/views/3D/EarthViewer2.vue'
</script>

<style scoped>
#spaceDomain {
  width: 100%;
  height: 100%;
}
</style>
