<!--
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2024-06-17 15:58:12
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2024-06-18 10:56:36
 * @FilePath: \MSIMEarthSysN\src\components\communication\document\showTemplateContent.vue
 * @Description: 查看（编辑）模板详情
-->
<template>
  <div class="showTemplateContent">
    <header>
      <span class="title" v-if="props.editOrshow == 'show'">查看详情</span>
      <span class="title" v-else> 编辑模板 </span>
      <img
        src="@/assets/image/panelIcons/关闭icon.png"
        alt=""
        class="close_sty"
        @click="closeDocumentBox"
      />
    </header>
    <div class="content">
      <div class="name">
        <span>模板名称：</span>
        <el-input
          v-model="vueData.documentName"
          style="width: 200px"
          v-if="props.editOrshow == 'edit'"
        />
        <span v-else>{{ vueData.documentName }}</span>
      </div>
      <!-- 文书编辑插件 -->
      <richText :content="vueData.content" @getContent="getContent"></richText>
      <div class="footer">
        <el-button
          type="primary"
          @click="save_document"
          v-if="props.editOrshow == 'edit'"
          >保存</el-button
        >
        <el-button type="primary" @click="closeDocumentBox">关闭</el-button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import richText from './richText.vue'
import { readDocumentTwo, saveDocument } from '@/service/adjustControl/document'
let vueData = reactive({
  content: '',
  documentName: ''
})

const props = defineProps({
  currentRow: {
    type: Object,
    default: ''
  },
  editOrshow: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['closeShowContentBox', 'save'])

/**
 * @description: 关闭模板管理弹框
 * @return {*}
 */
const closeDocumentBox = () => {
  emit('closeShowContentBox', false)
}

/**
 * @description: 保存模板
 * @return {*}
 */
const save_document = () => {
  let params = {
    id: props.currentRow.id,
    fileName: vueData.documentName,
    content: vueData.content
  }
  saveDocument(params).then((res) => {
    if (res.code == 200) {
      ElMessage.success('保存成功')
      emit('save', true)
      emit('closeShowContentBox', false)
    } else {
      ElMessage.error('保存失败')
    }
  })
}

/**
 * @description: 查看模板内容
 * @return {*}
 */
const getTemplateContent = () => {
  let params = {
    id: props.currentRow.id
  }
  readDocumentTwo(params).then((res) => {
    if (res.code == 200) {
      vueData.content = res.data
    } else {
      ElMessage.error('文书内容获取失败，请重试！')
    }
  })
}

/**
 * @description: 获取文书插件内容
 * @return {*}
 */
const getContent = (e) => {
  vueData.content = e
}
onMounted(() => {
  console.log('currentRow', props.currentRow)
  vueData.documentName = props.currentRow.documentName
  getTemplateContent()
})
</script>

<style lang="less" scoped>
.showTemplateContent {
  position: fixed;
  width: 1000px;
  height: 600px;
  left: calc(50% - 500px);
  top: calc(50% - 300px);
  background-color: rgba(8, 36, 62);
  border: 1px solid #44566a;
  z-index: 10;
  header {
    width: 100%;
    line-height: 45px;
    padding: 0 15px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #44566a;
    box-sizing: border-box;
    .title {
      font-size: 16px;
    }
    .close_sty {
      cursor: pointer;
    }
  }
  .content {
    height: calc(100% - 45px);
    padding: 15px;
    box-sizing: border-box;
    .name {
      width: 100%;
      text-align: left;
      padding-bottom: 20px;
      span {
        font-size: 15px;
        vertical-align: middle;
      }
    }
    .footer {
      padding-top: 20px;
    }
  }
}
:deep(.el-input__wrapper) {
  background-color: #2b4559 !important;
  box-shadow: 0 0 0 1px #075d89 inset;
  .el-input__inner {
    color: #ffffff;
  }
}
.el-button {
  background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
  width: 80px;
  height: 30px;
  color: #ffff;
  border-radius: 5px;
  margin-left: 10px;
  cursor: pointer;
}
</style>
