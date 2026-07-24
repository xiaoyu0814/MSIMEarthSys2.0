<template>
  <div class="daotiao-header">
    <div class="content-header">
      <div class="header-left">
        <div class="header-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 2L2 7l10 5 10-5-10-5z"
              stroke="#06d6f9"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M2 17l10 5 10-5"
              stroke="#06d6f9"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M2 12l10 5 10-5"
              stroke="#06d6f9"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <h3>兵力推荐</h3>
      </div>

      <!-- 将header-right改为header-middle -->
      <div class="header-middle">
        <button class="btn-tech btn-refresh" @click="handleRefresh">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              d="M21.5 2v6h-6"
              stroke="#06d6f9"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M2.5 22v-6h6"
              stroke="#06d6f9"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M2 11a9 9 0 0 1 8-8.94"
              stroke="#06d6f9"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M22 13a9 9 0 0 1-8 8.94"
              stroke="#06d6f9"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          刷新数据
        </button>
        <!-- 行动选择下拉框 -->
        <div class="command-selector">
          <div class="selector-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5z"
                stroke="#06d6f9"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2 17l10 5 10-5"
                stroke="#06d6f9"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2 12l10 5 10-5"
                stroke="#06d6f9"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            行动类型
          </div>
          <div class="selector-dropdown">
            <div class="dropdown-toggle" @click="toggleDropdown">
              <span>{{ selectedCommand.name }}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                class="dropdown-arrow"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="#06d6f9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div v-if="dropdownVisible" class="dropdown-menu">
              <div
                v-for="command in commands"
                :key="command.value"
                class="dropdown-item"
                :class="{ active: selectedCommand.value === command.value }"
                @click="selectCommand(command)"
              >
                {{ command.name }}
              </div>
            </div>
          </div>
        </div>
        <!-- 历史记录下拉框 -->
        <div class="command-selector">
          <div class="selector-label">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L2 7l10 5 10-5-10-5z"
                stroke="#06d6f9"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2 17l10 5 10-5"
                stroke="#06d6f9"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M2 12l10 5 10-5"
                stroke="#06d6f9"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            历史记录
          </div>
          <div class="selector-dropdown">
            <div class="dropdown-toggle" @click="historysDropDown">
              <span>{{ selectedHistory?.name }}</span>
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                class="dropdown-arrow"
              >
                <path
                  d="M6 9l6 6 6-6"
                  stroke="#06d6f9"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
            <div v-if="historysVisible" class="dropdown-menu">
              <div
                v-for="command in historys"
                :key="command.id"
                class="dropdown-item"
                :class="{ active: selectedHistory?.id === command.id }"
                @click="selectHistory(command)"
              >
                {{ command.name }}
              </div>
            </div>
          </div>
        </div>
        <!-- 批量操作按钮 -->
        <div class="batch-operations">
          <!-- <button class="btn-tech btn-select-all" @click="handleSelectAll">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                ry="2"
                stroke="#06d6f9"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7 12h10"
                stroke="#06d6f9"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            全选
          </button> -->
          <button class="btn-tech btn-deselect-all" @click="handleDeselectAll">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="2"
                ry="2"
                stroke="#06d6f9"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7 7l10 10"
                stroke="#06d6f9"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M17 7L7 17"
                stroke="#06d6f9"
                stroke-width="2"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
            </svg>
            全不选
          </button>
        </div>
      </div>

      <!-- 关闭按钮作为content-header的直接子元素，与header-middle同级 -->
      <div class="header-right">
        <div class="btn-close-simples">
          <el-tooltip
            :content="isExpanded ? '收起面板' : '展开面板'"
            placement="top"
          >
            <el-icon class="expand-btn" @click="toggleExpand">
              <ArrowUp v-if="isExpanded" />
              <ArrowDown v-else />
            </el-icon>
          </el-tooltip>
        </div>
        <button class="btn-close-simple" @click="handleClose">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path
              d="M18 6L6 18"
              stroke="#06d6f9"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M6 6L18 18"
              stroke="#06d6f9"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import emitter from '@/utils/eventbus'
import { getDataList } from '@/service/bldtServer/index'
// 定义事件
const emit = defineEmits([
  'refresh',
  'commandChange',
  'selectAll',
  'deselectAll',
  'close'
])
const isExpanded = ref(false)

