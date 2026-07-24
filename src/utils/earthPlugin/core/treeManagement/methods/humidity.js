// 湿度数据处理模块
import { getTextureImage } from '@/service/weather'

import {
  updateAllLegendPositions,
  createLegendElement
} from './weatherUtils.js';

import {
  createTextureSwitcher,
  createPlaybackController
} from './voxelTextureRenderer.js';

let humidityConfig = null;
let humidityInstance = null;
let humidityGuiInstance = null;
let humidityPlaybackConfig = null;
let humidityTexturePaths = [];

/**
 * 初始化湿度配置
 */
export function initHumidityConfig(weatherConfig) {
  if (!weatherConfig?.humidity) {
    console.warn('湿度配置未找到');
    return;
  }

  const config = weatherConfig.humidity;
  humidityTexturePaths = config.texturePaths || [];
  
  humidityConfig = {
    ...config.bounds,
    ...config.defaultConfig,
    texturePath: humidityTexturePaths[0]?.path,
    currentTextureIndex: 0,
    texturePaths: humidityTexturePaths
  };
}

/**
 * 添加湿度数据
 */
export async function addHumidity(MSIMEarth, EarthViewer) {
  try {
    const DC = new window.EarthPlugn.DCPrimitive({
      viewer: EarthViewer,
      earth: MSIMEarth
    });

    const humidityPrimitive = DC.createHumidityTextureAliasOD(humidityConfig);
    humidityInstance = { DC, primitive: humidityPrimitive, config: humidityConfig };
    window.humidityInstance = humidityInstance;

    // 设置相机位置
    const centerLon = (humidityConfig.xmin + humidityConfig.xmax) / 2;
    const centerLat = (humidityConfig.ymin + humidityConfig.ymax) / 2;
    const lonDiff = humidityConfig.xmax - humidityConfig.xmin;
    const latDiff = humidityConfig.ymax - humidityConfig.ymin;
    const maxDiff = Math.max(lonDiff, latDiff);
    const cameraHeight = maxDiff * 111000 * 3;

    EarthViewer.camera.setView({
      destination: MSIMEarth.Cartesian3.fromDegrees(centerLon, centerLat, cameraHeight),
    });

    // 创建图例
    createHumidityLegend();

    // 创建GUI
    //await createHumidityGui();

  } catch (error) {
    console.error('加载湿度数据失败:', error);
  }
}

/**
 * 创建湿度图例
 */
function createHumidityLegend() {
  const legend = createLegendElement('humidity-legend', '湿度区图例', {
    minWidth: '220px'
  });
  updateHumidityLegend();
  setTimeout(updateAllLegendPositions, 100);
}

/**
 * 更新湿度图例
 */
export function updateHumidityLegend() {
  const legend = document.getElementById('humidity-legend');
  if (!legend) return;

  const currentDataName = humidityTexturePaths[humidityConfig?.currentTextureIndex || 0]?.name || '';

  const legendHTML = `
    <div style="font-weight: bold; margin-bottom: 8px;">湿度区图例</div>
    <div style="margin-bottom: 4px;">湿度 (%)</div>
    <div style="
      height: 24px;
      background: linear-gradient(to right,
        rgba(0, 200, 100, 0) 0%,
        rgba(0, 200, 100, 0) 20%,
        rgba(0, 200, 100, 0.2) 36%,
        rgba(50, 220, 120, 0.4) 52%,
        rgba(100, 255, 150, 0.7) 68%,
        rgba(150, 255, 180, 0.85) 84%,
        rgba(200, 255, 200, 0.95) 100%
      );
      border-radius: 4px;
      margin-bottom: 4px;
      border: 1px solid rgba(255,255,255,0.3);
      position: relative;
      overflow: hidden;
    ">
      <div style="
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(to bottom,
          rgba(255,255,255,0.1) 0%,
          rgba(255,255,255,0) 50%
        );
      "></div>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 10px; opacity: 0.9;">
      <span>0</span>
      <span>50</span>
      <span>60</span>
      <span>70</span>
      <span>80</span>
      <span>90</span>
      <span>100</span>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 10px; opacity: 0.9; margin-top: 2px;">
      <span>透明</span>
      <span>0.2</span>
      <span>0.4</span>
      <span>0.7</span>
      <span>0.85</span>
      <span>0.95</span>
    </div>
    <div style="margin-top: 8px; font-size: 10px; opacity: 0.8; border-top: 1px solid rgba(100,150,255,0.3); padding-top: 8px;">
      ${currentDataName}
    </div>
  `;

  legend.innerHTML = legendHTML;
  setTimeout(updateAllLegendPositions, 50);
}

