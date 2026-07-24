<template>
  <div class="body-content">
    <!-- <el-checkbox
      style="width: 150px; color: #fff"
      v-for="(item, index) in state2.list02"
      :key="index"
      v-model="item.checked1"
      :label="item.label"
      size="large"
    /> -->
    <div
      v-for="(item, index) in state2.list02"
      :key="index"
      style="
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-top: 5px;
        font-size: 14px;
      "
    >
      <div style="display: flex; align-items: center; color: #fff">
        {{ item.name }}：
      </div>
      <el-switch
        v-model="item.checked1"
        active-text=""
        inactive-text=""
        size="small"
        style="margin-right: 60px; --el-switch-on-color: #0494c5"
        @change="changeVisibleControl(item)"
      ></el-switch>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import emitter from '@/utils/eventbus'

const store = useStore()

let state2 = reactive({
  list02: [
    {
      checked1: false,
      name: '路径',
      value: 'pathCheck'
    },
    {
      checked1: false,
      name: '路径墙',
      value: 'entityWall'
    },
    {
      checked1: false,
      name: '尾迹',
      value: 'entityWack'
    }
  ],
  inforList: [],
  entityTitle: '',
  commandVisibleRadio: []
})

onMounted(() => {
  stateShow()
  // if (store.state.targetDetailsCheck.lenght > 0) {
  //   state2.list02.forEach((item) => {
  //     store.state.targetDetailsCheck.forEach((items) => {
  //       if (item.value == items) {
  //         item.checked1 = true
  //       }
  //     })
  //   })
  // }
})
//状态
const stateShow = () => {
  state2.list02 = store.state.sceneModule.briefAllData
}

const changeVisibleControl = (val) => {
  console.log(val)
  if (val.checked1) {
    state2.commandVisibleRadio.push(val.value)
  } else {
    state2.commandVisibleRadio = state2.commandVisibleRadio.filter(
      (item) => item !== val.value
    )
  }
  store.commit('setBriefAllData', state2.list02)
  let isHave = state2.commandVisibleRadio.includes(val.value)
  // emitter.emit(val.value + 'Change1', val.checked1)
  emitter.emit(val.value + 'Change1', isHave)
  let entityId = store.state.sceneModule.currentFlyType.entityId
  let newtargetDetailsCheck = store.state.targetDetailsCheck
  if (!newtargetDetailsCheck[entityId]) {
    newtargetDetailsCheck[entityId] = []
  }
  newtargetDetailsCheck[entityId] = state2.commandVisibleRadio
  store.commit('setTargetDetailsCheck', newtargetDetailsCheck)
}

onMounted(() => {
  state2.Oldlist02 = state2.list02
  //显示当前飞机状态属性信息
  console.log(store.state.sceneModule.currentFlyType)
  showPlaneInfo(store.state.sceneModule.currentFlyType)
})
//显示飞机当前状态的信息
const showPlaneInfo = (inforData) => {
  console.log(inforData)
  state2.inforList = []
  let infors = inforData
  state2.inforList = [
    // {
    //   name: '名称',
    //   value: infors.name
    // },
    {
      name: '状态',
      value: infors.type
    }
  ]
  state2.entityTitle = infors.name
  //过滤飞机详情字段
  //TODO:暂时不太清楚哪个字段为武器装备类型暂时先使用name作为类型
  controlFieldShowOrHide(state2.entityTitle)
}

/**
 * @description 控制详情页字段是否展示方法
 * @param { String } typeName 平台类型
 */
const controlFieldShowOrHide = (typeName) => {
  if (!store.state.targetDetailsConfig) {
    fetch('/static/config/targetDetailsConfig/targetDetailsConfig.json')
      .then((response) => response.json())
      .then((res) => {
        store.commit('setTargetDetailsConfig', res)
        controlFieldShowOrHide(typeName)
      })
    return
  }

  let fieldSetting =
    store.state.targetDetailsConfig.defaultSetting.detailsConfigArray
  store.state.targetDetailsConfig.platformTypeConfig.forEach((element) => {
    if (element.name == typeName) fieldSetting = element.detailsConfigArray
  })
  //过滤指令
  filterDetailsField(fieldSetting, 'list02')

  // controlFieldCheck()
}
/**
 * @description 根据字段配置文件过滤页面上vuedata的数值 控制字段是否展示
 * @param { Array } fieldSetting 配置文件配置展示功能列表
 * @param { String } key vuedata中展示的数据源名称
 */
const filterDetailsField = (fieldSetting, key) => {
  if (!state2['Old' + key]) return
  let newDataArray = state2['Old' + key].filter((item, index) => {
    return fieldSetting.includes(item.name)
  })
  state2[key] = newDataArray
}
</script>
<style lang="less" scoped>
.body-content {
  // display: flex;
  // margin-left: 50px;
  // justify-content: space-evenly;
  // width: 400px;
  // width: calc(100% / 3);
}
.el-checkbox.el-checkbox--large .el-checkbox__label {
  font-size: 16px;
}
.el-switch__label {
  color: #fff !important;
}
</style>
