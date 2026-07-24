<template>
  <div class="main_bottom">
    <el-carousel
      :autoplay="false"
      indicator-position="none"
      arrow="always"
      pause-on-hover
      height="100%"
    >
      <el-carousel-item>
        <quickArbitration @JCFXData="getJCFXData" />
      </el-carousel-item>
      <el-carousel-item>
        <div class="main_top_middle_bottom_echarts1">
          <img src="~@/assets/images/infoStatistics/main_top_bottom.png" />
          <div class="main_bottom_t_l_title">战损统计</div>
          <div class="LossesCountBox">
            <div style="width: 40%">
              <div>
                <span>红方战损:</span>
                <span>{{ state.LossesData.redCount }}</span>
              </div>
              <div>
                <span
                  v-for="(item, key, index) in state.LossesData.redCountByType"
                  style="padding: 0 10px"
                >
                  <span>{{ key }}</span>
                  <span>:</span>
                  <span>{{ item }}</span>
                </span>
              </div>
            </div>
            <div style="width: 40%">
              <div>
                <span>蓝方战损:</span>
                <span>{{ state.LossesData.blueCount }}</span>
              </div>
              <div>
                <span
                  v-for="(item, key, index) in state.LossesData.blueCountByType"
                  style="padding: 0 10px"
                >
                  <span>{{ key }}</span>
                  <span>:</span>
                  <span>{{ item }}</span>
                </span>
              </div>
            </div>
          </div>
          <div class="main_bottom_t_l_con_left">
            <div id="threeTasksId" class="main_top_echarts_pie"></div>
          </div>
        </div>
        <div
          class="main_top_middle_bottom_echarts1 main_top_middle_bottom_echarts_right"
        >
          <img src="~@/assets/images/infoStatistics/main_top_bottom.png" />
          <div class="main_bottom_t_l_title">战果统计</div>
          <div class="main_bottom_t_l_con_right">
            <div id="publicityId" class="main_top_echarts_pie_left"></div>
            <div class="main_top_echarts_pie_right">
              <div class="main_top_echarts_pie_right_top">
                <div class="header">红方</div>
                <el-scrollbar height="calc(100% - 28px)">
                  <el-descriptions :column="2" border>
                    <template #extra>
                      <div style="width: 200px">
                        <span style="color: white">选择平台：</span>
                        <el-select
                          v-model="state.lossesData_red"
                          clearable
                          @change="changePlatform"
                          value-key="platName"
                          size="small"
                          style="width: 100px"
                        >
                          <el-option
                            v-for="item in state.lossesData_results.red"
                            :key="item.platName"
                            :label="item.platNameCN"
                            :value="item"
                          />
                        </el-select>
                      </div>
                    </template>
                    <el-descriptions-item label="名称">{{
                      state.lossesData_red.platNameCN
                    }}</el-descriptions-item>
                    <el-descriptions-item label="使用武器">{{
                      state.lossesData_red.platWeapon
                    }}</el-descriptions-item>
                    <el-descriptions-item label="挂载武器">
                      <span
                        v-for="item in state.lossesData_red.weaponSet"
                        :key="item"
                        >{{ item }}，</span
                      >
                    </el-descriptions-item>
                    <el-descriptions-item label="摧毁">{{
                      state.lossesData_red.HitCounts
                    }}</el-descriptions-item>
                    <el-descriptions-item label="摧毁对象">
                      <span
                        v-for="item in state.lossesData_red.weaponList[0]
                          .targetList"
                        :key="item"
                      >
                        {{ item.tNameCN }}，
                      </span>
                    </el-descriptions-item>
                  </el-descriptions>
                </el-scrollbar>
              </div>
              <div class="main_top_echarts_pie_right_bottom">
                <div class="header">蓝方</div>
                <el-scrollbar height="calc(100% - 28px)">
                  <el-descriptions :column="2" border>
                    <template #extra>
                      <div style="width: 200px">
                        <span style="color: white">选择平台：</span>
                        <el-select
                          v-model="state.lossesData_blue"
                          clearable
                          @change="changePlatform"
                          value-key="platName"
                          size="small"
                          style="width: 100px"
                        >
                          <el-option
                            v-for="item in state.lossesData_results.blue"
                            :key="item.platName"
                            :label="item.platNameCN"
                            :value="item"
                          />
                        </el-select>
                      </div>
                    </template>
                    <el-descriptions-item label="名称">{{
                      state.lossesData_blue.platNameCN
                    }}</el-descriptions-item>
                    <el-descriptions-item label="使用武器">{{
                      state.lossesData_blue.platWeapon
                    }}</el-descriptions-item>
                    <el-descriptions-item label="挂载武器">
                      <span
                        v-for="item in state.lossesData_blue.weaponSet"
                        :key="item"
                        >{{ item }}，</span
                      >
                    </el-descriptions-item>
                    <el-descriptions-item label="摧毁">{{
                      state.lossesData_blue.HitCounts
                    }}</el-descriptions-item>
                    <el-descriptions-item label="摧毁对象">
                      <span
                        v-for="item in state.lossesData_blue.weaponList[0]
                          .targetList"
                        :key="item"
                      >
                        {{ item.tNameCN }}，
                      </span>
                    </el-descriptions-item>
                  </el-descriptions>
                </el-scrollbar>
              </div>
            </div>
          </div>
        </div>
      </el-carousel-item>
      <el-carousel-item>
        <div class="main_bottom_top_list" style="width: 20%">
          <img src="~@/assets/images/infoStatistics/main_top_bottom.png" />
          <!-- <div class="main_bottom_t_l_title">装备列表</div> -->
          <div class="main_bottom_t_l_con">
            <!-- <el-scrollbar height="100%">
              <ul>
                <li></li>
              </ul>
            </el-scrollbar> -->
            <div class="red_SXTJ">
              <header>
                <span>红方单兵实时数据：</span>
                <el-select
                  v-model="state.red_SXTJ"
                  clearable
                  @change="redSXTJ"
                  size="small"
                  style="width: 200px"
                >
                  <el-option
                    v-for="item in state.red_SXTJList"
                    :key="item.name"
                    :label="item.labelName"
                    :value="item.name"
                  />
                </el-select>
              </header>
              <ul class="content">
                <li class="fuelBox" v-if="state.redCGFfuel">
                  <span>油量：</span>
                  <span>{{ state.redCGFfuel }}</span>
                </li>
                <li
                  class="weaponBox"
                  v-for="(item, index) in state.redCGFWeapon"
                  :key="index"
                >
                  <span style="margin-right: 20px">名称：{{ item.Name }}</span>
                  <span>数量：{{ item.Quantity }}</span>
                </li>
              </ul>
            </div>
            <div class="blue_SXTJ">
              <header>
                <span>蓝方单兵实时数据：</span>
                <el-select
                  v-model="state.blue_SXTJ"
                  clearable
                  @change="blueSXTJ"
                  size="small"
                  style="width: 200px"
                >
                  <el-option
                    v-for="item in state.blue_SXTJList"
                    :key="item.name"
                    :label="item.labelName"
                    :value="item.name"
                  />
                </el-select>
              </header>
              <ul class="content">
                <li class="fuelBox" v-if="state.blueCGFfuel">
                  <span>油量：</span>
                  <span>{{ state.blueCGFfuel }}</span>
                </li>
                <li
                  class="weaponBox"
                  v-for="(item, index) in state.blueCGFWeapon"
                  :key="index"
                >
                  <span style="margin-right: 20px">名称：{{ item.Name }}</span>
                  <span>数量：{{ item.Quantity }}</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div style="height: 100%">
          <div style="height: 50%">
            <div class="main_bottom_top_list">
              <img
                src="~@/assets/images/infoStatistics/main_bootm_middle.png"
              />
              <div
                class="main_bottom_b_title1"
                @click.stop="state.oilVolumeComparison_dialog = true"
              >
                <!-- 飞行阶段油耗分析 -->红方油量
              </div>
              <div class="headerBox" v-if="false">
                <span>选择平台：</span>
                <el-select
                  v-model="state.planform"
                  clearable
                  @change="changePlatform"
                  value-key="type"
                  size="small"
                >
                  <el-option
                    v-for="item in state.planformList"
                    :key="item.type"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>
              </div>
              <div
                id="duibi1"
                class="main_bottom_b_con main_bottom_b_con2"
              ></div>
            </div>
            <div class="main_bottom_top_list">
              <img
                src="~@/assets/images/infoStatistics/main_bootm_middle.png"
              />
              <div
                class="main_bottom_b_title1"
                @click="state.ammunitionComparison_dialog = true"
              >
                <!-- 机型油耗对比 -->蓝方油量
              </div>
              <div class="headerBox" v-if="false">
                <span>选择属方：</span>
                <el-select
                  v-model="state.side"
                  clearable
                  @change="changeSide"
                  size="small"
                >
                  <el-option
                    v-for="(item, index) in state.sideList"
                    :key="index"
                    :label="item.label"
                    :value="item.value"
                  />
                </el-select>
              </div>
              <div
                id="duibi2"
                class="main_bottom_b_con main_bottom_b_con2"
              ></div>
            </div>
          </div>
          <div class="main_bottom_bottom">
            <div class="main_bottom_b_left">
              <img
                src="~@/assets/images/infoStatistics/main_bottom_bottom.png"
              />
              <div
                class="main_bottom_b_title1"
                @click="state.actionTrack_dialog = true"
              >
                <!-- 弹药消耗趋势 -->红方弹药
              </div>
              <div class="headerBox" v-if="false">
                <span>选择平台：</span>
                <el-select
                  v-model="state.planform"
                  clearable
                  @change="changePlatform"
                  value-key="type"
                  size="small"
                >
                  <el-option
                    v-for="item in state.all_redPlanformList"
                    :key="item.type"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>
              </div>
              <div id="coverageId1" class="main_bottom_b_con"></div>
            </div>
            <div class="main_bottom_b_middle1">
              <img
                src="~@/assets/images/infoStatistics/main_bottom_bottom.png"
              />
              <div
                class="main_bottom_b_title1"
                @click="state.reconnaissanceEvaluation_dialog = true"
              >
                <!-- 弹药类型消耗占比 -->蓝方弹药
              </div>
              <div class="headerBox" v-if="false">
                <span>选择平台：</span>
                <el-select
                  v-model="state.planform"
                  clearable
                  @change="changePlatform"
                  value-key="type"
                  size="small"
                >
                  <el-option
                    v-for="item in state.all_bluePlanformList"
                    :key="item.type"
                    :label="item.name"
                    :value="item"
                  />
                </el-select>
              </div>
              <div
                id="contentId2"
                class="main_bottom_b_con main_bottom_b_con2"
              ></div>
            </div>
            <div class="main_bottom_b_middle2" v-if="false">
              <img
                src="~@/assets/images/infoStatistics/main_bottom_bottom.png"
              />
              <div
                class="main_bottom_b_title"
                @click="state.strikeAssessment_dialog = true"
              >
                单位消耗统计
              </div>
              <div
                id="contentId3"
                class="main_bottom_b_con main_bottom_b_con2"
              ></div>
            </div>
            <div class="main_bottom_b_right" v-if="false">
              <img
                src="~@/assets/images/infoStatistics/main_bottom_bottom.png"
              />
              <div
                class="main_bottom_b_title"
                @click="state.damageAssessment_dialog = true"
              >
                毁伤评估
              </div>
              <div
                id="contentId4"
                class="main_bottom_b_con main_bottom_b_con2"
              ></div>
            </div>
          </div>
        </div>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { creatScene } from '@/views/homeHeader/hooks/index'
