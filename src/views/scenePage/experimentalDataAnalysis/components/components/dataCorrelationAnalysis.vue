<template>
  <div id="dataCorrelationAnalysis">
    <ul class="searthBox">
      <li>
        <span>关联数据：</span>
        <el-select
          v-model="state.associatedData"
          placeholder="请选择"
          multiple
          collapse-tags
          collapse-tags-tooltip
        >
          <el-option
            v-for="(item, index) in state.associatedDataList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </li>
      <li>
        <span>关联分析类型：</span>
        <el-select v-model="state.associationAnalysisType" placeholder="请选择">
          <el-option
            v-for="(item, index) in state.associationAnalysisTypeList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </li>
      <li>
        <span>关联分析方法：</span>
        <el-select
          v-model="state.relationalAnalysisMethod"
          placeholder="请选择"
        >
          <el-option
            v-for="(item, index) in state.relationalAnalysisMethodList"
            :key="index"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </li>
      <li>
        <el-button type="primary">分析</el-button>
      </li>
      <li>
        <el-button type="primary">重置</el-button>
      </li>
    </ul>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const state = reactive({
  associatedData: '',
  associatedDataList: [
    { label: '场景想定数据', value: '0' },
    { label: '任务规划数据', value: '1' },
    { label: '仿真过程数据', value: '2' },
    { label: '态势推演数据', value: '3' },
    { label: '裁决分析数据', value: '4' },
    { label: '导调评估数据', value: '5' }
  ],
  associationAnalysisType: '',
  associationAnalysisTypeList: [
    { label: '作战装备与战场环境关联性分析', value: '0' },
    { label: '作战装备攻防关系关联性分析', value: '1' },
    { label: '无人作战装备关联性分析', value: '2' },
    { label: '无人作战装备系统及支援体系关联性分析', value: '3' }
  ],
  relationalAnalysisMethod: '',
  relationalAnalysisMethodList: [
    { label: '体系贡献率分析', value: '0' },
    { label: '体系能力依赖分析', value: '1' }
  ]
})
</script>

<style lang="less" scoped>
#dataCorrelationAnalysis {
  .searthBox {
    display: flex;
    align-items: center;
    li {
      padding: 20px;
      padding-left: 0;
    }
  }

  :deep(.el-input__wrapper) {
    background-color: transparent;
    box-shadow: 0 0 0 1px #81d3f8 inset;
    .el-input__inner {
      color: #ffffff;
    }
  }
}
</style>
