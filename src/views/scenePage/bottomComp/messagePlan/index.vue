<template>
  <div class="message_plan">
    <div class="title">
      <span>计划导调</span>
      <div class="operation">
        <!-- <el-button type="primary" size="small" @click="execute">
          执行
        </el-button> -->
        <el-button type="primary" size="small" @click="addNewPlan">
          新增
        </el-button>
        <el-button type="primary" size="small" @click="editControlPlan">
          修改
        </el-button>
        <el-button
          type="danger"
          size="small"
          @click="deletePlan"
          class="delBtn"
        >
          删除
        </el-button>
      </div>
    </div>
    <div class="message_plan_table">
      <el-table
        :data="state.messagePlanTable"
        style="width: 100%"
        show-overflow-tooltip
        :header-cell-style="{ color: ' #FFFFFF' }"
        max-height="230px"
        min-height="80px"
        @selection-change="handleSelectionChange"
      >
        <el-table-column type="selection" align="center" />
        <el-table-column
          prop="object.entityID"
          label="导调对象"
          align="center"
        />
        <!-- 导调时间对应场景时间 -->
        <el-table-column prop="planName" label="导调计划" align="center" />
        <!-- 创建时间对应天文时间 -->
        <el-table-column prop="planTime" label="执行时间" align="center" />
      </el-table>
    </div>
  </div>
  <createPlan
    v-if="state.showCreatePlan"
    @sendCloseCreate="sendCloseCreate"
  ></createPlan>
  <planInfo
    v-if="state.showPlanInfo"
    @sendClosePlanInfo="sendClosePlanInfo"
    :currentRow="state.currentRow"
  ></planInfo>
  <editPlan
    v-if="state.currentType && state.typeList.indexOf(state.currentType) != -1"
    :currentRow="state.currentRow"
    @sendCloseEdit="sendCloseEdit"
  ></editPlan>
  <editNewPlan
    v-if="state.showEidtPlan"
    :currentRow="state.currentRow"
    @sendCloseEdit="sendCloseEdit"
  ></editNewPlan>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'
import createPlan from '@/views/scenePage/bottomComp/messagePlan/createPlan'
import planInfo from '@/views/scenePage/bottomComp/messagePlan/planInfo'
import editPlan from '@/views/scenePage/bottomComp/messagePlan/editPlan/index.vue'
import editNewPlan from '@/views/scenePage/bottomComp/messagePlan/editNewPlan/index.vue'
import store from '@/store'
import emitter from '@/utils/eventbus'
import { setPlateformStatus, setPlatformAttack } from '@/service/afsim/index'
import {
  getGuideList,
  executes,
  deletes,
  getGuideQueue,
  deleteListById
} from '@/service/directingAdjusting'
const state = reactive({
  messagePlanTable: [
    // {
    //   entityID: 'j—16d_1',
    //   type: '添加实体',
    //   planName: '干扰任务',
    //   message: '导演部席位',
    //   time: '2024/03/11 15:10'
    // },
    {
      entityID: 'j—16d_2',
      type: '添加实体',
      planName: '干扰任务',
      message: '导演部席位',
      planTime: '2024/03/11 15:10',
      object: {}
    },
    {
      entityID: 'wz-7_1',
      type: '添加实体',
      planName: '变更传感器开关',
      message: '导演部席位',
      planTime: '2024/03/13 09:10',
      object: {}
    },
    {
      entityID: 'gj-11_1',
      type: '添加实体',
      planName: '打击任务',
      message: '导演部席位',
      planTime: '2024/03/16 14:10',
      object: {}
    }
  ],
  showCreatePlan: false, // 新增计划框显隐
  showEidtPlan: false, //修改计划框显隐
  selectedIds: [], // 选中的id组
  selectedId: '', // 选中的id组
  currentRow: {}, // 当前行
  showPlanInfo: false, // 查看计划详情框显隐
  currentType: '',
  typeList: [
    'changeWeatherAfsimPlan',
    'changeElectromagnetismAfsimPlan',
    'changeOceanAfsimPlan',
    'createEntity',
    'removeEntity',
    'wenDian'
  ]
})
// 修改计划
const editControlPlan = () => {
  if (state.selectedIds.length == 0) {
    ElMessage.warning('请选择数据！')
    return
  }
  let params = {
    id: state.selectedId
  }
  state.showEidtPlan = true
  getGuideQueue(params).then((res) => {
    if (res.code == 200) {
      state.currentRow = res.data
    } else {
      ElMessage.error('获取失败！')
    }
  })
}