// 行动类型数组
const commands = ref([
  { value: 'attack', name: '攻击行动' }
  // { value: "recon", name: "侦察行动" },
  // { value: "jam", name: "干扰行动" },
  // { value: "defense", name: "防御行动" },
])
// 历史记录数据数组
const historys = ref([])

// 选中的行动
const selectedCommand = ref(commands.value[0])
// 选择的历史记录
const selectedHistory = ref()

// 下拉框显示状态
const dropdownVisible = ref(false)

// 历史记录下拉框状态
const historysVisible = ref(false)

// 刷新数据
const handleRefresh = () => {
  console.log('刷新数据')
  emit('refresh')
}

// 切换下拉框
const toggleDropdown = () => {
  dropdownVisible.value = !dropdownVisible.value
}
const historysDropDown = () => {
  historysVisible.value = !historysVisible.value
}

// 选择行动
const selectCommand = (command) => {
  selectedCommand.value = command
  dropdownVisible.value = false
  // 触发行动变更事件
  emit('commandChange', command.value)
  console.log('行动变更:', command.value)
}

// 选择历史记录
const selectHistory = (historys) => {
  selectedHistory.value = historys
  historysVisible.value = false
  emitter.emit('sendHistoryValue', selectedHistory.value)
}

// 全选功能
const handleSelectAll = () => {
  console.log('全选，使用行动:', selectedCommand.value)
  emit('selectAll', selectedCommand.value)
}

// 全不选功能
const handleDeselectAll = () => {
  console.log('全不选')
  emit('deselectAll')
}

// 关闭功能
const handleClose = () => {
  emitter.emit('showBLEventList', false)
}
// 切换面板展开/收起
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
  emitter.emit('sendIsExpanded', isExpanded.value)
}

//获取历史记录列表
const getHistoryList = () => {
  let params = {
    dataType: 'troop_recommend',
    scenarioId: JSON.parse(window.localStorage.getItem('blObject')).scenarioId
  }
  getDataList(params).then((res) => {
    if (res.code == 200) {
      historys.value = res.data
    }
  })
}

// 点击外部关闭下拉框
onMounted(() => {
  const handleClickOutside = (event) => {
    const selector = document.querySelector('.command-selector')
    if (selector && !selector.contains(event.target)) {
      dropdownVisible.value = false
    }
  }
  document.addEventListener('click', handleClickOutside)
  emitter.emit('sendIsExpanded', isExpanded.value)
  emitter.on('refreshHistoryList', (val) => {
    getHistoryList()
  })
  getHistoryList()
})
</script>

<style lang="less" scoped>
// 科技风变量
@tech-blue: #06d6f9;
@tech-dark-blue: #001a46;
@tech-light-blue: rgba(6, 214, 249, 0.1);
@tech-border: rgba(6, 214, 249, 0.3);
@tech-glow: 0 0 10px rgba(6, 214, 249, 0.5);

