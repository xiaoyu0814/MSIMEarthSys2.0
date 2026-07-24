<template>
  <div id="seatConfig">
    <div class="searchBox">
      <el-input
        v-model="vueData.search"
        :suffix-icon="Search"
        style="width: 200px"
        @change="_getSeatList"
      />
      <el-button type="primary" @click="createSeat">新增席位</el-button>
    </div>
    <ul class="seat_box">
      <li
        class="item_box"
        v-for="(item, index) in vueData.seatDataList"
        :key="index"
        @click="selectSeat(item, index)"
        :class="vueData.getSeatId == item.id ? 'selectStyle' : ''"
      >
        <div class="header">
          <span class="title">
            <img src="~@/assets/images/rwty/想定查询.svg" alt="" />
            <span class="s_name">{{ item.scenarioName }}</span>
          </span>
          <span>
            <el-button
              type="danger"
              :icon="Delete"
              link
              @click.stop="remove_seatData(item)"
            />
            <el-button
              type="primary"
              :icon="Edit"
              link
              @click.stop="edit_seatData(item, index)"
            />
          </span>
        </div>
        <div class="describe">描述：{{ item.scenarioDescribe }}</div>
        <ul class="group_box">
          <el-scrollbar height="100%">
            <li
              class="item_group"
              v-for="(group, group_index) in item.child"
              :key="group_index"
            >
              <p>{{ group.groupName }}({{ getCamp(group.identifcation) }})</p>
              <div
                class="item_seat"
                v-for="(seat, seat_index) in group.relations"
                :key="seat_index"
                @click.stop="openSetSeatBox(group, seat)"
              >
                <img
                  v-if="group.identifcation == 1"
                  src="~@/assets/images/任务准备/mnq_online.png"
                />
                <img v-else src="~@/assets/images/任务准备/cp_online.png" />
                <span style="color: #fff">
                  {{
                    group.identifcation == 1
                      ? seat.equipmentName
                      : seat.roleName
                  }}
                </span>
              </div>
              <!-- <div class="addSeatBtn_box">
                <el-icon><Plus /></el-icon>
              </div> -->
            </li>
          </el-scrollbar>
        </ul>
        <div class="date_box">
          <span>生成时间：{{ item.ctime }}</span>
          <span>修改时间：{{ item.utime }}</span>
        </div>
      </li>
    </ul>
    <selfPage
      class="page_box"
      :currentPage="vueData.pageNum"
      :pageSize="vueData.pageSize"
      :total="vueData.total"
      @handleSizeChange="changePageSize"
      @handleCurrentChange="changePageNum"
    ></selfPage>
    <!-- 添加/编辑席位 -->
    <div class="addSeat_box" v-if="vueData.setSeatVisible">
      <div class="header">
        <span style="color: #fff">席位分配</span>
        <el-icon
          style="cursor: pointer"
          @click="vueData.setSeatVisible = false"
        >
          <Close />
        </el-icon>
      </div>
      <ul v-if="vueData.identifcation == 1" class="content">
        <li>
          <span style="text-indent: 14px; color: #fff">兵力：</span>
          <el-select
            v-model="vueData.selectCGF"
            style="width: 180px"
            @change="setCGFreal"
            value-key="id"
          >
            <el-option
              v-for="item in vueData.CGFList"
              :key="item.id"
              :label="item.name"
              :value="item"
            />
          </el-select>
        </li>
        <li>
          <span style="color: #fff">模拟器：</span>
          <el-select v-model="vueData.selectSimulator" style="width: 180px">
            <el-option
              v-for="item in vueData.simulatorList"
              :key="item.id"
              :label="item.simulatorName"
              :value="item.simulatorName"
            />
          </el-select>
        </li>
        <li>
          <el-button @click="vueData.setSeatVisible = false" class="concelBtn"
            >取消</el-button
          >
          <el-button type="primary" @click="setSimulator">保存</el-button>
        </li>
      </ul>
      <ul v-else class="content">
        <li>
          <span style="color: #fff">用户：</span>
          <el-select v-model="vueData.selectUser" style="width: 180px">
            <el-option
              v-for="item in vueData.userList"
              :key="item.userId"
              :label="item.nickName"
              :value="item.userId"
            />
          </el-select>
        </li>
        <li>
          <span style="color: #fff">席位：</span>
          <el-select v-model="vueData.selectSeat" style="width: 180px">
            <el-option
              v-for="item in vueData.seatList"
              :key="item.id"
              :label="item.roleName"
              :value="item.roleKey"
            />
          </el-select>
        </li>
        <li>
          <el-button @click="vueData.setSeatVisible = false" class="concelBtn"
            >取消</el-button
          >
          <el-button type="primary" @click="setSeat">保存</el-button>
        </li>
      </ul>
    </div>
    <seatAssign
      :seatScheme="vueData.seatScheme"
      @closeBox="closeSeatManagement"
      @updataSeatList="_getSeatList"
      v-if="vueData.showSeatAssign"
    ></seatAssign>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import { Plus, Search, Delete, Edit } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import selfPage from '@/components/page.vue'