import {
  onMounted,
  reactive,
  ref,
  defineProps,
  watch,
  onBeforeUnmount,
  toRaw
} from 'vue'
import store from '@/store/index'
import emitter from '@/utils/eventbus'
import * as echarts from 'echarts'
import { gsap } from 'gsap'

import oilVolumeComparison from './dialog/oilVolumeComparison.vue'
import ammunitionComparison from './dialog/ammunitionComparison.vue'
import actionTrack from './dialog/actionTrack.vue'
import reconnaissanceEvaluation from './dialog/reconnaissanceEvaluation.vue'
import strikeAssessment from './dialog/strikeAssessment.vue'
import damageAssessment from './dialog/damageAssessment.vue'
import quickArbitration from './components/quickArbitration.vue'
import {
  getPlatformState,
  getPlatformWeapons,
  getPlatformParts
} from '@/service/afsim/index'
import {
  getPlatformFuelQuantityStatistics,
  getPlatformWeaponsStatistics,
  getResultsAndLossesStatistics,
  getRealTimePlatformFuelQuantityStatistics,
  getRealTimePlatformWeaponsStatistics,
  getPlatformArray,
  getPlatStatusGroupNodeBySide
} from '@/service/infomationStatistics/index.js'
import { getCurrentInfo } from '@/service/experiment/experiment.js'
import { getTime } from '@/utils/meteorology/utils'

const emit = defineEmits()

const props = defineProps({
  messages: {
    type: Array,
    required: true,
    default: () => [
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    2025-05-21 14:13:12',
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    2025-05-21 14:13:12',
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    2025-05-21 14:13:12',
      'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxx    2025-05-21 14:13:12'
    ]
  },
  duration: {
    type: Number,
    default: 10
  },
  itemHeight: {
    type: Number,
    default: 40
  },
  pauseOnHover: {
    type: Boolean,
    default: true
  },
  sseMessage: {
    type: Object,
    default: ''
  },
  sceneId: {
    type: String,
    default: ''
  }
})

const state = reactive({
  oilVolumeComparison_dialog: false,
  ammunitionComparison_dialog: false,
  actionTrack_dialog: false,
  reconnaissanceEvaluation_dialog: false,
  strikeAssessment_dialog: false,
  damageAssessment_dialog: false,
  oldPlanformName: '',
  planform: '',
  planformList: [
    {
      name: '测试1',
      id: 1
    },
    {
      name: '测试2',
      id: 2
    }
  ],
  side: 'red',
  sideList: [
    {
      label: '红方',
      value: 'red'
    },
    {
      label: '蓝方',
      value: 'blue'
    }
  ],
  danyaoxiaohaoChart: null,
  danyaoleixingChart: null,
  danweixiaohaoChart: null,
  jieduanyouhaoChart: null,
  jixingyouhaoChart: null,
  youhaoData: [],
  youhaoData2: [],
  youhaoData2_x: [],
  redPlanformList: [],
  bluePlanformList: [],
  all_redPlanformList: [],
  all_bluePlanformList: [],
  sceneStartTime: '2025-09-01 00:00:00',
  redLossesCount: 0,
  blueLossesCount: 0,
  lossesData_results: {},
  lossesData_red: {
    weaponList: [
      {
        targetList: []
      }
    ],
    platSide: '',
    HitCounts: '',
    weaponSet: [],
    platName: '',
    platNameCN: '',
    platWeapon: ''
  },
  lossesData_blue: {
    weaponList: [
      {
        targetList: []
      }
    ],
    platSide: '',
    HitCounts: '',
    weaponSet: [],
    platName: '',
    platNameCN: '',
    platWeapon: ''
  },
  red_SXTJList: [],
  blue_SXTJList: [],
  redCGFfuel: '',
  blueCGFfuel: '',
  redCGFWeapon: [],
  blueCGFWeapon: [],
  LossesData: {}
})

