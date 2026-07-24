<template>
  <div
    class="eventList animate__animated animate__fadeInRightBig animate__delay-0.3s"
    :class="{ expanded: isExpanded }"
    v-show="showList || visible"
  >
    <div class="header">
      <span>演播列表</span>
      <div class="header-icons">
        <el-tooltip
          content="场景初始视角和想定信息配置"
          placement="top"
          v-if="!isShiyanRole"
        >
          <el-icon class="view-config-btn" @click="showViewConfigPanel">
            <Setting />
          </el-icon>
        </el-tooltip>
        <el-tooltip
          :content="flyControl ? '关闭镜头跳转' : '开启镜头跳转'"
          placement="top"
        >
          <el-switch
            v-model="flyControl"
            @change="toggleFlyControl"
            class="fly-control-switch"
            active-color="#00cbff"
            inactive-color="#909399"
          />
        </el-tooltip>
        <el-tooltip
          :content="isExpanded ? '收起面板' : '展开面板'"
          placement="top"
        >
          <el-icon class="expand-btn" @click="toggleExpand">
            <ArrowUp v-if="isExpanded" />
            <ArrowDown v-else />
          </el-icon>
        </el-tooltip>
        <el-icon class="close-btn" @click="closePanel">
          <Close />
        </el-icon>
      </div>
    </div>
    <div class="content">
      <div
        class="search_create"
        style="display: flex; align-items: center; gap: 15px"
      >
        <el-input
          v-model="search"
          :suffix-icon="Search"
          placeholder="请输入演播名称"
          clearable
          @keyup.enter="filterList"
        />
        <div class="voice-select-container">
          <!-- <span class="voice-select-label">播报音源:</span> -->
          <el-select
            v-model="defaultSpeaker"
            placeholder="选择播报音源"
            style="width: 180px"
            class="voice-select"
          >
            <el-option
              v-for="item in _speakersList"
              :key="item.value"
              :label="item.label"
              :value="item.value"
            ></el-option>
          </el-select>
        </div>
        <span v-if="!isShiyanRole">
          <el-button type="primary" :icon="Plus" @click="addEvent">
            新增
          </el-button>
        </span>
      </div>
      <div class="eventItem_box">
        <div
          class="item_box"
          v-for="(item, key, index) in filteredEvents"
          :key="item.id || index"
          :class="selectIndex == index ? 'select_style' : ''"
        >
          <div class="item_info">
            <div class="item_header">
              <span class="title">
                <img src="~@/assets/images/rwty/想定查询.svg" alt="" />
                <span class="group-name">{{ item.group || '' }}</span>
                <span :title="item.title || item.message" class="event-name">{{
                  item.title || item.message || `演播${index + 1}`
                }}</span>
              </span>
            </div>
            <ul class="item_content">
              <li class="time">触发时间: {{ formatTimeFromSeconds(key) }}</li>
              <li class="describe detail">
                详情:
                <span
                  class="detail-content"
                  :title="item.flyArr?.[0]?.identifyInfo || '无'"
                >
                  {{ item.flyArr?.[0]?.identifyInfo || '无' }}
                </span>
                <div class="tooltip-wrapper" v-if="false">
                  <el-icon
                    class="position-icon"
                    @click.stop="editPosition(item, index, key)"
                  >
                    <Location />
                  </el-icon>
                </div>
              </li>
            </ul>
          </div>
          <div class="btn_list">
            <div class="tooltip-wrapper">
              <el-icon
                class="list-icon"
                size="14"
                @click.stop="audioEvent(item, index)"
              >
                <Headset />
              </el-icon>
            </div>
            <div class="tooltip-wrapper" v-if="!isShiyanRole">
              <el-icon
                class="list-icon"
                size="14"
                @click.stop="editEvent(item, index, key)"
              >
                <EditPen />
              </el-icon>
            </div>
            <div class="tooltip-wrapper" v-if="!isShiyanRole">
              <el-icon
                class="list-icon"
                size="14"
                @click.stop="deleteEvent(item, index, key)"
              >
                <Delete />
              </el-icon>
            </div>
          </div>
        </div>
      </div>
      <div class="bottom-actions">
        <div class="action-buttons" v-if="!isShiyanRole">
          <!-- <el-button type="primary" @click="saveAll"> 全部保存 </el-button> -->
          <el-button type="primary" @click="exportEvents"> 导出演播 </el-button>
          <el-button type="primary" @click="triggerImport">
            导入演播
          </el-button>
          <el-button type="danger" @click="clearAllEvents">
            清空演播
          </el-button>
          <input
            type="file"
            ref="fileInputRef"
            style="display: none"
            accept=".json"
            @change="importEvents"
          />
        </div>
        <!-- <selfPage
          class="page_box"
          v-if="total > 0"
          :currentPage="pageNum"
          :pageSize="pageSize"
          :total="total"
          @handleSizeChange="changePageSize"
          @handleCurrentChange="changePageNum"
        ></selfPage> -->
      </div>
    </div>

    <!-- 演播编辑弹窗 -->
    <div v-if="isEditEvent" class="dialog-backdrop" @click="closeEditEvent">
      <div class="dialog-container event-dialog" @click.stop>
        <div class="dialog-header">
          <div class="dialog-title">{{ editTitle }}</div>
          <el-icon class="dialog-close" @click="closeEditEvent">
            <Close />
          </el-icon>
        </div>
        <div class="dialog-body">
          <el-form :model="currentEvent" label-width="130px">
            <el-form-item label="演播起始时间">
              <!-- <el-input
                v-model="currentEditIndex"
                placeholder="请输入时间节点"
              ></el-input> -->
              <el-date-picker
                v-model="inputTime"
                type="datetime"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="选择时间节点"
                :disabledDate="disabledDateFn"
                :disabled-hours="disabledHours"
                :disabled-minutes="disabledMinutes"
                :disabled-seconds="disabledSeconds"
                :popper-append-to-body="false"
                placement="bottom-start"
                id="table-time-ym"
              />
            </el-form-item>
            <el-form-item label="AI播音员">
              <el-select
                v-model="currentEvent.speaker"
                placeholder="请选择播音员"
                class="voice-select"
              >
                <el-option
                  v-for="item in _speakersList"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="演播标题">
              <el-input
                v-model="currentEvent.message"
                :placeholder="
                  editTitle == '新增演播'
                    ? '请输入演播标题'
                    : currentEvent.message
                    ? '请输入演播标题'
                    : '演播' + Number(Number(selectIndex) + 1)
                "
              ></el-input>
            </el-form-item>
            <el-form-item label="演播内容">
              <el-input
                v-model="currentEvent.flyArr[0].identifyInfo"
                type="textarea"
                maxlength="50"
                show-word-limit
                :rows="2"
                placeholder="请输入演播详情"
              ></el-input>
            </el-form-item>
            <el-form-item label="多维呈现实体定位">
              <div class="campBox">
                <!-- <div
                  class="campItem"
                  v-for="item in campList"
                  :key="item.value"
                  @click="_getAllPlatByScenarioId(item.value)"
                >
                  {{ item.label }}
                </div> -->
                <el-button
                  size="small"
                  :type="index == selectIndex_3D ? 'primary' : ''"
                  v-for="(item, index) in campList"
                  :key="item.value"
                  @click="_getAllPlatByScenarioId(item.value, index)"
                  >{{ item.label }}</el-button
                >
              </div>
              <el-select
                v-model="currentEvent.flyArr[0].UEId"
                placeholder="请选择实体"
                class="voice-select"
                filterable
                style="width: 200px"
              >
                <el-option
                  v-for="item in platAllList"
                  :key="item.platformEnName"
                  :label="item.platformCnName"
                  :value="item.platformEnName"
                ></el-option>
              </el-select>
              <span class="waning">
                若实体列表为空，则该想定未关联实体列表
              </span>
            </el-form-item>
            <el-form-item label="镜头位置">
              <div
                style="
                  display: flex;
                  gap: 10px;
                  align-items: flex-start;
                  flex-direction: column;
                "
              >
                <span>
                  <el-input
                    v-model="currentEvent.flyArr[0].position_show.x"
                    type="number"
                    :min="-180"
                    :max="180"
                    :step="0.01"
                    placeholder="经度"
                    style="width: 180px"
                  ></el-input
                  >(经度)
                </span>
                <span>
                  <el-input
                    v-model="currentEvent.flyArr[0].position_show.y"
                    type="number"
                    :min="-90"
                    :max="90"
                    :step="0.01"
                    placeholder="纬度"
                    style="width: 180px"
                  ></el-input
                  >(纬度)
                </span>
                <span>
                  <el-input
                    v-model="currentEvent.flyArr[0].position_show.z"
                    type="number"
                    :step="1"
                    placeholder="高度"
                    style="width: 180px"
                  ></el-input
                  >(镜头高度【米】)
                </span>
                <el-button type="primary" @click="selectedPoint"
                  >获取当前位置</el-button
                >
              </div>
            </el-form-item>
            <!-- <el-form-item label="持续时间(s)">
              <el-input-number v-model="currentEvent.flyArr[0].duration" :min="0" :step="0.5"
                style="width: 100%"></el-input-number>
            </el-form-item>
            <el-form-item label="飞行间隔(ms)">
              <el-input-number v-model="currentEvent.flyArr[0].flyInterval" :min="0" :step="1000"
                style="width: 100%"></el-input-number>
            </el-form-item>
            <el-form-item label="全局飞行间隔(ms)">
              <el-input-number v-model="currentEvent.flyInterval" :min="0" :step="1000"
                style="width: 100%"></el-input-number>
            </el-form-item> -->
          </el-form>
          <el-button type="primary" @click="audioEvent(currentEvent, index)">
            试听
          </el-button>
          <el-button type="primary" @click="saveEvent">保存</el-button>
          <el-button @click="closeEditEvent">取消</el-button>
        </div>
      </div>
    </div>

    <!-- 空间位置编辑弹窗 -->
    <div
      v-if="isEditPosition"
      class="dialog-backdrop"
      @click="closeEditPosition"
    >
      <div class="dialog-container position-dialog" @click.stop>
        <div class="dialog-header">
          <div class="dialog-title">编辑空间位置</div>
          <el-icon class="dialog-close" @click="closeEditPosition">
            <Close />
          </el-icon>
        </div>
        <div class="dialog-body">
          <el-form :model="currentPosition" label-width="120px">
            <el-form-item label="位置坐标">
              <div style="display: flex; gap: 10px; align-items: center">
                <el-input
                  v-model="currentPosition.position.x"
                  type="number"
                  :min="-180"
                  :max="180"
                  :step="0.01"
                  placeholder="经度"
                  style="width: 80px"
                ></el-input>
                <el-input
                  v-model="currentPosition.position.y"
                  type="number"
                  :min="-90"
                  :max="90"
                  :step="0.01"
                  placeholder="纬度"
                  style="width: 80px"
                ></el-input>
                <el-input
                  v-model="currentPosition.position.z"
                  type="number"
                  :step="1"
                  placeholder="高度"
                  style="width: 80px"
                ></el-input>
                <el-button type="primary" @click="selectedPoint"
                  >选点</el-button
                >
              </div>
            </el-form-item>
            <el-form-item label="持续时间(s)">
              <el-input-number
                v-model="currentPosition.duration"
                :min="0"
                :step="0.5"
                style="width: 100%"
              ></el-input-number>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="savePosition">保存</el-button>
              <el-button @click="closeEditPosition">取消</el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>

    <!-- 视角配置面板弹窗 -->
    <div
      v-if="isViewConfigPanelVisible"
      class="dialog-backdrop"
      @click="closeViewConfigPanel"
    >
      <div class="dialog-container view-config-dialog" @click.stop>
        <div class="dialog-header">
          <div class="dialog-title">场景初始视角和想定信息配置</div>
          <el-icon class="dialog-close" @click="closeViewConfigPanel">
            <Close />
          </el-icon>
        </div>
        <div class="dialog-body">
          <el-form
            :model="viewConfigData"
            label-width="120px"
            style="width: 100%"
          >
            <el-form-item label="位置坐标">
              <div
                style="
                  display: flex;
                  gap: 10px;
                  align-items: center;
                  flex-wrap: wrap;
                "
              >
                <el-input
                  v-model="viewConfigData.position.x"
                  type="number"
                  :min="-180"
                  :max="180"
                  :step="0.01"
                  placeholder="经度"
                  style="width: 100px"
                ></el-input>
                <el-input
                  v-model="viewConfigData.position.y"
                  type="number"
                  :min="-90"
                  :max="90"
                  :step="0.01"
                  placeholder="纬度"
                  style="width: 100px"
                ></el-input>
                <el-input
                  v-model="viewConfigData.position.z"
                  type="number"
                  :step="1"
                  placeholder="高度"
                  style="width: 100px"
                ></el-input>
                <el-button type="primary" @click="getCameraPosition"
                  >获取摄像机当前位置</el-button
                >
                <el-button type="primary" @click="previewView"
                  >视角预览</el-button
                >
              </div>
            </el-form-item>

            <!-- 想定内置部分 -->
            <el-divider>想定内置</el-divider>
            <el-form-item label="想定背景">
              <el-input
                v-model="viewConfigData.scenario.scenarioBackground"
                placeholder="请输入想定背景"
                type="textarea"
                :rows="3"
              ></el-input>
            </el-form-item>
            <el-form-item label="任务简报">
              <el-input
                v-model="viewConfigData.scenario.missionBrief"
                placeholder="请输入任务简报"
                type="textarea"
                :rows="3"
              ></el-input>
            </el-form-item>
            <el-form-item label="任务目的">
              <el-input
                v-model="viewConfigData.scenario.missionObjective"
                placeholder="请输入任务目的"
                type="textarea"
                :rows="3"
              ></el-input>
            </el-form-item>
          </el-form>
        </div>
        <div
          style="
            display: flex;
            justify-content: flex-end;
            padding: 10px 20px;
            background-color: rgba(0, 0, 0, 0.1);
          "
        >
          <el-button
            type="success"
            @click="saveViewConfig"
            style="
              margin-right: 10px;
              background-color: #67c23a;
              border-color: #67c23a;
            "
            >保存</el-button
          >
          <el-button @click="closeViewConfigPanel">取消</el-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import {
  Search,
  Plus,
  EditPen,
  Delete,
  Refresh,
  Location,
  Setting,
  Close,
  Headset,
  ArrowUp,
  ArrowDown
} from '@element-plus/icons-vue'
import selfPage from '@/components/page.vue'
import {
  queryExperimentJsonFile,
  createOrUpdate,
  getAllPlatByScenarioId
} from '@/service/experiment/experiment'
import { tts, speakersList } from '@/service/videoServer/videoManagement'
import {
  speechSynthesis,
  audio
} from '@/components/content/identify/hooks/index'

