<template>
  <div id="review" v-if="vueData.showList">
    <ul class="taskList_box">
      <li class="header">
        <span>任务管理</span>
        <!-- <img
          src="~@/assets/images/rwty/arrows.svg"
          :style="
            vueData.minimize
              ? 'transform: rotate(90deg)'
              : 'transform: rotate(270deg)'
          "
          @click="vueData.minimize = !vueData.minimize"
        /> -->
      </li>
      <li class="content" v-if="vueData.minimize">
        <taskManagement :environment="'FPHF'"></taskManagement>
      </li>
    </ul>
    <!-- <leftMenu
            :menuList="vueData.menuList"
            v-if="vueData.showLeftMenu"
          ></leftMenu> -->
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import taskManagement from './compontent/taskList.vue'
import emitter from '@/utils/eventbus'
//   import leftMenu from "@/components/leftMenu/leftMenu.vue";

const vueData = reactive({
  showLeftMenu: false,
  minimize: true,
  menuList: [
    {
      name: '力量编成',
      imageName: 'llbc.svg',
      imagePath: '/src/assets/images/rwty',
      title: '力量编成',
      id: 'llbc'
    },
    {
      name: '环境信息',
      imageName: 'hjxx.svg',
      imagePath: '/src/assets/images/rwty',
      title: '环境',
      id: 'hjxx'
    },
    {
      name: '关键事件',
      imageName: 'gjsj.svg',
      imagePath: '/src/assets/images/rwty',
      title: '关键事件',
      id: 'gjsj'
    }
  ],
  showList: false
})
emitter.on('closeTaskList', (val) => {
  vueData.showList = val
})
onMounted(() => {})

/**
 * @description 控制左侧菜单显隐
 * @param {*} val
 * @return {*}
 */
let getTaskItem = (val) => {
  if (val == null) {
    vueData.showLeftMenu = false
  }
  vueData.showLeftMenu = true
}
</script>

<style lang="less" scoped>
#review {
  .taskList_box {
    position: absolute;
    left: 50%;
    top: 15%;
    width: 1000px;
    height: 670px;
    background-size: 100% 100%;
    z-index: 25;
    padding: 0;
    margin: 0;
    margin-left: -500px;
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;
    .content {
      height: 80vh;
      padding: 0;
    }
    ::v-deep(li::marker) {
      content: '';
    }
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px;
      padding: 5px 15px;
      border-bottom: 1px solid #0b3855;
      height: 35px;
      span {
        font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
        font-weight: 700;
        font-style: normal;
        font-size: 19px;
        color: #c2d7ee;
      }
      img {
        cursor: pointer;
      }
    }
  }
}
</style>
