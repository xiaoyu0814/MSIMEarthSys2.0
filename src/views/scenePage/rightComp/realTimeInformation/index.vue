<template>
  <div class="realTimeInfo">
    <Transition
      name="custom-classes"
      enter-active-class="animate__animated animate__fadeIn"
      leave-active-class="animate__animated animate__fadeOut"
    >
      <img
        v-show="!state.rightShow"
        class="right-shrink"
        :src="
          state.rightShow
            ? require('@/assets/image/panelIcons/telescoping.png')
            : require('@/assets/image/panelIcons/telescoping_1.png')
        "
        @click="rightContentShow"
      />
    </Transition>
    <Transition
      name="custom-classes"
      enter-active-class="animate__animated animate__backInRight"
      leave-active-class="animate__animated animate__backOutRight"
    >
      <div class="log-information" v-show="state.rightShow">
        <div class="pie-interaction">
          <img
            class="content-img"
            :src="
              state.rightShow
                ? require('@/assets/image/panelIcons/telescoping_1.png')
                : require('@/assets/image/panelIcons/telescoping.png')
            "
            @click="rightContentShow"
          />
          <div class="formulate-title">
            <span>作战信息</span>
            <div style="position: absolute; right: 12%">
              <span class="cleanInfo" @click="cleanAllInfo">清空信息</span>
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
            </div>
          </div>
          <!-- Tab页 -->
          <div class="tab-container">
            <div
              class="tab-item"
              :class="{ active: state.activeTab === 'white' }"
              @click="state.activeTab = 'white'"
            >
              <img
                class="tab-point"
                src="@/assets/image/realTimeInformation/circleWhite.png"
                alt=""
              />
              <span>白方</span>
              <span class="tab-count">{{
                getFilteredList('white').length
              }}</span>
            </div>
            <div
              class="tab-item"
              :class="{ active: state.activeTab === 'red' }"
              @click="state.activeTab = 'red'"
            >
              <img
                class="tab-point"
                src="@/assets/image/realTimeInformation/circleRed.png"
                alt=""
              />
              <span>红方</span>
              <span class="tab-count">{{ getFilteredList('red').length }}</span>
            </div>
            <div
              class="tab-item"
              :class="{ active: state.activeTab === 'blue' }"
              @click="state.activeTab = 'blue'"
            >
              <img
                class="tab-point"
                src="@/assets/image/realTimeInformation/circleBlue.png"
                alt=""
              />
              <span>蓝方</span>
              <span class="tab-count">{{
                getFilteredList('blue').length
              }}</span>
            </div>
            <div
              class="tab-item"
              :class="{ active: state.activeTab === 'other' }"
              @click="state.activeTab = 'other'"
            >
              <img
                class="tab-point"
                src="@/assets/image/realTimeInformation/circleGreen.png"
                alt=""
              />
              <span>其他</span>
              <span class="tab-count">{{
                getFilteredList('other').length
              }}</span>
            </div>
            <div
              class="tab-item"
              :class="{ active: state.activeTab === 'environment' }"
              @click="state.activeTab = 'environment'"
            >
              <img
                class="tab-point"
                src="@/assets/image/realTimeInformation/circleEnvironment.png"
                alt=""
              />
              <span>战场环境</span>
              <span class="tab-count">{{
                getFilteredList('environment').length
              }}</span>
            </div>
          </div>
          <!-- 二级筛选菜单 -->
          <!-- <div class="filter-container">
            <div class="filter-group">
              <div class="filter-label">消息类型</div>
              <select
                class="filter-select"
                v-model="state.selectedMessageType"
                @change="onMessageTypeChange"
              >
                <option value="all">全部</option>
                <option value="tracking">局域追踪</option>
                <option value="fire">火力打击</option>
                <option value="jam">电磁干扰</option>
                <option value="network">网络通信</option>
                <option value="task">任务关联</option>
                <option value="comment">模型影响</option>
              </select>
            </div>
            <div class="filter-group">
              <div class="filter-label">消息主体</div>
              <select
                class="filter-select"
                v-model="state.selectedSubject"
                @change="onSubjectChange"
              >
                <option value="all">全部</option>
                <option
                  v-for="(group, groupIndex) in simulationGroupList"
                  :key="groupIndex"
                  :value="group.model_code"
                >
                  {{ group.model_name }}
                </option>
              </select>
            </div>
          </div> -->
          <!-- 日志内容 -->
          <div class="collapse-interaction" id="log_con">
            <div
              class="single-log"
              v-for="(item, index) in currentLogList"
              :key="`${state.activeTab}-${index}`"
            >
              <div class="left-point">
                <div class="line" :class="item.first ? 'line-first' : ''"></div>
                <div>
                  <img
                    class="point"
                    v-if="item.camp == '0'"
                    src="@/assets/image/realTimeInformation/circleWhite.png"
                    alt=""
                  />
                  <img
                    class="point"
                    v-else-if="item.camp == '1'"
                    src="@/assets/image/realTimeInformation/circleRed.png"
                    alt=""
                  />
                  <img
                    class="point"
                    v-else-if="item.camp == '2'"
                    src="@/assets/image/realTimeInformation/circleBlue.png"
                    alt=""
                  />
                  <img
                    class="point"
                    v-else-if="item.camp == 'environment'"
                    src="@/assets/image/realTimeInformation/circleEnvironment.png"
                    alt=""
                  />
                  <img
                    class="point"
                    v-else
                    src="@/assets/image/realTimeInformation/circleGreen.png"
                    alt=""
                  />
                </div>
              </div>
              <div class="log-side animate__animated animate__backInRight">
                <div class="log-item">
                  <div class="log-meta">
                    <span class="log-type" v-if="item.messageType">
                      {{ getMessageTypeLabel(item.messageType) }}
                    </span>
                    <span class="time" v-if="item.sendTime">{{
                      item.sendTime
                    }}</span>
                  </div>
                  <div class="msg">
                    <div v-if="item.more" class="more-msg">
                      <div
                        :style="{ color: item.color }"
                        v-for="(subMsg, subIndex) in item.msg"
                        :key="subIndex"
                      >
                        <span>
                          <img
                            class="point"
                            v-if="item.camp == '0'"
                            src="@/assets/image/realTimeInformation/circleWhite.png"
                            alt=""
                          />
                          <img
                            class="point"
                            v-else-if="item.camp == '1'"
                            src="@/assets/image/realTimeInformation/circleRed.png"
                            alt=""
                          />
                          <img
                            class="point"
                            v-else-if="item.camp == '2'"
                            src="@/assets/image/realTimeInformation/circleBlue.png"
                            alt=""
                          />
                          <img
                            class="point"
                            v-else-if="item.camp == 'environment'"
                            src="@/assets/image/realTimeInformation/circleEnvironment.png"
                            alt=""
                          />
                          <img
                            class="point"
                            v-else
                            src="@/assets/image/realTimeInformation/circleGreen.png"
                            alt=""
                          />
                        </span>
                        <span
                          class="text-content"
                          v-for="(seg, segIndex) in subMsg.msg.split('${')"
                          :key="segIndex"
                        >
                          <span v-if="seg.indexOf('}') === -1">{{ seg }}</span>
                          <span
                            v-else
                            v-for="(part, partIndex) in seg.split('}')"
                            :key="partIndex"
                            :class="
                              partIndex === 0 ? 'underLine pointer-cursor' : ''
                            "
                            @click="showDia(part, partIndex, subMsg)"
                          >
                            {{ part }}
                          </span>
                        </span>
                      </div>
                    </div>
                    <span v-else :style="{ color: item.color }">
                      <span
                        class="text-content"
                        v-for="(seg, segIndex) in item.msg.split('${')"
                        :key="segIndex"
                      >
                        <span v-if="item.camp == 'environment'" class="env-msg">
                          <ul class="env-list">
                            <li
                              class="env-item"
                              v-for="(row, idx) in safeParseJson(seg)._fields ||
                              []"
                              :key="idx"
                            >
                              <span class="env-key">{{ row.label }}:</span>
                              <span
                                v-if="
                                  row.type === 'severity' || row.type === 'side'
                                "
                                class="env-value truncate-value"
                                :style="{ color: row.color }"
                                :title="formatValueForTitle(row._fullText)"
                                >{{ row.value }}</span
                              >
                              <span
                                v-else
                                class="env-value truncate-value"
                                :title="formatValueForTitle(row._fullText)"
                                >{{ row.value }}</span
                              >
                            </li>
                          </ul>
                        </span>
                        <span v-else-if="seg.indexOf('}') === -1">{{
                          seg
                        }}</span>
                        <span
                          v-else
                          v-for="(part, partIndex) in seg.split('}')"
                          :key="partIndex"
                          :class="
                            partIndex === 0 ? 'underLine pointer-cursor' : ''
                          "
                          @click="showDia(part, partIndex, item)"
                        >
                          {{ part }}
                        </span>
                      </span>
                    </span>
                  </div>
                  <div class="log-triangle"></div>
                </div>
              </div>
            </div>
            <!-- 空数据提示 -->
            <div v-if="currentLogList.length === 0" class="empty-tip">
              暂无消息
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { reactive, watch, computed } from 'vue'
import store from '@/store'
import emitter from '@/utils/eventbus'
import { getTime } from '@/utils/meteorology/utils'
import { getDeduceSchema, buildDeduceFields } from './deduceMessageSchemas.js'

