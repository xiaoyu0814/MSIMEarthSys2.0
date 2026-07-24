<template>
  <div id="sceneContent">
    <div class="background" v-if="props.sceneData.background">
      <h2 class="titleStyle" :id="props.sceneData.background.title">
        {{ props.sceneData.background.title }}
      </h2>
      <div class="timeBoxStyle">
        <el-icon>
          <Calendar />
        </el-icon>
        <span class="time">{{ props.sceneData.background.time }}</span>
      </div>
      <ul>
        <el-scrollbar max-height="300px">
          <p
            v-for="(item, index) in props.sceneData.background.content"
            :key="index"
          >
            {{ item.text }}
          </p>
        </el-scrollbar>
      </ul>
      <img :src="props.sceneData.background.imgUrl" style="width: 100%" />
    </div>
    <div class="info" v-if="props.sceneData.info">
      <h2 class="titleStyle" :id="props.sceneData.info.title">
        {{ props.sceneData.info.title }}
      </h2>
      <div class="timeBoxStyle">
        <el-icon>
          <Calendar />
        </el-icon>
        <span class="time">{{ props.sceneData.info.time }}</span>
      </div>
      <ul>
        <el-scrollbar max-height="300px">
          <p v-for="(item, index) in props.sceneData.info.content" :key="index">
            {{ item.text }}
          </p>
        </el-scrollbar>
      </ul>
    </div>
    <div class="objective" v-if="props.sceneData.objective">
      <h2 class="titleStyle" :id="props.sceneData.objective.title">
        {{ props.sceneData.objective.title }}
      </h2>
      <div class="timeBoxStyle">
        <el-icon>
          <Calendar />
        </el-icon>
        <span class="time">{{ props.sceneData.objective.time }}</span>
      </div>
      <ul>
        <el-scrollbar max-height="300px">
          <p
            v-for="(item, index) in props.sceneData.objective.content"
            :key="index"
          >
            {{ item.text }}
          </p>
        </el-scrollbar>
      </ul>
    </div>
    <div class="keywords" v-if="props.sceneData.keywords">
      <h2 class="titleStyle" :id="props.sceneData.keywords.title">
        {{ props.sceneData.keywords.title }}
      </h2>
      <div class="BlockInput">
        <el-button
          v-for="(item, index) in props.sceneData.keywords.keys"
          :key="index"
          style="padding: 25px 19px"
        >
          {{ item.label }}
        </el-button>
      </div>
    </div>
    <div class="strength" v-if="props.sceneData.strength">
      <h2 class="titleStyle" :id="props.sceneData.strength.title">
        {{ props.sceneData.strength.title }}
      </h2>
      <ul>
        <li class="red">
          <el-button
            v-for="(item, index) in props.sceneData.strength.red"
            :key="index"
            style="padding: 25px 19px; margin: 5px"
          >
            {{ item.label }}
          </el-button>
        </li>
        <li class="vs">
          <img src="~@/assets/images/vs.png" alt="vs" />
        </li>
        <li class="blue">
          <el-button
            v-for="(item, index) in props.sceneData.strength.blue"
            :key="index"
            style="padding: 25px 19px; margin: 5px"
            >{{ item.label }}</el-button
          >
        </li>
      </ul>
    </div>
    <div class="flow" v-if="props.sceneData.flow">
      <h2 class="titleStyle" :id="props.sceneData.flow.title">
        {{ props.sceneData.flow.title }}
      </h2>
      <ul class="task">
        <!-- <li
          v-if="false"
          v-for="(item, index) in props.sceneData.flow.task"
          :key="index"
        >
          <h5 class="nameBox">{{ item.name }}</h5>
          <div style="height: 100px">
            <div
              class="personnelBox"
              v-for="(personnel, index) in item.personnels"
              :key="index"
            >
              <img src="~@/assets/images/飞机.png" />
              <div>
                <strong>装备:</strong>
                <span>{{ personnel.label }}</span>
              </div>
              <div>
                <strong>数量:</strong>
                <span>{{ personnel.num }}</span>
              </div>
            </div>
          </div>
          <h2
            data-animation="fadeInUp"
            data-delay=".4s"
            style="font-size: 20px"
          >
            任务
            <span>{{ item.described }}</span>
          </h2>
        </li> -->
        <el-card
          v-for="(item, index) in props.sceneData.flow.task"
          :key="index"
          style="width: 24%"
        >
          <template #header>
            <h5 class="nameBox">{{ item.name }}</h5>
          </template>
          <div style="height: 100px">
            <div
              class="personnelBox"
              v-for="(personnel, index) in item.personnels"
              :key="index"
            >
              <img src="~@/assets/images/飞机.png" />
              <div>
                <strong>装备:</strong>
                <span>{{ personnel.label }}</span>
              </div>
              <div>
                <strong>数量:</strong>
                <span>{{ personnel.num }}</span>
              </div>
            </div>
          </div>
          <h2
            data-animation="fadeInUp"
            data-delay=".4s"
            style="font-size: 20px"
          >
            任务
            <span>{{ item.described }}</span>
          </h2>
        </el-card>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'
import { Calendar } from '@element-plus/icons-vue'

const props = defineProps({
  sceneData: {
    type: Object,
    required: true
  }
})

onMounted(() => {})
</script>

<style lang="less" scoped>
#sceneContent {
  color: #000000;
  text-align: left;
  padding-bottom: 100px;

  .background {
  }

  .info {
  }

  .objective {
  }

  .keywords {
  }

  .strength {
    ul {
      display: flex;
      align-items: center;
      font-size: 15px;
      justify-content: space-between;

      .red,
      .blue {
        width: 45%;
      }
    }
  }

  .flow {
    .task {
      // height: 200px;
      display: flex;
      // align-items: center;
      justify-content: space-between;

      li {
        width: 25%;
        box-shadow: 0px 0px 20px 0px rgb(0 0 0 / 13%);
        border-radius: 8px;
        margin-bottom: 15px;
        padding: 15px 0px;
        /* border: 1px solid #bbbbbb; */
        padding: 6px;
        margin: 5px;
        background-color: #7a7a7a00;
      }

      .nameBox {
        font-size: 20px;
        text-transform: uppercase;
        border-radius: 8px;
        display: flex;
        gap: 15px;
        // margin: 15px 0;
        margin: 0;
        font-weight: 500;
      }

      .personnelBox {
        display: flex;
        align-items: center;
        // justify-content: space-between;
        gap: 10px;
      }

      h2 {
        span {
          font-size: 16px;
          font-weight: 500;
          font-family: 'Inter', sans-serif;
        }
      }
    }
  }

  .titleStyle {
    font-size: 32px;
    line-height: 1.3;
    margin-bottom: 20px;
    padding-right: 0;
  }

  .timeBoxStyle {
    padding-top: 25px;
    border-top: 2px solid #f5f5f5;
    padding-bottom: 25px;

    .time {
      margin-left: 10px;
      display: inline-block;
      font-size: 14px;
      font-weight: 500;
      font-family: 'Inter', sans-serif;
    }
  }

  ul {
    list-style: none;
    margin: 0;
    padding: 0;

    p {
      margin: 0;
      margin-bottom: 18px;
      font-family: monospace;
      font-size: 24px;
      text-align: justify;
    }
  }

  .el-button:focus,
  .el-button:hover {
    color: #fff;
    border-color: #000;
    background-color: #000;
    outline: 0;
  }
}
</style>
