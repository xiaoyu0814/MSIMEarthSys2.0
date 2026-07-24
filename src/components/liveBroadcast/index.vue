<template>
  <div class="liveBroadcast">
    <HomeHeader :showList="'zhibo'" />
    <iframe
      :src="vueData.url"
      style="
        width: 100%;
        height: calc(100% - 55px);
        margin-top: 55px;
        background-color: #00284c;
      "
      frameborder="0"
      allow="microphone"
    >
    </iframe>
  </div>
</template>

<script setup>
import HomeHeader from '@/views/homeHeader/HomeHeader'
import { reactive } from 'vue'
const vueData = reactive({
  url: serverUrls.liveBroadcastUrl
})
</script>

<style lang="less" scoped>
.liveBroadcast {
  width: 100%;
  height: 100%;
}
</style>