// 消息类型映射
const messageTypeMap = {
  RE_LTrackInit: 'tracking',
  RE_LTrackDrop: 'tracking',
  RE_WeaponF: 'fire',
  RE_WeaponT: 'fire',
  RE_JamA: 'jam',
  RE_JamE: 'jam',
  RE_MR: 'network',
  RE_MRE: 'network',
  Task_Aign: 'task',
  Task_Completed: 'task',
  Comment: 'comment'
}

// 消息类型标签映射
const messageTypeLabelMap = {
  tracking: '局域追踪',
  fire: '火力打击',
  jam: '电磁干扰',
  network: '网络通信',
  task: '任务关联',
  comment: '评论'
}

// 消息类型到事件类型的反向映射
const typeToEventTypes = {
  tracking: ['RE_LTrackInit', 'RE_LTrackDrop'],
  fire: ['RE_WeaponF', 'RE_WeaponT'],
  jam: ['RE_JamA', 'RE_JamE'],
  network: ['RE_MR', 'RE_MRE'],
  task: ['Task_Aign', 'Task_Completed'],
  comment: ['Comment']
}

const threatLevels = [
  { level: 1, name: '安全', color: '#00b42a' },
  { level: 2, name: '极低风险', color: '#36cf66' },
  { level: 3, name: '低风险', color: '#6ddf85' },
  { level: 4, name: '一般风险', color: '#ffc51f' },
  { level: 5, name: '中等风险', color: '#ff9f2e' },
  { level: 6, name: '较高风险', color: '#ff7d00' },
  { level: 7, name: '高风险', color: '#f53f3f' },
  { level: 8, name: '严重风险', color: '#e02020' },
  { level: 9, name: '极高风险', color: '#c00000' },
  { level: 10, name: '致命风险', color: '#8b0000' }
]

