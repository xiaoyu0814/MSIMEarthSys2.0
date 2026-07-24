<template>
  <div class="multifunctional">
    <el-form label-width="auto" :model="vueData.formLabelAlign">
      <el-form-item label="" label-position="right">
        <el-radio-group v-model="radio1" @change="clickRadio">
          <el-radio-button
            label="攻击自定义指令"
            class="radiobutton"
            value="fireByRaw"
          />
          <el-radio-button label="变更到指定位置" value="moveToPosition" />
        </el-radio-group>
      </el-form-item>
      <div v-show="vueData.radioValue == ''">
        <el-form-item label="平台名称" class="custom-form">
          <el-input
            class="custom-input"
            v-model="vueData.formLabelAlign.sourceName"
            placeholder="请输入平台名称"
            disabled="false"
          />
        </el-form-item>
        <el-form-item label="经度" class="custom-form">
          <el-input
            class="custom-input"
            v-model="vueData.formLabelAlign.longitude"
            placeholder="请输入经度"
            disabled="false"
          />
        </el-form-item>
        <el-form-item label="纬度" class="custom-form">
          <el-input
            class="custom-input"
            v-model="vueData.formLabelAlign.latitude"
            placeholder="请输入纬度"
            disabled="false"
          />
        </el-form-item>
        <el-form-item label="位置高度" class="custom-form">
          <div style="display: flex">
            <el-input
              class="custom-input"
              v-model="vueData.formLabelAlign.height"
              placeholder="请输入位置高度"
              disabled="false"
            />
            <el-button
              class="el-button"
              type="primary"
              disabled
              @click="resetForm()"
              >确定</el-button
            >
          </div>
        </el-form-item>
      </div>
      <div v-show="vueData.radioValue == 'moveToPosition'">
        <el-form-item label="平台名称" class="custom-form">
          <el-input
            class="custom-input"
            v-model="vueData.formLabelAlign.sourceName"
            placeholder="请选择平台名称"
          />
        </el-form-item>
        <el-form-item label="经度" class="custom-form">
          <el-input
            class="custom-input"
            v-model="vueData.formLabelAlign.longitude"
            placeholder="请选择经度"
          />
        </el-form-item>
        <el-form-item label="纬度" class="custom-form">
          <el-input
            class="custom-input"
            v-model="vueData.formLabelAlign.latitude"
            placeholder="请选择纬度"
          />
        </el-form-item>
        <el-form-item label="位置高度" class="custom-form">
          <div style="display: flex">
            <el-input
              class="custom-input"
              v-model="vueData.formLabelAlign.height"
              placeholder="请选择位置高度"
            />
            <el-button class="el-button" type="primary" @click="resetForm()"
              >确定</el-button
            >
          </div>
        </el-form-item>
      </div>
      <div v-show="vueData.radioValue == 'fireByRaw'">
        <el-form-item label="平台名称" class="custom-form">
          <el-input
            class="custom-input"
            v-model="vueData.formLabelAlign.sourceName"
            placeholder="请选择平台名称"
          />
        </el-form-item>
        <el-form-item label="虚兵名称" class="custom-form">
          <el-input
            class="custom-input"
            v-model="vueData.formLabelAlign.targetName"
            placeholder="请选择虚兵名称"
          />
        </el-form-item>
        <el-form-item label="武器名称" class="custom-form">
          <!-- <el-input class="custom-input" v-model="vueData.formLabelAlign.latitude" /> -->
          <el-select
            v-model="vueData.formLabelAlign.weaponName"
            style="width: 140px"
            size="small"
            placeholder="请选择武器名称"
          >
            <el-option
              v-for="(item, index) in vueData.formLabelAlign.weaponsArr"
              :key="index"
              :label="item.name"
              :value="item.weaponsId"
            ></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="发射数量" class="custom-form">
          <div style="display: flex">
            <el-input-number
              size="small"
              v-model="vueData.formLabelAlign.num"
              :min="0"
              :max="vueData.formLabelAlign.quatRCount"
            />
            <el-button class="el-button" type="primary" @click="resetForm()"
              >确定</el-button
            >
          </div>
        </el-form-item>
      </div>
    </el-form>
  </div>
