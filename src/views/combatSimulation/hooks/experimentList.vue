<template>
  <div
    class="experimentList animate__animated animate__fadeInLeftBig animate__delay-0.1s"
    v-show="vueData.showList"
  >
    <div class="header">
      <span>实验列表</span>
      <div>
        <el-button
          type="primary"
          size="small"
          @click.stop="_getList"
          style="margin-right: -180px"
        >
          刷新列表
        </el-button>
      </div>
      <div>
        <el-tooltip
          :content="
            vueData.showRunningOnly ? '获取全部实验列表' : '获取运行中实验列表'
          "
          placement="top"
        >
          <el-switch
            v-model="vueData.showRunningOnly"
            inline-prompt
            @change="handleShowRunningChange"
            style="margin-right: 20px"
          />
        </el-tooltip>
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
            @click="handleClose_"
          />
        </el-tooltip>
      </div>
    </div>
    <div class="content">
      <div class="search_create">
        <el-input
          v-model="vueData.search"
          :suffix-icon="Search"
          style="width: 290px"
          placeholder="请输入实验名称"
          clearable
          @keyup.enter="_getList"
        />
        <span>
          <el-button type="primary" :icon="Search" @click="_getList">
            查询
          </el-button>
        </span>
      </div>
      <div class="taskItem_box">
        <div
          class="item_box"
          v-for="(item, index) in vueData.taskList"
          :key="index"
          :class="vueData.selectIndex == index ? 'select_style' : ''"
        >
          <div class="item_header" style="position: relative">
            <span class="title">
              <img src="~@/assets/images/rwty/想定查询.svg" alt="" />
              <span :title="item.name" class="experiment-name">{{
                item.name
              }}</span>
            </span>
            <ul
              class="btn_list"
              style="display: block; position: absolute; right: -30px; top: 3px"
              v-if="
                vueData.isHaveRun == false ||
                item.simRunStatus == 3 ||
                item.simRunStatus == 2 ||
                item.simRunStatus == 1
              "
            >
              <li style="margin-bottom: 5px">
                <el-button
                  type="primary"
                  size="small"
                  @click.stop="startsCreateBox(item)"
                  :disabled="
                    item.simRunStatus == 1 ||
                    item.simRunStatus == 2 ||
                    item.simRunStatus == 3 ||
                    vueData.isStarting
                  "
                  >开始推演</el-button
                >
              </li>
              <li style="margin-bottom: 5px">
                <el-button
                  type="primary"
                  size="small"
                  @click.stop="ContinueRunCurrentScene(item)"
                  :disabled="
                    item.simRunStatus == 0 ||
                    item.simRunStatus == 4 ||
                    vueData.isContinuing
                  "
                  >观看推演</el-button
                >
              </li>
              <li style="margin-bottom: 5px">
                <el-button
                  type="primary"
                  size="small"
                  @click.stop="_configExperimentReportContent(item)"
                  >演播配置</el-button
                >
              </li>
              <!-- <li style="margin-bottom: 5px">
                <el-button
                  type="primary"
                  size="small"
                  @click.stop="blConfig(item)"
                  :disabled="item.simRunStatus == 0 || item.simRunStatus == 4"
                  >兵力推荐</el-button
                >
              </li> -->
            </ul>
          </div>
          <ul class="item_content">
            <!-- <li>实验名称:{{ item.name }}</li> -->
            <!-- <li class="describe">关联场景:{{ item.sceneName }}</li> -->
            <li
              class="describe"
              :style="{ color: item.simRunStatus == 2 ? '#00ff00' : '' }"
            >
              运行状态:{{
                item.simRunStatus == 2
                  ? '运行中'
                  : item.simRunStatus == 3
                  ? '暂停'
                  : '未运行'
              }}
            </li>
            <li :style="{ color: item.simRunStatus == 2 ? '#00ff00' : '' }">
              规划时间:{{ item.createTime }}
            </li>
          </ul>
        </div>
      </div>
      <selfPage
        class="page_box"
        :currentPage="vueData.pageNum"
        :pageSize="vueData.pageSize"
        :total="vueData.total"
        @handleSizeChange="changePageSize"
        @handleCurrentChange="changePageNum"
      ></selfPage>
      <reportConfig ref="reportConfigRef"></reportConfig>
    </div>
  </div>
  <!-- 实验详情弹窗 -->
  <el-dialog
    v-model="vueData.isEditTask"
    :title="vueData.popTitle"
    width="500px"
    append-to-body
    class="dialog-box"
    style="background: #2b4559 !important; color: #fff"
    @close="closeEditTask"
  >
    <el-form :model="vueData.instructInfo" label-width="160px">
      <el-form-item label="实验名称">
        <el-input v-model="vueData.instructInfo.name" :disabled="true" />
      </el-form-item>
      <el-form-item label="实验关联场景">
        <el-input v-model="vueData.instructInfo.sceneName" :disabled="true" />
      </el-form-item>
      <el-form-item label="实验目标">
        <el-input
          v-model="vueData.instructInfo.experimentTarget"
          :disabled="true"
        />
      </el-form-item>
      <!-- 实验样本生成模板未对接 -->
      <el-form-item label="实验样本生成模板">
        <el-input v-model="vueData.instructInfo.delivery" :disabled="true" />
      </el-form-item>
      <el-form-item label="实验预期结果">
        <el-input
          v-model="vueData.instructInfo.experimentExpectedResults"
          :disabled="true"
        />
      </el-form-item>
      <el-form-item label="实验描述">
        <el-input v-model="vueData.instructInfo.describe" :disabled="true" />
      </el-form-item>
      <!-- <el-form-item label="实验方案想定">
          <el-input
            v-model="vueData.instructInfo.delivery"
            style="width: 200px"
          />
        </el-form-item> -->
      <!--想定时间未对接 -->
      <el-form-item label="想定时间">
        <el-date-picker
          v-model="vueData.instructInfo.value1"
          type="date"
          style="width: 140px; margin-right: 10px"
          format="YYYY/MM/DD"
          :disabled="false"
        />
      </el-form-item>
      <el-form-item label="实验方案变量设置结果">
        <el-table
          :data="vueData.popTableData"
          style="width: 100%"
          height="260"
          border
        >
          <el-table-column
            type="index"
            width="55"
            label="序号"
            align="center"
          />
          <el-table-column prop="name" label="变量名称" align="center" />
          <el-table-column prop="value" label="变量边界设置" align="center" />
        </el-table>
      </el-form-item>
      <el-form-item>
        <!-- <el-button type="primary" size="small" @click="createCamp"
          >确定</el-button
        > -->
        <el-button type="primary" size="small" @click="closeEditTask"
          >确定</el-button
        >
        <el-button size="small" @click="closeEditTask">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
  <!-- 样本面板组件 -->
  <samplePanel
    v-if="vueData.showSamplePanel"
    :experiment-id="vueData.currentExperimentId"
    :experiment-name="vueData.currentExperimentName"
    @close="closeSamplePanel"
  />
