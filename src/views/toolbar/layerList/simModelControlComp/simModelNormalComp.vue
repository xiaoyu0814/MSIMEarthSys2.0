<!-- 模拟器集合、运控导调面板 -->
<template>
  <div class="formContainer">
    <div class="inputOption">
      <el-form :model="state.formData" label-width="70px">
        <el-form-item
          label="平台名称"
          v-if="
            state.formData.command == '运控' || state.formData.command == '集合'
          "
        >
          <el-input v-model="state.formData.targetName" disabled></el-input>
        </el-form-item>
        <el-form-item
          label="阵营"
          v-if="
            state.formData.command == '运控' || state.formData.command == '集合'
          "
        >
          <el-select
            v-model="state.formData.side"
            class="scene_input"
            placeholder="请选择"
            size="small"
            clearable
          >
            <el-option
              v-for="item in state.sideLists"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item
          label="实体数量"
          v-if="
            state.formData.command == '运控' || state.formData.command == '集合'
          "
        >
          <el-input-number
            v-model="state.formData.bdstNums"
            :min="0"
            :max="10"
            size="small"
            controls-position="right"
            disabled
          />
        </el-form-item> -->
        <el-form-item label="命令" v-if="state.formData.command == '运控'">
          <el-select
            v-model="state.formData.managerOrderRadio"
            class="scene_input"
            placeholder="请选择"
            size="small"
            clearable
          >
            <el-option
              v-for="item in state.managerOrders"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="命令类型" v-if="state.formData.command == '运控'">
          <el-select
            v-model="state.formData.orderTypeRadio"
            class="scene_input"
            placeholder="请选择"
            size="small"
            clearable
          >
            <el-option
              v-for="item in state.orderTypeList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="是否修改" v-if="state.formData.command == '运控'">
          <el-select
            v-model="state.formData.isChangeOrderRadio"
            class="scene_input"
            placeholder="请选择"
            size="small"
            clearable
          >
            <el-option
              v-for="item in state.changeOrderList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item> -->
        <el-form-item label="经度" v-if="state.formData.command == '集合'">
          <el-input
            style="width: 126px"
            v-model="state.formData.longitude"
          ></el-input>
          <el-button
            type="primary"
            style="margin-left: 5px"
            size="small"
            @click="getCurLngLat"
            >拾取</el-button
          >
        </el-form-item>
        <el-form-item label="纬度" v-if="state.formData.command == '集合'">
          <el-input
            style="width: 126px"
            v-model="state.formData.latitude"
          ></el-input>
          <el-button
            type="primary"
            style="margin-left: 5px"
            size="small"
            @click="getCurLngLat"
            >拾取</el-button
          >
        </el-form-item>
        <el-form-item
          label="高度"
          class="chspeed"
          v-if="state.formData.command == '集合'"
        >
          <el-input-number
            v-model="state.formData.height"
            :min="0"
            :max="30000"
            size="small"
          />
          <span class="chSpeed_dw">(m)</span>
        </el-form-item>
        <el-form-item
          label="速度"
          class="chspeed"
          v-if="state.formData.command == '集合'"
        >
          <el-input-number
            v-model="state.formData.changeSpeed"
            :min="0"
            size="small"
          />
          <span class="chSpeed_dw">(km/h)</span>
        </el-form-item>
        <el-form-item
          label="航向"
          class="chspeed"
          v-if="state.formData.command == '集合'"
        >
          <el-input-number
            v-model="state.formData.headingAngle"
            :min="0"
            :max="360"
            size="small"
          />
          <span class="chSpeed_dw">(°)</span>
        </el-form-item>
      </el-form>
    </div>
    <div class="select_btn">
      <el-button type="primary" size="small" @click="confirmScene"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch, defineProps } from 'vue'