import emitter from '@/utils/eventbus'
import seatAssign from '@/views/seatManagement/adminuser/taskReadiness/seatCreat/seatAssign'
import {
  getSeatList,
  getUseSeatScheme,
  getRoleSeatList,
  getUserList,
  updateSeat,
  getSimulatorList,
  getCampList,
  deleteSeat
} from '@/service/missionPreparation/seatManagement'

import { getMissionByid } from '@/service/contingencyEditing/contingencyEditing'
import { setSimulatorBL } from '@/service/taskManagement'

const emit = defineEmits(['selectSeatId'])

const vueData = reactive({
  search: '',
  pageNum: 1,
  pageSize: 3,
  total: 10,
  seatDataList: [],
  setSeatVisible: false,
  selectUser: '',
  userList: [],
  selectSeat: '',
  seatList: [],
  identifcation: '',
  selectIndex: -1,
  selectCGF: '',
  CGFList: [],
  selectSimulator: '',
  simulatorList: [],
  datamodel: null,
  old_CGFId: '',
  seatId: '',
  getSeatId: '',
  getMissionId: '',
  campList: [],
  equipmentNameList: [],
  showSeatAssign: false,
  seatScheme: {}
})

const store = useStore()

onMounted(() => {
  vueData.datamodel = new PIESIM.CGFDataModel()
  if (store.getters.get_taskData.scenarioForm) {
    vueData.getMissionId = store.getters.get_taskData.scenarioForm.id
  } else {
    vueData.getMissionId = store.getters.get_taskData.scenarioId
  }
  if (store.getters.get_taskData.seatVo) {
    vueData.getSeatId = store.getters.get_taskData.seatVo.id
  } else {
    vueData.getSeatId = store.getters.get_taskData.schemeId
  }

  let vecNodes = []
  if (store.getters.get_taskData.scenarioForm.bjsonScenarioData) {
    vecNodes =
      store.getters.get_taskData.scenarioForm.bjsonScenarioData.vecNodes
  }

  _getSeatList()
  vueData.CGFList = GetNodeCGFEntity(vecNodes)
  _getCampList()
})
emitter.on('refreshSeatList', (val) => {
  vueData.search = ''
  vueData.pageNum = 1
  vueData.pageSize = 3
  _getSeatList()
})

const GetNodeCGFEntity = (vecNodes) => {
  var pResult = []
  function traverse(pCGFEntity) {
    const children = pCGFEntity.children
    if (children.length > 0) {
      for (let pcgf_i = 0, l = children.length; pcgf_i < l; pcgf_i++) {
        traverse(children[pcgf_i])
      }
    } else {
      pResult.push(pCGFEntity)
    }
  }
  for (let i = 0; i < vecNodes.length; i++) {
    if (vecNodes[i].children.length > 0) {
      traverse(vecNodes[i])
    }
  }
  return pResult
}

/**
 * @description 获取席位方案列表
 * @return { * }
 */
let _getSeatList = () => {
  let params = {
    scenarioName: vueData.search,
    pageNum: vueData.pageNum,
    pageSize: vueData.pageSize
  }
  getUseSeatScheme(params).then((res) => {
    if (res.code == 200) {
      vueData.seatDataList = res.data.records
      vueData.total = res.data.total
      if (vueData.selectIndex != -1) {
        vueData.seatScheme = vueData.seatDataList[vueData.selectIndex]
      }
    } else {
      ElMessage.error(res.data)
    }
  })
}

/**
 * @description 获取用户列表
 */
let _getUserList = () => {
  let params = {}
  getUserList(params).then((res) => {
    if (res.code == 200) {
      vueData.userList = res.data
    } else {
      ElMessage.error(res.data)
    }
  })
}

/**
 * @description 获取席位列表
 */
let _getRoleSeatList = () => {
  let params = {
    groupType: vueData.identifcation ? 1 : vueData.identifcation
  }
  getRoleSeatList(params).then((res) => {
    if (res.code == 200) {
      vueData.seatList = res.data
    } else {
      ElMessage.error(res.data)
    }
  })
}
/**
 * @description 删除席位方案
 * @param { Object } item 席位数据
 */
