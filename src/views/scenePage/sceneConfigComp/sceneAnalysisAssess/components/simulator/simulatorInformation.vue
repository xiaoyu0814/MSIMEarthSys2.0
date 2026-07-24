<!-- 模拟器介绍 -->
<template>
  <div class="simulator-Information">
    <el-row>
      <el-col :span="6">
        <div class="text-infor">
          <label>加入场景时间:</label
          ><span>{{ simulatorData.strDepartureTime }}</span>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="text-infor">
          <label>加入场景时长:</label><span>{{ simulatorData.trainTime }}</span>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="text-infor">
          <label>平均高度(m):</label
          ><span>{{ simulatorData.averageHeight }}</span>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="text-infor">
          <label>最高高度(m):</label
          ><span>{{ simulatorData.simMaxHeight }}</span>
        </div>
      </el-col>
      <el-col :span="5">
        <div class="text-infor">
          <label>最低高度(m):</label
          ><span>{{ simulatorData.simMinHeight }}</span>
        </div>
      </el-col>
      <!-- 第二行 -->
      <el-col :span="6">
        <div class="text-infor">
          <label>平均速度(km/h):</label
          ><span>{{ simulatorData.averageSpeed }}</span>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="text-infor">
          <label>最大速度(km/h):</label
          ><span>{{ simulatorData.maximumSpeed }}</span>
        </div>
      </el-col>
      <el-col :span="4">
        <div class="text-infor">
          <label>最小速度(km/h):</label
          ><span>{{ simulatorData.minimumSpeed }}</span>
        </div>
      </el-col>
      <el-col :span="5">
        <!-- <div class="text-infor"><label>起落架收起时间:</label><span>{{ simulatorData.retractionTime }}</span></div> -->
        <div class="text-infor">
          <label>起落架收起时间:</label
          ><el-select v-model="qljsqsj" clearable placeholder="请查看">
            <el-option
              v-for="(item, index) in simulatorData.retractionTime"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
      </el-col>
      <el-col :span="5">
        <!-- <div class="text-infor"><label>起落架放下时间:</label><span>{{ simulatorData.loweringTime }}</span></div> -->
        <div class="text-infor">
          <label>起落架放下时间:</label>
          <el-select v-model="qljfxsj" clearable placeholder="请查看">
            <el-option
              v-for="(item, index) in simulatorData.loweringTime"
              :key="index"
              :label="item"
              :value="item"
            />
          </el-select>
        </div>
      </el-col>
    </el-row>
  </div>
</template>

<script>
import emitter from '@/utils/eventbus'
import {
  onMounted,
  reactive,
  nextTick,
  watch,
  markRaw,
  onUnmounted,
  toRefs
} from 'vue'
import store from '@/store/index'
import {
  getSimStatistics,
  getSimStatisticsByTimeZone
} from '@/service/simulatorServer.js'
export default {
  name: 'chartCommon',
  props: {
    simulatorId: {
      type: String,
      default: '13'
    }
  },
  components: {},
  setup(props, ctx) {
    const vueData = reactive({
      simulatorData: {},
      qljsqsj: '',
      qljfxsj: ''
    })
    onMounted(() => {
      getSimulatorInfor(props.simulatorId)
    })
    //获取模拟器基本信息
    const getSimulatorInfor = (id) => {
      let startTime = store.state.sceneModule.startSceneTime
      let endTime = store.state.sceneModule.endSeeStaticTime
      let param = {
        mnq: id, //模拟器Id
        startSceneTime: startTime,
        endSceneTime: endTime
      }
      // let param = {
      //   mnq: id,
      //   id: store.state.curSceneInfo.id,//场景Id
      //   replayId: store.state.sceneModule.sceneReplayId//回放id
      // }
      // getSimStatistics(param).then((res) => {
      getSimStatisticsByTimeZone(param).then((res) => {
        if (res.code != 200) {
          ElMessage.warning('获取数据失败，请稍后再试！')
          return
        }
        if (Object.keys(res.data).length > 0) {
          for (let item in res.data) {
            if (!res.data[item]) {
              res.data[item] = '-- --'
            }
          }
          vueData.simulatorData = res.data
        }
      })
    }
    return {
      ...toRefs(vueData),
      getSimulatorInfor
    }
  }
}
</script>

<style lang="less" scoped>
.simulator-Information {
  color: #fff;
  width: 100%;
  height: 100%;
}

.text-infor {
  width: 250px;
  text-align: left;
  margin: 5px auto;
  font-size: 15px;
}

:deep(.el-input__inner) {
  height: 22px;
  color: #fff;
  width: 80px;
}

:deep(.el-input__wrapper) {
  background-color: rgba(0, 0, 0, 0.2);
}
</style>
