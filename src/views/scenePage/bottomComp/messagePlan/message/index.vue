<template>
  <div class="message_config">
    <div class="message_content">
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
      <div class="time-box">
        <el-checkbox v-model="vueData.elect.checked" label="执行时间" />
        <el-date-picker
          v-if="vueData.elect.checked"
          v-model="vueData.elect.time"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="选择执行时间"
        />
      </div>
    </div>
    <div class="message_footer">
      <el-button
        type="primary"
        :disabled="vueData.elect.checked"
        @click="save('立即执行')"
        >立即执行</el-button
      >
      <el-button
        type="primary"
        @click="save('保存')"
        :disabled="!vueData.elect.checked"
        >保存</el-button
      >
      <el-button @click="closePanel" class="concelBtn">取消</el-button>
    </div>
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
import { wenDian } from '@/service/directingAdjusting'
import store from '@/store/index'
const vueData = reactive({
  documentList: [],
  messageForm: {
    planName: '',
    templateId: '',
    fileName: '',
    fileContent: '',
    receiveUserId: ''
  },
  elect: {
    checked: false,
    time: ''
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
// 保存
const save = (btnType) => {
  let runSeconds = null
  if (btnType == '保存') {
    if (!vueData.elect.time) {
      ElMessage.warning('请选择执行时间！')
      return
    } else {
      let runTime = new Date(vueData.elect.time).getTime()
      let msgMessionTime = new Date(
        store.state.sceneModule.msgMessionTime
      ).getTime()
      if (runTime && msgMessionTime) {
        runSeconds = Math.floor((msgMessionTime - runTime) / 1000)
      }
    }
  } else if (vueData.btnType == '立即执行') {
    runSeconds = null
  }
  let params = vueData.messageForm
  params.runSeconds = runSeconds
  wenDian(params).then((res) => {
    if (res && res.code == 200) {
      ElMessage.success(res.data)
      emitter.emit('closeCreatePlan', false)
    } else {
      ElMessage.error('网络错误！')
    }
  })
}
// 关闭
const closePanel = () => {
  emitter.emit('closeCreatePlan', false)
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
.message_config {
  padding: 20px 20px 0 0;
  box-sizing: border-box;
  .message_content {
    height: 430px;
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
    .time-box {
      display: flex;
      flex-direction: column;
      padding-left: 20%;
      :deep(.el-checkbox) {
        color: #fff !important;
      }
    }
    .addressBook {
      background-color: #40a0ff3d;
      height: 100px;
      padding: 0px;
      box-sizing: border-box;
      overflow-y: auto;
      display: flex;
      ::v-deep(li::marker) {
        content: '';
      }
      li {
        text-align: left;
        padding-left: 20px;
        div {
          padding-left: 10px;
        }
        p {
          text-align: left;
        }
      }
    }
  }
  .message_footer {
    display: flex;
    justify-content: flex-end;
    .el-button {
      background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
      width: 80px;
      height: 30px;
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
    .concelBtn {
      background: #fff !important;
      color: black;
    }
  }
}
</style>
