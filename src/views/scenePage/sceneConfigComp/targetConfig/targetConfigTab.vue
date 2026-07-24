<!--
 * @description:
 * @Version: 1.0
 * @Author: ZX Li
 * @Date: 2024-01-16 15:47:51
 * @LastEditors: yuqiangqiang yqq@piesat.cn
 * @LastEditTime: 2024-08-21 18:16:23
-->
<template>
  <div class="tabContainer">
    <!-- <el-select
      v-model="state.curSelect"
      class="scene_input"
      placeholder="请选择"
      size="small"
      @change="handleCheckChange"
      clearable
    >
      <el-option
        v-for="item in state.targetList"
        :key="item.value"
        :label="item.name"
        :value="item.value"
      />
    </el-select> -->
    <div class="inputOption">
      <el-form :model="state.formData" label-width="80px">
        <el-form-item label="模拟器">
          <el-select
            v-model="state.formData.simTypeName"
            class="scene_input"
            placeholder="请选择"
            size="small"
            @change="handleChangeSimulator"
            clearable
          >
            <el-option
              v-for="item in state.simList"
              :key="item.simulatorTypeName"
              :label="item.simulatorTypeName"
              :value="item.id"
            />
          </el-select>
          <!-- <el-input v-model="state.formData.targetName"></el-input> -->
        </el-form-item>
        <el-form-item label="目标名称">
          <el-select
            v-model="state.formData.targetName"
            class="scene_input"
            placeholder="请选择"
            size="small"
            @change="handleCheckChange"
            clearable
          >
            <el-option
              v-for="item in state.targetList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
          <!-- <el-input v-model="state.formData.targetName"></el-input> -->
        </el-form-item>
        <el-form-item
          label="阵营"
          v-if="
            state.locaStoreSide == 'admin' ||
            state.locaStoreSide == 'red_zhkz' ||
            state.locaStoreSide == 'admin_ts'
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
              v-for="item in state.sideList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
          <!-- <span style="color: #fff">{{ state.formData.side }}</span> -->
        </el-form-item>
        <!-- <el-form-item label="阵营" v-if="state.locaStoreSide != 'admin'">
          <span style="color: #fff">{{ state.formData.side }}</span>
        </el-form-item> -->
        <el-form-item label="经度">
          <el-input v-model="state.formData.longitude"></el-input>
        </el-form-item>
        <el-form-item label="纬度">
          <el-input v-model="state.formData.latitude"></el-input>
        </el-form-item>
        <el-form-item label="高度">
          <el-input v-model="state.formData.height"></el-input>
        </el-form-item>
        <el-form-item label="航向角">
          <el-input v-model="state.formData.headingAngle"></el-input>
        </el-form-item>
        <el-form-item label="速度">
          <el-input v-model="state.formData.speed"></el-input>
        </el-form-item>
        <el-form-item label="载弹">
          <el-select
            v-model="state.formData.ammunitionCarrier"
            class="scene_input"
            placeholder="请选择"
            size="small"
            clearable
            :disabled="state.disabled"
          >
            <el-option
              v-for="item in state.ammunitionCarrierList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="通讯频率" v-if="state.formData.simTypeName == 1">
          <el-input class="txpl" v-model="state.formData.wcommFreq" /><span
            style="color: #fff"
            >Hz</span
          >
        </el-form-item>
        <el-form-item label="批次" v-if="state.formData.simTypeName == 1">
          <el-input v-model="state.formData.wgroup"></el-input>
        </el-form-item>
        <el-form-item label="起飞机场" v-if="state.formData.simTypeName == 1">
          <el-select
            v-model="state.formData.flyAirPort"
            class="scene_input"
            placeholder="请选择"
            size="small"
          >
            <el-option
              v-for="item in state.flyAirPortList"
              :key="item.value"
              :label="item.name"
              :value="item.value"
            />
          </el-select>
        </el-form-item>
        <!-- <el-form-item label="机载雷达">
          <el-select
            v-model="state.formData.airborneRadar"
            class="scene_input"
            placeholder="请选择"
            size="small"
            clearable
          >
            <el-option label="AESA相控阵雷达" value="AESA相控阵雷达" />
            <el-option label="有源相控阵雷达" value="有源相控阵雷达" />
          </el-select>
        </el-form-item> -->
        <el-form-item label="油量">
          <el-input-number
            v-model="state.formData.OilQuantity"
            :min="1"
            :max="500"
          />
        </el-form-item>
        <el-form-item>
          <label slot="label">
            <span class="fromItemLabel" @click="isShowStaticParame">详情</span>
          </label>
          <div
            class="form_staticParameters"
            v-show="state.showStaticParameters"
          >
            <div v-for="item in state.formData.staticParameters" :key="item">
              {{ item }}
            </div>
          </div>
        </el-form-item>
      </el-form>
    </div>
    <div class="select_btn">
      <el-button type="primary" size="small" @click="state.curSelect = ''"
        >重置</el-button
      >
      <el-button type="primary" size="small" @click="confirmScene"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, defineProps, nextTick, watch } from 'vue'
