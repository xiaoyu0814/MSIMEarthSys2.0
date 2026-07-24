<template>
  <div id="measurePanel">
    <div class="header"><span>量算面板</span></div>
    <ul class="content_box">
      <li
        v-for="(item, index) in vueData.measureList"
        :key="index"
        @click="getToolItem(item, index)"
      >
        <img
          :src="getImage(
              item.position,
              item.selectType ? item.image_select : item.image
            )"
        />
        <p>{{ item.label }}</p>
      </li>
    </ul>
    <div id="sectionChars" class="infoview sectionChars">
      <header>
        <span>剖面分析图</span>
      </header>
      <div
        id="echartsView1"
        style="width: 100%; height: calc(100% - 20px)"
      ></div>
    </div>
    <div v-if="vueData.distanceBox" class="distanceBox">
      <el-tabs v-model="vueData.tabsName" @tab-click="changeTabs">
        <el-tab-pane label="绘制" name="first">
          <div style="padding: 20px">
            <el-button type="primary" size="small" @click="distance_fn"
              >绘制</el-button
            >
          </div>
        </el-tab-pane>
        <el-tab-pane label="自定" name="second">
          <div style="padding: 10px">
            <ul style="margin: 0; padding: 0">
              <li style="text-align: left">起始</li>
              <li style="font-size: 12px; color: #cccccc">
                <span style="padding-right: 5px">经度:</span>
                <el-input
                  v-model.number="vueData.startLon"
                  size="small"
                  style="width: 80px"
                ></el-input>
                <span style="padding: 0 5px">纬度:</span>
                <el-input
                  v-model.number="vueData.startLat"
                  size="small"
                  style="width: 80px"
                ></el-input>
              </li>
            </ul>
            <ul style="margin: 0; padding: 0">
              <li style="text-align: left">结束</li>
              <li style="font-size: 12px; color: #cccccc">
                <span style="padding-right: 5px">经度:</span>
                <el-input
                  v-model.number="vueData.endLon"
                  size="small"
                  style="width: 80px"
                ></el-input>
                <span style="padding: 0 5px">纬度:</span>
                <el-input
                  v-model.number="vueData.endLat"
                  size="small"
                  style="width: 80px"
                ></el-input>
              </li>
            </ul>
            <div>
              <span>结果：</span>
              <span>{{ vueData.distanceJG }}km</span>
            </div>
            <div style="text-align: center">
              <el-button type="primary" size="small" @click="distance_fn"
                >计算</el-button
              >
            </div>
          </div>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, toRaw } from 'vue'
import * as echarts from 'echarts'
import Measure from '@/utils/measurement/cesium-measure.js'
import MeasureAngle from '@/utils/measurement/MeasureAngle.js'
import Sightline from '@/utils/measurement/Sightline.js'
import ProfileAnalystTool from '@/utils/measurement/ProfileAnalystTool.js'
import SlopeAspect_js from '@/utils/measurement/SlopeAspect.js'
import Buffer from '@/utils/measurement/Buffer.js'
import MeasureHeight from '@/utils/measurement/MeasureHeight.js'
import ViewAreaAnalysis from '@/utils/measurement/viewAreaAnalysis.js'
import { ElMessage, ElMessageBox, ElLoading } from "element-plus";

const measure = new Measure(window.EarthViewer)
const measureAngle = new MeasureAngle(window.EarthViewer)
const analysisVisible = new Sightline(window.EarthViewer)
const measureHeight = new MeasureHeight(window.EarthViewer)
let _ProfileAnalystTool = null
const _SlopeAspect = new SlopeAspect_js({
  viewer: window.EarthViewer,
  point: {
    pixelSize: 9,
    color: MSIMEarth.Color.RED.withAlpha(0.5)
  },
  arrow: {
    scale: 0.3,
    width: 15,
    color: MSIMEarth.Color.YELLOW
  }
})
// const _Slope = new EarthAnalysis.SlopeAnalysis(window.EarthViewer);
const _Buffer = new Buffer(window.EarthViewer)
const _ViewAreaAnalysis = new ViewAreaAnalysis(window.EarthViewer)

