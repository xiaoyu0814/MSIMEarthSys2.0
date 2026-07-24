<template>
  <div class="sample-panel">
    <div class="panel-header">
      <span class="title">样本列表</span>
      <el-icon class="close-icon" @click="handleClose"><Close /></el-icon>
    </div>
    <div class="panel-content">
      <!-- 批次列表 -->
      <div class="batch-list">
        <div
          v-for="(batch, index) in groupedSamples"
          :key="index"
          class="batch-item"
          :class="{ active: selectedBatch === index }"
          @click="selectedBatch = index"
        >
          <el-icon><Document /></el-icon>
          <span>批次 {{ index + 1 }}</span>
        </div>
      </div>

      <!-- 样本列表 -->
      <div class="sample-list">
        <div class="list-header">
          <span>样本列表</span>
          <el-checkbox v-model="selectAll" @change="handleSelectAll"
            >全选</el-checkbox
          >
        </div>
        <div class="sample-items">
          <el-checkbox-group v-model="selectedSamples">
            <div
              v-for="sample in currentBatchSamples"
              :key="sample.id"
              class="sample-item"
            >
              <el-checkbox :label="sample.id" />
              <div class="sample-info">
                <div class="sample-name">{{ sample.name }}</div>
                <div class="sample-desc">
                  {{ sample.description || '无描述' }}
                </div>
              </div>
            </div>
          </el-checkbox-group>
        </div>
      </div>
    </div>
    <div class="panel-footer">
      <el-button @click="handleClose">取消</el-button>
      <el-button
        type="primary"
        @click="handleStartExperiment"
        :disabled="selectedSamples.length === 0"
      >
        开始实验
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import { Close, Document } from '@element-plus/icons-vue'
import { getExpeSampleMgtPage } from '@/service/combatSimulation.js'
import { startExperiment } from '@/service/combatSimulation.js'
import emitter from '@/utils/eventbus'
import { useStore } from 'vuex'

const store = useStore()

