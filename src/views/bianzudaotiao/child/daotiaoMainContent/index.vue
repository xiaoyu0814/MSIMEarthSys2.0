<!--
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2026-01-16 19:23:44
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2026-01-20 09:03:06
 * @FilePath: \web_earth\src\views\bianzudaotiao\child\daotiaoMainContent\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="daotiao-main-content">
    <!-- 主体内容区 - 棋盘式格网 -->
    <div class="content-body">
      <!-- 加载状态 -->
      <div v-if="state.isLoading" class="loading-state">
        <div class="loading-spinner"></div>
        <div class="loading-text">加载中...</div>
      </div>

      <!-- 错误信息 -->
      <div v-else-if="state.error" class="error-state">
        <div class="error-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path
              d="M12 8v4m0 4h.01"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <path
              d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="error-text">{{ state.error }}</div>
        <button class="retry-btn" @click="loadData">重试</button>
      </div>

      <!-- 无数据状态 -->
      <div
        v-else-if="state.filteredData.length === 0"
        class="empty-state"
        :class="{ expanded: isExpanded }"
      >
        <div class="empty-icon">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <polyline
              points="7 10 12 15 17 10"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
            <line
              x1="12"
              y1="15"
              x2="12"
              y2="3"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
        </div>
        <div class="empty-text">暂无数据</div>
      </div>

      <!-- 数据展示 -->
      <div v-else class="grid-container">
        <!-- 表头 -->
        <div class="grid-header">
          <div class="header-cell blue-target-header">蓝方目标</div>
          <div class="header-cell red-force-header">红方力量</div>
        </div>

        <!-- 数据行 -->
        <div
          v-for="(row, rowIndex) in state.filteredData"
          :key="rowIndex"
          class="grid-row"
        >
          <!-- 蓝方目标（每行第一个元素） -->
          <div class="grid-cell blue-target tech-cell">
            <div class="target-info">
              <div
                class="target-name tech-text"
                @mouseover="showDetails($event, row, 'blue')"
                @mouseout="hideDetails"
              >
                {{ row.groupName }}
              </div>
              <!-- <div class="target-type tech-subtext">
                {{ row.blueTarget.type }}
              </div> -->
              <!-- <div class="target-group tech-subtext">编组: {{ row.id }}</div> -->
              <div class="target-strength tech-subtext">
                兵力总数: {{ row.childList.length }}
              </div>
            </div>
            <!-- 科技风装饰 -->
            <div class="tech-decoration">
              <img
                :src="row.icon2dFileUrl"
                v-if="row.icon2dFileUrl"
                style="width: 35px; height: 35px"
                alt=""
              />
            </div>
          </div>

          <!-- 红方攻击力量 -->
          <div class="red-force-container">
            <div
              v-for="(redForce, redIndex) in row.redForces"
              :key="redIndex"
              :id="`red-force-${rowIndex}-${redIndex}`"
              class="grid-cell red-force tech-cell"
              :class="[
                redForce.attackableUnits == redForce.totalUnits
                  ? 'AttackTarget-all'
                  : redForce.attackableUnits > 0
                  ? 'AttackTarget-partial'
                  : 'none-partial',
                { 'command-configured': redForce.commandConfigured },
                {
                  'command-disabled':
                    selectedIdCard?.indexOf(redForce?.id) > -1 &&
                    !redForce.commandConfigured
                }
              ]"
              :data-command="redForce.command"
              :data-row="rowIndex"
              :data-col="redIndex"
              @contextmenu="
                showContextMenu($event, redForce, rowIndex, redIndex)
              "
            >
              <div class="force-info">
                <div
                  class="force-name tech-text"
                  @mouseover="showDetails($event, redForce, 'red')"
                  @mouseout="hideDetails"
                >
                  {{ redForce.groupName }}
                </div>
                <!-- <div class="force-type tech-subtext">{{ redForce.type }}</div> -->
                <!-- <div class="force-group tech-subtext">编组: {{ redForce.id }}</div> -->
                <div class="force-strength tech-subtext">
                  <span>兵力总数: {{ redForce.totalUnits }}</span>
                  <span
                    v-if="redForce.totalUnits > redForce.attackableUnits"
                    class="attackable-count"
                  >
                    (可攻: {{ redForce.attackableUnits }})
                  </span>
                </div>
                <div class="AttackTarget-status tech-subtext">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 11.08V12a10 10 0 1 1-5.93-9.14"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <polyline
                      points="22 4 12 14.01 9 11.01"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                  {{
                    redForce.attackableUnits == redForce.totalUnits
                      ? '全部具备目标打击能力'
                      : redForce.attackableUnits > 0
                      ? '部分具备目标打击能力'
                      : '不具备目标打击能力'
                  }}
                </div>
              </div>
              <!-- 科技风装饰 -->
              <div class="tech-decoration">
                <img
                  :src="redForce.icon2dFileUrl"
                  v-if="row.icon2dFileUrl"
                  style="width: 35px; height: 35px"
                  alt=""
                />
              </div>
              <div
                class="lock"
                v-if="
                  selectedIdCard?.indexOf(redForce?.id) > -1 &&
                  !redForce.commandConfigured
                "
              >
                <img
                  src="@/assets/image/panelIcons/锁定.png"
                  width="20"
                  style="margin-top: 4px"
                  alt=""
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 详情组件 -->
    <DaotiaoDetails
      :visible="detailsVisible"
      :position="detailsPosition"
      :item-info="detailsItemInfo"
      :side="detailsSide"
      @close="hideDetails"
    />

    <!-- 右键菜单组件 -->
    <div
      v-if="contextMenuVisible"
      class="context-menu"
      :style="contextMenuStyle"
    >
      <div class="menu-header">
        <span>行动配置</span>
        <div class="menu-close" @click="hideContextMenu">&times;</div>
      </div>
      <div class="menu-content">
        <!-- 行动选择 -->
        <div class="command-selection">
          <div class="menu-label">选择行动：</div>
          <div
            v-for="command in contextMenuCommands"
            :key="command.value"
            class="menu-item command-item"
            :class="{ active: selectedCommandForTime?.value === command.value }"
            @click="selectedCommandForTime = command"
          >
            <span class="command-icon">{{
              getCommandIcon(command.value)
            }}</span>
            <span>{{ command.name }}</span>
          </div>
        </div>

        <!-- 时间选择 -->
        <div class="time-selection">
          <div class="menu-label">执行时间：</div>
          <div class="time-picker-inputs">
            <div class="input-group">
              <label>日期：</label>
              <!-- <input type="date" v-model="selectedDateTime.date" class="time-input" /> -->
              <el-date-picker
                v-model="selectedDateTime.time"
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
            </div>
            <!-- <div class="input-group">
              <label>时间：</label>
              <input
                type="number"
                v-model="selectedDateTime.time"
                class="time-input"
              />
            </div> -->
          </div>
        </div>

        <!-- 操作按钮 -->
        <div class="menu-actions">
          <button
            class="btn-tech btn-confirm"
            @click="confirmCommandWithTime"
            :disabled="!selectedCommandForTime"
          >
            设置时间执行
          </button>
          <button
            class="btn-tech btn-immediate"
            @click="confirmCommandWithImmediateTime"
            :disabled="!selectedCommandForTime"
          >
            立即执行
          </button>
          <div
            v-if="selectedCard.commandConfigured"
            class="menu-item cancel-command"
            @click="cancelCardCommand"
          >
            <span class="command-icon">✕</span>
            <span>取消行动</span>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- 保存历史记录弹窗 -->、
  <div class="daotiao-his" v-if="state.daotiaoHis">
    <div class="details-header">
      <div class="header-title">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
          <path
            d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"
            stroke="#06d6f9"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <polyline
            points="16 11 12 15 8 11"
            stroke="#06d6f9"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
        保存历史记录
      </div>
      <div class="header-close" @click="state.daotiaoHis = false">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
          <line
            x1="18"
            y1="6"
            x2="6"
            y2="18"
            stroke="#06d6f9"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <line
            x1="6"
            y1="6"
            x2="18"
            y2="18"
            stroke="#06d6f9"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>
    <div class="details-content">
      <div class="detail-item">
        <span class="item-label">记录名称：</span>
        <span class="item-value">
          <input v-model="state.hisName" class="time-input" />
        </span>
      </div>
      <div class="footer">
        <button class="btn-tech btn-confirm" @click="save">保存</button>
      </div>
    </div>
  </div>
  <!-- 保存信息框 -->
  <div v-if="state.isSaving" class="save-info-box">
    <div class="save-info-header">
      <span class="tech-text">保存信息</span>
    </div>
    <div class="save-info-content">
      <div class="save-info-text">{{ state.saveMessage }}</div>
      <div class="saved-cards-container">
        <div
          v-for="(card, index) in state.savedCards"
          :key="index"
          class="saved-card-item"
          :style="{
            animationDelay: `${index * 0.1}s`
          }"
        >
          <span class="card-name">{{ card.name }}</span>
          <span class="card-type">{{
            card.type == 'AttackTarget' ? '攻击行动' : card.type
          }}</span>
        </div>
      </div>
    </div>
    <div class="save-info-footer">
      <div class="progress-bar">
        <div
          class="progress-fill"
          :style="{
            width: state.saveProgress + '%'
          }"
        ></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {
  ref,
  reactive,
  onMounted,
  watch,
  computed,
  getCurrentInstance
} from 'vue'
import { useStore } from 'vuex'
// 状态管理
const store = useStore()
// 引入详情组件
import DaotiaoDetails from '../daotiaoDetails/index.vue'
import emitter from '@/utils/eventbus'
const { proxy } = getCurrentInstance()
import {
  getPlatStatusGroupNodeBySide,
  getPlanningResultsByGroup,
  saveRelatedData
} from '@/service/bldtServer/index'