.daotiao-header {
  width: 100%;
  position: relative;
  top: 15px;
  z-index: 10;

  .content-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 15px 20px;
    // 增强头部背景，使其更明亮，与主体区分更明显
    background: linear-gradient(
      135deg,
      rgba(3, 35, 90, 0.98) 0%,
      rgba(0, 50, 100, 0.98) 100%
    );
    // 增强边框，提升立体感
    border-bottom: 2px solid @tech-blue;
    border-top: 1px solid rgba(6, 214, 249, 0.5);
    // 增强阴影，提升立体感，使其与主体内容分离
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.5), 0 0 30px rgba(6, 214, 249, 0.2),
      inset 0 1px 0 rgba(255, 255, 255, 0.2);
    position: relative;
    z-index: 1;
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
        rgba(6, 214, 249, 0.8) 50%,
        transparent 100%
      );
      box-shadow: 0 0 10px rgba(6, 214, 249, 0.5);
    }

    .header-left {
      display: flex;
      align-items: center;
      gap: 12px;

      .header-logo {
        display: flex;
        align-items: center;
        justify-content: center;
        width: 40px;
        height: 40px;
        background: linear-gradient(135deg, @tech-blue, #0080ff);
        border-radius: 8px;
        box-shadow: @tech-glow;
      }

      h3 {
        margin: 0;
        font-size: 18px;
        font-weight: 600;
        color: @tech-blue;
        text-shadow: @tech-glow;
        font-family: 'Microsoft YaHei', sans-serif;
      }

      .subtitle {
        font-size: 12px;
        color: rgba(255, 255, 255, 0.7);
        font-family: 'Courier New', monospace;
        letter-spacing: 1px;
      }
    }

    .header-middle {
      display: flex;
      gap: 10px;
      margin-right: -400px;

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
          box-shadow: @tech-glow;
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
      }

      /* 批量操作按钮 */
      .batch-operations {
        display: flex;
        gap: 10px;
      }

      /* 行动选择器样式 */
      .command-selector {
        display: flex;
        align-items: center;
        gap: 10px;
        position: relative;

        .selector-label {
          display: flex;
          align-items: center;
          gap: 6px;
          color: @tech-blue;
          font-size: 14px;
          font-weight: 500;
        }

        .selector-dropdown {
          position: relative;
          width: 150px;

          .dropdown-toggle {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
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

            // 悬停效果
            &:hover {
              border-color: @tech-blue;
              background: linear-gradient(
                135deg,
                rgba(6, 214, 249, 0.2) 0%,
                rgba(0, 128, 255, 0.2) 100%
              );
              box-shadow: @tech-glow;
            }

            // 发光边框
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

            .dropdown-arrow {
              transition: transform 0.3s ease;
            }

            &.active .dropdown-arrow {
              transform: rotate(180deg);
            }
          }

          .dropdown-menu {
            position: absolute;
            top: 100%;
            left: 0;
            width: 100%;
            margin-top: 5px;
            border: 1px solid @tech-border;
            border-radius: 4px;
            background: linear-gradient(
              135deg,
              rgba(3, 35, 90, 0.98) 0%,
              rgba(0, 50, 100, 0.98) 100%
            );
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5),
              0 0 20px rgba(6, 214, 249, 0.3);
            z-index: 1000;
            animation: dropdownFadeIn 0.3s ease-out;

            @keyframes dropdownFadeIn {
              from {
                opacity: 0;
                transform: translateY(-10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }

            .dropdown-item {
              padding: 8px 12px;
              color: rgba(255, 255, 255, 0.9);
              font-size: 14px;
              cursor: pointer;
              transition: all 0.3s ease;
              position: relative;

              &:hover {
                background: linear-gradient(
                  135deg,
                  rgba(6, 214, 249, 0.2) 0%,
                  rgba(0, 128, 255, 0.2) 100%
                );
                color: @tech-blue;
                padding-left: 15px;
              }

              &.active {
                background: linear-gradient(
                  135deg,
                  rgba(6, 214, 249, 0.3) 0%,
                  rgba(0, 128, 255, 0.3) 100%
                );
                color: @tech-blue;
                font-weight: 600;
              }

              // 选中项左侧指示器
              &.active::before {
                content: '';
                position: absolute;
                left: 0;
                top: 0;
                bottom: 0;
                width: 3px;
                background: linear-gradient(180deg, @tech-blue, #0080ff);
                border-radius: 0 2px 2px 0;
              }
            }
          }
        }
      }
    }

    // 新的header-right样式，仅包含关闭按钮
    .header-right {
      display: flex;
      align-items: center;
      justify-content: center;

      // 简单关闭按钮样式（只保留X图标）
      .btn-close-simple {
        width: 40px;
        height: 40px;
        border: none;
        background: transparent;
        color: @tech-blue;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        padding: 0;

        &:hover {
          color: @tech-blue;
          transform: rotate(90deg) scale(1.1);
          text-shadow: 0 0 10px rgba(6, 214, 249, 0.8);
        }

        &:active {
          transform: rotate(90deg) scale(0.95);
        }

        svg {
          transition: all 0.3s ease;
        }

        &:hover svg {
          filter: drop-shadow(0 0 8px rgba(6, 214, 249, 0.6));
        }
      }
      .btn-close-simples {
        width: 40px;
        height: 40px;
        border: none;
        background: transparent;
        color: @tech-blue;
        cursor: pointer;
        transition: all 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        position: relative;
        overflow: hidden;
        padding: 0;
      }
    }
    .expand-btn {
      cursor: pointer;
      font-size: 18px;
      color: #c2d7ee;
      transition: all 0.3s ease;
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        color: #00cbff;
        background-color: rgba(0, 203, 255, 0.1);
        border-radius: 4px;
      }
    }
  }
}
</style>
