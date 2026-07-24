<template>
  <div id="seatAssign">
    <div class="header" ref="seatConfig_header">
      <div>
        <img src="" />
        <span style="color: #ffffff; font-size: 18px; font-weight: bold"
          >席位分配</span
        >
      </div>
      <el-icon
        style="cursor: pointer; color: #fff"
        @click="emit('closeBox', true)"
      >
        <Close />
      </el-icon>
    </div>
    <ul class="content">
      <li class="add_box">
        <el-button type="primary" @click="openGroupBox"> 添加 </el-button>
      </li>
      <el-scrollbar height="calc(100% - 52px)">
        <div class="flex_box">
          <li
            class="List_box"
            v-for="(item, index) in props.seatScheme.child"
            :key="index"
          >
            <div class="list_header">
              <span class="list_name">
                {{ item.groupName }}({{ getCamp(item.identifcation) }})
              </span>
              <span class="list_itemLength">
                数量：{{ item.relations.length }}
              </span>
              <div>
                <el-button type="primary" @click="editGroup(item)">
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  @click="removeGroup(item)"
                  class="delBtn"
                >
                  删除
                </el-button>
              </div>
            </div>
            <ul class="list_item">
              <li
                v-for="(children, children_index) in item.relations"
                :key="children_index"
              >
                <el-popover
                  placement="top-start"
                  :width="150"
                  trigger="click"
                  effect="dark"
                >
                  <template #reference>
                    <div class="seatItem" v-if="item.identifcation == 1">
                      <img src="~@/assets/images/任务准备/mnq_online.png" />
                      <span style="color: #ffffff">{{
                        children.equipmentName
                      }}</span>
                    </div>
                    <div class="seatItem" v-else>
                      <img src="~@/assets/images/任务准备/cp_online.png" />
                      <span style="color: #ffffff">{{
                        children.roleName
                      }}</span>
                    </div>
                  </template>
                  <ul class="popover_content">
                    <li
                      @click="
                        ;(vueData.identifcation = item.identifcation),
                          openAddSeatBox(children)
                      "
                    >
                      编辑
                    </li>
                    <li
                      @click="_removeSeatData(children, children_index, item)"
                    >
                      删除
                    </li>
                  </ul>
                </el-popover>
              </li>
              <li
                class="addSeatBtn_box"
                @click="
                  ;(vueData.identifcation = item.identifcation),
                    (vueData.seatId = item.seatId),
                    openAddSeatBox(null, item.relations)
                "
              >
                <el-icon style="color: #fff"><Plus /></el-icon>
              </li>
            </ul>
          </li>
        </div>
      </el-scrollbar>
    </ul>
    <!-- 添加组 -->
    <div class="addGroup_box" v-if="vueData.addGroupVisible">
      <div class="addSeat_header">
        <span style="color: #ffffff">新建组</span>
        <el-icon
          style="cursor: pointer; color: #ffffff"
          @click="vueData.addGroupVisible = false"
        >
          <Close />
        </el-icon>
      </div>
      <ul class="addSeat_content">
        <li>
          <span style="color: #ffffff">名称：</span>
          <el-input v-model="vueData.groupName" style="width: 180px" />
        </li>
        <li>
          <span style="color: #ffffff">属方：</span>
          <el-select v-model="vueData.selectCamp" style="width: 180px">
            <el-option
              v-for="item in vueData.campList"
              :key="item.id"
              :label="item.belongingName"
              :value="item.belongingStatus"
            />
          </el-select>
        </li>
        <li>
          <el-button type="primary" @click="addGroup">保存</el-button>
          <el-button @click="vueData.addGroupVisible = false" class="concelBtn"
            >取消</el-button
          >
        </li>
      </ul>
    </div>
    <!-- 添加/编辑席位 -->
    <div class="addSeat_box" v-if="vueData.addSeatVisible">
      <div class="addSeat_header">
        <span style="color: #ffffff; font-size: 15px">席位分配</span>
        <el-icon
          style="cursor: pointer; color: #ffffff"
          @click="vueData.addSeatVisible = false"
        >
          <Close />
        </el-icon>
      </div>
      <ul class="addSeat_content">
        <li v-if="vueData.identifcation == 1">
          <span>22模拟器：</span>
          <el-select v-model="vueData.selectSimulator" style="width: 180px">
            <el-option
              v-for="item in vueData.simulatorList"
              :key="item.id"
              :label="item.simulatorName"
              :value="item.simulatorName"
            />
          </el-select>
        </li>
        <li v-else>
          <span style="color: #ffffff">席位：</span>
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
          <el-button type="primary" @click="addSeat">保存</el-button>
          <el-button @click="vueData.addSeatVisible = false" class="concelBtn"
            >取消</el-button
          >
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onBeforeMount } from 'vue'
import { Close, Plus } from '@element-plus/icons-vue'
import { ElMessage } from 'element-plus'
import drag from '@/utils/dragElement'
import {
  getRoleSeatList,
  updateSeat,
  updateGroup,
  getSimulatorList,
  getCampList
} from '@/service/missionPreparation/seatManagement'