const redSXTJ = (name) => {
  let params = { name }
  getRealTimePlatformFuelQuantityStatistics(params).then((res) => {
    if (res.code == 200) {
      state.redCGFfuel = res.data.Fuel[res.data.Fuel.length - 1].Fuel
    } else {
    }
  })
  getRealTimePlatformWeaponsStatistics(params).then((res) => {
    if (res.code == 200) {
      state.redCGFWeapon = res.data.Weapon
    } else {
    }
  })
}

const blueSXTJ = (name) => {
  let params = { name }
  getRealTimePlatformFuelQuantityStatistics(params).then((res) => {
    if (res.code == 200) {
      state.blueCGFfuel = res.data.Fuel[res.data.Fuel.length - 1].Fuel
    } else {
    }
  })
  getRealTimePlatformWeaponsStatistics(params).then((res) => {
    if (res.code == 200) {
      state.blueCGFWeapon = res.data.Weapon
    } else {
    }
  })
}

const changePlatform = () => {
  state.youhaoData = []
  youliangduibi()
}

const changeSide = () => {
  if (state.side == 'red') {
  }
}

const guolv = (list) => {
  state.bluePlanformList = []
  for (let i = 0; i < list.length; i++) {
    const element = list[i]
    if (element.data[0].SpatialDomain == 'air') {
      if (element.data[0].Side == 'red') {
        if (element.data[0].Type == 'Z-10') {
          state.redPlanformList[0] = element
        } else if (element.data[0].Type == 'J-11B_P6DOF') {
          state.redPlanformList[1] = element
        } else if (element.data[0].Type == 'J-16D') {
          state.redPlanformList[2] = element
        } else if (element.data[0].Type == 'H-6N') {
          state.redPlanformList[3] = element
        } else if (element.data[0].Type == 'KJ-500') {
          state.redPlanformList[4] = element
        }
      } else {
        state.bluePlanformList.push(element)
      }
    }
  }
}

const middleCenter = (red) => {
  let temp = {
    xAxisData: [],
    seriesData: []
  }
  // let length = red.length > 15 ? 12 : red.length
  for (let i = 0; i < red.length; i += 3) {
    const element = red[i]
    if (
      element.nameCn.indexOf('航母') < 0 &&
      element.nameCn.indexOf('舰') < 0 &&
      element.nameCn.indexOf('KVD-001') < 0 &&
      element.nameCn.indexOf('071') < 0
    ) {
      temp.xAxisData.push(element.nameCn)
      temp.seriesData.push(
        parseInt((element.Fuel / element.FuelCapacity) * 100)
      )
    }
  }
  return youliangChart_red(temp)
}

const contentFn = (blue) => {
  let temp = {
    xAxisData: [],
    seriesData: []
  }
  // let length = blue.length > 15 ? 12 : blue.length
  for (let i = 0; i < blue.length; i += 1) {
    const element = blue[i]
    if (
      element.nameCn.indexOf('航母') < 0 &&
      element.nameCn.indexOf('舰') < 0 &&
      element.nameCn.indexOf('KVD-001') < 0 &&
      element.nameCn.indexOf('071') < 0
    ) {
      temp.xAxisData.push(element.nameCn)
      temp.seriesData.push(
        parseInt((element.Fuel / element.FuelCapacity) * 100)
      )
    }
  }
  return youliangChart_blue(temp)
}

const youliangduibi = (red) => {
  let temp = {
    xAxisData: [],
    seriesData: []
  }
  // let length = red.length > 15 ? 12 : red.length
  for (let i = 0; i < red.length; i += 5) {
    const element = red[i]
    if (element.Weapon.length) {
      temp.xAxisData.push(element.nameCn)
      temp.seriesData.push(
        parseInt(
          (element.Weapon[0].Quantity / element.Weapon[0].InitQuantity) * 100
        )
      )
    }
  }
  return danyaoChart_red(temp)
}

const danyaoyaduibi = (blue) => {
  let temp = {
    xAxisData: [],
    seriesData: []
  }
  // let length = blue.length > 15 ? 12 : blue.length
  for (let i = 0; i < blue.length; i += 4) {
    const element = blue[i]
    if (element.Weapon.length) {
      temp.xAxisData.push(element.nameCn)
      temp.seriesData.push(
        parseInt(
          (element.Weapon[0].Quantity / element.Weapon[0].InitQuantity) * 100
        )
      )
    }
  }
  console.log(temp)

  return danyaoChart_blue(temp)
}

const _getPlatformFuelQuantityStatistics = () => {
  getPlatformFuelQuantityStatistics().then((res) => {
    if (res.code == 200) {
      let red = []
      let blue = []
      let other = []
      let targetArrRed = [
        'gj-11_1',
        'kvd-001_1',
        'z-10_1',
        'wz-8__101',
        'ss-uav_1',
        'wz-7_1',
        'cap_north_2',
        'cap_north_1',
        'cap_south_1',
        'cap_south_2',
        'j-16d_1'
      ]
      for (let i = 0; i < res.data.length; i++) {
        const element = res.data[i]
        // if (targetArrRed.indexOf(element.name) > -1) {
        if (element.side == 'red') {
          red.push(element)
        } else if (element.side == 'blue') {
          blue.push(element)
        } else {
          other.push(element)
        }
        // }
      }
      let redyouliang = middleCenter(red)
      let blueyouliang = contentFn(blue)
      let youliangData = {
        redyouliang,
        blueyouliang
      }
      emit('youliangData', youliangData)
    } else {
    }
  })
}

const _getPlatformWeaponsStatistics = () => {
  getPlatformWeaponsStatistics().then((res) => {
    if (res.code == 200) {
      let red = []
      let blue = []
      let other = []
      let targetArrRed = [
        'gj-11_1',
        'kvd-001_1',
        'z-10_1',
        'wz-8__101',
        'ss-uav_1',
        'wz-7_1',
        'cap_north_2',
        'cap_north_1',
        'cap_south_1',
        'cap_south_2',
        'j-16d_1'
      ]
      for (let i = 0; i < res.data.length; i++) {
        const element = res.data[i]
        // if (targetArrRed.indexOf(element.name) > -1) {
        if (element.side == 'red') {
          red.push(element)
        } else if (element.side == 'blue') {
          blue.push(element)
        } else {
          other.push(element)
        }
        // }
      }
      console.log('danyaoyaduibi')

      let reddayao = youliangduibi(red)
      let bluedayao = danyaoyaduibi(blue)
      let danyaoData = {
        reddayao,
        bluedayao
      }
      console.log()

      emit('danyaoData', danyaoData)
    } else {
    }
  })
}

