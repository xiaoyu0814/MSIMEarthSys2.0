<template>
  <div id="plot">
    <header>
      <span
        :class="vueData.showBox ? 'select' : ''"
        @click="vueData.showBox = true"
        >军标面板</span
      >
      <span
        :class="vueData.showBox ? '' : 'select'"
        @click="vueData.showBox = false"
        >属性面板</span
      >
    </header>
    <div class="plot_box" v-show="vueData.showBox">
      <el-scrollbar height="200px">
        <el-tree
          :data="vueData.PlotData"
          :props="{}"
          @node-click="handleNodeClick"
        />
      </el-scrollbar>
      <el-scrollbar height="200px">
        <ul class="imgList_box">
          <li class="imgList_item" v-for="(item, index) in vueData.imgList">
            <el-tooltip
              effect="dark"
              :content="getName(item.codeName)"
              placement="top"
            >
              <img
                :src="item.url"
                style="width: 32px; height: 32px"
                @click="add(item)"
              />
            </el-tooltip>
          </li>
        </ul>
      </el-scrollbar>
    </div>

    <div class="attribute_box" v-show="!vueData.showBox">
      <el-tabs
        v-model="vueData.activeName"
        type="border-card"
        @tab-click="getTabsName"
      >
        <el-tab-pane
          v-for="item in vueData.tabList"
          :key="item.name"
          :label="item.label"
          :name="item.name"
          :disabled="item.disabled"
        >
          <el-scrollbar height="100%">
            <routine v-if="item.name == 'routine'"></routine>
          </el-scrollbar>
        </el-tab-pane>
      </el-tabs>
    </div>

    <layerManage
      @showLayer="showLayer"
      @save="save"
      v-if="store.getters.get_plotLayerList.length > 0"
    />
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import armySing_list from '@/utils/plot/Config.js'
import layerManage from './components/layerManage.vue'
import routine from './components/attribute/routine.vue'

const store = useStore()

const vueData = reactive({
  plotSystem: null,
  subGraphicLayer: null,
  plotEntity: null,
  earthDraw: null,
  PlotData: armySing_list.config,
  imgList: [],
  showBox: true,
  tabList: [
    {
      name: 'routine',
      label: '常规',
      disabled: false
    },
    {
      name: 'advanced',
      label: '高级',
      disabled: false
    },
    {
      name: '3D',
      label: '三维',
      disabled: false
    }
  ],
  activeName: 'routine',
  selectPlotName: '',
  selectPlotCode: ''
})

onMounted(() => {
  createEarthModule().then(() => {
    vueData.plotSystem = new PIE.PlotSystem()
    let layerManager = vueData.plotSystem.getPlotGraphicLayerManager()
    let graphicLayer = new PIE.PlotGraphicLayer()
    //添加根图层
    layerManager.addGraphicLayer(graphicLayer)
    //添加子图层
    vueData.subGraphicLayer = new PIE.PlotSubGraphicLayer({
      parent: graphicLayer
    })

    // window.MEarth = Cesium

    vueData.earthDraw = new EarthDraw.setup(EarthViewer, {})

    vueData.earthDraw.ctx.listener.on('draw.create', ({ feature, entity }) => {
      let name = entity.plot.getName()
      vueData.subGraphicLayer.addPlot(entity.plot)
      let layer = {
        name: getName(vueData.selectPlotName),
        img: vueData.selectPlotImage,
        code: vueData.selectPlotCode,
        entity
      }
      store.dispatch('push_plotLayerList', layer)
      const drawAttr = entity.plot.getDrawAttr()
      const tdAttr = entity.plot.getTDAttr()
      if (entity.plot.getSymbolType() == 0) {
        drawAttr.setSymbolSize([5, 5])
        drawAttr.setLineWidth(0.2)
      }
      // drawAttr.setScaleWidthMap(true);
      tdAttr.setDisplayType(PIE.PlotDotDisplayType.Lie)
    })
    vueData.earthDraw.ctx.listener.on('selectFeature', ({ feature }) => {
      let selectEntity = feature._ctx.editedLayer.getById(feature.id)
      console.log(selectEntity)
      store.dispatch('set_plotSelect', selectEntity)
    })
  })
  handleNodeClick(vueData.PlotData[0])
})

