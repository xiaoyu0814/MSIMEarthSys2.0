<template>
  <div class="trajectoryReplay">
    <div class="trajectoryReplay-container">
      <div class="formulate-title">
        <span>轨迹回放</span>
      </div>
      <img
        src="@/assets/image/panelIcons/关闭icon.png"
        alt="关闭"
        class="close_sty"
        @click="handleClose"
      />

      <div class="trajectoryReplayEarthView">
        <div id="lng-lat-info" class="lng-lat-info"></div>
        <div id="camera-height" class="camera-height"></div>
        <div
          :class="
            store.state.sceneModule.currentScreen == 'earthView'
              ? 'containerFullScreen'
              : 'containerSmallScreen'
          "
        >
          <div id="containerTrajectoryReplay"></div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// 导入hooks
import { useStore } from 'vuex'
import { reactive, ref, toRefs, onMounted, watch, nextTick } from 'vue'
import emitter from '@/utils/eventbus'
import { earthTrajectoryReplay } from './hooks/index'
import BubbleAirPlane from '@/utils/bubble/dataBubble'
export default {
  name: 'trajectoryReplay',
  components: {},
  setup() {
    const store = useStore()
    const state = reactive({
      sceneStartTime: '',
      czmlData: null
    })
    earthTrajectoryReplay()

    const handleClose = () => {
      emitter.emit('isShowTrajectoryReplay', {
        simulatorId: '',
        simulatorName: '',
        showType: false
      })
    }

    const loadTrajectory = () => {
      window.EarthViewerTraReplay.clock.shouldAnimate = true

      let sjJsonDataObj = state.czmlData.submarineRoutePathCzml
      // sjJsonDataObj.czml[1].id = 'czml_' + sjJsonDataObj.czml[1].id
      sjJsonDataObj.czml[1].model.show = true
      sjJsonDataObj.czml[1].label.show = false

      // 设置路径
      sjJsonDataObj.czml[1].path = {
        width: 4,
        show: true,
        resolution: 120, //将路径显示为以1秒为增量采样的路径线 路径的分辨率，即路径上点的数量。此参数决定如何在两点之间插值
        // leadTime: 10000, // 路径的领先时间，单位为秒。
        // trailTime: 72000, //路径的追踪时间，单位为秒。
        material: {
          polylineDash: {
            color: {
              rgba: [255, 0, 82, 255]
              // rgba: [30, 144, 255, 255]
            }
          }
        }
      }
      /**
       * range：当前时间到达其开始时间或结束时间时的行为。
       * UNBOUNDED - 时钟将继续向当前方向前进
       * LAMPED - T时钟将停止
       * LOOP_STOP - 当向前推进到达结束时间时，时钟将跳转到开始时间，当向后推进到达开始时间时，时钟将停止
       */
      //czml range
      sjJsonDataObj.czml[0].clock.range = 'UNBOUNDED'
      sjJsonDataObj.czml[0].clock.multiplier = 100
      let czmldata = window.MSIMEarthTraReplay.CzmlDataSource.load(
        sjJsonDataObj.czml
      )

      window.EarthViewerTraReplay.dataSources.add(czmldata).then((ds) => {
        ds.czmlName = sjJsonDataObj.czml[1].id

        // 配置czml 样式
        // ds.entities._entities._array.forEach((element) => {
        //   element.description = ''
        //   if (typeof element.billboard != 'undefined') {
        //     element.billboard.show = true
        //   }
        //   if (typeof element.model != 'undefined') {
        //     element.model.show = false
        //   }
        // })
        //Cesium基于czml billboard的模型转向
        // var s = ds.entities.getById(sjJsonDataObj.czml[1].id)
        // s.orientation =
        //   new window.MSIMEarthTraReplay.VelocityOrientationProperty(s.position)
        // s.billboard.alignedAxis =
        //   new window.MSIMEarthTraReplay.VelocityVectorProperty(s.position, true)

        ds.show = true
        // 加载完成停止调用接口  点播放时再开始
        // window.EarthViewerTraReplay.clock.multiplier = 0
        let params = {
          id: sjJsonDataObj.czml[1].id,
          name: sjJsonDataObj.czml[0].name
        }
        createCurSceneEntityLabel(params) // 加载舰船labeldiv
        addPathLine(sjJsonDataObj.czml[0].name)

        window.EarthViewerTraReplay.flyTo(ds)
      })
    }
    onMounted(() => {
      // state.czmlData = require('/public/static/data/czml/submarineRoutePath.js')
      setTimeout(() => {
        loadTrajectory()
      }, 600)
    })
    // 设置舰船的labeldiv弹框
    const createCurSceneEntityLabel = (item) => {
      let id = item.id
      let name = item.name
      // setLabelStyle(id, name)//设置czml的label内容
      let divLabel = new BubbleAirPlane({
        viewer: window.EarthViewerTraReplay,
        Cesium: window.MSIMEarthTraReplay,
        id: id,
        title: name,
        name: name,
        lng: 0.0,
        lat: 0.0,
        height: 0.0,
        heading: 0.0,
        pitch: 0.0,
        roll: 0.0,
        content: {},
        offsetY: 120,
        div: id,
        distanceDisplayCondition: [0, 5000000]
      })
      window.shipAndMissileLabel[id] = divLabel
    }
    /**
     * 添加路径线
     * @param {string} id entity的id或datasource的name
     * @param {boolean} value 显示或隐藏
     */
    const addPathLine = (czmlname) => {
      let side = 'red'
      let collection = []
      let sidecolor = new window.MSIMEarthTraReplay.Color(0.0, 1.0, 1.0, 1.0)
      // let entity = that.entityMethodFun.getCZMLEntity(
      //   czmlname,
      //   'MSIMEarthCZMLProcessContainer'
      // )
      let entity = window.EarthViewerTraReplay.dataSources
        .getByName(czmlname)[0]
        .entities.getById(czmlname)
      if (!entity || !entity.position) return
      // side = entity.properties.airplaneAction._value.side
      // if (side === 'blue') {
      //   sidecolor = new window.MSIMEarth.Color(0.0, 1.0, 1.0, 1.0)
      // }
      // entity
      function changePositions() {
        // let entity = that.entityMethodFun.getCZMLEntity(
        //   czmlname,
        //   'MSIMEarthCZMLProcessContainer'
        // )
        let entity = window.EarthViewerTraReplay.dataSources
          .getByName(czmlname)[0]
          .entities.getById(czmlname)
        if (!entity || !entity.position) return
        let YGPosition = entity.position.getValue(
          window.EarthViewerTraReplay.clock.currentTime
        )
        if (!YGPosition) return
        if (
          typeof YGPosition.x === 'undefined' ||
          typeof YGPosition.y === 'undefined' ||
          typeof YGPosition.z === 'undefined'
        ) {
          return
        }
        collection.push(YGPosition)
        return collection
      }
      window.EarthViewerTraReplay.entities.add({
        id: czmlname + 'pathLine',
        polyline: {
          positions: new window.MSIMEarthTraReplay.CallbackProperty(
            changePositions,
            false
          ),
          width: 5,
          material: sidecolor
        }
      })
    }
    // 删除路径线
    const removePathLine = (czmlname) => {
      window.EarthViewerTraReplay.entities.removeById(czmlname + 'pathLine')
    }
    return { ...toRefs(state), store, handleClose }
  }
}
</script>
<style lang="less" scoped>
.trajectoryReplay {
  z-index: 1000;
  position: absolute;
  top: 12%;
  left: 50%;
  transform: translate(-50%, 0%);

  // z-index: 999;
  // width: 1200px;
  // height: calc(88vh - 220px);
  // background-image: url('~@/assets/image/panelIcons/装饰.png');
  // background-repeat: no-repeat;
  // background-size: 100% 100%;
  // display: flex;
  // justify-content: center;
  // align-items: flex-end;
  width: 1200px;
  height: calc(88vh - 155px);
  display: flex;
  flex-wrap: wrap;
  padding: 10px;
  box-sizing: border-box;

  .trajectoryReplay-container {
    position: relative;
    width: 100%;
    height: 99.5%;
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;

    .close_sty {
      cursor: pointer;
      position: absolute;
      top: 10px;
      right: 10px;
      width: 20px;
      height: 20px;
    }

    .formulate-title {
      padding: 10px 0 10px 30px;
      box-sizing: border-box;
      text-align: center;
      // font-size: 18px;
      font-family: MFLiHei_Noncommercial-Regular;
      font-size: 25px;
      color: #ffffff;
      letter-spacing: 1.82px;
      font-weight: 400;
    }

    :deep(.el-tabs--border-card > .el-tabs__content) {
      padding: 0;
      height: calc(100% - 39px);

      .el-tab-pane {
        height: 95.5%;
      }
    }

    :deep(.el-tabs--border-card) {
      background: rgba(0, 0, 0, 0);
      border: none;
      height: calc(100% - 48px);
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
}

.trajectoryReplayEarthView {
  width: 100%;
  height: 100;

  .lng-lat-info {
    position: fixed;
    right: 265px;
    bottom: 3px;
    color: white;
    z-index: 9999;
  }

  .camera-height {
    position: fixed;
    right: 135px;
    bottom: 3px;
    color: white;
    z-index: 9999;
  }

  .containerFullScreen {
    position: absolute;
    width: 100%;
    height: calc(100% - 60px);

    #containerTrajectoryReplay {
      width: 100%;
      height: 100%;
    }
  }

  .containerSmallScreen {
    position: absolute;
    bottom: 32px;
    right: 0%;
    width: 550px;
    height: 500px;
    background-image: url('~@/assets/image/panelIcons/装饰.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 99;

    #containerTrajectoryReplay {
      position: relative;
      width: 98.8%;
      height: 97.4%;
      background: rgba(2, 26, 70, 0.88);
      box-shadow: 0 0 25px #1092d5;
    }
  }

  :deep .cesium-viewer-toolbar {
    display: none;
  }

  :deep .cesium-viewer-timelineContainer {
    // left: 2% !important;
    bottom: 7% !important;
    // width: 96% !important;
    z-index: 12;
    height: 50px !important;
    width: 62%;
    left: 19% !important;
  }

  :deep .cesium-timeline-bar {
    background: none !important;
    border-bottom: 1px solid #3093d5 !important;
    height: 50px !important;
    top: -1px !important;
    // width: 100% !important;
    // left: 18% !important;
  }

  :deep .cesium-timeline-main {
    border: none !important;
  }

  :deep .cesium-timeline-ticLabel {
    top: 7px !important;
  }

  :deep .cesium-timeline-icon16 {
    width: 17px !important;
    height: 25px !important;
  }

  :deep .cesium-viewer-animationContainer {
    visibility: hidden;
  }
}
</style>
