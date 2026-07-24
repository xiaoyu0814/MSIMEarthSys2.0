<!--
 * @Author: error: error: git config user.name & please set dead value or install git && error: git config user.email & please set dead value or install git & please set dead value or install git
 * @Date: 2023-11-14 12:07:55
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2024-07-02 17:11:12
 * @FilePath: \vue3+js+vite\src\components\adjustControl\components\communication\document.vue
 * @Description: 文电通信页面
-->
<template>
  <div id="document">
    <header ref="document_header">
      <span style="font-size: 16px">文书收发</span>
      <el-icon style="cursor: pointer" @click="closeDocumentBoxs">
        <Close />
      </el-icon>
    </header>
    <ul class="content_box">
      <!-- 联系人列表 -->
      <li class="content_left">
        <h6>通信人列表</h6>
        <ul class="addressBook">
          <li v-for="(item, index) in vueData.addressBook" :key="index">
            <p v-if="item.children.length > 0">{{ item.title }}</p>
            <el-scrollbar max-height="150px">
              <div
                v-if="item.children.length > 0"
                v-for="(children, children_index) in item.children"
                :key="children_index"
              >
                <el-checkbox
                  v-model="children.userInfo.checkbox"
                  @change="getUsers(children)"
                  v-if="children.userInfo.nickName"
                  :label="children.userInfo.nickName"
                />
              </div>
            </el-scrollbar>
          </li>
        </ul>
      </li>
      <!-- 邮箱内容 -->
      <li class="content_right">
        <div style="padding: 10px; color: #333333">
          <el-tabs
            v-model="vueData.tabsName"
            class="demo-tabs"
            @tab-click="changeTabs"
          >
            <div class="search_box">
              <el-input
                v-model="vueData.searchByName"
                style="width: 200px"
                placeholder="请输入文书名称"
                clearable
              />
              <el-button type="primary" @click="_getFileList">查询</el-button>
            </div>
            <el-tab-pane label="草稿箱" name="un_send">
              <el-table
                :data="vueData.tableData_draftBox"
                style="width: 100%"
                height="433"
                show-overflow-tooltip
                @selection-change="selectionTableRow"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="fileName" label="文书名称" />
                <el-table-column prop="ctime" label="创建时间" align="center" />
                <el-table-column label="操作" align="center">
                  <template #default="scope">
                    <el-button
                      link
                      type="primary"
                      size="small"
                      @click.prevent="editRow(scope.row)"
                    >
                      编辑
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="收件箱" name="receive_sucess">
              <el-table
                :data="vueData.tableData_outBox"
                style="width: 100%"
                height="433"
                show-overflow-tooltip
                @selection-change="selectionTableRow"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="fileName" label="文书名称" />
                <el-table-column
                  prop="sendName"
                  label="发送人"
                  align="center"
                />
                <el-table-column
                  prop="receiveTime"
                  label="接收时间"
                  align="center"
                />
                <el-table-column label="操作" align="center">
                  <template #default="scope">
                    <el-button
                      link
                      type="primary"
                      size="small"
                      @click.prevent="editRow(scope.row)"
                    >
                      编辑
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="发件箱" name="send">
              <el-table
                :data="vueData.tableData_inBox"
                style="width: 100%"
                height="433"
                show-overflow-tooltip
                @selection-change="selectionTableRow"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="fileName" label="文书名称" />
                <el-table-column
                  prop="sendTime"
                  label="发送时间"
                  align="center"
                />
                <el-table-column label="操作" align="center">
                  <template #default="scope">
                    <el-button
                      link
                      type="primary"
                      size="small"
                      @click.prevent="editRow(scope.row)"
                    >
                      编辑
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
            <el-tab-pane label="垃圾箱" name="already_del">
              <el-table
                :data="vueData.tableData_garbageBox"
                style="width: 100%"
                height="433"
                show-overflow-tooltip
                @selection-change="selectionTableRow"
              >
                <el-table-column type="selection" width="55" />
                <el-table-column prop="fileName" label="文书名称" />
                <el-table-column
                  prop="delTime"
                  label="删除时间"
                  align="center"
                />
                <el-table-column label="操作" align="center">
                  <template #default="scope">
                    <el-button
                      link
                      type="primary"
                      size="small"
                      @click.prevent="editRow(scope.row)"
                    >
                      编辑
                    </el-button>
                  </template>
                </el-table-column>
              </el-table>
            </el-tab-pane>
          </el-tabs>
        </div>
        <div class="bottom">
          <el-button type="primary" @click="tempMgt">模板管理</el-button>
          <el-button
            type="primary"
            @click="
              ;(vueData.createDoc_visible = true),
                (vueData.docInfo = { id: '', name: '' })
            "
          >
            新建文书
          </el-button>
          <el-button type="primary" @click="_sendFile">发送文书</el-button>
          <el-button type="danger" @click="_deleteFile" class="delBtn"
            >删除文书</el-button
          >
        </div>
      </li>
    </ul>
    <!-- 创建\编辑文书组件 -->
    <createDoc
      v-if="vueData.createDoc_visible"
      :docInfo="vueData.docInfo"
      @closeCreateDocBox="closeCreateDocBox"
      @save="_getFileList"
    ></createDoc>
    <!-- 模板管理页面 -->
    <templateManagement
      v-if="vueData.showTemplateList"
      @closeTemListBox="closeTemListBox"
    ></templateManagement>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue'