// 新增计划
const addNewPlan = () => {
  state.showCreatePlan = true
}
// 批量立即执行导调计划
const execute = () => {
  if (state.selectedIds.length == 0) {
    ElMessage.warning('请选择数据！')
    return
  }
  ElMessageBox.confirm('确定执行选中的数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      let params = {
        idList: state.selectedIds
      }
      executes(params).then((res) => {
        if (res.code == 200) {
          ElMessage.success(res.data)
          getList()
        } else {
          ElMessage.warning(res.data) ||
            ElMessage.warning('网络错误，请稍后再试！')
        }
      })
    })
    .catch(() => {
      ElMessage.info('取消执行')
    })
}
// 关闭编辑
const sendCloseEdit = () => {
  state.showEidtPlan = false
  getList()
}
// 点击编辑按钮
const editRow = (row) => {
  state.currentRow = row
  state.currentType = row.typeCode
}
// 删除导调计划
const deletePlan = () => {
  if (state.selectedIds.length == 0) {
    ElMessage.warning('请选择数据！')
    return
  }
  ElMessageBox.confirm('确定删除选中的数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      let params = {
        id: state.selectedId
      }
      deleteListById(params).then((res) => {
        if (res.code == 200) {
          ElMessage.success(res.data)
          getList()
        } else {
          ElMessage.warning(res.data) ||
            ElMessage.warning('网络错误，请稍后再试！')
        }
      })
    })
    .catch(() => {
      ElMessage.info('取消删除')
    })
}

const sendCloseCreate = (val) => {
  state.showCreatePlan = val
}
// 查看详情
const showDetails = (row) => {
  state.currentRow = row
  state.showPlanInfo = true
}
// 表格选中
const handleSelectionChange = (selectRow) => {
  state.selectedIds = []
  selectRow.forEach((item) => {
    state.selectedIds.push(item.id)
    state.selectedId = item.id
  })
}
// 关闭新增计划弹框 刷新
emitter.on('closeCreatePlan', (val) => {
  state.showCreatePlan = val
  getList()
})
emitter.on('closeEditPlan', (val) => {
  console.log(val)
  state.showEidtPlan = val
  getList()
})
emitter.on('timeDT', (val) => {
  toPositionFun(val)
})
// 关闭查看计划详情
const sendClosePlanInfo = (val) => {
  state.showPlanInfo = val
}
const getList = () => {
  // let params = {
  //   pageNum: 1,
  //   pageSize: 20
  // }
  // getGuideList(params).then((res) => {
  //   if (res.code == 200) {
  //     state.messagePlanTable = res.data.records
  //   } else {
  //     // ElMessage.error(res.message || '网络错误！')
  //   }
  // })
  let params = {
    id: ''
  }
  getGuideQueue(params).then((res) => {
    if (res.code == 200) {
      state.messagePlanTable = res.data
      store.state.AFSIMModule.dtList = res.data
      console.log(
        'store.state.AFSIMModule.dtList',
        store.state.AFSIMModule.dtList
      )
      console.log(res.data)
    } else {
      ElMessage.error('获取失败！')
    }
  })
}

const toPositionFun = (val) => {
  let params = {
    platform: val.entityID,
    setPosition: `{"lon":"${val.lng}","lat":"${val.lat}","alt":"${val.height}"}`
  }
  setPlateformStatus(params).then((res) => {
    const parsedData = JSON.parse(res.data)
    if (parsedData.status == 'success') {
      window.EarthViewer._container.style.cursor = 'default'
      beautyToast.success({
        title: '导调指令',
        message: '移动平台到指定位置指令已发出!',
        darkTheme: true
      })
      // if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '移动平台到指定位置指令完成',
        state.formData.sourceName
      )
      // }
    }
  })
}
// 监听导调计划更改状态
watch(
  () => store.state.sceneModule.isUpdatePlan,
  (newVal) => {
    // console.log(newVal)
    if (newVal) {
      getList()
    }
  },
  { deep: true }
)
onMounted(() => {
  emitter.emit('initSceneTime', true)
  getList()
})
</script>

<style lang="less" scoped>
.message_plan {
  position: absolute;
  left: calc(50% - 650px);
  z-index: 999;
  bottom: 32px;
  color: #ffffff;
  width: 1300px;
  height: 300px;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  .title {
    padding: 10px 20px;
    text-align: left;
    box-sizing: border-box;
    border-bottom: 1px solid #224d7c;
    display: flex;
    justify-content: space-between;
    span {
      font-size: 15px;
      font-weight: bold;
    }
    .operation {
      .el-button {
        background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
        width: 65px;
        height: 28px;
        color: #ffff;
        border-radius: 5px;
        margin-left: 10px;
        cursor: pointer;
      }
      .delBtn {
        box-shadow: inset 0px 0px 15px 5px rgba(224, 18, 8, 0.46),
          inset 0px 0px 25px 3px rgba(224, 18, 8, 0.61);
        border: 1px solid #e03608;
      }
    }
  }
  .message_plan_table {
    padding: 10px;
    box-sizing: border-box;
    ::v-deep .el-table td.el-table__cell,
    ::v-deep .el-table th.el-table__cell.is-leaf,
    ::v-deep .el-table__body-wrapper {
      background: #2b4559 !important;
      color: #a3a6ad;
    }
    .el-table {
      --el-table-border-color: #075d89;
    }
  }
}
</style>
