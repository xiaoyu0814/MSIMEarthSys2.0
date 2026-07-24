<template>
  <div class="dialDetailSettingDiv">
    <div class="dialDetailSettingDiv_header">
      <div class="dialDetailSettingDiv_header_title">详标牌配置页面</div>
    </div>
    <div class="dialDetailSettingDiv_body">
      <div
        class="dialDetailSettingDiv_body_div"
        v-for="(item, index) in state.dialDetailSettingData"
        :key="index"
      >
        <el-checkbox v-model="item.check" :label="item.name" :value="item.name">
          {{ item.name }}
        </el-checkbox>
      </div>
    </div>
    <div class="dialDetailSettingDiv_footer">
      <el-button type="primary" size="small" @click="close">取消</el-button>
      <el-button type="primary" size="small" @click="confirmScene"
        >确定</el-button
      >
    </div>
  </div>
</template>

<script setup>
import store from '@/store'
import { reactive, onMounted } from 'vue'
import LocalCache from '@/utils/earthPlugin/ThirdParty/storageManagement/localStorage.js'
const emit = defineEmits(['showDialDetailSetting'])
const state = reactive({
  dialDetailSettingData: [
    { name: '经度', check: true },
    { name: '纬度', check: true },
    { name: '高度', check: true },
    { name: '航向角', check: true },
    { name: '俯仰角', check: true },
    //{ name: '滚转角', check: true },
    { name: '速度', check: true },
    // { name: '类型', value: params.type },
    { name: '任务', check: true }
  ]
})
onMounted(() => {
  console.log(state.dialDetailSettingData)
  state.dialDetailSettingData.forEach((element) => {
    let value = LocalCache.getCache(element.name)
    if (value != undefined) {
      element.check = value
    }
  })
})
const confirmScene = () => {
  state.dialDetailSettingData.forEach((element) => {
    LocalCache.setCache(element.name, element.check)
  })
  ElMessage.success('保存成功')
  // 传递一个标识，表明是从dialDetailSetting组件触发的关闭事件
  emit('showDialDetailSetting', false, { type: 'dialDetail' })
}

const close = () => {
  // 传递一个标识，表明是从dialDetailSetting组件触发的关闭事件
  emit('showDialDetailSetting', false, { type: 'dialDetail' })
}
</script>

<style lang="less" scoped>
.dialDetailSettingDiv {
  position: absolute;
  right: 24%;
  top: 10%;
  margin-top: 0px;
  height: 360px;
  width: 200px;
  z-index: 998;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background: linear-gradient(
    135deg,
    rgba(2, 26, 70, 0.95) 0%,
    rgba(0, 199, 251, 0.1) 100%
  );
  display: flex;
  flex-direction: column;
  align-items: center;
  box-shadow: 0 0 30px rgba(16, 146, 213, 0.8),
    inset 0 1px 0 rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  backdrop-filter: blur(10px);
  border: 1px solid rgba(0, 199, 251, 0.3);
  padding: 0 15px 15px;
  box-sizing: border-box;

  .dialDetailSettingDiv_header {
    height: 60px;
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .dialDetailSettingDiv_header_title {
      width: 100%;
      text-align: center;
      font-size: 18px;
      font-weight: 600;
      color: #00c7fb;
      padding: 15px 0;
      font-family: 'Arial', sans-serif;
      box-sizing: border-box;
      text-shadow: 0 0 10px rgba(0, 199, 251, 0.5);
      letter-spacing: 1px;
      border-bottom: 1px solid rgba(0, 199, 251, 0.3);
    }
  }

  .dialDetailSettingDiv_body {
    height: calc(100% - 100px);
    width: 100%;
    overflow-y: auto;
    margin: 15px 0;
    padding: 0 10px;
    box-sizing: border-box;

    .dialDetailSettingDiv_body_div {
      text-align: left;
      padding: 8px 0 8px 25px;
      margin-bottom: 8px;
      transition: all 0.3s ease;
      border-radius: 4px;

      &:hover {
        background-color: rgba(0, 199, 251, 0.1);
        transform: translateX(5px);
      }
    }
  }

  .dialDetailSettingDiv_footer {
    height: 50px;
    width: 100%;
    display: flex;
    justify-content: center;
    gap: 15px;
    align-items: center;
    border-top: 1px solid rgba(0, 199, 251, 0.3);
    padding-top: 10px;
  }
}
/* 复选框样式 */
:deep .el-checkbox {
  .el-checkbox__input {
    .el-checkbox__inner {
      background-color: rgba(2, 26, 70, 0.8);
      border-color: rgba(64, 158, 252, 0.6);
      transition: all 0.3s ease;

      &:hover {
        border-color: rgba(0, 199, 251, 0.8);
        box-shadow: 0 0 10px rgba(0, 199, 251, 0.5);
      }
    }

    &:checked {
      .el-checkbox__inner {
        background-color: rgba(0, 199, 251, 0.8);
        border-color: rgba(0, 199, 251, 1);
        box-shadow: 0 0 10px rgba(0, 199, 251, 0.6);
      }

      + .el-checkbox__label {
        color: #00c7fb;
        text-shadow: 0 0 5px rgba(0, 199, 251, 0.5);
      }
    }
  }

  .el-checkbox__label {
    color: #409efc;
    transition: all 0.3s ease;
    font-size: 14px;
    font-family: 'Arial', sans-serif;
    letter-spacing: 0.5px;
  }
}

/* 按钮样式 */
:deep .el-button {
  &.el-button--primary {
    background-color: rgba(0, 199, 251, 0.3);
    border-color: rgba(0, 199, 251, 0.6);
    color: #00c7fb;
    font-family: 'Arial', sans-serif;
    font-size: 13px;
    letter-spacing: 0.5px;
    transition: all 0.3s ease;
    box-shadow: 0 0 10px rgba(0, 199, 251, 0.3);
    border-radius: 4px;

    &:hover {
      background-color: rgba(0, 199, 251, 0.5);
      border-color: rgba(0, 199, 251, 0.8);
      color: #ffffff;
      box-shadow: 0 0 15px rgba(0, 199, 251, 0.6);
      transform: translateY(-2px);
    }

    &:active {
      background-color: rgba(0, 199, 251, 0.6);
      border-color: rgba(0, 199, 251, 1);
      transform: translateY(0);
    }
  }
}

/* 滚动条样式 */
:deep ::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

:deep ::-webkit-scrollbar-track {
  background: rgba(2, 26, 70, 0.3);
  border-radius: 3px;
}

:deep ::-webkit-scrollbar-thumb {
  background: rgba(0, 199, 251, 0.6);
  border-radius: 3px;
  box-shadow: 0 0 10px rgba(0, 199, 251, 0.5);

  &:hover {
    background: rgba(0, 199, 251, 0.8);
    box-shadow: 0 0 15px rgba(0, 199, 251, 0.8);
  }
}

:deep ::-webkit-scrollbar-corner {
  background: rgba(2, 26, 70, 0.3);
}
</style>
