<template>
  <div class="editCreateItem">
    <el-form :model="vueData.messageForm" label-width="100px">
      <el-form-item label="计划名称:">
        <el-input v-model="vueData.messageForm.planName" placeholder="" />
      </el-form-item>
      <el-form-item label="模板选择:">
        <el-select
          v-model="vueData.messageForm.templateId"
          @change="documentChange"
          placeholder=""
        >
          <el-option
            v-for="item in vueData.documentList"
            :key="item.id"
            :label="item.documentName"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="文书名称:">
        <el-input v-model="vueData.messageForm.fileName" placeholder="" />
      </el-form-item>
      <el-form-item label="文书内容:">
        <!-- 文书编辑插件 -->
        <div style="height: 130px; overflow: auto">
          <richText
            :content="vueData.messageForm.fileContent"
            @getContent="getContent"
          ></richText>
        </div>
      </el-form-item>
      <el-form-item label="收件人:">
        <el-cascader
          v-model="vueData.messageForm.receiveUserId"
          :options="vueData.addressBook"
          :props="vueData.props"
          clearable
        />
      </el-form-item>
    </el-form>
  </div>
</template>
<script setup>
import { reactive, onMounted, watch } from 'vue'
import emitter from '@/utils/eventbus'
import {
  getDocumentByName,
  readDocumentTwo
} from '@/service/adjustControl/document'
import { getFriendsList } from '@/service/adjustControl/adjustControl'
import richText from '@/components/communication/document/richText'
const emit = defineEmits(['sendCloseEdit'])

const vueData = reactive({
  documentList: [],
  messageForm: {
    planName: '',
    templateId: '',
    fileName: '',
    fileContent: '',
    receiveUserId: ''
  },
  fileHeaders: {
    Authorization: sessionStorage.getItem('token')
  },
  addressBook: [
    {
      name: '导演部',
      children: []
    },
    {
      name: '红方',
      children: []
    },
    {
      name: '蓝方',
      children: []
    }
  ],
  props: {
    children: 'children',
    label: 'name',
    value: 'id',
    emitPath: false
  }
})
/**
 * @description 获取联系人列表
 */
let _getFriendsList = () => {
  let params = sessionStorage.getItem('userId')
  getFriendsList(params, vueData.fileHeaders).then((res) => {
    if (res.code == 200) {
      vueData.addressBook = [
        {
          name: '导演部人员',
          children: []
        },
        {
          name: '模拟器',
          children: []
        },
        {
          name: '红方人员',
          children: []
        },
        {
          name: '橙方人员',
          children: []
        },
        {
          name: '黄方人员',
          children: []
        },
        {
          name: '绿方人员',
          children: []
        },
        {
          name: '青方人员',
          children: []
        },
        {
          name: '蓝方人员',
          children: []
        },
        {
          name: '紫方人员',
          children: []
        }
      ]
      for (let i = 0; i < res.data.length; i++) {
        const element = res.data[i]
        let elementObj = {
          name: element.userInfo.nickName,
          id: element.userInfo.id
        }
        if (elementObj.name) {
          vueData.addressBook[element.relation.status].children.push(elementObj)
        }
      }
    }
    vueData.addressBook.forEach((item) => {
      if (item.children.length == 0) {
        item.disabled = true
      }
    })
  })
}
// 获取文书内容
const getContent = (e) => {
  vueData.messageForm.fileContent = e
}
// 模板类型变化
const documentChange = (val) => {
  // 获取模板名称并赋值
  vueData.documentList.forEach((item) => {
    if (val == item.id) {
      vueData.messageForm.fileName = item.documentName
    }
  })
  // 获取模板内容
  let params = { id: val }
  readDocumentTwo(params, vueData.fileHeaders).then((res) => {
    if (res.code == 200) {
      vueData.messageForm.fileContent = res.data
    } else {
      ElMessage.error('模板内容获取失败')
    }
  })
}
const save = () => {}
const closePanel = () => {
  emit('sendCloseEdit', false)
}
watch(
  () => store.state.sceneModule.planDetail,
  (newVal, oldVal) => {
    if (newVal) {
      if (newVal.type == 'wenDian') {
        vueData.messageForm = newVal.content
      }
    }
  },
  { immediate: true, deep: true }
)
onMounted(() => {
  let params = {}
  getDocumentByName(params, vueData.fileHeaders).then((res) => {
    if (res.code == 200) {
      vueData.documentList = res.data
    }
  })
  _getFriendsList()
})
</script>
<style lang="less" scoped>
.editCreateItem {
  box-sizing: border-box;
  :deep(.el-form-item__label) {
    color: #fff !important;
  }
  :deep(.el-input) {
    .el-input__wrapper {
      border-radius: 5px;
      box-shadow: none;
      background-color: #2b4559 !important;
      box-shadow: 0 0 0 1px #075d89 inset !important;
    }
    .el-input__inner {
      color: #fff !important;
    }
  }
  .el-select {
    width: 100%;
    :deep(.el-select__wrapper) {
      background-color: #2b4559 !important;
      box-shadow: 0 0 0 1px #075d89 inset !important;
    }
  }
  :deep(.el-textarea__inner) {
    height: 90px;
    border-radius: 5px;
    box-shadow: none;
    color: #ffff;
    background-color: #2b4559 !important;
    box-shadow: 0 0 0 1px #075d89 inset !important;
  }
  :deep(.el-select__placeholder) {
    color: #fff;
  }
}
</style>
