<template>
  <div class="troops_config">
    <div class="troops_content">
      <!-- <el-scrollbar height="100%"> -->
      <el-form :model="vueData.troopsForm" label-width="100px">
        <el-form-item label="导调对象:">
          <el-select v-model="vueData.troopsForm.type" placeholder="">
            <el-option
              v-for="item in vueData.typeOption"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="导调类型:">
          <el-select
            v-model="vueData.troopsForm2.type"
            placeholder=""
            @change="setCommand"
          >
            <el-option
              v-for="item in vueData.typeOption2"
              :key="item"
              :label="item.recordTypeName"
              :value="item.recordType"
            />
          </el-select>
        </el-form-item>
        <el-form-item
          label="经度:"
          v-if="vueData.troopsForm2.type == 'position'"
        >
          <el-input v-model="vueData.troopsForm.lon" disabled></el-input>
        </el-form-item>
        <el-form-item
          label="纬度:"
          v-if="vueData.troopsForm2.type == 'position'"
        >
          <el-input v-model="vueData.troopsForm.lat" disabled></el-input>
        </el-form-item>
        <el-form-item
          label="高度:"
          v-if="vueData.troopsForm2.type == 'position'"
        >
          <el-input v-model="vueData.troopsForm.height" disabled></el-input>
        </el-form-item>
        <el-form-item label="计划名称:">
          <el-input v-model="vueData.troopsForm.planName"></el-input>
        </el-form-item>
      </el-form>
      <div class="createBL_config" v-if="vueData.troopsForm.type == '创建兵力'">
        <el-form :model="vueData.formData" label-width="100px">
          <el-form-item label="属方:">
            <el-select
              v-model="vueData.formData.side"
              class="scene_input"
              placeholder="请选择"
              clearable
            >
              <el-option
                v-for="item in vueData.sideList"
                :key="item.value"
                :label="item.name"
                :value="item.value"
              />
            </el-select>
          </el-form-item>
          <el-form-item label="名称:">
            <el-input v-model="vueData.formData.name"></el-input>
          </el-form-item>
          <el-form-item label="类型:">
            <el-input v-model="vueData.formData.type"></el-input>
          </el-form-item>
          <el-form-item label="经度:">
            <el-input v-model="vueData.formData.lon"></el-input>
          </el-form-item>
          <el-form-item label="纬度:">
            <el-input v-model="vueData.formData.lat"></el-input>
          </el-form-item>
          <el-form-item label="高度:">
            <el-input v-model="vueData.formData.alt"></el-input>
          </el-form-item>
          <el-form-item label="航向角:">
            <el-input v-model="vueData.formData.heading"></el-input>
          </el-form-item>
          <el-form-item label="速度:">
            <el-input v-model="vueData.formData.speed"></el-input>
          </el-form-item>
        </el-form>
      </div>
      <div class="deleteBL_config" v-if="vueData.troopsForm.type == '删除兵力'">
        <el-scrollbar>
          <div
            class="LLBC-box"
            v-for="(item, index) in vueData.llbc"
            :key="index"
            :class="LLBC_color[item.name].color"
          >
            <div class="LLBC-item">
              <div style="height: 30px">
                <img :src="LLBC_color[item.name].flag" />
                <span style="font-size: 15px">{{ item.name }}</span>
              </div>
            </div>
            <el-tree
              :data="item.children"
              :props="vueData.defaultProps"
              :expand-on-click-node="false"
              show-checkbox
              :check-strictly="true"
              @check-change="handleCheckChange"
              default-expand-all
            >
              <template #default="{ node, data }">
                <div class="node-box">
                  <span class="node-label">{{ data.name }}</span>
                </div>
              </template>
            </el-tree>
          </div>
        </el-scrollbar>
      </div>
      <div class="time-box">
        <el-checkbox v-model="vueData.checked" label="执行时间" />
        <el-date-picker
          v-if="vueData.checked"
          v-model="vueData.time"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="选择执行时间"
          :disabledDate="disabledDateFn"
          :disabled-hours="disabledHours"
          :disabled-minutes="disabledMinutes"
          :disabled-seconds="disabledSeconds"
          :popper-append-to-body="false"
          placement="bottom-start"
          id="table-time-ym"
        />
      </div>
      <!-- </el-scrollbar> -->
    </div>
    <div class="troops_footer">
      <!-- <el-button
        type="primary"
        :disabled="vueData.checked"
        @click="save('立即执行')"
        >立即执行</el-button
      > -->
      <el-button
        type="primary"
        @click="save('保存')"
        :disabled="!vueData.checked"
        >保存</el-button
      >
      <el-button @click="closePanel" class="concelBtn">取消</el-button>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted, watch } from 'vue'