// 组件属性
const props = defineProps({
  // 当前行动类型
  currentCommand: {
    type: String,
    default: 'AttackTarget'
  }
})

// 定义事件
const emit = defineEmits([])

// 组件状态
const state = reactive({
  isLoading: false,
  attackData: [],
  filteredData: [],
  error: '',
  currentExperiment: {},
  daotiaoHis: false,
  hisName: '',
  isSaving: false, // 保存动画状态
  saveMessage: '', // 保存消息
  savedCards: [], // 已保存的编组信息
  saveProgress: 0 // 保存进度
})

// 详情组件状态
const detailsVisible = ref(false)
const detailsPosition = ref({ x: 0, y: 0 })
const detailsItemInfo = ref({})
const detailsSide = ref('blue')

// 菜单是否展开
const isExpanded = ref(false)

// 右键菜单状态
const contextMenuVisible = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const selectedCard = ref({})
const selectedCardIndex = ref({ row: 0, col: 0 })

// 存放选择的数组
const selectedItemCard = ref([]) //
const selectedIdCard = ref([])
// 时间选择相关状态
const showTimePicker = ref(false)
const selectedCommandForTime = ref(null)
const selectedDateTime = ref({
  date: '',
  time: ''
})

// 行动类型映射
const commandTypes = ref([
  { value: 'AttackTarget', name: '攻击行动' }
  // { value: "recon", name: "侦察行动" },
  // { value: "jam", name: "干扰行动" },
  // { value: "defense", name: "防御行动" },
])

// 计算属性：右键菜单可用行动
const contextMenuCommands = computed(() => {
  if (!selectedCard.value.availableCommands) {
    return []
  }
  return commandTypes.value.filter((cmd) =>
    selectedCard.value.availableCommands.includes(cmd.value)
  )
})

// 显示详情
const showDetails = (event, itemInfo, side) => {
  detailsItemInfo.value = itemInfo
  detailsSide.value = side

  // 获取事件目标元素相对于视口的位置
  const rect = event.currentTarget.getBoundingClientRect()

  // 估算详情卡片尺寸（基于设计的实际尺寸）
  const cardHeight = 300
  const cardWidth = 280
  // 安全边距
  const margin = 20

  // 获取视窗尺寸
  const windowHeight = window.innerHeight
  const windowWidth = window.innerWidth

  let isExpandX = 0,
    isExpandY = 0
  if (isExpanded.value) {
    isExpandX = 80
    isExpandY = 60
  } else {
    isExpandX = 580
    isExpandY = 100
  }
  // 计算预期位置：元素右侧
  let x = rect.left + rect.width - isExpandX
  let y = rect.top - isExpandY

  // 计算卡片底部和右侧位置
  const cardBottom = y + cardHeight
  const cardRight = x + cardWidth

  // 调整Y轴位置：如果卡片底部超出屏幕，向上调整
  if (cardBottom > windowHeight - margin) {
    y = windowHeight - cardHeight - margin
  }

  // 确保卡片顶部不会超出屏幕顶部
  if (y < margin) {
    y = margin
  }

  // 调整X轴位置：如果卡片右侧超出屏幕，改为元素左侧显示
  if (cardRight > windowWidth - margin) {
    x = rect.left - cardWidth - 10
  }

  // 确保卡片左侧不会超出屏幕左侧
  if (x < margin) {
    x = margin
  }

  // 设置详情位置
  detailsPosition.value = {
    x,
    y
  }

  detailsVisible.value = true
}

// 隐藏详情
const hideDetails = () => {
  detailsVisible.value = false
}

// 显示右键菜单
const showContextMenu = (event, card, rowIndex, colIndex) => {
  // 阻止默认右键菜单
  event.preventDefault()
  event.stopPropagation()

  // 设置选中的编组和索引
  selectedCard.value = card

  // 针对历史记录的逻辑  如果之前设置过时间和攻击类型，则回显设置的时间和类型

  // 类型
  for (let i = 0; i < commandTypes.value.length; i++) {
    if (card.command == commandTypes.value[i].value) {
      selectedCommandForTime.value = commandTypes.value[i]
    } else {
      selectedCommandForTime.value = null
    }
  }
  // 设置当前右击实体的行列号
  selectedCardIndex.value = { row: rowIndex, col: colIndex }

  let isExpandX = 0,
    isExpandY = 0
  if (isExpanded.value) {
    isExpandX = 0
    isExpandY = 70
  } else {
    isExpandX = 480
    isExpandY = 100
  }

  // 设置右键菜单位置
  contextMenuPosition.value = {
    x: event.clientX - isExpandX,
    y: event.clientY - isExpandY
  }

  // 红色的实体不可配置行动
  if (card.attackableUnits == 0) {
    return ElMessage.warning(
      `“ ${card.groupName} ”当前不可配置行动，原因：${card.unattackableReason}`
    )
  }

  if (selectedIdCard.value.indexOf(card.id) == -1) {
    // 显示右键菜单
    contextMenuVisible.value = true
  } else {
    let flag = false
    for (let i = 0; i < selectedItemCard.value.length; i++) {
      if (
        selectedCardIndex.value.row == selectedItemCard.value[i].row &&
        selectedCardIndex.value.col == selectedItemCard.value[i].col
      ) {
        flag = true
      }
    }
    if (flag) {
      // 显示右键菜单
      contextMenuVisible.value = true
    } else {
      ElMessage.warning(`“ ${card.groupName} ”已配置行动！`)
    }
  }

  const { startTime } = getTimeRange()
  const formattedTime = `${startTime.getFullYear()}-${String(
    startTime.getMonth() + 1
  ).padStart(2, '0')}-${String(startTime.getDate()).padStart(2, '0')} ${String(
    startTime.getHours()
  ).padStart(2, '0')}:${String(startTime.getMinutes()).padStart(
    2,
    '0'
  )}:${String(startTime.getSeconds()).padStart(2, '0')}`

  selectedDateTime.value.time = formattedTime
  // 时间
  if (card.commandTimeConfigured) {
    selectedDateTime.value.time = card.commandTimeConfigured
  }
}

// 隐藏右键菜单
const hideContextMenu = () => {
  contextMenuVisible.value = false
  selectedCard.value = {}
  selectedCardIndex.value = { row: 0, col: 0 }
}

// 获取行动图标
const getCommandIcon = (commandType) => {
  switch (commandType) {
    case 'AttackTarget':
      return '⚔️'
    case 'recon':
      return '🔍'
    case 'jam':
      return '📶'
    case 'defense':
      return '🛡️'
    default:
      return '📋'
  }
}