</template>
<script setup>
import { ref, reactive, onMounted } from 'vue'
import { useStore } from 'vuex'
import emitter from '@/utils/eventbus'
import { toPosition, byRaw } from '@/service/command'
import { sendToCommandShowResMsg, getEititiesPostion } from '@/utils/mapTools'

const vueData = reactive({
  formLabelAlign: {},
  radioValue: '',
  formData: {}
})

onMounted(() => {
  emitter.on('getEntityHeightAndSpeed', (val) => {
    vueData.radioValue = ''
    radio1.value = ''
  })
  emitter.on('showCommandControl02', (val) => {
    console.log(val)
    if (val.isShow) {
      vueData.formData = val.commandFormData
      vueData.formLabelAlign = val.commandFormData
    }
    // toPositionFun()
  })

  //是否快捷显示攻击弹框
  emitter.on('showFirePanel', (value) => {
    console.log(value)
    // state.commandControlIsShow = value.isShow
    if (value.isShow) {
      vueData.formLabelAlign.command = value.commandFormData.command
      vueData.formLabelAlign.sourceName = value.commandFormData['sourceName']
      vueData.formLabelAlign.targetName = value.commandFormData['targetName']
      vueData.formLabelAlign.weaponsArr = value.commandFormData['weaponsArr']
      vueData.formLabelAlign['sensoresArr'] =
        value.commandFormData['sensoresArr']
    }
  })
})
const toPositionFun = () => {
  // 移动平台到指定位置指令接口
  let params = {
    lng: Number(vueData.formLabelAlign.longitude),
    lat: Number(vueData.formLabelAlign.latitude),
    alt: Number(vueData.formLabelAlign.height),
    pltName: vueData.formLabelAlign.sourceName
  }
  toPosition(params).then((res) => {
    // console.log(res)
    window.EarthViewer._container.style.cursor = 'default'
    beautyToast.success({
      title: '导调指令',
      message: '移动平台到指定位置指令已发出!',
      darkTheme: true
    })
    // handleClose()
    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '移动平台到指定位置指令完成',
        vueData.formLabelAlign.sourceName
      )
    }
  })
}

const radio1 = ref('')

const clickRadio = (val) => {
  if (val == '攻击自定义指令') {
    vueData.radioValue = 'fireByRaw'
  } else {
    vueData.radioValue = 'moveToPosition'
  }
  emitter.emit('clearCommandControl', vueData.radioValue)
  if (vueData.radioValue) {
    emitter.emit(vueData.radioValue + 'Change1', true)
  }
}

const resetForm = () => {
  if (vueData.radioValue == 'moveToPosition') {
    toPositionFun()
    emitter.emit('clearCommandControl', vueData.radioValue)
  } else if (vueData.radioValue == 'fireByRaw') {
    confirmScene()
  }
  radio1.value = ''
  vueData.radioValue = ''
  vueData.formLabelAlign = {}
}

const byRawFun = () => {
  // 攻击自定义指令接口
  let params = {
    num: Number(vueData.formLabelAlign.num), //发射数量
    weaponName: vueData.formLabelAlign.weaponName, //武器名称
    pltName: vueData.formLabelAlign.sourceName,
    tgtName: vueData.formLabelAlign.targetName
  }
  byRaw(params).then((res) => {
    // console.log(res)
    window.EarthViewer._container.style.cursor = 'default'
    beautyToast.success({
      title: '导调指令',
      message: '攻击自定义指令已发出!',
      darkTheme: true
    })
    vueData.formLabelAlign = vueData.formData
    handleClose()
    if (res.code == 200) {
      sendToCommandShowResMsg(
        res.data,
        '攻击自定义指令完成',
        vueData.formLabelAlign.sourceName
      )
    }
  })
}