import emitter from '@/utils/eventbus'
import store from '@/store/index'
import { createItem, removeEntity } from '@/service/directingAdjusting'
import { getLeftForceResult } from '@/service/SSE.js'
import { LLBC_color, showList } from '@/utils/LLBC_Utils.js' //LLBC配置
import {
  getEnumList,
  addList,
  getAllPlatWithCondition
} from '@/service/directingAdjusting'
import { moveToPositionChange } from '@/views/toolbar/layerList/hooks/guideCommand'

const vueData = reactive({
  command: ['改变位置', '改变高度'],
  troopsForm: {
    type: '导调对象',
    planName: ''
  },
  typeOption: ['wz_7-1'],
  troopsForm2: {
    type: '导调类型'
  },
  // typeOption2: ['改变高度', '改变速度', '关闭传感器'],
  typeOption2: [
    {
      recordType: 'changeLocation',
      recordTypeName: '改变位置'
    }
  ],
  checked: false,
  time: '',
  sideList: [
    { name: '红方', value: 'red' },
    { name: '蓝方', value: 'blue' }
  ],
  formData: {
    side: '',
    name: '',
    type: '',
    lon: '121.412322',
    lat: '23.978216',
    alt: '3920.153176',
    heading: '',
    speed: '0.5'
  },
  llbc: [
    {
      name: '红方',
      side: 'red',
      children: [
        {
          name: '红方力量',
          children: []
        }
      ]
    },
    {
      name: '蓝方',
      side: 'blue',
      children: [
        {
          name: '蓝方力量',
          children: []
        }
      ]
    }
  ],
  defaultProps: {
    children: 'children',
    label: 'name'
  },
  selectItem: {
    entityID: '',
    itemName: ''
  },
  objectList: {}
})

// 时间选择器范围设置
const disabledDateFn = (time) => {
  //比当前时间小的时间禁用（返回false则禁用）
  return (
    time.getTime() <
    new Date(store.state.sceneModule.msgMessionTime) - 24 * 3600 * 1000
  )
}

const disabledHours = () => {
  const a = []
  for (let i = 0; i < 24; i++) {
    // 限制 之前 < / 之后 >
    if (new Date(store.state.sceneModule.msgMessionTime).getHours() <= i)
      continue
    a.push(i)
  }
  return a
}
const disabledMinutes = (hour) => {
  // 选择时大于当前时，所有分均可选择
  if (hour > new Date(store.state.sceneModule.msgMessionTime).getHours()) {
    return []
  }
  const a = []
  for (let i = 0; i < 60; i++) {
    // 限制 之前 < / 之后 >
    if (new Date(store.state.sceneModule.msgMessionTime).getMinutes() <= i)
      continue
    a.push(i)
  }
  return a
}
const disabledSeconds = (hour, mins) => {
  // 选择时分大于当前时分时，所有秒均可选择
  if (hour > new Date(store.state.sceneModule.msgMessionTime).getHours()) {
    return []
  } else if (
    hour == new Date(store.state.sceneModule.msgMessionTime).getHours() &&
    mins > new Date(store.state.sceneModule.msgMessionTime).getMinutes()
  ) {
    return []
  }

  const a = []
  for (let i = 0; i < 60; i++) {
    // 限制 之前 < / 之后 >
    if (new Date(store.state.sceneModule.msgMessionTime).getSeconds() <= i)
      continue
    a.push(i)
  }
  return a
}

// 设置命令
const setCommand = () => {
  // console.log(vueData.troopsForm.type)
  store.commit('setCurrentNode', {
    code: vueData.troopsForm.type,
    side: '',
    type: ''
  })
  emitter.emit('moveToPositionChange1', true)
  emitter.on('showCommandControl', (val) => {
    vueData.troopsForm.lon = val.commandFormData.longitude
    vueData.troopsForm.lat = val.commandFormData.latitude
    vueData.troopsForm.height = val.commandFormData.height
  })
}

