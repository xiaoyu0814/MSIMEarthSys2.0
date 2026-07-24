<template>
  <div class="target-container">
    <div v-for="item in state.targetList" class="target-item">
      <div class="item-container">
        <div class="item-title">{{ item.title }}</div>
        <el-form :model="item.formData" label-width="60px">
          <el-form-item label="经度："
            >{{ item.formData.longitude }}
          </el-form-item>
          <el-form-item label="纬度：">{{
            item.formData.latitude
          }}</el-form-item>
          <el-form-item label="高度：">{{ item.formData.height }}</el-form-item>
          <el-form-item label="速度：">{{ item.formData.speed }} </el-form-item>
          <el-form-item label="载弹："
            >{{ item.formData.ammunitionCarrier }}
          </el-form-item>
          <el-form-item label="油量："
            >{{ item.formData.OilQuantity }}
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'

const state = reactive({
  targetList: [
    {
      title: 'J-20',
      formData: {
        longitude: '121.412322',
        latitude: '23.978216',
        height: '3920.153176',
        speed: '0.5',
        ammunitionCarrier: 'PL-15中距离空空导弹',
        OilQuantity: 1
      }
    },
    {
      title: 'J-16',
      formData: {
        longitude: '121.412322',
        latitude: '23.978216',
        height: '3920.153176',
        speed: '0.5',
        ammunitionCarrier: 'PL-10近距离格斗导弹',
        OilQuantity: 10
      }
    },
    {
      title: 'J-16',
      formData: {
        longitude: '121.412322',
        latitude: '23.978216',
        height: '3920.153176',
        speed: '0.5',
        ammunitionCarrier: 'PL-10近距离格斗导弹',
        OilQuantity: 10
      }
    },
    {
      title: 'J-16',
      formData: {
        longitude: '121.412322',
        latitude: '23.978216',
        height: '3920.153176',
        speed: '0.5',
        ammunitionCarrier: 'PL-10近距离格斗导弹',
        OilQuantity: 10
      }
    },
    {
      title: 'J-16',
      formData: {
        longitude: '121.412322',
        latitude: '23.978216',
        height: '3920.153176',
        speed: '0.5',
        ammunitionCarrier: 'PL-10近距离格斗导弹',
        OilQuantity: 10
      }
    },
    {
      title: 'J-16',
      formData: {
        longitude: '121.412322',
        latitude: '23.978216',
        height: '3920.153176',
        speed: '0.5',
        ammunitionCarrier: 'PL-10近距离格斗导弹',
        OilQuantity: 10
      }
    },
    {
      title: 'J-16',
      formData: {
        longitude: '121.412322',
        latitude: '23.978216',
        height: '3920.153176',
        speed: '0.5',
        ammunitionCarrier: 'PL-10近距离格斗导弹',
        OilQuantity: 10
      }
    }
  ]
})
</script>

<style lang="less" scoped>
.target-container {
  position: absolute;
  left: calc(50% - 600px);
  bottom: 32px;
  // display: flex;
  // justify-content: center;
  // align-items: flex-end;
  width: 1200px;
  height: 300px;
  overflow-y: hidden;
  overflow-x: auto;
  white-space: nowrap;
  z-index: 1111;

  .target-item {
    flex-grow: 0;
    flex-shrink: 0;
    height: 300px;
    width: 250px;
    background-image: url('~@/assets/image/panelIcons/装饰.png');
    background-repeat: no-repeat;
    background-size: 100% 100%;
    display: inline-flex;
    justify-content: center;
    align-items: center;
    margin-right: 10px;

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
        font-family: Georgia, serif;

        &::before {
          content: '';
          display: inline-block;
          width: 4px;
          height: 20px;
          margin-right: 5px;
          background: #1092d5;
        }
      }

      :deep(.el-form) {
        margin: 0 10px;
      }

      :deep(.el-form-item__label) {
        color: white;
      }

      :deep(.el-form-item__content) {
        color: white;
      }

      :deep(.el-form-item) {
        margin-bottom: 10px;
      }
    }
  }
}
</style>
