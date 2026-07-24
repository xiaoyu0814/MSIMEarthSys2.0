// 气象数据通用工具类

/**
 * 更新所有图例位置
 */
export function updateAllLegendPositions() {
  const legendConfig = window.weatherDataConfig?.LEGEND_CONFIG || {
    baseTop: 80,
    baseRight: 120,
    gap: 15,
    legendIds: ['wind-legend', 'humidity-legend', 'ice-legend', 'turbulence-legend']
  };
  
  let currentTop = legendConfig.baseTop;
  const gap = legendConfig.gap;

  for (const id of legendConfig.legendIds) {
    const legend = document.getElementById(id);
    if (legend && legend.offsetHeight > 0) {
      legend.style.top = `${currentTop}px`;
      legend.style.right = `${legendConfig.baseRight}px`;
      currentTop += legend.offsetHeight + gap;
    }
  }
}

/**
 * 切换GUI面板显示状态
 * @param {boolean} visible 是否显示
 */
export function toggleAllGuiPanels(visible) {
  const guiInstances = [
    { id: 'windGuiInstance', name: 'wind' },
    { id: 'humidityGuiInstance', name: 'humidity' },
    { id: 'iceGuiInstance', name: 'ice' },
    { id: 'turbulenceGuiInstance', name: 'turbulence' }
  ];

  for (const guiInfo of guiInstances) {
    const guiInstance = window[guiInfo.id];
    if (guiInstance && guiInstance.domElement) {
      guiInstance.domElement.style.display = visible ? 'block' : 'none';
    }
  }
}

/**
 * 设置相机视角到指定区域
 * @param {Object} bounds 区域边界 {xmin, xmax, ymin, ymax}
 * @param {Object} EarthViewer Cesium viewer对象
 * @param {Object} MSIMEarth Cesium Earth对象
 */
export function setCameraToBounds(bounds, EarthViewer, MSIMEarth) {
  const centerLon = (bounds.xmin + bounds.xmax) / 2;
  const centerLat = (bounds.ymin + bounds.ymax) / 2;
  const lonDiff = bounds.xmax - bounds.xmin;
  const latDiff = bounds.ymax - bounds.ymin;
  const maxDiff = Math.max(lonDiff, latDiff);
  const cameraHeight = maxDiff * 111000 * 3;

  EarthViewer.camera.setView({
    destination: MSIMEarth.Cartesian3.fromDegrees(centerLon, centerLat, cameraHeight),
  });
}

/**
 * 清理播放计时器
 * @param {Object} playbackConfig 播放配置对象
 */
export function cleanupPlaybackTimer(playbackConfig) {
  if (playbackConfig) {
    if (playbackConfig.timer) {
      clearTimeout(playbackConfig.timer);
      playbackConfig.timer = null;
    }
    playbackConfig.isPlaying = false;
  }
}

/**
 * 移除图元和GUI
 * @param {Object} instance 对象实例
 * @param {Object} guiInstance GUI实例
 * @param {Object} playbackConfig 播放配置
 * @param {string} legendId 图例元素ID
 * @param {string} windowPrefix 窗口对象前缀
 * @param {Object} EarthViewer Cesium viewer对象
 */
export function removePrimitiveAndGui(
  instance,
  guiInstance,
  playbackConfig,
  legendId,
  windowPrefix,
  EarthViewer
) {
  // 清理播放计时器
  cleanupPlaybackTimer(playbackConfig);

  // 移除图元
  if (instance && instance.primitive) {
    try {
      EarthViewer.scene.primitives.remove(instance.primitive);
    } catch (e) {
      console.warn(`Error removing ${windowPrefix} primitive:`, e);
    }
  }

  // 销毁GUI
  if (guiInstance) {
    try {
      guiInstance.destroy();
    } catch (e) {
      console.warn(`Error destroying ${windowPrefix} GUI:`, e);
    }
    window[`${windowPrefix}GuiInstance`] = null;
  }

  // 移除图例
  const legend = document.getElementById(legendId);
  if (legend) {
    legend.remove();
  }

  // 清理窗口对象
  window[`${windowPrefix}Instance`] = null;
  window[`${windowPrefix}PlaybackConfig`] = null;

  // 更新图例位置
  setTimeout(updateAllLegendPositions, 50);
}

/**
 * 创建通用图例样式
 * @param {string} legendId 图例ID
 * @param {string} title 图例标题
 * @param {Object} options 样式选项
 */
export function createLegendElement(legendId, title, options = {}) {
  let legend = document.getElementById(legendId);
  if (!legend) {
    legend = document.createElement('div');
    legend.id = legendId;
    
    const {
      minWidth = '180px',
      borderColor = 'rgba(100, 150, 255, 0.3)'
    } = options;
    
    legend.style.cssText = `
      position: absolute;
      top: 80px;
      right: 120px;
      background: rgba(20, 30, 50, 0.95);
      padding: 12px 15px;
      border-radius: 8px;
      color: white;
      font-size: 12px;
      z-index: 1;
      min-width: ${minWidth};
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.5);
      border: 1px solid ${borderColor};
    `;
    document.body.appendChild(legend);
  }
  return legend;
}
