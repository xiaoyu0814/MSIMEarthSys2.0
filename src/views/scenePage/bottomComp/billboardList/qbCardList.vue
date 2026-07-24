<template>
  <div class="listBox">
    <el-row :gutter="15" class="cardContainer">
      <el-col
        :span="3"
        class="card"
        v-for="(value, index) in props.cardData"
        :key="index"
      >
        <div class="cardContent">
          <ul>
            <li v-for="(item, num) in value.inforList" :key="num">
              <span
                :class="{
                  bgStyle1: num == 0,
                  bgStyle2: index == 0 && num == 0,
                  bgStyle3: index == 1 && num == 0,
                  bgStyle4: index == 2 && num == 0
                }"
                >{{ item.value }}</span
              >
            </li>
          </ul>
        </div>
      </el-col>
    </el-row>

    <!-- <ul class="cardContainer">
      <li class="card" v-for="(value, index) in props.cardData" :key="index">

      </li>
    </ul> -->
  </div>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'
import emitter from '@/utils/eventbus'
import store from '@/store'
const state = reactive({
  cardList: []
})
const props = defineProps({
  cardData: {
    type: Array,
    defind: []
  }
})
onMounted(() => {})
</script>

<style lang="less" scoped>
.listBox {
  .cardContainer {
    .card {
      .cardContent {
        margin: 0 20px;
        ul {
          margin: 0;
          background: #6a6666a1;
          padding: 5px 0;
          border-radius: 15px;
          li {
            margin: 8px 5px;
            font-size: 16px;
            .bgStyle1 {
              background: #837979;
              display: inline-block;
              padding: 3px 20px;
            }
            .bgStyle2 {
              background: rgba(245, 154, 35, 1);
            }
            .bgStyle3 {
              background: rgba(191, 191, 0, 1);
            }
            .bgStyle4 {
              background: rgba(112, 182, 3, 1);
            }
          }
        }
      }
    }
  }
}
</style>