import {
  createRedItem,
  createBlueItem,
  getSimList,
  getSimTypeList
} from '@/service/directingAdjusting'
import { ElMessage, ElNotification } from 'element-plus'
import { worldPosToGraphic, flyToEntity } from '@/utils/mapTools'
import emitter from '@/utils/eventbus'
import Bubble1 from '@/utils/bubble/dataBubble2'
import store from '@/store/index'
import { directDataInit } from '@/service/simModelCommand'
import { StartSceneRunSetData } from '@/service/SSE'
const props = defineProps({
  tabSelect: {
    type: String,
    default: 'admin'
  }
})
const state = reactive({
  tabSelect: props.tabSelect,
  targetList: [],
  curSelect: '',
  formData: {
    side: 'red',
    targetName: '',
    // longitude: '126.554115',
    // latitude: '43.851465',
    longitude: 126.8938, //拉林机场位置
    latitude: 45.27305,
    height: '3920.153176',
    headingAngle: 0,
    speed: '0.5',
    ammunitionCarrier: '',
    airborneRadar: '',
    OilQuantity: 1,
    staticParameters: [
      '机身长21.2米，高4.69米，翼展13.01米',
      '最大飞行速度2.0马赫',
      '最大起飞重量约37吨',
      '最大航程约4000公里',
      '最大作战半径约1500公里'
    ],
    simTypeName: '',
    wcommFreq: '',
    wgroup: '',
    flyAirPort: ''
  },
  sideList: [
    { name: '红方', value: 'red' },
    { name: '蓝方', value: 'blue' },
    { name: '绿方', value: 'green' }
  ],
  ammunitionCarrierList: [
    { name: 'PL-15中距离空空导弹', value: 0 },
    { name: 'PL-10近距离格斗导弹', value: 1 }
  ],
  simList: [
    {
      simulatorTypeName: '模拟器1(哈飞院)',
      id: 1
    },
    {
      simulatorTypeName: '模拟器2(操纵杆)',
      id: 2
    }
  ],
  locaStoreSide: '',
  showStaticParameters: false,
  disabled: false,
  equipmentConfig: {
    Y8: {
      staticParameters: [
        '起飞机场:拉林',
        '机身长21.2米，高4.69米，翼展13.01米',
        '最大飞行速度2.0马赫',
        '最大起飞重量约37吨',
        '最大航程约4000公里',
        '最大作战半径约1500公里'
      ],
      OilQuantity: 500
    },
    normal: {
      staticParameters: [
        '机身长21.2米，高4.69米，翼展13.01米',
        '最大飞行速度2.0马赫',
        '最大起飞重量约37吨',
        '最大航程约4000公里',
        '最大作战半径约1500公里'
      ],
      OilQuantity: 1
    }
  },
  flyAirPortList: [],
  curSimulatorName: '' //当前选中模拟器名称
})

