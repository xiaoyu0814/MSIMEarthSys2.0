<template>
  <div class="weather-container">
    <div class="container-main">
      <div class="buttonTitle">天气配置</div>
      <el-tooltip
        class="box-item"
        effect="dark"
        content="关闭面板"
        placement="top"
      >
        <img
          src="@/assets/image/panelIcons/关闭icon.png"
          alt=""
          class="close_sty"
          @click="handleClose"
        />
      </el-tooltip>
      <el-radio-group
        v-model="state.curSelect"
        class="checkedOption"
        @change="handleCheckChange"
      >
        <el-radio
          v-for="item in state.weatherList"
          :key="item.value"
          :label="item.value"
        >
          <el-tooltip effect="light" :content="item.label" placement="right">
            <img :src="item.name" alt="" style="width: 50px" />
          </el-tooltip>
        </el-radio>
      </el-radio-group>
      <div class="select_btn">
        <el-button type="primary" size="small" @click="configDetail"
          >详情</el-button
        >
        <el-button type="primary" size="small" @click="state.curSelect = ''"
          >重置</el-button
        >
        <el-button type="primary" size="small" @click="confirmScene"
          >确定</el-button
        >
      </div>
    </div>
  </div>
  <changeWeatherAfsimConfig
    v-if="state.showChanWeatAfsimConfig"
  ></changeWeatherAfsimConfig>
</template>

<script setup>
import { reactive, onMounted, onUnmounted } from 'vue'
import { changeWeather, changeSeason } from '@/service/directingAdjusting'
import emitter from '@/utils/eventbus'
import changeWeatherAfsimConfig from './changeWeatherAfsimConfig.vue'
import { ElMessage } from 'element-plus'

const state = reactive({
  curSelect: '',
  weatherList: [
    // {
    //   name: require('@/assets/image/weatherIcon/cww87.png'),
    //   value: -1,
    //   label: '气象环境'
    // },
    {
      name: require('@/assets/image/weatherIcon/cww00.png'),
      value: 0,
      label: '晴天'
    },
    {
      name: require('@/assets/image/weatherIcon/cww03.png'),
      value: 1,
      label: '多云'
    },
    {
      name: require('@/assets/image/weatherIcon/cww28.png'),
      value: 2,
      label: '雾'
    },
    {
      name: require('@/assets/image/weatherIcon/cww03n.png'),
      value: 3,
      label: '多云'
    },
    {
      name: require('@/assets/image/weatherIcon/cww01.png'),
      value: 4,
      label: '部分多云'
    },
    {
      name: require('@/assets/image/weatherIcon/cww67.png'),
      value: 5,
      label: '大雨'
    },
    {
      name: require('@/assets/image/weatherIcon/cww60.png'),
      value: 6,
      label: '小雨'
    },
    {
      name: require('@/assets/image/weatherIcon/cww96.png'),
      value: 7,
      label: '雷阵雨'
    },
    {
      name: require('@/assets/image/weatherIcon/cww33.png'),
      value: 8,
      label: '沙尘'
    },
    {
      name: require('@/assets/image/weatherIcon/cww05.png'),
      value: 9,
      label: '沙尘暴'
    },
    {
      name: require('@/assets/image/weatherIcon/cww72.png'),
      value: 10,
      label: '雪'
    },
    {
      name: require('@/assets/image/weatherIcon/cww75.png'),
      value: 11,
      label: '暴雪'
    },
    {
      name: require('@/assets/image/weatherIcon/cww70.png'),
      value: 12,
      label: '小雪'
    },
    {
      name: require('@/assets/image/weatherIcon/春天.png'),
      value: 13,
      label: '春天'
    },
    {
      name: require('@/assets/image/weatherIcon/夏天.png'),
      value: 14,
      label: '夏天'
    },
    {
      name: require('@/assets/image/weatherIcon/秋天.png'),
      value: 15,
      label: '秋天'
    },
    {
      name: require('@/assets/image/weatherIcon/冬天.png'),
      value: 16,
      label: '冬天'
    }
  ],
  showChanWeatAfsimConfig: false
})
const handleClose = () => {
  emitter.emit('closeBottomControlPanel', 'three')
  emitter.emit('tagActiveClose', 'weatherControl')
}
const handleCheckChange = () => {}
const confirmScene = () => {
  if (state.curSelect == -1) {
    state.showChanWeatAfsimConfig = true
  } else if (state.curSelect > 12) {
    // 季节编码 1春 2夏 3秋 4冬   13春 14夏 15秋 16冬
    let seasonCode = -1
    switch (state.curSelect) {
      case 13:
        seasonCode = 1
        break
      case 14:
        seasonCode = 2
        break
      case 15:
        seasonCode = 3
        break
      case 16:
        seasonCode = 4
        break
      default:
        seasonCode = -1
        break
    }
    changeSeason({ seasonCode: seasonCode }).then((res) => {
      if (res.code == 200) {
        let index = state.weatherList.findIndex(
          (item) => item.value == state.curSelect
        )
        if (index >= 0) {
          ElMessage.success(state.weatherList[index].label + ' 导调成功!')
        }
        state.curSelect = ''
      }
    })
  } else {
    //单纯的UE天气导调不需要传时间参数值
    changeWeather({ weatherCode: state.curSelect, weatherTime: '' }).then(
      (res) => {
        if (res.code == 200) {
          let index = state.weatherList.findIndex(
            (item) => item.value == state.curSelect
          )
          if (index >= 0) {
            ElMessage.success(state.weatherList[index].label + ' 导调成功!')
          }

          state.curSelect = ''
          // 设置云量 暂时去掉
          // window.sceneAction.environmentController.removeCloud('dsadadd')
          // let optionCloud = {
          //   position: [120.1969, 22.8564, 1000],
          //   id: 'dsadadd'
          // }
          // console.log(window.sceneAction)
          // window.sceneAction.environmentController.particleCloudByOption(
          //   optionCloud
          // )
        }
      }
    )
  }
}
const configDetail = () => {
  state.curSelect = -1
  confirmScene()
}
onMounted(() => {
  emitter.on('closeChanWeatAfsimConfig', () => {
    state.showChanWeatAfsimConfig = false
    state.curSelect = ''
  })
})
onUnmounted(() => {
  emitter.off('closeChanWeatAfsimConfig')
})
</script>

<style lang="less" scoped>
.weather-container {
  position: absolute;
  right: calc(17vw + 18%);
  bottom: 3%;
  width: 200px;
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
      font-size: 16px;
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
      width: 16px;
      height: 16px;
      position: absolute;
      top: 16px;
      right: 8px;
      cursor: pointer;
    }

    .el-radio-group {
      display: inline-flex;
      align-items: flex-start;
      font-size: 0;
      flex-direction: row;
      padding: 0;
    }
  }
}

.checkedOption {
  padding: 5px;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
}

.select_btn {
  display: flex;
  justify-content: flex-end;

  .el-button {
    background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
    width: 50px;
    height: 25px;
    color: #ffff;
    border-radius: 5px;
    margin-left: 10px;
    cursor: pointer;
  }

  .el-button:disabled {
    color: #cccccc;
    border: none;
    cursor: auto;
  }
}

:deep(.el-radio) {
  color: white;
  margin: 10px 0;
}
</style>
