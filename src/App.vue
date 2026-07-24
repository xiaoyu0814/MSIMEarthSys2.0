<!--
 * @Author: yuqiangqiang yqq@piesat.cn
 * @Date: 2024-08-14 15:15:32
 * @LastEditors: chenguopeng2 chenguopeng.piesat.cn
 * @LastEditTime: 2026-07-14 13:57:56
 * @FilePath: \MSIMEarthSysN\src\App.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <router-view :key="$route.fullPath" />
  <!-- <keep-alive><router-view /></keep-alive> -->
</template>

<script setup>
import { onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { refreshLimitSession, deleteLimitSession } from '@/service/login'
import { ElMessage } from 'element-plus'

const router = useRouter()

onMounted(() => {
  setInterval(() => {
    _refreshLimitSession()
  }, 4000)
})

onUnmounted(() => {
  window.localStorage.setItem('bluePrint', -1)
  _deleteLimitSession()
})

const _refreshLimitSession = () => {
  let account = window.localStorage.getItem('account')
  const params = { account }
  refreshLimitSession(params).then((res) => {
    if (res.code == 200 || res.code == 3001) {
      // 3001表示该用户可以多处登录
    } else if (res.code == 2001) {
      // 2001表示用户在其他地方登录，该用户被踢出（该用户为单点登录用户）
      let url = router.options.history.location
      if (url != '/' && url != '/login') {
        ElMessage.error(res.data)
        console.log('登录过期 ')
        //  console.log('登录过期 ')
        router.push({
          path: '/'
        })
      }
    }
  })
}

const _deleteLimitSession = () => {
  const params = {
    account: window.localStorage.getItem('account')
  }
  deleteLimitSession(params).then((res) => {
    if (res.code == 200) {
      // window.localStorage.removeItem('account')
    } else {
      ElMessage.error('登出失败')
    }
  })
}
</script>

<style lang="less">
html,
body {
  margin: 0px !important;
  width: 100%;
  height: 100%;
  padding: 0;
  overflow: hidden;
  background: #000000;
  background-size: cover;
  font-size: 10px;
  height: 100%;
  overflow: hidden;
  position: absolute;
  text-align: center;
  width: 100%;
  moz-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  -khtml-user-select: none;
  user-select: none;
}
body::selection {
  background: none;
  color: inherit;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}

#dify-chatbot-bubble-button {
  background-color: #1c64f2 !important;
}
#dify-chatbot-bubble-window {
  width: 30rem !important;
  height: 40rem !important;
  background-color: #1c64f2 !important;
}
.h-full {
  background: #1c64f2 !important;
}
:deep(.overflow-x-hidden) {
  background: #1c64f2 !important;
}
:deep(.overflow-y-hidden) {
  background: #1c64f2 !important;
}
</style>
