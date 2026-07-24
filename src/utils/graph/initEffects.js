/**
 * @Author: lvzhui
 * @Date: 2024-04-01 11:23:42
 * @LastEditTime: 2024-04-02 18:03:43
 * @LastEditors: lvzhui
 * @Description:
 * @FilePath: \smartearthsys\src\utils\graph\initEffects.js
 */
// 创建首页模型下面的底图

import * as THREE from 'three'
/**
 * @description 底图初始化
 * @param {number} BLOOM_SCENE - 泛光场景的索引。
 */
function initFloor(BLOOM_SCENE) {
  window.graphFloorGroup = new THREE.Object3D()
  const textureLoader = new THREE.TextureLoader()
  const geometry = new THREE.PlaneGeometry(300, 300)
  let texture = textureLoader.load('./static/image/three/7QX3O6K4vY.png')
  const material = new THREE.MeshBasicMaterial({
    color: 0xffffff,
    map: texture,
    // emissive:0xffffff,
    // emissiveMap:Texture,
    transparent: true,
    opacity: 1,
    // depthTest: true,
    // roughness:1,
    // metalness:0,
    depthWrite: false
    // side: THREE.DoubleSide
  })
  let plane = new THREE.Mesh(geometry, material)
  plane.layers.toggle(BLOOM_SCENE)
  plane.rotateX(-Math.PI / 2)
  plane.translateX(1)
  plane.translateZ(-100)
  plane.name = 'floor_bottom'
  window.graphFloorGroup.add(plane)

  let rotatingApertureTexture = textureLoader.load(
    './static/image/three/rotatingAperture.png'
  )
  let rotatingApertureerial = new THREE.MeshBasicMaterial({
    map: rotatingApertureTexture,
    transparent: true,
    opacity: 1,
    // depthTest: true,
    depthWrite: false
  })
  let rotatingApertureGeometry = new THREE.PlaneGeometry(500, 500)
  let rotatingApertureMesh = new THREE.Mesh(
    rotatingApertureGeometry,
    rotatingApertureerial
  )
  rotatingApertureMesh.name = 'rotatingAperture'
  rotatingApertureMesh.layers.toggle(BLOOM_SCENE)
  rotatingApertureMesh.rotateX(-Math.PI / 2)
  // rotatingApertureMesh.position.y = 0.02
  // rotatingApertureMesh.scale.set(1.2, 1.2, 1.2)
  rotatingApertureMesh.translateX(1)
  rotatingApertureMesh.translateZ(-180)
  window.graphFloorGroup.add(rotatingApertureMesh)

  let rotatePointTexture = textureLoader.load(
    './static/image/three/rotating-point2.png'
  )
  let rotatingPointMaterial = new THREE.MeshBasicMaterial({
    map: rotatePointTexture,
    transparent: true,
    opacity: 1,
    // depthTest: true,
    depthWrite: false
  })
  let rotatingApertureGeometry2 = new THREE.PlaneGeometry(600, 600)
  let rotatePointMesh = new THREE.Mesh(
    rotatingApertureGeometry2,
    rotatingPointMaterial
  )
  rotatePointMesh.name = 'floor_rotatePoint'
  rotatePointMesh.layers.toggle(BLOOM_SCENE)
  rotatePointMesh.rotateX(-Math.PI / 2)
  // rotatePointMesh.position.y = 0.04
  // rotatePointMesh.scale.set(1, 1, 1)
  rotatePointMesh.translateX(1)
  rotatePointMesh.translateZ(-180)
  window.graphFloorGroup.add(rotatePointMesh)
  window.graphScene.add(window.graphFloorGroup)
}
// 初始化天空盒
function initSkyBox() {
  const textureCubeLoader = new THREE.CubeTextureLoader().setPath(
    './static/image/three/skybox/'
  )
  const textureCube = textureCubeLoader.load(['', '', '', '', '', ''])

  window.graphScene.background = textureCube
  window.graphScene.environment = textureCube
}

/**
 * @description 初始化场景
 */
function initScene() {
  scene = new THREE.Scene()
  scene.background = new THREE.Color(0x020924)
  scene.fog = new THREE.Fog(0x020924, 200, 1000)
}

/**
 * @description 创建底图的圆形效果1。
 * @param {number} u_time - 时间参数。
 */
