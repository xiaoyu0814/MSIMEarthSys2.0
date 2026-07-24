// 颠簸数据处理模块
import { getTextureImage } from '@/service/weather'

import {
  updateAllLegendPositions,
  createLegendElement
} from './weatherUtils.js';

import {
  createTextureSwitcher,
  createPlaybackController
} from './voxelTextureRenderer.js';

let turbulenceConfig = null;
let turbulenceInstance = null;
let turbulenceGuiInstance = null;
let turbulencePlaybackConfig = null;
let turbulenceTexturePaths = [];

/**
 * 初始化颠簸配置
 */
export function initTurbulenceConfig(weatherConfig) {
  if (!weatherConfig?.turbulence) {
    console.warn('颠簸配置未找到');
    return;
  }

  const config = weatherConfig.turbulence;
  turbulenceTexturePaths = config.texturePaths || [];
  
  turbulenceConfig = {
    ...config.bounds,
    ...config.defaultConfig,
    texturePath: turbulenceTexturePaths[0]?.path,
    currentTextureIndex: 0,
    texturePaths: turbulenceTexturePaths
  };
}

/**
 * 添加颠簸数据
 */
export async function addTurbulence(MSIMEarth, EarthViewer) {
  try {
    const DC = new window.EarthPlugn.DCPrimitive({
      viewer: EarthViewer,
      earth: MSIMEarth
    });

    const turbulencePrimitive = DC.createTurbulenceTextureAliasOD(turbulenceConfig);
    turbulenceInstance = { DC, primitive: turbulencePrimitive, config: turbulenceConfig };
    window.turbulenceInstance = turbulenceInstance;

    // 设置相机位置
    const centerLon = (turbulenceConfig.xmin + turbulenceConfig.xmax) / 2;
    const centerLat = (turbulenceConfig.ymin + turbulenceConfig.ymax) / 2;
    const lonDiff = turbulenceConfig.xmax - turbulenceConfig.xmin;
    const latDiff = turbulenceConfig.ymax - turbulenceConfig.ymin;
    const maxDiff = Math.max(lonDiff, latDiff);
    const cameraHeight = maxDiff * 111000 * 3;

    EarthViewer.camera.setView({
      destination: MSIMEarth.Cartesian3.fromDegrees(centerLon, centerLat, cameraHeight),
    });

    // 创建图例
    createTurbulenceLegend();

    // 创建GUI
    await createTurbulenceGui();

  } catch (error) {
    console.error('加载颠簸数据失败:', error);
  }
}

/**
 * 创建颠簸图例
 */
function createTurbulenceLegend() {
  const legend = createLegendElement('turbulence-legend', '颠簸区图例', {
    borderColor: 'rgba(255, 200, 100, 0.3)'
  });
  updateTurbulenceLegend();
  setTimeout(updateAllLegendPositions, 100);
}

/**
 * 更新颠簸图例
 */
export function updateTurbulenceLegend() {
  const legend = document.getElementById('turbulence-legend');
  if (!legend) return;

  const currentDataName = turbulenceTexturePaths[turbulenceConfig?.currentTextureIndex || 0]?.name || '';

  const legendHTML = `
    <div style="font-weight: bold; margin-bottom: 8px;">颠簸区图例</div>
    <div style="margin-bottom: 4px;">颠簸强度</div>
    <div style="
      height: 24px;
      background: linear-gradient(to right,
        rgba(255, 255, 150, 0.4) 0%,
        rgba(255, 220, 100, 0.6) 33%,
        rgba(255, 180, 50, 0.85) 66%,
        rgba(255, 150, 0, 1) 100%
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
      <span>3</span>
      <span>6</span>
      <span>强</span>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 10px; opacity: 0.9; margin-top: 2px;">
      <span>无颠簸</span>
      <span>弱</span>
      <span>中</span>
      <span>强</span>
    </div>
    <div style="margin-top: 8px; font-size: 10px; opacity: 0.8; border-top: 1px solid rgba(255,200,100,0.3); padding-top: 8px;">
      ${currentDataName}
    </div>
  `;

  legend.innerHTML = legendHTML;
  setTimeout(updateAllLegendPositions, 50);
}

/**
 * 更新颠簸uniform参数
 */
