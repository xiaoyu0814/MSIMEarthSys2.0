<template>
  <div class="listBox">
    <el-row :gutter="15" class="cardContainer">
      <el-col
        :span="3"
        class="card"
        v-for="(value, index) in props.cardData"
        :key="index"
      >
        <div class="cardContent" @click="cardDataObj(value)">
          <div class="plateImg">
            <img :src="value.image" />
          </div>
          <ul>
            <li>
              <div
                class="plateName"
                :class="{
                  bgStyle1: value.level == '1',
                  bgStyle2: value.level == '2',
                  bgStyle3: value.level == '3',
                  bgStyle4: value.level == '4',
                  bgStyle5: value.level == '5'
                }"
              >
                {{ value.name }}
              </div>
            </li>
            <li v-for="(item, num) in value.inforList" :key="num">
              <label> {{ item.name }}： </label>
              <span>{{ item.value }}</span>
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
import { useStore } from 'vuex'
const store = useStore()
const state = reactive({
  cardList: []
})
const props = defineProps({
  cardData: {
    type: Array,
    defind: []
  }
})

const cardDataObj = (val) => {
  console.log(val)
}
onMounted(() => {})
</script>

<style lang="less" scoped>
.listBox {
  .cardContainer {
    margin: 7px 0 !important;
    .card {
      .cardContent {
        position: relative;
        margin: 0;
        background: #6a6666a1;
        padding: 5px 0;
        border-radius: 15px;
        .plateImg {
          position: absolute;
          top: 66px;
          left: 21px;
        }
        ul {
          li {
            margin: 8px 5px;
            font-size: 16px;
            .bgStyle1 {
              //background: rgba(245, 154, 35, 1);
              background: rgba(229, 52, 10, 1);
            }
            .bgStyle2 {
              //background: rgba(191, 191, 0, 1);
              background: rgba(245, 154, 35, 1);
            }
            .bgStyle3 {
              //background: rgba(112, 182, 3, 1);
              background: rgba(228, 222, 58, 0.6);
            }
            .bgStyle4 {
              background: rgba(96, 212, 59, 0.6);
            }
            .bgStyle5 {
              background: rgba(160, 165, 171, 0.6);
            }
            .plateName {
              width: 76%;
              margin: 0 auto;
              padding: 3px 1px;
            }
          }
        }
      }
    }
  }
}
</style>
