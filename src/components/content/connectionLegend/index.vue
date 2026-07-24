<template>
  <div class="terrainBand-legend lianlu-legend">
    <el-tooltip
      class="box-item"
      effect="dark"
      content="关闭面板"
      placement="top"
    >
      <img
        src="@/assets/image/panelIcons/关闭icon.png"
        alt="关闭"
        class="close_sty"
        @click="handleClose"
      />
    </el-tooltip>
    <div class="title-div">图例</div>

    <!-- 装备类别图例 -->
    <div class="legend-section">
      <div class="section-title">装备类别</div>
      <div class="equipment-item">
        <div class="equipment-color" style="background-color: white"></div>
        <div class="equipment-name">有人装备</div>
      </div>
      <div class="equipment-item">
        <div class="equipment-color" style="background-color: yellow"></div>
        <div class="equipment-name">无人装备</div>
      </div>
    </div>

    <!-- 链路类型图例 -->
    <div class="legend-section">
      <div class="section-title">链路类型</div>
      <div v-for="item in state.colors" class="link-item" :key="item.name">
        <div class="link-image">
          <img
            :src="getImageUrl(item.image)"
            :width="item.width"
            :height="item.height"
            :class="`link-image-${item.image}`"
          />
        </div>
        <div class="link-name">{{ item.name }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, computed } from 'vue'
import store from '@/store/index'
import emitter from '@/utils/eventbus'
import { moveBtnPanel } from '@/utils/mapTools'

// 动态加载图片的方法
const getImageUrl = (imageName) => {
  try {
    return require(`@/assets/image/texture/${imageName}.png`)
  } catch (error) {
    console.error(`Failed to load image: ${imageName}.png`, error)
    return ''
  }
}

const state = reactive({
  colors: [
    // {
    //   color: 'rgba(230, 127, 121, 1)',
    //   height: '雷达探测'
    // },
    // {
    //   color: 'rgba(250, 252, 178, 1)',
    //   height: '雷达追踪'
    // },
    {
      color: 'rgba(21, 113, 233, 1)',
      image: 'RE_STrackInit',
      width: 100,
      height: 6,
      name: ' 感知'
    },
    {
      color: 'rgba(177, 195, 24, 1)',
      image: 'RE_MR',
      width: 100,
      height: 6,
      name: '通信'
    },
    {
      color: 'rgba(0, 255, 0, 1)',
      image: 'RE_JamA',
      width: 100,
      height: 10,
      name: '干扰'
    },
    {
      color: 'rgba(255, 0, 1, 1)',
      image: 'RE_WeaponF',
      width: 100,
      height: 5,
      name: '火力'
    }
    // {
    //   color: 'rgba(255, 0, 1, 1)',
    //   image: '有人',
    //   width: 100,
    //   height: 60,
    //   name: '无人'
    // },
    // {
    //   color: 'rgba(255, 0, 1, 1)',
    //   image: '无人',
    //   width: 100,
    //   height: 60,
    //   name: '有人'
    // }
    // {
    //   color: 'rgba(239, 139,190, 1)',
    //   height: '任务关联'
    // }
    // {
    //   color: 'rgba(145, 54, 145, 1)',
    //   height: '路径'
    // }
  ]
})

const handleClose = () => {
  emitter.emit('changeConnectionLegend', false) // 关闭链路框
  let configLen = store.state.sceneModule.earthObjectConfig.indexOf('链路图例')
  if (configLen > -1) {
    //移除战场信息展示下的图例选中状态
    store.state.sceneModule.earthObjectConfig.splice(configLen, 1)
  }
  emitter.emit(
    'changeEarthObjectConfig',
    store.state.sceneModule.earthObjectConfig
  )
}

onMounted(() => {
  moveBtnPanel('lianlu-legend')
})
</script>

<style lang="less" scoped>
.terrainBand-legend {
  position: absolute;
  top: 12%;
  right: 140px;
  width: 240px;
  min-height: 300px;
  // border: 1px solid rgba(2, 26, 70, 0.88);
  border-radius: 4px;
  backdrop-filter: blur(1px);
  animation: zoomIn 0.4s;
  background: rgba(2, 26, 70, 0.1);
  box-shadow: 0 0 25px #1092d5;
  overflow: hidden;

  .title-div {
    // background: url('@/assets/image/panelIcons/title-bg3.png') no-repeat;
    background-size: 100.1% 48px;
    height: 40px;
    line-height: 48px;
    font-size: 18px;
    color: #ffffff;
    letter-spacing: 1.5px;
    font-weight: 500;
    text-align: center;
    margin-bottom: 15px;
  }

  .legend-section {
    margin: 0 15px 20px;
    padding: 10px;
    background: rgba(0, 40, 80, 0.2);
    border-radius: 4px;

    .section-title {
      color: #06d6f9;
      font-size: 14px;
      font-weight: 500;
      margin-bottom: 12px;
      text-align: left;
      padding-left: 5px;
      border-bottom: 1px solid rgba(6, 214, 249, 0.3);
      padding-bottom: 5px;
    }
  }

  .equipment-item {
    display: flex;
    align-items: center;
    margin-bottom: 10px;

    .equipment-color {
      width: 100px;
      height: 6px;
      margin-right: 15px;
      border-radius: 3px;
    }

    .equipment-name {
      color: white;
      font-size: 14px;
      flex: 1;
    }
  }

  .link-item {
    display: flex;
    align-items: center;
    margin-bottom: 12px;

    .link-image {
      width: 100px;
      display: flex;
      align-items: center;
      margin-right: 15px;

      img {
        // 基础滤镜效果
        filter: brightness(0.95) contrast(1.1);
      }

      // 为每个图片添加特定的滤镜调整，确保色调一致
      .link-image-RE_STrackInit {
        filter: hue-rotate(0deg) saturate(1.1) brightness(0.95) contrast(1.1);
      }

      .link-image-RE_WeaponF {
        filter: hue-rotate(-5deg) saturate(1.2) brightness(0.95) contrast(1.1);
      }

      .link-image-RE_JamA {
        filter: hue-rotate(5deg) saturate(1.15) brightness(0.95) contrast(1.1);
      }

      .link-image-RE_MR {
        filter: hue-rotate(0deg) saturate(1.05) brightness(0.95) contrast(1.1);
      }
    }

    .link-name {
      color: white;
      font-size: 14px;
      flex: 1;
    }
  }

  .close_sty {
    cursor: pointer;
    position: absolute;
    top: 14px;
    right: 12px;
    width: 16px;
    height: 16px;
  }
}
</style>