const handleClose = () => {
  let commandControlObj = {
    isShow: false,
    commandFormData: {}
  }
  emitter.emit('showCommandControl', commandControlObj)
  emitter.emit('showFirePanel', commandControlObj)
  tempEntityDel()
  // 删除 流线连线
  // if (vueData.formLabelAlign.targetNameTemp) {
  //   vueData.formLabelAlign.targetName = vueData.formLabelAlign.targetNameTemp
  //   vueData.formLabelAlign.targetNameTemp = ''
  // }
  if (
    vueData.formLabelAlign.command == '列表目标攻击' ||
    vueData.formLabelAlign.command == '攻击指定位置' ||
    vueData.formLabelAlign.command == '攻击自定义' ||
    vueData.formLabelAlign.command == '移动平台到目标距离' ||
    vueData.formLabelAlign.command == '攻击指定目标' ||
    vueData.formLabelAlign.command == '发送干扰弹' ||
    vueData.formLabelAlign.command == '激光定向干扰' ||
    vueData.formLabelAlign.command == '激光欺骗' ||
    vueData.formLabelAlign.command == '伴飞'
  ) {
    store.commit('setRelatedRightClickConfig', false)
    // 删除 流线连线
    window.sceneAction.connectLineManagement.removeCommControlLine({
      sourId: vueData.formLabelAlign.sourceName,
      targetId: vueData.formLabelAlign.targetName
    })
  }
  if (
    vueData.formLabelAlign.command == '列表目标攻击' ||
    vueData.formLabelAlign.command == '攻击指定位置' ||
    vueData.formLabelAlign.command == '攻击自定义' ||
    vueData.formLabelAlign.command == '攻击' ||
    vueData.formLabelAlign.command == '攻击指定目标'
  ) {
    removeEntityCircleById(
      'operationalRadius1' + vueData.formLabelAlign.sourceName
    )
  }
  emitter.emit('clearRedioData')
}

const removeEntityCircleById = (id) => {
  if (window.EarthViewer.entities.getById(id)) {
    window.EarthViewer.entities.removeById(id)
  }
}

const tempEntityDel = () => {
  // 删除连线以及鼠标提示信息
  for (let i = window.EarthViewer.entities.values.length - 1; i >= 0; i--) {
    let entity = window.EarthViewer.entities.values[i]
    if (entity && entity.name && entity.name.indexOf('点闪烁') > -1) {
      window.EarthViewer.entities.remove(entity) //移除
    }
  }
}

