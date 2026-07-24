<template>
  <div class="recognition-result">
    <carousel :accidentList="state.accidentList"></carousel>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import carousel from '@/components/content/carousel/carousel'
const state = reactive({
  accidentList: [
    {
      image: require('@/assets/image/rotationChart/img1.png'),
      description:
        '2022年3月3日，兴达电厂操作人员未依照标准填充绝缘气体，引发龙崎超高压变电所发电机跳脱，造成电力供需失衡。全台549万户受影响。'
    },
    {
      image: require('@/assets/image/rotationChart/img2.png'),
      description:
        '2021年12月12日，台北万隆变电所变压器失火，浓烟影响供电系统引发汇流排跳脱。新北市和台北市共30.5万户受影响'
    },
    {
      image: require('@/assets/image/rotationChart/img3.png'),
      description:
        '2021年5月17日，兴达电厂1号机锅炉燃烧管理系统模组故障，导致机组跳机。加上水力发电不足、用电量大增导致停电。全台100万户受影响'
    },
    {
      image: require('@/assets/image/rotationChart/img4.png'),
      description:
        '2021年5月13日，高雄超高压变电所汇流排故障，导致兴达电厂4部机组跳机，全台462万户受影响'
    },
    {
      image: require('@/assets/image/rotationChart/img5.png'),
      description:
        '2017年8月15日，岛内中油天然气管线意外断气，导致大潭发电厂6部机组跳机，全台592万户受影响。'
    },
    {
      image: require('@/assets/image/rotationChart/img6.png'),
      description:
        '2017年8月15日，岛内中油天然气管线意外断气，导致大潭发电厂6部机组跳机，全台592万户受影响。'
    },
    {
      image: require('@/assets/image/rotationChart/img7.png'),
      description:
        '2017年8月15日，岛内中油天然气管线意外断气，导致大潭发电厂6部机组跳机，全台592万户受影响。'
    },
    {
      image: require('@/assets/image/rotationChart/img8.png'),
      description:
        '2017年8月15日，岛内中油天然气管线意外断气，导致大潭发电厂6部机组跳机，全台592万户受影响。'
    },
    {
      image: require('@/assets/image/rotationChart/img9.png'),
      description:
        '2017年8月15日，岛内中油天然气管线意外断气，导致大潭发电厂6部机组跳机，全台592万户受影响。'
    }
  ]
})
</script>

<style lang="less" scoped>
.recognition-result {
  width: 60%;
  position: absolute;
  bottom: 5%;
  left: 20%;
}
</style>
