<!--
 * @description: 杜千存 duqiancun@piesat.com
 * @Version: 1.0
 * @Author:杜千存 duqiancun@piesat.com
 * @Date: 2024-11-24 10:46:05
 * @LastEditors: 杜千存 duqiancun@piesat.cn
 * @LastEditTime: 2024-12-11 16:22:31
-->
<template>
  <div class="left_box">
    <span class="title-name">{{ vueData.title }}</span>
    <div v-for="item in vueData.dataList" :key="item.id" class="attr_list">
      <el-icon v-if="item.id == 1"><Menu /></el-icon>
      <el-icon v-else-if="item.id == 2"> <SuccessFilled /></el-icon>
      <el-icon v-else-if="item.id == 3"><Loading /> </el-icon>
      <el-icon v-else><CircleCloseFilled /> </el-icon>
      <div style="display: inline-block; margin-left: 10px">
        <span>{{ item.num }}</span>
        <span>{{ item.text }}</span>
      </div>
    </div>
    <div class="content-all">
      <div class="title-all">
        重要日志 <span @click="detailsClick">清空信息</span>
      </div>
      <realTimeInformation></realTimeInformation>
    </div>
  </div>
  <div :class="vueData.isLeftEcharts ? 'right_box_show' : 'right_box'">
    <!-- <div class="right_box"> -->
    <div class="float-bottom">
      <el-tooltip effect="light" :content="'伸缩'" placement="bottom">
        <img
          class="left-shrinks"
          :src="
            vueData.isLeftEcharts
              ? require('@/assets/image/panelIcons/telescoping_1.png')
              : require('@/assets/image/panelIcons/telescoping.png')
          "
          @click="changeRightIcon"
        />
      </el-tooltip>
    </div>

    <div class="right_echarts" v-show="vueData.isLeftEcharts">
      <div class="comparison-all">
        <span class="title-all">地面站资源利用</span>
        <axisEcharts></axisEcharts>
      </div>

      <div class="comparison-all">
        <span class="title-all">时效性</span>
        <lineEcharts></lineEcharts>
      </div>
    </div>
    <div class="right_echarts-right">
      <div class="comparison-all">
        <span class="title-all">卫星资源利用</span>
        <doubleAxisEcharts></doubleAxisEcharts>
      </div>

      <div class="comparison-all">
        <span class="title-all">任务完成情况</span>
        <radarEcharts></radarEcharts>
      </div>
      <div class="comparison-all">
        <span class="title-all">侦查类型分布</span>
        <circleEcharts></circleEcharts>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted, nextTick } from 'vue'
import { useStore } from 'vuex'
import { ElMessage, ElMessageBox } from 'element-plus'
import doubleAxisEcharts from '../components/doubleAxisEcharts.vue' //双柱状图
import axisEcharts from '../components/axisEcharts.vue' //柱状图
import radarEcharts from '../components/radarEcharts.vue' //雷达图
import lineEcharts from '../components/lineEcharts.vue' //折线图
import circleEcharts from '../components/circleEcharts.vue' //侦查类型
const store = useStore()
import {
  Menu,
  SuccessFilled,
  Loading,
  CircleCloseFilled
} from '@element-plus/icons-vue'
import realTimeInformation from '../components/realTimeInformation.vue'
import { getStatisticsRes } from '@/service/resultAnalysis.js'
const vueData = reactive({
  title: 'XX实验样本详情',
  isLeftEcharts: false,
  dataList: [
    {
      id: 1,
      text: '全部',
      icon: Menu,
      num: 39
    },
    {
      id: 2,
      text: '已完成',
      icon: SuccessFilled,
      num: 31
    },
    {
      id: 3,
      text: '侦查中',
      icon: Loading,
      num: 7
    },
    {
      id: 1,
      text: '未侦查',
      icon: CircleCloseFilled,
      num: 1
    }
  ]
})

const _getStatisticsRes = () => {
  getStatisticsRes({ sampleId: '' }).then((res) => {
    store.commit('set_sampleEchartsData', res.data)
  })
}

const changeRightIcon = () => {
  vueData.isLeftEcharts = !vueData.isLeftEcharts
}
onMounted(() => {
  _getStatisticsRes()
  setInterval(() => {
    _getStatisticsRes()
  }, 5000)
})
</script>

<style lang="less" scoped>
.left_box {
  position: absolute;
  top: 14%;
  left: 20px;
  width: 300px;
  height: 80vh;
  padding: 10px;
  box-sizing: border-box;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  z-index: 9;
  .title-name {
    color: #c2d7ee;
    font-size: 18px;
    display: block;
    text-align: left;
    font-weight: 600;
    padding: 10px;
    box-sizing: border-box;
    margin-bottom: 10px;
  }
  .content-all {
    height: calc(100% - 155px);
  }
}

.right_box,
.right_box_show {
  position: absolute;
  top: 14%;
  right: 20px;
  width: 310px;
  height: 80vh;
  padding: 10px 20px;
  z-index: 9;
  box-sizing: border-box;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  display: flex;
}
.right_box_show {
  width: 530px !important;
  height: 80vh;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
}

.attr_list {
  width: 50%;
  height: 50px;
  display: flex;
  flex-wrap: wrap;
  align-content: flex-start;
  color: #fff;
  font-size: 16px;
  display: inline-block;
  paddding: 0 20px;
  box-sizine: border-box;
  margin-bottom: 20px;
  :deep(el-icon) {
    display: inline-block;
    font-size: 40px;
    width: 40px;
    height: 40px;
    margin-right: 10px;
    margin-top: 10px;
  }
  span {
    font-size: 15px;
    display: block;
    color: #7ea0bc;
    &:nth-child(1) {
      font-size: 20px;
      font-weight: 600;
      color: #16ebee;
    }
  }
}
.title-all {
  font-size: 18px !important;
  line-height: 20px;
  color: #c2d7ee;
  display: block;
  text-align: left;
  font-weight: 600;
  padding: 10px;
  box-sizing: border-box;
  position: relative;

  span {
    color: #16ebee;
    font-size: 14px;
    position: absolute;
    top: 12px;
    right: 10px;
  }
  &::before {
    position: absolute;
    top: 4px;
    left: 2;
    width: 2px;
    height: 10px;
    background: #16ebee;
    z-index: 5;
  }
}
.right_echarts {
  flex: 1;
}
.right_echarts-right {
  flex: 1;
  .comparison-all {
    height: 33.3%;
  }
}
.float-bottom {
  display: flex;
  align-items: flex-end;
  width: 50px;
  height: 50px;
  position: absolute;
  top: 50%;
  left: 0;

  .left-shrinks {
    transform: translate(0, -50%);
    z-index: 2;
    cursor: pointer;
    width: 10px;
    font-size: 36px !important;
  }
}
</style>
