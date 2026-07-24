<!--
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2025-05-16 09:22:56
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2025-05-16 10:24:14
 * @FilePath: \sjzWeb\src\views\experimentalPreparation\dataConfig\components\step1.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="sceneConstruction">
    <div class="s-content">
      <el-form label-width="120px">
        <el-form-item label="作战实验名称">
          <el-input
            v-model="vueData.createSceneInfo.name"
            style="width: 300px"
          ></el-input>
        </el-form-item>
        <el-form-item label="作战实验关联场景">
          <el-upload
            ref="uploadElement"
            style="width: 100px"
            :class="{ disabled: vueData.noUpload }"
            :action="vueData.uploadUrl"
            list-type="picture-card"
            :limit="1"
            :headers="vueData.updataHeaders"
            :file-list="vueData.faceList"
          >
            <el-icon>
              <Plus />
            </el-icon>
          </el-upload>
        </el-form-item>
        <el-form-item label="作战想定时间">
          <el-date-picker
            v-model="vueData.createSceneInfo.startDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 200px"
          />
          -
          <el-date-picker
            v-model="vueData.createSceneInfo.endDate"
            type="datetime"
            value-format="YYYY-MM-DD HH:mm:ss"
            style="width: 200px"
          />
        </el-form-item>
        <el-form-item label="作战计划任务">
          <el-input
            type="textarea"
            v-model="vueData.createSceneInfo.background"
            style="width: 300px"
            resize="none"
          ></el-input>
        </el-form-item>
        <el-form-item label="作战评估指标">
          <el-select
            v-model="vueData.createSceneInfo.info"
            style="width: 300px"
          ></el-select>
        </el-form-item>
        <el-form-item label="作战实验方法">
          <el-select
            v-model="vueData.createSceneInfo.purpose"
            style="width: 300px"
          ></el-select>
        </el-form-item>
        <el-form-item label="作战实验评估">
          <el-select
            v-model="vueData.createSceneInfo.scenarioDetail"
            style="width: 300px"
          ></el-select>
        </el-form-item>
      </el-form>
      <div class="footer">
        <el-button @click="goBack">返回上一级</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive } from 'vue'
import emitter from '@/utils/eventbus'
const vueData = reactive({
  createSceneInfo: {
    name: '',
    background: '',
    info: '',
    purpose: '',
    picPath: '',
    picUrl: '',
    startDate: '',
    endDate: '',
    scenarioDetail: '',
    scenarioWarEnvironment: '',
    intelligenceParam: ''
  },
  uploadUrl: '',
  updataHeaders: {
    Authorization: window.sessionStorage.getItem('token')
  },
  faceList: [],
  noUpload: false
})

// 返回上一级
const goBack = () => {
  emitter.emit('setpGoBack', true)
}
// 保存
const save = () => {
  ElMessage.success('保存成功！')
}
</script>
<style lang="less" scoped>
.sceneConstruction {
  width: 100%;
  height: 100%;
  background: #00254e;
  .s-content {
    height: 100%;
    width: 100%;
    padding: 20px;
    padding-left: 200px;
    box-sizing: border-box;
    overflow: auto;
  }
}
:deep(.el-input) {
  .el-input__wrapper {
    border-radius: 5px;
    box-shadow: none;
    background-color: #00254e !important;
    box-shadow: 0 0 0 1px #81d3f8 inset !important;
  }
  .el-input__inner {
    color: #fff !important;
  }
}
:deep(.el-form-item__label) {
  color: #fff;
  font-size: 16px;
}
:deep(.el-input) {
  .el-input__wrapper {
    border-radius: 5px;
    box-shadow: none;
    background-color: #00254e !important;
    box-shadow: 0 0 0 1px #81d3f8 inset !important;
  }
  .el-input__inner {
    color: #fff !important;
  }
}
.el-select {
  width: 100%;
  :deep(.el-select__wrapper) {
    background-color: #00254e !important;
    box-shadow: 0 0 0 1px #81d3f8 inset !important;
  }
}
:deep(.el-textarea__inner) {
  height: 90px;
  border-radius: 5px;
  box-shadow: none;
  color: #ffff;
  background-color: #00254e !important;
  box-shadow: 0 0 0 1px #81d3f8 inset !important;
}
::v-deep(.el-select__placeholder) {
  color: #fff;
}
.el-button--small {
  font-size: 15px;
}
* {
  box-sizing: border-box;
}
</style>
