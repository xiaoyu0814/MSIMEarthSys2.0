<template>
  <div id="chat">
    <iframe
      :src="vueData.url"
      style="
        width: 100%;
        height: 100%;
        min-height: 700px;
        background-color: #00284c;
      "
      frameborder="0"
      allow="microphone"
    >
    </iframe>
  </div>
</template>
<script setup>
import { reactive } from 'vue'

const vueData = reactive({
  url: 'http://192.168.1.110/chatbot/LKXMg13AbeEZxd7z' //serverUrls.AIUrl + '/chatbot/' + serverUrls.token
})
</script>
<style lang="less" scoped>
#chat {
  position: fixed;
  bottom: 150px;
  right: 100px;
  width: 400px;
}
</style>
<style lang="less"></style>
