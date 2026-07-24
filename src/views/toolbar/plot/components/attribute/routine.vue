<template>
  <div id="routine">
    <div class="info">
      <h3>信息</h3>
      <div class="content">
        <img :src="vueData.selectPlot ? vueData.selectPlot.img : ''" alt="" />
        <ul>
          <li>
            <span>版本：</span>
            <span>2013版</span>
          </li>
          <li class="text">
            <span>名称：</span>
            <span>{{ vueData.selectPlot ? vueData.selectPlot.name : '' }}</span>
          </li>
          <li>
            <span>编码：</span>
            <span>{{ vueData.selectPlot ? vueData.selectPlot.code : '' }}</span>
          </li>
        </ul>
      </div>
    </div>
    <div>
      <h3>边线-毫米</h3>
      <ul>
        <li>
          <span>线宽：</span>
          <el-input-number
            v-model="plotBorder.width"
            :step="vueData.stepLineWidth"
            :min="0.001"
            :max="100"
            size="small"
            controls-position="right"
            @change="setInputNumberValue('plotBorder')"
          />
        </li>
        <li>
          <span>颜色：</span>
          <el-color-picker
            v-model="plotBorder.color"
            color-format="rgb"
            @change="setColorPickerValue('plotBorder')"
          />
          <span
            v-for="(item, index) in vueData.defaultColor"
            :key="index"
            :style="{ 'background-color': item.backgroundColor }"
            class="defaultColor"
            @click="setPlotBorderColor(item.backgroundColor)"
          ></span>
        </li>
        <li class="flex">
          <span style="margin-right: 5px">透明：</span>
          <el-slider
            style="width: 100px"
            v-model="plotBorder.opacity"
            :show-tooltip="false"
            @input="setColorPickerValue('plotBorder')"
          />
          <span style="margin-left: 20px">{{ plotBorder.opacity }}</span>
        </li>
      </ul>
    </div>
    <div v-if="vueData.plotType == 0">
      <h3>宽高-毫米</h3>
      <ul>
        <li>
          <span>
            <span>宽度：</span>
            <el-input-number
              v-model="plotWidhtHeight.width"
              :step="vueData.stepSize"
              :min="1"
              :max="1000"
              size="small"
              controls-position="right"
              @click="setInputNumberValue('plotWidhtHeight', 'width')"
            />
          </span>
        </li>
        <li>
          <span>
            <span>高度：</span>
            <el-input-number
              v-model="plotWidhtHeight.height"
              :step="vueData.stepSize"
              :min="1"
              :max="1000"
              size="small"
              controls-position="right"
              @click="setInputNumberValue('plotWidhtHeight', 'height')"
            />
          </span>
        </li>
        <li>
          <span>锁定原始高宽比：</span>
          <el-switch v-model="plotWidhtHeight.clock" />
        </li>
      </ul>
    </div>
    <div v-if="vueData.plotType == 0">
      <h3>旋转</h3>
      <ul>
        <li>
          <span>角度：</span>
          <el-input-number
            v-model="plotAngle.angle"
            :step="vueData.stepSize"
            :min="0"
            :max="359"
            size="small"
            controls-position="right"
            @click="setInputNumberValue('plotAngle')"
          />
        </li>
        <li>
          <span>
            <span>水平：</span>
            <span style="margin-right: 10px"
              ><el-switch
                v-model="plotAngle.isHorizontal"
                @change="setSwitchValue('plotAngle', 0)"
            /></span>
          </span>
          <span>
            <span>垂直：</span>
            <span
              ><el-switch
                v-model="plotAngle.isVertical"
                @change="setSwitchValue('plotAngle', 1)"
            /></span>
          </span>
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch } from 'vue'
import { useStore } from 'vuex'

const store = useStore()

const vueData = reactive({
  stepLineWidth: 0.01,
  stepSize: 1,
  stepLineWidth: 0.01,
  drawAttr: null,
  entity: null,
  selectPlot: null,
  plotType: 0,
  defaultColor: [
    {
      backgroundColor: 'rgba(255,0,0,255)',
      value: [255, 0, 0, 255]
    },
    {
      backgroundColor: 'rgba(0,0,255,255)',
      value: [0, 0, 255, 255]
    },
    {
      backgroundColor: 'rgba(0,255,0,255)',
      value: [0, 255, 0, 255]
    },
    {
      backgroundColor: 'rgba(255,255,0,255)',
      value: [255, 255, 0, 255]
    }
  ]
})

const plotBorder = reactive({
  width: 0,
  color: '',
  opacity: 0
})

const plotWidhtHeight = reactive({
  width: 0,
  height: 0,
  clock: true
})

const plotAngle = reactive({
  angle: 0,
  isHorizontal: false,
  isVertical: false
})

onMounted(() => {
  // vueData.drawAttr = store.getters.get_plotSelect.plot.getDrawAttr()
})

const rgbChangeArr = (rgbStr) => {
  return rgbStr.split(',').map((item) => Number(item.replace(/[^0-9]+/g, '')))
}

const setPlotBorderColor = (color) => {
  plotBorder.color = color
  setColorPickerValue('plotBorder')
}

