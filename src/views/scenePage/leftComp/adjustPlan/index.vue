<template>
  <div
    class="experimentList animate__animated animate__fadeInLeftBig animate__delay-0.3s"
    v-show="vueData.showList"
  >
    <div class="header">实验管理</div>
    <div class="content">
      <div class="search_create">
        <el-input
          v-model="vueData.search"
          :suffix-icon="Search"
          style="width: 290px"
          placeholder="请输入实验名称"
          clearable
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
          <div class="item_header">
            <span class="title">
              <img src="~@/assets/images/rwty/想定查询.svg" alt="" />
              <span>{{ item.name }}</span>
            </span>
            <div class="btn_list">
              <el-tooltip
                class="box-item"
                effect="dark"
                content="开始实验"
                placement="top-start"
              >
                <el-icon class="list-icon" @click.stop="startsCreateBox(item)"
                  ><SwitchButton
                /></el-icon>
              </el-tooltip>
              <!-- <el-tooltip
                class="box-item"
                effect="dark"
                content="实验详情"
                placement="top-start"
              >
                <el-icon class="list-icon" @click.stop="_editTask(item)"
                  ><Edit
                /></el-icon>
              </el-tooltip> -->
              <el-tooltip
                class="box-item"
                effect="dark"
                content="观看推演"
                placement="top-start"
              >
                <el-icon
                  class="list-icon"
                  @click.stop="ContinueRunCurrentScene(item)"
                  ><Comment
                /></el-icon>
              </el-tooltip>
              <el-tooltip
                class="box-item"
                effect="dark"
                content="流程配置"
                placement="top-start"
              >
                <el-icon
                  class="list-icon"
                  @click.stop="_configExperimentReportContent(item)"
                  ><EditPen
                /></el-icon>
              </el-tooltip>
            </div>
          </div>
          <ul class="item_content">
            <!-- <li>实验名称:{{ item.name }}</li> -->
            <li class="describe">关联场景:{{ item.sceneName }}</li>
            <li>规划时间:{{ item.createTime }}</li>
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
      <!-- <reportConfig ref="reportConfigRef"></reportConfig> -->
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
          :disabled="true"
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
  <!-- </div> -->
</template>

<script setup>
import { reactive, onMounted, onUnmounted, watch, ref } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import emitter from '@/utils/eventbus'
import selfPage from '@/components/page.vue'
import { creategetPage } from '@/service/experiment/experiment'
// import reportConfig from '../components/reportConfig.vue'
import {
  startExperiment,
  getExpeSampleMgtPage
} from '@/service/combatSimulation.js'
import { eventControllerSSEClose } from '@/utils/mapTools'
import commonMethods from '@/utils/commonMethods/commonMethods.js'
import { getPAStatic } from '@/service/SSE.js'
import { getZZQYData } from '@/service/experiment/experiment.js'
import {
  SwitchButton,
  Edit,
  View,
  Hide,
  EditPen,
  Comment
} from '@element-plus/icons-vue'
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
  pageSize: 5,
  total: 0,
  samplePageNum: 1,
  samplePageSize: 10,
  sampleTotal: 0,
  selectIndex: -1,
  listener: null
})

watch(
  () => store.getters.get_isSimulationList,
  (newVal) => {
    vueData.showList = newVal
  },
  { deep: true, immediate: true }
)
// // 通过 ref 引用子组件实例
// const reportConfigRef = ref(null)

// // 切换子组件显示/隐藏的方法
// const toggleChildVisibility = () => {
//   if (reportConfigRef.value) {
//     reportConfigRef.value.toggleReportConfigPaneVisibility()
//   }
// }
const { configldrw } = commonMethods()
/****
 * 开始实验
 */
const startsCreateBox = (row) => {
  window.localStorage.setItem('isRestartScene', false)
  window.localStorage.setItem('currentSceneInfo', JSON.stringify(row))
  // // 开启加载动画
  // loadingControl()
  // 通过切换地球实现地球初始化
  store.state.sceneModule.showEarth = !store.state.sceneModule.showEarth
  // 开启实验加载过程动画
  setTimeout(() => {
    store.state.sceneModule.showSatellite = true
  }, 500)
  sceneInfoConfig(row)
  configldrw(store.state.sceneModule.sceneInfo.name)
  // 地球切换完成后才开始实验
  // emitter.on('startExperiment', (value) => {})
  startExperiment(row.id).then((res) => {
    if (res.code != 200) {
      return (
        ElMessage.error(res.data) ||
        ElMessage.error('网络请求失败,请稍后重试！')
      )
    }
    // 开启实验加载过程
    // ElMessage.success(`[${row.name}]${res.data}!`)
    // store.state.sceneModule.experimentInfo.name = row.name
    // store.state.sceneModule.experimentInfo.info = res.data

    if (EventController) {
      eventControllerSSEClose(EventController)
    }
    EventController = new window.EarthPlugn.EventSourceController({
      baseUrl: serverUrls.serversCommunication
    })
    EventController.initStream()
    _startExperimentReport()
    switch (row.id) {
      case '11':
        initFlyTo()
        break

      default:
        break
    }
    // 绘制对应场景作战区域数据
    // 获取对应场景作战区域数据
    // zzqy(row.scenarioId)
  })
}
/**
 * 提交编辑
 */
// const createCamp = () => {}
/****
 * 配置实验过程中汇报的内容
 */
