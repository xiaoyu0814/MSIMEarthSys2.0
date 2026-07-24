<template>
  <div id="energyDomain">
    <EarthViewer2 :isShowListBox="false" :type="'heatmap'" />
  </div>
</template>

<script setup>
import EarthViewer2 from '@/views/3D/EarthViewer2.vue'
</script>

<style scoped>
#energyDomain {
  width: 100%;
  height: 100%;
}
</style>