/**
 * 更新湿度uniform参数
 */
export function updateHumidity() {
  if (humidityInstance && humidityInstance.primitive && humidityInstance.primitive.appearance) {
    const uniforms = humidityInstance.primitive.appearance.uniforms;
    if (uniforms) {
      uniforms.gammaCorrection = humidityConfig.gamma;
      uniforms.alphaPower = humidityConfig.alphaPower;
      uniforms.minThreshold = humidityConfig.minThreshold;
      uniforms.maxThreshold = humidityConfig.maxThreshold;
      uniforms.opacityScale = humidityConfig.opacityScale;
      uniforms.clipXEnabled = humidityConfig.clipXEnabled;
      uniforms.clipXMin = humidityConfig.clipXMin;
      uniforms.clipXMax = humidityConfig.clipXMax;
      uniforms.clipYEnabled = humidityConfig.clipYEnabled;
      uniforms.clipYMin = humidityConfig.clipYMin;
      uniforms.clipYMax = humidityConfig.clipYMax;
      uniforms.clipZEnabled = humidityConfig.clipZEnabled;
      uniforms.clipZMin = humidityConfig.clipZMin;
      uniforms.clipZMax = humidityConfig.clipZMax;
      uniforms.colorFilterEnabled = humidityConfig.colorFilterEnabled;
      uniforms.colorTolerance = humidityConfig.colorTolerance;
    }
  }
}

/**
 * 创建湿度GUI控制面板
 */
async function createHumidityGui() {
  try {
    const dat = await import('dat.gui');
    const humidityGui = new dat.GUI({ name: '湿度参数配置' });

    humidityGui.domElement.style.position = 'absolute';
    humidityGui.domElement.style.width = '242px';
    humidityGui.domElement.style.left = '10px';
    humidityGui.domElement.style.top = '100px';
    humidityGui.domElement.style.right = 'auto';
    humidityGui.domElement.style.zIndex = '1';

    const humidityFolder = humidityGui.addFolder('湿度参数');
    humidityFolder.add(humidityConfig, 'steps', 50, 400).name('采样步数').onChange(updateHumidity);
    humidityFolder.add(humidityConfig, 'alphaCorrection', 0.01, 1).name('透明度校正').onChange(updateHumidity);
    humidityFolder.add(humidityConfig, 'gamma', 0.1, 2).name('Gamma校正').onChange(updateHumidity);
    humidityFolder.add(humidityConfig, 'alphaPower', 0.1, 5).name('Alpha幂次').onChange(updateHumidity);
    humidityFolder.add(humidityConfig, 'minThreshold', 0, 1).name('最小阈值').onChange(updateHumidity);
    humidityFolder.add(humidityConfig, 'maxThreshold', 0, 1).name('最大阈值').onChange(updateHumidity);
    humidityFolder.add(humidityConfig, 'opacityScale', 0.01, 5).name('不透明度').onChange(updateHumidity);
    humidityFolder.add(humidityConfig, 'dataCompression', 0.1, 1).name('数据压缩').onChange(updateHumidity);

    // 纹理切换
    const textureNames = humidityTexturePaths.map(t => t.name);
    const textureSelector = humidityFolder.add({ current: textureNames[0] }, 'current', textureNames).name('数据切换');
    textureSelector.onChange(async (selectedName) => {
      const selectedIndex = humidityTexturePaths.findIndex(t => t.name === selectedName);
      if (selectedIndex !== -1) {
        await switchHumidityTexture(selectedIndex);
      }
    });

    // 剖切工具
    const clipFolder = humidityGui.addFolder('剖切工具');
    const clipXFolder = clipFolder.addFolder('X轴剖切');
    clipXFolder.add(humidityConfig, 'clipXEnabled').name('启用').onChange(updateHumidity);
    clipXFolder.add(humidityConfig, 'clipXMin', 0.0, 1.0).name('最小位置').onChange(updateHumidity);
    clipXFolder.add(humidityConfig, 'clipXMax', 0.0, 1.0).name('最大位置').onChange(updateHumidity);

    const clipYFolder = clipFolder.addFolder('Y轴剖切');
    clipYFolder.add(humidityConfig, 'clipYEnabled').name('启用').onChange(updateHumidity);
    clipYFolder.add(humidityConfig, 'clipYMin', 0.0, 1.0).name('最小位置').onChange(updateHumidity);
    clipYFolder.add(humidityConfig, 'clipYMax', 0.0, 1.0).name('最大位置').onChange(updateHumidity);

    const clipZFolder = clipFolder.addFolder('Z轴剖切');
    clipZFolder.add(humidityConfig, 'clipZEnabled').name('启用').onChange(updateHumidity);
    clipZFolder.add(humidityConfig, 'clipZMin', 0.0, 1.0).name('最小位置').onChange(updateHumidity);
    clipZFolder.add(humidityConfig, 'clipZMax', 0.0, 1.0).name('最大位置').onChange(updateHumidity);

    // 颜色过滤
    const colorFilterFolder = humidityGui.addFolder('颜色过滤');
    colorFilterFolder.add(humidityConfig, 'colorFilterEnabled').name('启用颜色过滤').onChange(updateHumidity);
    colorFilterFolder.addColor(humidityConfig, 'targetColor').name('目标颜色').onChange(updateHumidity);
    colorFilterFolder.add(humidityConfig, 'colorTolerance', 0.0, 1.0).name('颜色容差').onChange(updateHumidity);

    // 时序播放
    humidityPlaybackConfig = {
      isPlaying: false,
      interval: 1.0,
      timer: null
    };
    window.humidityPlaybackConfig = humidityPlaybackConfig;

    const playbackFolder = humidityGui.addFolder('时序播放');
    playbackFolder.add(humidityPlaybackConfig, 'interval', 0.1, 5).name('切换间隔(秒)');

    const switchTextureFn = createTextureSwitcher(
      humidityInstance, 
      humidityTexturePaths, 
      'humidity', 
      updateHumidityLegend
    );

    const playbackController = createPlaybackController(
      humidityTexturePaths,
      switchTextureFn,
      textureSelector,
      humidityPlaybackConfig,
      'humidity'
    );

    const playbackButton = playbackFolder.add(playbackController.togglePlayback, 'toggle').name('▶ 播放');
    playbackController.setButton(playbackButton);

    humidityFolder.open();
    humidityGuiInstance = humidityGui;
    window.humidityGuiInstance = humidityGui;

    // 检查是否应该隐藏GUI
    if (window.configPanelVisible === false && humidityGui.domElement) {
      humidityGui.domElement.style.display = 'none';
    }
  } catch (error) {
    console.error('Failed to create humidity GUI:', error);
  }
}

