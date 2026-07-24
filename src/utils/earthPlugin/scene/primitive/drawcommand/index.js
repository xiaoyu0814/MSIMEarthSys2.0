import DCPrimitive from './js/customPrimitive.js'
import createHumidityTextureAlias from './humidity/humidityTextureAlias.js'
import createHumidityTextureAliasOD from './weather/humidityTextureAliasOD.js'
import createIceTextureAliasOD from './weather/iceTextureAliasOD.js'
import createTurbulenceTextureAliasOD from './weather/turbulenceTextureAliasOD.js'
import createCloudTextureAliasOD from './weather/cloudTextureAliasOD.js'

export default class DC {
  constructor(config) {
    if (!config.earth || !config.viewer) {
      console.log('构建DC类时没有传递必要的earth和viewer参数')
    }
    this.earth = config.earth
    this.viewer = config.viewer
  }
  // 加载云层图集
  createCloud(volumeCloudData, name) {
    var _0x53c5f = (590787 ^ 590795) + (478871 ^ 478878); let earth = this['\u0065\u0061\u0072\u0074\u0068'] || window['\u004D\u0053\u0049\u004D\u0045\u0061\u0072\u0074\u0068']; _0x53c5f = 776807 ^ 776806; var _0xe3f74e; const geometry = earth['\u0042\u006F\u0078\u0047\u0065\u006F\u006D\u0065\u0074\u0072\u0079']['\u0066\u0072\u006F\u006D\u0044\u0069\u006D\u0065\u006E\u0073\u0069\u006F\u006E\u0073']({ "vertexFormat": earth['\u0056\u0065\u0072\u0074\u0065\u0078\u0046\u006F\u0072\u006D\u0061\u0074']['\u0050\u004F\u0053\u0049\u0054\u0049\u004F\u004E\u005F\u0041\u004E\u0044\u005F\u0053\u0054'], "dimensions": new earth['\u0043\u0061\u0072\u0074\u0065\u0073\u0069\u0061\u006E\u0033'](803783 ^ 803782, 409254 ^ 409255, 474570 ^ 474571) }); _0xe3f74e = (197675 ^ 197676) + (850875 ^ 850866); const options = { "steps": [389437 ^ 389437, 960647 ^ 960642, 689688 ^ 689682, 536650 ^ 536645, 535745 ^ 535765, 667654 ^ 667679, 477562 ^ 477540, 514691 ^ 514720, 954790 ^ 954766, 331685 ^ 331656, 563747 ^ 563729, 687042 ^ 687093, 576886 ^ 576842, 359926 ^ 359863], '\u0076\u0069\u0065\u0077\u004D\u006F\u0064\u0065\u006C': { "threshold": 65, "detail": 200, '\u0078\u0043\u0075\u0074': -0.5, "yCut": -0.5, '\u007A\u0043\u0075\u0074': 0.5 }, '\u0063\u006F\u006C\u006F\u0072\u0073': ["\u0072\u0067\u0062\u0028\u0030\u002C\u0030\u002C\u0030\u002C\u0030\u002E\u0030\u0031\u0029", ")10.0,052,63,071(bgr".split("").reverse().join(""), ")31.0,452,241,212(abgr".split("").reverse().join(""), ")21.0,84,2,832(abgr".split("").reverse().join(""), ")10.0,29,001,452(abgr".split("").reverse().join(""), "\u0072\u0067\u0062\u0061\u0028\u0032\u0035\u0034\u002C\u0031\u0037\u0032\u002C\u0031\u0037\u0032\u002C\u0030\u002E\u0031\u0029", ")10.0,0,041,041(abgr".split("").reverse().join(""), "\u0072\u0067\u0062\u0061\u0028\u0032\u0030\u0030\u002C\u0032\u0030\u0030\u002C\u0032\u002C\u0030\u002E\u0030\u0031\u0029", ")10.0,001,442,252(abgr".split("").reverse().join(""), "\u0072\u0067\u0062\u0061\u0028\u0031\u0036\u002C\u0031\u0034\u0036\u002C\u0032\u0036\u002C\u0030\u002E\u0030\u0036\u0029", "\u0072\u0067\u0062\u0061\u0028\u0030\u002C\u0032\u0033\u0034\u002C\u0030\u002C\u0030\u002E\u0030\u0035\u0029", "\u0072\u0067\u0062\u0061\u0028\u0031\u0036\u0036\u002C\u0032\u0035\u0032\u002C\u0031\u0036\u0038\u002C\u0030\u002E\u0030\u0034\u0029", ")30.0,802,83,03(abgr".split("").reverse().join(""), "\u0072\u0067\u0062\u0061\u0028\u0031\u0032\u0032\u002C\u0031\u0031\u0034\u002C\u0032\u0033\u0038\u002C\u0030\u002E\u0030\u0032\u0029", ")10.0,452,291,291(abgr".split("").reverse().join("")], "geometry": geometry, "data": volumeCloudData }; var _0xe2ec8b; const volumeCloud = new DCPrimitive(options); _0xe2ec8b = (122061 ^ 122056) + (998435 ^ 998433); volumeCloud['\u006E\u0061\u006D\u0065'] = name; this['\u0076\u0069\u0065\u0077\u0065\u0072']['\u0073\u0063\u0065\u006E\u0065']['\u0070\u0072\u0069\u006D\u0069\u0074\u0069\u0076\u0065\u0073']['\u0061\u0064\u0064'](volumeCloud);
  }
  // 加载湿度图集
  createHumidityTextureAlias(config) {
    if (typeof config === 'undefined') {
      config = {
        // 地图范围配置
        region: {
          xmin: 121.4,
          xmax: 121.6,
          ymin: 24.9,
          ymax: 25.2,
          zmin: 1000.0,
          zmax: 15000.0,
        },

        // 材质纹理路径
        texturePath: "/static/image/texture/WETpicture_100m_118-125_21-26/RH_2024-02-05_2100_z_interp_crop_100m_lat_vertical_16x16.png",

        // 渲染参数
        render: {
          steps: 256.0,
          alphaCorrection: 1.0,
        },

        // 湿度颜色配置
        colors: {
          low: "#0000ff", // 蓝色 - 低湿度
          mid: "#85ffff", // 青色 - 中等湿度
          high: "#00ff00", // 绿色 - 高湿度
          gamma: 1.16,
        },

        // 透明度配置
        opacity: {
          alphaPower: 2.0,
          minThreshold: 0.05,
          maxThreshold: 0.5,
          opacityScale: 0.3,
        },

        // 锐化配置
        sharpen: {
          sharpenFactor: 2.0,
          contrast: 1.5,
          edgeThreshold: 0.1,
        },

        // 相机初始位置
        camera: {
          heading: 1.14003,
          pitch: -0.28362,
          roll: 0.00004,
          offsetZ: 1000,
        }
      };
      console.log('使用默认参数', config);
    }
    return createHumidityTextureAlias(config, this.earth, this.viewer)
  }
  // 加载湿度图集原版（original edition 未冲采用锐化等）
  createHumidityTextureAliasOD(config) {
    if (typeof config === 'undefined') {
      // 合并后的配置对象
      config = {
        // 区域配置
        xmin: 121.4,
        xmax: 121.6,
        ymin: 24.9,
        ymax: 25.2,
        zmin: 100.0,
        zmax: 15000.0,

        // 渲染参数
        steps: 256.0,
        alphaCorrection: 0.54,
        humidityLowColor: "#0000ff",
        humidityMidColor: "#00ffff",
        humidityHighColor: "#61f061",
        gamma: 0.6,
        alphaPower: 2.0,
        minThreshold: 0.05,
        maxThreshold: 1.0,
        opacityScale: 0.3,
        texturePath: "/static/image/texture/WETpicture_100m_118-125_21-26/RH_2024-02-05_2100_z_interp_crop_100m_lat_vertical_16x16.png",
      };
      console.log('使用默认参数', config);
    }
    return createHumidityTextureAliasOD(config, this.earth, this.viewer)
  }
  // 加载冰图集原始色调
  createIceTextureAliasOD(config) {
    return createIceTextureAliasOD(config, this.earth, this.viewer)
  }
  // 加载云图集原始色调
  createCloudTextureAliasOD(config) {
    return createCloudTextureAliasOD(config, this.earth, this.viewer)
  }
  // 加载点播图集原始色调
  createTurbulenceTextureAliasOD(config) {
    return createTurbulenceTextureAliasOD(config, this.earth, this.viewer)
  }
}