const props = defineProps({
  showList: {
    type: Boolean,
    default: true
  },
  visible: {
    type: Boolean,
    default: false
  },
  currentSpeed: {
    type: Number,
    default: 1
  }
})

const emit = defineEmits(['update:showList', 'update:visible', 'close'])

// 状态管理
const store = useStore()
const events = ref({})
const search = ref('')
const selectIndex = ref(-1)
const isEditEvent = ref(false)
const editTitle = ref('新增演播')
const currentEvent = ref({})
const currentEditIndex = ref(0)
const currentEditIndexOld = ref(-1)
const inputTime = ref('')
// 文件输入ref
const fileInputRef = ref(null)

const platAllList = ref([])

const selectIndex_3D = ref(0)

const campList = ref([
  {
    label: '全部',
    value: ''
  },
  {
    label: '红方',
    value: 'red'
  },
  {
    label: '蓝方',
    value: 'blue'
  },
  {
    label: '绿方',
    value: 'green'
  },
  {
    label: '紫方',
    value: 'purple'
  }
])

// 读取localStorage中的roleCode，判断是否为shiyan角色
const roleCode = ref(localStorage.getItem('roleCode') || '')
const isShiyanRole = computed(() => roleCode.value === 'shiyan')

// 默认语音
const defaultSpeaker = ref('')