import emitter from '@/utils/eventbus'
import store from '@/store/index'
import Bubble3 from '@/utils/bubble/dataBubble3'
import { directDataCommand, directDataControl } from '@/service/simModelCommand'
import { ElMessage } from 'element-plus'
import { showCommandSysMessage, worldPosToGraphic } from '@/utils/mapTools'
import { showMouseCurLngLat } from '@/views/toolbar/layerList/hooks/simModelGuideCommand' //模拟器相关导调指令
const props = defineProps({
  formDataObj: {
    type: Object,
    default: {}
  }
})
const state = reactive({
  curSelect: '',
  formData: {
    command: props.formDataObj.command,
    sourceName: props.formDataObj.sourceName,
    targetName: props.formDataObj['targetName'],
    longitude: props.formDataObj['longitude'],
    latitude: props.formDataObj['latitude'],
    height: props.formDataObj['height'],
    weaponsArr: props.formDataObj['weaponsArr'],
    sensoresArr: props.formDataObj['sensoresArr'],
    managerOrderRadio: props.formDataObj['managerOrderRadio'],
    changeSpeed: props.formDataObj['changeSpeed'],
    headingAngle: props.formDataObj['headingAngle'],
    side: props.formDataObj['side'],
    orderTypeRadio: props.formDataObj['orderTypeRadio'],
    isChangeOrderRadio: props.formDataObj['isChangeOrderRadio'],
    bdstNums: props.formDataObj['bdstNums'], //实体数量
    wtype: props.formDataObj['wtype']
  },
  managerOrders: [
    { value: '1', name: '冻结' },
    //{ value: '2', name: '解冻' } // 复位
    { value: '4', name: '解冻' } //起飞
    // { value: '8', name: '五边' }
  ],
  sideLists: [
    { value: 'red', name: '红方' },
    { value: 'blue', name: '蓝方' },
    { value: 'green', name: '绿方' }
  ],
  orderTypeList: [
    { value: '1', name: '开始' },
    { value: '0', name: '结束' }
  ],
  changeOrderList: [
    { value: '1', name: '是' },
    { value: '0', name: '否' }
  ]
})
const confirmScene = () => {
  if (state.formData.command == '运控') {
    if (!state.formData.managerOrderRadio) {
      beautyToast.warning({
        title: 'Warning',
        message: '请选择指令!',
        darkTheme: true
      })
      return false
    }
    sendManagerOrder()
  } else if (state.formData.command == '集合') {
    gatherAroundOrder()
  }
}
//发送运控指令
const sendManagerOrder = () => {
  //orderType: 1  //1:冻结；2:复位;4:起飞
  let params = {
    bcmd: Number(state.formData.managerOrderRadio),
    bdstNums: state.formData.bdstNums,
    bsimuCMD: 0,
    bsimuCMDSet: 0,
    name: state.formData.targetName,
    side: state.formData.side,
    wtype: state.formData.wtype
  }
  directDataControl(params).then((res) => {
    if (res.code == 200) {
      showCommandSysMessage(
        state.formData.targetName,
        '运控指令导调成功!',
        store.getters.getSucceStateInfoOutColor
      )
      ElMessage({
        type: 'success',
        message: '运控指令导调成功'
      })
      emitter.emit('closePanel', '') //关闭弹框
    } else {
      ElMessage({
        type: 'error',
        message: '运控指令导调失败'
      })
    }
  })
}
//发送集合指令
const gatherAroundOrder = () => {
  if (!state.formData.longitude) {
    ElMessage.warning('请输入经度!')
    return
  }
  if (!state.formData.latitude) {
    ElMessage.warning('请输入纬度!')
    return
  }
  if (!state.formData.height) {
    ElMessage.warning('请输入高度!')
    return
  }
  if (!state.formData.side) {
    ElMessage.warning('请选择阵营!')
    return
  }
  let params = {
    bentityNum: state.formData.bdstNums, //实体数量
    bisGather: 1, //集合指令
    dbGatherLat: state.formData.latitude ? Number(state.formData.latitude) : '', //集合纬度
    dbGatherLong: state.formData.longitude
      ? Number(state.formData.longitude)
      : '', //集合经度
    fgatherHeight: state.formData.height ? Number(state.formData.height) : '', //集合高度
    fgatherPsi: state.formData.headingAngle
      ? Number(state.formData.headingAngle)
      : 0, //集合方向
    fgatherVdk: state.formData.changeSpeed
      ? Number(state.formData.changeSpeed)
      : '', //速度
    name: state.formData.targetName, //实体名称
    side: state.formData.side, //阵营
    wtype: state.formData.wtype
  }
  directDataCommand(params).then((res) => {
    if (res.code == 200) {
      showCommandSysMessage(
        state.formData.targetName,
        '集合指令导调成功!',
        store.getters.getSucceStateInfoOutColor
      )
      ElMessage({
        type: 'success',
        message: '集合指令导调成功'
      })
      emitter.emit('closePanel', '') //关闭弹框
    } else {
      ElMessage({
        type: 'error',
        message: '集合指令导调失败'
      })
    }
  })
}
// 拾取
const getCurLngLat = () => {
  showMouseCurLngLat((position) => {
    state.formData.latitude = position.lat //集合纬度
    state.formData.longitude = position.lng //集合经度
  })
}
onMounted(() => {})
</script>

