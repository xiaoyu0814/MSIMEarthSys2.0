<!--
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-06-18 16:43:03
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2024-06-19 09:46:42
 * @FilePath: \MSIMEarthSysNHFY\src\components\terrainExagg\index.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->

<template>
  <div class="target-container">
    <div class="container-main">
      <div class="buttonTitle">毁伤程度</div>
      <div class="inputOption">
        <div class="hsdiv">
          <span>flight_lead_south:{{ targetHS1 }}</span>
        </div>
        <div class="hsdiv">
          <span>200_ew_radar:{{ targetHS2 }}</span>
        </div>
        <div class="hsdiv">
          <span>BlueArtillery4:{{ targetHS3 }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getPlatformState } from '@/service/afsim'
import { reactive, onMounted, ref } from 'vue'
import store from '@/store/index'
import emitter from '@/utils/eventbus'
const state = reactive({
  formData: {
    terrainExagg: 0
  },
  rules: {
    terrainExagg: [{ required: true, message: '请输入参数', trigger: 'blur' }]
  },
  startST: true
})
const targetHS1 = ref(0)
const targetHS2 = ref(0)
const targetHS3 = ref(0)

const changeTerrainExagg = (value) => {
  window.EarthViewer.scene.globe.terrainExaggeration = value
}
const ruleFormRef = ref(null)

const resetTerrainExagg = () => {
  state.formData.terrainExagg = 1.0
  window.EarthViewer.scene.globe.terrainExaggeration =
    state.formData.terrainExagg
}

const confirmTerrainExagg = async (formEl) => {
  //更新store中的值
  await formEl.validate((valid) => {
    if (valid) {
      store.commit('setTerrainExaggeration', state.formData.terrainExagg)
    }
  })
}
const getHSYZ1 = () => {
  let params = { platform: hsyz[0] }
  getPlatformState(params).then((res) => {
    if (res.status == 'success') {
      targetHS1.value = res.data.DamageFactor
    } else {
      // ElMessage.error("获取红方装备信息失败")
    }
  })
}
const getHSYZ2 = () => {
  let params = { platform: hsyz[1] }
  getPlatformState(params).then((res) => {
    console.log(res)
    if (res.status == 'success') {
      targetHS2.value = res.data.DamageFactor
    } else {
      // ElMessage.error("获取红方装备信息失败")
    }
  })
}
const getHSYZ3 = () => {
  let params = { platform: hsyz[2] }
  getPlatformState(params).then((res) => {
    if (res.status == 'success') {
      targetHS3.value = res.data.DamageFactor
    } else {
      // ElMessage.error("获取红方装备信息失败")
    }
  })
}
let st = setInterval(() => {
  console.log('获取会上银子')
  getHSYZ1()
  getHSYZ2()
  getHSYZ3()
  if (!state.startST) {
    clearInterval(st)
  }
}, 3000)
emitter.on('hsyz', (res) => {
  state.startST = false
})
onMounted(() => {
  state.formData.terrainExagg = store.state.sceneModule.terrainExaggeration
})
</script>

<style lang="less" scoped>
.target-container {
  position: fixed;
  right: calc(1vw + 5%);
  bottom: 3%;
  width: 388px;
  background-image: url('~@/assets/image/panelIcons/装饰.png');
  background-repeat: no-repeat;
  background-size: 100% 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 11;
  .container-main {
    padding: 15px;
    height: 97%;
    width: 100%;
    background: rgba(2, 26, 70, 0.88);
    box-shadow: 0 0 25px #1092d5;
    display: flex;
    flex-direction: column;

    .buttonTitle {
      width: 100%;
      text-align: left;
      font-size: 20px;
      font-weight: 500;
      color: #00c7fb;
      display: flex;
      align-items: center;

      &::before {
        content: '';
        display: inline-block;
        width: 4px;
        height: 20px;
        margin-right: 5px;
        background: #1092d5;
      }
    }
  }
}
.hsdiv {
  color: aliceblue;
}
.scene_input {
  border: none !important;

  :deep(.el-input__inner) {
    font-size: 18px;
    font-weight: 500;
    color: #06d6f9;
    border: none !important;
    text-align: center;
  }

  :deep(.el-input__wrapper) {
    background-color: #172e51 !important;
    box-shadow: 0 0 25px #1092d5;
  }

  :deep(.el-input) {
    --el-input-border-color: #e5e5e500 !important;
    --el-input-hover-border: transparent !important;
    --el-input-focus-border: transparent !important;
    --el-input-placeholder-color: #06d6f9;
  }

  :deep(.el-select) {
    --el-select-border-color-hover: transparent !important;
    --el-select-input-focus-border-color: transparent !important;
  }

  :deep(.el-input__wrapper:hover) {
    border: none !important;
    box-shadow: none;
  }
}
.inputOption {
  margin-top: 10px;
  :deep(.el-form-item__label) {
    color: white;
  }

  :deep .el-input__wrapper {
    background: rgba(32, 97, 121, 0.45);
    border: 1px solid rgba(100, 199, 213, 1);
    border-radius: 4px;

    .el-input__inner {
      color: white;
    }
  }
  .fromItemLabel {
    color: #fff;
    cursor: pointer;
    margin-left: -50px !important;
  }
  .form_staticParameters {
    color: white;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }
}

.select_btn {
  display: flex;
  justify-content: flex-end;
  margin-top: 10px;
  .el-button {
    background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
    width: 80px;
    height: 25px;
    color: #ffff;
    border-radius: 5px;
    margin-left: 10px;
    cursor: pointer;
  }
  .el-button:disabled {
    color: #cccccc;
    border: none;
    cursor: auto;
  }
}

:deep(.el-form-item) {
  margin-bottom: 10px;
}
</style>