</template>

<script setup>
import { reactive, onMounted, watch, ref, onUnmounted } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import emitter from '@/utils/eventbus'
import selfPage from '@/components/page.vue'
import { creategetPage } from '@/service/experiment/experiment'
import reportConfig from '../components/reportConfig.vue'
import samplePanel from '../components/samplePanel.vue'
import {
  startExperiment,
  getExpeSampleMgtPage
} from '@/service/combatSimulation.js'
import { eventControllerSSEClose } from '@/utils/mapTools'
import commonMethods from '@/utils/commonMethods/commonMethods.js'
import { fillTaskInfo } from '@/service/SSE.js'
import { getZZQYData } from '@/service/experiment/experiment.js'
import { getExpeSimClientInformation } from '@/service/timeline'
import { getSimulationState } from '@/service/afsim'
import {
  SwitchButton,
  Edit,
  View,
  Hide,
  EditPen,
  Comment,
  Collection
} from '@element-plus/icons-vue'
import {
  queryExperimentJsonFile,
  createOrUpdate,
  downloadExperimentJsonFile
} from '@/service/experiment/experiment'
import { getScenarioById } from '@/service/experimentalPreparation.js'
import { getById } from '@/service/experiment/experiment.js'
import { configPlateformCHNName2 } from '@/utils/earthPlugin/ThirdParty/eventSource/event/earthEvent/czml/czmlRenderConfig/modelConfig/modelMatching.js'
import { seaAirJointOperationsSceneTime } from '@/utils/earthPlugin/ThirdParty/eventSource/event/earthEvent'

const store = useStore()

const vueData = reactive({
  showList: true,
  popTitle: '实验方案详情',
  search: '',
  checkBox_show: false,
  isEditTask: false,
  instructInfo: {},
  popTableData: [],
  taskList: [],
  pageNum: 1,
  pageSize: 4,
  total: 0,
  samplePageNum: 1,
  samplePageSize: 10,
  sampleTotal: 0,
  selectIndex: -1,
  listener: null,
  showSamplePanel: false,
  currentExperimentId: '',
  currentExperimentName: '',
  showRunningOnly: false,
  isHaveRun: false,
  isStarting: false,
  isContinuing: false,
  runPageNum: 1,
  runPageSize: 4
})

let startDebounceTimer = null
let continueDebounceTimer = null
let experimentListRefreshTimer = null
const DEBOUNCE_DELAY = 1000

watch(
  () => store.getters.get_isSimulationList,
  (newVal) => {
    vueData.showList = newVal
  },
  { deep: true, immediate: true }
)
// 实验开始或继续时获取 simClientIp，监听到值变化后实现循环调用获取仿真时间
// watch(
//   () => store.state.AFSIMModule.simClientIp,
//   (newVal) => {
//     // const { getSceneTime } = seaAirJointOperationsSceneTime()
//     // getSimulationState(newVal)
//     //   .then((res) => {
//     //     let data = JSON.parse(res.data)
//     //     let nData = JSON.parse(data.data)
//     //     let curAT = { R: nData.clockRate, T: nData.simTime }
//     //     getSceneTime(curAT)
//     //   })
//     //   .catch((res) => {
//     //     console.log('没有获取到仿真实时状态数据')
//     //   })
//     setInterval(() => {
//       getSimulationState(newVal)
//         .then((res) => {
//           let data = JSON.parse(res.data)
//           let nData = JSON.parse(data.data)
//           let curAT = { R: nData.clockRate, T: nData.simTime }
//           // getSceneTime(curAT)
//           experimentEventFlyControl(curAT)
//         })
//         .catch((res) => {
//           console.log('没有获取到仿真实时状态数据')
//         })
//     }, 5000)
//   },
//   { deep: true }
// )
emitter.on('AT', (data) => {
  // let curAT = { R: data.Data.R, T: data.Data.T }
  // getSceneTime(curAT)
  experimentEventFlyControl(data)
})
// 通过 ref 引用子组件实例
const reportConfigRef = ref(null)

// 切换子组件显示/隐藏的方法
const toggleChildVisibility = () => {
  if (reportConfigRef.value) {
    reportConfigRef.value.toggleReportConfigPaneVisibility()
  }
}
const { configldrw } = commonMethods()