const handleCheckChange = (itemValue) => {
  //state.formData.side = ''
  if (itemValue) {
    // 选择的目标
    let selectTarget = state.targetList.find((item) => item.value == itemValue)
    state.curSimulatorName = selectTarget.name
    //state.formData.side = selectTarget.type == 'red' ? '红方' : '蓝方'
    if (selectTarget.name == 'Y8' || selectTarget.name == 'Y9') {
      state.formData.ammunitionCarrier = ''
      state.disabled = true
      if (selectTarget.name == 'Y8') {
        state.formData.flyAirPort = '8'
      } else {
        state.formData.flyAirPort = '7'
      }
    } else {
      if (selectTarget.name == '教10') {
        state.formData.flyAirPort = '7'
      }
      state.disabled = false
    }
    if (selectTarget.name == 'Y8') {
      state.formData.staticParameters =
        state.equipmentConfig[selectTarget.name].staticParameters
      state.formData.OilQuantity =
        state.equipmentConfig[selectTarget.name].OilQuantity
    } else {
      state.formData.staticParameters =
        state.equipmentConfig['normal'].staticParameters
      state.formData.OilQuantity = state.equipmentConfig['normal'].OilQuantity
    }
  }
}
const confirmScene = () => {
  // 选择的目标
  let selectTarget = state.targetList.find(
    (item) => item.value == state.formData.targetName
  )
  if (!selectTarget) {
    ElMessage.warning('请选择目标名称!')
  }
  if (state.formData.simTypeName == 1) {
    // setTimeout(() => {
    //   setSimulator(state.formData.targetName)//定位模拟器
    // }, 1200)

    // 具体加到czml中，起飞时
    // 增加模拟器数入库，必须调用该接口，才能接受模拟器MU位置数据，否则模拟器z   messageId ---> 场景ID,startStu true--->存
    StartSceneRunSetData({
      messageId: sessionStorage.getItem('taskId'),
      startStu: true
    }).then((res) => {
      if (res.code == 200) {
        if (res.data) {
          store.commit('setSceneReplayId', res.data)
        }
        setTimeout(() => {
          setSimulator(state.formData.targetName) //定位模拟器
        }, 1200)
      } else {
        ElMessage.warning('模拟器' + state.curSimulatorName + '添加失败!')
      }
    })
    //哈飞院模拟器
    // let params = {
    //   dbLat: Number(state.formData.latitude), //纬度
    //   dbLong: Number(state.formData.longitude), //经度
    //   fheight: Number(state.formData.height), //高度
    //   fpsi: Number(state.formData.headingAngle), //航向角
    //   name: state.formData.targetName,
    //   side: state.formData.side, //阵营
    //   wairportNo: Number(state.formData.flyAirPort), //起飞机场编号
    //   warmSet: Number(state.formData.ammunitionCarrier), //挂载方案
    //   wcommFreq: Number(state.formData.wcommFreq), //通讯频率
    //   wgroup: Number(state.formData.wgroup), //批次
    //   wtype: store.state.sceneModule.wtypeObj['初始化']
    // }
    // directDataInit(params)
    //   .then((res) => {
    //     if (res.code == 200) {
    //       emitter.emit('closeBottomControlPanel', 'three') //关闭导调面板
    //       ElMessage({
    //         type: 'success',
    //         message: '模拟器初始化导调成功'
    //       })
    //     } else {
    //       ElMessage({
    //         type: 'error',
    //         message: '模拟器初始化导调失败'
    //       })
    //     }
    //   })
    //   .catch((e) => {
    //     ElMessage({
    //       type: 'error',
    //       message: '模拟器初始化导调失败'
    //     })
    //   })
  } else {
    let param = {
      height: state.formData.height,
      itemName: state.formData.simTypeName,
      itemTypeCode: 'aircraft',
      lat: state.formData.latitude,
      lng: state.formData.longitude,
      entityID: state.formData.targetName //模拟器id名称
    }
    if (selectTarget.type == 'red') {
      createRedItem(param)
        .then((res) => {
          if (res.code == 200) {
            emitter.emit('closeBottomControlPanel', 'three') //关闭导调面板
            ElMessage.success(res.data)
            let panelBg = [57, 173, 209]
            if (state.formData.side == 'red') {
              panelBg = [225, 82, 88]
            } else if (state.formData.side == 'green') {
              panelBg = [175, 247, 170]
            } else {
              panelBg = [57, 173, 209]
            }
            flyToEntity({
              name: state.formData.targetName,
              id: 'PursuitFighter_2',
              rgb: panelBg
            })
          } else {
            ElMessage.error('导调失败')
          }
        })
        .catch((e) => {
          ElMessage.error('导调失败!')
        })
    } else {
      createBlueItem(param)
        .then((res) => {
          if (res.code == 200) {
            emitter.emit('closeBottomControlPanel', 'three') //关闭导调面板
            ElMessage.success(res.data)
            let curSeat = window.localStorage.getItem('side') // 获取当前席位
            let fontColorRgb = []
            if (curSeat == 'admin' || curSeat == 'admin_ts') {
              fontColorRgb = store.getters.getBubbleFontColorAdmin
            } else {
              fontColorRgb = store.getters.getBubbleFontColor
            }
            let panelBg = [57, 173, 209]
            if (state.formData.side == 'red') {
              panelBg = [225, 82, 88]
            } else if (state.formData.side == 'green') {
              panelBg = [175, 247, 170]
            } else {
              panelBg = [57, 173, 209]
            }
            flyToEntity({
              name: state.formData.targetName,
              id: 'BlueFighter_2',
              rgb: panelBg,
              fontColorRgb: fontColorRgb
            })
          } else {
            ElMessage.error('导调失败')
          }
        })
        .catch((e) => {
          ElMessage.error('导调失败!')
        })
    }
  }
}
watch(
  () => props.tabSelect,
  (newValue) => {
    selectTab(newValue)
  }
)
const selectTab = (val) => {
  state.formData.simTypeName = ''
  state.targetList = []
  state.formData.targetName = ''
  state.formData.side = ''
  state.tabSelect = val
  switch (val) {
    case 'admin':
    case 'admin_ts':
      state.targetList = [
        // {
        //   name: 'J-20',
        //   value: 'J-200',
        //   type: 'red'
        // },
        // {
        //   name: 'J-16',
        //   value: 'J-16',
        //   type: 'red'
        // },
        // {
        //   name: 'J-11',
        //   value: 'J-11',
        //   type: 'red'
        // },
        // {
        //   name: 'J-10',
        //   value: 'J-10',
        //   type: 'red'
        // },
        // {
        //   name: 'Y8-3',
        //   value: 'Y8-3',
        //   type: 'red'
        // },
        // {
        //   name: 'F-22',
        //   value: 'F-22',
        //   type: 'blue'
        // },
        // {
        //   name: 'F-35',
        //   value: 'F-35',
        //   type: 'blue'
        // }
      ]
      break
    case 'red':
      state.targetList = [
        // {
        //   name: 'J-20',
        //   value: 'J-20',
        //   type: 'red'
        // },
        // {
        //   name: 'J-16',
        //   value: 'J-16',
        //   type: 'red'
        // },
        // {
        //   name: 'J-11',
        //   value: 'J-11',
        //   type: 'red'
        // },
        // {
        //   name: 'J-10',
        //   value: 'J-10',
        //   type: 'red'
        // }
      ]
      break
    case 'blue':
      state.targetList = [
        // {
        //   name: 'F-16',
        //   value: 'F-22',
        //   type: 'blue'
        // },
        // {
        //   name: 'F-22',
        //   value: 'F-22',
        //   type: 'blue'
        // },
        // {
        //   name: 'F-35',
        //   value: 'F-35',
        //   type: 'blue'
        // }
      ]
      break
    default:
      break
  }
}
//获取场景模拟器类型列表
const getSimListData = () => {
  getSimTypeList().then((res) => {
    if (res.code == 200) {
      state.simList = res.data
    }
  })
}
const handleChangeSimulator = (item) => {
  state.targetList = []
  state.formData.targetName = ''
  state.formData.side = 'red'

  // state.formData.side = ''  暂时都改为 red
  // admin 登陆 切换页签白方 -- 白方，其它判断切换哪个页签 --- 哪方
  // 非 admin登陆 依据登陆用户 阵营 --- 哪方
  // 阵营，0白方，1红方，2蓝方
  let camp = 0
  if (
    (state.locaStoreSide == 'admin' && state.tabSelect == 'admin') ||
    (state.locaStoreSide == 'admin_ts' && state.tabSelect == 'admin_ts')
  ) {
    camp = 0
  } else if (
    state.locaStoreSide == 'admin' &&
    state.locaStoreSide == 'admin_ts' &&
    state.tabSelect != 'admin' &&
    state.tabSelect != 'admin_ts'
  ) {
    camp = state.tabSelect == 'red_zhkz' ? 1 : state.tabSelect == 'red' ? 1 : 2
  } else {
    camp =
      state.locaStoreSide == 'admin' || state.locaStoreSide == 'admin_ts'
        ? 0
        : state.locaStoreSide == 'red_zhkz'
        ? 1
        : 2
  }

  getSimList({ simTypeId: item, camp: camp }).then((res) => {
    if (res.code == 200) {
      let listArr = []
      res.data.forEach((item) => {
        let typeSide = ''
        if (
          item.simulatorEntityName == 'J16' ||
          item.simulatorEntityName == 'J10' ||
          item.simulatorEntityName == 'Y8' ||
          item.simulatorEntityName == 'Y9' ||
          item.simulatorEntityName == 'Jiao10' ||
          item.simulatorEntityName == 'H6H'
        ) {
          typeSide = 'red'
        } else {
          typeSide = 'blue'
        }
        listArr.push({
          name: item.simulatorEntityName,
          value: item.simulatorEntityName,
          type: typeSide
        })
      })
      state.targetList = listArr
      if (item == 1) {
        state.targetList = simModelList
      }
    }
  })
}