const zhanguo = (data) => {
  let params = []
  if (data) {
    params = data
    // params = [
    //   { value: data.blueData, itemStyle: { color: '#ff0000' } },
    //   data.redData
    // ]
  } else {
    params = [0, 0]
  }
  // params = [{ value: 3, itemStyle: { color: '#ff0000' } }, 4]
  var publicNumChart = echarts.init(document.getElementById('publicityId'))
  var option = {
    tooltip: {
      trigger: 'axis',
      backgroundColor: 'rgba(0, 17, 34, 0.9)',
      borderColor: '#00ffff',
      borderWidth: 1,
      textStyle: {
        color: '#00ffff',
        textShadowBlur: 5,
        textShadowColor: '#00ffff'
      },
      extraCssText: 'box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);'
    },
    legend: {
      x: '35%',
      y: '0%',
      data: ['红方', '蓝方'],
      textStyle: {
        color: '#00ffff',
        fontSize: 8,
        textShadowBlur: 3,
        textShadowColor: '#00ffff'
      },
      itemWidth: 10,
      itemHeight: 10,
      itemStyle: {
        color: '#00ffff'
      }
    },
    // calculable: true,
    xAxis: [
      {
        type: 'category',
        data: ['红方', '蓝方'],
        axisLabel: {
          interval: 0,
          textStyle: {
            fontSize: 8,
            color: '#00ffff',
            textShadowBlur: 3,
            textShadowColor: '#00ffff'
          }
        },
        axisTick: {
          //y轴刻度线
          show: true,
          lineStyle: {
            color: 'rgba(0, 255, 255, 0.5)'
          }
        },
        axisLine: {
          //y轴
          show: true,
          lineStyle: {
            color: 'rgba(0, 255, 255, 0.5)'
          }
        },
        splitLine: {
          lineStyle: {
            color: 'rgba(0, 255, 255, 0.1)',
            type: 'dashed'
          }
        }
      }
    ],
    yAxis: {
      type: 'value',
      max: 50,
      axisLabel: {
        color: '#00ffff',
        textShadowBlur: 3,
        textShadowColor: '#00ffff'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.5)'
        }
      },
      axisTick: {
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.5)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.1)',
          type: 'dashed'
        }
      }
    },
    grid: {
      left: '5%',
      right: '1%',
      top: '25%',
      bottom: '15%',
      backgroundColor: 'rgba(0, 17, 34, 0.7)',
      borderColor: 'rgba(0, 255, 255, 0.3)',
      borderWidth: 1,
      shadowBlur: 10,
      shadowColor: 'rgba(0, 255, 255, 0.5)'
      // containLabel: true
    },
    series: [
      {
        animationDuration: 2500,
        animationEasing: 'elasticOut',
        barWidth: '20%',
        type: 'bar',
        data: params,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
            { offset: 0, color: '#00ffff' },
            { offset: 1, color: '#0080ff' }
          ]),
          shadowBlur: 10,
          shadowColor: 'rgba(0, 255, 255, 0.8)'
        },
        label: {
          show: true,
          position: 'top',
          color: '#00ffff',
          fontSize: 10,
          textShadowBlur: 3,
          textShadowColor: '#00ffff'
        },
        z: 1
      }
    ]
  }
  // console.log('战果', option)
  let ZGTJData = {
    lossesData_results: state.lossesData_results,
    option
  }
  emit('ZGTJData', ZGTJData)
  publicNumChart.setOption(option)
  // setInterval(function () {
  //   publicNumChart.clear()
  //   publicNumChart.setOption(option)
  // }, 3000)
}