// 保存
const save = (val) => {
  store.commit('setUpdatePlan', false)
  let runSeconds
  let time
  if (val == '立即执行') {
    runSeconds = 0
    if (store.state.sceneModule.msgMessionTime) {
      time = new Date(store.state.sceneModule.msgMessionTime).toISOString()
    } else {
      time = 0
    }
    createConductPlan(runSeconds, time)
  } else if (val == '保存') {
    if (vueData.time == '') {
      ElMessage.warning('请选择执行时间！')
      return
    } else {
      // 创建指定日期的Date对象
      // const date = new Date(2027, 8, 12, 10, 0, 0)
      const date = new Date(store.state.sceneModule.startDate)
      // 注意：月份是从0开始计数的，所以9月对应8

      // 获取Unix时间戳（毫秒数）并转换为秒数
      const timestamp = Math.floor(date.getTime() / 1000)
      let runTime = new Date(vueData.time).getTime() / 1000
      // let startTime =  new Date(store.getters.getSceneStartTime).getTime()
      if (runTime && timestamp) {
        runSeconds = Math.floor(runTime - timestamp)
      }
      // console.log(runSeconds)
      time = new Date(vueData.time).toISOString()
    }
    console.log('time', time, runSeconds)
    createConductPlan(runSeconds, time)
    emitter.emit('closeCreatePlan', false)
  }

  if (vueData.troopsForm.type == '创建兵力') {
    create_item(val)
  } else if (vueData.troopsForm.type == '删除兵力') {
    delete_item(val)
  }
}

// 新增导调计划
const createConductPlan = (val1, val2) => {
  let camp
  for (const key in vueData.objectList) {
    if (vueData.objectList.hasOwnProperty(key)) {
      const innerObj = vueData.objectList[key]
      camp = innerObj.camp
    }
  }
  let params = {
    camp: camp,
    object: {
      entityID: vueData.troopsForm.type,
      height: vueData.troopsForm.height,
      itemName: '',
      itemTypeCode: 'aircraft',
      lat: vueData.troopsForm.lat,
      lng: vueData.troopsForm.lon,
      planName: '',
      runSeconds: val1
    },
    operationType: '',
    planName: vueData.troopsForm.planName,
    recordType: vueData.troopsForm2.type,
    time: val1,
    planTime: val2
  }
  addList(params).then((res) => {
    if (res.code == 200) {
      ElMessage.success(res.data)
      store.commit('setPlanObject', params)
      // 刷新列表
      // 新增store变量，监听状态，刷新导调列表
      store.commit('setUpdatePlan', true)
    }
  })
}

// 导调创建item
const create_item = (val) => {
  debugger
  let params = {
    planName: vueData.troopsForm.planName,
    side: vueData.formData.side,
    name: vueData.formData.name,
    type: vueData.formData.type,
    lat: vueData.formData.lat,
    lon: vueData.formData.lon,
    alt: vueData.formData.alt,
    heading: Number(vueData.formData.heading),
    speed: Number(vueData.formData.speed)
  }
  if (val == '立即执行') {
    params.runSeconds = null
  } else if (val == '保存') {
    if (vueData.time == '') {
      ElMessage.warning('请选择执行时间！')
      return
    } else {
      let runTime = new Date(vueData.time).getTime()
      let msgMessionTime = new Date(
        store.state.sceneModule.msgMessionTime
      ).getTime()
      if (runTime && msgMessionTime) {
        params.runSeconds = Math.floor((msgMessionTime - runTime) / 1000)
      }
      console.log('当前要保存的导条对象信息', params)
    }
  }
  createItem(params).then((res) => {
    if (res.code == 200) {
      ElMessage.success(res.data)
    } else {
      ElMessage.warning(res.data) || ElMessage.warning('网络错误，请稍后再试！')
    }
  })
}
// 导调删除item
const delete_item = (val) => {
  let params = vueData.selectItem
  params.planName = vueData.troopsForm.planName
  if (val == '立即执行') {
    params.runSeconds = null
  } else if (val == '保存') {
    if (vueData.time == '') {
      ElMessage.warning('请选择执行时间！')
      return
    } else {
      let runTime = new Date(vueData.time).getTime()
      let msgMessionTime = new Date(
        store.state.sceneModule.msgMessionTime
      ).getTime()
      if (runTime && msgMessionTime) {
        params.runSeconds = Math.floor((msgMessionTime - runTime) / 1000)
      }
      emitter.emit('closeCreatePlan', false)
    }
  }
  removeEntity(params).then((res) => {
    if (res.code == 200) {
      ElMessage.success(res.data)
      emitter.emit('closeCreatePlan', false)
    } else {
      ElMessage.warning(res.data) || ElMessage.warning('网络错误，请稍后再试！')
    }
  })
}
const handleCheckChange = (data, checked, indeterminate) => {
  if (checked) {
    vueData.selectItem.entityID = data.targetName
    vueData.selectItem.itemName = data.name
  }
}
// 关闭
const closePanel = () => {
  emitter.emit('closeCreatePlan', false)
}