// 模拟数据主体列表
const simulationGroupList = reactive([
  {
    model_name: '颠簸区域',
    model_code: 'BOUNCE_AREA',
    member_list: [
      {
        platform_id: 'CH-5-1',
        name_cn: '彩虹-5-1',
        name_en: 'CH-5-1',
        platform_type: '无人侦察机',
        camp: 'red'
      }
    ]
  },
  {
    model_name: '可见光',
    model_code: 'VISIBILITY',
    member_list: [
      {
        platform_id: 'CH-5-1',
        name_cn: '彩虹-5-1',
        name_en: 'CH-5-1',
        platform_type: '无人侦察机',
        camp: 'red'
      },
      {
        platform_id: 'CH-5-2',
        name_cn: '彩虹-5-2',
        name_en: 'CH-5-2',
        platform_type: '无人侦察机',
        camp: 'red'
      },
      {
        platform_id: 'CH-5-3',
        name_cn: '彩虹-5-3',
        name_en: 'CH-5-3',
        platform_type: '无人侦察机',
        camp: 'red'
      }
    ]
  }
])

// 收集所有主体名称，用于匹配
const getAllSubjectNames = (modelCode) => {
  const names = new Set()
  const group = simulationGroupList.find((g) => g.model_code === modelCode)
  if (group) {
    for (const member of group.member_list) {
      names.add(member.platform_id)
      names.add(member.name_cn)
      names.add(member.name_en)
    }
  }
  return names
}