const _queryExperimentJsonFile = () => {
  const params = {
    experimentId: store.state.sceneModule.sceneInfo.id
  }
  queryExperimentJsonFile(params).then((res) => {
    if (res.code == 200) {
      // 配置想定内容
      for (const key in res.data) {
        if (Object.hasOwnProperty.call(res.data, key)) {
          const cameraConfigData = res.data[key]
          cameraConfigData.curFly = 0
        }
      }
      const sceneData = res.data['-1']
      configMission(sceneData)
      store.commit('setCameraOptionList', res.data)
      initFlyTo(sceneData)
    } else {
      ElMessage.error(res.data)
    }
  })
}
// 配置想定也内容
const configMission = (sceneData) => {
  if (typeof sceneData === 'undefined') return
  // 将missionBrief、missionObjective和scenarioBackground赋值给store
  if (sceneData.missionBrief) {
    store.commit('experimentModule/SET_MISSION_BRIEF', sceneData.missionBrief)
  }
  if (sceneData.missionObjective) {
    store.commit(
      'experimentModule/SET_MISSION_OBJECTIVE',
      sceneData.missionObjective
    )
  }
  if (sceneData.scenarioBackground) {
    store.commit(
      'experimentModule/SET_SCENARIO_BACKGROUND',
      sceneData.scenarioBackground
    )
  }
}
/****
 * 开始实验
 */
const startsCreateBox = async (row) => {
  if (vueData.isStarting) {
    ElMessage.warning('实验正在启动中，请稍候...')
    return
  }

  if (startDebounceTimer) {
    clearTimeout(startDebounceTimer)
  }

  vueData.isStarting = true
  startDebounceTimer = setTimeout(async () => {
    emitter.emit('showLoading', { show: true, text: '实验正在启动，请稍后' })
    try {
      let rowInfo = JSON.stringify(row)
      window.localStorage.setItem('isRestartScene', false)
      window.localStorage.setItem('currentSceneInfo', JSON.stringify(row))
      await getChineseName(row.scenarioIdStr)
      await getSceneTime(row.scenarioIdStr)
      await getPlayStute(row)
      await fillTaskInfo({
        endTime: '',
        other: '',
        startTime: '',
        taskID: Number(row.id),
        taskName: row.name
      })
      // await _getList()
      store.state.sceneModule.showEarth = !store.state.sceneModule.showEarth
      sceneInfoConfig(row)
      _queryExperimentJsonFile()
      configldrw(store.state.sceneModule.sceneInfo.name)

      startExperiment(row.id)
        .then((res) => {
          emitter.emit('showLoading', false)
          if (res.code != 200) {
            return (
              ElMessage.error(res.data) ||
              ElMessage.error('网络请求失败,请稍后重试！')
            )
          }
          ElMessage.success(`${row.name}实验开始!`)
          _getListAfterStart()

          if (EventController) {
            eventControllerSSEClose(EventController)
          }
          EventController = new window.EarthPlugn.EventSourceController({
            baseUrl: serverUrls.serversCommunication
          })
          EventController.initStream(store.state.sceneModule.multiplier)
          _startExperimentReport()
          // 首次启动实验也记为进入场景
          store.state.AFSIMModule.isEnterScene = true
          // 弹出时间轴
          emitter.emit('changeTimeLineState', true)
          // 关闭实验列表面板，方便再次打开刷新面板状态
          emitter.emit('isExperimentListShow', false)
        })
        .catch((err) => {
          emitter.emit('showLoading', false)
          ElMessage.error('实验启动失败,请稍后重试！')
          console.error('startExperiment error:', err)
        })
        .finally(() => {
          vueData.isStarting = false
        })
    } catch (error) {
      console.error('Start experiment error:', error)
      ElMessage.error('启动实验失败，请稍后重试')
      vueData.isStarting = false
    }
  }, DEBOUNCE_DELAY)
}

/**
 * 提交编辑
 */
// const createCamp = () => {}
/****
 * 配置实验过程中汇报的内容
 */
const _configExperimentReportContent = async (row) => {
  await _getList()
  await getSceneTime(row.scenarioIdStr)
  sceneInfoConfig(row)
  emitter.emit('showEventList', false)
  setTimeout(() => {
    emitter.emit('showEventList', true)
  }, 100)
}
const blConfig = async (item) => {
  await getSceneTime(item.scenarioIdStr)
  let blObject = JSON.stringify(item)
  window.localStorage.setItem('blObject', blObject)
  emitter.emit('showBLEventList', true)
  emitter.emit('sendBlConfigItem', item)
}
/****
 * 配置实验过程中汇报的内容
 */
const _startExperimentReport = () => {
  if (store.state.experimentModule.experimentReportList.length === 0) {
    console.log(
      `请先配置汇报内容${store.state.experimentModule.experimentReportList}`
    )
    return
  }
  let curExperimentReportList = []
  console.log(
    'experimentReportList',
    store.state.experimentModule.experimentReportList
  )
  store.state.experimentModule.experimentReportList.forEach((e) => {
    if (e.time >= store.state.AFSIMModule.ATValue) {
      // 1.1 判断当前AT，已经在当前AT之前的事件不列为监听内容，未监听的内容推到监听队列中
      curExperimentReportList.push(e)
    }
  })
  // 1.3 如果已经执行过则跳过该事件继续执行
}
/**
 * 样本列表查看
 */
