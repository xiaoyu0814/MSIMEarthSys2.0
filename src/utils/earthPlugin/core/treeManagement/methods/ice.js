// 积冰数据处理模块

import {
  updateAllLegendPositions,
  createLegendElement
} from './weatherUtils.js';

import {
  createTextureSwitcher,
  createPlaybackController
} from './voxelTextureRenderer.js';

let iceConfig = null;
let iceInstance = null;
let iceGuiInstance = null;
let icePlaybackConfig = null;
let iceTexturePaths = [];

/**
 * 初始化积冰配置
 */
export function initIceConfig(weatherConfig) {
  if (!weatherConfig?.ice) {
    console.warn('积冰配置未找到');
    return;
  }

  const config = weatherConfig.ice;
  iceTexturePaths = config.texturePaths || [];
  
  iceConfig = {
    ...config.bounds,
    ...config.defaultConfig,
    texturePath: iceTexturePaths[0]?.path,
    currentTextureIndex: 0,
    texturePaths: iceTexturePaths
  };
}

/**
 * 添加积冰数据
 */
export async function addIce(MSIMEarth, EarthViewer) {
  try {
    const DC = new window.EarthPlugn.DCPrimitive({
      viewer: EarthViewer,
      earth: MSIMEarth
    });

    const icePrimitive = DC.createIceTextureAliasOD(iceConfig);
    iceInstance = { DC, primitive: icePrimitive, config: iceConfig };
    window.iceInstance = iceInstance;

    // 设置相机位置
    const centerLon = (iceConfig.xmin + iceConfig.xmax) / 2;
    const centerLat = (iceConfig.ymin + iceConfig.ymax) / 2;
    const lonDiff = iceConfig.xmax - iceConfig.xmin;
    const latDiff = iceConfig.ymax - iceConfig.ymin;
    const maxDiff = Math.max(lonDiff, latDiff);
    const cameraHeight = maxDiff * 111000 * 3;

    EarthViewer.camera.setView({
      destination: MSIMEarth.Cartesian3.fromDegrees(centerLon, centerLat, cameraHeight),
    });

    // 创建图例
    createIceLegend();

    // 创建GUI
    await createIceGui();

  } catch (error) {
    console.error('加载积冰数据失败:', error);
  }
}

/**
 * 创建积冰图例
 */
function createIceLegend() {
  const legend = createLegendElement('ice-legend', '积冰区图例');
  updateIceLegend();
  setTimeout(updateAllLegendPositions, 100);
}

/**
 * 更新积冰图例
 */
export function updateIceLegend() {
  const legend = document.getElementById('ice-legend');
  if (!legend) return;

  const currentDataName = iceTexturePaths[iceConfig?.currentTextureIndex || 0]?.name || '';

  const legendHTML = `
    <div style="font-weight: bold; margin-bottom: 8px;">积冰区图例</div>
    <div style="margin-bottom: 4px;">积冰强度</div>
    <div style="
      height: 24px;
      background: linear-gradient(to right,
        rgba(25, 77, 204, 0.4) 0%,
        rgba(0, 100, 220, 0.6) 33%,
        rgba(0, 75, 255, 0.85) 66%,
        rgba(0, 50, 255, 1) 100%
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
      <span>5</span>
      <span>8</span>
      <span>强</span>
    </div>
    <div style="display: flex; justify-content: space-between; font-size: 10px; opacity: 0.9; margin-top: 2px;">
      <span>无积冰</span>
      <span>弱</span>
      <span>中</span>
      <span>强</span>
    </div>
    <div style="margin-top: 8px; font-size: 10px; opacity: 0.8; border-top: 1px solid rgba(100,150,255,0.3); padding-top: 8px;">
      ${currentDataName}
    </div>
  `;

  legend.innerHTML = legendHTML;
  setTimeout(updateAllLegendPositions, 50);
}

/**
 * 更新积冰uniform参数
 */
