<template>
  <div class="task">
    <el-divider content-position="left">{{ props.item.title }}</el-divider>
    <div class="task-content">
      <el-scrollbar height="100%">
        <el-timeline>
          <el-timeline-item
            timestamp=""
            placement="top"
            v-for="(item, index) in vueData.taskList"
            :key="index"
          >
            <el-card>
              <template #header>
                <div class="card-header">
                  <span>{{ item.title }}</span>
                </div>
              </template>
              <p>执行方式: {{ item.way }}</p>
              <p>执行时间: {{ item.time }}</p>
            </el-card>
          </el-timeline-item>
        </el-timeline>
      </el-scrollbar>
    </div>
  </div>
</template>
<script setup>
import { reactive, onBeforeMount, onMounted, ref, watch } from 'vue'
import store from '@/store/index.js'
import { BLConfigData } from './BLConfigjason'
const props = defineProps({
  item: {
    type: Object,
    default: {}
  },
  node: {
    type: Object,
    default: {}
  }
})
let vueData = reactive({
  taskList: [
    {
      title: 'XXX任务1',
      way: '前进/撤退',
      time: '2022-04-11'
    },
    {
      title: 'XXX任务1',
      way: '前进/撤退',
      time: '2022-04-11'
    },
    {
      title: 'XXX任务1',
      way: '前进/撤退',
      time: '2022-04-11'
    },
    {
      title: 'XXX任务1',
      way: '前进/撤退',
      time: '2022-04-11'
    },
    {
      title: 'XXX任务1',
      way: '前进/撤退',
      time: '2022-04-11'
    },
    {
      title: 'XXX任务1',
      way: '前进/撤退',
      time: '2022-04-11'
    }
  ]
})
</script>

<style lang="less" scoped>
.task {
  height: calc(100%);
  .el-divider {
    border-top: 1px solid #0b3855;
    margin: 15px 0;

    :deep(.el-divider__text) {
      background-color: transparent !important;
      font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
      font-weight: 700;
      font-style: normal;
      font-size: 16px;
      color: #c2d7ee;
      left: 0 !important;
    }
  }

  .task-content {
    padding: 10px;
    height: calc(100% - 55px);
    :deep(.el-timeline) {
      --el-timeline-node-size-normal: 12px;
      --el-timeline-node-size-large: 14px;
      --el-timeline-node-color: #eee;
    }

    :deep(.el-card__header) {
      padding: 5px 0 5px 10px;
      border-bottom: none;
      box-sizing: border-box;
      text-align: left;
    }

    :deep(.el-card__body) {
      padding: 5px 20px;
      text-align: left;
    }
    :deep(.el-card) {
      color: #eee;
      --el-card-border-color: #075d89 !important;
      --el-card-bg-color: #2b4559 !important;
    }
  }
}
</style>