const _openSamplelist = (row) => {
  store.commit('set_isSamplelist', true)
  let params = {
    pageNum: vueData.samplePageNum,
    pageSize: vueData.samplePageSize,
    experimentId: row.id //实验id
    // code:"",//样本编号
    // name:"",//样本名称
    // sceneName:"",//场景名称
  }
  getExpeSampleMgtPage(params).then((res) => {
    if (res.code != 200) {
      return (
        ElMessage.error(res.message) ||
        ElMessage.error('网络请求失败,请稍后重试！')
      )
    }
    store.commit('set_isSampleData', res.data.records)
    vueData.sampleTotal = res.data.total
  })
}
/**
 * 继续试验
 * @param row 实验id
 */
const ContinueRunCurrentScene = async (row) => {
  let isEnterScene = store.state.AFSIMModule.isEnterScene
  if (isEnterScene) {
    // ElMessage.warning('场景正在推演中，请勿重复进入场景', {
    //   duration: 500
    // })
    ElMessage({
      message: '场景正在推演中，请勿重复进入场景',
      type: 'warning',
      duration: 500
    })
    return
  }
  setTimeout(() => {
    emitter.emit('showLoading', { show: true, text: '实验正在启动，请稍后' })
  }, DEBOUNCE_DELAY / 2)
  // if (EarthAPP.MQCount >= 1) {
  //   ElMessage.warning(
  //     '当前页面已载入场景，若要重新载入请请刷新浏览器并载入载入'
  //   )
  //   return
  // }
  if (vueData.isContinuing) {
    ElMessage.warning('实验正在继续中，请稍候...')
    return
  }

  if (continueDebounceTimer) {
    clearTimeout(continueDebounceTimer)
  }

  vueData.isContinuing = true

  continueDebounceTimer = setTimeout(async () => {
    try {
      window.localStorage.setItem('isRestartScene', false)
      window.localStorage.setItem('currentSceneInfo', JSON.stringify(row))
      ElMessage.success(`${row.name}继续!`)
      await getChineseName(row.scenarioIdStr)
      await getSceneTime(row.scenarioIdStr)
      await getPlayStute(row)
      sceneInfoConfig(row)
      _queryExperimentJsonFile()
      configldrw(store.state.sceneModule.sceneInfo.name)
      _startExperimentReport()

      setTimeout(() => {
        if (EventController) {
          eventControllerSSEClose(EventController)
        }
        EventController = new window.EarthPlugn.EventSourceController({
          baseUrl: serverUrls.serversCommunication
        })
        EventController.initStream(store.state.sceneModule.multiplier)
        // 标记为已经进入场景
        store.state.AFSIMModule.isEnterScene = true

        // 弹出时间轴
        emitter.emit('changeTimeLineState', true)
        // 关闭加载中
        emitter.emit('showLoading', false)
        // 关闭实验列表面板，方便再次打开刷新面板状态
        emitter.emit('isExperimentListShow', false)
      }, 2000)
    } catch (error) {
      emitter.emit('showLoading', false)
      console.error('Continue experiment error:', error)
      ElMessage.error('继续实验失败，请稍后重试')
    } finally {
      vueData.isContinuing = false
    }
  }, DEBOUNCE_DELAY)
}

const getPlayStute = (row) => {
  let params = {
    clientId: row.simClientIdStr,
    equipmentType: '',
    nodeId: '',
    simClientIp: '',
    simClientPort: '',
    simClientStartupStatus: ''
  }
  getExpeSimClientInformation(params).then((res) => {
    if (res.code == 200) {
      store.commit('setEngineIp', res.data.simClientIp)
      if (res.data.simClientIp) {
        let ip = 'http://' + res.data.simClientIp + ':9004'
        store.state.AFSIMModule.simClientIp = ip // 将当前场景仿真客户端ip保存并实现getSimulationState接口子调用来完成仿真时间获取，代替AT事件获取方式
        getSimulationState(ip)
          .then((res) => {
            let data = JSON.parse(res.data)
            let nData = JSON.parse(data.data)
            console.log(nData)
            store.state.AFSIMModule.simulationState = nData
            if (nData.pause) {
              store.commit('setPlayState', 'pause')
            } else {
              store.commit('setPlayState', 'forward')
            }
          })
          .catch((res) => {
            store.commit('setPlayState', 'pause')
          })
      }
    }
  })
}
// 选择实验（初始或者继续）后配置当前场景信息
const sceneInfoConfig = (row) => {
  console.log('row', row)
  store.state.sceneModule.sceneInfo = row
  // 如果想要使用本地配置则修改localSceneInfo的useCurrentConfig为true
  if (EarthAPP.localSceneInfo.useCurrentConfig) {
    store.state.sceneModule.sceneInfo = EarthAPP.localSceneInfo
  }
}
/****
 * 查看编辑
 */
