<template>
  <div id="layerManage">
    <header>
      <span>图层管理</span>
      <el-button type="primary" @click="emit('save')">保存</el-button>
    </header>
    <div class="content">
      <el-scrollbar height="400px">
        <div
          class="plotData"
          v-for="(item, index) in store.getters.get_plotLayerList"
          :key="index"
          :class="vueData.selectIndex == index ? 'select' : ''"
          @click="showLayer(item, index)"
        >
          <span>{{ item.name }}</span>
          <el-icon @click.stop="removeLayer(item.entity, index)"
            ><Close
          /></el-icon>
        </div>
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from 'vue'
import { useStore } from 'vuex'

const emit = defineEmits()

const store = useStore()

const vueData = reactive({
  selectIndex: -1
})

onMounted(() => {})

const showLayer = (item, index) => {
  vueData.selectIndex = index
  emit('showLayer', item)
}

const removeLayer = (entity, index) => {
  entity.plot.owner.entityCollection.remove(entity.plot.owner) // cesium 渲染层删除
  entity.plot.parentLayer().removePlot(entity.plot)
  store.dispatch('delete_plotLayerList', index)
}
</script>

<style lang="less" scoped>
#layerManage {
  position: absolute;
  right: 290px;
  top: 0%;
  width: 270px;
  // height: 350px;
  // background-color: #0c192a67;
  background-color: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;
  font-size: 16px;
  font-weight: bold;
  color: #ffffff;
  z-index: 22;
  header {
    padding: 10px;
    text-align: left;
    border-bottom: 1px solid #00327d;
    display: flex;
    align-items: center;
    justify-content: space-between;
    span {
      padding: 5px;
    }
  }
  .content {
    .plotData {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 10px 5px 20px;
      &:hover {
        background: #00327d;
      }
      // &:nth-of-type(1){
      //   padding-top: 10px;
      // }
      // &:last-child{
      //   padding-bottom: 10px;
      // }
    }
  }
  .select {
    background: #00327d;
  }
}
</style>
