<!--
 * @Author: 谢小宇 xiexiaoyu@piesat.cn
 * @Date: 2023-11-15 19:39:05
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2024-06-18 10:17:33
 * @FilePath: \BB\src\components\adjustControl\components\communication\document\create.vue
 * @Description: 编辑\创建文书组件
-->
<template>
  <div id="create">
    <header ref="createDoc_header">
      <span style="font-size: 16px; font-weight: bold">新建文书</span>
      <span style="cursor: pointer" @click="closeCreateBox">X</span>
    </header>
    <div class="content_box">
      <!-- 工具栏 -->
      <ul class="utils_box">
        <!-- 文书模板 -->
        <li>
          <span>模板选择：</span>
          <el-select
            v-model="vueData.docTemplate"
            placeholder=" "
            style="width: 200px"
            @change="_readDocument"
          >
            <el-option
              v-for="item in vueData.docTemplatelist"
              :key="item.id"
              :label="item.documentName"
              :value="item.id"
            />
          </el-select>
        </li>
        <!-- 文书名称 -->
        <li>
          <span>文书名称：</span>
          <el-input v-model="vueData.documentName" style="width: 200px" />
        </li>
        <!-- 保存至 -->
        <li class="saveBtn">
          <el-button type="primary" @click="saveTemp">保存模板</el-button>
          <el-button type="primary" @click="saveDoc">保存草稿</el-button>
        </li>
      </ul>
      <!-- 文书编辑插件 -->
      <richText :content="vueData.content" @getContent="getContent"></richText>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
import { ElMessage } from 'element-plus'
import richText from './richText.vue'
// import drag from "@/utils/dragElement";
import {
  getDocumentByName,
  readDocument,
  readDocumentTwo,
  saveDocument,
  readFile,
  saveFile
} from '@/service/adjustControl/document'

const vueData = reactive({
  content: '',
  docTemplate: '',
  docTemplatelist: [],
  documentName: '',
  fileHeaders: {
    Authorization: sessionStorage.getItem('token')
  }
})

const props = defineProps({
  docInfo: Object
})
const emit = defineEmits(['closeCreateDocBox', 'save'])

const createDoc_header = ref(null)

onMounted(() => {
  // drag(createDoc_header.value);
  _getDocumentByName()
})

onUnmounted(() => {
  props.docInfo = {}
})

const getContent = (e) => {
  vueData.content = e
}

/**
 * @description 获取模板列表
 */
let _getDocumentByName = () => {
  let params = {}
  getDocumentByName(params, vueData.fileHeaders).then((res) => {
    if (res.code == 200) {
      vueData.docTemplatelist = res.data
    } else {
      ElMessage.error('文书模板获取失败')
    }
  })
}

/**
 * @description 读取模板内容
 * @param { String } id 模板id
 */
let _readDocument = (id) => {
  let params = { id }
  readDocumentTwo(params, vueData.fileHeaders).then((res) => {
    if (res.code == 200) {
      vueData.content = res.data
      let _item = vueData.docTemplatelist.find((item) => {
        return item.id == vueData.docTemplate
      })
      vueData.documentName = _item.documentName
    } else {
      ElMessage.error('模板内容获取失败')
    }
  })
}

/**
 * @description 读取文件内容
 * @param { String } id 文件id
 */
let _readFile = (fileId) => {
  let params = { fileId }
  readFile(params, vueData.fileHeaders).then((res) => {
    if (res.code == 200) {
      vueData.content = res.data
    } else {
      ElMessage.error('文书内容获取失败')
    }
  })
}

/**
 * @description 保存到模板列表
 * @return { * }
 */
let saveTemp = () => {
  let params = {
    content: vueData.content,
    fileName: vueData.documentName,
    id: vueData.docTemplate
  }
  // console.log(vueData.content)
  saveDocument(params, vueData.fileHeaders).then((res) => {
    if (res.code == 200) {
      ElMessage.success('保存成功')
      emit('save', true)
      emit('closeCreateDocBox', false)
    } else {
      ElMessage.error('保存失败')
    }
  })
}

/**
 * @description 保存到草稿箱
 * @return {*}
 */
let saveDoc = () => {
  let params = {
    computerconfigId: sessionStorage.getItem('roomId'),
    content: vueData.content,
    fileName: vueData.documentName,
    taskId: sessionStorage.getItem('taskId')
  }
  saveFile(params, vueData.fileHeaders).then((res) => {
    if (res.code == 200) {
      ElMessage.success('保存成功')
      emit('save', true)
      emit('closeCreateDocBox', false)
    } else {
      ElMessage.error('保存失败')
    }
  })
}

/**
 * @description 关闭窗口
 */
let closeCreateBox = () => {
  emit('closeCreateDocBox', false)
}

watch(
  () => props.docInfo,
  async (nVal) => {
    vueData.documentName = nVal.fileName
    if (nVal.fileId) {
      _readFile(nVal.fileId)
    }
  },
  { immediate: true, deep: true }
)
</script>

<style lang="less" scoped>
#create {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 1000px;
  height: 550px;
  margin-top: -255px;
  margin-left: -500px;
  background-color: #2b4559;
  z-index: 10;
  // border: 1px solid #44566A;
  // box-shadow: 0 2px 14px 0 #2593ff;
  /* width: 1000px; */
  /* margin-left: -520px; */
  header {
    width: 100%;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-bottom: 1px solid #44566a;
    box-sizing: border-box;
  }
  .content_box {
    padding: 10px;
    .utils_box {
      display: flex;
      align-items: center;
      justify-content: space-between;
      // padding: 20px;
      padding-bottom: 10px;
      .saveBtn {
        .el-button {
          background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
          width: 90px;
          height: 30px;
          color: #ffff;
          border-radius: 5px;
          margin-left: 10px;
          cursor: pointer;
        }
      }
    }
  }
}
</style>