const state = reactive({
  activeTab: 'white', // 当前选中的tab：white/red/blue/other/environment
  selectedMessageType: 'all', // 选中的消息类型
  selectedSubject: 'all', // 选中的消息主体
  whiteLogList: [], // 白方消息列表（包含所有消息）
  redLogList: [], // 红方消息列表
  blueLogList: [], // 蓝方消息列表
  otherLogList: [], // 其他阵营消息列表
  environmentLogList: [], // 战场环境消息列表（仅包含comment类型）
  colorMap: {}, // 存储颜色与属性值的关联
  rightShow: true
})

// 获取指定阵营的未筛选列表
const getCampList = (camp) => {
  switch (camp) {
    case 'white':
      return state.whiteLogList
    case 'red':
      return state.redLogList
    case 'blue':
      return state.blueLogList
    case 'other':
      return state.otherLogList
    case 'environment':
      return state.environmentLogList
    default:
      return state.whiteLogList
  }
}

// 获取筛选后的列表
const getFilteredList = (camp) => {
  const list = getCampList(camp)

  // 战场环境tab只显示comment类型消息，不需要其他筛选
  if (camp === 'environment') {
    return list
  }

  return list.filter((item) => {
    // 消息类型筛选：检查原始事件类型是否在选中的类型包含的事件类型中
    let typeMatch = true
    if (state.selectedMessageType !== 'all') {
      const allowedTypes = typeToEventTypes[state.selectedMessageType] || []
      typeMatch = allowedTypes.includes(item.originalType)
    }

    // 消息主体筛选：检查sName和pName是否包含在选中的主体集合中
    let subjectMatch = true
    if (state.selectedSubject !== 'all') {
      const subjectNames = getAllSubjectNames(state.selectedSubject)
      // 检查sName或pName是否在主体集合中
      const sNameMatch = item.sName && subjectNames.has(item.sName)
      const pNameMatch = item.pName && subjectNames.has(item.pName)
      subjectMatch = sNameMatch || pNameMatch
    }

    return typeMatch && subjectMatch
  })
}

// 计算属性：根据当前选中的tab和筛选条件返回对应的消息列表
const currentLogList = computed(() => {
  return getFilteredList(state.activeTab)
})

// 获取消息类型标签
const getMessageTypeLabel = (type) => {
  return messageTypeLabelMap[type] || ''
}

// 消息类型变化处理
const onMessageTypeChange = () => {
  console.log('消息类型已变更:', state.selectedMessageType)
}

// 消息主体变化处理
const onSubjectChange = () => {
  console.log('消息主体已变更:', state.selectedSubject)
}
const handleClose = () => {
  emitter.emit('closeBottomControlPanel', 'right')
  emitter.emit('tagActiveClose', 'battleInfo')
}

