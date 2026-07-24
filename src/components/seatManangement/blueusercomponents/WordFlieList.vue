<template>
  <div
    class="prop_config animate__animated animate__backInDown animate__delay-10s"
  >
    <div class="header">
      <span class="header-left">情报下载</span
      ><img src="@/assets/images/rwty/closeBLConfig.svg" @click="closePanel" />
    </div>
    <div>
      <el-table
        :data="vueData.tableData"
        style="width: 100%"
        :header-cell-style="{ 'text-align': 'center' }"
        :cell-style="{ 'text-align': 'center' }"
      >
        <el-table-column prop="fileName" label="名称"></el-table-column>
        <el-table-column prop="distributeTime" label="时间"></el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <!-- <el-button @click="onpreview(scope.row)">预览</el-button> -->
            <el-button @click="onDownload(scope.row)">下载</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="docxRef"></div>
  </div>
</template>
<script setup>
import { reactive, onBeforeMount, onMounted, watch } from 'vue'
// import {renderAsync} from 'docx-preview'
import { useStore } from 'vuex'
import { seatPageList } from './wordflie'

const store = useStore()
const emit = defineEmits(['closeWordList'])
const vueData = reactive({
  tableData: [
    {
      name: 'word',
      time: '2024-10-10 10:00:00'
    }
  ],
  pageNum: 1,
  pageSize: 10
})

onBeforeMount(() => {})

onMounted(() => {
  getDataList()
})

const onpreview = (val) => {
  console.log(val)
  //这里的blob是blob文件流，如果自己的不是blob文件流
  // 可以通过URL.createObjectURL(参数) 参数
  // let blob = new Blob(val.url,{type:'application/word'})
  // let childRef = document.getElementsByClassName('docxRef')
  // renderAsync(blob,childRef[0])
}

const getDataList = () => {
  let param = {
    pageNum: vueData.pageNum,
    pageSize: vueData.pageSize,
    camp:
      window.localStorage.getItem('side') == 'red_zhkz'
        ? 'red'
        : window.localStorage.getItem('side') == 'blue_zhkz'
        ? 'blue'
        : ''
  }
  seatPageList(param).then((res) => {
    console.log(res)
    vueData.tableData = res.data.records
  })
}

// const onDownload = (val) => {

//   var zipName = val.fileName
//   let obj = pathToBlob(val.url)
//   let blob = new Blob([obj])
//   let elink = document.createElement("a")
//   elink.href = window.URL.createObjectURL(blob)
//   elink.download = zipName
//   document.body.appendChild(elink)
//   elink.click()
//   window.URL.revokeObjectURL(elink.href)
//   // document.body.revokeObjectURL(elink)
//   console.log(val)
// }

const onDownload = (val) => {
  let string = String(val.url)
  fetch('http://' + string)
    .then((res) => res.blob())
    .then((blob) => {
      let elink = document.createElement('a')
      elink.href = window.URL.createObjectURL(blob)
      elink.download = val.fileName
      document.body.appendChild(elink)
      elink.click()
      window.URL.revokeObjectURL(elink.href)
      // document.body.revokeObjectURL(elink)
    })
}

const closePanel = () => {
  store.state.sceneModule.toolBarType = !store.state.sceneModule.toolBarType
  emit('closeWordList', store.state.sceneModule.toolBarType)
}
</script>
<style lang="less" scoped>
.prop_config {
  z-index: 1000;
  position: fixed;
  right: calc(50% - 400px);
  top: calc(50% - 270px);
  width: 800px;
  // width: 1000px;
  height: 550px;
  background: rgba(2, 26, 70, 0.88);
  box-shadow: 0 0 25px #1092d5;

  :deep(
      .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell
    ) {
    background-color: #40a0ff3d !important;
  }
  :deep(.el-table) {
    --el-table-border-color: #075d89 !important;
    --el-table-text-color: #ffffff;

    .cellStyle {
      background-color: #2b4559 !important;
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 13px;
      letter-spacing: normal;
    }

    .cellStyle1 {
      background-color: #1c2f42 !important;
      font-family: 'Arial Normal', 'Arial';
      font-weight: 400;
      font-style: normal;
      font-size: 13px;
      letter-spacing: normal;
    }
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 50px;
    padding: 0 15px;
    border-bottom: 1px solid #2671ac66;
    box-sizing: border-box;
    .header-left {
      font-family: 'Arial Negreta', 'Arial Normal', 'Arial';
      font-weight: 700;
      font-style: normal;
      font-size: 19px;
      color: #c2d7ee;
    }
  }

  .prop_content {
    padding: 15px;
    height: calc(100% - 50px);
    box-sizing: border-box;
    display: flex;
    .targetTree {
      width: 25%;
      text-align: left;
      border: 1px solid #2e4b64;
      padding: 2px;
      .electroTree {
        height: 46%;
        margin-top: 10px;
        .title {
          height: 32px;
          line-height: 32px;
          background: #1092d5;
          text-align: left;
          padding-left: 15px;
          font-size: 15px;
          font-weight: bold;
        }
      }
      .filterTree {
        height: 47%;
        .title {
          height: 32px;
          line-height: 32px;
          background: #1092d5;
          text-align: left;
          padding-left: 15px;
          font-size: 15px;
          font-weight: bold;
        }
      }
    }
    .targetProps {
      width: 75%;
      .boxStyle {
        height: 100%;
        width: calc(100% - 15px);
        position: relative;
        border: 1px solid #2e4b64;
        margin-left: 10px;
        padding: 10px;
        box-sizing: border-box;
        p {
          position: absolute;
          left: 10px;
          top: -28px;
          color: #81d3f8;
          font-size: 16px !important;
        }
        .btnList {
          display: flex;
          justify-content: space-around;
        }
        .propsInfo {
          height: calc(100% - 70px);
          .propsHeader {
            height: 40px;
            line-height: 40px;
            text-align: left;
            padding-left: 15px;
            font-size: 15px;
            font-weight: bold;
            color: #fff;
          }
        }
      }
    }
  }
}
.el-select {
  width: 100%;
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
:deep(.el-textarea__inner) {
  background-color: #2b4559 !important;
  box-shadow: 0 0 0 1px #075d89 inset !important;
  color: #fff !important;
}
:deep(.el-form-item__label) {
  color: #fff !important;
}
.el-button {
  background: url(@/assets/images/rwty/llbc-topBtn.svg) 100% 100%;
  width: 50px;
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
:deep(
    .el-table--enable-row-hover .el-table__body tr:hover > td.el-table__cell
  ) {
  background-color: #40a0ff3d !important;
}
:deep(.el-table tr) {
  background-color: #075d89 !important;
}
:deep(.el-table th.el-table__cell.is-leaf) {
  background-color: #06496b !important;
  color: #cccccc;
}
</style>