// 监听默认语音变化，更新所有演播的播音员配置
watch(defaultSpeaker, (newSpeaker) => {
  if (newSpeaker) {
    // 更新所有现有演播的播音员配置
    for (const key in events.value) {
      if (Object.hasOwn(events.value, key)) {
        events.value[key].speaker = newSpeaker
      }
    }
    // 如果当前正在编辑演播，也更新编辑表单中的播音员配置
    if (isEditEvent.value && currentEvent.value) {
      currentEvent.value.speaker = newSpeaker
    }
  }
})

// 面板展开状态
const isExpanded = ref(false)

// 切换面板展开/收起
const toggleExpand = () => {
  isExpanded.value = !isExpanded.value
}

// 获取限制时间范围
const getTimeRange = () => {
  const startTime = new Date(store.state.sceneModule.startDate)
  const endTime = new Date(store.state.sceneModule.endDate)
  console.log('startTime, endTime', startTime, endTime)
  return { startTime, endTime }
}
const getSceneTime = (id) => {
  // console.log('scenarioIdStr',id)
  let params = {
    id: id
    // pageNum: 1,
    // pageSize: 200
  }
  getScenarioByPage(params).then((res) => {
    if (res.code == 200) {
      for (let i = 0; i < res.data.records.length; i++) {
        if (res.data.records[i].id == id) {
          // let curSceneJson = JSON.parse(res.data.records[i].scenarioInputJson)
          // store.state.sceneModule.startDate = curSceneJson.sceneinfo.startdate
          // store.state.sceneModule.endDate = curSceneJson.sceneinfo.enddate
          store.state.sceneModule.startDate = res.data.records[i].startTime
          store.state.sceneModule.endDate = res.data.records[i].endTime
          store.state.sceneModule.curSceneTime = res.data.records[i].startTime //老版本使用的场景开始时间
        }
      }
    }
  })
}

// 位置编辑相关状态
const isEditPosition = ref(false)
const currentPosition = ref({})
const currentPositionIndex = ref(-1)

// 视角配置面板相关状态
const isViewConfigPanelVisible = ref(false)
const viewConfigData = ref({
  position: {
    x: 0,
    y: 0,
    z: 0
  },
  orientation: {
    heading: 0,
    pitch: 0,
    roll: 0
  },
  scenario: {
    scenarioBackground: '',
    missionBrief: '',
    missionObjective: ''
  }
})

// 从store中获取flyControl状态
const flyControl = computed(() => store.state.experimentModule.flyControl)

// 切换flyControl状态
const toggleFlyControl = (value) => {
  // 更新store中的状态
  store.commit('experimentModule/SET_FLY_CONTROL', value)
  // 发送演播或调用方法来控制飞行控制功能
  console.log('flyControl状态切换为:', value)
  // 可以在这里添加具体的飞行控制逻辑，例如调用cameraController的相关方法
  if (cameraController && cameraController.setFlyControl) {
    cameraController.setFlyControl(value)
  }
}

