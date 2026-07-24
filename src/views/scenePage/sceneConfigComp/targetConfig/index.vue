<template>
  <div class="target-container">
    <div class="container-main">
      <div class="buttonTitle">模拟器导调</div>
      <img
        src="@/assets/image/panelIcons/关闭icon.png"
        alt=""
        class="close_sty"
        @click="handleClose"
      />
      <el-tabs type="border-card" v-model="state.tabSelect">
        <el-tab-pane
          v-for="item in state.tabList"
          :key="item.name"
          :label="item.label"
          :name="item.name"
          :disabled="item.disabled"
        >
          <targetConfigTab :tab-select="state.tabSelect"></targetConfigTab>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch } from 'vue'
import emitter from '@/utils/eventbus'
import targetConfigTab from './targetConfigTab.vue'
import store from '@/store/index'
import { worldPosToGraphic } from '@/utils/mapTools'
const state = reactive({
  tabSelect: '',
  tabList: [
    {
      name: 'admin',
      label: '参数配置',
      disabled: false
    }
    // {
    //   name: 'red',
    //   label: '红方席位',
    //   disabled: false
    // },
    // {
    //   name: 'blue',
    //   label: '蓝方席位',
    //   disabled: false
    // },
    // {
    //   name: 'red_zhkz',
    //   label: '红方指挥控制席位',
    //   disabled: false
    // }
  ],

  curSelect: '',
  formData: {
    longitude: '121.412322',
    latitude: '23.978216',
    height: '3920.153176',
    headingAngle: '',
    speed: '0.5'
  },
  curCameraParams: {
    position: null,
    heading: 0,
    pitch: 0,
    roll: 0
  }
})

const handleClose = () => {
  emitter.emit('closeBottomControlPanel', 'three')
}
watch(
  () => store.state.sceneModule.targetSimInfor,
  (newValue) => {
    let params = {
      LabelName: newValue.Data.LabelName, //中程空空导弹
      Name: newValue.Data.Name, //<dis>2:2:2
      Side: newValue.Data.Side, //red
      Type: newValue.Data.Type //MEDIUM_RANGE_RADAR_MISSILE
    }
    // PA 消息 开机只发个一次
    beautyToast.success({
      title: '添加',
      message: `模拟器${params.LabelName}接入成功`,
      darkTheme: true
    })
    let setval = window.setInterval(() => {
      let simModelPos = getSimModelPos(params.Name)
      if (simModelPos) {
        // 只在三维下显示
        if (window.EarthViewer.scene.mode == 3) {
          hightLightSimModel(simModelPos, params.Name, 800, 30000)
        }
        if (store.state.sceneModule.systemConfig.isFlyToSimModel) {
          flyTo(params.Name)
        }
        window.clearInterval(setval)
        setval = null
      }
    }, 1000)
    setTimeout(() => {
      if (setval) {
        window.clearInterval(setval)
        setval = null
      }
    }, 5000)
    // setTimeout(() => {
    //   let simModelPos = getSimModelPos(params.Name)
    //   hightLightSimModel(simModelPos, params.Name, 800, 30000)
    //   if (store.state.sceneModule.systemConfig.isFlyToSimModel) {
    //     flyTo(params.Name)
    //   }
    // }, 3000)
  }
)
/*
 *添加半球离子层闪烁并动态改变位置效果
 *pos：初始位置；id:czml的id;flickerTime:闪烁时间;endTime:移除时间
 */
