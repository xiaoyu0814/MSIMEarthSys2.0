<template>
  <div
    class="conclusion-plan animate__animated animate__fadeIn animate__delay-200s"
  >
    <div class="content-title">模拟器攻击</div>
    <img
      src="@/assets/image/panelIcons/关闭icon.png"
      alt=""
      class="close_sty"
      @click="handleClose"
    />
    <div class="content">
      <el-row>
        <el-col :span="9">
          <ul class="simulatorList">
            <li
              :class="{ active: state.isActive == 'Y8' }"
              @click="getAttackList('Y8')"
            >
              Y8
            </li>
            <li
              :class="{ active: state.isActive == 'Y9' }"
              @click="getAttackList('Y9')"
            >
              Y9
            </li>
            <li
              :class="{ active: state.isActive == '教10' }"
              @click="getAttackList('教10')"
            >
              教10
            </li>
          </ul>
        </el-col>
        <el-col :span="9">
          <ul class="attackList">
            <li
              :class="{ active: state.isActive2 == value.name }"
              @click="getAttackObj(value)"
              v-for="(value, index) in state.attackListData"
              :key="index"
            >
              {{ value.name }}
            </li>
          </ul>
        </el-col>
        <el-col :span="6">
          <div class="btns">
            <el-button type="primary" @click="attrackObj">攻击</el-button>
            <el-button type="primary" @click="cancel">取消</el-button>
          </div>
        </el-col>
      </el-row>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'
import emitter from '@/utils/eventbus'
import store from '@/store'
import {
  getIsInsideCircleByPoint,
  worldPosToGraphic,
  showSysMessage
} from '@/utils/mapTools'
import { ElMessage, ElMessageBox } from 'element-plus'
import { byRaw } from '@/service/command'
import { getIsTrackTarget } from '@/service/command'
const state = reactive({
  attackListData: [],
  curSimulator: '', //当前选中模拟器
  curAttackObj: '', //当前选中被模拟器攻击对象
  isActive: '',
  isActive2: ''
})

onMounted(() => {})