// 选择编组行动（带时间配置）
const confirmCommandWithTime = async () => {
  if (
    selectedDateTime.value.time == '' ||
    selectedDateTime.value.time == undefined ||
    selectedDateTime.value.time == null
  ) {
    return ElMessage.warning('请设置行动时间！')
  }
  if (selectedCommandForTime.value) {
    // 更新选中编组的行动和时间
    selectedCard.value.command = selectedCommandForTime.value.value
    selectedCard.value.commandConfigured = true
    // selectedCard.value.commandTime = `${selectedDateTime.value.date} ${selectedDateTime.value.time}`;
    // 计算时间节点秒数
    const date = new Date(store.state.sceneModule.msgMessionTime)
      ? new Date(store.state.sceneModule.msgMessionTime)
      : new Date(store.state.sceneModule.startDate)
    let runSeconds
    // 获取Unix时间戳（毫秒数）并转换为秒数
    const timestamp = Math.floor(date.getTime() / 1000) // 当前仿真时间
    let runTime = new Date(selectedDateTime.value.time).getTime() / 1000 // 该实体配置的行动时间
    console.log(
      'selectedDateTime.value.time选择的行动时间',
      selectedDateTime.value.time
    )
    if (runTime && timestamp) {
      runSeconds = Math.floor(runTime - timestamp)
    }
    if (runSeconds < 0) {
      ElMessageBox.confirm(
        '当前选择的行动时间小于场景仿真时间，是否立即执行行动?(点击“确定”后将配置为立即执行该行动，点击“取消”后可重新选择行动时间)',
        '提示',
        {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }
      )
        .then(() => {
          // 若选择的时间小于场景时间，则询问是否立即执行
          // 点击确定后时间设置为0即为立即执行
          selectedCard.value.commandTime = 0
          selectedCard.value.commandTimeConfigured = selectedDateTime.value.time

          // 更新过滤后的数据
          state.filteredData[selectedCardIndex.value.row].redForces[
            selectedCardIndex.value.col
          ] = selectedCard.value
          selectedItemCard.value.push(selectedCardIndex.value)
          selectedIdCard.value.push(selectedCard.value.id)
          // 隐藏右键菜单
          hideContextMenu()
          selectedDateTime.value.time = null
          ElMessage.success('行动时间配置成功（立即执行）！')
        })
        .catch(() => {
          // 点击取消后重新选择行动时间
          ElMessage.info('取消行动配置！')
        })
    } else {
      // 选择的时间大于场景时间，则正常执行，赋值为两时间的相隔秒数
      selectedCard.value.commandTime = runSeconds
      selectedCard.value.commandTimeConfigured = selectedDateTime.value.time

      // 更新过滤后的数据
      state.filteredData[selectedCardIndex.value.row].redForces[
        selectedCardIndex.value.col
      ] = selectedCard.value
      selectedItemCard.value.push(selectedCardIndex.value)
      selectedIdCard.value.push(selectedCard.value.id)
      // 隐藏右键菜单
      hideContextMenu()
      selectedDateTime.value.time = null
      ElMessage.success('行动时间配置成功！')
    }
  }
}

// 立即执行行动（不设置时间）
const confirmCommandWithImmediateTime = () => {
  if (selectedCommandForTime.value) {
    // 更新选中编组的行动
    selectedCard.value.command = selectedCommandForTime.value.value
    selectedCard.value.commandConfigured = true
    selectedCard.value.commandTime = 0
    selectedCard.value.commandTimeConfigured = ''

    // 更新过滤后的数据
    state.filteredData[selectedCardIndex.value.row].redForces[
      selectedCardIndex.value.col
    ] = selectedCard.value

    selectedItemCard.value.push(selectedCardIndex.value)
    selectedIdCard.value.push(selectedCard.value.id)
    // 隐藏右键菜单
    hideContextMenu()
    ElMessage.success('行动时间配置成功（立即执行）！')
  }
}

// 取消编组行动
const cancelCardCommand = () => {
  // 取消选中编组的行动和时间
  selectedCard.value.command = null
  selectedCard.value.commandConfigured = false
  selectedCard.value.commandTime = null
  selectedCard.value.commandTimeConfigured = ''

  // 更新过滤后的数据
  state.filteredData[selectedCardIndex.value.row].redForces[
    selectedCardIndex.value.col
  ] = selectedCard.value
  for (let i = 0; i < selectedItemCard.value.length; i++) {
    if (
      selectedCardIndex.value.row == selectedItemCard.value[i].row &&
      selectedCardIndex.value.col == selectedItemCard.value[i].col
    ) {
      selectedItemCard.value.splice(i, 1)
    }
  }
  for (let j = 0; j < selectedIdCard.value.length; j++) {
    if (selectedCard.value.id == selectedIdCard.value[j]) {
      selectedIdCard.value.splice(j, 1)
    }
  }
  // 隐藏右键菜单
  hideContextMenu()
}

// 保存历史记录
const save = () => {
  if (state.hisName == '') {
    return ElMessage.warning('请输入记录名称！')
  }
  let json = {
    filteredData: state.filteredData,
    selectedItemCard: selectedItemCard.value,
    selectedIdCard: selectedIdCard.value
  }
  let params = {
    scenarioId: state.currentExperiment.scenarioId, // 想定id
    name: state.hisName,
    dataType: 'troop_recommend', // 类型：兵力推荐类型
    dataJson: JSON.stringify(json)
  }
  saveRelatedData(params).then((res) => {
    if (res.code == 200) {
      ElMessage.success('新增记录成功！')
      state.daotiaoHis = false // 关闭弹窗
      emitter.emit('refreshHistoryList', true)
    } else {
      ElMessage.error(res.message || '新增记录失败！')
    }
  })
}

// 保存动画处理方法
const handleSaveAnimation = async (saveAnimation) => {
  // 开始保存动画
  state.isSaving = true
  state.saveMessage = '正在收集已配置行动的编组信息...'
  state.saveProgress = 0
  state.savedCards = []

  // 收集所有已配置行动的编组
  // const configuredCards = saveAnimation
  const configuredCards = []
  state.filteredData.forEach((row, rowIndex) => {
    row.redForces.forEach((redForce, colIndex) => {
      if (redForce.commandConfigured) {
        configuredCards.push({
          ...redForce,
          rowIndex,
          colIndex,
          elementId: `red-force-${rowIndex}-${colIndex}`
        })
      }
    })
  })

  if (configuredCards.length === 0) {
    state.saveMessage = '未获取到配置行动的编组，无法执行，请先进行行动配置！'
    state.saveProgress = 100
    setTimeout(() => {
      state.isSaving = false
    }, 1500)
    return
  }

  // 显示信息框，等待100ms让信息框显示
  await new Promise((resolve) => setTimeout(resolve, 100))
  // 获取信息框位置
  const infoBox = document.querySelector('.save-info-box')
  if (!infoBox) {
    state.isSaving = false
    return
  }
  const infoBoxRect = infoBox.getBoundingClientRect()
  const infoBoxCenter = {
    x: infoBoxRect.left + infoBoxRect.width / 2,
    y: infoBoxRect.top + infoBoxRect.height / 2
  }

  // 批量处理所有编组飞行动画
  const animationPromises = []

  // 准备所有编组克隆并同时开始动画
  configuredCards.forEach((card) => {
    const element = document.getElementById(card.elementId)
    if (element) {
      // 获取编组位置
      const cardRect = element.getBoundingClientRect()
      const cardCenter = {
        x: cardRect.left + cardRect.width / 2,
        y: cardRect.top + cardRect.height / 2
      }

      // 创建编组克隆，用于动画
      const clone = element.cloneNode(true)
      clone.style.position = 'fixed'
      clone.style.left = `${cardRect.left}px`
      clone.style.top = `${cardRect.top}px`
      clone.style.width = `${cardRect.width}px`
      clone.style.height = `${cardRect.height}px`
      clone.style.zIndex = '3000'
      clone.style.pointerEvents = 'none'
      clone.style.transform = 'translateZ(0)'
      clone.style.transition = 'none'
      clone.classList.add('card-clone')
      document.body.appendChild(clone)

      // 创建动画完成的Promise
      const animationPromise = new Promise((resolve) => {
        // 动画时长缩短为500ms
        setTimeout(() => {
          // 移除克隆元素
          document.body.removeChild(clone)
          // 添加到已保存编组列表
          state.savedCards.push({
            name: card.groupName,
            type: card.command
          })
          resolve()
        }, 500)
      })

      animationPromises.push(animationPromise)

      // 添加动画样式，使用更短的过渡时间（500ms）
      setTimeout(() => {
        clone.style.transition = 'all 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        clone.style.left = `${infoBoxCenter.x}px`
        clone.style.top = `${infoBoxCenter.y}px`
        clone.style.transform = 'scale(0)'
        clone.style.opacity = '0'
      }, 50)
    }
  })
  // 更新进度为100%，因为所有编组同时处理
  state.saveMessage = '正在整理行动配置信息...'
  state.saveProgress = 100
  // 等待所有动画完成
  await Promise.all(animationPromises)

  // 模拟发送数据，缩短时间为500ms
  state.saveMessage = '正在发送数据到服务器...'
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // 保存完成，缩短显示时间为800ms
  state.saveMessage = '行动配置保存成功！'
  await new Promise((resolve) => setTimeout(resolve, 1500))

  // 关闭保存信息框
  state.isSaving = false
  ElMessage.success('行动配置执行成功，即将关闭兵力推荐面板！')
  setTimeout(() => {
    emitter.emit('showBLEventList', false)
  }, 1500)
}

