<!--
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2025-06-30 11:06:48
 * @LastEditors: 谢小宇
 * @LastEditTime: 2025-08-06 09:32:21
 * @FilePath: \gfdx\src\views\infomationStatistics\components\InfoMiddle.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="main_middle">
    <div class="main_middle_list">
      <img src="~@/assets/images/infoStatistics/main_middle.png" />
      <div class="main_list_title main_list_title1">机器狗</div>
      <span ref="counter" class="main_list_title_num main_list_title_num1">
        {{ currentValue.toFixed(0) }}
      </span>
    </div>
    <div class="main_middle_list">
      <img src="~@/assets/images/infoStatistics/main_middle.png" />
      <div class="main_list_title main_list_title2">镇</div>
      <span class="main_list_title_num main_list_title_num2">0</span>
    </div>
    <div class="main_middle_list">
      <img src="~@/assets/images/infoStatistics/main_middle.png" />
      <div class="main_list_title main_list_title3"></div>
      <span class="main_list_title_num main_list_title_num3">0</span>
    </div>
    <div class="main_middle_list">
      <img src="~@/assets/images/infoStatistics/main_middle.png" />
      <div class="main_list_title main_list_title4"></div>
      <span class="main_list_title_num main_list_title_num4">0</span>
    </div>
    <div class="main_middle_list">
      <img src="~@/assets/images/infoStatistics/main_middle.png" />
      <div class="main_list_title main_list_title5"></div>
      <span class="main_list_title_num main_list_title_num5">0</span>
    </div>
  </div>
</template>

<script setup>
import { creatScene } from '@/views/homeHeader/hooks/index'
import { onMounted, reactive, ref, defineProps, watch } from 'vue'
import store from '@/store/index'
import emitter from '@/utils/eventbus'
import * as echarts from 'echarts'
import gsap from 'gsap'

const props = defineProps({
  platformCountMiddle: {
    type: Number,
    required: true,
    default: 100
  },
  duration: {
    type: Number,
    default: 3
  }
})

const currentValue = ref(0)
const counter = ref(null)

onMounted(() => {
  currentValue.value = props.platformCountMiddle
  var dataArr = [
    { name: '无人狗', value: 200 },
    { name: 'J-20', value: 500 },
    { name: '自杀无人机', value: 400 },
    { name: 'XX型登陆艇', value: 350 },
    { name: '侦察机', value: 363 }
  ]
  // 中间滚动数据展示
  setTimeout(() => {
    for (var j = 1; j < dataArr.length; j++) {
      let element = document.getElementsByClassName(
        'main_list_title_num' + (j + 1)
      )[0]
      element.className = 'counter-value'
      element.textContent = dataArr[j].value
      document.getElementsByClassName(
        'main_list_title' + (j + 1)
      )[0].textContent = dataArr[j].name
    }
  }, 100)
})

watch(
  () => props.platformCountMiddle,
  (newVal) => {
    gsap.to(currentValue, {
      duration: props.duration,
      value: newVal,
      ease: 'power1.out',
      onUpdate: () => {
        // 可以在这里添加额外的逻辑
      }
    })
  }
)
</script>

<style lang="less" scoped></style>
