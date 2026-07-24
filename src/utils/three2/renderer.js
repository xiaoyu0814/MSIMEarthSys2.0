import * as THREE from 'three'
import {
  CSS2DRenderer,
  CSS2DObject
} from 'three/examples/jsm/renderers/CSS2DRenderer.js'
// import { Stats } from "three/examples/jsm/libs/stats.module.js";

// stats = new Stats();
// document.body.appendChild(stats.dom);
// 初始化渲染器
const renderer = new THREE.WebGLRenderer({
  // 抗锯齿
  antialias: true
  // logarithmicDepthBuffer: true,
})
// 设置渲染尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true

renderer.setPixelRatio(window.devicePixelRatio)
document.body.appendChild(renderer.domElement)

// 开启后场景会亮起来
// renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// renderer.gammaInput = true;
// renderer.gammaOutput = true;
renderer.toneMapping = THREE.LinearToneMapping
// renderer.toneMappingExposure = Math.pow(1.0, 4.0);
export default renderer