const _configExperimentReportContent = () => {
  store.state.experimentModule.experimentReportList = [
    {
      position: {
        x: 119.3316,
        y: 26.9142,
        z: 300000
      },
      duration: 2,
      orientation: {
        heading: 6.283185307179586,
        pitch: -1.570670086201004,
        roll: 0
      },
      time: 200,
      id: 'test1',
      show: true,
      message:
        '据台媒“联合新闻网”报道，台湾高雄兴达电厂9日晚新2号燃气复循环机组在测试时突发爆炸，现场火光冲天。所幸此次事故未造成人员伤亡。',
      rendered: false
    },
    {
      position: {
        x: 119.5316,
        y: 26.9142,
        z: 300000
      },
      duration: 2,
      orientation: {
        heading: 6.283185307179586,
        pitch: -1.570670086201004,
        roll: 0
      },
      time: 80,
      id: 'test2',
      show: true,
      message:
        '据台媒“联合新闻网”报道，台湾高雄兴达电厂9日晚新2号燃气复循环机组在测试时突发爆炸，现场火光冲天。所幸此次事故未造成人员伤亡。',
      rendered: false
    }
  ]
  toggleChildVisibility()

  let cameraController = new window.EarthPlugn.CameraControl({})
  cameraController.flyByNode(store.state.experimentModule.experimentReportList)
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
  store.state.experimentModule.experimentReportList.forEach((e) => {
    if (e.time >= store.state.AFSIMModule.ATValue) {
      // 1.1 判断当前AT，已经在当前AT之前的事件不列为监听内容，未监听的内容推到监听队列中
      curExperimentReportList.push(e)
    }
  })
  console.log('当前仍需要执行的事件', curExperimentReportList)
  let cameraController = new window.EarthPlugn.CameraControl({})
  // 1 开启监听
  setInterval(() => {
    curExperimentReportList.forEach((e) => {
      // 1.2 基于场景判断是否到达事件所在时间点
      if (e.time <= store.state.AFSIMModule.ATValue && e.rendered === false) {
        console.log('还没执行的事件', e)
        // 1.2 如果到了则判断是否已经执行，如果没执行则执行该事件并暂停场景
        cameraController.flyByNode(e)
        e.rendered = true
      }
    })
  }, 1000)

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
const ContinueRunCurrentScene = (row) => {
  window.localStorage.setItem('isRestartScene', false)
  window.localStorage.setItem('currentSceneInfo', JSON.stringify(row))
  // 开启加载动画
  // loadingControl()
  sceneInfoConfig(row)
  configldrw(store.state.sceneModule.sceneInfo.name)
  if (EventController) {
    eventControllerSSEClose(EventController)
  }
  EventController = new window.EarthPlugn.EventSourceController({
    baseUrl: serverUrls.serversCommunication
  })
  EventController.initStream()
  _startExperimentReport()
  switch (row.id) {
    case '11':
      initFlyTo()
      break

    default:
      break
  }
  // 绘制对应场景作战区域数据
  // zzqy(row.scenarioId)
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

onMounted(() => {
  // vueData.systemTitles = window.localStorage.getItem('systemTitle')
  _getList()
  // 监听样本实验开始事件
  emitter.on('sampleExperimentStarted', handleSampleExperimentStarted)
})

onUnmounted(() => {
  // 移除事件监听
  emitter.off('sampleExperimentStarted', handleSampleExperimentStarted)
})
// /**
//  * @description 获取任务列表
//  */
// let _getTaskList = () => {}
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
    vueData.taskList = res.data.experimentSubjects
    vueData.total = res.data.total
  })
}
const loadingControl = () => {
  // 初始化三维场景时间控制器
  emitter.emit('showLoading', true)
  setTimeout(() => {
    emitter.emit('showLoading', false)
    // store.state.sceneModule.playState = 'pause'
    emitter.emit('initScenePauseState')
  }, 3000)
}
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
const initFlyTo = () => {
  // 视角跳转到目标区域
  window.EarthViewer.camera.flyTo({
    // destination: new window.MSIMEarth.Cartesian3.fromDegrees(109.87, 34.706, 21851000),
    destination: new window.MSIMEarth.Cartesian3(
      -3904753.0681058243,
      6961998.482682405,
      3626775.1641400023
    ),
    duration: 3,
    orientation: {
      heading: 6.283185307179586,
      pitch: -1.5707578993812068,
      roll: 0
    },
    complete: () => {}
  })
}
/**
 * 处理样本实验开始事件
 */
function handleSampleExperimentStarted({
  experimentId,
  experimentName,
  selectedSamples
}) {
  // 构建实验信息对象
  const experimentInfo = {
    id: experimentId,
    name: experimentName
  }

  // 配置场景信息
  sceneInfoConfig(experimentInfo)

  // 配置ldrw
  configldrw(store.state.sceneModule.sceneInfo.name)

  // 初始化事件控制器
  if (EventController) {
    eventControllerSSEClose(EventController)
  }
  EventController = new window.EarthPlugn.EventSourceController({
    baseUrl: serverUrls.serversCommunication
  })
  EventController.initStream()

  // 启动实验报告
  _startExperimentReport()

  // 处理特定实验的逻辑
  switch (experimentId) {
    case '11':
      initFlyTo()
      break
    default:
      break
  }
}

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
  _getList()
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
        padding: 0 15px;
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
              -webkit-line-clamp: 2;
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
    display: block;
    width: 67%;
    height: 40px;
    line-height: 49px;
    color: #fff;
    :deep(.el-pagination) {
      justify-content: flex-end;
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
  }
}
:deep(.el-form-item) {
  margin-bottom: 10px;
}

:deep(.el-button) {
  padding: 6px 10px;
}
.btn_list {
  width: 76px;
  display: flex;
  :deep(.el-icon) {
    font-size: 19px;
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