// watch(
//   () => store.state.sceneModule.startingFalseInfo,
//   (newVal) => {
//     state.formContent.redForce = newVal.red.typeOfEquipment
//     state.formContent.blueForce = newVal.blue.typeOfEquipment
//   }
// )
const handleClose = () => {
  emitter.emit('closeBottomControlPanel', 'three')
}
//获取攻击范围内的蓝方实体列表
const getAttackList = (value) => {
  state.isActive = value
  state.attackListData = []
  if (value == 'Y8') {
    state.curSimulator = '<dis>2:3:13'
  } else if (value == 'Y9') {
    state.curSimulator = '<dis>2:3:12'
  } else if (value == '教10') {
    state.curSimulator = '<dis>2:3:10'
  }
  let sourcePositionArr = []
  //获取当前选中模拟器位置
  let entity = window.EarthPlugn.entity._GetCZMLEntity(
    state.curSimulator,
    'MSIMEarthCZMLProcessContainer'
  )
  if (!entity) {
    ElMessage.warning('场景中未找到' + value + '模拟器')
  }
  if (entity) {
    let curPos = entity.position.getValue(window.EarthViewer.clock.currentTime)
    if (!window.MSIMEarth.defined(curPos)) return
    let degrees = worldPosToGraphic(curPos) //获取模拟器当前位置
    sourcePositionArr[0] = degrees.lng
    sourcePositionArr[1] = degrees.lat
  }
  getMuAttackObj(sourcePositionArr)
  getStaticAttackObj(sourcePositionArr)
}
//获取在攻击范围内的动态目标实体
const getMuAttackObj = (sourcePositionArr) => {
  let enPositionArr = []
  //获取场景中所有实体的位置
  for (let x = 0; x < EarthAPP.elementArr.length; x++) {
    let entity = window.EarthPlugn.entity._GetCZMLEntity(
      EarthAPP.elementArr[x],
      'MSIMEarthCZMLProcessContainer'
    )
    let entityName = entity.description.getValue()
    let side = entity.properties._airplaneAction.getValue().side
    if (
      entity &&
      side == 'blue' &&
      (entityName.indexOf('弹') < 0 ||
        entityName.indexOf('AASM') < 0 ||
        entityName.indexOf('AGM') < 0)
    ) {
      let curPos = entity.position.getValue(
        window.EarthViewer.clock.currentTime
      )
      if (!window.MSIMEarth.defined(curPos)) return
      let degrees = worldPosToGraphic(curPos) //获取场景中实体当前位置
      enPositionArr[0] = degrees.lng
      enPositionArr[1] = degrees.lat

      if (sourcePositionArr.length > 0 && enPositionArr.length > 0) {
        //判断是否在攻击范围内，攻击范围设置为100000
        let isSideCircle = getIsInsideCircleByPoint(
          [sourcePositionArr[0], sourcePositionArr[1]],
          100000,
          [enPositionArr[0], enPositionArr[1]]
        )
        //
        if (isSideCircle) {
          state.attackListData.push({
            name: entityName,
            value: EarthAPP.elementArr[x]
          })
        }
      }
    }
  }
}
//获取在攻击范围内的静态蓝方目标
const getStaticAttackObj = (sourcePositionArr) => {
  let enPositionArr2 = []
  for (let i = 0; i < EarthAPP.labelCollection.length; ++i) {
    let longName = EarthAPP.labelCollection.get(i).name.split('&&')
    let id = longName[0]
    let side = longName[1]
    if (window.EarthViewer.entities.getById(id) && side == 'blue') {
      let pos = EarthAPP.labelCollection.get(i).position
      let degrees = worldPosToGraphic(pos) //获取模拟器当前位置
      enPositionArr2[0] = degrees.lng
      enPositionArr2[1] = degrees.lat
      if (sourcePositionArr.length > 0 && enPositionArr2.length > 0) {
        //判断是否在攻击范围内，攻击范围设置为100000
        let isSideCircle = getIsInsideCircleByPoint(
          [sourcePositionArr[0], sourcePositionArr[1]],
          100000,
          [enPositionArr2[0], enPositionArr2[1]]
        )
        //
        if (isSideCircle) {
          state.attackListData.push({
            name: EarthAPP.labelCollection.get(i).text,
            value: id
          })
        }
      }
    }
  }
}
//获取选中模拟器id
const getAttackObj = (value) => {
  let id = value.value
  state.curAttackObj = id
  state.isActive2 = value.name
}
//攻击
const attrackObj = async () => {
  let isTrackTarget = await getIsTrackTargetFun(
    state.curSimulator,
    state.curAttackObj
  )
  if (isTrackTarget) {
    byRawFun()
  }
}
const byRawFun = () => {
  // 攻击自定义指令接口
  let params = {
    num: 1, //发射数量
    weaponName: 'mrm', //武器名称
    pltName: state.curSimulator, //发射武器平台
    tgtName: state.curAttackObj //被攻击目标
  }
  byRaw(params).then((res) => {
    // console.log(res)
    window.EarthViewer._container.style.cursor = 'default'
    beautyToast.success({
      title: '导调指令',
      message: '攻击自定义指令已发出!',
      darkTheme: true
    })
    if (res.code == 200) {
      handleClose()
      //sendToCommandShowResMsg(res.data, '攻击自定义指令完成',sourceName)
      let colorC = new window.MSIMEarth.Color(0, 255 / 255, 255 / 255, 1)

      // 增加攻击时两机的距离
      let params = {
        sourId: state.curSimulator,
        targetId: state.curAttackObj, //被攻击对象
        color: colorC,
        type: 'RE_Distance_LiuDLine',
        width: 10,
        show: true
      }
      window.sceneAction.connectLineManagement.addDashLine(params)
      //8秒后移除连线
      setTimeout(() => {
        let linkId = `${params.type}==${params.sourId}==${params.targetId}`
        let hasLink = window.EarthViewer.entities.getById(linkId)
        if (hasLink) window.EarthViewer.entities.removeById(linkId)
      }, 8000)
      // window.sceneAction.connectLineManagement.sourAndTargetDistanceLabel({
      //   sourId: state.curSimulator,
      //   targetId: state.curAttackObj,
      //   color: colorC,
      //   type: 'RE_Distance',
      //   show: true
      // })
    } else {
    }
  })
}
//通过后台接口判断是否能被探测到，探测到才能发射武器
const getIsTrackTargetFun = async (fireName, targetName) => {
  // 获取平台探测状态
  let params = {
    FireName: fireName,
    TargetName: targetName //被攻击对象
  }
  let res = await getIsTrackTarget(params)
  if (res.code == 200) {
    beautyToast.success({
      title: '导调指令',
      message: '平台探测状态指令已发出!',
      darkTheme: true
    })
    if (res.data['IsSendToCommand'] == 'true') {
      let controlResData = JSON.parse(res.data.data)
      if (controlResData && Object.keys(controlResData).length > 0) {
        if (controlResData.status == 'success') {
          showSysMessage(fireName, '平台可以探测到!')
          return true
        } else {
          ElMessage({
            type: 'error',
            message: '导调指令：平台探测不到!'
          })
          clearCommandControlFun()
          emitter.emit('clearRedioData')
          return false
        }
      }
    }
  }
}
//取消
const cancel = () => {
  handleClose()
}
</script>

<style lang="less" scoped>
.conclusion-plan {
  position: absolute;
  top: 12%;
  left: 50%;
  transform: translate(-50%, 0%);

  z-index: 0;
  width: 910px;
  color: #eee;
  background: url('@/assets/image/panelIcons/背景.png') no-repeat;
  background-size: 100% 100%;
  border: 1px solid rgba(117, 252, 255, 0.8);
  border-radius: 4px;
  backdrop-filter: blur(1px);
  // animation: zoomIn 0.4s;

  .content-title {
    background: url('@/assets/image/panelIcons/title-bg3.png') no-repeat;
    background-size: 100.1% 48px;
    height: 40px;
    line-height: 48px;
    font-size: 25px;
    color: #ffffff;
    letter-spacing: 2.4px;
    font-weight: 400;
    text-align: left;
    padding-left: 90px;
  }

  .close_sty {
    cursor: pointer;
    position: absolute;
    top: 10px;
    right: 20px;
    width: 20px;
    height: 20px;
  }

  .content {
    .simulatorList,
    .el-row .attackList {
      border-right: 1px solid #fff;
      height: 373px;

      li {
        font-size: 18px;
        margin-top: 10px;
        cursor: pointer;
        padding: 5px;
      }

      height: 400px;
      overflow: auto;
    }

    .btns {
      position: absolute;
      right: 20px;
      bottom: 20px;
    }
  }

  .active {
    background: rgba(255, 255, 255, 0.1);
  }
}
</style>