const zhansun = (data) => {
  let params = []

  state.LossesData = data
  state.redLossesCount = data.redCount
  state.blueLossesCount = data.blueCount
  if (data) {
    let time = new Date(state.sceneStartTime).getTime()
    for (let i = 0; i < data.blue.length; i++) {
      const element = data.blue[i]
      let lossesTime = parseInt(element.lossesTime * 1000)
      let temp = {
        name: element.platNameCn,
        enName: element.platName,
        type: element.domain,
        startTime: getTime(time + lossesTime, 'yyyy-MM-dd HH:mm:ss'),
        endTime: getTime(time + lossesTime + 30000, 'yyyy-MM-dd HH:mm:ss'),
        side: 'blue'
      }
      params.push(temp)
    }
    for (let i = 0; i < data.red.length; i++) {
      const element = data.red[i]
      let lossesTime = parseInt(element.lossesTime * 1000)
      let temp = {
        name: element.platNameCn,
        enName: element.platName,
        type: element.domain,
        startTime: getTime(time + lossesTime, 'yyyy-MM-dd HH:mm:ss'),
        endTime: getTime(time + lossesTime + 30000, 'yyyy-MM-dd HH:mm:ss'),
        side: 'red'
      }
      params.push(temp)
    }
  } else {
    params = []
  }
  var categories = ['海军装备', '陆军装备', '空军装备']
  var dayTime = 3600 * 24 * 1000

  var nowDate = new Date() //今日日期为2020年2月14日
  var nowDateStr = formatDate(nowDate)
  function formatDate(date) {
    //将2020/2/3这种日期格式，转换为2020-02-03
    var arr = date.toLocaleDateString().split('/')
    if (arr[1].length < 2) {
      //对月份进行处理：如果月份的长度为1，则拼接上字符串0
      arr.splice(1, 1, '0' + arr[1])
    }
    if (arr[2].length < 2) {
      //对天数进行处理：如果天数的长度为2，则拼接上字符串0
      arr.splice(2, 1, '0' + arr[2])
    }
    return arr.join('-')
  }

  function renderItem(params, api) {
    //params为data中的数据项的信息对象    api中是一些开发者可调用的方法集合，可以对data中的数据项进行操作
    var categoryIndex = api.value(0) //取出data中数据项的第一个维度的值

    //===============计划工期进度条
    //计划开始日期(在屏幕上的像素值)
    var planStartDate = api.coord([api.value(1), categoryIndex]) //将数据项中的数值对应的坐标系上的点，转换为屏幕上的像素值
    //坐标系上的点：是数据项映射到坐标系的x轴和y轴后，对应的位置
    //屏幕上的像素值：是坐标系上的点，在屏幕上的位置
    //计划结束日期(在屏幕上的像素值)
    var planEndDate = api.coord([api.value(2), categoryIndex])
    //由于data.value中维度1和维度2的数据会被映射到x轴，而x轴的type为time，即时间轴，
    //所以api.value(1)和api.value(2)获取到的值是将日期转换后的毫秒值
    //设置图形的高度
    var height = api.size([0, 1])[1] * 0.4 //获得Y轴上数值范围为1的一段所对应的像素长度；这是官方文档的注释，对于api.size()方法，目前我还不是很理解；先做个标记??? 以后再说

    //使用graphic图形元素组件，绘制矩形
    //clipRectByRect方法，在绘制矩形时，如果矩形大小超出了当前坐标系的包围盒，则裁剪这个矩形
    var rectShape1 = echarts.graphic.clipRectByRect(
      {
        //矩形的位置
        x: planStartDate[0],
        y: planStartDate[1],
        //矩形的宽高
        width: planEndDate[0] - planStartDate[0],
        height: height
      },
      {
        //当前坐标系的包围盒
        x: params.coordSys.x,
        y: params.coordSys.y,
        width: params.coordSys.width,
        height: params.coordSys.height
      }
    )

    //===============实际工期进度条
    var rectShape2 = null
    //判断实际开始日期是否为空，如果为空，说明项目还没开始
    let color = '#FF0000'
    if (api.value(3) !== '') {
      //如果实际开始日期不为空
      if (api.value(3) == 'red') {
        color = '#FF0000'
      } else {
        color = '#0000FF'
      }
    }

    //如果项目还没开始，那么只渲染计划工期的进度条
    return (
      rectShape1 && {
        type: 'group',
        children: [
          {
            //类型为矩形
            type: 'rect',
            //具体形状
            shape: rectShape1,
            //样式
            style: api.style({
              fill: color
            })
          }
        ]
      }
    )
  }

  function getYPosition(type) {
    switch (type) {
      case '海':
        return 0
      case '陆':
      case '地':
        return 1
      case '空':
      case '天':
        return 2
      default:
        return 3
    }
  }
  const seriesData = params.map((item, index) => ({
    name: item.name,
    value: [getYPosition(item.type), item.startTime, item.endTime, item.side],
    itemStyle: {
      color:
        item.type === 'sea'
          ? '#4A90E2'
          : item.type === 'land'
          ? '#7ED321'
          : '#F5A623'
    },
    // 添加额外信息用于tooltip显示
    startTime: item.startTime,
    endTime: item.endTime,
    type: item.type
  }))
  var publicNumChart = echarts.init(document.getElementById('threeTasksId'))
  let startTime = new Date(state.sceneStartTime).getTime()
  let endTime = new Date(state.sceneStartTime).getTime() + 86400000
  if (seriesData && seriesData.length) {
    endTime =
      new Date(seriesData[seriesData.length - 1].endTime).getTime() + 60000
  }
  // console.log(seriesData)

  var option = (option = {
    tooltip: {
      //自定义提示信息
      formatter: function (params) {
        //params为当前点击图形元素的数据信息的对象
        //计划开始时间
        var planStartDate = params.value[1]
        //计划结束时间
        var planEndDate = params.value[2]
        //实际开始时间
        var practiceStartDate = ''
        var practiceStartDate_str = ''
        if (params.value[3]) {
          practiceStartDate = params.value[3]
          practiceStartDate_str = '实际开始日期：' + practiceStartDate + '<br/>'
        }

        //项目周期(毫秒值)：计划结束日期 - 计划开始日期
        var projectCycle_millisecond =
          +echarts.number.parseDate(params.value[2]) -
          +echarts.number.parseDate(params.value[1])
        //项目周期(天数)
        var projectCycle_days = projectCycle_millisecond / dayTime
        //当前进度(百分比)
        var currentProgress_percentage
        var currentProgress_percentage_str = ''
        if (practiceStartDate !== '') {
          //如果实际开始日期不为空，说明项目已开始
          //当前进度(毫秒值)：当前日期(毫秒值) - 实际开始日期(毫秒值)
          var currentProgress_mill =
            +echarts.number.parseDate(nowDateStr) -
            +echarts.number.parseDate(params.value[3])
          //当前进度(百分比)：当前进度(毫秒值) / 项目周期(毫秒值)
          currentProgress_percentage = (
            (currentProgress_mill / projectCycle_millisecond) *
            100
          ).toFixed(0) //注意，toFixed的返回值是字符串类型
          //如果项目已结束：比如计划开始时间1月10日，计划结束时间1月20日，项目周期10天，实际开始时间1月10日，当前日期1月22日，说明项目已结束
          //那么按照(当前日期-实际开始日期)/项目周期，计算出的百分比，就会大于100，所以需要将百分比置为100
          if (currentProgress_percentage > 100) {
            //项目已结束
            currentProgress_percentage = 100
          }
          currentProgress_percentage_str =
            '当前进度：' + currentProgress_percentage + '%' + '<br/>'
        }

        //实际结束时间
        var practiceEndDate = ''
        var practiceEndDate_str = ''
        if (currentProgress_percentage == 100) {
          //如果项目进度已完成或项目已结束
          //实际结束时间(毫秒值)：实际开始日期(毫秒值) + 项目周期(毫秒值)
          var practiceEndDate_millisecond =
            +echarts.number.parseDate(practiceStartDate) +
            projectCycle_millisecond
          //实际结束时间(日期格式)
          practiceEndDate = echarts.format.formatTime(
            'yyyy-MM-dd',
            practiceEndDate_millisecond
          )
          practiceEndDate_str = '实际结束日期：' + practiceEndDate + '<br/>'
        }
        return params.name + '<br/>' + '时间：' + planStartDate + '<br/>'
        // + '结束时间：' + planEndDate + '<br/>'
        // + '项目周期：' + projectCycle_days + '天<br/>'
        // + currentProgress_percentage_str
        // + practiceStartDate_str
        // + practiceEndDate_str
      },
      backgroundColor: 'rgba(0, 17, 34, 0.9)',
      borderColor: '#00ffff',
      borderWidth: 1,
      textStyle: {
        color: '#00ffff',
        textShadowBlur: 5,
        textShadowColor: '#00ffff'
      },
      extraCssText: 'box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);'
    },
    // title: {
    //   text: '项目进度',
    //   left: 'center',
    //   textStyle: {
    //     color: '#00ffff',
    //     textShadowBlur: 5,
    //     textShadowColor: '#00ffff'
    //   }
    // },
    dataZoom: [
      {
        //区域缩放组件的类型为滑块，默认作用在x轴上
        type: 'slider',
        //区域缩放组件的过滤模式，weakFilter：在进行区域缩放时，允许图形的一部分在坐标系上(可见)，另一部分在坐标系外(隐藏)
        filterMode: 'weakFilter',
        showDataShadow: false,
        top: 400,
        height: 10,
        //区域缩放组件边框颜色
        borderColor: 'rgba(0, 255, 255, 0.3)',
        //区域缩放组件边框背景
        backgroundColor: 'rgba(0, 17, 34, 0.7)',
        //区域缩放组件上的手柄的样式
        handleIcon:
          'M10.7,11.9H9.3c-4.9,0.3-8.8,4.4-8.8,9.4c0,5,3.9,9.1,8.8,9.4h1.3c4.9-0.3,8.8-4.4,8.8-9.4C19.5,16.3,15.6,12.2,10.7,11.9z M13.3,24.4H6.7v-1.2h6.6z M13.3,22H6.7v-1.2h6.6z M13.3,19.6H6.7v-1.2h6.6z', // jshint ignore:line
        //手柄大小
        handleSize: 20,
        //为手柄设置阴影效果
        handleStyle: {
          color: '#00ffff',
          borderColor: '#00ffff',
          shadowBlur: 10,
          shadowOffsetX: 0,
          shadowOffsetY: 0,
          shadowColor: 'rgba(0, 255, 255, 0.8)'
        },
        fillerColor: 'rgba(0, 255, 255, 0.2)',
        labelFormatter: ''
      },
      {
        //区域缩放组件的类型为内置在坐标系中，默认作用在x轴的坐标系中
        type: 'inside',
        //区域缩放组件的过滤模式，weakFilter：在进行区域缩放时，允许图形的一部分在坐标系上(可见)，另一部分在坐标系外(隐藏)
        filterMode: 'weakFilter'
      }
    ],
    //图表底板
    grid: {
      top: 0,
      bottom: 0,
      right: 20,
      containLabel: true,
      backgroundColor: 'rgba(0, 17, 34, 0.7)',
      borderColor: 'rgba(0, 255, 255, 0.3)',
      borderWidth: 1,
      shadowBlur: 10,
      shadowColor: 'rgba(0, 255, 255, 0.5)'
    },
    xAxis: {
      type: 'time', //x轴类型为时间轴
      min: startTime,
      max: endTime,
      axisLabel: {
        interval: 0, //强制显示所有标签
        color: '#00ffff',
        textShadowBlur: 3,
        textShadowColor: '#00ffff'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.5)'
        }
      },
      axisTick: {
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.5)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.1)',
          type: 'dashed'
        }
      }
    },
    yAxis: {
      data: categories,
      axisTick: {
        alignWithLabel: true, //保证刻度线和标签对齐，当boundaryGap为true的时候有效，不过boundaryGap默认就是true
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.5)'
        }
      },
      axisLabel: {
        color: '#00ffff',
        textShadowBlur: 3,
        textShadowColor: '#00ffff'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.5)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.1)',
          type: 'dashed'
        }
      }
    },
    // legend: {
    //   left: '70%',
    //   top: 10,
    //   data: ['计划工期', '实际工期'],
    //   textStyle: {
    //     color: '#00ffff',
    //     textShadowBlur: 5,
    //     textShadowColor: '#00ffff'
    //   }
    // },
    series: [
      {
        type: 'custom',
        //使用自定义的图形元素
        renderItem: renderItem,
        name: '计划工期',
        itemStyle: {
          //透明度
          opacity: 0.8,
          color: '#00ffff'
        },
        encode: {
          //将维度1和维度2的数据映射到x轴
          x: [1, 2],
          //将维度0的数据映射到y轴
          y: 0
        },
        data: seriesData,
        z: 1,
        animationDelay: function (idx) {
          return idx * 100
        }
      }
      //这个系列并没有太大作用，也没有给它设置data，只是为了通过这个系列，显示图例(legend)而已
      // {
      //   type: 'custom',
      //   name: '实际工期',
      //   itemStyle: {
      //     //透明度
      //     opacity: 0.8,
      //     color: '#2076ED'
      //   }
      // }
    ]
  })
  // console.log('战损', option)
  publicNumChart.setOption(option)
  let nOption = publicNumChart.getOption()
  let ZSTJData = {
    redLossesCount: state.redLossesCount,
    blueLossesCount: state.blueLossesCount,
    option: nOption
  }
  emit('ZSTJData', ZSTJData)
  // setInterval(function () {
  //   publicNumChart.clear()
  //   publicNumChart.setOption(option)
  // }, 3000)
}

