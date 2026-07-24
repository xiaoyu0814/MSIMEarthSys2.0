<template>
  <div class="BLConfig">
    <div class="header">
      <span class="header-left">{{ props.selectItem.LabelName }}配置</span>
      <img
        src="@/assets/images/rwty/closeBLConfig.svg"
        style="width: 20px; height: 20px; cursor: pointer"
        @click="closePanel"
        title="关闭"
      />
    </div>
    <div class="content">
      <ul class="leftTabs">
        <li
          :class="
            index == vueData.selectTabsItem_index ? 'select-tabs' : 'tabs'
          "
          v-for="(item, index) in vueData.tabList"
          :key="index"
          @click="getTabsContent(item, index)"
        >
          <span class="tabsName">{{ item.name }}</span>
        </li>
      </ul>
      <div class="tabItem-content">
        <stats
          :name="props.selectItem.LabelName"
          :node="props.selectItem"
          :item="vueData.selectTabsItem"
          v-if="vueData.selectTabsItem.name == '属性'"
        ></stats>
        <communication
          :item="vueData.selectTabsItem"
          :node="props.selectItem"
          v-if="
            vueData.selectTabsItem.name == '通信' ||
            vueData.selectTabsItem.name == '下属'
          "
        ></communication>
        <weapon
          :item="vueData.selectTabsItem"
          :node="props.selectItem"
          v-if="vueData.selectTabsItem.name == '武器'"
        >
        </weapon>
        <sensors
          :item="vueData.selectTabsItem"
          :node="props.selectItem"
          v-if="vueData.selectTabsItem.name == '传感器'"
        >
        </sensors>
        <!-- <routePlanning
          :item="vueData.selectTabsItem"
          :node="props.selectItem"
          v-if="
            vueData.selectTabsItem.LabelName == '路径' ||
            vueData.selectTabsItem.LabelName == '航线'
          "
        ></routePlanning>
        <radar
          :item="vueData.selectTabsItem"
          :node="props.selectItem"
          v-if="vueData.selectTabsItem.name == '雷达'"
        ></radar>
        <task
          :item="vueData.selectTabsItem"
          :node="props.selectItem"
          v-if="vueData.selectTabsItem.LabelName == '任务'"
        ></task>
        <setBL
          :item="vueData.selectTabsItem"
          :name="props.selectItem.LabelName"
          :node="props.selectItem"
          v-if="vueData.selectTabsItem.name == '设置'"
-->
      </div>
    </div>
  </div>
</template>
<script setup>
import { reactive, onBeforeMount, onMounted, watch } from 'vue'
import store from '@/store/index.js'
import stats from './stats.vue' //属性
import communication from './communication.vue' //通信、下属
import radar from './radar.vue' //雷达
import weapon from './weapon.vue' //武器
import routePlanning from './routePlanning.vue' //路径、航线
import task from './task.vue' // 任务
import setBL from './setBL.vue' // 设置实体
import sensors from './sensors.vue' //传感器

const emit = defineEmits(['closePanels'])

const props = defineProps({
  selectItem: Object
  // node: Object
})

const vueData = reactive({
  tabList: [
    { name: '属性', title: '基本属性' },
    { name: '通信', title: '通信模块' },
    { name: '传感器', title: '传感器信息' },
    { name: '武器', title: '武器信息' }
  ],
  selectTabsItem: null,
  selectTabsItem_index: 0,
  entityMethod: null
})

onBeforeMount(() => {
  getTabsContent(vueData.tabList[0], 0)
})

onMounted(() => {
  vueData.entityMethod = new window.EarthPlugn.entity({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  getEntitys(props.selectItem)
})

const getTabsContent = (item, index) => {
  vueData.selectTabsItem = item
  vueData.selectTabsItem_index = index
}

const closePanel = () => {
  emit('closePanels', false)
}
// 获取czml 实体经纬度信息
const getEititiesPostion = (entitypath) => {
  if (entitypath) {
    let positionArr = entitypath.position._value
      ? entitypath.position._value
      : entitypath.position.getValue(window.EarthViewer.clock.currentTime)
    let entitiesCartographic =
      window.MSIMEarth.Cartographic.fromCartesian(positionArr)

    return [
      window.MSIMEarth.Math.toDegrees(entitiesCartographic.longitude),
      window.MSIMEarth.Math.toDegrees(entitiesCartographic.latitude),
      entitiesCartographic.height
    ]
  }
}
const getEntitys = (params) => {
  if (params.Name) {
    let source = vueData.entityMethod.getCZMLEntity(
      params.Name,
      'MSIMEarthCZMLProcessContainer'
    )
    let postionArr = getEititiesPostion(source)
    if (postionArr && postionArr.length > 0) {
      props.selectItem.Lon = postionArr[0]
      props.selectItem.Lat = postionArr[1]
      props.selectItem.Alt = postionArr[2]
    }
  }
}
watch(
  () => props.selectItem,
  (newVal, oldVal) => {
    getEntitys(newVal)
  }
)
// watch(
//   () => props.node.data,
//   (nVal) => {
//     if (nVal.nodeType == '兵力') {
//       vueData.tabList = [
//         { name: '属性', title: '基本属性' },
//         { name: '通信', title: '通信' },
//         { name: '雷达', title: '雷达' },
//         { name: '武器', title: '武器' },
//         { name: '路径', title: '路径规划' },
//         { name: '航线', title: '航线规划' },
//         { name: '任务', title: '任务规划' }
//       ]
//     } else {
//       vueData.tabList = [
//         { name: '属性', title: '基本属性' },
//         { name: '通信', title: '通信' },
//         { name: '雷达', title: '雷达' },
//         { name: '武器', title: '武器' },
//         { name: '下属', title: '下属' },
//         { name: '任务', title: '任务规划' },
//         { name: '设置', title: '实体设置' }
//       ]

//   },
//   { immediate: true }
// )
</script>
<style lang="less" scoped>
.BLConfig {
  z-index: 1000;
  position: fixed;
  right: 4px;
  top: 15%;
  width: 450px;
  height: 650px;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px;
    border-bottom: 1px solid #2671ac66;

    .header-left {
      font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
      font-weight: 700;
      font-style: normal;
      font-size: 19px;
      color: #c2d7ee;
    }
  }

  .content {
    padding-top: 5px;
    display: flex;
    height: calc(100% - 43px);
    padding-right: 20px;

    .leftTabs {
      padding: 0;

      .tabs {
        width: 38px;
        height: 80px;
        background-image: url(@/assets/images/rwty/tabs.svg);
        background-repeat: no-repeat;
        background-size: 100% 100%;
        font-size: 16px;
        color: #ffffff;
        writing-mode: vertical-rl;
        letter-spacing: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
      }

      .select-tabs {
        width: 38px;
        height: 80px;
        background-image: url(@/assets/images/rwty/tab.svg);
        background-repeat: no-repeat;
        font-size: 16px;
        color: #ffffff;
        writing-mode: vertical-rl;
        letter-spacing: 5px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-size: 100% 100%;
        cursor: pointer;
      }

      .tabsName {
        display: inline-block;
      }
    }

    .tabItem-content {
      flex-grow: 1;
      height: 100%;
      width: 100%;
    }
  }
}
</style>