watch(
  () => store.state.sceneModule.czmlEventSourceData,
  (newValue, oldValue) => {
    console.log('czmlEventSourceData', newValue)
    let obj = newValue
    let czmlEventSourceData = {
      color: '',
      msg: '',
      camp: '',
      messageType: '', // 消息类型
      subject: '', // 消息主体
      originalType: obj.Type, // 原始消息类型
      sName: obj.Data?.sName || '', // sName字段
      pName: obj.Data?.pName || '' // pName字段
    }
    // 新日志消息对接
    czmlEventSourceData.msg = newValue.message
    if (newValue.objectiveSide) {
      czmlEventSourceData.camp = obj.objectiveSide == 'blue' ? '2' : '1'
      czmlEventSourceData.color =
        obj.objectiveSide == 'blue' ? '#8df6f3' : '#df5a51'
    }
    if (obj.Type == 'deduce') {
      let name = ''
      let side = ''
      if (newValue.abnormalTypeCode == 'SENSOR') {
        name = newValue.platformType
        side = newValue.detectorSide
      } else {
        name = newValue.platformCName
        side = newValue.side
      }
      let curTime = store.getters.getSceneTime
      let startTime = new Date(curTime).getTime()
      let time = newValue.abnormalTimeSeconds * 1000 + startTime

      // ---- 按 schema 构建字段 ----
      const schema = getDeduceSchema(newValue.abnormalTypeCode)
      const ctx = {
        newValue,
        side,
        name,
        time,
        getTime,
        threatLevels
      }
      const fields = buildDeduceFields(schema, ctx)
      // 序列化成 JSON 供模板遍历（用 label 做 key，保持原有兼容）
      // 同时保留完整结构供渲染使用
      const temp = {
        _fields: fields // [{label, value, type, color, _fullText}, ...]
      }
      // 为向后兼容也保留一份扁平的字段（便于可能的其他消费方）
      for (const f of fields) temp[f.label] = f.value

      czmlEventSourceData.msg = JSON.stringify(temp)
      czmlEventSourceData.camp = 'environment'
      // czmlEventSourceData.color = '#f4ea2a'
    }
    // 暂停开启消息
    if (newValue.message == '场景暂停') {
      store.state.sceneModule.playState = 'pause'
    } else if (newValue.message == '场景启动') {
      store.state.sceneModule.playState = 'forward'
    }

    // 设置消息类型
    czmlEventSourceData.messageType = messageTypeMap[obj.Type] || ''

    // 解析消息主体
    // 先检查sName和pName，然后匹配到对应的主体
    if (obj.Data) {
      const sName = obj.Data.sName || ''
      const pName = obj.Data.pName || ''

      // 遍历主体列表，检查是否匹配
      for (const group of simulationGroupList) {
        for (const member of group.member_list) {
          if (
            sName.includes(member.platform_id) ||
            sName.includes(member.name_cn) ||
            sName.includes(member.name_en) ||
            pName.includes(member.platform_id) ||
            pName.includes(member.name_cn) ||
            pName.includes(member.name_en)
          ) {
            czmlEventSourceData.subject = group.model_code
            break
          }
        }
        if (czmlEventSourceData.subject) break
      }
    }

    // console.log(czmlEventSourceData,'czmlEventSourceDataczmlEventSourceDataczmlEventSourceData')
    if (czmlEventSourceData.msg) {
      // 根据阵营将消息分发到对应的列表
      state.whiteLogList.unshift(czmlEventSourceData) // 白方总是接收所有消息

      if (czmlEventSourceData.camp === '1') {
        state.redLogList.unshift(czmlEventSourceData)
      } else if (czmlEventSourceData.camp === '2') {
        state.blueLogList.unshift(czmlEventSourceData)
      } else if (czmlEventSourceData.camp === 'environment') {
        state.environmentLogList.unshift(czmlEventSourceData)
      } else {
        state.otherLogList.unshift(czmlEventSourceData)
      }

      // 如果是comment类型，添加到战场环境列表
      // if (czmlEventSourceData.messageType === 'deduce') {
      //   state.environmentLogList.unshift(czmlEventSourceData)
      // }
    }
    // 日志置顶
    const logCon = document.getElementById('log_con')
    if (logCon) {
      logCon.scrollTop = 0
    }
  },
  { deep: true }
)