const props = defineProps({
  experimentId: {
    type: String,
    required: true
  },
  experimentName: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['close'])

const samples = ref([])
const selectedSamples = ref([])
const selectedBatch = ref(0)
const selectAll = ref(false)

// 按批次分组样本
const groupedSamples = computed(() => {
  const batches = []
  // 按照10个样本为一批次进行分组
  const batchSize = 10

  // 先检查是否有batchId字段，如果有则按batchId分组
  const hasBatchId = samples.value.some(
    (sample) => sample.batchId !== undefined
  )

  if (hasBatchId) {
    // 按batchId分组
    const batchMap = new Map()

    samples.value.forEach((sample) => {
      const batchId = sample.batchId || 0
      if (!batchMap.has(batchId)) {
        batchMap.set(batchId, [])
      }
      batchMap.get(batchId).push(sample)
    })

    // 将Map转换为数组
    batchMap.forEach((batch) => {
      batches.push(batch)
    })
  } else {
    // 否则按照数量进行分组
    for (let i = 0; i < samples.value.length; i += batchSize) {
      batches.push(samples.value.slice(i, i + batchSize))
    }
  }

  return batches
})

// 当前选中批次的样本
const currentBatchSamples = computed(() => {
  return groupedSamples.value[selectedBatch.value] || []
})

// 加载样本数据
const loadSamples = async () => {
  try {
    const params = {
      pageNum: 1,
      pageSize: 100, // 加载足够多的样本
      experimentId: props.experimentId
    }

    const res = await getExpeSampleMgtPage(params)
    if (res.code === 200) {
      samples.value = res.data.records || []
      // 重置选择状态
      resetSelection()
    } else {
      ElMessage.error('获取样本列表失败')
    }
  } catch (error) {
    console.error('加载样本失败:', error)
    ElMessage.error('加载样本失败')
  }
}

// 重置选择状态
const resetSelection = () => {
  selectedSamples.value = []
  selectAll.value = false
  selectedBatch.value = 0
}

// 全选/取消全选
const handleSelectAll = () => {
  if (selectAll.value) {
    selectedSamples.value = currentBatchSamples.value.map((sample) => sample.id)
  } else {
    selectedSamples.value = []
  }
}

// 开始实验
const handleStartExperiment = async () => {
  if (selectedSamples.value.length === 0) {
    ElMessage.warning('请选择至少一个样本')
    return
  }

  try {
    // 存储选中的样本信息
    store.commit('set_selectedSamples', selectedSamples.value)

    // 设置本地存储，与原有流程保持一致
    const experimentInfo = {
      id: props.experimentId,
      name: props.experimentName
    }
    window.localStorage.setItem('isRestartScene', false)
    window.localStorage.setItem(
      'currentSceneInfo',
      JSON.stringify(experimentInfo)
    )

    // 直接触发事件，让接收方处理地球初始化等逻辑
    // 避免直接修改store.state的属性，应该通过commit或dispatch

    // 开始实验，与原有流程保持一致
    const res = await startExperiment(props.experimentId)
    if (res.code === 200) {
      ElMessage.success(`实验[${props.experimentName}]开始成功！`)

      // 触发开始实验的事件，让experimentList.vue监听到并处理后续流程
      emitter.emit('sampleExperimentStarted', {
        experimentId: props.experimentId,
        experimentName: props.experimentName,
        selectedSamples: selectedSamples.value
      })

      handleClose()
    } else {
      ElMessage.error(res.message || '实验开始失败')
    }
  } catch (error) {
    console.error('开始实验失败:', error)
    ElMessage.error('开始实验失败')
  }
}

// 关闭面板
const handleClose = () => {
  emit('close')
}

// 监听选中批次变化
watch(
  () => selectedBatch.value,
  () => {
    selectedSamples.value = []
    selectAll.value = false
  }
)

// 监听当前批次样本变化，更新全选状态
watch(
  () => currentBatchSamples.value,
  () => {
    updateSelectAllStatus()
  },
  { deep: true }
)

// 监听选中样本变化，更新全选状态
watch(
  selectedSamples,
  () => {
    updateSelectAllStatus()
  },
  { deep: true }
)

// 更新全选状态
const updateSelectAllStatus = () => {
  if (currentBatchSamples.value.length === 0) {
    selectAll.value = false
    return
  }

  const currentBatchIds = currentBatchSamples.value.map((sample) => sample.id)
  const allSelected = currentBatchIds.every((id) =>
    selectedSamples.value.includes(id)
  )
  selectAll.value = allSelected
}

// 监听样本数据变化，重新分组
watch(
  samples,
  () => {
    if (selectedBatch.value >= groupedSamples.value.length) {
      selectedBatch.value = 0
    }
    updateSelectAllStatus()
  },
  { deep: true }
)

// 监听experimentId变化，重新加载数据
watch(
  () => props.experimentId,
  () => {
    loadSamples()
  }
)

onMounted(() => {
  loadSamples()
})
</script>

<style lang="less" scoped>
.sample-panel {
  position: fixed;
  left: 480px; /* 实验列表面板宽度470px + 10px间距 */
  top: 13%; /* 与实验列表面板顶部对齐 */
  width: 600px; /* 增加宽度 */
  height: 761px; /* 与实验列表面板高度一致 */
  background: rgba(2, 26, 70, 0.58); /* 与实验列表面板透明度保持一致 */
  border: 1px solid #1092d5;
  box-shadow: 0 0 25px rgba(16, 146, 213, 0.8);
  z-index: 1000;
  border-radius: 8px;
  backdrop-filter: blur(5px); /* 添加毛玻璃效果 */

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px 25px;
    border-bottom: 1px solid #387ca6;
    background: linear-gradient(
      90deg,
      rgba(1, 35, 87, 0.8),
      rgba(2, 26, 70, 0.6)
    );
    border-radius: 8px 8px 0 0;

    .title {
      font-size: 20px;
      font-weight: 600;
      color: #00c7fb;
      text-shadow: 0 0 10px rgba(0, 199, 251, 0.5);
    }

    .close-icon {
      color: #b8d4e5;
      cursor: pointer;
      font-size: 18px;
      transition: all 0.3s;
      padding: 5px;
      border-radius: 4px;

      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.1);
        transform: scale(1.1);
      }
    }
  }

  .panel-content {
    display: flex;
    height: calc(100% - 120px); /* 减去头部和底部高度 */
    overflow: hidden;

    .batch-list {
      width: 150px; /* 增加批次列表宽度 */
      background: rgba(1, 35, 87, 0.7);
      border-right: 1px solid #387ca6;
      padding: 15px 0;
      overflow-y: auto;

      .batch-item {
        display: flex;
        align-items: center;
        padding: 15px 20px;
        cursor: pointer;
        color: #999;
        transition: all 0.3s;
        border-radius: 4px;
        margin: 5px 10px;

        &:hover {
          background: rgba(16, 146, 213, 0.3);
          color: #fff;
          transform: translateX(5px);
        }

        &.active {
          background: linear-gradient(
            90deg,
            rgba(16, 146, 213, 0.4),
            rgba(16, 146, 213, 0.2)
          );
          color: #00c7fb;
          border-left: 3px solid #00c7fb;
        }

        span {
          margin-left: 10px;
          font-size: 14px;
        }
      }
    }

    .sample-list {
      flex: 1;
      display: flex;
      flex-direction: column;
      padding: 20px;

      .list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin-bottom: 15px;
        color: #fff;
        font-size: 16px;
        font-weight: 500;

        :deep(.el-checkbox) {
          .el-checkbox__label {
            color: #fff;
            font-size: 14px;
          }
        }
      }

      .sample-items {
        flex: 1;
        overflow-y: auto;

        .sample-item {
          display: flex;
          align-items: center;
          padding: 12px 15px;
          margin-bottom: 10px;
          background: rgba(1, 35, 87, 0.4);
          border-radius: 6px;
          border: 1px solid rgba(16, 146, 213, 0.3);
          transition: all 0.3s;

          &:hover {
            background: rgba(16, 146, 213, 0.2);
            border-color: rgba(16, 146, 213, 0.6);
            transform: translateY(-2px);
          }

          .sample-info {
            margin-left: 15px;
            flex: 1;

            .sample-name {
              color: #fff;
              font-weight: 600;
              margin-bottom: 5px;
              font-size: 14px;
            }

            .sample-desc {
              color: #b8d4e5;
              font-size: 12px;
              line-height: 1.4;
            }
          }
        }
      }
    }
  }

  .panel-footer {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 20px;
    border-top: 1px solid #387ca6;
    background: rgba(1, 35, 87, 0.3);
    gap: 20px;

    button {
      padding: 12px 30px;
      border-radius: 6px;
      font-weight: 500;
      font-size: 14px;
      min-width: 100px;
      transition: all 0.3s ease;

      &:first-child {
        background: rgba(255, 255, 255, 0.1);
        border: 1px solid rgba(255, 255, 255, 0.3);
        color: #fff;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
      }

      &:last-child {
        &:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(16, 146, 213, 0.4);
        }
      }
    }
  }
}

/* 滚动条样式 */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: rgba(1, 35, 87, 0.3);
  border-radius: 4px;
}

::-webkit-scrollbar-thumb {
  background: linear-gradient(
    180deg,
    rgba(16, 146, 213, 0.6),
    rgba(0, 199, 251, 0.6)
  );
  border-radius: 4px;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

::-webkit-scrollbar-thumb:hover {
  background: linear-gradient(
    180deg,
    rgba(16, 146, 213, 0.8),
    rgba(0, 199, 251, 0.8)
  );
  transform: scale(1.1);
}

::-webkit-scrollbar-corner {
  background: rgba(1, 35, 87, 0.3);
}
</style>
