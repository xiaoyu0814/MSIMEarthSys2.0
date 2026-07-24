<template>
  <div class="scene" ref="sceneDiv"></div>
</template>

<script setup>
import emitter from '@/utils/eventbus'
import { onMounted, ref, watch } from 'vue'
// import * as THREE from 'three'
// import gsap from 'gsap'

// 导入gui对象
// import gui from '@/utils/three2/gui'
// 导入场景
import scene from '@/utils/three2/scene'
// 导入相机
import camera from '@/utils/three2/camera'
// // 导入控制器
// import controls from '@/utils/three2/controls'
// // 导入辅助坐标轴
// import axesHelper from '@/utils/three2/axesHelper'
// 导入渲染器
import renderer from '@/utils/three2/renderer'
// 初始化调整屏幕
import '@/utils/three2/init'
// 导入添加物体函数
// import createMesh from '@/utils/three2/createMesh'
// 导入每一帧的执行函数
import animate from '@/utils/three2/animate'
// import AlarmSprite from '@/utils/three2/mesh/AlarmSprite'
// import eventHub from '@/utils/eventHub'

const props = defineProps(['eventList'])
// 场景元素div
let sceneDiv = ref(null)
// 添加相机
scene.add(camera)
// 添加辅助坐标轴
// scene.add(axesHelper)

onMounted(() => {
  sceneDiv.value.appendChild(renderer.domElement)
  emitter.on('throughCloud', (val) => {
    animate()
  })
})
</script>

<style>
.scene {
  width: 100vw;
  height: 100vh;
  position: fixed;
  z-index: 9999;
  left: 0;
  top: 0;
}
.label {
  color: rgb(19, 240, 248);
  font-family: sans-serif;
  padding: 2px;
  /* background: rgba(0, 0, 0, 0.6); */
  /* background-image: url('../../public/textures/jsonimg/街道-1.png'); */
  background-repeat: no-repeat;
  background-size: cover;
}
.layer {
  /*重要*/
  /* display: none; */
  user-select: none; /*禁止选中*/
  pointer-events: none; /*鼠标穿透*/
  /*重要*/
  position: fixed;
  top: 0;
  left: 0;
  width: 320px;
  height: 250px;
  z-index: 99999;
}
.main {
  /* display: none; */
  position: absolute;
  top: 0;
  left: 50px;
  right: 0;
  bottom: 100px;
  /* background: url('../../public/textures/popup/layer.png') no-repeat; */
  background-size: 100% 100%;
  color: white;
  padding: 20px 5px 5px 20px;
  font-size: 14px;
  user-select: text;
  pointer-events: auto;
}
</style>
