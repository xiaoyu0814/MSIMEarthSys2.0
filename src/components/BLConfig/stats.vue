<template>
  <div class="stats">
    <el-divider content-position="left">{{ props.item.title }}</el-divider>
    <div class="content">
      <el-form label-width="90px">
        <el-form-item label="阵营:">
          <el-select v-model="props.node.Side" placeholder="请选择" clearable>
            <el-option label="红方" value="red" />
            <el-option label="蓝方" value="blue" />
          </el-select>
        </el-form-item>
        <el-form-item label="属性名称:">
          <el-input
            class="item-input"
            v-model="props.node.LabelName"
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item label="目标名称:">
          <el-input
            class="item-input"
            v-model="props.node.Name"
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item label="类型:">
          <el-input
            class="item-input"
            v-model="props.node.Type"
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item label="经度:">
          <el-input
            class="item-input"
            v-model="props.node.Lon"
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item label="纬度:">
          <el-input
            class="item-input"
            v-model="props.node.Lat"
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item label="高度:">
          <el-input
            class="item-input"
            v-model="props.node.Alt"
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item label="航向角:">
          <el-input
            class="item-input"
            v-model="props.node.HDG"
            placeholder="Please input"
          />
        </el-form-item>
        <el-form-item label="速度:">
          <el-input
            class="item-input"
            v-model="props.node.SPD"
            placeholder="Please input"
          />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted, ref, onBeforeMount, watch } from 'vue'

const props = defineProps({
  name: {
    type: String,
    default: ''
  },
  item: {
    type: Object,
    default: {}
  },
  node: {
    type: Object,
    default: {}
  }
})

const vueData = reactive({})
</script>
<style lang="less" scoped>
.stats {
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

  .content {
    padding-top: 30px;
    padding-right: 10px;
  }
  :deep(.el-form-item__label) {
    color: #ffff;
  }
  .el-input {
    :deep(.el-input__wrapper) {
      background-color: #2b4559 !important;
      box-shadow: 0 0 0 1px #075d89 inset;
      .el-input__inner {
        color: #ffffff;
      }
    }
  }
}
</style>