let drawLineStatus = null

let drawAreaStatus = null

let drawBufferStatus = null

const vueData = reactive({
  measureList: [
    {
      label: '距离',
      image: '1.png',
      image_select: '1_select.png',
      position: 'measure',
      selectType: false,
      tooltip: false,
      show: true,
      id: 0
    },
    {
      label: '面积',
      image: '2.png',
      image_select: '2_select.png',
      position: 'measure',
      selectType: false,
      tooltip: false,
      show: true,
      id: 1
    },
    {
      label: '高度',
      image: '4.png',
      image_select: '4_select.png',
      position: 'measure',
      selectType: false,
      tooltip: false,
      show: true,
      id: 3
    },
    {
      label: '方位角',
      image: '3.png',
      image_select: '3_select.png',
      position: 'measure',
      selectType: false,
      tooltip: false,
      show: true,
      id: 2
    },
    {
      label: '坡度坡向',
      image: '4.png',
      image_select: '4_select.png',
      position: 'measure',
      selectType: false,
      tooltip: false,
      show: true,
      id: 3
    },
    {
      label: '剖面分析',
      image: '6.png',
      image_select: '6_select.png',
      position: 'measure',
      selectType: false,
      tooltip: false,
      show: true,
      id: 5
    },
    {
      label: '通视分析',
      image: '5.png',
      image_select: '5_select.png',
      position: 'measure',
      selectType: false,
      tooltip: false,
      show: true,
      id: 4
    },
    // {
    //   label: '地形坡地',
    //   image: '7.png',
    //   image_select: '7_select.png',
    //   position: 'measure',
    //   selectType: false,
    //   tooltip: false,
    //   show: true,
    //   id: 6
    // },
    {
      label: '可视域分析',
      image: '8.png',
      image_select: '8_select.png',
      position: 'measure',
      selectType: false,
      tooltip: false,
      show: true,
      id: 7
    },
    {
      label: '缓冲区分析',
      image: '9.png',
      image_select: '9_select.png',
      position: 'measure',
      selectType: false,
      tooltip: false,
      show: true,
      id: 8
    }
  ],
  select_index: null,
  tabsName: 'first',
  distanceBox: false,
  distanceJG: 0,
  startLon: '',
  startLat: '',
  endLon: '',
  endLat: ''
})

onMounted(() => {
  _ProfileAnalystTool = new ProfileAnalystTool(window.EarthViewer, echarts, {
    sectionChars: document.getElementById('sectionChars'),
    echartsView1: document.getElementById('echartsView1')
  })
})

const getToolItem = (item, index) => {
  if (vueData.select_index != index && vueData.select_index != null) {
    vueData.measureList[vueData.select_index].selectType = false
  }
  vueData.select_index = index
  item.selectType = !item.selectType
  clear()
  let temp = toRaw(item)
  if (item.label == '距离') {
    
  } else {
    vueData.distanceBox = false
  }
  switch (item.label) {
    case '距离':
      vueData.distanceBox = !vueData.distanceBox
      if (vueData.distanceBox == false) {
        distance(false)
        init_distanceData()
      }
      break
    case '面积':
      area(temp.selectType)
      break
    case '高度':
      height(temp.selectType)
      break
    case '方位角':
      angle(temp.selectType)
      break
    case '坡度坡向':
      if(EarthViewer.scene.terrainProvider._scheme){
        SlopeAspect(temp.selectType);
      } else {
        item.selectType = !item.selectType;
        ElMessage.error('请先加载地形');
      }
      break
    case '剖面分析':
      if(EarthViewer.scene.terrainProvider._scheme){
        ProfileAnalyst(temp.selectType);
      } else {
        item.selectType = !item.selectType;
        ElMessage.error('请先加载地形');
      }
      break
    case '通视分析':
      if(EarthViewer.scene.terrainProvider._scheme){
        if(window.EarthViewer.scene.mode == 3){
          analysisLine(temp.selectType);
        } else {
          item.selectType = !item.selectType;
          ElMessage.error('请先切换到3D模式');
        }
      } else {
        item.selectType = !item.selectType;
        ElMessage.error('请先加载地形');
      }
      break
    case '可视域分析':
      if(EarthViewer.scene.terrainProvider._scheme){
        if(window.EarthViewer.scene.mode == 3){
          viewAreaAnalysis(temp.selectType);
        } else {
          item.selectType = !item.selectType;
          ElMessage.error('请先切换到3D模式');
        }
      } else {
        item.selectType = !item.selectType;
        ElMessage.error('请先加载地形');
      }
      break
    case '缓冲区分析':
      buffer(temp.selectType)
      break
    default:
  }
}

