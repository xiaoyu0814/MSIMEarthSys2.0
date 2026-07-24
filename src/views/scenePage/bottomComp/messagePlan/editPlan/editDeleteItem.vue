<template>
  <div class="editDeleteItem">
    <el-form-item label="计划名称:">
      <el-input v-model="vueData.selectItem.planName"></el-input>
    </el-form-item>
    <el-scrollbar>
      <div
        class="LLBC-box"
        v-for="(item, index) in vueData.llbc"
        :key="index"
        :class="LLBC_color[item.name].color"
      >
        <div class="LLBC-item">
          <div style="height: 30px">
            <img :src="LLBC_color[item.name].flag" />
            <span style="font-size: 15px">{{ item.name }}</span>
          </div>
        </div>
        <el-tree
          :data="item.children"
          :props="vueData.defaultProps"
          :expand-on-click-node="false"
          show-checkbox
          :node-key="vueData.nodeKey"
          :check-strictly="true"
          @check-change="handleCheckChange"
          default-expand-all
          :ref="`elTree${item.side}`"
        >
          <template #default="{ node, data }">
            <div class="node-box">
              <span class="node-label">{{ data.name }}</span>
            </div>
          </template>
        </el-tree>
      </div>
    </el-scrollbar>
  </div>
</template>
<script setup>
import { reactive, onMounted, watch, ref, nextTick } from 'vue'
import emitter from '@/utils/eventbus'
import { getLeftForceResult } from '@/service/SSE.js'
import { LLBC_color, showList } from '@/utils/LLBC_Utils.js' //LLBC配置
import store from '@/store/index'
const emit = defineEmits(['sendCloseEdit'])
const elTreered = ref('')
const elTreeblue = ref('')
const vueData = reactive({
  llbc: [
    {
      name: '红方',
      side: 'red',
      targetName: 'red',
      children: [
        {
          name: '红方力量',
          children: [],
          targetName: '红方力量'
        }
      ]
    },
    {
      name: '蓝方',
      side: 'blue',
      targetName: 'blue',
      children: [
        {
          name: '蓝方力量',
          children: [],
          targetName: '蓝方力量'
        }
      ]
    }
  ],
  defaultProps: {
    children: 'children',
    label: 'name'
  },
  selectItem: {
    entityID: '',
    itemName: '',
    planName: ''
  },
  nodeKey: 'targetName',
  checked: true,
  time: ''
})

const save = () => {}
const closePanel = () => {
  emit('sendCloseEdit', false)
}
const handleCheckChange = (data, checked, indeterminate) => {
  if (checked) {
    vueData.selectItem.entityID = data.targetName
    vueData.selectItem.itemName = data.name
  }
}
// 补充列表属性
const setValues = (red, blue) => {
  red.forEach((redItem) => {
    if (!redItem.targetName) redItem.targetName = redItem.name
    redItem.children.forEach((redChildItem) => {
      if (!redChildItem.targetName) {
        redChildItem.targetName = redChildItem.name
      }
    })
  })
  blue.forEach((blueItem) => {
    if (!blueItem.targetName) blueItem.targetName = blueItem.name
    blueItem.children.forEach((blueChildItem) => {
      if (!blueChildItem.targetName) {
        blueChildItem.targetName = blueChildItem.name
      }
    })
  })
}
const setValue = () => {
  if (vueData.selectItem && vueData.selectItem.entityID) {
    elTreered.value[0].setCheckedKeys([vueData.selectItem.entityID])
    elTreeblue.value[0].setCheckedKeys([vueData.selectItem.entityID])
  }
}
onMounted(() => {
  //获取兵力的数据
  getLeftForceResult().then((res) => {
    res.red.sideTypeJson.targetName = res.red.sideTypeJson.name
    res.blue.sideTypeJson.targetName = res.blue.sideTypeJson.name
    let redValue = res.red.sideTypeJson
    let blueValue = res.blue.sideTypeJson
    vueData.llbc[0].children[0].children = redValue.children
    vueData.llbc[1].children[0].children = blueValue.children
    setValues(
      vueData.llbc[0].children[0].children,
      vueData.llbc[1].children[0].children
    )
  })
})
watch(
  () => store.state.sceneModule.planDetail,
  (newVal, oldVal) => {
    if (newVal) {
      if (newVal.type == 'removeEntity') {
        vueData.selectItem = newVal.content
        nextTick(() => {
          setValue()
        })
      }
    }
  },
  { immediate: true, deep: true }
)
</script>
<style lang="less" scoped>
.editDeleteItem {
  text-align: center;
  padding-left: 30px;
  box-sizing: border-box;
  .LLBC-box {
    padding: 10px;
    box-sizing: content-box;
    margin-bottom: 15px;
    margin-left: 65px;
    width: 35vh;

    .LLBC-item {
      text-align: left;
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      color: #ffffff;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .utilsBTN_box {
        img {
          width: 26px;
        }
      }
      span {
        padding: 0 5px;
      }
    }

    :deep(.el-tree) {
      background: transparent;
      font-family: 'Arial Normal', 'Arial';
      font-weight: 700;
      font-style: normal;
      font-size: 13px;
      letter-spacing: normal;
      color: #ffffff;
    }
  }
  .LLBC-red {
    background-color: rgba(65, 27, 42, 1);
    border: 1px solid rgba(200, 8, 13, 1);
    :deep(.el-tree) {
      .el-tree-node__content:hover {
        background-color: rgba(161, 45, 45, 0.2);
      }

      .el-tree-node:focus > .el-tree-node__content {
        background-color: rgba(200, 8, 13, 0.8);
      }
    }
  }

  .LLBC-blue {
    background-color: rgba(16, 55, 91, 1);
    border: 1px solid rgba(9, 110, 180, 1);
    :deep(.el-tree) {
      .el-tree-node__content:hover {
        background-color: rgba(8, 165, 239, 0.2);
      }

      .el-tree-node:focus > .el-tree-node__content {
        background-color: rgba(9, 110, 180, 1);
      }
    }
  }

  .LLBC-green {
    background-color: rgb(0, 63, 5);
    border: 1px solid rgb(9, 180, 9);
    :deep(.el-tree) {
      .el-tree-node__content:hover {
        background-color: rgba(62, 239, 8, 0.2);
      }

      .el-tree-node:focus > .el-tree-node__content {
        background-color: rgb(23, 180, 9);
      }
    }
  }
}
</style>
