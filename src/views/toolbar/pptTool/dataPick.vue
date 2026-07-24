<template>
  <div class="ue_dataPick" v-show="pickPanelTag">
    <div class="top-header">
      <span class="top-time">{{
        currentTime.year + '-' + currentTime.month + '-' + currentTime.day
      }}</span>
      <el-icon @click="dataPickClose" class="icon-close">
        <CaretBottom />
      </el-icon>
    </div>
    <div class="date-box">
      <el-scrollbar
        height="150px"
        @scroll="scroll($event, 'year')"
        ref="pickerRefyear"
        class="pickerscr"
      >
        <p
          @click="selectTime({ item, index }, 'year')"
          :class="{ 'time-box': true, 'is-active': item == currentTime.year }"
          v-for="(item, index) in dateTime.year"
          :key="index"
        >
          {{ item }}
        </p>
      </el-scrollbar>
      <el-scrollbar
        height="150px"
        @scroll="scroll($event, 'month')"
        ref="pickerRefmonth"
        class="pickerscr"
      >
        <p
          @click="selectTime({ item, index }, 'month')"
          :class="{ 'time-box': true, 'is-active': item == currentTime.month }"
          v-for="(item, index) in dateTime.month"
          :key="index"
        >
          {{ item }}
        </p>
      </el-scrollbar>
      <el-scrollbar
        height="150px"
        @scroll="scroll($event, 'day')"
        ref="pickerRefday"
        class="pickerscr"
      >
        <p
          @click="selectTime({ item, index }, 'day')"
          :class="{ 'time-box': true, 'is-active': item == currentTime.day }"
          v-for="(item, index) in dateTime.day"
          :key="index"
        >
          {{ item }}
        </p>
      </el-scrollbar>
    </div>
    <el-button class="dataPick-btn" @click="determine">确定</el-button>
  </div>
</template>

<script setup>
import {
  onMounted,
  onUnmounted,
  toRefs,
  ref,
  computed,
  watch,
  reactive
} from 'vue'
import emitter from '@/utils/eventbus'
const emits = defineEmits(['dataPickTime'])
const dateTime = reactive({
  year: [],
  month: [],
  day: []
})
const currentTime = ref({
  year: '2023',
  yearindex: 0,
  yearscrollTop: 0,
  month: '01',
  monthindex: 0,
  monthscrollTop: 0,
  day: '01',
  dayindex: 0,
  dayscrollTop: 0
})
const timelineRef = ref(null)
const pickerRefyear = ref()
const pickerRefmonth = ref()
const pickerRefday = ref()
let pickPanelTag = ref(false)
let flag = false

const getYearsMonths = () => {
  // 获取月份
  let months = []
  for (let i = 1; i <= 12; i++) {
    months.push((i + '').padStart(2, 0))
  }
  dateTime.month = months
  // 获取当年前后五年年份
  let date = new Date()
  let startYear = date.getFullYear() - 5 //起始年份
  let endYear = date.getFullYear() + 5 //结束年份
  let yearList = []
  for (var i = startYear; i <= endYear; i++) {
    yearList.push(i)
  }
  dateTime.year = yearList
}
// 获取当月所有天数
const getMonthAllDays = () => {
  let day = new Date(
    parseInt(currentTime.value.year),
    parseInt(currentTime.value.month),
    0
  ).getDate()
  let days = []
  for (let i = 1; i <= day; i++) {
    days.push((i + '').padStart(2, 0))
  }
  dateTime.day = days
}
// 设置选中数据距顶高度
const setScrollTop = (type, index) => {
  index = parseInt(index)
  currentTime.value[type + 'index'] = index
  switch (type) {
    case 'year':
      pickerRefyear.value.setScrollTop(index * 30)
      break
    case 'month':
      pickerRefmonth.value.setScrollTop(index * 30)
      break
    case 'day':
      pickerRefday.value.setScrollTop(index * 30)
      break
  }
  // 跳转后将设置的scrollTop 赋值存储
  currentTime.value[type + 'scrollTop'] = index * 30
}
// 滚动事件
const scroll = (e, type) => {
  setScrollTop(type, currentTime.value[type + 'index'])
  if (flag) return
  const scroll = e.scrollTop
  let index = Math.round(scroll / 30)

  if (
    currentTime.value[type + 'scrollTop'] ||
    currentTime.value[type + 'scrollTop'] == 0
  ) {
    if (currentTime.value[type + 'scrollTop'] < scroll) {
      // 向下滚动
      index = parseInt(currentTime.value[type + 'index']) + 1
    } else if (currentTime.value[type + 'scrollTop'] > scroll) {
      // 向上滚动
      index = parseInt(currentTime.value[type + 'index']) - 1
    } else {
      // 数据相等不做操做
    }
  } else {
    // 存储的scrollTop无值时直接赋值
    currentTime.value[type + 'scrollTop'] = scroll
  }
  if (index <= 0) {
    index = 0
  } else if (index >= dateTime[type].length - 1) {
    index = dateTime[type].length - 1
  }
  currentTime.value[type] = dateTime[type][index]
  setScrollTop(type, index)
  flag = true
  setTimeout(() => {
    flag = false
  }, 100)
}
// 鼠标选中时间
const selectTime = (data, type) => {
  let { item, index } = data
  currentTime.value[type] = item
  setScrollTop(type, index)
}

