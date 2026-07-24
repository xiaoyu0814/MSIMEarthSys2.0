import * as THREE from 'three'

// 初始化场景
const scene = new THREE.Scene()

// 场景天空盒
const textureCubeLoader = new THREE.CubeTextureLoader().setPath(
  './textures/skybox/'
)
// const textureCube = textureCubeLoader.load([
//   'px.png',
//   'nx.png',
//   'py.png',
//   'ny.png',
//   'pz.png',
//   'nz.png'
// ])
const textureCube = textureCubeLoader.load(['', '', '', '', '', ''])

scene.background = textureCube
scene.environment = textureCube

// const textureCubeLoader = new THREE.CubeTextureLoader().setPath("./textures/");
// const textureCube = textureCubeLoader.load([
//   "1.jpg",
//   "2.jpg",
//   "3.jpg",
//   "4.jpg",
//   "5.jpg",
//   "6.jpg",
// ]);

// scene.background = textureCube;
// scene.environment = textureCube;

// var spotLight = new THREE.SpotLight(0xffffff, 1)
// spotLight.position.set(-2800, 800, 800)
// spotLight.angle = Math.PI / 6
// spotLight.penumbra = 0.05
// spotLight.decay = 3.0
// spotLight.distance = 6000
// spotLight.intensity = 1.5
// spotLight.castShadow = true
// spotLight.shadow.mapSize.width = 1024
// spotLight.shadow.mapSize.height = 1024
// spotLight.shadow.camera.near = 10
// spotLight.shadow.camera.far = 10000
// scene.add(spotLight)

// // lights
// var spotLight1 = new THREE.SpotLight(0x00ff00) // 0x08008f
// spotLight1.position.set(1, 400, 1)
// spotLight1.intensity = 0.8
// spotLight1.angle = Math.PI / 2
// spotLight1.penumbra = 1.5
// spotLight1.decay = 0.3
// spotLight1.distance = 500
// scene.add(spotLight1)

// var intensity = 0.5
// var distance = 1000
// var decay = 1.1
// var pointLight = new THREE.PointLight(0x00ff00, intensity, distance, decay) // 0x08008f
// pointLight.position.set(1, 200, 1)
// scene.add(pointLight)

// var dirLight = new THREE.DirectionalLight(0x080808, 1.0)
// dirLight.position.set(200, 800, 200)
// scene.add(dirLight)

// var ambientLight = new THREE.AmbientLight(0x222222)
// ambientLight.intensity = 0.8
// scene.add(ambientLight)

// setTimeout(() => {
//   // 递归遍历组对象group释放所有后代网格模型绑定几何体占用内存
//   kfCloudGroup.traverse(function (obj) {
//     if (obj.type === "Mesh") {
//       obj["geometry"].dispose();
//       obj["material"].dispose();
//     }
//   });
//   // 删除场景对象scene的子对象group
//   scene.remove(kfCloudGroup);
// }, 5000);

export default scene
