<template>
  <div class="daotiao-footer">
    <div class="footer-content">
      <div class="legend tech-legend">
        <div class="legend-item">
          <div class="legend-color blue tech-color"></div>
          <span class="tech-text">蓝方目标</span>
        </div>
        <div class="legend-item">
          <div class="legend-color green tech-color"></div>
          <span class="tech-text">红方全部具备目标打击能力</span>
        </div>
        <div class="legend-item">
          <div class="legend-color yellow tech-color"></div>
          <span class="tech-text">红方部分具备目标打击能力</span>
        </div>
        <div class="legend-item">
          <div class="legend-color red tech-color"></div>
          <span class="tech-text">红方不具备目标打击能力</span>
        </div>
        <!-- 指令配置图例 -->
        <!-- <div class="legend-item">
          <div class="legend-color command-configured tech-color"></div>
          <span class="tech-text">指令已配置</span>
        </div> -->
      </div>

      <!-- 功能按钮 -->
      <div class="footer-buttons">
        <button class="btn-tech btn-save" @click="handleSave">
          <span class="btn-icon">💾</span>
          执行
        </button>
        <button class="btn-tech btn-reset" @click="handleReset">
          <span class="btn-icon">🔄</span>
          重置
        </button>
        <button class="btn-tech btn-history" @click="handleSaveHistory">
          <span class="btn-icon"></span>
          保存记录
        </button>
        <!-- <button class="btn-tech btn-import" @click="handleImport">
          <span class="btn-icon">📥</span>
          导入
        </button>
        <button class="btn-tech btn-export" @click="handleExport">
          <span class="btn-icon">📤</span>
          导出
        </button> -->
      </div>
    </div>
  </div>
</template>

<script setup>
// 底部图例组件
// 用于显示编制导调态势图的图例说明

import { onMounted, ref } from 'vue'
import emitter from '@/utils/eventbus'

// 定义事件
const emit = defineEmits(['save', 'reset', 'import', 'export', 'history'])

const isExpanded = ref(false)

// 保存配置
const handleSave = () => {
  console.log('保存配置')
  emit('save')
}

// 重置配置
const handleReset = () => {
  console.log('重置配置')
  emit('reset')
}

// 保存历史记录
const handleSaveHistory = () => {
  emit('history')
}

// 导入配置
const handleImport = () => {
  console.log('导入配置')
  emit('import')
}

// 导出配置
const handleExport = () => {
  console.log('导出配置')
  emit('export')
}
onMounted(() => {
  emitter.on('sendIsExpanded', (value) => {
    isExpanded.value = value
  })
})
</script>

<style lang="less" scoped>
// 科技风变量
@tech-blue: #06d6f9;
@tech-dark-blue: #001a46;
@tech-light-blue: rgba(6, 214, 249, 0.1);
@tech-border: rgba(6, 214, 249, 0.3);
@tech-glow: 0 0 10px rgba(6, 214, 249, 0.5);

.daotiao-footer {
  // 确保图例固定在底部，不会被滚动内容遮挡
  position: sticky;
  bottom: 0;
  left: 0;
  right: 0;
  // position: absolute;
  // bottom: -58px;
  // 增加z-index，确保图例显示在最上层
  z-index: 10;
  // 确保图例宽度100%
  width: 100%;
  // 确保图例不被overflow隐藏
  overflow: visible;
}

.footer-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
  padding: 15px 20px;
  // 增强底部背景，使其更明亮，与主体区分更明显
  background: linear-gradient(
    135deg,
    rgba(3, 35, 90, 0.98) 0%,
    rgba(0, 50, 100, 0.98) 100%
  );
  // 增强边框，提升立体感
  border-top: 2px solid @tech-blue;
  border-bottom: 1px solid rgba(6, 214, 249, 0.5);
  // margin-top: 20px;
  position: relative;
  z-index: 1;
  // 增强阴影，提升立体感，使其与主体内容分离
  box-shadow: 0 -4px 25px rgba(0, 0, 0, 0.5), 0 0 30px rgba(6, 214, 249, 0.2),
    inset 0 -1px 0 rgba(255, 255, 255, 0.2);
  // 添加顶部和底部的发光线条，增强科技感
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(6, 214, 249, 0.8) 50%,
      transparent 100%
    );
    box-shadow: 0 0 10px rgba(6, 214, 249, 0.5);
  }

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent 0%,
      rgba(6, 214, 249, 0.6) 50%,
      transparent 100%
    );
    box-shadow: 0 0 8px rgba(6, 214, 249, 0.4);
  }
}