const _getResultsAndLossesStatistics = () => {
  getResultsAndLossesStatistics()
    .then((res) => {
      if (res.code === 200) {
        let lossesData = res.data.losses
        let params = [
          { value: lossesData.blueCount, itemStyle: { color: '#ff0000' } },
          lossesData.redCount
        ]
        state.lossesData_results = res.data.results
        zhanguo(params)
        zhansun(lossesData)
      }
    })
    .catch((err) => {
      console.log('获取战国战损统计结果失败', err)
    })
}

const _getPlatformArray = () => {
  getPlatformArray().then((res) => {
    if (res.code == 200) {
      state.red_SXTJList = []
      state.blue_SXTJList = []
      for (let i = 0; i < res.data.length; i++) {
        const element = res.data[i]
        if (element.side == 'red') {
          state.red_SXTJList.push(element)
        } else {
          state.blue_SXTJList.push(element)
        }
      }
      let SXTJListData = {
        red_SXTJList: state.red_SXTJList,
        blue_SXTJList: state.blue_SXTJList
      }
      emit('SXTJListData', SXTJListData)
    }
  })
}

let intervalGetData = null

const getJCFXData = (data) => {
  emit('JCFXData', data)
}

const youliangChart_red = (data) => {
  const { xAxisData, seriesData } = data
  state.youliangChart_red = echarts.init(document.getElementById('duibi1'))
  let nameAll = ''
  xAxisData.forEach((element) => {
    nameAll += element
  })
  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      },
      // 确保tooltip配置正确
      backgroundColor: 'rgba(50, 50, 50, 0.9)',
      borderColor: '#188df0',
      textStyle: {
        color: '#fff'
      }
    },
    grid: {
      containLabel: true,
      left: 0,
      top: 20,
      right: 20,
      bottom: 5
    },
    xAxis: {
      // show:false,
      type: 'category',
      data: xAxisData,
      axisLabel: {
        color: '#83bff6',
        interval: 0,
        textStyle: {
          fontSize: 14,
          color: 'rgba(255,255,255,.7)'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#188df0'
      }
    },
    series: [
      {
        data: seriesData,
        type: 'bar',
        itemStyle: {
          borderRadius: [10, 10, 0, 0]
        },
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#ff9898' },
          { offset: 0.5, color: '#ff0000' },
          { offset: 1, color: '#ff0000' }
        ]),
        label: {
          show: true,
          position: 'top',
          color: '#188df0'
        }
      }
    ],
    dataZoom: {
      type: 'slider',
      start: 0,
      end: (670 / (nameAll.length * 14)) * 100
    }
  }
  state.youliangChart_red.setOption(option)
  return option
}

const danyaoChart_red = (data) => {
  const { xAxisData, seriesData } = data
  state.danyaoChart_red = echarts.init(document.getElementById('coverageId1'))
  let nameAll = ''
  xAxisData.forEach((element) => {
    nameAll += element
  })
  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        lineStyle: {
          color: '#00ffff',
          width: 2,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 255, 255, 0.5)'
        }
      },
      backgroundColor: 'rgba(0, 17, 34, 0.9)',
      borderColor: '#00ffff',
      borderWidth: 1,
      textStyle: {
        color: '#00ffff',
        textShadowBlur: 5,
        textShadowColor: '#00ffff'
      },
      extraCssText: 'box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);'
    },
    grid: {
      containLabel: true,
      left: 0,
      top: 20,
      right: 20,
      bottom: 5,
      backgroundColor: 'rgba(0, 17, 34, 0.7)',
      borderColor: 'rgba(0, 255, 255, 0.3)',
      borderWidth: 1,
      shadowBlur: 10,
      shadowColor: 'rgba(0, 255, 255, 0.5)'
    },
    xAxis: {
      // show:false,
      type: 'category',
      data: xAxisData,
      axisLabel: {
        interval: 0,
        textStyle: {
          fontSize: 14,
          color: '#00ffff',
          textShadowBlur: 5,
          textShadowColor: '#00ffff'
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.5)'
        }
      },
      axisTick: {
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.5)'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#00ffff',
        textShadowBlur: 5,
        textShadowColor: '#00ffff'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.5)'
        }
      },
      axisTick: {
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.5)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.1)',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        data: seriesData,
        type: 'bar',
        itemStyle: {
          borderRadius: [10, 10, 0, 0],
          shadowBlur: 10,
          shadowColor: 'rgba(255, 0, 0, 0.5)'
        },
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#FF00FF' },
          { offset: 0.5, color: '#FF0000' },
          { offset: 1, color: '#CC0000' }
        ]),
        label: {
          show: true,
          position: 'top',
          color: '#00ffff',
          textShadowBlur: 5,
          textShadowColor: '#00ffff'
        },
        animationDelay: function (idx) {
          return idx * 100
        }
      }
    ],
    dataZoom: {
      type: 'slider',
      start: 0,
      end: (670 / (nameAll.length * 14)) * 100
    },
    animationEasing: 'elasticOut',
    animationDelayUpdate: function (idx) {
      return idx * 5
    }
  }
  state.danyaoChart_red.setOption(option)
  return option
}