// 获取导调类型
const getType = () => {
  getEnumList().then((res) => {
    if (res.code == 200) {
      vueData.typeOption2 = res.data
    } else {
      ElMessage.error('获取导调类型失败！')
    }
  })
}

// 获取导调对象
const getObjectList = () => {
  let params = {
    camp: '',
    domain: '空',
    group: '',
    kinds: '',
    name: '',
    temp: '',
    type: ''
  }
  getAllPlatWithCondition(params).then((res) => {
    if (res.code == 200) {
      // for (let i = 0; i < res.data.length; i++){
      vueData.typeOption = Object.keys(res.data)
      // }
      vueData.objectList = res.data
    }
  })
}

onMounted(() => {
  //获取兵力的数据
  getLeftForceResult().then((res) => {
    let redValue = res.red.sideTypeJson
    let blueValue = res.blue.sideTypeJson
    vueData.llbc[0].children[0].children = redValue.children
    vueData.llbc[1].children[0].children = blueValue.children
  })
  getObjectList()
  getType()
})
</script>
<style lang="less" scoped>
.troops_config {
  padding: 10px 20px 0 0;
  .troops_content {
    height: 136px;
    .time-box {
      display: flex;
      flex-direction: column;
      padding-left: 20%;
      :deep(.el-checkbox) {
        color: #fff !important;
      }
    }
    .deleteBL_config {
      padding-left: 100px;
      .LLBC-box {
        padding: 10px;
        box-sizing: content-box;
        margin-bottom: 15px;
        width: 35vh;

        .LLBC-item {
          text-align: left;
          font-family: 'Arial Normal', 'Arial';
          font-weight: 400;
          font-style: normal;
          color: #ffffff;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .utilsBTN_box {
            img {
              width: 26px;
            }
          }
          span {
            padding: 0 5px;
          }
        }

        :deep(.el-tree) {
          background: transparent;
          font-family: 'Arial Normal', 'Arial';
          font-weight: 700;
          font-style: normal;
          font-size: 13px;
          letter-spacing: normal;
          color: #ffffff;
        }
      }
      .LLBC-red {
        background-color: rgba(65, 27, 42, 1);
        border: 1px solid rgba(200, 8, 13, 1);
        :deep(.el-tree) {
          .el-tree-node__content:hover {
            background-color: rgba(161, 45, 45, 0.2);
          }

          .el-tree-node:focus > .el-tree-node__content {
            background-color: rgba(200, 8, 13, 0.8);
          }
        }
      }

      .LLBC-blue {
        background-color: rgba(16, 55, 91, 1);
        border: 1px solid rgba(9, 110, 180, 1);
        :deep(.el-tree) {
          .el-tree-node__content:hover {
            background-color: rgba(8, 165, 239, 0.2);
          }

          .el-tree-node:focus > .el-tree-node__content {
            background-color: rgba(9, 110, 180, 1);
          }
        }
      }

      .LLBC-green {
        background-color: rgb(0, 63, 5);
        border: 1px solid rgb(9, 180, 9);
        :deep(.el-tree) {
          .el-tree-node__content:hover {
            background-color: rgba(62, 239, 8, 0.2);
          }

          .el-tree-node:focus > .el-tree-node__content {
            background-color: rgb(23, 180, 9);
          }
        }
      }
    }
  }
  :deep(.el-form-item__label) {
    color: #fff !important;
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
  :deep(.el-select__placeholder) {
    color: #fff;
  }
  .troops_footer {
    padding: 20px 0 20px;
    display: flex;
    justify-content: flex-end;
    .el-button {
      background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
      width: 80px;
      height: 30px;
      color: #ffff;
      border-radius: 5px;
      margin-left: 10px;
      margin-bottom: 25px;
      margin-top: 176px;
      cursor: pointer;
    }
    .el-button:disabled {
      color: #cccccc;
      border: none;
      cursor: auto;
    }
    .concelBtn {
      background: #fff !important;
      color: black;
    }
  }
}
</style>
<style>
table:not([cellpadding]) td,
table:not([cellpadding]) th {
  padding: 0;
}
</style>