const generateRandomColor = () => {
  const colorLibrary = [
    '#91FB4D', //绿
    '#EC8833', //橙
    '#E8544D', //红
    '#7BF8F4', //蓝
    '#E5D950', //黄
    '#3350F4', //深蓝
    '#4DA0EC' //浅蓝
  ]
  const randomIndex = Math.floor(Math.random() * colorLibrary.length)
  return colorLibrary[randomIndex]
}

// 缓存解析结果（按字符串内容），避免模板循环中重复 JSON.parse
const parseCache = new Map()

// 安全解析 JSON，解析失败返回空对象，避免模板渲染报错
const safeParseJson = (str) => {
  if (typeof str !== 'string') return {}
  const cached = parseCache.get(str)
  if (cached !== undefined) return cached
  let result = {}
  try {
    const parsed = JSON.parse(str)
    result = parsed && typeof parsed === 'object' ? parsed : {}
  } catch (err) {
    result = {}
  }
  parseCache.set(str, result)
  return result
}

// 将 value 转为适合 title 显示的字符串（处理对象/数组/数字/空值）
const formatValueForTitle = (value) => {
  if (value === null || value === undefined || value === '') return ''
  if (typeof value === 'object') {
    try {
      return JSON.stringify(value)
    } catch (e) {
      return String(value)
    }
  }
  return String(value)
}

const rightContentShow = () => {
  state.rightShow = !state.rightShow
}

// 清空信息
const cleanAllInfo = () => {
  state.whiteLogList = []
  state.redLogList = []
  state.blueLogList = []
  state.otherLogList = []
  state.environmentLogList = []
}
</script>