const _editTask = (row) => {
  // store.commit('set_isSimulationListCurData', row)
  vueData.isEditTask = true
  vueData.instructInfo = row
  vueData.popTableData = []
  vueData.popTitle = `${row.name}-实验方案详情`
  const argument = JSON.parse(vueData.instructInfo.argument),
    arr = Object.keys(argument)
  arr.map((item, idx) => {
    switch (item) {
      case 'updateFrequencyOfHeatMap':
        if (argument['updateFrequencyOfHeatMap']['ThermalDuration']) {
          vueData.popTableData.push({
            name: '热力持续时间',
            value: argument['updateFrequencyOfHeatMap']['ThermalDuration']
          })
        }
        if (argument['updateFrequencyOfHeatMap']['updateInterval']) {
          vueData.popTableData.push({
            name: '热力更新间隔',
            value: argument['updateFrequencyOfHeatMap']['updateInterval']
          })
        }
        if (argument['updateFrequencyOfHeatMap']['Satisfaction']) {
          vueData.popTableData.push({
            name: '热力侦察需求满足情况',
            value: argument['updateFrequencyOfHeatMap']['Satisfaction']
          })
        }
        break
      case 'weather': //气象情况
        if (argument[item]) {
          vueData.popTableData.push({
            name: '气象情况',
            value: argument[item]
          })
        }
        break
      case 'situation': //电磁情况
        if (argument[item]) {
          vueData.popTableData.push({
            name: '电磁情况',
            value: argument[item]
          })
        }
        break
      case 'Interference': //干扰情况
        if (argument[item]) {
          vueData.popTableData.push({
            name: '干扰情况',
            value: argument[item]
          })
        }

        break
      case 'Disguise': //伪装情况
        if (argument[item]) {
          vueData.popTableData.push({
            name: '伪装情况',
            value: argument[item]
          })
        }
        break
      case 'satelliteDamage': //卫星受损情况
        if (argument[item]) {
          vueData.popTableData.push({
            name: '卫星受损情况',
            value: argument[item]
          })
        }
        break
      case 'groundStationDamage': //地面站受损情况
        if (argument[item]) {
          vueData.popTableData.push({
            name: '地面站受损情况',
            value: argument[item]
          })
        }
        break
      case 'Daytime': //白昼情况
        if (argument[item]) {
          vueData.popTableData.push({
            name: '白昼开始时间',
            value: argument[item]
          })
        }
        break
      case 'Daytime02': //白昼情况
        if (argument[item]) {
          vueData.popTableData.push({
            name: '白昼结束时间',
            value: argument[item]
          })
        }
        break
      case 'meshSize': //网格尺寸
        if (argument[item]) {
          vueData.popTableData.push({
            name: '网格尺寸',
            value: argument[item]
          })
        }
        break
      case 'transmissionBandwidth': //数传带宽
        if (argument[item]) {
          vueData.popTableData.push({
            name: '数传带宽',
            value: argument[item]
          })
        }
        break
      case 'allocation': //地面站网资源预分配比例
        if (argument[item]) {
          vueData.popTableData.push({
            name: '地面站网资源预分配比例',
            value: argument[item]
          })
        }
        break
      case 'ckWindowsList': //'测控数传频次-测控频次
        if (argument['ckWindowsList']['controlFrequency']) {
          vueData.popTableData.push({
            name: '测控测控频次',
            value: argument['ckWindowsList']['controlFrequency']
          })
        }
        if (argument['ckWindowsList']['DataTransmissionFrequency']) {
          vueData.popTableData.push({
            name: '测控数传频次',
            value: argument['ckWindowsList']['DataTransmissionFrequency']
          })
        }
        break
      default:
        break
    }
  })
}
const closeEditTask = () => {
  vueData.isEditTask = false
}
const _getList = () => {
  let params = {
    name: vueData.search,
    type: '',
    pageNum: vueData.pageNum,
    pageSize: vueData.pageSize
  }
  creategetPage(params).then((res) => {
    if (res.code != 200) {
      return (
        ElMessage.error(res.message) ||
        ElMessage.error('网络请求失败,请稍后重试！')
      )
    }
    console.log('实验列表', res)
    // 对实验列表进行排序，将运行中的放在第一位
    vueData.taskList = res.data.experimentSubjects.sort((a, b) => {
      if (a.simRunStatus == 2 && b.simRunStatus != 2) {
        return -1
      } else if (a.simRunStatus != 2 && b.simRunStatus == 2) {
        return 1
      } else {
        return 0
      }
    })
    vueData.total = res.data.total
    _getRunList2()
  })
}
const _getListIntervel = () => {
  let params = {
    name: vueData.search,
    type: '',
    pageNum: vueData.pageNum,
    pageSize: vueData.pageSize
  }
  creategetPage(params).then((res) => {
    if (res.code != 200) {
      return (
        ElMessage.error(res.message) ||
        ElMessage.error('网络请求失败,请稍后重试！')
      )
    }
    // 对实验列表进行排序，将运行中的放在第一位
    vueData.taskList = res.data.experimentSubjects.sort((a, b) => {
      if (a.simRunStatus == 2 && b.simRunStatus != 2) {
        return -1
      } else if (a.simRunStatus != 2 && b.simRunStatus == 2) {
        return 1
      } else {
        return 0
      }
    })
    vueData.total = res.data.total
  })
}
const _getListAfterStart = () => {
  let params = {
    name: vueData.search,
    type: '',
    // pageNum: vueData.runPageNum, // 1,
    // pageSize: vueData.runPageSize // 4
    pageNum: 1,
    pageSize: 4
  }
  creategetPage(params).then((res) => {
    if (res.code != 200) {
      return (
        ElMessage.error(res.message) ||
        ElMessage.error('网络请求失败,请稍后重试！')
      )
    }
    console.log('实验列表', res)
    // 对实验列表进行排序，将运行中的放在第一位
    vueData.taskList = res.data.experimentSubjects.sort((a, b) => {
      if (a.simRunStatus == 2 && b.simRunStatus != 2) {
        return -1
      } else if (a.simRunStatus != 2 && b.simRunStatus == 2) {
        return 1
      } else {
        return 0
      }
    })
    vueData.total = res.data.total
    _getRunList2()
  })
}
const _getRunList = () => {
  let params = {
    name: vueData.search,
    type: '',
    simRunStatus: 2
  }
  creategetPage(params).then((res) => {
    if (res.code != 200) {
      return (
        ElMessage.error(res.message) ||
        ElMessage.error('网络请求失败,请稍后重试！')
      )
    }
    // vueData.taskList = res.data.experimentSubjects
    // 对实验列表进行排序，将运行中的放在第一位
    vueData.taskList = res.data.experimentSubjects.sort((a, b) => {
      if (a.simRunStatus == 2 && b.simRunStatus != 2) {
        return -1
      } else if (a.simRunStatus != 2 && b.simRunStatus == 2) {
        return 1
      } else {
        return 0
      }
    })
    if (vueData.taskList.length > 0) {
      vueData.isHaveRun = true
    } else {
      vueData.isHaveRun = false
    }
    vueData.total = res.data.total
  })
}
// 处理显示运行中场景的切换
const handleShowRunningChange = (value) => {
  if (value) {
    _getRunList()
  } else {
    _getList()
  }
}
// const loadingControl = () => {
//   // 初始化三维场景时间控制器
//   emitter.emit('showLoading', true)
//   setTimeout(() => {
//     emitter.emit('showLoading', false)
//     // store.state.sceneModule.playState = 'pause'
//     emitter.emit('initScenePauseState')
//   }, 3000)
// }
// 选择实验后根据编辑平台配置的信息绘制各种区域
const zzqy = (scenarioId) => {
  let dataController = new window.EarthPlugn.DataControl({
    earth: window.MSIMEarth,
    viewer: window.EarthViewer
  })
  if (scenarioId) {
    getZZQYData({ id: scenarioId })
      .then((res) => {
        if (res.code !== 200) {
          console.log('未获取到正确数据', res.code)
          return
        }
        res.data.bjsonScenarioData.areaPathNodes.forEach((areaData) => {
          switch (areaData.type) {
            case '军事区':
              dataController.addZZQU(areaData)
              break

            default:
              break
          }
        })
      })
      .catch((err) => {
        console.log('获取场景区域数据失败', err)
      })
  }
}
// 实验开始或继续根据场景视角跳转
const initFlyTo = (initCameraConfig) => {
  if (initCameraConfig) {
    let flyData = initCameraConfig.flyArr[0]
    let cameraController = new window.EarthPlugn.CameraControl({})
    cameraController.flyByNode(flyData)
  }
}