const vueData = reactive({
  addGroupVisible: false,
  addSeatVisible: false,
  selectSeat: '',
  seatList: [],
  groupName: '',
  selectCamp: '',
  campList: [
    {
      belongingName: ''
    },
    {
      belongingName: ''
    },
    {
      belongingName: ''
    },
    {
      belongingName: ''
    },
    {
      belongingName: ''
    },
    {
      belongingName: ''
    },
    {
      belongingName: ''
    },
    {
      belongingName: ''
    }
  ],
  identifcation: '',
  seatUpdataType: 0,
  selectSeatId: '',
  seatId: '',
  selectSimulator: '',
  simulatorList: [],
  haveSimulatorList: [],
  equipmentNameList: []
})

const seatConfig_header = ref(null)

const emit = defineEmits()

const props = defineProps({
  seatScheme: {
    type: Object,
    defind: {}
  }
})

onBeforeMount(() => {
  _getCampList()
})

onMounted(() => {
  drag(seatConfig_header.value)
})

/**
 * @description 获取用户席位列表
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
      ElMessage.error(res.data)
    }
  })
}

/**
 * @description 打开创建组窗口
 * @return { * }
 */
let openGroupBox = () => {
  vueData.groupData = {}
  vueData.groupName = ''
  vueData.selectCamp = ''
  vueData.groupOrder = 0
  vueData.addGroupVisible = true
}

/**
 * @description 打开添加/编辑席位窗口
 * @param { Object } item 席位数据
 */
let openAddSeatBox = (item, groupList) => {
  if (item) {
    vueData.selectSeat = item.roleKey
    vueData.selectSimulator = item.equipmentName
    vueData.seatData = item
    vueData.seatUpdataType = 1
  } else {
    vueData.equipmentNameList = []
    for (let i = 0; i < groupList.length; i++) {
      const element = groupList[i].equipmentName
      vueData.equipmentNameList.push(element)
    }
    vueData.selectSeat = ''
    vueData.seatUpdataType = 0
    console.log(vueData.equipmentNameList)
  }
  _getRoleSeatList()
  _getSimulatorList()
  vueData.addSeatVisible = true
}

/**
 * @description 添加/编辑席位
 */
let addGroup = () => {
  let params
  if (vueData.groupOrder == 1) {
    params = vueData.groupData
    params.groupName = vueData.groupName
    params.identifcation = vueData.selectCamp
    params.order = 1
  } else {
    params = {
      groupName: vueData.groupName,
      identifcation: vueData.selectCamp,
      order: 0,
      relations: [],
      seatSchemeId: props.seatScheme.id
    }
  }
  updateGroup(params).then((res) => {
    if (res.code == 200) {
      emit('updataSeatList')
      if (vueData.groupOrder == 1) {
        ElMessage.success('修改成功')
      } else {
        ElMessage.success('创建成功')
      }
      vueData.addGroupVisible = false
    } else {
      ElMessage.error(res.data)
    }
  })
}

/**
 * @description 打开创建/编辑组窗口
 * @param { Object } item 组数据
 */
let editGroup = (item) => {
  vueData.groupData = item
  vueData.groupName = item.groupName
  vueData.selectCamp = item.identifcation
  vueData.groupOrder = 1
  vueData.addGroupVisible = true
  _getCampList()
}

/**
 * @description 删除组数据
 * @param { Object } item 组数据
 */
