<template>
  <div class="modelSizeSettingDiv">
    <div class="title">模型尺寸</div>
    <!-- <div class="close-btn" @click="hidePanel">
      <el-icon :size="20" color="#fff">
        <Close />
      </el-icon>
    </div> -->
    <div class="slider-container">
      <div class="slider-label">当前尺寸: {{ modelSize }}</div>
      <el-slider
        v-model="modelSize"
        :min="1"
        :max="5"
        :step="1"
        show-input
        @change="handleSliderChange"
      />
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { Close } from '@element-plus/icons-vue'

const emit = defineEmits(['showModelSizeSetting'])
const modelSize = ref(1)
const initialSizes = new Map()

const hidePanel = () => {
  emit('showModelSizeSetting', false, { type: 'modelSize' })
}

const handleSliderChange = (value) => {
  // console.log('模型尺寸改变为:', value)
  if (typeof MSIMEarthCZMLProcessContainer !== 'undefined') {
    MSIMEarthCZMLProcessContainer.entities.values.forEach((e) => {
      if (e.model && e.model.minimumPixelSize) {
        if (!initialSizes.has(e.id)) {
          initialSizes.set(e.id, e.model.minimumPixelSize._value)
        }
        const initialSize = initialSizes.get(e.id)
        e.model.minimumPixelSize._value = initialSize * value
      }
    })
  }
}
</script>

<style lang="less" scoped>
.modelSizeSettingDiv {
  position: absolute;
  right: 24%;
  top: 10%;
  margin-top: 0px;
  height: 200px;
  width: 280px;
  z-index: 998;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: linear-gradient(
    135deg,
    rgba(2, 26, 70, 0.95) 0%,
    rgba(0, 199, 251, 0.1) 100%
  );
  box-shadow: 0 0 30px rgba(16, 146, 213, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 199, 251, 0.3);
  padding: 50px 20px 20px;
  box-sizing: border-box;
  display: flex;
  flex-direction: column;
  align-items: center;

  .title {
    position: absolute;
    top: 10px;
    left: 15px;
    font-size: 16px;
    font-weight: 600;
    color: #00c7fb;
    z-index: 999;
    text-shadow: 0 0 10px rgba(0, 199, 251, 0.5);
    font-family: 'Arial', sans-serif;
    letter-spacing: 1px;
  }

  .close-btn {
    position: absolute;
    top: 10px;
    right: 10px;
    cursor: pointer;
    z-index: 999;
    width: 24px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: all 0.3s ease;

    &:hover {
      background-color: rgba(0, 199, 251, 0.2);
      box-shadow: 0 0 15px rgba(0, 199, 251, 0.5);
    }
  }

  .slider-container {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 15px;
  }

  .slider-label {
    font-size: 14px;
    color: #409efc;
    text-align: center;
    font-family: 'Arial', sans-serif;
    letter-spacing: 0.5px;
  }
}

:deep .el-slider {
  .el-slider__runway {
    background-color: rgba(2, 26, 70, 0.5);
    border: 1px solid rgba(64, 158, 252, 0.3);
  }

  .el-slider__bar {
    background: linear-gradient(90deg, #409efc, #00c7fb);
    box-shadow: 0 0 10px rgba(0, 199, 251, 0.5);
  }

  .el-slider__button {
    border-color: #00c7fb;
    background-color: rgba(0, 199, 251, 0.8);
    box-shadow: 0 0 15px rgba(0, 199, 251, 0.6);

    &:hover {
      box-shadow: 0 0 20px rgba(0, 199, 251, 0.8);
      transform: scale(1.1);
    }
  }

  .el-input-number {
    .el-input__wrapper {
      background-color: rgba(2, 26, 70, 0.5);
      border-color: rgba(64, 158, 252, 0.4);
      box-shadow: none;

      .el-input__inner {
        color: #00c7fb;
      }
    }
  }
}
</style>