const youliangChart_blue = (data) => {
  const { xAxisData, seriesData } = data
  state.youliangChart_blue = echarts.init(document.getElementById('duibi2'))
  let nameAll = ''
  xAxisData.forEach((element) => {
    nameAll += element
  })
  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      containLabel: true,
      left: 0,
      top: 20,
      right: 20,
      bottom: 5
    },
    xAxis: {
      // show:false,
      type: 'category',
      data: xAxisData,
      axisLabel: {
        color: '#83bff6',
        interval: 0,
        textStyle: {
          fontSize: 14,
          color: 'rgba(255,255,255,.7)'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#188df0'
      }
    },
    series: [
      {
        data: seriesData,
        type: 'bar',
        itemStyle: {
          borderRadius: [10, 10, 0, 0]
        },
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#83bff6' },
          { offset: 0.5, color: '#188df0' },
          { offset: 1, color: '#188df0' }
        ]),
        label: {
          show: true,
          position: 'top',
          color: '#188df0'
        }
      }
    ],
    dataZoom: {
      type: 'slider',
      start: 0,
      end: (670 / (nameAll.length * 14)) * 100
    }
  }

  state.youliangChart_blue.setOption(option)
  return option
}

const danyaoChart_blue = (data) => {
  const { xAxisData, seriesData } = data
  state.danyaoChart_blue = echarts.init(document.getElementById('contentId2'))
  let nameAll = ''
  xAxisData.forEach((element) => {
    nameAll += element
  })
  var option = {
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
        lineStyle: {
          color: '#00ffff',
          width: 2,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 255, 255, 0.5)'
        }
      },
      backgroundColor: 'rgba(0, 17, 34, 0.9)',
      borderColor: '#00ffff',
      borderWidth: 1,
      textStyle: {
        color: '#00ffff',
        textShadowBlur: 5,
        textShadowColor: '#00ffff'
      },
      extraCssText: 'box-shadow: 0 0 10px rgba(0, 255, 255, 0.5);'
    },
    grid: {
      containLabel: true,
      left: 0,
      top: 20,
      right: 20,
      bottom: 5,
      backgroundColor: 'rgba(0, 17, 34, 0.7)',
      borderColor: 'rgba(0, 255, 255, 0.3)',
      borderWidth: 1,
      shadowBlur: 10,
      shadowColor: 'rgba(0, 255, 255, 0.5)'
    },
    xAxis: {
      // show:false,
      type: 'category',
      data: xAxisData,
      // data: [1,2,3],
      axisLabel: {
        interval: 0,
        textStyle: {
          fontSize: 14,
          color: '#00ffff',
          textShadowBlur: 5,
          textShadowColor: '#00ffff'
        }
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.5)'
        }
      },
      axisTick: {
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.5)'
        }
      }
    },
    yAxis: {
      type: 'value',
      axisLabel: {
        color: '#00ffff',
        textShadowBlur: 5,
        textShadowColor: '#00ffff'
      },
      axisLine: {
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.5)'
        }
      },
      axisTick: {
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.5)'
        }
      },
      splitLine: {
        lineStyle: {
          color: 'rgba(0, 255, 255, 0.1)',
          type: 'dashed'
        }
      }
    },
    series: [
      {
        data: seriesData,
        // data: [1,2,3],
        type: 'bar',
        itemStyle: {
          borderRadius: [10, 10, 0, 0],
          shadowBlur: 10,
          shadowColor: 'rgba(0, 255, 255, 0.5)'
        },
        color: new echarts.graphic.LinearGradient(0, 0, 0, 1, [
          { offset: 0, color: '#00FFFF' },
          { offset: 0.5, color: '#0099FF' },
          { offset: 1, color: '#0033FF' }
        ]),
        label: {
          show: true,
          position: 'top',
          color: '#00ffff',
          textShadowBlur: 5,
          textShadowColor: '#00ffff'
        },
        animationDelay: function (idx) {
          return idx * 100
        }
      }
    ],
    dataZoom: {
      type: 'slider',
      start: 0,
      end: (670 / (nameAll.length * 14)) * 100
    },
    animationEasing: 'elasticOut',
    animationDelayUpdate: function (idx) {
      return idx * 5
    }
  }
  state.danyaoChart_blue.setOption(option)
  return option
}

let redyouliang = {}
let blueyouliang = {}
let reddayao = {}
let bluedayao = {}
const youliangAndDanyaoData = (data, side) => {
  let youliang = {
    xAxisData: [],
    seriesData: []
  }
  let danyao = {
    xAxisData: [],
    seriesData: []
  }
  data.forEach((element) => {
    let fuelInitQ = 0
    let fuelQ = 0
    let totalInitWeaponQuantity = 0
    let totalCurrentWeaponQuantity = 0
    if (element.childList.length > 0) {
      element.childList.forEach((item) => {
        fuelInitQ += item.fuelInitQ
        fuelQ += item.fuelQ
        totalInitWeaponQuantity += item.totalInitWeaponQuantity
        totalCurrentWeaponQuantity += item.totalCurrentWeaponQuantity
      })
      if (fuelInitQ > 0) {
        youliang.xAxisData.push(element.groupName)
        youliang.seriesData.push((fuelQ / fuelInitQ).toFixed(2) * 100)
      }
      if (totalInitWeaponQuantity > 0) {
        danyao.xAxisData.push(element.groupName)
        danyao.seriesData.push(
          (totalCurrentWeaponQuantity / totalInitWeaponQuantity).toFixed(2) *
            100
        )
      }
    }
  })

  if (youliang.xAxisData.length > 0) {
    if (side == 'red') {
      redyouliang = youliangChart_red(youliang)
    } else {
      blueyouliang = youliangChart_blue(youliang)
    }
    let youliangData = {
      redyouliang,
      blueyouliang
    }
    console.log(youliangData)

    emit('youliangData', youliangData)
  }
  if (danyao.xAxisData.length > 0) {
    if (side == 'red') {
      reddayao = danyaoChart_red(danyao)
    } else {
      bluedayao = danyaoChart_blue(danyao)
    }
    let danyaoData = {
      reddayao,
      bluedayao
    }
    console.log(danyaoData)
    emit('danyaoData', danyaoData)
  }
}

const _getPlatStatusGroupNodeBySide = (side) => {
  const params = {
    scenarioId: props.sceneId,
    side
  }
  getPlatStatusGroupNodeBySide(params).then((res) => {
    if (res.code == 200) {
      if (res.data.length) {
        youliangAndDanyaoData(res.data, side)
      } else {
        _getPlatformFuelQuantityStatistics()
        _getPlatformWeaponsStatistics()
      }
    } else {
      _getPlatformFuelQuantityStatistics()
      _getPlatformWeaponsStatistics()
    }
  })
}