/**
 * 切换湿度纹理
 */
async function switchHumidityTexture(index) {
  if (index >= 0 && index < humidityTexturePaths.length && humidityInstance && humidityInstance.primitive && humidityInstance.primitive.appearance) {
    const newPath = humidityTexturePaths[index].path;
    humidityConfig.texturePath = newPath;
    humidityConfig.currentTextureIndex = index;

    const MSIMEarth = window.MSIMEarth;
    const EarthViewer = window.EarthViewer;

    try {
      MSIMEarth.Resource.createIfNeeded(newPath)
        .fetchImage()
        .then((res) => {
          const cubeTex = new MSIMEarth.Texture({
            context: EarthViewer.scene.context,
            source: res,
          });
          cubeTex.type = "sampler2D";
          humidityInstance.primitive.appearance.uniforms.cubeTex = cubeTex;
          updateHumidityLegend();
        })
        .catch((error) => {
          console.error("加载湿度纹理失败:", error);
        });
    } catch (error) {
      console.error("加载湿度纹理失败:", error);
    }
  }
}

/**
 * 移除湿度数据
 */
export function removeHumidity(EarthViewer) {
  // 清理播放计时器
  if (humidityPlaybackConfig) {
    if (humidityPlaybackConfig.timer) {
      clearTimeout(humidityPlaybackConfig.timer);
      humidityPlaybackConfig.timer = null;
    }
    humidityPlaybackConfig.isPlaying = false;
  }

  // 移除图元
  if (humidityInstance && humidityInstance.primitive) {
    try {
      EarthViewer.scene.primitives.remove(humidityInstance.primitive);
    } catch (e) {
      console.warn('Error removing humidity primitive:', e);
    }
  }

  // 销毁GUI
  if (humidityGuiInstance) {
    try {
      humidityGuiInstance.destroy();
    } catch (e) {
      console.warn('Error destroying humidity GUI:', e);
    }
    window.humidityGuiInstance = null;
  }

  // 移除图例
  const humidityLegend = document.getElementById('humidity-legend');
  if (humidityLegend) {
    humidityLegend.remove();
  }

  // 清理窗口对象
  humidityInstance = null;
  humidityPlaybackConfig = null;
  window.humidityInstance = null;
  window.humidityPlaybackConfig = null;

  // 更新图例位置
  setTimeout(updateAllLegendPositions, 50);
}

