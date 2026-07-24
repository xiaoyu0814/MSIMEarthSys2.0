import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import camera from './camera'
import renderer from './renderer'

// 初始化控制器
const controls = new OrbitControls(camera, renderer.domElement)
// 设置控制器阻尼
controls.enableDamping = true
// 设置自动旋转
// controls.autoRotate = true;

controls.dampingFactor = 0.05
controls.screenSpacePanning = false
controls.minDistance = 0
controls.maxDistance = 1500000000
controls.maxPolarAngle = Math.PI / 2

window.threeControl = controls

export default controls