// 计算属性：右键菜单样式
const contextMenuStyle = computed(() => {
  return {
    left: `${contextMenuPosition.value.x}px`,
    top: `${contextMenuPosition.value.y}px`
  }
})

// 点击页面空白处关闭右键菜单
onMounted(() => {
  const handleClickOutside = (event) => {
    if (contextMenuVisible.value) {
      const contextMenu = document.querySelector('.context-menu')
      if (contextMenu && !contextMenu.contains(event.target)) {
        hideContextMenu()
      }
    }
  }

  // document.addEventListener('click', handleClickOutside)
  document.addEventListener('contextmenu', (event) => {
    // 点击其他位置的右键菜单时关闭当前右键菜单
    if (contextMenuVisible.value) {
      hideContextMenu()
    }
  })
})

// 数据处理函数：为红方编组添加行动相关字段
const processRedForcesData = (redForces) => {
  return redForces.map((force) => ({
    ...force,
    // 添加行动相关字段，如果已存在则保留原有值
    command: force.command !== undefined ? force.command : null, // 当前编组的行动类型
    commandConfigured: force.command !== undefined && force.command !== null, // 行动是否已配置
    commandTime: force.commandTime || null, // 行动执行时间
    commandTimeConfigured: force.commandTimeConfigured || '', // 行动时间是否已配置
    selected: force.selected !== undefined ? force.selected : false, // 编组是否已被选中
    availableCommands: ['AttackTarget', 'recon', 'jam', 'defense'] // 该编组可选择的行动列表
  }))
}

// 数据过滤函数
const filterDataByCommand = () => {
  console.log('根据行动过滤数据:', props.currentCommand)
  // 这里可以根据不同行动类型进行数据过滤
  // 目前使用模拟数据，实际项目中可以根据行动类型从API获取不同数据
  state.filteredData = state.attackData.map((row) => {
    // 为红方编组添加行动相关字段
    const processedRedForces = processRedForcesData(row.redForces)
    // 根据当前行动类型过滤红方编组
    // 简单模拟：根据行动类型过滤红方编组
    let filteredRedForces = [...processedRedForces]

    if (props.currentCommand === 'AttackTarget') {
      // 攻击行动：显示所有红方编组
      filteredRedForces = processedRedForces
    } else if (props.currentCommand === 'recon') {
      // 侦察行动：只显示部分红方编组（模拟）
      filteredRedForces = processedRedForces.filter(
        (_, index) => index % 2 === 0
      )
    } else if (props.currentCommand === 'jam') {
      // 干扰行动：只显示部分红方编组（模拟）
      filteredRedForces = processedRedForces.filter(
        (_, index) => index % 3 === 0
      )
    } else if (props.currentCommand === 'defense') {
      // 防御行动：只显示部分红方编组（模拟）
      filteredRedForces = processedRedForces.filter(
        (_, index) => index % 2 === 1
      )
    }

    return {
      ...row,
      redForces: filteredRedForces
    }
  })

  console.log('过滤后的数据:', state.filteredData)
}

// 加载数据方法
const loadData = async () => {
  state.isLoading = true
  state.error = ''
  try {
    // 模拟API调用，加载public目录下的JSON文件
    // public目录下的文件会被直接复制到dist目录根目录，访问时不需要public前缀
    // const response = await fetch("/static/data/json/daotiaodata/attackData.json");
    let params = {
      scenarioId: state.currentExperiment.scenarioId,
      side: 'blue'
    }
    const response = await getPlatStatusGroupNodeBySide(params)
    // const data = await response.json();
    const data = await response
    if (data.code === 200) {
      state.attackData = data.data
      for (let i = 0; i < state.attackData.length; i++) {
        state.attackData[i].redForces = []
        let params = {
          scenarioId: state.currentExperiment.scenarioId,
          groupId: state.attackData[i].id
        }
        getPlanningResultsByGroup(params).then((res) => {
          if (res.code == 200) {
            state.attackData[i].redForces = res.data
          }
        })
      }
      setTimeout(() => {
        // 加载数据后进行过滤
        filterDataByCommand()
      }, 1000)
    } else {
      throw new Error(data.message || '数据加载失败')
    }
  } catch (error) {
    console.error('加载数据出错:', error)
    state.error = error.message || '数据加载失败，请稍后重试'
    // 加载失败时使用默认空数据
    state.attackData = []
    state.filteredData = []
  } finally {
    state.isLoading = false
  }
}

// 监听行动变化，重新过滤数据
watch(
  () => props.currentCommand,
  () => {
    filterDataByCommand()
  }
)

// 示例方法
const handleRefresh = () => {
  console.log('刷新数据')
  selectedItemCard.value = []
  selectedIdCard.value = []
  loadData()
}

const handleConfig = () => {
  console.log('配置')
  // 这里可以添加配置逻辑
}

// 全选功能：为所有红方编组添加当前行动
const handleSelectAll = (command) => {
  console.log('全选，为所有编组添加行动:', command)

  // 遍历所有行和红方编组
  state.filteredData.forEach((row) => {
    row.redForces.forEach((redForce) => {
      redForce.command = command
      redForce.commandConfigured = true
      redForce.commandTime = null // 全选时不设置时间，默认为立即执行
      redForce.commandTimeConfigured = ''
    })
  })
}

// 全不选功能：取消所有红方编组的行动配置
const handleDeselectAll = () => {
  console.log('全不选，取消所有编组行动')
  selectedItemCard.value = []
  selectedIdCard.value = []
  // 遍历所有行和红方编组
  state.filteredData.forEach((row) => {
    row.redForces.forEach((redForce) => {
      redForce.command = null
      redForce.commandConfigured = false
      redForce.commandTime = null
      redForce.commandTimeConfigured = ''
    })
  })
}

const handleHistorys = () => {
  state.daotiaoHis = true
}

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
// 时间选择器范围设置
// 常量：一天的毫秒数 - 提升可读性，避免魔法值
const ONE_DAY_MS = 24 * 3600 * 1000
// 获取限制时间范围
const getTimeRange = () => {
  const startTime = new Date(store.state.sceneModule.startDate)
  const endTime = new Date(store.state.sceneModule.endDate)
  return { startTime, endTime }
}

// 暴露方法和状态给父组件
defineExpose({
  handleRefresh,
  handleConfig,
  handleSelectAll,
  handleDeselectAll,
  handleHistorys,
  state,
  handleSaveAnimation
})

// 初始化加载数据
onMounted(() => {
  let blObject = JSON.parse(window.localStorage.getItem('blObject'))
  state.currentExperiment = blObject
  emitter.on('sendIsExpanded', (value) => {
    isExpanded.value = value
  })
  // 接收选择的历史数据
  emitter.on('sendHistoryValue', (value) => {
    let blData = JSON.parse(value.dataJson)
    state.filteredData = blData.filteredData
    selectedItemCard.value = blData.selectedItemCard
    selectedIdCard.value = blData.selectedIdCard
    proxy.$forceUpdate() // 强制重新渲染组件
  })
  loadData()
})
</script>

