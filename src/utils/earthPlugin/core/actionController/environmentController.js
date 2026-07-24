import store from '@/store'
export default class EnvironmentController {
  constructor(options) {
    this.Earth = options.earth
    this.viewer = options.viewer
    this.cloudArray = []
  }
  particleCloudByOption(option) {
    let cloudCol = new this.Earth.CloudCollection({
      noiseDetail: 16.0,
      noiseOffset: this.Earth.Cartesian3.ZERO
    })
    cloudCol.name = 'customCloud'
    const clouds = this.viewer.scene.primitives.add(cloudCol)
    this.cloudArray.push({
      id: option.id,
      cloud: clouds
    })
    let offset = [
      [0, 0, 0],
      [0, -0.4, 1000],
      [0, 0.4, 1000],
      [0.4, 0, 1000],
      [-0.4, 0, 1000],
      [0.3, -0.3, 1000],
      [-0.3, 0.3, 1000],
      [0.3, 0.3, 1000],
      [-0.3, -0.3, 1000]
    ]
    for (let index = 0; index < offset.length; index++) {
      const element = offset[index]
      clouds.add({
        position: this.Earth.Cartesian3.fromDegrees(
          option.position[0] + element[0],
          option.position[1] + element[1],
          11000 + element[2]
        ),
        scale: new this.Earth.Cartesian2(500000 / 2, 250000 / 2),
        maximumSize: new this.Earth.Cartesian3(20.0, 12.0, 8.0),
        color: this.Earth.Color.White,
        slice: 0.32,
        brightness: 1
      })
    }
  }
  /**
   * 聚合
   * @param {DataSource} 要聚合的数据源
   * @param {Number} range 聚合距离
   * @param {Number} minSize 每个聚合点的最小聚合个数
   */
  handleCluster(data, range, minSize) {
    // 聚合
    const pixelRange = range || 4
    const minimumClusterSize = minSize || 3
    //clustering 获取或设置此数据源的群集选项。此对象可以在多个数据源之间共享。
    data.clustering.enabled = true //获取或设置是否启用群集。
    data.clustering.pixelRange = pixelRange //pixelRange 是聚合距离，也就是小于这个距离就会被聚合,以像素为单位
    data.clustering.minimumClusterSize = minimumClusterSize //minimumClusterSize是每个聚合点的最小聚合个数，这个值最好是设置为2，因为两个图标也可能叠压。
    data.clustering.clusterBillboards = false //minimumClusterSize是每个聚合点的最小聚合个数，这个值最好是设置为2，因为两个图标也可能叠压。
    let removeListener

    function customStyle() {
      if (window.MSIMEarth.defined(removeListener)) {
        removeListener()
        removeListener = undefined
      } else {
        removeListener = data.clustering.clusterEvent.addEventListener(
          function (clusteredEntities, cluster) {
            cluster.label.show = false
            cluster.billboard.show = true
            cluster.billboard.width = 0
            cluster.billboard.height = 0
          }
        )
      }
      // force a re-cluster with the new styling
      const pixelRange = data.clustering.pixelRange
      data.clustering.pixelRange = 0
      data.clustering.pixelRange = pixelRange
    }
    customStyle()
  }
  /**
   * 聚合 图片
   * @param {DataSource} 要聚合的数据源
   * @param {Number} range 聚合距离
   * @param {Number} minSize 每个聚合点的最小聚合个数
   */
  handleClusterBillboard(data, range, minSize) {
    // 聚合
    const pixelRange = range || 4
    const minimumClusterSize = minSize || 3
    //clustering 获取或设置此数据源的群集选项。此对象可以在多个数据源之间共享。
    data.clustering.enabled = true //获取或设置是否启用群集。
    data.clustering.pixelRange = pixelRange //pixelRange 是聚合距离，也就是小于这个距离就会被聚合,以像素为单位
    data.clustering.minimumClusterSize = minimumClusterSize //minimumClusterSize是每个聚合点的最小聚合个数，这个值最好是设置为2，因为两个图标也可能叠压。
    let pinBuilder = new window.MSIMEarth.PinBuilder()
    let removeListener

    function customStyle() {
      if (window.MSIMEarth.defined(removeListener)) {
        removeListener()
        removeListener = undefined
      } else {
        removeListener = data.clustering.clusterEvent.addEventListener(
          function (clusteredEntities, cluster) {
            cluster.label.show = false
            cluster.billboard.show = true
            cluster.billboard.id = cluster.label.id
            // cluster.billboard.image = pinBuilder
            //   .fromText(
            //     clusteredEntities.length,
            //     window.MSIMEarth.Color.RED,
            //     48
            //   )
            //   .toDataURL()

            // 根据聚合数量的多少设置不同层级的图片以及大小
            cluster.billboard.image = combineIconAndLabel(
              './static/image/billboard/聚合.png',
              clusteredEntities.length,
              64
            )
            cluster.billboard._imageHeight = 60
            cluster.billboard._imageWidth = 60
            cluster.billboard._dirty = false
            cluster.billboard.width = 40
            cluster.billboard.height = 40
          }
        )
      }
      // force a re-cluster with the new styling
      const pixelRange = data.clustering.pixelRange
      data.clustering.pixelRange = 0
      data.clustering.pixelRange = pixelRange
    }
    customStyle()

    /**
     * @description: 将图片和文字合成新图标使用（参考Cesium源码）
     * @param {*} url：图片地址
     * @param {*} label：文字
     * @param {*} size：画布大小
     * @return {*} 返回canvas
     */
    function combineIconAndLabel(url, label, size) {
      // 创建画布对象
      let canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      let ctx = canvas.getContext('2d')

      let promise = new window.MSIMEarth.Resource.fetchImage(url).then(
        (image) => {
          // 异常判断
          try {
            ctx.drawImage(image, 0, 0)
          } catch (e) {
            console.log(e)
          }

          // 渲染字体
          // font属性设置顺序：font-style, font-variant, font-weight, font-size, line-height, font-family
          ctx.fillStyle = window.MSIMEarth.Color.WHITE.toCssColorString()
          ctx.font = 'bold 20px Microsoft YaHei'
          ctx.textAlign = 'center'
          ctx.textBaseline = 'middle'
          ctx.fillText(label, size / 2, size / 2)

          return canvas
        }
      )
      return promise
    }
  }
  removeCloud(id) {
    let index = this.cloudArray.findIndex((item) => item.id == id)
    if (this.cloudArray && index >= 0) {
      window.EarthViewer.scene.primitives.remove(this.cloudArray[index].cloud)
      this.cloudArray.splice(index, 1)
    }
  }
  addPostProcess() {
    const t2 = `
      uniform sampler2D colorTexture;
			varying vec2 v_textureCoordinates;
			#define EDGE .2
			float rand(float co) { return fract(sin(co*(91.3458)) * 47453.5453); }
			float rand(vec2 co){ return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453); }
			float rand(vec3 co){ return rand(co.xy+rand(co.z)); }
			float pi = atan(1.)*4.;
			void main(void) {

					float iTime = czm_frameNumber / 60.0;
					vec2 resolution = czm_viewport.zw;

					float randFloor = 40.;
					float vertPhase = .2;
					float frequency = .008;
					float amplitude = 2.;
					float vertMin = 0.0;
					float vertMax = 1.;

					float vertGatePhase = .8;
					float Gatefrequency = 1.8;
					float gateMin = .1;
					float gateMax = .4;


					vec2 uv = gl_FragCoord.xy/resolution.xy;
					float time = iTime;
					float pass1 = clamp(asin(sin((time+uv.y*vertGatePhase)*2.*pi/Gatefrequency)),gateMin,gateMax);
					float scroll = amplitude * clamp(sin(time/frequency+(uv.y*vertPhase)),vertMin,vertMax);
					float randX =  floor(rand(time*0.2)*randFloor)/randFloor * .3;
					uv += vec2(scroll*pass1*.01,0);
					vec4 c = texture2D(colorTexture, uv);

						gl_FragColor = mix(texture2D(colorTexture, v_textureCoordinates), c, 0.3);
				}`

    const edge = `
    uniform sampler2D colorTexture;
    varying vec2 v_textureCoordinates;
    #define EDGE .1
    void main(void) {

        float iTime = czm_frameNumber / 60.0;
        vec2 resolution = czm_viewport.zw;

        vec2 uv = gl_FragCoord.xy / resolution.xy;
        float edge = EDGE * abs(sin(iTime / 5.));

        vec4 fragColor =texture2D(colorTexture, v_textureCoordinates);
        fragColor *= (smoothstep(0., edge, uv.x)) * (1. - smoothstep(1. - edge, 1., uv.x));
        fragColor *= (smoothstep(0., edge, uv.y)) * (1. - smoothstep(1. - edge, 1., uv.y));

        gl_FragColor = fragColor;
    }`

    function createThunderStage2() {
      var e = new window.MSIMEarth.PostProcessStage({
        name: 'czm_edge2',
        fragmentShader: t2
      })
      return e
    }
    function createEdgeStage(Cesium) {
      var e = new Cesium.PostProcessStage({
        name: 'czm_edge',
        fragmentShader: edge
      })
      return e
    }
    // 开启后期处理
    var collection = window.EarthViewer.scene.postProcessStages
    window.postedge = createEdgeStage(window.MSIMEarth)
    window.postedge2 = createThunderStage2(window.MSIMEarth)
    collection.add(window.postedge)
    collection.add(window.postedge2)
  }
  closePostProcess() {
    window.EarthViewer.scene.postProcessStages.remove(window.postedge)
    window.EarthViewer.scene.postProcessStages.remove(window.postedge2)
  }
  addBoxLayer(options) {
    window.EarthViewer.entities.add({
      id: options.id,
      position: window.MSIMEarth.Cartesian3.fromDegrees(...options.position),
      box: {
        dimensions: new window.MSIMEarth.Cartesian3(...options.dimensions),
        material: new window.MSIMEarth.Color(
          options.color[0] / 255,
          options.color[1] / 255,
          options.color[2] / 255,
          options.color[3]
        ),
        outline: false,
        outlineColor: new window.MSIMEarth.Color(
          options.color[0] / 255,
          options.color[1] / 255,
          options.color[2] / 255,
          1
        )
      }
    })
  }
  addManyBoxExample() {
    this.addBoxLayer({
      id: 'box111',
      position: [119.354046678247, 23.948466331195217, 0],
      dimensions: [400000, 100000, 8000],
      color: [51, 255, 255, 0.3]
    })
    this.addBoxLayer({
      id: 'box1112',
      position: [119.354046678247, 23.948466331195217, 8000 / 2 + 2500 / 2],
      dimensions: [400000, 100000, 2500],
      color: [51, 153, 255, 0.2]
    })
    this.addBoxLayer({
      id: 'box1121',
      position: [
        119.354046678247,
        23.948466331195217,
        8000 / 2 + 2500 / 2 + 1500 / 2
      ],
      dimensions: [400000, 100000, 1500],
      color: [51, 0, 255, 0.2]
    })
    this.addBoxLayer({
      id: 'box112',
      position: [
        119.354046678247,
        23.948466331195217,
        8000 / 2 + 2500 / 2 + 1500 / 2 + 2000 / 2 + 1000
      ],
      dimensions: [400000, 100000, 2000],
      color: [51, 153, 255, 0.2]
    })
    // this.addBoxLayer({
    //   id: 'box1131',
    //   position: [119.354046678247, 23.948466331195217, 10000],
    //   dimensions: [400000, 100000, 340000],
    //   color: [255, 0, 0, 0.2]
    // })
    this.addBoxLayer({
      id: 'box113',
      position: [
        119.354046678247,
        23.948466331195217,
        8000 / 2 + 2500 / 2 + 1500 / 2 + 2000 / 2 + 100000 / 2 + 1000
      ],
      dimensions: [400000, 100000, 100000],
      color: [51, 255, 255, 0.2]
    })
  }
  drawTerrainBand() {
    const terrainExaggeration = (speed) => {
      const viewer = window.EarthViewer

      let sp = speed || 0.01
      viewer.scene.globe.depthTestAgainstTerrain = true
      viewer.scene.globe.terrainExaggeration = 0
      terrainBand()
      viewer.camera.flyTo({
        destination: new window.MSIMEarth.Cartesian3(
          -3007850.519157388,
          5137536.34772638,
          2341661.9104861133
        ),
        orientation: {
          heading: 0.3444160325644585,
          pitch: -0.18032308765797556,
          roll: 6.282808059773251
        },
        duration: 3,
        pitchAdjustHeight: 30000,
        complete: () => {
          setTimeout(() => {
            // // 绕台旋转
            // let flyingRoam = new FlyingRoam({})
            // flyingRoam.rotate()
            //
            let inter = setInterval(() => {
              if (viewer.scene.globe.terrainExaggeration > 2) {
                // flyRoamTaiwan()
                // setTimeout(() => {
                //   viewer.scene.globe.material = null
                // }, 7000)
                clearInterval(inter)
                // flyingRoam.quitLook2()
              } else {
                viewer.scene.globe.terrainExaggeration += sp
              }
            }, 100)
          }, 1000)
        }
      })
    }

    const terrainBand = () => {
      const viewer = window.EarthViewer

      let entries1 = []
      let colors = [
        [0, 20, 234, 242, 0],
        [200, 20, 234, 242, 0.8],
        [2000, 44, 176, 14, 0.8],
        [4000, 230, 233, 7, 0.8],
        [6000, 227, 119, 9, 0.8],
        [8000, 235, 7, 12, 0.8]
      ]
      colors.forEach((item) => {
        let entry = {
          height: item[0],
          color: new window.MSIMEarth.Color(
            item[1] / 255,
            item[2] / 255,
            item[3] / 255,
            item[4]
          )
        }
        entries1.push(entry)
      })
      const layerBand = [
        {
          entries: entries1,
          extendDownwards: true,
          extendUpwards: true
        }
      ]
      viewer.scene.globe.material =
        window.MSIMEarth.createElevationBandMaterial({
          scene: viewer.scene,
          layers: layerBand
        })
    }
    // 进入home页面后初始化websocket
    // websocket()
    terrainExaggeration(0.03)
  }
}