const showLayer = (item) => {
  console.log(item)
  vueData.earthDraw.modes.simple_select.clickOnEntity(item.entity.id)
  store.dispatch('set_plotSelect', item.entity)
}

const getTabsName = (name) => {
  vueData.activeName = name
}

const add = (item) => {
  vueData.selectPlotName = item.codeName
  vueData.selectPlotImage = item.url
  vueData.selectPlotCode = item.codeId
  let type = getSymbolType(item.codeId)
  let drawType = type ? 'draw_linePlot' : 'draw_pointPlot'
  vueData.earthDraw.changeMode(drawType, {
    single: true,
    code: item.codeId
  })
}

const getSymbolType = (id) => {
  let plot = new PIE.PlotEntity()
  plot.setSymbolCode(id)
  return plot.getSymbolType()
}

const handleNodeClick = (node, data) => {
  if (node.childrens) {
    vueData.imgList = node.childrens
  }
}

const getName = (imgName) => {
  return imgName.split('.')[0]
}

const createGuid = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

const downloadURL = (data, fileName) => {
  var a
  a = document.createElement('a')
  a.href = data
  a.download = fileName
  document.body.appendChild(a)
  a.style = 'display: none'
  a.click()
  a.remove()
}

const downloadBlob = (data, fileName, mimeType) => {
  var blob, url
  blob = new Blob([data], {
    type: mimeType
  })
  url = window.URL.createObjectURL(blob)
  downloadURL(url, fileName)
  setTimeout(function () {
    return window.URL.revokeObjectURL(url)
  }, 1000)
}

const save = () => {
  const uuid = '/j' + createGuid().replace(/-/g, '').slice(0, 19)
  let smlPath = uuid + '.sml'
  vueData.plotSystem.save(smlPath)
  downloadBlob(
    Module.FS.readFile(smlPath),
    'bh.sml',
    'application/octet-stream'
  )
}
</script>

<style lang="less" scoped>
#plot {
  position: absolute;
  right: 110px;
  top: 10%;
  width: 270px;
  // height: 350px;
  // background-color: #0c192a67;
  background-color: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  z-index: 22;

  header {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #00327d;
    display: flex;
    align-items: center;
    justify-content: space-between;
    color: #777777;

    span {
      cursor: pointer;
      padding: 5px;
      &:hover {
        background-color: #00327d;
      }
    }
    .select {
      color: #ffffff;
    }
  }
  .plot_box {
    .imgList_box {
      list-style: none;
      margin: 0;
      padding: 0;
      display: flex;
      flex-wrap: wrap;
      justify-content: space-around;
      align-items: center;
      align-content: center;
      padding: 10px;
      .imgList_item {
        padding: 5px;
        cursor: pointer;
        border &:hover {
          background-color: #00327d;
        }
      }
    }
  }

  .attribute_box {
    height: 400px;
    text-align: left;
    padding: 0 10px;
  }

  :deep(.el-tree) {
    background: #ffffff00;
    color: #ffffff;
    --el-tree-node-hover-bg-color: #00327d;
  }
  :deep(.el-tree-node__content:hover) {
    background-color: #00327d;
  }

  :deep(.el-tabs--border-card > .el-tabs__content) {
    padding: 0;
    height: calc(100% - 39px);
    .el-tab-pane {
      height: 100%;
    }
  }

  :deep(.el-tabs--border-card) {
    background: rgba(0, 0, 0, 0);
    border: none;
    height: calc(100%);
  }

  :deep(.el-tabs--border-card > .el-tabs__header) {
    background: rgba(0, 0, 0, 0);
  }

  :deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active) {
    background-color: #1092d5;
    border: none;
  }

  :deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item) {
    color: white;
  }

  :deep(.el-tabs__item:focus-visible) {
    box-shadow: none;
  }

  :deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item) {
    border: none;
  }
}
</style>