export function updateTurbulence() {
  if (turbulenceInstance && turbulenceInstance.primitive && turbulenceInstance.primitive.appearance) {
    const uniforms = turbulenceInstance.primitive.appearance.uniforms;
    if (uniforms) {
      uniforms.gammaCorrection = turbulenceConfig.gamma;
      uniforms.alphaPower = turbulenceConfig.alphaPower;
      uniforms.minThreshold = turbulenceConfig.minThreshold;
      uniforms.maxThreshold = turbulenceConfig.maxThreshold;
      uniforms.opacityScale = turbulenceConfig.opacityScale;
      uniforms.clipXEnabled = turbulenceConfig.clipXEnabled;
      uniforms.clipXMin = turbulenceConfig.clipXMin;
      uniforms.clipXMax = turbulenceConfig.clipXMax;
      uniforms.clipYEnabled = turbulenceConfig.clipYEnabled;
      uniforms.clipYMin = turbulenceConfig.clipYMin;
      uniforms.clipYMax = turbulenceConfig.clipYMax;
      uniforms.clipZEnabled = turbulenceConfig.clipZEnabled;
      uniforms.clipZMin = turbulenceConfig.clipZMin;
      uniforms.clipZMax = turbulenceConfig.clipZMax;
      uniforms.colorFilterEnabled = turbulenceConfig.colorFilterEnabled;
      uniforms.colorTolerance = turbulenceConfig.colorTolerance;
    }
  }
}

/**
 * 创建颠簸GUI控制面板
 */