/**
 * 基于时间监听执行镜头飞行播报等，注意接口获取的时间需要取证
 * @param {*} timeParmas 接口获取的时间参数 包括 从实验开始的时间秒数及倍率等
 */
const experimentEventFlyControl = (timeParmas) => {
  let json = { Data: timeParmas }
  let cameraController = new window.EarthPlugn.CameraControl({})
  let flyControl = store.state.experimentModule.flyControl
  // 仿真时间
  if (!store.state.sceneModule.isReplayType && flyControl) {
    // 专为卫星开机设定
    // that.onlyForSatelliteTurnOn(json.Data.T)
    //判断是否为复盘功能进行过滤，防止影响复盘的时间轴倍速
    json.Data.T = Math.round(json.Data.T)
    let currentSceneInfo = JSON.parse(
      window.localStorage.getItem('currentSceneInfo')
    )
    if (window.EarthViewer.clock.multiplier === 1) {
      let cameraOptionList = store.state.sceneModule.cameraOptionList
      if (cameraOptionList[json.Data.T]) {
        cameraController.flyRecursionByCartesian3(cameraOptionList[json.Data.T])
      }
    }
  }
  if (store.state.experimentModule.review) {
    store.state.experimentModule.reviewTime = json.Data.T
  }
  // 计划导调
  if (store.state.AFSIMModule.dtList) {
    store.state.AFSIMModule.dtList.forEach((e) => {
      console.log('Number(e.Object.runSeconds)', Number(e.object.runSeconds))
      if (e.object && Number(e.object.runSeconds) === json.Data.T) {
        console.log('发送了', e.object)
        emitter.emit('timeDT', e.object)
      }
    })
  }
}

const _getRunList2 = () => {
  let params1 = {
    simRunStatus: 1
  }
  let params2 = {
    simRunStatus: 2
  }
  let params3 = {
    simRunStatus: 3
  }
  let runList = []
  creategetPage(params1).then((res) => {
    if (res.code == 200) {
      let dataList = res.data.experimentSubjects
      if (dataList.length > 0) {
        vueData.isHaveRun = true
      }
      for (let i = 0; i < dataList.length; i++) {
        const element = dataList[i]
        runList.push(element)
      }
    }
  })
  creategetPage(params2).then((res) => {
    if (res.code == 200) {
      let dataList = res.data.experimentSubjects
      if (dataList.length > 0) {
        vueData.isHaveRun = true
      }
      for (let i = 0; i < dataList.length; i++) {
        const element = dataList[i]
        runList.push(element)
      }
    }
  })
  creategetPage(params3).then((res) => {
    if (res.code == 200) {
      let dataList = res.data.experimentSubjects
      if (dataList.length > 0) {
        vueData.isHaveRun = true
      }
      for (let i = 0; i < dataList.length; i++) {
        const element = dataList[i]
        runList.push(element)
      }
    }
  })
  if (runList.length % vueData.runPageSize == 0) {
    vueData.runPageNum = runList.length / vueData.runPageSize
  } else {
    vueData.runPageNum = Math.floor(runList.length / vueData.runPageSize) + 1
  }
}
const handleClose_ = () => {
  emitter.emit('closeExperimentList', false)
}
onMounted(() => {
  _getList()
  // 监听样本选择后的实验开始事件
  emitter.on('sampleExperimentStarted', handleSampleExperimentStarted)
  // 监听时间控制组件的状态变化事件
  emitter.on('experimentStatusChanged', () => {
    _getList()
  })
  // 启动实验列表定时刷新，每2秒刷新一次
  experimentListRefreshTimer = setInterval(() => {
    _getListIntervel()
  }, window.EarthAPP?.IntervalConfig?.experimentListRefresh || 2000)
})

