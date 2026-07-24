<template>
  <div v-if="visible" class="daotiao-details" :style="detailsStyle">
    <div class="details-header">
      <div class="header-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            stroke="#06d6f9"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <polyline
            points="16 11 12 15 8 11"
            stroke="#06d6f9"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        {{ title }}
      </div>
      <div class="header-close" @click="closeDetails">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <line
            x1="18"
            y1="6"
            x2="6"
            y2="18"
            stroke="#06d6f9"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <line
            x1="6"
            y1="6"
            x2="18"
            y2="18"
            stroke="#06d6f9"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
    <div class="details-content">
      <div class="detail-item">
        <span class="item-label">编组名称：</span>
        <span class="item-value">{{ itemInfo.groupName }}</span>
      </div>
      <!-- <div class="detail-item">
        <span class="item-label">编组编号：</span>
        <span class="item-value">{{ itemInfo.id }}</span>
      </div> -->
      <div class="detail-item">
        <span class="item-label">兵力数量：</span>
        <span class="item-value">{{
          sideClass === 'red' ? itemInfo.totalUnits : itemInfo.childList.length
        }}</span>
      </div>
      <div v-if="sideClass == 'red'" class="detail-item">
        <span class="item-label">攻击状态：</span>
        <span
          class="item-value attack-status"
          :class="
            itemInfo.attackableUnits == itemInfo.totalUnits
              ? 'all'
              : itemInfo.attackableUnits > 0
              ? 'partial'
              : 'commandDisabled'
          "
        >
          {{
            itemInfo.attackableUnits == itemInfo.totalUnits
              ? '全部具备目标打击能力'
              : itemInfo.attackableUnits > 0
              ? '部分具备目标打击能力'
              : '不具备目标打击能力'
          }}
        </span>
      </div>
      <div class="detail-item" v-if="itemInfo.attackableUnits == 0">
        <span class="item-label">原因：</span>
        <span class="item-value">{{ itemInfo.unattackableReason }}</span>
      </div>
      <div v-if="itemInfo.attackableCount" class="detail-item">
        <span class="item-label">可攻击数量：</span>
        <span class="item-value">{{ itemInfo.attackableUnits }}</span>
      </div>
      <div class="detail-item">
        <span class="item-label">所属方：</span>
        <span class="item-value side" :class="sideClass">
          {{ sideClass === 'blue' ? '蓝方' : '红方' }}
        </span>
      </div>
    </div>
    <div class="details-footer">
      <div class="footer-line"></div>
      <div class="footer-info">
        <!-- <span class="tech-label">TECH</span>
        <span class="update-time"
          >更新时间：{{ new Date().toLocaleString() }}</span
        > -->
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue'

// 组件属性
const props = defineProps({
  // 显示状态
  visible: {
    type: Boolean,
    default: false
  },
  // 详情位置
  position: {
    type: Object,
    default: () => ({ x: 0, y: 0 })
  },
  // 详情数据
  itemInfo: {
    type: Object,
    default: () => ({})
  },
  // 所属方类型：blue或red
  side: {
    type: String,
    default: 'blue'
  }
})

// 事件
const emit = defineEmits(['close'])

// 计算属性
const title = computed(() => {
  return props.side === 'blue' ? '蓝方目标详情' : '红方攻击力量详情'
})

const sideClass = computed(() => {
  return props.side
})

const detailsStyle = computed(() => {
  return {
    left: `${props.position.x}px`,
    top: `${props.position.y}px`
  }
})

// 方法
const closeDetails = () => {
  emit('close')
}
</script>

<style lang="less" scoped>
.daotiao-details {
  position: fixed;
  width: 280px;
  background: linear-gradient(
    135deg,
    rgba(2, 26, 70, 0.95) 0%,
    rgba(0, 40, 80, 0.95) 100%
  );
  border: 1px solid rgba(6, 214, 249, 0.5);
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(6, 214, 249, 0.3),
    inset 0 0 20px rgba(6, 214, 249, 0.1);
  color: #fff;
  font-size: 14px;
  z-index: 9999;
  overflow: hidden;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  // 科技边框效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid transparent;
    border-radius: 8px;
    background: linear-gradient(135deg, #06d6f9, #0080ff) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }

  .details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    background: linear-gradient(
      90deg,
      rgba(6, 214, 249, 0.2) 0%,
      rgba(0, 128, 255, 0.2) 100%
    );
    border-bottom: 1px solid rgba(6, 214, 249, 0.3);

    .header-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      color: #06d6f9;
      text-shadow: 0 0 5px rgba(6, 214, 249, 0.5);
    }

    .header-close {
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.3s ease;

      &:hover {
        background-color: rgba(6, 214, 249, 0.2);
        transform: rotate(90deg);
      }
    }
  }

  .details-content {
    padding: 15px;
    max-height: 300px;
    overflow-y: auto;

    // 滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(6, 214, 249, 0.1);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(6, 214, 249, 0.5);
      border-radius: 3px;
      transition: background 0.3s ease;

      &:hover {
        background: rgba(6, 214, 249, 0.8);
      }
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid rgba(6, 214, 249, 0.1);

      &:last-child {
        border-bottom: none;
      }

      .item-label {
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
      }

      .item-value {
        color: #fff;
        font-size: 13px;
        font-weight: 500;
        text-align: right;
      }

      .attack-status {
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;

        &.all {
          background: linear-gradient(
            135deg,
            rgba(103, 194, 58, 0.3) 0%,
            rgba(72, 187, 120, 0.3) 100%
          );
          color: #67c23a;
          border: 1px solid rgba(103, 194, 58, 0.5);
        }

        &.partial {
          background: linear-gradient(
            135deg,
            rgba(230, 162, 60, 0.3) 0%,
            rgba(247, 183, 49, 0.3) 100%
          );
          color: #e6a23c;
          border: 1px solid rgba(230, 162, 60, 0.5);
        }
        &.commandDisabled {
          background: linear-gradient(
            135deg,
            rgba(238, 13, 5, 0.3) 0%,
            rgba(241, 11, 11, 0.3) 100%
          );
          color: #e74022;
          border: 1px solid rgba(247, 39, 32, 0.5);
        }
      }

      .side {
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;

        &.blue {
          background: linear-gradient(
            135deg,
            rgba(30, 144, 255, 0.3) 0%,
            rgba(0, 191, 255, 0.3) 100%
          );
          color: #409eff;
          border: 1px solid rgba(30, 144, 255, 0.5);
        }

        &.red {
          background: linear-gradient(
            135deg,
            rgba(245, 108, 108, 0.3) 0%,
            rgba(234, 64, 64, 0.3) 100%
          );
          color: #f56c6c;
          border: 1px solid rgba(245, 108, 108, 0.5);
        }
      }
    }
  }

  .details-footer {
    padding: 10px 15px;
    background: linear-gradient(
      90deg,
      rgba(6, 214, 249, 0.1) 0%,
      rgba(0, 128, 255, 0.1) 100%
    );
    border-top: 1px solid rgba(6, 214, 249, 0.3);

    .footer-line {
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        rgba(6, 214, 249, 0.5) 50%,
        transparent 100%
      );
      margin-bottom: 8px;
    }

    .footer-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 11px;
      color: rgba(255, 255, 255, 0.5);

      .tech-label {
        font-family: 'Courier New', monospace;
        color: #06d6f9;
        font-weight: 600;
        letter-spacing: 1px;
        text-shadow: 0 0 3px rgba(6, 214, 249, 0.5);
      }
    }
  }
}
</style>