const init_distanceData = () => {
  vueData.distanceJG = 0
  vueData.startLon = ''
  vueData.startLat = ''
  vueData.endLon = ''
  vueData.endLat = ''
}

const distance_fn = () => {
  clear()
  if (vueData.tabsName == 'first') {
    distance(true)
  } else {
    let geo_point1 = turf.point([vueData.startLon, vueData.startLat])
    let geo_point2 = turf.point([vueData.endLon, vueData.endLat])
    let options = { units: 'kilometers' }
    let distance = turf.distance(geo_point1, geo_point2, options).toFixed(2)
    vueData.distanceJG = distance
    addLineLayer([
      vueData.startLon,
      vueData.startLat,
      vueData.endLon,
      vueData.endLat
    ])
  }
}

const addLineLayer = (positions) => {
  vueData.linelayer = window.EarthViewer.entities.add({
    polyline: {
      positions: window.MSIMEarth.Cartesian3.fromDegreesArray(positions),
      material: window.MSIMEarth.Color.YELLOW,
      width: 3
    }
  })
}

const removeLineLayer = () => {
  if (vueData.linelayer) {
    window.EarthViewer.entities.remove(vueData.linelayer)
    vueData.linelayer = null
  }
}

const changeTabs = () => {
  init_distanceData()
  clear()
}

const buffer = (status) => {
  if (status) {
    var callback = (e, layer) => {
      _Buffer.add(layer)
      drawBufferStatus.status = true
    }
    drawBufferStatus = _Buffer.draw({ callback })
  } else {
    if (!drawBufferStatus.status) {
      drawBufferStatus._handlers.destroy()
      drawBufferStatus._handlers = null
    }
    _Buffer.clear()
  }
}

const viewAreaAnalysis = (status) => {
  if (status) {
    _ViewAreaAnalysis.activate()
  } else {
    _ViewAreaAnalysis.clear()
  }
}

const ProfileAnalyst = (status) => {
  if (status) {
    _ProfileAnalystTool.setEnable(true)
  } else {
    _ProfileAnalystTool.setEnable(false)
  }
}

const analysisLine = (status) => {
  if (status) {
    analysisVisible.draw()
    // vueData.analysisVisible.addPoint();
  } else {
    analysisVisible.clear()
  }
}

const height = (status) => {
  if (status) {
    measureHeight.activate()
  } else {
    measureHeight.deactivate()
  }
}

const viewshed = (status) => {
  if (status) {
    viewshedAnalysis.activate()
  } else {
    viewshedAnalysis.deactivate()
  }
}

const SlopeAspect = (status) => {
  if (status) {
    _SlopeAspect.draw({ clampToGround: true })
  } else {
    _SlopeAspect.clear()
  }
}

/**
 * @description 方位角测量
 */
const angle = (status) => {
  if (status) {
    measureAngle.activate()
  } else {
    measureAngle.deactivate()
  }
}

/**
 * @description 地表面积
 * @return {*}
 */
