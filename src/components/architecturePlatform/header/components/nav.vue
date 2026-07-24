<!--
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2023-11-15 19:39:05
 * @LastEditors: root you@example.com
 * @LastEditTime: 2024-08-24 18:36:27
 * @FilePath: \BB\src\components\header\components\nav.vue
 * @Description: 导航栏
-->
<template>
  <div id="nav">
    <ul class="navBox">
      <li
        v-for="(item, index) in vueData.navList"
        :key="index"
        @click="selectNavItem(item, index)"
        class="navItem"
        :class="vueData.selectIndex == index ? 'navItem_select' : ''"
      >
        <p class="label">
          {{ item.name_CN }}
        </p>
        <el-divider
          direction="vertical"
          v-if="!(vueData.navList.length - 1 == index)"
        />
      </li>
    </ul>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import store from '@/store/index'
import { useRouter } from 'vue-router'

const router = useRouter()

const vueData = reactive({
  selectIndex: 0,
  navList: []
})
onMounted(() => {
  vueData.navList = systemUrlList
})
/**
 * @description 切换导航
 * @param { Object } item 当前导航项
 * @param { Number } index 当前导航项索引
 */
let selectNavItem = (item, index) => {
  // vueData.selectIndex = index
  // router.push(`${item.url}`)
  // if (item.name_US != 'zhikongtuiyanpingguxitong') {
  //   store.state.navItemName = item.name_US
  //   if (item.name_US == 'trainingDataManagement') {
  //     sessionStorage.setItem('roleName', '训练数据管理系统')
  //   }
  // } else if (item.name_US == 'zhikongtuiyanpingguxitong') {
  //   sessionStorage.setItem('roleName', '场景编排')
  // } else {
  //   sessionStorage.setItem('roleName', '场景编辑席')
  // }
  if (item.url) {
    window.open(item.url)
  }
}
</script>

<style lang="less" scoped>
#nav {
  height: 100%;
  width: 64%;

  .navBox {
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 0;

    .title {
      font-size: 30px;

      P {
        margin: 0;
        font-size: 12px;
        color: #afafaf;
      }
    }

    .navItem {
      border-bottom: 1px solid #00000000;
      color: rgba(255, 255, 255, 0.6);
      cursor: pointer;
      height: 100%;
      display: flex;
      align-items: center;
      font-size: 18px;
      // font-family: fangsong;

      .label {
        // margin: 0 26px;
        color: rgb(19, 240, 248);
      }
    }

    .navItem_select {
      // color: #fff;
      // border-bottom: 1px solid #06C4FF;
      // background-image: linear-gradient(#242424, #242424), linear-gradient(90deg, #0E78FF 0%, #06C4FF 100%);
      // background-origin: border-box;
      // background-clip: content-box, border-box;
    }
  }
}
</style>