export async function createHumidity(config) {
let DC = new window.EarthPlugn.DCPrimitive({
    viewer: window.EarthViewer,
    earth: window.MSIMEarth
  })

  humidityTexturePaths = [
    {
      name: config.name || 'humidityTestTexture',
      path: config.path || '/static/image/texture/WETpicture_GREEN_100m/RH_2024-02-05_0000_z_interp_crop_100m_lat_vertical_16x16_green.png'
    }
  ]

  humidityConfig = {
    xmin: config.xmin || 121.2,
    xmax: config.xmax || 121.4,
    ymin: config.ymin || 24.9,
    ymax: config.ymax || 25.1,
    zmin: config.zmin || 100.0,
    zmax: config.zmax || 15000.0,
    steps: config.steps || 320.0,
    alphaCorrection: config.alphaCorrection || 0.3,
    humidityLowColor: config.humidityLowColor || '#0000ff',
    humidityMidColor: config.humidityMidColor || '#00ffff',
    humidityHighColor: config.humidityHighColor || '#84ff84',
    gamma: config.gamma || 0.6,
    alphaPower: config.alphaPower || 3.0,
    minThreshold: config.minThreshold || 0.05,
    maxThreshold: config.maxThreshold || 1.0,
    opacityScale: config.opacityScale || 0.48,
    dataCompression: config.dataCompression || 0.5,
    texturePath: config.texturePath || humidityTexturePaths[0].path,
    currentTextureIndex: config.currentTextureIndex || 0,
    texturePaths: config.texturePaths || humidityTexturePaths,
    // 剖切参数
    clipXEnabled: config.clipXEnabled || false,
    clipXMin: config.clipXMin || 0.0,
    clipXMax: config.clipXMax || 1.0,
    clipYEnabled: config.clipYEnabled || false,
    clipYMin: config.clipYMin || 0.0,
    clipYMax: config.clipYMax || 1.0,
    clipZEnabled: config.clipZEnabled || false,
    clipZMin: config.clipZMin || 0.0,
    clipZMax: config.clipZMax || 1.0,
    // 颜色过滤参数
    colorFilterEnabled: config.colorFilterEnabled || false,
    targetColor: config.targetColor || '#ffffff',
    colorTolerance: config.colorTolerance || 0.3,
    id: config.id || 'humidity_Test'
  }

  const humidityPrimitive = DC.createHumidityTextureAliasOD(humidityConfig)
  humidityInstance = { DC, primitive: humidityPrimitive, config: humidityConfig };
  window.humidityInstance = humidityInstance;

  // 设置相机位置
  const centerLon = (humidityConfig.xmin + humidityConfig.xmax) / 2;
  const centerLat = (humidityConfig.ymin + humidityConfig.ymax) / 2;
  const lonDiff = humidityConfig.xmax - humidityConfig.xmin;
  const latDiff = humidityConfig.ymax - humidityConfig.ymin;
  const maxDiff = Math.max(lonDiff, latDiff);
  const cameraHeight = maxDiff * 111000 * 3;

  EarthViewer.camera.setView({
    destination: MSIMEarth.Cartesian3.fromDegrees(centerLon, centerLat, cameraHeight),
  });

  // 创建图例
  createHumidityLegend();

  // 创建GUI
  //await createHumidityGui();
}

export const getHumidityList = (hours) => {
  if(hours > 23){
    console.log(weatherDataConfig.humidity.texturePaths)
    return
  }
  let time = hours < 10 ? '0' + hours : hours
  let oldHours = hours
  if(oldHours == 0){
    oldHours = 24
  }
  let oldtime = oldHours - 1 < 10 ? '0' + (oldHours - 1) : oldHours - 1
  const params = {
    "request_type": "texture",
    "variable": "RH",
    "datetime": `2024-02-05 ${time}:00:00`
  }
  getTextureImage(params).then((res) => {
    if (res.status == "success") {
      let temp = {
        name: `humidity_${time}00`,
        time: `${oldtime}-${time}`,
        path: res.texture_data.image_url
      }
      weatherDataConfig.humidity.texturePaths[hours] = temp
    }
    getHumidityList(hours + 1)
  }).catch((err) => {
    console.error('获取湿度纹理图片失败', err)
  })
}