export function updateIce() {
  if (iceInstance && iceInstance.primitive && iceInstance.primitive.appearance) {
    const uniforms = iceInstance.primitive.appearance.uniforms;
    if (uniforms) {
      uniforms.gammaCorrection = iceConfig.gamma;
      uniforms.alphaPower = iceConfig.alphaPower;
      uniforms.minThreshold = iceConfig.minThreshold;
      uniforms.maxThreshold = iceConfig.maxThreshold;
      uniforms.opacityScale = iceConfig.opacityScale;
      uniforms.clipXEnabled = iceConfig.clipXEnabled;
      uniforms.clipXMin = iceConfig.clipXMin;
      uniforms.clipXMax = iceConfig.clipXMax;
      uniforms.clipYEnabled = iceConfig.clipYEnabled;
      uniforms.clipYMin = iceConfig.clipYMin;
      uniforms.clipYMax = iceConfig.clipYMax;
      uniforms.clipZEnabled = iceConfig.clipZEnabled;
      uniforms.clipZMin = iceConfig.clipZMin;
      uniforms.clipZMax = iceConfig.clipZMax;
      uniforms.colorFilterEnabled = iceConfig.colorFilterEnabled;
      uniforms.colorTolerance = iceConfig.colorTolerance;
    }
  }
}

/**
 * 创建积冰GUI控制面板
 */
async function createIceGui() {
  try {
    const dat = await import('dat.gui');
    const iceGui = new dat.GUI({ name: '积冰参数配置' });

    iceGui.domElement.style.position = 'absolute';
    iceGui.domElement.style.width = '242px';
    iceGui.domElement.style.left = '10px';
    iceGui.domElement.style.top = '100px';
    iceGui.domElement.style.right = 'auto';
    iceGui.domElement.style.zIndex = '1';

    const iceFolder = iceGui.addFolder('积冰参数');
    iceFolder.add(iceConfig, 'steps', 50, 400).name('采样步数').onChange(updateIce);
    iceFolder.add(iceConfig, 'alphaCorrection', 0.01, 1).name('透明度校正').onChange(updateIce);
    iceFolder.add(iceConfig, 'gamma', 0.1, 2).name('Gamma校正').onChange(updateIce);
    iceFolder.add(iceConfig, 'alphaPower', 0.1, 5).name('Alpha幂次').onChange(updateIce);
    iceFolder.add(iceConfig, 'minThreshold', 0, 1).name('最小阈值').onChange(updateIce);
    iceFolder.add(iceConfig, 'maxThreshold', 0, 1).name('最大阈值').onChange(updateIce);
    iceFolder.add(iceConfig, 'opacityScale', 0.01, 5).name('不透明度').onChange(updateIce);
    iceFolder.add(iceConfig, 'dataCompression', 0.1, 1).name('数据压缩').onChange(updateIce);

    // 纹理切换
    const textureNames = iceTexturePaths.map(t => t.name);
    const textureSelector = iceFolder.add({ current: textureNames[0] }, 'current', textureNames).name('数据切换');
    textureSelector.onChange(async (selectedName) => {
      const selectedIndex = iceTexturePaths.findIndex(t => t.name === selectedName);
      if (selectedIndex !== -1) {
        await switchIceTexture(selectedIndex);
      }
    });

    // 剖切工具
    const clipFolder = iceGui.addFolder('剖切工具');
    const clipXFolder = clipFolder.addFolder('X轴剖切');
    clipXFolder.add(iceConfig, 'clipXEnabled').name('启用').onChange(updateIce);
    clipXFolder.add(iceConfig, 'clipXMin', 0.0, 1.0).name('最小位置').onChange(updateIce);
    clipXFolder.add(iceConfig, 'clipXMax', 0.0, 1.0).name('最大位置').onChange(updateIce);

    const clipYFolder = clipFolder.addFolder('Y轴剖切');
    clipYFolder.add(iceConfig, 'clipYEnabled').name('启用').onChange(updateIce);
    clipYFolder.add(iceConfig, 'clipYMin', 0.0, 1.0).name('最小位置').onChange(updateIce);
    clipYFolder.add(iceConfig, 'clipYMax', 0.0, 1.0).name('最大位置').onChange(updateIce);

    const clipZFolder = clipFolder.addFolder('Z轴剖切');
    clipZFolder.add(iceConfig, 'clipZEnabled').name('启用').onChange(updateIce);
    clipZFolder.add(iceConfig, 'clipZMin', 0.0, 1.0).name('最小位置').onChange(updateIce);
    clipZFolder.add(iceConfig, 'clipZMax', 0.0, 1.0).name('最大位置').onChange(updateIce);

    // 颜色过滤
    const colorFilterFolder = iceGui.addFolder('颜色过滤');
    colorFilterFolder.add(iceConfig, 'colorFilterEnabled').name('启用颜色过滤').onChange(updateIce);
    colorFilterFolder.addColor(iceConfig, 'targetColor').name('目标颜色').onChange(updateIce);
    colorFilterFolder.add(iceConfig, 'colorTolerance', 0.0, 1.0).name('颜色容差').onChange(updateIce);

    // 时序播放
    icePlaybackConfig = {
      isPlaying: false,
      interval: 1.0,
      timer: null
    };
    window.icePlaybackConfig = icePlaybackConfig;

    const playbackFolder = iceGui.addFolder('时序播放');
    playbackFolder.add(icePlaybackConfig, 'interval', 0.1, 5).name('切换间隔(秒)');

    const switchTextureFn = createTextureSwitcher(
      iceInstance, 
      iceTexturePaths, 
      'ice', 
      updateIceLegend
    );

    const playbackController = createPlaybackController(
      iceTexturePaths,
      switchTextureFn,
      textureSelector,
      icePlaybackConfig,
      'ice'
    );

    const playbackButton = playbackFolder.add(playbackController.togglePlayback, 'toggle').name('▶ 播放');
    playbackController.setButton(playbackButton);

    iceFolder.open();
    iceGuiInstance = iceGui;
    window.iceGuiInstance = iceGui;

    // 检查是否应该隐藏GUI
    if (window.configPanelVisible === false && iceGui.domElement) {
      iceGui.domElement.style.display = 'none';
    }
  } catch (error) {
    console.error('Failed to create ice GUI:', error);
  }
}

