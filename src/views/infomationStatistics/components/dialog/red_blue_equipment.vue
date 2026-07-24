<!--
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2025-07-21 15:35:57
 * @LastEditors: 谢小宇 xiexiaoyu@piesat.cn
 * @LastEditTime: 2025-07-29 13:50:05
 * @FilePath: \gfdx\src\views\infomationStatistics\components\dialog\red_blue_equipment.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div id="equipment">
    <div>
      <span>平台装备</span>
      <el-select
        v-model="state.planformName"
        clearable
        @change="changePlatform"
      >
        <el-option
          v-for="(item, index) in state.planformList"
          :key="index"
          :label="item.name"
          :value="item.id"
        />
      </el-select>
    </div>
    <el-descriptions border>
      <el-descriptions-item label="Username">kooriookami</el-descriptions-item>
      <el-descriptions-item label="Telephone">18100000000</el-descriptions-item>
      <el-descriptions-item label="Place">Suzhou</el-descriptions-item>
      <el-descriptions-item label="Remarks"> School </el-descriptions-item>
      <el-descriptions-item label="Address">
        No.1188, Wuzhong Avenue, Wuzhong District, Suzhou, Jiangsu Province
      </el-descriptions-item>
    </el-descriptions>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import {
  getPlatformState,
  getPlatformWeapons,
  getPlatformParts
} from '@/service/afsim/index'
import { ElMessage } from 'element-plus'

const props = defineProps({
  type: {
    type: String,
    default: ''
  },
  dataList: {
    type: Object,
    default: {
      red: [],
      blue: []
    }
  }
})

const state = reactive({
  planformName: '',
  planformList: [],
  info: {},
  weapon: {},
  part: {}
})

const changePlatform = () => {
  let params = { platform: platform_name }
  getPlatformState(params).then((res) => {
    if (res.status == 'success') {
    } else {
      ElMessage.error('')
    }
  })
  getPlatformWeapons(params).then((res) => {
    if (res.status == 'success') {
    } else {
      ElMessage.error('')
    }
  })
  getPlatformParts(params).then((res) => {
    if (res.status == 'success') {
    } else {
      ElMessage.error('')
    }
  })
}

onMounted(() => {
  if (props.type == '红方') {
    state.planformList = props.dataList.red
  } else {
    state.planformList = props.dataList.blue
  }
})
</script>

<style lang="less" scoped>
#equipment {
  :deep(.el-descriptions__label.el-descriptions__cell.is-bordered-label) {
    background-color: transparent;
    color: #ffffff;
  }

  :deep(.el-descriptions__body) {
    background-color: transparent;
  }

  :deep(.el-descriptions__content.el-descriptions__cell.is-bordered-content) {
    color: #a9fffc;
  }
}
</style>
