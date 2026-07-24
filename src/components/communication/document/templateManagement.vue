<!--
 * @Author: xujiajia xujiajia@piesat.cn
 * @Date: 2024-06-14 10:49:19
 * @LastEditors: xujiajia xujiajia@piesat.cn
 * @LastEditTime: 2024-06-18 16:47:46
 * @FilePath: \MSIMEarthSysN\src\components\communication\document\templateManagement.vue
 * @Description: 模板管理
-->
<template>
  <div class="templateManagement">
    <header>
      <span class="title">模板管理</span>
      <img
        src="@/assets/image/panelIcons/关闭icon.png"
        alt=""
        class="close_sty"
        @click="closeCreateBox"
      />
    </header>
    <div class="content">
      <div class="search_create">
        <span
          ><el-input
            v-model="vueData.searchByName"
            style="width: 200px"
            placeholder="请输入模板名称"
            :prefix-icon="Search"
          />
          <el-button
            type="primary"
            :icon="Search"
            @click="_getTemplateListByName"
            >查询</el-button
          >
        </span>
        <el-upload
          ref="uploadRef"
          class="upload-demo"
          :action="vueData.uploadUrl"
          :show-file-list="false"
          :auto-upload="true"
          :headers="vueData.fileHeaders"
          :on-success="handleSuccess"
        >
          <template #trigger>
            <li class="right-item">
              <img src="@/assets/images/xdbj/dr.svg" />
              <span>导入</span>
            </li>
          </template>
        </el-upload>
      </div>
      <el-table
        :data="
          vueData.templateList.slice(
            (vueData.pageNum - 1) * vueData.pageSize,
            vueData.pageNum * vueData.pageSize
          )
        "
        style="width: 100%"
        show-overflow-tooltip
        :header-cell-style="{ color: ' #FFFFFF' }"
        max-height="440px"
      >
        <el-table-column type="index" label="序号" width="70" align="center" />
        <el-table-column prop="documentName" label="模板名称" align="center" />
        <el-table-column prop="creator" label="创建者" align="center" />
        <el-table-column prop="ctime" label="创建时间" align="center" />
        <el-table-column prop="path" label="路径" align="center" />
        <el-table-column label="操作" width="150" align="center">
          <template #default="scope">
            <el-button
              size="small"
              type="primary"
              link
              @click="editRow(scope.row)"
            >
              编辑
            </el-button>
            <el-button
              size="small"
              type="danger"
              link
              @click="deleteDocument(scope.row)"
            >
              删除
            </el-button>
            <el-button
              size="small"
              type="primary"
              link
              @click="showTemplateContents(scope.row)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <selfPage
        class="page_box"
        :currentPage="vueData.pageNum"
        :pageSize="vueData.pageSize"
        :total="vueData.total"
        @handleSizeChange="changePageSize"
        @handleCurrentChange="changePageNum"
      ></selfPage>
      <showTemplateContent
        v-if="vueData.isShowContent"
        :currentRow="vueData.currentRow"
        :editOrshow="vueData.editOrshow"
        @closeShowContentBox="closeShowContentBox"
        @save="_getDocumentByName"
      ></showTemplateContent>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, onUnmounted, watch } from 'vue'
const uploadRef = ref(null)
import {
  getDocumentByName,
  delDocument
} from '@/service/adjustControl/document'
import { URL_CJ } from '@/service/request/config'
import { Plus, Search } from '@element-plus/icons-vue'
import selfPage from '@/components/page.vue'
import showTemplateContent from './showTemplateContent.vue'
const emit = defineEmits(['closeTemListBox'])

let vueData = reactive({
  templateList: [],
  fileHeaders: {
    Authorization: sessionStorage.getItem('token')
  },
  searchByName: '',
  pageNum: 1,
  pageSize: 10,
  total: 100,
  isShowContent: false,
  currentRow: {},
  editOrshow: 'show',
  uploadUrl: null
})

/**
 * @description: 关闭模板管理弹框
 * @return {*}
 */
const closeCreateBox = () => {
  emit('closeTemListBox', false)
}

/**
 * @description: 根据名称搜索
 * @return {*}
 */
const _getTemplateListByName = (val) => {
  _getDocumentByName()
}

/**
 * @description 导入模板成功回调
 */
const handleSuccess = (res, file) => {
  console.log('导入模板', res)
  if (res.code == 200) {
    ElMessage.success(res.data)
    _getDocumentByName()
  } else {
    ElMessage.error('上传失败，请稍后重试！')
  }
}

/**
 * @description: 关闭查看详情
 * @return {*}
 */

const closeShowContentBox = (val) => {
  vueData.isShowContent = val
}

/**
 * @description 获取模板列表
 */
let _getDocumentByName = () => {
  let params = {
    name: vueData.searchByName
  }
  getDocumentByName(params, vueData.fileHeaders).then((res) => {
    if (res.code == 200) {
      vueData.templateList = res.data
      vueData.total = res.data.length
    } else {
      ElMessage.error('文书模板获取失败')
    }
  })
}

/**
 * @description: 查看模板详情
 * @return {*}
 */

const showTemplateContents = (row) => {
  vueData.isShowContent = true
  vueData.editOrshow = 'show'
  vueData.currentRow = row
}

/**
 * @description: 查看模板详情
 * @return {*}
 */
const editRow = (row) => {
  vueData.isShowContent = true
  vueData.editOrshow = 'edit'
  vueData.currentRow = row
}

/**
 * @description: 分页器事件
 * @return {*}
 */
const changePageSize = (pageSize) => {
  vueData.pageSize = pageSize
}
const changePageNum = (pageNum) => {
  vueData.pageNum = pageNum
}

/**
 * @description: 删除模板
 * @return {*}
 */
const deleteDocument = (row) => {
  console.log('删除点击', row)
  ElMessageBox.confirm('确定删除选中的数据吗?', '提示', {
    confirmButtonText: '确定',
    cancelButtonText: '取消',
    type: 'warning'
  })
    .then(() => {
      let params = {
        id: row.id
      }
      delDocument(params).then((res) => {
        if (res.code == 200) {
          ElMessage.success(res.data)
          _getDocumentByName()
        } else {
          ElMessage.warning(res.data) ||
            ElMessage.warning('网络错误，请稍后再试！')
        }
      })
    })
    .catch(() => {
      ElMessage.info('取消删除')
    })
}

onMounted(() => {
  _getDocumentByName()
  vueData.uploadUrl = `${URL_CJ}/hierarchyPlatform/documentTemplate/v1/uploadDocument`
})
</script>

<style lang="less" scoped>
.templateManagement {
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
    // 表格
    ::v-deep .el-table td.el-table__cell,
    ::v-deep .el-table th.el-table__cell.is-leaf,
    ::v-deep .el-table__body-wrapper {
      background: #2b4559 !important;
      color: #a3a6ad;
    }
    .el-table {
      --el-table-border-color: #075d89;
    }
    box-sizing: border-box;
    .search_create {
      display: flex;
      align-items: center;
      justify-content: space-between;
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
      .right-item {
        width: 83px;
        height: 33px;
        margin-left: 10px;
        background-image: url(@/assets/images/xdbj/big-bg.svg);
        background-size: 100% 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;

        span {
          color: #ffff;
          padding-left: 5px;
        }
        span:hover {
          padding-left: 5px;
          color: #a5a4b5;
          cursor: pointer;
        }
      }
    }
    // 分页器
    .page_box {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      padding-top: 15px;
      position: absolute;
      bottom: 15px;
      right: 25px;
      :deep(.el-pagination) {
        justify-content: flex-end;
      }
    }
  }
}
</style>