async function createTurbulenceGui() {
  try {
    const dat = await import('dat.gui');
    const turbulenceGui = new dat.GUI({ name: '颠簸参数配置' });

    turbulenceGui.domElement.style.position = 'absolute';
    turbulenceGui.domElement.style.width = '242px';
    // turbulenceGui.domElement.style.left = '10px';
    turbulenceGui.domElement.style.left = '500px';
    turbulenceGui.domElement.style.top = '100px';
    turbulenceGui.domElement.style.right = 'auto';
    turbulenceGui.domElement.style.zIndex = '1';

    const turbulenceFolder = turbulenceGui.addFolder('颠簸参数');
    turbulenceFolder.add(turbulenceConfig, 'steps', 50, 400).name('采样步数').onChange(updateTurbulence);
    turbulenceFolder.add(turbulenceConfig, 'alphaCorrection', 0.01, 1).name('透明度校正').onChange(updateTurbulence);
    turbulenceFolder.add(turbulenceConfig, 'gamma', 0.1, 2).name('Gamma校正').onChange(updateTurbulence);
    turbulenceFolder.add(turbulenceConfig, 'alphaPower', 0.1, 5).name('Alpha幂次').onChange(updateTurbulence);
    turbulenceFolder.add(turbulenceConfig, 'minThreshold', 0, 1).name('最小阈值').onChange(updateTurbulence);
    turbulenceFolder.add(turbulenceConfig, 'maxThreshold', 0, 1).name('最大阈值').onChange(updateTurbulence);
    turbulenceFolder.add(turbulenceConfig, 'opacityScale', 0.01, 5).name('不透明度').onChange(updateTurbulence);
    turbulenceFolder.add(turbulenceConfig, 'dataCompression', 0.1, 1).name('数据压缩').onChange(updateTurbulence);

    // 纹理切换
    const textureNames = turbulenceTexturePaths.map(t => t.name);
    const textureSelector = turbulenceFolder.add({ current: textureNames[0] }, 'current', textureNames).name('数据切换');
    textureSelector.onChange(async (selectedName) => {
      const selectedIndex = turbulenceTexturePaths.findIndex(t => t.name === selectedName);
      if (selectedIndex !== -1) {
        await switchTurbulenceTexture(selectedIndex);
      }
    });

    // 剖切工具
    const clipFolder = turbulenceGui.addFolder('剖切工具');
    const clipXFolder = clipFolder.addFolder('X轴剖切');
    clipXFolder.add(turbulenceConfig, 'clipXEnabled').name('启用').onChange(updateTurbulence);
    clipXFolder.add(turbulenceConfig, 'clipXMin', 0.0, 1.0).name('最小位置').onChange(updateTurbulence);
    clipXFolder.add(turbulenceConfig, 'clipXMax', 0.0, 1.0).name('最大位置').onChange(updateTurbulence);

    const clipYFolder = clipFolder.addFolder('Y轴剖切');
    clipYFolder.add(turbulenceConfig, 'clipYEnabled').name('启用').onChange(updateTurbulence);
    clipYFolder.add(turbulenceConfig, 'clipYMin', 0.0, 1.0).name('最小位置').onChange(updateTurbulence);
    clipYFolder.add(turbulenceConfig, 'clipYMax', 0.0, 1.0).name('最大位置').onChange(updateTurbulence);

    const clipZFolder = clipFolder.addFolder('Z轴剖切');
    clipZFolder.add(turbulenceConfig, 'clipZEnabled').name('启用').onChange(updateTurbulence);
    clipZFolder.add(turbulenceConfig, 'clipZMin', 0.0, 1.0).name('最小位置').onChange(updateTurbulence);
    clipZFolder.add(turbulenceConfig, 'clipZMax', 0.0, 1.0).name('最大位置').onChange(updateTurbulence);

    // 颜色过滤
    const colorFilterFolder = turbulenceGui.addFolder('颜色过滤');
    colorFilterFolder.add(turbulenceConfig, 'colorFilterEnabled').name('启用颜色过滤').onChange(updateTurbulence);
    colorFilterFolder.addColor(turbulenceConfig, 'targetColor').name('目标颜色').onChange(updateTurbulence);
    colorFilterFolder.add(turbulenceConfig, 'colorTolerance', 0.0, 1.0).name('颜色容差').onChange(updateTurbulence);

    // 时序播放
    turbulencePlaybackConfig = {
      isPlaying: false,
      interval: 1.0,
      timer: null
    };
    window.turbulencePlaybackConfig = turbulencePlaybackConfig;

    const playbackFolder = turbulenceGui.addFolder('时序播放');
    playbackFolder.add(turbulencePlaybackConfig, 'interval', 0.1, 5).name('切换间隔(秒)');

    const switchTextureFn = createTextureSwitcher(
      turbulenceInstance, 
      turbulenceTexturePaths, 
      'turbulence', 
      updateTurbulenceLegend
    );

    const playbackController = createPlaybackController(
      turbulenceTexturePaths,
      switchTextureFn,
      textureSelector,
      turbulencePlaybackConfig,
      'turbulence'
    );

    const playbackButton = playbackFolder.add(playbackController.togglePlayback, 'toggle').name('▶ 播放');
    playbackController.setButton(playbackButton);

    turbulenceFolder.open();
    turbulenceGuiInstance = turbulenceGui;
    window.turbulenceGuiInstance = turbulenceGui;

    // 检查是否应该隐藏GUI
    if (window.configPanelVisible === false && turbulenceGui.domElement) {
      turbulenceGui.domElement.style.display = 'none';
    }
  } catch (error) {
    console.error('Failed to create turbulence GUI:', error);
  }
}

/**
 * 切换颠簸纹理
 */
async function switchTurbulenceTexture(index) {
  if (index >= 0 && index < turbulenceTexturePaths.length && turbulenceInstance && turbulenceInstance.primitive && turbulenceInstance.primitive.appearance) {
    const newPath = turbulenceTexturePaths[index].path;
    turbulenceConfig.texturePath = newPath;
    turbulenceConfig.currentTextureIndex = index;

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
          turbulenceInstance.primitive.appearance.uniforms.cubeTex = cubeTex;
          updateTurbulenceLegend();
        })
        .catch((error) => {
          console.error("加载颠簸纹理失败:", error);
        });
    } catch (error) {
      console.error("加载颠簸纹理失败:", error);
    }
  }
}

/**
 * 移除颠簸数据
 */