<style lang="less" scoped>
// 科技风变量
@tech-blue: #06d6f9;
@tech-dark-blue: #001a46;
@tech-light-blue: rgba(6, 214, 249, 0.1);
@tech-border: rgba(6, 214, 249, 0.3);
@tech-glow: 0 0 10px rgba(6, 214, 249, 0.5);

.daotiao-main-content {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  background: linear-gradient(135deg, #000a1a 0%, #001a46 50%, #000a1a 100%);
  position: relative;
  top: 15px;
  // 移除默认的margin和padding，确保与导航栏无缝衔接
  margin: 0;
  padding: 0;
  border: none;
  // 确保图例可见，不会被overflow隐藏

  // 科技背景网格
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-image: linear-gradient(
        rgba(6, 214, 249, 0.1) 1px,
        transparent 1px
      ),
      linear-gradient(90deg, rgba(6, 214, 249, 0.1) 1px, transparent 1px);
    background-size: 50px 50px;
    pointer-events: none;
    z-index: 0;
  }

  .content-body {
    flex: 1;
    overflow-y: auto;
    // overflow: auto;
    position: relative;
    z-index: 1;
    // 添加底部内边距，确保内容不会被图例遮挡
    padding: 0 0 55px 0;

    // 滚动条样式
    &::-webkit-scrollbar {
      width: 8px;
      height: 8px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(6, 214, 249, 0.1);
      border-radius: 4px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(6, 214, 249, 0.5);
      border-radius: 4px;
      transition: background 0.3s ease;

      &:hover {
        background: rgba(6, 214, 249, 0.8);
      }
    }
  }

  .grid-container {
    background: linear-gradient(
      135deg,
      rgba(2, 26, 70, 0.9) 0%,
      rgba(0, 40, 80, 0.9) 100%
    );
    box-shadow: 0 0 30px rgba(6, 214, 249, 0.2);
    position: relative;
    // 允许容器横向扩展
    width: auto;
    min-width: 100%;

    // 科技边框发光效果
    &::before {
      content: '';
      position: absolute;
      top: -2px;
      left: -2px;
      right: -2px;
      bottom: -2px;
      background: linear-gradient(135deg, @tech-blue, #0080ff, @tech-blue);
      border-radius: 10px;
      z-index: -1;
      opacity: 0.3;
      // 移除可能导致抖动的scale动画
    }
  }

  .grid-header {
    display: flex;
    background: linear-gradient(
      135deg,
      rgba(2, 26, 70, 0.98) 0%,
      rgba(0, 40, 80, 0.98) 100%
    );
    color: @tech-blue;
    font-weight: 600;
    font-size: 14px;
    border-bottom: 1px solid @tech-border;
    box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
    // 添加吸顶效果
    position: sticky;
    top: 0;
    z-index: 100;

    .header-cell {
      padding: 20px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-right: 1px solid @tech-border;
      position: relative;
      overflow: hidden;
      // 确保宽度计算方式一致
      box-sizing: border-box;
      font-size: 18px;
      font-weight: 700;

      // 科技线条装饰
      &::after {
        content: '';
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        height: 1px;
        background: linear-gradient(
          90deg,
          transparent 0%,
          @tech-blue 50%,
          transparent 100%
        );
        animation: lineScan 2s ease-in-out infinite;
      }

      @keyframes lineScan {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(100%);
        }
      }

      &.blue-target-header {
        width: 220px;
        border-right: 2px solid @tech-blue;
        // 与蓝方编组保持完全一致的边框样式
        border-left: 1px solid rgba(30, 144, 255, 0.5);
        border-bottom: 1px solid rgba(0, 191, 255, 0.3);
        border-top: 1px solid rgba(0, 191, 255, 0.6);
      }

      &.red-force-header {
        flex: 1;
        background: rgba(236, 5, 5, 0.4);
        color: rgba(118, 228, 255, 0.74);
      }
    }
  }

  .grid-row {
    display: flex;
    border-bottom: 1px solid @tech-border;
    transition: all 0.3s ease;
    background: rgba(0, 10, 26, 0.3);
    // 确保行容器能够水平滚动
    // overflow-x: auto;
    // 允许内容超出容器宽度
    white-space: nowrap;
    // 细滚动条，默认隐藏，悬停时显示，保持行高一致
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
    &::-webkit-scrollbar {
      height: 2px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: transparent;
      border-radius: 1px;
      transition: background 0.3s ease;
    }
    &:hover::-webkit-scrollbar-thumb {
      background: rgba(6, 214, 249, 0.5);
    }
    // 添加平滑滚动效果
    scroll-behavior: smooth;
    // 增加滚动区域的触摸体验
    -webkit-overflow-scrolling: touch;
    // 确保伪元素相对于父元素定位
    position: relative;
    // 移除固定宽度限制，允许根据内容自动扩展
    width: auto;

    &:hover {
      background: rgba(6, 214, 249, 0.1);
      box-shadow: inset 0 0 20px rgba(6, 214, 249, 0.1);
    }

    &:last-child {
      border-bottom: none;
    }

    // 为红方编组容器添加视觉指示器，提示可以横向滑动
    &:after {
      content: '';
      position: absolute;
      right: 10px;
      top: 50%;
      transform: translateY(-50%);
      width: 30px;
      height: 30px;
      background: linear-gradient(
        135deg,
        rgba(6, 214, 249, 0.6) 0%,
        rgba(0, 128, 255, 0.6) 100%
      );
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      opacity: 0;
      transition: opacity 0.3s ease;
      pointer-events: none;
      box-shadow: 0 0 15px rgba(6, 214, 249, 0.6);

      // 箭头图标
      &::before {
        content: '';
        width: 12px;
        height: 12px;
        border-top: 2px solid white;
        border-right: 2px solid white;
        transform: rotate(45deg);
      }
    }

    &:hover:after {
      opacity: 1;
      animation: pulse 1.5s infinite;
    }

    @keyframes pulse {
      0%,
      100% {
        opacity: 1;
        transform: translateY(-50%) scale(1);
      }
      50% {
        opacity: 0.7;
        transform: translateY(-50%) scale(1.1);
      }
    }
  }

  .grid-cell {
    padding: 20px;
    border-right: 1px solid @tech-border;
    position: relative;
    overflow: hidden;
    transition: all 0.3s ease;
    border-radius: 8px;
    // 添加基础阴影，增强立体感
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
    // 确保宽度计算方式一致，包括padding和border
    box-sizing: border-box;

    // 科技线条装饰
    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background: linear-gradient(
        90deg,
        transparent 0%,
        @tech-blue 50%,
        transparent 100%
      );
      opacity: 0;
      transition: opacity 0.3s ease;
    }

    &:hover::before {
      opacity: 1;
    }

    &.tech-cell {
      cursor: pointer;
      transition: all 0.3s ease;
      // 添加3D变换基础
      transform-style: preserve-3d;
      // 确保不会继承其他光标样式
      &:active {
        cursor: pointer;
      }
    }

    &.blue-target {
      width: 200px;
      margin: 10px;
      // 防止蓝方编组在flex布局中被压缩
      flex-shrink: 0;
      // 提高颜色亮度，增加透明度
      background: linear-gradient(
        135deg,
        rgba(30, 144, 255, 0.4) 0%,
        rgba(0, 191, 255, 0.4) 100%
      );
      border-right: 2px solid @tech-blue;
      transition: all 0.3s ease;
      // 增强边框和阴影，提升立体感
      border-left: 1px solid rgba(30, 144, 255, 0.5);
      border-bottom: 1px solid rgba(0, 191, 255, 0.3);
      border-top: 1px solid rgba(0, 191, 255, 0.6);
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);

      &:hover {
        // 增强悬停效果，提升立体感
        box-shadow: 0 6px 20px rgba(30, 144, 255, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.3),
          inset 0 0 30px rgba(30, 144, 255, 0.3);
        // 添加轻微的上浮效果，增强立体感
        transform: translateY(-2px);
      }

      // 蓝方特有装饰
      .tech-decoration {
        position: absolute;
        bottom: 3px;
        right: 3px;
        width: 40px;
        height: 40px;
      }
    }

    &.red-force {
      min-width: 180px;
      margin: 10px;
      border: 1px solid @tech-border;
      border-radius: 8px;
      transition: all 0.3s ease;
      // 增强立体感基础
      transform-style: preserve-3d;
      box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4),
        inset 0 1px 0 rgba(255, 255, 255, 0.2);

      &:hover {
        // 增强悬停效果，提升立体感
        box-shadow: 0 8px 25px rgba(6, 214, 249, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.3);
        // 添加轻微的上浮效果，增强立体感
        transform: translateY(-3px);
      }

      &.AttackTarget-all {
        // 提高绿色亮度，增加透明度
        background: linear-gradient(
          135deg,
          rgba(103, 194, 58, 0.5) 0%,
          rgba(72, 187, 120, 0.5) 100%
        );
        // 增强边框，提升立体感
        border-color: rgba(103, 194, 58, 0.8);
        border-left: 1px solid rgba(103, 194, 58, 0.6);
        border-bottom: 1px solid rgba(72, 187, 120, 0.4);
        border-top: 1px solid rgba(103, 194, 58, 0.9);
        // 增强发光效果
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4),
          0 0 20px rgba(103, 194, 58, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }

      &.AttackTarget-partial {
        // 提高黄色亮度，增加透明度
        background: linear-gradient(
          135deg,
          rgba(230, 162, 60, 0.5) 0%,
          rgba(247, 183, 49, 0.5) 100%
        );
        // 增强边框，提升立体感
        border-color: rgba(230, 162, 60, 0.8);
        border-left: 1px solid rgba(230, 162, 60, 0.6);
        border-bottom: 1px solid rgba(247, 183, 49, 0.4);
        border-top: 1px solid rgba(230, 162, 60, 0.9);
        // 增强发光效果
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4),
          0 0 20px rgba(230, 162, 60, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }
      &.none-partial {
        // 提高黄色亮度，增加透明度
        background: linear-gradient(
          135deg,
          rgba(231, 43, 43, 0.5) 0%,
          rgba(236, 4, 4, 0.5) 100%
        );
        // 增强边框，提升立体感
        border-color: rgba(253, 0, 0, 0.959);
        border-left: 1px solid rgba(243, 13, 13, 0.6);
        border-bottom: 1px solid rgba(238, 4, 4, 0.4);
        border-top: 1px solid rgba(236, 5, 5, 0.9);
        // 增强发光效果
        box-shadow: 0 4px 15px rgba(0, 0, 0, 0.4),
          0 0 20px rgba(226, 66, 17, 0.4),
          inset 0 1px 0 rgba(255, 255, 255, 0.2);
      }

      // 红方特有装饰
      .tech-decoration {
        position: absolute;
        bottom: 3px;
        right: 3px;
        width: 40px;
        height: 40px;
      }
      .lock {
        position: absolute;
        top: 10px;
        left: 10px;
        width: 30px;
        height: 30px;
        border: 1px solid rgba(245, 108, 108, 0.7);
        border-radius: 50%;
        opacity: 0.7;
        background: radial-gradient(
          circle,
          rgba(245, 108, 108, 0.5) 0%,
          transparent 70%
        );
        // 添加发光效果
        box-shadow: 0 0 15px rgba(245, 108, 108, 0.5);
      }
    }
  }

  .red-force-container {
    // 改为使用固定基础宽度，允许自由扩展
    // flex: 0 0 auto;
    display: flex;
    // 移除换行，确保编组水平排列
    flex-wrap: nowrap;
    align-items: center;
    padding: 10px;
    background: linear-gradient(
      135deg,
      rgba(2, 26, 70, 0.5) 0%,
      rgba(0, 40, 80, 0.5) 100%
    );
    // 确保容器能够自由扩展宽度
    min-width: 300px;
    // 确保行容器能够水平滚动
    overflow-x: auto;
    // 细滚动条，默认隐藏，悬停时显示，保持行高一致
    scrollbar-width: thin;
    scrollbar-color: transparent transparent;
    &::-webkit-scrollbar {
      height: 2px;
      background: transparent;
    }
    &::-webkit-scrollbar-thumb {
      background: transparent;
      border-radius: 1px;
      transition: background 0.3s ease;
    }
    &:hover::-webkit-scrollbar-thumb {
      background: rgba(6, 214, 249, 0.5);
    }
    // 添加平滑滚动效果
    scroll-behavior: smooth;
    // 增加滚动区域的触摸体验
    -webkit-overflow-scrolling: touch;
    // 确保伪元素相对于父元素定位
    // 确保容器内的编组不被压缩
    > .grid-cell.red-force {
      flex-shrink: 0;
    }
  }

  .target-info,
  .force-info {
    display: flex;
    flex-direction: column;
    gap: 8px;
    position: relative;
    z-index: 1;

    .tech-text {
      font-size: 16px;
      font-weight: 600;
      color: @tech-blue;
      text-shadow: 0 0 5px rgba(6, 214, 249, 0.5);
      font-family: 'Microsoft YaHei', sans-serif;
      width: 170px;
      overflow: hidden;
      text-overflow: ellipsis;
    }

    .tech-subtext {
      font-size: 12px;
      color: rgba(255, 255, 255, 0.7);
      font-family: 'Courier New', monospace;
      letter-spacing: 0.5px;
    }

    .AttackTarget-status {
      display: flex;
      align-items: center;
      gap: 4px;
      font-size: 12px;
      font-weight: 500;
      margin-top: 4px;
      font-family: 'Courier New', monospace;

      svg {
        color: currentColor;
      }

      .AttackTarget-all & {
        color: #67c23a;
        text-shadow: 0 0 5px rgba(103, 194, 58, 0.5);
      }

      .AttackTarget-partial & {
        color: #e6a23c;
        text-shadow: 0 0 5px rgba(230, 162, 60, 0.5);
      }
    }

    .attackable-count {
      color: @tech-blue;
      font-weight: 600;
      margin-left: 5px;
    }
  }

  // 通用科技文本样式
  .tech-text {
    font-size: 14px;
    color: @tech-blue;
    text-shadow: 0 0 5px rgba(6, 214, 249, 0.5);
    font-family: 'Microsoft YaHei', sans-serif;
    width: 170px;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  // 行动配置后的编组样式 - 只修改阴影效果
  // 使用更具体的选择器，确保覆盖原有的攻击状态样式
  .red-force.command-configured.AttackTarget-all {
    // 使用用户指定的绿色阴影效果
    box-shadow: 0 2px 30px rgb(44 255 0 / 83%), 0 0 50px rgb(103 194 58 / 40%),
      inset 0 0px 0 rgb(255 255 255 / 20%);
    border: 1px solid rgba(0, 250, 33, 0.856);
  }

  .red-force.command-configured.AttackTarget-partial {
    // 增强黄色阴影效果，使用更明亮的黄色和更高的透明度
    box-shadow: 0 2px 30px rgb(255 215 0 / 60%), 0 0 50px rgb(230 162 60 / 80%),
      inset 0 1px 0 rgb(255 255 255 / 30%);
    border: 1px solid rgba(255, 251, 0, 0.829);
  }
  .red-force.command-configured.none-partial {
    // 增强黄色阴影效果，使用更明亮的黄色和更高的透明度
    box-shadow: 0 4px 15px rgba(255, 0, 0, 0.6), 0 0 25px rgba(248, 3, 3, 0.8),
      inset 0 1px 0 rgb(255 255 255 / 30%);
  }

  @keyframes glowPulse {
    0%,
    100% {
      opacity: 0.7;
      transform: scale(1);
    }
    50% {
      opacity: 1;
      transform: scale(1.02);
    }
  }

  // 右键菜单样式
  .context-menu {
    position: fixed;
    width: 300px;
    background: linear-gradient(
      135deg,
      rgba(3, 35, 90, 0.98) 0%,
      rgba(0, 50, 100, 0.98) 100%
    );
    border: 1px solid @tech-border;
    border-radius: 8px;
    box-shadow: 0 4px 25px rgba(0, 0, 0, 0.7), 0 0 30px rgba(6, 214, 249, 0.4);
    z-index: 2000;
    animation: fadeIn 0.2s ease-out;
    overflow: hidden;
    backdrop-filter: blur(10px);

    .menu-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: linear-gradient(
        135deg,
        rgba(6, 214, 249, 0.2) 0%,
        rgba(0, 128, 255, 0.2) 100%
      );
      border-bottom: 1px solid @tech-border;
      color: @tech-blue;
      font-weight: 600;
      font-size: 14px;

      .menu-close {
        cursor: pointer;
        font-size: 16px;
        transition: all 0.2s ease;

        &:hover {
          color: #ff4757;
          transform: scale(1.1);
        }
      }
    }

    .menu-content {
      padding: 12px;

      .menu-label {
        color: @tech-blue;
        font-weight: 600;
        font-size: 13px;
        margin-bottom: 8px;
        display: block;
        text-align: left;
      }

      // 行动选择区域
      .command-selection {
        margin-bottom: 16px;

        .command-item {
          margin-bottom: 4px;
        }
      }

      // 时间选择区域
      .time-selection {
        margin-bottom: 16px;

        .time-picker-inputs {
          display: flex;
          flex-direction: column;
          gap: 10px;

          .input-group {
            display: flex;
            align-items: center;
            gap: 8px;

            label {
              color: rgba(255, 255, 255, 0.8);
              font-size: 12px;
              width: 40px;
            }

            .time-input {
              flex: 1;
              padding: 6px 8px;
              border: 1px solid @tech-border;
              border-radius: 4px;
              background: rgba(6, 214, 249, 0.1);
              color: @tech-blue;
              font-size: 12px;
              outline: none;
              transition: all 0.3s ease;

              &:focus {
                border-color: @tech-blue;
                box-shadow: 0 0 10px rgba(6, 214, 249, 0.3);
                background: rgba(6, 214, 249, 0.15);
              }
            }
          }
        }
      }

      // 操作按钮区域
      .menu-actions {
        display: flex;
        flex-direction: column;
        gap: 10px;

        button {
          padding: 8px 12px;
          border: 1px solid @tech-border;
          border-radius: 4px;
          font-size: 12px;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;

          &:disabled {
            opacity: 0.5;
            cursor: not-allowed;
            box-shadow: none;
            background: rgba(6, 214, 249, 0.05) !important;
            border-color: rgba(6, 214, 249, 0.2) !important;
            color: rgba(6, 214, 249, 0.5) !important;
          }

          &.btn-confirm {
            background: linear-gradient(
              135deg,
              rgba(6, 214, 249, 0.2),
              rgba(0, 128, 255, 0.2)
            );
            color: @tech-blue;

            &:not(:disabled):hover {
              background: linear-gradient(
                135deg,
                rgba(6, 214, 249, 0.3),
                rgba(0, 128, 255, 0.3)
              );
              border-color: @tech-blue;
              box-shadow: 0 0 10px rgba(6, 214, 249, 0.4);
            }
          }

          &.btn-immediate {
            background: rgba(103, 194, 58, 0.1);
            color: #67c23a;
            border-color: rgba(103, 194, 58, 0.3);

            &:not(:disabled):hover {
              background: rgba(103, 194, 58, 0.2);
              border-color: #67c23a;
              box-shadow: 0 0 10px rgba(103, 194, 58, 0.3);
            }
          }
        }
      }

      // 通用菜单项样式
      .menu-item {
        display: flex;
        align-items: center;
        gap: 10px;
        padding: 8px 16px;
        color: rgba(255, 255, 255, 0.9);
        font-size: 13px;
        cursor: pointer;
        transition: all 0.3s ease;
        position: relative;
        border-radius: 4px;

        &:hover {
          background: linear-gradient(
            135deg,
            rgba(6, 214, 249, 0.2) 0%,
            rgba(0, 128, 255, 0.2) 100%
          );
          color: @tech-blue;
          padding-left: 20px;
        }

        &.active {
          background: linear-gradient(
            135deg,
            rgba(6, 214, 249, 0.3) 0%,
            rgba(0, 128, 255, 0.3) 100%
          );
          color: @tech-blue;
          font-weight: 600;
        }

        &.active::before {
          content: '✓';
          position: absolute;
          left: 8px;
          color: @tech-blue;
          font-weight: bold;
        }

        &.cancel-command {
          margin-top: 8px;
          padding: 8px 16px;
          color: #ff4757;
          border-top: 1px solid @tech-border;
          border-radius: 0;

          &:hover {
            background: linear-gradient(
              135deg,
              rgba(255, 71, 87, 0.2) 0%,
              rgba(255, 107, 129, 0.2) 100%
            );
            color: #ff4757;
          }
        }

        .command-icon {
          font-size: 16px;
          width: 20px;
          text-align: center;
        }
      }
    }
  }
  // 加载状态样式增强
  .loading-state,
  .error-state,
  .empty-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 500px;
    color: @tech-blue;
    font-family: 'Courier New', monospace;

    .loading-spinner {
      width: 50px;
      height: 50px;
      border: 3px solid rgba(6, 214, 249, 0.2);
      border-top: 3px solid @tech-blue;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin-bottom: 15px;
    }

    @keyframes spin {
      0% {
        transform: rotate(0deg);
      }
      100% {
        transform: rotate(360deg);
      }
    }

    .loading-text,
    .error-text,
    .empty-text {
      color: @tech-blue;
      font-size: 14px;
      margin-top: 10px;
    }

    .retry-btn {
      margin-top: 20px;
      padding: 8px 16px;
      border: 1px solid @tech-border;
      border-radius: 4px;
      background: linear-gradient(
        135deg,
        rgba(6, 214, 249, 0.1) 0%,
        rgba(0, 128, 255, 0.1) 100%
      );
      color: @tech-blue;
      cursor: pointer;
      transition: all 0.3s ease;

      &:hover {
        border-color: @tech-blue;
        background: linear-gradient(
          135deg,
          rgba(6, 214, 249, 0.2) 0%,
          rgba(0, 128, 255, 0.2) 100%
        );
        box-shadow: @tech-glow;
      }
    }
  }
  .command-disabled {
    background: #727171 !important;
    border: #727171 !important;
  }
}