let removeGroup = (item) => {
  let params = item
  params.order = 2
  updateGroup(params).then((res) => {
    if (res.code == 200) {
      emit('updataSeatList')
      ElMessage.success('删除成功')
      vueData.addGroupVisible = false
    } else {
      ElMessage.error(res.data)
    }
  })
}

/**
 * @description 添加/编辑席位
 */
let addSeat = () => {
  let params = {
    assignmentId: '',
    equipmentName: vueData.selectSimulator,
    ip: '',
    memberId: '',
    memberName: '',
    order: vueData.seatUpdataType,
    roleKey: vueData.selectSeat,
    seatId: '',
    status: vueData.identifcation + ''
  }
  if (vueData.seatUpdataType == 1) {
    params.assignmentId = vueData.seatData.assignmentId
    params.id = vueData.seatData.id
    params.seatId = vueData.seatData.seatId
  } else {
    params.seatId = vueData.seatId
  }
  updateSeat(params).then((res) => {
    if (res.code == 200) {
      emit('updataSeatList')
      ElMessage.success('分配成功')
      vueData.addSeatVisible = false
    } else {
      ElMessage.error(res.data)
    }
  })
}

/**
 * @description 删除席位数据
 * @param { Object } children 席位数据
 * @param { Number } index 席位索引
 * @param { Object } item 组数据
 */
let _removeSeatData = (children, index, item) => {
  let params = JSON.parse(JSON.stringify(children))
  params.order = 2
  updateSeat(params).then((res) => {
    if (res.code == 200) {
      emit('updataSeatList')
      item.relations.splice(index, 1)
      ElMessage.success('删除成功')
    } else {
      ElMessage.error(res.data)
    }
  })
}

/**
 * @description 获取属方名称
 * @param { Number } index 属方索引
 * @return { String } 属方名称
 */
let getCamp = (index) => {
  return vueData.campList[index].belongingName
}
</script>

<style lang="less" scoped>
#seatAssign {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 980px;
  height: 600px;
  margin-left: -400px;
  margin-top: -300px;
  background-color: rgba(8, 36, 62, 1);
  border-radius: 5px;
  z-index: 38;
  .header {
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #555555;
  }
  .content {
    height: calc(100% - 43px);
    padding: 10px;
    box-sizing: border-box;
    .add_box {
      text-align: right;
      padding: 10px;
    }
    .flex_box {
      // height: calc(100% - 52px);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-content: center;
      .List_box {
        background-color: #223b50;
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 20px;
        width: 49%;
        box-sizing: border-box;
        .list_header {
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .list_name {
            color: #fff;
            font-size: 18px;
          }
        }
        .list_item {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;
          li {
            display: flex;
            align-items: center;
            margin: 10px;
            cursor: pointer;
            .seatItem {
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              // font-size: 12px;
              img {
                width: 50px;
                height: 40px;
              }
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
          }
        }
      }
    }
  }

  .addSeat_box,
  .addGroup_box {
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;
    border-radius: 5px;
    position: fixed;
    top: 50%;
    left: 50%;
    width: 300px;
    height: 220px;
    margin-top: -150px;
    margin-left: -110px;
    .addSeat_header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px;
      border-bottom: 1px solid #555555;
    }
    .addSeat_content {
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
      :deep(.el-input__wrapper) {
        background-color: #2b4559 !important;
        box-shadow: 0 0 0 1px #075d89 inset !important;
        .el-input__inner {
          color: #fff !important;
        }
      }
      .el-select {
        width: 100%;
        :deep(.el-select__wrapper) {
          background-color: #2b4559 !important;
          box-shadow: 0 0 0 1px #075d89 inset !important;
          .el-select__selected-item {
            color: #fff !important;
          }
          .el-select__placeholder.is-transparent {
            color: #a8abb2 !important;
          }
        }
      }
    }
  }
}

.popover_content {
  padding: 0;
  li {
    padding: 5px 10px;
    cursor: pointer;
    list-style: none;
    &:hover {
      background-color: #02a7f04a;
    }
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
.delBtn {
  box-shadow: inset 0px 0px 15px 5px rgba(224, 18, 8, 0.46),
    inset 0px 0px 25px 3px rgba(224, 18, 8, 0.61);
  border: 1px solid #e03608;
}
</style>
