<!--
 * @Author: lvzhui
 * @Date: 2024-04-01 11:23:42
 * @LastEditTime: 2025-08-11 17:08:13
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @Description: 图谱视图组件
 * @FilePath: \smartearthsys\src\views\3D\GraphViewer.vue
-->
<template>
  <div
    class="graphEle"
    :class="{ graphEleActive: isActive }"
    :style="`right:${right};bottom:${bottom};width: ${width};height:${height};`"
  >
    <div id="d3graph"></div>
  </div>
</template>

<script>
// 3dgraph
// import ForceGraph3D from '3d-force-graph'
import * as THREE from 'three'
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader'
// import { TWEEN } from 'three/examples/jsm/libs/tween.module.min.js'
// import TWEEN from 'tween.js'

import emitter from '@/utils/eventbus'

import {
  CSS2DRenderer,
  CSS2DObject
} from 'three/examples/jsm/renderers/CSS2DRenderer.js'
// import SpriteText from 'three-spritetext'
// three 特效
import {
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
} from '@/utils/graph/initEffects'
// import { gData } from '../../assets/HJJ测试图谱数据3'
export default {
  data() {
    return {
      BLOOM_SCENE: 1,
      ENTIRE_SCENE: 0,
      ENTIRE_SCENE2: 3, //1 和0.95 是高亮状态
      BLOOM_SCENE2: 2,
      params: {
        exposure: 1,
        bloomStrength: 5,
        bloomThreshold: 0,
        bloomRadius: 0,
        scene: 'Scene with Glow'
      },
      imgTextureBall: null,
      angle: 0,
      isRotationActive: true,
      distance: 1400,
      isActive: false,
      right: '',
      bottom: '',
      width: '40%',
      height: '60%',
      activeClassType: 'normal'
    }
  },
  computed: {
    /**
     * 生成自定义的 CSS 类名
     * @description 根据 activeClassType 的不同情况返回不同的 class 列表，并将组件中传入的 className 也添加到列表中
     * @return {string} - 返回一个包含所有 class 的字符串
     */
    customClass() {
      let classes = []
      //激活的类别
      switch (this.activeClassType) {
        case 'normal':
          // classes.push()
          break
        case 'twPowerGirdAnalyze':
          classes = []
          classes.push('AnalyzeEleActive')
          break
        case 'twPowerGirdAccident':
          classes = []
          classes.push('AccidentGraphEleActive')
          break
        case 'knowledgePoints':
          classes = []
          classes.push('AccidentGraphEleActive')
          break
        // default:
        //   classes.push('is-placemiddle')
      }
      // 组件传入的自定义类名
      classes.push(this.className)

      return classes.join(' ')
    }
  },
  /**
   * @description: 组件初始化处理，添加一些监听事件
   */
  mounted() {
    // this.initThree2()
    emitter.on('showGraphData', (val) => {
      switch (val.renderMethod) {
        case 0:
          this.isActive = false
          this.right = '17%'
          this.bottom = '19%'
          setTimeout(() => {
            this.initThree(val.url)
          }, 100)
          break
        case 1:
          this.isActive = true
          setTimeout(() => {
            this.initThree3(val.url)
          }, 100)
          break
        case 2:
          this.isActive = false
          setTimeout(() => {
            this.initThree(val.url)
          }, 100)
          this.right = '58%'
          this.bottom = '32%'

          break
        // 台湾事故
        case 3:
          this.isActive = false
          setTimeout(() => {
            this.initThree(val.url)
          }, 100)
          this.right = '5%'
          this.bottom = '30%'
          break
        // 陆海空
        case 4:
          this.isActive = false
          setTimeout(() => {
            this.initThree(val.url)
          }, 100)
          this.right = '0%'
          this.bottom = '0%'
          this.width = '30%'
          this.height = '100%'

          break
        case 5: // 舰载机起降
          this.isActive = false
          this.right = '3%'
          this.bottom = '5%'
          setTimeout(() => {
            this.initThree(val.url)
          }, 100)
          break
        default:
          break
      }
    })
    emitter.on('graphZoom', (val) => {
      this.graphZoomOut()
    })
  },
  methods: {
    /**
     * @description: 初始化 Three天空盒
     */
    initThree2() {
      initSkyBox()
    },
    /**
     * @description: 初始化 Three.js 场景
     * @param {string} url - JSON 数据的 URL 地址
     */
    initThree(url) {
      const highlightNodes = new Set()
      const highlightLinks = new Set()
      let hoverNode = null
      this.clearScene()
      if (typeof url === 'undefined') {
        url = './static/里根号图谱3d.json'
      }
      let that = this
      const bloomLayer = new THREE.Layers()
      bloomLayer.set(that.BLOOM_SCENE)
      const textureLoader = new THREE.TextureLoader()
      const normalMap4 = textureLoader.load('static/image/three/golfball.jpg')
      const clearcoatNormalMap = textureLoader.load(
        'static/image/three/Scratched_gold_01_1K_Normal.png'
      )
      this.imgTextureBall1 = new THREE.TextureLoader().load(
        `static/image/three/ball/merge/mergeBallAQU.png`
      )

      this.imgTextureBall2 = new THREE.TextureLoader().load(
        `static/image/three/ball/merge/mergeBallYellow.png`
      )
      this.imgTextureBall3 = new THREE.TextureLoader().load(
        `static/image/three/ball/merge/mergeBallRed.png`
      )
      this.imgTextureBall4 = new THREE.TextureLoader().load(
        `static/image/three/ball/merge/mergeBallBlue.png`
      )
      //   const nodeColorScale = d3.scaleOrdinal(d3.schemeRdYlGn[4])
      const Graph = ForceGraph3D({
        extraRenderers: [new CSS2DRenderer()]
      })(document.getElementById('d3graph'))
        // .jsonUrl(url)
        .numDimensions(3)
        .linkDirectionalParticles(2)
        .graphData(url)
        // .jsonUrl('static/data/json/HJJ测试图谱数据2.json')
        .nodeRelSize(['group'])
        .nodeLabel('id')
        .nodeAutoColorBy('group')
        .nodeOpacity(0.5)
        .linkWidth(0.5)
        .linkOpacity(0.5)
        .onLinkHover((link) => {
          highlightNodes.clear()
          highlightLinks.clear()

          if (link) {
            highlightLinks.add(link)
            highlightNodes.add(link.source)
            highlightNodes.add(link.target)
          }

          updateHighlight()
        })
        // .linkDirectionalParticles('value')
        // .linkDirectionalParticleSpeed((d) => d.value * 0.05)
        .onNodeClick((node) => {
          let en = window.viewer.entities.getById(node.name + '_id')
          if (en) {
            // console.log(en.ellipsoid.radii.getValue())
            let r = en.ellipsoid.radii.getValue()
            viewer.flyTo(en, {
              duration: 2,
              offset: new Cesium.HeadingPitchRange(
                Cesium.Math.toRadians(155),
                Cesium.Math.toRadians(-30),
                r.x * 8
              )
            })
          }
          const distance = 40
          const distRatio = 2 + distance / Math.hypot(node.x, node.y, node.z)
          Graph.cameraPosition(
            {
              x: node.x * distRatio,
              y: node.y * distRatio,
              z: node.z * distRatio
            }, // new position
            node, // lookAt ({ x, y, z })
            3000 // ms transition duration
          )
        }) //单击在新页面打开
        .nodeThreeObjectExtend(true)
        .nodeThreeObject((node) => {
          var colorArray = new Float32Array([
            Math.random(),
            Math.random(),
            Math.random()
          ])
          let materialG = new THREE.MeshPhysicalMaterial({
            metalness: 0.0,
            roughness: 0.1,
            clearcoat: 1.0,
            color: 0xff0000,
            normalMap: normalMap4,
            clearcoatNormalMap: clearcoatNormalMap,

            // y scale is negated to compensate for normal map handedness.
            clearcoatNormalScale: new THREE.Vector2(2.0, -2.0)
          })
          materialG.color.fromArray(colorArray)

          var sphereMaterial = new THREE.MeshPhongMaterial({ color: 0xeeeeee })
          // const imgTexture = new THREE.TextureLoader().load(`./imgs/${img}`)
          // const material = new THREE.SpriteMaterial({ map: imgTexture })
          const geometry = new THREE.SphereGeometry(8, 64, 32)
          let mesh = new THREE.Mesh(geometry, materialG)

          const sprite = new SpriteText(node.id)
          // console.log(sprite)
          // sprite.position.z += 20
          sprite.position.y += 15
          sprite.material.depthWrite = true // make sprite background transparent
          sprite.color = node.color
          sprite.textHeight = 12
          sprite.fontSize = 20
          sprite.fontWeight = 'bold'
          let group = new THREE.Group()

          const nodeEl = document.createElement('div')
          nodeEl.textContent = node.id
          // nodeEl.style.color = node.color
          nodeEl.className = 'node-label'
          let i = Math.round(Math.random() * 3)
          let map
          switch (i) {
            case 0:
              map = that.imgTextureBall1
              break
            case 1:
              map = that.imgTextureBall2
              break
            case 2:
              map = that.imgTextureBall3
              break
            case 3:
              map = that.imgTextureBall4
              break
            default:
              break
          }
          const materialBall = new THREE.SpriteMaterial({
            map: map
          })
          const sprite2 = new THREE.Sprite(materialBall)
          sprite2.color = materialG.color.fromArray(colorArray)

          sprite2.scale.set(25, 25)
          group.add(sprite)
          group.add(sprite2)
          return group
        })

      function updateHighlight() {
        // trigger update of highlighted objects in scene
        Graph.nodeColor(Graph.nodeColor())
          .linkWidth(Graph.linkWidth())
          .linkDirectionalParticles(Graph.linkDirectionalParticles())
      }
      Graph.d3Force('charge').strength(-120)

      // let angle = 0
      // let isRotationActive = true
      // let distance = 1400
      let rotateControl = true
      // let setI1 = setInterval(() => {
      //   if (distance > 600) {
      //     distance -= 5
      //   } else {
      //     angle += Math.PI / 300
      //   }
      //   if (isRotationActive) {
      //     Graph.cameraPosition({
      //       x: distance * Math.sin(angle),
      //       z: distance * Math.cos(angle)
      //     })
      //     // angle += Math.PI / 300
      //   }
      // }, 1)
      const container = document.getElementById('d3graph')
      let graphControlDes = document.getElementsByClassName('scene-nav-info')
      // graphControlDes.display = 'none'
      Graph.height(container.clientHeight)
        .width(container.clientWidth)
        .backgroundColor('#9dadc1')
      window.Graph = Graph
      window.graphScene = Graph.scene()
      window.graphCamera = Graph.camera()
      window.graphControls = Graph.controls()
      window.graphRenderer = Graph.renderer()
      window.graphRenderer.setPixelRatio(window.devicePixelRatio)
      this.initSize(container)

      // 场景背景色
      // window.graphScene.background = new THREE.Color(0x020924)
      // 场景天空盒
      initSkyBox()
      // 更新摄像头
      window.graphCamera.aspect = container.clientWidth / container.clientHeight
      window.graphCamera.position.set(0, 0, 491)
      window.graphCamera.lookAt(0, 0, 0)
      //   更新摄像机的投影矩阵
      window.graphCamera.updateProjectionMatrix()

      window.graphControls.enableDamping = true

      // setTimeout(() => {
      //   window.graphControls.autoRotate = true;
      // }, 3000);
      // this.graphRotate()
      // 设置渲染尺寸大小
      Graph.renderer().setSize(
        window.innerWidth * 0.4,
        window.innerHeight * 0.4
      )
      // window.graphRenderer.toneMapping = THREE.ReinhardToneMapping
      // window.graphRenderer.shadowMap.enabled = true
      // document.body.appendChild(window.graphRenderer.domElement)
      const renderScene = new RenderPass(window.graphScene, window.graphCamera)

      window.graphCamera.position.set(
        248.48281556564794,
        175.69582143275937,
        -73.8552213315919
      )
      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
      )
      bloomPass.threshold = this.params.bloomThreshold
      bloomPass.strength = this.params.bloomStrength
      bloomPass.radius = this.params.bloomRadius

      const bloomComposer = new EffectComposer(window.graphRenderer)
      bloomComposer.renderToScreen = false
      bloomComposer.addPass(renderScene)
      bloomComposer.addPass(bloomPass)
      const finalPass = new ShaderPass(
        new THREE.ShaderMaterial({
          uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: bloomComposer.renderTarget2.texture }
          },
          vertexShader: `
          			varying vec2 vUv;

			             void main() {

				              vUv = uv;

				              gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
              }
          `,
          fragmentShader: `
          			uniform sampler2D baseTexture;
			          uniform sampler2D bloomTexture;

			          varying vec2 vUv;

			          void main() {

				           gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

			          }
          `,
          defines: {}
        }),
        'baseTexture'
      )
      finalPass.needsSwap = true

      const finalComposer = new EffectComposer(window.graphRenderer)
      finalComposer.addPass(renderScene)
      finalComposer.addPass(finalPass)

      const raycaster = new THREE.Raycaster()

      const mouse = new THREE.Vector2()

      window.addEventListener('pointerdown', onPointerDown)

      function onPointerDown(event) {
        mouse.x =
          ((event.clientX - container.offsetLeft) / container.clientWidth) * 2 -
          1
        mouse.y =
          -((event.clientY - container.offsetTop) / container.clientHeight) *
            2 +
          1

        raycaster.setFromCamera(mouse, window.graphCamera)
        const intersects = raycaster.intersectObjects(
          window.graphScene.children,
          false
        )
        if (intersects.length > 0) {
          // console.log(intersects[0].object)
          const object = intersects[0].object
          object.layers.toggle(that.BLOOM_SCENE)
          // render()
        }
      }

      window.addEventListener('mousemove', () => {})

      // 监听屏幕大小改变的变化，设置渲染的尺寸
      window.addEventListener('load', () => {
        // console.log("resize");
        // 更新摄像头
        window.graphCamera.aspect =
          container.clientWidth / container.clientHeight
        //   更新摄像机的投影矩阵
        window.graphCamera.updateProjectionMatrix()

        //   更新渲染器
        window.graphRenderer.setSize(
          container.clientWidth,
          container.clientHeight
        )
        //   设置渲染器的像素比例
        window.graphRenderer.setPixelRatio(window.devicePixelRatio)
      })

      // 监听屏幕大小改变的变化，设置渲染的尺寸
      window.addEventListener('resize', () => {
        // 更新摄像头
        window.graphCamera.aspect =
          container.clientWidth / container.clientHeight
        //   更新摄像机的投影矩阵
        window.graphCamera.updateProjectionMatrix()

        //   更新渲染器
        window.graphRenderer.setSize(
          container.clientWidth,
          container.clientHeight
        )
        //   设置渲染器的像素比例
        window.graphRenderer.setPixelRatio(window.devicePixelRatio)
      })

      // 软件型谱点击详情自适应大小
      // this.$bus.$on('graphViewerChangeSize', (val) => {
      //   // 更新摄像头
      //   window.graphCamera.aspect =
      //     container.clientWidth / container.clientHeight
      //   //   更新摄像机的投影矩阵
      //   window.graphCamera.updateProjectionMatrix()

      //   //   更新渲染器
      //   window.graphRenderer.setSize(
      //     container.clientWidth,
      //     container.clientHeight
      //   )
      //   //   设置渲染器的像素比例
      //   window.graphRenderer.setPixelRatio(window.devicePixelRatio)
      // })

      // initFloor(this.BLOOM_SCENE)

      initSpatialLightPoints()
      initNumParticle()
      this.initLight()

      // let universeGeometry = new THREE.SphereGeometry(7000, 100, 100)
      // let universeMaterial = new THREE.MeshLambertMaterial({
      //   //高光材质
      //   map: new THREE.TextureLoader().load(
      //     'static/image/three/5315ffea251c29681610523217.jpg'
      //   ),
      //   side: THREE.DoubleSide //双面显示
      // })
      // //宇宙网格
      // let universeMesh = new THREE.Mesh(universeGeometry, universeMaterial)
      // universeMesh.layers.toggle(this.BLOOM_SCENE)
      // universeMesh.name = '宇宙'
      // Graph.scene().add(universeMesh)

      this.animate()
      window.addEventListener('dblclick', () => {
        if (rotateControl) {
          that.clearGraphRotate()
          // clearInterval(setI1)
          rotateControl = false
        } else {
          rotateControl = true
          that.graphRotate()
          // setI1 = setInterval(() => {
          //   if (distance > 600) {
          //     distance -= 5
          //   } else {
          //     angle += Math.PI / 300
          //   }
          //   if (isRotationActive) {
          //     Graph.cameraPosition({
          //       x: distance * Math.sin(angle),
          //       z: distance * Math.cos(angle)
          //     })
          //     // angle += Math.PI / 300
          //   }
          // }, 1)
        }
      })
    },
    /**
     * @description: 初始化 Three.js 场景
     * @param {string} url - JSON 数据的 URL 地址
     */
    initThree3(url) {
      const elem = document.getElementById('d3graph')

      const Graph = ForceGraph3D()(elem)
        .jsonUrl(url)
        .nodeAutoColorBy('user')
        .nodeLabel((node) => `${node.user}: ${node.description}`)
        .onNodeClick((node) => {
          console.log(node)
          window.open(`https://bl.ocks.org/${node.user}/${node.id}`, '_blank')
        })

      const container = document.getElementById('d3graph')
      let graphControlDes = document.getElementsByClassName('scene-nav-info')
      // graphControlDes.display = 'none'
      Graph.height(container.clientHeight)
        .width(container.clientWidth)
        .backgroundColor('#9dadc1')

      window.Graph = Graph
      window.graphScene = Graph.scene()
      window.graphCamera = Graph.camera()
      window.graphControls = Graph.controls()
      window.graphRenderer = Graph.renderer()
      window.graphRenderer.setPixelRatio(window.devicePixelRatio)

      // 场景背景色
      // window.graphScene.background = new THREE.Color(0x020924)
      // 场景天空盒
      initSkyBox()

      // 更新摄像头
      window.graphCamera.aspect = container.clientWidth / container.clientHeight
      // window.graphCamera.position.set(0, 0, 491)
      // window.graphCamera.lookAt(0, 0, 0)
      //   更新摄像机的投影矩阵
      window.graphCamera.updateProjectionMatrix()

      window.graphControls.enableDamping = true

      // setTimeout(() => {
      //   window.graphControls.autoRotate = true;
      // }, 3000);
      // 设置渲染尺寸大小
      Graph.renderer().setSize(window.innerWidth, window.innerHeight)
      // window.graphRenderer.toneMapping = THREE.ReinhardToneMapping
      // window.graphRenderer.shadowMap.enabled = true
      // document.body.appendChild(window.graphRenderer.domElement)
      const renderScene = new RenderPass(window.graphScene, window.graphCamera)

      const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(window.innerWidth, window.innerHeight),
        1.5,
        0.4,
        0.85
      )
      bloomPass.threshold = this.params.bloomThreshold
      bloomPass.strength = this.params.bloomStrength
      bloomPass.radius = this.params.bloomRadius

      const bloomComposer = new EffectComposer(window.graphRenderer)
      bloomComposer.renderToScreen = false
      bloomComposer.addPass(renderScene)
      bloomComposer.addPass(bloomPass)
      const finalPass = new ShaderPass(
        new THREE.ShaderMaterial({
          uniforms: {
            baseTexture: { value: null },
            bloomTexture: { value: bloomComposer.renderTarget2.texture }
          },
          vertexShader: `
          			varying vec2 vUv;

			             void main() {

				              vUv = uv;

				              gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
              }
          `,
          fragmentShader: `
          			uniform sampler2D baseTexture;
			          uniform sampler2D bloomTexture;

			          varying vec2 vUv;

			          void main() {

				           gl_FragColor = ( texture2D( baseTexture, vUv ) + vec4( 1.0 ) * texture2D( bloomTexture, vUv ) );

			          }
          `,
          defines: {}
        }),
        'baseTexture'
      )
      finalPass.needsSwap = true

      const finalComposer = new EffectComposer(window.graphRenderer)
      finalComposer.addPass(renderScene)
      finalComposer.addPass(finalPass)

      const raycaster = new THREE.Raycaster()

      const mouse = new THREE.Vector2()

      window.addEventListener('pointerdown', onPointerDown)

      function onPointerDown(event) {
        mouse.x =
          ((event.clientX - container.offsetLeft) / container.clientWidth) * 2 -
          1
        mouse.y =
          -((event.clientY - container.offsetTop) / container.clientHeight) *
            2 +
          1

        raycaster.setFromCamera(mouse, window.graphCamera)
        const intersects = raycaster.intersectObjects(
          window.graphScene.children,
          false
        )
        if (intersects.length > 0) {
          // console.log(intersects[0].object)
          const object = intersects[0].object
          object.layers.toggle(that.BLOOM_SCENE)
          // render()
        }
      }

      window.addEventListener('mousemove', () => {})

      // 监听屏幕大小改变的变化，设置渲染的尺寸
      window.addEventListener('load', () => {
        // console.log("resize");
        // 更新摄像头
        window.graphCamera.aspect =
          container.clientWidth / container.clientHeight
        //   更新摄像机的投影矩阵
        window.graphCamera.updateProjectionMatrix()

        //   更新渲染器
        window.graphRenderer.setSize(
          container.clientWidth,
          container.clientHeight
        )
        //   设置渲染器的像素比例
        window.graphRenderer.setPixelRatio(window.devicePixelRatio)
      })

      // 监听屏幕大小改变的变化，设置渲染的尺寸
      window.addEventListener('resize', () => {
        // 更新摄像头
        window.graphCamera.aspect =
          container.clientWidth / container.clientHeight
        //   更新摄像机的投影矩阵
        window.graphCamera.updateProjectionMatrix()

        //   更新渲染器
        window.graphRenderer.setSize(
          container.clientWidth,
          container.clientHeight
        )
        //   设置渲染器的像素比例
        window.graphRenderer.setPixelRatio(window.devicePixelRatio)
      })

      // 软件型谱点击详情自适应大小
      // this.$bus.$on('graphViewerChangeSize', (val) => {
      //   // 更新摄像头
      //   window.graphCamera.aspect =
      //     container.clientWidth / container.clientHeight
      //   //   更新摄像机的投影矩阵
      //   window.graphCamera.updateProjectionMatrix()

      //   //   更新渲染器
      //   window.graphRenderer.setSize(
      //     container.clientWidth,
      //     container.clientHeight
      //   )
      //   //   设置渲染器的像素比例
      //   window.graphRenderer.setPixelRatio(window.devicePixelRatio)
      // })

      // initFloor(this.BLOOM_SCENE)

      initSpatialLightPoints()
      initNumParticle()
      this.initLight()

      // let universeGeometry = new THREE.SphereGeometry(7000, 100, 100)
      // let universeMaterial = new THREE.MeshLambertMaterial({
      //   //高光材质
      //   map: new THREE.TextureLoader().load(
      //     'static/image/three/5315ffea251c29681610523217.jpg'
      //   ),
      //   side: THREE.DoubleSide //双面显示
      // })
      // //宇宙网格
      // let universeMesh = new THREE.Mesh(universeGeometry, universeMaterial)
      // universeMesh.layers.toggle(this.BLOOM_SCENE)
      // universeMesh.name = '宇宙'
      // Graph.scene().add(universeMesh)

      this.animate()
      window.addEventListener('dblclick', () => {
        if (rotateControl) {
          that.clearGraphRotate()
          // clearInterval(setI1)
          rotateControl = false
        } else {
          rotateControl = true
          that.graphRotate()
          // setI1 = setInterval(() => {
          //   if (distance > 600) {
          //     distance -= 5
          //   } else {
          //     angle += Math.PI / 300
          //   }
          //   if (isRotationActive) {
          //     Graph.cameraPosition({
          //       x: distance * Math.sin(angle),
          //       z: distance * Math.cos(angle)
          //     })
          //     // angle += Math.PI / 300
          //   }
          // }, 1)
        }
      })
    },
    /**
     * @description 空间粒子位置更新
     */
    undatePointsPosition() {
      //   const timePoints = Date.now() * 0.000001;
      const clock = new THREE.Clock()
      const time = clock.getElapsedTime()
      for (let i = 0; i < window.graphScene.children.length; i++) {
        const object = window.graphScene.children[i]
        if (object instanceof THREE.Points) {
          object.rotation.y += 0.0015 //timePoints * (i < 4 ? i + 1 : -(i + 1))
        }
      }
      if (
        typeof window.lightPointMaterials != 'undefined' &&
        window.lightPointMaterials.length > 0
      ) {
        for (let i = 0; i < window.lightPointMaterials.length; i++) {
          const color = window.spatialLightPointsParameters[i][0]
          const h = ((360 * (color[0] + time)) % 360) / 360
          window.lightPointMaterials[i].color.setHSL(h, color[1], color[2])
        }
      }
    },
    /**
     * 动画函数，用于更新场景中的对象和渲染器的渲染
     * @param {number} t - 时间戳
     */
    animate(t) {
      let that = this
      window.graphControls.update()
      const clock = new THREE.Clock()
      const time = clock.getElapsedTime()
      if (window.floorPlane) {
        window.floorPlane.rotation.z += 0.01
      }
      // if (that.imgTextureBall) {
      //   that.imgTextureBall.rotation -= 0.001
      // }

      // 空间粒子
      that.undatePointsPosition()
      // 上升数字
      if (
        typeof window.particleArr != 'undefined' &&
        window.particleArr.length > 0
      ) {
        for (let i = 0; i < window.particleArr.length; i++) {
          window.particleArr[i].updateSequenceFrame()
          window.particleArr[i].position.y += 0.35
          if (window.particleArr[i].position.y >= 550) {
            window.particleArr[i].position.y = -10
          }
        }
      }
      // 底图
      if (window.graphFloorGroup) {
        window.graphFloorGroup.children[0].rotation.z += 0.001
        window.graphFloorGroup.children[1].rotation.z -= 0.006
        window.graphFloorGroup.children[2].rotation.z += 0.005
      }
      requestAnimationFrame(that.animate)
      // 使用渲染器渲染相机看这个场景的内容渲染出来
      window.graphRenderer.render(window.graphScene, window.graphCamera)
    },
    /**
     * 初始化光照
     */
    initLight() {
      var spotLight = new THREE.SpotLight(0xffffff, 1)
      spotLight.position.set(-2800, 800, 800)
      spotLight.angle = Math.PI / 6
      spotLight.penumbra = 0.05
      spotLight.decay = 3.0
      spotLight.distance = 6000
      spotLight.intensity = 1.5
      spotLight.castShadow = true
      spotLight.shadow.mapSize.width = 1024
      spotLight.shadow.mapSize.height = 1024
      spotLight.shadow.camera.near = 10
      spotLight.shadow.camera.far = 10000
      window.graphScene.add(spotLight)

      // lights
      var spotLight1 = new THREE.SpotLight(0x00ff00) // 0x08008f
      spotLight1.position.set(1, 400, 1)
      spotLight1.intensity = 0.8
      spotLight1.angle = Math.PI / 2
      spotLight1.penumbra = 1.5
      spotLight1.decay = 0.3
      spotLight1.distance = 500
      window.graphScene.add(spotLight1)

      var intensity = 0.5
      var distance = 1000
      var decay = 1.1
      var pointLight = new THREE.PointLight(
        0x00ff00,
        intensity,
        distance,
        decay
      ) // 0x08008f
      pointLight.position.set(1, 200, 1)
      window.graphScene.add(pointLight)

      var dirLight = new THREE.DirectionalLight(0x080808, 1.0)
      dirLight.position.set(200, 800, 200)
      window.graphScene.add(dirLight)

      var ambientLight = new THREE.AmbientLight(0x222222)
      ambientLight.intensity = 0.8
      window.graphScene.add(ambientLight)
    },
    /**
     * 控制图表缩放
     */
    graphZoomControl() {
      let angle = 0
      let isRotationActive = true
      let distance = 600
      let rotateControl = true
      let setI1 = setInterval(() => {
        if (distance < 1400) {
          distance += 10
        } else {
        }
        if (isRotationActive) {
          window.Graph.cameraPosition({
            x: distance * Math.sin(angle),
            z: distance * Math.cos(angle)
          })
          // angle += Math.PI / 300
        }
      }, 1)
    },
    /**
     * 控制图表旋转
     * @param {Number} t - 时间参数
     */
    graphRotate(t) {
      if (this.grRAF) {
        cancelAnimationFrame(this.grRAF)
        this.grRAF = null
      }
      if (!window.Graph) return
      let that = this
      let rotateControl = true
      if (that.distance > 500) {
        that.distance -= 5
      } else {
        that.angle += Math.PI / 1100
      }
      if (that.isRotationActive) {
        window.Graph.cameraPosition({
          x: that.distance * Math.sin(that.angle),
          z: that.distance * Math.cos(that.angle)
        })
        // angle += Math.PI / 300
      }
      this.grRAF = requestAnimationFrame(that.graphRotate)
    },
    /**
     * @description: 清除fraphRotate()
     */
    clearGraphRotate() {
      cancelAnimationFrame(this.grRAF)
    },
    /**
     * @description: 图谱缩小 配合图谱div隐藏
     */
    graphZoomOut() {
      this.clearGraphRotate()
      if (!window.Graph) return
      let that = this
      let rzo = requestAnimationFrame(that.graphZoomOut)
      if (that.distance < 2400) {
        that.distance += 100
      } else {
        if (rzo) cancelAnimationFrame(rzo)
        emitter.emit('showGraphVal', false)
        // that.angle += Math.PI / 300
      }
      if (that.isRotationActive) {
        window.Graph.cameraPosition({
          x: that.distance * Math.sin(that.angle),
          z: that.distance * Math.cos(that.angle)
        })
        // angle += Math.PI / 300
      }
    },
    /**
     * 清空场景，释放资源
     */
    clearScene() {
      if (window.graphScene) {
        window.graphScene.traverse(function (v) {
          if (v.type === 'Mesh') {
            v.children.forEach((c) => {
              if (v.type === 'Group') {
                window.graphScene.remove(v)
              }
            })
            v.geometry.dispose()
            v.material.dispose()
          }
        })
        while (window.graphScene.children.length > 0) {
          window.graphScene.remove(window.graphScene.children[0])
        }
        window.graphScene = null
      }
      if (window.graphRenderer) {
        window.graphRenderer.dispose()
        window.graphRenderer.forceContextLoss()
        // window.graphRenderer.domElement = null
        window.graphRenderer = null
      }
      if (window.graphCamera) {
        window.graphCamera = null
      }
      if (window.graphControls) {
        window.graphControls = null
      }
      if (window.Graph) {
        window.Graph = null
      }
    },
    /**
     * 初始屏幕自适应
     * @param {HTMLElement} container - 包含渲染器的容器元素
     */
    initSize(container) {
      // 更新摄像头
      window.graphCamera.aspect = container.clientWidth / container.clientHeight
      //   更新摄像机的投影矩阵
      window.graphCamera.updateProjectionMatrix()

      //   更新渲染器
      window.graphRenderer.setSize(
        container.clientWidth,
        container.clientHeight
      )
      //   设置渲染器的像素比例
      window.graphRenderer.setPixelRatio(window.devicePixelRatio)
    }
  }
}
</script>

<style lang="less" scoped>
.graphEle {
  position: absolute;
  bottom: 19%;
  right: 17%;
  width: 40%;
  height: 60%;
  user-select: none;
  z-index: 99;
}
.graphEleActive {
  position: absolute;
  //   bottom: 0%;
  //   left: 0%;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  user-select: none;
  z-index: 99;
}
// 台湾电网
.twPowerGridGraphEleActive {
  position: absolute;
  //   bottom: 0%;
  //   left: 0%;
  top: 0%;
  left: 0%;
  width: 100%;
  height: 100%;
  user-select: none;
  z-index: 9999;
}
#d3graph {
  height: 100%;
  width: 100%;
  display: block;
  // background-color: black;
}
::v-deep .scene-nav-info,
.scene-tooltip {
  position: absolute;
  font-family: sans-serif;
  pointer-events: none;
  display: none;
}
</style>