const area = (status) => {
  if (status) {
    let clampToGround = true // 创建一个变量 clampToGround，并将其初始化为 true
    drawAreaStatus = measure.drawAreaMeasureGraphics({
      clampToGround: clampToGround, // 将 clampToGround 赋值给 drawAreaMeasureGraphics 函数的 clampToGround 参数
      callback: function (e) {
        // console.log(this)
        // var polygon = turf.polygon([getLonlat(e)]);
        // var area = turf.area(polygon);
        // let f = measure.getPositionsArea(e) // 调用 measure 对象的 getPositionsArea 方法，将返回值赋给变量 f
        // setTimeout(function () {
        //   // console.log('总面积' + area) // 弹出提示框，显示 '总面积' + f
        // }, 1000)
        drawAreaStatus.status = true
      }
    })
  } else {
    if (!drawAreaStatus.status) {
      drawAreaStatus._handler.destroy()
      drawAreaStatus._handler = null
    }
  }
}

/**
 * @description 地表距离
 */
const distance = (status) => {
  if (status) {
    // 创建度量对象，并设置是否将度量图形约束到地面上
    drawLineStatus = measure.drawLineMeasureGraphics({
      clampToGround: true,
      callback: (e) => {
        // 获取度量位置的距离
        let f = measure.getPositionDistance(e)
        // 延迟1秒弹出警告框显示具体距离
        setTimeout(() => {
          console.log('总距离' + f)
        }, 1000)
        drawLineStatus.status = true
      }
    })
  } else {
    if (drawLineStatus) {
      if (!drawLineStatus.status) {
        drawLineStatus._handlers.destroy()
        drawLineStatus._handlers = null
      }
    }
  }
}

/**
 * @description 清空绘图层中的所有实体
 */
const clear = () => {
  measure._drawLayer.entities.removeAll()
  _Buffer._drawLayer.entities.removeAll()
  _SlopeAspect._drawLayer.entities.removeAll()
  _SlopeAspect.clear()
  measureAngle.deactivate()
  analysisVisible.clear()
  measureHeight.deactivate()
  _ViewAreaAnalysis.clear()
  _ProfileAnalystTool.setEnable(false)
  _Buffer.clear()
  removeLineLayer()
}

/**
 * @description html渲染vueData图片数据
 * @param { String } position 图片路径
 * @param { String } image 图片名称
 * @return base64
 */
let getImage = (position, image) => {
  return require('@/assets/image/rightNavbar/measure/' + image)
};
</script>

<style lang="less" scoped>
#measurePanel {
  position: absolute;
  right: 90px;
  top: 20%;
  width: 270px;
  // height: 350px;
  // background-color: #0c192a67;
  // background-color: rgba(2, 26, 70, 0.88);
  // box-shadow: 0 0 25px #1092d5;
  // font-size: 16px;
  // font-weight: bold;
  // color: #ffffff;
  border: 1px solid rgba(53, 177, 253, 0.8);
  background-color: rgba(0, 11, 26, 0.9);
  color: #ffffff;
  z-index: 1;

  .header {
    padding: 10px;
    border-bottom: 1px solid #0b3855;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .content_box {
    list-style: none;
    display: grid;
    grid-template-columns: repeat(3, 33.33333%);
    margin: auto;
    justify-items: center;
    align-items: center;
    height: calc(100% - 44px);
    padding: 0;

    li {
      margin-top: 15px;
      cursor: pointer;
      display: flex;
      flex-direction: column;
      align-items: center;
      width: 100%;

      p {
        font-size: 16px;
        font-family: MicrosoftYaHei;
      }
    }
  }

  #sectionChars {
    position: absolute;
    right: -1px;
    bottom: -260px;
    width: 500px;
    height: 250px;
    border: 1px solid rgba(53, 177, 253, 0.8);
    background-color: rgba(0, 11, 26, 0.9);
    color: #ffffff;
    z-index: 1;
    padding: 1px 10px 4px 10px;
    display: none;
  }

  .distanceBox {
    position: absolute;
    right: -1px;
    top: 424px;
    width: 270px;
    // height: 250px;
    border: 1px solid rgba(53, 177, 253, 0.8);
    background-color: rgba(0, 11, 26, 0.9);
    color: #ffffff;
    z-index: 1;
  }

  :deep(.el-tabs__header .el-tabs__item) {
    color: white;
    padding: 0 20px;
  }
}
</style>