// 组件卸载时移除事件监听
onUnmounted(() => {
  emitter.off('sampleExperimentStarted', handleSampleExperimentStarted)
  emitter.off('experimentStatusChanged', () => {})

  if (startDebounceTimer) {
    clearTimeout(startDebounceTimer)
    startDebounceTimer = null
  }

  if (continueDebounceTimer) {
    clearTimeout(continueDebounceTimer)
    continueDebounceTimer = null
  }

  if (experimentListRefreshTimer) {
    clearInterval(experimentListRefreshTimer)
    experimentListRefreshTimer = null
  }
})

/**
 * 处理实验状态变化事件
 */
const handleExperimentStatusChanged = (data) => {
  if (!data || !data.sceneId) {
    return
  }

  // 查找对应的实验项
  const experimentItem = vueData.taskList.find((item) => {
    const currentSceneId = window.localStorage.getItem('currentSceneInfo')
    if (!currentSceneId) return false
    const sceneInfo = JSON.parse(currentSceneId)
    return sceneInfo.id === data.sceneId
  })

  if (experimentItem) {
    experimentItem.simRunStatus = data.status
    console.log(
      `实验 ${experimentItem.name} 状态更新为: ${
        data.status === 2 ? '运行中' : data.status === 3 ? '暂停' : '未运行'
      }`
    )
  }
}

/**
 * 处理样本选择后的实验开始事件
 */
const handleSampleExperimentStarted = (data) => {
  // 构建实验信息对象
  const experimentInfo = {
    id: data.experimentId,
    name: data.experimentName
  }

  // 执行与startsCreateBox类似的后续流程
  sceneInfoConfig(experimentInfo)

  // 配置ldrw（假设需要）
  configldrw(store.state.sceneModule.sceneInfo.name)

  // 初始化事件控制器
  if (EventController) {
    eventControllerSSEClose(EventController)
  }
  EventController = new window.EarthPlugn.EventSourceController({
    baseUrl: serverUrls.serversCommunication
  })
  EventController.initStream(store.state.sceneModule.multiplier)
  // 开始实验报告
  _startExperimentReport()
}
// /**
//  * @description 获取任务列表
//  */
// let _getTaskList = () => {}
/**
 * @description 编辑任务
 * @param { Object } item 任务数据
 */

/**
 * @description 删除任务
 * @param { Object } item 任务数据
 */

/**
 * @descrip tion 打开任务创建/编辑窗口
 */
// let openTaskCreateBox = () => {
//   store.commit('SET_TASKDATA', {})
//   vueData.createBox_show = true
//   vueData.checkBox_show = false
//   vueData.createOrEdit = '实验样本'
// }
/**
 * @description 打开任务查看窗口
 * @param { Object } item 任务数据
 * @param { Number } index 任务数据索引
 */
/**
 * @description 关闭任务创建/编辑窗口
//  */
// let closeTaskCreateBox = () => {
//   // store.commit('SET_TASKDATA', {})
//   vueData.createBox_show = false
//   vueData.checkBox_show = false
//   vueData.createOrEdit = '实验样本'
// }
/**
 * @description 关闭任务查看窗口
 */

/**
 * @description 改变页数量
 * @param { Number } pageSize 页数量
 */
const changePageSize = (pageSize) => {
  vueData.pageSize = pageSize
  _getList()
}

/**
 * @description 切换页码
 * @param { Number } pageNum 页码
 */
const changePageNum = (value) => {
  vueData.pageNum = value
  if (!vueData.showRunningOnly) {
    _getList()
  }
}

/**
 * 打开/关闭样本面板
 */
const openSamplePanel = (row) => {
  // 如果点击的是当前已打开的样本面板，则关闭它
  if (vueData.showSamplePanel && vueData.currentExperimentId === row.id) {
    vueData.showSamplePanel = false
  } else {
    // 否则打开新的样本面板
    vueData.currentExperimentId = row.id
    vueData.currentExperimentName = row.name
    vueData.showSamplePanel = true
  }
}

/**
 * 关闭样本面板
 */
const closeSamplePanel = () => {
  vueData.showSamplePanel = false
}

// 存储场景开始和结束时间
const getSceneTime = (id) => {
  let params = {
    id: id
  }
  getScenarioById(params).then((res) => {
    if (res.code == 200) {
      console.log('res.data2', res.data)
      if (res.data) {
        store.state.sceneModule.startDate = res.data.startTime
        store.state.sceneModule.endDate = res.data.endTime
        store.state.sceneModule.curSceneTime = res.data.startTime //老版本使用的场景开始时间
      }
      // for (let i = 0; i < res.data.records.length; i++) {
      //   if (res.data.records[i].id == id) {
      //     // let curSceneJson = JSON.parse(res.data.records[i].scenarioInputJson)
      //     // store.state.sceneModule.startDate = curSceneJson.sceneinfo.startdate
      //     // store.state.sceneModule.endDate = curSceneJson.sceneinfo.enddate
      //     store.state.sceneModule.startDate = res.data.records[i].startTime
      //     store.state.sceneModule.endDate = res.data.records[i].endTime
      //     store.state.sceneModule.curSceneTime = res.data.records[i].startTime //老版本使用的场景开始时间
      //   }
      // }
    }
  })
}

// 获取平台中文名称
const getChineseName = (id) => {
  let params = {
    id: id
  }
  getById(params)
    .then((res) => {
      if (res.code == 200) {
        console.log('平台中文名称', JSON.parse(res.data.platformNameMap))
        store.state.sceneModule.modelCHNNameValue1 = JSON.parse(
          res.data.platformNameMap
        )
      }
    })
    .catch((err) => {
      console.log('获取平台中文名称失败', err)
    })
}
</script>

<style lang="less" scoped>
* {
  padding: 0;
  margin: 0;
}