let remove_seatData = (item) => {
  ElMessageBox.confirm('确定删除当前数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      let params = {
        scenarioName: item.scenarioName
      }
      deleteSeat(params).then((res) => {
        if (res.code == 200) {
          ElMessage({
            type: 'success',
            message: '删除成功'
          })
          _getSeatList()
        } else {
          ElMessage({
            type: 'error',
            message: '删除失败'
          })
        }
      })
    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消删除'
      })
    })
}
// 编辑席位
const edit_seatData = (item, index) => {
  vueData.selectIndex = index
  vueData.seatScheme = item
  vueData.showSeatAssign = true
}
/**
 * @description 获取模拟器列表
 */
let _getSimulatorList = () => {
  let params = ''
  for (let i = 0; i < vueData.equipmentNameList.length; i++) {
    const element = vueData.equipmentNameList[i]
    params += 'simulatorNameList=' + element + '&'
  }
  getSimulatorList(params).then((res) => {
    if (res.code == 200) {
      vueData.simulatorList = res.data.data
    } else {
      ElMessage.error(res.data)
    }
  })
}

/**
 * @description 获取属方列表
 */
let _getCampList = () => {
  let params = {}
  getCampList(params).then((res) => {
    if (res.code == 200) {
      vueData.campList = res.data
    } else {
      ElMessage.error(res.message)
    }
  })
}

/**
 * @description 设置席位
 */
let setSeat = () => {
  let params = vueData.selectSeat_item
  params.assignmentId = store.state.missionPreparation.taskData.id
  params.memberId = vueData.selectUser
  params.roleKey = vueData.selectSeat
  params.order = 1
  updateSeat(params).then((res) => {
    if (res.code == 200) {
      vueData.setSeatVisible = false
      _getSeatList()
      ElMessage.success('配置成功')
    } else {
      ElMessage.error(res.data)
    }
  })
}

/**
 * @description 设置模拟器
 */
let setSimulator = () => {
  let params = {
    content: '',
    equipmentName: vueData.selectSimulator,
    scenarioId: vueData.getMissionId,
    seatId: vueData.seatId,
    virtualSoldierId: vueData.selectCGF.id,
    virtualSoldierName: vueData.selectCGF.name,
    taskId: store.getters.get_taskData.id
  }
  setSimulatorBL(params).then((res) => {
    if (res.code == 200) {
      ElMessage.success('配置成功')
      _getSeatList()
      vueData.setSeatVisible = false
    } else {
      ElMessage.error(res.data)
    }
  })
}

/**
 * @description 打开设置席位窗口
 * @param { Object } group 组数据
 * @param { Object } seat 席位数据
 */
let openSetSeatBox = (group, seat) => {
  vueData.identifcation = group.identifcation
  vueData.seatId = group.seatId
  vueData.selectSeat_item = seat
  vueData.selectSeat = seat.roleKey
  if (vueData.identifcation == 1) {
    vueData.selectCGF = seat.memberId
    vueData.selectUser = ''
    for (let i = 0; i < group.relations.length; i++) {
      const element = group.relations[i].equipmentName
      vueData.equipmentNameList.push(element)
    }
  } else {
    vueData.selectUser = Number(seat.memberId)
    vueData.selectCGF = ''
  }
  vueData.selectSimulator = seat.equipmentName
  _getUserList()
  _getRoleSeatList()
  _getSimulatorList()
  vueData.setSeatVisible = true
}

/**
 * @description 获取想定内容
 */
let _getMissionByid = () => {
  let params = {
    id: vueData.getMissionId
  }
  getMissionByid(params).then((res) => {
    if (res.code == 200) {
      vueData.missionData = res.data
      // getCGFList(res.data.content)
    } else {
      ElMessage.error('想定内容失败')
    }
  })
}

/**
 * @description 获取兵力列表
 * @param { String } content xml想定内容
 */
let getCGFList = (content) => {
  if (!content) {
    ElMessage.error('想定文件内容获获取失败')
    return
  }
  vueData.datamodel.loadXmlString(content)
  vueData.CGFList = vueData.datamodel.GetNodeCGFEntity()
}

/**
 * @description 获取选取的兵力，更新兵力属性
 * @param { Number } id 兵力ID
 */
let setCGFreal = (id) => {
  return
  if (vueData.old_CGFId == '') {
    vueData.old_CGFId = id
  } else {
    let old_CGFitem = vueData.datamodel.getCGFEntityById(vueData.old_CGFId)
    old_CGFitem.setRealCGF(false)
  }
  let CGFitem = vueData.datamodel.getCGFEntityById(id)
  CGFitem.setRealCGF(true)
  vueData.old_CGFId = id
}

/**
 * @description 获取属方
 * @param { Number } type 属方类型
 * @return { String } 属方名称
 */