// 格式化时间秒数为年月日时分秒字符串
const formatTimeFromSeconds = (seconds) => {
  console.log(seconds)
  if (!seconds || seconds === '-1') return ''
  // 获取场景开始时间
  const startDate = new Date(store.state.sceneModule.startDate)
  // 计算目标时间
  const targetDate = new Date(startDate.getTime() + Number(seconds) * 1000)
  // 格式化时间
  const year = targetDate.getFullYear()
  const month = String(targetDate.getMonth() + 1).padStart(2, '0')
  const day = String(targetDate.getDate()).padStart(2, '0')
  const hours = String(targetDate.getHours()).padStart(2, '0')
  const minutes = String(targetDate.getMinutes()).padStart(2, '0')
  const secs = String(targetDate.getSeconds()).padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${secs}`
}

// 分页
const pageNum = ref(1)
const pageSize = ref(5)
const total = ref(0)

const _speakersList = ref([])

let cameraController = new window.EarthPlugn.CameraControl({})

const saveAll = () => {}

const cartesiantoDegrees = (data) => {
  let cartographic = window.MSIMEarth.Cartographic.fromCartesian(data)
  let lng = window.MSIMEarth.Math.toDegrees(cartographic.longitude)
  let lat = window.MSIMEarth.Math.toDegrees(cartographic.latitude)
  var alt = cartographic.height
  return { lng, lat, alt }
}

const selectedPoint = () => {
  let cameraPosition = window.EarthViewer.camera.position
  let { lng, lat, alt } = cartesiantoDegrees(cameraPosition)
  currentEvent.value.flyArr[0].position_show.x = lng
  currentEvent.value.flyArr[0].position_show.y = lat
  currentEvent.value.flyArr[0].position_show.z = alt
  currentEvent.value.flyArr[0].position.x = cameraPosition.x
  currentEvent.value.flyArr[0].position.y = cameraPosition.y
  currentEvent.value.flyArr[0].position.z = cameraPosition.z
  currentEvent.value.flyArr[0].orientation.heading =
    window.EarthViewer.camera.heading
  currentEvent.value.flyArr[0].orientation.pitch =
    window.EarthViewer.camera.pitch
  currentEvent.value.flyArr[0].orientation.roll = window.EarthViewer.camera.roll
  return
  window.getCameraInfo = (cameraInfo) => {
    console.log(cameraInfo)
    currentEvent.value.flyArr[0].position.x = cameraInfo.lng
    currentEvent.value.flyArr[0].position.y = cameraInfo.lat
    currentEvent.value.flyArr[0].position.z = cameraInfo.alt
    window.getCameraInfo = null
  }
}

// 过滤后的演播列表
const filteredEvents = computed(() => {
  let result = events.value
  // 创建一个新对象，排除key为-1的元素并根据搜索关键词过滤
  const filteredResult = {}
  for (const key in result) {
    if (Object.hasOwn(result, key) && key !== '-1') {
      const event = result[key]
      // 如果搜索关键词为空，或者演播标题、消息或详情包含搜索关键词，则保留该演播
      if (
        !search.value ||
        (event.title && event.title.includes(search.value)) ||
        (event.message && event.message.includes(search.value)) ||
        (event.flyArr?.[0]?.identifyInfo &&
          event.flyArr[0].identifyInfo.includes(search.value))
      ) {
        filteredResult[key] = event
      }
    }
  }
  // 更新总数
  total.value = Object.keys(filteredResult).length
  return filteredResult
})

const getSpeakersList = () => {
  const params = {}
  speakersList(params).then((res) => {
    console.log('broadcasters', res.data)
    if (res.code == 200) {
      _speakersList.value = res.data
      // 如果默认语音未设置，自动选择第一个播音员
      if (!defaultSpeaker.value && _speakersList.value.length > 0) {
        defaultSpeaker.value = _speakersList.value[0].value
      }
    } else {
      ElMessage.error('播音员获取失败')
    }
  })
}

// 过滤列表
const filterList = () => {
  pageNum.value = 1
}

// 加载演播数据
const loadEvents = async (list) => {
  // try {
  //   // 从本地JSON文件加载演播数据
  //   const response = await fetch('/static/config/json/event.json')
  //   const data = await response.json()
  //   // 直接使用data作为演播列表
  //   events.value = data || []
  //   pageNum.value = 1
  //   ElMessage.success('演播加载成功')
  // } catch (error) {
  //   console.error('加载演播失败:', error)
  //   ElMessage.error('加载演播失败')
  //   // 加载失败时使用空数组
  //   events.value = []
  // }
  try {
    // 从本地JSON文件加载演播数据
    const data = list
    // 直接使用data作为演播列表
    events.value = data || {}
    pageNum.value = 1
    ElMessage.success('演播加载成功')
  } catch (error) {
    console.error('加载演播失败:', error)
    ElMessage.error('加载演播失败')
    // 加载失败时使用空数组
    events.value = {}
  }
}

// 添加演播
const addEvent = () => {
  // 获取限制时间范围，使用startTime作为默认时间
  const { startTime } = getTimeRange()
  const formattedTime = `${startTime.getFullYear()}-${String(
    startTime.getMonth() + 1
  ).padStart(2, '0')}-${String(startTime.getDate()).padStart(2, '0')} ${String(
    startTime.getHours()
  ).padStart(2, '0')}:${String(startTime.getMinutes()).padStart(
    2,
    '0'
  )}:${String(startTime.getSeconds()).padStart(2, '0')}`

  // 计算新id：基于当前列表中最大的id值递增
  let maxId = -1
  for (const key in events.value) {
    if (!Object.hasOwn(events.value, key)) continue
    const element = events.value[key]
    if (element.id > maxId) {
      maxId = Number(element.id)
    }
  }
  const newId = (maxId + 1).toString()

  currentEvent.value = {
    id: newId,
    title: '',
    time: formattedTime,
    message: '',
    show: true,
    rendered: false,
    group: '',
    parentId: '',
    curFly: 0,
    flyInterval: 1000,
    speaker: defaultSpeaker.value, // 使用默认语音
    flyArr: [
      {
        position: {
          x: 0,
          y: 0,
          z: 0
        },
        position_show: {
          x: 0,
          y: 0,
          z: 0
        },
        duration: 3,
        orientation: {
          heading: 0,
          pitch: 0,
          roll: 0
        },
        flyInterval: 3000,
        identifyInfo: '',
        jd: 1,
        UEId: ''
      }
    ]
  }
  selectedPoint()
  // 设置inputTime为startTime，格式化为字符串以匹配value-format
  inputTime.value = formattedTime
  editTitle.value = '新增演播'
  currentEditIndex.value = 0
  isEditEvent.value = true
}

//试听
const audioEvent = (item, index) => {
  if (!item.flyArr[0].identifyInfo) {
    ElMessage.error('请输入演播内容')
  }
  if (!item.speaker) {
    ElMessage.error('请选择播音员')
  }
  cameraController.identifyInfoCOnfig(
    item.flyArr[0].identifyInfo,
    item.flyArr[0].jd,
    item.speaker,
    item.title
  )
}

// 编辑演播
const editEvent = (item, index, key) => {
  // 深拷贝演播数据
  currentEditIndexOld.value = key
  currentEditIndex.value = key
  currentEvent.value = JSON.parse(JSON.stringify(item))
  // 从flyArr[0]中获取identifyInfo赋值给currentEvent.identifyInfo
  if (item.flyArr && item.flyArr.length > 0) {
    currentEvent.value.identifyInfo = item.flyArr[0].identifyInfo
    currentEvent.value.speaker = item.speaker
    let flyArr = item.flyArr
    let cartesian3 = new window.MSIMEarth.Cartesian3()
    for (let i = 0; i < flyArr.length; i++) {
      const element = flyArr[i]
      cartesian3.x = element.position.x
      cartesian3.y = element.position.y
      cartesian3.z = element.position.z
      let { lng, lat, alt } = cartesiantoDegrees(cartesian3)
      element.position_show = {
        x: lng,
        y: lat,
        z: alt
      }
    }
    currentEvent.value.flyArr = item.flyArr
    item.time = key
  }

  // 设置inputTime为演播的时间，格式化为字符串以匹配value-format
  if (item.time) {
    // 如果item.time是字符串且包含日期时间格式，直接使用
    if (typeof item.time === 'string' && item.time.includes('-')) {
      inputTime.value = item.time
    } else {
      // 否则将秒数转换为日期时间格式
      inputTime.value = formatTimeFromSeconds(key)
    }
  } else {
    // 如果没有时间，使用startTime
    const { startTime } = getTimeRange()
    const formattedTime = `${startTime.getFullYear()}-${String(
      startTime.getMonth() + 1
    ).padStart(2, '0')}-${String(startTime.getDate()).padStart(
      2,
      '0'
    )} ${String(startTime.getHours()).padStart(2, '0')}:${String(
      startTime.getMinutes()
    ).padStart(2, '0')}:${String(startTime.getSeconds()).padStart(2, '0')}`
    inputTime.value = formattedTime
  }

  editTitle.value = '编辑演播'
  selectIndex.value = index
  isEditEvent.value = true
}

// 删除演播
const deleteEvent = (item, index, key) => {
  ElMessageBox.confirm(
    `确定要删除演播"${item.title || item.message || '未命名演播'}"吗？`,
    // '警告',
    {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    }
  )
    .then(() => {
      // events.value.splice(index, 1)
      delete events.value[key]
      _createOrUpdate(events.value)
    })
    .catch(() => {
      // 取消删除
    })
}

// 保存演播
const saveEvent = () => {
  // if (!currentEvent.value.title && !currentEvent.value.message) {
  //   return ElMessage.warning('请输入演播标题或消息')
  // }

  // 计算时间节点秒数
  const date = new Date(store.state.sceneModule.startDate)
  let runSeconds
  // 获取Unix时间戳（毫秒数）并转换为秒数
  const timestamp = Math.floor(date.getTime() / 1000)
  let runTime = new Date(inputTime.value).getTime() / 1000
  if (runTime && timestamp) {
    runSeconds = Math.floor(runTime - timestamp)
  }
  currentEditIndex.value = runSeconds
  // console.log('runSeconds', runSeconds)

  // 深拷贝演播数据
  const formattedEvent = JSON.parse(JSON.stringify(currentEvent.value))

  // 格式化位置数据：经度纬度保留两位小数，高度取整
  if (formattedEvent.flyArr && formattedEvent.flyArr.length > 0) {
    const flyItem = formattedEvent.flyArr[0]
    if (flyItem.position) {
      flyItem.position = {
        x: parseFloat(Number(flyItem.position.x).toFixed(2)),
        y: parseFloat(Number(flyItem.position.y).toFixed(2)),
        z: parseFloat(flyItem.position.z)
      }
    }

    // 确保orientation对象存在
    if (!flyItem.orientation) {
      flyItem.orientation = {
        heading: 0,
        pitch: 0,
        roll: 0
      }
    }

    // 确保flyInterval存在
    if (flyItem.flyInterval === undefined) {
      flyItem.flyInterval = 3000
    }

    // 确保jd存在
    if (flyItem.jd === undefined) {
      flyItem.jd = 1
    }
  }

  // 确保全局字段存在
  if (formattedEvent.flyInterval === undefined) {
    formattedEvent.flyInterval = 1000
  }
  if (formattedEvent.curFly === undefined || formattedEvent.curFly === 1) {
    formattedEvent.curFly = 0
  }
  if (formattedEvent.group === undefined) {
    formattedEvent.group = ''
  }
  if (formattedEvent.parentId === undefined) {
    formattedEvent.parentId = ''
  }
  if (formattedEvent.show === undefined) {
    formattedEvent.show = true
  }
  if (formattedEvent.rendered === undefined) {
    formattedEvent.rendered = false
  }

  // if (currentEditIndex.value >= 0) {
  //   // 编辑现有演播
  //   events.value[currentEditIndex.value] = formattedEvent
  //   // ElMessage.success('编辑成功')
  // } else {
  //   // 添加新演播
  //   // events.value[++currentEditIndex.value] = formattedEvent
  //   // ElMessage.success('添加成功')
  // }
  events.value[currentEditIndex.value] = formattedEvent
  if (currentEditIndexOld.value >= 0) {
    if (currentEditIndexOld.value != currentEditIndex.value) {
      delete events.value[currentEditIndexOld.value]
    }
  }
  console.log('event', events.value)
  _createOrUpdate(events.value)
  currentEditIndexOld.value = -1
  isEditEvent.value = false
  selectIndex.value = -1
}

// 关闭编辑窗口
const closeEditEvent = () => {
  isEditEvent.value = false
  currentEvent.value = {}
  currentEditIndex.value = -1
  currentEditIndexOld.value = -1
}

// 编辑位置
const editPosition = (item, index, key) => {
  // 确保flyArr存在且有数据
  if (!item.flyArr || item.flyArr.length === 0) {
    item.flyArr = [
      {
        position: { x: 0, y: 0, z: 0 },
        duration: 3,
        orientation: { heading: 0, pitch: 0, roll: 0 },
        flyInterval: 3000,
        identifyInfo: '',
        jd: 1
      }
    ]
  }
  // 复制位置数据，包括所有必要字段
  const flyData = JSON.parse(JSON.stringify(item.flyArr[0]))

  // 格式化位置数据：经度纬度保留两位小数，高度保留原始值
  flyData.position.x = parseFloat(Number(flyData.position.x).toFixed(2))
  flyData.position.y = parseFloat(Number(flyData.position.y).toFixed(2))

  currentPosition.value = flyData
  // currentPositionIndex.value = index
  currentPositionIndex.value = key
  isEditPosition.value = true
}

// 保存位置
const savePosition = () => {
  if (currentPositionIndex.value >= 0) {
    const eventItem = events.value[currentPositionIndex.value]
    // 确保flyArr存在
    if (!eventItem.flyArr) {
      eventItem.flyArr = []
    }
    // 确保flyArr[0]存在
    if (!eventItem.flyArr[0]) {
      eventItem.flyArr[0] = {
        orientation: { heading: 0, pitch: 0, roll: 0 },
        flyInterval: 3000,
        identifyInfo: '',
        jd: 1
      }
    }
    // 格式化位置数据：经度纬度保留两位小数，高度保留原始值
    const formattedPosition = {
      x: parseFloat(Number(currentPosition.value.position.x).toFixed(2)),
      y: parseFloat(Number(currentPosition.value.position.y).toFixed(2)),
      z: parseFloat(currentPosition.value.position.z)
    }
    const formattedOrientation = {
      heading: currentPosition.value.orientation.heading,
      pitch: currentPosition.value.orientation.pitch,
      roll: currentPosition.value.orientation.roll
    }
    // 更新位置数据，保留原有字段
    eventItem.flyArr[0].position = formattedPosition
    eventItem.flyArr[0].orientation = formattedOrientation
    eventItem.flyArr[0].duration = currentPosition.value.duration
    _createOrUpdate(events.value)
    // ElMessage.success('位置编辑成功')
  }
  closeEditPosition()
}

// 关闭位置编辑窗口
const closeEditPosition = () => {
  isEditPosition.value = false
  currentPosition.value = {}
  currentPositionIndex.value = -1
}

// 显示视角配置面板
const showViewConfigPanel = () => {
  // 检查events.value[-1]是否存在已配置的视角
  const latestEvent = events.value[-1]
  if (latestEvent && latestEvent.flyArr && latestEvent.flyArr.length > 0) {
    const flyData = latestEvent.flyArr[0]
    // 填充坐标值到面板
    viewConfigData.value.position = {
      x: flyData.position_show?.x || flyData.position?.x || 0,
      y: flyData.position_show?.y || flyData.position?.y || 0,
      z: flyData.position_show?.z || flyData.position?.z || 0
    }
    viewConfigData.value.orientation = {
      heading: flyData.orientation?.heading || 0,
      pitch: flyData.orientation?.pitch || 0,
      roll: flyData.orientation?.roll || 0
    }
    // 填充想定内置字段
    viewConfigData.value.scenario = {
      scenarioBackground: latestEvent.scenarioBackground || '',
      missionBrief: latestEvent.missionBrief || '',
      missionObjective: latestEvent.missionObjective || ''
    }
  } else {
    // 如果没有配置，重置表单数据
    viewConfigData.value = {
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      orientation: {
        heading: 0,
        pitch: 0,
        roll: 0
      },
      scenario: {
        scenarioBackground: '',
        missionBrief: '',
        missionObjective: ''
      }
    }
  }
  isViewConfigPanelVisible.value = true
}

// 关闭视角配置面板
const closeViewConfigPanel = () => {
  isViewConfigPanelVisible.value = false
}

// 获取摄像机当前位置
const getCameraPosition = () => {
  try {
    let cameraPosition = window.EarthViewer.camera.position
    let { lng, lat, alt } = cartesiantoDegrees(cameraPosition)

    viewConfigData.value.position = {
      x: parseFloat(lng.toFixed(6)),
      y: parseFloat(lat.toFixed(6)),
      z: parseFloat(alt.toFixed(2))
    }

    viewConfigData.value.orientation = {
      heading: parseFloat(window.EarthViewer.camera.heading.toFixed(6)),
      pitch: parseFloat(window.EarthViewer.camera.pitch.toFixed(6)),
      roll: parseFloat(window.EarthViewer.camera.roll.toFixed(6))
    }

    ElMessage.success('摄像机位置获取成功')
  } catch (error) {
    console.error('获取摄像机位置失败:', error)
    ElMessage.error('获取摄像机位置失败')
  }
}

// 预览视角
const previewView = () => {
  try {
    // 直接使用viewConfigData中的数据
    const { position, orientation } = viewConfigData.value

    // 构建视角跳转参数
    const cameraOptions = {
      destination: window.MSIMEarth.Cartesian3.fromDegrees(
        position.x,
        position.y,
        position.z
      ),
      orientation: {
        heading: orientation.heading,
        pitch: orientation.pitch,
        roll: orientation.roll
      },
      duration: 3 // 默认3秒
    }

    // 调用EarthViewer的flyTo方法实现视角跳转
    window.EarthViewer.camera.flyTo(cameraOptions)

    ElMessage.success('视角预览功能已触发')
  } catch (error) {
    console.error('预览视角失败:', error)
    ElMessage.error('预览视角失败')
  }
}

// 保存视角配置
const saveViewConfig = () => {
  try {
    // 生成新演播ID
    let maxId = -1
    for (const key in events.value) {
      if (!Object.hasOwn(events.value, key)) continue
      const element = events.value[key]
      if (element.id > maxId) {
        maxId = Number(element.id)
      }
    }
    const newId = (maxId + 1).toString()

    // 创建新演播对象
    const newEvent = {
      id: newId,
      title: `视角${newId}`,
      time: new Date().toISOString().slice(0, 19).replace('T', ' '),
      message: '',
      show: true,
      rendered: false,
      group: '',
      parentId: '',
      curFly: 0,
      flyInterval: 1000,
      // 想定内置字段
      scenarioBackground: viewConfigData.value.scenario.scenarioBackground,
      missionBrief: viewConfigData.value.scenario.missionBrief,
      missionObjective: viewConfigData.value.scenario.missionObjective,
      flyArr: [
        {
          position: {
            x: viewConfigData.value.position.x,
            y: viewConfigData.value.position.y,
            z: viewConfigData.value.position.z
          },
          position_show: {
            x: viewConfigData.value.position.x,
            y: viewConfigData.value.position.y,
            z: viewConfigData.value.position.z
          },
          duration: 3,
          orientation: {
            heading: viewConfigData.value.orientation.heading,
            pitch: viewConfigData.value.orientation.pitch,
            roll: viewConfigData.value.orientation.roll
          },
          flyInterval: 3000,
          identifyInfo: '',
          jd: 1,
          UEId: ''
        }
      ]
    }

    // 将新演播添加到events对象，key值为-1
    events.value[-1] = newEvent

    // 更新store中的想定背景、任务简报和任务目的
    store.commit(
      'experimentModule/SET_SCENARIO_BACKGROUND',
      viewConfigData.value.scenario.scenarioBackground
    )
    store.commit(
      'experimentModule/SET_MISSION_BRIEF',
      viewConfigData.value.scenario.missionBrief
    )
    store.commit(
      'experimentModule/SET_MISSION_OBJECTIVE',
      viewConfigData.value.scenario.missionObjective
    )

    // 调用_createOrUpdate函数提交数据
    _createOrUpdate(events.value)

    // 关闭面板
    closeViewConfigPanel()

    // 重置表单数据
    viewConfigData.value = {
      position: {
        x: 0,
        y: 0,
        z: 0
      },
      orientation: {
        heading: 0,
        pitch: 0,
        roll: 0
      },
      scenario: {
        scenarioBackground: '',
        missionBrief: '',
        missionObjective: ''
      }
    }
  } catch (error) {
    console.error('保存视角配置失败:', error)
    ElMessage.error('保存视角配置失败')
  }
}

// 关闭面板
const closePanel = () => {
  emitter.emit('showEventList', false)
  emit('update:showList', false)
  emit('update:visible', false)
  emit('close')
}

// 分页方法
const changePageSize = (size) => {
  pageSize.value = size
  pageNum.value = 1
}

const changePageNum = (num) => {
  pageNum.value = num
  _queryExperimentJsonFile()
}

// 导出演播为JSON
const exportEvents = () => {
  try {
    // 创建包含所有演播的JSON字符串
    for (const key in events.value) {
      if (Object.hasOwnProperty.call(events.value, key)) {
        const cameraConfigData = events.value[key]
        cameraConfigData.curFly = 0
      }
    }
    const jsonStr = JSON.stringify(events.value, null, 2)
    // 创建Blob对象
    const blob = new Blob([jsonStr], { type: 'application/json' })
    // 创建下载链接
    const link = document.createElement('a')
    // 设置文件名
    const fileName = `events_${new Date().getTime()}.json`
    // 创建URL
    link.href = URL.createObjectURL(blob)
    link.download = fileName
    // 触发下载
    document.body.appendChild(link)
    link.click()
    // 清理
    document.body.removeChild(link)
    URL.revokeObjectURL(link.href)
    ElMessage.success('演播导出成功')
  } catch (error) {
    console.error('导出演播失败:', error)
    ElMessage.error('导出演播失败')
  }
}

// 清空所有演播
const clearAllEvents = () => {
  ElMessageBox.confirm('确定要清空所有演播吗？此操作不可恢复。', '警告', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      // 保存key为-1的元素（如果存在）
      const initSceneEvent = events.value[-1] ? { '-1': events.value[-1] } : {}
      // 清空演播列表，只保留初始化场景演播
      events.value = initSceneEvent
      // 更新到服务器
      _createOrUpdate(events.value)
      ElMessage.success('演播清空成功')
    })
    .catch(() => {
      // 取消清空操作
    })
}

// 触发文件选择对话框
const triggerImport = () => {
  fileInputRef.value?.click()
}

// 导入演播JSON
const importEvents = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const importedEvents = JSON.parse(e.target.result)
      for (const key in importedEvents) {
        if (Object.hasOwnProperty.call(importedEvents, key)) {
          const cameraConfigData = importedEvents[key]
          cameraConfigData.curFly = 0
        }
      }
      // 验证导入的数据格式
      // if (Array.isArray(importedEvents)) {
      //   // 替换现有演播
      //   events.value = importedEvents
      //   pageNum.value = 1 // 重置到第一页
      //   ElMessage.success('演播导入成功')
      // } else {
      //   ElMessage.error('导入的文件格式不正确，应为演播数组')
      // }
      // console.log(importedEvents);
      // debugger
      console.log(importedEvents)
      _createOrUpdate(importedEvents)
    } catch (error) {
      console.error('解析JSON文件失败:', error)
      ElMessage.error('解析JSON文件失败')
    }
  }
  reader.onerror = () => {
    ElMessage.error('读取文件失败')
  }
  reader.readAsText(file)

  // 清空文件输入，以便下次可以选择同一个文件
  event.target.value = ''
}

const _createOrUpdate = (dataList) => {
  const params = {
    experimentId: store.state.sceneModule.sceneInfo.id,
    list: dataList
  }
  createOrUpdate(params).then((res) => {
    if (res.code == 200) {
      ElMessage.success(res.data)
      _queryExperimentJsonFile()
    } else {
      ElMessage.error(res.data)
    }
  })
}

const _queryExperimentJsonFile = () => {
  const params = {
    experimentId: store.state.sceneModule.sceneInfo.id
  }
  queryExperimentJsonFile(params).then((res) => {
    if (res.code == 200) {
      console.log('res.data', res.data)
      loadEvents(res.data)
      store.commit('setCameraOptionList', res.data)
    } else {
      ElMessage.error(res.data)
    }
  })
}

const _getAllPlatByScenarioId = (camp, index) => {
  selectIndex_3D.value = index
  const params = {
    scenarioId: store.state.sceneModule.sceneInfo.scenarioId,
    camp
  }
  getAllPlatByScenarioId(params).then((res) => {
    let dataList = []
    if (res && res.length > 0) {
      for (let i = 0; i < res.length; i++) {
        const element = res[i]
        // let side = '未知'
        // if (element.camp == 'blue') {
        //   side = '蓝方'
        // } else if (element.camp == 'red') {
        //   side = '红方'
        // } else if (element.camp == 'purple') {
        //   side = '紫方'
        // } else if (element.camp == 'green') {
        //   side = '绿方'
        // }
        // element.showName = `${side}_${element.platformCnName}`
        if (
          element.subcategory != '弹药' &&
          element.subcategory != '干扰弹' &&
          element.subcategory != '巡飞弹'
        ) {
          // if (element.subcategory.indexOf('弹') < 0) {
          dataList.push(element)
        }
      }
    }
    platAllList.value = dataList
  })
}

// 初始化
onMounted(() => {
  console.log('showList', props.showList)
  if (props.showList) {
    // loadEvents()
    // _queryExperimentJsonFile()
    // getSpeakersList()
    // _getAllPlatByScenarioId('')
  }
})

// 监听显示状态变化
watch(
  () => props.showList,
  (newVal) => {
    if (newVal) {
      // loadEvents()
      _queryExperimentJsonFile()
      getSpeakersList()
    }
  }
)

// 时间选择器范围设置
// 常量：一天的毫秒数 - 提升可读性，避免魔法值
const ONE_DAY_MS = 24 * 3600 * 1000

const disabledDateFn = (time) => {
  const { startTime, endTime } = getTimeRange()
  //比当前时间小的时间禁用（返回false则禁用）
  return time.getTime() < startTime - ONE_DAY_MS || time.getTime() > endTime
}

const disabledHours = () => {
  const { startTime } = getTimeRange()
  const a = []
  for (let i = 0; i < 24; i++) {
    // 限制 之前 < / 之后 >
    if (startTime.getHours() <= i) continue
    a.push(i)
  }
  return a
}

const disabledMinutes = (hour) => {
  const { startTime } = getTimeRange()
  // 选择时大于当前时，所有分均可选择
  if (hour > startTime.getHours()) {
    return []
  }
  const a = []
  for (let i = 0; i < 60; i++) {
    // 限制 之前 < / 之后 >
    if (startTime.getMinutes() <= i) continue
    a.push(i)
  }
  return a
}

const disabledSeconds = (hour, mins) => {
  const { startTime } = getTimeRange()
  // 选择时分大于当前时分时，所有秒均可选择
  if (hour > startTime.getHours()) {
    return []
  } else if (hour == startTime.getHours() && mins > startTime.getMinutes()) {
    return []
  }

  const a = []
  for (let i = 0; i < 60; i++) {
    // 限制 之前 < / 之后 >
    if (startTime.getSeconds() <= i) continue
    a.push(i)
  }
  return a
}
</script>

<style lang="less" scoped>
.eventList {
  width: 1300px;
  /* 宽度大于高度，横版设计 */
  height: 380px;
  background-size: 100% 100%;
  z-index: 25;
  padding: 0 10px;
  box-sizing: border-box;
  position: absolute;
  top: 13%;
  // right: 3px;
  right: 6%;
  background: rgba(2, 26, 70, 0.58);
  box-shadow: 0 0 25px #1092d58a;
  border-radius: 8px;
  transition: height 0.3s ease;

  &.expanded {
    height: 700px;

    .content {
      height: calc(100% - 55px);
    }
  }

  .campBox {
    display: flex;
    margin-bottom: 10px;
    .campItem {
      padding: 5px 10px;
    }
  }

  .waning {
    color: #ffd600;
    font-size: 11px;
    margin-left: 10px;
  }

  .header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 15px;
    border-bottom: 1px solid #0b3855;
    height: 45px;
    font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
    font-weight: 700;
    font-style: normal;
    font-size: 19px;
    color: #c2d7ee;

    .header-icons {
      display: flex;
      align-items: center;
      gap: 10px;
    }

    .fly-control-switch {
      margin: 0;
    }

    .expand-btn {
      cursor: pointer;
      font-size: 18px;
      color: #c2d7ee;
      transition: all 0.3s ease;
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;

      &:hover {
        color: #00cbff;
        background-color: rgba(0, 203, 255, 0.1);
        border-radius: 4px;
      }
    }

    .view-config-btn {
      cursor: pointer;
      font-size: 18px;
      color: #c2d7ee;
      transition: all 0.3s ease;
      flex-shrink: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 50%;
      background-color: rgba(0, 203, 255, 0.1);
      border: 1px solid rgba(0, 203, 255, 0.3);

      &:hover {
        color: #00cbff;
        background-color: rgba(0, 203, 255, 0.2);
        box-shadow: 0 0 10px rgba(0, 203, 255, 0.3);
      }
    }

    .close-btn {
      cursor: pointer;
      font-size: 18px;
      color: #c2d7ee;
      transition: color 0.3s ease;
      flex-shrink: 0;

      &:hover {
        color: #00cbff;
      }
    }
  }

  .content {
    height: calc(100% - 55px);
    /* 扣除头部高度 */
    padding: 0;
    position: relative;
    display: flex;
    flex-direction: column;

    .search_create {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 8px 10px;
      border-bottom: 1px solid rgba(0, 203, 255, 0.1);
      background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      margin: 8px;

      .voice-select-container {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 0 10px;
        background-color: rgba(0, 0, 0, 0.2);
        border-radius: 4px;
        height: 32px;
      }

      .voice-select-label {
        color: #c2d7ee;
        font-size: 14px;
        font-weight: 500;
      }

      .voice-select {
        :deep(.el-select__wrapper) {
          background-color: #2b4559 !important;
          box-shadow: 0 0 0 1px #075d89 inset;
          border: none;
          height: 30px;
          min-height: 30px;
          width: 180px;

          .el-input__inner {
            color: #ffffff;
            font-size: 14px;
            height: 30px;
            line-height: 30px;
            width: 180px;
          }
        }

        :deep(.el-select__placeholder) {
          color: rgba(255, 255, 255, 0.7);
          font-size: 14px;
        }
      }

      .el-button {
        background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
        width: 80px;
        height: 30px;
        color: #ffff;
        border-radius: 5px;
        margin-left: 8px;
        cursor: pointer;
        margin-right: 5px;
      }
    }

    .eventItem_box {
      width: calc(100% - 16px);
      padding: 0;
      margin: 0 8px;
      height: calc(100% - 110px);
      /* 扣除搜索栏和分页高度 */
      text-align: left;
      overflow-y: auto;
      background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      border: 1px solid rgba(0, 203, 255, 0.1);
      padding: 5px;

      /* 横向滚动布局，适合横版设计 */
      display: flex;
      flex-direction: column;
      gap: 8px;

      .item_box {
        background-color: #223b5091;
        border: 1px solid #ffffff00;
        padding: 10px 15px;
        cursor: pointer;
        transition: all 0.3s ease;
        border-radius: 4px;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;
        flex-wrap: nowrap;
        min-height: 70px;

        &:hover {
          border-color: #02a7f0;
          background-color: #02a7f01a;
          box-shadow: 0 0 10px rgba(0, 203, 255, 0.2);
        }

        .item_info {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .item_header {
          display: flex;
          align-items: center;
          color: #81d3f8;
          font-size: 16px;
          min-width: 0;

          .title {
            display: flex;
            align-items: center;
            min-width: 0;

            img {
              margin-right: 8px;
              width: 20px;
              height: 20px;
              flex-shrink: 0;
            }

            .event-name {
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              cursor: pointer;
              transition: color 0.3s ease;

              &:first-of-type {
                max-width: 60px;
                color: #00cbff;
                margin-right: 5px;
                font-weight: bold;
              }

              &:last-of-type {
                max-width: 180px;
              }
            }

            .event-desc {
              margin-left: 8px;
              font-size: 12px;
              color: #a3a6ad;
              max-width: 200px;
              overflow: hidden;
              text-overflow: ellipsis;
              white-space: nowrap;
              font-style: italic;
            }
          }
        }

        .btn_list {
          display: flex;
          gap: 12px;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          margin-left: 15px;
          flex-shrink: 0;
          height: 100%;

          .list-icon {
            cursor: pointer;
            font-size: 20px;
            color: #81d3f8;
            transition: color 0.3s ease;

            &:hover {
              color: #00cbff;
            }
          }
        }

        .item_content {
          text-align: left;
          color: #b1b327;
          font-size: 12px;
          padding: 0 0 0 28px;
          width: 100%;
          display: flex;
          gap: 15px;
          align-items: center;
          flex-wrap: wrap;

          li {
            font-size: 13px;
            margin: 0;
            line-height: 18px;
            display: flex;
            align-items: center;
            gap: 5px;

            &.describe {
              color: #a3a6ad;
            }

            &.detail {
              flex: 1;
              min-width: 0;
            }

            &.time {
              white-space: nowrap;
            }
          }

          .detail-content {
            max-width: 900px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: help;
          }

          .position-icon {
            margin-left: 10px;
            cursor: pointer;
            font-size: 18px;
            color: #00cbff;
            transition: color 0.3s ease;

            &:hover {
              color: #00e5ff;
            }
          }

          .tooltip-wrapper {
            display: inline-block;
            position: relative;
          }

          .btn_list .tooltip-wrapper {
            display: flex;
            align-items: center;
            justify-content: center;
          }
        }
      }

      .select_style {
        background-color: #02a7f04a;
        border-color: #02a7f0;
        box-shadow: 0 0 15px rgba(0, 203, 255, 0.3);
      }

      /* 滚动条样式 */
      &::-webkit-scrollbar {
        width: 8px;
      }

      &::-webkit-scrollbar-track {
        background: rgba(0, 0, 0, 0.1);
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb {
        background: rgba(0, 203, 255, 0.5);
        border-radius: 4px;
      }

      &::-webkit-scrollbar-thumb:hover {
        background: rgba(0, 203, 255, 0.8);
      }
    }

    .bottom-actions {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px;
      // background: rgba(0, 0, 0, 0.1);
      border-radius: 4px;
      margin: 8px;
      flex-wrap: wrap;
      gap: 10px;

      .action-buttons {
        display: flex;
        gap: 10px;

        .el-button {
          background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
          width: 100px;
          height: 30px;
          color: #ffff;
          border-radius: 5px;
          cursor: pointer;
        }
      }

      .page_box {
        display: flex;
        justify-content: center;
        align-items: center;
        height: 40px;
        margin: 0;
        color: #fff;

        :deep(.el-pagination) {
          justify-content: center;
          padding: 5px 0;
        }
      }
    }
  }
}

/* 对话框样式 */
.dialog-backdrop {
  position: absolute;
  top: 0px;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(2px);
}

.dialog-container {
  position: absolute;
  top: 20px;
  background: #2e4b64;
  border-radius: 8px;
  box-shadow: 0 0 30px rgba(0, 203, 255, 0.3);
  overflow: hidden;
  border: 1px solid #2e4b64;
  animation: dialogFadeIn 0.3s ease;
}

.event-dialog {
  width: 600px;
}

.position-dialog {
  width: 500px;
}

.view-config-dialog {
  width: 800px;
}

.dialog-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 20px;
  background: rgba(8, 36, 62, 0.7);
  border-bottom: 1px solid #2e4b64;
}

.dialog-title {
  font-size: 16px;
  font-weight: bold;
  color: #fff;
}

.dialog-close {
  color: #fff;
  cursor: pointer;
  font-size: 18px;
  transition: color 0.3s ease;

  &:hover {
    color: #00cbff;
  }
}

.dialog-body {
  padding: 20px;
  color: #fff;
  max-height: 80vh;
  overflow-y: auto;
  text-align: right;

  :deep(.el-select__input) {
    color: #ffffff;
  }
}

/* 表单样式 */
:deep(.el-form-item__label) {
  color: #fff;
}

:deep(.el-select__wrapper),
:deep(.el-input__wrapper),
:deep(.el-textarea__wrapper) {
  background-color: #2b4559 !important;
  box-shadow: 0 0 0 1px #075d89 inset;
  .el-select__placeholder,
  .el-input__inner,
  .el-textarea__inner {
    color: #ffffff;
  }
}

:deep(.el-textarea__inner) {
  color: #ffffff;
  background-color: #2b4559 !important;
}

:deep(.el-input-number__decrease),
:deep(.el-input-number__increase) {
  background-color: #2b4559 !important;
  color: #ffffff;
  border-color: #075d89;
}

/* 动画 */
@keyframes dialogFadeIn {
  from {
    opacity: 0;
    transform: translateY(-20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