const confirmScene = () => {
  if (vueData.formLabelAlign.command == '攻击指定位置') {
    if (!vueData.formLabelAlign.weaponName) {
      beautyToast.warning({
        title: 'Warning',
        message: '请输入武器名称!',
        darkTheme: true
      })
      return false
    }
    if (Number(vueData.formLabelAlign.num) > 0) {
      atPositionFun()
    } else {
      beautyToast.warning({
        title: 'Warning',
        message: '请武器数量为0,不可攻击!',
        darkTheme: true
      })
    }
  } else if (vueData.formLabelAlign.command == '攻击自定义') {
    if (!vueData.formLabelAlign.weaponName) {
      beautyToast.warning({
        title: 'Warning',
        message: '请输入武器名称!',
        darkTheme: true
      })
      return false
    }
    if (Number(vueData.formLabelAlign.num) > 0) {
      byRawFun()
    } else {
      beautyToast.warning({
        title: 'Warning',
        message: '请武器数量为0,不可攻击!',
        darkTheme: true
      })
    }
  } else if (vueData.formLabelAlign.command == '列表目标攻击') {
    if (!vueData.formLabelAlign.targetName) {
      beautyToast.warning({
        title: 'Warning',
        message: '请选择虚兵名称!',
        darkTheme: true
      })
      return false
    }
    if (!vueData.formLabelAlign.weaponName) {
      beautyToast.warning({
        title: 'Warning',
        message: '请输入武器名称!',
        darkTheme: true
      })
      return false
    }
    if (Number(vueData.formLabelAlign.num) > 0) {
      byRawFun()
    } else {
      beautyToast.warning({
        title: 'Warning',
        message: '请武器数量为0,不可攻击!',
        darkTheme: true
      })
    }
  } else if (vueData.formLabelAlign.command == '攻击') {
    if (!vueData.formLabelAlign.weaponName) {
      beautyToast.warning({
        title: 'Warning',
        message: '请输入武器名称!',
        darkTheme: true
      })
      return false
    }
    if (Number(vueData.formLabelAlign.num) > 0) {
      openFireFun()
    } else {
      beautyToast.warning({
        title: 'Warning',
        message: '请武器数量为0,不可攻击!',
        darkTheme: true
      })
    }
  } else if (vueData.formLabelAlign.command == '攻击指定目标') {
    if (!vueData.formLabelAlign.weaponName) {
      beautyToast.warning({
        title: 'Warning',
        message: '请输入武器名称!',
        darkTheme: true
      })
      return false
    }
    if (Number(vueData.formLabelAlign.num) > 0) {
      atTargetFun()
    } else {
      beautyToast.warning({
        title: 'Warning',
        message: '请武器数量为0,不可攻击!',
        darkTheme: true
      })
    }
  } else if (vueData.formLabelAlign.command == '变更平台高度') {
    toAltitudeFun()
  } else if (vueData.formLabelAlign.command == '移动平台到指定位置') {
    toPositionFun()
  } else if (vueData.formLabelAlign.command == '立即改变位置') {
    setPositionFun()
  } else if (vueData.formLabelAlign.command == '移动平台到目标距离') {
    toTargetFun()
  } else if (vueData.formLabelAlign.command == '变更平台传感器频率') {
    if (!vueData.formLabelAlign.sensorName) {
      beautyToast.warning({
        title: 'Warning',
        message: '请输入传感器名称!',
        darkTheme: true
      })
      return false
    }
    toChangeFrequencyFun()
  } else if (vueData.formLabelAlign.command == '变更平台传感器模式') {
    if (!vueData.formLabelAlign.modeValue) {
      beautyToast.warning({
        title: 'Warning',
        message: '请选择传感器模式!',
        darkTheme: true
      })
      return false
    }
    toChangeModeFun()
  } else if (vueData.formLabelAlign.command == '变更平台传感器状态') {
    if (!vueData.formLabelAlign.stateValue) {
      beautyToast.warning({
        title: 'Warning',
        message: '请选择传感器状态!',
        darkTheme: true
      })
      return false
    }
    toChangeStateFun()
  } else if (vueData.formLabelAlign.command == '变更平台干扰状态') {
    toFireTurnOnWeaponFun()
  } else if (vueData.formLabelAlign.command == '激光定向干扰') {
    laserDirectedJammingFun()
  } else if (vueData.formLabelAlign.command == '发送干扰弹') {
    generatingJammerFun()
  } else if (vueData.formLabelAlign.command == '激光欺骗') {
    laserDeceptionFun()
  } else if (vueData.formLabelAlign.command == '伴飞') {
    accompanyingFlightFun()
  } else if (vueData.formLabelAlign.command == '变更平台速度') {
    updateSpeedFun()
  } else if (vueData.formLabelAlign.command == '变更烟雾干扰装置状态') {
    changeInfraredStateFun()
  } else if (vueData.formLabelAlign.command == '发动机故障') {
    breakMoverFun()
  } else if (vueData.formLabelAlign.command == '油料缺失') {
    deficiencyFuelFun()
  } else if (vueData.formLabelAlign.command == '缺失弹药') {
    deficiencyWeaponQuantityFun()
  } else if (vueData.formLabelAlign.command == '飞机起飞') {
    taskOffFun()
  }
}
</script>
<style lang="less" scoped>
.multifunctional {
  width: 100%;
  height: 100%;

  .header {
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .custom-form {
    color: #fff;
    .custom-input {
      height: 20px;
      width: 150px;
    }
  }
  .el-button {
    background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
    width: 50px;
    height: 25px;
    color: #ffff;
    border-radius: 5px;
    margin-left: 10px;
    cursor: pointer;
  }
  .el-button:disabled {
    color: #cccccc;
    border: none;
    cursor: auto;
  }
}
.el-form-item {
  margin-bottom: 4px;
}
:deep(.el-form-item__label) {
  color: #fff !important;
}
.el-form-item__content {
  justify-content: center;
}
.el-input-number--small {
  width: 150px;
}
.radiobutton {
  background: #0494c5 100% 100%;
  color: #fff;
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
}
.el-radio-button__inner {
  background: none;
  color: #fff;
}
::v-deep .el-input.is-disabled .el-input__wrapper {
  background-color: none !important;
}
:deep(.el-input .el-input__wrapper) {
  background-color: rgba(32, 97, 121, 0.45) !important;
}
:deep(.el-radio-button .el-radio-button__inner) {
  background-color: #2d5170;
  color: #fff;
}
:deep(.el-radio-button__original-radio:checked + .el-radio-button__inner) {
  background-color: #0494c5;
  color: #fff;
}
</style>