const isShowStaticParame = () => {
  state.showStaticParameters = !state.showStaticParameters
}

onMounted(() => {
  nextTick(() => {
    state.flyAirPortList = airPortsList
    state.locaStoreSide = window.localStorage.getItem('side')
    selectTab(props.tabSelect)
    getSimListData()
  })
})
//显示模拟器飞机并定位，显示详标牌和锁定效果
const setSimulator = (id) => {
  let entity = window.EarthPlugn.entity._GetCZMLEntity(
    id,
    'MSIMEarthCZMLProcessContainer'
  )
  if (!entity) {
    console.log('场景中未找到模拟器' + state.curSimulatorName)
    return
  }
  let simModelMnq = getSimModelListArrValue(id, simModelList)
  // 控制 模拟器是否显示到地图上
  simModelMnq.showType = true
  entity.show = true
  ElMessage({
    type: 'success',
    message: '模拟器' + state.curSimulatorName + '添加成功!'
  })
  // 计数重置
  store.state.sceneModule.mnqPauseStateShow[state.curSimulatorName] = 1
  // 增加高亮显示
  let setHightLightVal = window.setInterval(() => {
    if (entity) {
      if (!entity.position) return
      let entityPos = entity.position._value
        ? entity.position._value
        : entity.position.getValue(window.EarthViewer.clock.currentTime)
      if (!entityPos) return
      if (
        typeof entityPos.x === 'undefined' ||
        typeof entityPos.y === 'undefined' ||
        typeof entityPos.z === 'undefined'
      ) {
        return
      }
      let simModelPos = worldPosToGraphic(entityPos)
      if (simModelPos) {
        // 只在三维下显示
        if (window.EarthViewer.scene.mode == 3) {
          hightLightSimModel(simModelPos, id, 800, 30000)
        }
        window.clearInterval(setHightLightVal)
        setHightLightVal = null
      }
    }
  }, 1000)
  setTimeout(() => {
    if (setHightLightVal) {
      window.clearInterval(setHightLightVal)
      setHightLightVal = null
    }
  }, 5000)

  let panelBg = [57, 173, 209]
  if (state.formData.side == 'red') {
    panelBg = [225, 82, 88]
  } else if (state.formData.side == 'green') {
    panelBg = [175, 247, 170]
  } else {
    panelBg = [57, 173, 209]
  }
  flyToEntity({
    id: id,
    rgb: panelBg,
    fontColorRgb: store.getters.getBubbleFontColor,
    isShowSilhouette: true,
    // silhouetteSize: 5,
    // silhouetteColor: window.MSIMEarth.Color.YELLOW,
    name: state.curSimulatorName
  })
  setTimeout(() => {
    //锁定目标效果
    window.sceneAction.planeCzmlManage.createLockSprite({
      sourId: id
    })
    setTimeout(() => {
      //移除锁定效果
      window.sceneAction.planeCzmlManage.revmoeLockEntity(id)
    }, 5000)
  }, 3000)
}