let getCamp = (type) => {
  let camp = '未知组'
  for (let i = 0; i < vueData.campList.length; i++) {
    const element = vueData.campList[i]
    if (type == element.belongingStatus) {
      camp = element.belongingName
    }
  }
  return camp
}

/**
 * @description 获取选择的席位方案
 * @param { Object } item 席位方案数据
 * @param { Number } index 席位方案索引
 */
let selectSeat = (item, index) => {
  emit('selectSeatId', item.id)
  vueData.getSeatId = item.id
  vueData.seatScheme = item
  vueData.selectIndex = index
}
/**
 * @description 关闭席位管理窗口
 */
let closeSeatManagement = () => {
  vueData.showSeatAssign = false
}
/**
 * @description 改变页数量
 * @param { Number } pageSize 页数量
 */
let changePageSize = (pageSize) => {
  vueData.pageSize = pageSize
  _getSeatList()
}

/**
 * @description 切换页码
 * @param { Number } pageNum 页码
 */
let changePageNum = (pageNum) => {
  vueData.pageNum = pageNum
  _getSeatList()
}
/**
 * 新增席位打开弹框
 */
const createSeat = () => {
  emitter.emit('setShowCreatSeatBox', true)
}
</script>

<style lang="less" scoped>
#seatConfig {
  height: 100%;
  box-sizing: border-box;
  padding: 10px;

  .searchBox {
    // text-align: right;
    display: flex;
    justify-content: space-between;
    padding: 0 1px 0 40px;

    :deep(.el-input) {
      .el-input__wrapper {
        border-radius: 5px;
        box-shadow: none;
        background-color: #2b4559 !important;
        box-shadow: 0 0 0 1px #075d89 inset !important;
      }
    }

    .el-button {
      background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
      width: 85px;
      height: 33px;
      color: #ffff;
      border-radius: 5px;
      margin-left: 10px;
      cursor: pointer;
    }
  }

  .seat_box {
    height: calc(100% - 76px);
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 10px;

    .item_box {
      height: 100%;
      width: 32%;
      background-color: #223b50;
      border: 1px solid #ffffff00;
      border-radius: 5px;
      padding: 10px;
      cursor: pointer;
      box-sizing: border-box;

      .header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: #81d3f8;

        .title {
          display: flex;
          width: calc(100% - 60px);
          align-items: center;
          .s_name {
            font-size: 18px;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          }
        }
      }

      .describe {
        text-align: left;
        color: #b2bbc2;
        font-size: 14px;
        margin: 5px 10px;
        height: 60px;
        display: flex;
        align-items: center;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
        overflow: hidden;
        text-overflow: ellipsis;
      }

      .group_box {
        height: calc(100% - 32px - 60px - 34px);
        padding: 0;

        .item_group {
          position: relative;

          p {
            position: absolute;
            left: 10px;
            top: -20px;
            font-size: 12px;
            color: #ffffff;
          }

          border: 1px solid #2e4b64;
          margin: 10px 0;
          display: grid;
          grid-template-columns: 70px 70px 70px 70px 70px;
          grid-template-rows: 55px;
          padding: 10px 0;

          .item_seat {
            margin: 3px 5px;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-size: 11px;

            img {
              width: 50px;
              height: 40px;
            }
          }

          .addSeatBtn_box {
            width: 50px;
            height: 50px;
            border: 1px dashed #cccccc;
            border-radius: 5px;
            display: flex;
            align-items: center;
            justify-content: center;
            margin: 3px;
          }
        }
      }

      .date_box {
        color: #b2bbc2;
        font-size: 10px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        padding: 10px;
      }
    }
  }

  .page_box {
    margin-top: 10px;

    :deep(.el-pagination) {
      justify-content: flex-end;
    }
  }

  .addSeat_box {
    background-color: rgba(8, 36, 62, 0.7);
    border-radius: 5px;
    position: fixed;
    top: 50%;
    left: 50%;
    width: 300px;
    height: 220px;
    margin-top: -150px;
    margin-left: -110px;

    .header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #555555;
    }

    .content {
      height: calc(100% - 43px);
      padding: 10px;
      box-sizing: border-box;
      display: flex;
      flex-direction: column;
      justify-content: center;

      li {
        padding: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
      }
    }

    .el-button {
      background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
      width: 65px;
      height: 33px;
      color: #ffff;
      border-radius: 5px;
      margin-left: 10px;
      cursor: pointer;
    }

    .concelBtn {
      background: #fff !important;
      color: black;
    }
  }

  .selectStyle {
    border: 1px solid #ffffff !important;
    background-color: #40a0ff3d !important;
  }
}
</style>