import { ElMessage } from 'element-plus'
import { Close } from '@element-plus/icons-vue'
import createDoc from './document/create.vue'
import { getFriendsList } from '@/service/adjustControl/adjustControl'
import {
  getDocumentList,
  deleteFile,
  sendFile
} from '@/service/adjustControl/document'
// import { getFriendsList } from "@/api/adjustControl/adjustControl";
// import drag from "@/utils/dragElement";
import templateManagement from './document/templateManagement.vue'
const emit = defineEmits(['closeDocumentBox'])
const vueData = reactive({
  addressBook: [
    {
      title: '导演部',
      children: []
    },
    {
      title: '红方',
      children: []
    },
    {
      title: '蓝方',
      children: []
    }
  ],
  createDoc_visible: false,
  tabsName: 'un_send',
  tableData_draftBox: [],
  tableData_outBox: [],
  tableData_inBox: [],
  tableData_garbageBox: [],
  docInfo: {
    id: '',
    name: ''
  },
  selectionTableData: [],
  selectList: [],
  fileHeaders: {
    Authorization: sessionStorage.getItem('token')
  },
  showTemplateList: false,
  searchByName: ''
})

const document_header = ref(null)

/**
 * @description: 打开模板管理面板
 * @return {*}
 */
const tempMgt = () => {
  vueData.showTemplateList = true
}

/**
 * @description: 关闭模板管理
 * @return {*}
 */
const closeTemListBox = (val) => {
  vueData.showTemplateList = val
}

onMounted(() => {
  // drag(document_header.value);
  _getFileList()
  _getFriendsList()
})

/**
 * @description 获取文书列表
 */
let _getFileList = () => {
  let params = {
    name: vueData.searchByName,
    type: vueData.tabsName
  }
  getDocumentList(params, vueData.fileHeaders).then((res) => {
    if (res.code == 200) {
      vueData.tableData_draftBox = res.data.un_send
      vueData.tableData_outBox = res.data.receive_sucess
      vueData.tableData_inBox = res.data.send
      vueData.tableData_garbageBox = res.data.already_del
    }
  })
}

/**
 * @description 获取联系人列表
 */
let _getFriendsList = () => {
  let params = sessionStorage.getItem('userId')
  getFriendsList(params, vueData.fileHeaders).then((res) => {
    // console.log(res)
    if (res.code == 200) {
      vueData.addressBook = [
        {
          title: '导演部人员',
          children: []
        },
        {
          title: '模拟器',
          children: []
        },
        {
          title: '红方人员',
          children: []
        },
        {
          title: '橙方人员',
          children: []
        },
        {
          title: '黄方人员',
          children: []
        },
        {
          title: '绿方人员',
          children: []
        },
        {
          title: '青方人员',
          children: []
        },
        {
          title: '蓝方人员',
          children: []
        },
        {
          title: '紫方人员',
          children: []
        }
      ]
      for (let i = 0; i < res.data.length; i++) {
        const element = res.data[i]
        // if (element.relation.status < 3) {
        vueData.addressBook[element.relation.status].children.push(element)
        // }
      }
    }
  })
}

/**
 * @description 批量删除文书
 */