function floorCircle(u_time) {
  let uniforms = {
    u_time: u_time,
    opacity: { type: 'f', value: 0.2 },
    color: { type: 'c', value: new THREE.Color('#5bd3ff') }
  }
  let materialSG = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: `
varying vec2 vUv;
void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`,
    fragmentShader: `
precision lowp float;
precision lowp int;
varying vec2 vUv;
uniform float u_time;
uniform vec3 color;
uniform float opacity;
#define pi 3.1415926535
#define PI2RAD 0.01745329252
#define TWO_PI (2. * PI)
float vDrop(vec2 uv, float t) {
    uv.x = uv.x*50.0;
    float dx = fract(uv.x);
    uv.x = floor(uv.x);
    uv.y *= 0.05;
    float o = sin(uv.x*215.4);
    float s = cos(uv.x*33.1)*.3 +.7;
    float trail = mix(95.0, 35.0, s);
    float yv = fract(uv.y + t*s + o) * trail;
    yv = 1.0/yv;
    yv = smoothstep(0.0, 1.0, yv*yv);
    yv = sin(yv*pi)*(s*5.0);
    float d2 = sin(dx*pi);
    return yv*(d2*d2);
}
void main() {
    vec2 uv = vUv - 0.5;
    float d = length(uv)+0.5;
    uv = vec2(atan(uv.x, uv.y) / pi, 2.5 / d);
    float t = u_time*0.4;
    float alpha = vDrop(uv, t);
    gl_FragColor = vec4(color, alpha * mix(opacity, -0.6, d - 0.5));
}
`,
    side: THREE.DoubleSide,
    transparent: true,
    depthWrite: false
  })
  const geometry = new THREE.PlaneGeometry(100, 100)
  let plane = new THREE.Mesh(geometry, materialSG)
  plane.rotateX(-Math.PI / 2)
  plane.translateX(1)
  // plane.translateY(-100);
  // plane.translateZ(-15);
  window.threeScene.add(plane)
}

/**
 * @description 创建底图上的圆形效果2。
 * @param {number} u_time - 时间参数。
 */
function floorCircle2(u_time) {
  let uniforms = {
    u_time: u_time,
    opacity: { type: 'f', value: 0.2 },
    color: { type: 'c', value: new THREE.Color('#5bd3ff') }
  }
  let materialSG = new THREE.ShaderMaterial({
    vertexShader: `
varying vec3 vPosition;
varying vec2 vUv;

void main(){
    vec4 viewPosition = viewMatrix * modelMatrix *vec4(position,1);
    gl_Position = projectionMatrix * viewPosition;
    vPosition = position;
    vUv = uv;

}
`,
    fragmentShader: `
varying vec3 vPosition;
varying vec2 vUv;
uniform vec3 uColor;
uniform float u_time;

mat2 rotate2d(float _angle){
    return mat2(cos(_angle),-sin(_angle),
                sin(_angle),cos(_angle));
}


void main(){

    vec2 newUv = rotate2d(u_time*6.28) * (vUv-0.5);
    newUv += 0.5;
    float alpha =  1.0 - step(0.5,distance(newUv,vec2(0.5)));

    float angle = atan(newUv.x-0.5,newUv.y-0.5);
    float strength = (angle+3.14)/6.28;
    gl_FragColor =vec4(uColor,alpha*strength);



}
`,
    side: THREE.DoubleSide,
    uniforms: uniforms,
    transparent: true,
    depthWrite: false
  })
  const geometry = new THREE.PlaneGeometry(100, 100)
  let plane = new THREE.Mesh(geometry, materialSG)
  plane.rotateX(-Math.PI / 2)
  plane.translateX(1)
  // plane.translateY(-100);
  // plane.translateZ(-15);
  window.threeScene.add(plane)
}

/**
 * @description 创建底图上的扫描效果。
 * @param {number} u_time - 时间参数。
 */