<style lang="less" scoped>
.formContainer {
  .scene_input {
    // margin-top: 25px;
    border: none !important;

    :deep(.el-input__inner) {
      font-size: 18px;
      font-weight: 500;
      color: #06d6f9;
      border: none !important;
      text-align: center;
    }

    :deep(.el-input__wrapper) {
      background-color: #172e51 !important;
      box-shadow: 0 0 25px #1092d5;
    }

    :deep(.el-input) {
      --el-input-border-color: #e5e5e500 !important;
      --el-input-hover-border: transparent !important;
      --el-input-focus-border: transparent !important;
      --el-input-placeholder-color: #06d6f9;
    }

    :deep(.el-input__wrapper:hover) {
      border: none !important;
      box-shadow: none;
    }

    :deep(.el-select) {
      --el-select-border-color-hover: transparent !important;
      --el-select-input-focus-border-color: transparent !important;
    }

    :deep(.el-input-number--small) {
      width: 150px !important;
    }
  }

  :deep(.el-tabs--border-card > .el-tabs__content) {
    padding: 0;
    height: calc(100% - 39px);

    .el-tab-pane {
      height: 100%;
    }
  }

  :deep(.el-tabs--border-card) {
    background: rgba(0, 0, 0, 0);
    border: none;
    height: calc(100% - 48px);
  }

  :deep(.el-tabs--border-card > .el-tabs__header) {
    background: rgba(0, 0, 0, 0);
  }

  :deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item.is-active) {
    background-color: #1092d5;
    border: none;
  }

  :deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item) {
    color: white;
  }

  :deep(.el-tabs__item:focus-visible) {
    box-shadow: none;
  }

  :deep(.el-tabs--border-card > .el-tabs__header .el-tabs__item) {
    border: none;
  }
}

.select_btn {
  display: flex;
  justify-content: flex-end;
}

:deep(.el-radio) {
  color: white;
  margin: 0 10px;
}

:deep .el-radio__inner {
  background-color: rgba(17, 181, 236, 0.5);
  border: 1px solid #11b5ec;
}

.chspeed {
  :deep .el-input-number {
    width: 130px !important;
  }

  .chSpeed_dw {
    color: #fff;
    position: relative;
    display: inline-flex;
    width: 30px;
  }
}

/* :deep .el-radio {
    color: #11b5ec;
  } */

.scene_input {
  /* margin-top: 25px; */
  border: none !important;

  :deep(.el-input__inner) {
    font-size: 18px;
    font-weight: 500;
    color: #06d6f9;
    border: none !important;
    text-align: center;
  }

  :deep(.el-input__wrapper) {
    background-color: #172e51 !important;
    box-shadow: 0 0 25px #1092d5;
  }

  :deep(.el-input) {
    --el-input-border-color: #e5e5e500 !important;
    --el-input-hover-border: transparent !important;
    --el-input-focus-border: transparent !important;
    --el-input-placeholder-color: #06d6f9;
  }

  :deep(.el-input__wrapper:hover) {
    border: none !important;
    box-shadow: none;
  }

  :deep(.el-select) {
    --el-select-border-color-hover: transparent !important;
    --el-select-input-focus-border-color: transparent !important;
  }
}

.formContainer {
  padding: 10px;
}

.inputOption {
  :deep(.el-form-item__label) {
    color: white;
  }

  :deep .el-input__wrapper {
    background: rgba(32, 97, 121, 0.45);
    border: 1px solid rgba(100, 199, 213, 1);
    border-radius: 4px;

    .el-input__inner {
      color: white;
    }
  }

  .form_staticParameters {
    color: white;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

:deep(.el-form-item) {
  margin-bottom: 10px;
}

:deep(.el-form-item__content) {
  margin-left: 0 !important;
}
</style>