const _getCurrentInfo = () => {
  getCurrentInfo().then((res) => {
    if (res.code == 200) {
      if (res.data) {
        state.sceneStartTime = res.data ? res.data.startTime : ''
        state.sceneStartTime =
          28800000 + new Date(state.sceneStartTime).getTime()
        // _getPlatformFuelQuantityStatistics()
        // _getPlatformWeaponsStatistics()
        _getPlatStatusGroupNodeBySide('red')
        _getPlatStatusGroupNodeBySide('blue')
        _getResultsAndLossesStatistics()
        _getPlatformArray()
        intervalGetData = window.setInterval(() => {
          // _getPlatformFuelQuantityStatistics()
          // _getPlatformWeaponsStatistics()
          _getPlatStatusGroupNodeBySide('red')
          _getPlatStatusGroupNodeBySide('blue')
          _getResultsAndLossesStatistics()
        }, 3000)
      }
      state.timeoutData = window.setTimeout(() => {
        if (res.data) {
          window.clearTimeout(state.timeoutData)
          return
        }
        _getCurrentInfo()
      }, 1000)
    } else {
      ElMessage.error('当前没有运行的实验数据')
    }
  })
}

onMounted(() => {
  _getCurrentInfo()
})

onBeforeUnmount(() => {
  if (intervalGetData) {
    window.clearTimeout(intervalGetData)
  }
})

watch(
  () => props.sseMessage,
  (newVal) => {
    // console.log(newVal)
    if (newVal.type == 'PD') {
    } else {
      let redList = newVal.data.redcgfList
      let blueList = newVal.data.bluecgfList
      if (redList) {
        state.all_redPlanformList = redList
      }
      if (blueList) {
        state.all_bluePlanformList = blueList
      }
      if (redList && blueList) {
        state.planformList = [...redList, ...blueList]
        state.planform = state.planformList[0]
        guolv([...redList, ...blueList])
      }

      // state.planformList.push(...redList, ...blueList)
    }
  }
)
</script>

<style lang="less" scoped>
// 科技感样式变量
:root {
  --tech-primary: #00ffff;
  --tech-secondary: #00ff99;
  --tech-accent: #ff00ff;
  --tech-bg: #001122;
  --tech-card-bg: rgba(0, 17, 34, 0.8);
  --tech-border: rgba(0, 255, 255, 0.3);
  --tech-glow: 0 0 10px rgba(0, 255, 255, 0.5);
}

.vertical-ticker-container {
  color: var(--tech-primary);
  font-size: 16px;
  height: v-bind('itemHeight + "px"');
  overflow: hidden;
  position: relative;
  text-shadow: 0 0 5px var(--tech-primary);
}

.vertical-ticker {
  will-change: transform;
}

.message-item {
  height: v-bind('itemHeight + "px"');
  display: flex;
  align-items: center;
  padding: 0 25px;
  position: relative;
  overflow: hidden;

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: -100%;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      90deg,
      transparent,
      rgba(0, 255, 255, 0.2),
      transparent
    );
    animation: scan 3s infinite;
  }
}

@keyframes scan {
  100% {
    left: 100%;
  }
}

.headerBox {
  position: absolute;
  top: 1px;
  right: 10px;
  z-index: 1;
  color: var(--tech-primary);
  text-shadow: 0 0 5px var(--tech-primary);
}

.LossesCountBox {
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: var(--tech-primary);
  font-size: 20px;
  font-weight: bold;
  margin: 20px 0;
  text-shadow: 0 0 5px var(--tech-primary);
}

.header {
  color: var(--tech-primary);
  display: flex;
  align-items: center;
  padding: 5px 10px;
  background-image: linear-gradient(to right, #00468f, #00468f00);
  border-bottom: 1px solid var(--tech-border);
  box-shadow: var(--tech-glow);
}

.red_SXTJ {
  height: 50%;
  border: 1px solid var(--tech-border);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--tech-card-bg);
  box-shadow: var(--tech-glow);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--tech-primary),
      transparent
    );
    animation: lineMove 2s infinite;
  }

  header {
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-image: linear-gradient(to right, #00468f, #00468f00);
    color: var(--tech-primary);
    text-shadow: 0 0 5px var(--tech-primary);
  }

  .content {
    li {
      font-size: 18px;
      padding: 10px;
      color: var(--tech-primary);
      text-shadow: 0 0 3px var(--tech-primary);
      border-bottom: 1px solid rgba(0, 255, 255, 0.1);
    }
  }
}

.blue_SXTJ {
  height: 50%;
  border: 1px solid var(--tech-border);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--tech-card-bg);
  box-shadow: var(--tech-glow);
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--tech-primary),
      transparent
    );
    animation: lineMove 2s infinite;
  }

  header {
    padding: 5px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-image: linear-gradient(to right, #00468f, #00468f00);
    color: var(--tech-primary);
    text-shadow: 0 0 5px var(--tech-primary);
  }

  .content {
    li {
      font-size: 18px;
      padding: 10px;
      color: var(--tech-primary);
      text-shadow: 0 0 3px var(--tech-primary);
      border-bottom: 1px solid rgba(0, 255, 255, 0.1);
    }
  }
}

@keyframes lineMove {
  0% {
    transform: translateX(-100%);
  }

  100% {
    transform: translateX(100%);
  }
}

:deep(.el-dialog) {
  background-color: var(--tech-card-bg);
  border: 1px solid var(--tech-border);
  box-shadow: var(--tech-glow);
  border-radius: 8px;
}

:deep(.el-dialog__title) {
  color: var(--tech-primary);
  text-shadow: 0 0 5px var(--tech-primary);
}

:deep(.el-input__wrapper) {
  background-color: rgba(0, 255, 255, 0.1);
  border: 1px solid var(--tech-border);
  box-shadow: var(--tech-glow);
}

:deep(.el-input__inner) {
  color: var(--tech-primary);
  text-shadow: 0 0 3px var(--tech-primary);
  background-color: transparent;
}

:deep(.el-carousel) {
  height: 100%;
}

:deep(.el-descriptions__body),
:deep(.el-descriptions__label.el-descriptions__cell.is-bordered-label),
:deep(.el-descriptions__content.el-descriptions__cell.is-bordered-content) {
  background-color: transparent;
  color: var(--tech-primary);
  text-shadow: 0 0 3px var(--tech-primary);
  border-color: var(--tech-border) !important;
}

:deep(.el-descriptions__header) {
  margin: 2px;
  color: var(--tech-primary);
  text-shadow: 0 0 5px var(--tech-primary);
}

:deep(.el-icon) {
  font-size: 30px;
  font-weight: bold;
}
:deep(.el-select) {
  .el-select__wrapper {
    background-color: transparent;
  }
  .el-select__placeholder {
    color: #fff;
  }
  .el-icon {
    font-size: 12px;
  }
}

// 图表容器样式
.chart-container {
  position: relative;
  border: 1px solid var(--tech-border);
  border-radius: 8px;
  overflow: hidden;
  background-color: var(--tech-card-bg);
  box-shadow: var(--tech-glow);

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 1px;
    background: linear-gradient(
      90deg,
      transparent,
      var(--tech-primary),
      transparent
    );
    animation: lineMove 2s infinite;
  }
}
</style>