.legend {
  display: flex;
  gap: 20px;

  .legend-item {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;

    .legend-color {
      width: 24px;
      height: 24px;
      border-radius: 6px;
      border: 1px solid @tech-border;
      transition: all 0.3s ease;
      // 增强图例颜色块的立体感和亮度
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);

      &.tech-color {
        // 增强发光效果
        box-shadow: 0 0 15px rgba(6, 214, 249, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.3);

        &:hover {
          transform: scale(1.2);
          box-shadow: 0 0 25px rgba(6, 214, 249, 0.6),
            inset 0 1px 0 rgba(255, 255, 255, 0.4);
        }
      }

      &.blue {
        // 提高蓝色亮度
        background: linear-gradient(
          135deg,
          rgba(30, 144, 255, 0.6) 0%,
          rgba(0, 191, 255, 0.6) 100%
        );
      }

      &.green {
        // 提高绿色亮度
        background: linear-gradient(
          135deg,
          rgba(103, 194, 58, 0.6) 0%,
          rgba(72, 187, 120, 0.6) 100%
        );
      }

      &.yellow {
        // 提高黄色亮度
        background: linear-gradient(
          135deg,
          rgba(230, 162, 60, 0.6) 0%,
          rgba(247, 183, 49, 0.6) 100%
        );
      }
      &.red {
        // 提高黄色亮度
        background: linear-gradient(
          135deg,
          rgba(236, 37, 10, 0.6) 0%,
          rgba(243, 2, 2, 0.6) 100%
        );
      }

      &.command-configured {
        // 指令配置后的发光效果
        background: linear-gradient(
          135deg,
          @tech-blue 0%,
          #0080ff 50%,
          @tech-blue 100%
        );
        animation: glowPulse 2s ease-in-out infinite;
      }
    }
  }
}

// 按钮组样式
.footer-buttons {
  display: flex;
  gap: 10px;

  .btn-tech {
    display: flex;
    align-items: center;
    gap: 6px;
    padding: 8px 16px;
    border: 1px solid @tech-border;
    border-radius: 4px;
    background: linear-gradient(
      135deg,
      rgba(6, 214, 249, 0.1) 0%,
      rgba(0, 128, 255, 0.1) 100%
    );
    color: @tech-blue;
    font-size: 14px;
    cursor: pointer;
    transition: all 0.3s ease;
    position: relative;
    overflow: hidden;

    // 按钮悬停效果
    &:hover {
      border-color: @tech-blue;
      background: linear-gradient(
        135deg,
        rgba(6, 214, 249, 0.2) 0%,
        rgba(0, 128, 255, 0.2) 100%
      );
      box-shadow: 0 0 15px rgba(6, 214, 249, 0.5);
      transform: translateY(-1px);
    }

    // 按钮点击效果
    &:active {
      transform: translateY(0);
    }

    // 按钮发光边框
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(135deg, @tech-blue, #0080ff);
      border-radius: 6px;
      z-index: -1;
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover::before {
      opacity: 0.5;
    }

    .btn-icon {
      font-size: 16px;
    }

    // 不同按钮的颜色区分
    &.btn-save:hover {
      border-color: #2ed573;
      box-shadow: 0 0 15px rgba(46, 213, 115, 0.5);

      &::before {
        background: linear-gradient(135deg, #2ed573, #54a0ff);
      }
    }

    &.btn-reset:hover {
      border-color: #ffa502;
      box-shadow: 0 0 15px rgba(255, 165, 2, 0.5);

      &::before {
        background: linear-gradient(135deg, #ffa502, #ff6348);
      }
    }
    &.btn-history:hover {
      border-color: #0bd1eb;
      box-shadow: 0 0 15px rgba(7, 200, 248, 0.959);

      &::before {
        background: linear-gradient(135deg, #f53cb7, #0b99eb);
      }
    }

    &.btn-import:hover {
      border-color: #54a0ff;
      box-shadow: 0 0 15px rgba(84, 160, 255, 0.5);

      &::before {
        background: linear-gradient(135deg, #54a0ff, #00d2d3);
      }
    }

    &.btn-export:hover {
      border-color: #ff9ff3;
      box-shadow: 0 0 15px rgba(255, 159, 243, 0.5);

      &::before {
        background: linear-gradient(135deg, #ff9ff3, #5f27cd);
      }
    }
  }
}

@keyframes glowPulse {
  0%,
  100% {
    opacity: 0.7;
    transform: scale(1);
  }
  50% {
    opacity: 1;
    transform: scale(1.02);
  }
}

// 通用科技文本样式
.tech-text {
  font-size: 14px;
  color: @tech-blue;
  text-shadow: 0 0 5px rgba(6, 214, 249, 0.5);
  font-family: 'Microsoft YaHei', sans-serif;
}
</style>