export function removeTurbulence(EarthViewer) {
  // 清理播放计时器
  if (turbulencePlaybackConfig) {
    if (turbulencePlaybackConfig.timer) {
      clearTimeout(turbulencePlaybackConfig.timer);
      turbulencePlaybackConfig.timer = null;
    }
    turbulencePlaybackConfig.isPlaying = false;
  }

  // 移除图元
  if (turbulenceInstance && turbulenceInstance.primitive) {
    try {
      EarthViewer.scene.primitives.remove(turbulenceInstance.primitive);
    } catch (e) {
      console.warn('Error removing turbulence primitive:', e);
    }
  }

  // 销毁GUI
  if (turbulenceGuiInstance) {
    try {
      turbulenceGuiInstance.destroy();
    } catch (e) {
      console.warn('Error destroying turbulence GUI:', e);
    }
    window.turbulenceGuiInstance = null;
  }

  // 移除图例
  const turbulenceLegend = document.getElementById('turbulence-legend');
  if (turbulenceLegend) {
    turbulenceLegend.remove();
  }

  // 清理窗口对象
  turbulenceInstance = null;
  turbulencePlaybackConfig = null;
  window.turbulenceInstance = null;
  window.turbulencePlaybackConfig = null;

  // 更新图例位置
  setTimeout(updateAllLegendPositions, 50);
}

export async function createTurbulence(config) {
  let DC = new window.EarthPlugn.DCPrimitive({
    viewer: window.EarthViewer,
    earth: window.MSIMEarth
  })

  turbulenceTexturePaths = [
    { 
      name: config.name || 'turbulenceTestTexture',
      path: config.path || '/static/image/texture/TURBpicture_YELLOW_100m_2026-05-16_214755/TI1_result_0000_lat_vertical_16x16_yellow.png' }
  ]

  turbulenceConfig = {
    xmin: config.xmin || 120.18,
    xmax: config.xmax || 120.33,
    ymin: config.ymin || 24.05,
    ymax: config.ymax || 24.2,
    zmin: config.zmin || 2000.0,
    zmax: config.zmax || 4000.0,
    steps: config.steps || 320.0,
    alphaCorrection: config.alphaCorrection || 0.3,
    humidityLowColor: config.humidityLowColor || '#ffcc00',
    humidityMidColor: config.humidityMidColor || '#ff9900',
    humidityHighColor: config.humidityHighColor || '#ff6600',
    gamma: config.gamma || 0.6,
    alphaPower: config.alphaPower || 0.8,
    minThreshold: config.minThreshold || 0.05,
    maxThreshold: config.maxThreshold || 1.0,
    opacityScale: config.opacityScale || 3.0,
    dataCompression: config.dataCompression || 0.5,
    texturePath: config.texturePath || turbulenceTexturePaths[0].path,
    currentTextureIndex: config.currentTextureIndex || 0,
    texturePaths: config.texturePaths || turbulenceTexturePaths,
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
    id: config.id || 'turbulence_Test'
  }

  const turbulencePrimitive = DC.createTurbulenceTextureAliasOD(turbulenceConfig)
  turbulenceInstance = { DC, primitive: turbulencePrimitive, config: turbulenceConfig };
  window.turbulenceInstance = turbulenceInstance;

  // 设置相机位置
  const centerLon = (turbulenceConfig.xmin + turbulenceConfig.xmax) / 2;
  const centerLat = (turbulenceConfig.ymin + turbulenceConfig.ymax) / 2;
  const lonDiff = turbulenceConfig.xmax - turbulenceConfig.xmin;
  const latDiff = turbulenceConfig.ymax - turbulenceConfig.ymin;
  const maxDiff = Math.max(lonDiff, latDiff);
  const cameraHeight = maxDiff * 111000 * 3;

  EarthViewer.camera.setView({
    destination: MSIMEarth.Cartesian3.fromDegrees(centerLon, centerLat, cameraHeight),
  });

  // 创建图例
  createTurbulenceLegend();

  // 创建GUI
  await createTurbulenceGui();
}

export const getTurbulenceList = (hours) => {
  if(hours > 23){
    console.log(weatherDataConfig.turbulence.texturePaths)
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
    "variable": "TI1",
    "datetime": `2024-02-05 ${time}:00:00`
  }
  getTextureImage(params).then((res) => {
    if (res.status == "success") {
      let temp = {
        name: `turbulence_${time}00`,
        time: `${oldtime}-${time}`,
        path: res.texture_data.image_url
      }
      weatherDataConfig.turbulence.texturePaths[hours] = temp
    }
    getTurbulenceList(hours + 1)
  }).catch((err) => {
    console.error('获取颠簸纹理图片失败', err)
  })
}