.daotiao-his {
  width: 300px;
  height: 170px;
  position: fixed;
  left: calc(50% - 150px);
  top: calc(50% - 100px);
  background: linear-gradient(
    135deg,
    rgba(2, 26, 70, 0.95) 0%,
    rgba(0, 40, 80, 0.95) 100%
  );
  border: 1px solid rgba(6, 214, 249, 0.5);
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(6, 214, 249, 0.3),
    inset 0 0 20px rgba(6, 214, 249, 0.1);
  color: #fff;
  font-size: 14px;
  z-index: 9999;
  overflow: hidden;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      opacity: 0;
      transform: translateY(-10px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }

  // 科技边框效果
  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    border: 1px solid transparent;
    border-radius: 8px;
    background: linear-gradient(135deg, #06d6f9, #0080ff) border-box;
    -webkit-mask: linear-gradient(#fff 0 0) padding-box,
      linear-gradient(#fff 0 0);
    -webkit-mask-composite: xor;
    mask-composite: exclude;
    pointer-events: none;
  }
  .details-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 12px 15px;
    background: linear-gradient(
      90deg,
      rgba(6, 214, 249, 0.2) 0%,
      rgba(0, 128, 255, 0.2) 100%
    );
    border-bottom: 1px solid rgba(6, 214, 249, 0.3);

    .header-title {
      display: flex;
      align-items: center;
      gap: 8px;
      font-size: 14px;
      font-weight: 600;
      color: #06d6f9;
      text-shadow: 0 0 5px rgba(6, 214, 249, 0.5);
    }

    .header-close {
      cursor: pointer;
      padding: 4px;
      border-radius: 4px;
      transition: all 0.3s ease;

      &:hover {
        background-color: rgba(6, 214, 249, 0.2);
        transform: rotate(90deg);
      }
    }
  }
  .details-content {
    padding: 15px;
    max-height: 300px;
    overflow-y: auto;

    // 滚动条样式
    &::-webkit-scrollbar {
      width: 6px;
    }

    &::-webkit-scrollbar-track {
      background: rgba(6, 214, 249, 0.1);
      border-radius: 3px;
    }

    &::-webkit-scrollbar-thumb {
      background: rgba(6, 214, 249, 0.5);
      border-radius: 3px;
      transition: background 0.3s ease;

      &:hover {
        background: rgba(6, 214, 249, 0.8);
      }
    }

    .detail-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 0;
      border-bottom: 1px solid rgba(6, 214, 249, 0.1);

      &:last-child {
        border-bottom: none;
      }

      .item-label {
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
        display: inline-block;
        width: 80px;
        text-align: right;
      }

      .item-value {
        color: #fff;
        font-size: 13px;
        font-weight: 500;
        display: inline-block;
        width: 170px;
        text-align: left;
        margin-left: 10px;
        .time-input {
          flex: 1;
          padding: 6px 8px;
          border: 1px solid @tech-border;
          border-radius: 4px;
          background: rgba(6, 214, 249, 0.1);
          color: @tech-blue;
          font-size: 12px;
          outline: none;
          transition: all 0.3s ease;

          &:focus {
            border-color: @tech-blue;
            box-shadow: 0 0 10px rgba(6, 214, 249, 0.3);
            background: rgba(6, 214, 249, 0.15);
          }
        }
      }

      .AttackTarget-status {
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;

        &.all {
          background: linear-gradient(
            135deg,
            rgba(103, 194, 58, 0.3) 0%,
            rgba(72, 187, 120, 0.3) 100%
          );
          color: #67c23a;
          border: 1px solid rgba(103, 194, 58, 0.5);
        }

        &.partial {
          background: linear-gradient(
            135deg,
            rgba(230, 162, 60, 0.3) 0%,
            rgba(247, 183, 49, 0.3) 100%
          );
          color: #e6a23c;
          border: 1px solid rgba(230, 162, 60, 0.5);
        }
        &.commandDisabled {
          background: linear-gradient(
            135deg,
            rgba(238, 13, 5, 0.3) 0%,
            rgba(241, 11, 11, 0.3) 100%
          );
          color: #e74022;
          border: 1px solid rgba(247, 39, 32, 0.5);
        }
      }

      .side {
        padding: 2px 8px;
        border-radius: 12px;
        font-size: 11px;
        font-weight: 600;

        &.blue {
          background: linear-gradient(
            135deg,
            rgba(30, 144, 255, 0.3) 0%,
            rgba(0, 191, 255, 0.3) 100%
          );
          color: #409eff;
          border: 1px solid rgba(30, 144, 255, 0.5);
        }

        &.red {
          background: linear-gradient(
            135deg,
            rgba(245, 108, 108, 0.3) 0%,
            rgba(234, 64, 64, 0.3) 100%
          );
          color: #f56c6c;
          border: 1px solid rgba(245, 108, 108, 0.5);
        }
      }
    }
    .footer {
      margin-top: 15px;
      text-align: right;
      button {
        &.btn-confirm {
          background: linear-gradient(
            135deg,
            rgba(6, 214, 249, 0.2),
            rgba(0, 128, 255, 0.2)
          );
          color: @tech-blue;
          padding: 5px 20px;

          &:not(:disabled):hover {
            background: linear-gradient(
              135deg,
              rgba(6, 214, 249, 0.3),
              rgba(0, 128, 255, 0.3)
            );
            border-color: @tech-blue;
            box-shadow: 0 0 10px rgba(6, 214, 249, 0.4);
          }
        }
      }
    }
  }
}

