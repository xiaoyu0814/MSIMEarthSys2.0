<!--
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-04-10 17:27:40
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2024-04-11 18:12:22
 * @FilePath: \MSIMEarthSysN\src\components\sate\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="satellite-container animate__animated animate__fadeIn">
    <div class="item-container">
      <div class="item-title">
        {{ state.satelliteName }}
      </div>
      <img
        src="@/assets/image/panelIcons/关闭icon.png"
        alt=""
        class="close_sty"
        @click="handleClose"
      />
      <img class="satellite-img" :src="state.satelliteImage" />
      <el-form class="satellite-info" label-width="100px">
        <el-form-item label="工作状态："
          ><span style="color: #00c7fb; font-weight: 800; font-size: 16px"
            >正常</span
          >
        </el-form-item>
        <el-form-item label="通信对象：">LAX地面站、LSC地面站</el-form-item>
      </el-form>
      <!-- <div class="second-title">通信设备挂载详情</div> -->
      <!-- <li
        v-for="(item, index) in state.satelliteCommData"
        :key="index"
        style="margin-top: 0px; margin-bottom: 0px"
      >
        <div class="child-infor">
          {{ item.commName }}
          <el-form v-for="(child, index1) in item.data" :key="index1">
            <el-form-item>
              <label>{{ child.name }}</label>
            </el-form-item>
          </el-form>
        </div>
      </li> -->
      <div class="profile-performance">挂 载 情 况</div>
      <el-table
        ref="multipleTableRef"
        :data="state.tableData"
        style="width: 100%"
        :selectable="false"
        stripe
        :header-cell-style="{
          color: '#409eff',
          fontStyle: 'italic',
          backgroundColor: '#44546A',
          fontSize: '16px',
          textAlign: 'center',
          border: 'none'
        }"
        :cell-style="{
          textAlign: 'center',
          border: 'none',
          borderBottom: 'none',
          overflow: 'initial',
          fontSize: '14px',
          whiteSpace: 'pre-wrap'
        }"
      >
        <el-table-column property="parameter" style="width: 30%" label="名称" />
        <el-table-column
          property="performance"
          style="white-space: pre-wrap"
          label="参数(通信距离)"
        />
      </el-table>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, onMounted } from 'vue'
import store from '@/store'
import emitter from '@/utils/eventbus'

const state = reactive({
  satelliteName: '北斗卫星-C30',
  satelliteImage: '北斗卫星-C30',
  tableData: [
    {
      parameter: '下行通信设备-1',
      performance: '最小:0  \n最大:120000'
    },
    {
      parameter: '数据更新通信设备-1',
      performance: '最小:0  \n最大:120000'
    },
    {
      parameter: '下行通信设备-2',
      performance: '最小:0  \n最大:120000'
    },
    {
      parameter: '数据更新通信设备-2',
      performance: '最小:0  最大:120000'
    }
  ]
})

onMounted(() => {
  state.satelliteName = store.state.sceneModule.satelliteInfo.name
  state.satelliteImage =
    state.satelliteName == 'A51卫星'
      ? require('@/assets/image/satellite/BB_A51.png')
      : require('@/assets/image/satellite/BB_beidou.png')
})
watch(
  () => store.state.sceneModule.satelliteInfo,
  (newValue, oldValue) => {
    state.satelliteName = newValue.name
  }
)
const handleClose = () => {
  emitter.emit('Showsatellite', false)
}
</script>

<style lang="less" scoped>
.satellite-container {
  position: absolute;
  left: 2%;
  top: 12%;
  width: 520px;
  display: flex;
  justify-content: left;
  align-items: flex-end;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  white-space: pre-wrap;
  .item-container {
    width: 98.8%;
    height: 97.4%;
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;
    .item-title {
      text-align: left;
      font-size: 20px;
      font-weight: 500;
      color: #00c7fb;
      display: flex;
      align-items: center;
      margin: 5px 10px;
      font-family: MFLiHei_Noncommercial-Regular; //
      &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 20px;
        margin-right: 5px;
        background: #1092d5;
      }
    }
    .close_sty {
      cursor: pointer;
      position: absolute;
      top: 10px;
      right: 20px;
      width: 20px;
      height: 20px;
    }
    .satellite-img {
      margin-top: 5px;
      width: 80%;
      height: 180px;
    }
    .second-title {
      text-align: center;
      font-size: 20px;
      font-weight: 1000;
      width: 100%;
      color: #00c7fb;
      margin-left: 15px;
      margin-top: 15px;
    }
    .satellite-info {
      color: white;
      margin-left: 15px;
      :deep(.el-form) {
        margin: 0 2px;
        align-items: left;
      }
      :deep(.el-form-item__label) {
        color: white;
        font-size: 15px;
      }
      :deep(.el-form-item__content) {
        color: white;
        font-size: 15px;
      }
      :deep(.el-form-item) {
        display: flex;
        margin-bottom: 1px;
      }
    }
    .profile-performance {
      width: 92%;
      height: 40px;
      box-sizing: border-box;
      color: #409eff;
      font-size: 22px;
      font-weight: 800;
      margin: 10px 10px 0px 10px;
      font-style: italic;
    }
    :deep(.el-table) {
      background: rgba(0, 0, 0, 0);
      color: white;
      padding: 5px 15px;
      text-align: center;
      border: none;
      overflow: initial;
      white-space: pre-wrap;
      bottom: 15px;
    }

    :deep(.el-table thead) {
      color: white;
      background: #387ca6;
      border: none;
    }

    :deep(.el-table tr) {
      background: rgba(0, 0, 0, 0);
      border: none;
      white-space: pre-wrap;
    }

    :deep(.el-table__body tr.el-table__row--striped td) {
      background-color: #44546a;
    }

    :deep(.el-table__body tr:hover > td) {
      background-color: rgb(2, 26, 70, 255) !important;
      border: none;
      height: 0px;
    }
    .item {
      display: flex;
      align-items: center;
      justify-content: space-between;
      margin: 10px 10px;
      color: white;

      .itemWidth {
        width: 20%;
        align-content: right;
      }

      .itemWidth1 {
        width: 80%;
        text-align: left;
        font-size: 20px;
        font-weight: 700;
        color: white;
      }
    }
  }
}
</style>
