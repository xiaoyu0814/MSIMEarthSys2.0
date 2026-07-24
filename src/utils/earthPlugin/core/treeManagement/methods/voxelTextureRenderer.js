// 通用的纹理体素渲染模块

/**
 * 通用的体素纹理渲染类
 */
export class VoxelTextureRenderer {
  constructor(options) {
    this.config = options.config;
    this.texturePaths = options.texturePaths || [];
    this.bounds = options.bounds;
    this.legendId = options.legendId;
    this.windowPrefix = options.windowPrefix;
    this.createPrimitiveFn = options.createPrimitiveFn;
    this.updateLegendFn = options.updateLegendFn;
    this.createGuiFn = options.createGuiFn;
    this.updateUniformFn = options.updateUniformFn;
    
    this.instance = null;
    this.guiInstance = null;
    this.playbackConfig = null;
  }

  /**
   * 初始化渲染器
   */
  async init(MSIMEarth, EarthViewer) {
    const DC = new window.EarthPlugn.DCPrimitive({
      viewer: EarthViewer,
      earth: MSIMEarth
    });

    const primitive = this.createPrimitiveFn(DC, this.config);
    this.instance = { DC, primitive, config: this.config };
    window[`${this.windowPrefix}Instance`] = this.instance;

    // 设置相机位置
    const centerLon = (this.bounds.xmin + this.bounds.xmax) / 2;
    const centerLat = (this.bounds.ymin + this.bounds.ymax) / 2;
    const lonDiff = this.bounds.xmax - this.bounds.xmin;
    const latDiff = this.bounds.ymax - this.bounds.ymin;
    const maxDiff = Math.max(lonDiff, latDiff);
    const cameraHeight = maxDiff * 111000 * 3;

    EarthViewer.camera.setView({
      destination: MSIMEarth.Cartesian3.fromDegrees(centerLon, centerLat, cameraHeight),
    });

    // 创建GUI
    if (this.createGuiFn) {
      await this.createGuiFn(this.config, this.texturePaths, this.instance, this.windowPrefix, this.updateUniformFn);
    }

    // 创建图例
    this.createLegend();
  }

  /**
   * 创建图例
   */
  createLegend() {
    if (this.updateLegendFn) {
      this.updateLegendFn();
    }
  }

  /**
   * 清理资源
   */
  destroy(EarthViewer) {
    const instance = window[`${this.windowPrefix}Instance`];
    const guiInstance = window[`${this.windowPrefix}GuiInstance`];
    const playbackConfig = window[`${this.windowPrefix}PlaybackConfig`];

    // 清理播放计时器
    if (playbackConfig) {
      if (playbackConfig.timer) {
        clearTimeout(playbackConfig.timer);
        playbackConfig.timer = null;
      }
      playbackConfig.isPlaying = false;
    }

    // 移除图元
    if (instance && instance.primitive) {
      try {
        EarthViewer.scene.primitives.remove(instance.primitive);
      } catch (e) {
        console.warn(`Error removing ${this.windowPrefix} primitive:`, e);
      }
    }

    // 销毁GUI
    if (guiInstance) {
      try {
        guiInstance.destroy();
      } catch (e) {
        console.warn(`Error destroying ${this.windowPrefix} GUI:`, e);
      }
      window[`${this.windowPrefix}GuiInstance`] = null;
    }

    // 移除图例
    const legend = document.getElementById(this.legendId);
    if (legend) {
      legend.remove();
    }

    // 清理窗口对象
    window[`${this.windowPrefix}Instance`] = null;
    window[`${this.windowPrefix}PlaybackConfig`] = null;
  }
}

/**
 * 创建通用的纹理切换函数
 */
export function createTextureSwitcher(instance, texturePaths, windowPrefix, updateLegendFn) {
  return async function switchTexture(index) {
    if (index >= 0 && index < texturePaths.length && instance && instance.primitive && instance.primitive.appearance) {
      const newPath = texturePaths[index].path;
      instance.config.texturePath = newPath;
      instance.config.currentTextureIndex = index;

      const MSIMEarth = window.MSIMEarth;
      const EarthViewer = window.EarthViewer;
      
      try {
        const resource = MSIMEarth.Resource.createIfNeeded(newPath);
        const image = await resource.fetchImage();
        
        const cubeTex = new MSIMEarth.Texture({
          context: EarthViewer.scene.context,
          source: image,
        });
        cubeTex.type = "sampler2D";
        instance.primitive.appearance.uniforms.cubeTex = cubeTex;
        
        if (updateLegendFn) {
          updateLegendFn();
        }
      } catch (error) {
        console.error(`加载${windowPrefix}纹理失败:`, error);
      }
    }
  };
}

/**
 * 创建通用的时序播放控制器
 */
export function createPlaybackController(texturePaths, switchTextureFn, textureSelector, playbackConfig, windowPrefix) {
  let playbackButton = null;

  const togglePlayback = {
    toggle: () => {
      if (playbackConfig.isPlaying) {
        // 暂停
        playbackConfig.isPlaying = false;
        if (playbackButton) {
          playbackButton.name('▶ 播放');
        }
        if (playbackConfig.timer) {
          clearTimeout(playbackConfig.timer);
          playbackConfig.timer = null;
        }
      } else {
        // 播放
        playbackConfig.isPlaying = true;
        if (playbackButton) {
          playbackButton.name('⏸ 暂停');
        }

        const tick = () => {
          let nextIndex = (window[`${windowPrefix}Config`]?.currentTextureIndex || 0) + 1;
          if (nextIndex >= texturePaths.length) {
            nextIndex = 0;
          }
          
          switchTextureFn(nextIndex);
          
          if (textureSelector) {
            textureSelector.setValue(texturePaths[nextIndex].name);
            textureSelector.updateDisplay();
          }

          if (playbackConfig.isPlaying) {
            playbackConfig.timer = setTimeout(tick, playbackConfig.interval * 1000);
          }
        };

        tick();
      }
    }
  };

  return { togglePlayback, setButton: (btn) => { playbackButton = btn; } };
}