let _deleteFile = () => {
  if (vueData.selectionTableData.length == 0) {
    ElMessage.warning('请选择您要删除的数据！')
    return
  }
  let params = []
  for (let i = 0; i < vueData.selectionTableData.length; i++) {
    const element = vueData.selectionTableData[i]
    params.push(element.id)
  }
  deleteFile(params, vueData.fileHeaders).then((res) => {
    if (res.code == 200) {
      ElMessage.success('删除成功')
      _getFileList()
    } else {
      ElMessage.error('删除失败')
    }
  })
}

/**
 * @description 获取勾选的表格行数据
 * @param { Array } row 表格行数据
 */
let selectionTableRow = (row) => {
  vueData.selectionTableData = row
}

/**
 * @description 打开编辑窗口
 * @param { Object } row 表格行数据
 */
let editRow = (row) => {
  vueData.docInfo = row
  vueData.createDoc_visible = true
}

/**
 * @description 获取勾选的联系人列表
 * @param { String } select 当前勾选的联系人
 */
let getUsers = (select) => {
  let find = vueData.selectList.find((item) => item == select)
  if (!find) {
    vueData.selectList.push(select)
  } else {
    for (let i = 0; i < vueData.selectList.length; i++) {
      const element = vueData.selectList[i]
      if (element.userInfo.id == find.userInfo.id) {
        vueData.selectList.splice(i, 1)
      }
    }
  }
}

/**
 * @description 发送文书
 */
let _sendFile = () => {
  if (vueData.selectList.length == 0) {
    ElMessage.warning('请选择您要发送的联系人！')
    return
  }
  if (vueData.selectionTableData.length == 0) {
    ElMessage.warning('请选择您要发送的文书！')
    return
  }
  let userId = []
  let username = []
  for (let i = 0; i < vueData.selectList.length; i++) {
    const element = vueData.selectList[i]
    userId.push(element.userInfo.id)
    username.push(element.userInfo.nick_name)
  }
  for (let i = 0; i < vueData.selectionTableData.length; i++) {
    const element = vueData.selectionTableData[i]
    let params = {
      fileId: element.fileId,
      rereceiveUserId: userId.join(';'),
      rereceiveUserName: username.join(';')
    }
    sendFile(params, vueData.fileHeaders).then((res) => {
      if (res.code == 200) {
        ElMessage.success('发送成功')
        _getFileList()
      } else {
        ElMessage.error('发送失败')
      }
    })
  }
}

/**
 * @description 切换发件箱、草稿箱等tabs页
 */
let changeTabs = (val) => {
  _getFileList()
}

/**
 * @description 关闭文书窗口
 */
let closeDocumentBoxs = () => {
  emit('closeDocumentBox', false)
}

/**
 * @description 关闭创建\编辑文书窗口
 */
let closeCreateDocBox = () => {
  vueData.createDoc_visible = false
}
</script>

<style lang="less" scoped>
#document {
  position: fixed;
  left: 50%;
  top: 50%;
  width: 822px;
  height: 642px;
  margin-top: -321px;
  margin-left: -411px;
  background-color: rgba(8, 36, 62, 0.7);
  border: 1px solid #44566a;
  color: #ffff;
  // box-shadow: 0 2px 14px 0 #2593ff;
  /* width: 1000px; */
  /* margin-left: -520px; */
  z-index: 20;
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
    display: flex;
    height: calc(100% - 44px);
    margin: 0;
    padding: 0;
    ::v-deep(.content_left::marker) {
      content: '';
    }
    ::v-deep(.content_right::marker) {
      content: '';
    }
    .content_left {
      width: 200px;
      margin: 10px;
      height: calc(100% - 50px);
      margin-top: 0;
      h6 {
        text-align: left;
        font-size: 14px;
        height: 1px;
        // padding: 5px;
      }
      .addressBook {
        background-color: #40a0ff3d;
        height: calc(100% - 69px);
        padding: 0px;
        box-sizing: border-box;
        overflow-y: auto;
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
            font-size: 18px;
          }
        }
      }
    }
    .content_right {
      flex-grow: 1;
      .search_box {
        display: flex;
        padding-bottom: 15px;
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
      }
    }
  }
  .bottom {
    .el-button {
      background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
      width: 90px;
      height: 30px;
      color: #ffff;
      border-radius: 5px;
      margin-left: 10px;
      cursor: pointer;
    }
    .delBtn {
      box-shadow: inset 0px 0px 15px 5px rgba(224, 18, 8, 0.46),
        inset 0px 0px 25px 3px rgba(224, 18, 8, 0.61);
      border: 1px solid #e03608;
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
