<!--
 * @Author: caoyazhen caoyazhen@piesat.cn
 * @Date: 2024-06-13 10:43:38
 * @LastEditors: caoyazhen caoyazhen@piesat.cn
 * @LastEditTime: 2024-06-19 16:44:11
 * @FilePath: \MSIMEarthSysNHFY\src\views\homeHeader\pwdView.vue
 * @Description: 这是默认设置,请设置`customMade`, 打开koroFileHeader查看配置 进行设置: https://github.com/OBKoro1/koro1FileHeader/wiki/%E9%85%8D%E7%BD%AE
-->
<template>
  <div class="conclusion-plan">
    <div class="main-user">
      <el-form label-width="90px">
        <el-form-item label="用户名">
          {{ state2.userName }}
        </el-form-item>
        <el-form-item label="原密码">
          <el-input
            class="item-input"
            v-model="state2.originalPwd"
            type="password"
          />
        </el-form-item>
        <el-form-item label="新密码">
          <el-input
            class="item-input"
            v-model="state2.newPwd"
            type="password"
          />
        </el-form-item>
        <el-form-item label="请重复密码">
          <el-input
            class="item-input"
            v-model="state2.repeatPwd"
            type="password"
          />
        </el-form-item>
        <el-button type="primary" @click="changePwd"> 保存 </el-button>
      </el-form>
    </div>
  </div>
</template>
<script setup>
import { reactive, onMounted } from 'vue'
const state2 = reactive({
  userName: '',
  originalPwd: '', //原密码
  newPwd: '', //新密码
  repeatPwd: '' // 重复新密码
})
onMounted(() => {
  state2.userName = localStorage.getItem('side')
})
const changePwd = () => {
  console.log('changePwd')
  if (state2.newPwd != state2.repeatPwd) {
    ElMessage.warning('两次密码应该相同!')
    return
  }
  let pwd = '' //从后台获取原密码
  if (state2.originalPwd != pwd) {
    ElMessage.warning('原密码不正确!')
    return
  }
  //设置新密码
}
</script>
<style lang="less" scoped>
.conclusion-plan {
  z-index: 999;
  width: 100%;
  color: #eee;
  border-radius: 4px;
  //backdrop-filter: blur(1px);
  background: none !important;
  .close_sty {
    cursor: pointer;
    position: absolute;
    top: px;
    right: 20px;
    width: 20px;
    height: 20px;
  }
}

.main-user {
  padding-top: 5px;
  padding-right: 10px;
}
:deep(.el-input__inner) {
  font-size: 13px;
  font-weight: 500;
  color: #fff;
  border: none !important;
  text-align: left;
}
:deep(.el-input__wrapper) {
  background-color: #28364d !important;
  border: none !important;
}

:deep(.el-input__wrapper.is-focus) {
  background-color: #28364d !important;
  border: none !important;
  box-shadow: none !important ;
}

:deep(.el-input) {
  --el-input-border-color: none !important;
  --el-input-hover-border: none !important;
  --el-input-focus-border: none !important;
  --el-input-placeholder-color: #fff;
}

:deep(.el-select) {
  --el-select-border-color-hover: none !important;
  --el-select-input-focus-border-color: none !important;
}

:deep(.el-input__wrapper:hover) {
  border: none !important;
  box-shadow: none;
}
:deep(.el-form-item__label) {
  color: #fff;
}
:deep(.el-form-item__content) {
  color: #fff;
  font-weight: 600;
}

:deep .el-button {
  margin-top: 10px;
  width: 150px;
  background: #01abe6;
  color: #ffff;
  border-radius: 5px;
  margin-left: 10px;
  line-height: 33px;
  cursor: pointer;
  border: none !important;
}
</style>
