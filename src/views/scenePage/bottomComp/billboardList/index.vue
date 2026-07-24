<template>
  <div class="arbitrationResult_box">
    <div class="header">
      <div class="title">威胁信息</div>
      <img
        src="@/assets/image/panelIcons/关闭icon.png"
        alt=""
        class="close_sty"
        @click="handleClose"
      />
    </div>
    <div class="result_table">
      <div>
        <cardList
          v-show="state.cardData.length > 0"
          :cardData="state.cardData"
        ></cardList>
        <div v-show="state.cardData.length == 0">暂无数据</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'
import emitter from '@/utils/eventbus'
import cardList from './cardList'
import { useStore } from 'vuex'
const store = useStore()
const state = reactive({
  selectName: '敌方',
  cardData: [
    // {
    //   level: 4,
    //   name: '航母1',
    //   inforList: [
    //     { name: '类型', value: '航母' },
    //     { name: '速度', value: '100km/h' },
    //     { name: '航向角', value: '285°' }
    //   ],
    //   pc: '1',
    //   levelName: '低'
    // }
  ]
})
watch(
  () => state.selectName,
  (newVal, oldVal) => {}
)
onMounted(() => {
  state.cardData = []
  // let cardDatas = store.state.sceneModule.threatCardData
  // state.cardData = cardDatas
  let allThreatData = store.state.sceneModule.threatAllData
  formatterData(allThreatData)
})
//监听所有weixie目标数据变化
watch(
  () => store.state.sceneModule.threatAllData,
  (newValue, oldValue) => {
    formatterData(newValue)
  },
  { deep: true }
)
const handleClose = () => {
  emitter.emit('closeBottomControlPanel', 'three')
}
//获取所有weixie目标的威胁级别最高的的前8个
const formatterData = (allThreatData) => {
  let cardListData = []
  state.cardData = []
  if (allThreatData.length > 8) {
    cardListData = allThreatData.slice(0, 8)
  } else {
    cardListData = allThreatData
  }
  cardListData.forEach((element) => {
    let threatLevel = ''
    let imageUrl = ''
    if (element.weightValue >= 80) {
      //高威胁
      threatLevel = '1'
    } else if (element.weightValue >= 60 && element.weightValue < 80) {
      //高威胁
      threatLevel = '2'
    } else if (element.weightValue >= 40 && element.weightValue < 60) {
      //中威胁
      threatLevel = '3'
    } else if (element.weightValue >= 20 && element.weightValue < 40) {
      threatLevel = '4'
    } else {
      threatLevel = '5'
    }
    //destroyer舰船carrier航母fighter_aircraft飞机
    if (element.name.indexOf('destroyer') > -1) {
      imageUrl = require('@/assets/images/indicator/ship4.png')
    } else if (element.name.indexOf('carrier') > -1) {
      imageUrl = require('@/assets/images/indicator/aircraftcarrier2.png')
    } else {
      imageUrl = require('@/assets/images/indicator/plane2.png')
    }
    let params = {
      level: threatLevel,
      name: element.labelName,
      planteId: element.name,
      inforList: [
        { name: '类型', value: element.labelName },
        { name: '速度', value: '100km/h' },
        { name: '航向角', value: '285°' }
      ],
      image: imageUrl
    }
    state.cardData.push(params)
  })
}
/**
 * @description 点击时获取当前tab页
 * @param { Object } name 标签对象
 */
const getCardTabs = (name) => {}
</script>

<style lang="less" scoped>
.arbitrationResult_box {
  display: block;
  position: absolute;
  left: calc(50% - 800px);
  bottom: 32px;
  color: #ffffff;
  width: 1600px;
  height: 206px;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  // background-image: url('~@/assets/image/panelIcons/装饰.png');
  // background-repeat: no-repeat;
  // background-size: 100% 100%;
  // background: rgba(2, 26, 70, 0.88);
  // box-shadow: 0 0 25px #1092d5;
  .header {
    .title {
      padding: 8px 20px;
      text-align: left;
      box-sizing: border-box;
      font-size: 15px;
      font-weight: bold;
      border-bottom: 1px solid #224d7c;
    }
    .close_sty {
      cursor: pointer;
      position: absolute;
      top: 10px;
      right: 20px;
      width: 20px;
      height: 20px;
    }
  }

  .result_table {
    .btns {
      text-align: left;
      margin: 15px;
    }
  }
}
</style>
