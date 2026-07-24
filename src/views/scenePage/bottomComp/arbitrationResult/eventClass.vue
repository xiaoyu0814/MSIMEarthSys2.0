<template>
  <div class="eventClass">
    <div class="header">
      <span class="header-left">选择屏蔽数据</span
      ><img src="@/assets/images/rwty/closeBLConfig.svg" @click="closePanel" />
    </div>
    <div class="eventClass_content">
      <div
        v-for="(item, index) in vueData.eventList"
        :key="index"
        class="event_box"
      >
        <div class="title">{{ item.name }}</div>
        <div class="event_list">
          <div class="eventname">事件名称</div>
          <el-tree
            :data="item.value"
            :props="vueData.defaultProps"
            show-checkbox
            default-expand-all
            node-key="value"
            @check="handleChange"
          />
        </div>
      </div>
    </div>
    <div class="eventClass_footer">
      <el-button type="primary" @click="submit">确认</el-button>
      <el-button @click="closePanel" class="concelBtn">取消</el-button>
    </div>
  </div>
</template>
<script setup>
import { reactive, onBeforeMount, onMounted, watch, ref, nextTick } from 'vue'
import emitter from '@/utils/eventbus'
import { getAdjudicationEventList } from '@/service/adjudication'
import store from '@/store'
const vueData = reactive({
  eventList: [
    {
      name: '干预指令',
      id: 'gyzlTreeRef',
      value: [
        {
          id: 5,
          label: '干预指令',
          childList: [
            // { id: 1, label: '飞机起飞' },
            // { id: 2, label: '航路控制' },
            // { id: 3, label: '更新实体位置' },
            // { id: 4, label: '行动请求回应' }
          ]
        }
      ]
    },
    {
      name: '事件信息',
      id: 'sjxxTreeRef',
      value: [
        {
          id: 5,
          label: '事件信息',
          childList: [
            // { id: 1, label: 'Level one 1' },
            // { id: 2, label: 'Level one 2' },
            // { id: 3, label: 'Level one 3' },
            // { id: 4, label: 'Level one 4' }
          ]
        }
      ]
    },
    {
      name: '通讯信息',
      id: 'txxxTreeRef',
      value: [
        {
          id: 5,
          label: '通讯信息',
          childList: [
            // { id: 1, label: 'Level one 1' },
            // { id: 2, label: 'Level one 2' },
            // { id: 3, label: 'Level one 3' },
            // { id: 4, label: 'Level one 4' }
          ]
        }
      ]
    }
  ],
  defaultProps: {
    children: 'childList',
    label: 'label',
    id: 'value'
  },
  checkedEvents: []
})

//获取裁决事件列表
const getEventList = () => {
  getAdjudicationEventList().then((response) => {
    if (response.code == 200) {
      let list = response.data
      list.forEach((item) => {
        if (item.label == '干预指令') {
          vueData.eventList[0].value = [item]
        } else if (item.label == '事件信息') {
          vueData.eventList[1].value = [item]
        } else if (item.label == '通讯信息') {
          vueData.eventList[2].value = [item]
        }
      })
    }
  })
}
onBeforeMount(() => {})

onMounted(() => {
  getEventList()
})

const closePanel = () => {
  emitter.emit('sendShowEventClass', false)
  store.commit('setShowEventDialog', false)
}
const submit = () => {
  let array = []
  let checkedEventIds = vueData.checkedEvents
  if (checkedEventIds.length > 0) {
    checkedEventIds.forEach((item) => {
      array.push(item)
    })
    store.commit('setFilterEvents', array)
  }
  closePanel()
}
const handleChange = (val, arg) => {
  if (!val) return
  if (arg.checkedKeys.length > 0) {
    let checkedNodes = vueData.checkedEvents.concat(arg.checkedKeys)
    let filterNodes = [...new Set(checkedNodes)]
    vueData.checkedEvents = filterNodes
  }
}
</script>
<style lang="less" scoped>
.eventClass {
  z-index: 1000;
  width: 900px;
  height: 600px;
  position: fixed;
  right: calc(50% - 450px);
  top: 15%;
  background: rgba(2, 26, 70, 0.95);
  box-shadow: 0 0 25px #1092d5;

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 10px 15px;
    border-bottom: 1px solid #2671ac66;

    .header-left {
      font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
      font-weight: 700;
      font-style: normal;
      font-size: 19px;
      color: #c2d7ee;
    }

    img {
      position: absolute;
      right: 10px;
      top: 10px;
      cursor: pointer;
    }
  }
  .eventClass_content {
    padding-left: 10px;
    height: 480px;
    display: flex;
    justify-content: space-around;
    margin-top: 10px;
    .event_box {
      width: 100%;
      margin-right: 10px;
      .title {
        color: #fff;
        font-size: 16px;
        border: 1px solid #075d89;
      }
      .event_list {
        text-align: left;
        color: #ffffff;
        padding: 5px;
        height: 430px;
        margin-top: 10px;
        border: 1px solid #075d89;
        :deep(.el-tree) {
          background: transparent;
          color: #fff;
        }
        :deep(.el-tree-node:focus > .el-tree-node__content) {
          background: #006eb1;
          color: #fff;
        }
        :deep(.el-tree-node__content:hover) {
          background: #064773;
          color: #fff;
        }
        .eventname {
          padding: 5px 0;
          font-size: 15px;
        }
      }
    }
  }
  .eventClass_footer {
    padding: 10px 15px;
    display: flex;
    justify-content: flex-end;
    .el-button {
      background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
      width: 65px;
      height: 32px;
      color: #ffff;
      border-radius: 5px;
      margin-left: 10px;
      cursor: pointer;
    }
    .concelBtn {
      background: #fff !important;
      color: black;
    }
  }
}
::v-deep(.el-tabs__item) {
  color: #ffffff;
}
::v-deep(.el-tabs__item.is-active) {
  color: #409eff;
}
::v-deep(.el-tabs__item:hover) {
  color: #409eff;
}

::v-deep(.el-checkbox) {
  color: #ffffff;
}
::v-deep .el-table td.el-table__cell,
::v-deep .el-table th.el-table__cell.is-leaf,
::v-deep .el-table__body-wrapper {
  background: #2b4559 !important;
  color: #a3a6ad;
}
.el-table {
  --el-table-border-color: #075d89;
}
</style>
