<template>
  <div class="seatSituation">
    <div class="title">席位准备情况</div>
    <div class="seatSituation_content">
      <el-scrollbar height="calc(100% - 52px)">
        <div class="flex_box">
          <li
            class="List_box"
            v-for="(item, index) in state.schemeList.child"
            :key="index"
          >
            <div class="list_header">
              <span class="list_name">
                {{ item.groupName }}({{ getCamp(item.identifcation) }})
              </span>
              <div>
                <span class="list_itemLength">
                  数量：{{ item.relations.length }}
                </span>
                <!-- <span class="list_itemLength"> 在线： </span>
                <span class="list_itemLength"> 离线： </span> -->
              </div>
            </div>
            <ul class="list_item">
              <li
                v-for="(children, children_index) in item.relations"
                :key="children_index"
              >
                <div class="seatItem" v-if="item.identifcation == 1">
                  <img src="~@/assets/images/任务准备/mnq_online.png" />
                  <span style="color: #ffffff">{{
                    children.equipmentName
                  }}</span>
                </div>
                <div class="seatItem" v-else>
                  <img src="~@/assets/images/任务准备/cp_online.png" />
                  <span style="color: #ffffff">{{ children.roleName }}</span>
                </div>
              </li>
            </ul>
          </li>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, watch } from 'vue'
import store from '@/store'
import {
  getUseSeatSchemeByTaskId,
  getCampList
} from '@/service/missionPreparation/seatManagement'
const state = reactive({
  schemeList: [{ child: [] }],
  campList: []
})

const getSeatScheme = () => {
  let params = {
    taskId: sessionStorage.getItem('taskId')
  }
  getUseSeatSchemeByTaskId(params).then((res) => {
    if (res.code == 200) {
      state.schemeList = res.data
    }
  })
}

/**
 * @description 获取属方列表
 */
let _getCampList = () => {
  let params = {}
  getCampList(params).then((res) => {
    if (res.code == 200) {
      state.campList = res.data
    } else {
      ElMessage.error(res.data)
    }
  })
}

/**
 * @description 获取属方名称
 * @param { Number } index 属方索引
 * @return { String } 属方名称
 */
let getCamp = (index) => {
  if (state.campList[index] && state.campList[index].belongingName) {
    return state.campList[index].belongingName
  }
}

onMounted(() => {
  getSeatScheme()
  _getCampList()
})
</script>

<style lang="less" scoped>
.seatSituation {
  z-index: 10;
  position: absolute;
  left: calc(50% - 500px);
  top: calc(50% - 350px);
  color: #ffffff;
  width: 1000px;
  height: 650px;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  .title {
    padding: 12px 20px;
    text-align: left;
    box-sizing: border-box;
    font-size: 20px;
    font-weight: bold;
    border-bottom: 1px solid #224d7c;
  }
  .seatSituation_content {
    padding: 20px;
    box-sizing: border-box;
    .flex_box {
      // height: calc(100% - 52px);
      display: flex;
      flex-wrap: wrap;
      justify-content: space-between;
      align-content: center;
      li {
        list-style: none;
      }
      .List_box {
        background-color: #223b50;
        border-radius: 5px;
        padding: 10px;
        margin-bottom: 20px;
        width: 49%;
        box-sizing: border-box;
        .list_header {
          padding: 10px;
          display: flex;
          justify-content: space-between;
          align-items: center;
          .list_name {
            color: #fff;
            font-size: 18px;
          }
          .list_itemLength {
            padding-left: 10px;
          }
        }
        .list_item {
          display: flex;
          align-items: center;
          justify-content: flex-start;
          flex-wrap: wrap;
          padding: 0;
          margin: 0;
          li {
            display: flex;
            align-items: center;
            margin: 10px;
            cursor: pointer;
            .seatItem {
              display: flex;
              justify-content: center;
              align-items: center;
              flex-direction: column;
              // font-size: 12px;
              img {
                width: 50px;
                height: 40px;
              }
            }
          }
        }
      }
    }
  }
}
</style>
