<!--
 * @description:
 * @Version: 1.0
 * @Author: Li
 * @Date: 2024-10-17 16:33:31
 * @LastEditors: Li
 * @LastEditTime: 2024-10-21 16:50:50
-->
<template>
  <div class="moveMore">
    <div class="hearde">
      <div style="display: flex">
        <div
          style="font-size: 20px; width: 150px; display: flex; overflow: hidden"
        >
          <!-- <div style="width: 60px">名称：</div> -->
          <div class="hearde-text">
            {{ store.state.sceneModule.currentFlyType.name }}
          </div>
        </div>
        <!-- <div>
          <centerFun></centerFun>
        </div>
        <div style="display: flex">
          <div style="font-size: 16px; margin: 10px 50px 0 20px">
            速度：{{ state.entitySpeedKm }}km/h
          </div>
          <div style="font-size: 16px; margin-top: 10px">
            高度：{{ state.entityHeight }}m
          </div>
        </div> -->
      </div>

      <img
        src="@/assets/image/panelIcons/关闭icon.png"
        alt=""
        class="close_Sty"
        @click="handleClose"
      />
    </div>
    <div class="body">
      <el-row :gutter="20">
        <el-col :span="8">
          <div class="grid-content bg-purple">
            <centerFun></centerFun>
            <topFunt></topFunt>
          </div>
        </el-col>
        <el-col :span="8" style="display: flex; justify-content: center">
          <div class="grid-content bg-purple">
            <bottomFun></bottomFun>
          </div>
        </el-col>
        <el-col :span="8" style="display: flex; justify-content: center">
          <div class="grid-content bg-purple">
            <multifunctional></multifunctional>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>
<script setup>
import { useStore } from 'vuex'
import emitter from '@/utils/eventbus'
import { reactive, onMounted } from 'vue'
import { getEititiesPostion } from '@/utils/mapTools'
import topFunt from './components/topFunction.vue'
import centerFun from './components/centerFun.vue'
import bottomFun from './components/bottomFun.vue'
import multifunctional from './components/multifunctional.vue'
import { moveBtnPanel } from '@/utils/mapTools'

const store = useStore()

let state = reactive({
  boxTop: 60,
  boxLeft: 300,
  entityHeight: '', // 实体高度
  entitySpeedKm: '', // 实体速度
  show: false
})

onMounted(() => {
  emitter.on('setRightClick', (val) => {
    // state.show = val
    let entity = window.EarthPlugn.entity._GetCZMLEntity(
      store.state.sceneModule.currentFlyType.entityId,
      'MSIMEarthCZMLProcessContainer'
    )
    let enPositionArr = []
    if (window.MSIMEarth.defined(entity)) {
      enPositionArr = getEititiesPostion(entity)
      state.entityHeight = Number(enPositionArr[2]).toFixed(3) //高度

      // 速度 m/s 换算为 km/h
      let speedKm = 0
      if (entity?.properties?.airplaneAction?._value?.speed) {
        speedKm =
          Number(entity?.properties?.airplaneAction?._value?.speed) * 3.6
      }
      state.entitySpeedKm = speedKm.toFixed(3)

      let obj = {
        entityHeight: state.entityHeight,
        entitySpeedKm: state.entitySpeedKm
      }
      emitter.emit('getEntityHeightAndSpeed', obj)
    }
  })
  let entity = window.EarthPlugn.entity._GetCZMLEntity(
    store.state.sceneModule.currentFlyType.entityId,
    'MSIMEarthCZMLProcessContainer'
  )
  let enPositionArr = []
  if (window.MSIMEarth.defined(entity)) {
    enPositionArr = getEititiesPostion(entity)
    state.entityHeight = Number(enPositionArr[2]).toFixed(3) //高度

    // 速度 m/s 换算为 km/h
    let speedKm = 0
    if (entity?.properties?.airplaneAction?._value?.speed) {
      speedKm = Number(entity?.properties?.airplaneAction?._value?.speed) * 3.6
    }
    state.entitySpeedKm = speedKm.toFixed(3)

    let obj = {
      entityHeight: state.entityHeight,
      entitySpeedKm: state.entitySpeedKm
    }
    emitter.emit('getEntityHeightAndSpeed', obj)
  }
  moveBtnPanel('moveMore')
})

const statrDarw = (e) => {
  console.log(e)
  e.preventDefault()

  let dragBox = e.target

  function doDrag(event) {
    state.boxTop = event.clientY - dragBox.offsetHeight / 2
    state.boxLeft = event.clientX - dragBox.offsetWidth / 2
  }

  function stopDrag() {
    document.removeEventListener('mousemove', doDrag)
    document.removeEventListener('mouseup', stopDrag)
    document.removeEventListener('touchmove', doDrag)
    document.removeEventListener('touchend', stopDrag)
  }

  document.addEventListener('mousemove', doDrag)
  document.addEventListener('mouseup', stopDrag)
  document.addEventListener('touchmove', doDrag)
  document.addEventListener('touchend', stopDrag)
}

const handleClose = () => {
  emitter.emit('setRightClick', false)
}
</script>
<style lang="less" scoped>
.moveMore {
  width: 960px;
  height: 200px;
  // height: 100%;
  box-shadow: 0 0 25px #1092d5;
  background: rgba(2, 26, 70, 0.88);
  position: absolute;
  bottom: 10%;
  left: 20%;
  padding: 10px 20px 20px;
  .hearde {
    width: 100%;
    color: #fff;
    .hearde-text {
      width: 90px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      color: #00c7fb;
      text-align: left;
      font-weight: 700;
    }
    .close_Sty {
      width: 18px;
      height: 18px;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }
  }
  .body {
    text-align: left;
    width: 100%;
    display: flex;
    font-size: 16px;
    .body-left {
      // width: 100%;
    }
    .body-content {
      // width: calc(100% / 3);
    }
    .body-right {
      // width: calc(100% / 3);
      font-size: 16px;
      align-items: center;
    }
  }
}
.el-checkbox.el-checkbox--large .el-checkbox__label {
  font-size: 16px;
}
</style>
