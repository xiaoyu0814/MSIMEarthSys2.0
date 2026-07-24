<template>
  <div class="routePlanning">
    <el-divider content-position="left">{{ props.item.title }}</el-divider>
    <div class="routePlanning-content">
      <div class="routePlanning-select">
        <span class="item-span">{{ vueData.selectLabel }}:</span>
        <el-select v-model="vueData.optionItem" placeholder="">
          <el-option
            v-for="item in vueData.options"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
      </div>
      <el-divider />

      <div class="routePlanning-input">
        <el-form :model="vueData.form" label-width="120px">
          <el-form-item label="宽度:">
            <el-input-number
              v-model="vueData.form.num"
              :min="1"
              :max="10"
              controls-position="right"
              @change="changeLineWidth"
            />
          </el-form-item>
          <el-form-item label="颜色:">
            <el-color-picker
              v-model="vueData.form.color1"
              @change="changeLineColor"
            />
          </el-form-item>
        </el-form>
      </div>
      <el-table
        :data="vueData.tableData"
        show-overflow-tooltip
        border
        style="width: 100%"
        height="400px"
        :row-class-name="rowStyle"
        :header-cell-style="{
          background: '#2b4559',
          color: ' #FFFFFF'
        }"
      >
        <el-table-column type="index" width="40" align="center" />
        <el-table-column label="经度" width="100" align="center">
          <template #default="scope">
            <span>
              <el-input
                v-model="scope.row.position.x"
                @change="changeLinePoint(scope.row, scope.$index)"
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="纬度" width="100" align="center">
          <template #default="scope">
            <span>
              <el-input
                v-model="scope.row.position.y"
                @change="changeLinePoint(scope.row, scope.$index)"
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="高度" width="100" align="center">
          <template #default="scope">
            <span>
              <el-input
                v-model="scope.row.position.z"
                @change="changeLinePoint(scope.row, scope.$index)"
              />
            </span>
          </template>
        </el-table-column>
        <el-table-column
          v-for="(item, index) in vueData.tableHeader"
          :key="index"
          :label="item.label"
          :width="item.width"
          align="center"
        >
          <template #default="scope">
            <span>
              <el-input v-model="scope.row[item.prop]" />
            </span>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center" width="140" fixed="right">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              link
              @click="getMapPoint(scope.$index, scope.row)"
            >
              选点
            </el-button>
            <el-button
              size="small"
              type="primary"
              link
              @click="insert(scope.$index, scope.row)"
            >
              插入
            </el-button>
            <el-button
              size="small"
              type="danger"
              link
              @click="remove(scope.$index, scope.row)"
            >
              删除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <div class="tx-btn" @click="draw">
        <span>添加位置</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, onUnmounted, watch } from 'vue'
import store from '@/store/index.js'
import { BLConfigData } from './BLConfigjason'
// import map from "@/utils/map/map.js";

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

const vueData = reactive({
  BLConfigData,
  tableHeader: [],
  tableData: [],
  options: [
    {
      value: '1',
      label: '方案1'
    }
  ],
  optionItems: '1',
  selectLabel: '',
  form: {
    num: 1,
    color1: '#E74D4D'
  },
  selectPointData: null,
  selectPointIndex: -1
})

onMounted(() => {})

onUnmounted(() => {})

/**
 * @description 改变航线宽度
 * @param { Number } value 航线宽度值
 */
const changeLineWidth = (value) => {
  props.node.layer.plotLineLayer.updateWidth(value)
}

/**
 * @description 改变航线颜色
 * @param { String } color 航线颜色值
 */
const changeLineColor = (color) => {
  props.node.layer.plotLineLayer.updateColor(color)
}

/**
 * @description 获取点击出经纬度
 * @param { Number } index 航线点索引值
 * @param { Object } row 航线点数据
 */
const getMapPoint = (index, row) => {
  vueData.selectPointData = row
  vueData.selectPointIndex = index
  map.drawLayer('draw_point', getLayer)
}

/**
 * @description 插入
 * @param {*} index
 * @param {*} row
 * @return {*}
 */
const insert = (index, row) => {
  let temp = {
    position: {
      x: 0,
      y: 0,
      z: 0
    },
    stamp: 0,
    speed: 0
  }
  props.node.navPath.NavPointlist.splice(index + 1, 0, temp)
}

/**
 * @description 删除航线点
 * @param { Number } index 航线点索引值
 * @param { Object } row 航线点数据
 */
const remove = (index, row) => {
  props.node.layer.plotLineLayer.removePosition(index)
}

let draw = () => {
  map.drawLayer('draw_line', getLayer)
}

