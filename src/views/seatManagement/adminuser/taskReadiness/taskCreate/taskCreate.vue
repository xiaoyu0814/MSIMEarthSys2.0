<template>
  <div id="taskCreate_model">
    <el-form
      label-width="100px"
      :model="props.createTaskInfo"
      style="width: 460px"
    >
      <el-form-item label="任务名称">
        <el-input v-model="props.createTaskInfo.taskName" />
      </el-form-item>
      <el-form-item label="任务类型">
        <el-select v-model="props.createTaskInfo.taskType">
          <el-option
            v-for="item in vueData.taskTypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务描述">
        <el-input
          v-model="props.createTaskInfo.taskDescription"
          :autosize="{ minRows: 4, maxRows: 4 }"
          type="textarea"
        />
      </el-form-item>
    </el-form>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { getTaskTypeList } from '@/service/taskManagement'

const props = defineProps({
  createTaskInfo: Object
})

const emit = defineEmits()

const vueData = reactive({
  taskTypeList: []
})

onMounted(() => {
  _getTaskTypeList()
})

/**
 * @description 获取任务类型列表
 */
let _getTaskTypeList = () => {
  let params = {}
  getTaskTypeList(params).then((res) => {
    if (res.code == 200) {
      vueData.taskTypeList = res.data
    } else {
      ElMessage.error('任务列表获取失败')
    }
  })
}
</script>

<style lang="less" scoped>
#taskCreate_model {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  :deep(.el-form-item__label) {
    color: #fff;
  }
  :deep(.el-input) {
    .el-input__wrapper {
      border-radius: 5px;
      box-shadow: none;
      background-color: #2b4559 !important;
      box-shadow: 0 0 0 1px #075d89 inset !important;
    }
    .el-input__inner {
      color: #fff !important;
    }
  }
  .el-select {
    width: 100%;
    :deep(.el-select__wrapper) {
      background-color: #2b4559 !important;
      box-shadow: 0 0 0 1px #075d89 inset !important;
    }
  }
  :deep(.el-textarea__inner) {
    height: 90px;
    border-radius: 5px;
    box-shadow: none;
    color: #ffff;
    background-color: #2b4559 !important;
    box-shadow: 0 0 0 1px #075d89 inset !important;
  }
  ::v-deep(.el-select__placeholder) {
    color: #fff;
  }
}
</style>
