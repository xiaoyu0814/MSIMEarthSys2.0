<template>
  <div class="weather_config">
    <el-form ref="weatherForm" :model="vueData.QX" label-width="100px">
      <el-form-item label="计划名称:" prop="rainRate">
        <el-input v-model="vueData.QX.planName" placeholder="" />
      </el-form-item>
      <el-form-item label="陆地覆盖:" prop="landCover">
        <el-select v-model="vueData.QX.landCover" placeholder="">
          <el-option
            v-for="item in vueData.landCoverList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="地形:" prop="landFormation">
        <el-select v-model="vueData.QX.landFormation" placeholder="">
          <el-option
            v-for="item in vueData.landFormationList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="海况等级:" prop="seaState">
        <el-select v-model="vueData.QX.seaState" placeholder="">
          <el-option
            v-for="item in vueData.seaStateList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="降雨量:" prop="rainRate">
        <el-input v-model="vueData.QX.rainRate" placeholder="" />
      </el-form-item>
      <el-form-item label="云雨密度:" prop="cloudWaterDensity">
        <el-input v-model="vueData.QX.cloudWaterDensity" placeholder="" />
      </el-form-item>
      <el-form-item label="云底高:" prop="rainAltitudeLimit">
        <el-input v-model="vueData.QX.rainAltitudeLimit" placeholder="" />
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { reactive, onMounted, watch, ref } from 'vue'
import emitter from '@/utils/eventbus'
import store from '@/store/index'

const emit = defineEmits(['sendEnvironmentData'])

const weatherForm = ref()
const vueData = reactive({
  landCoverList: [
    { id: '0', name: '普通', value: 'general' },
    { id: '1', name: '城市', value: 'urban' },
    { id: '2', name: '农业', value: 'agricultural' },
    { id: '3', name: '草地牧场', value: 'rangeland_herbaceous' },
    { id: '4', name: '灌木牧场', value: 'rangeland_shrub' },
    { id: '5', name: '落叶林', value: 'forest_deciduous' },
    { id: '6', name: '针叶林', value: 'forest_coniferous' },
    { id: '7', name: '混合森林', value: 'forest_mixed' },
    { id: '8', name: '森林完全砍伐', value: 'forest_clear_cut' },
    { id: '9', name: '森林局部砍伐', value: 'forest_block_cut' },
    { id: '10', name: '森林湿地', value: 'wetland_forested' },
    { id: '11', name: '非森林湿地', value: 'wetland_non_forested' }
  ],
  landFormationList: [
    { id: '1', name: '平地', value: 'level' },
    { id: '2', name: '倾斜', value: 'inclined' },
    { id: '3', name: '起伏', value: 'undulating' },
    { id: '4', name: '山丘', value: 'rolling' },
    { id: '5', name: '丘陵', value: 'hummocky' },
    { id: '6', name: '脊状凸起', value: 'ridged' },
    { id: '7', name: '陡峭', value: 'moderately_steep' },
    { id: '8', name: '陡峭的山脉', value: 'steep' },
    { id: '9', name: '不规则、崎岖和多变的地势', value: 'broken' }
  ],
  seaStateList: [
    { id: '0', name: '0' },
    { id: '1', name: '0 - 0.10' },
    { id: '2', name: '0.10 - 0.50' },
    { id: '3', name: '0.50 - 1.25' },
    { id: '4', name: '1.25 - 2.50' },
    { id: '5', name: '2.50 - 4.00' },
    { id: '6', name: '4.00 - 6.00' }
  ],
  QX: {
    planName: '',
    landCover: '',
    landFormation: '',
    seaState: '',
    rainRate: '',
    cloudWaterDensity: '',
    rainAltitudeLimit: ''
  },
  rules: {
    landCover: [
      {
        required: true,
        message: '请选择陆地覆盖',
        trigger: 'change'
      }
    ],
    landFormation: [
      {
        required: true,
        message: '请选择地形',
        trigger: 'change'
      }
    ],
    seaState: [
      {
        required: true,
        message: '请选择海况等级',
        trigger: 'change'
      }
    ],
    rainRate: [{ required: true, message: '请输入降雨量', trigger: 'blur' }],
    cloudWaterDensity: [
      { required: true, message: '请输入云雨密度', trigger: 'blur' }
    ],
    rainAltitudeLimit: [
      { required: true, message: '请输入降雨高度限制', trigger: 'blur' }
    ]
  }
})
watch(
  () => store.state.sceneModule.planDetail,
  (newVal, oldVal) => {
    if (newVal) {
      if (newVal.type == 'changeWeatherAfsimPlan') {
        vueData.QX = newVal.content
      }
    }
  },
  { immediate: true, deep: true }
)
onMounted(() => {
  emitter.on('getEnvironmentData', async (val) => {
    if (val == '气象') {
      // weatherForm.value.validate((valid) => {
      //   if (valid) {
      emit('sendEnvironmentData', vueData.QX)
      // }
      // })
    }
  })
})
</script>
<style lang="less" scoped>
.weather_config {
  :deep(.el-form-item__label) {
    color: #fff !important;
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
  :deep(.el-select__placeholder) {
    color: #fff;
  }
}
</style>