// 保存信息框样式
.save-info-box {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 400px;
  background: linear-gradient(
    135deg,
    rgba(3, 35, 90, 0.98) 0%,
    rgba(0, 50, 100, 0.98) 100%
  );
  border: 1px solid @tech-border;
  border-radius: 12px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.8), 0 0 50px rgba(6, 214, 249, 0.5);
  z-index: 3000;
  backdrop-filter: blur(15px);
  animation: slideIn 0.3s ease-out;
  overflow: hidden;

  // 科技边框发光效果
  &::before {
    content: '';
    position: absolute;
    top: -2px;
    left: -2px;
    right: -2px;
    bottom: -2px;
    background: linear-gradient(135deg, @tech-blue, #0080ff, @tech-blue);
    border-radius: 14px;
    z-index: -1;
    opacity: 0.5;
    animation: borderGlow 2s ease-in-out infinite;
  }

  .save-info-header {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
    background: linear-gradient(
      135deg,
      rgba(6, 214, 249, 0.2) 0%,
      rgba(0, 128, 255, 0.2) 100%
    );
    border-bottom: 1px solid @tech-border;
    color: @tech-blue;
    font-weight: 600;
    font-size: 16px;
  }

  .save-info-content {
    padding: 16px;
    max-height: 250px;
    overflow-y: auto;

    .save-info-text {
      color: rgba(255, 255, 255, 0.9);
      font-size: 14px;
      margin-bottom: 12px;
      text-align: center;
      min-height: 20px;
    }

    .saved-cards-container {
      display: flex;
      flex-direction: column;
      gap: 8px;
    }

    .saved-card-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 8px 12px;
      background: rgba(6, 214, 249, 0.1);
      border: 1px solid @tech-border;
      border-radius: 6px;
      animation: cardSlideIn 0.3s ease-out forwards;
      opacity: 0;
      transform: translateX(-20px);

      .card-name {
        color: @tech-blue;
        font-weight: 600;
      }

      .card-type {
        color: rgba(255, 255, 255, 0.7);
        font-size: 12px;
      }
    }
  }

  .save-info-footer {
    padding: 12px 16px;
    border-top: 1px solid @tech-border;
    background: rgba(6, 214, 249, 0.05);

    .progress-bar {
      height: 6px;
      background: rgba(6, 214, 249, 0.2);
      border-radius: 3px;
      overflow: hidden;
      position: relative;

      .progress-fill {
        height: 100%;
        background: linear-gradient(90deg, @tech-blue, #0080ff);
        border-radius: 3px;
        transition: width 0.3s ease;
        box-shadow: 0 0 10px rgba(6, 214, 249, 0.6);
        animation: progressGlow 1.5s ease-in-out infinite;
      }
    }
  }
}
// 保存信息框动画
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translate(-50%, -60%) scale(0.9);
  }
  to {
    opacity: 1;
    transform: translate(-50%, -50%) scale(1);
  }
}