/*
 *添加半球离子层闪烁并动态改变位置效果
 *pos：初始位置；id:czml的id;flickerTime:闪烁时间;endTime:移除时间
 */
const hightLightSimModel = (pos, id, flickerTime, endTime) => {
  // 此效果在三维模式下展示
  if (window.MSIMEarth.SceneMode !== 3) return
  //初始化材质
  let cusP = new window.EarthPlugn.customPritive(
    window.MSIMEarth,
    window.EarthViewer
  )
  let winston = cusP.createWinstonHalf(
    [1700, 1700, 1700],
    [pos.lng, pos.lat, pos.height],
    {
      color: new window.MSIMEarth.Color(255 / 255, 0 / 255, 0 / 255, 1.0),
      id: 'primitive_virtual_' + id
    }
  )
  window.EarthViewer.scene.primitives.add(winston)
  let targetHalfBall = null //当前的半球离子primitive对象
  window.EarthViewer.scene.primitives._primitives.forEach((p) => {
    if (p.id && p.id === 'primitive_virtual_' + id) {
      targetHalfBall = p
    }
  })
  //设置闪烁
  let setVal = window.setInterval(() => {
    if (targetHalfBall) {
      targetHalfBall.show = !targetHalfBall.show
    }
  }, flickerTime)
  function updatePos() {
    if (cusP) {
      cusP.updateModelMatrix('primitive_virtual_' + id, id)
    }
  }
  window.EarthViewer.scene.preUpdate.addEventListener(updatePos)
  //移除监听事件
  setTimeout(() => {
    window.EarthViewer.scene.preUpdate.removeEventListener(updatePos)
    window.clearInterval(setVal)
    setVal = null
    cusP.clear('primitive_virtual_' + id)
  }, endTime)
}

// 查找 模拟器ID
const getSimModelListArrValue = (curData, datasArr) => {
  const i = datasArr.findIndex((item) => {
    return item.value == curData
  })
  return datasArr[i] ? datasArr[i] : null
}
</script>

<style lang="less" scoped>
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

  :deep(.el-select) {
    --el-select-border-color-hover: transparent !important;
    --el-select-input-focus-border-color: transparent !important;
  }

  :deep(.el-input__wrapper:hover) {
    border: none !important;
    box-shadow: none;
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

.tabContainer {
  padding: 15px;
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

  .fromItemLabel {
    color: #fff;
    cursor: pointer;
    margin-left: -50px !important;
  }

  .form_staticParameters {
    color: white;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

.select_btn {
  display: flex;
  justify-content: flex-end;

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

:deep(.el-form-item) {
  margin-bottom: 10px;
}

.txpl {
  width: 70%;
}
</style>
