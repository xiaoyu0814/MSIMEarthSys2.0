<template>
  <div class="arbitrationResult_box">
    <div class="header">
      <div class="title">qingbao信息</div>
      <img
        src="@/assets/image/panelIcons/关闭icon.png"
        alt=""
        class="close_sty"
        @click="handleClose"
      />
    </div>
    <div class="result_table">
      <div class="btns">
        <el-button type="primary" @click="state.selectName = 'df'"
          >敌方</el-button
        >
        <el-button type="primary" @click="state.selectName = 'wf'"
          >我方</el-button
        >
      </div>
      <div>
        <cardList :cardData="state.cardData"></cardList>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'
import emitter from '@/utils/eventbus'
import store from '@/store'
import cardList from './cardList'
const state = reactive({
  selectName: '敌方',
  cardData: [],
  cardData1: [
    {
      inforList: [
        { value: 'F22' },
        { value: '700km/h' },
        { value: '165°,25.0°' },
        { value: '0.3km' },
        { value: '10㎡' }
      ]
    },
    {
      inforList: [
        { value: 'F18' },
        { value: '300km/h' },
        { value: '165°,24.0°' },
        { value: '0.6km' },
        { value: '5㎡' }
      ]
    },
    {
      inforList: [
        { value: 'F15' },
        { value: '600km/h' },
        { value: '165.23°,25.06°' },
        { value: '0.5km' },
        { value: '10㎡' }
      ]
    },
    {
      inforList: [
        { value: 'F15' },
        { value: '650km/h' },
        { value: '160°,25.0°' },
        { value: '0.3km' },
        { value: '10㎡' }
      ]
    },
    {
      inforList: [
        { value: 'F16' },
        { value: '460km/h' },
        { value: '160°,25.0°' },
        { value: '0.3km' },
        { value: '10㎡' }
      ]
    },
    {
      inforList: [
        { value: 'F16' },
        { value: '580km/h' },
        { value: '165°,25.0°' },
        { value: '0.3km' },
        { value: '10㎡' }
      ]
    },
    {
      inforList: [
        { value: 'F16' },
        { value: '380km/h' },
        { value: '160°,25.0°' },
        { value: '0.3km' },
        { value: '10㎡' }
      ]
    },
    {
      inforList: [
        { value: 'F16' },
        { value: '400km/h' },
        { value: '165°,25.0°' },
        { value: '0.3km' },
        { value: '10㎡' }
      ]
    }
  ],
  cardData2: [
    {
      inforList: [
        { value: '预警机' },
        { value: '200km/h' },
        { value: '160°,25.0°' },
        { value: '0.3km' },
        { value: '10㎡' }
      ]
    },
    {
      inforList: [
        { value: '电子ZC机' },
        { value: '500km/h' },
        { value: '165°,24.0°' },
        { value: '0.6km' },
        { value: '5㎡' }
      ]
    },
    {
      inforList: [
        { value: '歼11' },
        { value: '600km/h' },
        { value: '161.23°,25.06°' },
        { value: '0.5km' },
        { value: '10㎡' }
      ]
    },
    {
      inforList: [
        { value: '歼11' },
        { value: '300km/h' },
        { value: '160°,25.0°' },
        { value: '0.3km' },
        { value: '10㎡' }
      ]
    },
    {
      inforList: [
        { value: '歼20' },
        { value: '300km/h' },
        { value: '160°,25.0°' },
        { value: '0.3km' },
        { value: '10㎡' }
      ]
    },
    {
      inforList: [
        { value: 'DZ干扰机' },
        { value: '300km/h' },
        { value: '160°,25.0°' },
        { value: '0.3km' },
        { value: '10㎡' }
      ]
    },
    {
      inforList: [
        { value: '加油机' },
        { value: '300km/h' },
        { value: '160°,25.0°' },
        { value: '0.3km' },
        { value: '10㎡' }
      ]
    },
    {
      inforList: [
        { value: '运输机' },
        { value: '300km/h' },
        { value: '160°,25.0°' },
        { value: '0.3km' },
        { value: '10㎡' }
      ]
    }
  ]
})
watch(
  () => state.selectName,
  (newVal, oldVal) => {
    if (newVal == 'df') {
      state.cardData = state.cardData1
    } else if (newVal == 'wf') {
      state.cardData = state.cardData2
    }
  }
)
onMounted(() => {
  state.cardData = state.cardData1
})

const handleClose = () => {
  emitter.emit('closeBottomControlPanel', 'three')
}
/**
 * @description 点击时获取当前tab页
 * @param { Object } name 标签对象
 */
const getCardTabs = (name) => {}
</script>

<style lang="less" scoped>
.arbitrationResult_box {
  position: absolute;
  left: calc(50% - 800px);
  bottom: 32px;
  color: #ffffff;
  width: 1600px;
  height: 290px;
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