@keyframes borderGlow {
  0%,
  100% {
    opacity: 0.5;
    transform: scale(1);
  }
  50% {
    opacity: 0.8;
    transform: scale(1.02);
  }
}

@keyframes cardSlideIn {
  from {
    opacity: 0;
    transform: translateX(-20px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes progressGlow {
  0%,
  100% {
    box-shadow: 0 0 10px rgba(6, 214, 249, 0.6);
  }
  50% {
    box-shadow: 0 0 20px rgba(6, 214, 249, 0.9);
  }
}
// 编组克隆样式 - 保持原有颜色，只添加发光和阴影增强
.card-clone {
  border-radius: 8px;
  // 保留原有颜色，只添加发光效果增强
  animation: cloneGlow 0.5s ease-out infinite alternate;
  // 确保克隆元素继承原元素的所有样式，不覆盖颜色
  background: inherit !important;
  border: inherit !important;
  box-shadow: inherit !important;
  // 只在原有基础上增强发光效果
  filter: drop-shadow(0 0 15px rgba(6, 214, 249, 0.5));
}

@keyframes cloneGlow {
  from {
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5), 0 0 20px rgba(6, 214, 249, 0.4);
  }
  to {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.7), 0 0 40px rgba(6, 214, 249, 0.8);
  }
}
// 选中编组样式
.red-force.selected {
  animation: selectedPulse 1.5s ease-in-out infinite;
}

@keyframes selectedPulse {
  0%,
  100% {
    box-shadow: 0 4px 15px rgba(6, 214, 249, 0.4),
      0 0 20px rgba(6, 214, 249, 0.2);
  }
  50% {
    box-shadow: 0 8px 25px rgba(6, 214, 249, 0.6),
      0 0 40px rgba(6, 214, 249, 0.4);
  }
}
// &.expanded {
//   height: 800px;
// }
</style>