// #review {
.experimentList {
  width: 470px;
  height: 761px; //72vh;
  background-size: 100% 100%;
  z-index: 25;
  padding: 0;
  margin: 0;
  padding: 0 10px;
  box-sizing: border-box;
  //background-image: url('@/assets/images/com_left_bg.png');
  //background-size: 100% 100%;
  position: absolute;
  top: 13%;
  left: 3px;
  background: rgba(2, 26, 70, 0.58);
  box-shadow: 0 0 25px #1092d58a;

  .content {
    height: 75vh;
    padding: 0;
    position: relative;

    .search_create {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 10px 10px 5px 10px;

      :deep(.el-input__wrapper) {
        background-color: #2b4559 !important;
        box-shadow: 0 0 0 1px #075d89 inset;

        .el-input__inner {
          color: #ffffff;
        }
      }

      .el-button {
        background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
        width: 80px;
        height: 30px;
        color: #ffff;
        border-radius: 5px;
        margin-left: 10px;
        cursor: pointer;
        margin-right: 5px;
      }
    }

    .taskItem_box {
      width: 99%;
      padding: 0;
      margin: 0;
      height: 590px;
      text-align: left;
      margin-top: 10px;

      .item_box,
      .create_box {
        background-color: #223b5091;
        border: 1px solid #ffffff00;
        padding: 5px 15px 35px;
        cursor: pointer;
        margin: 5px 10px;

        .item_header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          color: #81d3f8;
          font-size: 16px;

          .title {
            display: flex;
            // justify-content: center;
            justify-content: flex-start;
            align-items: center;

            .experiment-name {
              max-width: 220px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              cursor: pointer;
              transition: color 0.3s ease;

              &:hover {
                color: #00cbff;
              }
            }
          }
        }

        .item_content {
          text-align: left;
          color: #b1b327;
          font-size: 12px;
          padding: 0;

          li {
            font-size: 14px;
            margin: 5px 0;
            // height: 50px;
            display: flex;
            align-items: center;
            display: -webkit-box;
            -webkit-line-clamp: 3;
            -webkit-box-orient: vertical;
            overflow: hidden;
            text-overflow: ellipsis;
            margin-left: 6px;
            line-height: 28px;

            &.describe {
              display: -webkit-box;
              -webkit-box-orient: vertical;
              -webkit-line-clamp: 3;
              overflow: hidden;
              text-overflow: ellipsis;
            }
          }
        }
      }

      .select_style {
        background-color: #02a7f04a;
        border-color: #02a7f0;
      }
    }
  }

  .page_box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 40px;
    margin: 10px 0;
    color: #fff;

    :deep(.el-pagination) {
      justify-content: center;
    }
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 10px;
    padding: 5px 15px;
    border-bottom: 1px solid #0b3855;
    height: 35px;
    font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
    font-weight: 700;
    font-style: normal;
    font-size: 19px;
    color: #c2d7ee;
    padding-top: 16px;
    .close_sty {
      width: 20px;
      height: 20px;
      position: absolute;
      top: 22px;
      right: 10px;
      cursor: pointer;
    }
  }
}

:deep(.el-form-item) {
  margin-bottom: 10px;
}

:deep(.el-button) {
  padding: 6px 10px;
}

// 为实验列表中的操作按钮添加样式
.taskItem_box :deep(.el-button) {
  background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
  width: 85px;
  height: 28px;
  color: rgba(255, 255, 255, 0.9);
  border-radius: 3px;
  margin: 2px 0;
  cursor: pointer;
  border: none;
  padding: 0;
  font-size: 12px;
  display: block;
  text-align: center;
  line-height: 28px;
  transition: all 0.3s ease;
  background-size: 100% 100%;
  background-repeat: no-repeat;
  filter: brightness(0.9);

  &:hover:not(:disabled) {
    box-shadow: 0 0 10px rgba(16, 146, 213, 0.8);
    color: #ffffff;
    filter: brightness(1.05);
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
    box-shadow: none;
    background: rgba(255, 255, 255, 0.15);
    color: rgba(255, 255, 255, 0.7);
    border: 1px solid rgba(255, 255, 255, 0.3);
    filter: brightness(0.8);
  }
}

.btn_list {
  width: 95px; // 调整宽度以适应减小后的按钮
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  padding-right: 10px;

  :deep(.el-icon) {
    font-size: 16px;
    margin-right: 4px;

    &:last-child {
      margin: 0;
    }
  }
}

:deep(.el-dialog),
.el-dialog,
:deep(.el-dialog__body) {
  background: #2e4b64 !important;
  color: #fff !important;
}

:deep(.el-dialog) {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate3d(-50%, -50%, -50%);
  background: rgba(8, 36, 62, 0.7) !important;
  color: #fff;
  z-index: 10;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px;
    border-bottom: 1px solid #2e4b64;
    color: #fff;
    font-size: 18px;
  }

  .footer {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding: 10px;
  }
}

:deep(.el-form-item__label) {
  color: #fff;
  justify-content: left;
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

:deep(.el-textarea__inner) {
  height: 90px;
  border-radius: 5px;
  box-shadow: none;
  color: #ffff;
  background-color: #2b4559 !important;
  box-shadow: 0 0 0 1px #075d89 inset !important;
}

::v-deep(.el-select__placeholder) {
  color: #fff;
}

::v-deep .el-table td.el-table__cell,
::v-deep .el-table th.el-table__cell.is-leaf,
::v-deep .el-table__body-wrapper {
  background: #2b4559 !important;
  color: #a3a6ad;
}

.el-table {
  --el-table-border-color: #075d89;
}
</style>