/**
 * 切换积冰纹理
 */
async function switchIceTexture(index) {
  if (index >= 0 && index < iceTexturePaths.length && iceInstance && iceInstance.primitive && iceInstance.primitive.appearance) {
    const newPath = iceTexturePaths[index].path;
    iceConfig.texturePath = newPath;
    iceConfig.currentTextureIndex = index;

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
          iceInstance.primitive.appearance.uniforms.cubeTex = cubeTex;
          updateIceLegend();
        })
        .catch((error) => {
          console.error("加载积冰纹理失败:", error);
        });
    } catch (error) {
      console.error("加载积冰纹理失败:", error);
    }
  }
}

/**
 * 移除积冰数据
 */
export function removeIce(EarthViewer) {
  // 清理播放计时器
  if (icePlaybackConfig) {
    if (icePlaybackConfig.timer) {
      clearTimeout(icePlaybackConfig.timer);
      icePlaybackConfig.timer = null;
    }
    icePlaybackConfig.isPlaying = false;
  }

  // 移除图元
  if (iceInstance && iceInstance.primitive) {
    try {
      EarthViewer.scene.primitives.remove(iceInstance.primitive);
    } catch (e) {
      console.warn('Error removing ice primitive:', e);
    }
  }

  // 销毁GUI
  if (iceGuiInstance) {
    try {
      iceGuiInstance.destroy();
    } catch (e) {
      console.warn('Error destroying ice GUI:', e);
    }
    window.iceGuiInstance = null;
  }

  // 移除图例
  const iceLegend = document.getElementById('ice-legend');
  if (iceLegend) {
    iceLegend.remove();
  }

  // 清理窗口对象
  iceInstance = null;
  icePlaybackConfig = null;
  window.iceInstance = null;
  window.icePlaybackConfig = null;

  // 更新图例位置
  setTimeout(updateAllLegendPositions, 50);
}