function floorScan(u_time) {
  let uniforms = {
    u_time: u_time,
    opacity: { type: 'f', value: 0.2 },
    color: { type: 'c', value: new THREE.Color('#5bd3ff') }
  }
  let materialSG = new THREE.ShaderMaterial({
    vertexShader: `
// varying vec2 vUv;
// void main() {
//     vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
//     vUv = uv;
//     gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
// }
precision highp float;
precision highp int;
#include <fog_pars_vertex>
varying vec2 vUv;
void main() {
    vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    #include <fog_vertex>
}
`,
    fragmentShader: `
precision highp float;
precision highp int;
uniform vec3 color;
uniform float opacity;
uniform float u_time;
varying vec2 vUv;
vec3 rands(vec3 c) {
float j = 4096.0*sin(dot(c,vec3(17.0, 59.4, 15.0)));
vec3 r;
r.z = fract(512.0*j);
j *= .125;
r.x = fract(512.0*j);
j *= .125;
r.y = fract(512.0*j);
return r-0.5;
}
/* skew constants for 3d simplex functions */
const float F3 =  0.3333333;
const float G3 =  0.1666667;
/* 3d simplex noise */
float simplex3d(vec3 p) {
 /* 1. find current tetrahedron T and it's four vertices */
 /* s, s+i1, s+i2, s+1.0 - absolute skewed (integer) coordinates of T vertices */
  /* x, x1, x2, x3 - unskewed coordinates of p relative to each of T vertices*/
  /* calculate s and x */
  vec3 s = floor(p + dot(p, vec3(F3)));
  vec3 x = p - s + dot(s, vec3(G3));
   /* calculate i1 and i2 */
   vec3 e = step(vec3(0.0), x - x.yzx);
   vec3 i1 = e*(1.0 - e.zxy);
   vec3 i2 = 1.0 - e.zxy*(1.0 - e);
   /* x1, x2, x3 */
   vec3 x1 = x - i1 + G3;
   vec3 x2 = x - i2 + 2.0*G3;
   vec3 x3 = x - 1.0 + 3.0*G3;
   /* 2. find four surflets and store them in d */
   vec4 w, d;
   /* calculate surflet weights */
   w.x = dot(x, x);
   w.y = dot(x1, x1);
   w.z = dot(x2, x2);
   w.w = dot(x3, x3);
   /* w fades from 0.6 at the center of the surflet to 0.0 at the margin */
   w = max(0.6 - w, 0.0);
   /* calculate surflet components */
   d.x = dot(rands(s), x);
   d.y = dot(rands(s + i1), x1);
   d.z = dot(rands(s + i2), x2);
   d.w = dot(rands(s + 1.0), x3);
   /* multiply d by w^4 */
   w *= w;
   w *= w;
   d *= w;
   /* 3. return the sum of the four surflets */
   return dot(d, vec4(52.0));
}
float noise(vec3 m) {
    return   0.5333333*simplex3d(m)+0.2666667*simplex3d(2.0*m)+0.1333333*simplex3d(4.0*m)+0.0666667*simplex3d(8.0*m);
}
void main() {
     vec2 uv = vUv;
     uv.x = uv.x - 0.5;
     if (vUv.y < 0.5) {
        discard;
    }
    vec3 p3 = vec3(vUv, u_time*0.4);
    float intensity = noise(vec3(p3*12.0+12.0));
    float t = clamp((uv.x * -uv.x * 0.2) + 0.15, 0., 1.);
    float y = fract(abs(intensity * -t + fract(uv.y) - fract(-u_time)));
    float g = pow(y, 0.15);
    vec3 col = vec3(2.);
    col = col * -g + col;
    col = col * col;
    col = col * col;
    float a = smoothstep(0.0, 1.0, pow(color.r,3.0));
    gl_FragColor = vec4(col * color, a);
    // gl_FragColor = vec4(col * color, opacity);
}
`,
    side: THREE.DoubleSide,
    uniforms: uniforms,
    transparent: true,
    depthWrite: false
  })
  const geometry = new THREE.PlaneGeometry(400, 500)
  let plane = new THREE.Mesh(geometry, materialSG)
  plane.rotateX(-Math.PI / 2)
  plane.translateX(1)
  plane.translateY(-100)
  plane.translateZ(-15)
  window.threeScene.add(plane)
}
/**
 * @description 创建宇宙背景。
 * @param {number} BLOOM_SCENE - 泛光场景的索引。
 */
function createUniverse(BLOOM_SCENE) {
  let universeGeometry = new THREE.SphereGeometry(7000, 100, 100)
  let universeMaterial = new THREE.MeshLambertMaterial({
    //高光材质
    map: new THREE.TextureLoader().load('./static/image/three/universe.jpg'),
    side: THREE.DoubleSide //双面显示
  })
  //宇宙网格
  let universeMesh = new THREE.Mesh(universeGeometry, universeMaterial)
  universeMesh.layers.toggle(BLOOM_SCENE)
  universeMesh.name = '宇宙'
  window.threeScene.add(universeMesh)
}