let getLayer = (feature) => {
  if (feature.type == 'line') {
    let pointList = []
    for (let i = 0; i < feature.vertexs.length; i++) {
      const element = feature.vertexs[i]
      let temp = {
        position: {
          x: element[0],
          y: element[1],
          z: element[2]
        },
        stamp: 0,
        speed: 0
      }
      pointList.push(temp)
    }
    props.node.navPath.setNavPointList(pointList)
    vueData.tableData = props.node.navPath.NavPointlist
    props.node.layer.plotLineLayer.updateData(props.node.navPath)
  } else if (feature.type == 'point') {
    let newPoint = feature.vertexs[0]
    vueData.selectPointData.position.x = newPoint[0]
    vueData.selectPointData.position.y = newPoint[1]
    vueData.selectPointData.position.z = newPoint[2]
    props.node.layer.plotLineLayer.updatePosition(
      vueData.selectPointData,
      vueData.selectPointIndex
    )
  }
  earthDraw.clearFeatures()
  map.drawLayer(true, null)
}

let changeLinePoint = (row, index) => {
  props.node.layer.plotLineLayer.updatePosition(row, index)
}

const rowStyle = ({ row, rowIndex }) => {
  if (rowIndex % 2 == 1) return 'cellStyle'
  else return 'cellStyle1'
}

watch(
  [() => props.item.name, () => props.node],
  ([name, node]) => {
    vueData.selectLabel = BLConfigData[props.item.name].selectLabel
    vueData.options = BLConfigData[props.item.name].option
    vueData.tableHeader = BLConfigData[props.item.name].tableHeader
    // vueData.tableData = BLConfigData[props.item.name].tableData;
    // if (node) {
    console.log(props.node.navPath)
    vueData.tableData = props.node.navPath.NavPointlist
    vueData.form.num = props.node.navPath.num ? props.node.navPath.num : 1
    // vueData.form.color1 = PIESIM.SideTOColor(props.node.side);
    let cesiumColor =
      props.node.layer.plotLineLayer.entity.polyline.material.color.getValue()
    let color = cesiumColor.toCssColorString()
    vueData.form.color1 = color
    // }
  },
  { immediate: true }
)
</script>

<style lang="less" scoped>
.routePlanning {
  .el-divider {
    border-top: 1px solid #0b3855;
    margin: 15px 0;

    :deep(.el-divider__text) {
      background-color: transparent !important;
      font-family: "Arial Negreta", "Arial Normal", "Arial";
      font-weight: 700;
      font-style: normal;
      font-size: 16px;
      color: #c2d7ee;
      left: 0 !important;
    }
  }

  :deep(
      .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell
    ) {
    background-color: #40a0ff3d !important;
  }

  .routePlanning-content {
    padding: 10px;
    width: calc(100% - 60px);
    :deep(.el-table) {
      --el-table-border-color: #075d89 !important;
      --el-table-text-color: #ffffff;

      width: 100%;

      .el-table__header-wrapper table,
      // .el-table__body-wrapper table {
      //   width: 100% !important;
      // }

      .el-table__body,
      .el-table__footer,
      .el-table__header {
        table-layout: auto;
      }

      .cellStyle {
        background-color: #2b4559 !important;
        font-family: "Arial Normal", "Arial";
        font-weight: 400;
        font-style: normal;
        font-size: 13px;
        letter-spacing: normal;
      }

      .cellStyle1 {
        background-color: #1c2f42 !important;
        font-family: "Arial Normal", "Arial";
        font-weight: 400;
        font-style: normal;
        font-size: 13px;
        letter-spacing: normal;
      }
    }

    .tx-btn {
      background-image: url(@/assets/images/rwty/tx-btn.svg);
      width: 178px;
      height: 33px;
      margin: auto;
      margin-top: 20px;
      display: flex;
      justify-content: center;
      align-items: center;
      cursor: pointer;
      span {
        display: inline-block;
        color: #ffffff;
        padding-left: 10px;
      }
    }

    .routePlanning-select {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 15px;
    }

    .item-span {
      display: inline-block;
      text-align: left;
      color: #ffffff;
      font-size: 16px;
      width: 110px;
    }

    .el-select {
      width: 100%;

      :deep(.el-input__wrapper) {
        background-color: #2b4559 !important;
        box-shadow: 0 0 0 1px #075d89 inset !important;

        .el-input__inner {
          color: #ffffff;
        }
      }
    }

    .routePlanning-input {
      padding-bottom: 15px;
    }

    :deep(.el-input__wrapper) {
      background-color: #2b4559 !important;
      box-shadow: 0 0 0 1px #075d89 inset;

      .el-input__inner {
        color: #ffffff;
      }
    }

    :deep(.el-input-number__increase) {
      background: #2b4559 !important;
      border-left: #075d89 !important;
    }

    :deep(.el-input-number.is-controls-right .el-input-number__decrease) {
      border-left: #075d89 !important;
      border-radius: 0 0 #075d89 0 !important;
    }

    :deep(.el-input-number.is-controls-right .el-input-number__increase) {
      border-radius: 0 #075d89 0 0 !important;
      border-bottom: #075d89 !important;
    }

    :deep(.el-input-number__decrease) {
      background: #2b4559 !important;
    }

    :deep(.el-form-item__label) {
      color: #ffff;
    }

    :deep(
        .el-color-picker:hover:not(.is-disabled, .is-focused)
          .el-color-picker__trigger
      ) {
      border-color: #075d89;
    }

    :deep(.el-color-picker__trigger) {
      border: 1px solid #075d89;
    }
  }
}
</style>
