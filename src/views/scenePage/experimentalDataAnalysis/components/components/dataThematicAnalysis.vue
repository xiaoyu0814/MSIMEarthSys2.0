<template>
  <div id="dataThematicAnalysis">
    <ul class="searthBox">
      <li>
        <span>专题名称：</span>
        <el-input
          v-model="state.searchName"
          placeholder="请输入实验名称"
          style="width: 200px"
        />
      </li>
      <li>
        <el-button type="primary">查询</el-button>
      </li>
      <li>
        <el-button type="primary">重置</el-button>
      </li>
      <li>
        <el-button type="primary" :icon="Plus">自定义专题</el-button>
      </li>
    </ul>
    <el-carousel height="500px" :autoplay="false" indicator-position="outside">
      <el-carousel-item v-for="item in state.data" :key="item">
        <ul class="imgBox">
          <li class="imgItem" v-for="children in item.children" :key="children">
            <img :src="children.img" />
            <p>{{ children.label }}</p>
          </li>
        </ul>
      </el-carousel-item>
    </el-carousel>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import { Plus } from '@element-plus/icons-vue'
import img1 from '@/assets/images/dataaaa/u3777.png'
import img2 from '@/assets/images/dataaaa/u4717.png'

const state = reactive({
  data: [
    {
      label: '',
      children: [
        { label: '作战样式专题分析', img: img1 },
        { label: '攻防类型专题分析', img: img2 },
        { label: '战场环境专题分析', img: img2 },
        { label: '作战运用专题分析', img: img2 }
      ]
    },
    {
      label: '',
      children: [
        { label: '影响因素专题分析', img: img1 },
        { label: '指挥链路专题分析', img: img2 },
        { label: '通信链路专题分析', img: img2 },
        { label: '火力打击链路专题分析', img: img2 }
      ]
    }
  ]
})
</script>

<style lang="less" scoped>
#dataThematicAnalysis {
  .searthBox {
    display: flex;
    align-items: center;
    li {
      padding: 20px;
      padding-left: 0;
    }
  }

  .imgBox {
    height: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0;
    margin: 0;
    .imgItem {
      height: 100%;
      position: relative;
      img {
        height: 100%;
      }
      p {
        position: absolute;
        bottom: 20px;
        left: 5px;
        right: 0;
        color: #ffffff;
        background-color: #549de2;
        text-align: center;
        padding: 20px;
        font-size: 20px;
        font-weight: bold;
      }
    }
  }

  :deep(.el-input__wrapper) {
    background-color: transparent;
    box-shadow: 0 0 0 1px #81d3f8 inset;
    .el-input__inner {
      color: #ffffff;
    }
  }
}
</style>