const determine = () => {
  emits('dataPickTime', JSON.parse(JSON.stringify(currentTime.value)))
  pickPanelTag.value = false
}
const dataPickClose = () => {
  pickPanelTag.value = false
}
onMounted(() => {
  getYearsMonths()
  getMonthAllDays()
})

onUnmounted(() => {})

watch(
  () => JSON.parse(JSON.stringify(currentTime.value)),
  (val, old) => {
    if (val.day == old.day) {
      getMonthAllDays()
    }
  },
  { deep: true }
)

defineExpose({
  // pause
  openPickPanel(e) {
    currentTime.value = JSON.parse(JSON.stringify(e))
    pickPanelTag.value = true
    setTimeout(() => {
      for (let type in e) {
        let index = dateTime[type].findIndex((v) => v == e[type])
        setScrollTop(type, index)
      }
    }, 0)
  }
})
</script>

<style lang="less" scoped>
.ue_dataPick {
  pointer-events: auto;
  position: fixed;
  top: 52px;
  //left: 20px;
  box-sizing: border-box;
  width: 200px;
  height: 229px;
  padding: 10px;
  border: 1px solid rgba(255, 255, 255, 0.5);
  background: rgba(0, 0, 0, 0.52);
  border-radius: 12px;
  user-select: none;
  color: #fff;
  .top-header {
    border-bottom: 1px solid #fff;
    padding: 0 15px 10px;
    display: flex;
    justify-content: space-between;
  }
  .icon-close {
    cursor: pointer;
  }
  .date-box {
    display: flex;
    justify-content: space-around;
    .el-scrollbar {
      margin-left: 2px;
      width: 65px;
      // padding: 60px 0;
    }
    .time-box {
      height: 30px;
      line-height: 30px;
      margin: 0;
      padding: 0;
      font-size: 14px;
      color: #c9c9c9;
      letter-spacing: 0;
      font-weight: 400;
      cursor: pointer;
      &.is-active {
        color: #84ffe0;
        background-image: url('@/assets/image/ueDataPickImg/选择日期背景.png');
        background-repeat: no-repeat;
        background-size: 100% 100%;
      }
    }
    /deep/ .pickerscr .el-scrollbar__view {
      &::before {
        display: inline-block;
        content: '';
        height: 60px;
        width: 100%;
      }
      &::after {
        display: inline-block;
        content: '';
        height: 60px;
        width: 100%;
      }
    }
  }
  .dataPick-btn {
    width: 100%;
    height: 23px;
    font-size: 14px;
    font-weight: 400;
    color: #fff;
    border: none;
    background-image: linear-gradient(180deg, #87cbd1 0%, #4f8fa5 100%);
  }
}
</style>
