import * as THREE from 'three'
// 创建透视相机
const camera = new THREE.PerspectiveCamera(
  60,
  window.innerWidth / window.innerHeight,
  1,
  100000
)
// 设置相机位置
// object3d具有position，属性是1个3维的向量
// camera.position.set(16.177701045268048, 29.240446441195687, 54.20874202124812);
// camera.position.set(8.098425520106135, 38.904156594568946, 49.76134578643617);
// camera.position.set(5.819276011170954,29.63132228912805,56.06630179368315)
// camera.position.set(3.247933163642081,39.252212838225326,50.04022530109054)
// camera.position.set(68.57016539207528, 52.25867850303243, 1)
camera.position.set(40.06990915966245, 23.480019013994433, -3.702769139309583)
// camera.position.set(40.06990915966245, 23.480019013994433, -3.702769139309583) 远
window.threeCamera = camera
export default camera

// x
// :
// 8.810382699311338
// y
// :
// 4.648957445105952
// z
// :
// -0.8742719057998458