<style lang="less" scoped>
.realTimeInfo {
  position: absolute;
  bottom: 32px;
  right: 0%;
  width: 22vw;
  height: 76vh;
  .right-shrink {
    position: absolute;
    // bottom: calc(5% + 17.5vh - 44px);
    top: calc(50% - 31.5px);
    right: 0;
    transform: rotate(180deg);
    z-index: 2;
    cursor: pointer;
    width: 20px;
    font-size: 36px !important;
  }
  .log-information {
    width: 100%;
    height: 100%;

    background-image: url('~@/assets/image/panelIcons/装饰.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: flex;
    justify-content: center;
    align-items: center;

    .pie-interaction {
      position: relative;
      width: 98.8%;
      height: 97.4%;
      background: rgba(2, 26, 70, 0.88);
      box-shadow: 0 0 25px #1092d5;
      color: #fff;
      .content-img {
        position: absolute;
        //  right: 0;
        // top: -10px;
        left: -6%;
        top: calc(50% - 31.5px);
        z-index: 2;
        cursor: pointer;
        font-size: 36px !important;
        transform: rotate(180deg);
      }
      .collapse-interaction {
        width: 100%;
        height: 77%;
        overflow-y: auto;
        padding: 10px 16px;
        font-size: 14px;
        transition: all 0.3s;

        .single-log {
          display: flex;
          font-size: 15px;
          // justify-content: space-between;
          flex-wrap: nowrap;
          // align-items: center;
          align-items: stretch; //左右高度一致

          // height: 100px;//高度自适应
          .left-point {
            // height: 100%;
            display: flex;
            // align-items: center;
            margin-left: 10px;
            width: 10%;

            // flex-direction: column;
            .line {
              height: 100%;
              width: 1px;
              margin-top: 30px;
              // height: calc(100% + 20px);
              background-color: #38e1ff;
            }

            //最开始一条的特殊css
            .line-first {
              height: 0;
            }

            .point {
              width: 20px;
              height: 20px;
              position: relative;
              right: 10px;
              top: 20px;
              // transform: translate(0px, 30px);
            }
          }

          .log-side {
            height: 100%;
            width: 80%;
            padding: 10px 0;
          }

          .log-item {
            position: relative;
            padding-top: 10px;
            display: flex;
            flex-direction: column;
            font-size: 15px;
            // justify-content: space-between;
            flex-wrap: nowrap;
            // margin-bottom: 14px;
            align-items: start;
            // box-shadow: 0 0 10px 2px #29baf1;
            border: 1px solid #38e1ff;
            // background-color: #0a254f;
            text-shadow: 1px 2px 2px mediumblue;
            padding: 10px;

            background: rgba(0, 29, 66, 0.9);
            box-shadow: inset 0px 0px 10px 1px rgba(50, 194, 255, 0.38);
            border-radius: 2px;

            .log-meta {
              display: flex;
              gap: 8px;
              align-items: center;
              margin-bottom: 6px;

              .log-type {
                padding: 2px 6px;
                font-size: 10px;
                border-radius: 2px;
                background: rgba(56, 225, 255, 0.2);
                color: #63edff;
                border: 1px solid rgba(56, 225, 255, 0.3);
              }

              .time {
                font-family: MicrosoftYaHeiSemibold;
                font-size: 14px;
                color: #ffffff;
                line-height: 17px;
                text-shadow: 0 0 5px #5fcaff;
                font-weight: 600;
              }
            }

            .msg {
              font-family: PingFangSC-Regular;
              font-size: 14px;
              font-weight: 400;
              text-align: left;
              word-break: break-word;
              overflow-wrap: break-word;

              .env-msg {
                display: block;
                width: 100%;
              }

              .env-list {
                list-style: none;
                padding-left: 0;
                margin: 0;
              }

              .env-item {
                display: flex;
                align-items: flex-start;
                width: 100%;
                line-height: 1.6;
                margin-bottom: 2px;
              }

              .env-key {
                display: inline-block;
                width: 70px;
                flex: 0 0 70px;
                text-align: right;
                padding-right: 10px;
                flex-shrink: 0;
                white-space: nowrap;
              }

              .env-value {
                flex: 1;
                min-width: 0;
                text-align: left;
              }

              .env-value.truncate-value {
                overflow: auto;
              }
            }

            .point {
              width: 10px;
              margin-right: 8px;
            }

            .text-content {
              // margin-left: 10px;
              // text-wrap:nowrap;
              span {
                // text-wrap:nowrap;
                flex-shrink: 0;
              }
            }

            .log-triangle {
              position: absolute;
              right: 0;
              bottom: 0;
              opacity: 0.6;
              border-width: 0 12px 12px 0;
              border-style: solid;
              border-color: transparent #00fde6;
              transform: rotate(90deg);
            }
          }
        }

        // .log-item::after {
        //   content: '';
        //   display: block;
        //   /* width: 8px; */
        //   // border-top: 10px solid transparent;
        //   border-right: 7px solid #0173dd;
        //   // border-bottom: 10px solid transparent;
        //   /* border-right: 10px solid red; */
        //   height: 100%;
        //   width: 2px;
        //   position: absolute;
        //   right: 0px;
        //   top: 67%;
        // }

        :deep(.el-collapse) {
          --el-collapse-border-color: transparent;
          --el-collapse-header-height: 40px;
          --el-collapse-header-bg-color: var(--el-color-white);
          --el-collapse-header-text-color: var(--el-text-color-primary);
          --el-collapse-header-font-size: 14px;
          --el-collapse-content-bg-color: transparent !important;
          --el-collapse-content-font-size: 14px;
          --el-collapse-content-text-color: var(--el-text-color-primary);
          border-top: 1px solid transparent;
          border-bottom: 1px solid transparent;
        }

        .collapse-title {
          flex: 1 0 90%;
          order: 1;
        }

        :deep(.el-collapse-item__header) {
          padding-left: 10px;
          box-sizing: border-box;
          background: transparent;
          border: 1px solid rgba(99, 237, 255, 0.1);
          color: #98dcff;
        }

        :deep(.el-icon svg) {
          color: #63edff;
        }

        .detail-style {
          width: 100%;
          color: #98dcff;
          padding: 10px 10px 10px 20px;
          box-sizing: border-box;
        }

        :deep(.el-collapse-item__content) {
          padding: 0 !important;
        }
      }

      .collapse-interaction::-webkit-scrollbar {
        display: none;
      }

      .formulate-title {
        display: flex;
        align-items: center;
        padding: 10px 0 10px 30px;
        box-sizing: border-box;
        text-align: left;
        // font-size: 18px;
        font-family: MFLiHei_Noncommercial-Regular;
        font-size: 20px;
        color: #ffffff;
        letter-spacing: 1.82px;
        font-weight: 400;

        .img {
          margin-right: 5px;
        }

        .pointer-title {
          cursor: pointer;
        }

        .cleanInfo {
          color: #00ffff;
          font-size: 10px;
          font-family: PingFangSC-Semibold;
        }

        .cleanInfo:hover {
          cursor: pointer;
          font-weight: 600px;
        }
        .close_sty {
          cursor: pointer;
          position: absolute;
          top: 6px;
          right: -35px;
          width: 18px;
          height: 18px;
          z-index: 1;
        }
      }

      /* Tab页样式 */
      .tab-container {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        align-items: center;
        gap: 8px;
        padding: 8px 10px;
        background: rgba(0, 50, 100, 0.5);
        border-bottom: 1px solid rgba(56, 225, 255, 0.3);

        .tab-item {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 16px;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.3s ease;
          font-size: clamp(10px, 1.5vw, 13px);
          color: #98dcff;
          flex: 0 1 auto;
          min-width: 0;

          &:hover {
            background: rgba(56, 225, 255, 0.1);
          }

          &.active {
            background: rgba(56, 225, 255, 0.2);
            border: 1px solid rgba(56, 225, 255, 0.5);
            color: #ffffff;
          }

          .tab-point {
            width: clamp(10px, 1.5vw, 12px);
            height: clamp(10px, 1.5vw, 12px);
            flex-shrink: 0;
          }

          .tab-count {
            min-width: clamp(14px, 1.8vw, 18px);
            height: clamp(14px, 1.8vw, 18px);
            line-height: clamp(14px, 1.8vw, 18px);
            text-align: center;
            border-radius: 50%;
            background: rgba(56, 225, 255, 0.3);
            font-size: clamp(9px, 1.2vw, 11px);
            color: #ffffff;
            flex-shrink: 0;
          }
        }
      }

      /* 筛选容器样式 */
      .filter-container {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        gap: 12px;
        padding: 10px;
        background: rgba(0, 30, 60, 0.6);
        border-bottom: 1px solid rgba(56, 225, 255, 0.2);

        .filter-group {
          display: flex;
          flex-direction: row;
          align-items: center;
          gap: 6px;
          flex: 1 1 120px;
          min-width: 0;

          .filter-label {
            font-size: clamp(10px, 1.2vw, 12px);
            color: #63edff;
            font-weight: 500;
            white-space: nowrap;
            flex-shrink: 0;
          }

          .filter-select {
            flex: 1 1 auto;
            min-width: 0;
            padding: 4px 8px;
            font-size: clamp(10px, 1.2vw, 12px);
            color: #98dcff;
            background: rgba(0, 50, 100, 0.6);
            border: 1px solid rgba(56, 225, 255, 0.3);
            border-radius: 4px;
            cursor: pointer;
            transition: all 0.2s ease;
            outline: none;

            &:hover {
              border-color: rgba(56, 225, 255, 0.6);
            }

            &:focus {
              border-color: rgba(56, 225, 255, 0.8);
              box-shadow: 0 0 5px rgba(56, 225, 255, 0.3);
            }

            option {
              background: rgba(0, 30, 60, 0.95);
              color: #98dcff;
              padding: 4px 8px;
              font-size: clamp(10px, 1.2vw, 12px);
            }
          }
        }
      }

      /* 空数据提示样式 */
      .empty-tip {
        text-align: center;
        padding: 40px 0;
        color: rgba(152, 220, 255, 0.5);
        font-size: 14px;
      }
    }
  }
}
</style>