/**
 * 空间粒子
 */
function initSpatialLightPoints() {
  window.lightPointMaterials = []
  const geometry = new THREE.BufferGeometry()
  const vertices = []

  var texture_white = new THREE.TextureLoader().load(
    './static/image/three/gradient.png'
  )
  var texture_gold = new THREE.TextureLoader().load(
    './static/image/three/gradient_gold.png'
  )
  var texture_red = new THREE.TextureLoader().load(
    './static/image/three/gradient_red.png'
  )
  var texture_yellow = new THREE.TextureLoader().load(
    './static/image/three/gradient_yellow.png'
  )
  var texture_aqa = new THREE.TextureLoader().load(
    './static/image/three/gradient_aqa.png'
  )
  let size1 = Math.random() * 6
  let size2 = Math.random() * 6
  let size3 = Math.random() * 6
  let size4 = Math.random() * 6
  let size5 = Math.random() * 6
  window.spatialLightPointsParameters = [
    [[1.0, 0.2, 0.5], texture_white, size1],
    [[0.95, 0.1, 0.5], texture_gold, size2],
    [[0.9, 0.05, 0.5], texture_red, size3],
    [[0.85, 0, 0.5], texture_yellow, size4],
    [[0.5, 0, 0.5], texture_aqa, size5]
  ]
  for (let i = 0; i < 500; i++) {
    const x = Math.random() * 1500 - 500 //1500 - 1000;
    const y = Math.random() * 1500 - 500 //2000 - 1000;
    const z = Math.random() * 1500 - 500 //2000 - 1000;

    vertices.push(x, y, z)
  }

  geometry.setAttribute(
    'position',
    new THREE.Float32BufferAttribute(vertices, 3)
  )
  for (let i = 0; i < spatialLightPointsParameters.length; i++) {
    const color = spatialLightPointsParameters[i][0]
    const sprite = spatialLightPointsParameters[i][1]
    const size = spatialLightPointsParameters[i][2]

    window.lightPointMaterials[i] = new THREE.PointsMaterial({
      size: size,
      map: sprite,
      blending: THREE.AdditiveBlending,
      depthTest: false,
      transparent: true
    })
    window.lightPointMaterials[i].color.setHSL(color[0], color[1], color[2])

    const particles = new THREE.Points(geometry, window.lightPointMaterials[i])
    particles.name = 'spatial_light_point'

    // particles.rotation.x = Math.random() * 6
    // particles.rotation.y = Math.random() * 6
    // particles.rotation.z = Math.random() * 6

    window.graphScene.add(particles)
  }
}

/**
 * 上升数字
 **/
function initNumParticle() {
  window.particleArr = []
  //设置范围
  let minX = -260
  let maxX = 260
  let minY = -260
  let maxY = 260
  let minZ = -260
  let maxZ = 280

  for (let i = 0; i < 20; i++) {
    const particle = createSequenceFrame({
      image: './static/image/three/上升粒子1.png',
      width: 180,
      height: 189,
      frame: 9,
      column: 9,
      row: 1,
      speed: 0.5
    })
    let particleScale = random(5, 10) / 100
    particle.scale.set(particleScale * 5, particleScale * 5, particleScale * 5)
    let x = random(minX, maxX)
    // if (x > 0 && x < 40) {
    //   x += 40
    // }
    // if (x < 0 && x > -40) {
    //   x -= 40
    // }
    let y = random(minY, maxY)
    // if (y > 0 && y < 40) {
    //   y += 40
    // }
    // if (y < 0 && x > -40) {
    //   y -= 40
    // }
    let z = random(minZ, maxZ)
    particle.position.set(x, y, z)
    window.particleArr.push(particle)
  }
  window.graphScene.add(...window.particleArr)
}

/**
 * @description 创建序列帧动画。
 * @param {Object} opt - 动画选项。
 * @return {THREE.Mesh} - 表示序列帧动画的网格。
 */