const setInputNumberValue = (type, value) => {
  switch (type) {
    case 'plotBorder':
      vueData.drawAttr.setLineWidth(Number(plotBorder.width))
      break
    case 'plotWidhtHeight':
      const scale = vueData.drawAttr.getAspectRatio()
      console.log(scale)
      if (plotWidhtHeight.clock) {
        if (value == 'width') {
          plotWidhtHeight.width * scale
          plotWidhtHeight.height = plotWidhtHeight.width
        } else {
          plotWidhtHeight.height * scale
          plotWidhtHeight.width = plotWidhtHeight.height
        }
        vueData.drawAttr.setSymbolSize([
          Number(plotWidhtHeight.width),
          Number(plotWidhtHeight.height)
        ])
      } else {
        vueData.drawAttr.setSymbolSize([
          Number(plotWidhtHeight.width),
          Number(plotWidhtHeight.height)
        ])
      }
      break
    case 'plotAngle':
      vueData.drawAttr.setAngle(Number(plotAngle.angle))
      break
    default:
      break
  }
  vueData.entity.updatePlot()
}

const setColorPickerValue = (type) => {
  switch (type) {
    case 'plotBorder':
      let rgbArr = rgbChangeArr(plotBorder.color)
      let a = plotBorder.opacity
      rgbArr.push(a)
      vueData.drawAttr.setLineColor(rgbArr)
      break

    default:
      break
  }
  vueData.entity.updatePlot()
}

const setSwitchValue = (type, value) => {
  switch (type) {
    case 'plotWidhtHeight':
      break
    case 'plotAngle':
      if (value) {
        // 垂直
        if (plotAngle.isHorizontal) {
          console.log('垂直')
          vueData.drawAttr.getMirrorMode(1)
        } else {
          if (plotAngle.isVertical) {
            console.log('垂直，水平')
            vueData.drawAttr.getMirrorMode(3)
          } else {
            console.log('关闭')
            vueData.drawAttr.getMirrorMode(0)
          }
        }
      } else {
        // 水平
        if (plotAngle.isVertical) {
          console.log('水平')
          vueData.drawAttr.getMirrorMode(2)
        } else {
          if (plotAngle.isHorizontal) {
            console.log('垂直，水平')
            vueData.drawAttr.getMirrorMode(3)
          } else {
            console.log('关闭')
            vueData.drawAttr.getMirrorMode(0)
          }
        }
      }
      break
    default:
      break
  }
  vueData.entity.updatePlot()
}

const getPlotArrt = (entity) => {
  console.log(entity)
  vueData.entity = entity
  vueData.plotType = entity.plot.getSymbolType()
  let dataList = store.getters.get_plotLayerList
  vueData.selectPlot = dataList.find((u) => u.entity.id === entity.id)

  // 获取绘制属性对象
  vueData.drawAttr = entity.plot.getDrawAttr()

  // 线宽
  plotBorder.width = vueData.drawAttr.getLineWidth()

  // 颜色和透明度 rbga
  let temp = vueData.drawAttr.getLineColor()
  let color = `rgb(${temp.r},${temp.g},${temp.b})`
  let opacity = parseInt((temp.a / 255) * 100)
  plotBorder.color = color
  plotBorder.opacity = opacity

  if (vueData.plotType == 0) {
    // 大小 {cx：宽度，cy：高度}
    let symbolSize = vueData.drawAttr.getSymbolSize()
    plotWidhtHeight.width = symbolSize.cx
    plotWidhtHeight.height = symbolSize.cy

    // 镜像 0：不镜像；1：水平镜像；2：垂直镜像；3：水平垂直镜像
    let mirrorMode = vueData.drawAttr.getMirrorMode()
    if (mirrorMode == 1) {
      plotAngle.isHorizontal = true
      plotAngle.isVertical = false
    } else if (mirrorMode == 2) {
      plotAngle.isHorizontal = false
      plotAngle.isVertical = true
    } else if (mirrorMode == 3) {
      plotAngle.isHorizontal = true
      plotAngle.isVertical = true
    } else {
      plotAngle.isHorizontal = false
      plotAngle.isVertical = false
    }
  }
}

watch(
  () => store.getters.get_plotSelect,
  (nVal) => {
    if (!nVal) return
    getPlotArrt(nVal)
  },
  { immediate: true }
)
</script>

<style lang="less" scoped>
#routine {
  h3 {
    margin: 5px 0;
  }
  ul {
    list-style: none;
    font-size: 14px;
    color: #d5d5d5;
    padding-left: 15px;
    li {
      margin-bottom: 10px;
    }
  }
  .info {
    img {
      width: 100px;
      height: 100px;
      border: 1px solid #d5d5d5;
      border-radius: 5px;
    }
    .content {
      display: flex;
      align-items: center;
    }
    .text {
      display: -webkit-box;
      overflow: hidden;
      text-overflow: ellipsis;
      -webkit-box-orient: vertical;
      -webkit-line-clamp: 2;
      white-space: normal;
      word-wrap: break-word;
      cursor: pointer;
      width: 100px;
      &:hover {
        white-space: normal;
        word-wrap: break-word;
      }
    }
  }
  .flex {
    display: flex;
    align-items: center;
    // justify-content: space-between;
  }
  .defaultColor {
    padding: 5px 13px;
    border-radius: 10px;
    margin-left: 10px;
    cursor: pointer;
  }
}
</style>
