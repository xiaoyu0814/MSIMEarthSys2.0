<template>
  <div>
    <div class="top-bar">
      <span class="top-left"></span>
      <div class="top-right" v-if="props.tableEdit">
        <!-- <img
          src="@/assets/images/hjxx/top-icon1.svg"
          @click="draw('draw_circle')"
        /> -->
        <img
          src="@/assets/images/hjxx/top-icon2.svg"
          title="绘制矩形"
          @click="draw('draw_rect')"
        />
        <img
          src="@/assets/images/hjxx/top-icon3.svg"
          title="绘制多边形"
          @click="draw('draw_polygon')"
        />
      </div>
    </div>
    <tables
      :groupData="vueData.tableData"
      :groupDataHeader="vueData.tableHeader"
      :tableEdit="props.tableEdit"
    ></tables>
  </div>
</template>
<script setup>
import { reactive, onMounted, ref, onBeforeMount } from 'vue'
import tables from './table.vue'
const emit = defineEmits(['getTableData'])
import plot from './initPlot/initConfig'
const props = defineProps({
  tableEdit: {
    type: Boolean,
    default: false
  }
})
let vueData = reactive({
  tableData: [
    {
      lng: '116.397477',
      lat: '39.908692'
    },
    {
      lng: '116.397477',
      lat: '39.908692'
    },
    {
      lng: '116.397477',
      lat: '39.908692'
    },
    {
      lng: '116.397477',
      lat: '39.908692'
    }
  ],
  tableHeader: [
    {
      prop: 'lng',
      label: '经度'
    },
    {
      prop: 'lat',
      label: '纬度'
    }
  ],
  earthDraw: ''
})

/**
 * @description 绘制方法
 * @param {*} modeType 绘制类型
 * @return {*}
 */
const draw = (modeType) => {
  if (modeType == 'draw_rect') {
    vueData.earthDraw.drawRect(getPositionList)
  } else if (modeType == 'draw_polygon') {
    vueData.earthDraw.drawPolygon(getPositionList)
  }
}
const getPositionList = (value) => {
  if (value.feature.vertexs) {
    vueData.tableData = value.feature.vertexs
  }
}
onMounted(() => {
  vueData.earthDraw = new plot(EarthViewer)
})
onBeforeMount(() => {})
</script>
<style lang="less" scoped>
.top-bar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 10px;

  .top-left {
    font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
    font-weight: 700;
    font-style: normal;
    color: #ffffff;
  }

  .top-right {
    width: 30%;
    display: flex;
    justify-content: space-around;
    align-items: center;
  }
}
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
</style>