function createSequenceFrame(opt) {
  // 默认参数
  let options = deepMerge(
    {
      image: '',
      width: 20, // 显示的宽度
      height: 200, // 显示的高度
      frame: 60, //总共的帧数
      column: 10, // 序列图的列
      row: 6, // 序列图的行
      speed: 0.5 // 速度
    },
    opt
  )
  const textureLoader = new THREE.TextureLoader()
  let geometry = new THREE.PlaneGeometry(options.width, options.height) //矩形平面
  let texture = textureLoader.load(options.image) // 加载图片
  texture.repeat.set(1 / options.column, 1 / options.row) // 从图像上截图第一帧
  let material = new THREE.MeshBasicMaterial({
    map: texture,
    transparent: true,
    opacity: 0.3,
    side: THREE.DoubleSide,
    // depthWrite: false, //是否对深度缓冲区有任何的影响
    depthTest: false
  })
  let mesh = new THREE.Mesh(geometry, material)
  mesh.rotateY(180)
  let r = 0 // 当前行
  let c = 0 // 当前列
  let t = 0 // 时间
  mesh.updateSequenceFrame = (time) => {
    t += options.speed
    if (t > options.frame) t = 0
    c = options.column - Math.floor(t % options.column) - 1
    r = Math.floor((t / options.column) % options.row)
    texture.offset.x = c / options.column // 动态更新纹理偏移 播放关键帧动画
    texture.offset.y = r / options.row // 动态更新纹理偏移 播放关键帧动画
  }

  return mesh
}

/**
 * @description 深度合并两个对象。
 * @param {Object} target - 目标对象。
 * @param {Object} source - 源对象。
 * @return {Object} - 合并后的对象。
 */
function deepMerge(target, source) {
  target = deepClone(target)
  for (let key in source) {
    if (key in target) {
      // 对象的处理
      if (isObject(source[key])) {
        if (!isObject(target[key])) {
          target[key] = source[key]
        } else {
          target[key] = deepMerge(target[key], source[key])
        }
      } else {
        target[key] = source[key]
      }
    } else {
      target[key] = source[key]
    }
  }
  return target
}
/**
 * @description 检查值的类型是否与指定类型匹配。
 * @param {string} type - 指定的类型。
 * @param {*} value - 要检查的值。
 * @return {boolean} - 如果值的类型与指定类型匹配，则返回 true，否则返回 false。
 */
function isType(type, value) {
  return Object.prototype.toString.call(value) === `[object ${type}]`
}

/**
 * @description 检查值是否为对象。
 * @param {*} value - 要检查的值。
 * @return {boolean} - 如果值是对象，则返回 true，否则返回 false。
 */
function isObject(value) {
  return isType('Object', value)
}

/**
 * @description 深度克隆对象。
 * @param {Object} target - 要克隆的对象。
 * @param {Map} [map] - 用于存储克隆对象的映射。
 * @return {Object} - 克隆后的对象。
 */
function deepClone(target, map = new Map()) {
  // target 不能为空，并且是一个对象
  if (target != null && isObject(target)) {
    // 在克隆数据前，进行判断是否克隆过,已克隆就返回克隆的值
    let cache = map.get(target)
    if (cache) {
      return cache
    }
    // 判断是否为数组
    const isArray = Array.isArray(target)
    let result = isArray ? [] : {}
    // 将新结果存入缓存中
    cache = map.set(target, result)
    // 如果是数组
    if (isArray) {
      // 循环数组，
      target.forEach((item, index) => {
        // 如果item是对象，再次递归
        result[index] = deepClone(item, cache)
      })
    } else {
      // 如果是对象
      Object.keys(target).forEach((key) => {
        if (isObject(result[key])) {
          result[key] = deepClone(target[key], cache)
        } else {
          result[key] = target[key]
        }
      })
    }
    return result
  } else {
    return target
  }
}

/**
 * @description 生成指定范围内的随机整数。
 * @param {number} min - 范围的最小值。
 * @param {number} max - 范围的最大值。
 * @return {number} - 在指定范围内的随机整数。
 */
function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min
}

/**
 * @description 向场景添加帮助信息。
 */
function addHelp() {
  let axisHelper = new THREE.AxesHelper(100, 100)
  window.threeScene.add(axisHelper)
}

export {
  initFloor,
  initSkyBox,
  floorCircle,
  floorCircle2,
  floorScan,
  createUniverse,
  initSpatialLightPoints,
  initNumParticle,
  random,
  addHelp,
  initScene
}