const hightLightSimModel = (pos, id, flickerTime, endTime) => {
  // 此效果在三维模式下展示
  if (window.MSIMEarth.SceneMode !== 3) return
  //初始化材质
  let cusP = new window.EarthPlugn.customPritive(
    window.MSIMEarth,
    window.EarthViewer
  )
  let winston = cusP.createWinstonHalf(
    [1700, 1700, 1700],
    [pos.lng, pos.lat, pos.height],
    {
      color: new window.MSIMEarth.Color(255 / 255, 0 / 255, 0 / 255, 1.0),
      id: 'primitive_virtual_' + id
    }
  )
  window.EarthViewer.scene.primitives.add(winston)
  let targetHalfBall = null //当前的半球离子primitive对象
  window.EarthViewer.scene.primitives._primitives.forEach((p) => {
    if (p.id && p.id === 'primitive_virtual_' + id) {
      targetHalfBall = p
    }
  })
  //设置闪烁
  let setVal = window.setInterval(() => {
    if (targetHalfBall) {
      targetHalfBall.show = !targetHalfBall.show
    }
  }, flickerTime)
  function updatePos() {
    if (cusP) {
      cusP.updateModelMatrix('primitive_virtual_' + id, id)
    }
  }
  window.EarthViewer.scene.preUpdate.addEventListener(updatePos)
  //移除监听事件
  setTimeout(() => {
    window.EarthViewer.scene.preUpdate.removeEventListener(updatePos)
    window.clearInterval(setVal)
    setVal = null
    cusP.clear('primitive_virtual_' + id)
  }, endTime)
}
//获取模拟器推送过来的模型当前位置
const getSimModelPos = (id) => {
  let dataSource = null
  const entityMethod = new window.EarthPlugn.entity({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  let modelEntity = entityMethod.getCZMLEntity(
    id,
    'MSIMEarthCZMLProcessContainer'
  )
  // modelEntity = EarthViewer.entities.getById(id)
  // if (!modelEntity) {
  //   dataSource = EarthViewer.dataSources.getByName(id)[0]
  //   // 01 验证实体存在
  //   if (!dataSource) {
  //     console.log('数据源不存在')
  //     return
  //   }
  //   modelEntity = dataSource.entities.getById(id)
  // }
  if (modelEntity) {
    if (!modelEntity.position) return
    let entityPos = modelEntity.position._value
      ? modelEntity.position._value
      : modelEntity.position.getValue(window.EarthViewer.clock.currentTime)
    if (!entityPos) return
    if (
      typeof entityPos.x === 'undefined' ||
      typeof entityPos.y === 'undefined' ||
      typeof entityPos.z === 'undefined'
    ) {
      return
    }
    let pos = worldPosToGraphic(entityPos)
    return pos
  }
}
const flyTo = (id) => {
  let pos = worldPosToGraphic(EarthViewer.camera.position)
  state.curCameraParams = {
    position: pos,
    heading: EarthViewer.camera.heading,
    pitch: EarthViewer.camera.pitch,
    roll: EarthViewer.camera.roll
  }

  let dataSource = null
  const entityMethod = new window.EarthPlugn.entity({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  let modelEntity = entityMethod.getCZMLEntity(
    id,
    'MSIMEarthCZMLProcessContainer'
  )
  // modelEntity = EarthViewer.entities.getById(id)
  // if (!modelEntity) {
  //   dataSource = EarthViewer.dataSources.getByName(id)[0]
  //   // 01 验证实体存在
  //   if (!dataSource) {
  //     console.log('数据源不存在')
  //     return
  //   }
  //   modelEntity = dataSource.entities.getById(id)
  // }
  if (modelEntity) {
    window.EarthViewer.flyTo(modelEntity, {
      duration: 0,
      offset: new window.MSIMEarth.HeadingPitchRange(
        0,
        window.MSIMEarth.Math.toRadians(-90),
        15000
      )
    })
    // setTimeout(() => {
    //   window.EarthViewer.camera.flyTo({
    //     destination: window.MSIMEarth.Cartesian3.fromDegrees(
    //       state.curCameraParams.position.lng,
    //       state.curCameraParams.position.lat,
    //       state.curCameraParams.position.height
    //     ),
    //     orientation: {
    //       heading: state.curCameraParams.heading, //偏航角
    //       pitch: state.curCameraParams.pitch, //-0.08401170275668313, //水平俯仰角
    //       roll: state.curCameraParams.roll
    //     }
    //   })
    // }, 7000)
  }
}
onMounted(() => {
  state.tabSelect = window.localStorage.getItem('side')
  state.tabList[0].name = state.tabSelect
  switch (window.localStorage.getItem('side')) {
    case 'admin':
    case 'admin_ts':
      break
    case 'red':
      state.tabList.map((item) => {
        if (item.name != 'red') {
          item.disabled = true
        }
      })
      break
    case 'blue':
      state.tabList.map((item) => {
        if (item.name != 'blue') {
          item.disabled = true
        }
      })
      break
    case 'red_zhkz':
      state.tabList = [
        {
          name: 'admin',
          label: '白方导演席位',
          disabled: false
        },
        {
          name: 'red',
          label: '红方席位',
          disabled: false
        },
        {
          name: 'blue',
          label: '蓝方席位',
          disabled: false
        },
        {
          name: 'red_zhkz',
          label: '红方指挥控制席',
          disabled: false
        }
      ]
      state.tabList.map((item) => {
        if (item.name != 'red_zhkz') {
          item.disabled = true
        }
      })
      break
    default:
      break
  }
})
</script>

<style lang="less" scoped>
.target-container {
  position: absolute;
  right: calc(17vw + 18%);
  bottom: 3%;
  width: 388px;
  // height: 250px;
  // background: url('@/assets/image/voiceInteraction/zjDiv.png');
  // background-size: 100% 100%;
  // padding: 40px 20px;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1111;

  .container-main {
    padding: 15px;
    height: 97%;
    width: 100%;
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;
    display: flex;
    flex-direction: column;

    .buttonTitle {
      width: 100%;
      text-align: left;
      font-size: 20px;
      font-weight: 500;
      color: #00c7fb;
      display: flex;
      align-items: center;

      &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 20px;
        margin-right: 5px;
        background: #1092d5;
      }
    }

    .close_sty {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 10px;
      right: 10px;
      cursor: pointer;
    }

    .scene_input {
      // margin-top: 25px;
      border: none !important;

      :deep(.el-input__inner) {
        font-size: 18px;
        font-weight: 500;
        color: #06d6f9;
        border: none !important;
        text-align: center;
      }

      :deep(.el-input__wrapper) {
        background-color: #172e51 !important;
        box-shadow: 0 0 25px #1092d5;
      }

      :deep(.el-input) {
        --el-input-border-color: #e5e5e500 !important;
        --el-input-hover-border: transparent !important;
        --el-input-focus-border: transparent !important;
        --el-input-placeholder-color: #06d6f9;
      }

      :deep(.el-select) {
        --el-select-border-color-hover: transparent !important;
        --el-select-input-focus-border-color: transparent !important;
      }

      :deep(.el-input__wrapper:hover) {
        border: none !important;
        box-shadow: none;
      }
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

.inputOption {
  :deep(.el-form-item__label) {
    color: white;
  }

  :deep .el-input__wrapper {
    background: rgba(32, 97, 121, 0.45);
    border: 1px solid rgba(100, 199, 213, 1);
    border-radius: 4px;

    .el-input__inner {
      color: white;
    }
  }
}

.select_btn {
  display: flex;
  justify-content: flex-end;
}

:deep(.el-radio) {
  color: white;
  margin: 10px 0;
}
</style>
