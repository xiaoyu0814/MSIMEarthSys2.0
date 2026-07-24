<template>
  <div>
    <el-pagination
      v-model:current-page="currentPage"
      :page-size="pageSize"
      :small="small"
      :background="background"
      layout="total, prev, pager, next"
      :pager-count="pagerCount"
      :total="total"
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :page-sizes="pageSizes"
    />
  </div>
</template>
<script setup>
import { ref, watch, toRefs } from 'vue'
const emit = defineEmits(['handleSizeChange', 'handleCurrentChange'])
const props = defineProps({
  //是否为小型分页器
  small: {
    type: Boolean,
    default: true
  },
  //每页显示数据量
  pageSize: {
    type: Number,
    default: 10
  },
  //当前页码
  currentPage: {
    type: Number,
    default: 1
  },
  //页码总数
  total: {
    type: Number,
    default: 100
  },
  //是否显示页码背景
  background: {
    type: Boolean,
    default: true
  },
  //显示页码数
  pagerCount: {
    type: Number,
    default: 5
  },
  //设置每页最大显示条数
  pageSizes: {
    type: Array,
    default: [10, 20, 50, 100]
  }
})

// 解构props并转为响应式
const {
  currentPage: propCurrentPage,
  pageSize,
  small,
  background,
  pagerCount,
  total,
  pageSizes
} = toRefs(props)

// 内部响应式数据
const currentPage = ref(propCurrentPage.value)

// 监听外部currentPage变化
watch(propCurrentPage, (newVal) => {
  currentPage.value = newVal
})

const handleSizeChange = (number) => {
  emit('handleSizeChange', number)
}
const handleCurrentChange = (number) => {
  emit('handleCurrentChange', number)
}
</script>

<style lang="less" scoped>
::v-deep(.el-pagination__total) {
  color: #ffffff;
}
::v-deep(.el-pagination.is-background .btn-next),
::v-deep(.el-pagination.is-background .btn-prev),
::v-deep(.el-pagination.is-background .el-pager li) {
  margin: 0 4px !important;
  background-color: #303030 !important;
  color: #ffffff;
}
::v-deep(.el-pagination.is-background .btn-next.is-active),
::v-deep(.el-pagination.is-background .btn-prev.is-active),
::v-deep(.el-pagination.is-background .el-pager li.is-active) {
  background-color: #409eff !important;
  color: #ffffff;
}
</style>
